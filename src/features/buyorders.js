import * as ui from '../core/ui.js';
import * as steam from '../core/steam.js';
import * as prices from '../core/prices.js';
import * as store from '../core/store.js';
import { settings } from '../core/store.js';
import { withLock, token, every, isLeader } from '../core/jobs.js';
import { buyOrderTarget, competitorBuy, flipReal, priceAbove, realPrice } from '../core/analysis.js';
import * as sig from './sellsignals.js';
import { parsePrice, toInput, esc, timeAgo, pct } from '../core/util.js';
import * as research from './research.js';
import { L } from '../core/i18n.js';

const rules = store.bucket('buyRules'); // hash -> {max, auto}
const net = (p) => steam.receivedFromBuyer(p);
// the price an order really stands at in Steam's book: some prices don't exist (0,91 zł → shown and filled as 0,90 zł)
const shown = (r) => realPrice(r.price, net);
let rows = [];
let el;
let task = null;
let lastAuto = null;

export function mount(root) {
  el = root;
  root.innerHTML = `
    <div class="bar">
      <button class="b" data-a="reload" title="${L('Loads your orders and checks the competition', 'Wczytuje zlecenia i sprawdza konkurencję')}">⟳ ${L('Refresh', 'Odśwież')}</button>
      <button class="b go" data-a="newform">+ ${L(`New order`, `Nowe zlecenie`)}</button>
      <span class="sub" id="b-state"></span>
      <span class="sp"></span>
      <button class="b dbg" data-a="research" title="${L('Downloads the order book and the full price history of the items in your buy orders from the Steam market and saves them to a file, for a joint analysis of whether and at what price to sell. Read only, it buys and lists nothing.', 'Pobiera z Rynku Steam księgę zleceń i pełną historię cen przedmiotów z Twoich zleceń kupna i zapisuje je do pliku, do wspólnej analizy, czy i po ile sprzedawać. Tylko odczyt, niczego nie kupuje ani nie wystawia.')}">⬇ ${L('Data for analysis', 'Dane do analizy')}</button>
      <button class="b" data-a="autopanel" title="${L('Automatic outbidding in the background', 'Automatyczne przebijanie w tle')}">⚙ ${L('Auto', 'Automat')}: <b id="b-autostate">${settings.autoBuy ? L('on', 'wł.') : L('off', 'wył.')}</b></button>
      <button class="b" data-a="stop" hidden>■ Stop</button>
    </div>
    <div id="b-form" hidden style="padding:10px 14px;border-bottom:1px solid #22303f">
      <div class="row2" style="padding:0;align-items:flex-end">
        <label style="position:relative">${L('Item (type its name in English or Polish)', 'Przedmiot (wpisz nazwę po polsku lub angielsku)')}<input type="search" id="b-q" style="width:340px" placeholder="${L('e.g. revolution case, AK-47 Redline', 'np. skrzynia rewolucji, AK-47 Redline')}">
          <div id="b-sugg" class="sugg" hidden></div></label>
        <label>${L('Price per unit', 'Cena za szt.')}<input class="p" id="b-price"></label>
        <label>${L('Quantity', 'Ilość')}<input type="number" id="b-qty" value="1" min="1" style="width:64px"></label>
        <button class="b go" data-a="create">${L('Place order', 'Złóż zlecenie')}</button>
      </div>
      <div class="sub" id="b-peek" style="margin-top:6px"></div>
    </div>
    <div id="b-autopanel" hidden class="note" style="padding:10px 14px">
      <div class="row2" style="padding:0 0 6px">
        <label>${L('Outbid automatically', 'Przebijaj automatycznie')}<input type="checkbox" id="b-auto" ${settings.autoBuy ? 'checked' : ''}></label>
        <label>${L('Every (minutes)', 'Co ile minut')}<input type="number" min="2" id="b-every" value="${settings.autoBuyEvery}" style="width:70px"></label>
        <label>${L('Lower when I\'m alone at the top', 'Obniżaj, gdy jestem sam na szczycie')}<input type="checkbox" id="b-lower" ${settings.autoBuyLower ? 'checked' : ''}></label>
        <button class="b" data-a="autonow">${L('Check now', 'Sprawdź teraz')}</button>
        <span class="sub" id="b-autoinfo"></span>
      </div>
      ${L(`The automation outbids by one cent when someone offers more. It only touches orders where you turn on
      "outbid automatically" in "⚙" and set a <b>maximum price</b>. Steam doesn't let you change an order's price, so outbidding means cancelling and placing a new one.`, `Automat przebija zlecenia o grosz, gdy ktoś zaoferuje więcej. Obejmuje tylko zlecenia, którym w „⚙” włączysz
      „przebijaj automatycznie” i ustawisz <b>najwyższą cenę</b>. Steam nie pozwala zmienić ceny zlecenia, więc przebicie = anulowanie i złożenie nowego.`)}
    </div>
    <div id="b-bulk" class="bar" hidden style="position:static;background:rgba(102,192,244,.06)">
      <span id="b-bulkn"></span>
      <button class="b red" data-a="cancel">${L('Cancel selected', 'Anuluj zaznaczone')}</button>
      <button class="b" data-a="selnone">${L('deselect', 'odznacz')}</button>
    </div>
    <table><thead><tr>
      <th style="width:1%"><input type="checkbox" id="b-all"></th><th>${L('Item', 'Przedmiot')}</th><th>${L('Your order', 'Twoje zlecenie')}</th><th>${L('Market', 'Rynek')}</th><th>${L('Suggestion', 'Propozycja')}</th><th></th>
    </tr></thead><tbody></tbody></table>`;
  if (!document.getElementById('stt-sugg-css')) {
    const st = document.createElement('style');
    st.id = 'stt-sugg-css';
    st.textContent = '#stt .sugg{position:absolute;top:100%;left:0;right:0;z-index:20;background:var(--bg2,#1b2838);border:1px solid #2a475e;border-radius:4px;max-height:320px;overflow:auto;box-shadow:0 6px 18px #0009}#stt .sugg div{display:flex;gap:8px;align-items:center;padding:5px 8px;cursor:pointer;font-size:12px;color:#c6d4df}#stt .sugg div:hover{background:#2a475e}#stt .sugg img{width:40px;height:30px;object-fit:contain}#stt .sugg .p2{margin-left:auto;color:var(--mut)}';
    document.head.appendChild(st);
  }

  root.addEventListener('click', (e) => {
    const sg = e.target.closest('[data-pick]');
    if (sg) { pick(JSON.parse(sg.dataset.pick)); return; }
    const btn = e.target.closest('button');
    const a = btn?.dataset.a;
    if (!a) return;
    const r = btn.dataset.id ? rows.find((x) => x.id === btn.dataset.id) : null;
    ({
      reload: () => { lastCheck = 0; refresh(); }, stop: () => { task?.cancel(); research.cancelResearch(); }, autonow: () => auto.runNow(),
      research: () => research.exportResearch(rows.map((x) => ({ hash: x.hash, appid: x.appid })), L('from your buy orders', 'z Twoich zleceń kupna'), { onBusy: (b) => (el.querySelector('[data-a="stop"]').hidden = !b) }),
      newform: () => { const f = el.querySelector('#b-form'); f.hidden = !f.hidden; if (!f.hidden) el.querySelector('#b-q').focus(); },
      autopanel: () => { const p = el.querySelector('#b-autopanel'); p.hidden = !p.hidden; },
      bid: () => r && outbidOne(r), rm: () => r && cancelOne(r), save: () => r && saveEdit(r),
      edit: () => { if (r) { edit = edit?.id === r.id ? null : { id: r.id, price: toInput(proposal(r)?.price ?? r.price), qty: String(r.remaining) }; render(); } },
      cfg: () => { if (r) { openCfg = openCfg === r.id ? null : r.id; render(); } },
      cancel: doCancel, create: doCreate, selnone: () => { rows.forEach((x) => (x.checked = false)); render(); },
    })[a]?.();
  });
  root.querySelector('#b-all').onchange = (e) => { rows.forEach((r) => (r.checked = e.target.checked)); render(); };
  root.querySelector('#b-auto').onchange = (e) => { settings.autoBuy = e.target.checked; el.querySelector('#b-autostate').textContent = e.target.checked ? L('on', 'wł.') : L('off', 'wył.'); auto.reschedule(); };
  root.querySelector('#b-every').onchange = (e) => { settings.autoBuyEvery = Math.max(2, +e.target.value || 10); auto.reschedule(); };
  root.querySelector('#b-lower').onchange = (e) => (settings.autoBuyLower = e.target.checked);
  let qT = 0;
  root.querySelector('#b-q').oninput = (e) => { picked = null; clearTimeout(qT); qT = setTimeout(() => findItems(e.target.value), 450); };
  root.querySelector('tbody').addEventListener('focusout', () => setTimeout(() => { if (pendingRender) render(); }, 0));
  // price editor: keep what is typed (a background re-render must not reset it), say live if the price doesn't exist, Enter saves
  root.querySelector('tbody').addEventListener('input', (e) => {
    const f = e.target.dataset.f;
    if (!edit || (f !== 'np' && f !== 'nq')) return;
    edit[f === 'np' ? 'price' : 'qty'] = e.target.value;
    const hint = e.target.closest('tr')?.querySelector('.ehint');
    if (hint) hint.innerHTML = editHint(rows.find((x) => x.id === edit.id));
  });
  root.querySelector('tbody').addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' || !edit || !['np', 'nq'].includes(e.target.dataset.f)) return;
    const r = rows.find((x) => x.id === edit.id);
    if (r) { e.preventDefault(); saveEdit(r); }
  });
  setInterval(() => {
    if (ui.isOpen() && !document.hidden && el.closest('.tab')?.classList.contains('on') && el.offsetParent && !checking && Date.now() - lastCheck > 2 * 60000) refresh();
  }, 15000);
  root.querySelector('tbody').addEventListener('change', (e) => {
    const r = rows.find((x) => x.id === e.target.closest('tr')?.dataset.id);
    if (!r) return;
    const f = e.target.dataset.f;
    if (f === 'np' || f === 'nq') { if (edit?.id === r.id) edit[f === 'np' ? 'price' : 'qty'] = e.target.value; return; }
    if (f === 'chk') r.checked = e.target.checked;
    if (f === 'auto') rules.patch(r.hash, { auto: e.target.checked });
    if (f === 'max') { const v = parsePrice(e.target.value); rules.patch(r.hash, { max: isNaN(v) ? null : v }); }
    r.rule = rules.get(r.hash);
    render();
  });
  refresh();
}

export const show = () => {};
let pendingRender = false;
let openCfg = null;
let edit = null; // {id, price, qty}, the order whose price/quantity is being changed (inputs as typed)
let picked = null; // {hash, name, appid}

/** the lowest real price at or above what was typed (0,91 → 0,92: an order "at 0,91" would stand among the 0,90 ones) */
const realUp = (p) => priceAbove(p - 1, net);
function editHint(r) {
  const p = parsePrice(edit?.price ?? '');
  const q = parseInt(edit?.qty, 10);
  if (isNaN(p) || !(p > 0)) return L('enter a price', 'podaj cenę');
  const real = realUp(p);
  const sum = (q > 0 ? ` · ${L('total', 'razem')} ${steam.fmt(real * q)}` : '') + (r?.comp != null ? ` · ${L('highest other order', 'najwyższe inne zlecenie')}: ${steam.fmt(r.comp)}` : '');
  return real !== p
    ? `<span class="warn">${steam.fmt(p)} ${L(`doesn't exist on Steam (fees round to whole cents), I'll place`, `nie istnieje na Steamie (prowizje zaokrąglają się do groszy), złożę`)} ${steam.fmt(real)}</span>${sum}`
    : sum.slice(3);
}

async function saveEdit(r) {
  const typed = parsePrice(edit?.price ?? '');
  const qty = parseInt(edit?.qty, 10);
  if (isNaN(typed) || !(typed > 0)) return ui.log(L('Enter a price.', 'Podaj cenę.'), 'warn');
  if (!(qty > 0)) return ui.log(L('Enter a quantity.', 'Podaj ilość.'), 'warn');
  const price = realUp(typed);
  if (price === r.price && qty === r.remaining) { edit = null; render(); return ui.log(L('Price and quantity unchanged.', 'Cena i ilość bez zmian.')); }
  const snapped = price !== typed ? `<br><span class="warn">${steam.fmt(typed)} ${L(`doesn't exist on Steam, placing`, `nie istnieje na Steamie, składam`)} ${steam.fmt(price)}.</span>` : '';
  if (!(await ui.ask(L('Change the order?', 'Zmienić zlecenie?'), `${esc(r.name)}<br>${r.remaining} × ${steam.fmt(r.price)} → <b>${qty} × ${steam.fmt(price)}</b> = ${steam.fmt(price * qty)}${snapped}<br><span class="sub">${L('Steam doesn\'t let you edit orders, so the old one is cancelled and a new one placed (at the end of the queue at this price).', 'Steam nie pozwala edytować zleceń: stare zostanie anulowane i złożone nowe (na koniec kolejki przy tej cenie).')}</span>`, { ok: L('Change', 'Zmień') }))) return;
  edit = null;
  await withLock('outbid', () => replaceOrder(r, price, qty));
  setTimeout(refresh, 1000);
}

// ---- item search for a new order (any language; the order needs the English market_hash_name)
async function findItems(text) {
  const box = el.querySelector('#b-sugg');
  if (text.trim().length < 3) { box.hidden = true; return; }
  box.hidden = false;
  box.innerHTML = L('<div class="sub">searching…</div>', '<div class="sub">szukam…</div>');
  try {
    const lang = steam.uiLanguage();
    const d = await steam.schedule('search', () => fetch(`${steam.ORIGIN}/market/search/render/?norender=1&appid=730&l=${lang}&query=${encodeURIComponent(text)}&search_descriptions=0&count=10`, { credentials: 'include' }).then((r) => r.json()));
    const res = d?.results || [];
    box.innerHTML = res.length ? res.map((x) => `<div data-pick="${esc(JSON.stringify({ hash: x.hash_name, name: x.hash_name, appid: 730 }))}">
      <img src="https://community.cloudflare.steamstatic.com/economy/image/${esc(x.asset_description?.icon_url || '')}/62fx62f"><span style="color:#${esc(x.asset_description?.name_color || 'c6d4df')}">${esc(x.hash_name || x.name)}</span><span class="p2">${esc(x.sell_price_text || '')}</span></div>`).join('') : L('<div class="sub">nothing found</div>', '<div class="sub">nic nie znaleziono</div>');
  } catch (e) { box.innerHTML = `<div class="err">${esc(e.message)}</div>`; }
}
function pick(p) {
  picked = p;
  el.querySelector('#b-q').value = p.name;
  el.querySelector('#b-sugg').hidden = true;
  peek();
}

function chip(r) {
  if (r.comp == null) return checking ? `<span class="chipst mut">${L('checking…', 'sprawdzam…')}</span>` : r.h ? `<span class="chipst ok">${L('highest', 'najwyższe')}</span>` : '<span class="chipst mut">-</span>';
  if (r.comp > shown(r)) return `<span class="chipst bad">${L(`outbid: someone offers ${steam.fmt(r.comp)}`, `przebite: ktoś daje ${steam.fmt(r.comp)}`)}</span>`;
  if (r.comp === shown(r)) return '<span class="chipst mid">remis</span>';
  return `<span class="chipst ok">${L('highest', 'najwyższe')}</span>`;
}

/** proposal: 1 cent above the highest other order (within your max), and whether it still makes sense vs the lowest sell */
function proposal(r) {
  const rule = r.rule || {};
  if (r.comp == null || r.comp < shown(r)) return null;
  let price = priceAbove(r.comp, net);
  let note = L('a cent more than the highest other order', 'o grosz więcej niż najwyższe inne zlecenie');
  if (rule.max != null && price > rule.max) return { price: null, note: `przebicie (${steam.fmt(price)}) przekracza Twoje max ${steam.fmt(rule.max)}` };
  if (r.h?.lowestSell && price >= r.h.lowestSell) note = L(`careful, that's already what buying right away costs (${steam.fmt(r.h.lowestSell)})`, `uwaga: tyle kosztuje już kupno od ręki (${steam.fmt(r.h.lowestSell)})`);
  return { price, note };
}

function render() {
  if (!el) return; // the automation also runs in tabs where this list was never opened
  const tb = el.querySelector('tbody');
  const cnt = document.querySelector('#stt [data-mt="buy"] .cnt');
  if (cnt) cnt.textContent = `(${rows.length})`;
  const a = document.activeElement;
  if (a && tb.contains(a) && a.tagName === 'INPUT' && a.type !== 'checkbox') { pendingRender = true; return; }
  pendingRender = false;
  const sel = rows.filter((r) => r.checked);
  el.querySelector('#b-bulk').hidden = !sel.length;
  el.querySelector('#b-bulkn').textContent = L(`Selected ${sel.length}:`, `Zaznaczono ${sel.length}:`);
  const beaten = rows.filter((r) => r.comp != null && r.comp > shown(r)).length;
  el.querySelector('#b-state').innerHTML = checking ? `<span class="acc">${L('checking the competition…', 'sprawdzam konkurencję…')}</span>` : lastCheck ? (beaten ? `<b class="err">${beaten} ${L('outbid', 'przebite')}</b> · ${L('checked', 'sprawdzono')} ${timeAgo(lastCheck)}` : `<span class="ok">${L('all highest', 'wszystkie najwyższe')}</span> · ${L('checked', 'sprawdzono')} ${timeAgo(lastCheck)}`) : '';
  if (!rows.length) { tb.innerHTML = L('<tr><td colspan="6" class="empty">You have no buy orders. Click "+ New order".</td></tr>', '<tr><td colspan="6" class="empty">Nie masz zleceń kupna. Kliknij „+ Nowe zlecenie”.</td></tr>'); return; }
  tb.innerHTML = rows.map((r) => {
    const rule = r.rule || {};
    // what the order makes once it fills: sold after the 7-day lock at the price the item typically sells for (last 7
    // days), never above the cheapest listing, as the Okazje scanner counts it. Not "one cent under the cheapest
    // listing": that spread flip never paid in the test on 108 items. Needs the price history (fetched once, 12 h).
    const typ = sig.typical(r.hash);
    const sellAt = typ?.d7 && r.h?.lowestSell ? Math.min(Math.round(typ.d7), r.h.lowestSell - 1) : null;
    const fp = sellAt ? steam.receivedFromBuyer(sellAt) - shown(r) : null;
    const p = proposal(r);
    const autoTag = rule.auto ? `<span class="chipst ${rule.max != null ? 'ok' : 'mid'}" title="${rule.max != null ? L(`Auto outbids up to ${steam.fmt(rule.max)}`, `Automat przebija do ${steam.fmt(rule.max)}`) : L('Auto is on but without a maximum price, so it won\'t work. Set it in ⚙.', 'Automat włączony, ale bez najwyższej ceny, nie zadziała. Ustaw ją w ⚙.')}">auto</span>` : '';
    const main = `<tr data-id="${r.id}">
      <td><input type="checkbox" data-f="chk" ${r.checked ? 'checked' : ''}></td>
      <td>${ui.itemCell(r)}</td>
      <td><b>${steam.fmt(r.price)}</b> × ${r.remaining}${r.qty !== r.remaining ? `<span class="sub"> (${L(`of`, `z`)} ${r.qty})</span>` : ''}<div class="sub">${L(`total`, `razem`)} ${steam.fmt(r.price * r.remaining)}</div>${shown(r) !== r.price ? `<div class="sub warn" title="${L(`This price can't be paid after fees, so Steam shows and fills this order as ${steam.fmt(shown(r))}, queued with the others at that price. The next real price is ${steam.fmt(realUp(r.price))}.`, `Takiej ceny nie da się zapłacić po prowizjach, więc Steam pokazuje i realizuje to zlecenie jako ${steam.fmt(shown(r))}, w kolejce z innymi po tej cenie. Następna prawdziwa cena to ${steam.fmt(realUp(r.price))}.`)}">${L('stands as', 'stoi jako')} ${steam.fmt(shown(r))}</div>` : ''}</td>
      <td>${chip(r)} ${autoTag}<div class="sub" style="margin-top:3px">${r.h?.lowestSell ? `${L(`buy now`, `kupno od ręki`)}: ${steam.fmt(r.h.lowestSell)}` : ''}${fp != null ? ` · <span title="${L(`Profit per unit after the fee if the order fills at your price and you sell after the 7-day lock at last week's typical price (${steam.fmt(sellAt)}), the same way the Deals scanner counts`, `Zysk na sztuce po prowizji, jeśli zlecenie wejdzie po Twojej cenie, a po 7 dniach blokady sprzedasz po typowej cenie z ostatniego tygodnia (${steam.fmt(sellAt)}), tak samo liczy skaner w Okazjach`)}">${L('after selling', 'po sprzedaży')}: <span class="${fp > 0 ? 'pos' : 'neg'}">${steam.fmt(fp)}</span></span>` : ''} · <a class="acc" target="_blank" href="${esc(ui.marketUrl(r.appid, r.hash))}">${L(`market`, `rynek`)} ↗</a></div></td>
      <td>${p?.price != null ? `<b>${steam.fmt(p.price)}</b><div class="sub">${esc(p.note)}</div>` : p ? `<span class="sub warn">${esc(p.note)}</span>` : r.comp != null ? L('<span class="sub ok">nothing needed</span>', '<span class="sub ok">nic nie trzeba</span>') : ''}${r.status ? `<div class="sub ${r.cls || ''}">${esc(r.status)}</div>` : ''}</td>
      <td><div class="acts">
        ${p?.price != null ? `<button class="b go" data-a="bid" data-id="${r.id}" title="${L(`Cancels the order and places a new one at ${steam.fmt(p.price)} (asks first)`, `Anuluje zlecenie i złoży nowe za ${steam.fmt(p.price)} (z potwierdzeniem)`)}">${L('Outbid', 'Przebij')} ${steam.fmt(p.price)}</button>` : ''}
        <button class="b ${edit?.id === r.id ? 'on' : ''}" data-a="edit" data-id="${r.id}" title="${L('Another price or quantity (cancels and places a new order, asks first)', 'Inna cena lub ilość (anuluje i składa nowe zlecenie, z potwierdzeniem)')}">${L('Change', 'Zmień')}</button>
        <button class="b red" data-a="rm" data-id="${r.id}">${L('Cancel', 'Anuluj')}</button>
        <button class="b ${openCfg === r.id ? 'on' : ''}" data-a="cfg" data-id="${r.id}" title="${L('Maximum price and automation', 'Najwyższa cena i automat')}">⚙</button>
      </div></td></tr>`;
    const editRow = edit?.id !== r.id ? '' : `<tr class="cfg" data-id="${r.id}"><td></td><td colspan="5"><div class="row2" style="padding:6px 0;align-items:flex-end">
      <label>${L('New price per unit', 'Nowa cena za szt.')}<input class="p" data-f="np" value="${esc(edit.price)}"></label>
      <label>${L('Quantity', 'Ilość')}<input type="number" min="1" data-f="nq" value="${esc(edit.qty)}" style="width:64px"></label>
      <button class="b go" data-a="save" data-id="${r.id}">${L('Save', 'Zapisz')}</button>
      <span class="sub ehint">${editHint(r)}</span>
    </div></td></tr>`;
    if (openCfg !== r.id) return main + editRow;
    return main + editRow + `<tr class="cfg" data-id="${r.id}"><td></td><td colspan="5"><div class="row2" style="padding:6px 0;align-items:flex-end">
      <label>${L(`Don't pay more than`, `Nie płać więcej niż`)}<input class="p" data-f="max" value="${toInput(rule.max)}" placeholder="-"></label>
      <label style="flex-direction:row;align-items:center;gap:6px"><input type="checkbox" data-f="auto" ${rule.auto ? 'checked' : ''}> ${L(`outbid automatically`, `przebijaj automatycznie`)}</label>
      ${rule.auto && rule.max == null ? L('<span class="warn sub">set "don\'t pay more than", without it the automation skips this order</span>', '<span class="warn sub">ustaw „nie płać więcej niż”, bez tego automat pominie to zlecenie</span>') : ''}
    </div></td></tr>`;
  }).join('');
}

async function outbidOne(r) {
  const p = proposal(r);
  if (p?.price == null) return;
  if (!(await ui.ask(L('Outbid the order?', 'Przebić zlecenie?'), `${esc(r.name)}<br>${steam.fmt(r.price)} → <b>${steam.fmt(p.price)}</b> × ${r.remaining} = ${steam.fmt(p.price * r.remaining)}<br><span class="sub">${L('The old order is cancelled and a new one placed.', 'Stare zlecenie zostanie anulowane i złożone nowe.')}</span>`, { ok: L('Outbid', 'Przebij') }))) return;
  await withLock('outbid', () => replaceOrder(r, p.price));
  setTimeout(refresh, 1000);
}
async function cancelOne(r) {
  if (!(await ui.ask(L('Cancel the order?', 'Anulować zlecenie?'), `${esc(r.name)}, ${r.remaining} × ${steam.fmt(r.price)}`, { ok: L('Cancel order', 'Anuluj zlecenie'), cancel: L('Back', 'Wróć'), danger: true }))) return;
  const c = await steam.cancelBuyOrder(r.id);
  setStatus(r, c.ok ? L('cancelled', 'anulowano') : L(`error ${c.status}`, `błąd ${c.status}`), c.ok ? 'ok' : 'err');
  setTimeout(refresh, 800);
}

const setStatus = (r, text, cls = '') => { r.status = text; r.cls = cls; render(); };

export async function refresh() {
  if (!(await steam.ensureLogin())) return;
  try {
    const { buyOrders } = await steam.myListings();
    const prev = new Map(rows.map((r) => [r.hash, r]));
    rows = buyOrders.map((o) => {
      const p = prev.get(o.hash);
      return { ...o, rule: rules.get(o.hash) || {}, h: p?.h, comp: p?.comp ?? null, checked: p?.checked || false, status: p?.status || '', cls: p?.cls };
    });
    if (!lastCheck) ui.log(L(`Loaded ${rows.length} buy orders.`, `Wczytano ${rows.length} zleceń kupna.`));
    render();
    autoMarket();
    sig.ensure(rows.map((x) => ({ hash: x.hash, appid: x.appid })), { onEach: () => render() }); // for "po sprzedaży"
  } catch (e) {
    ui.log(L('Error loading orders: ', 'Błąd ładowania zleceń: ') + e.message, 'err');
  }
}

let lastCheck = 0;
let checking = false;

async function marketFor(list, tk, quiet) {
  let i = 0;
  for (const r of list) {
    if (tk.cancelled) break;
    if (!quiet) ui.progress(++i, list.length);
    try {
      r.h = await prices.hist(r.appid, r.hash, quiet ? 60000 : 5000);
      const comp = competitorBuy(r.h.buyGraph, shown(r), r.remaining, settings.ignoreBelow ?? 2);
      if (quiet && comp != null && comp > shown(r) && !(r.comp != null && r.comp > shown(r))) {
        ui.log(L(`Someone outbid your order: ${r.hash}, ${steam.fmt(comp)} (yours ${steam.fmt(r.price)})`, `Ktoś przebił Twoje zlecenie: ${r.hash}, ${steam.fmt(comp)} (Twoje ${steam.fmt(r.price)})`), 'warn');
      }
      r.comp = comp;
      render();
    } catch (e) { setStatus(r, e.message, 'err'); if (e.status === 429) break; }
  }
  if (!quiet) ui.progress(0);
  lastCheck = Date.now();
  render();
  const beaten = rows.filter((r) => r.comp != null && r.comp > shown(r)).length;
  ui.status('outbid', beaten ? `<b class="err">${L(`Outbid orders`, `Przebite zlecenia`)}: ${beaten}</b>` : null);
}


async function autoMarket() {
  if (checking || !rows.length) return;
  checking = true;
  await marketFor(rows, (task = token()), true);
  checking = false;
}

/** cancel + recreate an order at a new price; returns new order id or null */
async function replaceOrder(r, price, qty = r.remaining) {
  const c = await steam.cancelBuyOrder(r.id);
  if (!c.ok || (c.json.success && c.json.success !== 1)) { setStatus(r, L(`couldn't cancel (${c.json.message || c.status})`, `nie udało się anulować (${c.json.message || c.status})`), 'err'); return null; }
  const res = await placeOrder({ appid: r.appid, hash: r.hash, priceEach: price, qty });
  if (res.ok) { setStatus(r, `${steam.fmt(r.price)} → ${steam.fmt(price)}${qty !== r.remaining ? ` × ${qty}` : ''}${res.confirm ? L(' (confirm in the app)', ' (potwierdź w aplikacji)') : ''}`, 'ok'); return res.id; }
  setStatus(r, L(`cancelled, but the new order failed: ${res.msg}`, `anulowano, ale nowe zlecenie nie przeszło: ${res.msg}`), 'err');
  ui.log(L(`${r.hash}: old order cancelled, the new one was rejected (${res.msg}), place it by hand!`, `${r.hash}: stare zlecenie anulowane, nowe odrzucone (${res.msg}), złóż ręcznie!`), 'err');
  return null;
}

export async function placeOrder({ appid, hash, priceEach, qty }) {
  const r = await steam.createBuyOrder({ appid, hash, priceEach, qty });
  const j = r.json || {};
  if (j.success === 1) return { ok: true, id: j.buy_orderid, confirm: !!j.need_confirmation };
  if (j.need_confirmation) return { ok: true, confirm: true };
  return { ok: false, msg: j.message || (j.success === 29 ? L('you already have an order for this item', 'masz już zlecenie na ten przedmiot') : L(`code ${j.success ?? r.status}`, `kod ${j.success ?? r.status}`)) };
}

async function outbid(list, { silent = false, tk = token() } = {}) {
  if (!list.length) { if (!silent) ui.log(L('Select some orders.', 'Zaznacz zlecenia.'), 'warn'); return 0; }
  let changed = 0;
  await withLock('outbid', async () => {
    for (const r of list) {
      if (tk.cancelled) break;
      const rule = r.rule || {};
      if (rule.max == null) { setStatus(r, L('set a max price', 'ustaw cenę max'), 'warn'); continue; }
      try {
        r.h = await prices.hist(r.appid, r.hash, 20000);
        r.comp = competitorBuy(r.h.buyGraph, shown(r), r.remaining, settings.ignoreBelow ?? 2);
        const t = buyOrderTarget({ current: r.price, myQty: r.remaining, buyGraph: r.h.buyGraph, rule: { max: rule.max, lower: settings.autoBuyLower }, net: (p) => steam.receivedFromBuyer(p), minQty: settings.ignoreBelow ?? 2 });
        if (t.price == null) { setStatus(r, t.reason, t.outbid ? 'warn' : ''); continue; }
        ui.log(`${r.hash}: ${L(`order`, `zlecenie`)} ${steam.fmt(r.price)} → ${steam.fmt(t.price)} (${t.reason})`);
        if (await replaceOrder(r, t.price)) changed++;
      } catch (e) {
        setStatus(r, e.message, 'err');
        if (e.status === 429) break;
      }
    }
  });
  if (changed) setTimeout(refresh, 1000);
  return changed;
}

async function doCancel() {
  const sel = rows.filter((r) => r.checked);
  if (!sel.length) return ui.log(L('Select some orders.', 'Zaznacz zlecenia.'), 'warn');
  if (!(await ui.ask(L('Cancel the orders?', 'Anulować zlecenia?'), L(`Cancel ${sel.length} buy orders?`, `Anulować ${sel.length} zleceń kupna?`), { ok: L('Cancel orders', 'Anuluj zlecenia'), cancel: L('Back', 'Wróć'), danger: true }))) return;
  await withLock('cancel', async () => {
    for (const r of sel) {
      const c = await steam.cancelBuyOrder(r.id);
      setStatus(r, c.ok ? L('cancelled', 'anulowano') : L(`error ${c.status}`, `błąd ${c.status}`), c.ok ? 'ok' : 'err');
    }
  });
  setTimeout(refresh, 800);
}

async function peek() {
  const out = el.querySelector('#b-peek');
  if (!picked) return;
  out.textContent = L('loading…', 'pobieram…');
  try {
    const [h, hist] = await Promise.all([prices.hist(picked.appid, picked.hash), steam.priceHistory(picked.appid, picked.hash).catch(() => null)]);
    const fr = hist?.length ? flipReal({ buyGraph: h.buyGraph, sellGraph: h.sellGraph, points: hist, net: (p) => steam.receivedFromBuyer(p) }) : null;
    out.innerHTML = `${L('highest order of others', 'najwyższe zlecenie innych')}: <b>${steam.fmt(h.highestBuy)}</b> · ${L('buy now', 'kupno od ręki')}: <b>${steam.fmt(h.lowestSell)}</b>${fr ? ` · <span title="${L(`Like the Deals scanner, an order one cent above those really standing in the book and a sale after 7 days at the typical price (the lower of 24 h and 7 days), after the fee`, `Jak w skanerze Okazji: zlecenie o grosz nad tymi, które realnie stoją w księdze, sprzedaż po 7 dniach po typowej cenie (niższa z 24 h i 7 dni), po prowizji`)}">flip: ${steam.fmt(fr.buy)} → ${steam.fmt(fr.sell)}, <span class="${fr.profit > 0 ? 'pos' : 'neg'}">${steam.fmt(fr.profit)} (${pct(fr.roi)})</span></span>` : ''} · <a class="acc" target="_blank" href="${esc(ui.marketUrl(picked.appid, picked.hash))}">${L(`market`, `rynek`)} ↗</a>`;
    if (!el.querySelector('#b-price').value && h.highestBuy) el.querySelector('#b-price').value = toInput(priceAbove(h.highestBuy, (p) => steam.receivedFromBuyer(p)));
  } catch (e) { out.innerHTML = `<span class="err">${esc(e.message)}</span>`; }
}

async function doCreate() {
  const price = parsePrice(el.querySelector('#b-price').value);
  const qty = Math.max(1, parseInt(el.querySelector('#b-qty').value, 10) || 1);
  if (!picked) return ui.log(L('Pick an item from the suggestion list.', 'Wybierz przedmiot z listy podpowiedzi.'), 'warn');
  if (isNaN(price)) return ui.log(L('Enter a price.', 'Podaj cenę.'), 'warn');
  if (!(await ui.ask(L('Place the buy order?', 'Złożyć zlecenie kupna?'), `${esc(picked.name)}<br>${qty} × ${steam.fmt(price)} = <b>${steam.fmt(price * qty)}</b>`, { ok: L('Place', 'Złóż') }))) return;
  const r = await withLock('create', () => placeOrder({ appid: picked.appid, hash: picked.hash, priceEach: price, qty }));
  ui.log(r.ok ? L(`Order placed: ${picked.name} ${qty}× ${steam.fmt(price)}${r.confirm ? ' (confirm in the app)' : ''}`, `Złożono zlecenie: ${picked.name} ${qty}× ${steam.fmt(price)}${r.confirm ? ' (potwierdź w aplikacji)' : ''}`) : L(`Order rejected: ${r.msg}`, `Zlecenie odrzucone: ${r.msg}`), r.ok ? 'ok' : 'err');
  if (r.ok) { el.querySelector('#b-form').hidden = true; setTimeout(refresh, 800); }
}

export function prefill(hash, price, appid = 730) {
  if (!el) return;
  el.querySelector('#b-form').hidden = false;
  picked = { hash, name: hash, appid };
  el.querySelector('#b-q').value = hash;
  el.querySelector('#b-price').value = toInput(price);
  peek();
}

// ---------------------------------------------------------------- auto
async function autoCycle() {
  if (!(await steam.ensureLogin())) return;
  const { buyOrders } = await steam.myListings();
  const prev = new Map(rows.map((r) => [r.id, r]));
  rows = buyOrders.map((o) => ({ ...prev.get(o.id), ...o, rule: rules.get(o.hash) || {} }));
  const list = rows.filter((r) => r.rule.auto && r.rule.max != null);
  const n = await outbid(list, { silent: true });
  lastAuto = { at: Date.now(), msg: L(`checked ${list.length}, changed ${n}`, `sprawdzono ${list.length}, zmieniono ${n}`) };
  if (el) render();
}

function updateAuto(st) {
  const on = settings.autoBuy;
  const info = !on ? L('off', 'wyłączone') : !isLeader() ? L('runs in another tab', 'działa w innej karcie') : st?.running ? L('working…', 'pracuje…') : L(`next in ${Math.max(0, Math.round((auto.next - Date.now()) / 60000))} min`, `następne za ${Math.max(0, Math.round((auto.next - Date.now()) / 60000))} min`);
  ui.status('autobuy', `${L('Auto-outbid', 'Auto-przebijanie')}: <b class="${on ? 'ok' : 'mut'}">${info}</b>${lastAuto ? ` · ${timeAgo(lastAuto.at)}: ${esc(lastAuto.msg)}` : ''}`);
  const i = el?.querySelector('#b-autoinfo');
  if (i) i.textContent = info;
}

export const auto = every('auto-buy', () => settings.autoBuyEvery, () => settings.autoBuy, autoCycle, updateAuto);
