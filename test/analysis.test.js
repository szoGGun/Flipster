import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { receivedFromBuyer, buyerFromReceived, effectiveBuyer } from '../src/core/fees.js';
import { parsePrice } from '../src/core/util.js';
import * as A from '../src/core/analysis.js';

test('fees match Steam (screenshot values)', () => {
  assert.equal(receivedFromBuyer(17000), 14783);
  assert.equal(receivedFromBuyer(241), 210);
  assert.equal(receivedFromBuyer(3), 1);
  assert.equal(buyerFromReceived(1), 3);
  assert.equal(buyerFromReceived(14783), 17000);
  for (let b = 3; b < 20000; b += 7) {
    const r = receivedFromBuyer(b);
    assert.ok(buyerFromReceived(r) <= b);
    assert.ok(buyerFromReceived(r + 1) > b);
    assert.ok(effectiveBuyer(b) <= b);
  }
});

test('parsePrice', () => {
  assert.equal(parsePrice('124,16 zł'), 12416);
  assert.equal(parsePrice('$1,234.56'), 123456);
  assert.equal(parsePrice('1 234,5 zł'), 123450);
  assert.equal(parsePrice('2,--€'), 200);
  assert.equal(parsePrice('1.234'), 123400);
  assert.ok(isNaN(parsePrice('--')));
});

test('levels & competitorSell skip own listings', () => {
  const g = [[241, 2], [245, 5], [250, 6]];
  assert.deepEqual(A.levels(g), [{ price: 241, qty: 2 }, { price: 245, qty: 3 }, { price: 250, qty: 1 }]);
  assert.equal(A.competitorSell(g, {}), 241);
  assert.equal(A.competitorSell(g, { 241: 1 }), 241); // tie with someone else
  assert.equal(A.competitorSell(g, { 241: 2 }), 245); // we're alone at 241
});

test('relistTarget', () => {
  const r = { min: 230, undercut: 1, raise: true };
  assert.deepEqual(A.relistTarget({ current: 250, competitor: 241, rule: r }).price, 240);
  assert.equal(A.relistTarget({ current: 240, competitor: 241, rule: r }).price, null);
  assert.equal(A.relistTarget({ current: 241, competitor: 200, rule: r }).price, 230); // floor
  assert.equal(A.relistTarget({ current: 200, competitor: 300, rule: r }).price, 299); // raise
  assert.equal(A.relistTarget({ current: 200, competitor: 300, rule: { ...r, raise: false } }).price, null);
  assert.equal(A.relistTarget({ current: 200, competitor: 300, rule: { ...r, max: 260 } }).price, 260);
});

test('buyOrderTarget', () => {
  const g = [[105, 3], [100, 10], [90, 20]];
  assert.equal(A.buyOrderTarget({ current: 100, myQty: 1, buyGraph: g, rule: { max: 120 } }).price, 106);
  assert.equal(A.buyOrderTarget({ current: 100, myQty: 1, buyGraph: g, rule: { max: 105 } }).price, null);
  // we're alone on top at 110
  const g2 = [[110, 1], [100, 5]];
  assert.equal(A.buyOrderTarget({ current: 110, myQty: 1, buyGraph: g2, rule: { max: 200 } }).price, null);
  assert.equal(A.buyOrderTarget({ current: 110, myQty: 1, buyGraph: g2, rule: { max: 200, lower: true } }).price, 101);
  // tie at top
  const g3 = [[110, 3]];
  assert.equal(A.buyOrderTarget({ current: 110, myQty: 1, buyGraph: g3, rule: { max: 200 } }).price, 111);
});


test('fifoPnL', () => {
  const r = A.fifoPnL([
    { t: 1, type: 'buy', hash: 'A', amount: 1, price: 100 },
    { t: 2, type: 'buy', hash: 'A', amount: 1, price: 120 },
    { t: 3, type: 'sell', hash: 'A', amount: 1, price: 130 },
    { t: 4, type: 'sell', hash: 'B', amount: 1, price: 50 },
  ]);
  const a = r.items.find((i) => i.hash === 'A');
  assert.equal(a.realized, 30);
  assert.equal(a.holdQty, 1);
  assert.equal(a.holdCost, 120);
  assert.equal(r.items.find((i) => i.hash === 'B').unmatchedSells, 1);
});

test('historyStats', () => {
  const now = Date.UTC(2026, 10, 14);
  const pts = [
    { t: now - 10 * 86400000, price: 100, vol: 10 },
    { t: now - 3 * 86400000, price: 120, vol: 10 },
    { t: now - 3600000, price: 130, vol: 5 },
  ];
  const s = A.historyStats(pts, now);
  assert.equal(s.vol24, 5);
  assert.equal(s.vol7, 15);
  assert.equal(s.avg7, Math.round((1200 + 650) / 15));
  assert.ok(s.trend7 > 0);
});

test('parseInventory reads float, seed and stickers from real Steam JSON', async () => {
  globalThis.document = { scripts: [], cookie: '' };
  const { parseInventory } = await import('../src/core/steam.js');
  const d = JSON.parse(readFileSync(new URL('./fixtures/inv.json', import.meta.url)));
  const items = parseInventory(d, '76561190000000002');
  const tec = items.find((i) => i.assetid === '10000000001');
  assert.equal(tec.hash, 'Tec-9 | Groundwater (Field-Tested)');
  assert.ok(Math.abs(tec.float - 0.3622) < 1e-3);
  assert.equal(tec.seed, 745);
  assert.equal(tec.wear, 'Field-Tested');
  assert.ok(tec.inspect && !/%propid|%assetid|%owner/.test(tec.inspect), tec.inspect);
  assert.ok(items.some((i) => i.stickers.length > 0), 'some item has stickers');
});

test('new market orderbook response to histogram (real Steam JSON)', async () => {
  globalThis.document ??= { scripts: [], cookie: '' };
  const { parseOrderBook, compactToGraph } = await import('../src/core/steam.js');
  const { competitorSell, competitorBuy } = await import('../src/core/analysis.js');
  assert.deepEqual(compactToGraph([204, 3, 210, 1, 211, 2]), [[204, 3], [210, 4], [211, 6]]);
  const raw = JSON.parse(readFileSync(new URL('./fixtures/orderbook.json', import.meta.url)));
  const h = parseOrderBook(raw.data.data);
  assert.equal(h.highestBuy, 154);
  assert.equal(h.lowestSell, 204);
  assert.equal(h.sellGraph[0][0], 204);
  assert.equal(competitorSell(h.sellGraph, {}), 204);
  assert.equal(competitorSell(h.sellGraph, { 204: 3 }), 210); // all 3 at 204 are ours
  assert.equal(competitorBuy(h.buyGraph, 154, 1), 152);
  assert.ok(h.buyCount > 0 && h.sellCount > 0);
});

test('relistTarget with fee snapping settles on a price that exists', () => {
  // nearest listable price, as steam.achievable does it
  const snap = (p, up) => { const r = receivedFromBuyer(p); const v = buyerFromReceived(r); return up && v < p ? buyerFromReceived(r + 1) : v; };
  const rule = { undercut: 1, raise: true };
  assert.equal(buyerFromReceived(199), 227); // 2,29 can't be listed: 1,99 → 2,27 and 2,00 → 2,30
  assert.equal(buyerFromReceived(200), 230);
  assert.equal(A.relistTarget({ current: 241, competitor: 230, rule, snap }).price, 227);
  assert.equal(A.relistTarget({ current: 227, competitor: 230, rule, snap }).price, null); // no endless relisting
  assert.equal(A.relistTarget({ current: 227, competitor: 230, rule }).price, 229);        // what happened without it
  // a minimum is never undercut: the nearest listable price above it
  assert.equal(A.relistTarget({ current: 241, competitor: 230, rule: { ...rule, min: 229 }, snap }).price, 230);
  assert.equal(A.relistTarget({ current: 230, competitor: 230, rule: { ...rule, min: 229 }, snap }).price, null);
  // nobody else sells: go to the listable price at/below max, then stay
  assert.equal(A.relistTarget({ current: 200, competitor: null, rule: { ...rule, max: 229 }, snap }).price, 227);
  assert.equal(A.relistTarget({ current: 227, competitor: null, rule: { ...rule, max: 229 }, snap }).price, null);
  for (let p = 3; p < 3000; p++) { const v = snap(p, false); assert.ok(v <= p && snap(v, false) === v && snap(p, true) >= p); }
});

test('lockUntil and matchSearch', async () => {
  const { lockUntil, matchSearch } = await import('../src/core/util.js');
  assert.equal(lockUntil('Tradable/Marketable After Nov 19, 2026 (8:00:00) GMT'), Date.UTC(2026, 10, 19, 8));
  assert.equal(lockUntil('Tradable After Jan 2, 2027'), Date.UTC(2027, 0, 2));
  assert.equal(lockUntil('Ochrona handlu (trade protection)'), null);
  // "until" variant of the trade-protection text, 12:00am = midnight
  assert.equal(lockUntil('This item is trade-protected and cannot be consumed, modified, or transferred until 20 Nov @ 12:00am', new Date(2026, 10, 17).getTime()), new Date(2026, 10, 20, 0, 0).getTime());
  // the newer wording: no year, local time with am/pm
  const now = new Date(2026, 10, 17, 22, 0).getTime();
  assert.equal(lockUntil('Tradable/Marketable After 24 Nov @ 9:00pm', now), new Date(2026, 10, 24, 21, 0).getTime());
  assert.equal(lockUntil('Tradable/Marketable After Nov 24 @ 12:30am', now), new Date(2026, 10, 24, 0, 30).getTime());
  assert.equal(lockUntil('Tradable After 2 Jan @ 8:00am', new Date(2026, 11, 28).getTime()), new Date(2027, 0, 2, 8, 0).getTime());
  assert.ok(matchSearch('AK-47 | Blue Laminate (Field-Tested)', 'ak47 blue lam'));
  assert.ok(matchSearch('StatTrak™ M4A1-S | Guardian', 'm4a1s guardian'));
  assert.ok(matchSearch('Skrzynia Złamań', 'zlaman'));
  assert.ok(!matchSearch('AK-47 | Redline', 'awp'));
});

test('flipCeiling never underestimates flipReal (so skipping on it loses no flip)', () => {
  const net = (p) => receivedFromBuyer(p);
  const now = Date.UTC(2026, 10, 15);
  const points = Array.from({ length: 200 }, (_, i) => ({ t: now - (200 - i) * 3600000, price: 230 + (i % 9) * 3, vol: 4 + (i % 5) }));
  const books = [
    { buyGraph: [[200, 3], [190, 10]], sellGraph: [[241, 1], [245, 6], [260, 20]] },           // thin, wide
    { buyGraph: [[239, 500], [238, 1000]], sellGraph: [[241, 500], [242, 1000]] },               // deep, tight
    { buyGraph: [[180, 5], [170, 15]], sellGraph: [[241, 1], [245, 6]] },
    { buyGraph: [[100, 1], [99, 2], [60, 80]], sellGraph: [[300, 1], [301, 2], [400, 90]] },
  ];
  for (const b of books) {
    const fr = A.flipReal({ ...b, points, net }), max = A.flipCeiling({ ...b, net });
    assert.ok(fr && max != null && max >= fr.roi - 1e-9, `ceiling ${max} < roi ${fr?.roi}`);
  }
  assert.ok(A.flipCeiling({ ...books[1], net }) < 0);   // skipped without the price history
  assert.ok(A.flipCeiling({ ...books[2], net }) > 0.1); // worth the second request
  assert.equal(A.flipCeiling({ buyGraph: [], sellGraph: [[241, 1]], net }), null);
});

test('flipReal sells at the lower of today\'s and the week\'s price and counts units traded at the bid', () => {
  const net = (p) => receivedFromBuyer(p);
  const now = Date.UTC(2026, 10, 15);
  const book = { buyGraph: [[180, 5], [170, 15]], sellGraph: [[262, 3], [270, 9]] };
  // six days around 2,00, then a one-day jump to 2,60; five hours of cheap sales (1,80) earlier in the week
  const points = Array.from({ length: 168 }, (_, i) => ({ t: now - (167 - i) * 3600000, price: i >= 144 ? 260 : i % 30 === 7 ? 180 : 200, vol: 2 }));
  const fr = A.flipReal({ ...book, points, net });
  assert.equal(fr.sell24, 260);
  assert.equal(fr.med7, 200);
  assert.equal(fr.sell, 200);                   // not today's spike
  assert.equal(fr.buy, 181);
  assert.equal(fr.week, 10);                    // 5 hours × 2 units at ≤ 1,81
  assert.ok(Math.abs(fr.fill7 - 10 / 336) < 1e-9);
  assert.ok(fr.profit < 0 && net(fr.sell24) > fr.buy); // profitable only at today's price
  // a calm week: both medians agree, nothing changes
  const calm = A.flipReal({ ...book, points: points.map((p) => ({ ...p, price: 240 })), net });
  assert.deepEqual([calm.sell, calm.sell24, calm.med7, calm.week], [240, 240, 240, 0]);
  // a falling price: today's lower median is used
  const fall = A.flipReal({ ...book, points: points.map((p, i) => ({ ...p, price: i >= 144 ? 210 : 250 })), net });
  assert.deepEqual([fall.sell, fall.med7], [210, 250]);
});

test('buy orders go only to prices Steam really has (0.91 PLN shows and fills as 0.90)', () => {
  const PLN = { feePercent: 0.05, feeMin: 4, feeBase: 0, pubDefault: 0.1 };
  const net = (p) => receivedFromBuyer(p, 0.1, PLN);
  assert.equal(A.priceAbove(90, net), 92);       // 0,91 doesn't exist
  assert.equal(A.priceAbove(52, net), 53);
  assert.equal(A.realPrice(91, net), 90);
  assert.equal(A.realPrice(114, net), 112);      // 1,13 and 1,14 don't either
  assert.equal(A.realPrice(112, net), 112);
  // the Budapest capsule's book: 289 at 0,90 → the scanner offers 0,92, not 0,91
  const now = Date.UTC(2026, 10, 17);
  const points = Array.from({ length: 168 }, (_, i) => ({ t: now - (167 - i) * 3600000, price: i % 20 === 3 ? 88 : 112, vol: 10 }));
  const fr = A.flipReal({ buyGraph: [[90, 289], [89, 305]], sellGraph: [[112, 25], [115, 150]], points, net });
  assert.equal(fr.buy, 92);
  // auto-outbid: my order at "0,91" is listed among the 0,90 ones, others there too → move to 0,92
  const g = [[90, 305], [88, 311]];
  assert.equal(A.buyOrderTarget({ current: 91, myQty: 16, buyGraph: g, rule: { max: 100 }, net }).price, 92);
  assert.equal(A.buyOrderTarget({ current: 92, myQty: 16, buyGraph: [[92, 16], [90, 305]], rule: { max: 100 }, net }).price, null);
  assert.equal(A.buyOrderTarget({ current: 90, myQty: 16, buyGraph: g, rule: { max: 91 }, net }).price, null); // 0,92 > max
});

test('listAdvice: highest price that still sells in time, capped by the typical sale, or sell now', () => {
  const PLN = { feePercent: 0.05, feeMin: 4, feeBase: 0, pubDefault: 0.1 };
  const net = (p) => receivedFromBuyer(p, 0.1, PLN);
  const sellGraph = [[185, 3], [187, 6], [190, 10], [200, 30], [260, 40]];
  // 20 sales a day → 12 from listings; 2 days accepted → up to 24 cheaper listings ahead
  const a = A.listAdvice({ sellGraph, highestBuy: 150, perDay: 20, d7: 174, d30: 170, net, maxWaitDays: 2, undercut: 1 });
  assert.equal(a.quick, 184);
  assert.equal(a.price, 199);                    // below the 2,00 level: 10 listings ahead, ~0.9 day
  assert.equal(a.ahead, 10);
  assert.ok(Math.abs(a.wait - 11 / 12) < 1e-9);
  assert.equal(a.sellNow, false);
  // never far above what it really sells for: typical 1,40 → cap 1,75 → only the quick price is left
  assert.equal(A.listAdvice({ sellGraph, perDay: 20, d7: 140, net }).price, 184);
  // falling price: half the wait → 1 day still fits 10 ahead (0.92 d), not more
  assert.equal(A.listAdvice({ sellGraph, perDay: 20, d7: 150, d30: 180, net, maxWaitDays: 2 }).falling, true);
  // no sales data: one cent under the cheapest
  assert.deepEqual([A.listAdvice({ sellGraph, net }).price, A.listAdvice({ sellGraph, net }).wait], [184, null]);
  // the buy order pays (almost) the same → sell now
  const b = A.listAdvice({ sellGraph: [[150, 5]], highestBuy: 149, perDay: 10, net });
  assert.equal(b.sellNow, true);
  // 0,91 doesn't exist: one cent under 0,92 is listed as 0,90
  assert.equal(A.listAdvice({ sellGraph: [[92, 5]], net }).price, 90);
});

test('fillTable + listAdviceFill: list where the item\'s own price really reaches, at least an even chance', () => {
  const PLN = { feePercent: 0.05, feeMin: 4, feeBase: 0, pubDefault: 0.1 };
  const net = (p) => receivedFromBuyer(p, 0.1, PLN);
  const now = Date.UTC(2026, 10, 17);
  // 30 days, every hour: 2,00 zł swinging ±10% once a day
  const points = Array.from({ length: 720 }, (_, i) => ({ t: now - (719 - i) * 3600000, price: Math.round(200 * (1 + 0.1 * Math.sin((2 * Math.PI * i) / 24))), vol: 5 }));
  const t = A.fillTable(points);
  assert.ok(t && Math.abs(t.ref - 200) <= 6);
  const at = (k) => t.P[2][A.FILL_K.indexOf(k)];
  assert.equal(at(1), 1);          // the typical price is reached every day
  assert.equal(at(1.06), 1);       // so is +6% (the daily top is +10%)
  assert.equal(at(1.13), 0);       // never +13%
  assert.equal(A.fillChance(t, 2, Math.round(t.ref * 1.3) + 1), 0);
  const a = A.listAdviceFill({ table: t, sellGraph: [[205, 4], [215, 9]], highestBuy: 180, net, maxWaitDays: 2 });
  assert.equal(a.method, 'fill');
  assert.ok(a.chance >= A.MIN_CHANCE);
  assert.ok(a.price > 205 && a.price <= Math.round(t.ref * 1.1) + 1, `price ${a.price}`); // up to the daily top, not past it
  assert.equal(a.sellNow, false);
  // never a listing under the best buy order: buyers already pay 2,30 → sell to them now
  const hi = A.listAdviceFill({ table: t, sellGraph: [[240, 4]], highestBuy: 230, net, maxWaitDays: 2 });
  assert.equal(hi.price, 230);
  assert.ok(hi.instantBest && hi.sellNow);
  assert.ok(a.price > 180); // (the earlier case: bids at 1,80, the proposal stays above them)
  // too little hourly data → no table (the queue model is used instead)
  assert.equal(A.fillTable(points.slice(-100)), null);
});

test('lone offers in front of a wall are not the competition (minQty)', () => {
  const sells = [[111, 1], [112, 81], [116, 96]];        // 1 × 1,11 then 80 × 1,12
  assert.equal(A.competitorSell(sells), 111);            // as before: every listing counts
  assert.equal(A.competitorSell(sells, {}, 2), 112);     // the lone one is skipped
  assert.equal(A.competitorSell(sells, {}, 2, () => null), 111); // …unless the per-item choice says it doesn't pay
  assert.deepEqual((() => { let got; A.competitorSell([[111, 2], [112, 5], [130, 50]], {}, 2, (lv) => { got = lv; return null; }); return got; })(), [{ price: 111, ahead: 0 }, { price: 112, ahead: 2 }, { price: 130, ahead: 5 }]);
  // queueChoice: a capsule around 1,11 zł, cheap units in front of a wall at 1,12
  const now = Date.now();
  let seed = 11; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const pts = []; for (let h = 30 * 24; h > 0; h--) pts.push({ t: now - h * 3600000, price: Math.round(111 * (0.96 + rnd() * 0.08)), vol: 1 });
  const table = A.fillTable(pts);
  const net = (p) => Math.floor(p / 1.15);
  const qc = (perDay, lv) => A.queueChoice({ table, perDay, levels: lv, net, undercut: 1, maxWaitDays: 2 });
  const lone = [{ price: 111, ahead: 0 }, { price: 112, ahead: 1 }];
  assert.equal(qc(50, lone), 112);    // sells all day long: the one in front goes within minutes, wait for it
  assert.equal(qc(0.2, lone), 111);   // one sale in 5 days: an extra buyer won't come within 2 days, undercut it
  assert.equal(qc(50, [{ price: 111, ahead: 0 }, { price: 130, ahead: 1 }]), 111); // a "wall" far above what it sells for
  assert.equal(qc(50, [{ price: 111, ahead: 0 }, { price: 112, ahead: 3 }]), 112); // three in front: still fine when it sells fast
  assert.equal(qc(1, [{ price: 111, ahead: 0 }, { price: 112, ahead: 3 }]), 111);  // …but not at one sale a day
  assert.equal(qc(50, [{ price: 80, ahead: 0 }, { price: 112, ahead: 25 }]), 112); // 25 dumped well below normal: a fast market eats them, no unit limit
  assert.equal(qc(5, [{ price: 80, ahead: 0 }, { price: 112, ahead: 25 }]), 80);   // 25 at 5 sales a day won't go in 2 days: that's the price now
  assert.equal(A.queueChoice({ table: null, perDay: 50, levels: lone, net }), null); // no history: the cheapest counts
  assert.equal(A.competitorSell(sells, { 112: 80 }, 2), 116); // our own 80 at 1,12 aren't competition either
  assert.equal(A.competitorSell([[300, 1]], {}, 2), 300);     // a thin book: the only listing still counts
  const buys = [[56, 1], [52, 52], [48, 89]];            // 1 × 0,56 then 51 × 0,52
  assert.equal(A.competitorBuy(buys, 53, 27), 56);
  assert.equal(A.competitorBuy(buys, 53, 27, 2), 52);    // a lone order on top isn't worth outbidding
  assert.equal(A.buyOrderTarget({ current: 53, myQty: 27, buyGraph: [[56, 1], [53, 28], [52, 79]], rule: { max: 60 }, minQty: 2 }).price, null); // stays on top of the real ones
});

test('floatRank: share of copies in the same wear with a lower float', () => {
  // full range: FN is 0-0.07 → 0.0035 is in the lowest 5%
  const a = A.floatRank(0.0035);
  assert.equal(a.wear, 'Factory New');
  assert.ok(Math.abs(a.lower - 0.05) < 1e-9);
  // a skin starting at 0.06: its FN is only 0.06-0.07 → 0.061 is in the lowest 10% of those
  const b = A.floatRank(0.061, [0.06, 0.8]);
  assert.ok(Math.abs(b.lower - 0.1) < 1e-9 && b.best === 0.06);
  // Battle-Scarred of a skin capped at 0.70: 0.45-0.70
  assert.ok(Math.abs(A.floatRank(0.575, [0, 0.7]).lower - 0.5) < 1e-9);
  assert.equal(A.floatRank(1.5), null);
  // ❗: 1 in 1000 of the wear is lower (any wear), or higher in Battle-Scarred
  assert.equal(A.floatRank(0.00005).super, 'low');
  assert.equal(A.floatRank(0.9996).super, 'high');
  assert.equal(A.floatRank(0.0035).super, null);
});

test('buyPlan: up to what price it pays to buy several units', () => {
  const net = (p) => receivedFromBuyer(p);
  const now = Date.UTC(2026, 10, 15);
  // 7 days of hourly trades around 2,40; a few cheap ones at 1,90
  const points = Array.from({ length: 168 }, (_, i) => ({ t: now - (168 - i) * 3600000, price: i % 24 === 5 ? 190 : 240, vol: 2 }));
  const book = { buyGraph: [[185, 4], [180, 10]], sellGraph: [[200, 1], [245, 4], [260, 10]] }; // one cheap listing, the rest dearer
  const p = A.buyPlan({ ...book, points, net, sell: 240, from: 186, qty: 3, minRoi: 0.03 });
  assert.equal(p.got, 209);            // selling at 2,40 leaves 2,09
  assert.equal(p.maxZero, 209);
  assert.equal(p.maxRoi, 202);         // 2,09 / 1,03
  assert.equal(p.cheap, 1);            // only the 2,00 listing is worth taking
  // three units right now: the order must reach 2,45; each listing is paid at its own price
  assert.deepEqual([p.now.price, p.now.total], [245, 200 + 245 + 245]);
  assert.ok(p.now.profit < 0);
  const at = (price) => p.ladder.find((x) => x.price === price);
  assert.ok(at(186) && at(202) && at(209));
  assert.equal(at(186).ahead, 0);      // above every bid in the book
  assert.equal(at(186).week, 0);       // nobody sold that low
  assert.equal(at(186).days, null);
  assert.equal(at(202).week, 14);      // the 1,90 trades: 7 hours × 2
  assert.equal(at(202).days, 3 / 2);   // 3 units at 2 a day
  assert.equal(at(209).profit, 0);
  assert.ok(at(202).roi >= 0.03 && p.ladder.every((x, i, a) => !i || x.price > a[i - 1].price));
  assert.equal(A.buyPlan({ ...book, points, net, sell: 240, qty: 50 }).now.short, 40); // only 10 listed
});

test('cache: reuses a value within its lifetime, one fetch for two askers, never keeps an empty answer', async () => {
  const C = await import('../src/core/cache.js'); // no IndexedDB in node → the memory layer alone
  assert.equal(C.ttl(), 5 * 60000);               // default: 5 minutes
  let n = 0;
  const f = async () => ++n;
  assert.equal(await C.cached('k', 60000, f), 1);
  assert.equal(await C.cached('k', 60000, f), 1); // reused
  assert.equal(await C.cached('k', 0, f), 2);     // 0 = always fetch…
  assert.equal(await C.cached('k', 60000, f), 2); // …and the fresh answer replaces the saved one
  let m = 0;
  const slow = () => new Promise((r) => setTimeout(() => r(++m), 5));
  assert.deepEqual([...(await Promise.all([C.cached('s', 60000, slow), C.cached('s', 60000, slow)])), m], [1, 1, 1]);
  let e = 0;
  const empty = async () => ({ results: [], n: ++e }), full = (d) => d.results.length > 0;
  await C.cached('e', 60000, empty, full);
  await C.cached('e', 60000, empty, full);
  assert.equal(e, 2);                             // the empty page Steam returns under load is asked for again
  C.put('t', 9);
  assert.equal(await C.get('t', 1000), 9);
  await new Promise((r) => setTimeout(r, 5));
  assert.equal(await C.get('t', 2), undefined);   // older than this caller accepts
  await C.clear();
  assert.equal(await C.get('k', 60000), undefined);
  const slim = C.slimSearch({ total_count: 7, results: [{ name: 'A', hash_name: 'A', sell_listings: 3, sell_price: 10, sell_price_text: '$0.10', app_icon: 'x', asset_description: { icon_url: 'i', name_color: 'c', type: 't', descriptions: [1, 2, 3] } }] });
  assert.deepEqual(slim, { total_count: 7, results: [{ name: 'A', hash_name: 'A', sell_listings: 3, sell_price: 10, sell_price_text: '$0.10', asset_description: { icon_url: 'i', name_color: 'c', type: 't' } }] });
  assert.equal(C.slimSearch(null), null);
});
