// Pure trading logic (no DOM / network), unit tested in test/analysis.test.js
import { receivedFromBuyer, buyerFromReceived, MIN_BUYER } from './fees.js';
import { L } from './i18n.js';

/** cumulative order graph [[price, cumQty], ...] -> [{price, qty}] per level */
export function levels(graph) {
  const out = [];
  let prev = 0;
  for (const [price, cum] of graph || []) {
    const qty = cum - prev;
    prev = cum;
    if (qty > 0) out.push({ price, qty });
  }
  return out;
}

/**
 * Lowest competitor sell price after removing our own listings.
 * mine: Map/obj price -> count of our listings at that price
 */
/** only a bound for the work: how many cheaper units ever count is decided by queueChoice (they must sell in time) */
export const QUEUE_MAX = 2000;
/**
 * The price to compete with (undercut) among the others' listings (mine taken out).
 *  minQty 1: the cheapest other listing.
 *  minQty > 1, no choose: the first price where others hold minQty units together (a lone listing in front of a wall,
 *    1 × 1,11 zł before 80 × 1,12 zł, is not the competition: the next buyer takes it anyway).
 *  minQty > 1 with choose(levels): the app's per-item decision (queueChoice): listings below the normal price are
 *    left in front when they'll be bought within the wait anyway, however many; null → the cheapest.
 * When the book is thin, the cheapest other listing still counts.
 */
export function competitorSell(sellGraph, mine = {}, minQty = 1, choose = null) {
  const left = { ...mine };
  let cum = 0, first = null;
  const lv = []; // {price, ahead: others' units cheaper than it}
  for (const l of levels(sellGraph)) {
    const own = Math.min(left[l.price] || 0, l.qty);
    left[l.price] = (left[l.price] || 0) - own;
    if (l.qty - own <= 0) continue;
    first ??= l.price;
    if (cum > QUEUE_MAX) break;
    lv.push({ price: l.price, ahead: cum });
    cum += l.qty - own;
    if (!(choose && minQty > 1) && cum >= minQty) return l.price;
  }
  if (choose && minQty > 1 && lv.length) return choose(lv) ?? first;
  return first;
}

/** Highest competitor buy order after removing our own order. */
/**
 * Some buyer prices don't exist on Steam: both fees are whole cents with a minimum, so e.g. 0,91 zł or 1,13 zł can't
 * be paid for any amount the seller gets. An order placed there shows in the book, and fills, as the price below it
 * (an order at 0,91 zł sits among the 0,90 zł ones). net = receivedFromBuyer for the wallet; a price is real when it
 * pays the seller more than one cent less does.
 */
export const realPrice = (p, net) => { while (p > MIN_BUYER && net(p) === net(p - 1)) p--; return p; };
/** the lowest real price above p, what "one cent more than the others" really is */
export const priceAbove = (p, net) => { let q = p + 1; while (q < p + 20 && net(q) === net(q - 1)) q++; return q; };

/** Highest competitor buy order after removing our own; minQty as in competitorSell (lone orders on top are skipped) */
export function competitorBuy(buyGraph, myPrice = null, myQty = 0, minQty = 1) {
  let left = myQty, cum = 0, first = null;
  for (const l of levels(buyGraph)) {
    let q = l.qty;
    if (l.price === myPrice && left > 0) {
      const own = Math.min(left, q);
      q -= own;
      left -= own;
    }
    if (q <= 0) continue;
    first ??= l.price;
    cum += q;
    if (cum >= minQty) return l.price;
  }
  return first;
}

/**
 * Target buyer price for a sell listing.
 * rule: {min?, max?, undercut=1, raise=true}
 * snap(price, up): nearest price that exists once Steam's fees are added (steam.achievable), without it a target
 *   like 2,29 zł is listed as 2,27 zł and then looks "not optimal" again on every check
 * returns {price, reason}  (price null = keep as is)
 */
export function relistTarget({ current, competitor, rule, snap = null }) {
  const undercut = rule.undercut ?? 1;
  if (competitor == null) {
    // nobody else sells, go to max if set, otherwise keep
    const max = rule.max != null && snap ? snap(rule.max, false) : rule.max;
    if (max != null && rule.raise !== false && current < max) return { price: max, reason: L('analysis.noCompetitionMaxPrice') };
    return { price: null, reason: L('analysis.noCompetition') };
  }
  let target = competitor - undercut;
  let reason = L('analysis.lowestCompetitorUndercut');
  if (rule.max != null && target > rule.max) { target = rule.max; reason = L('analysis.cappedAtTheMaxPrice'); }
  if (rule.min != null && target < rule.min) { target = rule.min; reason = L('analysis.raisedToTheMinPrice'); }
  target = Math.max(MIN_BUYER, target);
  if (snap) {
    target = snap(target, false);
    if (rule.min != null && target < rule.min) target = snap(rule.min, true); // never under the minimum
  }
  if (target === current) return { price: null, reason: L('analysis.priceIsOptimal') };
  if (target > current && rule.raise === false) return { price: null, reason: L('analysis.raisingIsOff') };
  return { price: target, reason };
}

/**
 * Target price for our buy order.
 * rule: {max, step=1, lower=false}
 */
export function buyOrderTarget({ current, myQty, buyGraph, rule, net = null, minQty = 1 }) {
  const step = rule.step ?? 1;
  // with net: an order at a price Steam doesn't have shows in the book as the price below, look for it there, and
  // moves only to real prices (0,90 zł → 0,92 zł; "0,91 zł" would still stand among the 0,90 zł orders)
  const shown = net ? realPrice(current, net) : current;
  const up = (p) => (net ? priceAbove(p - 1, net) : p);
  const comp = competitorBuy(buyGraph, shown, myQty, minQty);
  if (comp == null) return { price: null, reason: L('analysis.noCompetition') };
  if (comp >= shown) {
    const t = up(comp + step);
    if (rule.max != null && t > rule.max) return { price: null, reason: L('analysis.outbiddingMax', { t }), outbid: true };
    return { price: t, reason: L('analysis.outbidding') };
  }
  // we're on top alone
  if (rule.lower && up(comp + step) < current) return { price: up(comp + step), reason: L('analysis.loweringTo2ndPlaceStep') };
  return { price: null, reason: L('analysis.youAreTheHighest') };
}


/** Would buying at `price` and selling at `sellPrice` be profitable? */
export function dealCheck({ price, sellPrice, pub = 0.1, wallet }) {
  const net = receivedFromBuyer(sellPrice, pub, wallet);
  return { net, profit: net - price, roi: (net - price) / price, breakEven: buyerFromReceived(price, pub, wallet) };
}

/** price history stats; points [{t, price, vol}] */
export function historyStats(points, now = Date.now()) {
  const win = (days) => points.filter((p) => p.t >= now - days * 86400000);
  const wavg = (ps) => {
    const v = ps.reduce((s, p) => s + p.vol, 0);
    return v ? Math.round(ps.reduce((s, p) => s + p.price * p.vol, 0) / v) : null;
  };
  const d1 = win(1), d7 = win(7), d30 = win(30), d90 = win(90);
  const med = (ps) => {
    // volume-weighted median
    const arr = [...ps].sort((a, b) => a.price - b.price);
    const tot = arr.reduce((s, p) => s + p.vol, 0);
    let acc = 0;
    for (const p of arr) { acc += p.vol; if (acc >= tot / 2) return p.price; }
    return null;
  };
  const avg7 = wavg(d7);
  const avg30 = wavg(d30);
  const avg90 = wavg(d90);
  // trend: last 7d vs previous 7d
  const prev7 = points.filter((p) => p.t >= now - 14 * 86400000 && p.t < now - 7 * 86400000);
  const pAvg = wavg(prev7);
  // long-term momentum: last 30d vs the 30d before that
  const prev30 = points.filter((p) => p.t >= now - 60 * 86400000 && p.t < now - 30 * 86400000);
  const pAvg30 = wavg(prev30);
  return {
    vol24: d1.reduce((s, p) => s + p.vol, 0),
    vol7: d7.reduce((s, p) => s + p.vol, 0),
    avg7,
    avg30,
    med7: med(d7),
    min7: d7.length ? Math.min(...d7.map((p) => p.price)) : null,
    max7: d7.length ? Math.max(...d7.map((p) => p.price)) : null,
    avg90,
    trend7: avg7 && pAvg ? (avg7 - pAvg) / pAvg : null,
    trend30: avg30 && pAvg30 ? (avg30 - pAvg30) / pAvg30 : null,
    vol30: d30.reduce((s, p) => s + p.vol, 0),
    vol90: d90.reduce((s, p) => s + p.vol, 0),
  };
}

/**
 * FIFO profit & loss from market history.
 * trades: [{t, type:'buy'|'sell', hash, amount, price}] price per unit (buy: paid, sell: received)
 */
export function fifoPnL(trades) {
  const lots = new Map(); // hash -> [{qty, cost, t}]
  const items = new Map(); // hash -> stats
  const realized = [];
  const sorted = [...trades].sort((a, b) => a.t - b.t);
  const st = (h) => items.get(h) || items.set(h, { hash: h, bought: 0, sold: 0, spent: 0, received: 0, realized: 0, matched: 0, holdQty: 0, holdCost: 0, unmatchedSells: 0 }).get(h);
  for (const tr of sorted) {
    const s = st(tr.hash);
    const q = tr.amount || 1;
    if (tr.type === 'buy') {
      s.bought += q;
      s.spent += tr.price * q;
      (lots.get(tr.hash) || lots.set(tr.hash, []).get(tr.hash)).push({ qty: q, cost: tr.price, t: tr.t });
    } else {
      s.sold += q;
      s.received += tr.price * q;
      let left = q;
      const ls = lots.get(tr.hash) || [];
      while (left > 0 && ls.length) {
        const lot = ls[0];
        const take = Math.min(lot.qty, left);
        const pnl = (tr.price - lot.cost) * take;
        s.realized += pnl;
        s.matched += take;
        realized.push({ hash: tr.hash, qty: take, buy: lot.cost, sell: tr.price, pnl, held: tr.t - lot.t, t: tr.t });
        lot.qty -= take;
        left -= take;
        if (!lot.qty) ls.shift();
      }
      s.unmatchedSells += left; // sold items not bought on market (drops, cases, trades)
    }
  }
  for (const [h, ls] of lots) {
    const s = st(h);
    s.holdQty = ls.reduce((a, l) => a + l.qty, 0);
    s.holdCost = ls.reduce((a, l) => a + l.qty * l.cost, 0);
  }
  const list = [...items.values()];
  return {
    items: list,
    realized,
    totals: {
      spent: list.reduce((a, s) => a + s.spent, 0),
      received: list.reduce((a, s) => a + s.received, 0),
      realized: list.reduce((a, s) => a + s.realized, 0),
      holdCost: list.reduce((a, s) => a + s.holdCost, 0),
      trades: sorted.length,
      wins: realized.filter((r) => r.pnl > 0).length,
      losses: realized.filter((r) => r.pnl < 0).length,
    },
  };
}

/** currency from a price text: "32,00€" → 3, "$1.20" → 1, "4,96 zł" → 6 … (null if unknown) */
export function curFromText(s = '') {
  if (/zł/.test(s)) return 6;
  if (/€/.test(s)) return 3;
  if (/£/.test(s)) return 2;
  if (/pуб|руб/i.test(s)) return 5;
  if (/R\$/.test(s)) return 7;
  if (/TL|₺/.test(s)) return 17;
  if (/₴/.test(s)) return 18;
  if (/CDN\$/.test(s)) return 20;
  if (/A\$/.test(s)) return 21;
  if (/¥/.test(s)) return 23;
  if (/\$/.test(s)) return 1;
  return null;
}

const MON = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };

/**
 * Parse the HTML market history (myhistory/render without norender, what Steam's own tab shows).
 * Rows are newest first and dates have no year ("13 Nov") → the year is inferred while walking back in time.
 * parse: (html) => Document (DOMParser in the browser)
 */
export function parseMyHistoryHtml(d, parse, now = new Date(), dateOf = null) {
  const doc = parse(d.results_html || '');
  // row id → asset (hovers: CreateItemHoverFromContainer( g_rgAssets, 'history_row_X_Y_name', 730, '2', '123', 0 ))
  const assetOf = {};
  for (const m of String(d.hovers || '').matchAll(/CreateItemHoverFromContainer\(\s*g_rgAssets,\s*'([^']+)_name',\s*(\d+),\s*'(\d+)',\s*'(\d+)'/g)) {
    assetOf[m[1]] = { appid: m[2], contextid: m[3], id: m[4] };
  }
  const out = [];
  let year = now.getFullYear();
  let prevMonth = null;
  for (const row of doc.querySelectorAll('.market_listing_row[id^="history_row_"]')) {
    const sign = row.querySelector('.market_listing_gainorloss')?.textContent.trim();
    if (sign !== '+' && sign !== '-') continue; // listing created / cancelled
    // the two date cells are float:right → DOM order is [acted, listed] (reversed on screen)
    const dates = [...row.querySelectorAll('.market_listing_listed_date')].map((x) => x.textContent.trim()).filter(Boolean);
    const acted = dates[0] || '';
    const dm = acted.match(/(\d{1,2})\s+([A-Za-z]{3})/) || acted.match(/([A-Za-z]{3})\s+(\d{1,2})/);
    const [, listingid, purchaseid] = row.id.match(/^history_row_(\d+)_(\d+)/) || [];
    let t = 0;
    if (dm) {
      const [dd, mon] = /^\d/.test(dm[1]) ? [+dm[1], dm[2]] : [+dm[2], dm[1]];
      const month = MON[mon.toLowerCase()] ?? 0;
      if (prevMonth != null && month > prevMonth) year--; // e.g. Jan → (older) Dec: previous year
      if (prevMonth == null && month > now.getMonth()) year--; // newest row already from last year
      prevMonth = month;
      t = new Date(year, month, dd, 12, 0).getTime();
      // better: exact time / year estimated from ids (dates in this view have no year)
      if (dateOf) t = dateOf({ listingid, purchaseid, month, day: dd, guess: t }) ?? t;
    }
    const priceEl = row.querySelector('.market_listing_price');
    const priceTxt = priceEl?.textContent.replace(/\s+/g, ' ').trim() || '';
    const pending = /pending|oczekuje/i.test(priceTxt);
    const price = parsePriceCents(priceTxt);
    const a = assetOf[row.id] || {};
    const desc = d.assets?.[a.appid]?.[a.contextid]?.[a.id] || {};
    const hash = desc.market_hash_name;
    if (!hash || !(price > 0)) continue;
    const amount = parseInt(desc.amount ?? desc.original_amount, 10) || 1;
    // float and pattern seed, when Steam includes asset properties in the history assets (2 = wear rating, 1 = seed)
    const fl = (desc.asset_properties || []).find((p) => p.propertyid === 2)?.float_value;
    const sd = (desc.asset_properties || []).find((p) => p.propertyid === 1)?.int_value;
    out.push({
      key: row.id.replace('history_row_', ''),
      t, type: sign === '+' ? 'buy' : 'sell', hash, appid: String(a.appid || 730), amount,
      // buys: what you paid; sells: what you received, Steam's history row is already after the fees
      price: Math.round(price / amount), pending,
      cur: curFromText(priceTxt), name: desc.name, icon: desc.icon_url, color: desc.name_color,
      assetid: a.id || null, float: fl != null ? parseFloat(fl) : null, seed: sd != null ? parseInt(sd, 10) : null,
    });
  }
  return out;
}

function parsePriceCents(s) {
  const m = String(s).replace(/\(.*?\)/g, '').match(/[\d][\d\s.,]*/);
  if (!m) return NaN;
  let v = m[0].replace(/\s/g, '');
  const di = Math.max(v.lastIndexOf(','), v.lastIndexOf('.'));
  let int = v, dec = '';
  if (di >= 0 && v.length - di - 1 <= 2) { int = v.slice(0, di); dec = v.slice(di + 1); }
  return parseInt(int.replace(/[.,]/g, '') || '0', 10) * 100 + parseInt((dec + '00').slice(0, 2), 10);
}

/**
 * "Optimal" listing price: the highest price at which you'd still sell within `maxWaitDays`.
 * Steam fills the cheapest listing first, so at price p you wait until every cheaper listing of other sellers is
 * bought: wait ≈ (others listed below p + 1) / sales per day. Candidates are the existing price levels minus the
 * undercut; capped by `cap` (e.g. 1.5 × the 30-day average, against thin order books) and your min/max.
 * Returns { price, waitDays, ahead } or null when there's no data.
 */
export function optimalSellPrice({ sellGraph, mine = {}, perDay, maxWaitDays = 2, undercut = 1, cap = null, rule = {} }) {
  if (!(perDay > 0)) return null;
  const left = { ...mine };
  const others = [];
  for (const l of levels(sellGraph)) {
    const own = Math.min(left[l.price] || 0, l.qty);
    left[l.price] = (left[l.price] || 0) - own;
    if (l.qty - own > 0) others.push({ price: l.price, qty: l.qty - own });
  }
  if (!others.length) return null;
  let best = null;
  let ahead = 0; // other listings strictly cheaper than the candidate
  for (const l of others) {
    const p = l.price - undercut;
    const wait = (ahead + 1) / perDay;
    if (wait > maxWaitDays) break;
    if (p >= MIN_BUYER && (cap == null || p <= cap)) best = { price: p, waitDays: wait, ahead };
    ahead += l.qty;
  }
  if (!best) best = { price: Math.max(MIN_BUYER, others[0].price - undercut), waitDays: 1 / perDay, ahead: 0 };
  // a price set by your max / min has its own queue: everything listed at or under it goes first (it used to keep
  // the wait of the price it replaced: Glock Royal Legion "3,9 dnia" was the wait one cent under the cheapest, shown
  // for the 145,01 minimum with a listing in front of it)
  const at = (p) => { let a = 0; for (const l of others) if (l.price <= p) a += l.qty; return { ahead: a, waitDays: (a + 1) / perDay }; };
  if (rule.max != null && best.price > rule.max) best = { ...best, price: rule.max, ...at(rule.max) };
  if (rule.min != null && best.price < rule.min) best = { ...best, price: rule.min, belowMin: true, ...at(rule.min) };
  return best;
}

/**
 * Share of an item's daily sales that are purchases of listings (the rest are sellers hitting buy orders, which don't
 * move the queue of listings). Measured on 185 exported items with a spread: median 0.84, lower quartile 0.64,
 * 0.6 is the cautious end, so the promised waits are rather too long than too short.
 */
export const LIST_SHARE = 0.6;

/**
 * Listing advice for one item you hold, what to list it at:
 *  price, the highest real price that should still sell within maxWaitDays (Steam sells the cheapest listing first:
 *          wait ≈ (cheaper listings + 1) / listing purchases per day), never above 1.25 × the typical recent sale
 *          (sales/day were measured at that price, not above it); halved wait when the price is falling
 *  quick, one undercut below the cheapest listing (sells first); instant, the best buy order right now
 *  sellNow, listing would bring at most ~2% (min 1 grosz) more than selling to the buy order now: not worth the wait
 *  dumped, the cheapest listing is ≥ 15% under the typical sale: others are dumping, waiting may pay
 * sellGraph: cumulative [[price, qty]]; perDay: all sales per day; d7 / d30: typical sale prices; net: buyer → seller.
 * held: the price at least half of the recent units sold at (sellsignals.recentMedian), a cap too: the queue counts
 * buyers, not what they pay (a test item was proposed at 2,59 zł after 0 of 881 units in 14 days sold that high).
 */
export function listAdvice({ sellGraph, highestBuy = null, perDay = null, d7 = null, d30 = null, held = null, net, maxWaitDays = 2, undercut = 1, mine = {} }) {
  const asks = levels(sellGraph);
  if (!asks.length) return null;
  const quick = realPrice(Math.max(MIN_BUYER, asks[0].price - undercut), net);
  const typical = d7 ?? d30 ?? null;
  const falling = !!(d7 && d30 && d7 < d30 * 0.9);
  const rate = perDay > 0 ? perDay * LIST_SHARE : null;
  let price = quick, wait = rate ? 1 / rate : null, ahead = 0;
  if (rate) {
    const cap = [typical ? Math.round(typical * 1.25) : null, held].filter((x) => x > 0);
    const o = optimalSellPrice({ sellGraph, mine, perDay: rate, maxWaitDays: maxWaitDays * (falling ? 0.5 : 1), undercut, cap: cap.length ? Math.min(...cap) : null });
    if (o && realPrice(o.price, net) > quick) { price = realPrice(o.price, net); wait = o.waitDays; ahead = o.ahead; }
  }
  const instant = highestBuy ? { price: highestBuy, net: net(highestBuy) } : null;
  const gain = instant ? net(price) - instant.net : null;
  return {
    price, net: net(price), wait, ahead, rate, quick, cheapest: asks[0].price, instant, typical, falling,
    sellNow: instant != null && gain <= Math.max(1, Math.round(instant.net * 0.02)),
    dumped: !!(typical && asks[0].price < typical * 0.85),
  };
}

// ---------------------------------------------------------------- float rank
const WEAR_BOUNDS = [['Factory New', 0, 0.07], ['Minimal Wear', 0.07, 0.15], ['Field-Tested', 0.15, 0.38], ['Well-Worn', 0.38, 0.45], ['Battle-Scarred', 0.45, 1]];
/**
 * Where a float stands among all copies of that skin in the same wear. Valve draws the wear first, then the float
 * uniformly inside it (scaled into the skin's own range), so the share of copies with a LOWER float is simply the
 * position inside [max(wear start, skin min), min(wear end, skin max)). lower = that share (0.03 = only 3% of all
 * FN copies are lower, a top-3% float). range: the skin's [min, max] (null → 0-1).
 */
export function floatRank(f, range = null) {
  if (!(f >= 0 && f <= 1)) return null;
  const [min, max] = range || [0, 1];
  const t = WEAR_BOUNDS.find(([, a, b]) => f >= a && f < b) || WEAR_BOUNDS[WEAR_BOUNDS.length - 1];
  const lo = Math.max(t[1], min), hi = Math.min(t[2], max);
  if (!(hi > lo)) return null;
  const lower = Math.max(0, Math.min(1, (f - lo) / (hi - lo)));
  // super: at most 1 in 1000 copies of this wear is lower (the best floats), or higher (the worst, e.g. max-float BS)
  return { wear: t[0], lo, hi, lower, best: lo, super: lower <= 0.001 ? 'low' : lower >= 0.999 ? 'high' : null };
}

// ---------------------------------------------------------------- listing advice v2: the item's own record
// The queue model above assumes the cheaper listings ahead of you just get bought, but new, cheaper ones keep
// arriving (undercutting bots), and part of the sales go to buy orders. On 182 items it promised "sells in hours" at
// prices that the next 2 days reached only ~1 time in 3. Instead: how often did this item's price actually reach
// k × its price at the time within N days, over the last month, hour by hour?
// Fixed 2026-11-20 (M4A4 Desolate Space MW: "96,28 zł, 63% in a day" with the cheapest listing at 78,56 zł):
// - "reached" used to be ANY hour at ≥ the price. A skin that sells one unit an hour shows every buyer who picked a
//   better float or pattern as a spike, and those count for nobody else's listing. Now the price must hold over
//   FILL_RUN units in a row (their volume-weighted median ≥ the price): the cheapest listings really got there.
// - the price "at the time" used to be the 7-day median, which lags: a case at 0,68 zł after a week at 0,76 was told
//   0,78 zł sells in a day 56% of the time. Now the last 24 h (REF_UNITS units at least). On 49 items against the
//   order book at export it was the closest to the cheapest listing: median off 2,2% (7-day median: 6,3%).
// Walk-forward (table from the data before, outcome in the days after, same rule): announced 55% → 56%, 65% → 66%,
// 85% → 88%. The old table judged by this rule: announced 65% → 47%, 84% → 67%.
export const FILL_K = [0.97, 1, 1.02, 1.04, 1.06, 1.08, 1.1, 1.13, 1.16, 1.2, 1.25, 1.3];
export const FILL_N = [1, 2, 4, 7];
export const FILL_RUN = 5;
// ...and at least half a day of the item's own trading. 5 units is a day for an item selling 5-20 a day, but under an
// hour for one selling 136 (USP-S | Silent Shot FN, 2026-11-20: 8,20 zł "57% in a day" with ~47 units listed cheaper).
// On the 800-item market sample (2026-11-20, 676 items with hourly data) the highest price held over the last day,
// against the cheapest listing at the export: 5 units gave 1,000 for 5-20 sales a day but 1,083 for 60-150 and 1,082
// above 150 (the run caught one dear hour, the listings never got there); half a day's units gave 1,000 / 1,000 / 1,020.
export const FILL_RUN_DAY = 0.5;
const REF_UNITS = 5;
/** the waiting time as the fill table knows it: the first of 1, 2, 4, 7 days that is at least maxWaitDays */
export const horizonOf = (maxWaitDays = 2) => FILL_N.find((x) => x >= maxWaitDays) ?? FILL_N[FILL_N.length - 1];
const HOUR_MS = 3600000;

/** the highest price the market held: the volume-weighted median of every run of hours with ≥ run units */
function heldTop(next, run = FILL_RUN) {
  let top = -Infinity;
  for (let i = 0; i < next.length; i++) {
    let u = 0, j = i;
    while (j < next.length && u < run) u += next[j++].vol;
    if (u < run && i > 0) break; // the tail is part of the run before it (a window with fewer units: all of them)
    const m = vwMedian(next.slice(i, j));
    if (m > top) top = m;
  }
  return top;
}

/**
 * points: price history [{t (ms), price, vol}] (Steam gives hours for the last month). For start hours every 3 h:
 * r = the price then (volume-weighted median of the 24 h before, further back up to 7 days until REF_UNITS units);
 * P[N][i] = share of starts where the next N days held (heldTop) ≥ FILL_K[i] × r; D[N] = average median of the N-th
 * day ÷ r (what selling "at the market" then gave). ref (returned) = the same price now, the table is applied
 * relative to it (anchorTable caps it by today's listings). null when there are too few hours.
 */
export function fillTable(points, { minStarts = 24, runDay = FILL_RUN_DAY } = {}) {
  if (!points?.length) return null;
  const end = points[points.length - 1].t;
  const hr = points.filter((p) => p.t > end - 30 * DAY_MS && p.vol > 0);
  if (hr.length < 120) return null; // too thin for hour-by-hour statistics
  // the hours in time order (Steam sends them so; sorted just in case), windows (a, b] by binary search
  const hs = hr.every((p, i) => !i || hr[i - 1].t <= p.t) ? hr : [...hr].sort((a, b) => a.t - b.t);
  // the run that counts as "held": FILL_RUN units, or half a day of this item's trading (last 7 days) when that's more
  const daily = hs.filter((p) => p.t > end - 7 * DAY_MS).reduce((s, p) => s + p.vol, 0) / 7;
  const run = Math.max(FILL_RUN, Math.round(daily * runDay));
  const after = (x) => { let lo = 0, hi = hs.length; while (lo < hi) { const m = (lo + hi) >> 1; if (hs[m].t <= x) lo = m + 1; else hi = m; } return lo; };
  const win = (a, b) => hs.slice(after(a), after(b));
  const priceAt = (t) => {
    const j = after(t);
    let i = j, u = 0;
    while (i > 0 && hs[i - 1].t > t - 7 * DAY_MS && (hs[i - 1].t > t - DAY_MS || u < REF_UNITS)) u += hs[--i].vol;
    return u >= REF_UNITS ? vwMedian(hs.slice(i, j)) : null;
  };
  const ref = priceAt(end);
  if (!ref) return null;
  const P = {}, D = {};
  let n = 0;
  const rOf = new Map(); // start → its price then (the same for every horizon)
  for (const N of FILL_N) {
    const hits = FILL_K.map(() => 0);
    let starts = 0, dsum = 0;
    for (let t = hs[0].t + 7 * DAY_MS; t <= end - N * DAY_MS; t += 3 * HOUR_MS) {
      if (!rOf.has(t)) rOf.set(t, priceAt(t));
      const r = rOf.get(t);
      const next = win(t, t + N * DAY_MS);
      if (!r || !next.length) continue;
      const top = heldTop(next, run) / r;
      FILL_K.forEach((k, i) => { if (top >= k) hits[i]++; });
      const lastDay = next.filter((p) => p.t > t + (N - 1) * DAY_MS);
      dsum += (vwMedian(lastDay.length ? lastDay : next) || r) / r;
      starts++;
    }
    if (starts < minStarts) continue;
    P[N] = hits.map((h) => Math.round((h / starts) * 100) / 100);
    D[N] = Math.round((dsum / starts) * 1000) / 1000;
    if (N === 2) n = starts;
  }
  return Object.keys(P).length ? { ref, P, D, n, run } : null;
}

/**
 * The table's price now, checked against today's listings (others' only): at most the price of the 3rd cheapest
 * unit. A sale spike of the last 24 h isn't the market any more once 3 units are listed under it; one or two lone
 * cheap listings don't drag it down. (Raising it to the cheapest listing when that is higher was not tested on
 * data, so it isn't done.) Without listings the table as it is.
 */
export function anchorTable(table, sellGraph) {
  const lv = levels(sellGraph);
  if (!table || !lv.length) return table;
  let cum = 0, third = lv[lv.length - 1].price;
  for (const l of lv) { cum += l.qty; if (cum >= 3) { third = l.price; break; } }
  const ref = Math.min(third, table.ref);
  return ref === table.ref ? table : { ...table, ref };
}

/** chance (0-1) that price p is reached within the horizon, read off the table (linear between the grid points) */
export function fillChance(table, N, p) {
  const P = table?.P?.[N];
  if (!P) return null;
  const k = p / table.ref;
  if (k <= FILL_K[0]) return P[0];
  if (k > FILL_K[FILL_K.length - 1]) return 0;
  for (let i = 1; i < FILL_K.length; i++) {
    if (k <= FILL_K[i]) { const a = FILL_K[i - 1], b = FILL_K[i]; return P[i - 1] + ((P[i] - P[i - 1]) * (k - a)) / (b - a); }
  }
  return 0;
}

export const MIN_CHANCE = 0.5; // never propose a lottery ticket: at least an even chance to sell within the wait
// the past month flatters a little; × 0.92 brings the announced chance in line with what then happened (fit on
// 182 items 2026-11-17, still right for the 2026-11-20 table: 49 items, announced 55% → 56%, 65% → 66%, 85% → 88%)
const CHANCE_FIT = 0.92;
/**
 * Which price level to undercut, when cheaper listings may be left in front of you. Every level is an option: list
 * one step under it, behind its `ahead` cheaper units, so that many more buyers must come first. Each option by the
 * expected money on hand within the wait, the same fill table as the proposed price: chance = fill chance of the
 * price × the share of "≥ ahead + 1 buyers" in "≥ 1 buyer" within the wait (Poisson, buyers of listings per day);
 * not sold in time → sold later at the market (ref × D[N]). An option behind others also needs at least an even
 * chance (MIN_CHANCE): waiting costs nothing in money terms, so without that bar it would always win.
 * → the chosen level's price, or null (no price history / no sales: the cheapest counts).
 */
// Listings clearly under the sales price (under DUMP_K × it) are "dumped": any number of them may be left in front
// when the market eats them within the wait. Listings AT the market price are the market itself, sellers keep adding
// more there, so waiting behind them only pays for the few that go within MARKET_QUEUE_DAYS of trading (a lone one in
// front of a wall). USP-S | Silent Shot FN, 2026-11-20: 46 units at 7,85-8,17 zł were skipped as "bought within a day
// anyway" (82 buyers of listings a day) while the sales median was 7,68 zł.
export const DUMP_K = 0.95;
export const MARKET_QUEUE_DAYS = 2 / 24;
export function queueChoice({ table, perDay, levels: lv, net, undercut = 1, maxWaitDays = 2, dumpK = DUMP_K }) {
  const N = horizonOf(maxWaitDays);
  if (!table?.P?.[N] || !(perDay > 0) || !lv?.length) return null;
  const x = perDay * N;
  // P(at least m buyers within the wait)
  const atLeast = (m) => { let term = Math.exp(-x), cdf = 0; for (let i = 0; i < m; i++) { cdf += term; term *= x / (i + 1); } return 1 - cdf; };
  const one = atLeast(1);
  const later = net(Math.round(table.ref * table.D[N]));
  let best = null, prev = null, atMarket = 0;
  for (const l of lv) {
    // units in front at the market price: they must go within a couple of hours, the queue there refills
    if (prev && prev.price >= table.ref * dumpK) atMarket += l.ahead - prev.ahead;
    if (atMarket > perDay * MARKET_QUEUE_DAYS) break;
    prev = l;
    const behind = l.ahead ? (one > 0 ? atLeast(l.ahead + 1) / one : 0) : 1;
    if (l.ahead && behind < MIN_CHANCE) break; // this many won't all be bought in time: from here on it's the market
    const p = realPrice(Math.max(MIN_BUYER, l.price - undercut), net);
    const c = Math.min(1, (fillChance(table, N, p) ?? 0) * CHANCE_FIT * behind);
    if (l.ahead && c < MIN_CHANCE) continue;
    const ev = c * net(p) + (1 - c) * later;
    if (!best || ev > best.ev) best = { price: l.price, ev };
  }
  return best ? best.price : null;
}
/** the announced chance for any price you type in (same fit as the advice); sellGraph: today's others' listings */
export const sellChance = (table, N, p, sellGraph = null) => { const c = fillChance(anchorTable(table, sellGraph), N, p); return c == null ? null : c * CHANCE_FIT; };

/**
 * Listing price from the item's own record: among real prices at k × typical (and one cent under the cheapest
 * listing), the one with the best expected result, sold at that price with its chance, otherwise sold at the market
 * at the end of the wait, keeping at least an even chance to sell. Returns the listAdvice() shape + chance/horizon.
 */
export function listAdviceFill({ table: raw, sellGraph, highestBuy = null, net, maxWaitDays = 2, undercut = 1 }) {
  const asks = levels(sellGraph);
  const N = horizonOf(maxWaitDays);
  if (!raw?.P?.[N] || !asks.length) return null;
  const table = anchorTable(raw, sellGraph);
  const ref = table.ref;
  const quick = realPrice(Math.max(MIN_BUYER, asks[0].price - undercut), net);
  const later = net(Math.round(ref * table.D[N])); // not sold in time → sold at the market then
  // a listing at or under the best buy order just sells to it, the candidates start one real price above it
  const floor = highestBuy ? priceAbove(highestBuy, net) : MIN_BUYER;
  const cands = [...new Set([...FILL_K.map((k) => realPrice(Math.round(ref * k), net)), quick])].filter((p) => p >= Math.max(MIN_BUYER, floor));
  const opts = cands.map((p) => { const c = fillChance(table, N, p) * CHANCE_FIT; return { price: p, chance: c, ev: c * net(p) + (1 - c) * later }; }).sort((a, b) => a.price - b.price);
  const ok = opts.filter((o) => o.chance >= MIN_CHANCE);
  const pool = ok.length ? ok : opts;
  const instant = highestBuy ? { price: highestBuy, net: net(highestBuy) } : null;
  let best = pool.length ? pool.reduce((b, o) => (o.ev > b.ev + 0.5 ? o : b), pool[0]) : null; // a higher price must earn ≥ half a cent more
  // selling to the buy order now beats waiting (the market moved above its typical price, or nothing above the bids pays)
  const instantBest = !!instant && (!best || instant.net >= best.ev);
  if (instantBest) best = { price: instant.price, chance: 1, ev: instant.net };
  if (!best) return null;
  const gain = instant ? best.ev - instant.net : null;
  return {
    method: 'fill', horizon: N, price: best.price, net: net(best.price), chance: best.chance, ev: best.ev, lowChance: !instantBest && !ok.length, instantBest,
    options: opts.filter((o) => o.chance >= 0.2), quick, cheapest: asks[0].price, instant, typical: raw.ref, starts: table.n,
    falling: table.D[N] < 0.97, wait: null, rate: null, ahead: 0,
    sellNow: instant != null && (instantBest || gain <= Math.max(1, Math.round(instant.net * 0.02))),
    dumped: asks[0].price < raw.ref * 0.85, // vs the sales: the anchored ref is never far above the cheapest
  };
}

// ---------------------------------------------------------------- evidence-based hold / flip metrics
// Back-tested on 108 items (2026-11-15): the spread flip and dip buying don't beat the 13% fee + 7-day resale lock,
// 30-day momentum predicts nothing; what paid was item type (old cases), holding time and season (buy late Nov, sell
// in spring). These helpers show each item's OWN record instead of a made-up score.
const DAY_MS = 86400000;
const dayIdx = (y, m, d) => Math.floor(Date.UTC(y, m - 1, d) / DAY_MS);
const medianOf = (a) => { if (!a.length) return null; const s = [...a].sort((x, y) => x - y); return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2; };
const vwMedian = (pts) => { if (!pts.length) return null; const s = [...pts].sort((a, b) => a.price - b.price); const tot = s.reduce((q, p) => q + (p.vol || 1), 0); let acc = 0; for (const p of s) { acc += p.vol || 1; if (acc >= tot / 2) return p.price; } return s[s.length - 1].price; };

/** daily bars from price-history points [{t (ms), price (cents), vol}] → [{d (day index), med, v}] */
export function dailyBars(points) {
  const m = new Map();
  for (const p of points) { const d = Math.floor(p.t / DAY_MS); const a = m.get(d); if (a) a.push(p); else m.set(d, [p]); }
  return [...m].sort((a, b) => a[0] - b[0]).map(([d, a]) => ({ d, med: vwMedian(a), v: a.reduce((q, p) => q + (p.vol || 1), 0) }));
}

// ---------------------------------------------------------------- the last half year, as information
// Shown on the inventory cards as a plain fact ("↘ −30% w pół roku"), because it did happen (M4A4 Desolate Space MW:
// 126 → 88 zł). Not a forecast: on the 800-item market sample such moves predicted neither more of the same nor a
// rebound (see the note below).
/** the price of the last 30 days, 3 and 6 months ago (volume-weighted medians of daily prices) → { now, m3, m6, t3, t6 } */
export function recentTrend(points) {
  if (!points?.length) return null;
  const bars = dailyBars(points);
  const last = bars[bars.length - 1].d;
  const at = (d) => { const w = bars.filter((b) => b.d > d - 30 && b.d <= d); return w.length >= 5 ? vwMedian(w.map((b) => ({ price: b.med, vol: b.v }))) : null; };
  const now = at(last), m3 = at(last - 91), m6 = at(last - 182);
  if (!now) return null;
  const ch = (x) => (x ? Math.round((now / x - 1) * 1000) / 1000 : null);
  return { now, m3, m6, t3: ch(m3), t6: ch(m6) };
}

// ---------------------------------------------------------------- tried and dropped: "schodzi po skoku"
// 2026-11-20: a chip for items ≥ 1.5× their 2-year median and lower than 6 months ago looked predictive on 44 items
// (next 3 months −10%, n = 45 of 19 items). On a 800-item market sample (653 with 2+ years, 37 541 monthly points)
// it wasn't: −0.2% (vs the market +2%), skins −2% per item, stickers strong only before 2025 and driven by a few.
// A long or steady decline alone predicted nothing either (> 30% in 6 months: +0.0%). Don't rebuild it on a small sample.

/**
 * What holding this item did in the past, NET of the market fee, from its own price history.
 * feeMult = buyer price / seller's take (1.15). Periods bought under 1,00 are skipped: there prices move in
 * one-cent steps and the minimum fee of the time was different. Returns null when the history is too short.
 *  winters: bought at the average price of 22-29 Nov (item at least a year old), sold 26 weeks later
 *  y1 / y2: every 15 days: bought at the market, sold 1 / 2 years later (first 180 days after release skipped)
 */
export function holdStats(points, feeMult = 1.15) {
  const bars = dailyBars(points || []);
  if (bars.length < 60) return null;
  const byD = new Map(bars.map((b) => [b.d, b]));
  const avg = (a, z) => { let s = 0, v = 0; for (let k = a; k <= z; k++) { const b = byD.get(k); if (b) { s += b.med * b.v; v += b.v; } } return v ? s / v : null; };
  const first = bars[0].d, last = bars[bars.length - 1].d;
  const ret = (buy, sell) => (buy && sell && buy >= 100 ? sell / feeMult / buy - 1 : null);
  const sum = (a) => (a.length ? { n: a.length, wins: a.filter((x) => x > 0).length, win: a.filter((x) => x > 0).length / a.length, med: medianOf(a) } : null);
  const winters = [];
  for (let y = new Date(first * DAY_MS).getUTCFullYear(); y <= new Date(last * DAY_MS).getUTCFullYear(); y++) {
    const s = dayIdx(y, 11, 22), e = dayIdx(y, 11, 29);
    if (first > s - 365) continue;
    const r = ret(avg(s, e), avg(e + 177, e + 187));
    if (r != null) winters.push({ y, r });
  }
  const roll = (n) => { const a = []; for (let t = first + 180; t + n + 5 <= last; t += 15) { const r = ret(avg(t - 3, t - 1), avg(t + n - 5, t + n + 5)); if (r != null) a.push(r); } return a; };
  const cur = avg(last - 6, last);
  const year = last - first >= 180 ? avg(last - 364, last) : null;
  const m30 = avg(last - 36, last - 30);
  const wk = [];
  for (let t = last; t - 7 >= Math.max(first, last - 182); t -= 7) { const a = avg(t - 1, t), b = avg(t - 8, t - 7); if (a && b) wk.push(Math.log(a / b)); }
  const mu = wk.length ? wk.reduce((s, x) => s + x, 0) / wk.length : 0;
  return {
    ageDays: last - first,
    cur,
    vsYear: cur && year ? cur / year - 1 : null,
    trend30: cur && m30 ? cur / m30 - 1 : null,
    sigmaWeek: wk.length >= 8 ? Math.sqrt(wk.reduce((s, x) => s + (x - mu) ** 2, 0) / wk.length) : null,
    winters,
    winter: sum(winters.map((w) => w.r)),
    y1: sum(roll(365)),
    y2: sum(roll(730)),
  };
}

/**
 * Best case of flipReal().roi that the order book alone allows: buy just above the bids `depth` units deep, sell just
 * under the asks `depth` units deep. flipReal looks max(3, 0.2% of the daily volume) units deep, so this is an upper
 * bound for everything selling up to depth / 0.002 = 25 000 a day (busier items have one-cent spreads and never
 * flip). Used to skip the price-history request when even the best case is below the wanted ROI. null = empty book.
 */
export function flipCeiling({ buyGraph, sellGraph, net, depth = 50 }) {
  const bids = levels(buyGraph), asks = levels(sellGraph);
  if (!bids.length || !asks.length) return null;
  const deep = (lv) => { let c = 0; for (const l of lv) { c += l.qty; if (c >= depth) return l.price; } return lv[lv.length - 1].price; };
  const buy = priceAbove(deep(bids), net);
  return (net(Math.max(MIN_BUYER, deep(asks) - 1)) - buy) / buy;
}

/**
 * Up to what price is it worth buying `qty` units to resell at `sell` (buyer price; what trades really go for)?
 *  maxZero, paying this leaves exactly nothing after the fee; maxRoi, the highest price that still leaves minRoi
 *  now    , buying from the listings right away: the order price needed to take `qty` units, what they cost together
 *            (a buy order pays each listing's own price), the result, and how many units are listed at ≤ maxRoi
 *  ladder , buy-order prices from just above today's bids (`from`) up to maxZero: profit per unit, how many units
 *            traded that cheaply in the last 7 days, orders ahead of yours, and the days `qty` units would take
 */
export function buyPlan({ buyGraph, sellGraph, points, net, sell, from, qty = 1, minRoi = 0.03 }) {
  const got = net(sell);
  if (!(got > 0)) return null;
  // no price Steam allows leaves the wanted profit (a card selling at 0,12 zł pays 0,04 zł, the cheapest listing is 0,09 zł)
  const roiTop = Math.floor(got / (1 + minRoi));
  if (roiTop < MIN_BUYER) return null;
  const maxZero = realPrice(got, net), maxRoi = realPrice(roiTop, net);
  const asks = levels(sellGraph), bids = levels(buyGraph);
  let left = qty, total = 0, top = null, listed = 0, cheap = 0;
  for (const l of asks) {
    listed += l.qty;
    if (l.price <= maxRoi) cheap += l.qty;
    if (left > 0) { const n = Math.min(left, l.qty); total += n * l.price; left -= n; top = l.price; }
  }
  const now = left > 0 ? { short: left, listed } : { price: top, total, avg: total / qty, profit: got * qty - total, roi: (got * qty - total) / total, listed };
  const end = points?.length ? points[points.length - 1].t : 0;
  const d7 = (points || []).filter((p) => p.t > end - 7 * DAY_MS);
  const v7 = d7.reduce((s, p) => s + (p.vol || 0), 0);
  const lo = Math.max(MIN_BUYER, Math.min(from ?? maxRoi, maxRoi));
  const marks = new Set([lo, maxRoi, maxZero].map((p) => realPrice(p, net)));
  for (let i = 1; i <= 3; i++) marks.add(realPrice(Math.round(lo + ((maxRoi - lo) * i) / 4), net));
  const ladder = [...marks].filter((p) => p >= MIN_BUYER).sort((a, b) => a - b).map((price) => {
    const week = d7.filter((p) => p.price <= price).reduce((s, p) => s + (p.vol || 0), 0);
    const ahead = bids.filter((l) => l.price >= price).reduce((s, l) => s + l.qty, 0);
    return { price, profit: got - price, roi: (got - price) / price, week, share: v7 ? week / v7 : 0, ahead, days: week > 0 ? (ahead + qty) / (week / 7) : null };
  });
  return { sell, got, maxZero, maxRoi, cheap, now, ladder };
}

/**
 * Honest flip: buy with an order one cent above the bids that really sit in the book (skips stray / in-flight
 * orders at the top), sell at the price trades actually happen at: the lower of the 24 h and the 7-day
 * volume-weighted median (you sell only after the 7-day lock, and scanner hits are mostly items whose price jumped
 * today, 27 real hits sat a median 11% above their weekly price), never above the asks. sell24 = today's median.
 * week = units traded at or below your bid in the last 7 days, fill7 = their share of the week's volume.
 */
export function flipReal({ buyGraph, sellGraph, points, net }) {
  const bids = levels(buyGraph), asks = levels(sellGraph);
  if (!bids.length || !asks.length || !points?.length) return null;
  const end = points[points.length - 1].t;
  const d1 = points.filter((p) => p.t > end - DAY_MS), d7 = points.filter((p) => p.t > end - 7 * DAY_MS);
  const vol24 = d1.reduce((s, p) => s + (p.vol || 0), 0);
  const need = Math.max(3, Math.ceil(vol24 * 0.002));
  const deep = (lv) => { let c = 0; for (const l of lv) { c += l.qty; if (c >= need) return l.price; } return lv[lv.length - 1].price; };
  const bid = deep(bids), ask = deep(asks);
  const sell24 = vwMedian(d1.length ? d1 : d7);
  if (sell24 == null) return null;
  const med7 = vwMedian(d7) ?? sell24;
  const buy = priceAbove(bid, net);
  const sell = Math.max(MIN_BUYER, Math.min(sell24, med7, ask - 1));
  const got = net(sell);
  const v7 = d7.reduce((s, p) => s + (p.vol || 0), 0);
  const week = d7.filter((p) => p.price <= buy).reduce((s, p) => s + (p.vol || 0), 0);
  return { bid, ask, buy, sell, sell24, med7, net: got, profit: got - buy, roi: (got - buy) / buy, week, fill7: v7 ? week / v7 : 0, vol24 };
}
