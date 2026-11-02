import {createPoseHelp,poseHelpLabels} from './pose-help.mjs';
export const poseReferenceMaxBytes=12*1024*1024;
const prTypes=['image/png','image/jpeg','image/webp','image/avif'];
const prNum=(v,d,min,max)=>v!==null&&v!==''&&Number.isFinite(Number(v))?Math.max(min,Math.min(max,Number(v))):d;
export function normalizePoseReferenceLayer(raw={}){return {opacity:prNum(raw.opacity,50,0,100),scale:prNum(raw.scale,100,10,400),offsetX:prNum(raw.offsetX,0,-200,200),offsetY:prNum(raw.offsetY,0,-200,200),rotation:prNum(raw.rotation,0,-180,180),visible:raw.visible!==false};}
export function poseReferenceBox(image,raw,context={}){
 const config=normalizePoseReferenceLayer(raw),camera=context.camera,k=Math.min((camera?.width||700)/image.width,(camera?.height||440)/image.height),factor=camera?1:context.transform.scale/context.frame.scale;
 let cx,cy,unitX,unitY;
 if(camera){unitX=camera.width/100;unitY=camera.height/100;cx=camera.x+camera.width/2+config.offsetX*unitX;cy=camera.y+camera.height/2+config.offsetY*unitY;}
 else {const tr=context.transform,frame=context.frame;unitX=7.6*factor;unitY=5*factor;cx=380+(frame.cx-tr.cx)*tr.scale+config.offsetX*unitX;cy=250-(frame.cy-tr.cy)*tr.scale+config.offsetY*unitY;}
 const width=image.width*k*factor*config.scale/100,height=image.height*k*factor*config.scale/100;
 return {x:cx-width/2,y:cy-height/2,width,height,cx,cy,unitX,unitY,rotation:config.rotation,opacity:config.opacity/100,clip:camera||null};
}
const prWords={
 help:'Reference usage notes|A referencia használata|Hinweise zur Referenz|Utilisation de la référence|Uso de la referencia|Uso del riferimento|Utilização da referência|Korzystanie z odniesienia',
 title:'Pose reference image|Póz referenciaképe|Posen-Referenzbild|Image de référence de pose|Imagen de referencia de pose|Immagine riferimento posa|Imagem de referência da pose|Obraz odniesienia pozy',
 choose:'Choose / drop image|Kép kiválasztása / behúzása|Bild wählen / ablegen|Choisir / déposer une image|Elegir / soltar imagen|Scegli / trascina immagine|Escolher / largar imagem|Wybierz / przeciągnij obraz',
 remove:'Remove image|Kép eltávolítása|Bild entfernen|Retirer l’image|Quitar imagen|Rimuovi immagine|Remover imagem|Usuń obraz',
 opacity:'Reference opacity (%)|Referencia láthatósága (%)|Referenzdeckkraft (%)|Opacité référence (%)|Opacidad referencia (%)|Opacità riferimento (%)|Opacidade da referência (%)|Krycie odniesienia (%)',
 scale:'Image size (%)|Kép mérete (%)|Bildgröße (%)|Taille image (%)|Tamaño imagen (%)|Dimensione immagine (%)|Tamanho da imagem (%)|Rozmiar obrazu (%)',
 offsetX:'Horizontal offset (%)|Vízszintes eltolás (%)|Horizontaler Versatz (%)|Décalage horizontal (%)|Desplazamiento horizontal (%)|Spostamento orizzontale (%)|Deslocamento horizontal (%)|Przesunięcie poziome (%)',
 offsetY:'Vertical offset (%)|Függőleges eltolás (%)|Vertikaler Versatz (%)|Décalage vertical (%)|Desplazamiento vertical (%)|Spostamento verticale (%)|Deslocamento vertical (%)|Przesunięcie pionowe (%)',
 rotation:'Image rotation (°)|Kép elfordítása (°)|Bilddrehung (°)|Rotation image (°)|Rotación imagen (°)|Rotazione immagine (°)|Rotação da imagem (°)|Obrót obrazu (°)',
 visible:'Show reference|Referencia megjelenítése|Referenz anzeigen|Afficher référence|Mostrar referencia|Mostra riferimento|Mostrar referência|Pokaż odniesienie',
 move:'Move image with mouse|Kép mozgatása egérrel|Bild mit Maus bewegen|Déplacer l’image à la souris|Mover imagen con ratón|Sposta immagine col mouse|Mover imagem com o rato|Przesuwaj obraz myszą',
 reset:'Reset image alignment|Kép igazításának visszaállítása|Bildausrichtung zurücksetzen|Réinitialiser l’alignement|Restablecer alineación|Ripristina allineamento|Repor alinhamento|Przywróć wyrównanie',
 empty:'Drop a PNG, JPG, WebP or AVIF here or onto the preview.|Húzz ide vagy az előnézetre PNG, JPG, WebP vagy AVIF képet.|PNG, JPG, WebP oder AVIF hier oder auf die Vorschau ziehen.|Déposez un PNG, JPG, WebP ou AVIF ici ou sur l’aperçu.|Suelta PNG, JPG, WebP o AVIF aquí o en la vista previa.|Trascina PNG, JPG, WebP o AVIF qui o sull’anteprima.|Largue PNG, JPG, WebP ou AVIF aqui ou na pré-visualização.|Upuść PNG, JPG, WebP lub AVIF tutaj albo na podglądzie.',
 hint:'Local visual guide only: no AI analysis or automatic pose detection. The image is excluded from prompts, pose exports and saved scene JSON. Reopen via Open in new tab to carry the currently loaded reference there.|Csak helyi vizuális támpont: nincs MI-elemzés vagy automatikus pózfelismerés. A kép nem kerül a promptba, pózexportba vagy mentett jelenet JSON-jába. A Megnyitás új lapon gomb az aktuális referenciát is átviszi.|Nur lokale visuelle Hilfe, keine KI-Analyse oder automatische Posenerkennung. Kein Bild in Prompts, Posenexporten oder Szenen-JSON. Neuer Tab übernimmt die aktuell geladene Referenz.|Guide visuel local sans analyse IA ni détection automatique. Image exclue des prompts, exports de pose et JSON de scène. Ouvrir un nouvel onglet transmet la référence actuelle.|Guía visual local sin análisis IA ni detección automática. Imagen excluida de prompts, exportaciones y JSON de escena. Nueva pestaña recibe la referencia actual.|Guida visiva locale senza analisi IA o rilevamento automatico. Immagine esclusa da prompt, export e JSON scena. La nuova scheda riceve il riferimento attuale.|Guia visual local sem análise IA nem deteção automática. Imagem excluída de prompts, exportações e JSON da cena. O novo separador recebe a referência atual.|Lokalna pomoc wizualna bez analizy AI i automatycznego wykrywania. Obraz pomijany w promptach, eksportach i JSON sceny. Nowa karta otrzymuje bieżący obraz.',
 loading:'Loading reference…|Referencia betöltése…|Referenz wird geladen…|Chargement…|Cargando…|Caricamento…|A carregar…|Wczytywanie…',
 loaded:'Reference ready. Align the figures by hand.|Referencia betöltve. Igazítsd rá kézzel a figurákat.|Referenz bereit. Figuren manuell ausrichten.|Référence prête. Alignez les personnages manuellement.|Referencia lista. Alinea las figuras manualmente.|Riferimento pronto. Allinea le figure a mano.|Referência pronta. Alinhe as figuras manualmente.|Obraz gotowy. Dopasuj postacie ręcznie.',
 failed:'Could not read this image. Use PNG/JPG/WebP/AVIF up to 12 MiB and 48 megapixels. The previous reference is kept.|A kép nem olvasható. PNG/JPG/WebP/AVIF használható, legfeljebb 12 MiB és 48 megapixel méretben. A korábbi referencia megmarad.|Bild nicht lesbar. PNG/JPG/WebP/AVIF bis 12 MiB und 48 Megapixel nutzen. Vorige Referenz bleibt erhalten.|Image illisible. PNG/JPG/WebP/AVIF jusqu’à 12 Mio et 48 mégapixels. Référence précédente conservée.|No se pudo leer. PNG/JPG/WebP/AVIF hasta 12 MiB y 48 megapíxeles. Se conserva la referencia anterior.|Immagine illeggibile. PNG/JPG/WebP/AVIF fino a 12 MiB e 48 megapixel. Riferimento precedente conservato.|Não foi possível ler. PNG/JPG/WebP/AVIF até 12 MiB e 48 megapíxeis. Referência anterior preservada.|Nie można odczytać. PNG/JPG/WebP/AVIF do 12 MiB i 48 megapikseli. Poprzedni obraz zachowany.',
 moving:'Image move mode: drag the picture; turn this off to pose the figures.|Képmozgatás: húzd az előnézetet; a figurák állításához kapcsold ki.|Bildbewegung: Vorschau ziehen; für Figuren ausschalten.|Mode image : glissez l’aperçu ; désactivez pour les personnages.|Modo imagen: arrastra la vista; desactívalo para las figuras.|Modalità immagine: trascina; disattiva per le figure.|Modo imagem: arraste; desative para as figuras.|Tryb obrazu: przeciągnij podgląd; wyłącz, aby ustawiać postacie.'
};
export function poseReferenceLabels(code='EN'){const i=Math.max(0,['EN','HU','DE','FR','ES','IT','PT','PL'].indexOf(code));return Object.fromEntries(Object.entries(prWords).map(([k,v])=>[k,v.split('|')[i]]));}
function prReadFile(file){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(Error('read'));reader.readAsDataURL(file);});}
async function prPrepare(dataURL){
 const decode=url=>new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(Error('decode'));image.src=url;});
 let image=await decode(dataURL),width=image.naturalWidth||image.width,height=image.naturalHeight||image.height;
 if(!width||!height||width*height>48000000||Math.max(width,height)>20000)throw Error('dimensions');
 if(Math.max(width,height)>2048){const factor=2048/Math.max(width,height),canvas=document.createElement('canvas');canvas.width=Math.round(width*factor);canvas.height=Math.round(height*factor);canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);dataURL=canvas.toDataURL('image/webp',.92);image=await decode(dataURL);width=canvas.width;height=canvas.height;}
 return {dataURL,width,height,resource:image};
}
export function attachPoseReference({host,getLanguage=()=> 'EN',onChange=()=>{},onReady=()=>{},readFile=prReadFile,prepare=prPrepare}={}){
 const t=()=>poseReferenceLabels(getLanguage()),el=tag=>document.createElement(tag),words=[],fields={};let image=null,config=normalizePoseReferenceLayer(),generation=0,statusKey='',moving=false;
 const bubbles=createPoseHelp(getLanguage);
 const root=el('details');root.className='pose-reference';root.open=true;const word=(tag,key)=>{const n=el(tag);words.push([n,key]);return n;};root.append(word('summary','title'));host.append(root);
 const drop=el('div');drop.className='pose-reference-drop';drop.append(word('p','empty'));const file=el('input');file.type='file';file.accept=prTypes.join(',');file.hidden=true;file.dataset.poseReference='file';drop.append(file);root.append(drop);
 const act=(key,fn)=>{const b=word('button',key);b.type='button';b.dataset.poseReferenceAction=key;b.addEventListener('click',fn);return b;};
 const actions=el('div');actions.className='vs-actions';actions.append(act('choose',()=>file.click()));const remove=act('remove',()=>clear());actions.append(remove);drop.append(actions);
 const filename=el('p');filename.className='pose-reference-name';root.append(filename);const controls=el('div');controls.className='pose-reference-fields';root.append(controls);
 for(const [key,type,min,max,step]of [['visible','checkbox'],['move','checkbox'],['opacity','range',0,100,1],['scale','range',10,400,1],['offsetX','number',-200,200,.1],['offsetY','number',-200,200,.1],['rotation','number',-180,180,.1]]){
  const label=el('label'),n=el('input');n.type=type;if(min!==undefined){n.min=min;n.max=max;n.step=step;}n.dataset.poseReference=key;label.append(word('span',key),n);controls.append(label);fields[key]=n;
  if(type==='range'){const out=el('output');label.append(out);n.prOutput=out;}
  n.addEventListener(type==='range'?'input':'change',()=>{if(type==='number'&&(n.value===''||!Number.isFinite(Number(n.value)))){refresh();return;}if(key==='move')moving=n.checked;else {config=normalizePoseReferenceLayer({...config,[key]:type==='checkbox'?n.checked:Number(n.value)});if(key==='visible'&&!n.checked)moving=false;}refresh();onChange();});
 }
 const reset=act('reset',()=>{config=normalizePoseReferenceLayer({...config,scale:100,offsetX:0,offsetY:0,rotation:0});refresh();onChange();});controls.append(reset);const help=el('details');help.className='pose-reference-help';help.append(word('summary','help'),word('p','hint'));root.append(help);const status=el('p');status.className='pose-reference-status';status.setAttribute('role','status');root.append(status);
 for(const [key,n]of Object.entries(fields))bubbles.add(n.parentElement,()=>key==='move'?t().moving:key==='visible'||key==='opacity'?t().hint:poseHelpLabels(getLanguage()).alignment,()=>t()[key]);
 const validURL=url=>typeof url==='string'&&url.length<=poseReferenceMaxBytes*1.5&&/^data:image\/(png|jpeg|webp|avif);base64,[A-Za-z0-9+/=\r\n]+$/.test(url);
 const release=record=>record?.resource?.close?.();
 async function accept(dataURL,name,settings,token){
  if(!validURL(dataURL))throw Error('format');const next=await prepare(dataURL);
  if(!validURL(next.dataURL)||!Number.isFinite(next.width)||!Number.isFinite(next.height)||next.width<=0||next.height<=0||next.width*next.height>48000000){release(next);throw Error('dimensions');}
  if(token!==generation){release(next);return false;}const old=image;image={...next,name:typeof name==='string'?name.slice(0,160):''};config=normalizePoseReferenceLayer(settings);moving=false;statusKey='loaded';release(old);onReady('loaded');refresh();onChange();return true;
 }
 async function loadFile(candidate){
  const token=++generation;try{if(!candidate||!prTypes.includes(candidate.type)||!Number.isFinite(candidate.size)||candidate.size<=0||candidate.size>poseReferenceMaxBytes)throw Error('file');statusKey='loading';refresh();return await accept(await readFile(candidate),candidate.name,{},token);}catch{if(token===generation){statusKey='failed';refresh();}return false;}
 }
 async function restore(snapshot){const token=++generation;try{if(!snapshot)return false;return await accept(snapshot.dataURL,snapshot.name,snapshot.config,token);}catch{if(token===generation){statusKey='failed';refresh();}return false;}}
 function clear(){generation++;release(image);image=null;moving=false;statusKey='';onReady('clear');refresh();onChange();}
 function refresh(){bubbles.refresh();for(const [n,key]of words)n.textContent=t()[key];filename.textContent=image?image.name+' · '+image.width+' × '+image.height:'';for(const [key,n]of Object.entries(fields)){const v=key==='move'?moving:config[key];if(n.type==='checkbox')n.checked=!!v;else if(n.value!==String(v))n.value=String(v);n.disabled=!image;n.setAttribute('aria-label',t()[key]);if(n.prOutput)n.prOutput.textContent=n.value+'%';}remove.disabled=reset.disabled=!image;status.textContent=moving?t().moving:t()[statusKey]||'';}
 file.addEventListener('change',async()=>{const candidate=file.files?.[0];if(candidate)await loadFile(candidate);file.value='';});
 function bindDrop(target){target.addEventListener('dragover',event=>{event.preventDefault();event.stopPropagation?.();if(event.dataTransfer)event.dataTransfer.dropEffect='copy';});target.addEventListener('drop',async event=>{event.preventDefault();event.stopPropagation?.();const candidate=event.dataTransfer?.files?.[0];if(candidate)await loadFile(candidate);});}
 bindDrop(drop);
 const clipId='pose-ref-'+Math.random().toString(36).slice(2),shape=(tag,attrs)=>{const n=document.createElementNS('http://www.w3.org/2000/svg',tag);for(const [k,v]of Object.entries(attrs))n.setAttribute(k,String(v));return n;};
 function draw(svg,context){
  if(!image||!config.visible)return null;const box=poseReferenceBox(image,config,context),group=shape('g',{'data-pose-reference-layer':'true','pointer-events':'none'});
  if(box.clip){const defs=shape('defs',{}),clip=shape('clipPath',{id:clipId});clip.append(shape('rect',box.clip));defs.append(clip);group.append(defs);group.setAttribute('clip-path','url(#'+clipId+')');}
  group.append(shape('image',{href:image.dataURL,x:box.x,y:box.y,width:box.width,height:box.height,opacity:box.opacity,preserveAspectRatio:'xMidYMid meet',transform:`rotate(${box.rotation} ${box.cx} ${box.cy})`}));svg.append(group);return box;
 }
 function moveBy(before,dx,dy,box){if(!image||!box)return;config=normalizePoseReferenceLayer({...before,offsetX:before.offsetX+dx/box.unitX,offsetY:before.offsetY+dy/box.unitY});refresh();onChange();}
 refresh();return {refresh,loadFile,restore,clear,bindDrop,draw,isLoaded:()=>!!image,isMoveMode:()=>!!image&&moving&&config.visible,getConfig:()=>({...config}),setConfig:next=>{config=normalizePoseReferenceLayer(next);refresh();onChange();},moveBy,getSnapshot:()=>image?{dataURL:image.dataURL,name:image.name,width:image.width,height:image.height,config:{...config}}:null,dispose:()=>{generation++;release(image);image=null;}};
}
