# ⚡ Flipster

Userscript (Tampermonkey) do handlu na Rynku Steam. Działa w Twojej przeglądarce na Twojej sesji Steam, bez serwera, logowania i subskrypcji.

## Instalacja
1. Chrome → rozszerzenie **Tampermonkey** → `chrome://extensions` → Tampermonkey → Szczegóły → włącz **„Zezwalaj na skrypty użytkownika”**.
2. Tampermonkey → Utwórz nowy skrypt → wklej zawartość `dist/flipster.user.js` → zapisz.
3. Usuń stare skrypty „Steam Market Relister” / „Steam Trader Toolkit”, jeśli je dodałeś.
4. Wejdź na steamcommunity.com → przycisk **⚡ Flipster** w lewym dolnym rogu.

## Funkcje
| Zakładka | Co robi |
|---|---|
| Oferty sprzedaży | Relist po wpisanych cenach, „konkurencja − podcięcie” (Twoje oferty nie są liczone jako konkurencja), cena min/max, zdejmowanie hurtem, **auto-relist w tle** |
| Zlecenia kupna | Lista zleceń, przebijanie do ceny max, **auto-przebijanie w tle**, nowe zlecenia, marża flip dla każdego zlecenia |
| Ekwipunek | Ceny Steam i Skinport, wartość ekwipunku, **float, seed, naklejki** (z API Steama), szybka sprzedaż (↓ najniższa, ⚡ natychmiast), **masowa sprzedaż** z podglądem cen, CSV. Na stronie ekwipunku Steama pojawiają się też znaczki z ceną i floatem |
| Flipy $ | **Analiza przedmiotu** z werdyktem (opłaca się / na granicy / nie), wykres 30 dni, głębokość zleceń, próg rentowności, „czy mój zakup za X się opłaca”, porównanie ze Skinport (wypłata na prawdziwe pieniądze). **Obserwowane** i **skaner rynku** |
| Historia i P&L | Synchronizacja historii rynku, zysk FIFO na każdym przedmiocie, wykres zysku, niezrealizowany zysk, CSV |
| Wymiana | Na stronie oferty wymiany: wartość obu stron na żywo i ostrzeżenie, gdy dajesz więcej |

## Ważne
- Każdą nową ofertę sprzedaży potwierdzasz w aplikacji Steam (Steam Guard). Skrypt nie ma dostępu do Twojego authenticatora i tak ma zostać.
- Automaty działają tylko z otwartą kartą steamcommunity.com i tylko w jednej karcie naraz. Obejmują wyłącznie przedmioty z ustawioną ceną **min** (sprzedaż) albo **max** (zlecenia).
- Steam ogranicza liczbę zapytań. Ceny pobierają się w tempie ok. 17 na minutę, a skrypt sam zwalnia po błędzie 429.
- Pieniądze ze Steama nie dają się wypłacić. Kolumna „Wypłata SP” pokazuje, ile prawdziwej gotówki dostaniesz ze Skinport za 1 zł wydany na Steamie.

## Rozwój
```
npm install
npm run build     # -> dist/flipster.user.js
npm test          # testy logiki (prowizje, relist, przebijanie, FIFO, parsowanie ekwipunku)
npm run smoke     # cały skrypt w headless Chrome na zamockowanym Steamie
```
