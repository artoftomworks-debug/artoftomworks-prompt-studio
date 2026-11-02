# Sorozattervező / Series planner — 2026-10-30

## Magyar

1. Indítsd az UPDATE.cmd fájlt. A megszokott E:\SwarmUI_stuffs\Studio119 telepítést frissíti.
2. A nyitott promptvázlatodat előbb mentsd el, majd a Studio lapján Ctrl+F5.
   Ennél a frissítésnél nem kell újraindítani a helyi szervert.
3. Fent, a saját választások eszközsora alatt keresd a **Sorozattervezőt**.
4. Válassz kiindulási pontot, kattints az **Új sorozat a kiindulási pontból** gombra,
   majd szerkeszd a közös alapot és a három jelenetet.

A kezdőkép- és videóprompt külön szerkeszthető és másolható. A közös beállítás
változása frissíti az automatikus promptokat. A kézi szöveg megmarad, és jelzés
mutatja, ha az alapja változott. Az **Újraépítés** gomb kérdez, mielőtt lecseréli.

Öt kiindulási pont: esős kávézó, portré, termék, tájkép, saját ötlet. A **Terv
másolása új sorozatként** új változatot indít, tervezett állapottal, a régi
eredményfájlok hivatkozása nélkül. Az eredeti terv megmarad.

Legfeljebb 25 sorozat menthető a jelenlegi böngészőben. JSON-exporttal ments
biztonsági másolatot; TXT-exporttal az összes promptot egyszerre viheted tovább.
Az import új tervet hoz létre. Meglévő sorozatot nem ír felül.

Kész képet/videót is csatolhatsz helyi előnézethez. Nem tölti fel, másolja vagy
törli a médiafájlokat. Csak a fájlneveket menti; újranyitáskor újra ki kell
választani a fájlokat. Az előnézet ehhez a munkamenethez tartozik.

A felület nyolcnyelvű. A promptváz angol, a saját leírásod eredeti nyelvét
megőrzi; nem fordító vagy képgenerátor. Az időtartam és képarány tervezett
értékek: a generálóban is állítsd be őket. A három állapot kézzel állítható:
tervezett, elkészült, bevált. Fájlcsatoláskor a tervezett elkészültre vált.

A frissítő csak az egyfájlos felületet cseréli, előtte ellenőrzött mentéssel.
Az archívum, képek, videók és a meglévő böngészőbeállítások megmaradnak.

## English

Run UPDATE.cmd, save any open draft, then Ctrl+F5 in Studio. No server restart
is needed. Find Series planner below the choices toolbar near the top.

Create a three-shot plan from a starting point. Edit shared location, subjects,
time, lighting, style, palette and aspect ratio. Each scene has its own framing,
motion, suggested duration, progress and separate image/video prompts.
Automatic drafts follow setting changes; manually edited prompts are retained
and marked stale. Rebuild replaces a manual draft only after confirmation.

Save up to 25 plans locally. Duplicate a plan for a new variation, export/import
JSON backups or export every prompt to TXT. Imports create a new plan.
Result media can be previewed locally; only filenames persist, so re-select
the files after reopening. No media upload, copy, deletion or generation occurs.

Controls support eight languages. Prompt scaffolding is English and preserves
the language of user-written descriptions. Aspect ratio and duration are plans,
not recovered generation metadata; configure them in your generation tool.

This update replaces only the bundled interface, with a verified backup first.
Archive files and existing settings are preserved. Unknown versions are refused.
