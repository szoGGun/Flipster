import * as ui from '../core/ui.js';
import * as store from '../core/store.js';
import { settings, DEFAULT_SETTINGS } from '../core/store.js';
import * as steam from '../core/steam.js';
import { toInput, parsePrice, downloadText } from '../core/util.js';
import * as disk from '../core/cache.js';
import { parseUser, starterSummary } from '../core/patterns.js';
import * as patterndb from './patterndb.js';
import { esc } from '../core/util.js';
import { L } from '../core/i18n.js';

// + planned sales, 📌 marks and the amounts typed in for terminals: things you set yourself and Steam can't give back
const BACKUP_KEYS = ['settings', 'sellRules', 'buyRules', 'watchlist', 'trades', 'itemMeta', 'nameids', 'sellPlans', 'invSellWatch', 'termPaid', 'flipHidden', 'patternsUser'];

export function mount(root) {
  const c = steam.ctx();
  // one card per topic; each row = name and one short line of explanation on the left, the control on the right
  const tg = (k) => `<label class="tgl"><input type="checkbox" data-k="${k}" ${settings[k] ? 'checked' : ''}><span class="tr"></span></label>`;
  const row = (t, d, ctl = '') => `<div class="set-row"><div class="txt"><div class="t">${t}</div>${d ? `<div class="d">${d}</div>` : ''}</div>${ctl ? `<div class="ctl">${ctl}</div>` : ''}</div>`;
  const famous = starterSummary().join('\n') + '\n\n' + L('settings.sources') + ': csdb.gg, csgoskins.gg, skinscanner.gg';
  const lanes = Object.entries(steam.laneStats()).map(([k, v]) => `${{ hist: L('settings.pricesOrders'), price: L('settings.volume'), inv: L('settings.inventory'), market: L('settings.listingsHistory'), page: L('settings.pages'), search: L('settings.search'), quote: L('settings.quickPrices') }[k] || k} ${L('settings.every')} ${(v / 1000).toFixed(1).replace('.', ',')} s`).join(' · ');
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
      <h3>${L('settings.general')}</h3>
      ${row(L('settings.language'), L('settings.automaticFollowsYourBrowserPolish'),
        `<select data-k="lang">${[['auto', L('settings.automatic')], ['en', 'English'], ['pl', 'Polski']].map(([v, t]) => `<option value="${v}" ${(settings.lang || 'auto') === v ? 'selected' : ''}>${t}</option>`).join('')}</select>`)}
    </div>
    <div class="set-sec">
      <h3>${L('settings.inventory2')}</h3>
      ${row(L('settings.pricesAndFloatOnThe'), L('settings.onTheRegularInventoryPage'), tg('badges'))}
      ${row(L('settings.sellBadgeThreshold'), L('settings.howBigAPriceChange'),
        `<input type="number" min="1" max="100" step="1" data-k="sellSignalPct" value="${settings.sellSignalPct}" style="width:72px"><span class="unit">%</span>`)}
    </div>

    <div class="set-sec">
      <h3>💎 ${L('settings.rarePatterns')}</h3>
      <div class="intro">${L('settings.itemsWithARareSought')}</div>
      ${row(L('settings.communityDatabaseCs2pattern'),
        `<span id="st-patdb">…</span> ${L('settings.flipsterAlsoKnowsAFew', { famous: esc(famous) })}`,
        `<button class="b" data-a="patdb">${L('settings.refresh')}</button>`)}
      <div class="set-row col">
        <div class="txt"><div class="t">${L('settings.yourOwnPatterns')}</div><div class="d">${L('settings.oneSkinPerLineE')} <span class="mono">AK-47 | Case Hardened: 661, 670 = blue gem</span>. ${L('settings.writeASeedRangeLike')}</div></div>
        <textarea id="st-pat" rows="4" spellcheck="false" style="width:100%;box-sizing:border-box;font-family:Consolas,monospace;font-size:12px" placeholder="AK-47 | Case Hardened: 661, 670, 955 = blue gem&#10;Butterfly Knife | Case Hardened: 3, 13-15 = ${L('settings.toCheck')}">${esc(store.get('patternsUser', '') || '')}</textarea>
        <div class="d" id="st-patinfo" style="margin:0"></div>
      </div>
    </div>

    <div class="set-sec dbg">
      <h3>${L('settings.requestsToSteam')}</h3>
      <div class="set-row col">
        <div class="txt"><div class="d">${L('settings.howManyRequestsFlipsterSent')} <button class="b s" data-a="reqstats">${L('settings.refresh')}</button></div></div>
        <div id="st-req"></div>
      </div>
    </div>

    <div class="set-sec">
      <h3>${L('settings.backup')}</h3>
      ${row(L('settings.backupFile'), L('settings.settingsMinMaxPricesWatched'),
        `<button class="b" data-a="export">${L('settings.save')}</button><button class="b" data-a="import">${L('settings.load')}</button><input type="file" accept=".json" id="st-imp" hidden>`)}
    </div>

    <details class="set-sec">
      <summary>${L('settings.advanced')}</summary>
      ${row(L('settings.logAtTheBottomOf'), L('settings.messagesAboutWhatFlipsterIs'), tg('showLog'))}
      ${row(L('settings.debugMode'), L('settings.buttonsForCollectingDataFor'), tg('debug'))}
      ${row(L('settings.pauseBetweenListings'), L('settings.whenYouListOrRemove'),
        `<input type="number" min="300" step="100" data-k="delay" value="${settings.delay}" style="width:72px"><span class="unit">ms</span>`)}
      ${row(L('settings.rememberMarketPrices'), L('settings.forThisManyMinutesFlipster'),
        `<input type="number" min="0" max="60" data-k="cacheMin" data-zero value="${settings.cacheMin}" style="width:72px"><span class="unit">min</span>`)}
      ${row(L('settings.steamRequestPace'), L('settings.flipsterSlowsDownByItself') + `<span class="dbg"> ${L('settings.now')} ${lanes}.</span>`,
        `<button class="b" data-a="resetlanes">${L('settings.startOver')}</button>`)}
      ${row(L('settings.rememberedPrices'), L('settings.removesSavedPricesAndMarket'), `<button class="b" data-a="clearprices">${L('settings.clear')}</button>`)}
      ${row(L('settings.defaultSettings'), L('settings.restoresTheSettingsInThis'), `<button class="b red" data-a="reset">${L('settings.restore')}</button>`)}
      ${row(L('settings.accountAndFee'), L('settings.accountOnASaleSteam', { feePercent: (c.wallet.feePercent * 100).toFixed(0), feeMin: steam.fmt(c.wallet.feeMin), feeBase: c.wallet.feeBase ? ` plus ${steam.fmt(c.wallet.feeBase)}` : '', pubDefault: (c.wallet.pubDefault * 100).toFixed(0), steam: steam.fmt(30), steam2: steam.fmt(steam.buyerFromReceived(30)), currency: c.wallet.currency, steamId: c.steamId || L('settings.notLoggedIn') }))}
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
    if (k === 'lang') { location.reload(); return; } // labels are built once per page load in the chosen language
    if (k === 'debug' || k === 'showLog') ui.applyPrefs();
    ui.log(L('settings.saved', { k }), 'ok');
  });
  // your pattern list: checked as you type, saved on leaving the field (lines with mistakes are named, the rest works)
  const patInfo = () => {
    const { entries, errors } = parseUser(root.querySelector('#st-pat').value);
    const n = entries.reduce((s, e) => s + e.tiers[0].seeds.length, 0);
    root.querySelector('#st-patinfo').innerHTML = (entries.length ? L('settings.yourListHasSkinS', { entries: entries.length, n }) : L('settings.yourListIsEmpty'))
      + (errors.length ? ` <span class="err">${L('settings.cantReadLineSThe', { errors: errors.join(', ') })}</span>` : '');
  };
  patInfo();
  // the downloaded community catalog: how much it knows and when it came
  const dbInfo = () => {
    const i = patterndb.info();
    root.querySelector('#st-patdb').innerHTML = i ? L('settings.seedsForSkinsDownloadedRefreshes', { seeds: i.seeds, skins: i.skins, at: new Date(i.at).toLocaleDateString() }) : patterndb.error() ? `<span class="err">${L('settings.couldntDownloadIt')} (${esc(patterndb.error())}).</span>` : L('settings.downloading');
  };
  dbInfo();
  patterndb.load().then(dbInfo);
  reqInfo(root);
  root.querySelector('#st-pat').addEventListener('input', patInfo);
  root.querySelector('#st-pat').addEventListener('change', (e) => { e.stopPropagation(); store.set('patternsUser', e.target.value); patInfo(); ui.log(L('settings.savedThePatternList'), 'ok'); });
  root.querySelector('#st-imp').onchange = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    try {
      const data = JSON.parse(await f.text());
      for (const k of BACKUP_KEYS) if (data[k] !== undefined) store.set(k, data[k]);
      ui.log(L('settings.backupLoadedReloadThePage'), 'ok');
    } catch (err) { ui.log(L('settings.loadingTheBackupFailed') + err.message, 'err'); }
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
      root.querySelector('#st-patdb').textContent = L('settings.downloading');
      const fresh = await patterndb.load({ force: true });
      dbInfo();
      ui.log(fresh ? L('settings.downloadedTheRarePatternDatabase') : L('settings.couldntDownloadThePatternDatabase') + `${patterndb.error() ? ': ' + patterndb.error() : ''}.`, fresh ? 'ok' : 'warn');
    }
    if (a === 'resetlanes') { store.del('lanes'); ui.log(L('settings.requestPaceResetTheScript'), 'ok'); }
    if (a === 'clearprices') { store.del('prices'); store.del('skinport'); store.del('flipRows'); /* 'skinport': data saved by older builds */ await disk.clear(); ui.log(L('settings.clearedRememberedPricesAndMarket'), 'ok'); }
    if (a === 'reset' && (await ui.ask(L('settings.resetSettings'), L('settings.restoreTheDefaultSettingsPrice'), { ok: L('settings.restore2'), danger: true }))) {
      store.set('settings', {});
      ui.log(L('settings.defaultsRestoredReloadThePage'), 'ok');
    }
  });
}

// ---------------------------------------------------------------- the request counter (steam.requestStats)
const LANE_NAMES = {
  hist: L('settings.orderBooksPricesCompetition'), market: L('settings.yourListingsHistoryPriceHistories'), price: L('settings.24HVolume'),
  inv: L('settings.inventory'), page: L('settings.itemPages'), search: L('settings.marketSearchScannerCases'), quote: L('settings.quickPriceCheck'), write: L('settings.listingRemovingOrders'),
};
function reqInfo(root) {
  const box = root.querySelector('#st-req');
  if (!box) return;
  const s = steam.requestStats();
  const lanes = [...new Set([...Object.keys(s.day), ...Object.keys(s.hour)].filter((k) => k.startsWith('lane:')).map((k) => k.slice(5)))];
  if (!lanes.length) { box.innerHTML = `<span class="sub" style="margin:0">${L('settings.nothingCountedYet')}</span>`; return; }
  const n = (o, k) => o[k] || 0;
  lanes.sort((a, b) => n(s.day, 'lane:' + b) - n(s.day, 'lane:' + a));
  const tot = (o) => Object.entries(o).filter(([k]) => k.startsWith('lane:')).reduce((q, [, v]) => q + v, 0);
  const t429 = (o) => Object.entries(o).filter(([k]) => k.startsWith('429:')).reduce((q, [, v]) => q + v, 0);
  const urls = Object.entries(s.day).filter(([k]) => k.startsWith('url:')).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const hh = new Date(s.since).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  box.innerHTML = `<table><tr><th>${L('settings.kind')}</th><th>${L('settings.since')} ${hh}</th><th>${L('settings.last24H')}</th><th>429 (24 h)</th></tr>
    ${lanes.map((l) => `<tr><td>${esc(LANE_NAMES[l] || l)}</td><td>${n(s.hour, 'lane:' + l)}</td><td>${n(s.day, 'lane:' + l)}</td><td class="${n(s.day, '429:' + l) ? 'warn' : ''}">${n(s.day, '429:' + l)}</td></tr>`).join('')}
    <tr><td><b>${L('settings.total')}</b></td><td><b>${tot(s.hour)}</b></td><td><b>${tot(s.day)}</b></td><td><b class="${t429(s.day) ? 'warn' : ''}">${t429(s.day)}</b></td></tr></table>
    ${urls.length ? `<div class="sub" style="margin:6px 0 0">${L('settings.mostFrequentUrls')} (24 h): ${urls.map(([k, v]) => `${esc(k.slice(4))} ${v}`).join(' · ')}</div>` : ''}`;
}
