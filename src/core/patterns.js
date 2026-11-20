import { L } from './i18n.js';
// Pattern-priced skins: for a few finishes the community pays extra for certain paint seeds (Case Hardened "blue
// gems", Marble Fade "Fire & Ice"...). Pure logic, no DOM: a starter list from public guides plus the user's own lines
// from the settings. The guides disagree on tiers now and then, so a match means "worth a closer look", not a price.
// Starter list checked 2026-11-20:
//  - Case Hardened (AK-47, Five-SeveN, Karambit): csdb.gg/all-cs2-rare-skin-patterns-full-list
//  - Karambit Marble Fade Fire & Ice: csgoskins.gg/blog/karambit-marble-fade-fire-and-ice-seed-patterns
//    (the seed → look mapping differs per knife model, so these seeds are for the Karambit only)
//  - Five-SeveN Kami picture patterns: skinscanner.gg/blog/five-seven-kami-pattern-guide (tiers), #909 confirmed by
//    cyberquira.com/news/five-seven-kami-pussy-pattern-skin-guide (590 and 662 as the same motif)
// level → colour on the cards: top (gold), high (violet), mid (blue), low (grey), user (green, your own list)

export const STARTER = [
  {
    skin: 'AK-47 | Case Hardened', what: 'Blue gem', src: 'csdb.gg',
    tiers: [
      { label: L('patterns.661ScarTheBest'), level: 'top', seeds: [661] },
      { label: 'Tier 1', level: 'high', seeds: [387, 321, 670, 955, 168] },
    ],
  },
  {
    skin: 'Five-SeveN | Case Hardened', what: 'Blue gem', src: 'csdb.gg',
    tiers: [
      { label: L('patterns.top'), level: 'top', seeds: [278, 690, 648] },
      { label: 'Tier 1', level: 'high', seeds: [872, 363] },
    ],
  },
  {
    // picture patterns: at some seeds the Kami artwork lands as a recognisable shape (the famous one is #909)
    skin: 'Five-SeveN | Kami', what: 'Kami', src: 'skinscanner.gg, cyberquira.com',
    tiers: [
      { label: L('patterns.909PSyTheBest'), level: 'top', seeds: [909] },
      { label: L('patterns.tier1SameMotif'), level: 'high', seeds: [590, 662] },
      { label: L('patterns.togepi'), level: 'mid', seeds: [906] },
      { label: L('patterns.owlEyes'), level: 'mid', seeds: [403] },
      { label: L('patterns.angryMerchant'), level: 'mid', seeds: [376] },
      { label: L('patterns.happyBird'), level: 'mid', seeds: [537] },
      { label: L('patterns.booba'), level: 'mid', seeds: [887] },
      { label: L('patterns.sleeperMushroom'), level: 'mid', seeds: [439] },
      { label: L('patterns.memeNumber'), level: 'low', seeds: [69, 420] },
      { label: L('patterns.robot'), level: 'low', seeds: [264, 702] },
    ],
  },
  {
    skin: 'Karambit | Case Hardened', what: 'Blue gem', src: 'csdb.gg',
    tiers: [
      { label: L('patterns.top'), level: 'top', seeds: [387, 442, 670, 463] },
      { label: 'Tier 1', level: 'high', seeds: [269] },
    ],
  },
  {
    skin: 'Karambit | Marble Fade', what: 'Fire & Ice', src: 'csgoskins.gg',
    tiers: [
      { label: '#1 (max)', level: 'top', seeds: [412] },
      { label: '#2', level: 'top', seeds: [16, 146, 241, 359, 393, 541, 602, 649, 688, 701] },
      { label: '#3', level: 'high', seeds: [152, 281, 292, 344, 628, 673, 743, 777, 792, 994] },
      { label: '#4', level: 'high', seeds: [48, 126, 129, 332, 780, 787, 874, 908, 918, 923] },
      { label: '#5', level: 'high', seeds: [182, 204, 252, 457, 522, 578, 652, 660, 685, 705, 736, 832, 988] },
      { label: '#6', level: 'high', seeds: [112, 230, 340, 356, 444, 452, 471, 607, 621, 631, 761, 773, 873, 876, 982] },
      { label: '#7', level: 'mid', seeds: [8, 14, 32, 58, 108, 213, 233, 243, 274, 405, 454, 614, 653, 683, 728, 732, 770, 795, 803, 826, 867, 949] },
      { label: '#8', level: 'mid', seeds: [5, 178, 188, 202, 337, 378, 406, 461, 539, 696, 702, 854, 966, 971] },
      { label: '#9', level: 'mid', seeds: [68, 121, 149, 165, 171, 206, 287, 370, 493, 499, 516, 637, 655, 656, 672, 706, 766, 817, 922, 959, 997] },
      { label: '#10', level: 'mid', seeds: [28, 156, 177, 238, 402, 545, 546, 553, 559, 589, 591, 725, 764, 791, 810, 844, 858, 868, 972, 977] },
      { label: L('patterns.fakeT1SomeYellow'), level: 'low', seeds: [9, 27, 90, 110, 125, 183, 195, 203, 232, 254, 329, 351, 372, 397, 404, 441, 448, 459, 473, 483, 537, 561, 590, 626, 632, 647, 710, 727, 753, 756, 785, 805, 809, 818, 869, 909, 930, 941, 962, 976, 980, 989] },
      { label: L('patterns.fakeT2SomeYellow'), level: 'low', seeds: [60, 62, 71, 98, 148, 170, 196, 216, 222, 234, 266, 304, 307, 309, 315, 321, 328, 333, 364, 368, 400, 411, 413, 415, 438, 445, 463, 485, 489, 496, 506, 535, 570, 582, 593, 605, 630, 663, 667, 670, 674, 691, 717, 723, 746, 794, 822, 845, 846, 931, 948, 958] },
    ],
  },
];

const WEARS = /\s*\((Factory New|Minimal Wear|Field-Tested|Well-Worn|Battle-Scarred)\)\s*$/;
/** "★ StatTrak™ Karambit | Case Hardened (Field-Tested)" → "karambit | case hardened": the seed means the same pattern
 * in every wear and with or without StatTrak / Souvenir */
export function baseName(hash = '') {
  return String(hash).trim().replace(/^★\s*/, '').replace(/^(StatTrak™|Souvenir)\s+/i, '').replace(WEARS, '').trim().toLowerCase();
}

/**
 * Your own lines from the settings, one per skin: "AK-47 | Case Hardened: 661, 670, 100-110 = mój blue gem".
 * The label after "=" is optional; StatTrak™, ★ and the wear don't matter; empty lines and lines starting with #
 * are skipped. Seeds are 0-1000. → { entries (STARTER shape), errors: [line numbers that couldn't be read] }
 */
export function parseUser(text = '') {
  const entries = [], errors = [];
  String(text || '').split(/\r?\n/).forEach((raw, i) => {
    const line = raw.trim();
    if (!line || line.startsWith('#')) return;
    const m = line.match(/^(.+?)\s*:\s*([\d\s,;-]+?)\s*(?:=\s*(.*))?$/);
    const seeds = [];
    let bad = !m;
    for (const part of m ? m[2].split(/[\s,;]+/).filter(Boolean) : []) {
      const r = part.match(/^(\d+)(?:-(\d+))?$/);
      const a = r ? +r[1] : NaN, b = r?.[2] != null ? +r[2] : a;
      if (!r || b < a || b > 1000) { bad = true; break; }
      for (let s = a; s <= b; s++) seeds.push(s);
    }
    if (bad || !seeds.length) { errors.push(i + 1); return; }
    entries.push({ skin: m[1].trim(), what: (m[3] || '').trim() || L('patterns.yourPattern'), src: L('patterns.yourList'), tiers: [{ label: '', level: 'user', seeds }] });
  });
  return { entries, errors };
}

// ---------------------------------------------------------------- the community catalog (cs2pattern)
// github.com/Helyux/cs2pattern keeps pattern.json: { finish: { weapon: [{ name, ordered, pattern: [seeds] }] } }, e.g.
// "case hardened" → "ak-47" → gem_blue (ordered, best first), "kami" → "five-seven" → pussy. 27 finishes, ~420 seeds
// (2026-11-20). Flipster downloads it (features/patterndb.js); this turns it into the STARTER shape.
const GROUP_LABEL = {
  gem_blue: 'Blue gem', gem_gold: 'Gold gem', gem_black: 'Black gem', gem_white: 'White gem', gem_green: 'Green gem',
  gem_red: 'Red gem', gem_purple: 'Purple gem', gem_pink: 'Pink gem', gem_orange: 'Orange gem', gem_diamond: 'Diamond gem',
  blaze: 'Blaze', fade: 'Fade', fire_and_ice: 'Fire & Ice', white_scope: L('patterns.whiteScope'), blue_hive: L('patterns.blueHive'),
  orange_hive: L('patterns.orangeHive'), star: L('patterns.star'), pussy: 'P**sy', golden_cat: L('patterns.goldenCat'), stoner_cat: 'Stoner cat', phoenix: L('patterns.phoenix'),
};
const groupLabel = (n = '') => GROUP_LABEL[n] || n.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase());
/** cs2pattern's pattern.json → entries; ranked groups: #1 gold, the best ~30% violet, the rest blue; unranked violet */
export function fromCatalog(json) {
  const out = [];
  if (!json || typeof json !== 'object') return out;
  for (const [finish, weapons] of Object.entries(json)) {
    for (const [weapon, groups] of Object.entries(weapons || {})) {
      for (const g of Array.isArray(groups) ? groups : []) {
        const seeds = (g.pattern || []).map(Number).filter((s) => Number.isInteger(s) && s >= 0 && s <= 1000);
        if (!seeds.length) continue;
        const tiers = g.ordered
          ? seeds.map((s, i) => ({ label: `#${i + 1} z ${seeds.length}`, level: i === 0 ? 'top' : i < Math.ceil(seeds.length * 0.3) ? 'high' : 'mid', seeds: [s] }))
          : [{ label: '', level: 'high', seeds }];
        out.push({ skin: `${weapon} | ${finish}`, what: groupLabel(g.name), src: 'cs2pattern (github.com/Helyux/cs2pattern)', tiers });
      }
    }
  }
  return out;
}

/** base name → seed → match; your own lines first (they win over the starter list on the same seed) */
function buildIndex(entries) {
  const idx = new Map();
  for (const e of entries) {
    const base = baseName(e.skin);
    const m = idx.get(base) || idx.set(base, new Map()).get(base);
    for (const t of e.tiers) for (const seed of t.seeds) if (!m.has(seed)) m.set(seed, { what: e.what, label: t.label, level: t.level, src: e.src, seed });
  }
  return idx;
}
let cache = { text: null, extra: null, idx: null };

/**
 * the known pattern of this copy: { what, label, level, src, seed } or null. userText: your lines from the settings
 * (they win), then the STARTER list, then extra (fromCatalog of the downloaded community catalog).
 */
export function patternOf(hash, seed, userText = '', extra = null) {
  if (seed == null || !hash) return null;
  if (cache.text !== userText || cache.extra !== extra) cache = { text: userText, extra, idx: buildIndex([...parseUser(userText).entries, ...STARTER, ...(extra || [])]) };
  return cache.idx.get(baseName(hash))?.get(+seed) || null;
}

/** the starter list in a few words, for the settings ("AK-47 | Case Hardened (Blue gem, 6 seedów)") */
export const starterSummary = () => STARTER.map((e) => `${e.skin} (${e.what}, ${e.tiers.reduce((s, t) => s + t.seeds.length, 0)} ${L('patterns.seeds')})`);
