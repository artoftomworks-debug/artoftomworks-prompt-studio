import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {poseBodyMesh,renderPoseBody,poseBodyHit} from './dist/pose-body.mjs';
import {poseBodyLayerLabels} from './dist/pose-body-ui.mjs';
import {normalizePoseFigure,posePreset,poseViewBasis,poseCameraProjection,poseFitCamera,poseExport} from './dist/studio-poses.mjs';
import {attachVirtualStudio} from './dist/studio-planner-ui.mjs';
import {studioPreset,studioPlannerKey} from './dist/studio-planner.mjs';
import {environment,memory} from './pose-test-dom.mjs';

const ortho=(view='front',scale=100,cx=128,cy=215)=>{const b=poseViewBasis(view);return p=>({x:cx+scale*(p.x*b.right.x+p.y*b.right.y+p.z*b.right.z),y:cy-scale*(p.x*b.up.x+p.y*b.up.y+p.z*b.up.z),depth:p.x*b.forward.x+p.y*b.forward.y+p.z*b.forward.z});};
test('featureless body follows articulated poses, height, facing and multiple figures without mutating them',()=>{
 for(const kind of ['standing','seated','walking','raised','kneeling']){
  const figure=posePreset(kind,{id:'figure_a',facing:37}),before=JSON.stringify(figure),mesh=poseBodyMesh([figure]);assert.ok(mesh.length>1000);assert.equal(JSON.stringify(figure),before);
  assert.ok(mesh.every(t=>t.figureId===figure.id&&t.vertices.every(v=>Object.values(v.point).every(Number.isFinite)&&Object.values(v.normal).every(Number.isFinite))));
  const render=renderPoseBody(mesh,ortho('space'),{width:256,height:256});assert.ok(render.owners.some(Boolean));assert.ok(render.depth.every(v=>Number.isFinite(v)||v===Infinity));
 }
 const base=normalizePoseFigure({id:'figure_base'}),small=normalizePoseFigure({...base,id:'figure_small',height:.875,position:{x:0,y:.45,z:0}}),a=poseBodyMesh([base]),b=poseBodyMesh([small]);assert.equal(a.length,b.length);
 for(let i=0;i<a.length;i+=79)for(const k of ['x','y','z'])assert.ok(Math.abs(b[i].vertices[0].point[k]-a[i].vertices[0].point[k]/2)<1e-8);
 assert.equal(poseBodyMesh([{...base,visible:false}]).length,0);assert.ok(poseBodyMesh([base,small]).some(t=>t.figureId==='figure_small'));
 assert.deepEqual(poseBodyMesh([{...base,identity:'child'}]).map(t=>t.vertices),a.map(t=>t.vertices),'identity labels do not add anatomy');
});

test('pixel depth resolves inter-person occlusion, independent of draw order or figure colour',()=>{
 const make=(id,z,color)=>({figureId:id,joint:'pelvis',color,vertices:[{point:{x:10,y:10,z},normal:{x:0,y:0,z:-1}},{point:{x:70,y:10,z},normal:{x:0,y:0,z:-1}},{point:{x:10,y:70,z},normal:{x:0,y:0,z:-1}}]}),near=make('near',1,[255,0,0]),far=make('far',4,[0,255,0]),project=p=>({x:p.x,y:p.y,depth:p.z});
 const a=renderPoseBody([near,far],project,{width:80,height:80}),b=renderPoseBody([far,near],project,{width:80,height:80}),index=20*80+20;
 assert.equal(poseBodyHit(a,20,20).figureId,'near');assert.equal(poseBodyHit(b,20,20).figureId,'near');assert.equal(a.depth[index],1);assert.deepEqual(a.depthRGBA,b.depthRGBA);assert.ok(a.depthRGBA[index*4]>240);assert.deepEqual([...a.depthRGBA.slice(0,4)],[0,0,0,255]);assert.equal(poseBodyHit(a,79,79),null);assert.equal(poseBodyHit(a,-1,0),null);
 const replacement=renderPoseBody([{...near,color:[0,0,255]},far],project,{width:80,height:80});assert.deepEqual(replacement.depthRGBA,a.depthRGBA);
 assert.throws(()=>renderPoseBody([],project,{width:4096,height:4096}),/dimensions/);
});

test('depth is a continuous surface gradient, camera near clipping and export framing are finite',()=>{
 const normals={x:0,y:0,z:-1},triangle={figureId:'one',joint:'neck',color:[200,200,200],vertices:[{point:{x:4,y:4,z:1},normal:normals},{point:{x:90,y:4,z:5},normal:normals},{point:{x:4,y:90,z:1},normal:normals}]};
 const result=renderPoseBody([triangle],p=>({x:p.x,y:p.y,depth:p.z}),{width:96,height:96});assert.ok(result.depth[15*96+15]<result.depth[15*96+60]);assert.ok(result.depthRGBA[(15*96+15)*4]>result.depthRGBA[(15*96+60)*4]);
 let plan=studioPreset();plan.figures=[normalizePoseFigure({id:'figure_camera'})];plan=poseFitCamera(plan);const original=JSON.stringify(plan),data=poseExport(plan,320),mesh=poseBodyMesh(plan.figures),render=renderPoseBody(mesh,poseCameraProjection(plan,320,data.canvas_height),{width:320,height:data.canvas_height,perspective:true});assert.ok(render.owners.some(Boolean));assert.equal(JSON.stringify(plan),original);assert.equal(render.height,Math.round(320*2/3));
 const clipping=renderPoseBody([triangle],p=>({x:48+p.x/(p.z+1),y:48+p.y/(p.z+1),depth:p.z-2}),{width:96,height:96,perspective:true});assert.ok(clipping.depth.every(v=>Number.isFinite(v)||v===Infinity));assert.ok(clipping.depth.filter(Number.isFinite).every(v=>v>=.05));
});

function canvasEnvironment(){
 const storage=memory(),{doc}=environment(storage),original=doc.createElement,canvases=[];
 doc.createElement=tag=>{const n=original(tag);if(tag==='canvas'){
  canvases.push(n);n.getContext=()=>({createImageData:(w,h)=>({width:w,height:h,data:new Uint8ClampedArray(w*h*4)}),putImageData:image=>n.pixels=image});n.toDataURL=()=> 'data:image/png;base64,AA==';n.toBlob=cb=>cb(new Blob(['fixture'],{type:'image/png'}));
 }return n;};return {doc,storage,canvases};
}
test('display layers and opacity never change saved pose, prompt, reference or skeleton export',async()=>{
 const {doc,storage,canvases}=canvasEnvironment();let language='HU';const ui=attachVirtualStudio({getLanguage:()=>language}),root=doc.getElementById('virtual-studio-poses');await root.querySelector('[data-pose-action="add"]').emit('click');
 const state=JSON.stringify(ui.getState()),raw=storage.getItem(studioPlannerKey),exported=poseExport(ui.getState()),reference=ui.poses.reference.getConfig(),field=key=>root.querySelector('[data-pose-layer="'+key+'"]');
 field('body').checked=true;await field('body').emit('change');assert.ok(root.querySelector('[data-pose-body-layer="body"]'));assert.equal(root.querySelector('[data-pose-body-layer="body"]').attributes.opacity,'0.45');
 field('depth').checked=true;await field('depth').emit('change');assert.ok(root.querySelector('[data-pose-body-layer="depth"]'));field('skeleton').checked=false;await field('skeleton').emit('change');assert.equal(root.querySelectorAll('[data-pose-bone]').length,0);
 field('bodyOpacity').value='80';await field('bodyOpacity').emit('input');assert.equal(root.querySelector('[data-pose-body-layer="body"]').attributes.opacity,'0.8');assert.equal(JSON.stringify(ui.getState()),state);assert.equal(storage.getItem(studioPlannerKey),raw);assert.deepEqual(poseExport(ui.getState()),exported);assert.deepEqual(ui.poses.reference.getConfig(),reference);
 assert.ok(canvases.some(n=>n.pixels?.data.some((v,i)=>i%4===3&&v===255)));
 const url=URL.createObjectURL,revoke=URL.revokeObjectURL;URL.createObjectURL=()=> 'blob:body-test';URL.revokeObjectURL=()=>{};
 try{await root.querySelector('[data-pose-action="depthPng"]').emit('click');const last=canvases.at(-1);assert.equal(last.width,1024);assert.equal(last.height,683);for(let i=0;i<last.pixels.data.length;i+=1004){const a=last.pixels.data;assert.equal(a[i],a[i+1]);assert.equal(a[i+1],a[i+2]);assert.equal(a[i+3],255);}}finally{URL.createObjectURL=url;URL.revokeObjectURL=revoke;}
 for(const code of ['EN','HU','DE','FR','ES','IT','PT','PL']){language=code;doc.getElementById('ui-language').dispatchEvent({type:'change'});assert.ok(Object.values(poseBodyLayerLabels(code)).every(v=>v&&typeof v==='string'));assert.equal(field('body').attributes['aria-label'],poseBodyLayerLabels(code).body);}
});

test('body rendering failure leaves the skeleton usable and both distributed pages include new modules',async()=>{
 const storage=memory(),{doc}=environment(storage),ui=attachVirtualStudio({getLanguage:()=> 'HU'}),root=doc.getElementById('virtual-studio-poses');await root.querySelector('[data-pose-action="add"]').emit('click');const raw=storage.getItem(studioPlannerKey),field=root.querySelector('[data-pose-layer="body"]');field.checked=true;await field.emit('change');assert.match(root.querySelector('.vs-warning').textContent,/nem sikerült/);assert.ok(root.querySelector('[data-pose-joint]'));assert.equal(storage.getItem(studioPlannerKey),raw);
 const page=readFileSync(new URL('./dist/ArtofTomworks_Prompt_Studio_OFFLINE.html',import.meta.url),'utf8');assert.ok(page.includes('renderPoseBody'));assert.ok(page.includes('pose-body-controls'));assert.ok(page.includes('2026-11-01.10'));
});
