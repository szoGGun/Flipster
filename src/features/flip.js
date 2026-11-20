import * as ui from '../core/ui.js';
import * as steam from '../core/steam.js';
import * as prices from '../core/prices.js';
import * as store from '../core/store.js';
import * as disk from '../core/cache.js';
import { settings } from '../core/store.js';
import { token } from '../core/jobs.js';
import { flipReal, flipCeiling, buyPlan, holdStats, dealCheck, historyStats } from '../core/analysis.js';
import { parsePrice, toInput, esc, pct, sleep } from '../core/util.js';
import { MIN_BUYER } from '../core/fees.js';
import { RESEARCH_ITEMS } from './research-items.js';
import * as research from './research.js';
import { L, dec, locale } from '../core/i18n.js';

const watch = store.bucket('watchlist'); // hash -> {appid, added}
// items you don't want to see in the scanner: not listed and not even checked (saves requests); restored under "Ukryte"
const hidden = store.bucket('flipHidden'); // hash -> {at, appid}
let showHidden = false;
let el;
let task;
let results = new Map(); // hash -> metrics row (watchlist + scanner)
let view = 'analyze';
const sort = ui.sorter('hold');
let openBuyOrder = () => {};
export const setBuyOrderOpener = (fn) => (openBuyOrder = fn);

const CATS = [
  ['', L('flip.everything')], ['case', L('flip.cases')], ['capsule', L('flip.capsulesAndPackages')], ['tag_CSGO_Tool_Sticker', L('flip.stickers')], ['tag_CSGO_Type_Rifle', L('flip.rifles')],
  ['tag_CSGO_Type_Pistol', L('flip.pistols')], ['tag_CSGO_Type_SMG', L('flip.smgs')], ['tag_CSGO_Type_Knife', L('flip.knives')], ['tag_Type_Hands', L('flip.gloves')],
  ['tag_Type_CustomPlayer', L('flip.agents')], ['tag_CSGO_Type_Spray', 'Graffiti'], ['tag_CSGO_Type_MusicKit', L('flip.musicKits')],
];

// Steam has one type for every container (weapon cases, sticker capsules, souvenir packages, graffiti / music boxes):
// the two entries above share its tag and are told apart by name. Only weapon cases have the back-tested record.
const isCase = (hash = '') => / Case$/.test(hash) && !/Souvenir/i.test(hash);
const CAT_TAG = { case: 'tag_CSGO_Type_WeaponCase', capsule: 'tag_CSGO_Type_WeaponCase' };
const CAT_NAME = { case: isCase, capsule: (h) => !isCase(h) };

// default upper price = what you can spend right now: the wallet balance Steam reports on the page (funds still
// on hold after a sale aren't part of it). Under 1 zł (or unknown) the old 50 zł default is used.
const maxDefault = () => { const b = steam.wallet().balance; return b >= 100 ? b : 5000; };
// Keeps the "do" field equal to the current balance (re-read from Steam, at most once a minute) until you type your
// own value into it. Returns quietly when Steam doesn't answer, the field then keeps what it had.
async function syncMax() {
  const f = el?.querySelector('#s-max');
  if (!f?.dataset.auto) return;
  try { await steam.refreshWallet(); } catch { return; }
  if (f.dataset.auto) f.value = toInput(maxDefault());
}

export function mount(root) {
  el = root;
  root.innerHTML = `
    <div class="bar">
      <button class="b" data-v="analyze">🔎 ${L('flip.itemAnalysis')}</button>
      <button class="b" data-v="watch">★ ${L('flip.watchlist')}</button>
      <button class="b" data-v="scan">📡 ${L('flip.marketScanner')}</button>
      <span class="sp"></span>
      <button class="b dbg" data-a="research" title="${L('flip.downloadsFromTheSteamMarket')}">⬇ ${L('flip.dataForAnalysis')}</button>
      <button class="b dbg" data-a="sample" title="${L('flip.picksAFewHundredRandom')}">⬇ ${L('flip.marketSample')}</button>
      <button class="b" data-a="stop" hidden>■ Stop</button>
    </div>
    <section data-s="analyze">
      <div class="row2">
        <label style="position:relative">${L('flip.itemNameInEnglishOr')}<input type="text" id="f-q" style="width:420px" placeholder="${L('flip.eG')} Budapest 2025 Champions Autograph Capsule" autocomplete="off"><div id="f-sugg" class="sugg" hidden></div></label>
        <label>AppID<input type="number" id="f-app" value="730" style="width:70px"></label>
        <label>${L('flip.yourBuyPriceOptional')}<input class="p" id="f-mine" placeholder="-"></label>
        <label>${L('flip.unitsToBuy')}<input type="number" id="f-n" value="1" min="1" style="width:70px"></label>
        <button class="b go" data-a="analyze">${L('flip.analyse')}</button>
      </div>
      <div id="f-out"></div>
    </section>
    <section data-s="watch" hidden>
      <div class="row2">
        <label>${L('flip.addToWatchlist')}<input type="text" id="w-add" style="width:380px" placeholder="${L('flip.nameInEnglishOrPolish')}"></label>
        <button class="b" data-a="wadd">${L('flip.add')}</button>
        <button class="b go" data-a="wscan">${L('flip.scanWatchlist')}</button>
      </div>
      <div class="tw" id="w-table"></div>
    </section>
    <section data-s="scan" hidden>
      <div class="row2">
        <label>${L('flip.goal')}<select id="s-goal"><option value="hold">${L('flip.longTermCaseSeason')}</option><option value="flip">${L('flip.quickFlip7DayLock')}</option></select></label>
        <label>${L('flip.category')}<select id="s-cat">${CATS.map(([v, n]) => `<option value="${v}">${n}</option>`).join('')}</select></label>
        <label>${L('flip.search')}<input type="text" id="s-q" style="width:150px" placeholder="${L('flip.optional')}"></label>
        <label>${L('flip.priceFrom')}<input class="p" id="s-min" value="${toInput(100)}"></label>
        <label>${L('flip.to')}<input class="p" id="s-max" data-auto="1" value="${toInput(maxDefault())}"></label>
        <label>${L('flip.minListings')}<input type="number" id="s-list" value="100" style="width:80px"></label>
        <label data-only="hold">${L('flip.itemsToCheck')}<input type="number" id="s-n" value="40" style="width:70px"></label>
        <label data-only="flip">${L('flip.howManyToFind')}<input type="number" id="s-find" value="${esc(store.get('flipFind', '5'))}" min="0" placeholder="${L('flip.noLimit')}" style="width:92px"></label>
        <label data-only="flip">${L('flip.minSales24h')}<input type="number" id="s-vol" value="${settings.minVolume}" style="width:70px"></label>
        <label data-only="flip">Min. ROI %<input type="number" id="s-roi" value="${Math.round(settings.minRoi * 100)}" style="width:60px"></label>
        <label data-only="flip" style="flex-direction:row;align-items:center;gap:6px;padding-bottom:6px" title="${L('flip.onlyItemsWithTheFlip')}"><input type="checkbox" id="s-only" ${store.get('flipOnlyOk', true) ? 'checked' : ''}> ${L('flip.profitableOnly')}</label>
        <label data-only="flip" style="flex-direction:row;align-items:center;gap:6px;padding-bottom:6px" title="${L('flip.tickedTheScannerReusesWhat')}"><input type="checkbox" id="s-skip" ${store.get('flipSkipSeen', true) ? 'checked' : ''}> ${L('flip.useRememberedData')}</label>
        <button class="b go" data-a="scan">${L('flip.scan')}</button>
        <button class="b" data-a="sclear" title="${L('flip.removesTheResultsOfThe')}">${L('flip.clearList')}</button>
      </div>
      <details><summary>${L('flip.howDoesItWork')}</summary><div class="note" style="font-size:13px">${L('flip.theScannerTakesTheMost')}
      </div></details>
      <div class="tw" id="s-table"></div>
    </section>`;
  root.addEventListener('click', onClick);
  root.querySelector('#f-q').addEventListener('keydown', (e) => { if (e.key === 'Enter') { el.querySelector('#f-sugg').hidden = true; analyze(); } });
  // suggestions while typing, in your Steam language: picking one analyses it
  let sT = 0;
  root.querySelector('#f-q').addEventListener('input', (e) => { clearTimeout(sT); sT = setTimeout(() => suggest(e.target.value), 450); });
  root.querySelector('#f-sugg').addEventListener('click', (e) => {
    const d = e.target.closest('[data-pick]');
    if (!d) return;
    const p = JSON.parse(d.dataset.pick);
    el.querySelector('#f-q').value = p.hash;
    el.querySelector('#f-app').value = 730;
    el.querySelector('#f-sugg').hidden = true;
    analyze();
  });
  root.querySelector('#f-n').addEventListener('input', renderPlan);
  const goalSel = root.querySelector('#s-goal');
  const applyGoal = () => {
    const g = goalSel.value;
    root.querySelectorAll('[data-only]').forEach((x) => (x.hidden = x.dataset.only !== g));
  };
  goalSel.value = store.get('flipGoal2', 'hold');
  // the evidence for holding is about cases → start there
  if (goalSel.value === 'hold') root.querySelector('#s-cat').value = 'case';
  applyGoal();
  root.querySelector('#s-only').onchange = (e) => { store.set('flipOnlyOk', e.target.checked); renderScan(); };
  goalSel.onchange = () => { store.set('flipGoal2', goalSel.value); applyGoal(); renderScan(); if (view === 'watch') renderWatch(); };
  root.querySelector('#s-max').addEventListener('input', (e) => { delete e.target.dataset.auto; });
  if (loadRows()) renderScan(); // results of the last half hour, kept across page reloads
  setView(store.get('flipView', 'analyze'));
  syncMax();
}

export const show = () => {};

function setView(v) {
  view = v;
  store.set('flipView', v);
  el.querySelectorAll('section[data-s]').forEach((s) => (s.hidden = s.dataset.s !== v));
  el.querySelectorAll('[data-v]').forEach((b) => b.classList.toggle('go', b.dataset.v === v));
  if (v === 'watch') renderWatch();
}

function onClick(e) {
  const th = e.target.closest('th[data-sort]');
  if (th) { sort.click(th.dataset.sort); if (view === 'scan') renderScan(); else if (view === 'watch') renderWatch(); return; }
  const v = e.target.closest('[data-v]')?.dataset.v;
  if (v) return setView(v);
  const b = e.target.closest('button');
  if (!b) return;
  if (b.dataset.an) { el.querySelector('#f-q').value = b.dataset.an; el.querySelector('#f-app').value = b.dataset.app || 730; setView('analyze'); return analyze(); }
  if (b.dataset.w) { toggleWatch(b.dataset.w, b.dataset.app || 730); return; }
  if (b.dataset.bo) { openBuyOrder(b.dataset.bo, +b.dataset.price, b.dataset.app || 730); return; }
  if (b.dataset.hide) { hidden.set(b.dataset.hide, { at: Date.now(), appid: +(b.dataset.app || 730) }); scanSet.delete(b.dataset.hide); saveRows(); renderScan(); return; }
  if (b.dataset.unhide) { hidden.del(b.dataset.unhide); renderScan(); return; }
  ({
    analyze,
    stop: () => { task?.cancel(); research.cancelResearch(); },
    wadd: async () => { const h = el.querySelector('#w-add').value.trim(); if (!h) return; const r = await resolveHash(h); if (!r) return ui.log(L('flip.notFoundOnTheMarket', { h }), 'warn'); toggleWatch(r.hash, 730, true); el.querySelector('#w-add').value = ''; },
    wscan: () => runMetrics(Object.entries(watch.all()).map(([hash, w]) => ({ hash, appid: w.appid || 730 })), '#w-table', true),
    scan,
    sclear: clearScan,
    shidden: () => { showHidden = !showHidden; renderScan(); },
    unhideall: () => { hidden.replace({}); showHidden = false; renderScan(); },
    research: exportResearch,
    sample: () => { if (!scanning) research.exportMarketSample({ onBusy: (on) => (el.querySelector('[data-a="stop"]').hidden = !on) }); },
  })[b.dataset.a]?.();
}

function toggleWatch(hash, appid, forceAdd = false) {
  if (watch.get(hash) && !forceAdd) { watch.del(hash); ui.log(L('flip.removedFromWatchlist', { hash })); }
  else { watch.set(hash, { appid: +appid, added: Date.now() }); ui.log(L('flip.addedToWatchlist', { hash }), 'ok'); }
  if (view === 'watch') setView('watch');
  else el.querySelectorAll(`[data-w="${CSS.escape(hash)}"]`).forEach((x) => (x.textContent = watch.get(hash) ? '★' : '☆'));
}

/** market search in your Steam language (Polish names work; the answer carries the English market_hash_name) */
const searchNames = (text, count = 10, lang = steam.uiLanguage()) => steam.schedule('search', () => fetch(`${steam.ORIGIN}/market/search/render/?norender=1&appid=730&l=${lang}&query=${encodeURIComponent(text)}&search_descriptions=0&count=${count}`, { credentials: 'include' }).then((r) => (r.ok ? r.json() : null))).catch(() => null);

/**
 * A typed name, Polish, English or the market_hash_name, → { hash, name } (guess: true = no exact match, the
 * closest result); null = nothing found.
 */
async function resolveHash(text) {
  // an exact match in your language's search, then in the English one, else the closest result (guess)
  const low = text.toLowerCase();
  const exactIn = (res) => res.find((r) => r.hash_name.toLowerCase() === low || String(r.name || '').toLowerCase() === low);
  const local = (await searchNames(text, 20))?.results || [];
  let hit = exactIn(local);
  if (hit) return { hash: hit.hash_name, name: hit.name };
  const en = steam.uiLanguage() === 'english' ? [] : (await searchNames(text, 20, 'english'))?.results || [];
  hit = exactIn(en);
  if (hit) return { hash: hit.hash_name, name: hit.name };
  const first = local[0] || en[0];
  return first ? { hash: first.hash_name, name: first.name, guess: true } : null;
}

async function suggest(text) {
  const box = el.querySelector('#f-sugg');
  if (text.trim().length < 3 || parseQuery(text)) { box.hidden = true; return; }
  box.hidden = false;
  box.innerHTML = `<div class="sub">${L('flip.searching')}</div>`;
  const res = (await searchNames(text.trim()))?.results || [];
  if (el.querySelector('#f-q').value !== text) return; // typed on meanwhile
  box.innerHTML = res.length ? res.map((x) => `<div data-pick="${esc(JSON.stringify({ hash: x.hash_name }))}"><img src="https://community.cloudflare.steamstatic.com/economy/image/${esc(x.asset_description?.icon_url || '')}/62fx62f"><span style="color:#${esc(x.asset_description?.name_color || 'c6d4df')}">${esc(x.hash_name || x.name)}</span><span class="p2">${esc(x.sell_price_text || '')}</span></div>`).join('') : `<div class="sub">${L('flip.nothingFound')}</div>`;
}

const parseQuery = (q) => {
  const m = q.match(/market\/listings\/(\d+)\/([^?#]+)/);
  if (m) return { appid: m[1], hash: decodeURIComponent(m[2]) };
  return null;
};

// ---------------------------------------------------------------- shared metrics
const feeMult = () => { const w = steam.wallet(); return 1 + (w.feePercent ?? 0.05) + (w.pubDefault ?? 0.1); };
const net = (p) => steam.receivedFromBuyer(p);
const sp = (x, d = 0) => (x == null || !isFinite(x) ? '-' : (x > 0 ? '+' : '') + pct(x, d)); // signed percent
const cls = (x) => (x == null ? '' : x > 0 ? 'pos' : x < 0 ? 'neg' : '');
const medianOf = (a) => { if (!a.length) return null; const s = [...a].sort((x, y) => x - y); return s[Math.floor((s.length - 1) / 2)]; };
const goalNow = () => el?.querySelector('#s-goal')?.value || 'hold';

function metricsRow(hash, appid, h, po, st, hist) {
  const vol = st?.vol24 ?? po?.volume ?? null; // Steam 24h sales; null = unknown (history not fetched / failed)
  const fr = hist ? flipReal({ buyGraph: h.buyGraph, sellGraph: h.sellGraph, points: hist, net }) : null;
  const hs = hist ? holdStats(hist, feeMult()) : null;
  return {
    hash, appid, h, vol, st, fr, hs,
    holdScore: hs?.winter && hs.winter.n >= 3 ? hs.winter.med * hs.winter.win * 100 : null,
    at: Date.now(),
  };
}

/** is this item a candidate to buy and hold? Based on its own record + the two things that mattered in the back-test */
function holdVerdict(r) {
  const hs = r.hs;
  if (!hs) return { k: 'none', label: L('flip.noHistory'), c: 'mut', why: L('flip.steamReturnedNoPriceHistory') };
  if (hs.ageDays < 365) return { k: 'new', label: L('flip.newItem'), c: 'bad', why: L('flip.itHasBeenOnThe') };
  if (r.h?.lowestSell && r.h.lowestSell < 100) return { k: 'cheap', label: L('flip.tooCheap'), c: 'bad', why: L('flip.below1ZTheMinimum') };
  let rec = hs.winter ? L('flip.wintersInProfitOfTypically', { wins: hs.winter.wins, n: hs.winter.n, med: sp(hs.winter.med) }) : '';
  if (isCase(r.hash)) {
    // walk-forward on 36 cases / 161 winters (2026-11-15): age told winners from losers, under 4 years 54% of
    // winters were profitable (typically +13%), older 82% (+39%). The case's own winter record did not: the cases
    // the old "≥3 winters, ≥70% won" gate rejected did no worse than the ones it accepted.
    const age = dec(hs.ageDays / 365, 1);
    if (hs.ageDays < 4 * 365) return { k: 'young', label: L('flip.tooYoung'), c: 'mid', why: L('flip.onTheMarketForYears', { age }) };
    rec = L('flip.theCaseIsYearsOld', { age, rec });
  } else {
    if (!hs.winter || hs.winter.n < 3) return { k: 'short', label: L('flip.historyTooShort'), c: 'mut', why: L('flip.lessThan3WintersOf') };
    if (!(hs.winter.win >= 0.7 && hs.winter.med > 0.1)) return { k: 'weak', label: L('flip.weakHistory'), c: 'bad', why: L('flip.thatsTooLittleToCount', { rec }) };
  }
  if (r.vol != null && r.vol < 20) return { k: 'thin', label: L('flip.lowVolume'), c: 'mid', why: L('flip.butOnlyUnitsSellA', { rec, vol: r.vol }) };
  if (hs.trend30 != null && hs.trend30 < -0.1) return { k: 'wait', label: L('flip.waitItsFalling'), c: 'mid', why: L('flip.butThePriceFellIn', { rec, trend30: pct(-hs.trend30, 0) }) };
  return { k: 'ok', label: L('flip.candidate'), c: 'ok', why: L('flip.thePriceIsntDroppingSharply', { rec }) };
}

const MIN_FILL_WEEK = 10; // units that must have traded at or below the order price in 7 days, else the order mostly just sits
/** short flip (you can resell only after the 7-day lock) */
function flipVerdict(r) {
  const fr = r.fr, sig = r.hs?.sigmaWeek;
  if (!fr) return { k: 'none', label: L('flip.noData'), c: 'mut', reasons: [L('flip.noOrderBookOrPrice')] };
  const reasons = [];
  if (fr.profit <= 0) reasons.push(fr.sell24 > fr.sell && net(fr.sell24) > fr.buy ? L('flip.theresAProfitOnlyAt', { sell24: steam.fmt(fr.sell24), sell: steam.fmt(fr.sell) }) : L('flip.atThePriceSalesActually'));
  if (fr.fill7 === 0) reasons.push(L('flip.inTheLast7Days'));
  if (r.vol != null && r.vol < settings.minVolume) reasons.push(L('flip.lowVolume24h', { vol: r.vol }));
  if (fr.profit > 0 && fr.roi < settings.minRoi) reasons.push(L('flip.profitBelow', { minRoi: Math.round(settings.minRoi * 100) }));
  if (fr.profit > 0 && !reasons.length) {
    if (fr.week < MIN_FILL_WEEK) return { k: 'slow', label: L('flip.rarelyFills'), c: 'mid', reasons: [L('flip.inTheLast7Days2', { week: fr.week, MIN_FILL_WEEK })] };
    if (sig != null && fr.roi < sig) return { k: 'risk', label: L('flip.risky'), c: 'mid', reasons: [L('flip.theProfitIsSmallerThan', { roi: sp(fr.roi, 1), sig: pct(sig, 1) })] };
    return { k: 'ok', label: L('flip.flipPossible'), c: 'ok', reasons: [L('flip.unitAfterTheFeeRemember', { profit: steam.fmt(fr.profit) })] };
  }
  return { k: 'no', label: L('flip.flipDoesntPay'), c: 'bad', reasons };
}

const winterTitle = (hs) => (hs?.winters?.length ? L('flip.bought2229NovemberSold') + hs.winters.map((w) => `${w.y}/${String(w.y + 1).slice(2)}: ${sp(w.r)}`).join('\n') : '');

// ---------------------------------------------------------------- single item analysis
async function analyze() {
  let hash = el.querySelector('#f-q').value.trim();
  let appid = el.querySelector('#f-app').value || 730;
  const pq = parseQuery(hash);
  if (pq) { ({ hash, appid } = pq); el.querySelector('#f-q').value = hash; el.querySelector('#f-app').value = appid; }
  if (!hash) return;
  // a name in Polish (or any non-market spelling) → the market_hash_name; known names (from the lists) need no search
  if (!pq && +appid === 730 && !results.has(hash) && !store.get('itemMeta', {})[hash]) {
    const r = await resolveHash(hash);
    if (!r) { el.querySelector('#f-out').innerHTML = `<div class="empty">${L('flip.noItemFoundOnThe', { hash: esc(hash) })}</div>`; return; }
    if (r.hash !== hash) { ui.log(`${L('flip.analysis')}: ${L('flip.is', { hash })} ${r.name}${r.name !== r.hash ? ` (${r.hash})` : ''}${r.guess ? L('flip.closestMatch') : ''}`); hash = r.hash; el.querySelector('#f-q').value = hash; }
  }
  const mine = parsePrice(el.querySelector('#f-mine').value);
  const out = el.querySelector('#f-out');
  out.innerHTML = `<div class="empty"><span class="spin"></span>${L('flip.analysingOrdersVolumePriceHistory')}</div>`;
  try {
    const [h, po, hist] = await Promise.all([
      prices.hist(appid, hash),
      prices.steamPrice(appid, hash).catch(() => null),
      steam.priceHistory(appid, hash, { remember: true }).catch((e) => { ui.log(L('flip.priceHistory') + e.message, 'warn'); return []; }),
    ]);
    const st = historyStats(hist);
    const row = metricsRow(hash, appid, h, po, st, hist.length ? hist : null);
    results.set(hash, row);
    const { fr, hs } = row;
    lastAn = { h, hist, fr };
    const fv = flipVerdict(row), hv = holdVerdict(row);
    const sell = fr?.sell ?? Math.max(MIN_BUYER, h.lowestSell - 1);
    const deal = !isNaN(mine) ? {
      now: dealCheck({ price: mine, sellPrice: sell, wallet: steam.wallet() }),
      med: st.med7 ? dealCheck({ price: mine, sellPrice: st.med7, wallet: steam.wallet() }) : null,
    } : null;

    const sell30 = hist.filter((p) => p.t > Date.now() - 30 * 86400000);
    const chart = ui.lineChart([
      { points: sell30.map((p) => [p.t, p.price]), color: '#66c0f4', label: L('flip.salePrice') },
      ...(fr ? [{ points: [[sell30[0]?.t || Date.now() - 2592000000, fr.bid], [Date.now(), fr.bid]], color: '#a4d007', dash: true, label: L('flip.buyOrdersNow') }] : []),
      ...(h.lowestSell ? [{ points: [[sell30[0]?.t || Date.now() - 2592000000, h.lowestSell], [Date.now(), h.lowestSell]], color: '#e5b84c', dash: true, label: L('flip.lowestListingNow') }] : []),
    ], { fmtY: (x) => steam.fmt(Math.round(x)), bars: sell30.map((p) => [p.t, p.vol]) });

    const depth = (g, n = 6) => g.slice(0, n).map(([p, c], i) => `<tr><td>${steam.fmt(p)}</td><td>${c - (i ? g[i - 1][1] : 0)}</td><td class="sub">${c}</td></tr>`).join('');
    const m = store.get('itemMeta', {})[hash];
    const box = (k, v, sub = '', c = '') => `<div class="card"><div class="k">${k}</div><div class="v ${c}">${v}</div>${sub ? `<div class="sub">${sub}</div>` : ''}</div>`;

    out.innerHTML = `
      <div class="row2" style="align-items:center">
        ${ui.itemCell({ hash, name: m?.name || hash, icon: m?.icon, color: m?.color, appid })}
        <span class="sp" style="flex:1"></span>
        <button class="b" data-w="${esc(hash)}" data-app="${appid}">${watch.get(hash) ? '★' : '☆'} ${L('flip.watch')}</button>
        ${fr ? `<button class="b go" data-bo="${esc(hash)}" data-price="${fr.buy}" data-app="${appid}" title="${L('flip.anOrderACentAbove')}">${L('flip.placeBuyOrder')} ${steam.fmt(fr.buy)}</button>` : ''}
      </div>

      <div class="sec-h"><span>${L('flip.longTerm')}</span> <span class="chipst ${hv.c}" style="margin-left:8px">${esc(hv.label)}</span></div>
      <div class="note">${esc(hv.why)}</div>
      ${hs ? `<div class="cards">
        ${box(L('flip.wintersNovToMay'), hs.winter ? `${hs.winter.wins}/${hs.winter.n} ${L('flip.inProfit')}` : '-', hs.winter ? L('flip.typicallyAfterTheFee', { med: sp(hs.winter.med) }) : L('flip.historyTooShort'), hs.winter ? cls(hs.winter.med) : '')}
        ${box(L('flip.after1Year'), hs.y1 ? `${pct(hs.y1.win, 0)} ${L('flip.inProfit')}` : '-', hs.y1 ? L('flip.typicallyPeriods', { med: sp(hs.y1.med), n: hs.y1.n }) : '', hs.y1 ? cls(hs.y1.med) : '')}
        ${box(L('flip.after2Years'), hs.y2 ? `${pct(hs.y2.win, 0)} ${L('flip.inProfit')}` : '-', hs.y2 ? L('flip.typicallyPeriods', { med: sp(hs.y2.med), n: hs.y2.n }) : '', hs.y2 ? cls(hs.y2.med) : '')}
        ${box(L('flip.vs1YearAvg'), sp(hs.vsYear), L('flip.priceNowAgainstThe12'), cls(hs.vsYear))}
        ${box(L('flip.30Days'), sp(hs.trend30), L('flip.priceChangeOverTheLast'), cls(hs.trend30))}
      </div>
      ${hs.winters.length ? `<div class="note" style="padding-top:0">${L('flip.bought2229NovemberSold2')}: ${hs.winters.map((w) => `<span class="tag" style="margin:2px">${w.y}/${String(w.y + 1).slice(2)} <b class="${cls(w.r)}">${sp(w.r)}</b></span>`).join('')}</div>` : ''}` : ''}

      <div class="sec-h"><span>${L('flip.quickFlipSoldAfterThe')}</span> <span class="chipst ${fv.c}" style="margin-left:8px">${esc(fv.label)}</span></div>
      <div class="note">${fv.reasons.map(esc).join(' · ')}</div>
      <div class="cards">
        ${box(L('flip.buyOrder'), fr ? steam.fmt(fr.buy) : '-', L('flip.topOfTheBookOrders', { highestBuy: steam.fmt(h.highestBuy), buyCount: h.buyCount }))}
        ${box(L('flip.sellActualSales'), fr ? steam.fmt(fr.sell) : '-', `${fr && fr.sell24 > fr.sell ? `<span class="warn">${L('flip.todayICountTheTypical', { sell24: steam.fmt(fr.sell24) })}</span> · ` : ''}${L('flip.lowestListingListings', { lowestSell: steam.fmt(h.lowestSell), sellCount: h.sellCount })}`)}
        ${box(L('flip.profitUnitFlip'), fr ? steam.fmt(fr.profit) : '-', fr ? L('flip.youGetBuy', { net: steam.fmt(fr.net), buy: steam.fmt(fr.buy) }) : '', fr ? cls(fr.profit) : '')}
        ${box('ROI', fr ? sp(fr.roi, 1) : '-', L('flip.afterTheFee'), fr ? cls(fr.roi) : '')}
        ${box(L('flip.weeklySwing'), hs?.sigmaWeek != null ? `±${pct(hs.sigmaWeek, 1)}` : '-', L('flip.typicalPriceChangeIn7'))}
        ${box(L('flip.fillChance'), fr ? `${fr.week} ${L('flip.pcs')}` : '-', fr ? L('flip.soldIn7DaysAt', { fill7: pct(fr.fill7, 0) }) : '', fr && fr.week < MIN_FILL_WEEK ? 'warn' : '')}
        ${box(L('flip.volume'), `${st.vol24 || po?.volume || 0}<span class="sub"> /24h</span>`, L('flip.7Days', { vol7: st.vol7 }))}
        ${box(L('flip.median7dAvg30d'), steam.fmt(st.med7), `30d: ${steam.fmt(st.avg30)} · min/max 7d ${steam.fmt(st.min7)}-${steam.fmt(st.max7)}`)}
        ${box(L('flip.breakEven'), fr ? steam.fmt(steam.buyerFromReceived(fr.buy)) : '-', L('flip.minSalePriceToCome'))}
      </div>
      <div id="f-plan"></div>
      ${deal ? `<div class="note" style="font-size:13px">${L('flip.yourPurchaseForSellingNow', { mine: steam.fmt(mine), sell: steam.fmt(sell), net: steam.fmt(deal.now.net) })} <b class="${deal.now.profit >= 0 ? 'pos' : 'neg'}">${steam.fmt(deal.now.profit)} (${pct(deal.now.roi)})</b>${deal.med ? `${L('flip.atThe7dMedian')} <b class="${deal.med.profit >= 0 ? 'pos' : 'neg'}">${steam.fmt(deal.med.profit)}</b>` : ''}. ${L('flip.toComeOutEvenList')} <b>${steam.fmt(deal.now.breakEven)}</b>.</div>` : ''}
      <div style="padding:0 14px">${chart}</div>`;
    renderPlan();
    const bookHead = `<tr><th>${L('flip.price')}</th><th>${L('flip.qty')}</th><th>${L('flip.cumul')}</th></tr>`;
    out.insertAdjacentHTML('beforeend', `
      <div class="row2" style="align-items:flex-start">
        <div><div class="sub">${L('flip.buyOrders')}</div><table style="width:auto">${bookHead}${depth(h.buyGraph)}</table></div>
        <div><div class="sub">${L('flip.sellListings')}</div><table style="width:auto">${bookHead}${depth(h.sellGraph)}</table></div>
      </div>`);
  } catch (e) {
    out.innerHTML = `<div class="empty err">${esc(e.message)}</div>`;
  }
}

// ---------------------------------------------------------------- "up to what price is it worth buying?"
let lastAn = null; // data of the analysed item, so changing the quantity doesn't ask Steam again
function renderPlan() {
  const box = el.querySelector('#f-plan');
  if (!box || !lastAn) return;
  const { h, hist, fr } = lastAn;
  const qty = Math.max(1, Math.min(1000, Math.floor(+el.querySelector('#f-n').value) || 1));
  const sell = fr?.sell ?? (h.lowestSell ? Math.max(MIN_BUYER, h.lowestSell - 1) : null);
  const p = sell ? buyPlan({ buyGraph: h.buyGraph, sellGraph: h.sellGraph, points: hist, net, sell, from: fr?.buy, qty, minRoi: settings.minRoi }) : null;
  if (!p) { box.innerHTML = ''; return; }
  const n = p.now;
  const szt = `${qty} ${L('flip.pcs')}`;
  const nowTxt = n.short != null
    ? L('flip.youCantBuyRightAway', { szt, listed: n.listed })
    : L('flip.rightAwaySetTheOrder', { szt, price: steam.fmt(n.price), total: steam.fmt(n.total), qty: qty > 1 ? L('flip.onAverageAUnitEach', { avg: steam.fmt(Math.round(n.avg)) }) : '' })
      + ` <b class="${cls(n.profit)}">${steam.fmt(n.profit)} (${sp(n.roi, 1)})</b>.${p.cheap ? ` ${L('flip.listingsAtOrCheaper', { maxRoi: steam.fmt(p.maxRoi) })} <b>${p.cheap}</b>.` : ''}`;
  const mark = (x) => (x.price === p.maxZero ? L('flip.breakEven2') : x.price === p.maxRoi ? L('flip.highestWithProfit', { minRoi: Math.round(settings.minRoi * 100) }) : x.price === fr?.buy ? L('flip.justAboveTheOrdersIn') : '');
  box.innerHTML = `
    <div class="sec-h"><span>${L('flip.upToWhatPriceTo')}</span> <span class="sub" style="margin-left:8px">${L('flip.sellingAtYouGet', { sell: steam.fmt(p.sell), got: steam.fmt(p.got) })}</span></div>
    <div class="note">${L('flip.itPaysToBuyUp', { maxRoi: steam.fmt(p.maxRoi), minRoi: Math.round(settings.minRoi * 100), maxZero: steam.fmt(p.maxZero) })} ${nowTxt}</div>
    <table style="width:auto;margin:0 14px 10px"><thead><tr><th>${L('flip.orderPrice')}</th><th>${L('flip.profitUnit')}</th><th>${L('flip.soldThisCheap7Days')}</th><th>${L('flip.ordersAheadOfYou')}</th><th>${L('flip.inAbout', { szt })}</th><th></th></tr></thead><tbody>
    ${p.ladder.map((x) => `<tr style="${x.price === p.maxRoi ? 'background:rgba(164,208,7,.08)' : ''}">
      <td><b>${steam.fmt(x.price)}</b></td>
      <td class="${cls(x.profit)}">${steam.fmt(x.profit)} <span class="sub">${sp(x.roi, 1)}</span></td>
      <td>${x.week} ${L('flip.pcs')} <span class="sub">${pct(x.share, 0)} ${L('flip.ofVolume')}</span></td>
      <td>${x.ahead}</td>
      <td>${x.days == null ? `<span class="neg">${L('flip.nobodySoldThisCheap')}</span>` : x.days < 1 ? L('flip.lessThanADay') : x.days > 60 ? `<span class="warn">${L('flip.over2Months')}</span>` : L('flip.days', { days: Math.ceil(x.days) })}</td>
      <td class="sub">${mark(x)}</td></tr>`).join('')}
    </tbody></table>
    <div class="note" style="padding-top:0">${L('flip.theTimeIsAnEstimate')}</div>`;
}

// ---------------------------------------------------------------- batch metrics (watchlist / scanner)
async function runMetrics(list, target, isWatch, preFilter = null) {
  if (!list.length) return ui.log(L('flip.noItemsToCheck'), 'warn');
  task = token();
  el.querySelector('[data-a="stop"]').hidden = false;
  let i = 0, lastRender = 0;
  for (const { hash, appid } of list) {
    if (task.cancelled) break;
    ui.progress(++i, list.length);
    try {
      // order book + full price history from Steam, in parallel (two request lanes)
      const [h, hist] = await Promise.all([
        prices.hist(appid, hash, 5 * 60000),
        steam.priceHistory(appid, hash).catch(() => null),
      ]);
      if (preFilter && !preFilter(h)) continue;
      results.set(hash, metricsRow(hash, appid, h, null, hist ? historyStats(hist) : null, hist));
      if (Date.now() - lastRender > 400 || i === list.length) { lastRender = Date.now(); isWatch ? renderWatch() : renderScan(); }
    } catch (e) {
      ui.log(`${hash}: ${e.message}`, 'err');
      if (e.status === 429) { ui.log(L('flip.steamLimitStoppedTryAgain'), 'warn'); break; }
    }
  }
  ui.progress(0);
  el.querySelector('[data-a="stop"]').hidden = true;
  isWatch ? renderWatch() : renderScan();
  saveRows(true);
}

const HOLD_KEYS = new Set(['name', 'sell', 'winter', 'y1', 'y2', 'vsyear', 'trend', 'vol', 'hold']);
const FLIP_KEYS = new Set(['name', 'verdict', 'buy', 'sell', 'profit', 'roi', 'sigma', 'fill', 'vol']);
function fixSort(goal) {
  if (goal === 'hold' && !HOLD_KEYS.has(sort.key)) sort.set('hold');
  if (goal === 'flip' && !FLIP_KEYS.has(sort.key)) sort.set('roi');
}

/** where we are in the yearly cycle + what the scanned cases are doing right now */
function seasonNote(rows) {
  const m = new Date().getMonth() + 1;
  const txt = [11, 12, 1, 2].includes(m)
    ? L('flip.buyingSeasonNovemberToFebruary')
    : m >= 4 && m <= 8
      ? L('flip.sellingSeasonAprilToAugust')
      : L('flip.inBetweenHistoricallyItWas');
  const cs = rows.filter((r) => r.hs && r.hs.ageDays >= 365 && / Case$/.test(r.hash));
  const t = medianOf(cs.map((r) => r.hs.trend30).filter((x) => x != null)), y = medianOf(cs.map((r) => r.hs.vsYear).filter((x) => x != null));
  const mk = cs.length >= 3 && t != null
    ? L('flip.oldCasesInThisScan', { t: cls(t), t2: sp(t), y: cls(y), y2: sp(y) })
      + (t < -0.1 ? L('flip.theMarketIsStillFalling') : '')
    : '';
  return `${txt}${mk} <span class="sub">${L('flip.numbersFromResearchOn108')}</span>`;
}

let scanSet = new Set();

/**
 * "Wyczyść listę": the scanner list starts empty (a running scan is stopped); watched and hidden items stay. The rows
 * themselves stay in memory for their 30 minutes, so a new scan that meets them doesn't ask Steam again.
 */
function clearScan() {
  if (scanning) task?.cancel();
  scanSet = new Set();
  findState = null;
  saveRows(true);
  renderScan();
  ui.log(L('flip.scannerListCleared'));
}

/** the "Ukryte (N)" switch and, when open, the hidden items with a restore button each */
function hiddenNote() {
  const all = Object.keys(hidden.all());
  if (!all.length) return '';
  const meta = store.get('itemMeta', {});
  const btn = `<button class="b s" data-a="shidden" title="${L('flip.itemsYouHidWithThe')}">${showHidden ? '▾' : '▸'} ${L('flip.hidden')} (${all.length})</button>`;
  if (!showHidden) return `${btn}<br>`;
  return `${btn} <button class="b s" data-a="unhideall">${L('flip.restoreAll')}</button>
    <div style="display:flex;flex-wrap:wrap;gap:4px;margin:6px 0">${all.map((h) => `<span class="chipst mut" style="display:inline-flex;align-items:center;gap:4px">${esc(meta[h]?.name || h)}<button class="b s" data-unhide="${esc(h)}" title="${L('flip.restoreToTheScanner')}" style="padding:0 5px;line-height:1.4">↺</button></span>`).join('')}</div>`;
}

function renderScan() {
  const goal = goalNow();
  fixSort(goal);
  const minVol = +el.querySelector('#s-vol').value || 0;
  const minRoi = (+el.querySelector('#s-roi').value || 0) / 100;
  settings.minVolume = minVol;
  settings.minRoi = minRoi;
  const rows = [...results.values()].filter((r) => scanSet.has(r.hash) && !hidden.get(r.hash));
  if (goal === 'hold') {
    const ok = (r) => holdVerdict(r).k === 'ok';
    const wait = rows.filter((r) => holdVerdict(r).k === 'wait').length;
    renderTable('#s-table', rows, false, `${hiddenNote()}${ageNote(rows)}${seasonNote(rows)}<br>${L('flip.ofAreCandidates', { ok: rows.filter(ok).length, rows: rows.length, wait: wait ? L('flip.haveAGoodHistoryBut', { wait }) : '' })}`, ok, 'hold');
    return;
  }
  const ok = (r) => flipVerdict(r).k === 'ok';
  const fd = findState;
  const onlyOk = el.querySelector('#s-only').checked;
  // (not "hidden": that name is the ✕ list used above, a local one would hide it and break this function as soon as a row exists)
  const notOk = onlyOk ? rows.filter((r) => !ok(r)).length : 0;
  const FIND_STATE = {
    run: `<span class="acc"><span class="spin"></span>${L('flip.stillSearching')}</span>`,
    stop: `<span class="ok">${L('flip.done')}</span>`,
    end: L('flip.endOfTheListThere'),
    cancel: L('flip.stoppedScanResumes'),
    stall: `<span class="warn">${L('flip.steamStoppedReturningTheList')}</span>`,
    limit: `<span class="warn">${L('flip.steamIsLimitingRequestsTry')}</span>`,
    error: `<span class="err">${L('flip.error')}</span>`,
  };
  const progress = fd ? L('flip.foundChecked', { found: fd.found, checked: fd.checked, want: fd.want === Infinity ? '' : L('flip.of', { want: fd.want }), total: fd.walk?.total ? L('flip.positionOfOnSteamsList', { pos: fd.walk.pos, total: fd.walk.total }) : '', risky: fd.risky ? L('flip.risky2', { risky: fd.risky, onlyOk: onlyOk ? L('flip.hiddenUntickProfitableOnly') : L('flip.onTheListGreyedOut') }) : '', skipped: fd.skipped ? L('flip.skippedCheckedRecently', { skipped: fd.skipped }) : '', failed: fd.failed ? L('flip.withoutData', { failed: fd.failed }) : '' }) + ` · ${FIND_STATE[fd.state]}<br>` : '';
  const empty = fd ? (fd.state === 'run' ? L('flip.nothingPassedSoFarStill') : notOk ? L('flip.noItemGotTheFlip') : L('flip.noCheckedItemPassedLower')) : L('flip.setTheFiltersAndClick');
  const rule = L('flip.anItemPassesWithA', { minRoi: Math.round(minRoi * 100), MIN_FILL_WEEK, minVol });
  renderTable('#s-table', onlyOk ? rows.filter(ok) : rows, false, `${hiddenNote()}${ageNote(rows)}${progress}${rule}`, ok, 'flip', empty);
}
function renderWatch() {
  const goal = goalNow();
  fixSort(goal);
  renderTable('#w-table', [...results.values()].filter((r) => watch.get(r.hash)), true, '', goal === 'hold' ? (r) => holdVerdict(r).k === 'ok' : null, goal);
}

function renderTable(target, rows, isWatch, header = '', good = null, goal = 'flip', empty = L('flip.setTheFiltersAndClick')) {
  const hold = goal === 'hold';
  const sorted = sort.apply(rows, {
    name: (r) => r.hash, sell: (r) => (hold ? r.h?.lowestSell : r.fr?.sell), vol: (r) => r.vol,
    buy: (r) => r.fr?.buy, profit: (r) => r.fr?.profit, roi: (r) => r.fr?.roi, sigma: (r) => r.hs?.sigmaWeek, fill: (r) => r.fr?.fill7,
    winter: (r) => (r.hs?.winter ? r.hs.winter.win + r.hs.winter.med / 100 : null), y1: (r) => r.hs?.y1?.med, y2: (r) => r.hs?.y2?.med,
    vsyear: (r) => r.hs?.vsYear, trend: (r) => r.hs?.trend30, hold: (r) => r.holdScore,
    verdict: (r) => ({ ok: 4, risk: 3, slow: 2, no: 1, none: 0 }[flipVerdict(r).k] * 10 + (r.fr?.roi ?? -1)), // best verdict first, then ROI
  });
  const th = (k, t) => `<th data-sort="${k}">${t}${sort.arrow(k)}</th>`;
  const meta = store.get('itemMeta', {});
  const head = hold
    ? `${th('name', L('flip.item'))}${th('hold', L('flip.verdict'))}${th('sell', L('flip.priceNow'))}${th('winter', L('flip.wintersNovToMay'))}${th('y1', L('flip.after1Year'))}${th('y2', L('flip.after2Years'))}${th('vsyear', L('flip.vs1YearAvg'))}${th('trend', L('flip.30Days'))}${th('vol', L('flip.volume24h'))}<th></th>`
    : `${th('name', L('flip.item'))}${th('verdict', L('flip.verdict'))}${th('profit', L('flip.profitUnit2'))}${th('roi', 'ROI')}${th('buy', L('flip.buyOrder'))}${th('sell', L('flip.sellActualSales'))}${th('sigma', L('flip.weeklySwing'))}${th('fill', L('flip.fillChance'))}${th('vol', L('flip.volume24h'))}<th></th>`;
  const cols = 10;
  const volCell = (r) => `<td>${r.vol == null ? '<span class="sub">?</span>' : r.vol}</td>`;
  const rec = (x) => (x ? `<b>${pct(x.win, 0)}</b> <span class="${cls(x.med)}">${sp(x.med)}</span>` : '<span class="sub">-</span>');
  const actions = (r) => `<td style="white-space:nowrap"><button class="b s" data-an="${esc(r.hash)}" data-app="${r.appid}">${L('flip.analysis')}</button>
        <button class="b s" data-w="${esc(r.hash)}" data-app="${r.appid}" title="${L('flip.watch')}">${watch.get(r.hash) ? '★' : '☆'}</button>
        ${r.fr ? `<button class="b s" data-bo="${esc(r.hash)}" data-price="${r.fr.buy}" data-app="${r.appid}" title="${L('flip.placeABuyOrderFor', { buy: steam.fmt(r.fr.buy) })}">${L('flip.order')}</button>` : ''}
        ${isWatch ? '' : `<button class="b s" data-hide="${esc(r.hash)}" data-app="${r.appid}" title="${L('flip.hideItTheScannerWont')}">✕</button>`}</td>`;
  el.querySelector(target).innerHTML = (header ? `<div class="note">${header}</div>` : '') + `<table><thead><tr>${head}</tr></thead><tbody>${sorted.length ? sorted.map((r) => {
      const m = meta[r.hash] || {};
      const ok = good ? good(r) : true;
      const name = `<td>${ui.itemCell({ hash: r.hash, name: m.name || r.hash, icon: m.icon || r.icon, color: m.color, appid: r.appid })}</td>`;
      const hs = r.hs, fr = r.fr;
      let body;
      if (hold) {
        const v = holdVerdict(r);
        body = `${name}<td><span class="chipst ${v.c}" title="${esc(v.why)}">${esc(v.label)}</span></td><td>${steam.fmt(r.h?.lowestSell)}</td>
          <td title="${esc(winterTitle(hs))}">${hs?.winter ? `<b>${hs.winter.wins}/${hs.winter.n}</b> <span class="${cls(hs.winter.med)}">${sp(hs.winter.med)}</span>` : '<span class="sub">-</span>'}</td>
          <td>${rec(hs?.y1)}</td><td>${rec(hs?.y2)}</td>
          <td class="${cls(hs?.vsYear)}">${sp(hs?.vsYear)}</td><td class="${cls(hs?.trend30)}">${sp(hs?.trend30)}</td>${volCell(r)}`;
      } else {
        const sig = hs?.sigmaWeek;
        const v = flipVerdict(r);
        body = `${name}<td><span class="chipst ${v.c}" title="${esc(v.reasons.join(' · '))}">${esc(v.label)}</span></td>
          <td class="${fr ? cls(fr.profit) : ''}"><b>${fr ? steam.fmt(fr.profit) : '-'}</b></td><td class="${fr ? cls(fr.roi) : ''}">${fr ? sp(fr.roi, 1) : '-'}</td>
          <td>${fr ? steam.fmt(fr.buy) : '-'}</td>
          <td${fr && fr.sell24 > fr.sell ? ` title="${L('flip.todaySalesGoAtBut', { sell24: steam.fmt(fr.sell24) })}"` : ''}>${fr ? `${steam.fmt(fr.sell)}<div class="sub">${L('flip.youGet')} ${steam.fmt(fr.net)}${fr.sell24 > fr.sell ? ` · ${L('flip.today')} ${steam.fmt(fr.sell24)}` : ''}</div>` : '-'}</td>
          <td class="${fr && sig != null && fr.roi > 0 && fr.roi < sig ? 'warn' : ''}">${sig != null ? '±' + pct(sig, 1) : '-'}</td>
          <td class="${fr && fr.week === 0 ? 'neg' : fr && fr.week < MIN_FILL_WEEK ? 'warn' : ''}">${fr ? `${fr.week} ${L('flip.pcs')}<div class="sub">${pct(fr.fill7, 0)} ${L('flip.ofVolume')}</div>` : '-'}</td>${volCell(r)}`;
      }
      return `<tr style="${good && !ok ? 'opacity:.55' : ''}">${body}${actions(r)}</tr>`;
    }).join('') : `<tr><td colspan="${cols}" class="empty">${isWatch ? (Object.keys(watch.all()).length ? `${L('flip.youWatchClickScanWatchlist', { watch: Object.keys(watch.all()).length })}: ${Object.keys(watch.all()).slice(0, 8).map(esc).join(', ')}${Object.keys(watch.all()).length > 8 ? '…' : ''}` : L('flip.addItemsToTheWatchlist')) : esc(empty)}</td></tr>`}</tbody></table>`;
}

/**
 * Popular items of the chosen category inside the price range, straight from Steam's market search, page by page.
 * fn(candidate, { pos, total }) is awaited for every match; returning false stops the walk.
 * Returns 'end' (whole list walked), 'stop' (fn said so), 'cancel', or 'stall': Steam stopped answering in the
 * middle of the list. Steam does that under load, an empty page with total_count 0 that looks exactly like the end
 * of the list, so an empty page before the known total is asked for again (after 5, 15, 30, 60 s) instead of trusted.
 */
async function eachCandidate({ cat, nameOk, q, min, max, minListings, fresh }, fn, info = {}) {
  let rate = null; // search/render answers in USD → one priceoverview call gives the conversion rate
  const meta = store.bucket('itemMeta');
  // own lane (the one the cases tab uses for the same endpoint), so paging doesn't slow the price-history requests
  // a page of the list is reused for a few minutes (Ustawienia → pamięć danych rynku), but never an empty one
  const page = (start) => {
    const path = `/market/search/render/?norender=1&appid=730&l=${steam.uiLanguage()}&start=${start}&count=100&search_descriptions=0&sort_column=popular&sort_dir=desc&query=${encodeURIComponent(q)}${cat ? `&category_730_Type[]=${cat}` : ''}`;
    return disk.cached('q|' + path, fresh ? 0 : disk.ttl(), () => steam.schedule('search', async () => {
      const r = await fetch(steam.ORIGIN + path, { credentials: 'include' });
      if (r.status === 429) throw new steam.HttpError(429, L('flip.steamTooManyRequests429'));
      if (!r.ok) return null;
      try { return disk.slimSearch(await r.json()); } catch { return null; }
    }), (d) => d?.results?.length > 0);
  };
  const WAIT = [5, 15, 30, 60];
  let total = Infinity, start = 0, empties = 0;
  while (start < total) {
    if (task.cancelled) return 'cancel';
    if (info.stop?.()) return 'stop';
    const d = await page(start);
    const res = d?.results || [];
    if (d?.total_count > 0) total = d.total_count; // an empty answer says 0, keep the last real total
    info.pos = start; info.total = total === Infinity ? null : total;
    if (!res.length) {
      if (start === 0 && empties >= 1) return 'end'; // really nothing matches the search
      if (empties >= WAIT.length) return 'stall';
      const secs = WAIT[empties++];
      if (start > 0) ui.log(L('flip.scannerSteamReturnedAnEmpty', { start, secs, total: info.total ? L('flip.of2', { total: info.total }) : '' }), 'warn');
      for (let i = 0; i < secs && !task.cancelled && !info.stop?.(); i++) await sleep(1000);
      continue;
    }
    empties = 0;
    if (rate == null) {
      const top = res.find((r) => r.sell_price > 0);
      if (top) {
        const local = /\$/.test(top.sell_price_text) ? (await prices.steamPrice(730, top.hash_name)).lowest : top.sell_price;
        rate = local / top.sell_price;
      }
    }
    for (let i = 0; rate != null && i < res.length; i++) {
      const r = res[i];
      const p = Math.round(r.sell_price * rate);
      if (!(p >= min && p <= max && r.sell_listings >= minListings && (!nameOk || nameOk(r.hash_name)))) continue;
      if (!meta.get(r.hash_name)) meta.set(r.hash_name, { name: r.name, icon: r.asset_description?.icon_url, color: r.asset_description?.name_color, appid: 730 });
      if (task.cancelled) return 'cancel';
      info.pos = start + i + 1;
      if ((await fn({ hash: r.hash_name, appid: 730 }, { pos: start + i + 1, total })) === false) return 'stop';
    }
    start += res.length; // Steam may hand out smaller pages than asked for
    info.pos = start;
  }
  return task.cancelled ? 'cancel' : 'end';
}

const quick = new Map(); // hash -> { at, max }: best-case flip ROI from the order book alone (see flipCeiling)
const FRESH = 30 * 60000; // a full check from this session is reused for half an hour
// Rejected items remembered across page loads (GM storage), so the next scan doesn't ask Steam about them again:
//  k 'q' , the order book left no room for a flip (best case `max`): 12 h, while max is still under your Min. ROI
//  k 'no', fully checked and rejected with Min. ROI `r` / Min. sprzedaży `v`: 3 h, while your settings aren't looser
// Hits and "risky" items are never remembered, they are always checked again.
const SEEN_KEY = 'flipSeen';
const seenValid = (e) => !!e && (e.k === 'q'
  ? Date.now() - e.at < 12 * 3600000 && !(e.max > 0 && e.max >= settings.minRoi)
  : Date.now() - e.at < 3 * 3600000 && settings.minRoi >= e.r && settings.minVolume >= e.v);
function loadSeen() {
  const all = store.get(SEEN_KEY, {});
  for (const k of Object.keys(all)) if (Date.now() - all[k].at > 12 * 3600000) delete all[k];
  return all;
}
const saveSeen = (all) => store.set(SEEN_KEY, all);
let scanning = false;
let findState = null; // progress of the "search until found" flip scan (shown above the table)

// Results survive a page reload for half an hour (GM storage): the rows on the scanner list and the watched ones,
// without the order-book graphs and the raw history stats. Rows older than FRESH are dropped on load. A new scan
// reuses the restored rows exactly like the ones checked in this session, so nothing is asked from Steam twice.
const ROWS_KEY = 'flipRows';
const slimRow = (r) => ({ ...r, st: undefined, h: r.h ? Object.fromEntries(Object.entries(r.h).filter(([, v]) => v == null || typeof v !== 'object')) : r.h });
let saveTimer = 0;
function saveRows(now = false) {
  clearTimeout(saveTimer);
  const run = () => {
    const rows = [...results.values()].filter((r) => Date.now() - r.at < FRESH && (scanSet.has(r.hash) || watch.get(r.hash))).slice(-300).map(slimRow);
    const fd = findState;
    store.set(ROWS_KEY, {
      v: 1, set: [...scanSet].filter((h) => results.has(h)), rows,
      // a scan cut off by the reload is shown as stopped; Infinity doesn't survive JSON
      find: fd ? { ...fd, want: fd.want === Infinity ? null : fd.want, state: fd.state === 'run' ? 'cancel' : fd.state, walk: { pos: fd.walk?.pos, total: fd.walk?.total } } : null,
    });
  };
  if (now) run(); else saveTimer = setTimeout(run, 3000);
}
function loadRows() {
  const s = store.get(ROWS_KEY, null);
  if (!s || s.v !== 1 || !Array.isArray(s.rows)) return false;
  const rows = s.rows.filter((r) => r && r.hash && Date.now() - r.at < FRESH);
  if (!rows.length) { store.del(ROWS_KEY); return false; }
  for (const r of rows) if (!results.has(r.hash)) results.set(r.hash, r);
  scanSet = new Set((s.set || []).filter((h) => results.has(h)));
  findState = s.find && scanSet.size ? { ...s.find, want: s.find.want ?? Infinity, walk: s.find.walk || {} } : null;
  return true;
}
// "these numbers are from 20:34", shown once the oldest row on the list is more than a minute old
const ageNote = (rows) => {
  const oldest = rows.length ? Math.min(...rows.map((r) => r.at)) : 0;
  if (!oldest || scanning || Date.now() - oldest < 60000) return '';
  const hm = (t) => new Date(t).toLocaleTimeString(locale(), { hour: '2-digit', minute: '2-digit' });
  return `<span class="sub">${L('flip.resultsFromIKeepThem', { oldest: hm(oldest), oldest2: hm(oldest + FRESH) })}</span><br>`;
};
async function scan() {
  if (scanning) return;
  scanning = true;
  await Promise.race([syncMax(), sleep(8000)]); // fresh balance for the "do" field; never holds the scan up for long
  const catSel = el.querySelector('#s-cat').value;
  const filters = {
    cat: CAT_TAG[catSel] ?? catSel,
    nameOk: CAT_NAME[catSel] || null,
    q: el.querySelector('#s-q').value.trim(),
    min: parsePrice(el.querySelector('#s-min').value) || 0,
    max: parsePrice(el.querySelector('#s-max').value) || Infinity,
    minListings: +el.querySelector('#s-list').value || 0,
    // flip scan with "korzystaj z zapamiętanych danych" unticked: everything is asked from Steam again
    fresh: goalNow() === 'flip' && !el.querySelector('#s-skip').checked,
  };
  scanning = true;
  task = token();
  el.querySelector('[data-a="stop"]').hidden = false;
  try {
    if (goalNow() === 'flip') await scanFind(filters);
    else {
      const n = Math.max(1, Math.min(300, +el.querySelector('#s-n').value || 40));
      ui.log(L('flip.scannerDownloadingTheListOf'));
      // a new scan starts from an empty list, the previous one (e.g. another category) doesn't hang around
      findState = null;
      scanSet = new Set();
      renderScan();
      const list = [];
      const end = await eachCandidate(filters, (c) => { if (!hidden.get(c.hash)) list.push(c); return list.length < n; });
      if (end === 'stall') ui.log(L('flip.scannerSteamStoppedReturningThe'), 'warn');
      if (end === 'cancel') ui.log(L('flip.scannerStopped'), 'warn');
      else {
        findState = null;
        scanSet = new Set(list.map((c) => c.hash));
        ui.log(L('flip.scannerCheckingItemsInThe', { list: list.length, Math: Math.max(1, Math.ceil(list.length / 60)) }));
        renderScan();
        await runMetrics(list, '#s-table', false);
        renderScan();
        ui.log(L('flip.scannerFinished'), 'ok');
      }
    }
  } catch (e) {
    ui.log(L('flip.scanner') + e.message, 'err');
  }
  scanning = false;
  saveRows(true);
  ui.progress(0);
  el.querySelector('[data-a="stop"]').hidden = true;
}

/**
 * Flip scan that doesn't give up after a fixed number of items: walks the popular list until `want` items get the
 * "✔ Flip możliwy" verdict, the list ends, you press Stop or Steam rate-limits us. Only the hits and the "risky"
 * near-hits are listed (thousands of rejected rows would be noise). Items checked in the last 30 min aren't
 * fetched again, so a scan that was stopped continues where it left off.
 */
async function scanFind(filters) {
  // empty field (or 0) = no target: keep going until Stop or the end of the list
  const raw = el.querySelector('#s-find').value.trim();
  const want = +raw > 0 ? Math.floor(+raw) : Infinity;
  store.set('flipFind', want === Infinity ? '' : String(want));
  const of = want === Infinity ? '' : ` ${L('flip.of3')} ${want}`;
  const useSeen = el.querySelector('#s-skip').checked;
  store.set('flipSkipSeen', useSeen);
  scanSet = new Set();
  const st = (findState = { want, checked: 0, found: 0, risky: 0, failed: 0, quick: 0, skipped: 0, state: 'run', walk: {} });
  st.walk.stop = () => st.found >= want;
  renderScan(); // also stores Min. ROI / Min. sprzedaży from the form (the verdict reads them)
  ui.log(want === Infinity ? L('flip.scannerSearchingForFlipPossible') : L('flip.scannerSearchingForFlipPossible2', { want }));
  const seen = loadSeen();
  let lastRender = 0, dirty = 0, limit = null;
  const draw = (force) => { if (force || Date.now() - lastRender > 1000) { lastRender = Date.now(); renderScan(); } };
  const remember = (hash, e) => { seen[hash] = { at: Date.now(), ...e }; if (++dirty >= 100) { dirty = 0; saveSeen(seen); } };
  const judge = (hash, row) => {
    if (findState !== st) return; // the list was cleared while this item was still being checked
    st.checked++;
    const k = flipVerdict(row).k;
    if (k === 'ok') { st.found++; scanSet.add(hash); ui.log(L('flip.scannerFound', { hash, found: st.found, want: want === Infinity ? '' : '/' + want }), 'ok'); }
    else if (k === 'risk') { st.risky++; scanSet.add(hash); }
    if (k === 'ok' || k === 'risk') saveRows();
    else remember(hash, { k: 'no', r: settings.minRoi, v: settings.minVolume });
    draw(k === 'ok');
  };
  // The order books (fast lane) are walked one after another; the price histories of the items that still have a
  // chance run next to them on their own lane, so the scan takes about as long as the slower lane, not the sum.
  const pending = new Set();
  let end = 'end';
  try {
    end = await eachCandidate(filters, async ({ hash, appid }, { pos, total }) => {
      if (limit) throw limit;
      if (st.found >= want) return false;
      ui.progress(pos, total);
      if (hidden.get(hash)) return true; // hidden with ✕: not shown, not checked
      try {
        const row = results.get(hash);
        if (useSeen && row && row.fr && Date.now() - row.at < FRESH) { judge(hash, row); return st.found < want; }
        if (useSeen && seenValid(seen[hash])) { st.checked++; st.skipped++; draw(); return true; }
        // the order book alone already tells when no flip can pass → no price-history request at all
        let q = useSeen ? quick.get(hash) : null;
        if (!q || Date.now() - q.at > FRESH) {
          const h0 = await prices.hist(appid, hash, useSeen ? 5 * 60000 : 0);
          q = { at: Date.now(), max: flipCeiling({ buyGraph: h0.buyGraph, sellGraph: h0.sellGraph, net }) };
          quick.set(hash, q);
        }
        if (!(q.max != null && q.max > 0 && q.max >= settings.minRoi)) {
          st.checked++; st.quick++;
          remember(hash, { k: 'q', max: q.max ?? -1 });
          draw();
          return true;
        }
        while (pending.size >= 6) await Promise.race(pending);
        const p = (async () => {
          const [h, hist] = await Promise.all([
            prices.hist(appid, hash, 5 * 60000),
            steam.priceHistory(appid, hash, { force: !useSeen }).catch((e) => { if (e.status === 429) throw e; return null; }),
          ]);
          const r = metricsRow(hash, appid, h, null, hist ? historyStats(hist) : null, hist);
          results.set(hash, r);
          judge(hash, r);
        })().catch((e) => { if (e.status === 429) limit = e; else { st.checked++; st.failed++; } }).finally(() => pending.delete(p));
        pending.add(p);
      } catch (e) {
        if (e.status === 429) throw e;
        st.checked++; st.failed++;
      }
      return st.found < want;
    }, st.walk);
  } catch (e) {
    await Promise.all(pending);
    saveSeen(seen);
    if (e.status !== 429) { st.state = 'error'; renderScan(); throw e; }
    end = 'limit';
  }
  await Promise.all(pending);
  if (limit) end = 'limit';
  saveSeen(seen);
  st.state = end;
  const where = st.walk.total ? L('flip.steamsListForThisCategory', { pos: st.walk.pos, total: st.walk.total }) : '';
  renderScan();
  const sum = L('flip.checkedFound', { checked: st.checked, found: st.found, of });
  if (end === 'stop') ui.log(L('flip.scannerFinished2', { sum }), 'ok');
  else if (end === 'end') ui.log(L('flip.scannerEndOfTheList', { sum, where }), st.found ? 'ok' : 'warn');
  else if (end === 'stall') ui.log(L('flip.scannerSteamStoppedReturningThe2', { sum, where }), 'warn');
  else if (end === 'limit') ui.log(L('flip.scannerSteamIsLimitingRequests', { sum }), 'warn');
  else ui.log(L('flip.scannerStoppedScanResumesWhere', { sum }), want === Infinity ? 'ok' : 'warn');
}


// ---------------------------------------------------------------- research export
// Order book + full price history of a fixed sample of items (+ whatever you scanned / watch), saved to a file.
// Read-only requests through the normal rate-limited lanes; used to back-test strategies offline.
/** the items listed in the open view (scanner / watchlist table, or the analysed item); a fixed sample when it's empty */
async function exportResearch() {
  if (scanning) return;
  const shown = [...new Set([...el.querySelectorAll('section[data-s]:not([hidden]) [data-an], section[data-s]:not([hidden]) #f-out [data-w]')].map((b) => b.dataset.an || b.dataset.w).filter(Boolean))];
  const list = (shown.length ? shown : [...new Set(RESEARCH_ITEMS)]).map((hash) => ({ hash, appid: 730 }));
  await research.exportResearch(list, shown.length ? L('flip.shownOnTheListRight') : L('flip.fromTheFixedSampleOf'), { onBusy: (b) => (el.querySelector('[data-a="stop"]').hidden = !b) });
}
