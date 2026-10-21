// Read-only, local-first matching. An addon is never inserted into a prompt or enabled in a workflow.
const familyPatterns = [
  ["ltx25", /ltx[\s_.-]*(?:2[\s_.-]*5|v?2\.5)/iu],
  ["ltx23", /ltx[\s_.-]*(?:2[\s_.-]*3|v?2\.3)/iu],
  ["h3", /\b(?:minimax[\s_.-]*)?h3\b|dasiwa|ref2va/iu],
  ["krea2", /\bkrea[\s_.-]*2\b|kreamania|kreapix/iu],
  ["flux", /\bflux\b|\bflx\b/iu],
  ["sdxl", /\bsdxl\b|stable diffusion xl/iu],
  ["sd15", /\bsd[\s_.-]*1[\s_.-]*5\b|stable diffusion 1\.5/iu],
  ["wan", /\bwan[\s_.-]*(?:2[\s_.-]*\d)?\b/iu]
];
export function inferAddonFamily(text) {
  const value=String(text||"");
  for (const [family,pattern] of familyPatterns) if (pattern.test(value)) return family;
  return "";
}
const stop = new Set("the and with from this that image video model lora style version trained prompt for into your more very some high low good quality use using work works best file data base without no not only one two three and or to of in on at by a an is are it be as an be ein eine und der die das mit von para por los las des une dans pour il elle con una uno delle del el que les un mais sobre sem como vagy hogy ami az egy kép videó modell lora prompt fény stílus nagyon jó szép van nem csak vagy és meg neki ezt azt képhez videóhoz".split(/\s+/u));
function tokens(text) {
  return [...new Set(String(text||"").normalize("NFD").replace(/[\u0300-\u036f]/gu, "").toLowerCase().match(/[a-z0-9]{3,}/gu) || [])].filter((word)=>!stop.has(word) && !/^\d+$/u.test(word));
}
function overlap(promptWords, field) {
  const fieldWords=tokens(field);
  return fieldWords.filter((word)=>promptWords.some((source)=>source===word || (source.length>=5 && word.length>=5 && (source.startsWith(word) || word.startsWith(source)))));
}
export function recommendAddons(prompt, selectedFamily, items, limit=10) {
  const words=tokens(String(prompt||"").replace(/<lora:[^>]*>/giu," "));
  const adultIntent=/\b(?:nsfw|nude|nudity|erotic|sensual|sexy|sex|lingerie|boudoir|naked|meztelen|erotikus|aktfot[oó])\b/iu.test(prompt);
  if (!words.length || !selectedFamily) return { suggestions:[], review:[] };
  const suggestions=[],review=[];
  for (const item of Array.isArray(items)?items:[]) {
    if (!adultIntent && /\b(?:nsfw|nude|nudity|erotic|sex|xxx|hentai|porn|milf|lingerie|boudoir)\b/iu.test(`${item.name} ${item.file} ${(item.tags||[]).join(" ")}`)) continue;
    const family=inferAddonFamily(item.baseModel) || inferAddonFamily(`${item.file} ${item.name}`);
    if (family && family!==selectedFamily) continue;
    const title=overlap(words,`${item.name} ${item.file}`), tags=overlap(words,item.tags?.join(" "));
    const triggers=overlap(words,item.triggers?.join(" ")),description=overlap(words,item.description);
    const matched=[...new Set([...title,...tags,...triggers,...description])];
    const score=title.length*3+tags.length*2+triggers.length*4+description.length;
    if (score<2 || !matched.length) continue;
    const row={...item,family,matched,score,verified:family===selectedFamily && item.type!=="wildcard"};
    (row.verified?suggestions:review).push(row);
  }
  const sort=(a,b)=>b.score-a.score || a.name.localeCompare(b.name);
  return { suggestions:suggestions.sort(sort).slice(0,limit), review:review.sort(sort).slice(0,Math.min(limit,6)) };
}
export function guideLoraMatches(prompt, selectedFamily, items, limit=5) {
  const result=recommendAddons(prompt,selectedFamily,(Array.isArray(items)?items:[]).filter((item)=>item.type==="lora"),limit);
  return [...result.suggestions,...result.review].slice(0,limit);
}

const copy={
  EN:{title:"What could help this prompt?",intro:"Suggestions from local LoRAs, embeddings and wildcard files. Nothing is enabled automatically.",family:"Target model family",unknown:"Choose a model family",analyze:"Review my prompt",scan:"Refresh local inventory",path:"Additional folder path",add:"Add folder",search:"Browse by name",found:"Possible matches",review:"Check compatibility first",none:"No matching addon with verified compatibility. Try another phrase or browse your collection.",empty:"Write a prompt first.",offline:"Start the local Prompt Studio to inspect installed files.",working:"Reading local addon descriptions…",error:"Could not read the addon inventory.",count:"{count} local items indexed",reason:"Matching words",source:"Information source",trigger:"Trigger words",base:"Listed base model",copyFile:"Copy filename",copied:"Filename copied",unverified:"Model compatibility unverified",wildcard:"Use only if your workflow supports wildcards",strength:"Strength: check the addon description; no reliable value stored.",folderError:"Folder could not be added.",browse:"Local collection",noBrowse:"No files match this search.",needFamily:"Select the model family before asking for recommendations."},
  HU:{title:"Mi segítheti ezt a promptot?",intro:"Helyi LoRA-k, embeddingek és wildcard-fájlok alapján. Semmit nem kapcsol be magától.",family:"Célmodell családja",unknown:"Válassz modellcsaládot",analyze:"Prompt átvizsgálása",scan:"Helyi gyűjtemény frissítése",path:"További mappa teljes útvonala",add:"Mappa hozzáadása",search:"Keresés név alapján",found:"Lehetséges találatok",review:"Kompatibilitás ellenőrzendő",none:"Nem találtam biztosan kompatibilis, illő kiegészítőt. Próbálj más kifejezést, vagy keress a gyűjteményben.",empty:"Előbb írj promptot.",offline:"A helyi fájlokhoz a Prompt Studio indítóját használd.",working:"Helyi leírások beolvasása…",error:"Nem sikerült beolvasni a kiegészítőket.",count:"{count} helyi elem beolvasva",reason:"Egyező szavak",source:"Adatforrás",trigger:"Indító szavak",base:"Megadott alapmodell",copyFile:"Fájlnév másolása",copied:"Fájlnév másolva",unverified:"Modell-kompatibilitása nem igazolt",wildcard:"Csak wildcardot támogató workflow-ban használd",strength:"Erősség: ellenőrizd a leírásban; nincs biztos mentett érték.",folderError:"A mappát nem sikerült hozzáadni.",browse:"Helyi gyűjtemény",noBrowse:"Nincs ilyen nevű fájl.",needFamily:"Ajánláshoz válassz modellcsaládot."},
  DE:{title:"Was könnte diesem Prompt helfen?",intro:"Lokale LoRAs, Embeddings und Wildcards. Nichts wird automatisch aktiviert.",family:"Zielmodell",unknown:"Modellfamilie wählen",analyze:"Prompt prüfen",scan:"Lokale Sammlung aktualisieren",path:"Weiterer Ordnerpfad",add:"Ordner hinzufügen",search:"Nach Namen suchen",found:"Mögliche Treffer",review:"Kompatibilität prüfen",none:"Kein sicher passender Zusatz gefunden.",empty:"Zuerst Prompt schreiben.",offline:"Lokalen Starter verwenden.",working:"Lokale Beschreibungen lesen…",error:"Sammlung nicht lesbar.",count:"{count} lokale Dateien",reason:"Passende Wörter",source:"Quelle",trigger:"Triggerwörter",base:"Basismodell",copyFile:"Dateiname kopieren",copied:"Kopiert",unverified:"Kompatibilität ungeprüft",wildcard:"Nur mit Wildcard-Workflow verwenden",strength:"Stärke in der Beschreibung prüfen.",folderError:"Ordner nicht hinzugefügt.",browse:"Lokale Sammlung",noBrowse:"Keine passenden Dateien.",needFamily:"Modellfamilie wählen."},
  FR:{title:"Qu'est-ce qui peut aider ce prompt ?",intro:"LoRA, embeddings et wildcards locaux. Rien n'est activé automatiquement.",family:"Famille du modèle",unknown:"Choisir une famille",analyze:"Examiner le prompt",scan:"Actualiser la collection",path:"Chemin du dossier",add:"Ajouter le dossier",search:"Chercher par nom",found:"Résultats possibles",review:"Vérifier la compatibilité",none:"Aucun ajout compatible trouvé.",empty:"Écrivez d'abord un prompt.",offline:"Démarrez la version locale.",working:"Lecture des descriptions…",error:"Collection inaccessible.",count:"{count} fichiers locaux",reason:"Mots communs",source:"Source",trigger:"Mots déclencheurs",base:"Modèle de base",copyFile:"Copier le nom",copied:"Copié",unverified:"Compatibilité non vérifiée",wildcard:"Seulement si le workflow accepte les wildcards",strength:"Vérifiez la force dans la description.",folderError:"Dossier non ajouté.",browse:"Collection locale",noBrowse:"Aucun fichier trouvé.",needFamily:"Choisissez une famille."},
  ES:{title:"¿Qué podría ayudar a este prompt?",intro:"LoRAs, embeddings y wildcards locales. Nada se activa automáticamente.",family:"Familia del modelo",unknown:"Elige una familia",analyze:"Revisar el prompt",scan:"Actualizar colección",path:"Ruta de otra carpeta",add:"Añadir carpeta",search:"Buscar por nombre",found:"Coincidencias posibles",review:"Comprobar compatibilidad",none:"No hay complemento compatible verificado.",empty:"Escribe un prompt primero.",offline:"Inicia el Studio local.",working:"Leyendo descripciones…",error:"No se pudo leer la colección.",count:"{count} archivos locales",reason:"Palabras coincidentes",source:"Fuente",trigger:"Palabras activadoras",base:"Modelo base",copyFile:"Copiar nombre",copied:"Copiado",unverified:"Compatibilidad sin verificar",wildcard:"Solo con workflows que admiten wildcards",strength:"Comprueba la fuerza en la descripción.",folderError:"No se añadió la carpeta.",browse:"Colección local",noBrowse:"Sin archivos coincidentes.",needFamily:"Elige una familia."},
  IT:{title:"Cosa può aiutare questo prompt?",intro:"LoRA, embedding e wildcard locali. Nulla viene attivato automaticamente.",family:"Famiglia del modello",unknown:"Scegli una famiglia",analyze:"Esamina il prompt",scan:"Aggiorna raccolta",path:"Percorso altra cartella",add:"Aggiungi cartella",search:"Cerca per nome",found:"Possibili risultati",review:"Verifica compatibilità",none:"Nessun componente compatibile trovato.",empty:"Scrivi prima un prompt.",offline:"Avvia Studio in locale.",working:"Lettura descrizioni…",error:"Raccolta non leggibile.",count:"{count} file locali",reason:"Parole coincidenti",source:"Fonte",trigger:"Parole trigger",base:"Modello base",copyFile:"Copia nome",copied:"Copiato",unverified:"Compatibilità non verificata",wildcard:"Solo con workflow che supportano wildcard",strength:"Controlla la forza nella descrizione.",folderError:"Cartella non aggiunta.",browse:"Raccolta locale",noBrowse:"Nessun file trovato.",needFamily:"Scegli una famiglia."},
  PT:{title:"O que pode ajudar este prompt?",intro:"LoRAs, embeddings e wildcards locais. Nada é ativado automaticamente.",family:"Família do modelo",unknown:"Escolha uma família",analyze:"Analisar prompt",scan:"Atualizar coleção",path:"Caminho de outra pasta",add:"Adicionar pasta",search:"Pesquisar por nome",found:"Possíveis resultados",review:"Verificar compatibilidade",none:"Nenhum complemento compatível encontrado.",empty:"Escreva um prompt primeiro.",offline:"Inicie o Studio local.",working:"A ler descrições…",error:"Coleção indisponível.",count:"{count} ficheiros locais",reason:"Palavras coincidentes",source:"Fonte",trigger:"Palavras de ativação",base:"Modelo base",copyFile:"Copiar nome",copied:"Copiado",unverified:"Compatibilidade não verificada",wildcard:"Só com workflow que aceita wildcards",strength:"Confira a força na descrição.",folderError:"Pasta não adicionada.",browse:"Coleção local",noBrowse:"Nenhum ficheiro encontrado.",needFamily:"Escolha uma família."},
  PL:{title:"Co może pomóc temu promptowi?",intro:"Lokalne LoRA, embeddingi i wildcardy. Nic nie jest włączane automatycznie.",family:"Rodzina modelu",unknown:"Wybierz rodzinę",analyze:"Sprawdź prompt",scan:"Odśwież kolekcję",path:"Ścieżka do folderu",add:"Dodaj folder",search:"Szukaj po nazwie",found:"Możliwe dopasowania",review:"Sprawdź zgodność",none:"Brak potwierdzonych zgodnych dodatków.",empty:"Najpierw wpisz prompt.",offline:"Uruchom lokalne Studio.",working:"Odczyt opisów…",error:"Kolekcja niedostępna.",count:"{count} lokalnych plików",reason:"Pasujące słowa",source:"Źródło",trigger:"Słowa wyzwalające",base:"Model bazowy",copyFile:"Kopiuj nazwę",copied:"Skopiowano",unverified:"Zgodność niepotwierdzona",wildcard:"Tylko w workflow obsługującym wildcards",strength:"Sprawdź siłę w opisie.",folderError:"Nie dodano folderu.",browse:"Lokalna kolekcja",noBrowse:"Brak pasujących plików.",needFamily:"Wybierz rodzinę."}
};
const familyNames={ltx25:"LTX 2.5",ltx23:"LTX 2.3",h3:"H3 / DaSiWa",krea2:"Krea 2",flux:"Flux",sdxl:"SDXL",sd15:"SD 1.5",wan:"Wan"};
export function attachAddonAdvisor({getLanguage,getCurrent,getMode}) {
  const panel=document.createElement("details");panel.className="result-card addon-advisor";
  panel.innerHTML=`<summary id="addon-title"></summary><div class="addon-body"><p id="addon-intro"></p><div class="addon-controls"><label><span id="addon-family-label"></span><select id="addon-family"></select></label><button id="addon-analyze" type="button" class="secondary-action"></button><button id="addon-scan" type="button" class="quiet-action"></button></div><p id="addon-status" role="status" aria-live="polite"></p><div id="addon-results"></div><details class="addon-collection"><summary id="addon-browse-title"></summary><input id="addon-search" type="search"><div id="addon-browse-results"></div><div class="addon-controls"><select id="addon-type"><option value="lora">LoRA</option><option value="embedding">Embedding</option><option value="wildcard">Wildcard</option></select><input id="addon-path" type="text" autocomplete="off"><button id="addon-add" type="button" class="quiet-action"></button></div></details></div>`;
  const host=document.querySelector(".result-column");host.insertBefore(panel,host.querySelector(".prompt-library"));
  const el=(id)=>panel.querySelector(`#${id}`), t=()=>copy[getLanguage()]||copy.EN;
  let items=[],manualFamily=false,result=null,lastMode=getMode();
  const family=el("addon-family");
  function refreshFamily() {
    if(lastMode!==getMode()){lastMode=getMode();manualFamily=false;result=null;el("addon-results").replaceChildren();}
    if(manualFamily) return;
    const inferred=getMode()==="video"?"":inferAddonFamily(getCurrent().model);
    family.value=inferred||"";
  }
  function row(item,container) {
    const card=document.createElement("article");card.className="addon-item";
    const title=document.createElement("strong");title.textContent=`${item.type.toUpperCase()} · ${item.name}`;
    const file=document.createElement("small");file.textContent=item.file;
    card.append(title,file);
    if(item.description){const desc=document.createElement("p");desc.textContent=item.description;card.append(desc);}
    if(item.baseModel){const base=document.createElement("small");base.textContent=`${t().base}: ${item.baseModel}`;card.append(base);}
    if(item.triggers?.length){const trigger=document.createElement("small");trigger.textContent=`${t().trigger}: ${item.triggers.join(", ")}`;card.append(trigger);}
    if(item.matched?.length){const reason=document.createElement("small");reason.textContent=`${t().reason}: ${item.matched.join(", ")}`;card.append(reason);}
    if(item.verified===false || item.type==="wildcard") {const warning=document.createElement("small");warning.textContent=item.type==="wildcard"?t().wildcard:t().unverified;card.append(warning);}
    if(item.type==="lora"){const strength=document.createElement("small");strength.textContent=t().strength;card.append(strength);}
    const source=document.createElement("small");source.textContent=`${t().source}: ${item.source}`;card.append(source);
    const button=document.createElement("button");button.type="button";button.className="quiet-action";button.textContent=t().copyFile;
    button.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(item.file);button.textContent=t().copied;}catch{}});card.append(button);
    container.append(card);
  }
  function render() {
    const host=el("addon-results");host.replaceChildren();
    if(!result) return;
    if(result.suggestions.length){const heading=document.createElement("h3");heading.textContent=t().found;host.append(heading);for(const item of result.suggestions)row(item,host);}
    if(result.review.length){const heading=document.createElement("h3");heading.textContent=t().review;host.append(heading);for(const item of result.review)row(item,host);}
    if(!result.suggestions.length && !result.review.length)el("addon-status").textContent=t().none;
  }
  function renderBrowse() {
    const host=el("addon-browse-results");host.replaceChildren();
    const query=el("addon-search").value.trim().toLowerCase();if(!query)return;
    const found=items.filter((item)=>`${item.name} ${item.file} ${item.baseModel}`.toLowerCase().includes(query)).slice(0,30);
    if(!found.length){host.textContent=t().noBrowse;return;}
    for(const item of found)row(item,host);
  }
  async function inventory(refresh=false) {
    try {
      el("addon-status").textContent=t().working;
      if(refresh)await fetch("/api/addons/scan",{method:"POST",headers:{"Content-Type":"application/json","X-Prompt-Studio-Action":"manage-addons"},body:"{}"});
      let status;
      for(let tries=0;tries<40;tries++){
        const response=await fetch("/api/addons/status");if(!response.ok)throw new Error();status=await response.json();
        if(!status.scanning)break;
        await new Promise((done)=>setTimeout(done,250));
      }
      const response=await fetch("/api/addons/list");if(!response.ok)throw new Error();items=await response.json();
      el("addon-status").textContent=t().count.replace("{count}",items.length);
      renderBrowse();return true;
    }catch{el("addon-status").textContent=location.protocol==="file:"?t().offline:t().error;return false;}
  }
  function refresh(){el("addon-title").textContent=t().title;el("addon-intro").textContent=t().intro;el("addon-family-label").textContent=t().family;el("addon-analyze").textContent=t().analyze;el("addon-scan").textContent=t().scan;el("addon-path").placeholder=t().path;el("addon-add").textContent=t().add;el("addon-search").placeholder=t().search;el("addon-browse-title").textContent=t().browse;const previous=family.value;family.replaceChildren(new Option(t().unknown,""),...Object.entries(familyNames).map(([value,label])=>new Option(label,value)));family.value=previous;refreshFamily();render();renderBrowse();}
  family.addEventListener("change",()=>{manualFamily=true;result=null;el("addon-results").replaceChildren();});
  for(const id of ["model","i2v-model","i2i-model"])document.getElementById(id)?.addEventListener("change",refreshFamily);
  el("addon-analyze").addEventListener("click",async()=>{
    const prompt=getCurrent().prompt?.trim();if(!prompt){el("addon-status").textContent=t().empty;return;}
    if(!family.value){el("addon-status").textContent=t().needFamily;return;}
    if(!items.length && !await inventory())return;
    result=recommendAddons(prompt,family.value,items);el("addon-status").textContent=t().count.replace("{count}",items.length);render();
  });
  el("addon-scan").addEventListener("click",async()=>{if(await inventory(true)){result=null;el("addon-results").replaceChildren();}});
  el("addon-add").addEventListener("click",async()=>{
    const path=el("addon-path").value.trim();if(!path)return;
    try{const response=await fetch("/api/addons/roots",{method:"POST",headers:{"Content-Type":"application/json","X-Prompt-Studio-Action":"manage-addons"},body:JSON.stringify({type:el("addon-type").value,path})});if(!response.ok)throw new Error();el("addon-path").value="";await inventory(true);}catch{el("addon-status").textContent=t().folderError;}
  });
  el("addon-search").addEventListener("input",renderBrowse);
  panel.addEventListener("toggle",()=>{if(panel.open && !items.length)void inventory();});
  async function suggestForGuide(prompt,selectedFamily) {
    if (!prompt?.trim() || !selectedFamily) return {status:"missing",items:[]};
    if (!items.length && !await inventory()) return {status:"unavailable",items:[]};
    return {status:"ready",items:guideLoraMatches(prompt,selectedFamily,items,5)};
  }
  refresh();return {refresh,suggestForGuide,families:()=>Object.entries(familyNames),inferFamily:inferAddonFamily};
}

