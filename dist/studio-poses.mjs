// Articulated schematic figures, in metres. Local front is -Z; the pelvis is the root.
export const poseLimit=8;
export const poseJoints=['pelvis','neck','nose','rShoulder','rElbow','rWrist','lShoulder','lElbow','lWrist','rHip','rKnee','rAnkle','lHip','lKnee','lAnkle'];
export const poseParents={neck:'pelvis',nose:'neck',rShoulder:'neck',rElbow:'rShoulder',rWrist:'rElbow',lShoulder:'neck',lElbow:'lShoulder',lWrist:'lElbow',rHip:'pelvis',rKnee:'rHip',rAnkle:'rKnee',lHip:'pelvis',lKnee:'lHip',lAnkle:'lKnee'};
export const poseKinds=['standing','seated','walking','raised','kneeling'];
export const poseAnimalJoints=[...poseJoints,'tailBase','tailTip'];
export const poseAnimalParents={...poseParents,tailBase:'pelvis',tailTip:'tailBase'};
export const poseFigureJoints=f=>f?.species==='dog'||f?.species==='cat'?poseAnimalJoints:poseJoints;
export const poseFigureParents=f=>f?.species==='dog'||f?.species==='cat'?poseAnimalParents:poseParents;
export const poseFigureKinds=f=>f?.species==='dog'||f?.species==='cat'?['standing','seated','lying','walking']:poseKinds;
export const poseFigureScale=f=>f.height/(f.species==='dog'||f.species==='cat'?.6:1.75);
export const poseAnimalHeight=(species,size='medium')=>species==='cat'?{small:.20,medium:.27,large:.34}[size]||.27:{small:.30,medium:.55,large:.80}[size]||.55;
function poseAnimalBase(species,size){const cat=species==='cat',length=cat?.85:size==='small'?.95:size==='large'?1.12:1,front=-.58*length,head=size==='small'?1.12:size==='large'?.94:1;return {pelvis:pv(0,0,0),neck:pv(0,.02,front),nose:pv(0,.22*head,front-.24*head),rShoulder:pv(-.13,.0,front),rElbow:pv(-.14,-.30,front+.02),rWrist:pv(-.14,-.58,front-.04),lShoulder:pv(.13,0,front),lElbow:pv(.14,-.30,front+.02),lWrist:pv(.14,-.58,front-.04),rHip:pv(-.13,-.02,.02),rKnee:pv(-.15,-.27,-.12),rAnkle:pv(-.15,-.58,.08),lHip:pv(.13,-.02,.02),lKnee:pv(.15,-.27,-.12),lAnkle:pv(.15,-.58,.08),tailBase:pv(0,.04,.22),tailTip:pv(0,cat?.40:.18,cat?.50:.58)};}
const poseColors=['#ff7777','#67d5ff','#ffcf63','#aa93ff','#67e1ad','#ff9ada','#d6e776','#90b9ff'];
const poseNum=(v,d,min,max)=>v!==null&&v!==''&&Number.isFinite(Number(v))?Math.max(min,Math.min(max,Number(v))):d;
const posePoint=(v,d)=>({x:poseNum(v?.x,d.x,-3,3),y:poseNum(v?.y,d.y,-3,3),z:poseNum(v?.z,d.z,-3,3)});
const pv=(x,y,z)=>({x,y,z}),pa=(a,b)=>pv(a.x+b.x,a.y+b.y,a.z+b.z),ps=(a,b)=>pv(a.x-b.x,a.y-b.y,a.z-b.z),pm=(a,s)=>pv(a.x*s,a.y*s,a.z*s),pd=(a,b)=>a.x*b.x+a.y*b.y+a.z*b.z,pc=(a,b)=>pv(a.y*b.z-a.z*b.y,a.z*b.x-a.x*b.z,a.x*b.y-a.y*b.x),pl=a=>Math.hypot(a.x,a.y,a.z),pu=a=>pm(a,1/(pl(a)||1));
const poseClone=v=>JSON.parse(JSON.stringify(v));
function poseBase(){return {pelvis:pv(0,0,0),neck:pv(0,.53,0),nose:pv(0,.73,-.08),rShoulder:pv(-.2,.49,0),rElbow:pv(-.27,.2,0),rWrist:pv(-.27,-.08,-.02),lShoulder:pv(.2,.49,0),lElbow:pv(.27,.2,0),lWrist:pv(.27,-.08,-.02),rHip:pv(-.12,0,0),rKnee:pv(-.12,-.44,0),rAnkle:pv(-.12,-.87,0),lHip:pv(.12,0,0),lKnee:pv(.12,-.44,0),lAnkle:pv(.12,-.87,0)};}
export function normalizePoseFigure(raw={},index=0){
 const species=['human','dog','cat'].includes(raw.species)?raw.species:'human',animal=species!=='human',size=['small','medium','large'].includes(raw.size)?raw.size:'medium',keys=poseFigureJoints({species});
 const confidence={};for(const key of keys){const v=raw.confidence?.[key];if(typeof v==='number'&&Number.isFinite(v))confidence[key]=Math.max(0,Math.min(1,v));}
 const base=animal?poseAnimalBase(species,size):poseBase(),joints={};for(const key of keys)joints[key]=posePoint(raw.joints?.[key],base[key]);joints.pelvis=pv(0,0,0);
 return {species,size,identity:!animal&&['unspecified','man','woman','child','custom'].includes(raw.identity)?raw.identity:'unspecified',id:/^figure_[\w-]{1,70}$/.test(raw.id||'')?raw.id:'figure_'+index,name:typeof raw.name==='string'?raw.name.trim().slice(0,60):'',description:typeof raw.description==='string'?raw.description.trim().slice(0,240):'',color:/^#[0-9a-f]{6}$/i.test(raw.color||'')?raw.color:poseColors[index%8],visible:raw.visible!==false,position:{x:poseNum(raw.position?.x,0,-5,5),y:poseNum(raw.position?.y,animal?.58*(poseAnimalHeight(species,size)/.6):.9,0,4),z:poseNum(raw.position?.z,0,-5,5)},height:poseNum(raw.height,animal?poseAnimalHeight(species,size):1.75,animal?.12:.6,animal?1.2:2.3),facing:poseNum(raw.facing,0,-180,180),kind:poseFigureKinds({species}).includes(raw.kind)?raw.kind:'standing',...(Object.keys(confidence).length?{confidence}:{}),joints};
}
export function normalizePoseFigures(raw){const result=(Array.isArray(raw)?raw:[]).slice(0,poseLimit).map(normalizePoseFigure),seen=new Set();for(let i=0;i<result.length;i++){let n=0;while(seen.has(result[i].id))result[i].id='figure_normalized_'+i+'_'+n++;seen.add(result[i].id);}return result;}
export function poseDescendants(key,raw={}){const result=[key],parents=poseFigureParents(raw);for(const child of poseFigureJoints(raw))if(parents[child]===key)result.push(...poseDescendants(child,raw));return result;}
// Rotate a selected bone and its descendants around its parent; bone lengths stay fixed.
export function poseMoveJoint(raw,key,target){
 const f=normalizePoseFigure(raw),parents=poseFigureParents(f);if(!parents[key])return f;
 const pivot=f.joints[parents[key]],a=ps(f.joints[key],pivot),b=ps(posePoint(target,f.joints[key]),pivot);if(pl(a)<1e-7||pl(b)<1e-7)return f;
 const u=pu(a),v=pu(b),dot=Math.max(-1,Math.min(1,pd(u,v))),cross=pc(u,v);let axis=pu(cross),angle=Math.acos(dot);
 if(pl(cross)<1e-7){if(dot>0)return f;axis=pu(pc(u,Math.abs(u.x)<.8?pv(1,0,0):pv(0,1,0)));}
 for(const child of poseDescendants(key,f)){const q=ps(f.joints[child],pivot),rot=pa(pa(pm(q,Math.cos(angle)),pm(pc(axis,q),Math.sin(angle))),pm(axis,pd(axis,q)*(1-Math.cos(angle))));f.joints[child]=pa(pivot,rot);}
 return f;
}
export function posePreset(kind='standing',raw={}){
 if(raw.species==='dog'||raw.species==='cat')return poseAnimalPreset(kind,raw);
 let f=normalizePoseFigure({...raw,confidence:undefined,joints:poseBase(),kind});const scale=f.height/1.75;f.position.y=.9*scale;
 if(kind==='raised'){f=poseMoveJoint(f,'lElbow',pv(.4,.76,0));f=poseMoveJoint(f,'lWrist',pv(.44,1,-.06));}
 if(kind==='seated'){f=poseMoveJoint(f,'rKnee',pv(-.12,0,-.44));f=poseMoveJoint(f,'lKnee',pv(.12,0,-.44));f=poseMoveJoint(f,'rAnkle',pv(-.12,-.43,-.44));f=poseMoveJoint(f,'lAnkle',pv(.12,-.43,-.44));f.position.y=.46*scale;}
 if(kind==='walking'){f=poseMoveJoint(f,'lKnee',pv(.12,-.38,-.22));f=poseMoveJoint(f,'rKnee',pv(-.12,-.38,.22));f=poseMoveJoint(f,'rElbow',pv(-.24,.27,-.2));f=poseMoveJoint(f,'lElbow',pv(.24,.23,.14));}
 if(kind==='kneeling'){f=poseMoveJoint(f,'rKnee',pv(-.12,-.22,-.38));f=poseMoveJoint(f,'lKnee',pv(.12,-.22,-.38));f=poseMoveJoint(f,'rAnkle',pv(-.12,-.22,.05));f=poseMoveJoint(f,'lAnkle',pv(.12,-.22,.05));f.position.y=.25*scale;}
 return f;
}
function poseAnimalPreset(kind,raw){
 let f=normalizePoseFigure({...raw,kind,confidence:undefined,joints:undefined});
 const target=(key,q)=>{const k=poseFigureScale(f),r=f.facing*Math.PI/180;f=poseMoveWorldTarget(f,key,{x:f.position.x+(q.x*Math.cos(r)+q.z*Math.sin(r))*k,y:f.position.y+q.y*k,z:f.position.z+(-q.x*Math.sin(r)+q.z*Math.cos(r))*k},true);};
 if(kind==='seated'){
  f=poseMoveJoint(f,'neck',pv(0,.35,-.45));
  for(const side of ['l','r']){const x=side==='l'?.15:-.15;target(side+'Wrist',pv(x,-.20,-.58));target(side+'Ankle',pv(x,-.22,.02));}
 }
 if(kind==='lying'){for(const side of ['l','r']){f=poseMoveJoint(f,side+'Elbow',pv(side==='l'?.17:-.17,-.10,-.78));f=poseMoveJoint(f,side+'Wrist',pv(side==='l'?.17:-.17,-.11,-1.03));f=poseMoveJoint(f,side+'Knee',pv(side==='l'?.20:-.20,-.10,-.22));f=poseMoveJoint(f,side+'Ankle',pv(side==='l'?.23:-.23,-.13,.05));}}
 if(kind==='walking'){f=poseMoveJoint(f,'lElbow',pv(.14,-.24,-.76));f=poseMoveJoint(f,'rElbow',pv(-.14,-.25,-.40));f=poseMoveJoint(f,'lKnee',pv(.15,-.22,.12));f=poseMoveJoint(f,'rKnee',pv(-.15,-.22,-.22));}
 f.position.y=Math.max(.02,-Math.min(...Object.values(f.joints).map(p=>p.y))*poseFigureScale(f)+.025);return f;
}
// Reset only the applied base pose; keep identity, size, turn and placement.
export function poseResetFigure(raw){const f=normalizePoseFigure(raw),reset=posePreset(f.kind,f);reset.position={...f.position};return reset;}
export function poseWorldJoints(raw){const f=normalizePoseFigure(raw),r=f.facing*Math.PI/180,c=Math.cos(r),s=Math.sin(r),k=poseFigureScale(f),result={};for(const key of poseFigureJoints(f)){const p=f.joints[key];result[key]=pa(f.position,pv((p.x*c+p.z*s)*k,p.y*k,(-p.x*s+p.z*c)*k));}return result;}
export function poseLocalPoint(raw,point){const f=normalizePoseFigure(raw),r=-f.facing*Math.PI/180,q=pm(ps(point,f.position),1/poseFigureScale(f));return pv(q.x*Math.cos(r)+q.z*Math.sin(r),q.y,-q.x*Math.sin(r)+q.z*Math.cos(r));}
export function poseBoneAngles(f,key){const p=ps(f.joints[key],f.joints[poseFigureParents(f)[key]]);return {azimuth:Math.atan2(p.x,-p.z)*180/Math.PI,elevation:Math.atan2(p.y,Math.hypot(p.x,p.z))*180/Math.PI};}
export function poseSetBoneAngles(f,key,azimuth,elevation){if(!poseFigureParents(f)[key])return normalizePoseFigure(f);const a=azimuth*Math.PI/180,e=elevation*Math.PI/180,pivot=f.joints[poseFigureParents(f)[key]],length=pl(ps(f.joints[key],pivot));return poseMoveJoint(f,key,pa(pivot,pv(Math.sin(a)*Math.cos(e)*length,Math.sin(e)*length,-Math.cos(a)*Math.cos(e)*length)));}
// Orthographic editing basis. Space view looks down onto the floor when tilted.
export function poseViewBasis(view='front',yaw=35,tilt=25){
 if(view==='side')return {right:pv(0,0,1),up:pv(0,1,0),forward:pv(-1,0,0)};
 if(view!=='space')return {right:pv(1,0,0),up:pv(0,1,0),forward:pv(0,0,1)};
 const y=poseNum(yaw,35,-3600,3600)*Math.PI/180,t=poseNum(tilt,25,-89,89)*Math.PI/180;
 const right=pv(Math.cos(y),0,-Math.sin(y)),up=pv(Math.sin(y)*Math.sin(t),Math.cos(t),Math.cos(y)*Math.sin(t));return {right,up,forward:pc(right,up)};
}
export function poseScreenDelta(basis,dx,dy,scale,{axis=null,fine=false,snap=0}={}){
 if(!Number.isFinite(scale)||scale<=0||![dx,dy].every(Number.isFinite))return null;
 let delta;
 if(['x','y','z'].includes(axis)){
  const sx=basis.right[axis],sy=-basis.up[axis],length=sx*sx+sy*sy;if(length<.0225)return null;
  delta=pv(0,0,0);delta[axis]=(dx*sx+dy*sy)/(length*scale);
 }else delta=pa(pm(basis.right,dx/scale),pm(basis.up,-dy/scale));
 if(fine)delta=pm(delta,.1);
 if(Number.isFinite(snap)&&snap>0)for(const k of ['x','y','z'])delta[k]=Math.round(delta[k]/snap)*snap;
 return delta;
}
// Two-bone target solving for hands and feet; other joints rotate their subtree.
// This preserves segment lengths, but does not impose anatomical angle limits.
export function poseMoveWorldTarget(raw,key,worldTarget,useIK=true){
 let f=normalizePoseFigure(raw);if(!poseFigureJoints(f).includes(key)||!worldTarget||!['x','y','z'].every(k=>Number.isFinite(worldTarget[k])))return f;
 if(key==='pelvis'){f.position={...worldTarget};return normalizePoseFigure(f);}
 const target=poseLocalPoint(f,worldTarget),chains={lWrist:['lShoulder','lElbow'],rWrist:['rShoulder','rElbow'],lAnkle:['lHip','lKnee'],rAnkle:['rHip','rKnee']},chain=useIK?chains[key]:null;
 if(!chain)return poseMoveJoint(f,key,target);
 const [root,middle]=chain,a=f.joints[root],b=f.joints[middle],c=f.joints[key],l1=pl(ps(b,a)),l2=pl(ps(c,b));if(l1<1e-7||l2<1e-7)return f;
 const direction=ps(target,a),requested=pl(direction),u=requested>1e-8?pu(direction):pl(ps(c,a))>1e-8?pu(ps(c,a)):pu(ps(b,a)),distance=Math.max(Math.abs(l1-l2)+1e-6,Math.min(l1+l2-1e-6,requested));
 let bend=ps(ps(b,a),pm(u,pd(ps(b,a),u)));
 if(pl(bend)<1e-7){const pole=key.endsWith('Ankle')?pv(0,0,-1):pv(key[0]==='r'?-1:1,0,-1);bend=ps(pole,pm(u,pd(pole,u)));if(pl(bend)<1e-7)bend=pc(u,pv(0,1,0));if(pl(bend)<1e-7)bend=pc(u,pv(1,0,0));}
 const along=(l1*l1-l2*l2+distance*distance)/(2*distance),height=Math.sqrt(Math.max(0,l1*l1-along*along));f.joints[middle]=pa(a,pa(pm(u,along),pm(pu(bend),height)));f.joints[key]=pa(a,pm(u,distance));return normalizePoseFigure(f);
}
export function poseMirrorFigure(raw){const f=normalizePoseFigure(raw),before=poseClone(f.joints);for(const key of poseFigureJoints(f)){const other=key[0]==='l'?'r'+key.slice(1):key[0]==='r'?'l'+key.slice(1):key,p=before[other];f.joints[key]=pv(-p.x,p.y,p.z);}if(f.confidence){const before={...f.confidence};f.confidence=Object.fromEntries(poseFigureJoints(f).flatMap(key=>{const other=key[0]==='l'?'r'+key.slice(1):key[0]==='r'?'l'+key.slice(1):key;return before[other]===undefined?[]:[[key,before[other]]];}));}return f;}
export function poseSceneText(figures){const fs=normalizePoseFigures(figures).filter(f=>f.visible);if(!fs.length)return '';
 const n=v=>v.toFixed(2),point=p=>`(${n(p.x)}, ${n(p.y)}, ${n(p.z)}) m`;
 return ` Pose layout: ${fs.length} visible figure${fs.length===1?'':'s'}; figure names are reference labels, not text to render. `+fs.map((f,i)=>{const w=poseWorldJoints(f),body=f.joints;if(f.species!=='human'){const labels={nose:'muzzle',neck:'withers',pelvis:'rear body',lShoulder:'left front shoulder',rShoulder:'right front shoulder',lElbow:'left front elbow',rElbow:'right front elbow',lWrist:'left front paw',rWrist:'right front paw',lHip:'left hind hip',rHip:'right hind hip',lKnee:'left hind knee',rKnee:'right hind knee',lAnkle:'left hind paw',rAnkle:'right hind paw',tailBase:'tail base',tailTip:'tail tip'};return `Figure ${i+1} [${f.name||f.id}] (${f.size} ${f.species})${f.description?': '+f.description:''}: ${f.kind} quadruped base pose, shoulder-height scale ${n(f.height)} m, body at ${point(f.position)}, facing ${n(f.facing)} degrees. Animal joint targets: ${poseFigureJoints(f).map(k=>labels[k]+' '+point(w[k])).join('; ')}. Keep four paws and one tail, with a quadruped body.`;}const raised=['lWrist','rWrist'].filter(k=>body[k].y>body.neck.y).map(k=>k[0]==='l'?'left':'right');return `Figure ${i+1} [${f.name||f.id}]${f.identity==='man'?' (adult man)':f.identity==='woman'?' (adult woman)':f.identity==='child'?' (child)':''}${f.description?': '+f.description:''}: ${f.kind} base pose, pelvis at ${point(f.position)}, height ${n(f.height)} m, body turned ${n(f.facing)} degrees from facing -Z${raised.length?', '+raised.join(' and ')+' hand raised':''}. Joint targets in shared scene coordinates: ${['nose','lShoulder','lElbow','lWrist','rShoulder','rElbow','rWrist','lHip','lKnee','lAnkle','rHip','rKnee','rAnkle'].map(k=>`${k} ${point(w[k])}`).join('; ')}.`;}).join(' ')+' Preserve the separately posed figures and their relative spacing. Use the exported pose reference in a compatible pose-conditioning workflow for stronger spatial control; prose coordinates alone do not enforce a pose.';
}
export function poseCameraProjection(plan,width=1024,height=1024){
 const camera=plan.camera,origin=camera.position;let forward;
 if(camera.aim)forward=pu(ps(plan.subject,origin));else {const yaw=camera.yaw*Math.PI/180,pitch=camera.pitch*Math.PI/180;forward=pv(Math.sin(yaw)*Math.cos(pitch),Math.sin(pitch),Math.cos(yaw)*Math.cos(pitch));}
 let right=pu(pc(pv(0,1,0),forward));if(pl(right)<.1)right=pv(1,0,0);const up=pu(pc(forward,right)),roll=camera.roll*Math.PI/180,focal=width*camera.lens/36;
 return p=>{const q=ps(p,origin),depth=pd(q,forward),x=pd(q,right),y=pd(q,up),rx=x*Math.cos(roll)+y*Math.sin(roll),ry=-x*Math.sin(roll)+y*Math.cos(roll);return {x:width/2+rx*focal/(depth||1e-8),y:height/2-ry*focal/(depth||1e-8),visible:depth>.05,depth};};
}
// OpenPose BODY_18 order and its usual limb palette. This is a reference, not a model guarantee.
export const poseBody18=['nose','neck','rShoulder','rElbow','rWrist','lShoulder','lElbow','lWrist','rHip','rKnee','rAnkle','lHip','lKnee','lAnkle',null,null,null,null];
export const poseBodyEdges=[[1,2],[1,5],[2,3],[3,4],[5,6],[6,7],[1,8],[8,9],[9,10],[1,11],[11,12],[12,13],[1,0]];
export const poseBodyColors=['#ff0000','#ff5500','#ffaa00','#ffff00','#aaff00','#55ff00','#00ff00','#00ff55','#00ffaa','#00ffff','#00aaff','#0055ff','#0000ff'];
export function poseExport(plan,width=1024){const [a,b]=plan.camera.ratio.split(':').map(Number),height=Math.round(width*b/a),project=poseCameraProjection(plan,width,height);const people=normalizePoseFigures(plan.figures).filter(f=>f.visible&&f.species==='human').map(f=>{const w=poseWorldJoints(f);return {person_id:[-1],pose_keypoints_2d:poseBody18.flatMap(key=>{if(!key)return [0,0,0];const p=project(w[key]);return p.visible&&p.x>=0&&p.x<width&&p.y>=0&&p.y<height?[+p.x.toFixed(3),+p.y.toFixed(3),+(f.confidence?.[key]??1).toFixed(3)]:[0,0,0];}),face_keypoints_2d:[],hand_left_keypoints_2d:[],hand_right_keypoints_2d:[]};});return {version:1.3,canvas_width:width,canvas_height:height,people};}
export function poseFitCamera(raw){const plan=poseClone(raw),points=normalizePoseFigures(plan.figures).filter(f=>f.visible).flatMap(f=>Object.values(poseWorldJoints(f)));if(!points.length)return plan;
 const low=pv(...['x','y','z'].map(k=>Math.min(...points.map(p=>p[k])))),high=pv(...['x','y','z'].map(k=>Math.max(...points.map(p=>p[k])))),center=pm(pa(low,high),.5),[a,b]=plan.camera.ratio.split(':').map(Number),span=Math.max(.5,high.x-low.x,(high.y-low.y)*a/b);
 const d=Math.max(.9,span*35/36*1.3)+(high.z-low.z)/2,cameraZ=Math.max(-5,Math.min(low.z-.6,center.z-d)),lens=Math.max(14,Math.min(35,(low.z-cameraZ)*36/(span*1.3)));
 plan.subject=center;plan.camera={...plan.camera,aim:true,roll:0,lens,framing:'full',position:pv(center.x,Math.max(.1,center.y),cameraZ)};return plan;
}
