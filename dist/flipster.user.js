// ==UserScript==
// @name         Flipster
// @namespace    szoggun.flipster
// @version      0.1.0
// @description  Flipster, relist, auto-relist, zlecenia kupna, ekwipunek z cenami i floatem, masowa sprzedaż, historia P&L, analiza flipów i wymian
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAABZElEQVR4nNSWv2vCQBTHn0U6tVAsHURKoVAoXbu0Uxe7dCpF5w5tJzv5B3To5uKkOKi7EFEXnXRwCvhz00HQQUVBdHJy8mEgBHN35p3n4JcQwt3lPu/e914ubt/9ExxSJ3BguUGRXgOTi6uVtWXQOW9UPcoAzerl48vcH5haW0DhChazU2NGk9HvnMkAIpm2k2GYHOOBDDDfZOr2YenZOFHJeiUBWuJG0Iuz//z18I4Z2w249nn1cg4caziePPs/kv93uA6zUQQIvr8BRVq+CBu3F5Y0KttFGH40nra3iwDh329wLCN8AgANAIq0QokGYBoQjaWYeRCI5gEvTBmA3QC0ES9QAmAawLNRLBfzwAmHvkhbKPgZ0mstZpeCOsC88WbnApRUABdArQC93qYBSJ8gcX7AoQcS9SUCkAwgA5gGSIfPANgNkKheEcAuuQI2tV3Jo66+NQJPwX0W4Tr6f9PjB6wBAAD//3n1DPUAAAAGSURBVAMA/JR36qBpNgoAAAAASUVORK5CYII=
// @icon64       data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAIAAAAlC+aJAAAE00lEQVR4nOyae0xTVxzHf4XSF7TQYnmUMsQBM+yPxccW+o9m0SXL3JLNgUv23x7Zsiwuptk/w2WvLEu2LOyfzWXLFv/UWBNNfEcTg0RrVPDdkCigFCmC1CoqWh76gyM319v23HvOPZdK0s8fN6en95z7+/7u9zzg1Fy1tAkWMnmwwMkJyDY5AdkmJ0Ac+ebHwI4ZBOHxJpc03nN7H+EVP5Z4k6SSfBsfseA1MWLBQl/EidfeSJG8udU2tem37oPbfOfDbmDBpGchw/hWrB7FiEnQTBANKOZMuwc/FnsmWrdcwgIKQBnxYYvGfjgFkNDXNg+BboiSCyfcH3/TQ2qmJk0Htvk69pVpac4sAJPd8sV1yRvyOBKzofREnDDrFphzDsx5CX2FhdrGMexE0cPdRIGrZEJe09ddeGh7FV5BoIA3mmOKrGOIXe2ewzsrgREyZogDKbfhe8C3ge8k0w1aBSgST+LubC+VcswN9rmmObZyVRwyBInjgTK4Nc1CK1fHMXrpIw670N81IAhMAfZ255ZlzfvpR1R82Do+np+puboAknv5wxQzoBCmp9NU9nUXHdtTFukspjRUEYDRf/7dFVLGuP/5qR6MwV74jIL+K472PeWXTpWoNqQJkEePuTcuesTmmCSFgV5Hx96ycye0Lmc0ATgVHtlZgdMORv/rxpfBSGxF00P9dsx6VwfbSkwTgHHj/EjmdaPp7nSdPloK7Jj0/00ceG154NVlIILw6bPhU11MTQRs5lrefWvDe+tABIG164ERAQLwDYAgojdiwIheAZj76irmfURaduzaB+zoFdAkyP1IaPd+YEevAIH+YR2+BF0Csu4f0CmA7h+mjPL5B3QKoPgHMxps/RmMh18A3T9//PU/zAv8Auj+4ZjR+eAXQPcPzBecAuj+wa+CX34CGuDY/CjgFED3z8z2Ttv6wLH5UcApQNT6pX+o8AgQtX4JGSo8AkTtf7gXLzk8AkT5R+fwJTALeK78AxwC6P5p+/M/0AZOoCACZgH09attvnYQEmwC6P45KSipTLAJoPtnPncQEmwCnpP9jxyGQ74P179N8Y+QSV1OwO0M1qpPd1rfwEd+7+Z1r1NuEDKpS2D0oeUNpNzWR9tuqP9n7p1y98aaikanQ6o5OJL49EIPGIY8+ujDZDByLXx7LNPNtDfQ5HZ+tbhilcelqE8+5jnQ1QjaJrjER8qq0SP5rkX+1Nq6QtuPDdXf1/tr7NbUb6ttlgKTKZxgPlqlM5P4FS+96X16JqAlesgkID4x+WBqeqnTUWYpSP22IC8PH9biWzQ2OXX53jjoBjPyQ0M1pqzYnC9FHzh+ceBhUrWtyhj4+kXfpsW0qQCfFBq8hW9DNVWpYNwtlaWYCCwoOqQPXDnqg/gVl+PbOj+mXKo5e+f+smLl8S0+GDWcvD2GhYHxR9F0ycNAsR//7FXeocSO2CjaBljQej7w2QvlrXVVZtPMUei//Te3RocxedJoS0UuQJ7gTDdj1kOx0agGzyhgOOCotVs31/txkG25PvTL1Rswl1GcrDZU8hyuIG29g2h0TDzwwnxC8wFa1m75vWdQXil5w2+3knLatsRd6DQMmlgOdGMy6GeXinEJhiHs90IKDA1aTu4nZ9kmJyDb5ARkmwUv4AkAAAD//4Zu3N8AAAAGSURBVAMAtw3o6XFurSYAAAAASUVORK5CYII=
// @match        https://steamcommunity.com/*
// @connect      api.nbp.pl
// @connect      store.steampowered.com
// @connect      raw.githubusercontent.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-idle
// @noframes
// ==/UserScript==

(() => {
  // src/core/store.js
  var hasGM = () => typeof GM_getValue === "function";
  function get(key, def) {
    try {
      const v = hasGM() ? GM_getValue(key) : JSON.parse(localStorage.getItem("stt_" + key));
      return v === void 0 || v === null ? def : v;
    } catch {
      return def;
    }
  }
  function write(key, val) {
    try {
      if (hasGM()) GM_setValue(key, val);
      else localStorage.setItem("stt_" + key, JSON.stringify(val));
    } catch (e) {
      console.warn("[Flipster] store.set failed", key, e);
    }
  }
  function set(key, val) {
    write(key, val);
    buckets.get(key)?.drop();
  }
  function del(key) {
    try {
      hasGM() ? GM_deleteValue(key) : localStorage.removeItem("stt_" + key);
    } catch {
    }
    buckets.get(key)?.drop();
  }
  var SHARED = /* @__PURE__ */ new Set(["settings", "sellPlans", "sellRules", "buyRules", "invSellWatch", "watchlist", "flipHidden"]);
  var SHARED_MS = 2e3;
  var LAZY = { prices: 5e3, sellHist: 5e3, estPrices: 5e3, mktFloats: 5e3, caseQ: 5e3 };
  var lazyFlush = /* @__PURE__ */ new Set();
  if (typeof window !== "undefined") {
    const flushAll = () => {
      for (const f of [...lazyFlush]) f();
    };
    window.addEventListener("pagehide", flushAll);
    window.addEventListener("beforeunload", flushAll);
  }
  var buckets = /* @__PURE__ */ new Map();
  function bucket(key, def = {}) {
    if (buckets.has(key)) return buckets.get(key);
    const shared2 = SHARED.has(key), lazyMs = LAZY[key] || 0;
    let cache4 = null, at = 0, timer = 0;
    const read = () => {
      cache4 = get(key, null) ?? structuredClone(def);
      at = Date.now();
      return cache4;
    };
    const load5 = () => cache4 && !(shared2 && Date.now() - at > SHARED_MS) ? cache4 : read();
    const edit2 = () => shared2 ? read() : load5();
    const stop = () => {
      clearTimeout(timer);
      timer = 0;
      lazyFlush.delete(flush);
    };
    const flush = () => {
      if (!timer) return;
      stop();
      write(key, cache4);
    };
    const save2 = () => {
      at = Date.now();
      if (!lazyMs) return write(key, cache4);
      if (timer) return;
      lazyFlush.add(flush);
      timer = setTimeout(flush, lazyMs);
    };
    const b = {
      all: () => load5(),
      get: (k) => load5()[k],
      set(k, v) {
        edit2()[k] = v;
        save2();
      },
      patch(k, v) {
        const c = edit2();
        c[k] = { ...c[k] || {}, ...v };
        save2();
        return c[k];
      },
      del(k) {
        const c = edit2();
        if (!(k in c)) return;
        delete c[k];
        save2();
      },
      replace(obj) {
        cache4 = obj;
        save2();
      },
      reload() {
        flush();
        return read();
      },
      flush,
      /** the saved value was replaced from outside: forget the copy in memory (and a change not written yet) */
      drop() {
        stop();
        cache4 = null;
      }
    };
    buckets.set(key, b);
    return b;
  }
  var DEFAULT_SETTINGS = {
    delay: 1500,
    // ms between write actions (remove/sell/order)
    undercut: 1,
    // cents
    ignoreBelow: 2,
    // competition = first price where others hold this many units (skips a lone 1-unit listing / order)
    cacheMin: 5,
    // min, market data (order books, price histories, search pages, 24 h volume) reused, also across page loads (0 = off)
    autoComp: true,
    // check competition automatically on the listings tab
    listRefreshMin: 2,
    // min, the listings tab reloads your listings + competition this often while it's on screen
    invShowListed: true,
    // show items listed on the market in the inventory view
    autoRelist: false,
    autoRelistEvery: 10,
    // min
    autoBuy: false,
    autoBuyEvery: 10,
    // min
    autoBuyLower: false,
    // lower our order to 2nd highest + 1 when we're alone at the top
    minVolume: 10,
    // scanner: min sales per 24h
    minRoi: 0.03,
    // scanner: min ROI
    badges: true,
    // price badges in native inventory
    maxWaitDays: 2,
    // listings: proposed price = highest that still sells within this many days
    sellSignalPct: 10,
    // inventory sell signals threshold (%)
    debug: false,
    // show diagnostic tools ("Dane do analizy", market sample, history dump, request counter, build)
    showLog: true
    // show the log (console) at the bottom of the panel
  };
  var settings = (() => {
    const b = bucket("settings", {});
    return new Proxy({}, {
      get: (_, k) => b.all()[k] ?? DEFAULT_SETTINGS[k],
      set: (_, k, v) => {
        b.set(k, v);
        return true;
      }
    });
  })();

  // src/i18n/en-GB.json
  var en_GB_default = {
    analysis: {
      noCompetitionMaxPrice: "no competition, max price",
      noCompetition: "no competition",
      lowestCompetitorUndercut: "lowest competitor \u2212 undercut",
      cappedAtTheMaxPrice: "capped at the max price",
      raisedToTheMinPrice: "raised to the min price",
      priceIsOptimal: "price is optimal",
      raisingIsOff: "raising is off",
      outbiddingMax: "outbidding ({t}) > max",
      outbidding: "outbidding",
      loweringTo2ndPlaceStep: "lowering to 2nd place + step",
      youAreTheHighest: "you are the highest"
    },
    patterns: {
      "661ScarTheBest": '#661 "Scar", the best',
      top: "top",
      "909PSyTheBest": '#909 "P**sy", the best',
      tier1SameMotif: "Tier 1, same motif",
      togepi: '"Togepi"',
      owlEyes: '"Owl eyes"',
      angryMerchant: '"Angry merchant"',
      happyBird: '"Happy bird"',
      booba: '"Booba"',
      sleeperMushroom: '"Sleeper / mushroom"',
      memeNumber: "meme number",
      robot: '"Robot"',
      fakeT1SomeYellow: "fake T1 (some yellow)",
      fakeT2SomeYellow: "fake T2 (some yellow)",
      yourPattern: "Your pattern",
      yourList: "Your list",
      whiteScope: "White scope",
      blueHive: "Blue hive",
      orangeHive: "Orange hive",
      star: "Star",
      goldenCat: "Golden cat",
      phoenix: "Phoenix",
      seeds: "seeds"
    },
    sample: {
      skins: "skins",
      knivesAndGloves: "knives and gloves",
      casesCapsulesTerminals: "cases, capsules, terminals",
      stickers: "stickers",
      other: "other"
    },
    steam: {
      noOrderData: "no order data",
      steamReturnedNoListings: "Steam returned no listings",
      steamGaveNoWalletBalance: "Steam gave no wallet balance (are you logged in?)",
      steamTooManyRequests429: "Steam: too many requests (429)",
      noAccess403PrivateInventory: "No access (403): private inventory or logged out",
      invalidResponseFromSteamAre: "Invalid response from Steam (are you logged in?)",
      couldntLoadListingsAreYou: "Couldn't load listings (are you logged in?)",
      steamIsntReturningTheInventory: "Steam isn't returning the inventory (error {status}). Steam's servers have a problem, try again in a moment",
      noPriceData: "no price data",
      couldntLoadBuyOrdersNew: "couldn't load buy orders (new Steam market)",
      noOrderDataCheckThe: "no order data (check the name: {hash})",
      noPriceHistory: "no price history",
      gmXmlhttprequestUnavailable: "GM_xmlhttpRequest unavailable",
      externalServiceRequestLimitTry: "External service: request limit, try again in a few minutes",
      invalidResponse: "Invalid response",
      networkError: "Network error"
    },
    ui: {
      dragUpToMakeThe: "Drag up to make the log bigger (the window above gets smaller) \xB7 double-click to switch between big and small",
      theLogIsTurnedOff: "The log is turned off in \u2699 Settings",
      cancel: "Cancel",
      noData: '<div class="empty">No data</div>',
      breakEven: "break-even"
    },
    util: {
      onceUnlocked: "once unlocked",
      "1Day": "1 day",
      days: "{n} days",
      ago: "ago"
    },
    buyorders: {
      loadsYourOrdersAndChecks: "Loads your orders and checks the competition",
      refresh: "Refresh",
      newOrder: "New order",
      downloadsTheOrderBookAnd: "Downloads the order book and the full price history of the items in your buy orders from the Steam market and saves them to a file, for a joint analysis of whether and at what price to sell. Read only, it buys and lists nothing.",
      dataForAnalysis: "Data for analysis",
      automaticOutbiddingInTheBackground: "Automatic outbidding in the background",
      auto: "Auto",
      on: "on",
      off: "off",
      itemTypeItsNameIn: "Item (type its name in English or Polish)",
      eGRevolutionCaseAk: "e.g. revolution case, AK-47 Redline",
      pricePerUnit: "Price per unit",
      quantity: "Quantity",
      placeOrder: "Place order",
      outbidAutomatically: "Outbid automatically",
      everyMinutes: "Check every (minutes)",
      lowerWhenImAloneAt: "Lower the price when I'm alone at the top",
      checkNow: "Check now",
      theAutomationOutbidsByOne: `The automation outbids by one cent when someone offers more. It only touches orders where you turn on
      "outbid automatically" in "\u2699" and set a <b>maximum price</b>. Steam doesn't let you change an order's price, so outbidding means cancelling and placing a new one.`,
      cancelSelected: "Cancel selected",
      deselect: "deselect",
      item: "Item",
      yourOrder: "Your order",
      market: "Market",
      suggestion: "Suggestion",
      fromYourBuyOrders: "from your buy orders",
      enterAPrice: "enter a price",
      total: "total",
      highestOtherOrder: "highest other order",
      doesntExistOnSteamFees: "doesn't exist on Steam (fees round to whole cents), I'll place",
      enterAPrice2: "Enter a price.",
      enterAQuantity: "Enter a quantity.",
      priceAndQuantityUnchanged: "Price and quantity unchanged.",
      doesntExistOnSteamPlacing: "doesn't exist on Steam, placing",
      changeTheOrder: "Change the order?",
      steamDoesntLetYouEdit: "Steam doesn't let you edit orders, so the old one is cancelled and a new one placed (at the end of the queue at this price).",
      change: "Change",
      searching: '<div class="sub">searching\u2026</div>',
      nothingFound: '<div class="sub">nothing found</div>',
      checking: "checking\u2026",
      highest: "highest",
      outbidSomeoneOffers: "outbid: someone offers {comp}",
      aCentMoreThanThe: "a cent more than the highest other order",
      carefulThatsAlreadyWhatBuying: "careful, that's already what buying right away costs ({lowestSell})",
      selected: "{sel} selected:",
      checkingTheCompetition: "checking the competition\u2026",
      outbid: "outbid",
      checked: "checked",
      allHighest: "all highest",
      youHaveNoBuyOrders: '<tr><td colspan="6" class="empty">You have no buy orders. Click "+ New order".</td></tr>',
      autoOutbidsUpTo: "Auto outbids up to {max}",
      autoIsOnButWithout: "Auto is on but without a maximum price, so it won't work. Set it in \u2699.",
      of: "of",
      thisPriceCantBePaid: "This price can't exist after fees, so Steam shows and fills this order as {r}, queued with the others at that price. The next real price is {price}.",
      standsAs: "counts as",
      buyNow: "buy now",
      profitPerUnitAfterThe: "Profit per unit after the fee if the order fills at your price and you sell after the 7-day lock at last week's typical price ({sellAt}), the same way the Deals scanner counts",
      afterSelling: "after selling",
      market2: "market",
      nothingNeeded: '<span class="sub ok">nothing needed</span>',
      cancelsTheOrderAndPlaces: "Cancels the order and places a new one at {price} (asks first)",
      outbid2: "Outbid",
      anotherPriceOrQuantityCancels: "Another price or quantity (cancels and places a new order, asks first)",
      cancel: "Cancel",
      maximumPriceAndAutomation: "Maximum price and automation",
      newPricePerUnit: "New price per unit",
      save: "Save",
      dontPayMoreThan: "Don't pay more than",
      outbidAutomatically2: "outbid automatically",
      setDontPayMoreThan: `<span class="warn sub">set "don't pay more than", without it the automation skips this order</span>`,
      outbidTheOrder: "Outbid the order?",
      theOldOrderIsCancelled: "The old order is cancelled and a new one placed.",
      cancelTheOrder: "Cancel the order?",
      cancelOrder: "Cancel order",
      back: "Back",
      cancelled: "cancelled",
      error: "error {status}",
      loadedBuyOrders: "Loaded {rows} buy orders.",
      errorLoadingOrders: "Error loading orders: ",
      someoneOutbidYourOrderYours: "Someone outbid your order: {hash}, {comp} (yours {price})",
      outbidOrders: "Outbid orders",
      couldntCancel: "couldn't cancel ({message})",
      confirmInTheApp: " (confirm in the app)",
      cancelledButTheNewOrder: "cancelled, but the new order failed: {msg}",
      oldOrderCancelledTheNew: "{hash}: old order cancelled, the new one was rejected ({msg}), place it by hand!",
      youAlreadyHaveAnOrder: "you already have an order for this item",
      code: "code {success}",
      selectSomeOrders: "Select some orders.",
      setAMaxPrice: "set a max price",
      order: "order",
      cancelTheOrders: "Cancel the orders?",
      cancelBuyOrders: "Cancel {sel} buy orders?",
      cancelOrders: "Cancel orders",
      loading: "loading\u2026",
      highestOrderOfOthers: "highest order from others",
      likeTheDealsScannerAn: "Same as in the Deals scanner, an order one cent above the ones actually in the order book, then a sale after 7 days at the typical price (the lower of the 24 h and 7 day prices), after the fee",
      pickAnItemFromThe: "Pick an item from the suggestion list.",
      placeTheBuyOrder: "Place the buy order?",
      place: "Place",
      orderPlaced: "Order placed: {name} {qty}\xD7 {price}{confirm}",
      orderRejected: "Order rejected: {msg}",
      checkedChanged: "checked {list}, changed {n}",
      off2: "off",
      runsInAnotherTab: "runs in another tab",
      working: "working\u2026",
      nextInMin: "next in {min} min",
      autoOutbid: "Auto-outbid"
    },
    casedb: {
      gmXmlhttprequestUnavailable: "GM_xmlhttpRequest unavailable",
      badResponse: "bad response",
      networkErrorAddConnectRaw: "network error (add @connect raw.githubusercontent.com to the script header)",
      caseContentsData: "case contents data: "
    },
    cases: {
      milSpecBlue: "Mil-Spec (blue)",
      restrictedPurple: "Restricted (purple)",
      classifiedPink: "Classified (pink)",
      covertRed: "Covert (red)",
      knifeGloves: "\u2605 knife / gloves",
      highGradeNormal: "High Grade (normal)",
      remarkableHoloGlitterEmbroidered: "Remarkable (holo / glitter / embroidered)",
      extraordinaryGold: "Extraordinary (gold)",
      steamTooManyRequests429: "Steam: too many requests (429)",
      noUsdRate: "no USD rate",
      couldntFindStickerPricesFor: "couldn't find sticker prices for this capsule",
      cases: "Cases: ",
      caseContentsNotFound: "case contents not found",
      contentsNotRecognisedSearchResults: "contents not recognised ({found} search results)",
      likeYourLastKey: "like your last key ({t})",
      "249UsdAtThe": "2.49 USD at the exchange rate",
      recalculateCases: "Recalculate cases",
      whatToShowAndRecalculate: "What to show and recalculate",
      cases2: "Cases",
      stickerCapsules: "Sticker capsules",
      casesAndCapsules: "Cases and capsules",
      skipsCasesAndCapsulesWith: "Skips cases and capsules with fewer than 100 listings on the market. They are hard to buy and their prices can't be trusted",
      hideRarelySold100Listings: "Hide rarely sold (&lt;100 listings)",
      countEveryCaseAndCapsule: 'Count every case and capsule as if you already had it, so the opening cost is the key plus what selling it would bring you (after the fee) instead of the market price. You can change single ones with the "I have it" box in the row.',
      iAlreadyHaveThemAll: "I already have them all (not buying)",
      howIsThisCalculated: "How is this calculated?",
      evIsTheAverageValue: `
      <b>EV</b> is the average value of a drop after the fee, the sum over rarities of chance \xD7 average price of the skins of that rarity.<br>
      Valve's odds are blue 79.92%, purple 15.98%, pink 3.20%, red 0.64% and knife/gloves 0.26%. StatTrak\u2122 10%.<br>
      Case contents and float ranges come from the game files (the ByMykel/CSGO-API set). The wear is worked out from the skin's float range (e.g. a Doppler drops as FN about 96% of the time).<br>
      <b>Loss per opening</b> is cost \u2212 EV, what you lose on average per opening (in the long run, a single drop can be worth much more or less). The table is sorted from the smallest loss.<br>
      <b>Capsules</b> need no key, so the cost is the capsule price. Sticker rarities are High Grade (normal), Remarkable (holo / glitter / embroidered), Exotic (foil / holo) and Extraordinary (gold), with the same odds as cases (79.92 / 15.98 / 3.20 / 0.64) spread over the rarities the capsule has (that's how capsule data sites do it, Valve doesn't publish separate odds). Contents come from the game files (ByMykel), prices from the Steam market.<br>
      Prices are the lowest listing on the Steam market (single expensive drops often sell a bit cheaper in practice, so EV tends to be slightly too high). Cost is case + key. For a case marked "I have it" (ticked automatically when it's in your inventory, once the Inventory tab has loaded) the cost is the key plus what selling that case would bring you (after the fee). "Chance to break even" is how often a drop is worth as much as the opening costs.`,
      case: "Case",
      theAverageResultOfOne: "The average result of one opening, EV \u2212 cost, so what an opening costs you on average. Smallest loss first.",
      lossPerOpening: "Loss per opening",
      openingCost: "Opening cost",
      chanceToBreakEven: "Chance to break even",
      bestDrop: "Best drop",
      casePrice: "Case price",
      listings: "Listings",
      casesLoadingTheCaseList: "Cases: loading the case list\u2026",
      capsules: "capsules",
      casesAndCapsules2: "cases and capsules",
      cases3: "cases",
      casesCalculatingKey: "Cases: calculating {todo} {kind} (key {price}, {src})\u2026",
      aboutMinLeft: " \xB7 about {left} min left",
      calculatingResultsShowUpAs: "calculating {name} ({i}/{todo}){left}, results appear as they're ready, you can use the rest of Flipster meanwhile",
      cases4: "Cases: {name}, {message}",
      casesDone: "Cases: done.",
      dataFrom: " \xB7 data from {done}",
      casesCalculatedKey: "{done}/{rows} cases calculated \xB7 key {price} ({src}){done2}",
      clickRecalculateCases: 'Click "Recalculate cases"',
      whatOneOpeningOfThis: "What one opening of this case costs you on average, the least of all calculated",
      smallestLossPerOpening: "Smallest loss per opening",
      openingCost2: "opening cost",
      returnsOnAverage: "returns on average",
      thisCaseReturnsTheBiggest: "This case returns the biggest part of its cost, which matters when you have a fixed budget",
      returnsTheMost: "Returns the most (%)",
      perOpeningCost: "per opening \xB7 cost",
      howOftenADropIs: "How often a drop is worth at least what the opening costs",
      bestChanceToBreakEven: "Best chance to break even",
      ofOpeningsGiveADrop: "of openings give a drop worth",
      collectionNotRecognised: `<span class="warn" title="I don't know the contents of this case, so I don't calculate it">collection not recognised</span>`,
      returns: "returns",
      ofTheCost: "of the cost",
      capsuleAfterTheFeeNo: "capsule after the fee, no key",
      noKey: "no key",
      keyCaseAfterTheFee: "key {keyCost} + case after the fee",
      key: "+ key {keyCost}",
      youHaveThisCaseSo: "You have this case, so an opening costs the key plus what selling it would bring you (after the fee), not its market price",
      iHaveIt: "I have it",
      inInventory: "in inventory",
      calculatedTheOldWayClick: 'Calculated the old way, click "Recalculate cases"',
      noPricesForSomeRarities: "No prices for some rarities ({covered} of the odds), EV is too low",
      calculateOnlyThisCase: "Calculate only this case",
      calculate: "calculate",
      chance: "chance",
      average: "average",
      shareOfEv: "share of EV",
      youGetAfterSelling: "you get after selling: {ev}",
      normalStattrakAfterTheFee: "normal: {n} \xB7 StatTrak\u2122: {t} (after the fee, averaged over wear)",
      collapse: "collapse",
      more: "+{skins} more",
      clickRecalculateCasesCalculatingAll: `<tr><td colspan="9" class="empty">Click "Recalculate cases". Calculating all cases takes about 10-30 min and results appear as they're ready. They are saved, so after reloading the page there's no need to start over.</td></tr>`
    },
    flip: {
      everything: "Everything",
      cases: "Cases",
      capsulesAndPackages: "Capsules and packages",
      stickers: "Stickers",
      rifles: "Rifles",
      pistols: "Pistols",
      smgs: "SMGs",
      knives: "Knives",
      gloves: "Gloves",
      agents: "Agents",
      musicKits: "Music kits",
      itemAnalysis: "Item analysis",
      watchlist: "Watchlist",
      marketScanner: "Market scanner",
      downloadsFromTheSteamMarket: "Downloads the order book and the full price history of the items now on the list (scanner, watchlist or the analysed item) from the Steam market and saves them to a file, to check whether they really pay off. When the list is empty, it takes a fixed sample of about 100 popular items. Nothing is bought or listed.",
      dataForAnalysis: "Data for analysis",
      picksAFewHundredRandom: "Picks a few hundred random items from the most popular ones on the Steam market (evenly from every kind and price range) and saves their price history and order book to a file, to test Flipster's algorithms on a wider market. Nothing is bought or listed.",
      marketSample: "Market sample",
      itemNameInEnglishOr: "Item (name in English or Polish, or a market link)",
      eG: "e.g.",
      yourBuyPriceOptional: "Your buy price (optional)",
      unitsToBuy: "Units to buy",
      analyse: "Analyse",
      addToWatchlist: "Add to watchlist",
      nameInEnglishOrPolish: "name in English or Polish",
      add: "Add",
      scanWatchlist: "Scan watchlist",
      goal: "Goal",
      longTermCaseSeason: "long term (case season)",
      quickFlip7DayLock: "quick flip (7-day lock)",
      category: "Category",
      search: "Search",
      optional: "(optional)",
      priceFrom: "Price from",
      to: "to",
      minListings: "Min. listings",
      itemsToCheck: "Items to check",
      howManyToFind: "How many to find",
      noLimit: "no limit",
      minSales24h: "Min. sales/24h",
      onlyItemsWithTheFlip: "Only items with the \u201CFlip possible\u201D verdict stay on the list. Untick it to also see the risky ones (profit smaller than the typical weekly price swing).",
      profitableOnly: "profitable only",
      tickedTheScannerReusesWhat: "When ticked, the scanner reuses what it checked recently, such as rejected items (12 h when the order book alone left no room for a flip, 3 h after a full check), hits and \u201Crisky\u201D ones (30 min), and lists and order books (a few minutes). Untick it to download everything from Steam again for this scan.",
      useRememberedData: "use remembered data",
      scan: "Scan",
      removesTheResultsOfThe: "Removes the results of the previous scan from the list (also the ones kept across a page reload). Watched and hidden items stay.",
      clearList: "Clear list",
      howDoesItWork: "How does it work?",
      theScannerTakesTheMost: "\n        The scanner takes the most popular items of the category and price range from the Steam market, and for each of them the order book and the full price history.<br>\n        <b>Long term.</b> Shows how holding the item paid off in the past, after the fee, meaning how many winters (bought at the end of November, sold half a year later) ended in profit, the result after one and after two years, the price against the yearly average and the change over the last month. A \u201Ccandidate\u201D is a case older than 4 years, from 1 z\u0142, whose price didn't fall more than 10% in 30 days and which sells \u2265 20 units a day. The case's own winter record is shown but isn't used, because in the research it didn't separate better cases from worse ones, while age did. For other items, at least 3 winters of data and a profit in \u2265 70% of them.<br>\n        <b>Quick flip.</b> Buy with an order one cent above the orders actually in the order book, sell at the price items actually sell for, minus the fee. A bought item can only be listed after 7 days, so next to it you see the typical weekly price swing and whether anyone sold that cheap lately. In this mode the scanner keeps going down the list, from the most popular items, until it finds as many \u201CFlip possible\u201D items as you set in \u201CHow many to find\u201D, the list runs out or you click Stop. An empty \u201CHow many to find\u201D means no limit, it searches until Stop. With \u201Cprofitable only\u201D just the hits stay on the list, untick it to also see the \u201Crisky\u201D ones.<br>\n        <b>Where these rules come from.</b> Research on 108 items with up to 13 years of history (15.11.2026). Flips and buying dips didn't beat the fee, while holding old cases bought in winter made money. New items usually lose a lot of value. This is history, not a guarantee.",
      notFoundOnTheMarket: "Not found on the market: {h}",
      removedFromWatchlist: "Removed from watchlist: {hash}",
      addedToWatchlist: "Added to watchlist: {hash}",
      searching: "searching\u2026",
      nothingFound: "nothing found",
      noHistory: "no history",
      steamReturnedNoPriceHistory: "Steam returned no price history for this item.",
      newItem: "new item",
      itHasBeenOnThe: "It has been on the market for less than a year. New items usually lose a lot of value, in the research typically \u221257% in the first 90 days.",
      tooCheap: "too cheap",
      below1ZTheMinimum: "Below 1 z\u0142 the minimum fee (0.04 + 0.04 z\u0142) takes much more than 13%.",
      wintersInProfitOfTypically: "Winters in profit: {wins} of {n}, typically {med} after the fee.",
      tooYoung: "too young",
      onTheMarketForYears: "On the market for {age} years. Cases younger than 4 years gave a winter profit in 54% of cases (typically +13%), older ones in 82% (typically +39%).",
      theCaseIsYearsOld: "The case is {age} years old, cases older than 4 years gave a winter profit in 82% of cases. {rec}",
      historyTooShort: "history too short",
      lessThan3WintersOf: "Less than 3 winters of data, too little to judge anything.",
      weakHistory: "weak history",
      thatsTooLittleToCount: "{rec} That's too little to count on a profit.",
      lowVolume: "low volume",
      butOnlyUnitsSellA: "{rec} But only {vol} units sell per day, so it will be hard to sell out.",
      waitItsFalling: "wait, it's falling",
      butThePriceFellIn: "{rec} But the price fell {trend30} in 30 days. Cases bought during such a fall gave a profit after a year in 57% of cases instead of 75%.",
      candidate: "candidate",
      thePriceIsntDroppingSharply: "{rec} The price isn't dropping sharply and the volume is enough.",
      noData: "No data",
      noOrderBookOrPrice: "no order book or price history",
      theresAProfitOnlyAt: "profitable only at today's price {sell24}, at this week's typical price ({sell}) the fee eats it all, and you can only sell after 7 days",
      atThePriceSalesActually: "at the price items actually sell for, the fee eats the whole profit",
      inTheLast7Days: "nobody sold as low as your order price in the last 7 days",
      lowVolume24h: "low volume ({vol}/24h)",
      profitBelow: "profit below {minRoi}%",
      rarelyFills: "~ Rarely fills",
      inTheLast7Days2: "in the last 7 days only {week} units sold at your order price or lower ({MIN_FILL_WEEK} needed), the order will mostly just sit",
      risky: "~ Risky",
      theProfitIsSmallerThan: "the profit {roi} is smaller than the typical weekly price swing (\xB1{sig}), and you can sell only after 7 days",
      flipPossible: "\u2714 Flip possible",
      unitAfterTheFeeRemember: "{profit}/unit after the fee, remember the 7-day lock",
      flipDoesntPay: "\u2718 Flip doesn't pay",
      bought2229NovemberSold: "Bought 22-29 November, sold half a year later, after the fee:\n",
      noItemFoundOnThe: "No item \u201C{hash}\u201D found on the market.",
      analysis: "Analysis",
      is: "\u201C{hash}\u201D is",
      closestMatch: ", closest match",
      analysingOrdersVolumePriceHistory: "Analysing\u2026 (orders, volume, price history)",
      priceHistory: "Price history: ",
      salePrice: "Sale price",
      buyOrdersNow: "Buy orders now",
      lowestListingNow: "Lowest listing now",
      watch: "Watch",
      anOrderACentAbove: "An order one cent above the orders actually in the book",
      placeBuyOrder: "Place buy order",
      longTerm: "Long term",
      wintersNovToMay: "Winters (Nov to May)",
      inProfit: "in profit",
      typicallyAfterTheFee: "typically {med} after the fee",
      after1Year: "After 1 year",
      typicallyPeriods: "typically {med} \xB7 {n} periods",
      after2Years: "After 2 years",
      vs1YearAvg: "vs 1-year avg",
      priceNowAgainstThe12: "price now against the 12-month average",
      "30Days": "30 days",
      priceChangeOverTheLast: "price change over the last month",
      bought2229NovemberSold2: "Bought 22-29 November, sold half a year later (after the fee)",
      quickFlipSoldAfterThe: "Quick flip (sold after the 7-day lock)",
      buyOrder: "Buy (order)",
      topOfTheBookOrders: "top of the book {highestBuy} \xB7 {buyCount} orders",
      sellActualSales: "Sell (actual sales)",
      todayICountTheTypical: "today {sell24}, counted at the typical 7-day price",
      lowestListingListings: "lowest listing {lowestSell} \xB7 {sellCount} listings",
      profitUnitFlip: "Profit / unit (flip)",
      youGetBuy: "you get {net} \u2212 buy {buy}",
      afterTheFee: "after the fee",
      weeklySwing: "Weekly swing",
      typicalPriceChangeIn7: "typical price change in 7 days",
      fillChance: "Fill chance",
      pcs: "pcs",
      soldIn7DaysAt: "sold in 7 days at your order price or lower ({fill7} of volume)",
      volume: "Volume",
      "7Days": "{vol7} / 7 days",
      median7dAvg30d: "Median 7d \xB7 avg 30d",
      breakEven: "Break-even",
      minSalePriceToCome: "min. sale price to break even",
      yourPurchaseForSellingNow: "You bought at <b>{mine}</b>. Selling now ({sell}) you get {net}, that's",
      atThe7dMedian: ", at the 7d median",
      toComeOutEvenList: "To break even, list for at least",
      price: "Price",
      qty: "Qty",
      cumul: "Cumul.",
      buyOrders: "Buy orders",
      sellListings: "Sell listings",
      youCantBuyRightAway: "You can't buy {szt} right away, the order book shows only {listed} listings.",
      onAverageAUnitEach: " (on average {avg} a unit, each listing at its own price)",
      rightAwaySetTheOrder: "<b>To buy {szt} right away</b>, set the order at <b>{price}</b> and you pay {total} in total{qty}. After the sale",
      listingsAtOrCheaper: "Listings at {maxRoi} or cheaper",
      breakEven2: "break-even",
      highestWithProfit: "highest with profit \u2265 {minRoi}%",
      justAboveTheOrdersIn: "just above the orders in the book",
      upToWhatPriceTo: "Maximum buy price",
      sellingAtYouGet: "selling at {sell} (you get {got})",
      itPaysToBuyUp: "It pays to buy <b>up to {maxRoi}</b> (\u2265 {minRoi}% left after the fee), above <b>{maxZero}</b> you lose.",
      orderPrice: "Order price",
      profitUnit: "Profit / unit",
      soldThisCheap7Days: "Sold this cheap (7 days)",
      ordersAheadOfYou: "Orders ahead of you",
      inAbout: "{szt} in about",
      ofVolume: "of volume",
      nobodySoldThisCheap: "nobody sold this cheap",
      lessThanADay: "less than a day",
      over2Months: "over 2 months",
      days: "{days} days",
      theTimeIsAnEstimate: "The time is an estimate based on how many units sold at this price or cheaper last week, minus the orders waiting ahead of yours. Orders fill most often when the price drops.",
      noItemsToCheck: "No items to check.",
      steamLimitStoppedTryAgain: "Steam rate limit, stopped. Try again in a few minutes.",
      buyingSeasonNovemberToFebruary: '<b class="pos">Buying season (November to February).</b> Cases older than a year bought at the end of November and sold at the end of May made a profit after the fee in 10 of 11 years, typically +49%.',
      sellingSeasonAprilToAugust: '<b class="warn">Selling season (April to August).</b> Cases were historically the most expensive then. Bought in May and sold in November, they typically gave \u221212%.',
      inBetweenHistoricallyItWas: "<b>In between.</b> Historically it was best to buy cases at the end of November and sell them from April to June.",
      oldCasesInThisScan: ' Old cases in this scan moved <b class="{t}">{t2}</b> in 30 days and are <b class="{y}">{y2}</b> against the yearly average.',
      theMarketIsStillFalling: ' <b class="warn">The market is still falling, better wait until it stops.</b>',
      numbersFromResearchOn108: "Numbers from research on 108 items (up to 13 years of history, 15.11.2026). This is history, not a guarantee.",
      scannerListCleared: "Scanner: list cleared.",
      itemsYouHidWithThe: "Items you hid with the \u2715 button. The scanner doesn't show or check them",
      hidden: "Hidden",
      restoreAll: "restore all",
      restoreToTheScanner: "Restore to the scanner",
      haveAGoodHistoryBut: ", {wait} have a good history but are still falling",
      ofAreCandidates: "<b>{ok}</b> of {rows} are candidates{wait}.",
      stillSearching: "still searching\u2026",
      done: "done",
      endOfTheListThere: "end of the list, there are no more items in this range",
      stoppedScanResumes: "stopped, \u201CScan\u201D continues",
      steamStoppedReturningTheList: "Steam stopped returning the list (it hasn't ended), click \u201CScan\u201D in a few minutes to continue",
      steamIsLimitingRequestsTry: "Steam is limiting requests, try again in a few minutes",
      error: "error",
      of: " of {want}",
      positionOfOnSteamsList: " (position {pos} of {total} on Steam's list for this category)",
      hiddenUntickProfitableOnly: "hidden, untick \u201Cprofitable only\u201D",
      onTheListGreyedOut: "on the list, greyed out",
      risky2: " \xB7 {risky} risky ({onlyOk})",
      skippedCheckedRecently: " \xB7 {skipped} skipped (checked recently)",
      withoutData: " \xB7 {failed} without data",
      foundChecked: "Found <b>{found}</b>{want} \xB7 checked {checked}{total}{risky}{skipped}{failed}",
      nothingPassedSoFarStill: "Nothing passed so far, still searching\u2026",
      noItemGotTheFlip: "No item got the \u201CFlip possible\u201D verdict. Untick \u201Cprofitable only\u201D to see the risky ones.",
      noCheckedItemPassedLower: "No checked item passed. Lower Min. ROI or Min. sales, widen the prices or change the category.",
      setTheFiltersAndClick: "Set the filters and click \u201CScan\u201D.",
      anItemPassesWithA: "An item passes when its profit is \u2265 {minRoi}% at the lower of two prices (today's and the typical 7-day one) and bigger than the typical weekly price swing, when at least {MIN_FILL_WEEK} units sold at its order price within a week, and when it sells \u2265 {minVol} times a day. You can only sell a bought item after 7 days and the typical weekly price swing is a few percent, so in the research such flips almost never made a profit.",
      item: "Item",
      verdict: "Verdict",
      priceNow: "Price now",
      volume24h: "Volume 24h",
      profitUnit2: "Profit/unit",
      placeABuyOrderFor: "Place a buy order for {buy} (one cent above the orders actually in the book)",
      order: "+ order",
      hideItTheScannerWont: "Hide it, the scanner won't show or check it (restore it under \u201CHidden\u201D above the table)",
      todaySalesGoAtBut: "Today items sell at {sell24}, but I count the lower, typical 7-day price, since you can only sell after the lock.",
      youGet: "you get",
      today: "today",
      youWatchClickScanWatchlist: "You're watching {watch}, click \u201CScan watchlist\u201D to analyse them",
      addItemsToTheWatchlist: "Add items to the watchlist (\u2606) and click \u201CScan watchlist\u201D.",
      steamTooManyRequests429: "Steam: too many requests (429)",
      of2: " of {total}",
      scannerSteamReturnedAnEmpty: "Scanner: Steam returned an empty page at position {start}{total}, retrying in {secs} s\u2026",
      resultsFromIKeepThem: "Results from {oldest}, I keep them for 30 minutes after the check (until {oldest2}), also across a page reload. After that \u201CScan\u201D downloads new ones.",
      scannerDownloadingTheListOf: "Scanner: downloading the list of popular items\u2026",
      scannerSteamStoppedReturningThe: "Scanner: Steam stopped returning the list, checking what I managed to download.",
      scannerStopped: "Scanner stopped.",
      scannerCheckingItemsInThe: "Scanner: checking {list} items in the range (~{min} min).",
      scannerFinished: "Scanner finished.",
      scanner: "Scanner: ",
      of3: "of",
      scannerSearchingForFlipPossible: "Scanner: searching for \u201CFlip possible\u201D items with no limit, until the end of the list or until you click Stop.",
      scannerSearchingForFlipPossible2: "Scanner: searching for {want} \u201CFlip possible\u201D items until found (Stop ends it).",
      scannerFound: "Scanner: found {hash} ({found}{want}).",
      steamsListForThisCategory: " Position {pos} of {total} on Steam's list for this category.",
      checkedFound: "checked {checked}, found {found}{of}",
      scannerFinished2: "Scanner finished, {sum}.",
      scannerEndOfTheList: "Scanner: end of the list, {sum}.{where} Widen the price range or change the category.",
      scannerSteamStoppedReturningThe2: "Scanner: Steam stopped returning the item list, {sum}.{where} This isn't the end of the list. Click \u201CScan\u201D in a few minutes, items already checked won't be downloaded again.",
      scannerSteamIsLimitingRequests: "Scanner: Steam is limiting requests, {sum}. Click \u201CScan\u201D in a few minutes, items already checked won't be downloaded again.",
      scannerStoppedScanResumesWhere: "Scanner stopped, {sum}. \u201CScan\u201D resumes where it left off.",
      shownOnTheListRight: "shown on the list right now",
      fromTheFixedSampleOf: "from the fixed sample of popular ones (the list is empty)"
    },
    history: {
      trade: "trade",
      market: "market",
      case: "case",
      contract: "contract",
      sticker: "sticker",
      received: "received",
      other: "other",
      of: "of",
      rateToFromSteamPrices: "Rate {CUR_NAME} to {CUR_NAME2}: {r} (from Steam prices)",
      couldntGetTheExchangeRate: "Couldn't get the exchange rate of {CUR_NAME}: {message}",
      historyDownloadedHistoricalExchangeRates: "History: downloaded historical exchange rates from NBP.",
      historySavedTheDataFor: "History: saved the data for analysis ({market} trades, {inv} inventory events, {opens} openings, {owned} items).",
      fetchesNewEntriesFromAll: "Fetches new entries from all three Steam histories, which are the market, the inventory (CS2 and Steam cards) and store purchases (prices of keys and terminal purchases). It also runs by itself when you open this tab.",
      sync: "Sync",
      downloadsTheWholeMarketAnd: "Downloads the whole market and inventory history again. Rarely needed and costs many requests to Steam.",
      fullSync: "Full sync",
      savesTheWholeStoredHistory: "Saves the whole stored history (market, inventory history, opened cases) and the list of what's in your inventory to a file, so we can check together whether Flipster calculates it correctly. Your SteamID and profile links are left out.",
      dataForAnalysis: "Data for analysis",
      "7Days": "7 days",
      "30Days": "30 days",
      "90Days": "90 days",
      year: "year",
      wholeHistory: "whole history",
      whichGameTheTradesSummary: "Shows the trades, the summary and the inventory history for one game only (e.g. just the CS2 result, without trading cards)",
      allGames: "all games",
      joinsIdenticalTradesOfOne: "Merges identical trades from the same day (same item, kind, price and state) into one \xD7N row, click \xD7N to expand it",
      groupIdentical: "Group identical",
      trades: "Trades",
      openedCases: "Opened cases",
      inventoryHistory: "Inventory history",
      everyTradeOnItsOwn: "Every trade separately or totals per item",
      everyTrade: "every trade",
      totalPerItem: "total per item",
      filterItems: "Filter items\u2026",
      showHideTheResultMonth: "Show / hide the monthly breakdown of flips, cases, spent and received",
      months: "Months",
      showHideTheFlipProfit: "Show / hide the flip profit chart",
      chart: "Chart",
      eachSaleIsPairedWith: "Profit is calculated with FIFO, each sale is paired with the oldest unsold purchase of the same item. Sale amounts are already after Steam's fee. Sales without a market purchase (drops, cases, trades) are counted separately as \u201Cincome without cost\u201D.",
      allEvents: "all events",
      trades2: "trades",
      cases: "cases",
      contracts: "contracts",
      stickers: "stickers",
      receivedDrops: "received / drops",
      searchItemsPlayers: "Search items, players\u2026",
      everythingThatHappenedToYour: "Everything that happened to your items, such as trades (with whom and what for what), market sales and purchases, opened cases, contracts and drops (also Steam cards for playing). Game and period follow the filters at the top.",
      given: "given",
      historyOneTimeDownloadOf: "History: re-downloading the whole market history once (corrected sale prices)\u2026",
      historyASyncIsAlready: "History: a sync is already running.",
      illDownloadTheWholeMarket: `I'll download the whole market history and the whole inventory history (CS2 and Steam cards) again. That's from a few dozen to a few hundred requests to Steam and a few minutes.<br><span class="sub">\u201CSync\u201D is usually enough, it fetches only new entries (and runs by itself when you open this tab).</span>`,
      downloadEverything: "Download everything",
      logIn: "Log in.",
      steamReturnedNoHistory: "Steam returned no history",
      historyNewestMarketTrade: "History: newest market trade",
      buy: "buy",
      sale: "sale",
      downloadedEvents: "downloaded {start}/{total} events",
      historyStoppedISavedWhat: "History: stopped, I saved what I managed to download.",
      historyNewTradesInTotal: "History: +{added} new trades ({trades} in total).",
      knownPattern: ", \u{1F48E} known pattern {knownList}",
      noneIsAKnownRare: ", none is a known rare pattern",
      historySeedKnownForOf: "History: seed known for {withSeed} of {all} trades{known}.",
      history: "History: ",
      waitingForARateEstimated: " \xB7 {pending} waiting for a rate / estimated price",
      openInventoryToVerifyYou: " \xB7 open Inventory to check \u201Cyou hold\u201D",
      tradesStored: "{n} trades stored{pending}{owned}",
      noDataClickSync: "No data, click Sync",
      spentOnTheMarket: "Spent on the market",
      receivedFromSales: "Received from sales",
      balance: "Balance",
      receivedMinusSpent: "received minus spent",
      flipProfit: "Flip profit",
      flipsInProfit: "{realizedP} flips \xB7 {realizedP2} in profit",
      item: "Item",
      bought: "Bought",
      sold: "Sold",
      profitLoss: "Profit / loss",
      someAmountsAreEstimatedNo: "Some amounts are estimated (no price in Steam's history) or converted from another currency at the NBP rate",
      total: "total",
      notBought: "not bought",
      fromADropTrade: "from a drop/trade",
      youGot: "you got",
      youHold: "you hold",
      worthToYouUnit: "{val} after the fee \xB7 {todayLow}/unit",
      noPrice: "no price",
      allSold: "all sold",
      today: "today",
      unit: "unit",
      held: "held",
      unrealised: "unrealised",
      theItemLeftTheInventory: "The item left the inventory other than through a market sale (trade, contract, use), so the profit can't be worked out",
      unknown: "unknown",
      theItemDroppedFromA: "The item dropped from a case/capsule. Cost is the case plus the key.",
      dropFrom: "drop from",
      aCase: "a case",
      vsTheOpeningCost: "vs the opening cost",
      noTradesInThisPeriod: "No trades in this period.",
      notInSteamsHistory: "not in Steam's history",
      steamCardBackgroundOrEmoticon: "Steam card, background or emoticon",
      theInventoryHistoryOfIsnt: "The inventory history for {app} isn't downloaded yet (it downloads by itself when you open this tab).",
      olderThanTheHistory: "{what}, older than the history",
      soldAndTheInventoryHistory: "Sold {t}, but the inventory history for {app} starts {from}. Steam no longer shows where it came from.",
      cardsUsuallyDropForPlaying: " (cards usually drop for playing or come from booster packs)",
      neitherTheMarketHistoryNor: "Neither the market history nor the inventory history for {app} says where this item came from{app2}. Counted as income without cost.",
      olderThanTheInventoryHistory: "older than the inventory history",
      soldAndTheSteamInventory: "Sold {t}, but the Steam inventory history starts {first}. Steam no longer shows where this item came from.",
      probablyFromThe: "probably from the {c}",
      steamDidntRecordWhereThis: "Steam didn't record where this item came from. In the inventory history it only shows up when it was listed or sold.\nThis skin is in the {c}, and in the 14 days before it first showed up in the history ({seen}) you opened that case ({n}\xD7, last {t}), so it most likely dropped from an opening Steam didn't record. Steam's history from early 2014 has such gaps.\nCost unknown, counted as income without cost.",
      andOthers: " (and others)",
      skinFromThe: "skin from the {cases}{cases2}",
      steamDidntRecordWhereThis2: "Steam didn't record where this item came from. This skin is in the {cases}, but you didn't open one in the 14 days before it first showed up in the history ({seen}), so it may have been a drop, a trade or an opening Steam didn't record.",
      theInventoryHistoryIsntFully: "\nThe inventory history isn't fully downloaded yet. Sync it in the \u201CInventory history\u201D tab, including older entries.",
      notBoughtOnTheMarket: "Not bought on the market, and the inventory history doesn't say where it came from (a drop, a trade or an event Steam didn't record).{ih}",
      date: "Date",
      type: "Type",
      buySellPrice: "Buy / sell price",
      priceToday: "Price today",
      aDropRewardOrGift: "A drop, reward or gift that cost nothing, so the profit is the whole amount you got.",
      theContract: "the contract",
      theTrade: "the trade",
      aGiftYouGaveNothing: "A gift you gave nothing for, so the profit is the whole amount you got.",
      costTheValueOfWhat: "Cost = the value of what you gave ({gave}) on {day}, working out that day's prices\u2026",
      costTheMarketValueOf: "Cost = the market value of what you gave ({gave}) on {day}, converted to this item: {cost}.",
      boughtInTheSteamStore: "Bought in the Steam store for {price} (purchase history, {t}).",
      boughtInTheSteamStore2: "Bought in the Steam store, but this purchase isn't in the Steam purchase history, so the amount is unknown.",
      costUnknownThisEventDoesnt: "Cost unknown, this event doesn't say what the item cost.",
      takenOffAnItem: "removed from an item {d}",
      with: " with {e}",
      fromATrade: "from a trade {d}{href}",
      fromAContract: "from a contract {d}",
      fromACaseCapsule: "from a case / capsule {d}",
      gift: "gift {d}",
      forTheStoreDiscoveryQueue: "for the store Discovery Queue {d}",
      dropForPlaying: "drop for playing {d}",
      fromTheSteamStore: "from the Steam store {d}",
      dropForPlaying2: "drop for playing {d}",
      inRows: " in {groups} rows",
      priceEstimatedFromTheMarket: "Price estimated from the market price history, because Steam recorded this trade only in the inventory history, without an amount.",
      convertedFromAnotherCurrencyAt: "Converted from another currency at the NBP rate from the day of the trade.",
      sold2: "sold",
      inInventory: "{unsold} in inventory",
      inInventory2: "in inventory",
      boughtFor: "bought for",
      openingCostTheCaseThe: "Opening cost = the case + the key",
      cost: "cost",
      saleMinusTheOpeningCost: "Sale minus the opening cost of the case",
      notBoughtOnTheMarket2: "Not bought on the market",
      profitYouGotCost: "Profit = you got {price} \u2212 cost {cost}",
      todayYoudGetAfterThe: "Today you'd get {now} after the fee and the buyer would pay {low}. Compared with what you got back then.",
      lowestPriceTodayWhatYoud: "Lowest price today (what you'd pay) is {low}, compared with the buy price",
      collapse: "collapse",
      expand: "expand",
      identicalTradesThatDayClick: "{n} identical trades that day, click to {k}",
      whatYouGotAfterSteams: "What you got (after Steam's fee). The buyer paid {price}.",
      whatYouPaid: "What you paid",
      allUnitsToday: "All {n} units today",
      aboutInHandAfterSelling: ", about {low} in hand after selling",
      showThisCopyInInventory: "Show this copy in Inventory (ungrouped)",
      showTheseItemsInInventory: "Show these items in Inventory",
      notUsedYet: "not used yet",
      bought2: "bought: {bought}",
      nothingBought: "nothing bought",
      activated: "activated{d}, {bought}",
      opened: "opened{d}{g}",
      to: " to {g}",
      applied: "applied{d}{g}",
      got: ", result: {g}",
      contract2: "contract{d}{g}",
      traded: "traded{d}",
      activated2: "activated",
      opened2: "opened",
      traded2: "traded",
      applied2: "applied",
      detailsAfterExpandingTheGroup: "Expand the group (\u25B8 \xD7N by the name) to see the details",
      outOfInv: "out of inv.",
      with2: " with {name}",
      got2: ", in return: {g}",
      traded3: "traded{name}{g}",
      boughtOnTheMarketBut: "Bought on the market, but no longer in the inventory. Sync the inventory history (the \u201CInventory history\u201D tab) to see what happened to them.",
      with3: "with",
      steamCardsAndBackgrounds: "Steam cards and backgrounds",
      game: "game {app}",
      reached: " \xB7 reached {oldest}",
      downloadingNewEventsPages: "downloading\u2026 {cnt} new events ({pages} pages){oldest}",
      inventoryHistoryEvents: "Inventory history: +{n} events.",
      inventoryHistory2: "Inventory history: ",
      complete: "complete",
      notCompleteYet: "not complete yet",
      inventoryHistoryEvents2: "Inventory history ({app}): +{s} events, {app2}.",
      since: " \xB7 since {gOld}",
      wholeHistory2: " (whole history)",
      olderOnesNotDownloadedYet: " \xB7 older ones not downloaded yet, I'll fetch them at the next sync",
      eventsStoredSynced: "{src} events stored{gOld}{gApp2} \xB7 synced {gApp}",
      notSynced: "not synced",
      event: "Event",
      items: "Items",
      noEventsInThisPeriod: "No events in this period",
      clickSync: ", click Sync",
      likeYourKeyFrom: "like your key from ",
      "249UsdAtThat": "\u2248 2.49 USD at that day's rate, no key purchase in the history",
      "249UsdAtTodays": "2.49 USD at today's rate",
      downloadingThePurchaseHistory: "downloading the purchase history\u2026",
      purchaseHistory: "purchase history: {n}\u2026",
      steamPurchaseHistoryEntriesCs2: "Steam purchase history: {rows} entries ({isCS} CS2 purchases).",
      steamPurchaseHistory: "Steam purchase history: ",
      fromTheMarket: "from the market",
      purchaseHistory2: "purchase history",
      sold3: "sold",
      marketPriceOfTheTrade: "market price on the day of the trade",
      shareOfWhatYouGot: "share of what you got: {mine} of {gaveSum} given for {gotSum} received",
      traded4: "traded",
      inReturn: "\nIn return: ",
      youGotNothingInReturn: "\nYou got nothing in return (a gift?), counted at market price",
      value: "Value",
      inYourInventory: "in your inventory",
      notInTheInventory: "not in the inventory",
      bought3: "bought",
      fromATrade2: "from a trade",
      fromADrop: "from a drop",
      entered: "entered",
      periodLastDaysChangeIt: "period: last {period} days (change it at the top) \xB7 ",
      estimatingPrices: "estimating prices ({waiting})\u2026 \xB7 ",
      dataFromTheInventoryHistory: "data from the inventory history",
      syncTheInventoryHistoryThe: "sync the inventory history (the \u201CInventory history\u201D tab)",
      purchaseHistoryCs2Purchases: " \xB7 purchase history: {isCS} CS2 purchases",
      openings: "Openings",
      inProfit: "{plus}/{done} in profit",
      workingOutTheResult: "calculating the result\u2026",
      openingCost: "Opening cost",
      casesAndKeys: "Cases and keys",
      terminalsTerminalInGamePurchase: "Terminals (terminal + in-game purchase)",
      casesTerminals: "cases {spent} \xB7 terminals {spentTerm}",
      casesKeys: "cases + keys",
      dropValue: "Drop value",
      afterTheFee: "after the fee",
      profitLossOnCases: "Profit / loss on cases",
      withoutTerminalsWithNoAmount: " \xB7 not counting terminals with no amount entered",
      bestDrop: "Best drop",
      caseTerminal: "Case / terminal",
      cost2: "Cost",
      dropPurchase: "Drop / purchase",
      whatHappenedToIt: "What happened to it",
      terminalOnceUnsealedYouCan: "Terminal, once unsealed you can buy an item from the Arms Dealer with money from your Steam wallet",
      aCaseOpenedWithA: "A case opened with a key",
      paid: "paid",
      amount: "amount",
      inGamePurchase: "in-game purchase",
      key: "key",
      enterTheAmountPaidIn: "Enter the amount paid in the terminal (the \u201Cpaid\u201D field in the Case column)",
      enterAmount: "enter amount",
      noOpenedCasesInThis: "No opened cases in this period",
      syncTheInventoryHistoryFirst: ", sync the inventory history first",
      tradePartnersProfile: "Trade partner's profile",
      profile: "profile",
      checksThePartnersPublicInventory: "Checks the partner's public inventory (1 request)",
      doesHeStillHaveIt: "do they still have it?",
      checking: "checking\u2026",
      thisItemSameNameAnd: "This item (same name and state) is in their inventory",
      stillHasIt: "still has it",
      itIsntInTheirInventory: "It isn't in their inventory, they sold or traded it on",
      noLongerHasIt: "no longer has it",
      thePartnersInventoryIsPrivate: "The partner's inventory is private",
      privateInventory: "private inventory",
      checkFailed: "check failed",
      lowestPriceTodayInHand: "Lowest price today: {low} ({today} after the fee)",
      lowestPriceToday: "Lowest price today: {low}",
      inProfit2: "in profit",
      open: "openings",
      withoutAResult: ", {open} without a result",
      resultByMonth: "Result by month",
      flipsAndCasesWithA: "flips and cases with a result, money spent and received on the market (after the fee)",
      month: "Month",
      cases2: "Cases",
      spent: "Spent",
      received2: "Received",
      total2: "Total",
      tooFewSalesToDraw: "Too few sales to draw a chart.",
      cumulativeFlipProfit: "Cumulative flip profit",
      theTableAndCardsShow: "the table and cards show only {x0} - {x1}: ",
      total3: "total: ",
      showAll: "show all",
      dragTheMouseOverThe: "drag the mouse over the chart to zoom in",
      from: "from",
      aGameDrop: "a game drop"
    },
    inventory: {
      steamCards: "Steam (cards)",
      forSaleClickToUnmark: "For sale, click to unmark",
      markForSaleTheFor: "Mark for sale, it shows up under the \u201C\u{1F4CC} For sale\u201D filter and its listings are checked every 10 minutes (changes go to the log)",
      inUnderAnHour: "in under an hour",
      inAboutH: "in about {d} h",
      inAboutDays: "in about {d} days",
      sellRightAwayToThe: "Sell right away to the buy order: {price} (you get {net}).",
      waitingForAHigherPrice: "Waiting for a higher price would give at most ~2% more.",
      listItForYouGet: "List it for {price} (you get {net}).",
      chanceItSellsWithin: "Chance it sells within {horizon}: {chance}.",
      inTheLastDaysOnly: "In the last {days} days only {n} of {total} units sold at this price or higher, so the time to sell is hard to predict.",
      itShouldSell: "It should sell {wait}.",
      rightAwayToTheBuy: "Right away to the buy order: {price}.",
      thePriceUsuallyDropsAfter: "The price usually drops after a few days, don't drag it out.",
      floatAndStickersAreNot: "Float and stickers are not included.",
      rightAway: "Right away",
      toTheOrderWaitingGives: "to the buy order, waiting gives \u2264 2% more",
      listFor: "List for",
      only: "only ",
      chanceWithin: "chance within {horizon}: {lowChance}{chance}",
      inDaysThisMuchOr: "in {days} days sold at this price or more: {n} of {total} units",
      willSell: "will sell {wait}",
      noSalesData: "no sales data",
      load: "Load",
      search: "Search\u2026",
      layout: "Layout",
      price: "Price \u2193",
      name: "Name",
      stickers: "Stickers \u2193",
      newest: "Newest",
      joinsIdenticalItemsNoFloat: "Merges identical items (no float, stickers or name tag, the same cost and lock state) into one card with a count",
      groupIdentical: "Group identical",
      pricesAreWorkedOutBy: "Prices update by themselves after loading (cache 6 h). This button refreshes them right away, for the selected items or, when nothing is selected, for all of them.",
      refreshSteamPrices: "Refresh Steam prices",
      downloadsFromTheSteamMarket: "Downloads the order book and the full price history of your items (selected or all) from the Steam market and saves them to a file, so we can analyse together whether and at what price to sell. Read only, nothing is bought or listed.",
      dataForAnalysis: "Data for analysis",
      onlyItemsWithTheIn: "Only items with the \u201Cin profit\u201D or \u201Cpricey now\u201D badge, the ones Flipster advises selling. \u201CPrice falling\u201D is only for information, in a check against price history it didn't predict further drops.",
      worthSelling: "Worth selling",
      show: "Show",
      sellableCanBeListedNow: "Sellable means it can be listed now (or is listed). Trade locked means it can be sold once the lock ends. Unsellable items never go on the market (medals, badges, coins\u2026).",
      all: "All",
      sellable: "Sellable",
      tradeLocked: "Trade locked",
      unsellable: "Unsellable",
      alsoShowsTheItemsYou: "Also shows the items you have listed on the Steam Market",
      listed: "Listed",
      onlyItemsMarkedForSale: "Only items marked \u{1F4CC} for sale (I check their listings every 10 minutes, changes show in the log)",
      forSale: "For sale",
      clickItemsToSelectThem: "Click items to select them. Shift-click selects a range.",
      selectVisible: "select visible",
      deselect: "deselect",
      sellSelected: "Sell selected\u2026",
      showMore: "Show more",
      marketFloatsSteamIsLimiting: "Market floats: Steam is limiting requests, I'll finish later.",
      rankingExceptionallyLowFloatAt: "Ranking: exceptionally low float, at most 1 in 1000 copies in this wear have a lower one",
      rankingExceptionallyHighFloatAt: "Ranking: exceptionally high float, at most 1 in 1000 copies in this wear have a higher one (the worst possible, sometimes valued, e.g. \u201Cmax float\u201D)",
      marketTheLowestFloatAmong: "Market: the lowest float among {n} checked listings of this item (their lowest is {min})",
      marketTheHighestFloatAmong: "Market: the highest float among {n} checked listings of this item (their highest is {max})",
      floatOnlyOfAllCopies: "Float {float}: only {lower} of all copies in {wear} have a lower one (this skin's range in this wear is {lo}-{hi}). Click to compare with the listings on the market.",
      clickToCompareTheFloat: "Click to compare the float with the listings on the market.",
      listingsWithAKnownPattern: "Listings with a known pattern",
      amongChecked: "({hits} among {all} checked)",
      pattern: "Pattern",
      price2: "Price",
      nearlyAtThePriceOf: "Nearly at the price of the cheapest listing, the seller may not know what they have",
      cheap: "cheap",
      floatAgainstTheMarket: "Float against the market",
      close: "Close",
      yourFloat: "Your float",
      exceptionallyLowFloat: "Exceptionally low float",
      exceptionallyHighWorstFloat: "Exceptionally high (worst) float",
      lower: "lower",
      higher: "higher",
      suchAnItemCanBe: "Such an item can rank among the best in the world",
      theWorstFloatsHaveCollectors: "The worst floats have collectors too (e.g. \u201Cmax float\u201D)",
      atMost1In1000: "<b>{super}</b>, at most 1 in 1000 copies in this wear have a {super2} one. {super3}: before you sell it, check its place in a float database (e.g. CSFloat, SIH) and don't list it at the price of an ordinary copy.",
      youCanCheckThePlace: "You can check its rank among known copies (e.g. \u201C#3 lowest\u201D) in float databases:",
      theyOpenInANew: "they open in a new tab, I don't send them anything myself.",
      inForThisSkinOnly: 'In {wear} (for this skin {lo}-{hi}) only <b>{lower}</b> of all copies have a lower float, so yours beats <b>{lower2}</b>.<br><span class="sub">Valve rolls the wear first, then the float evenly within its range, so this is an exact share, no outside databases needed. The lowest possible in this wear: {best}.</span>',
      iDontKnowTheFloat: "I don't know the float range of this skin, I only show the comparison with the market.",
      downloadingListingsFromTheMarket: "downloading listings from the market\u2026",
      steamGaveNoFloatsFor: "Steam gave no floats for the listings of this item ({all} listings checked), so comparing with the market isn't possible without outside services.",
      onTheMarketListingsI: "On the market: {total} listings, I checked the {all} cheapest ({withF} with a float).",
      aLowerFloatThanYours: "<b>{lower}</b> of them have a lower float than yours",
      theLowestFor: ", the lowest {float} for <b>{price}</b>",
      youHaveTheLowestFloat: "you have the lowest float among the checked listings",
      cheapestListing: "Cheapest listing",
      lowerThanYours: "lower than yours",
      higherThanYours: "higher than yours",
      aboveTheCheapest: "above the cheapest",
      listingsWithAFloatSimilar: "Listings with a float similar to yours. If they're clearly pricier than the cheapest, that's how much buyers are willing to pay extra for such a float (as long as someone buys them). Only the listings I checked count (the {all} cheapest).",
      cheapestListingTo: "\u{1F4CC} {name}: cheapest listing {low} to {low2} ({low3}{low4}%)",
      buyersNowPaySellingRight: "\u{1F4CC} {name}: buyers already pay {price}, selling right away pays off",
      steamIsLimitingRequestsIll: "\u{1F4CC} Steam is limiting requests, I'll check the marked ones in the next round.",
      oneMomentTheInventoryIs: "One moment, the inventory is still refreshing. Listing turns on once the current state arrives.",
      selectedInTheInventory: "selected in the inventory",
      fromYourInventoryAlsoListed: "from your inventory (including listed and locked ones)",
      logInToSteam: "Log in to Steam.",
      loadingTheInventory: "Loading the inventory\u2026",
      inventoryItems: "Inventory: {items} items.",
      inventoryOnTheMarket: "Inventory: {listed} on the market.",
      couldntRefreshTheInventory: "Couldn't refresh the inventory: ",
      couldntLoadTheListingsFrom: "Couldn't load the listings from the market: ",
      steamIsLimitingRequestsValuation: "Steam is limiting requests, valuation paused, try again in a few minutes.",
      valuedItemsSteamPrices: "Valued {n} items (Steam prices).",
      inventoryCouldntFindMaybeYou: "Inventory: couldn't find \u201C{hash}\u201D, maybe you no longer have it.",
      locked: "locked",
      onTheMarket: "on the market",
      items: "Items",
      sellable2: "sellable",
      locked2: "locked",
      steamValue: "Steam value",
      valuing: "valuing",
      everythingInTheInventory: "everything in the inventory",
      withoutAPrice: "without a price",
      sellableNow: "Sellable now",
      pcs: "pcs",
      youGet: "you get",
      onTheMarket2: "On the market",
      undercut: "undercut",
      selected: "Selected",
      selectedEntries: "Selected {selG} entries ({selVal})",
      availableWhenTheInventoryHas: "Available when the inventory has refreshed",
      couldntRefreshTheInventory2: "Couldn't refresh the inventory ({err}).",
      showingTheStateFromSelling: "Showing the state from {at}, selling is off.",
      tryAgain: "Try again",
      showingTheInventoryFromRefreshing: "Showing the inventory from {at}, refreshing. Listing turns on once the current state arrives.",
      noItemsInThisView: "No items in this view, change the \u201CShow\u201D filters.",
      noItems: "No items.",
      availableWhenTheInventoryHas2: "Available when the inventory has refreshed (the saved state is shown now)",
      aGameDrop: "a game drop",
      fromAnOperationPassMissions: "from an operation (pass / missions)",
      rewardForALevelRank: "reward for a level / rank",
      gift: "gift",
      aGameDropOnSteam: "a game drop on Steam",
      storePurchase: "store purchase",
      received: "received",
      bought: "bought",
      fromACase: "from a case",
      fromATerminal: "from a terminal",
      fromATrade: "from a trade",
      fromAContract: "from a contract",
      aDefaultItemEveryPlayer: "A default item every player gets (it shows in the inventory when it has a name tag or a sticker, or when it's a default music kit)",
      defaultItemFromTheGame: "default item from the game",
      boughtOnTheMarketFor: "Bought on the market {date} for {cost}",
      droppedFromACaseCost: "Dropped from a case {detail} ({date}). Cost = case + key: {cost}",
      boughtInTheTerminalCost: "Bought from the terminal {detail} ({date}). Cost = terminal + in-game payment: {cost}",
      nothingAGift: "nothing, a gift",
      fromATradeCostThe: "From a trade{detail} ({date}). Cost = the value of what you gave ({gave}) converted to this item: {cost}",
      fromAContractCostThe: "From a contract ({date}). Cost = the value of the items given: {cost}",
      steamTradingCardsBackgroundsAnd: "Steam trading cards, backgrounds and emoticons drop for playing games. Neither the market history nor the Steam inventory history has a purchase of this item that would still be left (e.g. it dropped before the history begins), so it's most likely a drop, cost 0.",
      forAllUnits: ", for all {qty} units",
      sellingAtTheLowestPrice: "selling at the lowest price",
      estimatedCost: " (estimated cost)",
      whatYouGetWhenMinus: "What you get after {what} minus what it cost you{approx}{g}",
      perUnit: "Per unit",
      result: "result",
      workingOutTheCost: "Working out the cost\u2026",
      couldntWorkOutTheCost: "Couldn't work out the cost",
      cost: "cost",
      whatItCostYou: "What it cost you",
      estimatedThisPurchaseIsNot: " (estimated, this purchase isn't in the trade history, so it uses that day's market price)",
      estimated: " (estimated)",
      todayYoudGet: "; today you'd get {net}",
      free: "free",
      showOnTheSteamMarket: "Show on the Steam market",
      theSameWearAndStattrak: "The same wear and StatTrak/Souvenir, opens in a new tab",
      listedOnTheMarketYou: "Listed on the market, change the price in the Market tab under My listings",
      takesTheListingOffThe: "Takes the listing off the market and the item goes back to the inventory. I'll ask for confirmation first.",
      takeOff: "Take off",
      identicalUnitsInThisGroup: "{qty} identical units in this group (the same cost and lock state)",
      onTheMarketFor: "on the market for",
      checkingTheMarket: "checking the market\u2026",
      undercutCheapest: "undercut, cheapest {low}",
      yoursIsTheCheapest: "Yours is the cheapest",
      whatYouGetAfterThe: "What you get after the fee at your listing price; below it the lowest price on the market",
      youGet2: "you get",
      market: "market",
      sellingAtYourListingPrice: "selling at your listing price",
      listOnTheMarketA: "List on the market. A window opens with the suggested price (the one from the \u201CList for\u201D box), the fastest price and your own, and shows what you get and the chance it sells.",
      list: "List",
      sellRightAwayToThe2: "Sell right away to the highest buy order (usually cheaper). I'll show the price and ask for confirmation first.",
      now: "Now",
      illListThisItemMyself: "I'll list this item myself when the trade lock ends",
      changeTheSalePlan: "Change the sale plan",
      planASale: "Plan a sale",
      youGetWhatYouGet: "You get = what you receive after Steam's fee. Market = the lowest price on the Steam market (what the buyer pays)",
      sellPer24h: " \xB7 {volume} units sell per 24h",
      forAllUnitsTogetherThe: "\n\nFor all {qty} units together, the line below is one unit.",
      stickersPriceOfNewOnes: "Stickers (price of new ones on the market)",
      appliedOnesUsuallyRaiseThe: "Once applied, they usually raise the skin's price by only a fraction of this amount (often 5-15%), unless they're rare stickers.",
      stickers2: "stickers",
      thisItemCantBeSold: "This item can't be sold on the market",
      unsellable2: "unsellable",
      until: "until ",
      tradeLock: "trade lock",
      theItemHasATrade: "\n\nThe item is trade locked, this is today's state and you can only sell it after the lock ends.",
      downloadingThePriceHistoryOf: "Downloading the price history of this item: I'll check whether the price is falling and whether it is exceptionally high now\u2026",
      checking: "checking",
      trendCheckedThePriceIsnt: "\n\nTrend checked: the price isn't falling and isn't exceptionally high now.",
      thePriceIsNormalNot: "The price is normal and not falling, and you're not in profit against the buy price, so nothing argues for selling now",
      hold: "hold",
      steamHasNoPriceHistory: "Steam has no price history for this item (too few sales)",
      noPriceHistory: "no price history",
      noSellableItems: "No sellable items.",
      refreshingSteamPricesForItems: "Refreshing Steam prices for {list} items (~{min} min)\u2026",
      saved: "saved",
      noSavedPrice: "no saved price",
      noListingsOnTheMarket: "no listings on the market",
      chanceToSellWithinFrom: "chance to sell within {horizon}: {chance} (from the item's history)",
      aCentBelowTheCheapest: "a cent below the cheapest ({cheapest}), no sales data",
      inDaysOnlyOfUnits: "in {days} days only {n} of {total} units sold at this price or higher",
      shouldSellCheaperListingsAhead: "should sell {wait}, {ahead} cheaper listings ahead of you",
      aCentBelowTheCheapest2: "a cent below the cheapest ({cheapest})",
      sellingRightAwayToThe: " \xB7 selling right away to the order gets you almost as much ({price})",
      theCheapestListingsAreClearly: " \xB7 the cheapest listings are clearly below the typical price",
      raisedToTheMinimum: ", raised to the minimum",
      noBuyOrders: "no buy orders",
      highestOrderPcs: "highest order ({buyGraph} pcs)",
      lowest: "lowest",
      suggested: "Suggested",
      rightAwayToTheBuy2: "right away to the buy order, waiting doesn't pay",
      chanceWithin2: "chance within {N}: {chance}",
      fastest: "Fastest",
      aCentUnderTheCheapest: "a cent under the cheapest ({cheapest})",
      toTheHighestBuyOrder: "to the highest buy order",
      saved2: "Saved",
      yourTargetPrice: "your target price",
      enterThePriceTheBuyer: "Enter the price the buyer will pay (e.g. 1.85), or click one of the options.",
      perUnitInTotal: " per unit, <b>{recv}</b> in total",
      youGet3: "You get <b>{recv}</b>{qty}",
      resultAgainstTheCost: "Result against the cost",
      perUnit2: " per unit",
      doesntExistOnSteamThe: "{v} doesn't exist on Steam, the listing will show as {listed}",
      chanceToSellWithin: "Chance to sell within {N}",
      fromTheItemsHistory: "(from the item's history)",
      notAboveTheHighestBuy: "Not above the highest buy order, it will sell right away.",
      cheaperThanNeededToBe: "Cheaper than needed to be the first listing (cheapest: {cheapest})",
      belowYourMinimum: "Below your minimum ({min})",
      belowTheLowestPriceOn: "{listed}% below the lowest price on the market!",
      priceTheBuyerPays: "Price (the buyer pays)",
      listOnTheMarket: "List on the market",
      invalidPriceNothingListed: "Invalid price, nothing listed.",
      for: "for {price}",
      atTheSuggestedPrice: "at the suggested price{min}",
      thenTheAutomationWatchesThe: ", then the automation watches the price",
      ofPcs: " of {qty} pcs",
      plannedSaleClickToChange: "Planned sale{qty}: {until}, {how}. Click to change or remove.",
      illList: "I'll list",
      lockedUntilThenFlipsterLists: "Locked until {until}. Then Flipster lists the item by itself if some Steam page is open (if not, the next time one is opened). You still confirm the listing in the Steam app.",
      suggestedPriceOfTheUnlock: "Suggested price on the unlock day",
      today: "today",
      notBelow: "not below",
      noLimit: "no limit",
      fixedPrice: "Fixed price",
      theBuyerPays: "(the buyer pays)",
      howMany: "How many",
      of: "of",
      afterListingLetTheAutomation: "After listing, let the automation watch this listing",
      itUndercutsCheaperOnesBut: "it undercuts cheaper ones, but won't go below your minimum (with a fixed price, below that price)",
      theAutomationIsOffNow: ". The automation is off now, turn it on in Market, My listings, with the Auto button",
      removeThisPlan: "Remove this plan",
      salePlan: "Sale plan",
      save: "Save",
      plan: "Plan",
      salePlanRemoved: "Sale plan removed: {hash}",
      enterAFixedPriceE: "Enter a fixed price (e.g. 1.85), the plan was not saved.",
      theAutomationNeedsALower: "The automation needs a lower limit: fill in \u201Cnot below\u201D. The plan was not saved.",
      notBelow2: ", not below {min}",
      plannedTheSaleOfFor: "Planned the sale of {hash}{qty} for {until}: {mode}{guard}.",
      plannedSaleOf3Days: "Planned sale of {hash}: 3 days after the lock ended there's still no sellable copy, plan removed.",
      raisedToYourMinimum: " (raised to your minimum)",
      plannedSaleOfNoMarket: "Planned sale of {hash}: no market price, I'll try again.",
      plannedSale: "Planned sale",
      confirmInTheSteamApp: ", confirm in the Steam app",
      plannedSaleOfListedOf: "Planned sale of {hash}: listed {ok} of {copies} for {price}{note}{confirm}.",
      theAutomationIsOffTurn: ". The automation is off, turn it on in Market, My listings, with the Auto button",
      theAutomationWatchesThePrice: "{hash}: the automation watches the price, it won't go below {floor}{autoRelist}.",
      carefulBelowTheLowestPrice: "Careful: {price}% below the lowest price!",
      sellImmediately: "Sell immediately",
      quickSale: "Quick sale",
      youGet4: "You get",
      selectSellableItems: "Select sellable items.",
      bulkSale: "Bulk sale",
      suggestedTheHighestPriceThat: "Suggested, meaning the highest price that should sell in ~{maxWaitDays} days (\u201CList for\u201D on the cards)",
      lowestPriceUndercutNotBelow: "Lowest price \u2212 undercut ({undercut}), not below the saved min",
      immediatelyToTheHighestBuy: "Immediately, to the highest buy order",
      savedTargetPrices: "Saved target prices",
      entriesInTheNextStep: "{gs} entries. In the next step you'll see the prices and can correct them before listing.",
      next: "Next",
      enterAFixedPrice: "Enter a fixed price.",
      item: "Item",
      totalYouGet: "Total (you get)",
      anEmptyFieldSkip: "Leave a field empty to skip it.",
      confirmThePrices: "Confirm the prices",
      carefulLowPrices: "Careful, low prices",
      entriesHaveAPriceOver: "{ref} entries have a price over 25% below the lowest market price. Are you sure?",
      yesList: "Yes, list",
      saleListedErrors: "Sale: {ok} listed, {failed} errors.",
      listingsWaitForConfirmationIn: "{confirm} listings are waiting for confirmation. In the Steam app open Confirmations and tap \u201CConfirm all\u201D to approve them at once.",
      takeOffTheMarket: "Take off the market?",
      listings: ", {n} listings",
      for2: "for",
      theItemReturnsToThe: "The item goes back to the inventory.",
      takenOffTheMarket: "Taken off the market: {name}",
      couldntTakeOffHttp: "Couldn't take off {name} (HTTP {status})",
      lowestPriceOnTheMarket: "lowest price on the market"
    },
    invhistory: {
      steamTooManyRequests429: "Steam: too many requests (429)",
      steamReturnedNoInventoryHistory: "Steam returned no inventory history (log in)",
      profileNotRecognised: "profile not recognised"
    },
    listings: {
      pcs: "pcs",
      notOnTheMarketYet: "not on the market yet",
      youGet: "you get",
      steamListsThisItemOnly: "Steam lists this item only after you confirm it in the mobile app, until then buyers can't see it",
      waitingForConfirmation: "waiting for confirmation",
      confirmItInTheSteam: "Confirm it in the Steam app, under Confirmations",
      newPriceSetInFlipster: " (new price set in Flipster)",
      tradeLocked: "trade locked",
      thenTheAutomation: " \xB7 then the automation takes over",
      suggested: "suggested",
      notBelow: "not below {min}",
      noLowerLimit: "no lower limit",
      whenTheLockEndsFlipster: "When the lock ends, Flipster lists this item by itself (if some Steam page is open). You confirm the listing in the Steam app.",
      illListIt: "I'll list it",
      youChangeThePlanOn: "Change the plan on the item card in Inventory",
      changeInInventory: "Change in Inventory",
      removePlan: "Remove plan",
      checkingTheMarket: '<div class="sub" style="margin-top:4px">checking the market\u2026</div>',
      cheapest: "cheapest",
      todayNoMarketData: "today: no market data",
      yourPrice: "your price",
      yourMinimum: "your minimum",
      suggestion: "suggestion",
      today: "today",
      chanceWithin: "chance within {days}",
      notAboveTheBuyOrder: "not above the buy order ({highestBuy}), it will sell right away",
      tooPriceyTodaySmallChance: "too pricey today, small chance",
      considerALowerPrice: ", consider a lower price",
      willProbablyWaitLongerThan: "will probably wait longer than {days}",
      looksGood: "looks good",
      loadsYourListingsAndChecks: "Loads your listings and checks competitor prices",
      refresh: "Refresh",
      whileThePanelIsOpen: "While the panel is open on this tab, listings and competition refresh by themselves. Set how often in the \u2699 next to it.",
      howToCalculateSuggestedPrices: "How to calculate suggested prices and competition, how often to refresh",
      downloadsTheOrderBookAnd: "Downloads the order book and the full price history of the items you have listed from the Steam market and saves them to a file, for a joint analysis of whether and at what price to sell. Read only, it buys and lists nothing.",
      dataForAnalysis: "Data for analysis",
      clickToTurnTheAutomation: 'Click to turn the automation on or off. Every few minutes it undercuts the competition for listings where you tick "Automation watches this listing" in \u2699 and set a lowest price.',
      automationSettingsHowOftenUndercut: "Automation settings: how often, undercut, raising the price",
      timeToSell: "Time to sell",
      theSuggestedPriceListFor: 'the suggested price ("List for", "Set") should sell within this time',
      skipListingsBelowTheNormal: "Skip listings below the normal price",
      iDontGoDownTo: "I don't drop to their price if they'll sell quickly anyway",
      refreshEvery: "Refresh every",
      whileThePanelIsOpen2: "while the panel is open on this tab I load your listings and check the competition (more often means more requests to Steam)",
      setSuggestedPrices: "Set suggested prices",
      remove: "Remove",
      deselect: "deselect",
      selectAll: "select all",
      item: "Item",
      yourPrice2: "Your price",
      market: "Market",
      suggestedPrice: "Suggested price",
      salePlanRemoved: "Sale plan removed: {hash}",
      youListedOnTheMarket: "you listed on the market",
      sellWithin: "sell within {d}",
      skippingUnderpriced: " \xB7 skipping underpriced",
      refreshEveryMin: "refresh every {refreshMin} min",
      automationOn: "Automation on.",
      automationOff: "Automation off.",
      auto: "Auto",
      on: "on",
      off: "off",
      automation: "Automation",
      everyMinutes: "Check every (minutes)",
      howMuchCheaperThanThe: "How far below the cheapest other listing the automation sets the price (also used by the \u201CLowest \u2212 undercut\u201D option in the List window)",
      undercutByZ: "Undercut by (z\u0142)",
      checkNow: "Check now",
      youTurnTheAutomationOn: 'You turn the automation on and off with the "Auto" button on the bar. Every few minutes it prices listings one undercut below the cheapest competitor. When the rest are pricier, it raises the price, but at most to the suggested one (above that the item would hardly sell). It only touches listings where you tick "Automation watches this listing" in "\u2699" and set a <b>lowest price</b>, and it never goes below it. You still confirm every change in the Steam app.',
      close: "Close",
      automationCheckingNow: "Automation: checking now.",
      youdGetAlmostTheSame: "you'd get almost the same right away (buy order {highestBuy})",
      pricedLikeAPlainCopy: "priced like a plain copy, float and stickers aren't included",
      lessThanAnHour: "less than an hour",
      aboutH: "about {d} h",
      aboutDays: "about {d} days",
      sellRightAwayToThe: "sell right away to the buy order ({price}), waiting won't give more on average",
      chanceToSellWithinFrom: "chance to sell within {days}: {chance}% (from the item's last month of history)",
      evenAtALowerPrice: "even at a lower price the chance is below 50%, the market is slow",
      afterAFewDaysThe: "after a few days the price was usually lower, don't wait too long",
      limitedByYourMaximum: "limited by your maximum",
      aheadOfYou: ", {ahead} ahead of you",
      inDaysOnlyOfUnits: "in {days} days only {n} of {total} units sold at this price or more{ahead}",
      aheadOfYouListingsGo: " ({ahead} ahead of you, listings sell at {rate}/day)",
      sellsIn: "sells in {waitDays}{ahead}",
      moreThanTheCheapestListing: "{price} more than the cheapest listing",
      thePriceIsFallingI: "the price is falling, I halved the waiting time",
      yourMinimumIsAboveThe: "your minimum is above the market, it may not sell for a long time",
      yourMaximum: "your maximum",
      cheaperThanTheCheapestCompetitor: "{comp} cheaper than the cheapest competitor",
      steamDoesntAllowACloser: " (Steam doesn't allow a closer price)",
      theCompetitionIsBelowThe: "the competition is {comp}% below the typical price, you can wait",
      nobodyElseSellsYourMaximum: "nobody else sells, your maximum",
      nobodyElseSellsTheAverage: "nobody else sells, the average of the last 7 days",
      youHaveAUniqueCopy: "you have a unique copy (float/stickers), the cheapest listing may be worse than yours",
      onlyOfCopiesInHave: "Only {lower} of copies in {wear} have a lower float. Click to compare with market listings.",
      clickToCompareTheFloat: "Click to compare the float with market listings.",
      tooPricey: "too pricey",
      pricey: "pricey",
      cheapYouCanAskMore: "cheap, you can ask more",
      fine: "fine",
      nobodyElseSells: "nobody else sells",
      checking: "checking\u2026",
      tie: "tie",
      someoneIsCheaper: "someone is {buyer} cheaper",
      selected: "{sel} selected:",
      youHaveNothingListedYou: '<tr><td colspan="6" class="empty">You have nothing listed. Items are listed from the Inventory tab.</td></tr>',
      listed: "listed {created}",
      theAutomationShouldWatchThis: "The automation should watch this listing, but without a lowest price it skips it. Set one in \u2699.",
      theAutomationShouldWatchThis2: `The automation should watch this listing (not below {min}), but it's off. Turn it on with "\u2699 Auto" at the top.`,
      theAutomationWatchesThePrice: "The automation watches the price and won't go below {min}",
      off2: " (off)",
      theChanceThatSomeonePays: `The chance that someone pays your current price within {days}, based on this item's last month of history, hour by hour (the suggested price next to it is calculated the same way). You set the waiting time in "sell within \u2026 days".`,
      chanceWithin2: "chance within",
      cheapestOther: "cheapest other",
      theCheaperListingsAreBelow: "The cheaper listings are below this item's normal price and at its sales pace they will sell within your selling time, so waiting pays more than going down to them.",
      skippingUnderpricedCheapest: "skipping underpriced, cheapest",
      last30Days: "\nlast 30 days: {d30}",
      theAveragePriceThisItem: "The average price this item actually sold for:\nlast 7 days: {d7} ({sold7} pcs){d30}",
      sellsAt: "sells at",
      market2: "market",
      waitingForMarketData: '<span class="sub">waiting for market data\u2026</span>',
      removesTheListingAndLists: "Removes the listing and lists it again at {price} (asks first)",
      set: "Set",
      priceOk: "price OK",
      removeFromTheMarketIt: "Remove from the market, it goes back to the inventory",
      yourOwnPriceMinimumMaximum: "Your own price, minimum/maximum price and automation",
      changeThePriceNow: "Change the price now",
      price: "Price",
      eG150: "e.g. 150",
      listAtThisPrice: "List at this price",
      oneOffIRemoveThe: "one-off, I'll remove the listing and relist it at this price, you confirm in the Steam app",
      priceLimits: "Price limits",
      priceFrom: "Price from",
      theLowestPriceTheSuggested: "Lowest price, neither the suggested price nor the automation ever goes below it",
      none: "none",
      to: "to",
      theHighestPriceTheAutomation: "Highest price, the automation won't raise the price above it and the suggested price won't be higher either",
      theSuggestedPriceAndThe: "the suggested price and the automation stay within these limits, an empty field means no limit",
      automationWatchesThisListing: "Automation watches this listing",
      everyFewMinutesItUndercuts: "every few minutes it undercuts cheaper ones and never goes below the minimum",
      theAutomationIsOffNow: 'The automation is off now, turn it on with "\u2699 Auto" at the top',
      enterTheLowestPricePrice: 'enter the lowest price ("Price from"), without it the automation skips this listing',
      plannedListedWhenTheTrade: "Planned (listed when the trade lock ends)",
      thatsLessThanNow: "That's {price}% less than now.",
      changeThePrice: "Change the price?",
      theListingIsRemovedAnd: "The listing will be removed and listed again, you confirm it in the Steam app.",
      changePrice: "Change price",
      confirmInTheSteamApp: ", confirm in the Steam app",
      newPrice: "{name}: new price {price}{confirm}",
      couldntChangeThePrice: "{name}: couldn't change the price",
      priceChangeStoppedCheckThe: "Price change stopped: {message}, check the inventory.",
      removeFromTheMarket: "Remove from the market?",
      for: "for",
      theItemGoesBackTo: "The item goes back to the inventory.",
      removed: "removed",
      httpError: "HTTP error {status}",
      theSelectedListingsAlreadyHave: "The selected listings already have the suggested price (or there is no market data).",
      changeThePrices: "Change the prices?",
      andMore: "and {jobs} more",
      change: "Change {jobs}",
      priceChangeOkErrors: "Price change: {ok} OK, {failed} errors.",
      listingsWaitForConfirmationIn: "{confirm} listings are waiting for confirmation. In the Steam app open Confirmations and tap \u201CConfirm all\u201D to approve them at once.",
      noLoggedInSteamSession: "No logged-in Steam session found.",
      inTheSteamAppOpen: "In the Steam app open Confirmations and tap \u201CConfirm all\u201D",
      listingsWaitForConfirmationIn2: "listings are waiting for confirmation in the app, approve them all at once",
      loadedSellListings: "Loaded {rows} sell listings.",
      errorLoadingListings: "Error loading listings: ",
      refreshing: '<span class="acc">refreshing\u2026</span>',
      refreshedNextIn: "refreshed {last} \xB7 next in {left}:{left2}",
      listingUndercut: "listing undercut",
      listingsUndercut: "listings undercut",
      tied: "tied",
      atTheCurrentPriceThe: "At the current price the chance to sell is below 25%, see the suggested price",
      tooPriceyByTheHistory: "too pricey for its history",
      theyWillSellAlmostSurely: "They'll almost certainly sell, and the suggested price is higher",
      tooCheap: "too cheap",
      allYourListingsAreThe: "all your listings are the cheapest",
      undercutListings: "Undercut listings",
      someoneUndercutYouYours: "Someone undercut you: {hash}, {comp} (yours {buyer})",
      selectSomeListings: "Select some listings.",
      removeTheListings: "Remove the listings?",
      removeListingsFromTheMarket: "Remove {sel} listings from the market? The items go back to the inventory.",
      noListingsWithAutoMin: "no listings with auto + min",
      raisingToTheSuggestedPrice: "raising to the suggested price, it would hardly sell higher",
      itWouldHardlySellHigher: "it would hardly sell higher",
      errors: ", errors: {failed}",
      changed: "changed {ok}/{jobs}{failed}",
      autoRelistOkErrors: "[auto] relist: {ok} OK, {failed} errors.",
      checkedNoChanges: "checked {ruled}, no changes",
      off3: "off",
      runsInAnotherTab: "runs in another tab",
      working: "working\u2026",
      nextInMin: "next in {min} min",
      last: "last",
      cheaperListings: {
        one: "1 cheaper listing",
        other: "{count} cheaper listings"
      }
    },
    markettrend: {
      skinMarket: "skin market",
      caseMarket: "case market",
      stickerMarket: "sticker market",
      market: "market"
    },
    patterndb: {
      gmXmlhttprequestUnavailable: "GM_xmlhttpRequest unavailable",
      badResponse: "bad response",
      networkError: "network error"
    },
    patternmark: {
      knownPatternSeedSourceThe: "Known pattern, seed {seed}: {what}{label}. Source: {src}.\nThe lists on pattern sites don't always agree, so look at this copy in game or in the inspect view before pricing it."
    },
    "relist-engine": {
      inventorySnapshot: "Inventory snapshot {appid}/{contextid}\u2026",
      removing: "removing\u2026",
      removedWaitingForTheInventory: "removed, waiting for the inventory\u2026",
      removingFailedHttp: "removing failed (HTTP {status})",
      couldntRemoveHttp: "Couldn't remove {hash} (HTTP {status})",
      waitingForItemsToCome: "Waiting for {pending} items to come back to the inventory\u2026",
      notFoundInTheInventory: "not found in the inventory, list it by hand",
      removedButNotFoundIn: "{hash}: removed but not found in the inventory, list it by hand!",
      listing: "listing\u2026",
      confirmInTheApp: ", confirm in the app",
      listedFor: "listed for {shown}{confirm}",
      toConfirm: " (needs confirming)",
      listingFailedTheItemIs: "listing failed: {msg} (the item is in the inventory)",
      listingFailedTheItemIs2: "{hash}: listing failed, {msg}. The item is in the inventory.",
      listedFor2: "listed for {shown}",
      confirmInTheSteamApp: " (confirm in the Steam app)",
      listedYouGetTheBuyer: "Listed {hash}: you get {price}, the buyer pays about {shown}{confirm}"
    },
    research: {
      dataForAnalysisThePrevious: "Data for analysis: the previous download is still running.",
      dataForAnalysisThereAre: "Data for analysis: there are no items here.",
      collectDataForAnalysis: "Collect data for analysis?",
      illDownloadTheOrderBook: `I'll download the order book and the full price history of <b>{items}</b> items {where} from the Steam market (about {min} min) and save them to <b>flipster-dane-do-analizy.json</b> in your browser's download folder.<br><span class="sub">Read only, nothing is bought or listed. The file holds only public market data and the fee settings, nothing about your account.</span>`,
      collectData: "Collect data",
      dataForAnalysisDownloadingItems: "Data for analysis: downloading {items} items\u2026",
      dataForAnalysisSteamIs: "Data for analysis: Steam is limiting requests, saving what I already have.",
      dataForAnalysisNothingWas: "Data for analysis: nothing was downloaded.",
      withoutPriceHistory: " ({failed} without price history)",
      dataForAnalysisSavedItems: "Data for analysis: saved {items} items to flipster-dane-do-analizy.json{failed}.",
      marketSampleSteamIsLimiting: "Market sample: Steam is limiting requests ({what}), waiting 2 min and carrying on\u2026",
      marketSampleForAnalysis: "Market sample for analysis",
      firstIllGoThroughA: `First I'll go through a list of about 3000 of the most popular CS2 items on the Steam market (names and prices only, a few minutes, Steam gives them 10 at a time). From it I'll draw as many items as you pick below, evenly from every kind ({KINDS}) and price range, and only for those download the full price history and the order book. It's saved to <b>flipster-probka-rynku.json</b>, for testing Flipster's algorithms on more than your own items.<br><br>
    How many items: <select id="ms-n"><option value="200">200 (about 5-8 min)</option><option value="400" selected>400 (about 10-15 min)</option><option value="800">800 (about 20-30 min)</option></select><br>
    <span class="sub">Read only, nothing is bought or listed. When Steam limits requests I wait and carry on, and Stop saves what's already there. Other Flipster features may be slower meanwhile.</span>`,
      downloadSample: "Download sample",
      steamTooManyRequests429: "Steam: too many requests (429)",
      marketSamplePopularList: "Market sample: popular list {pool}\u2026",
      marketSampleStoppedBeforeDownloading: "Market sample: stopped before downloading histories.",
      marketSampleDrewOfPopular: "Market sample: drew {pick} of {pool} popular items ({byKind}). Downloading price histories\u2026",
      orderBooks: "order books",
      priceHistories: "price histories",
      marketSampleSteamKeepsLimiting: "Market sample: Steam keeps limiting requests, saving what I already have.",
      marketSample: "Market sample: {i}/{pick}\u2026",
      marketSampleNothingWasDownloaded: "Market sample: nothing was downloaded.",
      marketSampleSavedItemsTo: "Market sample: saved {items} items to flipster-probka-rynku.json."
    },
    sellsignals: {
      hold: "hold",
      theFeeEatsOfThe: "The fee eats {net}% of the price. The buyer pays {lowest} and you get {net2}. Better keep it or use it in a trade-up contract.",
      inProfit: "in profit +{net}%",
      youBoughtItForToday: "You bought it for {cost}, today you'd get {net}.",
      priceyNow: "pricey now",
      overTheLast2Days: "Over the last 2 days it sold for {recent} on average ({recentVol} units), {recent2}% more than earlier this month ({base}). The cheapest listing is {lowest}. A good moment to sell before the price returns to normal.",
      priceFalling: "price falling",
      lastWeeksAverageIsLower: "Last week's average ({a7}) is {a72}% lower than in the 3 weeks before ({prev}).",
      in: "in",
      thisOnlyTellsWhatAlready: "This only shows what has already happened. Across 650 market items, such moves predicted neither a further fall nor a rebound.",
      halfAYear: "half a year",
      "3Months": "3 months",
      monthlyMedianSalePriceHalf: "Monthly median sale price: half a year ago {m6}, 3 months ago {m3}, now {now} ({t} in {span}).",
      theWholeMarket: "The whole market",
      ofCs2OverThatTime: "{who} in CS2 over the same time: {m} (median of {n} popular items, checked {at})."
    },
    settings: {
      sources: "Sources",
      pricesOrders: "prices/orders",
      volume: "volume",
      inventory: "inventory",
      listingsHistory: "listings/history",
      pages: "pages",
      quickPrices: "quick prices",
      quickPriceCheck: "Quick price check of Steam items",
      search: "search",
      every: "every",
      general: "General",
      language: "Language",
      automaticFollowsYourBrowserPolish: "Automatic follows your browser: Polish for a Polish browser, English otherwise. The page reloads after a change.",
      automatic: "Automatic",
      inventory2: "Inventory",
      pricesAndFloatOnThe: "Prices and float on the Steam inventory page",
      onTheRegularInventoryPage: "On the regular inventory page, outside the Flipster window, every item shows its market price and float.",
      sellBadgeThreshold: "Sell badge threshold",
      howBigAPriceChange: 'The price change at which items in the Inventory tab get the "in profit", "pricey now" and "price falling" badges. A higher threshold means fewer badges.',
      rarePatterns: "Rare patterns",
      itemsWithARareSought: `Items with a rare, sought-after pattern (seed) get a frame and a \u{1F48E} badge in Inventory, Market and the float check. Pattern sites don't always agree, so \u{1F48E} means "take a closer look".`,
      communityDatabaseCs2pattern: 'Community database <a class="acc" href="https://github.com/Helyux/cs2pattern" target="_blank" rel="noopener">cs2pattern</a>',
      flipsterAlsoKnowsAFew: 'Flipster also knows <span class="hint" title="{famous}">a few famous patterns</span> checked by hand.',
      refresh: "refresh",
      yourOwnPatterns: "Your own patterns",
      oneSkinPerLineE: "One skin per line, e.g.",
      writeASeedRangeLike: "Write a seed range like 100-110, and the note after = is optional.",
      toCheck: "to check",
      requestsToSteam: "Requests to Steam",
      howManyRequestsFlipsterSent: 'How many requests Flipster sent (all open tabs together) and how many times Steam answered "too many requests" (429). Only a measurement, it changes nothing.',
      backup: "Backup",
      backupFile: "Backup file",
      settingsMinMaxPricesWatched: "Settings, min/max prices, watched and pinned \u{1F4CC} items, saved trades, terminal amounts and your patterns. Handy when you change computer or browser.",
      save: "Save",
      load: "Load",
      advanced: "Advanced",
      logAtTheBottomOf: "Log at the bottom of the window",
      messagesAboutWhatFlipsterIs: "Messages about what Flipster is doing. When it's off, errors show for a moment in the bar under the window.",
      debugMode: "Debug mode",
      buttonsForCollectingDataFor: "Buttons for collecting data for analysis, the Steam request counter and the version number in the header.",
      pauseBetweenListings: "Pause between listings",
      whenYouListOrRemove: "When you list or remove several listings at once. Shorter is faster, but Steam may start rejecting requests.",
      rememberMarketPrices: "Remember market prices",
      forThisManyMinutesFlipster: "For this many minutes Flipster doesn't ask Steam about the same item again. Your listings, inventory and wallet are always fresh. 0 turns it off.",
      steamRequestPace: "Steam request pace",
      flipsterSlowsDownByItself: "Flipster slows down by itself when Steam rejects requests. Click if everything has been very slow for a long time.",
      now: "Now",
      startOver: "start over",
      rememberedPrices: "Remembered prices",
      removesSavedPricesAndMarket: "Removes saved prices and market data, for when something looks out of date.",
      clear: "clear",
      defaultSettings: "Default settings",
      restoresTheSettingsInThis: "Restores the settings in this tab. Min/max prices, watched items and history stay.",
      restore: "restore",
      accountAndFee: "Account and fee",
      notLoggedIn: "not logged in",
      accountOnASaleSteam: 'Account {steamId}. On a sale Steam takes {feePercent}% (at least {feeMin}{feeBase}) and the game {pubDefault}%, so for you to get {steam} the buyer pays {steam2}. Automations run in only one open Steam tab at a time.<span class="dbg"> Currency ID {currency}.</span>',
      saved: "Saved: {k}",
      yourListHasSkinS: "Your list has {entries} skin(s) and {n} seeds.",
      yourListIsEmpty: "Your list is empty.",
      cantReadLineSThe: "Can't read line(s) {errors} (the format is name: 1, 2, 10-20 = note)",
      seedsForSkinsDownloadedRefreshes: "{seeds} seeds for {skins} skins, downloaded {at}, refreshes itself every week.",
      couldntDownloadIt: "Couldn't download it",
      downloading: "downloading\u2026",
      savedThePatternList: "Saved the pattern list.",
      backupLoadedReloadThePage: "Backup loaded. Reload the page.",
      loadingTheBackupFailed: "Loading the backup failed: ",
      downloadedTheRarePatternDatabase: "Downloaded the rare pattern database.",
      couldntDownloadThePatternDatabase: "Couldn't download the pattern database",
      requestPaceResetTheScript: "Request pace reset, the script will learn it again.",
      clearedRememberedPricesAndMarket: "Cleared remembered prices and market data. Reload the page.",
      resetSettings: "Reset settings",
      restoreTheDefaultSettingsPrice: "Restore the default settings? Price rules, watched items and history stay.",
      restore2: "Restore",
      defaultsRestoredReloadThePage: "Defaults restored. Reload the page.",
      orderBooksPricesCompetition: "order books (prices, competition, \u{1F4CC})",
      yourListingsHistoryPriceHistories: "your listings, history, price histories",
      "24HVolume": "24 h volume",
      itemPages: "item pages",
      marketSearchScannerCases: "market search (scanner, cases)",
      listingRemovingOrders: "listing, removing, orders",
      nothingCountedYet: "Nothing counted yet.",
      kind: "Kind",
      since: "since",
      last24H: "last 24 h",
      total: "total",
      mostFrequentUrls: "Most frequent URLs"
    },
    storehist: {
      gmXmlhttprequestUnavailable: "GM_xmlhttpRequest unavailable",
      networkError: "Network error",
      iCantSeeThePurchase: "I can't see the purchase history, log in on store.steampowered.com in this browser",
      steamPurchaseHistoryEntriesCs2: "Steam purchase history: {rows} entries ({isCS} CS2 purchases).",
      steamPurchaseHistory: "Steam purchase history: "
    },
    trade: {
      tradeAnalysisLoadingInventories: '<b style="color:#fff">Trade analysis</b><div id="stt-tr-body" style="margin-top:6px">Loading inventories\u2026</div>',
      yourInventory: "Your inventory",
      partnersInventory: "Partner's inventory",
      unknownItem: "unknown item",
      more: "more",
      youGive: "YOU GIVE",
      youGet: "YOU GET",
      balanceSteam: "Balance (Steam)",
      youGiveMoreThanYou: '<div style="margin-top:6px;padding:6px;background:#5a1d1d;border-radius:4px;color:#fff">\u26A0 You give more than you get!</div>',
      itemsNotRecognisedPrivateInventory: "items not recognised (private inventory or another game)",
      loadingPrices: "loading prices ({loading})\u2026",
      withoutASteamPrice: "{noPrice} without a Steam price",
      pricesAreTheLowestSteam: "Prices are the lowest Steam listing. Stickers and float aren't included, check them yourself."
    },
    main: {
      market: "Market",
      myListings: "My listings",
      buyOrders: "Buy orders",
      inventory: "Inventory",
      history: "History",
      deals: "Deals",
      worthOpening: "Worth opening?",
      settings: "Settings",
      youDontSeemToBe: "You don't seem to be logged in. Most features need you to be logged in on steamcommunity.com."
    }
  };

  // src/i18n/pl-PL.json
  var pl_PL_default = {
    analysis: {
      noCompetitionMaxPrice: "brak konkurencji \u2192 cena max",
      noCompetition: "brak konkurencji",
      lowestCompetitorUndercut: "najni\u017Csza konkurencja \u2212 podci\u0119cie",
      cappedAtTheMaxPrice: "ograniczono do ceny max",
      raisedToTheMinPrice: "ograniczono do ceny min",
      priceIsOptimal: "cena optymalna",
      raisingIsOff: "podnoszenie wy\u0142\u0105czone",
      outbiddingMax: "przebicie ({t}) > max",
      outbidding: "przebijam",
      loweringTo2ndPlaceStep: "obni\u017Cam do 2. miejsca + krok",
      youAreTheHighest: "jeste\u015B najwy\u017Cej"
    },
    patterns: {
      "661ScarTheBest": "#661 \u201EScar\u201D, najlepszy",
      top: "czo\u0142\xF3wka",
      "909PSyTheBest": "#909 \u201EP**sy\u201D, najlepszy",
      tier1SameMotif: "Tier 1, ten sam motyw",
      togepi: "\u201ETogepi\u201D",
      owlEyes: "\u201ESowie oczy\u201D",
      angryMerchant: "\u201EW\u015Bciek\u0142y kupiec\u201D",
      happyBird: "\u201EWeso\u0142y ptak\u201D",
      booba: "\u201EBooba\u201D",
      sleeperMushroom: "\u201E\u015Apioch / grzybek\u201D",
      memeNumber: "mem z numeru",
      robot: "\u201ERobot\u201D",
      fakeT1SomeYellow: "podr\xF3bka T1 (troch\u0119 \u017C\xF3\u0142tego)",
      fakeT2SomeYellow: "podr\xF3bka T2 (troch\u0119 \u017C\xF3\u0142tego)",
      yourPattern: "Tw\xF3j wz\xF3r",
      yourList: "Twoja lista",
      whiteScope: "Bia\u0142y celownik",
      blueHive: "Niebieski ul",
      orangeHive: "Pomara\u0144czowy ul",
      star: "Gwiazda",
      goldenCat: "Z\u0142oty kot",
      phoenix: "Feniks",
      seeds: "seed\xF3w"
    },
    sample: {
      skins: "skiny",
      knivesAndGloves: "no\u017Ce i r\u0119kawice",
      casesCapsulesTerminals: "skrzynie, kapsu\u0142y, terminale",
      stickers: "naklejki",
      other: "reszta"
    },
    steam: {
      noOrderData: "brak danych o zleceniach",
      steamReturnedNoListings: "Steam nie zwr\xF3ci\u0142 ofert",
      steamGaveNoWalletBalance: "Steam nie poda\u0142 salda portfela (czy jeste\u015B zalogowany?)",
      steamTooManyRequests429: "Steam: za du\u017Co zapyta\u0144 (429)",
      noAccess403PrivateInventory: "Brak dost\u0119pu (403), prywatny ekwipunek lub wylogowano",
      invalidResponseFromSteamAre: "Nieprawid\u0142owa odpowied\u017A Steam (czy jeste\u015B zalogowany?)",
      couldntLoadListingsAreYou: "Nie uda\u0142o si\u0119 pobra\u0107 ofert (czy jeste\u015B zalogowany?)",
      steamIsntReturningTheInventory: "Steam nie zwraca ekwipunku (b\u0142\u0105d {status}), serwery Steama maj\u0105 problem, spr\xF3buj za chwil\u0119",
      noPriceData: "brak danych cenowych",
      couldntLoadBuyOrdersNew: "nie uda\u0142o si\u0119 pobra\u0107 zlece\u0144 (nowy rynek Steam)",
      noOrderDataCheckThe: "brak danych o zleceniach (sprawd\u017A nazw\u0119: {hash})",
      noPriceHistory: "brak historii cen",
      gmXmlhttprequestUnavailable: "GM_xmlhttpRequest niedost\u0119pne",
      externalServiceRequestLimitTry: "Serwis zewn\u0119trzny: limit zapyta\u0144, spr\xF3buj za kilka minut",
      invalidResponse: "Nieprawid\u0142owa odpowied\u017A",
      networkError: "B\u0142\u0105d sieci"
    },
    ui: {
      dragUpToMakeThe: "Przeci\u0105gnij w g\xF3r\u0119, \u017Ceby powi\u0119kszy\u0107 log (kosztem okna powy\u017Cej) \xB7 dwuklik: du\u017Cy / ma\u0142y",
      theLogIsTurnedOff: "Dziennik jest wy\u0142\u0105czony w \u2699 Ustawieniach",
      cancel: "Anuluj",
      noData: '<div class="empty">Brak danych</div>',
      breakEven: "wyj\u015Bcie na zero"
    },
    util: {
      onceUnlocked: "po odblokowaniu",
      "1Day": "1 dzie\u0144",
      days: "{n} dni",
      ago: "temu"
    },
    buyorders: {
      loadsYourOrdersAndChecks: "Wczytuje zlecenia i sprawdza konkurencj\u0119",
      refresh: "Od\u015Bwie\u017C",
      newOrder: "Nowe zlecenie",
      downloadsTheOrderBookAnd: "Pobiera z Rynku Steam ksi\u0119g\u0119 zlece\u0144 i pe\u0142n\u0105 histori\u0119 cen przedmiot\xF3w z Twoich zlece\u0144 kupna i zapisuje je do pliku, do wsp\xF3lnej analizy, czy i po ile sprzedawa\u0107. Tylko odczyt, niczego nie kupuje ani nie wystawia.",
      dataForAnalysis: "Dane do analizy",
      automaticOutbiddingInTheBackground: "Automatyczne przebijanie w tle",
      auto: "Automat",
      on: "w\u0142.",
      off: "wy\u0142.",
      itemTypeItsNameIn: "Przedmiot (wpisz nazw\u0119 po polsku lub angielsku)",
      eGRevolutionCaseAk: "np. skrzynia rewolucji, AK-47 Redline",
      pricePerUnit: "Cena za szt.",
      quantity: "Ilo\u015B\u0107",
      placeOrder: "Z\u0142\xF3\u017C zlecenie",
      outbidAutomatically: "Przebijaj automatycznie",
      everyMinutes: "Co ile minut",
      lowerWhenImAloneAt: "Obni\u017Caj, gdy jestem sam na szczycie",
      checkNow: "Sprawd\u017A teraz",
      theAutomationOutbidsByOne: "Automat przebija zlecenia o grosz, gdy kto\u015B zaoferuje wi\u0119cej. Obejmuje tylko zlecenia, kt\xF3rym w \u201E\u2699\u201D w\u0142\u0105czysz\n      \u201Eprzebijaj automatycznie\u201D i ustawisz <b>najwy\u017Csz\u0105 cen\u0119</b>. Steam nie pozwala zmieni\u0107 ceny zlecenia, wi\u0119c przebicie = anulowanie i z\u0142o\u017Cenie nowego.",
      cancelSelected: "Anuluj zaznaczone",
      deselect: "odznacz",
      item: "Przedmiot",
      yourOrder: "Twoje zlecenie",
      market: "Rynek",
      suggestion: "Propozycja",
      fromYourBuyOrders: "z Twoich zlece\u0144 kupna",
      enterAPrice: "podaj cen\u0119",
      total: "razem",
      highestOtherOrder: "najwy\u017Csze inne zlecenie",
      doesntExistOnSteamFees: "nie istnieje na Steamie (prowizje zaokr\u0105glaj\u0105 si\u0119 do groszy), z\u0142o\u017C\u0119",
      enterAPrice2: "Podaj cen\u0119.",
      enterAQuantity: "Podaj ilo\u015B\u0107.",
      priceAndQuantityUnchanged: "Cena i ilo\u015B\u0107 bez zmian.",
      doesntExistOnSteamPlacing: "nie istnieje na Steamie, sk\u0142adam",
      changeTheOrder: "Zmieni\u0107 zlecenie?",
      steamDoesntLetYouEdit: "Steam nie pozwala edytowa\u0107 zlece\u0144: stare zostanie anulowane i z\u0142o\u017Cone nowe (na koniec kolejki przy tej cenie).",
      change: "Zmie\u0144",
      searching: '<div class="sub">szukam\u2026</div>',
      nothingFound: '<div class="sub">nic nie znaleziono</div>',
      checking: "sprawdzam\u2026",
      highest: "najwy\u017Csze",
      outbidSomeoneOffers: "przebite: kto\u015B daje {comp}",
      aCentMoreThanThe: "o grosz wi\u0119cej ni\u017C najwy\u017Csze inne zlecenie",
      carefulThatsAlreadyWhatBuying: "uwaga: tyle kosztuje ju\u017C kupno od r\u0119ki ({lowestSell})",
      selected: "Zaznaczono {sel}:",
      checkingTheCompetition: "sprawdzam konkurencj\u0119\u2026",
      outbid: "przebite",
      checked: "sprawdzono",
      allHighest: "wszystkie najwy\u017Csze",
      youHaveNoBuyOrders: '<tr><td colspan="6" class="empty">Nie masz zlece\u0144 kupna. Kliknij \u201E+ Nowe zlecenie\u201D.</td></tr>',
      autoOutbidsUpTo: "Automat przebija do {max}",
      autoIsOnButWithout: "Automat w\u0142\u0105czony, ale bez najwy\u017Cszej ceny, nie zadzia\u0142a. Ustaw j\u0105 w \u2699.",
      of: "z",
      thisPriceCantBePaid: "Takiej ceny nie da si\u0119 zap\u0142aci\u0107 po prowizjach, wi\u0119c Steam pokazuje i realizuje to zlecenie jako {r}, w kolejce z innymi po tej cenie. Nast\u0119pna prawdziwa cena to {price}.",
      standsAs: "stoi jako",
      buyNow: "kupno od r\u0119ki",
      profitPerUnitAfterThe: "Zysk na sztuce po prowizji, je\u015Bli zlecenie wejdzie po Twojej cenie, a po 7 dniach blokady sprzedasz po typowej cenie z ostatniego tygodnia ({sellAt}), tak samo liczy skaner w Okazjach",
      afterSelling: "po sprzeda\u017Cy",
      market2: "rynek",
      nothingNeeded: '<span class="sub ok">nic nie trzeba</span>',
      cancelsTheOrderAndPlaces: "Anuluje zlecenie i z\u0142o\u017Cy nowe za {price} (z potwierdzeniem)",
      outbid2: "Przebij",
      anotherPriceOrQuantityCancels: "Inna cena lub ilo\u015B\u0107 (anuluje i sk\u0142ada nowe zlecenie, z potwierdzeniem)",
      cancel: "Anuluj",
      maximumPriceAndAutomation: "Najwy\u017Csza cena i automat",
      newPricePerUnit: "Nowa cena za szt.",
      save: "Zapisz",
      dontPayMoreThan: "Nie p\u0142a\u0107 wi\u0119cej ni\u017C",
      outbidAutomatically2: "przebijaj automatycznie",
      setDontPayMoreThan: '<span class="warn sub">ustaw \u201Enie p\u0142a\u0107 wi\u0119cej ni\u017C\u201D, bez tego automat pominie to zlecenie</span>',
      outbidTheOrder: "Przebi\u0107 zlecenie?",
      theOldOrderIsCancelled: "Stare zlecenie zostanie anulowane i z\u0142o\u017Cone nowe.",
      cancelTheOrder: "Anulowa\u0107 zlecenie?",
      cancelOrder: "Anuluj zlecenie",
      back: "Wr\xF3\u0107",
      cancelled: "anulowano",
      error: "b\u0142\u0105d {status}",
      loadedBuyOrders: "Wczytano {rows} zlece\u0144 kupna.",
      errorLoadingOrders: "B\u0142\u0105d \u0142adowania zlece\u0144: ",
      someoneOutbidYourOrderYours: "Kto\u015B przebi\u0142 Twoje zlecenie: {hash}, {comp} (Twoje {price})",
      outbidOrders: "Przebite zlecenia",
      couldntCancel: "nie uda\u0142o si\u0119 anulowa\u0107 ({message})",
      confirmInTheApp: " (potwierd\u017A w aplikacji)",
      cancelledButTheNewOrder: "anulowano, ale nowe zlecenie nie przesz\u0142o: {msg}",
      oldOrderCancelledTheNew: "{hash}: stare zlecenie anulowane, nowe odrzucone ({msg}), z\u0142\xF3\u017C r\u0119cznie!",
      youAlreadyHaveAnOrder: "masz ju\u017C zlecenie na ten przedmiot",
      code: "kod {success}",
      selectSomeOrders: "Zaznacz zlecenia.",
      setAMaxPrice: "ustaw cen\u0119 max",
      order: "zlecenie",
      cancelTheOrders: "Anulowa\u0107 zlecenia?",
      cancelBuyOrders: "Anulowa\u0107 {sel} zlece\u0144 kupna?",
      cancelOrders: "Anuluj zlecenia",
      loading: "pobieram\u2026",
      highestOrderOfOthers: "najwy\u017Csze zlecenie innych",
      likeTheDealsScannerAn: "Jak w skanerze Okazji: zlecenie o grosz nad tymi, kt\xF3re realnie stoj\u0105 w ksi\u0119dze, sprzeda\u017C po 7 dniach po typowej cenie (ni\u017Csza z 24 h i 7 dni), po prowizji",
      pickAnItemFromThe: "Wybierz przedmiot z listy podpowiedzi.",
      placeTheBuyOrder: "Z\u0142o\u017Cy\u0107 zlecenie kupna?",
      place: "Z\u0142\xF3\u017C",
      orderPlaced: "Z\u0142o\u017Cono zlecenie: {name} {qty}\xD7 {price}{confirm}",
      orderRejected: "Zlecenie odrzucone: {msg}",
      checkedChanged: "sprawdzono {list}, zmieniono {n}",
      off2: "wy\u0142\u0105czone",
      runsInAnotherTab: "dzia\u0142a w innej karcie",
      working: "pracuje\u2026",
      nextInMin: "nast\u0119pne za {min} min",
      autoOutbid: "Auto-przebijanie"
    },
    casedb: {
      gmXmlhttprequestUnavailable: "GM_xmlhttpRequest niedost\u0119pne",
      badResponse: "z\u0142a odpowied\u017A",
      networkErrorAddConnectRaw: "b\u0142\u0105d sieci (dodaj @connect raw.githubusercontent.com w nag\u0142\xF3wku skryptu)",
      caseContentsData: "dane o zawarto\u015Bci skrzy\u0144: "
    },
    cases: {
      milSpecBlue: "Mil-Spec (niebieskie)",
      restrictedPurple: "Restricted (fioletowe)",
      classifiedPink: "Classified (r\xF3\u017Cowe)",
      covertRed: "Covert (czerwone)",
      knifeGloves: "\u2605 n\xF3\u017C / r\u0119kawice",
      highGradeNormal: "High Grade (zwyk\u0142e)",
      remarkableHoloGlitterEmbroidered: "Remarkable (holo / glitter / haft)",
      extraordinaryGold: "Extraordinary (z\u0142ote)",
      steamTooManyRequests429: "Steam: za du\u017Co zapyta\u0144 (429)",
      noUsdRate: "brak kursu USD",
      couldntFindStickerPricesFor: "nie znalaz\u0142em cen naklejek z tej kapsu\u0142y",
      cases: "Skrzynie: ",
      caseContentsNotFound: "nie znaleziono zawarto\u015Bci skrzyni",
      contentsNotRecognisedSearchResults: "nie rozpoznano zawarto\u015Bci ({found} pozycji z wyszukiwarki)",
      likeYourLastKey: "jak Tw\xF3j ostatni klucz ({t})",
      "249UsdAtThe": "2,49 USD po kursie",
      recalculateCases: "Przelicz skrzynie",
      whatToShowAndRecalculate: "Co pokaza\u0107 i przeliczy\u0107",
      cases2: "Skrzynie",
      stickerCapsules: "Kapsu\u0142y z naklejkami",
      casesAndCapsules: "Skrzynie i kapsu\u0142y",
      skipsCasesAndCapsulesWith: "Pomija skrzynie i kapsu\u0142y, kt\xF3re maj\u0105 mniej ni\u017C 100 ofert na rynku: trudno je kupi\u0107, a ich ceny s\u0105 niewiarygodne",
      hideRarelySold100Listings: "Ukryj rzadko sprzedawane (&lt;100 ofert)",
      countEveryCaseAndCapsule: "Licz ka\u017Cd\u0105 skrzyni\u0119 i kapsu\u0142\u0119 tak, jakby\u015B ju\u017C j\u0105 mia\u0142(a): koszt otwarcia = klucz + to, co dosta\u0142by\u015B za jej sprzeda\u017C (po prowizji), a nie cena z rynku. Pojedyncze mo\u017Cesz potem poprawi\u0107 polem \u201Emam j\u0105\u201D w wierszu.",
      iAlreadyHaveThemAll: "Wszystkie ju\u017C mam (nie kupuj\u0119)",
      howIsThisCalculated: "Jak to licz\u0119?",
      evIsTheAverageValue: "\n      <b>EV</b> = \u015Brednia warto\u015B\u0107 dropu na r\u0119k\u0119 (po prowizji): suma po rzadko\u015Bciach szansa \xD7 \u015Brednia cena skin\xF3w tej rzadko\u015Bci.<br>\n      Szanse Valve: niebieskie 79,92%, fioletowe 15,98%, r\xF3\u017Cowe 3,20%, czerwone 0,64%, n\xF3\u017C/r\u0119kawice 0,26%. StatTrak\u2122 10%.<br>\n      Zawarto\u015B\u0107 skrzy\u0144 i zakresy floatu, z plik\xF3w gry (zbi\xF3r ByMykel/CSGO-API). Stan zu\u017Cycia liczony z zakresu floatu skina (np. Doppler wypada w ~96% jako FN).<br>\n      <b>Strata na otwarciu</b> = koszt \u2212 EV: tyle \u015Brednio tracisz przy jednym otwarciu (na d\u0142ug\u0105 met\u0119, pojedynczy drop mo\u017Ce da\u0107 du\u017Co wi\u0119cej albo mniej). Tabela jest u\u0142o\u017Cona od najmniejszej straty.<br>\n      <b>Kapsu\u0142y</b>: bez klucza, koszt = cena kapsu\u0142y. Rzadko\u015Bci naklejek: High Grade (zwyk\u0142e), Remarkable (holo / glitter / haft), Exotic (foil / holo), Extraordinary (z\u0142ote), szanse jak w skrzyniach (79,92 / 15,98 / 3,20 / 0,64), przeliczone na rzadko\u015Bci, kt\xF3re kapsu\u0142a ma (tak podaj\u0105 serwisy z danymi o kapsu\u0142ach; Valve nie publikuje ich osobno). Zawarto\u015B\u0107, z plik\xF3w gry (ByMykel), ceny, z rynku Steam.<br>\n      Ceny: najni\u017Csza oferta na rynku Steam (pojedyncze drogie dropy bywaj\u0105 w praktyce sprzedawane troch\u0119 taniej, wi\u0119c EV jest raczej lekko zawy\u017Cone). Koszt = skrzynia + klucz. Przy skrzyni oznaczonej \u201Emam j\u0105\u201D (zaznacza si\u0119 sama, gdy jest w Twoim ekwipunku, po wczytaniu zak\u0142adki Ekwipunek) koszt = klucz + to, co dosta\u0142by\u015B za sprzeda\u017C tej skrzyni (po prowizji). \u201ESzansa na zwrot\u201D = jak cz\u0119sto drop jest wart tyle, ile kosztuje otwarcie.",
      case: "Skrzynia",
      theAverageResultOfOne: "\u015Aredni wynik jednego otwarcia: EV \u2212 koszt, tyle \u015Brednio p\u0142acisz za otwarcie. Od najmniejszej straty.",
      lossPerOpening: "Strata na otwarciu",
      openingCost: "Koszt otwarcia",
      chanceToBreakEven: "Szansa na zwrot",
      bestDrop: "Najlepszy drop",
      casePrice: "Cena skrzyni",
      listings: "Ofert",
      casesLoadingTheCaseList: "Skrzynie: pobieram list\u0119 skrzy\u0144\u2026",
      capsules: "kapsu\u0142",
      casesAndCapsules2: "skrzy\u0144 i kapsu\u0142",
      cases3: "skrzy\u0144",
      casesCalculatingKey: "Skrzynie: licz\u0119 {todo} {kind} (klucz {price}, {src})\u2026",
      aboutMinLeft: " \xB7 zosta\u0142o ok. {left} min",
      calculatingResultsShowUpAs: "licz\u0119 {name} ({i}/{todo}){left}, wyniki pojawiaj\u0105 si\u0119 na bie\u017C\u0105co, mo\u017Cesz w tym czasie korzysta\u0107 z reszty",
      cases4: "Skrzynie: {name}, {message}",
      casesDone: "Skrzynie: gotowe.",
      dataFrom: " \xB7 dane sprzed {done}",
      casesCalculatedKey: "{done}/{rows} skrzy\u0144 policzonych \xB7 klucz {price} ({src}){done2}",
      clickRecalculateCases: "Kliknij \u201EPrzelicz skrzynie\u201D",
      whatOneOpeningOfThis: "Tyle \u015Brednio p\u0142acisz za jedno otwarcie tej skrzyni, najmniej ze wszystkich policzonych",
      smallestLossPerOpening: "Najmniejsza strata na otwarciu",
      openingCost2: "koszt otwarcia",
      returnsOnAverage: "wraca \u015Brednio",
      thisCaseReturnsTheBiggest: "Z tej skrzyni wraca najwi\u0119ksza cz\u0119\u015B\u0107 kosztu, liczy si\u0119, gdy masz sta\u0142y bud\u017Cet",
      returnsTheMost: "Najwi\u0119cej wraca (%)",
      perOpeningCost: "na otwarciu \xB7 koszt",
      howOftenADropIs: "Jak cz\u0119sto drop jest wart co najmniej tyle, ile kosztuje otwarcie",
      bestChanceToBreakEven: "Najwi\u0119ksza szansa na zwrot",
      ofOpeningsGiveADrop: "otwar\u0107 daje drop wart",
      collectionNotRecognised: '<span class="warn" title="Nie znam zawarto\u015Bci tej skrzyni, wi\u0119c jej nie licz\u0119">nie rozpoznano kolekcji</span>',
      returns: "wraca",
      ofTheCost: "kosztu",
      capsuleAfterTheFeeNo: "kapsu\u0142a po prowizji, bez klucza",
      noKey: "bez klucza",
      keyCaseAfterTheFee: "klucz {keyCost} + skrzynia po prowizji",
      key: "+ klucz {keyCost}",
      youHaveThisCaseSo: "Masz t\u0119 skrzyni\u0119: otwarcie kosztuje klucz + to, co dosta\u0142by\u015B za jej sprzeda\u017C (po prowizji), a nie jej cen\u0119 z rynku",
      iHaveIt: "mam j\u0105",
      inInventory: "w ekwipunku",
      calculatedTheOldWayClick: "Policzone star\u0105 metod\u0105, kliknij \u201EPrzelicz skrzynie\u201D",
      noPricesForSomeRarities: "Brak cen dla cz\u0119\u015Bci rzadko\u015Bci ({covered} szans), EV zani\u017Cone",
      calculateOnlyThisCase: "Policz tylko t\u0119 skrzyni\u0119",
      calculate: "policz",
      chance: "szansa",
      average: "\u015Brednio",
      shareOfEv: "wk\u0142ad w EV",
      youGetAfterSelling: "na r\u0119k\u0119 po sprzeda\u017Cy: {ev}",
      normalStattrakAfterTheFee: "zwyk\u0142y: {n} \xB7 StatTrak\u2122: {t} (na r\u0119k\u0119, \u015Brednio po stanach)",
      collapse: "zwi\u0144",
      more: "+{skins} wi\u0119cej",
      clickRecalculateCasesCalculatingAll: '<tr><td colspan="9" class="empty">Kliknij \u201EPrzelicz skrzynie\u201D. Policzenie wszystkich skrzy\u0144 trwa ok. 10-30 min, wyniki pojawiaj\u0105 si\u0119 na bie\u017C\u0105co. Zostaj\u0105 zapisane, wi\u0119c po od\u015Bwie\u017Ceniu strony nie trzeba liczy\u0107 od nowa.</td></tr>'
    },
    flip: {
      everything: "Wszystko",
      cases: "Skrzynie",
      capsulesAndPackages: "Kapsu\u0142y i paczki",
      stickers: "Naklejki",
      rifles: "Karabiny",
      pistols: "Pistolety",
      smgs: "PM",
      knives: "No\u017Ce",
      gloves: "R\u0119kawice",
      agents: "Agenci",
      musicKits: "Muzyka",
      itemAnalysis: "Analiza przedmiotu",
      watchlist: "Obserwowane",
      marketScanner: "Skaner rynku",
      downloadsFromTheSteamMarket: "Pobiera z Rynku Steam ksi\u0119g\u0119 zlece\u0144 i pe\u0142n\u0105 histori\u0119 cen przedmiot\xF3w widocznych teraz na li\u015Bcie (skaner, obserwowane albo analizowany przedmiot) i zapisuje je do pliku, do sprawdzenia, czy faktycznie si\u0119 op\u0142acaj\u0105. Gdy lista jest pusta, bierze sta\u0142\u0105 pr\xF3bk\u0119 ok. 100 popularnych przedmiot\xF3w. Niczego nie kupuje ani nie wystawia.",
      dataForAnalysis: "Dane do analizy",
      picksAFewHundredRandom: "Losuje kilkaset przedmiot\xF3w z listy najpopularniejszych na Rynku Steam (po r\xF3wno z ka\u017Cdego rodzaju i przedzia\u0142u cen) i zapisuje ich histori\u0119 cen i ksi\u0119g\u0119 zlece\u0144 do pliku, do sprawdzania algorytm\xF3w Flipstera na szerszym rynku. Niczego nie kupuje ani nie wystawia.",
      marketSample: "Pr\xF3bka rynku",
      itemNameInEnglishOr: "Przedmiot (nazwa po polsku lub angielsku, albo link do rynku)",
      eG: "np.",
      yourBuyPriceOptional: "Twoja cena zakupu (opcjonalnie)",
      unitsToBuy: "Ile sztuk chc\u0119 kupi\u0107",
      analyse: "Analizuj",
      addToWatchlist: "Dodaj do obserwowanych",
      nameInEnglishOrPolish: "nazwa po polsku lub angielsku",
      add: "Dodaj",
      scanWatchlist: "Skanuj obserwowane",
      goal: "Cel",
      longTermCaseSeason: "na d\u0142u\u017Cej (sezon skrzy\u0144)",
      quickFlip7DayLock: "szybki flip (7 dni blokady)",
      category: "Kategoria",
      search: "Szukaj",
      optional: "(opcjonalnie)",
      priceFrom: "Cena od",
      to: "do",
      minListings: "Min. ofert na rynku",
      itemsToCheck: "Ile przedmiot\xF3w sprawdzi\u0107",
      howManyToFind: "Ile znale\u017A\u0107",
      noLimit: "bez limitu",
      minSales24h: "Min. sprzeda\u017Cy/24h",
      onlyItemsWithTheFlip: "Na li\u015Bcie zostaj\u0105 tylko przedmioty z ocen\u0105 \u201EFlip mo\u017Cliwy\u201D. Odznacz, \u017Ceby widzie\u0107 te\u017C ryzykowne (zysk mniejszy ni\u017C typowa zmiana ceny w tydzie\u0144).",
      profitableOnly: "tylko op\u0142acalne",
      tickedTheScannerReusesWhat: "Zaznaczone: skaner bierze z pami\u0119ci to, co niedawno sprawdzi\u0142, odrzucone przedmioty (12 godz., gdy sama ksi\u0119ga zlece\u0144 nie dawa\u0142a szans na flip; 3 godz. po pe\u0142nym sprawdzeniu), trafienia i \u201Eryzykowne\u201D (30 min) oraz listy i ksi\u0119gi zlece\u0144 (kilka minut). Odznacz, \u017Ceby ten skan pobra\u0142 wszystko ze Steama od nowa.",
      useRememberedData: "korzystaj z zapami\u0119tanych danych",
      scan: "Skanuj",
      removesTheResultsOfThe: "Usuwa z listy wyniki poprzedniego skanu (tak\u017Ce zapami\u0119tane po od\u015Bwie\u017Ceniu strony). Obserwowane i ukryte zostaj\u0105.",
      clearList: "Wyczy\u015B\u0107 list\u0119",
      howDoesItWork: "Jak to dzia\u0142a?",
      theScannerTakesTheMost: "\n        Skaner pobiera z Rynku Steam najpopularniejsze przedmioty z kategorii i przedzia\u0142u cen, a dla ka\u017Cdego, ksi\u0119g\u0119 zlece\u0144 i pe\u0142n\u0105 histori\u0119 cen.<br>\n        <b>Na d\u0142u\u017Cej.</b> Pokazuje, co trzymanie tego przedmiotu dawa\u0142o w przesz\u0142o\u015Bci, po prowizji: ile zim (zakup pod koniec listopada, sprzeda\u017C p\xF3\u0142 roku p\xF3\u017Aniej) sko\u0144czy\u0142o si\u0119 zyskiem, wynik po roku i po dw\xF3ch latach, cen\u0119 wzgl\u0119dem \u015Bredniej z roku i zmian\u0119 z ostatniego miesi\u0105ca. \u201EKandydat\u201D = skrzynia starsza ni\u017C 4 lata, od 1 z\u0142, cena nie spad\u0142a o wi\u0119cej ni\u017C 10% w 30 dni, sprzedaje si\u0119 \u2265 20 szt. dziennie. Rekord zim samej skrzyni jest pokazany, ale nie decyduje: w badaniu nie odr\xF3\u017Cnia\u0142 lepszych od gorszych, a wiek tak. Dla pozosta\u0142ych przedmiot\xF3w: co najmniej 3 zimy danych i zysk w \u2265 70% z nich.<br>\n        <b>Szybki flip.</b> Kupno zleceniem o grosz nad tymi, kt\xF3re realnie stoj\u0105 w ksi\u0119dze, sprzeda\u017C po cenie, po kt\xF3rej faktycznie id\u0105 transakcje, minus prowizja. Kupiony przedmiot mo\u017Cna wystawi\u0107 dopiero po 7 dniach, wi\u0119c obok jest typowa zmiana ceny w tydzie\u0144 i to, czy ktokolwiek ostatnio sprzedawa\u0142 tak tanio. W tym trybie skaner szuka do skutku: idzie po li\u015Bcie od najpopularniejszych, a\u017C znajdzie tyle przedmiot\xF3w z ocen\u0105 \u201EFlip mo\u017Cliwy\u201D, ile wpiszesz w \u201EIle znale\u017A\u0107\u201D, sko\u0144czy si\u0119 lista albo klikniesz Stop. Puste pole \u201EIle znale\u017A\u0107\u201D = bez limitu, szuka do Stopu. Z \u201Etylko op\u0142acalne\u201D na li\u015Bcie zostaj\u0105 same trafienia; po odznaczeniu wida\u0107 te\u017C \u201Eryzykowne\u201D.<br>\n        <b>Sk\u0105d te zasady.</b> Badanie 108 przedmiot\xF3w z histori\u0105 do 13 lat (15.11.2026): flipy i \u0142apanie do\u0142k\xF3w nie przebija\u0142y prowizji, a zarabia\u0142o trzymanie starych skrzy\u0144 kupionych zim\u0105. Nowe przedmioty zwykle mocno taniej\u0105. To historia, nie gwarancja.",
      notFoundOnTheMarket: "Nie znalaz\u0142em na rynku: {h}",
      removedFromWatchlist: "Usuni\u0119to z obserwowanych: {hash}",
      addedToWatchlist: "Dodano do obserwowanych: {hash}",
      searching: "szukam\u2026",
      nothingFound: "nic nie znaleziono",
      noHistory: "brak historii",
      steamReturnedNoPriceHistory: "Steam nie zwr\xF3ci\u0142 historii cen tego przedmiotu.",
      newItem: "nowy przedmiot",
      itHasBeenOnThe: "Jest na rynku kr\xF3cej ni\u017C rok. Nowe przedmioty zwykle mocno taniej\u0105, w badaniu typowo \u221257% w pierwszych 90 dniach.",
      tooCheap: "za tani",
      below1ZTheMinimum: "Poni\u017Cej 1 z\u0142 minimalna prowizja (0,04 + 0,04 z\u0142) zabiera du\u017Co wi\u0119cej ni\u017C 13%.",
      wintersInProfitOfTypically: "Zimy na plus: {wins} z {n}, typowo {med} po prowizji.",
      tooYoung: "za m\u0142oda",
      onTheMarketForYears: "Na rynku od {age} roku. Skrzynie m\u0142odsze ni\u017C 4 lata dawa\u0142y zim\u0105 zysk w 54% przypadk\xF3w (typowo +13%), starsze w 82% (typowo +39%).",
      theCaseIsYearsOld: "Skrzynia ma {age} roku, starsze ni\u017C 4 lata dawa\u0142y zim\u0105 zysk w 82% przypadk\xF3w. {rec}",
      historyTooShort: "za kr\xF3tka historia",
      lessThan3WintersOf: "Mniej ni\u017C 3 zimy danych, za ma\u0142o, \u017Ceby cokolwiek oceni\u0107.",
      weakHistory: "s\u0142aba historia",
      thatsTooLittleToCount: "{rec} To za ma\u0142o, \u017Ceby liczy\u0107 na zysk.",
      lowVolume: "ma\u0142y obr\xF3t",
      butOnlyUnitsSellA: "{rec} Ale sprzedaje si\u0119 tylko {vol} szt. dziennie, trudno b\u0119dzie wyj\u015B\u0107.",
      waitItsFalling: "poczekaj, spada",
      butThePriceFellIn: "{rec} Ale cena spad\u0142a o {trend30} w 30 dni. Skrzynie kupowane w trakcie takiego spadku dawa\u0142y zysk po roku w 57% przypadk\xF3w zamiast 75%.",
      candidate: "kandydat",
      thePriceIsntDroppingSharply: "{rec} Cena nie spada gwa\u0142townie, obr\xF3t wystarczy.",
      noData: "Brak danych",
      noOrderBookOrPrice: "brak ksi\u0119gi zlece\u0144 albo historii cen",
      theresAProfitOnlyAt: "zysk jest tylko przy dzisiejszej cenie {sell24}; przy typowej z tygodnia ({sell}) prowizja zjada wszystko, a sprzedasz dopiero po 7 dniach",
      atThePriceSalesActually: "po cenie, po kt\xF3rej faktycznie id\u0105 transakcje, prowizja zjada ca\u0142y zysk",
      inTheLast7Days: "w ostatnich 7 dniach nikt nie sprzeda\u0142 tak tanio, jak Twoje zlecenie",
      lowVolume24h: "ma\u0142y obr\xF3t ({vol}/24h)",
      profitBelow: "zysk poni\u017Cej {minRoi}%",
      rarelyFills: "~ Rzadko wchodzi",
      inTheLast7Days2: "w ostatnich 7 dniach po cenie Twojego zlecenia lub ni\u017Cej sprzedano tylko {week} szt. (potrzeba {MIN_FILL_WEEK}), zlecenie b\u0119dzie g\u0142\xF3wnie sta\u0142o",
      risky: "~ Ryzykowny",
      theProfitIsSmallerThan: "zysk {roi} jest mniejszy ni\u017C typowa zmiana ceny w tydzie\u0144 (\xB1{sig}), a sprzedasz dopiero po 7 dniach",
      flipPossible: "\u2714 Flip mo\u017Cliwy",
      unitAfterTheFeeRemember: "{profit}/szt. po prowizji; pami\u0119taj o 7 dniach blokady",
      flipDoesntPay: "\u2718 Flip si\u0119 nie op\u0142aca",
      bought2229NovemberSold: "Kupno 22-29 listopada \u2192 sprzeda\u017C p\xF3\u0142 roku p\xF3\u017Aniej, po prowizji:\n",
      noItemFoundOnThe: "Nie znalaz\u0142em na rynku przedmiotu \u201E{hash}\u201D.",
      analysis: "Analiza",
      is: "\u201E{hash}\u201D to",
      closestMatch: ", najbli\u017Csze dopasowanie",
      analysingOrdersVolumePriceHistory: "Analizuj\u0119\u2026 (zlecenia, wolumen, historia cen)",
      priceHistory: "Historia cen: ",
      salePrice: "Cena transakcji",
      buyOrdersNow: "Zlecenia kupna teraz",
      lowestListingNow: "Najni\u017Csza sprzeda\u017C teraz",
      watch: "Obserwuj",
      anOrderACentAbove: "Zlecenie o grosz nad tymi, kt\xF3re realnie stoj\u0105 w ksi\u0119dze",
      placeBuyOrder: "Z\u0142\xF3\u017C zlecenie kupna",
      longTerm: "Na d\u0142u\u017Cej",
      wintersNovToMay: "Zimy (XI\u2192V)",
      inProfit: "na plus",
      typicallyAfterTheFee: "typowo {med} po prowizji",
      after1Year: "Po roku",
      typicallyPeriods: "typowo {med} \xB7 {n} okres\xF3w",
      after2Years: "Po 2 latach",
      vs1YearAvg: "vs \u015Br. z roku",
      priceNowAgainstThe12: "cena teraz wzgl\u0119dem \u015Bredniej z 12 miesi\u0119cy",
      "30Days": "30 dni",
      priceChangeOverTheLast: "zmiana ceny w ostatnim miesi\u0105cu",
      bought2229NovemberSold2: "Kupno 22-29 listopada \u2192 sprzeda\u017C p\xF3\u0142 roku p\xF3\u017Aniej (po prowizji)",
      quickFlipSoldAfterThe: "Szybki flip (sprzeda\u017C po 7 dniach blokady)",
      buyOrder: "Kupno (zlecenie)",
      topOfTheBookOrders: "szczyt ksi\u0119gi: {highestBuy} \xB7 {buyCount} zlece\u0144",
      sellActualSales: "Sprzeda\u017C (transakcje)",
      todayICountTheTypical: "dzi\u015B {sell24}, licz\u0119 po typowej z 7 dni",
      lowestListingListings: "najni\u017Csza oferta: {lowestSell} \xB7 {sellCount} ofert",
      profitUnitFlip: "Zysk / szt. (flip)",
      youGetBuy: "na r\u0119k\u0119 {net} \u2212 zakup {buy}",
      afterTheFee: "po prowizji",
      weeklySwing: "Zmiana tyg.",
      typicalPriceChangeIn7: "typowa zmiana ceny w 7 dni",
      fillChance: "Szansa wej\u015Bcia",
      pcs: "szt.",
      soldIn7DaysAt: "tyle w 7 dni sprzedano po cenie Twojego zlecenia lub ni\u017Cej ({fill7} obrotu)",
      volume: "Wolumen",
      "7Days": "{vol7} / 7 dni",
      median7dAvg30d: "Mediana 7d \xB7 \u015Br. 30d",
      breakEven: "Pr\xF3g rentowno\u015Bci",
      minSalePriceToCome: "min. cena sprzeda\u017Cy, \u017Ceby wyj\u015B\u0107 na zero",
      yourPurchaseForSellingNow: "Tw\xF3j zakup za <b>{mine}</b>: sprzedaj\u0105c teraz ({sell}) dostaniesz {net}, czyli",
      atThe7dMedian: "; po medianie 7d",
      toComeOutEvenList: "Aby wyj\u015B\u0107 na zero, wystaw za min.",
      price: "Cena",
      qty: "Szt.",
      cumul: "Narast.",
      buyOrders: "Zlecenia kupna",
      sellListings: "Oferty sprzeda\u017Cy",
      youCantBuyRightAway: "Od r\u0119ki nie da si\u0119 kupi\u0107 {szt}: w ksi\u0119dze wida\u0107 tylko {listed} ofert.",
      onAverageAUnitEach: " (\u015Brednio {avg} za sztuk\u0119; ka\u017Cda oferta po swojej cenie)",
      rightAwaySetTheOrder: "<b>Od r\u0119ki</b> {szt}: ustaw zlecenie na <b>{price}</b>, zap\u0142acisz razem {total}{qty}. Po sprzeda\u017Cy:",
      listingsAtOrCheaper: "Ofert wystawionych nie dro\u017Cej ni\u017C {maxRoi}:",
      breakEven2: "pr\xF3g zera",
      highestWithProfit: "najwy\u017Cej z zyskiem \u2265 {minRoi}%",
      justAboveTheOrdersIn: "tu\u017C nad zleceniami w ksi\u0119dze",
      upToWhatPriceTo: "Do jakiej ceny kupowa\u0107",
      sellingAtYouGet: "przy sprzeda\u017Cy po {sell} (na r\u0119k\u0119 {got})",
      itPaysToBuyUp: "Op\u0142aca si\u0119 kupowa\u0107 <b>do {maxRoi}</b> (zostaje \u2265 {minRoi}% po prowizji); powy\u017Cej <b>{maxZero}</b> tracisz.",
      orderPrice: "Cena zlecenia",
      profitUnit: "Zysk / szt.",
      soldThisCheap7Days: "Sprzedano tak tanio (7 dni)",
      ordersAheadOfYou: "Zlece\u0144 przed Tob\u0105",
      inAbout: "{szt} w ok.",
      ofVolume: "obrotu",
      nobodySoldThisCheap: "nikt tak tanio nie sprzeda\u0142",
      lessThanADay: "mniej ni\u017C dzie\u0144",
      over2Months: "ponad 2 miesi\u0105ce",
      days: "{days} dni",
      theTimeIsAnEstimate: "Czas to szacunek: ile sztuk w ostatnim tygodniu sprzeda\u0142o si\u0119 po tej cenie lub taniej, pomniejszone o zlecenia stoj\u0105ce przed Twoim. Zlecenia najcz\u0119\u015Bciej wchodz\u0105 wtedy, gdy cena spada.",
      noItemsToCheck: "Brak przedmiot\xF3w do sprawdzenia.",
      steamLimitStoppedTryAgain: "Limit Steam, przerwano. Spr\xF3buj za kilka minut.",
      buyingSeasonNovemberToFebruary: '<b class="pos">Sezon zakup\xF3w (listopad-luty).</b> Skrzynie starsze ni\u017C rok kupione pod koniec listopada i sprzedane pod koniec maja da\u0142y zysk po prowizji w 10 z 11 lat, typowo +49%.',
      sellingSeasonAprilToAugust: '<b class="warn">Sezon sprzeda\u017Cy (kwiecie\u0144-sierpie\u0144).</b> Skrzynie by\u0142y wtedy historycznie najdro\u017Csze. Kupione w maju i sprzedane w listopadzie dawa\u0142y typowo \u221212%.',
      inBetweenHistoricallyItWas: "<b>Okres przej\u015Bciowy.</b> Historycznie najlepiej by\u0142o kupowa\u0107 skrzynie pod koniec listopada, a sprzedawa\u0107 od kwietnia do czerwca.",
      oldCasesInThisScan: ' Stare skrzynie w tym skanie: <b class="{t}">{t2}</b> w 30 dni, <b class="{y}">{y2}</b> wzgl\u0119dem \u015Bredniej z roku.',
      theMarketIsStillFalling: ' <b class="warn">Rynek jeszcze spada, lepiej poczeka\u0107, a\u017C si\u0119 zatrzyma.</b>',
      numbersFromResearchOn108: "Liczby z badania 108 przedmiot\xF3w (do 13 lat historii, 15.11.2026). To historia, nie gwarancja.",
      scannerListCleared: "Skaner: lista wyczyszczona.",
      itemsYouHidWithThe: "Przedmioty, kt\xF3re ukry\u0142e\u015B przyciskiem \u2715, skaner ich nie pokazuje i nie sprawdza",
      hidden: "Ukryte",
      restoreAll: "przywr\xF3\u0107 wszystkie",
      restoreToTheScanner: "Przywr\xF3\u0107 do skanera",
      haveAGoodHistoryBut: ", {wait} ma dobr\u0105 histori\u0119, ale jeszcze spada",
      ofAreCandidates: "<b>{ok}</b> z {rows} to kandydaci{wait}.",
      stillSearching: "szukam dalej\u2026",
      done: "gotowe",
      endOfTheListThere: "koniec listy, wi\u0119cej przedmiot\xF3w w tym przedziale nie ma",
      stoppedScanResumes: "zatrzymano, \u201ESkanuj\u201D wznowi",
      steamStoppedReturningTheList: "Steam przesta\u0142 zwraca\u0107 list\u0119 (to nie jej koniec), \u201ESkanuj\u201D za kilka minut wznowi",
      steamIsLimitingRequestsTry: "Steam ogranicza zapytania, spr\xF3buj za kilka minut",
      error: "b\u0142\u0105d",
      of: " z {want}",
      positionOfOnSteamsList: " (pozycja {pos} z {total} na li\u015Bcie Steama dla tej kategorii)",
      hiddenUntickProfitableOnly: "ukryte, odznacz \u201Etylko op\u0142acalne\u201D",
      onTheListGreyedOut: "na li\u015Bcie, wyszarzone",
      risky2: " \xB7 {risky} ryzykownych ({onlyOk})",
      skippedCheckedRecently: " \xB7 {skipped} pomini\u0119tych (sprawdzone niedawno)",
      withoutData: " \xB7 {failed} bez danych",
      foundChecked: "Znaleziono <b>{found}</b>{want} \xB7 sprawdzono {checked}{total}{risky}{skipped}{failed}",
      nothingPassedSoFarStill: "Na razie nic nie przesz\u0142o, szukam dalej\u2026",
      noItemGotTheFlip: "\u017Baden przedmiot nie dosta\u0142 oceny \u201EFlip mo\u017Cliwy\u201D. Odznacz \u201Etylko op\u0142acalne\u201D, \u017Ceby zobaczy\u0107 ryzykowne.",
      noCheckedItemPassedLower: "\u017Baden sprawdzony przedmiot nie przeszed\u0142. Obni\u017C Min. ROI albo Min. sprzeda\u017Cy, poszerz ceny lub zmie\u0144 kategori\u0119.",
      setTheFiltersAndClick: "Ustaw filtry i kliknij \u201ESkanuj\u201D.",
      anItemPassesWithA: "Przechodzi przedmiot z zyskiem \u2265 {minRoi}% przy sprzeda\u017Cy po ni\u017Cszej z dw\xF3ch cen (dzisiejszej i typowej z 7 dni), wi\u0119kszym ni\u017C typowa zmiana ceny w tydzie\u0144, po kt\xF3rego cenie zlecenia sprzedano w tygodniu co najmniej {MIN_FILL_WEEK} szt. i kt\xF3ry sprzedaje si\u0119 \u2265 {minVol} razy na dob\u0119. Kupiony przedmiot sprzedasz dopiero po 7 dniach, a typowa zmiana ceny w tydzie\u0144 to kilka procent, w badaniu taki flip prawie nigdy nie wychodzi\u0142 na plus.",
      item: "Przedmiot",
      verdict: "Ocena",
      priceNow: "Cena teraz",
      volume24h: "Wolumen 24h",
      profitUnit2: "Zysk/szt.",
      placeABuyOrderFor: "Z\u0142\xF3\u017C zlecenie kupna za {buy} (o grosz nad zleceniami, kt\xF3re realnie stoj\u0105 w ksi\u0119dze)",
      order: "+ zlecenie",
      hideItTheScannerWont: "Ukryj, skaner nie b\u0119dzie go pokazywa\u0142 ani sprawdza\u0142 (przywr\xF3cisz w \u201EUkryte\u201D nad tabel\u0105)",
      todaySalesGoAtBut: "Dzi\u015B transakcje id\u0105 po {sell24}, ale licz\u0119 po ni\u017Cszej, typowej cenie z 7 dni, sprzedasz dopiero po blokadzie.",
      youGet: "na r\u0119k\u0119",
      today: "dzi\u015B",
      youWatchClickScanWatchlist: "Obserwujesz {watch}, kliknij \u201ESkanuj obserwowane\u201D, \u017Ceby je policzy\u0107",
      addItemsToTheWatchlist: "Dodaj przedmioty do obserwowanych (\u2606) i kliknij \u201ESkanuj obserwowane\u201D.",
      steamTooManyRequests429: "Steam: za du\u017Co zapyta\u0144 (429)",
      of2: " z {total}",
      scannerSteamReturnedAnEmpty: "Skaner: Steam zwr\xF3ci\u0142 pust\u0105 stron\u0119 na pozycji {start}{total}, ponawiam za {secs} s\u2026",
      resultsFromIKeepThem: "Wyniki z {oldest}, pami\u0119tam je 30 minut od sprawdzenia (do {oldest2}), tak\u017Ce po od\u015Bwie\u017Ceniu strony. Potem \u201ESkanuj\u201D pobierze nowe.",
      scannerDownloadingTheListOf: "Skaner: pobieram list\u0119 popularnych przedmiot\xF3w\u2026",
      scannerSteamStoppedReturningThe: "Skaner: Steam przesta\u0142 zwraca\u0107 list\u0119, sprawdzam to, co zd\u0105\u017Cy\u0142em pobra\u0107.",
      scannerStopped: "Skaner przerwany.",
      scannerCheckingItemsInThe: "Skaner: sprawdzam {list} przedmiot\xF3w z przedzia\u0142u (~{min} min).",
      scannerFinished: "Skaner zako\u0144czony.",
      scanner: "Skaner: ",
      of3: "z",
      scannerSearchingForFlipPossible: "Skaner: szukam przedmiot\xF3w z ocen\u0105 \u201EFlip mo\u017Cliwy\u201D bez limitu, do ko\u0144ca listy albo do klikni\u0119cia Stop.",
      scannerSearchingForFlipPossible2: "Skaner: szukam {want} przedmiot\xF3w z ocen\u0105 \u201EFlip mo\u017Cliwy\u201D, do skutku (Stop przerywa).",
      scannerFound: "Skaner: znaleziono {hash} ({found}{want}).",
      steamsListForThisCategory: " Lista Steama dla tej kategorii: pozycja {pos} z {total}.",
      checkedFound: "sprawdzono {checked}, znaleziono {found}{of}",
      scannerFinished2: "Skaner zako\u0144czony: {sum}.",
      scannerEndOfTheList: "Skaner: koniec listy, {sum}.{where} Poszerz przedzia\u0142 cen albo zmie\u0144 kategori\u0119.",
      scannerSteamStoppedReturningThe2: "Skaner: Steam przesta\u0142 zwraca\u0107 list\u0119 przedmiot\xF3w, {sum}.{where} To nie koniec listy: kliknij \u201ESkanuj\u201D za kilka minut, sprawdzone przedmioty nie b\u0119d\u0105 pobierane drugi raz.",
      scannerSteamIsLimitingRequests: "Skaner: Steam ogranicza zapytania, {sum}. Kliknij \u201ESkanuj\u201D za kilka minut, sprawdzone przedmioty nie b\u0119d\u0105 pobierane drugi raz.",
      scannerStoppedScanResumesWhere: "Skaner zatrzymany: {sum}. \u201ESkanuj\u201D wznowi od miejsca przerwania.",
      shownOnTheListRight: "widocznych teraz na li\u015Bcie",
      fromTheFixedSampleOf: "ze sta\u0142ej pr\xF3bki popularnych (na li\u015Bcie nic nie ma)"
    },
    history: {
      trade: "wymiana",
      market: "rynek",
      case: "skrzynia",
      contract: "kontrakt",
      sticker: "naklejka",
      received: "otrzymane",
      other: "inne",
      of: "z",
      rateToFromSteamPrices: "Kurs {CUR_NAME} \u2192 {CUR_NAME2}: {r} (wg cen Steama)",
      couldntGetTheExchangeRate: "Nie uda\u0142o si\u0119 ustali\u0107 kursu waluty {CUR_NAME}: {message}",
      historyDownloadedHistoricalExchangeRates: "Historia: pobrano historyczne kursy walut z NBP.",
      historySavedTheDataFor: "Historia: zapisano dane do analizy ({market} transakcji, {inv} zdarze\u0144 ekwipunku, {opens} otwar\u0107, {owned} przedmiot\xF3w).",
      fetchesNewEntriesFromAll: "Dobiera nowe wpisy ze wszystkich trzech historii Steama: rynku, ekwipunku (CS2 i karty Steam) i zakup\xF3w w sklepie (ceny kluczy i zakup\xF3w w terminalu). Dzieje si\u0119 te\u017C samo po otwarciu tej zak\u0142adki.",
      sync: "Synchronizuj",
      downloadsTheWholeMarketAnd: "Pobiera od nowa ca\u0142\u0105 histori\u0119 rynku i ekwipunku. Potrzebne rzadko, kosztuje du\u017Co zapyta\u0144 do Steama.",
      fullSync: "Pe\u0142na synchronizacja",
      savesTheWholeStoredHistory: "Zapisuje do pliku ca\u0142\u0105 zapisan\u0105 histori\u0119 (rynek, historia ekwipunku, otwarte skrzynie) i list\u0119 tego, co masz w ekwipunku, do wsp\xF3lnego sprawdzenia, czy Flipster dobrze to liczy. Bez Twojego SteamID i link\xF3w do profili.",
      dataForAnalysis: "Dane do analizy",
      "7Days": "7 dni",
      "30Days": "30 dni",
      "90Days": "90 dni",
      year: "rok",
      wholeHistory: "ca\u0142a historia",
      whichGameTheTradesSummary: "Kt\xF3ra gra: transakcje, podsumowanie i historia ekwipunku tylko dla niej (np. sam wynik na CS2, bez kart kolekcjonerskich)",
      allGames: "wszystkie gry",
      joinsIdenticalTradesOfOne: "\u0141\u0105czy takie same transakcje z jednego dnia (ten sam przedmiot, rodzaj, cena i stan) w jeden wiersz \xD7N; pojedynczy wiersz rozwiniesz, klikaj\u0105c \xD7N",
      groupIdentical: "Grupuj identyczne",
      trades: "Transakcje",
      openedCases: "Otwarte skrzynie",
      inventoryHistory: "Historia ekwipunku",
      everyTradeOnItsOwn: "Ka\u017Cda transakcja osobno albo zsumowane dla ka\u017Cdego przedmiotu",
      everyTrade: "ka\u017Cda transakcja",
      totalPerItem: "suma na przedmiot",
      filterItems: "Filtruj przedmiot\u2026",
      showHideTheResultMonth: "Poka\u017C / ukryj wynik w rozbiciu na miesi\u0105ce: flipy, skrzynie, wydane i otrzymane",
      months: "Miesi\u0105ce",
      showHideTheFlipProfit: "Poka\u017C / ukryj wykres zysku z flip\xF3w",
      chart: "Wykres",
      eachSaleIsPairedWith: "Zysk liczony metod\u0105 FIFO: ka\u017Cda sprzeda\u017C jest parowana z najstarszym niesprzedanym zakupem tego samego przedmiotu. Kwoty sprzeda\u017Cy s\u0105 ju\u017C po prowizji Steama. Sprzeda\u017Ce bez zakupu na rynku (dropy, skrzynki, wymiany) s\u0105 liczone osobno jako \u201Eprzych\xF3d bez kosztu\u201D.",
      allEvents: "wszystkie zdarzenia",
      trades2: "wymiany",
      cases: "skrzynie",
      contracts: "kontrakty",
      stickers: "naklejki",
      receivedDrops: "otrzymane / dropy",
      searchItemsPlayers: "Szukaj: przedmiot, gracz\u2026",
      everythingThatHappenedToYour: "Wszystko, co dzia\u0142o si\u0119 z Twoimi przedmiotami: wymiany (z kim i co za co), rynek, otwarte skrzynie, kontrakty, dropy (tak\u017Ce karty Steam za granie). Gra i okres jak w filtrach u g\xF3ry.",
      given: "oddane",
      historyOneTimeDownloadOf: "Historia: jednorazowo pobieram ca\u0142\u0105 histori\u0119 rynku od nowa (poprawione ceny sprzeda\u017Cy)\u2026",
      historyASyncIsAlready: "Historia: synchronizacja ju\u017C trwa.",
      illDownloadTheWholeMarket: 'Pobior\u0119 od nowa ca\u0142\u0105 histori\u0119 rynku i ca\u0142\u0105 histori\u0119 ekwipunku (CS2 i karty Steam). To od kilkudziesi\u0119ciu do kilkuset zapyta\u0144 do Steama i kilka minut.<br><span class="sub">Zwykle wystarcza \u201ESynchronizuj\u201D: dobiera tylko nowe wpisy (i tak dzieje si\u0119 samo po otwarciu tej zak\u0142adki).</span>',
      downloadEverything: "Pobierz wszystko",
      logIn: "Zaloguj si\u0119.",
      steamReturnedNoHistory: "Steam nie zwr\xF3ci\u0142 historii",
      historyNewestMarketTrade: "Historia: najnowsza transakcja na rynku",
      buy: "kupno",
      sale: "sprzeda\u017C",
      downloadedEvents: "pobrano {start}/{total} zdarze\u0144",
      historyStoppedISavedWhat: "Historia: przerwano, zapisa\u0142em to, co zd\u0105\u017Cy\u0142em pobra\u0107.",
      historyNewTradesInTotal: "Historia: +{added} nowych transakcji (razem {trades}).",
      knownPattern: ", \u{1F48E} znany wz\xF3r: {knownList}",
      noneIsAKnownRare: ", \u017Caden nie jest znanym rzadkim wzorem",
      historySeedKnownForOf: "Historia: seed znany dla {withSeed} z {all} transakcji{known}.",
      history: "Historia: ",
      waitingForARateEstimated: " \xB7 {pending} czeka na kurs/szacowan\u0105 cen\u0119",
      openInventoryToVerifyYou: " \xB7 otw\xF3rz Ekwipunek, \u017Ceby zweryfikowa\u0107 \u201Etrzymasz\u201D",
      tradesStored: "{n} transakcji w bazie{pending}{owned}",
      noDataClickSync: "Brak danych, kliknij Synchronizuj",
      spentOnTheMarket: "Wydano na rynku",
      receivedFromSales: "Otrzymano ze sprzeda\u017Cy",
      balance: "Bilans",
      receivedMinusSpent: "otrzymano minus wydano",
      flipProfit: "Zysk z flip\xF3w",
      flipsInProfit: "{realizedP} flip\xF3w \xB7 {realizedP2} na plus",
      item: "Przedmiot",
      bought: "Kupione",
      sold: "Sprzedane",
      profitLoss: "Zysk / strata",
      someAmountsAreEstimatedNo: "Cz\u0119\u015B\u0107 kwot oszacowana (brak ceny w historii Steama) albo przeliczona z innej waluty po kursie NBP",
      total: "razem",
      notBought: "nie kupowane",
      fromADropTrade: "z dropu/wymiany",
      youGot: "na r\u0119k\u0119",
      youHold: "trzymasz",
      worthToYouUnit: "warte {val} na r\u0119k\u0119 \xB7 {todayLow}/szt.",
      noPrice: "brak ceny",
      allSold: "wszystko sprzedane",
      today: "dzi\u015B",
      unit: "szt.",
      held: "trzymane",
      unrealised: "niezrealizowany",
      theItemLeftTheInventory: "Przedmiot wyszed\u0142 z ekwipunku inaczej ni\u017C przez sprzeda\u017C na rynku (wymiana, kontrakt, u\u017Cycie), nie da si\u0119 policzy\u0107 zysku",
      unknown: "nieznany",
      theItemDroppedFromA: "Przedmiot wypad\u0142 ze skrzyni/kapsu\u0142y. Koszt = skrzynia + klucz.",
      dropFrom: "drop z",
      aCase: "skrzyni",
      vsTheOpeningCost: "vs koszt otwarcia",
      noTradesInThisPeriod: "Brak transakcji w tym okresie.",
      notInSteamsHistory: "brak w historii Steam",
      steamCardBackgroundOrEmoticon: "karta, t\u0142o albo emotka Steam",
      theInventoryHistoryOfIsnt: "Historia ekwipunku dla {app} nie jest jeszcze pobrana (dzieje si\u0119 to samo po otwarciu tej zak\u0142adki).",
      olderThanTheHistory: "{what}, starsze ni\u017C historia",
      soldAndTheInventoryHistory: "Sprzedane {t}, a historia ekwipunku dla {app} zaczyna si\u0119 {from}. Sk\u0105d si\u0119 wzi\u0105\u0142, Steam ju\u017C nie pokazuje.",
      cardsUsuallyDropForPlaying: " (karty zwykle wypadaj\u0105 za granie albo z paczek)",
      neitherTheMarketHistoryNor: "Ani historia rynku, ani historia ekwipunku dla {app} nie m\xF3wi\u0105, sk\u0105d ten przedmiot si\u0119 wzi\u0105\u0142{app2}. Liczony jako przych\xF3d bez kosztu.",
      olderThanTheInventoryHistory: "starsze ni\u017C historia ekwipunku",
      soldAndTheSteamInventory: "Sprzedane {t}, a historia ekwipunku na Steamie zaczyna si\u0119 {first}. Sk\u0105d ten przedmiot si\u0119 wzi\u0105\u0142, Steam ju\u017C nie pokazuje.",
      probablyFromThe: "prawdopodobnie ze skrzyni {c}",
      steamDidntRecordWhereThis: "Steam nie zapisa\u0142, sk\u0105d ten przedmiot si\u0119 wzi\u0105\u0142: w historii ekwipunku pojawia si\u0119 dopiero przy wystawieniu albo sprzeda\u017Cy.\nTen skin jest w skrzyni {c}, a w 14 dniach przed jego pierwszym pojawieniem si\u0119 w historii ({seen}) otwiera\u0142e\u015B takie skrzynie ({n}\xD7, ostatnio {t}), wi\u0119c najpewniej wypad\u0142 z otwarcia, kt\xF3rego Steam nie zapisa\u0142. Historia Steama z pocz\u0105tku 2014 ma takie luki.\nKoszt nieznany, liczony jako przych\xF3d bez kosztu.",
      andOthers: " (i innych)",
      skinFromThe: "skin ze skrzyni {cases}{cases2}",
      steamDidntRecordWhereThis2: "Steam nie zapisa\u0142, sk\u0105d ten przedmiot si\u0119 wzi\u0105\u0142. Ten skin jest w skrzyni {cases}, ale nie otwiera\u0142e\u015B jej w 14 dniach przed jego pierwszym pojawieniem si\u0119 w historii ({seen}): m\xF3g\u0142 to by\u0107 drop, wymiana albo otwarcie, kt\xF3rego Steam nie zapisa\u0142.",
      theInventoryHistoryIsntFully: "\nHistoria ekwipunku nie jest jeszcze pobrana do ko\u0144ca: zsynchronizuj j\u0105 w zak\u0142adce \u201EHistoria ekwipunku\u201D, tak\u017Ce starsze wpisy.",
      notBoughtOnTheMarket: "Nie kupione na rynku, a w historii ekwipunku nie ma, sk\u0105d si\u0119 wzi\u0105\u0142 (drop, wymiana albo zdarzenie, kt\xF3rego Steam nie zapisa\u0142).{ih}",
      date: "Data",
      type: "Typ",
      buySellPrice: "Cena zakupu / sprzeda\u017Cy",
      priceToday: "Cena dzi\u015B",
      aDropRewardOrGift: "Drop, nagroda albo prezent: nic nie kosztowa\u0142, wi\u0119c zysk to ca\u0142a kwota na r\u0119k\u0119.",
      theContract: "kontraktu",
      theTrade: "wymiany",
      aGiftYouGaveNothing: "Prezent: nic za niego nie odda\u0142e\u015B, wi\u0119c zysk to ca\u0142a kwota na r\u0119k\u0119.",
      costTheValueOfWhat: "Koszt = warto\u015B\u0107 tego, co odda\u0142e\u015B ({gave}) z dnia {day}; licz\u0119 ceny z tamtego dnia\u2026",
      costTheMarketValueOf: "Koszt = rynkowa warto\u015B\u0107 tego, co odda\u0142e\u015B ({gave}) z dnia {day}, w przeliczeniu na ten przedmiot: {cost}.",
      boughtInTheSteamStore: "Kupione w sklepie Steam za {price} (historia zakup\xF3w, {t}).",
      boughtInTheSteamStore2: "Kupione w sklepie Steam, ale tego zakupu nie ma w historii zakup\xF3w Steam, wi\u0119c kwota nie jest znana.",
      costUnknownThisEventDoesnt: "Koszt nieznany: to zdarzenie nie m\xF3wi, ile ten przedmiot kosztowa\u0142.",
      takenOffAnItem: "zdj\u0119ta z przedmiotu {d}",
      with: " od {e}",
      fromATrade: "z wymiany {d}{href}",
      fromAContract: "z kontraktu {d}",
      fromACaseCapsule: "ze skrzyni / kapsu\u0142y {d}",
      gift: "prezent {d}",
      forTheStoreDiscoveryQueue: "za kolejk\u0119 odkry\u0107 w sklepie {d}",
      dropForPlaying: "drop za granie {d}",
      fromTheSteamStore: "ze sklepu Steam {d}",
      dropForPlaying2: "drop za gr\u0119 {d}",
      inRows: " w {groups} wierszach",
      priceEstimatedFromTheMarket: "Cena oszacowana z historii cen rynku, Steam zapisa\u0142 t\u0119 transakcj\u0119 tylko w historii ekwipunku, bez kwoty.",
      convertedFromAnotherCurrencyAt: "Przeliczone z innej waluty po kursie NBP z dnia transakcji.",
      sold2: "sprzedane",
      inInventory: "{unsold} w ekwipunku",
      inInventory2: "w ekwipunku",
      boughtFor: "kupione za",
      openingCostTheCaseThe: "Koszt otwarcia = skrzynia + klucz",
      cost: "koszt",
      saleMinusTheOpeningCost: "Sprzeda\u017C minus koszt otwarcia skrzyni",
      notBoughtOnTheMarket2: "Nie kupione na rynku",
      profitYouGotCost: "Zysk = na r\u0119k\u0119 {price} \u2212 koszt {cost}",
      todayYoudGetAfterThe: "Dzi\u015B na r\u0119k\u0119 (po prowizji): {now}, kupuj\u0105cy zap\u0142aci\u0142by {low}. Por\xF3wnanie z tym, ile wtedy dosta\u0142e\u015B na r\u0119k\u0119.",
      lowestPriceTodayWhatYoud: "Najni\u017Csza cena dzi\u015B (tyle zap\u0142aci\u0142by\u015B): {low}, por\xF3wnanie z cen\u0105 zakupu",
      collapse: "zwin\u0105\u0107",
      expand: "rozwin\u0105\u0107",
      identicalTradesThatDayClick: "{n} takich samych transakcji tego dnia, kliknij, \u017Ceby {k}",
      whatYouGotAfterSteams: "Na r\u0119k\u0119 (po prowizji Steama). Kupuj\u0105cy zap\u0142aci\u0142 {price}.",
      whatYouPaid: "Tyle zap\u0142aci\u0142e\u015B",
      allUnitsToday: "Wszystkie {n} szt. dzi\u015B",
      aboutInHandAfterSelling: ", na r\u0119k\u0119 po sprzeda\u017Cy ok. {low}",
      showThisCopyInInventory: "Poka\u017C ten egzemplarz w Ekwipunku (bez grupowania)",
      showTheseItemsInInventory: "Poka\u017C te przedmioty w Ekwipunku",
      notUsedYet: "jeszcze nie u\u017Cyty",
      bought2: "kupiono: {bought}",
      nothingBought: "nic nie kupiono",
      activated: "aktywowany{d}, {bought}",
      opened: "otwarte{d}{g}",
      to: " na {g}",
      applied: "naklejona{d}{g}",
      got: ", wysz\u0142o: {g}",
      contract2: "kontrakt{d}{g}",
      traded: "wymienione{d}",
      activated2: "aktywowane",
      opened2: "otwarte",
      traded2: "wymienione",
      applied2: "naklejone",
      detailsAfterExpandingTheGroup: "Szczeg\xF3\u0142y po rozwini\u0119ciu grupy (\u25B8 \xD7N przy nazwie)",
      outOfInv: "poza ekwip.",
      with2: " z {name}",
      got2: ", w zamian: {g}",
      traded3: "wymienione{name}{g}",
      boughtOnTheMarketBut: "Kupione na rynku, ale nie ma ich ju\u017C w ekwipunku. Zsynchronizuj histori\u0119 ekwipunku (zak\u0142adka \u201EHistoria ekwipunku\u201D), \u017Ceby zobaczy\u0107, co si\u0119 z nimi sta\u0142o.",
      with3: "z",
      steamCardsAndBackgrounds: "karty i t\u0142a Steam",
      game: "gra {app}",
      reached: " \xB7 doszed\u0142em do {oldest}",
      downloadingNewEventsPages: "pobieram\u2026 {cnt} nowych zdarze\u0144 ({pages} str.){oldest}",
      inventoryHistoryEvents: "Historia ekwipunku: +{n} zdarze\u0144.",
      inventoryHistory2: "Historia ekwipunku: ",
      complete: "ca\u0142a",
      notCompleteYet: "jeszcze nie ca\u0142a",
      inventoryHistoryEvents2: "Historia ekwipunku ({app}): +{s} zdarze\u0144, {app2}.",
      since: " \xB7 od {gOld}",
      wholeHistory2: " (ca\u0142a historia)",
      olderOnesNotDownloadedYet: " \xB7 starsze jeszcze niepobrane, doci\u0105gn\u0119 przy nast\u0119pnej synchronizacji",
      eventsStoredSynced: "{src} zdarze\u0144 w bazie{gOld}{gApp2} \xB7 zsynchronizowano {gApp}",
      notSynced: "nie zsynchronizowano",
      event: "Zdarzenie",
      items: "Przedmioty",
      noEventsInThisPeriod: "Brak zdarze\u0144 w tym okresie",
      clickSync: ", kliknij Synchronizuj",
      likeYourKeyFrom: "jak Tw\xF3j klucz z ",
      "249UsdAtThat": "\u2248 2,49 USD po kursie z dnia, brak zakupu klucza w historii",
      "249UsdAtTodays": "2,49 USD po dzisiejszym kursie",
      downloadingThePurchaseHistory: "pobieram histori\u0119 zakup\xF3w\u2026",
      purchaseHistory: "historia zakup\xF3w: {n}\u2026",
      steamPurchaseHistoryEntriesCs2: "Historia zakup\xF3w Steam: {rows} pozycji ({isCS} zakup\xF3w w CS2).",
      steamPurchaseHistory: "Historia zakup\xF3w Steam: ",
      fromTheMarket: "z rynku",
      purchaseHistory2: "historia zakup\xF3w",
      sold3: "sprzedany",
      marketPriceOfTheTrade: "cena rynkowa z dnia wymiany",
      shareOfWhatYouGot: "udzia\u0142 w tym, co dosta\u0142e\u015B: {mine} z {gaveSum} oddanych \u2192 {gotSum} otrzymanych",
      traded4: "wymieniony",
      inReturn: "\nW zamian: ",
      youGotNothingInReturn: "\nNic nie dosta\u0142e\u015B w zamian (prezent?), liczona cena rynkowa",
      value: "Warto\u015B\u0107",
      inYourInventory: "masz w ekwipunku",
      notInTheInventory: "nie ma w ekwipunku",
      bought3: "kupiona",
      fromATrade2: "z wymiany",
      fromADrop: "z dropu",
      entered: "wpisane",
      periodLastDaysChangeIt: "okres: ostatnie {period} dni (zmie\u0144 u g\xF3ry) \xB7 ",
      estimatingPrices: "szacuj\u0119 ceny ({waiting})\u2026 \xB7 ",
      dataFromTheInventoryHistory: "dane z historii ekwipunku",
      syncTheInventoryHistoryThe: "zsynchronizuj histori\u0119 ekwipunku (zak\u0142adka \u201EHistoria ekwipunku\u201D)",
      purchaseHistoryCs2Purchases: " \xB7 historia zakup\xF3w: {isCS} zakup\xF3w CS2",
      openings: "Otwarcia",
      inProfit: "{plus}/{done} na plus",
      workingOutTheResult: "licz\u0119 wynik\u2026",
      openingCost: "Koszt otwar\u0107",
      casesAndKeys: "Skrzynie i klucze",
      terminalsTerminalInGamePurchase: "Terminale (terminal + zakup w grze)",
      casesTerminals: "skrzynie {spent} \xB7 terminale {spentTerm}",
      casesKeys: "skrzynie + klucze",
      dropValue: "Warto\u015B\u0107 drop\xF3w",
      afterTheFee: "po prowizji",
      profitLossOnCases: "Zysk / strata na skrzyniach",
      withoutTerminalsWithNoAmount: " \xB7 bez terminali bez kwoty",
      bestDrop: "Najlepszy drop",
      caseTerminal: "Skrzynia / terminal",
      cost2: "Koszt",
      dropPurchase: "Drop / zakup",
      whatHappenedToIt: "Co si\u0119 z nim sta\u0142o",
      terminalOnceUnsealedYouCan: "Terminal: po odpiecz\u0119towaniu mo\u017Cna kupi\u0107 przedmiot u Arms Dealera za pieni\u0105dze z portfela Steam",
      aCaseOpenedWithA: "Skrzynia otwarta kluczem",
      paid: "zap\u0142acono",
      amount: "kwota",
      inGamePurchase: "zakup w grze",
      key: "klucz",
      enterTheAmountPaidIn: "Wpisz kwot\u0119 zap\u0142acon\u0105 w terminalu (pole \u201Ezap\u0142acono\u201D w kolumnie Skrzynia)",
      enterAmount: "wpisz kwot\u0119",
      noOpenedCasesInThis: "Brak otwartych skrzy\u0144 w tym okresie",
      syncTheInventoryHistoryFirst: ", najpierw zsynchronizuj histori\u0119 ekwipunku",
      tradePartnersProfile: "Profil partnera wymiany",
      profile: "profil",
      checksThePartnersPublicInventory: "Sprawdza publiczny ekwipunek partnera (1 zapytanie)",
      doesHeStillHaveIt: "czy nadal ma?",
      checking: "sprawdzam\u2026",
      thisItemSameNameAnd: "Ten przedmiot (ta sama nazwa i stan) jest w jego ekwipunku",
      stillHasIt: "nadal ma",
      itIsntInTheirInventory: "Nie ma go w jego ekwipunku, sprzeda\u0142 lub wymieni\u0142 dalej",
      noLongerHasIt: "ju\u017C nie ma",
      thePartnersInventoryIsPrivate: "Ekwipunek partnera jest prywatny",
      privateInventory: "prywatny ekwipunek",
      checkFailed: "b\u0142\u0105d sprawdzania",
      lowestPriceTodayInHand: "Najni\u017Csza cena dzi\u015B: {low} (na r\u0119k\u0119 po prowizji {today})",
      lowestPriceToday: "Najni\u017Csza cena dzi\u015B: {low}",
      inProfit2: "na plus",
      open: "otw.",
      withoutAResult: ", {open} bez wyniku",
      resultByMonth: "Wynik w miesi\u0105cach",
      flipsAndCasesWithA: "flipy i skrzynie z wynikiem, wydane i otrzymane na rynku (po prowizji)",
      month: "Miesi\u0105c",
      cases2: "Skrzynie",
      spent: "Wydano",
      received2: "Otrzymano",
      total2: "Razem",
      tooFewSalesToDraw: "Za ma\u0142o sprzeda\u017Cy, \u017Ceby narysowa\u0107 wykres.",
      cumulativeFlipProfit: "Zysk z flip\xF3w narastaj\u0105co",
      theTableAndCardsShow: "tabela i karty pokazuj\u0105 tylko {x0} - {x1}: ",
      total3: "razem: ",
      showAll: "poka\u017C ca\u0142o\u015B\u0107",
      dragTheMouseOverThe: "przeci\u0105gnij mysz\u0105 po wykresie, \u017Ceby przybli\u017Cy\u0107",
      from: "od",
      aGameDrop: "drop z gry"
    },
    inventory: {
      steamCards: "Steam (karty)",
      forSaleClickToUnmark: "Na sprzeda\u017C, kliknij, \u017Ceby odznaczy\u0107",
      markForSaleTheFor: "Oznacz na sprzeda\u017C: filtr \u201E\u{1F4CC} na sprzeda\u017C\u201D i sprawdzanie ofert co 10 minut (zmiany w logu)",
      inUnderAnHour: "w mniej ni\u017C godzin\u0119",
      inAboutH: "w ok. {d} godz.",
      inAboutDays: "w ok. {d} dnia",
      sellRightAwayToThe: "Sprzedaj od razu do zlecenia kupna: {price} (na r\u0119k\u0119 {net}).",
      waitingForAHigherPrice: "Czekanie na wy\u017Csz\u0105 cen\u0119 da\u0142oby najwy\u017Cej ~2% wi\u0119cej.",
      listItForYouGet: "Wystaw za {price} (na r\u0119k\u0119 {net}).",
      chanceItSellsWithin: "Szansa, \u017Ce sprzeda si\u0119 w {horizon}: {chance}.",
      inTheLastDaysOnly: "W ostatnich {days} dniach po tej cenie lub dro\u017Cej sprzedano tylko {n} z {total} szt., czas sprzeda\u017Cy trudno przewidzie\u0107.",
      itShouldSell: "Powinna zej\u015B\u0107 {wait}.",
      rightAwayToTheBuy: "Od razu do zlecenia kupna: {price}.",
      thePriceUsuallyDropsAfter: "Cena zwykle spada po kilku dniach, nie przeci\u0105gaj.",
      floatAndStickersAreNot: "Float i naklejki nie s\u0105 wliczone.",
      rightAway: "Od razu",
      toTheOrderWaitingGives: "do zlecenia, czekanie da \u2264 2% wi\u0119cej",
      listFor: "Wystaw za",
      only: "tylko ",
      chanceWithin: "szansa w {horizon}: {lowChance}{chance}",
      inDaysThisMuchOr: "w {days} dni tyle lub dro\u017Cej: {n} z {total} szt.",
      willSell: "zejdzie {wait}",
      noSalesData: "brak danych o sprzeda\u017Cy",
      load: "Wczytaj",
      search: "Szukaj\u2026",
      layout: "Uk\u0142ad",
      price: "Cena \u2193",
      name: "Nazwa",
      stickers: "Naklejki \u2193",
      newest: "Najnowsze",
      joinsIdenticalItemsNoFloat: "\u0141\u0105czy identyczne przedmioty (bez floatu, naklejek i name taga, ten sam koszt i stan blokady) w jedn\u0105 kart\u0119 z liczb\u0105 sztuk",
      groupIdentical: "Grupuj identyczne",
      pricesAreWorkedOutBy: "Ceny wyceniaj\u0105 si\u0119 same po wczytaniu (cache 6 h). Ten przycisk od\u015Bwie\u017Ca je od razu, dla zaznaczonych lub, gdy nic nie zaznaczono, dla wszystkich.",
      refreshSteamPrices: "Od\u015Bwie\u017C ceny Steam",
      downloadsFromTheSteamMarket: "Pobiera z Rynku Steam ksi\u0119g\u0119 zlece\u0144 i pe\u0142n\u0105 histori\u0119 cen Twoich przedmiot\xF3w (zaznaczonych albo wszystkich) i zapisuje je do pliku, do wsp\xF3lnej analizy, czy i po ile sprzedawa\u0107. Tylko odczyt, niczego nie kupuje ani nie wystawia.",
      dataForAnalysis: "Dane do analizy",
      onlyItemsWithTheIn: "Tylko przedmioty ze znaczkiem \u201Ez zyskiem\u201D albo \u201Edrogo teraz\u201D, te, kt\xF3re Flipster radzi sprzeda\u0107. \u201ECena spada\u201D jest tylko informacj\u0105: w sprawdzeniu na historii cen nie przewidywa\u0142 dalszych spadk\xF3w.",
      worthSelling: "Warte sprzeda\u017Cy",
      show: "Poka\u017C",
      sellableCanBeListedNow: "Sprzedawalne: mo\u017Cna wystawi\u0107 teraz (i wystawione). Z blokad\u0105 handlu: do sprzedania po odblokowaniu. Niesprzedawalne: nigdy na rynek (medale, odznaki, monety\u2026).",
      all: "Wszystkie",
      sellable: "Sprzedawalne",
      tradeLocked: "Z blokad\u0105 handlu",
      unsellable: "Niesprzedawalne",
      alsoShowsTheItemsYou: "Pokazuje te\u017C przedmioty, kt\xF3re masz wystawione na Rynku Steam",
      listed: "Wystawione",
      onlyItemsMarkedForSale: "Tylko przedmioty oznaczone \u{1F4CC} na sprzeda\u017C (ich oferty sprawdzam co 10 minut, zmiany wida\u0107 w logu)",
      forSale: "Na sprzeda\u017C",
      clickItemsToSelectThem: "Kliknij przedmioty, aby je zaznaczy\u0107. Shift-klik zaznacza zakres.",
      selectVisible: "zaznacz widoczne",
      deselect: "odznacz",
      sellSelected: "Sprzedaj zaznaczone\u2026",
      showMore: "Poka\u017C wi\u0119cej",
      marketFloatsSteamIsLimiting: "Floaty z rynku: Steam ogranicza zapytania, doko\u0144cz\u0119 p\xF3\u017Aniej.",
      rankingExceptionallyLowFloatAt: "Ranking: wyj\u0105tkowo niski float, ni\u017Cszy ma najwy\u017Cej 1 na 1000 egzemplarzy w tym stanie",
      rankingExceptionallyHighFloatAt: "Ranking: wyj\u0105tkowo wysoki float, wy\u017Cszy ma najwy\u017Cej 1 na 1000 egzemplarzy w tym stanie (najgorszy mo\u017Cliwy; bywa ceniony, np. \u201Emax float\u201D)",
      marketTheLowestFloatAmong: "Rynek: najni\u017Cszy float w\u015Br\xF3d {n} sprawdzonych ofert tego przedmiotu (najni\u017Cszy z nich: {min})",
      marketTheHighestFloatAmong: "Rynek: najwy\u017Cszy float w\u015Br\xF3d {n} sprawdzonych ofert tego przedmiotu (najwy\u017Cszy z nich: {max})",
      floatOnlyOfAllCopies: "Float {float}: ni\u017Cszy ma tylko {lower} wszystkich egzemplarzy w stanie {wear} (zakres tego skina w tym stanie: {lo}-{hi}). Kliknij, \u017Ceby por\xF3wna\u0107 z ofertami na rynku.",
      clickToCompareTheFloat: "Kliknij, \u017Ceby por\xF3wna\u0107 float z ofertami na rynku.",
      listingsWithAKnownPattern: "Oferty ze znanym wzorem",
      amongChecked: "({hits} w\u015Br\xF3d {all} sprawdzonych)",
      pattern: "Wz\xF3r",
      price2: "Cena",
      nearlyAtThePriceOf: "Prawie w cenie najta\u0144szej oferty: sprzedaj\u0105cy mo\u017Ce nie wiedzie\u0107, co ma",
      cheap: "tanio",
      floatAgainstTheMarket: "Float na tle rynku",
      close: "Zamknij",
      yourFloat: "Tw\xF3j float",
      exceptionallyLowFloat: "Wyj\u0105tkowo niski float",
      exceptionallyHighWorstFloat: "Wyj\u0105tkowo wysoki (najgorszy) float",
      lower: "ni\u017Cszy",
      higher: "wy\u017Cszy",
      suchAnItemCanBe: "Taki przedmiot mo\u017Ce by\u0107 w \u015Bwiatowej czo\u0142\xF3wce",
      theWorstFloatsHaveCollectors: "Najgorsze floaty te\u017C maj\u0105 kolekcjoner\xF3w (np. \u201Emax float\u201D)",
      atMost1In1000: "<b>{super}</b>, {super2} ma najwy\u017Cej 1 na 1000 egzemplarzy w tym stanie. {super3}: zanim go sprzedasz, sprawd\u017A jego miejsce w bazie float\xF3w (np. CSFloat, SIH) i nie wystawiaj go za cen\u0119 zwyk\u0142ego egzemplarza.",
      youCanCheckThePlace: "Miejsce w\u015Br\xF3d znanych egzemplarzy (np. \u201E#3 najni\u017Cszy\u201D) sprawdzisz w bazach float\xF3w:",
      theyOpenInANew: "otwieraj\u0105 si\u0119 w nowej karcie, nic nie wysy\u0142am do nich sam.",
      inForThisSkinOnly: 'W stanie {wear} (dla tego skina {lo}-{hi}) ni\u017Cszy float ma tylko <b>{lower}</b> wszystkich egzemplarzy, lepszy jest od <b>{lower2}</b>.<br><span class="sub">Valve losuje najpierw stan, potem float r\xF3wnomiernie w jego zakresie, wi\u0119c to dok\u0142adny odsetek, bez zewn\u0119trznych baz. Najni\u017Cszy mo\u017Cliwy w tym stanie: {best}.</span>',
      iDontKnowTheFloat: "Nie znam zakresu floatu tego skina, pokazuj\u0119 tylko por\xF3wnanie z rynkiem.",
      downloadingListingsFromTheMarket: "pobieram oferty z rynku\u2026",
      steamGaveNoFloatsFor: "Steam nie poda\u0142 float\xF3w ofert tego przedmiotu ({all} ofert sprawdzonych), por\xF3wnanie z rynkiem niemo\u017Cliwe bez zewn\u0119trznych serwis\xF3w.",
      onTheMarketListingsI: "Na rynku: {total} ofert, sprawdzi\u0142em {all} najta\u0144szych ({withF} z floatem).",
      aLowerFloatThanYours: "Ni\u017Cszy float od Twojego ma <b>{lower}</b> z nich",
      theLowestFor: ", najni\u017Cszy {float} za <b>{price}</b>",
      youHaveTheLowestFloat: "masz najni\u017Cszy float w\u015Br\xF3d sprawdzonych ofert",
      cheapestListing: "Najta\u0144sza oferta",
      lowerThanYours: "ni\u017Cszy od Twojego",
      higherThanYours: "wy\u017Cszy od Twojego",
      aboveTheCheapest: "ponad najta\u0144sz\u0105",
      listingsWithAFloatSimilar: "Oferty z floatem podobnym do Twojego, je\u015Bli wyra\u017Anie dro\u017Cej ni\u017C najta\u0144sza, to tyle kupuj\u0105cy chc\u0105 dop\u0142aca\u0107 za taki float (o ile kto\u015B je kupuje). Licz\u0105 si\u0119 tylko oferty, kt\xF3re sprawdzi\u0142em (najta\u0144sze {all}).",
      cheapestListingTo: "\u{1F4CC} {name}: najta\u0144sza oferta {low} \u2192 {low2} ({low3}{low4}%)",
      buyersNowPaySellingRight: "\u{1F4CC} {name}: kupuj\u0105cy p\u0142ac\u0105 ju\u017C {price}, sprzeda\u017C od razu si\u0119 op\u0142aca",
      steamIsLimitingRequestsIll: "\u{1F4CC} Steam ogranicza zapytania, oznaczone sprawdz\u0119 przy nast\u0119pnej rundzie.",
      oneMomentTheInventoryIs: "Chwila: ekwipunek si\u0119 jeszcze od\u015Bwie\u017Ca, wystawianie w\u0142\u0105czy si\u0119, gdy przyjdzie aktualny stan.",
      selectedInTheInventory: "zaznaczonych w ekwipunku",
      fromYourInventoryAlsoListed: "z Twojego ekwipunku (tak\u017Ce wystawionych i z blokad\u0105)",
      logInToSteam: "Zaloguj si\u0119 do Steam.",
      loadingTheInventory: "\u0141adowanie ekwipunku\u2026",
      inventoryItems: "Ekwipunek: {items} przedmiot\xF3w.",
      inventoryOnTheMarket: "Ekwipunek: na rynku {listed}.",
      couldntRefreshTheInventory: "Nie uda\u0142o si\u0119 od\u015Bwie\u017Cy\u0107 ekwipunku: ",
      couldntLoadTheListingsFrom: "Nie uda\u0142o si\u0119 wczyta\u0107 ofert z rynku: ",
      steamIsLimitingRequestsValuation: "Steam ogranicza zapytania, wycenianie wstrzymane, spr\xF3buj za kilka minut.",
      valuedItemsSteamPrices: "Wyceniono {n} przedmiot\xF3w (ceny Steam).",
      inventoryCouldntFindMaybeYou: "Ekwipunek: nie znalaz\u0142em \u201E{hash}\u201D, mo\u017Ce ju\u017C go nie masz.",
      locked: "zablokowane",
      onTheMarket: "na rynku",
      items: "Przedmioty",
      sellable2: "do sprzedania",
      locked2: "z blokad\u0105",
      steamValue: "Warto\u015B\u0107 Steam",
      valuing: "wyceniam",
      everythingInTheInventory: "wszystko w ekwipunku",
      withoutAPrice: "bez ceny",
      sellableNow: "Do sprzedania teraz",
      pcs: "szt.",
      youGet: "otrzymasz",
      onTheMarket2: "Na rynku",
      undercut: "przebite",
      selected: "Zaznaczone",
      selectedEntries: "Zaznaczono {selG} pozycji ({selVal})",
      availableWhenTheInventoryHas: "Dost\u0119pne, gdy ekwipunek si\u0119 od\u015Bwie\u017Cy",
      couldntRefreshTheInventory2: "Nie uda\u0142o si\u0119 od\u015Bwie\u017Cy\u0107 ekwipunku ({err}).",
      showingTheStateFromSelling: "Pokazuj\u0119 stan z {at}, sprzeda\u017C jest wy\u0142\u0105czona.",
      tryAgain: "Spr\xF3buj ponownie",
      showingTheInventoryFromRefreshing: "Pokazuj\u0119 ekwipunek z {at}, od\u015Bwie\u017Cam. Wystawianie w\u0142\u0105czy si\u0119, gdy przyjdzie aktualny stan.",
      noItemsInThisView: "Brak przedmiot\xF3w w tym widoku, zmie\u0144 filtry \u201EPoka\u017C\u201D.",
      noItems: "Brak przedmiot\xF3w.",
      availableWhenTheInventoryHas2: "Dost\u0119pne, gdy ekwipunek si\u0119 od\u015Bwie\u017Cy (teraz wida\u0107 zapisany stan)",
      aGameDrop: "drop z gry",
      fromAnOperationPassMissions: "z operacji (przepustka / misje)",
      rewardForALevelRank: "nagroda za poziom / rang\u0119",
      gift: "prezent",
      aGameDropOnSteam: "drop z gry na Steamie",
      storePurchase: "zakup w sklepie",
      received: "otrzymany",
      bought: "kupiony",
      fromACase: "ze skrzyni",
      fromATerminal: "z terminala",
      fromATrade: "z wymiany",
      fromAContract: "z kontraktu",
      aDefaultItemEveryPlayer: "Domy\u015Blny przedmiot, kt\xF3ry dostaje ka\u017Cdy gracz (w ekwipunku wida\u0107 go, gdy ma name tag, naklejk\u0119 albo to domy\u015Blny music kit)",
      defaultItemFromTheGame: "domy\u015Blny przedmiot z gry",
      boughtOnTheMarketFor: "Kupiony na rynku {date} za {cost}",
      droppedFromACaseCost: "Wypad\u0142 ze skrzyni {detail} ({date}). Koszt = skrzynia + klucz: {cost}",
      boughtInTheTerminalCost: "Kupiony w terminalu {detail} ({date}). Koszt = terminal + zap\u0142ata w grze: {cost}",
      nothingAGift: "nic, prezent",
      fromATradeCostThe: "Z wymiany{detail} ({date}). Koszt = warto\u015B\u0107 tego, co odda\u0142e\u015B ({gave}) w przeliczeniu na ten przedmiot: {cost}",
      fromAContractCostThe: "Z kontraktu ({date}). Koszt = warto\u015B\u0107 oddanych przedmiot\xF3w: {cost}",
      steamTradingCardsBackgroundsAnd: "Karty kolekcjonerskie, t\u0142a i emotikony Steam wypadaj\u0105 za granie w gry. Ani historia rynku, ani historia ekwipunku Steam nie maj\u0105 zakupu tego przedmiotu, kt\xF3ry by jeszcze zosta\u0142 (np. drop sprzed pocz\u0105tku historii): to najpewniej drop, koszt 0.",
      forAllUnits: ", za wszystkie {qty} szt.",
      sellingAtTheLowestPrice: "sprzeda\u017Cy po najni\u017Cszej cenie",
      estimatedCost: " (koszt szacunkowy)",
      whatYouGetWhenMinus: "Na r\u0119k\u0119 przy {what} minus to, ile Ci\u0119 kosztowa\u0142{approx}{g}",
      perUnit: "Na sztuk\u0119",
      result: "wynik",
      workingOutTheCost: "Licz\u0119 koszt\u2026",
      couldntWorkOutTheCost: "Nie uda\u0142o si\u0119 ustali\u0107 kosztu",
      cost: "koszt",
      whatItCostYou: "Ile Ci\u0119 kosztowa\u0142",
      estimatedThisPurchaseIsNot: " (szacunkowo, brak tego zakupu w historii transakcji, cena rynkowa z tamtego dnia)",
      estimated: " (szacunkowo)",
      todayYoudGet: "; dzi\u015B dosta\u0142by\u015B na r\u0119k\u0119 {net}",
      free: "za darmo",
      showOnTheSteamMarket: "Poka\u017C na rynku Steam",
      theSameWearAndStattrak: "Ten sam stan zu\u017Cycia i StatTrak/Souvenir, otwiera si\u0119 w nowej karcie",
      listedOnTheMarketYou: "Wystawione na rynku, cen\u0119 zmienisz w zak\u0142adce Rynek \u2192 Moje oferty",
      takesTheListingOffThe: "Zdejmij ofert\u0119 z rynku, przedmiot wr\xF3ci do ekwipunku. Najpierw poka\u017C\u0119 potwierdzenie.",
      takeOff: "Zdejmij",
      identicalUnitsInThisGroup: "{qty} takie same sztuki w tej grupie (ten sam koszt i stan blokady)",
      onTheMarketFor: "na rynku za",
      checkingTheMarket: "sprawdzam rynek\u2026",
      undercutCheapest: "przebita, najni\u017Csza {low}",
      yoursIsTheCheapest: "Twoja jest najta\u0144sza",
      whatYouGetAfterThe: "Ile dostaniesz po prowizji przy Twojej cenie wystawienia; pod spodem najni\u017Csza cena na rynku",
      youGet2: "na r\u0119k\u0119",
      market: "rynek",
      sellingAtYourListingPrice: "sprzeda\u017Cy po Twojej cenie wystawienia",
      listOnTheMarketA: "Wystaw na rynku: okno z proponowan\u0105 cen\u0105 (ta z ramki \u201EWystaw za\u201D), najszybsz\u0105 i w\u0142asn\u0105 do wpisania, zobaczysz, ile dostaniesz i jaka jest szansa sprzeda\u017Cy.",
      list: "Wystaw",
      sellRightAwayToThe2: "Sprzedaj od razu do najwy\u017Cszego zlecenia kupna (zwykle taniej). Najpierw poka\u017C\u0119 cen\u0119 i potwierdzenie.",
      now: "Teraz",
      illListThisItemMyself: "Wystawi\u0119 ten przedmiot sam, gdy sko\u0144czy si\u0119 blokada handlu",
      changeTheSalePlan: "Zmie\u0144 plan sprzeda\u017Cy",
      planASale: "Zaplanuj sprzeda\u017C",
      youGetWhatYouGet: "Na r\u0119k\u0119 = ile dostaniesz po prowizji Steama. Rynek = najni\u017Csza cena na rynku Steam (tyle p\u0142aci kupuj\u0105cy)",
      sellPer24h: " \xB7 sprzedaje si\u0119 {volume} szt./24h",
      forAllUnitsTogetherThe: "\n\nZa wszystkie {qty} szt. razem, linia ni\u017Cej to jedna sztuka.",
      stickersPriceOfNewOnes: "Naklejki (cena nowych na rynku)",
      appliedOnesUsuallyRaiseThe: "Naklejone podnosz\u0105 cen\u0119 skina zwykle tylko o u\u0142amek tej kwoty (cz\u0119sto 5-15%), chyba \u017Ce to rzadkie naklejki.",
      stickers2: "naklejki",
      thisItemCantBeSold: "Tego przedmiotu nie da si\u0119 sprzeda\u0107 na rynku",
      unsellable2: "niesprzedawalny",
      until: "do ",
      tradeLock: "blokada handlu",
      theItemHasATrade: "\n\nPrzedmiot ma blokad\u0119 handlu: to stan na dzi\u015B, sprzeda\u0107 mo\u017Cesz dopiero po odblokowaniu.",
      downloadingThePriceHistoryOf: "Pobieram histori\u0119 cen tego przedmiotu: sprawdz\u0119, czy cena nie spada i czy nie jest teraz wyj\u0105tkowo wysoko\u2026",
      checking: "sprawdzam",
      trendCheckedThePriceIsnt: "\n\nTrend sprawdzony: cena nie spada i nie jest teraz wyj\u0105tkowo wysoko.",
      thePriceIsNormalNot: "Cena w normie, nie spada, a nie masz tu zysku wzgl\u0119dem ceny zakupu, nic nie przemawia za sprzeda\u017C\u0105 teraz",
      hold: "trzymaj",
      steamHasNoPriceHistory: "Steam nie ma historii cen tego przedmiotu (za ma\u0142o sprzeda\u017Cy)",
      noPriceHistory: "brak historii cen",
      noSellableItems: "Brak sprzedawalnych przedmiot\xF3w.",
      refreshingSteamPricesForItems: "Od\u015Bwie\u017Cam ceny Steam dla {list} przedmiot\xF3w (~{min} min)\u2026",
      saved: "zapisana",
      noSavedPrice: "brak zapisanej ceny",
      noListingsOnTheMarket: "brak ofert na rynku",
      chanceToSellWithinFrom: "szansa sprzeda\u017Cy w {horizon}: {chance} (z historii przedmiotu)",
      aCentBelowTheCheapest: "grosz taniej ni\u017C najta\u0144sza ({cheapest}), brak danych o sprzeda\u017Cy",
      inDaysOnlyOfUnits: "w {days} dni po tej cenie lub dro\u017Cej sprzedano tylko {n} z {total} szt.",
      shouldSellCheaperListingsAhead: "powinna zej\u015B\u0107 {wait}, {ahead} ta\u0144szych ofert przed Tob\u0105",
      aCentBelowTheCheapest2: "grosz taniej ni\u017C najta\u0144sza ({cheapest})",
      sellingRightAwayToThe: " \xB7 od razu do zlecenia dostaniesz prawie tyle samo ({price})",
      theCheapestListingsAreClearly: " \xB7 najta\u0144sze oferty s\u0105 wyra\u017Anie poni\u017Cej typowej ceny",
      raisedToTheMinimum: ", podniesiono do min",
      noBuyOrders: "brak zlece\u0144 kupna",
      highestOrderPcs: "najwy\u017Csze zlecenie ({buyGraph} szt.)",
      lowest: "najni\u017Csza",
      suggested: "Proponowana",
      rightAwayToTheBuy2: "od razu do zlecenia kupna, czekanie si\u0119 nie op\u0142aca",
      chanceWithin2: "szansa w {N}: {chance}",
      fastest: "Najszybciej",
      aCentUnderTheCheapest: "grosz pod najta\u0144sz\u0105 ({cheapest})",
      toTheHighestBuyOrder: "do najwy\u017Cszego zlecenia kupna",
      saved2: "Zapisana",
      yourTargetPrice: "Twoja cena docelowa",
      enterThePriceTheBuyer: "Wpisz cen\u0119, jak\u0105 zap\u0142aci kupuj\u0105cy (np. 1,85), albo kliknij jedn\u0105 z opcji.",
      perUnitInTotal: " za sztuk\u0119, razem <b>{recv}</b>",
      youGet3: "Dostaniesz <b>{recv}</b>{qty}",
      resultAgainstTheCost: "Wynik wzgl\u0119dem kosztu",
      perUnit2: " za sztuk\u0119",
      doesntExistOnSteamThe: "{v} nie istnieje na Steamie, oferta stanie jako {listed}",
      chanceToSellWithin: "Szansa sprzeda\u017Cy w {N}",
      fromTheItemsHistory: "(z historii przedmiotu)",
      notAboveTheHighestBuy: "Nie wi\u0119cej ni\u017C najwy\u017Csze zlecenie kupna, sprzeda si\u0119 od razu.",
      cheaperThanNeededToBe: "Taniej, ni\u017C trzeba, \u017Ceby by\u0107 pierwsz\u0105 ofert\u0105 (najta\u0144sza: {cheapest})",
      belowYourMinimum: "Poni\u017Cej Twojego minimum ({min})",
      belowTheLowestPriceOn: "{listed}% poni\u017Cej najni\u017Cszej ceny na rynku!",
      priceTheBuyerPays: "Cena (p\u0142aci kupuj\u0105cy)",
      listOnTheMarket: "Wystaw na rynku",
      invalidPriceNothingListed: "Nieprawid\u0142owa cena, nic nie wystawiono.",
      for: "za {price}",
      atTheSuggestedPrice: "po proponowanej cenie{min}",
      thenTheAutomationWatchesThe: ", potem automat pilnuje ceny",
      ofPcs: " {qty} szt.",
      plannedSaleClickToChange: "Zaplanowana sprzeda\u017C{qty}: {until}, {how}. Kliknij, \u017Ceby zmieni\u0107 albo usun\u0105\u0107.",
      illList: "wystawi\u0119",
      lockedUntilThenFlipsterLists: "Blokada do {until}. Wtedy Flipster sam wystawi przedmiot, je\u015Bli b\u0119dzie otwarta jaka\u015B strona Steama (je\u015Bli nie, przy nast\u0119pnym otwarciu). Ofert\u0119 i tak potwierdzasz w aplikacji Steam.",
      suggestedPriceOfTheUnlock: "Proponowana cena z dnia odblokowania",
      today: "dzi\u015B",
      notBelow: "nie taniej ni\u017C",
      noLimit: "bez granicy",
      fixedPrice: "Sta\u0142a cena",
      theBuyerPays: "(p\u0142aci kupuj\u0105cy)",
      howMany: "Ile sztuk",
      of: "z",
      afterListingLetTheAutomation: "Po wystawieniu niech automat pilnuje tej oferty",
      itUndercutsCheaperOnesBut: "podcina ta\u0144szych, ale nie zejdzie poni\u017Cej Twojego minimum (przy sta\u0142ej cenie: poni\u017Cej niej)",
      theAutomationIsOffNow: ". Automat jest teraz wy\u0142\u0105czony: w\u0142\u0105czysz go w Rynek \u2192 Moje oferty \u2192 \u2699 Automat",
      removeThisPlan: "Usu\u0144 ten plan",
      salePlan: "Plan sprzeda\u017Cy",
      save: "Zapisz",
      plan: "Zaplanuj",
      salePlanRemoved: "Plan sprzeda\u017Cy usuni\u0119ty: {hash}",
      enterAFixedPriceE: "Podaj sta\u0142\u0105 cen\u0119 (np. 1,85), plan nie zosta\u0142 zapisany.",
      theAutomationNeedsALower: "Automat potrzebuje dolnej granicy: wpisz \u201Enie taniej ni\u017C\u201D. Plan nie zosta\u0142 zapisany.",
      notBelow2: ", nie taniej ni\u017C {min}",
      plannedTheSaleOfFor: "Zaplanowano sprzeda\u017C {hash}{qty} na {until}: {mode}{guard}.",
      plannedSaleOf3Days: "Zaplanowana sprzeda\u017C {hash}: 3 dni po ko\u0144cu blokady dalej nie ma sprzedawalnej sztuki, plan usuni\u0119ty.",
      raisedToYourMinimum: " (podniesione do Twojego minimum)",
      plannedSaleOfNoMarket: "Zaplanowana sprzeda\u017C {hash}: brak ceny z rynku, spr\xF3buj\u0119 ponownie.",
      plannedSale: "Zaplanowana sprzeda\u017C",
      confirmInTheSteamApp: ", potwierd\u017A w aplikacji Steam",
      plannedSaleOfListedOf: "Zaplanowana sprzeda\u017C {hash}: wystawiono {ok} z {copies} za {price}{note}{confirm}.",
      theAutomationIsOffTurn: ". Automat jest wy\u0142\u0105czony: w\u0142\u0105cz go w Rynek \u2192 Moje oferty \u2192 \u2699 Automat",
      theAutomationWatchesThePrice: "{hash}: automat pilnuje ceny, nie zejdzie poni\u017Cej {floor}{autoRelist}.",
      carefulBelowTheLowestPrice: "Uwaga: {price}% poni\u017Cej najni\u017Cszej ceny!",
      sellImmediately: "Sprzedaj natychmiast",
      quickSale: "Szybka sprzeda\u017C",
      youGet4: "Otrzymasz",
      selectSellableItems: "Zaznacz sprzedawalne przedmioty.",
      bulkSale: "Masowa sprzeda\u017C",
      suggestedTheHighestPriceThat: "Proponowana, najwy\u017Csza cena, kt\xF3ra powinna zej\u015B\u0107 w ~{maxWaitDays} dni (\u201EWystaw za\u201D na kartach)",
      lowestPriceUndercutNotBelow: "Najni\u017Csza cena \u2212 podci\u0119cie ({undercut}), nie ni\u017Cej ni\u017C zapisane min",
      immediatelyToTheHighestBuy: "Natychmiast, do najwy\u017Cszego zlecenia kupna",
      savedTargetPrices: "Zapisane ceny docelowe",
      entriesInTheNextStep: "{gs} pozycji. W nast\u0119pnym kroku zobaczysz i poprawisz ceny przed wystawieniem.",
      next: "Dalej",
      enterAFixedPrice: "Podaj sta\u0142\u0105 cen\u0119.",
      item: "Przedmiot",
      totalYouGet: "Razem (otrzymasz)",
      anEmptyFieldSkip: "Puste pole = pomi\u0144.",
      confirmThePrices: "Potwierd\u017A ceny",
      carefulLowPrices: "Uwaga, niskie ceny",
      entriesHaveAPriceOver: "{ref} pozycji ma cen\u0119 ponad 25% ni\u017Csz\u0105 od najni\u017Cszej ceny rynkowej. Na pewno?",
      yesList: "Tak, wystaw",
      saleListedErrors: "Sprzeda\u017C: {ok} wystawiono, {failed} b\u0142\u0119d\xF3w.",
      listingsWaitForConfirmationIn: "{confirm} ofert czeka na potwierdzenie, w aplikacji Steam otw\xF3rz Potwierdzenia i kliknij \u201EPotwierd\u017A wszystkie\u201D, \u017Ceby zatwierdzi\u0107 je naraz.",
      takeOffTheMarket: "Zdj\u0105\u0107 z rynku?",
      listings: ", {n} ofert",
      for2: "za",
      theItemReturnsToThe: "Przedmiot wr\xF3ci do ekwipunku.",
      takenOffTheMarket: "Zdj\u0119to z rynku: {name}",
      couldntTakeOffHttp: "Nie uda\u0142o si\u0119 zdj\u0105\u0107 {name} (HTTP {status})",
      lowestPriceOnTheMarket: "najni\u017Csza cena na rynku"
    },
    invhistory: {
      steamTooManyRequests429: "Steam: za du\u017Co zapyta\u0144 (429)",
      steamReturnedNoInventoryHistory: "Steam nie zwr\xF3ci\u0142 historii ekwipunku (zaloguj si\u0119)",
      profileNotRecognised: "nie rozpoznano profilu"
    },
    listings: {
      pcs: "szt.",
      notOnTheMarketYet: "jeszcze nie na rynku",
      youGet: "dostaniesz",
      steamListsThisItemOnly: "Steam wystawi t\u0119 ofert\u0119 dopiero po potwierdzeniu w aplikacji mobilnej, do tego czasu kupuj\u0105cy jej nie widz\u0105",
      waitingForConfirmation: "czeka na potwierdzenie",
      confirmItInTheSteam: "Potwierd\u017A w aplikacji Steam \u2192 Potwierdzenia",
      newPriceSetInFlipster: " (nowa cena ustawiona we Flipsterze)",
      tradeLocked: "z blokad\u0105 handlu",
      thenTheAutomation: " \xB7 potem automat",
      suggested: "proponowana",
      notBelow: "nie taniej ni\u017C {min}",
      noLowerLimit: "bez dolnej granicy",
      whenTheLockEndsFlipster: "Gdy sko\u0144czy si\u0119 blokada, Flipster sam wystawi ten przedmiot (je\u015Bli b\u0119dzie otwarta jaka\u015B strona Steama). Ofert\u0119 potwierdzasz w aplikacji Steam.",
      illListIt: "wystawi\u0119",
      youChangeThePlanOn: "Plan zmienisz na karcie przedmiotu w Ekwipunku",
      changeInInventory: "Zmie\u0144 w Ekwipunku",
      removePlan: "Usu\u0144 plan",
      checkingTheMarket: '<div class="sub" style="margin-top:4px">sprawdzam rynek\u2026</div>',
      cheapest: "najta\u0144sza",
      todayNoMarketData: "dzi\u015B: brak danych z rynku",
      yourPrice: "Twoja cena",
      yourMinimum: "Twoje minimum",
      suggestion: "propozycja",
      today: "dzi\u015B",
      chanceWithin: "szansa w {days}",
      notAboveTheBuyOrder: "nie wy\u017Cej ni\u017C zlecenie kupna ({highestBuy}), sprzeda si\u0119 od razu",
      tooPriceyTodaySmallChance: "dzi\u015B za drogo, ma\u0142e szanse",
      considerALowerPrice: ", rozwa\u017C ni\u017Csz\u0105 cen\u0119",
      willProbablyWaitLongerThan: "raczej poczeka d\u0142u\u017Cej ni\u017C {days}",
      looksGood: "wygl\u0105da dobrze",
      loadsYourListingsAndChecks: "Wczytuje oferty i sprawdza ceny konkurencji",
      refresh: "Od\u015Bwie\u017C",
      whileThePanelIsOpen: "Gdy panel jest otwarty na tej zak\u0142adce, oferty i konkurencja od\u015Bwie\u017Caj\u0105 si\u0119 same. Co ile minut, ustawisz w \u2699 obok.",
      howToCalculateSuggestedPrices: "Jak liczy\u0107 proponowane ceny i konkurencj\u0119, co ile od\u015Bwie\u017Ca\u0107",
      downloadsTheOrderBookAnd: "Pobiera z Rynku Steam ksi\u0119g\u0119 zlece\u0144 i pe\u0142n\u0105 histori\u0119 cen przedmiot\xF3w, kt\xF3re masz wystawione i zapisuje je do pliku, do wsp\xF3lnej analizy, czy i po ile sprzedawa\u0107. Tylko odczyt, niczego nie kupuje ani nie wystawia.",
      dataForAnalysis: "Dane do analizy",
      clickToTurnTheAutomation: "Kliknij, \u017Ceby w\u0142\u0105czy\u0107 albo wy\u0142\u0105czy\u0107 automat. Co kilka minut podcina konkurencj\u0119 ofertom, przy kt\xF3rych w \u2699 zaznaczysz \u201EAutomat pilnuje tej oferty\u201D i najni\u017Csz\u0105 cen\u0119.",
      automationSettingsHowOftenUndercut: "Ustawienia automatu: co ile minut, podci\u0119cie, podnoszenie ceny",
      timeToSell: "Czas na sprzeda\u017C",
      theSuggestedPriceListFor: "proponowana cena (\u201EWystaw za\u201D, \u201EUstaw\u201D) ma si\u0119 sprzeda\u0107 w tym czasie",
      skipListingsBelowTheNormal: "Pomijaj oferty poni\u017Cej normalnej ceny",
      iDontGoDownTo: "nie schodz\u0119 do nich, je\u015Bli i tak szybko si\u0119 sprzedadz\u0105",
      refreshEvery: "Od\u015Bwie\u017Caj co",
      whileThePanelIsOpen2: "gdy panel jest otwarty na tej zak\u0142adce: wczytuj\u0119 Twoje oferty i sprawdzam konkurencj\u0119 (cz\u0119\u015Bciej = wi\u0119cej zapyta\u0144 do Steama)",
      setSuggestedPrices: "Ustaw proponowane ceny",
      remove: "Zdejmij",
      deselect: "odznacz",
      selectAll: "zaznacz wszystkie",
      item: "Przedmiot",
      yourPrice2: "Twoja cena",
      market: "Rynek",
      suggestedPrice: "Proponowana cena",
      salePlanRemoved: "Plan sprzeda\u017Cy usuni\u0119ty: {hash}",
      youListedOnTheMarket: "wystawionych przez Ciebie na rynku",
      sellWithin: "sprzeda\u017C w {d}",
      skippingUnderpriced: " \xB7 pomijam zani\u017Cone",
      refreshEveryMin: "od\u015Bwie\u017Canie co {refreshMin} min",
      automationOn: "Automat w\u0142\u0105czony.",
      automationOff: "Automat wy\u0142\u0105czony.",
      auto: "Automat",
      on: "w\u0142.",
      off: "wy\u0142.",
      automation: "Automat",
      everyMinutes: "Co ile minut",
      howMuchCheaperThanThe: "O tyle taniej od najta\u0144szej innej oferty automat ustawia cen\u0119 (i opcja \u201ENajni\u017Csza \u2212 podci\u0119cie\u201D w oknie Wystaw)",
      undercutByZ: "Podcinaj o (z\u0142)",
      checkNow: "Sprawd\u017A teraz",
      youTurnTheAutomationOn: "Automat w\u0142\u0105czasz i wy\u0142\u0105czasz przyciskiem \u201EAutomat\u201D na pasku. Co kilka minut ustawia ofertom cen\u0119 o podci\u0119cie ni\u017Csz\u0105 od najta\u0144szej konkurencji. Gdy reszta jest dro\u017Csza, podnosi cen\u0119, ale najwy\u017Cej do proponowanej (wy\u017Cej przedmiot raczej si\u0119 nie sprzeda). Obejmuje tylko oferty, przy kt\xF3rych w \u201E\u2699\u201D zaznaczysz \u201EAutomat pilnuje tej oferty\u201D i ustawisz <b>najni\u017Csz\u0105 cen\u0119</b>, poni\u017Cej niej nigdy nie zejdzie. Ka\u017Cd\u0105 zmian\u0119 i tak potwierdzasz w aplikacji Steam.",
      close: "Zamknij",
      automationCheckingNow: "Automat: sprawdzam teraz.",
      youdGetAlmostTheSame: "prawie tyle samo dostaniesz od r\u0119ki (zlecenie kupna {highestBuy})",
      pricedLikeAPlainCopy: "cena jak za zwyk\u0142y egzemplarz, float i naklejki nie s\u0105 wliczone",
      lessThanAnHour: "mniej ni\u017C godzin\u0119",
      aboutH: "ok. {d} godz.",
      aboutDays: "ok. {d} dnia",
      sellRightAwayToThe: "sprzedaj od razu do zlecenia kupna ({price}), czekanie \u015Brednio nie da wi\u0119cej",
      chanceToSellWithinFrom: "szansa sprzeda\u017Cy w {days}: {chance}% (z historii przedmiotu z ostatniego miesi\u0105ca)",
      evenAtALowerPrice: "nawet przy ni\u017Cszej cenie szansa jest poni\u017Cej 50%, rynek s\u0142abo bierze",
      afterAFewDaysThe: "po kilku dniach cena by\u0142a zwykle ni\u017Csza, nie przeci\u0105gaj",
      limitedByYourMaximum: "ograniczone Twoim maksimum",
      aheadOfYou: ", przed Tob\u0105 {ahead}",
      inDaysOnlyOfUnits: "w {days} dni po tej cenie lub dro\u017Cej sprzedano tylko {n} z {total} szt.{ahead}",
      aheadOfYouListingsGo: " (przed Tob\u0105 {ahead}, z ofert schodzi {rate}/dzie\u0144)",
      sellsIn: "sprzeda si\u0119 w {waitDays}{ahead}",
      moreThanTheCheapestListing: "{price} wi\u0119cej ni\u017C najta\u0144sza oferta",
      thePriceIsFallingI: "cena spada, skr\xF3ci\u0142em czas czekania o po\u0142ow\u0119",
      yourMinimumIsAboveThe: "Twoje minimum jest wy\u017Cej ni\u017C rynek, mo\u017Ce si\u0119 d\u0142ugo nie sprzeda\u0107",
      yourMaximum: "Twoje maksimum",
      cheaperThanTheCheapestCompetitor: "o {comp} taniej ni\u017C najta\u0144sza konkurencja",
      steamDoesntAllowACloser: " (bli\u017Cszej ceny Steam nie pozwala ustawi\u0107)",
      theCompetitionIsBelowThe: "konkurencja jest {comp}% poni\u017Cej typowej ceny, mo\u017Cesz poczeka\u0107",
      nobodyElseSellsYourMaximum: "nikt inny nie sprzedaje, Twoje maksimum",
      nobodyElseSellsTheAverage: "nikt inny nie sprzedaje, \u015Brednia z ostatnich 7 dni",
      youHaveAUniqueCopy: "masz unikalny egzemplarz (float/naklejki), najta\u0144sza oferta mo\u017Ce by\u0107 gorsza od Twojej",
      onlyOfCopiesInHave: "Ni\u017Cszy float ma tylko {lower} egzemplarzy w stanie {wear}. Kliknij, \u017Ceby por\xF3wna\u0107 z ofertami na rynku.",
      clickToCompareTheFloat: "Kliknij, \u017Ceby por\xF3wna\u0107 float z ofertami na rynku.",
      tooPricey: "za drogo",
      pricey: "drogo",
      cheapYouCanAskMore: "tanio, mo\u017Cesz wi\u0119cej",
      fine: "w porz\u0105dku",
      nobodyElseSells: "nikt inny nie sprzedaje",
      checking: "sprawdzam\u2026",
      tie: "remis",
      someoneIsCheaper: "kto\u015B taniej o {buyer}",
      selected: "Zaznaczono {sel}:",
      youHaveNothingListedYou: '<tr><td colspan="6" class="empty">Nie masz wystawionych przedmiot\xF3w. Wystawiasz je w zak\u0142adce Ekwipunek.</td></tr>',
      listed: "wystawiono {created}",
      theAutomationShouldWatchThis: "Automat ma pilnowa\u0107 tej oferty, ale bez najni\u017Cszej ceny j\u0105 pominie. Ustaw j\u0105 w \u2699.",
      theAutomationShouldWatchThis2: "Automat ma pilnowa\u0107 tej oferty (nie ni\u017Cej ni\u017C {min}), ale jest wy\u0142\u0105czony: w\u0142\u0105czysz go w \u201E\u2699 Automat\u201D u g\xF3ry.",
      theAutomationWatchesThePrice: "Automat pilnuje ceny, nie zejdzie poni\u017Cej {min}",
      off2: " (wy\u0142.)",
      theChanceThatSomeonePays: "Szansa, \u017Ce kto\u015B zap\u0142aci Twoj\u0105 obecn\u0105 cen\u0119 w ci\u0105gu {days}, z historii tego przedmiotu z ostatniego miesi\u0105ca, godzina po godzinie (tak samo liczona jest proponowana cena obok). D\u0142ugo\u015B\u0107 czekania ustawiasz w \u201Esprzedaj w ci\u0105gu \u2026 dni\u201D.",
      chanceWithin2: "szansa w",
      cheapestOther: "najta\u0144sza inna",
      theCheaperListingsAreBelow: "Ta\u0144sze oferty s\u0105 poni\u017Cej normalnej ceny tego przedmiotu i przy jego tempie sprzeda\u017Cy zejd\u0105 w Twoim czasie na sprzeda\u017C: bardziej op\u0142aca si\u0119 poczeka\u0107, ni\u017C schodzi\u0107 do nich.",
      skippingUnderpricedCheapest: "pomijam zani\u017Cone, najta\u0144sza",
      last30Days: "\nostatnie 30 dni: {d30}",
      theAveragePriceThisItem: "\u015Arednia cena, za jak\u0105 ten przedmiot faktycznie si\u0119 sprzeda\u0142:\nostatnie 7 dni: {d7} ({sold7} szt.){d30}",
      sellsAt: "sprzedaje si\u0119 po",
      market2: "rynek",
      waitingForMarketData: '<span class="sub">czekam na dane rynku\u2026</span>',
      removesTheListingAndLists: "Zdejmie ofert\u0119 i wystawi j\u0105 za {price} (z potwierdzeniem)",
      set: "Ustaw",
      priceOk: "cena OK",
      removeFromTheMarketIt: "Zdejmij z rynku, wr\xF3ci do ekwipunku",
      yourOwnPriceMinimumMaximum: "W\u0142asna cena, cena minimalna/maksymalna i automat",
      changeThePriceNow: "Zmie\u0144 cen\u0119 teraz",
      price: "Cena",
      eG150: "np. 150",
      listAtThisPrice: "Wystaw za t\u0119 cen\u0119",
      oneOffIRemoveThe: "jednorazowo: zdejm\u0119 ofert\u0119 i wystawi\u0119 j\u0105 za t\u0119 cen\u0119, potwierdzasz w aplikacji Steam",
      priceLimits: "Granice ceny",
      priceFrom: "Cena od",
      theLowestPriceTheSuggested: "Najni\u017Csza cena: proponowana cena i automat nigdy nie zejd\u0105 ni\u017Cej",
      none: "brak",
      to: "do",
      theHighestPriceTheAutomation: "Najwy\u017Csza cena: automat nie podniesie wy\u017Cej, proponowana cena te\u017C nie b\u0119dzie wy\u017Csza",
      theSuggestedPriceAndThe: "proponowana cena i automat zostaj\u0105 w tych granicach, puste pole = bez granicy",
      automationWatchesThisListing: "Automat pilnuje tej oferty",
      everyFewMinutesItUndercuts: "co kilka minut podcina ta\u0144szych, nie zejdzie poni\u017Cej minimum",
      theAutomationIsOffNow: "Automat jest teraz wy\u0142\u0105czony: w\u0142\u0105czysz go w \u201E\u2699 Automat\u201D u g\xF3ry",
      enterTheLowestPricePrice: "wpisz najni\u017Csz\u0105 cen\u0119 (\u201ECena od\u201D), bez niej automat pominie t\u0119 ofert\u0119",
      plannedListedWhenTheTrade: "Zaplanowane (wystawi\u0105 si\u0119 po ko\u0144cu blokady handlu)",
      thatsLessThanNow: "To {price}% mniej ni\u017C teraz.",
      changeThePrice: "Zmieni\u0107 cen\u0119?",
      theListingIsRemovedAnd: "Oferta zostanie zdj\u0119ta i wystawiona ponownie, potwierdzisz j\u0105 w aplikacji Steam.",
      changePrice: "Zmie\u0144 cen\u0119",
      confirmInTheSteamApp: ", potwierd\u017A w aplikacji Steam",
      newPrice: "{name}: nowa cena {price}{confirm}",
      couldntChangeThePrice: "{name}: nie uda\u0142o si\u0119 zmieni\u0107 ceny",
      priceChangeStoppedCheckThe: "Zmiana ceny przerwana: {message}, sprawd\u017A ekwipunek.",
      removeFromTheMarket: "Zdj\u0105\u0107 z rynku?",
      for: "za",
      theItemGoesBackTo: "Przedmiot wr\xF3ci do ekwipunku.",
      removed: "zdj\u0119to",
      httpError: "b\u0142\u0105d HTTP {status}",
      theSelectedListingsAlreadyHave: "Zaznaczone oferty maj\u0105 ju\u017C proponowan\u0105 cen\u0119 (albo brak danych rynku).",
      changeThePrices: "Zmieni\u0107 ceny?",
      andMore: "i {jobs} wi\u0119cej",
      change: "Zmie\u0144 {jobs}",
      priceChangeOkErrors: "Zmiana cen: {ok} OK, {failed} b\u0142\u0119d\xF3w.",
      listingsWaitForConfirmationIn: "{confirm} ofert czeka na potwierdzenie, w aplikacji Steam otw\xF3rz Potwierdzenia i kliknij \u201EPotwierd\u017A wszystkie\u201D, \u017Ceby zatwierdzi\u0107 je naraz.",
      noLoggedInSteamSession: "Nie wykryto zalogowanej sesji Steam.",
      inTheSteamAppOpen: "W aplikacji Steam otw\xF3rz Potwierdzenia i kliknij \u201EPotwierd\u017A wszystkie\u201D",
      listingsWaitForConfirmationIn2: "ofert czeka na potwierdzenie w aplikacji, zatwierd\u017A wszystkie naraz",
      loadedSellListings: "Wczytano {rows} ofert sprzeda\u017Cy.",
      errorLoadingListings: "B\u0142\u0105d \u0142adowania ofert: ",
      refreshing: '<span class="acc">od\u015Bwie\u017Cam\u2026</span>',
      refreshedNextIn: "od\u015Bwie\u017Cono {last} \xB7 nast\u0119pne za {left}:{left2}",
      listingUndercut: "oferta przebita",
      listingsUndercut: "ofert przebitych",
      tied: "remis",
      atTheCurrentPriceThe: "Po obecnej cenie szansa sprzeda\u017Cy poni\u017Cej 25%, zobacz proponowan\u0105 cen\u0119",
      tooPriceyByTheHistory: "za drogo wg historii",
      theyWillSellAlmostSurely: "Sprzedadz\u0105 si\u0119 prawie na pewno, a proponowana cena jest wy\u017Csza",
      tooCheap: "za tanio",
      allYourListingsAreThe: "wszystkie Twoje oferty s\u0105 najta\u0144sze",
      undercutListings: "Przebite oferty",
      someoneUndercutYouYours: "Kto\u015B przebi\u0142: {hash}, {comp} (Twoja {buyer})",
      selectSomeListings: "Zaznacz oferty.",
      removeTheListings: "Zdj\u0105\u0107 oferty?",
      removeListingsFromTheMarket: "Zdj\u0105\u0107 {sel} ofert z rynku? Przedmioty wr\xF3c\u0105 do ekwipunku.",
      noListingsWithAutoMin: "brak ofert z regu\u0142\u0105 auto + min",
      raisingToTheSuggestedPrice: "podnosz\u0119 do proponowanej ceny, wy\u017Cej raczej si\u0119 nie sprzeda",
      itWouldHardlySellHigher: "wy\u017Cej raczej si\u0119 nie sprzeda",
      errors: ", b\u0142\u0119dy: {failed}",
      changed: "zmieniono {ok}/{jobs}{failed}",
      autoRelistOkErrors: "[auto] relist: {ok} OK, {failed} b\u0142\u0119d\xF3w.",
      checkedNoChanges: "sprawdzono {ruled}, bez zmian",
      off3: "wy\u0142\u0105czony",
      runsInAnotherTab: "dzia\u0142a w innej karcie",
      working: "pracuje\u2026",
      nextInMin: "nast\u0119pne za {min} min",
      last: "ostatnio",
      cheaperListings: {
        one: "1 ta\u0144sza oferta",
        few: "{count} ta\u0144sze oferty",
        many: "{count} ta\u0144szych ofert",
        other: "{count} oferty"
      }
    },
    markettrend: {
      skinMarket: "rynek skin\xF3w",
      caseMarket: "rynek skrzy\u0144",
      stickerMarket: "rynek naklejek",
      market: "rynek"
    },
    patterndb: {
      gmXmlhttprequestUnavailable: "GM_xmlhttpRequest niedost\u0119pne",
      badResponse: "z\u0142a odpowied\u017A",
      networkError: "b\u0142\u0105d sieci"
    },
    patternmark: {
      knownPatternSeedSourceThe: "Znany wz\xF3r, seed {seed}: {what}{label}. \u0179r\xF3d\u0142o: {src}.\nListy w serwisach nie zawsze si\u0119 zgadzaj\u0105: przed wycen\u0105 obejrzyj ten egzemplarz w grze albo w podgl\u0105dzie (inspect)."
    },
    "relist-engine": {
      inventorySnapshot: "Snapshot ekwipunku {appid}/{contextid}\u2026",
      removing: "zdejmowanie\u2026",
      removedWaitingForTheInventory: "zdj\u0119to, czekam na ekwipunek\u2026",
      removingFailedHttp: "b\u0142\u0105d zdejmowania (HTTP {status})",
      couldntRemoveHttp: "Nie uda\u0142o si\u0119 zdj\u0105\u0107 {hash} (HTTP {status})",
      waitingForItemsToCome: "Czekam na powr\xF3t {pending} przedmiot\xF3w do ekwipunku\u2026",
      notFoundInTheInventory: "nie znaleziono w ekwipunku, wystaw r\u0119cznie",
      removedButNotFoundIn: "{hash}: zdj\u0119ty, ale nie znaleziony w ekwipunku, wystaw r\u0119cznie!",
      listing: "wystawianie\u2026",
      confirmInTheApp: ", potwierd\u017A w aplikacji",
      listedFor: "wystawiono za {shown}{confirm}",
      toConfirm: " (do potwierdzenia)",
      listingFailedTheItemIs: "b\u0142\u0105d wystawiania: {msg} (przedmiot w ekwipunku)",
      listingFailedTheItemIs2: "{hash}: b\u0142\u0105d wystawiania, {msg}. Przedmiot jest w ekwipunku.",
      listedFor2: "wystawiono za {shown}",
      confirmInTheSteamApp: " (potwierd\u017A w aplikacji Steam)",
      listedYouGetTheBuyer: "Wystawiono {hash}: dostaniesz {price}, kupuj\u0105cy zap\u0142aci ok. {shown}{confirm}"
    },
    research: {
      dataForAnalysisThePrevious: "Dane do analizy: poprzednie pobieranie jeszcze trwa.",
      dataForAnalysisThereAre: "Dane do analizy: nie ma tu \u017Cadnych przedmiot\xF3w.",
      collectDataForAnalysis: "Zebra\u0107 dane do analizy?",
      illDownloadTheOrderBook: 'Pobior\u0119 z Rynku Steam ksi\u0119g\u0119 zlece\u0144 i pe\u0142n\u0105 histori\u0119 cen dla <b>{items}</b> przedmiot\xF3w {where} (ok. {min} min) i zapisz\u0119 je do pliku <b>flipster-dane-do-analizy.json</b> w folderze pobierania przegl\u0105darki.<br><span class="sub">Tylko odczyt, niczego nie kupuj\u0119 ani nie wystawiam. W pliku s\u0105 wy\u0142\u0105cznie publiczne dane rynku i ustawienia prowizji, bez Twojego konta.</span>',
      collectData: "Zbierz dane",
      dataForAnalysisDownloadingItems: "Dane do analizy: pobieram {items} przedmiot\xF3w\u2026",
      dataForAnalysisSteamIs: "Dane do analizy: Steam ogranicza zapytania, zapisuj\u0119 to, co ju\u017C mam.",
      dataForAnalysisNothingWas: "Dane do analizy: nic nie pobrano.",
      withoutPriceHistory: " ({failed} bez historii cen)",
      dataForAnalysisSavedItems: "Dane do analizy: zapisano {items} przedmiot\xF3w do pliku flipster-dane-do-analizy.json{failed}. Daj zna\u0107, \u017Ce plik jest gotowy.",
      marketSampleSteamIsLimiting: "Pr\xF3bka rynku: Steam ogranicza zapytania ({what}), czekam 2 min i jad\u0119 dalej\u2026",
      marketSampleForAnalysis: "Pr\xF3bka rynku do analizy",
      firstIllGoThroughA: 'Najpierw przejrz\u0119 list\u0119 ok. 3000 najpopularniejszych przedmiot\xF3w CS2 na Rynku Steam (same nazwy i ceny, kilka minut: Steam podaje je po 10). Z niej wylosuj\u0119 tyle przedmiot\xF3w, ile wybierzesz poni\u017Cej, po r\xF3wno z ka\u017Cdego rodzaju ({KINDS}) i przedzia\u0142u cen, i tylko dla nich pobior\u0119 pe\u0142n\u0105 histori\u0119 cen i ksi\u0119g\u0119 zlece\u0144. Zapisz\u0119 to do pliku <b>flipster-probka-rynku.json</b>, do sprawdzania algorytm\xF3w Flipstera na czym\u015B wi\u0119cej ni\u017C Twoje przedmioty.<br><br>\n    Ile przedmiot\xF3w: <select id="ms-n"><option value="200">200 (ok. 5-8 min)</option><option value="400" selected>400 (ok. 10-15 min)</option><option value="800">800 (ok. 20-30 min)</option></select><br>\n    <span class="sub">Tylko odczyt, niczego nie kupuj\u0119 ani nie wystawiam. Przy limitach Steama czekam i jad\u0119 dalej; Stop zapisuje to, co ju\u017C jest. Inne funkcje Flipstera mog\u0105 w tym czasie dzia\u0142a\u0107 wolniej.</span>',
      downloadSample: "Pobierz pr\xF3bk\u0119",
      steamTooManyRequests429: "Steam: za du\u017Co zapyta\u0144 (429)",
      marketSamplePopularList: "Pr\xF3bka rynku: lista popularnych {pool}\u2026",
      marketSampleStoppedBeforeDownloading: "Pr\xF3bka rynku: przerwano przed pobieraniem historii.",
      marketSampleDrewOfPopular: "Pr\xF3bka rynku: z {pool} popularnych wylosowa\u0142em {pick} ({byKind}). Pobieram historie cen\u2026",
      orderBooks: "ksi\u0119gi zlece\u0144",
      priceHistories: "historie cen",
      marketSampleSteamKeepsLimiting: "Pr\xF3bka rynku: Steam dalej ogranicza zapytania, zapisuj\u0119 to, co ju\u017C mam.",
      marketSample: "Pr\xF3bka rynku: {i}/{pick}\u2026",
      marketSampleNothingWasDownloaded: "Pr\xF3bka rynku: nic nie pobrano.",
      marketSampleSavedItemsTo: "Pr\xF3bka rynku: zapisano {items} przedmiot\xF3w do pliku flipster-probka-rynku.json. Daj zna\u0107, \u017Ce plik jest gotowy."
    },
    sellsignals: {
      hold: "trzymaj",
      theFeeEatsOfThe: "Prowizja zjada {net}% ceny: kupuj\u0105cy p\u0142aci {lowest}, Ty dostajesz {net2}. Lepiej zostawi\u0107 albo u\u017Cy\u0107 w kontrakcie.",
      inProfit: "z zyskiem +{net}%",
      youBoughtItForToday: "Kupi\u0142e\u015B za {cost}, dzi\u015B dostaniesz na r\u0119k\u0119 {net}.",
      priceyNow: "drogo teraz",
      overTheLast2Days: "Przez ostatnie 2 dni sprzedaje si\u0119 \u015Brednio po {recent} ({recentVol} szt.), o {recent2}% dro\u017Cej ni\u017C wcze\u015Bniej w tym miesi\u0105cu ({base}). Najta\u0144sza oferta: {lowest}. Dobry moment, zanim cena wr\xF3ci do normy.",
      priceFalling: "cena spada",
      lastWeeksAverageIsLower: "\u015Arednia z ostatniego tygodnia ({a7}) jest o {a72}% ni\u017Csza ni\u017C z 3 tygodni wcze\u015Bniej ({prev}).",
      in: "w",
      thisOnlyTellsWhatAlready: "To tylko informacja o tym, co ju\u017C si\u0119 sta\u0142o: na 650 przedmiotach z rynku takie ruchy nie zapowiada\u0142y ani ci\u0105gu dalszego, ani odwrotu.",
      halfAYear: "p\xF3\u0142 roku",
      "3Months": "3 mies.",
      monthlyMedianSalePriceHalf: "Mediana sprzeda\u017Cy z miesi\u0105ca: p\xF3\u0142 roku temu {m6}, 3 miesi\u0105ce temu {m3}, teraz {now} ({t} w {span}).",
      theWholeMarket: "Ca\u0142y rynek",
      ofCs2OverThatTime: "{who} CS2 w tym czasie: {m} (mediana z {n} popularnych przedmiot\xF3w, sprawdzone {at})."
    },
    settings: {
      sources: "\u0179r\xF3d\u0142a",
      pricesOrders: "ceny/zlecenia",
      volume: "wolumen",
      inventory: "ekwipunek",
      listingsHistory: "oferty/historia",
      pages: "strony",
      quickPrices: "szybkie ceny",
      quickPriceCheck: "Szybkie sprawdzanie cen przedmiot\xF3w Steam",
      search: "wyszukiwarka",
      every: "co",
      general: "Og\xF3lne",
      language: "J\u0119zyk",
      automaticFollowsYourBrowserPolish: "Automatycznie znaczy jak w przegl\u0105darce: polski dla polskiej przegl\u0105darki, w innym wypadku angielski. Po zmianie strona si\u0119 prze\u0142aduje.",
      automatic: "Automatycznie",
      inventory2: "Ekwipunek",
      pricesAndFloatOnThe: "Ceny i float na stronie ekwipunku Steam",
      onTheRegularInventoryPage: "Na zwyk\u0142ej stronie ekwipunku, poza oknem Flipstera, ka\u017Cdy przedmiot pokazuje swoj\u0105 cen\u0119 na rynku i float.",
      sellBadgeThreshold: "Pr\xF3g znaczk\xF3w sprzeda\u017Cy",
      howBigAPriceChange: "Od jakiej zmiany ceny przedmioty w zak\u0142adce Ekwipunek dostaj\u0105 znaczki \u201Ez zyskiem\u201D, \u201Edrogo teraz\u201D i \u201Ecena spada\u201D. Wy\u017Cszy pr\xF3g to mniej znaczk\xF3w.",
      rarePatterns: "Rzadkie wzory",
      itemsWithARareSought: "Przedmioty z rzadkim, cenionym wzorem (seedem) dostaj\u0105 ramk\u0119 i znaczek \u{1F48E} w Ekwipunku, w Rynku i przy sprawdzaniu floatu. Strony o wzorach nie zawsze si\u0119 zgadzaj\u0105, wi\u0119c \u{1F48E} znaczy \u201Eobejrzyj dok\u0142adniej\u201D.",
      communityDatabaseCs2pattern: 'Baza spo\u0142eczno\u015Bci <a class="acc" href="https://github.com/Helyux/cs2pattern" target="_blank" rel="noopener">cs2pattern</a>',
      flipsterAlsoKnowsAFew: 'Do tego Flipster zna <span class="hint" title="{famous}">kilka s\u0142ynnych wzor\xF3w</span> sprawdzonych r\u0119cznie.',
      refresh: "od\u015Bwie\u017C",
      yourOwnPatterns: "W\u0142asne wzory",
      oneSkinPerLineE: "Jeden skin w linii, np.",
      writeASeedRangeLike: "Zakres seed\xF3w wpisz jak 100-110, a opis po znaku = mo\u017Cesz pomin\u0105\u0107.",
      toCheck: "do sprawdzenia",
      requestsToSteam: "Zapytania do Steama",
      howManyRequestsFlipsterSent: "Ile zapyta\u0144 Flipster wys\u0142a\u0142 (wszystkie otwarte karty razem) i ile razy Steam odpowiedzia\u0142 \u201Eza du\u017Co zapyta\u0144\u201D (429). Tylko pomiar, nic nie zmienia.",
      backup: "Kopia zapasowa",
      backupFile: "Kopia w pliku",
      settingsMinMaxPricesWatched: "Ustawienia, ceny min/max, obserwowane i przypi\u0119te \u{1F4CC} przedmioty, zapisane wymiany, kwoty z terminali i Twoje wzory. Przyda si\u0119 przy zmianie komputera albo przegl\u0105darki.",
      save: "Zapisz",
      load: "Wczytaj",
      advanced: "Zaawansowane",
      logAtTheBottomOf: "Dziennik na dole okna",
      messagesAboutWhatFlipsterIs: "Komunikaty o tym, co Flipster robi. Gdy jest wy\u0142\u0105czony, b\u0142\u0119dy poka\u017C\u0105 si\u0119 na chwil\u0119 w pasku pod oknem.",
      debugMode: "Tryb debugowania",
      buttonsForCollectingDataFor: "Przyciski do zbierania danych do analizy, licznik zapyta\u0144 do Steama i numer wersji w nag\u0142\xF3wku.",
      pauseBetweenListings: "Przerwa mi\u0119dzy kolejnymi ofertami",
      whenYouListOrRemove: "Przy wystawianiu lub zdejmowaniu kilku ofert naraz. Kr\xF3tsza jest szybsza, ale Steam mo\u017Ce zacz\u0105\u0107 odrzuca\u0107 zapytania.",
      rememberMarketPrices: "Pami\u0119taj ceny z rynku",
      forThisManyMinutesFlipster: "Przez tyle minut Flipster nie pyta Steama drugi raz o ten sam przedmiot. Twoje oferty, ekwipunek i saldo s\u0105 zawsze \u015Bwie\u017Ce. 0 wy\u0142\u0105cza.",
      steamRequestPace: "Tempo zapyta\u0144 do Steama",
      flipsterSlowsDownByItself: "Flipster sam zwalnia, gdy Steam odrzuca zapytania. Kliknij, je\u015Bli od dawna wszystko dzia\u0142a bardzo wolno.",
      now: "Teraz",
      startOver: "zacznij od nowa",
      rememberedPrices: "Zapami\u0119tane ceny",
      removesSavedPricesAndMarket: "Usuwa zapisane ceny i dane rynku, gdy co\u015B wygl\u0105da na nieaktualne.",
      clear: "wyczy\u015B\u0107",
      defaultSettings: "Ustawienia domy\u015Blne",
      restoresTheSettingsInThis: "Przywraca ustawienia z tej zak\u0142adki. Ceny min/max, obserwowane i historia zostaj\u0105.",
      restore: "przywr\xF3\u0107",
      accountAndFee: "Konto i prowizja",
      notLoggedIn: "niezalogowane",
      accountOnASaleSteam: 'Konto {steamId}. Przy sprzeda\u017Cy Steam bierze {feePercent}% (najmniej {feeMin}{feeBase}), a gra {pubDefault}%, wi\u0119c \u017Ceby\u015B dosta\u0142 {steam}, kupuj\u0105cy p\u0142aci {steam2}. Automaty dzia\u0142aj\u0105 tylko w jednej otwartej karcie Steam naraz.<span class="dbg"> Waluta ID {currency}.</span>',
      saved: "Zapisano: {k}",
      yourListHasSkinS: "Twoja lista: {entries} skin(y), {n} seed\xF3w.",
      yourListIsEmpty: "Twoja lista jest pusta.",
      cantReadLineSThe: "Nie rozumiem linii: {errors} (wz\xF3r: nazwa: 1, 2, 10-20 = opis)",
      seedsForSkinsDownloadedRefreshes: "{seeds} seed\xF3w dla {skins} skin\xF3w, pobrana {at}, od\u015Bwie\u017Ca si\u0119 sama co tydzie\u0144.",
      couldntDownloadIt: "Nie uda\u0142o si\u0119 jej pobra\u0107",
      downloading: "pobieram\u2026",
      savedThePatternList: "Zapisano list\u0119 wzor\xF3w.",
      backupLoadedReloadThePage: "Zaimportowano kopi\u0119. Od\u015Bwie\u017C stron\u0119.",
      loadingTheBackupFailed: "Import nieudany: ",
      downloadedTheRarePatternDatabase: "Pobrano baz\u0119 rzadkich wzor\xF3w.",
      couldntDownloadThePatternDatabase: "Bazy wzor\xF3w nie uda\u0142o si\u0119 pobra\u0107",
      requestPaceResetTheScript: "Zresetowano tempo zapyta\u0144, skrypt nauczy si\u0119 go od nowa.",
      clearedRememberedPricesAndMarket: "Wyczyszczono zapami\u0119tane ceny i dane rynku. Od\u015Bwie\u017C stron\u0119.",
      resetSettings: "Reset ustawie\u0144",
      restoreTheDefaultSettingsPrice: "Przywr\xF3ci\u0107 domy\u015Blne ustawienia? Regu\u0142y cen, obserwowane i historia zostan\u0105.",
      restore2: "Przywr\xF3\u0107",
      defaultsRestoredReloadThePage: "Przywr\xF3cono domy\u015Blne. Od\u015Bwie\u017C stron\u0119.",
      orderBooksPricesCompetition: "ksi\u0119gi zlece\u0144 (ceny, konkurencja, \u{1F4CC})",
      yourListingsHistoryPriceHistories: "Twoje oferty, historia, historie cen",
      "24HVolume": "obr\xF3t z 24 h",
      itemPages: "strony przedmiot\xF3w",
      marketSearchScannerCases: "wyszukiwarka rynku (skaner, skrzynie)",
      listingRemovingOrders: "wystawianie, zdejmowanie, zlecenia",
      nothingCountedYet: "Jeszcze nic nie policzone.",
      kind: "Rodzaj",
      since: "od",
      last24H: "ostatnie 24 h",
      total: "razem",
      mostFrequentUrls: "Najcz\u0119stsze adresy"
    },
    storehist: {
      gmXmlhttprequestUnavailable: "GM_xmlhttpRequest niedost\u0119pne",
      networkError: "B\u0142\u0105d sieci",
      iCantSeeThePurchase: "Nie widz\u0119 historii zakup\xF3w, zaloguj si\u0119 na store.steampowered.com w tej przegl\u0105darce",
      steamPurchaseHistoryEntriesCs2: "Historia zakup\xF3w Steam: {rows} pozycji ({isCS} zakup\xF3w w CS2).",
      steamPurchaseHistory: "Historia zakup\xF3w Steam: "
    },
    trade: {
      tradeAnalysisLoadingInventories: '<b style="color:#fff">Analiza wymiany</b><div id="stt-tr-body" style="margin-top:6px">\u0141adowanie ekwipunk\xF3w\u2026</div>',
      yourInventory: "Ekwipunek Tw\xF3j",
      partnersInventory: "Ekwipunek partnera",
      unknownItem: "nieznany przedmiot",
      more: "wi\u0119cej",
      youGive: "DAJESZ",
      youGet: "DOSTAJESZ",
      balanceSteam: "Bilans (Steam)",
      youGiveMoreThanYou: '<div style="margin-top:6px;padding:6px;background:#5a1d1d;border-radius:4px;color:#fff">\u26A0 Dajesz wi\u0119cej, ni\u017C dostajesz!</div>',
      itemsNotRecognisedPrivateInventory: "przedmiot\xF3w nierozpoznanych (prywatny ekwipunek / inna gra)",
      loadingPrices: "pobieram ceny ({loading})\u2026",
      withoutASteamPrice: "{noPrice} bez ceny Steam",
      pricesAreTheLowestSteam: "Ceny: najni\u017Csza oferta Steam. Naklejki i float nie s\u0105 wliczone, sprawd\u017A je r\u0119cznie."
    },
    main: {
      market: "Rynek",
      myListings: "Moje oferty",
      buyOrders: "Zlecenia kupna",
      inventory: "Ekwipunek",
      history: "Historia",
      deals: "Okazje",
      worthOpening: "Czy warto otwiera\u0107?",
      settings: "Ustawienia",
      youDontSeemToBe: "Nie wykryto zalogowania, wi\u0119kszo\u015B\u0107 funkcji wymaga zalogowania na steamcommunity.com."
    }
  };

  // src/core/i18n.js
  var TEXTS = { en: en_GB_default, pl: pl_PL_default };
  var LOCALES = { en: "en-GB", pl: "pl-PL" };
  function detect() {
    const s = get("settings", null)?.lang;
    if (s === "en" || s === "pl") return s;
    try {
      return /^pl\b/i.test(navigator.language || "") ? "pl" : "en";
    } catch {
      return "en";
    }
  }
  var lang = null;
  var plural = null;
  var getLang = () => lang || (lang = detect());
  var locale = () => LOCALES[getLang()];
  var find = (texts, key) => {
    const dot = key.indexOf(".");
    return texts[key.slice(0, dot)]?.[key.slice(dot + 1)];
  };
  var L = (key, params) => {
    let s = find(TEXTS[getLang()], key) ?? find(en_GB_default, key) ?? key;
    if (typeof s === "object") s = s[(plural ||= new Intl.PluralRules(locale())).select(params?.count ?? 0)] ?? s.other;
    return params ? s.replace(/\{(\w+)\}/g, (m, name) => name in params ? params[name] : m) : s;
  };
  var dec = (x, digits) => getLang() === "pl" ? x.toFixed(digits).replace(".", ",") : x.toFixed(digits);

  // src/core/util.js
  var sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  var displayName = (hash, name) => !hash || /^\d+-/.test(hash) ? name || hash || "" : hash;
  var esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  function parsePrice(s) {
    if (s == null) return NaN;
    if (typeof s === "number") return Math.round(s * 100);
    s = String(s).replace(/[^\d.,]/g, "");
    if (!/\d/.test(s)) return NaN;
    const di = Math.max(s.lastIndexOf(","), s.lastIndexOf("."));
    let intPart = s;
    let dec2 = "";
    if (di >= 0 && s.length - di - 1 <= 2) {
      intPart = s.slice(0, di);
      dec2 = s.slice(di + 1);
    }
    intPart = intPart.replace(/[.,]/g, "");
    dec2 = (dec2 + "00").slice(0, 2);
    return parseInt(intPart || "0", 10) * 100 + parseInt(dec2, 10);
  }
  var toInput = (c) => c == null || isNaN(c) ? "" : (c / 100).toFixed(2).replace(".", ",");
  var pct = (x, digits = 1) => x == null || !isFinite(x) ? "-" : (x * 100).toFixed(digits).replace(".", ",") + "%";
  var fmtWhen = (t, none = L("util.onceUnlocked")) => t ? new Date(t).toLocaleString([], { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) : none;
  var shareTxt = (x) => x < 1e-3 ? "<0,1%" : x < 0.01 ? `${(x * 100).toFixed(1).replace(".", ",")}%` : `${Math.round(x * 100)}%`;
  var daysTxt = (n) => n === 1 ? L("util.1Day") : L("util.days", { n });
  var WEAR_SHORT = { "Factory New": "FN", "Minimal Wear": "MW", "Field-Tested": "FT", "Well-Worn": "WW", "Battle-Scarred": "BS" };
  var wearOf = (hash) => String(hash || "").match(/\((Factory New|Minimal Wear|Field-Tested|Well-Worn|Battle-Scarred)\)\s*$/)?.[1] || null;
  var wearShort = (hash) => WEAR_SHORT[wearOf(hash)] || "";
  var icon = (hash, size = "96fx96f") => hash ? `https://community.cloudflare.steamstatic.com/economy/image/${hash}/${size}` : "";
  function timeAgo(ts) {
    if (!ts) return "-";
    const s = Math.round((Date.now() - ts) / 1e3);
    const ago = L("util.ago");
    if (s < 60) return `${s}s ${ago}`;
    if (s < 3600) return `${Math.round(s / 60)} min ${ago}`;
    if (s < 86400) return `${Math.round(s / 3600)} h ${ago}`;
    return `${Math.round(s / 86400)} d ${ago}`;
  }
  function downloadText(filename, text, mime = "text/plain;charset=utf-8") {
    const blob = new Blob(["\uFEFF" + text], { type: mime });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 1e3);
  }
  function emitter() {
    const m = /* @__PURE__ */ new Map();
    return {
      on(ev, fn) {
        (m.get(ev) || m.set(ev, /* @__PURE__ */ new Set()).get(ev)).add(fn);
        return () => m.get(ev).delete(fn);
      },
      emit(ev, ...a) {
        m.get(ev)?.forEach((fn) => {
          try {
            fn(...a);
          } catch (e) {
            console.error(e);
          }
        });
      }
    };
  }
  var MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  function lockUntil(lock = "", now = Date.now()) {
    const s = String(lock);
    const m = s.match(/after\s+([A-Za-z]{3})[a-z]*\s+(\d{1,2}),?\s+(\d{4})(?:\s*\((\d{1,2}):(\d{2})(?::(\d{2}))?\))?/i);
    if (m) {
      const mon2 = MONTHS.indexOf(m[1].toLowerCase());
      return mon2 < 0 ? null : Date.UTC(+m[3], mon2, +m[2], +(m[4] || 0), +(m[5] || 0), +(m[6] || 0));
    }
    const n = s.match(/(?:after|until)\s+(?:(\d{1,2})\s+([A-Za-z]{3})[a-z]*|([A-Za-z]{3})[a-z]*\s+(\d{1,2}))(?:\s*@\s*(\d{1,2})(?::(\d{2}))?\s*([ap]m)?)?/i);
    if (!n) return null;
    const mon = MONTHS.indexOf((n[2] || n[3]).toLowerCase());
    if (mon < 0) return null;
    let h = +(n[5] || 0);
    if (n[7]) h = h % 12 + (/pm/i.test(n[7]) ? 12 : 0);
    const at = (y2) => new Date(y2, mon, +(n[1] || n[4]), h, +(n[6] || 0)).getTime();
    const y = new Date(now).getFullYear();
    return at(y) < now - 60 * 864e5 ? at(y + 1) : at(y);
  }
  var normSearch = (s = "") => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ł/g, "l").replace(/[|™★()[\]„”"'.,:;!?_]/g, " ").replace(/-/g, " ").replace(/\s+/g, " ").trim();
  function matchSearch(text, query) {
    const q = normSearch(query);
    if (!q) return true;
    const t = normSearch(text);
    const tight = t.replace(/ /g, "");
    return q.split(" ").every((w) => t.includes(w) || tight.includes(w));
  }

  // src/core/tips.js
  var ROWS = [
    // ---- Deals: item analysis
    [
      "Volume",
      "Wolumen",
      "How many units sold in the last day (and in the last week). The more, the easier it is to buy and sell.",
      "Ile sztuk sprzeda\u0142o si\u0119 w ostatniej dobie (i w tygodniu). Im wi\u0119cej, tym \u0142atwiej kupi\u0107 i sprzeda\u0107."
    ],
    [
      "Median 7d \xB7 avg 30d",
      "Mediana 7d \xB7 \u015Br. 30d",
      "What the item usually sold for. The first number is the middle price of the last week, the second is the average of the last month.",
      "Za ile przedmiot zwykle si\u0119 sprzedawa\u0142. Pierwsza liczba to \u015Brodkowa cena z ostatniego tygodnia, druga to \u015Brednia z miesi\u0105ca."
    ],
    [
      "Break-even",
      "Pr\xF3g rentowno\u015Bci",
      "The lowest price you can list at and still come out even after Steam's fee, at this buy price.",
      "Za ile najmniej musisz wystawi\u0107, \u017Ceby po prowizji Steama wyj\u015B\u0107 na zero przy tej cenie zakupu."
    ],
    // ---- Deals: scanner fields
    ["Category", "Kategoria", "What kind of items the scanner goes through.", "Jakiego rodzaju przedmioty skaner ma przegl\u0105da\u0107."],
    [
      "Search",
      "Szukaj",
      'Only items with this text in their name (names are in English, e.g. "Case").',
      "Tylko przedmioty z tym tekstem w nazwie (nazwy s\u0105 po angielsku, np. \u201ECase\u201D)."
    ],
    [
      "Price from",
      "Cena od",
      "The lowest item price to check. Below about 1 z\u0142 the Steam fee eats almost all of the profit.",
      "Najni\u017Csza cena przedmiotu do sprawdzenia. Poni\u017Cej ok. 1 z\u0142 prowizja Steama zjada prawie ca\u0142y zysk."
    ],
    [
      "to",
      "do",
      "The highest price of one unit. By default it's what you have available in your Steam wallet, and if you type your own amount, it stays.",
      "Najwy\u017Csza cena jednej sztuki. Domy\u015Blnie tyle, ile masz dost\u0119pne w portfelu Steam, a je\u015Bli wpiszesz w\u0142asn\u0105 kwot\u0119, zostanie."
    ],
    [
      "Min. listings",
      "Min. ofert na rynku",
      "Skips items that few people list, because their prices jump around and they are hard to sell later.",
      "Pomija przedmioty, kt\xF3re ma\u0142o kto wystawia, bo ich ceny skacz\u0105 i trudno je potem sprzeda\u0107."
    ],
    [
      "Units to buy",
      "Ile sztuk chc\u0119 kupi\u0107",
      "For this many units Flipster works out which buy order to place and how much you pay in total.",
      "Dla tylu sztuk policz\u0119, jakie zlecenie kupna ustawi\u0107 i ile razem zap\u0142acisz."
    ],
    [
      "Items to check",
      "Ile przedmiot\xF3w sprawdzi\u0107",
      "How many items to go through. 40 items take about 1-3 minutes.",
      "Ile przedmiot\xF3w przejrze\u0107. 40 sztuk to ok. 1-3 minuty."
    ],
    [
      "How many to find",
      "Ile znale\u017A\u0107",
      'The scanner goes through items until this many get the "Flip possible" verdict, the list ends or you click Stop. Leave it empty for no limit.',
      "Skaner przegl\u0105da kolejne przedmioty, a\u017C tyle z nich dostanie ocen\u0119 \u201EFlip mo\u017Cliwy\u201D, lista si\u0119 sko\u0144czy albo klikniesz Stop. Puste pole oznacza brak limitu."
    ],
    [
      "Min. sales/24h",
      "Min. sprzeda\u017Cy/24h",
      "Items that sell less often are greyed out, because you would wait long for a buyer.",
      "Przedmioty sprzedawane rzadziej s\u0105 wyszarzone, bo d\u0142ugo czeka\u0142by\u015B na kupca."
    ],
    [
      "Min. ROI %",
      "Min. ROI %",
      "Items that earn less (as a percentage of the buy price) are greyed out. A sensible threshold is 3-5%.",
      "Przedmioty z mniejszym zarobkiem (w procentach ceny zakupu) s\u0105 wyszarzone. Rozs\u0105dny pr\xF3g to 3-5%."
    ],
    // ---- Deals: table columns
    ["Volume 24h", "Wolumen 24h", "How many units sold in the last day.", "Ile sztuk sprzeda\u0142o si\u0119 w ostatniej dobie."],
    // ---- Deals: long term
    [
      "Price now",
      "Cena teraz",
      "The cheapest listing on the Steam market, so what you pay to buy right away.",
      "Najta\u0144sza oferta na rynku Steam, czyli za ile kupisz od r\u0119ki."
    ],
    [
      "Winters (Nov to May)",
      "Zimy (XI\u2192V)",
      "How often in the past it paid off to buy at the end of November and sell half a year later (after the fee). Hover to see each year.",
      "Ile razy w przesz\u0142o\u015Bci op\u0142aci\u0142o si\u0119 kupi\u0107 pod koniec listopada i sprzeda\u0107 p\xF3\u0142 roku p\xF3\u017Aniej (po prowizji). Najed\u017A, \u017Ceby zobaczy\u0107 ka\u017Cdy rok."
    ],
    [
      "After 1 year",
      "Po roku",
      "How often in the past holding for a year gave a profit after the fee, and what the typical result was.",
      "Jak cz\u0119sto w przesz\u0142o\u015Bci trzymanie przez rok da\u0142o zysk po prowizji i ile typowo wychodzi\u0142o."
    ],
    ["After 2 years", "Po 2 latach", "The same for holding two years.", "To samo dla dw\xF3ch lat trzymania."],
    [
      "vs 1-year avg",
      "vs \u015Br. z roku",
      "Whether it's cheaper or pricier now than on average over the last year. Minus means cheaper than usual.",
      "Czy teraz jest taniej, czy dro\u017Cej ni\u017C \u015Brednio w ostatnim roku. Minus oznacza, \u017Ce taniej ni\u017C zwykle."
    ],
    [
      "30 days",
      "30 dni",
      "How much the price changed in the last month. A big drop (over 10%) is a sign to wait before buying.",
      "O ile zmieni\u0142a si\u0119 cena w ostatnim miesi\u0105cu. Du\u017Cy spadek (ponad 10%) to znak, \u017Ceby jeszcze poczeka\u0107 z zakupem."
    ],
    [
      "Verdict",
      "Ocena",
      `Flipster's short verdict. "Candidate" is, for example, a case older than 4 years whose price isn't falling and which keeps selling. Hover over the verdict to see why.`,
      "Kr\xF3tki werdykt Flipstera. \u201EKandydat\u201D to np. skrzynia starsza ni\u017C 4 lata, kt\xF3rej cena nie leci w d\xF3\u0142 i kt\xF3ra si\u0119 sprzedaje. Najed\u017A na ocen\u0119, \u017Ceby zobaczy\u0107 pow\xF3d."
    ],
    // ---- Deals: quick flip
    [
      "Buy (order)",
      "Kupno (zlecenie)",
      "What to set your buy order at. That's a cent more than other people's orders that are really waiting for sellers.",
      "Za ile ustawi\u0107 zlecenie kupna. To grosz wi\u0119cej ni\u017C zlecenia innych, kt\xF3re naprawd\u0119 czekaj\u0105 na sprzedaj\u0105cych."
    ],
    [
      "Sell (actual sales)",
      "Sprzeda\u017C (transakcje)",
      "What the item really sells for. You can only sell 7 days after buying, so a one-day price spike doesn't count.",
      "Za ile ten przedmiot naprawd\u0119 si\u0119 sprzedaje. Sprzeda\u0107 mo\u017Cesz dopiero po 7 dniach od zakupu, wi\u0119c jednodniowy skok ceny si\u0119 nie liczy."
    ],
    ["Profit/unit", "Zysk/szt.", "What you earn on one unit after Steam's fee.", "Ile zarobisz na jednej sztuce po odj\u0119ciu prowizji Steama."],
    ["Profit / unit (flip)", "Zysk / szt. (flip)", "What you earn on one unit after Steam's fee.", "Ile zarobisz na jednej sztuce po odj\u0119ciu prowizji Steama."],
    [
      "ROI",
      "ROI",
      "Earnings as a percentage of the buy price, after the fee. For example 5% means 5 z\u0142 left from every 100 z\u0142.",
      "Zarobek w procentach ceny zakupu, po prowizji. Np. 5% oznacza, \u017Ce z ka\u017Cdych 100 z\u0142 zostaje 5 z\u0142."
    ],
    [
      "Weekly swing",
      "Zmiana tyg.",
      "How much the price usually moves in a week. You can't sell for a week, so that's your risk.",
      "O ile cena zwykle zmienia si\u0119 w ci\u0105gu tygodnia. Przez tydzie\u0144 nie mo\u017Cesz sprzeda\u0107, wi\u0119c to Twoje ryzyko."
    ],
    [
      "Fill chance",
      "Szansa wej\u015Bcia",
      "How many units sold last week at your order price or cheaper. Below 10 the order will probably just sit, and 0 means nobody sells that cheap.",
      "Ile sztuk w ostatnim tygodniu sprzedano po cenie Twojego zlecenia albo taniej. Poni\u017Cej 10 zlecenie raczej b\u0119dzie sta\u0142o, a 0 oznacza, \u017Ce nikt nie sprzedaje tak tanio."
    ],
    // ---- Market: listings and buy orders
    ["New price", "Nowa cena", "The price your listing changes to. Type it or click a suggestion.", "Cena, na kt\xF3r\u0105 zmienisz ofert\u0119. Wpisz j\u0105 albo kliknij gotow\u0105 propozycj\u0119."],
    ["You get", "Otrzymasz", "What lands in your Steam wallet after the fee.", "Ile wpadnie na saldo Steam po prowizji."],
    [
      "Your price",
      "Twoja cena",
      "What you listed it for (what the buyer pays) and what you get from it after the fee.",
      "Za ile wystawi\u0142e\u015B (tyle p\u0142aci kupuj\u0105cy) i ile z tego dostaniesz po prowizji."
    ],
    [
      "Market",
      "Rynek",
      "Whether your listing is the cheapest, what the cheapest listing of others costs and what the item usually sells for.",
      "Czy Twoja oferta jest najta\u0144sza, ile kosztuje najta\u0144sza oferta innych i za ile przedmiot zwykle si\u0119 sprzedaje."
    ],
    [
      "Suggested price",
      "Proponowana cena",
      "The highest price at which the item has a real chance to sell within the time set in \u2699.\nFlipster checks how often the price held at that level over the last month. For rarely sold items it looks at how many cheaper listings are ahead of you and what recent sales went for.",
      "Najwy\u017Csza cena, przy kt\xF3rej przedmiot ma realn\u0105 szans\u0119 zej\u015B\u0107 w czasie ustawionym w \u2699.\nFlipster sprawdza, jak cz\u0119sto w ostatnim miesi\u0105cu cena utrzymywa\u0142a si\u0119 na takim poziomie. Przy rzadko sprzedawanych przedmiotach patrzy, ile ta\u0144szych ofert jest przed Tob\u0105 i po ile ostatnio sprzedawano."
    ],
    ["Your order", "Twoje zlecenie", "What you offer per unit and how many units you still want to buy.", "Ile oferujesz za sztuk\u0119 i ile sztuk jeszcze chcesz kupi\u0107."],
    [
      "Suggestion",
      "Propozycja",
      "A cent more than the highest order of others, so yours is first in line (never above your maximum).",
      "Grosz wi\u0119cej ni\u017C najwy\u017Csze zlecenie innych, \u017Ceby Twoje by\u0142o pierwsze w kolejce (nie wi\u0119cej ni\u017C Twoje maksimum)."
    ],
    // ---- History: columns
    [
      "Buy / sell price",
      "Cena zakupu / sprzeda\u017Cy",
      "For a sale, what you got after the fee. For a purchase, what you paid.\nAmounts in euro or dollars are converted at the NBP rate of that day.",
      "Przy sprzeda\u017Cy to kwota, kt\xF3r\u0105 dosta\u0142e\u015B na r\u0119k\u0119 (po prowizji), a przy zakupie to, ile zap\u0142aci\u0142e\u015B.\nKwoty w euro czy dolarach s\u0105 przeliczone po kursie NBP z tamtego dnia."
    ],
    [
      "Price today",
      "Cena dzi\u015B",
      "What the same item sells for today (the cheapest listing). Below it, how much more or less that is than back then.",
      "Za ile ten sam przedmiot sprzedaje si\u0119 dzi\u015B (najta\u0144sza oferta). Pod spodem wida\u0107, o ile wi\u0119cej albo mniej to ni\u017C wtedy."
    ],
    [
      "Profit / loss",
      "Zysk / strata",
      "How much you made or lost on it, so what you got minus what it cost you.\nThe cost is the purchase price, a case with its key or the value of what you gave in a trade. Drops and gifts cost nothing.",
      "Ile na tym zarobi\u0142e\u015B albo straci\u0142e\u015B, czyli to, co dosta\u0142e\u015B, minus to, ile Ci\u0119 to kosztowa\u0142o.\nKosztem jest cena zakupu, skrzynia z kluczem albo warto\u015B\u0107 tego, co odda\u0142e\u015B w wymianie. Drop i prezent nic nie kosztuj\u0105."
    ],
    [
      "Status",
      "Status",
      "What happened to the item. You still have it, you sold it or you gave it away in a trade.",
      "Co si\u0119 sta\u0142o z przedmiotem. Nadal go masz, sprzeda\u0142e\u015B go albo odda\u0142e\u015B w wymianie."
    ],
    // ---- Inventory
    [
      "Items",
      "Przedmioty",
      "How many items you have, counting those in your inventory and those listed on the market.",
      "Ile masz przedmiot\xF3w, licz\u0105c te w ekwipunku i te wystawione na rynku."
    ],
    [
      "Steam value",
      "Warto\u015B\u0107 Steam",
      "What everything together would be worth at the lowest prices on the Steam market (what the buyer pays).",
      "Ile by\u0142oby warte wszystko razem po najni\u017Cszych cenach na rynku Steam (tyle p\u0142aci kupuj\u0105cy)."
    ],
    [
      "Sellable now",
      "Do sprzedania teraz",
      'Items you can list right away (no trade lock). "You get" is what you get after the fee.',
      "Przedmioty, kt\xF3re mo\u017Cesz wystawi\u0107 od r\u0119ki (bez blokady handlu). \u201EOtrzymasz\u201D to kwota, kt\xF3r\u0105 dostaniesz po prowizji."
    ],
    [
      "On the market",
      "Na rynku",
      'Your listings. "Undercut" means someone listed cheaper than you.',
      "Twoje wystawione oferty. \u201EPrzebite\u201D znaczy, \u017Ce kto\u015B wystawi\u0142 taniej ni\u017C Ty."
    ],
    ["Selected", "Zaznaczone", "How many units you selected and what they are worth.", "Ile sztuk zaznaczy\u0142e\u015B i ile s\u0105 warte."],
    // ---- History: cards
    [
      "Spent on the market",
      "Wydano na rynku",
      "How much you paid in total for purchases on the Steam market (in the period and game picked at the top).",
      "Ile w sumie zap\u0142aci\u0142e\u015B za zakupy na rynku Steam (w okresie i grze wybranych u g\xF3ry)."
    ],
    [
      "Received from sales",
      "Otrzymano ze sprzeda\u017Cy",
      "How much you got in total from sales on the market, already after Steam's fee.",
      "Ile w sumie dosta\u0142e\u015B ze sprzeda\u017Cy na rynku, ju\u017C po prowizji Steama."
    ],
    [
      "Balance",
      "Bilans",
      "Received minus spent. Plus means trading on the market grew your Steam wallet, minus means it shrank it.",
      "Otrzymano minus wydano. Plus znaczy, \u017Ce handel na rynku powi\u0119kszy\u0142 Twoje saldo Steam, a minus, \u017Ce je zmniejszy\u0142."
    ],
    [
      "Flip profit",
      "Zysk z flip\xF3w",
      `How much you made on trading alone, so on items bought on the market and later sold. That's the sale amount (after the fee) minus what you paid for them.
Drops, cases, trades and what you still own don't count. How much your wallet grew or shrank overall is shown by Balance.
"In profit" is the share of those sales that made money (e.g. 10% is 1 in 10).`,
      "Ile zarobi\u0142e\u015B na samym handlu, czyli na przedmiotach kupionych na rynku i potem sprzedanych. To kwota ze sprzeda\u017Cy (po prowizji) minus to, ile za nie zap\u0142aci\u0142e\u015B.\nNie liczy drop\xF3w, skrzy\u0144, wymian ani tego, co nadal masz. Ile w sumie przyby\u0142o albo uby\u0142o na saldzie, pokazuje Bilans.\n\u201ENa plus\u201D to cz\u0119\u015B\u0107 tych sprzeda\u017Cy, kt\xF3re da\u0142y zysk (np. 10% to 1 na 10)."
    ],
    // ---- History: opened cases
    [
      "Openings",
      "Otwarcia",
      "How many cases, capsules and terminals you opened. Below it, how many of them gave more than they cost.",
      "Ile skrzy\u0144, kapsu\u0142 i terminali otworzy\u0142e\u015B. Pod spodem wida\u0107, ile z nich da\u0142o wi\u0119cej, ni\u017C kosztowa\u0142o."
    ],
    [
      "Opening cost",
      "Koszt otwar\u0107",
      "What the openings cost you, so the case (its purchase price, or its value if it dropped in game) and the key. For a terminal, the terminal and what you paid in game.",
      "Ile kosztowa\u0142y Ci\u0119 otwarcia, czyli skrzynia (cena zakupu albo jej warto\u015B\u0107, je\u015Bli wypad\u0142a z gry) i klucz. Przy terminalu liczy si\u0119 terminal i to, co zap\u0142aci\u0142e\u015B w grze."
    ],
    [
      "Drop value",
      "Warto\u015B\u0107 drop\xF3w",
      "What the items you unboxed are worth (after the fee).\nSold ones count at the sale amount, traded ones at what you got for them, and the ones you still have at today's price.",
      "Ile jest warte to, co wypad\u0142o ze skrzy\u0144 (po prowizji).\nSprzedane licz\u0105 si\u0119 po kwocie sprzeda\u017Cy, wymienione po tym, co za nie dosta\u0142e\u015B, a te, kt\xF3re nadal masz, po dzisiejszej cenie."
    ],
    [
      "Profit / loss on cases",
      "Zysk / strata na skrzyniach",
      "Drop value minus opening cost. Terminals without an amount paid in game are left out.",
      "Warto\u015B\u0107 drop\xF3w minus koszt otwar\u0107. Terminale bez wpisanej kwoty zap\u0142aconej w grze s\u0105 pomini\u0119te."
    ],
    [
      "Best drop",
      "Najlepszy drop",
      "The most valuable item you unboxed, with its value and the opening date.",
      "Najcenniejszy przedmiot, jaki Ci wypad\u0142, z jego warto\u015Bci\u0105 i dat\u0105 otwarcia."
    ]
  ];
  var TIPS = Object.fromEntries(ROWS.map(([en, pl, te, tp]) => getLang() === "pl" ? [pl, tp] : [en, te]));

  // src/assets/logo/flipster-mark-white-f-transparent.svg
  var flipster_mark_white_f_transparent_default = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="512" height="512">\n\n\n    <path d="M43 75 C72 34 145 27 190 54" fill="none"\n          stroke="#a4d007" stroke-width="12" stroke-linecap="butt"/>\n    <path d="M184 31 L224 56 L181 78 Z" fill="#a4d007"/>\n    <path d="M213 181 C181 219 107 226 65 196" fill="none"\n          stroke="#ff6b6b" stroke-width="12" stroke-linecap="butt"/>\n    <path d="M71 173 L31 195 L70 220 Z" fill="#ff6b6b"/>\n    <path d="M91 82 H190 L181 111 H119 L113 130 H170 L161 158 H104 L95 184 H57 Z"\n          fill="#ffffff"/>\n    \n</svg>';

  // src/assets/logo/flipster-32-white-f-navy-bg.svg
  var flipster_32_white_f_navy_bg_default = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="32" height="32">\n<rect width="100%" height="100%" fill="#1b2838"/>\n\n    <path d="M43 75 C72 34 145 27 190 54" fill="none"\n          stroke="#a4d007" stroke-width="12" stroke-linecap="butt"/>\n    <path d="M184 31 L224 56 L181 78 Z" fill="#a4d007"/>\n    <path d="M213 181 C181 219 107 226 65 196" fill="none"\n          stroke="#ff6b6b" stroke-width="12" stroke-linecap="butt"/>\n    <path d="M71 173 L31 195 L70 220 Z" fill="#ff6b6b"/>\n    <path d="M91 82 H190 L181 111 H119 L113 130 H170 L161 158 H104 L95 184 H57 Z"\n          fill="#ffffff"/>\n    \n</svg>';

  // src/core/logo.js
  var bare = (s) => s.replace(/\s(width|height)="\d+"/g, "").trim();
  var MARK = bare(flipster_mark_white_f_transparent_default);
  var TILE = bare(flipster_32_white_f_navy_bg_default);

  // src/core/ui.js
  var CSS2 = `
#stt-fab{position:fixed;left:70px;bottom:20px;z-index:99990;display:flex;gap:6px;align-items:center;background:#171d25;border:1px solid #2a475e;border-radius:6px;padding:4px 4px 4px 10px;box-shadow:0 4px 14px #000a;font:13px "Motiva Sans",Arial,sans-serif;color:#c6d4df}
#stt-fab button{background:#5c7e10;color:#fff;border:0;border-radius:4px;padding:6px 14px 6px 7px;font:600 13px inherit;cursor:pointer;display:inline-flex;align-items:center;gap:7px}
#stt-fab .logo svg{display:block;width:22px;height:22px;border-radius:4px}
#stt-fab button:hover{background:#7ea64b}
#stt-fab .dot{width:8px;height:8px;border-radius:50%;background:#555}
#stt-fab .dot.on{background:#a4d007;box-shadow:0 0 6px #a4d007}
#stt-ov{position:fixed;inset:0;background:#000b;z-index:99995;display:flex;justify-content:center;align-items:flex-start;padding:28px 14px;overflow:auto}
#stt-ov[hidden],#stt [hidden]{display:none!important}
#stt{--bg:#1b2838;--bg2:#16202d;--bg3:#0e1621;--ln:#2a475e;--tx:#c6d4df;--mut:#8f98a0;--ok:#a4d007;--err:#ff6b6b;--warn:#e5b84c;--acc:#66c0f4;
  background:var(--bg);color:var(--tx);width:min(1280px,100%);border-radius:8px;box-shadow:0 10px 50px #000;font:13px "Motiva Sans",Arial,sans-serif;display:flex;flex-direction:column;height:calc(100vh - 56px)}
#stt *{box-sizing:border-box}
#stt header{display:flex;align-items:center;gap:10px;padding:10px 14px;border-bottom:1px solid var(--ln);flex-wrap:wrap}
#stt header h2{margin:0;font-size:16px;color:#fff;font-weight:500;margin-right:8px;display:flex;align-items:center;gap:7px}
#stt header h2 .logo svg{display:block;width:30px;height:30px;margin:-4px 0}
#stt header h2>.sub{align-self:flex-end;margin-bottom:2px}
#stt nav{display:flex;gap:2px;flex-wrap:wrap;flex:1}
#stt nav button{background:none;border:0;color:var(--mut);padding:7px 11px;border-radius:4px;cursor:pointer;font:inherit}
#stt nav button.on{background:var(--ln);color:#fff}
#stt nav button:hover{color:#fff}
#stt .gi .qs button:disabled,#stt .gi .qs button:disabled:hover{background:#2a3542;color:#8f98a0;opacity:.7;cursor:not-allowed}
#stt #i-grid.stale .gi{cursor:default}
#stt header .b.ico{font-size:17px;line-height:1;margin-right:6px}
#stt header .b.ico.on{background:var(--ln);color:#fff}
#stt .body{overflow:auto;flex:1;min-height:200px}
#stt .tab{display:none}#stt .tab.on{display:block}
#stt .bar{display:flex;flex-wrap:wrap;gap:8px;align-items:center;padding:10px 14px;border-bottom:1px solid #22303f;position:sticky;top:0;background:var(--bg);z-index:2}
#stt .bar .sp{flex:1}
#stt .sec-h{display:flex;align-items:baseline;gap:8px;padding:14px 14px 6px;font-size:15px;color:#fff;border-top:1px solid var(--ln)}
#stt .sec-h:first-child{border-top:0}
#stt .sec-h .cnt{font-size:12px;color:var(--mut)}
#stt button.b{background:var(--ln);color:var(--tx);border:0;border-radius:3px;padding:6px 11px;cursor:pointer;font:inherit;white-space:nowrap}
#stt button.b:hover:not(:disabled){background:#3d6c8d;color:#fff}
#stt button.b.on{background:var(--acc);color:#000}
/* a button that shows / hides a panel: when open it looks like the active sub-tab (underline), not a bright fill */
#stt button.b.pane.on{background:var(--ln);color:#fff;box-shadow:inset 0 -2px 0 var(--acc)}
#stt button.b.pane.on:hover{background:#3d6c8d}
#stt button.go{background:#5c7e10;color:#fff}#stt button.go:hover:not(:disabled){background:#7ea64b}
#stt button.red{background:#7a2b2b;color:#fff}#stt button.red:hover:not(:disabled){background:#a33}
#stt button.s{padding:3px 7px;font-size:12px}
#stt button:disabled{opacity:.4;cursor:default}
#stt input:not([type]),#stt input[type=text],#stt input[type=number],#stt input[type=search],#stt select,#stt textarea{background:var(--bg3);border:1px solid var(--ln);color:#fff;border-radius:3px;padding:5px 7px;font:inherit}
#stt textarea{resize:vertical;outline:none}#stt textarea:focus{border-color:var(--acc)}#stt textarea::placeholder{color:#5c6b7a}
#stt input.p{width:76px}
#stt label{display:inline-flex;gap:5px;align-items:center;cursor:pointer}
#stt table{width:100%;border-collapse:collapse}
#stt th{position:sticky;top:0;background:var(--bg2);text-align:left;font-weight:500;color:var(--mut);padding:7px 8px;font-size:11px;text-transform:uppercase;white-space:nowrap;z-index:1}
#stt th[data-sort]{cursor:pointer}#stt th[data-sort]:hover{color:#fff}
#stt td{padding:5px 8px;border-top:1px solid #22303f;vertical-align:middle}
#stt tr:hover td{background:#1f2f42}
#stt .it{display:flex;align-items:center;gap:8px;min-width:220px}
#stt .it img{width:46px;height:34px;object-fit:contain;background:var(--bg3);border-radius:3px;flex:none}
#stt .it a{color:inherit;text-decoration:none}#stt .it a:hover{text-decoration:underline}
#stt .sub{font-size:11px;color:var(--mut)}
#stt .ok{color:var(--ok)}#stt .err{color:var(--err)}#stt .warn{color:var(--warn)}#stt .acc{color:var(--acc)}#stt .mut{color:var(--mut)}
#stt .pos{color:var(--ok)}#stt .neg{color:var(--err)}
#stt .tag{display:inline-block;padding:1px 6px;border-radius:9px;font-size:11px;background:var(--bg3);border:1px solid var(--ln)}
/* auto-fit: the cards share the whole row (auto-fill left empty columns on the right) */
#stt .cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px;padding:12px 14px}
#stt .card{background:var(--bg2);border:1px solid #22303f;border-radius:6px;padding:10px 12px}
#stt .card .k{font-size:11px;color:var(--mut);text-transform:uppercase;display:flex;align-items:flex-start;gap:2px}
#stt .card .k .stt-i{flex:none;margin-top:-1px}
#stt .card .v{font-size:19px;color:#fff;margin-top:3px}
#stt .card .v.pos{color:var(--ok)}#stt .card .v.neg{color:var(--err)}
#stt .note{padding:8px 14px;font-size:12px;color:var(--mut);line-height:1.5}
#stt .empty{padding:30px;text-align:center;color:var(--mut)}
#stt .htabs{display:flex;gap:2px;padding:0 14px;border-bottom:1px solid rgba(255,255,255,.08);margin-top:6px}
#stt .htabs button{background:none;border:0;border-bottom:2px solid transparent;color:var(--mut,#8f98a0);padding:9px 14px;font:inherit;font-size:14px;cursor:pointer}
#stt .htabs button:hover{color:#fff}
#stt .htabs button.on{color:#fff;border-bottom-color:var(--acc,#66c0f4)}
#stt .htabs .cnt{font-size:12px;opacity:.7}
#stt .chipst{display:inline-block;font-size:11px;font-weight:600;padding:1px 8px;border-radius:9px;border:1px solid;line-height:1.6;white-space:nowrap}
#stt .chipst.ok{color:#a4d007;border-color:#4c6b22;background:rgba(164,208,7,.1)}
#stt .chipst.bad{color:#ff7b7b;border-color:#7a2b2b;background:rgba(255,107,107,.1)}
#stt .chipst.mid{color:#e5b84c;border-color:#7a6224;background:rgba(229,184,76,.1)}
#stt .chipst.mut{color:#8f98a0;border-color:#3a4654}
#stt .acts{display:flex;gap:6px;justify-content:flex-end;flex-wrap:wrap}
#stt tr.cfg>td{background:rgba(0,0,0,.18)}
#stt .btng{display:inline-flex}
#stt .btng .b:first-child{border-radius:3px 0 0 3px}
#stt .btng .b+.b{border-radius:0 3px 3px 0;border-left:1px solid rgba(0,0,0,.3)}
#stt .btng .b.on{background:var(--ln);color:var(--tx)}
#stt .btng .b.on:hover{background:#3d6c8d;color:#fff}
#stt .adot{display:inline-block;width:8px;height:8px;border-radius:50%;background:#5c6b7a;margin-right:7px;vertical-align:0}
#stt .b.on .adot{background:#a4d007;box-shadow:0 0 6px #a4d007}
#stt .cfgbox{display:flex;flex-wrap:wrap;gap:12px;padding:8px 0}
#stt .cfgbox>div{flex:1 1 280px;display:flex;flex-direction:column;gap:4px;background:var(--bg2);border:1px solid #22303f;border-radius:6px;padding:8px 12px}
#stt .cfgbox .lb{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:var(--mut)}
#stt .cfgbox .line{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:2px 0}
#stt .cfgbox .inp{display:inline-flex;align-items:center;gap:4px;background:var(--bg3);border:1px solid var(--ln);border-radius:4px;padding-right:9px;color:var(--mut);font-size:12px;transition:border-color .12s}
#stt .cfgbox .inp:focus-within{border-color:var(--acc)}
#stt .cfgbox .inp input{border:0;background:transparent;width:78px;text-align:right;outline:none;padding:6px 2px 6px 8px}
#stt .cfgbox .inp input::placeholder{color:#5c6b7a}
#stt .chips{display:inline-flex;gap:4px;flex-wrap:wrap;background:var(--bg3,#101822);border:1px solid #22303f;border-radius:6px;padding:3px}
#stt label.tgl{display:inline-flex;align-items:center;gap:7px;padding:3px 4px;cursor:pointer;user-select:none;font-size:12px;color:var(--mut);white-space:nowrap}
#stt label.tgl:hover{color:#c6d4df}
#stt label.tgl input{display:none}
#stt label.tgl .tr{position:relative;flex:none;width:28px;height:16px;border-radius:9px;background:#2a3542;border:1px solid #3a4a5c;transition:background .15s,border-color .15s}
#stt label.tgl .tr::after{content:'';position:absolute;top:2px;left:2px;width:10px;height:10px;border-radius:50%;background:#8f98a0;transition:transform .15s,background .15s}
#stt label.tgl:has(input:checked){color:#fff}
#stt label.tgl:has(input:checked) .tr{background:#2a6f9c;border-color:#66c0f4}
#stt label.tgl:has(input:checked) .tr::after{transform:translateX(12px);background:#fff}
#stt .seg{display:inline-flex;background:var(--bg3,#101822);border:1px solid #22303f;border-radius:6px;padding:2px}
#stt .seg label{padding:4px 10px;border-radius:4px;cursor:pointer;user-select:none;font-size:12px;color:var(--mut);white-space:nowrap;transition:background .12s,color .12s}
#stt .seg label:hover{color:#fff}
#stt .seg input{display:none}
#stt .seg label:has(input:checked){background:#2a475e;color:#fff}
#stt label.chip{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:4px;cursor:pointer;user-select:none;color:var(--mut);font-size:12px;transition:background .12s,color .12s}
#stt label.chip:hover{color:#fff;background:rgba(255,255,255,.05)}
#stt label.chip input{display:none}
#stt label.chip:has(input:checked){background:#2a475e;color:#fff}
#stt label.chip:has(input:checked)::before{content:'\u2713';font-size:11px;color:var(--acc,#66c0f4)}
#stt .bar .line{display:flex;flex-wrap:wrap;gap:8px 14px;align-items:center;width:100%}
#stt .bar .line + .line{padding-top:8px;border-top:1px solid rgba(255,255,255,.05)}
#stt .grp{display:inline-flex;align-items:center;gap:6px}
#stt .grp > .lb{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:var(--mut)}
#stt label.spot{display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border-radius:16px;border:1px solid #4c6b22;background:rgba(164,208,7,.08);color:#a4d007;font-size:12px;font-weight:600;cursor:pointer;user-select:none;transition:background .12s,color .12s,border-color .12s}
#stt label.spot:hover{background:rgba(164,208,7,.16)}
#stt label.spot input{display:none}
#stt label.spot:has(input:checked){background:#5c7e10;border-color:#a4d007;color:#fff}
#stt label.spot b{min-width:18px;padding:1px 6px;border-radius:9px;background:rgba(0,0,0,.28);font-size:11px;text-align:center}
#stt label.spot b:empty{display:none}
#stt .grid>.empty{grid-column:1/-1}
#stt .sugg{position:absolute;top:100%;left:0;right:0;z-index:20;background:var(--bg2,#1b2838);border:1px solid #2a475e;border-radius:4px;max-height:320px;overflow:auto;box-shadow:0 6px 18px #0009}#stt .sugg div{display:flex;gap:8px;align-items:center;padding:5px 8px;cursor:pointer;font-size:12px;color:#c6d4df}#stt .sugg div:hover{background:#2a475e}#stt .sugg img{width:40px;height:30px;object-fit:contain}#stt .sugg .p2{margin-left:auto;color:var(--mut)}
#stt .spin{display:inline-block;width:14px;height:14px;border:2px solid rgba(255,255,255,.15);border-top-color:var(--acc,#66c0f4);border-radius:50%;animation:stt-spin .8s linear infinite;vertical-align:-2px;margin-right:8px}
@keyframes stt-spin{to{transform:rotate(360deg)}}
#stt .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(172px,1fr));gap:10px;padding:12px 14px 48px}
#stt .gi{background:var(--bg2);border:2px solid #22303f;border-radius:6px;padding:6px;cursor:pointer;position:relative;user-select:none;display:flex;flex-direction:column}
#stt .gi .meta{height:36px;overflow:hidden;display:flex;flex-direction:column;gap:2px;margin-top:2px}
#stt .gi .meta>.sub{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#stt .gi .foot{display:flex;flex-direction:column;gap:3px}
#stt .gi .tail{margin-top:auto;display:flex;flex-direction:column;gap:3px;padding-top:6px}
#stt .gi .src{font-size:11px;color:var(--mut);line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:2.6em}
#stt .gi.listed{border-style:dashed;border-color:#6b5a2a;background:#1d1f22}
#stt .gi.listed img.m{opacity:.75}
#stt .gi.locked{border-style:dashed;border-color:#3d5a7a;background:#18212c}
#stt .gi.locked img.m{opacity:.6;filter:grayscale(.35)}
#stt .gi.locked .n{opacity:.85}
#stt .gi.mark{border-color:#e5b84c;box-shadow:0 0 0 1px rgba(229,184,76,.25),0 0 12px rgba(229,184,76,.18)}
#stt .gi.sel{border-color:var(--acc);background:#1d3346}
#stt .gi.hl{border-color:#66c0f4;box-shadow:0 0 0 3px rgba(102,192,244,.35)}
#stt .pchip{display:inline-block;max-width:100%;padding:1px 6px;border-radius:3px;font-size:10px;font-weight:600;line-height:1.5;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;vertical-align:middle;cursor:help}
#stt .pchip.top{background:rgba(229,184,76,.2);color:#f0c75e}
#stt .pchip.high{background:rgba(176,124,255,.2);color:#c9a6ff}
#stt .pchip.mid{background:rgba(102,192,244,.16);color:#7fcdf7}
#stt .pchip.low{background:rgba(198,212,223,.1);color:#9aa4ad}
#stt .pchip.user{background:rgba(76,217,123,.16);color:#5fe08c}
#stt .gi.pat-top{border-color:#e5b84c;box-shadow:0 0 0 2px rgba(229,184,76,.55),0 0 16px rgba(229,184,76,.35)}
#stt .gi.pat-high{border-color:#b07cff;box-shadow:0 0 0 2px rgba(176,124,255,.5),0 0 14px rgba(176,124,255,.3)}
#stt .gi.pat-mid{border-color:#66c0f4;box-shadow:0 0 0 1px rgba(102,192,244,.45)}
#stt .gi.pat-user{border-color:#4cd97b;box-shadow:0 0 0 2px rgba(76,217,123,.45),0 0 14px rgba(76,217,123,.25)}
#stt .gi.sel.pat{border-color:var(--acc)}
#stt .gi.hl.main{border-color:#fff;box-shadow:0 0 0 3px #66c0f4,0 0 18px rgba(102,192,244,.7);animation:stt-hl 1s ease-in-out 3}
@keyframes stt-hl{50%{box-shadow:0 0 0 6px rgba(102,192,244,.25),0 0 26px rgba(102,192,244,.9)}}
#stt .gi img.m{width:100%;height:84px;object-fit:contain;margin-top:26px}
#stt .gi .pv .lb{white-space:nowrap}
#stt .gi .n{font-size:11px;line-height:1.25;height:28px;overflow:hidden}
#stt .gi .pv{display:grid;grid-template-columns:auto auto;justify-content:space-between;gap:6px;margin-top:6px;padding-top:6px;border-top:1px solid #22303f}
#stt .gi .pv>div{display:flex;flex-direction:column;min-width:0}
#stt .gi .pv>div+div{text-align:right;align-items:flex-end}
#stt .gi .pv .pl{grid-column:1/-1;display:flex;justify-content:space-between;align-items:baseline;gap:6px;border-top:1px dashed #22303f;padding-top:3px;flex-direction:row!important;text-align:left!important}
#stt .gi .pv .pl b{font-size:12px}
#stt .gi .pv .lb{font-size:10px;text-transform:uppercase;letter-spacing:.04em;color:var(--mut)}
#stt .gi .pv b{font-size:13px;white-space:nowrap}
#stt .gi .pv .sub{white-space:nowrap;font-size:10.5px}
#stt .gi .pr{display:flex;justify-content:space-between;font-size:12px;margin-top:3px}
#stt .gi .fl{flex:none;height:3px;background:linear-gradient(90deg,#3c9 0 7%,#9c3 7% 15%,#cc3 15% 38%,#e93 38% 45%,#e44 45%);border-radius:2px;position:relative;margin-top:4px}
#stt .gi .fl i{position:absolute;top:-3px;width:2px;height:9px;background:#fff}
#stt .gi .st{display:flex;gap:1px;position:absolute;top:4px;right:4px}
#stt .gi .st img{width:22px;height:16px}
#stt .gi .qty{position:absolute;top:4px;right:4px;z-index:1;min-width:22px;padding:2px 7px;border-radius:10px;background:#2a6f9c;border:1px solid #66c0f4;color:#fff;font-size:11px;font-weight:700;line-height:1.2;text-align:center;box-shadow:0 1px 4px #0008}
#stt .gi .mk{position:absolute;top:4px;left:4px;z-index:1;display:flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:6px;background:rgba(23,29,37,.88);border:1px solid rgba(102,192,244,.28);color:#66c0f4;opacity:.85;transition:background .12s,color .12s,border-color .12s,opacity .12s,transform .12s}
#stt .gi .mk svg{width:15px;height:15px;display:block}
#stt .gi .wt{position:absolute;top:4px;left:32px;z-index:1;width:24px;height:24px;padding:0;border-radius:6px;background:rgba(23,29,37,.88);border:1px solid rgba(229,184,76,.25);font-size:12px;line-height:1;cursor:pointer;opacity:.45;filter:grayscale(1);transition:opacity .12s,filter .12s,background .12s}
#stt .gi:hover .wt{opacity:.85}
#stt .gi .wt:hover{opacity:1;filter:none}
#stt .gi .wt.on{opacity:1;filter:none;background:rgba(229,184,76,.18);border-color:#e5b84c}
#stt .gi .adv{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:baseline;column-gap:6px;row-gap:1px;margin-top:6px;padding:5px 8px;border-radius:5px;background:rgba(164,208,7,.07);border:1px solid rgba(164,208,7,.24);line-height:1.3}
#stt .gi .adv .lb{font-size:10px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:#a4d007;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#stt .gi .adv b{font-size:13px;color:#fff;text-align:right;white-space:nowrap}
#stt .gi .adv .w{grid-column:1 / -1;font-size:10.5px;color:var(--mut)}
#stt .gi .adv.now{background:rgba(229,184,76,.07);border-color:rgba(229,184,76,.28)}
#stt .gi .adv.now .lb{color:#e5b84c}
#stt .gi:hover .mk{opacity:1}
#stt .gi .mk:hover{background:#2a475e;border-color:#66c0f4;color:#fff;transform:scale(1.08)}
#stt .gi .sigs{display:flex;flex-wrap:wrap;gap:3px;min-height:18px}
#stt .gi .sig{font-size:10px;font-weight:600;padding:1px 6px;border-radius:9px;line-height:1.5;border:1px solid}
#stt .gi .sig.profit{color:#a4d007;border-color:#4c6b22;background:rgba(164,208,7,.12)}
#stt .gi .sig.high{color:#e5b84c;border-color:#7a6224;background:rgba(229,184,76,.12)}
#stt .gi .sig.fall{color:#ff7b7b;border-color:#7a2b2b;background:rgba(255,107,107,.12)}
#stt .gi .sig.tdown{color:#e0a3a3;border-color:#5c3a3a;background:rgba(224,163,163,.08);font-weight:500}
#stt .gi .sig.tup{color:#a8d4a0;border-color:#3d5a37;background:rgba(168,212,160,.08);font-weight:500}
#stt .gi .sig.hold{color:#8fb8d8;border-color:#2a475e;background:rgba(102,192,244,.06);font-weight:500}
#stt .gi .sig.plan{color:#66c0f4;border-color:#2a6f9c;background:rgba(102,192,244,.12);cursor:pointer}
#stt .gi .sig.skip{color:#8f98a0;border-color:#3a4654;background:rgba(143,152,160,.08)}
#stt .gi:hover{z-index:4}
#stt .gi .qs{position:absolute;left:-2px;right:-2px;top:100%;margin-top:-6px;z-index:5;display:flex;gap:6px;padding:10px 6px 6px;border:2px solid;border-color:inherit;border-top:0;border-radius:0 0 6px 6px;background:var(--bg2);box-shadow:0 8px 16px rgba(0,0,0,.55);opacity:0;transform:translateY(-6px);pointer-events:none;transition:opacity .12s,transform .12s}
#stt .gi.sel .qs{background:#1d3346}#stt .gi.listed .qs{background:#1d1f22}#stt .gi.locked .qs{background:#18212c}
#stt .gi:hover .qs{opacity:1;transform:none;pointer-events:auto}
#stt .gi .qs button{flex:1;border:1px solid rgba(255,255,255,.12);border-radius:4px;padding:6px 0;font-family:inherit;font-size:12px;font-weight:600;line-height:1;cursor:pointer;color:#fff;background:#2a475e;transition:background .12s}
#stt .gi .qs button:hover{background:#3a6a8c}
#stt .gi .qs button.g{background:#5c7e10}#stt .gi .qs button.g:hover{background:#6f9a14}
#stt .gi .qs button.red{background:#8c2828}#stt .gi .qs button.red:hover{background:#a83232}
#stt .log{height:110px;min-height:40px;flex:none;overflow:auto;padding:8px 14px;font:12px/1.5 Consolas,monospace;background:var(--bg3);white-space:pre-wrap;border-radius:0 0 8px 8px}
#stt .logbar{flex:none;height:9px;cursor:ns-resize;border-top:1px solid var(--ln);background:var(--bg3);display:flex;align-items:center;justify-content:center;user-select:none}
#stt .logbar::before{content:'';width:42px;height:3px;border-radius:2px;background:#3a4a5c;transition:background .12s}
#stt .logbar:hover::before,#stt .logbar.drag::before{background:var(--acc)}
/* \u2699 Ustawienia: diagnostic tools only in debug mode, the log can be switched off (applyPrefs) */
#stt:not(.dbg-on) .dbg{display:none!important}#stt.nolog>.logbar,#stt.nolog>.log{display:none}
#stt .status{display:flex;gap:14px;padding:6px 14px;font-size:12px;color:var(--mut);border-top:1px solid var(--ln);flex-wrap:wrap}
#stt .prog{height:3px;background:var(--bg3)}#stt .prog i{display:block;height:100%;background:var(--acc);transition:width .3s}
#stt details{padding:4px 14px}#stt summary{cursor:pointer;color:var(--acc)}
#stt .row2{display:flex;gap:10px;flex-wrap:wrap;padding:12px 14px;align-items:flex-end}
#stt .row2 > label{flex-direction:column;align-items:flex-start;gap:3px;font-size:12px;color:var(--mut)}
#stt .row2 > label > .lt{display:inline-flex;align-items:center;gap:4px;white-space:nowrap}
#stt svg.chart{width:100%;height:220px;display:block}
#stt .modal{position:fixed;inset:0;background:#0009;display:flex;align-items:center;justify-content:center;z-index:99999}
#stt .modal > div{background:var(--bg);border:1px solid var(--ln);border-radius:8px;padding:18px;max-width:520px;width:calc(100% - 32px);box-shadow:0 10px 40px #000}
#stt .modal h3{margin:0 0 10px;color:#fff;font-weight:500}
#stt .modal .acts{display:flex;justify-content:flex-end;gap:8px;margin-top:16px}
.stt-i{display:inline-flex;align-items:center;justify-content:center;width:15px;height:15px;margin-left:6px;border-radius:50%;border:1px solid #66c0f4;color:#66c0f4;font:700 10px/1 Georgia,serif;font-style:italic;text-transform:none;cursor:help;vertical-align:1px;user-select:none}
.stt-i:hover,.stt-i.on{background:#66c0f4;color:#0e1621}
#stt-tip{position:fixed;z-index:100002;max-width:300px;white-space:pre-line;background:#0e1621;border:1px solid #66c0f4;color:#c6d4df;padding:9px 11px;border-radius:6px;font:12.5px/1.5 "Motiva Sans",Arial,sans-serif;box-shadow:0 6px 24px #000c;pointer-events:none}
.stt-badge{position:absolute;left:2px;top:2px;right:2px;font:600 10px Arial,sans-serif;color:#fff;background:#000b;padding:1px 3px;border-radius:2px;pointer-events:none;display:flex;justify-content:space-between;z-index:3}
.stt-badge .f{color:#9bd}
.stt-badge.two{flex-wrap:wrap;row-gap:0}
.stt-badge .l{flex-basis:100%;color:#e5b84c}
.stt-badge .l.bad{color:#ff6b6b}
`;
  var root;
  var ov;
  var nav;
  var body;
  var logEl;
  var statusEl;
  var progEl;
  var fabDot;
  var tabs = [];
  var current = null;
  function init() {
    const st = document.createElement("style");
    st.textContent = CSS2;
    document.head.appendChild(st);
    const fab2 = document.createElement("div");
    fab2.id = "stt-fab";
    fab2.innerHTML = `<span class="dot" title="Automaty"></span><span class="mut" id="stt-fab-t"></span><button><span class="logo">${TILE}</span>Flipster</button>`;
    fab2.querySelector("button").onclick = () => open();
    fabDot = fab2.querySelector(".dot");
    document.body.appendChild(fab2);
    ov = document.createElement("div");
    ov.id = "stt-ov";
    ov.hidden = true;
    ov.innerHTML = `<div id="stt">
    <header><h2><span class="logo">${MARK}</span>Flipster <span class="sub" style="font-size:11px">Steam Market<span class="dbg"> \xB7 build ${true ? "23.11.2026, 00:09:54" : "?"}</span></span></h2><nav></nav><button class="b" data-x>\u2715</button></header>
    <div class="prog"><i style="width:0"></i></div>
    <div class="body"></div>
    <div class="status"></div>
    <div class="logbar" title="${L("ui.dragUpToMakeThe")}"></div>
    <div class="log"></div>
  </div>`;
    document.body.appendChild(ov);
    root = ov.querySelector("#stt");
    nav = root.querySelector("nav");
    body = root.querySelector(".body");
    logEl = root.querySelector(".log");
    statusEl = root.querySelector(".status");
    progEl = root.querySelector(".prog i");
    initLogResize();
    applyPrefs();
    ov.addEventListener("mousedown", (e) => {
      if (e.target === ov) close();
    });
    root.querySelector("[data-x]").onclick = close;
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !ov.hidden && !root.querySelector(".modal")) close();
    });
    initTips();
  }
  function initTips() {
    const tip = document.createElement("div");
    tip.id = "stt-tip";
    tip.hidden = true;
    document.body.appendChild(tip);
    let pinned = null;
    const icon2 = (text) => {
      const i = document.createElement("span");
      i.className = "stt-i";
      i.textContent = "i";
      i.tabIndex = 0;
      i.dataset.tip = text;
      return i;
    };
    const decorate = () => {
      for (const k of root.querySelectorAll(".card .k")) {
        if (k.querySelector(".stt-i")) continue;
        const text = TIPS[k.textContent.trim()];
        if (text) k.appendChild(icon2(text));
      }
      for (const th of root.querySelectorAll("th")) {
        if (th.querySelector(".stt-i")) continue;
        const text = TIPS[th.textContent.replace(/[▲▼]/g, "").trim()];
        if (text) th.appendChild(icon2(text));
      }
      for (const lb of root.querySelectorAll(".row2 > label")) {
        if (lb.querySelector(".stt-i")) continue;
        const t = [...lb.childNodes].find((n) => n.nodeType === 3 && n.textContent.trim());
        const text = t && TIPS[t.textContent.trim()];
        if (text) {
          const w = document.createElement("span");
          w.className = "lt";
          t.replaceWith(w);
          w.append(t, icon2(text));
        }
      }
    };
    const showFor = (icon3) => {
      tip.textContent = icon3.dataset.tip.replace(/\n+/g, "\n\n");
      tip.hidden = false;
      const r = icon3.getBoundingClientRect();
      const w = tip.offsetWidth, h = tip.offsetHeight;
      let left = Math.min(Math.max(8, r.left + r.width / 2 - w / 2), window.innerWidth - w - 8);
      let top = r.bottom + 8;
      if (top + h > window.innerHeight - 8) top = r.top - h - 8;
      tip.style.left = `${left}px`;
      tip.style.top = `${Math.max(8, top)}px`;
    };
    const hide = () => {
      tip.hidden = true;
      pinned?.classList.remove("on");
      pinned = null;
    };
    let queued = false;
    const quiet = (n) => logEl.contains(n) || statusEl.contains(n);
    new MutationObserver((ms) => {
      if (queued || ms.every((m) => quiet(m.target))) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        decorate();
      });
    }).observe(root, { childList: true, subtree: true });
    root.addEventListener("mouseover", (e) => {
      const i = e.target.closest(".stt-i");
      if (i && !pinned) showFor(i);
    });
    root.addEventListener("mouseout", (e) => {
      if (e.target.closest(".stt-i") && !pinned) tip.hidden = true;
    });
    root.addEventListener("focusin", (e) => {
      const i = e.target.closest(".stt-i");
      if (i) showFor(i);
    });
    root.addEventListener("focusout", (e) => {
      if (e.target.closest(".stt-i") && !pinned) tip.hidden = true;
    });
    document.addEventListener("click", (e) => {
      const i = e.target.closest?.("#stt .stt-i");
      if (i) {
        e.stopPropagation();
        if (pinned === i) return hide();
        hide();
        pinned = i;
        i.classList.add("on");
        showFor(i);
      } else if (pinned) hide();
    }, true);
    root.querySelector(".body").addEventListener("scroll", hide, { passive: true });
  }
  function tab(def) {
    if (def.when && !def.when()) return;
    const b = document.createElement("button");
    b.onclick = () => show(def.id);
    if (def.icon) {
      b.className = "b ico";
      b.textContent = def.icon;
      b.title = def.title;
      root.querySelector("[data-x]").before(b);
    } else {
      b.textContent = def.title;
      nav.appendChild(b);
    }
    const el7 = document.createElement("div");
    el7.className = "tab";
    body.appendChild(el7);
    tabs.push({ ...def, btn: b, el: el7, mounted: false });
  }
  function show(id, arg) {
    const t = tabs.find((x) => x.id === id) || tabs[0];
    if (!t) return;
    tabs.forEach((x) => {
      x.btn.classList.toggle("on", x === t);
      x.el.classList.toggle("on", x === t);
    });
    mountTab(t.id);
    current = t;
    set("lastTab", t.id);
    t.show?.(arg);
  }
  function mountTab(id) {
    const t = tabs.find((x) => x.id === id);
    if (t && !t.mounted) {
      t.mounted = true;
      t.mount(t.el);
      return true;
    }
    return false;
  }
  function open(id, arg) {
    ov.hidden = false;
    show(id || current?.id || get("lastTab", null) || tabs[0]?.id, arg);
  }
  var close = () => {
    ov.hidden = true;
    const t = document.getElementById("stt-tip");
    if (t) t.hidden = true;
  };
  var isOpen = () => !ov.hidden;
  var LOG_MIN = 40;
  var LOG_DEFAULT = 110;
  function initLogResize() {
    const bar = root.querySelector(".logbar");
    const maxH = () => Math.max(LOG_MIN, root.clientHeight - root.querySelector("header").offsetHeight - 200 - 40);
    const set2 = (h, save2 = true) => {
      const v = Math.round(Math.max(LOG_MIN, Math.min(root.clientHeight ? maxH() : Infinity, h)));
      const atEnd = logEl.scrollHeight - logEl.scrollTop - logEl.clientHeight < 30;
      logEl.style.height = v + "px";
      if (atEnd) logEl.scrollTop = logEl.scrollHeight;
      if (save2) set("logHeight", v);
    };
    set2(get("logHeight", LOG_DEFAULT), false);
    bar.addEventListener("mousedown", (e) => {
      e.preventDefault();
      const y0 = e.clientY, h0 = logEl.offsetHeight;
      bar.classList.add("drag");
      const move = (ev) => set2(h0 + (y0 - ev.clientY), false);
      const up = () => {
        bar.classList.remove("drag");
        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", up);
        set2(logEl.offsetHeight);
      };
      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", up);
    });
    bar.addEventListener("dblclick", () => set2(logEl.offsetHeight > LOG_DEFAULT + 40 ? LOG_DEFAULT : maxH()));
  }
  function log(msg, cls2 = "") {
    const line = document.createElement("div");
    if (cls2) line.className = cls2;
    line.textContent = `[${(/* @__PURE__ */ new Date()).toLocaleTimeString()}] ${msg}`;
    const atEnd = logEl.scrollHeight - logEl.scrollTop - logEl.clientHeight < 30;
    logEl.appendChild(line);
    while (logEl.childElementCount > 400) logEl.firstChild.remove();
    if (atEnd) logEl.scrollTop = logEl.scrollHeight;
    if (cls2 === "err") console.warn("[Flipster]", msg);
    if (cls2 === "err" && !settings.showLog) {
      status("logerr", `<span class="err" title="${L("ui.theLogIsTurnedOff")}">\u26A0 ${esc(msg)}</span>`);
      clearTimeout(errTimer);
      errTimer = setTimeout(() => status("logerr", null), 2e4);
    }
  }
  var errTimer = 0;
  function applyPrefs() {
    root.classList.toggle("dbg-on", !!settings.debug);
    root.classList.toggle("nolog", !settings.showLog);
    if (settings.showLog) status("logerr", null);
  }
  function progress(done, total) {
    progEl.style.width = total ? `${Math.min(100, done / total * 100)}%` : "0";
  }
  var statusItems = /* @__PURE__ */ new Map();
  function status(key, html) {
    if (html == null) statusItems.delete(key);
    else statusItems.set(key, html);
    statusEl.innerHTML = [...statusItems.values()].map((h) => `<span>${h}</span>`).join("");
  }
  function fab(on, text = "") {
    fabDot.classList.toggle("on", on);
    document.getElementById("stt-fab-t").textContent = text;
  }
  function ask(title, html, { ok = "OK", cancel = L("ui.cancel"), danger = false, collect = null, wide = false, onOpen = null } = {}) {
    return new Promise((resolve) => {
      const m = document.createElement("div");
      m.className = "modal";
      m.innerHTML = `<div style="${wide ? "max-width:760px" : ""}"><h3>${esc(title)}</h3><div>${html}</div><div class="acts">
      ${cancel ? `<button class="b" data-r="0">${esc(cancel)}</button>` : ""}<button class="b ${danger ? "red" : "go"}" data-r="1">${esc(ok)}</button></div></div>`;
      m.addEventListener("click", (e) => {
        const r = e.target.dataset.r;
        if (r == null && e.target !== m) return;
        const val = r === "1" ? collect ? collect(m) : true : false;
        m.remove();
        resolve(val);
      });
      root.appendChild(m);
      m.querySelector('[data-r="1"]').focus();
      onOpen?.(m);
    });
  }
  var WEAR_TAG = { "Factory New": 0, "Minimal Wear": 1, "Field-Tested": 2, "Well-Worn": 3, "Battle-Scarred": 4 };
  function marketUrl(appid = 730, hash = "") {
    let url = `https://steamcommunity.com/market/listings/${appid}/${encodeURIComponent(hash)}`;
    if (String(appid) !== "730") return url;
    const q = [];
    const wear = wearOf(hash);
    if (wear) q.push(`category_Exterior=WearCategory${WEAR_TAG[wear]}`);
    const star = hash.startsWith("\u2605"), st = /StatTrak™/.test(hash), souv = /^Souvenir /.test(hash);
    if (wear || star) q.push(`category_Quality=${souv ? "tournament" : star ? st ? "unusual_strange" : "unusual" : st ? "strange" : "normal"}`);
    return q.length ? `${url}?${q.join("&")}` : url;
  }
  function itemCell({ icon: ic, name, hash, color, appid = 730, sub = "" }) {
    const url = marketUrl(appid, hash || "");
    return `<div class="it">${ic ? `<img loading="lazy" src="https://community.cloudflare.steamstatic.com/economy/image/${esc(ic)}/62fx62f">` : ""}
    <div><a href="${esc(url)}" target="_blank" style="color:#${esc(color || "c6d4df")}">${esc(displayName(hash, name))}</a>${sub ? `<div class="sub">${sub}</div>` : ""}</div></div>`;
  }
  var patched = /* @__PURE__ */ new WeakMap();
  function clearRows(tb) {
    patched.delete(tb);
  }
  function patchRows(tb, list2) {
    const count = /* @__PURE__ */ new Map();
    const blocks = list2.map((b) => {
      const n = count.get(b.key) || 0;
      count.set(b.key, n + 1);
      return n ? { ...b, key: `${b.key}#${n}` } : b;
    });
    if (!patched.has(tb)) tb.textContent = "";
    const old = patched.get(tb) || /* @__PURE__ */ new Map(), next = /* @__PURE__ */ new Map();
    const tpl = document.createElement("template");
    for (const { key, html } of blocks) {
      const o = old.get(key);
      if (o?.html === html) {
        next.set(key, o);
        continue;
      }
      tpl.innerHTML = html;
      const nodes = [...tpl.content.children];
      if (o) {
        o.nodes[0].before(...nodes);
        o.nodes.forEach((n) => n.remove());
      }
      next.set(key, { html, nodes });
    }
    for (const [k, o] of old) if (!next.has(k)) o.nodes.forEach((n) => n.remove());
    let at = tb.firstElementChild;
    for (const { key } of blocks) for (const n of next.get(key).nodes) {
      if (n === at) at = at.nextElementSibling;
      else tb.insertBefore(n, at);
    }
    patched.set(tb, next);
  }
  function sorter(defaultKey, defaultDir = -1) {
    let key = defaultKey, dir = defaultDir;
    return {
      get key() {
        return key;
      },
      set(k, d = -1) {
        key = k;
        dir = d;
      },
      click(k) {
        if (k === key) dir = -dir;
        else {
          key = k;
          dir = -1;
        }
      },
      apply(rows3, getters) {
        const g = getters[key];
        if (!g) return rows3;
        return [...rows3].sort((a, b) => {
          const x = g(a), y = g(b);
          if (x == null && y == null) return 0;
          if (x == null) return 1;
          if (y == null) return -1;
          return (typeof x === "string" ? x.localeCompare(y) : x - y) * dir;
        });
      },
      arrow: (k) => k === key ? dir > 0 ? " \u25B2" : " \u25BC" : ""
    };
  }
  function lineChart(series, { fmtY = (v) => v, fmtX = (v) => new Date(v).toLocaleDateString(), height = 220, bars = null, zero = false } = {}) {
    const all3 = series.flatMap((s) => s.points);
    if (!all3.length) return L("ui.noData");
    const W = 1e3, H = height, P = { l: 70, r: 12, t: 12, b: 26 };
    const xs = all3.map((p) => p[0]), ys = all3.map((p) => p[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs);
    let y0 = Math.min(...ys), y1 = Math.max(...ys);
    if (zero) {
      y0 = Math.min(y0, 0);
      y1 = Math.max(y1, 0);
    }
    if (y0 === y1) {
      y0 -= 1;
      y1 += 1;
    }
    const pad = (y1 - y0) * 0.08;
    y0 -= pad;
    y1 += pad;
    const X = (v) => P.l + (v - x0) / (x1 - x0 || 1) * (W - P.l - P.r);
    const Y = (v) => P.t + (1 - (v - y0) / (y1 - y0)) * (H - P.t - P.b);
    let g = "";
    for (let i = 0; i <= 4; i++) {
      const v = y0 + (y1 - y0) * i / 4;
      g += `<line x1="${P.l}" x2="${W - P.r}" y1="${Y(v)}" y2="${Y(v)}" stroke="#2a475e" stroke-width="1"/><text x="${P.l - 6}" y="${Y(v) + 4}" fill="#8f98a0" font-size="11" text-anchor="end">${esc(fmtY(v))}</text>`;
    }
    for (let i = 0; i <= 5; i++) {
      const v = x0 + (x1 - x0) * i / 5;
      g += `<text x="${X(v)}" y="${H - 6}" fill="#8f98a0" font-size="11" text-anchor="${i === 0 ? "start" : i === 5 ? "end" : "middle"}">${esc(fmtX(v))}</text>`;
    }
    if (bars?.length) {
      const bm = Math.max(...bars.map((b) => b[1])) || 1;
      const bw = Math.max(1, (W - P.l - P.r) / bars.length - 1);
      g += bars.map(([x, v]) => `<rect x="${X(x) - bw / 2}" width="${bw}" y="${H - P.b - v / bm * 40}" height="${v / bm * 40}" fill="#2a475e"/>`).join("");
    }
    if (zero) g += `<line x1="${P.l}" x2="${W - P.r}" y1="${Y(0)}" y2="${Y(0)}" stroke="#8f98a0" stroke-width="1" stroke-dasharray="4 4"/><text x="${W - P.r - 4}" y="${Y(0) - 4}" fill="#8f98a0" font-size="11" text-anchor="end">0 (${L("ui.breakEven")})</text>`;
    for (const s of series) {
      const d = s.points.map((p, i) => `${i ? "L" : "M"}${X(p[0]).toFixed(1)},${Y(p[1]).toFixed(1)}`).join("");
      g += `<path d="${d}" fill="none" stroke="${s.color || "#66c0f4"}" stroke-width="${s.width || 1.8}" ${s.dash ? 'stroke-dasharray="5 4"' : ""}/>`;
    }
    const legend = series.filter((s) => s.label).map((s, i) => `<text x="${P.l + 8 + i * 160}" y="${P.t + 12}" fill="${s.color}" font-size="12">\u25CF ${esc(s.label)}</text>`).join("");
    return `<svg class="chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" style="height:${H}px">${g}${legend}</svg>`;
  }

  // src/core/fees.js
  var DEFAULT_WALLET = { feePercent: 0.05, feeMin: 1, feeBase: 0, pubDefault: 0.1 };
  function buyerFromReceived(recv, pub = 0.1, w = DEFAULT_WALLET) {
    const steamFee = Math.floor(Math.max(recv * w.feePercent, w.feeMin) + w.feeBase);
    const pubFee = Math.floor(pub > 0 ? Math.max(recv * pub, w.pubMin ?? w.feeMin ?? 1) : 0);
    return recv + steamFee + pubFee;
  }
  function receivedFromBuyer(buyer, pub = 0.1, w = DEFAULT_WALLET) {
    if (!(buyer > 0)) return 0;
    let r = Math.max(1, Math.floor((buyer - w.feeBase) / (w.feePercent + pub + 1)));
    while (r > 1 && buyerFromReceived(r, pub, w) > buyer) r--;
    while (buyerFromReceived(r + 1, pub, w) <= buyer) r++;
    return r;
  }
  var MIN_BUYER = buyerFromReceived(1);
  function syncMinBuyer(w = DEFAULT_WALLET) {
    MIN_BUYER = buyerFromReceived(1, w.pubDefault ?? DEFAULT_WALLET.pubDefault, w);
  }

  // src/core/cache.js
  var DB = "flipster-cache";
  var STORE = "kv";
  var MAX_MIN = 60;
  var mem = /* @__PURE__ */ new Map();
  var inflight = /* @__PURE__ */ new Map();
  var ttl = () => Math.max(0, Math.min(MAX_MIN, +settings.cacheMin || 0)) * 6e4;
  var dbp = null;
  function open2() {
    return dbp ||= new Promise((resolve) => {
      try {
        if (typeof indexedDB === "undefined") return resolve(null);
        const rq = indexedDB.open(DB, 1);
        rq.onupgradeneeded = () => rq.result.createObjectStore(STORE);
        rq.onsuccess = () => {
          const d = rq.result;
          d.onversionchange = () => d.close();
          prune(d);
          resolve(d);
        };
        rq.onerror = rq.onblocked = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  }
  var tx = (d, mode, fn) => new Promise((resolve) => {
    try {
      const t = d.transaction(STORE, mode);
      const rq = fn(t.objectStore(STORE));
      t.oncomplete = () => resolve(rq?.result);
      t.onerror = t.onabort = () => resolve(void 0);
    } catch {
      resolve(void 0);
    }
  });
  function prune(d) {
    try {
      const lim = Date.now() - MAX_MIN * 6e4;
      const rq = d.transaction(STORE, "readwrite").objectStore(STORE).openCursor();
      rq.onsuccess = () => {
        const c = rq.result;
        if (!c) return;
        if (!(c.value?.at > lim)) c.delete();
        c.continue();
      };
    } catch {
    }
  }
  async function get2(key, maxAgeMs) {
    if (!(maxAgeMs > 0)) return void 0;
    const fresh3 = (e2) => e2 && Date.now() - e2.at < maxAgeMs ? e2 : null;
    let e = fresh3(mem.get(key));
    if (!e) {
      const d = await open2();
      e = fresh3(d ? await tx(d, "readonly", (s) => s.get(key)) : null);
      if (e) mem.set(key, e);
    }
    return e ? e.v : void 0;
  }
  var MEM_MAX = 300;
  var puts = 0;
  function put(key, v) {
    const e = { at: Date.now(), v };
    mem.delete(key);
    mem.set(key, e);
    while (mem.size > MEM_MAX) mem.delete(mem.keys().next().value);
    open2().then((d) => {
      if (!d) return;
      tx(d, "readwrite", (s) => s.put(e, key));
      if (++puts % 500 === 0) prune(d);
    });
  }
  var slimSearch = (d) => d && Array.isArray(d.results) ? {
    total_count: d.total_count,
    results: d.results.map((r) => ({
      name: r.name,
      hash_name: r.hash_name,
      sell_listings: r.sell_listings,
      sell_price: r.sell_price,
      sell_price_text: r.sell_price_text,
      asset_description: { icon_url: r.asset_description?.icon_url, name_color: r.asset_description?.name_color, type: r.asset_description?.type }
    }))
  } : d;
  async function cached(key, maxAgeMs, fetch2, keep = (v) => v != null) {
    const hit = await get2(key, maxAgeMs);
    if (hit !== void 0) return hit;
    if (inflight.has(key)) return inflight.get(key);
    const p = (async () => {
      const v = await fetch2();
      if (ttl() > 0 && keep(v)) put(key, v);
      return v;
    })().finally(() => inflight.delete(key));
    inflight.set(key, p);
    return p;
  }
  async function clear() {
    mem.clear();
    const d = await open2();
    if (d) await tx(d, "readwrite", (s) => s.clear());
  }

  // src/core/analysis.js
  function levels(graph2) {
    const out = [];
    let prev = 0;
    for (const [price, cum] of graph2 || []) {
      const qty = cum - prev;
      prev = cum;
      if (qty > 0) out.push({ price, qty });
    }
    return out;
  }
  var QUEUE_MAX = 2e3;
  function competitorSell(sellGraph, mine = {}, minQty = 1, choose = null) {
    const left = { ...mine };
    let cum = 0, first = null;
    const lv = [];
    for (const l of levels(sellGraph)) {
      const own = Math.min(left[l.price] || 0, l.qty);
      left[l.price] = (left[l.price] || 0) - own;
      if (l.qty - own <= 0) continue;
      first ??= l.price;
      if (cum > QUEUE_MAX) break;
      lv.push({ price: l.price, ahead: cum });
      cum += l.qty - own;
      if (!(choose && minQty > 1) && cum >= minQty) return l.price;
    }
    if (choose && minQty > 1 && lv.length) return choose(lv) ?? first;
    return first;
  }
  var realPrice = (p, net4) => {
    while (p > MIN_BUYER && net4(p) === net4(p - 1)) p--;
    return p;
  };
  var priceAbove = (p, net4) => {
    let q = p + 1;
    while (q < p + 20 && net4(q) === net4(q - 1)) q++;
    return q;
  };
  function competitorBuy(buyGraph, myPrice = null, myQty = 0, minQty = 1) {
    let left = myQty, cum = 0, first = null;
    for (const l of levels(buyGraph)) {
      let q = l.qty;
      if (l.price === myPrice && left > 0) {
        const own = Math.min(left, q);
        q -= own;
        left -= own;
      }
      if (q <= 0) continue;
      first ??= l.price;
      cum += q;
      if (cum >= minQty) return l.price;
    }
    return first;
  }
  function relistTarget({ current: current2, competitor, rule, snap = null }) {
    const undercut = rule.undercut ?? 1;
    if (competitor == null) {
      const max = rule.max != null && snap ? snap(rule.max, false) : rule.max;
      if (max != null && rule.raise !== false && current2 < max) return { price: max, reason: L("analysis.noCompetitionMaxPrice") };
      return { price: null, reason: L("analysis.noCompetition") };
    }
    let target = competitor - undercut;
    let reason = L("analysis.lowestCompetitorUndercut");
    if (rule.max != null && target > rule.max) {
      target = rule.max;
      reason = L("analysis.cappedAtTheMaxPrice");
    }
    if (rule.min != null && target < rule.min) {
      target = rule.min;
      reason = L("analysis.raisedToTheMinPrice");
    }
    target = Math.max(MIN_BUYER, target);
    if (snap) {
      target = snap(target, false);
      if (rule.min != null && target < rule.min) target = snap(rule.min, true);
    }
    if (target === current2) return { price: null, reason: L("analysis.priceIsOptimal") };
    if (target > current2 && rule.raise === false) return { price: null, reason: L("analysis.raisingIsOff") };
    return { price: target, reason };
  }
  function buyOrderTarget({ current: current2, myQty, buyGraph, rule, net: net4 = null, minQty = 1 }) {
    const step = rule.step ?? 1;
    const shown3 = net4 ? realPrice(current2, net4) : current2;
    const up = (p) => net4 ? priceAbove(p - 1, net4) : p;
    const comp = competitorBuy(buyGraph, shown3, myQty, minQty);
    if (comp == null) return { price: null, reason: L("analysis.noCompetition") };
    if (comp >= shown3) {
      const t = up(comp + step);
      if (rule.max != null && t > rule.max) return { price: null, reason: L("analysis.outbiddingMax", { t }), outbid: true };
      return { price: t, reason: L("analysis.outbidding") };
    }
    if (rule.lower && up(comp + step) < current2) return { price: up(comp + step), reason: L("analysis.loweringTo2ndPlaceStep") };
    return { price: null, reason: L("analysis.youAreTheHighest") };
  }
  function dealCheck({ price, sellPrice, pub = 0.1, wallet: wallet2 }) {
    const net4 = receivedFromBuyer(sellPrice, pub, wallet2);
    return { net: net4, profit: net4 - price, roi: (net4 - price) / price, breakEven: buyerFromReceived(price, pub, wallet2) };
  }
  function historyStats(points, now = Date.now()) {
    const win = (days) => points.filter((p) => p.t >= now - days * 864e5);
    const wavg = (ps) => {
      const v = ps.reduce((s, p) => s + p.vol, 0);
      return v ? Math.round(ps.reduce((s, p) => s + p.price * p.vol, 0) / v) : null;
    };
    const d1 = win(1), d7 = win(7), d30 = win(30), d90 = win(90);
    const med2 = (ps) => {
      const arr = [...ps].sort((a, b) => a.price - b.price);
      const tot = arr.reduce((s, p) => s + p.vol, 0);
      let acc = 0;
      for (const p of arr) {
        acc += p.vol;
        if (acc >= tot / 2) return p.price;
      }
      return null;
    };
    const avg7 = wavg(d7);
    const avg30 = wavg(d30);
    const avg90 = wavg(d90);
    const prev7 = points.filter((p) => p.t >= now - 14 * 864e5 && p.t < now - 7 * 864e5);
    const pAvg = wavg(prev7);
    const prev30 = points.filter((p) => p.t >= now - 60 * 864e5 && p.t < now - 30 * 864e5);
    const pAvg30 = wavg(prev30);
    return {
      vol24: d1.reduce((s, p) => s + p.vol, 0),
      vol7: d7.reduce((s, p) => s + p.vol, 0),
      avg7,
      avg30,
      med7: med2(d7),
      min7: d7.length ? Math.min(...d7.map((p) => p.price)) : null,
      max7: d7.length ? Math.max(...d7.map((p) => p.price)) : null,
      avg90,
      trend7: avg7 && pAvg ? (avg7 - pAvg) / pAvg : null,
      trend30: avg30 && pAvg30 ? (avg30 - pAvg30) / pAvg30 : null,
      vol30: d30.reduce((s, p) => s + p.vol, 0),
      vol90: d90.reduce((s, p) => s + p.vol, 0)
    };
  }
  function fifoPnL(trades) {
    const lots = /* @__PURE__ */ new Map();
    const items2 = /* @__PURE__ */ new Map();
    const realized = [];
    const sorted = [...trades].sort((a, b) => a.t - b.t);
    const st = (h) => items2.get(h) || items2.set(h, { hash: h, bought: 0, sold: 0, spent: 0, received: 0, realized: 0, matched: 0, holdQty: 0, holdCost: 0, unmatchedSells: 0 }).get(h);
    for (const tr of sorted) {
      const s = st(tr.hash);
      const q = tr.amount || 1;
      if (tr.type === "buy") {
        s.bought += q;
        s.spent += tr.price * q;
        (lots.get(tr.hash) || lots.set(tr.hash, []).get(tr.hash)).push({ qty: q, cost: tr.price, t: tr.t });
      } else {
        s.sold += q;
        s.received += tr.price * q;
        let left = q;
        const ls = lots.get(tr.hash) || [];
        while (left > 0 && ls.length) {
          const lot = ls[0];
          const take = Math.min(lot.qty, left);
          const pnl = (tr.price - lot.cost) * take;
          s.realized += pnl;
          s.matched += take;
          realized.push({ hash: tr.hash, qty: take, buy: lot.cost, sell: tr.price, pnl, held: tr.t - lot.t, t: tr.t });
          lot.qty -= take;
          left -= take;
          if (!lot.qty) ls.shift();
        }
        s.unmatchedSells += left;
      }
    }
    for (const [h, ls] of lots) {
      const s = st(h);
      s.holdQty = ls.reduce((a, l) => a + l.qty, 0);
      s.holdCost = ls.reduce((a, l) => a + l.qty * l.cost, 0);
    }
    const list2 = [...items2.values()];
    return {
      items: list2,
      realized,
      totals: {
        spent: list2.reduce((a, s) => a + s.spent, 0),
        received: list2.reduce((a, s) => a + s.received, 0),
        realized: list2.reduce((a, s) => a + s.realized, 0),
        holdCost: list2.reduce((a, s) => a + s.holdCost, 0),
        trades: sorted.length,
        wins: realized.filter((r) => r.pnl > 0).length,
        losses: realized.filter((r) => r.pnl < 0).length
      }
    };
  }
  function curFromText(s = "") {
    if (/zł/.test(s)) return 6;
    if (/€/.test(s)) return 3;
    if (/£/.test(s)) return 2;
    if (/pуб|руб/i.test(s)) return 5;
    if (/R\$/.test(s)) return 7;
    if (/TL|₺/.test(s)) return 17;
    if (/₴/.test(s)) return 18;
    if (/CDN\$/.test(s)) return 20;
    if (/A\$/.test(s)) return 21;
    if (/¥/.test(s)) return 23;
    if (/\$/.test(s)) return 1;
    return null;
  }
  var MON = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
  function parseMyHistoryHtml(d, parse, now = /* @__PURE__ */ new Date(), dateOf = null) {
    const doc = parse(d.results_html || "");
    const assetOf = {};
    for (const m of String(d.hovers || "").matchAll(/CreateItemHoverFromContainer\(\s*g_rgAssets,\s*'([^']+)_name',\s*(\d+),\s*'(\d+)',\s*'(\d+)'/g)) {
      assetOf[m[1]] = { appid: m[2], contextid: m[3], id: m[4] };
    }
    const out = [];
    let year = now.getFullYear();
    let prevMonth = null;
    for (const row of doc.querySelectorAll('.market_listing_row[id^="history_row_"]')) {
      const sign = row.querySelector(".market_listing_gainorloss")?.textContent.trim();
      if (sign !== "+" && sign !== "-") continue;
      const dates = [...row.querySelectorAll(".market_listing_listed_date")].map((x) => x.textContent.trim()).filter(Boolean);
      const acted = dates[0] || "";
      const dm = acted.match(/(\d{1,2})\s+([A-Za-z]{3})/) || acted.match(/([A-Za-z]{3})\s+(\d{1,2})/);
      const [, listingid, purchaseid] = row.id.match(/^history_row_(\d+)_(\d+)/) || [];
      let t = 0;
      if (dm) {
        const [dd, mon] = /^\d/.test(dm[1]) ? [+dm[1], dm[2]] : [+dm[2], dm[1]];
        const month = MON[mon.toLowerCase()] ?? 0;
        if (prevMonth != null && month > prevMonth) year--;
        if (prevMonth == null && month > now.getMonth()) year--;
        prevMonth = month;
        t = new Date(year, month, dd, 12, 0).getTime();
        if (dateOf) t = dateOf({ listingid, purchaseid, month, day: dd, guess: t }) ?? t;
      }
      const priceEl = row.querySelector(".market_listing_price");
      const priceTxt = priceEl?.textContent.replace(/\s+/g, " ").trim() || "";
      const pending = /pending|oczekuje/i.test(priceTxt);
      const price = parsePriceCents(priceTxt);
      const a = assetOf[row.id] || {};
      const desc = d.assets?.[a.appid]?.[a.contextid]?.[a.id] || {};
      const hash = desc.market_hash_name;
      if (!hash || !(price > 0)) continue;
      const amount = parseInt(desc.amount ?? desc.original_amount, 10) || 1;
      const fl = (desc.asset_properties || []).find((p) => p.propertyid === 2)?.float_value;
      const sd = (desc.asset_properties || []).find((p) => p.propertyid === 1)?.int_value;
      out.push({
        key: row.id.replace("history_row_", ""),
        t,
        type: sign === "+" ? "buy" : "sell",
        hash,
        appid: String(a.appid || 730),
        amount,
        // buys: what you paid; sells: what you received, Steam's history row is already after the fees
        price: Math.round(price / amount),
        pending,
        cur: curFromText(priceTxt),
        name: desc.name,
        icon: desc.icon_url,
        color: desc.name_color,
        assetid: a.id || null,
        float: fl != null ? parseFloat(fl) : null,
        seed: sd != null ? parseInt(sd, 10) : null
      });
    }
    return out;
  }
  function parseQuotes(rows3, currency) {
    const out = /* @__PURE__ */ new Map();
    for (const x of rows3 || []) {
      if (!x?.strHash || x.eCurrency !== currency) continue;
      const low = parsePriceCents(x.strMinSellSubtotal);
      if (low > 0 && Number.isInteger(x.cSellOrders)) out.set(x.strHash, { low, sell: x.cSellOrders });
    }
    return out;
  }
  var BOOK_MAX_AGE = 10 * 6e4;
  var bookStillGood = (h, q, now = Date.now(), maxAge = BOOK_MAX_AGE) => !!h && !!q && now - h.at < maxAge && q.low === h.lowestSell && q.sell === h.sellCount;
  var bookMaxAge = (hash) => {
    let n = 0;
    for (const c of String(hash)) n = (n * 31 + c.charCodeAt(0)) % 1e3;
    return BOOK_MAX_AGE * (0.5 + n / 2e3);
  };
  var savedAskGood = (c, q, now = Date.now(), maxAge = BOOK_MAX_AGE) => !!c?.ask && !!q && c.lowest === q.low && c.sell === q.sell && now - (c.bookAt || 0) < maxAge;
  function parsePriceCents(s) {
    const m = String(s).replace(/\(.*?\)/g, "").match(/[\d][\d\s.,]*/);
    if (!m) return NaN;
    let v = m[0].replace(/\s/g, "");
    const di = Math.max(v.lastIndexOf(","), v.lastIndexOf("."));
    let int2 = v, dec2 = "";
    if (di >= 0 && v.length - di - 1 <= 2) {
      int2 = v.slice(0, di);
      dec2 = v.slice(di + 1);
    }
    return parseInt(int2.replace(/[.,]/g, "") || "0", 10) * 100 + parseInt((dec2 + "00").slice(0, 2), 10);
  }
  function optimalSellPrice({ sellGraph, mine = {}, perDay, maxWaitDays = 2, undercut = 1, cap = null, rule = {} }) {
    if (!(perDay > 0)) return null;
    const left = { ...mine };
    const others = [];
    for (const l of levels(sellGraph)) {
      const own = Math.min(left[l.price] || 0, l.qty);
      left[l.price] = (left[l.price] || 0) - own;
      if (l.qty - own > 0) others.push({ price: l.price, qty: l.qty - own });
    }
    if (!others.length) return null;
    let best = null;
    let ahead = 0;
    for (const l of others) {
      const p = l.price - undercut;
      const wait = (ahead + 1) / perDay;
      if (wait > maxWaitDays) break;
      if (p >= MIN_BUYER && (cap == null || p <= cap)) best = { price: p, waitDays: wait, ahead };
      ahead += l.qty;
    }
    if (!best) best = { price: Math.max(MIN_BUYER, others[0].price - undercut), waitDays: 1 / perDay, ahead: 0 };
    const at = (p) => {
      let a = 0;
      for (const l of others) if (l.price <= p) a += l.qty;
      return { ahead: a, waitDays: (a + 1) / perDay };
    };
    if (rule.max != null && best.price > rule.max) best = { ...best, price: rule.max, ...at(rule.max) };
    if (rule.min != null && best.price < rule.min) best = { ...best, price: rule.min, belowMin: true, ...at(rule.min) };
    return best;
  }
  var LIST_SHARE = 0.6;
  function listAdvice({ sellGraph, highestBuy = null, perDay = null, d7 = null, d30 = null, held = null, net: net4, maxWaitDays = 2, undercut = 1, mine = {} }) {
    const asks = levels(sellGraph);
    if (!asks.length) return null;
    const quick2 = realPrice(Math.max(MIN_BUYER, asks[0].price - undercut), net4);
    const typical2 = d7 ?? d30 ?? null;
    const falling = !!(d7 && d30 && d7 < d30 * 0.9);
    const rate = perDay > 0 ? perDay * LIST_SHARE : null;
    let price = quick2, wait = rate ? 1 / rate : null, ahead = 0;
    if (rate) {
      const cap = [typical2 ? Math.round(typical2 * 1.25) : null, held].filter((x) => x > 0);
      const o = optimalSellPrice({ sellGraph, mine, perDay: rate, maxWaitDays: maxWaitDays * (falling ? 0.5 : 1), undercut, cap: cap.length ? Math.min(...cap) : null });
      if (o && realPrice(o.price, net4) > quick2) {
        price = realPrice(o.price, net4);
        wait = o.waitDays;
        ahead = o.ahead;
      }
    }
    const instant = highestBuy ? { price: highestBuy, net: net4(highestBuy) } : null;
    const gain = instant ? net4(price) - instant.net : null;
    return {
      price,
      net: net4(price),
      wait,
      ahead,
      rate,
      quick: quick2,
      cheapest: asks[0].price,
      instant,
      typical: typical2,
      falling,
      sellNow: instant != null && gain <= Math.max(1, Math.round(instant.net * 0.02)),
      dumped: !!(typical2 && asks[0].price < typical2 * 0.85)
    };
  }
  var WEAR_BOUNDS = [["Factory New", 0, 0.07], ["Minimal Wear", 0.07, 0.15], ["Field-Tested", 0.15, 0.38], ["Well-Worn", 0.38, 0.45], ["Battle-Scarred", 0.45, 1]];
  function floatRank(f, range = null) {
    if (!(f >= 0 && f <= 1)) return null;
    const [min, max] = range || [0, 1];
    const t = WEAR_BOUNDS.find(([, a, b]) => f >= a && f < b) || WEAR_BOUNDS[WEAR_BOUNDS.length - 1];
    const lo = Math.max(t[1], min), hi = Math.min(t[2], max);
    if (!(hi > lo)) return null;
    const lower = Math.max(0, Math.min(1, (f - lo) / (hi - lo)));
    return { wear: t[0], lo, hi, lower, best: lo, super: lower <= 1e-3 ? "low" : lower >= 0.999 ? "high" : null };
  }
  var FILL_K = [0.97, 1, 1.02, 1.04, 1.06, 1.08, 1.1, 1.13, 1.16, 1.2, 1.25, 1.3];
  var FILL_N = [1, 2, 4, 7];
  var FILL_RUN = 5;
  var FILL_RUN_DAY = 0.5;
  var REF_UNITS = 5;
  var horizonOf = (maxWaitDays = 2) => FILL_N.find((x) => x >= maxWaitDays) ?? FILL_N[FILL_N.length - 1];
  var HOUR_MS = 36e5;
  function heldTop(next, run = FILL_RUN) {
    let top = -Infinity;
    for (let i = 0; i < next.length; i++) {
      let u = 0, j = i;
      while (j < next.length && u < run) u += next[j++].vol;
      if (u < run && i > 0) break;
      const m = vwMedian(next.slice(i, j));
      if (m > top) top = m;
    }
    return top;
  }
  function fillTable(points, { minStarts = 24, runDay = FILL_RUN_DAY } = {}) {
    if (!points?.length) return null;
    const end = points[points.length - 1].t;
    const hr = points.filter((p) => p.t > end - 30 * DAY_MS && p.vol > 0);
    if (hr.length < 120) return null;
    const hs = hr.every((p, i) => !i || hr[i - 1].t <= p.t) ? hr : [...hr].sort((a, b) => a.t - b.t);
    const daily = hs.filter((p) => p.t > end - 7 * DAY_MS).reduce((s, p) => s + p.vol, 0) / 7;
    const run = Math.max(FILL_RUN, Math.round(daily * runDay));
    const after = (x) => {
      let lo = 0, hi = hs.length;
      while (lo < hi) {
        const m = lo + hi >> 1;
        if (hs[m].t <= x) lo = m + 1;
        else hi = m;
      }
      return lo;
    };
    const win = (a, b) => hs.slice(after(a), after(b));
    const priceAt = (t) => {
      const j = after(t);
      let i = j, u = 0;
      while (i > 0 && hs[i - 1].t > t - 7 * DAY_MS && (hs[i - 1].t > t - DAY_MS || u < REF_UNITS)) u += hs[--i].vol;
      return u >= REF_UNITS ? vwMedian(hs.slice(i, j)) : null;
    };
    const ref = priceAt(end);
    if (!ref) return null;
    const P = {}, D = {};
    let n = 0;
    const rOf = /* @__PURE__ */ new Map();
    for (const N of FILL_N) {
      const hits = FILL_K.map(() => 0);
      let starts = 0, dsum = 0;
      for (let t = hs[0].t + 7 * DAY_MS; t <= end - N * DAY_MS; t += 3 * HOUR_MS) {
        if (!rOf.has(t)) rOf.set(t, priceAt(t));
        const r = rOf.get(t);
        const next = win(t, t + N * DAY_MS);
        if (!r || !next.length) continue;
        const top = heldTop(next, run) / r;
        FILL_K.forEach((k, i) => {
          if (top >= k) hits[i]++;
        });
        const lastDay = next.filter((p) => p.t > t + (N - 1) * DAY_MS);
        dsum += (vwMedian(lastDay.length ? lastDay : next) || r) / r;
        starts++;
      }
      if (starts < minStarts) continue;
      P[N] = hits.map((h) => Math.round(h / starts * 100) / 100);
      D[N] = Math.round(dsum / starts * 1e3) / 1e3;
      if (N === 2) n = starts;
    }
    return Object.keys(P).length ? { ref, P, D, n, run } : null;
  }
  function anchorTable(table, sellGraph) {
    const lv = levels(sellGraph);
    if (!table || !lv.length) return table;
    let cum = 0, third = lv[lv.length - 1].price;
    for (const l of lv) {
      cum += l.qty;
      if (cum >= 3) {
        third = l.price;
        break;
      }
    }
    const ref = Math.min(third, table.ref);
    return ref === table.ref ? table : { ...table, ref };
  }
  function fillChance(table, N, p) {
    const P = table?.P?.[N];
    if (!P) return null;
    const k = p / table.ref;
    if (k <= FILL_K[0]) return P[0];
    if (k > FILL_K[FILL_K.length - 1]) return 0;
    for (let i = 1; i < FILL_K.length; i++) {
      if (k <= FILL_K[i]) {
        const a = FILL_K[i - 1], b = FILL_K[i];
        return P[i - 1] + (P[i] - P[i - 1]) * (k - a) / (b - a);
      }
    }
    return 0;
  }
  var MIN_CHANCE = 0.5;
  var CHANCE_FIT = 0.92;
  var DUMP_K = 0.95;
  var MARKET_QUEUE_DAYS = 2 / 24;
  function queueChoice({ table, perDay, levels: lv, net: net4, undercut = 1, maxWaitDays = 2, dumpK = DUMP_K }) {
    const N = horizonOf(maxWaitDays);
    if (!table?.P?.[N] || !(perDay > 0) || !lv?.length) return null;
    const x = perDay * N;
    const atLeast = (m) => {
      let term = Math.exp(-x), cdf2 = 0;
      for (let i = 0; i < m; i++) {
        cdf2 += term;
        term *= x / (i + 1);
      }
      return 1 - cdf2;
    };
    const one = atLeast(1);
    const later = net4(Math.round(table.ref * table.D[N]));
    let best = null, prev = null, atMarket = 0;
    for (const l of lv) {
      if (prev && prev.price >= table.ref * dumpK) atMarket += l.ahead - prev.ahead;
      if (atMarket > perDay * MARKET_QUEUE_DAYS) break;
      prev = l;
      const behind = l.ahead ? one > 0 ? atLeast(l.ahead + 1) / one : 0 : 1;
      if (l.ahead && behind < MIN_CHANCE) break;
      const p = realPrice(Math.max(MIN_BUYER, l.price - undercut), net4);
      const c = Math.min(1, (fillChance(table, N, p) ?? 0) * CHANCE_FIT * behind);
      if (l.ahead && c < MIN_CHANCE) continue;
      const ev = c * net4(p) + (1 - c) * later;
      if (!best || ev > best.ev) best = { price: l.price, ev };
    }
    return best ? best.price : null;
  }
  var sellChance = (table, N, p, sellGraph = null) => {
    const c = fillChance(anchorTable(table, sellGraph), N, p);
    return c == null ? null : c * CHANCE_FIT;
  };
  function listAdviceFill({ table: raw, sellGraph, highestBuy = null, net: net4, maxWaitDays = 2, undercut = 1 }) {
    const asks = levels(sellGraph);
    const N = horizonOf(maxWaitDays);
    if (!raw?.P?.[N] || !asks.length) return null;
    const table = anchorTable(raw, sellGraph);
    const ref = table.ref;
    const quick2 = realPrice(Math.max(MIN_BUYER, asks[0].price - undercut), net4);
    const later = net4(Math.round(ref * table.D[N]));
    const floor = highestBuy ? priceAbove(highestBuy, net4) : MIN_BUYER;
    const cands = [.../* @__PURE__ */ new Set([...FILL_K.map((k) => realPrice(Math.round(ref * k), net4)), quick2])].filter((p) => p >= Math.max(MIN_BUYER, floor));
    const opts = cands.map((p) => {
      const c = fillChance(table, N, p) * CHANCE_FIT;
      return { price: p, chance: c, ev: c * net4(p) + (1 - c) * later };
    }).sort((a, b) => a.price - b.price);
    const ok = opts.filter((o) => o.chance >= MIN_CHANCE);
    const pool = ok.length ? ok : opts;
    const instant = highestBuy ? { price: highestBuy, net: net4(highestBuy) } : null;
    let best = pool.length ? pool.reduce((b, o) => o.ev > b.ev + 0.5 ? o : b, pool[0]) : null;
    const instantBest = !!instant && (!best || instant.net >= best.ev);
    if (instantBest) best = { price: instant.price, chance: 1, ev: instant.net };
    if (!best) return null;
    const gain = instant ? best.ev - instant.net : null;
    return {
      method: "fill",
      horizon: N,
      price: best.price,
      net: net4(best.price),
      chance: best.chance,
      ev: best.ev,
      lowChance: !instantBest && !ok.length,
      instantBest,
      options: opts.filter((o) => o.chance >= 0.2),
      quick: quick2,
      cheapest: asks[0].price,
      instant,
      typical: raw.ref,
      starts: table.n,
      falling: table.D[N] < 0.97,
      wait: null,
      rate: null,
      ahead: 0,
      sellNow: instant != null && (instantBest || gain <= Math.max(1, Math.round(instant.net * 0.02))),
      dumped: asks[0].price < raw.ref * 0.85
      // vs the sales: the anchored ref is never far above the cheapest
    };
  }
  var DAY_MS = 864e5;
  var dayIdx = (y, m, d) => Math.floor(Date.UTC(y, m - 1, d) / DAY_MS);
  var medianOf = (a) => {
    if (!a.length) return null;
    const s = [...a].sort((x, y) => x - y);
    return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2;
  };
  var vwMedian = (pts) => {
    if (!pts.length) return null;
    const s = [...pts].sort((a, b) => a.price - b.price);
    const tot = s.reduce((q, p) => q + (p.vol || 1), 0);
    let acc = 0;
    for (const p of s) {
      acc += p.vol || 1;
      if (acc >= tot / 2) return p.price;
    }
    return s[s.length - 1].price;
  };
  function dailyBars(points) {
    const m = /* @__PURE__ */ new Map();
    for (const p of points) {
      const d = Math.floor(p.t / DAY_MS);
      const a = m.get(d);
      if (a) a.push(p);
      else m.set(d, [p]);
    }
    return [...m].sort((a, b) => a[0] - b[0]).map(([d, a]) => ({ d, med: vwMedian(a), v: a.reduce((q, p) => q + (p.vol || 1), 0) }));
  }
  function recentTrend(points) {
    if (!points?.length) return null;
    const bars = dailyBars(points);
    const last = bars[bars.length - 1].d;
    const at = (d) => {
      const w = bars.filter((b) => b.d > d - 30 && b.d <= d);
      return w.length >= 5 ? vwMedian(w.map((b) => ({ price: b.med, vol: b.v }))) : null;
    };
    const now = at(last), m3 = at(last - 91), m6 = at(last - 182);
    if (!now) return null;
    const ch = (x) => x ? Math.round((now / x - 1) * 1e3) / 1e3 : null;
    return { now, m3, m6, t3: ch(m3), t6: ch(m6) };
  }
  function holdStats(points, feeMult2 = 1.15) {
    const bars = dailyBars(points || []);
    if (bars.length < 60) return null;
    const byD = new Map(bars.map((b) => [b.d, b]));
    const avg2 = (a, z) => {
      let s = 0, v = 0;
      for (let k = a; k <= z; k++) {
        const b = byD.get(k);
        if (b) {
          s += b.med * b.v;
          v += b.v;
        }
      }
      return v ? s / v : null;
    };
    const first = bars[0].d, last = bars[bars.length - 1].d;
    const ret = (buy, sell2) => buy && sell2 && buy >= 100 ? sell2 / feeMult2 / buy - 1 : null;
    const sum = (a) => a.length ? { n: a.length, wins: a.filter((x) => x > 0).length, win: a.filter((x) => x > 0).length / a.length, med: medianOf(a) } : null;
    const winters = [];
    for (let y = new Date(first * DAY_MS).getUTCFullYear(); y <= new Date(last * DAY_MS).getUTCFullYear(); y++) {
      const s = dayIdx(y, 11, 22), e = dayIdx(y, 11, 29);
      if (first > s - 365) continue;
      const r = ret(avg2(s, e), avg2(e + 177, e + 187));
      if (r != null) winters.push({ y, r });
    }
    const roll = (n) => {
      const a = [];
      for (let t = first + 180; t + n + 5 <= last; t += 15) {
        const r = ret(avg2(t - 3, t - 1), avg2(t + n - 5, t + n + 5));
        if (r != null) a.push(r);
      }
      return a;
    };
    const cur = avg2(last - 6, last);
    const year = last - first >= 180 ? avg2(last - 364, last) : null;
    const m30 = avg2(last - 36, last - 30);
    const wk = [];
    for (let t = last; t - 7 >= Math.max(first, last - 182); t -= 7) {
      const a = avg2(t - 1, t), b = avg2(t - 8, t - 7);
      if (a && b) wk.push(Math.log(a / b));
    }
    const mu = wk.length ? wk.reduce((s, x) => s + x, 0) / wk.length : 0;
    return {
      ageDays: last - first,
      cur,
      vsYear: cur && year ? cur / year - 1 : null,
      trend30: cur && m30 ? cur / m30 - 1 : null,
      sigmaWeek: wk.length >= 8 ? Math.sqrt(wk.reduce((s, x) => s + (x - mu) ** 2, 0) / wk.length) : null,
      winters,
      winter: sum(winters.map((w) => w.r)),
      y1: sum(roll(365)),
      y2: sum(roll(730))
    };
  }
  function flipCeiling({ buyGraph, sellGraph, net: net4, depth = 50 }) {
    const bids = levels(buyGraph), asks = levels(sellGraph);
    if (!bids.length || !asks.length) return null;
    const deep = (lv) => {
      let c = 0;
      for (const l of lv) {
        c += l.qty;
        if (c >= depth) return l.price;
      }
      return lv[lv.length - 1].price;
    };
    const buy = priceAbove(deep(bids), net4);
    return (net4(Math.max(MIN_BUYER, deep(asks) - 1)) - buy) / buy;
  }
  function buyPlan({ buyGraph, sellGraph, points, net: net4, sell: sell2, from, qty = 1, minRoi = 0.03 }) {
    const got = net4(sell2);
    if (!(got > 0)) return null;
    const roiTop = Math.floor(got / (1 + minRoi));
    if (roiTop < MIN_BUYER) return null;
    const maxZero = realPrice(got, net4), maxRoi = realPrice(roiTop, net4);
    const asks = levels(sellGraph), bids = levels(buyGraph);
    let left = qty, total = 0, top = null, listed2 = 0, cheap = 0;
    for (const l of asks) {
      listed2 += l.qty;
      if (l.price <= maxRoi) cheap += l.qty;
      if (left > 0) {
        const n = Math.min(left, l.qty);
        total += n * l.price;
        left -= n;
        top = l.price;
      }
    }
    const now = left > 0 ? { short: left, listed: listed2 } : { price: top, total, avg: total / qty, profit: got * qty - total, roi: (got * qty - total) / total, listed: listed2 };
    const end = points?.length ? points[points.length - 1].t : 0;
    const d7 = (points || []).filter((p) => p.t > end - 7 * DAY_MS);
    const v7 = d7.reduce((s, p) => s + (p.vol || 0), 0);
    const lo = Math.max(MIN_BUYER, Math.min(from ?? maxRoi, maxRoi));
    const marks = new Set([lo, maxRoi, maxZero].map((p) => realPrice(p, net4)));
    for (let i = 1; i <= 3; i++) marks.add(realPrice(Math.round(lo + (maxRoi - lo) * i / 4), net4));
    const ladder = [...marks].filter((p) => p >= MIN_BUYER).sort((a, b) => a - b).map((price) => {
      const week = d7.filter((p) => p.price <= price).reduce((s, p) => s + (p.vol || 0), 0);
      const ahead = bids.filter((l) => l.price >= price).reduce((s, l) => s + l.qty, 0);
      return { price, profit: got - price, roi: (got - price) / price, week, share: v7 ? week / v7 : 0, ahead, days: week > 0 ? (ahead + qty) / (week / 7) : null };
    });
    return { sell: sell2, got, maxZero, maxRoi, cheap, now, ladder };
  }
  function flipReal({ buyGraph, sellGraph, points, net: net4 }) {
    const bids = levels(buyGraph), asks = levels(sellGraph);
    if (!bids.length || !asks.length || !points?.length) return null;
    const end = points[points.length - 1].t;
    const d1 = points.filter((p) => p.t > end - DAY_MS), d7 = points.filter((p) => p.t > end - 7 * DAY_MS);
    const vol24 = d1.reduce((s, p) => s + (p.vol || 0), 0);
    const need = Math.max(3, Math.ceil(vol24 * 2e-3));
    const deep = (lv) => {
      let c = 0;
      for (const l of lv) {
        c += l.qty;
        if (c >= need) return l.price;
      }
      return lv[lv.length - 1].price;
    };
    const bid = deep(bids), ask2 = deep(asks);
    const sell24 = vwMedian(d1.length ? d1 : d7);
    if (sell24 == null) return null;
    const med7 = vwMedian(d7) ?? sell24;
    const buy = priceAbove(bid, net4);
    const sell2 = Math.max(MIN_BUYER, Math.min(sell24, med7, ask2 - 1));
    const got = net4(sell2);
    const v7 = d7.reduce((s, p) => s + (p.vol || 0), 0);
    const week = d7.filter((p) => p.price <= buy).reduce((s, p) => s + (p.vol || 0), 0);
    return { bid, ask: ask2, buy, sell: sell2, sell24, med7, net: got, profit: got - buy, roi: (got - buy) / buy, week, fill7: v7 ? week / v7 : 0, vol24 };
  }

  // src/core/steam.js
  var NO_ORDERS = () => L("steam.noOrderData");
  var ORIGIN = "https://steamcommunity.com";
  var bus = emitter();
  function scanScripts(re) {
    for (const s of document.scripts) {
      const m = s.textContent && s.textContent.match(re);
      if (m) return m[1];
    }
    return null;
  }
  var _ctx;
  function ctx() {
    if (_ctx) return _ctx;
    const sid = (v) => /^\d{17}$/.test(String(v ?? "")) ? String(v) : null;
    const page = (k) => {
      try {
        return typeof unsafeWindow !== "undefined" ? unsafeWindow[k] : void 0;
      } catch {
        return void 0;
      }
    };
    let steamId = sid(scanScripts(/g_steamID\s*=\s*"(\d{17})"/)) || sid(page("g_steamID"));
    if (!steamId) {
      try {
        steamId = sid(JSON.parse(document.querySelector("#application_config")?.dataset.userinfo || "{}").steamid);
      } catch {
      }
    }
    if (!steamId) {
      const mp = document.querySelector("#global_actions [data-miniprofile]")?.dataset.miniprofile;
      if (/^\d{1,10}$/.test(mp || "")) steamId = (76561197960265728n + BigInt(mp)).toString();
    }
    if (!steamId && document.querySelector("#global_actions .user_avatar, #account_pulldown, #header_wallet_balance")) steamId = sid(get("steamId", null));
    const sessionId = (document.cookie.match(/(?:^|;\s*)sessionid=([^;]+)/) || [])[1] || scanScripts(/g_sessionID\s*=\s*"([^"]+)"/) || page("g_sessionID") || null;
    let wallet2 = null;
    let pw = null;
    try {
      pw = typeof unsafeWindow !== "undefined" && unsafeWindow.g_rgWalletInfo ? JSON.parse(JSON.stringify(unsafeWindow.g_rgWalletInfo)) : null;
    } catch {
    }
    const wj = pw ? JSON.stringify(pw) : scanScripts(/g_rgWalletInfo\s*=\s*(\{[^;]*?\})\s*;/);
    if (wj) {
      try {
        const w = JSON.parse(wj);
        wallet2 = {
          currency: parseInt(w.wallet_currency, 10) || 6,
          country: w.wallet_country || "PL",
          feePercent: parseFloat(w.wallet_fee_percent ?? 0.05),
          feeMin: parseInt(w.wallet_fee_minimum ?? 1, 10),
          feeBase: parseInt(w.wallet_fee_base ?? 0, 10),
          pubDefault: parseFloat(w.wallet_publisher_fee_percent_default ?? 0.1),
          balance: parseInt(w.wallet_balance, 10) || 0
        };
        set("wallet", wallet2);
      } catch {
      }
    }
    wallet2 ||= get("wallet", null) || { ...DEFAULT_WALLET, currency: 6, country: "PL", balance: 0 };
    syncMinBuyer(wallet2);
    if (steamId) set("steamId", steamId);
    _ctx = { steamId: steamId || get("steamId", null), sessionId, wallet: wallet2, walletAt: wj ? Date.now() : 0, loggedIn: !!(steamId && sessionId) };
    return _ctx;
  }
  async function marketListings(appid, hash, { start = 0, count = 100 } = {}) {
    const w = wallet();
    const d = await schedule("page", () => getJSON(`${ORIGIN}/market/listings/${appid}/${encodeURIComponent(hash)}/render/?query=&start=${start}&count=${count}&country=${w.country || "PL"}&language=english&currency=${w.currency}`));
    if (!d?.success) throw new Error(L("steam.steamReturnedNoListings"));
    const props = new Map((Array.isArray(d.asset_properties) ? d.asset_properties : []).map((p) => [String(p.assetid), p.asset_properties || []]));
    const out = [];
    for (const l of Object.values(d.listinginfo || {})) {
      const a = l.asset || {};
      const desc = d.assets?.[a.appid]?.[a.contextid]?.[a.id] || {};
      const pr = props.get(String(a.id)) || a.asset_properties || desc.asset_properties || [];
      const fl = pr.find((p) => p.propertyid === 2)?.float_value;
      const seed = pr.find((p) => p.propertyid === 1)?.int_value;
      const buyer = (l.converted_price ?? l.price ?? 0) + (l.converted_fee ?? l.fee ?? 0);
      if (!(buyer > 0)) continue;
      out.push({ id: String(l.listingid), price: buyer, float: fl != null ? parseFloat(fl) : null, seed: seed != null ? +seed : null });
    }
    return { total: d.total_count || 0, listings: out.sort((x, y) => x.price - y.price) };
  }
  var loginCheck = null;
  function ensureLogin() {
    const c = ctx();
    if (c.loggedIn) return Promise.resolve(true);
    return loginCheck ||= (async () => {
      try {
        const html = await schedule("page", () => getText(`${ORIGIN}/market/`));
        const sid = html.match(/g_steamID\s*=\s*"(\d{17})"/)?.[1];
        const ses = html.match(/g_sessionID\s*=\s*"([^"]+)"/)?.[1];
        if (sid && ses) {
          c.steamId = sid;
          c.sessionId = ses;
          c.loggedIn = true;
          set("steamId", sid);
          const m = html.match(/g_rgWalletInfo\s*=\s*(\{[^;]*?\})\s*;/);
          const b = m ? parseInt(JSON.parse(m[1]).wallet_balance, 10) : NaN;
          if (b >= 0) {
            c.wallet.balance = b;
            c.walletAt = Date.now();
            set("wallet", c.wallet);
          }
          return true;
        }
      } catch {
      }
      loginCheck = null;
      return false;
    })();
  }
  var wallet = () => ctx().wallet;
  async function refreshWallet(maxAgeMs = 6e4) {
    const c = ctx();
    if (Date.now() - c.walletAt < maxAgeMs) return c.wallet;
    const html = await schedule("page", () => getText(`${ORIGIN}/market/`));
    const m = html.match(/g_rgWalletInfo\s*=\s*(\{[^;]*?\})\s*;/);
    const b = m ? parseInt(JSON.parse(m[1]).wallet_balance, 10) : NaN;
    if (!(b >= 0)) throw new Error(L("steam.steamGaveNoWalletBalance"));
    c.wallet.balance = b;
    c.walletAt = Date.now();
    set("wallet", c.wallet);
    return c.wallet;
  }
  function pageFees() {
    try {
      const W = typeof unsafeWindow !== "undefined" ? unsafeWindow : null;
      return W && typeof W.CalculateAmountToSendForDesiredReceivedAmount === "function" && W.g_rgWalletInfo ? W : null;
    } catch {
      return null;
    }
  }
  function buyerFromReceived2(recv, pub = wallet().pubDefault) {
    const W = pageFees();
    if (W) {
      try {
        const r = W.CalculateAmountToSendForDesiredReceivedAmount(recv, pub, W.g_rgWalletInfo);
        const a = parseInt(r?.amount, 10);
        if (a > 0) return a;
      } catch {
      }
    }
    return buyerFromReceived(recv, pub, wallet());
  }
  function receivedFromBuyer2(buyer, pub = wallet().pubDefault) {
    if (!(buyer > 0)) return 0;
    let r = receivedFromBuyer(buyer, pub, wallet());
    while (r > 1 && buyerFromReceived2(r, pub) > buyer) r--;
    while (buyerFromReceived2(r + 1, pub) <= buyer) r++;
    return r;
  }
  function achievable(buyer, pub = wallet().pubDefault, up = false) {
    if (!(buyer > 0)) return buyer;
    const r = receivedFromBuyer2(buyer, pub);
    const p = buyerFromReceived2(r, pub);
    return up && p < buyer ? buyerFromReceived2(r + 1, pub) : p;
  }
  var CURRENCY = { 1: ["$", ""], 2: ["\xA3", ""], 3: ["", "\u20AC"], 5: ["", " p\u0443\u0431."], 6: ["", " z\u0142"], 7: ["R$ ", ""], 17: ["", " TL"], 18: ["", "\u20B4"], 23: ["\xA5 ", ""], 37: ["", " kr"] };
  function fmt(c) {
    if (c == null || isNaN(c)) return "-";
    const [pre, suf] = CURRENCY[wallet().currency] || ["", ""];
    const neg = c < 0 ? "\u2212" : "";
    const v = (Math.abs(c) / 100).toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return neg + pre + v + suf;
  }
  var HttpError = class extends Error {
    constructor(status2, msg) {
      super(msg || `HTTP ${status2}`);
      this.status = status2;
    }
  };
  var LANES = {
    hist: { start: 900, min: 350, max: 8e3 },
    // /market/orderbook (prices, competition)
    price: { start: 3e3, min: 2e3, max: 15e3 },
    // /market/priceoverview (volume), strict
    page: { start: 4e3, min: 3e3, max: 2e4 },
    // legacy listing page
    inv: { start: 2500, min: 1500, max: 2e4 },
    // /inventory, strict
    market: { start: 1200, min: 600, max: 1e4 },
    // mylistings, history, search
    search: { start: 1e3, min: 500, max: 15e3 },
    // /market/search/render (case contents), own lane so a long scan doesn't slow relisting
    quote: { start: 1e3, min: 600, max: 15e3 },
    // /market/actions Search (Steam items, 100 per request), own lane so a scan doesn't hold up a refresh
    write: { fixed: () => settings.delay },
    // remove/sell/order, never adaptive
    ext: { fixed: () => 500 }
    // outside services (NBP exchange rates)
  };
  var lanes = {};
  var LANE_KEY = "lanes";
  var shared = () => get(LANE_KEY, {});
  function saveShared(lane, patch) {
    const all3 = shared();
    all3[lane] = { ...all3[lane] || {}, ...patch };
    set(LANE_KEY, all3);
  }
  var REQ_KEY = "reqStats";
  var reqPend = {};
  var hourOf = (t = Date.now()) => Math.floor(t / 36e5) * 36e5;
  function countReq(key, n = 1) {
    const h = hourOf();
    const b = reqPend[h] ||= {};
    b[key] = (b[key] || 0) + n;
  }
  var endpointOf = (url) => {
    try {
      const p = new URL(url, ORIGIN).pathname;
      if (/^\/inventory\//.test(p)) return "/inventory";
      if (/^\/market\/listings\//.test(p)) return /\/render\/?$/.test(p) ? "/market/listings/\u2026/render" : "/market/listings/\u2026";
      if (/^\/(id|profiles)\//.test(p)) return /inventoryhistory/.test(p) ? "/\u2026/inventoryhistory" : "/\u2026/(profil)";
      return p.replace(/\/\d{5,}(\/|$)/g, "/\u2026$1").replace(/\/$/, "");
    } catch {
      return "?";
    }
  };
  function flushReq() {
    const pend2 = reqPend;
    reqPend = {};
    if (!Object.keys(pend2).length) return;
    try {
      const all3 = get(REQ_KEY, {}) || {};
      for (const [h, b] of Object.entries(pend2)) {
        const t = all3[h] ||= {};
        for (const [k, n] of Object.entries(b)) t[k] = (t[k] || 0) + n;
      }
      const lim = hourOf() - 48 * 36e5;
      for (const h of Object.keys(all3)) if (+h < lim) delete all3[h];
      set(REQ_KEY, all3);
    } catch {
    }
  }
  if (typeof window !== "undefined") {
    setInterval(flushReq, 15e3);
    window.addEventListener("beforeunload", flushReq);
  }
  function requestStats() {
    flushReq();
    const all3 = get(REQ_KEY, {}) || {};
    const now = hourOf(), sum = (from) => {
      const o = {};
      for (const [h, b] of Object.entries(all3)) if (+h >= from) for (const [k, n] of Object.entries(b)) o[k] = (o[k] || 0) + n;
      return o;
    };
    return { hour: sum(now), day: sum(now - 23 * 36e5), since: now };
  }
  function laneStats() {
    const all3 = shared();
    return Object.fromEntries(Object.keys(LANES).filter((k) => !LANES[k].fixed).map((k) => [k, all3[k]?.iv ?? LANES[k].start]));
  }
  function schedule(lane, fn, { retry = true } = {}) {
    const cfg = LANES[lane] || { start: 1e3, min: 500, max: 1e4 };
    const l = lanes[lane] ||= { chain: Promise.resolve(), ok: 0 };
    const interval = () => cfg.fixed ? cfg.fixed() : Math.min(cfg.max, Math.max(cfg.min, shared()[lane]?.iv ?? cfg.start));
    const run = async () => {
      for (let attempt = 0; ; attempt++) {
        for (; ; ) {
          const s = shared()[lane] || {};
          const at = Math.max(s.next || 0, s.pauseUntil || 0);
          const wait = at - Date.now();
          if (wait <= 0) break;
          await sleep(Math.min(wait, 2e3));
        }
        saveShared(lane, { next: Date.now() + interval() });
        countReq("lane:" + lane);
        try {
          const r = await fn();
          if (!cfg.fixed && ++l.ok >= 8) {
            l.ok = 0;
            saveShared(lane, { iv: Math.max(cfg.min, Math.round(interval() * 0.93)), backoff: 0 });
          }
          return r;
        } catch (e) {
          if (e.status === 429) {
            countReq("429:" + lane);
            l.ok = 0;
            const s = shared()[lane] || {};
            const backoff = Math.min((s.backoff || 15e3) * 2, 6e5);
            saveShared(lane, {
              iv: cfg.fixed ? void 0 : Math.min(cfg.max, interval() * 2),
              backoff,
              pauseUntil: Date.now() + backoff
            });
            bus.emit("ratelimit", lane, backoff);
            if (retry && attempt < 3) continue;
          }
          throw e;
        }
      }
    };
    const p = l.chain.then(run, run);
    l.chain = p.catch(() => {
    });
    return p;
  }
  async function getJSON(url) {
    countReq("url:" + endpointOf(url));
    const r = await fetch(url, { credentials: "include" });
    if (!r.ok) throw new HttpError(r.status, r.status === 429 ? L("steam.steamTooManyRequests429") : r.status === 403 ? L("steam.noAccess403PrivateInventory") : void 0);
    const t = await r.text();
    try {
      return JSON.parse(t) ?? {};
    } catch {
      throw new HttpError(r.status, L("steam.invalidResponseFromSteamAre"));
    }
  }
  async function getText(url) {
    countReq("url:" + endpointOf(url));
    const r = await fetch(url, { credentials: "include" });
    if (!r.ok) throw new HttpError(r.status, r.status === 429 ? L("steam.steamTooManyRequests429") : void 0);
    return r.text();
  }
  async function post(url, data3, referrer) {
    countReq("url:" + endpointOf(url));
    const r = await fetch(url, {
      method: "POST",
      credentials: "include",
      referrer: referrer || `${ORIGIN}/market/`,
      headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
      body: new URLSearchParams({ sessionid: ctx().sessionId, ...data3 })
    });
    let json = null;
    try {
      json = await r.json();
    } catch {
    }
    if (r.status === 429) throw new HttpError(429, L("steam.steamTooManyRequests429"));
    return { ok: r.ok, status: r.status, json: json || {} };
  }
  async function myListings() {
    const listings = [];
    let buyOrders = [];
    let toConfirm = 0;
    let pending = [], pendingKnown = false;
    let start = 0;
    let total = Infinity;
    while (start < total) {
      const d = await schedule("market", () => getJSON(`${ORIGIN}/market/mylistings/?norender=1&start=${start}&count=100`));
      if (!d.success) throw new Error(L("steam.couldntLoadListingsAreYou"));
      total = d.total_count || 0;
      if (start === 0) {
        buyOrders = (d.buy_orders || []).map(parseBuyOrder);
        toConfirm = (d.listings_to_confirm || []).length;
        pendingKnown = Array.isArray(d.listings_to_confirm);
        for (const l of d.listings_to_confirm || []) {
          try {
            const p = parseListing(l, d.assets);
            if (p.hash && p.recv > 0) pending.push(p);
          } catch {
          }
        }
      }
      const ls = d.listings || [];
      for (const l of ls) listings.push(parseListing(l, d.assets));
      if (!ls.length) break;
      start += ls.length;
    }
    return { listings, buyOrders, toConfirm, pending, pendingKnown };
  }
  function parseListing(l, assets) {
    const a = l.asset || {};
    const desc = assets?.[a.appid]?.[a.contextid]?.[a.id] || a;
    const recv = l.converted_price || l.price;
    const fee = l.converted_fee || l.fee;
    return {
      listingid: String(l.listingid),
      appid: String(a.appid),
      contextid: String(a.contextid),
      assetid: String(a.id),
      amount: parseInt(a.amount, 10) || parseInt(a.original_amount, 10) || 1,
      hash: desc.market_hash_name || a.market_hash_name,
      name: displayName(desc.market_hash_name || a.market_hash_name, desc.name || desc.market_name),
      color: desc.name_color,
      icon: desc.icon_url,
      recv,
      buyer: recv + fee,
      pub: parseFloat(l.publisher_fee_percent) || wallet().pubDefault,
      created: (l.time_created || 0) * 1e3,
      // full item description (stickers, rarity, float if Steam provides it) for showing it in the inventory view
      item: describeItem(
        { appid: a.appid, contextid: a.contextid, assetid: a.id, classid: desc.classid ?? a.classid, instanceid: desc.instanceid ?? a.instanceid, amount: a.amount || a.original_amount },
        desc,
        a.asset_properties || desc.asset_properties || [],
        ctx().steamId
      )
    };
  }
  function parseBuyOrder(o) {
    const d = o.description || {};
    return {
      id: String(o.buy_orderid),
      appid: String(o.appid),
      hash: o.hash_name,
      name: displayName(o.hash_name, d.name),
      color: d.name_color,
      icon: d.icon_url,
      price: parseInt(o.price, 10),
      // per unit, buyer price (cents)
      qty: parseInt(o.quantity, 10),
      remaining: parseInt(o.quantity_remaining, 10)
    };
  }
  var removeListing = (id) => schedule("write", () => post(`${ORIGIN}/market/removelisting/${id}`, {}));
  var sellItem = ({ appid, contextid, assetid, amount = 1, price }) => schedule(
    "write",
    () => post(`${ORIGIN}/market/sellitem/`, { appid, contextid, assetid, amount: String(amount), price: String(price) }, `${ORIGIN}/profiles/${ctx().steamId}/inventory/`)
  );
  var createBuyOrder = ({ appid, hash, priceEach, qty }) => schedule(
    "write",
    () => post(`${ORIGIN}/market/createbuyorder/`, {
      currency: String(wallet().currency),
      appid: String(appid),
      market_hash_name: hash,
      price_total: String(priceEach * qty),
      quantity: String(qty),
      billing_state: "",
      save_my_address: "0"
    }, `${ORIGIN}/market/listings/${appid}/${encodeURIComponent(hash)}`)
  );
  var cancelBuyOrder = (id) => schedule("write", () => post(`${ORIGIN}/market/cancelbuyorder/`, { buy_orderid: id }));
  function sellResultText(res) {
    const j = res.json || {};
    if (res.ok && j.success) {
      const conf = j.requires_confirmation || j.needs_mobile_confirmation || j.needs_email_confirmation;
      return { ok: true, confirm: !!conf };
    }
    return { ok: false, msg: j.message || `HTTP ${res.status}` };
  }
  var INV_CACHE_KEY = "invcache";
  function cachedInventory(steamId = ctx().steamId, appid = 730, contexts = [2]) {
    const all3 = get(INV_CACHE_KEY, {});
    const main2 = all3[`${steamId}|${appid}|${contexts[0]}`];
    if (!main2?.items) return null;
    const seen = /* @__PURE__ */ new Set(), items2 = [];
    for (const c of contexts) for (const it of all3[`${steamId}|${appid}|${c}`]?.items || []) if (!seen.has(it.assetid)) {
      seen.add(it.assetid);
      items2.push(it);
    }
    return { at: main2.at, items: items2 };
  }
  async function inventory(steamId = ctx().steamId, appid = 730, contextid = 2, { maxAgeMin = 0 } = {}) {
    const key = `${steamId}|${appid}|${contextid}`;
    if (maxAgeMin > 0) {
      const c = get(INV_CACHE_KEY, {})[key];
      if (c && Date.now() - c.at < maxAgeMin * 6e4) return c.items;
    }
    const items2 = await fetchInventory(steamId, appid, contextid);
    rememberProps(items2);
    try {
      const all3 = get(INV_CACHE_KEY, {});
      for (const k of Object.keys(all3)) if (Date.now() - all3[k].at > 36e5) delete all3[k];
      all3[key] = { at: Date.now(), items: items2 };
      set(INV_CACHE_KEY, all3);
    } catch {
    }
    return items2;
  }
  var PROPS_KEY = "assetProps";
  var PROPS_MAX = 8e3;
  var propsMem = null;
  var propsAt = 0;
  var propsAll = () => propsMem && Date.now() - propsAt < 3e4 ? propsMem : (propsAt = Date.now(), propsMem = get(PROPS_KEY, {}));
  function rememberProps(items2) {
    try {
      const m = propsAll();
      let changed = false;
      for (const i of items2) {
        if (i.float == null && !i.nameTag) continue;
        const v = [i.float, i.seed, i.nameTag || null];
        const old = m[i.assetid];
        if (!old || old[0] !== v[0] || old[2] !== v[2]) {
          m[i.assetid] = v;
          changed = true;
        }
      }
      const keys = Object.keys(m);
      if (keys.length > PROPS_MAX) {
        keys.slice(0, keys.length - PROPS_MAX).forEach((k) => delete m[k]);
        changed = true;
      }
      if (changed) set(PROPS_KEY, m);
      propsMem = m;
      propsAt = Date.now();
    } catch {
    }
  }
  function recallProps(item) {
    if (!item || item.float != null && item.nameTag) return item;
    const v = propsAll()[item.assetid];
    if (!v) return item;
    return { ...item, float: item.float ?? v[0], seed: item.seed ?? v[1], nameTag: item.nameTag || v[2] };
  }
  function uiLanguage() {
    try {
      if (typeof unsafeWindow !== "undefined" && unsafeWindow.g_strLanguage) return unsafeWindow.g_strLanguage;
    } catch {
    }
    const c = document.cookie.match(/(?:^|;\s*)Steam_Language=([^;]+)/)?.[1];
    if (c) return c;
    return /^pl/i.test(document.documentElement.lang || "") ? "polish" : "english";
  }
  async function fetchInventory(steamId, appid, contextid) {
    const items2 = [];
    let last = null;
    let more = true;
    let guard = 0;
    const SIZES = [2e3, 1e3, 500, 200, 75];
    let si = Math.max(0, SIZES.indexOf(get("invPage", 2e3)));
    while (more && guard++ < 200) {
      let d, tries = 0;
      for (; ; ) {
        const url = `${ORIGIN}/inventory/${steamId}/${appid}/${contextid}?l=english&count=${SIZES[si]}${last ? `&start_assetid=${last}` : ""}`;
        try {
          d = await schedule("inv", () => getJSON(url));
          break;
        } catch (e) {
          if (e.status !== 500 && e.status !== 400 && e.status !== 502 && e.status !== 503) throw e;
          if (si < SIZES.length - 1) {
            si++;
            set("invPage", SIZES[si]);
            console.warn(`[Flipster] ekwipunek: Steam ${e.status}, zmniejszam stron\u0119 do ${SIZES[si]}`);
            continue;
          }
          if (++tries > 2) throw new HttpError(e.status, L("steam.steamIsntReturningTheInventory", { status: e.status }));
          await sleep(3e3 * tries);
        }
      }
      items2.push(...parseInventory(d, steamId));
      more = !!d.more_items;
      last = d.last_assetid;
    }
    return items2;
  }
  function parseInventory(d, steamId) {
    const descs = new Map((d.descriptions || []).map((x) => [x.classid + "_" + x.instanceid, x]));
    const props = new Map((d.asset_properties || []).map((p) => [String(p.assetid), p.asset_properties || []]));
    return (d.assets || []).map((a) => describeItem(a, descs.get(a.classid + "_" + a.instanceid) || {}, props.get(String(a.assetid)) || [], steamId));
  }
  function describeItem(a, ds, pr = [], steamId = "") {
    const prop = (id) => pr.find((p) => p.propertyid === id);
    const fl = prop(2)?.float_value;
    const seed = prop(1)?.int_value;
    const html = (ds.descriptions || []).map((x) => x.value || "").join("\n");
    const stickers = [...html.matchAll(/<img[^>]*src="([^"]+)"[^>]*title="(Sticker|Patch|Charm): ([^"]+)"/g)].map((m) => ({ img: m[1], kind: m[2], name: m[3] }));
    const wear = (ds.descriptions || []).find((x) => x.name === "exterior_wear")?.value?.replace("Exterior: ", "");
    const tag = (cat) => (ds.tags || []).find((t) => t.category === cat);
    let inspect = (ds.actions || []).find((x) => /preview/.test(x.link))?.link;
    if (inspect) {
      inspect = inspect.replace("%owner_steamid%", steamId).replace("%assetid%", a.assetid).replace(/%propid:(\d+)%/g, (_, id) => pr.find((p) => p.propertyid === +id)?.string_value || "");
    }
    const lock = (ds.owner_descriptions || []).map((x) => x.value).join(" ");
    const ntRaw = (ds.fraudwarnings || []).find((x) => /Name ?Tag|Nazwa/i.test(x));
    const ntProp = pr.find((p) => p.string_value && p.propertyid !== 6 && /name|tag|nazw/i.test(p.name || ""));
    const nameTag = ntRaw ? ntRaw.replace(/^.*?(Name ?Tag|Nazwa[^:]*):\s*/i, "").replace(/^''|''$/g, "").replace(/^"|"$/g, "").trim() : ntProp ? String(ntProp.string_value).trim() : null;
    return {
      appid: String(a.appid),
      contextid: String(a.contextid),
      assetid: String(a.assetid),
      classid: a.classid,
      instanceid: a.instanceid,
      amount: parseInt(a.amount, 10) || 1,
      hash: ds.market_hash_name,
      name: displayName(ds.market_hash_name, ds.name),
      color: ds.name_color,
      rarityColor: tag("Rarity")?.color,
      rarity: tag("Rarity")?.internal_name || null,
      // Rarity_Default = stock (default) item
      itemType: tag("Type")?.internal_name || null,
      // CSGO_Type_Collectible (coins, medals, pins), CSGO_Type_MusicKit…
      type: ds.type,
      icon: ds.icon_url,
      marketable: !!ds.marketable,
      tradable: !!ds.tradable,
      commodity: !!ds.commodity,
      float: fl != null ? parseFloat(fl) : null,
      seed: seed != null ? parseInt(seed, 10) : null,
      wear,
      stickers,
      nameTag,
      // 2025+ inventory: listed items stay in the inventory "sealed" (sealed_type 1); other sealed = trade protection
      sealed: Number(ds.sealed_type) === 1 ? "listed" : ds.sealed ? "protected" : null,
      inspect,
      lock: /after|Tradable|Marketable|protected/i.test(lock) ? lock.replace(/<[^>]+>/g, "") : ds.sealed && Number(ds.sealed_type) !== 1 ? "Ochrona handlu (trade protection)" : ""
    };
  }
  async function priceOverview(appid, hash, currency = wallet().currency) {
    const d = await schedule(
      "price",
      () => getJSON(`${ORIGIN}/market/priceoverview/?appid=${appid}&currency=${currency}&market_hash_name=${encodeURIComponent(hash)}`)
    );
    if (!d.success) throw new Error(L("steam.noPriceData"));
    return {
      lowest: parsePrice(d.lowest_price),
      median: parsePrice(d.median_price),
      volume: parseInt(String(d.volume || "0").replace(/\D/g, ""), 10) || 0
    };
  }
  var nameIds = bucket("nameids");
  async function nameId(appid, hash) {
    const key = appid + "|" + hash;
    const cached3 = nameIds.get(key);
    if (cached3) return cached3;
    const html = await schedule("page", () => getText(`${ORIGIN}/market/listings/${appid}/${encodeURIComponent(hash)}`));
    const m = html.match(/Market_LoadOrderSpread\(\s*(\d+)\s*\)/) || html.match(/item_?name_?id["']?\s*[:=]\s*["']?(\d+)/i);
    if (!m) throw new Error(L("steam.couldntLoadBuyOrdersNew"));
    nameIds.set(key, m[1]);
    return m[1];
  }
  var graph = (g) => (g || []).map((x) => [Math.round(x[0] * 100), parseInt(x[1], 10)]);
  var int = (s) => parseInt(String(s ?? "").replace(/\D/g, ""), 10) || 0;
  function compactToGraph(arr) {
    const out = [];
    let cum = 0;
    for (let i = 0; i + 1 < (arr || []).length; i += 2) {
      cum += arr[i + 1];
      out.push([arr[i], cum]);
    }
    return out;
  }
  async function orderBook(appid, hash) {
    const url = `${ORIGIN}/market/orderbook?q=Load&qp=${encodeURIComponent(JSON.stringify([Number(appid), hash]))}`;
    const d = await schedule("hist", async () => {
      const r = await fetch(url, { credentials: "include", headers: { "x-valve-action-type": "queryAction" } });
      if (r.status === 429) throw new HttpError(429, L("steam.steamTooManyRequests429"));
      if (!r.ok) throw new HttpError(r.status);
      return r.json();
    });
    const b = d?.data?.success ? d.data.data : null;
    if (!b) throw new Error(NO_ORDERS());
    return parseOrderBook(b);
  }
  function parseOrderBook(b) {
    return {
      highestBuy: b.amtMaxBuyOrder || null,
      lowestSell: b.amtMinSellOrder || null,
      buyGraph: compactToGraph(b.rgCompactBuyOrders),
      sellGraph: compactToGraph(b.rgCompactSellOrders),
      buyCount: b.cBuyOrders || 0,
      sellCount: b.cSellOrders || 0,
      currency: b.eCurrency,
      at: Date.now()
    };
  }
  var QUOTE_GAMES = 40;
  var QUOTE_PAGES = 20;
  async function steamItemQuotes(hashes, isCancelled = () => false) {
    const out = /* @__PURE__ */ new Map(), left = new Set(hashes.filter((h) => /^\d+-/.test(h)));
    const gameOf = (h) => h.slice(0, h.indexOf("-"));
    if (Date.now() < (shared().quote?.pauseUntil || 0)) return out;
    const currency = wallet().currency;
    const ask2 = (q) => schedule("quote", async () => {
      countReq("url:/market/actions");
      const r = await fetch(`${ORIGIN}/market/actions?q=Search&qp=${encodeURIComponent(JSON.stringify([q]))}`, { credentials: "include", headers: { "x-valve-action-type": "queryAction" } });
      if (r.status === 429) throw new HttpError(429, L("steam.steamTooManyRequests429"));
      if (!r.ok) throw new HttpError(r.status);
      return (await r.json())?.data;
    }, { retry: false });
    try {
      for (const itemClass of [["item_class_2"], null]) {
        const games = [...new Set([...left].map(gameOf))];
        for (let i = 0; i < games.length; i += QUOTE_GAMES) {
          const part = new Set(games.slice(i, i + QUOTE_GAMES));
          const filters = { Game: [...part].map((g) => `app_${g}`), ...itemClass ? { item_class: itemClass } : {} };
          for (let start = 0, total = Infinity, pages2 = 0; start < total && pages2 < QUOTE_PAGES; pages2++) {
            if (isCancelled() || ![...left].some((h) => part.has(gameOf(h)))) break;
            const d = await ask2({ appid: 753, strQuery: "", start, count: 100, filters });
            const rows3 = d?.results || [];
            if (!rows3.length) break;
            if (rows3[0].eCurrency !== currency) return out;
            for (const [h, q] of parseQuotes(rows3, currency)) if (left.delete(h)) out.set(h, q);
            total = d.total_count || 0;
            start += rows3.length;
          }
        }
        if (!left.size) break;
      }
    } catch (e) {
      console.warn("[Flipster] quick price check failed, using order books", e);
    }
    return out;
  }
  var orderBookBroken = false;
  var histWarned = false;
  async function histogram(appid, hash) {
    if (!orderBookBroken) {
      for (let attempt = 0; ; attempt++) {
        try {
          return await orderBook(appid, hash);
        } catch (e) {
          if (e.status === 429) throw e;
          if (e.status === 404) {
            orderBookBroken = true;
            break;
          }
          if (e.message === NO_ORDERS()) throw new Error(L("steam.noOrderDataCheckThe", { hash }));
          if (e.status >= 500 && attempt === 0) {
            await sleep(1500);
            continue;
          }
          if (!histWarned) {
            histWarned = true;
            console.warn("[Flipster] orderbook failed, trying legacy histogram", e);
          }
          break;
        }
      }
    }
    return legacyHistogram(appid, hash);
  }
  async function legacyHistogram(appid, hash) {
    const id = await nameId(appid, hash);
    const w = wallet();
    const d = await schedule(
      "hist",
      () => getJSON(`${ORIGIN}/market/itemordershistogram?country=${w.country || "PL"}&language=english&currency=${w.currency}&item_nameid=${id}&two_factor=0`)
    );
    if (!d.success) throw new Error(NO_ORDERS());
    return {
      highestBuy: d.highest_buy_order ? parseInt(d.highest_buy_order, 10) : null,
      lowestSell: d.lowest_sell_order ? parseInt(d.lowest_sell_order, 10) : null,
      buyGraph: graph(d.buy_order_graph),
      sellGraph: graph(d.sell_order_graph),
      buyCount: int(d.buy_order_count),
      sellCount: int(d.sell_order_count),
      at: Date.now()
    };
  }
  var priceHistory = (appid, hash, { remember = false, force = false } = {}) => cached(`ph|${appid}|${hash}`, force ? 0 : ttl(), () => fetchPriceHistory(appid, hash), (v) => remember && v?.length > 0);
  async function fetchPriceHistory(appid, hash) {
    let d;
    try {
      d = await schedule("market", () => getJSON(`${ORIGIN}/market/pricehistory/?appid=${appid}&market_hash_name=${encodeURIComponent(hash)}`));
    } catch (e) {
      if (e.status === 429) throw e;
      d = null;
    }
    if (!d?.success) {
      const url = `${ORIGIN}/market/actions?q=QueryPriceHistory&qp=${encodeURIComponent(JSON.stringify([Number(appid), hash]))}`;
      const r = await schedule("market", () => fetch(url, { credentials: "include", headers: { "x-valve-action-type": "queryAction" } }).then((x) => x.json()));
      const inner = r?.data?.data ?? r?.data;
      d = { success: true, prices: Array.isArray(inner) ? inner : inner?.prices || [] };
    }
    if (!d.prices?.length) throw new Error(L("steam.noPriceHistory"));
    return (d.prices || []).map((p) => Array.isArray(p) ? { t: Date.parse(String(p[0]).replace(/: \+0$/, ":00 +0000")), price: Math.round(p[1] * 100), vol: parseInt(p[2], 10) || 0 } : { t: p.time * 1e3, price: Math.round(p.price_median * 100), vol: parseInt(p.purchases, 10) || 0 });
  }
  var myHistoryPage = (start, count = 500) => schedule("market", () => getJSON(`${ORIGIN}/market/myhistory/render/?query=&start=${start}&count=${count}&norender=1`));
  var myHistoryHtmlPage = (start, count = 100) => schedule("market", () => getJSON(`${ORIGIN}/market/myhistory/render/?query=&start=${start}&count=${count}&l=english`));
  function gmJSON(url) {
    return new Promise((resolve, reject) => {
      if (typeof GM_xmlhttpRequest !== "function") return reject(new Error(L("steam.gmXmlhttprequestUnavailable")));
      GM_xmlhttpRequest({
        method: "GET",
        url,
        headers: { Accept: "application/json" },
        timeout: 3e4,
        onload: (r) => {
          if (r.status === 429) return reject(new HttpError(429, L("steam.externalServiceRequestLimitTry")));
          if (r.status >= 400) return reject(new HttpError(r.status));
          try {
            resolve(JSON.parse(r.responseText));
          } catch {
            reject(new Error(L("steam.invalidResponse")));
          }
        },
        onerror: () => reject(new Error(L("steam.networkError"))),
        ontimeout: () => reject(new Error("Timeout"))
      });
    });
  }

  // src/core/prices.js
  var cache = bucket("prices");
  function cached2(appid, hash) {
    return cache.get(appid + "|" + hash) || null;
  }
  function fresh(appid, hash, maxAgeMin = settings.cacheMin) {
    const c = cached2(appid, hash);
    return c && Date.now() - c.at < maxAgeMin * 6e4 ? c : null;
  }
  async function steamPrice(appid, hash, { force = false } = {}) {
    if (!force) {
      const f = fresh(appid, hash);
      if (f) return f;
    }
    const p = await priceOverview(appid, hash);
    const v = { ...p, at: Date.now(), lowAt: Date.now() };
    cache.set(appid + "|" + hash, v);
    return v;
  }
  function hasLowest(appid, hash, maxAgeMin) {
    const c = cached2(appid, hash);
    return !!c && c.lowAt != null && Date.now() - c.lowAt < maxAgeMin * 6e4;
  }
  async function lowestPrices(list2, { onEach, isCancelled, force = false, maxAgeMin = 360 } = {}) {
    const seen = /* @__PURE__ */ new Set();
    const todo = list2.filter(({ appid, hash }) => {
      const k = appid + "|" + hash;
      if (!hash || seen.has(k)) return false;
      seen.add(k);
      return force || !hasLowest(appid, hash, maxAgeMin) || !cached2(appid, hash)?.ask;
    });
    let done = 0, queue = todo;
    const steamItems = todo.filter((x) => String(x.appid) === "753");
    if (steamItems.length >= 4) {
      const quotes = await steamItemQuotes(steamItems.map((x) => x.hash), isCancelled);
      const now = Date.now(), maxBook = force ? BOOK_MAX_AGE : 24 * 36e5;
      queue = todo.filter(({ appid, hash }) => {
        const q = String(appid) === "753" ? quotes.get(hash) : null;
        if (!q) return true;
        const c = cached2(appid, hash);
        const same = savedAskGood(c, q, now, maxBook);
        cache.set(appid + "|" + hash, { median: null, volume: null, at: 0, ...c, lowest: q.low, lowAt: now });
        onEach?.(hash, q.low, null, same ? ++done : done, todo.length);
        return !same;
      });
    }
    for (const { appid, hash } of queue) {
      if (isCancelled?.()) break;
      try {
        const h = await hist(appid, hash, force ? 0 : 6e4);
        onEach?.(hash, h.lowestSell, null, ++done, todo.length);
      } catch (e) {
        if (e.status === 400 || e.status === 404 || /brak danych o zleceniach|nie udało się pobrać zleceń|no order data|couldn't load buy orders/.test(e.message || "")) {
          const k = appid + "|" + hash;
          const old = cached2(appid, hash);
          cache.set(k, { median: null, volume: null, at: 0, ...old, lowest: old?.lowest ?? null, lowAt: Date.now(), ask: old?.ask ?? [] });
        }
        onEach?.(hash, null, e, ++done, todo.length);
        if (e.status === 429) break;
      }
    }
    return todo.length;
  }
  function pruneCache(days = 14) {
    const all3 = cache.all();
    const lim = Date.now() - days * 864e5;
    let n = 0;
    for (const k of Object.keys(all3)) if (Math.max(all3[k].at || 0, all3[k].lowAt || 0) < lim) {
      delete all3[k];
      n++;
    }
    if (n) cache.replace(all3);
  }
  var hcache = /* @__PURE__ */ new Map();
  async function hist(appid, hash, maxAgeMs = 6e4) {
    const k = appid + "|" + hash;
    const c = hcache.get(k);
    if (c && Date.now() - c.at < maxAgeMs) return c;
    if (inflight2.has(k)) return inflight2.get(k);
    const p = (async () => {
      const d = await get2("ob|" + k, Math.min(maxAgeMs, ttl()));
      if (d) {
        hcache.set(k, d);
        return d;
      }
      return fetchHist(appid, hash, k);
    })().finally(() => inflight2.delete(k));
    inflight2.set(k, p);
    return p;
  }
  async function peekHist(appid, hash, maxAgeMs) {
    const k = appid + "|" + hash;
    const c = hcache.get(k);
    if (c && Date.now() - c.at < maxAgeMs) return c;
    const d = await get2("ob|" + k, Math.min(maxAgeMs, ttl()));
    if (d) hcache.set(k, d);
    return d || null;
  }
  var inflight2 = /* @__PURE__ */ new Map();
  async function fetchHist(appid, hash, k) {
    const h = await histogram(appid, hash);
    hcache.set(k, h);
    if (ttl() > 0) put("ob|" + k, h);
    const old = cached2(appid, hash);
    cache.set(k, { median: null, volume: null, at: 0, ...old, lowest: h.lowestSell ?? old?.lowest ?? null, lowAt: Date.now(), ask: h.sellGraph?.slice(0, 25) || null, bid: h.highestBuy ?? null, sell: h.sellCount ?? null, bookAt: h.at });
    return h;
  }

  // src/core/jobs.js
  var chain = Promise.resolve();
  function withLock(name, fn) {
    const p = chain.then(() => fn());
    chain = p.catch(() => {
    });
    return p;
  }
  function token() {
    let c = false;
    return { cancel: () => c = true, get cancelled() {
      return c;
    } };
  }
  var TAB_ID = Math.random().toString(36).slice(2);
  var STALE = 45e3;
  var leader = false;
  function isLeader() {
    return leader;
  }
  function startLeaderElection(onChange) {
    const tick2 = () => {
      const cur = get("leader", null);
      const now = Date.now();
      const mine = cur?.id === TAB_ID;
      if (!cur || mine || now - cur.at > STALE) {
        set("leader", { id: TAB_ID, at: now });
        if (!leader) {
          leader = true;
          onChange?.(true);
        }
      } else if (leader) {
        leader = false;
        onChange?.(false);
      }
    };
    tick2();
    setInterval(tick2, 15e3);
    window.addEventListener("beforeunload", () => {
      if (leader) set("leader", null);
    });
  }
  function every(name, minutes, enabled, fn, onState) {
    let next = Date.now() + 15e3;
    let runningNow = false;
    const loop = async () => {
      for (; ; ) {
        await sleep(5e3);
        onState?.({ next, running: runningNow, enabled: enabled(), leader });
        if (!enabled() || !leader || runningNow) continue;
        if (Date.now() < next) continue;
        runningNow = true;
        try {
          await fn();
        } catch (e) {
          console.error("[Flipster]", name, e);
        }
        runningNow = false;
        next = Date.now() + Math.max(1, minutes()) * 6e4;
      }
    };
    loop();
    return {
      runNow() {
        next = 0;
      },
      reschedule() {
        next = Date.now() + Math.max(1, minutes()) * 6e4;
      },
      get next() {
        return next;
      }
    };
  }

  // src/features/relist-engine.js
  function resolveAsset(it, before, after, used) {
    const free = (id, a, need) => a.sealed !== "listed" && a.amount - (used.get(id) || 0) >= need;
    const a0 = after.get(it.assetid);
    if (a0 && free(it.assetid, a0, it.amount)) return it.assetid;
    for (const [id, a] of after) if (!before.has(id) && a.hash === it.hash && free(id, a, it.amount)) return id;
    for (const [id, a] of after) if (a.hash === it.hash && a.amount > 1 && free(id, a, it.amount)) return id;
    return null;
  }
  var invMap = async (appid, contextid) => new Map((await inventory(void 0, appid, contextid)).map((i) => [i.assetid, i]));
  async function relist(jobs, hooks = {}) {
    const { onStatus = () => {
    }, log: log2 = () => {
    }, isCancelled = () => false } = hooks;
    const res = { ok: 0, failed: 0, confirm: 0, waiting: [] };
    const groups2 = /* @__PURE__ */ new Map();
    for (const j of jobs) {
      const k = j.listing.appid + "_" + j.listing.contextid;
      (groups2.get(k) || groups2.set(k, []).get(k)).push(j);
    }
    for (const [k, list2] of groups2) {
      const [appid, contextid] = k.split("_");
      if (isCancelled()) break;
      log2(L("relist-engine.inventorySnapshot", { appid, contextid }));
      const before = await invMap(appid, contextid);
      const removed = [];
      for (const j of list2) {
        if (isCancelled()) {
          onStatus(j.listing, "anulowano", "warn");
          continue;
        }
        onStatus(j.listing, L("relist-engine.removing"));
        const r = await removeListing(j.listing.listingid);
        if (r.ok) {
          removed.push(j);
          onStatus(j.listing, L("relist-engine.removedWaitingForTheInventory"));
        } else {
          res.failed++;
          onStatus(j.listing, L("relist-engine.removingFailedHttp", { status: r.status }), "err");
          log2(L("relist-engine.couldntRemoveHttp", { hash: j.listing.hash, status: r.status }), "err");
        }
      }
      if (!removed.length) continue;
      const resolved = /* @__PURE__ */ new Map();
      const used = /* @__PURE__ */ new Map();
      let pending = removed;
      for (let attempt = 0; attempt < 5 && pending.length; attempt++) {
        await sleep(2e3 + attempt * 2500);
        const after = await invMap(appid, contextid);
        const still = [];
        for (const j of pending) {
          const id = resolveAsset(j.listing, before, after, used);
          if (id) {
            resolved.set(j, id);
            used.set(id, (used.get(id) || 0) + j.listing.amount);
          } else still.push(j);
        }
        pending = still;
        if (pending.length) log2(L("relist-engine.waitingForItemsToCome", { pending: pending.length }), "warn");
      }
      for (const j of pending) {
        res.failed++;
        onStatus(j.listing, L("relist-engine.notFoundInTheInventory"), "err");
        log2(L("relist-engine.removedButNotFoundIn", { hash: j.listing.hash }), "err");
      }
      for (const [j, assetid] of resolved) {
        const price = receivedFromBuyer2(j.price, j.listing.pub);
        onStatus(j.listing, L("relist-engine.listing"));
        const r = sellResultText(await sellItem({ appid, contextid, assetid, amount: j.listing.amount, price }));
        const shown3 = fmt(buyerFromReceived2(price, j.listing.pub));
        if (r.ok) {
          res.ok++;
          if (r.confirm) {
            res.confirm++;
            res.waiting.push({ listing: j.listing, recv: price, buyer: buyerFromReceived2(price, j.listing.pub) });
          }
          onStatus(j.listing, L("relist-engine.listedFor", { shown: shown3, confirm: r.confirm ? L("relist-engine.confirmInTheApp") : "" }), "ok");
          log2(`${j.listing.hash}: ${fmt(j.listing.buyer)} \u2192 ${shown3}${r.confirm ? L("relist-engine.toConfirm") : ""}`, "ok");
        } else {
          res.failed++;
          onStatus(j.listing, L("relist-engine.listingFailedTheItemIs", { msg: r.msg }), "err");
          log2(L("relist-engine.listingFailedTheItemIs2", { hash: j.listing.hash, msg: r.msg }), "err");
        }
      }
    }
    return res;
  }
  async function sellMany(jobs, hooks = {}) {
    const { onStatus = () => {
    }, log: log2 = () => {
    }, isCancelled = () => false } = hooks;
    const res = { ok: 0, failed: 0, confirm: 0 };
    for (const j of jobs) {
      if (isCancelled()) break;
      const pub = wallet().pubDefault;
      const price = receivedFromBuyer2(j.price, pub);
      onStatus(j.item, L("relist-engine.listing"));
      const r = sellResultText(await sellItem({ appid: j.item.appid, contextid: j.item.contextid, assetid: j.item.assetid, amount: j.amount || j.item.amount, price }));
      const shown3 = fmt(buyerFromReceived2(price, pub));
      if (r.ok) {
        res.ok++;
        if (r.confirm) res.confirm++;
        onStatus(j.item, L("relist-engine.listedFor2", { shown: shown3 }), "ok");
        log2(L("relist-engine.listedYouGetTheBuyer", { hash: j.item.hash, price: fmt(price), shown: shown3, confirm: r.confirm ? L("relist-engine.confirmInTheSteamApp") : "" }), "ok");
      } else {
        res.failed++;
        onStatus(j.item, r.msg, "err");
        log2(`${j.item.hash}: ${r.msg}`, "err");
      }
    }
    return res;
  }

  // src/features/invhistory.js
  var keyOf = (app2) => +app2 === 730 ? "invhist" : `invhist${+app2}`;
  var MAX = 3e4;
  var mems = /* @__PURE__ */ new Map();
  var data = (app2 = 730) => {
    let m = mems.get(app2);
    if (!m || Date.now() - m.at > 3e4) {
      let v = get(keyOf(app2), { events: [] });
      if (v.fmt) {
        v = { ...v, events: (v.events || []).filter((e) => !/#\d+$/.test(e.id)) };
        delete v.fmt;
        set(keyOf(app2), v);
      }
      m = { v, at: Date.now() };
      mems.set(app2, m);
    }
    return m.v;
  };
  var kinded = /* @__PURE__ */ new Map();
  var eventsOf = (app2) => {
    const ev = data(app2).events || [];
    if (kinded.get(app2) !== ev) {
      for (const e of ev) {
        e.kind = kind(e.desc);
        e.app = +app2;
      }
      kinded.set(app2, ev);
    }
    return ev;
  };
  var all = () => eventsOf(730);
  function allOf(apps = []) {
    const cs = new Set(all().map((e) => e.id));
    return apps.filter((a) => +a !== 730).flatMap((a) => eventsOf(+a)).filter((e) => !cs.has(e.id));
  }
  var syncedAt = (app2 = 730) => data(app2).syncedAt || 0;
  var MONTHS2 = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
  function parseDate(dateTxt = "", timeTxt = "") {
    const m = dateTxt.match(/(\d{1,2})\s+([A-Za-z]{3})[a-z]*,?\s+(\d{4})/) || dateTxt.match(/([A-Za-z]{3})[a-z]*\s+(\d{1,2}),?\s+(\d{4})/);
    if (!m) return Date.parse(`${dateTxt} ${timeTxt}`) || 0;
    const [d, mon, y] = /^\d/.test(m[1]) ? [m[1], m[2], m[3]] : [m[2], m[1], m[3]];
    let h = 0, min = 0;
    const t = timeTxt.match(/(\d{1,2}):(\d{2})\s*(am|pm)?/i);
    if (t) {
      h = +t[1] % 12 + (t[3]?.toLowerCase() === "pm" ? 12 : 0);
      if (!t[3]) h = +t[1];
      min = +t[2];
    }
    return new Date(+y, MONTHS2[mon.toLowerCase()] ?? 0, +d, h, min).getTime();
  }
  function kind(desc = "") {
    if (/(sticker|patch)\s+(applied|removed|scraped)|appl(y|ied)\s+(a\s+)?(sticker|patch)/i.test(desc)) return "naklejka";
    if (/trade.?up|contract/i.test(desc)) return "kontrakt";
    if (/traded with|trade/i.test(desc)) return "wymiana";
    if (/market/i.test(desc)) return "rynek";
    if (/unlock|opened|container|case|unsealed/i.test(desc)) return "skrzynia";
    if (/gift|received|earned|drop|reward|purchased|store/i.test(desc)) return "otrzymane";
    return "inne";
  }
  function parsePage(d) {
    const doc = new DOMParser().parseFromString(d.html || "", "text/html");
    const descs = d.descriptions || {};
    const out = [];
    for (const row of doc.querySelectorAll(".tradehistoryrow")) {
      const dateEl = row.querySelector(".tradehistory_date");
      const timeTxt = dateEl?.querySelector(".tradehistory_timestamp")?.textContent.trim() || "";
      const dateTxt = (dateEl?.textContent || "").replace(timeTxt, "").trim();
      const t = parseDate(dateTxt, timeTxt);
      const descEl = row.querySelector(".tradehistory_event_description");
      const desc = descEl?.textContent.replace(/\s+/g, " ").trim() || "";
      const pa = descEl?.querySelector('a[href*="steamcommunity.com/id/"], a[href*="steamcommunity.com/profiles/"]');
      const partner = pa ? { name: pa.textContent.trim(), href: pa.href || pa.getAttribute("href") } : null;
      const links = [...row.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")).filter((h) => /trade|receipt/i.test(h) && !/profiles|\/id\//.test(h));
      const plus = [], minus = [];
      for (const grp of row.querySelectorAll(".tradehistory_items")) {
        const sign = grp.querySelector(".tradehistory_items_plusminus")?.textContent.trim();
        const items2 = [...grp.querySelectorAll(".history_item")].map((h) => {
          const ds = descs[h.dataset.appid]?.[`${h.dataset.classid}_${h.dataset.instanceid}`] || {};
          return {
            hash: ds.market_hash_name || null,
            name: ds.name || h.querySelector(".history_item_name")?.textContent.trim() || "?",
            color: ds.name_color || null,
            icon: ds.icon_url || null
          };
        });
        (sign === "-" || sign === "\u2212" ? minus : plus).push(...items2);
      }
      const first = (minus[0] || plus[0])?.name || "";
      out.push({ id: `${t}|${desc}|${minus.length}|${plus.length}|${first}`, t, desc, kind: kind(desc), plus, minus, partner, links });
    }
    return out;
  }
  async function fetchPage(cursor, app2 = 730) {
    const c = ctx();
    let url = `${ORIGIN}/profiles/${c.steamId}/inventoryhistory/?ajax=1&l=english&sessionid=${c.sessionId}&app%5B%5D=${app2}`;
    if (cursor) url += `&cursor%5Btime%5D=${cursor.time}&cursor%5Btime_frac%5D=${cursor.time_frac}&cursor%5Bs%5D=${cursor.s}`;
    const d = await schedule("inv", async () => {
      const r = await fetch(url, { credentials: "include" });
      if (r.status === 429) throw new HttpError(429, L("invhistory.steamTooManyRequests429"));
      if (!r.ok) throw new HttpError(r.status);
      return r.json();
    });
    if (!d || d.success === false) throw new Error(d?.error || L("invhistory.steamReturnedNoInventoryHistory"));
    return d;
  }
  async function sync({ full = false, isCancelled = () => false, onProgress = () => {
  }, app: app2 = 730 } = {}) {
    const saved = get(keyOf(app2), { events: [] });
    mems.delete(app2);
    const known = new Set(full ? [] : saved.events.map((e) => e.id));
    const complete = !full && saved.complete;
    const fresh3 = [];
    let cursor = null;
    let pages2 = 0;
    let tail = full ? null : saved.tail || null;
    let reachedEnd = false;
    let jumped = false;
    for (; ; ) {
      if (isCancelled()) break;
      const d = await fetchPage(cursor, app2);
      const evs = parsePage(d);
      pages2++;
      let hitKnown = false;
      for (const e of evs) {
        if (known.has(e.id)) {
          hitKnown = true;
          continue;
        }
        fresh3.push(e);
      }
      if (!d.cursor || !evs.length) reachedEnd = true;
      if (!complete && (jumped || !saved.tail)) tail = d.cursor || null;
      save(fresh3, saved.events, { tail, complete: reachedEnd }, app2);
      onProgress(fresh3.length, pages2, oldestT(app2));
      if (reachedEnd) break;
      if (hitKnown && !jumped) {
        if (complete) break;
        if (saved.tail) {
          cursor = saved.tail;
          jumped = true;
          continue;
        }
      }
      cursor = d.cursor;
    }
    save(fresh3, saved.events, { tail, complete: reachedEnd || complete, done: true }, app2);
    return fresh3.length;
  }
  function save(fresh3, old, { tail, complete, done = false }, app2 = 730) {
    const seen = /* @__PURE__ */ new Set();
    const events = [...fresh3, ...old].filter((e) => !seen.has(e.id) && seen.add(e.id)).sort((a, b) => b.t - a.t).slice(0, MAX);
    const v = { events, tail: complete ? null : tail, complete: !!complete, syncedAt: done ? Date.now() : data(app2).syncedAt || Date.now() };
    set(keyOf(app2), v);
    mems.set(app2, { v, at: Date.now() });
  }
  var oldestT = (app2 = 730) => {
    const ev = eventsOf(app2);
    return ev.length ? ev[ev.length - 1].t : null;
  };
  var isComplete = (app2 = 730) => !!data(app2).complete;
  var oldest = oldestT;
  function fateOf(hash) {
    const e = all().find((x) => x.minus.some((i) => i.hash === hash));
    if (!e) return null;
    return { ...e, gotFor: e.plus };
  }
  var ownerCache = /* @__PURE__ */ new Map();
  async function steamIdOf(href) {
    const m = href.match(/\/profiles\/(\d{17})/);
    if (m) return m[1];
    const v = href.match(/\/id\/([^/?#]+)/);
    if (!v) return null;
    const xml = await schedule("page", () => fetch(`${ORIGIN}/id/${v[1]}/?xml=1`, { credentials: "include" }).then((r) => r.text()));
    return xml.match(/<steamID64>(\d{17})<\/steamID64>/)?.[1] || null;
  }
  var ownerState = (href, hash) => ownerCache.get(href + "|" + hash) || null;
  async function checkOwner(href, hash) {
    const key = href + "|" + hash;
    ownerCache.set(key, { state: "checking" });
    try {
      const id = await steamIdOf(href);
      if (!id) throw new Error(L("invhistory.profileNotRecognised"));
      const inv2 = await inventory(id, 730, 2, { maxAgeMin: 60 });
      const n = inv2.filter((i) => i.hash === hash).length;
      ownerCache.set(key, { state: n ? "has" : "no", n, at: Date.now() });
    } catch (e) {
      ownerCache.set(key, { state: e.status === 403 ? "private" : "error", msg: e.message, at: Date.now() });
    }
    return ownerCache.get(key);
  }

  // src/features/storehist.js
  var KEY = "storeHist";
  var URL0 = "https://store.steampowered.com/account/history/?l=english";
  function gmReq(opts) {
    return new Promise((resolve, reject) => {
      if (typeof GM_xmlhttpRequest !== "function") return reject(new Error(L("storehist.gmXmlhttprequestUnavailable")));
      GM_xmlhttpRequest({
        timeout: 3e4,
        ...opts,
        onload: (r) => r.status >= 400 ? reject(new HttpError(r.status)) : resolve(r),
        onerror: () => reject(new Error(L("storehist.networkError"))),
        ontimeout: () => reject(new Error("Timeout"))
      });
    });
  }
  var MON2 = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
  function parseDay(s) {
    const m = s.match(/(\d{1,2})\s+([A-Za-z]{3})[a-z]*,?\s+(\d{4})/) || s.match(/([A-Za-z]{3})[a-z]*\s+(\d{1,2}),?\s+(\d{4})/);
    if (!m) return null;
    const [d, mo, y] = /\d/.test(m[1]) ? [m[1], m[2], m[3]] : [m[2], m[1], m[3]];
    const mi = MON2[mo.toLowerCase()];
    return mi == null ? null : new Date(+y, mi, +d, 12).getTime();
  }
  function parseRows(html) {
    const doc = new DOMParser().parseFromString(`<table>${html}</table>`, "text/html");
    const out = [];
    for (const r of doc.querySelectorAll(".wallet_table_row")) {
      const txt = (sel2) => r.querySelector(sel2)?.textContent.replace(/\s+/g, " ").trim() || "";
      const t = parseDay(txt(".wht_date"));
      const itemsEl = r.querySelector(".wht_items");
      const lines = itemsEl ? [...itemsEl.querySelectorAll("div, a")].map((x) => x.textContent.replace(/\s+/g, " ").trim()).filter(Boolean) : [];
      const items2 = txt(".wht_items");
      const type = txt(".wht_type");
      const totalTxt = txt(".wht_total");
      const total = parsePrice(totalTxt.replace(/[^\d.,-]/g, ""));
      const cur = /zł|pln/i.test(totalTxt) ? "PLN" : /€|eur/i.test(totalTxt) ? "EUR" : /\$|usd/i.test(totalTxt) ? "USD" : /£/.test(totalTxt) ? "GBP" : null;
      if (!t || isNaN(total)) continue;
      out.push({ id: `${t}|${items2}|${type}|${total}`, t, items: items2, lines, type, total, cur, refund: /refund/i.test(type) });
    }
    return out;
  }
  async function sync2({ onProgress = () => {
  } } = {}) {
    const r = await gmReq({ method: "GET", url: URL0 });
    const html = r.responseText;
    if (!/wallet_history_table|wallet_table_row/.test(html)) throw new Error(L("storehist.iCantSeeThePurchase"));
    const sessionid = html.match(/g_sessionID\s*=\s*"([^"]+)"/)?.[1];
    let rows3 = parseRows(html.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/)?.[1] || html);
    let cursor = (() => {
      try {
        return JSON.parse(html.match(/g_historyCursor\s*=\s*(\{[^;]*\})/)?.[1] || "null");
      } catch {
        return null;
      }
    })();
    let pages2 = 1;
    while (cursor && sessionid && pages2 < 60) {
      const body2 = new URLSearchParams({ sessionid, l: "english" });
      for (const [k, v] of Object.entries(cursor)) body2.set(`cursor[${k}]`, v);
      const res = await gmReq({ method: "POST", url: "https://store.steampowered.com/account/AjaxLoadMoreHistory/?l=english", headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" }, data: body2.toString() });
      let d;
      try {
        d = JSON.parse(res.responseText);
      } catch {
        break;
      }
      if (!d?.html) break;
      rows3.push(...parseRows(d.html));
      cursor = d.cursor || null;
      pages2++;
      onProgress(rows3.length);
    }
    const uniq = [...new Map(rows3.map((x) => [x.id, x])).values()];
    set(KEY, { at: Date.now(), rows: uniq });
    mem2 = null;
    return uniq;
  }
  var isCS = (x) => /counter-strike/i.test(x.items) && /in-game|purchase|w grze|zakup/i.test(x.type) && !x.refund;
  var mem2 = null;
  var memAt = 0;
  var data2 = () => mem2 && Date.now() - memAt < 3e4 ? mem2 : (memAt = Date.now(), mem2 = get(KEY, { rows: [], at: 0 }));
  var all2 = () => data2().rows || [];
  var syncedAt2 = () => data2().at || 0;
  function onDay(ts) {
    const d = new Date(ts);
    d.setHours(12, 0, 0, 0);
    return all2().filter((x) => isCS(x) && Math.abs(x.t - d.getTime()) <= 864e5 + 1);
  }
  var sameDay = (a, b) => new Date(a).toDateString() === new Date(b).toDateString();
  var nearKey = (x, expect) => expect && x.total >= expect * 0.8 && x.total <= expect * 1.2;
  var isKeyRow = (x) => /\bkeys?\b|klucz/i.test(x.items);
  var amountOf = (x, conv) => conv ? conv(x.total, x.cur, x.t) : x.total;
  function keyPaid(ts, used, expect, conv = null) {
    const amt = (x) => amountOf(x, conv);
    const day2 = onDay(ts).filter((x) => !used.has(x.id) && amt(x) != null);
    const order = (a, b) => sameDay(b.t, ts) - sameDay(a.t, ts) || Math.abs(a.t - ts) - Math.abs(b.t - ts);
    const named = day2.filter(isKeyRow).sort(order)[0];
    if (named) {
      const qty = Number(named.items.match(/(\d+)\s*x\b/i)?.[1]) || (expect ? Math.max(1, Math.round(amt(named) / expect)) : 1);
      if (qty <= 1) used.add(named.id);
      return { price: Math.round(amt(named) / qty), row: named, how: "nazwa" };
    }
    if (!expect) return null;
    const near = (x) => amt(x) >= expect * 0.8 && amt(x) <= expect * 1.2;
    const single = day2.filter(near).sort(order)[0];
    if (single) {
      used.add(single.id);
      return { price: amt(single), row: single, how: "kwota" };
    }
    const multi = day2.find((x) => {
      const q = Math.round(amt(x) / expect);
      return q >= 2 && q <= 20 && Math.abs(amt(x) / q - expect) <= expect * 0.2;
    });
    if (multi) return { price: Math.round(amt(multi) / Math.round(amt(multi) / expect)), row: multi, how: "kwota" };
    return null;
  }
  function keyPurchases(expectAt) {
    return all2().filter((x) => isCS(x) && (isKeyRow(x) || expectAt && nearKey(x, expectAt(x.t)))).map((x) => {
      const e = expectAt?.(x.t);
      const qty = Number(x.items.match(/(\d+)\s*x\b/i)?.[1]) || (e ? Math.max(1, Math.round(x.total / e)) : 1);
      return { t: x.t, price: Math.round(x.total / qty), cur: x.cur };
    });
  }
  function nearestKeyPrice(ts, walletCur, expectAt) {
    const list2 = keyPurchases(expectAt).filter((k) => !walletCur || !k.cur || k.cur === walletCur);
    if (!list2.length) return null;
    return list2.sort((a, b) => Math.abs(a.t - ts) - Math.abs(b.t - ts))[0];
  }
  function terminalPaid(ts, itemName, used, keyExpect2, conv = null) {
    const cands = onDay(ts).filter((x) => !isKeyRow(x) && !used.has(x.id) && amountOf(x, conv) != null);
    const [weapon, skin] = (itemName || "").toLowerCase().split("|").map((p) => p.trim());
    const has = (x, w) => w && x.items.toLowerCase().includes(w);
    const byName = cands.find((x) => has(x, skin) && has(x, weapon)) || cands.find((x) => has(x, weapon + " |"));
    const keyish = (x) => !!keyExpect2 && amountOf(x, conv) >= keyExpect2 * 0.8 && amountOf(x, conv) <= keyExpect2 * 1.2;
    const order = (a, b) => keyish(a) - keyish(b) || sameDay(b.t, ts) - sameDay(a.t, ts) || Math.abs(a.t - ts) - Math.abs(b.t - ts);
    const pick2 = byName || cands.sort(order)[0];
    if (!pick2) return null;
    used.add(pick2.id);
    return { price: amountOf(pick2, conv), row: pick2 };
  }
  function itemPaid(ts, name, conv = null) {
    const n = String(name || "").toLowerCase().replace(/\s*\([^)]*\)\s*$/, "").trim();
    if (!n) return null;
    const d = new Date(ts);
    d.setHours(12, 0, 0, 0);
    const row = all2().filter((x) => !x.refund && Math.abs(x.t - d.getTime()) <= 864e5 + 1 && x.items.toLowerCase().includes(n) && amountOf(x, conv) != null).sort((a, b) => Math.abs(a.t - ts) - Math.abs(b.t - ts))[0];
    if (!row) return null;
    const qty = Number(row.items.match(/(\d+)\s*x\b/i)?.[1]) || 1;
    return { price: Math.round(amountOf(row, conv) / qty), row };
  }
  async function ensure(onDone) {
    if (Date.now() - syncedAt2() < 36e5) return;
    try {
      const rows3 = await sync2();
      log(L("storehist.steamPurchaseHistoryEntriesCs2", { rows: rows3.length, isCS: rows3.filter(isCS).length }), "ok");
      onDone?.();
    } catch (e) {
      set(KEY, { ...get(KEY, { rows: [] }), at: Date.now() - 3e6 });
      mem2 = null;
      log(L("storehist.steamPurchaseHistory") + e.message, "warn");
    }
  }

  // src/features/casedb.js
  var BASE = "https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/";
  var KEY2 = "caseDB";
  var WEEK = 7 * 864e5;
  var RARITY_TIER = { rarity_rare_weapon: "mil", rarity_mythical_weapon: "res", rarity_legendary_weapon: "cla", rarity_ancient_weapon: "cov" };
  function getJSON2(url) {
    return new Promise((resolve, reject) => {
      if (typeof GM_xmlhttpRequest !== "function") return reject(new Error(L("casedb.gmXmlhttprequestUnavailable")));
      GM_xmlhttpRequest({
        method: "GET",
        url,
        timeout: 9e4,
        onload: (r) => {
          if (r.status >= 400) return reject(new Error(`HTTP ${r.status}`));
          try {
            resolve(JSON.parse(r.responseText));
          } catch {
            reject(new Error(L("casedb.badResponse")));
          }
        },
        onerror: () => reject(new Error(L("casedb.networkErrorAddConnectRaw"))),
        ontimeout: () => reject(new Error("timeout"))
      });
    });
  }
  var mem3 = null;
  async function load() {
    if (mem3 && mem3.v === 3 && Date.now() - mem3.at < WEEK) return mem3;
    const saved = get(KEY2, null);
    if (saved && saved.v === 3 && Date.now() - saved.at < WEEK) return mem3 = saved;
    try {
      const [crates, skins] = await Promise.all([getJSON2(BASE + "crates.json"), getJSON2(BASE + "skins.json")]);
      const cases2 = {};
      const caps = {};
      const CAP_TIER = { rarity_rare: "mil", rarity_mythical: "res", rarity_legendary: "cla", rarity_ancient: "cov" };
      for (const c of crates) {
        if (!/^(Sticker|Autograph|Patch) Capsule$/.test(c.type || "") || !c.market_hash_name) continue;
        const items2 = (c.contains || []).map((i) => [i.name, CAP_TIER[i.rarity?.id]]).filter((x) => x[0] && x[1]);
        if (items2.length) caps[c.market_hash_name] = { kind: c.type === "Patch Capsule" ? "Patch" : "Sticker", items: items2 };
      }
      const need = /* @__PURE__ */ new Set();
      for (const c of crates) {
        if (c.type !== "Case" || !c.market_hash_name) continue;
        const items2 = (c.contains || []).map((i) => [i.name, RARITY_TIER[i.rarity?.id]]).filter((x) => x[1]);
        const rare = [...new Set((c.contains_rare || []).map((i) => i.name))];
        cases2[c.market_hash_name] = { items: items2, rare };
        items2.forEach((x) => need.add(x[0]));
        rare.forEach((n) => need.add(n));
      }
      const floats = {};
      for (const s of skins) if (s.name && s.min_float != null) floats[s.name] = [s.min_float, s.max_float];
      mem3 = { v: 3, at: Date.now(), cases: cases2, caps, floats };
      set(KEY2, mem3);
      return mem3;
    } catch (e) {
      if (saved) return mem3 = saved;
      throw new Error(L("casedb.caseContentsData") + e.message);
    }
  }
  var TIERS = [["Factory New", 0, 0.07, 0.03], ["Minimal Wear", 0.07, 0.15, 0.24], ["Field-Tested", 0.15, 0.38, 0.33], ["Well-Worn", 0.38, 0.45, 0.24], ["Battle-Scarred", 0.45, 1, 0.16]];
  function cdf(x) {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let acc = 0;
    for (const [, a, b, p] of TIERS) {
      if (x >= b) {
        acc += p;
        continue;
      }
      return acc + p * (x - a) / (b - a);
    }
    return 1;
  }
  function floatRange(db, hash = "") {
    const base = hash.replace(/^(★\s*)?(StatTrak™\s*|Souvenir\s*)?/, (m, star) => star || "").replace(/\s*\((Factory New|Minimal Wear|Field-Tested|Well-Worn|Battle-Scarred)\)\s*$/, "").trim();
    return db?.floats?.[base] || db?.floats?.[base.replace(/^★\s*/, "")] || db?.floats?.["\u2605 " + base.replace(/^★\s*/, "")] || null;
  }
  function wearProbs([min, max] = [0, 1]) {
    const out = {};
    const span = max - min || 1e-9;
    for (const [name, a, b] of TIERS) {
      const p = cdf((Math.min(b, max) - min) / span) - cdf((Math.max(a, min) - min) / span);
      if (p > 1e-6 && b > min && a < max) out[name] = p;
    }
    return out;
  }

  // src/core/sample.js
  var KINDS = {
    skin: L("sample.skins"),
    knife: L("sample.knivesAndGloves"),
    container: L("sample.casesCapsulesTerminals"),
    sticker: L("sample.stickers"),
    other: L("sample.other")
  };
  var BANDS = [25, 100, 500, 2500, 1e4];
  var WEARS = /\((Factory New|Minimal Wear|Field-Tested|Well-Worn|Battle-Scarred)\)$/;
  function kindOf(hash = "", type = "") {
    if (hash.startsWith("\u2605")) return "knife";
    if (/container/i.test(type) || !type && /\b(Case|Capsule|Terminal|Package)( \d+)?$/.test(hash)) return "container";
    if (/^Sticker \|/.test(hash)) return "sticker";
    if (hash.includes(" | ") && WEARS.test(hash)) return "skin";
    return "other";
  }
  var bandOf = (usd) => BANDS.findIndex((b) => usd < b) === -1 ? BANDS.length : BANDS.findIndex((b) => usd < b);
  var rng = (seed) => () => {
    seed |= 0;
    seed = seed + 1831565813 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
  function stratify(pool, n, seed = 1) {
    const rnd = rng(seed);
    const shuffled = (a) => {
      const b = [...a];
      for (let i = b.length - 1; i > 0; i--) {
        const j = Math.floor(rnd() * (i + 1));
        [b[i], b[j]] = [b[j], b[i]];
      }
      return b;
    };
    const cells = /* @__PURE__ */ new Map();
    for (const x of shuffled(pool)) {
      const k = x.kind + "|" + x.band;
      (cells.get(k) || cells.set(k, []).get(k)).push(x);
    }
    const per = Math.ceil(n / Math.max(1, cells.size));
    const out = [], left = [];
    for (const a of cells.values()) {
      out.push(...a.slice(0, per));
      left.push(...a.slice(per));
    }
    if (out.length > n) return shuffled(out).slice(0, n);
    return [...out, ...shuffled(left).slice(0, n - out.length)];
  }

  // src/features/research.js
  var running = null;
  var cancelResearch = () => running?.cancel();
  async function exportResearch(list2, where, { onBusy = () => {
  } } = {}) {
    if (running) return log(L("research.dataForAnalysisThePrevious"), "warn");
    const items2 = [...new Map(list2.filter((x) => x?.hash).map((x) => [`${+(x.appid || 730)}|${x.hash}`, { hash: x.hash, appid: +(x.appid || 730) }])).values()];
    if (!items2.length) return log(L("research.dataForAnalysisThereAre"), "warn");
    if (!await ask(L("research.collectDataForAnalysis"), L("research.illDownloadTheOrderBook", { items: items2.length, where, min: Math.max(1, Math.ceil(items2.length / 40)) }), { ok: L("research.collectData") })) return;
    const tk = running = token();
    onBusy(true);
    const w = wallet();
    const out = { at: Date.now(), currency: w.currency, fees: { feePercent: w.feePercent, feeMin: w.feeMin, feeBase: w.feeBase, pub: w.pubDefault }, items: [] };
    let i = 0, failed = 0;
    log(L("research.dataForAnalysisDownloadingItems", { items: items2.length }));
    try {
      for (const { hash, appid } of items2) {
        if (tk.cancelled) break;
        progress(++i, items2.length);
        try {
          const [h, hist3] = await Promise.all([
            hist(appid, hash, 10 * 6e4).catch((e) => {
              if (e.status === 429) throw e;
              return null;
            }),
            priceHistory(appid, hash).catch((e) => {
              if (e.status === 429) throw e;
              return null;
            })
          ]);
          if (!hist3) {
            failed++;
            continue;
          }
          out.items.push({
            hash,
            appid,
            book: h ? { hb: h.highestBuy, ls: h.lowestSell, bc: h.buyCount, sc: h.sellCount, bg: (h.buyGraph || []).slice(0, 80), sg: (h.sellGraph || []).slice(0, 80) } : null,
            prices: hist3.map((p) => [Math.round(p.t / 1e3), p.price, p.vol])
          });
        } catch (e) {
          if (e.status === 429) {
            log(L("research.dataForAnalysisSteamIs"), "warn");
            break;
          }
          failed++;
        }
      }
    } finally {
      progress(0);
      running = null;
      onBusy(false);
    }
    if (!out.items.length) return log(L("research.dataForAnalysisNothingWas"), "err");
    downloadText("flipster-dane-do-analizy.json", JSON.stringify(out), "application/json");
    log(L("research.dataForAnalysisSavedItems", { items: out.items.length, failed: failed ? L("research.withoutPriceHistory", { failed }) : "" }), "ok");
  }
  var sleep2 = (ms) => new Promise((r) => setTimeout(r, ms));
  async function patient(fn, tk, what) {
    for (let i = 0; ; i++) {
      try {
        return await fn();
      } catch (e) {
        if (e.status !== 429 || i >= 3 || tk.cancelled) throw e;
        log(L("research.marketSampleSteamIsLimiting", { what }), "warn");
        for (let s = 0; s < 120 && !tk.cancelled; s++) await sleep2(1e3);
      }
    }
  }
  async function exportMarketSample({ onBusy = () => {
  } } = {}) {
    if (running) return log(L("research.dataForAnalysisThePrevious"), "warn");
    const n = await ask(L("research.marketSampleForAnalysis"), L("research.firstIllGoThroughA", { KINDS: Object.values(KINDS).join(", ") }), { ok: L("research.downloadSample"), collect: (m) => +m.querySelector("#ms-n").value || 400 });
    if (!n) return;
    const tk = running = token();
    onBusy(true);
    const w = wallet();
    const out = { at: Date.now(), kind: "market-sample", currency: w.currency, fees: { feePercent: w.feePercent, feeMin: w.feeMin, feeBase: w.feeBase, pub: w.pubDefault }, items: [] };
    try {
      const pool = [];
      const POOL = 3e3;
      let logged = 0;
      for (let start = 0, empties = 0; start < POOL && !tk.cancelled; ) {
        const d = await patient(() => schedule("search", async () => {
          const r = await fetch(`${ORIGIN}/market/search/render/?norender=1&appid=730&l=english&start=${start}&count=100&search_descriptions=0&sort_column=popular&sort_dir=desc`, { credentials: "include" });
          if (r.status === 429) throw new HttpError(429, L("research.steamTooManyRequests429"));
          return r.ok ? r.json() : null;
        }), tk, "lista");
        const res = d?.results || [];
        if (!res.length) {
          if (++empties > 3) break;
          await sleep2(empties * 1e4);
          continue;
        }
        empties = 0;
        for (const r of res) if (r.hash_name && r.sell_price > 0) pool.push({ hash: r.hash_name, kind: kindOf(r.hash_name, r.asset_description?.type), band: bandOf(r.sell_price), usd: r.sell_price, listings: r.sell_listings });
        start += res.length;
        progress(Math.min(start, POOL), POOL);
        if (pool.length - logged >= 500) {
          logged = pool.length;
          log(L("research.marketSamplePopularList", { pool: pool.length }));
        }
        if (d?.total_count && start >= d.total_count) break;
      }
      if (tk.cancelled) return log(L("research.marketSampleStoppedBeforeDownloading"), "warn");
      const today = /* @__PURE__ */ new Date();
      const pick2 = stratify([...new Map(pool.map((x) => [x.hash, x])).values()], n, today.getFullYear() * 1e4 + (today.getMonth() + 1) * 100 + today.getDate());
      const byKind = Object.fromEntries(Object.keys(KINDS).map((k) => [k, pick2.filter((x) => x.kind === k).length]));
      log(L("research.marketSampleDrewOfPopular", { pick: pick2.length, pool: pool.length, byKind: Object.entries(byKind).map(([k, c]) => `${KINDS[k]} ${c}`).join(", ") }));
      let i = 0, failed = 0;
      for (const x of pick2) {
        if (tk.cancelled) break;
        progress(++i, pick2.length);
        try {
          const [h, hist3] = await Promise.all([
            patient(() => hist(730, x.hash, 10 * 6e4), tk, L("research.orderBooks")).catch((e) => {
              if (e.status === 429) throw e;
              return null;
            }),
            patient(() => priceHistory(730, x.hash), tk, L("research.priceHistories")).catch((e) => {
              if (e.status === 429) throw e;
              return null;
            })
          ]);
          if (!hist3) {
            failed++;
            continue;
          }
          out.items.push({
            hash: x.hash,
            appid: 730,
            kind: x.kind,
            band: x.band,
            usd: x.usd,
            listings: x.listings,
            book: h ? { hb: h.highestBuy, ls: h.lowestSell, bc: h.buyCount, sc: h.sellCount, bg: (h.buyGraph || []).slice(0, 80), sg: (h.sellGraph || []).slice(0, 80) } : null,
            prices: hist3.map((p) => [Math.round(p.t / 1e3), p.price, p.vol])
          });
        } catch (e) {
          if (e.status === 429) {
            log(L("research.marketSampleSteamKeepsLimiting"), "warn");
            break;
          }
          failed++;
        }
        if (i % 50 === 0) log(L("research.marketSample", { i, pick: pick2.length }));
      }
    } finally {
      progress(0);
      running = null;
      onBusy(false);
    }
    if (!out.items.length) return log(L("research.marketSampleNothingWasDownloaded"), "err");
    downloadText("flipster-probka-rynku.json", JSON.stringify(out), "application/json");
    log(L("research.marketSampleSavedItemsTo", { items: out.items.length }), "ok");
  }

  // src/core/patterns.js
  var STARTER = [
    {
      skin: "AK-47 | Case Hardened",
      what: "Blue gem",
      src: "csdb.gg",
      tiers: [
        { label: L("patterns.661ScarTheBest"), level: "top", seeds: [661] },
        { label: "Tier 1", level: "high", seeds: [387, 321, 670, 955, 168] }
      ]
    },
    {
      skin: "Five-SeveN | Case Hardened",
      what: "Blue gem",
      src: "csdb.gg",
      tiers: [
        { label: L("patterns.top"), level: "top", seeds: [278, 690, 648] },
        { label: "Tier 1", level: "high", seeds: [872, 363] }
      ]
    },
    {
      // picture patterns: at some seeds the Kami artwork lands as a recognisable shape (the famous one is #909)
      skin: "Five-SeveN | Kami",
      what: "Kami",
      src: "skinscanner.gg, cyberquira.com",
      tiers: [
        { label: L("patterns.909PSyTheBest"), level: "top", seeds: [909] },
        { label: L("patterns.tier1SameMotif"), level: "high", seeds: [590, 662] },
        { label: L("patterns.togepi"), level: "mid", seeds: [906] },
        { label: L("patterns.owlEyes"), level: "mid", seeds: [403] },
        { label: L("patterns.angryMerchant"), level: "mid", seeds: [376] },
        { label: L("patterns.happyBird"), level: "mid", seeds: [537] },
        { label: L("patterns.booba"), level: "mid", seeds: [887] },
        { label: L("patterns.sleeperMushroom"), level: "mid", seeds: [439] },
        { label: L("patterns.memeNumber"), level: "low", seeds: [69, 420] },
        { label: L("patterns.robot"), level: "low", seeds: [264, 702] }
      ]
    },
    {
      skin: "Karambit | Case Hardened",
      what: "Blue gem",
      src: "csdb.gg",
      tiers: [
        { label: L("patterns.top"), level: "top", seeds: [387, 442, 670, 463] },
        { label: "Tier 1", level: "high", seeds: [269] }
      ]
    },
    {
      skin: "Karambit | Marble Fade",
      what: "Fire & Ice",
      src: "csgoskins.gg",
      tiers: [
        { label: "#1 (max)", level: "top", seeds: [412] },
        { label: "#2", level: "top", seeds: [16, 146, 241, 359, 393, 541, 602, 649, 688, 701] },
        { label: "#3", level: "high", seeds: [152, 281, 292, 344, 628, 673, 743, 777, 792, 994] },
        { label: "#4", level: "high", seeds: [48, 126, 129, 332, 780, 787, 874, 908, 918, 923] },
        { label: "#5", level: "high", seeds: [182, 204, 252, 457, 522, 578, 652, 660, 685, 705, 736, 832, 988] },
        { label: "#6", level: "high", seeds: [112, 230, 340, 356, 444, 452, 471, 607, 621, 631, 761, 773, 873, 876, 982] },
        { label: "#7", level: "mid", seeds: [8, 14, 32, 58, 108, 213, 233, 243, 274, 405, 454, 614, 653, 683, 728, 732, 770, 795, 803, 826, 867, 949] },
        { label: "#8", level: "mid", seeds: [5, 178, 188, 202, 337, 378, 406, 461, 539, 696, 702, 854, 966, 971] },
        { label: "#9", level: "mid", seeds: [68, 121, 149, 165, 171, 206, 287, 370, 493, 499, 516, 637, 655, 656, 672, 706, 766, 817, 922, 959, 997] },
        { label: "#10", level: "mid", seeds: [28, 156, 177, 238, 402, 545, 546, 553, 559, 589, 591, 725, 764, 791, 810, 844, 858, 868, 972, 977] },
        { label: L("patterns.fakeT1SomeYellow"), level: "low", seeds: [9, 27, 90, 110, 125, 183, 195, 203, 232, 254, 329, 351, 372, 397, 404, 441, 448, 459, 473, 483, 537, 561, 590, 626, 632, 647, 710, 727, 753, 756, 785, 805, 809, 818, 869, 909, 930, 941, 962, 976, 980, 989] },
        { label: L("patterns.fakeT2SomeYellow"), level: "low", seeds: [60, 62, 71, 98, 148, 170, 196, 216, 222, 234, 266, 304, 307, 309, 315, 321, 328, 333, 364, 368, 400, 411, 413, 415, 438, 445, 463, 485, 489, 496, 506, 535, 570, 582, 593, 605, 630, 663, 667, 670, 674, 691, 717, 723, 746, 794, 822, 845, 846, 931, 948, 958] }
      ]
    }
  ];
  var WEARS2 = /\s*\((Factory New|Minimal Wear|Field-Tested|Well-Worn|Battle-Scarred)\)\s*$/;
  function baseName(hash = "") {
    return String(hash).trim().replace(/^★\s*/, "").replace(/^(StatTrak™|Souvenir)\s+/i, "").replace(WEARS2, "").trim().toLowerCase();
  }
  function parseUser(text = "") {
    const entries2 = [], errors = [];
    String(text || "").split(/\r?\n/).forEach((raw, i) => {
      const line = raw.trim();
      if (!line || line.startsWith("#")) return;
      const m = line.match(/^(.+?)\s*:\s*([\d\s,;-]+?)\s*(?:=\s*(.*))?$/);
      const seeds = [];
      let bad = !m;
      for (const part of m ? m[2].split(/[\s,;]+/).filter(Boolean) : []) {
        const r = part.match(/^(\d+)(?:-(\d+))?$/);
        const a = r ? +r[1] : NaN, b = r?.[2] != null ? +r[2] : a;
        if (!r || b < a || b > 1e3) {
          bad = true;
          break;
        }
        for (let s = a; s <= b; s++) seeds.push(s);
      }
      if (bad || !seeds.length) {
        errors.push(i + 1);
        return;
      }
      entries2.push({ skin: m[1].trim(), what: (m[3] || "").trim() || L("patterns.yourPattern"), src: L("patterns.yourList"), tiers: [{ label: "", level: "user", seeds }] });
    });
    return { entries: entries2, errors };
  }
  var GROUP_LABEL = {
    gem_blue: "Blue gem",
    gem_gold: "Gold gem",
    gem_black: "Black gem",
    gem_white: "White gem",
    gem_green: "Green gem",
    gem_red: "Red gem",
    gem_purple: "Purple gem",
    gem_pink: "Pink gem",
    gem_orange: "Orange gem",
    gem_diamond: "Diamond gem",
    blaze: "Blaze",
    fade: "Fade",
    fire_and_ice: "Fire & Ice",
    white_scope: L("patterns.whiteScope"),
    blue_hive: L("patterns.blueHive"),
    orange_hive: L("patterns.orangeHive"),
    star: L("patterns.star"),
    pussy: "P**sy",
    golden_cat: L("patterns.goldenCat"),
    stoner_cat: "Stoner cat",
    phoenix: L("patterns.phoenix")
  };
  var groupLabel = (n = "") => GROUP_LABEL[n] || n.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());
  function fromCatalog(json) {
    const out = [];
    if (!json || typeof json !== "object") return out;
    for (const [finish, weapons] of Object.entries(json)) {
      for (const [weapon, groups2] of Object.entries(weapons || {})) {
        for (const g of Array.isArray(groups2) ? groups2 : []) {
          const seeds = (g.pattern || []).map(Number).filter((s) => Number.isInteger(s) && s >= 0 && s <= 1e3);
          if (!seeds.length) continue;
          const tiers = g.ordered ? seeds.map((s, i) => ({ label: `#${i + 1} z ${seeds.length}`, level: i === 0 ? "top" : i < Math.ceil(seeds.length * 0.3) ? "high" : "mid", seeds: [s] })) : [{ label: "", level: "high", seeds }];
          out.push({ skin: `${weapon} | ${finish}`, what: groupLabel(g.name), src: "cs2pattern (github.com/Helyux/cs2pattern)", tiers });
        }
      }
    }
    return out;
  }
  function buildIndex(entries2) {
    const idx = /* @__PURE__ */ new Map();
    for (const e of entries2) {
      const base = baseName(e.skin);
      const m = idx.get(base) || idx.set(base, /* @__PURE__ */ new Map()).get(base);
      for (const t of e.tiers) for (const seed of t.seeds) if (!m.has(seed)) m.set(seed, { what: e.what, label: t.label, level: t.level, src: e.src, seed });
    }
    return idx;
  }
  var cache2 = { text: null, extra: null, idx: null };
  function patternOf(hash, seed, userText = "", extra = null) {
    if (seed == null || !hash) return null;
    if (cache2.text !== userText || cache2.extra !== extra) cache2 = { text: userText, extra, idx: buildIndex([...parseUser(userText).entries, ...STARTER, ...extra || []]) };
    return cache2.idx.get(baseName(hash))?.get(+seed) || null;
  }
  var starterSummary = () => STARTER.map((e) => `${e.skin} (${e.what}, ${e.tiers.reduce((s, t) => s + t.seeds.length, 0)} ${L("patterns.seeds")})`);

  // src/features/patterndb.js
  var SRC = "https://raw.githubusercontent.com/Helyux/cs2pattern/master/cs2pattern/pattern.json";
  var KEY3 = "patternDB";
  var WEEK2 = 7 * 864e5;
  function getJSON3(url) {
    return new Promise((resolve, reject) => {
      if (typeof GM_xmlhttpRequest !== "function") return reject(new Error(L("patterndb.gmXmlhttprequestUnavailable")));
      GM_xmlhttpRequest({
        method: "GET",
        url,
        timeout: 6e4,
        onload: (r) => {
          if (r.status >= 400) return reject(new Error(`HTTP ${r.status}`));
          try {
            resolve(JSON.parse(r.responseText));
          } catch {
            reject(new Error(L("patterndb.badResponse")));
          }
        },
        onerror: () => reject(new Error(L("patterndb.networkError"))),
        ontimeout: () => reject(new Error("timeout"))
      });
    });
  }
  var mem4 = null;
  function entries() {
    if (!mem4) {
      const saved = get(KEY3, null);
      if (saved?.json) mem4 = { at: saved.at || 0, entries: fromCatalog(saved.json) };
    }
    return mem4?.entries || null;
  }
  function info() {
    const e = entries();
    if (!e) return null;
    return { at: mem4.at, seeds: e.reduce((s, x) => s + x.tiers.reduce((a, t) => a + t.seeds.length, 0), 0), skins: new Set(e.map((x) => x.skin)).size };
  }
  var loading = null;
  var lastError = "";
  var error = () => lastError;
  function load2({ force = false } = {}) {
    entries();
    if (!force && mem4 && Date.now() - mem4.at < WEEK2) return Promise.resolve(false);
    if (loading) return loading;
    loading = getJSON3(SRC).then((json) => {
      const e = fromCatalog(json);
      if (!e.length) throw new Error("pusta baza");
      const at = Date.now();
      set(KEY3, { at, json });
      mem4 = { at, entries: e };
      lastError = "";
      return true;
    }).catch((err) => {
      lastError = err.message;
      return false;
    }).finally(() => {
      loading = null;
    });
    return loading;
  }

  // src/features/patternmark.js
  var userPatterns = () => get("patternsUser", "") || "";
  var patternFor = (hash, seed) => patternOf(hash, seed, userPatterns(), entries());
  var patternClass = (m) => m ? `pat pat-${m.level}` : "";
  function patternChip(m) {
    if (!m) return "";
    const title = L("patternmark.knownPatternSeedSourceThe", { seed: m.seed, what: m.what, label: m.label ? `, ${m.label}` : "", src: m.src });
    return `<span class="pchip ${esc(m.level)}" title="${esc(title)}">\u{1F48E} ${esc(m.what)}${m.label ? ` \xB7 ${esc(m.label)}` : ""}</span>`;
  }

  // src/features/research-items.js
  var RESEARCH_ITEMS = [
    "Dreams & Nightmares Case",
    "Fever Case",
    "Operation Breakout Weapon Case",
    "Prisma 2 Case",
    "Spectrum 2 Case",
    "Danger Zone Case",
    "Sealed Dead Hand Terminal",
    "Gamma Case",
    "Gamma 2 Case",
    "Operation Phoenix Weapon Case",
    "Chroma Case",
    "Glove Case",
    "Fracture Case",
    "Spectrum Case",
    "Prisma Case",
    "Revolver Case",
    "Clutch Case",
    "Horizon Case",
    "Falchion Case",
    "Operation Broken Fang Case",
    "Recoil Case",
    "Shadow Case",
    "Chroma 2 Case",
    "Gallery Case",
    "Chroma 3 Case",
    "Snakebite Case",
    "AK-47 | Legion of Anubis (Field-Tested)",
    "Katowice 2019 Minor Challengers Autograph Capsule",
    "CS20 Case",
    "Anubis Collection Package",
    "AWP | Neo-Noir (Factory New)",
    "M4A1-S | Black Lotus (Field-Tested)",
    "Glock-18 | Bullet Queen (Field-Tested)",
    "MP9 | Starlight Protector (Battle-Scarred)",
    "AK-47 | Nightwish (Well-Worn)",
    "Desert Eagle | Printstream (Field-Tested)",
    "Operation Wildfire Case",
    "AK-47 | Crane Flight (Well-Worn)",
    "Operation Vanguard Weapon Case",
    "eSports 2013 Winter Case",
    "AK-47 | Slate (Field-Tested)",
    "Paris 2023 Mirage Souvenir Package",
    "eSports 2014 Summer Case",
    "Sticker | Flipsid3 Tactics (Holo) | Cologne 2016",
    "AK-47 | Crane Flight (Field-Tested)",
    "AWP | Chrome Cannon (Field-Tested)",
    "AK-47 | Frontside Misty (Minimal Wear)",
    "AK-47 | Ice Coaled (Field-Tested)",
    "AK-47 | Searing Rage (Field-Tested)",
    "AK-47 | Ice Coaled (Minimal Wear)",
    "AK-47 | Slate (Well-Worn)",
    "M4A4 | Tooth Fairy (Field-Tested)",
    "AK-47 | Wintergreen (Minimal Wear)",
    "AK-47 | Wintergreen (Field-Tested)",
    "M4A1-S | Night Terror (Field-Tested)",
    "M4A1-S | Electrum (Minimal Wear)",
    "M4A1-S | Solitude (Field-Tested)",
    "M4A1-S | Stratosphere (Field-Tested)",
    "M4A1-S | Electrum (Battle-Scarred)",
    "AK-47 | Elite Build (Field-Tested)",
    "P250 | Visions (Field-Tested)",
    "P250 | Franklin (Factory New)",
    "P2000 | Wicked Sick (Field-Tested)",
    "USP-S | Royal Guard (Factory New)",
    "P2000 | Wicked Sick (Battle-Scarred)",
    "Glock-18 | Ifrit Lattice (Minimal Wear)",
    "USP-S | Jawbreaker (Field-Tested)",
    "Glock-18 | Block-18 (Field-Tested)",
    "Souvenir MP9 | Music Box (Field-Tested)",
    "UMP-45 | Wild Child (Battle-Scarred)",
    "MP7 | Abyssal Apparition (Field-Tested)",
    "StatTrak\u2122 UMP-45 | Wild Child (Minimal Wear)",
    "P90 | Deathgaze (Field-Tested)",
    "P90 | Wave Breaker (Minimal Wear)",
    "UMP-45 | K.O. Factory (Field-Tested)",
    "P90 | Vent Rush (Field-Tested)",
    "Sticker | WARNING",
    "Sticker | Apeks (Glitter) | Copenhagen 2024",
    "Sticker | AMKAL ESPORTS (Holo) | Copenhagen 2024",
    "Sticker | Gold Web (Foil)",
    "Sticker | MOUZ (Holo) | Paris 2023",
    "Sticker | High Heat",
    "Sticker | Gold Web",
    "Revolution Case",
    "Kilowatt Case",
    "AK-47 | Redline (Field-Tested)",
    "AWP | Asiimov (Field-Tested)",
    "M4A4 | Desolate Space (Field-Tested)",
    "USP-S | Cortex (Field-Tested)",
    "Operation Riptide Case",
    "Operation Hydra Case",
    "Huntsman Weapon Case",
    "Winter Offensive Weapon Case",
    "CS:GO Weapon Case 2",
    "Stockholm 2021 Legends Sticker Capsule",
    "Paris 2023 Legends Sticker Capsule",
    "Copenhagen 2024 Legends Sticker Capsule",
    "AK-47 | Asiimov (Field-Tested)",
    "M4A4 | Neo-Noir (Field-Tested)",
    "AWP | Atheris (Field-Tested)",
    "Glock-18 | Water Elemental (Field-Tested)",
    "USP-S | Kill Confirmed (Field-Tested)",
    "Desert Eagle | Mecha Industries (Field-Tested)",
    "P250 | See Ya Later (Field-Tested)",
    "MAC-10 | Neon Rider (Field-Tested)",
    "AK-47 | Blue Laminate (Minimal Wear)",
    "USP-S | Silent Shot (Minimal Wear)",
    "AWP | Capillary (Field-Tested)"
  ];

  // src/features/markettrend.js
  var KEY4 = "marketTrend";
  var WEEK3 = 7 * 864e5;
  var KIND_LABEL = { skin: L("markettrend.skinMarket"), container: L("markettrend.caseMarket"), sticker: L("markettrend.stickerMarket") };
  var med = (a) => {
    const s = a.filter((x) => x != null).sort((x, y) => x - y);
    return s.length ? s[Math.floor(s.length / 2)] : null;
  };
  var get3 = () => get(KEY4, null);
  function refFor(hash, type = "") {
    const m = get3();
    if (!m?.all) return null;
    const k = kindOf(hash, type);
    const own = m.byKind?.[k];
    return own?.n >= 15 && KIND_LABEL[k] ? { ...own, label: KIND_LABEL[k], at: m.at } : { ...m.all, label: L("markettrend.market"), whole: true, at: m.at };
  }
  var running2 = false;
  async function ensure2() {
    const m = get3();
    if (running2 || m && Date.now() - m.at < WEEK3 || !isLeader()) return false;
    running2 = true;
    try {
      const rows3 = [];
      for (const hash of [...new Set(RESEARCH_ITEMS)]) {
        try {
          const r = recentTrend(await priceHistory(730, hash));
          if (r?.t6 != null) rows3.push({ k: kindOf(hash, ""), t6: r.t6, t3: r.t3 });
        } catch (e) {
          if (e.status === 429) break;
        }
      }
      if (rows3.length < 30) return false;
      const agg = (a) => ({ t6: med(a.map((x) => x.t6)), t3: med(a.map((x) => x.t3)), n: a.length });
      const byKind = {};
      for (const k of new Set(rows3.map((r) => r.k))) byKind[k] = agg(rows3.filter((r) => r.k === k));
      set(KEY4, { at: Date.now(), all: agg(rows3), byKind });
      return true;
    } finally {
      running2 = false;
    }
  }

  // src/features/inventory.js
  var APPS = [[730, 2, "CS2"], [570, 2, "Dota 2"], [440, 2, "TF2"], [252490, 2, "Rust"], [753, 6, L("inventory.steamCards")]];
  var el;
  var items = [];
  var listed = [];
  var sel = /* @__PURE__ */ new Set();
  var shown = 200;
  var task = null;
  var app = [730, 2];
  var sellRules = bucket("sellRules");
  var invMkMode = () => get("invMkMode", "sell");
  var sellWatch = bucket("invSellWatch");
  var watchSeen = /* @__PURE__ */ new Map();
  var watching = false;
  var wtBtn = (it) => it.hash && (it.listed || it.marketable || it.lock) ? `<button class="wt ${sellWatch.get(it.hash) ? "on" : ""}" data-wt="${esc(it.hash)}" title="${sellWatch.get(it.hash) ? L("inventory.forSaleClickToUnmark") : L("inventory.markForSaleTheFor")}">\u{1F4CC}</button>` : "";
  var steamOf = (it) => cached2(it.appid, it.hash);
  var fmtWait = (d) => d == null ? "" : d < 1 / 24 ? L("inventory.inUnderAnHour") : d < 1 ? L("inventory.inAboutH", { d: Math.round(d * 24) }) : L("inventory.inAboutDays", { d: dec(d, 1) });
  var pctOf = (c) => `${Math.round(c * 100)}%`;
  function adviceOf(it, h = null) {
    const s = steamOf(it);
    const graph2 = h?.sellGraph || s?.ask;
    if (!graph2?.length) return null;
    const table = fill(it.hash);
    if (table) {
      const a2 = listAdviceFill({ table, sellGraph: graph2, highestBuy: h ? h.highestBuy : s?.bid ?? null, net: (p) => receivedFromBuyer2(p), maxWaitDays: settings.maxWaitDays ?? 2, undercut: settings.undercut });
      if (a2) return a2;
    }
    const typ = typical(it.hash);
    const perDay = typ?.sold7 ? typ.sold7 / 7 : s?.volume || null;
    const a = listAdvice({
      sellGraph: graph2,
      highestBuy: h ? h.highestBuy : s?.bid ?? null,
      perDay,
      d7: typ?.d7,
      d30: typ?.d30,
      held: recentMedian(it.hash),
      net: (p) => receivedFromBuyer2(p),
      maxWaitDays: settings.maxWaitDays ?? 2,
      undercut: settings.undercut
    });
    const sold = a ? soldAt(it.hash, a.price) : null;
    if (sold && sold.total >= 3 && sold.n * 2 < sold.total) a.rare = sold;
    return a;
  }
  function adviceTitle(a, it) {
    const f = fmt, lines = [];
    if (a.sellNow && a.instant) {
      lines.push(L("inventory.sellRightAwayToThe", { price: f(a.instant.price), net: f(a.instant.net) }));
      lines.push(L("inventory.waitingForAHigherPrice"));
    } else {
      lines.push(L("inventory.listItForYouGet", { price: f(a.price), net: f(a.net) }));
      if (a.method === "fill") lines.push(L("inventory.chanceItSellsWithin", { horizon: daysTxt(a.horizon), chance: pctOf(a.chance) }));
      else if (a.rare) lines.push(L("inventory.inTheLastDaysOnly", { days: a.rare.days, n: a.rare.n, total: a.rare.total }));
      else if (a.wait != null) lines.push(L("inventory.itShouldSell", { wait: fmtWait(a.wait) }));
      if (a.instant) lines.push(L("inventory.rightAwayToTheBuy", { price: f(a.instant.price) }));
    }
    if (a.falling) lines.push(L("inventory.thePriceUsuallyDropsAfter"));
    if (it.float != null || it.stickers?.length) lines.push(L("inventory.floatAndStickersAreNot"));
    return lines.join("\n");
  }
  function adviceLine(it, lowest) {
    if (!it.marketable || it.listed) return "";
    if (signals(it, lowest).some((x) => x.k === "hold")) return "";
    const a = adviceOf(it);
    if (!a) return "";
    const t = esc(adviceTitle(a, it));
    return a.sellNow && a.instant ? `<div class="adv now" title="${t}"><span class="lb">\u26A1 ${L("inventory.rightAway")}</span><b>${fmt(a.instant.price)}</b><span class="w">${L("inventory.toTheOrderWaitingGives")}</span></div>` : `<div class="adv" title="${t}"><span class="lb">${L("inventory.listFor")}</span><b>${fmt(a.price)}</b><span class="w">${a.method === "fill" ? L("inventory.chanceWithin", { horizon: daysTxt(a.horizon), chance: pctOf(a.chance), lowChance: a.lowChance ? L("inventory.only") : "" }) : a.rare ? L("inventory.inDaysThisMuchOr", { days: a.rare.days, n: a.rare.n, total: a.rare.total }) : a.wait != null ? L("inventory.willSell", { wait: fmtWait(a.wait) }) : L("inventory.noSalesData")}</span></div>`;
  }
  function unitPrice(it) {
    const s = steamOf(it);
    return s?.lowest ? { v: s.lowest, src: "steam" } : { v: null, src: null };
  }
  var stickerHash = (x) => `${x.kind} | ${x.name}`;
  var stickerPrice = (x) => cached2(730, stickerHash(x))?.lowest || 0;
  var stickerValue = (it) => it.stickers.reduce((s, x) => s + stickerPrice(x), 0);
  function mount(root2) {
    el = root2;
    root2.innerHTML = `
    <div class="bar">
      <div class="line">
        <select id="i-app">${APPS.map(([a, c, n]) => `<option value="${a}_${c}">${n}</option>`).join("")}</select>
        <button class="b" data-a="reload">\u27F3 ${L("inventory.load")}</button>
        <input type="search" id="i-q" placeholder="${L("inventory.search")}" style="width:200px">
        <span class="grp"><span class="lb">${L("inventory.layout")}</span>
          <select id="i-sort">
            <option value="price">${L("inventory.price")}</option><option value="name">${L("inventory.name")}</option><option value="float">Float \u2191</option><option value="stickers">${L("inventory.stickers")}</option><option value="new">${L("inventory.newest")}</option>
          </select>
          <label class="tgl" title="${L("inventory.joinsIdenticalItemsNoFloat")}"><input type="checkbox" id="i-grp" checked><span class="tr"></span>${L("inventory.groupIdentical")}</label>
        </span>
        <span class="sp"></span>
        <button class="b" data-a="prices" title="${L("inventory.pricesAreWorkedOutBy")}">${L("inventory.refreshSteamPrices")}</button>
        <button class="b dbg" data-a="research" title="${L("inventory.downloadsFromTheSteamMarket")}">\u2B07 ${L("inventory.dataForAnalysis")}</button>
        <button class="b" data-a="stop" hidden>\u25A0 Stop</button>
      </div>
      <div class="line">
        <label class="spot" title="${L("inventory.onlyItemsWithTheIn")}"><input type="checkbox" id="i-worth">\u{1F4B0} ${L("inventory.worthSelling")} <b id="i-worthn"></b></label>
        <span class="grp"><span class="lb">${L("inventory.show")}</span>
          <span class="seg" title="${L("inventory.sellableCanBeListedNow")}">
            ${[["all", L("inventory.all")], ["sell", L("inventory.sellable")], ["lock", L("inventory.tradeLocked")], ["unsell", L("inventory.unsellable")]].map(([v, t]) => `<label><input type="radio" name="i-mkmode" value="${v}" ${invMkMode() === v ? "checked" : ""}>${t}</label>`).join("")}
          </span>
          <label class="tgl" title="${L("inventory.alsoShowsTheItemsYou")}"><input type="checkbox" id="i-listed" ${settings.invShowListed ? "checked" : ""}><span class="tr"></span>${L("inventory.listed")}</label>
          <label class="tgl" title="${L("inventory.onlyItemsMarkedForSale")}"><input type="checkbox" id="i-wt"><span class="tr"></span>\u{1F4CC} ${L("inventory.forSale")} <b id="i-wtn" class="sub"></b></label>
        </span>
      </div>
    </div>
    <div class="cards" id="i-cards"></div>
    <div class="bar" style="top:auto;position:relative;z-index:1">
      <span id="i-sel" class="sub">${L("inventory.clickItemsToSelectThem")}</span>
      <button class="b s" data-a="selall">${L("inventory.selectVisible")}</button><button class="b s" data-a="selnone">${L("inventory.deselect")}</button>
      <span class="sp"></span>
      <button class="b go" data-a="sell">${L("inventory.sellSelected")}</button>
    </div>
    <div id="i-stale" class="note" hidden style="margin:10px 14px 0;padding:7px 10px;border:1px solid #2a475e;border-radius:5px;background:rgba(102,192,244,.06)"></div>
    <div class="grid" id="i-grid"></div>
    <div style="text-align:center;padding:10px"><button class="b" data-a="more" hidden>${L("inventory.showMore")}</button></div>`;
    root2.addEventListener("click", onClick);
    root2.querySelector("#i-app").onchange = (e) => {
      app = e.target.value.split("_").map(Number);
      load3();
    };
    for (const id of ["#i-q", "#i-sort", "#i-grp", "#i-worth", "#i-wt"]) root2.querySelector(id).addEventListener("input", () => {
      shown = 200;
      render();
    });
    root2.querySelectorAll('input[name="i-mkmode"]').forEach((r) => r.addEventListener("change", (e) => {
      set("invMkMode", e.target.value);
      shown = 200;
      render();
    }));
    root2.querySelector("#i-listed").addEventListener("input", (e) => {
      settings.invShowListed = e.target.checked;
      shown = 200;
      render();
    });
    let estT = 0;
    bus.on("estimated", () => {
      clearTimeout(estT);
      estT = setTimeout(() => el && items.length && render(), 1500);
    });
    load().then((d) => {
      floatDb = d;
      if (items.length) render();
    }).catch(() => {
    });
    load2().then((fresh3) => {
      if (fresh3 && items.length) render();
    });
    setTimeout(() => ensure2().then((fresh3) => {
      if (fresh3 && items.length) render();
    }), 9e4);
    setInterval(watchTick, 10 * 6e4);
    load3();
  }
  var show2 = () => {
  };
  var floatDb = null;
  async function ensureFloatDb() {
    if (!floatDb) floatDb = await load().catch(() => null);
    return floatDb;
  }
  var floatRankOf = (it) => rankOf(it);
  async function floatCheck(it) {
    await ensureFloatDb();
    return floatDialog(it);
  }
  var mktFloats = bucket("mktFloats");
  var MKT_TTL = 12 * 36e5;
  var mktNone = () => Date.now() - (get("mktFloatsNone", 0) || 0) < 864e5;
  function saveMkt(hash, withF, total) {
    if (withF.length) mktFloats.set(hash, { at: Date.now(), n: withF.length, total, min: withF[0].float, max: withF[withF.length - 1].float });
    else mktFloats.set(hash, { at: Date.now(), n: 0, total });
  }
  function marketMark(it) {
    const m = mktFloats.get(it.hash);
    if (it.float == null || !m?.n || Date.now() - m.at > MKT_TTL) return null;
    return it.float <= m.min ? { k: "low", m } : it.float >= m.max ? { k: "high", m } : null;
  }
  var floatScanRunning = false;
  async function floatScan(tk) {
    if (floatScanRunning || mktNone()) return;
    const own = [...new Map([...items, ...listed].filter((it) => it.float != null && it.hash && (it.marketable || it.lock || it.listed)).map((it) => [it.hash, it])).values()];
    const todo = own.filter((it) => {
      const r = rankOf(it);
      const m = mktFloats.get(it.hash);
      return r && (r.lower <= 0.25 || r.lower >= 0.75) && !(m && Date.now() - m.at < MKT_TTL);
    });
    if (!todo.length) return;
    floatScanRunning = true;
    let seen = 0, withAny = 0;
    try {
      for (const it of todo) {
        if (tk?.cancelled) break;
        const p = await marketListings(it.appid || 730, it.hash, { start: 0, count: 100 });
        const withF = p.listings.filter((x) => x.float != null).sort((a, b) => a.float - b.float);
        saveMkt(it.hash, withF, p.total);
        seen++;
        if (withF.length) withAny++;
        if (seen >= 3 && !withAny) {
          set("mktFloatsNone", Date.now());
          break;
        }
        if (el) render();
      }
    } catch (e) {
      if (e.status === 429) log(L("inventory.marketFloatsSteamIsLimiting"), "warn");
    }
    floatScanRunning = false;
  }
  var rankOf = (it) => it.float != null ? floatRank(it.float, floatRange(floatDb, it.hash)) : null;
  function floatMarks(it, r = rankOf(it)) {
    let out = "";
    if (r?.super) out += ` <span style="color:#ff6b6b;font-weight:700" title="${r.super === "low" ? L("inventory.rankingExceptionallyLowFloatAt") : L("inventory.rankingExceptionallyHighFloatAt")}">\u2757</span>`;
    const mk = marketMark(it);
    if (mk) out += ` <span style="color:#e5b84c" title="${mk.k === "low" ? L("inventory.marketTheLowestFloatAmong", { n: mk.m.n, min: mk.m.min.toFixed(6) }) : L("inventory.marketTheHighestFloatAmong", { n: mk.m.n, max: mk.m.max.toFixed(6) })}">\u2605</span>`;
    return out;
  }
  function floatLine(it, key) {
    const r = rankOf(it);
    const pm = patternFor(it.hash, it.seed);
    const star = floatMarks(it, r);
    const title = r ? L("inventory.floatOnlyOfAllCopies", { float: it.float.toFixed(6), lower: shareTxt(r.lower), wear: r.wear, lo: r.lo.toFixed(3), hi: r.hi.toFixed(3) }) : L("inventory.clickToCompareTheFloat");
    return `<div class="sub"><span data-fc="${esc(key)}" title="${esc(title)}" style="cursor:pointer;border-bottom:1px dotted currentColor;${r && r.lower <= 0.05 ? "color:#e5b84c;" : ""}">${it.float.toFixed(6)}</span>${star}${it.seed != null ? ` \xB7 seed ${it.seed}` : ""}</div>${pm ? `<div style="margin-top:2px">${patternChip(pm)}</div>` : ""}`;
  }
  function patRows(it, all3, cheapest) {
    const f = fmt;
    const hits = all3.map((x) => ({ x, m: x.seed != null ? patternFor(it.hash, x.seed) : null })).filter((h) => h.m).sort((a, b) => a.x.price - b.x.price);
    if (!hits.length) return "";
    return `<div style="margin:10px 0 6px"><b>\u{1F48E} ${L("inventory.listingsWithAKnownPattern")}</b> <span class="sub">${L("inventory.amongChecked", { hits: hits.length, all: all3.length })}</span></div>
    <table><tr><th>Seed</th><th>${L("inventory.pattern")}</th><th>Float</th><th>${L("inventory.price2")}</th></tr>${hits.slice(0, 12).map(({ x, m }) => `<tr><td>${x.seed}</td><td>${patternChip(m)}</td><td>${x.float != null ? x.float.toFixed(6) : "-"}</td><td>${f(x.price)}${cheapest && x.price <= cheapest * 1.05 ? ` <span class="ok" title="${L("inventory.nearlyAtThePriceOf")}">${L("inventory.cheap")}</span>` : ""}</td></tr>`).join("")}</table>`;
  }
  async function floatDialog(it) {
    const f = fmt;
    const r = rankOf(it);
    const box2 = (html) => ask(L("inventory.floatAgainstTheMarket"), `<div id="fc-body" style="min-width:420px">${html}</div>`, { ok: L("inventory.close"), cancel: null, wide: true });
    const head = `<b>${esc(it.name)}</b> <span class="sub">${esc(it.hash)}</span><br>
    ${L("inventory.yourFloat")}: <b>${it.float.toFixed(8)}</b>${it.seed != null ? ` \xB7 seed ${it.seed}` : ""} ${patternChip(patternFor(it.hash, it.seed))}<br>
    ${r?.super ? `<div style="margin:6px 0;padding:6px 8px;border:1px solid #ff6b6b;border-radius:5px;background:rgba(255,107,107,.08)">\u2757 ${L("inventory.atMost1In1000", { super: r.super === "low" ? L("inventory.exceptionallyLowFloat") : L("inventory.exceptionallyHighWorstFloat"), super2: r.super === "low" ? L("inventory.lower") : L("inventory.higher"), super3: r.super === "low" ? L("inventory.suchAnItemCanBe") : L("inventory.theWorstFloatsHaveCollectors") })}</div>` : ""}
    <div class="sub" style="margin:4px 0">${L("inventory.youCanCheckThePlace")} <a class="acc" href="https://sih.app/floats" target="_blank" rel="noopener">SIH</a> \xB7 <a class="acc" href="https://www.steamanalyst.com/item-db" target="_blank" rel="noopener">Steam Analyst Item DB</a> \xB7 CSFloat, ${L("inventory.theyOpenInANew")}</div>
    ${r ? L("inventory.inForThisSkinOnly", { wear: r.wear, lo: r.lo.toFixed(3), hi: r.hi.toFixed(3), lower: shareTxt(r.lower), lower2: shareTxt(1 - r.lower), best: r.best.toFixed(3) }) : `<span class="sub">${L("inventory.iDontKnowTheFloat")}</span>`}`;
    const done = box2(`${head}<div id="fc-mk" style="margin-top:10px"><span class="spin"></span>${L("inventory.downloadingListingsFromTheMarket")}</div>`);
    const out = () => root2().querySelector("#fc-mk");
    const root2 = () => document.querySelector("#fc-body") || document.createElement("div");
    try {
      const all3 = [];
      let total = 0;
      for (let start = 0; start < 300; start += 100) {
        const p = await marketListings(it.appid || 730, it.hash, { start, count: 100 });
        total = p.total;
        all3.push(...p.listings);
        if (p.listings.length < 100 || all3.length >= total) break;
      }
      const withF = all3.filter((x) => x.float != null).sort((a, b) => a.float - b.float);
      saveMkt(it.hash, withF, total);
      if (el) render();
      if (!out().isConnected) return;
      if (!withF.length) {
        out().innerHTML = `<span class="sub">${L("inventory.steamGaveNoFloatsFor", { all: all3.length })}</span>`;
        return;
      }
      const lower = withF.filter((x) => x.float < it.float);
      const near = [...withF].sort((a, b) => Math.abs(a.float - it.float) - Math.abs(b.float - it.float)).slice(0, 6).sort((a, b) => a.float - b.float);
      const cheapest = all3[0]?.price;
      out().innerHTML = `${L("inventory.onTheMarketListingsI", { total, all: all3.length, withF: withF.length })}<br>
      ${L("inventory.aLowerFloatThanYours", { lower: lower.length })}${lower.length ? L("inventory.theLowestFor", { float: withF[0].float.toFixed(6), price: f(withF[0].price) }) : `, <b class="ok">${L("inventory.youHaveTheLowestFloat")}</b>`}. ${L("inventory.cheapestListing")}: ${f(cheapest)}.<br>
      <table style="margin-top:8px"><tr><th>Float</th><th>${L("inventory.price2")}</th><th></th></tr>${near.map((x) => `<tr><td>${x.float.toFixed(6)}${x.seed != null ? ` <span class="sub">seed ${x.seed}</span> ${patternChip(patternFor(it.hash, x.seed))}` : ""}</td><td>${f(x.price)}</td><td class="sub">${x.float < it.float ? L("inventory.lowerThanYours") : L("inventory.higherThanYours")}${cheapest && x.price > cheapest * 1.05 ? ` \xB7 +${Math.round((x.price / cheapest - 1) * 100)}% ${L("inventory.aboveTheCheapest")}` : ""}</td></tr>`).join("")}</table>
      ${patRows(it, all3, cheapest)}
      <span class="sub">${L("inventory.listingsWithAFloatSimilar", { all: all3.length })}</span>`;
    } catch (e) {
      if (out().isConnected) out().innerHTML = `<span class="err">${esc(e.message)}</span>`;
    }
    await done;
  }
  async function watchTick() {
    if (watching || !items.length) return;
    const own = [...items, ...listed];
    const list2 = Object.keys(sellWatch.all()).map((h) => own.find((it) => it.hash === h)).filter(Boolean);
    if (!list2.length) return;
    watching = true;
    const f = fmt;
    try {
      for (const it of list2) {
        const h = await hist(it.appid, it.hash, 2 * 6e4).catch((e) => {
          if (e.status === 429) throw e;
          return null;
        });
        if (!h) continue;
        const a = adviceOf(it, h);
        const now = { low: h.lowestSell, sellNow: !!a?.sellNow, sig: signals(it, h.lowestSell).filter((x) => x.k === "high" || x.k === "profit").map((x) => x.label).join(", ") };
        const prev = watchSeen.get(it.hash);
        if (prev) {
          if (prev.low && now.low && Math.abs(now.low / prev.low - 1) >= 0.05) log(L("inventory.cheapestListingTo", { name: it.name, low: f(prev.low), low2: f(now.low), low3: now.low > prev.low ? "+" : "\u2212", low4: Math.round(Math.abs(now.low / prev.low - 1) * 100) }), now.low > prev.low ? "ok" : "warn");
          if (now.sellNow && !prev.sellNow && a?.instant) log(L("inventory.buyersNowPaySellingRight", { name: it.name, price: f(a.instant.price) }), "ok");
          if (now.sig && now.sig !== prev.sig) log(`\u{1F4CC} ${it.name}: ${now.sig}`, "ok");
        }
        watchSeen.set(it.hash, now);
      }
    } catch (e) {
      if (e.status === 429) log(L("inventory.steamIsLimitingRequestsIll"), "warn");
    }
    watching = false;
    if (el) render();
  }
  var ownedCount = (hash) => items.length ? items.filter((it) => it.hash === hash).reduce((s, it) => s + (it.amount || 1), 0) : null;
  var lastClicked = null;
  function onClick(e) {
    const fc = e.target.closest("[data-fc]");
    if (fc) {
      e.stopPropagation();
      const g = groups().find((x) => x.key === fc.dataset.fc);
      if (g) floatDialog(g.rep);
      return;
    }
    const wt = e.target.closest("[data-wt]");
    if (wt) {
      e.stopPropagation();
      const h = wt.dataset.wt;
      if (sellWatch.get(h)) {
        sellWatch.del(h);
        watchSeen.delete(h);
      } else {
        sellWatch.set(h, { at: Date.now() });
        watchTick();
      }
      render();
      return;
    }
    const waitFresh = () => log(L("inventory.oneMomentTheInventoryIs"), "warn");
    const qs = e.target.closest("[data-q]");
    if (qs && fromCache) {
      e.stopPropagation();
      return waitFresh();
    }
    if (qs) {
      e.stopPropagation();
      const k = qs.closest(".gi").dataset.k;
      if (qs.dataset.q === "plan") {
        const g = groups().find((x) => x.key === k);
        if (g) planDialog(g).catch((er) => log(er.message, "err"));
        return;
      }
      qs.dataset.q === "unlist" ? unlist(k) : quickSell(k, qs.dataset.q);
      return;
    }
    const gi = e.target.closest(".gi");
    if (gi && gi.classList.contains("listed")) return;
    if (gi && fromCache && !e.target.closest("a")) return waitFresh();
    if (gi && !e.target.closest("a")) {
      const k = gi.dataset.k;
      const vis = visible().map((g) => g.key);
      if (e.shiftKey && lastClicked) {
        const [a2, b] = [vis.indexOf(lastClicked), vis.indexOf(k)].sort((x, y) => x - y);
        vis.slice(a2, b + 1).forEach((x) => sel.add(x));
      } else sel.has(k) ? sel.delete(k) : sel.add(k);
      lastClicked = k;
      render();
      return;
    }
    const a = e.target.closest("button")?.dataset.a;
    if (!a) return;
    ({
      reload: load3,
      prices: fetchPrices,
      stop: () => {
        task?.cancel();
        priceTask?.cancel();
      },
      more: () => {
        shown += 200;
        render();
      },
      selall: () => {
        if (fromCache) return waitFresh();
        visible().filter((g) => !g.rep.listed).forEach((g) => sel.add(g.key));
        render();
      },
      selnone: () => {
        sel.clear();
        render();
      },
      research: () => {
        const gs = sel.size ? groups().filter((g) => sel.has(g.key)) : groups();
        const list2 = gs.filter((g) => g.rep.marketable || g.rep.lock || g.rep.listed).map((g) => ({ hash: g.hash, appid: g.rep.appid }));
        exportResearch(list2, sel.size ? L("inventory.selectedInTheInventory") : L("inventory.fromYourInventoryAlsoListed"), { onBusy: (b) => el.querySelector('[data-a="stop"]').hidden = !b });
      },
      sell: () => fromCache ? waitFresh() : sellDialog([...sel].map((k) => groups().find((g) => g.key === k)).filter(Boolean))
    })[a]?.();
  }
  var loading2 = false;
  var fromCache = null;
  var loadGen = 0;
  var stale = (gen) => gen !== loadGen;
  async function load3() {
    const gen = ++loadGen, a = [...app];
    if (!await ensureLogin() && !ctx().steamId) return log(L("inventory.logInToSteam"), "err");
    if (stale(gen)) return;
    loading2 = true;
    const saved = cachedInventory(void 0, a[0], contextsOf(a));
    if (listed.length && listed.some((l) => +l.appid !== a[0])) listed = [];
    if (saved?.items.length) {
      items = saved.items;
      items.forEach((it, i) => it.idx = i);
      fromCache = { at: saved.at };
      sel.clear();
      mergeListed();
      render();
    } else {
      fromCache = null;
      clearRows(el.querySelector("#i-grid"));
      el.querySelector("#i-grid").innerHTML = `<div class="empty" style="padding:60px 0"><span class="spin"></span>${L("inventory.loadingTheInventory")}</div>`;
    }
    try {
      const listedP = loadListed(a, gen);
      const got = await loadAllContexts(a);
      if (stale(gen)) return;
      items = got;
      items.forEach((it, i) => it.idx = i);
      mergeListed();
      loading2 = false;
      fromCache = null;
      sel.clear();
      log(L("inventory.inventoryItems", { items: items.length }));
      listedP.then(() => {
        if (stale(gen)) return;
        if (listed.length) log(L("inventory.inventoryOnTheMarket", { listed: listed.length }));
        render();
        if (listed.length) autoPrice();
      });
      render();
      watchTick();
      autoPrice();
    } catch (e) {
      if (stale(gen)) return;
      loading2 = false;
      if (fromCache) {
        fromCache.err = e.message;
        log(L("inventory.couldntRefreshTheInventory") + e.message, "warn");
        render();
        autoPrice();
        return;
      }
      clearRows(el.querySelector("#i-grid"));
      el.querySelector("#i-grid").innerHTML = `<div class="empty err">${esc(e.message)}</div>`;
    }
  }
  var contextsOf = (a) => a[0] === 730 && a[1] === 2 ? [.../* @__PURE__ */ new Set([2, ...get("ctx730", [2]), 16])] : [a[1]];
  async function loadAllContexts(a = app) {
    const main2 = await inventory(void 0, a[0], a[1]);
    if (!(a[0] === 730 && a[1] === 2)) return main2;
    const extra = [.../* @__PURE__ */ new Set([...get("ctx730", [2]), 16])].filter((c) => c !== 2);
    const seen = new Set(main2.map((i) => i.assetid));
    for (const c of extra) {
      try {
        for (const it of await inventory(void 0, 730, c)) if (!seen.has(it.assetid)) {
          seen.add(it.assetid);
          main2.push(it);
        }
      } catch (e) {
        console.warn(`[Flipster] context ${c}: ${e.message}`);
      }
    }
    return main2;
  }
  async function loadListed(a = app, gen = loadGen) {
    try {
      const { listings } = await myListings();
      if (stale(gen)) return;
      listed = listings.filter((l) => +l.appid === a[0] && +l.contextid === a[1]).map((l, i) => ({ ...l.item, listed: true, listingid: l.listingid, listPrice: l.buyer, listRecv: l.recv, listedAt: l.created, amount: l.amount, idx: -1 - i }));
    } catch (e) {
      if (stale(gen)) return;
      listed = [];
      log(L("inventory.couldntLoadTheListingsFrom") + e.message, "warn");
    }
    if (stale(gen)) return;
    mergeListed();
  }
  function mergeListed() {
    const byId = new Map(items.map((i) => [i.assetid, i]));
    const taken = /* @__PURE__ */ new Set();
    listed = listed.map((l) => {
      let inv2 = byId.get(l.assetid);
      if (!inv2) inv2 = items.find((i) => i.hash === l.hash && !i.marketable && !taken.has(i.assetid));
      if (inv2) taken.add(inv2.assetid);
      const merged = inv2 ? {
        ...inv2,
        ...l,
        float: l.float ?? inv2.float,
        seed: l.seed ?? inv2.seed,
        nameTag: l.nameTag || inv2.nameTag,
        stickers: l.stickers?.length ? l.stickers : inv2.stickers
      } : l;
      return recallProps(merged);
    });
    const ids = new Set(listed.map((l) => l.assetid));
    items = items.filter((i) => !ids.has(i.assetid) && !taken.has(i.assetid));
  }
  var pricing = null;
  var priceTask = null;
  var marketableList = () => [...new Map([...items.filter((it) => it.hash && (it.marketable || it.lock)), ...listed].map((it) => [it.hash, it])).values()].map((it) => ({ appid: it.appid, hash: it.hash, v: steamOf(it)?.lowest || 0 })).sort((a, b) => b.v - a.v).concat([...new Set(items.flatMap((it) => (it.stickers || []).map(stickerHash)))].map((hash) => ({ appid: 730, hash, v: 0 })));
  async function autoPrice({ force = false, list: list2 = marketableList() } = {}) {
    priceTask?.cancel();
    const tk = priceTask = token();
    el.querySelector('[data-a="stop"]').hidden = false;
    let lastRender = 0;
    const n = await lowestPrices(list2, {
      force,
      isCancelled: () => tk.cancelled,
      onEach: (hash, low, err, done, total) => {
        pricing = { done, total };
        if (err && err.status !== 429) console.warn("[Flipster]", hash, err.message);
        if (err?.status === 429) log(L("inventory.steamIsLimitingRequestsValuation"), "warn");
        if (Date.now() - lastRender > 1500 || done === total) {
          lastRender = Date.now();
          render();
          updateBadges();
        }
      }
    });
    if (n && !tk.cancelled) log(L("inventory.valuedItemsSteamPrices", { n }), "ok");
    pricing = null;
    if (priceTask === tk) el.querySelector('[data-a="stop"]').hidden = true;
    render();
    if (!tk.cancelled) {
      const want = [...items.filter((it) => (it.marketable || it.lock) && (steamOf(it)?.lowest || 0) >= 20)].map((it) => ({ hash: it.hash, appid: it.appid || 730 }));
      let last = 0;
      ensure3(want, { isCancelled: () => tk.cancelled, onEach: () => {
        if (Date.now() - last > 2e3) {
          last = Date.now();
          render();
        }
      } }).then(() => {
        render();
        return ensureFloatDb();
      }).then(() => floatScan(tk));
    }
  }
  var lockDay = (it) => {
    const t = lockUntil(it.lock);
    if (t == null) return it.lock || "x";
    const d = new Date(t);
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  };
  function groups() {
    const grp = el.querySelector("#i-grp").checked;
    const out = [];
    const map = /* @__PURE__ */ new Map();
    const all3 = settings.invShowListed ? [...items, ...listed] : items;
    for (const it of all3) {
      const unique = it.float != null || it.stickers.length || it.nameTag;
      const key = it.listed ? grp && !unique ? `lg:${it.hash}|${it.listPrice}` : "l:" + it.listingid : grp && !unique ? `g:${it.hash}|${originOf(it)?.cost ?? "?"}|${it.marketable ? "" : lockDay(it)}` : "a:" + it.assetid;
      let g = map.get(key);
      if (!g) {
        g = { key, hash: it.hash, rep: it, items: [], qty: 0 };
        map.set(key, g);
        out.push(g);
      }
      g.items.push(it);
      g.qty += it.amount;
    }
    return out;
  }
  function visible(worthOnly = el.querySelector("#i-worth").checked, all3 = groups()) {
    const q = el.querySelector("#i-q").value.trim().toLowerCase();
    const mk = invMkMode();
    const s = el.querySelector("#i-sort").value;
    const onlyWt = el.querySelector("#i-wt").checked;
    const kindOf2 = (g) => g.rep.marketable || g.rep.listed ? "sell" : g.rep.lock ? "lock" : "unsell";
    let gs = all3.filter((g) => (mk === "all" || mk === kindOf2(g)) && matchSearch(`${g.rep.name} ${g.hash} ${g.rep.nameTag || ""}`, q) && (!onlyWt || sellWatch.get(g.hash)) && (!worthOnly || !g.rep.listed && g.rep.marketable && worth(signals(g.rep, unitPrice(g.rep).v))));
    const by = {
      price: (g) => -(unitPrice(g.rep).v || 0),
      name: (g) => g.rep.name,
      float: (g) => g.rep.float ?? 9,
      stickers: (g) => -stickerValue(g.rep),
      new: (g) => g.rep.idx
    }[s];
    gs.sort((a, b) => {
      const x = by(a), y = by(b);
      return typeof x === "string" ? x.localeCompare(y) : x - y;
    });
    return gs;
  }
  var focus = null;
  var hl = null;
  function focusItem(hash, { appid = 730, cost = null, t = null } = {}) {
    focus = { hash, cost, t, until: Date.now() + 3e4 };
    const opt = APPS.find(([a]) => a === appid);
    if (opt && app[0] !== appid) {
      app = [opt[0], opt[1]];
      el.querySelector("#i-app").value = `${opt[0]}_${opt[1]}`;
      load3();
      return;
    }
    if (items.length && !loading2) render();
  }
  function prepFocus() {
    const f = focus;
    el.querySelector("#i-grp").checked = f.t == null;
    let mine = groups().filter((g) => g.hash === f.hash);
    if (!mine.length && !settings.invShowListed && listed.some((l) => l.hash === f.hash)) {
      settings.invShowListed = true;
      el.querySelector("#i-listed").checked = true;
      mine = groups().filter((g) => g.hash === f.hash);
    }
    if (!mine.length) {
      if (Date.now() > f.until) {
        focus = null;
        log(L("inventory.inventoryCouldntFindMaybeYou", { hash: f.hash }), "warn");
      }
      return null;
    }
    focus = null;
    if (!visible().some((g) => g.hash === f.hash)) {
      el.querySelector("#i-q").value = "";
      el.querySelector("#i-wt").checked = false;
      el.querySelector("#i-worth").checked = false;
      if (!visible().some((g) => g.hash === f.hash)) {
        set("invMkMode", "all");
        el.querySelectorAll('input[name="i-mkmode"]').forEach((r) => r.checked = r.value === "all");
      }
    }
    const vis = visible();
    const shownMine = vis.filter((g) => g.hash === f.hash);
    let best, keys;
    if (f.t != null) {
      const dist = (g) => {
        const o = originOf(g.rep);
        return o?.t == null ? Infinity : Math.abs(o.t - f.t) + (f.cost != null && o.cost !== f.cost ? 864e5 : 0);
      };
      best = [...shownMine].sort((a, b) => dist(a) - dist(b))[0];
      keys = best ? [best.key] : [];
    } else {
      const same = shownMine.filter((g) => f.cost != null && originOf(g.rep)?.cost === f.cost);
      keys = (same.length ? same : shownMine).map((g) => g.key);
      best = (same.length ? same : shownMine)[0];
    }
    if (!best) return null;
    const i = vis.indexOf(best);
    if (i >= shown) shown = i + 50;
    hl = { keys: new Set(keys), main: best.key, until: Date.now() + 8e3 };
    setTimeout(() => {
      if (hl && Date.now() >= hl.until) {
        hl = null;
        render();
      }
    }, 8100);
    return best.key;
  }
  var hlClass = (g) => hl && Date.now() < hl.until && hl.keys.has(g.key) ? g.key === hl.main ? "hl main" : "hl" : "";
  function render() {
    try {
      origins = itemOrigins();
    } catch (e) {
      console.warn("[Flipster] item origins", e);
    }
    const fx2 = focus && !loading2 && items.length ? prepFocus() : null;
    const all3 = groups();
    const vis = visible(void 0, all3);
    const worthN = el.querySelector("#i-worth").checked ? vis.length : visible(true, all3).length;
    el.querySelector("#i-worthn").textContent = worthN || "";
    el.querySelector("#i-wtn").textContent = new Set([...items, ...listed].filter((it) => sellWatch.get(it.hash)).map((it) => it.hash)).size || "";
    let tAll = 0, tNow = 0, rNow = 0, tLocked = 0, tListedLow = 0;
    let nNow = 0, nLocked = 0, unpriced = 0;
    let lCnt = 0, lSum = 0, lRecv = 0, lBeaten = 0;
    for (const it of items) {
      if (!it.hash || !(it.marketable || it.lock)) continue;
      const low = steamOf(it)?.lowest;
      if (it.marketable) {
        nNow += it.amount;
        if (low) {
          tNow += low * it.amount;
          rNow += receivedFromBuyer2(low) * it.amount;
        }
      } else {
        nLocked += it.amount;
        if (low) tLocked += low * it.amount;
      }
      if (!low) unpriced += it.amount;
    }
    for (const it of listed) {
      const low = steamOf(it)?.lowest;
      lCnt += it.amount;
      lSum += it.listPrice * it.amount;
      lRecv += it.listRecv * it.amount;
      if (low != null) {
        tListedLow += low * it.amount;
        if (low < it.listPrice) lBeaten += it.amount;
      } else unpriced += it.amount;
    }
    tAll = tNow + tLocked + tListedLow;
    const parts = [tLocked ? `${L("inventory.locked")} ${fmt(tLocked)}` : "", tListedLow ? `${L("inventory.onTheMarket")} ${fmt(tListedLow)}` : ""].filter(Boolean).join(" \xB7 ");
    const selG = all3.filter((g) => sel.has(g.key));
    const selVal = selG.reduce((s, g) => s + (unitPrice(g.rep).v || 0) * g.qty, 0);
    el.querySelector("#i-cards").innerHTML = `
    <div class="card"><div class="k">${L("inventory.items")}</div><div class="v">${items.length + lCnt}</div><div class="sub">${L("inventory.sellable2")} ${nNow}${nLocked ? ` \xB7 ${L("inventory.locked2")} ${nLocked}` : ""}${lCnt ? ` \xB7 ${L("inventory.onTheMarket")} ${lCnt}` : ""}</div></div>
    <div class="card"><div class="k">${L("inventory.steamValue")}</div><div class="v">${fmt(tAll)}</div><div class="sub">${pricing ? `<span class="acc">${L("inventory.valuing")} ${pricing.done}/${pricing.total}\u2026</span>` : `${parts || L("inventory.everythingInTheInventory")}${unpriced ? ` \xB7 ${unpriced} ${L("inventory.withoutAPrice")}` : ""}`}</div></div>
    <div class="card"><div class="k">${L("inventory.sellableNow")}</div><div class="v">${fmt(tNow)}</div><div class="sub">${nNow} ${L("inventory.pcs")} \xB7 ${L("inventory.youGet")} ~${fmt(rNow)}</div></div>
    ${lCnt ? `<div class="card"><div class="k">${L("inventory.onTheMarket2")}</div><div class="v">${fmt(lSum)}</div><div class="sub">${lCnt} ${L("inventory.pcs")} \xB7 ${L("inventory.youGet")} ${fmt(lRecv)}${lBeaten ? ` \xB7 <span class="err">${lBeaten} ${L("inventory.undercut")}</span>` : ""}</div></div>` : ""}
    <div class="card"><div class="k">${L("inventory.selected")}</div><div class="v">${selG.reduce((s, g) => s + g.qty, 0)}</div><div class="sub">${fmt(selVal)}</div></div>`;
    el.querySelector("#i-sel").textContent = selG.length ? L("inventory.selectedEntries", { selG: selG.length, selVal: fmt(selVal) }) : L("inventory.clickItemsToSelectThem");
    const grid = el.querySelector("#i-grid");
    const note = el.querySelector("#i-stale");
    note.hidden = !fromCache;
    grid.classList.toggle("stale", !!fromCache);
    el.querySelectorAll('[data-a="sell"], [data-a="selall"]').forEach((b) => {
      b.disabled = !!fromCache;
      b.title = fromCache ? L("inventory.availableWhenTheInventoryHas") : "";
    });
    if (fromCache) {
      note.innerHTML = fromCache.err ? `<span class="warn">${L("inventory.couldntRefreshTheInventory2", { err: esc(fromCache.err) })}</span> ${L("inventory.showingTheStateFromSelling", { at: esc(fmtWhen(fromCache.at)) })} <button class="b s" data-a="reload">${L("inventory.tryAgain")}</button>` : `<span class="spin" style="width:10px;height:10px"></span>${L("inventory.showingTheInventoryFromRefreshing", { at: esc(fmtWhen(fromCache.at)) })}`;
    }
    if (!vis.length) {
      clearRows(grid);
      grid.innerHTML = loading2 ? `<div class="empty" style="padding:60px 0"><span class="spin"></span>${L("inventory.loadingTheInventory")}</div>` : `<div class="empty">${items.length || listed.length ? L("inventory.noItemsInThisView") : L("inventory.noItems")}</div>`;
      return;
    }
    patchRows(grid, vis.slice(0, shown).map((g) => ({ key: `${fromCache ? "saved" : "live"}|${g.key}`, html: card(g) })));
    if (fromCache) grid.querySelectorAll(".qs button").forEach((b) => {
      b.disabled = true;
      b.title = L("inventory.availableWhenTheInventoryHas2");
    });
    el.querySelector('[data-a="more"]').hidden = vis.length <= shown;
    if (fx2) grid.querySelector(`[data-k="${CSS.escape(fx2)}"]`)?.scrollIntoView({ block: "center", behavior: "smooth" });
  }
  var origins = /* @__PURE__ */ new Map();
  var STEAM_DROP = { src: "drop", t: null, detail: `Steam: ${L("inventory.aGameDrop")}`, cost: 0, guess: true };
  var originOf = (it) => origins.get(it.assetid) || origins.get("h:" + it.hash) || (String(it.appid) === "753" && origins.size ? STEAM_DROP : null);
  function dropLabel(desc = "") {
    if (/operation|mission|challenge|upgraded|journal|stars/i.test(desc)) return L("inventory.fromAnOperationPassMissions");
    if (/rank|level|xp|service|medal|earned/i.test(desc)) return L("inventory.rewardForALevelRank");
    if (/gift/i.test(desc)) return L("inventory.gift");
    if (/^Steam: (drop z gry|a game drop)/.test(desc)) return L("inventory.aGameDropOnSteam");
    if (/store|purchased/i.test(desc)) return L("inventory.storePurchase");
    if (/drop/i.test(desc)) return "drop";
    return desc || L("inventory.received");
  }
  var srcName = (s) => ({ kupiony: L("inventory.bought"), "ze skrzyni": L("inventory.fromACase"), "z terminala": L("inventory.fromATerminal"), "z wymiany": L("inventory.fromATrade"), "z kontraktu": L("inventory.fromAContract") })[s] || s;
  var isDefault = (it) => it.rarity === "Rarity_Default" || /^Music Kit \| Valve, (CS:GO|CS2)$/.test(it.hash || "") || !it.marketable && !it.lock && it.hash && !it.hash.includes("|") && /^(★ )?(AK-47|M4A4|M4A1-S|AWP|Glock-18|USP-S|P2000|Desert Eagle|Knife|C4 Explosive|Zeus x27|.*Knife)$/.test(it.hash);
  function originLine(g) {
    if (isDefault(g.rep)) return `<div class="src" title="${L("inventory.aDefaultItemEveryPlayer")}">${L("inventory.defaultItemFromTheGame")}</div>`;
    const o = originOf(g.rep);
    if (!o) return "";
    const date = new Date(o.t).toLocaleDateString();
    const cost = o.cost != null ? fmt(o.cost) : o.wait ? "\u2026" : "?";
    const what = o.src === "drop" ? esc(dropLabel(o.detail)) : `${srcName(o.src)}${o.detail ? " " + esc(o.detail) : ""}`;
    const title = {
      kupiony: L("inventory.boughtOnTheMarketFor", { date, cost }),
      "ze skrzyni": L("inventory.droppedFromACaseCost", { detail: o.detail, date, cost }),
      "z terminala": L("inventory.boughtInTheTerminalCost", { detail: o.detail, date, cost }),
      "z wymiany": L("inventory.fromATradeCostThe", { detail: o.detail, date, cost, gave: (o.gave || []).join(", ") || L("inventory.nothingAGift") }),
      "z kontraktu": L("inventory.fromAContractCostThe", { date, cost }),
      drop: o.guess ? L("inventory.steamTradingCardsBackgroundsAnd") : `${o.detail} (${date})`
    }[o.src] || "";
    return `<div class="src" title="${esc(title)}">${what}</div>`;
  }
  function profitOf(g, now) {
    const o = originOf(g.rep);
    if (!o || o.cost == null || !now) return null;
    const net4 = receivedFromBuyer2(now);
    return { v: net4 - o.cost, pct: o.cost > 0 ? net4 / o.cost - 1 : null, approx: !(o.src === "kupiony" && !o.approx || o.cost === 0) };
  }
  var unitLine = (g, v) => g.qty > 1 && v != null ? `<span class="sub">${g.qty} \xD7 ${fmt(v)}</span>` : "";
  var forAll = (g) => g.qty > 1 ? L("inventory.forAllUnits", { qty: g.qty }) : "";
  function profitTag(g, now, what = L("inventory.sellingAtTheLowestPrice")) {
    const p = profitOf(g, now);
    if (!p) return "";
    const sign = p.v >= 0 ? "+" : "\u2212";
    return `<div class="pl ${p.v >= 0 ? "pos" : "neg"}" title="${L("inventory.whatYouGetWhenMinus", { what, g: forAll(g), approx: p.approx ? L("inventory.estimatedCost") : "" })}${g.qty > 1 ? `
${L("inventory.perUnit")}: ${sign}${fmt(Math.abs(p.v))}` : ""}"><span class="lb">${L("inventory.result")}${p.approx ? " ok." : ""}</span><b>${sign}${fmt(Math.abs(p.v * g.qty))}${p.pct != null ? ` <span class="sub">(${sign}${Math.round(Math.abs(p.pct) * 100)}%)</span>` : ""}</b></div>`;
  }
  function costTag(g, now) {
    const o = originOf(g.rep);
    if (!o) return "";
    const free = o.cost === 0;
    if (o.cost == null) return `<div title="${o.wait ? L("inventory.workingOutTheCost") : L("inventory.couldntWorkOutTheCost")}"><span class="lb">${L("inventory.cost")}</span><b class="mut">${o.wait ? "\u2026" : "?"}</b></div>`;
    const net4 = now ? receivedFromBuyer2(now) : null;
    const cls2 = free || net4 == null ? "" : net4 >= o.cost ? "pos" : "neg";
    return `<div title="${L("inventory.whatItCostYou")}${o.src === "kupiony" && !o.approx ? "" : o.approx ? L("inventory.estimatedThisPurchaseIsNot") : L("inventory.estimated")}${forAll(g)}${net4 != null && !free ? L("inventory.todayYoudGet", { net: fmt(net4 * g.qty) }) : ""}"><span class="lb">${L("inventory.cost")}${o.src === "kupiony" && !o.approx || free ? "" : " ok."}</span><b class="${cls2}">${free ? L("inventory.free") : fmt(o.cost * g.qty)}</b>${free ? "" : unitLine(g, o.cost)}</div>`;
  }
  var lockDate = (lock) => fmtWhen(lockUntil(lock), null);
  var SHOP_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9l1.6-5h14.8L21 9"/><path d="M3 9a3 3 0 0 0 6 0a3 3 0 0 0 6 0a3 3 0 0 0 6 0"/><path d="M5 11.6V20h14v-8.4"/><path d="M10 20v-4.5h4V20"/></svg>';
  function card(g) {
    const it = g.rep;
    const up = unitPrice(it);
    const st = steamOf(it);
    const sv = stickerValue(it);
    const border = it.rarityColor ? `border-bottom-color:#${esc(it.rarityColor)}` : "";
    const mk = it.listed || it.marketable || it.lock ? `<a class="mk" href="${esc(marketUrl(it.appid || 730, it.hash))}" target="_blank" rel="noopener" title="${esc(`${L("inventory.showOnTheSteamMarket")}: ${it.hash}
${L("inventory.theSameWearAndStattrak")}`)}" aria-label="${L("inventory.showOnTheSteamMarket")}">${SHOP_ICON}</a>` : "";
    const nameTag = it.nameTag ? `<div class="sub" style="color:#e5b84c;font-style:italic;overflow:hidden;white-space:nowrap;text-overflow:ellipsis" title="Name tag: ${esc(it.nameTag)}">\u{1F3F7} \u201E${esc(it.nameTag)}\u201D</div>` : "";
    if (it.listed) {
      const low = st?.lowest;
      const beaten = low != null && low < it.listPrice;
      return `<div class="gi listed ${sellWatch.get(it.hash) ? "mark" : ""} ${patternClass(patternFor(it.hash, it.seed))} ${hlClass(g)}" data-k="${esc(g.key)}" style="${border}" title="${esc(it.hash)}
${L("inventory.listedOnTheMarketYou")}">
    <div class="qs"><button class="red" data-q="unlist" title="${L("inventory.takesTheListingOffThe")}">\u2715 ${L("inventory.takeOff")}</button></div>
    ${mk}${wtBtn(it)}
    <div class="st">${it.stickers.slice(0, 5).map((s) => `<img src="${esc(s.img)}" title="${esc(s.kind + ": " + s.name)}">`).join("")}</div>
    <img class="m" loading="lazy" src="${icon(it.icon, "128fx96f")}">${g.qty > 1 ? `<span class="qty" title="${L("inventory.identicalUnitsInThisGroup", { qty: g.qty })}">\xD7${g.qty}</span>` : ""}
    <div class="n" style="color:#${esc(it.color || "c6d4df")}">${esc(it.name)}</div>
    <div class="meta">${nameTag}${it.float != null ? `<div class="fl"><i style="left:${(it.float * 100).toFixed(1)}%"></i></div>${floatLine(it, g.key)}` : ""}</div>
    <div class="foot">
      <div class="sub warn">\u{1F6D2} ${L("inventory.onTheMarketFor")} <b>${fmt(it.listPrice)}</b></div>
      <div class="sub ${beaten ? "err" : low != null ? "ok" : ""}">${low == null ? L("inventory.checkingTheMarket") : beaten ? L("inventory.undercutCheapest", { low: fmt(low) }) : L("inventory.yoursIsTheCheapest")}</div>
      <div class="pv">
        <div title="${L("inventory.whatYouGetAfterThe")}"><span class="lb">${L("inventory.youGet2")}</span><b>${fmt(receivedFromBuyer2(it.listPrice) * g.qty)}</b><span class="sub">${low != null ? `${L("inventory.market")} ${fmt(low * g.qty)}` : ""}</span>${unitLine(g, receivedFromBuyer2(it.listPrice))}</div>
        ${costTag(g, it.listPrice)}${profitTag(g, it.listPrice, L("inventory.sellingAtYourListingPrice"))}
      </div>
    </div>
    <div class="tail">${originLine(g)}</div>
  </div>`;
    }
    const locked = !it.marketable && it.lock;
    return `<div class="gi ${sel.has(g.key) ? "sel" : ""} ${locked ? "locked" : ""} ${sellWatch.get(it.hash) ? "mark" : ""} ${patternClass(patternFor(it.hash, it.seed))} ${hlClass(g)}" data-k="${esc(g.key)}" style="${border}" title="${esc(it.hash)}${it.nameTag ? `
Name tag: ${esc(it.nameTag)}` : ""}${it.lock ? "\n" + esc(it.lock) : ""}">
    ${it.marketable ? `<div class="qs"><button data-q="lowest" title="${L("inventory.listOnTheMarketA")}">${L("inventory.list")}</button><button class="g" data-q="instant" title="${L("inventory.sellRightAwayToThe2")}">\u26A1 ${L("inventory.now")}</button></div>` : locked ? `<div class="qs"><button data-q="plan" title="${L("inventory.illListThisItemMyself")}">\u23F0 ${planOf(it.hash) ? L("inventory.changeTheSalePlan") : L("inventory.planASale")}</button></div>` : ""}
    ${mk}${wtBtn(it)}
    <div class="st">${it.stickers.slice(0, 5).map((s) => `<img src="${esc(s.img)}" title="${esc(s.kind + ": " + s.name)}">`).join("")}</div>
    <img class="m" loading="lazy" src="${icon(it.icon, "128fx96f")}">${g.qty > 1 ? `<span class="qty" title="${L("inventory.identicalUnitsInThisGroup", { qty: g.qty })}">\xD7${g.qty}</span>` : ""}
    <div class="n" style="color:#${esc(it.color || "c6d4df")}">${esc(it.name)}</div>
    <div class="meta">${nameTag}${it.float != null ? `<div class="fl"><i style="left:${(it.float * 100).toFixed(1)}%"></i></div>${floatLine(it, g.key)}` : ""}</div>
    <div class="foot">
    ${!it.marketable && !it.lock ? "" : `<div class="pv">
      <div title="${esc(`${L("inventory.youGetWhatYouGet")}${st?.volume != null ? L("inventory.sellPer24h", { volume: st.volume }) : ""}${trendNote(it) ? `

${trendNote(it)}` : ""}${g.qty > 1 ? L("inventory.forAllUnitsTogetherThe", { qty: g.qty }) : ""}`)}"><span class="lb">${L("inventory.youGet2")}</span><b>${up.v ? fmt(receivedFromBuyer2(up.v) * g.qty) : "-"}</b><span class="sub">${up.v ? `${L("inventory.market")} ${fmt(up.v * g.qty)}` : ""}</span>${up.v ? unitLine(g, receivedFromBuyer2(up.v)) : ""}</div>
      ${costTag(g, up.v)}${profitTag(g, up.v)}
    </div>`}
    ${adviceLine(it, up.v)}
    </div>
    <div class="tail">
    ${originLine(g)}
    ${sv ? `<div class="sub warn" title="${esc(`${L("inventory.stickersPriceOfNewOnes")}:
${it.stickers.map((x) => `${x.name}: ${stickerPrice(x) ? fmt(stickerPrice(x)) : "?"}`).join("\n")}

${L("inventory.appliedOnesUsuallyRaiseThe")}`)}">${L("inventory.stickers2")} ~${fmt(sv)}</div>` : ""}
    ${(() => {
      if (!it.marketable && !it.lock) return `<div class="sigs"><span class="sig skip" title="${L("inventory.thisItemCantBeSold")}">${L("inventory.unsellable2")}</span></div>`;
      const lockChip = it.marketable ? "" : `<span class="sig skip" title="${esc(it.lock)}">\u{1F512} ${lockDate(it.lock) ? L("inventory.until") + lockDate(it.lock) : L("inventory.tradeLock")}</span>${planChip(it)}`;
      const lockNote = it.marketable ? "" : L("inventory.theItemHasATrade");
      const lowest = up.v;
      const ss = signals(it, lowest);
      const hs = histState(it, lowest);
      const checking2 = `<span class="sig skip" title="${L("inventory.downloadingThePriceHistoryOf")}"><span class="spin" style="width:8px;height:8px;border-width:1.5px;margin-right:4px"></span>${L("inventory.checking")}</span>`;
      if (ss.length) {
        const calm = hs === "ok" && !ss.some((x) => x.k === "fall" || x.k === "high" || x.k === "hold" || x.k === "tdown" || x.k === "tup") ? L("inventory.trendCheckedThePriceIsnt") : "";
        return `<div class="sigs">${lockChip}${ss.map((x) => `<span class="sig ${x.k}" title="${esc(x.title + calm + lockNote)}">${esc(x.label)}</span>`).join("")}${hs === "wait" && !ss.some((x) => x.k === "hold") ? checking2 : ""}</div>`;
      }
      if (hs === "wait") return `<div class="sigs">${lockChip}${checking2}</div>`;
      if (hs === "ok") return `<div class="sigs">${lockChip}<span class="sig hold" title="${L("inventory.thePriceIsNormalNot")}">${L("inventory.hold")}</span></div>`;
      if (hs === "none") return `<div class="sigs">${lockChip}<span class="sig skip" title="${L("inventory.steamHasNoPriceHistory")}">${L("inventory.noPriceHistory")}</span></div>`;
      return lockChip ? `<div class="sigs">${lockChip}</div>` : "";
    })()}
    </div>
  </div>`;
  }
  async function fetchPrices() {
    const base = sel.size ? groups().filter((g) => sel.has(g.key)) : groups();
    const list2 = [...new Map(base.filter((g) => g.rep.marketable).map((g) => [g.hash, g.rep])).values()].map((it) => ({ appid: it.appid, hash: it.hash }));
    if (!list2.length) return log(L("inventory.noSellableItems"), "warn");
    log(L("inventory.refreshingSteamPricesForItems", { list: list2.length, min: Math.max(1, Math.ceil(list2.length * 1.2 / 60)) }));
    await autoPrice({ force: true, list: list2 });
  }
  async function priceFor(g, mode, fixed) {
    const it = g.rep;
    const rule = sellRules.get(it.hash) || {};
    if (mode === "fixed") return { price: fixed, note: "" };
    if (mode === "saved") return rule.target != null ? { price: rule.target, note: L("inventory.saved") } : { price: null, note: L("inventory.noSavedPrice") };
    const h = await hist(it.appid, it.hash);
    if (mode === "advice") {
      const a = adviceOf(it, h);
      if (!a) return { price: rule.target ?? null, note: L("inventory.noListingsOnTheMarket") };
      let p2 = a.price;
      let note2 = a.method === "fill" ? L("inventory.chanceToSellWithinFrom", { horizon: daysTxt(a.horizon), chance: pctOf(a.chance) }) : !a.rate ? L("inventory.aCentBelowTheCheapest", { cheapest: fmt(a.cheapest) }) : a.rare ? L("inventory.inDaysOnlyOfUnits", { days: a.rare.days, n: a.rare.n, total: a.rare.total }) : a.ahead ? L("inventory.shouldSellCheaperListingsAhead", { wait: fmtWait(a.wait), ahead: a.ahead }) : L("inventory.aCentBelowTheCheapest2", { cheapest: fmt(a.cheapest) });
      if (a.sellNow && a.instant) note2 += L("inventory.sellingRightAwayToThe", { price: fmt(a.instant.price) });
      if (a.dumped) note2 += L("inventory.theCheapestListingsAreClearly");
      if (rule.min != null && p2 < rule.min) {
        p2 = rule.min;
        note2 += L("inventory.raisedToTheMinimum");
      }
      return { price: p2, note: note2 };
    }
    if (mode === "instant") {
      if (!h.highestBuy) return { price: null, note: L("inventory.noBuyOrders") };
      return { price: h.highestBuy, note: L("inventory.highestOrderPcs", { buyGraph: h.buyGraph[0]?.[1] ?? "?" }) };
    }
    const comp = competitorSell(h.sellGraph, {}, settings.ignoreBelow ?? 2, skipChooser(g.hash));
    if (comp == null) return { price: rule.target ?? null, note: L("inventory.noListingsOnTheMarket") };
    let p = comp - settings.undercut;
    let note = `${L("inventory.lowest")} ${fmt(comp)}`;
    if (rule.min != null && p < rule.min) {
      p = rule.min;
      note += L("inventory.raisedToTheMinimum");
    }
    return { price: Math.max(MIN_BUYER, p), note };
  }
  async function listDialog(g) {
    const it = g.rep;
    const rule = sellRules.get(it.hash) || {};
    const h = await hist(it.appid, it.hash);
    const a = adviceOf(it, h);
    const table = fill(it.hash);
    const N = a?.method === "fill" ? a.horizon : null;
    const cheapest = h.lowestSell;
    const quick2 = a?.quick ?? (cheapest ? Math.max(MIN_BUYER, cheapest - settings.undercut) : null);
    const f = fmt;
    const presets = [];
    if (a?.sellNow && a.instant) presets.push({ p: a.instant.price, label: L("inventory.suggested"), sub: L("inventory.rightAwayToTheBuy2") });
    else if (a) presets.push({ p: a.price, label: L("inventory.suggested"), sub: a.method === "fill" ? L("inventory.chanceWithin2", { N: daysTxt(N), chance: pctOf(a.chance) }) : a.rare ? L("inventory.inDaysThisMuchOr", { days: a.rare.days, n: a.rare.n, total: a.rare.total }) : a.wait != null ? L("inventory.willSell", { wait: fmtWait(a.wait) }) : "" });
    if (quick2 && quick2 !== a?.price) presets.push({ p: quick2, label: L("inventory.fastest"), sub: L("inventory.aCentUnderTheCheapest", { cheapest: f(cheapest) }) });
    if (h.highestBuy && !presets.some((x) => x.p === h.highestBuy)) presets.push({ p: h.highestBuy, label: `\u26A1 ${L("inventory.rightAway")}`, sub: L("inventory.toTheHighestBuyOrder") });
    if (rule.target != null && !presets.some((x) => x.p === rule.target)) presets.push({ p: rule.target, label: L("inventory.saved2"), sub: L("inventory.yourTargetPrice") });
    const ref = unitPrice(it).v || cheapest;
    const info2 = (m) => {
      const box2 = m.querySelector("#ls-info");
      const v = parsePrice(m.querySelector("#ls-price").value);
      if (isNaN(v) || v < MIN_BUYER) {
        box2.innerHTML = L("inventory.enterThePriceTheBuyer");
        return;
      }
      const recv = receivedFromBuyer2(v);
      const listed2 = buyerFromReceived2(recv);
      const msgs = [L("inventory.youGet3", { recv: f(recv), qty: g.qty > 1 ? L("inventory.perUnitInTotal", { recv: f(recv * g.qty) }) : "" })];
      const pr = profitOf(g, listed2);
      if (pr) msgs.push(`${L("inventory.resultAgainstTheCost")}${pr.approx ? L("inventory.estimatedCost") : ""}: <b class="${pr.v >= 0 ? "ok" : "err"}">${pr.v >= 0 ? "+" : "\u2212"}${f(Math.abs(pr.v))}${pr.pct != null ? ` (${pr.v >= 0 ? "+" : "\u2212"}${Math.round(Math.abs(pr.pct) * 100)}%)` : ""}</b>${g.qty > 1 ? L("inventory.perUnit2") : ""}`);
      if (listed2 !== v) msgs.push(`<span class="warn">${L("inventory.doesntExistOnSteamThe", { v: f(v), listed: f(listed2) })}</span>`);
      const c = table && N ? sellChance(table, N, listed2, h.sellGraph) : null;
      if (c != null) msgs.push(`${L("inventory.chanceToSellWithin", { N: daysTxt(N) })}: <b class="${c >= 0.5 ? "ok" : c >= 0.25 ? "warn" : "err"}">${pctOf(c)}</b> <span class="sub">${L("inventory.fromTheItemsHistory")}</span>`);
      if (h.highestBuy && listed2 <= h.highestBuy) msgs.push(`<span class="warn">${L("inventory.notAboveTheHighestBuy")}</span>`);
      else if (quick2 && listed2 < quick2) msgs.push(`<span class="warn">${L("inventory.cheaperThanNeededToBe", { cheapest: f(cheapest) })}</span>`);
      if (rule.min != null && listed2 < rule.min) msgs.push(`<span class="warn">${L("inventory.belowYourMinimum", { min: f(rule.min) })}</span>`);
      if (ref && listed2 < ref * 0.75) msgs.push(`<span class="err">${L("inventory.belowTheLowestPriceOn", { listed: Math.round((1 - listed2 / ref) * 100) })}</span>`);
      box2.innerHTML = msgs.join("<br>");
    };
    const html = `${esc(it.name)}${g.qty > 1 ? ` <b>\xD7${g.qty}</b>` : ""}
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin:10px 0">${presets.map((x) => `<button class="b" data-set="${x.p}" style="display:flex;flex-direction:column;align-items:flex-start;gap:2px;padding:6px 10px;text-align:left"><span>${x.label}: <b>${f(x.p)}</b></span>${x.sub ? `<span class="sub">${esc(x.sub)}</span>` : ""}</button>`).join("")}</div>
    <label style="display:flex;align-items:center;gap:8px">${L("inventory.priceTheBuyerPays")}<input class="p" id="ls-price" value="${toInput(presets[0]?.p ?? "")}" style="width:90px"></label>
    <div id="ls-info" class="sub" style="margin-top:8px;min-height:3.6em;line-height:1.5"></div>`;
    const price = await ask(L("inventory.listOnTheMarket"), html, {
      ok: L("inventory.list"),
      collect: (m) => parsePrice(m.querySelector("#ls-price").value),
      onOpen: (m) => {
        const inp = m.querySelector("#ls-price");
        inp.addEventListener("input", () => info2(m));
        inp.addEventListener("keydown", (e) => {
          if (e.key === "Enter") m.querySelector('[data-r="1"]').click();
        });
        m.querySelectorAll("[data-set]").forEach((b) => b.addEventListener("click", () => {
          inp.value = toInput(+b.dataset.set);
          info2(m);
          inp.focus();
        }));
        info2(m);
        inp.focus();
        inp.select();
      }
    });
    if (price === false) return;
    if (isNaN(price) || price < MIN_BUYER) return log(L("inventory.invalidPriceNothingListed"), "warn");
    await sell([{ g, price }]);
  }
  var sellPlans = bucket("sellPlans");
  var planOf = (hash) => sellPlans.get(hash) || null;
  var planChip = (it) => {
    const p = planOf(it.hash);
    if (!p) return "";
    const how = (p.mode === "fixed" ? L("inventory.for", { price: fmt(p.price) }) : L("inventory.atTheSuggestedPrice", { min: p.min != null ? `, min. ${fmt(p.min)}` : "" })) + (p.guard ? L("inventory.thenTheAutomationWatchesThe") : "");
    return `<span class="sig plan" data-q="plan" title="${esc(L("inventory.plannedSaleClickToChange", { until: fmtWhen(p.until), how, qty: p.qty > 1 ? L("inventory.ofPcs", { qty: p.qty }) : "" }))}">\u23F0 ${L("inventory.illList")} ${esc(fmtWhen(p.until))}</span>`;
  };
  async function planDialog(g) {
    const it = g.rep, f = fmt;
    const old = planOf(it.hash);
    const until = lockUntil(it.lock);
    const h = await hist(it.appid, it.hash).catch(() => null);
    const a = adviceOf(it, h);
    const today = a?.price ?? unitPrice(it).v ?? null;
    const html = `${esc(it.name)}${g.qty > 1 ? ` <b>\xD7${g.qty}</b>` : ""}
    <div class="sub" style="margin:4px 0 10px">${L("inventory.lockedUntilThenFlipsterLists", { until: esc(fmtWhen(until)) })}</div>
    <label style="display:flex;gap:8px;align-items:center;margin:6px 0"><input type="radio" name="pl-m" value="advice" ${old?.mode !== "fixed" ? "checked" : ""}> ${L("inventory.suggestedPriceOfTheUnlock")}${today ? ` <span class="sub">(${L("inventory.today")}: ${f(today)})</span>` : ""}</label>
    <label class="sub" style="display:flex;gap:8px;align-items:center;margin:0 0 6px 26px">${L("inventory.notBelow")} <input class="p" id="pl-min" value="${toInput(old?.min ?? null)}" placeholder="${L("inventory.noLimit")}" style="width:90px"> z\u0142</label>
    <label style="display:flex;gap:8px;align-items:center;margin:6px 0"><input type="radio" name="pl-m" value="fixed" ${old?.mode === "fixed" ? "checked" : ""}> ${L("inventory.fixedPrice")} <input class="p" id="pl-price" value="${toInput(old?.price ?? today ?? null)}" style="width:80px"> z\u0142 <span class="sub">${L("inventory.theBuyerPays")}</span></label>
    ${g.qty > 1 ? `<label style="display:flex;gap:8px;align-items:center;margin:10px 0 0">${L("inventory.howMany")} <input type="number" id="pl-qty" min="1" max="${g.qty}" value="${Math.min(old?.qty ?? g.qty, g.qty)}" style="width:70px"> ${L("inventory.of")} ${g.qty}</label>` : ""}
    <label style="display:flex;gap:8px;align-items:flex-start;margin:12px 0 0"><input type="checkbox" id="pl-guard" ${old?.guard ? "checked" : ""} style="margin-top:2px"><span>${L("inventory.afterListingLetTheAutomation")}<br><span class="sub">${L("inventory.itUndercutsCheaperOnesBut")}${settings.autoRelist ? "" : L("inventory.theAutomationIsOffNow")}</span></span></label>
    ${old ? `<label style="display:flex;gap:8px;align-items:center;margin:12px 0 0"><input type="checkbox" id="pl-del"> ${L("inventory.removeThisPlan")}</label>` : ""}`;
    const r = await ask(old ? L("inventory.salePlan") : L("inventory.planASale"), html, {
      ok: old ? L("inventory.save") : L("inventory.plan"),
      collect: (m) => ({
        del: !!m.querySelector("#pl-del")?.checked,
        guard: !!m.querySelector("#pl-guard")?.checked,
        mode: m.querySelector('input[name="pl-m"]:checked')?.value || "advice",
        min: parsePrice(m.querySelector("#pl-min").value),
        price: parsePrice(m.querySelector("#pl-price").value),
        qty: Math.max(1, Math.min(g.qty, parseInt(m.querySelector("#pl-qty")?.value, 10) || g.qty))
      }),
      onOpen: (m) => {
        m.querySelector("#pl-price").addEventListener("input", () => {
          m.querySelector('input[value="fixed"]').checked = true;
        });
        m.querySelector("#pl-min").addEventListener("input", () => {
          m.querySelector('input[value="advice"]').checked = true;
        });
      }
    });
    if (!r) return;
    if (r.del) {
      sellPlans.del(it.hash);
      log(L("inventory.salePlanRemoved", { hash: it.hash }));
      render();
      return;
    }
    if (r.mode === "fixed" && (isNaN(r.price) || r.price < MIN_BUYER)) return log(L("inventory.enterAFixedPriceE"), "warn");
    const min = r.mode === "advice" && !isNaN(r.min) && r.min >= MIN_BUYER ? r.min : null;
    if (r.guard && r.mode !== "fixed" && min == null) return log(L("inventory.theAutomationNeedsALower"), "warn");
    sellPlans.set(it.hash, { name: it.name, icon: it.icon, color: it.color, appid: it.appid || 730, qty: r.qty, until, mode: r.mode, price: r.mode === "fixed" ? r.price : null, min, guard: r.guard, at: Date.now() });
    log(L("inventory.plannedTheSaleOfFor", { hash: it.hash, qty: r.qty > 1 ? ` \xD7${r.qty}` : "", until: fmtWhen(until), mode: r.mode === "fixed" ? L("inventory.for", { price: f(r.price) }) : L("inventory.atTheSuggestedPrice", { min: min != null ? L("inventory.notBelow2", { min: f(min) }) : "" }), guard: r.guard ? L("inventory.thenTheAutomationWatchesThe") : "" }), "ok");
    render();
  }
  var planBusy = false;
  async function planTick() {
    if (planBusy || !isLeader()) return;
    const due = Object.entries(sellPlans.all()).filter(([, p]) => (!p.until || p.until <= Date.now()) && !(p.nextTry > Date.now()));
    if (!due.length) return;
    planBusy = true;
    let listedAny = false;
    try {
      if (!await ensureLogin()) return;
      const invs = /* @__PURE__ */ new Map();
      for (const [hash, p] of due) {
        const appid = +p.appid || 730;
        if (!invs.has(appid)) invs.set(appid, await inventory(void 0, appid, appid === 753 ? 6 : 2).catch(() => null));
        const inv2 = invs.get(appid);
        if (!inv2) continue;
        const copies = inv2.filter((i) => i.hash === hash && i.marketable).slice(0, p.qty || 1);
        if (!copies.length) {
          if (p.until && Date.now() - p.until > 3 * 864e5) {
            sellPlans.del(hash);
            log(L("inventory.plannedSaleOf3Days", { hash }), "warn");
          } else if (p.until && Date.now() - p.until > 30 * 6e4) sellPlans.set(hash, { ...p, nextTry: Date.now() + 10 * 6e4 });
          continue;
        }
        let price = p.mode === "fixed" ? p.price : null, note = "";
        if (p.mode !== "fixed") {
          try {
            await ensure3([{ hash, appid }]);
          } catch {
          }
          const h = await hist(appid, hash).catch(() => null);
          const a = h ? adviceOf(copies[0], h) : null;
          price = a?.price ?? p.min ?? null;
          if (p.min != null && price < p.min) {
            price = p.min;
            note = L("inventory.raisedToYourMinimum");
          }
        }
        if (price == null || price < MIN_BUYER) {
          if (!p.warnAt || Date.now() - p.warnAt > 30 * 6e4) {
            sellPlans.set(hash, { ...p, warnAt: Date.now() });
            log(L("inventory.plannedSaleOfNoMarket", { hash }), "warn");
          }
          continue;
        }
        sellPlans.del(hash);
        const r = await sellMany(copies.map((item) => ({ item, price, amount: 1 })), { log: (m, c) => log(`${L("inventory.plannedSale")}: ${m}`, c) });
        log(L("inventory.plannedSaleOfListedOf", { hash, ok: r.ok, copies: copies.length, price: fmt(price), note, confirm: r.confirm ? L("inventory.confirmInTheSteamApp") : "" }), r.ok ? "ok" : "err");
        if (r.ok) {
          listedAny = true;
          const floor = p.mode === "fixed" ? p.price : p.min;
          if (p.guard && floor != null) {
            sellRules.patch(hash, { auto: true, min: floor });
            log(L("inventory.theAutomationWatchesThePrice", { hash, floor: fmt(floor), autoRelist: settings.autoRelist ? "" : L("inventory.theAutomationIsOffTurn") }), settings.autoRelist ? "ok" : "warn");
          }
        } else sellPlans.set(hash, p);
      }
    } catch (e) {
      log(`${L("inventory.plannedSale")}: ${e.message}`, "warn");
    } finally {
      planBusy = false;
    }
    if (listedAny && el) load3();
  }
  function startSellPlans() {
    setTimeout(planTick, 2e4);
    setInterval(planTick, 6e4);
  }
  async function quickSell(key, mode) {
    const g = groups().find((x) => x.key === key);
    if (!g) return;
    try {
      if (mode !== "instant") return await listDialog(g);
      const { price, note } = await priceFor(g, "instant");
      if (!price) return log(`${g.hash}: ${note}`, "warn");
      const recv = receivedFromBuyer2(price);
      const ref = unitPrice(g.rep).v;
      const warn = ref && price < ref * 0.75 ? `<br><span class="err">${L("inventory.carefulBelowTheLowestPrice", { price: Math.round((1 - price / ref) * 100) })}</span>` : "";
      const ok = await ask(
        mode === "instant" ? L("inventory.sellImmediately") : L("inventory.quickSale"),
        `${esc(g.rep.name)}${g.qty > 1 ? ` \xD7${g.qty}` : ""}<br>${L("inventory.price2")}: <b>${fmt(price)}</b> (${esc(note)})<br>${L("inventory.youGet4")}: <b>${fmt(recv * g.qty)}</b>${warn}`,
        { ok: L("inventory.list") }
      );
      if (!ok) return;
      await sell([{ g, price }]);
    } catch (e) {
      log(`${g.hash}: ${e.message}`, "err");
    }
  }
  async function sellDialog(gs) {
    gs = gs.filter((g) => g.rep.marketable && !g.rep.listed);
    if (!gs.length) return log(L("inventory.selectSellableItems"), "warn");
    const okMode = await ask(L("inventory.bulkSale"), `
    <div style="display:flex;flex-direction:column;gap:8px">
      <label><input type="radio" name="sm" value="advice" checked> ${L("inventory.suggestedTheHighestPriceThat", { maxWaitDays: settings.maxWaitDays ?? 2 })}</label>
      <label><input type="radio" name="sm" value="lowest"> ${L("inventory.lowestPriceUndercutNotBelow", { undercut: fmt(settings.undercut) })}</label>
      <label><input type="radio" name="sm" value="instant"> ${L("inventory.immediatelyToTheHighestBuy")}</label>
      <label><input type="radio" name="sm" value="saved"> ${L("inventory.savedTargetPrices")}</label>
      <label><input type="radio" name="sm" value="fixed"> ${L("inventory.fixedPrice")}: <input class="p" id="sm-fixed"></label>
      <div class="sub">${L("inventory.entriesInTheNextStep", { gs: gs.length })}</div>
    </div>`, {
      ok: L("inventory.next"),
      collect: (m) => ({ mode: m.querySelector('input[name="sm"]:checked')?.value || "advice", fixed: parsePrice(m.querySelector("#sm-fixed")?.value) })
    });
    if (!okMode) return;
    const { mode, fixed } = okMode;
    if (mode === "fixed" && isNaN(fixed)) return log(L("inventory.enterAFixedPrice"), "warn");
    task = token();
    const plan = [];
    let i = 0;
    for (const g of gs) {
      if (task.cancelled) break;
      progress(++i, gs.length);
      try {
        plan.push({ g, ...await priceFor(g, mode, fixed) });
      } catch (e) {
        plan.push({ g, price: null, note: e.message });
        if (e.status === 429) break;
      }
    }
    progress(0);
    const table = `<div style="max-height:50vh;overflow:auto"><table><tr><th>${L("inventory.item")}</th><th>${L("inventory.price2")}</th><th>${L("inventory.youGet4")}</th></tr>${plan.map((p, j) => `
    <tr><td>${esc(p.g.rep.name)}${p.g.qty > 1 ? ` \xD7${p.g.qty}` : ""}<div class="sub">${esc(p.note)}</div></td>
    <td><input class="p" data-j="${j}" value="${toInput(p.price)}"></td><td class="sub">${p.price ? fmt(receivedFromBuyer2(p.price) * p.g.qty) : "-"}</td></tr>`).join("")}</table></div>
    <div class="sub" style="margin-top:8px">${L("inventory.totalYouGet")}: <b>${fmt(plan.reduce((s, p) => s + (p.price ? receivedFromBuyer2(p.price) * p.g.qty : 0), 0))}</b>. ${L("inventory.anEmptyFieldSkip")}</div>`;
    const edited = await ask(L("inventory.confirmThePrices"), table, {
      ok: L("inventory.list"),
      wide: true,
      collect: (m) => [...m.querySelectorAll("input[data-j]")].map((inp) => {
        const v = inp.value.trim() ? parsePrice(inp.value) : null;
        return { j: +inp.dataset.j, v: v == null || isNaN(v) ? null : Math.max(MIN_BUYER, v) };
      })
    });
    if (!edited) return;
    for (const { j, v } of edited) plan[j].price = v;
    const final = plan.filter((p) => p.price);
    const ref = final.filter((p) => {
      const u = unitPrice(p.g.rep).v;
      return u && p.price < u * 0.75;
    });
    if (ref.length && !await ask(L("inventory.carefulLowPrices"), L("inventory.entriesHaveAPriceOver", { ref: ref.length }), { ok: L("inventory.yesList"), danger: true })) return;
    await sell(final);
  }
  async function sell(plan) {
    const jobs = plan.flatMap(({ g, price }) => g.items.map((it) => ({ item: it, price, amount: it.amount })));
    task = token();
    await withLock("sell", async () => {
      const r = await sellMany(jobs, {
        log,
        isCancelled: () => task.cancelled,
        onStatus: () => {
        }
      });
      log(L("inventory.saleListedErrors", { ok: r.ok, failed: r.failed }), r.failed ? "warn" : "ok");
      if (r.confirm) log(L("inventory.listingsWaitForConfirmationIn", { confirm: r.confirm }), "warn");
    });
    const sold = new Set(jobs.map((j) => j.item.assetid));
    items = items.filter((it) => !sold.has(it.assetid));
    sel.clear();
    render();
    loadListed().then(render);
  }
  async function unlist(key) {
    const g = groups().find((x) => x.key === key);
    if (!g) return;
    const n = g.items.length;
    const ok = await ask(L("inventory.takeOffTheMarket"), `${esc(g.rep.name)}${g.rep.nameTag ? ` (\u201C${esc(g.rep.nameTag)}\u201D)` : ""}${n > 1 ? L("inventory.listings", { n }) : ""} ${L("inventory.for2")} ${fmt(g.rep.listPrice)}.<br>${L("inventory.theItemReturnsToThe")}`, { ok: L("inventory.takeOff"), danger: true });
    if (!ok) return;
    await withLock("unlist", async () => {
      for (const it of g.items) {
        const r = await removeListing(it.listingid);
        log(r.ok ? L("inventory.takenOffTheMarket", { name: it.name }) : L("inventory.couldntTakeOffHttp", { name: it.name, status: r.status }), r.ok ? "ok" : "err");
      }
    });
    load3();
  }
  var badgeData = null;
  async function initBadges() {
    if (!settings.badges || !/\/inventory\/?/.test(location.pathname)) return;
    const owner = [...document.scripts].map((s) => s.textContent.match(/UserYou\.SetSteamId\(\s*'(\d{17})'/)).find(Boolean)?.[1] || location.pathname.match(/\/profiles\/(\d{17})/)?.[1] || ctx().steamId;
    badgeData = /* @__PURE__ */ new Map();
    const target = document.getElementById("inventories") || document.body;
    let pending = false;
    new MutationObserver(() => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        updateBadges();
      });
    }).observe(target, { childList: true, subtree: true });
    updateBadges();
    if (!owner) return;
    const contexts = discoverContexts();
    for (const ctxId of contexts) {
      for (let attempt = 0; attempt < (ctxId === 2 ? 4 : 2); attempt++) {
        try {
          const inv2 = await inventory(owner, 730, ctxId, { maxAgeMin: 10 });
          for (const i of inv2) badgeData.set(i.assetid, i);
          break;
        } catch (e) {
          console.warn(`[Flipster] badges, context ${ctxId}: ${e.message}, attempt ${attempt + 1}`);
          if (e.status === 403 || e.status === 400 || e.status === 500) break;
          await new Promise((r) => setTimeout(r, 15e3 * (attempt + 1)));
        }
      }
    }
    if (owner === ctx().steamId) {
      try {
        const { listings } = await myListings();
        badgeListings = new Map(listings.map((l) => [l.assetid, l]));
        for (const l of listings) if (!badgeData.has(l.assetid)) badgeData.set(l.assetid, recallProps(l.item));
      } catch (e) {
        console.warn("[Flipster] badges, market listings", e.message);
      }
    }
    for (const [id, it] of badgeData) badgeData.set(id, recallProps(it));
    updateBadges();
    const list2 = [...new Map([...badgeData.values()].filter((i) => i.hash).map((i) => [i.hash, { appid: i.appid, hash: i.hash }])).values()];
    let last = 0;
    lowestPrices(list2, { onEach: () => {
      if (Date.now() - last > 2e3) {
        last = Date.now();
        updateBadges();
      }
    } }).then(updateBadges);
  }
  function discoverContexts() {
    let ids = [];
    try {
      const w = pageWin();
      let data3 = w.g_rgAppContextData;
      if (!data3) {
        const m = [...document.scripts].map((s) => s.textContent.match(/g_rgAppContextData\s*=\s*(\{[\s\S]*?\});\s*\n/)).find(Boolean);
        if (m) data3 = JSON.parse(m[1]);
      }
      ids = Object.keys(data3?.[730]?.rgContexts || {}).map(Number).filter((n) => n > 0);
    } catch {
    }
    if (ids.length) set("ctx730", ids);
    else ids = get("ctx730", [2]);
    if (!ids.includes(2)) ids.unshift(2);
    if (!ids.includes(16)) ids.push(16);
    return [...new Set(ids)].sort((a, b) => a === 2 ? -1 : b === 2 ? 1 : a - b);
  }
  var pageWin = () => {
    try {
      return typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
    } catch {
      return window;
    }
  };
  function pageAsset(node, assetid) {
    try {
      const w = pageWin();
      const ctxId = +node.id.replace(/^item/, "").split("_")[1] || 2;
      const invs = [w.g_ActiveInventory, w.UserYou?.getInventory?.(730, ctxId), w.UserYou?.getInventory?.(730, 2)].filter(Boolean);
      for (const inv2 of [...invs]) if (inv2.m_rgChildInventories) invs.push(...Object.values(inv2.m_rgChildInventories));
      for (const inv2 of invs) {
        const a = inv2.m_rgAssets?.[assetid] || inv2.rgInventory?.[assetid];
        if (a) return a;
      }
      const el7 = w.document?.getElementById?.(node.id);
      return el7?.rgItem || node.rgItem || null;
    } catch {
      return null;
    }
  }
  function fromPage(node, assetid) {
    const r = pageAsset(node, assetid);
    if (!r) return null;
    const d = r.description || r;
    if (!d.market_hash_name) return null;
    try {
      const it = describeItem(
        { appid: r.appid ?? d.appid ?? 730, contextid: r.contextid ?? "2", assetid, classid: d.classid ?? r.classid, instanceid: d.instanceid ?? r.instanceid, amount: r.amount },
        d,
        r.asset_properties || d.asset_properties || []
      );
      queuePricing(it);
      return recallProps(it);
    } catch {
      return null;
    }
  }
  var pricingQueue = /* @__PURE__ */ new Map();
  var pricingTimer = null;
  function queuePricing(it) {
    if (!it.hash || hasLowest(it.appid, it.hash, 360)) return;
    pricingQueue.set(it.hash, { appid: it.appid, hash: it.hash });
    clearTimeout(pricingTimer);
    pricingTimer = setTimeout(() => {
      const list2 = [...pricingQueue.values()];
      pricingQueue.clear();
      let last = 0;
      lowestPrices(list2, { onEach: () => {
        if (Date.now() - last > 1500) {
          last = Date.now();
          updateBadges();
        }
      } }).then(updateBadges);
    }, 800);
  }
  function listingFor(assetid, it) {
    const byId = badgeListings.get(assetid);
    if (byId) return byId;
    if (!it?.hash || it.marketable) return null;
    const used = /* @__PURE__ */ new Set([...badgeListingUse.values()]);
    const prev = badgeListingUse.get(assetid);
    if (prev) return prev;
    const l = [...badgeListings.values()].find((x) => x.hash === it.hash && !used.has(x));
    if (l) badgeListingUse.set(assetid, l);
    return l || null;
  }
  var badgeListingUse = /* @__PURE__ */ new Map();
  var badgeIds = null;
  var badgeListings = /* @__PURE__ */ new Map();
  var pageTried = /* @__PURE__ */ new Set();
  function updateBadges() {
    if (!badgeData) return;
    document.querySelectorAll(badgeIds ||= '.item[id^="730_"], .item[id^="item730_"]').forEach((node) => {
      const assetid = node.id.split("_")[2];
      let it = badgeData.get(assetid);
      if ((!it || !it.hash || it.float == null) && !pageTried.has(assetid)) {
        const pg = fromPage(node, assetid);
        if (pg) {
          pageTried.add(assetid);
          it = it?.hash ? { ...pg, ...it, float: it.float ?? pg.float, seed: it.seed ?? pg.seed, nameTag: it.nameTag || pg.nameTag } : pg;
          badgeData.set(assetid, it);
        }
      }
      if (!it) return;
      let b = node.querySelector(".stt-badge");
      const up = unitPrice(it);
      const lst = listingFor(assetid, it) || (it.sealed === "listed" ? { buyer: null } : null);
      const fl = `<span class="f">${it.nameTag ? "\u{1F3F7}" : ""}${it.float != null ? it.float.toFixed(3) : ""}</span>`;
      let html;
      if (lst) {
        const beaten = lst.buyer != null && up.v != null && up.src === "steam" && up.v < lst.buyer;
        html = `<span title="${L("inventory.lowestPriceOnTheMarket")}">${up.v ? fmt(up.v) : ""}</span>${fl}<span class="l ${beaten ? "bad" : ""}">\u{1F6D2} ${lst.buyer != null ? fmt(lst.buyer) : L("inventory.onTheMarket")}</span>`;
      } else {
        if (!up.v && it.float == null && !it.nameTag) return;
        html = `<span>${up.v ? fmt(up.v) : ""}</span>${fl}`;
      }
      if (!b) {
        b = document.createElement("div");
        b.className = "stt-badge";
        node.appendChild(b);
      }
      b.classList.toggle("two", !!lst);
      if (b.innerHTML !== html) b.innerHTML = html;
    });
  }

  // src/features/history.js
  var kindName = (k) => ({ wymiana: L("history.trade"), rynek: L("history.market"), skrzynia: L("history.case"), kontrakt: L("history.contract"), naklejka: L("history.sticker"), otrzymane: L("history.received"), inne: L("history.other") })[k] || k;
  var el2;
  var task2;
  var period = 0;
  var game = "all";
  var sort = sorter("result");
  var txSort = sorter("t");
  var view = get("histView", "tx");
  var PER_PAGE = 50;
  var pages = { tx: 0, ih: 0, cs: 0 };
  function pageOf(key, list2) {
    const n = Math.max(1, Math.ceil(list2.length / PER_PAGE));
    pages[key] = Math.min(pages[key], n - 1);
    return list2.slice(pages[key] * PER_PAGE, (pages[key] + 1) * PER_PAGE);
  }
  function renderPager(key, total) {
    const box2 = el2.querySelector("#" + key + "-pg");
    if (!box2) return;
    const n = Math.ceil(total / PER_PAGE);
    if (n <= 1) {
      box2.innerHTML = "";
      return;
    }
    const p = pages[key];
    const nums = [.../* @__PURE__ */ new Set([0, 1, p - 2, p - 1, p, p + 1, p + 2, n - 2, n - 1])].filter((i) => i >= 0 && i < n).sort((a, b) => a - b);
    let html = `<button class="b" data-pg="${key}" data-to="${p - 1}" ${p ? "" : "disabled"}>\u2039</button>`;
    nums.forEach((i, j) => {
      if (j && i - nums[j - 1] > 1) html += '<span class="sub">\u2026</span>';
      html += `<button class="b ${i === p ? "on" : ""}" data-pg="${key}" data-to="${i}">${i + 1}</button>`;
    });
    html += `<button class="b" data-pg="${key}" data-to="${p + 1}" ${p < n - 1 ? "" : "disabled"}>\u203A</button>`;
    html += `<span class="sub" style="margin-left:8px">${p * PER_PAGE + 1}-${Math.min(total, (p + 1) * PER_PAGE)} ${L("history.of")} ${total}</span>`;
    box2.innerHTML = html;
  }
  function applyTab() {
    const t = get("histTab", "tx");
    for (const b of el2.querySelectorAll("[data-ht]")) b.classList.toggle("on", b.dataset.ht === t);
    for (const b of el2.querySelectorAll(".sec-b[data-sec]")) b.hidden = b.dataset.sec !== t;
  }
  var meta = bucket("itemMeta");
  var PAGE = 100;
  var TRADES_FMT = 6;
  async function loadAnchors() {
    const cached3 = get("histAnchors", null);
    if (cached3) return cached3;
    const exact = {};
    const pts = [];
    for (let start = 0, total = Infinity; start < total; start += 500) {
      const d = await myHistoryPage(start, 500);
      if (!d.success) break;
      total = d.total_count || 0;
      const evs = d.events || [];
      for (const ev of evs) {
        if (!ev.purchaseid || ev.purchaseid === "0") continue;
        const t = (ev.time_event || 0) * 1e3;
        exact[`${ev.listingid}_${ev.purchaseid}`] = t;
        pts.push([Number(ev.purchaseid), t]);
      }
      if (!evs.length) break;
    }
    pts.sort((a2, b) => a2[0] - b[0]);
    const a = { exact, pts };
    set("histAnchors", a);
    return a;
  }
  function makeDateOf(anchors, top) {
    const pts = [...anchors.pts];
    if (top) pts.push(top);
    pts.sort((a, b) => a[0] - b[0]);
    const approx = (pid) => {
      if (pts.length < 2) return null;
      let i = pts.findIndex((p) => p[0] >= pid);
      if (i === -1) i = pts.length - 1;
      if (i === 0) i = 1;
      const [x0, t0] = pts[i - 1], [x1, t1] = pts[i];
      return x1 === x0 ? t0 : t0 + (pid - x0) / (x1 - x0) * (t1 - t0);
    };
    return ({ listingid, purchaseid, month, day: day2, guess }) => {
      const ex = anchors.exact[`${listingid}_${purchaseid}`];
      if (ex) return ex;
      const est2 = approx(Number(purchaseid));
      if (est2 == null) return guess;
      const y0 = new Date(est2).getFullYear();
      let best = guess, bestD = Infinity;
      for (const y of [y0 - 1, y0, y0 + 1]) {
        const t = new Date(y, month, day2, 12, 0).getTime();
        if (t > Date.now() + 864e5) continue;
        const dd = Math.abs(t - est2);
        if (dd < bestD) {
          bestD = dd;
          best = t;
        }
      }
      return best;
    };
  }
  var loadTrades = () => get("trades", {});
  var saveTrades = (t) => set("trades", t);
  var CUR_NAME = { 1: "USD", 2: "GBP", 3: "EUR", 5: "RUB", 6: "PLN", 7: "BRL", 17: "TRY", 18: "UAH", 20: "CAD", 21: "AUD", 23: "CNY" };
  var FX_ITEM = [440, "Mann Co. Supply Crate Key"];
  var fx = bucket("fx");
  var fxLoading = /* @__PURE__ */ new Set();
  function rateFor(cur) {
    const w = wallet().currency;
    if (!cur || cur === w) return 1;
    const c = fx.get(String(cur));
    if (c && Date.now() - c.at < 864e5) return c.r;
    if (!fxLoading.has(cur)) {
      fxLoading.add(cur);
      Promise.all([priceOverview(FX_ITEM[0], FX_ITEM[1], cur), priceOverview(FX_ITEM[0], FX_ITEM[1], w)]).then(([a, b]) => {
        const r = (b.median || b.lowest) / (a.median || a.lowest);
        if (isFinite(r) && r > 0) {
          fx.set(String(cur), { r, at: Date.now() });
          log(L("history.rateToFromSteamPrices", { CUR_NAME: CUR_NAME[cur] || cur, CUR_NAME2: CUR_NAME[w] || w, r: r.toFixed(3) }));
          invalidate();
          render2();
        }
      }).catch((e) => log(L("history.couldntGetTheExchangeRate", { CUR_NAME: CUR_NAME[cur] || cur, message: e.message }), "warn")).finally(() => fxLoading.delete(cur));
    }
    return c ? c.r : null;
  }
  var nbp = bucket("nbp");
  var day = (ts) => new Date(ts).toISOString().slice(0, 10);
  function nbpMid(code, ts) {
    if (code === "PLN") return 1;
    const m = nbp.get(code);
    if (!m) return null;
    for (let i = 0; i < 10; i++) {
      const v = m[day(ts - i * 864e5)];
      if (v) return v;
    }
    return null;
  }
  var nbpBusy = false;
  var nbpTried = /* @__PURE__ */ new Set();
  async function ensureNbp(trades) {
    if (nbpBusy) return;
    const w = wallet().currency;
    const need = /* @__PURE__ */ new Map();
    for (const t of trades) {
      if (!t.cur || t.cur === w) continue;
      for (const code of [CUR_NAME[t.cur], CUR_NAME[w]]) {
        if (!code || code === "PLN" || nbpMid(code, t.t) != null || nbpTried.has(code + "|" + day(t.t))) continue;
        nbpTried.add(code + "|" + day(t.t));
        (need.get(code) || need.set(code, []).get(code)).push(t.t);
      }
    }
    if (!need.size) return;
    nbpBusy = true;
    try {
      for (const [code, tss] of need) {
        tss.sort((a, b) => a - b);
        let i = 0;
        while (i < tss.length) {
          const from = tss[i] - 10 * 864e5;
          const to = Math.min(from + 92 * 864e5, Date.now());
          const url = `https://api.nbp.pl/api/exchangerates/rates/a/${code.toLowerCase()}/${day(from)}/${day(to)}/?format=json`;
          try {
            const d = await schedule("ext", () => gmJSON(url));
            const m = nbp.get(code) || {};
            for (const r of d.rates || []) m[r.effectiveDate] = r.mid;
            nbp.set(code, m);
          } catch (e) {
            console.warn("[Flipster] NBP", code, e.message);
          }
          while (i < tss.length && tss[i] <= to) i++;
        }
      }
      log(L("history.historyDownloadedHistoricalExchangeRates"), "ok");
    } finally {
      nbpBusy = false;
    }
    invalidate();
    render2();
  }
  var CUR_ID = Object.fromEntries(Object.entries(CUR_NAME).map(([id, c]) => [c, +id]));
  function storeConv(amount, cur, t) {
    if (!cur) return amount;
    const id = CUR_ID[cur];
    if (!id) return null;
    const { r } = histRate(id, t);
    return r == null ? null : Math.round(amount * r);
  }
  function histRate(cur, ts) {
    const w = wallet().currency;
    if (!cur || cur === w) return { r: 1 };
    const a = nbpMid(CUR_NAME[cur], ts), b = nbpMid(CUR_NAME[w], ts);
    if (a && b) return { r: a / b, src: "nbp" };
    const now = rateFor(cur);
    return now == null ? { r: null } : { r: now, src: "now" };
  }
  var est = bucket("estPrices");
  var estLoading = /* @__PURE__ */ new Set();
  var estTried = /* @__PURE__ */ new Set();
  var estFail = bucket("estFail");
  if (!get("estFailMig1", false)) {
    for (const h of Object.keys(estFail.all())) if (/^\d+-/.test(h)) estFail.del(h);
    set("estFailMig1", true);
  }
  var noMarket = (hash) => /^Graffiti \|/.test(hash) || Date.now() - (estFail.get(hash) || 0) < 7 * 864e5;
  function estimate(appid, hash, ts) {
    if (/^\d+-/.test(hash)) appid = "753";
    const k = `${hash}|${Math.floor(ts / 36e5)}`;
    const v = est.get(k);
    if (v != null) return v;
    if (noMarket(hash)) return null;
    if (!estLoading.has(hash) && !estTried.has(k)) {
      estLoading.add(hash);
      priceHistory(appid, hash).then((pts) => {
        for (const kk of Object.keys(est.all())) if (kk.startsWith(hash + "|")) estTried.add(kk);
        for (const t of pendingEst.get(hash) || []) {
          let win = pts.filter((p) => Math.abs(p.t - t) <= 12 * 36e5);
          if (!win.length) win = pts.filter((p) => Math.abs(p.t - t) <= 3 * 864e5);
          const vol = win.reduce((s, p) => s + (p.vol || 1), 0);
          const kk = `${hash}|${Math.floor(t / 36e5)}`;
          estTried.add(kk);
          if (vol) est.set(kk, Math.round(win.reduce((s, p) => s + p.price * (p.vol || 1), 0) / vol));
        }
        invalidate();
        render2();
        renderInv();
        bus.emit("estimated");
      }).catch((e) => {
        if (e.status === 500 || e.status === 400 || /brak historii|no price history/i.test(e.message)) estFail.set(hash, Date.now());
        else console.warn("[Flipster] szacowanie ceny", hash, e.message);
        (pendingEst.get(hash) || []).forEach((t) => estTried.add(`${hash}|${Math.floor(t / 36e5)}`));
      }).finally(() => estLoading.delete(hash));
    }
    (pendingEst.get(hash) || pendingEst.set(hash, /* @__PURE__ */ new Set()).get(hash)).add(ts);
    return null;
  }
  var pendingEst = /* @__PURE__ */ new Map();
  var numCmp = new Intl.Collator(void 0, { numeric: true }).compare;
  function marketTimed() {
    const market = Object.entries(loadTrades()).map(([key, t]) => ({ ...t, key }));
    const day2 = (t) => {
      const d = new Date(t);
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    };
    const noon = (t) => {
      const d = new Date(t);
      return d.getHours() === 12 && !d.getMinutes() && !d.getSeconds() && !d.getMilliseconds();
    };
    const times = /* @__PURE__ */ new Map();
    for (const e of all()) {
      if (e.kind !== "rynek") continue;
      const buy = /purchased/i.test(e.desc), sell2 = /sold/i.test(e.desc);
      if (!buy && !sell2) continue;
      for (const it of buy ? e.plus : e.minus) if (it.hash) {
        const k = `${buy ? "buy" : "sell"}|${it.hash}|${day2(e.t)}`;
        (times.get(k) || times.set(k, []).get(k)).push(e.t);
      }
    }
    const rows3 = /* @__PURE__ */ new Map();
    for (const t of market) if (noon(t.t)) {
      const k = `${t.type}|${t.hash}|${day2(t.t)}`;
      (rows3.get(k) || rows3.set(k, []).get(k)).push(t);
    }
    const exact = /* @__PURE__ */ new Map();
    for (const [k, rs] of rows3) {
      const ts = (times.get(k) || []).sort((a, b) => a - b);
      if (!ts.length) continue;
      rs.sort((a, b) => numCmp(String(a.key), String(b.key)));
      rs.forEach((r, i) => {
        if (i < ts.length) exact.set(r.key, ts[i]);
      });
    }
    for (const t of market) if (exact.has(t.key)) t.t = exact.get(t.key);
    return market;
  }
  function invHistoryTrades(marketTrades) {
    const day2 = (t) => {
      const d = new Date(t);
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    };
    const newestMarket = marketTrades.reduce((m, t) => Math.max(m, t.t), 0);
    const newestDay = newestMarket ? day2(newestMarket) : null;
    const have = /* @__PURE__ */ new Map();
    for (const t of marketTrades) {
      const k = `${t.type}|${t.hash}|${day2(t.t)}`;
      have.set(k, (have.get(k) || 0) + (t.amount || 1));
    }
    const syncedAt3 = get("tradesSyncedAt", 0);
    const cand = [];
    for (const e of all()) {
      if (e.kind !== "rynek") continue;
      if (syncedAt3 ? e.t <= syncedAt3 : e.t <= newestMarket + 6e4 && day2(e.t) !== newestDay) continue;
      const buy = /purchased/i.test(e.desc);
      const sell2 = /sold/i.test(e.desc);
      if (!buy && !sell2) continue;
      (buy ? e.plus : e.minus).forEach((it, i) => {
        if (!it.hash) return;
        if (!meta.get(it.hash) && it.icon) meta.set(it.hash, { name: it.name, icon: it.icon, color: it.color, appid: "730" });
        cand.push({ key: `ih|${e.id}|${i}`, t: e.t, type: buy ? "buy" : "sell", hash: it.hash, appid: "730", amount: 1, price: null, cur: null, estimated: true });
      });
    }
    cand.sort((a, b) => a.t - b.t);
    if (syncedAt3) return cand;
    const used = /* @__PURE__ */ new Map();
    return cand.filter((c) => {
      const k = `${c.type}|${c.hash}|${day2(c.t)}`;
      const u = used.get(k) || 0;
      used.set(k, u + 1);
      return u >= (have.get(k) || 0);
    });
  }
  function converted(list2) {
    const out = [];
    let pending = 0;
    if (list2.some((t) => t.cur && t.cur !== wallet().currency)) ensureNbp(list2);
    for (const t of list2) {
      if (t.estimated) {
        const p = estimate(t.appid, t.hash, t.t);
        if (p == null) {
          pending++;
          continue;
        }
        out.push({ ...t, price: t.type === "buy" ? p : receivedFromBuyer2(p) });
        continue;
      }
      const { r, src } = histRate(t.cur, t.t);
      if (r == null) {
        pending++;
        continue;
      }
      out.push(r === 1 ? t : { ...t, price: Math.round(t.price * r), fx: t.cur, fxSrc: src, orig: t.price });
    }
    return { list: out, pending };
  }
  var invMemo = null;
  function myInvCaches() {
    if (invMemo && Date.now() - invMemo.at < 2e3) return invMemo.v;
    const me = ctx().steamId;
    const cache4 = get("invcache", {});
    const v = Object.keys(cache4).filter((k) => k.startsWith(me + "|")).map((k) => cache4[k]);
    invMemo = { at: Date.now(), v };
    return v;
  }
  var coMemo = null;
  function cases() {
    if (!coMemo || Date.now() - coMemo.at > 3e3) coMemo = { at: Date.now(), v: caseOpenings() };
    return coMemo.v;
  }
  var ttMemo = null;
  function timedTrades() {
    if (!ttMemo || Date.now() - ttMemo.at > 3e3) {
      const market = marketTimed();
      ttMemo = { at: Date.now(), market, all: [...market, ...invHistoryTrades(market)] };
    }
    return ttMemo;
  }
  function invalidate() {
    coMemo = null;
    originsMemo = null;
    invMemo = null;
    ttMemo = null;
  }
  var ownedItems = () => myInvCaches().flatMap((c) => c.items || []);
  var arrivedAt = (until) => until - 7 * 864e5 - 30 * 6e4;
  function exportHistory() {
    const iso = (t) => t ? new Date(t).toISOString() : null;
    const timed = new Map(marketTimed().map((t) => [t.key, t.t]));
    const market = Object.entries(loadTrades()).map(([key, t]) => ({ key, ...t, iso: iso(t.t), tExact: timed.get(key) !== t.t ? timed.get(key) : void 0 }));
    const item = (i) => i.hash || i.name;
    const inv2 = all().map((e) => ({ id: e.id, t: e.t, iso: iso(e.t), desc: e.desc, kind: e.kind, partner: e.partner?.name || null, minus: (e.minus || []).map(item), plus: (e.plus || []).map(item) }));
    let opens = [];
    try {
      opens = caseOpenings().rows.map((r) => ({ t: r.e.t, iso: iso(r.e.t), id: r.e.id, unseal: r.e.unseal || null, terminal: !!r.terminal, case: r.caseIt?.hash || r.caseIt?.name || null, caseSrc: r.caseSrc, caseCost: r.caseCost, key: r.keyIt?.hash || null, keyCost: r.keyCost, paid: r.paid ?? null, drops: r.drops.map((d) => d.hash || d.name), cost: r.cost, value: r.value }));
    } catch (e) {
      opens = [{ error: e.message }];
    }
    let orig = /* @__PURE__ */ new Map();
    try {
      orig = itemOrigins();
    } catch {
    }
    const originOut = (o) => o ? { src: o.src, iso: iso(o.t), cost: o.cost ?? null, detail: o.detail || "" } : null;
    const owned = ownedItems().map((it) => ({ assetid: it.assetid, contextid: it.contextid, hash: it.hash, lock: it.lock || null, marketable: !!it.marketable, amount: it.amount || 1, origin: originOut(orig.get(it.assetid) || orig.get("h:" + it.hash)) }));
    const steamInv = otherApps().flatMap((app2) => allOf([app2]).map((e) => ({ app: app2, t: e.t, iso: iso(e.t), desc: e.desc, kind: e.kind, minus: (e.minus || []).map(item), plus: (e.plus || []).map(item) })));
    const data3 = {
      exported: iso(Date.now()),
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
      marketSyncedAt: iso(get("tradesSyncedAt", 0)),
      invHistorySyncedAt: iso(syncedAt()),
      invHistoryComplete: isComplete(),
      counts: { market: market.length, invHistory: inv2.length, otherGamesHistory: steamInv.length, caseOpenings: opens.length, owned: owned.length },
      market,
      invHistory: inv2,
      otherGamesHistory: steamInv,
      caseOpenings: opens,
      owned
    };
    downloadText(`flipster-historia-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`, JSON.stringify(data3, null, 1), "application/json");
    log(L("history.historySavedTheDataFor", { market: market.length, inv: inv2.length, opens: opens.length, owned: owned.length }), "ok");
  }
  function ownedNow() {
    const caches = myInvCaches();
    if (!caches.length) return null;
    const m = /* @__PURE__ */ new Map();
    for (const c of caches) for (const it of c.items || []) m.set(it.hash, (m.get(it.hash) || 0) + (it.amount || 1));
    return m;
  }
  function ownedNotBought() {
    const m = /* @__PURE__ */ new Map();
    let origins2;
    try {
      origins2 = itemOrigins();
    } catch {
      return m;
    }
    for (const it of ownedItems()) {
      const o = origins2.get(it.assetid);
      if (o && o.src !== "kupiony") m.set(it.hash, (m.get(it.hash) || 0) + (it.amount || 1));
    }
    return m;
  }
  function mount2(root2) {
    el2 = root2;
    root2.innerHTML = `
    <style>
      #stt .sec-b .bar{position:static}
      #stt .sec-b th{top:var(--bar-h,0px)}
      #stt .pg{display:flex;gap:4px;align-items:center;justify-content:center;padding:8px 14px;flex-wrap:wrap}
      #stt .pg:empty{display:none}
      #stt .pg button{min-width:30px}
    </style>
    <div class="bar">
      <button class="b" data-a="syncall" title="${L("history.fetchesNewEntriesFromAll")}">\u27F3 ${L("history.sync")}</button>
      <button class="b" data-a="fullall" title="${L("history.downloadsTheWholeMarketAnd")}">${L("history.fullSync")}</button>
      <button class="b dbg" data-a="dump" title="${L("history.savesTheWholeStoredHistory")}">\u2B07 ${L("history.dataForAnalysis")}</button>
      <select id="h-per"><option value="7">${L("history.7Days")}</option><option value="30">${L("history.30Days")}</option><option value="90">${L("history.90Days")}</option><option value="365">${L("history.year")}</option><option value="0">${L("history.wholeHistory")}</option></select>
      <select id="h-game" title="${L("history.whichGameTheTradesSummary")}"><option value="all">${L("history.allGames")}</option><option value="730">CS2</option>${otherApps().map((a) => `<option value="${a}">${esc(appName(a))}</option>`).join("")}</select>
      <label class="tgl" title="${L("history.joinsIdenticalTradesOfOne")}"><input type="checkbox" id="h-grp" ${get("histGroup", true) ? "checked" : ""}><span class="tr"></span>${L("history.groupIdentical")}</label>
      <span class="sp"></span>
      <span class="sub" id="h-info"></span>
      <button class="b" data-a="stop" hidden>\u25A0 Stop</button>
    </div>
    <div class="htabs">
      <button data-ht="tx" id="tx-h">${L("history.trades")} <span class="cnt"></span></button>
      <button data-ht="cs" id="cs-h">${L("history.openedCases")} <span class="cnt"></span></button>
      <button data-ht="ih" id="ih-h">${L("history.inventoryHistory")} <span class="cnt"></span></button>
    </div>
    <div class="sec-b" data-sec="tx">
    <div class="bar">
      <select id="h-view" title="${L("history.everyTradeOnItsOwn")}"><option value="tx">${L("history.everyTrade")}</option><option value="item">${L("history.totalPerItem")}</option></select>
      <input type="search" id="h-q" placeholder="${L("history.filterItems")}" style="width:180px">
      <span class="sp"></span>
      <button class="b pane" data-a="months" title="${L("history.showHideTheResultMonth")}">\u{1F4C5} ${L("history.months")}</button>
      <button class="b pane" data-a="chart" title="${L("history.showHideTheFlipProfit")}">\u{1F4C8} ${L("history.chart")}</button>
    </div>
    <div class="cards" id="h-cards" style="grid-template-columns:repeat(auto-fill,minmax(max(170px,calc(25% - 10px)),1fr))"></div>
    <div id="h-months" style="padding:0 14px"></div>
    <div id="h-chart" style="padding:0 14px"></div>
    <div class="note">${L("history.eachSaleIsPairedWith")}</div>
    <table id="h-tbl"><thead></thead><tbody></tbody></table>
    <div class="pg" id="tx-pg"></div>
    </div>
    <div class="sec-b" data-sec="cs">
    <div class="bar" style="position:relative">
      <span class="sp"></span><span class="sub" id="cs-info"></span>
    </div>
    <div class="cards" id="cs-cards"></div>
    <div id="cs-list"></div>
    <div class="pg" id="cs-pg"></div>
    </div>
    <div class="sec-b" data-sec="ih">
    <div class="bar" style="position:relative">
      <select id="ih-kind"><option value="">${L("history.allEvents")}</option><option value="wymiana">${L("history.trades2")}</option><option value="rynek">${L("history.market")}</option><option value="skrzynia">${L("history.cases")}</option><option value="kontrakt">${L("history.contracts")}</option><option value="naklejka">${L("history.stickers")}</option><option value="otrzymane">${L("history.receivedDrops")}</option><option value="inne">${L("history.other")}</option></select>
      <input type="search" id="ih-q" placeholder="${L("history.searchItemsPlayers")}" style="width:200px">
      <span class="sp"></span><span class="sub" id="ih-info"></span>
    </div>
    <div class="note">${L("history.everythingThatHappenedToYour")} <span class="neg">\u2212</span> ${L("history.given")}, <span class="pos">+</span> ${L("history.received")}.</div>
    <div id="ih-list"></div>
    <div class="pg" id="ih-pg"></div>
    </div>
`;
    root2.addEventListener("click", (e) => {
      const iv = e.target.closest("[data-inv]");
      if (iv) {
        e.preventDefault();
        show("inv");
        focusItem(iv.dataset.inv, { appid: +iv.dataset.app || 730, cost: iv.dataset.cost ? +iv.dataset.cost : null, t: iv.dataset.t ? +iv.dataset.t : null });
        return;
      }
      const tg = e.target.closest("[data-txg]");
      if (tg) {
        e.preventDefault();
        const k = tg.dataset.txg;
        txOpen.has(k) ? txOpen.delete(k) : txOpen.add(k);
        render2(true);
        return;
      }
      const ob = e.target.closest("[data-owner]");
      if (ob) {
        checkOwner(ob.dataset.owner, ob.dataset.hash).then(() => {
          render2();
          renderInv();
        });
        render2();
        renderInv();
        return;
      }
      const pg = e.target.closest("[data-pg]");
      if (pg) {
        pages[pg.dataset.pg] = Math.max(0, +pg.dataset.to);
        ({ tx: () => render2(true), ih: () => renderInv(true), cs: renderCases })[pg.dataset.pg]();
        el2.querySelector("#" + pg.dataset.pg + "-h")?.scrollIntoView({ block: "start", behavior: "smooth" });
        return;
      }
      const ht = e.target.closest("[data-ht]");
      if (ht) {
        set("histTab", ht.dataset.ht);
        applyTab();
        return;
      }
      const th = e.target.closest("th[data-sort]");
      if (th) {
        if (!th.closest("#h-tbl")) return;
        (view === "tx" ? txSort : sort).click(th.dataset.sort);
        render2(true);
        return;
      }
      const a = e.target.closest("button")?.dataset.a;
      ({ months: () => {
        set("histMonths", !get("histMonths", false));
        render2(true);
      }, dump: exportHistory, syncall: () => syncAll(false), fullall: () => syncAll(true), stop: () => {
        task2?.cancel();
        ihTask?.cancel();
      }, chart: () => {
        set("histChart", !get("histChart", false));
        if (chartZoom) {
          chartZoom = null;
          render2(true);
        } else drawChart();
      }, chartreset: () => {
        chartZoom = null;
        pages.tx = 0;
        render2(true);
      } })[a]?.();
    });
    period = get("histPeriod", 0);
    root2.querySelector("#h-per").value = String(period);
    game = get("histGame", "all");
    if (![...root2.querySelector("#h-game").options].some((o) => o.value === game)) game = "all";
    root2.querySelector("#h-game").value = game;
    root2.querySelector("#h-game").onchange = (e) => {
      game = e.target.value;
      set("histGame", game);
      pages.tx = pages.ih = 0;
      render2(true);
      renderInv(true);
    };
    root2.querySelector("#h-per").onchange = (e) => {
      chartZoom = null;
      period = +e.target.value;
      set("histPeriod", period);
      pages.tx = pages.ih = pages.cs = 0;
      render2();
      renderInv();
    };
    let qT = 0;
    root2.querySelector("#h-q").oninput = () => {
      clearTimeout(qT);
      qT = setTimeout(() => {
        pages.tx = 0;
        render2(true);
      }, 150);
    };
    applyTab();
    const topBar = root2.querySelector(":scope > .bar");
    if (topBar && window.ResizeObserver) new ResizeObserver(() => root2.style.setProperty("--bar-h", topBar.offsetHeight + "px")).observe(topBar);
    root2.querySelector("#h-view").value = view;
    root2.querySelector("#h-grp").onchange = (e) => {
      set("histGroup", e.target.checked);
      pages.tx = 0;
      render2(true);
    };
    root2.querySelector("#h-view").onchange = (e) => {
      view = e.target.value;
      set("histView", view);
      pages.tx = 0;
      render2();
    };
    root2.querySelector("#ih-kind").onchange = () => {
      pages.ih = 0;
      renderInv(true);
    };
    root2.addEventListener("change", (e) => {
      const inp = e.target.closest?.("[data-termpaid]");
      if (!inp) return;
      const m = get("termPaid", {});
      const v = parsePrice(inp.value);
      if (isNaN(v)) delete m[inp.dataset.termpaid];
      else m[inp.dataset.termpaid] = v;
      set("termPaid", m);
      invalidate();
      render2();
      renderInv();
    });
    let iqT = 0;
    root2.querySelector("#ih-q").oninput = () => {
      clearTimeout(iqT);
      iqT = setTimeout(() => {
        pages.ih = 0;
        renderInv(true);
      }, 150);
    };
    if (all().length && get("invhistFmt", 1) < 2) {
      set("invhistFmt", 2);
      setTimeout(() => syncInv(true), 3e3);
    } else if (!isComplete() || otherApps().some((a) => !isComplete(a)) || Date.now() - syncedAt() > 36e5) setTimeout(() => syncInv(false), 3e3);
    del("keyPrice");
    load2().then((fresh3) => {
      if (fresh3) render2();
    });
    setTimeout(() => ensure(() => {
      invalidate();
      render2();
      renderInv();
    }), 4e3);
    render2();
    const trades = Object.values(loadTrades());
    if (trades.length && get("tradesFmt", 1) < TRADES_FMT) {
      log(L("history.historyOneTimeDownloadOf"), "warn");
      sync3(true);
      return;
    }
    const last = get("tradesSyncedAt", 0);
    if (Date.now() - last > 36e5) sync3(false);
  }
  var show3 = () => {
    render2();
    renderInv();
  };
  var mBusy = false;
  var ihBusy = false;
  var sBusy = false;
  var chainBusy = false;
  var anyBusy = () => mBusy || ihBusy || sBusy || chainBusy;
  var syncUi = () => el2?.querySelectorAll('[data-a="syncall"], [data-a="fullall"]').forEach((b) => b.disabled = anyBusy());
  var once = (busy2, set2, fn) => async (...a) => {
    if (busy2()) return;
    set2(true);
    syncUi();
    try {
      return await fn(...a);
    } finally {
      set2(false);
      syncUi();
    }
  };
  var sync3 = once(() => mBusy, (v) => mBusy = v, syncMarket);
  async function syncAll(full) {
    const busyMsg = L("history.historyASyncIsAlready");
    if (anyBusy()) return log(busyMsg, "warn");
    if (full && !await ask(L("history.fullSync"), L("history.illDownloadTheWholeMarket"), { ok: L("history.downloadEverything") })) return;
    if (anyBusy()) return log(busyMsg, "warn");
    chainBusy = true;
    syncUi();
    try {
      await sync3(full);
      await syncInv(full);
      await syncStore();
    } finally {
      chainBusy = false;
      syncUi();
    }
  }
  async function syncMarket(full) {
    if (!await ensureLogin()) return log(L("history.logIn"), "err");
    task2 = token();
    el2.querySelector('[data-a="stop"]').hidden = false;
    const saved = loadTrades();
    const trades = full ? {} : saved;
    const keep = () => saveTrades(full ? { ...saved, ...trades } : trades);
    const wasEmpty = !Object.keys(saved).length;
    let start = 0, total = Infinity, added = 0;
    let dateOf = null;
    try {
      const anchors = await loadAnchors();
      while (start < total && !task2.cancelled) {
        const d = await myHistoryHtmlPage(start, PAGE);
        if (!d.success) throw new Error(L("history.steamReturnedNoHistory"));
        total = d.total_count || 0;
        const parse = (h) => new DOMParser().parseFromString(h, "text/html");
        if (!dateOf) {
          const top = parseMyHistoryHtml(d, parse, /* @__PURE__ */ new Date()).find((t) => /^\d+_\d+/.test(t.key) && t.t);
          const topId = top ? Number(top.key.split("_")[1]) : 0;
          dateOf = makeDateOf(anchors, topId ? [topId, Math.min(top.t, Date.now())] : null);
        }
        const page = parseMyHistoryHtml(d, parse, /* @__PURE__ */ new Date(), dateOf);
        if (start === 0) {
          const newest = [...page].sort((a, b) => b.t - a.t)[0];
          if (newest) log(`${L("history.historyNewestMarketTrade")}, ${new Date(newest.t).toLocaleString()} ${newest.type === "buy" ? L("history.buy") : L("history.sale")} ${newest.hash}`);
        }
        let fresh3 = 0;
        for (const t of page) {
          if (!trades[t.key]) {
            fresh3++;
            added++;
          }
          const price = t.price;
          const mem5 = t.assetid ? recallProps({ assetid: t.assetid, float: null }) : {};
          const fl = t.float ?? mem5.float ?? null, sd = t.seed ?? mem5.seed ?? null;
          trades[t.key] = { t: t.t, type: t.type, hash: t.hash, appid: t.appid, amount: t.amount, price, cur: t.cur ?? null, pending: t.pending || void 0, float: fl ?? void 0, seed: sd ?? void 0 };
          if (!meta.get(t.hash) && t.icon) meta.set(t.hash, { name: t.name, icon: t.icon, color: t.color, appid: t.appid });
        }
        const evs = (d.results_html || "").includes("history_row_") ? 1 : 0;
        progress(Math.min(start + PAGE, total), total);
        el2.querySelector("#h-info").textContent = L("history.downloadedEvents", { start: Math.min(start + PAGE, total), total });
        if (!full && page.length && !fresh3) break;
        if (!evs) break;
        start += PAGE;
        if (start % 1e3 === 0) keep();
      }
      if (task2.cancelled) {
        keep();
        log(L("history.historyStoppedISavedWhat"), "warn");
      } else {
        saveTrades(trades);
        set("tradesSyncedAt", Date.now());
        if (full || wasEmpty) set("tradesFmt", TRADES_FMT);
        log(L("history.historyNewTradesInTotal", { added, trades: Object.keys(trades).length }), "ok");
        const all3 = Object.values(trades), withSeed = all3.filter((x) => x.seed != null);
        const known = withSeed.filter((x) => patternFor(x.hash, x.seed));
        const knownList = `${known.length} (${[...new Set(known.map((x) => x.hash))].slice(0, 5).join(", ")}${known.length > 5 ? "\u2026" : ""})`;
        if (full || known.length) log(L("history.historySeedKnownForOf", { withSeed: withSeed.length, all: all3.length, known: known.length ? L("history.knownPattern", { knownList }) : L("history.noneIsAKnownRare") }), known.length ? "ok" : "");
      }
    } catch (e) {
      keep();
      log(L("history.history") + e.message, "err");
    }
    progress(0);
    el2.querySelector('[data-a="stop"]').hidden = true;
    invalidate();
    render2();
  }
  var memo = null;
  var matchQ = (q) => {
    const hit = /* @__PURE__ */ new Map();
    return (hash) => {
      if (!q) return true;
      if (!hit.has(hash)) hit.set(hash, matchSearch(`${hash} ${meta.get(hash)?.name || ""}`, q));
      return hit.get(hash);
    };
  };
  function compute(fast = false) {
    if (!fast || !memo) memo = computeAll();
    const q = el2.querySelector("#h-q").value.trim().toLowerCase();
    if (!q && game === "all") return memo;
    const match = matchQ(q);
    const appOf = new Map(memo.all.map((t) => [t.hash, String(t.appid || 730)]));
    const gameOk = (hash) => game === "all" || (appOf.get(hash) ?? "730") === game;
    const ok = (hash) => gameOk(hash) && match(hash);
    const res = { ...memo.res, items: memo.res.items.filter((it) => ok(it.hash)), realized: memo.res.realized.filter((r) => ok(r.hash)) };
    return { ...memo, res, all: memo.all.filter((t) => ok(t.hash)) };
  }
  function heldCosts() {
    const { res } = memo && Date.now() - (memo.at || 0) < 6e4 ? memo : computeAll();
    const m = /* @__PURE__ */ new Map();
    for (const it of res.items) if (it.holdQty > 0 && it.holdCost > 0) m.set(it.hash, it.holdCost / it.holdQty);
    return m;
  }
  function computeAll() {
    const { list: conv, pending } = converted(timedTrades().all);
    const res = fifoPnL(conv);
    const owned = ownedNow();
    const notBought = owned ? ownedNotBought() : /* @__PURE__ */ new Map();
    for (const it of res.items) {
      if (!it.holdQty || !owned) continue;
      const have = Math.min(it.holdQty, Math.max(0, (owned.get(it.hash) || 0) - (notBought.get(it.hash) || 0)));
      if (have < it.holdQty) {
        it.goneQty = it.holdQty - have;
        it.holdCost = Math.round(it.holdCost * have / it.holdQty);
        it.holdQty = have;
      }
    }
    const since = period ? Date.now() - period * 864e5 : 0;
    const fxHashes = new Set(conv.filter((t) => t.fx).map((t) => t.hash));
    const estHashes = new Set(conv.filter((t) => t.estimated).map((t) => t.hash));
    return { at: Date.now(), res, since, all: conv, pending, owned, fxHashes, estHashes };
  }
  function render2(fast = false) {
    if (!el2) return;
    const { res, all: all3, pending, owned, fxHashes, estHashes } = compute(fast);
    const periodSince = period ? Date.now() - period * 864e5 : 0;
    const since = chartZoom ? Math.max(periodSince, chartZoom[0]) : periodSince;
    const until = chartZoom ? chartZoom[1] : Infinity;
    const inR = (t) => t >= since && t <= until;
    const realizedP = res.realized.filter((r) => inR(r.t));
    const inP = all3.filter((t) => inR(t.t));
    const spent = inP.filter((t) => t.type === "buy").reduce((s, t) => s + t.price * t.amount, 0);
    const recv = inP.filter((t) => t.type === "sell").reduce((s, t) => s + t.price * t.amount, 0);
    const pnl = realizedP.reduce((s, r) => s + r.pnl, 0);
    const wins = realizedP.filter((r) => r.pnl > 0).length;
    for (const it of res.items) {
      if (!it.holdQty) continue;
      const p = cached2(it.appid || meta.get(it.hash)?.appid || 730, it.hash)?.lowest;
      it.unreal = p ? receivedFromBuyer2(p) * it.holdQty - it.holdCost : null;
    }
    const n = timedTrades().market.length;
    el2.querySelector("#h-info").textContent = n ? L("history.tradesStored", { n, pending: pending ? L("history.waitingForARateEstimated", { pending }) : "", owned: owned ? "" : L("history.openInventoryToVerifyYou") }) : L("history.noDataClickSync");
    const dropInfo = /* @__PURE__ */ new Map();
    const dropTx = /* @__PURE__ */ new Map();
    if (!fast || !memo.co) memo.co = cases();
    for (const r of memo.co.rows) {
      const share = r.drops.length ? 1 / r.drops.length : 1;
      for (const d of r.drops) {
        if (d.kind !== "sold" || !inR(d.saleT) || !d.hash) continue;
        const x = dropInfo.get(d.hash) || { n: 0, cost: 0, value: 0, cases: /* @__PURE__ */ new Set(), unknown: 0 };
        x.n++;
        if (r.caseCost == null || r.unknownPaid) x.unknown++;
        else {
          x.cost += Math.round(r.cost * share);
          x.value += d.value;
        }
        if (r.caseIt?.name) x.cases.add(r.caseIt.name);
        dropTx.set(d.hash + "|" + d.saleT, { case: r.caseIt?.name || L("history.case"), cost: r.caseCost == null ? null : Math.round(r.cost * share), value: d.value });
        dropInfo.set(d.hash, x);
      }
    }
    const floatsOf = (hash) => [...new Set(all3.filter((t) => t.hash === hash && t.float != null).map((t) => t.float.toFixed(4)))];
    el2.querySelector("#h-cards").innerHTML = `
    <div class="card"><div class="k">${L("history.spentOnTheMarket")}</div><div class="v">${fmt(spent)}</div></div>
    <div class="card"><div class="k">${L("history.receivedFromSales")}</div><div class="v">${fmt(recv)}</div></div>
    <div class="card"><div class="k">${L("history.balance")}</div><div class="v ${recv - spent >= 0 ? "pos" : "neg"}">${recv - spent >= 0 ? "+" : ""}${fmt(recv - spent)}</div><div class="sub">${L("history.receivedMinusSpent")}</div></div>
    <div class="card"><div class="k">${L("history.flipProfit")}</div><div class="v ${pnl >= 0 ? "pos" : "neg"}">${fmt(pnl)}</div><div class="sub">${L("history.flipsInProfit", { realizedP: realizedP.length, realizedP2: realizedP.length ? pct(wins / realizedP.length, 0) : "-" })}</div></div>`;
    let acc = 0;
    const pts = res.realized.filter((r) => r.t >= periodSince).sort((a, b) => a.t - b.t).map((r) => [r.t, acc += r.pnl]);
    chartPts = pts;
    drawChart();
    drawMonths(res, all3, inR);
    if (view === "tx") return renderTx({ res, since, until, all: all3, dropTx });
    el2.querySelector("#h-tbl thead").innerHTML = `<tr>
      <th data-sort="name">${L("history.item")}</th><th data-sort="bought">${L("history.bought")}</th><th data-sort="sold">${L("history.sold")}</th>
      <th data-sort="now">Status</th><th data-sort="result">${L("history.profitLoss")}</th></tr>`;
    const per = res.items.map((it) => {
      const rp = realizedP.filter((r) => r.hash === it.hash);
      const realized = rp.reduce((s, r) => s + r.pnl, 0);
      const cost = rp.reduce((s, r) => s + r.buy * r.qty, 0);
      const tradedInPeriod = inP.some((t) => t.hash === it.hash);
      const unreal = it.holdQty ? it.unreal : null;
      const result = realized + (unreal || 0);
      const base = cost + (it.holdQty ? it.holdCost : 0);
      return {
        ...it,
        realizedP: realized,
        unrealP: unreal,
        result,
        roi: base ? result / base : null,
        avgBuy: it.bought ? it.spent / it.bought : null,
        avgSell: it.sold ? it.received / it.sold : null,
        active: tradedInPeriod
      };
    }).filter((x) => x.active);
    for (const x of per) x.todayLow = nowPrice(x.hash);
    const rows3 = sort.apply(per, {
      name: (x) => x.hash,
      bought: (x) => x.bought,
      sold: (x) => x.sold,
      now: (x) => x.holdQty ? 2 : x.goneQty ? 1 : 0,
      result: (x) => x.result,
      realized: (x) => x.result
    });
    renderPager("tx", rows3.length);
    el2.querySelector("#tx-h .cnt").textContent = `(${rows3.length})`;
    const money = (v) => `<span class="${v > 0 ? "pos" : v < 0 ? "neg" : ""}">${v > 0 ? "+" : ""}${fmt(Math.round(v))}</span>`;
    el2.querySelector("#h-tbl tbody").innerHTML = rows3.length ? pageOf("tx", rows3).map((x) => {
      const m = meta.get(x.hash) || {};
      const est2 = estHashes.has(x.hash) || fxHashes.has(x.hash) ? ` <span class="warn" title="${L("history.someAmountsAreEstimatedNo")}">\u2248</span>` : "";
      const fls = floatsOf(x.hash);
      const sub = fls.length ? `float ${fls.slice(0, 3).join(", ")}${fls.length > 3 ? "\u2026" : ""}` : "";
      const di = dropInfo.get(x.hash);
      const buyCell = x.bought ? `${x.bought} \xD7 ${fmt(Math.round(x.avgBuy))}${est2}<div class="sub">${L("history.total")} ${fmt(x.spent)}</div>` : `<span class="sub">${L("history.notBought")}</span>`;
      const sellCell = x.sold ? `${x.sold} \xD7 ${fmt(Math.round(x.avgSell))}${est2}<div class="sub">${x.unmatchedSells ? `${x.unmatchedSells} ${L("history.fromADropTrade")} \xB7 ` : ""}${L("history.youGot")} ${fmt(x.received)}</div>` : '<span class="sub">-</span>';
      let nowCell;
      if (x.holdQty) {
        const val = x.todayLow != null ? receivedFromBuyer2(x.todayLow) * x.holdQty : null;
        nowCell = `${L("history.youHold")} ${x.holdQty}${val != null ? `<div class="sub">${L("history.worthToYouUnit", { val: fmt(val), todayLow: fmt(x.todayLow) })}</div>` : `<div class="sub">${L("history.noPrice")}</div>`}`;
      } else if (x.goneQty) nowCell = goneCell(x);
      else nowCell = `<span class="sub">${L("history.allSold")}${x.todayLow != null ? ` \xB7 ${L("history.today")} ${fmt(x.todayLow)}/${L("history.unit")}` : ""}</span>`;
      if (x.holdQty && x.goneQty) nowCell += goneCell(x);
      const parts = [];
      if (x.realizedP) parts.push(`${L("history.sale")} ${money(x.realizedP)}`);
      if (x.unrealP != null && x.holdQty) parts.push(`${L("history.held")} ${money(x.unrealP)}`);
      const resCell = x.realizedP || x.unrealP != null ? `<b>${money(x.result)}</b>${x.roi != null ? ` <span class="sub">${pct(x.roi)}</span>` : ""}${parts.length > 1 ? `<div class="sub">${parts.join(" \xB7 ")}</div>` : x.unrealP != null && x.holdQty && !x.realizedP ? `<div class="sub">${L("history.unrealised")}</div>` : ""}` : x.goneQty ? `<span class="sub" title="${L("history.theItemLeftTheInventory")}">${L("history.unknown")}</span>` : '<span class="sub">-</span>';
      const dropLine = di ? `<div class="sub" title="${L("history.theItemDroppedFromA")}">${L("history.dropFrom")} ${esc([...di.cases].join(", ") || L("history.aCase"))}${di.n - di.unknown ? `: ${money(di.value - di.cost)} ${L("history.vsTheOpeningCost")}` : ""}</div>` : "";
      return `<tr><td>${itemCell({ ...m, hash: x.hash, name: m.name || x.hash, appid: m.appid || 730, sub })}</td>
      <td>${buyCell}</td><td>${sellCell}${dropLine}</td><td>${nowCell}</td><td>${resCell}</td></tr>`;
    }).join("") : `<tr><td colspan="5" class="empty">${L("history.noTradesInThisPeriod")}</td></tr>`;
  }
  var txOpen = /* @__PURE__ */ new Set();
  var bk = (t) => t.key || `${t.hash}|${t.t}`;
  function tradeCost(x, hash, tradeEv) {
    const sib = x.kind === "wymiana" ? tradeEv.filter((y) => Math.abs(y.t - x.t) <= 12e4) : [x];
    const outs = [], ins = [];
    for (const app2 of new Set(sib.map((y) => y.app || 730))) {
      const rows3 = sib.filter((y) => (y.app || 730) === app2);
      const tag = (i) => ({ ...i, app: app2 });
      outs.push(...rows3.reduce((a, y) => y.minus.length > a.length ? y.minus : a, []).map(tag));
      ins.push(...rows3.reduce((a, y) => y.plus.length > a.length ? y.plus : a, []).map(tag));
    }
    if (!outs.length) return { cost: 0, outs };
    const est2 = (i) => i.hash ? estimate(String(i.app || 730), i.hash, x.t) : null;
    const gave = outs.map(est2), got = ins.map(est2), mine = est2({ hash, app: x.app || 730 });
    if (!gave.every((v) => v != null) || !got.every((v) => v != null) || mine == null) return { cost: null, outs };
    const gs = got.reduce((a, b) => a + b, 0);
    return { cost: gs ? Math.round(gave.reduce((a, b) => a + b, 0) * (mine / gs)) : null, outs };
  }
  var caseIdx = null;
  function casesWith(hash) {
    const db = get("caseDB", null);
    if (!db?.cases) return [];
    if (!caseIdx || caseIdx.at !== db.at) {
      const m = /* @__PURE__ */ new Map();
      for (const [c, v] of Object.entries(db.cases)) {
        for (const name of [...(v.items || []).map((x) => x[0]), ...v.rare || []]) {
          const k = baseName(name);
          const a = m.get(k) || m.set(k, []).get(k);
          if (!a.includes(c)) a.push(c);
        }
      }
      caseIdx = { at: db.at, m };
    }
    return caseIdx.m.get(baseName(hash)) || [];
  }
  var seenIdx = null;
  function firstSeen(hash, sale) {
    const at = syncedAt();
    if (!seenIdx || seenIdx.at !== at) {
      const m = /* @__PURE__ */ new Map();
      for (const e of all()) for (const i of [...e.minus, ...e.plus]) if (i.hash) (m.get(i.hash) || m.set(i.hash, []).get(i.hash)).push(e);
      for (const a of m.values()) a.sort((p, q) => q.t - p.t);
      seenIdx = { at, m };
    }
    let t = sale;
    for (const e of seenIdx.m.get(hash) || []) {
      if (e.t > sale) continue;
      if (e.kind !== "rynek" || /purchas|bought/i.test(e.desc)) break;
      t = e.t;
    }
    return t;
  }
  function unknownOrigin(x) {
    const day2 = (t) => new Date(t).toLocaleDateString();
    const first = oldest();
    const line = (a, b, title) => `<div class="sub" title="${esc(title)}">${a}</div>${b ? `<div class="sub" style="color:#8f98a0" title="${esc(title)}">${b}</div>` : ""}`;
    const app2 = String(x.appid || 730);
    const none = L("history.notInSteamsHistory");
    if (app2 !== "730") {
      const what = app2 === "753" ? L("history.steamCardBackgroundOrEmoticon") : appName(+app2);
      const from = oldest(+app2);
      if (!syncedAt(+app2)) return line(none, what, L("history.theInventoryHistoryOfIsnt", { app: appName(+app2) }));
      if (from && x.t < from) return line(none, L("history.olderThanTheHistory", { what }), L("history.soldAndTheInventoryHistory", { t: day2(x.t), app: appName(+app2), from: day2(from) }));
      return line(none, what, L("history.neitherTheMarketHistoryNor", { app: appName(+app2), app2: app2 === "753" ? L("history.cardsUsuallyDropForPlaying") : "" }));
    }
    if (first && x.t < first) return line(none, L("history.olderThanTheInventoryHistory"), L("history.soldAndTheSteamInventory", { t: day2(x.t), first: day2(first) }));
    const cases2 = casesWith(x.hash);
    const seen = firstSeen(x.hash, x.t);
    const opened = (memo?.co?.rows || []).filter((r) => r.caseIt?.hash && cases2.includes(r.caseIt.hash) && r.e.t <= seen && r.e.t > seen - 14 * 864e5);
    if (opened.length) {
      const c = opened[0].caseIt.hash;
      const n = opened.filter((r) => r.caseIt.hash === c).length;
      return line(none, L("history.probablyFromThe", { c: esc(c) }), L("history.steamDidntRecordWhereThis", { c, seen: day2(seen), n, t: day2(opened[0].e.t) }));
    }
    if (cases2.length) return line(none, L("history.skinFromThe", { cases: esc(cases2[0]), cases2: cases2.length > 1 ? L("history.andOthers") : "" }), L("history.steamDidntRecordWhereThis2", { cases: cases2.join(", "), seen: day2(seen) }));
    return line(none, "", L("history.notBoughtOnTheMarket", { ih: isComplete() ? "" : L("history.theInventoryHistoryIsntFully") }));
  }
  function renderTx({ res, since, until = Infinity, all: all3, dropTx }) {
    const items2 = new Map(res.items.map((it) => [it.hash, it]));
    const unsoldOf = /* @__PURE__ */ new Map();
    {
      const cum = /* @__PURE__ */ new Map(), sold = new Map(res.items.map((it) => [it.hash, it.sold - it.unmatchedSells]));
      for (const t of [...all3].sort((a, b) => a.t - b.t)) {
        if (t.type !== "buy") continue;
        const q = t.amount || 1, st = cum.get(t.hash) || 0, en = st + q;
        cum.set(t.hash, en);
        unsoldOf.set(bk(t), Math.max(0, Math.min(q, en - Math.max(sold.get(t.hash) || 0, st))));
      }
    }
    const goneOf = /* @__PURE__ */ new Map();
    {
      const left = new Map(res.items.map((it) => [it.hash, it.goneQty || 0]));
      for (const t of [...all3].sort((a, b) => a.t - b.t)) {
        if (t.type !== "buy") continue;
        const k = bk(t), u = unsoldOf.get(k) || 0, l = left.get(t.hash) || 0;
        const g = Math.min(u, l);
        if (g) {
          goneOf.set(k, g);
          left.set(t.hash, l - g);
        }
      }
    }
    const fatesOf = /* @__PURE__ */ new Map();
    {
      const outs = /* @__PURE__ */ new Map();
      for (const e of all()) {
        if (e.kind === "rynek") continue;
        for (const i of e.minus || []) if (i.hash) (outs.get(i.hash) || outs.set(i.hash, []).get(i.hash)).push(e);
      }
      for (const a of outs.values()) a.sort((x, y) => x.t - y.t);
      for (const r of memo?.co?.rows || []) {
        const h = r.caseIt?.hash;
        if (!h || !/^kupiona/.test(r.caseSrc || "")) continue;
        if (!outs.has("case:" + h)) outs.set("case:" + h, []);
        outs.get("case:" + h).push({ ...r.e, kind: "skrzynia", _row: r });
      }
      for (const k of outs.keys()) if (k.startsWith("case:")) outs.get(k).sort((x, y) => x.t - y.t);
      const ptr = /* @__PURE__ */ new Map();
      for (const t of [...all3].sort((a, b) => a.t - b.t)) {
        if (t.type !== "buy") continue;
        const g = goneOf.get(bk(t));
        if (!g) continue;
        const ok = outs.has("case:" + t.hash) ? "case:" + t.hash : t.hash;
        const list2 = outs.get(ok) || [];
        let i = ptr.get(ok) || 0;
        while (i < list2.length && list2[i].t < t.t) i++;
        const mine = list2.slice(i, i + g);
        ptr.set(ok, i + mine.length);
        if (mine.length) fatesOf.set(bk(t), mine);
      }
    }
    el2.querySelector("#h-tbl thead").innerHTML = `<tr><th data-sort="t">${L("history.date")}</th><th data-sort="name">${L("history.item")}</th><th data-sort="type">${L("history.type")}</th>
    <th data-sort="price">${L("history.buySellPrice")}</th><th data-sort="today">${L("history.priceToday")}</th><th data-sort="pnl">${L("history.profitLoss")}</th></tr>`;
    const pnlOf = /* @__PURE__ */ new Map();
    for (const r of res.realized) {
      const k = r.hash + "|" + r.t;
      const x = pnlOf.get(k) || { pnl: 0, qty: 0, cost: 0 };
      x.pnl += r.pnl;
      x.qty += r.qty;
      x.cost += r.buy * r.qty;
      pnlOf.set(k, x);
    }
    const srcOfSale = /* @__PURE__ */ new Map();
    {
      const acq = /* @__PURE__ */ new Map();
      for (const e of allEvents()) {
        if (e.kind === "rynek") continue;
        const had = new Set((e.minus || []).map((i) => i.hash));
        for (const it of e.plus || []) if (it.hash && !had.has(it.hash)) (acq.get(it.hash) || acq.set(it.hash, []).get(it.hash)).push(e);
      }
      for (const a of acq.values()) a.sort((x, y) => x.t - y.t);
      const used = /* @__PURE__ */ new Map();
      for (const t of all3.filter((x) => x.type === "sell").sort((a, b) => a.t - b.t)) {
        const k = t.hash + "|" + t.t;
        if (pnlOf.has(k) || dropTx.has(k)) continue;
        const list2 = acq.get(t.hash) || [], i = used.get(t.hash) || 0;
        if (i < list2.length && list2[i].t <= t.t) {
          srcOfSale.set(k, list2[i]);
          used.set(t.hash, i + 1);
        }
      }
    }
    const freeSrc = (e) => !["wymiana", "kontrakt", "skrzynia", "naklejka"].includes(e.kind) && !/store|purchased/i.test(e.desc) && /gift|drop|earned|reward|level|rank|xp|discovery queue|game ?play/i.test(e.desc);
    const tradeEvAll = allEvents().filter((y) => y.kind === "wymiana");
    const srcCost = (x) => {
      const e = x.src;
      if (freeSrc(e)) return { cost: 0, why: L("history.aDropRewardOrGift") };
      if (e.kind === "wymiana" || e.kind === "kontrakt") {
        const r = tradeCost(e, x.hash, tradeEvAll);
        const gave = r.outs.map((i) => i.name).join(", ");
        const day2 = e.kind === "kontrakt" ? L("history.theContract") : L("history.theTrade");
        if (r.cost === 0) return { cost: 0, why: L("history.aGiftYouGaveNothing") };
        if (r.cost == null) return { cost: null, wait: true, why: L("history.costTheValueOfWhat", { gave, day: day2 }) };
        return { cost: r.cost, why: L("history.costTheMarketValueOf", { gave, day: day2, cost: fmt(r.cost) }) };
      }
      if (/store|purchased/i.test(e.desc)) {
        const p = itemPaid(e.t, x.hash, storeConv);
        return p ? { cost: p.price, why: L("history.boughtInTheSteamStore", { price: fmt(p.price), t: new Date(p.row.t).toLocaleDateString() }) } : { cost: null, why: L("history.boughtInTheSteamStore2") };
      }
      return { cost: null, why: L("history.costUnknownThisEventDoesnt") };
    };
    const srcLabel = (e) => {
      const d = new Date(e.t).toLocaleDateString();
      if (e.kind === "naklejka") return L("history.takenOffAnItem", { d });
      if (e.kind === "wymiana") return L("history.fromATrade", { d, href: e.partner?.href ? L("history.with", { e: partnerLink(e) }) : "" });
      if (e.kind === "kontrakt") return L("history.fromAContract", { d });
      if (e.kind === "skrzynia") return L("history.fromACaseCapsule", { d });
      if (/gift/i.test(e.desc)) return L("history.gift", { d });
      if (/discovery queue/i.test(e.desc)) return L("history.forTheStoreDiscoveryQueue", { d });
      if (/game ?play time/i.test(e.desc)) return L("history.dropForPlaying", { d });
      if (/store|purchased/i.test(e.desc)) return L("history.fromTheSteamStore", { d });
      if (/drop|earned|reward|level|rank|xp/i.test(e.desc)) return L("history.dropForPlaying2", { d });
      return `${esc(e.desc)} ${d}`;
    };
    const tx2 = all3.filter((t) => t.t >= since && t.t <= until).map((t) => {
      const k = t.hash + "|" + t.t;
      const m = t.type === "sell" ? pnlOf.get(k) : null;
      const drop = t.type === "sell" ? dropTx.get(k) : null;
      const q = t.amount || 1;
      let pnl = null;
      if (m) pnl = m.pnl;
      else if (drop && drop.cost != null) pnl = drop.value - drop.cost;
      const low = nowPrice(t.hash, t.appid);
      const now = low == null ? null : t.type === "sell" ? receivedFromBuyer2(low) : low;
      const today = now == null || !t.price ? null : (now - t.price) / t.price;
      return { ...t, q, m, drop, pnl, low, now, today, unsold: t.type === "buy" ? unsoldOf.get(bk(t)) ?? 0 : 0, gone: t.type === "buy" ? goneOf.get(bk(t)) ?? 0 : 0, fates: t.type === "buy" ? fatesOf.get(bk(t)) || null : null, src: t.type === "sell" && !m && !drop ? srcOfSale.get(k) || null : null };
    });
    const rows3 = txSort.apply(tx2, {
      t: (x) => x.t,
      name: (x) => x.hash,
      type: (x) => x.type,
      price: (x) => x.price * x.q,
      today: (x) => x.price ? x.today : null,
      pnl: (x) => x.pnl
    });
    const gkey = (x) => {
      const st = x.type === "buy" ? !x.unsold ? "sold" : x.gone >= x.unsold ? "gone" : x.gone ? "mixed" : "inv" : x.m ? `m${Math.round(x.m.cost / x.m.qty)}|${x.q ? Math.round(x.pnl / x.q) : x.pnl}` : x.drop ? `d${x.drop.case}|${x.drop.cost}|${x.pnl}` : `s${x.src?.kind || ""}|${x.src?.partner?.href || ""}|${x.src ? new Date(x.src.t).toDateString() : ""}`;
      return [new Date(x.t).toDateString(), x.hash, x.type, x.price, x.estimated ? 1 : 0, x.fx || "", st].join("|");
    };
    const groups2 = [], byKey = /* @__PURE__ */ new Map();
    for (const x of rows3) {
      const k = get("histGroup", true) ? gkey(x) : x.key || `${x.hash}|${x.t}|${Math.random()}`, g = byKey.get(k);
      if (g) {
        g.n += x.q;
        g.unsold += x.unsold || 0;
        g.gone += x.gone || 0;
        if (x.fates) g.fates = [...g.fates || [], ...x.fates];
        if (g.pnl != null && x.pnl != null) g.pnl += x.pnl;
        g.t0 = Math.min(g.t0, x.t);
        g.t1 = Math.max(g.t1, x.t);
        g.items.push(x);
        continue;
      }
      const ng = { k, x, n: x.q, unsold: x.unsold || 0, gone: x.gone || 0, fates: x.fates || null, pnl: x.pnl, t0: x.t, t1: x.t, items: [x] };
      byKey.set(k, ng);
      groups2.push(ng);
    }
    renderPager("tx", groups2.length);
    el2.querySelector("#tx-h .cnt").textContent = `(${rows3.length}${groups2.length < rows3.length ? L("history.inRows", { groups: groups2.length }) : ""})`;
    const rowHtml = (g, child = false) => {
      const x = g.n > (g.x.q || 1) ? { ...g.x, pnl: g.pnl, unsold: g.unsold, gone: g.gone, fates: g.fates } : g.x;
      const many = g.n > 1;
      const split = !child && g.items.length > 1;
      const meta1 = meta.get(x.hash) || {};
      const pm = x.seed != null ? patternFor(x.hash, x.seed) : null;
      const sub = [x.float != null ? `<span title="float: ${x.float.toFixed(6)}">float ${x.float.toFixed(4)}</span>` : "", x.seed != null ? `seed ${x.seed}` : "", pm ? patternChip(pm) : ""].filter(Boolean).join(" \xB7 ");
      const mark = x.estimated ? ` <span class="warn" title="${L("history.priceEstimatedFromTheMarket")}">\u2248</span>` : x.fx ? ` <span class="warn" title="${L("history.convertedFromAnotherCurrencyAt")}">\u2248</span>` : "";
      let typ, res1 = '<span class="sub">-</span>';
      if (x.type === "buy") {
        typ = `<span class="neg">${L("history.buy")}</span>`;
        const it = items2.get(x.hash);
        if (!x.unsold) typ += `<div class="sub">${L("history.sold2")}</div>`;
        else if (x.gone >= x.unsold) typ += goneCell(it, x.gone, x.fates, split);
        else if (x.gone) typ += `<div class="sub">${invLink(x, meta1, L("history.inInventory", { unsold: x.unsold - x.gone }), !split && !many)}</div>${goneCell(it, x.gone, x.fates, split)}`;
        else typ += `<div class="sub">${invLink(x, meta1, `${L("history.inInventory2")}${many ? ` (${x.unsold})` : ""}`, !split && !many)}</div>`;
      } else {
        typ = `<span class="pos">${L("history.sale")}</span>`;
        if (x.m) {
          typ += `<div class="sub">${L("history.boughtFor")} ${fmt(Math.round(x.m.cost / x.m.qty))}</div>`;
          res1 = `<b class="${x.pnl >= 0 ? "pos" : "neg"}">${x.pnl >= 0 ? "+" : ""}${fmt(x.pnl)}</b>`;
        } else if (x.drop) {
          typ += `<div class="sub" title="${L("history.openingCostTheCaseThe")}">${L("history.dropFrom")} ${esc(x.drop.case)}${x.drop.cost != null ? ` \xB7 ${L("history.cost")} ${fmt(x.drop.cost)}` : ""}</div>`;
          if (x.pnl != null) res1 = `<span class="${x.pnl >= 0 ? "pos" : "neg"}" title="${L("history.saleMinusTheOpeningCost")} (${esc(fmt(x.drop.cost))})">${x.pnl >= 0 ? "+" : ""}${fmt(x.pnl)}</span>`;
        } else if (x.src) {
          const sc = srcCost(x);
          const n = g.n || 1;
          typ += `<div class="sub" title="${esc(`${L("history.notBoughtOnTheMarket2")}: ${x.src.desc} (${new Date(x.src.t).toLocaleString()}).
${sc.why}`)}">${srcLabel(x.src)}${sc.cost ? ` \xB7 ${L("history.cost")} ${fmt(sc.cost)}` : ""}</div>`;
          if (sc.cost != null) {
            const pnl = (x.price - sc.cost) * n;
            res1 = `<span class="${pnl >= 0 ? "pos" : "neg"}" title="${esc(`${sc.why}
${L("history.profitYouGotCost", { price: fmt(x.price * n), cost: fmt(sc.cost * n) })}`)}">${pnl >= 0 ? "+" : ""}${fmt(pnl)}</span>`;
          } else if (sc.wait) res1 = `<span class="sub" title="${esc(sc.why)}">\u2026</span>`;
          else res1 = `<span class="sub" title="${esc(sc.why)}">-</span>`;
        } else typ += unknownOrigin(x);
      }
      const tip = x.low != null ? x.type === "sell" ? L("history.todayYoudGetAfterThe", { now: fmt(x.now), low: fmt(x.low) }) : L("history.lowestPriceTodayWhatYoud", { low: fmt(x.low) }) : "";
      const d = new Date(x.t), hm = (t) => new Date(t).toLocaleTimeString(locale(), { hour: "2-digit", minute: "2-digit" });
      return `<tr${child ? ' style="background:rgba(102,192,244,.04)"' : ""}><td title="${esc(g.t0 !== g.t1 ? `${new Date(g.t0).toLocaleString()} - ${new Date(g.t1).toLocaleString()}` : d.toLocaleString())}">${d.toLocaleDateString()}<div class="sub">${g.t0 !== g.t1 ? `${hm(g.t0)}-${hm(g.t1)}` : hm(x.t)}</div></td>
      <td>${itemCell({ ...meta1, hash: x.hash, name: meta1.name || x.hash, appid: meta1.appid || 730, sub: `${sub}${many ? `${sub ? " \xB7 " : ""}${split ? `<span data-txg="${esc(g.k)}" class="acc" style="cursor:pointer;font-weight:700" title="${L("history.identicalTradesThatDayClick", { n: g.n, k: txOpen.has(g.k) ? L("history.collapse") : L("history.expand") })}">${txOpen.has(g.k) ? "\u25BE" : "\u25B8"} \xD7${g.n}</span>` : `<b class="acc">\xD7${g.n}</b>`}` : ""}` })}</td>
      <td>${typ}</td>
      <td title="${x.type === "sell" ? esc(L("history.whatYouGotAfterSteams", { price: fmt(buyerFromReceived2(x.price)) })) : L("history.whatYouPaid")}">${fmt(x.price)}${mark}${many ? `<div class="sub">\xD7 ${g.n} = ${fmt(x.price * g.n)}</div>` : ""}${x.type === "sell" ? `<div class="sub">${L("history.youGot")}</div>` : ""}${x.q > 1 ? `<div class="sub">\xD7${x.q} = ${fmt(x.price * x.q)}</div>` : ""}</td>
      <td title="${esc(tip + (many && x.low != null ? `

${L("history.allUnitsToday", { n: g.n })}: ${fmt(x.now * g.n)}${x.type === "buy" ? L("history.aboutInHandAfterSelling", { low: fmt(receivedFromBuyer2(x.low) * g.n) }) : ""}` : ""))}">${x.low != null ? `${fmt(x.now)}${x.today != null && isFinite(x.today) ? `<div class="sub ${x.today >= 0 ? "pos" : "neg"}">${x.today >= 0 ? "+" : ""}${pct(x.today, 0)}</div>` : ""}${many ? `<div class="sub">\xD7 ${g.n} = ${fmt(x.now * g.n)}</div>` : ""}` : '<span class="sub">\u2026</span>'}</td>
      <td>${res1}</td></tr>`;
    };
    el2.querySelector("#h-tbl tbody").innerHTML = groups2.length ? pageOf("tx", groups2).map((g) => rowHtml(g) + (g.items.length > 1 && txOpen.has(g.k) ? g.items.map((x) => rowHtml({ k: g.k, x, n: x.q, unsold: x.unsold || 0, gone: x.gone || 0, pnl: x.pnl, t0: x.t, t1: x.t, items: [x] }, true)).join("") : "")).join("") : `<tr><td colspan="6" class="empty">${L("history.noTradesInThisPeriod")}</td></tr>`;
  }
  function invLink(x, m, text, exact = false) {
    return `<a href="#" class="acc" data-inv="${esc(x.hash)}" data-app="${m.appid || 730}" data-cost="${x.type === "buy" ? x.price : ""}"${exact ? ` data-t="${x.t}"` : ""} title="${exact ? L("history.showThisCopyInInventory") : L("history.showTheseItemsInInventory")}">${text} \u2197</a>`;
  }
  function goneCell(x, n = x.goneQty, evs = null, brief = false) {
    const list2 = evs?.length ? evs : [fateOf(x.hash)].filter(Boolean);
    const f = list2[0];
    const nm = (i) => displayName(i.hash, i.name) || "?";
    const got = (e) => (e.plus || []).filter((i) => i.hash && i.hash !== x.hash).map(nm);
    const term = (e) => {
      if (!/terminal/i.test(x.hash || "")) return null;
      if (e._row) return { bought: e._row.drops.map(nm) };
      if (!e.minus?.some((i) => i.hash === x.hash)) return null;
      const row = memo?.co?.rows.find((r) => r.terminal && r.e.unseal === e.id);
      return { bought: row ? row.drops.map(nm) : null };
    };
    const what1 = (e, dated = true) => {
      const d = dated ? ` ${new Date(e.t).toLocaleDateString()}` : "", g = got(e);
      if (e.kind === "skrzynia") {
        const tm = term(e);
        if (tm) return L("history.activated", { d, bought: tm.bought == null ? L("history.notUsedYet") : tm.bought.length ? L("history.bought2", { bought: tm.bought.join(", ") }) : L("history.nothingBought") });
        return L("history.opened", { d, g: g.length ? `: ${g.join(", ")}` : "" });
      }
      if (e.kind === "naklejka") return L("history.applied", { d, g: g.length ? L("history.to", { g: g.join(", ") }) : "" });
      if (e.kind === "kontrakt") return L("history.contract2", { d, g: g.length ? L("history.got", { g: g.join(", ") }) : "" });
      if (e.kind === "wymiana") return L("history.traded", { d });
      return `${kindName(e.kind)}${d}`;
    };
    const short = (e) => e.kind === "skrzynia" ? term(e) ? L("history.activated2") : L("history.opened2") : { wymiana: L("history.traded2"), kontrakt: L("history.contract"), naklejka: L("history.applied2") }[e.kind] || kindName(e.kind);
    if (brief && list2.length > 1) {
      const kinds = [...new Set(list2.map(short))].join(", ");
      return `<div class="sub" title="${L("history.detailsAfterExpandingTheGroup")}">${n} ${L("history.outOfInv")} \xB7 <span class="acc">${esc(kinds)}</span></div>`;
    }
    const what = f ? what1(f) + (list2.length > 1 ? ` +${list2.length - 1}` : "") : "";
    const line = (e) => {
      const g = got(e).join(", ");
      const w = e.kind === "wymiana" ? L("history.traded3", { name: e.partner?.name ? L("history.with2", { name: e.partner.name }) : "", g: g ? L("history.got2", { g }) : "" }) : what1(e, false);
      return `${new Date(e.t).toLocaleString()}: ${w}`;
    };
    const title = f ? list2.map(line).join("\n") : L("history.boughtOnTheMarketBut");
    return `<div class="sub" title="${esc(title)}">${n} ${L("history.outOfInv")}${what ? ` \xB7 <span class="acc">${esc(what)}</span>` : ""}${f?.partner ? ` ${L("history.with3")} ${partnerLink(f)}${ownerBtn(f, x.hash)}` : ""}</div>`;
  }
  var ihTask = null;
  var syncInv = once(() => ihBusy, (v) => ihBusy = v, syncInvNow);
  var otherApps = () => [.../* @__PURE__ */ new Set([753, ...Object.values(loadTrades()).map((t) => +t.appid).filter((a) => a && a !== 730)])];
  var appName = (app2) => ({ 753: L("history.steamCardsAndBackgrounds"), 252490: "Rust", 440: "Team Fortress 2", 570: "Dota 2" })[app2] || L("history.game", { app: app2 });
  var allEvents = () => [...all(), ...allOf(otherApps())];
  async function syncInvNow(full) {
    if (!await ensureLogin()) return;
    ihTask = token();
    const info2 = el2.querySelector("#ih-info");
    try {
      const n = await sync({ full, isCancelled: () => ihTask.cancelled, onProgress: (cnt, pages2, oldest2) => {
        invalidate();
        renderInv();
        info2.textContent = L("history.downloadingNewEventsPages", { cnt, pages: pages2, oldest: oldest2 ? L("history.reached", { oldest: new Date(oldest2).toLocaleDateString() }) : "" });
      } });
      log(L("history.inventoryHistoryEvents", { n }), "ok");
    } catch (e) {
      log(L("history.inventoryHistory2") + e.message, "err");
    }
    for (const app2 of otherApps()) {
      if (ihTask.cancelled) break;
      try {
        const s = await sync({ app: app2, full, isCancelled: () => ihTask.cancelled });
        if (s) log(L("history.inventoryHistoryEvents2", { app: appName(app2), s, app2: isComplete(app2) ? L("history.complete") : L("history.notCompleteYet") }), "ok");
      } catch (e) {
        log(`${L("history.inventoryHistory")} (${appName(app2)}): ${e.message}`, "warn");
      }
    }
    invalidate();
    renderInv();
    render2();
  }
  function renderInv(listOnly = false) {
    if (!el2) return;
    if (listOnly !== true) renderCases();
    const k = el2.querySelector("#ih-kind").value;
    const q = el2.querySelector("#ih-q").value.trim().toLowerCase();
    const since = period ? Date.now() - period * 864e5 : 0;
    const src = game === "all" ? allEvents().sort((a, b) => b.t - a.t) : game === "730" ? all() : allOf([+game]);
    const evs = src.filter((e) => e.t >= since && (!k || e.kind === k) && (!q || matchSearch(`${e.desc} ${e.partner?.name || ""} ${[...e.plus, ...e.minus].map((i) => i.name + " " + (i.hash || "")).join(" ")}`, q)));
    el2.querySelector("#ih-h .cnt").textContent = `(${evs.length})`;
    const gApp = game === "all" ? 730 : +game;
    const gOld = src.length ? src[src.length - 1].t : null;
    el2.querySelector("#ih-info").textContent = syncedAt(gApp) ? L("history.eventsStoredSynced", { src: src.length, gApp: timeAgo(syncedAt(gApp)), gOld: gOld ? L("history.since", { gOld: new Date(gOld).toLocaleDateString() }) : "", gApp2: isComplete(gApp) ? L("history.wholeHistory2") : L("history.olderOnesNotDownloadedYet") }) : L("history.notSynced");
    const chip3 = (i, sign) => `<span class="tag" style="margin:1px 2px;border-color:${sign === "-" ? "#7a2b2b" : "#3d5a12"}"><span class="${sign === "-" ? "neg" : "pos"}">${sign === "-" ? "\u2212" : "+"}</span> <span style="color:#${esc(i.color || "c6d4df")}">${esc(i.name)}</span></span>`;
    renderPager("ih", evs.length);
    el2.querySelector("#ih-list").innerHTML = evs.length ? `<table><thead><tr><th>${L("history.date")}</th><th>${L("history.event")}</th><th>${L("history.items")}</th></tr></thead><tbody>${pageOf("ih", evs).map((e) => `
    <tr><td style="white-space:nowrap">${new Date(e.t).toLocaleString()}</td>
    <td><span class="tag">${kindName(e.kind)}</span> ${e.partner?.name ? esc(e.desc).replace(esc(e.partner.name), partnerLink(e)) : esc(e.desc)}</td>
    <td>${e.minus.map((i) => chip3(i, "-")).join("")}${e.plus.map((i) => chip3(i, "+")).join("")}</td></tr>`).join("")}</tbody></table>` : `<div class="empty">${L("history.noEventsInThisPeriod")}${syncedAt() ? "" : L("history.clickSync")}.</div>`;
  }
  var isKey = (i) => /\bkey\b/i.test(i.hash || i.name || "");
  function keyPrice() {
    const usd = rateFor(1);
    return usd ? Math.round(249 * usd) : 249;
  }
  function keyExpect(ts) {
    const { r } = histRate(1, ts);
    return r ? Math.round(249 * r) : keyPrice();
  }
  function keyPriceAt(ts) {
    const near = nearestKeyPrice(ts, CUR_NAME[wallet().currency], keyExpect);
    if (near && Math.abs(near.t - ts) < 400 * 864e5) return { price: near.price, src: L("history.likeYourKeyFrom") + new Date(near.t).toLocaleDateString() };
    const { r, src } = histRate(1, ts);
    if (r && src === "nbp") return { price: Math.round(249 * r), src: L("history.249UsdAtThat") };
    return { price: keyPrice(), src: L("history.249UsdAtTodays") };
  }
  var syncStore = once(() => sBusy, (v) => sBusy = v, syncStoreNow);
  async function syncStoreNow() {
    el2.querySelector("#cs-info").textContent = L("history.downloadingThePurchaseHistory");
    try {
      const rows3 = await sync2({ onProgress: (n) => {
        el2.querySelector("#cs-info").textContent = L("history.purchaseHistory", { n });
      } });
      log(L("history.steamPurchaseHistoryEntriesCs2", { rows: rows3.length, isCS: rows3.filter(isCS).length }), "ok");
    } catch (e) {
      log(L("history.steamPurchaseHistory") + e.message, "err");
    }
    invalidate();
    render2();
    renderInv();
  }
  function byHash(list2) {
    const m = /* @__PURE__ */ new Map();
    for (const x of list2) {
      const a = m.get(x.hash);
      if (a) a.push(x);
      else m.set(x.hash, [x]);
    }
    return m;
  }
  function buyMatcher(buys) {
    const pool = buys.map((b) => ({ ...b }));
    return {
      priceOf(hash, t) {
        const c = pool.filter((b) => !b.used && b.hash === hash).sort((a, b) => Math.abs(a.t - t) - Math.abs(b.t - t))[0];
        if (c) c.used = true;
        return c ? c.price : null;
      },
      unmatched: () => pool.filter((b) => !b.used)
    };
  }
  function tradeDeduper() {
    const seen = /* @__PURE__ */ new Map();
    return (x, hash, n) => {
      if (x.kind !== "wymiana") return n;
      const k = Math.round(x.t / 12e4) + "|" + hash;
      const add = Math.max(0, n - (seen.get(k) || 0));
      seen.set(k, Math.max(n, seen.get(k) || 0));
      return add;
    };
  }
  function caseOpenings() {
    const { list: trades } = converted(timedTrades().all);
    const events = all();
    const isTerm = (i) => /terminal/i.test(i.hash || i.name || "");
    const byT = [...events].sort((a, b) => a.t - b.t);
    const isSealed = (i) => /sealed/i.test(i.hash || i.name || "") && isTerm(i);
    const isActive = (i) => isTerm(i) && !isSealed(i);
    const junk = (i) => isTerm(i) || isKey(i) || /\b(case|capsule|package)\b/i.test(i.hash || i.name || "");
    const unseals = byT.filter((e) => e.minus.some(isSealed));
    const sealUsed = /* @__PURE__ */ new Set();
    const opens = byT.filter((e) => e.kind === "skrzynia" && !e.minus.some(isTerm) && e.plus.length).concat(
      byT.filter((e) => e.minus.some(isActive)).map((e) => {
        const u = [...unseals].reverse().find((x) => !sealUsed.has(x) && x.t <= e.t);
        if (u) sealUsed.add(u);
        const sealedIt = u?.minus.find(isSealed);
        return { ...e, minus: sealedIt ? [sealedIt] : e.minus.filter(isActive), plus: e.plus.filter((i) => !junk(i)), terminal: true, unseal: u ? u.id : null };
      })
    ).sort((x, y) => x.t - y.t);
    const buys = trades.filter((t) => t.type === "buy").sort((a, b) => a.t - b.t);
    const sells = trades.filter((t) => t.type === "sell").sort((a, b) => a.t - b.t);
    const buysBy = byHash(buys), sellsBy = byHash(sells);
    const tradesOut = events.filter((e) => e.kind === "wymiana" && e.minus.length).sort((a, b) => a.t - b.t);
    const used = /* @__PURE__ */ new Set();
    const owned = new Map(ownedNow() || []);
    let waiting = 0;
    const shUsed = /* @__PURE__ */ new Set();
    const w = wallet().currency;
    ensureNbp([...opens.filter((e) => e.minus.some(isKey)).map((e) => ({ cur: 1, t: e.t })), ...all2().filter((x) => CUR_ID[x.cur] && CUR_ID[x.cur] !== w).map((x) => ({ cur: CUR_ID[x.cur], t: x.t }))]);
    const bought = buyMatcher(buys);
    const newCopies = tradeDeduper();
    const acq = [];
    const moves = [];
    for (const x of byT) {
      if (x.kind === "rynek" && !/purchas|bought/i.test(x.desc)) {
        for (const i of x.minus) if (i.hash) moves.push({ t: x.t, hash: i.hash, op: "list" });
        for (const i of x.plus) if (i.hash) moves.push({ t: x.t, hash: i.hash, op: "back" });
        continue;
      }
      const counts = /* @__PURE__ */ new Map();
      for (const i of x.plus) if (i.hash) counts.set(i.hash, (counts.get(i.hash) || 0) + 1);
      for (const [hash, n] of counts) {
        const add = newCopies(x, hash, n);
        for (let j = 0; j < add; j++) {
          if (x.kind === "wymiana") acq.push({ t: x.t, hash, src: "z wymiany" });
          else if (x.kind === "rynek") acq.push({ t: x.t, hash, src: "kupiona", price: bought.priceOf(hash, x.t) });
          else acq.push({ t: x.t, hash, src: "z dropu" });
        }
      }
    }
    for (const b of bought.unmatched()) acq.push({ t: b.t, hash: b.hash, price: b.price, src: "kupiona" });
    acq.sort((a, b) => a.t - b.t);
    const acqBy = byHash(acq);
    const acqUsed = /* @__PURE__ */ new Set();
    {
      const listed2 = /* @__PURE__ */ new Map();
      for (const mv of moves) {
        const st = listed2.get(mv.hash) || listed2.set(mv.hash, []).get(mv.hash);
        if (mv.op === "list") {
          const a = (acqBy.get(mv.hash) || []).find((x) => !acqUsed.has(x) && x.t <= mv.t);
          if (a) {
            acqUsed.add(a);
            st.push(a);
          }
        } else {
          const a = st.pop();
          if (a) acqUsed.delete(a);
        }
      }
    }
    const owns2 = ownedItems(), pinned = /* @__PURE__ */ new Set();
    const free = (it) => (acqBy.get(it.hash) || []).filter((x) => !acqUsed.has(x));
    for (const it of owns2) {
      const until = lockUntil(it.lock);
      if (!until) continue;
      const got = arrivedAt(until);
      const kept = free(it).filter((x) => Math.abs(x.t - got) < 2 * 864e5).sort((a, b) => Math.abs(a.t - got) - Math.abs(b.t - got))[0];
      if (kept) {
        acqUsed.add(kept);
        pinned.add(it);
      }
    }
    for (const it of owns2) {
      if (pinned.has(it)) continue;
      const pool = free(it);
      if (pool.length) acqUsed.add(pool[pool.length - 1]);
    }
    const take = (list2, pred) => {
      const x = list2.find((y) => !used.has(y) && pred(y));
      if (x) used.add(x);
      return x;
    };
    const net4 = (p) => p == null ? null : receivedFromBuyer2(p);
    const rows3 = opens.map((e) => {
      const caseIt = e.minus.find((i) => !isKey(i)) || (e.terminal ? { name: "Terminal" } : null);
      const keyIt = e.minus.find(isKey);
      let caseCost = null, caseSrc = "";
      if (caseIt?.hash) {
        const pool = acqBy.get(caseIt.hash) || [];
        const a = pool.find((x) => !acqUsed.has(x) && x.t <= e.t + 6e4) || pool.find((x) => !acqUsed.has(x) && x.src === "kupiona" && x.t <= e.t + 864e5);
        if (a) acqUsed.add(a);
        if (a?.src === "kupiona" && a.price != null) {
          caseCost = a.price;
          caseSrc = `kupiona ${new Date(a.t).toLocaleDateString()}`;
        } else {
          const v = net4(estimate("730", caseIt.hash, e.t));
          if (v == null) waiting++;
          caseCost = v;
          caseSrc = `${a?.src || "z dropu"}${a ? " " + new Date(a.t).toLocaleDateString() : ""}`;
        }
      }
      let keyCost2 = 0, keySrc = "";
      if (keyIt) {
        const b = keyIt.hash && take(buysBy.get(keyIt.hash) || [], (t) => t.t <= e.t + 864e5);
        const kp = !b ? keyPaid(e.t, shUsed, keyExpect(e.t), storeConv) : null;
        const ka = !b && !kp ? keyPriceAt(e.t) : null;
        keyCost2 = b ? b.price : kp ? kp.price : ka.price;
        keySrc = b ? L("history.fromTheMarket") : kp ? `${L("history.purchaseHistory2")} ${new Date(kp.row.t).toLocaleDateString()}` : ka.src;
      }
      const drops = e.plus.map((d) => {
        if (!d.hash) return { ...d, fate: L("history.unknown"), value: null };
        const s = take(sellsBy.get(d.hash) || [], (t) => t.t >= e.t - 6e4);
        if (s) return { ...d, fate: `${L("history.sold3")} ${new Date(s.t).toLocaleDateString()}`, value: s.price, kind: "sold", saleT: s.t };
        const tr = tradesOut.find((o) => o.t >= e.t && o.minus.some((i) => i.hash === d.hash) && !used.has(o.id + "|" + d.hash));
        if (tr) {
          used.add(tr.id + "|" + d.hash);
          const est2 = (i) => i.hash ? net4(estimate("730", i.hash, tr.t)) : null;
          const mine = est2(d);
          const gave = tr.minus.map(est2), got = tr.plus.map(est2);
          let v2 = mine, how = L("history.marketPriceOfTheTrade");
          if (tr.plus.length && mine != null && gave.every((x) => x != null) && got.every((x) => x != null)) {
            const gaveSum = gave.reduce((a, b) => a + b, 0), gotSum = got.reduce((a, b) => a + b, 0);
            if (gaveSum > 0) {
              v2 = Math.round(mine / gaveSum * gotSum);
              how = L("history.shareOfWhatYouGot", { mine: fmt(mine), gaveSum: fmt(gaveSum), gotSum: fmt(gotSum) });
            }
          } else if (tr.plus.length && mine != null) waiting++;
          if (v2 == null) waiting++;
          return { ...d, fate: `${L("history.traded4")} ${new Date(tr.t).toLocaleDateString()}`, value: v2, kind: "traded", tr, title: `${tr.desc}${tr.plus.length ? L("history.inReturn") + tr.plus.map((i) => i.name).join(", ") : L("history.youGotNothingInReturn")}
${L("history.value")}: ${how}` };
        }
        if ((owned.get(d.hash) || 0) > 0) {
          owned.set(d.hash, owned.get(d.hash) - 1);
          const low = cached2("730", d.hash)?.lowest;
          return { ...d, fate: L("history.inYourInventory"), value: net4(low), kind: "owned" };
        }
        const v = net4(estimate("730", d.hash, e.t));
        if (v == null) waiting++;
        return { ...d, fate: L("history.notInTheInventory"), value: v, kind: "gone" };
      });
      let paid = null, paidSrc = "";
      if (e.terminal && drops.length) {
        const manual = get("termPaid", {})[e.id];
        if (manual != null) {
          paid = manual;
          paidSrc = "wpisane";
        } else {
          const tp = terminalPaid(e.t, drops[0]?.name, shUsed, keyExpect(e.t), storeConv);
          if (tp) {
            paid = tp.price;
            paidSrc = "historia zakup\xF3w";
          }
        }
      }
      const cost = (caseCost ?? 0) + keyCost2 + (paid ?? 0);
      const value = drops.reduce((s, d) => s + (d.value ?? 0), 0);
      const known = caseCost != null && drops.every((d) => d.value != null);
      const unknownPaid = !!e.terminal && paid == null && drops.length > 0;
      return { e, caseIt, keyIt, caseCost, caseSrc, keyCost: keyCost2, keySrc, drops, cost, value, profit: known && !unknownPaid ? value - cost : null, terminal: !!e.terminal, paid, paidSrc, unknownPaid };
    });
    return { rows: rows3.reverse(), waiting };
  }
  var srcText = (s = "") => s.replace(/^(kupiona|z wymiany|z dropu|wpisane|historia zakupów)/, (m) => ({ kupiona: L("history.bought3"), "z wymiany": L("history.fromATrade2"), "z dropu": L("history.fromADrop"), wpisane: L("history.entered"), "historia zakup\xF3w": L("history.purchaseHistory2") })[m]);
  function renderCases() {
    if (!el2) return;
    const since = period ? Date.now() - period * 864e5 : 0;
    const { rows: allRows, waiting } = cases();
    const rows3 = allRows.filter((r) => r.e.t >= since);
    const done = rows3.filter((r) => r.profit != null);
    const spent = rows3.reduce((s, r) => s + r.cost, 0);
    const value = rows3.reduce((s, r) => s + (r.unknownPaid ? 0 : r.value), 0);
    const spentTerm = rows3.reduce((s, r) => s + (r.terminal ? r.cost : 0), 0);
    const spentT = rows3.reduce((s, r) => s + (r.unknownPaid ? r.cost : 0), 0);
    const best = [...rows3].sort((a, b) => b.value - a.value)[0];
    const plus = done.filter((r) => r.profit > 0).length;
    el2.querySelector("#cs-h .cnt").textContent = `(${rows3.length})`;
    el2.querySelector("#cs-info").textContent = (period ? L("history.periodLastDaysChangeIt", { period }) : "") + (waiting ? L("history.estimatingPrices", { waiting }) : "") + (syncedAt() ? L("history.dataFromTheInventoryHistory") : L("history.syncTheInventoryHistoryThe")) + (syncedAt2() ? L("history.purchaseHistoryCs2Purchases", { isCS: all2().filter(isCS).length }) : "");
    el2.querySelector("#cs-cards").innerHTML = rows3.length ? `
    <div class="card"><div class="k">${L("history.openings")}</div><div class="v">${rows3.length}</div><div class="sub">${done.length ? L("history.inProfit", { plus, done: done.length }) : L("history.workingOutTheResult")}</div></div>
    <div class="card"><div class="k">${L("history.openingCost")}</div><div class="v">${fmt(spent)}</div><div class="sub" title="${esc(`${L("history.casesAndKeys")}: ${fmt(spent - spentTerm)}
${L("history.terminalsTerminalInGamePurchase")}: ${fmt(spentTerm)}`)}">${spentTerm ? L("history.casesTerminals", { spent: fmt(spent - spentTerm), spentTerm: fmt(spentTerm) }) : L("history.casesKeys")}</div></div>
    <div class="card"><div class="k">${L("history.dropValue")}</div><div class="v">${fmt(value)}</div><div class="sub">${L("history.afterTheFee")}</div></div>
    <div class="card"><div class="k">${L("history.profitLossOnCases")}</div><div class="v ${value - (spent - spentT) >= 0 ? "pos" : "neg"}">${fmt(value - (spent - spentT))}</div><div class="sub">${spent - spentT ? pct((value - (spent - spentT)) / (spent - spentT)) : "-"}${spentT ? L("history.withoutTerminalsWithNoAmount") : ""}</div></div>
    ${best ? `<div class="card"><div class="k">${L("history.bestDrop")}</div><div class="v" style="font-size:14px;color:#${esc(best.drops[0]?.color || "fff")}">${esc(best.drops[0]?.name || "")}</div><div class="sub">${fmt(best.value)} \xB7 ${new Date(best.e.t).toLocaleDateString()}</div></div>` : ""}` : "";
    renderPager("cs", rows3.length);
    el2.querySelector("#cs-list").innerHTML = rows3.length ? `<table><thead><tr><th>${L("history.date")}</th><th>${L("history.caseTerminal")}</th><th>${L("history.cost2")}</th><th>${L("history.dropPurchase")}</th><th>${L("history.whatHappenedToIt")}</th><th>${L("history.value")}</th><th>${L("history.profitLoss")}</th></tr></thead><tbody>${pageOf("cs", rows3).map((r) => `
    <tr><td style="white-space:nowrap">${new Date(r.e.t).toLocaleString()}</td>
    <td><span class="tag" style="margin-right:5px;${r.terminal ? "border-color:#8a6d1f;color:#e6c35c" : ""}" title="${r.terminal ? L("history.terminalOnceUnsealedYouCan") : L("history.aCaseOpenedWithA")}">${r.terminal ? "terminal" : L("history.case")}</span>${esc((r.caseIt?.name || "?").replace(/^Sealed /, ""))}${r.terminal && r.drops.length && r.paidSrc !== "historia zakup\xF3w" ? `<label class="sub" style="display:flex;gap:4px;align-items:center;margin-top:2px">${L("history.paid")} <input class="p" data-termpaid="${esc(r.e.id)}" value="${r.paidSrc === "wpisane" ? toInput(r.paid) : ""}" placeholder="${r.paidSrc === "historia zakup\xF3w" ? esc(toInput(r.paid)) : L("history.amount")}" style="width:64px;padding:2px 5px"></label>` : ""}</td>
    <td>${fmt(r.cost)}<div class="sub">${r.paid != null ? `${L("history.inGamePurchase")} ${fmt(r.paid)} (${srcText(r.paidSrc)}) \xB7 ` : ""}${r.caseIt ? `${r.terminal ? "terminal" : L("history.case")} ${r.caseCost != null ? fmt(r.caseCost) : "\u2026"} (${srcText(r.caseSrc)})` : ""}${r.keyIt ? ` \xB7 ${L("history.key")} ${fmt(r.keyCost)} (${r.keySrc})` : ""}</div></td>
    <td>${r.terminal && !r.drops.length ? `<span class="sub">${L("history.nothingBought")}</span>` : ""}${r.drops.map((d) => `<span style="color:#${esc(d.color || "c6d4df")}">${esc(displayName(d.hash, d.name))}</span>`).join("<br>")}</td>
    <td>${r.drops.map((d) => `<span class="sub ${d.kind === "owned" ? "acc" : ""}" title="${esc(d.title || "")}">${esc(d.fate)}</span>${d.tr?.partner ? ` <span class="sub">${L("history.with3")} ${partnerLink(d.tr)}</span>${ownerBtn(d.tr, d.hash)}` : ""}`).join("<br>")}</td>
    <td>${r.drops.map((d) => (d.value != null ? fmt(d.value) : "\u2026") + (d.kind !== "owned" ? nowCmp(d.hash, d.value) : "")).join("")}</td>
    <td class="${r.profit > 0 ? "pos" : r.profit < 0 ? "neg" : ""}">${r.profit != null ? fmt(r.profit) : r.unknownPaid ? `<span class="sub warn" title="${L("history.enterTheAmountPaidIn")}">${L("history.enterAmount")}</span>` : "\u2026"}</td></tr>`).join("")}</tbody></table>` : `<div class="empty">${L("history.noOpenedCasesInThis")}${syncedAt() ? "" : L("history.syncTheInventoryHistoryFirst")}.</div>`;
  }
  function partnerLink(e) {
    if (!e?.partner?.href) return "";
    return `<a href="${esc(e.partner.href)}" target="_blank" class="acc" title="${L("history.tradePartnersProfile")}">${esc(e.partner.name || L("history.profile"))}</a>`;
  }
  function ownerBtn(e, hash) {
    if (!e?.partner?.href || !hash) return "";
    const st = ownerState(e.partner.href, hash);
    if (!st) return ` <button class="b s" data-owner="${esc(e.partner.href)}" data-hash="${esc(hash)}" title="${L("history.checksThePartnersPublicInventory")}">${L("history.doesHeStillHaveIt")}</button>`;
    return {
      checking: ` <span class="sub">${L("history.checking")}</span>`,
      has: ` <span class="ok" title="${L("history.thisItemSameNameAnd")}">\u2714 ${L("history.stillHasIt")}${st.n > 1 ? ` (${st.n})` : ""}</span>`,
      no: ` <span class="warn" title="${L("history.itIsntInTheirInventory")}">\u2718 ${L("history.noLongerHasIt")}</span>`,
      private: ` <span class="mut" title="${L("history.thePartnersInventoryIsPrivate")}">\u{1F512} ${L("history.privateInventory")}</span>`,
      error: ` <span class="err" title="${esc(st.msg || "")}">${L("history.checkFailed")}</span>`
    }[st.state] || "";
  }
  var nowQueue = /* @__PURE__ */ new Map();
  var nowTimer = null;
  function nowPrice(hash, appid = 730) {
    if (!hash) return null;
    const app2 = /^\d+-/.test(hash) ? "753" : String(appid || 730);
    const c = cached2(app2, hash);
    if (c?.lowest) return c.lowest;
    const k = app2 + "|" + hash;
    if (!hasLowest(app2, hash, 360) && (nowQueue.has(k) || nowQueue.size < 150)) {
      nowQueue.set(k, { appid: app2, hash });
      clearTimeout(nowTimer);
      nowTimer = setTimeout(() => {
        const list2 = [...nowQueue.values()];
        nowQueue.clear();
        lowestPrices(list2).then(() => {
          render2();
          renderInv();
        });
      }, 1e3);
    }
    return null;
  }
  function nowCmp(hash, ref, { net: net4 = true } = {}) {
    const low = nowPrice(hash);
    if (low == null) return "";
    const today = net4 ? receivedFromBuyer2(low) : low;
    const d = ref ? (today - ref) / ref : null;
    const tip = net4 ? L("history.lowestPriceTodayInHand", { low: fmt(low), today: fmt(today) }) : L("history.lowestPriceToday", { low: fmt(low) });
    return `<div class="sub" title="${esc(tip)}">${L("history.today")} ${fmt(low)}${d != null && isFinite(d) ? ` <span class="${d >= 0 ? "pos" : "neg"}">(${d >= 0 ? "+" : ""}${pct(d, 0)})</span>` : ""}</div>`;
  }
  function drawMonths(res, all3, inR) {
    const box2 = el2?.querySelector("#h-months");
    if (!box2) return;
    const on = get("histMonths", false);
    el2.querySelector('[data-a="months"]')?.classList.toggle("on", on);
    if (!on) {
      box2.innerHTML = "";
      return;
    }
    const key = (t) => {
      const d = new Date(t);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    };
    const m = /* @__PURE__ */ new Map();
    const row = (t) => {
      const k = key(t);
      return m.get(k) || m.set(k, { k, t, flip: 0, nf: 0, wins: 0, cases: 0, nc: 0, open: 0, spent: 0, recv: 0 }).get(k);
    };
    for (const r of res.realized) if (inR(r.t)) {
      const x = row(r.t);
      x.flip += r.pnl;
      x.nf++;
      if (r.pnl > 0) x.wins++;
    }
    for (const t of all3) if (inR(t.t)) {
      const x = row(t.t);
      if (t.type === "buy") x.spent += t.price * t.amount;
      else x.recv += t.price * t.amount;
    }
    for (const r of memo?.co?.rows || []) if (inR(r.e.t)) {
      const x = row(r.e.t);
      x.open++;
      if (r.profit != null) {
        x.cases += r.profit;
        x.nc++;
      }
    }
    const rows3 = [...m.values()].sort((a, b) => b.k.localeCompare(a.k));
    if (!rows3.length) {
      box2.innerHTML = `<div class="sub" style="padding:6px 0">${L("history.noTradesInThisPeriod")}</div>`;
      return;
    }
    const money = (v) => `<span class="${v > 0 ? "pos" : v < 0 ? "neg" : ""}">${v > 0 ? "+" : ""}${fmt(Math.round(v))}</span>`;
    const sum = rows3.reduce((s, x) => {
      for (const k of ["flip", "nf", "wins", "cases", "nc", "open", "spent", "recv"]) s[k] += x[k];
      return s;
    }, { flip: 0, nf: 0, wins: 0, cases: 0, nc: 0, open: 0, spent: 0, recv: 0 });
    const name = (x) => {
      const [y, mo] = x.k.split("-").map(Number);
      return new Date(y, mo - 1, 1).toLocaleDateString(locale(), { month: "long", year: "numeric" });
    };
    const line = (x, label, strong = false) => `<tr${strong ? ' style="font-weight:600;border-top:2px solid var(--ln)"' : ""}><td>${label}</td>
    <td>${x.nf ? `${money(x.flip)} <span class="sub">${x.nf} \xB7 ${Math.round(x.wins / x.nf * 100)}% ${L("history.inProfit2")}</span>` : '<span class="sub">-</span>'}</td>
    <td>${x.open ? `${x.nc ? money(x.cases) : '<span class="sub">\u2026</span>'} <span class="sub">${x.open} ${L("history.open")}${x.nc < x.open ? L("history.withoutAResult", { open: x.open - x.nc }) : ""}</span>` : '<span class="sub">-</span>'}</td>
    <td>${fmt(x.spent)}</td><td>${fmt(x.recv)}</td><td><b>${money(x.flip + x.cases)}</b></td></tr>`;
    box2.innerHTML = `<div class="sub" style="display:flex;gap:10px;align-items:baseline;margin:6px 0 2px"><b style="color:#c6d4df;font-size:13px">${L("history.resultByMonth")}</b><span>${L("history.flipsAndCasesWithA")}</span></div>
    <table style="margin-bottom:8px"><thead><tr><th>${L("history.month")}</th><th>${L("history.flipProfit")}</th><th>${L("history.cases2")}</th><th>${L("history.spent")}</th><th>${L("history.received2")}</th><th>${L("history.total2")}</th></tr></thead>
    <tbody>${rows3.map((x) => line(x, name(x))).join("")}${rows3.length > 1 ? line(sum, L("history.total2"), true) : ""}</tbody></table>`;
  }
  var chartPts = [];
  var chartZoom = null;
  var CH = { l: 70, r: 12, W: 1e3 };
  function drawChart() {
    const box2 = el2?.querySelector("#h-chart");
    if (!box2) return;
    const on = get("histChart", false);
    el2.querySelector('[data-a="chart"]')?.classList.toggle("on", on);
    if (!on || chartPts.length < 2) {
      box2.innerHTML = on ? `<div class="sub" style="padding:6px 0">${L("history.tooFewSalesToDraw")}</div>` : "";
      return;
    }
    let p = chartPts;
    if (chartZoom) {
      const [a, b] = chartZoom;
      const before = [...chartPts].reverse().find((x) => x[0] < a);
      const inside = chartPts.filter((x) => x[0] >= a && x[0] <= b);
      const lastV = (inside.length ? inside[inside.length - 1] : before)?.[1] ?? 0;
      p = [[a, before ? before[1] : 0], ...inside, [b, lastV]];
    }
    const x0 = p[0][0], x1 = p[p.length - 1][0];
    const short = x1 - x0 < 3 * 864e5;
    const endV = chartPts[chartPts.length - 1][1];
    const delta = chartZoom ? p[p.length - 1][1] - p[0][1] : endV;
    box2.innerHTML = `
    <div class="sub" style="display:flex;gap:10px;align-items:baseline;flex-wrap:wrap;margin:6px 0 2px">
      <b style="color:#c6d4df;font-size:13px">${L("history.cumulativeFlipProfit")}</b>
      <span>${chartZoom ? L("history.theTableAndCardsShow", { x0: new Date(x0).toLocaleDateString(), x1: new Date(x1).toLocaleDateString() }) : L("history.total3")}<b class="${delta >= 0 ? "pos" : "neg"}">${delta >= 0 ? "+" : ""}${fmt(Math.round(delta))}</b></span>
      <span class="sp" style="flex:1"></span>
      <span id="h-ch-tip" style="color:#c6d4df"></span>
      ${chartZoom ? `<button class="b" data-a="chartreset">${L("history.showAll")}</button>` : `<span>${L("history.dragTheMouseOverThe")}</span>`}
    </div>
    <div id="h-ch-wrap" style="position:relative;cursor:crosshair;user-select:none">
      ${lineChart([{ points: p, color: endV >= 0 ? "#a4d007" : "#ff6b6b" }], { fmtY: (v) => fmt(Math.round(v)), fmtX: (v) => short ? new Date(v).toLocaleString([], { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) : new Date(v).toLocaleDateString(), height: 180, zero: true })}
      <div id="h-ch-sel" hidden style="position:absolute;top:0;bottom:22px;background:rgba(102,192,244,.18);border:1px solid rgba(102,192,244,.6);pointer-events:none"></div>
    </div>`;
    const wrap = box2.querySelector("#h-ch-wrap");
    const sel2 = box2.querySelector("#h-ch-sel");
    const tip = box2.querySelector("#h-ch-tip");
    const tAt = (clientX) => {
      const r = wrap.getBoundingClientRect();
      const fx2 = (clientX - r.left) / r.width * CH.W;
      const f = Math.min(1, Math.max(0, (fx2 - CH.l) / (CH.W - CH.l - CH.r)));
      return x0 + f * (x1 - x0);
    };
    let start = null;
    wrap.onmousedown = (e) => {
      if (e.button !== 0) return;
      start = e.clientX;
      sel2.hidden = true;
      e.preventDefault();
    };
    wrap.onmousemove = (e) => {
      const t = tAt(e.clientX);
      const near = p.reduce((best, x) => Math.abs(x[0] - t) < Math.abs(best[0] - t) ? x : best, p[0]);
      tip.innerHTML = `${new Date(near[0]).toLocaleString()} \xB7 <b class="${near[1] >= 0 ? "pos" : "neg"}">${fmt(Math.round(near[1]))}</b>`;
      if (start == null) return;
      const r = wrap.getBoundingClientRect();
      const a = Math.min(start, e.clientX) - r.left, b = Math.max(start, e.clientX) - r.left;
      Object.assign(sel2.style, { left: a + "px", width: b - a + "px" });
      sel2.hidden = b - a < 3;
    };
    wrap.onmouseleave = () => {
      tip.textContent = "";
    };
    const finish = (e) => {
      if (start == null) return;
      const s = start;
      start = null;
      sel2.hidden = true;
      window.removeEventListener("mouseup", finish);
      if (Math.abs(e.clientX - s) < 6) return;
      const a = tAt(Math.min(s, e.clientX)), b = tAt(Math.max(s, e.clientX));
      if (b - a < 6e4) return;
      chartZoom = [a, b];
      pages.tx = 0;
      render2(true);
    };
    wrap.addEventListener("mousedown", () => window.addEventListener("mouseup", finish));
    wrap.ondblclick = () => {
      if (chartZoom) {
        chartZoom = null;
        pages.tx = 0;
        render2(true);
      }
    };
  }
  var originsMemo = null;
  function itemOrigins() {
    if (originsMemo && Date.now() - originsMemo.at < 6e4) return originsMemo.map;
    const { list: trades } = converted(timedTrades().all);
    const bought = buyMatcher(trades.filter((t) => t.type === "buy").sort((a, b) => a.t - b.t));
    const drops = [];
    try {
      for (const r of cases().rows) {
        const share = r.drops.length ? 1 / r.drops.length : 1;
        for (const d of r.drops) if (d.hash) drops.push({ t: r.e.t, hash: d.hash, cost: r.caseCost == null || r.unknownPaid ? null : Math.round(r.cost * share), name: (r.caseIt?.name || "").replace(/^Sealed /, ""), terminal: r.terminal, used: false });
      }
    } catch {
    }
    const dropsBy = byHash(drops);
    const est2 = (hash, t, app2 = 730) => hash ? estimate(String(app2), hash, t) : null;
    const acq = [];
    const newCopies = tradeDeduper();
    const allEv = allEvents();
    const tradeEv = allEv.filter((y) => y.kind === "wymiana");
    for (const x of [...allEv].sort((a, b) => a.t - b.t)) {
      if (x.kind === "rynek" && !/purchas|bought/i.test(x.desc)) continue;
      const counts = /* @__PURE__ */ new Map();
      for (const i of x.plus) if (i.hash) counts.set(i.hash, (counts.get(i.hash) || 0) + 1);
      if (x.kind !== "wymiana") {
        for (const i of x.minus) if (i.hash && counts.get(i.hash) > 0) counts.set(i.hash, counts.get(i.hash) - 1);
      }
      for (const [hash, n] of counts) {
        const add = newCopies(x, hash, n);
        for (let j = 0; j < add; j++) {
          const d = (dropsBy.get(hash) || []).find((y) => !y.used && Math.abs(y.t - x.t) < 5 * 6e4);
          if (d) {
            d.used = true;
            acq.push({ t: x.t, hash, src: d.terminal ? "z terminala" : "ze skrzyni", detail: d.name, cost: d.cost, wait: d.cost == null });
            continue;
          }
          if (x.kind === "rynek") {
            const p = bought.priceOf(hash, x.t);
            const e = p == null ? est2(hash, x.t, x.app) : null;
            acq.push({ t: x.t, hash, src: "kupiony", cost: p ?? e, approx: p == null, wait: p == null && e == null, detail: "" });
            continue;
          }
          if (x.kind === "wymiana" || x.kind === "kontrakt") {
            const { cost, outs } = tradeCost(x, hash, tradeEv);
            const who = x.partner?.name ? ` ${L("history.from")} ${x.partner.name}` : "";
            acq.push({ t: x.t, hash, src: x.kind === "kontrakt" ? "z kontraktu" : "z wymiany", detail: x.kind === "kontrakt" ? "" : who, cost, wait: cost == null, gave: outs.map((i) => i.name) });
            continue;
          }
          acq.push({ t: x.t, hash, src: "drop", detail: /^\d+-/.test(hash) ? `Steam: ${L("history.aGameDrop")} (${x.desc})` : x.desc, cost: 0 });
        }
      }
    }
    for (const b of bought.unmatched()) acq.push({ t: b.t, hash: b.hash, src: "kupiony", cost: b.price, detail: "" });
    {
      const pools = byHash([...acq].sort((a, b) => a.t - b.t));
      const gone = trades.filter((t) => t.type === "sell").map((t) => ({ hash: t.hash, t: t.t, amount: t.amount || 1 }));
      for (const x of allEv) if (/craft/i.test(x.desc)) {
        for (const i of x.minus) if (i.hash) gone.push({ hash: i.hash, t: x.t, amount: 1 });
      }
      for (const s of gone.sort((a, b) => a.t - b.t)) {
        const pool = pools.get(s.hash);
        for (let k = 0; pool && k < (s.amount || 1); k++) {
          const i = pool.findIndex((x) => x.t <= s.t);
          if (i < 0) break;
          pool.splice(i, 1)[0].sold = true;
        }
      }
    }
    const live = acq.filter((x) => !x.sold);
    const map = /* @__PURE__ */ new Map();
    const used = /* @__PURE__ */ new Set();
    const own = ownedItems();
    const acqBy = byHash(live);
    const pick2 = (it, pred, order = (a, b) => b.t - a.t) => {
      const pool = (acqBy.get(it.hash) || []).filter((x) => !used.has(x) && pred(x)).sort(order);
      const got = pool[0];
      if (got) {
        used.add(got);
        map.set(it.assetid, got);
      }
      return got;
    };
    for (const it of own) {
      const until = lockUntil(it.lock);
      if (until) {
        const at = arrivedAt(until);
        pick2(it, (x) => Math.abs(x.t - at) < 2 * 864e5, (a, b) => Math.abs(a.t - at) - Math.abs(b.t - at));
      }
    }
    for (const it of own) if (!map.has(it.assetid)) pick2(it, () => true);
    for (const x of [...live].sort((a, b) => b.t - a.t)) if (!used.has(x) && !map.has("h:" + x.hash)) map.set("h:" + x.hash, x);
    originsMemo = { at: Date.now(), map };
    return map;
  }

  // src/features/sellsignals.js
  var hist2 = bucket("sellHist");
  var TTL = 12 * 36e5;
  var DAY = 864e5;
  var costs = null;
  var costsAt = 0;
  function costOf(hash) {
    if (!costs || Date.now() - costsAt > 6e4) {
      try {
        costs = heldCosts();
      } catch {
        costs = /* @__PURE__ */ new Map();
      }
      costsAt = Date.now();
    }
    return costs.get(hash) ?? null;
  }
  function prune2(days = 14) {
    const all3 = hist2.all();
    const lim = Date.now() - days * DAY;
    const old = Object.keys(all3).filter((k) => (all3[k]?.at || 0) < lim);
    if (!old.length) return;
    for (const k of old) delete all3[k];
    hist2.replace(all3);
  }
  var FILL_V = 5;
  var fresh2 = (hash) => {
    const h = hist2.get(hash);
    return h && "f" in h && h.fv === FILL_V && (h.f || "p" in h) && Date.now() - h.at < TTL ? h : null;
  };
  var fill = (hash) => fresh2(hash)?.f || null;
  function soldAt(hash, price) {
    const r = recentSales(hash);
    if (!r || price == null) return null;
    let n = 0, total = 0;
    for (const [, pr, v] of r.pts) {
      total += v;
      if (pr >= price) n += v;
    }
    return { n, total, days: r.days };
  }
  function recentMedian(hash) {
    const r = recentSales(hash);
    if (!r) return null;
    const s = [...r.pts].sort((a, b) => a[1] - b[1]);
    const tot = s.reduce((x, p) => x + p[2], 0);
    let acc = 0;
    for (const p of s) {
      acc += p[2];
      if (acc >= tot / 2) return p[1];
    }
    return null;
  }
  function recentSales(hash) {
    const h = hist2.get(hash);
    if (!h?.p) return null;
    const within = (days2) => {
      const since = Date.now() - days2 * DAY;
      return h.p.filter((p) => p[0] >= since && p[2] > 0);
    };
    const units = (pts2) => pts2.reduce((x, p) => x + p[2], 0);
    let pts = within(14), days = 14;
    if (units(pts) < 5) {
      pts = within(30);
      days = 30;
    }
    return pts.length ? { pts, days } : null;
  }
  var chain2 = Promise.resolve();
  function ensure3(list2, { onEach, isCancelled = () => false } = {}) {
    const run = chain2.then(async () => {
      const todo = [...new Map(list2.filter((x) => !fresh2(x.hash)).map((x) => [x.hash, x])).values()];
      for (const x of todo) {
        if (isCancelled()) break;
        try {
          const pts = await priceHistory(x.appid || 730, x.hash);
          const since = Date.now() - 35 * DAY;
          const days = /* @__PURE__ */ new Map();
          for (const p of pts) {
            if (p.t < since) continue;
            const d = Math.floor(p.t / DAY) * DAY;
            const a = days.get(d) || [0, 0];
            a[0] += p.price * (p.vol || 1);
            a[1] += p.vol || 1;
            days.set(d, a);
          }
          let f = null;
          try {
            f = fillTable(pts);
          } catch {
          }
          let rt = null;
          try {
            rt = recentTrend(pts);
          } catch {
          }
          const e = { at: Date.now(), d: [...days].sort((a, b) => a[0] - b[0]).map(([d, [s, v]]) => [d, Math.round(s / v), v]), f, rt, fv: FILL_V };
          if (!f) e.p = pts.filter((p) => p.t >= Date.now() - 30 * DAY && p.vol > 0).slice(-400).map((p) => [p.t, p.price, p.vol]);
          hist2.set(x.hash, e);
        } catch (e) {
          if (e.status === 429) break;
          hist2.set(x.hash, { at: Date.now(), d: [], f: null, p: [], fv: FILL_V });
        }
        onEach?.();
      }
    });
    chain2 = run.catch(() => {
    });
    return run;
  }
  var avg = (rows3) => {
    const v = rows3.reduce((s, r) => s + r[2], 0);
    return v ? rows3.reduce((s, r) => s + r[1] * r[2], 0) / v : null;
  };
  function signals(it, lowest) {
    if (!(it.marketable || it.lock) || !lowest) return [];
    const th = (settings.sellSignalPct ?? 10) / 100;
    const out = [];
    const net4 = receivedFromBuyer2(lowest);
    if (lowest > 0 && 1 - net4 / lowest >= 0.4) {
      out.push({ k: "hold", label: L("sellsignals.hold"), cls: "mut", title: L("sellsignals.theFeeEatsOfThe", { net: Math.round((1 - net4 / lowest) * 100), lowest: fmt(lowest), net2: fmt(net4) }) });
      return out;
    }
    const cost = costOf(it.hash);
    if (cost && net4 >= cost * (1 + th)) out.push({ k: "profit", label: L("sellsignals.inProfit", { net: Math.round((net4 / cost - 1) * 100) }), cls: "pos", title: L("sellsignals.youBoughtItForToday", { cost: fmt(Math.round(cost)), net: fmt(net4) }) });
    const h = hist2.get(it.hash);
    if (h?.d?.length >= 5) {
      const now = Date.now();
      const recentRows = h.d.filter((r) => r[0] >= now - 2 * DAY);
      const recent = avg(recentRows), recentVol = recentRows.reduce((s, r) => s + r[2], 0);
      const base = avg(h.d.filter((r) => r[0] >= now - 30 * DAY && r[0] < now - 2 * DAY));
      const a7 = avg(h.d.filter((r) => r[0] >= now - 7 * DAY));
      const prev = avg(h.d.filter((r) => r[0] < now - 7 * DAY && r[0] >= now - 28 * DAY));
      if (base && recent && recentVol >= 3 && recent >= base * (1 + th) && lowest >= base * (1 + th)) {
        out.push({ k: "high", label: L("sellsignals.priceyNow"), cls: "warn", title: L("sellsignals.overTheLast2Days", { recent: fmt(Math.round(recent)), recentVol, recent2: Math.round((recent / base - 1) * 100), base: fmt(Math.round(base)), lowest: fmt(lowest) }) });
      }
      if (a7 && prev && a7 <= prev * (1 - th)) out.push({ k: "fall", label: L("sellsignals.priceFalling"), cls: "err", title: L("sellsignals.lastWeeksAverageIsLower", { a7: fmt(Math.round(a7)), a72: Math.round((1 - a7 / prev) * 100), prev: fmt(Math.round(prev)) }) });
    }
    const tr = trendOf(it);
    if (tr?.ref && Math.abs(tr.t - tr.m) >= 0.2) {
      out.push({ k: tr.t < tr.m ? "tdown" : "tup", label: `${tr.t < 0 ? "\u2198" : "\u2197"} ${pctTxt(tr.t)} ${L("sellsignals.in")} ${tr.span} (${tr.ref.label} ${pctTxt(tr.m)})`, cls: "mut", title: `${trendNote(it)}
${L("sellsignals.thisOnlyTellsWhatAlready")}` });
    }
    return out;
  }
  var pctTxt = (x) => `${x < 0 ? "\u2212" : "+"}${Math.round(Math.abs(x) * 100)}%`;
  function trendOf(it) {
    const rt = hist2.get(it.hash)?.rt;
    if (!rt) return null;
    const ref = String(it.appid || 730) === "730" ? refFor(it.hash, it.type || "") : null;
    if (rt.t6 != null) return { t: rt.t6, m: ref?.t6 ?? null, span: L("sellsignals.halfAYear"), rt, ref: ref?.t6 != null ? ref : null };
    if (rt.t3 != null) return { t: rt.t3, m: ref?.t3 ?? null, span: L("sellsignals.3Months"), rt, ref: ref?.t3 != null ? ref : null };
    return null;
  }
  function trendNote(it) {
    const tr = trendOf(it);
    if (!tr) return "";
    const f = (c) => c ? fmt(Math.round(c)) : "-";
    const own = L("sellsignals.monthlyMedianSalePriceHalf", { m6: f(tr.rt.m6), m3: f(tr.rt.m3), now: f(tr.rt.now), t: pctTxt(tr.t), span: tr.span });
    if (!tr.ref) return own;
    const who = tr.ref.whole ? L("sellsignals.theWholeMarket") : tr.ref.label.replace(/^./, (c) => c.toUpperCase());
    return `${own}
` + L("sellsignals.ofCs2OverThatTime", { who, m: pctTxt(tr.m), n: tr.ref.n, at: new Date(tr.ref.at).toLocaleDateString() });
  }
  function histState(it, lowest) {
    if (!(it.marketable || it.lock) || !lowest || lowest < 20) return "skip";
    const h = hist2.get(it.hash);
    if (!h) return "wait";
    return h.d?.length >= 5 ? "ok" : "none";
  }
  var worth = (sig) => sig.some((s) => s.k === "profit" || s.k === "high");
  function skipChooser(hash, net4 = (p) => receivedFromBuyer2(p)) {
    const table = fill(hash), t = typical(hash);
    const perDay = t?.sold7 ? t.sold7 / 7 * LIST_SHARE : null;
    return (levels2) => queueChoice({ table, perDay, levels: levels2, net: net4, undercut: settings.undercut, maxWaitDays: settings.maxWaitDays ?? 2 });
  }
  function typical(hash) {
    const h = hist2.get(hash);
    if (!h?.d?.length) return null;
    const now = Date.now();
    const d7 = h.d.filter((r) => r[0] >= now - 7 * DAY), d30 = h.d.filter((r) => r[0] >= now - 30 * DAY);
    return { d7: avg(d7), d30: avg(d30), sold7: d7.reduce((s, r) => s + r[2], 0) };
  }

  // src/features/listings.js
  var rules = bucket("sellRules");
  var rows = [];
  var priceSum = () => {
  };
  var pend = [];
  var AWAIT_KEY = "awaitConfirm";
  function rememberWaiting(res) {
    if (!res?.waiting?.length) return;
    const list2 = get(AWAIT_KEY, []);
    for (const w of res.waiting) list2.push({ hash: w.listing.hash, name: w.listing.name, icon: w.listing.icon, color: w.listing.color, appid: w.listing.appid, recv: w.recv, buyer: w.buyer, amount: w.listing.amount, at: Date.now() });
    set(AWAIT_KEY, list2.slice(-50));
  }
  function pendingRows(listings, pending, known, toConfirm) {
    const key = (x) => `${x.hash}|${x.recv}`;
    const live = new Set(listings.map(key)), shown3 = new Set(pending.map(key));
    let ours = get(AWAIT_KEY, []).filter((a) => Date.now() - a.at < 36e5 && !live.has(key(a)));
    if (known && pending.length >= toConfirm) ours = ours.filter((a) => Date.now() - a.at < 12e4);
    set(AWAIT_KEY, ours);
    let extra = ours.filter((a) => !shown3.has(key(a)));
    if (known && pending.length < toConfirm) extra = extra.slice(-(toConfirm - pending.length));
    return [...pending, ...extra.map((a) => ({ ...a, local: true }))].map((p) => ({ ...p, pending: true }));
  }
  var pendingRow = (r) => `<tr class="pend" style="opacity:.62">
      <td></td>
      <td>${itemCell({ ...r, sub: `${r.amount > 1 ? `${r.amount} ${L("listings.pcs")} \xB7 ` : ""}${L("listings.notOnTheMarketYet")}` })}</td>
      <td><b>${fmt(r.buyer)}</b><div class="sub">${L("listings.youGet")} ${fmt(r.recv)}</div></td>
      <td><span class="chipst mid" title="${L("listings.steamListsThisItemOnly")}">\u23F3 ${L("listings.waitingForConfirmation")}</span></td>
      <td colspan="2"><span class="sub">${L("listings.confirmItInTheSteam")}${r.local ? L("listings.newPriceSetInFlipster") : ""}</span></td></tr>`;
  var sellPlans2 = bucket("sellPlans");
  var planList = () => Object.entries(sellPlans2.all()).map(([hash, p]) => ({ ...p, hash, name: p.name || hash, appid: p.appid || 730 })).sort((a, b) => (a.until || Infinity) - (b.until || Infinity));
  var planRow = (p) => `<tr class="plan" style="background:rgba(102,192,244,.04)">
      <td></td>
      <td>${itemCell({ ...p, sub: `${p.qty > 1 ? `${p.qty} ${L("listings.pcs")} \xB7 ` : ""}${L("listings.tradeLocked")}${p.guard ? L("listings.thenTheAutomation") : ""}` })}</td>
      <td>${p.mode === "fixed" ? `<b>${fmt(p.price)}</b><div class="sub">${L("listings.youGet")} ${fmt(receivedFromBuyer2(p.price))}</div>` : `<b>${L("listings.suggested")}</b><div class="sub">${p.min != null ? L("listings.notBelow", { min: fmt(p.min) }) : L("listings.noLowerLimit")}</div>`}</td>
      <td><span class="chipst" style="color:#66c0f4;border-color:#2a6f9c" title="${L("listings.whenTheLockEndsFlipster")}">\u23F0 ${L("listings.illListIt")} ${fmtWhen(p.until)}</span>${planStatus(p)}</td>
      <td colspan="2"><div class="acts" style="flex-wrap:nowrap;align-items:center">
        <button class="b" data-a="planedit" data-hash="${esc(p.hash)}" data-app="${p.appid}" title="${L("listings.youChangeThePlanOn")}">${L("listings.changeInInventory")} \u2197</button>
        <button class="b red" data-a="plandel" data-hash="${esc(p.hash)}">${L("listings.removePlan")}</button>
      </div></td></tr>`;
  var planMarket = /* @__PURE__ */ new Map();
  function planStatus(p) {
    const h = planMarket.get(p.hash);
    if (!h) return L("listings.checkingTheMarket");
    const f = fmt, N = waitDays(), days = daysTxt(N);
    const table = fill(p.hash);
    const low = h.lowestSell;
    let price = p.mode === "fixed" ? p.price : null, atMin = false;
    if (p.mode !== "fixed") {
      const a = adviceOf({ hash: p.hash, appid: p.appid, marketable: true }, h);
      price = a?.price ?? p.min ?? null;
      if (p.min != null && price != null && price < p.min) {
        price = p.min;
        atMin = true;
      }
    }
    const cheapest = low ? ` \xB7 ${L("listings.cheapest")} ${f(low)}` : "";
    if (price == null) return `<div class="sub" style="margin-top:4px">${L("listings.todayNoMarketData")}${cheapest}</div>`;
    const c = table ? sellChance(table, N, price, h.sellGraph) : null;
    const what = p.mode === "fixed" ? L("listings.yourPrice") : atMin ? L("listings.yourMinimum") : L("listings.suggestion");
    const line = `${L("listings.today")}: ${what} <b>${f(price)}</b>${c != null ? ` \xB7 ${L("listings.chanceWithin", { days })}: ${Math.round(c * 100)}%` : ""}${cheapest}`;
    let verdict;
    if (h.highestBuy && price <= h.highestBuy) verdict = `<span class="warn">${L("listings.notAboveTheBuyOrder", { highestBuy: f(h.highestBuy) })}</span>`;
    else if (c != null && c < 0.25) verdict = `<span class="err">${L("listings.tooPriceyTodaySmallChance")}${atMin || p.mode === "fixed" ? L("listings.considerALowerPrice") : ""}</span>`;
    else if (c != null && c < 0.5) verdict = `<span class="warn">${L("listings.willProbablyWaitLongerThan", { days })}</span>`;
    else if (c != null) verdict = `<span class="ok">${L("listings.looksGood")}</span>`;
    return `<div class="sub" style="margin-top:4px">${line}</div>${verdict ? `<div class="sub">${verdict}</div>` : ""}`;
  }
  async function checkPlans() {
    for (const p of planList()) {
      try {
        planMarket.set(p.hash, await hist(p.appid, p.hash, 10 * 6e4));
        renderSoon();
      } catch {
      }
    }
  }
  var el3;
  var task3 = null;
  var lastAuto = null;
  var sort2 = sorter("name", 1);
  var pass = null;
  var inPass = (fn) => {
    if (pass) return fn();
    pass = { mine: null, others: /* @__PURE__ */ new Map(), sug: /* @__PURE__ */ new Map() };
    try {
      return fn();
    } finally {
      pass = null;
    }
  };
  var myPriceMap = (hash) => {
    if (pass) {
      if (!pass.mine) {
        pass.mine = /* @__PURE__ */ new Map();
        for (const r of rows) {
          const m2 = pass.mine.get(r.hash) || pass.mine.set(r.hash, {}).get(r.hash);
          m2[r.buyer] = (m2[r.buyer] || 0) + 1;
        }
      }
      return pass.mine.get(hash) || {};
    }
    const m = {};
    for (const r of rows) if (r.hash === hash) m[r.buyer] = (m[r.buyer] || 0) + 1;
    return m;
  };
  var waitDays = () => horizonOf(settings.maxWaitDays ?? 2);
  function mount3(root2) {
    el3 = root2;
    root2.innerHTML = `
    <div class="bar">
      <button class="b" data-a="reload" title="${L("listings.loadsYourListingsAndChecks")}">\u27F3 ${L("listings.refresh")}</button>
      <span class="sub" id="l-tick" title="${L("listings.whileThePanelIsOpen")}"></span>
      <span class="sub" id="l-comp"></span> <span class="sub" id="l-note"></span>
      <span class="sp"></span>
      <button class="b" data-a="pricepanel" title="${L("listings.howToCalculateSuggestedPrices")}">\u2699 <b id="l-pricesum"></b></button>
      <button class="b dbg" data-a="research" title="${L("listings.downloadsTheOrderBookAnd")}">\u2B07 ${L("listings.dataForAnalysis")}</button>
      <span class="btng">
        <button class="b" data-a="autotoggle" title="${L("listings.clickToTurnTheAutomation")}"></button>
        <button class="b" data-a="autopanel" title="${L("listings.automationSettingsHowOftenUndercut")}">\u2699</button>
      </span>
      <button class="b" data-a="stop" hidden>\u25A0 Stop</button>
    </div>
    <div id="l-pricepanel" hidden class="note" style="padding:12px 14px">
      <div style="display:grid;grid-template-columns:max-content max-content 1fr;gap:8px 14px;align-items:center">
        <b>${L("listings.timeToSell")}</b>
        <select id="l-wait">${[1, 2, 4, 7].map((d) => `<option value="${d}" ${waitDays() === d ? "selected" : ""}>${daysTxt(d)}</option>`).join("")}</select>
        <span class="sub">${L("listings.theSuggestedPriceListFor")}</span>
        <b>${L("listings.skipListingsBelowTheNormal")}</b>
        <label class="tgl"><input type="checkbox" id="l-ign" ${(settings.ignoreBelow ?? 2) > 1 ? "checked" : ""}><span class="tr"></span></label>
        <span class="sub">${L("listings.iDontGoDownTo")}</span>
        <b>${L("listings.refreshEvery")}</b>
        <span><input type="number" id="l-refmin" min="1" max="60" value="${refreshMin()}" style="width:60px"> min</span>
        <span class="sub">${L("listings.whileThePanelIsOpen2")}</span>
      </div>
    </div>
    <div id="l-bulk" class="bar" hidden style="position:static;background:rgba(102,192,244,.06)">
      <span id="l-bulkn"></span>
      <button class="b" data-a="bulkset">${L("listings.setSuggestedPrices")}</button>
      <button class="b red" data-a="remove">${L("listings.remove")}</button>
      <button class="b" data-a="selnone">${L("listings.deselect")}</button>
    </div>
    <table><thead><tr>
      <th style="width:1%"><input type="checkbox" id="l-all" title="${L("listings.selectAll")}"></th>
      <th data-sort="name">${L("listings.item")}</th><th data-sort="buyer">${L("listings.yourPrice2")}</th><th data-sort="comp">${L("listings.market")}</th><th>${L("listings.suggestedPrice")}</th><th></th>
    </tr></thead><tbody></tbody></table>`;
    root2.addEventListener("click", (e) => {
      const th = e.target.closest("th[data-sort]");
      if (th) {
        sort2.click(th.dataset.sort);
        render3();
        return;
      }
      const fl = e.target.closest("[data-fl]");
      if (fl) {
        const r2 = rows.find((x) => x.listingid === fl.dataset.fl);
        if (r2?.item?.float != null) floatCheck({ ...r2.item, hash: r2.hash, name: r2.name, appid: r2.appid });
        return;
      }
      const btn = e.target.closest("button");
      const a = btn?.dataset.a;
      if (!a) return;
      const r = btn.dataset.id ? rows.find((x) => x.listingid === btn.dataset.id) : null;
      ({
        plandel: () => {
          sellPlans2.del(btn.dataset.hash);
          log(L("listings.salePlanRemoved", { hash: btn.dataset.hash }));
          render3();
        },
        planedit: () => {
          show("inv");
          focusItem(btn.dataset.hash, { appid: +btn.dataset.app || 730 });
        },
        reload: () => {
          lastComp = 0;
          refresh();
        },
        stop: () => {
          task3?.cancel();
          cancelResearch();
        },
        research: () => exportResearch([...rows, ...pend].map((x) => ({ hash: x.hash, appid: x.appid })), L("listings.youListedOnTheMarket"), { onBusy: (b) => el3.querySelector('[data-a="stop"]').hidden = !b }),
        autopanel: autoDialog,
        autotoggle: () => setAuto(!settings.autoRelist),
        pricepanel: () => {
          const p = el3.querySelector("#l-pricepanel");
          p.hidden = !p.hidden;
        },
        set: () => r && relistOne(r, suggest(r).price),
        setown: () => r && relistOne(r, r.newBuyer),
        rm: () => r && removeOne(r),
        cfg: () => {
          if (r) {
            openCfg = openCfg === r.listingid ? null : r.listingid;
            render3();
          }
        },
        bulkset: bulkSet,
        remove: doRemove,
        selnone: () => {
          rows.forEach((x) => x.checked = false);
          render3();
        }
      })[a]?.();
    });
    root2.querySelector("#l-all").onchange = (e) => {
      rows.forEach((r) => r.checked = e.target.checked);
      render3();
    };
    priceSum = () => {
      const n = settings.ignoreBelow ?? 2, d = waitDays();
      el3.querySelector("#l-pricesum").textContent = `${L("listings.sellWithin", { d: daysTxt(d) })}${n > 1 ? L("listings.skippingUnderpriced") : ""} \xB7 ${L("listings.refreshEveryMin", { refreshMin: refreshMin() })}`;
    };
    priceSum();
    autoBtn();
    root2.querySelector("#l-wait").onchange = (e) => {
      settings.maxWaitDays = +e.target.value || 2;
      priceSum();
      render3();
    };
    root2.querySelector("#l-ign").onchange = (e) => {
      settings.ignoreBelow = e.target.checked ? 2 : 1;
      priceSum();
      lastComp = 0;
      refresh();
    };
    root2.querySelector("#l-refmin").onchange = (e) => {
      settings.listRefreshMin = Math.min(60, Math.max(1, Math.round(+e.target.value) || 2));
      e.target.value = settings.listRefreshMin;
      priceSum();
      tick();
    };
    root2.querySelector("tbody").addEventListener("focusout", () => setTimeout(() => {
      if (pendingRender) render3();
    }, 0));
    setInterval(() => {
      if (!(isOpen() && el3.closest(".tab")?.classList.contains("on") && el3.offsetParent)) return;
      if (!busy() && !document.hidden && Date.now() >= nextAt()) refresh();
      tick();
    }, 1e3);
    root2.querySelector("tbody").addEventListener("change", onInput);
    load2().then((fresh3) => {
      if (fresh3 && rows.length) render3();
    });
    refresh();
  }
  var show4 = () => {
  };
  function setAuto(on) {
    settings.autoRelist = on;
    log(on ? L("listings.automationOn") : L("listings.automationOff"), "ok");
    auto.reschedule();
    updateAuto();
    render3();
  }
  function autoBtn() {
    const b = el3?.querySelector('[data-a="autotoggle"]');
    if (!b) return;
    const on = !!settings.autoRelist;
    b.classList.toggle("on", on);
    b.innerHTML = `<i class="adot"></i>${L("listings.auto")}: <b>${on ? L("listings.on") : L("listings.off")}</b>`;
  }
  function autoDialog() {
    ask(L("listings.automation"), `
    <div class="row2" style="padding:0 0 6px">
      <label>${L("listings.everyMinutes")}<input type="number" min="2" id="l-every" value="${settings.autoRelistEvery}" style="width:70px"></label>
      <label title="${L("listings.howMuchCheaperThanThe")}">${L("listings.undercutByZ")}<input class="p" id="l-under" value="${toInput(settings.undercut)}" style="width:70px"></label>
    </div>
    <div style="display:flex;gap:8px;align-items:center;margin-top:12px"><button class="b" id="l-autonow">${L("listings.checkNow")}</button><span class="sub" id="l-autoinfo"></span></div>
    <div class="sub" style="margin-top:12px;line-height:1.5">${L("listings.youTurnTheAutomationOn")}</div>`, {
      ok: L("listings.close"),
      cancel: null,
      onOpen: (m) => {
        m.querySelector("#l-every").onchange = (e) => {
          settings.autoRelistEvery = Math.max(2, +e.target.value || 10);
          e.target.value = settings.autoRelistEvery;
          auto.reschedule();
          updateAuto();
        };
        m.querySelector("#l-under").onchange = (e) => {
          const v = parsePrice(e.target.value);
          settings.undercut = isNaN(v) ? 1 : v;
          e.target.value = toInput(settings.undercut);
          priceSum();
          render3();
        };
        m.querySelector("#l-autonow").onclick = () => {
          auto.runNow();
          log(L("listings.automationCheckingNow"));
        };
        updateAuto();
      }
    });
  }
  var openCfg = null;
  function onInput(e) {
    const tr = e.target.closest("tr[data-id]");
    if (!tr) return;
    const r = rows.find((x) => x.listingid === tr.dataset.id);
    const f = e.target.dataset.f;
    if (f === "chk") {
      r.checked = e.target.checked;
      render3();
      return;
    }
    if (f === "auto") {
      rules.patch(r.hash, { auto: e.target.checked });
      r.rule = rules.get(r.hash);
      render3();
      return;
    }
    const v = e.target.value.trim() === "" ? null : parsePrice(e.target.value);
    if (v != null && isNaN(v)) {
      e.target.value = "";
      return;
    }
    if (f === "new") {
      r.newBuyer = v;
      rules.patch(r.hash, { target: v });
    }
    if (f === "min") rules.patch(r.hash, { min: v });
    if (f === "max") rules.patch(r.hash, { max: v });
    rows.filter((x) => x.hash === r.hash).forEach((x) => x.rule = rules.get(r.hash));
    render3();
  }
  var NEAR_INSTANT = (r) => L("listings.youdGetAlmostTheSame", { highestBuy: fmt(r.h.highestBuy) });
  var PLAIN_COPY = () => L("listings.pricedLikeAPlainCopy");
  var fmtWait2 = (d) => d < 1 / 24 ? L("listings.lessThanAnHour") : d < 1 ? L("listings.aboutH", { d: Math.round(d * 24) }) : L("listings.aboutDays", { d: dec(d, 1) });
  var aheadTxt = (n) => L("listings.cheaperListings", { count: n });
  function othersGraph(r) {
    if (!pass) return graphWithout(r.h.sellGraph, myPriceMap(r.hash));
    if (!pass.others.has(r.hash)) pass.others.set(r.hash, graphWithout(r.h.sellGraph, myPriceMap(r.hash)));
    return pass.others.get(r.hash);
  }
  function graphWithout(sellGraph, mine = {}) {
    const left = { ...mine };
    let cum = 0;
    const others = [];
    for (const l of levels(sellGraph)) {
      const own = Math.min(left[l.price] || 0, l.qty);
      left[l.price] = (left[l.price] || 0) - own;
      if (l.qty - own > 0) others.push([l.price, cum += l.qty - own]);
    }
    return others;
  }
  function suggest(r) {
    if (!pass) return suggestNow(r);
    const k = [r.appid, r.hash, r.pub, r.comp, r.item?.float != null || r.item?.stickers?.length ? 1 : 0].join("|");
    if (!pass.sug.has(k)) pass.sug.set(k, suggestNow(r));
    return pass.sug.get(k);
  }
  function suggestNow(r) {
    const rule = r.rule || {};
    const typ = typical(r.hash);
    const unique = r.item?.float != null || r.item?.stickers?.length;
    let price = null, why = "", warn = "";
    const snap = (p, up) => achievable(p, r.pub, up);
    const real = (p) => {
      if (p == null) return p;
      const v = snap(p, false);
      return rule.min != null && v < rule.min ? snap(rule.min, true) : v;
    };
    const table = fill(r.hash);
    if (table && r.h) {
      const others = othersGraph(r);
      const fa = listAdviceFill({ table, sellGraph: others.length ? others : r.h.sellGraph, highestBuy: r.h.highestBuy, net: (p) => receivedFromBuyer2(p, r.pub), maxWaitDays: settings.maxWaitDays ?? 2, undercut: settings.undercut });
      if (fa) {
        price = real(rule.max != null ? Math.min(fa.price, rule.max) : fa.price);
        const days = daysTxt(fa.horizon);
        why = fa.instantBest ? L("listings.sellRightAwayToThe", { price: fmt(fa.price) }) : L("listings.chanceToSellWithinFrom", { days, chance: Math.round(fa.chance * 100) });
        if (fa.lowChance) warn = L("listings.evenAtALowerPrice");
        if (fa.falling) warn = (warn ? warn + "; " : "") + L("listings.afterAFewDaysThe");
        if (rule.max != null && fa.price > rule.max) warn = (warn ? warn + "; " : "") + L("listings.limitedByYourMaximum");
        if (r.h.highestBuy && receivedFromBuyer2(price, r.pub) <= receivedFromBuyer2(r.h.highestBuy + 1, r.pub)) warn = (warn ? warn + "; " : "") + NEAR_INSTANT(r);
        if (unique) warn = (warn ? warn + "; " : "") + PLAIN_COPY();
        return { price, why, warn, typ };
      }
    }
    const perDay = (typ?.sold7 ? typ.sold7 / 7 : cached2(r.appid, r.hash)?.volume || 0) * LIST_SHARE || null;
    const falling = typ?.d7 && typ?.d30 && typ.d7 < typ.d30 * 0.9;
    const maxWait = (settings.maxWaitDays ?? 2) * (falling ? 0.5 : 1);
    const typical2 = typ?.d7 ?? typ?.d30;
    const caps = [typical2 ? Math.round(typical2 * 1.25) : null, recentMedian(r.hash)].filter((x) => x > 0);
    const opt = r.h && perDay ? optimalSellPrice({ sellGraph: r.h.sellGraph, mine: myPriceMap(r.hash), perDay, maxWaitDays: maxWait, undercut: settings.undercut, cap: caps.length ? Math.min(...caps) : null, rule }) : null;
    if (opt) {
      price = real(opt.price);
      const sold = soldAt(r.hash, price);
      const rare = sold && sold.total >= 3 && sold.n * 2 < sold.total;
      const rate = perDay >= 1 ? `~${Math.round(perDay)}` : `~${dec(perDay, 1)}`;
      why = rare ? L("listings.inDaysOnlyOfUnits", { days: sold.days, n: sold.n, total: sold.total, ahead: opt.ahead ? L("listings.aheadOfYou", { ahead: aheadTxt(opt.ahead) }) : "" }) : L("listings.sellsIn", { waitDays: fmtWait2(opt.waitDays), ahead: opt.ahead ? L("listings.aheadOfYouListingsGo", { ahead: aheadTxt(opt.ahead), rate }) : "" });
      if (r.comp != null && price > r.comp) why += ` \xB7 ${L("listings.moreThanTheCheapestListing", { price: fmt(price - r.comp) })}`;
      if (falling) warn = L("listings.thePriceIsFallingI");
      if (opt.belowMin) warn = (warn ? warn + "; " : "") + L("listings.yourMinimumIsAboveThe");
      if (r.h.highestBuy && receivedFromBuyer2(price) <= receivedFromBuyer2(r.h.highestBuy + 1)) warn = (warn ? warn + "; " : "") + NEAR_INSTANT(r);
      if (unique) warn = (warn ? warn + "; " : "") + PLAIN_COPY();
      return { price, why, warn, typ };
    }
    if (r.comp != null) {
      const t = relistTarget({ current: -1, competitor: r.comp, rule: { ...rule, undercut: settings.undercut, raise: true }, snap });
      price = t.price;
      const raw = r.comp - settings.undercut;
      why = rule.min != null && raw < rule.min ? L("listings.yourMinimum") : rule.max != null && raw > rule.max ? L("listings.yourMaximum") : L("listings.cheaperThanTheCheapestCompetitor", { comp: fmt(r.comp - price) }) + (r.comp - price > settings.undercut ? L("listings.steamDoesntAllowACloser") : "");
      if (typ?.d7 && r.comp < typ.d7 * 0.85) warn = L("listings.theCompetitionIsBelowThe", { comp: Math.round((1 - r.comp / typ.d7) * 100) });
    } else if (typ?.d7) {
      price = real(rule.max ?? Math.round(typ.d7));
      why = rule.max != null ? L("listings.nobodyElseSellsYourMaximum") : L("listings.nobodyElseSellsTheAverage");
    }
    if (unique && price != null) warn = (warn ? warn + "; " : "") + L("listings.youHaveAUniqueCopy");
    return { price, why, warn, typ };
  }
  function floatSub(r) {
    const it = { float: r.item.float, hash: r.hash };
    const k = floatRankOf(it);
    const title = k ? L("listings.onlyOfCopiesInHave", { lower: shareTxt(k.lower), wear: k.wear }) : L("listings.clickToCompareTheFloat");
    return `<span data-fl="${esc(r.listingid)}" title="${esc(title)}" style="cursor:pointer;border-bottom:1px dotted currentColor;${k && k.lower <= 0.05 ? "color:#e5b84c" : ""}">float ${r.item.float.toFixed(4)}</span>${floatMarks(it, k)}${r.item.seed != null ? ` \xB7 seed ${r.item.seed} ${patternChip(patternFor(r.hash, r.item.seed))}` : ""}`;
  }
  function evalListing(r, s = null) {
    const t = fill(r.hash);
    if (!t) return null;
    const N = waitDays();
    const c = sellChance(t, N, r.buyer, r.h ? othersGraph(r) : null);
    if (c == null) return null;
    const days = daysTxt(N);
    if (c < 0.25) return { c, days, k: "high", label: L("listings.tooPricey"), cls: "err" };
    if (c < 0.5) return { c, days, k: "pricey", label: L("listings.pricey"), cls: "warn" };
    if (s?.price != null && s.price > r.buyer && c >= 0.9) return { c, days, k: "cheap", label: L("listings.cheapYouCanAskMore"), cls: "warn" };
    return { c, days, k: "ok", label: L("listings.fine"), cls: "ok" };
  }
  function chip(r) {
    if (r.comp == null) return r.lowest != null ? `<span class="chipst mut">${L("listings.nobodyElseSells")}</span>` : compRunning ? `<span class="chipst mut">${L("listings.checking")}</span>` : '<span class="chipst mut">-</span>';
    if (r.comp > r.buyer) return `<span class="chipst ok">${L("listings.cheapest")}</span>`;
    if (r.comp === r.buyer) return `<span class="chipst mid">${L("listings.tie")}</span>`;
    return `<span class="chipst bad">${L("listings.someoneIsCheaper", { buyer: fmt(r.buyer - r.comp) })}</span>`;
  }
  var drawTimer = 0;
  var sumNext = null;
  function flushDraw() {
    clearTimeout(drawTimer);
    drawTimer = 0;
    const s = sumNext;
    sumNext = null;
    inPass(() => {
      render3();
      if (s) summary(s.running);
    });
  }
  function renderSoon(sum = null) {
    if (sum) sumNext = sum;
    if (!drawTimer) drawTimer = setTimeout(flushDraw, 400);
  }
  function render3() {
    inPass(drawTable);
  }
  function drawTable() {
    if (!el3) return;
    const tb = el3.querySelector("tbody");
    const cnt = document.querySelector('#stt [data-mt="sell"] .cnt');
    const plans = planList();
    if (cnt) cnt.textContent = `(${rows.length}${pend.length ? ` + ${pend.length}\u23F3` : ""}${plans.length ? ` + ${plans.length}\u23F0` : ""})`;
    const a = document.activeElement;
    if (a && tb.contains(a) && a.tagName === "INPUT" && a.type !== "checkbox") {
      pendingRender = true;
      return;
    }
    pendingRender = false;
    const sel2 = rows.filter((r) => r.checked);
    el3.querySelector("#l-bulk").hidden = !sel2.length;
    el3.querySelector("#l-bulkn").textContent = L("listings.selected", { sel: sel2.length });
    if (!rows.length && !pend.length && !plans.length) {
      clearRows(tb);
      tb.innerHTML = L("listings.youHaveNothingListedYou");
      return;
    }
    const sorted = sort2.apply([...rows, ...pend], { name: (r) => r.name, buyer: (r) => r.buyer, comp: (r) => r.comp == null ? null : r.comp - r.buyer });
    const rowHtml = (r) => {
      if (r.pending) return pendingRow(r);
      const rule = r.rule || {};
      const s = suggest(r);
      const sub = [wearShort(r.hash), r.item?.float != null ? floatSub(r) : "", r.item?.nameTag ? `\u{1F3F7} \u201E${esc(r.item.nameTag)}\u201D` : "", L("listings.listed", { created: timeAgo(r.created) }), r.amount > 1 ? `${r.amount} ${L("listings.pcs")}` : ""].filter(Boolean).join(" \xB7 ");
      const same = s.price != null && s.price === r.buyer;
      const autoOff = !settings.autoRelist;
      const autoTag = rule.auto ? `<span class="chipst ${autoOff ? "mut" : rule.min != null ? "ok" : "mid"}" title="${rule.min == null ? L("listings.theAutomationShouldWatchThis") : autoOff ? L("listings.theAutomationShouldWatchThis2", { min: fmt(rule.min) }) : L("listings.theAutomationWatchesThePrice", { min: fmt(rule.min) })}">auto${autoOff ? L("listings.off2") : ""}</span>` : "";
      const main2 = `<tr data-id="${r.listingid}">
      <td><input type="checkbox" data-f="chk" ${r.checked ? "checked" : ""}></td>
      <td>${itemCell({ ...r, sub })}</td>
      <td><b>${fmt(r.buyer)}</b><div class="sub">${L("listings.youGet")} ${fmt(r.recv)}</div>${(() => {
        const e = evalListing(r, s);
        return e ? `<div class="sub ${e.cls}" title="${L("listings.theChanceThatSomeonePays", { days: e.days })}">${L("listings.chanceWithin2")} ${e.days}: ${Math.round(e.c * 100)}% \xB7 ${e.label}</div>` : "";
      })()}</td>
      <td>${chip(r)} ${autoTag}<div class="sub" style="margin-top:3px">${r.comp != null ? `${L("listings.cheapestOther")}: ${fmt(r.comp)}` : ""}${r.stray != null ? ` <span title="${L("listings.theCheaperListingsAreBelow")}">(${L("listings.skippingUnderpricedCheapest")} ${fmt(r.stray)})</span>` : ""}${s.typ?.d7 ? `${r.comp != null ? " \xB7 " : ""}<span title="${esc(L("listings.theAveragePriceThisItem", { d7: fmt(Math.round(s.typ.d7)), sold7: s.typ.sold7, d30: s.typ.d30 ? L("listings.last30Days", { d30: fmt(Math.round(s.typ.d30)) }) : "" }))}">${L("listings.sellsAt")} ~${fmt(Math.round(s.typ.d7))}</span>` : ""} \xB7 <a class="acc" target="_blank" href="${esc(marketUrl(r.appid, r.hash))}">${L("listings.market2")} \u2197</a></div></td>
      <td>${s.price != null ? `<b>${fmt(s.price)}</b><div class="sub" title="${esc(s.why)}">${L("listings.youGet")} ${fmt(receivedFromBuyer2(s.price, r.pub))} \xB7 ${esc(s.why)}</div>${s.warn ? `<div class="sub warn">${esc(s.warn)}</div>` : ""}` : L("listings.waitingForMarketData")}${r.status ? `<div class="sub ${r.cls || ""}">${esc(r.status)}</div>` : ""}</td>
      <td style="white-space:nowrap"><div class="acts" style="flex-wrap:nowrap;align-items:center">
        ${s.price != null && !same ? `<button class="b ${s.price < r.buyer ? "" : "go"}" data-a="set" data-id="${r.listingid}" title="${L("listings.removesTheListingAndLists", { price: fmt(s.price) })}">${L("listings.set")} ${fmt(s.price)}</button>` : same ? `<span class="sub ok" style="white-space:nowrap">${L("listings.priceOk")}</span>` : ""}
        <button class="b red" data-a="rm" data-id="${r.listingid}" title="${L("listings.removeFromTheMarketIt")}">${L("listings.remove")}</button>
        <button class="b ${openCfg === r.listingid ? "on" : ""}" data-a="cfg" data-id="${r.listingid}" title="${L("listings.yourOwnPriceMinimumMaximum")}">\u2699</button>
      </div></td></tr>`;
      if (openCfg !== r.listingid) return main2;
      return main2 + `<tr class="cfg" data-id="${r.listingid}"><td></td><td colspan="5"><div class="cfgbox">
      <div>
        <div class="lb">${L("listings.changeThePriceNow")}</div>
        <div class="line">
          <span>${L("listings.price")}</span><span class="inp"><input class="p" data-f="new" value="${toInput(r.newBuyer)}" placeholder="${L("listings.eG150")}"><span>z\u0142</span></span>
          <button class="b go" data-a="setown" data-id="${r.listingid}" ${r.newBuyer == null ? "disabled" : ""}>${L("listings.listAtThisPrice")}</button>
        </div>
        <div class="sub">${L("listings.oneOffIRemoveThe")}</div>
      </div>
      <div>
        <div class="lb">${L("listings.priceLimits")}</div>
        <div class="line">
          <span>${L("listings.priceFrom")}</span><span class="inp" title="${L("listings.theLowestPriceTheSuggested")}"><input class="p" data-f="min" value="${toInput(rule.min)}" placeholder="${L("listings.none")}"><span>z\u0142</span></span>
          <span>${L("listings.to")}</span><span class="inp" title="${L("listings.theHighestPriceTheAutomation")}"><input class="p" data-f="max" value="${toInput(rule.max)}" placeholder="${L("listings.none")}"><span>z\u0142</span></span>
        </div>
        <div class="sub">${L("listings.theSuggestedPriceAndThe")}</div>
        <label class="tgl" style="margin-top:8px;padding-left:0"><input type="checkbox" data-f="auto" ${rule.auto ? "checked" : ""}><span class="tr"></span>${L("listings.automationWatchesThisListing")}</label>
        <div class="sub">${L("listings.everyFewMinutesItUndercuts")}${settings.autoRelist ? "" : `. <span class="warn">${L("listings.theAutomationIsOffNow")}</span>`}</div>
        ${rule.auto && rule.min == null ? `<div class="warn sub">${L("listings.enterTheLowestPricePrice")}</div>` : ""}
      </div>
    </div></td></tr>`;
    };
    const seen = /* @__PURE__ */ new Map();
    const once2 = (k) => {
      const n = seen.get(k) || 0;
      seen.set(k, n + 1);
      return n ? `${k}#${n}` : k;
    };
    const blocks = sorted.map((r) => ({ key: once2(r.pending ? `p|${r.hash}|${r.recv}` : r.listingid), html: rowHtml(r) }));
    if (plans.length) {
      blocks.push({ key: "plans", html: `<tr><td colspan="6" class="sub" style="padding:10px 8px 4px;font-weight:600">${L("listings.plannedListedWhenTheTrade")}</td></tr>` });
      for (const p of plans) blocks.push({ key: once2(`plan|${p.hash}`), html: planRow(p) });
    }
    patchRows(tb, blocks);
    el3.querySelector('th[data-sort="name"]').textContent = L("listings.item") + sort2.arrow("name");
  }
  function setBusy(b) {
    el3.querySelectorAll(".bar button").forEach((x) => x.disabled = b && x.dataset.a !== "stop");
    el3.querySelector('[data-a="stop"]').hidden = !b;
  }
  var setStatus = (listing, text, cls2 = "") => {
    const r = rows.find((x) => x.listingid === listing.listingid);
    if (r) {
      r.status = text;
      r.cls = cls2;
      render3();
    }
  };
  async function relistOne(r, price) {
    if (price == null) return;
    const recv = receivedFromBuyer2(price, r.pub);
    const drop = price < r.buyer * 0.7 ? `<br><span class="err">${L("listings.thatsLessThanNow", { price: Math.round((1 - price / r.buyer) * 100) })}</span>` : "";
    if (!await ask(L("listings.changeThePrice"), `${esc(r.name)}<br>${fmt(r.buyer)} \u2192 <b>${fmt(price)}</b> (${L("listings.youGet")} ${fmt(recv)})${drop}<br><span class="sub">${L("listings.theListingIsRemovedAnd")}</span>`, { ok: L("listings.changePrice") })) return;
    task3 = token();
    setBusy(true);
    await withLock("relist", async () => {
      const res = await relist([{ listing: r, price }], { onStatus: setStatus, log, isCancelled: () => task3.cancelled });
      rememberWaiting(res);
      log(res.ok ? L("listings.newPrice", { name: r.name, price: fmt(price), confirm: res.confirm ? L("listings.confirmInTheSteamApp") : "" }) : L("listings.couldntChangeThePrice", { name: r.name }), res.ok ? "ok" : "err");
    }).catch((e) => log(L("listings.priceChangeStoppedCheckThe", { message: e.message }), "err"));
    setBusy(false);
    setTimeout(refresh, 1500);
  }
  async function removeOne(r) {
    if (!await ask(L("listings.removeFromTheMarket"), `${esc(r.name)} ${L("listings.for")} ${fmt(r.buyer)}<br>${L("listings.theItemGoesBackTo")}`, { ok: L("listings.remove"), danger: true })) return;
    const res = await removeListing(r.listingid);
    setStatus(r, res.ok ? L("listings.removed") : L("listings.httpError", { status: res.status }), res.ok ? "ok" : "err");
    setTimeout(refresh, 1e3);
  }
  async function bulkSet() {
    const sel2 = rows.filter((r) => r.checked);
    const jobs = sel2.map((r) => ({ listing: r, price: suggest(r).price })).filter((j) => j.price != null && j.price !== j.listing.buyer);
    if (!jobs.length) return log(L("listings.theSelectedListingsAlreadyHave"), "warn");
    if (!await ask(L("listings.changeThePrices"), `${jobs.map((j) => `${esc(j.listing.name)}: ${fmt(j.listing.buyer)} \u2192 <b>${fmt(j.price)}</b>`).slice(0, 12).join("<br>")}${jobs.length > 12 ? `<br>\u2026 ${L("listings.andMore", { jobs: jobs.length - 12 })}` : ""}`, { ok: L("listings.change", { jobs: jobs.length }) })) return;
    task3 = token();
    setBusy(true);
    await withLock("relist", async () => {
      const res = await relist(jobs, { onStatus: setStatus, log, isCancelled: () => task3.cancelled });
      rememberWaiting(res);
      log(L("listings.priceChangeOkErrors", { ok: res.ok, failed: res.failed }), res.failed ? "warn" : "ok");
      if (res.confirm) log(L("listings.listingsWaitForConfirmationIn", { confirm: res.confirm }), "warn");
    }).catch((e) => log("Przerwano: " + e.message, "err"));
    setBusy(false);
    setTimeout(refresh, 1500);
  }
  async function refresh() {
    refreshing = true;
    lastTry = Date.now();
    tick();
    try {
      await load4();
    } finally {
      refreshing = false;
      tick();
    }
  }
  async function load4() {
    if (!await ensureLogin()) {
      log(L("listings.noLoggedInSteamSession"), "err");
      return;
    }
    try {
      const { listings, toConfirm, pending, pendingKnown } = await myListings();
      pend = pendingRows(listings, pending || [], pendingKnown, toConfirm);
      const prev = new Map(rows.map((r) => [r.listingid, r]));
      const myPrices = (list2) => {
        const m = /* @__PURE__ */ new Map();
        for (const x of list2) (m.get(x.hash) || m.set(x.hash, []).get(x.hash)).push(x.buyer);
        for (const [k, a] of m) m.set(k, a.sort((x, y) => x - y).join());
        return m;
      };
      const was = myPrices(rows), now = myPrices(listings), market = /* @__PURE__ */ new Map();
      for (const r of rows) if (r.h && !market.has(r.hash) && was.get(r.hash) === now.get(r.hash)) market.set(r.hash, r);
      rows = listings.map((l) => {
        const p = prev.get(l.listingid), m = market.get(l.hash);
        return { ...l, rule: rules.get(l.hash) || {}, comp: m ? m.comp : p?.comp ?? null, stray: m?.stray ?? null, h: m?.h, lowest: m?.lowest ?? cached2(l.appid, l.hash)?.lowest ?? null, newBuyer: p?.newBuyer ?? null, checked: p?.checked || false, status: p?.status || "", cls: p?.cls };
      });
      el3.querySelector("#l-note").innerHTML = toConfirm ? `<span class="warn" title="${L("listings.inTheSteamAppOpen")}">${toConfirm} ${L("listings.listingsWaitForConfirmationIn2")}</span>` : "";
      if (!lastComp) log(L("listings.loadedSellListings", { rows: rows.length }));
      render3();
      autoComp();
      if (rows.some((x) => x.item?.float != null)) ensureFloatDb().then(() => renderSoon());
      ensure3([...rows, ...planList()].map((r) => ({ hash: r.hash, appid: r.appid })), { onEach: () => renderSoon() });
      checkPlans();
    } catch (e) {
      log(L("listings.errorLoadingListings") + e.message, "err");
    }
  }
  var compTask = null;
  var compRunning = false;
  var lastComp = 0;
  var pendingRender = false;
  var refreshing = false;
  var lastTry = 0;
  var refreshMin = () => Math.min(60, Math.max(1, settings.listRefreshMin ?? 2));
  var busy = () => refreshing || compRunning;
  var nextAt = () => Math.max(lastComp, lastTry) + refreshMin() * 6e4;
  var clock = (t) => new Date(t).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });
  function tick() {
    const box2 = el3?.querySelector("#l-tick");
    if (!box2) return;
    if (busy()) {
      box2.innerHTML = L("listings.refreshing");
      return;
    }
    const last = Math.max(lastComp, lastTry);
    if (!last) {
      box2.textContent = "";
      return;
    }
    const left = Math.max(0, Math.ceil((nextAt() - Date.now()) / 1e3));
    box2.textContent = L("listings.refreshedNextIn", { last: clock(last), left: Math.floor(left / 60), left2: String(left % 60).padStart(2, "0") });
  }
  async function autoComp() {
    if (!rows.length || compRunning) return;
    compRunning = true;
    const tk = compTask = token();
    lastComp = Date.now();
    summary(true);
    await competitionFor(rows, tk, { quiet: true });
    compRunning = false;
    lastComp = Date.now();
    summary();
    tick();
  }
  function summary(running3 = false) {
    const box2 = el3?.querySelector("#l-comp");
    if (!box2) return;
    const checked = rows.filter((r) => r.comp != null || r.lowest != null);
    const beaten = rows.filter((r) => r.comp != null && r.comp < r.buyer);
    const tied = rows.filter((r) => r.comp != null && r.comp === r.buyer);
    const parts = [];
    if (beaten.length) parts.push(`<b class="err">${beaten.length} ${beaten.length === 1 ? L("listings.listingUndercut") : L("listings.listingsUndercut")}</b>`);
    if (tied.length) parts.push(`<span class="warn">${tied.length} ${L("listings.tied")}</span>`);
    const evals = inPass(() => rows.map((r) => evalListing(r, suggest(r))).filter(Boolean));
    const high = evals.filter((e) => e.k === "high").length, cheap = evals.filter((e) => e.k === "cheap").length;
    if (high) parts.push(`<span class="err" title="${L("listings.atTheCurrentPriceThe")}">${high} ${L("listings.tooPriceyByTheHistory")}</span>`);
    if (cheap) parts.push(`<span class="warn" title="${L("listings.theyWillSellAlmostSurely")}">${cheap} ${L("listings.tooCheap")}</span>`);
    if (checked.length && !beaten.length && !tied.length && !running3) parts.push(`<span class="ok">${L("listings.allYourListingsAreThe")}</span>`);
    box2.innerHTML = parts.join(" \xB7 ");
    status("undercut", beaten.length ? `<b class="err">${L("listings.undercutListings")}: ${beaten.length}</b>` : null);
  }
  async function competitionFor(list2, tk, { quiet = false } = {}) {
    const uniq = [...new Map(list2.map((r) => [r.appid + "|" + r.hash, r])).values()].sort((a, b) => (a.h?.at || 0) - (b.h?.at || 0));
    const known = /* @__PURE__ */ new Map();
    for (const r of uniq) {
      if (r.appid !== "753") continue;
      const b = r.h || await peekHist(r.appid, r.hash, BOOK_MAX_AGE);
      if (b && Date.now() - b.at < BOOK_MAX_AGE) known.set(r.hash, b);
    }
    const quotes = known.size >= 4 ? await steamItemQuotes([...known.keys()], () => tk?.cancelled) : /* @__PURE__ */ new Map();
    let i = 0;
    for (const r of uniq) {
      if (tk?.cancelled) break;
      if (!quiet) progress(++i, uniq.length);
      try {
        const kept = r.appid === "753" ? known.get(r.hash) : null;
        const h = bookStillGood(kept, quotes.get(r.hash), Date.now(), bookMaxAge(r.hash)) ? kept : await hist(r.appid, r.hash, quiet ? 6e4 : 5e3);
        const comp = competitorSell(h.sellGraph, myPriceMap(r.hash), settings.ignoreBelow ?? 2, skipChooser(r.hash, (p) => receivedFromBuyer2(p, r.pub)));
        const raw = competitorSell(h.sellGraph, myPriceMap(r.hash));
        rows.filter((x) => x.hash === r.hash).forEach((x) => {
          if (quiet && comp != null && comp < x.buyer && !(x.comp != null && x.comp < x.buyer)) {
            log(L("listings.someoneUndercutYouYours", { hash: x.hash, comp: fmt(comp), buyer: fmt(x.buyer) }), "warn");
          }
          x.comp = comp;
          x.stray = raw != null && comp != null && raw < comp ? raw : null;
          x.lowest = h.lowestSell;
          x.h = h;
        });
        renderSoon({ running: quiet });
      } catch (e) {
        log(`${r.hash}: ${e.message}`, "err");
        if (e.status === 429) break;
      }
    }
    if (drawTimer) flushDraw();
    if (!quiet) progress(0);
  }
  async function doRemove() {
    const sel2 = rows.filter((r) => r.checked);
    if (!sel2.length) return log(L("listings.selectSomeListings"), "warn");
    if (!await ask(L("listings.removeTheListings"), L("listings.removeListingsFromTheMarket", { sel: sel2.length }), { ok: L("listings.remove"), danger: true })) return;
    task3 = token();
    setBusy(true);
    await withLock("remove", async () => {
      for (const r of sel2) {
        if (task3.cancelled) break;
        const res = await removeListing(r.listingid);
        setStatus(r, res.ok ? L("listings.removed") : L("listings.httpError", { status: res.status }), res.ok ? "ok" : "err");
      }
    });
    setBusy(false);
    setTimeout(refresh, 1e3);
  }
  async function autoCycle() {
    if (!await ensureLogin()) return;
    await withLock("auto-relist", async () => {
      const { listings } = await myListings();
      const ruled = listings.filter((l) => {
        const r = rules.get(l.hash);
        return r?.auto && r.min != null;
      });
      if (!ruled.length) {
        lastAuto = { at: Date.now(), msg: L("listings.noListingsWithAutoMin") };
        return;
      }
      const mine = {};
      for (const l of listings) (mine[l.hash] ||= {})[l.buyer] = (mine[l.hash][l.buyer] || 0) + 1;
      const jobs = [];
      for (const l of ruled) {
        try {
          const h = await hist(l.appid, l.hash, 3e4);
          const comp = competitorSell(h.sellGraph, mine[l.hash], settings.ignoreBelow ?? 2, skipChooser(l.hash, (p) => receivedFromBuyer2(p, l.pub)));
          const rule = { ...rules.get(l.hash), undercut: settings.undercut, raise: true };
          const snap = (p, up) => achievable(p, l.pub, up);
          let t = relistTarget({ current: l.buyer, competitor: comp, rule, snap });
          if (t.price != null && t.price > l.buyer) {
            const cap = raiseCap(l, h, mine[l.hash]);
            if (cap != null && t.price > cap) {
              const p = snap(cap, false);
              t = p > l.buyer ? { price: p, reason: L("listings.raisingToTheSuggestedPrice") } : { price: null, reason: L("listings.itWouldHardlySellHigher") };
            }
          }
          const row = rows.find((x) => x.listingid === l.listingid);
          if (row) {
            row.comp = comp;
            row.lowest = h.lowestSell;
          }
          if (t.price != null) {
            jobs.push({ listing: l, price: t.price });
            log(`[auto] ${l.hash}: ${fmt(l.buyer)} \u2192 ${fmt(t.price)} (${t.reason})`);
          }
        } catch (e) {
          log(`[auto] ${l.hash}: ${e.message}`, "err");
          if (e.status === 429) break;
        }
      }
      if (jobs.length) {
        const r = await relist(jobs, { onStatus: setStatus, log });
        rememberWaiting(r);
        lastAuto = { at: Date.now(), msg: L("listings.changed", { ok: r.ok, jobs: jobs.length, failed: r.failed ? L("listings.errors", { failed: r.failed }) : "" }) };
        log(L("listings.autoRelistOkErrors", { ok: r.ok, failed: r.failed }), r.failed ? "warn" : "ok");
      } else {
        lastAuto = { at: Date.now(), msg: L("listings.checkedNoChanges", { ruled: ruled.length }) };
      }
    });
    if (el3 && isOpen()) refresh();
  }
  function raiseCap(l, h, mine) {
    const net4 = (p) => receivedFromBuyer2(p, l.pub);
    const table = fill(l.hash);
    if (table) {
      const others = graphWithout(h.sellGraph, mine);
      const fa = listAdviceFill({ table, sellGraph: others.length ? others : h.sellGraph, highestBuy: h.highestBuy, net: net4, maxWaitDays: settings.maxWaitDays ?? 2, undercut: settings.undercut });
      if (fa) return fa.price;
    }
    const typ = typical(l.hash);
    const t = typ?.d7 ?? typ?.d30;
    return t ? Math.round(t * 1.25) : null;
  }
  function updateAuto(st) {
    const on = settings.autoRelist;
    const info2 = !on ? L("listings.off3") : !isLeader() ? L("listings.runsInAnotherTab") : st?.running ? L("listings.working") : L("listings.nextInMin", { min: Math.max(0, Math.round((auto.next - Date.now()) / 6e4)) });
    status("autorelist", `Auto-relist: <b class="${on ? "ok" : "mut"}">${info2}</b>${lastAuto ? ` \xB7 ${L("listings.last")} ${timeAgo(lastAuto.at)}: ${esc(lastAuto.msg)}` : ""}`);
    autoBtn();
    const i = document.getElementById("l-autoinfo");
    if (i) i.textContent = info2 + (lastAuto ? ` \xB7 ${L("listings.last")}: ${lastAuto.msg}` : "");
  }
  var auto = every("auto-relist", () => settings.autoRelistEvery, () => settings.autoRelist, autoCycle, updateAuto);

  // src/features/buyorders.js
  var rules2 = bucket("buyRules");
  var net = (p) => receivedFromBuyer2(p);
  var shown2 = (r) => realPrice(r.price, net);
  var rows2 = [];
  var el4;
  var task4 = null;
  var lastAuto2 = null;
  function mount4(root2) {
    el4 = root2;
    root2.innerHTML = `
    <div class="bar">
      <button class="b" data-a="reload" title="${L("buyorders.loadsYourOrdersAndChecks")}">\u27F3 ${L("buyorders.refresh")}</button>
      <button class="b go" data-a="newform">+ ${L("buyorders.newOrder")}</button>
      <span class="sub" id="b-state"></span>
      <span class="sp"></span>
      <button class="b dbg" data-a="research" title="${L("buyorders.downloadsTheOrderBookAnd")}">\u2B07 ${L("buyorders.dataForAnalysis")}</button>
      <button class="b" data-a="autopanel" title="${L("buyorders.automaticOutbiddingInTheBackground")}">\u2699 ${L("buyorders.auto")}: <b id="b-autostate">${settings.autoBuy ? L("buyorders.on") : L("buyorders.off")}</b></button>
      <button class="b" data-a="stop" hidden>\u25A0 Stop</button>
    </div>
    <div id="b-form" hidden style="padding:10px 14px;border-bottom:1px solid #22303f">
      <div class="row2" style="padding:0;align-items:flex-end">
        <label style="position:relative">${L("buyorders.itemTypeItsNameIn")}<input type="search" id="b-q" style="width:340px" placeholder="${L("buyorders.eGRevolutionCaseAk")}">
          <div id="b-sugg" class="sugg" hidden></div></label>
        <label>${L("buyorders.pricePerUnit")}<input class="p" id="b-price"></label>
        <label>${L("buyorders.quantity")}<input type="number" id="b-qty" value="1" min="1" style="width:64px"></label>
        <button class="b go" data-a="create">${L("buyorders.placeOrder")}</button>
      </div>
      <div class="sub" id="b-peek" style="margin-top:6px"></div>
    </div>
    <div id="b-autopanel" hidden class="note" style="padding:10px 14px">
      <div class="row2" style="padding:0 0 6px">
        <label>${L("buyorders.outbidAutomatically")}<input type="checkbox" id="b-auto" ${settings.autoBuy ? "checked" : ""}></label>
        <label>${L("buyorders.everyMinutes")}<input type="number" min="2" id="b-every" value="${settings.autoBuyEvery}" style="width:70px"></label>
        <label>${L("buyorders.lowerWhenImAloneAt")}<input type="checkbox" id="b-lower" ${settings.autoBuyLower ? "checked" : ""}></label>
        <button class="b" data-a="autonow">${L("buyorders.checkNow")}</button>
        <span class="sub" id="b-autoinfo"></span>
      </div>
      ${L("buyorders.theAutomationOutbidsByOne")}
    </div>
    <div id="b-bulk" class="bar" hidden style="position:static;background:rgba(102,192,244,.06)">
      <span id="b-bulkn"></span>
      <button class="b red" data-a="cancel">${L("buyorders.cancelSelected")}</button>
      <button class="b" data-a="selnone">${L("buyorders.deselect")}</button>
    </div>
    <table><thead><tr>
      <th style="width:1%"><input type="checkbox" id="b-all"></th><th>${L("buyorders.item")}</th><th>${L("buyorders.yourOrder")}</th><th>${L("buyorders.market")}</th><th>${L("buyorders.suggestion")}</th><th></th>
    </tr></thead><tbody></tbody></table>`;
    if (!document.getElementById("stt-sugg-css")) {
      const st = document.createElement("style");
      st.id = "stt-sugg-css";
      st.textContent = "#stt .sugg{position:absolute;top:100%;left:0;right:0;z-index:20;background:var(--bg2,#1b2838);border:1px solid #2a475e;border-radius:4px;max-height:320px;overflow:auto;box-shadow:0 6px 18px #0009}#stt .sugg div{display:flex;gap:8px;align-items:center;padding:5px 8px;cursor:pointer;font-size:12px;color:#c6d4df}#stt .sugg div:hover{background:#2a475e}#stt .sugg img{width:40px;height:30px;object-fit:contain}#stt .sugg .p2{margin-left:auto;color:var(--mut)}";
      document.head.appendChild(st);
    }
    root2.addEventListener("click", (e) => {
      const sg = e.target.closest("[data-pick]");
      if (sg) {
        pick(JSON.parse(sg.dataset.pick));
        return;
      }
      const btn = e.target.closest("button");
      const a = btn?.dataset.a;
      if (!a) return;
      const r = btn.dataset.id ? rows2.find((x) => x.id === btn.dataset.id) : null;
      ({
        reload: () => {
          lastCheck = 0;
          refresh2();
        },
        stop: () => {
          task4?.cancel();
          cancelResearch();
        },
        autonow: () => auto2.runNow(),
        research: () => exportResearch(rows2.map((x) => ({ hash: x.hash, appid: x.appid })), L("buyorders.fromYourBuyOrders"), { onBusy: (b) => el4.querySelector('[data-a="stop"]').hidden = !b }),
        newform: () => {
          const f = el4.querySelector("#b-form");
          f.hidden = !f.hidden;
          if (!f.hidden) el4.querySelector("#b-q").focus();
        },
        autopanel: () => {
          const p = el4.querySelector("#b-autopanel");
          p.hidden = !p.hidden;
        },
        bid: () => r && outbidOne(r),
        rm: () => r && cancelOne(r),
        save: () => r && saveEdit(r),
        edit: () => {
          if (r) {
            edit = edit?.id === r.id ? null : { id: r.id, price: toInput(proposal(r)?.price ?? r.price), qty: String(r.remaining) };
            render4();
          }
        },
        cfg: () => {
          if (r) {
            openCfg2 = openCfg2 === r.id ? null : r.id;
            render4();
          }
        },
        cancel: doCancel,
        create: doCreate,
        selnone: () => {
          rows2.forEach((x) => x.checked = false);
          render4();
        }
      })[a]?.();
    });
    root2.querySelector("#b-all").onchange = (e) => {
      rows2.forEach((r) => r.checked = e.target.checked);
      render4();
    };
    root2.querySelector("#b-auto").onchange = (e) => {
      settings.autoBuy = e.target.checked;
      el4.querySelector("#b-autostate").textContent = e.target.checked ? L("buyorders.on") : L("buyorders.off");
      auto2.reschedule();
    };
    root2.querySelector("#b-every").onchange = (e) => {
      settings.autoBuyEvery = Math.max(2, +e.target.value || 10);
      auto2.reschedule();
    };
    root2.querySelector("#b-lower").onchange = (e) => settings.autoBuyLower = e.target.checked;
    let qT = 0;
    root2.querySelector("#b-q").oninput = (e) => {
      picked = null;
      clearTimeout(qT);
      qT = setTimeout(() => findItems(e.target.value), 450);
    };
    root2.querySelector("tbody").addEventListener("focusout", () => setTimeout(() => {
      if (pendingRender2) render4();
    }, 0));
    root2.querySelector("tbody").addEventListener("input", (e) => {
      const f = e.target.dataset.f;
      if (!edit || f !== "np" && f !== "nq") return;
      edit[f === "np" ? "price" : "qty"] = e.target.value;
      const hint = e.target.closest("tr")?.querySelector(".ehint");
      if (hint) hint.innerHTML = editHint(rows2.find((x) => x.id === edit.id));
    });
    root2.querySelector("tbody").addEventListener("keydown", (e) => {
      if (e.key !== "Enter" || !edit || !["np", "nq"].includes(e.target.dataset.f)) return;
      const r = rows2.find((x) => x.id === edit.id);
      if (r) {
        e.preventDefault();
        saveEdit(r);
      }
    });
    setInterval(() => {
      if (isOpen() && !document.hidden && el4.closest(".tab")?.classList.contains("on") && el4.offsetParent && !checking && Date.now() - lastCheck > 2 * 6e4) refresh2();
    }, 15e3);
    root2.querySelector("tbody").addEventListener("change", (e) => {
      const r = rows2.find((x) => x.id === e.target.closest("tr")?.dataset.id);
      if (!r) return;
      const f = e.target.dataset.f;
      if (f === "np" || f === "nq") {
        if (edit?.id === r.id) edit[f === "np" ? "price" : "qty"] = e.target.value;
        return;
      }
      if (f === "chk") r.checked = e.target.checked;
      if (f === "auto") rules2.patch(r.hash, { auto: e.target.checked });
      if (f === "max") {
        const v = parsePrice(e.target.value);
        rules2.patch(r.hash, { max: isNaN(v) ? null : v });
      }
      r.rule = rules2.get(r.hash);
      render4();
    });
    refresh2();
  }
  var show5 = () => {
  };
  var pendingRender2 = false;
  var openCfg2 = null;
  var edit = null;
  var picked = null;
  var realUp = (p) => priceAbove(p - 1, net);
  function editHint(r) {
    const p = parsePrice(edit?.price ?? "");
    const q = parseInt(edit?.qty, 10);
    if (isNaN(p) || !(p > 0)) return L("buyorders.enterAPrice");
    const real = realUp(p);
    const sum = (q > 0 ? ` \xB7 ${L("buyorders.total")} ${fmt(real * q)}` : "") + (r?.comp != null ? ` \xB7 ${L("buyorders.highestOtherOrder")}: ${fmt(r.comp)}` : "");
    return real !== p ? `<span class="warn">${fmt(p)} ${L("buyorders.doesntExistOnSteamFees")} ${fmt(real)}</span>${sum}` : sum.slice(3);
  }
  async function saveEdit(r) {
    const typed = parsePrice(edit?.price ?? "");
    const qty = parseInt(edit?.qty, 10);
    if (isNaN(typed) || !(typed > 0)) return log(L("buyorders.enterAPrice2"), "warn");
    if (!(qty > 0)) return log(L("buyorders.enterAQuantity"), "warn");
    const price = realUp(typed);
    if (price === r.price && qty === r.remaining) {
      edit = null;
      render4();
      return log(L("buyorders.priceAndQuantityUnchanged"));
    }
    const snapped = price !== typed ? `<br><span class="warn">${fmt(typed)} ${L("buyorders.doesntExistOnSteamPlacing")} ${fmt(price)}.</span>` : "";
    if (!await ask(L("buyorders.changeTheOrder"), `${esc(r.name)}<br>${r.remaining} \xD7 ${fmt(r.price)} \u2192 <b>${qty} \xD7 ${fmt(price)}</b> = ${fmt(price * qty)}${snapped}<br><span class="sub">${L("buyorders.steamDoesntLetYouEdit")}</span>`, { ok: L("buyorders.change") })) return;
    edit = null;
    await withLock("outbid", () => replaceOrder(r, price, qty));
    setTimeout(refresh2, 1e3);
  }
  async function findItems(text) {
    const box2 = el4.querySelector("#b-sugg");
    if (text.trim().length < 3) {
      box2.hidden = true;
      return;
    }
    box2.hidden = false;
    box2.innerHTML = L("buyorders.searching");
    try {
      const lang2 = uiLanguage();
      const d = await schedule("search", () => fetch(`${ORIGIN}/market/search/render/?norender=1&appid=730&l=${lang2}&query=${encodeURIComponent(text)}&search_descriptions=0&count=10`, { credentials: "include" }).then((r) => r.json()));
      const res = d?.results || [];
      box2.innerHTML = res.length ? res.map((x) => `<div data-pick="${esc(JSON.stringify({ hash: x.hash_name, name: x.hash_name, appid: 730 }))}">
      <img src="https://community.cloudflare.steamstatic.com/economy/image/${esc(x.asset_description?.icon_url || "")}/62fx62f"><span style="color:#${esc(x.asset_description?.name_color || "c6d4df")}">${esc(x.hash_name || x.name)}</span><span class="p2">${esc(x.sell_price_text || "")}</span></div>`).join("") : L("buyorders.nothingFound");
    } catch (e) {
      box2.innerHTML = `<div class="err">${esc(e.message)}</div>`;
    }
  }
  function pick(p) {
    picked = p;
    el4.querySelector("#b-q").value = p.name;
    el4.querySelector("#b-sugg").hidden = true;
    peek();
  }
  function chip2(r) {
    if (r.comp == null) return checking ? `<span class="chipst mut">${L("buyorders.checking")}</span>` : r.h ? `<span class="chipst ok">${L("buyorders.highest")}</span>` : '<span class="chipst mut">-</span>';
    if (r.comp > shown2(r)) return `<span class="chipst bad">${L("buyorders.outbidSomeoneOffers", { comp: fmt(r.comp) })}</span>`;
    if (r.comp === shown2(r)) return '<span class="chipst mid">remis</span>';
    return `<span class="chipst ok">${L("buyorders.highest")}</span>`;
  }
  function proposal(r) {
    const rule = r.rule || {};
    if (r.comp == null || r.comp < shown2(r)) return null;
    let price = priceAbove(r.comp, net);
    let note = L("buyorders.aCentMoreThanThe");
    if (rule.max != null && price > rule.max) return { price: null, note: `przebicie (${fmt(price)}) przekracza Twoje max ${fmt(rule.max)}` };
    if (r.h?.lowestSell && price >= r.h.lowestSell) note = L("buyorders.carefulThatsAlreadyWhatBuying", { lowestSell: fmt(r.h.lowestSell) });
    return { price, note };
  }
  var drawTimer2 = 0;
  var renderSoon2 = () => {
    if (!drawTimer2) drawTimer2 = setTimeout(render4, 400);
  };
  function render4() {
    clearTimeout(drawTimer2);
    drawTimer2 = 0;
    if (!el4) return;
    const tb = el4.querySelector("tbody");
    const cnt = document.querySelector('#stt [data-mt="buy"] .cnt');
    if (cnt) cnt.textContent = `(${rows2.length})`;
    const a = document.activeElement;
    if (a && tb.contains(a) && a.tagName === "INPUT" && a.type !== "checkbox") {
      pendingRender2 = true;
      return;
    }
    pendingRender2 = false;
    const sel2 = rows2.filter((r) => r.checked);
    el4.querySelector("#b-bulk").hidden = !sel2.length;
    el4.querySelector("#b-bulkn").textContent = L("buyorders.selected", { sel: sel2.length });
    const beaten = rows2.filter((r) => r.comp != null && r.comp > shown2(r)).length;
    el4.querySelector("#b-state").innerHTML = checking ? `<span class="acc">${L("buyorders.checkingTheCompetition")}</span>` : lastCheck ? beaten ? `<b class="err">${beaten} ${L("buyorders.outbid")}</b> \xB7 ${L("buyorders.checked")} ${timeAgo(lastCheck)}` : `<span class="ok">${L("buyorders.allHighest")}</span> \xB7 ${L("buyorders.checked")} ${timeAgo(lastCheck)}` : "";
    if (!rows2.length) {
      clearRows(tb);
      tb.innerHTML = L("buyorders.youHaveNoBuyOrders");
      return;
    }
    const rowHtml = (r) => {
      const rule = r.rule || {};
      const typ = typical(r.hash);
      const sellAt = typ?.d7 && r.h?.lowestSell ? Math.min(Math.round(typ.d7), r.h.lowestSell - 1) : null;
      const fp = sellAt ? receivedFromBuyer2(sellAt) - shown2(r) : null;
      const p = proposal(r);
      const autoTag = rule.auto ? `<span class="chipst ${rule.max != null ? "ok" : "mid"}" title="${rule.max != null ? L("buyorders.autoOutbidsUpTo", { max: fmt(rule.max) }) : L("buyorders.autoIsOnButWithout")}">auto</span>` : "";
      const main2 = `<tr data-id="${r.id}">
      <td><input type="checkbox" data-f="chk" ${r.checked ? "checked" : ""}></td>
      <td>${itemCell(r)}</td>
      <td><b>${fmt(r.price)}</b> \xD7 ${r.remaining}${r.qty !== r.remaining ? `<span class="sub"> (${L("buyorders.of")} ${r.qty})</span>` : ""}<div class="sub">${L("buyorders.total")} ${fmt(r.price * r.remaining)}</div>${shown2(r) !== r.price ? `<div class="sub warn" title="${L("buyorders.thisPriceCantBePaid", { r: fmt(shown2(r)), price: fmt(realUp(r.price)) })}">${L("buyorders.standsAs")} ${fmt(shown2(r))}</div>` : ""}</td>
      <td>${chip2(r)} ${autoTag}<div class="sub" style="margin-top:3px">${r.h?.lowestSell ? `${L("buyorders.buyNow")}: ${fmt(r.h.lowestSell)}` : ""}${fp != null ? ` \xB7 <span title="${L("buyorders.profitPerUnitAfterThe", { sellAt: fmt(sellAt) })}">${L("buyorders.afterSelling")}: <span class="${fp > 0 ? "pos" : "neg"}">${fmt(fp)}</span></span>` : ""} \xB7 <a class="acc" target="_blank" href="${esc(marketUrl(r.appid, r.hash))}">${L("buyorders.market2")} \u2197</a></div></td>
      <td>${p?.price != null ? `<b>${fmt(p.price)}</b><div class="sub">${esc(p.note)}</div>` : p ? `<span class="sub warn">${esc(p.note)}</span>` : r.comp != null ? L("buyorders.nothingNeeded") : ""}${r.status ? `<div class="sub ${r.cls || ""}">${esc(r.status)}</div>` : ""}</td>
      <td><div class="acts">
        ${p?.price != null ? `<button class="b go" data-a="bid" data-id="${r.id}" title="${L("buyorders.cancelsTheOrderAndPlaces", { price: fmt(p.price) })}">${L("buyorders.outbid2")} ${fmt(p.price)}</button>` : ""}
        <button class="b ${edit?.id === r.id ? "on" : ""}" data-a="edit" data-id="${r.id}" title="${L("buyorders.anotherPriceOrQuantityCancels")}">${L("buyorders.change")}</button>
        <button class="b red" data-a="rm" data-id="${r.id}">${L("buyorders.cancel")}</button>
        <button class="b ${openCfg2 === r.id ? "on" : ""}" data-a="cfg" data-id="${r.id}" title="${L("buyorders.maximumPriceAndAutomation")}">\u2699</button>
      </div></td></tr>`;
      const editRow = edit?.id !== r.id ? "" : `<tr class="cfg" data-id="${r.id}"><td></td><td colspan="5"><div class="row2" style="padding:6px 0;align-items:flex-end">
      <label>${L("buyorders.newPricePerUnit")}<input class="p" data-f="np" value="${esc(edit.price)}"></label>
      <label>${L("buyorders.quantity")}<input type="number" min="1" data-f="nq" value="${esc(edit.qty)}" style="width:64px"></label>
      <button class="b go" data-a="save" data-id="${r.id}">${L("buyorders.save")}</button>
      <span class="sub ehint">${editHint(r)}</span>
    </div></td></tr>`;
      if (openCfg2 !== r.id) return main2 + editRow;
      return main2 + editRow + `<tr class="cfg" data-id="${r.id}"><td></td><td colspan="5"><div class="row2" style="padding:6px 0;align-items:flex-end">
      <label>${L("buyorders.dontPayMoreThan")}<input class="p" data-f="max" value="${toInput(rule.max)}" placeholder="-"></label>
      <label style="flex-direction:row;align-items:center;gap:6px"><input type="checkbox" data-f="auto" ${rule.auto ? "checked" : ""}> ${L("buyorders.outbidAutomatically2")}</label>
      ${rule.auto && rule.max == null ? L("buyorders.setDontPayMoreThan") : ""}
    </div></td></tr>`;
    };
    patchRows(tb, rows2.map((r) => ({ key: r.id, html: rowHtml(r) })));
  }
  async function outbidOne(r) {
    const p = proposal(r);
    if (p?.price == null) return;
    if (!await ask(L("buyorders.outbidTheOrder"), `${esc(r.name)}<br>${fmt(r.price)} \u2192 <b>${fmt(p.price)}</b> \xD7 ${r.remaining} = ${fmt(p.price * r.remaining)}<br><span class="sub">${L("buyorders.theOldOrderIsCancelled")}</span>`, { ok: L("buyorders.outbid2") })) return;
    await withLock("outbid", () => replaceOrder(r, p.price));
    setTimeout(refresh2, 1e3);
  }
  async function cancelOne(r) {
    if (!await ask(L("buyorders.cancelTheOrder"), `${esc(r.name)}, ${r.remaining} \xD7 ${fmt(r.price)}`, { ok: L("buyorders.cancelOrder"), cancel: L("buyorders.back"), danger: true })) return;
    const c = await cancelBuyOrder(r.id);
    setStatus2(r, c.ok ? L("buyorders.cancelled") : L("buyorders.error", { status: c.status }), c.ok ? "ok" : "err");
    setTimeout(refresh2, 800);
  }
  var setStatus2 = (r, text, cls2 = "") => {
    r.status = text;
    r.cls = cls2;
    render4();
  };
  async function refresh2() {
    if (!await ensureLogin()) return;
    try {
      const { buyOrders } = await myListings();
      const prev = new Map(rows2.map((r) => [r.hash, r]));
      rows2 = buyOrders.map((o) => {
        const p = prev.get(o.hash);
        return { ...o, rule: rules2.get(o.hash) || {}, h: p?.h, comp: p?.comp ?? null, checked: p?.checked || false, status: p?.status || "", cls: p?.cls };
      });
      if (!lastCheck) log(L("buyorders.loadedBuyOrders", { rows: rows2.length }));
      render4();
      autoMarket();
      ensure3(rows2.map((x) => ({ hash: x.hash, appid: x.appid })), { onEach: () => renderSoon2() });
    } catch (e) {
      log(L("buyorders.errorLoadingOrders") + e.message, "err");
    }
  }
  var lastCheck = 0;
  var checking = false;
  async function marketFor(list2, tk, quiet) {
    let i = 0;
    for (const r of list2) {
      if (tk.cancelled) break;
      if (!quiet) progress(++i, list2.length);
      try {
        r.h = await hist(r.appid, r.hash, quiet ? 6e4 : 5e3);
        const comp = competitorBuy(r.h.buyGraph, shown2(r), r.remaining, settings.ignoreBelow ?? 2);
        if (quiet && comp != null && comp > shown2(r) && !(r.comp != null && r.comp > shown2(r))) {
          log(L("buyorders.someoneOutbidYourOrderYours", { hash: r.hash, comp: fmt(comp), price: fmt(r.price) }), "warn");
        }
        r.comp = comp;
        renderSoon2();
      } catch (e) {
        setStatus2(r, e.message, "err");
        if (e.status === 429) break;
      }
    }
    if (!quiet) progress(0);
    lastCheck = Date.now();
    render4();
    const beaten = rows2.filter((r) => r.comp != null && r.comp > shown2(r)).length;
    status("outbid", beaten ? `<b class="err">${L("buyorders.outbidOrders")}: ${beaten}</b>` : null);
  }
  async function autoMarket() {
    if (checking || !rows2.length) return;
    checking = true;
    await marketFor(rows2, task4 = token(), true);
    checking = false;
  }
  async function replaceOrder(r, price, qty = r.remaining) {
    const c = await cancelBuyOrder(r.id);
    if (!c.ok || c.json.success && c.json.success !== 1) {
      setStatus2(r, L("buyorders.couldntCancel", { message: c.json.message || c.status }), "err");
      return null;
    }
    const res = await placeOrder({ appid: r.appid, hash: r.hash, priceEach: price, qty });
    if (res.ok) {
      setStatus2(r, `${fmt(r.price)} \u2192 ${fmt(price)}${qty !== r.remaining ? ` \xD7 ${qty}` : ""}${res.confirm ? L("buyorders.confirmInTheApp") : ""}`, "ok");
      return res.id;
    }
    setStatus2(r, L("buyorders.cancelledButTheNewOrder", { msg: res.msg }), "err");
    log(L("buyorders.oldOrderCancelledTheNew", { hash: r.hash, msg: res.msg }), "err");
    return null;
  }
  async function placeOrder({ appid, hash, priceEach, qty }) {
    const r = await createBuyOrder({ appid, hash, priceEach, qty });
    const j = r.json || {};
    if (j.success === 1) return { ok: true, id: j.buy_orderid, confirm: !!j.need_confirmation };
    if (j.need_confirmation) return { ok: true, confirm: true };
    return { ok: false, msg: j.message || (j.success === 29 ? L("buyorders.youAlreadyHaveAnOrder") : L("buyorders.code", { success: j.success ?? r.status })) };
  }
  async function outbid(list2, { silent = false, tk = token() } = {}) {
    if (!list2.length) {
      if (!silent) log(L("buyorders.selectSomeOrders"), "warn");
      return 0;
    }
    let changed = 0;
    await withLock("outbid", async () => {
      for (const r of list2) {
        if (tk.cancelled) break;
        const rule = r.rule || {};
        if (rule.max == null) {
          setStatus2(r, L("buyorders.setAMaxPrice"), "warn");
          continue;
        }
        try {
          r.h = await hist(r.appid, r.hash, 2e4);
          r.comp = competitorBuy(r.h.buyGraph, shown2(r), r.remaining, settings.ignoreBelow ?? 2);
          const t = buyOrderTarget({ current: r.price, myQty: r.remaining, buyGraph: r.h.buyGraph, rule: { max: rule.max, lower: settings.autoBuyLower }, net: (p) => receivedFromBuyer2(p), minQty: settings.ignoreBelow ?? 2 });
          if (t.price == null) {
            setStatus2(r, t.reason, t.outbid ? "warn" : "");
            continue;
          }
          log(`${r.hash}: ${L("buyorders.order")} ${fmt(r.price)} \u2192 ${fmt(t.price)} (${t.reason})`);
          if (await replaceOrder(r, t.price)) changed++;
        } catch (e) {
          setStatus2(r, e.message, "err");
          if (e.status === 429) break;
        }
      }
    });
    if (changed) setTimeout(refresh2, 1e3);
    return changed;
  }
  async function doCancel() {
    const sel2 = rows2.filter((r) => r.checked);
    if (!sel2.length) return log(L("buyorders.selectSomeOrders"), "warn");
    if (!await ask(L("buyorders.cancelTheOrders"), L("buyorders.cancelBuyOrders", { sel: sel2.length }), { ok: L("buyorders.cancelOrders"), cancel: L("buyorders.back"), danger: true })) return;
    await withLock("cancel", async () => {
      for (const r of sel2) {
        const c = await cancelBuyOrder(r.id);
        setStatus2(r, c.ok ? L("buyorders.cancelled") : L("buyorders.error", { status: c.status }), c.ok ? "ok" : "err");
      }
    });
    setTimeout(refresh2, 800);
  }
  async function peek() {
    const out = el4.querySelector("#b-peek");
    if (!picked) return;
    out.textContent = L("buyorders.loading");
    try {
      const [h, hist3] = await Promise.all([hist(picked.appid, picked.hash), priceHistory(picked.appid, picked.hash).catch(() => null)]);
      const fr = hist3?.length ? flipReal({ buyGraph: h.buyGraph, sellGraph: h.sellGraph, points: hist3, net: (p) => receivedFromBuyer2(p) }) : null;
      out.innerHTML = `${L("buyorders.highestOrderOfOthers")}: <b>${fmt(h.highestBuy)}</b> \xB7 ${L("buyorders.buyNow")}: <b>${fmt(h.lowestSell)}</b>${fr ? ` \xB7 <span title="${L("buyorders.likeTheDealsScannerAn")}">flip: ${fmt(fr.buy)} \u2192 ${fmt(fr.sell)}, <span class="${fr.profit > 0 ? "pos" : "neg"}">${fmt(fr.profit)} (${pct(fr.roi)})</span></span>` : ""} \xB7 <a class="acc" target="_blank" href="${esc(marketUrl(picked.appid, picked.hash))}">${L("buyorders.market2")} \u2197</a>`;
      if (!el4.querySelector("#b-price").value && h.highestBuy) el4.querySelector("#b-price").value = toInput(priceAbove(h.highestBuy, (p) => receivedFromBuyer2(p)));
    } catch (e) {
      out.innerHTML = `<span class="err">${esc(e.message)}</span>`;
    }
  }
  async function doCreate() {
    const price = parsePrice(el4.querySelector("#b-price").value);
    const qty = Math.max(1, parseInt(el4.querySelector("#b-qty").value, 10) || 1);
    if (!picked) return log(L("buyorders.pickAnItemFromThe"), "warn");
    if (isNaN(price)) return log(L("buyorders.enterAPrice2"), "warn");
    if (!await ask(L("buyorders.placeTheBuyOrder"), `${esc(picked.name)}<br>${qty} \xD7 ${fmt(price)} = <b>${fmt(price * qty)}</b>`, { ok: L("buyorders.place") })) return;
    const r = await withLock("create", () => placeOrder({ appid: picked.appid, hash: picked.hash, priceEach: price, qty }));
    log(r.ok ? L("buyorders.orderPlaced", { name: picked.name, qty, price: fmt(price), confirm: r.confirm ? L("buyorders.confirmInTheApp") : "" }) : L("buyorders.orderRejected", { msg: r.msg }), r.ok ? "ok" : "err");
    if (r.ok) {
      el4.querySelector("#b-form").hidden = true;
      setTimeout(refresh2, 800);
    }
  }
  function prefill(hash, price, appid = 730) {
    if (!el4) return;
    el4.querySelector("#b-form").hidden = false;
    picked = { hash, name: hash, appid };
    el4.querySelector("#b-q").value = hash;
    el4.querySelector("#b-price").value = toInput(price);
    peek();
  }
  async function autoCycle2() {
    if (!await ensureLogin()) return;
    const { buyOrders } = await myListings();
    const prev = new Map(rows2.map((r) => [r.id, r]));
    rows2 = buyOrders.map((o) => ({ ...prev.get(o.id), ...o, rule: rules2.get(o.hash) || {} }));
    const list2 = rows2.filter((r) => r.rule.auto && r.rule.max != null);
    const n = await outbid(list2, { silent: true });
    lastAuto2 = { at: Date.now(), msg: L("buyorders.checkedChanged", { list: list2.length, n }) };
    if (el4) render4();
  }
  function updateAuto2(st) {
    const on = settings.autoBuy;
    const info2 = !on ? L("buyorders.off2") : !isLeader() ? L("buyorders.runsInAnotherTab") : st?.running ? L("buyorders.working") : L("buyorders.nextInMin", { min: Math.max(0, Math.round((auto2.next - Date.now()) / 6e4)) });
    status("autobuy", `${L("buyorders.autoOutbid")}: <b class="${on ? "ok" : "mut"}">${info2}</b>${lastAuto2 ? ` \xB7 ${timeAgo(lastAuto2.at)}: ${esc(lastAuto2.msg)}` : ""}`);
    const i = el4?.querySelector("#b-autoinfo");
    if (i) i.textContent = info2;
  }
  var auto2 = every("auto-buy", () => settings.autoBuyEvery, () => settings.autoBuy, autoCycle2, updateAuto2);

  // src/features/flip.js
  var watch = bucket("watchlist");
  var hidden = bucket("flipHidden");
  var showHidden = false;
  var el5;
  var task5;
  var results = /* @__PURE__ */ new Map();
  var view2 = "analyze";
  var sort3 = sorter("hold");
  var openBuyOrder = () => {
  };
  var setBuyOrderOpener = (fn) => openBuyOrder = fn;
  var CATS = [
    ["", L("flip.everything")],
    ["case", L("flip.cases")],
    ["capsule", L("flip.capsulesAndPackages")],
    ["tag_CSGO_Tool_Sticker", L("flip.stickers")],
    ["tag_CSGO_Type_Rifle", L("flip.rifles")],
    ["tag_CSGO_Type_Pistol", L("flip.pistols")],
    ["tag_CSGO_Type_SMG", L("flip.smgs")],
    ["tag_CSGO_Type_Knife", L("flip.knives")],
    ["tag_Type_Hands", L("flip.gloves")],
    ["tag_Type_CustomPlayer", L("flip.agents")],
    ["tag_CSGO_Type_Spray", "Graffiti"],
    ["tag_CSGO_Type_MusicKit", L("flip.musicKits")]
  ];
  var isCase = (hash = "") => / Case$/.test(hash) && !/Souvenir/i.test(hash);
  var CAT_TAG = { case: "tag_CSGO_Type_WeaponCase", capsule: "tag_CSGO_Type_WeaponCase" };
  var CAT_NAME = { case: isCase, capsule: (h) => !isCase(h) };
  var maxDefault = () => {
    const b = wallet().balance;
    return b >= 100 ? b : 5e3;
  };
  async function syncMax() {
    const f = el5?.querySelector("#s-max");
    if (!f?.dataset.auto) return;
    try {
      await refreshWallet();
    } catch {
      return;
    }
    if (f.dataset.auto) f.value = toInput(maxDefault());
  }
  function mount5(root2) {
    el5 = root2;
    root2.innerHTML = `
    <div class="bar">
      <button class="b" data-v="analyze">\u{1F50E} ${L("flip.itemAnalysis")}</button>
      <button class="b" data-v="watch">\u2605 ${L("flip.watchlist")}</button>
      <button class="b" data-v="scan">\u{1F4E1} ${L("flip.marketScanner")}</button>
      <span class="sp"></span>
      <button class="b dbg" data-a="research" title="${L("flip.downloadsFromTheSteamMarket")}">\u2B07 ${L("flip.dataForAnalysis")}</button>
      <button class="b dbg" data-a="sample" title="${L("flip.picksAFewHundredRandom")}">\u2B07 ${L("flip.marketSample")}</button>
      <button class="b" data-a="stop" hidden>\u25A0 Stop</button>
    </div>
    <section data-s="analyze">
      <div class="row2">
        <label style="position:relative">${L("flip.itemNameInEnglishOr")}<input type="text" id="f-q" style="width:420px" placeholder="${L("flip.eG")} Budapest 2025 Champions Autograph Capsule" autocomplete="off"><div id="f-sugg" class="sugg" hidden></div></label>
        <label>AppID<input type="number" id="f-app" value="730" style="width:70px"></label>
        <label>${L("flip.yourBuyPriceOptional")}<input class="p" id="f-mine" placeholder="-"></label>
        <label>${L("flip.unitsToBuy")}<input type="number" id="f-n" value="1" min="1" style="width:70px"></label>
        <button class="b go" data-a="analyze">${L("flip.analyse")}</button>
      </div>
      <div id="f-out"></div>
    </section>
    <section data-s="watch" hidden>
      <div class="row2">
        <label>${L("flip.addToWatchlist")}<input type="text" id="w-add" style="width:380px" placeholder="${L("flip.nameInEnglishOrPolish")}"></label>
        <button class="b" data-a="wadd">${L("flip.add")}</button>
        <button class="b go" data-a="wscan">${L("flip.scanWatchlist")}</button>
      </div>
      <div class="tw" id="w-table"></div>
    </section>
    <section data-s="scan" hidden>
      <div class="row2">
        <label>${L("flip.goal")}<select id="s-goal"><option value="hold">${L("flip.longTermCaseSeason")}</option><option value="flip">${L("flip.quickFlip7DayLock")}</option></select></label>
        <label>${L("flip.category")}<select id="s-cat">${CATS.map(([v, n]) => `<option value="${v}">${n}</option>`).join("")}</select></label>
        <label>${L("flip.search")}<input type="text" id="s-q" style="width:150px" placeholder="${L("flip.optional")}"></label>
        <label>${L("flip.priceFrom")}<input class="p" id="s-min" value="${toInput(100)}"></label>
        <label>${L("flip.to")}<input class="p" id="s-max" data-auto="1" value="${toInput(maxDefault())}"></label>
        <label>${L("flip.minListings")}<input type="number" id="s-list" value="100" style="width:80px"></label>
        <label data-only="hold">${L("flip.itemsToCheck")}<input type="number" id="s-n" value="40" style="width:70px"></label>
        <label data-only="flip">${L("flip.howManyToFind")}<input type="number" id="s-find" value="${esc(get("flipFind", "5"))}" min="0" placeholder="${L("flip.noLimit")}" style="width:92px"></label>
        <label data-only="flip">${L("flip.minSales24h")}<input type="number" id="s-vol" value="${settings.minVolume}" style="width:70px"></label>
        <label data-only="flip">Min. ROI %<input type="number" id="s-roi" value="${Math.round(settings.minRoi * 100)}" style="width:60px"></label>
        <label data-only="flip" style="flex-direction:row;align-items:center;gap:6px;padding-bottom:6px" title="${L("flip.onlyItemsWithTheFlip")}"><input type="checkbox" id="s-only" ${get("flipOnlyOk", true) ? "checked" : ""}> ${L("flip.profitableOnly")}</label>
        <label data-only="flip" style="flex-direction:row;align-items:center;gap:6px;padding-bottom:6px" title="${L("flip.tickedTheScannerReusesWhat")}"><input type="checkbox" id="s-skip" ${get("flipSkipSeen", true) ? "checked" : ""}> ${L("flip.useRememberedData")}</label>
        <button class="b go" data-a="scan">${L("flip.scan")}</button>
        <button class="b" data-a="sclear" title="${L("flip.removesTheResultsOfThe")}">${L("flip.clearList")}</button>
      </div>
      <details><summary>${L("flip.howDoesItWork")}</summary><div class="note" style="font-size:13px">${L("flip.theScannerTakesTheMost")}
      </div></details>
      <div class="tw" id="s-table"></div>
    </section>`;
    root2.addEventListener("click", onClick2);
    root2.querySelector("#f-q").addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        el5.querySelector("#f-sugg").hidden = true;
        analyze();
      }
    });
    let sT = 0;
    root2.querySelector("#f-q").addEventListener("input", (e) => {
      clearTimeout(sT);
      sT = setTimeout(() => suggest2(e.target.value), 450);
    });
    root2.querySelector("#f-sugg").addEventListener("click", (e) => {
      const d = e.target.closest("[data-pick]");
      if (!d) return;
      const p = JSON.parse(d.dataset.pick);
      el5.querySelector("#f-q").value = p.hash;
      el5.querySelector("#f-app").value = 730;
      el5.querySelector("#f-sugg").hidden = true;
      analyze();
    });
    root2.querySelector("#f-n").addEventListener("input", renderPlan);
    const goalSel = root2.querySelector("#s-goal");
    const applyGoal = () => {
      const g = goalSel.value;
      root2.querySelectorAll("[data-only]").forEach((x) => x.hidden = x.dataset.only !== g);
    };
    goalSel.value = get("flipGoal2", "hold");
    if (goalSel.value === "hold") root2.querySelector("#s-cat").value = "case";
    applyGoal();
    root2.querySelector("#s-only").onchange = (e) => {
      set("flipOnlyOk", e.target.checked);
      renderScan();
    };
    goalSel.onchange = () => {
      set("flipGoal2", goalSel.value);
      applyGoal();
      renderScan();
      if (view2 === "watch") renderWatch();
    };
    root2.querySelector("#s-max").addEventListener("input", (e) => {
      delete e.target.dataset.auto;
    });
    if (loadRows()) renderScan();
    setView(get("flipView", "analyze"));
    syncMax();
  }
  var show6 = () => {
  };
  function setView(v) {
    view2 = v;
    set("flipView", v);
    el5.querySelectorAll("section[data-s]").forEach((s) => s.hidden = s.dataset.s !== v);
    el5.querySelectorAll("[data-v]").forEach((b) => b.classList.toggle("go", b.dataset.v === v));
    if (v === "watch") renderWatch();
  }
  function onClick2(e) {
    const th = e.target.closest("th[data-sort]");
    if (th) {
      sort3.click(th.dataset.sort);
      if (view2 === "scan") renderScan();
      else if (view2 === "watch") renderWatch();
      return;
    }
    const v = e.target.closest("[data-v]")?.dataset.v;
    if (v) return setView(v);
    const b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.an) {
      el5.querySelector("#f-q").value = b.dataset.an;
      el5.querySelector("#f-app").value = b.dataset.app || 730;
      setView("analyze");
      return analyze();
    }
    if (b.dataset.w) {
      toggleWatch(b.dataset.w, b.dataset.app || 730);
      return;
    }
    if (b.dataset.bo) {
      openBuyOrder(b.dataset.bo, +b.dataset.price, b.dataset.app || 730);
      return;
    }
    if (b.dataset.hide) {
      hidden.set(b.dataset.hide, { at: Date.now(), appid: +(b.dataset.app || 730) });
      scanSet.delete(b.dataset.hide);
      saveRows();
      renderScan();
      return;
    }
    if (b.dataset.unhide) {
      hidden.del(b.dataset.unhide);
      renderScan();
      return;
    }
    ({
      analyze,
      stop: () => {
        task5?.cancel();
        cancelResearch();
      },
      wadd: async () => {
        const h = el5.querySelector("#w-add").value.trim();
        if (!h) return;
        const r = await resolveHash(h);
        if (!r) return log(L("flip.notFoundOnTheMarket", { h }), "warn");
        toggleWatch(r.hash, 730, true);
        el5.querySelector("#w-add").value = "";
      },
      wscan: () => runMetrics(Object.entries(watch.all()).map(([hash, w]) => ({ hash, appid: w.appid || 730 })), "#w-table", true),
      scan,
      sclear: clearScan,
      shidden: () => {
        showHidden = !showHidden;
        renderScan();
      },
      unhideall: () => {
        hidden.replace({});
        showHidden = false;
        renderScan();
      },
      research: exportResearch2,
      sample: () => {
        if (!scanning) exportMarketSample({ onBusy: (on) => el5.querySelector('[data-a="stop"]').hidden = !on });
      }
    })[b.dataset.a]?.();
  }
  function toggleWatch(hash, appid, forceAdd = false) {
    if (watch.get(hash) && !forceAdd) {
      watch.del(hash);
      log(L("flip.removedFromWatchlist", { hash }));
    } else {
      watch.set(hash, { appid: +appid, added: Date.now() });
      log(L("flip.addedToWatchlist", { hash }), "ok");
    }
    if (view2 === "watch") setView("watch");
    else el5.querySelectorAll(`[data-w="${CSS.escape(hash)}"]`).forEach((x) => x.textContent = watch.get(hash) ? "\u2605" : "\u2606");
  }
  var searchNames = (text, count = 10, lang2 = uiLanguage()) => schedule("search", () => fetch(`${ORIGIN}/market/search/render/?norender=1&appid=730&l=${lang2}&query=${encodeURIComponent(text)}&search_descriptions=0&count=${count}`, { credentials: "include" }).then((r) => r.ok ? r.json() : null)).catch(() => null);
  async function resolveHash(text) {
    const low = text.toLowerCase();
    const exactIn = (res) => res.find((r) => r.hash_name.toLowerCase() === low || String(r.name || "").toLowerCase() === low);
    const local = (await searchNames(text, 20))?.results || [];
    let hit = exactIn(local);
    if (hit) return { hash: hit.hash_name, name: hit.name };
    const en = uiLanguage() === "english" ? [] : (await searchNames(text, 20, "english"))?.results || [];
    hit = exactIn(en);
    if (hit) return { hash: hit.hash_name, name: hit.name };
    const first = local[0] || en[0];
    return first ? { hash: first.hash_name, name: first.name, guess: true } : null;
  }
  async function suggest2(text) {
    const box2 = el5.querySelector("#f-sugg");
    if (text.trim().length < 3 || parseQuery(text)) {
      box2.hidden = true;
      return;
    }
    box2.hidden = false;
    box2.innerHTML = `<div class="sub">${L("flip.searching")}</div>`;
    const res = (await searchNames(text.trim()))?.results || [];
    if (el5.querySelector("#f-q").value !== text) return;
    box2.innerHTML = res.length ? res.map((x) => `<div data-pick="${esc(JSON.stringify({ hash: x.hash_name }))}"><img src="https://community.cloudflare.steamstatic.com/economy/image/${esc(x.asset_description?.icon_url || "")}/62fx62f"><span style="color:#${esc(x.asset_description?.name_color || "c6d4df")}">${esc(x.hash_name || x.name)}</span><span class="p2">${esc(x.sell_price_text || "")}</span></div>`).join("") : `<div class="sub">${L("flip.nothingFound")}</div>`;
  }
  var parseQuery = (q) => {
    const m = q.match(/market\/listings\/(\d+)\/([^?#]+)/);
    if (m) return { appid: m[1], hash: decodeURIComponent(m[2]) };
    return null;
  };
  var feeMult = () => {
    const w = wallet();
    return 1 + (w.feePercent ?? 0.05) + (w.pubDefault ?? 0.1);
  };
  var net2 = (p) => receivedFromBuyer2(p);
  var sp = (x, d = 0) => x == null || !isFinite(x) ? "-" : (x > 0 ? "+" : "") + pct(x, d);
  var cls = (x) => x == null ? "" : x > 0 ? "pos" : x < 0 ? "neg" : "";
  var medianOf2 = (a) => {
    if (!a.length) return null;
    const s = [...a].sort((x, y) => x - y);
    return s[Math.floor((s.length - 1) / 2)];
  };
  var goalNow = () => el5?.querySelector("#s-goal")?.value || "hold";
  function metricsRow(hash, appid, h, po, st, hist3) {
    const vol = st?.vol24 ?? po?.volume ?? null;
    const fr = hist3 ? flipReal({ buyGraph: h.buyGraph, sellGraph: h.sellGraph, points: hist3, net: net2 }) : null;
    const hs = hist3 ? holdStats(hist3, feeMult()) : null;
    return {
      hash,
      appid,
      h,
      vol,
      st,
      fr,
      hs,
      holdScore: hs?.winter && hs.winter.n >= 3 ? hs.winter.med * hs.winter.win * 100 : null,
      at: Date.now()
    };
  }
  function holdVerdict(r) {
    const hs = r.hs;
    if (!hs) return { k: "none", label: L("flip.noHistory"), c: "mut", why: L("flip.steamReturnedNoPriceHistory") };
    if (hs.ageDays < 365) return { k: "new", label: L("flip.newItem"), c: "bad", why: L("flip.itHasBeenOnThe") };
    if (r.h?.lowestSell && r.h.lowestSell < 100) return { k: "cheap", label: L("flip.tooCheap"), c: "bad", why: L("flip.below1ZTheMinimum") };
    let rec = hs.winter ? L("flip.wintersInProfitOfTypically", { wins: hs.winter.wins, n: hs.winter.n, med: sp(hs.winter.med) }) : "";
    if (isCase(r.hash)) {
      const age = dec(hs.ageDays / 365, 1);
      if (hs.ageDays < 4 * 365) return { k: "young", label: L("flip.tooYoung"), c: "mid", why: L("flip.onTheMarketForYears", { age }) };
      rec = L("flip.theCaseIsYearsOld", { age, rec });
    } else {
      if (!hs.winter || hs.winter.n < 3) return { k: "short", label: L("flip.historyTooShort"), c: "mut", why: L("flip.lessThan3WintersOf") };
      if (!(hs.winter.win >= 0.7 && hs.winter.med > 0.1)) return { k: "weak", label: L("flip.weakHistory"), c: "bad", why: L("flip.thatsTooLittleToCount", { rec }) };
    }
    if (r.vol != null && r.vol < 20) return { k: "thin", label: L("flip.lowVolume"), c: "mid", why: L("flip.butOnlyUnitsSellA", { rec, vol: r.vol }) };
    if (hs.trend30 != null && hs.trend30 < -0.1) return { k: "wait", label: L("flip.waitItsFalling"), c: "mid", why: L("flip.butThePriceFellIn", { rec, trend30: pct(-hs.trend30, 0) }) };
    return { k: "ok", label: L("flip.candidate"), c: "ok", why: L("flip.thePriceIsntDroppingSharply", { rec }) };
  }
  var MIN_FILL_WEEK = 10;
  function flipVerdict(r) {
    const fr = r.fr, sig = r.hs?.sigmaWeek;
    if (!fr) return { k: "none", label: L("flip.noData"), c: "mut", reasons: [L("flip.noOrderBookOrPrice")] };
    const reasons = [];
    if (fr.profit <= 0) reasons.push(fr.sell24 > fr.sell && net2(fr.sell24) > fr.buy ? L("flip.theresAProfitOnlyAt", { sell24: fmt(fr.sell24), sell: fmt(fr.sell) }) : L("flip.atThePriceSalesActually"));
    if (fr.fill7 === 0) reasons.push(L("flip.inTheLast7Days"));
    if (r.vol != null && r.vol < settings.minVolume) reasons.push(L("flip.lowVolume24h", { vol: r.vol }));
    if (fr.profit > 0 && fr.roi < settings.minRoi) reasons.push(L("flip.profitBelow", { minRoi: Math.round(settings.minRoi * 100) }));
    if (fr.profit > 0 && !reasons.length) {
      if (fr.week < MIN_FILL_WEEK) return { k: "slow", label: L("flip.rarelyFills"), c: "mid", reasons: [L("flip.inTheLast7Days2", { week: fr.week, MIN_FILL_WEEK })] };
      if (sig != null && fr.roi < sig) return { k: "risk", label: L("flip.risky"), c: "mid", reasons: [L("flip.theProfitIsSmallerThan", { roi: sp(fr.roi, 1), sig: pct(sig, 1) })] };
      return { k: "ok", label: L("flip.flipPossible"), c: "ok", reasons: [L("flip.unitAfterTheFeeRemember", { profit: fmt(fr.profit) })] };
    }
    return { k: "no", label: L("flip.flipDoesntPay"), c: "bad", reasons };
  }
  var winterTitle = (hs) => hs?.winters?.length ? L("flip.bought2229NovemberSold") + hs.winters.map((w) => `${w.y}/${String(w.y + 1).slice(2)}: ${sp(w.r)}`).join("\n") : "";
  async function analyze() {
    let hash = el5.querySelector("#f-q").value.trim();
    let appid = el5.querySelector("#f-app").value || 730;
    const pq = parseQuery(hash);
    if (pq) {
      ({ hash, appid } = pq);
      el5.querySelector("#f-q").value = hash;
      el5.querySelector("#f-app").value = appid;
    }
    if (!hash) return;
    if (!pq && +appid === 730 && !results.has(hash) && !get("itemMeta", {})[hash]) {
      const r = await resolveHash(hash);
      if (!r) {
        el5.querySelector("#f-out").innerHTML = `<div class="empty">${L("flip.noItemFoundOnThe", { hash: esc(hash) })}</div>`;
        return;
      }
      if (r.hash !== hash) {
        log(`${L("flip.analysis")}: ${L("flip.is", { hash })} ${r.name}${r.name !== r.hash ? ` (${r.hash})` : ""}${r.guess ? L("flip.closestMatch") : ""}`);
        hash = r.hash;
        el5.querySelector("#f-q").value = hash;
      }
    }
    const mine = parsePrice(el5.querySelector("#f-mine").value);
    const out = el5.querySelector("#f-out");
    out.innerHTML = `<div class="empty"><span class="spin"></span>${L("flip.analysingOrdersVolumePriceHistory")}</div>`;
    try {
      const [h, po, hist3] = await Promise.all([
        hist(appid, hash),
        steamPrice(appid, hash).catch(() => null),
        priceHistory(appid, hash, { remember: true }).catch((e) => {
          log(L("flip.priceHistory") + e.message, "warn");
          return [];
        })
      ]);
      const st = historyStats(hist3);
      const row = metricsRow(hash, appid, h, po, st, hist3.length ? hist3 : null);
      results.set(hash, row);
      const { fr, hs } = row;
      lastAn = { h, hist: hist3, fr };
      const fv = flipVerdict(row), hv = holdVerdict(row);
      const sell2 = fr?.sell ?? Math.max(MIN_BUYER, h.lowestSell - 1);
      const deal = !isNaN(mine) ? {
        now: dealCheck({ price: mine, sellPrice: sell2, wallet: wallet() }),
        med: st.med7 ? dealCheck({ price: mine, sellPrice: st.med7, wallet: wallet() }) : null
      } : null;
      const sell30 = hist3.filter((p) => p.t > Date.now() - 30 * 864e5);
      const chart = lineChart([
        { points: sell30.map((p) => [p.t, p.price]), color: "#66c0f4", label: L("flip.salePrice") },
        ...fr ? [{ points: [[sell30[0]?.t || Date.now() - 2592e6, fr.bid], [Date.now(), fr.bid]], color: "#a4d007", dash: true, label: L("flip.buyOrdersNow") }] : [],
        ...h.lowestSell ? [{ points: [[sell30[0]?.t || Date.now() - 2592e6, h.lowestSell], [Date.now(), h.lowestSell]], color: "#e5b84c", dash: true, label: L("flip.lowestListingNow") }] : []
      ], { fmtY: (x) => fmt(Math.round(x)), bars: sell30.map((p) => [p.t, p.vol]) });
      const depth = (g, n = 6) => g.slice(0, n).map(([p, c], i) => `<tr><td>${fmt(p)}</td><td>${c - (i ? g[i - 1][1] : 0)}</td><td class="sub">${c}</td></tr>`).join("");
      const m = get("itemMeta", {})[hash];
      const box2 = (k, v, sub = "", c = "") => `<div class="card"><div class="k">${k}</div><div class="v ${c}">${v}</div>${sub ? `<div class="sub">${sub}</div>` : ""}</div>`;
      out.innerHTML = `
      <div class="row2" style="align-items:center">
        ${itemCell({ hash, name: m?.name || hash, icon: m?.icon, color: m?.color, appid })}
        <span class="sp" style="flex:1"></span>
        <button class="b" data-w="${esc(hash)}" data-app="${appid}">${watch.get(hash) ? "\u2605" : "\u2606"} ${L("flip.watch")}</button>
        ${fr ? `<button class="b go" data-bo="${esc(hash)}" data-price="${fr.buy}" data-app="${appid}" title="${L("flip.anOrderACentAbove")}">${L("flip.placeBuyOrder")} ${fmt(fr.buy)}</button>` : ""}
      </div>

      <div class="sec-h"><span>${L("flip.longTerm")}</span> <span class="chipst ${hv.c}" style="margin-left:8px">${esc(hv.label)}</span></div>
      <div class="note">${esc(hv.why)}</div>
      ${hs ? `<div class="cards">
        ${box2(L("flip.wintersNovToMay"), hs.winter ? `${hs.winter.wins}/${hs.winter.n} ${L("flip.inProfit")}` : "-", hs.winter ? L("flip.typicallyAfterTheFee", { med: sp(hs.winter.med) }) : L("flip.historyTooShort"), hs.winter ? cls(hs.winter.med) : "")}
        ${box2(L("flip.after1Year"), hs.y1 ? `${pct(hs.y1.win, 0)} ${L("flip.inProfit")}` : "-", hs.y1 ? L("flip.typicallyPeriods", { med: sp(hs.y1.med), n: hs.y1.n }) : "", hs.y1 ? cls(hs.y1.med) : "")}
        ${box2(L("flip.after2Years"), hs.y2 ? `${pct(hs.y2.win, 0)} ${L("flip.inProfit")}` : "-", hs.y2 ? L("flip.typicallyPeriods", { med: sp(hs.y2.med), n: hs.y2.n }) : "", hs.y2 ? cls(hs.y2.med) : "")}
        ${box2(L("flip.vs1YearAvg"), sp(hs.vsYear), L("flip.priceNowAgainstThe12"), cls(hs.vsYear))}
        ${box2(L("flip.30Days"), sp(hs.trend30), L("flip.priceChangeOverTheLast"), cls(hs.trend30))}
      </div>
      ${hs.winters.length ? `<div class="note" style="padding-top:0">${L("flip.bought2229NovemberSold2")}: ${hs.winters.map((w) => `<span class="tag" style="margin:2px">${w.y}/${String(w.y + 1).slice(2)} <b class="${cls(w.r)}">${sp(w.r)}</b></span>`).join("")}</div>` : ""}` : ""}

      <div class="sec-h"><span>${L("flip.quickFlipSoldAfterThe")}</span> <span class="chipst ${fv.c}" style="margin-left:8px">${esc(fv.label)}</span></div>
      <div class="note">${fv.reasons.map(esc).join(" \xB7 ")}</div>
      <div class="cards">
        ${box2(L("flip.buyOrder"), fr ? fmt(fr.buy) : "-", L("flip.topOfTheBookOrders", { highestBuy: fmt(h.highestBuy), buyCount: h.buyCount }))}
        ${box2(L("flip.sellActualSales"), fr ? fmt(fr.sell) : "-", `${fr && fr.sell24 > fr.sell ? `<span class="warn">${L("flip.todayICountTheTypical", { sell24: fmt(fr.sell24) })}</span> \xB7 ` : ""}${L("flip.lowestListingListings", { lowestSell: fmt(h.lowestSell), sellCount: h.sellCount })}`)}
        ${box2(L("flip.profitUnitFlip"), fr ? fmt(fr.profit) : "-", fr ? L("flip.youGetBuy", { net: fmt(fr.net), buy: fmt(fr.buy) }) : "", fr ? cls(fr.profit) : "")}
        ${box2("ROI", fr ? sp(fr.roi, 1) : "-", L("flip.afterTheFee"), fr ? cls(fr.roi) : "")}
        ${box2(L("flip.weeklySwing"), hs?.sigmaWeek != null ? `\xB1${pct(hs.sigmaWeek, 1)}` : "-", L("flip.typicalPriceChangeIn7"))}
        ${box2(L("flip.fillChance"), fr ? `${fr.week} ${L("flip.pcs")}` : "-", fr ? L("flip.soldIn7DaysAt", { fill7: pct(fr.fill7, 0) }) : "", fr && fr.week < MIN_FILL_WEEK ? "warn" : "")}
        ${box2(L("flip.volume"), `${st.vol24 || po?.volume || 0}<span class="sub"> /24h</span>`, L("flip.7Days", { vol7: st.vol7 }))}
        ${box2(L("flip.median7dAvg30d"), fmt(st.med7), `30d: ${fmt(st.avg30)} \xB7 min/max 7d ${fmt(st.min7)}-${fmt(st.max7)}`)}
        ${box2(L("flip.breakEven"), fr ? fmt(buyerFromReceived2(fr.buy)) : "-", L("flip.minSalePriceToCome"))}
      </div>
      <div id="f-plan"></div>
      ${deal ? `<div class="note" style="font-size:13px">${L("flip.yourPurchaseForSellingNow", { mine: fmt(mine), sell: fmt(sell2), net: fmt(deal.now.net) })} <b class="${deal.now.profit >= 0 ? "pos" : "neg"}">${fmt(deal.now.profit)} (${pct(deal.now.roi)})</b>${deal.med ? `${L("flip.atThe7dMedian")} <b class="${deal.med.profit >= 0 ? "pos" : "neg"}">${fmt(deal.med.profit)}</b>` : ""}. ${L("flip.toComeOutEvenList")} <b>${fmt(deal.now.breakEven)}</b>.</div>` : ""}
      <div style="padding:0 14px">${chart}</div>`;
      renderPlan();
      const bookHead = `<tr><th>${L("flip.price")}</th><th>${L("flip.qty")}</th><th>${L("flip.cumul")}</th></tr>`;
      out.insertAdjacentHTML("beforeend", `
      <div class="row2" style="align-items:flex-start">
        <div><div class="sub">${L("flip.buyOrders")}</div><table style="width:auto">${bookHead}${depth(h.buyGraph)}</table></div>
        <div><div class="sub">${L("flip.sellListings")}</div><table style="width:auto">${bookHead}${depth(h.sellGraph)}</table></div>
      </div>`);
    } catch (e) {
      out.innerHTML = `<div class="empty err">${esc(e.message)}</div>`;
    }
  }
  var lastAn = null;
  function renderPlan() {
    const box2 = el5.querySelector("#f-plan");
    if (!box2 || !lastAn) return;
    const { h, hist: hist3, fr } = lastAn;
    const qty = Math.max(1, Math.min(1e3, Math.floor(+el5.querySelector("#f-n").value) || 1));
    const sell2 = fr?.sell ?? (h.lowestSell ? Math.max(MIN_BUYER, h.lowestSell - 1) : null);
    const p = sell2 ? buyPlan({ buyGraph: h.buyGraph, sellGraph: h.sellGraph, points: hist3, net: net2, sell: sell2, from: fr?.buy, qty, minRoi: settings.minRoi }) : null;
    if (!p) {
      box2.innerHTML = "";
      return;
    }
    const n = p.now;
    const szt = `${qty} ${L("flip.pcs")}`;
    const nowTxt = n.short != null ? L("flip.youCantBuyRightAway", { szt, listed: n.listed }) : L("flip.rightAwaySetTheOrder", { szt, price: fmt(n.price), total: fmt(n.total), qty: qty > 1 ? L("flip.onAverageAUnitEach", { avg: fmt(Math.round(n.avg)) }) : "" }) + ` <b class="${cls(n.profit)}">${fmt(n.profit)} (${sp(n.roi, 1)})</b>.${p.cheap ? ` ${L("flip.listingsAtOrCheaper", { maxRoi: fmt(p.maxRoi) })} <b>${p.cheap}</b>.` : ""}`;
    const mark = (x) => x.price === p.maxZero ? L("flip.breakEven2") : x.price === p.maxRoi ? L("flip.highestWithProfit", { minRoi: Math.round(settings.minRoi * 100) }) : x.price === fr?.buy ? L("flip.justAboveTheOrdersIn") : "";
    box2.innerHTML = `
    <div class="sec-h"><span>${L("flip.upToWhatPriceTo")}</span> <span class="sub" style="margin-left:8px">${L("flip.sellingAtYouGet", { sell: fmt(p.sell), got: fmt(p.got) })}</span></div>
    <div class="note">${L("flip.itPaysToBuyUp", { maxRoi: fmt(p.maxRoi), minRoi: Math.round(settings.minRoi * 100), maxZero: fmt(p.maxZero) })} ${nowTxt}</div>
    <table style="width:auto;margin:0 14px 10px"><thead><tr><th>${L("flip.orderPrice")}</th><th>${L("flip.profitUnit")}</th><th>${L("flip.soldThisCheap7Days")}</th><th>${L("flip.ordersAheadOfYou")}</th><th>${L("flip.inAbout", { szt })}</th><th></th></tr></thead><tbody>
    ${p.ladder.map((x) => `<tr style="${x.price === p.maxRoi ? "background:rgba(164,208,7,.08)" : ""}">
      <td><b>${fmt(x.price)}</b></td>
      <td class="${cls(x.profit)}">${fmt(x.profit)} <span class="sub">${sp(x.roi, 1)}</span></td>
      <td>${x.week} ${L("flip.pcs")} <span class="sub">${pct(x.share, 0)} ${L("flip.ofVolume")}</span></td>
      <td>${x.ahead}</td>
      <td>${x.days == null ? `<span class="neg">${L("flip.nobodySoldThisCheap")}</span>` : x.days < 1 ? L("flip.lessThanADay") : x.days > 60 ? `<span class="warn">${L("flip.over2Months")}</span>` : L("flip.days", { days: Math.ceil(x.days) })}</td>
      <td class="sub">${mark(x)}</td></tr>`).join("")}
    </tbody></table>
    <div class="note" style="padding-top:0">${L("flip.theTimeIsAnEstimate")}</div>`;
  }
  async function runMetrics(list2, target, isWatch, preFilter = null) {
    if (!list2.length) return log(L("flip.noItemsToCheck"), "warn");
    task5 = token();
    el5.querySelector('[data-a="stop"]').hidden = false;
    let i = 0, lastRender = 0;
    for (const { hash, appid } of list2) {
      if (task5.cancelled) break;
      progress(++i, list2.length);
      try {
        const [h, hist3] = await Promise.all([
          hist(appid, hash, 5 * 6e4),
          priceHistory(appid, hash).catch(() => null)
        ]);
        if (preFilter && !preFilter(h)) continue;
        results.set(hash, metricsRow(hash, appid, h, null, hist3 ? historyStats(hist3) : null, hist3));
        if (Date.now() - lastRender > 400 || i === list2.length) {
          lastRender = Date.now();
          isWatch ? renderWatch() : renderScan();
        }
      } catch (e) {
        log(`${hash}: ${e.message}`, "err");
        if (e.status === 429) {
          log(L("flip.steamLimitStoppedTryAgain"), "warn");
          break;
        }
      }
    }
    progress(0);
    el5.querySelector('[data-a="stop"]').hidden = true;
    isWatch ? renderWatch() : renderScan();
    saveRows(true);
  }
  var HOLD_KEYS = /* @__PURE__ */ new Set(["name", "sell", "winter", "y1", "y2", "vsyear", "trend", "vol", "hold"]);
  var FLIP_KEYS = /* @__PURE__ */ new Set(["name", "verdict", "buy", "sell", "profit", "roi", "sigma", "fill", "vol"]);
  function fixSort(goal) {
    if (goal === "hold" && !HOLD_KEYS.has(sort3.key)) sort3.set("hold");
    if (goal === "flip" && !FLIP_KEYS.has(sort3.key)) sort3.set("roi");
  }
  function seasonNote(rows3) {
    const m = (/* @__PURE__ */ new Date()).getMonth() + 1;
    const txt = [11, 12, 1, 2].includes(m) ? L("flip.buyingSeasonNovemberToFebruary") : m >= 4 && m <= 8 ? L("flip.sellingSeasonAprilToAugust") : L("flip.inBetweenHistoricallyItWas");
    const cs = rows3.filter((r) => r.hs && r.hs.ageDays >= 365 && / Case$/.test(r.hash));
    const t = medianOf2(cs.map((r) => r.hs.trend30).filter((x) => x != null)), y = medianOf2(cs.map((r) => r.hs.vsYear).filter((x) => x != null));
    const mk = cs.length >= 3 && t != null ? L("flip.oldCasesInThisScan", { t: cls(t), t2: sp(t), y: cls(y), y2: sp(y) }) + (t < -0.1 ? L("flip.theMarketIsStillFalling") : "") : "";
    return `${txt}${mk} <span class="sub">${L("flip.numbersFromResearchOn108")}</span>`;
  }
  var scanSet = /* @__PURE__ */ new Set();
  function clearScan() {
    if (scanning) task5?.cancel();
    scanSet = /* @__PURE__ */ new Set();
    findState = null;
    saveRows(true);
    renderScan();
    log(L("flip.scannerListCleared"));
  }
  function hiddenNote() {
    const all3 = Object.keys(hidden.all());
    if (!all3.length) return "";
    const meta2 = get("itemMeta", {});
    const btn = `<button class="b s" data-a="shidden" title="${L("flip.itemsYouHidWithThe")}">${showHidden ? "\u25BE" : "\u25B8"} ${L("flip.hidden")} (${all3.length})</button>`;
    if (!showHidden) return `${btn}<br>`;
    return `${btn} <button class="b s" data-a="unhideall">${L("flip.restoreAll")}</button>
    <div style="display:flex;flex-wrap:wrap;gap:4px;margin:6px 0">${all3.map((h) => `<span class="chipst mut" style="display:inline-flex;align-items:center;gap:4px">${esc(meta2[h]?.name || h)}<button class="b s" data-unhide="${esc(h)}" title="${L("flip.restoreToTheScanner")}" style="padding:0 5px;line-height:1.4">\u21BA</button></span>`).join("")}</div>`;
  }
  function renderScan() {
    const goal = goalNow();
    fixSort(goal);
    const minVol = +el5.querySelector("#s-vol").value || 0;
    const minRoi = (+el5.querySelector("#s-roi").value || 0) / 100;
    settings.minVolume = minVol;
    settings.minRoi = minRoi;
    const rows3 = [...results.values()].filter((r) => scanSet.has(r.hash) && !hidden.get(r.hash));
    if (goal === "hold") {
      const ok2 = (r) => holdVerdict(r).k === "ok";
      const wait = rows3.filter((r) => holdVerdict(r).k === "wait").length;
      renderTable("#s-table", rows3, false, `${hiddenNote()}${ageNote(rows3)}${seasonNote(rows3)}<br>${L("flip.ofAreCandidates", { ok: rows3.filter(ok2).length, rows: rows3.length, wait: wait ? L("flip.haveAGoodHistoryBut", { wait }) : "" })}`, ok2, "hold");
      return;
    }
    const ok = (r) => flipVerdict(r).k === "ok";
    const fd = findState;
    const onlyOk = el5.querySelector("#s-only").checked;
    const notOk = onlyOk ? rows3.filter((r) => !ok(r)).length : 0;
    const FIND_STATE = {
      run: `<span class="acc"><span class="spin"></span>${L("flip.stillSearching")}</span>`,
      stop: `<span class="ok">${L("flip.done")}</span>`,
      end: L("flip.endOfTheListThere"),
      cancel: L("flip.stoppedScanResumes"),
      stall: `<span class="warn">${L("flip.steamStoppedReturningTheList")}</span>`,
      limit: `<span class="warn">${L("flip.steamIsLimitingRequestsTry")}</span>`,
      error: `<span class="err">${L("flip.error")}</span>`
    };
    const progress2 = fd ? L("flip.foundChecked", { found: fd.found, checked: fd.checked, want: fd.want === Infinity ? "" : L("flip.of", { want: fd.want }), total: fd.walk?.total ? L("flip.positionOfOnSteamsList", { pos: fd.walk.pos, total: fd.walk.total }) : "", risky: fd.risky ? L("flip.risky2", { risky: fd.risky, onlyOk: onlyOk ? L("flip.hiddenUntickProfitableOnly") : L("flip.onTheListGreyedOut") }) : "", skipped: fd.skipped ? L("flip.skippedCheckedRecently", { skipped: fd.skipped }) : "", failed: fd.failed ? L("flip.withoutData", { failed: fd.failed }) : "" }) + ` \xB7 ${FIND_STATE[fd.state]}<br>` : "";
    const empty = fd ? fd.state === "run" ? L("flip.nothingPassedSoFarStill") : notOk ? L("flip.noItemGotTheFlip") : L("flip.noCheckedItemPassedLower") : L("flip.setTheFiltersAndClick");
    const rule = L("flip.anItemPassesWithA", { minRoi: Math.round(minRoi * 100), MIN_FILL_WEEK, minVol });
    renderTable("#s-table", onlyOk ? rows3.filter(ok) : rows3, false, `${hiddenNote()}${ageNote(rows3)}${progress2}${rule}`, ok, "flip", empty);
  }
  function renderWatch() {
    const goal = goalNow();
    fixSort(goal);
    renderTable("#w-table", [...results.values()].filter((r) => watch.get(r.hash)), true, "", goal === "hold" ? (r) => holdVerdict(r).k === "ok" : null, goal);
  }
  function renderTable(target, rows3, isWatch, header = "", good = null, goal = "flip", empty = L("flip.setTheFiltersAndClick")) {
    const hold = goal === "hold";
    const sorted = sort3.apply(rows3, {
      name: (r) => r.hash,
      sell: (r) => hold ? r.h?.lowestSell : r.fr?.sell,
      vol: (r) => r.vol,
      buy: (r) => r.fr?.buy,
      profit: (r) => r.fr?.profit,
      roi: (r) => r.fr?.roi,
      sigma: (r) => r.hs?.sigmaWeek,
      fill: (r) => r.fr?.fill7,
      winter: (r) => r.hs?.winter ? r.hs.winter.win + r.hs.winter.med / 100 : null,
      y1: (r) => r.hs?.y1?.med,
      y2: (r) => r.hs?.y2?.med,
      vsyear: (r) => r.hs?.vsYear,
      trend: (r) => r.hs?.trend30,
      hold: (r) => r.holdScore,
      verdict: (r) => ({ ok: 4, risk: 3, slow: 2, no: 1, none: 0 })[flipVerdict(r).k] * 10 + (r.fr?.roi ?? -1)
      // best verdict first, then ROI
    });
    const th = (k, t) => `<th data-sort="${k}">${t}${sort3.arrow(k)}</th>`;
    const meta2 = get("itemMeta", {});
    const head = hold ? `${th("name", L("flip.item"))}${th("hold", L("flip.verdict"))}${th("sell", L("flip.priceNow"))}${th("winter", L("flip.wintersNovToMay"))}${th("y1", L("flip.after1Year"))}${th("y2", L("flip.after2Years"))}${th("vsyear", L("flip.vs1YearAvg"))}${th("trend", L("flip.30Days"))}${th("vol", L("flip.volume24h"))}<th></th>` : `${th("name", L("flip.item"))}${th("verdict", L("flip.verdict"))}${th("profit", L("flip.profitUnit2"))}${th("roi", "ROI")}${th("buy", L("flip.buyOrder"))}${th("sell", L("flip.sellActualSales"))}${th("sigma", L("flip.weeklySwing"))}${th("fill", L("flip.fillChance"))}${th("vol", L("flip.volume24h"))}<th></th>`;
    const cols = 10;
    const volCell = (r) => `<td>${r.vol == null ? '<span class="sub">?</span>' : r.vol}</td>`;
    const rec = (x) => x ? `<b>${pct(x.win, 0)}</b> <span class="${cls(x.med)}">${sp(x.med)}</span>` : '<span class="sub">-</span>';
    const actions = (r) => `<td style="white-space:nowrap"><button class="b s" data-an="${esc(r.hash)}" data-app="${r.appid}">${L("flip.analysis")}</button>
        <button class="b s" data-w="${esc(r.hash)}" data-app="${r.appid}" title="${L("flip.watch")}">${watch.get(r.hash) ? "\u2605" : "\u2606"}</button>
        ${r.fr ? `<button class="b s" data-bo="${esc(r.hash)}" data-price="${r.fr.buy}" data-app="${r.appid}" title="${L("flip.placeABuyOrderFor", { buy: fmt(r.fr.buy) })}">${L("flip.order")}</button>` : ""}
        ${isWatch ? "" : `<button class="b s" data-hide="${esc(r.hash)}" data-app="${r.appid}" title="${L("flip.hideItTheScannerWont")}">\u2715</button>`}</td>`;
    el5.querySelector(target).innerHTML = (header ? `<div class="note">${header}</div>` : "") + `<table><thead><tr>${head}</tr></thead><tbody>${sorted.length ? sorted.map((r) => {
      const m = meta2[r.hash] || {};
      const ok = good ? good(r) : true;
      const name = `<td>${itemCell({ hash: r.hash, name: m.name || r.hash, icon: m.icon || r.icon, color: m.color, appid: r.appid })}</td>`;
      const hs = r.hs, fr = r.fr;
      let body2;
      if (hold) {
        const v = holdVerdict(r);
        body2 = `${name}<td><span class="chipst ${v.c}" title="${esc(v.why)}">${esc(v.label)}</span></td><td>${fmt(r.h?.lowestSell)}</td>
          <td title="${esc(winterTitle(hs))}">${hs?.winter ? `<b>${hs.winter.wins}/${hs.winter.n}</b> <span class="${cls(hs.winter.med)}">${sp(hs.winter.med)}</span>` : '<span class="sub">-</span>'}</td>
          <td>${rec(hs?.y1)}</td><td>${rec(hs?.y2)}</td>
          <td class="${cls(hs?.vsYear)}">${sp(hs?.vsYear)}</td><td class="${cls(hs?.trend30)}">${sp(hs?.trend30)}</td>${volCell(r)}`;
      } else {
        const sig = hs?.sigmaWeek;
        const v = flipVerdict(r);
        body2 = `${name}<td><span class="chipst ${v.c}" title="${esc(v.reasons.join(" \xB7 "))}">${esc(v.label)}</span></td>
          <td class="${fr ? cls(fr.profit) : ""}"><b>${fr ? fmt(fr.profit) : "-"}</b></td><td class="${fr ? cls(fr.roi) : ""}">${fr ? sp(fr.roi, 1) : "-"}</td>
          <td>${fr ? fmt(fr.buy) : "-"}</td>
          <td${fr && fr.sell24 > fr.sell ? ` title="${L("flip.todaySalesGoAtBut", { sell24: fmt(fr.sell24) })}"` : ""}>${fr ? `${fmt(fr.sell)}<div class="sub">${L("flip.youGet")} ${fmt(fr.net)}${fr.sell24 > fr.sell ? ` \xB7 ${L("flip.today")} ${fmt(fr.sell24)}` : ""}</div>` : "-"}</td>
          <td class="${fr && sig != null && fr.roi > 0 && fr.roi < sig ? "warn" : ""}">${sig != null ? "\xB1" + pct(sig, 1) : "-"}</td>
          <td class="${fr && fr.week === 0 ? "neg" : fr && fr.week < MIN_FILL_WEEK ? "warn" : ""}">${fr ? `${fr.week} ${L("flip.pcs")}<div class="sub">${pct(fr.fill7, 0)} ${L("flip.ofVolume")}</div>` : "-"}</td>${volCell(r)}`;
      }
      return `<tr style="${good && !ok ? "opacity:.55" : ""}">${body2}${actions(r)}</tr>`;
    }).join("") : `<tr><td colspan="${cols}" class="empty">${isWatch ? Object.keys(watch.all()).length ? `${L("flip.youWatchClickScanWatchlist", { watch: Object.keys(watch.all()).length })}: ${Object.keys(watch.all()).slice(0, 8).map(esc).join(", ")}${Object.keys(watch.all()).length > 8 ? "\u2026" : ""}` : L("flip.addItemsToTheWatchlist") : esc(empty)}</td></tr>`}</tbody></table>`;
  }
  async function eachCandidate({ cat, nameOk, q, min, max, minListings, fresh: fresh3 }, fn, info2 = {}) {
    let rate = null;
    const meta2 = bucket("itemMeta");
    const page = (start2) => {
      const path = `/market/search/render/?norender=1&appid=730&l=${uiLanguage()}&start=${start2}&count=100&search_descriptions=0&sort_column=popular&sort_dir=desc&query=${encodeURIComponent(q)}${cat ? `&category_730_Type[]=${cat}` : ""}`;
      return cached("q|" + path, fresh3 ? 0 : ttl(), () => schedule("search", async () => {
        const r = await fetch(ORIGIN + path, { credentials: "include" });
        if (r.status === 429) throw new HttpError(429, L("flip.steamTooManyRequests429"));
        if (!r.ok) return null;
        try {
          return slimSearch(await r.json());
        } catch {
          return null;
        }
      }), (d) => d?.results?.length > 0);
    };
    const WAIT = [5, 15, 30, 60];
    let total = Infinity, start = 0, empties = 0;
    while (start < total) {
      if (task5.cancelled) return "cancel";
      if (info2.stop?.()) return "stop";
      const d = await page(start);
      const res = d?.results || [];
      if (d?.total_count > 0) total = d.total_count;
      info2.pos = start;
      info2.total = total === Infinity ? null : total;
      if (!res.length) {
        if (start === 0 && empties >= 1) return "end";
        if (empties >= WAIT.length) return "stall";
        const secs = WAIT[empties++];
        if (start > 0) log(L("flip.scannerSteamReturnedAnEmpty", { start, secs, total: info2.total ? L("flip.of2", { total: info2.total }) : "" }), "warn");
        for (let i = 0; i < secs && !task5.cancelled && !info2.stop?.(); i++) await sleep(1e3);
        continue;
      }
      empties = 0;
      if (rate == null) {
        const top = res.find((r) => r.sell_price > 0);
        if (top) {
          const local = /\$/.test(top.sell_price_text) ? (await steamPrice(730, top.hash_name)).lowest : top.sell_price;
          rate = local / top.sell_price;
        }
      }
      for (let i = 0; rate != null && i < res.length; i++) {
        const r = res[i];
        const p = Math.round(r.sell_price * rate);
        if (!(p >= min && p <= max && r.sell_listings >= minListings && (!nameOk || nameOk(r.hash_name)))) continue;
        if (!meta2.get(r.hash_name)) meta2.set(r.hash_name, { name: r.name, icon: r.asset_description?.icon_url, color: r.asset_description?.name_color, appid: 730 });
        if (task5.cancelled) return "cancel";
        info2.pos = start + i + 1;
        if (await fn({ hash: r.hash_name, appid: 730 }, { pos: start + i + 1, total }) === false) return "stop";
      }
      start += res.length;
      info2.pos = start;
    }
    return task5.cancelled ? "cancel" : "end";
  }
  var quick = /* @__PURE__ */ new Map();
  var FRESH = 30 * 6e4;
  var SEEN_KEY = "flipSeen";
  var seenValid = (e) => !!e && (e.k === "q" ? Date.now() - e.at < 12 * 36e5 && !(e.max > 0 && e.max >= settings.minRoi) : Date.now() - e.at < 3 * 36e5 && settings.minRoi >= e.r && settings.minVolume >= e.v);
  function loadSeen() {
    const all3 = get(SEEN_KEY, {});
    for (const k of Object.keys(all3)) if (Date.now() - all3[k].at > 12 * 36e5) delete all3[k];
    return all3;
  }
  var saveSeen = (all3) => set(SEEN_KEY, all3);
  var scanning = false;
  var findState = null;
  var ROWS_KEY = "flipRows";
  var slimRow = (r) => ({ ...r, st: void 0, h: r.h ? Object.fromEntries(Object.entries(r.h).filter(([, v]) => v == null || typeof v !== "object")) : r.h });
  var saveTimer = 0;
  function saveRows(now = false) {
    clearTimeout(saveTimer);
    const run = () => {
      const rows3 = [...results.values()].filter((r) => Date.now() - r.at < FRESH && (scanSet.has(r.hash) || watch.get(r.hash))).slice(-300).map(slimRow);
      const fd = findState;
      set(ROWS_KEY, {
        v: 1,
        set: [...scanSet].filter((h) => results.has(h)),
        rows: rows3,
        // a scan cut off by the reload is shown as stopped; Infinity doesn't survive JSON
        find: fd ? { ...fd, want: fd.want === Infinity ? null : fd.want, state: fd.state === "run" ? "cancel" : fd.state, walk: { pos: fd.walk?.pos, total: fd.walk?.total } } : null
      });
    };
    if (now) run();
    else saveTimer = setTimeout(run, 3e3);
  }
  function loadRows() {
    const s = get(ROWS_KEY, null);
    if (!s || s.v !== 1 || !Array.isArray(s.rows)) return false;
    const rows3 = s.rows.filter((r) => r && r.hash && Date.now() - r.at < FRESH);
    if (!rows3.length) {
      del(ROWS_KEY);
      return false;
    }
    for (const r of rows3) if (!results.has(r.hash)) results.set(r.hash, r);
    scanSet = new Set((s.set || []).filter((h) => results.has(h)));
    findState = s.find && scanSet.size ? { ...s.find, want: s.find.want ?? Infinity, walk: s.find.walk || {} } : null;
    return true;
  }
  var ageNote = (rows3) => {
    const oldest2 = rows3.length ? Math.min(...rows3.map((r) => r.at)) : 0;
    if (!oldest2 || scanning || Date.now() - oldest2 < 6e4) return "";
    const hm = (t) => new Date(t).toLocaleTimeString(locale(), { hour: "2-digit", minute: "2-digit" });
    return `<span class="sub">${L("flip.resultsFromIKeepThem", { oldest: hm(oldest2), oldest2: hm(oldest2 + FRESH) })}</span><br>`;
  };
  async function scan() {
    if (scanning) return;
    scanning = true;
    await Promise.race([syncMax(), sleep(8e3)]);
    const catSel = el5.querySelector("#s-cat").value;
    const filters = {
      cat: CAT_TAG[catSel] ?? catSel,
      nameOk: CAT_NAME[catSel] || null,
      q: el5.querySelector("#s-q").value.trim(),
      min: parsePrice(el5.querySelector("#s-min").value) || 0,
      max: parsePrice(el5.querySelector("#s-max").value) || Infinity,
      minListings: +el5.querySelector("#s-list").value || 0,
      // flip scan with "korzystaj z zapamiętanych danych" unticked: everything is asked from Steam again
      fresh: goalNow() === "flip" && !el5.querySelector("#s-skip").checked
    };
    scanning = true;
    task5 = token();
    el5.querySelector('[data-a="stop"]').hidden = false;
    try {
      if (goalNow() === "flip") await scanFind(filters);
      else {
        const n = Math.max(1, Math.min(300, +el5.querySelector("#s-n").value || 40));
        log(L("flip.scannerDownloadingTheListOf"));
        findState = null;
        scanSet = /* @__PURE__ */ new Set();
        renderScan();
        const list2 = [];
        const end = await eachCandidate(filters, (c) => {
          if (!hidden.get(c.hash)) list2.push(c);
          return list2.length < n;
        });
        if (end === "stall") log(L("flip.scannerSteamStoppedReturningThe"), "warn");
        if (end === "cancel") log(L("flip.scannerStopped"), "warn");
        else {
          findState = null;
          scanSet = new Set(list2.map((c) => c.hash));
          log(L("flip.scannerCheckingItemsInThe", { list: list2.length, min: Math.max(1, Math.ceil(list2.length / 60)) }));
          renderScan();
          await runMetrics(list2, "#s-table", false);
          renderScan();
          log(L("flip.scannerFinished"), "ok");
        }
      }
    } catch (e) {
      log(L("flip.scanner") + e.message, "err");
    }
    scanning = false;
    saveRows(true);
    progress(0);
    el5.querySelector('[data-a="stop"]').hidden = true;
  }
  async function scanFind(filters) {
    const raw = el5.querySelector("#s-find").value.trim();
    const want = +raw > 0 ? Math.floor(+raw) : Infinity;
    set("flipFind", want === Infinity ? "" : String(want));
    const of = want === Infinity ? "" : ` ${L("flip.of3")} ${want}`;
    const useSeen = el5.querySelector("#s-skip").checked;
    set("flipSkipSeen", useSeen);
    scanSet = /* @__PURE__ */ new Set();
    const st = findState = { want, checked: 0, found: 0, risky: 0, failed: 0, quick: 0, skipped: 0, state: "run", walk: {} };
    st.walk.stop = () => st.found >= want;
    renderScan();
    log(want === Infinity ? L("flip.scannerSearchingForFlipPossible") : L("flip.scannerSearchingForFlipPossible2", { want }));
    const seen = loadSeen();
    let lastRender = 0, dirty = 0, limit = null;
    const draw = (force) => {
      if (force || Date.now() - lastRender > 1e3) {
        lastRender = Date.now();
        renderScan();
      }
    };
    const remember = (hash, e) => {
      seen[hash] = { at: Date.now(), ...e };
      if (++dirty >= 100) {
        dirty = 0;
        saveSeen(seen);
      }
    };
    const judge = (hash, row) => {
      if (findState !== st) return;
      st.checked++;
      const k = flipVerdict(row).k;
      if (k === "ok") {
        st.found++;
        scanSet.add(hash);
        log(L("flip.scannerFound", { hash, found: st.found, want: want === Infinity ? "" : "/" + want }), "ok");
      } else if (k === "risk") {
        st.risky++;
        scanSet.add(hash);
      }
      if (k === "ok" || k === "risk") saveRows();
      else remember(hash, { k: "no", r: settings.minRoi, v: settings.minVolume });
      draw(k === "ok");
    };
    const pending = /* @__PURE__ */ new Set();
    let end = "end";
    try {
      end = await eachCandidate(filters, async ({ hash, appid }, { pos, total }) => {
        if (limit) throw limit;
        if (st.found >= want) return false;
        progress(pos, total);
        if (hidden.get(hash)) return true;
        try {
          const row = results.get(hash);
          if (useSeen && row && row.fr && Date.now() - row.at < FRESH) {
            judge(hash, row);
            return st.found < want;
          }
          if (useSeen && seenValid(seen[hash])) {
            st.checked++;
            st.skipped++;
            draw();
            return true;
          }
          let q = useSeen ? quick.get(hash) : null;
          if (!q || Date.now() - q.at > FRESH) {
            const h0 = await hist(appid, hash, useSeen ? 5 * 6e4 : 0);
            q = { at: Date.now(), max: flipCeiling({ buyGraph: h0.buyGraph, sellGraph: h0.sellGraph, net: net2 }) };
            quick.set(hash, q);
          }
          if (!(q.max != null && q.max > 0 && q.max >= settings.minRoi)) {
            st.checked++;
            st.quick++;
            remember(hash, { k: "q", max: q.max ?? -1 });
            draw();
            return true;
          }
          while (pending.size >= 6) await Promise.race(pending);
          const p = (async () => {
            const [h, hist3] = await Promise.all([
              hist(appid, hash, 5 * 6e4),
              priceHistory(appid, hash, { force: !useSeen }).catch((e) => {
                if (e.status === 429) throw e;
                return null;
              })
            ]);
            const r = metricsRow(hash, appid, h, null, hist3 ? historyStats(hist3) : null, hist3);
            results.set(hash, r);
            judge(hash, r);
          })().catch((e) => {
            if (e.status === 429) limit = e;
            else {
              st.checked++;
              st.failed++;
            }
          }).finally(() => pending.delete(p));
          pending.add(p);
        } catch (e) {
          if (e.status === 429) throw e;
          st.checked++;
          st.failed++;
        }
        return st.found < want;
      }, st.walk);
    } catch (e) {
      await Promise.all(pending);
      saveSeen(seen);
      if (e.status !== 429) {
        st.state = "error";
        renderScan();
        throw e;
      }
      end = "limit";
    }
    await Promise.all(pending);
    if (limit) end = "limit";
    saveSeen(seen);
    st.state = end;
    const where = st.walk.total ? L("flip.steamsListForThisCategory", { pos: st.walk.pos, total: st.walk.total }) : "";
    renderScan();
    const sum = L("flip.checkedFound", { checked: st.checked, found: st.found, of });
    if (end === "stop") log(L("flip.scannerFinished2", { sum }), "ok");
    else if (end === "end") log(L("flip.scannerEndOfTheList", { sum, where }), st.found ? "ok" : "warn");
    else if (end === "stall") log(L("flip.scannerSteamStoppedReturningThe2", { sum, where }), "warn");
    else if (end === "limit") log(L("flip.scannerSteamIsLimitingRequests", { sum }), "warn");
    else log(L("flip.scannerStoppedScanResumesWhere", { sum }), want === Infinity ? "ok" : "warn");
  }
  async function exportResearch2() {
    if (scanning) return;
    const shown3 = [...new Set([...el5.querySelectorAll("section[data-s]:not([hidden]) [data-an], section[data-s]:not([hidden]) #f-out [data-w]")].map((b) => b.dataset.an || b.dataset.w).filter(Boolean))];
    const list2 = (shown3.length ? shown3 : [...new Set(RESEARCH_ITEMS)]).map((hash) => ({ hash, appid: 730 }));
    await exportResearch(list2, shown3.length ? L("flip.shownOnTheListRight") : L("flip.fromTheFixedSampleOf"), { onBusy: (b) => el5.querySelector('[data-a="stop"]').hidden = !b });
  }

  // src/features/cases.js
  var ODDS = { mil: 0.7992, res: 0.1598, cla: 0.032, cov: 64e-4, gold: 26e-4 };
  var TIER_NAME = { mil: L("cases.milSpecBlue"), res: L("cases.restrictedPurple"), cla: L("cases.classifiedPink"), cov: L("cases.covertRed"), gold: L("cases.knifeGloves") };
  var TIER_COLOR = { mil: "4b69ff", res: "8847ff", cla: "d32ce6", cov: "eb4b4b", gold: "caab05" };
  var WEAR_P = { "Factory New": 0.03, "Minimal Wear": 0.24, "Field-Tested": 0.33, "Well-Worn": 0.24, "Battle-Scarred": 0.16 };
  var ST_P = 0.1;
  var CAP_W = { mil: 79.92, res: 15.98, cla: 3.2, cov: 0.64 };
  var CAP_NAME = { mil: L("cases.highGradeNormal"), res: L("cases.remarkableHoloGlitterEmbroidered"), cla: "Exotic (foil / holo)", cov: L("cases.extraordinaryGold") };
  var kindSel = () => el6?.querySelector("#k-kind")?.value || "case";
  var TTL2 = 6 * 36e5;
  var EV_TTL = 24 * 36e5;
  var cache3 = bucket("caseEV2");
  var el6;
  var task6 = null;
  var list = [];
  var sort4 = sorter("res");
  var fullScan = false;
  var allGold = /* @__PURE__ */ new Set();
  var open3 = null;
  var search = (params) => cached(`q|/market/search/render/?norender=1&appid=730&l=english&${params}`, ttl(), () => schedule("search", async () => {
    const r = await fetch(`${ORIGIN}/market/search/render/?norender=1&appid=730&l=english&${params}`, { credentials: "include" });
    if (r.status === 429) throw new HttpError(429, L("cases.steamTooManyRequests429"));
    if (!r.ok) throw new HttpError(r.status);
    return slimSearch(await r.json());
  }), (d) => d?.results?.length > 0);
  async function searchAll(params, max = 600) {
    const out = [];
    for (let start = 0; start < max; ) {
      const d = await search(`${params}&start=${start}&count=100`);
      const res = d.results || [];
      out.push(...res);
      if (!res.length || out.length >= (d.total_count || 0)) break;
      start += res.length;
    }
    return out;
  }
  var SPECIAL = { "CS:GO Weapon Case": "The Arms Deal Collection", "CS:GO Weapon Case 2": "The Arms Deal 2 Collection", "CS:GO Weapon Case 3": "The Arms Deal 3 Collection", "Revolver Case": "The Revolver Case Collection" };
  function setNames(caseName) {
    if (SPECIAL[caseName]) return [SPECIAL[caseName]];
    const base = caseName.replace(/\s+(Weapon\s+)?Case$/i, "");
    return [.../* @__PURE__ */ new Set([base, base.replace(/^Operation\s+/i, "")])].map((b) => `The ${b} Collection`);
  }
  var setTags = null;
  async function loadSetTags() {
    if (setTags) return setTags;
    const saved = get("caseSetTags", null);
    if (saved && Date.now() - saved.at < 7 * 864e5) return setTags = new Map(saved.tags);
    const d = await schedule("market", () => fetch(`${ORIGIN}/market/appfilters/730?l=english`, { credentials: "include" }).then((r) => r.json()));
    const tags = Object.entries(d.facets?.["730_ItemSet"]?.tags || {}).map(([k, v]) => [String(v.localized_name).toLowerCase(), k]);
    set("caseSetTags", { at: Date.now(), tags });
    return setTags = new Map(tags);
  }
  var usdRate = null;
  async function refreshRate(cases2) {
    const rs = [];
    for (const c of cases2.filter((x) => x.priceUsd > 0).slice(0, 3)) {
      const local = (await steamPrice(730, c.hash).catch(() => null))?.lowest;
      if (local) rs.push(local / c.priceUsd);
    }
    if (rs.length) usdRate = rs.sort((a, b) => a - b)[Math.floor(rs.length / 2)];
    return usdRate;
  }
  async function loadCases() {
    const res = await searchAll("category_730_Type%5B%5D=tag_CSGO_Type_WeaponCase&sort_column=popular&sort_dir=desc", 1e3);
    const tags = await loadSetTags();
    const db = await load().catch(() => null);
    list = res.filter((r) => /Case$/.test(r.hash_name) && !/souvenir|terminal/i.test(r.hash_name) || db?.caps?.[r.hash_name]).map((r) => {
      const cap = !!db?.caps?.[r.hash_name] && !/Case$/.test(r.hash_name);
      const set2 = cap ? null : setNames(r.hash_name).map((n) => tags.get(n.toLowerCase())).find(Boolean) || null;
      return { hash: r.hash_name, name: r.name, icon: r.asset_description?.icon_url, color: r.asset_description?.name_color, priceUsd: r.sell_price, listings: r.sell_listings, set: set2, kind: cap ? "capsule" : "case" };
    });
    await refreshRate(list);
    set("caseList", { at: Date.now(), list, usdRate });
  }
  var COLOR_TIER = { "4b69ff": "mil", "8847ff": "res", "d32ce6": "cla", "eb4b4b": "cov" };
  var tierOf = (hash = "", color = "", type = "") => /★/.test(hash) || /★/.test(type) ? "gold" : COLOR_TIER[String(color).toLowerCase()] || (/Covert/i.test(type) ? "cov" : /Classified/i.test(type) ? "cla" : /Restricted/i.test(type) ? "res" : /Mil-Spec/i.test(type) ? "mil" : null);
  var parseHash = (h) => {
    const st = /StatTrak™/.test(h);
    const wear = h.match(/\((Factory New|Minimal Wear|Field-Tested|Well-Worn|Battle-Scarred)\)\s*$/)?.[1] || null;
    const base = h.replace(/^(★\s*)?(StatTrak™\s*)?/, "").replace(/\s*\((Factory New|Minimal Wear|Field-Tested|Well-Worn|Battle-Scarred)\)\s*$/, "").trim();
    return { st, wear, base };
  };
  var net3 = (p) => receivedFromBuyer2(p);
  var qCache = bucket("caseQ");
  async function searchCached(params, max) {
    const hit = qCache.get(params);
    if (hit && Date.now() - hit.at < EV_TTL) return hit.res;
    const res = (await searchAll(params, max)).map((r) => ({ hash_name: r.hash_name, sell_price: r.sell_price, sell_listings: r.sell_listings, asset_description: { name_color: r.asset_description?.name_color, icon_url: r.asset_description?.icon_url, type: r.asset_description?.type } }));
    qCache.set(params, { at: Date.now(), res });
    return res;
  }
  function skinValue(variants, st, range) {
    const v = variants.filter((x) => x.st === st && x.price > 0);
    if (!v.length) return null;
    if (v.length === 1 && !v[0].wear) return { ev: net3(v[0].price), outcomes: [{ p: 1, value: net3(v[0].price), hash: v[0].hash }] };
    const wp = range ? wearProbs(range) : WEAR_P;
    const w = v.map((x) => ({ ...x, w: wp[x.wear] || 0 })).filter((x) => x.w > 0);
    const sum = w.reduce((s, x) => s + x.w, 0);
    if (!sum) return null;
    const outcomes = w.map((x) => ({ p: x.w / sum, value: net3(x.price), hash: x.hash }));
    return { ev: outcomes.reduce((s, o) => s + o.p * o.value, 0), outcomes };
  }
  function commonEvent(names) {
    const ev = names.map((n) => n.includes(" | ") ? n.slice(n.lastIndexOf(" | ") + 3) : null);
    return ev[0] && ev.every((x) => x === ev[0]) ? ev[0] : null;
  }
  async function computeCapsule(c, def) {
    const rate = usdRate || get("caseList", {}).usdRate;
    if (!rate) throw new Error(L("cases.noUsdRate"));
    const pre = def.kind === "Patch" ? "Patch | " : "Sticker | ";
    const found = new Map(def.items.map(([n]) => [pre + n, null]));
    const ev = commonEvent(def.items.map(([n]) => n));
    if (ev) {
      const res = await searchCached(`category_730_Type%5B%5D=${def.kind === "Patch" ? "tag_CSGO_Tool_Patch" : "tag_CSGO_Tool_Sticker"}&query=${encodeURIComponent(ev)}&search_descriptions=0&sort_column=name&sort_dir=asc`, 2e3);
      for (const r2 of res) if (found.has(r2.hash_name)) found.set(r2.hash_name, r2);
    }
    for (const [h, v] of found) {
      if (v || task6?.cancelled) continue;
      const r2 = (await searchCached(`query=${encodeURIComponent(h)}&search_descriptions=0`, 10)).find((x) => x.hash_name === h);
      if (r2) found.set(h, r2);
    }
    const present = [...new Set(def.items.map(([, t]) => t))];
    const W = present.reduce((s, t) => s + CAP_W[t], 0);
    const odds = Object.fromEntries(present.map((t) => [t, CAP_W[t] / W]));
    const tiers = {}, outcomes = [];
    for (const t of present) {
      const per = [];
      let unpriced = 0;
      for (const [n] of def.items.filter(([, tt]) => tt === t)) {
        const r2 = found.get(pre + n);
        const price = r2?.sell_price > 0 ? Math.round(r2.sell_price * rate) : 0;
        if (!price) {
          unpriced++;
          continue;
        }
        const v = net3(price);
        per.push({ base: n, color: r2.asset_description?.name_color, ev: v, n: { ev: v }, t: null, hash: pre + n });
      }
      if (!per.length) continue;
      for (const s of per) outcomes.push({ p: odds[t] / per.length, value: s.ev, hash: s.hash, tier: t });
      tiers[t] = { p: odds[t], unpriced, skins: per.sort((a, b) => b.ev - a.ev).map((x) => ({ base: x.base, color: x.color, ev: x.ev, n: x.n, t: null })), ev: per.reduce((s, x) => s + x.ev, 0) / per.length };
    }
    if (!Object.keys(tiers).length) throw new Error(L("cases.couldntFindStickerPricesFor"));
    const casePrice = Math.round(c.priceUsd * rate);
    const cost = casePrice;
    const covered = Object.keys(tiers).reduce((s, k) => s + odds[k], 0);
    const evv = Object.entries(tiers).reduce((s, [k, x]) => s + odds[k] * x.ev, 0);
    const pOk = outcomes.filter((o) => o.value >= cost).reduce((s, o) => s + o.p, 0);
    const tail = [];
    for (let i = 0; i <= 32; i++) {
      const x = Math.round(cost * 16 ** (i / 32 - 0.5));
      tail.push([x, Math.round(outcomes.filter((o) => o.value >= x).reduce((q, o) => q + o.p, 0) * 1e5) / 1e5]);
    }
    const top = [...outcomes].sort((a, b) => b.value - a.value)[0];
    const r = { hash: c.hash, at: Date.now(), v: 4, kind: "capsule", exact: true, casePrice, keyCost: 0, cost, ev: evv, roi: cost ? evv / cost - 1 : null, pOk, tail, covered, odds, tiers, best: top ? { hash: top.hash, value: top.value } : null, nItems: def.items.length };
    cache3.set(c.hash, r);
    return r;
  }
  async function computeCase(c, keyCost2) {
    const rate = usdRate || get("caseList", {}).usdRate;
    if (!rate) throw new Error(L("cases.noUsdRate"));
    const db = await load().catch((e) => {
      log(L("cases.cases") + e.message, "warn");
      return null;
    });
    const def = db?.cases[c.hash];
    if (!def && !c.set) throw new Error(L("cases.caseContentsNotFound"));
    const found = c.set ? await searchCached(`category_730_ItemSet%5B%5D=tag_${c.set}`, 1500) : [];
    const variantsOf = /* @__PURE__ */ new Map();
    const tierFromMarket = /* @__PURE__ */ new Map();
    const iconOf = /* @__PURE__ */ new Map(), colorOf = /* @__PURE__ */ new Map();
    const add = (r2) => {
      if (/souvenir/i.test(r2.hash_name)) return;
      const { st, wear, base } = parseHash(r2.hash_name);
      const arr = variantsOf.get(base) || variantsOf.set(base, []).get(base);
      if (arr.some((x) => x.hash === r2.hash_name)) return;
      arr.push({ hash: r2.hash_name, st, wear, price: r2.sell_price > 0 ? Math.round(r2.sell_price * rate) : 0, listings: r2.sell_listings });
      const t = tierOf(r2.hash_name, r2.asset_description?.name_color, r2.asset_description?.type || "");
      if (t && !tierFromMarket.has(base)) tierFromMarket.set(base, t);
      if (!st && r2.asset_description?.name_color && !colorOf.has(base)) colorOf.set(base, r2.asset_description.name_color);
      if (!iconOf.has(base)) iconOf.set(base, r2.asset_description?.icon_url);
    };
    found.forEach(add);
    let skinList;
    if (def) {
      const strip = (n) => n.replace(/^★\s*/, "");
      const missingRare = def.rare.filter((n) => !variantsOf.has(strip(n)));
      for (const n of missingRare) {
        if (task6?.cancelled) break;
        const base = strip(n);
        if (base.includes("|")) {
          (await searchCached(`query=${encodeURIComponent(base)}&search_descriptions=0`, 20)).filter((r2) => r2.hash_name.startsWith("\u2605") && parseHash(r2.hash_name).base === base).forEach(add);
        } else {
          for (const h of [`\u2605 ${base}`, `\u2605 StatTrak\u2122 ${base}`]) {
            const p = await steamPrice(730, h).catch(() => null);
            if (p?.lowest) add({ hash_name: h, sell_price: p.lowest / rate, sell_listings: p.volume || 1, asset_description: {} });
          }
        }
      }
      skinList = [...def.items.map(([n, t]) => ({ base: strip(n), tier: t, range: db.floats[n] })), ...def.rare.map((n) => ({ base: strip(n), tier: "gold", range: db.floats[n] }))];
    } else {
      skinList = [...variantsOf.keys()].filter((b) => tierFromMarket.get(b) && !/case$/i.test(b)).map((b) => ({ base: b, tier: tierFromMarket.get(b), range: null }));
    }
    const tiers = {};
    const outcomes = [];
    for (const [tier, p] of Object.entries(ODDS)) {
      const ss = skinList.filter((s) => s.tier === tier);
      if (!ss.length) continue;
      const per = [];
      let unpriced = 0;
      for (const s of ss) {
        const vars = variantsOf.get(s.base) || [];
        const n = skinValue(vars, false, s.range), t = skinValue(vars, true, s.range);
        if (!n && !t) {
          unpriced++;
          continue;
        }
        const stShare = !t ? 0 : !n ? 1 : ST_P;
        const ev2 = (n ? n.ev * (1 - stShare) : 0) + (t ? t.ev * stShare : 0);
        per.push({ ...s, color: colorOf.get(s.base), ev: ev2, n, t, stShare });
      }
      if (!per.length) continue;
      for (const s of per) {
        const ps = p / per.length;
        for (const o of s.n?.outcomes || []) outcomes.push({ p: ps * (1 - s.stShare) * o.p, value: o.value, hash: o.hash, tier });
        for (const o of s.t?.outcomes || []) outcomes.push({ p: ps * s.stShare * o.p, value: o.value, hash: o.hash, tier });
      }
      tiers[tier] = { p, unpriced, skins: per.sort((a, b) => b.ev - a.ev).map((x) => ({ base: x.base, color: x.color, ev: x.ev, n: x.n && { ev: x.n.ev }, t: x.t && { ev: x.t.ev } })), ev: per.reduce((s, x) => s + x.ev, 0) / per.length };
    }
    if (!Object.keys(tiers).length) throw new Error(L("cases.contentsNotRecognisedSearchResults", { found: found.length }));
    const casePrice = Math.round(c.priceUsd * rate);
    const cost = casePrice + keyCost2;
    const covered = Object.keys(tiers).reduce((s, k) => s + ODDS[k], 0);
    const ev = Object.entries(tiers).reduce((s, [k, t]) => s + ODDS[k] * t.ev, 0);
    const pOk = outcomes.filter((o) => o.value >= cost).reduce((s, o) => s + o.p, 0);
    const tail = [];
    for (let i = 0; i <= 32; i++) {
      const x = Math.round(cost * 16 ** (i / 32 - 0.5));
      tail.push([x, Math.round(outcomes.filter((o) => o.value >= x).reduce((q, o) => q + o.p, 0) * 1e5) / 1e5]);
    }
    const top = [...outcomes].sort((a, b) => b.value - a.value)[0];
    const r = { hash: c.hash, at: Date.now(), v: 4, exact: !!def, casePrice, keyCost: keyCost2, cost, ev, roi: cost ? ev / cost - 1 : null, pOk, tail, covered, tiers, best: top ? { hash: top.hash, value: top.value } : null, nItems: found.length };
    cache3.set(c.hash, r);
    return r;
  }
  function keyCost() {
    const near = nearestKeyPrice(Date.now(), "PLN");
    if (near && Date.now() - near.t < 400 * 864e5) return { price: near.price, src: L("cases.likeYourLastKey", { t: new Date(near.t).toLocaleDateString() }) };
    const rate = usdRate || get("caseList", {}).usdRate;
    return { price: rate ? Math.round(249 * rate) : 0, src: L("cases.249UsdAtThe") };
  }
  function mount6(root2) {
    el6 = root2;
    const saved = get("caseList", null);
    if (saved) {
      list = saved.list || [];
      usdRate = saved.usdRate || null;
    }
    root2.innerHTML = `
    <div class="bar">
      <button class="b g" data-a="scan">\u27F3 ${L("cases.recalculateCases")}</button>
      <button class="b" data-a="stop" hidden>\u25A0 Stop</button>
      <select id="k-kind" title="${L("cases.whatToShowAndRecalculate")}"><option value="case">${L("cases.cases2")}</option><option value="cap">${L("cases.stickerCapsules")}</option><option value="all">${L("cases.casesAndCapsules")}</option></select>
      <label class="tgl" title="${L("cases.skipsCasesAndCapsulesWith")}"><input type="checkbox" id="k-liq" checked><span class="tr"></span>${L("cases.hideRarelySold100Listings")}</label>
      <label class="tgl" title="${L("cases.countEveryCaseAndCapsule")}"><input type="checkbox" id="k-ownall" ${get("caseOwnAll", false) ? "checked" : ""}><span class="tr"></span>${L("cases.iAlreadyHaveThemAll")}</label>
      <span class="sp"></span><span class="sub" id="k-info"></span>
    </div>
    <div class="cards" id="k-cards"></div>
    <details class="note"><summary>${L("cases.howIsThisCalculated")}</summary>${L("cases.evIsTheAverageValue")}</details>
    <table id="k-tbl"><thead><tr>
      <th data-sort="name">${L("cases.case")}</th><th data-sort="res" title="${L("cases.theAverageResultOfOne")}">${L("cases.lossPerOpening")}</th><th data-sort="cost">${L("cases.openingCost")}</th><th data-sort="ev">EV</th>
      <th data-sort="pOk">${L("cases.chanceToBreakEven")}</th><th data-sort="best">${L("cases.bestDrop")}</th><th data-sort="case">${L("cases.casePrice")}</th><th data-sort="listings">${L("cases.listings")}</th><th></th>
    </tr></thead><tbody></tbody></table>`;
    root2.addEventListener("click", (e) => {
      const th = e.target.closest("th[data-sort]");
      if (th) {
        sort4.click(th.dataset.sort);
        render5();
        return;
      }
      const a = e.target.closest("button")?.dataset.a;
      if (a === "scan") return scan2();
      if (a === "stop") return task6?.cancel();
      if (a === "more") {
        const h = e.target.closest("button").dataset.hash;
        allGold.has(h) ? allGold.delete(h) : allGold.add(h);
        return render5();
      }
      if (a === "one") return scan2([e.target.closest("button").dataset.hash]);
      const tr = e.target.closest("tr[data-hash]");
      if (tr && !e.target.closest("a, button, label, input")) {
        open3 = open3 === tr.dataset.hash ? null : tr.dataset.hash;
        render5();
      }
    });
    del("caseKeyManual");
    recalcKey();
    root2.querySelector("#k-liq").onchange = render5;
    root2.querySelector("#k-kind").value = get("caseKind", "case");
    root2.querySelector("#k-kind").onchange = (e) => {
      set("caseKind", e.target.value);
      render5();
    };
    root2.querySelector("#k-ownall").onchange = (e) => {
      set("caseOwnAll", e.target.checked);
      set("caseOwned", {});
      render5();
    };
    root2.addEventListener("change", (e) => {
      const h = e.target.dataset.own;
      if (h == null) return;
      set("caseOwned", { ...get("caseOwned", {}), [h]: e.target.checked });
      render5();
    });
    render5();
  }
  function show7() {
    render5();
  }
  function recalcKey() {
    const k = keyCost().price;
    for (const c of list) {
      const r = cache3.get(c.hash);
      if (!r) continue;
      const rate = usdRate || get("caseList", {}).usdRate;
      if (rate && c.priceUsd > 0) r.casePrice = Math.round(c.priceUsd * rate);
      r.keyCost = r.kind === "capsule" ? 0 : k;
      r.cost = r.casePrice + r.keyCost;
      r.roi = r.cost ? r.ev / r.cost - 1 : null;
      cache3.set(c.hash, r);
    }
  }
  async function scan2(only) {
    if (task6) return;
    task6 = token();
    el6.querySelector('[data-a="stop"]').hidden = false;
    try {
      if (!list.length || list.some((c) => !c.kind) || Date.now() - (get("caseList", {}).at || 0) > TTL2) {
        log(L("cases.casesLoadingTheCaseList"));
        await loadCases();
        recalcKey();
      }
      const k = keyCost();
      const db = await load().catch(() => null);
      const liq = el6.querySelector("#k-liq").checked;
      fullScan = !only;
      const kind2 = kindSel();
      const want = (c) => kind2 === "all" || kind2 === "cap" === (c.kind === "capsule");
      if (!only) {
        const keep = Object.fromEntries(Object.entries(cache3.all()).filter(([h]) => {
          const c = list.find((x) => x.hash === h);
          return c && !want(c);
        }));
        cache3.replace(keep);
        qCache.replace({});
        render5();
      }
      const stale2 = (c) => {
        const r = cache3.get(c.hash);
        return !r || r.v !== 4 || Date.now() - r.at > EV_TTL;
      };
      const todo = list.filter((c) => (only ? only.includes(c.hash) : want(c) && (!liq || c.listings >= 100) && stale2(c)) && (c.kind === "capsule" ? db?.caps?.[c.hash] : c.set || db?.cases[c.hash]));
      log(L("cases.casesCalculatingKey", { todo: todo.length, price: fmt(k.price), src: k.src, kind: kind2 === "cap" ? L("cases.capsules") : kind2 === "all" ? L("cases.casesAndCapsules2") : L("cases.cases3") }));
      let i = 0;
      const tStart = Date.now();
      for (const c of todo) {
        if (task6.cancelled) break;
        progress(i++, todo.length);
        const left = i > 1 ? Math.round((Date.now() - tStart) / (i - 1) * (todo.length - i + 1) / 6e4) : null;
        el6.querySelector("#k-info").textContent = L("cases.calculatingResultsShowUpAs", { name: c.name, i, todo: todo.length, left: left != null ? L("cases.aboutMinLeft", { left: left || "<1" }) : "" });
        try {
          await (c.kind === "capsule" ? computeCapsule(c, db.caps[c.hash]) : computeCase(c, k.price));
        } catch (e) {
          log(L("cases.cases4", { name: c.name, message: e.message }), "warn");
        }
        render5();
      }
      const miss = list.filter((c) => c.kind !== "capsule" && !c.set && !db?.cases[c.hash]);
      if (miss.length) console.warn("[Flipster] skrzynie bez rozpoznanej kolekcji (pomini\u0119te)", miss.map((c) => c.hash));
      log(L("cases.casesDone"), "ok");
    } catch (e) {
      log(L("cases.cases") + e.message, "err");
    }
    progress(0);
    task6 = null;
    fullScan = false;
    el6.querySelector('[data-a="stop"]').hidden = true;
    render5();
  }
  function owns(hash) {
    const t = get("caseOwned", {})[hash];
    if (t != null) return t;
    return get("caseOwnAll", false) || (ownedCount(hash) || 0) > 0;
  }
  function costOf2(r) {
    return (owns(r.hash) ? net3(r.casePrice) : r.casePrice) + r.keyCost;
  }
  var resOf = (r) => r.ev - costOf2(r);
  function pOkOf(r) {
    const c = costOf2(r), t = r.tail;
    if (!t?.length || c < t[0][0] || c > t[t.length - 1][0]) return r.pOk;
    for (let i = 1; i < t.length; i++) if (c <= t[i][0]) {
      const [x0, p0] = t[i - 1], [x1, p1] = t[i];
      return x1 === x0 ? p1 : p0 + (p1 - p0) * (c - x0) / (x1 - x0);
    }
    return r.pOk;
  }
  function render5() {
    if (!el6) return;
    const liq = el6.querySelector("#k-liq").checked;
    const k = keyCost();
    const kind2 = kindSel();
    const rows3 = list.filter((c) => (kind2 === "all" || kind2 === "cap" === (c.kind === "capsule")) && (!liq || c.listings >= 100)).map((c) => ({ c, r: cache3.get(c.hash) })).filter((x) => x.r || !fullScan);
    const done = rows3.filter((x) => x.r);
    el6.querySelector("#k-info").textContent = task6 ? el6.querySelector("#k-info").textContent : list.length ? L("cases.casesCalculatedKey", { done: done.length, rows: rows3.length, price: fmt(k.price), src: k.src, done2: done.length ? L("cases.dataFrom", { done: timeAgo(Math.min(...done.map((x) => x.r.at))) }) : "" }) : L("cases.clickRecalculateCases");
    const leastZl = [...done].sort((a, b) => resOf(b.r) - resOf(a.r))[0];
    const leastPct = [...done].sort((a, b) => b.r.ev / costOf2(b.r) - a.r.ev / costOf2(a.r))[0];
    const safest = [...done].sort((a, b) => pOkOf(b.r) - pOkOf(a.r))[0];
    const lossVal = (r) => {
      const v = resOf(r);
      return `${v >= 0 ? "+" : "\u2212"}${fmt(Math.round(Math.abs(v)))}`;
    };
    const lossCls = (r) => resOf(r) >= 0 ? "pos" : "neg";
    const nameLine = (x) => `<div style="color:#fff;font-size:13px;margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${esc(x.c.name)}">${esc(x.c.name)}</div>`;
    el6.querySelector("#k-cards").innerHTML = done.length ? `
    <div class="card" style="border-color:var(--acc);grid-column:span 2" title="${L("cases.whatOneOpeningOfThis")}"><div class="k">${L("cases.smallestLossPerOpening")}</div><div class="v ${lossCls(leastZl.r)}" style="font-size:26px;font-weight:700">${lossVal(leastZl.r)}</div>${nameLine(leastZl)}<div class="sub">${L("cases.openingCost2")} ${fmt(costOf2(leastZl.r))} \xB7 ${L("cases.returnsOnAverage")} ${pct(leastZl.r.ev / costOf2(leastZl.r), 0)}</div></div>
    <div class="card" title="${L("cases.thisCaseReturnsTheBiggest")}"><div class="k">${L("cases.returnsTheMost")}</div><div class="v">${pct(leastPct.r.ev / costOf2(leastPct.r), 0)}</div>${nameLine(leastPct)}<div class="sub"><span class="${lossCls(leastPct.r)}">${lossVal(leastPct.r)}</span> ${L("cases.perOpeningCost")} ${fmt(costOf2(leastPct.r))}</div></div>
    <div class="card" title="${L("cases.howOftenADropIs")}"><div class="k">${L("cases.bestChanceToBreakEven")}</div><div class="v">${pct(pOkOf(safest.r), 1)}</div>${nameLine(safest)}<div class="sub">${L("cases.ofOpeningsGiveADrop")} \u2265 ${fmt(costOf2(safest.r))}</div></div>` : "";
    const sorted = sort4.apply(rows3, {
      name: (x) => x.c.name,
      case: (x) => x.r?.casePrice ?? x.c.priceUsd,
      cost: (x) => x.r ? costOf2(x.r) : null,
      ev: (x) => x.r?.ev,
      res: (x) => x.r ? resOf(x.r) : null,
      pOk: (x) => x.r ? pOkOf(x.r) : null,
      best: (x) => x.r?.best?.value,
      listings: (x) => x.c.listings
    });
    el6.querySelector("#k-tbl tbody").innerHTML = sorted.map(({ c, r }) => {
      const main2 = `<tr data-hash="${esc(c.hash)}" style="cursor:pointer">
      <td>${itemCell({ hash: c.hash, name: c.name, icon: c.icon, color: c.color, appid: 730, sub: c.set || c.kind === "capsule" || r ? "" : L("cases.collectionNotRecognised") })}</td>
      <td class="${r ? resOf(r) >= 0 ? "pos" : "neg" : ""}">${r ? `<b style="font-size:15px">${resOf(r) >= 0 ? "+" : "\u2212"}${fmt(Math.round(Math.abs(resOf(r))))}</b><div class="sub">${L("cases.returns")} ${pct(r.ev / costOf2(r), 0)} ${L("cases.ofTheCost")}</div>` : '<span class="sub">\u2026</span>'}</td>
      <td>${r ? `${fmt(costOf2(r))}<div class="sub">${r.kind === "capsule" ? owns(c.hash) ? L("cases.capsuleAfterTheFeeNo") : L("cases.noKey") : owns(c.hash) ? L("cases.keyCaseAfterTheFee", { keyCost: fmt(r.keyCost) }) : L("cases.key", { keyCost: fmt(r.keyCost) })}</div><label class="sub" style="display:inline-flex;gap:4px;align-items:center;cursor:pointer;margin-top:2px" title="${L("cases.youHaveThisCaseSo")}"><input type="checkbox" data-own="${esc(c.hash)}" ${owns(c.hash) ? "checked" : ""}> ${L("cases.iHaveIt")}${ownedCount(c.hash) ? ` (${ownedCount(c.hash)} ${L("cases.inInventory")})` : ""}</label>` : ""}</td>
      <td>${r ? fmt(Math.round(r.ev)) + (r.covered < 0.999 || r.v !== 4 ? ` <span class="warn" title="${r.v !== 4 ? L("cases.calculatedTheOldWayClick") : L("cases.noPricesForSomeRarities", { covered: pct(1 - r.covered, 2) })}">!</span>` : "") : ""}</td>
      <td>${r ? pct(pOkOf(r), 1) : ""}</td>
      <td>${r?.best ? `<span class="sub">${esc(r.best.hash)}</span><div>${fmt(r.best.value)}</div>` : ""}</td>
      <td>${r ? fmt(r.casePrice) : ""}</td>
      <td>${c.listings ?? ""}</td>
      <td style="text-align:right;width:1%">${!r || r.v !== 4 ? `<button class="b" data-a="one" data-hash="${esc(c.hash)}" title="${L("cases.calculateOnlyThisCase")}" style="white-space:nowrap">\u27F3 ${L("cases.calculate")}</button>` : ""}</td></tr>`;
      if (open3 !== c.hash || !r) return main2;
      const det = Object.entries(r.tiers).map(([t, x]) => `
      <div style="margin:6px 0 2px"><b style="color:#${TIER_COLOR[t]}">${(r.kind === "capsule" ? CAP_NAME : TIER_NAME)[t]}</b> <span class="sub">${L("cases.chance")} ${pct((r.odds || ODDS)[t], 2)} \xB7 ${L("cases.average")} ${fmt(Math.round(x.ev))} \xB7 ${L("cases.shareOfEv")} ${fmt(Math.round((r.odds || ODDS)[t] * x.ev))}</span></div>
      ${x.skins.slice(0, t === "gold" && !allGold.has(c.hash) ? 12 : 999).map((s) => `<span class="tag" style="margin:2px" title="${esc(r.kind === "capsule" ? L("cases.youGetAfterSelling", { ev: fmt(Math.round(s.ev)) }) : L("cases.normalStattrakAfterTheFee", { n: s.n ? fmt(Math.round(s.n.ev)) : "-", t: s.t ? fmt(Math.round(s.t.ev)) : "-" }))}"><span style="color:#${esc(t === "gold" ? TIER_COLOR.gold : s.color || TIER_COLOR[t])}">${esc(s.base)}</span> ${fmt(Math.round(s.ev))}</span>`).join("")}${t === "gold" && x.skins.length > 12 ? ` <button class="b" data-a="more" data-hash="${esc(c.hash)}" style="padding:2px 8px">${allGold.has(c.hash) ? L("cases.collapse") : L("cases.more", { skins: x.skins.length - 12 })}</button>` : ""}`).join("");
      return main2 + `<tr><td colspan="9" style="background:rgba(0,0,0,.15)">${det}</td></tr>`;
    }).join("") || L("cases.clickRecalculateCasesCalculatingAll");
  }

  // src/features/trade.js
  var isTradePage = () => /^\/tradeoffer\//.test(location.pathname);
  var inv = /* @__PURE__ */ new Map();
  var box;
  var fetching = false;
  var scriptVar = (re) => [...document.scripts].map((s) => s.textContent.match(re)).find(Boolean)?.[1];
  function slotItems(sel2) {
    return [...document.querySelectorAll(`${sel2} .item[id^="item"]`)].map((n) => {
      const m = n.id.match(/^item(\d+)_(\d+)_(\d+)$/);
      return m ? { appid: m[1], contextid: m[2], assetid: m[3] } : null;
    }).filter(Boolean);
  }
  var valueOf = (it) => ({ steam: cached2(it.appid, it.hash)?.lowest ?? null });
  async function init2() {
    if (!isTradePage()) return;
    const partner = scriptVar(/g_ulTradePartnerSteamID\s*=\s*'(\d{17})'/);
    box = document.createElement("div");
    box.id = "stt-trade";
    box.style.cssText = 'position:fixed;right:16px;top:90px;z-index:99980;width:300px;background:#171d25;border:1px solid #2a475e;border-radius:6px;padding:10px 12px;font:13px "Motiva Sans",Arial,sans-serif;color:#c6d4df;box-shadow:0 4px 18px #000a';
    box.innerHTML = L("trade.tradeAnalysisLoadingInventories");
    document.body.appendChild(box);
    const load5 = async (sid) => {
      const mine = sid === ctx().steamId;
      for (const c of [2, 16]) {
        try {
          (await inventory(sid, 730, c, { maxAgeMin: mine ? 10 : 0 })).forEach((i) => inv.set(i.assetid, { ...i, owner: sid }));
        } catch (e) {
          if (c === 2) log(`${mine ? L("trade.yourInventory") : L("trade.partnersInventory")}: ${e.message}`, "warn");
        }
      }
    };
    await Promise.all([load5(ctx().steamId), partner ? load5(partner) : null]);
    update();
    const obs = new MutationObserver(() => {
      clearTimeout(obs.t);
      obs.t = setTimeout(update, 300);
    });
    ["#your_slots", "#their_slots"].forEach((s) => {
      const n = document.querySelector(s);
      if (n) obs.observe(n, { childList: true, subtree: true });
    });
  }
  async function update() {
    const mine = slotItems("#your_slots").map((a) => inv.get(a.assetid) || { ...a, unknown: true });
    const theirs = slotItems("#their_slots").map((a) => inv.get(a.assetid) || { ...a, unknown: true });
    const missing = [...mine, ...theirs].filter((i) => i.hash && i.marketable && !hasLowest(i.appid, i.hash, 120));
    render6(mine, theirs, missing.length);
    if (missing.length && !fetching) {
      fetching = true;
      await lowestPrices(missing.map((i) => ({ appid: i.appid, hash: i.hash })), { maxAgeMin: 120, onEach: () => render6(mine, theirs, 0) });
      fetching = false;
      render6(mine, theirs, 0);
    }
  }
  function side(list2) {
    let steamV = 0, noPrice = 0;
    for (const it of list2) {
      const v = valueOf(it);
      const q = it.amount || 1;
      if (v.steam) steamV += v.steam * q;
      else noPrice++;
    }
    return { steamV, noPrice, n: list2.length, unknown: list2.filter((i) => i.unknown).length };
  }
  function render6(mine, theirs, loading3) {
    const a = side(mine), b = side(theirs);
    const diff = b.steamV - a.steamV;
    const bad = a.steamV > 0 && diff < -a.steamV * 0.03;
    const list2 = (l) => l.slice(0, 12).map((it) => {
      const v = valueOf(it);
      return `<div style="display:flex;justify-content:space-between;gap:6px;font-size:12px"><span style="overflow:hidden;white-space:nowrap;text-overflow:ellipsis;color:#${esc(it.color || "c6d4df")}" title="${esc(it.hash || "?")}">${esc(it.name || L("trade.unknownItem"))}${it.nameTag ? ` <i style="color:#e5b84c" title="Name tag">\u201E${esc(it.nameTag)}\u201D</i>` : ""}${it.float != null ? ` <span style="color:#9bd">${it.float.toFixed(4)}</span>` : ""}${it.stickers?.length ? ` <span style="color:#e5b84c">\u2726${it.stickers.length}</span>` : ""}</span><span>${fmt(v.steam)}</span></div>`;
    }).join("") + (l.length > 12 ? `<div style="font-size:11px;color:#8f98a0">+${l.length - 12} ${L("trade.more")}</div>` : "");
    box.querySelector("#stt-tr-body").innerHTML = `
    <div style="color:#8f98a0;font-size:11px;margin-top:4px">${L("trade.youGive")} (${a.n})</div>${list2(mine)}
    <div style="text-align:right"><b>${fmt(a.steamV)}</b></div>
    <div style="color:#8f98a0;font-size:11px;margin-top:6px">${L("trade.youGet")} (${b.n})</div>${list2(theirs)}
    <div style="text-align:right"><b>${fmt(b.steamV)}</b></div>
    <hr style="border:0;border-top:1px solid #2a475e;margin:8px 0">
    <div style="display:flex;justify-content:space-between"><span>${L("trade.balanceSteam")}</span><b style="color:${diff >= 0 ? "#a4d007" : "#ff6b6b"}">${diff >= 0 ? "+" : ""}${fmt(diff)}${a.steamV ? ` (${pct(diff / a.steamV)})` : ""}</b></div>
    ${bad ? L("trade.youGiveMoreThanYou") : ""}
    ${a.unknown + b.unknown ? `<div style="color:#e5b84c;font-size:11px;margin-top:4px">${a.unknown + b.unknown} ${L("trade.itemsNotRecognisedPrivateInventory")}</div>` : ""}
    ${a.noPrice + b.noPrice ? `<div style="color:#8f98a0;font-size:11px">${loading3 ? L("trade.loadingPrices", { loading: loading3 }) : L("trade.withoutASteamPrice", { noPrice: a.noPrice + b.noPrice })}</div>` : ""}
    <div style="color:#8f98a0;font-size:11px;margin-top:4px">${L("trade.pricesAreTheLowestSteam")}</div>`;
  }

  // src/features/settings.js
  var BACKUP_KEYS = ["settings", "sellRules", "buyRules", "watchlist", "trades", "itemMeta", "nameids", "sellPlans", "invSellWatch", "termPaid", "flipHidden", "patternsUser"];
  function mount7(root2) {
    const c = ctx();
    const tg = (k) => `<label class="tgl"><input type="checkbox" data-k="${k}" ${settings[k] ? "checked" : ""}><span class="tr"></span></label>`;
    const row = (t, d, ctl = "") => `<div class="set-row"><div class="txt"><div class="t">${t}</div>${d ? `<div class="d">${d}</div>` : ""}</div>${ctl ? `<div class="ctl">${ctl}</div>` : ""}</div>`;
    const famous = starterSummary().join("\n") + "\n\n" + L("settings.sources") + ": csdb.gg, csgoskins.gg, skinscanner.gg";
    const lanes2 = Object.entries(laneStats()).map(([k, v]) => `${{ hist: L("settings.pricesOrders"), price: L("settings.volume"), inv: L("settings.inventory"), market: L("settings.listingsHistory"), page: L("settings.pages"), search: L("settings.search"), quote: L("settings.quickPrices") }[k] || k} ${L("settings.every")} ${(v / 1e3).toFixed(1).replace(".", ",")} s`).join(" \xB7 ");
    root2.innerHTML = `
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
      <h3>${L("settings.general")}</h3>
      ${row(
      L("settings.language"),
      L("settings.automaticFollowsYourBrowserPolish"),
      `<select data-k="lang">${[["auto", L("settings.automatic")], ["en", "English"], ["pl", "Polski"]].map(([v, t]) => `<option value="${v}" ${(settings.lang || "auto") === v ? "selected" : ""}>${t}</option>`).join("")}</select>`
    )}
    </div>
    <div class="set-sec">
      <h3>${L("settings.inventory2")}</h3>
      ${row(L("settings.pricesAndFloatOnThe"), L("settings.onTheRegularInventoryPage"), tg("badges"))}
      ${row(
      L("settings.sellBadgeThreshold"),
      L("settings.howBigAPriceChange"),
      `<input type="number" min="1" max="100" step="1" data-k="sellSignalPct" value="${settings.sellSignalPct}" style="width:72px"><span class="unit">%</span>`
    )}
    </div>

    <div class="set-sec">
      <h3>\u{1F48E} ${L("settings.rarePatterns")}</h3>
      <div class="intro">${L("settings.itemsWithARareSought")}</div>
      ${row(
      L("settings.communityDatabaseCs2pattern"),
      `<span id="st-patdb">\u2026</span> ${L("settings.flipsterAlsoKnowsAFew", { famous: esc(famous) })}`,
      `<button class="b" data-a="patdb">${L("settings.refresh")}</button>`
    )}
      <div class="set-row col">
        <div class="txt"><div class="t">${L("settings.yourOwnPatterns")}</div><div class="d">${L("settings.oneSkinPerLineE")} <span class="mono">AK-47 | Case Hardened: 661, 670 = blue gem</span>. ${L("settings.writeASeedRangeLike")}</div></div>
        <textarea id="st-pat" rows="4" spellcheck="false" style="width:100%;box-sizing:border-box;font-family:Consolas,monospace;font-size:12px" placeholder="AK-47 | Case Hardened: 661, 670, 955 = blue gem&#10;Butterfly Knife | Case Hardened: 3, 13-15 = ${L("settings.toCheck")}">${esc(get("patternsUser", "") || "")}</textarea>
        <div class="d" id="st-patinfo" style="margin:0"></div>
      </div>
    </div>

    <div class="set-sec dbg">
      <h3>${L("settings.requestsToSteam")}</h3>
      <div class="set-row col">
        <div class="txt"><div class="d">${L("settings.howManyRequestsFlipsterSent")} <button class="b s" data-a="reqstats">${L("settings.refresh")}</button></div></div>
        <div id="st-req"></div>
      </div>
    </div>

    <div class="set-sec">
      <h3>${L("settings.backup")}</h3>
      ${row(
      L("settings.backupFile"),
      L("settings.settingsMinMaxPricesWatched"),
      `<button class="b" data-a="export">${L("settings.save")}</button><button class="b" data-a="import">${L("settings.load")}</button><input type="file" accept=".json" id="st-imp" hidden>`
    )}
    </div>

    <details class="set-sec">
      <summary>${L("settings.advanced")}</summary>
      ${row(L("settings.logAtTheBottomOf"), L("settings.messagesAboutWhatFlipsterIs"), tg("showLog"))}
      ${row(L("settings.debugMode"), L("settings.buttonsForCollectingDataFor"), tg("debug"))}
      ${row(
      L("settings.pauseBetweenListings"),
      L("settings.whenYouListOrRemove"),
      `<input type="number" min="300" step="100" data-k="delay" value="${settings.delay}" style="width:72px"><span class="unit">ms</span>`
    )}
      ${row(
      L("settings.rememberMarketPrices"),
      L("settings.forThisManyMinutesFlipster"),
      `<input type="number" min="0" max="60" data-k="cacheMin" data-zero value="${settings.cacheMin}" style="width:72px"><span class="unit">min</span>`
    )}
      ${row(
      L("settings.steamRequestPace"),
      L("settings.flipsterSlowsDownByItself") + `<span class="dbg"> ${L("settings.now")} ${lanes2}.</span>`,
      `<button class="b" data-a="resetlanes">${L("settings.startOver")}</button>`
    )}
      ${row(L("settings.rememberedPrices"), L("settings.removesSavedPricesAndMarket"), `<button class="b" data-a="clearprices">${L("settings.clear")}</button>`)}
      ${row(L("settings.defaultSettings"), L("settings.restoresTheSettingsInThis"), `<button class="b red" data-a="reset">${L("settings.restore")}</button>`)}
      ${row(L("settings.accountAndFee"), L("settings.accountOnASaleSteam", { feePercent: (c.wallet.feePercent * 100).toFixed(0), feeMin: fmt(c.wallet.feeMin), feeBase: c.wallet.feeBase ? ` plus ${fmt(c.wallet.feeBase)}` : "", pubDefault: (c.wallet.pubDefault * 100).toFixed(0), steam: fmt(30), steam2: fmt(buyerFromReceived2(30)), currency: c.wallet.currency, steamId: c.steamId || L("settings.notLoggedIn") }))}
    </details>
    </div>`;
    root2.addEventListener("change", (e) => {
      const k = e.target.dataset.k;
      if (!k) return;
      let v = e.target.type === "checkbox" ? e.target.checked : e.target.value;
      if (e.target.dataset.price != null) {
        v = parsePrice(v);
        if (isNaN(v)) v = DEFAULT_SETTINGS[k];
        e.target.value = toInput(v);
      } else if (e.target.dataset.pct != null) v = (+v || 0) / 100;
      else if (e.target.type === "number" && e.target.dataset.zero != null && String(v).trim() !== "") v = Math.max(0, +v || 0);
      else if (e.target.type === "number") v = +v || DEFAULT_SETTINGS[k];
      settings[k] = v;
      if (k === "lang") {
        location.reload();
        return;
      }
      if (k === "debug" || k === "showLog") applyPrefs();
      log(L("settings.saved", { k }), "ok");
    });
    const patInfo = () => {
      const { entries: entries2, errors } = parseUser(root2.querySelector("#st-pat").value);
      const n = entries2.reduce((s, e) => s + e.tiers[0].seeds.length, 0);
      root2.querySelector("#st-patinfo").innerHTML = (entries2.length ? L("settings.yourListHasSkinS", { entries: entries2.length, n }) : L("settings.yourListIsEmpty")) + (errors.length ? ` <span class="err">${L("settings.cantReadLineSThe", { errors: errors.join(", ") })}</span>` : "");
    };
    patInfo();
    const dbInfo = () => {
      const i = info();
      root2.querySelector("#st-patdb").innerHTML = i ? L("settings.seedsForSkinsDownloadedRefreshes", { seeds: i.seeds, skins: i.skins, at: new Date(i.at).toLocaleDateString() }) : error() ? `<span class="err">${L("settings.couldntDownloadIt")} (${esc(error())}).</span>` : L("settings.downloading");
    };
    dbInfo();
    load2().then(dbInfo);
    reqInfo(root2);
    root2.querySelector("#st-pat").addEventListener("input", patInfo);
    root2.querySelector("#st-pat").addEventListener("change", (e) => {
      e.stopPropagation();
      set("patternsUser", e.target.value);
      patInfo();
      log(L("settings.savedThePatternList"), "ok");
    });
    root2.querySelector("#st-imp").onchange = async (e) => {
      const f = e.target.files[0];
      if (!f) return;
      try {
        const data3 = JSON.parse(await f.text());
        for (const k of BACKUP_KEYS) if (data3[k] !== void 0) set(k, data3[k]);
        log(L("settings.backupLoadedReloadThePage"), "ok");
      } catch (err) {
        log(L("settings.loadingTheBackupFailed") + err.message, "err");
      }
    };
    root2.addEventListener("click", async (e) => {
      const a = e.target.closest("button")?.dataset.a;
      if (a === "export") {
        const data3 = Object.fromEntries(BACKUP_KEYS.map((k) => [k, get(k, null)]));
        downloadText(`flipster-backup-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`, JSON.stringify(data3), "application/json");
      }
      if (a === "import") root2.querySelector("#st-imp").click();
      if (a === "reqstats") reqInfo(root2);
      if (a === "patdb") {
        root2.querySelector("#st-patdb").textContent = L("settings.downloading");
        const fresh3 = await load2({ force: true });
        dbInfo();
        log(fresh3 ? L("settings.downloadedTheRarePatternDatabase") : L("settings.couldntDownloadThePatternDatabase") + `${error() ? ": " + error() : ""}.`, fresh3 ? "ok" : "warn");
      }
      if (a === "resetlanes") {
        del("lanes");
        log(L("settings.requestPaceResetTheScript"), "ok");
      }
      if (a === "clearprices") {
        del("prices");
        del("skinport");
        del("flipRows");
        await clear();
        log(L("settings.clearedRememberedPricesAndMarket"), "ok");
      }
      if (a === "reset" && await ask(L("settings.resetSettings"), L("settings.restoreTheDefaultSettingsPrice"), { ok: L("settings.restore2"), danger: true })) {
        set("settings", {});
        log(L("settings.defaultsRestoredReloadThePage"), "ok");
      }
    });
  }
  var LANE_NAMES = {
    hist: L("settings.orderBooksPricesCompetition"),
    market: L("settings.yourListingsHistoryPriceHistories"),
    price: L("settings.24HVolume"),
    inv: L("settings.inventory"),
    page: L("settings.itemPages"),
    search: L("settings.marketSearchScannerCases"),
    quote: L("settings.quickPriceCheck"),
    write: L("settings.listingRemovingOrders")
  };
  function reqInfo(root2) {
    const box2 = root2.querySelector("#st-req");
    if (!box2) return;
    const s = requestStats();
    const lanes2 = [...new Set([...Object.keys(s.day), ...Object.keys(s.hour)].filter((k) => k.startsWith("lane:")).map((k) => k.slice(5)))];
    if (!lanes2.length) {
      box2.innerHTML = `<span class="sub" style="margin:0">${L("settings.nothingCountedYet")}</span>`;
      return;
    }
    const n = (o, k) => o[k] || 0;
    lanes2.sort((a, b) => n(s.day, "lane:" + b) - n(s.day, "lane:" + a));
    const tot = (o) => Object.entries(o).filter(([k]) => k.startsWith("lane:")).reduce((q, [, v]) => q + v, 0);
    const t429 = (o) => Object.entries(o).filter(([k]) => k.startsWith("429:")).reduce((q, [, v]) => q + v, 0);
    const urls = Object.entries(s.day).filter(([k]) => k.startsWith("url:")).sort((a, b) => b[1] - a[1]).slice(0, 8);
    const hh = new Date(s.since).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    box2.innerHTML = `<table><tr><th>${L("settings.kind")}</th><th>${L("settings.since")} ${hh}</th><th>${L("settings.last24H")}</th><th>429 (24 h)</th></tr>
    ${lanes2.map((l) => `<tr><td>${esc(LANE_NAMES[l] || l)}</td><td>${n(s.hour, "lane:" + l)}</td><td>${n(s.day, "lane:" + l)}</td><td class="${n(s.day, "429:" + l) ? "warn" : ""}">${n(s.day, "429:" + l)}</td></tr>`).join("")}
    <tr><td><b>${L("settings.total")}</b></td><td><b>${tot(s.hour)}</b></td><td><b>${tot(s.day)}</b></td><td><b class="${t429(s.day) ? "warn" : ""}">${t429(s.day)}</b></td></tr></table>
    ${urls.length ? `<div class="sub" style="margin:6px 0 0">${L("settings.mostFrequentUrls")} (24 h): ${urls.map(([k, v]) => `${esc(k.slice(4))} ${v}`).join(" \xB7 ")}</div>` : ""}`;
  }

  // src/main.js
  function main() {
    if (window.top !== window.self) return;
    init();
    const c = ctx();
    let market = null;
    tab({
      id: "market",
      title: L("main.market"),
      mount(root2) {
        root2.innerHTML = `
        <div class="htabs" style="margin-top:0">
          <button data-mt="sell">${L("main.myListings")} <span class="cnt"></span></button>
          <button data-mt="buy">${L("main.buyOrders")} <span class="cnt"></span></button>
        </div>
        <div data-sec="sell"></div><div data-sec="buy"></div>`;
        const showSub = (t) => {
          set("marketTab", t);
          root2.querySelectorAll("[data-mt]").forEach((b) => b.classList.toggle("on", b.dataset.mt === t));
          root2.querySelectorAll("[data-sec]").forEach((d) => d.hidden = d.dataset.sec !== t);
        };
        root2.querySelector(".htabs").addEventListener("click", (e) => {
          const b = e.target.closest("[data-mt]");
          if (b) showSub(b.dataset.mt);
        });
        market = { showSub };
        mount3(root2.querySelector('[data-sec="sell"]'));
        mount4(root2.querySelector('[data-sec="buy"]'));
        showSub(get("marketTab", "sell"));
      },
      show(sub) {
        if (sub) market?.showSub(sub);
        show4();
        show5();
      }
    });
    tab({ id: "inv", title: L("main.inventory"), mount, show: show2 });
    tab({ id: "hist", title: L("main.history"), mount: mount2, show: show3 });
    tab({ id: "flip", title: L("main.deals"), mount: mount5, show: show6 });
    tab({ id: "cases", title: L("main.worthOpening"), mount: mount6, show: show7 });
    tab({ id: "set", title: L("main.settings"), icon: "\u2699", mount: mount7 });
    setBuyOrderOpener((hash, price, appid) => {
      open("market");
      prefill(hash, price, appid);
      market?.showSub("buy");
    });
    bus.on("ratelimit", (lane, ms) => log(`Steam ogranicza zapytania (${lane}), czekam ${Math.round(ms / 1e3)} s\u2026`, "warn"));
    ensureLogin().then((ok) => {
      if (!ok) log(L("main.youDontSeemToBe"), "warn");
    });
    const refreshFab = () => {
      const on = (settings.autoRelist || settings.autoBuy) && isLeader();
      fab(on, on ? "auto" : "");
    };
    startLeaderElection(refreshFab);
    startSellPlans();
    setInterval(refreshFab, 5e3);
    const tidy = () => {
      if (Date.now() - get("pruneAt", 0) < 6 * 36e5) return;
      set("pruneAt", Date.now());
      pruneCache();
      prune2();
    };
    setTimeout(() => window.requestIdleCallback ? requestIdleCallback(tidy, { timeout: 1e4 }) : tidy(), 15e3);
    initBadges();
    init2();
  }
  try {
    main();
  } catch (e) {
    console.error("[Flipster]", e);
  }
  console.info("[Flipster] build", true ? "23.11.2026, 00:09:54" : "?");
})();
