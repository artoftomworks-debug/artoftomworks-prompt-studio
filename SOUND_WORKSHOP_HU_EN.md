# Sound workshop / Hangműhely — 2026-11-02

## English

**Open it:** use **Sound workshop – NEW**, next to the Video workshop section on the Studio home page. It opens a large separate tab with readable controls and independently scrolling library/arrangement panes.

### Included and ready to play

The update includes **17 finished WAV samples** (about 8 MB), with no model installation or download needed for playback:

- Seven original English synthetic narrations: arena/sports, trailer, advertisement, documentary, meditation, science fiction and fantasy.
- Four procedurally synthesized backgrounds: rain at a window, soft wind, room tone and distant traffic texture.
- Four original synthesized effects: mechanical latch click, transition whoosh, cinematic impact and science-fiction chime.
- Two simple original music beds: gentle and suspenseful.

Narration is **English**, independently of your interface language. Mood labels are starting examples; they are not imitations or endorsements of known announcers or performers. Backgrounds are synthetic textures, not location recordings. This first release plays finished samples; generating speech from your own text is a future extension.

Search names, tags or spoken text; for example, **wrestling** finds the arena introduction. Filter by type, mood, audio language or favorites. Click **Listen** to hear the selected sound in the player. Narration text can be read and copied, and included WAVs can be downloaded.

### Your own sounds and arrangements

Drop WAV, MP3, M4A, FLAC or OGG files onto the library. They are copied into the local Studio video library; originals remain unchanged. Limits are shared with Video workshop: 64 media assets, 6 GiB total, 2 GiB per file. FFmpeg must already be available/configured in Video workshop for importing and preparing timeline media. Included WAV playback itself needs no FFmpeg, GPU or AI model.

For your imported audio, record name, type, mood, tags, source and usage terms. These are personal notes, not an automatic rights check. Favorite choices and saved arrangements live in `data/sound-workshop/library.json`; conflicting changes from another tab are rejected instead of overwriting that tab's work.

**Add to arrangement** stages a sound. Choose start time, gain, fade-in/out and optional repeat to video end. Three included moods are ready to load: **Rainy café**, **Arena opening** and **Quiet reflection**. Loading can replace the current arrangement after confirmation; Undo is available. Save up to 20 custom arrangements of up to 12 tracks. Removing a saved mood never deletes audio files. Draft arrangement/filter settings and unfinished audio-detail notes are kept in this browser.

### Into a video

1. Choose **Place on video timeline** for one sound, or **Send arrangement to Video workshop** for your staged tracks.
2. Return to an already-open Video workshop, or press **Open Video workshop**. The transfer is kept in this browser at the same Studio address for up to 24 hours.
3. Review the received names, start times and gains. Explicitly choose **Add audio tracks**. Sending never changes an open video project automatically. Existing clips, edits and audio tracks are retained; the total limit is 12 audio tracks. The addition can be undone.
4. Render a short preview to hear the final mix. Source audio stays unless you mute it. A narration longer than the remaining video is cut at the video end. Extend the timeline or change its start if you need the whole narration.

The Sound workshop player auditions individual files at their source level. It is not the final arrangement mix. Timeline start, gain, fades and looping are applied in Video workshop's rendered preview/export. Picture-preserving audio mode can keep the original encoded picture when the existing video project meets that mode's requirements.

### Usage terms and update

See **Starter-sound usage terms** inside the workshop or `sound-samples/SAMPLE_TERMS.txt`. Included sounds may be edited and used in completed personal/commercial audiovisual work; they may not be sold or redistributed as standalone sound packs. Those terms do not cover your imported files. The scripts are original; narration was rendered with Kokoro-82M stock synthetic voices on CPU. Model sources, hashes and generation details are in `sound-samples/PROVENANCE.json`. Models, inference tools and voice vectors are not shipped or required to use the finished sounds.

Save work, run **UPDATE.cmd**, restart Studio normally, refresh with Ctrl+F5, and close/reopen old Video workshop tabs. Do not launch workshop HTML files directly from the filesystem; use the local Studio page.

## Magyar

**Hol találod?** A Studio főlapján a Videóműhely közelében: **Hangműhely – NEW**. Nagy külön lapon nyílik, jól olvasható vezérlőkkel és egymástól függetlenül görgethető hangtárral/összeállítással.

### Beépített minták

**17 kész WAV** kerül a frissítésbe, összesen körülbelül 8 MB. A lejátszásukhoz nem kell modell, letöltés vagy GPU.

- Hét saját angol szöveg szintetikus narrátorhangon: aréna/sport, filmelőzetes, reklám, dokumentumfilm, meditáció, sci-fi és fantasy.
- Négy szintetikus környezeti háttér: eső az ablaknál, lágy szél, szobahang és távoli forgalom textúrája.
- Négy saját szintetikus effekt: zárkattanás, átmeneti suhanás, filmes hangsúly és sci-fi értesítési hang.
- Két egyszerű saját zenei alap: lágy és feszültségkeltő.

A narráció **angol**, magyar felület mellett is. A hangulatjelölések ötletadó példák, nem ismert előadók utánzásai. A környezeti minták nem helyszíni felvételek. Ebben a kiadásban kész hangokat használhatsz; saját szöveg felolvastatása későbbi bővítés.

Kereshetsz névre, címkére és az elhangzó szövegre. A **wrestling** szó megtalálja az arénás mintát. Szűrhetsz típusra, hangulatra, nyelvre és kedvencekre. A **Belehallgatás** a lejátszóba tölti a hangot. A narráció szövege olvasható/másolható, a beépített WAV külön letölthető.

### Saját hangok és menthető hangulatok

Húzz be WAV, MP3, M4A, FLAC vagy OGG fájlokat. A program a helyi Studio-videótárba másolja őket; az eredeti megmarad. A Videóműhellyel közös korlát 64 médiaelem, összesen 6 GiB, fájlonként 2 GiB. Importáláshoz és az átvitel előkészítéséhez a Videóműhelyben elérhető/beállított FFmpeg kell. A kész minták egyszerű lejátszásához nem kell FFmpeg.

A saját hanghoz nevet, típust, hangulatot, címkéket, forrást és licencjegyzetet adhatsz. Ez saját feljegyzés, nem automatikus jogi ellenőrzés. A kedvencek és mentett hangulatok a `data/sound-workshop/library.json` fájlban maradnak. Másik ablakból történt változás esetén a program frissítést kér, a korábbi munkát nem írja felül.

A **Hangulathoz hozzáadás** összegyűjti a hangokat. Beállítható kezdés, hangerő, fel-/lekeverés és ismétlés. Három kész összeállítás: **Esős kávézó**, **Arénás nyitány**, **Csendes elmélyülés**. Betöltéskor a csere megerősítést kér; visszavonható. Legfeljebb 20 saját hangulat menthető, összeállításonként maximum 12 sávval. Mentett hangulat eltávolítása nem töröl hangfájlt. Az összeállítás vázlatát, szűrőit és a befejezetlen hangadat-jegyzeteket a böngésző megőrzi.

### Átvitel videóhoz

1. Egy hangnál **Videó idővonalára helyezés**, többnél **Összeállítás küldése a Videóműhelynek**.
2. Menj vissza a nyitott Videóműhelyhez, vagy nyomd meg a **Videóműhely megnyitása** gombot. Az átvitel azonos böngészőben és Studio-címen legfeljebb 24 óráig elérhető.
3. Nézd át az átvett neveket, kezdést és hangerőt, majd válaszd a **Hangsávok hozzáadása** gombot. A küldés önmagában nem módosítja a videóprojektet. A meglévő vágás és hang megmarad; összesen 12 hangsáv lehet. A hozzáadás visszavonható.
4. Rövid renderelt előnézettel hallgasd meg a keverést. Az eredeti hang némításig megmarad. A videónál hosszabb narráció a videó végén levágódik; a teljes szöveghez szükség esetén hosszabbítsd az idővonalat vagy módosítsd a kezdést.

A Hangműhely lejátszója egyetlen forrásfájlt mutat, nem a teljes összeállítás keverését. A kezdés, hangerő, lekeverés és ismétlés a Videóműhely renderelt próbáján/exportjában érvényesül. Ha a projekt megfelel a képmegőrző hangjavítás feltételeinek, a kép újrakódolás nélkül maradhat.

### Feltételek és frissítés

**Mintahangok felhasználási feltételei**, illetve `sound-samples/SAMPLE_TERMS.txt`: a beépített hangok elkészült személyes és üzleti audiovizuális alkotásokhoz szerkeszthetők/felhasználhatók; külön hangcsomagként nem értékesíthetők vagy terjeszthetők. Ez a saját behúzott fájlokra nem ad engedélyt. A saját narrációs szövegek Kokoro-82M szintetikus alaphangjaival, CPU-n készültek; a források/hash-ek a PROVENANCE.json fájlban vannak. Modell vagy beszédgeneráló környezet nincs a letöltésben, használathoz nem szükséges.

Mentsd a munkád, indítsd az **UPDATE.cmd** fájlt, utána indítsd újra a Studiót a megszokott módon. Ctrl+F5, majd a régi Videóműhely-lapok bezárása/újranyitása szükséges. A műhely HTML-jét ne közvetlenül a fájlrendszerből indítsd; a helyi Studio-főlapot használd.
