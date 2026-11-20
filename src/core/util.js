export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** an item's name as Flipster shows it: the English market name (market_hash_name); Steam community items
 * ("63380-Lenin", a trading card) keep their own name */
export const displayName = (hash, name) => (!hash || /^\d+-/.test(hash) ? name || hash || '' : hash);

export const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

/** "1 234,56 zł" / "$1,234.56" / "2,--€" -> cents (NaN if no digits) */
export function parsePrice(s) {
  if (s == null) return NaN;
  if (typeof s === 'number') return Math.round(s * 100);
  s = String(s).replace(/[^\d.,]/g, '');
  if (!/\d/.test(s)) return NaN;
  const di = Math.max(s.lastIndexOf(','), s.lastIndexOf('.'));
  let intPart = s;
  let dec = '';
  if (di >= 0 && s.length - di - 1 <= 2) {
    intPart = s.slice(0, di);
    dec = s.slice(di + 1);
  }
  intPart = intPart.replace(/[.,]/g, '');
  dec = (dec + '00').slice(0, 2);
  return parseInt(intPart || '0', 10) * 100 + parseInt(dec, 10);
}

/** cents -> "12,34" for inputs */
export const toInput = (c) => (c == null || isNaN(c) ? '' : (c / 100).toFixed(2).replace('.', ','));

export const pct = (x, digits = 1) => (x == null || !isFinite(x) ? '-' : (x * 100).toFixed(digits).replace('.', ',') + '%');

export function median(arr) {
  if (!arr.length) return null;
  const s = [...arr].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

export const icon = (hash, size = '96fx96f') =>
  hash ? `https://community.cloudflare.steamstatic.com/economy/image/${hash}/${size}` : '';

export function timeAgo(ts) {
  if (!ts) return '-';
  const s = Math.round((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s temu`;
  if (s < 3600) return `${Math.round(s / 60)} min temu`;
  if (s < 86400) return `${Math.round(s / 3600)} h temu`;
  return `${Math.round(s / 86400)} d temu`;
}

export function downloadText(filename, text, mime = 'text/plain;charset=utf-8') {
  const blob = new Blob(['﻿' + text], { type: mime });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
}


/** tiny event emitter */
export function emitter() {
  const m = new Map();
  return {
    on(ev, fn) { (m.get(ev) || m.set(ev, new Set()).get(ev)).add(fn); return () => m.get(ev).delete(fn); },
    emit(ev, ...a) { m.get(ev)?.forEach((fn) => { try { fn(...a); } catch (e) { console.error(e); } }); },
  };
}

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
/** Steam's trade lock text "Tradable/Marketable After Nov 19, 2026 (8:00:00) GMT" → timestamp (null if it has no date) */
export function lockUntil(lock = '', now = Date.now()) {
  const s = String(lock);
  // classic: "Tradable/Marketable After Nov 19, 2026 (8:00:00) GMT"
  const m = s.match(/after\s+([A-Za-z]{3})[a-z]*\s+(\d{1,2}),?\s+(\d{4})(?:\s*\((\d{1,2}):(\d{2})(?::(\d{2}))?\))?/i);
  if (m) {
    const mon = MONTHS.indexOf(m[1].toLowerCase());
    return mon < 0 ? null : Date.UTC(+m[3], mon, +m[2], +(m[4] || 0), +(m[5] || 0), +(m[6] || 0));
  }
  // newer (trade protection): "Tradable/Marketable After 24 Nov @ 9:00pm", "… After Nov 24 @ 9:00pm" or "This item is
  // trade-protected and cannot be consumed, modified, or transferred until 20 Nov @ 12:00am", local time, no year:
  // the next such date (a lock ends within days, so a date months back means next year)
  const n = s.match(/(?:after|until)\s+(?:(\d{1,2})\s+([A-Za-z]{3})[a-z]*|([A-Za-z]{3})[a-z]*\s+(\d{1,2}))(?:\s*@\s*(\d{1,2})(?::(\d{2}))?\s*([ap]m)?)?/i);
  if (!n) return null;
  const mon = MONTHS.indexOf((n[2] || n[3]).toLowerCase());
  if (mon < 0) return null;
  let h = +(n[5] || 0);
  if (n[7]) h = (h % 12) + (/pm/i.test(n[7]) ? 12 : 0);
  const at = (y) => new Date(y, mon, +(n[1] || n[4]), h, +(n[6] || 0)).getTime();
  const y = new Date(now).getFullYear();
  return at(y) < now - 60 * 86400000 ? at(y + 1) : at(y);
}

/** search text normalised: lower case, no Polish diacritics, no "|", "™", "★", brackets or punctuation */
export const normSearch = (s = '') => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ł/g, 'l')
  .replace(/[|™★()[\]„”"'.,:;!?_]/g, ' ').replace(/-/g, ' ').replace(/\s+/g, ' ').trim();
/** every word of the query appears in the text: "ak-47 blue laminate" finds "AK-47 | Blue Laminate (Field-Tested)" */
export function matchSearch(text, query) {
  const q = normSearch(query);
  if (!q) return true;
  const t = normSearch(text);
  const tight = t.replace(/ /g, ''); // "ak47" / "m4a1s" without the dash
  return q.split(' ').every((w) => t.includes(w) || tight.includes(w));
}
