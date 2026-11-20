// Picking a market sample for the research export (features/research.js exportMarketSample): what kind of item a
// market name is, its price band, and an even spread over kind × band. Pure, tested in test/analysis.test.js.
export const KINDS = { skin: 'skiny', knife: 'noże i rękawice', container: 'skrzynie, kapsuły, terminale', sticker: 'naklejki', other: 'reszta' };
export const BANDS = [25, 100, 500, 2500, 10000]; // USD cents (Steam's search answers in USD): < 0,25 $, < 1 $, < 5 $, < 25 $, < 100 $, more
const WEARS = /\((Factory New|Minimal Wear|Field-Tested|Well-Worn|Battle-Scarred)\)$/;
export function kindOf(hash = '', type = '') {
  if (hash.startsWith('★')) return 'knife';
  // the type from Steam's search ("Base Grade Container"); without it (a bare name) by the name's ending
  if (/container/i.test(type) || (!type && /\b(Case|Capsule|Terminal|Package)( \d+)?$/.test(hash))) return 'container';
  if (/^Sticker \|/.test(hash)) return 'sticker';
  if (hash.includes(' | ') && WEARS.test(hash)) return 'skin';
  return 'other';
}
export const bandOf = (usd) => BANDS.findIndex((b) => usd < b) === -1 ? BANDS.length : BANDS.findIndex((b) => usd < b);
const rng = (seed) => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
/** pool [{hash, kind, band}] → n of them: an equal share for every kind × price band that has items, the rest at random */
export function stratify(pool, n, seed = 1) {
  const rnd = rng(seed);
  const shuffled = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const cells = new Map();
  for (const x of shuffled(pool)) { const k = x.kind + '|' + x.band; (cells.get(k) || cells.set(k, []).get(k)).push(x); }
  const per = Math.ceil(n / Math.max(1, cells.size));
  const out = [], left = [];
  for (const a of cells.values()) { out.push(...a.slice(0, per)); left.push(...a.slice(per)); }
  if (out.length > n) return shuffled(out).slice(0, n);
  return [...out, ...shuffled(left).slice(0, n - out.length)];
}

