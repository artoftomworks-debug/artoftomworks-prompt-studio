# Százalékos stíluskeverés, saját stílusok és fények — tesztváltozat

Ez a korábbi Bevált fogásaim fejlesztést is tartalmazza. A nyilvános GitHub/Civitai kiadás változatlan; ez külön kipróbálható frissítés.

## Hol találod?

A **Stílusok keverése** részt nyisd ki. Elérhető a klasszikus szerkesztőnél, a meglepetéspromptnál, a kép→kép és kép→videó felületen, a promptműhelyben és a bevált receptekből épített munkapéldánynál is.

### Arányok

A **Javasolt** gomb egy gombnyomással beállít egy módosítható kiindulópontot a kiválasztott stílusokhoz. Az első stílus kapja a vezető szerepet: két stílusnál 70–30, háromnál 60–30–10, négynél 55–25–15–5 az induló arány. Egyetlen stílus 100%. Stílusválasztás nélkül nem választ helyetted témát vagy stílust, csak semleges kezdőfényeket ad.

A világítás egyszerű helyi stílusprofilból készül: például glamourhoz derítettebb, noirhoz kontrasztosabb, cyber/sci-fi irányhoz erősebb peremfényű kiindulópontot ad. Festészeti/rajzos első stílusnál a fizikai fényerőket meghatározatlanul hagyja. Saját első stílusnál az arányokat javasolja, a meglévő fényeket megőrzi. Nem elemez képet, és nem kér választ MI-től. A jelenet szövege megmarad, a külön Stílus és fények mező frissül.

A **Javaslat visszavonása** gomb azonnal visszaállítja az előző arányokat, fényeket és a kézzel írt mezőszöveget is. A visszavonás a következő módosításig vagy az oldal újratöltéséig érhető el, így egy későbbi finomítást nem ír felül véletlenül. Ezek szerkeszthető kezdőértékek, nem az adott képhez garantáltan optimális beállítások.

- Legfeljebb négy kiválasztott stílus arányai összesen 100%-ot adnak. Ha az egyik csúszkát átállítod, a többi osztozik a maradékon. A mellette lévő számmezőbe pontos értéket is beírhatsz.
- Például Glamour + Sci-fi + Film noir választása után állítsd a noirt 10%-ra, majd a glamourt 60%-ra; szükség esetén a számmezőkkel finomítsd a keveréket. A többiek aránya minden változtatás után újraoszlik, ezért egy rögzített teljes aránysor beállítása egynél több lépést igényelhet.
- Egyetlen stílus önmagában 100%. A Nincs választással eltávolítható. A 0%-os összetevő kimarad a promptból.
- A százalékok a leíró hangsúlyokat jelentik. Nem modell-/LoRA-súlyok, és nem mérik a létrejövő kép stílusarányát.

### Keresés és saját stílus

A listában többek között külön **Abstract / absztrakt, Surrealism / szürrealizmus, Cyber, Cyberpunk**, valamint Art Nouveau, Art Deco, impresszionizmus, expresszionizmus, kubizmus, pop art, anime, képregény, steampunk, solarpunk, retrofuturizmus és brutalizmus is szerepel. A kereső a nevekben, leírásokban és a hozzáadott keresőszavakban keres; a már kiválasztott elemek láthatók maradnak.

1. Nyisd ki a **Saját stílusok** részt, válaszd az Új stílust.
2. Adj neki nevet és rövid, látványt leíró szöveget. Angol promptokhoz angol leírást ajánlunk. Név alapján a program nem talál ki stílusjegyeket.
3. Mentsd el. Az új stílus az összes keverő listájában megjelenik, és beállítható az aránya.
4. A saját stílus kiválasztás után szerkeszthető vagy megerősítéssel eltávolítható. Az eltávolítás a választásokból és mentett keverékekből is kiveszi. Az eredeti média és a korábban készített promptszöveg ettől nem változik.

Legfeljebb 60 saját stílus tárolható. Ez a funkció szöveges leírást készít, nem tölt le modellt, LoRÁ-t vagy bővítményt, és nem küld MI-kérést.

### Fények

A **Megvilágítás** részben külön 0–100-as csúszkát és számmezőt kap a főfény, derítés, ellenfény/peremfény és környezeti fény. Ezek függetlenek: nem kell 100-ra összeadódniuk. A 0 az adott fényt nem határozza meg; nem utasítja a generátort teljes sötétségre.

A szöveg finom, mérsékelt, erős vagy nagyon erős fényirányként írja le az értékeket. Ezek nem mért fényerők és nem a generálóprogram konkrét beállításai.

### Alkalmazás és mentés

A jelenet szövege és a keverék külön marad. A **Stílus és fények — külön, szerkeszthető mező** a csúszkákból készül, de szabadon át is írhatod. Egy új csúszka-/stílusválasztás ezt a mezőt építi újra; a jelenetleírást nem változtatja meg. A Mező frissítése a beállításokból gomb visszaállítja a választók alapján készült szöveget.

Van külön **Teljes prompt másolása**, **Csak a jelenet másolása**, **Csak a stílus és fények másolása**, valamint lenyitható teljesprompt-előnézet. A meglévő fő másolás, TXT-letöltés, aktuális prompt mentése és az MI-nek átadás is az összeállított szöveget használja. A megjegyzések és negatív prompt ettől külön maradnak. A keverék tehát a jelenet átírása nélkül cserélhető.

A korábbi változat által a prompt végére tett, egyértelműen megjelölt stílus-/fényirány-sorok a **Keverék leválasztása a meglévő promptból** gombbal áthelyezhetők az új mezőbe. Szabadon megfogalmazott jelenetmondatokat nem próbálunk automatikusan szétszedni. Ha a jelenet maga is tartalmaz világításra vagy stílusra vonatkozó utasításokat, azokat továbbra is nézd át az esetleges ellentmondások miatt.

A névvel mentett keverék az arányokat, a fényeket és az esetleg kézzel átírt külön mezőt is őrzi. A korábbi meghatározó/kiegészítő/jelzésértékű keverékek automatikusan átvehetők; az első mentésig az eredeti tárhelyadatot nem írjuk át.

A **Stílusok, fények és keverékek mentése** gomb teljes JSON-biztonsági mentést ad a saját stílusleírásokról, a munkafelületek választásairól, a fényekről és a legfeljebb 40 névvel mentett keverékről. A visszaállítás külön jóváhagyás után lecseréli ezeket. A Bevált fogásaim receptmentése továbbra is külön gyűjtemény.

Minden ebben a böngészőprofilban, ezen a helyi címen marad meg. Böngészőadat-törlés előtt készíts mentést. A háttérben történő mentés hibáját és a másik böngészőfül ütköző módosítását jelezzük; a meglévő adatot nem írjuk felül csendben. A felület nyolc nyelven használható; a saját leírásod szövegét nem fordítjuk át automatikusan.

## English

**Suggested** applies an editable starting point using local style rules, without image analysis or an AI request. The first selected style leads: 70/30 for two styles, 60/30/10 for three and 55/25/15/5 for four. With no styles selected it proposes neutral lighting without adding a style. Art-led mixtures leave physical lighting unspecified; a custom primary style keeps existing lighting. The scene is unchanged. **Undo suggestion** restores the previous shares, lighting and manually edited section until the next edit or page reload. These are starting values, not guaranteed optimal settings.

This test update includes the previous proven-recipes feature plus four-way percentage style mixing, independent key/fill/rim/ambient lighting strengths, searchable style choices and up to 60 editable custom style descriptions. Abstract, Surrealism, Cyber and Cyberpunk are separate built-in choices, alongside additional art movements.

Selected style shares total 100%; moving one control redistributes the remainder among the others. A single style has a 100% share. Zero-share styles are omitted. Light strengths are independent and are not normalized together; 0 leaves that light unspecified. All values guide descriptive prompt emphasis, not LoRA weights, measured brightness or guaranteed generator output.

Custom styles need a name and visual description; English descriptions are recommended for English prompts. They become available across all six mixers. No model download, inference or automatic AI request is involved.

Scene text and the editable **Style and lighting** section remain separate. Changing controls rebuilds only the section, leaving scene text unchanged. Copy the full prompt, scene only or section only; a full preview is available. Standard prompt copying, TXT downloads, current-prompt saving and AI handoff compose both sections. Named presets and mixer backups retain manually edited section text. Existing explicitly marked generated mix lines can be separated into the new field on request; ordinary scene instructions are not guessed or silently removed. Review possible contradictions already present in scene text.

Named presets retain both styles and lighting. Previous categorical mixtures migrate on use; existing stored data is preserved until a successful write. Complete JSON mixer backup/restore includes custom descriptions, per-workspace choices, lighting and up to 40 presets. Restore replaces mixer settings only after confirmation; proven-recipe backups remain separate. Browser data deletion can remove local settings: export backups. Failed writes and cross-tab conflicts do not silently overwrite saved data. The interface supports eight languages; custom descriptions are not automatically translated.
