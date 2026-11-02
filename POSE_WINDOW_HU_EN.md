# Pózszerkesztő új lapon / Pose workspace in a new tab

2026-11-01

Futtasd az UPDATE.cmd fájlt, majd Ctrl+F5.
Figurák és testtartások → Megnyitás új lapon (aranyszínű gomb).

A külön lap csak a pózműhelyt tölti be, nagy munkaterülettel. A jobb oldali
vezérlők külön görgethetők, az előnézet látható marad. Nagyítás: 50–400%;
Kiválasztott ízület középre; Teljes nézet. A nagyítás csak az előnézetre hat,
a stúdiókamerát és az export képkivágását nem módosítja. A szögek külön
számmezővel, 0,1 fokos lépésekben is állíthatók. A figurák helyzete 0,01 m-es
lépésekben szerkeszthető. A kamera külön lenyitható részben beállítható.

A főlap és az új lap ugyanazt a mentett jelenetet használja. A változások
mindkét irányban követik egymást. Párhuzamos, elavult módosítás nem írhatja
felül a frissebb mentést: hiba esetén a legutóbbi jelenet visszatöltődik.
A bezárás után a mentett figurák megmaradnak; a lapot később újranyithatod.
A szöveges stúdióleírás másolható, szerkeszthető, újraépíthető. A teljes jelenet
JSON-ként is menthető. A főoldali presetlista és minden meglévő stúdióadat megmarad.

Ha a böngésző blokkolja az új lapot, az oldal ezt jelzi. Indítás a megszokott
START/parancsikon segítségével; a külön lapnak is hozzá kell férnie a böngésző
helyi tárolójához. Nincs szükség SwarmUI-újraindításra. Ez a frissítő a
nálad kiszolgált egybefűzött felületet és a NEW-jegyzéket frissíti,
ismeretlen verziónál megáll, mentést készít, hiba esetén visszaállít.

## English

Run UPDATE.cmd, then Ctrl+F5. Figures and poses → Open in new tab.

A self-contained local tab provides a large preview and an independently
scrolling controls column. Preview zoom 50–400%, centre selected joint, reset
view, exact angle inputs (0.1 degree steps), positions (0.01 m steps), camera
settings, editable/copyable directions and full scene JSON backup are included.
Preview zoom does not change the camera or exported pose framing.

The main tab and separate workspace share the same saved plan in both directions.
Stale conflicting edits are rejected and the latest scene is reloaded. Closing
the tab keeps the saved scene; reopen from Studio later. Saved presets and other
Studio settings are retained. The tab includes no archive indexing, AI calls,
external scripts, generation models or installation dependencies.

The browser must permit opening a new local tab and access to its same-origin
local storage; use the usual Studio launcher. Popup failure is shown clearly.
The previous pose-export compatibility limitations still apply. Eight languages.
This personal updater checks known predecessor versions, creates verified backups
and rolls back if installation fails. No backend restart is required.
