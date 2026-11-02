# Felirat, logó és vízjel / Text, logo and watermark

2026-11-02 – helyi tesztfrissítés, GitHub-publikálás nélkül.

## Magyar

1. Mentsd az esetleg nyitott Képműhely-projektet. Futtasd az **UPDATE.cmd** fájlt.
2. Indítsd újra a Prompt Studiót a megszokott indítóddal, majd Ctrl+F5. A régi külön Képműhely-lapot zárd be, és nyiss újat.
3. A főoldal **Képműhely** kártyáján kattints a **Felirat, logó és vízjel ↗** gombra. Ugyanez a rész a megszokott Képműhelyben is megjelenik.
4. Nyiss vagy húzz be egy forrásképet. Az oldalsáv **Felirat, logó és vízjel** részében adj hozzá feliratot vagy logót. PNG, JPEG, WebP és AVIF képek használhatók; átlátszó logóhoz PNG ajánlott. SVG-betöltés nincs ebben a változatban.
5. Válaszd ki a réteget. A képen látható **↔ fogantyút húzva** mozgathatod; az oldalsávban a sarok/közép igazítás, margó, méret, áttetszőség és elfordítás pontosítható. A kijelölt arculati rétegen a maszkecsetek szándékosan nem aktívak.
6. Feliratnál helyi sans/serif/monospace betűcsalád, félkövérség, szín, körvonal, háttér és árnyék választható. A méretek és margók százalékosak; a betűméret/logószélesség a kép rövidebb oldalához igazodik. A hosszú szöveget kézzel törd sorokra; legfeljebb 600 karakter és 12 sor használható. A betűk a gép helyi készletét használják, ezért más gépen eltérhet a megjelenés. Export előtt ellenőrizd a kilógó szöveget és az elforgatott elemeket.
7. **Ismétlődő vízjel** esetén a réteg több példányban jelenik meg a képen. A beállítások és a pozíció visszavonhatók. Az eredeti/utána összehasonlítás továbbra is használható.

### Menthető arculat

Írj nevet (például Prophetero vagy ArtofTomworks), majd **Arculat mentése**. A recept a látható felirat-/logórétegeket tárolja, a fény- és tónusrétegeket nem. Másik képnél válaszd ki a nevet, majd **Arculat alkalmazása**. A meglévő arculati rétegek cseréje külön jelölhető; az alkalmazás visszavonható.

Legfeljebb 12 arculat, arculatonként 8 réteg menthető; a teljes Képműhely legfeljebb 16 réteget kezel. A logók a böngésző helyi tárában, legfeljebb 2048 képpontos raszteres PNG-ként mentődnek. Nagy vagy nehezen tömöríthető logónál, illetve tele böngészőtárnál a mentés hibát jelez, és nem írja felül a régi arculatokat. A böngészőadatok törlése a mentett arculatokat is törli. Egyszerre megnyitott lapok elavult mentése nem írhatja felül a frissebb arculattárat.

A projekt JSON a beállításokat és a képek ellenőrzött ujjlenyomatát tárolja, a teljes fotókat nem. Újranyitáskor a forrásképet és a szükséges képrétegeket újra csatold. A mentett arculatból származó logót a műhely helyben újracsatolhatja, ha a pontos ujjlenyomat és méret egyezik.

### Egy kép vagy több kép mentése

- A megszokott PNG-export az eredeti képméretben ment új képfájlt. Az eredeti fájlt nem módosítja.
- **Arculat több képre → ZIP:** legfeljebb 20 képet válassz. Csak a jelenlegi, látható felirat-/logórétegek kerülnek mindegyikre, képenként az eredeti méretben. A többi képszerkesztési réteg nem kerül át. Egy ZIP-ben kapod meg az új PNG-ket.
- A köteg megszakítható; a folyamatban lévő képfeldolgozás után áll le, és megszakítás vagy hiba esetén nem tölt le hiányos ZIP-et. Az eredeti fájlok és az aktuális projekt megmaradnak. Legfeljebb 128 MiB összes PNG-kimenet csomagolható; a képméretekre a meglévő 24 megapixeles korlát vonatkozik.

A PNG-export nem őrzi meg az eredeti generálási promptot, workflow-t vagy más beágyazott metaadatot. Az eredetit tartsd meg, a szerkesztést pedig projektként is mentheted. A feliratok és logók nem kerülnek a generált promptba vagy a videóhoz visszaküldött globális tónusreceptbe. Ez a kiadás képes arculatműhely; videóra égetett felirat és időzítés későbbi lépcső.

Nyolcnyelvű felület és kézzel elrejthető NEW jelzés. Nincs modellletöltés, generálás vagy külső képfeltöltés.

## English

Save any open Image workshop project, run UPDATE.cmd, restart Studio normally, then Ctrl+F5. Close old Image workshop tabs and open a new one. In the main **Image workshop** card choose **Text, logo and watermark ↗**; the controls also appear in the normal Image workshop.

Open a source image, add text or a logo, select the layer and drag its **↔ handle**. Refine alignment, margin, relative size, opacity and rotation in the independently scrolling sidebar. Text supports local sans/serif/monospace families, bold, colour, outline, background and shadow. Break long text manually; up to 600 characters and 12 lines are supported. Fonts may differ between computers. Check text overflow and rotated edges before exporting. PNG/JPEG/WebP/AVIF raster images are supported; use transparent PNG for logos. SVG is not supported in this version.

Repeated watermark mode tiles the element. Edits use the existing undo/redo history and before/after preview. Masks are not enabled for selected branding layers.

**Save branding** stores visible text/logo layers only, leaving lighting and tone recipes separate. Select a saved name and **Apply branding** to reuse it on another image. Replacement is explicitly selectable and undoable. Limits: 12 profiles, 8 layers per profile, 16 layers per image project. Saved logos are raster PNGs up to 2048 pixels, kept in this browser’s local storage. Storage failures leave prior profiles intact; deleting browser data removes the profiles. Stale tabs cannot overwrite a newer branding shelf.

Project JSON keeps edits and asset fingerprints, not full source photos. Reattach required source/layer images when reopening. A logo from an existing branding profile can be reattached locally when its exact fingerprint and dimensions match.

The regular PNG export saves a new file at the source dimensions. **Apply branding to images → ZIP** accepts up to 20 images and applies only the current visible text/logo layers at each image’s original dimensions. Other edits remain in the current project. One ZIP contains the new PNGs; original files are untouched. Cancel stops after the current image; errors/cancellation do not download a partial ZIP. Total PNG output is capped at 128 MiB, with the existing 24-megapixel per-image limit.

PNG exports do not retain original generation prompts, workflow or embedded metadata. Keep your originals and save the editable project too. Branding is excluded from generated prompts and from global-tone recipes returned to video. This edition handles still images; burned-in video overlays and timing are a later step. All eight languages and dismissible NEW labels are included. No model download, AI generation or remote image upload is used.

## Verification

45 automated checks passed for image editing, branding controls and persistence, drag/undo, original-size exports, batch ZIP/cancel/error handling, schema bounds, prompt separation, local AI guidance, draft preservation and NEW labels. Native Python ZIP decoding verified CRC values, binary contents and UTF-8 filenames independently. Full browser visual inspection remains part of user testing. Updater validation is recorded in VERIFICATION.txt.
