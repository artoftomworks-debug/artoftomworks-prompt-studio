# Helyi MI első indítása – felületi segítség / Local AI setup guidance

2026-11-02 – helyi tesztfrissítés, még nem nyilvános GitHub-kiadás.

## Magyar

1. Futtasd az UPDATE.cmd fájlt.
2. Frissítés előtt másold ki az esetleg még a régi változatban nyitott, nem mentett választ.
3. Indítsd újra a Studiót a megszokott indítóddal, majd Ctrl+F5.
4. Az **Indulás egy képből** modellválasztója alatt és a **Kérdezd az MI-t** ablakban keresd a **Helyi MI beállítása** részt. Hiány vagy hiba esetén magától kinyílik, működő modellnél összecsukódik. Kézzel is nyitható/csukható.

Külön állapotot kap a nem elérhető Ollama, az üres helyi modelllista, a csak szöveges modellkészlet, a nem ellenőrizhető képértés és az elérhető megfelelő modell. Az **Ollama hivatalos letöltése** a hivatalos webhelyet nyitja. A **Letöltési parancs másolása** egy kezdő képértő modell parancsát másolja; azt a felhasználó indítja PowerShellben. Az **Ellenőrzés újra** újraolvassa a helyi listát. A létező ↻ gomb is használható.

Nem állítjuk, hogy a nem elérhető Ollama biztosan nincs telepítve: az alkalmazás lehet leállítva vagy blokkolva is. A képértési képesség nem azonos a modell tartalmi szabályaival, és nem szabadmemória-garancia. Nincs automatikus telepítés vagy képfeltöltés. A modelllista ellenőrzése nem indít képelemzést.

A korábbi munka-visszaállítás és Intéző-gomb frissítése is benne van. Az adatok, archívum és személyes fájlok megmaradnak. A verzióellenőrzés és ellenőrzött biztonsági mentés továbbra is működik. Új, kézzel elrejthető NEW jelölés; nyolcnyelvű felület.

Részletes, továbbadható útmutató: **LOCAL_AI_FIRST_RUN_8_LANGUAGES.md** a telepítés gyökérmappájában. A kiadáshoz előkészített README és gyorsindító is erre hivatkozik; a személyes telepítés régebbi README-fájljait a frissítő nem írja felül.

## English

Run UPDATE.cmd, restart Studio normally and press Ctrl+F5. Preserve any unsaved answer from an older version before updating. In **Start from an image**, and in the **Ask AI** panel, find **Local AI setup**. It expands when help is needed and collapses when a compatible model is available.

Separate states explain unreachable Ollama, no local models, text-only models, unverified vision capability and readiness. Official download links, a copyable starter command and Check again provide the next steps. Nothing is installed or sent automatically. The check reads local model metadata without running inference. Unreachable does not prove uninstalled, and readiness is not a memory or content-policy guarantee.

Includes the prior draft-memory and File Explorer updates. Existing data and settings are preserved, with verified backups and version checks. All eight languages and dismissible NEW labels are included. The eight-language guide is installed in the Studio root; existing personal README files are kept. Updated README/quickstart sources are prepared for a later public release.

## Verification

25 automated checks: setup states, all translations, links, command copy/failure, retry recovery, capability validation, cloud exclusion, stale-response prevention, no implicit media/inference requests, prompt copy, draft preservation and NEW markers. Updater checks are recorded separately in VERIFICATION.txt. A real first-install browser test remains useful; no GPU inference is run by this update's checks.
