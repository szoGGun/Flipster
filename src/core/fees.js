// Steam market fee math (mirrors Steam's economy_common.js). All amounts in cents.
export const DEFAULT_WALLET = { feePercent: 0.05, feeMin: 1, feeBase: 0, pubDefault: 0.1 };

/** what the buyer pays when the seller should receive `recv` */
export function buyerFromReceived(recv, pub = 0.1, w = DEFAULT_WALLET) {
  const steamFee = Math.floor(Math.max(recv * w.feePercent, w.feeMin) + w.feeBase);
  // since the 2025 change both fees have the same minimum: the equivalent of $0.01 in the wallet currency
  // (e.g. ~0,04 zł) → the publisher fee uses the wallet minimum too, not a flat 1 cent
  const pubFee = Math.floor(pub > 0 ? Math.max(recv * pub, w.pubMin ?? w.feeMin ?? 1) : 0);
  return recv + steamFee + pubFee;
}

/** largest amount the seller receives such that buyer pays <= `buyer` (min 1) */
export function receivedFromBuyer(buyer, pub = 0.1, w = DEFAULT_WALLET) {
  if (!(buyer > 0)) return 0;
  let r = Math.max(1, Math.floor((buyer - w.feeBase) / (w.feePercent + pub + 1)));
  while (r > 1 && buyerFromReceived(r, pub, w) > buyer) r--;
  while (buyerFromReceived(r + 1, pub, w) <= buyer) r++;
  return r;
}

/** buyer price that Steam will actually show for a desired buyer price (can be 1-2 cents lower) */
export const effectiveBuyer = (buyer, pub, w) => buyerFromReceived(receivedFromBuyer(buyer, pub, w), pub, w);

// the lowest possible listing price: one cent for the seller plus both minimum fees (0,09 zł at a 0,04 zł minimum);
// follows the wallet, set by syncMinBuyer when the page's wallet is read
export let MIN_BUYER = buyerFromReceived(1);
export function syncMinBuyer(w = DEFAULT_WALLET) { MIN_BUYER = buyerFromReceived(1, w.pubDefault ?? DEFAULT_WALLET.pubDefault, w); }
