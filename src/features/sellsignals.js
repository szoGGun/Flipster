// "Worth selling?" signals for inventory items:
//  zysk    , today's net price is ≥ X% above what you paid (FIFO cost of the copies you still hold, from Historia)
//  drogo   , the lowest listing is ≥ X% above the 30-day average sale price (a temporary peak)
//  spada   , last 7 days average is ≥ X% below the 3 weeks before (falling trend)
//  trzymaj , so cheap that Steam's minimum fees eat ≥ 40% of the price (same chip as "nothing to do")
import * as store from '../core/store.js';
import { settings } from '../core/store.js';
import * as steam from '../core/steam.js';
import { heldCosts } from './history.js';
import { fillTable, queueChoice, LIST_SHARE } from '../core/analysis.js';

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

// (an entry saved before the listing advice v2 has no `f` → fetched once more)
const fresh = (hash) => { const h = hist.get(hash); return h && 'f' in h && Date.now() - h.at < TTL ? h : null; };

/** the item's own fill table (analysis.fillTable) for the listing advice, or null (no or too thin hourly history) */
export const fill = (hash) => fresh(hash)?.f || null;

/** fetch missing price histories one by one (market lane), calling onEach after every item */
let running = null;
export function ensure(list, { onEach, isCancelled = () => false } = {}) {
  if (running) return running;
  const todo = [...new Map(list.filter((x) => !fresh(x.hash)).map((x) => [x.hash, x])).values()];
  running = (async () => {
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
        hist.set(x.hash, { at: Date.now(), d: [...days].sort((a, b) => a[0] - b[0]).map(([d, [s, v]]) => [d, Math.round(s / v), v]), f });
      } catch (e) {
        if (e.status === 429) break;
        hist.set(x.hash, { at: Date.now(), d: [], f: null });
      }
      onEach?.();
    }
  })().finally(() => { running = null; });
  return running;
}

const avg = (rows) => { const v = rows.reduce((s, r) => s + r[2], 0); return v ? rows.reduce((s, r) => s + r[1] * r[2], 0) / v : null; };

/** signals for one item at its current lowest (buyer) price */
export function signals(it, lowest) {
  if (!(it.marketable || it.lock) || !lowest) return [];
  const th = (settings.sellSignalPct ?? 10) / 100;
  const out = [];
  const net = steam.receivedFromBuyer(lowest);
  if (lowest > 0 && 1 - net / lowest >= 0.4) {
    out.push({ k: 'hold', label: 'trzymaj', cls: 'mut', title: `Prowizja zjada ${Math.round((1 - net / lowest) * 100)}% ceny: kupujący płaci ${steam.fmt(lowest)}, Ty dostajesz ${steam.fmt(net)}. Lepiej zostawić albo użyć w kontrakcie.` });
    return out;
  }
  const cost = costOf(it.hash);
  if (cost && net >= cost * (1 + th)) out.push({ k: 'profit', label: `z zyskiem +${Math.round((net / cost - 1) * 100)}%`, cls: 'pos', title: `Kupiłeś za ${steam.fmt(Math.round(cost))}, dziś dostaniesz na rękę ${steam.fmt(net)}.` });
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
      out.push({ k: 'high', label: 'drogo teraz', cls: 'warn', title: `Przez ostatnie 2 dni sprzedaje się średnio po ${steam.fmt(Math.round(recent))} (${recentVol} szt.), o ${Math.round((recent / base - 1) * 100)}% drożej niż wcześniej w tym miesiącu (${steam.fmt(Math.round(base))}). Najtańsza oferta: ${steam.fmt(lowest)}. Dobry moment, zanim cena wróci do normy.` });
    }
    if (a7 && prev && a7 <= prev * (1 - th)) out.push({ k: 'fall', label: 'cena spada', cls: 'err', title: `Średnia z ostatniego tygodnia (${steam.fmt(Math.round(a7))}) jest o ${Math.round((1 - a7 / prev) * 100)}% niższa niż z 3 tygodni wcześniej (${steam.fmt(Math.round(prev))}).` });
  }
  return out;
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
