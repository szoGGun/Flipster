// "Wynik w miesiącach": years you can open, the result right next to the period, the counts behind each number on hover.
import { L, locale } from '../core/i18n.js';
import { esc } from '../core/util.js';

const KEYS = ['flip', 'nf', 'wins', 'cases', 'nc', 'open', 'spent', 'recv'];
const sumOf = (rows) => rows.reduce((s, x) => { for (const k of KEYS) s[k] += x[k]; return s; }, Object.fromEntries(KEYS.map((k) => [k, 0])));

/** rows: months, newest first ({ k: 'YYYY-MM', flip, nf, wins, cases, nc, open, spent, recv }); open: the expanded years */
export function monthsHtml(rows, open, fmt) {
  const nil = '<span class="nil">-</span>';
  const money = (v) => (Math.round(v) ? `<span class="${v > 0 ? 'pos' : 'neg'}">${v > 0 ? '+' : ''}${fmt(v)}</span>` : nil);
  const flipTip = (x) => (x.nf ? `${x.nf} · ${Math.round((x.wins / x.nf) * 100)}% ${L('history.inProfit2')}` : '');
  const caseTip = (x) => (x.open ? `${x.open} ${L('history.open')}${x.nc < x.open ? L('history.withoutAResult', { open: x.open - x.nc }) : ''}` : '');
  const cells = (x) => {
    const total = x.flip + x.cases;
    return `<td class="num"><b>${money(total)}</b></td>
      <td class="num" title="${esc(flipTip(x))}">${x.nf ? money(x.flip) : nil}</td>
      <td class="num" title="${esc(caseTip(x))}">${x.nc ? money(x.cases) : x.open ? '…' : nil}</td>
      <td class="num">${x.spent ? fmt(x.spent) : nil}</td>
      <td class="num">${x.recv ? fmt(x.recv) : nil}</td>
      <td class="num">${money(x.recv - x.spent)}</td>`;
  };
  const monthName = (x) => { const [y, m] = x.k.split('-').map(Number); return new Date(y, m - 1, 1).toLocaleDateString(locale(), { month: 'long' }); };
  const years = new Map();
  for (const x of rows) { const y = x.k.slice(0, 4); if (!years.has(y)) years.set(y, []); years.get(y).push(x); }
  let body = '';
  for (const [y, months] of years) {
    const isOpen = open.has(y);
    body += `<tr class="y" data-year="${y}"><td><button type="button" aria-expanded="${isOpen}"><span class="car">${isOpen ? '▾' : '▸'}</span>${y}</button></td>${cells(sumOf(months))}</tr>`;
    if (isOpen) for (const x of months) body += `<tr class="m${Math.round(x.flip + x.cases) ? '' : ' idle'}"><td>${esc(monthName(x))}</td>${cells(x)}</tr>`;
  }
  if (years.size > 1) body += `<tr class="sum"><td>${L('history.total2')}</td>${cells(sumOf(rows))}</tr>`;
  return `<table class="mt"><thead><tr><th>${L('history.month')}</th><th class="num">${L('history.total2')}</th><th class="num">${L('history.flipProfit')}</th><th class="num">${L('history.cases2')}</th><th class="num">${L('history.spent')}</th><th class="num">${L('history.received2')}</th><th class="num">${L('history.balance')}</th></tr></thead><tbody>${body}</tbody></table>`;
}
