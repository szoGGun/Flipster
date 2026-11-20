import * as ui from '../core/ui.js';
import * as steam from '../core/steam.js';
import * as prices from '../core/prices.js';
import * as store from '../core/store.js';
import { settings } from '../core/store.js';
import { withLock, token, isLeader } from '../core/jobs.js';
import { competitorSell, listAdvice, listAdviceFill, sellChance, floatRank, LIST_SHARE } from '../core/analysis.js';
import * as casedb from './casedb.js';
import { parsePrice, toInput, esc, icon, matchSearch, lockUntil, fmtWhen, daysTxt as fmtDays, shareTxt } from '../core/util.js';
import { MIN_BUYER } from '../core/fees.js';
import { sellMany } from './relist-engine.js';
import * as sig from './sellsignals.js';
import { itemOrigins } from './history.js';
import * as research from './research.js';
import { patternFor, patternChip, patternClass } from './patternmark.js';
import * as patterndb from './patterndb.js';
import * as markettrend from './markettrend.js';
import { L, dec } from '../core/i18n.js';

const APPS = [[730, 2, 'CS2'], [570, 2, 'Dota 2'], [440, 2, 'TF2'], [252490, 2, 'Rust'], [753, 6, L('inventory.steamCards')]];
let el;
let items = [];
let listed = []; // items currently listed on the market (shown with their own filter)
let sel = new Set();
let shown = 200;
let task = null;
let app = [730, 2];
const sellRules = store.bucket('sellRules');
const invMkMode = () => store.get('invMkMode', 'sell'); // which items to show: 'all' / 'sell' / 'lock' / 'unsell'
// 📌 "na sprzedaż": items you want to get rid of, a filter of their own, and their offers are re-checked every 10 min
// with the changes in the log. Keyed by market name: every copy of that skin / wear counts.
const sellWatch = store.bucket('invSellWatch'); // hash -> {at}
const watchSeen = new Map(); // hash -> {low, sellNow, sig}: what the last check saw
let watching = false;
const wtBtn = (it) => (it.hash && (it.listed || it.marketable || it.lock) ? `<button class="wt ${sellWatch.get(it.hash) ? 'on' : ''}" data-wt="${esc(it.hash)}" title="${sellWatch.get(it.hash) ? L('inventory.forSaleClickToUnmark') : L('inventory.markForSaleTheFor')}">📌</button>` : '');

const steamOf = (it) => prices.cached(it.appid, it.hash);

// ---------------------------------------------------------------- what to list it at (listAdvice in analysis.js)
const fmtWait = (d) => (d == null ? '' : d < 1 / 24 ? L('inventory.inUnderAnHour') : d < 1 ? L('inventory.inAboutH', { d: Math.round(d * 24) }) : L('inventory.inAboutDays', { d: dec(d, 1) }));
const pctOf = (c) => `${Math.round(c * 100)}%`;
/**
 * from the listings saved at valuation (no request), or from a fresh order book `h` right before listing.
 * The item's own hour-by-hour record (listAdviceFill) when its price history is in; the queue model otherwise.
 */
export function adviceOf(it, h = null) {
  const s = steamOf(it);
  const graph = h?.sellGraph || s?.ask;
  if (!graph?.length) return null;
  const table = sig.fill(it.hash);
  if (table) {
    const a = listAdviceFill({ table, sellGraph: graph, highestBuy: h ? h.highestBuy : s?.bid ?? null, net: (p) => steam.receivedFromBuyer(p), maxWaitDays: settings.maxWaitDays ?? 2, undercut: settings.undercut });
    if (a) return a;
  }
  const typ = sig.typical(it.hash);
  const perDay = typ?.sold7 ? typ.sold7 / 7 : s?.volume || null;
  const a = listAdvice({
    sellGraph: graph, highestBuy: h ? h.highestBuy : s?.bid ?? null, perDay, d7: typ?.d7, d30: typ?.d30, held: sig.recentMedian(it.hash),
    net: (p) => steam.receivedFromBuyer(p), maxWaitDays: settings.maxWaitDays ?? 2, undercut: settings.undercut,
  });
  // the queue model promises too much when hardly anyone paid this much in the last month: say that instead
  const sold = a ? sig.soldAt(it.hash, a.price) : null;
  if (sold && sold.total >= 3 && sold.n * 2 < sold.total) a.rare = sold;
  return a;
}
function adviceTitle(a, it) {
  const f = steam.fmt, lines = [];
  if (a.sellNow && a.instant) {
    lines.push(L('inventory.sellRightAwayToThe', { price: f(a.instant.price), net: f(a.instant.net) }));
    lines.push(L('inventory.waitingForAHigherPrice'));
  } else {
    lines.push(L('inventory.listItForYouGet', { price: f(a.price), net: f(a.net) }));
    if (a.method === 'fill') lines.push(L('inventory.chanceItSellsWithin', { horizon: fmtDays(a.horizon), chance: pctOf(a.chance) }));
    else if (a.rare) lines.push(L('inventory.inTheLastDaysOnly', { days: a.rare.days, n: a.rare.n, total: a.rare.total }));
    else if (a.wait != null) lines.push(L('inventory.itShouldSell', { wait: fmtWait(a.wait) }));
    if (a.instant) lines.push(L('inventory.rightAwayToTheBuy', { price: f(a.instant.price) }));
  }
  if (a.falling) lines.push(L('inventory.thePriceUsuallyDropsAfter'));
  if (it.float != null || it.stickers?.length) lines.push(L('inventory.floatAndStickersAreNot'));
  return lines.join('\n');
}
function adviceLine(it, lowest) {
  if (!it.marketable || it.listed) return '';
  if (sig.signals(it, lowest).some((x) => x.k === 'hold')) return ''; // fees eat ≥ 40%: the card already says keep it
  const a = adviceOf(it);
  if (!a) return '';
  const t = esc(adviceTitle(a, it));
  return a.sellNow && a.instant
    ? `<div class="adv now" title="${t}"><span class="lb">⚡ ${L('inventory.rightAway')}</span><b>${steam.fmt(a.instant.price)}</b><span class="w">${L('inventory.toTheOrderWaitingGives')}</span></div>`
    : `<div class="adv" title="${t}"><span class="lb">${L('inventory.listFor')}</span><b>${steam.fmt(a.price)}</b><span class="w">${a.method === 'fill' ? L('inventory.chanceWithin', { horizon: fmtDays(a.horizon), chance: pctOf(a.chance), lowChance: a.lowChance ? L('inventory.only') : '' }) : a.rare ? L('inventory.inDaysThisMuchOr', { days: a.rare.days, n: a.rare.n, total: a.rare.total }) : a.wait != null ? L('inventory.willSell', { wait: fmtWait(a.wait) }) : L('inventory.noSalesData')}</span></div>`;
}
/** unit price (buyer) on the Steam market: the lowest listing ("-" when Steam has none) */
export function unitPrice(it) {
  const s = steamOf(it);
  return s?.lowest ? { v: s.lowest, src: 'steam' } : { v: null, src: null };
}
// applied stickers / patches / charms: Steam market price of a new one
const stickerHash = (x) => `${x.kind} | ${x.name}`;
const stickerPrice = (x) => prices.cached(730, stickerHash(x))?.lowest || 0;
const stickerValue = (it) => it.stickers.reduce((s, x) => s + stickerPrice(x), 0);

export function mount(root) {
  el = root;
  root.innerHTML = `
    <div class="bar">
      <div class="line">
        <select id="i-app">${APPS.map(([a, c, n]) => `<option value="${a}_${c}">${n}</option>`).join('')}</select>
        <button class="b" data-a="reload">⟳ ${L('inventory.load')}</button>
        <input type="search" id="i-q" placeholder="${L('inventory.search')}" style="width:200px">
        <span class="grp"><span class="lb">${L('inventory.layout')}</span>
          <select id="i-sort">
            <option value="price">${L('inventory.price')}</option><option value="name">${L('inventory.name')}</option><option value="float">Float ↑</option><option value="stickers">${L('inventory.stickers')}</option><option value="new">${L('inventory.newest')}</option>
          </select>
          <label class="tgl" title="${L('inventory.joinsIdenticalItemsNoFloat')}"><input type="checkbox" id="i-grp" checked><span class="tr"></span>${L('inventory.groupIdentical')}</label>
        </span>
        <span class="sp"></span>
        <button class="b" data-a="prices" title="${L('inventory.pricesAreWorkedOutBy')}">${L('inventory.refreshSteamPrices')}</button>
        <button class="b dbg" data-a="research" title="${L('inventory.downloadsFromTheSteamMarket')}">⬇ ${L('inventory.dataForAnalysis')}</button>
        <button class="b" data-a="stop" hidden>■ Stop</button>
      </div>
      <div class="line">
        <label class="spot" title="${L('inventory.onlyItemsWithTheIn')}"><input type="checkbox" id="i-worth">💰 ${L('inventory.worthSelling')} <b id="i-worthn"></b></label>
        <span class="grp"><span class="lb">${L('inventory.show')}</span>
          <span class="seg" title="${L('inventory.sellableCanBeListedNow')}">
            ${[['all', L('inventory.all')], ['sell', L('inventory.sellable')], ['lock', L('inventory.tradeLocked')], ['unsell', L('inventory.unsellable')]].map(([v, t]) => `<label><input type="radio" name="i-mkmode" value="${v}" ${invMkMode() === v ? 'checked' : ''}>${t}</label>`).join('')}
          </span>
          <label class="tgl" title="${L('inventory.alsoShowsTheItemsYou')}"><input type="checkbox" id="i-listed" ${settings.invShowListed ? 'checked' : ''}><span class="tr"></span>${L('inventory.listed')}</label>
          <label class="tgl" title="${L('inventory.onlyItemsMarkedForSale')}"><input type="checkbox" id="i-wt"><span class="tr"></span>📌 ${L('inventory.forSale')} <b id="i-wtn" class="sub"></b></label>
        </span>
      </div>
    </div>
    <div class="cards" id="i-cards"></div>
    <div class="bar" style="top:auto;position:relative;z-index:1">
      <span id="i-sel" class="sub">${L('inventory.clickItemsToSelectThem')}</span>
      <button class="b s" data-a="selall">${L('inventory.selectVisible')}</button><button class="b s" data-a="selnone">${L('inventory.deselect')}</button>
      <span class="sp"></span>
      <button class="b go" data-a="sell">${L('inventory.sellSelected')}</button>
    </div>
    <div id="i-stale" class="note" hidden style="margin:10px 14px 0;padding:7px 10px;border:1px solid #2a475e;border-radius:5px;background:rgba(102,192,244,.06)"></div>
    <div class="grid" id="i-grid"></div>
    <div style="text-align:center;padding:10px"><button class="b" data-a="more" hidden>${L('inventory.showMore')}</button></div>`;
  root.addEventListener('click', onClick);
  root.querySelector('#i-app').onchange = (e) => { app = e.target.value.split('_').map(Number); load(); };
  for (const id of ['#i-q', '#i-sort', '#i-grp', '#i-worth', '#i-wt']) root.querySelector(id).addEventListener('input', () => { shown = 200; render(); });
  root.querySelectorAll('input[name="i-mkmode"]').forEach((r) => r.addEventListener('change', (e) => { store.set('invMkMode', e.target.value); shown = 200; render(); }));
  root.querySelector('#i-listed').addEventListener('input', (e) => {
    settings.invShowListed = e.target.checked;
    shown = 200;
    render();
  });
  let estT = 0;
  steam.bus.on('estimated', () => { clearTimeout(estT); estT = setTimeout(() => el && items.length && render(), 1500); });
  casedb.load().then((d) => { floatDb = d; if (items.length) render(); }).catch(() => {}); // float ranges for the float checker
  patterndb.load().then((fresh) => { if (fresh && items.length) render(); }); // the community catalog of rare seeds (💎)
  // the market's last half year (the yardstick for the ↘/↗ chips), weekly, after the inventory's own requests
  setTimeout(() => markettrend.ensure().then((fresh) => { if (fresh && items.length) render(); }), 90000);
  setInterval(watchTick, 10 * 60000); // 📌 "na sprzedaż": offers re-checked every 10 minutes
  load();
}

export const show = () => {};

// ---------------------------------------------------------------- float checker
let floatDb = null; // casedb (float ranges of every skin), loaded once
/** float ranges loaded (once), for tabs that show floats without the Ekwipunek tab having been opened */
export async function ensureFloatDb() { if (!floatDb) floatDb = await casedb.load().catch(() => null); return floatDb; }
/** rank of an item's float inside its wear (analysis.floatRank), null without float / range */
export const floatRankOf = (it) => rankOf(it);
/** open the float checker for any item with { float, seed, hash, name, appid } */
export async function floatCheck(it) { await ensureFloatDb(); return floatDialog(it); }

// floats of the item's listings on the market: { at, n (with float), total, min, max }, filled by the checker and by
// a background pass over your items that may be extreme; 12 h. 'none': Steam doesn't send listing floats (1 day).
const mktFloats = store.bucket('mktFloats');
const MKT_TTL = 12 * 3600000;
const mktNone = () => Date.now() - (store.get('mktFloatsNone', 0) || 0) < 86400000;
function saveMkt(hash, withF, total) {
  if (withF.length) mktFloats.set(hash, { at: Date.now(), n: withF.length, total, min: withF[0].float, max: withF[withF.length - 1].float });
  else mktFloats.set(hash, { at: Date.now(), n: 0, total });
}
/** 'low' = no checked listing has a lower float (best on the market), 'high' = none higher (worst), else null */
export function marketMark(it) {
  const m = mktFloats.get(it.hash);
  if (it.float == null || !m?.n || Date.now() - m.at > MKT_TTL) return null;
  return it.float <= m.min ? { k: 'low', m } : it.float >= m.max ? { k: 'high', m } : null;
}
/** background: market floats for your items whose float may be extreme (lowest / highest 25% of the wear) */
let floatScanRunning = false;
async function floatScan(tk) {
  if (floatScanRunning || mktNone()) return;
  const own = [...new Map([...items, ...listed].filter((it) => it.float != null && it.hash && (it.marketable || it.lock || it.listed)).map((it) => [it.hash, it])).values()];
  const todo = own.filter((it) => { const r = rankOf(it); const m = mktFloats.get(it.hash); return r && (r.lower <= 0.25 || r.lower >= 0.75) && !(m && Date.now() - m.at < MKT_TTL); });
  if (!todo.length) return;
  floatScanRunning = true;
  let seen = 0, withAny = 0;
  try {
    for (const it of todo) {
      if (tk?.cancelled) break;
      const p = await steam.marketListings(it.appid || 730, it.hash, { start: 0, count: 100 });
      const withF = p.listings.filter((x) => x.float != null).sort((a, b) => a.float - b.float);
      saveMkt(it.hash, withF, p.total);
      seen++;
      if (withF.length) withAny++;
      // Steam sends no listing floats at all → stop asking (checked again tomorrow)
      if (seen >= 3 && !withAny) { store.set('mktFloatsNone', Date.now()); break; }
      if (el) render();
    }
  } catch (e) { if (e.status === 429) ui.log(L('inventory.marketFloatsSteamIsLimiting'), 'warn'); }
  floatScanRunning = false;
}
const rankOf = (it) => (it.float != null ? floatRank(it.float, casedb.floatRange(floatDb, it.hash)) : null);
/** ❗ = best / worst 0.1% of the wear (the global ranking, exact); ★ = lower / higher than every checked market listing */
export function floatMarks(it, r = rankOf(it)) {
  let out = '';
  if (r?.super) out += ` <span style="color:#ff6b6b;font-weight:700" title="${r.super === 'low' ? L('inventory.rankingExceptionallyLowFloatAt') : L('inventory.rankingExceptionallyHighFloatAt')}">❗</span>`;
  const mk = marketMark(it);
  if (mk) out += ` <span style="color:#e5b84c" title="${mk.k === 'low' ? L('inventory.marketTheLowestFloatAmong', { n: mk.m.n, min: mk.m.min.toFixed(6) }) : L('inventory.marketTheHighestFloatAmong', { n: mk.m.n, max: mk.m.max.toFixed(6) })}">★</span>`;
  return out;
}
/** "0.003035 ❗★ · seed 732": the float is clickable (checker); gold text = lowest 5% of its wear */
function floatLine(it, key) {
  const r = rankOf(it);
  const pm = patternFor(it.hash, it.seed); // 💎 a known pattern seed (core/patterns.js)
  const star = floatMarks(it, r);
  const title = r ? L('inventory.floatOnlyOfAllCopies', { float: it.float.toFixed(6), lower: shareTxt(r.lower), wear: r.wear, lo: r.lo.toFixed(3), hi: r.hi.toFixed(3) }) : L('inventory.clickToCompareTheFloat');
  return `<div class="sub"><span data-fc="${esc(key)}" title="${esc(title)}" style="cursor:pointer;border-bottom:1px dotted currentColor;${r && r.lower <= 0.05 ? 'color:#e5b84c;' : ''}">${it.float.toFixed(6)}</span>${star}${it.seed != null ? ` · seed ${it.seed}` : ''}</div>${pm ? `<div style="margin-top:2px">${patternChip(pm)}</div>` : ''}`;
}

/**
 * The checker: rank inside the wear (from Valve's model, no outside data) and the floats of the cheapest listings
 * of the same item on the Steam market (up to 300): how many are lower, the lowest one and its price, and the
 * listings closest to yours, what similar floats ask.
 */
/** the checked market listings of this skin with a known pattern seed (💎), cheapest first; '' when none */
function patRows(it, all, cheapest) {
  const f = steam.fmt;
  const hits = all.map((x) => ({ x, m: x.seed != null ? patternFor(it.hash, x.seed) : null })).filter((h) => h.m).sort((a, b) => a.x.price - b.x.price);
  if (!hits.length) return '';
  return `<div style="margin:10px 0 6px"><b>💎 ${L('inventory.listingsWithAKnownPattern')}</b> <span class="sub">${L('inventory.amongChecked', { hits: hits.length, all: all.length })}</span></div>
    <table><tr><th>Seed</th><th>${L('inventory.pattern')}</th><th>Float</th><th>${L('inventory.price2')}</th></tr>${hits.slice(0, 12).map(({ x, m }) => `<tr><td>${x.seed}</td><td>${patternChip(m)}</td><td>${x.float != null ? x.float.toFixed(6) : '-'}</td><td>${f(x.price)}${cheapest && x.price <= cheapest * 1.05 ? ` <span class="ok" title="${L('inventory.nearlyAtThePriceOf')}">${L('inventory.cheap')}</span>` : ''}</td></tr>`).join('')}</table>`;
}
async function floatDialog(it) {
  const f = steam.fmt;
  const r = rankOf(it);
  const box = (html) => ui.ask(L('inventory.floatAgainstTheMarket'), `<div id="fc-body" style="min-width:420px">${html}</div>`, { ok: L('inventory.close'), cancel: null, wide: true });
  const head = `<b>${esc(it.name)}</b> <span class="sub">${esc(it.hash)}</span><br>
    ${L('inventory.yourFloat')}: <b>${it.float.toFixed(8)}</b>${it.seed != null ? ` · seed ${it.seed}` : ''} ${patternChip(patternFor(it.hash, it.seed))}<br>
    ${r?.super ? `<div style="margin:6px 0;padding:6px 8px;border:1px solid #ff6b6b;border-radius:5px;background:rgba(255,107,107,.08)">❗ ${L('inventory.atMost1In1000', { super: r.super === 'low' ? L('inventory.exceptionallyLowFloat') : L('inventory.exceptionallyHighWorstFloat'), super2: r.super === 'low' ? L('inventory.lower') : L('inventory.higher'), super3: r.super === 'low' ? L('inventory.suchAnItemCanBe') : L('inventory.theWorstFloatsHaveCollectors') })}</div>` : ''}
    <div class="sub" style="margin:4px 0">${L('inventory.youCanCheckThePlace')} <a class="acc" href="https://sih.app/floats" target="_blank" rel="noopener">SIH</a> · <a class="acc" href="https://www.steamanalyst.com/item-db" target="_blank" rel="noopener">Steam Analyst Item DB</a> · CSFloat, ${L('inventory.theyOpenInANew')}</div>
    ${r ? L('inventory.inForThisSkinOnly', { wear: r.wear, lo: r.lo.toFixed(3), hi: r.hi.toFixed(3), lower: shareTxt(r.lower), lower2: shareTxt(1 - r.lower), best: r.best.toFixed(3) }) : `<span class="sub">${L('inventory.iDontKnowTheFloat')}</span>`}`;
  const done = box(`${head}<div id="fc-mk" style="margin-top:10px"><span class="spin"></span>${L('inventory.downloadingListingsFromTheMarket')}</div>`);
  const out = () => root().querySelector('#fc-mk');
  const root = () => document.querySelector('#fc-body') || document.createElement('div');
  try {
    const all = [];
    let total = 0;
    for (let start = 0; start < 300; start += 100) {
      const p = await steam.marketListings(it.appid || 730, it.hash, { start, count: 100 });
      total = p.total;
      all.push(...p.listings);
      if (p.listings.length < 100 || all.length >= total) break;
    }
    const withF = all.filter((x) => x.float != null).sort((a, b) => a.float - b.float);
    saveMkt(it.hash, withF, total);
    if (el) render();
    if (!out().isConnected) return;
    if (!withF.length) { out().innerHTML = `<span class="sub">${L('inventory.steamGaveNoFloatsFor', { all: all.length })}</span>`; return; }
    const lower = withF.filter((x) => x.float < it.float);
    const near = [...withF].sort((a, b) => Math.abs(a.float - it.float) - Math.abs(b.float - it.float)).slice(0, 6).sort((a, b) => a.float - b.float);
    const cheapest = all[0]?.price;
    out().innerHTML = `${L('inventory.onTheMarketListingsI', { total, all: all.length, withF: withF.length })}<br>
      ${L('inventory.aLowerFloatThanYours', { lower: lower.length })}${lower.length ? L('inventory.theLowestFor', { float: withF[0].float.toFixed(6), price: f(withF[0].price) }) : `, <b class="ok">${L('inventory.youHaveTheLowestFloat')}</b>`}. ${L('inventory.cheapestListing')}: ${f(cheapest)}.<br>
      <table style="margin-top:8px"><tr><th>Float</th><th>${L('inventory.price2')}</th><th></th></tr>${near.map((x) => `<tr><td>${x.float.toFixed(6)}${x.seed != null ? ` <span class="sub">seed ${x.seed}</span> ${patternChip(patternFor(it.hash, x.seed))}` : ''}</td><td>${f(x.price)}</td><td class="sub">${x.float < it.float ? L('inventory.lowerThanYours') : L('inventory.higherThanYours')}${cheapest && x.price > cheapest * 1.05 ? ` · +${Math.round((x.price / cheapest - 1) * 100)}% ${L('inventory.aboveTheCheapest')}` : ''}</td></tr>`).join('')}</table>
      ${patRows(it, all, cheapest)}
      <span class="sub">${L('inventory.listingsWithAFloatSimilar', { all: all.length })}</span>`;
  } catch (e) {
    if (out().isConnected) out().innerHTML = `<span class="err">${esc(e.message)}</span>`;
  }
  await done;
}

/**
 * The 📌 items: a fresh order book each (10 min apart), and a log line when something you'd act on changed, the
 * cheapest listing moved ≥ 5%, a "sell" chip appeared, or selling to the buy orders right away became the best move.
 * The first check after loading only notes where things stand.
 */
async function watchTick() {
  if (watching || !items.length) return;
  const own = [...items, ...listed];
  const list = Object.keys(sellWatch.all()).map((h) => own.find((it) => it.hash === h)).filter(Boolean);
  if (!list.length) return;
  watching = true;
  const f = steam.fmt;
  try {
    for (const it of list) {
      // a book fetched in the last 2 minutes (the listings tab, a valuation) is as good as a new one
      const h = await prices.hist(it.appid, it.hash, 2 * 60000).catch((e) => { if (e.status === 429) throw e; return null; });
      if (!h) continue;
      const a = adviceOf(it, h);
      const now = { low: h.lowestSell, sellNow: !!a?.sellNow, sig: sig.signals(it, h.lowestSell).filter((x) => x.k === 'high' || x.k === 'profit').map((x) => x.label).join(', ') };
      const prev = watchSeen.get(it.hash);
      if (prev) {
        if (prev.low && now.low && Math.abs(now.low / prev.low - 1) >= 0.05) ui.log(L('inventory.cheapestListingTo', { name: it.name, low: f(prev.low), low2: f(now.low), low3: now.low > prev.low ? '+' : '−', low4: Math.round(Math.abs(now.low / prev.low - 1) * 100) }), now.low > prev.low ? 'ok' : 'warn');
        if (now.sellNow && !prev.sellNow && a?.instant) ui.log(L('inventory.buyersNowPaySellingRight', { name: it.name, price: f(a.instant.price) }), 'ok');
        if (now.sig && now.sig !== prev.sig) ui.log(`📌 ${it.name}: ${now.sig}`, 'ok');
      }
      watchSeen.set(it.hash, now);
    }
  } catch (e) {
    if (e.status === 429) ui.log(L('inventory.steamIsLimitingRequestsIll'), 'warn');
  }
  watching = false;
  if (el) render();
}

/** how many of this item are in the loaded inventory (not listed); null = the inventory wasn't loaded in this tab */
export const ownedCount = (hash) => (items.length ? items.filter((it) => it.hash === hash).reduce((s, it) => s + (it.amount || 1), 0) : null);

let lastClicked = null;
function onClick(e) {
  const fc = e.target.closest('[data-fc]');
  if (fc) { e.stopPropagation(); const g = groups().find((x) => x.key === fc.dataset.fc); if (g) floatDialog(g.rep); return; }
  const wt = e.target.closest('[data-wt]');
  if (wt) {
    e.stopPropagation();
    const h = wt.dataset.wt;
    if (sellWatch.get(h)) { sellWatch.del(h); watchSeen.delete(h); } else { sellWatch.set(h, { at: Date.now() }); watchTick(); }
    render();
    return;
  }
  // the saved inventory (still loading the fresh one): copies may be sold or moved by now, nothing is listed from it
  const waitFresh = () => ui.log(L('inventory.oneMomentTheInventoryIs'), 'warn');
  const qs = e.target.closest('[data-q]');
  if (qs && fromCache) { e.stopPropagation(); return waitFresh(); }
  if (qs) {
    e.stopPropagation();
    const k = qs.closest('.gi').dataset.k;
    if (qs.dataset.q === 'plan') { const g = groups().find((x) => x.key === k); if (g) planDialog(g).catch((er) => ui.log(er.message, 'err')); return; }
    qs.dataset.q === 'unlist' ? unlist(k) : quickSell(k, qs.dataset.q);
    return;
  }
  const gi = e.target.closest('.gi');
  if (gi && gi.classList.contains('listed')) return; // listed items aren't selectable for selling
  if (gi && fromCache && !e.target.closest('a')) return waitFresh();
  if (gi && !e.target.closest('a')) {
    const k = gi.dataset.k;
    const vis = visible().map((g) => g.key);
    if (e.shiftKey && lastClicked) {
      const [a, b] = [vis.indexOf(lastClicked), vis.indexOf(k)].sort((x, y) => x - y);
      vis.slice(a, b + 1).forEach((x) => sel.add(x));
    } else sel.has(k) ? sel.delete(k) : sel.add(k);
    lastClicked = k;
    render();
    return;
  }
  const a = e.target.closest('button')?.dataset.a;
  if (!a) return;
  ({
    reload: load,
    prices: fetchPrices,
    stop: () => { task?.cancel(); priceTask?.cancel(); },
    more: () => { shown += 200; render(); },
    selall: () => { if (fromCache) return waitFresh(); visible().filter((g) => !g.rep.listed).forEach((g) => sel.add(g.key)); render(); },
    selnone: () => { sel.clear(); render(); },
    research: () => {
      // the selected cards, or everything you own that has a market (in the inventory, locked, listed)
      const gs = sel.size ? groups().filter((g) => sel.has(g.key)) : groups();
      const list = gs.filter((g) => g.rep.marketable || g.rep.lock || g.rep.listed).map((g) => ({ hash: g.hash, appid: g.rep.appid }));
      research.exportResearch(list, sel.size ? L('inventory.selectedInTheInventory') : L('inventory.fromYourInventoryAlsoListed'), { onBusy: (b) => (el.querySelector('[data-a="stop"]').hidden = !b) });
    },
    sell: () => fromCache ? waitFresh() : sellDialog([...sel].map((k) => groups().find((g) => g.key === k)).filter(Boolean)),
  })[a]?.();
}

let loading = false;
let fromCache = null; // { at, err }: the cards show the saved inventory from `at` while a fresh one loads (err: it failed)
let loadGen = 0; // every load gets a number; a load that was overtaken (game switched meanwhile) drops its result
const stale = (gen) => gen !== loadGen;
async function load() {
  const gen = ++loadGen, a = [...app]; // the game this load is for, fixed for its whole run
  if (!(await steam.ensureLogin()) && !steam.ctx().steamId) return ui.log(L('inventory.logInToSteam'), 'err');
  if (stale(gen)) return;
  loading = true;
  // right away: the inventory as its last load saved it (Steam's inventory is the slowest, most limited request);
  // shown as such, no selling from it, until the fresh one replaces it
  const saved = steam.cachedInventory(undefined, a[0], contextsOf(a));
  if (listed.length && listed.some((l) => +l.appid !== a[0])) listed = []; // another game's listings (game switched)
  if (saved?.items.length) {
    items = saved.items;
    items.forEach((it, i) => (it.idx = i));
    fromCache = { at: saved.at };
    sel.clear();
    mergeListed();
    render();
  } else {
    fromCache = null;
    el.querySelector('#i-grid').innerHTML = `<div class="empty" style="padding:60px 0"><span class="spin"></span>${L('inventory.loadingTheInventory')}</div>`;
  }
  try {
    // your listings in parallel (they count towards the total value), but they don't hold the inventory up: that
    // request is often the one Steam rate-limits for a minute
    const listedP = loadListed(a, gen);
    const got = await loadAllContexts(a);
    if (stale(gen)) return; // another game was picked while this one loaded
    items = got;
    items.forEach((it, i) => (it.idx = i));
    mergeListed(); // dedupe with the listings that are already in (loadListed merges again when it ends)
    loading = false;
    fromCache = null;
    sel.clear();
    ui.log(L('inventory.inventoryItems', { items: items.length }));
    listedP.then(() => { if (stale(gen)) return; if (listed.length) ui.log(L('inventory.inventoryOnTheMarket', { listed: listed.length })); render(); if (listed.length) autoPrice(); });
    render();
    watchTick(); // 📌 items: where their offers stand now (changes are logged from the next round on)
    autoPrice();
  } catch (e) {
    if (stale(gen)) return;
    loading = false;
    // the saved inventory stays on screen, marked as not refreshed
    if (fromCache) { fromCache.err = e.message; ui.log(L('inventory.couldntRefreshTheInventory') + e.message, 'warn'); render(); autoPrice(); return; } // the prices don't depend on it
    el.querySelector('#i-grid').innerHTML = `<div class="empty err">${esc(e.message)}</div>`;
  }
}
/** the inventory contexts a load reads (CS2: 2 + the extra ones, see loadAllContexts) */
const contextsOf = (a) => (a[0] === 730 && a[1] === 2 ? [...new Set([2, ...store.get('ctx730', [2]), 16])] : [a[1]]);

/**
 * CS2 keeps listed / trade-protected items in extra inventory contexts (2025+ system).
 * Load context 2 plus any extra contexts discovered on the inventory page.
 */
async function loadAllContexts(a = app) {
  const main = await steam.inventory(undefined, a[0], a[1]);
  if (!(a[0] === 730 && a[1] === 2)) return main;
  // + 16: CS2's trade-protected items (market buys, trades) live there for 7 days, known even when the native
  // inventory page (where the context list is read from) hasn't been visited yet
  const extra = [...new Set([...store.get('ctx730', [2]), 16])].filter((c) => c !== 2);
  const seen = new Set(main.map((i) => i.assetid));
  for (const c of extra) {
    try {
      for (const it of await steam.inventory(undefined, 730, c)) if (!seen.has(it.assetid)) { seen.add(it.assetid); main.push(it); }
    } catch (e) { console.warn(`[Flipster] context ${c}: ${e.message}`); }
  }
  return main;
}

/** my active market listings for the selected game, as inventory-like items */
async function loadListed(a = app, gen = loadGen) {
  try {
    const { listings } = await steam.myListings();
    if (stale(gen)) return;
    listed = listings
      .filter((l) => +l.appid === a[0] && +l.contextid === a[1])
      .map((l, i) => ({ ...l.item, listed: true, listingid: l.listingid, listPrice: l.buyer, listRecv: l.recv, listedAt: l.created, amount: l.amount, idx: -1 - i }));
  } catch (e) {
    if (stale(gen)) return;
    listed = [];
    ui.log(L('inventory.couldntLoadTheListingsFrom') + e.message, 'warn');
  }
  if (stale(gen)) return;
  mergeListed();
}

/**
 * Listed items are also present in the inventory API (sealed). Merge each listing with its inventory
 * asset (float, stickers, name tag) and drop the duplicate from `items`.
 */
function mergeListed() {
  const byId = new Map(items.map((i) => [i.assetid, i]));
  const taken = new Set();
  listed = listed.map((l) => {
    // listing asset ids differ from inventory ids → fall back to the same item name among non-sellable items
    let inv = byId.get(l.assetid);
    if (!inv) inv = items.find((i) => i.hash === l.hash && !i.marketable && !taken.has(i.assetid));
    if (inv) taken.add(inv.assetid);
    const merged = inv ? {
      ...inv, ...l,
      float: l.float ?? inv.float, seed: l.seed ?? inv.seed, nameTag: l.nameTag || inv.nameTag,
      stickers: l.stickers?.length ? l.stickers : inv.stickers,
    } : l;
    return steam.recallProps(merged);
  });
  const ids = new Set(listed.map((l) => l.assetid));
  items = items.filter((i) => !ids.has(i.assetid) && !taken.has(i.assetid));
}

// ---------------------------------------------------------------- automatic valuation
let pricing = null; // {done, total}
let priceTask = null;
const marketableList = () => [...new Map([...items.filter((it) => it.hash && (it.marketable || it.lock)), ...listed].map((it) => [it.hash, it])).values()]
  .map((it) => ({ appid: it.appid, hash: it.hash, v: steamOf(it)?.lowest || 0 }))
  .sort((a, b) => b.v - a.v) // most valuable first (by the last known price), so the total is useful early
  // then the stickers on your skins (for the "naklejki ~" estimate)
  .concat([...new Set(items.flatMap((it) => (it.stickers || []).map(stickerHash)))].map((hash) => ({ appid: 730, hash, v: 0 })));

/** price everything without a lowest price younger than 6 h, in the background */
async function autoPrice({ force = false, list = marketableList() } = {}) {
  priceTask?.cancel();
  const tk = (priceTask = token());
  el.querySelector('[data-a="stop"]').hidden = false;
  let lastRender = 0;
  const n = await prices.lowestPrices(list, {
    force,
    isCancelled: () => tk.cancelled,
    onEach: (hash, low, err, done, total) => {
      pricing = { done, total };
      if (err && err.status !== 429) console.warn('[Flipster]', hash, err.message);
      if (err?.status === 429) ui.log(L('inventory.steamIsLimitingRequestsValuation'), 'warn');
      if (Date.now() - lastRender > 1500 || done === total) { lastRender = Date.now(); render(); updateBadges(); }
    },
  });
  if (n && !tk.cancelled) ui.log(L('inventory.valuedItemsSteamPrices', { n }), 'ok');
  pricing = null;
  if (priceTask === tk) el.querySelector('[data-a="stop"]').hidden = true;
  render();
  // price histories for the "drogo teraz" / "cena spada" signals (only sellable items worth more than the fees)
  if (!tk.cancelled) {
    const want = [...items.filter((it) => (it.marketable || it.lock) && (steamOf(it)?.lowest || 0) >= 20)].map((it) => ({ hash: it.hash, appid: it.appid || 730 }));
    let last = 0;
    sig.ensure(want, { isCancelled: () => tk.cancelled, onEach: () => { if (Date.now() - last > 2000) { last = Date.now(); render(); } } }).then(() => { render(); return ensureFloatDb(); }).then(() => floatScan(tk));
  }
}

/** the day a lock ends (local), or the raw text when Steam's wording can't be read */
const lockDay = (it) => { const t = lockUntil(it.lock); if (t == null) return it.lock || 'x'; const d = new Date(t); return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; };
/**
 * group identical items (same hash, no float/stickers/name tag), and only those that cost you the same and unlock the
 * same day (bought at 0,92 and at 1,14, or locked until different days, are different cards); listed items are
 * grouped separately by price
 */
function groups() {
  const grp = el.querySelector('#i-grp').checked;
  const out = [];
  const map = new Map();
  const all = settings.invShowListed ? [...items, ...listed] : items;
  for (const it of all) {
    const unique = it.float != null || it.stickers.length || it.nameTag;
    const key = it.listed
      ? (grp && !unique ? `lg:${it.hash}|${it.listPrice}` : 'l:' + it.listingid)
      : (grp && !unique ? `g:${it.hash}|${originOf(it)?.cost ?? '?'}|${it.marketable ? '' : lockDay(it)}` : 'a:' + it.assetid);
    let g = map.get(key);
    if (!g) { g = { key, hash: it.hash, rep: it, items: [], qty: 0 }; map.set(key, g); out.push(g); }
    g.items.push(it);
    g.qty += it.amount;
  }
  return out;
}

/** the cards shown with the current filters; worthOnly can be forced (to count what "Warte sprzedaży" would show) */
function visible(worthOnly = el.querySelector('#i-worth').checked, all = groups()) {
  const q = el.querySelector('#i-q').value.trim().toLowerCase();
  const mk = invMkMode(); // sell: can be listed now (or is listed) · unsell: locked or never marketable · all
  const s = el.querySelector('#i-sort').value;
  const onlyWt = el.querySelector('#i-wt').checked;
  // sell: can be listed now (or is listed) · lock: trade-locked for now (sellable when it ends) · unsell: never on the market
  const kindOf = (g) => (g.rep.marketable || g.rep.listed ? 'sell' : g.rep.lock ? 'lock' : 'unsell');
  let gs = all.filter((g) => (mk === 'all' || mk === kindOf(g)) && matchSearch(`${g.rep.name} ${g.hash} ${g.rep.nameTag || ''}`, q)
    && (!onlyWt || sellWatch.get(g.hash))
    && (!worthOnly || (!g.rep.listed && g.rep.marketable && sig.worth(sig.signals(g.rep, unitPrice(g.rep).v)))));
  const by = {
    price: (g) => -(unitPrice(g.rep).v || 0),
    name: (g) => g.rep.name,
    float: (g) => g.rep.float ?? 9,
    stickers: (g) => -stickerValue(g.rep),
    new: (g) => g.rep.idx,
  }[s];
  gs.sort((a, b) => { const x = by(a), y = by(b); return typeof x === 'string' ? x.localeCompare(y) : x - y; });
  return gs;
}

// ---------------------------------------------------------------- jump here from another tab (Historia → "w ekwipunku")
let focus = null; // {hash, cost, t, until}: the item to show after the next render (waits for the inventory to load)
let hl = null; // {keys:Set, until}: highlighted cards
/** show the Ekwipunek card(s) of an item: switches the game if needed, makes the filters show it, scrolls to it */
export function focusItem(hash, { appid = 730, cost = null, t = null } = {}) {
  focus = { hash, cost, t, until: Date.now() + 30000 };
  const opt = APPS.find(([a]) => a === appid);
  if (opt && app[0] !== appid) {
    app = [opt[0], opt[1]];
    el.querySelector('#i-app').value = `${opt[0]}_${opt[1]}`;
    load();
    return;
  }
  if (items.length && !loading) render();
}
/** before rendering: the filters relaxed so the item is visible, enough cards shown; → the card key to scroll to */
function prepFocus() {
  const f = focus;
  // one purchase (t) → a card per copy, to show that very one; a whole group of purchases → grouped cards
  el.querySelector('#i-grp').checked = f.t == null;
  let mine = groups().filter((g) => g.hash === f.hash);
  if (!mine.length && !settings.invShowListed && listed.some((l) => l.hash === f.hash)) {
    settings.invShowListed = true; // only on the market: show listed items
    el.querySelector('#i-listed').checked = true;
    mine = groups().filter((g) => g.hash === f.hash);
  }
  if (!mine.length) {
    if (Date.now() > f.until) { focus = null; ui.log(L('inventory.inventoryCouldntFindMaybeYou', { hash: f.hash }), 'warn'); }
    return null;
  }
  focus = null;
  if (!visible().some((g) => g.hash === f.hash)) {
    // hidden by the filters: search, 📌, "warte sprzedaży", collectibles, sellable / not
    el.querySelector('#i-q').value = '';
    el.querySelector('#i-wt').checked = false;
    el.querySelector('#i-worth').checked = false;
    if (!visible().some((g) => g.hash === f.hash)) {
      store.set('invMkMode', 'all');
      el.querySelectorAll('input[name="i-mkmode"]').forEach((r) => (r.checked = r.value === 'all'));
    }
  }
  const vis = visible();
  const shownMine = vis.filter((g) => g.hash === f.hash);
  let best, keys;
  if (f.t != null) {
    // one purchase: the copy that came from it (its origin is the acquisition closest in time, same price first)
    const dist = (g) => { const o = originOf(g.rep); return o?.t == null ? Infinity : Math.abs(o.t - f.t) + (f.cost != null && o.cost !== f.cost ? 86400000 : 0); };
    best = [...shownMine].sort((a, b) => dist(a) - dist(b))[0];
    keys = best ? [best.key] : [];
  } else {
    // a group of purchases: the cards with that purchase price (all copies of the item if none has it)
    const same = shownMine.filter((g) => f.cost != null && originOf(g.rep)?.cost === f.cost);
    keys = (same.length ? same : shownMine).map((g) => g.key);
    best = (same.length ? same : shownMine)[0];
  }
  if (!best) return null;
  const i = vis.indexOf(best);
  if (i >= shown) shown = i + 50;
  hl = { keys: new Set(keys), main: best.key, until: Date.now() + 8000 };
  setTimeout(() => { if (hl && Date.now() >= hl.until) { hl = null; render(); } }, 8100);
  return best.key;
}
const hlClass = (g) => (hl && Date.now() < hl.until && hl.keys.has(g.key) ? (g.key === hl.main ? 'hl main' : 'hl') : '');

function render() {
  try { origins = itemOrigins(); } catch (e) { console.warn('[Flipster] item origins', e); }
  const fx = focus && !loading && items.length ? prepFocus() : null;
  const all = groups();
  const vis = visible(undefined, all);
  const worthN = el.querySelector('#i-worth').checked ? vis.length : visible(true, all).length;
  el.querySelector('#i-worthn').textContent = worthN || '';
  el.querySelector('#i-wtn').textContent = new Set([...items, ...listed].filter((it) => sellWatch.get(it.hash)).map((it) => it.hash)).size || '';
  // totals are computed from the raw data (not from the filtered/grouped view):
  //  - "Wartość Steam" = everything you own: sellable now + temporarily locked + listed on the market, all at the lowest market price
  //  - "Do sprzedania teraz" = only items in the inventory that can be listed right now
  let tAll = 0, tNow = 0, rNow = 0, tLocked = 0, tListedLow = 0; // rNow: received, fee taken per item (min 0,04 + 0,04 zł each)
  let nNow = 0, nLocked = 0, unpriced = 0;
  let lCnt = 0, lSum = 0, lRecv = 0, lBeaten = 0;
  for (const it of items) {
    if (!it.hash || !(it.marketable || it.lock)) continue; // truly unsellable (medals, coins…) have no market price
    const low = steamOf(it)?.lowest;
    if (it.marketable) {
      nNow += it.amount;
      if (low) { tNow += low * it.amount; rNow += steam.receivedFromBuyer(low) * it.amount; }
    } else {
      nLocked += it.amount;
      if (low) tLocked += low * it.amount;
    }
    if (!low) unpriced += it.amount;
  }
  for (const it of listed) {
    const low = steamOf(it)?.lowest;
    lCnt += it.amount;
    lSum += it.listPrice * it.amount;
    lRecv += it.listRecv * it.amount;
    if (low != null) {
      tListedLow += low * it.amount;
      if (low < it.listPrice) lBeaten += it.amount;
    } else unpriced += it.amount;
  }
  tAll = tNow + tLocked + tListedLow;
  const parts = [tLocked ? `${L('inventory.locked')} ${steam.fmt(tLocked)}` : '', tListedLow ? `${L('inventory.onTheMarket')} ${steam.fmt(tListedLow)}` : ''].filter(Boolean).join(' · ');
  const selG = all.filter((g) => sel.has(g.key));
  const selVal = selG.reduce((s, g) => s + (unitPrice(g.rep).v || 0) * g.qty, 0);
  el.querySelector('#i-cards').innerHTML = `
    <div class="card"><div class="k">${L('inventory.items')}</div><div class="v">${items.length + lCnt}</div><div class="sub">${L('inventory.sellable2')} ${nNow}${nLocked ? ` · ${L('inventory.locked2')} ${nLocked}` : ''}${lCnt ? ` · ${L('inventory.onTheMarket')} ${lCnt}` : ''}</div></div>
    <div class="card"><div class="k">${L('inventory.steamValue')}</div><div class="v">${steam.fmt(tAll)}</div><div class="sub">${pricing ? `<span class="acc">${L('inventory.valuing')} ${pricing.done}/${pricing.total}…</span>` : `${parts || L('inventory.everythingInTheInventory')}${unpriced ? ` · ${unpriced} ${L('inventory.withoutAPrice')}` : ''}`}</div></div>
    <div class="card"><div class="k">${L('inventory.sellableNow')}</div><div class="v">${steam.fmt(tNow)}</div><div class="sub">${nNow} ${L('inventory.pcs')} · ${L('inventory.youGet')} ~${steam.fmt(rNow)}</div></div>
    ${lCnt ? `<div class="card"><div class="k">${L('inventory.onTheMarket2')}</div><div class="v">${steam.fmt(lSum)}</div><div class="sub">${lCnt} ${L('inventory.pcs')} · ${L('inventory.youGet')} ${steam.fmt(lRecv)}${lBeaten ? ` · <span class="err">${lBeaten} ${L('inventory.undercut')}</span>` : ''}</div></div>` : ''}
    <div class="card"><div class="k">${L('inventory.selected')}</div><div class="v">${selG.reduce((s, g) => s + g.qty, 0)}</div><div class="sub">${steam.fmt(selVal)}</div></div>`;
  el.querySelector('#i-sel').textContent = selG.length ? L('inventory.selectedEntries', { selG: selG.length, selVal: steam.fmt(selVal) }) : L('inventory.clickItemsToSelectThem');
  const grid = el.querySelector('#i-grid');
  // the saved inventory on screen while the fresh one loads: said so, selling off until it's here
  const note = el.querySelector('#i-stale');
  note.hidden = !fromCache;
  grid.classList.toggle('stale', !!fromCache);
  el.querySelectorAll('[data-a="sell"], [data-a="selall"]').forEach((b) => {
    b.disabled = !!fromCache;
    b.title = fromCache ? L('inventory.availableWhenTheInventoryHas') : '';
  });
  if (fromCache) {
    note.innerHTML = fromCache.err
      ? `<span class="warn">${L('inventory.couldntRefreshTheInventory2', { err: esc(fromCache.err) })}</span> ${L('inventory.showingTheStateFromSelling', { at: esc(fmtWhen(fromCache.at)) })} <button class="b s" data-a="reload">${L('inventory.tryAgain')}</button>`
      : `<span class="spin" style="width:10px;height:10px"></span>${L('inventory.showingTheInventoryFromRefreshing', { at: esc(fmtWhen(fromCache.at)) })}`;
  }
  if (!vis.length) { grid.innerHTML = loading ? `<div class="empty" style="padding:60px 0"><span class="spin"></span>${L('inventory.loadingTheInventory')}</div>` : `<div class="empty">${items.length || listed.length ? L('inventory.noItemsInThisView') : L('inventory.noItems')}</div>`; return; }
  grid.innerHTML = vis.slice(0, shown).map(card).join('');
  // the saved inventory: the card buttons are there, greyed out, until the fresh one comes
  if (fromCache) grid.querySelectorAll('.qs button').forEach((b) => { b.disabled = true; b.title = L('inventory.availableWhenTheInventoryHas2'); });
  el.querySelector('[data-a="more"]').hidden = vis.length <= shown;
  if (fx) grid.querySelector(`[data-k="${CSS.escape(fx)}"]`)?.scrollIntoView({ block: 'center', behavior: 'smooth' });
}

/** "kupiony 12.11.2024 · 2,10 zł", "ze skrzyni Gamma Case · 14,08 zł", "z wymiany od X · ~3,20 zł" */
let origins = new Map();
// by asset; listed items (other asset ids while on the market) fall back to the newest acquisition of that item
// Steam items (cards, backgrounds, emoticons): Flipster reads the inventory history for CS2 only, so their drops aren't
// seen; with no unsold purchase left in the market history, a copy you own is a drop from playing (cost 0)
const STEAM_DROP = { src: 'drop', t: null, detail: `Steam: ${L('inventory.aGameDrop')}`, cost: 0, guess: true };
const originOf = (it) => origins.get(it.assetid) || origins.get('h:' + it.hash) || (String(it.appid) === '753' && origins.size ? STEAM_DROP : null);
/** what an inventory-history event that just "gave" you an item was (Steam's English description → Polish) */
function dropLabel(desc = '') {
  if (/operation|mission|challenge|upgraded|journal|stars/i.test(desc)) return L('inventory.fromAnOperationPassMissions');
  if (/rank|level|xp|service|medal|earned/i.test(desc)) return L('inventory.rewardForALevelRank');
  if (/gift/i.test(desc)) return L('inventory.gift');
  if (/^Steam: (drop z gry|a game drop)/.test(desc)) return L('inventory.aGameDropOnSteam');
  if (/store|purchased/i.test(desc)) return L('inventory.storePurchase');
  if (/drop/i.test(desc)) return 'drop';
  return desc || L('inventory.received');
}
/** the origin codes (kept in Polish, they are compared in history.js) as they read to you */
const srcName = (s) => ({ kupiony: L('inventory.bought'), 'ze skrzyni': L('inventory.fromACase'), 'z terminala': L('inventory.fromATerminal'), 'z wymiany': L('inventory.fromATrade'), 'z kontraktu': L('inventory.fromAContract') }[s] || s);
// items every player gets with the game: stock weapons (only in the inventory when they got a name tag / sticker)
// and the default music kits
const isDefault = (it) => it.rarity === 'Rarity_Default' || /^Music Kit \| Valve, (CS:GO|CS2)$/.test(it.hash || '') || (!it.marketable && !it.lock && it.hash && !it.hash.includes('|') && /^(★ )?(AK-47|M4A4|M4A1-S|AWP|Glock-18|USP-S|P2000|Desert Eagle|Knife|C4 Explosive|Zeus x27|.*Knife)$/.test(it.hash));
function originLine(g) {
  if (isDefault(g.rep)) return `<div class="src" title="${L('inventory.aDefaultItemEveryPlayer')}">${L('inventory.defaultItemFromTheGame')}</div>`;
  const o = originOf(g.rep);
  if (!o) return '';
  const date = new Date(o.t).toLocaleDateString();
  const cost = o.cost != null ? steam.fmt(o.cost) : o.wait ? '…' : '?';
  const what = o.src === 'drop' ? esc(dropLabel(o.detail)) : `${srcName(o.src)}${o.detail ? ' ' + esc(o.detail) : ''}`;
  const title = {
    kupiony: L('inventory.boughtOnTheMarketFor', { date, cost }),
    'ze skrzyni': L('inventory.droppedFromACaseCost', { detail: o.detail, date, cost }),
    'z terminala': L('inventory.boughtInTheTerminalCost', { detail: o.detail, date, cost }),
    'z wymiany': L('inventory.fromATradeCostThe', { detail: o.detail, date, cost, gave: (o.gave || []).join(', ') || L('inventory.nothingAGift') }),
    'z kontraktu': L('inventory.fromAContractCostThe', { date, cost }),
    drop: o.guess ? L('inventory.steamTradingCardsBackgroundsAnd') : `${o.detail} (${date})`,
  }[o.src] || '';
  return `<div class="src" title="${esc(title)}">${what}</div>`;
}
/** right side of the price row: what this copy cost you, coloured by whether it's worth more now */
/**
 * result per unit if sold at buyer price `now`: what you get after the fee − what the item cost you (from Historia;
 * "ok." when the cost is an estimate). '' when the cost isn't known (yet).
 */
function profitOf(g, now) {
  const o = originOf(g.rep);
  if (!o || o.cost == null || !now) return null;
  const net = steam.receivedFromBuyer(now);
  return { v: net - o.cost, pct: o.cost > 0 ? net / o.cost - 1 : null, approx: !((o.src === 'kupiony' && !o.approx) || o.cost === 0) };
}
/** a grouped card shows the whole group: the amounts × the number of units, the unit amount in a line under it */
const unitLine = (g, v) => (g.qty > 1 && v != null ? `<span class="sub">${g.qty} × ${steam.fmt(v)}</span>` : '');
const forAll = (g) => (g.qty > 1 ? L('inventory.forAllUnits', { qty: g.qty }) : '');
function profitTag(g, now, what = L('inventory.sellingAtTheLowestPrice')) {
  const p = profitOf(g, now);
  if (!p) return '';
  const sign = p.v >= 0 ? '+' : '−';
  return `<div class="pl ${p.v >= 0 ? 'pos' : 'neg'}" title="${L('inventory.whatYouGetWhenMinus', { what, g: forAll(g), approx: p.approx ? L('inventory.estimatedCost') : '' })}${g.qty > 1 ? `\n${L('inventory.perUnit')}: ${sign}${steam.fmt(Math.abs(p.v))}` : ''}"><span class="lb">${L('inventory.result')}${p.approx ? ' ok.' : ''}</span><b>${sign}${steam.fmt(Math.abs(p.v * g.qty))}${p.pct != null ? ` <span class="sub">(${sign}${Math.round(Math.abs(p.pct) * 100)}%)</span>` : ''}</b></div>`;
}

function costTag(g, now) {
  const o = originOf(g.rep);
  if (!o) return '';
  const free = o.cost === 0;
  if (o.cost == null) return `<div title="${o.wait ? L('inventory.workingOutTheCost') : L('inventory.couldntWorkOutTheCost')}"><span class="lb">${L('inventory.cost')}</span><b class="mut">${o.wait ? '…' : '?'}</b></div>`;
  const net = now ? steam.receivedFromBuyer(now) : null;
  const cls = free || net == null ? '' : net >= o.cost ? 'pos' : 'neg';
  return `<div title="${L('inventory.whatItCostYou')}${o.src === 'kupiony' && !o.approx ? '' : o.approx ? L('inventory.estimatedThisPurchaseIsNot') : L('inventory.estimated')}${forAll(g)}${net != null && !free ? L('inventory.todayYoudGet', { net: steam.fmt(net * g.qty) }) : ''}"><span class="lb">${L('inventory.cost')}${(o.src === 'kupiony' && !o.approx) || free ? '' : ' ok.'}</span><b class="${cls}">${free ? L('inventory.free') : steam.fmt(o.cost * g.qty)}</b>${free ? '' : unitLine(g, o.cost)}</div>`;
}

/** "Tradable/Marketable After Nov 19, 2026 (8:00:00) GMT" → "19.11 09:00" (local time) */
const lockDate = (lock) => fmtWhen(lockUntil(lock), null);

// storefront: "this item on the market" (a cart would read as "listed for sale", which the 🛒 line already says)
const SHOP_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9l1.6-5h14.8L21 9"/><path d="M3 9a3 3 0 0 0 6 0a3 3 0 0 0 6 0a3 3 0 0 0 6 0"/><path d="M5 11.6V20h14v-8.4"/><path d="M10 20v-4.5h4V20"/></svg>';

function card(g) {
  const it = g.rep;
  const up = unitPrice(it);
  const st = steamOf(it);
  const sv = stickerValue(it);
  const border = it.rarityColor ? `border-bottom-color:#${esc(it.rarityColor)}` : '';
  // the same item on the market: same wear, StatTrak / Souvenir or not (ui.marketUrl adds the filters Steam's new item pages need)
  const mk = it.listed || it.marketable || it.lock ? `<a class="mk" href="${esc(ui.marketUrl(it.appid || 730, it.hash))}" target="_blank" rel="noopener" title="${esc(`${L('inventory.showOnTheSteamMarket')}: ${it.hash}\n${L('inventory.theSameWearAndStattrak')}`)}" aria-label="${L('inventory.showOnTheSteamMarket')}">${SHOP_ICON}</a>` : '';
  const nameTag = it.nameTag ?`<div class="sub" style="color:#e5b84c;font-style:italic;overflow:hidden;white-space:nowrap;text-overflow:ellipsis" title="Name tag: ${esc(it.nameTag)}">🏷 „${esc(it.nameTag)}”</div>` : '';
  if (it.listed) {
    const low = st?.lowest;
    const beaten = low != null && low < it.listPrice;
    return `<div class="gi listed ${sellWatch.get(it.hash) ? 'mark' : ''} ${patternClass(patternFor(it.hash, it.seed))} ${hlClass(g)}" data-k="${esc(g.key)}" style="${border}" title="${esc(it.hash)}\n${L('inventory.listedOnTheMarketYou')}">
    <div class="qs"><button class="red" data-q="unlist" title="${L('inventory.takesTheListingOffThe')}">✕ ${L('inventory.takeOff')}</button></div>
    ${mk}${wtBtn(it)}
    <div class="st">${it.stickers.slice(0, 5).map((s) => `<img src="${esc(s.img)}" title="${esc(s.kind + ': ' + s.name)}">`).join('')}</div>
    <img class="m" loading="lazy" src="${icon(it.icon, '128fx96f')}">${g.qty > 1 ? `<span class="qty" title="${L('inventory.identicalUnitsInThisGroup', { qty: g.qty })}">×${g.qty}</span>` : ''}
    <div class="n" style="color:#${esc(it.color || 'c6d4df')}">${esc(it.name)}</div>
    <div class="meta">${nameTag}${it.float != null ? `<div class="fl"><i style="left:${(it.float * 100).toFixed(1)}%"></i></div>${floatLine(it, g.key)}` : ''}</div>
    <div class="foot">
      <div class="sub warn">🛒 ${L('inventory.onTheMarketFor')} <b>${steam.fmt(it.listPrice)}</b></div>
      <div class="sub ${beaten ? 'err' : low != null ? 'ok' : ''}">${low == null ? L('inventory.checkingTheMarket') : beaten ? L('inventory.undercutCheapest', { low: steam.fmt(low) }) : L('inventory.yoursIsTheCheapest')}</div>
      <div class="pv">
        <div title="${L('inventory.whatYouGetAfterThe')}"><span class="lb">${L('inventory.youGet2')}</span><b>${steam.fmt(steam.receivedFromBuyer(it.listPrice) * g.qty)}</b><span class="sub">${low != null ? `${L('inventory.market')} ${steam.fmt(low * g.qty)}` : ''}</span>${unitLine(g, steam.receivedFromBuyer(it.listPrice))}</div>
        ${costTag(g, it.listPrice)}${profitTag(g, it.listPrice, L('inventory.sellingAtYourListingPrice'))}
      </div>
    </div>
    <div class="tail">${originLine(g)}</div>
  </div>`;
  }
  const locked = !it.marketable && it.lock;
  return `<div class="gi ${sel.has(g.key) ? 'sel' : ''} ${locked ? 'locked' : ''} ${sellWatch.get(it.hash) ? 'mark' : ''} ${patternClass(patternFor(it.hash, it.seed))} ${hlClass(g)}" data-k="${esc(g.key)}" style="${border}" title="${esc(it.hash)}${it.nameTag ? `\nName tag: ${esc(it.nameTag)}` : ''}${it.lock ? '\n' + esc(it.lock) : ''}">
    ${it.marketable ? `<div class="qs"><button data-q="lowest" title="${L('inventory.listOnTheMarketA')}">${L('inventory.list')}</button><button class="g" data-q="instant" title="${L('inventory.sellRightAwayToThe2')}">⚡ ${L('inventory.now')}</button></div>` : locked ? `<div class="qs"><button data-q="plan" title="${L('inventory.illListThisItemMyself')}">⏰ ${planOf(it.hash) ? L('inventory.changeTheSalePlan') : L('inventory.planASale')}</button></div>` : ''}
    ${mk}${wtBtn(it)}
    <div class="st">${it.stickers.slice(0, 5).map((s) => `<img src="${esc(s.img)}" title="${esc(s.kind + ': ' + s.name)}">`).join('')}</div>
    <img class="m" loading="lazy" src="${icon(it.icon, '128fx96f')}">${g.qty > 1 ? `<span class="qty" title="${L('inventory.identicalUnitsInThisGroup', { qty: g.qty })}">×${g.qty}</span>` : ''}
    <div class="n" style="color:#${esc(it.color || 'c6d4df')}">${esc(it.name)}</div>
    <div class="meta">${nameTag}${it.float != null ? `<div class="fl"><i style="left:${(it.float * 100).toFixed(1)}%"></i></div>${floatLine(it, g.key)}` : ''}</div>
    <div class="foot">
    ${!it.marketable && !it.lock ? '' : `<div class="pv">
      <div title="${esc(`${L('inventory.youGetWhatYouGet')}${st?.volume != null ? L('inventory.sellPer24h', { volume: st.volume }) : ''}${sig.trendNote(it) ? `\n\n${sig.trendNote(it)}` : ''}${g.qty > 1 ? L('inventory.forAllUnitsTogetherThe', { qty: g.qty }) : ''}`)}"><span class="lb">${L('inventory.youGet2')}</span><b>${up.v ? steam.fmt(steam.receivedFromBuyer(up.v) * g.qty) : '-'}</b><span class="sub">${up.v ? `${L('inventory.market')} ${steam.fmt(up.v * g.qty)}` : ''}</span>${up.v ? unitLine(g, steam.receivedFromBuyer(up.v)) : ''}</div>
      ${costTag(g, up.v)}${profitTag(g, up.v)}
    </div>`}
    ${adviceLine(it, up.v)}
    </div>
    <div class="tail">
    ${originLine(g)}
    ${sv ? `<div class="sub warn" title="${esc(`${L('inventory.stickersPriceOfNewOnes')}:
${it.stickers.map((x) => `${x.name}: ${stickerPrice(x) ? steam.fmt(stickerPrice(x)) : '?'}`).join('\n')}

${L('inventory.appliedOnesUsuallyRaiseThe')}`)}">${L('inventory.stickers2')} ~${steam.fmt(sv)}</div>` : ''}
    ${(() => {
      // never for sale (medals, coins…): just that; trade-locked: the 🔒 chip first, then the same signals
      if (!it.marketable && !it.lock) return `<div class="sigs"><span class="sig skip" title="${L('inventory.thisItemCantBeSold')}">${L('inventory.unsellable2')}</span></div>`;
      const lockChip = it.marketable ? '' : `<span class="sig skip" title="${esc(it.lock)}">🔒 ${lockDate(it.lock) ? L('inventory.until') + lockDate(it.lock) : L('inventory.tradeLock')}</span>${planChip(it)}`;
      const lockNote = it.marketable ? '' : L('inventory.theItemHasATrade');
      const lowest = up.v;
      const ss = sig.signals(it, lowest);
      const hs = sig.histState(it, lowest);
      const checking = `<span class="sig skip" title="${L('inventory.downloadingThePriceHistoryOf')}"><span class="spin" style="width:8px;height:8px;border-width:1.5px;margin-right:4px"></span>${L('inventory.checking')}</span>`;
      if (ss.length) {
        // trend checked and nothing to say (no "cena spada" / "drogo teraz"): said in the tooltip of the other chips
        const calm = hs === 'ok' && !ss.some((x) => x.k === 'fall' || x.k === 'high' || x.k === 'hold' || x.k === 'tdown' || x.k === 'tup') ? L('inventory.trendCheckedThePriceIsnt') : '';
        return `<div class="sigs">${lockChip}${ss.map((x) => `<span class="sig ${x.k}" title="${esc(x.title + calm + lockNote)}">${esc(x.label)}</span>`).join('')}${hs === 'wait' && !ss.some((x) => x.k === 'hold') ? checking : ''}</div>`;
      }
      if (hs === 'wait') return `<div class="sigs">${lockChip}${checking}</div>`;
      if (hs === 'ok') return `<div class="sigs">${lockChip}<span class="sig hold" title="${L('inventory.thePriceIsNormalNot')}">${L('inventory.hold')}</span></div>`;
      if (hs === 'none') return `<div class="sigs">${lockChip}<span class="sig skip" title="${L('inventory.steamHasNoPriceHistory')}">${L('inventory.noPriceHistory')}</span></div>`;
      return lockChip ? `<div class="sigs">${lockChip}</div>` : '';
    })()}
    </div>
  </div>`;
}

/** button: refresh prices now, selected items, or all marketable when nothing is selected */
async function fetchPrices() {
  const base = sel.size ? groups().filter((g) => sel.has(g.key)) : groups();
  const list = [...new Map(base.filter((g) => g.rep.marketable).map((g) => [g.hash, g.rep])).values()].map((it) => ({ appid: it.appid, hash: it.hash }));
  if (!list.length) return ui.log(L('inventory.noSellableItems'), 'warn');
  ui.log(L('inventory.refreshingSteamPricesForItems', { list: list.length, min: Math.max(1, Math.ceil((list.length * 1.2) / 60)) }));
  await autoPrice({ force: true, list });
}


// ---------------------------------------------------------------- selling
async function priceFor(g, mode, fixed) {
  const it = g.rep;
  const rule = sellRules.get(it.hash) || {};
  if (mode === 'fixed') return { price: fixed, note: '' };
  if (mode === 'saved') return rule.target != null ? { price: rule.target, note: L('inventory.saved') } : { price: null, note: L('inventory.noSavedPrice') };
  const h = await prices.hist(it.appid, it.hash);
  if (mode === 'advice') {
    const a = adviceOf(it, h);
    if (!a) return { price: rule.target ?? null, note: L('inventory.noListingsOnTheMarket') };
    let p = a.price;
    let note = a.method === 'fill' ? L('inventory.chanceToSellWithinFrom', { horizon: fmtDays(a.horizon), chance: pctOf(a.chance) })
      : !a.rate ? L('inventory.aCentBelowTheCheapest', { cheapest: steam.fmt(a.cheapest) })
      : a.rare ? L('inventory.inDaysOnlyOfUnits', { days: a.rare.days, n: a.rare.n, total: a.rare.total })
      : a.ahead ? L('inventory.shouldSellCheaperListingsAhead', { wait: fmtWait(a.wait), ahead: a.ahead })
        : L('inventory.aCentBelowTheCheapest2', { cheapest: steam.fmt(a.cheapest) });
    if (a.sellNow && a.instant) note += L('inventory.sellingRightAwayToThe', { price: steam.fmt(a.instant.price) });
    if (a.dumped) note += L('inventory.theCheapestListingsAreClearly');
    if (rule.min != null && p < rule.min) { p = rule.min; note += L('inventory.raisedToTheMinimum'); }
    return { price: p, note };
  }
  if (mode === 'instant') {
    if (!h.highestBuy) return { price: null, note: L('inventory.noBuyOrders') };
    return { price: h.highestBuy, note: L('inventory.highestOrderPcs', { buyGraph: h.buyGraph[0]?.[1] ?? '?' }) };
  }
  const comp = competitorSell(h.sellGraph, {}, settings.ignoreBelow ?? 2, sig.skipChooser(g.hash)); // a few cheap listings in front, when waiting for them to go pays
  if (comp == null) return { price: rule.target ?? null, note: L('inventory.noListingsOnTheMarket') };
  let p = comp - settings.undercut;
  let note = `${L('inventory.lowest')} ${steam.fmt(comp)}`;
  if (rule.min != null && p < rule.min) { p = rule.min; note += L('inventory.raisedToTheMinimum'); }
  return { price: Math.max(MIN_BUYER, p), note };
}

/**
 * "Wystaw": one dialog, the price field starts at the proposal; buttons for the proposal / fastest / sell now / your
 * saved target fill it in; or type your own. Live: what you get, the price Steam will really show, the chance to sell
 * (from the item's own record) and warnings (under your minimum, far under the market, at or below a buy order).
 */
async function listDialog(g) {
  const it = g.rep;
  const rule = sellRules.get(it.hash) || {};
  const h = await prices.hist(it.appid, it.hash);
  const a = adviceOf(it, h);
  const table = sig.fill(it.hash);
  const N = a?.method === 'fill' ? a.horizon : null;
  const cheapest = h.lowestSell;
  const quick = a?.quick ?? (cheapest ? Math.max(MIN_BUYER, cheapest - settings.undercut) : null);
  const f = steam.fmt;
  const presets = [];
  if (a?.sellNow && a.instant) presets.push({ p: a.instant.price, label: L('inventory.suggested'), sub: L('inventory.rightAwayToTheBuy2') });
  else if (a) presets.push({ p: a.price, label: L('inventory.suggested'), sub: a.method === 'fill' ? L('inventory.chanceWithin2', { N: fmtDays(N), chance: pctOf(a.chance) }) : a.rare ? L('inventory.inDaysThisMuchOr', { days: a.rare.days, n: a.rare.n, total: a.rare.total }) : a.wait != null ? L('inventory.willSell', { wait: fmtWait(a.wait) }) : '' });
  if (quick && quick !== a?.price) presets.push({ p: quick, label: L('inventory.fastest'), sub: L('inventory.aCentUnderTheCheapest', { cheapest: f(cheapest) }) });
  if (h.highestBuy && !presets.some((x) => x.p === h.highestBuy)) presets.push({ p: h.highestBuy, label: `⚡ ${L('inventory.rightAway')}`, sub: L('inventory.toTheHighestBuyOrder') });
  if (rule.target != null && !presets.some((x) => x.p === rule.target)) presets.push({ p: rule.target, label: L('inventory.saved2'), sub: L('inventory.yourTargetPrice') });
  const ref = unitPrice(it).v || cheapest;
  const info = (m) => {
    const box = m.querySelector('#ls-info');
    const v = parsePrice(m.querySelector('#ls-price').value);
    if (isNaN(v) || v < MIN_BUYER) { box.innerHTML = L('inventory.enterThePriceTheBuyer'); return; }
    const recv = steam.receivedFromBuyer(v);
    const listed = steam.buyerFromReceived(recv); // what Steam will really show
    const msgs = [L('inventory.youGet3', { recv: f(recv), qty: g.qty > 1 ? L('inventory.perUnitInTotal', { recv: f(recv * g.qty) }) : '' })];
    const pr = profitOf(g, listed);
    if (pr) msgs.push(`${L('inventory.resultAgainstTheCost')}${pr.approx ? L('inventory.estimatedCost') : ''}: <b class="${pr.v >= 0 ? 'ok' : 'err'}">${pr.v >= 0 ? '+' : '−'}${f(Math.abs(pr.v))}${pr.pct != null ? ` (${pr.v >= 0 ? '+' : '−'}${Math.round(Math.abs(pr.pct) * 100)}%)` : ''}</b>${g.qty > 1 ? L('inventory.perUnit2') : ''}`);
    if (listed !== v) msgs.push(`<span class="warn">${L('inventory.doesntExistOnSteamThe', { v: f(v), listed: f(listed) })}</span>`);
    const c = table && N ? sellChance(table, N, listed, h.sellGraph) : null;
    if (c != null) msgs.push(`${L('inventory.chanceToSellWithin', { N: fmtDays(N) })}: <b class="${c >= 0.5 ? 'ok' : c >= 0.25 ? 'warn' : 'err'}">${pctOf(c)}</b> <span class="sub">${L('inventory.fromTheItemsHistory')}</span>`);
    if (h.highestBuy && listed <= h.highestBuy) msgs.push(`<span class="warn">${L('inventory.notAboveTheHighestBuy')}</span>`);
    else if (quick && listed < quick) msgs.push(`<span class="warn">${L('inventory.cheaperThanNeededToBe', { cheapest: f(cheapest) })}</span>`);
    if (rule.min != null && listed < rule.min) msgs.push(`<span class="warn">${L('inventory.belowYourMinimum', { min: f(rule.min) })}</span>`);
    if (ref && listed < ref * 0.75) msgs.push(`<span class="err">${L('inventory.belowTheLowestPriceOn', { listed: Math.round((1 - listed / ref) * 100) })}</span>`);
    box.innerHTML = msgs.join('<br>');
  };
  const html = `${esc(it.name)}${g.qty > 1 ? ` <b>×${g.qty}</b>` : ''}
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin:10px 0">${presets.map((x) => `<button class="b" data-set="${x.p}" style="display:flex;flex-direction:column;align-items:flex-start;gap:2px;padding:6px 10px;text-align:left"><span>${x.label}: <b>${f(x.p)}</b></span>${x.sub ? `<span class="sub">${esc(x.sub)}</span>` : ''}</button>`).join('')}</div>
    <label style="display:flex;align-items:center;gap:8px">${L('inventory.priceTheBuyerPays')}<input class="p" id="ls-price" value="${toInput(presets[0]?.p ?? '')}" style="width:90px"></label>
    <div id="ls-info" class="sub" style="margin-top:8px;min-height:3.6em;line-height:1.5"></div>`;
  const price = await ui.ask(L('inventory.listOnTheMarket'), html, {
    ok: L('inventory.list'),
    collect: (m) => parsePrice(m.querySelector('#ls-price').value),
    onOpen: (m) => {
      const inp = m.querySelector('#ls-price');
      inp.addEventListener('input', () => info(m));
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') m.querySelector('[data-r="1"]').click(); });
      m.querySelectorAll('[data-set]').forEach((b) => b.addEventListener('click', () => { inp.value = toInput(+b.dataset.set); info(m); inp.focus(); }));
      info(m);
      inp.focus();
      inp.select();
    },
  });
  if (price === false) return;
  if (isNaN(price) || price < MIN_BUYER) return ui.log(L('inventory.invalidPriceNothingListed'), 'warn');
  await sell([{ g, price }]);
}

// ---------------------------------------------------------------- planned sales of trade-locked items
// hash → { appid, qty, until, mode: 'advice' | 'fixed', price, min, at }: listed once the lock is over (the leader tab
// checks every minute while any Steam page with Flipster is open); every listing still needs the Steam app confirmation
const sellPlans = store.bucket('sellPlans');
const planOf = (hash) => sellPlans.get(hash) || null;
const planChip = (it) => {
  const p = planOf(it.hash);
  if (!p) return '';
  const how = (p.mode === 'fixed' ? L('inventory.for', { price: steam.fmt(p.price) }) : L('inventory.atTheSuggestedPrice', { min: p.min != null ? `, min. ${steam.fmt(p.min)}` : '' })) + (p.guard ? L('inventory.thenTheAutomationWatchesThe') : '');
  return `<span class="sig plan" data-q="plan" title="${esc(L('inventory.plannedSaleClickToChange', { until: fmtWhen(p.until), how, qty: p.qty > 1 ? L('inventory.ofPcs', { qty: p.qty }) : '' }))}">⏰ ${L('inventory.illList')} ${esc(fmtWhen(p.until))}</span>`;
};

async function planDialog(g) {
  const it = g.rep, f = steam.fmt;
  const old = planOf(it.hash);
  const until = lockUntil(it.lock);
  const h = await prices.hist(it.appid, it.hash).catch(() => null);
  const a = adviceOf(it, h);
  const today = a?.price ?? unitPrice(it).v ?? null;
  const html = `${esc(it.name)}${g.qty > 1 ? ` <b>×${g.qty}</b>` : ''}
    <div class="sub" style="margin:4px 0 10px">${L('inventory.lockedUntilThenFlipsterLists', { until: esc(fmtWhen(until)) })}</div>
    <label style="display:flex;gap:8px;align-items:center;margin:6px 0"><input type="radio" name="pl-m" value="advice" ${old?.mode !== 'fixed' ? 'checked' : ''}> ${L('inventory.suggestedPriceOfTheUnlock')}${today ? ` <span class="sub">(${L('inventory.today')}: ${f(today)})</span>` : ''}</label>
    <label class="sub" style="display:flex;gap:8px;align-items:center;margin:0 0 6px 26px">${L('inventory.notBelow')} <input class="p" id="pl-min" value="${toInput(old?.min ?? null)}" placeholder="${L('inventory.noLimit')}" style="width:90px"> zł</label>
    <label style="display:flex;gap:8px;align-items:center;margin:6px 0"><input type="radio" name="pl-m" value="fixed" ${old?.mode === 'fixed' ? 'checked' : ''}> ${L('inventory.fixedPrice')} <input class="p" id="pl-price" value="${toInput(old?.price ?? today ?? null)}" style="width:80px"> zł <span class="sub">${L('inventory.theBuyerPays')}</span></label>
    ${g.qty > 1 ? `<label style="display:flex;gap:8px;align-items:center;margin:10px 0 0">${L('inventory.howMany')} <input type="number" id="pl-qty" min="1" max="${g.qty}" value="${Math.min(old?.qty ?? g.qty, g.qty)}" style="width:70px"> ${L('inventory.of')} ${g.qty}</label>` : ''}
    <label style="display:flex;gap:8px;align-items:flex-start;margin:12px 0 0"><input type="checkbox" id="pl-guard" ${old?.guard ? 'checked' : ''} style="margin-top:2px"><span>${L('inventory.afterListingLetTheAutomation')}<br><span class="sub">${L('inventory.itUndercutsCheaperOnesBut')}${settings.autoRelist ? '' : L('inventory.theAutomationIsOffNow')}</span></span></label>
    ${old ? `<label style="display:flex;gap:8px;align-items:center;margin:12px 0 0"><input type="checkbox" id="pl-del"> ${L('inventory.removeThisPlan')}</label>` : ''}`;
  const r = await ui.ask(old ? L('inventory.salePlan') : L('inventory.planASale'), html, {
    ok: old ? L('inventory.save') : L('inventory.plan'),
    collect: (m) => ({
      del: !!m.querySelector('#pl-del')?.checked,
      guard: !!m.querySelector('#pl-guard')?.checked,
      mode: m.querySelector('input[name="pl-m"]:checked')?.value || 'advice',
      min: parsePrice(m.querySelector('#pl-min').value),
      price: parsePrice(m.querySelector('#pl-price').value),
      qty: Math.max(1, Math.min(g.qty, parseInt(m.querySelector('#pl-qty')?.value, 10) || g.qty)),
    }),
    onOpen: (m) => {
      // typing a price picks its option
      m.querySelector('#pl-price').addEventListener('input', () => { m.querySelector('input[value="fixed"]').checked = true; });
      m.querySelector('#pl-min').addEventListener('input', () => { m.querySelector('input[value="advice"]').checked = true; });
    },
  });
  if (!r) return;
  if (r.del) { sellPlans.del(it.hash); ui.log(L('inventory.salePlanRemoved', { hash: it.hash })); render(); return; }
  if (r.mode === 'fixed' && (isNaN(r.price) || r.price < MIN_BUYER)) return ui.log(L('inventory.enterAFixedPriceE'), 'warn');
  const min = r.mode === 'advice' && !isNaN(r.min) && r.min >= MIN_BUYER ? r.min : null;
  if (r.guard && r.mode !== 'fixed' && min == null) return ui.log(L('inventory.theAutomationNeedsALower'), 'warn');
  sellPlans.set(it.hash, { name: it.name, icon: it.icon, color: it.color, appid: it.appid || 730, qty: r.qty, until, mode: r.mode, price: r.mode === 'fixed' ? r.price : null, min, guard: r.guard, at: Date.now() });
  ui.log(L('inventory.plannedTheSaleOfFor', { hash: it.hash, qty: r.qty > 1 ? ` ×${r.qty}` : '', until: fmtWhen(until), mode: r.mode === 'fixed' ? L('inventory.for', { price: f(r.price) }) : L('inventory.atTheSuggestedPrice', { min: min != null ? L('inventory.notBelow2', { min: f(min) }) : '' }), guard: r.guard ? L('inventory.thenTheAutomationWatchesThe') : '' }), 'ok');
  render();
}

let planBusy = false;
/** every minute: plans whose lock is over → the sellable copies are listed (only the leader tab, so never twice) */
async function planTick() {
  if (planBusy || !isLeader()) return;
  const due = Object.entries(sellPlans.all()).filter(([, p]) => (!p.until || p.until <= Date.now()) && !(p.nextTry > Date.now()));
  if (!due.length) return;
  planBusy = true;
  let listedAny = false;
  try {
    if (!(await steam.ensureLogin())) return;
    const invs = new Map();
    for (const [hash, p] of due) {
      const appid = +p.appid || 730;
      if (!invs.has(appid)) invs.set(appid, await steam.inventory(undefined, appid, appid === 753 ? 6 : 2).catch(() => null));
      const inv = invs.get(appid);
      if (!inv) continue;
      const copies = inv.filter((i) => i.hash === hash && i.marketable).slice(0, p.qty || 1);
      if (!copies.length) {
        // the lock ended but nothing to sell (not moved yet, or the item is gone): keep trying for 3 days, every minute
        // for the first half hour, then every 10 minutes (each check reads the whole inventory, Steam's strictest limit)
        if (p.until && Date.now() - p.until > 3 * 86400000) { sellPlans.del(hash); ui.log(L('inventory.plannedSaleOf3Days', { hash }), 'warn'); }
        else if (p.until && Date.now() - p.until > 30 * 60000) sellPlans.set(hash, { ...p, nextTry: Date.now() + 10 * 60000 });
        continue;
      }
      let price = p.mode === 'fixed' ? p.price : null, note = '';
      if (p.mode !== 'fixed') {
        try { await sig.ensure([{ hash, appid }]); } catch { /* the advice works without the history too */ }
        const h = await prices.hist(appid, hash).catch(() => null);
        const a = h ? adviceOf(copies[0], h) : null;
        price = a?.price ?? p.min ?? null;
        if (p.min != null && price < p.min) { price = p.min; note = L('inventory.raisedToYourMinimum'); }
      }
      if (price == null || price < MIN_BUYER) {
        if (!p.warnAt || Date.now() - p.warnAt > 30 * 60000) { sellPlans.set(hash, { ...p, warnAt: Date.now() }); ui.log(L('inventory.plannedSaleOfNoMarket', { hash }), 'warn'); }
        continue;
      }
      sellPlans.del(hash); // before listing: another round mustn't list the same copies again
      const r = await sellMany(copies.map((item) => ({ item, price, amount: 1 })), { log: (m, c) => ui.log(`${L('inventory.plannedSale')}: ${m}`, c) });
      ui.log(L('inventory.plannedSaleOfListedOf', { hash, ok: r.ok, copies: copies.length, price: steam.fmt(price), note, confirm: r.confirm ? L('inventory.confirmInTheSteamApp') : '' }), r.ok ? 'ok' : 'err');
      if (r.ok) {
        listedAny = true;
        // from now on the auto-relist looks after it: the rule of this item gets "auto" and the floor of the plan
        const floor = p.mode === 'fixed' ? p.price : p.min;
        if (p.guard && floor != null) {
          sellRules.patch(hash, { auto: true, min: floor });
          ui.log(L('inventory.theAutomationWatchesThePrice', { hash, floor: steam.fmt(floor), autoRelist: settings.autoRelist ? '' : L('inventory.theAutomationIsOffTurn') }), settings.autoRelist ? 'ok' : 'warn');
        }
      }
      else sellPlans.set(hash, p); // nothing listed: the plan stays for the next round
    }
  } catch (e) {
    ui.log(`${L('inventory.plannedSale')}: ${e.message}`, 'warn');
  } finally { planBusy = false; }
  if (listedAny && el) load(); // the Ekwipunek tab shows the new state
}
/** started once from main: the plans run whether or not the Ekwipunek tab was opened */
export function startSellPlans() {
  setTimeout(planTick, 20000);
  setInterval(planTick, 60000);
}

async function quickSell(key, mode) {
  const g = groups().find((x) => x.key === key);
  if (!g) return;
  try {
    if (mode !== 'instant') return await listDialog(g);
    const { price, note } = await priceFor(g, 'instant');
    if (!price) return ui.log(`${g.hash}: ${note}`, 'warn');
    const recv = steam.receivedFromBuyer(price);
    const ref = unitPrice(g.rep).v;
    const warn = ref && price < ref * 0.75 ? `<br><span class="err">${L('inventory.carefulBelowTheLowestPrice', { price: Math.round((1 - price / ref) * 100) })}</span>` : '';
    const ok = await ui.ask(mode === 'instant' ? L('inventory.sellImmediately') : L('inventory.quickSale'),
      `${esc(g.rep.name)}${g.qty > 1 ? ` ×${g.qty}` : ''}<br>${L('inventory.price2')}: <b>${steam.fmt(price)}</b> (${esc(note)})<br>${L('inventory.youGet4')}: <b>${steam.fmt(recv * g.qty)}</b>${warn}`, { ok: L('inventory.list') });
    if (!ok) return;
    await sell([{ g, price }]);
  } catch (e) { ui.log(`${g.hash}: ${e.message}`, 'err'); }
}

async function sellDialog(gs) {
  gs = gs.filter((g) => g.rep.marketable && !g.rep.listed);
  if (!gs.length) return ui.log(L('inventory.selectSellableItems'), 'warn');
  const okMode = await ui.ask(L('inventory.bulkSale'), `
    <div style="display:flex;flex-direction:column;gap:8px">
      <label><input type="radio" name="sm" value="advice" checked> ${L('inventory.suggestedTheHighestPriceThat', { maxWaitDays: settings.maxWaitDays ?? 2 })}</label>
      <label><input type="radio" name="sm" value="lowest"> ${L('inventory.lowestPriceUndercutNotBelow', { undercut: steam.fmt(settings.undercut) })}</label>
      <label><input type="radio" name="sm" value="instant"> ${L('inventory.immediatelyToTheHighestBuy')}</label>
      <label><input type="radio" name="sm" value="saved"> ${L('inventory.savedTargetPrices')}</label>
      <label><input type="radio" name="sm" value="fixed"> ${L('inventory.fixedPrice')}: <input class="p" id="sm-fixed"></label>
      <div class="sub">${L('inventory.entriesInTheNextStep', { gs: gs.length })}</div>
    </div>`, {
    ok: L('inventory.next'),
    collect: (m) => ({ mode: m.querySelector('input[name="sm"]:checked')?.value || 'advice', fixed: parsePrice(m.querySelector('#sm-fixed')?.value) }),
  });
  if (!okMode) return;
  const { mode, fixed } = okMode;
  if (mode === 'fixed' && isNaN(fixed)) return ui.log(L('inventory.enterAFixedPrice'), 'warn');

  task = token();
  const plan = [];
  let i = 0;
  for (const g of gs) {
    if (task.cancelled) break;
    ui.progress(++i, gs.length);
    try { plan.push({ g, ...(await priceFor(g, mode, fixed)) }); } catch (e) { plan.push({ g, price: null, note: e.message }); if (e.status === 429) break; }
  }
  ui.progress(0);
  const table = `<div style="max-height:50vh;overflow:auto"><table><tr><th>${L('inventory.item')}</th><th>${L('inventory.price2')}</th><th>${L('inventory.youGet4')}</th></tr>${plan.map((p, j) => `
    <tr><td>${esc(p.g.rep.name)}${p.g.qty > 1 ? ` ×${p.g.qty}` : ''}<div class="sub">${esc(p.note)}</div></td>
    <td><input class="p" data-j="${j}" value="${toInput(p.price)}"></td><td class="sub">${p.price ? steam.fmt(steam.receivedFromBuyer(p.price) * p.g.qty) : '-'}</td></tr>`).join('')}</table></div>
    <div class="sub" style="margin-top:8px">${L('inventory.totalYouGet')}: <b>${steam.fmt(plan.reduce((s, p) => s + (p.price ? steam.receivedFromBuyer(p.price) * p.g.qty : 0), 0))}</b>. ${L('inventory.anEmptyFieldSkip')}</div>`;
  const edited = await ui.ask(L('inventory.confirmThePrices'), table, {
    ok: L('inventory.list'),
    wide: true,
    collect: (m) => [...m.querySelectorAll('input[data-j]')].map((inp) => {
      const v = inp.value.trim() ? parsePrice(inp.value) : null;
      return { j: +inp.dataset.j, v: v == null || isNaN(v) ? null : Math.max(MIN_BUYER, v) };
    }),
  });
  if (!edited) return;
  for (const { j, v } of edited) plan[j].price = v;
  const final = plan.filter((p) => p.price);
  const ref = final.filter((p) => { const u = unitPrice(p.g.rep).v; return u && p.price < u * 0.75; });
  if (ref.length && !(await ui.ask(L('inventory.carefulLowPrices'), L('inventory.entriesHaveAPriceOver', { ref: ref.length }), { ok: L('inventory.yesList'), danger: true }))) return;
  await sell(final);
}

async function sell(plan) {
  const jobs = plan.flatMap(({ g, price }) => g.items.map((it) => ({ item: it, price, amount: it.amount })));
  task = token();
  await withLock('sell', async () => {
    const r = await sellMany(jobs, {
      log: ui.log,
      isCancelled: () => task.cancelled,
      onStatus: () => {},
    });
    ui.log(L('inventory.saleListedErrors', { ok: r.ok, failed: r.failed }), r.failed ? 'warn' : 'ok');
    if (r.confirm) ui.log(L('inventory.listingsWaitForConfirmationIn', { confirm: r.confirm }), 'warn');
  });
  const sold = new Set(jobs.map((j) => j.item.assetid));
  items = items.filter((it) => !sold.has(it.assetid));
  sel.clear();
  render();
  // freshly listed items show up as "on the market"
  loadListed().then(render);
}

/** remove a listing (✕ on a listed card); the item returns to the inventory */
async function unlist(key) {
  const g = groups().find((x) => x.key === key);
  if (!g) return;
  const n = g.items.length;
  const ok = await ui.ask(L('inventory.takeOffTheMarket'), `${esc(g.rep.name)}${g.rep.nameTag ? ` (“${esc(g.rep.nameTag)}”)` : ''}${n > 1 ? L('inventory.listings', { n }) : ''} ${L('inventory.for2')} ${steam.fmt(g.rep.listPrice)}.<br>${L('inventory.theItemReturnsToThe')}`, { ok: L('inventory.takeOff'), danger: true });
  if (!ok) return;
  await withLock('unlist', async () => {
    for (const it of g.items) {
      const r = await steam.removeListing(it.listingid);
      ui.log(r.ok ? L('inventory.takenOffTheMarket', { name: it.name }) : L('inventory.couldntTakeOffHttp', { name: it.name, status: r.status }), r.ok ? 'ok' : 'err');
    }
  });
  load(); // reload both inventory (item came back) and listings
}

// ---------------------------------------------------------------- badges on Steam's native inventory page
let badgeData = null;
export async function initBadges() {
  if (!settings.badges || !/\/inventory\/?/.test(location.pathname)) return;
  const owner = [...document.scripts].map((s) => s.textContent.match(/UserYou\.SetSteamId\(\s*'(\d{17})'/)).find(Boolean)?.[1]
    || location.pathname.match(/\/profiles\/(\d{17})/)?.[1]
    || steam.ctx().steamId;
  badgeData = new Map(); // filled from page data immediately, then from the API
  // start observing right away: Steam renders the item grid asynchronously
  const target = document.getElementById('inventories') || document.body;
  let pending = false;
  new MutationObserver(() => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => { pending = false; updateBadges(); });
  }).observe(target, { childList: true, subtree: true });

  updateBadges();

  if (!owner) return;
  // CS2 has extra inventory contexts in the 2025+ system (listed / trade-protected items live outside context 2)
  const contexts = discoverContexts();
  // full data (float, stickers, name tag) from the inventory API, 10-min cache shared with the panel,
  // retries because Steam's own page loads the same inventory at the same moment (429)
  for (const ctxId of contexts) {
    for (let attempt = 0; attempt < (ctxId === 2 ? 4 : 2); attempt++) {
      try {
        const inv = await steam.inventory(owner, 730, ctxId, { maxAgeMin: 10 });
        for (const i of inv) badgeData.set(i.assetid, i);
        break;
      } catch (e) {
        console.warn(`[Flipster] badges, context ${ctxId}: ${e.message}, attempt ${attempt + 1}`);
        if (e.status === 403 || e.status === 400 || e.status === 500) break; // context not accessible
        await new Promise((r) => setTimeout(r, 15000 * (attempt + 1)));
      }
    }
  }
  // my own inventory: also show my listing price on listed items
  if (owner === steam.ctx().steamId) {
    try {
      const { listings } = await steam.myListings();
      badgeListings = new Map(listings.map((l) => [l.assetid, l]));
      for (const l of listings) if (!badgeData.has(l.assetid)) badgeData.set(l.assetid, steam.recallProps(l.item));
    } catch (e) { console.warn('[Flipster] badges, market listings', e.message); }
  }
  for (const [id, it] of badgeData) badgeData.set(id, steam.recallProps(it));
  updateBadges();
  // price everything that has a market: sellable, trade-protected and listed items
  const list = [...new Map([...badgeData.values()].filter((i) => i.hash).map((i) => [i.hash, { appid: i.appid, hash: i.hash }])).values()];
  let last = 0;
  prices.lowestPrices(list, { onEach: () => { if (Date.now() - last > 2000) { last = Date.now(); updateBadges(); } } }).then(updateBadges);
}

/** CS2 inventory contexts from the page (g_rgAppContextData); remembered for the panel on other pages */
export function discoverContexts() {
  let ids = [];
  try {
    const w = pageWin();
    let data = w.g_rgAppContextData;
    if (!data) {
      const m = [...document.scripts].map((s) => s.textContent.match(/g_rgAppContextData\s*=\s*(\{[\s\S]*?\});\s*\n/)).find(Boolean);
      if (m) data = JSON.parse(m[1]);
    }
    ids = Object.keys(data?.[730]?.rgContexts || {}).map(Number).filter((n) => n > 0);
  } catch { /* ignore */ }
  if (ids.length) store.set('ctx730', ids);
  else ids = store.get('ctx730', [2]);
  if (!ids.includes(2)) ids.unshift(2);
  if (!ids.includes(16)) ids.push(16); // trade-protected items (see loadAllContexts)
  return [...new Set(ids)].sort((a, b) => (a === 2 ? -1 : b === 2 ? 1 : a - b));
}

/**
 * Item data straight from Steam's page, the same objects Steam draws the tiles from
 * (incl. listed "$" and trade-protected items): g_ActiveInventory.m_rgAssets[assetid], or element.rgItem.
 */
const pageWin = () => { try { return typeof unsafeWindow !== 'undefined' ? unsafeWindow : window; } catch { return window; } };
function pageAsset(node, assetid) {
  try {
    const w = pageWin();
    const ctxId = +node.id.replace(/^item/, '').split('_')[1] || 2;
    const invs = [w.g_ActiveInventory, w.UserYou?.getInventory?.(730, ctxId), w.UserYou?.getInventory?.(730, 2)].filter(Boolean);
    for (const inv of [...invs]) if (inv.m_rgChildInventories) invs.push(...Object.values(inv.m_rgChildInventories));
    for (const inv of invs) {
      const a = inv.m_rgAssets?.[assetid] || inv.rgInventory?.[assetid];
      if (a) return a;
    }
    const el = w.document?.getElementById?.(node.id);
    return el?.rgItem || node.rgItem || null;
  } catch { return null; }
}
function fromPage(node, assetid) {
  const r = pageAsset(node, assetid);
  if (!r) return null;
  const d = r.description || r;
  if (!d.market_hash_name) return null;
  try {
    const it = steam.describeItem(
      { appid: r.appid ?? d.appid ?? 730, contextid: r.contextid ?? '2', assetid, classid: d.classid ?? r.classid, instanceid: d.instanceid ?? r.instanceid, amount: r.amount },
      d,
      r.asset_properties || d.asset_properties || [],
    );
    queuePricing(it);
    return steam.recallProps(it);
  } catch { return null; }
}

// items discovered on the page that have no price yet → price them in the background (debounced)
const pricingQueue = new Map();
let pricingTimer = null;
function queuePricing(it) {
  if (!it.hash || prices.hasLowest(it.appid, it.hash, 360)) return;
  pricingQueue.set(it.hash, { appid: it.appid, hash: it.hash });
  clearTimeout(pricingTimer);
  pricingTimer = setTimeout(() => {
    const list = [...pricingQueue.values()];
    pricingQueue.clear();
    let last = 0;
    prices.lowestPrices(list, { onEach: () => { if (Date.now() - last > 1500) { last = Date.now(); updateBadges(); } } }).then(updateBadges);
  }, 800);
}

/** my listing for this tile: by assetid, otherwise by item name (asset ids of listed items can differ) */
function listingFor(assetid, it) {
  const byId = badgeListings.get(assetid);
  if (byId) return byId;
  if (!it?.hash || it.marketable) return null; // a sellable tile cannot be the listed one
  const used = new Set([...badgeListingUse.values()]);
  const prev = badgeListingUse.get(assetid);
  if (prev) return prev;
  const l = [...badgeListings.values()].find((x) => x.hash === it.hash && !used.has(x));
  if (l) badgeListingUse.set(assetid, l);
  return l || null;
}
const badgeListingUse = new Map();

let badgeIds = null; // CSS selector variants for Steam's item elements
let badgeListings = new Map(); // assetid -> my listing
const pageTried = new Set();   // assetids already looked up in the page data
function updateBadges() {
  if (!badgeData) return;
  // classic inventory: id="730_2_<assetid>"; be tolerant to an "item" prefix
  document.querySelectorAll(badgeIds ||= '.item[id^="730_"], .item[id^="item730_"]').forEach((node) => {
    const assetid = node.id.split('_')[2];
    let it = badgeData.get(assetid);
    // API didn't return this tile (listed / trade-protected) or returned it without float → ask the page once
    if ((!it || !it.hash || it.float == null) && !pageTried.has(assetid)) {
      const pg = fromPage(node, assetid); // page data may not be loaded yet → retried on the next DOM change
      if (pg) {
        pageTried.add(assetid);
        it = it?.hash ? { ...pg, ...it, float: it.float ?? pg.float, seed: it.seed ?? pg.seed, nameTag: it.nameTag || pg.nameTag } : pg;
        badgeData.set(assetid, it);
      }
    }
    if (!it) return;
    let b = node.querySelector('.stt-badge');
    const up = unitPrice(it);
    const lst = listingFor(assetid, it) || (it.sealed === 'listed' ? { buyer: null } : null);
    const fl = `<span class="f">${it.nameTag ? '🏷' : ''}${it.float != null ? it.float.toFixed(3) : ''}</span>`;
    let html;
    if (lst) {
      // listed: lowest market price + float, then my listing price (red when someone is cheaper)
      const beaten = lst.buyer != null && up.v != null && up.src === 'steam' && up.v < lst.buyer;
      html = `<span title="${L('inventory.lowestPriceOnTheMarket')}">${up.v ? steam.fmt(up.v) : ''}</span>${fl}<span class="l ${beaten ? 'bad' : ''}">🛒 ${lst.buyer != null ? steam.fmt(lst.buyer) : L('inventory.onTheMarket')}</span>`;
    } else {
      if (!up.v && it.float == null && !it.nameTag) return;
      html = `<span>${up.v ? steam.fmt(up.v) : ''}</span>${fl}`;
    }
    if (!b) { b = document.createElement('div'); b.className = 'stt-badge'; node.appendChild(b); }
    b.classList.toggle('two', !!lst);
    // Steam draws its own "$" (listed) / lock (trade protected) icon bottom-left, move ours to the top there
    if (b.innerHTML !== html) b.innerHTML = html;
  });
}
