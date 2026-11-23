import './lang-pl.js'; // first: labels in Polish
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { receivedFromBuyer, buyerFromReceived, effectiveBuyer, MIN_BUYER, syncMinBuyer } from '../src/core/fees.js';
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

test('fifoPnL: a copy opened or traded away is not sold again', () => {
  const trades = [{ t: 1, type: 'buy', hash: 'Case', amount: 1, price: 134, key: 'b1' }, { t: 5, type: 'sell', hash: 'Case', amount: 1, price: 42, key: 's1' }];
  const r = A.fifoPnL(trades, [{ t: 2, op: 'out', hash: 'Case', qty: 1 }, { t: 3, op: 'in', hash: 'Case', qty: 1 }]);
  const a = r.items[0];
  assert.equal(r.realized.length, 0);
  assert.equal(a.unmatchedSells, 1);
  assert.equal(a.gone, 1);
  assert.equal(a.holdQty, 0);
  assert.deepEqual(r.copies.get('b1'), { sold: 0, gone: 1 });
});

test('fifoPnL: the oldest copy goes first, also when it was a drop', () => {
  const trades = [{ t: 2, type: 'buy', hash: 'A', amount: 1, price: 100, key: 'b' }, { t: 3, type: 'sell', hash: 'A', amount: 1, price: 90, key: 's' }];
  const r = A.fifoPnL(trades, [{ t: 1, op: 'in', hash: 'A', qty: 1 }]);
  assert.equal(r.realized.length, 0);
  assert.equal(r.items[0].holdQty, 1);
  assert.equal(r.items[0].holdCost, 100);
  // a sale known only by its day comes after the drop of that day
  const late = A.fifoPnL([{ t: 5, at: 9, type: 'sell', hash: 'B', amount: 1, price: 10 }, { t: 1, type: 'buy', hash: 'B', amount: 1, price: 8 }], [{ t: 7, op: 'out', hash: 'B', qty: 1 }]);
  assert.equal(late.realized.length, 0);
});

test('inventoryMoves: skips the market, changed items and the second copy of a trade', () => {
  const it = (hash) => ({ hash });
  const m = A.inventoryMoves([
    { t: 1, kind: 'rynek', plus: [it('X')], minus: [] },
    { t: 2, kind: 'naklejka', plus: [it('AK')], minus: [it('AK'), it('Sticker')] },
    { t: 600000, kind: 'wymiana', plus: [it('T'), it('T'), it('T')], minus: [] },
    { t: 600000, kind: 'wymiana', plus: [it('T'), it('T'), it('T')], minus: [] },
  ]);
  assert.deepEqual(m, [{ t: 2, op: 'out', hash: 'Sticker', qty: 1 }, { t: 600000, op: 'in', hash: 'T', qty: 3 }]);
});

test('tradeYearFixes: a purchase in the wrong year moves to its real one', () => {
  const noon = (y) => new Date(y, 10, 14, 12).getTime(), real = new Date(2026, 10, 14, 20, 28).getTime(), real2 = new Date(2026, 10, 14, 20, 32).getTime();
  const fix = A.tradeYearFixes([{ key: 'a', hash: 'Horizon', t: noon(2016) }, { key: 'b', hash: 'Horizon', t: noon(2024) }, { key: 'c', hash: 'Other', t: noon(2025) }], [{ hash: 'Horizon', t: real }, { hash: 'Horizon', t: real2 }, { hash: 'Other', t: new Date(2025, 10, 14, 9).getTime() }]);
  assert.equal(fix.get('a'), real);
  assert.equal(fix.get('b'), real2);
  assert.equal(fix.has('c'), false);
});

test('wholeHistory: only a walk through every row may replace the saved trades', () => {
  assert.equal(A.wholeHistory(0, 0), false); // an empty answer
  assert.equal(A.wholeHistory(1789, 700), false); // cut off in the middle
  assert.equal(A.wholeHistory(1789, 1800), true);
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
  const a = A.listAdviceFill({ table: t, sellGraph: [[198, 4], [215, 9]], highestBuy: 180, net, maxWaitDays: 2 });
  assert.equal(a.method, 'fill');
  assert.ok(a.chance >= A.MIN_CHANCE);
  assert.ok(a.price > 198 && a.price <= Math.round(t.ref * 1.1) + 1, `price ${a.price}`); // up to the daily top, not past it
  assert.equal(a.sellNow, false);
  // never a listing under the best buy order: buyers already pay 2,30 → sell to them now
  const hi = A.listAdviceFill({ table: t, sellGraph: [[240, 4]], highestBuy: 230, net, maxWaitDays: 2 });
  assert.equal(hi.price, 230);
  assert.ok(hi.instantBest && hi.sellNow);
  assert.ok(a.price > 180); // (the earlier case: bids at 1,80, the proposal stays above them)
  // too little hourly data → no table (the queue model is used instead)
  assert.equal(A.fillTable(points.slice(-100)), null);
});

test('optimalSellPrice: a price set by your minimum gets its own queue and wait', () => {
  // Glock Royal Legion FN: one other listing at 138,65, the next at 149,04, ~0,26 listing buyers a day, min 145,01
  const o = A.optimalSellPrice({ sellGraph: [[13865, 1], [14904, 2]], perDay: 0.26, maxWaitDays: 1, undercut: 1, rule: { min: 14501 } });
  assert.equal(o.price, 14501);
  assert.equal(o.belowMin, true);
  assert.equal(o.ahead, 1);                            // the 138,65 goes first
  assert.ok(Math.abs(o.waitDays - 2 / 0.26) < 1e-9);   // not the 1 / 0,26 of one cent under the cheapest
  const m = A.optimalSellPrice({ sellGraph: [[100, 1], [110, 5], [120, 9]], perDay: 10, maxWaitDays: 2, undercut: 1, rule: { max: 105 } });
  assert.equal(m.price, 105);
  assert.equal(m.ahead, 1);                            // only the 1,00 is under the 1,05 maximum
});

test('listAdvice: the queue model stops where recent sales stop (held)', () => {
  const net = (p) => Math.floor(p / 1.15);
  const g = [[230, 1], [245, 6], [260, 20]]; // 1 × 2,30, 5 × 2,45, 14 × 2,60; ~47 listing buyers a day
  assert.equal(A.listAdvice({ sellGraph: g, perDay: 80, d7: 233, net, maxWaitDays: 2 }).price, 259); // behind 6, sells in hours
  // …but nobody paid more than ~2,33 lately: no higher than that
  assert.ok(A.listAdvice({ sellGraph: g, perDay: 80, d7: 233, held: 233, net, maxWaitDays: 2 }).price <= 233);
});

test('fillTable: a lone dearer sale is somebody\'s chosen copy, not the market reaching that price', () => {
  // a thin skin: one sale an hour at 1,00 zł, and once a day a buyer who picks a better float pays 1,30
  const now = Date.UTC(2026, 10, 20);
  const pts = Array.from({ length: 720 }, (_, i) => ({ t: now - (719 - i) * 3600000, price: i % 24 === 12 ? 130 : 100, vol: 1 }));
  const t = A.fillTable(pts);
  assert.equal(t.ref, 100);
  assert.equal(t.P[1][A.FILL_K.indexOf(1)], 1);    // its own price: every day
  assert.equal(t.P[1][A.FILL_K.indexOf(1.13)], 0); // the 1,30 spikes don't make +13% "reachable"
  // the same, but the price really moves up to 1,30 for half a day (12 of its 24 sales): that counts
  const real = Array.from({ length: 720 }, (_, i) => ({ t: now - (719 - i) * 3600000, price: i % 24 >= 12 ? 130 : 100, vol: 1 }));
  assert.equal(A.fillTable(real).P[1][A.FILL_K.indexOf(1.3)], 1);
  // 6 dear hours of 24 sales a day are not "held": the run is half a day of the item's own trading
  const brief = Array.from({ length: 720 }, (_, i) => ({ t: now - (719 - i) * 3600000, price: i % 24 >= 12 && i % 24 < 18 ? 130 : 100, vol: 1 }));
  assert.equal(A.fillTable(brief).run, 12);
  assert.equal(A.fillTable(brief).P[1][A.FILL_K.indexOf(1.3)], 0);
});

test('anchorTable: the price now is checked against today\'s listings', () => {
  const t = { ref: 150, P: {}, D: {} };
  assert.equal(A.anchorTable(t, [[120, 5]]).ref, 120);                  // a spike in the last 24 h, listed at 1,20 now
  assert.equal(A.anchorTable(t, [[90, 1], [100, 3], [118, 13]]).ref, 100); // the 3rd cheapest unit (graph is cumulative)
  assert.equal(A.anchorTable(t, [[90, 1], [140, 9]]).ref, 140);         // one lone cheap listing doesn't drag it down
  assert.equal(A.anchorTable({ ...t, ref: 100 }, [[110, 5]]).ref, 100); // listings above the sales: not raised (untested)
  assert.equal(A.anchorTable({ ...t, ref: 100 }, [[95, 1], [104, 9]]).ref, 100); // within the book: unchanged
  assert.equal(A.anchorTable(t, null), t);
  // the advice from a 7-day-old price level: the case at 0,68 now isn't proposed at 0,78
  const PLN = { feePercent: 0.05, feeMin: 4, feeBase: 0, pubDefault: 0.1 };
  const net = (p) => receivedFromBuyer(p, 0.1, PLN);
  const now = Date.UTC(2026, 10, 20);
  const pts = Array.from({ length: 720 }, (_, i) => ({ t: now - (719 - i) * 3600000, price: i < 690 ? 76 : 68, vol: 500 }));
  const a = A.listAdviceFill({ table: A.fillTable(pts), sellGraph: [[68, 4000]], highestBuy: 67, net, maxWaitDays: 1 });
  assert.ok(a.price <= 70, `price ${a.price}`);
});

test('fillTable with binary-searched windows gives exactly the numbers of the plain version', () => {
  // the version before the speed-up, kept here as the reference
  const DAY = 86400000, HOUR = 3600000;
  const vw = (pts) => { if (!pts.length) return null; const q = [...pts].sort((a, b) => a.price - b.price); const tot = q.reduce((x, p) => x + (p.vol || 1), 0); let acc = 0; for (const p of q) { acc += p.vol || 1; if (acc >= tot / 2) return p.price; } return q[q.length - 1].price; };
  const ref = (points, minStarts = 24) => {
    const end = points[points.length - 1].t;
    const hr = points.filter((p) => p.t > end - 30 * DAY && p.vol > 0);
    if (hr.length < 120) return null;
    // the price at t: the last 24 h, or back to 5 units (at most 7 days)
    const priceAt = (t) => {
      const before = hr.filter((p) => p.t > t - 7 * DAY && p.t <= t).reverse();
      const got = [];
      for (const p of before) { if (p.t <= t - DAY && got.reduce((x, q) => x + q.vol, 0) >= 5) break; got.push(p); }
      return got.reduce((x, q) => x + q.vol, 0) >= 5 ? vw(got) : null;
    };
    // held: the highest vw-median of RUN units in a row (fewer in the whole window: all of them);
    // RUN = 5 units or half a day of the last 7 days' trading, whichever is more
    const RUN = Math.max(5, Math.round(hr.filter((p) => p.t > end - 7 * DAY).reduce((x, p) => x + p.vol, 0) / 7 * 0.5));
    const held = (next) => {
      let top = -Infinity;
      for (let i = 0; i < next.length; i++) {
        const run = []; let u = 0;
        for (let j = i; j < next.length && u < RUN; j++) { run.push(next[j]); u += next[j].vol; }
        if (u < RUN && i > 0) break;
        top = Math.max(top, vw(run));
      }
      return top;
    };
    const r0 = priceAt(end);
    if (!r0) return null;
    const P = {}, D = {};
    let n = 0;
    for (const N of A.FILL_N) {
      const hits = A.FILL_K.map(() => 0);
      let starts = 0, dsum = 0;
      for (let t = hr[0].t + 7 * DAY; t <= end - N * DAY; t += 3 * HOUR) {
        const r = priceAt(t);
        const next = hr.filter((p) => p.t > t && p.t <= t + N * DAY);
        if (!r || !next.length) continue;
        const top = held(next) / r;
        A.FILL_K.forEach((k, i) => { if (top >= k) hits[i]++; });
        const lastDay = next.filter((p) => p.t > t + (N - 1) * DAY);
        dsum += (vw(lastDay.length ? lastDay : next) || r) / r;
        starts++;
      }
      if (starts < minStarts) continue;
      P[N] = hits.map((h) => Math.round((h / starts) * 100) / 100);
      D[N] = Math.round((dsum / starts) * 1000) / 1000;
      if (N === 2) n = starts;
    }
    return Object.keys(P).length ? { ref: r0, P, D, n, run: RUN } : null;
  };
  let seed = 7;
  const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
  for (let k = 0; k < 6; k++) {
    const pts = [];
    let price = 100 + k * 300;
    const t0 = Date.UTC(2026, 9, 1);
    for (let h = 0; h < 24 * 33; h++) {
      if (rnd() < 0.15 * (k + 1)) continue; // thin hours, gaps
      price = Math.max(3, Math.round(price * (1 + (rnd() - 0.5) * 0.04)));
      pts.push({ t: t0 + h * 3600000, price, vol: 1 + Math.floor(rnd() * 6) });
    }
    assert.deepEqual(A.fillTable(pts), ref(pts), 'series ' + k);
  }
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
  // USP-S | Silent Shot FN, 2026-11-20: 46 units at the market price in front, 82 buyers of listings a day. The
  // queue at the market price refills, they aren't "dumped": undercut the cheapest, don't wait behind them
  assert.equal(qc(82, [{ price: 111, ahead: 0 }, { price: 112, ahead: 20 }, { price: 113, ahead: 46 }]), 111);
  assert.equal(qc(82, [{ price: 111, ahead: 0 }, { price: 112, ahead: 4 }]), 112); // a few that go within the hour: still fine
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

test('lowest price follows the wallet fee minimum', () => {
  const w = { feePercent: 0.05, feeMin: 4, feeBase: 0, pubDefault: 0.1 };
  const net = (p) => receivedFromBuyer(p, 0.1, w);
  assert.equal(MIN_BUYER, 3);
  syncMinBuyer(w);
  try {
    assert.equal(MIN_BUYER, 9);
    assert.equal(A.realPrice(9, net), 9);
    assert.equal(A.relistTarget({ current: 20, competitor: 8, rule: { undercut: 1 } }).price, 9);
    const table = { ref: 10, P: { 2: A.FILL_K.map(() => 0.8) }, D: { 2: 1 }, n: 50 };
    assert.equal(A.listAdviceFill({ table, sellGraph: [[10, 5], [13, 20]], net, maxWaitDays: 2, undercut: 1 }).quick, 9);
    const book = { buyGraph: [[12, 5]], sellGraph: [[12, 5], [30, 20]], points: [] };
    assert.equal(A.buyPlan({ ...book, net, sell: 12 }), null); // pays 0,04 zł, nothing can be bought that cheap
    const plan = A.buyPlan({ ...book, net, sell: 30, from: 13 });
    assert.equal(plan.got, 22);
    assert.ok(plan.ladder.length && plan.ladder.every((x) => x.price >= 9 && x.price <= plan.maxZero));
  } finally {
    syncMinBuyer();
  }
  assert.equal(MIN_BUYER, 3);
});

test('quick prices: a saved order book is reused only while the market looks the same', () => {
  const rows = [
    { strHash: '396710-A', cSellOrders: 126, eCurrency: 6, strMinSellSubtotal: '0,12 zł' },
    { strHash: '396710-B', cSellOrders: 2000, eCurrency: 6, strMinSellSubtotal: '1 234,56 zł' },
    { strHash: '396710-C', cSellOrders: 5, eCurrency: 1, strMinSellSubtotal: '$0.05' },    // another currency
    { strHash: '396710-D', cSellOrders: 0, eCurrency: 6, strMinSellSubtotal: '' },         // nothing listed
  ];
  const q = A.parseQuotes(rows, 6);
  assert.deepEqual([...q.keys()], ['396710-A', '396710-B']);
  assert.deepEqual(q.get('396710-A'), { low: 12, sell: 126 });
  assert.equal(q.get('396710-B').low, 123456);
  const now = 1800000000000;
  const h = { lowestSell: 12, sellCount: 126, at: now - 60000 };
  assert.equal(A.bookStillGood(h, { low: 12, sell: 126 }, now), true);
  assert.equal(A.bookStillGood(h, { low: 11, sell: 126 }, now), false);     // someone undercut
  assert.equal(A.bookStillGood(h, { low: 12, sell: 127 }, now), false);     // a new listing
  assert.equal(A.bookStillGood({ ...h, at: now - A.BOOK_MAX_AGE }, { low: 12, sell: 126 }, now), false); // too old
  assert.equal(A.bookStillGood(h, undefined, now), false);
  assert.equal(A.bookStillGood(null, { low: 12, sell: 126 }, now), false);
  assert.equal(A.bookStillGood(h, { low: 12, sell: 126 }, now, 30000), false); // older than this item's own limit
  const ages = Array.from({ length: 200 }, (_, i) => A.bookMaxAge(`396710-Card ${i}`));
  assert.ok(ages.every((x) => x >= A.BOOK_MAX_AGE / 2 && x < A.BOOK_MAX_AGE));
  assert.ok(new Set(ages.map((x) => Math.floor(x / 60000))).size >= 4);         // spread over the 5-10 minutes
  assert.equal(A.bookMaxAge('396710-Card 7'), A.bookMaxAge('396710-Card 7'));
});

test('valuation: saved listings are reused only while the search shows the same market', () => {
  const now = 1800000000000, q = { low: 12, sell: 50 };
  const c = { ask: [[12, 5]], lowest: 12, sell: 50, bookAt: now - 60000 };
  assert.equal(A.savedAskGood(c, q, now, 3600000), true);
  assert.equal(A.savedAskGood({ ...c, lowest: 13 }, q, now, 3600000), false);
  assert.equal(A.savedAskGood({ ...c, sell: 49 }, q, now, 3600000), false);
  assert.equal(A.savedAskGood({ ...c, ask: null }, q, now, 3600000), false);          // no listings saved yet
  assert.equal(A.savedAskGood({ ...c, sell: undefined }, q, now, 3600000), false);    // saved by an older version
  assert.equal(A.savedAskGood({ ...c, bookAt: now - 3600000 }, q, now, 3600000), false);
  assert.equal(A.savedAskGood(c, undefined, now, 3600000), false);
});

test('new search rows: the shape of the old search, and the rate between the two', () => {
  const rows = A.searchRows([
    { strHash: 'Revolution Case', cSellOrders: 5000, eCurrency: 6, strMinSellSubtotal: '3,28 zł', asset_description: { name: 'Skrzynia', icon_url: 'i', name_color: 'fff', type: 'Container' } },
    { strHash: 'Empty Case', cSellOrders: 0, eCurrency: 6, strMinSellSubtotal: '' },
    { cSellOrders: 1 },
  ]);
  assert.equal(rows.length, 2);
  assert.deepEqual(rows[0], { hash_name: 'Revolution Case', name: 'Skrzynia', sell_price: 328, sell_price_text: '3,28 zł', sell_listings: 5000, asset_description: { icon_url: 'i', name_color: 'fff', type: 'Container' } });
  assert.equal(rows[1].sell_price, 0);
  const fresh = [['A', 360], ['B', 720], ['C', 1080], ['D', 40], ['E', 900]].map(([hash_name, sell_price]) => ({ hash_name, sell_price }));
  const old = [['A', 100], ['B', 200], ['C', 300], ['D', 11], ['F', 500]].map(([hash_name, sell_price]) => ({ hash_name, sell_price }));
  assert.equal(A.searchRate(fresh, old), 3.6);                        // D is too cheap to trust, F isn't in the new list
  assert.equal(A.searchRate(fresh, old.slice(0, 2)), null);           // too few items
  assert.equal(A.searchRate(fresh, []), null);
});

test('store buckets: one per key, edits from another tab are seen and not overwritten, caches written later', async () => {
  const gm = new Map();
  globalThis.GM_getValue = (k) => (gm.has(k) ? structuredClone(gm.get(k)) : undefined);
  globalThis.GM_setValue = (k, v) => gm.set(k, structuredClone(v));
  globalThis.GM_deleteValue = (k) => gm.delete(k);
  const S = await import('../src/core/store.js');
  const realNow = Date.now;
  let now = realNow();
  Date.now = () => now;
  try {
    // the same object for every module asking for a key
    assert.equal(S.bucket('sellPlans'), S.bucket('sellPlans'));
    const plans = S.bucket('sellPlans');
    plans.set('A', { qty: 1 });
    // another tab adds a plan: seen after a moment, and an edit here keeps it
    gm.set('sellPlans', { ...gm.get('sellPlans'), B: { qty: 2 } });
    plans.set('C', { qty: 3 });
    assert.deepEqual(Object.keys(gm.get('sellPlans')).sort(), ['A', 'B', 'C']);
    gm.set('sellPlans', { A: { qty: 1 }, C: { qty: 3 } }); // the other tab deleted B
    now += 2500;
    assert.equal(plans.get('B'), undefined);
    // a setting switched off in another tab stops this one too
    S.settings.autoRelist = true;
    gm.set('settings', { ...gm.get('settings'), autoRelist: false });
    now += 2500;
    assert.equal(S.settings.autoRelist, false);
    // a cache: written a few seconds later (or when the page is left), not on every change
    const pr = S.bucket('prices');
    pr.set('730|X', { lowest: 5 });
    assert.equal(gm.get('prices'), undefined);
    pr.flush();
    assert.deepEqual(gm.get('prices'), { '730|X': { lowest: 5 } });
    // replaced or deleted from outside (import, "clear prices"): the copy in memory doesn't come back
    pr.set('730|Y', { lowest: 7 });
    S.del('prices');
    assert.equal(pr.get('730|X'), undefined);
    pr.flush();
    assert.equal(gm.get('prices'), undefined);
    S.set('prices', { '730|Z': { lowest: 9 } });
    assert.deepEqual(pr.get('730|Z'), { lowest: 9 });
  } finally {
    Date.now = realNow;
  }
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

test('patterns: known seeds are found in any wear / StatTrak, your own lines too', async () => {
  const P = await import('../src/core/patterns.js');
  assert.equal(P.baseName('★ StatTrak™ Karambit | Case Hardened (Field-Tested)'), 'karambit | case hardened');
  assert.equal(P.baseName('Souvenir AK-47 | Case Hardened (Well-Worn)'), 'ak-47 | case hardened');
  const ak = P.patternOf('StatTrak™ AK-47 | Case Hardened (Battle-Scarred)', 661);
  assert.equal(ak.what, 'Blue gem');
  assert.equal(ak.level, 'top');
  assert.equal(P.patternOf('AK-47 | Case Hardened (Field-Tested)', 670).level, 'high');
  assert.equal(P.patternOf('AK-47 | Case Hardened (Field-Tested)', 662), null);
  assert.equal(P.patternOf('AK-47 | Redline (Field-Tested)', 661), null);              // the seed alone means nothing
  assert.equal(P.patternOf('★ Karambit | Marble Fade (Factory New)', 412).label, '#1 (max)');
  assert.equal(P.patternOf('★ Butterfly Knife | Marble Fade (Factory New)', 412), null); // Fire & Ice seeds differ per knife
  assert.equal(P.patternOf('AK-47 | Case Hardened (Field-Tested)', null), null);
  assert.equal(P.patternOf('StatTrak™ Five-SeveN | Kami (Minimal Wear)', 909).level, 'top'); // picture patterns too
  assert.equal(P.patternOf('Five-SeveN | Kami (Field-Tested)', 906).label, '„Togepi”');
  assert.equal(P.patternOf('Five-SeveN | Case Hardened (Field-Tested)', 909), null);
  // your own lines: ranges, labels, comments, mistakes reported by line
  const txt = '# moje\nAK-47 | Case Hardened: 661, 100-102 = mój\nUSP-S | Kill Confirmed: 7\nzepsuta linia\nGlock-18 | Fade: 5-2000';
  const u = P.parseUser(txt);
  assert.deepEqual(u.errors, [4, 5]);
  assert.deepEqual(u.entries[0].tiers[0].seeds, [661, 100, 101, 102]);
  assert.equal(u.entries[1].what, 'Twój wzór');
  assert.equal(P.patternOf('AK-47 | Case Hardened (Minimal Wear)', 661, txt).what, 'mój'); // yours wins over the starter
  assert.equal(P.patternOf('AK-47 | Case Hardened (Minimal Wear)', 101, txt).level, 'user');
  assert.equal(P.patternOf('StatTrak™ USP-S | Kill Confirmed (Field-Tested)', 7, txt).what, 'Twój wzór');
  assert.equal(P.patternOf('AK-47 | Case Hardened (Minimal Wear)', 955, txt).level, 'high'); // the starter list still works
});

test('patterns: the community catalog (cs2pattern pattern.json) becomes marks, the hand-checked list wins', async () => {
  const P = await import('../src/core/patterns.js');
  const cat = {
    'case hardened': { 'ak-47': [{ name: 'gem_blue', ordered: true, pattern: [661, 670, 955, 179, 387, 151, 321, 592, 809, 555] }] },
    kami: { 'five-seven': [{ name: 'pussy', ordered: false, pattern: [590, 909] }] },
    paw: { awp: [{ name: 'golden_cat', ordered: false, pattern: [41, 350] }, { name: 'stoner_cat', ordered: false, pattern: [420] }] },
  };
  const extra = P.fromCatalog(cat);
  const m = P.patternOf('AK-47 | Case Hardened (Field-Tested)', 179, '', extra);
  assert.equal(m.what, 'Blue gem');
  assert.equal(m.label, '#4 z 10');
  assert.equal(m.level, 'mid');                                                       // #1 gold, #2-#3 violet, the rest blue
  assert.equal(P.patternOf('AK-47 | Case Hardened (Field-Tested)', 670, '', extra).label, 'Tier 1'); // hand-checked wins
  assert.equal(P.patternOf('★ StatTrak™ AWP | Paw (Field-Tested)', 41, '', extra).what, 'Złoty kot');
  assert.equal(P.patternOf('AWP | Paw (Minimal Wear)', 420, '', extra).what, 'Stoner cat');
  assert.equal(P.patternOf('AWP | Paw (Field-Tested)', 41), null);                    // without the catalog
  assert.deepEqual(P.fromCatalog(null), []);
  assert.deepEqual(P.fromCatalog({ x: { y: [{ name: 'a', pattern: ['oops', 5000] }] } }), []); // junk is skipped
});

test('market sample: kinds and an even spread over kind and price band', async () => {
  const S = await import('../src/core/sample.js');
  assert.equal(S.kindOf('★ Karambit | Fade (Factory New)', '★ Covert Knife'), 'knife');
  assert.equal(S.kindOf('Gamma Case', 'Base Grade Container'), 'container');
  assert.equal(S.kindOf('Sticker | Bomb Code', 'High Grade Sticker'), 'sticker');
  assert.equal(S.kindOf('AK-47 | Redline (Field-Tested)', 'Classified Rifle'), 'skin');
  assert.equal(S.kindOf("Charm | Lil' Zen", 'Remarkable Charm'), 'other');
  assert.equal(S.bandOf(10), 0);
  assert.equal(S.bandOf(300), 2);
  assert.equal(S.bandOf(50000), 5);
  // 1000 cheap skins and 10 knives: the knives aren't drowned out
  const pool = [...Array.from({ length: 1000 }, (_, i) => ({ hash: 's' + i, kind: 'skin', band: 0 })), ...Array.from({ length: 10 }, (_, i) => ({ hash: 'k' + i, kind: 'knife', band: 5 }))];
  const pick = S.stratify(pool, 40, 7);
  assert.equal(pick.length, 40);
  assert.equal(pick.filter((x) => x.kind === 'knife').length, 10);
  assert.equal(new Set(pick.map((x) => x.hash)).size, 40);
  assert.deepEqual(S.stratify(pool, 40, 7), pick); // the same seed, the same sample
});

test('recentTrend: the price now, 3 and 6 months ago (information for the cards)', () => {
  const DAY = 86400000, end = Date.UTC(2026, 10, 20);
  // 126 for a year, then a slide to 88 over the last 6 months (M4A4 Desolate Space MW)
  const pts = Array.from({ length: 400 }, (_, i) => { const ago = 399 - i; return { t: end - ago * DAY, price: Math.round(ago > 182 ? 12600 : 8800 + (ago / 182) * 3800), vol: 20 }; });
  const r = A.recentTrend(pts);
  assert.ok(Math.abs(r.now - 8900) < 200 && Math.abs(r.m6 - 12600) < 300, JSON.stringify(r));
  assert.ok(r.t6 < -0.25 && r.t3 < 0 && r.t3 > r.t6, JSON.stringify(r));
  assert.equal(A.recentTrend(pts.slice(-60)).m6, null); // 2 months of history: no 6-month figure
  assert.equal(A.recentTrend([]), null);
});

test('market sample kinds: a bare case name (no type) is a container', async () => {
  const S = await import('../src/core/sample.js');
  assert.equal(S.kindOf('CS:GO Weapon Case 2'), 'container');
  assert.equal(S.kindOf('Sealed Dead Hand Terminal'), 'container');
  assert.equal(S.kindOf('Budapest 2025 Champions Autograph Capsule'), 'container');
  assert.equal(S.kindOf('AK-47 | Case Hardened (Field-Tested)'), 'skin'); // "Case" inside a skin name isn't a case
});
