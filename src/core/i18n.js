// Language: the texts live in src/i18n/en-GB.json and src/i18n/pl-PL.json, grouped by the file that uses them.
// Code asks for them by key, L('buyorders.newOrder'), and values go in by name, L('buyorders.outbid', { price })
// fills {price} in the text. A text can also be split into plural forms, { "one": "…", "few": "…", "many": "…",
// "other": "…" }, picked by params.count with the plural rules of the language.
// The language is picked once per page load: ⚙ Settings (lang 'en' / 'pl'), or by default from the browser
// (Polish browser gives Polish, anything else English). Module-level constants call L() at import time, so changing
// the language needs a page reload; settings.js reloads after the switch.
import { get } from './store.js';
import en from '../i18n/en-GB.json' assert { type: 'json' };
import pl from '../i18n/pl-PL.json' assert { type: 'json' };

const TEXTS = { en, pl };
const LOCALES = { en: 'en-GB', pl: 'pl-PL' };

function detect() {
  const s = get('settings', null)?.lang; // read straight from storage: settings.js may not be loaded yet
  if (s === 'en' || s === 'pl') return s;
  try { return /^pl\b/i.test(navigator.language || '') ? 'pl' : 'en'; } catch { return 'en'; }
}

let lang = null, plural = null;
export const getLang = () => lang || (lang = detect());
/** tests (and nothing else) force a language */
export const setLang = (l) => { lang = l; plural = null; };
/** the language for toLocale*String (dates, numbers) */
export const locale = () => LOCALES[getLang()];

const find = (texts, key) => {
  const dot = key.indexOf('.');
  return texts[key.slice(0, dot)]?.[key.slice(dot + 1)];
};

/** the text under `key` in the current language (English if missing), with {name} filled from params */
export const L = (key, params) => {
  let s = find(TEXTS[getLang()], key) ?? find(en, key) ?? key;
  if (typeof s === 'object') s = s[(plural ||= new Intl.PluralRules(locale())).select(params?.count ?? 0)] ?? s.other;
  return params ? s.replace(/\{(\w+)\}/g, (m, name) => (name in params ? params[name] : m)) : s;
};

/** a number with a fixed count of decimals and the decimal mark of the current language (1.5 / 1,5) */
export const dec = (x, digits) => (getLang() === 'pl' ? x.toFixed(digits).replace('.', ',') : x.toFixed(digits));
