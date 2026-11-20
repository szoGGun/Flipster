// "Skrzynie" tab: is it worth opening a case? Expected value of one opening vs case + key price.
// Data: market search by collection (ItemSet tag) gives every skin of the case with its rarity (asset type)
// and lowest price, including the knife/glove pool. Odds are Valve's published case odds.
import * as ui from '../core/ui.js';
import * as steam from '../core/steam.js';
import * as prices from '../core/prices.js';
import * as store from '../core/store.js';
import * as disk from '../core/cache.js';
import { token } from '../core/jobs.js';
import { esc, pct, timeAgo } from '../core/util.js';
import * as sh from './storehist.js';
import * as casedb from './casedb.js';
import { ownedCount } from './inventory.js';

// Valve's published odds (per opening)
const ODDS = { mil: 0.7992, res: 0.1598, cla: 0.032, cov: 0.0064, gold: 0.0026 };
const TIER_NAME = { mil: 'Mil-Spec (niebieskie)', res: 'Restricted (fioletowe)', cla: 'Classified (różowe)', cov: 'Covert (czerwone)', gold: '★ nóż / rękawice' };
const TIER_COLOR = { mil: '4b69ff', res: '8847ff', cla: 'd32ce6', cov: 'eb4b4b', gold: 'caab05' };
// typical wear split for a skin with the full 0-1 float range; renormalised over the wears that exist on the market
const WEAR_P = { 'Factory New': 0.03, 'Minimal Wear': 0.24, 'Field-Tested': 0.33, 'Well-Worn': 0.24, 'Battle-Scarred': 0.16 };
const ST_P = 0.1;
// capsules: the same rarity ladder without the knife tier, the weapon-case weights, renormalised over the rarities a
// capsule has (data sites list e.g. 80,68 / 16,10 / 3,22% for one without gold, exactly that); no key needed
const CAP_W = { mil: 79.92, res: 15.98, cla: 3.2, cov: 0.64 };
const CAP_NAME = { mil: 'High Grade (zwykłe)', res: 'Remarkable (holo / glitter / haft)', cla: 'Exotic (foil / holo)', cov: 'Extraordinary (złote)' };
const kindSel = () => el?.querySelector('#k-kind')?.value || 'case';
const TTL = 6 * 3600000; // case list (case prices)
const EV_TTL = 24 * 3600000; // drop prices change slowly → a computed case stays valid for a day

const cache = store.bucket('caseEV2'); // case hash -> result
let el, task = null, list = []; // [{hash, name, icon, priceUsd, listings, set}]
const sort = ui.sorter('res'); // the average result of one opening (EV − cost): the smallest loss first
let fullScan = false; // a full recalculation is running → show only the cases already computed
const allGold = new Set(); // cases whose whole knife/glove list is expanded
let open = null; // hash of the expanded case

// ---------------------------------------------------------------- Steam data
// search pages are reused for a few minutes (Ustawienia → pamięć danych rynku), empty answers never
const search = (params) => disk.cached(`q|/market/search/render/?norender=1&appid=730&l=english&${params}`, disk.ttl(), () => steam.schedule('search', async () => {
  const r = await fetch(`${steam.ORIGIN}/market/search/render/?norender=1&appid=730&l=english&${params}`, { credentials: 'include' });
  if (r.status === 429) throw new steam.HttpError(429, 'Steam: za dużo zapytań (429)');
  if (!r.ok) throw new steam.HttpError(r.status);
  return disk.slimSearch(await r.json());
}), (d) => d?.results?.length > 0);
async function searchAll(params, max = 600) {
  const out = [];
  for (let start = 0; start < max; ) {
    const d = await search(`${params}&start=${start}&count=100`);
    const res = d.results || [];
    out.push(...res);
    if (!res.length || out.length >= (d.total_count || 0)) break;
    start += res.length;
  }
  return out;
}

/** collection name candidates for a case: "Operation Bravo Case" → "The Bravo Collection" */
const SPECIAL = { 'CS:GO Weapon Case': 'The Arms Deal Collection', 'CS:GO Weapon Case 2': 'The Arms Deal 2 Collection', 'CS:GO Weapon Case 3': 'The Arms Deal 3 Collection', 'Revolver Case': 'The Revolver Case Collection' };
function setNames(caseName) {
  if (SPECIAL[caseName]) return [SPECIAL[caseName]];
  const base = caseName.replace(/\s+(Weapon\s+)?Case$/i, '');
  return [...new Set([base, base.replace(/^Operation\s+/i, '')])].map((b) => `The ${b} Collection`);
}

let setTags = null; // localized collection name (lowercase) -> tag
async function loadSetTags() {
  if (setTags) return setTags;
  const saved = store.get('caseSetTags', null);
  if (saved && Date.now() - saved.at < 7 * 86400000) return (setTags = new Map(saved.tags));
  const d = await steam.schedule('market', () => fetch(`${steam.ORIGIN}/market/appfilters/730?l=english`, { credentials: 'include' }).then((r) => r.json()));
  const tags = Object.entries(d.facets?.['730_ItemSet']?.tags || {}).map(([k, v]) => [String(v.localized_name).toLowerCase(), k]);
  store.set('caseSetTags', { at: Date.now(), tags });
  return (setTags = new Map(tags));
}

/**
 * USD (search prices) → wallet currency: the median of local ÷ search price over the 3 most popular cases. One item
 * alone carries the noise of two prices read at different moments, and the rate moves every price except the key's.
 */
let usdRate = null;
async function refreshRate(cases) {
  const rs = [];
  for (const c of cases.filter((x) => x.priceUsd > 0).slice(0, 3)) {
    const local = (await prices.steamPrice(730, c.hash).catch(() => null))?.lowest;
    if (local) rs.push(local / c.priceUsd);
  }
  if (rs.length) usdRate = rs.sort((a, b) => a - b)[Math.floor(rs.length / 2)];
  return usdRate;
}

async function loadCases() {
  const res = await searchAll('category_730_Type%5B%5D=tag_CSGO_Type_WeaponCase&sort_column=popular&sort_dir=desc', 1000);
  const tags = await loadSetTags();
  const db = await casedb.load().catch(() => null);
  list = res.filter((r) => (/Case$/.test(r.hash_name) && !/souvenir|terminal/i.test(r.hash_name)) || db?.caps?.[r.hash_name]).map((r) => {
    const cap = !!db?.caps?.[r.hash_name] && !/Case$/.test(r.hash_name);
    const set = cap ? null : setNames(r.hash_name).map((n) => tags.get(n.toLowerCase())).find(Boolean) || null;
    return { hash: r.hash_name, name: r.name, icon: r.asset_description?.icon_url, color: r.asset_description?.name_color, priceUsd: r.sell_price, listings: r.sell_listings, set, kind: cap ? 'capsule' : 'case' };
  });
  await refreshRate(list);
  store.set('caseList', { at: Date.now(), list, usdRate });
}

// ---------------------------------------------------------------- expected value
// rarity from the item colour (same in every Steam language); knives/gloves have ★ in the market hash name
const COLOR_TIER = { '4b69ff': 'mil', '8847ff': 'res', 'd32ce6': 'cla', 'eb4b4b': 'cov' };
const tierOf = (hash = '', color = '', type = '') => (/★/.test(hash) || /★/.test(type) ? 'gold' : COLOR_TIER[String(color).toLowerCase()]
  || (/Covert/i.test(type) ? 'cov' : /Classified/i.test(type) ? 'cla' : /Restricted/i.test(type) ? 'res' : /Mil-Spec/i.test(type) ? 'mil' : null));
const parseHash = (h) => {
  const st = /StatTrak™/.test(h);
  const wear = h.match(/\((Factory New|Minimal Wear|Field-Tested|Well-Worn|Battle-Scarred)\)\s*$/)?.[1] || null;
  const base = h.replace(/^(★\s*)?(StatTrak™\s*)?/, '').replace(/\s*\((Factory New|Minimal Wear|Field-Tested|Well-Worn|Battle-Scarred)\)\s*$/, '').trim();
  return { st, wear, base };
};
const net = (p) => steam.receivedFromBuyer(p);

// search results cached across cases (knife/glove pools are shared by many cases) and across runs (24 h)
const qCache = store.bucket('caseQ');
async function searchCached(params, max) {
  const hit = qCache.get(params);
  if (hit && Date.now() - hit.at < EV_TTL) return hit.res;
  const res = (await searchAll(params, max)).map((r) => ({ hash_name: r.hash_name, sell_price: r.sell_price, sell_listings: r.sell_listings, asset_description: { name_color: r.asset_description?.name_color, icon_url: r.asset_description?.icon_url, type: r.asset_description?.type } }));
  qCache.set(params, { at: Date.now(), res });
  return res;
}

/** value of one skin (wear-weighted by its float range, net) for normal / StatTrak variants */
function skinValue(variants, st, range) {
  const v = variants.filter((x) => x.st === st && x.price > 0);
  if (!v.length) return null;
  if (v.length === 1 && !v[0].wear) return { ev: net(v[0].price), outcomes: [{ p: 1, value: net(v[0].price), hash: v[0].hash }] };
  const wp = range ? casedb.wearProbs(range) : WEAR_P;
  const w = v.map((x) => ({ ...x, w: wp[x.wear] || 0 })).filter((x) => x.w > 0);
  const sum = w.reduce((s, x) => s + x.w, 0);
  if (!sum) return null;
  const outcomes = w.map((x) => ({ p: x.w / sum, value: net(x.price), hash: x.hash }));
  return { ev: outcomes.reduce((s, o) => s + o.p * o.value, 0), outcomes };
}

/** "a | Budapest 2025", "b (Holo) | Budapest 2025" → "Budapest 2025" (one search for the whole event), else null */
function commonEvent(names) {
  const ev = names.map((n) => (n.includes(' | ') ? n.slice(n.lastIndexOf(' | ') + 3) : null));
  return ev[0] && ev.every((x) => x === ev[0]) ? ev[0] : null;
}

async function computeCapsule(c, def) {
  const rate = usdRate || store.get('caseList', {}).usdRate;
  if (!rate) throw new Error('brak kursu USD');
  const pre = def.kind === 'Patch' ? 'Patch | ' : 'Sticker | ';
  const found = new Map(def.items.map(([n]) => [pre + n, null]));
  // prices: one search for the event's stickers (shared by its capsules), then exact searches for what it missed
  const ev = commonEvent(def.items.map(([n]) => n));
  if (ev) {
    const res = await searchCached(`category_730_Type%5B%5D=${def.kind === 'Patch' ? 'tag_CSGO_Tool_Patch' : 'tag_CSGO_Tool_Sticker'}&query=${encodeURIComponent(ev)}&search_descriptions=0&sort_column=name&sort_dir=asc`, 2000);
    for (const r of res) if (found.has(r.hash_name)) found.set(r.hash_name, r);
  }
  for (const [h, v] of found) {
    if (v || task?.cancelled) continue;
    const r = (await searchCached(`query=${encodeURIComponent(h)}&search_descriptions=0`, 10)).find((x) => x.hash_name === h);
    if (r) found.set(h, r);
  }
  const present = [...new Set(def.items.map(([, t]) => t))];
  const W = present.reduce((s, t) => s + CAP_W[t], 0);
  const odds = Object.fromEntries(present.map((t) => [t, CAP_W[t] / W]));
  const tiers = {}, outcomes = [];
  for (const t of present) {
    const per = [];
    let unpriced = 0;
    for (const [n] of def.items.filter(([, tt]) => tt === t)) {
      const r = found.get(pre + n);
      const price = r?.sell_price > 0 ? Math.round(r.sell_price * rate) : 0;
      if (!price) { unpriced++; continue; }
      const v = net(price);
      per.push({ base: n, color: r.asset_description?.name_color, ev: v, n: { ev: v }, t: null, hash: pre + n });
    }
    if (!per.length) continue;
    for (const s of per) outcomes.push({ p: odds[t] / per.length, value: s.ev, hash: s.hash, tier: t });
    tiers[t] = { p: odds[t], unpriced, skins: per.sort((a, b) => b.ev - a.ev).map((x) => ({ base: x.base, color: x.color, ev: x.ev, n: x.n, t: null })), ev: per.reduce((s, x) => s + x.ev, 0) / per.length };
  }
  if (!Object.keys(tiers).length) throw new Error('nie znalazłem cen naklejek z tej kapsuły');
  const casePrice = Math.round(c.priceUsd * rate);
  const cost = casePrice;
  const covered = Object.keys(tiers).reduce((s, k) => s + odds[k], 0);
  const evv = Object.entries(tiers).reduce((s, [k, x]) => s + odds[k] * x.ev, 0);
  const pOk = outcomes.filter((o) => o.value >= cost).reduce((s, o) => s + o.p, 0);
  const tail = [];
  for (let i = 0; i <= 32; i++) { const x = Math.round(cost * 16 ** (i / 32 - 0.5)); tail.push([x, Math.round(outcomes.filter((o) => o.value >= x).reduce((q, o) => q + o.p, 0) * 1e5) / 1e5]); }
  const top = [...outcomes].sort((a, b) => b.value - a.value)[0];
  const r = { hash: c.hash, at: Date.now(), v: 4, kind: 'capsule', exact: true, casePrice, keyCost: 0, cost, ev: evv, roi: cost ? evv / cost - 1 : null, pOk, tail, covered, odds, tiers, best: top ? { hash: top.hash, value: top.value } : null, nItems: def.items.length };
  cache.set(c.hash, r);
  return r;
}

async function computeCase(c, keyCost) {
  const rate = usdRate || store.get('caseList', {}).usdRate;
  if (!rate) throw new Error('brak kursu USD');
  const db = await casedb.load().catch((e) => { ui.log('Skrzynie: ' + e.message, 'warn'); return null; });
  const def = db?.cases[c.hash];
  if (!def && !c.set) throw new Error('nie znaleziono zawartości skrzyni');
  // prices: the case's collection (all its skins, often the knives too) …
  const found = c.set ? await searchCached(`category_730_ItemSet%5B%5D=tag_${c.set}`, 1500) : [];
  const variantsOf = new Map(); // base name (no ★/StatTrak/wear) -> variants
  const tierFromMarket = new Map();
  const iconOf = new Map(), colorOf = new Map();
  const add = (r) => {
    if (/souvenir/i.test(r.hash_name)) return;
    const { st, wear, base } = parseHash(r.hash_name);
    const arr = variantsOf.get(base) || variantsOf.set(base, []).get(base);
    if (arr.some((x) => x.hash === r.hash_name)) return;
    arr.push({ hash: r.hash_name, st, wear, price: r.sell_price > 0 ? Math.round(r.sell_price * rate) : 0, listings: r.sell_listings });
    const t = tierOf(r.hash_name, r.asset_description?.name_color, r.asset_description?.type || '');
    if (t && !tierFromMarket.has(base)) tierFromMarket.set(base, t);
    if (!st && r.asset_description?.name_color && !colorOf.has(base)) colorOf.set(base, r.asset_description.name_color);
    if (!iconOf.has(base)) iconOf.set(base, r.asset_description?.icon_url);
  };
  found.forEach(add);
  // … plus the knife/glove pool searched by weapon ("Navaja Knife") when the collection search didn't include it
  let skinList; // [{base, tier, range}]
  if (def) {
    const strip = (n) => n.replace(/^★\s*/, '');
    const missingRare = def.rare.filter((n) => !variantsOf.has(strip(n)));
    // one search per exact skin ("Butterfly Knife | Lore" → its ≤10 wear/StatTrak variants = 1 request) instead of
    // the whole knife type (all ~15 finishes, most of them not in this case)
    for (const n of missingRare) {
      if (task?.cancelled) break;
      const base = strip(n);
      if (base.includes('|')) {
        (await searchCached(`query=${encodeURIComponent(base)}&search_descriptions=0`, 20)).filter((r) => r.hash_name.startsWith('★') && parseHash(r.hash_name).base === base).forEach(add);
      } else {
        // vanilla knife: no wear, a search would return every finish of that knife → two direct price checks
        for (const h of [`★ ${base}`, `★ StatTrak™ ${base}`]) {
          const p = await prices.steamPrice(730, h).catch(() => null);
          if (p?.lowest) add({ hash_name: h, sell_price: p.lowest / rate, sell_listings: p.volume || 1, asset_description: {} });
        }
      }
    }
    skinList = [...def.items.map(([n, t]) => ({ base: strip(n), tier: t, range: db.floats[n] })), ...def.rare.map((n) => ({ base: strip(n), tier: 'gold', range: db.floats[n] }))];
  } else {
    skinList = [...variantsOf.keys()].filter((b) => tierFromMarket.get(b) && !/case$/i.test(b)).map((b) => ({ base: b, tier: tierFromMarket.get(b), range: null }));
  }
  const tiers = {};
  const outcomes = [];
  for (const [tier, p] of Object.entries(ODDS)) {
    const ss = skinList.filter((s) => s.tier === tier);
    if (!ss.length) continue;
    const per = [];
    let unpriced = 0;
    for (const s of ss) {
      const vars = variantsOf.get(s.base) || [];
      const n = skinValue(vars, false, s.range), t = skinValue(vars, true, s.range);
      if (!n && !t) { unpriced++; continue; }
      const stShare = !t ? 0 : !n ? 1 : ST_P;
      const ev = (n ? n.ev * (1 - stShare) : 0) + (t ? t.ev * stShare : 0);
      per.push({ ...s, color: colorOf.get(s.base), ev, n, t, stShare });
    }
    if (!per.length) continue;
    for (const s of per) {
      const ps = p / per.length;
      for (const o of s.n?.outcomes || []) outcomes.push({ p: ps * (1 - s.stShare) * o.p, value: o.value, hash: o.hash, tier });
      for (const o of s.t?.outcomes || []) outcomes.push({ p: ps * s.stShare * o.p, value: o.value, hash: o.hash, tier });
    }
    tiers[tier] = { p, unpriced, skins: per.sort((a, b) => b.ev - a.ev).map((x) => ({ base: x.base, color: x.color, ev: x.ev, n: x.n && { ev: x.n.ev }, t: x.t && { ev: x.t.ev } })), ev: per.reduce((s, x) => s + x.ev, 0) / per.length };
  }
  if (!Object.keys(tiers).length) throw new Error(`nie rozpoznano zawartości (${found.length} pozycji z wyszukiwarki)`);
  const casePrice = Math.round(c.priceUsd * rate);
  const cost = casePrice + keyCost;
  const covered = Object.keys(tiers).reduce((s, k) => s + ODDS[k], 0);
  const ev = Object.entries(tiers).reduce((s, [k, t]) => s + ODDS[k] * t.ev, 0);
  const pOk = outcomes.filter((o) => o.value >= cost).reduce((s, o) => s + o.p, 0);
  // P(drop worth ≥ x) for x from ¼ to 4 × today's cost, so the chance follows the key / case price and "mam już
  // skrzynię" without recomputing the case
  const tail = [];
  for (let i = 0; i <= 32; i++) { const x = Math.round(cost * 16 ** (i / 32 - 0.5)); tail.push([x, Math.round(outcomes.filter((o) => o.value >= x).reduce((q, o) => q + o.p, 0) * 1e5) / 1e5]); }
  const top = [...outcomes].sort((a, b) => b.value - a.value)[0];
  const r = { hash: c.hash, at: Date.now(), v: 4, exact: !!def, casePrice, keyCost, cost, ev, roi: cost ? ev / cost - 1 : null, pOk, tail, covered, tiers, best: top ? { hash: top.hash, value: top.value } : null, nItems: found.length };
  cache.set(c.hash, r);
  return r;
}

// ---------------------------------------------------------------- key price
function keyCost() {
  const near = sh.nearestKeyPrice(Date.now(), 'PLN');
  if (near && Date.now() - near.t < 400 * 86400000) return { price: near.price, src: `jak Twój ostatni klucz (${new Date(near.t).toLocaleDateString()})` };
  const rate = usdRate || store.get('caseList', {}).usdRate;
  return { price: rate ? Math.round(249 * rate) : 0, src: '2,49 USD po kursie' };
}

// ---------------------------------------------------------------- UI
export function mount(root) {
  el = root;
  const saved = store.get('caseList', null);
  if (saved) { list = saved.list || []; usdRate = saved.usdRate || null; }
  root.innerHTML = `
    <div class="bar">
      <button class="b g" data-a="scan">⟳ Przelicz skrzynie</button>
      <button class="b" data-a="stop" hidden>■ Stop</button>
      <select id="k-kind" title="Co pokazać i przeliczyć"><option value="case">Skrzynie</option><option value="cap">Kapsuły z naklejkami</option><option value="all">Skrzynie i kapsuły</option></select>
      <label class="tgl" title="Pomija skrzynie i kapsuły, które mają mniej niż 100 ofert na rynku: trudno je kupić, a ich ceny są niewiarygodne"><input type="checkbox" id="k-liq" checked><span class="tr"></span>Ukryj rzadko sprzedawane (&lt;100 ofert)</label>
      <label class="tgl" title="Licz każdą skrzynię i kapsułę tak, jakbyś już ją miał(a): koszt otwarcia = klucz + to, co dostałbyś za jej sprzedaż (po prowizji), a nie cena z rynku. Pojedyncze możesz potem poprawić polem „mam ją” w wierszu."><input type="checkbox" id="k-ownall" ${store.get('caseOwnAll', false) ? 'checked' : ''}><span class="tr"></span>Wszystkie już mam (nie kupuję)</label>
      <span class="sp"></span><span class="sub" id="k-info"></span>
    </div>
    <div class="cards" id="k-cards"></div>
    <details class="note"><summary>Jak to liczę?</summary>
      <b>EV</b> = średnia wartość dropu na rękę (po prowizji): suma po rzadkościach szansa × średnia cena skinów tej rzadkości.<br>
      Szanse Valve: niebieskie 79,92%, fioletowe 15,98%, różowe 3,20%, czerwone 0,64%, nóż/rękawice 0,26%. StatTrak™ 10%.<br>
      Zawartość skrzyń i zakresy floatu, z plików gry (zbiór ByMykel/CSGO-API). Stan zużycia liczony z zakresu floatu skina (np. Doppler wypada w ~96% jako FN).<br>
      <b>Strata na otwarciu</b> = koszt − EV: tyle średnio tracisz przy jednym otwarciu (na długą metę, pojedynczy drop może dać dużo więcej albo mniej). Tabela jest ułożona od najmniejszej straty.<br>
      <b>Kapsuły</b>: bez klucza, koszt = cena kapsuły. Rzadkości naklejek: High Grade (zwykłe), Remarkable (holo / glitter / haft), Exotic (foil / holo), Extraordinary (złote), szanse jak w skrzyniach (79,92 / 15,98 / 3,20 / 0,64), przeliczone na rzadkości, które kapsuła ma (tak podają serwisy z danymi o kapsułach; Valve nie publikuje ich osobno). Zawartość, z plików gry (ByMykel), ceny, z rynku Steam.<br>
      Ceny: najniższa oferta na rynku Steam (pojedyncze drogie dropy bywają w praktyce sprzedawane trochę taniej, więc EV jest raczej lekko zawyżone). Koszt = skrzynia + klucz. Przy skrzyni oznaczonej „mam ją” (zaznacza się sama, gdy jest w Twoim ekwipunku, po wczytaniu zakładki Ekwipunek) koszt = klucz + to, co dostałbyś za sprzedaż tej skrzyni (po prowizji). „Szansa na zwrot” = jak często drop jest wart tyle, ile kosztuje otwarcie.</details>
    <table id="k-tbl"><thead><tr>
      <th data-sort="name">Skrzynia</th><th data-sort="res" title="Średni wynik jednego otwarcia: EV − koszt, tyle średnio płacisz za otwarcie. Od najmniejszej straty.">Strata na otwarciu</th><th data-sort="cost">Koszt otwarcia</th><th data-sort="ev">EV</th>
      <th data-sort="pOk">Szansa na zwrot</th><th data-sort="best">Najlepszy drop</th><th data-sort="case">Cena skrzyni</th><th data-sort="listings">Ofert</th><th></th>
    </tr></thead><tbody></tbody></table>`;
  root.addEventListener('click', (e) => {
    const th = e.target.closest('th[data-sort]');
    if (th) { sort.click(th.dataset.sort); render(); return; }
    const a = e.target.closest('button')?.dataset.a;
    if (a === 'scan') return scan();
    if (a === 'stop') return task?.cancel();
    if (a === 'more') { const h = e.target.closest('button').dataset.hash; allGold.has(h) ? allGold.delete(h) : allGold.add(h); return render(); }
    if (a === 'one') return scan([e.target.closest('button').dataset.hash]);
    const tr = e.target.closest('tr[data-hash]');
    if (tr && !e.target.closest('a, button, label, input')) { open = open === tr.dataset.hash ? null : tr.dataset.hash; render(); }
  });
  store.del('caseKeyManual');
  recalcKey();
  root.querySelector('#k-liq').onchange = render;
  root.querySelector('#k-kind').value = store.get('caseKind', 'case');
  root.querySelector('#k-kind').onchange = (e) => { store.set('caseKind', e.target.value); render(); };
  root.querySelector('#k-ownall').onchange = (e) => {
    store.set('caseOwnAll', e.target.checked);
    store.set('caseOwned', {}); // the global switch sets every case; per-case ticks from now on override it again
    render();
  };
  root.addEventListener('change', (e) => {
    const h = e.target.dataset.own;
    if (h == null) return;
    store.set('caseOwned', { ...store.get('caseOwned', {}), [h]: e.target.checked }); // your tick beats the inventory
    render();
  });
  render();
}

export function show() { render(); }

/** key or case price changed → costs/ROI change, EV (drop values) stays */
function recalcKey() {
  const k = keyCost().price;
  for (const c of list) {
    const r = cache.get(c.hash);
    if (!r) continue;
    const rate = usdRate || store.get('caseList', {}).usdRate;
    if (rate && c.priceUsd > 0) r.casePrice = Math.round(c.priceUsd * rate); // case price from the fresher case list
    r.keyCost = r.kind === 'capsule' ? 0 : k; r.cost = r.casePrice + r.keyCost; r.roi = r.cost ? r.ev / r.cost - 1 : null;
    cache.set(c.hash, r);
  }
}

async function scan(only) {
  if (task) return;
  task = token();
  el.querySelector('[data-a="stop"]').hidden = false;
  try {
    if (!list.length || list.some((c) => !c.kind) || Date.now() - (store.get('caseList', {}).at || 0) > TTL) {
      ui.log('Skrzynie: pobieram listę skrzyń…');
      await loadCases();
      recalcKey();
    }
    const k = keyCost();
    const db = await casedb.load().catch(() => null);
    const liq = el.querySelector('#k-liq').checked;
    // full recalculation: drop old results and cached prices, the table fills in as cases are computed
    fullScan = !only;
    // (before the cleanup below, which already asks which kind is being recalculated)
    const kind = kindSel();
    const want = (c) => kind === 'all' || (kind === 'cap') === (c.kind === 'capsule');
    if (!only) { const keep = Object.fromEntries(Object.entries(cache.all()).filter(([h]) => { const c = list.find((x) => x.hash === h); return c && !want(c); })); cache.replace(keep); qCache.replace({}); render(); }
    const stale = (c) => { const r = cache.get(c.hash); return !r || r.v !== 4 || Date.now() - r.at > EV_TTL; };
    const todo = list.filter((c) => (only ? only.includes(c.hash) : want(c) && (!liq || c.listings >= 100) && stale(c)) && (c.kind === 'capsule' ? db?.caps?.[c.hash] : c.set || db?.cases[c.hash]));
    ui.log(`Skrzynie: liczę ${todo.length} ${kind === 'cap' ? 'kapsuł' : kind === 'all' ? 'skrzyń i kapsuł' : 'skrzyń'} (klucz ${steam.fmt(k.price)}, ${k.src})…`);
    let i = 0;
    const tStart = Date.now();
    for (const c of todo) {
      if (task.cancelled) break;
      ui.progress(i++, todo.length);
      const left = i > 1 ? Math.round(((Date.now() - tStart) / (i - 1)) * (todo.length - i + 1) / 60000) : null;
      el.querySelector('#k-info').textContent = `liczę ${c.name} (${i}/${todo.length})${left != null ? ` · zostało ok. ${left || '<1'} min` : ''}, wyniki pojawiają się na bieżąco, możesz w tym czasie korzystać z reszty`;
      try { await (c.kind === 'capsule' ? computeCapsule(c, db.caps[c.hash]) : computeCase(c, k.price)); } catch (e) { ui.log(`Skrzynie: ${c.name}, ${e.message}`, 'warn'); }
      render();
    }
    const miss = list.filter((c) => c.kind !== 'capsule' && !c.set && !db?.cases[c.hash]); // capsules need no collection; a case with known contents is computed anyway
    if (miss.length) console.warn('[Flipster] skrzynie bez rozpoznanej kolekcji (pominięte)', miss.map((c) => c.hash));
    ui.log('Skrzynie: gotowe.', 'ok');
  } catch (e) {
    ui.log('Skrzynie: ' + e.message, 'err');
  }
  ui.progress(0);
  task = null;
  fullScan = false;
  el.querySelector('[data-a="stop"]').hidden = true;
  render();
}

/** cost of one opening: the case's price (or, if you own it, what selling it would bring) + the key; EV − cost = result */
/** you have this case: your tick on it, else "mam je wszystkie", else whether it's in the inventory (Ekwipunek tab) */
function owns(hash) {
  const t = store.get('caseOwned', {})[hash];
  if (t != null) return t; // your tick on this case
  return store.get('caseOwnAll', false) || (ownedCount(hash) || 0) > 0; // "mam je wszystkie", else the inventory
}
function costOf(r) { return (owns(r.hash) ? net(r.casePrice) : r.casePrice) + r.keyCost; }
const resOf = (r) => r.ev - costOf(r);
/** chance that one drop is worth at least the current cost (from the saved tail; older results: as computed then) */
function pOkOf(r) {
  const c = costOf(r), t = r.tail;
  if (!t?.length || c < t[0][0] || c > t[t.length - 1][0]) return r.pOk;
  for (let i = 1; i < t.length; i++) if (c <= t[i][0]) { const [x0, p0] = t[i - 1], [x1, p1] = t[i]; return x1 === x0 ? p1 : p0 + ((p1 - p0) * (c - x0)) / (x1 - x0); }
  return r.pOk;
}

function render() {
  if (!el) return;
  const liq = el.querySelector('#k-liq').checked;
  const k = keyCost();
  const kind = kindSel();
  const rows = list.filter((c) => (kind === 'all' || (kind === 'cap') === (c.kind === 'capsule')) && (!liq || c.listings >= 100)).map((c) => ({ c, r: cache.get(c.hash) })).filter((x) => x.r || !fullScan);
  const done = rows.filter((x) => x.r);
  el.querySelector('#k-info').textContent = task ? el.querySelector('#k-info').textContent
    : list.length ? `${done.length}/${rows.length} skrzyń policzonych · klucz ${steam.fmt(k.price)} (${k.src})${done.length ? ` · dane sprzed ${timeAgo(Math.min(...done.map((x) => x.r.at)))}` : ''}` : 'Kliknij „Przelicz skrzynie”';
  const leastZl = [...done].sort((a, b) => resOf(b.r) - resOf(a.r))[0];
  const leastPct = [...done].sort((a, b) => b.r.ev / costOf(b.r) - a.r.ev / costOf(a.r))[0];
  const safest = [...done].sort((a, b) => pOkOf(b.r) - pOkOf(a.r))[0];
  const lossVal = (r) => { const v = resOf(r); return `${v >= 0 ? '+' : '−'}${steam.fmt(Math.round(Math.abs(v)))}`; };
  const lossCls = (r) => (resOf(r) >= 0 ? 'pos' : 'neg');
  const nameLine = (x) => `<div style="color:#fff;font-size:13px;margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${esc(x.c.name)}">${esc(x.c.name)}</div>`;
  el.querySelector('#k-cards').innerHTML = done.length ? `
    <div class="card" style="border-color:var(--acc);grid-column:span 2" title="Tyle średnio płacisz za jedno otwarcie tej skrzyni, najmniej ze wszystkich policzonych"><div class="k">Najmniejsza strata na otwarciu</div><div class="v ${lossCls(leastZl.r)}" style="font-size:26px;font-weight:700">${lossVal(leastZl.r)}</div>${nameLine(leastZl)}<div class="sub">koszt otwarcia ${steam.fmt(costOf(leastZl.r))} · wraca średnio ${pct(leastZl.r.ev / costOf(leastZl.r), 0)}</div></div>
    <div class="card" title="Z tej skrzyni wraca największa część kosztu, liczy się, gdy masz stały budżet"><div class="k">Najwięcej wraca (%)</div><div class="v">${pct(leastPct.r.ev / costOf(leastPct.r), 0)}</div>${nameLine(leastPct)}<div class="sub"><span class="${lossCls(leastPct.r)}">${lossVal(leastPct.r)}</span> na otwarciu · koszt ${steam.fmt(costOf(leastPct.r))}</div></div>
    <div class="card" title="Jak często drop jest wart co najmniej tyle, ile kosztuje otwarcie"><div class="k">Największa szansa na zwrot</div><div class="v">${pct(pOkOf(safest.r), 1)}</div>${nameLine(safest)}<div class="sub">otwarć daje drop wart ≥ ${steam.fmt(costOf(safest.r))}</div></div>` : '';
  const sorted = sort.apply(rows, {
    name: (x) => x.c.name, case: (x) => x.r?.casePrice ?? x.c.priceUsd, cost: (x) => (x.r ? costOf(x.r) : null), ev: (x) => x.r?.ev, res: (x) => (x.r ? resOf(x.r) : null),
    pOk: (x) => (x.r ? pOkOf(x.r) : null), best: (x) => x.r?.best?.value, listings: (x) => x.c.listings,
  });
  el.querySelector('#k-tbl tbody').innerHTML = sorted.map(({ c, r }) => {
    const main = `<tr data-hash="${esc(c.hash)}" style="cursor:pointer">
      <td>${ui.itemCell({ hash: c.hash, name: c.name, icon: c.icon, color: c.color, appid: 730, sub: c.set || c.kind === 'capsule' || r ? '' : '<span class="warn" title="Nie znam zawartości tej skrzyni, więc jej nie liczę">nie rozpoznano kolekcji</span>' })}</td>
      <td class="${r ? (resOf(r) >= 0 ? 'pos' : 'neg') : ''}">${r ? `<b style="font-size:15px">${resOf(r) >= 0 ? '+' : '−'}${steam.fmt(Math.round(Math.abs(resOf(r))))}</b><div class="sub">wraca ${pct(r.ev / costOf(r), 0)} kosztu</div>` : '<span class="sub">…</span>'}</td>
      <td>${r ? `${steam.fmt(costOf(r))}<div class="sub">${r.kind === 'capsule' ? (owns(c.hash) ? 'kapsuła po prowizji, bez klucza' : 'bez klucza') : owns(c.hash) ? `klucz ${steam.fmt(r.keyCost)} + skrzynia po prowizji` : `+ klucz ${steam.fmt(r.keyCost)}`}</div><label class="sub" style="display:inline-flex;gap:4px;align-items:center;cursor:pointer;margin-top:2px" title="Masz tę skrzynię: otwarcie kosztuje klucz + to, co dostałbyś za jej sprzedaż (po prowizji), a nie jej cenę z rynku"><input type="checkbox" data-own="${esc(c.hash)}" ${owns(c.hash) ? 'checked' : ''}> mam ją${ownedCount(c.hash) ? ` (${ownedCount(c.hash)} w ekwipunku)` : ''}</label>` : ''}</td>
      <td>${r ? steam.fmt(Math.round(r.ev)) + (r.covered < 0.999 || r.v !== 4 ? ` <span class="warn" title="${r.v !== 4 ? 'Policzone starą metodą, kliknij „Przelicz skrzynie”' : `Brak cen dla części rzadkości (${pct(1 - r.covered, 2)} szans), EV zaniżone`}">!</span>` : '') : ''}</td>
      <td>${r ? pct(pOkOf(r), 1) : ''}</td>
      <td>${r?.best ? `<span class="sub">${esc(r.best.hash)}</span><div>${steam.fmt(r.best.value)}</div>` : ''}</td>
      <td>${r ? steam.fmt(r.casePrice) : ''}</td>
      <td>${c.listings ?? ''}</td>
      <td style="text-align:right;width:1%">${(!r || r.v !== 4) ? `<button class="b" data-a="one" data-hash="${esc(c.hash)}" title="Policz tylko tę skrzynię" style="white-space:nowrap">⟳ policz</button>` : ''}</td></tr>`;
    if (open !== c.hash || !r) return main;
    const det = Object.entries(r.tiers).map(([t, x]) => `
      <div style="margin:6px 0 2px"><b style="color:#${TIER_COLOR[t]}">${(r.kind === 'capsule' ? CAP_NAME : TIER_NAME)[t]}</b> <span class="sub">szansa ${pct((r.odds || ODDS)[t], 2)} · średnio ${steam.fmt(Math.round(x.ev))} · wkład w EV ${steam.fmt(Math.round((r.odds || ODDS)[t] * x.ev))}</span></div>
      ${x.skins.slice(0, t === 'gold' && !allGold.has(c.hash) ? 12 : 999).map((s) => `<span class="tag" style="margin:2px" title="${esc(r.kind === 'capsule' ? `na rękę po sprzedaży: ${steam.fmt(Math.round(s.ev))}` : `zwykły: ${s.n ? steam.fmt(Math.round(s.n.ev)) : '-'} · StatTrak™: ${s.t ? steam.fmt(Math.round(s.t.ev)) : '-'} (na rękę, średnio po stanach)`)}"><span style="color:#${esc(t === 'gold' ? TIER_COLOR.gold : s.color || TIER_COLOR[t])}">${esc(s.base)}</span> ${steam.fmt(Math.round(s.ev))}</span>`).join('')}${t === 'gold' && x.skins.length > 12 ? ` <button class="b" data-a="more" data-hash="${esc(c.hash)}" style="padding:2px 8px">${allGold.has(c.hash) ? 'zwiń' : `+${x.skins.length - 12} więcej`}</button>` : ''}`).join('');
    return main + `<tr><td colspan="9" style="background:rgba(0,0,0,.15)">${det}</td></tr>`;
  }).join('') || '<tr><td colspan="9" class="empty">Kliknij „Przelicz skrzynie”. Policzenie wszystkich skrzyń trwa ok. 10-30 min, wyniki pojawiają się na bieżąco. Zostają zapisane, więc po odświeżeniu strony nie trzeba liczyć od nowa.</td></tr>';
}
