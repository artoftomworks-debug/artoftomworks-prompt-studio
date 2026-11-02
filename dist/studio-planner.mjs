import {normalizeLightSphere,sphereCenter,sphereDirection,sphereText} from './studio-sphere.mjs';
import {normalizePoseFigures,poseSceneText,poseLimit,poseWorldJoints} from "./studio-poses.mjs";
// Coordinates are metres in a schematic studio: +X right, +Y up, +Z behind the subject.
export const studioPlannerKey="artoftomworks.promptStudio.virtualStudio.v1";
const vsClone=value=>JSON.parse(JSON.stringify(value));
const vsNumber=(value,fallback,min,max)=>Number.isFinite(Number(value))&&value!==null&&value!==""?Math.max(min,Math.min(max,Number(value))):fallback;
const vsText=(value,max=80)=>typeof value==="string"?value.trim().slice(0,max):"";
const vsChoice=(value,choices,fallback)=>choices.includes(value)?value:fallback;
export const studioRoles=["key","fill","rim","ambient"];
export const studioLightTypes=["softbox","umbrella","spot","area","point"];
export const studioMotionTypes=["static","dolly-in","dolly-out","truck","crane","orbit","custom"];
export const studioPresetNames=["portrait","beauty","dramatic","window","product","dolly","crane","orbit"];
export function normalizeStudioReference(raw={}){
 return {anchor:{x:vsNumber(raw?.anchor?.x,0.5,0.02,0.98),y:vsNumber(raw?.anchor?.y,0.48,0.02,0.98)},strength:vsNumber(raw?.strength,55,0,100),exposure:vsNumber(raw?.exposure,0,-2,2),contrast:vsNumber(raw?.contrast,0,-40,40),saturation:vsNumber(raw?.saturation,100,0,160),split:vsNumber(raw?.split,50,0,100),showMarkers:raw?.showMarkers!==false};
}
export function studioPosition(raw={},fallback={x:0,y:1.5,z:0}){
  return {x:vsNumber(raw?.x,fallback.x,-5,5),y:vsNumber(raw?.y,fallback.y,0.1,6),z:vsNumber(raw?.z,fallback.z,-5,5)};
}
function vsLight(raw={},index=0){
  return {id:/^lamp_[\w-]{1,70}$/.test(raw.id||"")?raw.id:"lamp_"+index,name:vsText(raw.name),role:vsChoice(raw.role,studioRoles,"key"),type:vsChoice(raw.type,studioLightTypes,"softbox"),
    position:studioPosition(raw.position,{x:-2,y:2.2,z:-2}),size:vsNumber(raw.size,1,0.1,3),modifier:vsChoice(raw.modifier,["none","diffuser","grid"],"none"),
    intensity:Math.round(vsNumber(raw.intensity,60,0,100)),colorMode:vsChoice(raw.colorMode,["temperature","gel"],"temperature"),kelvin:Math.round(vsNumber(raw.kelvin,5600,2000,10000)),color:/^#[0-9a-f]{6}$/i.test(raw.color||"")?raw.color:"#fff1dc"};
}
export function normalizeStudioPlan(raw={}){
  if(!raw||typeof raw!=="object"||Array.isArray(raw))raw={};const camera=raw.camera||{},motion=raw.motion||{};
  const lights=(Array.isArray(raw.lights)?raw.lights:[]).slice(0,6).map(vsLight),seen=new Set();
  for(let i=0;i<lights.length;i++){let suffix=0;while(seen.has(lights[i].id))lights[i].id="lamp_normalized_"+i+"_"+suffix++;seen.add(lights[i].id);}
  return {version:1,lightSphere:normalizeLightSphere(raw.lightSphere),figures:normalizePoseFigures(raw.figures),reference:normalizeStudioReference(raw.reference),customDirections:typeof raw.customDirections==="string"?raw.customDirections.slice(0,10000):null,mode:vsChoice(raw.mode,["image","video"],"image"),subject:studioPosition(raw.subject,{x:0,y:1.45,z:0}),
    camera:{position:studioPosition(camera.position,{x:0,y:1.5,z:-3}),aim:camera.aim!==false,yaw:vsNumber(camera.yaw,0,-180,180),pitch:vsNumber(camera.pitch,0,-85,85),roll:vsNumber(camera.roll,0,-45,45),lens:vsNumber(camera.lens,85,14,200),aperture:vsNumber(camera.aperture,2.8,1.2,16),framing:vsChoice(camera.framing,["portrait","full","product","wide"],"portrait"),ratio:vsChoice(camera.ratio,["3:2","16:9","9:16","1:1","4:3"],"3:2"),filter:vsChoice(camera.filter,["none","diffusion","warm","cool","monochrome"],"none")},
    lights,motion:{type:vsChoice(motion.type,studioMotionTypes,"static"),duration:vsNumber(motion.duration,5,1,20),amount:vsNumber(motion.amount,1,0.1,3),reverse:motion.reverse===true,angle:vsNumber(motion.angle,45,-120,120),easing:vsChoice(motion.easing,["linear","smooth"],"smooth"),end:studioPosition(motion.end,{x:1,y:1.5,z:-2})}};
}
export function studioPreset(name="portrait"){
  const plan=normalizeStudioPlan({lights:[{id:"lamp_key",role:"key",position:{x:-1.8,y:2.3,z:-1.5},intensity:70,size:1.2},{id:"lamp_fill",role:"fill",position:{x:1.8,y:1.7,z:-1},intensity:30,size:1.5},{id:"lamp_rim",role:"rim",position:{x:1.5,y:2.3,z:1.4},intensity:35,size:0.6}]});
  if(name==="beauty"){plan.camera.lens=85;plan.camera.aperture=5.6;plan.lights[0].position={x:0,y:2.5,z:-1.5};plan.lights[1].position={x:0,y:0.8,z:-1.2};plan.lights[1].intensity=40;plan.lights[0].modifier="diffuser";}
  if(name==="dramatic"){plan.camera.lens=50;plan.camera.aperture=2.8;plan.lights[0].type="spot";plan.lights[0].size=0.3;plan.lights[0].modifier="grid";plan.lights[1].intensity=8;plan.lights[2].intensity=55;}
  if(name==="window"){plan.camera.lens=50;plan.lights=[vsLight({id:"lamp_window",name:"",type:"area",role:"key",position:{x:-2,y:1.8,z:-0.3},size:2,intensity:65,kelvin:6000})];}
  if(name==="product"){plan.subject={x:0,y:0.8,z:0};plan.camera.position={x:0,y:1.1,z:-2};plan.camera.lens=70;plan.camera.aperture=8;plan.camera.framing="product";plan.lights[0].position={x:-1.3,y:1.8,z:-1};plan.lights[1].position={x:1.2,y:1.3,z:-0.5};}
  if(["dolly","crane","orbit"].includes(name)){plan.mode="video";plan.camera.lens=50;plan.camera.aperture=4;plan.camera.ratio="16:9";plan.camera.framing="wide";plan.motion.type=name==="dolly"?"dolly-in":name;plan.motion.amount=name==="crane"?1.2:0.8;plan.motion.angle=45;}
  return normalizeStudioPlan(plan);
}
export function studioAim(position,target){
  const dx=target.x-position.x,dy=target.y-position.y,dz=target.z-position.z;
  return {yaw:Math.atan2(dx,dz)*180/Math.PI,pitch:Math.atan2(dy,Math.hypot(dx,dz))*180/Math.PI};
}
export function studioCameraAt(raw,progress=0){
  const plan=normalizeStudioPlan(raw),start=plan.camera.position,m=plan.motion;
  let t=vsNumber(progress,0,0,1);if(m.easing==="smooth")t=t*t*(3-2*t);
  if(plan.mode!=="video"||m.type==="static")return {...start};
  if(m.type==="orbit"){
    const a=m.angle*Math.PI/180*t,dx=start.x-plan.subject.x,dz=start.z-plan.subject.z;
    return {x:plan.subject.x+dx*Math.cos(a)+dz*Math.sin(a),y:start.y,z:plan.subject.z-dx*Math.sin(a)+dz*Math.cos(a)};
  }
  let end={...start};const dx=plan.subject.x-start.x,dz=plan.subject.z-start.z,distance=Math.hypot(dx,dz),unit=distance>0.0001?{x:dx/distance,z:dz/distance}:{x:0,z:1};
  if(m.type==="dolly-in"||m.type==="dolly-out"){const amount=(m.type==="dolly-in"?Math.min(m.amount,Math.max(0,distance-0.3)):-m.amount);end.x+=unit.x*amount;end.z+=unit.z*amount;}
  if(m.type==="truck"){const yaw=(plan.camera.aim?studioAim(start,plan.subject).yaw:plan.camera.yaw)*Math.PI/180,amount=m.amount*(m.reverse?-1:1);end.x+=Math.cos(yaw)*amount;end.z-=Math.sin(yaw)*amount;}
  if(m.type==="crane")end.y+=m.amount*(m.reverse?-1:1);
  if(m.type==="custom")end=m.end;
  end=studioPosition(end,start);return {x:start.x+(end.x-start.x)*t,y:start.y+(end.y-start.y)*t,z:start.z+(end.z-start.z)*t};
}
const vsFixed=n=>(Math.abs(n)<0.005?0:n).toFixed(2);
const vsPositionText=p=>"("+[p.x,p.y,p.z].map(vsFixed).join(", ")+") m";
export function studioPlanText(raw){
  const p=normalizeStudioPlan(raw),c=p.camera,a=c.aim?studioAim(c.position,p.subject):c;
  const frame={portrait:"portrait framing",full:"full-body framing with space above the head and below the feet",product:"clear product framing",wide:"wide environmental framing"}[c.framing];
  const filter={none:"",diffusion:"a subtle diffusion-filter look with soft highlight bloom",warm:"a restrained warm filter treatment",cool:"a restrained cool filter treatment",monochrome:"a monochrome tonal treatment"}[c.filter];
  let text="Studio direction: Show the intended scene from this camera viewpoint; use the setup as composition and lighting direction. Keep cameras, lighting rigs and diagram annotations out of view unless the scene explicitly requests them. Coordinate reference only: +X right, +Y up, +Z behind the subject. Subject target at "+vsPositionText(p.subject)+". Camera at "+vsPositionText(c.position)+", yaw "+vsFixed(a.yaw)+"°, pitch "+vsFixed(a.pitch)+"°, roll "+vsFixed(c.roll)+"°. The viewpoint is "+(c.position.y>p.subject.y+0.15?"above":c.position.y<p.subject.y-0.15?"below":"near")+" subject-target height. "+(c.aim?"Aim at the subject target. ":"Keep the specified camera orientation. ")+"Use "+vsFixed(c.lens)+" mm full-frame-style lens perspective, f/"+vsFixed(c.aperture)+" depth-of-field character, "+frame+", aspect ratio "+c.ratio+". ";
  if(filter)text+="Use "+filter+". ";
  const lights=p.lights.filter(l=>l.intensity>0);
  if(!lights.length&&!p.lightSphere.enabled)text+="No additional physical lighting is specified. ";
  const facing=studioAim(c.position,p.subject).yaw*Math.PI/180;
  for(const [index,l]of lights.entries()){
    const side=(l.position.x-p.subject.x)*Math.cos(facing)-(l.position.z-p.subject.z)*Math.sin(facing);
    const where=Math.abs(side)<0.2?"near the camera centreline":side<0?"on camera-left in the starting view":"on camera-right in the starting view";
    const aim=studioAim(l.position,p.subject);
    text+=(l.name?l.name+" — ":"Light "+(index+1)+" — ")+l.role+" light, "+l.type+", source size "+vsFixed(l.size)+" m, at "+vsPositionText(l.position)+", "+where+", "+(l.position.y>p.subject.y+0.15?"above":l.position.y<p.subject.y-0.15?"below":"near")+" subject-target height; aim toward the subject (yaw "+vsFixed(aim.yaw)+"°, pitch "+vsFixed(aim.pitch)+"°). ";
    text+=(l.colorMode==="gel"?"Coloured gel "+l.color:"Colour temperature "+l.kelvin+" K")+", descriptive strength "+l.intensity+"/100"+(l.modifier==="none"?".":l.modifier==="diffuser"?", with diffusion for softer light.":", with a grid for directional control.")+" ";
  }
  text+="Keep the chosen lighting relationships coherent throughout the scene.";
  text+=sphereText(p,poseWorldJoints);text+=poseSceneText(p.figures);
  if(p.mode==="video"){
    const end=studioCameraAt(p,1),names={static:"a locked camera","dolly-in":"a slow dolly-in toward the subject","dolly-out":"a dolly-out away from the subject",truck:"a sideways tracking/truck move",crane:p.motion.reverse?"a descending crane/jib camera move":"a rising crane/jib camera move",orbit:"an orbit around the subject",custom:"a straight camera move between the specified positions"};
    text+="\nCamera motion direction: Over "+vsFixed(p.motion.duration)+" seconds, use "+names[p.motion.type]+". Start at "+vsPositionText(c.position)+" and finish at "+vsPositionText(end)+". "+(p.motion.type==="orbit"?"Follow a "+vsFixed(p.motion.angle)+"° arc, rather than a straight line. ":"")+(c.aim?"Keep the camera aimed at the subject target throughout. ":"Keep the camera orientation constant. ")+(p.motion.type==="static"?"":p.motion.easing==="smooth"?"Ease smoothly into and out of the movement. ":"Use steady movement speed. ")+"Preserve subject identity and scene geometry, with no sudden cuts or unintended flicker.";
  }
  return text;
}
export function mergeStudioSection(existing,studioText){
  const owned=["Studio direction:","Camera motion direction:","Studio setup — schematic plan:","Camera motion plan — schematic:","Lighting direction — descriptive strength:","Fényirányok — leíró erősség:","Licht — beschreibende Stärke:","Éclairage — intensité descriptive:","Iluminación — intensidad descriptiva:","Luci — intensità descrittiva:","Luz — intensidade descritiva:","Światło — siła opisowa:"];
  const kept=String(existing||"").split("\n").filter(line=>!owned.some(prefix=>line.trimStart().startsWith(prefix))).join("\n").trim();
  const lines=String(studioText||"").trim().split("\n").map(l=>l.trim()).filter(Boolean);
  if(!lines.length)throw Error("empty");
  const section=lines.every(l=>l.startsWith("Studio direction:")||l.startsWith("Camera motion direction:"))?lines.join("\n"):"Studio direction: "+lines.join(" ").replace(/^Studio direction:\s*/,"");
  const next=[kept,section].filter(Boolean).join("\n");if(next.length>10000)throw Error("limit");return next;
}
export function studioLightColor(light){
  if(light.colorMode==="gel")return /^#[0-9a-f]{6}$/i.test(light.color||"")?light.color:"#fff1dc";
  // Approximate diagram swatches only, not a calibrated Kelvin-to-colour transform.
  const k=vsNumber(light.kelvin,5600,2000,10000),low=k<=5600?[255,164,75]:[255,250,240],high=k<=5600?[255,250,240]:[184,214,255],t=k<=5600?(k-2000)/3600:(k-5600)/4400;
  return "#"+low.map((value,i)=>Math.round(value+(high[i]-value)*t).toString(16).padStart(2,"0")).join("");
}
export function studioPlanWarnings(raw){
  const p=normalizeStudioPlan(raw),warnings=[],c=p.camera.position,s=p.subject;
  if(Math.hypot(c.x-s.x,c.y-s.y,c.z-s.z)<0.3)warnings.push("camera-close");
  if(!p.camera.aim){const yaw=p.camera.yaw*Math.PI/180,pitch=p.camera.pitch*Math.PI/180,forward={x:Math.sin(yaw)*Math.cos(pitch),y:Math.sin(pitch),z:Math.cos(yaw)*Math.cos(pitch)};if((s.x-c.x)*forward.x+(s.y-c.y)*forward.y+(s.z-c.z)*forward.z<=0)warnings.push("target-behind");}
  if(p.mode==="video"&&Array.from({length:33},(_,i)=>studioCameraAt(p,i/32)).some(v=>Math.abs(v.x)>5||Math.abs(v.z)>5||v.y<0.1||v.y>6))warnings.push("outside-grid");
  return warnings;
}
export function createStudioPlannerStore(storage){
  let state=studioPreset(),presets=[],lastRaw=null,problem=false;
  const validFigures=s=>s.figures===undefined||(Array.isArray(s.figures)&&s.figures.length<=poseLimit&&s.figures.every(f=>f&&typeof f==="object"&&!Array.isArray(f)));
  function parse(value){
    if(typeof value!=="string"||new TextEncoder().encode(value).length>400000)throw Error("limit");const raw=JSON.parse(value);
    if(raw?.version!==1||!validFigures(raw.state||{})||raw.state?.version!==1||!Array.isArray(raw.state.lights)||raw.state.lights.length>6||!Array.isArray(raw.presets)||raw.presets.length>30)throw Error("format");
    const names=new Set();const loaded=raw.presets.map(p=>{const name=vsText(p?.name);if(!name||!validFigures(p?.state||{})||p?.state?.version!==1||!Array.isArray(p.state.lights)||p.state.lights.length>6||names.has(name))throw Error("format");names.add(name);return {name,state:normalizeStudioPlan(p.state)};});return {version:1,state:normalizeStudioPlan(raw.state),presets:loaded};
  }
  try{lastRaw=storage.getItem(studioPlannerKey);if(lastRaw){const loaded=parse(lastRaw);state=loaded.state;presets=loaded.presets;}}catch{problem=true;}
  return {problem:()=>problem,read:()=>vsClone({version:1,state,presets}),parse,
    save(raw){if(problem)throw Error("storage");const next=parse(JSON.stringify(raw)),value=JSON.stringify(next);if(storage.getItem(studioPlannerKey)!==lastRaw)throw Error("conflict");storage.setItem(studioPlannerKey,value);state=next.state;presets=next.presets;lastRaw=value;return vsClone(next);},
    export:()=>JSON.stringify({version:1,state,presets},null,2)};
}
