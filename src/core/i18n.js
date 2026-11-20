// Language: every text the user sees is written in both languages next to each other, L('English', 'Polski').
// The language is picked once per page load: ⚙ Settings (lang 'en' / 'pl'), or by default from the browser
// (Polish browser gives Polish, anything else English). Module-level constants call L() at import time, so changing
// the language needs a page reload; settings.js reloads after the switch.
import { get } from './store.js';

function detect() {
  const s = get('settings', null)?.lang; // read straight from storage: settings.js may not be loaded yet
  if (s === 'en' || s === 'pl') return s;
  try { return /^pl\b/i.test(navigator.language || '') ? 'pl' : 'en'; } catch { return 'en'; }
}

let lang = null;
export const getLang = () => lang || (lang = detect());
/** tests (and nothing else) force a language */
export const setLang = (l) => { lang = l; };
/** the text in the current language */
export const L = (en, pl) => (getLang() === 'pl' ? pl : en);
/** the language for toLocale*String (dates, numbers) */
export const locale = () => (getLang() === 'pl' ? 'pl-PL' : 'en-GB');
