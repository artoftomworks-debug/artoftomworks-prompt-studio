# Képműhely: gyorsabb alkotói munka / Image workshop: faster creative work

2026-10-31 · Additional working update after the first Image workshop edition.

## Magyar

Mentsd a szerkesztett projektet, és **zárd be a külön Képműhely-lapot is**.
Indítsd az UPDATE.cmd fájlt, majd a Prompt Studio főlapján Ctrl+F5.
A Képműhelyt ezután nyisd meg újra a Studio gombjával. A régen megnyitott
szerkesztőlap a korábbi kódot futtatja; a főlap frissítése azt nem cseréli le.
Szerver-újraindítás nem kell. A frissítő ellenőrzött mentést készít, és csak
a beépített felületet cseréli. A média és a korábbi beállítások megmaradnak.

### Javasolt és kész kiindulások

A felső **Javasolt kiindulás** az eredeti kép világosságát, sötét részeit és
csúcsfényeit vizsgálja, és egy visszafogott tónusreceptet alkalmaz. Nem MI,
nem arc- vagy tárgyfelismerés, és nem ismeri a képpel elérni kívánt hangulatot.
Vond vissza, ha a te jelenetedhez nem illik; minden érték továbbállítható.

A jobb oszlop tetején a **Látványreceptek** nyitható polc található. Öt
kiindulás: természetes, lágy portré, esős kávézó, termékfotó, filmes éjszaka.
Válassz receptet, állítsd a következő alkalmazás erősségét, majd alkalmazd.
Az erősség az új rétegek hatását skálázza; a csúszka önmagában nem írja át
a már alkalmazott rétegeket.

A **Meglévő tónus- és fényrétegek cseréje** pipa alapból be van kapcsolva.
Így nem halmozódnak véletlenül az egymás után próbált látványok. Kikapcsolva
az új rétegek a régiek fölé kerülnek. A képrétegek, az alapprompt, a kézzel
átírt prompt, a cél és a jegyzetek megmaradnak. Mindkét művelet visszavonható.
A lecserélt tónus-/fényrétegek helyi maszkjai is csak visszavonással hozhatók
vissza; fontos változatról előbb ments projektet.

### Saját receptek

Adj nevet, majd válaszd a **Mostani fények és színek mentése** gombot.
A receptbe a látható tónus- és fényrétegek értékei kerülnek. Képfájl, háttér,
helyi maszk, prompt és személyes jegyzet nem kerül bele. Új képen a recept
globálisan indul; a kijelöléseket az új jelenethez kell megfesteni.

Legfeljebb 24 saját recept menthető ebben a böngészőben. A **Saját receptek
exportja** JSON-biztonsági másolatot készít. Az import hozzáad, nem írja felül
a korábbi recepteket; azonos nevű bejegyzések is külön példányok maradnak.
A saját recept eltávolítása a már szerkesztett képet nem módosítja.

A receptpolc elkülönül a projektfájltól: a projekt a konkrét szerkesztést,
a receptexport az újrahasználható látványokat menti. Tartsd meg mindkettőt.
Másik lap egyidejű mentése vagy tárolási hiba esetén a korábbi polcot nem
írja felül. A **Receptpolc újraolvasása** frissíti a mentett listát.

### Kényelmesebb szerkesztés

- Az ecset körvonala a tényleges festési átmérőt mutatja, nagyításkor is.
  A kivonó ecset vöröses körrel jelenik meg. A kör nem kerül az exportba.
- B = ecset, E = kivonás, V = rétegmozgatás, H = képmozgatás,
  `[` / `]` = ecsetméret. Szövegmezőben ezek rendesen gépelhetők.
- A rétegsor melletti pipával közvetlenül ki-be kapcsolható a réteg.
  A kiválasztott réteg a **Kijelölt réteg másolata** gombbal duplikálható,
  maszkkal együtt, önálló új példányként.
- Az előtte–utána csík húzása és a maszk mutatása a már kiszámolt képet
  használja; nem futtatja újra szükségtelenül az összes tónus- és fényhatást.
- Az angol látványjavaslat a tónusrétegek erősségét is figyelembe veszi.
  A saját, kézzel szerkesztett promptot továbbra is csak külön Újraépítéssel
  cseréli le. A szöveg látványcélt ad, pontos újragenerálást nem garantál.

Az automatikus MI-s kijelölés és generatív tárgycsere továbbra sincs bekötve.
Nincs új modellletöltés, képfeltöltés vagy automatikus MI-hívás.
Nyolc nyelv, újra megjelenő, külön elrejthető NEW a Képműhelynél.

## English

Save the current project and **close the separate editor tab too**. Run
UPDATE.cmd, Ctrl+F5 in the main Studio tab, then reopen Image workshop through
its button. An already-open editor tab keeps its old code. No server restart
is required. The updater verifies and backs up the previous bundled interface.

- **Suggested starting point:** gentle source-brightness, shadow and highlight
  analysis. A reversible technical starting point, without AI/semantic analysis
  or knowledge of your intended mood.
- **Looks shelf** above the layers: natural, soft portrait, rainy café, product,
  cinematic night. Set strength for the next application, then apply.
- **Replace tone/light layers** is on by default to avoid accidental stacking.
  Turn it off to add new layers above existing edits. Image layers, scene text,
  manual prompts, goal and notes are retained. Undo restores replaced layers
  and masks; save a project before replacing an important local treatment.
- Save up to 24 named recipes. They contain visible tone/light settings only,
  never image assets, local masks, prompts or review notes. On a new image the
  recipe starts globally; paint any local selections for that new scene.
- Recipe JSON export/import is separate from project JSON. Imports add distinct
  recipes rather than replacing existing ones. Browser write errors and stale
  cross-tab writes cannot silently overwrite an earlier saved shelf.
- Visible brush-size cursor, reddish subtract cursor, B/E/V/H tools and square
  bracket brush-size shortcuts. Typing in fields is unaffected.
- Quick per-layer visibility, duplicate selected layer including its mask, and
  undo support. Comparison and mask-overlay views reuse computed pixels instead
  of rerunning the entire image-effect pipeline.
- English direction wording now respects tone-layer strength. Manually edited
  prompts remain protected until explicitly rebuilt. This remains descriptive
  intent, without a guarantee of identical generative reproduction.

Eight interface languages and a bumped, independently dismissible workshop
NEW revision. No automatic segmentation, generative replacement, uploads,
model downloads or automatic AI calls are introduced by this update.
