// Remove listings and re-sell the returned items at new prices.
import * as steam from '../core/steam.js';
import { sleep } from '../core/util.js';
import { L } from '../core/i18n.js';

function resolveAsset(it, before, after, used) {
  // an asset still sealed as "listed" hasn't been released by the removal yet, wait for it
  const free = (id, a, need) => a.sealed !== 'listed' && a.amount - (used.get(id) || 0) >= need;
  const a0 = after.get(it.assetid);
  if (a0 && free(it.assetid, a0, it.amount)) return it.assetid;
  for (const [id, a] of after) if (!before.has(id) && a.hash === it.hash && free(id, a, it.amount)) return id;
  // stackable items (cases, stickers) may merge back into an existing stack
  for (const [id, a] of after) if (a.hash === it.hash && a.amount > 1 && free(id, a, it.amount)) return id;
  return null;
}

const invMap = async (appid, contextid) => new Map((await steam.inventory(undefined, appid, contextid)).map((i) => [i.assetid, i]));

/**
 * jobs: [{listing, price (buyer cents)}]
 * hooks: { onStatus(listing, text, cls), log(msg, cls), isCancelled() }
 * returns {ok, failed, confirm, waiting: [{listing, recv, buyer}], relisted, waiting for the mobile confirmation}
 */
export async function relist(jobs, hooks = {}) {
  const { onStatus = () => {}, log = () => {}, isCancelled = () => false } = hooks;
  const res = { ok: 0, failed: 0, confirm: 0, waiting: [] };
  const groups = new Map();
  for (const j of jobs) {
    const k = j.listing.appid + '_' + j.listing.contextid;
    (groups.get(k) || groups.set(k, []).get(k)).push(j);
  }

  for (const [k, list] of groups) {
    const [appid, contextid] = k.split('_');
    if (isCancelled()) break;
    log(L('relist-engine.inventorySnapshot', { appid, contextid }));
    const before = await invMap(appid, contextid);

    const removed = [];
    for (const j of list) {
      if (isCancelled()) { onStatus(j.listing, 'anulowano', 'warn'); continue; }
      onStatus(j.listing, L('relist-engine.removing'));
      const r = await steam.removeListing(j.listing.listingid);
      if (r.ok) { removed.push(j); onStatus(j.listing, L('relist-engine.removedWaitingForTheInventory')); }
      else { res.failed++; onStatus(j.listing, L('relist-engine.removingFailedHttp', { status: r.status }), 'err'); log(L('relist-engine.couldntRemoveHttp', { hash: j.listing.hash, status: r.status }), 'err'); }
    }
    if (!removed.length) continue;

    const resolved = new Map();
    const used = new Map();
    let pending = removed;
    for (let attempt = 0; attempt < 5 && pending.length; attempt++) {
      await sleep(2000 + attempt * 2500);
      const after = await invMap(appid, contextid);
      const still = [];
      for (const j of pending) {
        const id = resolveAsset(j.listing, before, after, used);
        if (id) { resolved.set(j, id); used.set(id, (used.get(id) || 0) + j.listing.amount); } else still.push(j);
      }
      pending = still;
      if (pending.length) log(L('relist-engine.waitingForItemsToCome', { pending: pending.length }), 'warn');
    }
    for (const j of pending) {
      res.failed++;
      onStatus(j.listing, L('relist-engine.notFoundInTheInventory'), 'err');
      log(L('relist-engine.removedButNotFoundIn', { hash: j.listing.hash }), 'err');
    }

    for (const [j, assetid] of resolved) {
      const price = steam.receivedFromBuyer(j.price, j.listing.pub);
      onStatus(j.listing, L('relist-engine.listing'));
      const r = steam.sellResultText(await steam.sellItem({ appid, contextid, assetid, amount: j.listing.amount, price }));
      const shown = steam.fmt(steam.buyerFromReceived(price, j.listing.pub));
      if (r.ok) {
        res.ok++;
        if (r.confirm) { res.confirm++; res.waiting.push({ listing: j.listing, recv: price, buyer: steam.buyerFromReceived(price, j.listing.pub) }); }
        onStatus(j.listing, L('relist-engine.listedFor', { shown, confirm: r.confirm ? L('relist-engine.confirmInTheApp') : '' }), 'ok');
        log(`${j.listing.hash}: ${steam.fmt(j.listing.buyer)} → ${shown}${r.confirm ? L('relist-engine.toConfirm') : ''}`, 'ok');
      } else {
        res.failed++;
        onStatus(j.listing, L('relist-engine.listingFailedTheItemIs', { msg: r.msg }), 'err');
        log(L('relist-engine.listingFailedTheItemIs2', { hash: j.listing.hash, msg: r.msg }), 'err');
      }
    }
  }
  return res;
}

/** sell inventory items directly. jobs: [{item, price (buyer cents)}] */
export async function sellMany(jobs, hooks = {}) {
  const { onStatus = () => {}, log = () => {}, isCancelled = () => false } = hooks;
  const res = { ok: 0, failed: 0, confirm: 0 };
  for (const j of jobs) {
    if (isCancelled()) break;
    const pub = steam.wallet().pubDefault;
    const price = steam.receivedFromBuyer(j.price, pub);
    onStatus(j.item, L('relist-engine.listing'));
    const r = steam.sellResultText(await steam.sellItem({ appid: j.item.appid, contextid: j.item.contextid, assetid: j.item.assetid, amount: j.amount || j.item.amount, price }));
    const shown = steam.fmt(steam.buyerFromReceived(price, pub));
    if (r.ok) {
      res.ok++;
      if (r.confirm) res.confirm++;
      onStatus(j.item, L('relist-engine.listedFor2', { shown }), 'ok');
      log(L('relist-engine.listedYouGetTheBuyer', { hash: j.item.hash, price: steam.fmt(price), shown, confirm: r.confirm ? L('relist-engine.confirmInTheSteamApp') : '' }), 'ok');
    } else {
      res.failed++;
      onStatus(j.item, r.msg, 'err');
      log(`${j.item.hash}: ${r.msg}`, 'err');
    }
  }
  return res;
}
