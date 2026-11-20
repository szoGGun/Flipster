// Persistent storage: GM_* (shared across all steamcommunity pages, survives clearing site data),
// falls back to localStorage when GM API is unavailable (e.g. tests).
// Every GM_getValue hands out a deep copy of the whole value, so big values are kept in memory (buckets below)
// instead of being read again and again.
const hasGM = () => typeof GM_getValue === 'function'; // checked on use: tests install a stand-in later

export function get(key, def) {
  try {
    const v = hasGM() ? GM_getValue(key) : JSON.parse(localStorage.getItem('stt_' + key));
    return v === undefined || v === null ? def : v;
  } catch {
    return def;
  }
}

function write(key, val) {
  try {
    if (hasGM()) GM_setValue(key, val);
    else localStorage.setItem('stt_' + key, JSON.stringify(val));
  } catch (e) {
    console.warn('[Flipster] store.set failed', key, e);
  }
}

/** save a value; a bucket kept in memory for that key reads it again (an import, a reset) */
export function set(key, val) {
  write(key, val);
  buckets.get(key)?.drop();
}

export function del(key) {
  try { hasGM() ? GM_deleteValue(key) : localStorage.removeItem('stt_' + key); } catch { /* ignore */ }
  buckets.get(key)?.drop();
}

// Small objects that another open Steam tab may change while this one runs: your settings (an automation switched
// off there must stop here too), planned sales (made in any tab, listed by the tab that runs the automations), price
// rules and marks. They are re-read after a moment, and every change is applied to a fresh copy, so two tabs don't
// overwrite each other's edits.
const SHARED = new Set(['settings', 'sellPlans', 'sellRules', 'buyRules', 'invSellWatch', 'watchlist', 'flipHidden']);
const SHARED_MS = 2000;
// Caches that change all the time and only this tab needs right away (prices, price histories, estimates): written
// at most every few seconds, and when the page is left
const LAZY = { prices: 5000, sellHist: 5000, estPrices: 5000, mktFloats: 5000, caseQ: 5000 };
const lazyFlush = new Set();
if (typeof window !== 'undefined') {
  const flushAll = () => { for (const f of [...lazyFlush]) f(); };
  window.addEventListener('pagehide', flushAll);
  window.addEventListener('beforeunload', flushAll);
}

const buckets = new Map();
/**
 * object stored under one key, with helpers. One instance per key and tab: every module asking for the same key
 * shares it (two copies would undo each other's changes).
 */
export function bucket(key, def = {}) {
  if (buckets.has(key)) return buckets.get(key);
  const shared = SHARED.has(key), lazyMs = LAZY[key] || 0;
  let cache = null, at = 0, timer = 0;
  // (a fresh default each time: the cache object gets filled, it must not become the default)
  const read = () => { cache = get(key, null) ?? structuredClone(def); at = Date.now(); return cache; };
  const load = () => (cache && !(shared && Date.now() - at > SHARED_MS) ? cache : read());
  // a change: shared ones on top of the latest saved copy
  const edit = () => (shared ? read() : load());
  const stop = () => { clearTimeout(timer); timer = 0; lazyFlush.delete(flush); };
  const flush = () => { if (!timer) return; stop(); write(key, cache); };
  const save = () => {
    at = Date.now();
    if (!lazyMs) return write(key, cache);
    if (timer) return;
    lazyFlush.add(flush);
    timer = setTimeout(flush, lazyMs);
  };
  const b = {
    all: () => load(),
    get: (k) => load()[k],
    set(k, v) { edit()[k] = v; save(); },
    patch(k, v) { const c = edit(); c[k] = { ...(c[k] || {}), ...v }; save(); return c[k]; },
    del(k) { const c = edit(); if (!(k in c)) return; delete c[k]; save(); },
    replace(obj) { cache = obj; save(); },
    reload() { flush(); return read(); },
    flush,
    /** the saved value was replaced from outside: forget the copy in memory (and a change not written yet) */
    drop() { stop(); cache = null; },
  };
  buckets.set(key, b);
  return b;
}

export const DEFAULT_SETTINGS = {
  delay: 1500,             // ms between write actions (remove/sell/order)
  undercut: 1,             // cents
  ignoreBelow: 2,          // competition = first price where others hold this many units (skips a lone 1-unit listing / order)
  cacheMin: 5,             // min, market data (order books, price histories, search pages, 24 h volume) reused, also across page loads (0 = off)
  autoComp: true,          // check competition automatically on the listings tab
  listRefreshMin: 2,       // min, the listings tab reloads your listings + competition this often while it's on screen
  invShowListed: true,     // show items listed on the market in the inventory view
  autoRelist: false,
  autoRelistEvery: 10,     // min
  autoBuy: false,
  autoBuyEvery: 10,        // min
  autoBuyLower: false,     // lower our order to 2nd highest + 1 when we're alone at the top
  minVolume: 10,           // scanner: min sales per 24h
  minRoi: 0.03,            // scanner: min ROI
  badges: true,            // price badges in native inventory
  maxWaitDays: 2,          // listings: proposed price = highest that still sells within this many days
  sellSignalPct: 10,       // inventory sell signals threshold (%)
  debug: false,            // show diagnostic tools ("Dane do analizy", market sample, history dump, request counter, build)
  showLog: true,           // show the log (console) at the bottom of the panel
};

export const settings = (() => {
  const b = bucket('settings', {});
  return new Proxy({}, {
    get: (_, k) => b.all()[k] ?? DEFAULT_SETTINGS[k],
    set: (_, k, v) => { b.set(k, v); return true; },
  });
})();
