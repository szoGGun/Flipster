// Steam "Inventory history" (trades, market, unboxings, trade-ups, drops…), what happened to each item.
// Source: /profiles/<me>/inventoryhistory/?ajax=1 (the same JSON+HTML Steam's own page loads when scrolling).
import * as steam from '../core/steam.js';
import * as store from '../core/store.js';
import * as ui from '../core/ui.js';
import { L } from '../core/i18n.js';

// One history per game, each in its own store: CS2 (730, used everywhere) and, since 2026-11-20, every other game you
// traded on the market (753 = Steam's own items: cards, backgrounds, emoticons; 252490 = Rust…), used only for where an
// item came from (history.itemOrigins, the sources of sales). Kept apart so nothing that assumes CS2 events gets them.
const keyOf = (app) => (+app === 730 ? 'invhist' : `invhist${+app}`); // { events: [...], syncedAt, tail, complete }
const MAX = 30000;

// GM_getValue deep-copies the whole (large) object on every call → keep one copy in memory per history, refreshed
// on save and at most every 30 s (another browser tab may have synced meanwhile)
const mems = new Map(); // app → { v, at }
const data = (app = 730) => {
  let m = mems.get(app);
  if (!m || Date.now() - m.at > 30000) {
    let v = store.get(keyOf(app), { events: [] });
    if (v.fmt) { v = { ...v, events: (v.events || []).filter((e) => !/#\d+$/.test(e.id)) }; delete v.fmt; store.set(keyOf(app), v); }
    m = { v, at: Date.now() };
    mems.set(app, m);
  }
  return m.v;
};
const kinded = new Map();
const eventsOf = (app) => {
  const ev = data(app).events || [];
  if (kinded.get(app) !== ev) { for (const e of ev) { e.kind = kind(e.desc); e.app = +app; } kinded.set(app, ev); }
  return ev;
};
/** the CS2 inventory history, newest first */
export const all = () => eventsOf(730);
/** Steam's own items (753): card drops, booster packs, badge crafting, newest first; only for item origins */
export const allSteam = () => eventsOf(753);
/** the other games' histories together (only events not already in the CS2 one, should Steam ever ignore the filter) */
export function allOf(apps = []) {
  const cs = new Set(all().map((e) => e.id));
  return apps.filter((a) => +a !== 730).flatMap((a) => eventsOf(+a)).filter((e) => !cs.has(e.id));
}
export const syncedAt = (app = 730) => data(app).syncedAt || 0;

const MONTHS = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
/** "13 Nov, 2026" + "3:41pm" → ms (local time) */
export function parseDate(dateTxt = '', timeTxt = '') {
  const m = dateTxt.match(/(\d{1,2})\s+([A-Za-z]{3})[a-z]*,?\s+(\d{4})/) || dateTxt.match(/([A-Za-z]{3})[a-z]*\s+(\d{1,2}),?\s+(\d{4})/);
  if (!m) return Date.parse(`${dateTxt} ${timeTxt}`) || 0;
  const [d, mon, y] = /^\d/.test(m[1]) ? [m[1], m[2], m[3]] : [m[2], m[1], m[3]];
  let h = 0, min = 0;
  const t = timeTxt.match(/(\d{1,2}):(\d{2})\s*(am|pm)?/i);
  if (t) {
    h = +t[1] % 12 + (t[3]?.toLowerCase() === 'pm' ? 12 : 0);
    if (!t[3]) h = +t[1];
    min = +t[2];
  }
  return new Date(+y, MONTHS[mon.toLowerCase()] ?? 0, +d, h, min).getTime();
}

/** event category from Steam's (English) description */
export function kind(desc = '') {
  // a sticker / patch put on (or scraped off) a weapon or agent, the sticker leaves the inventory, the item changes
  if (/(sticker|patch)\s+(applied|removed|scraped)|appl(y|ied)\s+(a\s+)?(sticker|patch)/i.test(desc)) return 'naklejka';
  if (/trade.?up|contract/i.test(desc)) return 'kontrakt';
  if (/traded with|trade/i.test(desc)) return 'wymiana';
  if (/market/i.test(desc)) return 'rynek';
  if (/unlock|opened|container|case|unsealed/i.test(desc)) return 'skrzynia';
  if (/gift|received|earned|drop|reward|purchased|store/i.test(desc)) return 'otrzymane';
  return 'inne';
}

export function parsePage(d) {
  const doc = new DOMParser().parseFromString(d.html || '', 'text/html');
  const descs = d.descriptions || {};
  const out = [];
  for (const row of doc.querySelectorAll('.tradehistoryrow')) {
    const dateEl = row.querySelector('.tradehistory_date');
    const timeTxt = dateEl?.querySelector('.tradehistory_timestamp')?.textContent.trim() || '';
    const dateTxt = (dateEl?.textContent || '').replace(timeTxt, '').trim();
    const t = parseDate(dateTxt, timeTxt);
    const descEl = row.querySelector('.tradehistory_event_description');
    const desc = descEl?.textContent.replace(/\s+/g, ' ').trim() || '';
    const pa = descEl?.querySelector('a[href*="steamcommunity.com/id/"], a[href*="steamcommunity.com/profiles/"]');
    const partner = pa ? { name: pa.textContent.trim(), href: pa.href || pa.getAttribute('href') } : null;
    const links = [...row.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')).filter((h) => /trade|receipt/i.test(h) && !/profiles|\/id\//.test(h));
    const plus = [], minus = [];
    for (const grp of row.querySelectorAll('.tradehistory_items')) {
      const sign = grp.querySelector('.tradehistory_items_plusminus')?.textContent.trim();
      const items = [...grp.querySelectorAll('.history_item')].map((h) => {
        const ds = descs[h.dataset.appid]?.[`${h.dataset.classid}_${h.dataset.instanceid}`] || {};
        return {
          hash: ds.market_hash_name || null,
          name: ds.name || h.querySelector('.history_item_name')?.textContent.trim() || '?',
          color: ds.name_color || null,
          icon: ds.icon_url || null,
        };
      });
      (sign === '-' || sign === '−' ? minus : plus).push(...items);
    }
    const first = (minus[0] || plus[0])?.name || '';
    out.push({ id: `${t}|${desc}|${minus.length}|${plus.length}|${first}`, t, desc, kind: kind(desc), plus, minus, partner, links });
  }
  return out;
}

async function fetchPage(cursor, app = 730) {
  const c = steam.ctx();
  let url = `${steam.ORIGIN}/profiles/${c.steamId}/inventoryhistory/?ajax=1&l=english&sessionid=${c.sessionId}&app%5B%5D=${app}`;
  if (cursor) url += `&cursor%5Btime%5D=${cursor.time}&cursor%5Btime_frac%5D=${cursor.time_frac}&cursor%5Bs%5D=${cursor.s}`;
  const d = await steam.schedule('inv', async () => {
    const r = await fetch(url, { credentials: 'include' });
    if (r.status === 429) throw new steam.HttpError(429, L('Steam: too many requests (429)', 'Steam: za dużo zapytań (429)'));
    if (!r.ok) throw new steam.HttpError(r.status);
    return r.json();
  });
  if (!d || d.success === false) throw new Error(d?.error || L('Steam returned no inventory history (log in)', 'Steam nie zwrócił historii ekwipunku (zaloguj się)'));
  return d;
}

/**
 * sync: newest pages until an already known event; then, while the history isn't complete yet
 * (first sync interrupted, rate limit, older data never fetched), keep going back from where the last run
 * stopped (`tail` cursor) until Steam has no more pages. `full` = re-read everything. app: 730 (CS2) or 753 (Steam).
 */
export async function sync({ full = false, isCancelled = () => false, onProgress = () => {}, app = 730 } = {}) {
  const saved = store.get(keyOf(app), { events: [] });
  mems.delete(app);
  const known = new Set(full ? [] : saved.events.map((e) => e.id));
  const complete = !full && saved.complete;
  const fresh = [];
  let cursor = null;
  let pages = 0;
  let tail = full ? null : saved.tail || null;
  let reachedEnd = false;
  let jumped = false;
  for (;;) {
    if (isCancelled()) break;
    const d = await fetchPage(cursor, app);
    const evs = parsePage(d);
    pages++;
    let hitKnown = false;
    for (const e of evs) {
      if (known.has(e.id)) { hitKnown = true; continue; }
      fresh.push(e);
    }
    if (!d.cursor || !evs.length) reachedEnd = true;
    // older part already being walked (or jumped to) → remember where to resume
    if (!complete && (jumped || !saved.tail)) tail = d.cursor || null;
    save(fresh, saved.events, { tail, complete: reachedEnd }, app);
    onProgress(fresh.length, pages, oldestT(app));
    if (reachedEnd) break;
    if (hitKnown && !jumped) {
      if (complete) break; // caught up with the newest known event and the past is complete
      // jump straight to where the previous (unfinished) run stopped
      if (saved.tail) { cursor = saved.tail; jumped = true; continue; }
    }
    cursor = d.cursor;
  }
  save(fresh, saved.events, { tail, complete: reachedEnd || complete, done: true }, app);
  return fresh.length;
}

function save(fresh, old, { tail, complete, done = false }, app = 730) {
  const seen = new Set();
  const events = [...fresh, ...old].filter((e) => !seen.has(e.id) && seen.add(e.id)).sort((a, b) => b.t - a.t).slice(0, MAX);
  const v = { events, tail: complete ? null : tail, complete: !!complete, syncedAt: done ? Date.now() : data(app).syncedAt || Date.now() };
  store.set(keyOf(app), v);
  mems.set(app, { v, at: Date.now() });
}
const oldestT = (app = 730) => { const ev = eventsOf(app); return ev.length ? ev[ev.length - 1].t : null; };
export const isComplete = (app = 730) => !!data(app).complete;
export const oldest = oldestT;

/** what happened to an item I no longer have: the newest event where it left the inventory */
export function fateOf(hash) {
  const e = all().find((x) => x.minus.some((i) => i.hash === hash));
  if (!e) return null;
  return { ...e, gotFor: e.plus };
}

// ---------------------------------------------------------------- does the trade partner still have it?
const ownerCache = new Map(); // key -> {state, at}
/** resolve a profile link to SteamID64 (vanity URLs via ?xml=1) */
async function steamIdOf(href) {
  const m = href.match(/\/profiles\/(\d{17})/);
  if (m) return m[1];
  const v = href.match(/\/id\/([^/?#]+)/);
  if (!v) return null;
  const xml = await steam.schedule('page', () => fetch(`${steam.ORIGIN}/id/${v[1]}/?xml=1`, { credentials: 'include' }).then((r) => r.text()));
  return xml.match(/<steamID64>(\d{17})<\/steamID64>/)?.[1] || null;
}
export const ownerState = (href, hash) => ownerCache.get(href + '|' + hash) || null;
/** 'has' | 'no' | 'private' | 'error' */
export async function checkOwner(href, hash) {
  const key = href + '|' + hash;
  ownerCache.set(key, { state: 'checking' });
  try {
    const id = await steamIdOf(href);
    if (!id) throw new Error(L('profile not recognised', 'nie rozpoznano profilu'));
    const inv = await steam.inventory(id, 730, 2, { maxAgeMin: 60 });
    const n = inv.filter((i) => i.hash === hash).length;
    ownerCache.set(key, { state: n ? 'has' : 'no', n, at: Date.now() });
  } catch (e) {
    ownerCache.set(key, { state: e.status === 403 ? 'private' : 'error', msg: e.message, at: Date.now() });
  }
  return ownerCache.get(key);
}
