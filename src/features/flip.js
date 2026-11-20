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
import { L, locale } from '../core/i18n.js';

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
  ['', L('Everything', 'Wszystko')], ['case', L('Cases', 'Skrzynie')], ['capsule', L('Capsules and packages', 'Kapsuły i paczki')], ['tag_CSGO_Tool_Sticker', L('Stickers', 'Naklejki')], ['tag_CSGO_Type_Rifle', L('Rifles', 'Karabiny')],
  ['tag_CSGO_Type_Pistol', L('Pistols', 'Pistolety')], ['tag_CSGO_Type_SMG', L('SMGs', 'PM')], ['tag_CSGO_Type_Knife', L('Knives', 'Noże')], ['tag_Type_Hands', L('Gloves', 'Rękawice')],
  ['tag_Type_CustomPlayer', L('Agents', 'Agenci')], ['tag_CSGO_Type_Spray', 'Graffiti'], ['tag_CSGO_Type_MusicKit', L('Music kits', 'Muzyka')],
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
      <button class="b" data-v="analyze">🔎 ${L('Item analysis', 'Analiza przedmiotu')}</button>
      <button class="b" data-v="watch">★ ${L('Watchlist', 'Obserwowane')}</button>
      <button class="b" data-v="scan">📡 ${L('Market scanner', 'Skaner rynku')}</button>
      <span class="sp"></span>
      <button class="b dbg" data-a="research" title="${L('Downloads from the Steam market the order book and the full price history of the items shown on the list right now (scanner, watchlist or the analysed item) and saves them to a file, to check whether they really pay off. When the list is empty, it takes a fixed sample of about 100 popular items. Nothing is bought or listed.', 'Pobiera z Rynku Steam księgę zleceń i pełną historię cen przedmiotów widocznych teraz na liście (skaner, obserwowane albo analizowany przedmiot) i zapisuje je do pliku, do sprawdzenia, czy faktycznie się opłacają. Gdy lista jest pusta, bierze stałą próbkę ok. 100 popularnych przedmiotów. Niczego nie kupuje ani nie wystawia.')}">⬇ ${L('Data for analysis', 'Dane do analizy')}</button>
      <button class="b dbg" data-a="sample" title="${L('Picks a few hundred random items from the most popular ones on the Steam market (evenly from every kind and price range) and saves their price history and order book to a file, to test Flipster\'s algorithms on a wider market. Nothing is bought or listed.', 'Losuje kilkaset przedmiotów z listy najpopularniejszych na Rynku Steam (po równo z każdego rodzaju i przedziału cen) i zapisuje ich historię cen i księgę zleceń do pliku, do sprawdzania algorytmów Flipstera na szerszym rynku. Niczego nie kupuje ani nie wystawia.')}">⬇ ${L('Market sample', 'Próbka rynku')}</button>
      <button class="b" data-a="stop" hidden>■ Stop</button>
    </div>
    <section data-s="analyze">
      <div class="row2">
        <label style="position:relative">${L('Item (name in English or Polish, or a market link)', 'Przedmiot (nazwa po polsku lub angielsku, albo link do rynku)')}<input type="text" id="f-q" style="width:420px" placeholder="${L('e.g.', 'np.')} Budapest 2025 Champions Autograph Capsule" autocomplete="off"><div id="f-sugg" class="sugg" hidden></div></label>
        <label>AppID<input type="number" id="f-app" value="730" style="width:70px"></label>
        <label>${L('Your buy price (optional)', 'Twoja cena zakupu (opcjonalnie)')}<input class="p" id="f-mine" placeholder="-"></label>
        <label>${L('Units to buy', 'Ile sztuk chcę kupić')}<input type="number" id="f-n" value="1" min="1" style="width:70px"></label>
        <button class="b go" data-a="analyze">${L('Analyse', 'Analizuj')}</button>
      </div>
      <div id="f-out"></div>
    </section>
    <section data-s="watch" hidden>
      <div class="row2">
        <label>${L('Add to watchlist', 'Dodaj do obserwowanych')}<input type="text" id="w-add" style="width:380px" placeholder="${L('name in English or Polish', 'nazwa po polsku lub angielsku')}"></label>
        <button class="b" data-a="wadd">${L('Add', 'Dodaj')}</button>
        <button class="b go" data-a="wscan">${L('Scan watchlist', 'Skanuj obserwowane')}</button>
      </div>
      <div class="tw" id="w-table"></div>
    </section>
    <section data-s="scan" hidden>
      <div class="row2">
        <label>${L('Goal', 'Cel')}<select id="s-goal"><option value="hold">${L('long term (case season)', 'na dłużej (sezon skrzyń)')}</option><option value="flip">${L('quick flip (7-day lock)', 'szybki flip (7 dni blokady)')}</option></select></label>
        <label>${L('Category', 'Kategoria')}<select id="s-cat">${CATS.map(([v, n]) => `<option value="${v}">${n}</option>`).join('')}</select></label>
        <label>${L('Search', 'Szukaj')}<input type="text" id="s-q" style="width:150px" placeholder="${L('(optional)', '(opcjonalnie)')}"></label>
        <label>${L('Price from', 'Cena od')}<input class="p" id="s-min" value="${toInput(100)}"></label>
        <label>${L('to', 'do')}<input class="p" id="s-max" data-auto="1" value="${toInput(maxDefault())}"></label>
        <label>${L('Min. listings', 'Min. ofert na rynku')}<input type="number" id="s-list" value="100" style="width:80px"></label>
        <label data-only="hold">${L('Items to check', 'Ile przedmiotów sprawdzić')}<input type="number" id="s-n" value="40" style="width:70px"></label>
        <label data-only="flip">${L('How many to find', 'Ile znaleźć')}<input type="number" id="s-find" value="${esc(store.get('flipFind', '5'))}" min="0" placeholder="${L('no limit', 'bez limitu')}" style="width:92px"></label>
        <label data-only="flip">${L('Min. sales/24h', 'Min. sprzedaży/24h')}<input type="number" id="s-vol" value="${settings.minVolume}" style="width:70px"></label>
        <label data-only="flip">Min. ROI %<input type="number" id="s-roi" value="${Math.round(settings.minRoi * 100)}" style="width:60px"></label>
        <label data-only="flip" style="flex-direction:row;align-items:center;gap:6px;padding-bottom:6px" title="${L('Only items with the “Flip possible” verdict stay on the list. Untick it to also see the risky ones (profit smaller than the typical weekly price swing).', 'Na liście zostają tylko przedmioty z oceną „Flip możliwy”. Odznacz, żeby widzieć też ryzykowne (zysk mniejszy niż typowa zmiana ceny w tydzień).')}"><input type="checkbox" id="s-only" ${store.get('flipOnlyOk', true) ? 'checked' : ''}> ${L('profitable only', 'tylko opłacalne')}</label>
        <label data-only="flip" style="flex-direction:row;align-items:center;gap:6px;padding-bottom:6px" title="${L('Ticked, the scanner reuses what it checked recently, rejected items (12 h when the order book alone left no room for a flip, 3 h after a full check), hits and “risky” ones (30 min), and the lists and order books (a few minutes). Untick it so this scan downloads everything from Steam again.', 'Zaznaczone: skaner bierze z pamięci to, co niedawno sprawdził, odrzucone przedmioty (12 godz., gdy sama księga zleceń nie dawała szans na flip; 3 godz. po pełnym sprawdzeniu), trafienia i „ryzykowne” (30 min) oraz listy i księgi zleceń (kilka minut). Odznacz, żeby ten skan pobrał wszystko ze Steama od nowa.')}"><input type="checkbox" id="s-skip" ${store.get('flipSkipSeen', true) ? 'checked' : ''}> ${L('use remembered data', 'korzystaj z zapamiętanych danych')}</label>
        <button class="b go" data-a="scan">${L('Scan', 'Skanuj')}</button>
        <button class="b" data-a="sclear" title="${L('Removes the results of the previous scan from the list (also the ones kept across a page reload). Watched and hidden items stay.', 'Usuwa z listy wyniki poprzedniego skanu (także zapamiętane po odświeżeniu strony). Obserwowane i ukryte zostają.')}">${L('Clear list', 'Wyczyść listę')}</button>
      </div>
      <details><summary>${L('How does it work?', 'Jak to działa?')}</summary><div class="note" style="font-size:13px">${L(`
        The scanner takes the most popular items of the category and price range from the Steam market, and for each of them the order book and the full price history.<br>
        <b>Long term.</b> Shows what holding the item gave in the past, after the fee. How many winters (bought at the end of November, sold half a year later) ended in profit, the result after one and after two years, the price against the yearly average and the change over the last month. A “candidate” is a case older than 4 years, from 1 zł, whose price didn't fall more than 10% in 30 days and which sells ≥ 20 units a day. The case's own winter record is shown but doesn't decide, in the research it didn't tell the better cases from the worse ones, and age did. For other items, at least 3 winters of data and a profit in ≥ 70% of them.<br>
        <b>Quick flip.</b> Buying with an order a cent above the ones really waiting in the order book, selling at the price sales actually go at, minus the fee. A bought item can be listed only after 7 days, so next to it you see the typical weekly price swing and whether anyone sold that cheap lately. In this mode the scanner keeps searching, it walks the list from the most popular until it finds as many “Flip possible” items as you type in “How many to find”, the list ends or you click Stop. An empty “How many to find” means no limit, it searches until Stop. With “profitable only” just the hits stay on the list, untick it to also see the “risky” ones.<br>
        <b>Where these rules come from.</b> Research on 108 items with up to 13 years of history (15.11.2026). Flips and buying dips didn't beat the fee, holding old cases bought in winter did make money. New items usually lose a lot of value. This is history, not a guarantee.`, `
        Skaner pobiera z Rynku Steam najpopularniejsze przedmioty z kategorii i przedziału cen, a dla każdego, księgę zleceń i pełną historię cen.<br>
        <b>Na dłużej.</b> Pokazuje, co trzymanie tego przedmiotu dawało w przeszłości, po prowizji: ile zim (zakup pod koniec listopada, sprzedaż pół roku później) skończyło się zyskiem, wynik po roku i po dwóch latach, cenę względem średniej z roku i zmianę z ostatniego miesiąca. „Kandydat” = skrzynia starsza niż 4 lata, od 1 zł, cena nie spadła o więcej niż 10% w 30 dni, sprzedaje się ≥ 20 szt. dziennie. Rekord zim samej skrzyni jest pokazany, ale nie decyduje: w badaniu nie odróżniał lepszych od gorszych, a wiek tak. Dla pozostałych przedmiotów: co najmniej 3 zimy danych i zysk w ≥ 70% z nich.<br>
        <b>Szybki flip.</b> Kupno zleceniem o grosz nad tymi, które realnie stoją w księdze, sprzedaż po cenie, po której faktycznie idą transakcje, minus prowizja. Kupiony przedmiot można wystawić dopiero po 7 dniach, więc obok jest typowa zmiana ceny w tydzień i to, czy ktokolwiek ostatnio sprzedawał tak tanio. W tym trybie skaner szuka do skutku: idzie po liście od najpopularniejszych, aż znajdzie tyle przedmiotów z oceną „Flip możliwy”, ile wpiszesz w „Ile znaleźć”, skończy się lista albo klikniesz Stop. Puste pole „Ile znaleźć” = bez limitu, szuka do Stopu. Z „tylko opłacalne” na liście zostają same trafienia; po odznaczeniu widać też „ryzykowne”.<br>
        <b>Skąd te zasady.</b> Badanie 108 przedmiotów z historią do 13 lat (15.11.2026): flipy i łapanie dołków nie przebijały prowizji, a zarabiało trzymanie starych skrzyń kupionych zimą. Nowe przedmioty zwykle mocno tanieją. To historia, nie gwarancja.`)}
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
    wadd: async () => { const h = el.querySelector('#w-add').value.trim(); if (!h) return; const r = await resolveHash(h); if (!r) return ui.log(L(`Not found on the market: ${h}`, `Nie znalazłem na rynku: ${h}`), 'warn'); toggleWatch(r.hash, 730, true); el.querySelector('#w-add').value = ''; },
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
  if (watch.get(hash) && !forceAdd) { watch.del(hash); ui.log(L(`Removed from watchlist: ${hash}`, `Usunięto z obserwowanych: ${hash}`)); }
  else { watch.set(hash, { appid: +appid, added: Date.now() }); ui.log(L(`Added to watchlist: ${hash}`, `Dodano do obserwowanych: ${hash}`), 'ok'); }
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
  box.innerHTML = `<div class="sub">${L('searching…', 'szukam…')}</div>`;
  const res = (await searchNames(text.trim()))?.results || [];
  if (el.querySelector('#f-q').value !== text) return; // typed on meanwhile
  box.innerHTML = res.length ? res.map((x) => `<div data-pick="${esc(JSON.stringify({ hash: x.hash_name }))}"><img src="https://community.cloudflare.steamstatic.com/economy/image/${esc(x.asset_description?.icon_url || '')}/62fx62f"><span style="color:#${esc(x.asset_description?.name_color || 'c6d4df')}">${esc(x.hash_name || x.name)}</span><span class="p2">${esc(x.sell_price_text || '')}</span></div>`).join('') : `<div class="sub">${L('nothing found', 'nic nie znaleziono')}</div>`;
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
  if (!hs) return { k: 'none', label: L('no history', 'brak historii'), c: 'mut', why: L('Steam returned no price history for this item.', 'Steam nie zwrócił historii cen tego przedmiotu.') };
  if (hs.ageDays < 365) return { k: 'new', label: L('new item', 'nowy przedmiot'), c: 'bad', why: L('It has been on the market for less than a year. New items usually lose a lot of value, in the research typically −57% in the first 90 days.', 'Jest na rynku krócej niż rok. Nowe przedmioty zwykle mocno tanieją, w badaniu typowo −57% w pierwszych 90 dniach.') };
  if (r.h?.lowestSell && r.h.lowestSell < 100) return { k: 'cheap', label: L('too cheap', 'za tani'), c: 'bad', why: L('Below 1 zł the minimum fee (0.04 + 0.04 zł) takes much more than 13%.', 'Poniżej 1 zł minimalna prowizja (0,04 + 0,04 zł) zabiera dużo więcej niż 13%.') };
  let rec = hs.winter ? L(`Winters in profit: ${hs.winter.wins} of ${hs.winter.n}, typically ${sp(hs.winter.med)} after the fee.`, `Zimy na plus: ${hs.winter.wins} z ${hs.winter.n}, typowo ${sp(hs.winter.med)} po prowizji.`) : '';
  if (isCase(r.hash)) {
    // walk-forward on 36 cases / 161 winters (2026-11-15): age told winners from losers, under 4 years 54% of
    // winters were profitable (typically +13%), older 82% (+39%). The case's own winter record did not: the cases
    // the old "≥3 winters, ≥70% won" gate rejected did no worse than the ones it accepted.
    const age = (hs.ageDays / 365).toFixed(1);
    const agePl = age.replace('.', ',');
    if (hs.ageDays < 4 * 365) return { k: 'young', label: L('too young', 'za młoda'), c: 'mid', why: L(`On the market for ${age} years. Cases younger than 4 years gave a winter profit in 54% of cases (typically +13%), older ones in 82% (typically +39%).`, `Na rynku od ${agePl} roku. Skrzynie młodsze niż 4 lata dawały zimą zysk w 54% przypadków (typowo +13%), starsze w 82% (typowo +39%).`) };
    rec = L(`The case is ${age} years old, cases older than 4 years gave a winter profit in 82% of cases. ${rec}`, `Skrzynia ma ${agePl} roku, starsze niż 4 lata dawały zimą zysk w 82% przypadków. ${rec}`);
  } else {
    if (!hs.winter || hs.winter.n < 3) return { k: 'short', label: L('history too short', 'za krótka historia'), c: 'mut', why: L('Less than 3 winters of data, too little to judge anything.', 'Mniej niż 3 zimy danych, za mało, żeby cokolwiek ocenić.') };
    if (!(hs.winter.win >= 0.7 && hs.winter.med > 0.1)) return { k: 'weak', label: L('weak history', 'słaba historia'), c: 'bad', why: L(`${rec} That's too little to count on a profit.`, `${rec} To za mało, żeby liczyć na zysk.`) };
  }
  if (r.vol != null && r.vol < 20) return { k: 'thin', label: L('low volume', 'mały obrót'), c: 'mid', why: L(`${rec} But only ${r.vol} units sell a day, it will be hard to get out.`, `${rec} Ale sprzedaje się tylko ${r.vol} szt. dziennie, trudno będzie wyjść.`) };
  if (hs.trend30 != null && hs.trend30 < -0.1) return { k: 'wait', label: L('wait, it\'s falling', 'poczekaj, spada'), c: 'mid', why: L(`${rec} But the price fell ${pct(-hs.trend30, 0)} in 30 days. Cases bought during such a fall gave a profit after a year in 57% of cases instead of 75%.`, `${rec} Ale cena spadła o ${pct(-hs.trend30, 0)} w 30 dni. Skrzynie kupowane w trakcie takiego spadku dawały zysk po roku w 57% przypadków zamiast 75%.`) };
  return { k: 'ok', label: L('candidate', 'kandydat'), c: 'ok', why: L(`${rec} The price isn't dropping sharply and the volume is enough.`, `${rec} Cena nie spada gwałtownie, obrót wystarczy.`) };
}

const MIN_FILL_WEEK = 10; // units that must have traded at or below the order price in 7 days, else the order mostly just sits
/** short flip (you can resell only after the 7-day lock) */
function flipVerdict(r) {
  const fr = r.fr, sig = r.hs?.sigmaWeek;
  if (!fr) return { k: 'none', label: L('No data', 'Brak danych'), c: 'mut', reasons: [L('no order book or price history', 'brak księgi zleceń albo historii cen')] };
  const reasons = [];
  if (fr.profit <= 0) reasons.push(fr.sell24 > fr.sell && net(fr.sell24) > fr.buy ? L(`there's a profit only at today's price ${steam.fmt(fr.sell24)}, at the typical price of the week (${steam.fmt(fr.sell)}) the fee eats it all, and you can sell only after 7 days`, `zysk jest tylko przy dzisiejszej cenie ${steam.fmt(fr.sell24)}; przy typowej z tygodnia (${steam.fmt(fr.sell)}) prowizja zjada wszystko, a sprzedasz dopiero po 7 dniach`) : L('at the price sales actually go at, the fee eats the whole profit', 'po cenie, po której faktycznie idą transakcje, prowizja zjada cały zysk'));
  if (fr.fill7 === 0) reasons.push(L('in the last 7 days nobody sold as cheap as your order', 'w ostatnich 7 dniach nikt nie sprzedał tak tanio, jak Twoje zlecenie'));
  if (r.vol != null && r.vol < settings.minVolume) reasons.push(L(`low volume (${r.vol}/24h)`, `mały obrót (${r.vol}/24h)`));
  if (fr.profit > 0 && fr.roi < settings.minRoi) reasons.push(L(`profit below ${Math.round(settings.minRoi * 100)}%`, `zysk poniżej ${Math.round(settings.minRoi * 100)}%`));
  if (fr.profit > 0 && !reasons.length) {
    if (fr.week < MIN_FILL_WEEK) return { k: 'slow', label: L('~ Rarely fills', '~ Rzadko wchodzi'), c: 'mid', reasons: [L(`in the last 7 days only ${fr.week} units sold at your order price or lower (${MIN_FILL_WEEK} needed), the order will mostly just sit`, `w ostatnich 7 dniach po cenie Twojego zlecenia lub niżej sprzedano tylko ${fr.week} szt. (potrzeba ${MIN_FILL_WEEK}), zlecenie będzie głównie stało`)] };
    if (sig != null && fr.roi < sig) return { k: 'risk', label: L('~ Risky', '~ Ryzykowny'), c: 'mid', reasons: [L(`the profit ${sp(fr.roi, 1)} is smaller than the typical weekly price swing (±${pct(sig, 1)}), and you can sell only after 7 days`, `zysk ${sp(fr.roi, 1)} jest mniejszy niż typowa zmiana ceny w tydzień (±${pct(sig, 1)}), a sprzedasz dopiero po 7 dniach`)] };
    return { k: 'ok', label: L('✔ Flip possible', '✔ Flip możliwy'), c: 'ok', reasons: [L(`${steam.fmt(fr.profit)}/unit after the fee, remember the 7-day lock`, `${steam.fmt(fr.profit)}/szt. po prowizji; pamiętaj o 7 dniach blokady`)] };
  }
  return { k: 'no', label: L('✘ Flip doesn\'t pay', '✘ Flip się nie opłaca'), c: 'bad', reasons };
}

const winterTitle = (hs) => (hs?.winters?.length ? L('Bought 22-29 November, sold half a year later, after the fee:\n', 'Kupno 22-29 listopada → sprzedaż pół roku później, po prowizji:\n') + hs.winters.map((w) => `${w.y}/${String(w.y + 1).slice(2)}: ${sp(w.r)}`).join('\n') : '');

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
    if (!r) { el.querySelector('#f-out').innerHTML = `<div class="empty">${L(`No item “${esc(hash)}” found on the market.`, `Nie znalazłem na rynku przedmiotu „${esc(hash)}”.`)}</div>`; return; }
    if (r.hash !== hash) { ui.log(`${L('Analysis', 'Analiza')}: ${L(`“${hash}” is`, `„${hash}” to`)} ${r.name}${r.name !== r.hash ? ` (${r.hash})` : ''}${r.guess ? L(', closest match', ', najbliższe dopasowanie') : ''}`); hash = r.hash; el.querySelector('#f-q').value = hash; }
  }
  const mine = parsePrice(el.querySelector('#f-mine').value);
  const out = el.querySelector('#f-out');
  out.innerHTML = `<div class="empty"><span class="spin"></span>${L('Analysing… (orders, volume, price history)', 'Analizuję… (zlecenia, wolumen, historia cen)')}</div>`;
  try {
    const [h, po, hist] = await Promise.all([
      prices.hist(appid, hash),
      prices.steamPrice(appid, hash).catch(() => null),
      steam.priceHistory(appid, hash, { remember: true }).catch((e) => { ui.log(L('Price history: ', 'Historia cen: ') + e.message, 'warn'); return []; }),
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
      { points: sell30.map((p) => [p.t, p.price]), color: '#66c0f4', label: L('Sale price', 'Cena transakcji') },
      ...(fr ? [{ points: [[sell30[0]?.t || Date.now() - 2592000000, fr.bid], [Date.now(), fr.bid]], color: '#a4d007', dash: true, label: L('Buy orders now', 'Zlecenia kupna teraz') }] : []),
      ...(h.lowestSell ? [{ points: [[sell30[0]?.t || Date.now() - 2592000000, h.lowestSell], [Date.now(), h.lowestSell]], color: '#e5b84c', dash: true, label: L('Lowest listing now', 'Najniższa sprzedaż teraz') }] : []),
    ], { fmtY: (x) => steam.fmt(Math.round(x)), bars: sell30.map((p) => [p.t, p.vol]) });

    const depth = (g, n = 6) => g.slice(0, n).map(([p, c], i) => `<tr><td>${steam.fmt(p)}</td><td>${c - (i ? g[i - 1][1] : 0)}</td><td class="sub">${c}</td></tr>`).join('');
    const m = store.get('itemMeta', {})[hash];
    const box = (k, v, sub = '', c = '') => `<div class="card"><div class="k">${k}</div><div class="v ${c}">${v}</div>${sub ? `<div class="sub">${sub}</div>` : ''}</div>`;

    out.innerHTML = `
      <div class="row2" style="align-items:center">
        ${ui.itemCell({ hash, name: m?.name || hash, icon: m?.icon, color: m?.color, appid })}
        <span class="sp" style="flex:1"></span>
        <button class="b" data-w="${esc(hash)}" data-app="${appid}">${watch.get(hash) ? '★' : '☆'} ${L('Watch', 'Obserwuj')}</button>
        ${fr ? `<button class="b go" data-bo="${esc(hash)}" data-price="${fr.buy}" data-app="${appid}" title="${L('An order a cent above the ones really waiting in the order book', 'Zlecenie o grosz nad tymi, które realnie stoją w księdze')}">${L('Place buy order', 'Złóż zlecenie kupna')} ${steam.fmt(fr.buy)}</button>` : ''}
      </div>

      <div class="sec-h"><span>${L('Long term', 'Na dłużej')}</span> <span class="chipst ${hv.c}" style="margin-left:8px">${esc(hv.label)}</span></div>
      <div class="note">${esc(hv.why)}</div>
      ${hs ? `<div class="cards">
        ${box(L('Winters (Nov to May)', 'Zimy (XI→V)'), hs.winter ? `${hs.winter.wins}/${hs.winter.n} ${L('in profit', 'na plus')}` : '-', hs.winter ? L(`typically ${sp(hs.winter.med)} after the fee`, `typowo ${sp(hs.winter.med)} po prowizji`) : L('history too short', 'za krótka historia'), hs.winter ? cls(hs.winter.med) : '')}
        ${box(L('After 1 year', 'Po roku'), hs.y1 ? `${pct(hs.y1.win, 0)} ${L('in profit', 'na plus')}` : '-', hs.y1 ? L(`typically ${sp(hs.y1.med)} · ${hs.y1.n} periods`, `typowo ${sp(hs.y1.med)} · ${hs.y1.n} okresów`) : '', hs.y1 ? cls(hs.y1.med) : '')}
        ${box(L('After 2 years', 'Po 2 latach'), hs.y2 ? `${pct(hs.y2.win, 0)} ${L('in profit', 'na plus')}` : '-', hs.y2 ? L(`typically ${sp(hs.y2.med)} · ${hs.y2.n} periods`, `typowo ${sp(hs.y2.med)} · ${hs.y2.n} okresów`) : '', hs.y2 ? cls(hs.y2.med) : '')}
        ${box(L('vs 1-year avg', 'vs śr. z roku'), sp(hs.vsYear), L('price now against the 12-month average', 'cena teraz względem średniej z 12 miesięcy'), cls(hs.vsYear))}
        ${box(L('30 days', '30 dni'), sp(hs.trend30), L('price change over the last month', 'zmiana ceny w ostatnim miesiącu'), cls(hs.trend30))}
      </div>
      ${hs.winters.length ? `<div class="note" style="padding-top:0">${L('Bought 22-29 November, sold half a year later (after the fee)', 'Kupno 22-29 listopada → sprzedaż pół roku później (po prowizji)')}: ${hs.winters.map((w) => `<span class="tag" style="margin:2px">${w.y}/${String(w.y + 1).slice(2)} <b class="${cls(w.r)}">${sp(w.r)}</b></span>`).join('')}</div>` : ''}` : ''}

      <div class="sec-h"><span>${L('Quick flip (sold after the 7-day lock)', 'Szybki flip (sprzedaż po 7 dniach blokady)')}</span> <span class="chipst ${fv.c}" style="margin-left:8px">${esc(fv.label)}</span></div>
      <div class="note">${fv.reasons.map(esc).join(' · ')}</div>
      <div class="cards">
        ${box(L('Buy (order)', 'Kupno (zlecenie)'), fr ? steam.fmt(fr.buy) : '-', L(`top of the book ${steam.fmt(h.highestBuy)} · ${h.buyCount} orders`, `szczyt księgi: ${steam.fmt(h.highestBuy)} · ${h.buyCount} zleceń`))}
        ${box(L('Sell (actual sales)', 'Sprzedaż (transakcje)'), fr ? steam.fmt(fr.sell) : '-', `${fr && fr.sell24 > fr.sell ? `<span class="warn">${L(`today ${steam.fmt(fr.sell24)}, I count the typical price of 7 days`, `dziś ${steam.fmt(fr.sell24)}, liczę po typowej z 7 dni`)}</span> · ` : ''}${L(`lowest listing ${steam.fmt(h.lowestSell)} · ${h.sellCount} listings`, `najniższa oferta: ${steam.fmt(h.lowestSell)} · ${h.sellCount} ofert`)}`)}
        ${box(L('Profit / unit (flip)', 'Zysk / szt. (flip)'), fr ? steam.fmt(fr.profit) : '-', fr ? L(`you get ${steam.fmt(fr.net)} − buy ${steam.fmt(fr.buy)}`, `na rękę ${steam.fmt(fr.net)} − zakup ${steam.fmt(fr.buy)}`) : '', fr ? cls(fr.profit) : '')}
        ${box('ROI', fr ? sp(fr.roi, 1) : '-', L('after the fee', 'po prowizji'), fr ? cls(fr.roi) : '')}
        ${box(L('Weekly swing', 'Zmiana tyg.'), hs?.sigmaWeek != null ? `±${pct(hs.sigmaWeek, 1)}` : '-', L('typical price change in 7 days', 'typowa zmiana ceny w 7 dni'))}
        ${box(L('Fill chance', 'Szansa wejścia'), fr ? `${fr.week} ${L('pcs', 'szt.')}` : '-', fr ? L(`sold in 7 days at your order price or lower (${pct(fr.fill7, 0)} of volume)`, `tyle w 7 dni sprzedano po cenie Twojego zlecenia lub niżej (${pct(fr.fill7, 0)} obrotu)`) : '', fr && fr.week < MIN_FILL_WEEK ? 'warn' : '')}
        ${box(L('Volume', 'Wolumen'), `${st.vol24 || po?.volume || 0}<span class="sub"> /24h</span>`, L(`${st.vol7} / 7 days`, `${st.vol7} / 7 dni`))}
        ${box(L('Median 7d · avg 30d', 'Mediana 7d · śr. 30d'), steam.fmt(st.med7), `30d: ${steam.fmt(st.avg30)} · min/max 7d ${steam.fmt(st.min7)}-${steam.fmt(st.max7)}`)}
        ${box(L('Break-even', 'Próg rentowności'), fr ? steam.fmt(steam.buyerFromReceived(fr.buy)) : '-', L('min. sale price to come out even', 'min. cena sprzedaży, żeby wyjść na zero'))}
      </div>
      <div id="f-plan"></div>
      ${deal ? `<div class="note" style="font-size:13px">${L(`Your purchase for <b>${steam.fmt(mine)}</b>. Selling now (${steam.fmt(sell)}) you get ${steam.fmt(deal.now.net)}, that's`, `Twój zakup za <b>${steam.fmt(mine)}</b>: sprzedając teraz (${steam.fmt(sell)}) dostaniesz ${steam.fmt(deal.now.net)}, czyli`)} <b class="${deal.now.profit >= 0 ? 'pos' : 'neg'}">${steam.fmt(deal.now.profit)} (${pct(deal.now.roi)})</b>${deal.med ? `${L(', at the 7d median', '; po medianie 7d')} <b class="${deal.med.profit >= 0 ? 'pos' : 'neg'}">${steam.fmt(deal.med.profit)}</b>` : ''}. ${L('To come out even, list for at least', 'Aby wyjść na zero, wystaw za min.')} <b>${steam.fmt(deal.now.breakEven)}</b>.</div>` : ''}
      <div style="padding:0 14px">${chart}</div>`;
    renderPlan();
    const bookHead = `<tr><th>${L('Price', 'Cena')}</th><th>${L('Qty', 'Szt.')}</th><th>${L('Cumul.', 'Narast.')}</th></tr>`;
    out.insertAdjacentHTML('beforeend', `
      <div class="row2" style="align-items:flex-start">
        <div><div class="sub">${L('Buy orders', 'Zlecenia kupna')}</div><table style="width:auto">${bookHead}${depth(h.buyGraph)}</table></div>
        <div><div class="sub">${L('Sell listings', 'Oferty sprzedaży')}</div><table style="width:auto">${bookHead}${depth(h.sellGraph)}</table></div>
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
  const szt = `${qty} ${L('pcs', 'szt.')}`;
  const nowTxt = n.short != null
    ? L(`You can't buy ${szt} right away, the order book shows only ${n.listed} listings.`, `Od ręki nie da się kupić ${szt}: w księdze widać tylko ${n.listed} ofert.`)
    : L(`<b>Right away</b> ${szt}, set the order at <b>${steam.fmt(n.price)}</b> and you pay ${steam.fmt(n.total)} in total${qty > 1 ? ` (on average ${steam.fmt(Math.round(n.avg))} a unit, each listing at its own price)` : ''}. After the sale`, `<b>Od ręki</b> ${szt}: ustaw zlecenie na <b>${steam.fmt(n.price)}</b>, zapłacisz razem ${steam.fmt(n.total)}${qty > 1 ? ` (średnio ${steam.fmt(Math.round(n.avg))} za sztukę; każda oferta po swojej cenie)` : ''}. Po sprzedaży:`)
      + ` <b class="${cls(n.profit)}">${steam.fmt(n.profit)} (${sp(n.roi, 1)})</b>.${p.cheap ? ` ${L(`Listings at ${steam.fmt(p.maxRoi)} or cheaper`, `Ofert wystawionych nie drożej niż ${steam.fmt(p.maxRoi)}:`)} <b>${p.cheap}</b>.` : ''}`;
  const mark = (x) => (x.price === p.maxZero ? L('break-even', 'próg zera') : x.price === p.maxRoi ? L(`highest with profit ≥ ${Math.round(settings.minRoi * 100)}%`, `najwyżej z zyskiem ≥ ${Math.round(settings.minRoi * 100)}%`) : x.price === fr?.buy ? L('just above the orders in the book', 'tuż nad zleceniami w księdze') : '');
  box.innerHTML = `
    <div class="sec-h"><span>${L('Up to what price to buy', 'Do jakiej ceny kupować')}</span> <span class="sub" style="margin-left:8px">${L(`selling at ${steam.fmt(p.sell)} (you get ${steam.fmt(p.got)})`, `przy sprzedaży po ${steam.fmt(p.sell)} (na rękę ${steam.fmt(p.got)})`)}</span></div>
    <div class="note">${L(`It pays to buy <b>up to ${steam.fmt(p.maxRoi)}</b> (≥ ${Math.round(settings.minRoi * 100)}% left after the fee), above <b>${steam.fmt(p.maxZero)}</b> you lose.`, `Opłaca się kupować <b>do ${steam.fmt(p.maxRoi)}</b> (zostaje ≥ ${Math.round(settings.minRoi * 100)}% po prowizji); powyżej <b>${steam.fmt(p.maxZero)}</b> tracisz.`)} ${nowTxt}</div>
    <table style="width:auto;margin:0 14px 10px"><thead><tr><th>${L('Order price', 'Cena zlecenia')}</th><th>${L('Profit / unit', 'Zysk / szt.')}</th><th>${L('Sold this cheap (7 days)', 'Sprzedano tak tanio (7 dni)')}</th><th>${L('Orders ahead of you', 'Zleceń przed Tobą')}</th><th>${L(`${szt} in about`, `${szt} w ok.`)}</th><th></th></tr></thead><tbody>
    ${p.ladder.map((x) => `<tr style="${x.price === p.maxRoi ? 'background:rgba(164,208,7,.08)' : ''}">
      <td><b>${steam.fmt(x.price)}</b></td>
      <td class="${cls(x.profit)}">${steam.fmt(x.profit)} <span class="sub">${sp(x.roi, 1)}</span></td>
      <td>${x.week} ${L('pcs', 'szt.')} <span class="sub">${pct(x.share, 0)} ${L('of volume', 'obrotu')}</span></td>
      <td>${x.ahead}</td>
      <td>${x.days == null ? `<span class="neg">${L('nobody sold this cheap', 'nikt tak tanio nie sprzedał')}</span>` : x.days < 1 ? L('less than a day', 'mniej niż dzień') : x.days > 60 ? `<span class="warn">${L('over 2 months', 'ponad 2 miesiące')}</span>` : L(`${Math.ceil(x.days)} days`, `${Math.ceil(x.days)} dni`)}</td>
      <td class="sub">${mark(x)}</td></tr>`).join('')}
    </tbody></table>
    <div class="note" style="padding-top:0">${L('The time is an estimate, how many units sold at this price or cheaper last week, minus the orders waiting ahead of yours. Orders fill most often when the price drops.', 'Czas to szacunek: ile sztuk w ostatnim tygodniu sprzedało się po tej cenie lub taniej, pomniejszone o zlecenia stojące przed Twoim. Zlecenia najczęściej wchodzą wtedy, gdy cena spada.')}</div>`;
}

// ---------------------------------------------------------------- batch metrics (watchlist / scanner)
async function runMetrics(list, target, isWatch, preFilter = null) {
  if (!list.length) return ui.log(L('No items to check.', 'Brak przedmiotów do sprawdzenia.'), 'warn');
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
      if (e.status === 429) { ui.log(L('Steam limit, stopped. Try again in a few minutes.', 'Limit Steam, przerwano. Spróbuj za kilka minut.'), 'warn'); break; }
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
    ? L('<b class="pos">Buying season (November to February).</b> Cases older than a year bought at the end of November and sold at the end of May made a profit after the fee in 10 of 11 years, typically +49%.', '<b class="pos">Sezon zakupów (listopad-luty).</b> Skrzynie starsze niż rok kupione pod koniec listopada i sprzedane pod koniec maja dały zysk po prowizji w 10 z 11 lat, typowo +49%.')
    : m >= 4 && m <= 8
      ? L('<b class="warn">Selling season (April to August).</b> Cases were historically the most expensive then. Bought in May and sold in November, they typically gave −12%.', '<b class="warn">Sezon sprzedaży (kwiecień-sierpień).</b> Skrzynie były wtedy historycznie najdroższe. Kupione w maju i sprzedane w listopadzie dawały typowo −12%.')
      : L('<b>In between.</b> Historically it was best to buy cases at the end of November and sell them from April to June.', '<b>Okres przejściowy.</b> Historycznie najlepiej było kupować skrzynie pod koniec listopada, a sprzedawać od kwietnia do czerwca.');
  const cs = rows.filter((r) => r.hs && r.hs.ageDays >= 365 && / Case$/.test(r.hash));
  const t = medianOf(cs.map((r) => r.hs.trend30).filter((x) => x != null)), y = medianOf(cs.map((r) => r.hs.vsYear).filter((x) => x != null));
  const mk = cs.length >= 3 && t != null
    ? L(` Old cases in this scan <b class="${cls(t)}">${sp(t)}</b> in 30 days, <b class="${cls(y)}">${sp(y)}</b> against the yearly average.`, ` Stare skrzynie w tym skanie: <b class="${cls(t)}">${sp(t)}</b> w 30 dni, <b class="${cls(y)}">${sp(y)}</b> względem średniej z roku.`)
      + (t < -0.1 ? L(' <b class="warn">The market is still falling, better wait until it stops.</b>', ' <b class="warn">Rynek jeszcze spada, lepiej poczekać, aż się zatrzyma.</b>') : '')
    : '';
  return `${txt}${mk} <span class="sub">${L('Numbers from research on 108 items (up to 13 years of history, 15.11.2026). This is history, not a guarantee.', 'Liczby z badania 108 przedmiotów (do 13 lat historii, 15.11.2026). To historia, nie gwarancja.')}</span>`;
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
  ui.log(L('Scanner: list cleared.', 'Skaner: lista wyczyszczona.'));
}

/** the "Ukryte (N)" switch and, when open, the hidden items with a restore button each */
function hiddenNote() {
  const all = Object.keys(hidden.all());
  if (!all.length) return '';
  const meta = store.get('itemMeta', {});
  const btn = `<button class="b s" data-a="shidden" title="${L('Items you hid with the ✕ button, the scanner neither shows nor checks them', 'Przedmioty, które ukryłeś przyciskiem ✕, skaner ich nie pokazuje i nie sprawdza')}">${showHidden ? '▾' : '▸'} ${L('Hidden', 'Ukryte')} (${all.length})</button>`;
  if (!showHidden) return `${btn}<br>`;
  return `${btn} <button class="b s" data-a="unhideall">${L('restore all', 'przywróć wszystkie')}</button>
    <div style="display:flex;flex-wrap:wrap;gap:4px;margin:6px 0">${all.map((h) => `<span class="chipst mut" style="display:inline-flex;align-items:center;gap:4px">${esc(meta[h]?.name || h)}<button class="b s" data-unhide="${esc(h)}" title="${L('Restore to the scanner', 'Przywróć do skanera')}" style="padding:0 5px;line-height:1.4">↺</button></span>`).join('')}</div>`;
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
    renderTable('#s-table', rows, false, `${hiddenNote()}${ageNote(rows)}${seasonNote(rows)}<br>${L(`<b>${rows.filter(ok).length}</b> of ${rows.length} are candidates${wait ? `, ${wait} have a good history but are still falling` : ''}.`, `<b>${rows.filter(ok).length}</b> z ${rows.length} to kandydaci${wait ? `, ${wait} ma dobrą historię, ale jeszcze spada` : ''}.`)}`, ok, 'hold');
    return;
  }
  const ok = (r) => flipVerdict(r).k === 'ok';
  const fd = findState;
  const onlyOk = el.querySelector('#s-only').checked;
  // (not "hidden": that name is the ✕ list used above, a local one would hide it and break this function as soon as a row exists)
  const notOk = onlyOk ? rows.filter((r) => !ok(r)).length : 0;
  const FIND_STATE = {
    run: `<span class="acc"><span class="spin"></span>${L('still searching…', 'szukam dalej…')}</span>`,
    stop: `<span class="ok">${L('done', 'gotowe')}</span>`,
    end: L('end of the list, there are no more items in this range', 'koniec listy, więcej przedmiotów w tym przedziale nie ma'),
    cancel: L('stopped, “Scan” resumes', 'zatrzymano, „Skanuj” wznowi'),
    stall: `<span class="warn">${L('Steam stopped returning the list (it isn\'t its end), “Scan” in a few minutes resumes', 'Steam przestał zwracać listę (to nie jej koniec), „Skanuj” za kilka minut wznowi')}</span>`,
    limit: `<span class="warn">${L('Steam is limiting requests, try again in a few minutes', 'Steam ogranicza zapytania, spróbuj za kilka minut')}</span>`,
    error: `<span class="err">${L('error', 'błąd')}</span>`,
  };
  const progress = fd ? L(
    `Found <b>${fd.found}</b>${fd.want === Infinity ? '' : ` of ${fd.want}`} · checked ${fd.checked}${fd.walk?.total ? ` (position ${fd.walk.pos} of ${fd.walk.total} on Steam's list for this category)` : ''}${fd.risky ? ` · ${fd.risky} risky (${onlyOk ? 'hidden, untick “profitable only”' : 'on the list, greyed out'})` : ''}${fd.skipped ? ` · ${fd.skipped} skipped (checked recently)` : ''}${fd.failed ? ` · ${fd.failed} without data` : ''}`,
    `Znaleziono <b>${fd.found}</b>${fd.want === Infinity ? '' : ` z ${fd.want}`} · sprawdzono ${fd.checked}${fd.walk?.total ? ` (pozycja ${fd.walk.pos} z ${fd.walk.total} na liście Steama dla tej kategorii)` : ''}${fd.risky ? ` · ${fd.risky} ryzykownych (${onlyOk ? 'ukryte, odznacz „tylko opłacalne”' : 'na liście, wyszarzone'})` : ''}${fd.skipped ? ` · ${fd.skipped} pominiętych (sprawdzone niedawno)` : ''}${fd.failed ? ` · ${fd.failed} bez danych` : ''}`,
  ) + ` · ${FIND_STATE[fd.state]}<br>` : '';
  const empty = fd ? (fd.state === 'run' ? L('Nothing passed so far, still searching…', 'Na razie nic nie przeszło, szukam dalej…') : notOk ? L('No item got the “Flip possible” verdict. Untick “profitable only” to see the risky ones.', 'Żaden przedmiot nie dostał oceny „Flip możliwy”. Odznacz „tylko opłacalne”, żeby zobaczyć ryzykowne.') : L('No checked item passed. Lower Min. ROI or Min. sales, widen the prices or change the category.', 'Żaden sprawdzony przedmiot nie przeszedł. Obniż Min. ROI albo Min. sprzedaży, poszerz ceny lub zmień kategorię.')) : L('Set the filters and click “Scan”.', 'Ustaw filtry i kliknij „Skanuj”.');
  const rule = L(
    `An item passes with a profit ≥ ${Math.round(minRoi * 100)}% when sold at the lower of two prices (today's and the typical one of 7 days), bigger than the typical weekly price swing, with at least ${MIN_FILL_WEEK} units sold at its order price within a week and ≥ ${minVol} sales a day. You can sell a bought item only after 7 days, and the typical weekly price swing is a few percent, in the research such a flip almost never came out in profit.`,
    `Przechodzi przedmiot z zyskiem ≥ ${Math.round(minRoi * 100)}% przy sprzedaży po niższej z dwóch cen (dzisiejszej i typowej z 7 dni), większym niż typowa zmiana ceny w tydzień, po którego cenie zlecenia sprzedano w tygodniu co najmniej ${MIN_FILL_WEEK} szt. i który sprzedaje się ≥ ${minVol} razy na dobę. Kupiony przedmiot sprzedasz dopiero po 7 dniach, a typowa zmiana ceny w tydzień to kilka procent, w badaniu taki flip prawie nigdy nie wychodził na plus.`,
  );
  renderTable('#s-table', onlyOk ? rows.filter(ok) : rows, false, `${hiddenNote()}${ageNote(rows)}${progress}${rule}`, ok, 'flip', empty);
}
function renderWatch() {
  const goal = goalNow();
  fixSort(goal);
  renderTable('#w-table', [...results.values()].filter((r) => watch.get(r.hash)), true, '', goal === 'hold' ? (r) => holdVerdict(r).k === 'ok' : null, goal);
}

function renderTable(target, rows, isWatch, header = '', good = null, goal = 'flip', empty = L('Set the filters and click “Scan”.', 'Ustaw filtry i kliknij „Skanuj”.')) {
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
    ? `${th('name', L('Item', 'Przedmiot'))}${th('hold', L('Verdict', 'Ocena'))}${th('sell', L('Price now', 'Cena teraz'))}${th('winter', L('Winters (Nov to May)', 'Zimy (XI→V)'))}${th('y1', L('After 1 year', 'Po roku'))}${th('y2', L('After 2 years', 'Po 2 latach'))}${th('vsyear', L('vs 1-year avg', 'vs śr. z roku'))}${th('trend', L('30 days', '30 dni'))}${th('vol', L('Volume 24h', 'Wolumen 24h'))}<th></th>`
    : `${th('name', L('Item', 'Przedmiot'))}${th('verdict', L('Verdict', 'Ocena'))}${th('profit', L('Profit/unit', 'Zysk/szt.'))}${th('roi', 'ROI')}${th('buy', L('Buy (order)', 'Kupno (zlecenie)'))}${th('sell', L('Sell (actual sales)', 'Sprzedaż (transakcje)'))}${th('sigma', L('Weekly swing', 'Zmiana tyg.'))}${th('fill', L('Fill chance', 'Szansa wejścia'))}${th('vol', L('Volume 24h', 'Wolumen 24h'))}<th></th>`;
  const cols = 10;
  const volCell = (r) => `<td>${r.vol == null ? '<span class="sub">?</span>' : r.vol}</td>`;
  const rec = (x) => (x ? `<b>${pct(x.win, 0)}</b> <span class="${cls(x.med)}">${sp(x.med)}</span>` : '<span class="sub">-</span>');
  const actions = (r) => `<td style="white-space:nowrap"><button class="b s" data-an="${esc(r.hash)}" data-app="${r.appid}">${L('Analysis', 'Analiza')}</button>
        <button class="b s" data-w="${esc(r.hash)}" data-app="${r.appid}" title="${L('Watch', 'Obserwuj')}">${watch.get(r.hash) ? '★' : '☆'}</button>
        ${r.fr ? `<button class="b s" data-bo="${esc(r.hash)}" data-price="${r.fr.buy}" data-app="${r.appid}" title="${L(`Place a buy order for ${steam.fmt(r.fr.buy)} (a cent above the orders really waiting in the book)`, `Złóż zlecenie kupna za ${steam.fmt(r.fr.buy)} (o grosz nad zleceniami, które realnie stoją w księdze)`)}">${L('+ order', '+ zlecenie')}</button>` : ''}
        ${isWatch ? '' : `<button class="b s" data-hide="${esc(r.hash)}" data-app="${r.appid}" title="${L('Hide it, the scanner won\'t show or check it (restore it under “Hidden” above the table)', 'Ukryj, skaner nie będzie go pokazywał ani sprawdzał (przywrócisz w „Ukryte” nad tabelą)')}">✕</button>`}</td>`;
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
          <td${fr && fr.sell24 > fr.sell ? ` title="${L(`Today sales go at ${steam.fmt(fr.sell24)}, but I count the lower, typical price of 7 days, you can sell only after the lock.`, `Dziś transakcje idą po ${steam.fmt(fr.sell24)}, ale liczę po niższej, typowej cenie z 7 dni, sprzedasz dopiero po blokadzie.`)}"` : ''}>${fr ? `${steam.fmt(fr.sell)}<div class="sub">${L('you get', 'na rękę')} ${steam.fmt(fr.net)}${fr.sell24 > fr.sell ? ` · ${L('today', 'dziś')} ${steam.fmt(fr.sell24)}` : ''}</div>` : '-'}</td>
          <td class="${fr && sig != null && fr.roi > 0 && fr.roi < sig ? 'warn' : ''}">${sig != null ? '±' + pct(sig, 1) : '-'}</td>
          <td class="${fr && fr.week === 0 ? 'neg' : fr && fr.week < MIN_FILL_WEEK ? 'warn' : ''}">${fr ? `${fr.week} ${L('pcs', 'szt.')}<div class="sub">${pct(fr.fill7, 0)} ${L('of volume', 'obrotu')}</div>` : '-'}</td>${volCell(r)}`;
      }
      return `<tr style="${good && !ok ? 'opacity:.55' : ''}">${body}${actions(r)}</tr>`;
    }).join('') : `<tr><td colspan="${cols}" class="empty">${isWatch ? (Object.keys(watch.all()).length ? `${L(`You watch ${Object.keys(watch.all()).length}, click “Scan watchlist” to work them out`, `Obserwujesz ${Object.keys(watch.all()).length}, kliknij „Skanuj obserwowane”, żeby je policzyć`)}: ${Object.keys(watch.all()).slice(0, 8).map(esc).join(', ')}${Object.keys(watch.all()).length > 8 ? '…' : ''}` : L('Add items to the watchlist (☆) and click “Scan watchlist”.', 'Dodaj przedmioty do obserwowanych (☆) i kliknij „Skanuj obserwowane”.')) : esc(empty)}</td></tr>`}</tbody></table>`;
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
      if (r.status === 429) throw new steam.HttpError(429, L('Steam: too many requests (429)', 'Steam: za dużo zapytań (429)'));
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
      if (start > 0) ui.log(L(`Scanner: Steam returned an empty page at position ${start}${info.total ? ` of ${info.total}` : ''}, retrying in ${secs} s…`, `Skaner: Steam zwrócił pustą stronę na pozycji ${start}${info.total ? ` z ${info.total}` : ''}, ponawiam za ${secs} s…`), 'warn');
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
  return `<span class="sub">${L(`Results from ${hm(oldest)}, I keep them for 30 minutes after the check (until ${hm(oldest + FRESH)}), also across a page reload. After that “Scan” downloads new ones.`, `Wyniki z ${hm(oldest)}, pamiętam je 30 minut od sprawdzenia (do ${hm(oldest + FRESH)}), także po odświeżeniu strony. Potem „Skanuj” pobierze nowe.`)}</span><br>`;
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
      ui.log(L('Scanner: downloading the list of popular items…', 'Skaner: pobieram listę popularnych przedmiotów…'));
      // a new scan starts from an empty list, the previous one (e.g. another category) doesn't hang around
      findState = null;
      scanSet = new Set();
      renderScan();
      const list = [];
      const end = await eachCandidate(filters, (c) => { if (!hidden.get(c.hash)) list.push(c); return list.length < n; });
      if (end === 'stall') ui.log(L('Scanner: Steam stopped returning the list, checking what I managed to download.', 'Skaner: Steam przestał zwracać listę, sprawdzam to, co zdążyłem pobrać.'), 'warn');
      if (end === 'cancel') ui.log(L('Scanner stopped.', 'Skaner przerwany.'), 'warn');
      else {
        findState = null;
        scanSet = new Set(list.map((c) => c.hash));
        ui.log(L(`Scanner: checking ${list.length} items in the range (~${Math.max(1, Math.ceil(list.length / 60))} min).`, `Skaner: sprawdzam ${list.length} przedmiotów z przedziału (~${Math.max(1, Math.ceil(list.length / 60))} min).`));
        renderScan();
        await runMetrics(list, '#s-table', false);
        renderScan();
        ui.log(L('Scanner finished.', 'Skaner zakończony.'), 'ok');
      }
    }
  } catch (e) {
    ui.log(L('Scanner: ', 'Skaner: ') + e.message, 'err');
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
  const of = want === Infinity ? '' : ` ${L('of', 'z')} ${want}`;
  const useSeen = el.querySelector('#s-skip').checked;
  store.set('flipSkipSeen', useSeen);
  scanSet = new Set();
  const st = (findState = { want, checked: 0, found: 0, risky: 0, failed: 0, quick: 0, skipped: 0, state: 'run', walk: {} });
  st.walk.stop = () => st.found >= want;
  renderScan(); // also stores Min. ROI / Min. sprzedaży from the form (the verdict reads them)
  ui.log(want === Infinity ? L('Scanner: searching for “Flip possible” items with no limit, until the end of the list or until you click Stop.', 'Skaner: szukam przedmiotów z oceną „Flip możliwy” bez limitu, do końca listy albo do kliknięcia Stop.') : L(`Scanner: searching for ${want} “Flip possible” items until found (Stop ends it).`, `Skaner: szukam ${want} przedmiotów z oceną „Flip możliwy”, do skutku (Stop przerywa).`));
  const seen = loadSeen();
  let lastRender = 0, dirty = 0, limit = null;
  const draw = (force) => { if (force || Date.now() - lastRender > 1000) { lastRender = Date.now(); renderScan(); } };
  const remember = (hash, e) => { seen[hash] = { at: Date.now(), ...e }; if (++dirty >= 100) { dirty = 0; saveSeen(seen); } };
  const judge = (hash, row) => {
    if (findState !== st) return; // the list was cleared while this item was still being checked
    st.checked++;
    const k = flipVerdict(row).k;
    if (k === 'ok') { st.found++; scanSet.add(hash); ui.log(L(`Scanner: found ${hash} (${st.found}${want === Infinity ? '' : '/' + want}).`, `Skaner: znaleziono ${hash} (${st.found}${want === Infinity ? '' : '/' + want}).`), 'ok'); }
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
  const where = st.walk.total ? L(` Steam's list for this category, position ${st.walk.pos} of ${st.walk.total}.`, ` Lista Steama dla tej kategorii: pozycja ${st.walk.pos} z ${st.walk.total}.`) : '';
  renderScan();
  const sum = L(`checked ${st.checked}, found ${st.found}${of}`, `sprawdzono ${st.checked}, znaleziono ${st.found}${of}`);
  if (end === 'stop') ui.log(L(`Scanner finished, ${sum}.`, `Skaner zakończony: ${sum}.`), 'ok');
  else if (end === 'end') ui.log(L(`Scanner: end of the list, ${sum}.${where} Widen the price range or change the category.`, `Skaner: koniec listy, ${sum}.${where} Poszerz przedział cen albo zmień kategorię.`), st.found ? 'ok' : 'warn');
  else if (end === 'stall') ui.log(L(`Scanner: Steam stopped returning the item list, ${sum}.${where} It isn't the end of the list, click “Scan” in a few minutes, checked items won't be downloaded again.`, `Skaner: Steam przestał zwracać listę przedmiotów, ${sum}.${where} To nie koniec listy: kliknij „Skanuj” za kilka minut, sprawdzone przedmioty nie będą pobierane drugi raz.`), 'warn');
  else if (end === 'limit') ui.log(L(`Scanner: Steam is limiting requests, ${sum}. Click “Scan” in a few minutes, checked items won't be downloaded again.`, `Skaner: Steam ogranicza zapytania, ${sum}. Kliknij „Skanuj” za kilka minut, sprawdzone przedmioty nie będą pobierane drugi raz.`), 'warn');
  else ui.log(L(`Scanner stopped, ${sum}. “Scan” resumes where it left off.`, `Skaner zatrzymany: ${sum}. „Skanuj” wznowi od miejsca przerwania.`), want === Infinity ? 'ok' : 'warn');
}


// ---------------------------------------------------------------- research export
// Order book + full price history of a fixed sample of items (+ whatever you scanned / watch), saved to a file.
// Read-only requests through the normal rate-limited lanes; used to back-test strategies offline.
/** the items listed in the open view (scanner / watchlist table, or the analysed item); a fixed sample when it's empty */
async function exportResearch() {
  if (scanning) return;
  const shown = [...new Set([...el.querySelectorAll('section[data-s]:not([hidden]) [data-an], section[data-s]:not([hidden]) #f-out [data-w]')].map((b) => b.dataset.an || b.dataset.w).filter(Boolean))];
  const list = (shown.length ? shown : [...new Set(RESEARCH_ITEMS)]).map((hash) => ({ hash, appid: 730 }));
  await research.exportResearch(list, shown.length ? L('shown on the list right now', 'widocznych teraz na liście') : L('from the fixed sample of popular ones (the list is empty)', 'ze stałej próbki popularnych (na liście nic nie ma)'), { onBusy: (b) => (el.querySelector('[data-a="stop"]').hidden = !b) });
}
