# Térbeli pózszerkesztés / Spatial pose controls

2026-11-01

Zárd be a régi külön pózlapot. Futtasd az UPDATE.cmd fájlt, majd Ctrl+F5 a
Studio főlapján. Figurák és testtartások → Megnyitás új lapon.
A korábban megnyitott külön lap a régi kódot futtatja: újra kell nyitni.

## Kezelés

- Térbeli nézetben is kijelölhető és közvetlenül húzható minden ízület.
  Szabad húzás: a nézet síkjában mozgat, megtartva a nézet irányú mélységet.
- Piros X / zöld Y / kék Z fogantyúk: húzás egy világkoordináta-tengely mentén.
  A végtag hossza és elérhetősége korlátozhatja a tényleges mozgást.
  A néző felé mutató tengely halvány: fordíts a nézeten vagy használd a számmezőt.
- A medence húzása az egész figurát helyezi át. Kéznél/lábnál a célpontkövetés
  két csontot igazít, így a könyök/térd is követi a célpontot. Ez kikapcsolható.
  Más ízületeknél a csont és a hozzá tartozó végtagrész elfordul.
- Shift: finom húzás, tizedes érzékenységgel. Mozgás közben is kapcsolható.
- Ctrl vagy Lépésközre illesztés: a Mozgatás lépésköze (cm) szerint igazítja
  az elmozdulást. A kijelölt nyílon a kurzorbillentyűk is léptetnek; Shift finomít.
- Esc: az aktuális húzás megszakítása, mentés nélkül.
- Üres terület húzása térbeli nézetben: forgatás. Középső gomb: nézeteltolás.
  Elöl-/oldalnézetben az üres terület húzása is eltol. Görgő: 50–400% nagyítás,
  az egér alatti pont megtartásával. Dupla kattintás egy ízületen: középre igazítás.
- A nézet forgatása, eltolása és nagyítása nem változtatja az export kameráját.
- Ízület X/Y/Z: a kijelölt ízület célpozíciója, méterben. A csontok nem nyúlnak;
  elérhetetlen célpontnál a legközelebbi elérhető állás és figyelmeztetés látszik.
- 40 lépéses Visszavonás / Újraalkalmazás. Ctrl+Z / Ctrl+Shift+Z a rajzfelületen.
  Szöveg- és számmezőben a billentyűkombináció nem veszi el a szokásos szerkesztést.
  Másik lapon végzett módosítás érvényteleníti a régi helyi visszavonási sort,
  hogy ne írhassa felül a frissebb jelenetet.
- Kijelölt póz tükrözése: a test két oldalát felcseréli; a név, megnevezés,
  magasság és a figura helye megmarad.

Ez továbbra is sematikus póztervező. A csontok hossza megmarad, de nincs anatómiai
szöghatár-, ütközés- vagy talajkontaktus-szimuláció. Az exportálható PNG és
BODY_18 JSON az előző verzióval kompatibilis, és nem tartalmazza a szerkesztési
nyilakat, rácsot vagy címkéket. Kompatibilis pózvezérlő workflow szükséges a
referencia célzott használatához; a pontos generálási eredmény nem garantált.

A régi figurák, mentett jelenetek, előnézetek és archívum megmaradnak.
A frissítő a kiszolgált egybefűzött felületet és NEW-jegyzéket ellenőrzi,
mentéssel frissíti, hiba esetén visszaállítja. SwarmUI-újraindítás nem szükséges.

## English

Close old separate pose tabs. Run UPDATE.cmd, Ctrl+F5 in Studio, then open a
new pose tab. An already-open tab keeps running its previous code.

Direct dragging now works in the spatial view. Free dragging uses the view plane;
coloured world-axis handles constrain the requested motion to X (red), Y (green)
or Z (blue). A nearly view-aligned handle is faded: rotate the view or use the
joint coordinates. A pelvis drag moves the complete figure. Optional two-bone
hand/foot target following bends the elbow/knee while preserving segment lengths.
Other joints rotate their bone and descendants. Unreachable targets show the
nearest reachable position and a warning. No anatomical limits, collisions or
floor-contact simulation are implemented.

Shift gives fine movement, including when pressed during a gesture. Ctrl or the
snap checkbox quantises the displacement by the configured step in cm. Focused
axis handles support arrow-key nudges; Shift nudges more finely. Esc cancels the
current gesture without saving. Spatial empty-space drag orbits; middle drag
pans; front/side empty-space drag also pans. Wheel zooms 50–400% about the pointer.
Double-click a joint to centre it. Navigation never changes the export camera.

Joint world-coordinate fields, pose mirroring and a 40-step undo/redo history
are included. Ctrl+Z / Ctrl+Shift+Z work outside text/number fields. External-tab
changes invalidate the local history to protect newer saved scenes. Old scenes,
shared-tab persistence, editable directions and PNG/BODY_18 exports are retained.
Editing handles, grid and labels do not enter the pose exports. Eight languages.
Verified backups, known-version checks and rollback; no backend restart required.
