# Upgrade from 1.19 / Frissítés 1.19-ről

## English

This is a complete clean release, not a small patch updater. Keep your working installation until you have checked the new one.

1. Export your saved prompt collection and director plans from the old browser interface. Browser storage is separate from the application folder.
2. Stop the old Prompt Studio local server. Closing a browser tab alone does not stop it. Do not stop unrelated Node processes.
3. Extract the new ZIP into a **new writable folder**. Do not overwrite your only working copy.
4. To carry the archive and ratings forward, copy your old `data/` folder into the new folder while both Studio servers are stopped. Optionally copy your private `addon-library-roots.json` if you want the same local add-on locations. These files contain private paths; never upload them.
5. You may copy your existing compatible `runtime/` folder locally, or let `START.cmd` find Node.js 22+ or offer its portable setup. Do not copy old `dist/` or server files over the new version.
6. Start the new **START.cmd**. Use **CHECK.cmd** to confirm **1.20.0**. Check the folders, a known recipe and a saved rating before changing your shortcut to the new location.

The normal address remains `http://127.0.0.1:18819/`. At the same address/browser profile, stored UI choices and saved prompts may remain; they are not included in this ZIP. A truly fresh installation without copied data starts with an empty archive.

If you use your own shortcut that also starts portable Ollama, keep it as a private local setup and point its Studio step to the new installation. The public package does not include your shortcut or AI models.

## Magyar

Ez teljes, tiszta kiadás, nem kis javítócsomag. A működő telepítést tartsd meg az ellenőrzésig.

1. A régi felületről exportáld a mentett promptokat és rendezői terveket. A böngésző tárhelye különbözik a program mappájától.
2. Állítsd le a régi Studio helyi kiszolgálóját. A böngészőfül bezárása kevés; más alkalmazások Node-folyamatait ne állítsd le.
3. Az új ZIP-et **új, írható mappába** bontsd ki. Ne az egyetlen működő példányt írd felül.
4. Az archívum és értékelések átviteléhez leállított kiszolgálók mellett másold át a régi `data/` mappát. Ha szükséges, a saját `addon-library-roots.json` fájlt is. Ezek magánútvonalakat tartalmaznak, nyilvánosan ne töltsd fel őket.
5. A kompatibilis `runtime/` mappát helyben átveheted, vagy az új indító megkeresi a Node.js 22+-t/felajánlja a telepítését. Régi `dist/`-et és kiszolgálót ne másolj az újra.
6. Indítsd az új **START.cmd**-t; a **CHECK.cmd**-vel ellenőrizd az **1.20.0** verziót. Nézz meg egy ismert receptet és értékelést; utána állítsd át a parancsikonodat.

A megszokott cím megmarad: `http://127.0.0.1:18819/`. Ugyanabban a böngészőprofilban megmaradhatnak a korábbi választások és mentett promptok; ezeket a ZIP nem tartalmazza. Másolt adatok nélküli új telepítésben az archívum üres.

Ha a saját parancsikonod a hordozható Ollamát is indítja, azt tartsd meg helyi beállításnak, és a Studio-indítási lépést irányítsd az új mappára. A nyilvános csomagban nincs személyes parancsikon vagy MI-modell.
