# Video workshop / Videóműhely — first working module, 2026-10-31

## Magyar

Mentsd a nyitott munkákat. Az **UPDATE.cmd** ellenőrzi és menti a korábbi
fájlokat, telepíti a videós modult, majd célzottan újraindítja a helyi Studio
szervert. Csak akkor állít le folyamatot, ha a 18819-es port tulajdonosának
parancssora pontosan ehhez a Studio-mappához tartozó Node-szervert azonosítja.
Más alkalmazást nem állít le. A képek, videók, archívum és beállítások megmaradnak.

Ha az újraindítás nem sikerül, a frissítés telepítve marad, és külön üzenetet
kapsz. A **RESTART_STUDIO.cmd** újra megpróbálja. Ne zárj be találomra Node-,
SwarmUI- vagy ComfyUI-folyamatokat. A frissített főoldalon Ctrl+F5, majd
**Videóműhely · NEW**, amely a Képműhely előtt található. Külön lapon nyílik.
Ez a frissítés a szervert is módosítja: önmagában a Ctrl+F5 most nem elég.

### Első próba

1. Húzz a munkaterületre videót, vagy használd a kiválasztógombot. A fájl
   másolata a helyi `data/video-workshop/assets` munkatárba kerül, felhőbe nem.
2. Több videó egymás után kerül az idővonalra. A kártyák húzással, illetve
   Előrébb/Hátrébb gombbal rendezhetők. Másolhatók és eltávolíthatók.
3. Kattints egy klipre: a nagy lejátszó a kijelölt forrást mutatja. A Kezdés/Vége
   beállítással vághatsz, vagy a lejátszó pillanatnyi állásából jelölhetsz pontot.
   Ez roncsolásmentes terv, az eredeti fájlhoz nem nyúl.
4. Állíthatsz sebességet, saját hangerőt, némítást, feketéből/feketébe tartó
   kép- és hangfade-et, világosságot, kontrasztot és telítettséget. A fade
   klipenkénti fel/lekeverés, nem klipek közti átlapoló crossfade.
5. A médiatár Hang hozzáadása gombja külön hangsávot tesz a projekthez.
   A hangnak saját vágása, idővonalbeli kezdése, hangereje és fel/lekeverése van.
   A kivágott hang a teljes idővonal végéig ismételhető. Hangcseréhez némítsd
   a klip saját hangját, és adj hozzá külön hangot. Több hangsáv összeadódik;
   a fő hangerő és egy csúcshatároló segít a kivezérlésen.
6. Kérj legfeljebb 8 másodperces **Rövid előnézetet**. Ez ténylegesen rendereli
   a vágást, színt és hangkeverést csökkentett méretben. A sima forráslejátszó
   nem teljes idővonal-kompozitor. Az előnézetet ne add el végleges exportként.
7. Ha megfelelő, válaszd a végleges exportot. Megszakítható, az előrehaladás
   lépésenként látható. A források sosem íródnak felül.

### Három exportút

- **Szerkesztett összeállítás:** H.264/AAC MP4, közös képméret és képkockaszám.
  Az első klip mérete/FPS-e megtartható, vagy kisebb 1080/720 kiindulás, illetve
  24/25/30/60 FPS választható. Más arányú klipek kitöltés helyett fekete
  keretet kapnak, hogy ne vágjunk le részleteket. A kép újrakódolódik. CRF 18
  a magas minőségű alap; kisebb érték nagyobb fájlt és magasabb minőséget céloz.
  A forrás 1920×1088 mérete alapbeállítással 1920×1088 marad.
- **Hangjavítás, képi adatfolyam megtartásával:** egy teljes videó szükséges,
  vágás, sebességváltás, képfade, színmódosítás, méret- és FPS-váltás nélkül.
  A hang változhat és keverhető. A program a kódolt videócsomagok SHA-256
  értékét összeveti, és eltérés esetén nem kínálja késznek a fájlt. H.264/HEVC
  videónál MP4, más kodeknél MKV készülhet. A hang újrakódolódik; ez a mód
  kizárólag a képi adatfolyam változatlanságát ellenőrzi, nem a teljes fájlét.
- **Csak hang:** az összeállított hangsáv WAV-ként menthető.

### Mentés, tárhely és határok

A projekt JSON a hivatkozásokat, ujjlenyomatokat és szerkesztési értékeket
tartalmazza, médiaadatot vagy helyi elérési utat nem. Van böngészővázlat,
de tartsd meg a letöltött projektfájlt is. Új gépen a forrásokat ismét importáld;
a tartalmi ujjlenyomat alapján kapcsolja őket a tervhez. Visszavonás/újraalkalmazás
egy munkameneten belül áll rendelkezésre. Projektből eltávolítás a helyi
médiatárban lévő másolatot és az eredeti fájlt sem törli.

A kész fájl letölthető, és a Korábbi exportok és előnézetek listájában újra
megnyitható újraindítás után is. A legutóbbi húsz látszik a felületen. A kész
eredmények helye `data/video-workshop/jobs/<azonosító>/result.*`. A saját
köztes renderfájlokat eltakarítja, a kész exportokat nem törli automatikusan.
A médiatár másolatai és exportok tárhelyet használnak; ezek még nem tartoznak
a meglévő archívumos takarítási funkció alá.

Az FFmpeg külön program. Ezen a gépen a ComfyUI meglévő példányát keresi,
illetve a PATH-on és néhány szokásos helyen keres. Nem tölt le és nem csomagol
FFmpeg-et. Más gépen a Videómotor beállítása alatt megadható meglévő, libx264
és AAC kódolást támogató FFmpeg teljes elérési útja. A ComfyUI-nak nem kell
futnia. Az export CPU-n, korlátozott szálhasználattal dolgozik; nem indít MI-t.

Első modulos korlátok: egy elsődleges videósáv, 24 klip, 12 külön hangsáv,
30 perces összeállítás, legfeljebb 4K pixelszámú kimenet, 64 médiatári elem,
fájlonként 2 GB és összesen 6 GB importált másolat. SDR-szerkesztés; HDR vagy
széles színterű forrás újrarenderelését visszautasítja. Professzionális HDR-
színkezelés, kulcsképes animáció, fedő videórétegek, feliratégetés, mozgáskövetés,
automatikus kijelölés és generatív videójavítás későbbi lépcső.
Nyolc felületi nyelv; a Studio választott nyelvén nyílik meg.

## English

Save open work and run UPDATE.cmd. It validates and backs up the installation,
installs the module and restarts only a Node server whose command line matches
this exact Studio directory and owns port 18819. Unknown processes are never
stopped. If restart needs attention, the installed update is retained and
RESTART_STUDIO.cmd can retry. Ctrl+F5 in the main Studio, then open
**Video workshop · NEW**, before Image workshop. This update changes the
server; a browser refresh alone does not activate it.

Import/drop media, arrange clips on one primary video timeline, trim In/Out,
change speed, source gain/mute, clip fades, brightness, contrast and saturation.
Separate audio tracks have trim, timeline offset, gain, fades and optional loop.
The large source player is a source/trim monitor; use the rendered short preview
(up to eight seconds) to check the actual sequence, picture effects and audio mix.
Clip fades are to/from black/silence, not overlapping crossfades.

Three export paths: edited H.264/AAC MP4, verified picture-preserving audio work,
or mixed WAV. Edited assemblies normalize dimensions/FPS with letterboxing and
re-encode picture. Source dimensions are the default: 1920×1088 is retained.
CRF 18 is the high-quality default. Picture-preserving mode requires exactly one
full clip, no trim/speed/picture fade/colour change, original size and FPS. Audio
may be replaced/mixed. Encoded video packet hashes are checked before offering
the output; mismatch fails the job. MP4 for H.264/HEVC, otherwise MKV may be used.
Audio is encoded; only the video stream, not the entire file, is verified intact.

Projects store settings and media fingerprints, without media bytes or absolute
source paths. Keep the project JSON as a backup. On another installation,
reimport the matching sources. Undo/redo is session-only. Removing timeline
items does not delete sources or cached media. Imports are local copies under
data/video-workshop/assets, never cloud uploads. Completed outputs are under
data/video-workshop/jobs/<id>/result.*; the last twenty can be reopened from the
UI after restart. Intermediate render files are cleaned; completed exports are
not automatically deleted. Imported copies and exports use local disk space and
are not yet covered by the archive cleanup UI.

Uses an existing FFmpeg with libx264 and AAC. Detects common locations, including
this machine’s ComfyUI installation, or accepts an explicitly selected local
executable. No FFmpeg binary/model is downloaded or redistributed. ComfyUI does
not need to run. CPU export uses bounded threads, without invoking AI models.

First-module limits: one primary video track, 24 clips, 12 additional audio tracks,
30-minute timeline, up to 4K pixel-count output, 64 library assets, 2 GB per file
and 6 GB imported-media budget. SDR workflow; HDR/wide-gamut re-render is refused.
Colour-managed HDR finishing, keyframe animation, video overlay layers, burned-in
titles, tracking, segmentation and generative editing are later stages. Controls
support EN/HU/DE/FR/ES/IT/PT/PL.

Implementation references: [FFmpeg stream copy](https://www.ffmpeg.org/ffmpeg.html)
and [FFmpeg filters](https://www.ffmpeg.org/ffmpeg-filters.html).
