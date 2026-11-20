import * as store from './store.js';
import { settings } from './store.js';
import * as steam from './steam.js';
import * as disk from './cache.js';

// ---------------------------------------------------------------- Steam priceoverview cache
const cache = store.bucket('prices'); // key appid|hash -> {lowest, median, volume, at}

export function cached(appid, hash) {
  return cache.get(appid + '|' + hash) || null;
}

export function fresh(appid, hash, maxAgeMin = settings.cacheMin) {
  const c = cached(appid, hash);
  return c && Date.now() - c.at < maxAgeMin * 60000 ? c : null;
}

export async function steamPrice(appid, hash, { force = false } = {}) {
  if (!force) {
    const f = fresh(appid, hash);
    if (f) return f;
  }
  const p = await steam.priceOverview(appid, hash);
  const v = { ...p, at: Date.now(), lowAt: Date.now() };
  cache.set(appid + '|' + hash, v);
  return v;
}

/** lowest price is known and not older than maxAgeMin */
export function hasLowest(appid, hash, maxAgeMin) {
  const c = cached(appid, hash);
  return !!c && c.lowAt != null && Date.now() - c.lowAt < maxAgeMin * 60000;
}

/**
 * Lowest sell prices via the order book (~3x faster than priceoverview, no volume).
 * Fetches only items without a lowest price younger than maxAgeMin (unless force).
 * onEach(hash, lowest|null, err)
 */
export async function lowestPrices(list, { onEach, isCancelled, force = false, maxAgeMin = 360 } = {}) {
  const seen = new Set();
  const todo = list.filter(({ appid, hash }) => {
    const k = appid + '|' + hash;
    if (!hash || seen.has(k)) return false;
    seen.add(k);
    // (also once for items valued before the listings were kept, the listing advice needs them)
    return force || !hasLowest(appid, hash, maxAgeMin) || !cached(appid, hash)?.ask;
  });
  let done = 0;
  for (const { appid, hash } of todo) {
    if (isCancelled?.()) break;
    try {
      const h = await hist(appid, hash, force ? 0 : 60000);
      onEach?.(hash, h.lowestSell, null, ++done, todo.length);
    } catch (e) {
      // remember items without a market (no order book) so we don't ask again on every load
      if (e.status !== 429) { const k = appid + '|' + hash; const old = cached(appid, hash); cache.set(k, { median: null, volume: null, at: 0, ...old, lowest: old?.lowest ?? null, lowAt: Date.now(), ask: old?.ask ?? [] }); }
      onEach?.(hash, null, e, ++done, todo.length);
      if (e.status === 429) break;
    }
  }
  return todo.length;
}

export function pruneCache(days = 14) {
  const all = cache.all();
  const lim = Date.now() - days * 86400000;
  let n = 0;
  for (const k of Object.keys(all)) if (Math.max(all[k].at || 0, all[k].lowAt || 0) < lim) { delete all[k]; n++; }
  if (n) cache.replace(all);
}

// ---------------------------------------------------------------- order histogram (short memory cache)
const hcache = new Map();
export async function hist(appid, hash, maxAgeMs = 60000) {
  const k = appid + '|' + hash;
  const c = hcache.get(k);
  if (c && Date.now() - c.at < maxAgeMs) return c;
  // the same item requested twice at once (e.g. auto competition check + valuation) → one request
  if (inflight.has(k)) return inflight.get(k);
  const p = (async () => {
    // a copy saved by an earlier page load or another tab, only if it is as fresh as this caller accepts
    const d = await disk.get('ob|' + k, Math.min(maxAgeMs, disk.ttl()));
    if (d) { hcache.set(k, d); return d; }
    return fetchHist(appid, hash, k);
  })().finally(() => inflight.delete(k));
  inflight.set(k, p);
  return p;
}
const inflight = new Map();
async function fetchHist(appid, hash, k) {
  const h = await steam.histogram(appid, hash);
  hcache.set(k, h);
  if (disk.ttl() > 0) disk.put('ob|' + k, h);
  // the order book also tells us the lowest price. Store it with its own timestamp (lowAt);
  // `at` stays the priceoverview time so volume/median are still re-fetched when stale.
  const old = cached(appid, hash);
  // + the cheap end of the listings and the best buy order, for the listing advice on inventory cards (no extra request)
  cache.set(k, { median: null, volume: null, at: 0, ...old, lowest: h.lowestSell ?? old?.lowest ?? null, lowAt: Date.now(), ask: h.sellGraph?.slice(0, 25) || null, bid: h.highestBuy ?? null });
  return h;
}

