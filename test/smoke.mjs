// Smoke test: runs the built userscript in headless Chrome against a mocked steamcommunity.com.
// Nothing leaves the machine, every request is answered here. `npm run smoke`
import puppeteer from 'puppeteer-core';
import { readFileSync } from 'node:fs';
import { receivedFromBuyer, buyerFromReceived } from '../src/core/fees.js';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const bundle = readFileSync(new URL('../dist/flipster.user.js', import.meta.url), 'utf8');
const inv = JSON.parse(readFileSync(new URL('./fixtures/inv.json', import.meta.url), 'utf8'));
const ME = '76561190000000002';
const PARTNER = '76561190000000001';
const DAY = 86400000;
const now = Date.now();
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const TEC = 'Tec-9 | Groundwater (Field-Tested)';

// ------------------------------------------------------------------ mocked Steam state
const state = {
  listings: [
    { id: '111', assetid: '10000000001', hash: TEC, price: 210, fee: 31 },          // buyer 2,41, someone sells at 2,30
    { id: '222', assetid: '10000000106', hash: 'Revolution Case', price: 50, fee: 7 }, // buyer 0,57, the cheapest
  ],
  buyOrders: [{ id: '777', hash: 'Revolution Case', price: 20, qty: 5 }],               // someone bids 0,25
  nextId: 1000,
  failHistory: false,
};
const BOOK = {
  [TEC]: { buy: [200, 3, 190, 7], sell: [230, 1, 245, 5, 260, 14] },
  'Revolution Case': { buy: [25, 3, 20, 10], sell: [57, 1, 60, 5, 62, 400] },
  'Flip Test Case': { buy: [180, 5, 170, 10], sell: [241, 1, 245, 5, 260, 14] },
  'Dull A Test Case': { buy: [239, 500, 238, 500], sell: [241, 500, 242, 500] }, // deep, tight book: no flip possible
  'Risky Test Case': { buy: [195, 5, 190, 10], sell: [241, 1, 245, 5, 260, 14] },
};
const DEFAULT_BOOK = { buy: [200, 3, 190, 7], sell: [241, 1, 245, 5, 260, 14] };

// market history: two trades with exact times in the old JSON history (2023), four newer ones that exist only in
// the HTML history (dates without a year). Purchase ids grow linearly with time, as on Steam.
const tA = new Date(2023, 2, 10, 12).getTime(), tB = new Date(2023, 5, 20, 12).getTime();
const noon = (t) => { const d = new Date(t); return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12).getTime(); };
const tNewest = noon(now - 5 * DAY);
const pidAt = (t) => Math.round(6000 + (3500 * (t - tB)) / (tNewest - tB));
const HIST = [
  { lid: 9003, t: tNewest, sign: '-', hash: 'AK-47 | Slate (Field-Tested)', price: '2,60zł', aid: '501' },
  { lid: 9002, t: noon(now - 13 * DAY), sign: '+', hash: 'AK-47 | Slate (Field-Tested)', price: '2,00zł', aid: '502' },
  { lid: 8001, t: noon(now - 330 * DAY), sign: '-', hash: 'Fracture Case', price: '1,50zł', aid: '503' },
  { lid: 7001, t: noon(now - 731 * DAY), sign: '+', hash: 'Fracture Case', price: '0,90zł', aid: '504' }, // same day of year as "now − 1 day", two years back
  { lid: 1001, t: tB, pid: 6000, sign: '-', hash: 'Recoil Case', price: '1,20zł', aid: '505' },
  { lid: 1000, t: tA, pid: 5000, sign: '+', hash: 'Recoil Case', price: '0,80zł', aid: '506' },
].map((x) => ({ ...x, pid: x.pid ?? pidAt(x.t) }));
const dayLabel = (t) => { const d = new Date(t); return `${d.getDate()} ${MON[d.getMonth()]}`; };
const histHtml = () => ({
  success: true, total_count: HIST.length,
  results_html: HIST.map((x) => `<div class="market_listing_row market_recent_listing_row" id="history_row_${x.lid}_${x.pid}">
    <div class="market_listing_left_cell market_listing_gainorloss">${x.sign}</div>
    <div class="market_listing_right_cell market_listing_their_price"><span class="market_listing_price">${x.price}</span></div>
    <div class="market_listing_right_cell market_listing_listed_date can_combine">${dayLabel(x.t)}</div>
    <div class="market_listing_right_cell market_listing_listed_date can_combine">${dayLabel(x.t - DAY)}</div>
    <div class="market_listing_item_name_block"><span id="history_row_${x.lid}_${x.pid}_name" class="market_listing_item_name">${x.hash}</span></div>
  </div>`).join(''),
  hovers: HIST.map((x) => `CreateItemHoverFromContainer( g_rgAssets, 'history_row_${x.lid}_${x.pid}_name', 730, '2', '${x.aid}', 0 );`).join('\n'),
  // the AK-47 | Slate sold 5 days ago comes with its float and pattern seed, as Steam sends them for some items
  assets: { 730: { 2: Object.fromEntries(HIST.map((x) => [x.aid, { market_hash_name: x.hash, name: x.hash, icon_url: 'x', amount: '1', ...(x.aid === '501' ? { asset_properties: [{ propertyid: 2, float_value: '0.2512' }, { propertyid: 1, int_value: '123' }] } : {}) }])) } },
});
const histJson = () => ({ success: true, total_count: 2, events: [
  { listingid: '1001', purchaseid: '6000', event_type: 3, time_event: tB / 1000 },
  { listingid: '1000', purchaseid: '5000', event_type: 4, time_event: tA / 1000 }] });

// inventory history: a market purchase newer than the market history, an opened case, a trade
const ihDate = (t) => { const d = new Date(t); return `${d.getDate()} ${MON[d.getMonth()]}, ${d.getFullYear()}`; };
// the clock time of the event as Steam prints it ("3:41pm"): the "30 minutes from now" purchase must really be later today than the sync
const ihTime = (t) => { const d = new Date(t), h = d.getHours(); return `${h % 12 || 12}:${String(d.getMinutes()).padStart(2, '0')}${h >= 12 ? 'pm' : 'am'}`; };
const IH = [
  // a purchase made after the market history was last read (Flipster takes only those from here: older ones are in the
  // market history with their real price) → "30 minutes from now", the test reaches Historia well before that
  { t: now + 30 * 60000, desc: 'You purchased an item on the Community Market.', plus: ['MP7 | Army Recon (Field-Tested)'], minus: [] },
  { t: now - 20 * DAY, desc: 'Unlocked a container', plus: ['P250 | Re.built (Field-Tested)'], minus: ['Revolution Case', 'Revolution Case Key'] },
  { t: now - 40 * DAY, desc: `You traded with <a href="https://steamcommunity.com/profiles/${PARTNER}">Kolega</a>`, plus: ['Snakebite Case'], minus: ['Recoil Case'] },
];
const ihNames = [...new Set(IH.flatMap((e) => [...e.plus, ...e.minus]))];
const ihItem = (n) => `<a class="history_item" data-appid="730" data-classid="c${ihNames.indexOf(n)}" data-instanceid="0"><span class="history_item_name">${n}</span></a>`;
const ihGroup = (sign, list) => (list.length ? `<div class="tradehistory_items"><div class="tradehistory_items_plusminus">${sign}</div><div class="tradehistory_items_group">${list.map(ihItem).join('')}</div></div>` : '');
const invHistory = () => ({
  success: true,
  html: IH.map((e) => `<div class="tradehistoryrow"><div class="tradehistory_date">${ihDate(e.t)}<div class="tradehistory_timestamp">${ihTime(e.t)}</div></div>
    <div class="tradehistory_content"><div class="tradehistory_event_description">${e.desc}</div>${ihGroup('-', e.minus)}${ihGroup('+', e.plus)}</div></div>`).join(''),
  descriptions: { 730: Object.fromEntries(ihNames.map((n, i) => [`c${i}_0`, { market_hash_name: n, name: n, icon_url: 'x', name_color: 'D2D2D2' }])) },
});

// price history: 4.5 years of daily points, slowly rising with a yearly wave
const fmtDate = (t) => new Date(t).toUTCString().replace(/^\w+, (\d+) (\w+) (\d+) (\d+):.*$/, '$2 $1 $3 $4: +0');
const PRICE_HISTORY = { success: true, prices: Array.from({ length: 1650 }, (_, i) => {
  const t = now - (1650 - i) * DAY;
  return [fmtDate(t), +(1.2 + i / 1500 + 0.2 * Math.sin((i / 365) * 2 * Math.PI)).toFixed(3), String(40 + (i % 17))];
}) };
// the last two days hour by hour, as Steam returns them (the "sold in 24 h" figure comes from these)
for (let h = 47; h >= 1; h--) PRICE_HISTORY.prices.push([fmtDate(now - h * 3600000), 2.4, '5']);

// flip scanner fixtures: "Flip Test Case" has room between bids and trades (and somebody did sell that low),
// "Risky Test Case" too but its price swings ±20% a week, the "Dull" ones have nobody selling at the bid
const bookHits = {};
const histHits = {};
const cheapTrades = (list, price) => { const p = list.map((x) => [...x]); for (const h of [40, 39, 38]) p.find((x) => x[0] === fmtDate(now - h * 3600000))[1] = price; return p; };
function historyFor(hash) {
  if (hash === 'Flip Test Case') return { success: true, prices: cheapTrades(PRICE_HISTORY.prices, 1.8) };
  if (hash === 'Risky Test Case') {
    const n = PRICE_HISTORY.prices.length - 47; // daily points; the hourly tail stays at 2,40
    return { success: true, prices: cheapTrades(PRICE_HISTORY.prices.map((x, i) => (i >= n || n - i > 190 ? x : [x[0], Math.floor((n - i) / 7) % 2 ? 2.0 : 2.6, x[2]])), 1.9) };
  }
  return PRICE_HISTORY;
}
const sr = (hash, usdCents, listings, color = 'D2D2D2', type = '') => ({ name: hash, hash_name: hash, sell_listings: listings, sell_price: usdCents, sell_price_text: `$${(usdCents / 100).toFixed(2)}`, asset_description: { icon_url: 'x', name_color: color, type, market_name: hash } });
const CASES = [sr('Revolution Case', 60, 5000, 'D2D2D2', 'Base Grade Container'), sr('Fracture Case', 30, 8000, 'D2D2D2', 'Base Grade Container')];
const SET_REVOLUTION = [
  sr('MP5-SD | Liquidation (Factory New)', 200, 50, '4b69ff', 'Mil-Spec Grade SMG'), sr('MP5-SD | Liquidation (Minimal Wear)', 100, 80, '4b69ff', 'Mil-Spec Grade SMG'),
  sr('MP5-SD | Liquidation (Field-Tested)', 50, 300, '4b69ff', 'Mil-Spec Grade SMG'), sr('StatTrak™ MP5-SD | Liquidation (Field-Tested)', 150, 40, '4b69ff', 'StatTrak™ Mil-Spec Grade SMG'),
  sr('P250 | Re.built (Field-Tested)', 40, 500, '4b69ff', 'Mil-Spec Grade Pistol'),
  sr('MAC-10 | Sakkaku (Field-Tested)', 100, 200, '8847ff', 'Restricted SMG'),
  sr('Glock-18 | Umbral Rabbit (Field-Tested)', 300, 150, 'd32ce6', 'Classified Pistol'),
  sr('M4A4 | Temukau (Field-Tested)', 5000, 60, 'eb4b4b', 'Covert Rifle'),
];
const SET_FRACTURE = [
  sr('Negev | Ultralight (Field-Tested)', 20, 900, '4b69ff', 'Mil-Spec Grade Machinegun'), sr('MAC-10 | Allure (Field-Tested)', 90, 300, '8847ff', 'Restricted SMG'),
  sr('Glock-18 | Vogue (Field-Tested)', 400, 200, 'd32ce6', 'Classified Pistol'), sr('Desert Eagle | Printstream (Field-Tested)', 6000, 100, 'eb4b4b', 'Covert Pistol'),
];
const FLIPS = ['Dull A Test Case', 'Risky Test Case', 'Flip Test Case', 'Dull C Test Case'].map((n) => sr(n, 60, 500, 'D2D2D2', 'Base Grade Container'));
const FLIPS2 = ['Dull D Test Case', 'Dull E Test Case'].map((n) => sr(n, 60, 500, 'D2D2D2', 'Base Grade Container'));
const GLOVES = [sr('★ Sport Gloves | Slingshot (Field-Tested)', 80000, 12, '8650AC', '★ Extraordinary Gloves')];
const WEAR_PL = ['prosto z fabryki', 'lekko zużyte', 'po testach bojowych', 'mocno zużyte', 'po ciężkich walkach'];

// external (GM_xmlhttpRequest) responses, embedded into the page
const GM_DATA = {
  spItems: [{ market_hash_name: TEC, min_price: 0.45, suggested_price: 0.6, quantity: 50 }, { market_hash_name: 'Revolution Case', min_price: 0.5, quantity: 500 }],
  spSales: [{ market_hash_name: TEC, last_7_days: { median: 0.5, volume: 40 }, last_30_days: { median: 0.5, volume: 160 } }],
  nbp: { rates: [{ effectiveDate: new Date(now - 3 * DAY).toISOString().slice(0, 10), mid: 4.0 }] },
  crates: [{ type: 'Case', market_hash_name: 'Revolution Case',
    contains: [
      { name: 'MP5-SD | Liquidation', rarity: { id: 'rarity_rare_weapon' } }, { name: 'P250 | Re.built', rarity: { id: 'rarity_rare_weapon' } },
      { name: 'MAC-10 | Sakkaku', rarity: { id: 'rarity_mythical_weapon' } }, { name: 'Glock-18 | Umbral Rabbit', rarity: { id: 'rarity_legendary_weapon' } },
      { name: 'M4A4 | Temukau', rarity: { id: 'rarity_ancient_weapon' } }],
    contains_rare: [{ name: '★ Sport Gloves | Slingshot' }, { name: '★ Flip Knife' }] }],
  skins: ['MP5-SD | Liquidation', 'P250 | Re.built', 'MAC-10 | Sakkaku', 'Glock-18 | Umbral Rabbit', 'M4A4 | Temukau', '★ Sport Gloves | Slingshot'].map((name) => ({ name, min_float: name.startsWith('★') ? 0.06 : 0, max_float: name.startsWith('★') ? 0.8 : 1 })),
  storeHtml: `<html><body>var g_sessionID = "store123"; <table class="wallet_history_table"><tbody>
    <tr class="wallet_table_row"><td class="wht_date">${ihDate(now - 20 * DAY)}</td><td class="wht_items"><div>Counter-Strike 2</div><div>Revolution Case Key</div></td><td class="wht_type"><div>In-Game Purchase</div></td><td class="wht_total">10,35zł</td></tr>
    </tbody></table></body></html>`,
};
const GM = `
  window.__gmMiss = [];
  window.GM_getValue = (k) => { const v = localStorage.getItem('gm_' + k); return v == null ? undefined : JSON.parse(v); };
  window.GM_setValue = (k, v) => localStorage.setItem('gm_' + k, JSON.stringify(v));
  window.GM_deleteValue = (k) => localStorage.removeItem('gm_' + k);
  (() => {
    const D = ${JSON.stringify(GM_DATA).replace(/</g, '\\u003c')};
    window.GM_xmlhttpRequest = (o) => setTimeout(() => {
      const u = o.url; let body = null;
      if (u.includes('api.skinport.com/v1/sales')) body = JSON.stringify(D.spSales);
      else if (u.includes('api.skinport.com/v1/items')) body = JSON.stringify(D.spItems);
      else if (u.includes('api.nbp.pl')) body = JSON.stringify(D.nbp);
      else if (u.endsWith('crates.json')) body = JSON.stringify(D.crates);
      else if (u.endsWith('skins.json')) body = JSON.stringify(D.skins);
      else if (u.includes('store.steampowered.com/account/history')) body = D.storeHtml;
      else if (u.includes('AjaxLoadMoreHistory')) body = '{}';
      if (body == null) { window.__gmMiss.push(u); return o.onload({ status: 404, responseText: '' }); }
      o.onload({ status: 200, responseText: body });
    }, 30);
  })();
  if (!localStorage.getItem('gm_settings')) {
    localStorage.setItem('gm_settings', JSON.stringify({ delay: 300 }));
    // request pacing already "learned" down to its minimum, so the test doesn't take ten minutes
    localStorage.setItem('gm_lanes', JSON.stringify({ hist: { iv: 350 }, market: { iv: 600 }, inv: { iv: 1500 }, price: { iv: 2000 }, search: { iv: 500 }, page: { iv: 3000 } }));
  }
`;
const page0 = (path) => `<!doctype html><html lang="pl"><head><title>Steam</title></head><body>
  <script>var g_steamID = "${ME}"; var g_sessionID = "abc123";
  var g_rgWalletInfo = {"wallet_currency":6,"wallet_country":"PL","wallet_fee":"1","wallet_fee_minimum":"1","wallet_fee_percent":"0.05","wallet_publisher_fee_percent_default":"0.10","wallet_fee_base":"0","wallet_balance":"3107"};
  ${path.includes('tradeoffer') ? `var g_ulTradePartnerSteamID = '${PARTNER}';` : ''}
  </script>
  ${path.includes('tradeoffer') ? '<div id="your_slots"><div class="item" id="item730_2_10000000001"></div></div><div id="their_slots"><div class="item" id="item730_2_10000000379"></div></div>' : ''}
  <script>${GM}</script><script src="/__flipster.js"></script></body></html>`;

function search(q) {
  const cat = q.get('category_730_Type[]'), set = q.get('category_730_ItemSet[]'), wear = q.get('category_730_Exterior[]'), text = q.get('query') || '';
  const page = (list) => ({ success: true, start: +q.get('start') || 0, total_count: list.length, results: +q.get('start') ? [] : list });
  if (wear) { const i = +wear.replace('tag_WearCategory', ''); return page([{ ...sr('AK-47 | Slate', 100, 10), asset_description: { market_name: `AK-47 | Łupek (${WEAR_PL[i]})` } }]); }
  if (set === 'tag_set_community_32') { state.setHits = (state.setHits || 0) + 1; return page(SET_REVOLUTION); }
  if (set === 'tag_set_community_26') return page(SET_FRACTURE);
  if (/Sport Gloves/.test(text)) return page(GLOVES);
  if (/test case/i.test(text)) {
    // 6 items in two pages; the second page comes back empty once, as Steam does under load
    const start = +q.get('start') || 0;
    if (start === 0) return { success: true, start: 0, total_count: 6, results: FLIPS };
    if (start === 4 && !state.emptyPageServed) { state.emptyPageServed = true; return { success: true, start: 4, total_count: 0, results: [] }; }
    return { success: true, start, total_count: 6, results: start === 4 ? FLIPS2 : [] };
  }
  if (cat === 'tag_CSGO_Type_WeaponCase') return page([sr('Austin 2025 Legends Sticker Capsule', 30, 9000, 'D2D2D2', 'Base Grade Container'), ...CASES]); // Steam's container type also holds capsules
  return page([...CASES, sr(TEC, 60, 300, '4b69ff', 'Mil-Spec Grade Pistol')].filter((r) => !text || r.name.toLowerCase().includes(text.toLowerCase())));
}

const posts = [];
const misses = [];
function respond(url, method, body) {
  const u = new URL(url);
  const p = u.pathname;
  if (method === 'POST') {
    const b = new URLSearchParams(body || '');
    if (p.startsWith('/market/removelisting/')) { state.listings = state.listings.filter((l) => l.id !== p.split('/')[3]); return { success: true }; }
    if (p.startsWith('/market/sellitem')) {
      const price = +b.get('price');
      const asset = inv.assets.find((a) => a.assetid === b.get('assetid'));
      const ds = asset && inv.descriptions.find((d) => d.classid === asset.classid && d.instanceid === asset.instanceid);
      if (!ds) return { success: false, message: 'mock: nie ma takiego przedmiotu' };
      state.listings.push({ id: String(state.nextId++), assetid: asset.assetid, hash: ds.market_hash_name, price, fee: buyerFromReceived(price) - price });
      return { success: true, requires_confirmation: 1 };
    }
    if (p.startsWith('/market/cancelbuyorder')) { state.buyOrders = state.buyOrders.filter((o) => o.id !== b.get('buy_orderid')); return { success: 1 }; }
    if (p.startsWith('/market/createbuyorder')) {
      const qty = +b.get('quantity'), id = String(state.nextId++);
      state.buyOrders.push({ id, hash: b.get('market_hash_name'), price: +b.get('price_total') / qty, qty });
      return { success: 1, buy_orderid: id };
    }
    return null;
  }
  if (p.startsWith('/market/mylistings')) return { success: true, total_count: state.listings.length, start: 0, num_active_listings: state.listings.length,
    listings: +u.searchParams.get('start') ? [] : state.listings.map((l) => ({ listingid: l.id, time_created: now / 1000 - 3600, asset: { appid: 730, contextid: '2', id: l.assetid, amount: '1', market_hash_name: l.hash, name: l.hash, icon_url: 'x', asset_properties: inv.asset_properties.find((p) => String(p.assetid) === l.assetid)?.asset_properties || [] }, price: l.price, fee: l.fee, publisher_fee_percent: '0.100000001490116119' })),
    listings_to_confirm: [],
    buy_orders: state.buyOrders.map((o) => ({ appid: 730, hash_name: o.hash, price: String(o.price), quantity: String(o.qty), quantity_remaining: String(o.qty), buy_orderid: o.id, description: { name: o.hash } })) };
  if (p.startsWith('/inventory/')) return /\/730\/2$/.test(p) ? { ...inv, more_items: 0 } : { success: 1, assets: [], descriptions: [], total_inventory_count: 0 };
  if (p.startsWith('/market/priceoverview')) return u.searchParams.get('currency') === '1'
    ? { success: true, lowest_price: '$0.60', volume: '120', median_price: '$0.60' }
    : { success: true, lowest_price: '2,41zł', volume: '120', median_price: '2,40zł' };
  if (p.startsWith('/market/orderbook')) {
    const [, hash] = JSON.parse(u.searchParams.get('qp'));
    const b = BOOK[hash] || DEFAULT_BOOK;
    bookHits[hash] = (bookHits[hash] || 0) + 1;
    const sum = (a) => a.reduce((s, v, i) => s + (i % 2 ? v : 0), 0);
    return { data: { success: true, data: { amtMaxBuyOrder: b.buy[0], amtMinSellOrder: b.sell[0], eCurrency: 6, cBuyOrders: sum(b.buy), cSellOrders: sum(b.sell), rgCompactBuyOrders: b.buy, rgCompactSellOrders: b.sell } } };
  }
  if (p.startsWith('/market/pricehistory')) { const h = u.searchParams.get('market_hash_name'); histHits[h] = (histHits[h] || 0) + 1; return historyFor(h); }
  if (p.startsWith('/market/myhistory')) {
    if (state.failHistory) return { status: 500 };
    if (state.emptyHistory) return { success: true, total_count: 0, start: 0, events: [], results_html: '' };
    if (u.searchParams.get('norender')) return +u.searchParams.get('start') ? { success: true, total_count: 2, events: [] } : histJson();
    return +u.searchParams.get('start') ? { success: true, total_count: HIST.length, results_html: '' } : histHtml();
  }
  if (p.startsWith('/market/search/render')) return search(u.searchParams);
  if (p === '/market/actions' && u.searchParams.get('q') === 'Search') {
    if (!state.newSearch) return { status: 500 }; // the new search is down: the old way must work
    state.newSearchHits = (state.newSearchHits || 0) + 1;
    const row = (strHash, strMinSellSubtotal) => ({ strHash, strMinSellSubtotal, cSellOrders: 5000, eCurrency: 6, asset_description: { name: strHash, icon_url: 'x', name_color: 'D2D2D2', type: 'Base Grade Container' } });
    const results = [row('Austin 2025 Legends Sticker Capsule', '5,00 zł'), row('Revolution Case', '40,00 zł'), row('Fracture Case', '20,00 zł')];
    return { data: { total_count: results.length, results } };
  }
  if (p.startsWith('/market/appfilters')) return { success: true, facets: { '730_ItemSet': { tags: { set_community_32: { localized_name: 'The Revolution Collection' }, set_community_26: { localized_name: 'The Fracture Collection' } } } } };
  // Steam filters the history by game: the Steam items' one (app 753, cards and backgrounds) is empty here
  if (/\/inventoryhistory/.test(p)) return u.searchParams.get('cursor[time]') || u.searchParams.getAll('app[]').includes('753') ? { success: true, html: '', descriptions: {} } : invHistory();
  return null;
}

// ------------------------------------------------------------------ browser
const errors = [];
const warns = [];
const fail = (m) => { errors.push(m); console.log('    ✗ ' + m); };
const check = (cond, m) => { if (cond) console.log('    ✓ ' + m); else fail(m); };
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox', '--lang=pl-PL'] });
const page = await browser.newPage();
await page.setViewport({ width: 1400, height: 1000 });
page.on('pageerror', (e) => errors.push('wyjątek JS: ' + e.message));
page.on('console', (m) => {
  const t = m.text();
  if (m.type() === 'error' && !/Failed to load resource/.test(t)) errors.push('console.error: ' + t);
  if (m.type() === 'warn' || m.type() === 'warning') warns.push(t);
});
await page.setRequestInterception(true);
page.on('request', (req) => {
  const url = req.url();
  if (!url.startsWith('https://steamcommunity.com')) return req.respond({ status: 200, body: '' }); // item images etc.
  const u = new URL(url);
  if (u.pathname === '/favicon.ico') return req.respond({ status: 200, body: '' });
  if (u.pathname === '/__flipster.js') return req.respond({ status: 200, contentType: 'text/javascript; charset=utf-8', body: bundle });
  if (req.resourceType() === 'document') return req.respond({ status: 200, contentType: 'text/html; charset=utf-8', body: page0(u.pathname) });
  if (req.method() === 'POST') posts.push(u.pathname + ' ' + (req.postData() || '').replace(/sessionid=abc123&?/, ''));
  const r = respond(url, req.method(), req.postData());
  if (r == null) { misses.push(req.method() + ' ' + url); return req.respond({ status: 404, body: '' }); }
  if (r.status) return req.respond({ status: r.status, body: '' });
  req.respond({ status: 200, contentType: 'application/json; charset=utf-8', body: JSON.stringify(r) });
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const step = (s) => console.log('\n▶ ' + s);
const T = '#stt .tab.on';
const text = (sel) => page.$eval(sel, (e) => e.innerText).catch(() => '');
const logText = () => text('#stt .log');
const waitLog = (re, timeout = 30000) => page.waitForFunction((src) => new RegExp(src).test(document.querySelector('#stt .log').innerText), { timeout }, re.source);
const waitText = (sel, re, timeout = 30000) => page.waitForFunction((sel, src) => new RegExp(src, 'i').test(document.querySelector(sel)?.innerText || ''), { timeout }, sel, re.source);
const clickEl = (sel) => page.evaluate((sel) => { const e = document.querySelector(sel); if (!e) throw new Error('brak elementu ' + sel); e.click(); }, sel);
const navTab = (title) => page.evaluate((t) => { const b = [...document.querySelectorAll('#stt nav button')].find((x) => x.textContent === t); if (!b) throw new Error('brak zakładki ' + t); b.click(); }, title);
const confirmModal = async () => { await page.waitForSelector('#stt .modal [data-r="1"]', { timeout: 15000 }); const t = await text('#stt .modal'); await clickEl('#stt .modal [data-r="1"]'); return t.replace(/\n+/g, ' | '); };
const setInput = (sel, value, ev = 'change') => page.evaluate((sel, value, ev) => { const i = document.querySelector(sel); if (!i) throw new Error('brak pola ' + sel); i.value = value; i.dispatchEvent(new Event(ev, { bubbles: true })); }, sel, value, ev);
const gm = (key) => page.evaluate((k) => JSON.parse(localStorage.getItem('gm_' + k) || 'null'), key);
const lastPost = (re) => [...posts].reverse().find((p) => re.test(p));
const zl = (c) => (c / 100).toFixed(2).replace('.', ',') + ' zł';
const ymd = (t) => { const d = new Date(t); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; };
const checkTips = async (where) => {
  const n = await page.evaluate((T) => document.querySelectorAll(`${T} .card .stt-i`).length, T);
  if (!n) return console.log(`    (${where}: brak kart z ⓘ)`);
  await page.hover(`${T} .card .stt-i`);
  const tip = await page.$eval('#stt-tip', (t) => (t.hidden ? '' : t.textContent));
  check(!!tip, `${where}: dymek ⓘ pokazuje opis (${n} ikon)`);
  await page.mouse.move(5, 5);
};
let current = '';
const run = async (name, fn) => {
  current = name;
  step(name);
  try { await fn(); } catch (e) {
    fail(`${name}: ${e.message.split('\n')[0]}`);
    console.log('      dziennik: ' + (await logText()).split('\n').slice(-6).join('\n                '));
    if (await page.$('#stt .modal')) await page.evaluate(() => document.querySelectorAll('#stt .modal').forEach((m) => m.remove()));
  }
};

await page.goto('https://steamcommunity.com/market/', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#stt-fab button', { timeout: 15000 });

await run('Panel: otwieranie i zamykanie', async () => {
  const visible = () => page.$eval('#stt-ov', (e) => getComputedStyle(e).display !== 'none');
  check(!(await visible()), 'panel jest schowany po załadowaniu strony');
  await clickEl('#stt-fab button');
  check(await visible(), 'przycisk Flipster otwiera panel');
  await clickEl('#stt [data-x]');
  check(!(await visible()), '✕ zamyka panel');
  await clickEl('#stt-fab button');
  await page.keyboard.press('Escape');
  check(!(await visible()), 'Esc zamyka panel');
  await clickEl('#stt-fab button');
  const tabs = await page.$$eval('#stt nav button', (b) => b.map((x) => x.textContent));
  check(tabs.join('|') === 'Rynek|Ekwipunek|Historia|Okazje|Czy warto otwierać?', 'zakładki: ' + tabs.join(', '));
  check(/build \d/.test(await page.$eval('#stt header h2', (e) => e.textContent)), 'nagłówek ma datę builda (widać ją w trybie debugowania)');
});

await run('Rynek → Moje oferty', async () => {
  await navTab('Rynek');
  await clickEl(`${T} [data-mt="sell"]`);
  const S = `${T} [data-sec="sell"]`;
  await page.waitForFunction((S) => document.querySelectorAll(`${S} tbody tr[data-id]`).length === 2, { timeout: 15000 }, S);
  await waitText('#l-tick', /odświeżono \d\d:\d\d · następne za \d+:\d\d/, 30000); // the countdown after the first check
  console.log('    pasek: ' + (await text('#l-tick')) + ' | ' + (await text('#l-comp')));
  check(/1 oferta przebita/.test(await text('#l-comp')), 'pasek: 1 oferta przebita');
  const tec = await text(`${S} tr[data-id="111"]`);
  check(/ktoś taniej o 0,11 zł/.test(tec), 'Tec-9: „ktoś taniej o 0,11 zł” (2,41 vs 2,30)');
  check(/Ustaw 2,27 zł/.test(tec), 'Tec-9: propozycja 2,27 zł, najbliższa cena pod 2,30, jaką Steam pozwala ustawić (2,29 nie istnieje)');
  check(/float 0\.36/.test(tec), 'Tec-9: float widoczny przy ofercie');
  check(/najtańsza/.test(await text(`${S} tr[data-id="222"]`)), 'Revolution Case: „najtańsza”');
  // ⚙ row + highlighted button (style used to exist only in Historia)
  await clickEl(`${S} tr[data-id="111"] [data-a="cfg"]`);
  await page.waitForSelector(`${S} tr.cfg[data-id="111"]`, { timeout: 5000 });
  const bg = await page.$eval(`${S} tr[data-id="111"] [data-a="cfg"]`, (b) => getComputedStyle(b).backgroundColor);
  check(bg === 'rgb(102, 192, 244)', `⚙ podświetla się, gdy wiersz jest rozwinięty (${bg})`);
  await setInput(`${S} tr.cfg [data-f="min"]`, '2,00');
  check((await gm('sellRules'))?.[TEC]?.min === 200, 'cena minimalna (2,00 zł) zapisana w regułach');
  await clickEl(`${S} tr[data-id="111"] [data-a="cfg"]`);
  // change the price: remove + list again
  await clickEl(`${S} tr[data-id="111"] [data-a="set"]`);
  console.log('    okno: ' + (await confirmModal()));
  await waitLog(/nowa cena 2,27 zł/, 40000);
  const recv = receivedFromBuyer(227);
  check(posts.some((p) => p.startsWith('/market/removelisting/111')), 'wysłano zdjęcie oferty 111');
  const sell = lastPost(/^\/market\/sellitem/);
  check(!!sell && sell.includes('assetid=10000000001') && sell.includes(`price=${recv}`), `wystawiono ten sam przedmiot za ${recv} gr na rękę (kupujący ${zl(buyerFromReceived(recv))})`);
  await page.waitForFunction((S) => /najtańsza/.test([...document.querySelectorAll(`${S} tbody tr[data-id]`)].find((r) => /Tec-9/.test(r.innerText))?.innerText || ''), { timeout: 20000 }, S);
  check(true, 'po zmianie ceny Tec-9 jest „najtańsza”');
  await waitText('#l-comp', /wszystkie Twoje oferty są najtańsze/, 20000);
  check(true, 'pasek: wszystkie oferty najtańsze');
  const after = await page.evaluate((S) => [...document.querySelectorAll(S + ' tbody tr[data-id]')].find((r) => /Tec-9/.test(r.innerText)).innerText, S);
  check(/cena OK/.test(after) && !/Ustaw/.test(after), 'po zmianie nie ma już przycisku „Ustaw”, cena OK (wcześniej wracał w kółko)');
  console.log('    wiersz Tec-9 po zmianie: ' + after.replace(/\s+/g, ' '));
});

await run('Rynek → grupowanie, Shift/Ctrl, wspólna cena', async () => {
  const S = `${T} [data-sec="sell"]`;
  const n = () => page.$$eval(`${S} tbody tr[data-id]:not(.cfg)`, (r) => r.length);
  const selected = () => page.evaluate((S) => [...document.querySelectorAll(`${S} tbody tr[data-id] [data-f="chk"]`)].filter((c) => c.checked).length, S);
  // a click on the row itself (the picture), with the keys held
  const rowClick = (sel, keys = {}, last = false) => page.evaluate((sel, keys, last) => { const td = [...document.querySelectorAll(sel)].at(last ? -1 : 0)?.querySelectorAll('td')[1]; if (!td) throw new Error('brak wiersza ' + sel); td.dispatchEvent(new MouseEvent('click', { bubbles: true, ...keys })); }, sel, keys, last);
  state.listings.push({ id: '333', assetid: '10000000107', hash: 'Revolution Case', price: 60, fee: 9 });
  await clickEl(`${S} [data-a="reload"]`);
  await page.waitForFunction((S) => document.querySelectorAll(`${S} tbody tr[data-id]:not(.cfg)`).length === 3, { timeout: 15000 }, S);
  await clickEl('#l-group');
  await page.waitForSelector(`${S} tbody tr[data-g]`, { timeout: 5000 });
  const g = await text(`${S} tbody tr[data-g]`);
  check(/2 oferty/.test(g) && /0,57 zł - 0,69 zł/.test(g), 'grupa Revolution Case: 2 oferty, ceny 0,57 zł - 0,69 zł');
  check((await n()) === 1, 'zwinięta grupa chowa swoje oferty (zostaje Tec-9)');
  await clickEl(`${S} tbody tr[data-g] input[type=checkbox]`);
  check((await text('#l-bulkn')) === 'Zaznaczono 2:', 'pole wyboru grupy zaznacza obie oferty');
  await clickEl(`${S} tbody tr[data-g] [data-a="gtoggle"]`);
  check((await page.$$eval(`${S} tbody tr.kid`, (r) => r.length)) === 2, 'Rozwiń pokazuje 2 oferty pod grupą');
  await rowClick(`${S} tbody tr.kid`);
  check((await selected()) === 1, 'zwykłe kliknięcie w wiersz zostawia zaznaczony tylko ten wiersz');
  await clickEl('#l-group');
  await rowClick(`${S} tbody tr[data-id]:not(.cfg)`);
  await rowClick(`${S} tbody tr[data-id]:not(.cfg)`, { shiftKey: true }, true); // Tec-9, a new id since its price change
  check((await selected()) === 3, 'Shift zaznacza zakres od pierwszego do ostatniego wiersza');
  await rowClick(`${S} tbody tr[data-id="333"]`, { ctrlKey: true });
  check((await selected()) === 2, 'Ctrl odznacza jeden wiersz z zaznaczenia');
  await setInput('#l-bulkprice', '1,00', 'input');
  check(/dostaniesz 0,88 zł za sztukę/.test(await text('#l-bulkrecv')), `pod ceną: ${await text('#l-bulkrecv')}`);
  const before = posts.length;
  await clickEl(`${S} [data-a="bulkown"]`);
  await page.waitForSelector('#stt .modal [data-r="0"]', { timeout: 5000 });
  const dlg = (await text('#stt .modal')).replace(/\n+/g, ' | ');
  console.log('    okno: ' + dlg);
  check((dlg.match(/→ 1,00 zł/g) || []).length === 2 && /Zmień 2/.test(dlg), 'okno: obie zaznaczone oferty za 1,00 zł');
  await clickEl('#stt .modal [data-r="0"]');
  check(posts.length === before, 'Anuluj niczego nie wysyła');
  state.listings = state.listings.filter((l) => l.id !== '333');
  await clickEl(`${S} [data-a="selnone"]`);
  await clickEl(`${S} [data-a="reload"]`);
  await page.waitForFunction((S) => document.querySelectorAll(`${S} tbody tr[data-id]:not(.cfg)`).length === 2, { timeout: 15000 }, S);
});

await run('Rynek → Zlecenia kupna', async () => {
  await clickEl(`${T} [data-mt="buy"]`);
  const S = `${T} [data-sec="buy"]`;
  await page.waitForFunction((S) => document.querySelectorAll(`${S} tbody tr[data-id]`).length === 1, { timeout: 15000 }, S);
  await waitText(`${S} tbody`, /przebite: ktoś daje 0,25 zł/, 20000);
  check(true, 'zlecenie 0,20 zł oznaczone jako przebite (ktoś daje 0,25 zł)');
  check(/Przebij 0,26 zł/.test(await text(`${S} tbody`)), 'propozycja: Przebij 0,26 zł');
  await clickEl(`${S} [data-a="bid"]`);
  console.log('    okno: ' + (await confirmModal()));
  await page.waitForFunction((S) => /0,26 zł/.test(document.querySelector(`${S} tbody tr[data-id] td:nth-child(3)`)?.innerText || ''), { timeout: 20000 }, S);
  check(posts.some((p) => p.startsWith('/market/cancelbuyorder') && p.includes('buy_orderid=777')), 'stare zlecenie anulowane');
  const cr = lastPost(/^\/market\/createbuyorder/);
  check(!!cr && cr.includes('price_total=130') && cr.includes('quantity=5') && cr.includes('market_hash_name=Revolution+Case'), 'nowe zlecenie: 5 × 0,26 zł = 1,30 zł');
  // new order through the search box
  await clickEl(`${S} [data-a="newform"]`);
  await setInput('#b-q', 'fracture', 'input');
  await page.waitForSelector('#b-sugg [data-pick]', { timeout: 10000 });
  await clickEl('#b-sugg [data-pick]');
  await waitText('#b-peek', /najwyższe zlecenie innych/, 15000);
  check((await page.$eval('#b-price', (i) => i.value)) === '2,01', 'cena podpowiedziana: grosz nad najwyższym zleceniem (2,01)');
  await setInput('#b-qty', '3');
  await clickEl(`${S} [data-a="create"]`);
  console.log('    okno: ' + (await confirmModal()));
  await waitLog(/Złożono zlecenie: Fracture Case 3× 2,01 zł/, 15000);
  const cr2 = lastPost(/^\/market\/createbuyorder/);
  check(cr2.includes('price_total=603') && cr2.includes('quantity=3'), 'zlecenie Fracture Case: 3 × 2,01 zł = 6,03 zł');
  await page.waitForFunction((S) => document.querySelectorAll(`${S} tbody tr[data-id]`).length === 2, { timeout: 15000 }, S);
  check(true, 'lista pokazuje 2 zlecenia');
});

await run('Ekwipunek', async () => {
  // your own pattern list (settings): the SG 553 | Bleached with seed 524 gets the 💎 frame and chip
  await page.evaluate(() => localStorage.setItem('gm_patternsUser', JSON.stringify('SG 553 | Bleached: 524 = test smoke')));
  await navTab('Ekwipunek');
  await page.waitForFunction((T) => document.querySelectorAll(`${T} .gi`).length > 5, { timeout: 30000 }, T);
  await waitLog(/Wyceniono \d+ przedmiotów/, 180000);
  console.log('    ' + (await logText()).split('\n').filter((l) => /Ekwipunek:|Wyceniono/.test(l)).join(' | '));
  const cards = (await text('#i-cards')).replace(/\n/g, ' ');
  console.log('    karty: ' + cards);
  check(/\d,\d\d zł/.test(cards) && !/WARTOŚĆ[^0-9]*0,00 zł/i.test(cards), 'karty pokazują wartość ekwipunku');
  await checkTips('Ekwipunek');
  const withFloat = await page.evaluate((T) => [...document.querySelectorAll(`${T} .gi`)].find((g) => /seed/.test(g.innerText))?.innerText.replace(/\n+/g, ' '), T);
  check(!!withFloat, 'karta z floatem i seedem: ' + (withFloat || '').slice(0, 90));
  const pat = await page.evaluate((T) => { const g = [...document.querySelectorAll(`${T} .gi`)].find((x) => x.title.startsWith('SG 553 | Bleached')); return g ? { cls: g.className, chip: g.querySelector('.pchip')?.innerText || '' } : null; }, T);
  check(!!pat && /pat-user/.test(pat.cls) && /💎 test smoke/.test(pat.chip), `znany wzór z Twojej listy: ramka i znaczek (${pat ? pat.chip : 'brak karty'})`);
  await page.evaluate(() => localStorage.removeItem('gm_patternsUser'));
  check(await page.evaluate((T) => [...document.querySelectorAll(`${T} .gi.listed`)].length >= 2, T), 'przedmioty wystawione na rynku widać jako „na rynku”');
  // "Pokaż: Wszystkie / Sprzedawalne / Z blokadą handlu / Niesprzedawalne" (radio buttons; there used to be a checkbox)
  const mkMode = (v) => page.evaluate((v) => { const r = document.querySelector(`input[name="i-mkmode"][value="${v}"]`); r.checked = true; r.dispatchEvent(new Event('change', { bubbles: true })); }, v);
  await mkMode('all');
  await sleep(300);
  check(await page.evaluate((T) => [...document.querySelectorAll(`${T} .gi`)].some((g) => /niesprzedawalny/.test(g.innerText)), T), 'w „Wszystkie” widać medale/odznaki jako „niesprzedawalny”');
  await mkMode('sell');
  await sleep(300);
  check(!(await page.evaluate((T) => [...document.querySelectorAll(`${T} .gi`)].some((g) => /niesprzedawalny/.test(g.innerText)), T)), 'w „Sprzedawalne” nie ma niesprzedawalnych');
  // search box
  await setInput('#i-q', 'karambit', 'input');
  await page.waitForFunction((T) => document.querySelectorAll(`${T} .gi`).length === 1, { timeout: 5000 }, T);
  check(true, 'szukanie „karambit” zostawia 1 kartę');
  await setInput('#i-q', '', 'input');
  await page.waitForFunction((T) => document.querySelectorAll(`${T} .gi`).length > 5, { timeout: 5000 }, T);
  // quick sell of one skin
  const before = posts.length;
  await page.evaluate((T) => { const g = [...document.querySelectorAll(`${T} .gi`)].find((x) => x.title.startsWith('SG 553 | Bleached')); g.querySelector('[data-q="lowest"]').click(); }, T);
  console.log('    okno: ' + (await confirmModal()));
  await waitLog(/Sprzedaż: 1 wystawiono, 0 błędów/, 20000);
  const qs = posts.slice(before).find((p) => p.startsWith('/market/sellitem'));
  check(!!qs && qs.includes('assetid=10000000008') && qs.includes(`price=${receivedFromBuyer(240)}`), `szybka sprzedaż: 2,40 zł (grosz pod 2,41), na rękę ${receivedFromBuyer(240)} gr`);
  // mass sell: a stack of cases + one skin
  const before2 = posts.length;
  const picked = await page.evaluate((T) => {
    const want = ['Recoil Case', 'P250 | Sand Dune'];
    return want.map((w) => { const g = [...document.querySelectorAll(`${T} .gi`)].find((x) => x.title.startsWith(w) && !x.classList.contains('listed')); g.click(); return g.dataset.k; });
  }, T);
  await sleep(300);
  check(/2/.test(await text('#i-sel')), 'zaznaczono 2 pozycje: ' + (await text('#i-sel')).replace(/\n/g, ' '));
  await clickEl(`${T} [data-a="sell"]`);
  await confirmModal();
  await page.waitForSelector('#stt .modal input[data-j]', { timeout: 20000 });
  await page.evaluate(() => { document.querySelector('#stt .modal input[data-j="0"]').value = '9,99'; });
  console.log('    okno: ' + (await confirmModal()).slice(0, 200));
  await waitLog(/Sprzedaż: 4 wystawiono, 0 błędów/, 30000);
  const ms = posts.slice(before2).filter((p) => p.startsWith('/market/sellitem'));
  check(ms.length === 4 && picked.length === 2, `masowa sprzedaż: 3 skrzynie + 1 skin = ${ms.length} ofert`);
  check(ms.filter((p) => p.includes(`price=${receivedFromBuyer(999)}`)).length === 3, 'ręcznie poprawiona cena 9,99 zł poszła do wszystkich 3 skrzyń');
  check(/czeka na potwierdzenie.*Potwierdź wszystkie/.test(await logText()), 'przypomnienie o „Potwierdź wszystkie” w aplikacji');
});

await run('Historia', async () => {
  await page.evaluate(() => localStorage.setItem('gm_patternsUser', JSON.stringify('AK-47 | Slate: 123 = test historia')));
  await navTab('Historia');
  await waitLog(/Historia: \+6 nowych transakcji/, 60000);
  const trades = await gm('trades');
  for (const x of HIST) {
    const got = trades?.[`${x.lid}_${x.pid}`];
    check(!!got && ymd(got.t) === ymd(x.t), `data ${x.sign === '+' ? 'kupna' : 'sprzedaży'} ${x.hash}: ${ymd(x.t)}${got && ymd(got.t) !== ymd(x.t) ? ` (jest ${ymd(got.t)})` : ''}`);
  }
  const sold = trades[`9003_${HIST[0].pid}`];
  check(sold?.price === 260 && sold.type === 'sell', 'sprzedaż zapisana tak, jak pokazuje ją Steam: 2,60 zł na rękę');
  check((await gm('tradesFmt')) === 6, 'format historii oznaczony jako aktualny');
  await setInput('#h-per', '0');
  await page.waitForFunction(() => document.querySelectorAll('#h-tbl tbody tr').length >= 6, { timeout: 15000 });
  const cards = (await text('#h-cards')).replace(/\n+/g, ' ');
  console.log('    karty: ' + cards.slice(0, 400));
  check(/zł/.test(cards), 'karty z podsumowaniem zysku');
  await checkTips('Historia');
  const rows = await page.$$eval('#h-tbl tbody tr', (r) => r.map((x) => x.innerText.replace(/\s+/g, ' ')));
  check(rows.some((r) => /AK-47 \| Slate/.test(r)) && rows.some((r) => /Recoil Case/.test(r)), `tabela transakcji: ${rows.length} wierszy`);
  const slate = rows.find((r) => /AK-47 \| Slate/.test(r) && /seed/.test(r)) || '';
  check(/seed 123/.test(slate) && /💎 test historia/.test(slate), `dawna sprzedaż z seedem z historii rynku i znakiem 💎 (${slate.slice(0, 140)})`);
  await page.evaluate(() => localStorage.removeItem('gm_patternsUser'));
  // one set of sync buttons (there were three: market, inventory history, store purchases)
  check(await page.evaluate((T) => !document.querySelector(`${T} [data-a="ihsync"], ${T} [data-a="storehist"], ${T} [data-a="sync"]`), T), 'jeden komplet przycisków synchronizacji (bez dubli w podzakładkach)');
  const storeLogs = () => page.evaluate(() => (document.querySelector('#stt .log').innerText.match(/Historia zakupów Steam:/g) || []).length);
  const before = await storeLogs();
  await clickEl(`${T} [data-a="syncall"]`);
  // all three done: the store purchases logged again and the button is active again (greyed out while it runs)
  await page.waitForFunction((n, T) => (document.querySelector('#stt .log').innerText.match(/Historia zakupów Steam:/g) || []).length > n && !document.querySelector(`${T} [data-a="syncall"]`).disabled, { timeout: 30000 }, before, T);
  check(true, '„Synchronizuj” odświeża po kolei rynek, historię ekwipunku i historię zakupów');
  // the game filter at the top also picks which game's inventory history is shown
  await clickEl(`${T} [data-ht="ih"]`);
  await waitText('#ih-list', /Kolega/, 30000);
  await setInput('#h-game', '753');
  await sleep(300);
  check(!/Kolega/.test(await text('#ih-list')), 'filtr gry: historia ekwipunku tylko kart Steam (w teście pusta)');
  await setInput('#h-game', 'all');
  await sleep(300);
  check(/Kolega/.test(await text('#ih-list')), 'filtr gry: „wszystkie gry” pokazuje znów zdarzenia CS2');
  await clickEl(`${T} [data-ht="tx"]`);
  await waitText('#h-tbl', /MP7 \| Army Recon/, 30000);
  check(true, 'zakup widoczny tylko w historii ekwipunku trafił do transakcji (cena szacowana)');
  await setInput('#h-view', 'item');
  await page.waitForFunction(() => document.querySelectorAll('#h-tbl tbody tr').length >= 3, { timeout: 10000 });
  const items = await text('#h-tbl tbody');
  check(/AK-47 \| Slate/.test(items) && /Fracture Case/.test(items), 'widok „suma na przedmiot”');
  await setInput('#h-q', 'slate', 'input');
  await page.waitForFunction(() => document.querySelectorAll('#h-tbl tbody tr').length === 1, { timeout: 5000 });
  check(true, 'filtr „slate” zostawia 1 przedmiot');
  await setInput('#h-q', '', 'input');
  await setInput('#h-view', 'tx');
  await clickEl(`${T} [data-a="chart"]`);
  await page.waitForSelector('#h-chart svg', { timeout: 5000 });
  check(true, 'wykres zysku się rysuje');
  await clickEl(`${T} [data-a="chart"]`);
  // opened cases
  await clickEl(`${T} [data-ht="cs"]`);
  await waitText(`${T} [data-sec="cs"]`, /Revolution Case/, 30000);
  await clickEl(`${T} [data-a="syncall"]`); // one button syncs all three histories (store purchases among them)
  await waitText(`${T} [data-sec="cs"]`, /10,35 zł/, 30000);
  const cs = (await text(`${T} [data-sec="cs"]`)).replace(/\n+/g, ' ');
  console.log('    skrzynie: ' + cs.slice(0, 300));
  check(/P250 \| Re\.built/.test(cs), 'otwarta skrzynia: co wypadło');
  check(/10,35 zł/.test(cs), 'cena klucza wzięta z historii zakupów Steam (10,35 zł)');
  // inventory history
  await clickEl(`${T} [data-ht="ih"]`);
  await waitText('#ih-list', /Kolega/, 30000);
  check(/Snakebite Case/.test(await text('#ih-list')), 'historia ekwipunku: wymiana z „Kolega” (Recoil Case za Snakebite Case)');
  await setInput('#ih-kind', 'skrzynia');
  await sleep(300);
  check(!/Kolega/.test(await text('#ih-list')) && /Revolution Case/.test(await text('#ih-list')), 'filtr „skrzynie” w historii ekwipunku');
  await setInput('#ih-kind', '');
  // a full sync that fails half-way must not wipe the saved trades
  await clickEl(`${T} [data-ht="tx"]`);
  state.failHistory = true;
  await page.waitForFunction((T) => !document.querySelector(`${T} [data-a="fullall"]`).disabled, { timeout: 30000 }, T); // no sync running
  await clickEl(`${T} [data-a="fullall"]`);
  console.log('    okno: ' + (await confirmModal()));
  await waitLog(/Historia: HTTP 500/, 30000);
  state.failHistory = false;
  check(Object.keys(await gm('trades')).length === 6, 'nieudana pełna synchronizacja nie kasuje zapisanych transakcji');
  // the rest of that full run (inventory histories, store purchases) first: the buttons are greyed out until then
  await page.waitForFunction((T) => !document.querySelector(`${T} [data-a="fullall"]`).disabled, { timeout: 30000 }, T);
  check(true, 'przyciski synchronizacji są wyszarzone, dopóki trwa poprzednia');
  // Steam under load: a successful answer with nothing in it must not wipe them either
  state.emptyHistory = true;
  await clickEl(`${T} [data-a="fullall"]`);
  await confirmModal();
  await waitLog(/Steam nie zwrócił całej historii/, 30000);
  state.emptyHistory = false;
  check(Object.keys(await gm('trades')).length === 6, 'pusta odpowiedź Steama przy pełnej synchronizacji nie kasuje transakcji');
  await page.waitForFunction((T) => !document.querySelector(`${T} [data-a="fullall"]`).disabled, { timeout: 30000 }, T);
  await clickEl(`${T} [data-a="fullall"]`);
  console.log('    okno: ' + (await confirmModal()));
  await page.waitForFunction(() => (document.querySelector('#stt .log').innerText.match(/Historia: \+\d+ nowych transakcji \(razem 6\)/g) || []).length >= 2, { timeout: 30000 });
  check(Object.keys(await gm('trades')).length === 6, 'ponowna pełna synchronizacja: nadal 6 transakcji, bez duplikatów');
});

await run('Okazje', async () => {
  await navTab('Okazje');
  await clickEl(`${T} [data-v="analyze"]`);
  await setInput('#f-q', 'Revolution Case');
  await clickEl(`${T} [data-a="analyze"]`);
  await page.waitForFunction(() => document.querySelectorAll('#f-out .card').length >= 3, { timeout: 40000 });
  const out = (await text('#f-out')).replace(/\n+/g, ' ');
  console.log('    analiza: ' + out.slice(0, 500));
  check(!(await page.$('#f-out .err')) || !/błąd/i.test(out), 'analiza przedmiotu bez błędu');
  const plan1 = (await text('#f-plan')).replace(/\s+/g, ' ');
  console.log('    plan zakupu: ' + plan1.slice(0, 330));
  check(/Do jakiej ceny kupować/.test(plan1) && /Opłaca się kupować do 0,\d\d zł/.test(plan1) && /Od ręki 1 szt\.: ustaw zlecenie na 0,57 zł/.test(plan1), 'sekcja „Do jakiej ceny kupować”: próg i zakup 1 szt. od ręki (0,57 zł)');
  const reqs = Object.values(histHits).reduce((s, x) => s + x, 0);
  await setInput('#f-n', '3', 'input');
  const plan3 = (await text('#f-plan')).replace(/\s+/g, ' ');
  check(/Od ręki 3 szt\.: ustaw zlecenie na 0,60 zł, zapłacisz razem 1,77 zł/.test(plan3), '3 szt. od ręki: jedna za 0,57 i dwie za 0,60 → zlecenie na 0,60 zł, razem 1,77 zł');
  check(Object.values(histHits).reduce((s, x) => s + x, 0) === reqs, 'zmiana liczby sztuk nie odpytuje Steama ponownie');
  await checkTips('Okazje');
  // watchlist
  await clickEl(`${T} [data-v="watch"]`);
  await setInput('#w-add', 'Fracture Case');
  await clickEl(`${T} [data-a="wadd"]`);
  await waitText('#w-table', /Obserwujesz 1\b.*Fracture Case/, 5000);
  check(true, 'dodany przedmiot widać od razu na liście obserwowanych');
  await clickEl(`${T} [data-a="wscan"]`);
  await page.waitForFunction((T) => document.querySelector(`${T} [data-a="stop"]`).hidden && /zł/.test(document.querySelector('#w-table')?.innerText || ''), { timeout: 40000 }, T);
  console.log('    obserwowane: ' + (await text('#w-table tbody')).replace(/\s+/g, ' ').slice(0, 250));
  check(true, 'obserwowane: Fracture Case policzona');
  // scanner
  await clickEl(`${T} [data-v="scan"]`);
  check((await page.$eval('#s-max', (i) => i.value)) === '31,07', 'cena „do” domyślnie = saldo portfela (31,07 zł)');
  await setInput('#s-min', '0,10'); await setInput('#s-n', '2'); await setInput('#s-list', '1');
  await clickEl(`${T} [data-a="scan"]`);
  await waitLog(/Skaner zakończony/, 60000);
  const sc = (await text('#s-table tbody')).replace(/\s+/g, ' ');
  console.log('    skaner: ' + sc.slice(0, 300));
  check(/Revolution Case/.test(sc) && /Fracture Case/.test(sc), 'skaner: 2 skrzynie w wynikach');
  check(!/Capsule/.test(sc), 'skaner: kategoria „Skrzynie” pomija kapsuły z naklejkami');
  check(/Fracture Case.*kandydat/.test(sc) && /Revolution Case.*za tani/.test(sc), 'ocena: skrzynia 4,5-letnia za 2,41 zł = kandydat, skrzynia za 0,57 zł = za tani');
  const scansDone = () => page.evaluate(() => (document.querySelector('#stt .log').innerText.match(/Skaner zakończony/g) || []).length);
  const scanAgain = async () => {
    const n = await scansDone();
    await clickEl(`${T} [data-a="scan"]`);
    await page.waitForFunction((n) => (document.querySelector('#stt .log').innerText.match(/Skaner zakończony/g) || []).length > n, { timeout: 60000 }, n);
  };
  // (only the scanned cases: the inventory loads histories of its own items in the background)
  const caseHist = () => `${histHits['Revolution Case']}|${histHits['Fracture Case']}`;
  const histBefore = caseHist();
  await scanAgain();
  check(caseHist() === histBefore, 'drugi skan w ciągu 30 min nie pobiera historii cen od nowa');
  state.newSearch = true;
  await scanAgain();
  const quickScan = (await text('#s-table tbody')).replace(/\s+/g, ' ');
  check(state.newSearchHits === 1, 'lista skrzynek idzie jednym zapytaniem nowej wyszukiwarki');
  check(/Fracture Case/.test(quickScan) && !/Revolution Case/.test(quickScan) && !/Capsule/.test(quickScan), 'nowa lista: ceny w złotówkach trafiają w filtr „do”, kapsuły odpadają');
  state.newSearch = false;
  await setInput('#s-goal', 'flip');
  await sleep(300);
  check(/Ustaw filtry i kliknij/.test(await text('#s-table tbody')), 'po przełączeniu na „szybki flip” lista jest pusta (żadna z tych skrzyń się nie opłaca), z podpowiedzią');
  await setInput('#s-goal', 'hold');
});

await run('Okazje → szybki flip, szukanie do skutku', async () => {
  await clickEl(`${T} [data-v="scan"]`);
  await setInput('#s-goal', 'flip');
  check(await page.evaluate(() => document.querySelector('#s-n').closest('label').hidden && !document.querySelector('#s-find').closest('label').hidden), 'w trybie flip jest pole „Ile znaleźć” zamiast „Ile przedmiotów sprawdzić”');
  check(await page.$eval('#s-only', (c) => c.checked), '„tylko opłacalne” domyślnie zaznaczone');
  await setInput('#s-q', 'test case');
  await setInput('#s-find', '1');
  await clickEl(`${T} [data-a="scan"]`);
  // order books and price histories run side by side, so the item right after the hit may already be under way
  await waitLog(/Skaner zakończony: sprawdzono [34], znaleziono 1 z 1/, 60000);
  check(!bookHits['Dull D Test Case'] && !bookHits['Dull E Test Case'], 'po znalezieniu 1 przedmiotu skaner nie idzie dalej po liście');
  check((await gm('flipSeen'))?.['Dull A Test Case']?.k === 'q', 'odrzucony przedmiot jest zapamiętany (nie będzie pobierany przy następnym skanie)');
  check(bookHits['Dull A Test Case'] === 1 && !histHits['Dull A Test Case'] && histHits['Flip Test Case'] === 1, 'przedmiot bez szans (ciasna księga zleceń) odpada po 1 zapytaniu, historia cen nie jest pobierana');
  const note = (await text('#s-table .note')).replace(/\s+/g, ' ');
  console.log('    nagłówek: ' + note.slice(0, 160));
  check(/Znaleziono 1 z 1 · sprawdzono [34] \(pozycja 4 z 6 na liście Steama dla tej kategorii\) · 1 ryzykownych \(ukryte/.test(note), 'nagłówek: znaleziono 1 z 1, sprawdzono 3, 1 ryzykowny ukryty');
  let rows = await page.$$eval('#s-table tbody tr', (r) => r.map((x) => x.innerText.replace(/\s+/g, ' ')));
  check(rows.length === 1 && /Flip Test Case/.test(rows[0]), 'na liście tylko opłacalny: ' + rows.map((r) => r.slice(0, 90)).join(' || '));
  await page.evaluate(() => document.querySelector('#s-only').click());
  await sleep(300);
  rows = await page.$$eval('#s-table tbody tr', (r) => r.map((x) => x.innerText.replace(/\s+/g, ' ')));
  check(rows.length === 2 && rows.some((r) => /Risky Test Case/.test(r)), 'po odznaczeniu „tylko opłacalne” widać też ryzykowny (2 wiersze)');
  await page.evaluate(() => document.querySelector('#s-only').click());
  // asking for more than exist: walks the whole list, reuses what was already checked, then says so
  const before = { ...bookHits };
  await setInput('#s-find', '3');
  await clickEl(`${T} [data-a="scan"]`);
  await waitLog(/Steam zwrócił pustą stronę na pozycji 4 z 6, ponawiam za 5 s/, 60000);
  check(true, 'pusta strona w środku listy nie kończy skanu, skaner czeka i pyta ponownie');
  await waitLog(/Skaner: koniec listy, sprawdzono 6, znaleziono 1 z 3\. Lista Steama dla tej kategorii: pozycja 6 z 6\./, 60000);
  check(bookHits['Dull C Test Case'] === 1 && bookHits['Flip Test Case'] === before['Flip Test Case'], 'drugi skan: sprawdza tylko nowy przedmiot, wcześniejszych nie pobiera drugi raz');
  check(/koniec listy/.test(await text('#s-table .note')), 'nagłówek mówi, że lista się skończyła');
  check(await page.$eval(`${T} [data-a="stop"]`, (b) => b.hidden), 'przycisk Stop znika po zakończeniu');
  // empty "Ile znaleźć" = no target: runs to the end of the list (or Stop) and keeps every hit
  await setInput('#s-find', '');
  await clickEl(`${T} [data-a="scan"]`);
  await waitLog(/bez limitu/, 10000);
  await waitLog(/Skaner: koniec listy, sprawdzono 6, znaleziono 1\./, 60000);
  check(/Znaleziono 1 · sprawdzono 6 \(pozycja 6 z 6 na liście Steama dla tej kategorii\)/.test((await text('#s-table .note')).replace(/\s+/g, ' ')), 'puste „Ile znaleźć” = bez limitu: nagłówek bez „z N”, skan do końca listy');
  check((await gm('flipFind')) === '', 'ustawienie „bez limitu” jest zapamiętane');
  await setInput('#s-find', '5');
  await setInput('#s-q', '');
  await setInput('#s-goal', 'hold');
});

await run('Czy warto otwierać?', async () => {
  await navTab('Czy warto otwierać?');
  await clickEl(`${T} [data-a="scan"]`);
  await waitLog(/Skrzynie: gotowe\./, 90000);
  const log = await logText();
  check(/klucz 10,35 zł, jak Twój ostatni klucz/.test(log), 'koszt klucza wzięty z Twojego ostatniego zakupu (10,35 zł)');
  check(!/Skrzynie: (Revolution|Fracture) Case,/.test(log), 'obie skrzynie policzone bez ostrzeżeń');
  const rows = await page.$$eval('#k-tbl tbody tr[data-hash]', (r) => r.map((x) => x.innerText.replace(/\s+/g, ' ')));
  rows.forEach((r) => console.log('    ' + r.slice(0, 200)));
  check(rows.length === 2 && rows.every((r) => /%/.test(r)), 'tabela: 2 skrzynie ze zwrotem w %');
  const ev = (await gm('caseEV2'))?.['Revolution Case'];
  check(!!ev && ev.exact && Math.abs(ev.covered - 1) < 1e-9, 'Revolution Case: zawartość z plików gry, wszystkie rzadkości wycenione');
  check(!!ev && ev.cost === ev.casePrice + 1035 && ev.best?.hash.startsWith('★ Sport Gloves'), `koszt = skrzynia + klucz (${ev && zl(ev.cost)}), najlepszy drop: rękawice`);
  check(bookHits['★ Flip Knife'] === 1 && bookHits['★ StatTrak™ Flip Knife'] === 1, 'nóż bez wzoru: cena z arkusza zleceń, po jednym zapytaniu');
  const doneLogs = () => page.evaluate(() => (document.querySelector('#stt .log').innerText.match(/Skrzynie: gotowe\./g) || []).length);
  const setHits = state.setHits, doneBefore = await doneLogs();
  await clickEl(`${T} [data-a="scan"]`);
  await page.waitForFunction((n) => (document.querySelector('#stt .log').innerText.match(/Skrzynie: gotowe\./g) || []).length > n, { timeout: 30000 }, doneBefore);
  check(state.setHits === setHits && bookHits['★ Flip Knife'] === 1, 'ponowne „Przelicz” w ciągu 6 h nie pyta Steama o te same ceny');
  check((await page.$$eval('#k-tbl tbody tr[data-hash]', (r) => r.length)) === 2, 'po ponownym „Przelicz” obie skrzynie zostają w tabeli');
  await clickEl('#k-tbl tbody tr[data-hash="Revolution Case"] td:nth-child(2)');
  await waitText('#k-tbl', /Mil-Spec/, 5000);
  check(/nóż \/ rękawice/.test(await text('#k-tbl')), 'rozwinięcie skrzyni pokazuje rzadkości i skiny');
  await checkTips('Skrzynie');
});

await run('Ustawienia', async () => {
  await clickEl('#stt header .b.ico');
  await page.waitForFunction((T) => document.querySelectorAll(`${T} input`).length > 3, { timeout: 5000 }, T);
  check(/Ustawienia|Kopia|domyśl/i.test(await text(T)), 'zakładka ustawień się otwiera');
  await clickEl(`${T} [data-a="resetlanes"]`);
  await waitLog(/Zresetowano tempo zapytań/, 5000);
  check(true, 'reset tempa zapytań działa');
  // SMOKE_SHOTS=<dir>: pictures of the settings tab (top and bottom, "Zaawansowane" open) to look at the layout
  if (process.env.SMOKE_SHOTS) {
    await page.$eval(`${T} details`, (d) => { d.open = true; });
    for (const [name, top] of [['ustawienia-1', 0], ['ustawienia-2', 1e6]]) {
      await page.$eval('#stt .body', (b, y) => { b.scrollTop = y; }, top);
      await sleep(200);
      await (await page.$('#stt')).screenshot({ path: `${process.env.SMOKE_SHOTS}/${name}.png` });
    }
    await page.$eval(`${T} details`, (d) => { d.open = false; });
    const fab = await page.$("#stt-fab");
    if (fab) await fab.screenshot({ path: `${process.env.SMOKE_SHOTS}/fab.png` }).catch(() => {});
  }
  // debug mode: diagnostic tools hidden by default, shown after ticking the box
  const shown = (sel) => page.$eval(sel, (e) => getComputedStyle(e).display !== 'none').catch(() => null);
  check(await shown(`${T} .set-sec.dbg`) === false && await shown('#stt header h2 .dbg') === false, 'bez trybu debugowania licznik zapytań i numer wersji są ukryte');
  await clickEl(`${T} input[data-k="debug"]`);
  await page.waitForFunction(() => document.querySelector('#stt').classList.contains('dbg-on'), { timeout: 5000 });
  check(await shown(`${T} .set-sec.dbg`) === true && await shown('#stt header h2 .dbg') === true, 'tryb debugowania je pokazuje');
  await clickEl(`${T} input[data-k="debug"]`);
  // the log can be switched off and back on
  await clickEl(`${T} input[data-k="showLog"]`);
  await page.waitForFunction(() => getComputedStyle(document.querySelector('#stt .log')).display === 'none', { timeout: 5000 });
  check(true, 'dziennik da się wyłączyć');
  await clickEl(`${T} input[data-k="showLog"]`);
  await page.waitForFunction(() => getComputedStyle(document.querySelector('#stt .log')).display !== 'none', { timeout: 5000 });
  check(true, 'i z powrotem włączyć');
});

await run('Okno wymiany', async () => {
  await page.goto('https://steamcommunity.com/tradeoffer/new/?partner=1', { waitUntil: 'domcontentloaded' });
  await waitText('#stt-trade', /DAJESZ \(1\)/, 30000);
  await waitText('#stt-trade', /Bilans \(Steam\)/, 10000);
  await page.waitForFunction(() => !/pobieram ceny/.test(document.querySelector('#stt-trade').innerText), { timeout: 30000 });
  const t = (await text('#stt-trade')).replace(/\n+/g, ' | ');
  console.log('    ' + t.slice(0, 400));
  check(/Tec-9/.test(t) && /Karambit/.test(t) && /DOSTAJESZ \(1\)/.test(t), 'analiza wymiany: obie strony rozpoznane i wycenione');
});

await run('Strona ekwipunku Steam (znaczki)', async () => {
  await page.goto(`https://steamcommunity.com/profiles/${ME}/inventory/`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#stt-fab button', { timeout: 15000 });
  await sleep(4000);
  check(true, 'skrypt startuje na stronie ekwipunku bez błędów');
});

// ------------------------------------------------------------------ summary
const errLines = await page.evaluate(() => [...document.querySelectorAll('#stt .log .err')].map((x) => x.textContent)).catch(() => []);
const gmMiss = await page.evaluate(() => window.__gmMiss || []).catch(() => []);
await browser.close();
if (misses.length) errors.push('zapytania bez odpowiedzi w teście (404):\n      ' + [...new Set(misses)].join('\n      '));
if (gmMiss.length) errors.push('zapytania zewnętrzne bez odpowiedzi w teście:\n      ' + gmMiss.join('\n      '));
console.log(`\nWysłane zmiany (POST): ${posts.length}`);
posts.forEach((p) => console.log('    ' + p.slice(0, 160)));
const fw = [...new Set(warns.filter((w) => /Flipster/.test(w) && !/Historia: HTTP 500/.test(w)))]; // the 500 is provoked on purpose
if (fw.length) console.log('\nOstrzeżenia skryptu w konsoli:\n    ' + fw.join('\n    '));
if (errLines.length) console.log('\nCzerwone wpisy w dzienniku (ostatnia strona):\n    ' + errLines.join('\n    '));
const real = errors.filter(Boolean);
if (real.length) { console.log(`\nBŁĘDY (${real.length}):\n  - ` + real.join('\n  - ')); process.exit(1); }
console.log('\nOK, wszystkie kroki przeszły, brak błędów JS');
