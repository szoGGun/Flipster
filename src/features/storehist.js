// Steam store purchase history (store.steampowered.com/account/history): the only place where
// in-game purchases (case keys, terminal items) are recorded with the amount paid.
// Read with the user's own store session via GM_xmlhttpRequest (cookies of store.steampowered.com).
import * as store from '../core/store.js';
import * as ui from '../core/ui.js';
import * as steam from '../core/steam.js';
import { parsePrice } from '../core/util.js';

const KEY = 'storeHist';
const URL0 = 'https://store.steampowered.com/account/history/?l=english';

function gmReq(opts) {
  return new Promise((resolve, reject) => {
    if (typeof GM_xmlhttpRequest !== 'function') return reject(new Error('GM_xmlhttpRequest niedostępne'));
    GM_xmlhttpRequest({
      timeout: 30000,
      ...opts,
      onload: (r) => (r.status >= 400 ? reject(new steam.HttpError(r.status)) : resolve(r)),
      onerror: () => reject(new Error('Błąd sieci')),
      ontimeout: () => reject(new Error('Timeout')),
    });
  });
}

const MON = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
/** "13 Nov, 2026" / "Nov 13, 2026" → local noon of that day (Steam shows no time) */
function parseDay(s) {
  const m = s.match(/(\d{1,2})\s+([A-Za-z]{3})[a-z]*,?\s+(\d{4})/) || s.match(/([A-Za-z]{3})[a-z]*\s+(\d{1,2}),?\s+(\d{4})/);
  if (!m) return null;
  const [d, mo, y] = /\d/.test(m[1]) ? [m[1], m[2], m[3]] : [m[2], m[1], m[3]];
  const mi = MON[mo.toLowerCase()];
  return mi == null ? null : new Date(+y, mi, +d, 12).getTime();
}

export function parseRows(html) {
  const doc = new DOMParser().parseFromString(`<table>${html}</table>`, 'text/html');
  const out = [];
  for (const r of doc.querySelectorAll('.wallet_table_row')) {
    const txt = (sel) => r.querySelector(sel)?.textContent.replace(/\s+/g, ' ').trim() || '';
    const t = parseDay(txt('.wht_date'));
    const itemsEl = r.querySelector('.wht_items');
    const lines = itemsEl ? [...itemsEl.querySelectorAll('div, a')].map((x) => x.textContent.replace(/\s+/g, ' ').trim()).filter(Boolean) : [];
    const items = txt('.wht_items');
    const type = txt('.wht_type');
    const totalTxt = txt('.wht_total');
    const total = parsePrice(totalTxt.replace(/[^\d.,-]/g, ''));
    const cur = /zł|pln/i.test(totalTxt) ? 'PLN' : /€|eur/i.test(totalTxt) ? 'EUR' : /\$|usd/i.test(totalTxt) ? 'USD' : /£/.test(totalTxt) ? 'GBP' : null;
    if (!t || isNaN(total)) continue;
    out.push({ id: `${t}|${items}|${type}|${total}`, t, items, lines, type, total, cur, refund: /refund/i.test(type) });
  }
  return out;
}

/** fetch the whole history (first page + "load more" pages) */
export async function sync({ onProgress = () => {} } = {}) {
  const r = await gmReq({ method: 'GET', url: URL0 });
  const html = r.responseText;
  if (!/wallet_history_table|wallet_table_row/.test(html)) throw new Error('Nie widzę historii zakupów, zaloguj się na store.steampowered.com w tej przeglądarce');
  const sessionid = html.match(/g_sessionID\s*=\s*"([^"]+)"/)?.[1];
  let rows = parseRows(html.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/)?.[1] || html);
  let cursor = (() => { try { return JSON.parse(html.match(/g_historyCursor\s*=\s*(\{[^;]*\})/)?.[1] || 'null'); } catch { return null; } })();
  let pages = 1;
  while (cursor && sessionid && pages < 60) {
    const body = new URLSearchParams({ sessionid, l: 'english' });
    for (const [k, v] of Object.entries(cursor)) body.set(`cursor[${k}]`, v);
    const res = await gmReq({ method: 'POST', url: 'https://store.steampowered.com/account/AjaxLoadMoreHistory/?l=english', headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }, data: body.toString() });
    let d;
    try { d = JSON.parse(res.responseText); } catch { break; }
    if (!d?.html) break;
    rows.push(...parseRows(d.html));
    cursor = d.cursor || null;
    pages++;
    onProgress(rows.length);
  }
  const uniq = [...new Map(rows.map((x) => [x.id, x])).values()];
  store.set(KEY, { at: Date.now(), rows: uniq });
  return uniq;
}

export const isCS = (x) => /counter-strike/i.test(x.items) && /in-game|purchase|w grze|zakup/i.test(x.type) && !x.refund;
export const all = () => store.get(KEY, { rows: [] }).rows;
export const syncedAt = () => store.get(KEY, { at: 0 }).at;

/** CS2 in-game purchases on the calendar day of ts (±1 day for timezone edges) */
export function onDay(ts) {
  const d = new Date(ts); d.setHours(12, 0, 0, 0);
  return all().filter((x) => isCS(x) && Math.abs(x.t - d.getTime()) <= 86400000 + 1);
}

const sameDay = (a, b) => new Date(a).toDateString() === new Date(b).toDateString();
const nearKey = (x, expect) => expect && x.total >= expect * 0.8 && x.total <= expect * 1.2;
const isKeyRow = (x) => /\bkeys?\b|klucz/i.test(x.items);

/**
 * one key's price paid in the store around ts.
 * 1) a row that names a key; 2) Steam often lists in-game purchases only as "Counter-Strike 2" → a CS2 purchase
 *    from that day whose amount is a key price (±20% of `expect`, i.e. 2.49 USD in your currency), or a multiple of it.
 */
export function keyPaid(ts, used, expect) {
  const day = onDay(ts).filter((x) => !used.has(x.id));
  const order = (a, b) => (sameDay(b.t, ts) - sameDay(a.t, ts)) || Math.abs(a.t - ts) - Math.abs(b.t - ts);
  const named = day.filter(isKeyRow).sort(order)[0];
  if (named) {
    const qty = Number(named.items.match(/(\d+)\s*x\b/i)?.[1]) || (expect ? Math.max(1, Math.round(named.total / expect)) : 1);
    if (qty <= 1) used.add(named.id);
    return { price: Math.round(named.total / qty), row: named, how: 'nazwa' };
  }
  if (!expect) return null;
  const single = day.filter((x) => nearKey(x, expect)).sort(order)[0];
  if (single) { used.add(single.id); return { price: single.total, row: single, how: 'kwota' }; }
  // several keys in one purchase
  const multi = day.find((x) => { const q = Math.round(x.total / expect); return q >= 2 && q <= 20 && Math.abs(x.total / q - expect) <= expect * 0.2; });
  if (multi) return { price: Math.round(multi.total / Math.round(multi.total / expect)), row: multi, how: 'kwota' };
  return null;
}

/** all identified key purchases (price of one key) */
export function keyPurchases(expectAt) {
  return all().filter((x) => isCS(x) && (isKeyRow(x) || (expectAt && nearKey(x, expectAt(x.t))))).map((x) => {
    const e = expectAt?.(x.t);
    const qty = Number(x.items.match(/(\d+)\s*x\b/i)?.[1]) || (e ? Math.max(1, Math.round(x.total / e)) : 1);
    return { t: x.t, price: Math.round(x.total / qty), cur: x.cur };
  });
}
/** price of the key you bought closest in time to ts, in the wallet currency */
export function nearestKeyPrice(ts, walletCur, expectAt) {
  const list = keyPurchases(expectAt).filter((k) => !walletCur || !k.cur || k.cur === walletCur);
  if (!list.length) return null;
  return list.sort((a, b) => Math.abs(a.t - ts) - Math.abs(b.t - ts))[0];
}

/** terminal purchase around ts: a CS2 in-game purchase that isn't a key; name match first, key-priced rows last */
export function terminalPaid(ts, itemName, used, keyExpect) {
  const cands = onDay(ts).filter((x) => !isKeyRow(x) && !used.has(x.id));
  // the store lists the item in your Steam language ("USP-S | Cichy wystrzał (prosto z fabryki)"), the inventory
  // history in English ("USP-S | Silent Shot") → skin name first, else the weapon name (same in every language)
  const [weapon, skin] = (itemName || '').toLowerCase().split('|').map((p) => p.trim());
  const has = (x, w) => w && x.items.toLowerCase().includes(w);
  const byName = cands.find((x) => has(x, skin) && has(x, weapon)) || cands.find((x) => has(x, weapon + ' |'));
  const order = (a, b) => (nearKey(a, keyExpect) - nearKey(b, keyExpect)) || (sameDay(b.t, ts) - sameDay(a.t, ts)) || Math.abs(a.t - ts) - Math.abs(b.t - ts);
  const pick = byName || cands.sort(order)[0];
  if (!pick) return null;
  used.add(pick.id);
  return { price: pick.total, row: pick };
}

export async function ensure(onDone) {
  if (Date.now() - syncedAt() < 3600000) return;
  try {
    const rows = await sync();
    ui.log(`Historia zakupów Steam: ${rows.length} pozycji (${rows.filter(isCS).length} zakupów w CS2).`, 'ok');
    onDone?.();
  } catch (e) {
    store.set(KEY, { ...store.get(KEY, { rows: [] }), at: Date.now() - 3000000 }); // retry in ~10 min
    ui.log('Historia zakupów Steam: ' + e.message, 'warn');
  }
}
