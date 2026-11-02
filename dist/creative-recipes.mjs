// Explicit, local creative memory. No inference, file mutation or network access.
export const creativeRecipeKey="artoftomworks.promptStudio.creativeRecipes.v1";
export const creativeRoles=["recipe","lighting","composition","palette","materials","motion","style","negative"];
const limit=300, maxBytes=2_000_000;
const text=(value,max=50000)=>typeof value==="string"?value.trim().slice(0,max):"";
const leaf=value=>text(value,500).split(/[\\/]/u).at(-1)||"";
const id=value=>/^[\w.:-]{1,100}$/u.test(String(value||""))?String(value):"";
const clone=value=>JSON.parse(JSON.stringify(value));
function settings(raw={}){
  if(!raw||typeof raw!=="object")raw={};
  const result={};
  for(const key of ["width","height","steps","cfg","seed","fps","frames","duration"])
    if(typeof raw[key]==="number"&&Number.isFinite(raw[key]))result[key]=raw[key];
  for(const key of ["sampler","scheduler"])if(text(raw[key],160))result[key]=text(raw[key],160);
  if(Array.isArray(raw.loras))result.loras=raw.loras.slice(0,40).filter(x=>x&&leaf(x.name)).map(x=>{
    const value={name:leaf(x.name)};if(typeof x.strength==="number"&&Number.isFinite(x.strength))value.strength=x.strength;return value;
  });
  return result;
}
export function normalizeCreativeRecipe(raw){
  if(!raw||typeof raw!=="object"||!id(raw.id)||!text(raw.title,120)||!creativeRoles.includes(raw.role))return null;
  const source=raw.source||{},recipe=raw.recipe||{};
  return {id:id(raw.id),title:text(raw.title,120),role:raw.role,
    excerpt:text(raw.excerpt),worked:text(raw.worked,2000),avoid:text(raw.avoid,2000),
    source:{id:id(source.id),filename:leaf(source.filename),kind:source.kind==="video"?"video":"image",model:leaf(source.model)},
    origins:(Array.isArray(raw.origins)?raw.origins:[]).slice(0,12).filter(x=>x&&[...creativeRoles,"reference","style-mix"].includes(x.role)).map(x=>({role:x.role,title:text(x.title,10000),sourceId:id(x.sourceId),filename:leaf(x.filename),model:leaf(x.model)})),
    recipe:{prompt:text(recipe.prompt),scenePrompt:typeof recipe.scenePrompt==="string"&&typeof recipe.mixDirection==="string"?text(recipe.scenePrompt):null,mixDirection:typeof recipe.scenePrompt==="string"&&typeof recipe.mixDirection==="string"?String(recipe.mixDirection).slice(0,10000):null,negative:text(recipe.negative),language:["EN","HU","DE","FR","ES","IT","PT","PL"].includes(recipe.language)?recipe.language:"",settings:settings(recipe.settings)},
    createdAt:Number.isFinite(Date.parse(raw.createdAt))?raw.createdAt:"",updatedAt:Number.isFinite(Date.parse(raw.updatedAt))?raw.updatedAt:""};
}
export function snapshotCreativeRecipe(item={},overrides={}){
  const now=new Date().toISOString();
  return normalizeCreativeRecipe({id:globalThis.crypto?.randomUUID?.()||"recipe-"+Date.now()+"-"+Math.random().toString(36).slice(2),
    title:leaf(item.filename)||"Untitled",role:"recipe",source:{id:item.id,filename:item.filename,kind:item.kind||(["video","i2v"].includes(item.mode)?"video":"image"),model:item.model},
    recipe:{prompt:item.prompt,scenePrompt:item.scenePrompt,mixDirection:item.mixDirection,negative:item.negative,language:item.language,settings:item.settings},origins:item.origins,createdAt:now,updatedAt:now,...overrides});
}
export function createCreativeRecipeStore(storage){
  let entries=[],problem="",lastRaw=null;
  try{
    const raw=storage.getItem(creativeRecipeKey);lastRaw=raw;
    if(raw){const parsed=JSON.parse(raw);if(parsed.version!==1||!Array.isArray(parsed.entries)||parsed.entries.length>limit)throw Error("format");
      entries=parsed.entries.map(normalizeCreativeRecipe);if(entries.some(x=>!x)||new Set(entries.map(x=>x.id)).size!==entries.length)throw Error("format");}
  }catch{problem="storage";}
  const commit=next=>{
    if(problem)throw Error("storage");
    if(next.length>limit)throw Error("limit");
    const value=JSON.stringify({version:1,entries:next});if(new TextEncoder().encode(value).length>maxBytes)throw Error("limit");
    // Change in-memory state only after the durable write succeeds.
    try{if(storage.getItem(creativeRecipeKey)!==lastRaw)throw Error("conflict");storage.setItem(creativeRecipeKey,value);}catch{throw Error("storage");}
    lastRaw=value;entries=next;return clone(entries);
  };
  return {
    list:()=>clone(entries),problem:()=>problem,
    save(raw){const entry=normalizeCreativeRecipe(raw);if(!entry)throw Error("invalid");
      const previous=entries.find(x=>x.id===entry.id);entry.createdAt=previous?.createdAt||entry.createdAt||new Date().toISOString();entry.updatedAt=new Date().toISOString();
      commit(previous?entries.map(x=>x.id===entry.id?entry:x):[...entries,entry]);return clone(entry);},
    remove(entryId){commit(entries.filter(x=>x.id!==entryId));},
    export(){return JSON.stringify({version:1,entries},null,2);},
    import(value){
      if(typeof value!=="string"||new TextEncoder().encode(value).length>maxBytes)throw Error("invalid");
      const parsed=JSON.parse(value);if(parsed.version!==1||!Array.isArray(parsed.entries)||parsed.entries.length>limit)throw Error("invalid");
      const incoming=parsed.entries.map(normalizeCreativeRecipe);
      if(incoming.some(x=>!x)||new Set(incoming.map(x=>x.id)).size!==incoming.length)throw Error("invalid");
      // Imported ID collisions never overwrite local edits.
      const known=new Set(entries.map(x=>x.id)),added=incoming.filter(x=>!known.has(x.id));commit([...entries,...added]);return added.length;
    }
  };
}
export function creativePassportNotes(entry){
  const parts=[];if(entry.worked)parts.push("What worked: "+entry.worked);if(entry.avoid)parts.push("Watch next time: "+entry.avoid);
  return parts.join("\n");
}
export function buildCreativePlan({route="same",scene="",change="",motion="",selections=[],styleText=""}={}){
  const chosen=selections.slice(0,8).filter(x=>x&&typeof x==="object").map(x=>({entry:normalizeCreativeRecipe(x.entry),role:creativeRoles.includes(x.role)?x.role:x.entry?.role})).filter(x=>x.entry);
  if(!chosen.length)throw Error("selection");
  const main=chosen.find(x=>x.role==="recipe")?.entry||chosen[0].entry;
  let prompt="",negative="",provenance=[],warnings=[],mixDirection=null;
  const addSource=(role,entry)=>{
    provenance.push({role,title:entry.title,sourceId:entry.source.id,filename:entry.source.filename,model:entry.source.model});
    if(role==="recipe")for(const origin of entry.origins)if(!provenance.some(x=>x.role===origin.role&&x.sourceId===origin.sourceId&&x.title===origin.title))provenance.push(clone(origin));
  };
  if(route==="same"){
    if(!main.recipe.prompt)throw Error("prompt");prompt=main.recipe.scenePrompt!==null?main.recipe.scenePrompt:main.recipe.prompt;mixDirection=main.recipe.mixDirection;negative=main.recipe.negative;addSource("recipe",main);
    if(text(change,4000))prompt+="\n\nRequested single change: "+text(change,4000)+". Preserve the other scene elements.";
  }else if(route==="new"){
    if(!text(scene,4000))throw Error("scene");prompt=text(scene,4000);
    if(chosen.some(x=>x.role==="recipe"))warnings.push("missing-fragment:recipe");
  }else if(route==="video"){
    prompt="Use the supplied reference image as the visual starting point. "+(text(motion,4000)||"Subtle, physically coherent environmental motion; keep the camera steady.");
    prompt+=" Preserve the reference composition, subject identity and lighting across frames. No sudden cuts, flicker or morphing.";
    addSource("reference",main);warnings.push("attach-reference");
  }else throw Error("route");
  for(const {entry,role} of chosen){
    if(role==="recipe")continue;
    const fragment=role==="negative"?(entry.excerpt||entry.recipe.negative):entry.excerpt;
    if(!fragment){warnings.push("missing-fragment:"+entry.title);continue;}
    if(role==="negative")negative=[negative,fragment].filter(Boolean).join(", ");
    else prompt+="\n"+role[0].toUpperCase()+role.slice(1)+": "+fragment;
    addSource(role,entry);
  }
  if(styleText){prompt+="\n"+text(styleText,10000);provenance.push({role:"style-mix",title:text(styleText,10000),sourceId:"",filename:"",model:""});}
  if(prompt.length>50000||negative.length>50000)throw Error("limit");
  const notes=chosen.filter(x=>x.entry.avoid||x.entry.worked).map(x=>({title:x.entry.title,worked:x.entry.worked,avoid:x.entry.avoid}));
  warnings.push("settings-reference-only");
  return {prompt,negative,mixDirection,kind:route==="video"?"video":main.source.kind,language:route==="same"?main.recipe.language:"",provenance,notes,warnings:[...new Set(warnings)],settings:clone(main.recipe.settings)};
}

export const creativeStyles={
  glamour:{label:"Glamour",text:"elegant editorial styling, refined poses and luxurious material detail"},
  scifi:{label:"Sci-fi",text:"a coherent futuristic world, speculative architecture and believable technology"},
  noir:{label:"Film noir",text:"dramatic directional shadows, low-key lighting and a restrained noir mood"},
  fantasy:{label:"Fantasy",text:"an imaginative fantasy setting with coherent visual worldbuilding"},
  documentary:{label:"Documentary",text:"observational composition, natural imperfections and unforced moments"},
  watercolor:{label:"Watercolor",text:"transparent watercolor washes and textured paper"},
  oil:{label:"Oil painting",text:"layered oil-painted brushwork and tactile pigment"},
  cyberpunk:{label:"Cyberpunk",text:"a dense futuristic city with controlled neon accents and worn technology"},
  vintage:{label:"Vintage",text:"period-inspired styling, a restrained palette and subtle analog character"},
  minimal:{label:"Minimalism",text:"uncluttered composition, negative space and a clear visual focal point"}
};
Object.assign(creativeStyles,{
  abstract:{label:"Abstract",text:"non-representational shapes, expressive color relationships and deliberate visual rhythm",aliases:"absztrakt abstrakt abstrait abstracto astratto abstrato abstrakcyjny"},
  surreal:{label:"Surrealism",text:"dreamlike juxtapositions, unexpected scale and coherent yet impossible visual relationships",aliases:"szürrealizmus surreal szürreális surrealismo surréalisme surrealizm"},
  cyber:{label:"Cyber",text:"digital systems, luminous data patterns, networked environments and a clean technological aesthetic",aliases:"kiber digitális numérique digitale cyfrowy"},
  artnouveau:{label:"Art Nouveau",text:"organic flowing lines, botanical ornament and graceful decorative forms",aliases:"szecesszió Jugendstil secesja"},
  artdeco:{label:"Art Deco",text:"geometric ornament, elegant symmetry and polished period-inspired surfaces"},
  impressionist:{label:"Impressionism",text:"loose visible brushwork, transient light and impressionistic color",aliases:"impresszionizmus impressionismus impressionnisme impressionismo impresjonizm"},
  expressionist:{label:"Expressionism",text:"emotionally expressive forms, purposeful distortion and bold expressive color",aliases:"expresszionizmus expressionismus expressionnisme espressionismo ekspresjonizm"},
  cubist:{label:"Cubism",text:"interlocking geometric planes and intentionally fragmented viewpoints",aliases:"kubizmus kubismus cubisme cubismo kubizm"},
  popart:{label:"Pop Art",text:"bold graphic shapes, controlled saturated colors and playful printed visual language"},
  anime:{label:"Anime",text:"expressive anime character design, clean linework and coherent cel-shaded environments"},
  comic:{label:"Comic illustration",text:"confident ink contours, readable graphic staging and deliberate illustrated shading",aliases:"képregény bande dessinée fumetto komiks"},
  steampunk:{label:"Steampunk",text:"inventive brass-and-mechanical technology in a richly detailed industrial-period setting"},
  solarpunk:{label:"Solarpunk",text:"optimistic ecological futures with greenery, human-scale architecture and integrated clean technology"},
  retrofuture:{label:"Retrofuturism",text:"a coherent imagined future shaped by vintage design and period-inspired technology",aliases:"retrofuturizmus rétrofuturisme retrofuturismo retrofuturyzm"},
  brutalist:{label:"Brutalism",text:"monumental exposed concrete, uncompromising geometry and strong structural mass",aliases:"brutalizmus brutalisme brutalismo brutalizm"}
});
export function normalizeCustomStyles(raw){
  const seen=new Set();return(Array.isArray(raw)?raw:[]).filter(x=>x&&typeof x.id==="string"&&/^custom_[a-z0-9_-]{1,80}$/i.test(x.id)&&!seen.has(x.id)&&seen.add(x.id)&&text(x.label,96)&&text(x.text,1500)).slice(0,60)
    .map(x=>({id:x.id,label:text(x.label,96).replace(/\s+/g," "),text:text(x.text,1500).replace(/\s+/g," ")}));
}
export function creativeStyleCatalog(custom=[]){return {...creativeStyles,...Object.fromEntries(normalizeCustomStyles(custom).map(x=>[x.id,x]))};}
function percent(value){return Math.max(0,Math.min(100,Number.isFinite(Number(value))?Number(value):0));}
function percentages(values){
  const total=values.reduce((a,b)=>a+b,0);if(!total)return values.map(()=>0);
  const exact=values.map(x=>100*x/total),rounded=exact.map(Math.floor);
  const order=exact.map((x,i)=>({i,remainder:x-rounded[i]})).sort((a,b)=>b.remainder-a.remainder||a.i-b.i);
  for(let n=100-rounded.reduce((a,b)=>a+b,0),i=0;i<n;i++)rounded[order[i].i]++;
  return rounded;
}
export function normalizeStyleMix(raw,custom=[]){
  const catalog=creativeStyleCatalog(custom),seen=new Set();
  const mix=(Array.isArray(raw)?raw:[]).filter(x=>x&&Object.hasOwn(catalog,x.id)&&!seen.has(x.id)&&seen.add(x.id)).slice(0,4);
  const shares=percentages(mix.map((x,i)=>x.percent!==undefined?percent(x.percent):i===0?60:x.weight==="accent"?10:30));
  const maximum=Math.max(...shares);
  return mix.map((x,i)=>({id:x.id,percent:shares[i],weight:shares[i]===maximum&&shares.indexOf(maximum)===i?"lead":shares[i]<20?"accent":"support"}));
}
export function redistributeStyleMix(raw,index,value,custom=[]){
  const mix=normalizeStyleMix(raw,custom);if(!mix[index])return mix;
  const target=Math.round(percent(value));if(mix.length===1)return normalizeStyleMix([{...mix[0],percent:target===0?0:100}],custom);
  const others=mix.map((x,i)=>i!==index?x.percent:0),total=others.reduce((a,b)=>a+b,0);
  const allocation=percentages(others.map((x,i)=>i===index?0:total?x:1));
  const exact=allocation.map((x,i)=>i===index?0:x*(100-target)/100),shares=exact.map(Math.floor);
  const order=exact.map((x,i)=>({i,r:x-shares[i]})).filter(x=>x.i!==index).sort((a,b)=>b.r-a.r||a.i-b.i);
  for(let n=100-target-shares.reduce((a,b)=>a+b,0),i=0;i<n;i++)shares[order[i].i]++;
  shares[index]=target;return normalizeStyleMix(mix.map((x,i)=>({...x,percent:shares[i]})),custom);
}
export function describeStyleMix(raw,language="EN",custom=[]){
  const mix=normalizeStyleMix(raw,custom).filter(x=>x.percent>0),catalog=creativeStyleCatalog(custom);
  const local={HU:["Stíluskeverék","Meghatározó","Kiegészítő","Jelzésértékű"],DE:["Stilmischung","Hauptstil","Ergänzung","Dezenter Akzent"],FR:["Mélange de styles","Principal","Complément","Accent discret"],ES:["Mezcla de estilos","Principal","Complemento","Acento sutil"],IT:["Mix di stili","Principale","Complemento","Accento lieve"],PT:["Mistura de estilos","Principal","Complemento","Toque subtil"],PL:["Mieszanka stylów","Główny","Uzupełniający","Subtelny akcent"]}[language];
  if(local)return mix.length?local[0]+": "+mix.map(x=>local[x.weight==="lead"?1:x.weight==="accent"?3:2]+" ("+x.percent+"%) — "+catalog[x.id].label+": "+catalog[x.id].text).join("; ")+".":"";
  return mix.length?"Visual direction mix (relative prompt emphasis): "+mix.map(x=>(x.weight==="lead"?"Primary":x.weight==="accent"?"Subtle accent":"Supporting")+" ("+x.percent+"%) — "+catalog[x.id].label+": "+catalog[x.id].text).join("; ")+".":"";
}
export function styleMixWarnings(raw,custom=[]){
  const mix=normalizeStyleMix(raw,custom).filter(x=>x.percent>0);return mix.some(x=>["watercolor","oil","impressionist","expressionist","cubist"].includes(x.id))&&mix.some(x=>["glamour","documentary"].includes(x.id))?["mixed-media"]:[];
}
export const creativeLights={key:"the main directional key light",fill:"shadow-softening fill light",rim:"edge-separating rim light",ambient:"environmental ambient light"};
export function normalizeCreativeLights(raw){return Object.fromEntries(Object.keys(creativeLights).map(key=>[key,Math.round(percent(raw?.[key]))]));}
export function suggestCreativeMix(raw,custom=[],currentLights={}){
  const selected=normalizeStyleMix(raw,custom),shares={1:[100],2:[70,30],3:[60,30,10],4:[55,25,15,5]}[selected.length]||[];
  const mix=normalizeStyleMix(selected.map((x,i)=>({id:x.id,percent:shares[i]})),custom),primary=mix[0]?.id;
  let profile="neutral",lights={key:55,fill:30,rim:10,ambient:25};
  if(primary?.startsWith("custom_")){profile="custom";lights=normalizeCreativeLights(currentLights);}
  else if(["abstract","surreal","watercolor","oil","impressionist","expressionist","cubist","popart","anime","comic"].includes(primary)){profile="art";lights={key:0,fill:0,rim:0,ambient:0};}
  else if(primary==="noir"){profile="noir";lights={key:75,fill:10,rim:45,ambient:10};}
  else if(["cyber","cyberpunk","scifi"].includes(primary)){profile="future";lights={key:65,fill:20,rim:70,ambient:35};}
  else if(primary==="glamour"){profile="glamour";lights={key:70,fill:45,rim:30,ambient:25};}
  else if(primary==="vintage"){profile="vintage";lights={key:60,fill:30,rim:15,ambient:30};}
  return {mix,lights:normalizeCreativeLights(lights),profile};
}
export function describeCreativeLights(raw,language="EN"){
  const levels=normalizeCreativeLights(raw),active=Object.entries(levels).filter(([,value])=>value>0);if(!active.length)return "";
  const heading={HU:"Fényirányok — leíró erősség",DE:"Licht — beschreibende Stärke",FR:"Éclairage — intensité descriptive",ES:"Iluminación — intensidad descriptiva",IT:"Luci — intensità descrittiva",PT:"Luz — intensidade descritiva",PL:"Światło — siła opisowa"}[language]||"Lighting direction — descriptive strength";
  return heading+": "+active.map(([key,value])=>(value<25?"a subtle trace of ":value<60?"moderate ":value<85?"strong ":"very strong ")+creativeLights[key]+" ("+value+"/100)").join("; ")+". Interpret these as lighting directions, not measured brightness or generator settings.";
}
export const creativeMixerKey="artoftomworks.promptStudio.styleMixes.v1";
export function normalizeCreativeMixer(raw){
  if(!raw||![1,2].includes(raw.version)||!raw.mixes||typeof raw.mixes!=="object"||Array.isArray(raw.mixes)||!Array.isArray(raw.presets)||raw.presets.length>40)throw Error("format");
  const custom=normalizeCustomStyles(raw.customStyles||[]);
  if(raw.customStyles&&(!Array.isArray(raw.customStyles)||custom.length!==raw.customStyles.length))throw Error("format");
  const scopes=["classic","surprise","i2i","i2v","workbench","recipes"];
  const presets=raw.presets.map(p=>{if(!p||typeof p.name!=="string"||!p.name.trim()||!Array.isArray(p.mix))throw Error("format");return {name:text(p.name,80),mix:normalizeStyleMix(p.mix,custom),lights:normalizeCreativeLights(p.lights),hybrid:p.hybrid===true,...(typeof p.direction==="string"?{direction:p.direction.slice(0,10000)}:{})};});
  const overrides=Object.fromEntries(scopes.filter(key=>typeof raw.overrides?.[key]==="string").map(key=>[key,raw.overrides[key].slice(0,10000)]));
  return {version:2,customStyles:custom,mixes:Object.fromEntries(scopes.map(key=>[key,normalizeStyleMix(raw.mixes[key],custom)])),lights:Object.fromEntries(scopes.map(key=>[key,normalizeCreativeLights(raw.lights?.[key])])),hybrid:Object.fromEntries(scopes.map(key=>[key,raw.hybrid?.[key]===true])),overrides,presets};
}
export function createCreativeMixerStore(storage){
  let problem=false,lastRaw=null,state=normalizeCreativeMixer({version:2,mixes:{},presets:[]});
  try{lastRaw=storage.getItem(creativeMixerKey);if(lastRaw){if(new TextEncoder().encode(lastRaw).length>400000)throw Error("limit");state=normalizeCreativeMixer(JSON.parse(lastRaw));}}catch{problem=true;}
  return {read:()=>clone(state),problem:()=>problem,
    save(raw){if(problem)throw Error("storage");const next=normalizeCreativeMixer(raw),value=JSON.stringify(next);if(new TextEncoder().encode(value).length>400000)throw Error("limit");if(storage.getItem(creativeMixerKey)!==lastRaw)throw Error("conflict");storage.setItem(creativeMixerKey,value);state=next;lastRaw=value;return clone(state);},
    export:()=>JSON.stringify(state,null,2),
    parse(value){if(typeof value!=="string"||new TextEncoder().encode(value).length>400000)throw Error("limit");return normalizeCreativeMixer(JSON.parse(value));}
  };
}
