export const surpriseThemes = ["any","nature","wildlife","portrait","glamour","fantasy","scifi","architecture","abstract","nsfw"];

const seeds = {
  nsfw:[
    {
        "scene": "An adult woman aged 35 posing nude for a non-sexual life-drawing study, seated in profile in an artist's studio",
        "motion": "An adult woman aged 35 holds a seated pose for a non-sexual nude figure study, breathing quietly as soft window light falls across the studio",
        "medium": "classical charcoal figure drawing"
    },
    {
        "scene": "An adult man aged 40 posing nude for a non-sexual sculpture study beside a weathered plaster column, balanced standing posture",
        "motion": "An adult man aged 40 holds a standing pose for a non-sexual nude sculpture study while daylight shifts gently across the plaster column",
        "medium": "academic fine-art figure photography"
    },
    {
        "scene": "An adult woman aged 45 in an opaque satin dressing gown, seated beside a vintage dressing table, a quiet non-sexual boudoir portrait",
        "motion": "An adult woman aged 45 in an opaque satin dressing gown gently turns toward a dressing-table mirror, a quiet non-sexual boudoir portrait",
        "medium": "classic boudoir portrait photography"
    },
    {
        "scene": "An adult woman aged 30 posing nude from behind for a non-sexual fine-art figure study against a plain linen backdrop",
        "motion": "An adult woman aged 30 holds a back-facing pose for a non-sexual nude fine-art study, with subtle breathing and an otherwise still composition",
        "medium": "black-and-white fine-art photography"
    },
    {
        "scene": "An adult man aged 50 seated in a relaxed nude pose for a non-sexual painter's anatomy study, draped fabric beneath the figure",
        "motion": "An adult man aged 50 holds a relaxed seated pose for a non-sexual nude anatomy study as a linen curtain moves softly nearby",
        "medium": "traditional oil-painted figure study"
    },
    {
        "scene": "An adult woman aged 38 in an opaque silk nightdress beside a sunlit balcony doorway, an understated non-sexual boudoir portrait",
        "motion": "An adult woman aged 38 in an opaque silk nightdress slowly opens a curtain beside a balcony doorway, an understated non-sexual boudoir portrait",
        "medium": "natural-light boudoir portrait photography"
    }
],
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
const handsAndFeet="If hands are visible, each hand has four distinct fingers and one opposable thumb, naturally attached with plausible joints and proportions. If bare feet are visible, each foot has five separate toes; legs and ankles connect naturally.";
const anatomyExclusions="extra or missing fingers, extra or missing thumbs, fused fingers, duplicated hands, extra arms, extra legs, malformed feet, extra or missing toes";

function choose(list,random) { return list[Math.min(list.length-1,Math.max(0,Math.floor(random()*list.length)))]; }

export function buildSurprisePrompt({theme="any",kind="image",model="generic",random=Math.random}={}) {
  // Adult art is opt-in: exclude it from the general random pool.
  const available=surpriseThemes.filter(theme=>theme!=="any" && theme!=="nsfw");
  const chosenTheme=seeds[theme]?theme:choose(available,random);
  const seed=choose(seeds[chosenTheme],random);
  const lighting=choose(light,random);
  const video=kind==="video";
  const framing=choose(video?videoFrames:imageFrames,random);
  const opening=video?qualityOpenings.video:/(?:photograph|portrait photography)/iu.test(seed.medium)?qualityOpenings.photograph:qualityOpenings.artwork;
  const human=!video && /\b(adult|reader|botanist)\b/iu.test(seed.scene);
  const prompt=video
    ? `${opening}. ${seed.motion}. ${framing}. ${lighting}. ${seed.medium} translated into a natural moving scene. Subtle ambient sound appropriate to the setting; no captions, logos or sudden scene changes.`
    : `${opening}. ${seed.scene}. ${seed.medium}. ${lighting}. ${framing}. ${human?handsAndFeet+" ":""}Rich but believable detail, coherent perspective, no text or watermark.`;
  return {theme:chosenTheme,kind:video?"video":"image",prompt,
    negative:human && model!=="flux" ? anatomyExclusions : ""};
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
  EN:{nsfw:"NSFW · 18+ art / boudoir",title:"Start with a spark",intro:"Choose a theme or leave it to chance. Get a fresh English prompt you can edit before using.",any:"Anything goes",nature:"Nature",wildlife:"Wildlife",portrait:"Portrait",glamour:"Glamour",fantasy:"Fantasy",scifi:"Sci-fi",architecture:"Architecture",abstract:"Abstract art",image:"Image",video:"Video",generate:"✦ Surprise me with a prompt",use:"Use in editor",copy:"Copy prompt",confirm:"Replace the current edited prompt with this surprise?",used:"The prompt is now in the editor.",copied:"Prompt copied.",copyError:"Could not copy the prompt."},
  HU:{nsfw:"NSFW · 18+ művészi akt / boudoir",title:"Induljon egy szikrával",intro:"Válassz témát, vagy bízd a véletlenre. Új, angol nyelvű promptot kapsz, amit szerkeszthetsz.",any:"Bármi jöhet",nature:"Természet",wildlife:"Állatok",portrait:"Portré",glamour:"Glamour",fantasy:"Fantasy",scifi:"Sci-fi",architecture:"Építészet",abstract:"Absztrakt művészet",image:"Kép",video:"Videó",generate:"✦ Lepj meg egy prompttal",use:"Átvitel a szerkesztőbe",copy:"Prompt másolása",confirm:"Lecseréljem a most szerkesztett promptot erre a meglepetésre?",used:"A prompt átkerült a szerkesztőbe.",copied:"A prompt a vágólapra került.",copyError:"Nem sikerült másolni a promptot."},
  DE:{nsfw:"NSFW · 18+ Aktkunst / Boudoir",title:"Beginne mit einem Funken",intro:"Wähle ein Thema oder überlasse es dem Zufall. Der englische Prompt bleibt bearbeitbar.",any:"Alles ist möglich",nature:"Natur",wildlife:"Wildtiere",portrait:"Porträt",glamour:"Glamour",fantasy:"Fantasy",scifi:"Science-Fiction",architecture:"Architektur",abstract:"Abstrakte Kunst",image:"Bild",video:"Video",generate:"✦ Überrasche mich mit einem Prompt",use:"Im Editor verwenden",copy:"Prompt kopieren",confirm:"Aktuellen Prompt ersetzen?",used:"Prompt im Editor.",copied:"Prompt kopiert.",copyError:"Kopieren fehlgeschlagen."},
  FR:{nsfw:"NSFW · 18+ nu artistique / boudoir",title:"Une étincelle pour commencer",intro:"Choisissez un thème ou laissez faire le hasard. Le prompt anglais reste modifiable.",any:"Surprenez-moi",nature:"Nature",wildlife:"Animaux",portrait:"Portrait",glamour:"Glamour",fantasy:"Fantastique",scifi:"Science-fiction",architecture:"Architecture",abstract:"Art abstrait",image:"Image",video:"Vidéo",generate:"✦ Surprenez-moi avec un prompt",use:"Utiliser dans l'éditeur",copy:"Copier le prompt",confirm:"Remplacer le prompt actuel ?",used:"Prompt dans l'éditeur.",copied:"Prompt copié.",copyError:"Copie impossible."},
  ES:{nsfw:"NSFW · 18+ desnudo artístico / boudoir",title:"Empieza con una chispa",intro:"Elige un tema o deja que decida el azar. El prompt en inglés se puede editar.",any:"Lo que sea",nature:"Naturaleza",wildlife:"Animales",portrait:"Retrato",glamour:"Glamour",fantasy:"Fantasía",scifi:"Ciencia ficción",architecture:"Arquitectura",abstract:"Arte abstracto",image:"Imagen",video:"Vídeo",generate:"✦ Sorpréndeme con un prompt",use:"Usar en el editor",copy:"Copiar prompt",confirm:"¿Reemplazar el prompt actual?",used:"Prompt en el editor.",copied:"Prompt copiado.",copyError:"No se pudo copiar."},
  IT:{nsfw:"NSFW · 18+ nudo artistico / boudoir",title:"Inizia con una scintilla",intro:"Scegli un tema o affidati al caso. Il prompt in inglese rimane modificabile.",any:"Qualsiasi cosa",nature:"Natura",wildlife:"Animali",portrait:"Ritratto",glamour:"Glamour",fantasy:"Fantasy",scifi:"Fantascienza",architecture:"Architettura",abstract:"Arte astratta",image:"Immagine",video:"Video",generate:"✦ Sorprendimi con un prompt",use:"Usa nell'editor",copy:"Copia prompt",confirm:"Sostituire il prompt attuale?",used:"Prompt nell'editor.",copied:"Prompt copiato.",copyError:"Copia non riuscita."},
  PT:{nsfw:"NSFW · 18+ nu artístico / boudoir",title:"Comece com uma faísca",intro:"Escolha um tema ou deixe ao acaso. O prompt em inglês pode ser editado.",any:"Qualquer tema",nature:"Natureza",wildlife:"Animais",portrait:"Retrato",glamour:"Glamour",fantasy:"Fantasia",scifi:"Ficção científica",architecture:"Arquitetura",abstract:"Arte abstrata",image:"Imagem",video:"Vídeo",generate:"✦ Surpreende-me com um prompt",use:"Usar no editor",copy:"Copiar prompt",confirm:"Substituir o prompt atual?",used:"Prompt no editor.",copied:"Prompt copiado.",copyError:"Não foi possível copiar."},
  PL:{nsfw:"NSFW · 18+ akt artystyczny / boudoir",title:"Zacznij od iskry",intro:"Wybierz temat lub zdaj się na przypadek. Angielski prompt można edytować.",any:"Dowolny temat",nature:"Natura",wildlife:"Zwierzęta",portrait:"Portret",glamour:"Glamour",fantasy:"Fantasy",scifi:"Science fiction",architecture:"Architektura",abstract:"Sztuka abstrakcyjna",image:"Obraz",video:"Wideo",generate:"✦ Zaskocz mnie promptem",use:"Użyj w edytorze",copy:"Kopiuj prompt",confirm:"Zastąpić obecny prompt?",used:"Prompt jest w edytorze.",copied:"Prompt skopiowany.",copyError:"Nie udało się skopiować."}
};
const surpriseAnatomyCopy={
  EN:["Optional negative prompt","FLUX mainly follows positive directions; use negatives only if your workflow supports them.","Copy negative","Other image model"],
  HU:["Opcionális negatív prompt","A FLUX elsősorban a pozitív leírást követi; negatív promptot csak akkor használj, ha a munkafolyamatod kezeli.","Negatív másolása","Más képmodell"],
  DE:["Optionaler negativer Prompt","FLUX folgt vor allem positiven Angaben; negative Prompts nur nutzen, wenn der Workflow sie unterstützt.","Negativ kopieren","Anderes Bildmodell"],
  FR:["Prompt négatif facultatif","FLUX suit surtout les descriptions positives ; utilisez un négatif seulement si votre flux le prend en charge.","Copier le négatif","Autre modèle d'image"],
  ES:["Prompt negativo opcional","FLUX sigue principalmente las indicaciones positivas; usa negativos solo si tu flujo los admite.","Copiar negativo","Otro modelo de imagen"],
  IT:["Prompt negativo facoltativo","FLUX segue soprattutto le indicazioni positive; usa un negativo solo se il workflow lo supporta.","Copia negativo","Altro modello di immagini"],
  PT:["Prompt negativo opcional","FLUX segue sobretudo indicações positivas; usa um negativo apenas se o workflow o suportar.","Copiar negativo","Outro modelo de imagem"],
  PL:["Opcjonalny prompt negatywny","FLUX kieruje się głównie pozytywnym opisem; używaj negatywnego tylko jeśli workflow go obsługuje.","Kopiuj negatywny","Inny model obrazu"]
};

const SURPRISE_LAYOUT_UI={"HU": ["Felbontás", "Nincs megadva", "Egyéni", "Szélesség", "Magasság", "Képkivágás", "Automatikus", "Egész alak · tetőtől talpig", "Félalak · deréktól felfelé", "Közeli portré", "A méretet a generálóprogramban is állítsd be. A képkivágás a promptot irányítja, az eredményt nem garantálja.", "256 és 8192 közötti, 8-cal osztható egész méreteket adj meg."], "EN": ["Resolution", "Unspecified", "Custom", "Width", "Height", "Framing", "Automatic", "Full body · head to toe", "Waist-up", "Close-up portrait", "Set the same size in your generation tool. Framing guides the prompt but does not guarantee the result.", "Enter whole dimensions from 256 to 8192 divisible by 8."], "DE": ["Auflösung", "Nicht festgelegt", "Benutzerdefiniert", "Breite", "Höhe", "Bildausschnitt", "Automatisch", "Ganzkörper · Kopf bis Fuß", "Ab Taille", "Nahporträt", "Größe auch im Generator einstellen. Bildausschnitt steuert den Prompt ohne Ergebnisgarantie.", "Ganze Größen von 256 bis 8192, durch 8 teilbar."], "FR": ["Résolution", "Non précisée", "Personnalisée", "Largeur", "Hauteur", "Cadrage", "Automatique", "En pied · tête aux pieds", "À partir de la taille", "Portrait rapproché", "Réglez la même taille dans le générateur. Le cadrage guide le prompt sans garantir le résultat.", "Dimensions entières de 256 à 8192 divisibles par 8."], "ES": ["Resolución", "Sin especificar", "Personalizada", "Ancho", "Alto", "Encuadre", "Automático", "Cuerpo entero · de pies a cabeza", "De cintura para arriba", "Primer plano", "Configura el mismo tamaño en el generador. El encuadre orienta el prompt sin garantizar el resultado.", "Dimensiones enteras entre 256 y 8192 divisibles por 8."], "IT": ["Risoluzione", "Non specificata", "Personalizzata", "Larghezza", "Altezza", "Inquadratura", "Automatica", "Figura intera · testa e piedi", "Dalla vita in su", "Primo piano", "Imposta la stessa dimensione nel generatore. Il prompt guida l’inquadratura senza garantirla.", "Dimensioni intere da 256 a 8192 divisibili per 8."], "PT": ["Resolução", "Não especificada", "Personalizada", "Largura", "Altura", "Enquadramento", "Automático", "Corpo inteiro · cabeça aos pés", "Da cintura para cima", "Retrato aproximado", "Defina o mesmo tamanho no gerador. O enquadramento orienta o prompt sem garantir o resultado.", "Dimensões inteiras de 256 a 8192 divisíveis por 8."], "PL": ["Rozdzielczość", "Nieokreślona", "Własna", "Szerokość", "Wysokość", "Kadrowanie", "Automatyczne", "Cała sylwetka · od stóp do głów", "Od pasa w górę", "Portret z bliska", "Ustaw ten sam rozmiar w generatorze. Kadrowanie kieruje promptem bez gwarancji wyniku.", "Wymiary całkowite od 256 do 8192 podzielne przez 8."]};
const LAYOUT_STORE="artoftomworks.v2.surpriseLayout";
export function surpriseLayout({width="",height="",framing="auto"}={}) {
  const hasSize=String(width).trim()!=="" || String(height).trim()!=="";
  const w=Number(width),h=Number(height);
  if(hasSize && (![w,h].every(v=>Number.isInteger(v)&&v>=256&&v<=8192&&v%8===0)))return {valid:false};
  const frame={
    full:"Full-body wide composition, the entire subject visible from head to toe, both feet and the top of the head inside the frame, generous space above and below, camera far enough away to include the whole figure; avoid close-ups and cropped limbs",
    medium:"Waist-up composition with the entire head and both shoulders inside the frame, comfortable space above the head",
    close:"Close-up portrait composition centered on the face, with the complete head inside the frame"
  }[framing]||"";
  const gcd=(a,b)=>b?gcd(b,a%b):a;
  const size=hasSize?`Target canvas ${w} × ${h} pixels, aspect ratio ${w/gcd(w,h)}:${h/gcd(w,h)}; compose for this ${h>w?"portrait":w>h?"landscape":"square"} frame`:"";
  return {valid:true,text:[frame,size].filter(Boolean).join(". "),width:hasSize?w:null,height:hasSize?h:null,framing};
}

export function attachSurprisePrompt({getLanguage,getMode,getCurrent,restore,onGenerated}) {
  const el=(id)=>document.getElementById(id),theme=el("surprise-theme"),kind=el("surprise-kind"),output=el("surprise-output"),status=el("surprise-status");
  if(!theme||!kind||!output)return;
  const t=()=>surpriseCopy[getLanguage()]||surpriseCopy.EN;
  const size=el("surprise-resolution"),width=el("surprise-width"),height=el("surprise-height"),framing=el("surprise-framing");
  const presets=["1024x1024","1344x768","768x1344","1536x864","864x1536","1920x1088","1088x1920"];
  let savedLayout=null;
  try{savedLayout=JSON.parse(localStorage.getItem(LAYOUT_STORE)||"null");}catch{}
  function saveLayout(){try{localStorage.setItem(LAYOUT_STORE,JSON.stringify({size:size.value,width:width.value,height:height.value,framing:framing.value}));}catch{}}
  function updateSize(){el("surprise-custom-size").hidden=size.value!=="custom";if(presets.includes(size.value)){[width.value,height.value]=size.value.split("x");}saveLayout();}
  size.addEventListener("change",updateSize);width.addEventListener("change",saveLayout);height.addEventListener("change",saveLayout);framing.addEventListener("change",saveLayout);
  let kindTouched=false,lastPrompt="";
  kind.addEventListener("change",()=>{kindTouched=true;});
  function translate(){
    const layout=SURPRISE_LAYOUT_UI[getLanguage()]||SURPRISE_LAYOUT_UI.EN;
    const sizeValue=size.value,frameValue=framing.value;
    el("surprise-resolution-label").textContent=layout[0];el("surprise-width-label").textContent=layout[3];el("surprise-height-label").textContent=layout[4];el("surprise-framing-label").textContent=layout[5];el("surprise-layout-help").textContent=layout[10];
    size.replaceChildren(new Option(layout[1],""),...presets.map(v=>new Option(v.replace("x"," × "),v)),new Option(layout[2],"custom"));size.value=sizeValue;
    framing.replaceChildren(new Option(layout[6],"auto"),new Option(layout[7],"full"),new Option(layout[8],"medium"),new Option(layout[9],"close"));framing.value=frameValue;
    el("surprise-title").textContent=t().title;el("surprise-intro").textContent=t().intro;
    el("surprise-generate").textContent=t().generate;el("surprise-use").textContent=t().use;el("surprise-copy").textContent=t().copy;
    const anatomy=surpriseAnatomyCopy[getLanguage()]||surpriseAnatomyCopy.EN;
    el("surprise-negative-label").textContent=anatomy[0];
    el("surprise-negative-help").textContent=anatomy[1];
    el("surprise-copy-negative").textContent=anatomy[2];
    const modelValue=el("surprise-model").value||"flux";
    el("surprise-model").replaceChildren(new Option("FLUX","flux"),new Option(anatomy[3],"other"));
    el("surprise-model").value=modelValue;
    const themeValue=theme.value||"any",kindValue=kind.value||"image";
    theme.replaceChildren(...surpriseThemes.map((value)=>new Option(t()[value],value)));theme.value=themeValue;
    kind.replaceChildren(new Option(t().image,"image"),new Option(t().video,"video"));kind.value=kindValue;
  }
  translate();
  if(savedLayout){size.value=presets.includes(savedLayout.size)||savedLayout.size==="custom"?savedLayout.size:"";width.value=savedLayout.width||"";height.value=savedLayout.height||"";framing.value=["full","medium","close"].includes(savedLayout.framing)?savedLayout.framing:"auto";}
  updateSize();document.getElementById("ui-language")?.addEventListener("change",translate);
  el("surprise-generate").addEventListener("click",()=>{
    if(!kindTouched)kind.value=["video","i2v"].includes(getMode())?"video":"image";
    const layout=surpriseLayout({width:size.value?width.value:"",height:size.value?height.value:"",framing:framing.value});
    if(!layout.valid){status.textContent=(SURPRISE_LAYOUT_UI[getLanguage()]||SURPRISE_LAYOUT_UI.EN)[11];return;}
    saveLayout();
    let result;
    for(let attempt=0;attempt<8;attempt++){result=buildSurprisePrompt({theme:theme.value,kind:kind.value,model:el("surprise-model").value});if(result.prompt!==lastPrompt)break;}
    if(layout.text){
      if(framing.value==="full")result.prompt=result.prompt.replace(/close-up|closeup|tight framing/gi,"wide framing");
      result.prompt=layout.text+". "+result.prompt;
      if(framing.value==="full" && el("surprise-model").value!=="flux" && kind.value==="image")result.negative=[result.negative,"cropped head, cropped feet, cropped limbs, close-up"].filter(Boolean).join(", ");
    }
    lastPrompt=result.prompt;output.value=result.prompt;el("surprise-output-wrap").hidden=false;status.textContent="";
    el("surprise-negative-prompt").value=result.negative;
    el("surprise-negative-wrap").hidden=!result.negative;
    el("surprise-copy-negative").hidden=!result.negative;
    onGenerated?.();
    output.focus();output.setSelectionRange(0,0);
  });
  el("surprise-use").addEventListener("click",()=>{
    const prompt=output.value.trim();if(!prompt)return;
    if(getCurrent()?.prompt?.trim()&&!window.confirm(t().confirm))return;
    restore({mode:kind.value,prompt,negative:el("surprise-negative-prompt").value.trim(),language:"EN",model:""});status.textContent=t().used;
    document.querySelector(".result-column")?.scrollIntoView({behavior:"smooth",block:"start"});
  });
  el("surprise-copy").addEventListener("click",async()=>{
    try{await navigator.clipboard.writeText(output.value);status.textContent=t().copied;}
    catch{status.textContent=t().copyError;}
  });
  el("surprise-copy-negative").addEventListener("click",async()=>{
    try{await navigator.clipboard.writeText(el("surprise-negative-prompt").value);status.textContent=t().copied;}
    catch{status.textContent=t().copyError;}
  });
}
