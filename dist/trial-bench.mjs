// Local planning and user review only. No generation, model calls or file writes.
export const trialBenchKey='artoftomworks.v2.trialBench';
export const trialAxes=['lighting','style','framing','motion'];
export const trialDecisions=['planned','works','improve','reject'];
export const trialPresets={
 lighting:[['Window light','Soft directional daylight from a large window, gentle natural fill.'],['Rembrandt','One raised key light at about 45 degrees, a small triangle of light on the shadow-side cheek, restrained fill.'],['Rim light','A restrained rear rim light separating the subject from the background, with soft frontal fill.'],['Colored cinema light','A soft warm key light and a subtle cool accent, controlled color separation.']],
 style:[['Editorial photograph','Natural editorial photography, lifelike texture and restrained processing.'],['Oil painting','An oil painting with visible brushwork and layered pigment.'],['Watercolor','A watercolor illustration with translucent washes and textured paper.'],['Graphic illustration','A clean graphic illustration with deliberate shapes and controlled linework.']],
 framing:[['Wide','Wide composition with the entire subject visible and comfortable space around it.'],['Medium','Medium composition showing the upper body and surrounding context.'],['Close-up','Close-up composition centered on the face or main detail.'],['Full body','Full-body composition, head and feet entirely in frame, with clear margins.']],
 motion:[['Locked camera','Locked-off camera; no camera movement.'],['Push-in','A slow subtle forward camera push.'],['Lateral tracking','A slow lateral camera move with restrained parallax.'],['Small orbit','A small slow camera orbit around the subject.']]
};
const clone=v=>JSON.parse(JSON.stringify(v));
const txt=(v,n=5000)=>String(v??'').replace(/\u0000/g,'').slice(0,n);
const uid=()=>globalThis.crypto?.randomUUID?.()||'trial-'+Date.now()+'-'+Math.random().toString(36).slice(2);
const leaf=v=>txt(v,500).split(/[\\/]/).pop();
const numeric=(v,max)=>v===''||v==null?'':Number.isFinite(Number(v))&&Number(v)>=0&&Number(v)<=max?Number(v):'';
function actualSource(raw){if(!raw||typeof raw!=='object')return null;const settings={};for(const k of ['width','height','steps','cfg','seed','fps','frames','duration'])if(typeof raw.settings?.[k]==='number'&&Number.isFinite(raw.settings[k]))settings[k]=raw.settings[k];for(const k of ['sampler','scheduler'])if(typeof raw.settings?.[k]==='string')settings[k]=txt(raw.settings[k],100);return {id:txt(raw.id,100),filename:leaf(raw.filename),kind:raw.kind==='video'?'video':'image',prompt:txt(raw.prompt,50000),negative:txt(raw.negative,10000),model:leaf(raw.model),settings};}
export function normalizeTrialProject(raw){
 if(!raw||typeof raw!=='object'||!Array.isArray(raw.variants)||raw.variants.length<2||raw.variants.length>6)throw Error('format');
 const b=raw.base||{},base={};for(const k of ['scene','lighting','style','framing','motion','action','negative','model'])base[k]=txt(b[k],k==='scene'?12000:k==='negative'?6000:3000);
 for(const k of ['width','height'])base[k]=numeric(b[k],16384);base.seed=numeric(b.seed,Number.MAX_SAFE_INTEGER);base.seconds=numeric(b.seconds,60);
 const project={id:txt(raw.id,100)||uid(),title:txt(raw.title,120),mode:raw.mode==='video'?'video':'image',axis:trialAxes.includes(raw.axis)?raw.axis:'lighting',base,variants:[],updatedAt:typeof raw.updatedAt==='string'?txt(raw.updatedAt,40):''};if(project.mode==='image'&&project.axis==='motion')project.axis='lighting';
 project.variants=raw.variants.map(v=>{if(!v||typeof v!=='object')throw Error('format');const r=v.result;return {id:txt(v.id,100)||uid(),title:txt(v.title,120),direction:txt(v.direction,3000),customPrompt:typeof v.customPrompt==='string'?txt(v.customPrompt,24000):null,customBasis:txt(v.customBasis,24000),decision:trialDecisions.includes(v.decision)?v.decision:'planned',note:txt(v.note,2000),result:r&&typeof r==='object'?{filename:leaf(r.filename),kind:r.kind==='video'?'video':'image',prompt:txt(r.prompt,24000),negative:txt(r.negative,6000),plannedModel:txt(r.plannedModel,3000),plannedSettings:{width:numeric(r.plannedSettings?.width,16384),height:numeric(r.plannedSettings?.height,16384),seed:numeric(r.plannedSettings?.seed,Number.MAX_SAFE_INTEGER),seconds:numeric(r.plannedSettings?.seconds,60)},fingerprint:txt(r.fingerprint,60000),actual:actualSource(r.actual)}:null};});
 if(new Set(project.variants.map(v=>v.id)).size!==project.variants.length)throw Error('format');return project;
}
export function createTrialProject(axis='lighting',mode='image'){
 const chosen=trialAxes.includes(axis)&&!(mode!=='video'&&axis==='motion')?axis:'lighting';return normalizeTrialProject({id:uid(),title:'Portrait lighting study',mode,axis:chosen,base:{scene:'An adult subject in a simple studio, wearing a plain dark jacket, relaxed expression, neutral background.',lighting:'Soft neutral studio illumination.',style:'Natural editorial photography.',framing:'Medium portrait with comfortable margins around the head and shoulders.',motion:'Locked-off camera.',action:'Gentle natural breathing and a small change of gaze.',negative:'unintended cropped head, malformed anatomy, extra limbs, flicker, morphing',model:'',seed:42,width:'',height:'',seconds:5},variants:trialPresets[chosen].map(([title,direction])=>({id:uid(),title,direction}))});
}
export function trialBasis(project,variant){
 const p=normalizeTrialProject(project),v=p.variants.find(x=>x.id===variant.id);if(!v)throw Error('variant');
 const lines=[p.base.scene.trim()];for(const [key,label]of [['framing','Composition'],['style','Visual medium and style'],['lighting','Lighting']]){const value=p.axis===key?v.direction:p.base[key];if(value.trim())lines.push(label+': '+value.trim());}
 if(p.mode==='video'){if(p.base.action.trim())lines.push('Subject action: '+p.base.action.trim());const value=p.axis==='motion'?v.direction:p.base.motion;if(value.trim())lines.push('Motion: '+value.trim());lines.push('Maintain coherent subject appearance and geometry across frames, with natural motion and stable illumination.');}else lines.push('Clear intentional composition, coherent geometry and materials appropriate to the chosen medium.');
 return lines.filter(Boolean).join('\n\n');
}
export const trialPrompt=(p,v)=>v.customPrompt??trialBasis(p,v);
export const trialManualStale=(p,v)=>v.customPrompt!==null&&v.customBasis!==trialBasis(p,v);
export const trialFingerprint=(p,v)=>JSON.stringify([trialPrompt(p,v),p.base.negative,p.mode,p.base.model,p.base.width,p.base.height,p.base.seed,p.mode==='video'?p.base.seconds:'']);
export const trialResultStale=(p,v)=>Boolean(v.result&&v.result.fingerprint!==trialFingerprint(p,v));
export function attachTrialResult(project,variantId,file,actual=null){
 const p=normalizeTrialProject(project),v=p.variants.find(x=>x.id===variantId);if(!v||!leaf(file.filename)||!['image','video'].includes(file.kind))throw Error('media');
 if(!trialPrompt(p,v).trim())throw Error('prompt');v.result={filename:leaf(file.filename),kind:file.kind,prompt:trialPrompt(p,v),negative:p.base.negative,plannedModel:p.base.model,plannedSettings:{width:p.base.width,height:p.base.height,seed:p.base.seed,seconds:p.base.seconds},fingerprint:trialFingerprint(p,v),actual:actualSource(actual)};v.decision='planned';return p;
}
export function trialRecipe(project,variantId){
 const p=normalizeTrialProject(project),v=p.variants.find(x=>x.id===variantId);if(!v?.result||v.decision!=='works'||trialResultStale(p,v))throw Error('review');const r=v.result,a=r.actual;
 return {item:{id:a?.id||'',filename:r.filename,kind:r.kind,prompt:a?.prompt||r.prompt,negative:a?.prompt?a.negative:r.negative,language:'EN',model:a?.model||'',settings:a?.settings||{},origins:[{role:p.axis==='framing'?'composition':p.axis,title:'Trial bench · '+p.title+' · '+v.title+(a?.prompt?' · recorded prompt':' · planned prompt; file metadata not verified'),sourceId:a?.id||'',filename:r.filename,model:a?.model||''}]},notes:{title:(p.title+' · '+v.title).slice(0,120),worked:[v.note,'Planned trial direction: '+v.direction,'PLANNED settings, not recovered metadata: '+JSON.stringify({model:r.plannedModel,...r.plannedSettings})].filter(Boolean).join('\n'),avoid:''}};
}
export function exportTrialText(project){const p=normalizeTrialProject(project);return ['PROMPT STUDIO — TRIAL BENCH',p.title,'One planned variable: '+p.axis,'Settings below are plans; set them in your generator. Actual output is not guaranteed.','COMMON PLANNED SETTINGS',JSON.stringify({model:p.base.model,width:p.base.width,height:p.base.height,seed:p.base.seed,seconds:p.base.seconds}),'',...p.variants.flatMap(v=>[v.title,'DIRECTION: '+v.direction,'PROMPT',trialPrompt(p,v),'NEGATIVE',p.base.negative,'USER DECISION: '+v.decision,v.note,'RESULT: '+(v.result?.filename||'—'),trialResultStale(p,v)?'Result belongs to an earlier prompt/settings revision.':'',''])].join('\n');}
export const serializeTrial=p=>JSON.stringify({type:'PromptStudioTrial',version:1,project:normalizeTrialProject(p)},null,2);
export function parseTrial(text){if(typeof text!=='string'||text.length>500000)throw Error('format');const raw=JSON.parse(text);if(raw.type!=='PromptStudioTrial'||raw.version!==1)throw Error('format');return normalizeTrialProject({...raw.project,id:uid()});}
export function createTrialStore(storage){
 let raw=null,projects=[],problem=false;try{raw=storage.getItem(trialBenchKey);if(raw){if(raw.length>2000000)throw Error();const data=JSON.parse(raw);if(data.version!==1||!Array.isArray(data.projects)||data.projects.length>20)throw Error();projects=data.projects.map(normalizeTrialProject);if(new Set(projects.map(p=>p.id)).size!==projects.length)throw Error();}}catch{problem=true;}
 const commit=next=>{if(problem)throw Error('storage');if(next.length>20)throw Error('limit');const text=JSON.stringify({version:1,projects:next});if(text.length>2000000)throw Error('limit');if(storage.getItem(trialBenchKey)!==raw)throw Error('conflict');storage.setItem(trialBenchKey,text);projects=next;raw=text;};
 return {list:()=>clone(projects),problem:()=>problem,save(project){const p=normalizeTrialProject({...project,updatedAt:new Date().toISOString()});commit(projects.some(x=>x.id===p.id)?projects.map(x=>x.id===p.id?p:x):[...projects,p]);return clone(p);},remove(id){commit(projects.filter(p=>p.id!==id));}};
}
