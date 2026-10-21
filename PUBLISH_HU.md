# GitHubra feltöltés — tulajdonosi ellenőrzőlista

Ez a mappa a Prompt Studio **külön, tiszta forráskiadása**. Nem a saját, már használt `Studio119` telepítésed másolata. A program a felhasználó gépén fut; a GitHubra feltöltött kód nem teszi nyilvánossá a helyi médiaarchívumot.

## Mielőtt nyilvánossá teszed

1. **Csak ennek a mappának a tartalmát** töltsd fel egy új GitHub-tárhelyre. Ne a `Studio119`, a teljes `releases`, a `Backups` vagy az egész Codex-mappát.
2. Nézd át a fájllistát. A csomagban nincs `data/`, `runtime/`, `addon-library-roots.json`, kép, videó vagy modell. A `.gitignore` a később helyben keletkező személyes fájlokat is kizárja, de **önmagában nem helyettesíti** a feltöltés előtti ellenőrzést.
3. Döntsd el, hogy a tárhely **privát** vagy **nyilvános** legyen. Ha bizonytalan vagy, először privátként hozd létre; később külön dönthetsz a nyilvánossá tételről.
4. Dönts a felhasználási feltételekről. A csomaghoz **nem választottam helyetted licencet**. Licenc nélkül a nyilvános kód megtekinthető, de ez nem jelent automatikus engedélyt a másolásra, módosításra vagy terjesztésre. Ha szeretnéd, külön kiválasztjuk a megfelelő licencet, és csak utána tesszük nyilvánossá.
5. Az első feltöltés után a GitHubon is ellenőrizd, hogy nem került fel személyes adat. Ha egyszer egy érzékeny fájl bekerült a Git-előzményekbe, a későbbi törlés önmagában nem feltétlenül távolítja el onnan.

## Mit tartalmaz

- `README.md`: angol fő leírás és használati útmutató.
- `README_HU.md`, `QUICKSTART_8_LANGUAGES.md`: magyar és többnyelvű segítség.
- `dist/`, a helyi kiszolgáló és az indítók: futtatható alkalmazás és forráskód.
- `test-*.mjs`: ellenőrző tesztek.
- `.gitignore`: védelem a később keletkező helyi adatok véletlen verziókövetése ellen.

## Használat egy másik gépen

Töltsd le a tárhely ZIP-ét, bontsd ki egy írható Windows-mappába, majd indítsd a `START.cmd` fájlt. A részletes leírás a `README.md` és `README_HU.md` fájlban van. Első indításkor a program üres archívummal indul; a felhasználó a saját médiamappáit adja hozzá. Nem kell feltöltenie a képeit vagy videóit a GitHubra.

## Fontos működési korlát

Ez **helyi Windows-alkalmazás**, nem GitHub Pages-webhely. A GitHub a kód és a leírás közzétételére szolgál; a médiaarchívum és az opcionális AI a felhasználó gépén marad. A külön Workflow Studio nem része ennek a csomagnak; az ahhoz kapcsolódó gomb csak akkor használható, ha az a program is telepítve és elindítva van.
