import { buildDirectorPrompt, directorProfiles, directorSettings, directorTimelineIssues } from "./director-engine.mjs";

const directorCopy = {
  EN:{title:"Director's timeline",intro:"Plan what happens second by second. The prompt and the technical video settings are separate; nothing is generated automatically.",name:"Plan name",model:"Video model",seconds:"Target seconds",fps:"FPS (other models)",base:"Scene / current prompt",useCurrent:"Use current prompt",add:"Add time segment",action:"What happens?",camera:"Camera movement",sound:"Sound / dialogue",remove:"Remove",build:"Build timeline prompt",technical:"Settings to enter in SwarmUI / workflow",copy:"Copy prompt",editor:"Send to video editor",save:"Save plan",new:"New plan",saved:"Saved plans",load:"Load",delete:"Delete saved plan",export:"Export plans",import:"Import plans",linked:"Linked result",none:"No video linked yet. Use the link button on a video in the archive.",feedback:"What worked / what to change next time?",reuse:"Use linked video's prompt",archiveLink:"Link to Director",notice:"The app does not change SwarmUI or ComfyUI settings. Check FPS and frame count there before generating.",advisory:"Approximate profile: verify the selected workflow's frame rules.",ready:"Timeline prompt is ready and editable.",stored:"Plan saved in this browser.",linkedDone:"Video linked to this plan. Review its saved prompt before reusing it.",error:"Could not save the plan. Export a backup.",confirm:"Replace the current base text?",deleteConfirm:"Delete this saved plan?",copyDone:"Prompt copied.",empty:"Nothing to copy yet.",loaded:"Saved plan loaded.",imported:"Plans imported. Existing plans were kept.",badImport:"Invalid plan backup.",backup:"Plans stay in this browser. Export a JSON backup before switching computers."},
  HU:{title:"Rendezői idővonal",intro:"Tervezd meg másodpercről másodpercre a jelenetet. A prompt és a technikai videóbeállítás külön készül; nem indul generálás.",name:"Terv neve",model:"Videómodell",seconds:"Célhossz (mp)",fps:"FPS (egyéb modell)",base:"Jelenet / meglévő prompt",useCurrent:"Aktuális prompt átvétele",add:"Időszakasz hozzáadása",action:"Mi történik?",camera:"Kameramozgás",sound:"Hang / párbeszéd",remove:"Törlés",build:"Idővonalas prompt készítése",technical:"SwarmUI-ban / workflow-ban beállítandó",copy:"Prompt másolása",editor:"Átvitel a videós szerkesztőbe",save:"Terv mentése",new:"Új terv",saved:"Mentett tervek",load:"Betöltés",delete:"Mentett terv törlése",export:"Tervek exportálása",import:"Tervek importálása",linked:"Kapcsolt eredmény",none:"Még nincs kapcsolt videó. A médiaarchívumban válassz egy videót.",feedback:"Mi sikerült / min változtatnál legközelebb?",reuse:"Kapcsolt videó promptjának átvétele",archiveLink:"Kapcsolás az idővonalhoz",notice:"A program nem állítja át a SwarmUI-t vagy a ComfyUI-t. Indítás előtt ellenőrizd az FPS-t és a képkockaszámot.",advisory:"Közelítő profil: ellenőrizd a kiválasztott workflow képkockaszabályát.",ready:"Elkészült a szabadon szerkeszthető idővonalas prompt.",stored:"A terv mentve ebben a böngészőben.",linkedDone:"A videó a tervhez kapcsolva. A promptját átvétel előtt nézd át.",error:"Nem sikerült menteni. Készíts JSON-mentést.",confirm:"Lecseréljem a jelenet jelenlegi szövegét?",deleteConfirm:"Töröljem ezt a mentett tervet?",copyDone:"Prompt másolva.",empty:"Még nincs másolható prompt.",loaded:"Mentett terv betöltve.",imported:"A tervek betöltve; a korábbiak megmaradtak.",badImport:"Hibás tervmentés.",backup:"A tervek ebben a böngészőben maradnak. Gépcsere előtt exportálj JSON-mentést."},
  DE:{title:"Regie-Zeitplan",intro:"Plane die Szene Sekunde für Sekunde. Prompt und technische Einstellungen bleiben getrennt; keine Generierung startet.",name:"Planname",model:"Videomodell",seconds:"Zieldauer (s)",fps:"FPS (andere Modelle)",base:"Szene / aktueller Prompt",useCurrent:"Aktuellen Prompt übernehmen",add:"Zeitabschnitt hinzufügen",action:"Was passiert?",camera:"Kamerabewegung",sound:"Ton / Dialog",remove:"Entfernen",build:"Zeitplan-Prompt erstellen",technical:"In SwarmUI / Workflow einstellen",copy:"Prompt kopieren",editor:"Im Videoeditor öffnen",save:"Plan speichern",new:"Neuer Plan",saved:"Gespeicherte Pläne",load:"Laden",delete:"Plan löschen",export:"Pläne exportieren",import:"Pläne importieren",linked:"Verknüpftes Ergebnis",none:"Noch kein Video verknüpft. Im Archiv ein Video auswählen.",feedback:"Was funktionierte / was ändern?",reuse:"Prompt des Videos übernehmen",archiveLink:"Mit Regieplan verknüpfen",notice:"SwarmUI- und ComfyUI-Einstellungen werden nicht automatisch geändert. FPS und Frames vor dem Start prüfen.",advisory:"Näherungsprofil: Frame-Regeln des Workflows prüfen.",ready:"Prompt bereit und bearbeitbar.",stored:"Plan im Browser gespeichert.",linkedDone:"Video verknüpft. Prompt vor Übernahme prüfen.",error:"Speichern fehlgeschlagen. JSON-Sicherung exportieren.",confirm:"Aktuellen Szenentext ersetzen?",deleteConfirm:"Gespeicherten Plan löschen?",copyDone:"Prompt kopiert.",empty:"Noch kein Prompt vorhanden.",loaded:"Plan geladen.",imported:"Pläne importiert; vorhandene bleiben erhalten.",badImport:"Ungültige Plansicherung.",backup:"Pläne bleiben in diesem Browser. Für einen anderen PC JSON exportieren."},
  FR:{title:"Chronologie de réalisation",intro:"Planifiez chaque seconde. Le prompt et les réglages vidéo restent distincts ; aucune génération ne démarre.",name:"Nom du plan",model:"Modèle vidéo",seconds:"Durée visée (s)",fps:"IPS (autres modèles)",base:"Scène / prompt actuel",useCurrent:"Reprendre le prompt actuel",add:"Ajouter un segment",action:"Que se passe-t-il ?",camera:"Mouvement de caméra",sound:"Son / dialogue",remove:"Retirer",build:"Créer le prompt chronologique",technical:"Réglages SwarmUI / workflow",copy:"Copier le prompt",editor:"Ouvrir dans l’éditeur vidéo",save:"Enregistrer le plan",new:"Nouveau plan",saved:"Plans enregistrés",load:"Charger",delete:"Supprimer le plan",export:"Exporter les plans",import:"Importer les plans",linked:"Résultat lié",none:"Aucune vidéo liée. Choisissez-en une dans l’archive.",feedback:"Qu’est-ce qui a fonctionné / à changer ?",reuse:"Reprendre le prompt de la vidéo",archiveLink:"Lier au plan",notice:"Les réglages SwarmUI et ComfyUI ne sont pas modifiés. Vérifiez les IPS et images avant la génération.",advisory:"Profil approximatif : vérifiez les règles du workflow.",ready:"Prompt prêt et modifiable.",stored:"Plan enregistré dans ce navigateur.",linkedDone:"Vidéo liée. Vérifiez son prompt avant de le réutiliser.",error:"Enregistrement impossible. Exportez une sauvegarde JSON.",confirm:"Remplacer le texte de scène actuel ?",deleteConfirm:"Supprimer ce plan ?",copyDone:"Prompt copié.",empty:"Aucun prompt à copier.",loaded:"Plan chargé.",imported:"Plans importés ; anciens plans conservés.",badImport:"Sauvegarde invalide.",backup:"Les plans restent dans ce navigateur. Exportez le JSON avant de changer d’ordinateur."},
  ES:{title:"Cronología de dirección",intro:"Planifica la escena segundo a segundo. El prompt y los ajustes técnicos van por separado; no se inicia ninguna generación.",name:"Nombre del plan",model:"Modelo de vídeo",seconds:"Duración objetivo (s)",fps:"FPS (otros modelos)",base:"Escena / prompt actual",useCurrent:"Usar prompt actual",add:"Añadir tramo",action:"¿Qué ocurre?",camera:"Movimiento de cámara",sound:"Sonido / diálogo",remove:"Quitar",build:"Crear prompt cronológico",technical:"Ajustes para SwarmUI / workflow",copy:"Copiar prompt",editor:"Enviar al editor de vídeo",save:"Guardar plan",new:"Plan nuevo",saved:"Planes guardados",load:"Cargar",delete:"Borrar plan",export:"Exportar planes",import:"Importar planes",linked:"Resultado vinculado",none:"Aún no hay vídeo vinculado. Elige uno en el archivo.",feedback:"¿Qué funcionó / qué cambiarías?",reuse:"Usar prompt del vídeo",archiveLink:"Vincular al plan",notice:"La app no cambia los ajustes de SwarmUI o ComfyUI. Comprueba FPS y fotogramas antes de generar.",advisory:"Perfil aproximado: verifica las reglas del workflow.",ready:"Prompt editable preparado.",stored:"Plan guardado en este navegador.",linkedDone:"Vídeo vinculado. Revisa su prompt antes de usarlo.",error:"No se pudo guardar. Exporta una copia JSON.",confirm:"¿Reemplazar el texto actual?",deleteConfirm:"¿Borrar este plan guardado?",copyDone:"Prompt copiado.",empty:"Aún no hay prompt.",loaded:"Plan cargado.",imported:"Planes importados; se conservaron los anteriores.",badImport:"Copia de planes inválida.",backup:"Los planes quedan en este navegador. Exporta JSON antes de cambiar de equipo."},
  IT:{title:"Timeline di regia",intro:"Progetta la scena secondo per secondo. Prompt e impostazioni tecniche restano separati; nessuna generazione viene avviata.",name:"Nome del piano",model:"Modello video",seconds:"Durata desiderata (s)",fps:"FPS (altri modelli)",base:"Scena / prompt attuale",useCurrent:"Usa il prompt attuale",add:"Aggiungi intervallo",action:"Cosa succede?",camera:"Movimento camera",sound:"Suono / dialogo",remove:"Rimuovi",build:"Crea prompt timeline",technical:"Impostazioni SwarmUI / workflow",copy:"Copia prompt",editor:"Apri nell’editor video",save:"Salva piano",new:"Nuovo piano",saved:"Piani salvati",load:"Carica",delete:"Elimina piano",export:"Esporta piani",import:"Importa piani",linked:"Risultato collegato",none:"Nessun video collegato. Scegline uno nell’archivio.",feedback:"Cosa ha funzionato / cosa cambiare?",reuse:"Usa il prompt del video",archiveLink:"Collega al piano",notice:"L’app non modifica SwarmUI o ComfyUI. Controlla FPS e fotogrammi prima di generare.",advisory:"Profilo approssimativo: verifica le regole del workflow.",ready:"Prompt pronto e modificabile.",stored:"Piano salvato nel browser.",linkedDone:"Video collegato. Controlla il prompt prima di usarlo.",error:"Salvataggio non riuscito. Esporta un backup JSON.",confirm:"Sostituire il testo attuale?",deleteConfirm:"Eliminare il piano salvato?",copyDone:"Prompt copiato.",empty:"Nessun prompt da copiare.",loaded:"Piano caricato.",imported:"Piani importati; quelli precedenti rimangono.",badImport:"Backup non valido.",backup:"I piani restano nel browser. Esporta JSON prima di cambiare computer."},
  PT:{title:"Linha temporal de realização",intro:"Planeie a cena segundo a segundo. O prompt e as definições técnicas ficam separados; não se inicia geração.",name:"Nome do plano",model:"Modelo de vídeo",seconds:"Duração pretendida (s)",fps:"FPS (outros modelos)",base:"Cena / prompt atual",useCurrent:"Usar prompt atual",add:"Adicionar segmento",action:"O que acontece?",camera:"Movimento da câmara",sound:"Som / diálogo",remove:"Remover",build:"Criar prompt temporal",technical:"Definições SwarmUI / workflow",copy:"Copiar prompt",editor:"Enviar para editor de vídeo",save:"Guardar plano",new:"Novo plano",saved:"Planos guardados",load:"Carregar",delete:"Eliminar plano",export:"Exportar planos",import:"Importar planos",linked:"Resultado associado",none:"Ainda não há vídeo associado. Escolha um no arquivo.",feedback:"O que funcionou / o que mudar?",reuse:"Usar prompt do vídeo",archiveLink:"Associar ao plano",notice:"A aplicação não altera o SwarmUI nem o ComfyUI. Confirme FPS e fotogramas antes da geração.",advisory:"Perfil aproximado: confirme as regras do workflow.",ready:"Prompt pronto e editável.",stored:"Plano guardado neste navegador.",linkedDone:"Vídeo associado. Reveja o prompt antes de o usar.",error:"Não foi possível guardar. Exporte cópia JSON.",confirm:"Substituir o texto atual?",deleteConfirm:"Eliminar este plano?",copyDone:"Prompt copiado.",empty:"Ainda não há prompt.",loaded:"Plano carregado.",imported:"Planos importados; os anteriores permanecem.",badImport:"Cópia de planos inválida.",backup:"Os planos ficam neste navegador. Exporte JSON antes de mudar de computador."},
  PL:{title:"Oś czasu reżysera",intro:"Zaplanuj scenę sekunda po sekundzie. Prompt i ustawienia techniczne są osobno; generowanie nie uruchamia się.",name:"Nazwa planu",model:"Model wideo",seconds:"Docelowa długość (s)",fps:"FPS (inne modele)",base:"Scena / bieżący prompt",useCurrent:"Użyj bieżącego promptu",add:"Dodaj odcinek",action:"Co się dzieje?",camera:"Ruch kamery",sound:"Dźwięk / dialog",remove:"Usuń",build:"Utwórz prompt z osią czasu",technical:"Ustawienia SwarmUI / workflow",copy:"Kopiuj prompt",editor:"Przenieś do edytora wideo",save:"Zapisz plan",new:"Nowy plan",saved:"Zapisane plany",load:"Wczytaj",delete:"Usuń plan",export:"Eksportuj plany",import:"Importuj plany",linked:"Powiązany wynik",none:"Brak powiązanego wideo. Wybierz je w archiwum.",feedback:"Co się udało / co zmienić?",reuse:"Użyj promptu wideo",archiveLink:"Powiąż z planem",notice:"Aplikacja nie zmienia ustawień SwarmUI ani ComfyUI. Sprawdź FPS i liczbę klatek przed generowaniem.",advisory:"Profil przybliżony: sprawdź zasady workflow.",ready:"Prompt gotowy do edycji.",stored:"Plan zapisany w przeglądarce.",linkedDone:"Wideo powiązane. Sprawdź prompt przed użyciem.",error:"Nie udało się zapisać. Eksportuj kopię JSON.",confirm:"Zastąpić bieżący tekst?",deleteConfirm:"Usunąć zapisany plan?",copyDone:"Prompt skopiowany.",empty:"Brak promptu do skopiowania.",loaded:"Plan wczytany.",imported:"Plany zaimportowane; wcześniejsze pozostają.",badImport:"Nieprawidłowa kopia planów.",backup:"Plany pozostają w tej przeglądarce. Przed zmianą komputera wyeksportuj JSON."}
};

const key="artoftomworks.director.v1";
const fresh=() => ({id:globalThis.crypto?.randomUUID?.() || `plan-${Date.now()}-${Math.random().toString(36).slice(2)}`,title:"",model:"h3",seconds:8,fps:24,basePrompt:"",
  beats:[{start:0,end:8,action:"",camera:"",sound:""}],output:"",linked:null,feedback:""});
const cleanPlan=(value) => {
  if (!value || typeof value !== "object") return null;
  const plan=fresh();
  plan.id=typeof value.id === "string" && value.id.length<80 ? value.id : plan.id;
  for (const name of ["title","basePrompt","output","feedback"]) plan[name]=String(value[name] || "").slice(0,name==="title"?100:20000);
  plan.model=Object.hasOwn(directorProfiles,value.model) ? value.model : "custom";
  plan.seconds=Number.isFinite(Number(value.seconds)) ? Math.min(15,Math.max(1,Number(value.seconds))) : 8;
  plan.fps=Number.isInteger(Number(value.fps)) ? Math.min(120,Math.max(1,Number(value.fps))) : 24;
  plan.beats=Array.isArray(value.beats) ? value.beats.slice(0,20).filter((beat) => beat && typeof beat === "object").map((beat) => ({
    start:Number(beat.start),end:Number(beat.end),action:String(beat.action || "").slice(0,2000),
    camera:String(beat.camera || "").slice(0,300),sound:String(beat.sound || "").slice(0,500)
  })) : plan.beats;
  if (!plan.beats.length) plan.beats=[{start:0,end:plan.seconds,action:"",camera:"",sound:""}];
  if (value.linked && typeof value.linked === "object") plan.linked={
    id:String(value.linked.id || "").slice(0,64),filename:String(value.linked.filename || "").slice(0,300),
    prompt:String(value.linked.prompt || "").slice(0,20000),rating:Math.max(0,Math.min(5,Number(value.linked.rating)||0)),
    category:String(value.linked.category || "").slice(0,100)
  };
  return plan;
};

export function attachDirectorTimeline({getLanguage,getCurrent,sendToEditor}) {
  const host=document.querySelector(".result-column");
  const panel=document.createElement("section"); panel.className="director-panel result-card";
  panel.innerHTML=`<div class="result-heading"><div><span class="eyebrow">DIRECTOR / 03</span><h2 id="director-title"></h2></div><span class="result-spark">◷</span></div>
    <div class="director-body"><p id="director-intro"></p><div class="director-grid">
      <label><span id="director-name-label"></span><input id="director-name" maxlength="100"></label>
      <label><span id="director-model-label"></span><select id="director-model"></select></label>
      <label><span id="director-seconds-label"></span><input id="director-seconds" type="number" min="1" max="15" step="0.5"></label>
      <label id="director-fps-wrap"><span id="director-fps-label"></span><input id="director-fps" type="number" min="1" max="120" step="1"></label>
    </div><label class="director-block"><span id="director-base-label"></span><textarea id="director-base" rows="4" maxlength="20000"></textarea></label>
    <button type="button" id="director-current" class="quiet-action"></button>
    <div id="director-beats"></div><button type="button" id="director-add" class="quiet-action"></button>
    <p id="director-validation" role="status"></p><div class="director-technical"><strong id="director-technical-title"></strong><p id="director-technical-value"></p><small id="director-advisory"></small></div>
    <button type="button" id="director-build" class="secondary-action"></button>
    <textarea id="director-output" rows="10" aria-label="Editable timeline prompt"></textarea>
    <div class="director-actions"><button type="button" id="director-copy"></button><button type="button" id="director-editor"></button></div>
    <div class="director-linked"><strong id="director-linked-title"></strong><p id="director-linked-value"></p><button type="button" id="director-reuse" class="quiet-action"></button>
      <label class="director-block"><span id="director-feedback-label"></span><textarea id="director-feedback" rows="2" maxlength="20000"></textarea></label></div>
    <div class="director-actions"><button type="button" id="director-save"></button><button type="button" id="director-new"></button></div>
    <label class="director-block"><span id="director-saved-label"></span><select id="director-saved"></select></label>
    <div class="director-actions"><button type="button" id="director-load"></button><button type="button" id="director-delete"></button><button type="button" id="director-export"></button><button type="button" id="director-import"></button></div>
    <input id="director-import-file" type="file" accept="application/json,.json" hidden>
    <p id="director-status" role="status" aria-live="polite"></p><p id="director-notice"></p><small id="director-backup"></small></div>`;
  host.insertBefore(panel,host.querySelector(".media-catalog") || host.querySelector(".side-tip"));
  const el=(id) => panel.querySelector(`#${id}`), tr=() => directorCopy[getLanguage()] || directorCopy.EN;
  let saved=[],plan=fresh(),draftTimer=null;
  try {
    const data=JSON.parse(localStorage.getItem(key) || "{}");
    saved=Array.isArray(data.saved) ? data.saved.slice(0,30).map(cleanPlan).filter(Boolean) : [];
    plan=cleanPlan(data.draft) || plan;
  } catch { /* Fresh browser or invalid old data. */ }
  const persist=() => { try { localStorage.setItem(key,JSON.stringify({version:1,draft:plan,saved})); return true; } catch { el("director-status").textContent=tr().error; return false; } };
  const schedule=() => { clearTimeout(draftTimer); draftTimer=setTimeout(persist,300); };
  const labels={"director-title":"title","director-intro":"intro","director-name-label":"name","director-model-label":"model",
    "director-seconds-label":"seconds","director-fps-label":"fps","director-base-label":"base","director-current":"useCurrent",
    "director-add":"add","director-build":"build","director-technical-title":"technical","director-copy":"copy","director-editor":"editor",
    "director-linked-title":"linked","director-reuse":"reuse","director-feedback-label":"feedback","director-save":"save",
    "director-new":"new","director-saved-label":"saved","director-load":"load","director-delete":"delete",
    "director-export":"export","director-import":"import","director-notice":"notice","director-backup":"backup"};
  const refreshSaved=() => {
    const select=el("director-saved"),old=select.value; select.replaceChildren(new Option("—",""));
    for (const item of saved) select.add(new Option(item.title || item.linked?.filename || item.id.slice(0,8),item.id));
    select.value=saved.some((item) => item.id===old) ? old : saved.some((item) => item.id===plan.id) ? plan.id : "";
  };
  const renderSettings=() => {
    const warning=el("director-validation"),technical=el("director-technical-value");
    try {
      const settings=directorSettings(plan.model,plan.seconds,plan.fps);
      technical.textContent=`${settings.field}: ${settings.frames} · FPS: ${settings.fps} · ≈${settings.estimatedSeconds}s`;
      warning.textContent=directorTimelineIssues(plan.beats,settings.requestedSeconds).join(" · ");
      el("director-advisory").textContent=settings.advisory ? tr().advisory : "";
    } catch(error) { technical.textContent="—"; warning.textContent=error.message; }
  };
  const renderBeats=() => {
    const container=el("director-beats"); container.replaceChildren();
    plan.beats.forEach((beat,index) => {
      const row=document.createElement("div"); row.className="director-beat";
      const heading=document.createElement("strong"); heading.textContent=`${index+1}. · ${tr().seconds}`;
      const times=document.createElement("div"); times.className="director-beat-times";
      for (const field of ["start","end"]) {
        const input=document.createElement("input"); input.type="number"; input.min="0"; input.max="15"; input.step="0.1";
        input.value=beat[field]; input.setAttribute("aria-label",`${index+1} ${field}`);
        input.addEventListener("change",() => { beat[field]=Number(input.value); renderSettings(); schedule(); }); times.append(input);
      }
      const labelsForBeat=[["action","action"],["camera","camera"],["sound","sound"]];
      row.append(heading,times);
      for (const [field,label] of labelsForBeat) {
        const wrap=document.createElement("label"),span=document.createElement("span"),input=document.createElement(field==="action"?"textarea":"input");
        span.textContent=tr()[label]; input.value=beat[field]; input.maxLength=field==="action"?2000:field==="camera"?300:500;
        if (field==="action") input.rows=2;
        input.addEventListener("input",() => { beat[field]=input.value; schedule(); }); wrap.append(span,input); row.append(wrap);
      }
      if (plan.beats.length>1) {
        const remove=document.createElement("button"); remove.type="button"; remove.textContent=tr().remove;
        remove.addEventListener("click",() => { plan.beats.splice(index,1); renderBeats(); renderSettings(); schedule(); }); row.append(remove);
      }
      container.append(row);
    });
  };
  const translate=() => {
    for (const [id,name] of Object.entries(labels)) el(id).textContent=tr()[name];
    const old=el("director-model").value;
    el("director-model").replaceChildren(...Object.entries(directorProfiles).map(([value,p]) => new Option(p.label,value)));
    el("director-model").value=old || plan.model;
    el("director-fps-wrap").hidden=el("director-model").value!=="custom";
    renderBeats(); renderSettings(); renderLinked();
  };
  const renderLinked=() => {
    const linked=plan.linked; el("director-linked-value").textContent=linked
      ? `${linked.filename} · ${"★".repeat(linked.rating || 0)}${linked.category ? ` · ${linked.category}` : ""}` : tr().none;
    el("director-reuse").disabled=!linked?.prompt;
  };
  const renderPlan=() => {
    for (const [id,value] of [["director-name",plan.title],["director-model",plan.model],["director-seconds",plan.seconds],
      ["director-fps",plan.fps],["director-base",plan.basePrompt],["director-output",plan.output],["director-feedback",plan.feedback]]) el(id).value=value;
    el("director-fps-wrap").hidden=plan.model!=="custom";
    renderBeats(); renderSettings(); renderLinked(); refreshSaved();
  };
  for (const [id,field] of [["director-name","title"],["director-model","model"],["director-seconds","seconds"],
    ["director-fps","fps"],["director-base","basePrompt"],["director-output","output"],["director-feedback","feedback"]]) {
    el(id).addEventListener(id==="director-model"?"change":"input",() => {
      const oldSeconds=plan.seconds;
      plan[field]=["seconds","fps"].includes(field) ? Number(el(id).value) : el(id).value;
      if (field==="model") el("director-fps-wrap").hidden=plan.model!=="custom";
      if (field==="seconds" && plan.beats.length && Math.abs(plan.beats[plan.beats.length-1].end-oldSeconds)<0.01) {
        plan.beats[plan.beats.length-1].end=plan.seconds; renderBeats();
      }
      renderSettings(); schedule();
    });
  }
  el("director-current").addEventListener("click",() => {
    const value=getCurrent().prompt?.trim(); if (!value || (plan.basePrompt && !confirm(tr().confirm))) return;
    plan.basePrompt=value; el("director-base").value=value; schedule();
  });
  el("director-add").addEventListener("click",() => {
    if (plan.beats.length>=20) return;
    const previous=plan.beats[plan.beats.length-1]; const midpoint=Number(((Number(previous.start)+Number(previous.end))/2).toFixed(1));
    if (midpoint<=previous.start || midpoint>=previous.end) return;
    const end=previous.end; previous.end=midpoint;
    plan.beats.push({start:midpoint,end,action:"",camera:"",sound:""}); renderBeats(); renderSettings(); schedule();
  });
  el("director-build").addEventListener("click",() => {
    try { const result=buildDirectorPrompt(plan); plan.output=result.prompt; el("director-output").value=result.prompt;
      el("director-status").textContent=tr().ready; schedule(); }
    catch(error) { el("director-status").textContent=error.message; }
  });
  el("director-copy").addEventListener("click",async () => {
    if (!plan.output.trim()) { el("director-status").textContent=tr().empty; return; }
    try { await navigator.clipboard.writeText(plan.output); el("director-status").textContent=tr().copyDone; }
    catch(error) { el("director-status").textContent=error.message; }
  });
  el("director-editor").addEventListener("click",() => {
    if (!plan.output.trim()) { el("director-status").textContent=tr().empty; return; }
    sendToEditor(plan.output);
  });
  el("director-reuse").addEventListener("click",() => {
    if (!plan.linked?.prompt || (plan.basePrompt && !confirm(tr().confirm))) return;
    plan.basePrompt=plan.linked.prompt; el("director-base").value=plan.basePrompt; schedule();
  });
  el("director-save").addEventListener("click",() => {
    const copy=cleanPlan(plan); copy.updatedAt=new Date().toISOString();
    saved=[copy,...saved.filter((item) => item.id!==plan.id)].slice(0,30);
    refreshSaved(); if (persist()) el("director-status").textContent=tr().stored;
  });
  el("director-new").addEventListener("click",() => { plan=fresh(); renderPlan(); schedule(); });
  el("director-load").addEventListener("click",() => {
    const item=saved.find((entry) => entry.id===el("director-saved").value); if (!item) return;
    plan=cleanPlan(item); renderPlan(); schedule(); el("director-status").textContent=tr().loaded;
  });
  el("director-delete").addEventListener("click",() => {
    const id=el("director-saved").value; if (!id || !confirm(tr().deleteConfirm)) return;
    saved=saved.filter((item) => item.id!==id); refreshSaved(); persist();
  });
  el("director-export").addEventListener("click",() => {
    const blob=new Blob([JSON.stringify({version:1,plans:saved},null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob),link=document.createElement("a"); link.href=url; link.download="ArtofTomworks_Director_Plans.json";
    document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url),1000);
  });
  el("director-import").addEventListener("click",() => el("director-import-file").click());
  el("director-import-file").addEventListener("change",async (event) => {
    const file=event.target.files?.[0]; if (!file) return;
    try {
      if (file.size>2_000_000) throw new Error(tr().badImport);
      const data=JSON.parse(await file.text()); if (data.version!==1 || !Array.isArray(data.plans)) throw new Error(tr().badImport);
      const imported=data.plans.slice(0,30).map(cleanPlan).filter(Boolean);
      saved=[...saved,...imported.filter((entry) => !saved.some((item) => item.id===entry.id))].slice(0,30);
      refreshSaved(); persist(); el("director-status").textContent=tr().imported;
    } catch { el("director-status").textContent=tr().badImport; }
    event.target.value="";
  });
  document.getElementById("ui-language")?.addEventListener("change",translate);
  translate(); renderPlan(); persist();
  return {
    linkMedia(item) {
      if (item?.kind!=="video") return;
      plan.linked={id:item.id,filename:item.filename,prompt:item.prompt || "",rating:item.rating || 0,category:item.category || ""};
      renderLinked(); schedule(); el("director-status").textContent=tr().linkedDone;
      panel.scrollIntoView({behavior:"smooth",block:"start"});
    },
    linkLabel() { return tr().archiveLink; }
  };
}
