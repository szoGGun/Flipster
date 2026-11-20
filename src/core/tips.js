// Explanations shown by the ⓘ icon next to card titles / column headers. Key = exact title text.
// Keep them short: one or two plain sentences.
export const TIPS = {
  // ---- Okazje: analiza przedmiotu
  'Najwyższe kupno': 'Najwięcej, ile ktoś teraz oferuje. Twoje zlecenie o 0,01 zł wyżej będzie pierwsze.',
  'Najniższa sprzedaż': 'Najtańsza oferta, tyle płacisz, kupując od razu.',
  'Wolumen': 'Ile sztuk sprzedało się w 24 h (i 7 dni). Więcej = szybszy obrót.',
  'Mediana 7d · śr. 30d': 'Typowa cena sprzedaży z tygodnia i średnia z miesiąca.',
  'Trend 7d': 'Czy cena rośnie (▲), czy spada (▼) w porównaniu z poprzednim tygodniem.',
  'Próg rentowności': 'Najniższa cena wystawienia, przy której wychodzisz na zero po prowizji.',

  // ---- Okazje: pola skanera
  'Kategoria': 'Jakie przedmioty skanować.',
  'Szukaj': 'Tylko przedmioty z tym tekstem w nazwie (po angielsku).',
  'Cena od': 'Minimalna cena. Poniżej ~1 zł prowizja zjada zysk.',
  'do': 'Maksymalna cena jednej sztuki. Domyślnie: dostępne saldo portfela Steam (bez środków wstrzymanych po sprzedaży), odświeżane przy otwarciu zakładki i przed każdym skanem. Gdy wpiszesz własną kwotę, zostaje Twoja.',
  'Min. ofert na rynku': 'Pomija przedmioty z małą liczbą ofert, tam ceny skaczą.',
  'Ile sztuk chcę kupić': 'Dla tylu sztuk policzę, na jaką cenę ustawić zlecenie i ile to potrwa (sekcja „Do jakiej ceny kupować”).',
  'Ile przedmiotów sprawdzić': 'Ile przedmiotów przeanalizować. 40 zajmuje ok. 1-3 min.',
  'Ile znaleźć': 'Skaner sprawdza kolejne przedmioty (ok. 1 na sekundę), aż tyle z nich dostanie ocenę „Flip możliwy”. Kończy też, gdy skończy się lista albo klikniesz Stop. Zostaw puste, żeby szukał bez limitu, do Stopu.',
  'Min. sprzedaży/24h': 'Rzadziej sprzedawane przedmioty są wyszarzone.',
  'Min. ROI %': 'Niższy zwrot jest wyszarzony. Rozsądnie: 3-5%.',

  // ---- Okazje: kolumny tabeli
  'Wolumen 24h': 'Sprzedane sztuki w ostatniej dobie.',

  // ---- Okazje: na dłużej
  'Cena teraz': 'Najtańsza oferta na rynku Steam.',
  'Zimy (XI→V)': 'Ile razy zakup pod koniec listopada i sprzedaż pół roku później dały zysk po prowizji. Obok typowy wynik. Najedź, żeby zobaczyć każdy rok.',
  'Po roku': 'W ilu przypadkach trzymanie przez rok dało zysk po prowizji i jaki był typowy wynik.',
  'Po 2 latach': 'To samo dla dwóch lat trzymania.',
  'vs śr. z roku': 'Cena teraz względem średniej z ostatnich 12 miesięcy. Minus = taniej niż zwykle.',
  '30 dni': 'Zmiana ceny w ostatnim miesiącu. Spadek ponad 10% to sygnał, żeby poczekać.',
  'Ocena': 'Kandydat = skrzynia starsza niż 4 lata (inne przedmioty: dobra historia zim), cena nie spada gwałtownie, jest obrót. Najedź na ocenę, żeby zobaczyć powód.',
  // ---- Okazje: szybki flip
  'Kupno (zlecenie)': 'Cena zlecenia kupna: o grosz nad tymi, które realnie stoją w księdze.',
  'Sprzedaż (transakcje)': 'Cena, po której faktycznie idą transakcje: niższa z dwóch, mediana z 24 h i mediana z 7 dni. Sprzedasz dopiero po 7 dniach, więc jednodniowy skok ceny się nie liczy.',
  'Zysk/szt.': 'Ile zostaje po prowizji z jednej sztuki.',
  'Zysk / szt. (flip)': 'Ile zostaje po prowizji z jednej sztuki.',
  'ROI': 'Zysk względem ceny zakupu, po prowizji.',
  'Zmiana tyg.': 'O ile cena typowo zmienia się w 7 dni. Tyle czasu czekasz, zanim możesz sprzedać.',
  'Szansa wejścia': 'Ile sztuk w ostatnich 7 dniach sprzedano po cenie Twojego zlecenia lub niżej (i jaka to część obrotu). Poniżej 10 szt. zlecenie będzie głównie stało; 0 = nikt tak tanio nie sprzedaje.',

  // ---- Rynek: oferty sprzedaży i zlecenia kupna
  'Obecna': 'Twoja cena (płaci kupujący). Pod spodem: ile dostaniesz.',
  'Konkurencja': 'Najtańsza oferta innego sprzedawcy. Sprawdza się co 2 min.',
  'Min': 'Niżej automat nie zejdzie. Wymagane do auto-relistu.',
  'Max': 'Wyżej automat nie podniesie ceny.',
  'Auto': 'Automat sam podcina konkurencję w granicach min/max.',
  'Nowa cena': 'Cena do relistu. Wpisz albo kliknij „Ustaw: konkurencja, podcięcie”.',
  'Otrzymasz': 'Ile wpadnie na saldo po prowizji.',
  'Moja cena': 'Ile oferujesz za sztukę.',
  'Konkurencja (kupno)': 'Najwyższe zlecenie innego gracza. Wyższe od Twojego = jesteś przebity.',
  'Marża flip': 'Zysk na sztuce: kupno po Twojej cenie, sprzedaż o 0,01 zł pod najtańszą ofertą.',

  'Twoja cena': 'Za ile wystawiłeś (płaci kupujący) i ile dostaniesz po prowizji.',
  'Rynek': 'Czy jesteś najtańszy / najwyżej, najtańsza oferta innych i za ile przedmiot zwykle się sprzedaje.',
  'Proponowana cena': 'Najwyższa cena, przy której przedmiot powinien się sprzedać w wybranym czasie: liczy tańsze oferty przed Tobą i ile sztuk sprzedaje się dziennie.',
  'Twoje zlecenie': 'Ile oferujesz za sztukę i ile sztuk jeszcze kupujesz.',
  'Propozycja': 'O grosz więcej niż najwyższe zlecenie innych (nie więcej niż Twoje max).',
  // ---- Historia: kolumny
  'Cena zakupu / sprzedaży': 'Sprzedaż: ile dostałeś na rękę. Kupno: ile zapłaciłeś.',
  'Cena dziś': 'Ile to samo byłoby warte dziś. Pod spodem zmiana w %.',
  'Zysk / strata': 'Sprzedaż minus koszt zakupu (lub otwarcia skrzyni).',
  'Status': 'Czy nadal to masz, sprzedałeś, czy oddałeś w wymianie.',

  // ---- Ekwipunek
  'Przedmioty': 'Wszystko, co masz: w ekwipunku i wystawione na rynku.',
  'Wartość Steam': 'Wszystko wycenione po najniższej cenie na rynku Steam.',
  'Do sprzedania teraz': 'Przedmioty, które możesz wystawić od ręki. „Otrzymasz” = po prowizji.',
  'Na rynku': 'Twoje wystawione oferty. „Przebite” = ktoś jest taniej.',
  'Zaznaczone': 'Zaznaczone sztuki i ich wartość.',

  // ---- Historia: karty
  'Zysk z flipów': 'Przedmioty kupione na rynku i sprzedane: sprzedaż minus zakup.',
  'Wydano na rynku': 'Ile wydałeś na zakupy.',
  'Otrzymano ze sprzedaży': 'Ile dostałeś ze sprzedaży (po prowizji). Bilans = otrzymano minus wydano, czyli ile realnie przybyło lub ubyło na saldzie.',
};
