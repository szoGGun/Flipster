# Flipster

Userscript (Tampermonkey) do handlu na Rynku Steam, głównie przedmiotami z CS2. Działa w Twojej przeglądarce, na Twojej sesji Steam, bez serwera, logowania i subskrypcji.

## Co robi

| Zakładka | Co robi |
|---|---|
| Rynek | Twoje oferty sprzedaży i zlecenia kupna. Podcina konkurencję w granicach min/max (także automatycznie w tle) i podpowiada cenę, przy której przedmiot realnie się sprzeda. |
| Ekwipunek | Wycena wszystkiego, co masz, znaczki „z zyskiem” / „drogo teraz” / „cena spada”, float, rzadkie wzory 💎 i masowa sprzedaż. Na zwykłej stronie ekwipunku Steam pokazuje ceny i float na przedmiotach. |
| Historia | Ile naprawdę zarobiłeś albo straciłeś na zakupach, sprzedażach, dropach, wymianach i otwartych skrzyniach. |
| Okazje | Skaner przedmiotów do szybkiego flipu (kupno zleceniem, sprzedaż po 7 dniach blokady) i ocena, co warto trzymać na dłużej. |
| Czy warto otwierać? | Ile średnio wraca z otwarcia każdej skrzyni. |

Na stronie oferty wymiany pokazuje wartość obu stron.

## Instalacja

1. Chrome, rozszerzenie **Tampermonkey**. W `chrome://extensions` → Tampermonkey → Szczegóły włącz **„Zezwalaj na skrypty użytkownika”** i **„Zezwalaj na dostęp do adresów URL plików”**.
2. `npm install` i `npm run build`.
3. W Tampermonkey utwórz nowy skrypt i wklej zawartość `dist/flipster-dev.user.js`. To mały loader, który wczytuje zbudowany plik `dist/flipster.user.js` z dysku, więc po każdym `npm run build` wystarczy odświeżyć stronę.
4. Wejdź na steamcommunity.com i kliknij przycisk **Flipster** w lewym dolnym rogu.

## Ważne

- Każdą nową ofertę sprzedaży potwierdzasz w aplikacji Steam (Steam Guard). Skrypt nie ma dostępu do authenticatora i tak ma zostać.
- Automaty działają tylko z otwartą kartą steamcommunity.com i tylko w jednej karcie naraz. Obejmują wyłącznie przedmioty z ustawioną ceną min (sprzedaż) albo max (zlecenia).
- Steam ogranicza liczbę zapytań. Flipster sam zwalnia po błędzie 429 i pamięta ceny przez kilka minut.

## Rozwój

```
npm install
npm run build     # -> dist/flipster.user.js i loader dist/flipster-dev.user.js
npm test          # testy logiki (prowizje, ceny, szansa sprzedaży, FIFO, wzory)
npm run smoke     # cały skrypt w headless Chrome na zamockowanym Steamie
```

Logo w różnych wersjach jest w `src/assets/logo`.
