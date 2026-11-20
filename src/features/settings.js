import * as ui from '../core/ui.js';
import * as store from '../core/store.js';
import { settings, DEFAULT_SETTINGS } from '../core/store.js';
import * as steam from '../core/steam.js';
import { toInput, parsePrice, downloadText } from '../core/util.js';
import * as disk from '../core/cache.js';

const BACKUP_KEYS = ['settings', 'sellRules', 'buyRules', 'watchlist', 'trades', 'itemMeta', 'nameids'];

export function mount(root) {
  const c = steam.ctx();
  root.innerHTML = `
    <style>
      #stt .set-sec{padding:12px 14px;border-bottom:1px solid #22303f}
      #stt .set-sec h3{margin:0 0 8px;font-size:13px;color:#c6d4df;font-weight:600}
      #stt .set-sec label.ck{display:flex;gap:8px;align-items:center;margin:4px 0}
      #stt .set-sec .sub{margin-left:24px}
    </style>
    <div class="set-sec">
      <h3>Ekwipunek Steam</h3>
      <label class="ck"><input type="checkbox" data-k="badges" ${settings.badges ? 'checked' : ''}> Pokazuj cenę i float na przedmiotach w zwykłym ekwipunku Steam</label>
      <label class="ck">Znaczki „z zyskiem” / „drogo teraz” / „cena spada” od <input type="number" min="1" max="100" step="1" data-k="sellSignalPct" value="${settings.sellSignalPct}" style="width:60px"> %</label>
    </div>
    <div class="set-sec">
      <h3>Kopia zapasowa</h3>
      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
        <button class="b" data-a="export">Zapisz kopię do pliku</button>
        <label class="b" style="display:inline-block;cursor:pointer">Wczytaj kopię z pliku<input type="file" accept=".json" id="st-imp" hidden></label>
        <span class="sub" style="margin:0">ceny min/max, obserwowane przedmioty, historia transakcji, ustawienia</span>
      </div>
    </div>
    <details class="set-sec" style="padding:12px 14px">
      <summary>Zaawansowane</summary>
      <div class="row2" style="padding:10px 0 0">
        <label>Odstęp między wystawieniem / zdjęciem kolejnych ofert (ms)<input type="number" min="300" step="100" data-k="delay" value="${settings.delay}" style="width:90px"></label>
        <label title="Ceny i dane rynku (księgi zleceń, historie cen, obrót z 24 h, listy ze skanera i skrzyń) są przez tyle minut brane z pamięci zamiast ze Steama, także po odświeżeniu strony i w innych kartach. Twoje oferty, zlecenia, ekwipunek i saldo są zawsze pobierane na świeżo. Najwyżej 60; 0 wyłącza.">Jak długo pamiętać ceny i dane rynku (min, 0 = wyłącz)<input type="number" min="0" max="60" data-k="cacheMin" data-zero value="${settings.cacheMin}" style="width:80px"></label>
      </div>
      <div class="note" style="padding:8px 0">
        Konto: <b>${c.steamId || 'niezalogowany'}</b> · waluta ID ${c.wallet.currency} · prowizja Steam ${(c.wallet.feePercent * 100).toFixed(0)}% (min. ${steam.fmt(c.wallet.feeMin)}${c.wallet.feeBase ? ` + ${steam.fmt(c.wallet.feeBase)}` : ''}) + gra ${(c.wallet.pubDefault * 100).toFixed(0)}% · np. dostaniesz 0,30 zł → kupujący płaci ${steam.fmt(steam.buyerFromReceived(30))}<br>
        Tempo zapytań do Steama (dopasowuje się samo): ${Object.entries(steam.laneStats()).map(([k, v]) => `${{ hist: 'ceny/zlecenia', price: 'wolumen', inv: 'ekwipunek', market: 'oferty/historia', page: 'strony', search: 'wyszukiwarka' }[k] || k} co ${(v / 1000).toFixed(1).replace('.', ',')} s`).join(' · ')}
        <button class="b s" data-a="resetlanes">reset tempa</button><br>
        Automaty (auto-relist, auto-przebijanie) działają tylko w jednej otwartej karcie Steam naraz.
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="b" data-a="clearprices">Wyczyść zapamiętane ceny</button>
        <button class="b red" data-a="reset">Przywróć domyślne ustawienia</button>
      </div>
    </details>`;

  root.addEventListener('change', (e) => {
    const k = e.target.dataset.k;
    if (!k) return;
    let v = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    if (e.target.dataset.price != null) { v = parsePrice(v); if (isNaN(v)) v = DEFAULT_SETTINGS[k]; e.target.value = toInput(v); }
    else if (e.target.dataset.pct != null) v = (+v || 0) / 100;
    else if (e.target.type === 'number' && e.target.dataset.zero != null && String(v).trim() !== '') v = Math.max(0, +v || 0); // 0 is a real value here
    else if (e.target.type === 'number') v = +v || DEFAULT_SETTINGS[k];
    settings[k] = v;
    ui.log(`Zapisano: ${k}`, 'ok');
  });
  root.querySelector('#st-imp').onchange = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    try {
      const data = JSON.parse(await f.text());
      for (const k of BACKUP_KEYS) if (data[k] !== undefined) store.set(k, data[k]);
      ui.log('Zaimportowano kopię. Odśwież stronę.', 'ok');
    } catch (err) { ui.log('Import nieudany: ' + err.message, 'err'); }
  };
  root.addEventListener('click', async (e) => {
    const a = e.target.closest('button')?.dataset.a;
    if (a === 'export') {
      const data = Object.fromEntries(BACKUP_KEYS.map((k) => [k, store.get(k, null)]));
      downloadText(`flipster-backup-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(data), 'application/json');
    }
    if (a === 'resetlanes') { store.del('lanes'); ui.log('Zresetowano tempo zapytań, skrypt nauczy się go od nowa.', 'ok'); }
    if (a === 'clearprices') { store.del('prices'); store.del('skinport'); store.del('flipRows'); /* 'skinport': data saved by older builds */ await disk.clear(); ui.log('Wyczyszczono zapamiętane ceny i dane rynku. Odśwież stronę.', 'ok'); }
    if (a === 'reset' && (await ui.ask('Reset ustawień', 'Przywrócić domyślne ustawienia? Reguły cen, obserwowane i historia zostaną.', { ok: 'Przywróć', danger: true }))) {
      store.set('settings', {});
      ui.log('Przywrócono domyślne. Odśwież stronę.', 'ok');
    }
  });
}
