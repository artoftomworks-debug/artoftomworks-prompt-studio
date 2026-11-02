# Nagyobb pózelőnézet és felbukkanó súgó / Larger pose preview and contextual help

2026-11-01

1. Futtasd az UPDATE.cmd fájlt.
2. Zárd be a külön pózlapot, frissítsd a Studio főlapját Ctrl+F5-tel,
   majd nyisd újra a pózszerkesztőt. Ha a régi nézet marad, indítsd újra
   a Studiót a megszokott indítóddal.
3. Az előnézet feletti Kezelők elrejtése gomb teljes szélességet ad a képnek.
   Ugyanott a Kezelők megjelenítése gomb visszahozza az oldalsávot.
4. A ? súgók egérrel, billentyűzetes fókusszal és kattintással is működnek.
   Kattintva nyitva maradnak; újabb kattintás, Esc vagy mellékattintás bezárja őket.

A súgó a nézeteket, nagyítást, koordinátákat, ízületmozgatást, illesztést,
csontszögeket, képréteget, kameracélzást és pózexportot magyarázza.
A felbukkanó buborék a görgethető oldalsávon kívül jelenik meg, saját hátterével.
Mind a nyolc nyelv támogatott. A pózok, kamera, fények és mentett adatok
megmaradnak. A referenciaképet új lap nyitásakor esetleg újra be kell húzni.
A NEW jelzés a pózszerkesztő új lehetőségeit mutatja; kézzel kikapcsolható.

English: run UPDATE.cmd, close old pose tabs, Ctrl+F5 in the main Studio tab,
then reopen the workspace. Restart Studio if it still shows the old page.
Hide controls above the preview expands it to full width; Show controls restores
all fields. Contextual ? help supports hover, focus and click, with Escape and
outside-click dismissal. Help floats outside scrolling controls, clamped to the
viewport, using the browser top layer where supported. All eight languages are
included. No changes to saved scenes or personal media.

Verified: help interactions, language changes, viewport positioning, real
bundled-page execution in test DOM, reference/pose/camera state preservation,
existing pose regressions and updater backup/rollback tests. These checks do
not replace visual testing in the user's browser.
