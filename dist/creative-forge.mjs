export const surpriseThemes = ["any","nature","wildlife","portrait","glamour","fantasy","scifi","architecture","abstract"];

const seeds = {
  nature:[
    {scene:"A silver birch standing alone beside a still alpine lake, its reflection almost touching the mountain peaks",motion:"Morning mist drifts across a still alpine lake around a lone silver birch, gradually revealing its reflection",medium:"fine-art landscape photography"},
    {scene:"An ancient forest path after rain, moss-covered stones leading toward a small opening of golden light",motion:"The view moves slowly along a rain-soaked forest path as droplets fall from leaves and golden light appears ahead",medium:"naturalistic landscape photography"},
    {scene:"Wind-shaped dunes at blue hour, one delicate trail crossing the untouched sand toward the horizon",motion:"Wind traces fine lines across empty dunes at blue hour while a single trail leads toward the horizon",medium:"minimalist landscape photography"}
  ],
  wildlife:[
    {scene:"Two fox cubs curled together in a sheltered woodland hollow, their fur catching the last warm light",motion:"Two fox cubs wake in a sheltered woodland hollow, stretch gently and settle close together again",medium:"intimate wildlife photography"},
    {scene:"A kingfisher poised above a clear stream, its bright colors reflected in the water below",motion:"A kingfisher waits above a clear stream, then darts toward the water and returns to its branch",medium:"patient wildlife photography"},
    {scene:"A small herd of deer emerging through dawn mist at the edge of a quiet meadow",motion:"A small herd of deer emerges from dawn mist and pauses at the edge of a quiet meadow",medium:"observational wildlife photography"}
  ],
  portrait:[
    {scene:"An adult artist beside a studio window, hands marked with paint, quietly considering an unfinished canvas",motion:"An adult artist pauses beside a studio window, studies an unfinished canvas and makes one confident brushstroke",medium:"editorial portrait photography"},
    {scene:"An adult musician backstage after a performance, a candid expression between exhaustion and joy",motion:"An adult musician steps backstage, exhales after a performance and smiles at a distant burst of applause",medium:"intimate documentary portrait photography"},
    {scene:"An adult traveler at a train station, holding a worn notebook and looking toward the first morning departure",motion:"An adult traveler closes a worn notebook and turns toward the first departing train in the morning light",medium:"cinematic portrait photography"}
  ],
  glamour:[
    {scene:"An adult fashion model in a sculptural evening gown, standing beneath the soft glow of an old theatre marquee",motion:"An adult fashion model steps from an old theatre into evening light, the sculptural gown moving naturally",medium:"high-end fashion editorial photography"},
    {scene:"An adult dancer in elegant eveningwear on a quiet rooftop, city lights softly blurred behind them",motion:"An adult dancer makes a graceful turn on a rooftop while distant city lights glow behind them",medium:"refined glamour editorial photography"},
    {scene:"An adult portrait subject in tailored velvet against a deep jewel-toned backdrop, poised and self-assured",motion:"An adult portrait subject turns slowly toward the camera against a jewel-toned studio backdrop",medium:"luxury studio portrait photography"}
  ],
  fantasy:[
    {scene:"A floating library of lantern-lit bridges above a sea of clouds, a lone reader discovering a glowing doorway",motion:"A lone reader crosses a lantern-lit bridge in a floating library as a glowing doorway opens among the clouds",medium:"painterly fantasy concept art"},
    {scene:"A moonlit garden of enormous translucent flowers, their petals holding tiny constellations",motion:"Translucent flowers open one by one in a moonlit garden, revealing tiny constellations inside their petals",medium:"dreamlike fantasy illustration"},
    {scene:"A small lighthouse built on the back of a wandering stone giant beneath a violet sky",motion:"A wandering stone giant carries a lit lighthouse through a violet twilight landscape",medium:"cinematic fantasy concept art"}
  ],
  scifi:[
    {scene:"A botanist tending a greenhouse inside a quiet orbital station, Earth reflected in the curved glass",motion:"A botanist checks a plant inside an orbital greenhouse as Earth slowly rises beyond the curved glass",medium:"grounded science-fiction concept art"},
    {scene:"A weathered research rover crossing an ice moon toward a faintly luminous canyon",motion:"A research rover traverses an ice moon and descends toward a faintly luminous canyon",medium:"cinematic science-fiction imagery"},
    {scene:"A future city built around living trees and rainwater gardens, viewed from a sunlit pedestrian bridge",motion:"The camera glides across a pedestrian bridge in a future city where rainwater gardens weave around living trees",medium:"optimistic science-fiction concept art"}
  ],
  architecture:[
    {scene:"A quiet modern library with warm timber arches and a central skylight illuminating a single reading table",motion:"A slow camera move reveals a modern library's timber arches and the pool of daylight on one reading table",medium:"architectural photography"},
    {scene:"An old stone courtyard transformed by a narrow reflective pool and carefully placed olive trees",motion:"The view travels through an old stone courtyard, following reflections in a narrow pool toward olive trees",medium:"editorial architectural photography"},
    {scene:"A compact coastal house with generous windows, perched above dark rocks and a calm horizon",motion:"The camera approaches a compact coastal house as evening light appears in its generous windows",medium:"architectural photography"}
  ],
  abstract:[
    {scene:"Interlocking translucent ribbons of cobalt and amber, folding into a balanced spiral around a dark center",motion:"Translucent cobalt and amber ribbons fold into a balanced spiral, then slowly separate",medium:"fine-art abstract image"},
    {scene:"A field of porcelain-white shapes interrupted by one vivid vermilion curve, with tactile paper texture",motion:"Porcelain-white shapes drift apart as one vermilion curve moves across a textured field",medium:"minimalist abstract artwork"},
    {scene:"Liquid reflections forming an almost-symmetrical constellation of teal, silver and warm gold",motion:"Liquid reflections gather into a teal-and-gold constellation, dissolve and quietly reform",medium:"experimental abstract artwork"}
  ]
};

const light=["Soft directional light defines the subject without losing the surrounding atmosphere", "A carefully balanced mixture of natural light and gentle shadow creates depth", "Luminous highlights guide the eye through a restrained, cohesive color palette"];
const imageFrames=["Intentional framing, a clear focal point, believable depth and fine material texture", "Elegant visual hierarchy, natural proportions and carefully controlled depth of field", "A strong silhouette, uncluttered composition and nuanced surface detail"];
const videoFrames=["One continuous, restrained camera move follows the action; motion stays physically coherent", "A steady observational camera lets the moment unfold naturally without abrupt cuts", "A gentle tracking shot reveals the scene in sequence, keeping subject continuity intact"];
const qualityOpenings={
  photograph:"Masterpiece, editorial quality, ultra detailed, professional photograph, tack-sharp focus on the main subject, natural depth of field, lifelike textures",
  artwork:"Masterpiece, carefully crafted fine art, richly detailed, intentional composition, coherent textures suited to the medium",
  video:"Masterpiece, cinematic editorial quality, richly detailed moving image, clear subject focus, coherent natural motion"
};

function choose(list,random) { return list[Math.min(list.length-1,Math.max(0,Math.floor(random()*list.length)))]; }

export function buildSurprisePrompt({theme="any",kind="image",random=Math.random}={}) {
  const available=surpriseThemes.slice(1);
  const chosenTheme=seeds[theme]?theme:choose(available,random);
  const seed=choose(seeds[chosenTheme],random);
  const lighting=choose(light,random);
  const video=kind==="video";
  const framing=choose(video?videoFrames:imageFrames,random);
  const opening=video?qualityOpenings.video:/(?:photograph|portrait photography)/iu.test(seed.medium)?qualityOpenings.photograph:qualityOpenings.artwork;
  const prompt=video
    ? `${opening}. ${seed.motion}. ${framing}. ${lighting}. ${seed.medium} translated into a natural moving scene. Subtle ambient sound appropriate to the setting; no captions, logos or sudden scene changes.`
    : `${opening}. ${seed.scene}. ${seed.medium}. ${lighting}. ${framing}. Rich but believable detail, coherent perspective, no text or watermark.`;
  return {theme:chosenTheme,kind:video?"video":"image",prompt};
}

const qualityOnly=/^(?:masterpiece|best quality|high quality|ultra detailed|hyper realistic|photorealistic|professional photo|award winning|8k|4k|hdr|sharp focus|editorial quality)$/iu;
const visualWords=/\b(light|lighting|sunset|sunrise|dawn|dusk|twilight|night|golden|blue hour|shadow|color|colour|palette|mood|atmosphere|composition|framing|lens|bokeh|depth of field|watercolor|oil painting|illustration|film grain|cinematic|fog|mist)\b/iu;
function clauses(value) {
  return String(value||"").split(/[\n.;,]+/u).map((part)=>part.trim()).filter((part)=>part.length>=15&&!qualityOnly.test(part)).slice(0,60);
}
function short(value,max=220) {const plain=String(value||"").replace(/\s+/gu," ").trim();return plain.length>max?`${plain.slice(0,max).trimEnd()}…`:plain;}

export function mixArchivedPrompts(first,second,{swap=false,kind=""}={}) {
  const sceneSource=swap?second:first,lookSource=swap?first:second;
  if(!String(sceneSource?.prompt||"").trim()||!String(lookSource?.prompt||"").trim())return null;
  const sceneParts=clauses(sceneSource.prompt),lookParts=clauses(lookSource.prompt);
  const scene=short(sceneParts.find((part)=>part.split(/\s+/u).length>=5)||sceneParts[0]||sceneSource.prompt);
  const look=short(lookParts.filter((part)=>visualWords.test(part)).slice(0,2).join(", ")||lookParts[0]||lookSource.prompt,180);
  const outputKind=kind==="video"||kind==="image"?kind:sceneSource.kind==="video"?"video":"image";
  const ending=outputKind==="video"
    ? "A coherent, continuous action with purposeful camera movement and consistent subjects; no sudden cuts, captions or logos."
    : "A clear focal point, coherent perspective and intentional composition; no text or watermark.";
  return {kind:outputKind,scene,look,prompt:`${scene}. Visual treatment: ${look}. ${ending}`,
    sceneFilename:String(sceneSource.filename||""),lookFilename:String(lookSource.filename||"")};
}

const surpriseCopy={
  EN:{title:"Start with a spark",intro:"Choose a theme or leave it to chance. Get a fresh English prompt you can edit before using.",any:"Anything goes",nature:"Nature",wildlife:"Wildlife",portrait:"Portrait",glamour:"Glamour",fantasy:"Fantasy",scifi:"Sci-fi",architecture:"Architecture",abstract:"Abstract art",image:"Image",video:"Video",generate:"✦ Surprise me with a prompt",use:"Use in editor",copy:"Copy prompt",confirm:"Replace the current edited prompt with this surprise?",used:"The prompt is now in the editor.",copied:"Prompt copied.",copyError:"Could not copy the prompt."},
  HU:{title:"Induljon egy szikrával",intro:"Válassz témát, vagy bízd a véletlenre. Új, angol nyelvű promptot kapsz, amit szerkeszthetsz.",any:"Bármi jöhet",nature:"Természet",wildlife:"Állatok",portrait:"Portré",glamour:"Glamour",fantasy:"Fantasy",scifi:"Sci-fi",architecture:"Építészet",abstract:"Absztrakt művészet",image:"Kép",video:"Videó",generate:"✦ Lepj meg egy prompttal",use:"Átvitel a szerkesztőbe",copy:"Prompt másolása",confirm:"Lecseréljem a most szerkesztett promptot erre a meglepetésre?",used:"A prompt átkerült a szerkesztőbe.",copied:"A prompt a vágólapra került.",copyError:"Nem sikerült másolni a promptot."},
  DE:{title:"Beginne mit einem Funken",intro:"Wähle ein Thema oder überlasse es dem Zufall. Der englische Prompt bleibt bearbeitbar.",any:"Alles ist möglich",nature:"Natur",wildlife:"Wildtiere",portrait:"Porträt",glamour:"Glamour",fantasy:"Fantasy",scifi:"Science-Fiction",architecture:"Architektur",abstract:"Abstrakte Kunst",image:"Bild",video:"Video",generate:"✦ Überrasche mich mit einem Prompt",use:"Im Editor verwenden",copy:"Prompt kopieren",confirm:"Aktuellen Prompt ersetzen?",used:"Prompt im Editor.",copied:"Prompt kopiert.",copyError:"Kopieren fehlgeschlagen."},
  FR:{title:"Une étincelle pour commencer",intro:"Choisissez un thème ou laissez faire le hasard. Le prompt anglais reste modifiable.",any:"Surprenez-moi",nature:"Nature",wildlife:"Animaux",portrait:"Portrait",glamour:"Glamour",fantasy:"Fantastique",scifi:"Science-fiction",architecture:"Architecture",abstract:"Art abstrait",image:"Image",video:"Vidéo",generate:"✦ Surprenez-moi avec un prompt",use:"Utiliser dans l'éditeur",copy:"Copier le prompt",confirm:"Remplacer le prompt actuel ?",used:"Prompt dans l'éditeur.",copied:"Prompt copié.",copyError:"Copie impossible."},
  ES:{title:"Empieza con una chispa",intro:"Elige un tema o deja que decida el azar. El prompt en inglés se puede editar.",any:"Lo que sea",nature:"Naturaleza",wildlife:"Animales",portrait:"Retrato",glamour:"Glamour",fantasy:"Fantasía",scifi:"Ciencia ficción",architecture:"Arquitectura",abstract:"Arte abstracto",image:"Imagen",video:"Vídeo",generate:"✦ Sorpréndeme con un prompt",use:"Usar en el editor",copy:"Copiar prompt",confirm:"¿Reemplazar el prompt actual?",used:"Prompt en el editor.",copied:"Prompt copiado.",copyError:"No se pudo copiar."},
  IT:{title:"Inizia con una scintilla",intro:"Scegli un tema o affidati al caso. Il prompt in inglese rimane modificabile.",any:"Qualsiasi cosa",nature:"Natura",wildlife:"Animali",portrait:"Ritratto",glamour:"Glamour",fantasy:"Fantasy",scifi:"Fantascienza",architecture:"Architettura",abstract:"Arte astratta",image:"Immagine",video:"Video",generate:"✦ Sorprendimi con un prompt",use:"Usa nell'editor",copy:"Copia prompt",confirm:"Sostituire il prompt attuale?",used:"Prompt nell'editor.",copied:"Prompt copiato.",copyError:"Copia non riuscita."},
  PT:{title:"Comece com uma faísca",intro:"Escolha um tema ou deixe ao acaso. O prompt em inglês pode ser editado.",any:"Qualquer tema",nature:"Natureza",wildlife:"Animais",portrait:"Retrato",glamour:"Glamour",fantasy:"Fantasia",scifi:"Ficção científica",architecture:"Arquitetura",abstract:"Arte abstrata",image:"Imagem",video:"Vídeo",generate:"✦ Surpreende-me com um prompt",use:"Usar no editor",copy:"Copiar prompt",confirm:"Substituir o prompt atual?",used:"Prompt no editor.",copied:"Prompt copiado.",copyError:"Não foi possível copiar."},
  PL:{title:"Zacznij od iskry",intro:"Wybierz temat lub zdaj się na przypadek. Angielski prompt można edytować.",any:"Dowolny temat",nature:"Natura",wildlife:"Zwierzęta",portrait:"Portret",glamour:"Glamour",fantasy:"Fantasy",scifi:"Science fiction",architecture:"Architektura",abstract:"Sztuka abstrakcyjna",image:"Obraz",video:"Wideo",generate:"✦ Zaskocz mnie promptem",use:"Użyj w edytorze",copy:"Kopiuj prompt",confirm:"Zastąpić obecny prompt?",used:"Prompt jest w edytorze.",copied:"Prompt skopiowany.",copyError:"Nie udało się skopiować."}
};

export function attachSurprisePrompt({getLanguage,getMode,getCurrent,restore,onGenerated,getNegative}) {
  const el=(id)=>document.getElementById(id),theme=el("surprise-theme"),kind=el("surprise-kind"),output=el("surprise-output"),status=el("surprise-status");
  if(!theme||!kind||!output)return;
  const t=()=>surpriseCopy[getLanguage()]||surpriseCopy.EN;
  let kindTouched=false,lastPrompt="";
  kind.addEventListener("change",()=>{kindTouched=true;});
  function translate(){
    el("surprise-title").textContent=t().title;el("surprise-intro").textContent=t().intro;
    el("surprise-generate").textContent=t().generate;el("surprise-use").textContent=t().use;el("surprise-copy").textContent=t().copy;
    const themeValue=theme.value||"any",kindValue=kind.value||"image";
    theme.replaceChildren(...surpriseThemes.map((value)=>new Option(t()[value],value)));theme.value=themeValue;
    kind.replaceChildren(new Option(t().image,"image"),new Option(t().video,"video"));kind.value=kindValue;
  }
  translate();document.getElementById("ui-language")?.addEventListener("change",translate);
  el("surprise-generate").addEventListener("click",()=>{
    if(!kindTouched)kind.value=["video","i2v"].includes(getMode())?"video":"image";
    let result;
    for(let attempt=0;attempt<8;attempt++){result=buildSurprisePrompt({theme:theme.value,kind:kind.value});if(result.prompt!==lastPrompt)break;}
    lastPrompt=result.prompt;output.value=result.prompt;el("surprise-output-wrap").hidden=false;status.textContent="";
    document.getElementById("surprise-negative-prompt").value="";
    onGenerated?.();
    output.focus();output.setSelectionRange(0,0);
  });
  el("surprise-use").addEventListener("click",()=>{
    const prompt=output.value.trim();if(!prompt)return;
    if(getCurrent()?.prompt?.trim()&&!window.confirm(t().confirm))return;
    restore({mode:kind.value,prompt,negative:getNegative?.()||"",language:"EN",model:""});status.textContent=t().used;
    document.querySelector(".result-column")?.scrollIntoView({behavior:"smooth",block:"start"});
  });
  el("surprise-copy").addEventListener("click",async()=>{
    try{await navigator.clipboard.writeText(output.value);status.textContent=t().copied;}
    catch{status.textContent=t().copyError;}
  });
}
