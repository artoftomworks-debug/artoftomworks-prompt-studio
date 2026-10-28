import { languages, ui, options, buildPrompt, recommendResolution } from "./engine.mjs";
import { readImageMetadata } from "./image-metadata.mjs";
import { attachImageToVideo } from "./i2v-ui.mjs";
import { attachImageToImage } from "./i2i-ui.mjs";
import { attachBilingualPromptEditor } from "./bilingual-editor.mjs";
import { renderImageDirectionSelectors, renderCameraProfileSelector } from "./image-direction.mjs";
import { renderProductionSelectors } from "./production-look.mjs";
import { renderQualityPrefixSelector, renderPhotoPresetSelectors, syncPhotoPresetControls, renderArtPresetSelector, syncArtPresetControls } from "./quality-prefix.mjs";
import { installCustomChoices, captureCustomSelections, refreshCustomOptions, customSelectionPlan, customChoiceText } from "./custom-choices.mjs";
import { continuityTransfer } from "./mode-continuity.mjs";
import { attachPromptLibrary } from "./prompt-library.mjs";
import { attachMediaCatalog, attachCreativeMemory } from "./media-catalog-ui.mjs";
import { attachDirectorTimeline } from "./director-ui.mjs";
import { attachPromptCoach } from "./prompt-coach.mjs";
import { attachAddonAdvisor } from "./addon-advisor.mjs";
import { attachSurprisePrompt } from "./creative-forge.mjs";
import { attachAiHub, attachLocalModelPicker } from "./ai-hub.mjs";
import { attachPromptWorkbench } from "./prompt-workbench.mjs";

const classicCustomIds = ["style", "lighting", "mood", "camera", "still-shot", "still-angle", "still-lens", "still-medium", "still-camera-model", "still-production", "video-production", "video-device", "video-stability", "still-quality-prefix", "video-quality-prefix"];

const form = document.getElementById("builder");
const uiLanguage = document.getElementById("ui-language");
const uiTheme = document.getElementById("ui-theme");
const themeCopy = {
  HU: ["Megjelenés", "Sötétkék", "Fekete"],
  EN: ["Appearance", "Dark blue", "Black"],
  DE: ["Darstellung", "Dunkelblau", "Schwarz"],
  FR: ["Apparence", "Bleu foncé", "Noir"],
  ES: ["Apariencia", "Azul oscuro", "Negro"],
  IT: ["Aspetto", "Blu scuro", "Nero"],
  PT: ["Aparência", "Azul escuro", "Preto"],
  PL: ["Wygląd", "Ciemny niebieski", "Czarny"]
};
function translateTheme() {
  const [label, navy, black] = themeCopy[uiLanguage.value] || themeCopy.EN;
  document.getElementById("ui-theme-label").textContent = label;
  uiTheme.setAttribute("aria-label", label);
  uiTheme.options[0].textContent = navy;
  uiTheme.options[1].textContent = black;
}
const sourceLanguage = document.getElementById("source-language");
const outputLanguage = document.getElementById("output-language");
const imageButton = document.getElementById("mode-image");
const videoButton = document.getElementById("mode-video");
const i2vButton = document.getElementById("mode-i2v");
const i2iButton = document.getElementById("mode-i2i");
const promptOutput = document.getElementById("prompt-output");
const resolutionBox = document.getElementById("resolution-box");
const resolutionValue = document.getElementById("resolution-value");
const resolutionMp = document.getElementById("resolution-mp");
const resolutionReason = document.getElementById("resolution-reason");
const resolutionAlternatives = document.getElementById("resolution-alternatives");
const copyButton = document.getElementById("copy");
const downloadButton = document.getElementById("download");
const buildButton = document.getElementById("build-button");
const translationStatus = document.getElementById("translation-status");
const imageFileInput = document.getElementById("image-file");
const imageDrop = document.getElementById("image-drop");
const continuityBox = document.getElementById("mode-continuity");
const continuityText = document.getElementById("mode-continuity-text");
const analyzeImageButton = document.getElementById("analyze-image");
let selectedImage = null;
let imagePreviewUrl = "";
let imagePromptKind = "";
let selectedNegative = "";
let i2vController = null;
let i2iController = null;
let promptCoach = null;
let addonAdvisor = null;
let mode = "image";
let currentPrompt = "";
let lastGeneratedPrompt = "";
let lastGeneratedLanguage = "";
let classicManualEdit = false;
let classicPending = false;
let translating = false;
let translationError = "";
const classicModeDrafts = {};
const translatedFields = new Map();
const textFields = ["brief", "subject", "action", "setting", "negatives", "music"];
const classicEditor = attachBilingualPromptEditor({ field:promptOutput, getLanguage:() => uiLanguage.value, onEdit:() => { classicManualEdit = true; }, onChange:(text) => {
  currentPrompt = classicPending ? "" : text;
  copyButton.disabled = !currentPrompt;
  downloadButton.disabled = !currentPrompt;
} });

const controlCopy = {
  EN:{ clearFields:"Clear text fields", reset:"Reset form", clearPrompt:"Clear prompt", resetI2v:"Reset video workspace", resetI2i:"Reset image workspace", suggest:"Suggest a video prompt", needIdea:"Write a short video idea first.", working:"Suggesting a video prompt locally…", missing:"Local Ollama is unavailable.", modelMissing:"The local gemma3:4b model is missing.", failed:"The prompt suggestion failed. Your text is unchanged.", stale:"Something changed while suggesting. Your edits were kept; ask again if needed.", ready:"Video prompt ready. Edit it freely.", confirm:"Reset the current workspace? Its text and prompt will be cleared." },
  HU:{ clearFields:"Szövegmezők törlése", reset:"Alaphelyzet", clearPrompt:"Prompt törlése", resetI2v:"Kép→videó alaphelyzet", resetI2i:"Kép→kép alaphelyzet", suggest:"Javasolj videópromptot", needIdea:"Előbb írd le pár szóban a videóötletedet.", working:"Helyi videóprompt-javaslat készül…", missing:"A helyi Ollama nem érhető el.", modelMissing:"A helyi gemma3:4b modell hiányzik.", failed:"Nem sikerült javaslatot készíteni. A szöveged megmaradt.", stale:"Közben változtattál valamin. A módosításod megmaradt; szükség esetén kérj új javaslatot.", ready:"Kész a videóprompt-javaslat. Szabadon szerkesztheted.", confirm:"Visszaállítsam ezt a munkafelületet? A beírt szöveg és a prompt törlődik." },
  DE:{clearFields:"Textfelder leeren",reset:"Zurücksetzen",clearPrompt:"Prompt leeren",resetI2v:"Video zurücksetzen",resetI2i:"Bild zurücksetzen",suggest:"Videoprompt vorschlagen",needIdea:"Bitte zuerst eine kurze Videoidee eingeben.",working:"Lokaler Videoprompt wird vorgeschlagen…",missing:"Lokales Ollama ist nicht erreichbar.",modelMissing:"Das lokale Modell gemma3:4b fehlt.",failed:"Vorschlag fehlgeschlagen. Ihr Text bleibt erhalten.",stale:"Währenddessen wurde etwas geändert. Ihre Änderungen bleiben erhalten.",ready:"Videoprompt bereit. Frei bearbeitbar.",confirm:"Arbeitsbereich zurücksetzen? Text und Prompt werden gelöscht."},
  FR:{clearFields:"Effacer les textes",reset:"Réinitialiser",clearPrompt:"Effacer le prompt",resetI2v:"Réinitialiser vidéo",resetI2i:"Réinitialiser image",suggest:"Suggérer un prompt vidéo",needIdea:"Décrivez d'abord brièvement votre idée de vidéo.",working:"Suggestion locale en cours…",missing:"Ollama local est indisponible.",modelMissing:"Le modèle local gemma3:4b manque.",failed:"La suggestion a échoué. Votre texte est conservé.",stale:"Des modifications ont été apportées. Elles sont conservées.",ready:"Prompt vidéo prêt. Vous pouvez le modifier.",confirm:"Réinitialiser cet espace ? Son texte et son prompt seront effacés."},
  ES:{clearFields:"Borrar textos",reset:"Restablecer",clearPrompt:"Borrar prompt",resetI2v:"Restablecer vídeo",resetI2i:"Restablecer imagen",suggest:"Sugerir prompt de vídeo",needIdea:"Escribe primero una breve idea de vídeo.",working:"Creando una sugerencia local…",missing:"Ollama local no está disponible.",modelMissing:"Falta el modelo local gemma3:4b.",failed:"La sugerencia falló. Tu texto se conserva.",stale:"Hubo cambios durante la sugerencia. Se conservaron.",ready:"Prompt de vídeo listo. Puedes editarlo.",confirm:"¿Restablecer este espacio? Se borrarán el texto y el prompt."},
  IT:{clearFields:"Cancella testi",reset:"Ripristina",clearPrompt:"Cancella prompt",resetI2v:"Ripristina video",resetI2i:"Ripristina immagine",suggest:"Suggerisci prompt video",needIdea:"Scrivi prima una breve idea per il video.",working:"Suggerimento locale in corso…",missing:"Ollama locale non è disponibile.",modelMissing:"Manca il modello locale gemma3:4b.",failed:"Suggerimento non riuscito. Il testo resta invariato.",stale:"Hai apportato modifiche. Sono state conservate.",ready:"Prompt video pronto. Puoi modificarlo.",confirm:"Ripristinare quest'area? Testo e prompt verranno cancellati."},
  PT:{clearFields:"Limpar textos",reset:"Repor",clearPrompt:"Limpar prompt",resetI2v:"Repor vídeo",resetI2i:"Repor imagem",suggest:"Sugerir prompt de vídeo",needIdea:"Escreva primeiro uma breve ideia para o vídeo.",working:"A criar sugestão local…",missing:"Ollama local não está disponível.",modelMissing:"Falta o modelo local gemma3:4b.",failed:"A sugestão falhou. O texto foi mantido.",stale:"Houve alterações entretanto. Foram mantidas.",ready:"Prompt de vídeo pronto. Pode editá-lo.",confirm:"Repor esta área? O texto e o prompt serão apagados."},
  PL:{clearFields:"Wyczyść teksty",reset:"Resetuj",clearPrompt:"Wyczyść prompt",resetI2v:"Resetuj wideo",resetI2i:"Resetuj obraz",suggest:"Zaproponuj prompt wideo",needIdea:"Najpierw wpisz krótki pomysł na wideo.",working:"Tworzenie lokalnej propozycji…",missing:"Lokalna Ollama jest niedostępna.",modelMissing:"Brakuje lokalnego modelu gemma3:4b.",failed:"Nie udało się utworzyć propozycji. Tekst pozostał.",stale:"W międzyczasie wprowadzono zmiany. Zostały zachowane.",ready:"Prompt wideo gotowy. Możesz go edytować.",confirm:"Zresetować ten obszar? Tekst i prompt zostaną usunięte."}
};
const editingCopy = () => ({...controlCopy.EN, ...(controlCopy[uiLanguage.value] || {})});
const replacePromptCopy = { EN:"Replace the edited prompt with a new suggestion?", HU:"A szerkesztett promptot lecseréljem az új javaslatra?", DE:"Bearbeiteten Prompt durch einen neuen Vorschlag ersetzen?", FR:"Remplacer le prompt modifié par une nouvelle suggestion ?", ES:"¿Sustituir el prompt editado por una nueva sugerencia?", IT:"Sostituire il prompt modificato con una nuova proposta?", PT:"Substituir o prompt editado por uma nova sugestão?", PL:"Zastąpić edytowany prompt nową propozycją?" };
function translateControlButtons() {
  for (const [id,key] of [["clear-fields","clearFields"],["reset","reset"],["clear-classic-prompt","clearPrompt"],["i2v-clear-prompt","clearPrompt"],["i2i-clear-prompt","clearPrompt"],["i2v-reset","resetI2v"],["i2i-reset","resetI2i"],["video-suggest","suggest"]]) {
    document.getElementById(id).textContent = editingCopy()[key];
  }
}

const translationCopy = {
  HU: {sourceLanguage:"A beírt szöveg nyelve",build:"Prompt összeállítása és fordítása",translationNote:"A fordítás a gombbal indul. Első alkalommal az Edge vagy Chrome nyelvi csomagot tölthet le.",privacy:"A szöveged a böngészőben marad · nyelvi csomag töltődhet le",disclaimer:"A felbontás kiindulási javaslat. A gépi fordítást érdemes átolvasni.",pending:"A saját szöveged fordításra vár. Kattints a nagy gombra.",working:"Fordítás folyamatban…",downloading:"Nyelvi csomag letöltése: {n}%",ready:"Kész: a saját szöveged is le lett fordítva.",unsupported:"Ez a böngésző nem kínál helyi fordítást. Próbáld az asztali Edge vagy Chrome friss változatában.",failed:"A fordítás nem sikerült. Ellenőrizd a kapcsolatot, majd próbáld újra. A vegyes nyelvű promptot nem engedem kimásolni."},
  EN: {sourceLanguage:"Language of your text",build:"Build and translate prompt",translationNote:"Translation starts when you build the prompt. Edge or Chrome may download a language pack first.",privacy:"Your text stays in your browser · a language pack may download",disclaimer:"Resolution is a starting suggestion. Review machine translations before use.",pending:"Your own text still needs translation. Click the main button.",working:"Translating…",downloading:"Downloading language pack: {n}%",ready:"Done: your own text has been translated too.",unsupported:"This browser does not offer local translation. Try a recent desktop Edge or Chrome.",failed:"Translation failed. Check your connection and retry. Mixed-language output cannot be copied."},
  DE: {sourceLanguage:"Sprache Ihrer Eingabe",build:"Prompt erstellen und übersetzen",translationNote:"Die Übersetzung beginnt beim Erstellen. Chrome lädt eventuell ein Sprachpaket.",privacy:"Ihr Text bleibt im Browser · ein Sprachpaket kann geladen werden",disclaimer:"Die Auflösung ist ein Ausgangspunkt. Übersetzung bitte prüfen.",pending:"Ihr Text muss noch übersetzt werden. Klicken Sie auf die große Schaltfläche.",working:"Übersetzung läuft…",downloading:"Sprachpaket: {n}%",ready:"Fertig: Ihr Text wurde übersetzt.",unsupported:"Dieser Browser unterstützt keine lokale Übersetzung. Bitte aktuelles Desktop-Chrome verwenden.",failed:"Übersetzung fehlgeschlagen. Verbindung prüfen und erneut versuchen. Gemischter Text kann nicht kopiert werden."},
  FR: {sourceLanguage:"Langue de votre texte",build:"Créer et traduire le prompt",translationNote:"La traduction commence à la création. Chrome peut télécharger un module linguistique.",privacy:"Votre texte reste dans le navigateur · un module linguistique peut être téléchargé",disclaimer:"La résolution est une suggestion. Vérifiez la traduction automatique.",pending:"Votre texte doit encore être traduit. Cliquez sur le bouton principal.",working:"Traduction en cours…",downloading:"Module linguistique : {n}%",ready:"Terminé : votre texte a été traduit.",unsupported:"Ce navigateur ne prend pas en charge la traduction locale. Utilisez Chrome récent sur ordinateur.",failed:"Échec de la traduction. Vérifiez la connexion et réessayez. Le texte mixte ne peut pas être copié."},
  ES: {sourceLanguage:"Idioma de tu texto",build:"Crear y traducir prompt",translationNote:"La traducción comienza al crear el prompt. Chrome puede descargar un paquete de idioma.",privacy:"Tu texto permanece en el navegador · puede descargarse un paquete de idioma",disclaimer:"La resolución es una sugerencia. Revisa la traducción automática.",pending:"Tu texto aún necesita traducción. Pulsa el botón principal.",working:"Traduciendo…",downloading:"Paquete de idioma: {n}%",ready:"Listo: tu texto también se ha traducido.",unsupported:"Este navegador no ofrece traducción local. Prueba la versión reciente de Chrome para ordenador.",failed:"La traducción falló. Comprueba la conexión y vuelve a intentarlo. No se puede copiar el texto mezclado."},
  IT: {sourceLanguage:"Lingua del tuo testo",build:"Crea e traduci il prompt",translationNote:"La traduzione inizia quando crei il prompt. Chrome può scaricare un pacchetto lingua.",privacy:"Il testo resta nel browser · un pacchetto lingua può essere scaricato",disclaimer:"La risoluzione è un suggerimento. Controlla la traduzione automatica.",pending:"Il tuo testo deve ancora essere tradotto. Premi il pulsante principale.",working:"Traduzione in corso…",downloading:"Pacchetto lingua: {n}%",ready:"Fatto: anche il tuo testo è stato tradotto.",unsupported:"Questo browser non offre la traduzione locale. Prova Chrome aggiornato per computer.",failed:"Traduzione non riuscita. Controlla la connessione e riprova. Non puoi copiare testo in lingue miste."},
  PT: {sourceLanguage:"Idioma do seu texto",build:"Criar e traduzir prompt",translationNote:"A tradução começa ao criar o prompt. O Chrome pode baixar um pacote de idioma.",privacy:"O texto permanece no navegador · um pacote de idioma pode ser baixado",disclaimer:"A resolução é uma sugestão. Reveja a tradução automática.",pending:"O seu texto ainda precisa de tradução. Clique no botão principal.",working:"A traduzir…",downloading:"Pacote de idioma: {n}%",ready:"Concluído: o seu texto também foi traduzido.",unsupported:"Este navegador não oferece tradução local. Experimente o Chrome atualizado no computador.",failed:"A tradução falhou. Verifique a ligação e tente novamente. Não é possível copiar texto misto."},
  PL: {sourceLanguage:"Język wpisanego tekstu",build:"Utwórz i przetłumacz prompt",translationNote:"Tłumaczenie zaczyna się po utworzeniu promptu. Chrome może pobrać pakiet językowy.",privacy:"Tekst pozostaje w przeglądarce · pakiet językowy może zostać pobrany",disclaimer:"Rozdzielczość jest sugestią. Sprawdź tłumaczenie maszynowe.",pending:"Twój tekst wymaga jeszcze tłumaczenia. Kliknij główny przycisk.",working:"Tłumaczenie…",downloading:"Pakiet językowy: {n}%",ready:"Gotowe: Twój tekst też został przetłumaczony.",unsupported:"Ta przeglądarka nie obsługuje lokalnego tłumaczenia. Użyj aktualnego Chrome na komputerze.",failed:"Tłumaczenie nie powiodło się. Sprawdź połączenie i spróbuj ponownie. Nie można kopiować mieszanego tekstu."}
};

const selectChoices = {
  frame: [["auto", "auto"], ["portrait", "portrait"], ["landscape", "landscape"], ["square", "square"], ["wide", "wide"], ["macro", "macro"]],
  memory: [["low", "memoryLow"], ["mid", "memoryMid"], ["high", "memoryHigh"]],
  quality: [["low", "low"], ["balanced", "balanced"], ["high", "high"]],
  sound: [["none", "soundNone"], ["ambient", "soundAmbient"], ["music", "soundMusic"], ["custom", "soundCustom"]]
};

const reasonText = {
  HU: "A kompozícióhoz illő képarány és a választott gépprofil alapján. Próbálj előbb ezen a méreten; ha lassú vagy elfogy a memória, válts a kisebb alternatívára.",
  EN: "Based on composition and hardware profile. Start here; if rendering is slow or memory runs out, try the smaller alternative.",
  DE: "Auf Basis von Komposition und Hardwareprofil. Beginne hier; bei langsamer Verarbeitung oder Speichermangel die kleinere Alternative wählen.",
  FR: "Selon la composition et le profil matériel. Commencez ici ; si le rendu est lent ou manque de mémoire, essayez la taille inférieure.",
  ES: "Según la composición y el perfil del equipo. Empieza aquí; si va lento o falta memoria, prueba la opción menor.",
  IT: "In base alla composizione e all'hardware. Inizia qui; se è lento o manca memoria, prova l'alternativa più piccola.",
  PT: "Com base na composição e no perfil do computador. Comece aqui; se for lento ou faltar memória, experimente a opção menor.",
  PL: "Na podstawie kompozycji i profilu sprzętu. Zacznij tutaj; jeśli generowanie jest wolne lub zabraknie pamięci, wybierz mniejszy rozmiar."
};
const manualPromptHint = {
  HU:"A szerkesztett promptod megmaradt. Ha az űrlap új beállításai alapján szeretnéd újraépíteni, kattints a Prompt összeállítása gombra.",
  EN:"Your edited prompt is preserved. To rebuild from the form's new settings, click Build and translate prompt."
};
const continuityCopy = {
  HU:["Áthozott szöveg", "Az előző mód szövege itt is elérhető. Az új mód meglévő mezőit nem írjuk felül."],
  EN:["Carried-over text", "Text from the previous mode stays available here. Existing fields in this mode are not overwritten."],
  DE:["Übernommener Text", "Der Text des vorherigen Modus bleibt hier verfügbar. Bestehende Felder werden nicht überschrieben."],
  FR:["Texte conservé", "Le texte du mode précédent reste ici. Les champs déjà remplis ne sont pas écrasés."],
  ES:["Texto conservado", "El texto del modo anterior queda aquí. Los campos existentes no se sobrescriben."],
  IT:["Testo conservato", "Il testo della modalità precedente rimane qui. I campi già compilati non vengono sovrascritti."],
  PT:["Texto mantido", "O texto do modo anterior fica aqui. Os campos já preenchidos não são substituídos."],
  PL:["Zachowany tekst", "Tekst z poprzedniego trybu pozostaje tutaj. Wypełnione pola nie są nadpisywane."]
};

const imageCopy = {
  EN: {title:"Start from an image",intro:"Drop an image to find stored prompt data, or ask a local vision model for a new suggestion.",drop:"Drop an image here",choose:"or click to choose PNG, JPG or WebP",found:"Prompt information found in the image",use:"Use as my idea",localTitle:"Local visual analysis",localBadge:"NO CLOUD UPLOAD",localHelp:"Choose a local vision model below. Analysis starts only when you click.",analyze:"Suggest a prompt from this image",none:"No usable prompt metadata found. You can try local visual analysis.",exact:"Stored prompt — copied from image metadata, not reconstructed.",graph:"Embedded ComfyUI workflow — choose a text field. This may not be the final prompt.",graphOnly:"A workflow is embedded, but no readable prompt text was found.",other:"Prompt metadata inspection currently supports PNG; visual analysis supports PNG, JPG and WebP.",suggested:"AI suggestion based on visible content — not the original prompt.",working:"Analyzing locally…",missing:"Ollama is unavailable. Install/start Ollama and download gemma3:4b, then try again.",modelMissing:"The gemma3:4b model is not installed in Ollama. Download it first.",failed:"Local analysis failed. Check Ollama, the model and browser permissions.",invalid:"Choose a PNG, JPG or WebP image under 100 MB.",busy:"This image cannot be read.",inserted:"Added to your idea. Review and adjust it before building."},
  HU: {title:"Indulás egy képből",intro:"Húzz ide képet: megkeressük a tárolt promptot, vagy helyi képelemzővel új javaslatot kérhetsz.",drop:"Húzd ide a képet",choose:"vagy kattints: PNG, JPG, WebP",found:"A képen talált promptadat",use:"Átveszem az ötletemhez",localTitle:"Helyi képelemzés",localBadge:"NINCS FELHŐS FELTÖLTÉS",localHelp:"Válassz lent helyi képelemző modellt. Az elemzés csak gombnyomásra indul.",analyze:"Javasolj promptot a képhez",none:"Nem találtam használható promptadatot. Kipróbálhatod a helyi képelemzést.",exact:"Eltárolt prompt — a képfájl adataiból, nem újraalkotva.",graph:"Beágyazott ComfyUI-workflow — válassz szöveges mezőt. Nem biztos, hogy ez a végleges prompt.",graphOnly:"Workflow van a képben, de olvasható promptszöveget nem találtam.",other:"Promptadatot jelenleg PNG-ben tudok keresni; a képelemzés PNG, JPG és WebP képpel működik.",suggested:"AI-javaslat a látható tartalom alapján — nem az eredeti prompt.",working:"Helyi elemzés folyamatban…",missing:"Az Ollama nem érhető el. Telepítsd/indítsd el, és töltsd le a gemma3:4b modellt.",modelMissing:"A gemma3:4b modell nincs telepítve az Ollamába. Előbb töltsd le.",failed:"A helyi elemzés nem sikerült. Ellenőrizd az Ollamát, a modellt és a böngésző engedélyeit.",invalid:"Válassz 100 MB alatti PNG, JPG vagy WebP képet.",busy:"Nem sikerült beolvasni ezt a képet.",inserted:"Az ötlet mezőbe tettem. Nézd át, mielőtt promptot építesz belőle."},
  DE: {title:"Mit einem Bild beginnen",intro:"Bild ablegen: gespeicherte Prompt-Daten finden oder lokal einen Vorschlag erzeugen.",drop:"Bild hier ablegen",choose:"oder PNG, JPG, WebP auswählen",found:"Prompt-Information im Bild",use:"Als Idee übernehmen",localTitle:"Lokale Bildanalyse",localBadge:"KEIN CLOUD-UPLOAD",localHelp:"Unten ein lokales Bildmodell wählen. Analyse erst nach einem Klick.",analyze:"Prompt für dieses Bild vorschlagen",none:"Keine brauchbaren Prompt-Daten gefunden.",exact:"Gespeicherter Prompt aus Bildmetadaten.",graph:"ComfyUI-Workflow: Textfeld wählen; eventuell nicht der endgültige Prompt.",graphOnly:"Workflow vorhanden, aber kein lesbarer Prompt-Text.",other:"Metadaten derzeit nur für PNG; Bildanalyse für PNG, JPG, WebP.",suggested:"KI-Vorschlag, nicht der ursprüngliche Prompt.",working:"Lokale Analyse…",missing:"Ollama nicht verfügbar. Ollama und gemma3:4b installieren/starten.",modelMissing:"gemma3:4b ist nicht installiert.",failed:"Lokale Analyse fehlgeschlagen.",invalid:"PNG, JPG oder WebP unter 100 MB wählen.",busy:"Bild konnte nicht gelesen werden.",inserted:"Als Idee eingefügt; bitte prüfen."},
  FR: {title:"Partir d'une image",intro:"Déposez une image pour retrouver le prompt enregistré ou obtenir une suggestion locale.",drop:"Déposez l'image ici",choose:"ou choisissez PNG, JPG, WebP",found:"Information de prompt trouvée",use:"Utiliser comme idée",localTitle:"Analyse visuelle locale",localBadge:"AUCUN ENVOI CLOUD",localHelp:"Choisissez un modèle visuel local ci-dessous. Analyse après un clic.",analyze:"Suggérer un prompt",none:"Aucune donnée de prompt exploitable.",exact:"Prompt enregistré dans les métadonnées.",graph:"Workflow ComfyUI : choisissez un champ; ce n'est pas forcément le prompt final.",graphOnly:"Workflow présent, sans texte de prompt lisible.",other:"Métadonnées PNG uniquement; analyse PNG, JPG, WebP.",suggested:"Suggestion IA, pas le prompt original.",working:"Analyse locale…",missing:"Ollama indisponible. Installez/démarrez Ollama et gemma3:4b.",modelMissing:"gemma3:4b n'est pas installé.",failed:"L'analyse locale a échoué.",invalid:"Choisissez PNG, JPG ou WebP sous 100 Mo.",busy:"Impossible de lire l'image.",inserted:"Ajouté comme idée; vérifiez-le."},
  ES: {title:"Empezar con una imagen",intro:"Suelta una imagen para encontrar su prompt guardado o generar una sugerencia local.",drop:"Suelta la imagen aquí",choose:"o elige PNG, JPG, WebP",found:"Información de prompt encontrada",use:"Usar como idea",localTitle:"Análisis visual local",localBadge:"SIN SUBIR A LA NUBE",localHelp:"Elige abajo un modelo visual local. El análisis empieza al pulsar.",analyze:"Sugerir prompt para esta imagen",none:"No se encontraron datos de prompt útiles.",exact:"Prompt guardado en los metadatos.",graph:"Workflow ComfyUI: elige un campo; quizá no sea el prompt final.",graphOnly:"Hay workflow, pero no texto legible.",other:"Metadatos solo para PNG; análisis PNG, JPG, WebP.",suggested:"Sugerencia de IA, no el prompt original.",working:"Analizando localmente…",missing:"Ollama no está disponible. Instala/inicia Ollama y gemma3:4b.",modelMissing:"gemma3:4b no está instalado.",failed:"Falló el análisis local.",invalid:"Elige PNG, JPG o WebP de menos de 100 MB.",busy:"No se pudo leer la imagen.",inserted:"Añadido como idea; revísalo."},
  IT: {title:"Inizia da un'immagine",intro:"Trascina un'immagine per trovare il prompt salvato o una proposta locale.",drop:"Trascina qui l'immagine",choose:"o scegli PNG, JPG, WebP",found:"Informazioni prompt trovate",use:"Usa come idea",localTitle:"Analisi visiva locale",localBadge:"NESSUN UPLOAD CLOUD",localHelp:"Scegli un modello visivo locale qui sotto. Analisi solo dopo un clic.",analyze:"Suggerisci un prompt",none:"Nessun dato prompt utilizzabile.",exact:"Prompt salvato nei metadati.",graph:"Workflow ComfyUI: scegli un campo; potrebbe non essere il prompt finale.",graphOnly:"Workflow presente, senza testo leggibile.",other:"Metadati solo PNG; analisi PNG, JPG, WebP.",suggested:"Suggerimento AI, non il prompt originale.",working:"Analisi locale…",missing:"Ollama non disponibile. Installa/avvia Ollama e gemma3:4b.",modelMissing:"gemma3:4b non è installato.",failed:"Analisi locale non riuscita.",invalid:"Scegli PNG, JPG o WebP sotto 100 MB.",busy:"Impossibile leggere l'immagine.",inserted:"Aggiunto come idea; controllalo."},
  PT: {title:"Começar com uma imagem",intro:"Arraste uma imagem para encontrar o prompt guardado ou obter uma sugestão local.",drop:"Arraste a imagem para aqui",choose:"ou escolha PNG, JPG, WebP",found:"Informação do prompt encontrada",use:"Usar como ideia",localTitle:"Análise visual local",localBadge:"SEM ENVIO PARA A NUVEM",localHelp:"Escolha abaixo um modelo visual local. A análise começa ao clicar.",analyze:"Sugerir prompt para esta imagem",none:"Não foram encontrados dados de prompt utilizáveis.",exact:"Prompt guardado nos metadados.",graph:"Workflow ComfyUI: escolha um campo; pode não ser o prompt final.",graphOnly:"Workflow presente, mas sem texto legível.",other:"Metadados só para PNG; análise PNG, JPG, WebP.",suggested:"Sugestão de IA, não o prompt original.",working:"Análise local…",missing:"Ollama indisponível. Instale/inicie Ollama e gemma3:4b.",modelMissing:"gemma3:4b não está instalado.",failed:"A análise local falhou.",invalid:"Escolha PNG, JPG ou WebP com menos de 100 MB.",busy:"Não foi possível ler a imagem.",inserted:"Adicionado como ideia; reveja-o."},
  PL: {title:"Zacznij od obrazu",intro:"Upuść obraz, aby znaleźć zapisany prompt lub uzyskać lokalną propozycję.",drop:"Upuść obraz tutaj",choose:"lub wybierz PNG, JPG, WebP",found:"Informacje o prompcie w obrazie",use:"Użyj jako pomysłu",localTitle:"Lokalna analiza obrazu",localBadge:"BEZ WYSYŁANIA DO CHMURY",localHelp:"Wybierz poniżej lokalny model obrazu. Analiza dopiero po kliknięciu.",analyze:"Zaproponuj prompt",none:"Nie znaleziono użytecznych danych promptu.",exact:"Prompt zapisany w metadanych.",graph:"Workflow ComfyUI: wybierz pole; może to nie być końcowy prompt.",graphOnly:"Workflow jest, ale bez czytelnego tekstu.",other:"Metadane tylko PNG; analiza PNG, JPG, WebP.",suggested:"Propozycja AI, nie oryginalny prompt.",working:"Analiza lokalna…",missing:"Ollama niedostępna. Zainstaluj/uruchom Ollama i gemma3:4b.",modelMissing:"gemma3:4b nie jest zainstalowany.",failed:"Analiza lokalna nie powiodła się.",invalid:"Wybierz PNG, JPG lub WebP poniżej 100 MB.",busy:"Nie można odczytać obrazu.",inserted:"Dodano jako pomysł; sprawdź go."}
};

function imageStrings() { return imageCopy[uiLanguage.value] || imageCopy.EN; }
function translateImageUi() {
  const copy = imageStrings();
  document.querySelectorAll("[data-image-i18n]").forEach((element) => { element.textContent = copy[element.dataset.imageI18n] || imageCopy.EN[element.dataset.imageI18n]; });
}

function selectedUi() {
  const lang = languages.includes(uiLanguage.value) ? uiLanguage.value : "EN";
  return { ...ui[lang], ...translationCopy[lang] };
}

const anatomyCopy = {
  EN:["Help with human hands and feet","For human subjects only. FLUX gets positive anatomical directions; other models also get negative exclusions. Review before use; no prompt can guarantee correct anatomy."],
  HU:["Segítség az emberi kézhez és lábhoz","Csak emberi alaknál. FLUX-hoz a pozitív promptba kerül pontos anatómiai leírás; más modelleknél a negatívba is kerülnek kizárások. Használat előtt ellenőrizd; a hibátlan anatómia nem garantálható."],
  DE:["Hilfe für menschliche Hände und Füße","Nur bei menschlichen Motiven. FLUX erhält positive Anatomieangaben; andere Modelle auch negative Ausschlüsse. Vor der Nutzung prüfen; korrekte Anatomie ist nicht garantiert."],
  FR:["Améliorer les mains et les pieds humains","Uniquement pour les sujets humains. FLUX reçoit des indications positives ; les autres modèles reçoivent aussi des exclusions négatives. Vérifiez avant usage ; l'anatomie parfaite n'est pas garantie."],
  ES:["Ayuda para manos y pies humanos","Solo para figuras humanas. FLUX recibe indicaciones positivas; otros modelos también reciben exclusiones negativas. Revisa el resultado; la anatomía perfecta no está garantizada."],
  IT:["Aiuto per mani e piedi umani","Solo per soggetti umani. FLUX riceve indicazioni positive; gli altri modelli anche esclusioni negative. Controlla prima dell'uso; l'anatomia corretta non è garantita."],
  PT:["Ajuda para mãos e pés humanos","Só para figuras humanas. FLUX recebe indicações positivas; outros modelos recebem também exclusões negativas. Revê antes de usar; a anatomia correta não é garantida."],
  PL:["Pomoc przy ludzkich dłoniach i stopach","Tylko dla postaci ludzkich. FLUX otrzymuje wskazówki pozytywne; inne modele także wykluczenia negatywne. Sprawdź przed użyciem; poprawna anatomia nie jest gwarantowana."]
};

function fillSelect(id, items, oldValue) {
  const select = document.getElementById(id);
  select.replaceChildren();
  for (const [value, label] of items) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    select.appendChild(option);
  }
  if (oldValue && [...select.options].some((item) => item.value === oldValue)) select.value = oldValue;
}

function translate() {
  const customBefore = captureCustomSelections(classicCustomIds);
  const strings = selectedUi();
  const lang = uiLanguage.value;
  document.documentElement.lang = lang.toLowerCase();
  translateTheme();
  document.getElementById("back-to-top").textContent = ({
    HU:"↑ Vissza az elejére",EN:"↑ Back to top",DE:"↑ Nach oben",FR:"↑ Retour en haut",
    ES:"↑ Volver arriba",IT:"↑ Torna su",PT:"↑ Voltar ao topo",PL:"↑ Wróć na górę"
  })[lang] || "↑ Back to top";
  const [anatomyLabel,anatomyHelp] = anatomyCopy[lang] || anatomyCopy.EN;
  document.getElementById("anatomy-label").textContent = anatomyLabel;
  document.getElementById("anatomy-help").textContent = anatomyHelp;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = strings[element.dataset.i18n] || ui.EN[element.dataset.i18n] || "";
  });
  document.querySelectorAll("[data-placeholder]").forEach((element) => {
    element.placeholder = strings[element.dataset.placeholder] || "";
  });
  for (const group of ["style", "lighting", "camera", "mood"]) {
    const select = document.getElementById(group);
    const current = select.value;
    fillSelect(group, Object.entries(options[group]).map(([value, translations]) => [
      value, translations[languages.indexOf(lang)] || translations[1]
    ]), current);
  }
  for (const [id, choices] of Object.entries(selectChoices)) {
    const current = document.getElementById(id).value;
    fillSelect(id, choices.map(([value, label]) => [value, strings[label]]), current);
  }
  renderImageDirectionSelectors("still", lang);
  renderProductionSelectors("still", lang);
  renderProductionSelectors("video", lang, true);
  renderQualityPrefixSelector("still", lang);
  renderQualityPrefixSelector("video", lang);
  refreshCustomOptions(classicCustomIds, customBefore);
  renderPhotoPresetSelectors("still", lang);
  syncPhotoPresetControls("still", lang, mode === "image");
  renderArtPresetSelector("still", lang);
  syncArtPresetControls("still", lang, mode === "image");
  syncClassicVideoStability();
  translateImageUi();
  i2vController?.translate();
  i2iController?.translate();
  classicEditor.translateUi();
  promptCoach?.refresh();
  addonAdvisor?.refresh();
  translateControlButtons();
  const [continuityTitle, continuityHelp] = continuityCopy[lang] || continuityCopy.EN;
  document.getElementById("mode-continuity-title").textContent = continuityTitle;
  document.getElementById("mode-continuity-help").textContent = continuityHelp;
  updateResult();
}

function syncClassicVideoStability() {
  const stability = document.getElementById("video-stability");
  const locked = document.getElementById("camera").value === "locked";
  if (locked) stability.value = "auto";
  stability.disabled = locked;
}

function showImagePrompt(value, kind, choices = []) {
  const found = document.getElementById("image-found");
  const field = document.getElementById("image-prompt");
  const picker = document.getElementById("image-text-choice");
  imagePromptKind = kind;
  found.hidden = !value;
  field.value = value;
  document.getElementById("image-provenance").textContent = imageStrings()[kind] || "";
  picker.replaceChildren();
  for (const [index, item] of choices.entries()) {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = item.label;
    picker.appendChild(option);
  }
  picker.hidden = choices.length < 2;
  picker.onchange = () => { field.value = choices[Number(picker.value)]?.value || ""; };
}

async function inspectImage(file) {
  if (!file) return;
  if (!/^(image\/png|image\/jpeg|image\/webp)$/.test(file.type) || file.size > 100_000_000) {
    document.getElementById("image-analyze-status").textContent = imageStrings().invalid;
    return;
  }
  selectedImage = file;
  i2vController?.setImage(file, null);
  i2iController?.setImage(file, null);
  selectedNegative = "";
  if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
  imagePreviewUrl = URL.createObjectURL(file);
  document.getElementById("image-preview").src = imagePreviewUrl;
  document.getElementById("image-name").textContent = file.name;
  document.getElementById("image-inspection").hidden = false;
  document.getElementById("image-findings").textContent = "";
  document.getElementById("image-analyze-status").textContent = "";
  showImagePrompt("", "");
  analyzeImageButton.disabled = false;
  try {
    const metadata = await readImageMetadata(file);
    i2vController?.setImage(file, { width: metadata.width, height: metadata.height });
    i2iController?.setImage(file, { width: metadata.width, height: metadata.height });
    document.getElementById("image-size").textContent = metadata.width && metadata.height ? `${metadata.width} × ${metadata.height}` : file.type.replace("image/", "").toUpperCase();
    if (metadata.width && metadata.height) {
      document.getElementById("frame").value = metadata.width > metadata.height * 1.35 ? "landscape" : metadata.height > metadata.width * 1.35 ? "portrait" : "square";
      updateResult();
    }
    if (metadata.directPrompt) {
      selectedNegative = metadata.negativePrompt;
      showImagePrompt(metadata.directPrompt, "exact");
      document.getElementById("image-findings").textContent = imageStrings().exact;
    } else if (metadata.workflowTexts.length) {
      showImagePrompt(metadata.workflowTexts[0].value, "graph", metadata.workflowTexts);
      document.getElementById("image-findings").textContent = imageStrings().graph;
    } else {
      document.getElementById("image-findings").textContent = metadata.workflowPresent ? imageStrings().graphOnly : metadata.format !== "PNG" ? imageStrings().other : imageStrings().none;
    }
  } catch {
    document.getElementById("image-findings").textContent = imageStrings().busy;
    try {
      const bitmap = await createImageBitmap(file);
      i2vController?.setImage(file, { width: bitmap.width, height: bitmap.height });
      i2iController?.setImage(file, { width: bitmap.width, height: bitmap.height });
      bitmap.close?.();
    } catch { /* An unreadable image cannot be used for suggestions. */ }
  }
}

async function imageBase64(file) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1024 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close?.();
  return canvas.toDataURL("image/jpeg", 0.88).split(",")[1];
}

async function analyzeImage() {
  if (!selectedImage) return;
  const copy = imageStrings();
  const status = document.getElementById("image-analyze-status");
  analyzeImageButton.disabled = true;
  status.textContent = copy.working;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 300_000);
  try {
    // The optional local launcher serves this page and proxies Ollama on one origin.
    // Direct file use remains available for browsers that permit file-to-loopback access.
    const base = location.protocol === "http:" && location.hostname === "127.0.0.1" && ["18765", "18766", "18767", "18768", "18769", "18770", "18771", "18772", "18773", "18774", "18775", "18776", "18777", "18778", "18817", "18818", "18819"].includes(location.port)
      ? location.origin : "http://127.0.0.1:11434";
    const installedModel=await imageModelPicker.getSelected(controller.signal);
    if (!installedModel) { status.textContent=imageModelPicker.message();return; }
    const image = await imageBase64(selectedImage);
    const languageName = {HU:"Hungarian",EN:"English",DE:"German",FR:"French",ES:"Spanish",IT:"Italian",PT:"Portuguese",PL:"Polish"}[outputLanguage.value] || "English";
    const response = await fetch(base + "/api/chat", {
      method: "POST", headers: { "Content-Type": "application/json" }, signal: controller.signal,
      body: JSON.stringify({ model: installedModel.name, stream: false, options: { temperature: 0.3 }, messages: [{ role: "user", content: `Write one practical image-generation prompt in ${languageName} for a visually similar image. Describe only what is visible: main subjects, scene, composition, camera angle, lighting, palette, style, and fine details. Do not invent an artist, brand, exact identity or unseen story. Do not claim this is the original prompt. Output only the prompt, no introduction.`, images: [image] }] })
    });
    if (!response.ok) throw new Error("Ollama request failed");
    const data = await response.json();
    const suggestion = String(data.message?.content || "").trim();
    if (!suggestion) throw new Error("Empty model response");
    showImagePrompt(suggestion, "suggested");
    status.textContent = copy.suggested;
  } catch (error) {
    status.textContent = error instanceof TypeError ? copy.missing : copy.failed;
  } finally {
    clearTimeout(timeout);
    analyzeImageButton.disabled = !selectedImage;
  }
}

function readState() {
  const data = new FormData(form);
  return {
    mode,
    brief: String(data.get("brief") || ""),
    subject: String(data.get("subject") || ""),
    action: String(data.get("action") || ""),
    setting: String(data.get("setting") || ""),
    style: String(data.get("style") || "cinematic"),
    lighting: String(data.get("lighting") || "dawn"),
    camera: String(data.get("camera") || "locked"),
    mood: String(data.get("mood") || "serene"),
    shot: String(data.get("shot") || "auto"),
    angle: String(data.get("angle") || "auto"),
    lens: String(data.get("lens") || "auto"),
    medium: String(data.get("medium") || "auto"),
    capture: String(data.get("capture") || "auto"),
    cameraModel: String(data.get("cameraModel") || "auto"),
    production: String(data.get(mode === "video" ? "videoProduction" : "stillProduction") || "auto"),
    device: String(data.get("videoDevice") || "auto"),
    stability: String(data.get("videoStability") || "auto"),
    qualityPrefix: String(data.get(mode === "video" ? "videoQualityPrefix" : "stillQualityPrefix") || "auto"),
    customQuality: customChoiceText(mode === "video" ? "video-quality-prefix" : "still-quality-prefix", outputLanguage.value),
    photoGenre: String(data.get("photoGenre") || "auto"),
    photoLight: String(data.get("photoLight") || "auto"),
    artStyle: String(data.get("artStyle") || "auto"),
    customDirections: customSelectionPlan(mode === "video"
      ? ["style", "lighting", "mood", "camera", "video-production", "video-device", "video-stability"]
      : ["style", "lighting", "mood", "still-shot", "still-angle", "still-lens", "still-medium", "still-camera-model", "still-production"], outputLanguage.value),
    negatives: String(data.get("negatives") || ""),
    anatomy: data.has("anatomy"),
    model: String(data.get("model") || "krea2"),
    frame: String(data.get("frame") || "auto"),
    memory: String(data.get("memory") || "mid"),
    quality: String(data.get("quality") || "balanced"),
    duration: String(data.get("duration") || "8"),
    sound: String(data.get("sound") || "none"),
    noVoice: document.getElementById("noVoice").checked,
    music: String(data.get("music") || ""),
    sourceLanguage: sourceLanguage.value,
    outputLanguage: outputLanguage.value
  };
}

function relevantTextFields(state) {
  return textFields.filter((field) => field !== "music" ||
    (state.mode === "video" && ["music", "custom"].includes(state.sound)));
}

function pendingTextFields(state) {
  if (state.sourceLanguage === state.outputLanguage) return [];
  return relevantTextFields(state).filter((field) => {
    const original = String(state[field] || "").trim();
    if (!original) return false;
    const cached = translatedFields.get(field);
    return !cached || cached.original !== original ||
      cached.source !== state.sourceLanguage || cached.target !== state.outputLanguage;
  });
}

function outputState(state) {
  if (state.sourceLanguage === state.outputLanguage) return state;
  const translated = { ...state };
  for (const field of relevantTextFields(state)) {
    const cached = translatedFields.get(field);
    if (cached && cached.original === String(state[field] || "").trim() &&
      cached.source === state.sourceLanguage && cached.target === state.outputLanguage) {
      translated[field] = cached.text;
    }
  }
  return translated;
}

function showStatus(message, kind = "") {
  translationStatus.textContent = message;
  translationStatus.dataset.state = kind;
}

function updateResult() {
  if (mode === "i2v") { i2vController?.updateRecommendation(); return; }
  if (mode === "i2i") { i2iController?.updateRecommendation(); return; }
  const state = readState();
  const strings = selectedUi();
  document.getElementById("music").parentElement.hidden =
    mode !== "video" || !["music", "custom"].includes(state.sound);
  const pending = pendingTextFields(state);
  const generatedPrompt = pending.length || translating ? "" : buildPrompt(outputState(state));
  classicPending = !classicManualEdit && (pending.length > 0 || translating);
  if (generatedPrompt && !classicManualEdit &&
      (generatedPrompt !== lastGeneratedPrompt || state.outputLanguage !== lastGeneratedLanguage)) {
    classicEditor.setPrompt(generatedPrompt, state.outputLanguage);
    lastGeneratedPrompt = generatedPrompt;
    lastGeneratedLanguage = state.outputLanguage;
  }
  if (!generatedPrompt && !classicPending && !classicManualEdit && lastGeneratedPrompt) {
    classicEditor.clear();
    lastGeneratedPrompt = "";
  }
  currentPrompt = classicPending ? "" : classicEditor.getText();
  promptOutput.placeholder = pending.length ? strings.pending : strings.empty;
  copyButton.disabled = !currentPrompt;
  downloadButton.disabled = !currentPrompt;
  if (!translating) showStatus(translationError ||
    (pending.length ? strings.pending : classicManualEdit && generatedPrompt !== lastGeneratedPrompt ? (manualPromptHint[uiLanguage.value] || manualPromptHint.EN) : currentPrompt ? strings.ready : ""),
    translationError ? "error" : pending.length ? "pending" : currentPrompt ? "ready" : "");
  resolutionBox.hidden = mode !== "image";
  if (mode !== "image") return;
  const resolution = recommendResolution(state);
  resolutionValue.innerHTML = String(resolution.width) + ' <span>×</span> ' + String(resolution.height);
  resolutionMp.textContent = resolution.megapixels + " MP · " + strings[resolution.frame];
  resolutionReason.textContent = reasonText[uiLanguage.value] || reasonText.EN;
  resolutionAlternatives.replaceChildren();
  for (const [width, height] of resolution.alternatives) {
    const badge = document.createElement("b");
    badge.textContent = String(width) + " × " + String(height);
    resolutionAlternatives.appendChild(badge);
  }
}

async function buildAndTranslate() {
  if (translating) return;
  const state = readState();
  const pending = pendingTextFields(state);
  classicManualEdit = false;
  lastGeneratedPrompt = "";
  translationError = "";
  if (pending.length) {
    if (!globalThis.Translator?.create) {
      translationError = selectedUi().unsupported;
      updateResult();
      return;
    }
    translating = true;
    buildButton.disabled = true;
    showStatus(selectedUi().working, "working");
    try {
      // Create directly from the click/submit event so Chrome retains user activation.
      const translator = await globalThis.Translator.create({
        sourceLanguage: state.sourceLanguage.toLowerCase(),
        targetLanguage: state.outputLanguage.toLowerCase(),
        monitor(monitor) {
          monitor.addEventListener("downloadprogress", (event) => {
            const pct = Math.round((event.loaded / (event.total || 1)) * 100);
            showStatus(selectedUi().downloading.replace("{n}", String(pct)), "working");
          });
        }
      });
      try {
        for (const field of pending) {
          const original = String(state[field] || "").trim();
          const translated = String(await translator.translate(original)).trim();
          if (!translated) throw new Error("Empty translation");
          translatedFields.set(field, { original, source: state.sourceLanguage,
            target: state.outputLanguage, text: translated });
        }
      } finally {
        translator.destroy?.();
      }
    } catch {
      translationError = selectedUi().failed;
    } finally {
      translating = false;
      buildButton.disabled = false;
    }
  }
  updateResult();
  if (currentPrompt) document.querySelector(".result-column").scrollIntoView({ behavior: "smooth", block: "start" });
}

function setMode(nextMode, { carry = true } = {}) {
  if (nextMode === mode) { updateResult(); return; }
  const previousMode = mode;
  const fields = Object.fromEntries(["brief", "subject", "action", "setting", "negatives", "i2v-idea", "i2v-prompt", "i2i-keep", "i2i-change", "i2i-prompt"]
    .map((id) => [id, document.getElementById(id)?.value || ""]));
  fields["prompt-output"] = classicEditor.getText();
  const transfer = carry ? continuityTransfer(fields, previousMode, nextMode) : { target:null, text:"", notes:"" };
  if (transfer.notes) {
    continuityText.value = transfer.notes;
    continuityBox.hidden = false;
  }
  if (previousMode === "image" || previousMode === "video") {
    classicModeDrafts[previousMode] = { editor:classicEditor.snapshot(), manual:classicManualEdit,
      generated:lastGeneratedPrompt, language:lastGeneratedLanguage };
  }
  mode = nextMode;
  if (nextMode === "image" || nextMode === "video") {
    const saved = classicModeDrafts[nextMode];
    classicEditor.restore(saved?.editor);
    classicManualEdit = saved?.manual || false;
    lastGeneratedPrompt = saved?.generated || "";
    lastGeneratedLanguage = saved?.language || "";
  }
  if (transfer.target && transfer.text) {
    const target = document.getElementById(transfer.target);
    target.value = transfer.text;
    target.dispatchEvent(new Event("input", { bubbles:true }));
  }
  imageButton.classList.toggle("active", mode === "image");
  videoButton.classList.toggle("active", mode === "video");
  i2vButton.classList.toggle("active", mode === "i2v");
  i2iButton.classList.toggle("active", mode === "i2i");
  imageButton.setAttribute("aria-pressed", String(mode === "image"));
  videoButton.setAttribute("aria-pressed", String(mode === "video"));
  i2vButton.setAttribute("aria-pressed", String(mode === "i2v"));
  i2iButton.setAttribute("aria-pressed", String(mode === "i2i"));
  form.hidden = mode === "i2v" || mode === "i2i";
  document.getElementById("i2v-workspace").hidden = mode !== "i2v";
  document.getElementById("i2i-workspace").hidden = mode !== "i2i";
  document.getElementById("classic-result").hidden = mode === "i2v" || mode === "i2i";
  document.getElementById("i2v-result").hidden = mode !== "i2v";
  document.getElementById("i2i-result").hidden = mode !== "i2i";
  document.querySelectorAll(".image-controls").forEach((element) => { element.hidden = mode !== "image"; });
  document.querySelectorAll(".video-controls").forEach((element) => { element.hidden = mode !== "video"; });
  syncPhotoPresetControls("still", uiLanguage.value, mode === "image");
  syncArtPresetControls("still", uiLanguage.value, mode === "image");
  i2vController?.setMode(mode === "i2v");
  i2iController?.setMode(mode === "i2i");
  updateResult();
  promptCoach?.refresh();
  addonAdvisor?.refresh();
}

function sample() {
  const hu = uiLanguage.value === "HU";
  const values = hu ? {
    brief: "Egy hajnalban kinyíló vízililiom az ébredező tavon.",
    subject: "Harmatcseppekkel borított vízililiombimbó",
    action: "A bimbó lassan megpattan, szirmai fokozatosan kinyílnak, és teljes virágzásban megállnak.",
    setting: "Csendes tó napkeltekor, finom pára a víz fölött.",
    negatives: "torz szirmok, hirtelen vágás, felirat, túl gyors mozgás"
  } : {
    brief: "A water lily opens at dawn on a quiet lake.",
    subject: "A dew-covered water lily bud",
    action: "The bud gently breaks open; its petals unfold gradually and settle in full bloom.",
    setting: "A still lake at sunrise with a thin layer of mist.",
    negatives: "distorted petals, abrupt cuts, text, overly fast motion"
  };
  for (const [key, value] of Object.entries(values)) document.getElementById(key).value = value;
  sourceLanguage.value = hu ? "HU" : "EN";
  document.getElementById("frame").value = "macro";
  document.getElementById("lighting").value = "dawn";
  document.getElementById("mood").value = "wondrous";
  document.getElementById("camera").value = "macro";
  syncClassicVideoStability();
  document.getElementById("still-shot").value = "close";
  updateResult();
}

uiLanguage.value = localStorage.getItem("artoftomworks.v2.uiLanguage") || "EN";
if (!languages.includes(uiLanguage.value)) uiLanguage.value = "EN";
uiTheme.value = document.documentElement.dataset.theme === "black" ? "black" : "navy";
outputLanguage.value = localStorage.getItem("artoftomworks.v2.outputLanguage") || "EN";
if (!languages.includes(outputLanguage.value)) outputLanguage.value = "EN";
sourceLanguage.value = localStorage.getItem("artoftomworks.v2.sourceLanguage") || "EN";
if (!languages.includes(sourceLanguage.value)) sourceLanguage.value = "EN";
let lastUiLanguage = uiLanguage.value;
installCustomChoices(() => uiLanguage.value);
translate();
document.getElementById("style").value = "cinematic";
document.getElementById("lighting").value = "dawn";
document.getElementById("camera").value = "locked";
syncClassicVideoStability();
document.getElementById("mood").value = "serene";
document.getElementById("frame").value = "auto";
document.getElementById("memory").value = "mid";
document.getElementById("quality").value = "balanced";
document.getElementById("sound").value = "music";
updateResult();

uiLanguage.addEventListener("change", () => {
  if (sourceLanguage.value === lastUiLanguage) {
    sourceLanguage.value = uiLanguage.value;
    localStorage.setItem("artoftomworks.v2.sourceLanguage", sourceLanguage.value);
  }
  lastUiLanguage = uiLanguage.value;
  localStorage.setItem("artoftomworks.v2.uiLanguage", uiLanguage.value);
  translate();
  if (imagePromptKind) document.getElementById("image-provenance").textContent = imageStrings()[imagePromptKind];
});
uiTheme.addEventListener("change", () => {
  const theme = uiTheme.value === "black" ? "black" : "navy";
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("artoftomworks.v2.theme", theme);
});
const backToTopButton=document.getElementById("back-to-top");
function updateBackToTop() {
  const show=window.scrollY>400 || (document.getElementById("catalog-results")?.scrollTop || 0)>180;
  backToTopButton.classList.toggle("is-visible",show);
  backToTopButton.tabIndex=show ? 0 : -1;
}
backToTopButton.addEventListener("click",() => {
  const behavior=window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
  document.getElementById("catalog-results")?.scrollTo({top:0,behavior});
  window.scrollTo({top:0,behavior});
});
window.addEventListener("scroll",updateBackToTop,{passive:true});
document.addEventListener("scroll",(event) => {
  if (event.target?.id==="catalog-results") updateBackToTop();
},true);
updateBackToTop();
outputLanguage.addEventListener("change", () => {
  localStorage.setItem("artoftomworks.v2.outputLanguage", outputLanguage.value);
  updateResult();
});
sourceLanguage.addEventListener("change", () => {
  localStorage.setItem("artoftomworks.v2.sourceLanguage", sourceLanguage.value);
  translationError = "";
  updateResult();
});
imageButton.addEventListener("click", () => setMode("image"));
document.getElementById("still-capture").addEventListener("change", () => {
  const selected = document.getElementById("still-camera-model").value;
  renderCameraProfileSelector("still", uiLanguage.value);
  refreshCustomOptions(["still-camera-model"], { "still-camera-model":selected });
});
document.getElementById("camera").addEventListener("change", syncClassicVideoStability);
for (const id of ["still-quality-prefix", "still-medium", "style"]) {
  document.getElementById(id).addEventListener("change", () => {
    if (id === "still-medium") renderArtPresetSelector("still", uiLanguage.value);
    syncPhotoPresetControls("still", uiLanguage.value, mode === "image");
    syncArtPresetControls("still", uiLanguage.value, mode === "image");
  });
}
videoButton.addEventListener("click", () => setMode("video"));
i2vButton.addEventListener("click", () => setMode("i2v"));
i2iButton.addEventListener("click", () => setMode("i2i"));
form.addEventListener("input", () => { translationError = ""; updateResult(); });
form.addEventListener("change", () => { translationError = ""; updateResult(); });
form.addEventListener("submit", (event) => {
  event.preventDefault();
  void buildAndTranslate();
});
document.getElementById("sample").addEventListener("click", sample);
document.getElementById("clear-fields").addEventListener("click", () => {
  for (const id of textFields) document.getElementById(id).value = "";
  translatedFields.clear();
  translationError = "";
  classicManualEdit = true;
  classicEditor.clear();
  lastGeneratedPrompt = "";
  updateResult();
});
document.getElementById("clear-classic-prompt").addEventListener("click", () => {
  classicManualEdit = true;
  classicPending = false;
  classicEditor.clearCurrent();
  updateResult();
});
document.getElementById("i2v-clear-prompt").addEventListener("click", () => i2vController?.clearPrompt());
document.getElementById("i2i-clear-prompt").addEventListener("click", () => i2iController?.clearPrompt());

let videoSuggestBusy = false;
document.getElementById("video-suggest").addEventListener("click", async () => {
  if (mode !== "video" || videoSuggestBusy) return;
  const state = readState();
  if (![state.brief,state.subject,state.action,state.setting].some((item) => String(item || "").trim())) {
    showStatus(editingCopy().needIdea, "pending"); return;
  }
  if (classicManualEdit && classicEditor.getText().trim() && !window.confirm(replacePromptCopy[uiLanguage.value] || replacePromptCopy.EN)) return;
  const sourceState = JSON.stringify(state);
  const sourcePrompt = JSON.stringify(classicEditor.snapshot());
  const button = document.getElementById("video-suggest");
  videoSuggestBusy = true; button.disabled = true; showStatus(editingCopy().working, "working");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 180_000);
  try {
    const localProxy = location.protocol === "http:" && location.hostname === "127.0.0.1" && ["18774", "18775", "18776", "18777", "18778", "18817", "18818", "18819"].includes(location.port);
    const base = localProxy ? location.origin : "http://127.0.0.1:11434";
    const model=await videoTextModelPicker.getSelected(controller.signal);
    if (!model) { showStatus(videoTextModelPicker.message(), "error"); return; }
    const instruction = `Write one practical, polished TEXT-TO-VIDEO generation prompt in ${({EN:"English",HU:"Hungarian",DE:"German",FR:"French",ES:"Spanish",IT:"Italian",PT:"Portuguese",PL:"Polish"})[state.outputLanguage] || "English"}. Use only the user's supplied information and selected settings; do not invent new characters or scene facts. Idea: ${state.brief || "unspecified"}. Subject: ${state.subject || "unspecified"}. Action: ${state.action || "unspecified"}. Setting: ${state.setting || "unspecified"}. Style: ${state.style}. Lighting: ${state.lighting}. Mood: ${state.mood}. Camera: ${state.camera}. Production: ${state.production}. Device look: ${state.device}. Stability: ${state.stability}. Prompt opening: ${state.customQuality || state.qualityPrefix}. Other selected direction: ${state.customDirections || "none"}. Duration: ${state.duration} seconds. Sound: ${state.sound}; detail: ${state.music || "none"}; no dialogue: ${state.noVoice}. Avoid: ${state.negatives || "none"}. If a field is unspecified, keep it flexible. Describe one continuous, feasible shot, subject motion separately from camera motion, with coherent timing. Keep the user's chosen visual direction. No preface, no markdown, no claims about model capabilities. Return only the prompt.`;
    const response = await fetch(base + "/api/chat", { method:"POST", headers:{ "Content-Type":"application/json" }, signal:controller.signal,
      body:JSON.stringify({ model:model.name, stream:false, options:{ temperature:0.45, num_predict:1200 }, messages:[{ role:"user", content:instruction }] }) });
    if (!response.ok) throw new Error("chat");
    const suggestion = String((await response.json()).message?.content || "").trim().replace(/^```(?:text)?\s*/i, "").replace(/\s*```$/, "");
    if (!suggestion) throw new Error("empty");
    if (mode !== "video" || JSON.stringify(readState()) !== sourceState || JSON.stringify(classicEditor.snapshot()) !== sourcePrompt) {
      showStatus(editingCopy().stale, "pending"); return;
    }
    classicManualEdit = true;
    classicPending = false;
    classicEditor.setPrompt(suggestion, state.outputLanguage);
    updateResult();
    showStatus(editingCopy().ready, "ready");
    document.getElementById("classic-result").scrollIntoView({ behavior:"smooth", block:"start" });
  } catch (error) {
    showStatus(error instanceof TypeError ? editingCopy().missing : editingCopy().failed, "error");
  } finally {
    clearTimeout(timeout); videoSuggestBusy = false; button.disabled = false;
  }
});
imageDrop.addEventListener("click", () => imageFileInput.click());
imageDrop.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") { event.preventDefault(); imageFileInput.click(); }
});
imageFileInput.addEventListener("change", () => {
  void inspectImage(imageFileInput.files?.[0]);
  imageFileInput.value = "";
});
window.addEventListener("dragover", (event) => { if ([...event.dataTransfer?.types || []].includes("Files")) event.preventDefault(); });
window.addEventListener("drop", (event) => { if ([...event.dataTransfer?.types || []].includes("Files")) event.preventDefault(); });
imageDrop.addEventListener("dragover", (event) => { event.preventDefault(); imageDrop.classList.add("drag-over"); });
imageDrop.addEventListener("dragleave", () => imageDrop.classList.remove("drag-over"));
imageDrop.addEventListener("drop", (event) => {
  event.preventDefault();
  event.stopPropagation();
  imageDrop.classList.remove("drag-over");
  void inspectImage(event.dataTransfer?.files?.[0]);
});
const imageModelPicker=attachLocalModelPicker({before:analyzeImageButton,getLanguage:()=>uiLanguage.value,vision:true});
const videoTextModelPicker=attachLocalModelPicker({before:document.getElementById("video-suggest"),getLanguage:()=>uiLanguage.value});
analyzeImageButton.addEventListener("click", () => { void analyzeImage(); });
document.getElementById("use-image-prompt").addEventListener("click", () => {
  const value = document.getElementById("image-prompt").value.trim();
  if (!value) return;
  document.getElementById("brief").value = value;
  if (selectedNegative) document.getElementById("negatives").value = selectedNegative;
  if (imagePromptKind === "suggested") sourceLanguage.value = outputLanguage.value;
  translationError = "";
  updateResult();
  document.getElementById("image-analyze-status").textContent = imageStrings().inserted;
});
document.getElementById("reset").addEventListener("click", () => {
  if (!window.confirm(editingCopy().confirm)) return;
  form.reset();
  for (const key of Object.keys(classicModeDrafts)) delete classicModeDrafts[key];
  continuityText.value = "";
  continuityBox.hidden = true;
  renderCameraProfileSelector("still", uiLanguage.value);
  translatedFields.clear();
  translationError = "";
  classicEditor.clear();
  classicManualEdit = false;
  lastGeneratedPrompt = "";
  sourceLanguage.value = localStorage.getItem("artoftomworks.v2.sourceLanguage") || "EN";
  outputLanguage.value = localStorage.getItem("artoftomworks.v2.outputLanguage") || "EN";
  document.getElementById("style").value = "cinematic";
  document.getElementById("lighting").value = "dawn";
  document.getElementById("camera").value = "locked";
  syncClassicVideoStability();
  document.getElementById("mood").value = "serene";
  document.getElementById("memory").value = "mid";
  document.getElementById("quality").value = "balanced";
  document.getElementById("sound").value = "music";
  syncPhotoPresetControls("still", uiLanguage.value, true);
  renderArtPresetSelector("still", uiLanguage.value);
  syncArtPresetControls("still", uiLanguage.value, true);
  setMode("image", { carry:false });
});
copyButton.addEventListener("click", async () => {
  if (!currentPrompt) return;
  let copied = false;
  try {
    if (!navigator.clipboard?.writeText) throw new Error("Clipboard API unavailable");
    await navigator.clipboard.writeText(currentPrompt);
    copied = true;
  } catch {
    const helper = document.createElement("textarea");
    helper.value = currentPrompt;
    helper.style.position = "fixed";
    helper.style.opacity = "0";
    document.body.appendChild(helper);
    helper.select();
    copied = document.execCommand("copy");
    helper.remove();
  }
  if (copied) {
    copyButton.textContent = selectedUi().copied;
    setTimeout(() => { copyButton.textContent = selectedUi().copy; }, 1600);
  }
});
document.getElementById("download").addEventListener("click", () => {
  if (!currentPrompt) return;
  const blob = new Blob([currentPrompt + "\n"], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "ArtofTomworks_" + mode + "_prompt_" + classicEditor.getLanguage() + ".txt";
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

i2vController = attachImageToVideo({
  getImage: () => selectedImage,
  imageBase64,
  getLanguage: () => uiLanguage.value
});
i2vController.translate();
i2iController = attachImageToImage({
  getImage: () => selectedImage,
  imageBase64,
  getLanguage: () => uiLanguage.value
});
i2iController.translate();

const savedPromptGetCurrent = () => {
    const editor = mode === "i2v" ? i2vController : mode === "i2i" ? i2iController : classicEditor;
    const modelSelect = document.getElementById(mode === "i2v" ? "i2v-model" : mode === "i2i" ? "i2i-model" : "model");
    return { mode, prompt:editor.getText(), language:editor.getLanguage(),
      negative:(mode === "image" || mode === "video") ? document.getElementById("negatives").value : "",
      model:modelSelect?.selectedOptions?.[0]?.textContent?.trim() || "" };
  };
attachAiHub({ getLanguage:() => uiLanguage.value, getCurrent:savedPromptGetCurrent });
attachPromptWorkbench({ getLanguage:() => uiLanguage.value, getCurrent:savedPromptGetCurrent });
const savedPromptRestore = (entry) => {
    setMode(entry.mode, { carry:false });
    if (entry.negative !== undefined && (entry.mode === "image" || entry.mode === "video"))
      document.getElementById("negatives").value = String(entry.negative);
    if (entry.mode === "i2v") i2vController.setPrompt(entry.prompt, entry.language);
    else if (entry.mode === "i2i") i2iController.setPrompt(entry.prompt, entry.language);
    else {
      classicEditor.setPrompt(entry.prompt, entry.language);
      classicManualEdit = true;
      lastGeneratedPrompt = "";
      updateResult();
    }
  };
attachSurprisePrompt({ getLanguage:() => uiLanguage.value, getMode:() => mode,
  getCurrent:savedPromptGetCurrent, restore:savedPromptRestore });
attachPromptLibrary({ getLanguage:() => uiLanguage.value, getCurrent:savedPromptGetCurrent, restore:savedPromptRestore });
addonAdvisor = attachAddonAdvisor({ getLanguage:() => uiLanguage.value, getCurrent:savedPromptGetCurrent, getMode:() => mode });
promptCoach = attachPromptCoach({ getLanguage:() => uiLanguage.value, getMode:() => mode,
  getCurrent:savedPromptGetCurrent, setPrompt:(text, language) => {
    const current = savedPromptGetCurrent();
    savedPromptRestore({ mode:current.mode, prompt:text, language, model:current.model });
  }, getAddonFamilies:() => addonAdvisor.families(), inferAddonFamily:(text) => addonAdvisor.inferFamily(text),
  suggestGuideAddons:(prompt, family) => addonAdvisor.suggestForGuide(prompt, family) });
const directorTimeline = attachDirectorTimeline({ getLanguage:() => uiLanguage.value, getCurrent:savedPromptGetCurrent,
  sendToEditor:(prompt) => {
    if (savedPromptGetCurrent().prompt?.trim() && !window.confirm(replacePromptCopy[uiLanguage.value] || replacePromptCopy.EN)) return;
    savedPromptRestore({mode:"video",prompt,language:"EN",model:""});
  } });
attachMediaCatalog({ getLanguage:() => uiLanguage.value, getCurrent:savedPromptGetCurrent, restore:savedPromptRestore,
  onLinkVideo:(item) => directorTimeline.linkMedia(item), getLinkVideoLabel:() => directorTimeline.linkLabel() });
attachCreativeMemory({ getLanguage:() => uiLanguage.value, getCurrent:savedPromptGetCurrent });

function workspaceDefaults(prefix) {
  const elements = [...document.querySelectorAll(`#${prefix}-workspace input, #${prefix}-workspace textarea, #${prefix}-workspace select, #${prefix}-result input`)];
  return elements.filter((element) => element.id && element.type !== "file").map((element) => ({
    element, value:element.value, checked:element.checked
  }));
}
const initialI2v = workspaceDefaults("i2v");
const initialI2i = workspaceDefaults("i2i");
function resetWorkspace(prefix, defaults, controller) {
  if (!window.confirm(editingCopy().confirm)) return;
  for (const {element,value,checked} of defaults) {
    if (element.type === "checkbox" || element.type === "radio") element.checked = checked;
    else element.value = value;
    element.dispatchEvent(new Event(element.tagName === "SELECT" || element.type === "checkbox" ? "change" : "input", { bubbles:true }));
  }
  controller?.resetPrompt();
  controller?.clearSuggestions();
}
document.getElementById("i2v-reset").addEventListener("click", () => resetWorkspace("i2v", initialI2v, i2vController));
document.getElementById("i2i-reset").addEventListener("click", () => resetWorkspace("i2i", initialI2i, i2iController));
