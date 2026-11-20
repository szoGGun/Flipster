// Persistent storage: GM_* (shared across all steamcommunity pages, survives clearing site data),
// falls back to localStorage when GM API is unavailable (e.g. tests).
const hasGM = typeof GM_getValue === 'function';

export function get(key, def) {
  try {
    const v = hasGM ? GM_getValue(key) : JSON.parse(localStorage.getItem('stt_' + key));
    return v === undefined || v === null ? def : v;
  } catch {
    return def;
  }
}

export function set(key, val) {
  try {
    if (hasGM) GM_setValue(key, val);
    else localStorage.setItem('stt_' + key, JSON.stringify(val));
  } catch (e) {
    console.warn('[Flipster] store.set failed', key, e);
  }
}

export function del(key) {
  try { hasGM ? GM_deleteValue(key) : localStorage.removeItem('stt_' + key); } catch { /* ignore */ }
}

/** object stored under one key, with helpers */
export function bucket(key, def = {}) {
  let cache = null;
  const load = () => (cache ??= get(key, def));
  return {
    all: () => load(),
    get: (k) => load()[k],
    set(k, v) { load()[k] = v; set(key, cache); },
    patch(k, v) { load()[k] = { ...(cache[k] || {}), ...v }; set(key, cache); return cache[k]; },
    del(k) { delete load()[k]; set(key, cache); },
    replace(obj) { cache = obj; set(key, cache); },
    reload() { cache = null; return load(); },
  };
}

export const DEFAULT_SETTINGS = {
  delay: 1500,             // ms between write actions (remove/sell/order)
  undercut: 1,             // cents
  ignoreBelow: 2,          // competition = first price where others hold this many units (skips a lone 1-unit listing / order)
  cacheMin: 5,             // min, market data (order books, price histories, search pages, 24 h volume) reused, also across page loads (0 = off)
  autoComp: true,          // check competition automatically on the listings tab
  invShowListed: true,     // show items listed on the market in the inventory view
  autoRelist: false,
  autoRelistEvery: 10,     // min
  autoRelistRaise: true,   // raise price when we're far below next competitor
  autoBuy: false,
  autoBuyEvery: 10,        // min
  autoBuyLower: false,     // lower our order to 2nd highest + 1 when we're alone at the top
  minVolume: 10,           // scanner: min sales per 24h
  minRoi: 0.03,            // scanner: min ROI
  badges: true,            // price badges in native inventory
  maxWaitDays: 2,          // listings: proposed price = highest that still sells within this many days
  sellSignalPct: 10,       // inventory sell signals threshold (%)
};

export const settings = (() => {
  const b = bucket('settings', {});
  return new Proxy({}, {
    get: (_, k) => b.all()[k] ?? DEFAULT_SETTINGS[k],
    set: (_, k, v) => { b.set(k, v); return true; },
  });
})();
