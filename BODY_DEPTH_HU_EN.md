# Testmodell és mélységnézet / Mannequin and depth layers

2026-11-01

INDÍTÁS
1. Futtasd az UPDATE.cmd fájlt. A frissítő előbb ellenőriz és mentést készít.
2. Zárd be a külön pózlapot, indítsd újra a Studiót a megszokott indítóddal,
   és onnan nyisd újra a Figurák és testtartások nagy szerkesztőjét.
3. Az oldalsáv tetején nyisd le a Megjelenítési rétegek részt.
4. Pipáld be az Áttetsző testmodell és/vagy Testmodell mélységtérképe nézetet.
   A Csontváz külön kapcsolható. A modell és a mélységréteg láthatósága
   két külön százalékos csúszkán állítható.
5. A figura pózát, méretét és elfordulását a meglévő kezelőkkel módosítsd.
   Elöl-, oldal- és térbeli nézetben a testmodellre is kattinthatsz: a hozzá
   tartozó ízület kiválasztható és mozgatható. Kameranézetben nincs pózhúzás.
6. A Testmodell PNG mentése és Mélységtérkép PNG mentése gombok az előnézet
   alatt vannak. Mindkettő a stúdió kamerájából, a beállított képaránnyal
   exportál. Ha a képkivágás rossz, állíts a kamerán vagy használd az igazítást.

MIT MUTAT?
A sematikus, részletezetlen bábu a kézzel beállított csontvázra épül.
Követi a pózt, méretet, elfordulást és több figura egymáshoz viszonyított helyét.
A takarás pixelmélység alapján számított. Nem fényképből rekonstruált test,
nem automatikus pózfelismerés, és nincs anatómiai vagy ütközési szimuláció.

A mélységtérkép kizárólag a beállított bábu-jelenet relatív kameramélysége:
közel világos, távol sötét, a háttér fekete. Nem az eredeti fotó mért mélysége.
Nem készül fényképelemzés, és nem töltünk le külön MI-modellt.
A PNG a kameranézetet használja, nem az elöl-/oldalnézeti munkanézet nagyítását.
A bábu exportja átlátszó háttérre, a mélységé fekete háttérre készül.
Az előnézeti átlátszóság nem gyengíti az exportot. A referenciakép, nyilak,
rács és feliratok egyik exportba sem kerülnek. A bábu-PNG vizuális referencia;
a mélység-PNG-hez kompatibilis depth vezérlőmodell és workflow szükséges.

A nézeti rétegek nem módosítják a promptot, mentett jelenetet, családi
figurákat vagy a korábbi BODY18 PNG/JSON exportot. A rétegválasztás és az
átlátszóság átkerül a Megnyitás új lapon gombbal; nem része a mentett jelenetnek.
A NEW jelzés a fejlesztést mutatja és kézzel kikapcsolható. Nyolc nyelv támogatott.

ENGLISH
Run UPDATE.cmd, close old pose tabs, restart Studio with your normal launcher
and reopen the pose workspace. Expand Display layers at the top of the sidebar.
Enable Translucent mannequin, Mannequin depth map and/or Skeleton independently;
set mannequin and depth opacity with the sliders. Click body parts to select
joints in editable views; the camera view remains read-only.

Mannequin PNG and Depth PNG export buttons are below the preview. They use the
studio camera and selected aspect ratio, at full opacity, without the reference,
arrows, labels or grid. Mannequin PNG has a transparent background; depth PNG
has black background. Existing BODY18 PNG/JSON behaviour is preserved.

This is a schematic, featureless mannequin driven by the edited skeleton, not
photo reconstruction or automatic pose estimation. The relative depth map is
rendered from the mannequin scene: near is bright, far is dark. It is not measured
photo depth. No AI model is downloaded. Mannequin PNG is a visual reference;
depth conditioning requires a compatible model and workflow. Anatomical joint
limits and collision simulation are not implemented.

Layer choices are carried to a newly opened workspace tab but remain view
preferences, outside saved scene JSON and prompts. Existing scenes and personal
media remain unchanged. All eight UI languages and the dismissible NEW badge
are included.

VERIFICATION
Geometry, pose/height transforms, multiple-figure occlusion, per-pixel depth,
near-plane clipping, export framing/pixels, layer controls and opacity, state
preservation, tab transfer, all languages and existing pose regressions tested.
The actual renderer output was visually inspected in BODY_DEPTH_PREVIEW.png.
Browser UI geometry was not visually inspected. Updater checks cover known
versions, backups, repeat install, corrupt payload refusal and rollback.
