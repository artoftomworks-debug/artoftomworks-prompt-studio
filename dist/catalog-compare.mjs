const fields = ["kind","model","width","height","duration","fps","frames","steps","cfg","seed","seeds","sampler","scheduler","loras"];
const hasValue = (value) => value !== undefined && value !== null && value !== "" && (!Array.isArray(value) || value.length > 0);
const uniqueWords = (text, other) => {
  const otherWords = new Set((other.toLocaleLowerCase().match(/[\p{L}\p{N}]{3,}/gu) || []));
  const found = new Set();
  return (text.toLocaleLowerCase().match(/[\p{L}\p{N}]{3,}/gu) || [])
    .filter((word) => !otherWords.has(word) && !found.has(word) && (found.add(word),true)).slice(0,12);
};
const valueFor = (item,key) => key === "kind" || key === "model" ? item?.[key] : item?.settings?.[key];
const sameValue = (a,b) => JSON.stringify(a) === JSON.stringify(b);

export function createTrialCatalogBridge({load,isBusy,apply,open,isOpen}){
 let pending=false;
 return async(a,b)=>{if(pending||isBusy()||isOpen()||typeof a!=='string'||typeof b!=='string'||!a||!b||a===b||a.length>100||b.length>100)return false;pending=true;try{const pair=await Promise.all([load(a),load(b)]);if(isBusy()||isOpen()||pair[0]?.id!==a||pair[1]?.id!==b)return false;apply(pair[0],pair[1]);await open();return isOpen();}catch{return false;}finally{pending=false;}};
}

export function compareCatalogItems(a,b) {
  if (!a || !b || a.id === b.id) throw new Error("Choose two distinct archive items");
  const rows = fields.map((key) => {
    const left = valueFor(a,key), right = valueFor(b,key);
    return { key, a:left, b:right, state:!hasValue(left) || !hasValue(right) ? "unknown" : sameValue(left,right) ? "same" : "different" };
  });
  const row = (key) => rows.find((entry) => entry.key === key);
  const notes = [];
  if (row("kind").state === "different") notes.push({key:"mixedMedia"});
  if (row("model").state === "different") notes.push({key:"modelChanged"});
  if (row("seed").state === "different") notes.push({key:"seedChanged"});
  const textDifference=(left,right)=>({state:!left||!right?"unknown":left===right?"same":"different",
    onlyA:left&&right?uniqueWords(left,right):[],onlyB:left&&right?uniqueWords(right,left):[]});
  const prompt=textDifference(a.prompt?.trim()||"",b.prompt?.trim()||"");
  const negative=textDifference(a.negative?.trim()||"",b.negative?.trim()||"");
  if (prompt.state === "different") notes.push({key:"promptChanged"});
  if (negative.state === "different") notes.push({key:"negativeChanged"});
  const pixelsA=Number(valueFor(a,"width"))*Number(valueFor(a,"height"));
  const pixelsB=Number(valueFor(b,"width"))*Number(valueFor(b,"height"));
  if (row("width").state !== "unknown" && row("height").state !== "unknown" && pixelsA !== pixelsB)
    notes.push({key:"morePixels",side:pixelsA>pixelsB ? "A" : "B"});
  for (const [field,key] of [["duration","longer"],["fps","moreFps"]]) {
    const entry=row(field);
    if (entry.state === "different" && Number.isFinite(Number(entry.a)) && Number.isFinite(Number(entry.b)))
      notes.push({key,side:Number(entry.a)>Number(entry.b) ? "A" : "B"});
  }
  const ratingA=Number(a.rating)||0, ratingB=Number(b.rating)||0;
  if (ratingA !== ratingB && ratingA && ratingB) notes.push({key:"preferred",side:ratingA>ratingB ? "A" : "B"});
  if (notes.length === 0) notes.push({key:"noMeasuredDifference"});
  return {rows,prompt,negative,notes,missing:rows.filter((entry) => entry.state === "unknown").map((entry) => entry.key)};
}

export const experimentStorageKey="artoftomworks.promptStudio.experiments.v1";

// A test plan based on readable metadata, never a claim about visual causality.
export function planNextExperiment(a,b,preferred) {
  const comparison=compareCatalogItems(a,b);
  const changed=comparison.rows.filter((row)=>row.state==="different").map((row)=>row.key);
  if(comparison.prompt.state==="different")changed.push("prompt");
  if(comparison.negative.state==="different")changed.push("negative");
  const winner=preferred==="A"||preferred==="B"?preferred:null;
  const sameModel=comparison.rows.find((row)=>row.key==="model")?.state==="same";
  const sameKind=comparison.rows.find((row)=>row.key==="kind")?.state==="same";
  const sameSeed=comparison.rows.find((row)=>row.key==="seed")?.state==="same";
  const observedOnly=changed.length===1&&sameModel&&sameSeed;
  // Start with a reversible prompt or setting test, not a model-family switch.
  const eligible=["prompt","negative","cfg","steps","sampler","scheduler"].find((key)=>changed.includes(key));
  return {
    winner,changed,confidence:!winner?"noPreference":!changed.length?"noReadableChange":observedOnly?"oneRecordedChange":"severalOrUnknown",
    next:winner&&sameModel&&sameKind&&eligible?{baseline:winner,field:eligible,alternative:winner==="A"?"B":"A"}:null
  };
}
const snapshot=(item)=>({
  id:String(item.id||""),filename:String(item.filename||"").slice(0,260),
  kind:String(item.kind||"").slice(0,20),model:String(item.model||"").slice(0,260),
  modified:String(item.modified||"").slice(0,40)
});
const minutes=(value)=>{
  if(value===""||value===undefined||value===null)return null;
  const number=Number(value);
  return Number.isFinite(number)&&number>=0&&number<=10000?Math.round(number*100)/100:null;
};
const journalValue=(value)=>{
  if(Array.isArray(value))return value.slice(0,16).map((item)=>item&&typeof item==="object"
    ? {name:String(item.name||"").slice(0,260),strength:Number.isFinite(Number(item.strength))?Number(item.strength):null}
    : String(item).slice(0,260));
  if(typeof value==="number"&&Number.isFinite(value))return value;
  if(typeof value==="boolean")return value;
  return String(value??"").slice(0,300);
};
export function createExperimentEntry(a,b,{title="",preferred="none",reason="",nextTest="",runMinutesA="",runMinutesB="",id=globalThis.crypto?.randomUUID?.()||`exp-${Date.now()}-${Math.random().toString(36).slice(2)}`,createdAt=new Date().toISOString()}={}) {
  const comparison=compareCatalogItems(a,b);
  const preference=["A","B","tie","none"].includes(preferred)?preferred:"none";
  const learning=planNextExperiment(a,b,preference);
  return {
    id:String(id||"").slice(0,80),createdAt:String(createdAt).slice(0,40),
    title:String(title||`${a.filename} ↔ ${b.filename}`).trim().slice(0,120),
    preferred:preference,reason:String(reason||"").trim().slice(0,1200),nextTest:String(nextTest||"").trim().slice(0,1200),
    learningConfidence:learning.confidence,
    a:snapshot(a),b:snapshot(b),
    changed:comparison.rows.filter((row)=>row.state==="different").map(({key,a:left,b:right})=>({key,a:left,b:right})),
    prompt:comparison.prompt,negative:comparison.negative,
    runMinutesA:minutes(runMinutesA),runMinutesB:minutes(runMinutesB)
  };
}
export function normalizeExperimentEntries(value) {
  const source=Array.isArray(value)?value:Array.isArray(value?.entries)?value.entries:[];
  const ids=new Set();
  return source.slice(0,250).filter((item)=>{
    if(!item||typeof item!=="object"||typeof item.id!=="string"||!item.id||ids.has(item.id)||
       !item.a?.id||!item.b?.id||item.a.id===item.b.id)return false;
    ids.add(item.id);return true;
  }).map((item)=>({
    id:String(item.id).slice(0,80),createdAt:String(item.createdAt||"").slice(0,40),
    title:String(item.title||"").slice(0,120),preferred:["A","B","tie","none"].includes(item.preferred)?item.preferred:"none",
    reason:String(item.reason||"").slice(0,1200),nextTest:String(item.nextTest||"").slice(0,1200),
    learningConfidence:["noPreference","noReadableChange","oneRecordedChange","severalOrUnknown"].includes(item.learningConfidence)?item.learningConfidence:"legacy",
    a:snapshot(item.a),b:snapshot(item.b),
    changed:Array.isArray(item.changed)?item.changed.slice(0,20).filter((row)=>fields.includes(row?.key))
      .map((row)=>({key:row.key,a:journalValue(row.a),b:journalValue(row.b)})):[],
    prompt:{state:["same","different","unknown"].includes(item.prompt?.state)?item.prompt.state:"unknown",
      onlyA:Array.isArray(item.prompt?.onlyA)?item.prompt.onlyA.slice(0,12).map((value)=>String(value).slice(0,100)):[],
      onlyB:Array.isArray(item.prompt?.onlyB)?item.prompt.onlyB.slice(0,12).map((value)=>String(value).slice(0,100)):[]},
    negative:{state:["same","different","unknown"].includes(item.negative?.state)?item.negative.state:"unknown",
      onlyA:Array.isArray(item.negative?.onlyA)?item.negative.onlyA.slice(0,12).map((value)=>String(value).slice(0,100)):[],
      onlyB:Array.isArray(item.negative?.onlyB)?item.negative.onlyB.slice(0,12).map((value)=>String(value).slice(0,100)):[]},
    runMinutesA:minutes(item.runMinutesA),runMinutesB:minutes(item.runMinutesB)
  }));
}

export const catalogCompareCopy = {
  EN:{ title:"A/B comparison", chooseA:"Select as A", chooseB:"Select as B", clear:"Clear", open:"Compare and analyze", close:"Close", empty:"Choose two different archive items.", preview:"Show A/B previews", hidden:"Previews are hidden until you choose to show them.", playBoth:"Play both", pauseBoth:"Pause both", facts:"Verified differences", tradeoffs:"Possible trade-offs", visual:"Visual observations", runVisual:"Analyze visible frames locally", working:"Analyzing selected frames locally…", visualMissing:"Local gemma3:4b vision model is unavailable. The verified comparison above still works.", visualFailed:"Visual analysis did not finish. The verified comparison above remains available.", visualNeedsPreview:"Show the previews first to request visual analysis.", disclaimer:"Visual notes are suggestions from selected frames, not objective quality scores. Video motion and sound are not assessed.", unknown:"Not readable", same:"Same", different:"Different", prompt:"Prompt", onlyA:"Only in A", onlyB:"Only in B", none:"None", kind:"Media type", model:"Model", width:"Width", height:"Height", duration:"Duration (s)", fps:"FPS", frames:"Frames", steps:"Steps", cfg:"CFG", seed:"Seed", sampler:"Sampler", scheduler:"Scheduler", loras:"LoRAs", mixedMedia:"Image and video are different media types; compare their look with care.", modelChanged:"The model changed, so other differences cannot be attributed to a single setting.", seedChanged:"The seed changed; this is not a controlled one-variable test.", promptChanged:"The prompt changed; check the words unique to each version below.", morePixels:"{side} has more pixels: potentially more detail, but often more work and memory. This is not a quality verdict.", longer:"{side} is longer: more time to show the scene, but potentially more work and continuity risk.", moreFps:"{side} has more FPS: potentially smoother playback, but more frames to process.", preferred:"You rated {side} higher. This records your preference, not an automatic quality score.", noMeasuredDifference:"No reliable difference was found in the readable fields. Visual results may still differ.", aStrengths:"A — strengths", aWeaknesses:"A — watch for", bStrengths:"B — strengths", bWeaknesses:"B — watch for", notable:"Visible differences", nextTest:"Suggested next test" },
  HU:{ title:"A/B összehasonlítás", chooseA:"Legyen A", chooseB:"Legyen B", clear:"Törlés", open:"Összevetés és elemzés", close:"Bezárás", empty:"Válassz két különböző archívumi elemet.", preview:"A/B előnézet mutatása", hidden:"Az előnézetek rejtve maradnak, amíg külön meg nem jeleníted őket.", playBoth:"Mindkettő indítása", pauseBoth:"Mindkettő megállítása", facts:"Biztosan kiolvasható eltérések", tradeoffs:"Lehetséges előnyök és kompromisszumok", visual:"Látvány alapján", runVisual:"Képkockák helyi elemzése", working:"Kijelölt képkockák helyi elemzése…", visualMissing:"A helyi gemma3:4b képelemző nem érhető el. A fenti biztos összevetés továbbra is használható.", visualFailed:"A képi elemzés nem fejeződött be. A biztos összevetés megmaradt.", visualNeedsPreview:"A képi elemzéshez előbb jelenítsd meg az előnézeteket.", disclaimer:"A képi észrevételek kijelölt képkockákból készült javaslatok, nem objektív minőségi pontszámok. A videó mozgását és hangját nem értékelik.", unknown:"Nem olvasható ki", same:"Azonos", different:"Eltér", prompt:"Prompt", onlyA:"Csak A-ban", onlyB:"Csak B-ben", none:"Nincs", kind:"Média típusa", model:"Modell", width:"Szélesség", height:"Magasság", duration:"Időtartam (mp)", fps:"FPS", frames:"Képkockák", steps:"Lépések", cfg:"CFG", seed:"Seed", sampler:"Sampler", scheduler:"Scheduler", loras:"LoRA-k", mixedMedia:"A kép és videó eltérő médiatípus; a látványukat óvatosan vesd össze.", modelChanged:"A modell megváltozott, ezért a különbség nem tulajdonítható egyetlen beállításnak.", seedChanged:"A seed megváltozott; ez nem egyszempontos, kontrollált próba.", promptChanged:"A prompt megváltozott; lent láthatod a csak az egyik változatban szereplő szavakat.", morePixels:"{side} több képpontot tartalmaz: részletesebb lehet, de több erőforrást igényelhet. Ez nem minőségi ítélet.", longer:"{side} hosszabb: több idő jut a jelenetre, de a folytonosság és a feldolgozás is nehezebb lehet.", moreFps:"{side} magasabb FPS-sel készült: simább lejátszás lehetséges, de több képkockát kell feldolgozni.", preferred:"{side} nálad több csillagot kapott. Ez a te ízlésedet jelzi, nem automatikus minőségi pontszám.", noMeasuredDifference:"A kiolvasható mezőkben nincs biztos eltérés. A látvány ettől még különbözhet.", aStrengths:"A – erősségek", aWeaknesses:"A – figyelj erre", bStrengths:"B – erősségek", bWeaknesses:"B – figyelj erre", notable:"Látható eltérések", nextTest:"Javasolt következő próba" },
  DE:{title:"A/B-Vergleich",chooseA:"Als A wählen",chooseB:"Als B wählen",clear:"Leeren",open:"Vergleichen und analysieren",close:"Schließen",empty:"Zwei verschiedene Archivdateien wählen.",preview:"A/B-Vorschau anzeigen",hidden:"Vorschau bleibt verborgen, bis Sie sie einblenden.",playBoth:"Beide starten",pauseBoth:"Beide anhalten",facts:"Sicher lesbare Unterschiede",tradeoffs:"Mögliche Vor- und Nachteile",visual:"Visuelle Beobachtungen",runVisual:"Bilder lokal analysieren",working:"Lokale Bildanalyse…",visualMissing:"Lokales gemma3:4b nicht verfügbar. Der Datenvergleich bleibt nutzbar.",visualFailed:"Visuelle Analyse fehlgeschlagen. Der Datenvergleich bleibt erhalten.",visualNeedsPreview:"Zuerst die Vorschau anzeigen.",disclaimer:"Visuelle Hinweise beruhen auf ausgewählten Bildern, nicht auf objektiven Qualitätswerten. Bewegung und Ton werden nicht bewertet.",unknown:"Nicht lesbar",same:"Gleich",different:"Anders",prompt:"Prompt",onlyA:"Nur in A",onlyB:"Nur in B",none:"Keine",kind:"Medientyp",model:"Modell",width:"Breite",height:"Höhe",duration:"Dauer (s)",fps:"FPS",frames:"Bilder",steps:"Schritte",cfg:"CFG",seed:"Seed",sampler:"Sampler",scheduler:"Scheduler",loras:"LoRAs",mixedMedia:"Bild und Video sind verschiedene Medientypen.",modelChanged:"Das Modell ist anders; Unterschiede lassen sich nicht einer Einstellung zuschreiben.",seedChanged:"Der Seed ist anders; dies ist kein Test mit nur einer Variable.",promptChanged:"Der Prompt ist anders; die jeweiligen Wörter stehen unten.",morePixels:"{side} hat mehr Pixel: möglicherweise mehr Details, aber mehr Aufwand. Kein Qualitätsurteil.",longer:"{side} ist länger: mehr Szenenzeit, aber möglicherweise mehr Aufwand und Kontinuitätsrisiko.",moreFps:"{side} hat mehr FPS: möglicherweise flüssiger, aber mehr Bilder.",preferred:"Sie haben {side} höher bewertet; das ist Ihre Vorliebe, kein Qualitätswert.",noMeasuredDifference:"In lesbaren Feldern kein sicherer Unterschied. Das Aussehen kann dennoch abweichen.",aStrengths:"A – Stärken",aWeaknesses:"A – beachten",bStrengths:"B – Stärken",bWeaknesses:"B – beachten",notable:"Sichtbare Unterschiede",nextTest:"Nächster Test"},
  FR:{title:"Comparaison A/B",chooseA:"Choisir A",chooseB:"Choisir B",clear:"Effacer",open:"Comparer et analyser",close:"Fermer",empty:"Choisissez deux éléments différents.",preview:"Afficher les aperçus A/B",hidden:"Aperçus masqués jusqu'à votre demande.",playBoth:"Lire les deux",pauseBoth:"Arrêter les deux",facts:"Différences vérifiables",tradeoffs:"Avantages et compromis possibles",visual:"Observations visuelles",runVisual:"Analyser les images localement",working:"Analyse locale des images…",visualMissing:"gemma3:4b local indisponible. La comparaison des données reste disponible.",visualFailed:"Analyse visuelle incomplète. La comparaison reste disponible.",visualNeedsPreview:"Affichez d'abord les aperçus.",disclaimer:"Observations issues d'images sélectionnées, pas de notes objectives. Le mouvement et le son ne sont pas évalués.",unknown:"Illisible",same:"Identique",different:"Différent",prompt:"Prompt",onlyA:"Seulement A",onlyB:"Seulement B",none:"Aucun",kind:"Type",model:"Modèle",width:"Largeur",height:"Hauteur",duration:"Durée (s)",fps:"IPS",frames:"Images",steps:"Étapes",cfg:"CFG",seed:"Seed",sampler:"Échantillonneur",scheduler:"Planificateur",loras:"LoRA",mixedMedia:"Image et vidéo sont des médias différents.",modelChanged:"Le modèle a changé ; impossible d'attribuer l'écart à un seul réglage.",seedChanged:"Le seed a changé ; ce n'est pas un essai à variable unique.",promptChanged:"Le prompt a changé ; voyez les mots propres à chaque version.",morePixels:"{side} a plus de pixels : détails possibles, mais coût supérieur. Aucun verdict qualitatif.",longer:"{side} est plus long : plus de temps, mais continuité et calcul potentiellement plus difficiles.",moreFps:"{side} a plus d'IPS : lecture potentiellement plus fluide, mais plus d'images.",preferred:"Vous avez mieux noté {side} ; c'est votre préférence, non une mesure objective.",noMeasuredDifference:"Aucune différence fiable dans les champs lisibles. Le rendu peut différer.",aStrengths:"A – points forts",aWeaknesses:"A – vigilance",bStrengths:"B – points forts",bWeaknesses:"B – vigilance",notable:"Différences visibles",nextTest:"Prochain essai suggéré"},
  ES:{title:"Comparación A/B",chooseA:"Elegir A",chooseB:"Elegir B",clear:"Borrar",open:"Comparar y analizar",close:"Cerrar",empty:"Elige dos elementos distintos.",preview:"Mostrar vistas A/B",hidden:"Las vistas siguen ocultas hasta que las muestres.",playBoth:"Reproducir ambos",pauseBoth:"Pausar ambos",facts:"Diferencias verificables",tradeoffs:"Posibles ventajas y compromisos",visual:"Observaciones visuales",runVisual:"Analizar fotogramas localmente",working:"Analizando imágenes localmente…",visualMissing:"gemma3:4b local no disponible. La comparación de datos sigue disponible.",visualFailed:"El análisis visual no terminó. La comparación sigue disponible.",visualNeedsPreview:"Muestra primero las vistas previas.",disclaimer:"Notas basadas en imágenes seleccionadas, no puntuaciones objetivas. No se evalúan movimiento ni sonido.",unknown:"No legible",same:"Igual",different:"Distinto",prompt:"Prompt",onlyA:"Solo en A",onlyB:"Solo en B",none:"Ninguno",kind:"Tipo",model:"Modelo",width:"Ancho",height:"Alto",duration:"Duración (s)",fps:"FPS",frames:"Fotogramas",steps:"Pasos",cfg:"CFG",seed:"Seed",sampler:"Sampler",scheduler:"Scheduler",loras:"LoRA",mixedMedia:"Imagen y vídeo son tipos distintos.",modelChanged:"Cambió el modelo; no se puede atribuir la diferencia a un ajuste.",seedChanged:"Cambió el seed; no es una prueba de una sola variable.",promptChanged:"Cambió el prompt; abajo se muestran las palabras exclusivas.",morePixels:"{side} tiene más píxeles: quizá más detalle, pero más coste. No es un veredicto de calidad.",longer:"{side} dura más: más escena, pero puede costar más mantener continuidad.",moreFps:"{side} tiene más FPS: quizá más fluidez, pero más fotogramas.",preferred:"Valoraste {side} más alto; es tu preferencia, no una nota objetiva.",noMeasuredDifference:"No hay diferencias fiables en los campos legibles. El aspecto aún puede variar.",aStrengths:"A – ventajas",aWeaknesses:"A – atención",bStrengths:"B – ventajas",bWeaknesses:"B – atención",notable:"Diferencias visibles",nextTest:"Siguiente prueba sugerida"},
  IT:{title:"Confronto A/B",chooseA:"Scegli A",chooseB:"Scegli B",clear:"Cancella",open:"Confronta e analizza",close:"Chiudi",empty:"Scegli due elementi diversi.",preview:"Mostra anteprime A/B",hidden:"Le anteprime restano nascoste finché non le mostri.",playBoth:"Avvia entrambi",pauseBoth:"Ferma entrambi",facts:"Differenze verificabili",tradeoffs:"Possibili vantaggi e compromessi",visual:"Osservazioni visive",runVisual:"Analizza fotogrammi in locale",working:"Analisi locale delle immagini…",visualMissing:"gemma3:4b locale non disponibile. Il confronto dei dati resta utilizzabile.",visualFailed:"Analisi visiva non completata. Il confronto resta disponibile.",visualNeedsPreview:"Mostra prima le anteprime.",disclaimer:"Note basate su immagini selezionate, non su punteggi oggettivi. Movimento e audio non sono valutati.",unknown:"Non leggibile",same:"Uguale",different:"Diverso",prompt:"Prompt",onlyA:"Solo in A",onlyB:"Solo in B",none:"Nessuno",kind:"Tipo",model:"Modello",width:"Larghezza",height:"Altezza",duration:"Durata (s)",fps:"FPS",frames:"Fotogrammi",steps:"Passi",cfg:"CFG",seed:"Seed",sampler:"Sampler",scheduler:"Scheduler",loras:"LoRA",mixedMedia:"Immagine e video sono tipi diversi.",modelChanged:"Il modello è cambiato; differenze non attribuibili a una sola impostazione.",seedChanged:"Il seed è cambiato; non è una prova con una sola variabile.",promptChanged:"Il prompt è cambiato; vedi sotto le parole esclusive.",morePixels:"{side} ha più pixel: forse più dettagli, ma più lavoro. Non è un giudizio di qualità.",longer:"{side} è più lungo: più scena, ma forse più lavoro e rischio di incoerenza.",moreFps:"{side} ha più FPS: forse più fluidità, ma più fotogrammi.",preferred:"Hai valutato meglio {side}; è una preferenza, non un punteggio oggettivo.",noMeasuredDifference:"Nessuna differenza affidabile nei campi leggibili. L'aspetto può comunque cambiare.",aStrengths:"A – punti forti",aWeaknesses:"A – attenzione",bStrengths:"B – punti forti",bWeaknesses:"B – attenzione",notable:"Differenze visibili",nextTest:"Prossima prova suggerita"},
  PT:{title:"Comparação A/B",chooseA:"Escolher A",chooseB:"Escolher B",clear:"Limpar",open:"Comparar e analisar",close:"Fechar",empty:"Escolha dois itens diferentes.",preview:"Mostrar prévias A/B",hidden:"Prévias ocultas até as mostrar.",playBoth:"Reproduzir ambos",pauseBoth:"Parar ambos",facts:"Diferenças verificáveis",tradeoffs:"Possíveis vantagens e compromissos",visual:"Observações visuais",runVisual:"Analisar imagens localmente",working:"Análise local das imagens…",visualMissing:"gemma3:4b local indisponível. A comparação dos dados continua disponível.",visualFailed:"Análise visual incompleta. A comparação continua disponível.",visualNeedsPreview:"Mostre primeiro as prévias.",disclaimer:"Notas baseadas em imagens selecionadas, não em classificações objetivas. Movimento e som não são avaliados.",unknown:"Não legível",same:"Igual",different:"Diferente",prompt:"Prompt",onlyA:"Só em A",onlyB:"Só em B",none:"Nenhum",kind:"Tipo",model:"Modelo",width:"Largura",height:"Altura",duration:"Duração (s)",fps:"FPS",frames:"Fotogramas",steps:"Passos",cfg:"CFG",seed:"Seed",sampler:"Sampler",scheduler:"Scheduler",loras:"LoRA",mixedMedia:"Imagem e vídeo são tipos diferentes.",modelChanged:"O modelo mudou; diferenças não se atribuem a uma definição só.",seedChanged:"O seed mudou; não é um teste de variável única.",promptChanged:"O prompt mudou; veja as palavras exclusivas abaixo.",morePixels:"{side} tem mais píxeis: talvez mais detalhe, mas mais trabalho. Não é um veredicto de qualidade.",longer:"{side} é mais longo: mais tempo de cena, mas possível custo e risco de continuidade.",moreFps:"{side} tem mais FPS: talvez mais fluidez, mas mais fotogramas.",preferred:"Avaliou {side} melhor; é a sua preferência, não uma nota objetiva.",noMeasuredDifference:"Sem diferença fiável nos campos legíveis. O aspeto pode diferir.",aStrengths:"A – pontos fortes",aWeaknesses:"A – atenção",bStrengths:"B – pontos fortes",bWeaknesses:"B – atenção",notable:"Diferenças visíveis",nextTest:"Próximo teste sugerido"},
  PL:{title:"Porównanie A/B",chooseA:"Wybierz A",chooseB:"Wybierz B",clear:"Wyczyść",open:"Porównaj i analizuj",close:"Zamknij",empty:"Wybierz dwa różne elementy.",preview:"Pokaż podgląd A/B",hidden:"Podgląd pozostaje ukryty, dopóki go nie włączysz.",playBoth:"Odtwórz oba",pauseBoth:"Zatrzymaj oba",facts:"Potwierdzone różnice",tradeoffs:"Możliwe zalety i kompromisy",visual:"Obserwacje wizualne",runVisual:"Analizuj klatki lokalnie",working:"Lokalna analiza obrazów…",visualMissing:"Lokalny gemma3:4b niedostępny. Porównanie danych pozostaje dostępne.",visualFailed:"Analiza wizualna nie zakończyła się. Porównanie pozostaje dostępne.",visualNeedsPreview:"Najpierw pokaż podgląd.",disclaimer:"Uwagi z wybranych klatek nie są obiektywną oceną jakości. Ruch i dźwięk nie są oceniane.",unknown:"Nieodczytane",same:"Takie same",different:"Różne",prompt:"Prompt",onlyA:"Tylko w A",onlyB:"Tylko w B",none:"Brak",kind:"Typ",model:"Model",width:"Szerokość",height:"Wysokość",duration:"Czas (s)",fps:"FPS",frames:"Klatki",steps:"Kroki",cfg:"CFG",seed:"Seed",sampler:"Sampler",scheduler:"Scheduler",loras:"LoRA",mixedMedia:"Obraz i film to różne typy mediów.",modelChanged:"Model się zmienił; różnic nie można przypisać jednemu ustawieniu.",seedChanged:"Seed się zmienił; nie jest to test jednej zmiennej.",promptChanged:"Prompt się zmienił; poniżej widać słowa unikalne dla każdej wersji.",morePixels:"{side} ma więcej pikseli: możliwa większa szczegółowość, ale większy koszt. To nie ocena jakości.",longer:"{side} jest dłuższy: więcej czasu sceny, ale możliwy większy koszt i ryzyko spójności.",moreFps:"{side} ma więcej FPS: możliwa płynność, ale więcej klatek.",preferred:"Wyżej oceniono {side}; to Twoja preferencja, nie obiektywna punktacja.",noMeasuredDifference:"Brak pewnych różnic w odczytanych polach. Obraz nadal może się różnić.",aStrengths:"A – zalety",aWeaknesses:"A – uwagi",bStrengths:"B – zalety",bWeaknesses:"B – uwagi",notable:"Widoczne różnice",nextTest:"Sugerowany następny test"}
};
for (const [language,labels] of Object.entries({
  EN:["Negative prompt","The readable negative prompts differ; check those terms too."],
  HU:["Negatív prompt","A kiolvasható negatív promptok is eltérnek; ezeket is vedd figyelembe."],
  DE:["Negativ-Prompt","Die lesbaren Negativ-Prompts unterscheiden sich."],
  FR:["Prompt négatif","Les prompts négatifs lisibles diffèrent également."],
  ES:["Prompt negativo","También cambian los prompts negativos legibles."],
  IT:["Prompt negativo","Anche i prompt negativi leggibili sono diversi."],
  PT:["Prompt negativo","Os prompts negativos legíveis também são diferentes."],
  PL:["Negatywny prompt","Odczytane negatywne prompty także się różnią."]
})) { catalogCompareCopy[language].negative=labels[0]; catalogCompareCopy[language].negativeChanged=labels[1]; }
for (const [language,label] of Object.entries({EN:"Stage seeds",HU:"Szakasz seedek",DE:"Stufen-Seeds",FR:"Seeds des étapes",ES:"Seeds por etapa",IT:"Seed delle fasi",PT:"Seeds das fases",PL:"Seedy etapów"}))
  catalogCompareCopy[language].seeds=label;
for (const [language,labels] of Object.entries({
  EN:["Reading current metadata…","Could not verify both files. Refresh the archive and try again."],
  HU:["Aktuális metaadatok beolvasása…","Nem sikerült mindkét fájlt ellenőrizni. Frissítsd az archívumot, majd próbáld újra."],
  DE:["Aktuelle Metadaten lesen…","Beide Dateien konnten nicht geprüft werden. Archiv aktualisieren."],
  FR:["Lecture des métadonnées actuelles…","Impossible de vérifier les deux fichiers. Actualisez l'archive."],
  ES:["Leyendo metadatos actuales…","No se pudieron verificar ambos archivos. Actualiza el archivo."],
  IT:["Lettura dei metadati attuali…","Impossibile verificare entrambi i file. Aggiorna l'archivio."],
  PT:["A ler metadados atuais…","Não foi possível verificar ambos os ficheiros. Atualize o arquivo."],
  PL:["Odczytywanie aktualnych metadanych…","Nie udało się sprawdzić obu plików. Odśwież archiwum."]
})) { catalogCompareCopy[language].checking=labels[0]; catalogCompareCopy[language].dataFailed=labels[1]; }
