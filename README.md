# Flipster

A Tampermonkey userscript for trading on the Steam Community Market, mostly CS2 items. It runs in your browser on your own Steam session, with no server, no login and no subscription.

> **Note:** this is a vibe-coded hobby project, built for fun and for my own needs. It comes with no guarantees. Use it at your own risk and check what it does before you trust it with your Steam account.

## What it does

| Tab | What it does |
|---|---|
| Market | Your sell listings and buy orders. Undercuts the competition within your min/max (also automatically in the background) and suggests a price at which the item will really sell. |
| Inventory | Values everything you own, shows "in profit" / "pricey now" / "price falling" badges, float, rare patterns 💎 and bulk selling. On the regular Steam inventory page it shows prices and float on the items. |
| History | How much you really made or lost on purchases, sales, drops, trades and opened cases. |
| Deals | A scanner for quick flips (buy with an order, sell after the 7-day trade lock) and a verdict on what is worth holding longer. |
| Worth opening? | How much opening each case returns on average. |

On a trade offer page it shows the value of both sides.

The interface is in English or Polish. By default it follows your browser language, and you can change it in ⚙ Settings.

## Installation

1. Chrome with the **Tampermonkey** extension. Open `chrome://extensions`, click Details on Tampermonkey and turn on **Allow user scripts** and **Allow access to file URLs**.
2. `npm install` and `npm run build`.
3. In Tampermonkey create a new script and paste the contents of `dist/flipster-dev.user.js`. It's a small loader that reads the built `dist/flipster.user.js` from disk, so after every `npm run build` you only reload the page.
4. Go to steamcommunity.com and click the **Flipster** button in the bottom left corner.

## Good to know

- You confirm every new sell listing in the Steam mobile app (Steam Guard). The script has no access to your authenticator and that's how it should stay.
- Automations only run while a steamcommunity.com tab is open, and only in one tab at a time. They only touch items with a min price set (selling) or a max price set (buy orders).
- Steam limits the number of requests. Flipster slows down by itself after a 429 error and remembers prices for a few minutes.

## Development

```
npm install
npm run build     # builds dist/flipster.user.js and the loader dist/flipster-dev.user.js
npm test          # logic tests (fees, prices, sell chance, FIFO, patterns)
npm run smoke     # the whole script in headless Chrome against a mocked Steam
```

The logo in its different versions is in `src/assets/logo`.
