// "Dane do analizy": the order book and the full price history of a list of items, saved to a JSON file the user
// hands over for analysis. Read only, nothing is bought or listed; the file holds public market data and the fee
// settings, nothing about the account. Used from Okazje, Ekwipunek and both Rynek sub-tabs.
import * as ui from '../core/ui.js';
import * as steam from '../core/steam.js';
import * as prices from '../core/prices.js';
import { downloadText } from '../core/util.js';
import { token } from '../core/jobs.js';

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
