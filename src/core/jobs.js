import * as store from './store.js';
import { sleep } from './util.js';

// ---------------------------------------------------------------- mutex for write operations
// (the name only documents what the lock is taken for)
let chain = Promise.resolve();
export function withLock(name, fn) {
  const p = chain.then(() => fn());
  chain = p.catch(() => {});
  return p;
}

// ---------------------------------------------------------------- cancellable task token
export function token() {
  let c = false;
  return { cancel: () => (c = true), get cancelled() { return c; } };
}

// ---------------------------------------------------------------- one tab runs the background automations
const TAB_ID = Math.random().toString(36).slice(2);
const STALE = 45000;
let leader = false;

export function isLeader() { return leader; }

export function startLeaderElection(onChange) {
  const tick = () => {
    const cur = store.get('leader', null);
    const now = Date.now();
    const mine = cur?.id === TAB_ID;
    if (!cur || mine || now - cur.at > STALE) {
      store.set('leader', { id: TAB_ID, at: now });
      if (!leader) { leader = true; onChange?.(true); }
    } else if (leader) {
      leader = false;
      onChange?.(false);
    }
  };
  tick();
  setInterval(tick, 15000);
  window.addEventListener('beforeunload', () => {
    if (leader) store.set('leader', null);
  });
}

/** run fn every `minutes()` while enabled() and leader; returns {next, runNow} */
export function every(name, minutes, enabled, fn, onState) {
  let next = Date.now() + 15000;
  let runningNow = false;
  const loop = async () => {
    for (;;) {
      await sleep(5000);
      onState?.({ next, running: runningNow, enabled: enabled(), leader });
      if (!enabled() || !leader || runningNow) continue;
      if (Date.now() < next) continue;
      runningNow = true;
      try { await fn(); } catch (e) { console.error('[Flipster]', name, e); }
      runningNow = false;
      next = Date.now() + Math.max(1, minutes()) * 60000;
    }
  };
  loop();
  return {
    runNow() { next = 0; },
    reschedule() { next = Date.now() + Math.max(1, minutes()) * 60000; },
    get next() { return next; },
  };
}
