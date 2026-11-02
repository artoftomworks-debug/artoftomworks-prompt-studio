import {test} from 'node:test';
import assert from 'node:assert/strict';
import {normalizePoseFigure,normalizePoseFigures,posePreset,poseJoints,poseParents,poseWorldJoints,poseLocalPoint,poseMoveJoint,poseBoneAngles,poseSetBoneAngles,poseExport,poseFitCamera,poseCameraProjection} from './dist/studio-poses.mjs';
import {normalizeStudioPlan,studioPreset,studioPlanText,mergeStudioSection,createStudioPlannerStore} from './dist/studio-planner.mjs';
import {attachVirtualStudio} from './dist/studio-planner-ui.mjs';
import {poseLabels} from './dist/studio-poses-ui.mjs';
import {featureUpdates} from './dist/feature-updates.mjs';
import {environment,memory,StudioNode} from './pose-test-dom.mjs';
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z),boneLengths=f=>Object.fromEntries(Object.entries(poseParents).map(([k,p])=>[k,distance(f.joints[k],f.joints[p])])),near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
const jointPointer=(svg,key,id)=>{const c=svg.querySelector('[data-pose-joint="'+key+'"]').children[1];return {pointerId:id,clientX:Number(c.attributes.cx)*.72+26.4,clientY:Number(c.attributes.cy)*.72};};
const field=(root,key)=>root.querySelector('[data-pose-field="'+key+'"]'),action=(root,key)=>root.querySelector('[data-pose-action="'+key+'"]');
test('pose rotation moves the selected subtree without stretching or changing the other arm',()=>{
 const base=normalizePoseFigure({id:'figure_a'}),lengths=boneLengths(base),before=JSON.stringify(base),moved=poseMoveJoint(base,'lElbow',{x:.5,y:.9,z:-.2});
 for(const [k,v]of Object.entries(boneLengths(moved)))near(v,lengths[k]);assert.deepEqual(moved.joints.rWrist,base.joints.rWrist);assert.equal(JSON.stringify(base),before);assert.notDeepEqual(moved.joints.lWrist,base.joints.lWrist);
 for(const kind of ['standing','seated','raised','walking','kneeling']){const f=posePreset(kind,base);for(const [k,v]of Object.entries(boneLengths(f)))near(v,lengths[k]);assert.ok(Object.values(f.joints).every(p=>Object.values(p).every(Number.isFinite)));}
 const opposite=poseMoveJoint(base,'lElbow',{x:.13,y:.78,z:0});for(const [k,v]of Object.entries(boneLengths(opposite)))near(v,lengths[k]);
 const angles=poseBoneAngles(moved,'lElbow'),same=poseSetBoneAngles(moved,'lElbow',angles.azimuth,angles.elevation);near(distance(same.joints.lElbow,moved.joints.lElbow),0);
});
test('figure transforms round trip, preserve safe defaults and support child height independently',()=>{
 const f=normalizePoseFigure({id:'figure_child',identity:'child',height:1.1,facing:90,position:{x:1,y:.6,z:2}}),world=poseWorldJoints(f);for(const k of poseJoints)near(distance(poseLocalPoint(f,world[k]),f.joints[k]),0);
 const bad=normalizePoseFigure({height:Infinity,position:{x:999,y:-100,z:NaN},facing:'bad',color:'red',identity:'unknown'});assert.equal(bad.height,1.75);assert.equal(bad.position.x,5);assert.equal(bad.position.y,0);assert.equal(bad.identity,'unspecified');assert.match(bad.color,/^#[0-9a-f]{6}$/i);
 const many=normalizePoseFigures(Array.from({length:12},()=>({id:'figure_same'})));assert.equal(many.length,8);assert.equal(new Set(many.map(f=>f.id)).size,8);assert.equal(normalizePoseFigure({height:.1}).height,.6);
});
test('pose export uses actual camera projection, aspect, rotation, hidden figures and confidence',()=>{
 const plan=normalizeStudioPlan({camera:{position:{x:0,y:1,z:-4},lens:36,ratio:'16:9'},subject:{x:0,y:1,z:0},figures:[{id:'figure_a'},{id:'figure_hidden',visible:false}]});
 let project=poseCameraProjection(plan,1000,500);near(project({x:.5,y:1,z:-2}).x,750);near(project({x:.5,y:1,z:-2}).y,250);assert.equal(project({x:0,y:1,z:-5}).visible,false);
 plan.camera.roll=90;project=poseCameraProjection(plan,1000,500);near(project({x:.5,y:1,z:-2}).x,500);near(project({x:.5,y:1,z:-2}).y,500);
 plan.camera.roll=0;const data=poseExport(plan);assert.equal(data.canvas_width,1024);assert.equal(data.canvas_height,576);assert.equal(data.people.length,1);assert.equal(data.people[0].pose_keypoints_2d.length,54);assert.deepEqual(data.people[0].pose_keypoints_2d.slice(42),Array(12).fill(0));assert.equal(data.people[0].pose_keypoints_2d[5],1);
 plan.figures[0].position.x=5;assert.ok(poseExport(plan).people[0].pose_keypoints_2d.slice(0,42).some((v,i)=>i%3===2&&v===0));
});
test('family framing, shared prompt and saved layouts survive old v1 data and backups',()=>{
 let plan=studioPreset();plan.figures=[normalizePoseFigure({id:'figure_parent',identity:'woman',name:'Parent',position:{x:-.4,y:.9,z:0}}),normalizePoseFigure({id:'figure_child',identity:'child',name:'Child',height:1.1,position:{x:.4,y:.57,z:0}})];plan=normalizeStudioPlan(poseFitCamera(plan));const data=poseExport(plan);for(const p of data.people)for(let i=0;i<14;i++)assert.equal(p.pose_keypoints_2d[i*3+2],1);
 const text=studioPlanText(plan);assert.match(text,/adult woman/);assert.match(text,/\(child\)/);assert.match(text,/2 visible figures/);const merged=mergeStudioSection('My scene.\nVisual direction mix: surreal.',text);assert.equal(mergeStudioSection(merged,text),merged);assert.match(merged,/surreal/);
 const storage=memory(),store=createStudioPlannerStore(storage),saved=store.read();saved.state=plan;saved.presets=[{name:'Family',state:plan}];store.save(saved);assert.deepEqual(createStudioPlannerStore(storage).read(),store.read());const restored=createStudioPlannerStore(memory());restored.save(restored.parse(store.export()));assert.deepEqual(restored.read(),store.read());
 delete saved.state.figures;delete saved.presets[0].state.figures;assert.equal(restored.parse(JSON.stringify(saved)).state.figures.length,0);const invalid=restored.read();invalid.state.figures=Array(9).fill({});assert.throws(()=>restored.parse(JSON.stringify(invalid)),/format/);
});
test('UI creates a family, isolates identity and limb edits, hides, duplicates, undoes and reloads',async()=>{
 const storage=memory(),{doc}=environment(storage);let language='HU';const ui=attachVirtualStudio({getLanguage:()=>language}),root=doc.getElementById('virtual-studio-poses');assert.ok(root);assert.equal(field(root,'figure').options.length,0);
 await action(root,'add').emit('click');field(root,'identity').value='woman';await field(root,'identity').emit('change');field(root,'name').value='Parent';await field(root,'name').emit('change');const parent=ui.getState().figures[0];assert.equal(parent.identity,'woman');
 await action(root,'add').emit('click');field(root,'identity').value='child';await field(root,'identity').emit('change');assert.equal(ui.getState().figures[1].height,1.1);assert.equal(ui.getState().figures[0].identity,'woman');
 field(root,'joint').value='lElbow';await field(root,'joint').emit('change');field(root,'elevation').value='45';await field(root,'elevation').emit('input');assert.deepEqual(ui.getState().figures[0],parent);const edited=ui.getState().figures[1];assert.notDeepEqual(edited.joints.lElbow,normalizePoseFigure().joints.lElbow);
 await action(root,'duplicate').emit('click');assert.equal(ui.getState().figures.length,3);await action(root,'undo').emit('click');assert.equal(ui.getState().figures.length,2);field(root,'figure').value=edited.id;await field(root,'figure').emit('change');field(root,'visible').checked=false;await field(root,'visible').emit('change');assert.equal(poseExport(ui.getState()).people.length,1);
 for(const code of ['EN','HU','DE','FR','ES','IT','PT','PL']){language=code;doc.getElementById('ui-language').dispatchEvent({type:'change'});assert.equal(root.children[0].textContent,poseLabels(code).title);}
 const kept=ui.getState().figures;const studio=doc.getElementById('virtual-studio');studio.querySelector('[data-vs-field="preset"]').value='dramatic';await studio.querySelector('[data-vs-action="suggest"]').emit('click');assert.deepEqual(ui.getState().figures,kept,'a lighting suggestion keeps figure poses');
 const state=ui.getState();environment(storage);assert.deepEqual(attachVirtualStudio().getState(),state);
});
test('UI drag previews do not save, cancel is reversible and failed writes do not lose figures',async()=>{
 const storage=memory(),{doc}=environment(storage),ui=attachVirtualStudio(),root=doc.getElementById('virtual-studio-poses');await action(root,'add').emit('click');const before=ui.getState(),raw=JSON.stringify(before),stored=storage.getItem('artoftomworks.promptStudio.virtualStudio.v1'),svg=root.querySelector('svg'),key=before.figures[0].id+':lWrist';
 await svg.querySelector('[data-pose-joint="'+key+'"]').emit('pointerdown',jointPointer(svg,key,1));await svg.emit('pointermove',{clientX:440,clientY:100});assert.equal(JSON.stringify(ui.getState()),raw);assert.equal(storage.getItem('artoftomworks.promptStudio.virtualStudio.v1'),stored);await svg.emit('pointercancel');assert.deepEqual(ui.getState(),before);
 await svg.querySelector('[data-pose-joint="'+key+'"]').emit('pointerdown',jointPointer(svg,key,2));await svg.emit('pointermove',{clientX:440,clientY:100});await svg.emit('pointerup');assert.notDeepEqual(ui.getState().figures[0].joints.lWrist,before.figures[0].joints.lWrist);const after=ui.getState();const lengths=boneLengths(after.figures[0]);for(const [k,v]of Object.entries(boneLengths(before.figures[0])))near(lengths[k],v);
 storage.setItem=()=>{throw Error('quota');};await action(root,'add').emit('click');assert.deepEqual(ui.getState(),after);
});
test('UI export downloads the camera-framed BODY_18 JSON and raster drawing matches it',async()=>{
 const {doc}=environment(memory()),ui=attachVirtualStudio(),root=doc.getElementById('virtual-studio-poses');await action(root,'add').emit('click');await action(root,'fit').emit('click');let captured=null,segments=0;const original=URL.createObjectURL,create=doc.createElement;
 URL.createObjectURL=blob=>{captured=blob;return 'blob:test';};doc.createElement=tag=>{const n=create(tag);if(tag==='canvas'){n.getContext=()=>({fillRect(){},beginPath(){},moveTo(){},lineTo(){segments++;},stroke(){},arc(){},fill(){}});n.toBlob=callback=>callback(new Blob(['test-image'],{type:'image/png'}));}return n;};
 try{await action(root,'json').emit('click');assert.deepEqual(JSON.parse(await captured.text()),poseExport(ui.getState()));await action(root,'png').emit('click');assert.equal(captured.type,'image/png');assert.equal(segments,13);}finally{URL.createObjectURL=original;}
});
test('all pose controls and NEW description are supplied in all eight interface languages',()=>{
 const keys=Object.keys(poseLabels());for(const language of ['EN','HU','DE','FR','ES','IT','PT','PL']){const labels=poseLabels(language);assert.deepEqual(Object.keys(labels),keys);assert.ok(Object.values(labels).every(x=>x&&typeof x==='string'&&!x.includes('|')));assert.ok(labels.child);}
 const feature=featureUpdates.find(f=>f.id==='pose-studio');assert.equal(feature.sectionId,'virtual-studio-poses');assert.equal(feature.title.length,8);assert.equal(feature.description.length,8);
});

test('eight spread-out figures fit the bounded shared camera without cropping',()=>{
 const plan=studioPreset();plan.figures=Array.from({length:8},(_,i)=>normalizePoseFigure({id:'figure_'+i,position:{x:i*.65,y:.9,z:0}},i));const fitted=normalizeStudioPlan(poseFitCamera(plan));for(const p of poseExport(fitted).people)for(let i=0;i<14;i++)assert.equal(p.pose_keypoints_2d[i*3+2],1);assert.ok(fitted.camera.lens>=14);assert.ok(fitted.camera.position.z>=-5);
});
