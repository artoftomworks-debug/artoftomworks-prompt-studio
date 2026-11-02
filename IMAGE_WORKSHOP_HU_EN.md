# Image workshop / Képműhely — first working edition, 2026-10-31

## Magyar

Indítsd az UPDATE.cmd fájlt. A frissítő ellenőrzött biztonsági mentés után
csak a Prompt Studio egyfájlos felületét cseréli. Mentsd a nyitott promptokat,
majd a Studio lapján Ctrl+F5. A szervert nem kell újraindítani.

A **Képműhely · NEW** a Virtuális stúdió előtt található, a funkciókeresőben is
elérhető. A **Képműhely megnyitása külön lapon** gomb önálló munkalapot nyit.
A böngészőnek engednie kell az új lap megnyitását. A meglévő Fényműhely megmarad.

1. Húzz a nagy munkaterületre egy képet, vagy válaszd a Kiindulókép megnyitását.
2. A kezdő tónusrétegen állíts expozíciót, kontrasztot, árnyékot, csúcsfényt,
   meleg–hideg színegyensúlyt és telítettséget. Több réteg is hozzáadható.
3. A **Maszk / kijelölés → Üres kijelölés** után fesd ki az érintett részt.
   A türkiz maszkjelzés segít látni, hol hat a réteg. Ecset, kivonó ecset,
   téglalap, ellipszis, lágy szél és megfordítás használható. Exportba a
   türkiz jelölés nem kerül bele.
4. A fényréteget a napjelölőnél fogva mozgathatod. A képen, kijelölt fénynél
   a görgő az erősséget, Shift + görgő a színárnyalatot állítja. A Ctrl / Cmd
   görgő továbbra is a böngészőé. A fény szemléltető 2D hatás.
5. Saját háttérhez/égbolthoz adj hozzá **Kép- vagy háttérréteget**. Teljes képként
   jelenik meg; Üres kijelölésből fesd ki, hol fedje az eredetit. A Réteg
   mozgatása eszközzel helyezd el, majd méretezd/forgasd. Automatikus alany- és
   égboltfelismerés, illetve generatív tárgyeltüntetés még nincs bekötve.
6. Az **Előtte–utána** pipával a képre kerül a fogható választóvonal. Bal–jobb
   és fent–lent irányban is húzható; a fogantyú nyílbillentyűkkel, Home/End
   gombbal is mozgatható. Közben a szerkesztés nem változik. A pipa kikapcsolása
   után folytatható a festés és rétegmozgatás.
7. Kép mozgatása: húzd a nézetet a kéz eszközzel; nagyítást a felső választóval
   állíts. A jobb oldali vezérlők külön görgethetők. Visszavonás/újraalkalmazás,
   valamint Ctrl/Cmd+Z és Shift+Ctrl/Cmd+Z rendelkezésre áll.

**Projekt mentése:** letölthető JSON, és ha a böngésző engedi, egy helyi vázlat
is készül. Rétegek, kijelölések, beállítások, alapprompt, kézzel szerkesztett
prompt, cél és alkotói jegyzet mentődik. Képadat nem kerül a JSON-ba vagy a
böngészőtárba. Újranyitáskor csatold vissza a szükséges képeket: tartalmi
ujjlenyomatot ellenőriz, a fájlnév önmagában nem elég. A visszavonási előzmény
csak a jelenlegi munkamenethez tartozik. Fontos munkáról tartsd meg a JSON-t.

**Export:** PNG az eredeti kép pixelszélességével és pixelmagasságával. A
véglegesítés az eredeti képből számol; a kisebb előnézet nem exportforrás.
A fájl újonnan kódolt, szerkesztett kép, nem az eredeti bitfolyam másolata.
Az eredeti fájlt nem írja felül. Ez böngészős, 8 bites szerkesztő; nem RAW- és
nem professzionális színprofilkezelő. EXIF-et és generálási metaadatot nem
másol át. JPEG/PNG/WebP/AVIF, legfeljebb 24 MP és 40 MB képenként, 16 réteg.
A memóriaigényt egy további korlát is fogja: összesen legfeljebb 48 MP
betöltött képi eszköz. Nagyobb összeállításnál ments, majd nyisd újra a
projektet a már felesleges visszavonási képek elengedéséhez.

**Alkotó → MI → alkotó:** a tónusokból és fényekből angol látványjavaslat épül.
Kézzel is átírhatod; a csúszkák ezt nem írják felül. Az Újraépítés gomb külön
kérésre generálja újra. A cél és tapasztalat az MI-nek másolható összefoglalóba
kerül. Az Alkotói tapasztalat mentése legfeljebb 50 helyi bejegyzést és külön
letölthető jegyzetet tárol. Ez visszajelzési napló, nem modell-újratanítás.
A prompt nem visz át pixelmaszkot, és nem garantál azonos generált eredményt.
Sem kép, sem visszajelzés nem kerül automatikusan külső MI-hez.

## English

Run UPDATE.cmd, save open Studio drafts, then Ctrl+F5. No server restart is
needed. Find **Image workshop · NEW** before Virtual studio, or through the
function finder. Open its separate local editor tab and choose/drop an image.

- Non-destructive layer stack: global/local exposure, contrast, shadows,
  highlights, warmth and saturation; movable 2D light accents; your own image
  overlays for manually masked background/sky replacement.
- Brush/subtract, rectangle and ellipse masks, inversion, feathering and a
  temporary mask overlay. Automatic subject/sky detection and generative
  replacement are not connected in this first edition.
- Zoom/pan, draggable vertical/horizontal before/after divider, keyboard
  divider controls, gesture-based undo/redo and independently scrolling tools.
- Light marker drag; wheel over the preview adjusts selected light strength,
  Shift+wheel changes hue. Browser zoom shortcuts are preserved.
- JSON project export and optional browser draft. Original image fingerprints
  verify reattachments after reopening; images are not stored in JSON or local
  browser storage. Undo history is session-only. Keep the project JSON backup.
- Source-dimension PNG export re-renders from the original image, without
  preview markers or comparison clipping. Edited pixels are re-encoded; this
  is not byte-preserving export, a RAW editor or a colour-managed professional
  pipeline. Original files are untouched. Original EXIF/generation metadata
  is not copied to the PNG.
- PNG/JPEG/WebP/AVIF, up to 24 MP and 40 MB per image, 16 layers and a 48 MP
  budget for loaded image assets (including undo-retained images). Save and
  reopen the project to release obsolete undo resources.
- Editable English appearance directions preserve manual prompt changes.
  Copy the prompt alone or an AI brief including the creator goal and review.
  Save up to 50 local feedback entries plus downloadable review JSON. This is
  an explicit feedback loop, not model retraining. Text cannot transfer pixel
  masks or promise an identical generated result. No automatic AI/network calls.

All controls support EN/HU/DE/FR/ES/IT/PT/PL. The selected Studio interface
language is used when opening the tab. The existing reference light planner,
archive, media and previous saved preferences are preserved. NEW is explicitly
dismissible, independently of previously dismissed features.
