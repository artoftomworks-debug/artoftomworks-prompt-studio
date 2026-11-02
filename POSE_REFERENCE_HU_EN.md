# Póz referenciaképe / Pose reference image

2026-11-01

Zárd be a korábbi külön pózlapot. UPDATE.cmd, Ctrl+F5 a Studio főlapján,
majd Figurák és testtartások → Megnyitás új lapon.

A jobb oldali oszlop tetején: Póz referenciaképe.
1. Kép kiválasztása / behúzása, vagy közvetlenül az előnézetre dobhatsz egy képet.
2. Állítsd a Referencia láthatóságát és a Kép méretét.
3. Vízszintes/függőleges eltolás és elfordítás segíti az igazítást.
4. Kép mozgatása egérrel: a képet húzza, a figurát nem. Kapcsold ki,
   amikor ismét a figurákat/ízületeket szeretnéd állítani. Esc visszavonja a húzást.
5. A Referencia megjelenítése pipával összehasonlíthatod az önálló pózt.
   A Kép igazításának visszaállítása a méretet, helyet és elfordítást állítja vissza.

A referencia mögött nem változik meg a fotó; csak egy 2D vizuális segédréteg.
Nincs MI-elemzés, automatikus pózfelismerés vagy a fotóból kiszámított 3D-jelenet.
A figurák helyzetét kézzel állítod. A nagyítás/eltolás együtt viszi a segédképet
és a póznézetet; a figura módosítása nem illeszti automatikusan újra a hátteret.
A kameranézetben a kép a kamera képkivágására korlátozva jelenik meg.

A jobb oldali oszlop külön görgethető. Kép nélkül is használható a szerkesztő.
A kép elrejthető/eltávolítható a póz módosítása nélkül. PNG, JPG, WebP és AVIF
fogadható el, legfeljebb 12 MiB és 48 megapixel méretig. Nagy képből legfeljebb
2048 px hosszabb oldalú böngészős előnézet készül; az eredeti fájl érintetlen.

A kép és igazítása csak az adott munkalapon, ideiglenesen marad meg.
Nem kerül a promptba, póz-PNG-be, BODY_18 JSON-ba, mentett jelenettervbe,
archívumba vagy böngészős helyi tárba. A Studio saját helyi kiszolgálójához
sem töltjük fel. A figurák mentése ettől függetlenül megmarad.
A Megnyitás új lapon gomb a forráslapon éppen betöltött referenciát és
az igazítását is átviszi az új böngészőlapra, böngészőn belül. A már nyitott
lapok képei nem szinkronizálódnak automatikusan. Ha bezárod a képet tartalmazó
munkalapot, egy későbbi újranyitáskor újra be kell húzni a referenciaképet.

## English

Close old pose tabs, run UPDATE.cmd, Ctrl+F5, reopen the workspace.
Pose reference image appears at the top of the right column. Choose a local
image or drop it onto the preview; adjust opacity, size, offsets and rotation.
Enable Move image with mouse to drag the reference without posing the figures;
disable it to edit joints again. Esc cancels a reference drag. Hide/remove/reset
alignment are available. PNG/JPG/WebP/AVIF up to 12 MiB and 48 megapixels; large
images use a maximum 2048 px long-edge preview. Original files are unchanged.

The underlay is a 2D visual guide, not AI pose detection or a reconstructed
3D scene. Align the figures manually. Pan/zoom preserve image/pose registration;
editing the figure does not automatically refit the background. Camera view
clips the reference to the export camera frame. The right sidebar scrolls
independently so the picture stays visible.

Images and alignment remain temporary, private to the workspace tab. They do
not enter prompts, pose PNG/BODY_18 exports, saved scene JSON, archive, local
storage or uploads to the local Studio server. Saved figure poses remain intact.
Open in new tab carries the current reference and calibration to the new tab
within the browser. Already-open tabs do not automatically synchronise images.
After closing the reference tab, choose/drop the image again when needed.

Known-version checks, verified backups and rollback protect the served page
and NEW registry. No media or saved settings are removed; no SwarmUI restart.
