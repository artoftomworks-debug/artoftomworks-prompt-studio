export const continueHomeKey='artoftomworks.v2.continueHome';
export const continueHomeLanguages=['EN','HU','DE','FR','ES','IT','PT','PL'];
// Navigation targets only. Processing/deletion buttons are never activated.
export const continueHomeTools=[
 {id:'sound-workshop',target:'sound-workshop',title:'Sound workshop|Hangműhely|Klangwerkstatt|Atelier sonore|Taller de sonido|Laboratorio audio|Oficina de som|Pracownia dźwięku',aliases:'audio sound narration voice wrestling arena ambience effects music sample favorites saved mood hangműhely hangtár hang narráció felkonferálás eső zene hangeffekt'},
 {id:'video-workshop',target:'video-workshop',title:'Video workshop|Videóműhely|Videowerkstatt|Atelier vidéo|Taller de vídeo|Laboratorio video|Oficina de vídeo|Pracownia wideo',aliases:'timeline trim edit audio sound mix export video editor videóműhely videószerkesztő idővonal vágás hangkeverés hangerő'},
 {id:'image-workshop',target:'image-workshop',title:'Image workshop|Képműhely|Bildwerkstatt|Atelier image|Taller de imagen|Laboratorio immagini|Oficina de imagem|Pracownia obrazu',aliases:'editor layers mask background sky contrast exposure image editing look brush recipe shelf látványrecept receptpolc fényrecept képszerkesztő képműhely háttér égbolt réteg kijelölés kontraszt előtte utána'},
 {id:'trial',target:'trial-bench',title:'Creative trial bench|Alkotói próbapad|Kreativer Prüfstand|Banc d’essai créatif|Banco de pruebas creativo|Banco di prova creativo|Bancada criativa|Pracownia prób',aliases:'experiment comparison variants test lighting style próba próbapad kísérlet változat összehasonlítás'},
 {id:'series',target:'series-planner',title:'Series planner|Sorozattervező|Serienplaner|Planificateur de série|Planificador de series|Pianificatore di serie|Planeador de séries|Planer serii',aliases:'scene shot sequence jelenet sorozat képsor video film'},
 {id:'publication',target:'publication-desk',title:'Publication desk|Publikálási asztal|Veröffentlichungstisch|Atelier de publication|Mesa de publicación|Banco di pubblicazione|Mesa de publicação|Biurko publikacji',aliases:'publish export zip keywords copy cím leírás kulcsszó másolás közzététel feltöltés publikálás'},
 {id:'studio',target:'virtual-studio',title:'Virtual studio · lights and camera|Virtuális stúdió · fények és kamera|Virtuelles Studio · Licht und Kamera|Studio virtuel · lumière et caméra|Estudio virtual · luz y cámara|Studio virtuale · luci e camera|Estúdio virtual · luz e câmara|Wirtualne studio · światła i kamera',aliases:'lighting lens angle movement megvilágítás fény lámpa szög kameramozgás objektív fényműhely referencia fényterv reference relight preview'},
 {id:'archive',target:'catalog-title',title:'Media archive|Médiaarchívum|Medienarchiv|Archive média|Archivo multimedia|Archivio multimediale|Arquivo multimédia|Archiwum mediów',aliases:'gallery search date image video find bélyegkép galéria dátum keresés archívum kép videó'},
 {id:'cleanup',target:'catalog-cleanup',title:'Cleanup suggestions|Takarítási javaslatok|Aufräumvorschläge|Suggestions de nettoyage|Sugerencias de limpieza|Suggerimenti pulizia|Sugestões de limpeza|Sugestie porządkowania',aliases:'delete remove duplicate trash törlés töröl takarítás duplikált másolat lomtár supprimer eliminar eliminare limpar usun'},
 {id:'recipes',target:'creative-recipes',title:'Proven recipes and creative mixes|Bevált receptek és alkotói keverések|Bewährte Rezepte und Mischungen|Recettes éprouvées et mélanges|Recetas probadas y mezclas|Ricette collaudate e mix|Receitas comprovadas e misturas|Sprawdzone przepisy i mieszanki',aliases:'style mix saved favorite glamour scifi surreal stílus keverés bevált recept kedvenc'},
 {id:'workbench',target:'prompt-workbench',title:'Prompt workbench|Promptműhely|Prompt-Werkstatt|Atelier de prompts|Taller de prompts|Laboratorio prompt|Oficina de prompts|Warsztat promptów',aliases:'copy kopieren copier copiar copia kopiuj edit correction original prompt másolás javítás szerkesztés eredeti szöveg'},
 {id:'surprise',target:'surprise-title',title:'Surprise me with a prompt|Lepj meg egy prompttal|Überrasche mich mit einem Prompt|Surprenez-moi avec un prompt|Sorpréndeme con un prompt|Sorprendimi con un prompt|Surpreenda-me com um prompt|Zaskocz mnie promptem',aliases:'inspiration random idea meglepetés ötlet véletlen inspiráció'},
 {id:'ai',target:'ai-hub-open',activate:true,title:'AI helper|MI-segítő|KI-Helfer|Assistant IA|Ayudante IA|Assistente IA|Assistente IA|Pomocnik AI',aliases:'ollama gemma qwen artificial intelligence ask mesterséges intelligencia kérdezd segítő fordítás'},
 {id:'image',target:'mode-image',mode:'image',title:'Image prompt|Képprompt|Bildprompt|Prompt image|Prompt imagen|Prompt immagine|Prompt imagem|Prompt obrazu',aliases:'photo photography painting kép fotó festmény render'},
 {id:'video',target:'mode-video',mode:'video',title:'Video prompt|Videóprompt|Videoprompt|Prompt vidéo|Prompt vídeo|Prompt video|Prompt vídeo|Prompt wideo',aliases:'text to video motion t2v mozgás videó szövegből'},
 {id:'i2v',target:'i2v-workspace',mode:'i2v',title:'Image to video|Képből videó|Bild zu Video|Image vers vidéo|Imagen a vídeo|Immagine a video|Imagem para vídeo|Obraz do wideo',aliases:'i2v animate motion sound camera képből animálás mozgás hang kamera'},
 {id:'i2i',target:'i2i-workspace',mode:'i2i',title:'Image to image|Képből kép|Bild zu Bild|Image vers image|Imagen a imagen|Immagine a immagine|Imagem para imagem|Obraz do obrazu',aliases:'i2i reimagine change modify reference átalakítás módosítás referenciakép'},
 {id:'director',target:'director-title',title:'Director timeline|Rendezői idővonal|Regie-Zeitleiste|Chronologie réalisateur|Línea de dirección|Timeline regia|Linha de realização|Oś czasu reżysera',aliases:'video scene timeline sound hang videó jelenet idővonal kamera történet'}
];
export const continueToolLabel=(tool,language='EN')=>tool.title.split('|')[Math.max(0,continueHomeLanguages.indexOf(language))];
const homeFold=value=>String(value||'').normalize('NFD').replace(/\p{M}/gu,'').toLocaleLowerCase();
export function searchContinueTools(query,language='EN'){
 const terms=homeFold(query).trim().slice(0,160).split(/\s+/).filter(Boolean);if(!terms.length)return [];
 return continueHomeTools.filter(tool=>{const hay=homeFold(tool.title+' '+tool.aliases);return terms.every(term=>hay.includes(term));}).sort((a,b)=>Number(homeFold(continueToolLabel(b,language)).startsWith(terms[0]))-Number(homeFold(continueToolLabel(a,language)).startsWith(terms[0])));
}
const homeClone=value=>JSON.parse(JSON.stringify(value));
export function normalizeContinuePreferences(raw={}){
 if(raw.version!==undefined&&raw.version!==1)throw Error('format');
 const allowed=new Set(continueHomeTools.map(t=>t.id));
 const favorites=raw.favorites===undefined?['series','publication','archive','studio']:raw.favorites;
 if(!Array.isArray(favorites)||favorites.some(id=>!allowed.has(id))||favorites.length>6)throw Error('format');
 const history=(Array.isArray(raw.history)?raw.history:[]).slice(0,50).map(h=>{if(!['series','publication','trial'].includes(h?.kind)||typeof h.id!=='string'||!h.id||h.id.length>100||!Number.isFinite(h.at)||h.at<0)throw Error('format');return {kind:h.kind,id:h.id,at:h.at};});
 return {version:1,note:String(raw.note??'').replace(/\u0000/g,'').slice(0,1500),showOnStart:raw.showOnStart!==false,favorites:[...new Set(favorites)],history};
}
export function createContinueStore(storage){
 let raw=null,state=normalizeContinuePreferences(),problem=false;
 try{raw=storage.getItem(continueHomeKey);if(raw){if(raw.length>20000)throw Error();state=normalizeContinuePreferences(JSON.parse(raw));}}catch{problem=true;}
 const commit=next=>{if(problem)throw Error('storage');if(storage.getItem(continueHomeKey)!==raw)throw Error('conflict');const normalized=normalizeContinuePreferences(next),text=JSON.stringify(normalized);storage.setItem(continueHomeKey,text);raw=text;state=normalized;return homeClone(state);};
 return {read:()=>homeClone(state),problem:()=>problem,update:patch=>commit({...state,...patch}),touch(kind,id){if(!['series','publication','trial'].includes(kind)||typeof id!=='string'||!id||id.length>100)return;const history=[{kind,id,at:Date.now()},...state.history.filter(h=>h.kind!==kind||h.id!==id)].slice(0,50);return commit({...state,history});}};
}
export function continueWorkCards(data={},preferences=normalizeContinuePreferences()){
 const recent=new Map(preferences.history.map(h=>[h.kind+':'+h.id,h.at])),cards=[];
 for(const [index,p]of (Array.isArray(data.series)?data.series:[]).entries()){
  if(!p?.id||!Array.isArray(p.scenes))continue;const completed=p.scenes.filter(s=>['created','proven'].includes(s.status)).length,next=p.scenes.find(s=>s.status==='planned');
  cards.push({kind:'series',id:p.id,title:String(p.title||''),completed,total:p.scenes.length,nextScene:next?String(next.title||''):'',publication:p.publicationStatus||'none',at:recent.get('series:'+p.id)||0,order:index});
 }
 for(const [index,p]of (Array.isArray(data.publications)?data.publications:[]).entries()){
  if(!p?.id)continue;const needed=['image','cover','text'];if(p.sources?.some(s=>s.kind==='video'))needed.splice(1,0,'audio');
  let nextCheck=needed.find(key=>!p.checks?.[key])||'';if(!p.sources?.length)nextCheck='source';else if(!p.ready&&!nextCheck)nextCheck='copy';
  cards.push({kind:'publication',id:p.id,title:String(p.name||''),ready:p.ready===true,nextCheck,at:recent.get('publication:'+p.id)||0,order:index});
 }
 for(const [index,p]of (Array.isArray(data.trials)?data.trials:[]).entries())if(p?.id)cards.push({kind:'trial',id:p.id,title:String(p.title||''),completed:Number(p.completed)||0,total:p.variants?.length||0,at:recent.get('trial:'+p.id)||0,order:index});
 return cards.sort((a,b)=>b.at-a.at||b.order-a.order||a.kind.localeCompare(b.kind)).slice(0,6);
}
export function openContinueTool(id,{setMode=()=>{},doc=globalThis.document}={}){
 const tool=continueHomeTools.find(t=>t.id===id);if(!tool)return false;
 if(tool.mode)setMode(tool.mode);const target=doc.getElementById(tool.target);if(!target)return false;
 for(let parent=target;parent;parent=parent.parentElement){if(parent.tagName==='DETAILS')parent.open=true;if(parent.hidden)return false;}
 if(tool.activate)target.click();else{target.scrollIntoView({behavior:'smooth',block:'start'});if(!['BUTTON','INPUT','SELECT','TEXTAREA','A'].includes(target.tagName))target.setAttribute('tabindex','-1');target.focus?.({preventScroll:true});target.classList?.add('continue-home-target');setTimeout(()=>target.classList?.remove('continue-home-target'),1500);}
 return true;
}
