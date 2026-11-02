import {normalizePoseFigure,poseLimit} from './studio-poses.mjs';

const estimateMap={nose:[0],neck:[11,12],lShoulder:[11],rShoulder:[12],lElbow:[13],rElbow:[14],lWrist:[15],rWrist:[16],pelvis:[23,24],lHip:[23],rHip:[24],lKnee:[25],rKnee:[26],lAnkle:[27],rAnkle:[28]};
export function poseEstimateCandidates(raw){
 if(!raw||!Number.isFinite(raw.width)||!Number.isFinite(raw.height)||raw.width<1||raw.height<1||raw.width>4096||raw.height>4096||!Array.isArray(raw.landmarks))throw Error('invalid');
 return raw.landmarks.slice(0,poseLimit).flatMap((landmarks,index)=>{
  if(!Array.isArray(landmarks)||landmarks.length!==33)return [];
  const points={},confidence={};for(const [key,ids]of Object.entries(estimateMap)){
   const values=ids.map(i=>landmarks[i]);if(!values.every(v=>v&&Number.isFinite(v.x)&&Number.isFinite(v.y)&&v.x>=-.75&&v.x<=1.75&&v.y>=-.75&&v.y<=1.75))return [];
   points[key]={x:values.reduce((s,v)=>s+v.x,0)/values.length,y:values.reduce((s,v)=>s+v.y,0)/values.length};
   confidence[key]=Math.min(...values.map(v=>Math.max(0,Math.min(1,Number.isFinite(v.visibility)?v.visibility:0,Number.isFinite(v.presence)?v.presence:1))));
  }
  // Reject degenerate detections, while retaining clearly marked uncertain limbs.
  const span=Math.hypot(points.neck.x-points.pelvis.x,points.neck.y-points.pelvis.y);
  if(span<.025||Object.values(confidence).filter(v=>v>=.5).length<6)return [];
  return [{index,points,confidence,uncertain:Object.keys(points).filter(k=>confidence[k]<.5)}];
 });
}

// Fit 2D landmarks to the reference image plane. No invented metric depth,
// age, gender, identity, inter-person depth or hidden body geometry is inferred.
export function poseFiguresFromEstimate(candidates,mapPoint,{name='Estimated figure',idPrefix='estimate'}={}){
 return candidates.map((candidate,index)=>{
  const world=Object.fromEntries(Object.entries(candidate.points).map(([key,p])=>[key,mapPoint(p)])),pelvis=world.pelvis;
  if(!Object.values(world).every(p=>p&&['x','y','z'].every(k=>Number.isFinite(p[k])))||Math.abs(pelvis.x)>5||pelvis.y<0||pelvis.y>4)throw Error('alignment');
  const ys=Object.values(world).map(p=>p.y),height=Math.max(.6,Math.min(2.3,Math.max(...ys)-Math.min(...ys)+.15)),scale=height/1.75;
  const joints=Object.fromEntries(Object.entries(world).map(([key,p])=>[key,{x:(p.x-pelvis.x)/scale,y:(p.y-pelvis.y)/scale,z:0}]));
  if(Object.values(joints).some(p=>Math.abs(p.x)>3||Math.abs(p.y)>3))throw Error('alignment');
  return normalizePoseFigure({id:'figure_'+idPrefix+'_'+index,name:name+' '+(index+1),identity:'unspecified',height,position:{x:pelvis.x,y:pelvis.y,z:0},facing:0,joints,confidence:candidate.confidence},index);
 });
}

export function createPoseEstimator({createWorker=url=>new Worker(url),decode=async ref=>createImageBitmap(await (await fetch(ref.dataURL)).blob()),origin=globalThis.location?.origin,timeout=45000}={}){
 let active=null,sequence=0;
 function cancel(){if(active){const item=active;active=null;clearTimeout(item.timer);item.worker.terminate();item.reject(Error('cancelled'));}}
 async function estimate(reference,onProgress=()=>{}){
  cancel();if(!/^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(origin||''))throw Error('launcher');
  if(!reference||!/^data:image\/(png|jpeg|webp|avif);base64,/.test(reference.dataURL||'')||reference.dataURL.length>18000000)throw Error('image');
  const id=++sequence;let bitmap;try{bitmap=await decode(reference);}catch{throw Error('image');}if(id!==sequence){bitmap.close?.();throw Error('cancelled');}
  return new Promise((resolve,reject)=>{
   let worker;try{worker=createWorker(origin+'/pose-assets/pose-worker.js');}catch{bitmap.close?.();reject(Error('unavailable'));return;}
   const item={id,worker,reject,timer:null};active=item;
   const finish=(error,value)=>{if(active!==item)return;active=null;clearTimeout(item.timer);worker.terminate();if(error)reject(Error(error));else resolve(value);};
   item.timer=setTimeout(()=>finish('timeout'),timeout);
   worker.onmessage=event=>{const message=event.data;if(message?.id!==id||active!==item)return;if(message.type==='done'){try{finish(null,poseEstimateCandidates(message.result));}catch{finish('failed');}}else if(message.type==='error')finish('failed');else if(['loading','working'].includes(message.type))onProgress(message.type);};
   worker.onerror=()=>finish('unavailable');try{worker.postMessage({id,bitmap},[bitmap]);}catch{bitmap.close?.();finish('failed');}
  });
 }
 return {estimate,cancel:()=>{sequence++;cancel();}};
}
