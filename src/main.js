import * as ui from './core/ui.js';
import * as steam from './core/steam.js';
import * as prices from './core/prices.js';
import { settings } from './core/store.js';
import * as store from './core/store.js';
import { startLeaderElection, isLeader } from './core/jobs.js';
import * as listings from './features/listings.js';
import * as buyorders from './features/buyorders.js';
import * as inventory from './features/inventory.js';
import * as history from './features/history.js';
import * as flip from './features/flip.js';
import * as cases from './features/cases.js';
import * as trade from './features/trade.js';
import * as settingsTab from './features/settings.js';
import * as sellsignals from './features/sellsignals.js';

function main() {
  if (window.top !== window.self) return;
  ui.init();
  const c = steam.ctx();

  // one "Rynek" tab with two sub-tabs (my sell listings / my buy orders), each keeps its own toolbar
  let market = null;
  ui.tab({
    id: 'market',
    title: 'Rynek',
    mount(root) {
      root.innerHTML = `
        <div class="htabs" style="margin-top:0">
          <button data-mt="sell">Moje oferty <span class="cnt"></span></button>
          <button data-mt="buy">Zlecenia kupna <span class="cnt"></span></button>
        </div>
        <div data-sec="sell"></div><div data-sec="buy"></div>`;
      const showSub = (t) => {
        store.set('marketTab', t);
        root.querySelectorAll('[data-mt]').forEach((b) => b.classList.toggle('on', b.dataset.mt === t));
        root.querySelectorAll('[data-sec]').forEach((d) => (d.hidden = d.dataset.sec !== t));
      };
      root.querySelector('.htabs').addEventListener('click', (e) => { const b = e.target.closest('[data-mt]'); if (b) showSub(b.dataset.mt); });
      market = { showSub };
      listings.mount(root.querySelector('[data-sec="sell"]'));
      buyorders.mount(root.querySelector('[data-sec="buy"]'));
      showSub(store.get('marketTab', 'sell'));
    },
    show() { listings.show(); buyorders.show(); },
  });
  ui.tab({ id: 'inv', title: 'Ekwipunek', mount: inventory.mount, show: inventory.show });
  ui.tab({ id: 'hist', title: 'Historia', mount: history.mount, show: history.show });
  ui.tab({ id: 'flip', title: 'Okazje', mount: flip.mount, show: flip.show });
  ui.tab({ id: 'cases', title: 'Czy warto otwierać?', mount: cases.mount, show: cases.show });
  ui.tab({ id: 'set', title: 'Ustawienia', icon: '⚙', mount: settingsTab.mount });

  flip.setBuyOrderOpener((hash, price, appid) => {
    ui.open('market');
    buyorders.prefill(hash, price, appid);
    market?.showSub('buy');
  });

  steam.bus.on('ratelimit', (lane, ms) => ui.log(`Steam ogranicza zapytania (${lane}), czekam ${Math.round(ms / 1000)} s…`, 'warn'));

  steam.ensureLogin().then((ok) => { if (!ok) ui.log('Nie wykryto zalogowania, większość funkcji wymaga zalogowania na steamcommunity.com.', 'warn'); });

  const refreshFab = () => {
    const on = (settings.autoRelist || settings.autoBuy) && isLeader();
    ui.fab(on, on ? 'auto' : '');
  };
  startLeaderElection(refreshFab);
  inventory.startSellPlans(); // planned sales of trade-locked items, whichever tab is open
  setInterval(refreshFab, 5000);

  prices.pruneCache();
  sellsignals.prune();
  inventory.initBadges();
  trade.init();
}

try { main(); } catch (e) { console.error('[Flipster]', e); }

console.info('[Flipster] build', typeof __BUILD__ !== 'undefined' ? __BUILD__ : '?');
