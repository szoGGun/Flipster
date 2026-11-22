import { sleep, emitter, parsePrice, displayName } from './util.js';
import * as store from './store.js';
import { settings } from './store.js';
import { buyerFromReceived as _b2r, receivedFromBuyer as _r2b, DEFAULT_WALLET, syncMinBuyer } from './fees.js';
import * as disk from './cache.js';
import { parseQuotes, searchRows } from './analysis.js';
import { L } from './i18n.js';
// "no order data": prices.js recognises it by text (in either language)
const NO_ORDERS = () => L('steam.noOrderData');

export const ORIGIN = 'https://steamcommunity.com';
export const bus = emitter();

// ---------------------------------------------------------------- page context
function scanScripts(re) {
  for (const s of document.scripts) {
    const m = s.textContent && s.textContent.match(re);
    if (m) return m[1];
  }
  return null;
}

let _ctx;
export function ctx() {
  if (_ctx) return _ctx;
  // who is logged in: the old pages say it in an inline script (g_steamID); Steam's new (2026) pages don't, so also
  // the page's globals, the React config, and the account's own avatar in the top bar (data-miniprofile = 32-bit id)
  const sid = (v) => (/^\d{17}$/.test(String(v ?? '')) ? String(v) : null);
  const page = (k) => { try { return typeof unsafeWindow !== 'undefined' ? unsafeWindow[k] : undefined; } catch { return undefined; } };
  let steamId = sid(scanScripts(/g_steamID\s*=\s*"(\d{17})"/)) || sid(page('g_steamID'));
  if (!steamId) {
    try { steamId = sid(JSON.parse(document.querySelector('#application_config')?.dataset.userinfo || '{}').steamid); } catch { /* */ }
  }
  if (!steamId) {
    const mp = document.querySelector('#global_actions [data-miniprofile]')?.dataset.miniprofile;
    if (/^\d{1,10}$/.test(mp || '')) steamId = (76561197960265728n + BigInt(mp)).toString();
  }
  // still unknown, but the top bar shows a logged-in account (avatar / wallet): the id remembered from an earlier page
  if (!steamId && document.querySelector('#global_actions .user_avatar, #account_pulldown, #header_wallet_balance')) steamId = sid(store.get('steamId', null));
  const sessionId = (document.cookie.match(/(?:^|;\s*)sessionid=([^;]+)/) || [])[1] || scanScripts(/g_sessionID\s*=\s*"([^"]+)"/) || page('g_sessionID') || null;
  let wallet = null;
  // the page's own wallet object first (exact fee settings for this account/currency), else parse it from the HTML
  let pw = null;
  try { pw = typeof unsafeWindow !== 'undefined' && unsafeWindow.g_rgWalletInfo ? JSON.parse(JSON.stringify(unsafeWindow.g_rgWalletInfo)) : null; } catch { /* */ }
  const wj = pw ? JSON.stringify(pw) : scanScripts(/g_rgWalletInfo\s*=\s*(\{[^;]*?\})\s*;/);
  if (wj) {
    try {
      const w = JSON.parse(wj);
      wallet = {
        currency: parseInt(w.wallet_currency, 10) || 6,
        country: w.wallet_country || 'PL',
        feePercent: parseFloat(w.wallet_fee_percent ?? 0.05),
        feeMin: parseInt(w.wallet_fee_minimum ?? 1, 10),
        feeBase: parseInt(w.wallet_fee_base ?? 0, 10),
        pubDefault: parseFloat(w.wallet_publisher_fee_percent_default ?? 0.1),
        balance: parseInt(w.wallet_balance, 10) || 0,
      };
      store.set('wallet', wallet);
    } catch { /* ignore */ }
  }
  wallet ||= store.get('wallet', null) || { ...DEFAULT_WALLET, currency: 6, country: 'PL', balance: 0 };
  syncMinBuyer(wallet);
  if (steamId) store.set('steamId', steamId);
  // walletAt = when the balance was read from Steam; 0 = this page had no wallet info and the saved value is used
  _ctx = { steamId: steamId || store.get('steamId', null), sessionId, wallet, walletAt: wj ? Date.now() : 0, loggedIn: !!(steamId && sessionId) };
  return _ctx;
}

/**
 * Listings of one item, cheapest first: buyer price (wallet currency) and, when Steam includes the asset properties,
 * float and pattern seed. One page (≤ 100) per call.
 */
export async function marketListings(appid, hash, { start = 0, count = 100 } = {}) {
  const w = wallet();
  const d = await schedule('page', () => getJSON(`${ORIGIN}/market/listings/${appid}/${encodeURIComponent(hash)}/render/?query=&start=${start}&count=${count}&country=${w.country || 'PL'}&language=english&currency=${w.currency}`));
  if (!d?.success) throw new Error(L('steam.steamReturnedNoListings'));
  const props = new Map((Array.isArray(d.asset_properties) ? d.asset_properties : []).map((p) => [String(p.assetid), p.asset_properties || []]));
  const out = [];
  for (const l of Object.values(d.listinginfo || {})) {
    const a = l.asset || {};
    const desc = d.assets?.[a.appid]?.[a.contextid]?.[a.id] || {};
    const pr = props.get(String(a.id)) || a.asset_properties || desc.asset_properties || [];
    const fl = pr.find((p) => p.propertyid === 2)?.float_value;
    const seed = pr.find((p) => p.propertyid === 1)?.int_value;
    const buyer = (l.converted_price ?? l.price ?? 0) + (l.converted_fee ?? l.fee ?? 0);
    if (!(buyer > 0)) continue;
    out.push({ id: String(l.listingid), price: buyer, float: fl != null ? parseFloat(fl) : null, seed: seed != null ? +seed : null });
  }
  return { total: d.total_count || 0, listings: out.sort((x, y) => x.price - y.price) };
}

/**
 * Logged in? On pages that don't say (Steam's new item pages carry neither g_steamID nor a readable session id) the
 * classic market page is asked once, it has both, for the account whose cookies the browser sends. true / false.
 */
let loginCheck = null;
export function ensureLogin() {
  const c = ctx();
  if (c.loggedIn) return Promise.resolve(true);
  return (loginCheck ||= (async () => {
    try {
      const html = await schedule('page', () => getText(`${ORIGIN}/market/`));
      const sid = html.match(/g_steamID\s*=\s*"(\d{17})"/)?.[1];
      const ses = html.match(/g_sessionID\s*=\s*"([^"]+)"/)?.[1];
      if (sid && ses) {
        c.steamId = sid; c.sessionId = ses; c.loggedIn = true;
        store.set('steamId', sid);
        const m = html.match(/g_rgWalletInfo\s*=\s*(\{[^;]*?\})\s*;/);
        const b = m ? parseInt(JSON.parse(m[1]).wallet_balance, 10) : NaN;
        if (b >= 0) { c.wallet.balance = b; c.walletAt = Date.now(); store.set('wallet', c.wallet); }
        return true;
      }
    } catch { /* offline / rate limited: try again next time */ }
    loginCheck = null;
    return false;
  })());
}

export const wallet = () => ctx().wallet;
/**
 * The balance read in ctx() is from the moment the page loaded, and pages without the market scripts carry none (then
 * the value saved earlier is used). This re-reads it from the market front page: one request, at most once per
 * `maxAgeMs`. Updates the shared wallet object in place, so wallet() returns the new balance everywhere.
 */
export async function refreshWallet(maxAgeMs = 60000) {
  const c = ctx();
  if (Date.now() - c.walletAt < maxAgeMs) return c.wallet;
  const html = await schedule('page', () => getText(`${ORIGIN}/market/`));
  const m = html.match(/g_rgWalletInfo\s*=\s*(\{[^;]*?\})\s*;/);
  const b = m ? parseInt(JSON.parse(m[1]).wallet_balance, 10) : NaN;
  if (!(b >= 0)) throw new Error(L('steam.steamGaveNoWalletBalance'));
  c.wallet.balance = b;
  c.walletAt = Date.now();
  store.set('wallet', c.wallet);
  return c.wallet;
}
// Steam's own fee function from the page (economy_common.js) when it's loaded, exactly what Steam will charge;
// otherwise the same formula with this account's wallet settings
function pageFees() {
  try {
    const W = typeof unsafeWindow !== 'undefined' ? unsafeWindow : null;
    return W && typeof W.CalculateAmountToSendForDesiredReceivedAmount === 'function' && W.g_rgWalletInfo ? W : null;
  } catch { return null; }
}
export function buyerFromReceived(recv, pub = wallet().pubDefault) {
  const W = pageFees();
  if (W) {
    try {
      const r = W.CalculateAmountToSendForDesiredReceivedAmount(recv, pub, W.g_rgWalletInfo);
      const a = parseInt(r?.amount, 10);
      if (a > 0) return a;
    } catch { /* fall back */ }
  }
  return _b2r(recv, pub, wallet());
}
/** largest amount the seller receives such that the buyer pays <= `buyer` */
export function receivedFromBuyer(buyer, pub = wallet().pubDefault) {
  if (!(buyer > 0)) return 0;
  let r = _r2b(buyer, pub, wallet());
  while (r > 1 && buyerFromReceived(r, pub) > buyer) r--;
  while (buyerFromReceived(r + 1, pub) <= buyer) r++;
  return r;
}

/**
 * Nearest price a listing can really have: the largest one ≤ `buyer` (with up=true: the smallest one ≥ `buyer`).
 * Not every price exists once the fees are added, e.g. nobody can list for 2,29 zł: receiving 1,99 costs the
 * buyer 2,27 and receiving 2,00 costs 2,30.
 */
export function achievable(buyer, pub = wallet().pubDefault, up = false) {
  if (!(buyer > 0)) return buyer;
  const r = receivedFromBuyer(buyer, pub);
  const p = buyerFromReceived(r, pub);
  return up && p < buyer ? buyerFromReceived(r + 1, pub) : p;
}

const CURRENCY = { 1: ['$', ''], 2: ['£', ''], 3: ['', '€'], 5: ['', ' pуб.'], 6: ['', ' zł'], 7: ['R$ ', ''], 17: ['', ' TL'], 18: ['', '₴'], 23: ['¥ ', ''], 37: ['', ' kr'] };
export function fmt(c) {
  if (c == null || isNaN(c)) return '-';
  const [pre, suf] = CURRENCY[wallet().currency] || ['', ''];
  const neg = c < 0 ? '−' : '';
  const v = (Math.abs(c) / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return neg + pre + v + suf;
}

// ---------------------------------------------------------------- rate-limited lanes
export class HttpError extends Error {
  constructor(status, msg) { super(msg || `HTTP ${status}`); this.status = status; }
}

// Adaptive, cross-tab rate limiting.
//  - each lane starts at `start` ms between requests, speeds up by 7% after every 8 successes (down to `min`),
//    and on HTTP 429 doubles its interval (up to `max`) and pauses the lane (30 s → 60 s → … 10 min)
//  - the learned interval is persisted, so the next visit starts at a known-safe pace
//  - the "next allowed request" time and pauses are shared through GM storage by ALL open Steam tabs,
//    so three tabs don't hit Steam three times as fast
const LANES = {
  hist:   { start: 900,  min: 350,  max: 8000 },   // /market/orderbook (prices, competition)
  price:  { start: 3000, min: 2000, max: 15000 },  // /market/priceoverview (volume), strict
  page:   { start: 4000, min: 3000, max: 20000 },  // legacy listing page
  inv:    { start: 2500, min: 1500, max: 20000 },  // /inventory, strict
  market: { start: 1200, min: 600,  max: 10000 },  // mylistings, history, search
  search: { start: 1000, min: 500,  max: 15000 },  // /market/search/render (case contents), own lane so a long scan doesn't slow relisting
  quote:  { start: 1000, min: 600,  max: 15000 },  // /market/actions Search (Steam items, 100 per request), own lane so a scan doesn't hold up a refresh
  write:  { fixed: () => settings.delay },         // remove/sell/order, never adaptive
  ext:    { fixed: () => 500 },                    // outside services (NBP exchange rates)
};
const lanes = {};
const LANE_KEY = 'lanes'; // persisted: { lane: { iv, next, pauseUntil, backoff } }
const shared = () => store.get(LANE_KEY, {});
function saveShared(lane, patch) {
  const all = shared();
  all[lane] = { ...(all[lane] || {}), ...patch };
  store.set(LANE_KEY, all);
}

// ---------------------------------------------------------------- request counter (measuring only)
// How many requests went to Steam, per lane and per endpoint, by the hour (all tabs together, the last 48 hours), and
// how many were answered 429. Shown in the settings, to see what really costs requests before changing anything.
const REQ_KEY = 'reqStats';
let reqPend = {};
const hourOf = (t = Date.now()) => Math.floor(t / 3600000) * 3600000;
function countReq(key, n = 1) {
  const h = hourOf();
  const b = (reqPend[h] ||= {});
  b[key] = (b[key] || 0) + n;
}
// "https://steamcommunity.com/market/listings/730/AK-47.../render?…" → "/market/listings/…/render"
const endpointOf = (url) => {
  try {
    const p = new URL(url, ORIGIN).pathname;
    if (/^\/inventory\//.test(p)) return '/inventory';
    if (/^\/market\/listings\//.test(p)) return /\/render\/?$/.test(p) ? '/market/listings/…/render' : '/market/listings/…';
    if (/^\/(id|profiles)\//.test(p)) return /inventoryhistory/.test(p) ? '/…/inventoryhistory' : '/…/(profil)';
    return p.replace(/\/\d{5,}(\/|$)/g, '/…$1').replace(/\/$/, '');
  } catch { return '?'; }
};
function flushReq() {
  const pend = reqPend;
  reqPend = {};
  if (!Object.keys(pend).length) return;
  try {
    const all = store.get(REQ_KEY, {}) || {};
    for (const [h, b] of Object.entries(pend)) { const t = (all[h] ||= {}); for (const [k, n] of Object.entries(b)) t[k] = (t[k] || 0) + n; }
    const lim = hourOf() - 48 * 3600000;
    for (const h of Object.keys(all)) if (+h < lim) delete all[h];
    store.set(REQ_KEY, all);
  } catch { /* measuring is optional */ }
}
if (typeof window !== 'undefined') { setInterval(flushReq, 15000); window.addEventListener('beforeunload', flushReq); }
/** { hour: {key: n}, day: {key: n} }: keys "lane:hist", "429:hist", "url:/market/orderbook" */
export function requestStats() {
  flushReq();
  const all = store.get(REQ_KEY, {}) || {};
  const now = hourOf(), sum = (from) => { const o = {}; for (const [h, b] of Object.entries(all)) if (+h >= from) for (const [k, n] of Object.entries(b)) o[k] = (o[k] || 0) + n; return o; };
  return { hour: sum(now), day: sum(now - 23 * 3600000), since: now };
}

export function laneStats() {
  const all = shared();
  return Object.fromEntries(Object.keys(LANES).filter((k) => !LANES[k].fixed).map((k) => [k, all[k]?.iv ?? LANES[k].start]));
}

export function schedule(lane, fn, { retry = true } = {}) {
  const cfg = LANES[lane] || { start: 1000, min: 500, max: 10000 };
  const l = (lanes[lane] ||= { chain: Promise.resolve(), ok: 0 });
  const interval = () => (cfg.fixed ? cfg.fixed() : Math.min(cfg.max, Math.max(cfg.min, shared()[lane]?.iv ?? cfg.start)));
  const run = async () => {
    for (let attempt = 0; ; attempt++) {
      // wait for the shared slot (other tabs may have used it) and any shared 429 pause
      for (;;) {
        const s = shared()[lane] || {};
        const at = Math.max(s.next || 0, s.pauseUntil || 0);
        const wait = at - Date.now();
        if (wait <= 0) break;
        await sleep(Math.min(wait, 2000)); // re-check: another tab may have changed the schedule
      }
      saveShared(lane, { next: Date.now() + interval() });
      countReq('lane:' + lane);
      try {
        const r = await fn();
        if (!cfg.fixed && ++l.ok >= 8) {
          l.ok = 0;
          saveShared(lane, { iv: Math.max(cfg.min, Math.round(interval() * 0.93)), backoff: 0 });
        }
        return r;
      } catch (e) {
        if (e.status === 429) {
          countReq('429:' + lane);
          l.ok = 0;
          const s = shared()[lane] || {};
          const backoff = Math.min((s.backoff || 15000) * 2, 600000);
          saveShared(lane, {
            iv: cfg.fixed ? undefined : Math.min(cfg.max, interval() * 2),
            backoff,
            pauseUntil: Date.now() + backoff,
          });
          bus.emit('ratelimit', lane, backoff);
          if (retry && attempt < 3) continue;
        }
        throw e;
      }
    }
  };
  const p = l.chain.then(run, run);
  l.chain = p.catch(() => {});
  return p;
}

async function getJSON(url) {
  countReq('url:' + endpointOf(url));
  const r = await fetch(url, { credentials: 'include' });
  if (!r.ok) throw new HttpError(r.status, r.status === 429 ? L('steam.steamTooManyRequests429') : r.status === 403 ? L('steam.noAccess403PrivateInventory') : undefined);
  const t = await r.text();
  try { return JSON.parse(t) ?? {}; } catch { throw new HttpError(r.status, L('steam.invalidResponseFromSteamAre')); }
}

async function getText(url) {
  countReq('url:' + endpointOf(url));
  const r = await fetch(url, { credentials: 'include' });
  if (!r.ok) throw new HttpError(r.status, r.status === 429 ? L('steam.steamTooManyRequests429') : undefined);
  return r.text();
}

async function post(url, data, referrer) {
  countReq('url:' + endpointOf(url));
  const r = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    referrer: referrer || `${ORIGIN}/market/`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: new URLSearchParams({ sessionid: ctx().sessionId, ...data }),
  });
  let json = null;
  try { json = await r.json(); } catch { /* not json */ }
  if (r.status === 429) throw new HttpError(429, L('steam.steamTooManyRequests429'));
  return { ok: r.ok, status: r.status, json: json || {} };
}

// ---------------------------------------------------------------- listings & buy orders
export async function myListings() {
  const listings = [];
  let buyOrders = [];
  let toConfirm = 0;
  // listings waiting for the mobile confirmation: not on the market yet, shown greyed out in "Moje oferty".
  // pendingKnown = Steam sent the list at all (if not, the tab falls back to what it relisted itself)
  let pending = [], pendingKnown = false;
  let start = 0;
  let total = Infinity;
  while (start < total) {
    const d = await schedule('market', () => getJSON(`${ORIGIN}/market/mylistings/?norender=1&start=${start}&count=100`));
    if (!d.success) throw new Error(L('steam.couldntLoadListingsAreYou'));
    total = d.total_count || 0;
    if (start === 0) {
      buyOrders = (d.buy_orders || []).map(parseBuyOrder);
      toConfirm = (d.listings_to_confirm || []).length;
      pendingKnown = Array.isArray(d.listings_to_confirm);
      for (const l of d.listings_to_confirm || []) {
        try { const p = parseListing(l, d.assets); if (p.hash && p.recv > 0) pending.push(p); } catch { /* unknown shape: the fallback covers it */ }
      }
    }
    const ls = d.listings || [];
    for (const l of ls) listings.push(parseListing(l, d.assets));
    if (!ls.length) break;
    start += ls.length;
  }
  return { listings, buyOrders, toConfirm, pending, pendingKnown };
}

function parseListing(l, assets) {
  const a = l.asset || {};
  const desc = assets?.[a.appid]?.[a.contextid]?.[a.id] || a;
  const recv = l.converted_price || l.price;
  const fee = l.converted_fee || l.fee;
  return {
    listingid: String(l.listingid),
    appid: String(a.appid),
    contextid: String(a.contextid),
    assetid: String(a.id),
    amount: parseInt(a.amount, 10) || parseInt(a.original_amount, 10) || 1,
    hash: desc.market_hash_name || a.market_hash_name,
    name: displayName(desc.market_hash_name || a.market_hash_name, desc.name || desc.market_name),
    color: desc.name_color,
    icon: desc.icon_url,
    recv,
    buyer: recv + fee,
    pub: parseFloat(l.publisher_fee_percent) || wallet().pubDefault,
    created: (l.time_created || 0) * 1000,
    // full item description (stickers, rarity, float if Steam provides it) for showing it in the inventory view
    item: describeItem(
      { appid: a.appid, contextid: a.contextid, assetid: a.id, classid: desc.classid ?? a.classid, instanceid: desc.instanceid ?? a.instanceid, amount: a.amount || a.original_amount },
      desc,
      a.asset_properties || desc.asset_properties || [],
      ctx().steamId,
    ),
  };
}

function parseBuyOrder(o) {
  const d = o.description || {};
  return {
    id: String(o.buy_orderid),
    appid: String(o.appid),
    hash: o.hash_name,
    name: displayName(o.hash_name, d.name),
    color: d.name_color,
    icon: d.icon_url,
    price: parseInt(o.price, 10), // per unit, buyer price (cents)
    qty: parseInt(o.quantity, 10),
    remaining: parseInt(o.quantity_remaining, 10),
  };
}

export const removeListing = (id) => schedule('write', () => post(`${ORIGIN}/market/removelisting/${id}`, {}));

export const sellItem = ({ appid, contextid, assetid, amount = 1, price }) =>
  schedule('write', () =>
    post(`${ORIGIN}/market/sellitem/`, { appid, contextid, assetid, amount: String(amount), price: String(price) }, `${ORIGIN}/profiles/${ctx().steamId}/inventory/`),
  );

export const createBuyOrder = ({ appid, hash, priceEach, qty }) =>
  schedule('write', () =>
    post(`${ORIGIN}/market/createbuyorder/`, {
      currency: String(wallet().currency),
      appid: String(appid),
      market_hash_name: hash,
      price_total: String(priceEach * qty),
      quantity: String(qty),
      billing_state: '',
      save_my_address: '0',
    }, `${ORIGIN}/market/listings/${appid}/${encodeURIComponent(hash)}`),
  );

export const cancelBuyOrder = (id) => schedule('write', () => post(`${ORIGIN}/market/cancelbuyorder/`, { buy_orderid: id }));

export function sellResultText(res) {
  const j = res.json || {};
  if (res.ok && j.success) {
    const conf = j.requires_confirmation || j.needs_mobile_confirmation || j.needs_email_confirmation;
    return { ok: true, confirm: !!conf };
  }
  return { ok: false, msg: j.message || `HTTP ${res.status}` };
}

// ---------------------------------------------------------------- inventory
// short-lived inventory cache shared between pages (panel ↔ badges on Steam's inventory page),
// so we don't hit Steam's strict inventory rate limit twice for the same data
const INV_CACHE_KEY = 'invcache';
/**
 * The inventory as the last load of it saved it (any tab), without asking Steam: the given contexts merged (first
 * one first, each asset once) → { at (when the first was loaded), items }, or null when the first isn't saved
 */
export function cachedInventory(steamId = ctx().steamId, appid = 730, contexts = [2]) {
  const all = store.get(INV_CACHE_KEY, {});
  const main = all[`${steamId}|${appid}|${contexts[0]}`];
  if (!main?.items) return null;
  const seen = new Set(), items = [];
  for (const c of contexts) for (const it of all[`${steamId}|${appid}|${c}`]?.items || []) if (!seen.has(it.assetid)) { seen.add(it.assetid); items.push(it); }
  return { at: main.at, items };
}
export async function inventory(steamId = ctx().steamId, appid = 730, contextid = 2, { maxAgeMin = 0 } = {}) {
  const key = `${steamId}|${appid}|${contextid}`;
  if (maxAgeMin > 0) {
    const c = store.get(INV_CACHE_KEY, {})[key];
    if (c && Date.now() - c.at < maxAgeMin * 60000) return c.items;
  }
  const items = await fetchInventory(steamId, appid, contextid);
  rememberProps(items);
  try {
    const all = store.get(INV_CACHE_KEY, {});
    for (const k of Object.keys(all)) if (Date.now() - all[k].at > 3600000) delete all[k];
    all[key] = { at: Date.now(), items };
    store.set(INV_CACHE_KEY, all);
  } catch { /* cache is optional */ }
  return items;
}

// ---------------------------------------------------------------- float/seed/name-tag memory
// Steam may not return asset_properties for items that are listed on the market. We remember every
// float we've seen per assetid, so a listed item still shows its float if we saw it before listing.
const PROPS_KEY = 'assetProps';
const PROPS_MAX = 8000;
// kept in memory: read for every item shown (a listed item, a badge on the inventory page), and every read from GM
// storage copies all 8000 entries; re-read after 30 s (another tab may have added some)
let propsMem = null, propsAt = 0;
const propsAll = () => (propsMem && Date.now() - propsAt < 30000 ? propsMem : ((propsAt = Date.now()), (propsMem = store.get(PROPS_KEY, {}))));
export function rememberProps(items) {
  try {
    const m = propsAll();
    let changed = false;
    for (const i of items) {
      if (i.float == null && !i.nameTag) continue;
      const v = [i.float, i.seed, i.nameTag || null];
      const old = m[i.assetid];
      if (!old || old[0] !== v[0] || old[2] !== v[2]) { m[i.assetid] = v; changed = true; }
    }
    const keys = Object.keys(m);
    if (keys.length > PROPS_MAX) { keys.slice(0, keys.length - PROPS_MAX).forEach((k) => delete m[k]); changed = true; }
    if (changed) store.set(PROPS_KEY, m);
    propsMem = m; propsAt = Date.now();
  } catch { /* optional */ }
}
/** fill float/seed/nameTag from memory when missing */
export function recallProps(item) {
  if (!item || (item.float != null && item.nameTag)) return item;
  const v = propsAll()[item.assetid];
  if (!v) return item;
  return { ...item, float: item.float ?? v[0], seed: item.seed ?? v[1], nameTag: item.nameTag || v[2] };
}

// ---------------------------------------------------------------- item names in your Steam language
// The inventory is read in English (float, stickers, trade lock dates are parsed from English texts). Names are then
// swapped for the ones in your Steam language: one extra inventory request in that language, only for item classes
// not seen before (cached forever, an item's name doesn't change).
export function uiLanguage() {
  try { if (typeof unsafeWindow !== 'undefined' && unsafeWindow.g_strLanguage) return unsafeWindow.g_strLanguage; } catch { /* */ }
  const c = document.cookie.match(/(?:^|;\s*)Steam_Language=([^;]+)/)?.[1];
  if (c) return c;
  return /^pl/i.test(document.documentElement.lang || '') ? 'polish' : 'english';
}

async function fetchInventory(steamId, appid, contextid) {
  const items = [];
  let last = null;
  let more = true;
  let guard = 0;
  // Steam sometimes answers 500/400 for big pages → step the page size down (remembered), retry transient errors
  const SIZES = [2000, 1000, 500, 200, 75];
  let si = Math.max(0, SIZES.indexOf(store.get('invPage', 2000)));
  while (more && guard++ < 200) {
    let d, tries = 0;
    for (;;) {
      const url = `${ORIGIN}/inventory/${steamId}/${appid}/${contextid}?l=english&count=${SIZES[si]}${last ? `&start_assetid=${last}` : ''}`;
      try { d = await schedule('inv', () => getJSON(url)); break; } catch (e) {
        if (e.status !== 500 && e.status !== 400 && e.status !== 502 && e.status !== 503) throw e;
        if (si < SIZES.length - 1) { si++; store.set('invPage', SIZES[si]); console.warn(`[Flipster] ekwipunek: Steam ${e.status}, zmniejszam stronę do ${SIZES[si]}`); continue; }
        if (++tries > 2) throw new HttpError(e.status, L('steam.steamIsntReturningTheInventory', { status: e.status }));
        await sleep(3000 * tries);
      }
    }
    items.push(...parseInventory(d, steamId));
    more = !!d.more_items;
    last = d.last_assetid;
  }
  return items;
}

export function parseInventory(d, steamId) {
  const descs = new Map((d.descriptions || []).map((x) => [x.classid + '_' + x.instanceid, x]));
  const props = new Map((d.asset_properties || []).map((p) => [String(p.assetid), p.asset_properties || []]));
  return (d.assets || []).map((a) =>
    describeItem(a, descs.get(a.classid + '_' + a.instanceid) || {}, props.get(String(a.assetid)) || [], steamId));
}

/**
 * Normalized item from an asset + its description (+ optional asset_properties).
 * Shared by the inventory and by market listings (which carry the same description fields).
 */
export function describeItem(a, ds, pr = [], steamId = '') {
  const prop = (id) => pr.find((p) => p.propertyid === id);
  const fl = prop(2)?.float_value;
  const seed = prop(1)?.int_value;
  const html = (ds.descriptions || []).map((x) => x.value || '').join('\n');
  const stickers = [...html.matchAll(/<img[^>]*src="([^"]+)"[^>]*title="(Sticker|Patch|Charm): ([^"]+)"/g)].map((m) => ({ img: m[1], kind: m[2], name: m[3] }));
  const wear = (ds.descriptions || []).find((x) => x.name === 'exterior_wear')?.value?.replace('Exterior: ', '');
  const tag = (cat) => (ds.tags || []).find((t) => t.category === cat);
  let inspect = (ds.actions || []).find((x) => /preview/.test(x.link))?.link;
  if (inspect) {
    inspect = inspect
      .replace('%owner_steamid%', steamId)
      .replace('%assetid%', a.assetid)
      .replace(/%propid:(\d+)%/g, (_, id) => pr.find((p) => p.propertyid === +id)?.string_value || '');
  }
  const lock = (ds.owner_descriptions || []).map((x) => x.value).join(' ');
  // CS2 name tag. Classic place: fraudwarnings ["Name Tag: ''my name''"]; since the 2025 asset_properties
  // change it may also come as a string property (e.g. "Custom Name" / "Name Tag"), accept both.
  const ntRaw = (ds.fraudwarnings || []).find((x) => /Name ?Tag|Nazwa/i.test(x));
  const ntProp = pr.find((p) => p.string_value && p.propertyid !== 6 && /name|tag|nazw/i.test(p.name || ''));
  const nameTag = ntRaw
    ? ntRaw.replace(/^.*?(Name ?Tag|Nazwa[^:]*):\s*/i, '').replace(/^''|''$/g, '').replace(/^"|"$/g, '').trim()
    : ntProp ? String(ntProp.string_value).trim() : null;
  return {
    appid: String(a.appid),
    contextid: String(a.contextid),
    assetid: String(a.assetid),
    classid: a.classid,
    instanceid: a.instanceid,
    amount: parseInt(a.amount, 10) || 1,
    hash: ds.market_hash_name,
    name: displayName(ds.market_hash_name, ds.name),
    color: ds.name_color,
    rarityColor: tag('Rarity')?.color,
    rarity: tag('Rarity')?.internal_name || null,   // Rarity_Default = stock (default) item
    itemType: tag('Type')?.internal_name || null,   // CSGO_Type_Collectible (coins, medals, pins), CSGO_Type_MusicKit…
    type: ds.type,
    icon: ds.icon_url,
    marketable: !!ds.marketable,
    tradable: !!ds.tradable,
    commodity: !!ds.commodity,
    float: fl != null ? parseFloat(fl) : null,
    seed: seed != null ? parseInt(seed, 10) : null,
    wear,
    stickers,
    nameTag,
    // 2025+ inventory: listed items stay in the inventory "sealed" (sealed_type 1); other sealed = trade protection
    sealed: Number(ds.sealed_type) === 1 ? 'listed' : ds.sealed ? 'protected' : null,
    inspect,
    lock: /after|Tradable|Marketable|protected/i.test(lock) ? lock.replace(/<[^>]+>/g, '')
      : ds.sealed && Number(ds.sealed_type) !== 1 ? 'Ochrona handlu (trade protection)' : '',
  };
}

// ---------------------------------------------------------------- market data
export async function priceOverview(appid, hash, currency = wallet().currency) {
  const d = await schedule('price', () =>
    getJSON(`${ORIGIN}/market/priceoverview/?appid=${appid}&currency=${currency}&market_hash_name=${encodeURIComponent(hash)}`),
  );
  if (!d.success) throw new Error(L('steam.noPriceData'));
  return {
    lowest: parsePrice(d.lowest_price),
    median: parsePrice(d.median_price),
    volume: parseInt(String(d.volume || '0').replace(/\D/g, ''), 10) || 0,
  };
}

const nameIds = store.bucket('nameids');
export async function nameId(appid, hash) {
  const key = appid + '|' + hash;
  const cached = nameIds.get(key);
  if (cached) return cached;
  const html = await schedule('page', () => getText(`${ORIGIN}/market/listings/${appid}/${encodeURIComponent(hash)}`));
  const m = html.match(/Market_LoadOrderSpread\(\s*(\d+)\s*\)/) || html.match(/item_?name_?id["']?\s*[:=]\s*["']?(\d+)/i);
  if (!m) throw new Error(L('steam.couldntLoadBuyOrdersNew'));
  nameIds.set(key, m[1]);
  return m[1];
}

const graph = (g) => (g || []).map((x) => [Math.round(x[0] * 100), parseInt(x[1], 10)]);
const int = (s) => parseInt(String(s ?? '').replace(/\D/g, ''), 10) || 0;

/** compact [price, qty, price, qty, ...] (per level) -> cumulative graph [[price, cumQty], ...] */
export function compactToGraph(arr) {
  const out = [];
  let cum = 0;
  for (let i = 0; i + 1 < (arr || []).length; i += 2) {
    cum += arr[i + 1];
    out.push([arr[i], cum]);
  }
  return out;
}

/** New market (2026): GET /market/orderbook?q=Load&qp=[appid, market_hash_name], no item_nameid needed */
async function orderBook(appid, hash) {
  const url = `${ORIGIN}/market/orderbook?q=Load&qp=${encodeURIComponent(JSON.stringify([Number(appid), hash]))}`;
  const d = await schedule('hist', async () => {
    const r = await fetch(url, { credentials: 'include', headers: { 'x-valve-action-type': 'queryAction' } });
    if (r.status === 429) throw new HttpError(429, L('steam.steamTooManyRequests429'));
    if (!r.ok) throw new HttpError(r.status);
    return r.json();
  });
  const b = d?.data?.success ? d.data.data : null;
  if (!b) throw new Error(NO_ORDERS());
  return parseOrderBook(b);
}

export function parseOrderBook(b) {
  return {
    highestBuy: b.amtMaxBuyOrder || null,
    lowestSell: b.amtMinSellOrder || null,
    buyGraph: compactToGraph(b.rgCompactBuyOrders),
    sellGraph: compactToGraph(b.rgCompactSellOrders),
    buyCount: b.cBuyOrders || 0,
    sellCount: b.cSellOrders || 0,
    currency: b.eCurrency,
    at: Date.now(),
  };
}

/** one request to the new market's Search action (up to 100 rows); never retried, callers have the old way to fall back on */
const searchAction = (q) => schedule('quote', async () => {
  countReq('url:/market/actions');
  const r = await fetch(`${ORIGIN}/market/actions?q=Search&qp=${encodeURIComponent(JSON.stringify([q]))}`, { credentials: 'include', headers: { 'x-valve-action-type': 'queryAction' } });
  if (r.status === 429) throw new HttpError(429, L('steam.steamTooManyRequests429'));
  if (!r.ok) throw new HttpError(r.status);
  return (await r.json())?.data;
}, { retry: false });
/**
 * A page of the new search as { total_count, results } in the old search's shape, prices in the wallet currency.
 * Throws when it can't be used right now. Only for items without wears: it merges a skin's variants into one row.
 */
export async function marketSearchPage(q) {
  if (Date.now() < (shared().quote?.pauseUntil || 0)) throw new HttpError(429, L('steam.steamTooManyRequests429'));
  const d = await searchAction({ strQuery: '', count: 100, ...q });
  const rows = d?.results || [];
  if (rows.length && rows[0].eCurrency !== wallet().currency) throw new Error('search currency');
  return { total_count: d?.total_count || 0, results: searchRows(rows) };
}

/**
 * Cheapest price and number of listings of many Steam items (cards, backgrounds…) from the new market's Search action:
 * up to 100 rows a request, filtered by game. Trading cards first (fewer rows), then the rest of what's still missing.
 * Only a shortcut: on any problem it returns what it has and the caller fetches the order books as before.
 */
const QUOTE_GAMES = 40, QUOTE_PAGES = 20;
export async function steamItemQuotes(hashes, isCancelled = () => false) {
  const out = new Map(), left = new Set(hashes.filter((h) => /^\d+-/.test(h)));
  const gameOf = (h) => h.slice(0, h.indexOf('-'));
  if (Date.now() < (shared().quote?.pauseUntil || 0)) return out; // after a 429: not now, and don't wait for it
  const currency = wallet().currency;
  try {
    for (const itemClass of [['item_class_2'], null]) {
      const games = [...new Set([...left].map(gameOf))];
      for (let i = 0; i < games.length; i += QUOTE_GAMES) {
        const part = new Set(games.slice(i, i + QUOTE_GAMES));
        const filters = { Game: [...part].map((g) => `app_${g}`), ...(itemClass ? { item_class: itemClass } : {}) };
        for (let start = 0, total = Infinity, pages = 0; start < total && pages < QUOTE_PAGES; pages++) {
          if (isCancelled() || ![...left].some((h) => part.has(gameOf(h)))) break;
          const d = await searchAction({ appid: 753, strQuery: '', start, count: 100, filters });
          const rows = d?.results || [];
          if (!rows.length) break;
          if (rows[0].eCurrency !== currency) return out; // another currency can't be compared with the order book
          for (const [h, q] of parseQuotes(rows, currency)) if (left.delete(h)) out.set(h, q);
          total = d.total_count || 0;
          start += rows.length;
        }
      }
      if (!left.size) break;
    }
  } catch (e) {
    console.warn('[Flipster] quick price check failed, using order books', e);
  }
  return out;
}

let orderBookBroken = false;
let histWarned = false; // the fallback is said in the console once per page, not for every item
export async function histogram(appid, hash) {
  if (!orderBookBroken) {
    for (let attempt = 0; ; attempt++) {
      try {
        return await orderBook(appid, hash);
      } catch (e) {
        if (e.status === 429) throw e;
        if (e.status === 404) { orderBookBroken = true; break; } // endpoint gone → use legacy path from now on
        if (e.message === NO_ORDERS()) throw new Error(L('steam.noOrderDataCheckThe', { hash }));
        // a Steam server hiccup (502 Bad Gateway & co.): once more after a moment, before the slower old endpoint
        // (it needs the item's page first)
        if (e.status >= 500 && attempt === 0) { await sleep(1500); continue; }
        if (!histWarned) { histWarned = true; console.warn('[Flipster] orderbook failed, trying legacy histogram', e); }
        break;
      }
    }
  }
  return legacyHistogram(appid, hash);
}

async function legacyHistogram(appid, hash) {
  const id = await nameId(appid, hash);
  const w = wallet();
  const d = await schedule('hist', () =>
    getJSON(`${ORIGIN}/market/itemordershistogram?country=${w.country || 'PL'}&language=english&currency=${w.currency}&item_nameid=${id}&two_factor=0`),
  );
  if (!d.success) throw new Error(NO_ORDERS());
  return {
    highestBuy: d.highest_buy_order ? parseInt(d.highest_buy_order, 10) : null,
    lowestSell: d.lowest_sell_order ? parseInt(d.lowest_sell_order, 10) : null,
    buyGraph: graph(d.buy_order_graph),
    sellGraph: graph(d.sell_order_graph),
    buyCount: int(d.buy_order_count),
    sellCount: int(d.sell_order_count),
    at: Date.now(),
  };
}

/**
 * Full price history of an item. A saved copy is reused for Ustawienia → "pamięć danych rynku" minutes (Steam adds
 * one point an hour). Only callers that pass { remember: true } save it: a history is ~150 KB, and the bulk loops
 * (scanner, sell signals, history estimates) keep their own small results and never need the raw points again.
 * { force: true } skips the saved copy.
 */
export const priceHistory = (appid, hash, { remember = false, force = false } = {}) =>
  disk.cached(`ph|${appid}|${hash}`, force ? 0 : disk.ttl(), () => fetchPriceHistory(appid, hash), (v) => remember && v?.length > 0);
async function fetchPriceHistory(appid, hash) {
  let d;
  try {
    d = await schedule('market', () => getJSON(`${ORIGIN}/market/pricehistory/?appid=${appid}&market_hash_name=${encodeURIComponent(hash)}`));
  } catch (e) {
    if (e.status === 429) throw e;
    d = null;
  }
  if (!d?.success) {
    // new market (2026) query action
    const url = `${ORIGIN}/market/actions?q=QueryPriceHistory&qp=${encodeURIComponent(JSON.stringify([Number(appid), hash]))}`;
    const r = await schedule('market', () => fetch(url, { credentials: 'include', headers: { 'x-valve-action-type': 'queryAction' } }).then((x) => x.json()));
    const inner = r?.data?.data ?? r?.data;
    d = { success: true, prices: Array.isArray(inner) ? inner : inner?.prices || [] };
  }
  if (!d.prices?.length) throw new Error(L('steam.noPriceHistory'));
  // legacy endpoint: ["Nov 14 2026 20: +0", 4.336, "6766"]; new endpoint: {time, price_median, purchases}
  return (d.prices || []).map((p) => (Array.isArray(p)
    ? { t: Date.parse(String(p[0]).replace(/: \+0$/, ':00 +0000')), price: Math.round(p[1] * 100), vol: parseInt(p[2], 10) || 0 }
    : { t: p.time * 1000, price: Math.round(p.price_median * 100), vol: parseInt(p.purchases, 10) || 0 }));
}

export const myHistoryPage = (start, count = 500) =>
  schedule('market', () => getJSON(`${ORIGIN}/market/myhistory/render/?query=&start=${start}&count=${count}&norender=1`));

/** the HTML version, what Steam's own "My market history" tab renders (up to date, unlike norender=1) */
export const myHistoryHtmlPage = (start, count = 100) =>
  schedule('market', () => getJSON(`${ORIGIN}/market/myhistory/render/?query=&start=${start}&count=${count}&l=english`));

// ---------------------------------------------------------------- external services (NBP exchange rates)
export function gmJSON(url) {
  return new Promise((resolve, reject) => {
    if (typeof GM_xmlhttpRequest !== 'function') return reject(new Error(L('steam.gmXmlhttprequestUnavailable')));
    GM_xmlhttpRequest({
      method: 'GET',
      url,
      headers: { Accept: 'application/json' },
      timeout: 30000,
      onload: (r) => {
        if (r.status === 429) return reject(new HttpError(429, L('steam.externalServiceRequestLimitTry')));
        if (r.status >= 400) return reject(new HttpError(r.status));
        try { resolve(JSON.parse(r.responseText)); } catch { reject(new Error(L('steam.invalidResponse'))); }
      },
      onerror: () => reject(new Error(L('steam.networkError'))),
      ontimeout: () => reject(new Error('Timeout')),
    });
  });
}
