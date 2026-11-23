// Price history of one item: real sale prices over time, with the volume in its own strip below (one scale each).
// One absurd sale must not flatten the rest, so an isolated spike is left off the scale and marked at the edge with its
// real value; a real rise stays on it. Days without sales stay visible: the line is dashed across them.
import * as store from './store.js';
import { L, locale } from './i18n.js';

const HOUR = 3600000, DAY = 24 * HOUR;
const RANGES = [
  { id: '7', days: 7, size: HOUR }, { id: '30', days: 30, size: 6 * HOUR }, { id: '90', days: 90, size: DAY },
  { id: '365', days: 365, size: DAY }, { id: 'all', days: Infinity, size: 7 * DAY },
];
// (the three line colors pass the colorblind check on the panel's background)
const C = { sale: '#3b98dc', bid: '#12a884', ask: '#e4662f', ink: '#c6d4df', mut: '#8f98a0', grid: 'rgba(255,255,255,.07)', bar: '#3d6a8a', surface: '#1b2838' };
const M = { l: 70, r: 74, t: 14, price: 212, gap: 14, vol: 44, b: 24 };
let chartId = 0;

/** sales grouped into periods of `size` ms: the volume-weighted median price, the lowest and highest, units sold */
export function bucketize(points, from, size) {
  const groups = new Map();
  for (const p of points) {
    if (p.t < from || !(p.price > 0)) continue;
    const k = Math.floor(p.t / size);
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(p);
  }
  return [...groups.entries()].sort((a, b) => a[0] - b[0]).map(([k, ps]) => {
    const s = [...ps].sort((a, b) => a.price - b.price);
    const weight = (p) => Math.max(1, p.vol || 0);
    const total = s.reduce((n, p) => n + weight(p), 0);
    let seen = 0, price = s[0].price;
    for (const p of s) { seen += weight(p); if (seen * 2 >= total) { price = p.price; break; } }
    return { t: (k + 0.5) * size, from: k * size, to: (k + 1) * size, price, lo: s[0].price, hi: s[s.length - 1].price, vol: ps.reduce((n, p) => n + (p.vol || 0), 0) };
  });
}

/**
 * The scale of the prices without one-off spikes. A spike stands far from the prices both right before and right after
 * it, so a real rise or fall, however big, stays on the scale: the prices next to it move with it.
 */
const SPIKE = 1.6;
export function priceDomain(values) {
  const mid = (a) => [...a].sort((x, y) => x - y)[Math.floor((a.length - 1) / 2)];
  const kept = values.filter((v, i) => {
    const before = values.slice(Math.max(0, i - 4), i), after = values.slice(i + 1, i + 5);
    if (!before.length || !after.length) return true;
    const a = mid(before), b = mid(after), top = Math.max(a, b), bottom = Math.min(a, b);
    return !((v > top * SPIKE && v - top > 5) || (v < bottom / SPIKE && bottom - v > 5));
  });
  const lo = Math.min(...kept), hi = Math.max(...kept);
  return { lo, hi, minOk: lo / SPIKE, maxOk: hi * SPIKE };
}

function niceTicks(lo, hi, count = 4) {
  const raw = (hi - lo) / count || 1;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((x) => x * mag).find((x) => x >= raw);
  const out = [];
  for (let v = Math.ceil(lo / step) * step; v <= hi + step * 1e-6; v += step) out.push(Math.round(v * 100) / 100);
  return out;
}

/** draws the chart into `box`; bid and ask are today's best buy order and cheapest listing */
export function priceChart(box, { points, bid, ask, fmt }) {
  if (!box) return;
  const id = ++chartId;
  let range = RANGES.find((r) => r.id === store.get('flipChartRange', '30')) || RANGES[1];
  box.className = 'pc';
  box.innerHTML = `<div class="pc-top">
      <div class="pc-seg">${RANGES.map((r) => `<button type="button" data-r="${r.id}">${r.id === 'all' ? L('flip.chartAll') : r.id === '365' ? L('flip.chartYear') : L('flip.chartDays', { n: r.days })}</button>`).join('')}</div>
      <div class="pc-leg"><span><i style="border-color:${C.sale}"></i>${L('flip.salePrice')}</span>${bid ? `<span><i class="d" style="border-color:${C.bid}"></i>${L('flip.buyOrdersNow')}</span>` : ''}${ask ? `<span><i class="d" style="border-color:${C.ask}"></i>${L('flip.lowestListingNow')}</span>` : ''}</div>
    </div><div class="pc-plot"></div><div class="pc-tip" hidden></div>`;
  const plot = box.querySelector('.pc-plot'), tip = box.querySelector('.pc-tip');
  const dayFmt = (t, withYear) => new Date(t).toLocaleDateString(locale(), withYear ? { day: '2-digit', month: '2-digit', year: 'numeric' } : { day: '2-digit', month: '2-digit' });

  function draw() {
    box.querySelectorAll('[data-r]').forEach((b) => b.classList.toggle('on', b.dataset.r === range.id));
    tip.hidden = true;
    const now = Date.now();
    const data = bucketize(points, range.days === Infinity ? 0 : now - range.days * DAY, range.size);
    if (!data.length) { plot.innerHTML = `<div class="empty">${L('flip.chartNoSales')}</div>`; return; }
    const W = Math.max(420, plot.clientWidth || 1000), H = M.t + M.price + M.gap + M.vol + M.b;
    const pR = W - M.r, pTop = M.t, pBot = M.t + M.price, vTop = pBot + M.gap, vBot = vTop + M.vol;
    const x0 = Math.max(range.days === Infinity ? 0 : now - range.days * DAY, data[0].from), x1 = now;
    const X = (t) => M.l + ((Math.min(t, x1) - x0) / (x1 - x0 || 1)) * (pR - M.l);

    const dom = priceDomain(data.map((d) => d.price));
    const onScale = (v) => v > 0 && v >= dom.minOk && v <= dom.maxOk;
    const inScale = [dom.lo, dom.hi, ...[bid, ask].filter(onScale)];
    let lo = Math.min(...inScale), hi = Math.max(...inScale);
    if (lo === hi) { lo *= 0.95; hi *= 1.05; }
    const pad = (hi - lo) * 0.12;
    lo = Math.max(0, lo - pad); hi += pad;
    const Y = (v) => pBot - ((v - lo) / (hi - lo)) * (pBot - pTop);

    let g = '';
    for (const v of niceTicks(lo, hi)) {
      g += `<line x1="${M.l}" x2="${pR}" y1="${Y(v)}" y2="${Y(v)}" stroke="${C.grid}"/><text x="${M.l - 8}" y="${Y(v) + 4}" fill="${C.mut}" font-size="11" text-anchor="end">${fmt(v)}</text>`;
    }
    const span = x1 - x0, labels = Math.max(3, Math.min(7, Math.floor((pR - M.l) / 120)));
    for (let i = 0; i < labels; i++) {
      const t = x0 + (span * i) / (labels - 1);
      g += `<text x="${X(t)}" y="${H - 7}" fill="${C.mut}" font-size="11" text-anchor="${i === 0 ? 'start' : i === labels - 1 ? 'end' : 'middle'}">${dayFmt(t, span > 200 * DAY)}</text>`;
    }

    // volume, on its own scale under the prices
    const vMax = Math.max(...data.map((d) => d.vol), 1);
    const slot = ((pR - M.l) * range.size) / (span || 1), bw = Math.max(1, Math.min(14, slot - 2));
    g += `<line x1="${M.l}" x2="${pR}" y1="${vBot}" y2="${vBot}" stroke="${C.grid}"/><text x="${M.l - 8}" y="${vTop + 9}" fill="${C.mut}" font-size="11" text-anchor="end">${L('flip.chartUnits', { n: vMax.toLocaleString(locale()) })}</text>`;
    g += data.map((d) => { const h = Math.max(1.5, (d.vol / vMax) * M.vol); return `<rect x="${(X(d.t) - bw / 2).toFixed(1)}" y="${(vBot - h).toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" rx="${Math.min(2, bw / 2)}" fill="${C.bar}"/>`; }).join('');

    // today's buy orders and cheapest listing, labelled at the right edge; a value off the scale is pinned to the edge
    const marks = [[bid, C.bid], [ask, C.ask]].filter(([v]) => v > 0).map(([v, color]) => {
      const on = v >= lo && v <= hi;
      return { v, color, on, y: on ? Y(v) : v > hi ? pTop + 5 : pBot - 5, arrow: on ? '' : v > hi ? '▲ ' : '▼ ' };
    }).sort((a, b) => a.y - b.y);
    if (marks.length === 2 && marks[1].y - marks[0].y < 15) { const mid = (marks[0].y + marks[1].y) / 2; marks[0].y = Math.max(pTop + 5, mid - 7.5); marks[1].y = marks[0].y + 15; }
    for (const m of marks) {
      if (m.on) g += `<line x1="${M.l}" x2="${pR}" y1="${Y(m.v)}" y2="${Y(m.v)}" stroke="${m.color}" stroke-width="1.5" stroke-dasharray="5 4" opacity=".85"/>`;
      g += `<text x="${pR + 6}" y="${m.y + 4}" fill="${C.ink}" font-size="11">${m.arrow}${fmt(m.v)}</text>`;
    }

    // the sale line: solid while the item trades, dashed across a stretch without any sale
    const limit = Math.max(2 * DAY, 3 * range.size);
    let solid = '', dashed = '';
    data.forEach((d, i) => {
      const p = `${X(d.t).toFixed(1)},${Y(d.price).toFixed(1)}`;
      if (!i) { solid += `M${p}`; return; }
      if (d.t - data[i - 1].t > limit) { dashed += `M${X(data[i - 1].t).toFixed(1)},${Y(data[i - 1].price).toFixed(1)}L${p}`; solid += `M${p}`; } else solid += `L${p}`;
    });
    const clip = `pc-clip-${id}`;
    g += `<clipPath id="${clip}"><rect x="${M.l}" y="${pTop}" width="${pR - M.l}" height="${pBot - pTop}"/></clipPath><g clip-path="url(#${clip})">`;
    g += `<path d="${dashed}" fill="none" stroke="${C.sale}" stroke-width="1.5" stroke-dasharray="3 4" opacity=".55"/><path d="${solid}" fill="none" stroke="${C.sale}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;
    if (data.length <= 70) g += data.filter((d) => d.price >= lo && d.price <= hi).map((d) => `<circle cx="${X(d.t).toFixed(1)}" cy="${Y(d.price).toFixed(1)}" r="3" fill="${C.sale}" stroke="${C.surface}" stroke-width="1.5"/>`).join('');
    g += '</g>';

    // sales outside the scale: a marker at the edge, the most extreme one with its real value
    const over = data.filter((d) => d.price > hi), under = data.filter((d) => d.price < lo);
    const edge = (list, up) => {
      if (!list.length) return '';
      const y = up ? pTop : pBot;
      const tri = list.map((d) => { const x = X(d.t); return `<polygon points="${x - 4},${up ? y + 7 : y - 7} ${x + 4},${up ? y + 7 : y - 7} ${x},${y}" fill="${C.sale}"/>`; }).join('');
      const top = list.reduce((a, d) => ((up ? d.price > a.price : d.price < a.price) ? d : a));
      const x = X(top.t), anchor = x > pR - 70 ? 'end' : x < M.l + 70 ? 'start' : 'middle';
      return `${tri}<text x="${x}" y="${up ? y + 19 : y - 11}" fill="${C.ink}" font-size="11" text-anchor="${anchor}" paint-order="stroke" stroke="${C.surface}" stroke-width="3">${L(up ? 'flip.chartHigh' : 'flip.chartLow', { v: fmt(top.price) })}</text>`;
    };
    g += edge(over, true) + edge(under, false);
    g += `<line class="pc-x" y1="${pTop}" y2="${vBot}" stroke="${C.ink}" stroke-opacity=".45" visibility="hidden"/><circle class="pc-dot" r="4.5" fill="${C.sale}" stroke="${C.surface}" stroke-width="2" visibility="hidden"/>`;
    plot.innerHTML = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" tabindex="0" role="img" aria-label="${L('flip.salePrice')}">${g}</svg>`;

    const svg = plot.firstChild, cross = svg.querySelector('.pc-x'), dot = svg.querySelector('.pc-dot');
    let cur = data.length - 1;
    const show = (i) => {
      cur = Math.max(0, Math.min(data.length - 1, i));
      const d = data[cur], x = X(d.t), y = Math.max(pTop, Math.min(pBot, Y(d.price)));
      for (const k of ['x1', 'x2']) cross.setAttribute(k, x);
      cross.setAttribute('visibility', 'visible');
      dot.setAttribute('cx', x); dot.setAttribute('cy', y); dot.setAttribute('visibility', 'visible');
      const when = range.size < DAY
        ? new Date(d.from).toLocaleString(locale(), { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
        : range.size === DAY ? dayFmt(d.from, true) : `${dayFmt(d.from)} - ${dayFmt(d.to - 1, true)}`;
      tip.replaceChildren();
      const line = (cls, text) => { const e = document.createElement('div'); e.className = cls; e.textContent = text; tip.append(e); };
      line('v', fmt(d.price));
      if (d.hi > d.lo) line('s', L('flip.chartRange', { lo: fmt(d.lo), hi: fmt(d.hi) }));
      line('s', L('flip.chartUnits', { n: d.vol.toLocaleString(locale()) }));
      line('s', when);
      tip.hidden = false;
      const scale = svg.getBoundingClientRect().width / W || 1, top = plot.offsetTop;
      const px = x * scale, w = tip.offsetWidth;
      tip.style.left = `${px + 12 + w > plot.clientWidth ? Math.max(0, px - w - 12) : px + 12}px`;
      tip.style.top = `${top + M.t + 4}px`;
    };
    const hide = () => { tip.hidden = true; cross.setAttribute('visibility', 'hidden'); dot.setAttribute('visibility', 'hidden'); };
    svg.addEventListener('pointermove', (e) => {
      const r = svg.getBoundingClientRect(), px = ((e.clientX - r.left) / r.width) * W;
      let best = 0, gap = Infinity;
      data.forEach((d, i) => { const g2 = Math.abs(X(d.t) - px); if (g2 < gap) { gap = g2; best = i; } });
      show(best);
    });
    svg.addEventListener('pointerleave', hide);
    svg.addEventListener('blur', hide);
    svg.addEventListener('focus', () => { if (svg.matches(':focus-visible')) show(cur); });
    svg.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      show(cur + (e.key === 'ArrowLeft' ? -1 : 1));
    });
  }

  box.querySelector('.pc-seg').addEventListener('click', (e) => {
    const b = e.target.closest('[data-r]');
    if (!b) return;
    range = RANGES.find((r) => r.id === b.dataset.r);
    store.set('flipChartRange', range.id);
    draw();
  });
  draw();
  if (typeof ResizeObserver !== 'undefined') {
    let last = plot.clientWidth;
    const ro = new ResizeObserver(() => {
      if (!box.isConnected) { ro.disconnect(); return; }
      if (plot.clientWidth && plot.clientWidth !== last) { last = plot.clientWidth; draw(); }
    });
    ro.observe(plot);
  }
}

/**
 * A time axis that shrinks long stretches without any sale, so years of nothing don't squeeze the months that matter.
 * U: time to axis position, T: back again, gaps: the shrunk stretches (always marked on the chart).
 */
export function timeWarp(times) {
  const t = [...new Set(times)].sort((a, b) => a - b), total = t[t.length - 1] - t[0];
  const limit = Math.max(30 * DAY, total * 0.05), u = [0], gaps = [];
  let active = 0;
  for (let i = 1; i < t.length; i++) if (t[i] - t[i - 1] <= limit) active += t[i] - t[i - 1];
  const shrunk = Math.max(active * 0.07, 1); // a gap takes a narrow, equal strip whatever its real length
  for (let i = 1; i < t.length; i++) {
    const dt = t[i] - t[i - 1];
    if (dt > limit) gaps.push({ from: t[i - 1], to: t[i] });
    u.push(u[i - 1] + (dt > limit ? shrunk : dt));
  }
  const along = (xs, ys, v) => {
    if (v <= xs[0]) return ys[0];
    if (v >= xs[xs.length - 1]) return ys[ys.length - 1];
    let a = 0, b = xs.length - 1;
    while (b - a > 1) { const m = (a + b) >> 1; if (xs[m] <= v) a = m; else b = m; }
    return ys[a] + ((v - xs[a]) / (xs[b] - xs[a] || 1)) * (ys[b] - ys[a]);
  };
  return { U: (v) => along(t, u, v), T: (v) => along(u, t, v), span: u[u.length - 1] || 1, gaps };
}

/**
 * A running total (flip profit, balance): a step at every trade, teal above zero and orange below (the side of the zero line says the same
 * without color). Drag to zoom, double click to go back.
 */
export function profitChart(plot, { points, fmt, onZoom, onReset, label = '', changeKey = 'flip.chartSale' }) {
  if (!plot || points.length < 2) return;
  const P = { l: 70, r: 82, t: 12, b: 24, h: 196 }, POS = '#12a884', NEG = '#e4662f', id = ++chartId;
  const tip = document.createElement('div');
  tip.className = 'pc-tip';
  tip.hidden = true;
  const signed = (v) => `${v > 0 ? '+' : ''}${fmt(v)}`;

  function draw() {
    const W = Math.max(420, plot.clientWidth || 1000), H = P.t + P.h + P.b, pR = W - P.r, pBot = P.t + P.h;
    const warp = timeWarp(points.map((x) => x[0]));
    const X = (t) => P.l + (warp.U(t) / warp.span) * (pR - P.l);
    const values = points.map((x) => x[1]);
    let lo = Math.min(0, ...values), hi = Math.max(0, ...values);
    if (lo === hi) hi = lo + 100;
    const pad = (hi - lo) * 0.1;
    lo = lo < 0 ? lo - pad : 0; hi += pad;
    const Y = (v) => pBot - ((v - lo) / (hi - lo)) * P.h, zero = Y(0);
    const real = points[points.length - 1][0] - points[0][0];
    const dateFmt = (t) => new Date(t).toLocaleString(locale(), real < 3 * DAY ? { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' } : real > 200 * DAY ? { day: '2-digit', month: '2-digit', year: 'numeric' } : { day: '2-digit', month: '2-digit' });

    let g = '';
    for (const v of niceTicks(lo, hi)) {
      g += `<line x1="${P.l}" x2="${pR}" y1="${Y(v)}" y2="${Y(v)}" stroke="${v === 0 ? 'rgba(255,255,255,.34)' : C.grid}"/><text x="${P.l - 8}" y="${Y(v) + 4}" fill="${C.mut}" font-size="11" text-anchor="end">${fmt(v)}</text>`;
    }
    for (const gap of warp.gaps) {
      const a = X(gap.from), b = X(gap.to);
      const n = Math.round((gap.to - gap.from) / (30.44 * DAY));
      g += `<g><title>${L('flip.chartGap', { n })}</title><rect x="${a}" y="${P.t}" width="${b - a}" height="${P.h}" fill="rgba(255,255,255,.035)"/>`;
      if (b - a >= 46) g += `<text x="${(a + b) / 2}" y="${P.t + 13}" fill="${C.mut}" font-size="10" text-anchor="middle">${L('flip.chartGapShort', { n })}</text>`;
      g += '</g>';
    }
    // dates: evenly along the axis, one that would land inside a gap moves to where the sales start again
    const labels = Math.max(3, Math.min(7, Math.floor((pR - P.l) / 120))), raw = [];
    for (let i = 0; i < labels; i++) {
      const t = warp.T((warp.span * i) / (labels - 1)), inGap = i && i < labels - 1 ? warp.gaps.find((x) => t > x.from && t < x.to) : null;
      raw.push(inGap ? inGap.to : t);
    }
    const lastTick = raw[raw.length - 1], ticks = [raw[0]];
    for (const t of raw.slice(1, -1)) if (X(t) - X(ticks[ticks.length - 1]) >= 88 && X(lastTick) - X(t) >= 88) ticks.push(t);
    ticks.push(lastTick);
    ticks.forEach((t, i) => { g += `<text x="${X(t)}" y="${H - 7}" fill="${C.mut}" font-size="11" text-anchor="${i === 0 ? 'start' : i === ticks.length - 1 ? 'end' : 'middle'}">${dateFmt(t)}</text>`; });

    let d = `M${X(points[0][0]).toFixed(1)},${Y(points[0][1]).toFixed(1)}`;
    for (let i = 1; i < points.length; i++) d += `H${X(points[i][0]).toFixed(1)}V${Y(points[i][1]).toFixed(1)}`;
    const area = `${d}V${zero.toFixed(1)}H${X(points[0][0]).toFixed(1)}Z`;
    const up = `pc-up-${id}`, down = `pc-down-${id}`;
    g += `<clipPath id="${up}"><rect x="${P.l}" y="${P.t}" width="${pR - P.l}" height="${Math.max(0, zero - P.t)}"/></clipPath><clipPath id="${down}"><rect x="${P.l}" y="${zero}" width="${pR - P.l}" height="${Math.max(0, pBot - zero)}"/></clipPath>`;
    for (const [clip, color] of [[up, POS], [down, NEG]]) g += `<g clip-path="url(#${clip})"><path d="${area}" fill="${color}" opacity=".14"/><path d="${d}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round"/></g>`;
    const end = points[points.length - 1];
    g += `<circle cx="${X(end[0])}" cy="${Y(end[1])}" r="4" fill="${end[1] >= 0 ? POS : NEG}" stroke="${C.surface}" stroke-width="2"/><text x="${pR + 8}" y="${Y(end[1]) + 4}" fill="#fff" font-size="12" font-weight="600">${signed(end[1])}</text>`;
    g += `<line class="pc-x" y1="${P.t}" y2="${pBot}" stroke="${C.ink}" stroke-opacity=".45" visibility="hidden"/><circle class="pc-dot" r="4.5" stroke="${C.surface}" stroke-width="2" visibility="hidden"/>`;
    plot.innerHTML = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" tabindex="0" role="img" aria-label="${label}">${g}</svg><div class="pc-sel" hidden></div>`;
    plot.append(tip);
    tip.hidden = true;

    const svg = plot.querySelector('svg'), sel = plot.querySelector('.pc-sel'), cross = svg.querySelector('.pc-x'), dot = svg.querySelector('.pc-dot');
    const scale = () => svg.getBoundingClientRect().width / W || 1;
    const pxOf = (e) => Math.max(P.l, Math.min(pR, (e.clientX - svg.getBoundingClientRect().left) / scale()));
    const timeAt = (x) => warp.T(((x - P.l) / (pR - P.l)) * warp.span);
    let cur = points.length - 1, start = null;
    const show = (i) => {
      cur = Math.max(0, Math.min(points.length - 1, i));
      const [t, v] = points[cur], x = X(t), y = Y(v), change = cur ? v - points[cur - 1][1] : 0;
      for (const k of ['x1', 'x2']) cross.setAttribute(k, x);
      cross.setAttribute('visibility', 'visible');
      dot.setAttribute('cx', x); dot.setAttribute('cy', y); dot.setAttribute('fill', v >= 0 ? POS : NEG); dot.setAttribute('visibility', 'visible');
      tip.replaceChildren();
      const line = (cls, text) => { const e = document.createElement('div'); e.className = cls; e.textContent = text; tip.append(e); };
      line('v', signed(v));
      if (change) line('s', L(changeKey, { v: signed(change) }));
      line('s', new Date(t).toLocaleString(locale(), { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }));
      tip.hidden = false;
      const px = x * scale(), w = tip.offsetWidth;
      tip.style.left = `${px + 12 + w > plot.clientWidth ? Math.max(0, px - w - 12) : px + 12}px`;
      tip.style.top = `${P.t + 4}px`;
    };
    const hide = () => { tip.hidden = true; cross.setAttribute('visibility', 'hidden'); dot.setAttribute('visibility', 'hidden'); };
    svg.addEventListener('pointerdown', (e) => { if (e.button) return; start = pxOf(e); svg.setPointerCapture(e.pointerId); e.preventDefault(); });
    svg.addEventListener('pointermove', (e) => {
      const px = pxOf(e);
      if (start != null) {
        const a = Math.min(start, px) * scale(), b = Math.max(start, px) * scale();
        Object.assign(sel.style, { left: `${a}px`, width: `${b - a}px`, top: `${P.t * scale()}px`, height: `${P.h * scale()}px` });
        sel.hidden = b - a < 3;
        tip.hidden = true;
        return;
      }
      let best = 0, gap = Infinity;
      points.forEach((x, i) => { const dist = Math.abs(X(x[0]) - px); if (dist <= gap) { gap = dist; best = i; } });
      show(best);
    });
    svg.addEventListener('pointerup', (e) => {
      if (start == null) return;
      const a = Math.min(start, pxOf(e)), b = Math.max(start, pxOf(e));
      start = null;
      sel.hidden = true;
      if (b - a >= 6 && timeAt(b) - timeAt(a) >= 60000) onZoom?.(timeAt(a), timeAt(b));
    });
    svg.addEventListener('pointerleave', () => { if (start == null) hide(); });
    svg.addEventListener('blur', hide);
    svg.addEventListener('dblclick', () => onReset?.());
    svg.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      show(cur + (e.key === 'ArrowLeft' ? -1 : 1));
    });
  }
  draw();
  if (typeof ResizeObserver !== 'undefined') {
    let last = plot.clientWidth;
    const ro = new ResizeObserver(() => {
      if (!plot.isConnected) { ro.disconnect(); return; }
      if (plot.clientWidth && plot.clientWidth !== last) { last = plot.clientWidth; draw(); }
    });
    ro.observe(plot);
  }
}
