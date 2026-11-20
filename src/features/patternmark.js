// The 💎 mark for copies with a known pattern seed (core/patterns.js): one chip and one card frame, used on the
// inventory cards, the listings and the float checker. Your own lines live in the settings (store key 'patternsUser').
import * as store from '../core/store.js';
import { esc } from '../core/util.js';
import { patternOf } from '../core/patterns.js';
import * as patterndb from './patterndb.js';
import { L } from '../core/i18n.js';

export const userPatterns = () => store.get('patternsUser', '') || '';
/** { what, label, level, src, seed } or null */
export const patternFor = (hash, seed) => patternOf(hash, seed, userPatterns(), patterndb.entries());
/** class for the card frame: pat top / high / mid / low / user ('' without a known pattern) */
export const patternClass = (m) => (m ? `pat pat-${m.level}` : '');

export function patternChip(m) {
  if (!m) return '';
  const title = L(`Known pattern, seed ${m.seed}: ${m.what}${m.label ? `, ${m.label}` : ''}. Source: ${m.src}.\nThe lists on pattern sites don't always agree, so look at this copy in game or in the inspect view before pricing it.`, `Znany wzór, seed ${m.seed}: ${m.what}${m.label ? `, ${m.label}` : ''}. Źródło: ${m.src}.\nListy w serwisach nie zawsze się zgadzają: przed wyceną obejrzyj ten egzemplarz w grze albo w podglądzie (inspect).`);
  return `<span class="pchip ${esc(m.level)}" title="${esc(title)}">💎 ${esc(m.what)}${m.label ? ` · ${esc(m.label)}` : ''}</span>`;
}
