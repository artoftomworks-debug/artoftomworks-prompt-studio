import {generatedQualityMedia,qualityPrefixPhrase} from "./quality-prefix.mjs";
import {generatedSurpriseMedia} from "./creative-forge.mjs";
import {options,promptSectionHeadings} from "./engine.mjs";
import {imageDirectionGroups,imageDirectionLanguages} from "./image-direction.mjs";

const mediumArt={oil:"paint",watercolor:"paint",impressionist:"paint",expressionist:"paint",cubist:"paint",anime:"draw",comic:"draw",popart:"draw"};
const mediumPhoto=new Set(["glamour","documentary"]);
export function styleMediumIntent(mix=[],hybrid=false){
  if(hybrid)return null;
  const candidates=mix.filter(x=>x.percent>0&&(mediumArt[x.id]||mediumPhoto.has(x.id))).sort((a,b)=>b.percent-a.percent);
  const primary=candidates[0];return primary?{kind:mediumArt[primary.id]||"photo",style:primary.id}:null;
}
export function mediumBuildState(state,intent){
  if(!intent||state.mode!=="image")return state;
  if(intent.kind==="photo")return {...state,medium:"photo",style:"editorial",qualityPrefix:state.qualityPrefix==="creativeArt"?"proPhoto":state.qualityPrefix,artStyle:"auto"};
  return {...state,medium:intent.kind==="draw"?"graphic":"painting",style:"painterly",qualityPrefix:state.qualityPrefix==="proPhoto"?"creativeArt":state.qualityPrefix,
    artStyle:intent.style==="oil"?"oil":intent.style==="watercolor"?"watercolor":intent.kind==="draw"?"illustration":"expressive",capture:"auto",cameraModel:"auto",lens:"auto"};
}
let mediumCatalog=null;
function catalog(){
  if(mediumCatalog)return mediumCatalog;
  const extra=imageDirectionLanguages.flatMap((language,i)=>[
    ...["photo","film"].map(key=>({language,kind:"photo",value:imageDirectionGroups.medium.options[key][i]})),
    ...["painting","poster","graphic"].map(key=>({language,kind:"art",value:imageDirectionGroups.medium.options[key][i]})),
    ...["cinematic","editorial","natural"].map(key=>({language,kind:"photo",value:options.style[key][i]})),
    {language,kind:"art",value:options.style.painterly[i]}
  ]);
  mediumCatalog=[...generatedQualityMedia(),...generatedSurpriseMedia(),...extra].filter(x=>x.value).sort((a,b)=>b.value.length-a.value.length).map(x=>({...x,
    probe:x.value.split(/[,.;]/u)[0].slice(0,30).replace(/\s+/gu," ").toLocaleLowerCase(),
    pattern:new RegExp("(^|[.;]\\s*)"+phrasePattern(x.value)+"(?=$|[.;])","giu")
  }));return mediumCatalog;
}
const mediumEscape=value=>value.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
function phrasePattern(value){return value.split(/([,.;]|\s+)/u).filter(Boolean).map(token=>/^[,.;]$/.test(token)?"[,.;]":/^\s+$/.test(token)?"\\s*":mediumEscape(token)).join("");}
export function reconcileStyleMedium(value,intent,language="EN"){
  const original=String(value||"");if(!intent||!original)return {prompt:original,changed:false};
  const headings=Object.fromEntries(["EN","HU","DE","FR","ES","IT","PT","PL"].map(code=>[code,promptSectionHeadings(code)]));
  const protectedNames=new Set(Object.values(headings).flatMap(h=>h.filter((_,i)=>i!==4&&i!==5)));
  const targetKind=intent.kind==="photo"?"photo":"art",neutral=qualityPrefixPhrase(targetKind==="photo"?"proPhoto":"creativeArt",language);
  let replacedOpening=false,unresolved=false;
  const prompt=original.split("\n").map(line=>{
    const heading=line.match(/^([^:\n]{1,65}):\s*/u),name=heading?.[1];
    // Subjects and settings may themselves contain photographs or paintings. Keep those sentences verbatim.
    if(name&&protectedNames.has(name))return line;
    // Existing style/studio direction sections are handled by their own editable layer.
    if(/^(?:Visual direction mix|Stíluskeverék|Studio direction|Camera motion direction)/u.test(line))return line;
    let body=heading?line.slice(heading[0].length):line,changed=false;
    const scan=body.replace(/\s+/gu," ").toLocaleLowerCase();
    for(const item of catalog()){
      if(!scan.includes(item.probe))continue;
      if(item.kind===targetKind&&!item.opening&&targetKind!=="art")continue;
      if(item.kind===targetKind&&item.opening)continue;
      body=body.replace(item.pattern,(match,prefix)=>{changed=true;if(item.opening&&!replacedOpening){replacedOpening=true;return prefix+neutral;}return prefix;});
    }
    if(targetKind==="art"&&/^(?:(?:a|an)\s+)?(?:photorealistic|professional\s+photograph|photographic\s+(?:portrait|render))/iu.test(body.trim()))unresolved=true;
    if(!changed)return line;
    body=body.replace(/(?:[.;]\s*){2,}/gu,". ").replace(/^[.;]\s*/u,"").replace(/\s*[;]\s*$/u,"").trim();
    if(!body)return "";return (heading?heading[0]:"")+body;
  }).filter(Boolean).join("\n");
  return {prompt,changed:prompt!==original,unresolved};
}
