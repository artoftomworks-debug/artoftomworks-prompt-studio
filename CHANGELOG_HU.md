## 1.21.0 — 2026-11-02 — Vizuális műhelyek, hang és fény

- Fénygömb: javasolt burok, színhőmérséklet/szín, erősség/lágyság, XY-mozgatás Z-nyíl nélkül, görgős forgatás / Shift-billentés / Ctrl-nagyítás, jelenetmentés és angol promptleírás.
- Kutya/macskaváz: három méret, négy alappóz, állítható mancsok/fej/farok, test-/mélységnézet és teljes Studio-mentés. Az emberi BODY_18-export csak embereket tartalmaz.
- A feltöltött 1.20.0 óta: stílus-/fénykeverés, virtuális fény-/kamerastúdió, nagy ízületes pózszerkesztő, referenciaigazítás, test-/mélységnézet és opcionális helyi emberi pózbecslés.
- Kép- és Videóműhely: helyi szerkesztés, arculati minták/profilok, forrás-metaadatokat figyelembe vevő export, képi adatfolyamot megőrző hangmód a meglévő feltételekkel.
- Hangműhely: 17 kész WAV-minta, saját hangimport, témák/változatok, mentett összeállítások, hanghullám és képkockás hang/kép igazítás.
- Archívumgyökerek kezelése, galériakijelölés/-törlés, munkafolyamat-navigáció és NEW címkék, helyi MI elsőindítási segítség, megőrzött MI-vázlatok és külön promptmásolás.
- Azonos buildből készült tiszta Windows- és forráscsomag. Az opcionális Ollama/képértő modell, generálómodellek és FFmpeg külön szükségesek. GPU-generálással együtt ne indíts helyi képértést. A külső komponensek és hangminták feltételei mellékelve.

## 2026-11-02 — Hanghullám és képkockás igazítás

- Helyi forráshullám, hangjelölő, képkockás léptetés és megszakítható elemzés.
- Hozzáadott hang igazítása vágást/sebességet követő képhez; képkockás eltolás, visszavonás, fent maradó kép.
- Megjegyzett Hangműhely-FPS és kezdésfinomítás; nyolcnyelvű kezelés és NEW jelzések.
- Hangmintára pontos késleltetés, lebegőpontos csendforrás; eredeti fájlok megőrzése. Végső keverés renderelt előnézettel ellenőrizhető.

## 2026-11-02 — Hangtémák és változatok

- Kétlépcsős téma / hang választó darabszámokkal, váratlan automatikus lejátszás nélkül.
- 14 nyolcnyelvű alapcsoport, legfeljebb 30 saját téma, átnevezés és eltávolítás a hangok megtartásával.
- Meglévő hangok átsorolása és import a kiválasztott témába; kedvencek, jegyzetek, összeállítások és szűrés megőrzése.
- Nyolcnyelvű kezelés és célzott szerver-újraindító a frissítő mellett.

## 2026-11-02 — Hangműhely és beépített mintahangok

- Nagy külön hangtárlap név/címke/narráció kereséssel, típus/hangulat/nyelv szűrővel, kedvencekkel és helyi hangimporttal.
- 17 beépített WAV: hét saját angol szintetikus narráció, négy eljárásos háttérhang, négy effekt és két egyszerű saját zenei alap; feltételek és forrásfeljegyzés, használathoz modell nélkül.
- Esős kávézó, Arénás nyitány és Csendes elmélyülés; kezdés/hangerő/lekeverés/ismétlés, 20 saját hangulat, vázlatmegőrzés és felülírásvédett licencjegyzetek.
- Külön átnézhető átvitel a Videóműhelybe, a meglévő vágás megtartásával, visszavonással és ismételt fogadás elleni védelemmel.
- Nyolcnyelvű kezelés, NEW indítógomb, funkciókereső-bejegyzés és magyar/angol útmutató. Saját szöveg felolvastatása ebben az első változatban még nincs.

## 2026-11-02 — Videós arculatműhely

- Időzíthető, szerkeszthető felirat, logó és ismétlődő vízjel; képes arculatok átvétele cserével/hozzáfűzéssel és visszavonással.
- Húzható elhelyezés és billentyűs finomítás a nagy előnézeten, kilencpontos igazítás, fedettség, betűbeállítások és külön megjelenés/eltűnés.
- Forrásméret/FPS H.264/AAC export ellenőrzött helyi PNG-rétegekkel, forrás-metaadatokkal, projektfeljegyzéssel és köztes fájlok eltakarításával.
- Veszteségmentes köztes klipek arculatos véglegesítésnél; látható arculat mellett a képi adatfolyam-másolás és csak hang mód kifejezetten elutasított.
- Nyolcnyelvű kezelés és segítség, frissített kikapcsolható Videóműhely NEW jelzés, VIDEO_BRANDING_HU_EN.md.

## 2026-11-02 — Ötletadó arculatminták

- Hat szerkeszthető minta saját képes előnézettel: aláírás, filmes cím, portfólió, reklám, idézet és ismétlődő előnézeti vízjel.
- Arculati rétegek cseréje vagy hozzáfűzése, rögtön szerkeszthető főcím és saját arculatként mentés; az eredeti kép, tónusok és kézi prompt megmaradnak.
- Nyolcnyelvű feliratok és segítség, frissített kikapcsolható NEW jelzés és magyar/angol útmutató.

## 2026-11-02 — Képes arculatműhely

- Húzható felirat és raszteres logó, relatív méret, kilencpontos igazítás, margók, körvonal/háttér/árnyék és ismétlődő vízjel a nagy Képműhely-lapon.
- Helyi menthető arculatok elavult mentések elleni védelemmel; a generálási prompt és videós tónusrecept külön marad.
- Eredeti méretű PNG-másolat és legfeljebb 20 arculatozott kép egy ZIP-ben, megszakítással és az eredetik megtartásával.
- Nyolcnyelvű kezelés és kikapcsolható NEW ugrógomb. Korlátok és metaadatok: BRANDING_HU_EN.md.

## 2026-11-02 — Helyi MI első indítási segítség

- Külön üzenet a nem elérhető Ollamához, üres modelllistához, csak szöveges modellekhez és nem ellenőrizhető képértéshez.
- Hivatalos letöltési link, másolható kezdőparancs és újraellenőrzés; automatikus telepítés vagy képelemzés nélkül.
- Közös segítség az MI-segítőben is, a meglévő munkamegőrzés és modellválasztás megtartásával.
- Nyolcnyelvű felület, kikapcsolható NEW jelzés és a kiadási leírásokból hivatkozott új első indítási útmutató.

## 2026-10-31 — Képkockából videós tónusrecept

- Kiválasztott videóképkocka a Képműhelybe; a teljes képre ható tónusrétegek kifejezett visszaküldése receptként.
- Alkalmazás a kiemelt, bepipált vagy összes klipre; külön erősség, törlés, visszavonás és projektmentés.
- Húzható előtte–utána videó és 40/70/100%-os rövid látványpróbák, a projekt módosítása nélkül.
- Forráshanghullám kattintható pozicionálással, valamint forrás- és eredményképkockák léptetése.
- Közös tónusszámítás, egymás után futó elemzés/export, elavult visszaküldések visszautasítása.
- Nyolcnyelvű felület, újra megjelenő és külön elrejthető NEW jelölések a két műhelynél.
- Globális SDR-tónusok: helyi maszk, fény-/képréteg, háttércsere és HDR-színelés nem vihető át. A próba egy klip saját hangját használja, külön hangsávok nélkül.

## Munkamodul — Videóműhely — 2026-10-31

- Külön helyi szerkesztőlap: idővonal, rendezés, vágás, sebesség, fade, színek,
  külön vágható/időzíthető hangsávok és hangkeverés.
- Valódi rövid előnézet, H.264/AAC-összeállítás, WAV és képi adatfolyamot
  ellenőrzötten megőrző hangjavítás. Az eredeti fájlok megmaradnak.
- Helyi, folyamatos fájlimport és duplikációszűrés, projektmentés, visszavonás,
  megszakítás, előrehaladás és korábbi exportok visszahívása.
- Meglévő FFmpeg-et használ; nincs modellletöltés. Nyolc nyelv, NEW és kereső,
  ellenőrzött többfájlos frissítő célzott szerver-újraindítással.
- Első SDR-modul; nem teljes HDR-, fedőréteg- vagy mozgáskövető stúdió.

## Munkafrissítés — Képműhely: receptek és gyorsabb munka — 2026-10-31

- Kíméletes világosságvizsgálatból Javasolt kiindulás és öt állítható látvány.
- Saját fény-/tónusrecept-polc 24 névvel, külön import/export és mentésvédelem.
  Kép, helyi kijelölés és személyes szöveg nem kerül a receptbe.
- Látható ecsetkör, B/E/V/H és ecsetméret-billentyűk, gyors rétegpipa és
  maszkkal együtt duplikálható réteg; a képmódosítások visszavonhatók.
- Előtte–utána és maszkmegjelenítés az előzőleg kiszámolt képből. A prompt
  tónusleírása követi a réteg erősségét; a kézi prompt megmarad.
- Új Képműhely NEW-revízió, változatlan nyolcnyelvű támogatás.

## Munkaverzió — Képműhely — 2026-10-31

- Külön helyi szerkesztőlap: tónus-, fény- és képrétegek.
- Festhető és kivonható, téglalap és ellipszis maszk; lágyítás és megfordítás.
  Saját képes háttér/égbolt cseréje kézi kijelöléssel.
- Húzható előtte–utána két irányban, nagyítás/képmozgatás, görgős lámpavezérlés,
  visszavonás és újraalkalmazás.
- Eredeti képméretű PNG, képujjlenyomattal ellenőrzött projekt-újracsatolás,
  kézi prompt megőrzése és helyi alkotói tapasztalatnapló.
- Nyolc felületi nyelv, önállóan elrejthető NEW jelzés.
- Automatikus felismerés és generatív képcsere későbbi integráció. Nincs
  feltöltés vagy automatikus MI-hívás; a napló nem modell-újratanítás.

# Változások

## Kiadás előtt — 2026-10-30: Nagy referenciaképes előnézet

- Majdnem teljes ablakos előnézet külön görgethető lámpavezérlőkkel.
- Normál nézetben megtapadó előnézet, korlátozott állókép-magasság és lenyitható tudnivalók.
- Ugyanaz a kép és vezérlők térnek vissza bezárás/Escape után, a referencia és mentett beállítások megtartásával.
- Nyolcnyelvű felület és friss NEW jelölés a Fényműhelynél.

## Kiadás előtt — 2026-10-30: Referenciaképes Fényműhely

- Helyi referenciakép behúzása/kiválasztása a Virtuális stúdióban, előtte–utána és csak eredeti nézettel.
- Közös lámpaerősség-, lágyság-, színhőmérséklet- és színvezérlők a szemléltető 2D fényvázlathoz és ugyanahhoz a stúdióprompthoz.
- Húzható/billentyűzettel mozgatható alany- és lámpajelölők; a kamera szöge, magassága és objektívje az ábrán és a leírásban követhető.
- Menthető előnézeti számértékek a meglévő névvel mentett beállításokban és JSON-ban, beágyazott kép nélkül; korábbi mentésekkel kompatibilis.
- Aktuális fény- és kameraterv másolása; külön választható, jelölők nélküli PNG-előnézet legfeljebb 1600 × 1100 pixel befoglaló méretben.
- Elengedéskori mentés és visszaállítás megszakítás/mentési hiba esetén; képbetöltési versenyhelyzetek kezelése.
- Nyolcnyelvű, sötétkék/fekete felület és külön elrejthető NEW. Nincs MI-hívás vagy képfeltöltés.

## Kiadás előtt — 2026-10-30: Alkotói próbapad

- 2–6 kép-/videóváltozat egyetlen világítási, stílus-, képkivágási vagy kameramozgási összetevő módosításával, közös jelenettel és tervezett beállításokkal.
- Teljes szerkeszthető promptok és külön másolható negatív prompt; a kézi szöveg megmarad, alapváltozáskor figyelmeztet, újraépítés előtt kérdez.
- Behúzható helyi előnézet vagy archívumos eredmény, saját értékelés és jegyzet. A régi eredmény az eredeti prompt-/beállításpillanatképét őrzi.
- Két különböző archívumos eredmény megnyitása a meglévő A/B nézetben, döntés mentése a kísérleti naplóba.
- Bevált eredmény átvétele a receptablakba; a kiolvasott metaadat és a tervezett beállítás külön marad.
- Legfeljebb 20 helyi próba, JSON-mentés/import, TXT-export és folytatás a kezdőlapról.
- Nyolcnyelvű felület, nagy vezérlők, sötétkék/fekete megjelenés, elrejthető NEW jelölés; a kezdőlap is jelzi az új próbafolytatási lehetőséget.

## Kiadás előtt — 2026-10-30: Folytassuk innen

- Választható kezdőlap legfeljebb hat mentett sorozat-/publikálásikártyával, a ténylegesen mentett állapotokkal és ellenőrzési pipákkal.
- Pontos munka folytatása, meglévő sorozatismertető visszanyitása és el nem mentett szerkesztések védelme.
- Hat kedvenc eszköz, ékezet nélkül is használható funkciókereső és közvetlen odaugrás.
- Megmaradó saját következőlépés-jegyzet és indításkori nyitás beállítása; mentési hiba esetén a jegyzet látható marad.
- Nyolcnyelvű felület és külön elrejthető NEW jelölés; a korábbi elrejtések megmaradnak.

## Kiadás előtt — 2026-10-30: Publikálási asztal

- Átvétel az archívum nézőkéjéből és a Sorozattervezőből; meglévő archívumkeresés és jelenlegi prompt használata.
- Külön szerkeszthető és másolható EN/HU cím, kedvcsináló és ismertető.
- Kijelölhető kulcsszavak; opcionális MI-szövegírás a meglévő segítőn keresztül, jóváhagyott átvétellel.
- Forrásprompt és kiolvasott beállítás csak külön választásra; a tervadatok külön jelölve maradnak.
- Kép/hang/borító/szöveg kézi ellenőrzőlista, sorozatonkénti állapot és változásjelzés.
- Szöveges ZIP-csomag, hiányos ellenőrzésnél DRAFT név, saját JSON-mentés/import és helyi vázlatmentés.
- Nyolcnyelvű felület és NEW-jelölés; a Sorozattervező új publikálási átjárója külön friss jelzést kap.

## Kiadás előtt — 2026-10-30: Megtalálható újdonságok

- NEW jelölések a funkció címén és indítóján, elsőként a Sorozattervezőn.
- Külön elrejthető, böngészőben megjegyzett jelölések. A megnyitás nem rejti el.
- Újdonságok menü odaugrással, összes elrejtésével és visszakapcsolással.
- Verziózott funkciólista, nyolcnyelvű szövegek és lapok közti állapotszinkron.

## Kiadás előtt — 2026-10-30: Sorozattervező

- Három szerkeszthető jelenet, közös helyszínnel, alanyokkal, napszakkal, fényekkel, stílussal, színvilággal és képaránnyal.
- Külön kép- és videóprompt, másolás és szerkesztőbe átvétel. A kézi szöveg megmarad, az elavult alap jelzést kap.
- Öt kiindulási pont, tervmásolás új változathoz, állapotok és helyi médiaelőnézet.
- Legfeljebb 25 helyi terv, JSON-mentés/import és teljes TXT-promptexport.
- Nyolcnyelvű felület. Angol promptváz, a saját leírás nyelvének megőrzésével.
- Nem igényel MI-t és nem tölt fel médiát. Az időtartam és képarány tervezett javaslat.

## 1.20.0 — 2026. október 28.

Az október 22–28. között működővé tett fejlesztések összefoglaló kiadása a korábbi, feltöltött 1.19-hez képest.

- **Archívum:** dátumtartomány és gyors dátumszűrők a fájl módosítási ideje alapján; napi bélyegképes galéria; első/utolsó oldal, lapozók felül és alul.
- **Kényelmesebb használat:** indításkori és időszakos automatikus archívumfrissítés, kikapcsolási lehetőséggel; lebegő vissza a tetejére gomb; külön prompt- és negatívprompt-másolás a nézegetőben.
- **Alkotói útlevél:** szerkeszthető, másolható recept a ténylegesen kiolvasott adatokból; hiányzó alapadatok és az újraalkothatóság korlátainak jelzése.
- **Promptműhely:** külön munkapéldány, egyszerű hibajelzések, MI-átadás; beállítható SwarmUI-, Stability Matrix-, ComfyUI- és saját alkalmazásindítók.
- **Meglepetésprompt:** bővített ötletek, anatómiai megfogalmazások; külön választható, nem explicit 18+ művészi akt/boudoir téma, amely nem kerül az általános véletlen választásba.
- **Kompozíció:** felbontásminták, egyedi szélesség/magasság, képkivágás és teljes alakot kérő megfogalmazás. A generátorban továbbra is külön be kell állítani a méretet.
- **Mentett promptok:** a klasszikus mód negatív szövege is megmarad, kereshető és bekerül a JSON-mentésbe; a régi mentések továbbra is olvashatók.
- **MI-segítő:** képbehúzás, képhez készített művészeti prompt, visszafogottabb átdolgozás és videómozgás-javaslat; választható időtartam és célfolyamat megadása.
- **Modellválasztás:** külön megjegyzett szöveges és képes modell; képértés ellenőrzése modelladatokból. A külön kép→videó és képelemző segédben sem csak Gemma választható.
- **Másolás:** megmarad a teljes válasz és magyarázat, a prompt mégis külön másolható több szokásos válaszformátumból. A kézi szövegkijelölés elsőbbséget kap.
- **Helyi MI-segédlet:** külön letölthető kísérleti képes profil beállításai, videómemória-használati útmutató és Ollama-modellkiürítő. Modellfájl nincs a csomagban.
- **Takarítás:** üres/gyanús fájlok és bitre azonos másolatok; friss fájlok kihagyása; lista/galéria; pipák, összes kijelölése, másolatmegőrzési szabály, csoportos ellenőrzés; Lomtár vagy végleges törlés.
- **Takarítási állapot:** egyedi törlés után megmaradnak a további javaslatok. Pontos másolatból legalább egy megőrzését védi a csoportos ellenőrzés.
- **Megjelenés:** olvashatósági módosítások, fekete és sötétkék téma, nyolcnyelvű felületi kiegészítések.
- **Kiadás:** angol alapértelmezésű tiszta Windows-csomag és külön GitHub-forrás; angol/magyar útmutató és változásjegyzék; frissítési útmutató.
- **Feltételek:** ingyenes használat/módosítás/ingyenes továbbadás, fizetős alkotásokhoz is; a program továbbértékesítéséhez külön engedély kell.

**Korlátok:** a Studio nem generál képet/videót. Nem ígér hibátlan anatómiát, pontos reprodukciót vagy korlátlan NSFW-feldolgozást. Egyes régi fordító/javasló eszközök még Gemmát használnak. A kísérleti képes profilt hétköznapi kávézóképpel próbáltuk; explicit képes viselkedését nem ellenőriztük. Külső MI-nél a beillesztést a felhasználó végzi. A tiszta csomagban nincs személyes média, index, modell vagy hordozható Node.
