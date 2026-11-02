# Light sphere and pets / Fénygömb és háziállatok — 1.21.0

## English

Open **Virtual studio → Figures and poses**, then **Open in new tab** for the large workspace. The toolbar now has **Add dog**, **Add cat** and **Light sphere**. People and animals share the existing maximum of eight figures.

**Light sphere:** open its panel and choose **Suggested sphere**. It frames the visible figures and turns on the schematic body preview. Adjust strength, softness, colour temperature or custom colour, radius, and main-light direction/elevation. Use **Place / move the sphere**, then click or drag in the scene. X and height move; depth is retained and there is no Z handle. Near an edge-on view, rotate the view or use the X/height number fields. Escape cancels a drag; another Escape leaves sphere-move mode. Turn Follow back on to follow the visible figures again. Changes participate in Undo/Redo and normal scene/preset saving.

**Remember the mouse wheel:** in **3D view** with the sphere enabled, wheel = orbit, Shift + wheel = tilt, Ctrl + wheel = zoom. These change the editor view, not the saved generation camera. In front/side views, the wheel keeps its existing zoom behaviour. The camera view remains a framing preview.

The light preview is schematic. Strength and softness describe intent, not calibrated exposure. The sphere itself is not drawn into body/depth or human OpenPose exports; its description is included in generated studio directions as an invisible lighting guide. If you manually edited the directions, use **Rebuild directions from plan** to include subsequent changes. Depth remains a geometry reference, unaffected by light colour/strength.

**Pets:** add a dog or cat. Choose Small/Medium/Large and adjust the shoulder-height scale if needed. Select Standing, Seated, Lying or Walking and press **Apply pose**. Head, four leg chains and tail can be adjusted by dragging the visible joints or with the numeric/angle controls. Size changes rebuild that animal's base proportions/pose. Duplicate, mirror, reset selected pose, hide, Undo/Redo and the shared camera also work with pets. Breed-specific anatomy, collision constraints and animal pose estimation from a photo are not part of this release.

**Export:** human OpenPose PNG/JSON contains human figures only, and is disabled for animal-only scenes. For pets use body/depth PNGs or **Save full scene JSON**. The latter is a Studio backup with the current scene and saved setups; restore it through Virtual studio's existing backup-import control. Source photos are not included. Body/depth references still need an appropriately compatible generation workflow; an animal rig is not a standard human BODY_18 skeleton.

For an existing installation run the update, then its **RESTART_STUDIO.cmd**, refresh with Ctrl+F5 and reopen old editor tabs. The full Windows ZIP is for a clean folder: extract everything, run **START.cmd**. Node.js 22+ is required. The manual scene editor needs no Ollama; optional image-to-prompt assistance needs separately installed Ollama and a vision-capable model. See LOCAL_AI_FIRST_RUN_8_LANGUAGES.md. Avoid local vision analysis while image/video generation is occupying your GPU.

## Magyar

**Virtuális stúdió → Figurák és testtartások → Megnyitás új lapon**: itt nagy felületen dolgozhatsz. Az eszköztáron megjelent a **Kutya hozzáadása**, **Macska hozzáadása** és **Fénygömb**. Az emberek és állatok együtt legfeljebb nyolcan lehetnek a jelenetben.

**Fénygömb:** nyisd meg a paneljét, válaszd a **Javasolt fénygömb** gombot. Körbeveszi a látható figurákat, és bekapcsolja a sematikus testmodell előnézetét. Állítható az erősség, lágyság, színhőmérséklet vagy egyedi szín, sugár és a főfény iránya/emelése. **Gömb elhelyezése / mozgatása** mellett kattints vagy húzz a térben. X és magasság mozdul; a mélység megmarad, Z-nyíl nincs. Élirányú nézetnél fordíts a téren vagy használd az X/magasság számmezőket. Esc megszakítja a húzást, újabb Esc kilép a gömbmozgatásból. A Követés visszakapcsolásával ismét követi a látható figurákat. Visszavonható, és a jelenettel/beállításokkal együtt mentődik.

**Az egérgörgő:** bekapcsolt fénygömbnél **Térbeli nézetben** görgő = körbeforgatás, Shift + görgő = billentés, Ctrl + görgő = nagyítás. Ezek a szerkesztő nézetét változtatják, a generáláshoz mentett kamerát nem. Elöl-/oldalnézetben marad a korábbi görgős nagyítás. A kameranézet a képkivágás előnézete.

A fényelőnézet sematikus. Az erősség és lágyság leíró támpont, nem kalibrált expozíció. A gömb nem kerül bele a test-/mélység- vagy emberi OpenPose-képbe; láthatatlan fényvezetőként bekerül a stúdióleírásba. Kézzel szerkesztett leírásnál az új módosításokhoz használd a **Leírás újraépítése a tervből** gombot. A mélységtérkép geometriát mutat, nem változik a fény színétől/erősségétől.

**Háziállatok:** adj hozzá kutyát vagy macskát. Válassz kistestű/közepes/nagytestű méretet; szükség esetén a marmagassági méret is állítható. Állás, ülés, fekvés vagy séta kiválasztása után nyomd meg a **Póz alkalmazása** gombot. A fej, négy láb és farok húzással vagy szám-/szögmezőkkel mozgatható. Méretváltáskor az adott állat alaparányai/póza újraépülnek. Másolás, tükrözés, kijelölt póz visszaállítása, elrejtés, visszavonás és a közös kamera állatokkal is működik. Fajtaspecifikus anatómia, ütközésvizsgálat és képből állati pózbecslés még nincs.

**Export:** az emberi OpenPose PNG/JSON csak embereket tartalmaz, csak állatokból álló jelenetnél nem választható. Állatokhoz test-/mélység-PNG-t vagy **Teljes jelenet JSON mentése** fájlt használj. Utóbbi Studio-biztonsági mentés a jelenettel és a mentett beállításokkal; a Virtuális stúdió meglévő mentésimportjával tölthető vissza. A forrásfotók nem kerülnek bele. A test-/mélységreferenciához megfelelően kompatibilis generáló workflow szükséges; az állatváznak nem szabványos emberi BODY_18 a felépítése.

Meglévő telepítésnél frissítő, majd a hozzá adott **RESTART_STUDIO.cmd**, Ctrl+F5 és a régi szerkesztőlapok újranyitása. A teljes Windows ZIP új mappához való: csomagold ki az egészet, majd **START.cmd**. Node.js 22+ szükséges. A kézi jelenettervezőhöz nem kell Ollama; a képből promptot ajánló MI-hez külön telepített Ollama és képértő modell kell. Lásd: LOCAL_AI_FIRST_RUN_8_LANGUAGES.md. Helyi képelemzést ne indíts, amíg a kép-/videógenerálás lefoglalja a GPU-t.
