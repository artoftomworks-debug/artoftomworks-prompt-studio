import {creativePromptFor} from "./prompt-mix-section.mjs";
import { imageEditProfiles, recommendImageEditResolution, validImageEditResolution, parseImageEditSuggestions } from "./i2i-engine.mjs";
import { attachBilingualPromptEditor } from "./bilingual-editor.mjs";
import { imageDirectionPlan, renderImageDirectionSelectors, renderCameraProfileSelector } from "./image-direction.mjs";
import { productionPlan, renderProductionSelectors } from "./production-look.mjs";
import { imageOpening, renderQualityPrefixSelector, renderPhotoPresetSelectors, syncPhotoPresetControls, renderArtPresetSelector, syncArtPresetControls } from "./quality-prefix.mjs";
import { captureCustomSelections, refreshCustomOptions, customSelectionPlan, customChoiceText } from "./custom-choices.mjs";

const customIds = ["i2i-shot", "i2i-angle", "i2i-lens", "i2i-medium", "i2i-camera-model", "i2i-production", "i2i-quality-prefix"];

const copy = {
  EN: { mode:"Image → image", title:"Reimagine this image", intro:"Use the image above as a visual reference. Describe what to keep and what to change; every suggestion remains editable.", keep:"What should stay?", keepPlaceholder:"For example: the woman's pose, chair and full-body framing.", change:"What should change?", changePlaceholder:"For example: move the scene to a Mexican sunset.", model:"Image model / workflow", priority:"Resolution priority", safe:"Conservative", balanced:"Balanced", detail:"More detail", customModel:"Custom model name", customPlaceholder:"Optional; no model file is downloaded", sourceNote:"Write in any language. The local vision model proposes editable English image-edit prompts. This page does not generate an image.", suggest:"Suggest three image directions", result:"Your image plan", resolution:"Suggested generation resolution", lighter:"Lighter option", override:"Use my own resolution", width:"Width", height:"Height", three:"Choose a direction", prompt:"Editable English image-edit prompt", promptPlaceholder:"Choose a suggestion, then edit freely.", copy:"Copy prompt", download:"Download TXT", disclaimer:"Prompts and sizes are starting suggestions. Use the same reference image in your image-to-image workflow; this page does not generate images.", chooseImage:"Drop a reference image above first.", ready:"Ready for local image-edit ideas.", working:"Analyzing the image locally…", missing:"Local Ollama is unavailable. Start Prompt Studio with its local launcher.", modelMissing:"The local gemma3:4b vision model is missing.", failed:"The local suggestion failed. Check Ollama and try again.", malformed:"The local model did not return three usable ideas. Try again.", stale:"Image or settings changed. Refresh suggestions if needed; your edited prompt remains.", copied:"Copied", ratio:"The source and suggested aspect ratios differ; check cropping or padding.", unknown:"Custom model: generic sizes only; check its documentation or a proven workflow.", basis:"Starting point from the selected local image profile, not a guaranteed model limit.", customBasis:"Your size overrides the suggestion; confirm it in your image workflow.", invalid:"Use whole-number dimensions from 256 to 4096, divisible by 32.", warning:"Possible trade-offs — advice only:" },
  HU: { mode:"Képből kép", title:"Gondoljuk tovább ezt a képet", intro:"A fenti kép lesz a vizuális kiindulópont. Írd le, mi maradjon meg és mi változzon; minden javaslat átírható.", keep:"Mi maradjon meg?", keepPlaceholder:"Például: a nő póza, a szék és a teljes alakos képkivágás.", change:"Mi változzon?", changePlaceholder:"Például: kerüljön a jelenet mexikói naplementébe.", model:"Képmodell / workflow", priority:"Felbontási irány", safe:"Takarékos", balanced:"Kiegyensúlyozott", detail:"Részletesebb", customModel:"Egyedi modell neve", customPlaceholder:"Opcionális; modellfájlt nem tölt le", sourceNote:"Bármely nyelven írhatsz. A helyi képelemző szerkeszthető angol képpromptokat javasol. Itt nem indul képgenerálás.", suggest:"Három képötlet javaslata", result:"Képterv", resolution:"Javasolt generálási felbontás", lighter:"Takarékosabb lehetőség", override:"Saját felbontást használok", width:"Szélesség", height:"Magasság", three:"Válassz irányt", prompt:"Szerkeszthető angol képprompt", promptPlaceholder:"Válassz javaslatot, majd szabadon írd át.", copy:"Prompt másolása", download:"TXT letöltése", disclaimer:"A promptok és méretek kiindulási javaslatok. Ugyanezt a képet add meg a képből-kép workflow-ban; az oldal nem generál képet.", chooseImage:"Előbb húzz be fent egy kiindulóképet.", ready:"Készen áll a helyi képszerkesztési ötletekre.", working:"A kép helyi elemzése folyamatban…", missing:"A helyi Ollama nem érhető el. Indítsd a Prompt Studiót a helyi indítóval.", modelMissing:"A helyi gemma3:4b képelemző modell hiányzik.", failed:"A helyi javaslat nem sikerült. Ellenőrizd az Ollamát, majd próbáld újra.", malformed:"A helyi modell nem adott három használható ötletet. Próbáld újra.", stale:"Változott a kép vagy a beállítás. Ha kell, kérj új javaslatot; a szerkesztett prompt megmarad.", copied:"Másolva", ratio:"A kezdőkép és a javasolt méret képaránya eltér; vágás vagy kitöltés lehet szükséges.", unknown:"Egyedi modell: csak általános méretjavaslat; ellenőrizd a leírását vagy egy bevált workflow-t.", basis:"A kiválasztott helyi képprofilból származó kiindulópont, nem garantált modellhatár.", customBasis:"A saját méreted felülírja a javaslatot; ellenőrizd a képgeneráló workflow-ban.", invalid:"256–4096 közötti, 32-vel osztható egész méreteket adj meg.", warning:"Lehetséges kompromisszumok – csak tanács:" },
  DE: {mode:"Bild → Bild",title:"Dieses Bild weiterdenken",intro:"Bild oben als Vorlage verwenden. Beschreiben Sie, was bleiben und was sich ändern soll.",keep:"Was soll bleiben?",change:"Was soll sich ändern?",model:"Bildmodell / Workflow",priority:"Auflösungsziel",safe:"Sparsam",balanced:"Ausgewogen",detail:"Mehr Details",customModel:"Eigener Modellname",sourceNote:"Beliebige Eingabesprache; das lokale Modell erstellt bearbeitbare englische Prompts. Keine Bildgenerierung.",suggest:"Drei Bildideen vorschlagen",result:"Ihr Bildplan",resolution:"Empfohlene Auflösung",lighter:"Kleinere Variante",override:"Eigene Auflösung",width:"Breite",height:"Höhe",three:"Richtung auswählen",prompt:"Bearbeitbarer englischer Bildprompt",copy:"Prompt kopieren",download:"TXT herunterladen",disclaimer:"Nur Vorschläge. Dasselbe Ausgangsbild im Bild-zu-Bild-Workflow verwenden.",chooseImage:"Zuerst ein Bild oben ablegen.",working:"Lokale Bildanalyse…",missing:"Lokales Ollama nicht erreichbar.",modelMissing:"gemma3:4b fehlt.",failed:"Vorschlag fehlgeschlagen.",malformed:"Keine drei brauchbaren Ideen erhalten.",stale:"Bild oder Einstellungen geändert; Vorschläge bei Bedarf erneuern.",copied:"Kopiert",ratio:"Bildformat weicht ab; Zuschnitt prüfen.",unknown:"Unbekanntes Modell: allgemeine Größe; Dokumentation prüfen.",basis:"Aus lokalem Bildprofil, keine garantierte Modellgrenze.",customBasis:"Eigene Größe überschreibt die Empfehlung.",invalid:"Ganzzahlen 256–4096, durch 32 teilbar.",warning:"Mögliche Kompromisse:"},
  FR: {mode:"Image → image",title:"Réinventer cette image",intro:"Utilisez l’image comme référence. Dites ce qui doit rester et ce qui doit changer.",keep:"Que conserver ?",change:"Que modifier ?",model:"Modèle d’image / workflow",priority:"Priorité de résolution",safe:"Économe",balanced:"Équilibrée",detail:"Plus de détails",customModel:"Nom du modèle personnalisé",sourceNote:"Écrivez dans votre langue ; le modèle local propose des prompts anglais modifiables. Aucune image n’est générée.",suggest:"Proposer trois idées d’image",result:"Votre plan d’image",resolution:"Résolution suggérée",lighter:"Option plus légère",override:"Utiliser ma résolution",width:"Largeur",height:"Hauteur",three:"Choisir une direction",prompt:"Prompt anglais modifiable",copy:"Copier",download:"Télécharger TXT",disclaimer:"Suggestions uniquement ; utilisez la même image dans votre workflow image-à-image.",chooseImage:"Déposez d’abord une image.",working:"Analyse locale…",missing:"Ollama local indisponible.",modelMissing:"gemma3:4b absent.",failed:"Échec de la suggestion.",malformed:"Trois idées utilisables non reçues.",stale:"Image ou réglages modifiés ; actualisez au besoin.",copied:"Copié",ratio:"Le format diffère ; vérifiez le recadrage.",unknown:"Modèle inconnu : dimensions génériques.",basis:"Profil d’image local, pas une limite garantie.",customBasis:"Votre taille remplace la suggestion.",invalid:"Entiers 256–4096, multiples de 32.",warning:"Compromis possibles :"},
  ES: {mode:"Imagen → imagen",title:"Reimaginar esta imagen",intro:"Usa la imagen como referencia. Describe qué conservar y qué cambiar.",keep:"¿Qué se conserva?",change:"¿Qué cambia?",model:"Modelo de imagen / workflow",priority:"Prioridad de resolución",safe:"Económica",balanced:"Equilibrada",detail:"Más detalle",customModel:"Nombre del modelo",sourceNote:"Escribe en tu idioma; el modelo local propone prompts editables en inglés. No se genera ninguna imagen.",suggest:"Sugerir tres ideas de imagen",result:"Tu plan de imagen",resolution:"Resolución sugerida",lighter:"Opción ligera",override:"Usar mi resolución",width:"Ancho",height:"Alto",three:"Elige una dirección",prompt:"Prompt inglés editable",copy:"Copiar",download:"Descargar TXT",disclaimer:"Solo sugerencias; usa la misma imagen en el workflow imagen-a-imagen.",chooseImage:"Primero suelta una imagen.",working:"Análisis local…",missing:"Ollama local no disponible.",modelMissing:"Falta gemma3:4b.",failed:"No se pudo generar la sugerencia.",malformed:"No se recibieron tres ideas válidas.",stale:"Cambiaron la imagen o los ajustes; actualiza si hace falta.",copied:"Copiado",ratio:"Relación de aspecto diferente; comprueba el recorte.",unknown:"Modelo desconocido: tamaño genérico.",basis:"Perfil local, no límite garantizado.",customBasis:"Tu tamaño sustituye la sugerencia.",invalid:"Enteros 256–4096 divisibles por 32.",warning:"Posibles compromisos:"},
  IT: {mode:"Immagine → immagine",title:"Reimmagina questa immagine",intro:"Usa l’immagine come riferimento. Scrivi cosa mantenere e cosa cambiare.",keep:"Cosa mantenere?",change:"Cosa cambiare?",model:"Modello immagine / workflow",priority:"Priorità risoluzione",safe:"Leggera",balanced:"Bilanciata",detail:"Più dettagli",customModel:"Nome modello personalizzato",sourceNote:"Scrivi nella tua lingua; il modello locale propone prompt inglesi modificabili. Nessuna generazione.",suggest:"Suggerisci tre idee",result:"Il tuo piano",resolution:"Risoluzione suggerita",lighter:"Opzione più leggera",override:"Usa la mia risoluzione",width:"Larghezza",height:"Altezza",three:"Scegli una direzione",prompt:"Prompt inglese modificabile",copy:"Copia",download:"Scarica TXT",disclaimer:"Solo suggerimenti; usa la stessa immagine nel workflow immagine-a-immagine.",chooseImage:"Prima carica un’immagine.",working:"Analisi locale…",missing:"Ollama locale non disponibile.",modelMissing:"gemma3:4b non installato.",failed:"Suggerimento non riuscito.",malformed:"Non sono arrivate tre idee valide.",stale:"Immagine o impostazioni cambiate; aggiorna se necessario.",copied:"Copiato",ratio:"Formato diverso; controlla il ritaglio.",unknown:"Modello sconosciuto: dimensioni generiche.",basis:"Da profilo locale, non limite garantito.",customBasis:"La tua misura sostituisce il suggerimento.",invalid:"Interi 256–4096 divisibili per 32.",warning:"Possibili compromessi:"},
  PT: {mode:"Imagem → imagem",title:"Reimaginar esta imagem",intro:"Use a imagem como referência. Descreva o que manter e alterar.",keep:"O que manter?",change:"O que alterar?",model:"Modelo de imagem / workflow",priority:"Prioridade de resolução",safe:"Económica",balanced:"Equilibrada",detail:"Mais detalhe",customModel:"Nome do modelo",sourceNote:"Escreva na sua língua; o modelo local propõe prompts ingleses editáveis. Não gera imagens.",suggest:"Sugerir três ideias",result:"O seu plano",resolution:"Resolução sugerida",lighter:"Opção leve",override:"Usar a minha resolução",width:"Largura",height:"Altura",three:"Escolha uma direção",prompt:"Prompt inglês editável",copy:"Copiar",download:"Transferir TXT",disclaimer:"Apenas sugestões; use a mesma imagem no workflow imagem-para-imagem.",chooseImage:"Primeiro arraste uma imagem.",working:"Análise local…",missing:"Ollama local indisponível.",modelMissing:"gemma3:4b não instalado.",failed:"Falha na sugestão.",malformed:"Não foram recebidas três ideias válidas.",stale:"Imagem ou definições alteradas; atualize se necessário.",copied:"Copiado",ratio:"Formato diferente; confirme o corte.",unknown:"Modelo desconhecido: tamanho genérico.",basis:"Perfil local, não limite garantido.",customBasis:"O tamanho manual substitui a sugestão.",invalid:"Inteiros 256–4096 divisíveis por 32.",warning:"Possíveis compromissos:"},
  PL: {mode:"Obraz → obraz",title:"Przemyśl ten obraz na nowo",intro:"Użyj obrazu jako odniesienia. Opisz, co zachować i co zmienić.",keep:"Co zachować?",change:"Co zmienić?",model:"Model obrazu / workflow",priority:"Priorytet rozdzielczości",safe:"Oszczędny",balanced:"Zrównoważony",detail:"Więcej szczegółów",customModel:"Nazwa własnego modelu",sourceNote:"Pisz w swoim języku; model lokalny proponuje edytowalne angielskie prompty. Bez generowania obrazu.",suggest:"Zaproponuj trzy pomysły",result:"Plan obrazu",resolution:"Sugerowana rozdzielczość",lighter:"Lżejsza opcja",override:"Własna rozdzielczość",width:"Szerokość",height:"Wysokość",three:"Wybierz kierunek",prompt:"Edytowalny angielski prompt",copy:"Kopiuj",download:"Pobierz TXT",disclaimer:"Tylko propozycje; użyj tego samego obrazu w workflow obraz-do-obrazu.",chooseImage:"Najpierw dodaj obraz.",working:"Analiza lokalna…",missing:"Lokalna Ollama niedostępna.",modelMissing:"Brak gemma3:4b.",failed:"Nie udało się utworzyć propozycji.",malformed:"Nie otrzymano trzech poprawnych pomysłów.",stale:"Zmieniono obraz lub ustawienia; odśwież w razie potrzeby.",copied:"Skopiowano",ratio:"Proporcje różnią się; sprawdź kadrowanie.",unknown:"Nieznany model: ogólna rozdzielczość.",basis:"Na podstawie profilu lokalnego, nie gwarantowany limit.",customBasis:"Własny rozmiar zastępuje sugestię.",invalid:"Liczby 256–4096 podzielne przez 32.",warning:"Możliwe kompromisy:"}
};

const languageNames = { HU:"Hungarian", EN:"English", DE:"German", FR:"French", ES:"Spanish", IT:"Italian", PT:"Portuguese", PL:"Polish" };
const bilingualPromptLabels = { EN:"Editable multilingual image-edit prompt", HU:"Szerkeszthető többnyelvű képprompt", DE:"Bearbeitbarer mehrsprachiger Bildprompt", FR:"Prompt image multilingue modifiable", ES:"Prompt de imagen multilingüe editable", IT:"Prompt immagine multilingue modificabile", PT:"Prompt de imagem multilingue editável", PL:"Edytowalny wielojęzyczny prompt obrazu" };
const el = (id) => document.getElementById(id);

export function attachImageToImage({ getImage, imageBase64, getLanguage }) {
  const model = el("i2i-model"), priority = el("i2i-priority"), customModel = el("i2i-custom-model");
  const keep = el("i2i-keep"), change = el("i2i-change"), prompt = el("i2i-prompt");
  const promptEditor = attachBilingualPromptEditor({ field:prompt, getLanguage });
  const override = el("i2i-override-check"), width = el("i2i-width"), height = el("i2i-height");
  const status = el("i2i-status"), suggestButton = el("i2i-suggest");
  let dimensions = null, currentFile = null, aiWarnings = [], active = false, busy = false, revision = 0;
  const t = () => ({ ...copy.EN, ...(copy[getLanguage()] || {}) });
  const direction = () => ({
    ...Object.fromEntries(["shot", "angle", "lens", "medium", "capture"].map((key) => [key, el(`i2i-${key}`).value])),
    cameraModel:el("i2i-camera-model").value,
    production:el("i2i-production").value
  });

  function translate() {
    const customBefore = captureCustomSelections(customIds);
    const strings = t();
    document.querySelectorAll("[data-i2i]").forEach((item) => { item.textContent = strings[item.dataset.i2i] || ""; });
    document.querySelector('[data-i2i="prompt"]').textContent = bilingualPromptLabels[getLanguage()] || bilingualPromptLabels.EN;
    document.querySelectorAll("[data-i2i-placeholder]").forEach((item) => { item.placeholder = strings[item.dataset.i2iPlaceholder] || ""; });
    renderImageDirectionSelectors("i2i", getLanguage());
    renderProductionSelectors("i2i", getLanguage());
    renderQualityPrefixSelector("i2i", getLanguage());
    refreshCustomOptions(customIds, customBefore);
    renderPhotoPresetSelectors("i2i", getLanguage());
    renderArtPresetSelector("i2i", getLanguage());
    promptEditor.translateUi();
    updateRecommendation();
  }

  function renderWarnings(recommendation) {
    const warnings = [];
    if (recommendation.ratioWarning) warnings.push(t().ratio);
    if (recommendation.unknownModel) warnings.push(t().unknown);
    warnings.push(...aiWarnings);
    const box = el("i2i-warning");
    box.hidden = warnings.length === 0;
    box.replaceChildren();
    if (!warnings.length) return;
    const heading = document.createElement("strong"); heading.textContent = t().warning;
    const list = document.createElement("ul");
    for (const warning of warnings) { const item = document.createElement("li"); item.textContent = warning; list.appendChild(item); }
    box.append(heading, list);
  }

  function updateRecommendation() {
    const recommendation = recommendImageEditResolution({ model: model.value, width: dimensions?.width, height: dimensions?.height, priority: priority.value });
    const manual = override.checked;
    el("i2i-override-fields").hidden = !manual;
    if (!manual) { width.value = recommendation.width; height.value = recommendation.height; }
    const valid = !manual || validImageEditResolution(width.value, height.value);
    const chosenWidth = manual && valid ? Number(width.value) : recommendation.width;
    const chosenHeight = manual && valid ? Number(height.value) : recommendation.height;
    el("i2i-resolution-value").textContent = `${chosenWidth} × ${chosenHeight}`;
    el("i2i-resolution-reason").textContent = `${recommendation.profile} · ${manual && valid ? t().customBasis : t().basis} ${recommendation.note}`;
    el("i2i-lighter").textContent = recommendation.lighter.join(" × ");
    el("i2i-override-status").textContent = manual && !valid ? t().invalid : "";
    renderWarnings(recommendation);
    return recommendation;
  }

  function markStale() {
    revision++;
    if (prompt.value.trim() || !el("i2i-suggestions").hidden) status.textContent = t().stale;
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
      el("i2i-options").replaceChildren();
      el("i2i-suggestions").hidden = true;
      status.textContent = file ? t().ready : t().chooseImage;
    }
    if (size?.width > 0 && size?.height > 0) dimensions = size;
    suggestButton.disabled = !file || busy;
    updateRecommendation();
  }

  function renderSuggestions(result, visualPlan, opening) {
    const target = el("i2i-options"); target.replaceChildren();
    for (const [index, suggestion] of result.suggestions.entries()) {
      const button = document.createElement("button"); button.type = "button"; button.className = "i2v-option";
      const title = document.createElement("strong"); title.textContent = `${index + 1}. ${suggestion.title}`;
      const reason = document.createElement("small"); reason.textContent = suggestion.reason;
      button.append(title, reason);
      button.addEventListener("click", () => {
        target.querySelectorAll("button").forEach((item) => item.classList.remove("selected"));
        button.classList.add("selected");
        const body = visualPlan ? `${suggestion.prompt}\nVisual direction: ${visualPlan}.` : suggestion.prompt;
        promptEditor.setPrompt(opening ? `${opening}.\n${body}` : body, "EN");
      });
      target.appendChild(button);
    }
    el("i2i-suggestions").hidden = false;
    target.firstElementChild?.click();
  }

  async function suggest() {
    const file = getImage();
    if (!file) { status.textContent = t().chooseImage; return; }
    if (busy) return;
    const requestRevision = revision;
    busy = true; suggestButton.disabled = true; status.textContent = t().working;
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
      const profile = imageEditProfiles[model.value] || imageEditProfiles.other;
      const visualPlan = [imageDirectionPlan(direction(), "EN"), productionPlan(direction(), "EN"), customSelectionPlan(customIds.filter((id) => id !== "i2i-quality-prefix"), "EN")].filter(Boolean).join("; ");
      const opening = imageOpening({
        qualityPrefix:el("i2i-quality-prefix").value,
        customQuality:customChoiceText("i2i-quality-prefix", "EN"),
        photoGenre:el("i2i-photo-genre").value,
        photoLight:el("i2i-photo-light").value,
        artStyle:el("i2i-art-style").value,
        medium:el("i2i-medium").value
      }, "EN");
      const guidance = `You are planning an image-to-image edit. The attached image is the user's reference, not a request to identify anyone. Understand the user's instructions in any language, but write all image-edit prompts in English. Keep: ${keep.value.trim() || "preserve recognizable main subjects, composition, and identity"}. Change: ${change.value.trim() || "suggest tasteful visual variations while staying recognizable"}. Selected image model/workflow: ${profile.label}${model.value === "other" ? ` (${customModel.value.trim() || "unspecified"})` : ""}. User-selected visual direction: ${visualPlan || "no extra constraints"}. Optional opening phrase: ${opening || "none"}. Treat any camera or lens choice as a visual effect if the medium is painting, poster or graphic art. Describe only visible content; do not invent the original prompt. Offer exactly three feasible directions: (1) faithful minimal edit, (2) balanced reinterpretation, (3) bolder but still recognizable reinterpretation. Each suggestion must have a concise title, a one-sentence reason in ${languageNames[getLanguage()] || "English"}, and a complete practical English image-to-image prompt that clearly says to use the supplied image as reference, identifies what to preserve, and specifies the changes without contradicting the selected visual direction. The visual direction and optional opening will be appended to each prompt, so do not repeat them verbatim. If the requested reframing needs content missing from the source image (such as feet in a full-body shot), note that the model must plausibly extend the image and add a short non-blocking warning. Add up to three short non-blocking warnings in ${languageNames[getLanguage()] || "English"} for other likely conflicts. Do not claim a precise denoise strength or guaranteed model compatibility. Return ONLY valid JSON: {"imageSummary":"...","warnings":[],"suggestions":[{"title":"...","reason":"...","prompt":"..."}, ... exactly three]}.`;
      const response = await fetch(base + "/api/chat", { method:"POST", headers:{ "Content-Type":"application/json" }, signal:controller.signal,
        body:JSON.stringify({ model:vision.name, stream:false, format:"json", options:{ temperature:0.35, num_predict:2400 }, messages:[{ role:"user", content:guidance, images:[image] }] }) });
      if (!response.ok) throw new Error("chat");
      const result = parseImageEditSuggestions((await response.json()).message?.content);
      if (requestRevision !== revision || file !== getImage()) return;
      if (!result) { status.textContent = t().malformed; return; }
      aiWarnings = result.warnings;
      renderSuggestions(result, visualPlan, opening); updateRecommendation();
      status.textContent = result.imageSummary || t().ready;
      if (active) el("i2i-result").scrollIntoView({ behavior:"smooth", block:"start" });
    } catch (error) {
      if (requestRevision === revision) status.textContent = error instanceof TypeError ? t().missing : t().failed;
    } finally {
      clearTimeout(timeout); busy = false; suggestButton.disabled = !getImage();
    }
  }

  async function copyPrompt() {
    if (!prompt.value.trim()) return;
    const text=creativePromptFor("i2i",prompt.value,promptEditor.getLanguage());
    let copied=false;
    try { await navigator.clipboard.writeText(text); copied=true; }
    catch {
      const buffer=document.createElement("textarea");buffer.value=text;buffer.style.position="fixed";buffer.style.opacity="0";document.body.append(buffer);buffer.select();
      try { copied=document.execCommand("copy"); } finally { buffer.remove(); }
    }
    if(!copied)return;
    const button=el("i2i-copy");button.textContent=t().copied;
    setTimeout(()=>{button.textContent=t().copy;},1500);
  }

  function downloadPrompt() {
    if (!prompt.value.trim()) return;
    if (override.checked && !validImageEditResolution(width.value, height.value)) { el("i2i-override-status").textContent = t().invalid; return; }
    const label = model.value === "other" ? (customModel.value.trim() || imageEditProfiles.other.label) : imageEditProfiles[model.value].label;
    const note = `Model/workflow: ${label}\nSuggested or chosen resolution: ${width.value} × ${height.value}\nReference image: ${getImage()?.name || ""}\nPrompt language: ${promptEditor.getLanguage()}\n\n`;
    const link = document.createElement("a");
    const url = URL.createObjectURL(new Blob([note + creativePromptFor("i2i",prompt.value.trim(),promptEditor.getLanguage()) + "\n"], { type:"text/plain;charset=utf-8" }));
    link.href = url; link.download = "ArtofTomworks_image_to_image_prompt.txt";
    document.body.appendChild(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  for (const input of [model, priority]) input.addEventListener("change", markStale);
  for (const key of ["shot", "angle", "lens", "medium", "camera-model", "production", "quality-prefix"]) el(`i2i-${key}`).addEventListener("change", () => {
    if (key === "medium") renderArtPresetSelector("i2i", getLanguage());
    if (["medium", "quality-prefix"].includes(key)) {
      syncPhotoPresetControls("i2i", getLanguage());
      syncArtPresetControls("i2i", getLanguage());
    }
    markStale();
  });
  for (const key of ["genre", "light"]) el(`i2i-photo-${key}`).addEventListener("change", markStale);
  el("i2i-art-style").addEventListener("change", markStale);
  el("i2i-capture").addEventListener("change", () => { const selected = el("i2i-camera-model").value; renderCameraProfileSelector("i2i", getLanguage()); refreshCustomOptions(["i2i-camera-model"], { "i2i-camera-model":selected }); markStale(); });
  model.addEventListener("change", () => { customModel.disabled = model.value !== "other"; updateRecommendation(); });
  for (const input of [keep, change, customModel]) input.addEventListener("input", markStale);
  override.addEventListener("change", updateRecommendation);
  width.addEventListener("input", updateRecommendation); height.addEventListener("input", updateRecommendation);
  suggestButton.addEventListener("click", () => { void suggest(); });
  el("i2i-copy").addEventListener("click", () => { void copyPrompt(); });
  el("i2i-download").addEventListener("click", downloadPrompt);

  updateRecommendation();
  return { translate, setImage, setMode: (value) => { active = value; if (active) updateRecommendation(); }, updateRecommendation,
    getText: () => promptEditor.getText(), getLanguage: () => promptEditor.getLanguage(),
    setPrompt: (text, language) => promptEditor.setPrompt(text, language),
    clearPrompt: () => promptEditor.clearCurrent(), resetPrompt: () => promptEditor.clear(),
    clearSuggestions: () => { revision++; aiWarnings = []; el("i2i-suggestions").hidden = true; el("i2i-options").replaceChildren(); status.textContent = ""; updateRecommendation(); } };
}
