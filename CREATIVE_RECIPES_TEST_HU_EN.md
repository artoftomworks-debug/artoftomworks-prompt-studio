# Bevált fogások és stíluskeverés — kipróbálható fejlesztés

A nyilvános 1.20.0 kiadástól külön előkészített változat. Nem publikáljuk automatikusan. A korábbi funkciók megmaradnak.

## Hol találod?

- A kép- és videónézegető promptgombjai mellett: **Mentés a beváltak közé**, **Ebből kérek még**. A gombok a fájladatok betöltése után válnak aktívvá.
- Jobbra fent a **★ Bevált fogásaim** gomb megnyitja a gyűjteményt.
- A promptműhelyben is menthető az ott szerkesztett szöveg.
- A stílusválasztóknál kinyitható a **Stílusok keverése** rész. Van külön keverék a meglepetésprompthoz, a klasszikus szerkesztőhöz, a kép→kép, kép→videó és promptműhely felületekhez, illetve a beváltakból épített munkapéldányhoz.

## Egy egyszerű próba

1. Nyiss meg egy képet az archívumból, majd válaszd a Mentés a beváltak közé gombot.
2. Teljes receptnél megmarad a pozitív/negatív prompt és a valóban kiolvasott beállítások. Adj neki beszédes nevet, és írd le, mi vált be vagy mit kerülnél legközelebb.
3. Csak a világítást szeretnéd átvenni? Válaszd a Világítás szerepet, jelöld ki a forrásprompt megfelelő részét, és kattints a Kijelölt szöveg átvétele gombra. A részletet szerkesztheted is. A program nem találja ki helyetted, mely mondat csak a világításról szól.
4. Az Ebből kérek még megnyitja a munkafelületet. Válassz: ugyanaz egy változtatással, új jelenet, vagy videó a referenciaképből.
5. Az új jelenethez pipáld ki a használni kívánt fogásokat és válaszd ki szerepüket. Az új jelenetbe csak a kiválasztott részleteket tesszük át; teljes régi jelenet helyett külön részletet kell választanod.
6. A munkapéldány alatt látszanak a források, saját tapasztalataid és a régi beállítások. A másolás csak a promptot másolja; a megjegyzéseket külön mutatjuk. A negatív szöveg külön másolható.
7. Átveheted az eredményt a szerkesztőbe vagy a promptműhelybe, külön kérhetsz MI-ellenőrzést, illetve a munkapéldányt a forráshivatkozásaival együtt is elmentheted. Egy új tervhez nem találunk ki generálási beállításokat.

## Stíluskeverés

Legfeljebb négy irány választható, például **Glamour + Sci-fi + Film noir**. Az új változatban százalékos csúszkákkal adhatod meg arányukat, és saját stílust is hozzáadhatsz. Ezek leíró utasítások, nem numerikus modell- vagy LoRA-súlyok, és nem garantálják a generátor viselkedését. Festészeti és fényképes irány együtt választásakor figyelmeztetünk. A stílus és megvilágítás külön szerkeszthető mezőbe kerül; a jelenet szövege megmarad.

Az összeállítás saját néven menthető; legfeljebb 40 keverék tárolható. A keverékek böngészőbeállítások; a keverő külön JSON-biztonsági mentésével a saját stílusok és fények is menthetők. A Bevált fogásaim JSON-exportja a recepteket és tapasztalatokat menti, a külön keverőbeállításokat nem. A jelenetet és keveréket tartalmazó promptot teljes receptként is elmentheted.

A meglepetésprompt a kijelölt bevált részleteket csak a külön jelölőnégyzet bekapcsolása után használja. A felnőtt művészeti téma továbbra sem kerül bele az általános véletlen témaválasztásba.

## Mentés és korlátok

- A gyűjtemény ebben a böngészőprofilban, ezen a helyi címen marad meg. Legfeljebb 300 recept / körülbelül 2 MB tárolható. **Exportálj rendszeresen JSON-mentést.** A böngészőadatok törlése a helyi mentéseket is eltávolíthatja.
- Az export promptokat és saját jegyzeteket tartalmaz. Forrásként csak fájlneveket és belső archívumazonosítókat adunk hozzá, helyi útvonalat, bélyegképet, videót vagy modellsúlyt nem. A promptba saját magad által beleírt személyes adatokat megosztás előtt külön nézd át.
- Az eredeti fájl megnyitása a jelenlegi archívumazonosító alapján működik. Költöztetett vagy eltávolított média esetén a kapcsolat megszakadhat; az elmentett recept és jegyzet ettől megmarad.
- A receptek eltávolítása csak a gyűjtemény bejegyzését érinti, az eredeti képet/videót nem.
- A két böngészőfül közötti ütközésnél a mentés hibát jelez, nem írja felül csendben a másik lapon elmentett adatokat. Sérült tárhelyadatot sem írunk felül automatikusan.
- A régi modell, LoRA, seed és felbontás támpont. Másik modellhez a kompatibilitást és az aktuális beállításokat a generálóprogramban ellenőrizd. Nem indítunk generálást.
- A tapasztalatok saját feljegyzések, nem automatikus képelemzés eredményei. A forráslista a kiválasztott kiindulási elemeket dokumentálja; későbbi szabad szerkesztésből nem következtetünk új hozzárendelésekre.
- A videóterv nem csatol képet automatikusan. A kép→videó felületen külön add hozzá a referenciát; videóforrásból szükség esetén válassz ki egy állóképet.
- A mentés, újrahasználat és stíluskeverés helyben, MI nélkül működik. Csak az Átnézés MI-vel gomb használata adja át a tervet és a hozzá tartozó megfigyeléseket a meglévő MI-segítőnek. GPU-s generálást és helyi képelemzést továbbra is egymás után futtass.

## English

This separate development copy adds **Save to proven recipes** and **More like this** to both archive viewers, a searchable local recipe collection with JSON backup/import, editable reuse fragments, personal success/avoidance notes, source links and passport copying with experience notes.

Drafts can retain the same scene with one requested change, borrow explicit fragments for a new scene, or suggest motion for a separately attached reference image. Source attribution and notes stay outside prompt-only copying. Composite drafts can be saved with their sources; unknown generation settings are not invented.

Style mixers are available in the classic builder, surprise prompts, image-to-image, image-to-video, workbench and recipe workspace. Up to four descriptive directions and 40 named mixtures are supported. They are not LoRA weights or compatibility guarantees. Browser-only mixture preferences are separate from recipe JSON backups.

Recipe data stays in browser storage (300 entries / approximately 2 MB maximum). Export backups. Source fields exclude absolute paths and media, but your own prompt/note text may contain private information: review before sharing. Imports preserve local entries on ID collisions. Failed writes, damaged storage and cross-tab conflicts do not silently overwrite saved recipes.

The original generator files remain unchanged. File relocation can break source links without destroying the saved recipe. Recorded settings are reference only; image attachment and generation are manual. There are no automatic AI requests. Only an explicit AI-review action uses the existing helper.
