import {normalizePoseFigures,poseWorldJoints,poseFigureScale,poseFigureParents} from './studio-poses.mjs';

const bv=(x=0,y=0,z=0)=>({x,y,z});
const badd=(a,b)=>bv(a.x+b.x,a.y+b.y,a.z+b.z),bsub=(a,b)=>bv(a.x-b.x,a.y-b.y,a.z-b.z),bmul=(a,k)=>bv(a.x*k,a.y*k,a.z*k);
const bdot=(a,b)=>a.x*b.x+a.y*b.y+a.z*b.z,bcross=(a,b)=>bv(a.y*b.z-a.z*b.y,a.z*b.x-a.x*b.z,a.x*b.y-a.y*b.x);
const blen=a=>Math.hypot(a.x,a.y,a.z),bunit=a=>bmul(a,1/(blen(a)||1)),blerp=(a,b,t)=>badd(bmul(a,1-t),bmul(b,t));
function bodyFrame(up,rightHint=bv(1,0,0)){
 const y=blen(up)>.0001?bunit(up):bv(0,1,0);let x=bsub(rightHint,bmul(y,bdot(rightHint,y)));
 if(blen(x)<.0001)x=bcross(Math.abs(y.z)<.8?bv(0,0,1):bv(0,1,0),y);x=bunit(x);return {x,y,z:bunit(bcross(x,y))};
}

// Featureless articulated mannequin, not a reconstruction of the reference photo.
// All widths scale with figure height; identity labels never add anatomical detail.
export function poseBodyMesh(rawFigures){
 const triangles=[];
 for(const f of normalizePoseFigures(rawFigures).filter(f=>f.visible)){
  const w=poseWorldJoints(f),k=poseFigureScale(f),forward=bv(Math.sin(f.facing*Math.PI/180),0,Math.cos(f.facing*Math.PI/180));
  const across=bsub(w.lShoulder,w.rShoulder),frame=bodyFrame(bsub(w.neck,w.pelvis),across);
  const color=[0,2,4].map(i=>parseInt(f.color.slice(i+1,i+3),16));
  function surface(rings,part){
   const sides=rings[0].length;
   function tri(a,b,c){triangles.push({vertices:[a,b,c],figureId:f.id,joint:part,color});}
   for(let r=0;r<rings.length-1;r++)for(let s=0;s<sides;s++){const n=(s+1)%sides;tri(rings[r][s],rings[r+1][s],rings[r+1][n]);tri(rings[r][s],rings[r+1][n],rings[r][n]);}
  }
  function ellipsoid(center,rx,ry,rz,axes,part){
   const rings=[];for(let j=0;j<=8;j++){const lat=-Math.PI/2+j*Math.PI/8,ring=[];for(let i=0;i<12;i++){
    const phi=i*Math.PI/6,local=bv(Math.cos(lat)*Math.cos(phi),Math.sin(lat),Math.cos(lat)*Math.sin(phi));
    const point=badd(center,badd(badd(bmul(axes.x,local.x*rx),bmul(axes.y,local.y*ry)),bmul(axes.z,local.z*rz)));
    const normal=bunit(badd(badd(bmul(axes.x,local.x/rx),bmul(axes.y,local.y/ry)),bmul(axes.z,local.z/rz)));
    ring.push({point,normal});
   }rings.push(ring);}surface(rings,part);
  }
  function limb(a,b,r1,r2,part){
   const d=bsub(b,a),length=blen(d);if(length<.001)return;const axes=bodyFrame(d,across),rings=[];
   // Rounded ends and a tapered shaft. Overlapping joint spheres hide bending seams.
   for(const [t,r]of [[0,.08],[.03,.8],[.12,1],[.88,1],[.97,.8],[1,.08]]){
    const center=blerp(a,b,t),radius=(r1+(r2-r1)*t)*r*k,ring=[];
    for(let i=0;i<12;i++){const phi=i*Math.PI/6,n=badd(bmul(axes.x,Math.cos(phi)),bmul(axes.z,Math.sin(phi)));ring.push({point:badd(center,bmul(n,radius)),normal:n});}rings.push(ring);
   }surface(rings,part);
  }
  if(f.species!=='human'){
   const axis=bodyFrame(bsub(w.neck,w.pelvis),across),headFrame=bodyFrame(bv(0,1,0),across),cat=f.species==='cat';
   ellipsoid(blerp(w.pelvis,w.neck,.46),.16*k,blen(bsub(w.neck,w.pelvis))*.68,.20*k,axis,'pelvis');
   limb(w.neck,w.nose,.10,.08,'nose');ellipsoid(badd(w.nose,bmul(forward,.055*k)),.12*k,.14*k,.13*k,headFrame,'nose');ellipsoid(badd(w.nose,bmul(forward,-.055*k)),.075*k,.07*k,(cat?.065:.11)*k,headFrame,'nose');
   for(const side of ['l','r']){const sign=side==='l'?1:-1;ellipsoid(badd(w.nose,badd(bmul(headFrame.x,.09*k*sign),bv(0,.12*k,.035*k))),.045*k,(cat?.10:.075)*k,.035*k,headFrame,'nose');for(const [a,b]of [['Shoulder','Elbow'],['Elbow','Wrist'],['Hip','Knee'],['Knee','Ankle']])limb(w[side+a],w[side+b],.052,.032,side+b);for(const foot of ['Wrist','Ankle'])ellipsoid(badd(w[side+foot],bmul(forward,-.035*k)),.055*k,.04*k,.085*k,headFrame,side+foot);}
   limb(w.pelvis,w.tailBase,.035,.025,'tailBase');limb(w.tailBase,w.tailTip,.025,.009,'tailTip');continue;
  }
  const spine=bsub(w.neck,w.pelvis),torso=[];
  for(const [t,rx,rz]of [[-.12,.10,.065],[0,.145,.10],[.18,.13,.09],[.42,.14,.085],[.70,.18,.10],[.86,.19,.095],[1,.065,.055]]){
   const center=badd(w.pelvis,bmul(spine,t)),ring=[];for(let i=0;i<16;i++){const phi=i*Math.PI/8,n=bunit(badd(bmul(frame.x,Math.cos(phi)/rx),bmul(frame.z,Math.sin(phi)/rz)));ring.push({point:badd(center,badd(bmul(frame.x,Math.cos(phi)*rx*k),bmul(frame.z,Math.sin(phi)*rz*k))),normal:n});}torso.push(ring);
  }surface(torso,'pelvis');
  limb(w.neck,w.nose,.055,.055,'nose');
  const headCenter=badd(w.nose,bmul(forward,.035*k));ellipsoid(headCenter,.09*k,.125*k,.095*k,frame,'nose');
  for(const side of ['l','r']){
   for(const [a,b,r1,r2]of [['Shoulder','Elbow',.064,.046],['Elbow','Wrist',.048,.032],['Hip','Knee',.089,.061],['Knee','Ankle',.063,.039]])limb(w[side+a],w[side+b],r1,r2,side+b);
   for(const [joint,r]of [['Shoulder',.066],['Elbow',.047],['Hip',.084],['Knee',.061]])ellipsoid(w[side+joint],r*k,r*k,r*k,frame,side+joint);
   const handAxis=bodyFrame(bsub(w[side+'Wrist'],w[side+'Elbow']),across),handCenter=badd(w[side+'Wrist'],bmul(handAxis.y,.052*k));ellipsoid(handCenter,.039*k,.07*k,.025*k,handAxis,side+'Wrist');
   const footAxes=bodyFrame(bsub(w[side+'Ankle'],w[side+'Knee']),across),toe=bmul(forward,-.065*k);ellipsoid(badd(w[side+'Ankle'],toe),.052*k,.039*k,.115*k,footAxes,side+'Ankle');
  }
 }
 return triangles;
}

function clippedBodyTriangle(vertices,project,near){
 if(!Number.isFinite(near))return vertices;
 const result=[];for(let i=0;i<vertices.length;i++){
  const a=vertices[i],b=vertices[(i+1)%vertices.length],da=project(a.point).depth,db=project(b.point).depth,insideA=da>=near,insideB=db>=near;
  if(insideA)result.push(a);
  if(insideA!==insideB){const t=(near-da)/(db-da);result.push({point:blerp(a.point,b.point,t),normal:bunit(blerp(a.normal,b.normal,t))});}
 }return result;
}

// Small CPU z-buffer: nearest surface wins across all people and body parts.
// Depth is relative to this mannequin scene: near=white, far=dark, background=black.
export function renderPoseBody(mesh,project,{width=760,height=500,perspective=false,near=perspective?.051:-Infinity,lighting=null}={}){
 if(!Number.isInteger(width)||!Number.isInteger(height)||width<1||height<1||width>4096||height>4096||width*height>4200000)throw Error('Body render dimensions');
 const size=width*height,depth=new Float32Array(size).fill(Infinity),rgba=new Uint8ClampedArray(size*4),depthRGBA=new Uint8ClampedArray(size*4),owners=new Uint16Array(size),parts=[null],partIds=new Map(),projected=[];
 let min=Infinity,max=-Infinity;const light=bunit(lighting?.direction||bv(-.3,.65,-.7)),strength=lighting?Math.max(0,Math.min(1,lighting.strength/100)):1,soft=lighting?Math.max(0,Math.min(1,lighting.softness/100)):0,tint=lighting?.color&&/^#[0-9a-f]{6}$/i.test(lighting.color)?[0,2,4].map(i=>parseInt(lighting.color.slice(i+1,i+3),16)/255):[1,1,1];
 for(const item of mesh){
  const polygon=clippedBodyTriangle(item.vertices,project,near);if(polygon.length<3)continue;
  for(let i=1;i<polygon.length-1;i++){
   const points=[polygon[0],polygon[i],polygon[i+1]].map(v=>({...project(v.point),shade:lighting?.enabled?.08+strength*(.15+soft*.2+(.85-soft*.2)*Math.max(0,bdot(v.normal,light))):.3+.7*Math.max(0,bdot(v.normal,light))}));
   if(!points.every(p=>[p.x,p.y,p.depth,p.shade].every(Number.isFinite)))continue;
   for(const p of points){min=Math.min(min,p.depth);max=Math.max(max,p.depth);}projected.push({item,points});
  }
 }
 for(const {item,points:p}of projected){
  const [a,b,c]=p,area=(b.y-c.y)*(a.x-c.x)+(c.x-b.x)*(a.y-c.y);if(Math.abs(area)<1e-8)continue;
  const x0=Math.max(0,Math.floor(Math.min(a.x,b.x,c.x))),x1=Math.min(width-1,Math.ceil(Math.max(a.x,b.x,c.x))),y0=Math.max(0,Math.floor(Math.min(a.y,b.y,c.y))),y1=Math.min(height-1,Math.ceil(Math.max(a.y,b.y,c.y)));
  if(x0>x1||y0>y1)continue;
  const key=item.figureId+':'+item.joint;let owner=partIds.get(key);if(!owner){owner=parts.length;parts.push({figureId:item.figureId,joint:item.joint});partIds.set(key,owner);}
  const base=item.color.map(v=>130+v*.35);
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){
   const px=x+.5,py=y+.5,u=((b.y-c.y)*(px-c.x)+(c.x-b.x)*(py-c.y))/area,v=((c.y-a.y)*(px-c.x)+(a.x-c.x)*(py-c.y))/area,w=1-u-v;
   if(u<-.000001||v<-.000001||w<-.000001)continue;
   const z=perspective?1/(u/a.depth+v/b.depth+w/c.depth):u*a.depth+v*b.depth+w*c.depth,index=y*width+x;if(z>=depth[index])continue;
   depth[index]=z;owners[index]=owner;const shade=perspective?z*(u*a.shade/a.depth+v*b.shade/b.depth+w*c.shade/c.depth):u*a.shade+v*b.shade+w*c.shade;
   const off=index*4;for(let j=0;j<3;j++)rgba[off+j]=Math.min(255,Math.round(base[j]*shade*(lighting?.enabled?tint[j]:1)));rgba[off+3]=255;
  }
 }
 for(let i=0;i<size;i++){const off=i*4;depthRGBA[off+3]=255;if(!owners[i])continue;const gray=Math.round(255-215*Math.max(0,Math.min(1,(depth[i]-min)/(max-min||1))));depthRGBA[off]=depthRGBA[off+1]=depthRGBA[off+2]=gray;}
 return {width,height,rgba,depthRGBA,depth,owners,parts,near:min,far:max};
}

export function poseBodyHit(render,x,y){
 if(!render||!Number.isFinite(x)||!Number.isFinite(y))return null;x=Math.floor(x);y=Math.floor(y);if(x<0||y<0||x>=render.width||y>=render.height)return null;return render.parts[render.owners[y*render.width+x]]||null;
}
