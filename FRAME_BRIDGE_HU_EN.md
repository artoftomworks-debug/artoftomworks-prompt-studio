# Prompt Studio — Frame to Look

## English

This update links Video workshop and Image workshop. No generation model, cloud account or additional download is required beyond the existing local FFmpeg engine used by Video workshop.

1. Open **Video workshop — NEW**, import a video and add it to the timeline. Click its clip card to view the source.
2. Pause on a useful frame. Use **Previous frame / Next frame** for precise positioning, then **Edit this frame in Image workshop**. Allow the new local tab to open.
3. Adjust exposure, contrast, shadows, highlights, warmth and saturation using full-image tone layers. Existing video tone recipes are loaded as editable layers; the extracted source frame already includes the clip's basic video colour controls.
4. Click **Return tones to video** and switch back to the video tab. Both tabs must remain open. The returned recipe appears for review; it does not change the timeline automatically.
5. Choose the captured clip, checked video clips, or all video clips. Checkboxes above clip cards select tone targets. Edit the recipe name if desired.
6. Try **Before / after video** for an aligned draggable comparison, or **Three strengths** for 40%, 70% and 100% previews. These render sequentially, up to eight seconds each. They preview the first target clip near the captured moment when applicable, with that clip's own sound and without added sound tracks. The comparison players begin muted to prevent doubled audio.
7. Click **Apply look** when satisfied. Each affected clip has an editable 0–100% look strength and a **Clear look** action. Undo/redo and saved video projects include the recipe. A final export renders the full timeline and its audio tracks.

**Source waveform:** select a video clip and click **Load source waveform**. Click the waveform to seek; left/right arrow keys step a frame. It represents the selected source cut, before gain, speed, fades or added sound tracks. It is not the final mix waveform. Silent sources display a flat line. Source and finished-result frame-step buttons use their recorded frame rates; variable-frame-rate source stepping is approximate.

**What crosses the bridge:** visible, full-image tone layers only. Local masks, light washes, replacement backgrounds and image layers remain in Image workshop. The image notice states this explicitly. SDR global tones are reproduced through an interpolated 3D colour lookup, so small rounding/colour-conversion differences from the canvas preview are possible. HDR grading, object tracking and generative relighting are not included.

If the source clip's cut, speed, basic colour settings or fingerprint changes after frame capture, return to the source and capture again. An outdated return is rejected. Capture/waveform/render operations share the local engine and run one at a time. Cancel stops active analysis or rendering. No original media is overwritten. The frame is transferred temporarily between the two local tabs, not stored in browser preferences. The video project stores settings and source fingerprints, not image or video bytes.

Save and close old editing tabs before installing. Run **UPDATE.cmd**. The updater validates the preceding Video workshop release, backs up changed files and preserves media, archive and settings. It attempts to restart only this installation's Studio server. Refresh the main Studio page with Ctrl+F5 and reopen the workshops. If automatic restart fails, use **RESTART_STUDIO.cmd** or your usual Studio launcher after closing the old server. NEW badges can be dismissed individually.

## Magyar

Ez a frissítés összeköti a Videóműhelyt és a Képműhelyt. A Videóműhely meglévő helyi FFmpeg motorján kívül nem kér új modellt, felhős fiókot vagy letöltést.

1. Nyisd meg a **Videóműhely — NEW** felületet. Tölts be egy videót, add az idővonalhoz, és kattints a klip kártyájára.
2. Állítsd meg a kívánt pillanatnál. Az **Előző/következő képkocka** gombokkal pontosíthatsz, majd nyomd meg a **Képkocka a Képműhelybe** gombot. Engedd megnyílni az új helyi lapot.
3. Állítsd az expozíciót, kontrasztot, árnyékokat, csúcsfényeket, meleg–hideg egyensúlyt és telítettséget a teljes képre ható tónusrétegeken. A videó meglévő tónusreceptje szerkeszthető rétegekként érkezik; a kiemelt képkocka már tartalmazza a klip alap videós színbeállításait.
4. Kattints a **Tónusok vissza a videóhoz** gombra, majd válts vissza a videós lapra. Mindkét lap maradjon nyitva. A recept megjelenik ellenőrzésre; az idővonalat még nem változtatja meg.
5. Válaszd ki, hogy a kiemelt klipre, a bepipált videóklipekre vagy az összesre szeretnéd alkalmazni. A klipkártyák feletti pipák jelölik a célokat. A receptet el is nevezheted.
6. Az **Előtte–utána videó** húzható választóvonallal hasonlítja össze a két változatot. A **Három erősség** 40%, 70% és 100% próbát készít. A próbák egymás után, legfeljebb nyolc másodpercben készülnek, az első célklipből; ahol lehet, a kiemelt pillanat környékéről. A klip saját hangját használják, a külön hangsávokat kihagyják. Az összehasonlító lejátszók némítva indulnak, hogy ne szóljon egyszerre több hang.
7. Ha tetszik, kattints az **Alkalmazás** gombra. Az érintett klipeknél 0–100% között finomíthatod az erősséget, vagy törölheted a receptet. A visszavonás és a mentett videóprojekt is megőrzi a beállításokat. A végleges export már a teljes idővonalat és hangsávokat dolgozza fel.

**Forráshanghullám:** válassz videóklipet, majd kattints a hanghullám betöltésére. A hullámra kattintva odaugorhatsz; bal/jobb nyíllal képkockát léptethetsz. A kiválasztott forrásrészletet mutatja a hangerő, sebesség, átmenetek és külön hangsávok alkalmazása előtt. Hang nélküli forrásnál egyenes vonal jelenik meg. A képkockaléptetés az ismert képkockasebességet használja; változó sebességű forrásnál közelítő.

**Mi vihető át?** A látható, teljes képre ható tónusrétegek. A helyi maszkok, fényfoltok, háttércserék és képrétegek a Képműhelyben maradnak; ezt a felület is jelzi. Az SDR-tónusokat interpolált színtábla viszi a videóra, ezért apró kerekítési és színkonverziós eltérés lehet az állóképes előnézethez képest. HDR-színelés, tárgykövetés és generatív újravilágítás nincs benne.

Ha a képkocka kiemelése után megváltozik a forrásklip vágása, sebessége, alap színbeállítása vagy fájlazonosítója, emelj ki új képkockát. Az elavult visszaküldést visszautasítja. A kiemelés, hanghullám-elemzés és renderelés egymás után fut; megszakíthatók. Az eredeti médiafájlokhoz nem nyúl. A képkocka átmenetileg, a két helyi lap között utazik; a böngésző beállításai közé nem mentjük. A videóprojekt a receptet és forráshivatkozásokat tárolja.

Telepítés előtt mentsd és zárd be a régi műhelylapokat. Indítsd az **UPDATE.cmd** fájlt. A frissítő ellenőrzi az előző Videóműhely-verziót, mentést készít, és megtartja az archívumot, médiát, beállításokat. Megpróbálja újraindítani csak ennek a Studiónak a helyi szerverét. Utána a főoldalon Ctrl+F5, majd nyisd újra a műhelyeket. Ha az automatikus újraindítás nem sikerül, használd a **RESTART_STUDIO.cmd** fájlt vagy a megszokott indítót a régi szerver bezárása után. Az új NEW címkék külön elrejthetők.
