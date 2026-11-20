// The community catalog of rare pattern seeds: pattern.json from github.com/Helyux/cs2pattern (GPL-3.0, maintained,
// 27 finishes, ~420 seeds on 2026-11-20). Downloaded once a week like the case contents (casedb.js) and kept in
// storage, nothing of it is bundled; core/patterns.js (fromCatalog) turns it into the 💎 marks.
import * as store from '../core/store.js';
import { fromCatalog } from '../core/patterns.js';

const SRC = 'https://raw.githubusercontent.com/Helyux/cs2pattern/master/cs2pattern/pattern.json';
const KEY = 'patternDB';
const WEEK = 7 * 86400000;

function getJSON(url) {
  return new Promise((resolve, reject) => {
    if (typeof GM_xmlhttpRequest !== 'function') return reject(new Error('GM_xmlhttpRequest niedostępne'));
    GM_xmlhttpRequest({
      method: 'GET', url, timeout: 60000,
      onload: (r) => { if (r.status >= 400) return reject(new Error(`HTTP ${r.status}`)); try { resolve(JSON.parse(r.responseText)); } catch { reject(new Error('zła odpowiedź')); } },
      onerror: () => reject(new Error('błąd sieci')),
      ontimeout: () => reject(new Error('timeout')),
    });
  });
}

let mem = null; // { at, entries }
/** the catalog as patternOf entries, the same array until it's downloaded again (null before the first download) */
export function entries() {
  if (!mem) {
    const saved = store.get(KEY, null);
    if (saved?.json) mem = { at: saved.at || 0, entries: fromCatalog(saved.json) };
  }
  return mem?.entries || null;
}

/** for the settings: { at, seeds, skins } or null */
export function info() {
  const e = entries();
  if (!e) return null;
  return { at: mem.at, seeds: e.reduce((s, x) => s + x.tiers.reduce((a, t) => a + t.seeds.length, 0), 0), skins: new Set(e.map((x) => x.skin)).size };
}

let loading = null;
let lastError = '';
export const error = () => lastError;
/** download when missing or older than a week (force: now); → true when new data came in */
export function load({ force = false } = {}) {
  entries();
  if (!force && mem && Date.now() - mem.at < WEEK) return Promise.resolve(false);
  if (loading) return loading;
  loading = getJSON(SRC)
    .then((json) => {
      const e = fromCatalog(json);
      if (!e.length) throw new Error('pusta baza');
      const at = Date.now();
      store.set(KEY, { at, json });
      mem = { at, entries: e };
      lastError = '';
      return true;
    })
    .catch((err) => { lastError = err.message; return false; }) // the old copy (if any) keeps working
    .finally(() => { loading = null; });
  return loading;
}
