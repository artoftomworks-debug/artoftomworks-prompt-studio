# Videó-metaadat javítás és fájlútvonal másolása / Video metadata and file path copy

2026-10-31

## Magyar

A közvetlenül futtatható UPDATE.cmd a megszokott Studio119 telepítést és a ténylegesen használt ComfyUI backend meglévő Prophetero segédjeit frissíti, mappaválasztás nélkül. Minden fájlt ellenőriz, mentést készít, és ismert előzményt fogad el. Hiba esetén visszaállítja az addig lecserélt fájlokat. Az archívum, beállítások és forrásvideók megmaradnak.

- A kép- és videónézőben új gomb: **Fájl elérési útjának másolása**. Mind a nyolc nyelven elérhető, NEW jelöléssel.
- Audio Fix, Take Mixer, Video Studio interpolálás/felskálázás és Loop Lab: a jövőbeli MP4 exportok megőrzik a forrásban már meglévő generálási adatokat.
- Prompt Studio Videóműhely: egyetlen képi forrásból készült exportnál megmarad az eredeti generálási recept. Több különböző forráskliphez nem rendelünk megtévesztően egyetlen promptot.
- A megadott Audio Fix-példához előkészítettük az adatok visszaállítását. Az eredeti képi adatfolyam egyezésével azonosítottuk a forrást. A javított példány kép- és hangadatfolyama változatlan; az eredeti példányról külön .bak mentés készül a célmappa mellett.
- A megőrzött prompt a **forrás generálásának** receptje, nem az utófeldolgozott klip pontos újraalkotási leírása. A feldolgozás jelzése külön metaadatmezőbe kerül. A Loop Lab mellé továbbra is kerül feldolgozási JSON.
- Korábbi, már adat nélküli videóknál a recepthez az eredeti vagy hiteles kísérőadat szükséges. A program nem talál ki hiányzó promptot. Ez a csomag egyetlen, ellenőrzött korábbi videót állít helyre automatikusan.

Futtatás előtt állítsd le a SwarmUI/ComfyUI folyamatot, majd UPDATE.cmd. A frissítés után indítsd újra a SwarmUI-t, hogy betöltse a módosított segédprogramokat. A Studio saját kiszolgálóját a frissítő külön újraindítja; a böngészőben Ctrl+F5 után nyisd meg a nézőkét. Az archívum frissítése után a javított példány receptje is megjelenik.

Ez személyes frissítő: a private-repair mappában saját videód szerepel. Ezt a teljes frissítőcsomagot ne használd nyilvános kiadásként.

## English

- Added **Copy file path** to both media viewers, with all eight interface languages and a dismissible NEW label.
- Audio Fix, Take Mixer, Video Studio interpolation/upscaling and Loop Lab now retain available source generation tags in future MP4 exports.
- Prompt Studio Video workshop retains the original generation recipe for exports using one picture source, including edited versions. Multi-source assemblies do not claim a single source prompt.
- The supplied Audio Fix example has a prepared metadata recovery, based on an identical encoded picture stream. Both output picture and sound packets were verified unchanged. The installer retains a backup of the previous file.
- Retained generation settings describe the original source, not an exact recipe for the processed result. Processing is marked separately; Loop Lab also writes its processing sidecar.
- Historical metadata cannot be recovered without an authentic source or record. Only the specifically verified example is repaired automatically.

Stop SwarmUI/ComfyUI before running UPDATE.cmd and restart it afterwards. Refresh Prompt Studio and its archive. The personal updater checks known predecessors, backs up changed files, and rolls back committed changes on failure. This personal package contains the user's example video and is not a public release archive.

## Verification

Real FFmpeg checks: original/muted Audio Fix exports; Take Mixer picture-source metadata; interpolation/upscale muxing; Loop Lab; 70 KB custom tags; Prompt Studio audio-only, rendered and multi-source exports. Existing Audio Fix and Loop Lab suites pass. Both viewer path-copy handlers were checked for exact paths, eight languages and clipboard failures. Installer fixture checks cover backups, repeated execution, unchanged personal data, unknown/damaged-file refusal and rollback after a locked target. No live UI acceptance test or live installation is implied by these checks.
