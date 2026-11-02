# Audio waveform and frame alignment / Hanghullám és képkockás igazítás

## English

Save work, run **UPDATE.cmd**, then **RESTART_STUDIO.cmd** from this update folder. Refresh Studio with Ctrl+F5 and reopen old Sound/Video workshop tabs. Source media, themes, notes and arrangements are kept.

**Sound workshop:** select a sound and choose **Load sound waveform** near its player. Click the wave to mark a sound event. Use the source-seconds field, arrow keys or ±1 frame to refine the marker. Alignment FPS should match your intended video; it is an editing reference and does not change the audio. The choice is remembered in this browser. Arrangement tracks also have one-frame start-time nudges, with Undo. Choosing a cue does not start playback.

**Video workshop:** add a video and a sound, or accept an arrangement from Sound workshop. Click the **audio track** on the timeline. Below it, **Sound and picture alignment** provides these steps:

1. Load the sound waveform and mark the sound event. The cue uses source seconds and respects the sound's In/Out trim.
2. Set the picture's timeline time, press **Show picture at timeline time**, and refine with ±1 frame. The large paused picture stays at the top while you scroll the alignment controls. Seeking respects video order, trim and speed.
3. Press **Align sound cue to this picture**. Only this sound's Start changes. Use Sound −1 / +1 frame for a small offset, or the main Undo button to revert.
4. Render **Short preview** to check the final mixed sync. The individual audio player and paused picture are separate source previews, not live synchronized playback. Rendered previews retain normal video playback controls.

Video steps use the output FPS, or the first source video's FPS for Original output; FPS and milliseconds per step are shown. Delays are exported at 48 kHz sample precision. Browser seeking depends on decoding, so check the rendered result.

Loops align their first occurrence. An alignment requiring a negative start is rejected: choose a later picture, earlier cue, or trim the sound. Nothing is silently cut off. Cuts, effects, gains/fades and source files are retained. Picture-preserving export keeps its existing compatibility rules.

Waveforms show source amplitude before gain/fades. Included WAV analysis needs no AI, GPU or FFmpeg; imported audio uses the configured video FFmpeg engine. Analysis is local and cancellable. If it fails, playback and time fields remain usable. Other video processing is paused while waveform analysis is active in that tab.

## Magyar

Mentsd a munkád, futtasd az **UPDATE.cmd**, majd ebből a frissítőmappából a **RESTART_STUDIO.cmd** fájlt. Frissíts Ctrl+F5-tel, és nyisd újra a régi Hangműhely/Videóműhely lapokat. A forrásfájlok, témák, jegyzetek és összeállítások megmaradnak.

**Hangműhely:** válassz hangot, majd a lejátszó közelében **Hanghullám betöltése**. A hullámra kattintva jelölhetsz hangeseményt; a forrás másodpercmezőjével, nyílbillentyűkkel vagy ±1 képkockával finomíthatsz. Az Igazítási FPS egyezzen a tervezett videóval; ez támpont, nem módosítja a hangfájlt. A választást megjegyzi a böngésző. Az összeállítás hangsávjainak kezdése is finomítható képkockánként és visszavonható. A jelölés nem indít lejátszást.

**Videóműhely:** adj hozzá videót és hangot, vagy fogadd a Hangműhelyből küldött összeállítást. Kattints az idővonal **hangsávjára**. Alatta: **Hang és kép összeigazítása**.

1. Töltsd be a hanghullámot, és jelöld a hangeseményt. A hangjelölő forrásidőt használ, és figyelembe veszi a hang elejének/végének vágását.
2. Add meg a kép idővonalbeli idejét, nyomd meg a **Kép mutatása az idővonal idején** gombot, majd finomíts ±1 képkockával. A nagy megállított kép a vezérlők görgetése közben fent marad. Követi a videók sorrendjét, vágását és sebességét.
3. **Hangjelölő igazítása ehhez a képhez**: csak ennek a hangsávnak a kezdése változik. A Hang −1 / +1 képkocka további finomítást ad; a fő Visszavonás gombbal visszaléphetsz.
4. Készíts **Rövid előnézetet**, azon ellenőrizd a végső keverés szinkronját. A külön hanglejátszó és a megállított kép forrás-előnézetek, nem élő szinkronkeverés. A renderelt előnézet a szokásos videóvezérlőkkel játszható le.

A videós lépés a kimeneti FPS-t használja; Eredeti kimenetnél az első videóét. Az FPS és az egy lépésre jutó ezredmásodperc látható. Exportkor a késleltetés 48 kHz-es hangmintára pontos. A böngészős képkeresés a dekódolástól is függhet, ezért a renderelt eredményt ellenőrizd.

Ismétlésnél az első előfordulást igazítja. Ha a hangnak a videó előtt kellene kezdődnie, ezt jelzi: válassz későbbi képet, korábbi hangjelölőt vagy vágd meg a hangot. Nem dob el hangrészt észrevétlenül. A vágások, effektek, hangerők/lekeverések és forrásfájlok megmaradnak. A képi adatfolyamot megőrző export a meglévő feltételekkel működik.

A hullám a forráshang erőssége hangerő/lekeverés előtt. A beépített WAV-ok elemzéséhez nem kell MI, GPU vagy FFmpeg; saját hanghoz a beállított videós FFmpeg-motort használja. Az elemzés helyi és megszakítható. Hiba esetén a lejátszó és az időmezők használhatók maradnak. Elemzés közben ezen a lapon más videófeldolgozást nem indíthatsz.
