// "Dane do analizy": the order book and the full price history of a list of items, saved to a JSON file the user
// hands over for analysis. Read only, nothing is bought or listed; the file holds public market data and the fee
// settings, nothing about the account. Used from Okazje, Ekwipunek and both Rynek sub-tabs.
import * as ui from '../core/ui.js';
import * as steam from '../core/steam.js';
import * as prices from '../core/prices.js';
import { downloadText } from '../core/util.js';
import { token } from '../core/jobs.js';
import { KINDS, kindOf, bandOf, stratify } from '../core/sample.js';

let running = null; // token of the export in progress (one at a time, whichever tab started it)
export const researchRunning = () => !!running;
export const cancelResearch = () => running?.cancel();

/**
 * list: [{ hash, appid }] (duplicates dropped); where: what the items are, for the question ("z Twojego ekwipunku");
 * onBusy(true/false): show / hide the calling tab's Stop button.
 */
export async function exportResearch(list, where, { onBusy = () => {} } = {}) {
  if (running) return ui.log('Dane do analizy: poprzednie pobieranie jeszcze trwa.', 'warn');
  const items = [...new Map(list.filter((x) => x?.hash).map((x) => [`${+(x.appid || 730)}|${x.hash}`, { hash: x.hash, appid: +(x.appid || 730) }])).values()];
  if (!items.length) return ui.log('Dane do analizy: nie ma tu żadnych przedmiotów.', 'warn');
  if (!(await ui.ask('Zebrać dane do analizy?', `Pobiorę z Rynku Steam księgę zleceń i pełną historię cen dla <b>${items.length}</b> przedmiotów ${where} (ok. ${Math.max(1, Math.ceil(items.length / 40))} min) i zapiszę je do pliku <b>flipster-dane-do-analizy.json</b> w folderze pobierania przeglądarki.<br><span class="sub">Tylko odczyt, niczego nie kupuję ani nie wystawiam. W pliku są wyłącznie publiczne dane rynku i ustawienia prowizji, bez Twojego konta.</span>`, { ok: 'Zbierz dane' }))) return;
  const tk = (running = token());
  onBusy(true);
  const w = steam.wallet();
  const out = { at: Date.now(), currency: w.currency, fees: { feePercent: w.feePercent, feeMin: w.feeMin, feeBase: w.feeBase, pub: w.pubDefault }, items: [] };
  let i = 0, failed = 0;
  ui.log(`Dane do analizy: pobieram ${items.length} przedmiotów…`);
  try {
    for (const { hash, appid } of items) {
      if (tk.cancelled) break;
      ui.progress(++i, items.length);
      try {
        const [h, hist] = await Promise.all([
          prices.hist(appid, hash, 10 * 60000).catch((e) => { if (e.status === 429) throw e; return null; }),
          steam.priceHistory(appid, hash).catch((e) => { if (e.status === 429) throw e; return null; }),
        ]);
        if (!hist) { failed++; continue; }
        out.items.push({
          hash, appid,
          book: h ? { hb: h.highestBuy, ls: h.lowestSell, bc: h.buyCount, sc: h.sellCount, bg: (h.buyGraph || []).slice(0, 80), sg: (h.sellGraph || []).slice(0, 80) } : null,
          prices: hist.map((p) => [Math.round(p.t / 1000), p.price, p.vol]),
        });
      } catch (e) {
        if (e.status === 429) { ui.log('Dane do analizy: Steam ogranicza zapytania, zapisuję to, co już mam.', 'warn'); break; }
        failed++;
      }
    }
  } finally {
    ui.progress(0);
    running = null;
    onBusy(false);
  }
  if (!out.items.length) return ui.log('Dane do analizy: nic nie pobrano.', 'err');
  downloadText('flipster-dane-do-analizy.json', JSON.stringify(out), 'application/json');
  ui.log(`Dane do analizy: zapisano ${out.items.length} przedmiotów do pliku flipster-dane-do-analizy.json${failed ? ` (${failed} bez historii cen)` : ''}. Daj znać, że plik jest gotowy.`, 'ok');
}

// ---------------------------------------------------------------- a sample of the whole market
// For checking Flipster's algorithms on more than the user's own items (2026-11-20: "schodzi po skoku" rested on 45
// points of 19 items). Steam's popular list (~3000 items), stratified by kind and price band, n picked at random
// (seeded by the day: the same day gives the same sample), then the order book + full price history of each.
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
/** retry after Steam's rate limit: the scheduler already waited and retried, here 2 more minutes, 3 times at most */
async function patient(fn, tk, what) {
  for (let i = 0; ; i++) {
    try { return await fn(); } catch (e) {
      if (e.status !== 429 || i >= 3 || tk.cancelled) throw e;
      ui.log(`Próbka rynku: Steam ogranicza zapytania (${what}), czekam 2 min i jadę dalej…`, 'warn');
      for (let s = 0; s < 120 && !tk.cancelled; s++) await sleep(1000);
    }
  }
}

export async function exportMarketSample({ onBusy = () => {} } = {}) {
  if (running) return ui.log('Dane do analizy: poprzednie pobieranie jeszcze trwa.', 'warn');
  const n = await ui.ask('Próbka rynku do analizy', `Najpierw przejrzę listę ok. 3000 najpopularniejszych przedmiotów CS2 na Rynku Steam (same nazwy i ceny, kilka minut: Steam podaje je po 10). Z niej wylosuję tyle przedmiotów, ile wybierzesz poniżej, po równo z każdego rodzaju (${Object.values(KINDS).join(', ')}) i przedziału cen, i tylko dla nich pobiorę pełną historię cen i księgę zleceń. Zapiszę to do pliku <b>flipster-probka-rynku.json</b>, do sprawdzania algorytmów Flipstera na czymś więcej niż Twoje przedmioty.<br><br>
    Ile przedmiotów: <select id="ms-n"><option value="200">200 (ok. 5-8 min)</option><option value="400" selected>400 (ok. 10-15 min)</option><option value="800">800 (ok. 20-30 min)</option></select><br>
    <span class="sub">Tylko odczyt, niczego nie kupuję ani nie wystawiam. Przy limitach Steama czekam i jadę dalej; Stop zapisuje to, co już jest. Inne funkcje Flipstera mogą w tym czasie działać wolniej.</span>`, { ok: 'Pobierz próbkę', collect: (m) => +m.querySelector('#ms-n').value || 400 });
  if (!n) return;
  const tk = (running = token());
  onBusy(true);
  const w = steam.wallet();
  const out = { at: Date.now(), kind: 'market-sample', currency: w.currency, fees: { feePercent: w.feePercent, feeMin: w.feeMin, feeBase: w.feeBase, pub: w.pubDefault }, items: [] };
  try {
    // 1. the popular list (search answers in USD; the band is only for spreading the sample)
    const pool = [];
    // Steam hands out pages of 10 however many are asked for (2026-11-20: 30 pages "of 100" gave 300 items, every
    // tenth ten of the list) → walk by what really came, up to ~3000 items (≈ 300 pages, a few minutes)
    const POOL = 3000;
    let logged = 0;
    for (let start = 0, empties = 0; start < POOL && !tk.cancelled;) {
      const d = await patient(() => steam.schedule('search', async () => {
        const r = await fetch(`${steam.ORIGIN}/market/search/render/?norender=1&appid=730&l=english&start=${start}&count=100&search_descriptions=0&sort_column=popular&sort_dir=desc`, { credentials: 'include' });
        if (r.status === 429) throw new steam.HttpError(429, 'Steam: za dużo zapytań (429)');
        return r.ok ? r.json() : null;
      }), tk, 'lista');
      const res = d?.results || [];
      if (!res.length) { if (++empties > 3) break; await sleep(empties * 10000); continue; } // Steam's empty page under load
      empties = 0;
      for (const r of res) if (r.hash_name && r.sell_price > 0) pool.push({ hash: r.hash_name, kind: kindOf(r.hash_name, r.asset_description?.type), band: bandOf(r.sell_price), usd: r.sell_price, listings: r.sell_listings });
      start += res.length; // the real page size, not the one asked for
      ui.progress(Math.min(start, POOL), POOL);
      if (pool.length - logged >= 500) { logged = pool.length; ui.log(`Próbka rynku: lista popularnych ${pool.length}…`); }
      if (d?.total_count && start >= d.total_count) break;
    }
    if (tk.cancelled) return ui.log('Próbka rynku: przerwano przed pobieraniem historii.', 'warn');
    const today = new Date();
    const pick = stratify([...new Map(pool.map((x) => [x.hash, x])).values()], n, today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate());
    const byKind = Object.fromEntries(Object.keys(KINDS).map((k) => [k, pick.filter((x) => x.kind === k).length]));
    ui.log(`Próbka rynku: z ${pool.length} popularnych wylosowałem ${pick.length} (${Object.entries(byKind).map(([k, c]) => `${KINDS[k]} ${c}`).join(', ')}). Pobieram historie cen…`);
    // 2. order book + full price history of each
    let i = 0, failed = 0;
    for (const x of pick) {
      if (tk.cancelled) break;
      ui.progress(++i, pick.length);
      try {
        const [h, hist] = await Promise.all([
          patient(() => prices.hist(730, x.hash, 10 * 60000), tk, 'księgi zleceń').catch((e) => { if (e.status === 429) throw e; return null; }),
          patient(() => steam.priceHistory(730, x.hash), tk, 'historie cen').catch((e) => { if (e.status === 429) throw e; return null; }),
        ]);
        if (!hist) { failed++; continue; }
        out.items.push({
          hash: x.hash, appid: 730, kind: x.kind, band: x.band, usd: x.usd, listings: x.listings,
          book: h ? { hb: h.highestBuy, ls: h.lowestSell, bc: h.buyCount, sc: h.sellCount, bg: (h.buyGraph || []).slice(0, 80), sg: (h.sellGraph || []).slice(0, 80) } : null,
          prices: hist.map((p) => [Math.round(p.t / 1000), p.price, p.vol]),
        });
      } catch (e) {
        if (e.status === 429) { ui.log('Próbka rynku: Steam dalej ogranicza zapytania, zapisuję to, co już mam.', 'warn'); break; }
        failed++;
      }
      if (i % 50 === 0) ui.log(`Próbka rynku: ${i}/${pick.length}…`);
    }
  } finally {
    ui.progress(0);
    running = null;
    onBusy(false);
  }
  if (!out.items.length) return ui.log('Próbka rynku: nic nie pobrano.', 'err');
  downloadText('flipster-probka-rynku.json', JSON.stringify(out), 'application/json');
  ui.log(`Próbka rynku: zapisano ${out.items.length} przedmiotów do pliku flipster-probka-rynku.json. Daj znać, że plik jest gotowy.`, 'ok');
}
