import * as ui from '../core/ui.js';
import * as steam from '../core/steam.js';
import * as prices from '../core/prices.js';
import { esc, pct } from '../core/util.js';

export const isTradePage = () => /^\/tradeoffer\//.test(location.pathname);

let inv = new Map(); // assetid -> item (both sides)
let box;
let fetching = false;

const scriptVar = (re) => [...document.scripts].map((s) => s.textContent.match(re)).find(Boolean)?.[1];

function slotItems(sel) {
  return [...document.querySelectorAll(`${sel} .item[id^="item"]`)].map((n) => {
    const m = n.id.match(/^item(\d+)_(\d+)_(\d+)$/);
    return m ? { appid: m[1], contextid: m[2], assetid: m[3] } : null;
  }).filter(Boolean);
}

const valueOf = (it) => ({ steam: prices.cached(it.appid, it.hash)?.lowest ?? null });

export async function init() {
  if (!isTradePage()) return;
  const partner = scriptVar(/g_ulTradePartnerSteamID\s*=\s*'(\d{17})'/);
  box = document.createElement('div');
  box.id = 'stt-trade';
  box.style.cssText = 'position:fixed;right:16px;top:90px;z-index:99980;width:300px;background:#171d25;border:1px solid #2a475e;border-radius:6px;padding:10px 12px;font:13px "Motiva Sans",Arial,sans-serif;color:#c6d4df;box-shadow:0 4px 18px #000a';
  box.innerHTML = '<b style="color:#fff">Analiza wymiany</b><div id="stt-tr-body" style="margin-top:6px">Ładowanie ekwipunków…</div>';
  document.body.appendChild(box);

  const load = async (sid) => {
    try { (await steam.inventory(sid, 730, 2)).forEach((i) => inv.set(i.assetid, { ...i, owner: sid })); }
    catch (e) { ui.log(`Ekwipunek ${sid === partner ? 'partnera' : 'Twój'}: ${e.message}`, 'warn'); }
  };
  await Promise.all([load(steam.ctx().steamId), partner ? load(partner) : null]);
  update();
  const obs = new MutationObserver(() => { clearTimeout(obs.t); obs.t = setTimeout(update, 300); });
  ['#your_slots', '#their_slots'].forEach((s) => { const n = document.querySelector(s); if (n) obs.observe(n, { childList: true, subtree: true }); });
}

async function update() {
  const mine = slotItems('#your_slots').map((a) => inv.get(a.assetid) || { ...a, unknown: true });
  const theirs = slotItems('#their_slots').map((a) => inv.get(a.assetid) || { ...a, unknown: true });
  const missing = [...mine, ...theirs].filter((i) => i.hash && i.marketable && !prices.hasLowest(i.appid, i.hash, 120));
  render(mine, theirs, missing.length);
  if (missing.length && !fetching) {
    fetching = true;
    await prices.lowestPrices(missing.map((i) => ({ appid: i.appid, hash: i.hash })), { maxAgeMin: 120, onEach: () => render(mine, theirs, 0) });
    fetching = false;
    render(mine, theirs, 0);
  }
}

function side(list) {
  let steamV = 0, noPrice = 0;
  for (const it of list) {
    const v = valueOf(it);
    const q = it.amount || 1;
    if (v.steam) steamV += v.steam * q; else noPrice++;
  }
  return { steamV, noPrice, n: list.length, unknown: list.filter((i) => i.unknown).length };
}

function render(mine, theirs, loading) {
  const a = side(mine), b = side(theirs);
  const diff = b.steamV - a.steamV;
  const bad = a.steamV > 0 && diff < -a.steamV * 0.03;
  const list = (l) => l.slice(0, 12).map((it) => {
    const v = valueOf(it);
    return `<div style="display:flex;justify-content:space-between;gap:6px;font-size:12px"><span style="overflow:hidden;white-space:nowrap;text-overflow:ellipsis;color:#${esc(it.color || 'c6d4df')}" title="${esc(it.hash || '?')}">${esc(it.name || 'nieznany przedmiot')}${it.nameTag ? ` <i style="color:#e5b84c" title="Name tag">„${esc(it.nameTag)}”</i>` : ''}${it.float != null ? ` <span style="color:#9bd">${it.float.toFixed(4)}</span>` : ''}${it.stickers?.length ? ` <span style="color:#e5b84c">✦${it.stickers.length}</span>` : ''}</span><span>${steam.fmt(v.steam)}</span></div>`;
  }).join('') + (l.length > 12 ? `<div style="font-size:11px;color:#8f98a0">+${l.length - 12} więcej</div>` : '');
  box.querySelector('#stt-tr-body').innerHTML = `
    <div style="color:#8f98a0;font-size:11px;margin-top:4px">DAJESZ (${a.n})</div>${list(mine)}
    <div style="text-align:right"><b>${steam.fmt(a.steamV)}</b></div>
    <div style="color:#8f98a0;font-size:11px;margin-top:6px">DOSTAJESZ (${b.n})</div>${list(theirs)}
    <div style="text-align:right"><b>${steam.fmt(b.steamV)}</b></div>
    <hr style="border:0;border-top:1px solid #2a475e;margin:8px 0">
    <div style="display:flex;justify-content:space-between"><span>Bilans (Steam)</span><b style="color:${diff >= 0 ? '#a4d007' : '#ff6b6b'}">${diff >= 0 ? '+' : ''}${steam.fmt(diff)}${a.steamV ? ` (${pct(diff / a.steamV)})` : ''}</b></div>
    ${bad ? '<div style="margin-top:6px;padding:6px;background:#5a1d1d;border-radius:4px;color:#fff">⚠ Dajesz więcej, niż dostajesz!</div>' : ''}
    ${a.unknown + b.unknown ? `<div style="color:#e5b84c;font-size:11px;margin-top:4px">${a.unknown + b.unknown} przedmiotów nierozpoznanych (prywatny ekwipunek / inna gra)</div>` : ''}
    ${a.noPrice + b.noPrice ? `<div style="color:#8f98a0;font-size:11px">${loading ? `pobieram ceny (${loading})…` : `${a.noPrice + b.noPrice} bez ceny Steam`}</div>` : ''}
    <div style="color:#8f98a0;font-size:11px;margin-top:4px">Ceny: najniższa oferta Steam. Naklejki i float nie są wliczone, sprawdź je ręcznie.</div>`;
}
