// Steam store purchase history (store.steampowered.com/account/history): the only place where
// in-game purchases (case keys, terminal items) are recorded with the amount paid.
// Read with the user's own store session via GM_xmlhttpRequest (cookies of store.steampowered.com).
import * as store from '../core/store.js';
import * as ui from '../core/ui.js';
import * as steam from '../core/steam.js';
import { parsePrice } from '../core/util.js';
import { L } from '../core/i18n.js';

const KEY = 'storeHist';
const URL0 = 'https://store.steampowered.com/account/history/?l=english';

function gmReq(opts) {
  return new Promise((resolve, reject) => {
    if (typeof GM_xmlhttpRequest !== 'function') return reject(new Error(L('storehist.gmXmlhttprequestUnavailable')));
    GM_xmlhttpRequest({
      timeout: 30000,
      ...opts,
      onload: (r) => (r.status >= 400 ? reject(new steam.HttpError(r.status)) : resolve(r)),
      onerror: () => reject(new Error(L('storehist.networkError'))),
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
  if (!/wallet_history_table|wallet_table_row/.test(html)) throw new Error(L('storehist.iCantSeeThePurchase'));
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
  mem = null;
  return uniq;
}

export const isCS = (x) => /counter-strike/i.test(x.items) && /in-game|purchase|w grze|zakup/i.test(x.type) && !x.refund;
// kept in memory: every case opening asks about its day (a copy of the whole history from GM storage each time);
// re-read after 30 s, another tab may have synced
let mem = null, memAt = 0;
const data = () => (mem && Date.now() - memAt < 30000 ? mem : ((memAt = Date.now()), (mem = store.get(KEY, { rows: [], at: 0 }))));
export const all = () => data().rows || [];
export const syncedAt = () => data().at || 0;

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
// conv(amount, cur, t): a row's amount in its own currency ('EUR', 'USD'…) → the wallet currency on that day (NBP),
// null when it can't be converted. Without it the row's number is used as is: in 2014-15 this account paid for keys in
// euro, and 1,99 € was taken as 1,99 zł (a key cost ~8,50 zł then). Every price below goes through it.
const amountOf = (x, conv) => (conv ? conv(x.total, x.cur, x.t) : x.total);

export function keyPaid(ts, used, expect, conv = null) {
  const amt = (x) => amountOf(x, conv);
  const day = onDay(ts).filter((x) => !used.has(x.id) && amt(x) != null);
  const order = (a, b) => (sameDay(b.t, ts) - sameDay(a.t, ts)) || Math.abs(a.t - ts) - Math.abs(b.t - ts);
  const named = day.filter(isKeyRow).sort(order)[0];
  if (named) {
    const qty = Number(named.items.match(/(\d+)\s*x\b/i)?.[1]) || (expect ? Math.max(1, Math.round(amt(named) / expect)) : 1);
    if (qty <= 1) used.add(named.id);
    return { price: Math.round(amt(named) / qty), row: named, how: 'nazwa' };
  }
  if (!expect) return null;
  const near = (x) => amt(x) >= expect * 0.8 && amt(x) <= expect * 1.2;
  const single = day.filter(near).sort(order)[0];
  if (single) { used.add(single.id); return { price: amt(single), row: single, how: 'kwota' }; }
  // several keys in one purchase
  const multi = day.find((x) => { const q = Math.round(amt(x) / expect); return q >= 2 && q <= 20 && Math.abs(amt(x) / q - expect) <= expect * 0.2; });
  if (multi) return { price: Math.round(amt(multi) / Math.round(amt(multi) / expect)), row: multi, how: 'kwota' };
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
export function terminalPaid(ts, itemName, used, keyExpect, conv = null) {
  const cands = onDay(ts).filter((x) => !isKeyRow(x) && !used.has(x.id) && amountOf(x, conv) != null);
  // the store lists the item in your Steam language ("USP-S | Cichy wystrzał (prosto z fabryki)"), the inventory
  // history in English ("USP-S | Silent Shot") → skin name first, else the weapon name (same in every language)
  const [weapon, skin] = (itemName || '').toLowerCase().split('|').map((p) => p.trim());
  const has = (x, w) => w && x.items.toLowerCase().includes(w);
  const byName = cands.find((x) => has(x, skin) && has(x, weapon)) || cands.find((x) => has(x, weapon + ' |'));
  // a key-priced row last (it is more likely a key); compared in the wallet currency
  const keyish = (x) => !!keyExpect && amountOf(x, conv) >= keyExpect * 0.8 && amountOf(x, conv) <= keyExpect * 1.2;
  const order = (a, b) => (keyish(a) - keyish(b)) || (sameDay(b.t, ts) - sameDay(a.t, ts)) || Math.abs(a.t - ts) - Math.abs(b.t - ts);
  const pick = byName || cands.sort(order)[0];
  if (!pick) return null;
  used.add(pick.id);
  return { price: amountOf(pick, conv), row: pick };
}

/**
 * what an item bought in the Steam store (any game, e.g. a Rust skin from the item store) cost: the purchase from that
 * day (±1) whose items name it (the history is read in English, like the item's market name), its amount converted to
 * the wallet currency by `conv` (see amountOf). → { price (cents, per copy), row } or null when no such purchase is listed.
 */
export function itemPaid(ts, name, conv = null) {
  const n = String(name || '').toLowerCase().replace(/\s*\([^)]*\)\s*$/, '').trim();
  if (!n) return null;
  const d = new Date(ts); d.setHours(12, 0, 0, 0);
  const row = all().filter((x) => !x.refund && Math.abs(x.t - d.getTime()) <= 86400000 + 1 && x.items.toLowerCase().includes(n) && amountOf(x, conv) != null)
    .sort((a, b) => Math.abs(a.t - ts) - Math.abs(b.t - ts))[0];
  if (!row) return null;
  const qty = Number(row.items.match(/(\d+)\s*x\b/i)?.[1]) || 1;
  return { price: Math.round(amountOf(row, conv) / qty), row };
}

export async function ensure(onDone) {
  if (Date.now() - syncedAt() < 3600000) return;
  try {
    const rows = await sync();
    ui.log(L('storehist.steamPurchaseHistoryEntriesCs2', { rows: rows.length, isCS: rows.filter(isCS).length }), 'ok');
    onDone?.();
  } catch (e) {
    store.set(KEY, { ...store.get(KEY, { rows: [] }), at: Date.now() - 3000000 }); // retry in ~10 min
    mem = null;
    ui.log(L('storehist.steamPurchaseHistory') + e.message, 'warn');
  }
}
