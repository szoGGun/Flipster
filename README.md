<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="src/assets/logo/flipster-horizontal-outline.svg">
    <img src="src/assets/logo/flipster-horizontal-outline-navy-f.svg" alt="Flipster" width="380">
  </picture>
</p>

# Flipster

A Tampermonkey userscript for trading on the Steam Community Market, mostly CS2 items. It runs in your browser on your own Steam session, with no server, no login and no subscription.

> [!WARNING]
> ## ⚠️ Vibe-coded beta, use at your own risk
>
> Flipster is a **vibe-coded hobby project in beta**, built for fun and for my own needs. Most of the code was written with AI and it has not been reviewed or tested the way real software is.
>
> - **There are no guarantees of any kind.** It may have bugs, show wrong prices or values, or stop working whenever Steam changes something.
> - **It acts on your real Steam account.** It can create and cancel sell listings and buy orders. A bug can cost you real money or items.
> - **You use it entirely on your own responsibility.** I'm not responsible for any losses, mistakes, trade holds, restrictions or bans on your account.
> - Steam doesn't endorse this script, and automating actions on the Community Market may go against the Steam Subscriber Agreement.
>
> Check what it does before you trust it, and watch what it does on your account, especially the automations. If you're not comfortable with that, don't install it.

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

1. Chrome with the **Tampermonkey** extension. Open `chrome://extensions`, click Details on Tampermonkey and turn on **Allow user scripts**.
2. Open [flipster-beta.user.js](https://raw.githubusercontent.com/szoGGun/Flipster/main/dist/flipster-beta.user.js) and click **Install**. It's a small loader that pulls the built script from this repo.
3. In the Tampermonkey settings switch Config mode to **Advanced** and set **Externals, Update interval** to **Always**. Every page reload then picks up the latest code from `main`. GitHub can take a few minutes to serve a fresh push.
4. Go to steamcommunity.com and click the **Flipster** button in the bottom left corner.

## Good to know

- You confirm every new sell listing in the Steam mobile app (Steam Guard). The script has no access to your authenticator and that's how it should stay.
- Automations only run while a steamcommunity.com tab is open, and only in one tab at a time. They only touch items with a min price set (selling) or a max price set (buy orders).

## Development

```
npm install
npm run build     # builds dist/flipster.user.js and both loaders
npm test          # logic tests (fees, prices, sell chance, FIFO, patterns)
npm run smoke     # the whole script in headless Chrome against a mocked Steam
```
