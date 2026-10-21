const negativeUi = {
  EN:{label:"Negative prompt (optional)",suggest:"Suggest exclusions",copy:"Copy negative prompt",copied:"Copied",hint:"Use this separately only if your workflow has a negative prompt input. Suggestions are editable, not rules.",source:"Things to avoid → negative prompt"},
  HU:{label:"Negatív prompt (opcionális)",suggest:"Javasolj kizárásokat",copy:"Negatív prompt másolása",copied:"Másolva",hint:"Csak akkor illeszd külön a workflow-ba, ha van negatív prompt bemenete. A javaslatok szabadon módosíthatók.",source:"Kerülendő elemek → negatív prompt"},
  DE:{label:"Negativer Prompt (optional)",suggest:"Ausschlüsse vorschlagen",copy:"Negativen Prompt kopieren",copied:"Kopiert",hint:"Nur bei einem separaten negativen Workflow-Eingang verwenden. Vorschläge sind bearbeitbar.",source:"Zu vermeiden → negativer Prompt"},
  FR:{label:"Prompt négatif (facultatif)",suggest:"Suggérer des exclusions",copy:"Copier le prompt négatif",copied:"Copié",hint:"À utiliser séparément seulement si le workflow possède une entrée négative. Suggestions modifiables.",source:"À éviter → prompt négatif"},
  ES:{label:"Prompt negativo (opcional)",suggest:"Sugerir exclusiones",copy:"Copiar prompt negativo",copied:"Copiado",hint:"Úsalo por separado solo si el workflow tiene entrada negativa. Puedes editar las sugerencias.",source:"Evitar → prompt negativo"},
  IT:{label:"Prompt negativo (facoltativo)",suggest:"Suggerisci esclusioni",copy:"Copia prompt negativo",copied:"Copiato",hint:"Usalo separatamente solo se il workflow ha un ingresso negativo. Suggerimenti modificabili.",source:"Da evitare → prompt negativo"},
  PT:{label:"Prompt negativo (opcional)",suggest:"Sugerir exclusões",copy:"Copiar prompt negativo",copied:"Copiado",hint:"Use separadamente apenas se o workflow tiver entrada negativa. Sugestões editáveis.",source:"Evitar → prompt negativo"},
  PL:{label:"Prompt negatywny (opcjonalnie)",suggest:"Zaproponuj wykluczenia",copy:"Kopiuj prompt negatywny",copied:"Skopiowano",hint:"Użyj osobno tylko wtedy, gdy workflow ma wejście negatywne. Propozycje można edytować.",source:"Unikaj → prompt negatywny"}
};

const contains=(value,words)=>words.test(String(value||""));
export function suggestNegativeClauses({prompt="",mode="image",theme=""}={}) {
  const text=`${prompt} ${theme}`.toLowerCase();
  const video=mode==="video"||mode==="i2v";
  const artistic=contains(text,/\b(?:painting|illustration|concept art|artwork|abstract|watercolor|graffiti|poster|oil paint|brushwork)\b/u);
  const people=contains(text,/\b(?:person|people|woman|man|adult|model|portrait|face|dancer|artist|musician|traveler|fashion|glamour)\b/u);
  const animals=contains(text,/\b(?:animal|wildlife|fox|cub|kingfisher|bird|deer|cat|dog|fur|feather)\b/u);
  const buildings=contains(text,/\b(?:architecture|building|library|house|courtyard|city|station|bridge)\b/u);
  const abstract=contains(text,/\b(?:abstract|ribbons|shapes|spiral|collage)\b/u);
  const items=[];
  if(video) items.push("flicker", "temporal inconsistency", "subject identity drift");
  if(people||animals) items.push("extra limbs", "distorted anatomy");
  if(people) items.push("inconsistent facial features");
  if(animals) items.push("unnatural fur or feather patterns");
  if(buildings) items.push("warped geometry", "impossible perspective");
  if(artistic) items.push("inconsistent medium or brushwork");
  else if(!video) items.push("plastic-looking surfaces", "oversharpening");
  if(abstract) items.push("muddy colors", "cluttered composition");
  if(video&&!contains(text,/\b(?:cut|montage|transition)\b/u))items.push("abrupt cuts");
  if(!contains(text,/\b(?:text|letter|sign|book|writing|poster|graffiti|caption|logo|typography)\b/u))items.push("unwanted text or logos");
  items.push("watermark");
  const positive=text.replace(/\b(?:no|without|avoid|not)\s+\w+/gu,"");
  return [...new Set(items)].filter((item)=>!positive.includes(item)).slice(0,9);
}

export function attachNegativeAdvisor({getLanguage,getMode}) {
  const areas={};
  const lastAutomatic={};
  const specs=[
    ["classic","prompt-output"],["i2v","i2v-prompt"],["i2i","i2i-prompt"],["surprise","surprise-output"]
  ];
  for(const [key,promptId] of specs){
    const positive=document.getElementById(promptId);
    if(!positive)continue;
    const section=document.createElement("div");section.className="negative-advisor";
    const label=document.createElement("label"),field=document.createElement("textarea"),actions=document.createElement("div"),suggest=document.createElement("button"),copy=document.createElement("button"),chips=document.createElement("div"),hint=document.createElement("p");
    field.id=`${key}-negative-prompt`;field.rows=3;field.maxLength=10000;label.htmlFor=field.id;
    actions.className="negative-actions";chips.className="negative-chips";hint.className="negative-hint";
    suggest.type="button";suggest.className="secondary-action";copy.type="button";copy.className="quiet-action";
    actions.append(suggest,copy);section.append(label,field,actions,chips,hint);
    const following=positive.closest(".result-card, .surprise-output")?.querySelector(".result-actions, .surprise-actions");
    if(following)following.insertAdjacentElement("beforebegin",section);else positive.insertAdjacentElement("afterend",section);
    areas[key]={positive,field,label,suggest,copy,chips,hint};
    const mode=()=>key==="surprise"?document.getElementById("surprise-kind")?.value||"image":key==="classic"?getMode():key;
    function renderChips(){
      const theme=key==="surprise"?document.getElementById("surprise-theme")?.value||"":"";
      chips.replaceChildren();
      for(const clause of suggestNegativeClauses({prompt:positive.value,mode:mode(),theme})){
        const button=document.createElement("button");button.type="button";button.className="negative-chip";button.textContent=clause;
        const selected=()=>field.value.split(",").some((part)=>part.trim().toLowerCase()===clause.toLowerCase());
        const refresh=()=>{button.setAttribute("aria-pressed",String(selected()));button.classList.toggle("selected",selected());};refresh();
        button.addEventListener("click",()=>{
          const parts=field.value.split(",").map((part)=>part.trim()).filter(Boolean);
          field.value=(selected()?parts.filter((part)=>part.toLowerCase()!==clause.toLowerCase()):[...parts,clause]).join(", ");
          field.dispatchEvent(new Event("input",{bubbles:true}));refresh();
        });chips.appendChild(button);
      }
    }
    suggest.addEventListener("click",renderChips);
    field.addEventListener("input",()=>{for(const button of chips.querySelectorAll("button")){const selected=field.value.split(",").some((part)=>part.trim().toLowerCase()===button.textContent.toLowerCase());button.setAttribute("aria-pressed",String(selected));button.classList.toggle("selected",selected);}});
    copy.addEventListener("click",async()=>{if(!field.value.trim())return;try{await navigator.clipboard.writeText(field.value.trim());copy.textContent=(negativeUi[getLanguage()]||negativeUi.EN).copied;setTimeout(()=>copy.textContent=(negativeUi[getLanguage()]||negativeUi.EN).copy,1500);}catch{field.focus();field.select();document.execCommand("copy");}});
  }
  let classicSourceKey="";
  function translate(){const t=negativeUi[getLanguage()]||negativeUi.EN;for(const area of Object.values(areas)){area.label.textContent=t.label;area.suggest.textContent=t.suggest;area.copy.textContent=t.copy;area.hint.textContent=t.hint;}const source=document.querySelector('label[for="negatives"]');if(source)source.textContent=t.source;}
  translate();document.getElementById("ui-language")?.addEventListener("change",translate);
  return {
    getText:(key)=>areas[key]?.field.value.trim()||"",
    setText:(key,value)=>{if(areas[key]){lastAutomatic[key]="";areas[key].field.value=String(value||"");areas[key].field.dispatchEvent(new Event("input",{bubbles:true}));}},
    syncClassic:(value,key)=>{if(key!==classicSourceKey){classicSourceKey=key;if(areas.classic)areas.classic.field.value=String(value||"");}},
    clear:(key)=>{if(areas[key]){lastAutomatic[key]="";areas[key].field.value="";areas[key].chips.replaceChildren();}},
    suggestFor:(key,{fill=false}={})=>{const area=areas[key];if(!area)return;area.suggest.click();if(fill&&(!area.field.value.trim()||area.field.value===lastAutomatic[key])){const automatic=[...area.chips.querySelectorAll("button")].slice(0,5).map((button)=>button.textContent).join(", ");area.field.value=automatic;lastAutomatic[key]=automatic;area.field.dispatchEvent(new Event("input",{bubbles:true}));}}
  };
}
