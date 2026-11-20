// Short-lived cache of read-only market data: order books, price histories, market search pages.
// Kept in IndexedDB, so it survives page reloads and is shared by every steamcommunity.com tab, with a memory layer
// in front. Only public market data belongs here, never your own listings, buy orders, inventory or balance:
// acting on a stale copy of those would relist or buy at the wrong price.
import { settings } from './store.js';

const DB = 'flipster-cache', STORE = 'kv';
const MAX_MIN = 60; // nothing here is worth keeping longer
const mem = new Map(); // key -> { at, v }
const inflight = new Map(); // key -> promise of a running fetch (the same thing asked twice at once = one request)

/** how long market data may be reused, from Ustawienia → Zaawansowane (0 = off) */
export const ttl = () => Math.max(0, Math.min(MAX_MIN, +settings.cacheMin || 0)) * 60000;

let dbp = null;
function open() {
  return (dbp ||= new Promise((resolve) => {
    try {
      if (typeof indexedDB === 'undefined') return resolve(null);
      const rq = indexedDB.open(DB, 1);
      rq.onupgradeneeded = () => rq.result.createObjectStore(STORE);
      rq.onsuccess = () => { const d = rq.result; d.onversionchange = () => d.close(); prune(d); resolve(d); };
      rq.onerror = rq.onblocked = () => resolve(null);
    } catch { resolve(null); } // private mode, blocked storage: the memory layer still works
  }));
}
const tx = (d, mode, fn) => new Promise((resolve) => {
  try {
    const t = d.transaction(STORE, mode);
    const rq = fn(t.objectStore(STORE));
    t.oncomplete = () => resolve(rq?.result);
    t.onerror = t.onabort = () => resolve(undefined);
  } catch { resolve(undefined); }
});
// entries older than the longest possible lifetime are deleted when the database is first opened on a page
function prune(d) {
  try {
    const lim = Date.now() - MAX_MIN * 60000;
    const rq = d.transaction(STORE, 'readwrite').objectStore(STORE).openCursor();
    rq.onsuccess = () => { const c = rq.result; if (!c) return; if (!(c.value?.at > lim)) c.delete(); c.continue(); };
  } catch { /* optional */ }
}

/** value saved under `key` if it is younger than maxAgeMs, else undefined */
export async function get(key, maxAgeMs) {
  if (!(maxAgeMs > 0)) return undefined;
  const fresh = (e) => (e && Date.now() - e.at < maxAgeMs ? e : null);
  let e = fresh(mem.get(key));
  if (!e) {
    const d = await open();
    e = fresh(d ? await tx(d, 'readonly', (s) => s.get(key)) : null);
    if (e) mem.set(key, e);
  }
  return e ? e.v : undefined;
}

const MEM_MAX = 300; // a scan without a limit walks thousands of items, the tab keeps only the newest in memory
let puts = 0;
export function put(key, v) {
  const e = { at: Date.now(), v };
  mem.delete(key);
  mem.set(key, e);
  while (mem.size > MEM_MAX) mem.delete(mem.keys().next().value);
  open().then((d) => {
    if (!d) return;
    tx(d, 'readwrite', (s) => s.put(e, key));
    if (++puts % 500 === 0) prune(d); // and the database is swept during a long scan, not only on page load
  });
}

/** a market search answer cut down to the fields the script reads (the full one is ~150 KB per page) */
export const slimSearch = (d) => (d && Array.isArray(d.results) ? {
  total_count: d.total_count,
  results: d.results.map((r) => ({
    name: r.name, hash_name: r.hash_name, sell_listings: r.sell_listings, sell_price: r.sell_price, sell_price_text: r.sell_price_text,
    asset_description: { icon_url: r.asset_description?.icon_url, name_color: r.asset_description?.name_color, type: r.asset_description?.type },
  })),
} : d);

/**
 * The cached value if it is younger than maxAgeMs, else fetch(), and remember the result when keep(result) says so
 * (e.g. not the empty page Steam hands out under load). maxAgeMs 0 always fetches, but still saves for later.
 */
export async function cached(key, maxAgeMs, fetch, keep = (v) => v != null) {
  const hit = await get(key, maxAgeMs);
  if (hit !== undefined) return hit;
  if (inflight.has(key)) return inflight.get(key);
  const p = (async () => {
    const v = await fetch();
    if (ttl() > 0 && keep(v)) put(key, v);
    return v;
  })().finally(() => inflight.delete(key));
  inflight.set(key, p);
  return p;
}

export async function clear() {
  mem.clear();
  const d = await open();
  if (d) await tx(d, 'readwrite', (s) => s.clear());
}
