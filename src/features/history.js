import * as ui from '../core/ui.js';
import { profitChart } from '../core/pricechart.js';
import { monthsHtml } from './monthstable.js';
import * as steam from '../core/steam.js';
import * as prices from '../core/prices.js';
import * as store from '../core/store.js';
import { token } from '../core/jobs.js';
import { fifoPnL, inventoryMoves, tradeYearFixes, wholeHistory, parseMyHistoryHtml } from '../core/analysis.js';
import { esc, pct, toInput, timeAgo, parsePrice, matchSearch, lockUntil, displayName, downloadText } from '../core/util.js';
import * as ih from './invhistory.js';
import * as sh from './storehist.js';
import { focusItem } from './inventory.js';
import { baseName } from '../core/patterns.js';
import { patternFor, patternChip } from './patternmark.js';
import * as patterndb from './patterndb.js';
import { L, locale } from '../core/i18n.js';

/** the event kinds are stored as Polish codes (they are data); this is how they read to you */
const kindName = (k) => ({ wymiana: L('history.trade'), rynek: L('history.market'), skrzynia: L('history.case'), kontrakt: L('history.contract'), naklejka: L('history.sticker'), otrzymane: L('history.received'), inne: L('history.other') }[k] || k);

let el;
let task;
let period = 0; // days, 0 = whole history (remembered in GM 'histPeriod')
let game = 'all'; // which games count in the transactions and the summary: all / 730 (CS2) / 753 (Steam items) / other ('histGame')
const sort = ui.sorter('result');
const txSort = ui.sorter('t');
let view = store.get('histView', 'tx'); // 'tx' = list of transactions, 'item' = grouped per item
const PER_PAGE = 50;
const pages = { tx: 0, ih: 0, cs: 0 };
/** rows of the current page (page clamped to the list) */
function pageOf(key, list) {
  const n = Math.max(1, Math.ceil(list.length / PER_PAGE));
  pages[key] = Math.min(pages[key], n - 1);
  return list.slice(pages[key] * PER_PAGE, (pages[key] + 1) * PER_PAGE);
}
/** pager under a table: « ‹ 1 2 … 9 › » */
function renderPager(key, total) {
  const box = el.querySelector('#' + key + '-pg');
  if (!box) return;
  const n = Math.ceil(total / PER_PAGE);
  if (n <= 1) { box.innerHTML = ''; return; }
  const p = pages[key];
  const nums = [...new Set([0, 1, p - 2, p - 1, p, p + 1, p + 2, n - 2, n - 1])].filter((i) => i >= 0 && i < n).sort((a, b) => a - b);
  let html = `<button class="b" data-pg="${key}" data-to="${p - 1}" ${p ? '' : 'disabled'}>‹</button>`;
  nums.forEach((i, j) => {
    if (j && i - nums[j - 1] > 1) html += '<span class="sub">…</span>';
    html += `<button class="b ${i === p ? 'on' : ''}" data-pg="${key}" data-to="${i}">${i + 1}</button>`;
  });
  html += `<button class="b" data-pg="${key}" data-to="${p + 1}" ${p < n - 1 ? '' : 'disabled'}>›</button>`;
  html += `<span class="sub" style="margin-left:8px">${p * PER_PAGE + 1}-${Math.min(total, (p + 1) * PER_PAGE)} ${L('history.of')} ${total}</span>`;
  box.innerHTML = html;
}
// three sub-tabs: Transakcje / Otwarte skrzynie / Historia ekwipunku
function applyTab() {
  const t = store.get('histTab', 'tx');
  for (const b of el.querySelectorAll('[data-ht]')) b.classList.toggle('on', b.dataset.ht === t);
  for (const b of el.querySelectorAll('.sec-b[data-sec]')) b.hidden = b.dataset.sec !== t;
}
const meta = store.bucket('itemMeta'); // hash -> {name, icon, color, appid}

const PAGE = 100;
const TRADES_FMT = 6; // bump to force one full re-sync of the saved market trades (6: sales had the fee taken off twice, 2026-11-22)

// ---------------------------------------------------------------- dates for the HTML history (no year in it)
// 1) exact times: the old JSON history (frozen in 2023) has time_event for every trade → key listingid_purchaseid
// 2) newer trades: purchase ids grow with time → interpolate id → time between known points
//    (last JSON trade … newest HTML row ≈ now) and pick the year closest to that estimate
async function loadAnchors() {
  const cached = store.get('histAnchors', null);
  if (cached) return cached;
  const exact = {};
  const pts = [];
  for (let start = 0, total = Infinity; start < total; start += 500) {
    const d = await steam.myHistoryPage(start, 500);
    if (!d.success) break;
    total = d.total_count || 0;
    const evs = d.events || [];
    for (const ev of evs) {
      if (!ev.purchaseid || ev.purchaseid === '0') continue;
      const t = (ev.time_event || 0) * 1000;
      exact[`${ev.listingid}_${ev.purchaseid}`] = t;
      pts.push([Number(ev.purchaseid), t]);
    }
    if (!evs.length) break;
  }
  pts.sort((a, b) => a[0] - b[0]);
  const a = { exact, pts };
  store.set('histAnchors', a);
  return a;
}

function makeDateOf(anchors, top) {
  const pts = [...anchors.pts];
  if (top) pts.push(top); // [newest purchase id, ≈ now]
  pts.sort((a, b) => a[0] - b[0]);
  const approx = (pid) => {
    if (pts.length < 2) return null;
    let i = pts.findIndex((p) => p[0] >= pid);
    if (i === -1) i = pts.length - 1;
    if (i === 0) i = 1;
    const [x0, t0] = pts[i - 1], [x1, t1] = pts[i];
    return x1 === x0 ? t0 : t0 + ((pid - x0) / (x1 - x0)) * (t1 - t0);
  };
  return ({ listingid, purchaseid, month, day, guess }) => {
    const ex = anchors.exact[`${listingid}_${purchaseid}`];
    if (ex) return ex;
    const est = approx(Number(purchaseid));
    if (est == null) return guess;
    const y0 = new Date(est).getFullYear();
    let best = guess, bestD = Infinity;
    for (const y of [y0 - 1, y0, y0 + 1]) {
      const t = new Date(y, month, day, 12, 0).getTime();
      if (t > Date.now() + 86400000) continue;
      const dd = Math.abs(t - est);
      if (dd < bestD) { bestD = dd; best = t; }
    }
    return best;
  };
}
const loadTrades = () => store.get('trades', {});
const saveTrades = (t) => store.set('trades', t);

// ---------------------------------------------------------------- currency conversion
// Old trades can be in another currency (e.g. EUR/USD before PLN existed on Steam). Steam history gives
// the currency of each trade; we convert to the wallet currency at a rate derived from Steam's own prices
// (same item priced in both currencies), cached for 24 h. Historical rates aren't available → "≈".
const CUR_NAME = { 1: 'USD', 2: 'GBP', 3: 'EUR', 5: 'RUB', 6: 'PLN', 7: 'BRL', 17: 'TRY', 18: 'UAH', 20: 'CAD', 21: 'AUD', 23: 'CNY' };
const FX_ITEM = [440, 'Mann Co. Supply Crate Key'];
const fx = store.bucket('fx'); // cur -> {r, at}
const fxLoading = new Map(); // cur -> the running request
function rateFor(cur) {
  const w = steam.wallet().currency;
  if (!cur || cur === w) return 1;
  const c = fx.get(String(cur));
  if (c && Date.now() - c.at < 86400000) return c.r;
  if (!fxLoading.has(cur)) {
    fxLoading.set(cur, Promise.all([steam.priceOverview(FX_ITEM[0], FX_ITEM[1], cur), steam.priceOverview(FX_ITEM[0], FX_ITEM[1], w)])
      .then(([a, b]) => {
        const r = (b.median || b.lowest) / (a.median || a.lowest);
        if (isFinite(r) && r > 0) { fx.set(String(cur), { r, at: Date.now() }); ui.log(L('history.rateToFromSteamPrices', { CUR_NAME: CUR_NAME[cur] || cur, CUR_NAME2: CUR_NAME[w] || w, r: r.toFixed(3) })); invalidate(); render(); }
      })
      .catch((e) => ui.log(L('history.couldntGetTheExchangeRate', { CUR_NAME: CUR_NAME[cur] || cur, message: e.message }), 'warn'))
      .finally(() => fxLoading.delete(cur)));
  }
  return c ? c.r : null; // stale rate is better than nothing
}
// Historical rates: Steam doesn't publish the rates it used, so we use the NBP (National Bank of Poland)
// mid rate from the day of each trade, free, no key, daily since 2002. Cross rates via PLN.
const nbp = store.bucket('nbp'); // code -> { 'YYYY-MM-DD': mid }
const day = (ts) => new Date(ts).toISOString().slice(0, 10);
function nbpMid(code, ts) {
  if (code === 'PLN') return 1;
  const m = nbp.get(code);
  if (!m) return null;
  for (let i = 0; i < 10; i++) { // weekends/holidays → last published rate before
    const v = m[day(ts - i * 86400000)];
    if (v) return v;
  }
  return null;
}
let nbpBusy = false;
const nbpTried = new Set(); // code|day already requested (avoid refetch loops when NBP has no data)
async function ensureNbp(trades) {
  if (nbpBusy) return;
  const w = steam.wallet().currency;
  const need = new Map(); // code -> [ts]
  for (const t of trades) {
    if (!t.cur || t.cur === w) continue;
    for (const code of [CUR_NAME[t.cur], CUR_NAME[w]]) {
      if (!code || code === 'PLN' || nbpMid(code, t.t) != null || nbpTried.has(code + '|' + day(t.t))) continue;
      nbpTried.add(code + '|' + day(t.t));
      (need.get(code) || need.set(code, []).get(code)).push(t.t);
    }
  }
  if (!need.size) return;
  nbpBusy = true;
  try {
    for (const [code, tss] of need) {
      tss.sort((a, b) => a - b);
      // NBP allows max 93 days per request → windows starting 10 days before the first needed date
      let i = 0;
      while (i < tss.length) {
        const from = tss[i] - 10 * 86400000;
        const to = Math.min(from + 92 * 86400000, Date.now());
        const url = `https://api.nbp.pl/api/exchangerates/rates/a/${code.toLowerCase()}/${day(from)}/${day(to)}/?format=json`;
        try {
          const d = await steam.schedule('ext', () => steam.gmJSON(url));
          const m = nbp.get(code) || {};
          for (const r of d.rates || []) m[r.effectiveDate] = r.mid;
          nbp.set(code, m);
        } catch (e) { console.warn('[Flipster] NBP', code, e.message); }
        while (i < tss.length && tss[i] <= to) i++;
      }
    }
    ui.log(L('history.historyDownloadedHistoricalExchangeRates'), 'ok');
  } finally { nbpBusy = false; }
  invalidate();
  render();
}
const CUR_ID = Object.fromEntries(Object.entries(CUR_NAME).map(([id, c]) => [c, +id]));
/**
 * an amount from the store purchase history in its own currency ('EUR', 'USD'…, as the row shows it) → the wallet
 * currency on that day (NBP, else today's rate); null when it can't be converted. Keys bought in 2014-15 with a euro
 * wallet used to be taken as złoty (1,99 € = "1,99 zł").
 */
function storeConv(amount, cur, t) {
  if (!cur) return amount; // no currency sign recognised: as it is
  const id = CUR_ID[cur];
  if (!id) return null;
  const { r } = histRate(id, t);
  return r == null ? null : Math.round(amount * r);
}
/** rate converting `cur` → wallet currency on the day `ts`: NBP historical, else today's Steam-derived rate */
function histRate(cur, ts) {
  const w = steam.wallet().currency;
  if (!cur || cur === w) return { r: 1 };
  const a = nbpMid(CUR_NAME[cur], ts), b = nbpMid(CUR_NAME[w], ts);
  if (a && b) return { r: a / b, src: 'nbp' };
  const now = rateFor(cur);
  return now == null ? { r: null } : { r: now, src: 'now' };
}

// ---------------------------------------------------------------- trades from inventory history (estimated prices)
// Steam stopped adding new trades to /market/myhistory (newest entry is from 2023). Inventory history still
// records market purchases/sales, but without a price → we estimate it from the item's market price history
// (volume-weighted price of sales around that moment) and mark it "≈ szac.".
const est = store.bucket('estPrices'); // `${hash}|${hourBucket}` -> cents (buyer price)
const estLoading = new Set();
const estTried = new Set();
// items Steam has no price history for (unsealed graffiti, items that were never on the market…) answer
// HTTP 500, remember them for a week instead of asking again on every render
const estFail = store.bucket('estFail'); // hash -> time of the failure
// earlier builds asked about Steam Community items under the game's appid and marked them as failed → retry once
if (!store.get('estFailMig1', false)) { for (const h of Object.keys(estFail.all())) if (/^\d+-/.test(h)) estFail.del(h); store.set('estFailMig1', true); }
const noMarket = (hash) => /^Graffiti \|/.test(hash) || Date.now() - (estFail.get(hash) || 0) < 7 * 86400000;
function estimate(appid, hash, ts) {
  // "63380-Lenin" (a Sniper Elite V2 trading card), "730-:csgoct:" (a CS:GO emoticon): Steam Community items,
  // they sell on the market under app 753 ("Steam"), not under the game
  if (/^\d+-/.test(hash)) appid = '753';
  const k = `${hash}|${Math.floor(ts / 3600000)}`;
  const v = est.get(k);
  if (v != null) return v;
  if (noMarket(hash)) return null;
  if (!estLoading.has(hash) && !estTried.has(k)) {
    estLoading.add(hash);
    steam.priceHistory(appid, hash).then((pts) => {
      for (const kk of Object.keys(est.all())) if (kk.startsWith(hash + '|')) estTried.add(kk);
      // every requested moment of this item: volume-weighted price within ±12 h (widen to ±3 days if needed)
      for (const t of pendingEst.get(hash) || []) {
        let win = pts.filter((p) => Math.abs(p.t - t) <= 12 * 3600000);
        if (!win.length) win = pts.filter((p) => Math.abs(p.t - t) <= 3 * 86400000);
        const vol = win.reduce((s, p) => s + (p.vol || 1), 0);
        const kk = `${hash}|${Math.floor(t / 3600000)}`;
        estTried.add(kk);
        if (vol) est.set(kk, Math.round(win.reduce((s, p) => s + p.price * (p.vol || 1), 0) / vol));
      }
      invalidate();
      render();
      renderInv();
      steam.bus.emit('estimated');
    }).catch((e) => { if (e.status === 500 || e.status === 400 || /brak historii|no price history/i.test(e.message)) estFail.set(hash, Date.now()); else console.warn('[Flipster] szacowanie ceny', hash, e.message); (pendingEst.get(hash) || []).forEach((t) => estTried.add(`${hash}|${Math.floor(t / 3600000)}`)); })
      .finally(() => estLoading.delete(hash));
  }
  (pendingEst.get(hash) || pendingEst.set(hash, new Set()).get(hash)).add(ts);
  return null;
}
const pendingEst = new Map();

/**
 * Market rows with their exact time. Steam's market history gives only a date (rows kept at 12:00); the inventory
 * history lists the same purchases and sales with the minute. Per item, side and day the market rows take the
 * earliest inventory-history times in order (the market history has the older ones; identical rows, so which copy
 * gets which minute doesn't matter). Rows that already have a real time are left as they are. Copies, not the saved rows.
 */
const numCmp = new Intl.Collator(undefined, { numeric: true }).compare;
function marketTimed() {
  // the row id is the key of the saved object, not a field of the row
  const market = Object.entries(loadTrades()).map(([key, t]) => ({ ...t, key }));
  const day = (t) => { const d = new Date(t); return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; };
  const noon = (t) => { const d = new Date(t); return d.getHours() === 12 && !d.getMinutes() && !d.getSeconds() && !d.getMilliseconds(); };
  // a date-only purchase saved in the wrong year goes to the year the inventory history has it in
  const dated = market.filter((t) => t.type === 'buy' && noon(t.t) && ih.isComplete(+t.appid || 730)).sort((a, b) => numCmp(String(a.key), String(b.key)));
  if (dated.length) {
    const bought = [];
    for (const e of allEvents()) if (e.kind === 'rynek' && /purchased/i.test(e.desc)) for (const it of e.plus) if (it.hash) bought.push({ hash: it.hash, t: e.t });
    const fixes = tradeYearFixes(dated, bought);
    for (const t of dated) if (fixes.has(t.key)) t.t = fixes.get(t.key);
  }
  const times = new Map(); // side|item|day -> inventory-history times
  for (const e of ih.all()) {
    if (e.kind !== 'rynek') continue;
    const buy = /purchased/i.test(e.desc), sell = /sold/i.test(e.desc);
    if (!buy && !sell) continue;
    for (const it of buy ? e.plus : e.minus) if (it.hash) { const k = `${buy ? 'buy' : 'sell'}|${it.hash}|${day(e.t)}`; (times.get(k) || times.set(k, []).get(k)).push(e.t); }
  }
  const rows = new Map();
  for (const t of market) if (noon(t.t)) { const k = `${t.type}|${t.hash}|${day(t.t)}`; (rows.get(k) || rows.set(k, []).get(k)).push(t); }
  const exact = new Map(); // market row key -> time
  for (const [k, rs] of rows) {
    const ts = (times.get(k) || []).sort((a, b) => a - b);
    if (!ts.length) continue;
    rs.sort((a, b) => numCmp(String(a.key), String(b.key))); // row ids grow with time
    rs.forEach((r, i) => { if (i < ts.length) exact.set(r.key, ts[i]); });
  }
  for (const t of market) if (exact.has(t.key)) t.t = exact.get(t.key);
  // a sale known only by its day comes after what arrived that day
  for (const t of market) if (t.type === 'sell' && noon(t.t)) { const d = new Date(t.t); d.setHours(23, 59, 59, 0); t.at = d.getTime(); }
  return market;
}

/** market buys/sells from inventory history that are newer than the (stale) market history */
function invHistoryTrades(marketTrades) {
  // Steam's market history has only a date per row (kept at 12:00), the inventory history the exact time: a purchase
  // at 21:45 is NOT newer than the market history just because 21:45 > 12:00. Per item, side and day, the first N
  // inventory-history events are the N rows the market history already has, only the rest are added (estimated).
  const day = (t) => { const d = new Date(t); return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; };
  const newestMarket = marketTrades.reduce((m, t) => Math.max(m, t.t), 0);
  const newestDay = newestMarket ? day(newestMarket) : null;
  const have = new Map();
  for (const t of marketTrades) { const k = `${t.type}|${t.hash}|${day(t.t)}`; have.set(k, (have.get(k) || 0) + (t.amount || 1)); }
  // the market history fetched after an event has that event (with its real price): only later ones can be missing.
  // Without a sync time (data from older versions): per day, as before.
  const syncedAt = store.get('tradesSyncedAt', 0);
  const cand = [];
  for (const e of ih.all()) {
    if (e.kind !== 'rynek') continue;
    if (syncedAt ? e.t <= syncedAt : e.t <= newestMarket + 60000 && day(e.t) !== newestDay) continue; // the market history has them
    const buy = /purchased/i.test(e.desc);
    const sell = /sold/i.test(e.desc);
    if (!buy && !sell) continue;
    (buy ? e.plus : e.minus).forEach((it, i) => {
      if (!it.hash) return;
      if (!meta.get(it.hash) && it.icon) meta.set(it.hash, { name: it.name, icon: it.icon, color: it.color, appid: '730' });
      cand.push({ key: `ih|${e.id}|${i}`, t: e.t, type: buy ? 'buy' : 'sell', hash: it.hash, appid: '730', amount: 1, price: null, cur: null, estimated: true });
    });
  }
  cand.sort((a, b) => a.t - b.t);
  if (syncedAt) return cand;
  const used = new Map();
  return cand.filter((c) => { const k = `${c.type}|${c.hash}|${day(c.t)}`; const u = used.get(k) || 0; used.set(k, u + 1); return u >= (have.get(k) || 0); });
}

/** trades with prices converted to the wallet currency; unconvertible ones are skipped (counted) */
function converted(list) {
  const out = [];
  let pending = 0;
  if (list.some((t) => t.cur && t.cur !== steam.wallet().currency)) ensureNbp(list);
  for (const t of list) {
    if (t.estimated) {
      const p = estimate(t.appid, t.hash, t.t);
      if (p == null) { pending++; continue; }
      // buy: what the buyer paid; sell: what the seller received (after fees)
      out.push({ ...t, price: t.type === 'buy' ? p : steam.receivedFromBuyer(p) });
      continue;
    }
    const { r, src } = histRate(t.cur, t.t);
    if (r == null) { pending++; continue; }
    out.push(r === 1 ? t : { ...t, price: Math.round(t.price * r), fx: t.cur, fxSrc: src, orig: t.price });
  }
  return { list: out, pending };
}

/** inventory cache entries of the logged-in account (one per app/context) */
let invMemo = null;
function myInvCaches() {
  // every read from GM storage copies the whole cache (all items of all games), and one view asks several times
  if (invMemo && Date.now() - invMemo.at < 2000) return invMemo.v;
  const me = steam.ctx().steamId;
  const cache = store.get('invcache', {});
  const v = Object.keys(cache).filter((k) => k.startsWith(me + '|')).map((k) => cache[k]);
  invMemo = { at: Date.now(), v };
  return v;
}
// The case openings feed three views (their tab, the transactions, the inventory's origins): computed once and reused
// for 3 s, and computed again right away when one of their inputs changed (sync, an estimated price arrived,
// exchange rates, a terminal amount typed in) → invalidate()
let coMemo = null;
function cases() {
  if (!coMemo || Date.now() - coMemo.at > 3000) coMemo = { at: Date.now(), v: caseOpenings() };
  return coMemo.v;
}
/** market rows with their exact times + the newer trades only the inventory history has, shared the same way */
let ttMemo = null;
function timedTrades() {
  if (!ttMemo || Date.now() - ttMemo.at > 3000) { const market = marketTimed(); ttMemo = { at: Date.now(), market, all: [...market, ...invHistoryTrades(market)] }; }
  return ttMemo;
}
function invalidate() { coMemo = null; originsMemo = null; invMemo = null; ttMemo = null; }
/** your inventory items from the cache (all contexts) */
const ownedItems = () => myInvCaches().flatMap((c) => c.items || []);
/**
 * When a trade-protected copy arrived: protection ends 7 days later, rounded up to the full hour (a terminal traded
 * in at 23:46 is protected until 00:00 a week later, one bought at 01:24 until 02:00) → the middle of that hour.
 */
const arrivedAt = (until) => until - 7 * 86400000 - 30 * 60000;
/** everything the history views are computed from, as one file (for checking the calculations together) */
function exportHistory() {
  const iso = (t) => (t ? new Date(t).toISOString() : null);
  const timed = new Map(marketTimed().map((t) => [t.key, t.t]));
  const market = Object.entries(loadTrades()).map(([key, t]) => ({ key, ...t, iso: iso(t.t), tExact: timed.get(key) !== t.t ? timed.get(key) : undefined }));
  const item = (i) => i.hash || i.name;
  const inv = ih.all().map((e) => ({ id: e.id, t: e.t, iso: iso(e.t), desc: e.desc, kind: e.kind, partner: e.partner?.name || null, minus: (e.minus || []).map(item), plus: (e.plus || []).map(item) }));
  let opens = [];
  try {
    opens = caseOpenings().rows.map((r) => ({ t: r.e.t, iso: iso(r.e.t), id: r.e.id, unseal: r.e.unseal || null, terminal: !!r.terminal, case: r.caseIt?.hash || r.caseIt?.name || null, caseSrc: r.caseSrc, caseCost: r.caseCost, key: r.keyIt?.hash || null, keyCost: r.keyCost, paid: r.paid ?? null, drops: r.drops.map((d) => d.hash || d.name), cost: r.cost, value: r.value }));
  } catch (e) { opens = [{ error: e.message }]; }
  // + where Flipster thinks each copy came from (to check the origins, e.g. Steam cards: drop vs bought)
  let orig = new Map();
  try { orig = itemOrigins(); } catch { /* history not synced */ }
  const originOut = (o) => (o ? { src: o.src, iso: iso(o.t), cost: o.cost ?? null, detail: o.detail || '' } : null);
  const owned = ownedItems().map((it) => ({ assetid: it.assetid, contextid: it.contextid, hash: it.hash, lock: it.lock || null, marketable: !!it.marketable, amount: it.amount || 1, origin: originOut(orig.get(it.assetid) || orig.get('h:' + it.hash)) }));
  // the other games' histories (Steam's own items: drops, booster packs, badge crafting; Rust…)
  const steamInv = otherApps().flatMap((app) => ih.allOf([app]).map((e) => ({ app, t: e.t, iso: iso(e.t), desc: e.desc, kind: e.kind, minus: (e.minus || []).map(item), plus: (e.plus || []).map(item) })));
  const data = {
    exported: iso(Date.now()), tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
    marketSyncedAt: iso(store.get('tradesSyncedAt', 0)), invHistorySyncedAt: iso(ih.syncedAt()), invHistoryComplete: ih.isComplete(),
    counts: { market: market.length, invHistory: inv.length, otherGamesHistory: steamInv.length, caseOpenings: opens.length, owned: owned.length },
    market, invHistory: inv, otherGamesHistory: steamInv, caseOpenings: opens, owned,
  };
  downloadText(`flipster-historia-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(data, null, 1), 'application/json');
  ui.log(L('history.historySavedTheDataFor', { market: market.length, inv: inv.length, opens: opens.length, owned: owned.length }), 'ok');
}
/** how many of each item I actually own now (hash → count); null when the inventory was never loaded */
function ownedNow() {
  const caches = myInvCaches();
  if (!caches.length) return null;
  const m = new Map();
  for (const c of caches) for (const it of c.items || []) m.set(it.hash, (m.get(it.hash) || 0) + (it.amount || 1));
  return m;
}
/** of the copies I own, how many came another way than a market purchase (trade, drop, case…), per item */
function ownedNotBought() {
  const m = new Map();
  let origins;
  try { origins = itemOrigins(); } catch { return m; }
  for (const it of ownedItems()) {
    const o = origins.get(it.assetid);
    if (o && o.src !== 'kupiony') m.set(it.hash, (m.get(it.hash) || 0) + (it.amount || 1));
  }
  return m;
}

export function mount(root) {
  el = root;
  root.innerHTML = `
    <style>
      #stt .sec-b .bar{position:static}
      #stt .sec-b th{top:var(--bar-h,0px)}
      #stt .pg{display:flex;gap:4px;align-items:center;justify-content:center;padding:8px 14px;flex-wrap:wrap}
      #stt .pg:empty{display:none}
      #stt .pg button{min-width:30px}
    </style>
    <div class="bar">
      <button class="b" data-a="syncall" title="${L('history.fetchesNewEntriesFromAll')}">⟳ ${L('history.sync')}</button>
      <button class="b" data-a="fullall" title="${L('history.downloadsTheWholeMarketAnd')}">${L('history.fullSync')}</button>
      <button class="b dbg" data-a="dump" title="${L('history.savesTheWholeStoredHistory')}">⬇ ${L('history.dataForAnalysis')}</button>
      <select id="h-per"><option value="7">${L('history.7Days')}</option><option value="30">${L('history.30Days')}</option><option value="90">${L('history.90Days')}</option><option value="365">${L('history.year')}</option><option value="0">${L('history.wholeHistory')}</option></select>
      <select id="h-game" title="${L('history.whichGameTheTradesSummary')}"><option value="all">${L('history.allGames')}</option><option value="730">CS2</option>${otherApps().map((a) => `<option value="${a}">${esc(appName(a))}</option>`).join('')}</select>
      <label class="tgl" title="${L('history.joinsIdenticalTradesOfOne')}"><input type="checkbox" id="h-grp" ${store.get('histGroup', true) ? 'checked' : ''}><span class="tr"></span>${L('history.groupIdentical')}</label>
      <span class="sp"></span>
      <span class="sub" id="h-info"></span>
      <button class="b" data-a="stop" hidden>■ Stop</button>
    </div>
    <div class="htabs">
      <button data-ht="tx" id="tx-h">${L('history.trades')} <span class="cnt"></span></button>
      <button data-ht="cs" id="cs-h">${L('history.openedCases')} <span class="cnt"></span></button>
      <button data-ht="ih" id="ih-h">${L('history.inventoryHistory')} <span class="cnt"></span></button>
    </div>
    <div class="sec-b" data-sec="tx">
    <div class="bar">
      <select id="h-view" title="${L('history.everyTradeOnItsOwn')}"><option value="tx">${L('history.everyTrade')}</option><option value="item">${L('history.totalPerItem')}</option></select>
      <input type="search" id="h-q" placeholder="${L('history.filterItems')}" style="width:180px">
      <span class="sp"></span>
      <button class="b pane" data-a="months" title="${L('history.showHideTheResultMonth')}">📅 ${L('history.resultByMonth')}</button>
      <button class="b pane" data-a="chart" title="${L('history.showHideTheFlipProfit')}">📈 ${L('history.chartFlips')}</button>
      <button class="b pane" data-a="chartbal" title="${L('history.showHideTheBalance')}">📈 ${L('history.chartBalance')}</button>
    </div>
    <div class="cards" id="h-cards" style="grid-template-columns:repeat(auto-fill,minmax(max(170px,calc(25% - 10px)),1fr))"></div>
    <div id="h-months" style="padding:0 14px"></div>
    <div id="h-chart" style="padding:0 14px"></div>
    <div class="note">${L('history.eachSaleIsPairedWith')}</div>
    <table id="h-tbl"><thead></thead><tbody></tbody></table>
    <div class="pg" id="tx-pg"></div>
    </div>
    <div class="sec-b" data-sec="cs">
    <div class="bar" style="position:relative">
      <span class="sp"></span><span class="sub" id="cs-info"></span>
    </div>
    <div class="cards" id="cs-cards"></div>
    <div id="cs-list"></div>
    <div class="pg" id="cs-pg"></div>
    </div>
    <div class="sec-b" data-sec="ih">
    <div class="bar" style="position:relative">
      <select id="ih-kind"><option value="">${L('history.allEvents')}</option><option value="wymiana">${L('history.trades2')}</option><option value="rynek">${L('history.market')}</option><option value="skrzynia">${L('history.cases')}</option><option value="kontrakt">${L('history.contracts')}</option><option value="naklejka">${L('history.stickers')}</option><option value="otrzymane">${L('history.receivedDrops')}</option><option value="inne">${L('history.other')}</option></select>
      <input type="search" id="ih-q" placeholder="${L('history.searchItemsPlayers')}" style="width:200px">
      <span class="sp"></span><span class="sub" id="ih-info"></span>
    </div>
    <div class="note">${L('history.everythingThatHappenedToYour')} <span class="neg">−</span> ${L('history.given')}, <span class="pos">+</span> ${L('history.received')}.</div>
    <div id="ih-list"></div>
    <div class="pg" id="ih-pg"></div>
    </div>
`;
  root.addEventListener('click', (e) => {
    const iv = e.target.closest('[data-inv]');
    if (iv) { e.preventDefault(); ui.show('inv'); focusItem(iv.dataset.inv, { appid: +iv.dataset.app || 730, cost: iv.dataset.cost ? +iv.dataset.cost : null, t: iv.dataset.t ? +iv.dataset.t : null }); return; }
    const tg = e.target.closest('[data-txg]');
    if (tg) { e.preventDefault(); const k = tg.dataset.txg; txOpen.has(k) ? txOpen.delete(k) : txOpen.add(k); render(true); return; }
    const ob = e.target.closest('[data-owner]');
    if (ob) {
      ih.checkOwner(ob.dataset.owner, ob.dataset.hash).then(() => { render(); renderInv(); });
      render(); renderInv();
      return;
    }
    const pg = e.target.closest('[data-pg]');
    if (pg) {
      pages[pg.dataset.pg] = Math.max(0, +pg.dataset.to);
      ({ tx: () => render(true), ih: () => renderInv(true), cs: renderCases })[pg.dataset.pg]();
      el.querySelector('#' + pg.dataset.pg + '-h')?.scrollIntoView({ block: 'start', behavior: 'smooth' });
      return;
    }
    const ht = e.target.closest('[data-ht]');
    if (ht) { store.set('histTab', ht.dataset.ht); applyTab(); return; }
    const th = e.target.closest('th[data-sort]');
    if (th) { if (!th.closest('#h-tbl')) return; (view === 'tx' ? txSort : sort).click(th.dataset.sort); render(true); return; }
    const a = e.target.closest('button')?.dataset.a;
    ({ months: () => { store.set('histMonths', !store.get('histMonths', false)); render(true); }, dump: exportHistory, syncall: () => syncAll(false), fullall: () => syncAll(true), stop: () => { task?.cancel(); ihTask?.cancel(); }, chartbal: () => { store.set('histChartBal', !store.get('histChartBal', false)); drawChart(); }, chart: () => { store.set('histChart', !store.get('histChart', false)); if (chartZoom) { chartZoom = null; render(true); } else drawChart(); }, chartreset: () => { chartZoom = null; pages.tx = 0; render(true); } })[a]?.();
  });
  period = store.get('histPeriod', 0);
  root.querySelector('#h-per').value = String(period);
  game = store.get('histGame', 'all');
  if (![...root.querySelector('#h-game').options].some((o) => o.value === game)) game = 'all'; // e.g. the old "inne gry"
  root.querySelector('#h-game').value = game;
  root.querySelector('#h-game').onchange = (e) => { game = e.target.value; store.set('histGame', game); pages.tx = pages.ih = 0; render(true); renderInv(true); };
  root.querySelector('#h-per').onchange = (e) => { chartZoom = null; period = +e.target.value; store.set('histPeriod', period); pages.tx = pages.ih = pages.cs = 0; render(); renderInv(); };
  let qT = 0;
  root.querySelector('#h-q').oninput = () => { clearTimeout(qT); qT = setTimeout(() => { pages.tx = 0; render(true); }, 150); };
  applyTab();
  // table headers stick right under the (sticky) top bar while scrolling
  const topBar = root.querySelector(':scope > .bar');
  if (topBar && window.ResizeObserver) new ResizeObserver(() => root.style.setProperty('--bar-h', topBar.offsetHeight + 'px')).observe(topBar);
  root.querySelector('#h-view').value = view;
  root.querySelector('#h-grp').onchange = (e) => { store.set('histGroup', e.target.checked); pages.tx = 0; render(true); };
  root.querySelector('#h-view').onchange = (e) => { view = e.target.value; store.set('histView', view); pages.tx = 0; render(); };
  root.querySelector('#ih-kind').onchange = () => { pages.ih = 0; renderInv(true); };
  root.addEventListener('change', (e) => {
    const inp = e.target.closest?.('[data-termpaid]');
    if (!inp) return;
    const m = store.get('termPaid', {});
    const v = parsePrice(inp.value);
    if (isNaN(v)) delete m[inp.dataset.termpaid]; else m[inp.dataset.termpaid] = v;
    store.set('termPaid', m);
    invalidate();
    render(); renderInv();
  });
  let iqT = 0;
  root.querySelector('#ih-q').oninput = () => { clearTimeout(iqT); iqT = setTimeout(() => { pages.ih = 0; renderInv(true); }, 150); };
  if (ih.all().length && store.get('invhistFmt', 1) < 2) { store.set('invhistFmt', 2); setTimeout(() => syncInv(true), 3000); }
  else if (!ih.isComplete() || otherApps().some((a) => !ih.isComplete(a)) || Date.now() - ih.syncedAt() > 3600000) setTimeout(() => syncInv(false), 3000);
  store.del('keyPrice'); // leftover of the removed manual key price setting
  patterndb.load().then((fresh) => { if (fresh) render(); }); // 💎 known pattern seeds on past trades
  setTimeout(() => sh.ensure(() => { invalidate(); render(); renderInv(); }), 4000);
  render();
  // trades saved by older versions (no currency; fmt 4: wrong years on trades newer than 2023) → one full re-sync
  const trades = Object.values(loadTrades());
  if (trades.length && store.get('tradesFmt', 1) < TRADES_FMT) {
    ui.log(L('history.historyOneTimeDownloadOf'), 'warn');
    sync(true);
    return;
  }
  const last = store.get('tradesSyncedAt', 0);
  if (Date.now() - last > 3600000) sync(false);
}

export const show = () => { render(); renderInv(); };

// one run of each history at a time: two at once fetched the same pages twice (2026-11-20, the Steam items' history:
// "+1512" logged twice 6 s apart). A second call while one runs is skipped.
let mBusy = false, ihBusy = false, sBusy = false, chainBusy = false;
const anyBusy = () => mBusy || ihBusy || sBusy || chainBusy;
/** the sync buttons are greyed out while any history sync runs (the automatic ones on opening the tab too) */
const syncUi = () => el?.querySelectorAll('[data-a="syncall"], [data-a="fullall"]').forEach((b) => (b.disabled = anyBusy()));
const once = (busy, set, fn) => async (...a) => { if (busy()) return; set(true); syncUi(); try { return await fn(...a); } finally { set(false); syncUi(); } };
const sync = once(() => mBusy, (v) => (mBusy = v), syncMarket);
/** the three histories one after another: market, inventory (CS2 + Steam items), store purchases; full = market and inventory from scratch */
async function syncAll(full) {
  const busyMsg = L('history.historyASyncIsAlready');
  if (anyBusy()) return ui.log(busyMsg, 'warn');
  if (full && !(await ui.ask(L('history.fullSync'), L('history.illDownloadTheWholeMarket'), { ok: L('history.downloadEverything') }))) return;
  // greyed out for the whole chain, not only during each part (a click in between could start it twice)
  if (anyBusy()) return ui.log(busyMsg, 'warn');
  chainBusy = true;
  syncUi();
  try {
    await sync(full);
    await syncInv(full);
    await syncStore();
  } finally {
    chainBusy = false;
    syncUi();
  }
}
async function syncMarket(full) {
  if (!(await steam.ensureLogin())) return ui.log(L('history.logIn'), 'err');
  task = token();
  el.querySelector('[data-a="stop"]').hidden = false;
  const saved = loadTrades();
  const trades = full ? {} : saved;
  // a full sync that didn't reach the end (stopped, rate limit) must not throw away what was saved before
  const keep = () => saveTrades(full ? { ...saved, ...trades } : trades);
  const wasEmpty = !Object.keys(saved).length;
  let start = 0, total = Infinity, added = 0, steamTotal = 0;
  let dateOf = null;
  try {
    const anchors = await loadAnchors();
    while (start < total && !task.cancelled) {
      const d = await steam.myHistoryHtmlPage(start, PAGE);
      if (!d.success) throw new Error(L('history.steamReturnedNoHistory'));
      total = d.total_count || 0;
      steamTotal = Math.max(steamTotal, total);
      const parse = (h) => new DOMParser().parseFromString(h, 'text/html');
      if (!dateOf) {
        // upper anchor for interpolating the dates of newer trades: the newest trade's purchase id and its day
        // (the newest row is the one whose year is certain: the latest such day that isn't in the future)
        const top = parseMyHistoryHtml(d, parse, new Date()).find((t) => /^\d+_\d+/.test(t.key) && t.t);
        const topId = top ? Number(top.key.split('_')[1]) : 0;
        dateOf = makeDateOf(anchors, topId ? [topId, Math.min(top.t, Date.now())] : null);
      }
      const page = parseMyHistoryHtml(d, parse, new Date(), dateOf);
      if (start === 0) {
        const newest = [...page].sort((a, b) => b.t - a.t)[0];
        if (newest) ui.log(`${L('history.historyNewestMarketTrade')}, ${new Date(newest.t).toLocaleString()} ${newest.type === 'buy' ? L('history.buy') : L('history.sale')} ${newest.hash}`);
      }
      let fresh = 0;
      for (const t of page) {
        if (!trades[t.key]) { fresh++; added++; }
        const price = t.price;
        const mem = t.assetid ? steam.recallProps({ assetid: t.assetid, float: null }) : {};
        const fl = t.float ?? mem.float ?? null, sd = t.seed ?? mem.seed ?? null;
        trades[t.key] = { t: t.t, type: t.type, hash: t.hash, appid: t.appid, amount: t.amount, price, cur: t.cur ?? null, pending: t.pending || undefined, float: fl ?? undefined, seed: sd ?? undefined };
        if (!meta.get(t.hash) && t.icon) meta.set(t.hash, { name: t.name, icon: t.icon, color: t.color, appid: t.appid });
      }
      const evs = (d.results_html || '').includes('history_row_') ? 1 : 0;
      ui.progress(Math.min(start + PAGE, total), total);
      el.querySelector('#h-info').textContent = L('history.downloadedEvents', { start: Math.min(start + PAGE, total), total });
      // incremental: stop when a whole page had nothing new
      if (!full && page.length && !fresh) break;
      if (!evs) break;
      start += PAGE;
      if (start % 1000 === 0) keep();
    }
    if (task.cancelled) {
      keep();
      ui.log(L('history.historyStoppedISavedWhat'), 'warn');
    } else if (!wasEmpty && (full ? !wholeHistory(steamTotal, start) : !steamTotal)) {
      // an empty or cut-off answer says nothing about the trades already saved
      keep();
      ui.log(L('history.steamGaveNoFullHistory'), 'warn');
    } else {
      saveTrades(trades);
      store.set('tradesSyncedAt', Date.now());
      if (full || wasEmpty) store.set('tradesFmt', TRADES_FMT);
      ui.log(L('history.historyNewTradesInTotal', { added, trades: Object.keys(trades).length }), 'ok');
      // past items with a pattern seed: how many Steam still told, and which of them are a known pattern (💎)
      const all = Object.values(trades), withSeed = all.filter((x) => x.seed != null);
      const known = withSeed.filter((x) => patternFor(x.hash, x.seed));
      const knownList = `${known.length} (${[...new Set(known.map((x) => x.hash))].slice(0, 5).join(', ')}${known.length > 5 ? '…' : ''})`;
      if (full || known.length) ui.log(L('history.historySeedKnownForOf', { withSeed: withSeed.length, all: all.length, known: known.length ? L('history.knownPattern', { knownList }) : L('history.noneIsAKnownRare') }), known.length ? 'ok' : '');
    }
  } catch (e) {
    keep();
    ui.log(L('history.history') + e.message, 'err');
  }
  ui.progress(0);
  el.querySelector('[data-a="stop"]').hidden = true;
  invalidate();
  render();
}

// heavy part (trades + inventory history + FX + FIFO) cached between keystrokes of the search box;
// every other render recomputes it
let memo = null;
const matchQ = (q) => {
  const hit = new Map();
  return (hash) => {
    if (!q) return true;
    if (!hit.has(hash)) hit.set(hash, matchSearch(`${hash} ${meta.get(hash)?.name || ''}`, q));
    return hit.get(hash);
  };
};
function compute(fast = false) {
  if (!fast || !memo) memo = computeAll();
  const q = el.querySelector('#h-q').value.trim().toLowerCase();
  if (!q && game === 'all') return memo;
  const match = matchQ(q);
  // the game of each item from its trades (no appid: CS2, the inventory history is read for CS2 only)
  const appOf = new Map(memo.all.map((t) => [t.hash, String(t.appid || 730)]));
  const gameOk = (hash) => game === 'all' || (appOf.get(hash) ?? '730') === game;
  const ok = (hash) => gameOk(hash) && match(hash);
  const res = { ...memo.res, items: memo.res.items.filter((it) => ok(it.hash)), realized: memo.res.realized.filter((r) => ok(r.hash)) };
  return { ...memo, res, all: memo.all.filter((t) => ok(t.hash)) };
}
/** average cost of the copies you still hold, per item (FIFO over your market history), used by the inventory */
export function heldCosts() {
  const { res } = memo && Date.now() - (memo.at || 0) < 60000 ? memo : computeAll();
  const m = new Map();
  for (const it of res.items) if (it.holdQty > 0 && it.holdCost > 0) m.set(it.hash, it.holdCost / it.holdQty);
  return m;
}
function computeAll() {
  const { list: conv, pending } = converted(timedTrades().all);
  // FIFO over full history so lots bought before the period are matched correctly; filter realized by period
  const res = fifoPnL(conv, inventoryMoves(allEvents()));
  // items bought on the market but no longer owned (traded away, sold off-market) aren't "held"
  const owned = ownedNow();
  // a copy that came in a trade or as a drop doesn't keep a purchase "in the inventory" (4 bought terminals opened,
  // the one you have was traded in)
  const notBought = owned ? ownedNotBought() : new Map();
  for (const it of res.items) {
    it.goneQty = it.gone || 0; // bought copies opened, traded away or used up
    if (!it.holdQty || !owned) continue;
    const have = Math.min(it.holdQty, Math.max(0, (owned.get(it.hash) || 0) - (notBought.get(it.hash) || 0)));
    if (have < it.holdQty) {
      it.goneQty += it.holdQty - have;
      it.holdCost = Math.round((it.holdCost * have) / it.holdQty);
      it.holdQty = have;
    }
  }
  const since = period ? Date.now() - period * 86400000 : 0;
  const fxHashes = new Set(conv.filter((t) => t.fx).map((t) => t.hash));
  const estHashes = new Set(conv.filter((t) => t.estimated).map((t) => t.hash));
  return { at: Date.now(), res, since, all: conv, pending, owned, fxHashes, estHashes };
}

function render(fast = false) {
  if (!el) return;
  const { res, all, pending, owned, fxHashes, estHashes } = compute(fast);
  const periodSince = period ? Date.now() - period * 86400000 : 0;
  // range selected on the chart narrows the cards + table too
  const since = chartZoom ? Math.max(periodSince, chartZoom[0]) : periodSince;
  const until = chartZoom ? chartZoom[1] : Infinity;
  const inR = (t) => t >= since && t <= until;
  const realizedP = res.realized.filter((r) => inR(r.t));
  const inP = all.filter((t) => inR(t.t));
  const spent = inP.filter((t) => t.type === 'buy').reduce((s, t) => s + t.price * t.amount, 0);
  const recv = inP.filter((t) => t.type === 'sell').reduce((s, t) => s + t.price * t.amount, 0);
  const pnl = realizedP.reduce((s, r) => s + r.pnl, 0);
  const wins = realizedP.filter((r) => r.pnl > 0).length;
  // unrealized result of the copies still held: today's net price minus what they cost
  for (const it of res.items) {
    if (!it.holdQty) continue;
    const p = prices.cached(it.appid || meta.get(it.hash)?.appid || 730, it.hash)?.lowest;
    it.unreal = p ? steam.receivedFromBuyer(p) * it.holdQty - it.holdCost : null;
  }
  const n = timedTrades().market.length;
  el.querySelector('#h-info').textContent = n
    ? L('history.tradesStored', { n, pending: pending ? L('history.waitingForARateEstimated', { pending }) : '', owned: owned ? '' : L('history.openInventoryToVerifyYou') })
    : L('history.noDataClickSync');
  // drops from cases/capsules that were sold in the period: cost of the opening vs what the sale brought
  const dropInfo = new Map(); // hash -> {n, cost, value, cases:Set, unknown}
  const dropTx = new Map(); // hash|saleT -> {case, cost|null, value}
  if (!fast || !memo.co) memo.co = cases();
  for (const r of memo.co.rows) {
    const share = r.drops.length ? 1 / r.drops.length : 1;
    for (const d of r.drops) {
      if (d.kind !== 'sold' || !inR(d.saleT) || !d.hash) continue;
      const x = dropInfo.get(d.hash) || { n: 0, cost: 0, value: 0, cases: new Set(), unknown: 0 };
      x.n++;
      if (r.caseCost == null || r.unknownPaid) x.unknown++;
      else { x.cost += Math.round(r.cost * share); x.value += d.value; }
      if (r.caseIt?.name) x.cases.add(r.caseIt.name);
      dropTx.set(d.hash + '|' + d.saleT, { case: r.caseIt?.name || L('history.case'), cost: r.caseCost == null ? null : Math.round(r.cost * share), value: d.value });
      dropInfo.set(d.hash, x);
    }
  }
  const floatsOf = (hash) => [...new Set(all.filter((t) => t.hash === hash && t.float != null).map((t) => t.float.toFixed(4)))];
  el.querySelector('#h-cards').innerHTML = `
    <div class="card"><div class="k">${L('history.spentOnTheMarket')}</div><div class="v">${steam.fmt(spent)}</div></div>
    <div class="card"><div class="k">${L('history.receivedFromSales')}</div><div class="v">${steam.fmt(recv)}</div></div>
    <div class="card"><div class="k">${L('history.balance')}</div><div class="v ${recv - spent >= 0 ? 'pos' : 'neg'}">${recv - spent >= 0 ? '+' : ''}${steam.fmt(recv - spent)}</div><div class="sub">${L('history.receivedMinusSpent')}</div></div>
    <div class="card"><div class="k">${L('history.flipProfit')}</div><div class="v ${pnl >= 0 ? 'pos' : 'neg'}">${steam.fmt(pnl)}</div><div class="sub">${L('history.flipsInProfit', { realizedP: realizedP.length, realizedP2: realizedP.length ? pct(wins / realizedP.length, 0) : '-' })}</div></div>`;

  // cumulative realized P&L chart
  let acc = 0;
  const pts = res.realized.filter((r) => r.t >= periodSince).sort((a, b) => a.t - b.t).map((r) => [r.t, (acc += r.pnl)]);
  chartPts = pts;
  // the running balance (received minus spent), the same trades as the card; trades of one moment are one step
  const moves = new Map();
  for (const t of all) if (t.t >= periodSince) moves.set(t.t, (moves.get(t.t) || 0) + (t.type === 'sell' ? 1 : -1) * t.price * t.amount);
  let bal = 0;
  balancePts = [...moves].sort((a, b) => a[0] - b[0]).map(([t, v]) => [t, (bal += v)]);
  if (balancePts.length) balancePts.unshift([balancePts[0][0] - 60000, 0]);
  drawChart();
  drawMonths(res, all, inR);

  if (view === 'tx') return renderTx({ res, since, until, all, dropTx });
  // ---- per item: one row = "how did this item go for me" (bought → sold/held/gone → result)
  el.querySelector('#h-tbl thead').innerHTML = `<tr>
      <th data-sort="name">${L('history.item')}</th><th data-sort="bought">${L('history.bought')}</th><th data-sort="sold">${L('history.sold')}</th>
      <th data-sort="now">Status</th><th data-sort="result">${L('history.profitLoss')}</th></tr>`;
  const per = res.items.map((it) => {
    const rp = realizedP.filter((r) => r.hash === it.hash);
    const realized = rp.reduce((s, r) => s + r.pnl, 0);
    const cost = rp.reduce((s, r) => s + r.buy * r.qty, 0);
    const tradedInPeriod = inP.some((t) => t.hash === it.hash);
    const unreal = it.holdQty ? it.unreal : null;
    const result = realized + (unreal || 0);
    const base = cost + (it.holdQty ? it.holdCost : 0);
    return { ...it, realizedP: realized, unrealP: unreal, result, roi: base ? result / base : null,
      avgBuy: it.bought ? it.spent / it.bought : null, avgSell: it.sold ? it.received / it.sold : null,
      active: tradedInPeriod };
  }).filter((x) => x.active);
  for (const x of per) x.todayLow = nowPrice(x.hash);
  const rows = sort.apply(per, {
    name: (x) => x.hash, bought: (x) => x.bought, sold: (x) => x.sold,
    now: (x) => (x.holdQty ? 2 : x.goneQty ? 1 : 0), result: (x) => x.result, realized: (x) => x.result,
  });
  renderPager('tx', rows.length);
  el.querySelector('#tx-h .cnt').textContent = `(${rows.length})`;
  const money = (v) => `<span class="${v > 0 ? 'pos' : v < 0 ? 'neg' : ''}">${v > 0 ? '+' : ''}${steam.fmt(Math.round(v))}</span>`;
  el.querySelector('#h-tbl tbody').innerHTML = rows.length ? pageOf('tx', rows).map((x) => {
    const m = meta.get(x.hash) || {};
    const est = estHashes.has(x.hash) || fxHashes.has(x.hash) ? ` <span class="warn" title="${L('history.someAmountsAreEstimatedNo')}">≈</span>` : '';
    const fls = floatsOf(x.hash);
    // the English names carry the wear "(Field-Tested)": the subtitle keeps just the float
    const sub = fls.length ? `float ${fls.slice(0, 3).join(', ')}${fls.length > 3 ? '…' : ''}` : '';
    const di = dropInfo.get(x.hash);
    // bought
    const buyCell = x.bought ? `${x.bought} × ${steam.fmt(Math.round(x.avgBuy))}${est}<div class="sub">${L('history.total')} ${steam.fmt(x.spent)}</div>` : `<span class="sub">${L('history.notBought')}</span>`;
    // sold
    const sellCell = x.sold ? `${x.sold} × ${steam.fmt(Math.round(x.avgSell))}${est}<div class="sub">${x.unmatchedSells ? `${x.unmatchedSells} ${L('history.fromADropTrade')} · ` : ''}${L('history.youGot')} ${steam.fmt(x.received)}</div>` : '<span class="sub">-</span>';
    // now: held / gone / all sold
    let nowCell;
    if (x.holdQty) {
      const val = x.todayLow != null ? steam.receivedFromBuyer(x.todayLow) * x.holdQty : null;
      nowCell = `${L('history.youHold')} ${x.holdQty}${val != null ? `<div class="sub">${L('history.worthToYouUnit', { val: steam.fmt(val), todayLow: steam.fmt(x.todayLow) })}</div>` : `<div class="sub">${L('history.noPrice')}</div>`}`;
    } else if (x.goneQty) nowCell = goneCell(x);
    else nowCell = `<span class="sub">${L('history.allSold')}${x.todayLow != null ? ` · ${L('history.today')} ${steam.fmt(x.todayLow)}/${L('history.unit')}` : ''}</span>`;
    if (x.holdQty && x.goneQty) nowCell += goneCell(x);
    // result
    const parts = [];
    if (x.realizedP) parts.push(`${L('history.sale')} ${money(x.realizedP)}`);
    if (x.unrealP != null && x.holdQty) parts.push(`${L('history.held')} ${money(x.unrealP)}`);
    const resCell = x.realizedP || x.unrealP != null
      ? `<b>${money(x.result)}</b>${x.roi != null ? ` <span class="sub">${pct(x.roi)}</span>` : ''}${parts.length > 1 ? `<div class="sub">${parts.join(' · ')}</div>` : x.unrealP != null && x.holdQty && !x.realizedP ? `<div class="sub">${L('history.unrealised')}</div>` : ''}`
      : x.goneQty ? `<span class="sub" title="${L('history.theItemLeftTheInventory')}">${L('history.unknown')}</span>` : '<span class="sub">-</span>';
    const dropLine = di ? `<div class="sub" title="${L('history.theItemDroppedFromA')}">${L('history.dropFrom')} ${esc([...di.cases].join(', ') || L('history.aCase'))}${di.n - di.unknown ? `: ${money(di.value - di.cost)} ${L('history.vsTheOpeningCost')}` : ''}</div>` : '';
    return `<tr><td>${ui.itemCell({ ...m, hash: x.hash, name: m.name || x.hash, appid: m.appid || 730, sub })}</td>
      <td>${buyCell}</td><td>${sellCell}${dropLine}</td><td>${nowCell}</td><td>${resCell}</td></tr>`;
  }).join('') : `<tr><td colspan="5" class="empty">${L('history.noTradesInThisPeriod')}</td></tr>`;
}

/** one row per market transaction (newest first by default) */
const txOpen = new Set(); // merged rows (group keys) the user opened
// a purchase row's own id (two purchases of one item in the same minute are still two rows)
const bk = (t) => t.key || `${t.hash}|${t.t}`;
// ---------------------------------------------------------------- what an item from a trade cost
/**
 * The market value (that day) of what you gave, split over what you got by their values; a gift (nothing given) costs 0.
 * One trade is often two rows ("You traded with X" + "Traded"): per game the fullest one; a trade with CS2 items and
 * Steam cards is in both games' histories, both count. → { cost (cents, per copy of `hash`) | null while prices are
 * still being estimated or unknown, outs: what you gave }. Used by the inventory (itemOrigins) and the sales table.
 */
function tradeCost(x, hash, tradeEv) {
  const sib = x.kind === 'wymiana' ? tradeEv.filter((y) => Math.abs(y.t - x.t) <= 120000) : [x];
  const outs = [], ins = [];
  for (const app of new Set(sib.map((y) => y.app || 730))) {
    const rows = sib.filter((y) => (y.app || 730) === app);
    const tag = (i) => ({ ...i, app });
    outs.push(...rows.reduce((a, y) => (y.minus.length > a.length ? y.minus : a), []).map(tag));
    ins.push(...rows.reduce((a, y) => (y.plus.length > a.length ? y.plus : a), []).map(tag));
  }
  if (!outs.length) return { cost: 0, outs };
  const est = (i) => (i.hash ? estimate(String(i.app || 730), i.hash, x.t) : null);
  const gave = outs.map(est), got = ins.map(est), mine = est({ hash, app: x.app || 730 });
  if (!gave.every((v) => v != null) || !got.every((v) => v != null) || mine == null) return { cost: null, outs };
  const gs = got.reduce((a, b) => a + b, 0);
  return { cost: gs ? Math.round(gave.reduce((a, b) => a + b, 0) * (mine / gs)) : null, outs };
}

// ---------------------------------------------------------------- sales with no known origin
// Steam's own history has gaps, mostly early 2014: some case openings were never recorded, the item first shows up
// when it's listed (23.02.2014: 11 eSports keys bought, 8 openings recorded, 3 skins of that case "from nowhere").
// So: which cases hold this skin (casedb, from the game files) and were you opening one of them in the days before?
let caseIdx = null;
function casesWith(hash) {
  const db = store.get('caseDB', null);
  if (!db?.cases) return [];
  if (!caseIdx || caseIdx.at !== db.at) {
    const m = new Map();
    for (const [c, v] of Object.entries(db.cases)) {
      for (const name of [...(v.items || []).map((x) => x[0]), ...(v.rare || [])]) {
        const k = baseName(name);
        const a = m.get(k) || m.set(k, []).get(k);
        if (!a.includes(c)) a.push(c);
      }
    }
    caseIdx = { at: db.at, m };
  }
  return caseIdx.m.get(baseName(hash)) || [];
}
/**
 * when this copy first showed up: walking back from the sale over its listings and cancelled listings (they carry it
 * around without saying where it came from), the earliest of them; the sale itself when there are none.
 * G3SG1 Azure Zebra: listed 23.02.2014, back 27.02, listed again and sold 27.06 → 23.02.
 */
let seenIdx = null;
function firstSeen(hash, sale) {
  const at = ih.syncedAt();
  if (!seenIdx || seenIdx.at !== at) {
    const m = new Map();
    for (const e of ih.all()) for (const i of [...e.minus, ...e.plus]) if (i.hash) (m.get(i.hash) || m.set(i.hash, []).get(i.hash)).push(e);
    for (const a of m.values()) a.sort((p, q) => q.t - p.t);
    seenIdx = { at, m };
  }
  let t = sale;
  for (const e of seenIdx.m.get(hash) || []) {
    if (e.t > sale) continue;
    if (e.kind !== 'rynek' || /purchas|bought/i.test(e.desc)) break; // anything else would have named the origin
    t = e.t;
  }
  return t;
}
/** the two lines (and tooltip) for a sale whose origin Steam didn't record */
function unknownOrigin(x) {
  const day = (t) => new Date(t).toLocaleDateString();
  const first = ih.oldest();
  const line = (a, b, title) => `<div class="sub" title="${esc(title)}">${a}</div>${b ? `<div class="sub" style="color:#8f98a0" title="${esc(title)}">${b}</div>` : ''}`;
  // not CS2: that game's own inventory history was read too (allEvents) and had nothing either
  const app = String(x.appid || 730);
  const none = L('history.notInSteamsHistory');
  if (app !== '730') {
    const what = app === '753' ? L('history.steamCardBackgroundOrEmoticon') : appName(+app);
    const from = ih.oldest(+app);
    if (!ih.syncedAt(+app)) return line(none, what, L('history.theInventoryHistoryOfIsnt', { app: appName(+app) }));
    if (from && x.t < from) return line(none, L('history.olderThanTheHistory', { what }), L('history.soldAndTheInventoryHistory', { t: day(x.t), app: appName(+app), from: day(from) }));
    return line(none, what, L('history.neitherTheMarketHistoryNor', { app: appName(+app), app2: app === '753' ? L('history.cardsUsuallyDropForPlaying') : '' }));
  }
  if (first && x.t < first) return line(none, L('history.olderThanTheInventoryHistory'), L('history.soldAndTheSteamInventory', { t: day(x.t), first: day(first) }));
  const cases = casesWith(x.hash);
  const seen = firstSeen(x.hash, x.t);
  const opened = (memo?.co?.rows || []).filter((r) => r.caseIt?.hash && cases.includes(r.caseIt.hash) && r.e.t <= seen && r.e.t > seen - 14 * 86400000);
  if (opened.length) {
    const c = opened[0].caseIt.hash;
    const n = opened.filter((r) => r.caseIt.hash === c).length;
    return line(none, L('history.probablyFromThe', { c: esc(c) }), L('history.steamDidntRecordWhereThis', { c, seen: day(seen), n, t: day(opened[0].e.t) }));
  }
  if (cases.length) return line(none, L('history.skinFromThe', { cases: esc(cases[0]), cases2: cases.length > 1 ? L('history.andOthers') : '' }), L('history.steamDidntRecordWhereThis2', { cases: cases.join(', '), seen: day(seen) }));
  return line(none, '', L('history.notBoughtOnTheMarket', { ih: ih.isComplete() ? '' : L('history.theInventoryHistoryIsntFully') }));
}

function renderTx({ res, since, until = Infinity, all, dropTx }) {
  const items = new Map(res.items.map((it) => [it.hash, it]));
  // FIFO: which purchases are still unsold
  const unsoldOf = new Map();
  for (const t of all) if (t.type === 'buy') unsoldOf.set(bk(t), Math.max(0, (t.amount || 1) - (res.copies.get(bk(t))?.sold || 0)));
  // of a purchase's unsold copies, how many are gone: those FIFO saw leave, then the rest of the item's count, oldest first
  const goneOf = new Map();
  { const left = new Map(res.items.map((it) => [it.hash, (it.goneQty || 0) - (it.gone || 0)]));
    for (const t of [...all].sort((a, b) => a.t - b.t)) {
      if (t.type !== 'buy') continue;
      const k = bk(t), u = unsoldOf.get(k) || 0, l = left.get(t.hash) || 0;
      const seen = Math.min(u, res.copies.get(k)?.gone || 0), extra = Math.min(u - seen, l);
      if (seen + extra) goneOf.set(k, seen + extra);
      if (extra) left.set(t.hash, l - extra);
    } }
  // which inventory events took those copies (opened, traded, trade-up, sticker applied): per item in time order, each
  // purchase takes the next ones after it
  const fatesOf = new Map();
  { const outs = new Map();
    for (const e of ih.all()) {
      if (e.kind === 'rynek') continue;
      for (const i of e.minus || []) if (i.hash) (outs.get(i.hash) || outs.set(i.hash, []).get(i.hash)).push(e);
    }
    for (const a of outs.values()) a.sort((x, y) => x.t - y.t);
    // cases and terminals: the openings that the "Otwarte skrzynie" tab gives to market-bought copies (it knows which
    // opened copy came from a drop or a trade), so both tabs tell the same story
    for (const r of memo?.co?.rows || []) {
      const h = r.caseIt?.hash;
      if (!h || !/^kupiona/.test(r.caseSrc || '')) continue;
      if (!outs.has('case:' + h)) outs.set('case:' + h, []);
      outs.get('case:' + h).push({ ...r.e, kind: 'skrzynia', _row: r });
    }
    for (const k of outs.keys()) if (k.startsWith('case:')) outs.get(k).sort((x, y) => x.t - y.t);
    const ptr = new Map();
    for (const t of [...all].sort((a, b) => a.t - b.t)) {
      if (t.type !== 'buy') continue;
      const g = goneOf.get(bk(t));
      if (!g) continue;
      const ok = outs.has('case:' + t.hash) ? 'case:' + t.hash : t.hash;
      const list = outs.get(ok) || [];
      let i = ptr.get(ok) || 0;
      while (i < list.length && list[i].t < t.t) i++; // left before this purchase: another copy
      const mine = list.slice(i, i + g);
      ptr.set(ok, i + mine.length);
      if (mine.length) fatesOf.set(bk(t), mine);
    } }
  el.querySelector('#h-tbl thead').innerHTML = `<tr><th data-sort="t">${L('history.date')}</th><th data-sort="name">${L('history.item')}</th><th data-sort="type">${L('history.type')}</th>
    <th data-sort="price">${L('history.buySellPrice')}</th><th data-sort="today">${L('history.priceToday')}</th><th data-sort="pnl">${L('history.profitLoss')}</th></tr>`;
  // FIFO result per sale: realized entries share the sale's hash + time
  const pnlOf = new Map();
  for (const r of res.realized) {
    const k = r.hash + '|' + r.t;
    const x = pnlOf.get(k) || { pnl: 0, qty: 0, cost: 0 };
    x.pnl += r.pnl; x.qty += r.qty; x.cost += r.buy * r.qty;
    pnlOf.set(k, x);
  }
  // sales of items not bought on the market (and not a case drop already matched): the inventory-history event that
  // brought them, per item the oldest acquisition not yet used, before the sale
  const srcOfSale = new Map();
  { const acq = new Map();
    for (const e of allEvents()) {
      if (e.kind === 'rynek') continue;
      const had = new Set((e.minus || []).map((i) => i.hash));
      for (const it of e.plus || []) if (it.hash && !had.has(it.hash)) (acq.get(it.hash) || acq.set(it.hash, []).get(it.hash)).push(e);
    }
    for (const a of acq.values()) a.sort((x, y) => x.t - y.t);
    const used = new Map();
    for (const t of all.filter((x) => x.type === 'sell').sort((a, b) => a.t - b.t)) {
      const k = t.hash + '|' + t.t;
      if (pnlOf.has(k) || dropTx.has(k)) continue;
      const list = acq.get(t.hash) || [], i = used.get(t.hash) || 0;
      if (i < list.length && list[i].t <= t.t) { srcOfSale.set(k, list[i]); used.set(t.hash, i + 1); }
    } }
  // got for nothing: drops for playing, level / rank rewards, the Discovery Queue, gifts (not trades, cases, the store)
  const freeSrc = (e) => !['wymiana', 'kontrakt', 'skrzynia', 'naklejka'].includes(e.kind) && !/store|purchased/i.test(e.desc)
    && /gift|drop|earned|reward|level|rank|xp|discovery queue|game ?play/i.test(e.desc);
  // the cost of a sold item that wasn't bought on the market, from where it came: { cost | null, why, wait }
  const tradeEvAll = allEvents().filter((y) => y.kind === 'wymiana');
  const srcCost = (x) => {
    const e = x.src;
    if (freeSrc(e)) return { cost: 0, why: L('history.aDropRewardOrGift') };
    if (e.kind === 'wymiana' || e.kind === 'kontrakt') {
      const r = tradeCost(e, x.hash, tradeEvAll);
      const gave = r.outs.map((i) => i.name).join(', ');
      const day = e.kind === 'kontrakt' ? L('history.theContract') : L('history.theTrade');
      if (r.cost === 0) return { cost: 0, why: L('history.aGiftYouGaveNothing') };
      if (r.cost == null) return { cost: null, wait: true, why: L('history.costTheValueOfWhat', { gave, day }) };
      return { cost: r.cost, why: L('history.costTheMarketValueOf', { gave, day, cost: steam.fmt(r.cost) }) };
    }
    if (/store|purchased/i.test(e.desc)) {
      const p = sh.itemPaid(e.t, x.hash, storeConv);
      return p ? { cost: p.price, why: L('history.boughtInTheSteamStore', { price: steam.fmt(p.price), t: new Date(p.row.t).toLocaleDateString() }) }
        : { cost: null, why: L('history.boughtInTheSteamStore2') };
    }
    return { cost: null, why: L('history.costUnknownThisEventDoesnt') };
  };
  const srcLabel = (e) => {
    const d = new Date(e.t).toLocaleDateString();
    if (e.kind === 'naklejka') return L('history.takenOffAnItem', { d });
    if (e.kind === 'wymiana') return L('history.fromATrade', { d, href: e.partner?.href ? L('history.with', { e: partnerLink(e) }) : '' });
    if (e.kind === 'kontrakt') return L('history.fromAContract', { d });
    if (e.kind === 'skrzynia') return L('history.fromACaseCapsule', { d });
    if (/gift/i.test(e.desc)) return L('history.gift', { d });
    if (/discovery queue/i.test(e.desc)) return L('history.forTheStoreDiscoveryQueue', { d });
    if (/game ?play time/i.test(e.desc)) return L('history.dropForPlaying', { d });
    if (/store|purchased/i.test(e.desc)) return L('history.fromTheSteamStore', { d });
    if (/drop|earned|reward|level|rank|xp/i.test(e.desc)) return L('history.dropForPlaying2', { d });
    return `${esc(e.desc)} ${d}`;
  };
  const tx = all.filter((t) => t.t >= since && t.t <= until).map((t) => {
    const k = t.hash + '|' + t.t;
    const m = t.type === 'sell' ? pnlOf.get(k) : null;
    const drop = t.type === 'sell' ? dropTx.get(k) : null;
    const q = t.amount || 1;
    let pnl = null;
    if (m) pnl = m.pnl;
    else if (drop && drop.cost != null) pnl = drop.value - drop.cost;
    const low = nowPrice(t.hash, t.appid);
    // same basis as the price column: sells = on hand (after fee), buys = what the buyer pays
    const now = low == null ? null : t.type === 'sell' ? steam.receivedFromBuyer(low) : low;
    // plus = good for you: a buy that's worth more today, a sale that got more than today's price would
    const today = now == null || !t.price ? null : ((now - t.price) / t.price) * (t.type === 'sell' ? -1 : 1);
    return { ...t, q, m, drop, pnl, low, now, today, unsold: t.type === 'buy' ? unsoldOf.get(bk(t)) ?? 0 : 0, gone: t.type === 'buy' ? goneOf.get(bk(t)) ?? 0 : 0, fates: t.type === 'buy' ? fatesOf.get(bk(t)) || null : null, src: t.type === 'sell' && !m && !drop ? srcOfSale.get(k) || null : null };
  });
  const rows = txSort.apply(tx, {
    t: (x) => x.t, name: (x) => x.hash, type: (x) => x.type, price: (x) => x.price * x.q, today: (x) => (x.price ? x.today : null), pnl: (x) => x.pnl,
  });
  // identical neighbours → one row ×N: same day, item, side, price, estimate mark, state (in the inventory / sold /
  // gone) and, for sales, the same cost basis and result per unit
  const gkey = (x) => {
    const st = x.type === 'buy'
      ? (!x.unsold ? 'sold' : x.gone >= x.unsold ? 'gone' : x.gone ? 'mixed' : 'inv')
      : x.m ? `m${Math.round(x.m.cost / x.m.qty)}|${x.q ? Math.round(x.pnl / x.q) : x.pnl}` : x.drop ? `d${x.drop.case}|${x.drop.cost}|${x.pnl}` : `s${x.src?.kind || ''}|${x.src?.partner?.href || ''}|${x.src ? new Date(x.src.t).toDateString() : ''}`;
    return [new Date(x.t).toDateString(), x.hash, x.type, x.price, x.estimated ? 1 : 0, x.fx || '', st].join('|');
  };
  const groups = [], byKey = new Map();
  for (const x of rows) {
    const k = store.get('histGroup', true) ? gkey(x) : x.key || `${x.hash}|${x.t}|${Math.random()}`, g = byKey.get(k);
    if (g) { g.n += x.q; g.unsold += x.unsold || 0; g.gone += x.gone || 0; if (x.fates) g.fates = [...(g.fates || []), ...x.fates]; if (g.pnl != null && x.pnl != null) g.pnl += x.pnl; g.t0 = Math.min(g.t0, x.t); g.t1 = Math.max(g.t1, x.t); g.items.push(x); continue; }
    const ng = { k, x, n: x.q, unsold: x.unsold || 0, gone: x.gone || 0, fates: x.fates || null, pnl: x.pnl, t0: x.t, t1: x.t, items: [x] };
    byKey.set(k, ng);
    groups.push(ng);
  }
  renderPager('tx', groups.length);
  el.querySelector('#tx-h .cnt').textContent = `(${rows.length}${groups.length < rows.length ? L('history.inRows', { groups: groups.length }) : ''})`;
  const rowHtml = (g, child = false) => {
    const x = g.n > (g.x.q || 1) ? { ...g.x, pnl: g.pnl, unsold: g.unsold, gone: g.gone, fates: g.fates } : g.x;
    const many = g.n > 1;
    const split = !child && g.items.length > 1; // a merged row, can be opened
    const meta1 = meta.get(x.hash) || {};
    const pm = x.seed != null ? patternFor(x.hash, x.seed) : null; // 💎 a known pattern seed
    const sub = [x.float != null ? `<span title="float: ${x.float.toFixed(6)}">float ${x.float.toFixed(4)}</span>` : '', x.seed != null ? `seed ${x.seed}` : '', pm ? patternChip(pm) : ''].filter(Boolean).join(' · ');
    const mark = x.estimated ? ` <span class="warn" title="${L('history.priceEstimatedFromTheMarket')}">≈</span>`
      : x.fx ? ` <span class="warn" title="${L('history.convertedFromAnotherCurrencyAt')}">≈</span>` : '';
    let typ, res1 = '<span class="sub">-</span>';
    if (x.type === 'buy') {
      typ = `<span class="neg">${L('history.buy')}</span>`;
      const it = items.get(x.hash);
      if (!x.unsold) typ += `<div class="sub">${L('history.sold2')}</div>`;
      else if (x.gone >= x.unsold) typ += goneCell(it, x.gone, x.fates, split);
      else if (x.gone) typ += `<div class="sub">${invLink(x, meta1, L('history.inInventory', { unsold: x.unsold - x.gone }), !split && !many)}</div>${goneCell(it, x.gone, x.fates, split)}`;
      else typ += `<div class="sub">${invLink(x, meta1, `${L('history.inInventory2')}${many ? ` (${x.unsold})` : ''}`, !split && !many)}</div>`;
    }
    else {
      typ = `<span class="pos">${L('history.sale')}</span>`;
      if (x.m) {
        typ += `<div class="sub">${L('history.boughtFor')} ${steam.fmt(Math.round(x.m.cost / x.m.qty))}</div>`;
        res1 = `<b class="${x.pnl >= 0 ? 'pos' : 'neg'}">${x.pnl >= 0 ? '+' : ''}${steam.fmt(x.pnl)}</b>`;
      } else if (x.drop) {
        typ += `<div class="sub" title="${L('history.openingCostTheCaseThe')}">${L('history.dropFrom')} ${esc(x.drop.case)}${x.drop.cost != null ? ` · ${L('history.cost')} ${steam.fmt(x.drop.cost)}` : ''}</div>`;
        if (x.pnl != null) res1 = `<span class="${x.pnl >= 0 ? 'pos' : 'neg'}" title="${L('history.saleMinusTheOpeningCost')} (${esc(steam.fmt(x.drop.cost))})">${x.pnl >= 0 ? '+' : ''}${steam.fmt(x.pnl)}</span>`;
      } else if (x.src) {
        // what it cost: a drop / reward / gift nothing, a store purchase its price (store history), a trade the value of
        // what you gave; the sale is known, so the result is sale − cost
        const sc = srcCost(x);
        const n = g.n || 1;
        typ += `<div class="sub" title="${esc(`${L('history.notBoughtOnTheMarket2')}: ${x.src.desc} (${new Date(x.src.t).toLocaleString()}).\n${sc.why}`)}">${srcLabel(x.src)}${sc.cost ? ` · ${L('history.cost')} ${steam.fmt(sc.cost)}` : ''}</div>`;
        if (sc.cost != null) {
          const pnl = (x.price - sc.cost) * n;
          res1 = `<span class="${pnl >= 0 ? 'pos' : 'neg'}" title="${esc(`${sc.why}\n${L('history.profitYouGotCost', { price: steam.fmt(x.price * n), cost: steam.fmt(sc.cost * n) })}`)}">${pnl >= 0 ? '+' : ''}${steam.fmt(pnl)}</span>`;
        } else if (sc.wait) res1 = `<span class="sub" title="${esc(sc.why)}">…</span>`;
        else res1 = `<span class="sub" title="${esc(sc.why)}">-</span>`;
      } else typ += unknownOrigin(x);
    }
    const tip = x.low != null ? (x.type === 'sell' ? L('history.todayYoudGetAfterThe', { now: steam.fmt(x.now), low: steam.fmt(x.low) }) : L('history.lowestPriceTodayWhatYoud', { low: steam.fmt(x.low) })) : '';
    const d = new Date(x.t), hm = (t) => new Date(t).toLocaleTimeString(locale(), { hour: '2-digit', minute: '2-digit' });
    return `<tr${child ? ' style="background:rgba(102,192,244,.04)"' : ''}><td title="${esc(g.t0 !== g.t1 ? `${new Date(g.t0).toLocaleString()} - ${new Date(g.t1).toLocaleString()}` : d.toLocaleString())}">${d.toLocaleDateString()}<div class="sub">${g.t0 !== g.t1 ? `${hm(g.t0)}-${hm(g.t1)}` : hm(x.t)}</div></td>
      <td>${ui.itemCell({ ...meta1, hash: x.hash, name: meta1.name || x.hash, appid: meta1.appid || 730, sub: `${sub}${many ? `${sub ? ' · ' : ''}${split ? `<span data-txg="${esc(g.k)}" class="acc" style="cursor:pointer;font-weight:700" title="${L('history.identicalTradesThatDayClick', { n: g.n, k: txOpen.has(g.k) ? L('history.collapse') : L('history.expand') })}">${txOpen.has(g.k) ? '▾' : '▸'} ×${g.n}</span>` : `<b class="acc">×${g.n}</b>`}` : ''}` })}</td>
      <td>${typ}</td>
      <td title="${x.type === 'sell' ? esc(L('history.whatYouGotAfterSteams', { price: steam.fmt(steam.buyerFromReceived(x.price)) })) : L('history.whatYouPaid')}">${steam.fmt(x.price)}${mark}${many ? `<div class="sub">× ${g.n} = ${steam.fmt(x.price * g.n)}</div>` : ''}${x.type === 'sell' ? `<div class="sub">${L('history.youGot')}</div>` : ''}${x.q > 1 ? `<div class="sub">×${x.q} = ${steam.fmt(x.price * x.q)}</div>` : ''}</td>
      <td title="${esc(tip + (many && x.low != null ? `

${L('history.allUnitsToday', { n: g.n })}: ${steam.fmt(x.now * g.n)}${x.type === 'buy' ? L('history.aboutInHandAfterSelling', { low: steam.fmt(steam.receivedFromBuyer(x.low) * g.n) }) : ''}` : ''))}">${x.low != null ? `${steam.fmt(x.now)}${x.today != null && isFinite(x.today) ? `<div class="sub ${x.today >= 0 ? 'pos' : 'neg'}">${x.today >= 0 ? '+' : ''}${pct(x.today, 0)}</div>` : ''}${many ? `<div class="sub">× ${g.n} = ${steam.fmt(x.now * g.n)}</div>` : ''}` : '<span class="sub">…</span>'}</td>
      <td>${res1}</td></tr>`;
  };
  // an opened group: its transactions one by one under it
  el.querySelector('#h-tbl tbody').innerHTML = groups.length ? pageOf('tx', groups).map((g) => rowHtml(g) + (g.items.length > 1 && txOpen.has(g.k) ? g.items.map((x) => rowHtml({ k: g.k, x, n: x.q, unsold: x.unsold || 0, gone: x.gone || 0, pnl: x.pnl, t0: x.t, t1: x.t, items: [x] }, true)).join('') : '')).join('') : `<tr><td colspan="6" class="empty">${L('history.noTradesInThisPeriod')}</td></tr>`;
}


// ---------------------------------------------------------------- inventory history (trades, cases, trade-ups…)
/** "w ekwipunku" as a link: opens Ekwipunek scrolled to the item (the card with this purchase price first) */
function invLink(x, m, text, exact = false) {
  // exact: one purchase of one copy → Ekwipunek ungrouped, that copy; otherwise the grouped cards of this price
  return `<a href="#" class="acc" data-inv="${esc(x.hash)}" data-app="${m.appid || 730}" data-cost="${x.type === 'buy' ? x.price : ''}"${exact ? ` data-t="${x.t}"` : ''} title="${exact ? L('history.showThisCopyInInventory') : L('history.showTheseItemsInInventory')}">${text} ↗</a>`;
}
function goneCell(x, n = x.goneQty, evs = null, brief = false) {
  // the events that took these copies (given per purchase), else the latest one for the item
  const list = evs?.length ? evs : [ih.fateOf(x.hash)].filter(Boolean);
  const f = list[0];
  // the drop's name like the others: Polish when known (from your market history), without the wear in brackets
  // (inventory-history names don't have it; the market names do)
  const nm = (i) => displayName(i.hash, i.name) || '?';
  const got = (e) => (e.plus || []).filter((i) => i.hash && i.hash !== x.hash).map(nm);
  // a sealed terminal: unsealing only turns it into an "Active" one; what you bought in it is a later event, which
  // the case openings already tie to this unsealing (null: the Active terminal wasn't used yet)
  const term = (e) => {
    if (!/terminal/i.test(x.hash || '')) return null;
    if (e._row) return { bought: e._row.drops.map(nm) }; // given by the case openings
    if (!e.minus?.some((i) => i.hash === x.hash)) return null;
    const row = memo?.co?.rows.find((r) => r.terminal && r.e.unseal === e.id);
    return { bought: row ? row.drops.map(nm) : null };
  };
  const what1 = (e, dated = true) => {
    const d = dated ? ` ${new Date(e.t).toLocaleDateString()}` : '', g = got(e);
    if (e.kind === 'skrzynia') {
      const tm = term(e);
      if (tm) return L('history.activated', { d, bought: tm.bought == null ? L('history.notUsedYet') : tm.bought.length ? L('history.bought2', { bought: tm.bought.join(', ') }) : L('history.nothingBought') });
      return L('history.opened', { d, g: g.length ? `: ${g.join(', ')}` : '' });
    }
    if (e.kind === 'naklejka') return L('history.applied', { d, g: g.length ? L('history.to', { g: g.join(', ') }) : '' });
    if (e.kind === 'kontrakt') return L('history.contract2', { d, g: g.length ? L('history.got', { g: g.join(', ') }) : '' });
    if (e.kind === 'wymiana') return L('history.traded', { d });
    return `${kindName(e.kind)}${d}`;
  };
  const short = (e) => (e.kind === 'skrzynia' ? (term(e) ? L('history.activated2') : L('history.opened2')) : { wymiana: L('history.traded2'), kontrakt: L('history.contract'), naklejka: L('history.applied2') }[e.kind] || kindName(e.kind));
  // a merged row with several events: just what happened, the details are in its rows (▸ ×N)
  if (brief && list.length > 1) {
    const kinds = [...new Set(list.map(short))].join(', ');
    return `<div class="sub" title="${L('history.detailsAfterExpandingTheGroup')}">${n} ${L('history.outOfInv')} · <span class="acc">${esc(kinds)}</span></div>`;
  }
  const what = f ? what1(f) + (list.length > 1 ? ` +${list.length - 1}` : '') : '';
  const line = (e) => {
    const g = got(e).join(', ');
    const w = e.kind === 'wymiana' ? L('history.traded3', { name: e.partner?.name ? L('history.with2', { name: e.partner.name }) : '', g: g ? L('history.got2', { g }) : '' }) : what1(e, false);
    return `${new Date(e.t).toLocaleString()}: ${w}`;
  };
  const title = f ? list.map(line).join('\n') : L('history.boughtOnTheMarketBut');
  return `<div class="sub" title="${esc(title)}">${n} ${L('history.outOfInv')}${what ? ` · <span class="acc">${esc(what)}</span>` : ''}${f?.partner ? ` ${L('history.with3')} ${partnerLink(f)}${ownerBtn(f, x.hash)}` : ''}</div>`;
}

let ihTask = null;
const syncInv = once(() => ihBusy, (v) => (ihBusy = v), syncInvNow);
/** the games besides CS2 whose inventory history is read: Steam's own items always, plus every game in your market trades */
const otherApps = () => [...new Set([753, ...Object.values(loadTrades()).map((t) => +t.appid).filter((a) => a && a !== 730)])];
const appName = (app) => ({ 753: L('history.steamCardsAndBackgrounds'), 252490: 'Rust', 440: 'Team Fortress 2', 570: 'Dota 2' }[app] || L('history.game', { app }));
/** CS2's inventory history + the other games' (deduplicated) */
const allEvents = () => [...ih.all(), ...ih.allOf(otherApps())];
async function syncInvNow(full) {
  if (!(await steam.ensureLogin())) return;
  ihTask = token();
  const info = el.querySelector('#ih-info');
  try {
    const n = await ih.sync({ full, isCancelled: () => ihTask.cancelled, onProgress: (cnt, pages, oldest) => { invalidate(); renderInv(); info.textContent = L('history.downloadingNewEventsPages', { cnt, pages, oldest: oldest ? L('history.reached', { oldest: new Date(oldest).toLocaleDateString() }) : '' }); } });
    ui.log(L('history.inventoryHistoryEvents', { n }), 'ok');
  } catch (e) {
    ui.log(L('history.inventoryHistory2') + e.message, 'err');
  }
  // the other games you traded on the market (Steam's own items 753: card drops, badge crafting; Rust…): only for where
  // items came from (itemOrigins, the sources of sales); each in its own store, the CS2 history above isn't touched
  for (const app of otherApps()) {
    if (ihTask.cancelled) break;
    try {
      const s = await ih.sync({ app, full, isCancelled: () => ihTask.cancelled });
      if (s) ui.log(L('history.inventoryHistoryEvents2', { app: appName(app), s, app2: ih.isComplete(app) ? L('history.complete') : L('history.notCompleteYet') }), 'ok');
    } catch (e) {
      ui.log(`${L('history.inventoryHistory')} (${appName(app)}): ${e.message}`, 'warn');
    }
  }
  invalidate();
  renderInv();
  render();
}

function renderInv(listOnly = false) {
  if (!el) return;
  if (listOnly !== true) renderCases();
  const k = el.querySelector('#ih-kind').value;
  const q = el.querySelector('#ih-q').value.trim().toLowerCase();
  const since = period ? Date.now() - period * 86400000 : 0;
  // the game chosen at the top: CS2, one other game's own history, or all of them together
  const src = game === 'all' ? allEvents().sort((a, b) => b.t - a.t) : game === '730' ? ih.all() : ih.allOf([+game]);
  const evs = src.filter((e) => e.t >= since && (!k || e.kind === k)
    && (!q || matchSearch(`${e.desc} ${e.partner?.name || ''} ${[...e.plus, ...e.minus].map((i) => i.name + ' ' + (i.hash || '')).join(' ')}`, q)));
  el.querySelector('#ih-h .cnt').textContent = `(${evs.length})`;
  // counts and completeness of the chosen game's history (all: CS2's, the main one)
  const gApp = game === 'all' ? 730 : +game;
  const gOld = src.length ? src[src.length - 1].t : null;
  el.querySelector('#ih-info').textContent = ih.syncedAt(gApp)
    ? L('history.eventsStoredSynced', { src: src.length, gApp: timeAgo(ih.syncedAt(gApp)), gOld: gOld ? L('history.since', { gOld: new Date(gOld).toLocaleDateString() }) : '', gApp2: ih.isComplete(gApp) ? L('history.wholeHistory2') : L('history.olderOnesNotDownloadedYet') })
    : L('history.notSynced');
  const chip = (i, sign) => `<span class="tag" style="margin:1px 2px;border-color:${sign === '-' ? '#7a2b2b' : '#3d5a12'}"><span class="${sign === '-' ? 'neg' : 'pos'}">${sign === '-' ? '−' : '+'}</span> <span style="color:#${esc(i.color || 'c6d4df')}">${esc(i.name)}</span></span>`;
  renderPager('ih', evs.length);
  el.querySelector('#ih-list').innerHTML = evs.length ? `<table><thead><tr><th>${L('history.date')}</th><th>${L('history.event')}</th><th>${L('history.items')}</th></tr></thead><tbody>${pageOf('ih', evs).map((e) => `
    <tr><td style="white-space:nowrap">${new Date(e.t).toLocaleString()}</td>
    <td><span class="tag">${kindName(e.kind)}</span> ${e.partner?.name ? esc(e.desc).replace(esc(e.partner.name), partnerLink(e)) : esc(e.desc)}</td>
    <td>${e.minus.map((i) => chip(i, '-')).join('')}${e.plus.map((i) => chip(i, '+')).join('')}</td></tr>`).join('')}</tbody></table>`
    : `<div class="empty">${L('history.noEventsInThisPeriod')}${ih.syncedAt() ? '' : L('history.clickSync')}.</div>`;
}

// ---------------------------------------------------------------- case openings: what dropped, what it cost, profit
// Data: inventory history "Unlocked a container" (−case −key +drop), matched with market trades (FIFO by item
// name and time) and the current inventory. Keys come from the Steam store: their price is taken from the store
// purchase history, else 2.49 USD at the rate of that day.
const isKey = (i) => /\bkey\b/i.test(i.hash || i.name || '');
/** store price of a key (2.49 USD) in the wallet currency at today's rate */
function keyPrice() {
  const usd = rateFor(1);
  return usd ? Math.round(249 * usd) : 249;
}
/** expected price of one store key on a day: 2.49 USD at that day's rate (for recognising key purchases) */
function keyExpect(ts) {
  const { r } = histRate(1, ts);
  return r ? Math.round(249 * r) : keyPrice();
}
/** key price on a given day when that key purchase isn't matched in the store history */
function keyPriceAt(ts) {
  // what you really paid for a key in your currency: nearest key purchase in your store history
  const near = sh.nearestKeyPrice(ts, CUR_NAME[steam.wallet().currency], keyExpect);
  if (near && Math.abs(near.t - ts) < 400 * 86400000) return { price: near.price, src: L('history.likeYourKeyFrom') + new Date(near.t).toLocaleDateString() };
  const { r, src } = histRate(1, ts);
  if (r && src === 'nbp') return { price: Math.round(249 * r), src: L('history.249UsdAtThat') };
  return { price: keyPrice(), src: L('history.249UsdAtTodays') };
}

/**
 * A key's price today for "Czy warto otwierać?": your own purchase from the last 400 days, else 2.49 USD at the real
 * USD rate. { price, at (of that purchase) }, or null while the rate isn't known: never a guess in the wrong currency.
 */
export function keyPriceNow() {
  const now = Date.now(), cur = CUR_NAME[steam.wallet().currency];
  const recent = (k) => (k && now - k.t < 400 * 86400000 ? { price: k.price, at: k.t } : null);
  const named = recent(sh.nearestKeyPrice(now, cur)); // a row that names a key needs no rate (and no request for one)
  if (named) return named;
  const usd = rateFor(1);
  if (!usd) return null;
  return recent(sh.nearestKeyPrice(now, cur, keyExpect)) || { price: Math.round(249 * usd) };
}
/** the same, after waiting for the exchange rate if it's still being fetched */
export async function keyPriceReady() {
  if (!keyPriceNow()) await fxLoading.get(1);
  return keyPriceNow();
}

const syncStore = once(() => sBusy, (v) => (sBusy = v), syncStoreNow);
async function syncStoreNow() {
  el.querySelector('#cs-info').textContent = L('history.downloadingThePurchaseHistory');
  try {
    const rows = await sh.sync({ onProgress: (n) => { el.querySelector('#cs-info').textContent = L('history.purchaseHistory', { n }); } });
    ui.log(L('history.steamPurchaseHistoryEntriesCs2', { rows: rows.length, isCS: rows.filter(sh.isCS).length }), 'ok');
  } catch (e) { ui.log(L('history.steamPurchaseHistory') + e.message, 'err'); }
  invalidate();
  render(); renderInv();
}
/** hash → the list's entries of that item, in the list's order */
function byHash(list) {
  const m = new Map();
  for (const x of list) { const a = m.get(x.hash); if (a) a.push(x); else m.set(x.hash, [x]); }
  return m;
}
/** nearest market purchase of an item to a moment; every purchase is handed out once */
function buyMatcher(buys) {
  const pool = buys.map((b) => ({ ...b }));
  return {
    priceOf(hash, t) {
      const c = pool.filter((b) => !b.used && b.hash === hash).sort((a, b) => Math.abs(a.t - t) - Math.abs(b.t - t))[0];
      if (c) c.used = true;
      return c ? c.price : null;
    },
    unmatched: () => pool.filter((b) => !b.used),
  };
}
/** one trade can show up as two rows ("You traded with X." + "Traded") → how many of the n copies in event x are new */
function tradeDeduper() {
  const seen = new Map();
  return (x, hash, n) => {
    if (x.kind !== 'wymiana') return n;
    const k = Math.round(x.t / 120000) + '|' + hash;
    const add = Math.max(0, n - (seen.get(k) || 0));
    seen.set(k, Math.max(n, seen.get(k) || 0));
    return add;
  };
}
function caseOpenings() {
  const { list: trades } = converted(timedTrades().all);
  const events = ih.all();
  // terminals (e.g. "Sealed Dead Hand Terminal"): the item bought in it may arrive in the same event or as a separate one right after
  const isTerm = (i) => /terminal/i.test(i.hash || i.name || '');
  const byT = [...events].sort((a, b) => a.t - b.t);
  // Sealed terminal → unsealing turns it into an "Active" terminal (not a purchase, hidden here).
  // Using the Active terminal = the in-game purchase; the bought item arrives in the same event or right after.
  const isSealed = (i) => /sealed/i.test(i.hash || i.name || '') && isTerm(i);
  const isActive = (i) => isTerm(i) && !isSealed(i);
  const junk = (i) => isTerm(i) || isKey(i) || /\b(case|capsule|package)\b/i.test(i.hash || i.name || '');
  const unseals = byT.filter((e) => e.minus.some(isSealed));
  const sealUsed = new Set();
  const opens = byT.filter((e) => e.kind === 'skrzynia' && !e.minus.some(isTerm) && e.plus.length).concat(
    byT.filter((e) => e.minus.some(isActive)).map((e) => {
      // which sealed terminal became this Active one: latest unused unsealing before it
      // (not later than it: an Active terminal used at 01:25 wasn't unsealed at 01:26; same minute is fine)
      const u = [...unseals].reverse().find((x) => !sealUsed.has(x) && x.t <= e.t);
      if (u) sealUsed.add(u);
      const sealedIt = u?.minus.find(isSealed);
      // Steam: 'Purchased from Arms Dealer' (−Active +item) = purchase; 'Unlocked a container' (−Active, nothing) = used without buying
      return { ...e, minus: sealedIt ? [sealedIt] : e.minus.filter(isActive), plus: e.plus.filter((i) => !junk(i)), terminal: true, unseal: u ? u.id : null };
    })).sort((x, y) => x.t - y.t);
  const buys = trades.filter((t) => t.type === 'buy').sort((a, b) => a.t - b.t);
  const sells = trades.filter((t) => t.type === 'sell').sort((a, b) => a.t - b.t);
  const buysBy = byHash(buys), sellsBy = byHash(sells);
  const tradesOut = events.filter((e) => e.kind === 'wymiana' && e.minus.length).sort((a, b) => a.t - b.t);
  const used = new Set();
  const owned = new Map(ownedNow() || []);
  let waiting = 0;
  const shUsed = new Set();
  // rates for the key estimate (USD) and for store purchases made in another currency (euro keys in 2014-15)
  const w = steam.wallet().currency;
  ensureNbp([...opens.filter((e) => e.minus.some(isKey)).map((e) => ({ cur: 1, t: e.t })), ...sh.all().filter((x) => CUR_ID[x.cur] && CUR_ID[x.cur] !== w).map((x) => ({ cur: CUR_ID[x.cur], t: x.t }))]);
  // every way a case/terminal got into the inventory, oldest first (market buys come from the market history;
  // inventory-history "market" events are the same purchases, so they're skipped)
  // Inventory history has the exact moment each copy arrived (market purchase, drop, trade); market-history dates
  // are only interpolated, so they're used just for the price paid (nearest purchase of that item).
  const bought = buyMatcher(buys);
  const newCopies = tradeDeduper();
  const acq = [];
  const moves = []; // copies put on the market (they leave) and listings cancelled (they come back)
  for (const x of byT) {
    if (x.kind === 'rynek' && !/purchas|bought/i.test(x.desc)) {
      for (const i of x.minus) if (i.hash) moves.push({ t: x.t, hash: i.hash, op: 'list' });
      for (const i of x.plus) if (i.hash) moves.push({ t: x.t, hash: i.hash, op: 'back' });
      continue;
    }
    const counts = new Map();
    for (const i of x.plus) if (i.hash) counts.set(i.hash, (counts.get(i.hash) || 0) + 1);
    for (const [hash, n] of counts) {
      const add = newCopies(x, hash, n);
      for (let j = 0; j < add; j++) {
        if (x.kind === 'wymiana') acq.push({ t: x.t, hash, src: 'z wymiany' });
        else if (x.kind === 'rynek') acq.push({ t: x.t, hash, src: 'kupiona', price: bought.priceOf(hash, x.t) });
        else acq.push({ t: x.t, hash, src: 'z dropu' });
      }
    }
  }
  // purchases older than the inventory history (no matching event), keep them with their market-history date
  for (const b of bought.unmatched()) acq.push({ t: b.t, hash: b.hash, price: b.price, src: 'kupiona' });
  acq.sort((a, b) => a.t - b.t);
  const acqBy = byHash(acq);
  const acqUsed = new Set();
  // a copy put on the market (and sold) wasn't opened later: the oldest one you had then leaves the pool; a cancelled
  // listing brings it back
  { const listed = new Map();
    for (const mv of moves) {
      const st = listed.get(mv.hash) || listed.set(mv.hash, []).get(mv.hash);
      if (mv.op === 'list') { const a = (acqBy.get(mv.hash) || []).find((x) => !acqUsed.has(x) && x.t <= mv.t); if (a) { acqUsed.add(a); st.push(a); } }
      else { const a = st.pop(); if (a) acqUsed.delete(a); }
    } }
  // copies you still own weren't opened: take them out of the pool first. Trade protection ("Tradable After …")
  // lasts 7 days from when the item arrived, so it tells which acquisition a still-owned copy is (those first); the
  // others are the newest copies left, openings take the oldest first (same rule as origins() below). It used to keep
  // the OLDEST unprotected copy: when the terminals bought 13.11 lost their protection on 20.11, the 9.11 drop became
  // "still owned" and the UMP-45 bought in a terminal on 12.11 got one bought the next night (1,42 zł instead of ~1,27).
  const owns = ownedItems(), pinned = new Set();
  const free = (it) => (acqBy.get(it.hash) || []).filter((x) => !acqUsed.has(x));
  for (const it of owns) {
    const until = lockUntil(it.lock);
    if (!until) continue;
    const got = arrivedAt(until);
    const kept = free(it).filter((x) => Math.abs(x.t - got) < 2 * 86400000).sort((a, b) => Math.abs(a.t - got) - Math.abs(b.t - got))[0];
    if (kept) { acqUsed.add(kept); pinned.add(it); }
  }
  for (const it of owns) {
    if (pinned.has(it)) continue;
    const pool = free(it);
    if (pool.length) acqUsed.add(pool[pool.length - 1]); // acq is oldest first: the newest copy left
  }
  const take = (list, pred) => { const x = list.find((y) => !used.has(y) && pred(y)); if (x) used.add(x); return x; };
  const net = (p) => (p == null ? null : steam.receivedFromBuyer(p));

  const rows = opens.map((e) => {
    const caseIt = e.minus.find((i) => !isKey(i)) || (e.terminal ? { name: 'Terminal' } : null);
    const keyIt = e.minus.find(isKey);
    // cost of the case: which copy got opened? FIFO, the oldest one you had (market buy, drop or trade)
    let caseCost = null, caseSrc = '';
    if (caseIt?.hash) {
      const pool = acqBy.get(caseIt.hash) || [];
      const a = pool.find((x) => !acqUsed.has(x) && x.t <= e.t + 60000)
        || pool.find((x) => !acqUsed.has(x) && x.src === 'kupiona' && x.t <= e.t + 86400000);
      if (a) acqUsed.add(a);
      if (a?.src === 'kupiona' && a.price != null) { caseCost = a.price; caseSrc = `kupiona ${new Date(a.t).toLocaleDateString()}`; }
      else {
        const v = net(estimate('730', caseIt.hash, e.t));
        if (v == null) waiting++;
        caseCost = v;
        caseSrc = `${a?.src || 'z dropu'}${a ? ' ' + new Date(a.t).toLocaleDateString() : ''}`;
      }
    }
    let keyCost = 0, keySrc = '';
    if (keyIt) {
      const b = keyIt.hash && take(buysBy.get(keyIt.hash) || [], (t) => t.t <= e.t + 86400000);
      const kp = !b ? sh.keyPaid(e.t, shUsed, keyExpect(e.t), storeConv) : null;
      const ka = !b && !kp ? keyPriceAt(e.t) : null;
      keyCost = b ? b.price : kp ? kp.price : ka.price;
      keySrc = b ? L('history.fromTheMarket') : kp ? `${L('history.purchaseHistory2')} ${new Date(kp.row.t).toLocaleDateString()}` : ka.src;
    }
    // what happened to each drop
    const drops = e.plus.map((d) => {
      if (!d.hash) return { ...d, fate: L('history.unknown'), value: null };
      const s = take(sellsBy.get(d.hash) || [], (t) => t.t >= e.t - 60000);
      if (s) return { ...d, fate: `${L('history.sold3')} ${new Date(s.t).toLocaleDateString()}`, value: s.price, kind: 'sold', saleT: s.t };
     // one trade can carry several of your drops → don't consume it, just skip trades this drop already used
      const tr = tradesOut.find((o) => o.t >= e.t && o.minus.some((i) => i.hash === d.hash) && !used.has(o.id + '|' + d.hash));
      if (tr) {
        used.add(tr.id + '|' + d.hash);
        // value = your share of what you got in return: (this item's market value / everything you gave) × value received
        const est = (i) => (i.hash ? net(estimate('730', i.hash, tr.t)) : null);
        const mine = est(d);
        const gave = tr.minus.map(est), got = tr.plus.map(est);
        let v = mine, how = L('history.marketPriceOfTheTrade');
        if (tr.plus.length && mine != null && gave.every((x) => x != null) && got.every((x) => x != null)) {
          const gaveSum = gave.reduce((a, b) => a + b, 0), gotSum = got.reduce((a, b) => a + b, 0);
          if (gaveSum > 0) { v = Math.round((mine / gaveSum) * gotSum); how = L('history.shareOfWhatYouGot', { mine: steam.fmt(mine), gaveSum: steam.fmt(gaveSum), gotSum: steam.fmt(gotSum) }); }
        } else if (tr.plus.length && mine != null) waiting++;
        if (v == null) waiting++;
        return { ...d, fate: `${L('history.traded4')} ${new Date(tr.t).toLocaleDateString()}`, value: v, kind: 'traded', tr, title: `${tr.desc}${tr.plus.length ? L('history.inReturn') + tr.plus.map((i) => i.name).join(', ') : L('history.youGotNothingInReturn')}\n${L('history.value')}: ${how}` };
      }
      if ((owned.get(d.hash) || 0) > 0) {
        owned.set(d.hash, owned.get(d.hash) - 1);
        const low = prices.cached('730', d.hash)?.lowest;
        return { ...d, fate: L('history.inYourInventory'), value: net(low), kind: 'owned' };
      }
      const v = net(estimate('730', d.hash, e.t));
      if (v == null) waiting++;
      return { ...d, fate: L('history.notInTheInventory'), value: v, kind: 'gone' };
    });
    // terminal: the in-game payment isn't in any Steam history → entered by the user
    let paid = null, paidSrc = '';
    if (e.terminal && drops.length) {
      const manual = store.get('termPaid', {})[e.id];
      if (manual != null) { paid = manual; paidSrc = 'wpisane'; } // codes, not texts: renderCases() compares them (see srcText)
      else { const tp = sh.terminalPaid(e.t, drops[0]?.name, shUsed, keyExpect(e.t), storeConv); if (tp) { paid = tp.price; paidSrc = 'historia zakupów'; } }
    }
    const cost = (caseCost ?? 0) + keyCost + (paid ?? 0);
    const value = drops.reduce((s, d) => s + (d.value ?? 0), 0);
    const known = caseCost != null && drops.every((d) => d.value != null);
    const unknownPaid = !!e.terminal && paid == null && drops.length > 0;
    return { e, caseIt, keyIt, caseCost, caseSrc, keyCost, keySrc, drops, cost, value, profit: known && !unknownPaid ? value - cost : null, terminal: !!e.terminal, paid, paidSrc, unknownPaid };
  });
  return { rows: rows.reverse(), waiting };
}

/** how a stored source code (caseSrc / paidSrc, kept in Polish because the code compares them) reads to you */
const srcText = (s = '') => s.replace(/^(kupiona|z wymiany|z dropu|wpisane|historia zakupów)/, (m) => ({ kupiona: L('history.bought3'), 'z wymiany': L('history.fromATrade2'), 'z dropu': L('history.fromADrop'), wpisane: L('history.entered'), 'historia zakupów': L('history.purchaseHistory2') }[m]));
function renderCases() {
  if (!el) return;
  const since = period ? Date.now() - period * 86400000 : 0;
  const { rows: allRows, waiting } = cases();
  const rows = allRows.filter((r) => r.e.t >= since);
  const done = rows.filter((r) => r.profit != null);
  const spent = rows.reduce((s, r) => s + r.cost, 0);
  const value = rows.reduce((s, r) => s + (r.unknownPaid ? 0 : r.value), 0); // terminal without the paid amount: left out
  const spentTerm = rows.reduce((s, r) => s + (r.terminal ? r.cost : 0), 0);
  const spentT = rows.reduce((s, r) => s + (r.unknownPaid ? r.cost : 0), 0);
  const best = [...rows].sort((a, b) => b.value - a.value)[0];
  const plus = done.filter((r) => r.profit > 0).length;
  el.querySelector('#cs-h .cnt').textContent = `(${rows.length})`;
  el.querySelector('#cs-info').textContent = (period ? L('history.periodLastDaysChangeIt', { period }) : '') + (waiting ? L('history.estimatingPrices', { waiting }) : '') + (ih.syncedAt() ? L('history.dataFromTheInventoryHistory') : L('history.syncTheInventoryHistoryThe')) + (sh.syncedAt() ? L('history.purchaseHistoryCs2Purchases', { isCS: sh.all().filter(sh.isCS).length }) : '');
  el.querySelector('#cs-cards').innerHTML = rows.length ? `
    <div class="card"><div class="k">${L('history.openings')}</div><div class="v">${rows.length}</div><div class="sub">${done.length ? L('history.inProfit', { plus, done: done.length }) : L('history.workingOutTheResult')}</div></div>
    <div class="card"><div class="k">${L('history.openingCost')}</div><div class="v">${steam.fmt(spent)}</div><div class="sub" title="${esc(`${L('history.casesAndKeys')}: ${steam.fmt(spent - spentTerm)}
${L('history.terminalsTerminalInGamePurchase')}: ${steam.fmt(spentTerm)}`)}">${spentTerm ? L('history.casesTerminals', { spent: steam.fmt(spent - spentTerm), spentTerm: steam.fmt(spentTerm) }) : L('history.casesKeys')}</div></div>
    <div class="card"><div class="k">${L('history.dropValue')}</div><div class="v">${steam.fmt(value)}</div><div class="sub">${L('history.afterTheFee')}</div></div>
    <div class="card"><div class="k">${L('history.profitLossOnCases')}</div><div class="v ${value - (spent - spentT) >= 0 ? 'pos' : 'neg'}">${steam.fmt(value - (spent - spentT))}</div><div class="sub">${spent - spentT ? pct((value - (spent - spentT)) / (spent - spentT)) : '-'}${spentT ? L('history.withoutTerminalsWithNoAmount') : ''}</div></div>
    ${best ? `<div class="card"><div class="k">${L('history.bestDrop')}</div><div class="v" style="font-size:14px;color:#${esc(best.drops[0]?.color || 'fff')}">${esc(best.drops[0]?.name || '')}</div><div class="sub">${steam.fmt(best.value)} · ${new Date(best.e.t).toLocaleDateString()}</div></div>` : ''}` : '';
  renderPager('cs', rows.length);
  el.querySelector('#cs-list').innerHTML = rows.length ? `<table><thead><tr><th>${L('history.date')}</th><th>${L('history.caseTerminal')}</th><th>${L('history.cost2')}</th><th>${L('history.dropPurchase')}</th><th>${L('history.whatHappenedToIt')}</th><th>${L('history.value')}</th><th>${L('history.profitLoss')}</th></tr></thead><tbody>${pageOf('cs', rows).map((r) => `
    <tr><td style="white-space:nowrap">${new Date(r.e.t).toLocaleString()}</td>
    <td><span class="tag" style="margin-right:5px;${r.terminal ? 'border-color:#8a6d1f;color:#e6c35c' : ''}" title="${r.terminal ? L('history.terminalOnceUnsealedYouCan') : L('history.aCaseOpenedWithA')}">${r.terminal ? 'terminal' : L('history.case')}</span>${esc((r.caseIt?.name || '?').replace(/^Sealed /, ''))}${r.terminal && r.drops.length && r.paidSrc !== 'historia zakupów' ? `<label class="sub" style="display:flex;gap:4px;align-items:center;margin-top:2px">${L('history.paid')} <input class="p" data-termpaid="${esc(r.e.id)}" value="${r.paidSrc === 'wpisane' ? toInput(r.paid) : ''}" placeholder="${r.paidSrc === 'historia zakupów' ? esc(toInput(r.paid)) : L('history.amount')}" style="width:64px;padding:2px 5px"></label>` : ''}</td>
    <td>${steam.fmt(r.cost)}<div class="sub">${r.paid != null ? `${L('history.inGamePurchase')} ${steam.fmt(r.paid)} (${srcText(r.paidSrc)}) · ` : ''}${r.caseIt ? `${r.terminal ? 'terminal' : L('history.case')} ${r.caseCost != null ? steam.fmt(r.caseCost) : '…'} (${srcText(r.caseSrc)})` : ''}${r.keyIt ? ` · ${L('history.key')} ${steam.fmt(r.keyCost)} (${r.keySrc})` : ''}</div></td>
    <td>${r.terminal && !r.drops.length ? `<span class="sub">${L('history.nothingBought')}</span>` : ''}${r.drops.map((d) => `<span style="color:#${esc(d.color || 'c6d4df')}">${esc(displayName(d.hash, d.name))}</span>`).join('<br>')}</td>
    <td>${r.drops.map((d) => `<span class="sub ${d.kind === 'owned' ? 'acc' : ''}" title="${esc(d.title || '')}">${esc(d.fate)}</span>${d.tr?.partner ? ` <span class="sub">${L('history.with3')} ${partnerLink(d.tr)}</span>${ownerBtn(d.tr, d.hash)}` : ''}`).join('<br>')}</td>
    <td>${r.drops.map((d) => (d.value != null ? steam.fmt(d.value) : '…') + (d.kind !== 'owned' ? nowCmp(d.hash, d.value) : '')).join('')}</td>
    <td class="${r.profit > 0 ? 'pos' : r.profit < 0 ? 'neg' : ''}">${r.profit != null ? steam.fmt(r.profit) : r.unknownPaid ? `<span class="sub warn" title="${L('history.enterTheAmountPaidIn')}">${L('history.enterAmount')}</span>` : '…'}</td></tr>`).join('')}</tbody></table>`
    : `<div class="empty">${L('history.noOpenedCasesInThis')}${ih.syncedAt() ? '' : L('history.syncTheInventoryHistoryFirst')}.</div>`;
}

// ---------------------------------------------------------------- partner links, "does he still have it", today's price
function partnerLink(e) {
  if (!e?.partner?.href) return '';
  return `<a href="${esc(e.partner.href)}" target="_blank" class="acc" title="${L('history.tradePartnersProfile')}">${esc(e.partner.name || L('history.profile'))}</a>`;
}
function ownerBtn(e, hash) {
  if (!e?.partner?.href || !hash) return '';
  const st = ih.ownerState(e.partner.href, hash);
  if (!st) return ` <button class="b s" data-owner="${esc(e.partner.href)}" data-hash="${esc(hash)}" title="${L('history.checksThePartnersPublicInventory')}">${L('history.doesHeStillHaveIt')}</button>`;
  return {
    checking: ` <span class="sub">${L('history.checking')}</span>`,
    has: ` <span class="ok" title="${L('history.thisItemSameNameAnd')}">✔ ${L('history.stillHasIt')}${st.n > 1 ? ` (${st.n})` : ''}</span>`,
    no: ` <span class="warn" title="${L('history.itIsntInTheirInventory')}">✘ ${L('history.noLongerHasIt')}</span>`,
    private: ` <span class="mut" title="${L('history.thePartnersInventoryIsPrivate')}">🔒 ${L('history.privateInventory')}</span>`,
    error: ` <span class="err" title="${esc(st.msg || '')}">${L('history.checkFailed')}</span>`,
  }[st.state] || '';
}

// today's price for comparison (queued in the background when not cached)
const nowQueue = new Map();
let nowTimer = null;
// (asked as the item's own game: it used to be CS2 always, so a Rust jacket or a Steam card stayed at "…" forever)
function nowPrice(hash, appid = 730) {
  if (!hash) return null;
  const app = /^\d+-/.test(hash) ? '753' : String(appid || 730); // "730-SWAT": Steam's own items sell under 753
  const c = prices.cached(app, hash);
  if (c?.lowest) return c.lowest;
  const k = app + '|' + hash;
  // (Steam items come from one search for many of them, so they aren't held back by the limit of one round)
  if (!prices.hasLowest(app, hash, 360) && (nowQueue.has(k) || nowQueue.size < 150 || app === '753')) {
    nowQueue.set(k, { appid: app, hash });
    clearTimeout(nowTimer);
    nowTimer = setTimeout(() => {
      const list = [...nowQueue.values()];
      nowQueue.clear();
      let last = 0;
      prices.lowestPrices(list, { priceOnly: true, onEach: () => { if (Date.now() - last > 1500) { last = Date.now(); render(true); } } }).then(() => { render(); renderInv(); });
    }, 1000);
  }
  return null;
}
/** "dziś 3,20 zł (+12%)", ref is what you got/paid "na rękę"; today's lowest is turned into "na rękę" too */
function nowCmp(hash, ref, { net = true } = {}) {
  const low = nowPrice(hash);
  if (low == null) return '';
  const today = net ? steam.receivedFromBuyer(low) : low;
  const d = ref ? (today - ref) / ref : null;
  const tip = net ? L('history.lowestPriceTodayInHand', { low: steam.fmt(low), today: steam.fmt(today) }) : L('history.lowestPriceToday', { low: steam.fmt(low) });
  return `<div class="sub" title="${esc(tip)}">${L('history.today')} ${steam.fmt(low)}${d != null && isFinite(d) ? ` <span class="${d >= 0 ? 'pos' : 'neg'}">(${d >= 0 ? '+' : ''}${pct(d, 0)})</span>` : ''}</div>`;
}

// ---------------------------------------------------------------- result per month (optional, 📅 Miesiące)
/**
 * One row per month of the period (and the chart's range): profit from flips (FIFO, as the cards), from opened cases
 * (only openings with a known result, as in "Otwarte skrzynie"), spent and received on the market, and their sum.
 */
let monthsOpen = null; // years expanded in the table
function drawMonths(res, all, inR) {
  const box = el?.querySelector('#h-months');
  if (!box) return;
  const on = store.get('histMonths', false);
  el.querySelector('[data-a="months"]')?.classList.toggle('on', on);
  if (!on) { box.innerHTML = ''; return; }
  const key = (t) => { const d = new Date(t); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; };
  const m = new Map();
  const row = (t) => { const k = key(t); return m.get(k) || m.set(k, { k, t, flip: 0, nf: 0, wins: 0, cases: 0, nc: 0, open: 0, spent: 0, recv: 0 }).get(k); };
  for (const r of res.realized) if (inR(r.t)) { const x = row(r.t); x.flip += r.pnl; x.nf++; if (r.pnl > 0) x.wins++; }
  for (const t of all) if (inR(t.t)) { const x = row(t.t); if (t.type === 'buy') x.spent += t.price * t.amount; else x.recv += t.price * t.amount; }
  for (const r of memo?.co?.rows || []) if (inR(r.e.t)) { const x = row(r.e.t); x.open++; if (r.profit != null) { x.cases += r.profit; x.nc++; } }
  const rows = [...m.values()].sort((a, b) => b.k.localeCompare(a.k));
  if (!rows.length) { box.innerHTML = `<div class="sub" style="padding:6px 0">${L('history.noTradesInThisPeriod')}</div>`; return; }
  monthsOpen ||= new Set([rows[0].k.slice(0, 4)]); // the newest year starts open
  box.innerHTML = `<div class="sub" style="display:flex;gap:10px;align-items:baseline;margin:6px 0 2px"><b style="color:#c6d4df;font-size:13px">${L('history.resultByMonth')}</b><span>${L('history.flipsAndCasesWithA')}</span></div>${monthsHtml(rows, monthsOpen, (v) => steam.fmt(Math.round(v)))}`;
  box.onclick = (e) => {
    const y = e.target.closest('[data-year]')?.dataset.year;
    if (!y) return;
    if (monthsOpen.has(y)) monthsOpen.delete(y); else monthsOpen.add(y);
    drawMonths(res, all, inR);
  };
}

// ---------------------------------------------------------------- P&L chart (optional, zoomable by dragging)
let chartPts = [], balancePts = [];
let chartZoom = null; // [from, to] timestamps, shared by both charts, the cards and the table
/** the points inside the zoomed range, with the value carried in from before it */
function zoomedPoints(pts) {
  if (!chartZoom) return pts;
  const [a, b] = chartZoom;
  const before = [...pts].reverse().find((x) => x[0] < a);
  const inside = pts.filter((x) => x[0] >= a && x[0] <= b);
  const lastV = (inside.length ? inside[inside.length - 1] : before)?.[1] ?? 0;
  return [[a, before ? before[1] : 0], ...inside, [b, lastV]];
}
function drawChart() {
  const box = el?.querySelector('#h-chart');
  if (!box) return;
  const charts = [
    { a: 'chart', on: store.get('histChart', false), pts: chartPts, title: L('history.cumulativeFlipProfit'), empty: L('history.tooFewSalesToDraw'), changeKey: 'flip.chartSale' },
    { a: 'chartbal', on: store.get('histChartBal', false), pts: balancePts, title: L('history.cumulativeBalance'), empty: L('history.tooFewTradesToDraw'), changeKey: 'flip.chartChange' },
  ];
  for (const c of charts) el.querySelector(`[data-a="${c.a}"]`)?.classList.toggle('on', c.on);
  const shown = charts.filter((c) => c.on);
  let hint = false; // the zoom hint / "show all" once, on the first chart drawn
  box.innerHTML = shown.map((c, i) => {
    if (c.pts.length < 2) return `<div class="sub" style="padding:6px 0">${c.empty}</div>`;
    const p = (c.p = zoomedPoints(c.pts));
    const x0 = p[0][0], x1 = p[p.length - 1][0];
    const delta = chartZoom ? p[p.length - 1][1] - p[0][1] : c.pts[c.pts.length - 1][1];
    const side = hint ? '' : chartZoom ? `<button class="b" data-a="chartreset">${L('history.showAll')}</button>` : `<span>${L('history.dragTheMouseOverThe')}</span>`;
    hint = true;
    return `<div class="sub" style="display:flex;gap:10px;align-items:baseline;flex-wrap:wrap;margin:6px 0 2px">
      <b style="color:#c6d4df;font-size:13px">${c.title}</b>
      <span>${chartZoom ? L('history.theTableAndCardsShow', { x0: new Date(x0).toLocaleDateString(), x1: new Date(x1).toLocaleDateString() }) : L('history.total3')}<b class="${delta >= 0 ? 'pos' : 'neg'}">${delta >= 0 ? '+' : ''}${steam.fmt(Math.round(delta))}</b></span>
      <span class="sp" style="flex:1"></span>${side}
    </div>
    <div class="pc-plot" data-chart="${i}" style="cursor:crosshair;user-select:none"></div>`;
  }).join('');
  shown.forEach((c, i) => {
    if (!c.p) return;
    profitChart(box.querySelector(`[data-chart="${i}"]`), {
      points: c.p,
      label: c.title,
      changeKey: c.changeKey,
      fmt: (v) => steam.fmt(Math.round(v)),
      onZoom: (from, to) => { chartZoom = [from, to]; pages.tx = 0; render(true); },
      onReset: () => { if (chartZoom) { chartZoom = null; pages.tx = 0; render(true); } },
    });
  });
}

// ---------------------------------------------------------------- where did each item I own come from, what did it cost
let originsMemo = null;
/**
 * assetid -> { src, t, cost (cents, buyer price / what you gave) | null, detail, wait }
 * src: 'kupiony' | 'ze skrzyni' | 'z terminala' | 'z wymiany' | 'z kontraktu' | 'drop'
 */
export function itemOrigins() {
  if (originsMemo && Date.now() - originsMemo.at < 60000) return originsMemo.map;
  const { list: trades } = converted(timedTrades().all);
  const bought = buyMatcher(trades.filter((t) => t.type === 'buy').sort((a, b) => a.t - b.t));
  // drops from cases / terminals with their share of the opening cost
  const drops = [];
  try {
    for (const r of cases().rows) {
      const share = r.drops.length ? 1 / r.drops.length : 1;
      for (const d of r.drops) if (d.hash) drops.push({ t: r.e.t, hash: d.hash, cost: r.caseCost == null || r.unknownPaid ? null : Math.round(r.cost * share), name: (r.caseIt?.name || '').replace(/^Sealed /, ''), terminal: r.terminal, used: false });
    }
  } catch { /* history not synced yet */ }
  const dropsBy = byHash(drops);
  const est = (hash, t, app = 730) => (hash ? estimate(String(app), hash, t) : null);
  const acq = [];
  const newCopies = tradeDeduper();
  // + the other games' histories (Steam items: card drops, booster packs, badge crafting; Rust…): their origins too
  const allEv = allEvents();
  const tradeEv = allEv.filter((y) => y.kind === 'wymiana');
  for (const x of [...allEv].sort((a, b) => a.t - b.t)) {
    // market events other than a purchase (a cancelled listing returns the item) aren't acquisitions
    if (x.kind === 'rynek' && !/purchas|bought/i.test(x.desc)) continue;
    const counts = new Map();
    for (const i of x.plus) if (i.hash) counts.set(i.hash, (counts.get(i.hash) || 0) + 1);
    // the same item going out and back in = it was modified (name tag, sticker applied/scraped, …), not acquired:
    // it keeps its original origin
    if (x.kind !== 'wymiana') for (const i of x.minus) if (i.hash && counts.get(i.hash) > 0) counts.set(i.hash, counts.get(i.hash) - 1);
    for (const [hash, n] of counts) {
      const add = newCopies(x, hash, n);
      for (let j = 0; j < add; j++) {
        const d = (dropsBy.get(hash) || []).find((y) => !y.used && Math.abs(y.t - x.t) < 5 * 60000);
        if (d) { d.used = true; acq.push({ t: x.t, hash, src: d.terminal ? 'z terminala' : 'ze skrzyni', detail: d.name, cost: d.cost, wait: d.cost == null }); continue; }
        if (x.kind === 'rynek') {
          const p = bought.priceOf(hash, x.t);
          // no matching row in the market history → the market price of that day
          const e = p == null ? est(hash, x.t, x.app) : null;
          acq.push({ t: x.t, hash, src: 'kupiony', cost: p ?? e, approx: p == null, wait: p == null && e == null, detail: '' });
          continue;
        }
        if (x.kind === 'wymiana' || x.kind === 'kontrakt') {
          const { cost, outs } = tradeCost(x, hash, tradeEv);
          const who = x.partner?.name ? ` ${L('history.from')} ${x.partner.name}` : '';
          acq.push({ t: x.t, hash, src: x.kind === 'kontrakt' ? 'z kontraktu' : 'z wymiany', detail: x.kind === 'kontrakt' ? '' : who, cost, wait: cost == null, gave: outs.map((i) => i.name) });
          continue;
        }
        // a Steam item ("730-SWAT": a card, background, emoticon) from playing or a booster pack
        acq.push({ t: x.t, hash, src: 'drop', detail: /^\d+-/.test(hash) ? `Steam: ${L('history.aGameDrop')} (${x.desc})` : x.desc, cost: 0 });
      }
    }
  }
  for (const b of bought.unmatched()) acq.push({ t: b.t, hash: b.hash, src: 'kupiony', cost: b.price, detail: '' });
  // copies sold on the market since can't be the ones you own: each sale takes the oldest acquisition before it (FIFO).
  // Without this, 3 SWAT cards bought in 2014, 2 of them sold in 2014-15, were "the 3 you own now" (kupiony 0,25 zł)
  // while today's came from card drops (Steam items: the inventory history is read for CS2 only, drops aren't seen).
  // Crafting (a Steam badge eats a set of cards, "Crafted …") takes copies away the same way.
  {
    const pools = byHash([...acq].sort((a, b) => a.t - b.t));
    const gone = trades.filter((t) => t.type === 'sell').map((t) => ({ hash: t.hash, t: t.t, amount: t.amount || 1 }));
    for (const x of allEv) if (/craft/i.test(x.desc)) for (const i of x.minus) if (i.hash) gone.push({ hash: i.hash, t: x.t, amount: 1 });
    for (const s of gone.sort((a, b) => a.t - b.t)) {
      const pool = pools.get(s.hash);
      for (let k = 0; pool && k < (s.amount || 1); k++) {
        const i = pool.findIndex((x) => x.t <= s.t);
        if (i < 0) break;
        pool.splice(i, 1)[0].sold = true;
      }
    }
  }
  const live = acq.filter((x) => !x.sold);
  // match the copies you own: trade protection ("Tradable After …") = arrival + 7 days pins the exact one;
  // otherwise the newest unmatched acquisitions (older copies were the ones sold/traded, FIFO)
  const map = new Map();
  const used = new Set();
  const own = ownedItems();
  const acqBy = byHash(live);
  const pick = (it, pred, order = (a, b) => b.t - a.t) => {
    const pool = (acqBy.get(it.hash) || []).filter((x) => !used.has(x) && pred(x)).sort(order);
    const got = pool[0];
    if (got) { used.add(got); map.set(it.assetid, got); }
    return got;
  };
  // a copy under trade protection: the acquisition closest to when it arrived (not just the newest of those days:
  // a terminal traded in at 23:46 and one bought at 01:24 the next night are 2 hours apart)
  for (const it of own) {
    const until = lockUntil(it.lock);
    if (until) { const at = arrivedAt(until); pick(it, (x) => Math.abs(x.t - at) < 2 * 86400000, (a, b) => Math.abs(a.t - at) - Math.abs(b.t - at)); }
  }
  for (const it of own) if (!map.has(it.assetid)) pick(it, () => true);
  // items on the market have other asset ids → newest acquisition per item not matched above
  for (const x of [...live].sort((a, b) => b.t - a.t)) if (!used.has(x) && !map.has('h:' + x.hash)) map.set('h:' + x.hash, x);
  originsMemo = { at: Date.now(), map };
  return map;
}
