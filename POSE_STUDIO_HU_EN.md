# Figurák és testtartások / Figures and poses

2026-11-01 — személyes frissítő / personal update

Futtasd az UPDATE.cmd fájlt, majd Ctrl+F5 a Prompt Studióban.
Oldaltérkép → NEW · Figurák és testtartások; vagy Virtuális stúdió →
Figurák és testtartások gomb. A stúdió nagy ablakában is használható.

- Legfeljebb nyolc külön figura, névvel, jelölőszínnel, megjelenéssel/szereppel.
- Nincs megadva / felnőtt férfi / felnőtt nő / gyermek / saját leírás.
  A gyermek kisebb kiinduló méretet kap; a magasság külön állítható.
- Elhelyezés, magasság és testelfordítás. Elöl- és oldalnézetben a medence
  húzása mozgatja az egész figurát. Egy ízület húzása elfordítja a csontot és
  a hozzá tartozó végtagrészt; a csontok hossza megmarad. A szögcsúszkákkal
  térben is állítható az irány. Ez sematikus ábra, nem anatómiai szimuláció.
- Forgatható térbeli nézet, külön kameranézet az export képkivágásával.
  Látható figurák a képkivágásba: a közös kamerát igazítja; a fények megmaradnak.
- Álló, ülő, lépő, térdelő és felemelt kezes alapok. A csontok hossza
  állandó, de nincs automatikus ízületi határ, ütközéskezelés vagy talajkontaktus.
- Másolás, elrejtés, eltávolítás, az utolsó pózművelet visszavonása.
  Az utóbbi csak addig elérhető, amíg más változtatás nem történt a terven.
- Mentés a meglévő stúdióbeállítások közé; a régi v1-es tervek is megmaradnak.
- A látható figurák angol leírása bekerül a közös stúdiópromptba. Saját
  megjelenés/szerep leírásához lehetőleg angol szöveget adj meg.
  A kézzel átírt stúdióprompt megmarad; új pózhoz ilyenkor kattints a
  „Leírás újraépítése a tervből” gombra. A fenti saját jelenetprompt nem változik.
- PNG és OpenPose BODY_18 JSON: a kamera kezdőállásából, a választott képaránnyal.
  Szélesség 1024 px, a magasság képarányfüggő. A nem ábrázolt szemek/fülek,
  illetve képen kívüli ízületek confidence értéke 0. Nincs kéz-/arc-részlet,
  mélység vagy mozgásszekvencia. A PNG és JSON nem tartalmaz neveket/leírásokat.
  A teljes, szerkeszthető tervhez a stúdió JSON-mentését használd.

A referencia csak kompatibilis pózvezérlő workflow-val használható célzott
vezérlésre. Nem telepít ControlNetet vagy modellt, és nem garantál pontos
pózkövetést. A lámpák és a kamera nem kerülnek a pózképre. A kameraképen kívüli
részekre figyelmeztet. Szélsőségesen nagy/térbeli csoportnál kézi kamerabeállítás
szükséges lehet. A gyermek figura is sematikus, nem anatómiai gyermekmodell.

A frissítő a nálad futó egybefűzött oldalt és a NEW-jegyzéket cseréli,
előzetes hash-ellenőrzéssel, mentéssel és hiba esetén visszaállítással.
Az archívumot, médiát, modelleket és személyes beállításokat nem módosítja.
A kiszolgálót/SwarmUI-t nem szükséges újraindítani. A teljes, moduláris
fejlesztői forrás az artifacts/Studio120_PoseStudio_TEST_20261101 mappában van.

## English

Run UPDATE.cmd, then Ctrl+F5. Open Page map → NEW · Figures and poses,
or Virtual studio → Figures and poses. The existing large studio view works too.

Up to eight articulated schematic figures share the existing studio camera,
lights, saved presets and prompt. Set optional adult man/adult woman/child
labels or a custom description, names, colours, position, height and body turn.
Children start smaller; height remains editable independently. Drag a pelvis
to move its figure in front/side view; drag another joint to rotate a fixed-length
bone and its descendant joints. Angle sliders control spatial direction.
Standing, seated, walking, raised-hand and kneeling bases are included.
Duplicate, hide, remove and undo the last pose action. Undo is invalidated by
later unrelated plan edits. Built-in lighting presets retain figures; saved
scene presets restore their own figures. Old v1 backups remain compatible.

The camera view shows the export crop. Frame all visible figures adjusts the
shared camera while retaining lights. Spatial view rotates independently.
Visible figure descriptions enter the English studio directions; user-entered
appearance/role text is retained verbatim, so English is recommended. Manually
edited directions stay unchanged until Rebuild directions from plan is pressed.

Pose PNG and OpenPose BODY_18 JSON use the starting camera and chosen aspect ratio,
1024 px wide. Missing eyes/ears and off-frame joints have confidence 0. There is
no face/hand detail, depth, animation sequence, anatomical collision solver or
automatic floor contact. The pose exports contain no names/descriptions; use
the existing studio-plan JSON backup for fully editable layouts. A compatible
pose-conditioning workflow is required; exact reproduction is not guaranteed.
No generation models or ControlNet are installed. The diagrams, including
children, are schematic rather than anatomical models.

This personal updater replaces only the self-contained served page and NEW
registry, with known-version checks, verified backups and rollback. Archive,
media and saved preferences remain intact. No backend restart is needed.
Full modular source is in artifacts/Studio120_PoseStudio_TEST_20261101.
