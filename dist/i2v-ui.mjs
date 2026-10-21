import { videoProfiles, recommendVideoResolution, validateCustomResolution, parseVideoSuggestions } from "./i2v-engine.mjs";
import { cameraMotionOptions, cameraMotionInstruction } from "./camera-motion.mjs";
import { soundEffectOptions, soundEffectsInstruction } from "./sound-effects.mjs";
import { attachBilingualPromptEditor } from "./bilingual-editor.mjs";
import { productionPlan, renderProductionSelectors } from "./production-look.mjs";
import { qualityPrefixPhrase, renderQualityPrefixSelector } from "./quality-prefix.mjs";
import { captureCustomSelections, refreshCustomOptions, customSelectionPlan, customChoiceText } from "./custom-choices.mjs";

const customIds = ["i2v-camera", "i2v-production", "i2v-device", "i2v-stability", "i2v-quality-prefix"];

const copy = {
  EN: { mode:"Image → video", title:"Create video from this image", intro:"Drop the starting image above, then describe your idea in a few words. Suggestions are editable and never block your choice.", idea:"What should happen?", ideaPlaceholder:"For example: a slow clockwise camera roll while the zebras remain centered.", model:"Video model / workflow", duration:"Duration", priority:"Resolution priority", safe:"Conservative", balanced:"Balanced", detail:"More detail", customModel:"Custom model name, if needed", customPlaceholder:"Optional; no model file is downloaded", sourceNote:"Write in any language. The local vision model proposes editable English prompts. No generation starts here.", suggest:"Suggest three video ideas", result:"Your video plan", resolution:"Suggested generation resolution", lighter:"Lighter option", override:"Use my own resolution", width:"Width", height:"Height", three:"Choose an idea", prompt:"Editable English video prompt", promptPlaceholder:"Choose a suggestion, then edit freely.", copy:"Copy prompt", download:"Download TXT", disclaimer:"All ideas and sizes are starting suggestions. Check your workflow settings; this page does not run video generation.", chooseImage:"Drop a starting image above first.", ready:"Ready for a local image-to-video suggestion.", working:"Analyzing the image locally…", missing:"Local Ollama is unavailable. Start Prompt Studio with its local launcher.", modelMissing:"The local gemma3:4b vision model is missing.", failed:"The local suggestion failed. Check Ollama and try again.", malformed:"The local model did not return three usable ideas. Try again.", stale:"Image or settings changed. Refresh the suggestions when ready; your editable prompt remains.", copied:"Copied", ratio:"The source aspect ratio differs from this workflow size; check for cropping or padding.", unknown:"Custom model: generic dimensions only; verify its documentation or import a proven workflow later.", basis:"Starting point from the selected local workflow profile, not a guaranteed model limit.", customBasis:"Your manual size overrides the suggestion; confirm it in ComfyUI.", invalid:"Use whole-number dimensions from 256 to 4096, divisible by 32.", warning:"Possible trade-offs — advice only:" },
  HU: { mode:"Képből videó", title:"Készíts videót ebből a képből", intro:"Húzd be fent a kezdőképet, majd írd le néhány szóban az ötletedet. A javaslatok átírhatók és nem tiltanak meg semmit.", idea:"Mi történjen a videóban?", ideaPlaceholder:"Például: a kamera lassan jobbra forog, a zebrák középen maradnak.", model:"Videómodell / workflow", duration:"Időtartam", priority:"Felbontási irány", safe:"Takarékos", balanced:"Kiegyensúlyozott", detail:"Részletesebb", customModel:"Egyedi modell neve, ha kell", customPlaceholder:"Opcionális; modellfájlt nem tölt le", sourceNote:"Bármely nyelven írhatsz. A helyi képelemző szerkeszthető angol promptokat javasol. Itt nem indul generálás.", suggest:"Három videóötlet javaslata", result:"Videóterv", resolution:"Javasolt generálási felbontás", lighter:"Takarékosabb lehetőség", override:"Saját felbontást használok", width:"Szélesség", height:"Magasság", three:"Válassz egy ötletet", prompt:"Szerkeszthető angol videóprompt", promptPlaceholder:"Válassz javaslatot, majd szabadon írd át.", copy:"Prompt másolása", download:"TXT letöltése", disclaimer:"Minden ötlet és méret kiindulási javaslat. A workflow beállításait te ellenőrzöd; az oldal nem indít videógenerálást.", chooseImage:"Előbb húzz be fent egy kezdőképet.", ready:"Készen áll a helyi videóötlet-javaslatra.", working:"A kép helyi elemzése folyamatban…", missing:"A helyi Ollama nem érhető el. Indítsd a Prompt Studiót a helyi indítóval.", modelMissing:"A helyi gemma3:4b képelemző modell hiányzik.", failed:"A helyi javaslat nem sikerült. Ellenőrizd az Ollamát, majd próbáld újra.", malformed:"A helyi modell nem adott három használható ötletet. Próbáld újra.", stale:"Változott a kép vagy a beállítás. Ha kell, kérj új javaslatot; a szerkesztett prompt megmarad.", copied:"Másolva", ratio:"A kezdőkép képaránya eltér ettől a mérettől; vágás vagy kitöltés lehet szükséges.", unknown:"Egyedi modell: csak általános méretjavaslat; ellenőrizd a leírását vagy egy bevált workflow-t.", basis:"A kiválasztott helyi workflow-profilból származó kiindulópont, nem garantált modellhatár.", customBasis:"A saját méreted felülírja a javaslatot; ellenőrizd a ComfyUI-ban.", invalid:"256–4096 közötti, 32-vel osztható egész méreteket adj meg.", warning:"Lehetséges kompromisszumok – csak tanács:" },
  DE: {mode:"Bild → Video",title:"Video aus diesem Bild",intro:"Startbild oben ablegen und die Idee kurz beschreiben. Vorschläge sind frei bearbeitbar.",idea:"Was soll geschehen?",model:"Videomodell / Workflow",duration:"Dauer",priority:"Auflösungsziel",safe:"Sparsam",balanced:"Ausgewogen",detail:"Mehr Details",customModel:"Eigener Modellname",sourceNote:"Beliebige Eingabesprache. Das lokale Bildmodell erstellt bearbeitbare englische Prompts.",suggest:"Drei Videoideen vorschlagen",result:"Ihr Videoplan",resolution:"Empfohlene Generierungsauflösung",lighter:"Kleinere Variante",override:"Eigene Auflösung",width:"Breite",height:"Höhe",three:"Idee auswählen",prompt:"Bearbeitbarer englischer Prompt",copy:"Prompt kopieren",download:"TXT herunterladen",disclaimer:"Nur Empfehlungen; die Seite startet keine Generierung.",chooseImage:"Zuerst ein Startbild oben ablegen.",working:"Lokale Bildanalyse…",missing:"Lokales Ollama nicht erreichbar.",modelMissing:"gemma3:4b fehlt.",failed:"Vorschlag fehlgeschlagen.",malformed:"Keine drei brauchbaren Ideen erhalten.",stale:"Bild oder Einstellungen geändert; Vorschläge bei Bedarf erneuern.",copied:"Kopiert",ratio:"Bildformat weicht ab; Zuschnitt prüfen.",unknown:"Unbekanntes Modell: allgemeine Größe; Dokumentation prüfen.",basis:"Aus lokalem Workflow-Profil, keine garantierte Modellgrenze.",customBasis:"Eigene Größe überschreibt die Empfehlung.",invalid:"Ganzzahlen 256–4096, durch 32 teilbar.",warning:"Mögliche Kompromisse:"},
  FR: {mode:"Image → vidéo",title:"Créer une vidéo à partir de l'image",intro:"Déposez l'image puis décrivez l'idée en quelques mots. Les suggestions restent modifiables.",idea:"Que doit-il se passer ?",model:"Modèle vidéo / workflow",duration:"Durée",priority:"Priorité de résolution",safe:"Économe",balanced:"Équilibrée",detail:"Plus de détails",customModel:"Nom du modèle personnalisé",sourceNote:"Écrivez dans votre langue. Le modèle local propose des prompts anglais modifiables.",suggest:"Proposer trois idées vidéo",result:"Votre plan vidéo",resolution:"Résolution de génération suggérée",lighter:"Option plus légère",override:"Utiliser ma résolution",width:"Largeur",height:"Hauteur",three:"Choisir une idée",prompt:"Prompt anglais modifiable",copy:"Copier",download:"Télécharger TXT",disclaimer:"Suggestions uniquement ; aucune génération n'est lancée.",chooseImage:"Déposez d'abord une image.",working:"Analyse locale…",missing:"Ollama local indisponible.",modelMissing:"gemma3:4b absent.",failed:"Échec de la suggestion.",malformed:"Trois idées utilisables non reçues.",stale:"Image ou réglages modifiés ; actualisez au besoin.",copied:"Copié",ratio:"Le format diffère ; vérifiez le recadrage.",unknown:"Modèle inconnu : dimensions génériques.",basis:"Profil de workflow local, pas une limite garantie.",customBasis:"Votre taille remplace la suggestion.",invalid:"Entiers 256–4096, multiples de 32.",warning:"Compromis possibles :"},
  ES: {mode:"Imagen → vídeo",title:"Crear vídeo desde esta imagen",intro:"Suelta la imagen y describe tu idea brevemente. Las sugerencias se pueden editar.",idea:"¿Qué debe pasar?",model:"Modelo de vídeo / workflow",duration:"Duración",priority:"Prioridad de resolución",safe:"Económica",balanced:"Equilibrada",detail:"Más detalle",customModel:"Nombre de modelo personalizado",sourceNote:"Escribe en tu idioma. El modelo local propone prompts editables en inglés.",suggest:"Sugerir tres ideas de vídeo",result:"Tu plan de vídeo",resolution:"Resolución de generación sugerida",lighter:"Opción ligera",override:"Usar mi resolución",width:"Ancho",height:"Alto",three:"Elige una idea",prompt:"Prompt inglés editable",copy:"Copiar",download:"Descargar TXT",disclaimer:"Solo sugerencias; no se inicia generación.",chooseImage:"Primero suelta una imagen.",working:"Análisis local…",missing:"Ollama local no disponible.",modelMissing:"Falta gemma3:4b.",failed:"No se pudo generar la sugerencia.",malformed:"No se recibieron tres ideas válidas.",stale:"Cambiaron la imagen o los ajustes; actualiza si hace falta.",copied:"Copiado",ratio:"Relación de aspecto diferente; comprueba el recorte.",unknown:"Modelo desconocido: tamaño genérico.",basis:"Basado en workflow local, no en un límite garantizado.",customBasis:"Tu tamaño sustituye la sugerencia.",invalid:"Enteros 256–4096 divisibles por 32.",warning:"Posibles compromisos:"},
  IT: {mode:"Immagine → video",title:"Crea un video da questa immagine",intro:"Trascina l'immagine e descrivi brevemente l'idea. I suggerimenti sono modificabili.",idea:"Cosa deve accadere?",model:"Modello video / workflow",duration:"Durata",priority:"Priorità risoluzione",safe:"Leggera",balanced:"Bilanciata",detail:"Più dettagli",customModel:"Nome modello personalizzato",sourceNote:"Scrivi nella tua lingua. Il modello locale propone prompt inglesi modificabili.",suggest:"Suggerisci tre idee video",result:"Il tuo piano video",resolution:"Risoluzione suggerita",lighter:"Opzione più leggera",override:"Usa la mia risoluzione",width:"Larghezza",height:"Altezza",three:"Scegli un'idea",prompt:"Prompt inglese modificabile",copy:"Copia",download:"Scarica TXT",disclaimer:"Solo suggerimenti; nessuna generazione viene avviata.",chooseImage:"Prima carica un'immagine.",working:"Analisi locale…",missing:"Ollama locale non disponibile.",modelMissing:"gemma3:4b non installato.",failed:"Suggerimento non riuscito.",malformed:"Non sono arrivate tre idee valide.",stale:"Immagine o impostazioni cambiate; aggiorna se necessario.",copied:"Copiato",ratio:"Formato diverso; controlla il ritaglio.",unknown:"Modello sconosciuto: dimensioni generiche.",basis:"Da workflow locale, non limite garantito.",customBasis:"La tua misura sostituisce il suggerimento.",invalid:"Interi 256–4096 divisibili per 32.",warning:"Possibili compromessi:"},
  PT: {mode:"Imagem → vídeo",title:"Criar vídeo a partir da imagem",intro:"Arraste a imagem e descreva a ideia em poucas palavras. Pode editar todas as sugestões.",idea:"O que deve acontecer?",model:"Modelo de vídeo / workflow",duration:"Duração",priority:"Prioridade de resolução",safe:"Económica",balanced:"Equilibrada",detail:"Mais detalhe",customModel:"Nome de modelo personalizado",sourceNote:"Escreva na sua língua. O modelo local propõe prompts ingleses editáveis.",suggest:"Sugerir três ideias de vídeo",result:"O seu plano de vídeo",resolution:"Resolução sugerida",lighter:"Opção leve",override:"Usar a minha resolução",width:"Largura",height:"Altura",three:"Escolha uma ideia",prompt:"Prompt inglês editável",copy:"Copiar",download:"Transferir TXT",disclaimer:"Apenas sugestões; nenhuma geração é iniciada.",chooseImage:"Primeiro arraste uma imagem.",working:"Análise local…",missing:"Ollama local indisponível.",modelMissing:"gemma3:4b não instalado.",failed:"Falha na sugestão.",malformed:"Não foram recebidas três ideias válidas.",stale:"Imagem ou definições alteradas; atualize se necessário.",copied:"Copiado",ratio:"Formato diferente; confirme o corte.",unknown:"Modelo desconhecido: tamanho genérico.",basis:"Perfil de workflow local, não limite garantido.",customBasis:"O tamanho manual substitui a sugestão.",invalid:"Inteiros 256–4096 divisíveis por 32.",warning:"Possíveis compromissos:"},
  PL: {mode:"Obraz → wideo",title:"Utwórz wideo z tego obrazu",intro:"Dodaj obraz i opisz pomysł w kilku słowach. Propozycje możesz swobodnie zmieniać.",idea:"Co ma się wydarzyć?",model:"Model wideo / workflow",duration:"Czas",priority:"Priorytet rozdzielczości",safe:"Oszczędny",balanced:"Zrównoważony",detail:"Więcej szczegółów",customModel:"Nazwa własnego modelu",sourceNote:"Pisz w swoim języku. Lokalny model proponuje edytowalne angielskie prompty.",suggest:"Zaproponuj trzy pomysły",result:"Plan wideo",resolution:"Sugerowana rozdzielczość",lighter:"Lżejsza opcja",override:"Własna rozdzielczość",width:"Szerokość",height:"Wysokość",three:"Wybierz pomysł",prompt:"Edytowalny angielski prompt",copy:"Kopiuj",download:"Pobierz TXT",disclaimer:"To tylko propozycje; strona nie uruchamia generowania.",chooseImage:"Najpierw dodaj obraz.",working:"Analiza lokalna…",missing:"Lokalna Ollama niedostępna.",modelMissing:"Brak gemma3:4b.",failed:"Nie udało się utworzyć propozycji.",malformed:"Nie otrzymano trzech poprawnych pomysłów.",stale:"Zmieniono obraz lub ustawienia; odśwież w razie potrzeby.",copied:"Skopiowano",ratio:"Proporcje różnią się; sprawdź kadrowanie.",unknown:"Nieznany model: ogólna rozdzielczość.",basis:"Na podstawie lokalnego workflow, nie gwarantowany limit.",customBasis:"Własny rozmiar zastępuje sugestię.",invalid:"Liczby 256–4096 podzielne przez 32.",warning:"Możliwe kompromisy:"}
};

const languageNames = { HU:"Hungarian", EN:"English", DE:"German", FR:"French", ES:"Spanish", IT:"Italian", PT:"Portuguese", PL:"Polish" };
const bilingualPromptLabels = { EN:"Editable multilingual video prompt", HU:"Szerkeszthető többnyelvű videóprompt", DE:"Bearbeitbarer mehrsprachiger Videoprompt", FR:"Prompt vidéo multilingue modifiable", ES:"Prompt de vídeo multilingüe editable", IT:"Prompt video multilingue modificabile", PT:"Prompt de vídeo multilingue editável", PL:"Edytowalny wielojęzyczny prompt wideo" };
const cameraCopy = {
  EN: { camera:"Camera movement", cameraStrength:"Movement intensity", gentle:"Gentle", moderate:"Moderate", strong:"Pronounced", cameraCustom:"Describe your camera move", cameraCustomPlaceholder:"For example: a 45° clockwise roll over four seconds." },
  HU: { camera:"Kameramozgás", cameraStrength:"Mozgás erőssége", gentle:"Finom", moderate:"Közepes", strong:"Határozott", cameraCustom:"Írd le az egyedi kameramozgást", cameraCustomPlaceholder:"Például: 45°-os jobbra forgás négy másodperc alatt." },
  DE: { camera:"Kamerabewegung", cameraStrength:"Bewegungsstärke", gentle:"Sanft", moderate:"Mittel", strong:"Deutlich", cameraCustom:"Kamerabewegung beschreiben", cameraCustomPlaceholder:"Zum Beispiel: 45° im Uhrzeigersinn in vier Sekunden." },
  FR: { camera:"Mouvement de caméra", cameraStrength:"Intensité", gentle:"Doux", moderate:"Modéré", strong:"Prononcé", cameraCustom:"Décrire le mouvement", cameraCustomPlaceholder:"Par exemple : rotation horaire de 45° en quatre secondes." },
  ES: { camera:"Movimiento de cámara", cameraStrength:"Intensidad", gentle:"Suave", moderate:"Moderada", strong:"Marcada", cameraCustom:"Describe el movimiento", cameraCustomPlaceholder:"Por ejemplo: giro horario de 45° en cuatro segundos." },
  IT: { camera:"Movimento della camera", cameraStrength:"Intensità", gentle:"Delicato", moderate:"Moderato", strong:"Deciso", cameraCustom:"Descrivi il movimento", cameraCustomPlaceholder:"Per esempio: rotazione oraria di 45° in quattro secondi." },
  PT: { camera:"Movimento de câmara", cameraStrength:"Intensidade", gentle:"Suave", moderate:"Moderada", strong:"Marcada", cameraCustom:"Descreva o movimento", cameraCustomPlaceholder:"Por exemplo: rotação horária de 45° em quatro segundos." },
  PL: { camera:"Ruch kamery", cameraStrength:"Intensywność", gentle:"Delikatny", moderate:"Umiarkowany", strong:"Wyraźny", cameraCustom:"Opisz ruch kamery", cameraCustomPlaceholder:"Na przykład: obrót o 45° zgodnie z zegarem w cztery sekundy." }
};
const soundCopy = {
  EN: { sounds:"Optional sound effects", soundsHelp:"Choose any that fit the scene. Leave all unchecked for a visual-only prompt.", soundCustom:"Other sound, if needed", soundCustomPlaceholder:"For example: a distant clock bell." },
  HU: { sounds:"Opcionális hanghatások", soundsHelp:"Többet is választhatsz. Ha egyet sem jelölsz, a prompt csak a képre összpontosít.", soundCustom:"Más hang, ha szükséges", soundCustomPlaceholder:"Például: távoli harangszó." },
  DE: { sounds:"Optionale Geräusche", soundsHelp:"Passende Geräusche auswählen; ohne Auswahl bleibt der Prompt visuell.", soundCustom:"Anderes Geräusch", soundCustomPlaceholder:"Zum Beispiel: ferne Glocke." },
  FR: { sounds:"Effets sonores facultatifs", soundsHelp:"Choisissez ceux qui conviennent. Sans sélection, le prompt reste visuel.", soundCustom:"Autre son", soundCustomPlaceholder:"Par exemple : cloche lointaine." },
  ES: { sounds:"Efectos de sonido opcionales", soundsHelp:"Elige los que encajen; sin selección, el prompt será solo visual.", soundCustom:"Otro sonido", soundCustomPlaceholder:"Por ejemplo: una campana lejana." },
  IT: { sounds:"Effetti sonori facoltativi", soundsHelp:"Scegli quelli adatti; senza selezione, il prompt resta visivo.", soundCustom:"Altro suono", soundCustomPlaceholder:"Per esempio: una campana lontana." },
  PT: { sounds:"Efeitos sonoros opcionais", soundsHelp:"Escolha os adequados; sem seleção, o prompt será apenas visual.", soundCustom:"Outro som", soundCustomPlaceholder:"Por exemplo: um sino distante." },
  PL: { sounds:"Opcjonalne efekty dźwiękowe", soundsHelp:"Wybierz pasujące; bez wyboru prompt dotyczy tylko obrazu.", soundCustom:"Inny dźwięk", soundCustomPlaceholder:"Na przykład: odległy dzwon." }
};
const el = (id) => document.getElementById(id);

export function attachImageToVideo({ getImage, imageBase64, getLanguage, getNegative, onPromptReady, onImageChange }) {
  const model = el("i2v-model");
  const idea = el("i2v-idea");
  const duration = el("i2v-duration");
  const priority = el("i2v-priority");
  const customModel = el("i2v-custom-model");
  const camera = el("i2v-camera");
  const cameraStrength = el("i2v-camera-strength");
  const cameraCustom = el("i2v-camera-custom");
  const soundOptions = el("i2v-sound-options");
  const soundCustom = el("i2v-sound-custom");
  const override = el("i2v-override-check");
  const width = el("i2v-width");
  const height = el("i2v-height");
  const prompt = el("i2v-prompt");
  const promptEditor = attachBilingualPromptEditor({ field:prompt, getLanguage });
  const status = el("i2v-status");
  const suggestButton = el("i2v-suggest");
  let dimensions = null;
  let currentFile = null;
  let aiWarnings = [];
  let isActive = false;
  let busy = false;
  let revision = 0;
  const t = () => ({ ...copy.EN, ...(copy[getLanguage()] || {}), ...cameraCopy.EN, ...(cameraCopy[getLanguage()] || {}), ...soundCopy.EN, ...(soundCopy[getLanguage()] || {}) });

  function selectedSoundEffects() {
    return [...soundOptions.querySelectorAll("input:checked")].map((item) => item.value);
  }

  for (const [key, profile] of Object.entries(videoProfiles)) {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = profile.label;
    model.appendChild(option);
  }

  function translate() {
    const customBefore = captureCustomSelections(customIds);
    const strings = t();
    const selectedCamera = camera.value || "auto";
    camera.replaceChildren();
    for (const [key, item] of Object.entries(cameraMotionOptions)) {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = item[getLanguage()] || item.EN;
      camera.appendChild(option);
    }
    camera.value = selectedCamera;
    const selectedSounds = new Set(selectedSoundEffects());
    soundOptions.replaceChildren();
    for (const [key, item] of Object.entries(soundEffectOptions)) {
      const label = document.createElement("label"); label.className = "i2v-sound-option";
      const input = document.createElement("input"); input.type = "checkbox"; input.value = key; input.checked = selectedSounds.has(key);
      input.addEventListener("change", markStale);
      const caption = document.createElement("span"); caption.textContent = item[getLanguage()] || item.EN;
      label.append(input, caption); soundOptions.appendChild(label);
    }
    document.querySelectorAll("[data-i2v]").forEach((item) => { item.textContent = strings[item.dataset.i2v] || ""; });
    document.querySelector('[data-i2v="prompt"]').textContent = bilingualPromptLabels[getLanguage()] || bilingualPromptLabels.EN;
    document.querySelectorAll("[data-i2v-placeholder]").forEach((item) => { item.placeholder = strings[item.dataset.i2vPlaceholder] || ""; });
    renderProductionSelectors("i2v", getLanguage(), true);
    renderQualityPrefixSelector("i2v", getLanguage());
    refreshCustomOptions(customIds, customBefore);
    syncStability();
    promptEditor.translateUi();
    updateRecommendation();
  }

  function syncStability() {
    const stability = el("i2v-stability");
    const locked = camera.value === "locked";
    if (locked) stability.value = "auto";
    stability.disabled = locked;
  }

  function renderWarnings(recommendation) {
    const warnings = [];
    if (recommendation.ratioWarning) warnings.push(t().ratio);
    if (recommendation.unknownModel) warnings.push(t().unknown);
    warnings.push(...aiWarnings);
    const box = el("i2v-warning");
    box.hidden = warnings.length === 0;
    box.replaceChildren();
    if (!warnings.length) return;
    const heading = document.createElement("strong");
    heading.textContent = t().warning;
    const list = document.createElement("ul");
    for (const warning of warnings) {
      const item = document.createElement("li");
      item.textContent = warning;
      list.appendChild(item);
    }
    box.append(heading, list);
  }

  function updateRecommendation() {
    const recommendation = recommendVideoResolution({
      model: model.value,
      width: dimensions?.width,
      height: dimensions?.height,
      duration: duration.value,
      priority: priority.value
    });
    const manual = override.checked;
    el("i2v-override-fields").hidden = !manual;
    if (!manual) {
      width.value = recommendation.width;
      height.value = recommendation.height;
    }
    const valid = !manual || validateCustomResolution(width.value, height.value);
    const chosenWidth = manual && valid ? Number(width.value) : recommendation.width;
    const chosenHeight = manual && valid ? Number(height.value) : recommendation.height;
    el("i2v-resolution-value").textContent = `${chosenWidth} × ${chosenHeight}`;
    el("i2v-resolution-reason").textContent = `${recommendation.profile} · ${manual && valid ? t().customBasis : t().basis} ${recommendation.note}`;
    el("i2v-lighter").textContent = recommendation.lighter.join(" × ");
    el("i2v-override-status").textContent = manual && !valid ? t().invalid : "";
    renderWarnings(recommendation);
    return recommendation;
  }

  function markStale() {
    revision++;
    if (prompt.value.trim() || !el("i2v-suggestions").hidden) status.textContent = t().stale;
    aiWarnings = [];
    updateRecommendation();
  }

  function setImage(file, size) {
    if (file !== currentFile) {
      revision++;
      currentFile = file;
      dimensions = null;
      aiWarnings = [];
      promptEditor.clear();
      onImageChange?.();
      el("i2v-options").replaceChildren();
      el("i2v-suggestions").hidden = true;
      status.textContent = file ? t().ready : t().chooseImage;
    }
    if (size?.width > 0 && size?.height > 0) dimensions = size;
    suggestButton.disabled = !file || busy;
    updateRecommendation();
  }

  function setMode(active) { isActive = active; if (active) updateRecommendation(); }

  function renderSuggestions(result, capturePlan, opening) {
    const target = el("i2v-options");
    target.replaceChildren();
    for (const [index, suggestion] of result.suggestions.entries()) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "i2v-option";
      const title = document.createElement("strong");
      title.textContent = `${index + 1}. ${suggestion.title}`;
      const reason = document.createElement("small");
      reason.textContent = suggestion.reason;
      button.append(title, reason);
      button.addEventListener("click", () => {
        target.querySelectorAll("button").forEach((item) => item.classList.remove("selected"));
        button.classList.add("selected");
        const body = capturePlan ? `${suggestion.prompt}\nCapture style: ${capturePlan}.` : suggestion.prompt;
        promptEditor.setPrompt(opening ? `${opening}.\n${body}` : body, "EN");
        onPromptReady?.();
      });
      target.appendChild(button);
    }
    el("i2v-suggestions").hidden = false;
    target.firstElementChild?.click();
  }

  async function suggest() {
    const file = getImage();
    if (!file) { status.textContent = t().chooseImage; return; }
    if (busy) return;
    const requestRevision = revision;
    busy = true;
    suggestButton.disabled = true;
    status.textContent = t().working;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 300_000);
    try {
      const localProxy = location.protocol === "http:" && location.hostname === "127.0.0.1" && ["18774", "18775", "18776", "18777", "18778", "18817", "18818", "18819"].includes(location.port);
      const base = localProxy ? location.origin : "http://127.0.0.1:11434";
      const tagsResponse = await fetch(base + "/api/tags", { signal: controller.signal });
      if (!tagsResponse.ok) throw new Error("ollama");
      const tags = await tagsResponse.json();
      const vision = tags.models?.find((item) => item.name === "gemma3:4b" || item.name === "gemma3:latest");
      if (!vision) { status.textContent = t().modelMissing; return; }
      const image = await imageBase64(file);
      const profile = videoProfiles[model.value] || videoProfiles.other;
      const customCamera = customChoiceText("i2v-camera", "EN");
      const cameraDirection = customCamera ? `Camera direction: ${customCamera}. Treat this as one continuous shot.` : cameraMotionInstruction(camera.value, cameraCustom.value, cameraStrength.value);
      const soundDirection = soundEffectsInstruction(selectedSoundEffects(), soundCustom.value);
      const capturePlan = [productionPlan({ production:el("i2v-production").value, device:el("i2v-device").value, stability:el("i2v-stability").value }, "EN", true), customSelectionPlan(["i2v-camera", "i2v-production", "i2v-device", "i2v-stability"], "EN")].filter(Boolean).join("; ");
      const opening = customChoiceText("i2v-quality-prefix", "EN") || qualityPrefixPhrase(el("i2v-quality-prefix").value, "EN");
      const guidance = `You are helping plan an image-to-video shot. The attached image is the exact starting frame. The user writes in any language; understand it, but write each video prompt in English. User idea: ${idea.value.trim() || "Suggest subtle natural motion suited to this image."}\nSelected model/workflow: ${profile.label}${model.value === "other" ? ` (${customModel.value.trim() || "unspecified"})` : ""}. Duration: ${duration.value} seconds. ${cameraDirection} ${soundDirection} Chosen capture style: ${capturePlan || "no extra constraint"}. Optional opening phrase: ${opening || "none"}. First describe only visible subjects and composition. Preserve subject count, identity, colors and background. Suggest exactly three distinct but feasible subject/action directions: (1) subtle and faithful, (2) balanced, (3) more expressive. Every suggested prompt must explicitly include the selected camera direction; if the camera is locked, do not introduce camera movement. Include only the selected sound effects, if any, as a separate concise audio direction and never claim that the workflow can generate audio. Each suggestion needs a concise title, a one-sentence reason in ${languageNames[getLanguage()] || "English"}, and a complete practical English image-to-video prompt. The capture style and optional opening will be appended to each suggestion, so do not repeat them verbatim. In prompts separate subject movement from camera movement, use one continuous shot, avoid unnecessary additions and impossible constraints. If the idea, camera or sound direction conflicts with the image framing, count, visible events, or model limitations, put up to three short advisory warnings in ${languageNames[getLanguage()] || "English"}; warnings do not forbid anything. Never claim certainty about video quality, exact model limits, or unseen content. Return ONLY valid JSON with keys imageSummary (string), warnings (array of strings), suggestions (array of exactly three objects with title, reason, prompt).`;
      const response = await fetch(base + "/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" }, signal: controller.signal,
        body: JSON.stringify({ model: vision.name, stream: false, format: "json", options: { temperature: 0.35, num_predict: 2400 }, messages: [{ role: "user", content: guidance, images: [image] }] })
      });
      if (!response.ok) throw new Error("chat");
      const result = parseVideoSuggestions((await response.json()).message?.content);
      if (requestRevision !== revision || file !== getImage()) return;
      if (!result) { status.textContent = t().malformed; return; }
      aiWarnings = result.warnings;
      renderSuggestions(result, capturePlan, opening);
      updateRecommendation();
      status.textContent = result.imageSummary || t().ready;
      if (isActive) el("i2v-result").scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (error) {
      if (requestRevision === revision) status.textContent = error instanceof TypeError ? t().missing : t().failed;
    } finally {
      clearTimeout(timeout);
      busy = false;
      suggestButton.disabled = !getImage();
    }
  }

  async function copyPrompt() {
    if (!prompt.value.trim()) return;
    try { await navigator.clipboard.writeText(prompt.value); }
    catch {
      prompt.select();
      document.execCommand("copy");
    }
    const button = el("i2v-copy");
    button.textContent = t().copied;
    setTimeout(() => { button.textContent = t().copy; }, 1500);
  }

  function downloadPrompt() {
    if (!prompt.value.trim()) return;
    if (override.checked && !validateCustomResolution(width.value, height.value)) {
      el("i2v-override-status").textContent = t().invalid;
      return;
    }
    const selectedWidth = width.value, selectedHeight = height.value;
    const note = `Model/workflow: ${(videoProfiles[model.value] || videoProfiles.other).label}\nSuggested or chosen resolution: ${selectedWidth} × ${selectedHeight}\nDuration: ${duration.value} s\nPrompt language: ${promptEditor.getLanguage()}\n${customChoiceText("i2v-camera", "EN") || cameraMotionInstruction(camera.value, cameraCustom.value, cameraStrength.value)}\n${productionPlan({ production:el("i2v-production").value, device:el("i2v-device").value, stability:el("i2v-stability").value }, "EN", true)}\n${soundEffectsInstruction(selectedSoundEffects(), soundCustom.value)}\n\n`;
    const link = document.createElement("a");
    const negative = getNegative?.().trim() || "";
    const url = URL.createObjectURL(new Blob([note + prompt.value.trim() + (negative ? `\n\nNegative prompt:\n${negative}` : "") + "\n"], { type: "text/plain;charset=utf-8" }));
    link.href = url;
    link.download = "ArtofTomworks_image_to_video_prompt.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  for (const input of [model, duration, priority]) input.addEventListener("change", markStale);
  for (const input of [camera, cameraStrength]) input.addEventListener("change", markStale);
  for (const group of ["production", "device", "stability"]) el(`i2v-${group}`).addEventListener("change", markStale);
  el("i2v-quality-prefix").addEventListener("change", markStale);
  camera.addEventListener("change", () => { el("i2v-camera-custom-field").hidden = camera.value !== "custom"; cameraStrength.disabled = camera.value === "locked"; syncStability(); });
  cameraCustom.addEventListener("input", markStale);
  soundCustom.addEventListener("input", markStale);
  model.addEventListener("change", () => { customModel.disabled = model.value !== "other"; updateRecommendation(); });
  idea.addEventListener("input", markStale);
  customModel.addEventListener("input", markStale);
  override.addEventListener("change", updateRecommendation);
  width.addEventListener("input", updateRecommendation);
  height.addEventListener("input", updateRecommendation);
  suggestButton.addEventListener("click", () => { void suggest(); });
  el("i2v-copy").addEventListener("click", () => { void copyPrompt(); });
  el("i2v-download").addEventListener("click", downloadPrompt);

  updateRecommendation();
  return { translate, setImage, setMode, updateRecommendation,
    getText: () => promptEditor.getText(), getLanguage: () => promptEditor.getLanguage(),
    setPrompt: (text, language) => promptEditor.setPrompt(text, language),
    clearPrompt: () => promptEditor.clearCurrent(), resetPrompt: () => promptEditor.clear(),
    clearSuggestions: () => { revision++; aiWarnings = []; el("i2v-suggestions").hidden = true; el("i2v-options").replaceChildren(); status.textContent = ""; updateRecommendation(); } };
}
