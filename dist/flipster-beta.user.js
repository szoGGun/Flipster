// ==UserScript==
// @name         Flipster
// @namespace    szoggun.flipster
// @version      0.3.0
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
// @require      https://raw.githubusercontent.com/szoGGun/Flipster/main/dist/flipster.user.js
// @updateURL    https://raw.githubusercontent.com/szoGGun/Flipster/main/dist/flipster-beta.user.js
// @downloadURL  https://raw.githubusercontent.com/szoGGun/Flipster/main/dist/flipster-beta.user.js
// ==/UserScript==

// kod ładuje się z pliku powyżej (@require), nie edytuj tutaj
