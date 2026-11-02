import {normalizeStudioPlan,normalizeStudioReference,studioAim,studioPosition,studioLightColor} from './studio-planner.mjs';
const refClamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function studioReferencePoint(plan,light){
 const p=normalizeStudioPlan(plan),angle=studioAim(p.camera.position,p.subject).yaw*Math.PI/180;
 const side=(light.position.x-p.subject.x)*Math.cos(angle)-(light.position.z-p.subject.z)*Math.sin(angle);
 return {x:refClamp(p.reference.anchor.x+side*.14,.02,.98),y:refClamp(p.reference.anchor.y-(light.position.y-p.subject.y)*.18,.02,.98)};
}
export function moveStudioReference(plan,id,x,y){
 const p=normalizeStudioPlan(plan),point={x:refClamp(Number(x)||0,.02,.98),y:refClamp(Number(y)||0,.02,.98)};
 if(id==='subject'){p.reference.anchor=point;return p;}const light=p.lights.find(l=>l.id===id);if(!light)return p;
 const angle=studioAim(p.camera.position,p.subject).yaw*Math.PI/180,side=(light.position.x-p.subject.x)*Math.cos(angle)-(light.position.z-p.subject.z)*Math.sin(angle),delta=(point.x-p.reference.anchor.x)/.14-side;
 light.position=studioPosition({x:light.position.x+delta*Math.cos(angle),y:p.subject.y-(point.y-p.reference.anchor.y)/.18,z:light.position.z-delta*Math.sin(angle)},light.position);return p;
}
export function studioReferenceEffects(raw){
 const p=normalizeStudioPlan(raw);return p.lights.filter(l=>l.intensity>0&&p.reference.strength>0).map(l=>{const point=studioReferencePoint(p,l),distance=Math.hypot(l.position.x-p.subject.x,l.position.y-p.subject.y,l.position.z-p.subject.z);return {id:l.id,...point,color:studioLightColor(l),radius:refClamp(.22+l.size*.2,.24,.82),alpha:refClamp(l.intensity/100*p.reference.strength/100*.55/(1+distance*.09),0,.5)};});
}
export function studioReferenceCanvasSize(width,height){if(!Number.isFinite(width)||!Number.isFinite(height)||width<1||height<1||width*height>40000000||width>20000||height>20000)throw Error('image');const scale=Math.min(1,1600/width,1100/height);return {width:Math.max(1,Math.round(width*scale)),height:Math.max(1,Math.round(height*scale))};}
export function studioReferenceFilter(raw){const r=normalizeStudioReference(raw);return `brightness(${2**r.exposure}) contrast(${1+r.contrast/100}) saturate(${r.saturation/100})`;}
export function studioReferenceCamera(raw){const p=normalizeStudioPlan(raw),a=p.camera.aim?studioAim(p.camera.position,p.subject):p.camera;return {yaw:Math.round(a.yaw),pitch:Math.round(a.pitch),height:Math.round(p.camera.position.y*100)/100,lens:p.camera.lens,orbit:Math.round(Math.atan2(p.camera.position.x-p.subject.x,p.subject.z-p.camera.position.z)*180/Math.PI)};}
export function moveStudioReferenceCamera(raw,key,value){const p=normalizeStudioPlan(raw),n=Number(value);if(!Number.isFinite(n))return p;if(key==='orbit'){const radius=Math.max(.3,Math.hypot(p.camera.position.x-p.subject.x,p.camera.position.z-p.subject.z)),a=refClamp(n,-180,180)*Math.PI/180;p.camera.position=studioPosition({...p.camera.position,x:p.subject.x+radius*Math.sin(a),z:p.subject.z-radius*Math.cos(a)},p.camera.position);}if(key==='height')p.camera.position.y=refClamp(n,.1,6);if(key==='lens')p.camera.lens=refClamp(n,14,200);return p;}
export function paintStudioReference({canvas,processed,image,plan,original=false}){
 const ctx=canvas.getContext?.('2d'),fx=processed.getContext?.('2d');if(!ctx||!fx||!image)return false;const p=normalizeStudioPlan(plan),{width:w,height:h}=studioReferenceCanvasSize(image.width||image.naturalWidth,image.height||image.naturalHeight);
 if(canvas.width!==w||canvas.height!==h){canvas.width=processed.width=w;canvas.height=processed.height=h;}
 ctx.clearRect(0,0,w,h);ctx.drawImage(image,0,0,w,h);if(original)return true;
 fx.clearRect(0,0,w,h);fx.save();fx.filter=studioReferenceFilter(p.reference);fx.drawImage(image,0,0,w,h);fx.restore();fx.save();fx.globalCompositeOperation='screen';
 for(const light of studioReferenceEffects(p)){const radius=light.radius*Math.max(w,h),x=light.x*w,y=light.y*h,gradient=fx.createRadialGradient(x,y,0,x,y,radius);gradient.addColorStop(0,light.color);gradient.addColorStop(1,light.color+'00');fx.globalAlpha=light.alpha;fx.fillStyle=gradient;fx.fillRect(0,0,w,h);}fx.restore();
 const split=w*p.reference.split/100;ctx.save();ctx.beginPath();ctx.rect(split,0,w-split,h);ctx.clip();ctx.drawImage(processed,0,0);ctx.restore();return true;
}
