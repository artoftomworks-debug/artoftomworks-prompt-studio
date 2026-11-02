# Virtuális stúdió — kipróbálható fejlesztés

Az összevont frissítés a korábbi Bevált fogásaim, százalékos stíluskeverés, saját stílusok, külön Stílus és fények mező és Javasolt gomb funkcióit is tartalmazza. GitHubra vagy Civitaira nem publikáljuk automatikusan.

## Indulás

1. Futtasd a frissítőmappában az **UPDATE.cmd** fájlt. Nem kell újra kicsomagolni, ha a kibontott mappát használod.
2. A megszokott Studióban nyomj **Ctrl+F5**-öt. A szerver és a helyi MI újraindítása nem szükséges.
3. A fejlécben keresd a **Virtuális stúdió** gombot. A jobb oldali munkafelületen is lenyitható.
4. Válassz például Portré, Beauty portré, Drámai, Ablakfény vagy Termék kiindulópontot, majd **Javasolt alapbeállítás**. Videóhoz közelítés, daruzás és körív alaphelyzet is van.
5. A **Nagy nézet** kényelmesebb a részletes elrendezéshez. Bezárással vagy Escape-pel visszakerülsz a szokásos felületre.

## Az ábra és a beállítások

- Piros pont: az alany célpontja. Türkiz jel: a kamera. Színes körök: legfeljebb hat lámpa.
- Felülnézetben a vízszintes hely és a mélység, oldalnézetben a mélység és a magasság állítható húzással. Pontos értéket a számmezőkben adhatsz meg. A célpont egy beállítási referencia, nem egy teljes testmodell.
- A térbeli ábra forgatható és dönthető. Ez az ábra nézőpontját változtatja, a tényleges kamerabeállítást nem. Az elemek térbeli helyét a két síknézetben vagy a számmezőkkel állítsd.
- A helyadatok méterben vannak: X oldalirány, Y magasság, Z mélység. Az ábra rácsa oldalirányban és mélységben −5…+5 m, magasságban 0…6 m területet mutat. A szerkeszthető magasság minimuma 0,1 m.
- A kamera nézhet automatikusan az alanyra. Ilyenkor a vízszintes és függőleges szög a helyzetből számítódik. A jelölés kikapcsolása után a szögek külön megadhatók. Billentés, objektív- és rekeszjelleg, képkivágás, képarány és egyszerű szűrőhatás is választható.
- Lámpánként állítható a szerep, típus, méret, diffúzor/rács, 0–100-as leíró erősség, színhőmérséklet vagy színes fólia. A lámpák az alany célpontjára irányulnak; a szögeket kiírjuk és belefoglaljuk a leírásba. A 0 erősségű lámpa kimarad a leírásból. A képernyős Kelvin-színek egyszerű jelzőszínek, nem kalibrált színmérés eredményei.

## Videóterv

A Terv típusa legyen **Videó**. Választható rögzített kamera, közelítés, távolítás, oldalazás, daruzás, körív vagy saját végpont. A daruzás és oldalazás iránya megfordítható. Állítható az időtartam, elmozdulás/körív, az egyenletes vagy lágy indulás–megállás és az alanyra irányítás.

A **Mozgás előnézete** és az időcsúszka az ábrán járatja végig a kamerát. Nem futtat videógenerálást, nem kér képelemzést, és az animáció közben nem ment állandóan új fájlokat. A kameraút, túl közeli kamera vagy elfordított kamera esetleges problémáit külön jelezzük. A körív valódi ívként számítódik, nem kezdő- és végpont közötti egyenes vonalként.

Az alany és a lámpák mozgását ez az első változat nem animálja. Teljes képkockás fényfizikai vagy optikai látványt sem renderel.

## Prompt és átadás

A tervből angol nyelvű, szerkeszthető **stúdióleírás** készül. A leírás a kívánt jelenet kameranézetét és világítását kéri, nem a technikai stúdióábra megrajzolását. A kézzel átírt leírás a beállítások változtatásakor is megmarad; az aktuális ábrából a **Leírás újraépítése a tervből** gombbal készíthetsz újat. Az átírt szöveg is része a helyi mentésnek.

A leírás külön másolható, vagy kiválasztott munkafelület **Stílus és fények** mezőjébe átadható. A meglévő stíluskeverék megmarad. A korábban automatikusan írt általános fényirányokat és stúdiótervet lecseréljük, hogy ne halmozódjanak. A kézzel írt egyéb fényutasításokat nem találjuk ki és nem töröljük: az esetleges ellentmondásokat nézd át. A jelenet szövegét az átadás nem módosítja.

A kamera koordinátái, Kelvin-értékek, lencse- és rekeszadatok kért irányok. Promptalapú generátor nem feltétlenül követi őket pontosan. A képarányt, videóhosszt és egyéb tényleges generálási paramétereket a generálóprogramban továbbra is neked kell beállítanod. A rajz elrendezési terv, nem ellenőrzött fizikai szimuláció.

## Mentés

- A terv ebben a böngészőprofilban és ezen a helyi címen tárolódik. Legfeljebb 30 saját, elnevezett stúdióbeállítás menthető. Meglévő név felülírását és beállítás törlését külön jóvá kell hagyni.
- A Javasolt alapbeállítás utáni visszavonás a következő módosításig érhető el.
- JSON-biztonsági mentés exportálható/importálható. Visszaállításkor a stúdiótervet és saját stúdióbeállításokat cseréljük, a többi gyűjteményt nem. Böngészőadatok törlése előtt készíts mentést.
- Sérült tárhely, két böngészőfül ütközése vagy sikertelen mentés esetén a korábbi tartós mentést nem írjuk felül csendben. Húzásnál csak felengedéskor mentünk; megszakításkor az előző helyzet megmarad.
- A funkció nem küld képet vagy szöveget külső szolgáltatónak, és nem indít helyi MI-t. Az angol tervet az explicit átadás/másolás után használhatod a választott generátorban.

## English

Open **Virtual studio** from the header, then choose a **Suggested setup**. Portrait, beauty, dramatic, window-light, product and video dolly/crane/orbit starts are included. **Large view** opens the workspace in a larger dialog.

Drag subject, camera and up to six lights in top/side views; use numeric fields for exact planning positions. The rotatable 3D diagram changes the diagram viewpoint only. Camera targeting, yaw/pitch/roll, lens/aperture character, framing, aspect ratio and filter look are editable. Lights have roles, types, source sizes, modifiers, descriptive strength and Kelvin or gel colour. Kelvin diagram colours are approximate swatches, not calibrated measurements.

Video planning supports static, dolly-in/out, sideways track, crane/jib, orbit and custom endpoints, with duration, travel/arc, smooth/steady speed and target tracking. Crane/track can reverse direction. Animated schematic playback does not generate video or run AI. Subject and light animation and physical lighting rendering are not included.

Editable English directions describe the intended camera view and lighting; they do not request a diagram of studio equipment. Manually edited directions are preserved, with an explicit rebuild button. Copy them or send them to a selected workspace's separate **Style and lighting** section. Existing styles are retained; previous generated lighting/studio direction lines are replaced. Scene text is unchanged. Review manually written conflicting directions yourself. Set actual generation parameters in the generator; exact coordinates, exposure, lens behaviour and colour temperatures are not guaranteed by prompt-based generation.

Plans, custom direction text and up to 30 named setups stay in browser storage. Export JSON backups before clearing browser data. Import replaces studio settings only after confirmation. Storage failures, corruption and stale-tab conflicts do not silently overwrite saved data. Dragging saves on release; cancellation restores the previous placement. There are no automatic AI requests or model downloads.

Validation: automated geometry, persistence, integration, drag/cancellation, dialog, motion and eight-language checks passed. The app's browser security policy blocked opening the local HTML preview, so actual visual rendering still needs user verification.
