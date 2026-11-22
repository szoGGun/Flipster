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
      <button class="b" data-a="reload" title="${L('buyorders.loadsYourOrdersAndChecks')}">⟳ ${L('buyorders.refresh')}</button>
      <button class="b go" data-a="newform">+ ${L('buyorders.newOrder')}</button>
      <span class="sub" id="b-state"></span>
      <span class="sp"></span>
      <button class="b dbg" data-a="research" title="${L('buyorders.downloadsTheOrderBookAnd')}">⬇ ${L('buyorders.dataForAnalysis')}</button>
      <button class="b" data-a="autopanel" title="${L('buyorders.automaticOutbiddingInTheBackground')}">⚙ ${L('buyorders.auto')}: <b id="b-autostate">${settings.autoBuy ? L('buyorders.on') : L('buyorders.off')}</b></button>
      <button class="b" data-a="stop" hidden>■ Stop</button>
    </div>
    <div id="b-form" hidden style="padding:10px 14px;border-bottom:1px solid #22303f">
      <div class="row2" style="padding:0;align-items:flex-end">
        <label style="position:relative">${L('buyorders.itemTypeItsNameIn')}<input type="search" id="b-q" style="width:340px" placeholder="${L('buyorders.eGRevolutionCaseAk')}">
          <div id="b-sugg" class="sugg" hidden></div></label>
        <label>${L('buyorders.pricePerUnit')}<input class="p" id="b-price"></label>
        <label>${L('buyorders.quantity')}<input type="number" id="b-qty" value="1" min="1" style="width:64px"></label>
        <button class="b go" data-a="create">${L('buyorders.placeOrder')}</button>
      </div>
      <div class="sub" id="b-peek" style="margin-top:6px"></div>
    </div>
    <div id="b-autopanel" hidden class="note" style="padding:10px 14px">
      <div class="row2" style="padding:0 0 6px">
        <label>${L('buyorders.outbidAutomatically')}<input type="checkbox" id="b-auto" ${settings.autoBuy ? 'checked' : ''}></label>
        <label>${L('buyorders.everyMinutes')}<input type="number" min="2" id="b-every" value="${settings.autoBuyEvery}" style="width:70px"></label>
        <label>${L('buyorders.lowerWhenImAloneAt')}<input type="checkbox" id="b-lower" ${settings.autoBuyLower ? 'checked' : ''}></label>
        <button class="b" data-a="autonow">${L('buyorders.checkNow')}</button>
        <span class="sub" id="b-autoinfo"></span>
      </div>
      ${L('buyorders.theAutomationOutbidsByOne')}
    </div>
    <div id="b-bulk" class="bar" hidden style="position:static;background:rgba(102,192,244,.06)">
      <span id="b-bulkn"></span>
      <button class="b red" data-a="cancel">${L('buyorders.cancelSelected')}</button>
      <button class="b" data-a="selnone">${L('buyorders.deselect')}</button>
    </div>
    <table><thead><tr>
      <th style="width:1%"><input type="checkbox" id="b-all"></th><th>${L('buyorders.item')}</th><th>${L('buyorders.yourOrder')}</th><th>${L('buyorders.market')}</th><th>${L('buyorders.suggestion')}</th><th></th>
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
      research: () => research.exportResearch(rows.map((x) => ({ hash: x.hash, appid: x.appid })), L('buyorders.fromYourBuyOrders'), { onBusy: (b) => (el.querySelector('[data-a="stop"]').hidden = !b) }),
      newform: () => { const f = el.querySelector('#b-form'); f.hidden = !f.hidden; if (!f.hidden) el.querySelector('#b-q').focus(); },
      autopanel: () => { const p = el.querySelector('#b-autopanel'); p.hidden = !p.hidden; },
      bid: () => r && outbidOne(r), rm: () => r && cancelOne(r), save: () => r && saveEdit(r),
      edit: () => { if (r) { edit = edit?.id === r.id ? null : { id: r.id, price: toInput(proposal(r)?.price ?? r.price), qty: String(r.remaining) }; render(); } },
      cfg: () => { if (r) { openCfg = openCfg === r.id ? null : r.id; render(); } },
      cancel: doCancel, create: doCreate, selnone: () => { rows.forEach((x) => (x.checked = false)); render(); },
    })[a]?.();
  });
  root.querySelector('#b-all').onchange = (e) => { rows.forEach((r) => (r.checked = e.target.checked)); render(); };
  root.querySelector('#b-auto').onchange = (e) => { settings.autoBuy = e.target.checked; el.querySelector('#b-autostate').textContent = e.target.checked ? L('buyorders.on') : L('buyorders.off'); auto.reschedule(); };
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
  if (isNaN(p) || !(p > 0)) return L('buyorders.enterAPrice');
  const real = realUp(p);
  const sum = (q > 0 ? ` · ${L('buyorders.total')} ${steam.fmt(real * q)}` : '') + (r?.comp != null ? ` · ${L('buyorders.highestOtherOrder')}: ${steam.fmt(r.comp)}` : '');
  return real !== p
    ? `<span class="warn">${steam.fmt(p)} ${L('buyorders.doesntExistOnSteamFees')} ${steam.fmt(real)}</span>${sum}`
    : sum.slice(3);
}

async function saveEdit(r) {
  const typed = parsePrice(edit?.price ?? '');
  const qty = parseInt(edit?.qty, 10);
  if (isNaN(typed) || !(typed > 0)) return ui.log(L('buyorders.enterAPrice2'), 'warn');
  if (!(qty > 0)) return ui.log(L('buyorders.enterAQuantity'), 'warn');
  const price = realUp(typed);
  if (price === r.price && qty === r.remaining) { edit = null; render(); return ui.log(L('buyorders.priceAndQuantityUnchanged')); }
  const snapped = price !== typed ? `<br><span class="warn">${steam.fmt(typed)} ${L('buyorders.doesntExistOnSteamPlacing')} ${steam.fmt(price)}.</span>` : '';
  if (!(await ui.ask(L('buyorders.changeTheOrder'), `${esc(r.name)}<br>${r.remaining} × ${steam.fmt(r.price)} → <b>${qty} × ${steam.fmt(price)}</b> = ${steam.fmt(price * qty)}${snapped}<br><span class="sub">${L('buyorders.steamDoesntLetYouEdit')}</span>`, { ok: L('buyorders.change') }))) return;
  edit = null;
  await withLock('outbid', () => replaceOrder(r, price, qty));
  setTimeout(refresh, 1000);
}

// ---- item search for a new order (any language; the order needs the English market_hash_name)
async function findItems(text) {
  const box = el.querySelector('#b-sugg');
  if (text.trim().length < 3) { box.hidden = true; return; }
  box.hidden = false;
  box.innerHTML = L('buyorders.searching');
  try {
    const lang = steam.uiLanguage();
    const d = await steam.schedule('search', () => fetch(`${steam.ORIGIN}/market/search/render/?norender=1&appid=730&l=${lang}&query=${encodeURIComponent(text)}&search_descriptions=0&count=10`, { credentials: 'include' }).then((r) => r.json()));
    const res = d?.results || [];
    box.innerHTML = res.length ? res.map((x) => `<div data-pick="${esc(JSON.stringify({ hash: x.hash_name, name: x.hash_name, appid: 730 }))}">
      <img src="https://community.cloudflare.steamstatic.com/economy/image/${esc(x.asset_description?.icon_url || '')}/62fx62f"><span style="color:#${esc(x.asset_description?.name_color || 'c6d4df')}">${esc(x.hash_name || x.name)}</span><span class="p2">${esc(x.sell_price_text || '')}</span></div>`).join('') : L('buyorders.nothingFound');
  } catch (e) { box.innerHTML = `<div class="err">${esc(e.message)}</div>`; }
}
function pick(p) {
  picked = p;
  el.querySelector('#b-q').value = p.name;
  el.querySelector('#b-sugg').hidden = true;
  peek();
}

function chip(r) {
  if (r.comp == null) return checking ? `<span class="chipst mut">${L('buyorders.checking')}</span>` : r.h ? `<span class="chipst ok">${L('buyorders.highest')}</span>` : '<span class="chipst mut">-</span>';
  if (r.comp > shown(r)) return `<span class="chipst bad">${L('buyorders.outbidSomeoneOffers', { comp: steam.fmt(r.comp) })}</span>`;
  if (r.comp === shown(r)) return '<span class="chipst mid">remis</span>';
  return `<span class="chipst ok">${L('buyorders.highest')}</span>`;
}

/** proposal: 1 cent above the highest other order (within your max), and whether it still makes sense vs the lowest sell */
function proposal(r) {
  const rule = r.rule || {};
  if (r.comp == null || r.comp < shown(r)) return null;
  let price = priceAbove(r.comp, net);
  let note = L('buyorders.aCentMoreThanThe');
  if (rule.max != null && price > rule.max) return { price: null, note: `przebicie (${steam.fmt(price)}) przekracza Twoje max ${steam.fmt(rule.max)}` };
  if (r.h?.lowestSell && price >= r.h.lowestSell) note = L('buyorders.carefulThatsAlreadyWhatBuying', { lowestSell: steam.fmt(r.h.lowestSell) });
  return { price, note };
}

// background checks finish an order every fraction of a second: they redraw together, a few times a second at most
let drawTimer = 0;
const renderSoon = () => { if (!drawTimer) drawTimer = setTimeout(render, 400); };
function render() {
  clearTimeout(drawTimer);
  drawTimer = 0;
  if (!el) return; // the automation also runs in tabs where this list was never opened
  const tb = el.querySelector('tbody');
  const cnt = document.querySelector('#stt [data-mt="buy"] .cnt');
  if (cnt) cnt.textContent = `(${rows.length})`;
  const a = document.activeElement;
  if (a && tb.contains(a) && a.tagName === 'INPUT' && a.type !== 'checkbox') { pendingRender = true; return; }
  pendingRender = false;
  const sel = rows.filter((r) => r.checked);
  el.querySelector('#b-bulk').hidden = !sel.length;
  el.querySelector('#b-bulkn').textContent = L('buyorders.selected', { sel: sel.length });
  const beaten = rows.filter((r) => r.comp != null && r.comp > shown(r)).length;
  el.querySelector('#b-state').innerHTML = checking ? `<span class="acc">${L('buyorders.checkingTheCompetition')}</span>` : lastCheck ? (beaten ? `<b class="err">${beaten} ${L('buyorders.outbid')}</b> · ${L('buyorders.checked')} ${timeAgo(lastCheck)}` : `<span class="ok">${L('buyorders.allHighest')}</span> · ${L('buyorders.checked')} ${timeAgo(lastCheck)}`) : '';
  if (!rows.length) { ui.clearRows(tb); tb.innerHTML = L('buyorders.youHaveNoBuyOrders'); return; }
  const rowHtml = (r) => {
    const rule = r.rule || {};
    // what the order makes once it fills: sold after the 7-day lock at the price the item typically sells for (last 7
    // days), never above the cheapest listing, as the Okazje scanner counts it. Not "one cent under the cheapest
    // listing": that spread flip never paid in the test on 108 items. Needs the price history (fetched once, 12 h).
    const typ = sig.typical(r.hash);
    const sellAt = typ?.d7 && r.h?.lowestSell ? Math.min(Math.round(typ.d7), r.h.lowestSell - 1) : null;
    const fp = sellAt ? steam.receivedFromBuyer(sellAt) - shown(r) : null;
    const p = proposal(r);
    const autoTag = rule.auto ? `<span class="chipst ${rule.max != null ? 'ok' : 'mid'}" title="${rule.max != null ? L('buyorders.autoOutbidsUpTo', { max: steam.fmt(rule.max) }) : L('buyorders.autoIsOnButWithout')}">auto</span>` : '';
    const main = `<tr data-id="${r.id}">
      <td><input type="checkbox" data-f="chk" ${r.checked ? 'checked' : ''}></td>
      <td>${ui.itemCell(r)}</td>
      <td><b>${steam.fmt(r.price)}</b> × ${r.remaining}${r.qty !== r.remaining ? `<span class="sub"> (${L('buyorders.of')} ${r.qty})</span>` : ''}<div class="sub">${L('buyorders.total')} ${steam.fmt(r.price * r.remaining)}</div>${shown(r) !== r.price ? `<div class="sub warn" title="${L('buyorders.thisPriceCantBePaid', { r: steam.fmt(shown(r)), price: steam.fmt(realUp(r.price)) })}">${L('buyorders.standsAs')} ${steam.fmt(shown(r))}</div>` : ''}</td>
      <td>${chip(r)} ${autoTag}<div class="sub" style="margin-top:3px">${r.h?.lowestSell ? `${L('buyorders.buyNow')}: ${steam.fmt(r.h.lowestSell)}` : ''}${fp != null ? ` · <span title="${L('buyorders.profitPerUnitAfterThe', { sellAt: steam.fmt(sellAt) })}">${L('buyorders.afterSelling')}: <span class="${fp > 0 ? 'pos' : 'neg'}">${steam.fmt(fp)}</span></span>` : ''} · <a class="acc" target="_blank" href="${esc(ui.marketUrl(r.appid, r.hash))}">${L('buyorders.market2')} ↗</a></div></td>
      <td>${p?.price != null ? `<b>${steam.fmt(p.price)}</b><div class="sub">${esc(p.note)}</div>` : p ? `<span class="sub warn">${esc(p.note)}</span>` : r.comp != null ? L('buyorders.nothingNeeded') : ''}${r.status ? `<div class="sub ${r.cls || ''}">${esc(r.status)}</div>` : ''}</td>
      <td><div class="acts">
        ${p?.price != null ? `<button class="b go" data-a="bid" data-id="${r.id}" title="${L('buyorders.cancelsTheOrderAndPlaces', { price: steam.fmt(p.price) })}">${L('buyorders.outbid2')} ${steam.fmt(p.price)}</button>` : ''}
        <button class="b ${edit?.id === r.id ? 'on' : ''}" data-a="edit" data-id="${r.id}" title="${L('buyorders.anotherPriceOrQuantityCancels')}">${L('buyorders.change')}</button>
        <button class="b red" data-a="rm" data-id="${r.id}">${L('buyorders.cancel')}</button>
        <button class="b ${openCfg === r.id ? 'on' : ''}" data-a="cfg" data-id="${r.id}" title="${L('buyorders.maximumPriceAndAutomation')}">⚙</button>
      </div></td></tr>`;
    const editRow = edit?.id !== r.id ? '' : `<tr class="cfg" data-id="${r.id}"><td></td><td colspan="5"><div class="row2" style="padding:6px 0;align-items:flex-end">
      <label>${L('buyorders.newPricePerUnit')}<input class="p" data-f="np" value="${esc(edit.price)}"></label>
      <label>${L('buyorders.quantity')}<input type="number" min="1" data-f="nq" value="${esc(edit.qty)}" style="width:64px"></label>
      <button class="b go" data-a="save" data-id="${r.id}">${L('buyorders.save')}</button>
      <span class="sub ehint">${editHint(r)}</span>
    </div></td></tr>`;
    if (openCfg !== r.id) return main + editRow;
    return main + editRow + `<tr class="cfg" data-id="${r.id}"><td></td><td colspan="5"><div class="row2" style="padding:6px 0;align-items:flex-end">
      <label>${L('buyorders.dontPayMoreThan')}<input class="p" data-f="max" value="${toInput(rule.max)}" placeholder="-"></label>
      <label style="flex-direction:row;align-items:center;gap:6px"><input type="checkbox" data-f="auto" ${rule.auto ? 'checked' : ''}> ${L('buyorders.outbidAutomatically2')}</label>
      ${rule.auto && rule.max == null ? L('buyorders.setDontPayMoreThan') : ''}
    </div></td></tr>`;
  };
  ui.patchRows(tb, rows.map((r) => ({ key: r.id, html: rowHtml(r) })));
}

async function outbidOne(r) {
  const p = proposal(r);
  if (p?.price == null) return;
  if (!(await ui.ask(L('buyorders.outbidTheOrder'), `${esc(r.name)}<br>${steam.fmt(r.price)} → <b>${steam.fmt(p.price)}</b> × ${r.remaining} = ${steam.fmt(p.price * r.remaining)}<br><span class="sub">${L('buyorders.theOldOrderIsCancelled')}</span>`, { ok: L('buyorders.outbid2') }))) return;
  await withLock('outbid', () => replaceOrder(r, p.price));
  setTimeout(refresh, 1000);
}
async function cancelOne(r) {
  if (!(await ui.ask(L('buyorders.cancelTheOrder'), `${esc(r.name)}, ${r.remaining} × ${steam.fmt(r.price)}`, { ok: L('buyorders.cancelOrder'), cancel: L('buyorders.back'), danger: true }))) return;
  const c = await steam.cancelBuyOrder(r.id);
  setStatus(r, c.ok ? L('buyorders.cancelled') : L('buyorders.error', { status: c.status }), c.ok ? 'ok' : 'err');
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
    if (!lastCheck) ui.log(L('buyorders.loadedBuyOrders', { rows: rows.length }));
    render();
    autoMarket();
    sig.ensure(rows.map((x) => ({ hash: x.hash, appid: x.appid })), { onEach: () => renderSoon() }); // for "po sprzedaży"
  } catch (e) {
    ui.log(L('buyorders.errorLoadingOrders') + e.message, 'err');
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
        ui.log(L('buyorders.someoneOutbidYourOrderYours', { hash: r.hash, comp: steam.fmt(comp), price: steam.fmt(r.price) }), 'warn');
      }
      r.comp = comp;
      renderSoon();
    } catch (e) { setStatus(r, e.message, 'err'); if (e.status === 429) break; }
  }
  if (!quiet) ui.progress(0);
  lastCheck = Date.now();
  render();
  const beaten = rows.filter((r) => r.comp != null && r.comp > shown(r)).length;
  ui.status('outbid', beaten ? `<b class="err">${L('buyorders.outbidOrders')}: ${beaten}</b>` : null);
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
  if (!c.ok || (c.json.success && c.json.success !== 1)) { setStatus(r, L('buyorders.couldntCancel', { message: c.json.message || c.status }), 'err'); return null; }
  const res = await placeOrder({ appid: r.appid, hash: r.hash, priceEach: price, qty });
  if (res.ok) { setStatus(r, `${steam.fmt(r.price)} → ${steam.fmt(price)}${qty !== r.remaining ? ` × ${qty}` : ''}${res.confirm ? L('buyorders.confirmInTheApp') : ''}`, 'ok'); return res.id; }
  setStatus(r, L('buyorders.cancelledButTheNewOrder', { msg: res.msg }), 'err');
  ui.log(L('buyorders.oldOrderCancelledTheNew', { hash: r.hash, msg: res.msg }), 'err');
  return null;
}

export async function placeOrder({ appid, hash, priceEach, qty }) {
  const r = await steam.createBuyOrder({ appid, hash, priceEach, qty });
  const j = r.json || {};
  if (j.success === 1) return { ok: true, id: j.buy_orderid, confirm: !!j.need_confirmation };
  if (j.need_confirmation) return { ok: true, confirm: true };
  return { ok: false, msg: j.message || (j.success === 29 ? L('buyorders.youAlreadyHaveAnOrder') : L('buyorders.code', { success: j.success ?? r.status })) };
}

async function outbid(list, { silent = false, tk = token() } = {}) {
  if (!list.length) { if (!silent) ui.log(L('buyorders.selectSomeOrders'), 'warn'); return 0; }
  let changed = 0;
  await withLock('outbid', async () => {
    for (const r of list) {
      if (tk.cancelled) break;
      const rule = r.rule || {};
      if (rule.max == null) { setStatus(r, L('buyorders.setAMaxPrice'), 'warn'); continue; }
      try {
        r.h = await prices.hist(r.appid, r.hash, 20000);
        r.comp = competitorBuy(r.h.buyGraph, shown(r), r.remaining, settings.ignoreBelow ?? 2);
        const t = buyOrderTarget({ current: r.price, myQty: r.remaining, buyGraph: r.h.buyGraph, rule: { max: rule.max, lower: settings.autoBuyLower }, net: (p) => steam.receivedFromBuyer(p), minQty: settings.ignoreBelow ?? 2 });
        if (t.price == null) { setStatus(r, t.reason, t.outbid ? 'warn' : ''); continue; }
        ui.log(`${r.hash}: ${L('buyorders.order')} ${steam.fmt(r.price)} → ${steam.fmt(t.price)} (${t.reason})`);
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
  if (!sel.length) return ui.log(L('buyorders.selectSomeOrders'), 'warn');
  if (!(await ui.ask(L('buyorders.cancelTheOrders'), L('buyorders.cancelBuyOrders', { sel: sel.length }), { ok: L('buyorders.cancelOrders'), cancel: L('buyorders.back'), danger: true }))) return;
  await withLock('cancel', async () => {
    for (const r of sel) {
      const c = await steam.cancelBuyOrder(r.id);
      setStatus(r, c.ok ? L('buyorders.cancelled') : L('buyorders.error', { status: c.status }), c.ok ? 'ok' : 'err');
    }
  });
  setTimeout(refresh, 800);
}

async function peek() {
  const out = el.querySelector('#b-peek');
  if (!picked) return;
  out.textContent = L('buyorders.loading');
  try {
    const [h, hist] = await Promise.all([prices.hist(picked.appid, picked.hash), steam.priceHistory(picked.appid, picked.hash).catch(() => null)]);
    const fr = hist?.length ? flipReal({ buyGraph: h.buyGraph, sellGraph: h.sellGraph, points: hist, net: (p) => steam.receivedFromBuyer(p) }) : null;
    out.innerHTML = `${L('buyorders.highestOrderOfOthers')}: <b>${steam.fmt(h.highestBuy)}</b> · ${L('buyorders.buyNow')}: <b>${steam.fmt(h.lowestSell)}</b>${fr ? ` · <span title="${L('buyorders.likeTheDealsScannerAn')}">flip: ${steam.fmt(fr.buy)} → ${steam.fmt(fr.sell)}, <span class="${fr.profit > 0 ? 'pos' : 'neg'}">${steam.fmt(fr.profit)} (${pct(fr.roi)})</span></span>` : ''} · <a class="acc" target="_blank" href="${esc(ui.marketUrl(picked.appid, picked.hash))}">${L('buyorders.market2')} ↗</a>`;
    if (!el.querySelector('#b-price').value && h.highestBuy) el.querySelector('#b-price').value = toInput(priceAbove(h.highestBuy, (p) => steam.receivedFromBuyer(p)));
  } catch (e) { out.innerHTML = `<span class="err">${esc(e.message)}</span>`; }
}

async function doCreate() {
  const price = parsePrice(el.querySelector('#b-price').value);
  const qty = Math.max(1, parseInt(el.querySelector('#b-qty').value, 10) || 1);
  if (!picked) return ui.log(L('buyorders.pickAnItemFromThe'), 'warn');
  if (isNaN(price)) return ui.log(L('buyorders.enterAPrice2'), 'warn');
  if (!(await ui.ask(L('buyorders.placeTheBuyOrder'), `${esc(picked.name)}<br>${qty} × ${steam.fmt(price)} = <b>${steam.fmt(price * qty)}</b>`, { ok: L('buyorders.place') }))) return;
  const r = await withLock('create', () => placeOrder({ appid: picked.appid, hash: picked.hash, priceEach: price, qty }));
  ui.log(r.ok ? L('buyorders.orderPlaced', { name: picked.name, qty, price: steam.fmt(price), confirm: r.confirm ? L('buyorders.confirmInTheApp') : '' }) : L('buyorders.orderRejected', { msg: r.msg }), r.ok ? 'ok' : 'err');
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
  lastAuto = { at: Date.now(), msg: L('buyorders.checkedChanged', { list: list.length, n }) };
  if (el) render();
}

function updateAuto(st) {
  const on = settings.autoBuy;
  const info = !on ? L('buyorders.off2') : !isLeader() ? L('buyorders.runsInAnotherTab') : st?.running ? L('buyorders.working') : L('buyorders.nextInMin', { min: Math.max(0, Math.round((auto.next - Date.now()) / 60000)) });
  ui.status('autobuy', `${L('buyorders.autoOutbid')}: <b class="${on ? 'ok' : 'mut'}">${info}</b>${lastAuto ? ` · ${timeAgo(lastAuto.at)}: ${esc(lastAuto.msg)}` : ''}`);
  const i = el?.querySelector('#b-autoinfo');
  if (i) i.textContent = info;
}

export const auto = every('auto-buy', () => settings.autoBuyEvery, () => settings.autoBuy, autoCycle, updateAuto);
