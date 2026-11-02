# First-run local AI / Helyi MI első indítása

## English

The Studio ZIP does not include Ollama or AI model weights. Windows Copilot and a checkpoint installed for ComfyUI do not automatically supply the local Ollama model list.

1. [Install Ollama for Windows](https://ollama.com/download/windows), then start it.
2. Open a **new PowerShell window** and run `ollama pull gemma3:4b`. Wait for the model download to finish. [Gemma 3 4B](https://ollama.com/library/gemma3:4b) is a starter vision model; other compatible local vision models are also selectable. A model's content policy is separate from image capability.
3. Start Studio with **START.cmd**, then choose **Check again** beside the local model selector, or use **↻**.

If `ollama` is not recognized, finish installing Ollama and open a new terminal. Portable installations require their actual executable and the model directory used by the running Ollama server. Downloading through a different installation or model store can leave the Studio's list empty.

- **Ollama unreachable:** it may be missing, stopped, blocked or returning an unreadable response. The Studio cannot prove from this alone that it is uninstalled. Start Ollama and retry. Use the local Studio launcher rather than opening the HTML file directly.
- **No local models:** Ollama responded, but there are no eligible local models. Cloud-only models are excluded. Download a local model and retry.
- **Text-only models:** attached images require verified vision capability. Use a vision model.
- **Image capability unverified:** update Ollama or choose a known vision model, then check again. Unknown capability is not treated as text-only.
- **Ready:** a compatible model is available. This does not prove enough memory or guarantee that every request will be accepted.

The check reads `/api/tags` and, if necessary, model capabilities through `/api/show`. It does not load model weights, analyze the image, send prompts or install anything. The download button opens the official website; the command-copy button only copies text. Run image analysis and GPU generation sequentially. See [LOCAL_AI_GUIDE.md](LOCAL_AI_GUIDE.md) for memory and optional-model guidance.

## Magyar

A Studio ZIP-je **nem tartalmazza az Ollamát és a modellek súlyfájljait**. A Windows Copilotja és egy ComfyUI-hoz telepített checkpoint nem ad automatikusan helyi Ollama-modelllistát.

1. [Telepítsd az Ollamát Windowsra](https://ollama.com/download/windows), majd indítsd el.
2. Nyiss egy **új PowerShell-ablakot**, és futtasd: `ollama pull gemma3:4b`. Várd meg a modell letöltését. A [Gemma 3 4B](https://ollama.com/library/gemma3:4b) egy kezdéshez használható képértő modell; más kompatibilis helyi képértő modellt is választhatsz. A modell tartalmi szabályai és képértési képessége külön tulajdonságok.
3. A Studiót a **START.cmd** fájllal indítsd. A modellválasztónál nyomd meg az **Ellenőrzés újra** vagy **↻** gombot.

Ha az `ollama` parancsot nem ismeri fel a gép, fejezd be a telepítést, és nyiss új terminált. Hordozható Ollamánál a saját futtatható fájlt és a futó kiszolgáló modellkönyvtárát kell használni. Másik telepítéshez vagy másik modelltárolóba letöltött modell nem feltétlenül jelenik meg a Studio listájában.

- **Az Ollama nem érhető el:** lehet, hogy hiányzik, nem fut, valami blokkolja, vagy olvashatatlan a válasza. Ebből önmagában nem állapítható meg, hogy nincs telepítve. Indítsd el, majd próbáld újra. A helyi Studio-indítót használd, ne közvetlenül a HTML-t nyisd meg.
- **Nincs helyi modell:** az Ollama válaszolt, de nincs megfelelő helyi modellje. A csak felhős modelleket a lista kihagyja. Tölts le helyi modellt, majd ellenőrizd újra.
- **Csak szöveges modellek:** a képfeldolgozáshoz ellenőrzött képértés kell. Válassz képértő modellt.
- **Nem ellenőrizhető képértés:** frissítsd az Ollamát, vagy válassz ismert képértő modellt. Az ismeretlen képességet nem nevezzük szöveges modellnek.
- **Elérhető megfelelő modell:** a lista használható modellt talált. Ez nem szabadmemória-ellenőrzés és nem garantálja minden kérés elfogadását.

Az ellenőrzés a helyi `/api/tags` listát és szükség esetén a `/api/show` képességadatait olvassa. Nem tölti be a modellt, nem elemez képet, nem küld promptot és nem telepít. A letöltésgomb a hivatalos oldalt nyitja meg; a másolásgomb csak a parancs szövegét másolja. A képelemzést és a GPU-s generálást egymás után futtasd. Memóriakezelés és további modellek: [LOCAL_AI_GUIDE.md](LOCAL_AI_GUIDE.md).

## Deutsch

Ollama und Modellgewichte sind nicht im Studio-ZIP enthalten. Windows Copilot und ComfyUI-Checkpoints ersetzen kein lokales Ollama-Modell.

1. [Ollama für Windows installieren und starten](https://ollama.com/download/windows).
2. In einem neuen PowerShell-Fenster `ollama pull gemma3:4b` ausführen und den Download abwarten. Andere kompatible Vision-Modelle sind ebenfalls möglich.
3. Studio mit **START.cmd** starten, dann **Erneut prüfen** oder **↻** wählen.

Nicht erreichbar bedeutet nicht sicher deinstalliert: Ollama kann auch gestoppt oder blockiert sein. Eine leere lokale Liste benötigt ein heruntergeladenes Modell; reine Textmodelle können keine Bilder lesen. Unbestätigte Bildfähigkeit erfordert eine erneute Prüfung oder Ollama-Aktualisierung. Die Prüfung sendet keine Bilder oder Prompts, lädt keine Modellgewichte und installiert nichts. Bei portablem Ollama denselben Modellspeicher wie der laufende Server verwenden. GPU-Generierung und Bildanalyse nacheinander ausführen.

## Français

Le ZIP de Studio ne contient ni Ollama ni les poids des modèles. Copilot Windows et les checkpoints ComfyUI ne remplacent pas un modèle Ollama local.

1. [Installez et lancez Ollama pour Windows](https://ollama.com/download/windows).
2. Dans une nouvelle fenêtre PowerShell, exécutez `ollama pull gemma3:4b` et attendez la fin. D’autres modèles de vision compatibles conviennent aussi.
3. Lancez Studio avec **START.cmd**, puis **Vérifier à nouveau** ou **↻**.

Inaccessible ne veut pas forcément dire désinstallé : Ollama peut être arrêté ou bloqué. Une liste locale vide nécessite un modèle téléchargé ; un modèle texte ne lit pas les images. Si la vision est indéterminée, mettez Ollama à jour ou vérifiez à nouveau. La vérification n’envoie aucune image ni prompt, ne charge aucun poids et n’installe rien. Avec Ollama portable, utilisez le même stockage de modèles que le serveur actif. Séparez génération GPU et analyse d’images.

## Español

El ZIP de Studio no incluye Ollama ni los pesos de modelos. Copilot de Windows y los checkpoints de ComfyUI no sustituyen un modelo local de Ollama.

1. [Instala e inicia Ollama para Windows](https://ollama.com/download/windows).
2. En una ventana nueva de PowerShell ejecuta `ollama pull gemma3:4b` y espera a que termine. También puedes usar otros modelos con visión compatibles.
3. Inicia Studio con **START.cmd** y pulsa **Comprobar de nuevo** o **↻**.

Inaccesible no significa necesariamente desinstalado: Ollama puede estar detenido o bloqueado. Una lista local vacía requiere descargar un modelo; los modelos de texto no leen imágenes. Si no se puede verificar la visión, actualiza Ollama o comprueba de nuevo. La comprobación no envía imágenes ni prompts, no carga modelos ni instala nada. Con Ollama portátil usa el mismo almacén que el servidor activo. Ejecuta generación GPU y análisis de imágenes por separado.

## Italiano

Lo ZIP di Studio non include Ollama o i pesi dei modelli. Copilot di Windows e i checkpoint ComfyUI non sostituiscono un modello Ollama locale.

1. [Installa e avvia Ollama per Windows](https://ollama.com/download/windows).
2. In una nuova finestra PowerShell esegui `ollama pull gemma3:4b` e attendi la fine. Puoi usare altri modelli con visione compatibili.
3. Avvia Studio con **START.cmd**, quindi **Verifica di nuovo** o **↻**.

Non raggiungibile non significa necessariamente disinstallato: Ollama può essere fermo o bloccato. Una lista locale vuota richiede un modello scaricato; i modelli di testo non leggono immagini. Se la visione non è verificabile, aggiorna Ollama o verifica di nuovo. La verifica non invia immagini o prompt, non carica modelli e non installa nulla. Con Ollama portatile usa lo stesso archivio modelli del server attivo. Esegui generazione GPU e analisi immagini separatamente.

## Português

O ZIP do Studio não inclui Ollama nem os pesos dos modelos. Copilot do Windows e checkpoints ComfyUI não substituem um modelo Ollama local.

1. [Instale e inicie Ollama para Windows](https://ollama.com/download/windows).
2. Numa nova janela PowerShell execute `ollama pull gemma3:4b` e aguarde a conclusão. Pode usar outros modelos com visão compatíveis.
3. Inicie Studio com **START.cmd** e escolha **Verificar novamente** ou **↻**.

Inacessível não significa necessariamente desinstalado: Ollama pode estar parado ou bloqueado. Uma lista local vazia requer transferir um modelo; modelos de texto não leem imagens. Se a visão não puder ser verificada, atualize Ollama ou verifique novamente. A verificação não envia imagens ou prompts, não carrega modelos nem instala nada. Com Ollama portátil use o mesmo armazenamento do servidor ativo. Execute geração GPU e análise de imagens separadamente.

## Polski

ZIP Studio nie zawiera Ollamy ani wag modeli. Copilot Windows i checkpointy ComfyUI nie zastępują lokalnego modelu Ollamy.

1. [Zainstaluj i uruchom Ollamę dla Windows](https://ollama.com/download/windows).
2. W nowym oknie PowerShell wykonaj `ollama pull gemma3:4b` i poczekaj na koniec. Można też użyć innych zgodnych modeli wizyjnych.
3. Uruchom Studio przez **START.cmd**, następnie **Sprawdź ponownie** lub **↻**.

Niedostępna nie oznacza na pewno odinstalowanej: Ollama może być wyłączona lub blokowana. Pusta lista lokalna wymaga pobrania modelu; modele tekstowe nie odczytują obrazów. Gdy nie potwierdzono obsługi obrazów, zaktualizuj Ollamę lub sprawdź ponownie. Sprawdzanie nie wysyła obrazów ani promptów, nie ładuje modeli i niczego nie instaluje. W wersji przenośnej używaj magazynu modeli aktywnego serwera. Generowanie GPU i analizę obrazów uruchamiaj kolejno.

## Sources / Források

Verified 2026-11-02: [Ollama for Windows](https://docs.ollama.com/windows), [local model list](https://docs.ollama.com/api/tags), [Gemma 3 4B model card](https://ollama.com/library/gemma3:4b). Commands and links should be checked again when publishing a later release.
