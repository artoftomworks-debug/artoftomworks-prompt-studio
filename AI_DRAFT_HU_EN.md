# Folytatható MI-segítő / Resume AI assistant work

1. Futtasd az UPDATE.cmd fájlt.
2. Indítsd újra a Prompt Studiót a megszokott indítóddal, majd Ctrl+F5.
   A frissítés előtti, még nem mentett MI-választ előbb másold ki.
3. A Kérdezd az MI-t ablakot bezárhatod, másik képet kereshetsz, majd a
   felső MI-gombbal visszatérve ugyanonnan folytathatod.

MEGMARAD
A saját kérdés, átadandó prompt, teljes szerkeszthető válasz, feladat,
segítő, elérhető helyi modell, videóhossz, célmodell, minőségjelölés,
görgetési helyzet. A képet a panel bezárása nem törli.
A szöveg automatikusan a böngésző helyi tárába mentődik; a lap újratöltése
után is visszajön. A képet nem mentjük tartósan: újratöltés után csatold újra.
A böngészőadatok törlése a mentett MI-piszkozatot is törli.

ÚJ GOMBOK
- Új kérés: megerősítés után üres munkát indít. A mostani az előző állapotba kerül.
- Előző állapot: egy korábbi állapotot visszahoz, az aktuálissal cserélve.
  Új kérés, másik prompt átadása, feladatváltás, képváltás és új válasz kérése
  előtt készül ilyen állapot. Ez egy előző állapot, nem teljes beszélgetésnapló.
  A korábbi szöveges állapot a lap újratöltése után is elérhető.

A már elindított helyi válasz a panel bezárása után is megérkezhet és mentődik.
Új kérés vagy állapotváltás megszakítja a korábbi kérést; későn érkező válasz
nem írhatja felül az új munkát. Lapújratöltés után a megszakadt kérés nem indul
újra magától: a megmaradt szöveget te küldheted el újra.
Nem küldünk automatikusan sem szöveget, sem képet külső szolgáltatásnak.
Ha a böngésző nem tud menteni, külön jelzés figyelmeztet; a nyitott lap
memóriájában a munka továbbra is megmarad.

A csomag az előző Megnyitás az Intézőben frissítést is tartalmazza; nem kell
külön előbb azt futtatnod. Nyolcnyelvű felület, kikapcsolható NEW jelzéssel.
A személyes fájlok, archívum, korábbi beállítások és mentett munkák megmaradnak.
A telepítő verziót ellenőriz, és ellenőrzött mentést készít.

ENGLISH
Run UPDATE.cmd, restart Studio with its usual launcher, then Ctrl+F5. Copy
any unsaved answer from the old version before reloading.
Ask AI keeps your request, source prompt, editable answer, task, assistant,
available model and video options when the panel closes. Text drafts and one
previous state are saved locally in this browser. The image stays in memory
across panel navigation; reattach it after a page reload. Browser-data deletion
removes drafts. No automatic AI request is sent when restoring a draft.
New request starts an empty draft after confirmation. Previous state swaps
current and previous work. This is one previous state, not a full chat history.
A pending local answer may finish while the panel is closed. Starting another
request/state invalidates stale answers. Reloaded pending work is marked
interrupted and is never resent automatically. Storage failures are displayed.
Includes the previous File Explorer viewer button update. All eight languages
and dismissible NEW labels are included; personal files and settings are kept.

VALIDATION
21 automated checks passed: panel close/reopen in eight languages; retained
image and video controls; local text persistence/reload; previous-state swaps;
task/new-request handling; background completion; stale response prevention;
interrupted requests; blocked/corrupt storage; prompt-copy and vision/model
regressions; NEW labels; existing Explorer actions. Full browser visual testing
has not been performed. Updater validation is recorded in VERIFICATION.txt.
