# Videós arculatműhely / Video branding

## Magyar

**Hol?** A Studio **Videóműhely – NEW** gombjával nyíló nagy külön lapon, a jobb oldali sáv tetején: **Videós arculatműhely**. A jobb sáv külön görgethető, az előnézet közben látható marad.

1. Tölts be egy videót, vagy add hozzá a helyi médiatárból.
2. Adj hozzá feliratot vagy PNG/JPEG/WebP logóképet; vagy válassz a **Mentett képes arculat** listából. Ugyanebben a böngészőben, ugyanazon Studio-címen mentett arculataid érhetők el. Az **Arculatok frissítése** újraolvassa a listát.
3. Válaszd ki a réteget. Írd át a mintaszöveget, nevet és webcímet. Állítsd a méretet, színt, fedettséget és igazítást. A képen húzással mozgatható a kijelölt réteg igazítási pontja; a nyílbillentyűk 1%-kal, Shift mellett 5%-kal mozgatják. A számos pozíciómezők pontos beállítást adnak.
4. Állíts kezdési és befejezési időt **az összeállított videó idővonalán**, nem az eredeti fájlon. A 0 végidő a videó végéig tart. Például cím: 0–3 mp; logó: 0–0. A megjelenés és eltűnés külön finomítható, maximum 5 mp; rövid rétegnél legfeljebb a látható idő feléig tartanak.
5. Az előnézet alatti csúszkával ellenőrizd az időzítést. Új vagy kiválasztott rétegnél a nézet szükség esetén a látható szakaszhoz lép. Az elhelyezési nézet a forrásképet mutatja; a teljes színjavítást, vágást és hangkeverést a **Rövid előnézet renderelése** ellenőrzi (legfeljebb az első 8 mp).
6. Véglegesítéshez válaszd a **Szerkesztett összeállítás · H.264 + AAC** módot. A forrásfelbontás és az FPS alapból megmarad. A beállítás az első klipre vonatkozik; az eltérő oldalarányú klipek aránytartó illesztést és szükség esetén sávokat kapnak. Az export maximálisan 4K képpontszámot támogat, HDR-feldolgozást nem.
7. **Projekt mentése** megőrzi a szerkeszthető szöveget, időzítést, rétegeket és a logó PNG-adatát is. A videók továbbra is hivatkozások; más gépen az eredeti videókat újra be kell tölteni.

Legfeljebb 8 arculati réteg használható. A mentett képes arculat átvétele alapból cseréli az arculati rétegeket; a cserejelölő kikapcsolásával hozzáad. A klipek és tónusaik megmaradnak, a művelet visszavonható. A rétegsorrend a takarást is meghatározza. Helyi betűkészleteket használ, MI vagy felhő nem kell.

**Minőség és metaadatok:** a képre égetett arculat újrakódolást igényel. A végső CRF alapból 18 (kisebb érték jobb minőség). Az arculatos véglegesítés köztes klipei veszteségmentes H.264 kódolást kapnak, hogy ne legyen két egymást követő veszteséges képkódolás; ehhez átmenetileg több szabad lemezhely kellhet. Siker és hiba után a köztes képfájlokat és klipeket eltakarítja. Az eredeti fájlokat nem írja felül.

Egyetlen képforrás esetén átveszi a videóban olvasható forrás-metaadatokat, és feldolgozási jelzéssel különíti el az eredeti generálási receptet az új szerkesztéstől. Több eltérő képforrásból nem állít elő egyetlen állítólagos generálási receptet. A helyi exportmappában az **export.json** tartalmazza a szerkesztett projektet. A képmegőrző hangjavítás és a csak hang mód nem tartalmazhat látható arculatot; ezeket a program nem váltja át csendben más módba.

Frissítés előtt mentsd a munkád. Futtasd az **UPDATE.cmd** fájlt, majd indítsd újra a Studiót a megszokott módon. Ctrl+F5 után **zárd be és nyisd meg újra a régi Videóműhely- és Képműhely-lapokat**.

## English

**Where?** Open **Video workshop – NEW** in its large separate tab. **Video branding** is at the top of the right sidebar. The sidebar scrolls independently of the preview.

1. Load a video or add one from the local media library.
2. Add text or a PNG/JPEG/WebP logo, or select a **Saved image branding** profile. Profiles are shared within the same browser and Studio address. **Refresh profiles** rereads the shelf.
3. Select a layer, edit sample copy/name/website, and adjust size, colour, opacity and alignment. Drag the selected layer's anchor in the preview, use arrow keys for 1% moves (Shift: 5%), or enter precise horizontal/vertical values.
4. Set times on the **assembled timeline**, not the original file. End 0 follows the video length. For example, a title can run 0–3 seconds and a logo 0–0. Fade-in and fade-out are independent, up to five seconds and bounded to half of a short layer's visible duration.
5. Scrub the slider below the preview to check timing. A newly selected layer seeks into its visible interval when needed. This is a placement preview on the source picture; **Render short preview** checks the final colours, edits and sound (up to the first eight seconds).
6. Use **Edited assembly · H.264 + AAC** for the final output. Source resolution/FPS are the defaults, based on the first clip. Other aspect ratios are fitted with padding as needed. Maximum output pixel count is 4K; HDR finishing is not supported.
7. **Save project** retains editable text, timing, layers and embedded PNG logos. Videos remain references; reimport matching video files when moving to another computer.

Up to eight branding layers. Applying an image branding profile replaces branding by default; disable the replacement checkbox to append. Clips and tones are retained; Undo is available. Layer order controls compositing order. Local fonts are used; no AI model or cloud service is required.

**Quality and metadata:** burned-in branding requires re-encoding. Final CRF defaults to 18 (lower is higher quality). Branded final exports use lossless H.264 intermediate clips to avoid two successive lossy picture encodes; allow additional temporary disk space. Intermediate clips and overlay images are cleaned up after success or failure. Originals are never overwritten.

When one unique picture source is used, readable embedded source metadata is retained with a processing marker distinguishing the original generation recipe from subsequent edits. Multiple distinct sources do not claim a single generation recipe. **export.json** in the local job folder records the edited project. Picture-preserving audio mode and audio-only export cannot contain visible branding; the app does not silently switch modes.

Save work before updating. Run **UPDATE.cmd**, restart Studio normally, refresh with Ctrl+F5, and **close/reopen existing Video workshop and Image workshop tabs**.
