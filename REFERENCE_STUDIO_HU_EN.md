# Referenciaképes Fényműhely / Reference image lighting studio — 2026-10-30

## Magyar

1. Indítsd az UPDATE.cmd fájlt. A megszokott E:\SwarmUI_stuffs\Studio119 telepítést frissíti.
2. Mentsd a nyitott szövegvázlatokat, majd Ctrl+F5 a Studio lapján.
   Nem kell újraindítani a helyi szervert.
3. Az Újdonságok gombból nyisd meg a Referenciaképes Fényműhelyt. A Virtuális
   stúdió része, NEW jelöléssel; a funkciókeresőben fény vagy stúdió is odavezet.

ELSŐ PRÓBA
Húzz egy képet a fekete előnézeti területre, vagy használd a képválasztót.
PNG, JPEG, WebP és AVIF támogatott, legfeljebb 40 MB és 40 megapixel méretig.
A kép helyben töltődik be. Nincs MI-hívás, feltöltés vagy háttérgenerálás.

Helyezd a piros célpontot az alanyra. A számozott lámpák helyét húzással,
erősségüket, lágyságukat és színüket a csúszkákkal állíthatod. Azonos lámpák
szerepelnek a referenciaképen és a meglévő térbeli ábrán. Húzáskor az oldalirány
és magasság változik; a mélységet a sematikus stúdióban állíthatod.
A lámpajelölők nyílbillentyűkkel is mozgathatók.

Az előtte/utána választó az eredetit és a fényvázlatot mutatja. Külön kapcsolóval
csak az eredeti kép is látható. Az előnézeti expozíció, kontraszt, telítettség és
fényvázlat-láthatóság külön vizuális segédlet; nem generálási modellparaméter.

KAMERATERV
A kamera alany körüli szöge, magassága és objektívje is állítható. Ezeket a
térbeli ábra és az angol prompt követi. A referenciakép perspektíváját nem
számítja újra. Ez szemléltető 2D fényhatás a meglévő képen, nem mélység- vagy
árnyékrekonstrukció. A generáló pontos követése továbbra sem garantált.

MENTÉS ÉS FOLYTATÁS
A Fény- és kameraterv másolása az aktuális tervből készít teljes angol leírást.
A közös stúdió kimenete és külön promptmezőbe átvitele is tovább használható.
A kézzel átírt régi leírás megmarad; újraépítéséhez a meglévő gombot használd.

A Beállítás mentése a meglévő névvel menthető stúdióbeállításokhoz vezet.
Legfeljebb 30 beállítás tartható meg. A lámpák, kamera, célpont és előnézeti
számértékek mentődnek; a kép nem kerül sem a böngészőtárhelyre, sem a JSON-ba.
A következő képnél ugyanazt a mentett tervet választhatod ki. Újranyitás után
a referenciaképet újra be kell húzni. Korábbi stúdiómentések is betölthetők.

Az Előnézet mentése PNG-be jelölők nélküli fényvázlatot ment, legfeljebb
1600 × 1100 pixel befoglaló méretben, az oldalarány megtartásával. Ez előnézet,
nem teljes felbontású újrafényelt késztermék. A forrásképet nem módosítja.

A csúszkák húzás közben csak az előnézetet frissítik; elengedéskor mentenek.
Megszakított húzás vagy sikertelen mentés esetén a korábbi értékek állnak vissza.
Nyolcnyelvű felület, sötétkék/fekete mód. A NEW külön elrejthető. A frissítő
ellenőrzött biztonsági mentés után csak a beépített felületet cseréli; a média,
archívum, próbák és korábbi beállítások megmaradnak.

## English

Run UPDATE.cmd, save open drafts, then Ctrl+F5. No server restart needed.
Open the new reference image lighting workshop through What's new, or find it
inside Virtual studio. Function search for light/studio also locates it.

Drop/select a local PNG, JPEG, WebP or AVIF reference up to 40 MB / 40 megapixels.
No AI request, upload or generation runs. Move the red subject target, drag the
numbered lights, and adjust shared intensity, source size/softness, temperature
or coloured gel. The same lamps drive the existing studio diagram and prompt.
Dragging changes sideways position and height; depth stays in the schematic.
Arrow keys also move markers. Before/after and original-only views are available.

Exposure, contrast, saturation and sketch visibility are separate visual aids,
not generation settings. Camera orbit angle, height and lens update the actual
schematic plan and English directions. They do not reconstruct a new viewpoint
in the photo. The image preview uses illustrative 2D light washes, not depth,
shadow reconstruction or physically accurate relighting. Model adherence varies.

Copy the current light/camera directions, or use the existing separate-section
handoff. Manually edited older studio text is retained until rebuilt explicitly.
Save this setup opens the existing named setup controls (up to 30). They retain
lamps, camera, target and numeric preview settings, not image data. Existing
studio backups remain compatible. Reuse a named setup with another reference;
reselect the image after reopening. No source image is modified or deleted.

Preview PNG export saves a marker-free sketch up to 1600 × 1100 bounding pixels,
preserving aspect ratio. It is not a full-resolution relit deliverable.
Slider/marker gestures preview live and save on release; cancellation or failed
writes restore the prior values. Eight-language controls, navy/black themes and
dismissible NEW. The updater replaces only the bundled interface with a verified
backup first; archive/media and earlier saved work/settings remain intact.
