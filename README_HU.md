# ArtofTomworks Prompt Studio 1.21.0

**Helyi MI első telepítése:** telepítsd és indítsd el az [Ollamát Windowsra](https://ollama.com/download/windows). Új PowerShell-ablakban futtasd: `ollama pull gemma3:4b`, és várd meg a letöltést. A Studiót a `START.cmd` fájllal indítsd, majd a modellválasztónál kattints az **Ellenőrzés újra / ↻** gombra. Az Ollama és a modell külön letöltés; az alap archívum ezek nélkül is használható. Az üres lista mellé konkrét segítség kerül. Részletek: [nyolcnyelvű első indítási útmutató](LOCAL_AI_FIRST_RUN_8_LANGUAGES.md).

Helyben futó Windows-segéd promptíráshoz és saját képeid, videóid kereshető archívumához. **Nem generál képet vagy videót, és nem csak MiniMax H3-hoz használható:** SwarmUI, ComfyUI és más generátorok mellett is dolgozhatsz vele. A kiolvasható adatok a fájlok tényleges tartalmától függnek.

## Indítás

**Új képes arculatműhely:** a Képműhely kártyán a **Felirat, logó és vízjel ↗** gombbal nyitható. Húzható felirat és logó, menthető arculat és legfeljebb 20 kép kötegelt PNG–ZIP exportja. Részletek és metaadatokra vonatkozó tudnivalók: [BRANDING_HU_EN.md](BRANDING_HU_EN.md). Videóra égetett felirat ebben a képes változatban még nincs.

1. Bontsd ki a teljes ZIP-et egy írható, helyi mappába. Ne a ZIP-ből indítsd.
2. Indítsd a **START.cmd** fájlt. Node.js 22 vagy újabb szükséges; ha hiányzik, a telepítő felajánl egy hordozható letöltést a nodejs.org-ról, hivatalos SHA-256 ellenőrzéssel.
3. Megnyílik a `http://127.0.0.1:18819/` cím. Válaszd a magyar felületet, és add hozzá saját médiamappáidat az archívumban.

Nyolc felületi nyelv: angol, magyar, német, francia, spanyol, olasz, portugál, lengyel. Új böngészőprofilon angol az alapértelmezés. Ugyanazon helyi címen a korábbi böngészőbeállítások megmaradhatnak. A megjelenés sötétkék vagy fekete lehet.

Régi telepítés frissítéséhez előbb olvasd el az [UPGRADE.md](UPGRADE.md) útmutatót. Ha a 18819-es porton már fut egy régi Studio, a kiszolgálóját is le kell állítani: a böngészőfül bezárása önmagában kevés. A **CHECK.cmd** mutatja a futó verziót és a napló helyét.

## Ami az 1.19 óta bekerült

- Dátumszűrés a fájl módosítási ideje alapján; ez nem feltétlenül az alkotás ideje.
- Napi bélyegképes galéria, első/utolsó oldalra ugrással, felül és alul is elérhető lapozóval.
- Indításkori és körülbelül 15 percenkénti automatikus archívumfrissítés, amikor az oldal látható és elérhető; kikapcsolható, a kézi frissítés megmaradt.
- Lebegő vissza a tetejére gomb, külön pozitív- és negatívprompt-másolás a nézegetőben.
- Alkotói útlevél a fájlban valóban megtalált adatokból, hiányzó értékek kitalálása nélkül.
- Promptműhely munkapéldánnyal, egyszerű ellentmondáskereséssel és beállítható alkalmazásindítókkal.
- MI-segítő képek behúzásával, képes és szöveges modellválasztással, képhez készített videóprompttal és visszafogottabb átdolgozással.
- A teljes MI-válasz megmarad, de a prompt vagy kijelölt szöveg külön másolható.
- A meglepetéspromptnál felbontás- és képkivágás-javaslat; külön választható 18+ művészi akt / boudoir kategória, nem explicit tartalommal.
- Takarítási javaslatok listában és galériában, pipás kijelöléssel, csoportos ellenőrzéssel és választható törlési móddal.

Részletesen: [CHANGELOG_HU.md](CHANGELOG_HU.md). A teljes angol útmutató: [README.md](README.md).

## Fontos tudnivalók

A Studio nem állítja be helyetted a generátor tényleges felbontását, FPS-ét vagy képkockaszámát. A javasolt méretet ott is állítsd be, és ellenőrizd a választott modell támogatását. A teljes alakot kérő szöveg és az anatómiai javaslat sem garantál hibátlan képet. A negatív prompt hatása a generálási folyamattól függ.

A helyi MI-hez külön Ollama és külön letöltött modell kell. A képes és szöveges választást külön megjegyzi. Csak képértésre alkalmas modellnek küldhető kép; a kép csak a válaszkérés gombjára kerül a helyi Ollamához. A modellek tartalmi szigorúsága és válaszminősége eltérő. Az opcionális kísérleti profil nem korlátlan NSFW-feldolgozási ígéret; hétköznapi kávézófotóval próbáltuk, explicit képpel nem ellenőriztük. Egyes régebbi fordító és javasló eszközök továbbra is Gemmát használnak.

**Képelemzést és GPU-s kép-/videógenerálást egymás után futtass.** Az üres generálási sor nem jelenti feltétlenül a videómemória felszabadulását. Előbb ürítsd ki a generátor modelljét a saját kezelőfelületén. A helyi MI válasza után az **UNLOAD_LOCAL_AI.cmd** kiürítheti az Ollama memóriában maradt modelljeit; fájlokat nem töröl, a SwarmUI/ComfyUI modelljeit nem üríti ki. Részletek és telepítés: [LOCAL_AI_GUIDE.md](LOCAL_AI_GUIDE.md).

A külső ChatGPT/Copilot gombok másolnak és megnyithatják az alkalmazást; **a beillesztést te végzed**. A képet külön csatold a külső alkalmazásban.

A takarító üres/gyanús fájlszerkezetet és bitre azonos másolatokat keres, az utolsó órában módosult fájlokat kihagyja. Nem művészeti minőséget vagy hibás anatómiát értékel. A találatok nem bizonyítanak teljes dekódolhatóságot. Mindig ellenőrizd a kijelölést; pontos másolatból legalább egyet megőriz a csoportos ellenőrzés. Nincs automatikus törlés. A végleges törlést a Studio nem tudja visszavonni.

A tiszta csomagban nincs személyes média, archívumindex, modell vagy helyi futtatókörnyezet. A `data/`, az `addon-library-roots.json` és a böngészőben tárolt promptok magánadatok; ezeket ne töltsd fel nyilvánosan. A külön Workflow Studio / Flight Check nem része a csomagnak.

## Felhasználás

Az irányadó angol feltételek: [LICENSE.txt](LICENSE.txt). Ingyen használható, módosítható és ingyen továbbadható, fizetős alkotások készítéséhez is. A programot és módosított másolatait külön engedély nélkül nem lehet árulni. Továbbadásnál a szerzői jogi és licencszöveget meg kell tartani; kész alkotásaidnál nem kötelező megnevezned a Studiót. A külső modellek saját feltételeit ez nem írja felül. Egyedi, elérhető forrású licenc, nem OSI szerinti nyílt forrású licenc.

## 1.21.0: fénygömb, háziállatok és összevont műhelyek

Nagy pózszerkesztő: Virtuális stúdió → Figurák és testtartások → Megnyitás új lapon. Fénygömbnél térbeli nézetben görgő = forgatás, Shift + görgő = billentés, Ctrl + görgő = nagyítás. Kutya/macskaváz, három méret és állítható pózok. Részletek: LIGHT_SPHERE_PETS_HU_EN.md.

A teljes kiadás tartalmazza az új képes, videós és hangos műhelyeket, arculatot, témákat, hanghullámot és képkockás hangigazítást is. Minden korábbi helyi frissítő nélkül telepíthető egy új mappába.

Friss gépen a képből promptot ajánló MI-hez külön Ollama és képértő modell szükséges. Üres modelllista esetén: Helyi MI beállítása, majd LOCAL_AI_FIRST_RUN_8_LANGUAGES.md. GPU-s generálás közben ne indíts helyi képértést. A kézi szerkesztők és az archívum Ollama nélkül is használhatók. Videós feldolgozáshoz FFmpeg-motor kell; szükség esetén a Videóműhely motorbeállításánál választható. A kész WAV-mintákhoz nem kell MI.
