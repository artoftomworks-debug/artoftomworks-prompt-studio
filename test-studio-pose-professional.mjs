import {test} from 'node:test';
import assert from 'node:assert/strict';
import {normalizePoseFigure,poseJoints,poseParents,poseWorldJoints,poseMoveWorldTarget,poseViewBasis,poseScreenDelta,poseMirrorFigure,poseExport} from './dist/studio-poses.mjs';
import {attachVirtualStudio} from './dist/studio-planner-ui.mjs';
import {createStudioPlannerStore,studioPlannerKey} from './dist/studio-planner.mjs';
import {memory,environment} from './pose-test-dom.mjs';
const near=(a,b,epsilon=1e-7)=>assert.ok(Math.abs(a-b)<epsilon,`${a} != ${b}`),distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z),lengths=f=>Object.fromEntries(Object.entries(poseParents).map(([k,p])=>[k,distance(f.joints[k],f.joints[p])])),dot=(a,b)=>a.x*b.x+a.y*b.y+a.z*b.z;
const field=(root,key)=>root.querySelector('[data-pose-field="'+key+'"]'),action=(root,key)=>root.querySelector('[data-pose-action="'+key+'"]');
function screen(svg,x,y,id=1){const r=svg.getBoundingClientRect(),scale=Math.min(r.width/760,r.height/500);return {clientX:r.left+(r.width-760*scale)/2+x*scale,clientY:r.top+(r.height-500*scale)/2+y*scale,pointerId:id};}
function marker(svg,key){const g=svg.querySelector('[data-pose-joint="'+key+'"]'),p=g.children[1].attributes;return {g,x:Number(p.cx),y:Number(p.cy)};}
async function setup(){
 const storage=memory(),env=environment(storage),listeners={};globalThis.addEventListener=(name,fn)=>(listeners[name]??=[]).push(fn);
 const ui=attachVirtualStudio(),root=env.doc.getElementById('virtual-studio-poses');await action(root,'add').emit('click');await root.querySelector('[data-pose-joint="'+ui.getState().figures[0].id+':pelvis"]').emit('keydown',{key:'Enter'});return {...env,ui,root,storage,listeners,svg:root.querySelector('svg')};
}
test('spatial edit basis is orthonormal; free drag preserves view depth and axis drag ignores orthogonal jitter',()=>{
 for(const yaw of [0,35,90,179,270,360])for(const tilt of [0,25,75]){
  const basis=poseViewBasis('space',yaw,tilt);near(dot(basis.right,basis.up),0);near(dot(basis.forward,basis.up),0);near(dot(basis.right,basis.right),1);near(dot(basis.up,basis.up),1);near(dot(basis.forward,basis.forward),1);
  const delta=poseScreenDelta(basis,30,-20,100);near(dot(delta,basis.forward),0);near(dot(delta,basis.right),.3);near(dot(delta,basis.up),.2);
  for(const axis of ['x','y','z']){const sx=basis.right[axis],sy=-basis.up[axis],d=poseScreenDelta(basis,sx*20-sy*7,sy*20+sx*7,100,{axis});if(sx*sx+sy*sy<.0225){assert.equal(d,null);continue;}near(d[axis],.2);for(const k of ['x','y','z'].filter(k=>k!==axis))near(d[k],0);}
 }
 const b=poseViewBasis('front');assert.equal(poseScreenDelta(b,20,10,100,{axis:'z'}),null);near(poseScreenDelta(b,23,0,100,{axis:'x',fine:true}).x,.023);near(poseScreenDelta(b,23,0,100,{axis:'x',snap:.1}).x,.2);assert.equal(poseScreenDelta(b,NaN,10,100),null);
});
test('hand and foot targets use a two-bone chain, retain all bone lengths and respect reach',()=>{
 for(const key of ['lWrist','rWrist','lAnkle','rAnkle'])for(const facing of [0,90,-37]){
  const f=normalizePoseFigure({height:key==='lAnkle'?1.1:1.75,facing,position:{x:.3,y:.9,z:-.2}}),world=poseWorldJoints(f),root=key.endsWith('Wrist')?key[0]+'Shoulder':key[0]+'Hip',a=world[root];
  const target={x:a.x+.14,y:a.y-.18,z:a.z-.13},before=lengths(f),moved=poseMoveWorldTarget(f,key,target);near(distance(poseWorldJoints(moved)[key],target),0);
  for(const [k,l]of Object.entries(lengths(moved)))near(l,before[k]);assert.deepEqual(moved.joints[key[0]==='l'?'rWrist':'lWrist'],f.joints[key[0]==='l'?'rWrist':'lWrist']);
  const far=poseMoveWorldTarget(f,key,{x:8,y:8,z:8});for(const [k,l]of Object.entries(lengths(far)))near(l,before[k]);assert.ok(Object.values(far.joints).every(p=>Object.values(p).every(Number.isFinite)));
  const folded=poseMoveWorldTarget(f,key,a);for(const [k,l]of Object.entries(lengths(folded)))near(l,before[k]);
 }
 const f=normalizePoseFigure();assert.deepEqual(poseMoveWorldTarget(f,'lWrist',{}),f);const root=poseMoveWorldTarget(f,'pelvis',{x:10,y:-1,z:-10});assert.deepEqual(root.position,{x:5,y:0,z:-5});assert.deepEqual(root.joints,f.joints);
});
test('mirroring swaps body sides without altering identity, body position or segment lengths',()=>{
 let f=normalizePoseFigure({identity:'child',name:'Keep name',height:1.1,facing:35});f=poseMoveWorldTarget(f,'lWrist',{x:.2,y:1.2,z:-.2});const mirrored=poseMirrorFigure(f),twice=poseMirrorFigure(mirrored);
 assert.equal(mirrored.identity,'child');assert.equal(mirrored.name,f.name);assert.equal(mirrored.height,f.height);assert.deepEqual(mirrored.position,f.position);near(mirrored.joints.rWrist.x,-f.joints.lWrist.x);near(mirrored.joints.rWrist.y,f.joints.lWrist.y);for(const k of poseJoints)near(distance(twice.joints[k],f.joints[k]),0);
});
test('spatial XYZ handles move a whole figure on the chosen world axis, save once, undo and redo',async()=>{
 const {ui,root,storage,svg}=await setup();field(root,'view').value='space';await field(root,'view').emit('change');assert.equal(svg.querySelectorAll('[data-pose-axis]').length,3);
 const g=svg.querySelector('[data-pose-axis="y"]'),line=g.children[2].attributes,start={x:Number(line.x2),y:Number(line.y2)},dx=(Number(line.x2)-Number(line.x1))*.3,dy=(Number(line.y2)-Number(line.y1))*.3,before=ui.getState(),raw=storage.getItem(studioPlannerKey);
 await g.emit('pointerdown',screen(svg,start.x,start.y));await svg.emit('pointermove',screen(svg,start.x+dx,start.y+dy));assert.equal(storage.getItem(studioPlannerKey),raw);assert.deepEqual(ui.getState(),before);await svg.emit('pointerup');const after=ui.getState();assert.ok(after.figures[0].position.y>before.figures[0].position.y);near(after.figures[0].position.x,before.figures[0].position.x);near(after.figures[0].position.z,before.figures[0].position.z);
 field(root,'x').value='.5';await field(root,'x').emit('change');await action(root,'undo').emit('click');assert.deepEqual(ui.getState(),after);await action(root,'undo').emit('click');assert.deepEqual(ui.getState(),before);await action(root,'redo').emit('click');assert.deepEqual(ui.getState(),after);await root.emit('keydown',{key:'z',ctrlKey:true,target:svg});assert.deepEqual(ui.getState(),before);await root.emit('keydown',{key:'z',ctrlKey:true,shiftKey:true,target:svg});assert.deepEqual(ui.getState(),after);
});
test('direct spatial wrist drag works without sliders, supports Esc and keeps all bone lengths',async()=>{
 const {ui,root,svg,storage}=await setup();field(root,'view').value='space';await field(root,'view').emit('change');const before=ui.getState(),key=before.figures[0].id+':lWrist',m=marker(svg,key),raw=storage.getItem(studioPlannerKey);
 await m.g.emit('pointerdown',screen(svg,m.x,m.y));await svg.emit('pointermove',screen(svg,m.x+35,m.y-45));await root.emit('keydown',{key:'Escape',target:svg});assert.deepEqual(ui.getState(),before);assert.equal(storage.getItem(studioPlannerKey),raw);
 const n=marker(svg,key);await n.g.emit('pointerdown',screen(svg,n.x,n.y));await svg.emit('pointermove',screen(svg,n.x+35,n.y-45));await svg.emit('pointerup');const after=ui.getState();assert.notDeepEqual(after.figures[0].joints.lWrist,before.figures[0].joints.lWrist);for(const [k,l]of Object.entries(lengths(after.figures[0])))near(l,lengths(before.figures[0])[k]);assert.equal(poseExport(after).people.length,1);
});
test('orbit, pan, wheel zoom and view cancellation change no saved camera or pose',async()=>{
 const {root,svg,storage,ui}=await setup();field(root,'view').value='space';await field(root,'view').emit('change');const state=ui.getState(),raw=storage.getItem(studioPlannerKey),yaw=Number(field(root,'viewYaw').value);
 await svg.emit('pointerdown',{...screen(svg,50,50),target:svg});await svg.emit('pointermove',screen(svg,110,70));assert.notEqual(Number(field(root,'viewYaw').value),yaw);await root.emit('keydown',{key:'Escape',target:svg});assert.equal(Number(field(root,'viewYaw').value),yaw);
 await svg.emit('pointerdown',{...screen(svg,50,50),target:svg});await svg.emit('pointermove',screen(svg,110,70));await svg.emit('pointerup');await svg.emit('pointerdown',{...screen(svg,50,50),target:svg,button:1});await svg.emit('pointermove',screen(svg,130,80));await svg.emit('pointerup');await svg.emit('wheel',{...screen(svg,380,250),deltaY:-150});assert.ok(Number(field(root,'zoom').value)>100);assert.equal(storage.getItem(studioPlannerKey),raw);assert.deepEqual(ui.getState(),state);
});
test('keyboard axis nudge and fine mode preserve precision; stale history cannot overwrite another tab',async()=>{
 const {root,svg,ui,storage,listeners}=await setup(),before=ui.getState();let handle=svg.querySelector('[data-pose-axis="x"]');await handle.emit('keydown',{key:'ArrowRight',shiftKey:true});near(ui.getState().figures[0].position.x-before.figures[0].position.x,.001);
 handle=svg.querySelector('[data-pose-axis="x"]');await handle.emit('keydown',{key:'ArrowRight'});near(ui.getState().figures[0].position.x-before.figures[0].position.x,.011);assert.equal(action(root,'undo').disabled,false);
 const store=createStudioPlannerStore(storage),next=store.read();next.state.camera.lens=110;store.save(next);for(const fn of listeners.storage||[])fn({key:studioPlannerKey});assert.equal(action(root,'undo').disabled,true);assert.equal(action(root,'redo').disabled,true);await action(root,'undo').emit('click');assert.equal(ui.getState().camera.lens,110);
});
test('Shift can be pressed mid-drag without making the figure jump backwards',async()=>{
 const {root,svg,ui}=await setup(),id=ui.getState().figures[0].id;let m=marker(svg,id+':pelvis');await m.g.emit('pointerdown',screen(svg,m.x,m.y));await svg.emit('pointermove',screen(svg,m.x+40,m.y));const first=marker(svg,id+':pelvis').x;
 await svg.emit('pointermove',{...screen(svg,m.x+40,m.y),shiftKey:true});near(marker(svg,id+':pelvis').x,first);await svg.emit('pointermove',{...screen(svg,m.x+60,m.y),shiftKey:true});near(marker(svg,id+':pelvis').x-first,2);await svg.emit('pointerup');assert.ok(ui.getState().figures[0].position.x>0);
});
test('history retains forty changes, supports redo, and discards redo after a new edit',async()=>{
 const {root,ui}=await setup();for(let i=1;i<=42;i++){field(root,'x').value=String(i/100);await field(root,'x').emit('change');}for(let i=0;i<40;i++)await action(root,'undo').emit('click');near(ui.getState().figures[0].position.x,.02);assert.equal(action(root,'undo').disabled,true);await action(root,'redo').emit('click');near(ui.getState().figures[0].position.x,.03);field(root,'z').value='.3';await field(root,'z').emit('change');assert.equal(action(root,'redo').disabled,true);near(ui.getState().figures[0].position.z,.3);
});
