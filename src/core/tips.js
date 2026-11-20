// Explanations shown by the ⓘ icon next to card titles / column headers. Key = exact title text.
// Plain language for anyone (no "median", "FIFO", "order book"): what the number means and what it's for, two or
// three short sentences. "\n" starts a new paragraph (ui.js shows an empty line between). Rewritten 2026-11-20.
// Colons only where Polish naturally wants one (the user finds them odd as a stand-in for a dash), no long dashes.
export const TIPS = {
  // ---- Okazje: analiza przedmiotu
  'Wolumen': 'Ile sztuk sprzedało się w ostatniej dobie (i w tygodniu). Im więcej, tym łatwiej kupić i sprzedać.',
  'Mediana 7d · śr. 30d': 'Za ile przedmiot zwykle się sprzedawał. Pierwsza liczba to środkowa cena z ostatniego tygodnia, druga to średnia z miesiąca.',
  'Próg rentowności': 'Za ile najmniej musisz wystawić, żeby po prowizji Steama wyjść na zero przy tej cenie zakupu.',

  // ---- Okazje: pola skanera
  'Kategoria': 'Jakiego rodzaju przedmioty skaner ma przeglądać.',
  'Szukaj': 'Tylko przedmioty z tym tekstem w nazwie (nazwy są po angielsku, np. „Case”).',
  'Cena od': 'Najniższa cena przedmiotu do sprawdzenia. Poniżej ok. 1 zł prowizja Steama zjada prawie cały zysk.',
  'do': 'Najwyższa cena jednej sztuki. Domyślnie tyle, ile masz dostępne w portfelu Steam, a jeśli wpiszesz własną kwotę, zostanie.',
  'Min. ofert na rynku': 'Pomija przedmioty, które mało kto wystawia, bo ich ceny skaczą i trudno je potem sprzedać.',
  'Ile sztuk chcę kupić': 'Dla tylu sztuk policzę, jakie zlecenie kupna ustawić i ile razem zapłacisz.',
  'Ile przedmiotów sprawdzić': 'Ile przedmiotów przejrzeć. 40 sztuk to ok. 1-3 minuty.',
  'Ile znaleźć': 'Skaner przegląda kolejne przedmioty, aż tyle z nich dostanie ocenę „Flip możliwy”, lista się skończy albo klikniesz Stop. Puste pole oznacza brak limitu.',
  'Min. sprzedaży/24h': 'Przedmioty sprzedawane rzadziej są wyszarzone, bo długo czekałbyś na kupca.',
  'Min. ROI %': 'Przedmioty z mniejszym zarobkiem (w procentach ceny zakupu) są wyszarzone. Rozsądny próg to 3-5%.',

  // ---- Okazje: kolumny tabeli
  'Wolumen 24h': 'Ile sztuk sprzedało się w ostatniej dobie.',

  // ---- Okazje: na dłużej
  'Cena teraz': 'Najtańsza oferta na rynku Steam, czyli za ile kupisz od ręki.',
  'Zimy (XI→V)': 'Ile razy w przeszłości opłaciło się kupić pod koniec listopada i sprzedać pół roku później (po prowizji). Najedź, żeby zobaczyć każdy rok.',
  'Po roku': 'Jak często w przeszłości trzymanie przez rok dało zysk po prowizji i ile typowo wychodziło.',
  'Po 2 latach': 'To samo dla dwóch lat trzymania.',
  'vs śr. z roku': 'Czy teraz jest taniej, czy drożej niż średnio w ostatnim roku. Minus oznacza, że taniej niż zwykle.',
  '30 dni': 'O ile zmieniła się cena w ostatnim miesiącu. Duży spadek (ponad 10%) to znak, żeby jeszcze poczekać z zakupem.',
  'Ocena': 'Krótki werdykt Flipstera. „Kandydat” to np. skrzynia starsza niż 4 lata, której cena nie leci w dół i która się sprzedaje. Najedź na ocenę, żeby zobaczyć powód.',

  // ---- Okazje: szybki flip
  'Kupno (zlecenie)': 'Za ile ustawić zlecenie kupna. To grosz więcej niż zlecenia innych, które naprawdę czekają na sprzedających.',
  'Sprzedaż (transakcje)': 'Za ile ten przedmiot naprawdę się sprzedaje. Sprzedać możesz dopiero po 7 dniach od zakupu, więc jednodniowy skok ceny się nie liczy.',
  'Zysk/szt.': 'Ile zarobisz na jednej sztuce po odjęciu prowizji Steama.',
  'Zysk / szt. (flip)': 'Ile zarobisz na jednej sztuce po odjęciu prowizji Steama.',
  'ROI': 'Zarobek w procentach ceny zakupu, po prowizji. Np. 5% oznacza, że z każdych 100 zł zostaje 5 zł.',
  'Zmiana tyg.': 'O ile cena zwykle zmienia się w ciągu tygodnia. Przez tydzień nie możesz sprzedać, więc to Twoje ryzyko.',
  'Szansa wejścia': 'Ile sztuk w ostatnim tygodniu sprzedano po cenie Twojego zlecenia albo taniej. Poniżej 10 zlecenie raczej będzie stało, a 0 oznacza, że nikt nie sprzedaje tak tanio.',

  // ---- Rynek: oferty sprzedaży i zlecenia kupna
  'Nowa cena': 'Cena, na którą zmienisz ofertę. Wpisz ją albo kliknij gotową propozycję.',
  'Otrzymasz': 'Ile wpadnie na saldo Steam po prowizji.',
  'Twoja cena': 'Za ile wystawiłeś (tyle płaci kupujący) i ile z tego dostaniesz po prowizji.',
  'Rynek': 'Czy Twoja oferta jest najtańsza, ile kosztuje najtańsza oferta innych i za ile przedmiot zwykle się sprzedaje.',
  'Proponowana cena': 'Najwyższa cena, przy której przedmiot ma realną szansę zejść w czasie ustawionym w ⚙.\nFlipster sprawdza, jak często w ostatnim miesiącu cena utrzymywała się na takim poziomie. Przy rzadko sprzedawanych przedmiotach patrzy, ile tańszych ofert jest przed Tobą i po ile ostatnio sprzedawano.',
  'Twoje zlecenie': 'Ile oferujesz za sztukę i ile sztuk jeszcze chcesz kupić.',
  'Propozycja': 'Grosz więcej niż najwyższe zlecenie innych, żeby Twoje było pierwsze w kolejce (nie więcej niż Twoje maksimum).',

  // ---- Historia: kolumny
  'Cena zakupu / sprzedaży': 'Przy sprzedaży to kwota, którą dostałeś na rękę (po prowizji), a przy zakupie to, ile zapłaciłeś.\nKwoty w euro czy dolarach są przeliczone po kursie NBP z tamtego dnia.',
  'Cena dziś': 'Za ile ten sam przedmiot sprzedaje się dziś (najtańsza oferta). Pod spodem widać, o ile więcej albo mniej to niż wtedy.',
  'Zysk / strata': 'Ile na tym zarobiłeś albo straciłeś, czyli to, co dostałeś, minus to, ile Cię to kosztowało.\nKosztem jest cena zakupu, skrzynia z kluczem albo wartość tego, co oddałeś w wymianie. Drop i prezent nic nie kosztują.',
  'Status': 'Co się stało z przedmiotem. Nadal go masz, sprzedałeś go albo oddałeś w wymianie.',

  // ---- Ekwipunek
  'Przedmioty': 'Ile masz przedmiotów, licząc te w ekwipunku i te wystawione na rynku.',
  'Wartość Steam': 'Ile byłoby warte wszystko razem po najniższych cenach na rynku Steam (tyle płaci kupujący).',
  'Do sprzedania teraz': 'Przedmioty, które możesz wystawić od ręki (bez blokady handlu). „Otrzymasz” to kwota, którą dostaniesz po prowizji.',
  'Na rynku': 'Twoje wystawione oferty. „Przebite” znaczy, że ktoś wystawił taniej niż Ty.',
  'Zaznaczone': 'Ile sztuk zaznaczyłeś i ile są warte.',

  // ---- Historia: karty
  'Wydano na rynku': 'Ile w sumie zapłaciłeś za zakupy na rynku Steam (w okresie i grze wybranych u góry).',
  'Otrzymano ze sprzedaży': 'Ile w sumie dostałeś ze sprzedaży na rynku, już po prowizji Steama.',
  'Bilans': 'Otrzymano minus wydano. Plus znaczy, że handel na rynku powiększył Twoje saldo Steam, a minus, że je zmniejszył.',
  'Zysk z flipów': 'Ile zarobiłeś na samym handlu, czyli na przedmiotach kupionych na rynku i potem sprzedanych. To kwota ze sprzedaży (po prowizji) minus to, ile za nie zapłaciłeś.\nNie liczy dropów, skrzyń, wymian ani tego, co nadal masz. Ile w sumie przybyło albo ubyło na saldzie, pokazuje Bilans.\n„Na plus” to część tych sprzedaży, które dały zysk (np. 10% to 1 na 10).',

  // ---- Historia: otwarte skrzynie
  'Otwarcia': 'Ile skrzyń, kapsuł i terminali otworzyłeś. Pod spodem widać, ile z nich dało więcej, niż kosztowało.',
  'Koszt otwarć': 'Ile kosztowały Cię otwarcia, czyli skrzynia (cena zakupu albo jej wartość, jeśli wypadła z gry) i klucz. Przy terminalu liczy się terminal i to, co zapłaciłeś w grze.',
  'Wartość dropów': 'Ile jest warte to, co wypadło ze skrzyń (po prowizji).\nSprzedane liczą się po kwocie sprzedaży, wymienione po tym, co za nie dostałeś, a te, które nadal masz, po dzisiejszej cenie.',
  'Zysk / strata na skrzyniach': 'Wartość dropów minus koszt otwarć. Terminale bez wpisanej kwoty zapłaconej w grze są pominięte.',
  'Najlepszy drop': 'Najcenniejszy przedmiot, jaki Ci wypadł, z jego wartością i datą otwarcia.',
};
