import {creativePromptFor,creativeMixSectionFor,splitCreativePrompt,loadCreativeMixSection} from "./prompt-mix-section.mjs";
// The workbench edits a copy. It never writes back to an archive item or source editor.
const TEXT={
  HU:["Promptműhely","Az eredeti recept érintetlen marad.","Aktuális prompt átvétele","Eredeti","Munkapéldány","Negatív prompt","Lehetséges hibák keresése","Munkapéldány újrakezdése","Javítás MI-vel","Munkapéldány másolása","Eszközök megnyitása","Saját eszköz hozzáadása","Nincs még átvett prompt.","A munkapéldány elkészült.","Nem található egyértelmű ellentmondás; ez nem teljes nyelvi ellenőrzés.","Lehetséges ellentmondások:","A másolat a vágólapon van.","Nem sikerült másolni.","A munkapéldány módosult. Újrakezded az eredetiből?","Nincs másolható prompt.","Eszköz neve","Típus","Helyi vagy webes cím","Windows-program (.exe)","Cím vagy teljes .exe-útvonal","Mentés","Mégse","Beállítás","Megnyitás","Prompt másolása és megnyitás","Eltávolítás","Az eszköz nincs beállítva.","Érvénytelen cím vagy .exe-útvonal.","Az eszköz nem indult el. Ellenőrizd az útvonalat és hogy a helyi Studio fut-e.","A program indítása kérve.","A weboldal nem nyílt meg; ellenőrizd a felugró ablakokat.","Az MI-ablak megnyílt; a munkapéldányod megmaradt.","Legfeljebb 12 saját eszköz adható hozzá.","Eltávolítod ezt az eszközt?","SwarmUI","Stability Matrix","ComfyUI","Lehetséges nemi/pronominális ellentmondás (nő és férfi).","Lehetséges fényviszony-ellentmondás (nappal és éjszaka).","Egyetlen és több szereplő is szerepel.","Gyakori elírás: fireflyes → fireflies.","Ismétlődő promptrészlet. Nézd át, szükséges-e kétszer."],
  EN:["Prompt workbench","The original recipe stays untouched.","Load current prompt","Original","Working copy","Negative prompt","Check for possible issues","Restart working copy","Improve with AI","Copy working copy","Open creative tools","Add a tool","No prompt loaded yet.","Working copy ready.","No clear conflict found; this is not a full language review.","Possible issues:","Copy is on the clipboard.","Copy failed.","Your working copy changed. Restart from the original?","No prompt to copy.","Tool name","Type","Local or web URL","Windows program (.exe)","URL or full .exe path","Save","Cancel","Configure","Open","Copy prompt and open","Remove","Tool is not configured.","Invalid URL or .exe path.","Tool did not launch. Check the path and the local Studio server.","Program launch requested.","Web page did not open; check pop-up settings.","AI window opened; your working copy is preserved.","Up to 12 custom tools are supported.","Remove this tool?","SwarmUI","Stability Matrix","ComfyUI","Possible subject/pronoun conflict (woman and man).","Possible lighting conflict (day and night).","Both a single and multiple subjects are requested.","Possible typo: fireflyes → fireflies.","Repeated prompt phrase; check whether both copies are needed."],
  DE:["Prompt-Werkstatt","Das Original bleibt unverändert.","Aktuellen Prompt laden","Original","Arbeitskopie","Negativer Prompt","Mögliche Probleme prüfen","Arbeitskopie neu starten","Mit KI verbessern","Arbeitskopie kopieren","Kreativtools öffnen","Tool hinzufügen","Noch kein Prompt geladen.","Arbeitskopie bereit.","Kein klarer Widerspruch; keine vollständige Sprachprüfung.","Mögliche Probleme:","Kopie in der Zwischenablage.","Kopieren fehlgeschlagen.","Arbeitskopie geändert. Vom Original neu starten?","Kein Prompt zum Kopieren.","Toolname","Typ","Lokale oder Web-URL","Windows-Programm (.exe)","URL oder vollständiger .exe-Pfad","Speichern","Abbrechen","Einrichten","Öffnen","Prompt kopieren und öffnen","Entfernen","Tool nicht eingerichtet.","Ungültige URL oder .exe-Pfad.","Tool wurde nicht gestartet. Pfad und lokalen Server prüfen.","Programmstart angefordert.","Webseite nicht geöffnet; Pop-up-Einstellungen prüfen.","KI-Fenster geöffnet; Arbeitskopie bleibt erhalten.","Bis zu 12 eigene Tools.","Tool entfernen?","SwarmUI","Stability Matrix","ComfyUI","Möglicher Widerspruch bei Figur/Pronomen.","Möglicher Widerspruch zwischen Tag und Nacht.","Einzelne und mehrere Figuren angefordert.","Möglicher Tippfehler: fireflyes → fireflies.","Wiederholter Promptteil; bitte prüfen."],
  FR:["Atelier de prompt","L'original reste intact.","Charger le prompt actuel","Original","Copie de travail","Prompt négatif","Vérifier les problèmes possibles","Recommencer la copie","Améliorer avec l'IA","Copier la version de travail","Ouvrir les outils","Ajouter un outil","Aucun prompt chargé.","Copie prête.","Aucune contradiction évidente ; ce n'est pas une révision complète.","Problèmes possibles :","Copie dans le presse-papiers.","Échec de la copie.","Copie modifiée. Repartir de l'original ?","Aucun prompt à copier.","Nom de l'outil","Type","URL locale ou web","Programme Windows (.exe)","URL ou chemin .exe complet","Enregistrer","Annuler","Configurer","Ouvrir","Copier le prompt et ouvrir","Supprimer","Outil non configuré.","URL ou chemin .exe invalide.","L'outil n'a pas démarré. Vérifiez le chemin et le serveur local.","Lancement demandé.","Page non ouverte ; vérifiez les fenêtres pop-up.","Fenêtre IA ouverte ; copie préservée.","12 outils personnalisés maximum.","Supprimer cet outil ?","SwarmUI","Stability Matrix","ComfyUI","Possible contradiction entre personnage et pronom.","Possible contradiction entre jour et nuit.","Un et plusieurs sujets sont demandés.","Faute possible : fireflyes → fireflies.","Expression répétée ; vérifiez si nécessaire."],
  ES:["Taller de prompts","El original permanece intacto.","Cargar prompt actual","Original","Copia de trabajo","Prompt negativo","Buscar posibles problemas","Reiniciar copia","Mejorar con IA","Copiar borrador","Abrir herramientas","Añadir herramienta","No hay prompt cargado.","Copia preparada.","No hay contradicciones claras; no es una revisión completa.","Posibles problemas:","Copia en el portapapeles.","No se pudo copiar.","La copia cambió. ¿Reiniciar desde el original?","No hay prompt para copiar.","Nombre","Tipo","URL local o web","Programa Windows (.exe)","URL o ruta .exe completa","Guardar","Cancelar","Configurar","Abrir","Copiar prompt y abrir","Eliminar","Herramienta sin configurar.","URL o ruta .exe no válida.","No se inició. Comprueba la ruta y el servidor local.","Inicio solicitado.","No se abrió la página; revisa las ventanas emergentes.","Ventana de IA abierta; la copia se conserva.","Hasta 12 herramientas propias.","¿Eliminar esta herramienta?","SwarmUI","Stability Matrix","ComfyUI","Posible contradicción de sujeto/pronombre.","Posible contradicción entre día y noche.","Se pide uno y varios sujetos.","Posible error: fireflyes → fireflies.","Parte repetida; comprueba si hace falta."],
  IT:["Laboratorio prompt","L'originale resta invariato.","Carica prompt attuale","Originale","Copia di lavoro","Prompt negativo","Controlla possibili problemi","Ricomincia la copia","Migliora con IA","Copia la bozza","Apri strumenti","Aggiungi strumento","Nessun prompt caricato.","Copia pronta.","Nessuna contraddizione evidente; non è una revisione completa.","Possibili problemi:","Copia negli appunti.","Copia non riuscita.","La copia è cambiata. Ricominciare dall'originale?","Nessun prompt da copiare.","Nome strumento","Tipo","URL locale o web","Programma Windows (.exe)","URL o percorso .exe completo","Salva","Annulla","Configura","Apri","Copia prompt e apri","Rimuovi","Strumento non configurato.","URL o percorso .exe non valido.","Avvio fallito. Controlla percorso e server locale.","Avvio richiesto.","Pagina non aperta; controlla i popup.","Finestra IA aperta; copia conservata.","Massimo 12 strumenti personali.","Rimuovere lo strumento?","SwarmUI","Stability Matrix","ComfyUI","Possibile contrasto tra soggetto e pronome.","Possibile contrasto tra giorno e notte.","Richiesti uno e più soggetti.","Possibile refuso: fireflyes → fireflies.","Parte ripetuta; verifica se serve."],
  PT:["Oficina de prompts","O original fica intacto.","Carregar prompt atual","Original","Cópia de trabalho","Prompt negativo","Verificar possíveis problemas","Reiniciar cópia","Melhorar com IA","Copiar rascunho","Abrir ferramentas","Adicionar ferramenta","Nenhum prompt carregado.","Cópia pronta.","Sem conflito claro; não é revisão completa.","Possíveis problemas:","Cópia na área de transferência.","Falha ao copiar.","A cópia mudou. Reiniciar do original?","Sem prompt para copiar.","Nome da ferramenta","Tipo","URL local ou web","Programa Windows (.exe)","URL ou caminho .exe completo","Guardar","Cancelar","Configurar","Abrir","Copiar prompt e abrir","Remover","Ferramenta não configurada.","URL ou caminho .exe inválido.","Ferramenta não abriu. Verifique caminho e servidor local.","Abertura solicitada.","Página não abriu; verifique pop-ups.","Janela de IA aberta; cópia preservada.","Até 12 ferramentas próprias.","Remover ferramenta?","SwarmUI","Stability Matrix","ComfyUI","Possível conflito de sujeito/pronome.","Possível conflito entre dia e noite.","Pedido de um e vários sujeitos.","Possível erro: fireflyes → fireflies.","Trecho repetido; confirme se necessário."],
  PL:["Warsztat promptów","Oryginał pozostaje bez zmian.","Wczytaj bieżący prompt","Oryginał","Kopia robocza","Negatywny prompt","Sprawdź możliwe problemy","Rozpocznij kopię od nowa","Popraw z AI","Kopiuj wersję roboczą","Otwórz narzędzia","Dodaj narzędzie","Brak wczytanego promptu.","Kopia gotowa.","Brak wyraźnej sprzeczności; to niepełna korekta.","Możliwe problemy:","Kopia w schowku.","Nie udało się skopiować.","Kopia zmieniona. Zacząć od oryginału?","Brak promptu do skopiowania.","Nazwa narzędzia","Typ","Lokalny lub internetowy URL","Program Windows (.exe)","URL lub pełna ścieżka .exe","Zapisz","Anuluj","Ustaw","Otwórz","Kopiuj prompt i otwórz","Usuń","Narzędzie nieustawione.","Nieprawidłowy URL lub ścieżka .exe.","Narzędzie nie ruszyło. Sprawdź ścieżkę i lokalny serwer.","Uruchomienie zlecone.","Strona nie otworzyła się; sprawdź wyskakujące okna.","Okno AI otwarte; kopia zachowana.","Maksymalnie 12 własnych narzędzi.","Usunąć narzędzie?","SwarmUI","Stability Matrix","ComfyUI","Możliwa sprzeczność postaci i zaimków.","Możliwa sprzeczność dnia i nocy.","Wymagany jeden i wielu bohaterów.","Możliwa literówka: fireflyes → fireflies.","Powtórzony fragment; sprawdź, czy potrzebny."]
};
const STORE="artoftomworks.v2.creativeTools";
const presets=["swarm","matrix","comfy"];
const button=(label,action)=>{const item=document.createElement("button");item.type="button";item.textContent=label;item.addEventListener("click",action);return item;};
const cleanPath=(value)=>String(value||"").trim().replace(/^"|"$/g,"");
export function validateToolTarget(kind,value){
  const target=cleanPath(value);
  if(kind==="web"){
    try {const url=new URL(target);return ["http:","https:"].includes(url.protocol)&&!!url.hostname?url.href:"";} catch {return "";}
  }
  if(kind==="exe" && /^[A-Za-z]:\\.+\.exe$/i.test(target) && !/[\r\n|<>]/.test(target))return target;
  return "";
}
export function checkPromptDraft(positive,negative=""){
  const source=String(positive||""),issues=[];
  const has=(pattern)=>pattern.test(source);
  if(has(/\b(?:woman|female)\b/i)&&has(/\b(?:the man|male subject|we see him)\b/i))issues.push(42);
  if(has(/\b(?:daylight|bright daytime|sunny day)\b/i)&&has(/\b(?:nighttime|dark night|at night|midnight)\b/i))issues.push(43);
  if(has(/\b(?:one person|single person|solo portrait)\b/i)&&has(/\b(?:two people|multiple people|crowd)\b/i))issues.push(44);
  if(has(/\bfireflyes\b/i))issues.push(45);
  const phrases=source.toLowerCase().split(/[,;.!?]+/).map(part=>part.trim()).filter(part=>part.length>20);
  if(new Set(phrases).size<phrases.length)issues.push(46);
  return issues;
}
export function attachPromptWorkbench({getLanguage,getCurrent}){
  const root=document.getElementById("prompt-workbench");if(!root)return;
  const el=(name)=>root.querySelector("#workbench-"+name);
  const lang=()=>TEXT[getLanguage()]||TEXT.EN;
  const source=el("source"),draft=el("draft"),negative=el("negative"),status=el("status"),issues=el("issues"),toolList=el("tools");
  let original="",originalNegative="",originalScene="",originalMix="",editing=null;
  const defaults=()=>presets.map((id,index)=>({id,name:lang()[39+index],kind:"web",target:""}));
  let tools=defaults();
  try {
    const saved=JSON.parse(localStorage.getItem(STORE)||"null");
    if(Array.isArray(saved)){
      for(const item of saved.slice(0,15)){
        if(!item || typeof item.id!=="string" || typeof item.name!=="string")continue;
        const existing=tools.find(entry=>entry.id===item.id);
        if(existing){existing.kind=item.kind==="exe"?"exe":"web";existing.target=validateToolTarget(existing.kind,item.target);continue;}
        if(!item.id.startsWith("custom-")||tools.length>=15)continue;
        tools.push({id:item.id,name:item.name.trim().slice(0,60),kind:item.kind==="exe"?"exe":"web",target:validateToolTarget(item.kind,item.target)});
      }
    }
  } catch {}
  const save=()=>{try{localStorage.setItem(STORE,JSON.stringify(tools));}catch{}};
  const say=(message)=>{status.textContent=message;};
  const clipboard=async(text)=>{
    try{await navigator.clipboard.writeText(text);return true;}
    catch{const buffer=document.createElement("textarea");buffer.value=text;buffer.style.position="fixed";buffer.style.opacity="0";document.body.append(buffer);buffer.select();try{return document.execCommand("copy");}finally{buffer.remove();}}
  };
  const currentText=()=>[creativePromptFor("workbench",draft.value.trim()),negative.value.trim()?"Negative prompt: "+negative.value.trim():""].filter(Boolean).join("\n\n");
  const applySource=(value,negativeValue="",sections=null)=>{
    value=String(value||"").trim();
    if(!value){say(lang()[12]);return;}
    if(original && (draft.value!==originalScene||negative.value!==originalNegative) && !confirm(lang()[18]))return false;
    const parts=value.split(/\n\s*Negative prompt\s*:/i);
    original=parts[0].trim();originalNegative=parts.slice(1).join("Negative prompt:").trim();
    if(!originalNegative)originalNegative=String(negativeValue||"").trim();
    const split=splitCreativePrompt(original),mix=typeof sections?.mixDirection==="string"?sections.mixDirection:split.direction;
    originalScene=original;originalMix="";
    if((mix||typeof sections?.mixDirection==="string")&&loadCreativeMixSection("workbench",mix)){originalScene=typeof sections?.scenePrompt==="string"?sections.scenePrompt:split.scene;originalMix=mix;}
    source.value=original;draft.value=originalScene;negative.value=originalNegative;issues.replaceChildren();say(lang()[13]);
    document.dispatchEvent(new Event("prompt-studio-draft-updated"));
    return true;
  };
  const load=()=>{
    const current=getCurrent?.()||{};
    const negativeValue=["image","video"].includes(current.mode)?document.getElementById("negatives")?.value:"";
    applySource(current.prompt,negativeValue,current);
  };
  const check=()=>{
    issues.replaceChildren();
    const found=checkPromptDraft(draft.value,negative.value);
    if(!found.length){say(lang()[14]);return;}
    say(lang()[15]);
    for(const index of found){const item=document.createElement("li");item.textContent=lang()[index];issues.append(item);}
  };
  const openTool=async(item,copy)=>{
    const target=validateToolTarget(item.kind,item.target);
    if(!target){say(item.target?lang()[32]:lang()[31]);return;}
    let opened=null;
    if(item.kind==="web")opened=window.open("about:blank","_blank");
    if(opened)opened.opener=null;
    if(copy){
      const text=currentText();if(!draft.value.trim()){opened?.close();say(lang()[19]);return;}
      if(!await clipboard(text)){opened?.close();say(lang()[17]);return;}
    }
    if(item.kind==="web"){
      if(opened){opened.location.replace(target);say(copy?lang()[16]:lang()[34]);}
      else say(lang()[35]);
      return;
    }
    try {
      const result=await fetch("/api/tools/launch",{method:"POST",headers:{"Content-Type":"application/json","X-Prompt-Studio-Action":"launch-local-tool"},body:JSON.stringify({path:target})});
      if(!result.ok)throw Error("launch");
      say(lang()[34]);
    }catch{say(lang()[33]);}
  };
  const renderTools=()=>{
    toolList.replaceChildren();
    for(const item of tools){
      const row=document.createElement("div");row.className="workbench-tool";
      const name=document.createElement("strong");name.textContent=presets.includes(item.id)?lang()[39+presets.indexOf(item.id)]:item.name;
      const meta=document.createElement("small");meta.textContent=item.target||lang()[31];meta.title=meta.textContent;
      const actions=document.createElement("div");actions.className="workbench-actions";
      actions.append(button(lang()[28],()=>{void openTool(item,false);}),button(lang()[29],()=>{void openTool(item,true);}),button(lang()[27],()=>editTool(item.id)));
      if(!presets.includes(item.id))actions.append(button(lang()[30],()=>{}));
      if(!presets.includes(item.id)){
        const remove=actions.lastElementChild;remove.textContent=lang()[30];remove.addEventListener("click",()=>{
          if(!confirm(lang()[38]))return;tools=tools.filter(entry=>entry.id!==item.id);save();renderTools();
        });
      }
      row.append(name,meta,actions);toolList.append(row);
    }
  };
  const editTool=(id)=>{
    editing=id;
    const item=tools.find(entry=>entry.id===id);
    el("tool-editor").hidden=false;
    el("tool-name").value=item?.name||"";
    el("tool-name").disabled=presets.includes(id);
    el("tool-kind").value=item?.kind||"web";
    el("tool-target").value=item?.target||"";
    el("tool-target").focus();
  };
  const translate=()=>{
    const w=lang();
    for(const [name,index] of [["title",0],["intro",1],["load",2],["source-label",3],["draft-label",4],["negative-label",5],["check",6],["reset",7],["ask-ai",8],["copy",9],["tools-title",10],["add-tool",11],["tool-name-label",20],["tool-kind-label",21],["tool-target-label",24],["tool-save",25],["tool-cancel",26]])el(name).textContent=w[index];
    el("tool-kind").options[0].textContent=w[22];el("tool-kind").options[1].textContent=w[23];
    el("tool-target").placeholder=w[24];
    renderTools();
  };
  el("load").addEventListener("click",load);
  document.addEventListener("prompt-studio-workbench-load",event=>{
    if(!applySource(event.detail?.prompt,event.detail?.negative,event.detail)){event.preventDefault();return;}
    root.scrollIntoView({behavior:"smooth",block:"start"});
  });
  el("check").addEventListener("click",check);
  el("reset").addEventListener("click",()=>{
    if(!original){say(lang()[12]);return;}
    if((draft.value!==originalScene||negative.value!==originalNegative)&&!confirm(lang()[18]))return;
    if(originalScene!==original)loadCreativeMixSection("workbench",originalMix);
    draft.value=originalScene;negative.value=originalNegative;issues.replaceChildren();say(lang()[13]);
    document.dispatchEvent(new Event("prompt-studio-draft-updated"));
  });
  el("ask-ai").addEventListener("click",()=>{
    const text=currentText();if(!draft.value.trim()){say(lang()[19]);return;}
    document.dispatchEvent(new CustomEvent("prompt-studio-ask-ai",{detail:{text,task:"improve"}}));say(lang()[36]);
  });
  el("copy").addEventListener("click",async()=>{
    if(!draft.value.trim()){say(lang()[19]);return;}
    say(await clipboard(currentText())?lang()[16]:lang()[17]);
  });
  el("add-tool").addEventListener("click",()=>{if(tools.length>=15){say(lang()[37]);return;}editTool("custom-"+Date.now());});
  el("tool-cancel").addEventListener("click",()=>{el("tool-editor").hidden=true;editing=null;});
  el("tool-save").addEventListener("click",()=>{
    const name=el("tool-name").value.trim().slice(0,60),kind=el("tool-kind").value,target=validateToolTarget(kind,el("tool-target").value);
    if(!name||!target){say(lang()[32]);return;}
    const existing=tools.find(item=>item.id===editing);
    if(existing)Object.assign(existing,{kind,target,name:presets.includes(editing)?existing.name:name});
    else tools.push({id:editing,name,kind,target});
    save();el("tool-editor").hidden=true;editing=null;renderTools();say(lang()[13]);
  });
  document.getElementById("ui-language")?.addEventListener("change",translate);
  translate();say(lang()[12]);
  return {load};
}
