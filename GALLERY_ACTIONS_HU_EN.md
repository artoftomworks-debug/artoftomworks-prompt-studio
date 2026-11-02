# Napi galéria: napváltás és kijelöléses törlés

- Az Előző nap / Következő nap gombok a napi galéria alján is elérhetők, a kiválasztott dátummal.
- A képek és videók kártyáin külön kijelölő pipa van. A bélyegképre kattintás továbbra is megnyitja a nézőkét.
- Az Oldal kijelölése, Kijelölés törlése és a piros Kijelöltek törlésének ellenőrzése gomb felül és alul is megtalálható.
- Egy napon, azonos keresésen belül a lapozás megőrzi a kijelölést. Napváltás vagy szűrő/keresés változása törli azt, így a korábbi találatok nem maradnak rejtetten kijelölve. Egyszerre legfeljebb 100 fájl jelölhető ki.
- A megerősítő ablak felsorolja az érintett fájlokat és az esetleges kapcsolódó metaadatokat. Választható Lomtár és végleges törlés; a végleges törléshez külön tudomásulvétel kell. Nem töröl automatikusan.
- A jóváhagyás öt percig és egy műveletre érvényes. Az ellenőrzés óta megváltozott fájloknál a művelet megáll. Ha részben sikerült a törlés, az eredmény jelzi, mi maradt ki, és a megmaradt kijelölés áttekinthető marad.
- Ez a kézzel kijelölt archívumfájlokat törli. A takarítási javaslatok duplikátumvédelme külön funkció; itt a kijelölt másolatok mind törölhetők.

Futtasd az UPDATE.cmd fájlt. Ez a frissítés a helyi kiszolgálót is érinti, ezért utána indítsd újra a megszokott Studio-parancsikonnal, majd Ctrl+F5. A frissítő csak az azonosított Studio-kiszolgálót állítja le, és az előző fájlokról ellenőrzött mentést készít. A képeidet, archívumadatokat és MI-modelleket a telepítés nem módosítja. A csomag tartalmazza az előző stílusváltás-javítást és a virtuális stúdiót is.

Ellenőrzés: próbafájlokon tényleges kötegelt törlés, metaadatok kezelése, változás és lejárt/újrahasznált jóváhagyás elutasítása, helyi kérelmek védelme; felületi eseményteszt kijelölésre, napváltásra és részleges hibára. Éles felhasználói média törlésével nem teszteltük, az operációs rendszer Lomtár-folyamatát nem futtattuk automatikusan. Automatizált böngészős vizuális ellenőrzés nem készült.

# Daily gallery: day navigation and selection-based deletion

Previous day / Next day controls and the selected date now appear below the daily gallery. Image and video cards have selection checkboxes. Select page, Clear selection and a red Review selected deletions button appear at both ends.

Selection persists across pages of the same search/day, and clears when the day, query or filters change. Up to 100 files can be selected. A review dialog lists affected media and companion metadata. Recycle Bin and permanent deletion are available; permanent deletion requires explicit acknowledgement. Nothing is deleted automatically. Reviews expire after five minutes and are single-use. Changed files stop deletion; partial results retain the remaining selections. Ordinary archive selection does not enforce the cleanup tool's keep-one-duplicate rule.

Run UPDATE.cmd, then restart with your usual Studio shortcut and press Ctrl+F5. The updater stops only an identified Studio server and verifies backups. It does not change media, archive data or AI models. Includes previous development updates.

Validation uses disposable test files and UI event tests. Real user media and the Windows Recycle Bin flow were not exercised automatically. No automated visual browser check was completed.
