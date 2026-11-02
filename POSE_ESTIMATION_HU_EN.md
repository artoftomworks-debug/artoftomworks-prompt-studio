# Képből pózbecslés / Local image-to-pose estimation

2026-11-01

HASZNÁLAT
1. Futtasd az UPDATE.cmd fájlt. A szokásos verzióellenőrzés és mentés után
   a helyi szerver és a felismerő futtatója/modellje is frissül.
2. Most a Studio teljes újraindítása szükséges a megszokott indítóddal.
   Zárd be a korábbi külön pózlapot, és nyisd meg újra a nagy szerkesztőt.
3. A Póz referenciaképe részben válassz vagy húzz be képet.
4. Nyomd meg a Póz becslése a képből gombot. A feldolgozás külön háttérszálon,
   helyben, CPU-s modellel indul. A képet nem küldjük külső MI-szolgáltatásnak.
5. Nézd át a számozott előnézetet, pipáld ki a szükséges alakokat, majd
   Kijelölt figurák hozzáadása. A meglévő figurák megmaradnak, összesen max. 8.
   A Figurák cseréje külön megerősítéssel váltja le a meglévő figurákat.
6. A narancssárga pontok alacsonyabb láthatóságú/bizonytalan becslések.
   Javítsd őket az ízületkezelőkkel. Az ellenőrzött póz külön gombbal
   ellenőrzöttnek jelölhető. A kézzel javított ízületek jelölése törlődik.
7. A Visszavonás a becslés átvételét és a későbbi javításokat is visszavonja.

FONTOS TUDNIVALÓK
A kezdőpóz a fotó síkjába kerül, elölnézetben a referenciához igazítva.
Egyetlen képből nem rekonstruáljuk a valódi mélységet, méretet, takart
anatómiát vagy a figurák egymás mögötti távolságát. A becslés nem garancia;
takart, levágott vagy szokatlan póznál kézi korrekció kellhet. A testmodell
és mélységréteg az így létrehozott, javítható figurákat követi.
Életkort, nemet vagy személyazonosságot nem találunk ki.

A felismerő max. 8 alakot keres, de nem garantált minden alak felismerése.
45 másodperc után leáll; a Megszakítás gomb azonnal leállítja a háttérszálat.
Az első modellbetöltés lassabb lehet. Sikertelen becslés és megszakítás nem
módosítja a mentett jelenetet. Hozzáadáskor a kamera és fények megmaradnak.
Export előtt ellenőrizd a kameranézetet és a képkivágást.

A fotó nem kerül a promptba vagy a mentett jelenetbe. A mentett figurákhoz
a pontok bizonytalansági értékei tartozhatnak; ez nem pontossági garancia.
Az OpenPose JSON ezeket a pontmegbízhatósági értékeket is átadja.
Nincs szükség futó ComfyUI-ra, Ollamára vagy felhőfiókra. A futtató és a
modell a frissítőben van; használat közben nincs internetes modellletöltés.
Korszerű, WebAssemblyt és háttérszálat támogató böngésző kell. A telepítés
után a megszokott helyi Studio-indítót használd, ne a HTML-fájlt közvetlenül.
Mind a nyolc nyelv és a kézzel kikapcsolható NEW jelzés támogatott.

ENGLISH
Run UPDATE.cmd and fully restart Studio with its normal launcher. Close old
pose tabs and reopen the workspace. Load a pose reference, click Estimate pose
from image and review the numbered preview. Select estimates and Add selected
figures; replacing existing figures requires separate confirmation. Undo works.
Up to eight figures are supported. Correct orange uncertain joints manually;
the selected pose can be marked reviewed. Camera and lights remain unchanged.

Inference runs on demand, locally in a dedicated CPU worker, using bundled
MediaPipe runtime/model files. No image is uploaded to external AI, and no
model is fetched from the internet at runtime. Cancel terminates the worker;
there is a 45-second timeout. ComfyUI, Ollama and cloud accounts are not needed.
Use a modern browser with WebAssembly and worker support via the usual launcher.

Initial poses are aligned to the reference in the photo plane. This does not
reconstruct metric scale, hidden anatomy, true depth or inter-person depth.
Occluded, cropped and unusual poses need manual review. Age, gender and identity
are not inferred. Landmark confidence/visibility is not an accuracy guarantee.
The body/depth views follow the editable figures, not reconstructed photo depth.
The source image stays out of saved scene JSON and prompt text. Full scene
backups retain uncertainty markers; BODY18 JSON carries landmark confidence.

THIRD-PARTY COMPONENTS
Runtime: @mediapipe/tasks-vision 1.2.0, Apache-2.0 (LICENSE-MediaPipe.txt).
Model: official MediaPipe Pose Landmarker Full float16 version 1.
Original URLs, npm archive integrity and file SHA-256 values are recorded in
pose-assets/THIRD_PARTY.json. See the linked official model card/source terms.
Third-party terms are separate from the Prompt Studio application terms.

VALIDATION
The actual bundled model ran successfully on a local reference using the
installed CPU MediaPipe runtime. Browser worker protocol and generated pages,
landmark mapping, reference alignment, confidence review, undo, cancellation,
asset route limits and existing pose regressions are tested. The full browser
WASM inference path still needs a user-browser trial; do not treat simulated
worker tests as browser inference validation.
