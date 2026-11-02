# Archívum: teljes meghajtó és almappák

A korábbi verzió az almappákat is bejárta, de teljes meghajtó megadását nem engedte. Ez a korlátozás megszűnt: Windows alatt például **E**, **E:** vagy **E:\** megadása is használható. Egy szülőmappa megadásakor annak almappái automatikusan beletartoznak; nem kell külön hozzáadni őket. A meghajtó csatlakoztatva és olvasható állapotban legyen.

Támogatott média: PNG, JPG/JPEG, WebP, MP4, WebM és MOV. A kiolvasható promptok a fájlban ténylegesen megmaradt metaadatoktól függenek. A prompt nélküli támogatott média is bekerülhet az archívumba. A beállított szűrők továbbra is szűkítik a látható találatokat.

A beolvasás kijelzi az aktuális mappát és a bejárt mappák számát. Új gomb: **Beolvasás megszakítása**. Megszakításkor a korábbi, befejezett archívum és a mentett értékelések megmaradnak; a részleges új találatlista nem kerül a helyükre. A végső mentési lépés már nem szakítható meg.

A teljes meghajtó első beolvasása hosszabb lehet. A Lomtár, a System Volume Information és a szokásos technikai mappák (.git, node_modules, .venv) kimaradnak; teljes meghajtón a szokásos gyökérszintű Windows-, program- és helyreállítási mappák is. A mappahivatkozásokat nem követi, az olvashatatlan mappákat hibaként számolja és továbblép. A korábbi 200 000 médiafájlos felső korlát megmaradt. Ennek túllépésekor a korábbi archívum marad meg.

Futtasd az **UPDATE.cmd** fájlt, majd indítsd újra a Studiót a megszokott parancsikonnal, és nyomj **Ctrl+F5**-öt. Ezután az archívumban add meg a meghajtót vagy szülőmappát. Ha az automatikus frissítés engedélyezett, a hozzáadás után elindul a beolvasás; egyébként kattints az **Archívum frissítése** gombra. A korábbi fejlesztéseket, köztük a napi galéria kijelöléses törlését is tartalmazza. A frissítő ellenőrzött mentést készít, a médiát és az archívumadatokat nem cseréli le.

Ellenőrzés: Windows-meghajtónevek normalizálása, tizenkét szint mély mappabejárás képpel és videóval, technikai mappák kihagyása, megszakítás és újraindítás az archívum és értékelések megőrzésével, helyi API-ellenőrzések. Valós teljes meghajtót nem olvastattunk be automatikusan; böngészős vizuális ellenőrzés nem készült.

# Archive: entire drives and subfolders

Subfolders were already recursive, but entire drive roots were previously rejected. Windows inputs such as **E**, **E:** and **E:\** are now accepted. Adding one parent folder includes its subfolders automatically. Supported media: PNG, JPG/JPEG, WebP, MP4, WebM and MOV. Readable prompts depend on metadata actually present in those files.

Scan progress shows the current folder and visited-folder count. **Cancel scan** keeps the previous completed archive and ratings instead of replacing them with partial results. The final save cannot be cancelled. Full-drive scans may take longer. Standard system/technical folders and directory links are skipped; unreadable folders are counted as errors. The existing 200,000-media-file limit remains.

Run **UPDATE.cmd**, restart with your usual Studio shortcut and press **Ctrl+F5**. Add a drive or parent folder in the archive. Automatic refresh starts a scan after adding a root when enabled; otherwise use **Refresh archive**. Includes previous development updates and verifies backups without replacing media or archive data.

Validation covers Windows path normalization, twelve nested levels, images/video, skipped technical folders, cancellation/restart preserving the archive and ratings, and local API checks. No real whole-drive scan or automated visual browser check was performed.
