// The whole market's last half year, the yardstick for one item's move (2026-11-20: the market fell ~29% in 6 months,
// so an item at −31% only went with it). A fixed basket of ~100 popular items (research-items.js: 56 skins, 44 cases
// and capsules, 8 stickers), their price histories once a week in the background (≈ 100 requests, one tab), the median
// 3- and 6-month change, per kind where the basket has enough of it. Stored in 'marketTrend'.
import * as store from '../core/store.js';
import * as steam from '../core/steam.js';
import { recentTrend } from '../core/analysis.js';
import { kindOf } from '../core/sample.js';
import { isLeader } from '../core/jobs.js';
import { RESEARCH_ITEMS } from './research-items.js';
import { L } from '../core/i18n.js';

const KEY = 'marketTrend';
const WEEK = 7 * 86400000;
const KIND_LABEL = { skin: L('skin market', 'rynek skinów'), container: L('case market', 'rynek skrzyń'), sticker: L('sticker market', 'rynek naklejek') };
const med = (a) => { const s = a.filter((x) => x != null).sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : null; };

export const get = () => store.get(KEY, null);

/** the yardstick for this item: the median of its kind when the basket holds ≥ 15 of them, else of all → { t6, t3, n, label, at } */
export function refFor(hash, type = '') {
  const m = get();
  if (!m?.all) return null;
  const k = kindOf(hash, type);
  const own = m.byKind?.[k];
  return own?.n >= 15 && KIND_LABEL[k] ? { ...own, label: KIND_LABEL[k], at: m.at } : { ...m.all, label: L('market', 'rynek'), whole: true, at: m.at };
}

let running = false;
/** refresh when older than a week (only in the tab that runs the background jobs); → true when new numbers came in */
export async function ensure() {
  const m = get();
  if (running || (m && Date.now() - m.at < WEEK) || !isLeader()) return false;
  running = true;
  try {
    const rows = [];
    for (const hash of [...new Set(RESEARCH_ITEMS)]) {
      try {
        const r = recentTrend(await steam.priceHistory(730, hash));
        if (r?.t6 != null) rows.push({ k: kindOf(hash, ''), t6: r.t6, t3: r.t3 });
      } catch (e) {
        if (e.status === 429) break; // what came so far may still be enough
      }
    }
    if (rows.length < 30) return false; // too few to call it the market, next load tries again
    const agg = (a) => ({ t6: med(a.map((x) => x.t6)), t3: med(a.map((x) => x.t3)), n: a.length });
    const byKind = {};
    for (const k of new Set(rows.map((r) => r.k))) byKind[k] = agg(rows.filter((r) => r.k === k));
    store.set(KEY, { at: Date.now(), all: agg(rows), byKind });
    return true;
  } finally {
    running = false;
  }
}
