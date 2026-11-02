# Archívumútvonal eltávolítása

Az archívumban felsorolt minden mappa/meghajtó neve mellé **×** gomb került. A gomb az adott útvonalat kiveszi az archívumból és a következő automatikus beolvasásokból. A gépen lévő képeket, videókat és metaadatfájlokat nem törli.

Az érintett találatok azonnal kikerülnek az archívum listájából. Ha egy almappát külön is hozzáadtál, vagy egy másik megadott útvonal továbbra is lefedi a fájlt, az ottani találat megmarad. Az értékelések és kategóriák megőrződnek, ezért az útvonal későbbi visszaadása és beolvasása után ismét elérhetők. A korábban elmentett Bevált fogások szövegeit sem törli; egy eltávolított forrásfájl archívumból történő megnyitásához újra hozzá kell adni annak helyét.

A gomb működése eltér a piros médiafájl-törléstől: az **×** csak az archívumhoz adott helyet felejti el. Beolvasás közben nem használható; ilyenkor várd meg a végét vagy használd a Beolvasás megszakítása gombot. A készülő törlési kijelölések és ellenőrzések az útvonal eltávolításakor törlődnek, hogy korábbi találatokra ne maradjon jóváhagyás.

Futtasd az **UPDATE.cmd** fájlt, majd indítsd újra a megszokott Studio-parancsikonnal, és nyomj **Ctrl+F5**-öt. A frissítő a korábbi programfájlokról ellenőrzött mentést készít; a médiát, az archívumadatokat és a modelleket a telepítés nem cseréli le. Ez a csomag a meghajtós beolvasást és a korábbi fejlesztéseket is tartalmazza.

Ellenőrzés: szülő- és almappa átfedése, összes útvonal kivétele, újrahozzáadás, értékelések megőrzése, mentési hiba és folyamatban lévő beolvasás kezelése, helyi API-védelem, a gomb felületi eseményei és mind a nyolc nyelv. Próbafájlokon az eltávolítás előtt és után a média és metaadatok bájtjai megegyeztek. Valós felhasználói archívumot nem távolítottunk el; automatizált böngészős vizuális ellenőrzés nem készült.

# Remove an archive location

Each archive folder/drive chip now has an **×** button. It unregisters that location from the archive and future scans. It does not delete media or sidecar files from your computer.

Results outside all remaining configured roots disappear immediately. Files covered by another registered parent or child root remain available. Ratings and categories are retained for re-adding and rescanning the location. Saved proven-recipe text is kept; opening an unregistered source through the archive requires adding its location again.

The **×** differs from media deletion: it only removes the archive location. It is disabled during scanning. Location changes clear pending selections and deletion reviews.

Run **UPDATE.cmd**, restart with your usual Studio shortcut and press **Ctrl+F5**. The updater verifies program-file backups without replacing media, archive data or AI models. Includes drive-root scanning and previous development updates.

Tests cover overlapping roots, removing all roots, re-adding, ratings, failed persistence, busy scans, local API protections and eight-language UI button events. Test media and sidecars remained byte-for-byte unchanged. No real user archive was removed and no automated visual browser check was performed.
