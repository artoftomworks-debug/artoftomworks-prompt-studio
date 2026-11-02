# Olvasható pózkezelők / Readable pose controls

2026-11-01

Zárd be a korábbi külön pózlapot, futtasd az UPDATE.cmd fájlt,
majd Ctrl+F5 a Studio főlapján, és nyisd újra a külön szerkesztőt.
Az ideiglenes referenciaképet szükség esetén újra be kell húzni.

Javítások:
- Az oldalsáv nem növelheti túl a rögzített munkaterület rácssorát.
  Saját görgethető területe van; tartalma nem lóghat a lenti szövegekre.
- A referencia mezői teljes sorban, egy oszlopban jelennek meg.
- A visszaállító gomb külön, teljes szélességű sort kapott.
- A magyarázatok „A referencia használata” és „Kezelés és tudnivalók”
  lenyitható részekbe kerültek. A szöveg és a funkciók megmaradtak.
- A keskeny, egymás alatti nézet megtartja a természetes oldalmagasságot.
- A jelenet, figurák, kamera, fények és mentett beállítások nem változnak.

English: close old pose tabs, run UPDATE.cmd, Ctrl+F5 and reopen the workspace.
Reference controls now use one full-width row per field; the reset button has
its own row. Long reference and pose instructions are in collapsed help sections.
A zero-minimum fixed grid row and bounded scrolling sidebar prevent content
from extending into the notes below. Narrow stacked layouts retain natural
height. No pose, reference processing, scene or saved-data behaviour is changed.
Temporary reference images may need to be dropped again after reopening.

Known-version checks, verified backups and rollback protect the served page
and NEW registry. No media or saved settings are removed; no backend restart.

Verification: component/state, standalone bundle, CSS layout constraints and
installer checks. Live browser inspection was stopped by Computer Use because
it could not reliably identify the current browser URL. No alternate UI route
was attempted; the supplied screenshot and local source were used for the fix.
