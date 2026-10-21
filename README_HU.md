# ArtofTomworks Prompt Studio 1.19 — tiszta GLOBAL kiadás

Ez az **angol alapnyelvű, nyolcnyelvű, helyben futó Windows-csomag** külön, tiszta forráskiadásként GitHub-tárhelyre vagy ZIP-ként saját felhőtárhelyre tehető. Nem weboldalként fut, és nem tartalmazza a személyes képeidet, videóidat, promptarchívumodat vagy mappabeállításaidat. GitHubra feltöltés előtt olvasd el a `PUBLISH_HU.md` ellenőrzőlistát. Licencet nem választottunk helyetted.

## Első indítás

1. Bontsd ki a teljes ZIP-et egy **írható mappába** Windows 10/11 alatt. Ne közvetlenül a ZIP-ből futtasd, és ne a `Program Files` mappába tedd.
2. Kattints duplán a `START.cmd` fájlra. Ha nincs megfelelő Node.js, az indító felajánlja a kipróbált 24.19.0-s hordozható verzió letöltését a hivatalos Node.js-oldalról. A letöltést SHA-256 ellenőrzés védi. Ehhez nem kell rendszergazdai telepítés.
3. A böngésző a `http://127.0.0.1:18819/` címen nyílik meg. Alapból angol; az **Interface language** mezőben választhatsz magyart vagy másik támogatott nyelvet.
4. Az archívumhoz a **Searchable media archive / Kereshető médiaarchívum** résznél írd be a saját kép- vagy videómappád teljes elérési útját, kattints a **Mappa hozzáadása**, majd az **Archívum frissítése** gombra. Másik mappa ugyanígy hozzáadható.
5. Kereshetsz fájlnévben, mentett promptban, modellnévben és útvonalban. Kategóriára és csillagszámra is szűrhetsz. A kiolvasható promptot betöltheted a szerkesztőbe vagy kimásolhatod.
6. A bélyegképek minden indításkor **rejtve** maradnak. A **Bélyegképek mutatása** kapcsolóval az adott munkamenetre láthatóvá válnak. A **Kép nagyítása** gomb nagy előnézetet nyit; a **Megnyitás a gépen** az eredeti képet a Windowsban hozzárendelt programmal nyitja meg.

## Alkotói visszhang — meglepetés a saját archívumodból

Ha már beírtál vagy összeállítottál egy promptot, a jobb oldali **Alkotói visszhang** részen válassz képet, videót vagy mindkettőt, majd kattints a **Rokon alkotások keresése** gombra. A Studio a már beolvasott archívum mentett promptjai között keres közös, jelentéses szavakat, és a hasonló találatoknál figyelembe veszi a csillagokat is. Megmutatja, mely szavak egyeznek; a korábbi promptot kinyithatod, másolhatod, vagy egy gombbal megkeresheted az eredeti archívumi bejegyzést. Nincs automatikus bélyegkép-betöltés, feltöltés, fájlmódosítás vagy generálás. A keresés szavak alapján történik, nem nyelvek közötti szemantikai AI: ha a promptod és az archívumod eltérő nyelvű, előbb fordítsd a promptot.

## Lepj meg egy prompttal és Ötletkeresztező

A lap elején válassz **témát** (vagy „Bármi jöhet”-et) és **kép/videó** módot, majd kattints a **Lepj meg egy prompttal** gombra. A javaslat Ollama nélkül, véletlenszerűen áll össze; angol nyelvű és szabadon szerkeszthető. Csak az **Átvitel a szerkesztőbe** gomb másolja az aktuális prompt helyére, ehhez meglévő prompt esetén külön jóváhagyást kér.

Az archívumban jelölj ki két kiolvasható promptú alkotást **A** és **B** eredményként, majd nyisd meg az **Összevetés és elemzés** ablakot. Az **Ötletkeresztező** a jelenetet az egyikből, a képi hangulatot a másikból veszi. A szerepek felcserélhetők; a vázlat szerkeszthető és másolható. A program nem keveri össze automatikusan a modelleket, LoRA-kat vagy generálási beállításokat, és nem indít generálást.

## Rendezői idővonal

1. A jobb oldali **Rendezői idővonal** résznél add meg a jelenetet, a modellt és a kívánt hosszt. A már elkészült promptot az **Aktuális prompt átvétele** gombbal használhatod kiindulásként.
2. Írd le az időszakaszokban, mi történik, hogyan mozog a kamera, és milyen hang hallatszik. Az időszakaszok fedjék le a teljes videót. A program szerkeszthető idővonalas promptot készít; az időutasítások angolok, a saját beírt szöveget nem fordítja automatikusan.
3. A külön megjelenített FPS-t és képkockaszámot **kézzel** állítsd be a SwarmUI-ban vagy a ComfyUI workflow-ban. A H3/DaSiWa/Eros profil számítása a 24 FPS-es, 5+17n képkockás keretet használja; az LTX és az egyéb modell csak ellenőrzendő javaslat.
4. A médiaarchívum videótalálatánál a **Kapcsolás az idővonalhoz** gombbal a tervhez rendelhetsz egy eredményt. Írd be, mi sikerült és min változtatnál: ez a következő prompt építésekor javítási szempontként bekerül. A videó eredeti fájlját a terv nem másolja és nem módosítja.
5. A tervek ebben a böngészőben tárolódnak. A **Tervek exportálása** JSON-mentést készít; a **Tervek importálása** új gépen visszatölti őket. A tiszta ZIP nem tartalmazza a terveidet, archívumodat vagy videóidat.

Az idővonal nem indít generálást, és nem írja át automatikusan a SwarmUI vagy a ComfyUI beállításait.

A `SETUP.cmd` külön is futtatható az első indítás előkészítéséhez. A `START.cmd` szükség esetén magától felajánlja a beállítást. A `CHECK.cmd` csak olvasó állapotellenőrzést végez, ha valami nem működik.

## Mi van benne, és mi nincs?

Benne van az alkalmazás, a helyi archívumkiszolgáló, egy offline HTML-tartalék, az indító, a beállító és az útmutatók. **Nincs benne** a te médiád, promptod, idővonalterved, szószedeted, saját választásod, gépútvonalad, keresőindexed, naplód, böngészőadataid, Node.js-ed vagy Ollama-modelled. A tiszta archívum **nulla mappával** indul. Csak azokat adja hozzá a felhasználó, amelyeket ő szeretne.

A GitHub-tárhely [workflows mappájában](workflows/README_HU.md) külön megtalálható öt Eros-, DaSiWa- és LTX 2.5-féle ComfyUI JSON-mentés. A korábban elkészült Prompt Studio `v1.19.0` ZIP-ben ezek még nincsenek benne; a külön Workflow Studio programot sem tartalmazzák. A szükséges modelleket és kiegészítőket másik gépen külön kell telepíteni.

## Opcionális helyi AI

A kézi promptépítés, a mentett promptok, a képekbe ágyazott promptadatok olvasása, a médiaarchívum és a keresés Ollama nélkül is működik. Az AI-s promptjavaslathoz, képelemzéshez és AI-fordításhoz:

1. Telepítsd az Ollamát a <https://ollama.com/download/windows> oldalról.
2. Egyszer futtasd: `ollama pull gemma3:4b`. A modell több gigabájtos.
3. Indítsd újra a `START.cmd` fájlt. A modell helyben dolgozik.

A csomag nem telepíti csendben az Ollamát és nem tölt le csendben modellt. Az AI nélküli részek addig is használhatók. A böngésző saját fordítója első használatkor külön nyelvi csomagot kérhet.

## Használat

- **Szövegből kép/videó:** írd le a jelenetet, válassz kamera-, kompozíció- és minőségi javaslatokat; a kész prompt szerkeszthető. A modell- és felbontásjavaslat nem kötelező.
- **Képből kép/videó:** húzz be képet, írd le a kívánt változást vagy mozgást. A tárolt promptadatot olvassa, ha van ilyen; a látvány AI-elemzéséhez Ollama kell.
- **Nyelvek:** EN, HU, DE, FR, ES, IT, PT, PL. A fordítás iránya változtatható; a saját szószedet JSON-ba menthető és betölthető.
- **Bevált promptok:** cím, kategória, címkék, videófájlnév és mintakép menthető. Videóból képkocka is készíthető. Készíts rendszeresen JSON biztonsági mentést.
- **Médiaarchívum:** helyi mappákat olvas be; keres, előnézetet ad, és a megtalált promptot betölti vagy másolja. A prompt nélküli média is látszik, de nincs belőle mit betölteni. Minden találat 1–5 csillaggal értékelhető és kategorizálható; saját kategória is hozzáadható.

Képkészítésnél és képből kép szerkesztésnél a **Promptnyitás / részletesség → Pro fotós nyitás** választás után külön megadható a **Fotós irány** (például glamour, portré, természet, vadvilág) és a **Fény / napszak** (például este, napnyugta, hajnal, stúdiófény). Mindkettő opcionális, és egymással kombinálható. A választott fotós fény a szövegből kép ágon a korábbi általános fénybeállítás helyére kerül, így nem ad hozzá ellentmondó két napszakot. Festményhez, plakáthoz vagy grafikához a fotós nyitás nem kerül a promptba. A kész szöveg mindig szerkeszthető; ezek stílusjavaslatok, nem garantált modellbeállítások.

Ugyanitt a **Művészi nyitás** nem fotós képekhez kínál külön **Művészi irány** választót: olajfestmény, akvarell, expresszív festmény, digitális illusztráció, graffiti/street art, plakát vagy kollázs. A listában csak a választott képtípushoz illő irányok látszanak. Fotós vagy filmes képtípusnál ez a nyitás figyelmeztetéssel kimarad; a másik nyitásra vagy képtípusra bármikor átválthatsz. Ez sem generál képet, és a kész prompt továbbra is szabadon szerkeszthető.

A saját szószedet felső határa **2000 pár**. A szószedetben a **Javaslatok a promptokból** résznél az aktuális promptból vagy a már beolvasott médiaarchívum promptjaiból kérhetsz kifejezésjelölteket. A helyi Ollama csak a jelölt kifejezésekhez ajánl fordítást; ha nincs telepítve, kézzel is megadhatod. A javaslatokat egyenként ellenőrzöd és hagyod jóvá, automatikus mentés nincs. A tiszta csomag nem tartalmaz személyes szószedetet vagy médiaindexet.

## Csillagok, kategóriák és képek

Az értékelések és kategóriák az indítás után létrejövő `data/media-catalog-favorites.json` fájlba kerülnek, az előző állapot másolata pedig a `.bak` párjába. Ezek személyes adatot hordozhatnak, ezért **nincsenek** benne a tiszta ZIP-ben. Használt telepítés költöztetése előtt a `data/` mappát mentsd le. Az értékelés a fájl teljes útvonalához kötődik: másik gépen, megváltozott útvonalnál a régi csillagok nem kapcsolódnak automatikusan az új találathoz. A rejtett bélyegképek nem töltődnek be maguktól; a nagy előnézetet és a külső képnézegetőt külön kéred. Egyik sem módosítja a képet.

## Az archívumból új ötlet vagy workflow

Egy kiolvasható promptot tartalmazó archívumi találatnál a **Hasonlót készítek** gomb visszatölti a promptot szerkesztésre a Prompt Studio-ba. A **Mentett beállítások** sor megmutatja a fájlból kiolvasható technikai adatokat; régebbi katalógusnál egy kattintással újraolvassa az adott fájlt. Ha nincs beágyazott beállítás, nem talál ki értéket.

A **Workflow-javaslat ebből** gomb az ugyanazon a gépen külön elindított Workflow Studio-nak adja át a kiválasztott promptot, modellnevet és a kiolvasható beállításokat. Az átadás csak a helyi gépen történik. A másik program először **javaslatot** mutat; csak külön jóváhagyásra tölti be az űrlapba. Nem indít generálást, nem írja felül a meglévő workflow-t, és a forrásképet nem másolja át automatikusan. A Workflow Studio indítója: `Open-Workflow-Studio.cmd`, alapértelmezett címe: `http://127.0.0.1:18779/`. Ha nincs telepítve vagy elindítva, a Prompt Studio önmagában tovább használható.

## Videóképek és előnézet

A **Bélyegképek mutatása** kapcsoló bekapcsolva a látható videótalálatokból is automatikusan készít egy-egy kis képkockát. Ezek csak ideiglenesen élnek a böngészőben: nem növelik az archívumindexet, és nem módosítják az eredeti videókat. Kikapcsolva a videóképek rejtve maradnak. A videóra kattintva nagyobb, vezérelhető előnézet nyílik; nem indul el magától, bezáráskor megáll. Az eredeti kezdőkép külön hozzárendelése későbbi bővítés lehet.

## A/B összehasonlítás és gyors elemzés

Az archívumi találatoknál és a nagyított nézetben megjelennek a fájl metaadataiból kiolvasható **modell, LoRA-k és erősségeik, felbontás, időtartam, FPS, lépésszám, CFG, seed, sampler és scheduler**. A lista csak a látható találatok részleteit tölti be fokozatosan, a nagyított nézet pedig megnyitáskor ellenőrzi az adott fájlt. Emiatt a régi katalógust nem kell újra beolvasni. Ha egy adat nincs a fájlban, „nem kiolvasható” jelzést kapsz; az app nem talál ki beállítást. A nagyított kép vagy videó sötét hátterére kattintva a nézegető bezárható; a kép/videó és a vezérlők területén ez nem történik meg. Az Esc és a Bezárás gomb is megmarad.

A kinagyított kép- és videónézetben a mentett pozitív és negatív prompt is látható. A **Prompt másolása** gomb az elérhető promptszöveget, a **Teljes recept másolása** pedig ezen felül a kiolvasható modellt, LoRA-kat és erősségeiket, valamint a technikai beállításokat másolja. A hiányzó értékeket nem találja ki. A recept szöveges emlékeztető: a prompt beillesztése önmagában nem állítja vissza a generálás minden beállítását. A meglévő archívumot nem kell emiatt újraolvasni.

A **kinagyított kép- és videónézetben** az Előző/Következő gombokkal az aktuális keresés találatai között lapozhatsz, akár oldalak és képek/videók között is. Itt közvetlenül csillagozhatsz, meglévő kategóriát választhatsz, kijelölhetsz későbbi munkához, illetve megnyithatod a külön megerősítést kérő törlési ablakot. A kijelölések az aktuális munkamenetben, keresés és lapozás közben megmaradnak; még nem indítanak tömeges műveletet. A csillagok és kategóriák tartósan mentődnek. Bekapcsolt bélyegképeknél a videó bélyegképén rövid egérrel rámutatásra néma mozgó előnézet indul; a kinagyított videó viszont továbbra is csak a Lejátszás gombbal indul.

Az archívumban két különböző találatnál válaszd a **Legyen A**, illetve **Legyen B** gombot, majd az **Összevetés és elemzés** gombot. A kijelölés keresés és lapozás közben megmarad, de nem kerül adatbázisba. A fájlok és promptok egymás mellett láthatók; két videót együtt is elindíthatsz. Kikapcsolt bélyegképeknél az előnézetek itt is rejtve maradnak, amíg külön meg nem jeleníted őket.

A gyors összevetés a biztosan kiolvasható prompt-, modell- és technikai eltéréseket sorolja fel. Videónál a fájl tényleges felbontását, hosszát, képkockaszámát és FPS-ét is megpróbálja kiolvasni. LoRA és seed csak akkor jelenik meg, ha a mentett workflow-ban egyértelműen szerepel; hiányzó adatból nem talál ki értéket. A lehetséges előnyök és kompromisszumok nem jelentenek automatikus minőségi győztest.

A **Képkockák helyi elemzése** külön kérhető, és csak megjelenített előnézeteknél indul. Az opcionális helyi `gemma3:4b` képnél egy képet, videónál három kiválasztott képkockát lát; a teljes mozgást és hangot nem tudja ebből megítélni. Megfigyeléseit javaslatként kezeld. A minták nem kerülnek felhőbe vagy tartós adatbázisba, az eredeti média változatlan. Az összevetéshez a korábbi archívumot nem kell újra beolvasni: a friss technikai adatokat megnyitáskor olvassa ki.

## Törlés

A találat **Törlés…** gombja előbb felsorolja a **pontos fájlokat**. Ezután választhatsz **Lomtárba helyezés** és **Végleges törlés** között. A végleges törléshez külön jelölőnégyzet kell. Csak a kiválasztott eredeti fájlt és – ha egyértelműen hozzá tartozik – a `.swarm.json` kísérőadatát érinti. Más mappák másolatait és a külön böngészős **Bevált promptok** gyűjteményt nem törli. Ha a fájl változott, előbb frissítsd az archívumot. Lomtárhiba esetén sosem vált át automatikusan végleges törlésre.

Elsőre nem fontos fájlon próbáld ki a Lomtárat, különösen külső vagy hálózati meghajtón. A végleges törlés nem feltétlenül állítható vissza.

## Adatok és biztonság

- A helyi kiszolgáló csak a saját gépen, a `127.0.0.1:18819` címen hallgat.
- Az archívum indexe használat után a `data/media-catalog-index.json.gz` fájlba kerül. Útvonalakat és promptokat tartalmaz, **nem titkosított**. Naplók: `data/logs/`.
- A mentett promptok, kis mintaképek, saját választások, nyelvek és szószedetek a böngésző helyi tárhelyében élnek. Másik böngésző vagy gép előtt használd a program JSON-export gombjait, majd az importot.
- Az eredeti ZIP tiszta. A **már használt, kicsomagolt mappa** viszont később személyes indexet és naplókat tartalmazhat. Ezt ne csomagold és oszd meg ellenőrzés nélkül.

## Ha valami nem indul

- **Semmi nem nyílik:** bontsd ki a ZIP-et, futtasd `SETUP.cmd`, majd `START.cmd`; olvasd el a parancsablak hibáját.
- **Foglalt a 18819-es port:** zárd be a másik helyi kiszolgálót. Ez a kiadás nem állít le ismeretlen folyamatot.
- **Üres archívum:** adj hozzá létező, teljes mappaútvonalat, majd frissítsd az archívumot.
- **Az AI nem érhető el:** indítsd az Ollamát és töltsd le a `gemma3:4b` modellt. A keresés ettől függetlenül működik.
- **Elavult találat:** frissítsd az archívumot; ez keresőindex, nem állandó fájlrendszer-figyelő.
- **Részletes hiba:** futtasd a `CHECK.cmd` fájlt, majd szükség esetén nézd meg a `data/logs/server.stderr.log` fájlt.

Az angol teljes leírás a `README.md`, a nyolcnyelvű rövid indítás a `QUICKSTART_8_LANGUAGES.md` fájlban található.

## Promptírási szamárvezető

A módválasztó alatt nyisd meg a **Promptírási szamárvezető** panelt. A **Szójavaslat gépelés közben** kapcsoló a mentett promptokból, a szószedetből és – ha a helyi indító fut – a már beolvasott archívum kifejezésjelöltjeiből ajánl. Két karakter után jelenik meg. Tab vagy kattintás veszi át, Esc elrejti; önmagától nem ír a promptba. A kapcsoló állapota ebben a böngészőben marad. A meglévő archívumot nem kell újra beolvasni.

A **Promptfelépítés ajánlása** az adott alkotási mód mentett, bevált promptjainak ismétlődő sorrendjét keresi. Ha kevés az adat vagy nincs visszatérő minta, egyszerű alapvázlatot mutat; nem állítja, hogy azt az archívumból tanulta. A vázlat szabadon szerkeszthető, és csak külön gombbal kerül a promptmezőbe.

A **Lépésenkénti puska** példákkal vezet végig a témán, helyszínen, történésen, kamerán, fényeken és stíluson. Bármelyik válasz kihagyható. Képhez és videóhoz külön sorrendet használ. Csak az utolsó gomb hoz létre szerkeszthető szöveget. Ha a promptmezőben már van szöveg, felülírás előtt rákérdez. A kész vázlat alatt rögtön megjelenik a lehetséges ellentmondások ellenőrzése és – ha a modellcsalád felismerhető és a helyi gyűjtemény elérhető – legfeljebb öt LoRA-javaslat. Máskor a modellcsalád kézzel választható. A találatoknál látszanak az egyező szavak és a kompatibilitás bizonytalansága; a fájlnév másolható, de LoRA nem kerül automatikusan a promptba. A javaslat nem generál képet vagy videót, nem indít felhős kérést, és nem helyettesíti a prompt átnézését vagy szükség szerinti fordítását.

A **Prompt ellenőrzése** gomb a jelenlegi promptból helyben készít gyors ellenőrzőlistát: jelzi a téma, helyszín, történés, kamera, fény és stílus felismerhető jelenlétét, valamint lehetséges ellentmondásokat (például fix és mozgó kamera, csend és zene, folyamatos snitt és vágás, fotó és festmény, illetve átmenet nélküli erős nappali fény és éjszaka). A két új képi ütközéshez példát ad a tisztább megfogalmazásra, de nem írja át a promptot. Ez heurisztika, nem minőségi pontszám és nem garancia; a hiányzó részletek lehetnek szándékosak. Vitás utasításnál nem választ helyetted. Egyszerű hiánynál egy szerkeszthető javítási vázlatot ad: az ⟦…⟧ részt a saját szavaiddal kell kitöltened, és az átvétel előtt a program külön rákérdez. Ha közben a prompt megváltozik, új ellenőrzést kér. Nem hív AI-modellt és nem indít generálást.
## Kijelöléses szósegéd

Bármelyik alkotási mód promptmezőjében jelölj ki egy szót vagy rövid kifejezést (legfeljebb 120 karakter). A **Szósegéd** először a saját, kétirányú szószedetben keres pontos egyezést. Ha nincs találat, a **Helyi fordítás kérése** gomb csak a kijelölt kifejezést küldi az opcionális helyi Ollamához. A javaslat szerkeszthető; külön gombbal cserélheted ki a kijelölt részt vagy mentheted a szószedetbe. A fordítás kézzel is beírható. Google-fiók vagy Google API nem szükséges. Nincs automatikus szövegcsere vagy szószedet-mentés.
## Mondatminták és rámutatásos szóelőnézet

A **Promptírási szamárvezető** panel **Mondatminták az archívumból** gombja a legalább kétszer előforduló mondatokat ajánlja. A mondat csak külön gombbal kerül a promptba. Helyi indítóval az indexelt médiaarchívumot is figyelembe veszi; offline HTML-ben csak a mentett promptokat.

A prompt alatti **Rámutatós szóelőnézet** csak olvasható másolat. Egy szó fölé állva a **Szósegéd** előbb a saját szószedetet nézi. Többszavas kifejezéshez továbbra is kijelölheted a szöveget a valódi promptmezőben. Opcionálisan saját [DeepL API-kulccsal](https://www.deepl.com/en/developers) bekapcsolható az online fordítás; ehhez a helyi indító kell. A kulcs csak a nyitott fülben marad, a kiszolgáló HTTPS-en kizárólag a rámutatott szót és a nyelveket küldi tovább. Sem a promptot, sem a szószedetet nem módosítja automatikusan.
## Kísérleti napló

Válassz ki két archívumi eredményt **A** és **B** jelöléssel, majd nyisd meg az **A/B összehasonlítást**. A **Kísérleti naplóban** névvel, a jobbnak tartott eredménnyel és saját indoklással mentheted a próbát. A kiolvasható modell-, LoRA-, seed-, felbontás- és prompteltérések a bejegyzésben is látszanak. A tényleges generálási idő csak kézzel adható meg, ha tudod.

A napló ebben a böngészőben marad. A **Napló mentése JSON-ba** gombbal készíts biztonsági másolatot, különösen gépcsere előtt; az importgombbal visszatöltheted. A bejegyzés törlése nem érinti a médiafájlokat. Egy mentett pár csak akkor nyitható újra A/B nézetben, ha mindkét változatlan fájl még az indexben található. A napló nem indít generálást.
## LoRA-, embedding- és wildcard-javaslatok

A jobb oldali **Mi segítheti ezt a promptot?** részen add meg a célmodell családját és vizsgáld meg a kész promptot. A Studio a hozzáadott helyi kiegészítőmappák fájlneveit és meglévő `.cm-info.json` / `.metadata.json` leírásait használja. A tiszta GLOBAL kiadásban nincs előre beállított személyes mappa: a **Helyi gyűjtemény** résznél válaszd ki a típusát (LoRA, embedding vagy wildcard), írd be a mappa teljes útját, add hozzá, majd frissítsd a gyűjteményt. A program nem tölt le modellt és nem keres az interneten.

Az ajánlás szöveges egyezésen alapul, leginkább angol prompttal hasznos. A fájladatok alapján valószínű modellcsalád-egyezést külön mutatja a bizonytalanoktól; ez nem garantált kompatibilitás. A hiányzó erősséget és leírást nem találja ki. Semmit nem kapcsol be automatikusan, nem módosít workflow-t, és nem indít generálást. Wildcardot csak olyan workflow-ban használj, amely támogatja.

## Külön negatív prompt és javaslatok

Mind a négy alkotási módnál, valamint a **Lepj meg egy prompttal** résznél külön, szerkeszthető negatív promptmező jelenik meg. A **Javasolj kizárásokat** gomb a jelenethez illő, egyenként átvehető kifejezéseket mutat; a meglepetésprompt és a képből dolgozó javaslatok kiindulási negatív promptot is kapnak. A pozitív és a negatív szöveg külön másolható. A klasszikus **Kerülendő elemek** mező tartalma fordítás után a külön negatív kimenetbe kerül, nem a pozitív prompt végére. A mentett promptok JSON-mentése és a TXT-letöltés is megtartja a negatív részt. Csak akkor illeszd a generáló workflow-ba, ha van hozzá külön negatív bemenet; a javaslat nem garantálja, hogy az adott modell használja.
