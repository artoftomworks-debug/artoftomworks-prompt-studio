import { videoFileName, savePromptSample, loadPromptSample, removePromptSample, sampleFromImage, sampleFromVideo, imageDataUrl, blobFromImageDataUrl } from "./prompt-media.mjs";
export const promptLibraryStorageKey = "artoftomworks.promptStudio.promptLibrary.v1";
export const promptLibraryLimit = 150;
const modes = new Set(["image", "video", "i2i", "i2v"]);
const languages = new Set(["EN", "HU", "DE", "FR", "ES", "IT", "PT", "PL"]);
const clean = (value, limit) => String(value ?? "").trim().slice(0, limit);

export function normalizePromptEntries(raw) {
  if (!Array.isArray(raw)) return [];
  const found = new Set(), result = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const prompt = String(item.prompt ?? "").trim();
    const title = clean(item.title, 120);
    const category = clean(item.category, 60);
    if (!prompt || prompt.length > 50000 || !title || !category || !modes.has(item.mode)) continue;
    const id = clean(item.id, 80) || `${Date.now()}-${result.length}`;
    if (found.has(id)) continue;
    found.add(id);
    const tags = Array.isArray(item.tags) ? item.tags : String(item.tags || "").split(",");
    result.push({
      id, title, category, prompt, negative:clean(item.negative, 50000), mode:item.mode,
      language:languages.has(item.language) ? item.language : "EN",
      tags:[...new Set(tags.map((tag) => clean(tag, 35)).filter(Boolean))].slice(0, 12),
      notes:clean(item.notes, 500), model:clean(item.model, 120),
      videoName:videoFileName(item.videoName), sampleImageName:videoFileName(item.sampleImageName),
      createdAt:Number.isFinite(Date.parse(item.createdAt)) ? item.createdAt : new Date().toISOString()
    });
    if (result.length >= promptLibraryLimit) break;
  }
  return result;
}

export function filterPromptEntries(entries, query, category = "", mode = "") {
  const q = clean(query, 150).toLocaleLowerCase();
  return normalizePromptEntries(entries).filter((entry) =>
    (!category || entry.category === category) && (!mode || entry.mode === mode) &&
    (!q || [entry.title, entry.category, entry.tags.join(" "), entry.notes, entry.model, entry.videoName, entry.sampleImageName, entry.prompt, entry.negative]
      .join(" ").toLocaleLowerCase().includes(q)));
}

const copy = {
  EN:{title:"Saved prompts",intro:"Keep prompts that worked. Stored in this browser; export a JSON backup to keep them safe.",name:"Title",nameHint:"e.g. Sunset fashion portrait",category:"Topic / category",categoryHint:"e.g. Fashion, Animals, Fantasy",tags:"Tags",tagsHint:"comma-separated",notes:"Notes (optional)",notesHint:"What worked well?",save:"Save current prompt",search:"Search saved prompts",filter:"All categories",allModes:"All modes",empty:"No saved prompts yet.",open:"Load",remove:"Delete",export:"Export JSON backup",import:"Import JSON backup",needPrompt:"Write or generate a prompt first.",needMeta:"Add a title and a category.",tooLong:"This prompt exceeds the 50,000-character limit.",saved:"Prompt saved locally.",full:"The library is full (150 prompts).",storage:"Browser storage is full or unavailable. Export a backup, then free space.",loaded:"Saved prompt loaded for editing.",same:"This prompt is already saved under this title.",imported:"Backup imported; existing prompts were kept.",badFile:"This JSON backup could not be read.",confirmLoad:"Replace the current prompt with this saved one?",confirmDelete:"Delete this saved prompt?",modeImage:"Text → image",modeVideo:"Text → video",modeI2i:"Image → image",modeI2v:"Image → video",count:"saved"},
  HU:{title:"Bevált promptok",intro:"Tedd el, ami jól működött. Ebben a böngészőben tárolódik; készíts JSON-biztonsági mentést is.",name:"Cím",nameHint:"pl. Naplementés divatportré",category:"Téma / kategória",categoryHint:"pl. Divat, Állatok, Fantasy",tags:"Címkék",tagsHint:"vesszővel elválasztva",notes:"Jegyzet (opcionális)",notesHint:"Mi vált be benne?",save:"Aktuális prompt mentése",search:"Keresés a mentettekben",filter:"Összes kategória",allModes:"Összes mód",empty:"Még nincs mentett prompt.",open:"Betöltés",remove:"Törlés",export:"JSON biztonsági mentés",import:"JSON mentés betöltése",needPrompt:"Előbb írj vagy készíts promptot.",needMeta:"Adj címet és témát a promptnak.",tooLong:"A prompt hosszabb 50 000 karakternél, így nem menthető egyben.",saved:"A prompt helyben elmentve.",full:"Megtelt a gyűjtemény (150 prompt).",storage:"A böngésző tárhelye megtelt vagy nem elérhető. Mentsd ki a gyűjteményt, majd szabadíts fel helyet.",loaded:"A mentett prompt betöltve szerkesztésre.",same:"Ez a prompt ezzel a címmel már szerepel.",imported:"A mentés betöltve; a meglévő promptok megmaradtak.",badFile:"A JSON biztonsági mentés nem olvasható.",confirmLoad:"Lecseréljem az aktuális promptot erre a mentettre?",confirmDelete:"Töröljem ezt a mentett promptot?",modeImage:"Szöveg → kép",modeVideo:"Szöveg → videó",modeI2i:"Kép → kép",modeI2v:"Kép → videó",count:"mentett"},
  DE:{title:"Gespeicherte Prompts",intro:"Bewährte Prompts lokal sichern; JSON-Backup exportieren.",name:"Titel",category:"Thema / Kategorie",tags:"Tags",notes:"Notizen",save:"Aktuellen Prompt speichern",search:"Prompts suchen",filter:"Alle Kategorien",allModes:"Alle Modi",empty:"Noch keine Prompts.",open:"Laden",remove:"Löschen",export:"JSON-Backup",import:"JSON importieren",needPrompt:"Zuerst Prompt erstellen.",needMeta:"Titel und Kategorie eingeben.",saved:"Lokal gespeichert.",full:"150-Prompt-Limit erreicht.",storage:"Browserspeicher nicht verfügbar oder voll.",loaded:"Prompt zum Bearbeiten geladen.",same:"Bereits gespeichert.",imported:"Backup importiert; vorhandene Prompts bleiben.",badFile:"JSON nicht lesbar.",confirmLoad:"Aktuellen Prompt ersetzen?",confirmDelete:"Gespeicherten Prompt löschen?",count:"gespeichert"},
  FR:{title:"Prompts enregistrés",intro:"Conservez vos bons prompts ici et exportez une sauvegarde JSON.",name:"Titre",category:"Sujet / catégorie",tags:"Étiquettes",notes:"Notes",save:"Enregistrer le prompt",search:"Rechercher",filter:"Toutes les catégories",allModes:"Tous les modes",empty:"Aucun prompt enregistré.",open:"Charger",remove:"Supprimer",export:"Sauvegarde JSON",import:"Importer JSON",needPrompt:"Créez d'abord un prompt.",needMeta:"Ajoutez un titre et une catégorie.",saved:"Prompt enregistré localement.",full:"Limite de 150 prompts atteinte.",storage:"Stockage du navigateur indisponible ou plein.",loaded:"Prompt chargé pour modification.",same:"Déjà enregistré.",imported:"Sauvegarde importée sans remplacer les prompts existants.",badFile:"Fichier JSON illisible.",confirmLoad:"Remplacer le prompt actuel ?",confirmDelete:"Supprimer ce prompt ?",count:"enregistrés"},
  ES:{title:"Prompts guardados",intro:"Guarda los prompts que funcionaron y exporta una copia JSON.",name:"Título",category:"Tema / categoría",tags:"Etiquetas",notes:"Notas",save:"Guardar prompt actual",search:"Buscar",filter:"Todas las categorías",allModes:"Todos los modos",empty:"Aún no hay prompts.",open:"Cargar",remove:"Eliminar",export:"Copia JSON",import:"Importar JSON",needPrompt:"Primero crea un prompt.",needMeta:"Añade título y categoría.",saved:"Guardado localmente.",full:"Límite de 150 prompts.",storage:"Almacenamiento no disponible o lleno.",loaded:"Prompt cargado para editar.",same:"Ya está guardado.",imported:"Copia importada; se conservaron los prompts actuales.",badFile:"No se pudo leer el JSON.",confirmLoad:"¿Reemplazar el prompt actual?",confirmDelete:"¿Eliminar este prompt?",count:"guardados"},
  IT:{title:"Prompt salvati",intro:"Conserva i prompt riusciti ed esporta una copia JSON.",name:"Titolo",category:"Tema / categoria",tags:"Etichette",notes:"Note",save:"Salva il prompt",search:"Cerca",filter:"Tutte le categorie",allModes:"Tutte le modalità",empty:"Nessun prompt salvato.",open:"Carica",remove:"Elimina",export:"Backup JSON",import:"Importa JSON",needPrompt:"Prima crea un prompt.",needMeta:"Inserisci titolo e categoria.",saved:"Salvato localmente.",full:"Limite di 150 prompt raggiunto.",storage:"Memoria del browser piena o non disponibile.",loaded:"Prompt caricato per modificarlo.",same:"Già salvato.",imported:"Backup importato senza cancellare i prompt esistenti.",badFile:"JSON non leggibile.",confirmLoad:"Sostituire il prompt attuale?",confirmDelete:"Eliminare questo prompt?",count:"salvati"},
  PT:{title:"Prompts guardados",intro:"Guarde os prompts que resultaram e exporte uma cópia JSON.",name:"Título",category:"Tema / categoria",tags:"Etiquetas",notes:"Notas",save:"Guardar prompt atual",search:"Pesquisar",filter:"Todas as categorias",allModes:"Todos os modos",empty:"Ainda não há prompts.",open:"Carregar",remove:"Eliminar",export:"Cópia JSON",import:"Importar JSON",needPrompt:"Crie primeiro um prompt.",needMeta:"Adicione título e categoria.",saved:"Guardado localmente.",full:"Limite de 150 prompts.",storage:"Armazenamento do navegador indisponível ou cheio.",loaded:"Prompt carregado para edição.",same:"Já guardado.",imported:"Cópia importada sem apagar os prompts existentes.",badFile:"JSON ilegível.",confirmLoad:"Substituir o prompt atual?",confirmDelete:"Eliminar este prompt?",count:"guardados"},
  PL:{title:"Zapisane prompty",intro:"Zachowaj sprawdzone prompty i wyeksportuj kopię JSON.",name:"Tytuł",category:"Temat / kategoria",tags:"Tagi",notes:"Notatki",save:"Zapisz bieżący prompt",search:"Szukaj",filter:"Wszystkie kategorie",allModes:"Wszystkie tryby",empty:"Brak zapisanych promptów.",open:"Wczytaj",remove:"Usuń",export:"Kopia JSON",import:"Importuj JSON",needPrompt:"Najpierw utwórz prompt.",needMeta:"Dodaj tytuł i kategorię.",saved:"Zapisano lokalnie.",full:"Limit 150 promptów.",storage:"Pamięć przeglądarki niedostępna lub pełna.",loaded:"Wczytano prompt do edycji.",same:"Już zapisano.",imported:"Kopia wczytana; obecne prompty zachowano.",badFile:"Nie można odczytać JSON.",confirmLoad:"Zastąpić bieżący prompt?",confirmDelete:"Usunąć zapisany prompt?",count:"zapisanych"}
};
const mediaCopy = {
  EN:{videoName:"Video filename (optional)",videoHint:"e.g. my-video.mp4",chooseVideo:"Choose video · capture a sample frame",chooseImage:"Choose a separate sample image",sampleEmpty:"No sample image selected",sampleReady:"Sample image ready",videoReady:"Video name and sample frame ready.",videoNoFrame:"Video name added, but this video could not be decoded here. Choose a separate sample image.",imageBad:"Use a PNG, JPEG or WebP image under 50 MB.",imageStore:"Could not save the sample image in this browser; prompt was not saved.",missingImage:"A saved sample image is missing. Backup stopped to avoid losing it.",backupWorking:"Preparing backup with sample images…",mediaHelp:"The full video is not stored. Small sample images stay in this browser and are included in the JSON backup."},
  HU:{videoName:"Videó fájlneve (opcionális)",videoHint:"pl. videom.mp4",chooseVideo:"Videó kiválasztása · mintakép készítése",chooseImage:"Külön mintakép kiválasztása",sampleEmpty:"Még nincs mintakép",sampleReady:"A mintakép készen áll",videoReady:"A videó neve és a mintakép készen áll.",videoNoFrame:"A videó nevét átvettem, de ebből itt nem sikerült képkockát kiolvasni. Válassz külön mintaképet.",imageBad:"Legfeljebb 50 MB-os PNG, JPEG vagy WebP képet válassz.",imageStore:"A mintaképet nem sikerült ebben a böngészőben tárolni; a promptot sem mentettem.",missingImage:"Egy mentett mintakép hiányzik. A biztonsági mentést leállítottam, hogy ne vesszen el.",backupWorking:"Biztonsági mentés készül a mintaképekkel…",mediaHelp:"A teljes videót nem tárolja. A kis mintaképek a böngészőben maradnak, és a JSON-mentésbe is bekerülnek."},
  DE:{videoName:"Videodateiname (optional)",chooseVideo:"Video wählen · Vorschaubild erstellen",chooseImage:"Separates Vorschaubild wählen",sampleEmpty:"Kein Vorschaubild",sampleReady:"Vorschaubild bereit",videoReady:"Videoname und Vorschaubild bereit.",videoNoFrame:"Videoname gespeichert; bitte ein separates Vorschaubild wählen.",imageBad:"PNG, JPEG oder WebP bis 50 MB wählen.",imageStore:"Vorschaubild konnte nicht gespeichert werden; Prompt nicht gespeichert.",missingImage:"Ein Vorschaubild fehlt; Backup wurde angehalten.",backupWorking:"Backup mit Bildern wird vorbereitet…",mediaHelp:"Das Video selbst wird nicht gespeichert; kleine Vorschaubilder sind im JSON-Backup enthalten."},
  FR:{videoName:"Nom du fichier vidéo (facultatif)",chooseVideo:"Choisir une vidéo · extraire une image",chooseImage:"Choisir une image séparée",sampleEmpty:"Aucune image",sampleReady:"Image prête",videoReady:"Nom et image de la vidéo prêts.",videoNoFrame:"Nom ajouté; choisissez une image séparée.",imageBad:"Choisissez une image PNG, JPEG ou WebP de 50 Mo maximum.",imageStore:"Image non enregistrée; prompt non enregistré.",missingImage:"Une image manque; sauvegarde interrompue.",backupWorking:"Préparation de la sauvegarde avec images…",mediaHelp:"La vidéo complète n'est pas stockée; les petites images sont incluses dans la sauvegarde JSON."},
  ES:{videoName:"Nombre del vídeo (opcional)",chooseVideo:"Elegir vídeo · extraer imagen",chooseImage:"Elegir imagen aparte",sampleEmpty:"Sin imagen",sampleReady:"Imagen lista",videoReady:"Nombre e imagen del vídeo listos.",videoNoFrame:"Nombre añadido; elige una imagen aparte.",imageBad:"Usa PNG, JPEG o WebP de hasta 50 MB.",imageStore:"No se pudo guardar la imagen; el prompt no se guardó.",missingImage:"Falta una imagen; copia detenida.",backupWorking:"Preparando copia con imágenes…",mediaHelp:"No se guarda el vídeo completo; las imágenes pequeñas se incluyen en la copia JSON."},
  IT:{videoName:"Nome del video (facoltativo)",chooseVideo:"Scegli video · crea anteprima",chooseImage:"Scegli immagine separata",sampleEmpty:"Nessuna anteprima",sampleReady:"Anteprima pronta",videoReady:"Nome e anteprima del video pronti.",videoNoFrame:"Nome aggiunto; scegli un'immagine separata.",imageBad:"Usa PNG, JPEG o WebP fino a 50 MB.",imageStore:"Immagine non salvata; prompt non salvato.",missingImage:"Manca un'immagine; backup interrotto.",backupWorking:"Preparazione backup con immagini…",mediaHelp:"Il video completo non viene salvato; le piccole anteprime sono incluse nel backup JSON."},
  PT:{videoName:"Nome do vídeo (opcional)",chooseVideo:"Escolher vídeo · criar imagem",chooseImage:"Escolher imagem separada",sampleEmpty:"Sem imagem",sampleReady:"Imagem pronta",videoReady:"Nome e imagem do vídeo prontos.",videoNoFrame:"Nome adicionado; escolha uma imagem separada.",imageBad:"Use PNG, JPEG ou WebP até 50 MB.",imageStore:"Imagem não guardada; prompt não guardado.",missingImage:"Falta uma imagem; cópia interrompida.",backupWorking:"A preparar cópia com imagens…",mediaHelp:"O vídeo completo não é guardado; as imagens pequenas entram na cópia JSON."},
  PL:{videoName:"Nazwa pliku wideo (opcjonalnie)",chooseVideo:"Wybierz wideo · utwórz podgląd",chooseImage:"Wybierz osobny obraz",sampleEmpty:"Brak obrazu",sampleReady:"Obraz gotowy",videoReady:"Nazwa i podgląd wideo gotowe.",videoNoFrame:"Nazwa dodana; wybierz osobny obraz.",imageBad:"Wybierz PNG, JPEG lub WebP do 50 MB.",imageStore:"Nie zapisano obrazu ani promptu.",missingImage:"Brakuje obrazu; przerwano kopię.",backupWorking:"Przygotowywanie kopii z obrazami…",mediaHelp:"Pełne wideo nie jest zapisywane; małe obrazy trafiają do kopii JSON."}
};
const commonCategories = ["Portrait", "Fashion", "Nature", "Animals", "Architecture", "Fantasy", "Sci-fi", "Product", "Erotic", "Other"];
const modeLabels = { image:"modeImage", video:"modeVideo", i2i:"modeI2i", i2v:"modeI2v" };

export function attachPromptLibrary({ getLanguage, getCurrent, restore }) {
  const t = () => ({ ...copy.EN, ...mediaCopy.EN, ...(copy[getLanguage()] || {}), ...(mediaCopy[getLanguage()] || {}) });
  const host = document.querySelector(".result-column");
  const panel = document.createElement("section");
  panel.className = "prompt-library result-card";
  panel.innerHTML = `<div class="result-heading"><div><span class="eyebrow">LIBRARY / 01</span><h2 id="library-title"></h2></div><span class="result-spark">★</span></div>
    <div class="library-body"><p id="library-intro"></p><div class="library-form">
      <label><span id="library-name-label"></span><input id="library-name" maxlength="120" autocomplete="off"></label>
      <label><span id="library-category-label"></span><input id="library-category" maxlength="60" list="library-categories" autocomplete="off"><datalist id="library-categories"></datalist></label>
      <label><span id="library-tags-label"></span><input id="library-tags" maxlength="450" autocomplete="off"></label>
      <label><span id="library-notes-label"></span><input id="library-notes" maxlength="500" autocomplete="off"></label>
      <label><span id="library-video-name-label"></span><input id="library-video-name" maxlength="240" autocomplete="off"></label>
    </div><div class="library-media"><button type="button" id="library-video-choose" class="quiet-action"></button><input id="library-video-file" type="file" accept="video/*,.mp4,.webm,.mov,.mkv" hidden>
      <button type="button" id="library-image-choose" class="quiet-action"></button><input id="library-image-file" type="file" accept="image/png,image/jpeg,image/webp" hidden>
      <div id="library-sample-preview" class="library-sample-preview"><img id="library-sample-image" alt="" hidden><span id="library-sample-label"></span></div></div>
    <p id="library-media-help" class="library-media-help"></p><button type="button" id="library-save" class="secondary-action"></button>
    <div class="library-filter"><input id="library-search" type="search" maxlength="150"><select id="library-category-filter"></select><select id="library-mode-filter"></select></div>
    <div id="library-list" class="library-list"></div><div class="library-actions"><button type="button" id="library-export" class="quiet-action"></button><button type="button" id="library-import" class="quiet-action"></button><input id="library-file" type="file" accept=".json,application/json" hidden></div>
    <p id="library-status" role="status" aria-live="polite"></p></div>`;
  host.insertBefore(panel, host.querySelector(".side-tip"));
  const el = (id) => panel.querySelector(`#${id}`);
  const name = el("library-name"), category = el("library-category"), tags = el("library-tags"), notes = el("library-notes"), videoName = el("library-video-name");
  const search = el("library-search"), categoryFilter = el("library-category-filter"), modeFilter = el("library-mode-filter");
  const status = el("library-status"), list = el("library-list"), fileInput = el("library-file");
  const videoFileInput = el("library-video-file"), imageFileInput = el("library-image-file"), sampleImage = el("library-sample-image"), sampleLabel = el("library-sample-label");
  let pendingSample = null, pendingSampleName = "", pendingSampleUrl = "", pendingSampleSeparate = false, mediaBusy = false, saving = false;
  const sampleUrls = new Map();
  let entries;
  try { entries = normalizePromptEntries(JSON.parse(localStorage.getItem(promptLibraryStorageKey) || "[]")); }
  catch { entries = []; }
  const uid = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  function clearPendingSample() {
    if (pendingSampleUrl) URL.revokeObjectURL(pendingSampleUrl);
    pendingSample = null; pendingSampleName = ""; pendingSampleUrl = ""; pendingSampleSeparate = false;
    sampleImage.removeAttribute("src"); sampleImage.hidden = true;
    sampleLabel.textContent = t().sampleEmpty;
  }
  function showPendingSample(blob, filename, separate = false) {
    clearPendingSample();
    pendingSample = blob; pendingSampleName = videoFileName(filename); pendingSampleSeparate = separate;
    pendingSampleUrl = URL.createObjectURL(blob);
    sampleImage.src = pendingSampleUrl; sampleImage.hidden = false;
    sampleLabel.textContent = `${t().sampleReady} · ${pendingSampleName}`;
  }
  function setMediaBusy(value) {
    mediaBusy = value;
    el("library-save").disabled = value || saving;
    el("library-video-choose").disabled = value;
    el("library-image-choose").disabled = value;
  }
  async function acceptImage(file) {
    if (!file || mediaBusy || saving) return;
    setMediaBusy(true);
    try { showPendingSample(await sampleFromImage(file), file.name, true); status.textContent = t().sampleReady; }
    catch { status.textContent = t().imageBad; }
    finally { setMediaBusy(false); }
  }
  async function acceptVideo(file) {
    if (!file || mediaBusy || saving) return;
    setMediaBusy(true);
    videoName.value = videoFileName(file.name);
    if (pendingSampleSeparate) { status.textContent = t().videoReady; setMediaBusy(false); return; }
    clearPendingSample();
    try { showPendingSample(await sampleFromVideo(file), file.name); status.textContent = t().videoReady; }
    catch { status.textContent = t().videoNoFrame; }
    finally { setMediaBusy(false); }
  }
  async function sampleUrl(id) {
    if (sampleUrls.has(id)) return sampleUrls.get(id);
    const blob = await loadPromptSample(id);
    if (!blob) return "";
    const url = URL.createObjectURL(blob);
    sampleUrls.set(id, url);
    return url;
  }
  function commit(next) {
    try { localStorage.setItem(promptLibraryStorageKey, JSON.stringify(next)); entries = next; render(); return true; }
    catch { status.textContent = t().storage; return false; }
  }
  function translate() {
    for (const [id,key] of [["library-title","title"],["library-intro","intro"],["library-name-label","name"],["library-category-label","category"],["library-tags-label","tags"],["library-notes-label","notes"],["library-video-name-label","videoName"],["library-video-choose","chooseVideo"],["library-image-choose","chooseImage"],["library-media-help","mediaHelp"],["library-save","save"],["library-export","export"],["library-import","import"]]) el(id).textContent = t()[key];
    for (const [id,key] of [["library-name","nameHint"],["library-category","categoryHint"],["library-tags","tagsHint"],["library-notes","notesHint"],["library-video-name","videoHint"],["library-search","search"]]) el(id).placeholder = t()[key] || copy.EN[key];
    sampleLabel.textContent = pendingSample ? `${t().sampleReady} · ${pendingSampleName}` : t().sampleEmpty;
    const suggestions = el("library-categories"); suggestions.replaceChildren();
    for (const value of commonCategories) { const option = document.createElement("option"); option.value = value; suggestions.appendChild(option); }
    status.textContent = "";
    render();
  }
  function render() {
    const oldCategory = categoryFilter.value, oldMode = modeFilter.value;
    categoryFilter.replaceChildren(new Option(t().filter, ""));
    for (const value of [...new Set(entries.map((entry) => entry.category))].sort((a,b) => a.localeCompare(b))) categoryFilter.add(new Option(value, value));
    categoryFilter.value = oldCategory;
    modeFilter.replaceChildren(new Option(t().allModes, ""));
    for (const mode of modes) modeFilter.add(new Option(t()[modeLabels[mode]], mode));
    modeFilter.value = oldMode;
    list.replaceChildren();
    const shown = filterPromptEntries(entries, search.value, categoryFilter.value, modeFilter.value);
    if (!shown.length) { const empty = document.createElement("p"); empty.textContent = t().empty; list.appendChild(empty); }
    for (const entry of shown) {
      const row = document.createElement("article"); row.className = "library-item";
      const detail = document.createElement("div");
      const heading = document.createElement("strong"); heading.textContent = entry.title;
      const meta = document.createElement("small"); meta.textContent = `${entry.category} · ${t()[modeLabels[entry.mode]]} · ${entry.language}${entry.model ? ` · ${entry.model}` : ""}`;
      const tagLine = document.createElement("span"); tagLine.textContent = entry.tags.length ? entry.tags.map((tag) => `#${tag}`).join("  ") : "";
      detail.append(heading, meta, tagLine);
      if (entry.videoName) { const videoLine = document.createElement("span"); videoLine.textContent = `🎬 ${entry.videoName}`; detail.append(videoLine); }
      if (entry.sampleImageName) {
        const thumb = document.createElement("img"); thumb.className = "library-thumb"; thumb.alt = entry.sampleImageName; thumb.loading = "lazy";
        row.append(thumb);
        sampleUrl(entry.id).then((url) => { if (url && row.isConnected) thumb.src = url; }).catch(() => {});
      }
      const buttons = document.createElement("div"); buttons.className = "library-item-actions";
      const open = document.createElement("button"); open.type = "button"; open.textContent = t().open;
      open.addEventListener("click", () => {
        const current = getCurrent();
        if (current.prompt.trim() && current.prompt.trim() !== entry.prompt.trim() && !confirm(t().confirmLoad)) return;
        restore(entry); status.textContent = t().loaded;
      });
      const remove = document.createElement("button"); remove.type = "button"; remove.textContent = t().remove;
      remove.addEventListener("click", async () => { if (confirm(t().confirmDelete)) { const next = entries.filter((item) => item.id !== entry.id); if (commit(next)) { if (sampleUrls.has(entry.id)) URL.revokeObjectURL(sampleUrls.get(entry.id)); sampleUrls.delete(entry.id); try { await removePromptSample(entry.id); } catch {} status.textContent = ""; } } });
      buttons.append(open, remove); row.append(detail, buttons); list.appendChild(row);
    }
    panel.querySelector(".eyebrow").textContent = `${entries.length} ${t().count.toUpperCase()}`;
  }
  el("library-video-choose").addEventListener("click", () => videoFileInput.click());
  el("library-image-choose").addEventListener("click", () => imageFileInput.click());
  videoFileInput.addEventListener("change", async () => { const file = videoFileInput.files?.[0]; videoFileInput.value = ""; await acceptVideo(file); });
  imageFileInput.addEventListener("change", async () => { const file = imageFileInput.files?.[0]; imageFileInput.value = ""; await acceptImage(file); });
  el("library-sample-preview").addEventListener("dragover", (event) => event.preventDefault());
  el("library-sample-preview").addEventListener("drop", async (event) => {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (!file) return;
    if (file.type.startsWith("video/") || /\.(?:mp4|webm|mov|mkv)$/i.test(file.name)) await acceptVideo(file);
    else await acceptImage(file);
  });
  el("library-save").addEventListener("click", async () => {
    if (mediaBusy || saving) return;
    const current = getCurrent();
    if (!current.prompt.trim()) { status.textContent = t().needPrompt; return; }
    if (current.prompt.trim().length > 50000) { status.textContent = t().tooLong; return; }
    if (!name.value.trim() || !category.value.trim()) { status.textContent = t().needMeta; return; }
    if (entries.length >= promptLibraryLimit) { status.textContent = t().full; return; }
    if (entries.some((item) => item.title.toLocaleLowerCase() === name.value.trim().toLocaleLowerCase() && item.mode === current.mode && item.prompt === current.prompt.trim() && item.negative === clean(current.negative,50000) && item.videoName === videoFileName(videoName.value))) { status.textContent = t().same; return; }
    const candidate = normalizePromptEntries([{ id:uid(), title:name.value, category:category.value, tags:tags.value, notes:notes.value,
      videoName:videoName.value, sampleImageName:pendingSampleName,
      mode:current.mode, language:current.language, model:current.model, prompt:current.prompt, negative:current.negative, createdAt:new Date().toISOString() }])[0];
    if (!candidate) { status.textContent = t().needMeta; return; }
    saving = true; el("library-save").disabled = true;
    el("library-video-choose").disabled = true; el("library-image-choose").disabled = true;
    try {
      if (pendingSample) {
        try { await savePromptSample(candidate.id, pendingSample); }
        catch { status.textContent = t().imageStore; return; }
      }
      if (commit([candidate, ...entries])) { status.textContent = t().saved; name.value = ""; tags.value = ""; notes.value = ""; videoName.value = ""; clearPendingSample(); }
      else if (pendingSample) { try { await removePromptSample(candidate.id); } catch {} }
    } finally {
      saving = false; el("library-save").disabled = mediaBusy;
      el("library-video-choose").disabled = mediaBusy; el("library-image-choose").disabled = mediaBusy;
    }
  });
  for (const input of [search, categoryFilter, modeFilter]) input.addEventListener(input === search ? "input" : "change", render);
  el("library-export").addEventListener("click", async () => {
    status.textContent = t().backupWorking;
    try {
      const backupEntries = [];
      for (const entry of entries) {
        if (!entry.sampleImageName) { backupEntries.push(entry); continue; }
        const blob = await loadPromptSample(entry.id);
        if (!blob) throw new Error("missing-image");
        backupEntries.push({ ...entry, sampleImageDataUrl:await imageDataUrl(blob) });
      }
      const url = URL.createObjectURL(new Blob([JSON.stringify({ version:1, entries:backupEntries }, null, 2)], { type:"application/json" }));
      const link = document.createElement("a"); link.href = url; link.download = "ArtofTomworks_saved_prompts.json";
      document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
      status.textContent = "";
    } catch { status.textContent = t().missingImage; }
  });
  el("library-import").addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", async () => {
    const file = fileInput.files?.[0]; fileInput.value = "";
    if (!file || file.size > 100_000_000) { status.textContent = t().badFile; return; }
    try {
      const data = JSON.parse(await file.text());
      if (data?.version !== 1 || !Array.isArray(data?.entries)) throw new Error("format");
      const seen = new Set(entries.map((item) => `${item.mode}\u0000${item.title}\u0000${item.prompt}\u0000${item.negative}\u0000${item.videoName}`));
      const usedIds = new Set(entries.map((item) => item.id));
      const newEntries = [], images = [];
      for (const raw of data.entries) {
        const entry = normalizePromptEntries([raw])[0];
        if (!entry) throw new Error("entries");
        const key = `${entry.mode}\u0000${entry.title}\u0000${entry.prompt}\u0000${entry.negative}\u0000${entry.videoName}`;
        if (seen.has(key)) continue;
        seen.add(key);
        while (usedIds.has(entry.id)) entry.id = uid();
        usedIds.add(entry.id);
        if (entry.sampleImageName) {
          if (!raw.sampleImageDataUrl) throw new Error("missing-image");
          images.push({ id:entry.id, blob:await blobFromImageDataUrl(raw.sampleImageDataUrl) });
        }
        newEntries.push(entry);
        if (newEntries.length + entries.length >= promptLibraryLimit) break;
      }
      const savedIds = [];
      try {
        for (const image of images) { await savePromptSample(image.id, image.blob); savedIds.push(image.id); }
        if (!commit(normalizePromptEntries([...entries, ...newEntries]))) throw new Error("storage");
      } catch (error) {
        for (const id of savedIds) { try { await removePromptSample(id); } catch {} }
        throw error;
      }
      status.textContent = t().imported;
    } catch { status.textContent = t().badFile; }
  });
  document.getElementById("ui-language")?.addEventListener("change", translate);
  globalThis.addEventListener?.("storage", (event) => {
    if (event.key !== promptLibraryStorageKey) return;
    try { entries = normalizePromptEntries(JSON.parse(event.newValue || "[]")); render(); } catch {}
  });
  translate();
  return { count:() => entries.length, refresh:render };
}
