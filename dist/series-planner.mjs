// Local, model-independent scene planning. No generation or media upload.
export const seriesPlannerKey='artoftomworks.v2.seriesPlanner';
export const seriesStatuses=['planned','created','proven'];
export const seriesTemplates=['cafe','portrait','product','landscape','custom'];
export const seriesFramings=['wide','medium','close','macro'];
export const seriesMotions=['static','push','pan','track','orbit'];
const clone=value=>JSON.parse(JSON.stringify(value));
const clean=(value,max=4000)=>String(value??'').replace(/\u0000/g,'').slice(0,max);
const uuid=()=>globalThis.crypto?.randomUUID?.()||'series-'+Date.now()+'-'+Math.random().toString(36).slice(2);
const pick=(value,values,fallback)=>values.includes(value)?value:fallback;
const rows={
 cafe:{title:'Rainy cafe',idea:'A rainy afternoon at a quiet city cafe.',location:'The same cozy cafe and the street immediately outside it.',subject:'A plain ceramic coffee cup, rain on the window and a wet city street.',time:'Late afternoon, overcast rainy weather.',lighting:'Soft cool daylight outside, warm amber cafe lights inside.',style:'Natural cinematic realism.',palette:'Muted blue-gray exterior and warm amber interior.',shots:[['Window view','View from inside the cafe past the coffee cup toward the rain-covered window and the street.','Rain continues outside; small droplets slide down the glass. The cup and furniture remain still.','wide'],['Rain on glass','Close detail of raindrops on that same cafe window, with the street softly out of focus behind it.','Fresh droplets arrive irregularly; some merge and travel down the glass. Background movement stays subtle.','close'],['Puddle outside','A shallow puddle on the pavement just outside that cafe, reflecting the same warm window lights.','Rain strikes at changing positions. Each small splash collapses promptly and its ripples expand and fade; no persistent upward jet.','close']]},
 portrait:{title:'Portrait series',idea:'A coherent portrait series of one adult subject.',location:'The same simple portrait studio and backdrop.',subject:'The same adult subject, hairstyle and clothing in every shot.',time:'One continuous studio session.',lighting:'Soft key light with gentle fill and a restrained rim light.',style:'Natural editorial portrait photography.',palette:'Restrained neutral tones.',shots:[['Setting','Show the adult subject within the studio setting.','Gentle breathing and one small natural posture adjustment.','wide'],['Portrait','A medium portrait of the same adult subject with the same clothing and backdrop.','A subtle change of gaze and relaxed natural breathing.','medium'],['Detail','A close view of the same subject’s face, keeping identifying features consistent.','A natural blink and a slight, unhurried expression change.','close']]},
 product:{title:'Product series',idea:'A coherent product presentation.',location:'The same clean tabletop and backdrop.',subject:'The same unbranded ceramic object, with identical shape, color and surface details.',time:'One continuous tabletop session.',lighting:'Soft directional studio light and controlled reflections.',style:'Clean realistic product imagery.',palette:'Warm neutral tones with one consistent accent.',shots:[['Setting','Show the product in its tabletop setting.','The object remains still; hold a stable composition.','wide'],['Product','A medium view showing the same product’s overall shape and finish.','The object remains still with stable lighting and reflections.','medium'],['Material','A close detail of the same product’s material and surface.','The surface details stay stable; no deformation or invented markings.','macro']]},
 landscape:{title:'Landscape series',idea:'A coherent landscape sequence.',location:'The same mountain lake, shoreline and nearby trees.',subject:'The same lake, mountains and vegetation.',time:'Early morning in calm weather.',lighting:'Soft dawn light with gentle haze.',style:'Natural cinematic landscape imagery.',palette:'Muted green, cool blue and pale gold.',shots:[['Landscape','A wide view establishing the lake and surrounding mountains.','A light breeze moves foliage gently and creates subtle ripples on the lake.','wide'],['Shoreline','A medium view of the shoreline within that same landscape.','Small ripples reach the shore while nearby plants move gently.','medium'],['Detail','A close view of nearby leaves with the same lake softly visible behind them.','A gentle breeze causes small irregular leaf movements.','close']]},
 custom:{title:'New series',idea:'Describe the main idea here.',location:'Describe the shared location.',subject:'Describe the same subjects and objects to keep across shots.',time:'Describe the shared time and weather.',lighting:'Describe the shared lighting.',style:'Describe the desired visual style.',palette:'Describe the shared color palette.',shots:[['Opening','Establish the location and main subject.','Describe one restrained, believable action.','wide'],['Subject','Show the main subject within that same setting.','Describe a small natural action appropriate to this shot.','medium'],['Detail','A complementary detail from that same setting.','Describe a simple detail movement.','close']]}
};
export function createSeriesProject(template='cafe'){
 const source=rows[pick(template,seriesTemplates,'cafe')];
 return normalizeSeriesProject({id:uuid(),title:source.title,shared:{...source,shots:undefined,title:undefined,ratio:'16:9'},scenes:source.shots.map(([title,description,action,framing])=>({id:uuid(),title,description,action,framing,motion:'static',seconds:5,status:'planned'}))});
}
export function normalizeSeriesProject(value){
 if(!value||typeof value!=='object'||!Array.isArray(value.scenes)||value.scenes.length!==3)throw Error('format');
 const shared=value.shared||{};
 const result={id:clean(value.id,100)||uuid(),title:clean(value.title,120),shared:{},scenes:[]};
 for(const key of ['idea','location','subject','time','lighting','style','palette'])result.shared[key]=clean(shared[key],key==='idea'?8000:3000);
 result.shared.ratio=pick(shared.ratio,['16:9','9:16','1:1','4:3','3:2'],'16:9');
 result.scenes=value.scenes.map(scene=>{
  if(!scene||typeof scene!=='object')throw Error('format');
  const seconds=Number(scene.seconds);
  return {id:clean(scene.id,100)||uuid(),title:clean(scene.title,120),description:clean(scene.description,6000),action:clean(scene.action,3000),
   framing:pick(scene.framing,seriesFramings,'medium'),motion:pick(scene.motion,seriesMotions,'static'),seconds:Number.isFinite(seconds)?Math.min(30,Math.max(1,seconds)):5,status:pick(scene.status,seriesStatuses,'planned'),
   imageCustom:typeof scene.imageCustom==='string'?clean(scene.imageCustom,16000):null,videoCustom:typeof scene.videoCustom==='string'?clean(scene.videoCustom,16000):null,
   imageBasis:clean(scene.imageBasis,30000),videoBasis:clean(scene.videoBasis,30000),media:{imageName:clean(scene.media?.imageName,255).split(/[\\/]/).pop(),videoName:clean(scene.media?.videoName,255).split(/[\\/]/).pop()}};
 });
 if(new Set(result.scenes.map(s=>s.id)).size!==3)throw Error('format');
 return result;
}
export function seriesSceneBasis(project,scene,kind){
 const p=normalizeSeriesProject(project),s=p.scenes.find(s=>s.id===scene.id);if(!s)throw Error('scene');
 const framing={wide:'Wide establishing composition',medium:'Medium composition',close:'Close-up detail composition',macro:'Macro detail composition'}[s.framing];
 const shared=[['Core idea',p.shared.idea],['Shared location',p.shared.location],['Continuity references, only where visible in this shot',p.shared.subject],['Time and weather',p.shared.time],['Lighting',p.shared.lighting],['Visual style',p.shared.style],['Color palette',p.shared.palette]].filter(([,v])=>v.trim()).map(([k,v])=>k+': '+v.trim().replace(/[.\s]+$/,'')+'.').join('\n');
 const common=shared+'\nScene: '+s.description.trim()+'\n'+framing+'. Target aspect ratio: '+p.shared.ratio+'. Include only the subjects and objects appropriate to this shot; do not add every continuity reference to every composition.';
 if(kind==='image')return common+'\nCreate a clear, intentional composition with coherent geometry and materials. Keep shared subject details, palette and lighting consistent with the series.';
 const movement={static:'Locked-off camera; no camera movement.',push:'A slow, subtle forward camera push.',pan:'A slow, controlled horizontal camera pan.',track:'A slow lateral camera tracking move.',orbit:'A small, slow camera orbit around the subject.'}[s.motion];
 return 'Use this shot’s reference image as the visual starting point.\n'+common+'\nAction over the shot: '+s.action.trim()+'\n'+movement+'\nSuggested shot duration: '+s.seconds+' seconds. Preserve the reference appearance and composition while adding believable motion, stable details and consistent illumination. Keep the series style and mood. No sudden cuts.';
}
export function seriesScenePrompt(project,scene,kind){return (kind==='image'?scene.imageCustom:scene.videoCustom)??seriesSceneBasis(project,scene,kind);}
export function seriesSceneStale(project,scene,kind){const custom=kind==='image'?scene.imageCustom:scene.videoCustom,basis=kind==='image'?scene.imageBasis:scene.videoBasis;return custom!==null&&basis!==seriesSceneBasis(project,scene,kind);}
export function serializeSeriesProject(project){return JSON.stringify({type:'PromptStudioSeries',version:1,project:normalizeSeriesProject(project)},null,2);}
export function parseSeriesProject(text){
 if(typeof text!=='string'||text.length>300000)throw Error('format');
 const raw=JSON.parse(text);if(raw?.type!=='PromptStudioSeries'||raw.version!==1)throw Error('format');
 return normalizeSeriesProject({...raw.project,id:uuid()});
}
export function exportSeriesText(project){
 const p=normalizeSeriesProject(project);
 return ['PROMPT STUDIO — SERIES PLAN',p.title,'Suggested settings are plans, not recovered generation metadata. Set dimensions, duration and frame count in your generation tool.','Prompt scaffolding is English; user-written descriptions keep their original language.','',...p.scenes.flatMap((s,i)=>[
  `${String(i+1).padStart(2,'0')} · ${s.title} [${s.status}]`,`${p.shared.ratio} · ${s.seconds}s · ${s.motion}`,
  'IMAGE PROMPT',seriesScenePrompt(p,s,'image'),'','VIDEO PROMPT',seriesScenePrompt(p,s,'video'),'','RESULT REFERENCES (filenames only)',s.media.imageName||'—',s.media.videoName||'—',''
 ])].join('\n');
}
export function createSeriesStore(storage){
 let raw=null,projects=[],problem='';
 try{raw=storage.getItem(seriesPlannerKey);if(raw){if(raw.length>2000000)throw Error('format');const parsed=JSON.parse(raw);if(parsed.version!==1||!Array.isArray(parsed.projects)||parsed.projects.length>25)throw Error('format');projects=parsed.projects.map(normalizeSeriesProject);if(new Set(projects.map(p=>p.id)).size!==projects.length)throw Error('format');}}
 catch{problem='storage';}
 return {list:()=>clone(projects),problem:()=>problem,
  save(project){if(problem)throw Error('storage');const normalized=normalizeSeriesProject(project),next=projects.some(p=>p.id===normalized.id)?projects.map(p=>p.id===normalized.id?normalized:p):[...projects,normalized];
   if(next.length>25)throw Error('limit');const nextRaw=JSON.stringify({version:1,projects:next});if(nextRaw.length>2000000)throw Error('limit');
   if(storage.getItem(seriesPlannerKey)!==raw)throw Error('conflict');storage.setItem(seriesPlannerKey,nextRaw);raw=nextRaw;projects=next;return clone(normalized);},
  remove(id){if(problem)throw Error('storage');if(storage.getItem(seriesPlannerKey)!==raw)throw Error('conflict');const next=projects.filter(p=>p.id!==id),nextRaw=JSON.stringify({version:1,projects:next});storage.setItem(seriesPlannerKey,nextRaw);raw=nextRaw;projects=next;}
 };
}
