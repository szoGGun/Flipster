import * as ui from '../core/ui.js';
import * as store from '../core/store.js';
import { settings, DEFAULT_SETTINGS } from '../core/store.js';
import * as steam from '../core/steam.js';
import { toInput, parsePrice, downloadText } from '../core/util.js';
import * as disk from '../core/cache.js';
import { parseUser, starterSummary } from '../core/patterns.js';
import * as patterndb from './patterndb.js';
import { esc } from '../core/util.js';

// + planned sales, 📌 marks and the amounts typed in for terminals: things you set yourself and Steam can't give back
const BACKUP_KEYS = ['settings', 'sellRules', 'buyRules', 'watchlist', 'trades', 'itemMeta', 'nameids', 'sellPlans', 'invSellWatch', 'termPaid', 'flipHidden', 'patternsUser'];

export function mount(root) {
  const c = steam.ctx();
  // one card per topic; each row = name and one short line of explanation on the left, the control on the right
  const tg = (k) => `<label class="tgl"><input type="checkbox" data-k="${k}" ${settings[k] ? 'checked' : ''}><span class="tr"></span></label>`;
  const row = (t, d, ctl = '') => `<div class="set-row"><div class="txt"><div class="t">${t}</div>${d ? `<div class="d">${d}</div>` : ''}</div>${ctl ? `<div class="ctl">${ctl}</div>` : ''}</div>`;
  const famous = starterSummary().join('\n') + '\n\nŹródła: csdb.gg, csgoskins.gg, skinscanner.gg';
  const lanes = Object.entries(steam.laneStats()).map(([k, v]) => `${{ hist: 'ceny/zlecenia', price: 'wolumen', inv: 'ekwipunek', market: 'oferty/historia', page: 'strony', search: 'wyszukiwarka' }[k] || k} co ${(v / 1000).toFixed(1).replace('.', ',')} s`).join(' · ');
  root.innerHTML = `
    <style>
      #stt .set{padding:12px 14px 24px;display:flex;flex-direction:column;gap:12px}
      #stt .set-sec{background:var(--bg2);border:1px solid #22303f;border-radius:8px;padding:2px 18px}
      #stt .set-sec h3,#stt .set-sec>summary{margin:14px 0 4px;font-size:11px;letter-spacing:.07em;text-transform:uppercase;color:var(--mut);font-weight:600}
      #stt .set-sec>summary{cursor:pointer;margin:0;padding:14px 0}
      #stt .set-sec[open]>summary{padding-bottom:4px}
      #stt .set-sec .intro{font-size:12px;color:var(--mut);line-height:1.5;margin:0 0 4px}
      #stt .set-row{display:flex;align-items:center;gap:28px;padding:13px 0;border-top:1px solid #22303f}
      #stt .set-sec h3+.set-row,#stt .set-sec>summary+.set-row{border-top:0}
      #stt .set-row .txt{flex:1;min-width:0}
      #stt .set-row .t{color:#fff;font-size:13px}
      #stt .set-row .d{color:var(--mut);font-size:12px;line-height:1.45;margin-top:3px;max-width:1000px}
      #stt .set-row .ctl{flex:none;display:flex;gap:8px;align-items:center;color:var(--mut)}
      #stt .set-row.col{flex-direction:column;align-items:stretch;gap:8px}
      #stt .set .mono{font-family:Consolas,monospace;color:var(--tx)}
      #stt .set .hint{border-bottom:1px dotted;cursor:help}
      #stt .set .unit{display:inline-block;width:26px}
    </style>
    <div class="set">
    <div class="set-sec">
      <h3>Ekwipunek</h3>
      ${row('Ceny i float na stronie ekwipunku Steam', 'Na zwykłej stronie ekwipunku, poza oknem Flipstera, każdy przedmiot pokazuje swoją cenę na rynku i float.', tg('badges'))}
      ${row('Próg znaczków sprzedaży', 'Od jakiej zmiany ceny przedmioty w zakładce Ekwipunek dostają znaczki „z zyskiem”, „drogo teraz” i „cena spada”. Wyższy próg to mniej znaczków.',
        `<input type="number" min="1" max="100" step="1" data-k="sellSignalPct" value="${settings.sellSignalPct}" style="width:72px"><span class="unit">%</span>`)}
    </div>

    <div class="set-sec">
      <h3>💎 Rzadkie wzory</h3>
      <div class="intro">Przedmioty z rzadkim, cenionym wzorem (seedem) dostają ramkę i znaczek 💎 w Ekwipunku, w Rynku i przy sprawdzaniu floatu. Strony o wzorach nie zawsze się zgadzają, więc 💎 znaczy „obejrzyj dokładniej”.</div>
      ${row('Baza społeczności <a class="acc" href="https://github.com/Helyux/cs2pattern" target="_blank" rel="noopener">cs2pattern</a>',
        `<span id="st-patdb">…</span> Do tego Flipster zna <span class="hint" title="${esc(famous)}">kilka słynnych wzorów</span> sprawdzonych ręcznie.`,
        '<button class="b" data-a="patdb">odśwież</button>')}
      <div class="set-row col">
        <div class="txt"><div class="t">Własne wzory</div><div class="d">Jeden skin w linii, np. <span class="mono">AK-47 | Case Hardened: 661, 670 = blue gem</span>. Zakres seedów wpisz jak 100-110, a opis po znaku = możesz pominąć.</div></div>
        <textarea id="st-pat" rows="4" spellcheck="false" style="width:100%;box-sizing:border-box;font-family:Consolas,monospace;font-size:12px" placeholder="AK-47 | Case Hardened: 661, 670, 955 = blue gem&#10;Butterfly Knife | Case Hardened: 3, 13-15 = do sprawdzenia">${esc(store.get('patternsUser', '') || '')}</textarea>
        <div class="d" id="st-patinfo" style="margin:0"></div>
      </div>
    </div>

    <div class="set-sec dbg">
      <h3>Zapytania do Steama</h3>
      <div class="set-row col">
        <div class="txt"><div class="d">Ile zapytań Flipster wysłał (wszystkie otwarte karty razem) i ile razy Steam odpowiedział „za dużo zapytań” (429). Tylko pomiar, nic nie zmienia. <button class="b s" data-a="reqstats">odśwież</button></div></div>
        <div id="st-req"></div>
      </div>
    </div>

    <div class="set-sec">
      <h3>Kopia zapasowa</h3>
      ${row('Kopia w pliku', 'Ustawienia, ceny min/max, obserwowane i przypięte 📌 przedmioty, zapisane wymiany, kwoty z terminali i Twoje wzory. Przyda się przy zmianie komputera albo przeglądarki.',
        '<button class="b" data-a="export">Zapisz</button><button class="b" data-a="import">Wczytaj</button><input type="file" accept=".json" id="st-imp" hidden>')}
    </div>

    <details class="set-sec">
      <summary>Zaawansowane</summary>
      ${row('Dziennik na dole okna', 'Komunikaty o tym, co Flipster robi. Gdy jest wyłączony, błędy pokażą się na chwilę w pasku pod oknem.', tg('showLog'))}
      ${row('Tryb debugowania', 'Przyciski do zbierania danych do analizy, licznik zapytań do Steama i numer wersji w nagłówku.', tg('debug'))}
      ${row('Przerwa między kolejnymi ofertami', 'Przy wystawianiu lub zdejmowaniu kilku ofert naraz. Krótsza jest szybsza, ale Steam może zacząć odrzucać zapytania.',
        `<input type="number" min="300" step="100" data-k="delay" value="${settings.delay}" style="width:72px"><span class="unit">ms</span>`)}
      ${row('Pamiętaj ceny z rynku', 'Przez tyle minut Flipster nie pyta Steama drugi raz o ten sam przedmiot. Twoje oferty, ekwipunek i saldo są zawsze świeże. 0 wyłącza.',
        `<input type="number" min="0" max="60" data-k="cacheMin" data-zero value="${settings.cacheMin}" style="width:72px"><span class="unit">min</span>`)}
      ${row('Tempo zapytań do Steama', `Flipster sam zwalnia, gdy Steam odrzuca zapytania. Kliknij, jeśli od dawna wszystko działa bardzo wolno.<span class="dbg"> Teraz ${lanes}.</span>`,
        '<button class="b" data-a="resetlanes">zacznij od nowa</button>')}
      ${row('Zapamiętane ceny', 'Usuwa zapisane ceny i dane rynku, gdy coś wygląda na nieaktualne.', '<button class="b" data-a="clearprices">wyczyść</button>')}
      ${row('Ustawienia domyślne', 'Przywraca ustawienia z tej zakładki. Ceny min/max, obserwowane i historia zostają.', '<button class="b red" data-a="reset">przywróć</button>')}
      ${row('Konto i prowizja', `Konto ${c.steamId || 'niezalogowane'}. Przy sprzedaży Steam bierze ${(c.wallet.feePercent * 100).toFixed(0)}% (najmniej ${steam.fmt(c.wallet.feeMin)}${c.wallet.feeBase ? ` plus ${steam.fmt(c.wallet.feeBase)}` : ''}), a gra ${(c.wallet.pubDefault * 100).toFixed(0)}%, więc żebyś dostał 0,30 zł, kupujący płaci ${steam.fmt(steam.buyerFromReceived(30))}. Automaty działają tylko w jednej otwartej karcie Steam naraz.<span class="dbg"> Waluta ID ${c.wallet.currency}.</span>`)}
    </details>
    </div>`;

  root.addEventListener('change', (e) => {
    const k = e.target.dataset.k;
    if (!k) return;
    let v = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    if (e.target.dataset.price != null) { v = parsePrice(v); if (isNaN(v)) v = DEFAULT_SETTINGS[k]; e.target.value = toInput(v); }
    else if (e.target.dataset.pct != null) v = (+v || 0) / 100;
    else if (e.target.type === 'number' && e.target.dataset.zero != null && String(v).trim() !== '') v = Math.max(0, +v || 0); // 0 is a real value here
    else if (e.target.type === 'number') v = +v || DEFAULT_SETTINGS[k];
    settings[k] = v;
    if (k === 'debug' || k === 'showLog') ui.applyPrefs();
    ui.log(`Zapisano: ${k}`, 'ok');
  });
  // your pattern list: checked as you type, saved on leaving the field (lines with mistakes are named, the rest works)
  const patInfo = () => {
    const { entries, errors } = parseUser(root.querySelector('#st-pat').value);
    const n = entries.reduce((s, e) => s + e.tiers[0].seeds.length, 0);
    root.querySelector('#st-patinfo').innerHTML = (entries.length ? `Twoja lista: ${entries.length} skin(y), ${n} seedów.` : 'Twoja lista jest pusta.')
      + (errors.length ? ` <span class="err">Nie rozumiem linii: ${errors.join(', ')} (wzór: nazwa: 1, 2, 10-20 = opis)</span>` : '');
  };
  patInfo();
  // the downloaded community catalog: how much it knows and when it came
  const dbInfo = () => {
    const i = patterndb.info();
    root.querySelector('#st-patdb').innerHTML = i ? `${i.seeds} seedów dla ${i.skins} skinów, pobrana ${new Date(i.at).toLocaleDateString()}, odświeża się sama co tydzień.` : patterndb.error() ? `<span class="err">Nie udało się jej pobrać (${esc(patterndb.error())}).</span>` : 'pobieram…';
  };
  dbInfo();
  patterndb.load().then(dbInfo);
  reqInfo(root);
  root.querySelector('#st-pat').addEventListener('input', patInfo);
  root.querySelector('#st-pat').addEventListener('change', (e) => { e.stopPropagation(); store.set('patternsUser', e.target.value); patInfo(); ui.log('Zapisano listę wzorów.', 'ok'); });
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
    if (a === 'import') root.querySelector('#st-imp').click();
    if (a === 'reqstats') reqInfo(root);
    if (a === 'patdb') {
      root.querySelector('#st-patdb').textContent = 'pobieram…';
      const fresh = await patterndb.load({ force: true });
      dbInfo();
      ui.log(fresh ? 'Pobrano bazę rzadkich wzorów.' : `Bazy wzorów nie udało się pobrać${patterndb.error() ? ': ' + patterndb.error() : ''}.`, fresh ? 'ok' : 'warn');
    }
    if (a === 'resetlanes') { store.del('lanes'); ui.log('Zresetowano tempo zapytań, skrypt nauczy się go od nowa.', 'ok'); }
    if (a === 'clearprices') { store.del('prices'); store.del('skinport'); store.del('flipRows'); /* 'skinport': data saved by older builds */ await disk.clear(); ui.log('Wyczyszczono zapamiętane ceny i dane rynku. Odśwież stronę.', 'ok'); }
    if (a === 'reset' && (await ui.ask('Reset ustawień', 'Przywrócić domyślne ustawienia? Reguły cen, obserwowane i historia zostaną.', { ok: 'Przywróć', danger: true }))) {
      store.set('settings', {});
      ui.log('Przywrócono domyślne. Odśwież stronę.', 'ok');
    }
  });
}

// ---------------------------------------------------------------- the request counter (steam.requestStats)
const LANE_NAMES = {
  hist: 'księgi zleceń (ceny, konkurencja, 📌)', market: 'Twoje oferty, historia, historie cen', price: 'obrót z 24 h',
  inv: 'ekwipunek', page: 'strony przedmiotów', search: 'wyszukiwarka rynku (skaner, skrzynie)', write: 'wystawianie, zdejmowanie, zlecenia',
};
function reqInfo(root) {
  const box = root.querySelector('#st-req');
  if (!box) return;
  const s = steam.requestStats();
  const lanes = [...new Set([...Object.keys(s.day), ...Object.keys(s.hour)].filter((k) => k.startsWith('lane:')).map((k) => k.slice(5)))];
  if (!lanes.length) { box.innerHTML = '<span class="sub" style="margin:0">Jeszcze nic nie policzone (licznik działa od tej wersji).</span>'; return; }
  const n = (o, k) => o[k] || 0;
  lanes.sort((a, b) => n(s.day, 'lane:' + b) - n(s.day, 'lane:' + a));
  const tot = (o) => Object.entries(o).filter(([k]) => k.startsWith('lane:')).reduce((q, [, v]) => q + v, 0);
  const t429 = (o) => Object.entries(o).filter(([k]) => k.startsWith('429:')).reduce((q, [, v]) => q + v, 0);
  const urls = Object.entries(s.day).filter(([k]) => k.startsWith('url:')).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const hh = new Date(s.since).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  box.innerHTML = `<table><tr><th>Rodzaj</th><th>od ${hh}</th><th>ostatnie 24 h</th><th>429 (24 h)</th></tr>
    ${lanes.map((l) => `<tr><td>${esc(LANE_NAMES[l] || l)}</td><td>${n(s.hour, 'lane:' + l)}</td><td>${n(s.day, 'lane:' + l)}</td><td class="${n(s.day, '429:' + l) ? 'warn' : ''}">${n(s.day, '429:' + l)}</td></tr>`).join('')}
    <tr><td><b>razem</b></td><td><b>${tot(s.hour)}</b></td><td><b>${tot(s.day)}</b></td><td><b class="${t429(s.day) ? 'warn' : ''}">${t429(s.day)}</b></td></tr></table>
    ${urls.length ? `<div class="sub" style="margin:6px 0 0">Najczęstsze adresy (24 h): ${urls.map(([k, v]) => `${esc(k.slice(4))} ${v}`).join(' · ')}</div>` : ''}`;
}
