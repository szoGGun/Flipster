import * as ui from '../core/ui.js';
import * as steam from '../core/steam.js';
import * as prices from '../core/prices.js';
import * as store from '../core/store.js';
import { settings } from '../core/store.js';
import { withLock, token, every, isLeader } from '../core/jobs.js';
import { competitorSell, relistTarget, optimalSellPrice, LIST_SHARE, listAdviceFill, levels, sellChance, horizonOf } from '../core/analysis.js';
import { parsePrice, toInput, esc, timeAgo, fmtWhen, daysTxt, wearShort, shareTxt } from '../core/util.js';
import { relist } from './relist-engine.js';
import * as sig from './sellsignals.js';
import { patternFor, patternChip } from './patternmark.js';
import * as patterndb from './patterndb.js';
import * as research from './research.js';
import { floatCheck, floatRankOf, ensureFloatDb, floatMarks, focusItem, adviceOf } from './inventory.js';
import { L } from '../core/i18n.js';

const rules = store.bucket('sellRules'); // hash -> {min, max, auto, target}
let rows = [];
let priceSum = () => {}; // the ⚙ Ceny summary + explanations (set in mount)
// listings waiting for the mobile confirmation, not on the market yet, so they're not in `rows` (no competition
// checks, automat or bulk actions); shown greyed out in the table so a relisted item doesn't just vanish
let pend = [];
const AWAIT_KEY = 'awaitConfirm'; // [{hash, name, icon, color, appid, recv, buyer, amount, at}] relisted here, not confirmed yet
function rememberWaiting(res) {
  if (!res?.waiting?.length) return;
  const list = store.get(AWAIT_KEY, []);
  for (const w of res.waiting) list.push({ hash: w.listing.hash, name: w.listing.name, icon: w.listing.icon, color: w.listing.color, appid: w.listing.appid, recv: w.recv, buyer: w.buyer, amount: w.listing.amount, at: Date.now() });
  store.set(AWAIT_KEY, list.slice(-50));
}
/**
 * Steam's own list of listings to confirm when it sent one; plus the ones relisted here that it doesn't show (yet):
 * only when its list is missing or shorter than its count, or for 2 minutes after the relist (Steam may lag).
 * A remembered one goes away once it's an active listing (confirmed), when Steam's complete list lacks it, or after 1 h.
 */
function pendingRows(listings, pending, known, toConfirm) {
  const key = (x) => `${x.hash}|${x.recv}`;
  const live = new Set(listings.map(key)), shown = new Set(pending.map(key));
  let ours = store.get(AWAIT_KEY, []).filter((a) => Date.now() - a.at < 3600000 && !live.has(key(a)));
  if (known && pending.length >= toConfirm) ours = ours.filter((a) => Date.now() - a.at < 120000);
  store.set(AWAIT_KEY, ours);
  let extra = ours.filter((a) => !shown.has(key(a)));
  if (known && pending.length < toConfirm) extra = extra.slice(-(toConfirm - pending.length));
  return [...pending, ...extra.map((a) => ({ ...a, local: true }))].map((p) => ({ ...p, pending: true }));
}
const pendingRow = (r) => `<tr class="pend" style="opacity:.62">
      <td></td>
      <td>${ui.itemCell({ ...r, sub: `${r.amount > 1 ? `${r.amount} ${L('pcs', 'szt.')} · ` : ''}${L('not on the market yet', 'jeszcze nie na rynku')}` })}</td>
      <td><b>${steam.fmt(r.buyer)}</b><div class="sub">${L('you get', 'dostaniesz')} ${steam.fmt(r.recv)}</div></td>
      <td><span class="chipst mid" title="${L('Steam lists this item only after you confirm it in the mobile app, until then buyers can\'t see it', 'Steam wystawi tę ofertę dopiero po potwierdzeniu w aplikacji mobilnej, do tego czasu kupujący jej nie widzą')}">⏳ ${L('waiting for confirmation', 'czeka na potwierdzenie')}</span></td>
      <td colspan="2"><span class="sub">${L('Confirm it in the Steam app, under Confirmations', 'Potwierdź w aplikacji Steam → Potwierdzenia')}${r.local ? L(' (new price set in Flipster)', ' (nowa cena ustawiona we Flipsterze)') : ''}</span></td></tr>`;
// planned sales of trade-locked items (made in Ekwipunek, listed there when the lock ends)
const sellPlans = store.bucket('sellPlans');
const planList = () => Object.entries(sellPlans.all()).map(([hash, p]) => ({ ...p, hash, name: p.name || hash, appid: p.appid || 730 }))
  .sort((a, b) => (a.until || Infinity) - (b.until || Infinity));
const planRow = (p) => `<tr class="plan" style="background:rgba(102,192,244,.04)">
      <td></td>
      <td>${ui.itemCell({ ...p, sub: `${p.qty > 1 ? `${p.qty} ${L('pcs', 'szt.')} · ` : ''}${L('trade locked', 'z blokadą handlu')}${p.guard ? L(' · then the automation', ' · potem automat') : ''}` })}</td>
      <td>${p.mode === 'fixed' ? `<b>${steam.fmt(p.price)}</b><div class="sub">${L('you get', 'dostaniesz')} ${steam.fmt(steam.receivedFromBuyer(p.price))}</div>` : `<b>${L('suggested', 'proponowana')}</b><div class="sub">${p.min != null ? L(`not below ${steam.fmt(p.min)}`, `nie taniej niż ${steam.fmt(p.min)}`) : L('no lower limit', 'bez dolnej granicy')}</div>`}</td>
      <td><span class="chipst" style="color:#66c0f4;border-color:#2a6f9c" title="${L('When the lock ends, Flipster lists this item by itself (if some Steam page is open). You confirm the listing in the Steam app.', 'Gdy skończy się blokada, Flipster sam wystawi ten przedmiot (jeśli będzie otwarta jakaś strona Steama). Ofertę potwierdzasz w aplikacji Steam.')}">⏰ ${L('I\'ll list it', 'wystawię')} ${fmtWhen(p.until)}</span>${planStatus(p)}</td>
      <td colspan="2"><div class="acts" style="flex-wrap:nowrap;align-items:center">
        <button class="b" data-a="planedit" data-hash="${esc(p.hash)}" data-app="${p.appid}" title="${L('You change the plan on the item card in Inventory', 'Plan zmienisz na karcie przedmiotu w Ekwipunku')}">${L('Change in Inventory', 'Zmień w Ekwipunku')} ↗</button>
        <button class="b red" data-a="plandel" data-hash="${esc(p.hash)}">${L('Remove plan', 'Usuń plan')}</button>
      </div></td></tr>`;
const planMarket = new Map(); // hash → order book of a planned item (checked on refresh)
/** the plan on today's market: the price it would list at, its chance to sell, and a word on whether to change it */
function planStatus(p) {
  const h = planMarket.get(p.hash);
  if (!h) return L('<div class="sub" style="margin-top:4px">checking the market…</div>', '<div class="sub" style="margin-top:4px">sprawdzam rynek…</div>');
  const f = steam.fmt, N = waitDays(), days = daysTxt(N);
  const table = sig.fill(p.hash);
  const low = h.lowestSell;
  let price = p.mode === 'fixed' ? p.price : null, atMin = false;
  if (p.mode !== 'fixed') {
    const a = adviceOf({ hash: p.hash, appid: p.appid, marketable: true }, h);
    price = a?.price ?? p.min ?? null;
    if (p.min != null && price != null && price < p.min) { price = p.min; atMin = true; }
  }
  const cheapest = low ? ` · ${L('cheapest', 'najtańsza')} ${f(low)}` : '';
  if (price == null) return `<div class="sub" style="margin-top:4px">${L('today: no market data', 'dziś: brak danych z rynku')}${cheapest}</div>`;
  const c = table ? sellChance(table, N, price, h.sellGraph) : null;
  const what = p.mode === 'fixed' ? L('your price', 'Twoja cena') : atMin ? L('your minimum', 'Twoje minimum') : L('suggestion', 'propozycja');
  const line = `${L('today', 'dziś')}: ${what} <b>${f(price)}</b>${c != null ? ` · ${L(`chance within ${days}`, `szansa w ${days}`)}: ${Math.round(c * 100)}%` : ''}${cheapest}`;
  let verdict;
  if (h.highestBuy && price <= h.highestBuy) verdict = `<span class="warn">${L(`not above the buy order (${f(h.highestBuy)}), it will sell right away`, `nie wyżej niż zlecenie kupna (${f(h.highestBuy)}), sprzeda się od razu`)}</span>`;
  else if (c != null && c < 0.25) verdict = `<span class="err">${L('too pricey today, small chance', 'dziś za drogo, małe szanse')}${atMin || p.mode === 'fixed' ? L(', consider a lower price', ', rozważ niższą cenę') : ''}</span>`;
  else if (c != null && c < 0.5) verdict = `<span class="warn">${L(`will probably wait longer than ${days}`, `raczej poczeka dłużej niż ${days}`)}</span>`;
  else if (c != null) verdict = `<span class="ok">${L('looks good', 'wygląda dobrze')}</span>`;
  return `<div class="sub" style="margin-top:4px">${line}</div>${verdict ? `<div class="sub">${verdict}</div>` : ''}`;
}
async function checkPlans() {
  for (const p of planList()) {
    try { planMarket.set(p.hash, await prices.hist(p.appid, p.hash, 10 * 60000)); render(); } catch { /* next refresh */ }
  }
}
let el;
let task = null;
let lastAuto = null;
const sort = ui.sorter('name', 1);

const myPriceMap = (hash) => {
  const m = {};
  for (const r of rows) if (r.hash === hash) m[r.buyer] = (m[r.buyer] || 0) + 1;
  return m;
};

/** the waiting time as the fill table knows it (1, 2, 4 or 7 days) */
const waitDays = () => horizonOf(settings.maxWaitDays ?? 2);

export function mount(root) {
  el = root;
  root.innerHTML = `
    <div class="bar">
      <button class="b" data-a="reload" title="${L('Loads your listings and checks competitor prices', 'Wczytuje oferty i sprawdza ceny konkurencji')}">⟳ ${L('Refresh', 'Odśwież')}</button>
      <span class="sub" id="l-tick" title="${L(`While the panel is open on this tab, listings and competition refresh by themselves. How often is set in ⚙ next to it.`, `Gdy panel jest otwarty na tej zakładce, oferty i konkurencja odświeżają się same. Co ile minut, ustawisz w ⚙ obok.`)}"></span>
      <span class="sub" id="l-comp"></span> <span class="sub" id="l-note"></span>
      <span class="sp"></span>
      <button class="b" data-a="pricepanel" title="${L(`How to calculate suggested prices and competition, how often to refresh`, `Jak liczyć proponowane ceny i konkurencję, co ile odświeżać`)}">⚙ <b id="l-pricesum"></b></button>
      <button class="b dbg" data-a="research" title="${L('Downloads the order book and the full price history of the items you have listed from the Steam market and saves them to a file, for a joint analysis of whether and at what price to sell. Read only, it buys and lists nothing.', 'Pobiera z Rynku Steam księgę zleceń i pełną historię cen przedmiotów, które masz wystawione i zapisuje je do pliku, do wspólnej analizy, czy i po ile sprzedawać. Tylko odczyt, niczego nie kupuje ani nie wystawia.')}">⬇ ${L('Data for analysis', 'Dane do analizy')}</button>
      <span class="btng">
        <button class="b" data-a="autotoggle" title="${L(`Click to turn the automation on or off. Every few minutes it undercuts the competition for listings where you tick "Automation watches this listing" in ⚙ and set a lowest price.`, `Kliknij, żeby włączyć albo wyłączyć automat. Co kilka minut podcina konkurencję ofertom, przy których w ⚙ zaznaczysz „Automat pilnuje tej oferty” i najniższą cenę.`)}"></button>
        <button class="b" data-a="autopanel" title="${L(`Automation settings: how often, undercut, raising the price`, `Ustawienia automatu: co ile minut, podcięcie, podnoszenie ceny`)}">⚙</button>
      </span>
      <button class="b" data-a="stop" hidden>■ Stop</button>
    </div>
    <div id="l-pricepanel" hidden class="note" style="padding:12px 14px">
      <div style="display:grid;grid-template-columns:max-content max-content 1fr;gap:8px 14px;align-items:center">
        <b>${L(`Time to sell`, `Czas na sprzedaż`)}</b>
        <select id="l-wait">${[1, 2, 4, 7].map((d) => `<option value="${d}" ${waitDays() === d ? 'selected' : ''}>${daysTxt(d)}</option>`).join('')}</select>
        <span class="sub">${L('the suggested price ("List for", "Set") should sell within this time', 'proponowana cena („Wystaw za”, „Ustaw”) ma się sprzedać w tym czasie')}</span>
        <b>${L('Skip listings below the normal price', 'Pomijaj oferty poniżej normalnej ceny')}</b>
        <label class="tgl"><input type="checkbox" id="l-ign" ${(settings.ignoreBelow ?? 2) > 1 ? 'checked' : ''}><span class="tr"></span></label>
        <span class="sub">${L('I don\'t go down to them if they will sell quickly anyway', 'nie schodzę do nich, jeśli i tak szybko się sprzedadzą')}</span>
        <b>${L('Refresh every', 'Odświeżaj co')}</b>
        <span><input type="number" id="l-refmin" min="1" max="60" value="${refreshMin()}" style="width:60px"> min</span>
        <span class="sub">${L(`while the panel is open on this tab I load your listings and check the competition (more often means more requests to Steam)`, `gdy panel jest otwarty na tej zakładce: wczytuję Twoje oferty i sprawdzam konkurencję (częściej = więcej zapytań do Steama)`)}</span>
      </div>
    </div>
    <div id="l-bulk" class="bar" hidden style="position:static;background:rgba(102,192,244,.06)">
      <span id="l-bulkn"></span>
      <button class="b" data-a="bulkset">${L('Set suggested prices', 'Ustaw proponowane ceny')}</button>
      <button class="b red" data-a="remove">${L('Remove', 'Zdejmij')}</button>
      <button class="b" data-a="selnone">${L('deselect', 'odznacz')}</button>
    </div>
    <table><thead><tr>
      <th style="width:1%"><input type="checkbox" id="l-all" title="${L(`select all`, `zaznacz wszystkie`)}"></th>
      <th data-sort="name">${L('Item', 'Przedmiot')}</th><th data-sort="buyer">${L('Your price', 'Twoja cena')}</th><th data-sort="comp">${L('Market', 'Rynek')}</th><th>${L('Suggested price', 'Proponowana cena')}</th><th></th>
    </tr></thead><tbody></tbody></table>`;

  root.addEventListener('click', (e) => {
    const th = e.target.closest('th[data-sort]');
    if (th) { sort.click(th.dataset.sort); render(); return; }
    const fl = e.target.closest('[data-fl]');
    if (fl) { const r = rows.find((x) => x.listingid === fl.dataset.fl); if (r?.item?.float != null) floatCheck({ ...r.item, hash: r.hash, name: r.name, appid: r.appid }); return; }
    const btn = e.target.closest('button');
    const a = btn?.dataset.a;
    if (!a) return;
    const r = btn.dataset.id ? rows.find((x) => x.listingid === btn.dataset.id) : null;
    ({
      plandel: () => { sellPlans.del(btn.dataset.hash); ui.log(L(`Sale plan removed: ${btn.dataset.hash}`, `Plan sprzedaży usunięty: ${btn.dataset.hash}`)); render(); },
      planedit: () => { ui.show('inv'); focusItem(btn.dataset.hash, { appid: +btn.dataset.app || 730 }); },
      reload: () => { lastComp = 0; refresh(); }, stop: () => { task?.cancel(); research.cancelResearch(); }, 
      research: () => research.exportResearch([...rows, ...pend].map((x) => ({ hash: x.hash, appid: x.appid })), L('you listed on the market', 'wystawionych przez Ciebie na rynku'), { onBusy: (b) => (el.querySelector('[data-a="stop"]').hidden = !b) }),
      autopanel: autoDialog, autotoggle: () => setAuto(!settings.autoRelist),
      pricepanel: () => { const p = el.querySelector('#l-pricepanel'); p.hidden = !p.hidden; },
      set: () => r && relistOne(r, suggest(r).price), setown: () => r && relistOne(r, r.newBuyer), rm: () => r && removeOne(r),
      cfg: () => { if (r) { openCfg = openCfg === r.listingid ? null : r.listingid; render(); } },
      bulkset: bulkSet, remove: doRemove, selnone: () => { rows.forEach((x) => (x.checked = false)); render(); },
    })[a]?.();
  });
  root.querySelector('#l-all').onchange = (e) => { rows.forEach((r) => (r.checked = e.target.checked)); render(); };
  priceSum = () => {
    const n = settings.ignoreBelow ?? 2, d = waitDays();
    el.querySelector('#l-pricesum').textContent = `${L(`sell within ${daysTxt(d)}`, `sprzedaż w ${daysTxt(d)}`)}${n > 1 ? L(' · skipping underpriced', ' · pomijam zaniżone') : ''} · ${L(`refresh every ${refreshMin()} min`, `odświeżanie co ${refreshMin()} min`)}`;
  };
  priceSum();
  autoBtn();
  root.querySelector('#l-wait').onchange = (e) => { settings.maxWaitDays = +e.target.value || 2; priceSum(); render(); };
  root.querySelector('#l-ign').onchange = (e) => { settings.ignoreBelow = e.target.checked ? 2 : 1; priceSum(); lastComp = 0; refresh(); };
  root.querySelector('#l-refmin').onchange = (e) => { settings.listRefreshMin = Math.min(60, Math.max(1, Math.round(+e.target.value) || 2)); e.target.value = settings.listRefreshMin; priceSum(); tick(); };
  // don't redraw the table while the user is typing into one of its inputs
  root.querySelector('tbody').addEventListener('focusout', () => setTimeout(() => { if (pendingRender) render(); }, 0));
  // listings and competition reload by themselves every listRefreshMin while this tab is on screen, with a countdown
  setInterval(() => {
    if (!(ui.isOpen() && el.closest('.tab')?.classList.contains('on') && el.offsetParent)) return;
    // not while the browser tab is in the background (nobody looks; back in front it refreshes at once, being due)
    if (!busy() && !document.hidden && Date.now() >= nextAt()) refresh();
    tick();
  }, 1000);
  root.querySelector('tbody').addEventListener('change', onInput);
  patterndb.load().then((fresh) => { if (fresh && rows.length) render(); }); // 💎 rare seeds next to the float
  refresh();
}

export const show = () => {};

/** the automat's main switch (toolbar and dialog show the same state) */
function setAuto(on) {
  settings.autoRelist = on;
  ui.log(on ? L('Automation on.', 'Automat włączony.') : L('Automation off.', 'Automat wyłączony.'), 'ok');
  auto.reschedule();
  updateAuto();
  render();
}
/** the toolbar button shows the state (also when another tab switched it) */
function autoBtn() {
  const b = el?.querySelector('[data-a="autotoggle"]');
  if (!b) return;
  const on = !!settings.autoRelist;
  b.classList.toggle('on', on);
  b.innerHTML = `<i class="adot"></i>${L('Auto', 'Automat')}: <b>${on ? L('on', 'wł.') : L('off', 'wył.')}</b>`;
}
/** ⚙ next to the switch: how often, raising the price, the undercut; every change is saved right away */
function autoDialog() {
  ui.ask(L('Automation', 'Automat'), `
    <div class="row2" style="padding:0 0 6px">
      <label>${L(`Every (minutes)`, `Co ile minut`)}<input type="number" min="2" id="l-every" value="${settings.autoRelistEvery}" style="width:70px"></label>
      <label title="${L('How much cheaper than the cheapest other listing the automation sets the price (also the “Lowest − undercut” option in the List window)', 'O tyle taniej od najtańszej innej oferty automat ustawia cenę (i opcja „Najniższa − podcięcie” w oknie Wystaw)')}">${L('Undercut by (zł)', 'Podcinaj o (zł)')}<input class="p" id="l-under" value="${toInput(settings.undercut)}" style="width:70px"></label>
    </div>
    <div style="display:flex;gap:8px;align-items:center;margin-top:12px"><button class="b" id="l-autonow">${L(`Check now`, `Sprawdź teraz`)}</button><span class="sub" id="l-autoinfo"></span></div>
    <div class="sub" style="margin-top:12px;line-height:1.5">${L(`You turn the automation on and off with the "Auto" button on the bar. Every few minutes it sets listings to the undercut below the cheapest competitor. When the rest are pricier, it raises the price, but at most to the suggested one (above it the item would hardly sell). It only touches listings where you tick "Automation watches this listing" in "⚙" and set a <b>lowest price</b>, and it never goes below it. You still confirm every change in the Steam app.`, `Automat włączasz i wyłączasz przyciskiem „Automat” na pasku. Co kilka minut ustawia ofertom cenę o podcięcie niższą od najtańszej konkurencji. Gdy reszta jest droższa, podnosi cenę, ale najwyżej do proponowanej (wyżej przedmiot raczej się nie sprzeda). Obejmuje tylko oferty, przy których w „⚙” zaznaczysz „Automat pilnuje tej oferty” i ustawisz <b>najniższą cenę</b>, poniżej niej nigdy nie zejdzie. Każdą zmianę i tak potwierdzasz w aplikacji Steam.`)}</div>`, {
    ok: L('Close', 'Zamknij'), cancel: null,
    onOpen: (m) => {
      m.querySelector('#l-every').onchange = (e) => { settings.autoRelistEvery = Math.max(2, +e.target.value || 10); e.target.value = settings.autoRelistEvery; auto.reschedule(); updateAuto(); };
      m.querySelector('#l-under').onchange = (e) => { const v = parsePrice(e.target.value); settings.undercut = isNaN(v) ? 1 : v; e.target.value = toInput(settings.undercut); priceSum(); render(); };
      m.querySelector('#l-autonow').onclick = () => { auto.runNow(); ui.log(L('Automation: checking now.', 'Automat: sprawdzam teraz.')); };
      updateAuto();
    },
  });
}
let openCfg = null; // listing id whose settings row is open

function onInput(e) {
  const tr = e.target.closest('tr[data-id]');
  if (!tr) return;
  const r = rows.find((x) => x.listingid === tr.dataset.id);
  const f = e.target.dataset.f;
  if (f === 'chk') { r.checked = e.target.checked; render(); return; }
  if (f === 'auto') { rules.patch(r.hash, { auto: e.target.checked }); r.rule = rules.get(r.hash); render(); return; }
  const v = e.target.value.trim() === '' ? null : parsePrice(e.target.value);
  if (v != null && isNaN(v)) { e.target.value = ''; return; }
  if (f === 'new') { r.newBuyer = v; rules.patch(r.hash, { target: v }); }
  if (f === 'min') rules.patch(r.hash, { min: v });
  if (f === 'max') rules.patch(r.hash, { max: v });
  rows.filter((x) => x.hash === r.hash).forEach((x) => (x.rule = rules.get(r.hash)));
  render();
}

/**
 * proposed price: one cent (the undercut) below the cheapest other seller, within your min/max, and compared with
 * what the item actually sold for in the last days (if the competition dumps far below that, say so)
 */
// warnings shared by both ways of suggesting a price
const NEAR_INSTANT = (r) => L(`you'd get almost the same right away (buy order ${steam.fmt(r.h.highestBuy)})`, `prawie tyle samo dostaniesz od ręki (zlecenie kupna ${steam.fmt(r.h.highestBuy)})`);
const PLAIN_COPY = () => L('priced like a plain copy, float and stickers aren\'t included', 'cena jak za zwykły egzemplarz, float i naklejki nie są wliczone');
const fmtWait = (d) => (d < 1 / 24 ? L('less than an hour', 'mniej niż godzinę') : d < 1 ? L(`about ${Math.round(d * 24)} h`, `ok. ${Math.round(d * 24)} godz.`) : L(`about ${d.toFixed(1).replace('.', ',')} days`, `ok. ${d.toFixed(1).replace('.', ',')} dnia`));
/** "1 tańsza oferta", "3 tańsze oferty", "5 tańszych ofert" */
const aheadTxt = (n) => L(n === 1 ? '1 cheaper listing' : `${n} cheaper listings`,
  n === 1 ? '1 tańsza oferta' : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? `${n} tańsze oferty` : `${n} tańszych ofert`);
/** the sell graph without my own listings (or "one cent under the cheapest" would undercut myself) */
function othersGraph(r) { return graphWithout(r.h.sellGraph, myPriceMap(r.hash)); }
/** a cumulative sell graph with my listings (price → how many) taken out */
function graphWithout(sellGraph, mine = {}) {
  const left = { ...mine };
  let cum = 0;
  const others = [];
  for (const l of levels(sellGraph)) {
    const own = Math.min(left[l.price] || 0, l.qty);
    left[l.price] = (left[l.price] || 0) - own;
    if (l.qty - own > 0) others.push([l.price, (cum += l.qty - own)]);
  }
  return others;
}
function suggest(r) {
  const rule = r.rule || {};
  const typ = sig.typical(r.hash);
  const unique = r.item?.float != null || r.item?.stickers?.length;
  let price = null, why = '', warn = '';
  // only prices that exist after fees (2,29 zł doesn't: it would be listed as 2,27 zł and proposed again forever)
  const snap = (p, up) => steam.achievable(p, r.pub, up);
  const real = (p) => { if (p == null) return p; const v = snap(p, false); return rule.min != null && v < rule.min ? snap(rule.min, true) : v; };
  // the item's own hour-by-hour record first (listAdviceFill, same as the 💡 on inventory cards), against the
  // listings of the others (yours taken out, or "one cent under the cheapest" would undercut yourself)
  const table = sig.fill(r.hash);
  if (table && r.h) {
    const others = othersGraph(r);
    const fa = listAdviceFill({ table, sellGraph: others.length ? others : r.h.sellGraph, highestBuy: r.h.highestBuy, net: (p) => steam.receivedFromBuyer(p, r.pub), maxWaitDays: settings.maxWaitDays ?? 2, undercut: settings.undercut });
    if (fa) {
      price = real(rule.max != null ? Math.min(fa.price, rule.max) : fa.price);
      const days = daysTxt(fa.horizon);
      why = fa.instantBest ? L(`sell right away to the buy order (${steam.fmt(fa.price)}), waiting won't give more on average`, `sprzedaj od razu do zlecenia kupna (${steam.fmt(fa.price)}), czekanie średnio nie da więcej`) : L(`chance to sell within ${days}: ${Math.round(fa.chance * 100)}% (from the item's history of the last month)`, `szansa sprzedaży w ${days}: ${Math.round(fa.chance * 100)}% (z historii przedmiotu z ostatniego miesiąca)`);
      if (fa.lowChance) warn = L('even at a lower price the chance is below 50%, the market is slow', 'nawet przy niższej cenie szansa jest poniżej 50%, rynek słabo bierze');
      if (fa.falling) warn = (warn ? warn + '; ' : '') + L('after a few days the price was usually lower, don\'t wait too long', 'po kilku dniach cena była zwykle niższa, nie przeciągaj');
      if (rule.max != null && fa.price > rule.max) warn = (warn ? warn + '; ' : '') + L('limited by your maximum', 'ograniczone Twoim maksimum');
      if (r.h.highestBuy && steam.receivedFromBuyer(price, r.pub) <= steam.receivedFromBuyer(r.h.highestBuy + 1, r.pub)) warn = (warn ? warn + '; ' : '') + NEAR_INSTANT(r);
      if (unique) warn = (warn ? warn + '; ' : '') + PLAIN_COPY();
      return { price, why, warn, typ };
    }
  }
  // fallback (no hourly history yet): the highest price that still sells within the accepted wait (queue of cheaper
  // listings ÷ listing purchases per day, only part of all sales take listings, the rest go to buy orders: LIST_SHARE)
  const perDay = (typ?.sold7 ? typ.sold7 / 7 : prices.cached(r.appid, r.hash)?.volume || 0) * LIST_SHARE || null;
  const falling = typ?.d7 && typ?.d30 && typ.d7 < typ.d30 * 0.9;
  const maxWait = (settings.maxWaitDays ?? 2) * (falling ? 0.5 : 1);
  // same rules as the advice on inventory cards (listAdvice): cap 1.25 × the typical recent sale; skins with a float
  // are priced like any copy in their wear (that's how buyers sort), with a note that a special one may be worth more
  const typical = typ?.d7 ?? typ?.d30;
  // capped by what at least half of the recent units sold at too: the queue counts buyers, not what they pay
  const caps = [typical ? Math.round(typical * 1.25) : null, sig.recentMedian(r.hash)].filter((x) => x > 0);
  const opt = r.h && perDay ? optimalSellPrice({ sellGraph: r.h.sellGraph, mine: myPriceMap(r.hash), perDay, maxWaitDays: maxWait, undercut: settings.undercut, cap: caps.length ? Math.min(...caps) : null, rule }) : null;
  if (opt) {
    price = real(opt.price);
    // the queue model promises too much when hardly anyone pays this much: then say what the sales were instead
    const sold = sig.soldAt(r.hash, price);
    const rare = sold && sold.total >= 3 && sold.n * 2 < sold.total;
    const rate = perDay >= 1 ? `~${Math.round(perDay)}` : `~${perDay.toFixed(1).replace('.', ',')}`;
    why = rare
      ? L(`in ${sold.days} days only ${sold.n} of ${sold.total} units sold at this price or more${opt.ahead ? `, ${aheadTxt(opt.ahead)} ahead of you` : ''}`, `w ${sold.days} dni po tej cenie lub drożej sprzedano tylko ${sold.n} z ${sold.total} szt.${opt.ahead ? `, przed Tobą ${aheadTxt(opt.ahead)}` : ''}`)
      : L(`sells in ${fmtWait(opt.waitDays)}${opt.ahead ? ` (${aheadTxt(opt.ahead)} ahead of you, listings go at ${rate}/day)` : ''}`, `sprzeda się w ${fmtWait(opt.waitDays)}${opt.ahead ? ` (przed Tobą ${aheadTxt(opt.ahead)}, z ofert schodzi ${rate}/dzień)` : ''}`);
    if (r.comp != null && price > r.comp) why += ` · ${L(`${steam.fmt(price - r.comp)} more than the cheapest listing`, `${steam.fmt(price - r.comp)} więcej niż najtańsza oferta`)}`;
    if (falling) warn = L('the price is falling, I halved the waiting time', 'cena spada, skróciłem czas czekania o połowę');
    if (opt.belowMin) warn = (warn ? warn + '; ' : '') + L('your minimum is above the market, it may not sell for a long time', 'Twoje minimum jest wyżej niż rynek, może się długo nie sprzedać');
    if (r.h.highestBuy && steam.receivedFromBuyer(price) <= steam.receivedFromBuyer(r.h.highestBuy + 1)) warn = (warn ? warn + '; ' : '') + NEAR_INSTANT(r);
    if (unique) warn = (warn ? warn + '; ' : '') + PLAIN_COPY();
    return { price, why, warn, typ };
  }
  if (r.comp != null) {
    const t = relistTarget({ current: -1, competitor: r.comp, rule: { ...rule, undercut: settings.undercut, raise: true }, snap });
    price = t.price;
    const raw = r.comp - settings.undercut;
    why = rule.min != null && raw < rule.min ? L('your minimum', 'Twoje minimum') : rule.max != null && raw > rule.max ? L('your maximum', 'Twoje maksimum')
      : L(`${steam.fmt(r.comp - price)} cheaper than the cheapest competitor`, `o ${steam.fmt(r.comp - price)} taniej niż najtańsza konkurencja`) + (r.comp - price > settings.undercut ? L(' (Steam doesn\'t allow a closer price)', ' (bliższej ceny Steam nie pozwala ustawić)') : '');
    if (typ?.d7 && r.comp < typ.d7 * 0.85) warn = L(`the competition is ${Math.round((1 - r.comp / typ.d7) * 100)}% below the typical price, you can wait`, `konkurencja jest ${Math.round((1 - r.comp / typ.d7) * 100)}% poniżej typowej ceny, możesz poczekać`);
  } else if (typ?.d7) {
    price = real(rule.max ?? Math.round(typ.d7));
    why = rule.max != null ? L('nobody else sells, your maximum', 'nikt inny nie sprzedaje, Twoje maksimum') : L('nobody else sells, the average of the last 7 days', 'nikt inny nie sprzedaje, średnia z ostatnich 7 dni');
  }
  if (unique && price != null) warn = (warn ? warn + '; ' : '') + L('you have a unique copy (float/stickers), the cheapest listing may be worse than yours', 'masz unikalny egzemplarz (float/naklejki), najtańsza oferta może być gorsza od Twojej');
  return { price, why, warn, typ };
}

/**
 * How your CURRENT price looks by the item's own record (same table as the proposal): the chance that someone pays
 * it within the wait. < 25% too expensive, < 50% expensive, ≥ 90% while the proposal is higher: cheap. null = no data.
 */
/** "float 0.0030 ★", clickable (float checker); ★ = lowest 5% of its wear, gold = lowest 1% */
function floatSub(r) {
  const it = { float: r.item.float, hash: r.hash };
  const k = floatRankOf(it);
  const title = k ? L(`Only ${shareTxt(k.lower)} of copies in ${k.wear} have a lower float. Click to compare with market listings.`, `Niższy float ma tylko ${shareTxt(k.lower)} egzemplarzy w stanie ${k.wear}. Kliknij, żeby porównać z ofertami na rynku.`) : L('Click to compare the float with market listings.', 'Kliknij, żeby porównać float z ofertami na rynku.');
  return `<span data-fl="${esc(r.listingid)}" title="${esc(title)}" style="cursor:pointer;border-bottom:1px dotted currentColor;${k && k.lower <= 0.05 ? 'color:#e5b84c' : ''}">float ${r.item.float.toFixed(4)}</span>${floatMarks(it, k)}${r.item.seed != null ? ` · seed ${r.item.seed} ${patternChip(patternFor(r.hash, r.item.seed))}` : ''}`;
}

function evalListing(r, s = null) {
  const t = sig.fill(r.hash);
  if (!t) return null;
  const N = waitDays();
  const c = sellChance(t, N, r.buyer, r.h ? othersGraph(r) : null);
  if (c == null) return null;
  const days = daysTxt(N);
  if (c < 0.25) return { c, days, k: 'high', label: L('too pricey', 'za drogo'), cls: 'err' };
  if (c < 0.5) return { c, days, k: 'pricey', label: L('pricey', 'drogo'), cls: 'warn' };
  if (s?.price != null && s.price > r.buyer && c >= 0.9) return { c, days, k: 'cheap', label: L('cheap, you can ask more', 'tanio, możesz więcej'), cls: 'warn' };
  return { c, days, k: 'ok', label: L('fine', 'w porządku'), cls: 'ok' };
}

function chip(r) {
  if (r.comp == null) return r.lowest != null ? `<span class="chipst mut">${L('nobody else sells', 'nikt inny nie sprzedaje')}</span>` : compRunning ? `<span class="chipst mut">${L('checking…', 'sprawdzam…')}</span>` : '<span class="chipst mut">-</span>';
  if (r.comp > r.buyer) return `<span class="chipst ok">${L('cheapest', 'najtańsza')}</span>`;
  if (r.comp === r.buyer) return `<span class="chipst mid">${L('tie', 'remis')}</span>`;
  return `<span class="chipst bad">${L(`someone is ${steam.fmt(r.buyer - r.comp)} cheaper`, `ktoś taniej o ${steam.fmt(r.buyer - r.comp)}`)}</span>`;
}

function render() {
  if (!el) return; // the automation also runs in tabs where this list was never opened
  const tb = el.querySelector('tbody');
  const cnt = document.querySelector('#stt [data-mt="sell"] .cnt');
  const plans = planList();
  if (cnt) cnt.textContent = `(${rows.length}${pend.length ? ` + ${pend.length}⏳` : ''}${plans.length ? ` + ${plans.length}⏰` : ''})`;
  const a = document.activeElement;
  if (a && tb.contains(a) && a.tagName === 'INPUT' && a.type !== 'checkbox') { pendingRender = true; return; }
  pendingRender = false;
  const sel = rows.filter((r) => r.checked);
  el.querySelector('#l-bulk').hidden = !sel.length;
  el.querySelector('#l-bulkn').textContent = L(`Selected ${sel.length}:`, `Zaznaczono ${sel.length}:`);
  if (!rows.length && !pend.length && !plans.length) { tb.innerHTML = L('<tr><td colspan="6" class="empty">You have nothing listed. You list items in the Inventory tab.</td></tr>', '<tr><td colspan="6" class="empty">Nie masz wystawionych przedmiotów. Wystawiasz je w zakładce Ekwipunek.</td></tr>'); return; }
  const sorted = sort.apply([...rows, ...pend], { name: (r) => r.name, buyer: (r) => r.buyer, comp: (r) => (r.comp == null ? null : r.comp - r.buyer) });
  tb.innerHTML = sorted.map((r) => {
    if (r.pending) return pendingRow(r);
    const rule = r.rule || {};
    const s = suggest(r);
    const sub = [wearShort(r.hash), r.item?.float != null ? floatSub(r) : '', r.item?.nameTag ? `🏷 „${esc(r.item.nameTag)}”` : '', L(`listed ${timeAgo(r.created)}`, `wystawiono ${timeAgo(r.created)}`), r.amount > 1 ? `${r.amount} ${L('pcs', 'szt.')}` : ''].filter(Boolean).join(' · ');
    const same = s.price != null && s.price === r.buyer;
    // "auto": this offer is in the automat's care; grey when the main switch is off (then nothing happens to it)
    const autoOff = !settings.autoRelist;
    const autoTag = rule.auto ? `<span class="chipst ${autoOff ? 'mut' : rule.min != null ? 'ok' : 'mid'}" title="${rule.min == null ? L('The automation should watch this listing, but without a lowest price it skips it. Set one in ⚙.', 'Automat ma pilnować tej oferty, ale bez najniższej ceny ją pominie. Ustaw ją w ⚙.') : autoOff ? L(`The automation should watch this listing (not below ${steam.fmt(rule.min)}), but it's off. Turn it on with "⚙ Auto" at the top.`, `Automat ma pilnować tej oferty (nie niżej niż ${steam.fmt(rule.min)}), ale jest wyłączony: włączysz go w „⚙ Automat” u góry.`) : L(`The automation watches the price and won't go below ${steam.fmt(rule.min)}`, `Automat pilnuje ceny, nie zejdzie poniżej ${steam.fmt(rule.min)}`)}">auto${autoOff ? L(' (off)', ' (wył.)') : ''}</span>` : '';
    const main = `<tr data-id="${r.listingid}">
      <td><input type="checkbox" data-f="chk" ${r.checked ? 'checked' : ''}></td>
      <td>${ui.itemCell({ ...r, sub })}</td>
      <td><b>${steam.fmt(r.buyer)}</b><div class="sub">${L(`you get`, `dostaniesz`)} ${steam.fmt(r.recv)}</div>${(() => {
        const e = evalListing(r, s);
        return e ? `<div class="sub ${e.cls}" title="${L(`The chance that someone pays your current price within ${e.days}, from this item's history of the last month, hour by hour (the suggested price next to it is calculated the same way). You set the waiting time in "sell within … days".`, `Szansa, że ktoś zapłaci Twoją obecną cenę w ciągu ${e.days}, z historii tego przedmiotu z ostatniego miesiąca, godzina po godzinie (tak samo liczona jest proponowana cena obok). Długość czekania ustawiasz w „sprzedaj w ciągu … dni”.`)}">${L('chance within', 'szansa w')} ${e.days}: ${Math.round(e.c * 100)}% · ${e.label}</div>` : '';
      })()}</td>
      <td>${chip(r)} ${autoTag}<div class="sub" style="margin-top:3px">${r.comp != null ? `${L(`cheapest other`, `najtańsza inna`)}: ${steam.fmt(r.comp)}` : ''}${r.stray != null ? ` <span title="${L('The cheaper listings are below this item\'s normal price and at its sales pace they will sell within your selling time, so waiting pays more than going down to them.', 'Tańsze oferty są poniżej normalnej ceny tego przedmiotu i przy jego tempie sprzedaży zejdą w Twoim czasie na sprzedaż: bardziej opłaca się poczekać, niż schodzić do nich.')}">(${L('skipping underpriced, cheapest', 'pomijam zaniżone, najtańsza')} ${steam.fmt(r.stray)})</span>` : ''}${s.typ?.d7 ? `${r.comp != null ? ' · ' : ''}<span title="${esc(L(`The average price this item actually sold for:
last 7 days: ${steam.fmt(Math.round(s.typ.d7))} (${s.typ.sold7} pcs)${s.typ.d30 ? `
last 30 days: ${steam.fmt(Math.round(s.typ.d30))}` : ''}`, `Średnia cena, za jaką ten przedmiot faktycznie się sprzedał:
ostatnie 7 dni: ${steam.fmt(Math.round(s.typ.d7))} (${s.typ.sold7} szt.)${s.typ.d30 ? `
ostatnie 30 dni: ${steam.fmt(Math.round(s.typ.d30))}` : ''}`))}">${L('sells at', 'sprzedaje się po')} ~${steam.fmt(Math.round(s.typ.d7))}</span>` : ''} · <a class="acc" target="_blank" href="${esc(ui.marketUrl(r.appid, r.hash))}">${L(`market`, `rynek`)} ↗</a></div></td>
      <td>${s.price != null ? `<b>${steam.fmt(s.price)}</b><div class="sub" title="${esc(s.why)}">${L(`you get`, `dostaniesz`)} ${steam.fmt(steam.receivedFromBuyer(s.price, r.pub))} · ${esc(s.why)}</div>${s.warn ? `<div class="sub warn">${esc(s.warn)}</div>` : ''}` : L('<span class="sub">waiting for market data…</span>', '<span class="sub">czekam na dane rynku…</span>')}${r.status ? `<div class="sub ${r.cls || ''}">${esc(r.status)}</div>` : ''}</td>
      <td style="white-space:nowrap"><div class="acts" style="flex-wrap:nowrap;align-items:center">
        ${s.price != null && !same ? `<button class="b ${s.price < r.buyer ? '' : 'go'}" data-a="set" data-id="${r.listingid}" title="${L(`Removes the listing and lists it again at ${steam.fmt(s.price)} (asks first)`, `Zdejmie ofertę i wystawi ją za ${steam.fmt(s.price)} (z potwierdzeniem)`)}">${L('Set', 'Ustaw')} ${steam.fmt(s.price)}</button>` : same ? `<span class="sub ok" style="white-space:nowrap">${L('price OK', 'cena OK')}</span>` : ''}
        <button class="b red" data-a="rm" data-id="${r.listingid}" title="${L('Remove from the market, it goes back to the inventory', 'Zdejmij z rynku, wróci do ekwipunku')}">${L('Remove', 'Zdejmij')}</button>
        <button class="b ${openCfg === r.listingid ? 'on' : ''}" data-a="cfg" data-id="${r.listingid}" title="${L(`Your own price, minimum/maximum price and automation`, `Własna cena, cena minimalna/maksymalna i automat`)}">⚙</button>
      </div></td></tr>`;
    if (openCfg !== r.listingid) return main;
    // two different things: a one-off price change now, and this item's lasting price limits (the proposal and the
    // automat stay inside them)
    return main + `<tr class="cfg" data-id="${r.listingid}"><td></td><td colspan="5"><div class="cfgbox">
      <div>
        <div class="lb">${L('Change the price now', 'Zmień cenę teraz')}</div>
        <div class="line">
          <span>${L('Price', 'Cena')}</span><span class="inp"><input class="p" data-f="new" value="${toInput(r.newBuyer)}" placeholder="${L('e.g. 150', 'np. 150')}"><span>zł</span></span>
          <button class="b go" data-a="setown" data-id="${r.listingid}" ${r.newBuyer == null ? 'disabled' : ''}>${L('List at this price', 'Wystaw za tę cenę')}</button>
        </div>
        <div class="sub">${L('one-off, I remove the listing and list it at this price, you confirm in the Steam app', 'jednorazowo: zdejmę ofertę i wystawię ją za tę cenę, potwierdzasz w aplikacji Steam')}</div>
      </div>
      <div>
        <div class="lb">${L('Price limits', 'Granice ceny')}</div>
        <div class="line">
          <span>${L('Price from', 'Cena od')}</span><span class="inp" title="${L('The lowest price, the suggested price and the automation never go below it', 'Najniższa cena: proponowana cena i automat nigdy nie zejdą niżej')}"><input class="p" data-f="min" value="${toInput(rule.min)}" placeholder="${L('none', 'brak')}"><span>zł</span></span>
          <span>${L('to', 'do')}</span><span class="inp" title="${L('The highest price, the automation won\'t raise above it and the suggested price won\'t be higher either', 'Najwyższa cena: automat nie podniesie wyżej, proponowana cena też nie będzie wyższa')}"><input class="p" data-f="max" value="${toInput(rule.max)}" placeholder="${L('none', 'brak')}"><span>zł</span></span>
        </div>
        <div class="sub">${L('the suggested price and the automation stay within these limits, an empty field means no limit', 'proponowana cena i automat zostają w tych granicach, puste pole = bez granicy')}</div>
        <label class="tgl" style="margin-top:8px;padding-left:0"><input type="checkbox" data-f="auto" ${rule.auto ? 'checked' : ''}><span class="tr"></span>${L('Automation watches this listing', 'Automat pilnuje tej oferty')}</label>
        <div class="sub">${L('every few minutes it undercuts cheaper ones and never goes below the minimum', 'co kilka minut podcina tańszych, nie zejdzie poniżej minimum')}${settings.autoRelist ? '' : `. <span class="warn">${L('The automation is off now, turn it on with "⚙ Auto" at the top', 'Automat jest teraz wyłączony: włączysz go w „⚙ Automat” u góry')}</span>`}</div>
        ${rule.auto && rule.min == null ? `<div class="warn sub">${L('enter the lowest price ("Price from"), without it the automation skips this listing', 'wpisz najniższą cenę („Cena od”), bez niej automat pominie tę ofertę')}</div>` : ''}
      </div>
    </div></td></tr>`;
  }).join('') + (plans.length ? `<tr><td colspan="6" class="sub" style="padding:10px 8px 4px;font-weight:600">${L(`Planned (listed when the trade lock ends)`, `Zaplanowane (wystawią się po końcu blokady handlu)`)}</td></tr>${plans.map(planRow).join('')}` : '');
  el.querySelector('th[data-sort="name"]').textContent = L('Item', 'Przedmiot') + sort.arrow('name');
}

function setBusy(b) {
  el.querySelectorAll('.bar button').forEach((x) => (x.disabled = b && x.dataset.a !== 'stop'));
  el.querySelector('[data-a="stop"]').hidden = !b;
}

const setStatus = (listing, text, cls = '') => {
  const r = rows.find((x) => x.listingid === listing.listingid);
  if (r) { r.status = text; r.cls = cls; render(); }
};

async function relistOne(r, price) {
  if (price == null) return;
  const recv = steam.receivedFromBuyer(price, r.pub);
  const drop = price < r.buyer * 0.7 ? `<br><span class="err">${L(`That's ${Math.round((1 - price / r.buyer) * 100)}% less than now.`, `To ${Math.round((1 - price / r.buyer) * 100)}% mniej niż teraz.`)}</span>` : '';
  if (!(await ui.ask(L('Change the price?', 'Zmienić cenę?'), `${esc(r.name)}<br>${steam.fmt(r.buyer)} → <b>${steam.fmt(price)}</b> (${L('you get', 'dostaniesz')} ${steam.fmt(recv)})${drop}<br><span class="sub">${L('The listing is removed and listed again, you confirm it in the Steam app.', 'Oferta zostanie zdjęta i wystawiona ponownie, potwierdzisz ją w aplikacji Steam.')}</span>`, { ok: L('Change price', 'Zmień cenę') }))) return;
  task = token();
  setBusy(true);
  await withLock('relist', async () => {
    const res = await relist([{ listing: r, price }], { onStatus: setStatus, log: ui.log, isCancelled: () => task.cancelled });
    rememberWaiting(res);
    ui.log(res.ok ? L(`${r.name}: new price ${steam.fmt(price)}${res.confirm ? ', confirm in the Steam app' : ''}`, `${r.name}: nowa cena ${steam.fmt(price)}${res.confirm ? ', potwierdź w aplikacji Steam' : ''}`) : L(`${r.name}: couldn't change the price`, `${r.name}: nie udało się zmienić ceny`), res.ok ? 'ok' : 'err');
  }).catch((e) => ui.log(L(`Price change stopped: ${e.message}, check the inventory.`, `Zmiana ceny przerwana: ${e.message}, sprawdź ekwipunek.`), 'err'));
  setBusy(false);
  setTimeout(refresh, 1500);
}

async function removeOne(r) {
  if (!(await ui.ask(L('Remove from the market?', 'Zdjąć z rynku?'), `${esc(r.name)} ${L('for', 'za')} ${steam.fmt(r.buyer)}<br>${L('The item goes back to the inventory.', 'Przedmiot wróci do ekwipunku.')}`, { ok: L('Remove', 'Zdejmij'), danger: true }))) return;
  const res = await steam.removeListing(r.listingid);
  setStatus(r, res.ok ? L('removed', 'zdjęto') : L(`HTTP error ${res.status}`, `błąd HTTP ${res.status}`), res.ok ? 'ok' : 'err');
  setTimeout(refresh, 1000);
}

async function bulkSet() {
  const sel = rows.filter((r) => r.checked);
  const jobs = sel.map((r) => ({ listing: r, price: suggest(r).price })).filter((j) => j.price != null && j.price !== j.listing.buyer);
  if (!jobs.length) return ui.log(L('The selected listings already have the suggested price (or there is no market data).', 'Zaznaczone oferty mają już proponowaną cenę (albo brak danych rynku).'), 'warn');
  if (!(await ui.ask(L('Change the prices?', 'Zmienić ceny?'), `${jobs.map((j) => `${esc(j.listing.name)}: ${steam.fmt(j.listing.buyer)} → <b>${steam.fmt(j.price)}</b>`).slice(0, 12).join('<br>')}${jobs.length > 12 ? `<br>… ${L(`and ${jobs.length - 12} more`, `i ${jobs.length - 12} więcej`)}` : ''}`, { ok: L(`Change ${jobs.length}`, `Zmień ${jobs.length}`) }))) return;
  task = token();
  setBusy(true);
  await withLock('relist', async () => {
    const res = await relist(jobs, { onStatus: setStatus, log: ui.log, isCancelled: () => task.cancelled });
    rememberWaiting(res);
    ui.log(L(`Price change: ${res.ok} OK, ${res.failed} errors.`, `Zmiana cen: ${res.ok} OK, ${res.failed} błędów.`), res.failed ? 'warn' : 'ok');
    if (res.confirm) ui.log(L(`${res.confirm} listings wait for confirmation. In the Steam app open Confirmations and tap “Confirm all” to approve them at once.`, `${res.confirm} ofert czeka na potwierdzenie, w aplikacji Steam otwórz Potwierdzenia i kliknij „Potwierdź wszystkie”, żeby zatwierdzić je naraz.`), 'warn');
  }).catch((e) => ui.log('Przerwano: ' + e.message, 'err'));
  setBusy(false);
  setTimeout(refresh, 1500);
}

export async function refresh() {
  refreshing = true;
  lastTry = Date.now();
  tick();
  try { await load(); } finally { refreshing = false; tick(); }
}
async function load() {
  if (!(await steam.ensureLogin())) { ui.log(L('No logged-in Steam session found.', 'Nie wykryto zalogowanej sesji Steam.'), 'err'); return; }
  try {
    const { listings, toConfirm, pending, pendingKnown } = await steam.myListings();
    pend = pendingRows(listings, pending || [], pendingKnown, toConfirm);
    const prev = new Map(rows.map((r) => [r.listingid, r])); // after await: keep state set meanwhile
    rows = listings.map((l) => {
      const p = prev.get(l.listingid);
      return { ...l, rule: rules.get(l.hash) || {}, comp: p?.comp ?? null, lowest: prices.cached(l.appid, l.hash)?.lowest ?? null, newBuyer: p?.newBuyer ?? null, checked: p?.checked || false, status: p?.status || '', cls: p?.cls };
    });
    el.querySelector('#l-note').innerHTML = toConfirm ? `<span class="warn" title="${L('In the Steam app open Confirmations and tap “Confirm all”', 'W aplikacji Steam otwórz Potwierdzenia i kliknij „Potwierdź wszystkie”')}">${toConfirm} ${L('listings wait for confirmation in the app, approve them all at once', 'ofert czeka na potwierdzenie w aplikacji, zatwierdź wszystkie naraz')}</span>` : '';
    if (!lastComp) ui.log(L(`Loaded ${rows.length} sell listings.`, `Wczytano ${rows.length} ofert sprzedaży.`));
    render();
    autoComp();
    if (rows.some((x) => x.item?.float != null)) ensureFloatDb().then(() => render()); // float ranks
    sig.ensure([...rows, ...planList()].map((r) => ({ hash: r.hash, appid: r.appid })), { onEach: () => render() });
    checkPlans(); // planned sales: today's market for each
  } catch (e) {
    ui.log(L('Error loading listings: ', 'Błąd ładowania ofert: ') + e.message, 'err');
  }
}

// ---------------------------------------------------------------- automatic competition check
let compTask = null;
let compRunning = false;
let lastComp = 0;
let pendingRender = false;
// the self-refresh: refreshing = reloading the listings (the competition check after it is compRunning); lastTry =
// when the last reload started, so a failing one waits a full interval too instead of retrying every second
let refreshing = false, lastTry = 0;
const refreshMin = () => Math.min(60, Math.max(1, settings.listRefreshMin ?? 2));
const busy = () => refreshing || compRunning;
const nextAt = () => Math.max(lastComp, lastTry) + refreshMin() * 60000;
const clock = (t) => new Date(t).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
/** "odświeżono 12:03 · następne za 1:40" above the table, "odświeżam…" while it runs */
function tick() {
  const box = el?.querySelector('#l-tick');
  if (!box) return;
  if (busy()) { box.innerHTML = L('<span class="acc">refreshing…</span>', '<span class="acc">odświeżam…</span>'); return; }
  const last = Math.max(lastComp, lastTry);
  if (!last) { box.textContent = ''; return; }
  const left = Math.max(0, Math.ceil((nextAt() - Date.now()) / 1000));
  box.textContent = L(`refreshed ${clock(last)} · next in ${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`, `odświeżono ${clock(last)} · następne za ${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`);
}

async function autoComp() {
  if (!rows.length || compRunning) return;
  compRunning = true;
  const tk = (compTask = token());
  lastComp = Date.now();
  summary(true);
  await competitionFor(rows, tk, { quiet: true });
  compRunning = false;
  lastComp = Date.now();
  summary();
  tick();
}

function summary(running = false) {
  const box = el?.querySelector('#l-comp');
  if (!box) return;
  const checked = rows.filter((r) => r.comp != null || r.lowest != null);
  const beaten = rows.filter((r) => r.comp != null && r.comp < r.buyer);
  const tied = rows.filter((r) => r.comp != null && r.comp === r.buyer);
  const parts = [];
  if (beaten.length) parts.push(`<b class="err">${beaten.length} ${beaten.length === 1 ? L('listing undercut', 'oferta przebita') : L('listings undercut', 'ofert przebitych')}</b>`);
  if (tied.length) parts.push(`<span class="warn">${tied.length} ${L('tied', 'remis')}</span>`);
  // the new advice applied to listings priced before it: how many are unlikely to sell, how many are cheap
  const evals = rows.map((r) => evalListing(r, suggest(r))).filter(Boolean);
  const high = evals.filter((e) => e.k === 'high').length, cheap = evals.filter((e) => e.k === 'cheap').length;
  if (high) parts.push(`<span class="err" title="${L('At the current price the chance to sell is below 25%, see the suggested price', 'Po obecnej cenie szansa sprzedaży poniżej 25%, zobacz proponowaną cenę')}">${high} ${L('too pricey by the history', 'za drogo wg historii')}</span>`);
  if (cheap) parts.push(`<span class="warn" title="${L('They will sell almost surely, and the suggested price is higher', 'Sprzedadzą się prawie na pewno, a proponowana cena jest wyższa')}">${cheap} ${L('too cheap', 'za tanio')}</span>`);
  if (checked.length && !beaten.length && !tied.length && !running) parts.push(`<span class="ok">${L('all your listings are the cheapest', 'wszystkie Twoje oferty są najtańsze')}</span>`);
  box.innerHTML = parts.join(' · ');
  ui.status('undercut', beaten.length ? `<b class="err">${L(`Undercut listings`, `Przebite oferty`)}: ${beaten.length}</b>` : null);
}


async function competitionFor(list, tk, { quiet = false } = {}) {
  const uniq = [...new Map(list.map((r) => [r.appid + '|' + r.hash, r])).values()];
  let i = 0;
  for (const r of uniq) {
    if (tk?.cancelled) break;
    if (!quiet) ui.progress(++i, uniq.length);
    try {
      const h = await prices.hist(r.appid, r.hash, quiet ? 60000 : 5000);
      const comp = competitorSell(h.sellGraph, myPriceMap(r.hash), settings.ignoreBelow ?? 2, sig.skipChooser(r.hash, (p) => steam.receivedFromBuyer(p, r.pub)));
      const raw = competitorSell(h.sellGraph, myPriceMap(r.hash)); // the very cheapest other, lone ones included
      rows.filter((x) => x.hash === r.hash).forEach((x) => {
        // log when someone newly undercuts us
        if (quiet && comp != null && comp < x.buyer && !(x.comp != null && x.comp < x.buyer)) {
          ui.log(L(`Someone undercut you: ${x.hash}, ${steam.fmt(comp)} (yours ${steam.fmt(x.buyer)})`, `Ktoś przebił: ${x.hash}, ${steam.fmt(comp)} (Twoja ${steam.fmt(x.buyer)})`), 'warn');
        }
        x.comp = comp;
        x.stray = raw != null && comp != null && raw < comp ? raw : null;
        x.lowest = h.lowestSell;
        x.h = h;
      });
      render();
      summary(quiet);
    } catch (e) {
      ui.log(`${r.hash}: ${e.message}`, 'err');
      if (e.status === 429) break;
    }
  }
  if (!quiet) ui.progress(0);
}

async function doRemove() {
  const sel = rows.filter((r) => r.checked);
  if (!sel.length) return ui.log(L('Select some listings.', 'Zaznacz oferty.'), 'warn');
  if (!(await ui.ask(L('Remove the listings?', 'Zdjąć oferty?'), L(`Remove ${sel.length} listings from the market? The items go back to the inventory.`, `Zdjąć ${sel.length} ofert z rynku? Przedmioty wrócą do ekwipunku.`), { ok: L('Remove', 'Zdejmij'), danger: true }))) return;
  task = token();
  setBusy(true);
  await withLock('remove', async () => {
    for (const r of sel) {
      if (task.cancelled) break;
      const res = await steam.removeListing(r.listingid);
      setStatus(r, res.ok ? L('removed', 'zdjęto') : L(`HTTP error ${res.status}`, `błąd HTTP ${res.status}`), res.ok ? 'ok' : 'err');
    }
  });
  setBusy(false);
  setTimeout(refresh, 1000);
}

// ---------------------------------------------------------------- auto-relist
async function autoCycle() {
  if (!(await steam.ensureLogin())) return;
  await withLock('auto-relist', async () => {
    const { listings } = await steam.myListings();
    const ruled = listings.filter((l) => { const r = rules.get(l.hash); return r?.auto && r.min != null; });
    if (!ruled.length) { lastAuto = { at: Date.now(), msg: L('no listings with auto + min', 'brak ofert z regułą auto + min') }; return; }
    const mine = {};
    for (const l of listings) (mine[l.hash] ||= {})[l.buyer] = (mine[l.hash][l.buyer] || 0) + 1;
    const jobs = [];
    for (const l of ruled) {
      try {
        const h = await prices.hist(l.appid, l.hash, 30000);
        const comp = competitorSell(h.sellGraph, mine[l.hash], settings.ignoreBelow ?? 2, sig.skipChooser(l.hash, (p) => steam.receivedFromBuyer(p, l.pub)));
        // the price always goes up when the others are more expensive (you want the best price), but never above
        // what the item really sells for: one absurd listing above you mustn't pull yours where nobody buys
        const rule = { ...rules.get(l.hash), undercut: settings.undercut, raise: true };
        const snap = (p, up) => steam.achievable(p, l.pub, up);
        let t = relistTarget({ current: l.buyer, competitor: comp, rule, snap });
        if (t.price != null && t.price > l.buyer) {
          const cap = raiseCap(l, h, mine[l.hash]);
          if (cap != null && t.price > cap) {
            const p = snap(cap, false);
            t = p > l.buyer ? { price: p, reason: L('raising to the suggested price, it would hardly sell higher', 'podnoszę do proponowanej ceny, wyżej raczej się nie sprzeda') } : { price: null, reason: L('it would hardly sell higher', 'wyżej raczej się nie sprzeda') };
          }
        }
        const row = rows.find((x) => x.listingid === l.listingid);
        if (row) { row.comp = comp; row.lowest = h.lowestSell; }
        if (t.price != null) {
          jobs.push({ listing: l, price: t.price });
          ui.log(`[auto] ${l.hash}: ${steam.fmt(l.buyer)} → ${steam.fmt(t.price)} (${t.reason})`);
        }
      } catch (e) {
        ui.log(`[auto] ${l.hash}: ${e.message}`, 'err');
        if (e.status === 429) break;
      }
    }
    if (jobs.length) {
      const r = await relist(jobs, { onStatus: setStatus, log: ui.log });
      rememberWaiting(r);
      lastAuto = { at: Date.now(), msg: L(`changed ${r.ok}/${jobs.length}${r.failed ? `, errors: ${r.failed}` : ''}`, `zmieniono ${r.ok}/${jobs.length}${r.failed ? `, błędy: ${r.failed}` : ''}`) };
      ui.log(L(`[auto] relist: ${r.ok} OK, ${r.failed} errors.`, `[auto] relist: ${r.ok} OK, ${r.failed} błędów.`), r.failed ? 'warn' : 'ok');
    } else {
      lastAuto = { at: Date.now(), msg: L(`checked ${ruled.length}, no changes`, `sprawdzono ${ruled.length}, bez zmian`) };
    }
  });
  if (el && ui.isOpen()) refresh();
}

/**
 * How high the automat may raise a listing: the proposed price from the item's own record (the same as in the
 * "Proponowana cena" column), else 1.25 × its typical sale of the last days; null = no data, no limit
 */
function raiseCap(l, h, mine) {
  const net = (p) => steam.receivedFromBuyer(p, l.pub);
  const table = sig.fill(l.hash);
  if (table) {
    const others = graphWithout(h.sellGraph, mine);
    const fa = listAdviceFill({ table, sellGraph: others.length ? others : h.sellGraph, highestBuy: h.highestBuy, net, maxWaitDays: settings.maxWaitDays ?? 2, undercut: settings.undercut });
    if (fa) return fa.price;
  }
  const typ = sig.typical(l.hash);
  const t = typ?.d7 ?? typ?.d30;
  return t ? Math.round(t * 1.25) : null;
}

function updateAuto(st) {
  const on = settings.autoRelist;
  const info = !on ? L('off', 'wyłączony') : !isLeader() ? L('runs in another tab', 'działa w innej karcie') : st?.running ? L('working…', 'pracuje…') : L(`next in ${Math.max(0, Math.round((auto.next - Date.now()) / 60000))} min`, `następne za ${Math.max(0, Math.round((auto.next - Date.now()) / 60000))} min`);
  ui.status('autorelist', `Auto-relist: <b class="${on ? 'ok' : 'mut'}">${info}</b>${lastAuto ? ` · ${L('last', 'ostatnio')} ${timeAgo(lastAuto.at)}: ${esc(lastAuto.msg)}` : ''}`);
  autoBtn();
  const i = document.getElementById('l-autoinfo');
  if (i) i.textContent = info + (lastAuto ? ` · ${L(`last`, `ostatnio`)}: ${lastAuto.msg}` : '');
}

export const auto = every('auto-relist', () => settings.autoRelistEvery, () => settings.autoRelist, autoCycle, updateAuto);
