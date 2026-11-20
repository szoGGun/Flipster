// "Worth selling?" signals for inventory items:
//  zysk    , today's net price is ≥ X% above what you paid (FIFO cost of the copies you still hold, from Historia)
//  drogo   , the lowest listing is ≥ X% above the 30-day average sale price (a temporary peak)
//  spada   , last 7 days average is ≥ X% below the 3 weeks before (falling trend)
//  trzymaj , so cheap that Steam's minimum fees eat ≥ 40% of the price (same chip as "nothing to do")
import * as store from '../core/store.js';
import { settings } from '../core/store.js';
import * as steam from '../core/steam.js';
import { heldCosts } from './history.js';
import * as mt from './markettrend.js';
import { fillTable, queueChoice, LIST_SHARE, recentTrend } from '../core/analysis.js';
import { L } from '../core/i18n.js';

const hist = store.bucket('sellHist'); // hash -> { at, d: [[dayStart, avgPrice, volume]] } (last 35 days)
const TTL = 12 * 3600000;
const DAY = 86400000;

let costs = null, costsAt = 0;
function costOf(hash) {
  if (!costs || Date.now() - costsAt > 60000) {
    try { costs = heldCosts(); } catch { costs = new Map(); }
    costsAt = Date.now();
  }
  return costs.get(hash) ?? null;
}

/** forget price histories of items not looked at for two weeks (sold long ago), called once at start */
export function prune(days = 14) {
  const all = hist.all();
  const lim = Date.now() - days * DAY;
  const old = Object.keys(all).filter((k) => (all[k]?.at || 0) < lim);
  if (!old.length) return;
  for (const k of old) delete all[k];
  hist.replace(all);
}

// the fill table's version: an entry saved by an older fillTable (no `fv`, or a lower one) is fetched once more,
// or the 12 h cache keeps showing the old chances after an update (2026-11-20: 63% stayed on the cards after F5)
const FILL_V = 5; // 5: the "held" run is half a day of trading for busy items (fillTable), 2026-11-20
// items too thin for a fill table keep their sales of the last 30 days (`p`, see soldAt); an entry without them is
// fetched once more
const fresh = (hash) => { const h = hist.get(hash); return h && 'f' in h && h.fv === FILL_V && (h.f || 'p' in h) && Date.now() - h.at < TTL ? h : null; };

/** the item's own fill table (analysis.fillTable) for the listing advice, or null (no or too thin hourly history) */
export const fill = (hash) => fresh(hash)?.f || null;

/**
 * Items too thin for a fill table: units sold lately and how many of them at ≥ price (buyer), from Steam's hourly
 * records (an hour with several sales counts by its median). The last 14 days, 30 when that has fewer than 5 units
 * (30 alone mixed in the time before a drop: Glock Royal Legion 23 of 41 at 145 zł, in November 2 of 17).
 * → { n, total, days } or null when unknown or nothing sold.
 */
export function soldAt(hash, price) {
  const r = recentSales(hash);
  if (!r || price == null) return null;
  let n = 0, total = 0;
  for (const [, pr, v] of r.pts) { total += v; if (pr >= price) n += v; }
  return { n, total, days: r.days };
}
/** the price at least half of those recent units sold at (volume-weighted median), null when unknown */
export function recentMedian(hash) {
  const r = recentSales(hash);
  if (!r) return null;
  const s = [...r.pts].sort((a, b) => a[1] - b[1]);
  const tot = s.reduce((x, p) => x + p[2], 0);
  let acc = 0;
  for (const p of s) { acc += p[2]; if (acc >= tot / 2) return p[1]; }
  return null;
}
function recentSales(hash) {
  const h = hist.get(hash);
  if (!h?.p) return null;
  const within = (days) => { const since = Date.now() - days * DAY; return h.p.filter((p) => p[0] >= since && p[2] > 0); };
  const units = (pts) => pts.reduce((x, p) => x + p[2], 0);
  let pts = within(14), days = 14;
  if (units(pts) < 5) { pts = within(30); days = 30; }
  return pts.length ? { pts, days } : null;
}

/**
 * fetch missing price histories one by one (market lane), calling onEach after every item. Asked again while a run
 * is on (the listings, then the inventory): the new list waits its turn (it used to be dropped, those items kept
 * "sprawdzam" until the next load); what the earlier run fetched isn't fetched twice.
 */
let chain = Promise.resolve();
export function ensure(list, { onEach, isCancelled = () => false } = {}) {
  const run = chain.then(async () => {
    const todo = [...new Map(list.filter((x) => !fresh(x.hash)).map((x) => [x.hash, x])).values()];
    for (const x of todo) {
      if (isCancelled()) break;
      try {
        const pts = await steam.priceHistory(x.appid || 730, x.hash);
        const since = Date.now() - 35 * DAY;
        const days = new Map();
        for (const p of pts) {
          if (p.t < since) continue;
          const d = Math.floor(p.t / DAY) * DAY;
          const a = days.get(d) || [0, 0];
          a[0] += p.price * (p.vol || 1); a[1] += p.vol || 1;
          days.set(d, a);
        }
        let f = null;
        try { f = fillTable(pts); } catch { /* the trend chips still work without it */ }
        let rt = null;
        try { rt = recentTrend(pts); } catch { /* optional */ }
        const e = { at: Date.now(), d: [...days].sort((a, b) => a[0] - b[0]).map(([d, [s, v]]) => [d, Math.round(s / v), v]), f, rt, fv: FILL_V };
        if (!f) e.p = pts.filter((p) => p.t >= Date.now() - 30 * DAY && p.vol > 0).slice(-400).map((p) => [p.t, p.price, p.vol]);
        hist.set(x.hash, e);
      } catch (e) {
        if (e.status === 429) break;
        hist.set(x.hash, { at: Date.now(), d: [], f: null, p: [], fv: FILL_V });
      }
      onEach?.();
    }
  });
  chain = run.catch(() => {});
  return run;
}

const avg = (rows) => { const v = rows.reduce((s, r) => s + r[2], 0); return v ? rows.reduce((s, r) => s + r[1] * r[2], 0) / v : null; };

/** signals for one item at its current lowest (buyer) price */
export function signals(it, lowest) {
  if (!(it.marketable || it.lock) || !lowest) return [];
  const th = (settings.sellSignalPct ?? 10) / 100;
  const out = [];
  const net = steam.receivedFromBuyer(lowest);
  if (lowest > 0 && 1 - net / lowest >= 0.4) {
    out.push({ k: 'hold', label: L('sellsignals.hold'), cls: 'mut', title: L('sellsignals.theFeeEatsOfThe', { net: Math.round((1 - net / lowest) * 100), lowest: steam.fmt(lowest), net2: steam.fmt(net) }) });
    return out;
  }
  const cost = costOf(it.hash);
  if (cost && net >= cost * (1 + th)) out.push({ k: 'profit', label: L('sellsignals.inProfit', { net: Math.round((net / cost - 1) * 100) }), cls: 'pos', title: L('sellsignals.youBoughtItForToday', { cost: steam.fmt(Math.round(cost)), net: steam.fmt(net) }) });
  const h = hist.get(it.hash);
  if (h?.d?.length >= 5) {
    const now = Date.now();
    // "drogo teraz" = a real peak: what the item SOLD for in the last ~2 days is above the month before, and the
    // listings agree (you can list that high now). Comparing only the lowest listing with the month's sales mostly
    // measured the usual gap between listings and buy orders: on 201 exported items a third of the chips were just
    // that (e.g. a sticker listed 12% above its month while it kept selling 3% above it).
    const recentRows = h.d.filter((r) => r[0] >= now - 2 * DAY);
    const recent = avg(recentRows), recentVol = recentRows.reduce((s, r) => s + r[2], 0);
    const base = avg(h.d.filter((r) => r[0] >= now - 30 * DAY && r[0] < now - 2 * DAY));
    const a7 = avg(h.d.filter((r) => r[0] >= now - 7 * DAY));
    const prev = avg(h.d.filter((r) => r[0] < now - 7 * DAY && r[0] >= now - 28 * DAY));
    if (base && recent && recentVol >= 3 && recent >= base * (1 + th) && lowest >= base * (1 + th)) {
      out.push({ k: 'high', label: L('sellsignals.priceyNow'), cls: 'warn', title: L('sellsignals.overTheLast2Days', { recent: steam.fmt(Math.round(recent)), recentVol, recent2: Math.round((recent / base - 1) * 100), base: steam.fmt(Math.round(base)), lowest: steam.fmt(lowest) }) });
    }
    if (a7 && prev && a7 <= prev * (1 - th)) out.push({ k: 'fall', label: L('sellsignals.priceFalling'), cls: 'err', title: L('sellsignals.lastWeeksAverageIsLower', { a7: steam.fmt(Math.round(a7)), a72: Math.round((1 - a7 / prev) * 100), prev: steam.fmt(Math.round(prev)) }) });
  }
  // the last half year against the market (markettrend.js), as information only: a chip when this item did something
  // clearly different from the market (≥ 20 points), the numbers for every item in trendNote
  const tr = trendOf(it);
  if (tr?.ref && Math.abs(tr.t - tr.m) >= 0.2) {
    out.push({ k: tr.t < tr.m ? 'tdown' : 'tup', label: `${tr.t < 0 ? '↘' : '↗'} ${pctTxt(tr.t)} ${L('sellsignals.in')} ${tr.span} (${tr.ref.label} ${pctTxt(tr.m)})`, cls: 'mut', title: `${trendNote(it)}\n${L('sellsignals.thisOnlyTellsWhatAlready')}` });
  }
  return out;
}

const pctTxt = (x) => `${x < 0 ? '−' : '+'}${Math.round(Math.abs(x) * 100)}%`;
/** this item's last half year (or 3 months when younger) next to the market's: { t, m, span, rt, ref } or null */
// the basket is CS2 only: other games (a Rust jacket was compared with "rynek −31%") get their own numbers, no market
function trendOf(it) {
  const rt = hist.get(it.hash)?.rt;
  if (!rt) return null;
  const ref = String(it.appid || 730) === '730' ? mt.refFor(it.hash, it.type || '') : null;
  if (rt.t6 != null) return { t: rt.t6, m: ref?.t6 ?? null, span: L('sellsignals.halfAYear'), rt, ref: ref?.t6 != null ? ref : null };
  if (rt.t3 != null) return { t: rt.t3, m: ref?.t3 ?? null, span: L('sellsignals.3Months'), rt, ref: ref?.t3 != null ? ref : null };
  return null;
}
/** "Pół roku temu 127,20 zł, 3 miesiące temu 114,92 zł, teraz 88,02 zł (−31%). Rynek skinów w tym czasie: −33% (…)" or '' */
export function trendNote(it) {
  const tr = trendOf(it);
  if (!tr) return '';
  const f = (c) => (c ? steam.fmt(Math.round(c)) : '-');
  const own = L('sellsignals.monthlyMedianSalePriceHalf', { m6: f(tr.rt.m6), m3: f(tr.rt.m3), now: f(tr.rt.now), t: pctTxt(tr.t), span: tr.span });
  if (!tr.ref) return own;
  const who = tr.ref.whole ? L('sellsignals.theWholeMarket') : tr.ref.label.replace(/^./, (c) => c.toUpperCase());
  return `${own}\n` + L('sellsignals.ofCs2OverThatTime', { who, m: pctTxt(tr.m), n: tr.ref.n, at: new Date(tr.ref.at).toLocaleDateString() });
}

/** whether the price history needed for the trend signals is: 'wait' (not fetched yet), 'none' (Steam has none), 'ok' */
export function histState(it, lowest) {
  if (!(it.marketable || it.lock) || !lowest || lowest < 20) return 'skip';
  const h = hist.get(it.hash);
  if (!h) return 'wait';
  return h.d?.length >= 5 ? 'ok' : 'none';
}

/**
 * true when a reason to sell applies: "z zyskiem" or "drogo teraz". "cena spada" is only shown, on 170 items' history
 * the 4 weeks after it went like any other weeks on average (2026-11-17), so it isn't a reason to sell.
 */
export const worth = (sig) => sig.some((s) => s.k === 'profit' || s.k === 'high');

/** typical sale prices (buyer) from the cached price history: last 7 days and 30 days, volume-weighted; null if unknown */
/** competitorSell's choose(levels) for this item: which cheaper listings to leave in front (queueChoice) */
export function skipChooser(hash, net = (p) => steam.receivedFromBuyer(p)) {
  const table = fill(hash), t = typical(hash);
  const perDay = t?.sold7 ? (t.sold7 / 7) * LIST_SHARE : null; // buyers of listings (the rest buy from orders)
  return (levels) => queueChoice({ table, perDay, levels, net, undercut: settings.undercut, maxWaitDays: settings.maxWaitDays ?? 2 });
}

export function typical(hash) {
  const h = hist.get(hash);
  if (!h?.d?.length) return null;
  const now = Date.now();
  const d7 = h.d.filter((r) => r[0] >= now - 7 * DAY), d30 = h.d.filter((r) => r[0] >= now - 30 * DAY);
  return { d7: avg(d7), d30: avg(d30), sold7: d7.reduce((s, r) => s + r[2], 0) };
}
