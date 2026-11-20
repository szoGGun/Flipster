// Exact case contents + float ranges from the public ByMykel/CSGO-API dataset (built from the game files):
// which skins are in each case (incl. the knife/glove pool) and each skin's min/max float.
// Downloaded once a week via GM_xmlhttpRequest and stored in a compact form.
import * as store from '../core/store.js';
import { L } from '../core/i18n.js';

const BASE = 'https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/';
const KEY = 'caseDB';
const WEEK = 7 * 86400000;
const RARITY_TIER = { rarity_rare_weapon: 'mil', rarity_mythical_weapon: 'res', rarity_legendary_weapon: 'cla', rarity_ancient_weapon: 'cov' };

function getJSON(url) {
  return new Promise((resolve, reject) => {
    if (typeof GM_xmlhttpRequest !== 'function') return reject(new Error(L('casedb.gmXmlhttprequestUnavailable')));
    GM_xmlhttpRequest({
      method: 'GET', url, timeout: 90000,
      onload: (r) => { if (r.status >= 400) return reject(new Error(`HTTP ${r.status}`)); try { resolve(JSON.parse(r.responseText)); } catch { reject(new Error(L('casedb.badResponse'))); } },
      onerror: () => reject(new Error(L('casedb.networkErrorAddConnectRaw'))),
      ontimeout: () => reject(new Error('timeout')),
    });
  });
}

let mem = null;
/** { cases: { [market hash]: { items: [[name, tier]], rare: [name] } }, caps: { [market hash]: { kind, items } }, floats: { [name]: [min, max] }, at } */
export async function load() {
  if (mem && mem.v === 3 && Date.now() - mem.at < WEEK) return mem;
  const saved = store.get(KEY, null);
  if (saved && saved.v === 3 && Date.now() - saved.at < WEEK) return (mem = saved);
  try {
    const [crates, skins] = await Promise.all([getJSON(BASE + 'crates.json'), getJSON(BASE + 'skins.json')]);
    const cases = {};
    // capsules: { kind: 'Sticker' | 'Patch', items: [[name, tier]] }, tiers mil/res/cla/cov = High Grade / Remarkable / Exotic / Extraordinary
    const caps = {};
    const CAP_TIER = { rarity_rare: 'mil', rarity_mythical: 'res', rarity_legendary: 'cla', rarity_ancient: 'cov' };
    for (const c of crates) {
      if (!/^(Sticker|Autograph|Patch) Capsule$/.test(c.type || '') || !c.market_hash_name) continue;
      const items = (c.contains || []).map((i) => [i.name, CAP_TIER[i.rarity?.id]]).filter((x) => x[0] && x[1]);
      if (items.length) caps[c.market_hash_name] = { kind: c.type === 'Patch Capsule' ? 'Patch' : 'Sticker', items };
    }
    const need = new Set();
    for (const c of crates) {
      if (c.type !== 'Case' || !c.market_hash_name) continue;
      const items = (c.contains || []).map((i) => [i.name, RARITY_TIER[i.rarity?.id]]).filter((x) => x[1]);
      const rare = [...new Set((c.contains_rare || []).map((i) => i.name))];
      cases[c.market_hash_name] = { items, rare };
      items.forEach((x) => need.add(x[0]));
      rare.forEach((n) => need.add(n));
    }
    const floats = {};
    // every skin's float range (cases use theirs; the float checker needs the rest too)
    for (const s of skins) if (s.name && s.min_float != null) floats[s.name] = [s.min_float, s.max_float];
    mem = { v: 3, at: Date.now(), cases, caps, floats };
    store.set(KEY, mem);
    return mem;
  } catch (e) {
    if (saved) return (mem = saved); // old data is still good
    throw new Error(L('casedb.caseContentsData') + e.message);
  }
}

// Valve's wear model: a value f is drawn so that the wear tiers come out FN 3%, MW 24%, FT 33%, WW 24%, BS 16%
// (uniform inside each tier), then scaled into the skin's float range: float = min + f·(max − min).
const TIERS = [['Factory New', 0, 0.07, 0.03], ['Minimal Wear', 0.07, 0.15, 0.24], ['Field-Tested', 0.15, 0.38, 0.33], ['Well-Worn', 0.38, 0.45, 0.24], ['Battle-Scarred', 0.45, 1, 0.16]];
function cdf(x) {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  let acc = 0;
  for (const [, a, b, p] of TIERS) {
    if (x >= b) { acc += p; continue; }
    return acc + (p * (x - a)) / (b - a);
  }
  return 1;
}
/** probability of each wear for a skin with float range [min, max] */
/** float range [min, max] of a skin by its market name ("StatTrak™ AK-47 | Redline (Field-Tested)"), null if unknown */
export function floatRange(db, hash = '') {
  const base = hash.replace(/^(★\s*)?(StatTrak™\s*|Souvenir\s*)?/, (m, star) => star || '').replace(/\s*\((Factory New|Minimal Wear|Field-Tested|Well-Worn|Battle-Scarred)\)\s*$/, '').trim();
  return db?.floats?.[base] || db?.floats?.[base.replace(/^★\s*/, '')] || db?.floats?.['★ ' + base.replace(/^★\s*/, '')] || null;
}

export function wearProbs([min, max] = [0, 1]) {
  const out = {};
  const span = max - min || 1e-9;
  for (const [name, a, b] of TIERS) {
    const p = cdf((Math.min(b, max) - min) / span) - cdf((Math.max(a, min) - min) / span);
    if (p > 1e-6 && b > min && a < max) out[name] = p;
  }
  return out;
}
