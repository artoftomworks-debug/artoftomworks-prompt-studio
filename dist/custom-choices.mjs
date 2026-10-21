const storageKey = "artoftomworks.promptStudio.customChoices.v1";
export const customChoiceGroups = {
  "style":"style", "lighting":"lighting", "mood":"mood", "camera":"cameraMotion",
  "still-shot":"shot", "i2i-shot":"shot", "still-angle":"angle", "i2i-angle":"angle",
  "still-lens":"lens", "i2i-lens":"lens", "still-medium":"medium", "i2i-medium":"medium",
  "still-camera-model":"cameraModel", "i2i-camera-model":"cameraModel",
  "still-production":"production", "i2i-production":"production", "video-production":"production", "i2v-production":"production",
  "video-device":"device", "i2v-device":"device", "video-stability":"stability", "i2v-stability":"stability",
  "i2v-camera":"cameraMotion", "still-quality-prefix":"qualityPrefix", "video-quality-prefix":"qualityPrefix",
  "i2i-quality-prefix":"qualityPrefix", "i2v-quality-prefix":"qualityPrefix"
};

const customCopy = {
  HU:{ add:"+ Saját", remove:"Törlés", save:"Mentés", cancel:"Mégse", placeholder:"Új választás szövege", empty:"Írj be egy választást.", confirm:"Törlöd ezt a saját választást?", backup:"Saját választásaid ebben a böngészőben maradnak. Másik géphez készíts mentést.", export:"Választások mentése", import:"Mentés betöltése", imported:"A saját választások betöltve.", invalid:"Ez nem érvényes választásmentés." },
  EN:{ add:"+ My option", remove:"Delete", save:"Save", cancel:"Cancel", placeholder:"New option text", empty:"Enter an option.", confirm:"Delete this saved option?", backup:"Your choices stay in this browser. Export a backup for another computer.", export:"Export choices", import:"Import backup", imported:"Custom choices imported.", invalid:"This is not a valid choices backup." },
  DE:{ add:"+ Eigene", remove:"Löschen", save:"Speichern", cancel:"Abbrechen", placeholder:"Neue Option", empty:"Option eingeben.", confirm:"Diese eigene Option löschen?" },
  FR:{ add:"+ Personnalisé", remove:"Supprimer", save:"Enregistrer", cancel:"Annuler", placeholder:"Nouvelle option", empty:"Saisissez une option.", confirm:"Supprimer cette option ?" },
  ES:{ add:"+ Propia", remove:"Eliminar", save:"Guardar", cancel:"Cancelar", placeholder:"Nueva opción", empty:"Escribe una opción.", confirm:"¿Eliminar esta opción?" },
  IT:{ add:"+ Personale", remove:"Elimina", save:"Salva", cancel:"Annulla", placeholder:"Nuova opzione", empty:"Inserisci un'opzione.", confirm:"Eliminare questa opzione?" },
  PT:{ add:"+ Minha opção", remove:"Apagar", save:"Guardar", cancel:"Cancelar", placeholder:"Nova opção", empty:"Introduz uma opção.", confirm:"Apagar esta opção?" },
  PL:{ add:"+ Własna", remove:"Usuń", save:"Zapisz", cancel:"Anuluj", placeholder:"Nowa opcja", empty:"Wpisz opcję.", confirm:"Usunąć tę opcję?" }
};

function readLibrary() {
  try {
    const value = JSON.parse(localStorage.getItem(storageKey) || "{}");
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  } catch { return {}; }
}
function writeLibrary(value) { localStorage.setItem(storageKey, JSON.stringify(value)); }
const library = readLibrary();
const controls = new Map();
const customValue = (id) => `user:${id}`;
const groupFor = (id) => customChoiceGroups[id];

export function customChoice(selectId) {
  const select = document.getElementById(selectId);
  if (!select?.value?.startsWith("user:")) return null;
  const id = select.value.slice(5);
  return (library[groupFor(selectId)] || []).find((item) => item.id === id) || null;
}

export function customChoiceText(selectId, language = "EN") {
  const item = customChoice(selectId);
  if (!item) return "";
  return language === item.language ? item.label : item.english || item.label;
}

export function customSelectionPlan(ids, language = "EN") {
  return ids.map((id) => customChoiceText(id, language)).filter(Boolean).join("; ");
}

export function captureCustomSelections(ids) {
  return Object.fromEntries(ids.map((id) => [id, document.getElementById(id)?.value || ""]));
}

export function refreshCustomOptions(ids = Object.keys(customChoiceGroups), desired = {}) {
  for (const id of ids) {
    const select = document.getElementById(id);
    if (!select) continue;
    const previous = desired[id] || select.value;
    for (const option of [...select.options]) if (option.dataset.customChoice === "true") option.remove();
    const capture = id.endsWith("camera-model") ? document.getElementById(id.replace("camera-model", "capture"))?.value : null;
    for (const item of library[groupFor(id)] || []) {
      if (capture && capture !== "auto" && item.capture && item.capture !== "auto" && item.capture !== capture) continue;
      const option = document.createElement("option"); option.value = customValue(item.id); option.textContent = item.label;
      option.dataset.customChoice = "true"; select.appendChild(option);
    }
    if ([...select.options].some((option) => option.value === previous)) select.value = previous;
    else if (previous.startsWith("user:")) select.value = [...select.options].some((option) => option.value === "auto") ? "auto" : select.options[0]?.value || "";
    controls.get(id)?.update();
  }
  controls.get("_toolbar")?.update();
}

async function englishVersion(label, language) {
  if (language === "EN") return label;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25_000);
  try {
    const localProxy = location.protocol === "http:" && location.hostname === "127.0.0.1" && ["18774", "18775", "18776", "18777", "18778", "18817", "18818", "18819"].includes(location.port);
    const base = localProxy ? location.origin : "http://127.0.0.1:11434";
    const tags = await (await fetch(base + "/api/tags", { signal:controller.signal })).json();
    const model = tags.models?.find((item) => item.name === "gemma3:4b" || item.name === "gemma3:latest")?.name;
    if (!model) return label;
    const instruction = `Translate this short user-defined image/video prompt option from ${language} into concise English. Preserve camera brand/model names and technical terms. Return only the translated phrase, with no explanation: ${label}`;
    const response = await fetch(base + "/api/chat", { method:"POST", headers:{ "Content-Type":"application/json" }, signal:controller.signal,
      body:JSON.stringify({ model, stream:false, options:{ temperature:0, num_predict:120 }, messages:[{ role:"user", content:instruction }] }) });
    if (!response.ok) return label;
    const result = String((await response.json()).message?.content || "").trim().replace(/^["“]|["”]$/g, "");
    return result && result.length <= 240 ? result : label;
  } catch { return label; }
  finally { clearTimeout(timer); }
}

export function installCustomChoices(getLanguage) {
  const toolbarHelp = document.getElementById("custom-library-help");
  const exportButton = document.getElementById("custom-library-export");
  const importButton = document.getElementById("custom-library-import");
  const importFile = document.getElementById("custom-library-file");
  const toolbarStatus = document.getElementById("custom-library-status");
  const updateToolbar = () => {
    const strings = customCopy[getLanguage()] || customCopy.EN;
    if (toolbarHelp) toolbarHelp.textContent = strings.backup || customCopy.EN.backup;
    if (exportButton) exportButton.textContent = strings.export || customCopy.EN.export;
    if (importButton) importButton.textContent = strings.import || customCopy.EN.import;
  };
  controls.set("_toolbar", { update:updateToolbar }); updateToolbar();
  exportButton?.addEventListener("click", () => {
    const data = JSON.stringify({ format:"ArtofTomworks-Prompt-Studio-Choices", version:1, groups:library }, null, 2);
    const url = URL.createObjectURL(new Blob([data], { type:"application/json;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = "ArtofTomworks_custom_choices.json";
    document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  importButton?.addEventListener("click", () => importFile?.click());
  importFile?.addEventListener("change", async () => {
    const file = importFile.files?.[0]; if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (data?.format !== "ArtofTomworks-Prompt-Studio-Choices" || data.version !== 1 || !data.groups || typeof data.groups !== "object") throw new Error("format");
      const allowed = new Set(Object.values(customChoiceGroups));
      for (const [group, entries] of Object.entries(data.groups)) {
        if (!allowed.has(group) || !Array.isArray(entries)) continue;
        if (!Array.isArray(library[group])) library[group] = [];
        for (const entry of entries.slice(0, 200)) {
          if (!entry || typeof entry.label !== "string" || !entry.label.trim() || entry.label.length > 120) continue;
          const label = entry.label.trim(), english = typeof entry.english === "string" && entry.english.length <= 240 ? entry.english : label;
          if (library[group].some((item) => item.label === label)) continue;
          library[group].push({ id:`${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`, label, english,
            language:typeof entry.language === "string" ? entry.language.slice(0, 2) : "EN", ...(entry.capture === "film" || entry.capture === "digital" ? { capture:entry.capture } : {}) });
        }
      }
      writeLibrary(library); refreshCustomOptions();
      toolbarStatus.textContent = (customCopy[getLanguage()] || customCopy.EN).imported || customCopy.EN.imported;
    } catch { toolbarStatus.textContent = (customCopy[getLanguage()] || customCopy.EN).invalid || customCopy.EN.invalid; }
    importFile.value = "";
  });
  for (const id of Object.keys(customChoiceGroups)) {
    const select = document.getElementById(id);
    if (!select || controls.has(id)) continue;
    const row = document.createElement("div"); row.className = "custom-choice-row";
    const add = document.createElement("button"); add.type = "button"; add.className = "custom-choice-button";
    const remove = document.createElement("button"); remove.type = "button"; remove.className = "custom-choice-button";
    const editor = document.createElement("div"); editor.className = "custom-choice-editor"; editor.hidden = true;
    const input = document.createElement("input"); input.type = "text"; input.maxLength = 120;
    const save = document.createElement("button"); save.type = "button"; save.className = "custom-choice-button";
    const cancel = document.createElement("button"); cancel.type = "button"; cancel.className = "custom-choice-button";
    const message = document.createElement("span"); message.className = "custom-choice-message"; message.setAttribute("role", "status");
    editor.append(input, save, cancel); row.append(add, remove, editor, message); select.parentElement.appendChild(row);
    const update = () => {
      const strings = customCopy[getLanguage()] || customCopy.EN;
      add.textContent = strings.add; remove.textContent = strings.remove; save.textContent = strings.save; cancel.textContent = strings.cancel;
      input.placeholder = strings.placeholder;
      remove.disabled = !customChoice(id);
    };
    controls.set(id, { update }); update();
    add.addEventListener("click", () => { editor.hidden = false; message.textContent = ""; input.focus(); });
    cancel.addEventListener("click", () => { editor.hidden = true; input.value = ""; message.textContent = ""; });
    const saveChoice = () => {
      const label = input.value.trim().replace(/\s+/g, " ");
      if (!label) { message.textContent = (customCopy[getLanguage()] || customCopy.EN).empty; return; }
      const group = groupFor(id), language = getLanguage(), capture = id.endsWith("camera-model") ? document.getElementById(id.replace("camera-model", "capture"))?.value || "auto" : undefined;
      const item = { id:`${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`, label, english:label, language, ...(capture ? { capture } : {}) };
      if (!Array.isArray(library[group])) library[group] = [];
      library[group].push(item); writeLibrary(library);
      refreshCustomOptions(); select.value = customValue(item.id); select.dispatchEvent(new Event("change", { bubbles:true })); update();
      editor.hidden = true; input.value = ""; message.textContent = "";
      void englishVersion(label, language).then((english) => {
        if (!(library[group] || []).includes(item)) return;
        item.english = english; writeLibrary(library);
        if (select.value === customValue(item.id)) select.dispatchEvent(new Event("change", { bubbles:true }));
      });
    };
    save.addEventListener("click", saveChoice);
    input.addEventListener("keydown", (event) => { if (event.key === "Enter") { event.preventDefault(); saveChoice(); } });
    remove.addEventListener("click", () => {
      const item = customChoice(id);
      if (!item || !confirm((customCopy[getLanguage()] || customCopy.EN).confirm)) return;
      library[groupFor(id)] = (library[groupFor(id)] || []).filter((entry) => entry.id !== item.id); writeLibrary(library);
      refreshCustomOptions(); select.value = [...select.options].some((option) => option.value === "auto") ? "auto" : select.options[0]?.value || "";
      select.dispatchEvent(new Event("change", { bubbles:true })); update();
    });
    select.addEventListener("change", update);
  }
  refreshCustomOptions();
}
