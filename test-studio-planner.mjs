import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {Script} from 'node:vm';
import {studioPreset,studioPresetNames,normalizeStudioPlan,studioAim,studioCameraAt,studioPlanText,mergeStudioSection,studioLightColor,studioPlanWarnings,createStudioPlannerStore,studioPlannerKey} from './dist/studio-planner.mjs';
import {studioLabels} from './dist/studio-planner-ui.mjs';
const memory=()=>{const data=new Map();return {getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)};};
test('presets, target angles and editable light values are finite and bounded',()=>{
 for(const name of studioPresetNames){const p=studioPreset(name);assert.equal(p.version,1);assert.ok(p.lights.length<=6);assert.match(studioPlanText(p),/Studio direction/);assert.deepEqual(studioPlanWarnings(p),[]);}
 assert.deepEqual(studioAim({x:0,y:1.5,z:-3},{x:0,y:1.5,z:0}),{yaw:0,pitch:0});assert.equal(Math.round(studioAim({x:-3,y:1.5,z:0},{x:0,y:1.5,z:0}).yaw),90);
 const p=normalizeStudioPlan({camera:{position:{x:999,y:-1,z:NaN},lens:999},lights:[{id:'lamp_normalized_1_0'},{id:'lamp_normalized_1_0'},{id:'lamp_normalized_1_0'}]});assert.equal(p.camera.position.x,5);assert.equal(p.camera.position.y,0.1);assert.equal(p.camera.lens,200);assert.equal(new Set(p.lights.map(l=>l.id)).size,3);
 const colours=[2000,5600,10000].map(k=>studioLightColor({colorMode:'temperature',kelvin:k}));assert.equal(new Set(colours).size,3);assert.ok(colours.every(x=>/^#[0-9a-f]{6}$/.test(x)));
});
test('camera paths match endpoints and maintain a true orbit radius without modifying the source',()=>{
 const p=studioPreset('orbit'),before=JSON.stringify(p),r=Math.hypot(p.camera.position.x-p.subject.x,p.camera.position.z-p.subject.z);
 for(let i=0;i<=100;i++){const q=studioCameraAt(p,i/100);assert.ok(Math.abs(Math.hypot(q.x-p.subject.x,q.z-p.subject.z)-r)<1e-9);assert.equal(q.y,p.camera.position.y);}
 assert.equal(JSON.stringify(p),before);assert.deepEqual(studioCameraAt(p,0),p.camera.position);assert.ok(studioCameraAt(studioPreset('crane'),1).y>p.camera.position.y);
 const dolly=studioPreset('dolly');assert.ok(studioCameraAt(dolly,1).z>dolly.camera.position.z);assert.ok(studioCameraAt(dolly,1).z<dolly.subject.z);
 const down=studioPreset('crane');down.motion.reverse=true;assert.ok(studioCameraAt(down,1).y<down.camera.position.y);assert.match(studioPlanText(down),/descending crane/);
 const edge=studioPreset('orbit');edge.camera.position={x:5,y:1.5,z:-5};assert.ok(studioPlanWarnings(edge).includes('outside-grid'));const aimed=studioPreset();aimed.camera.aim=false;aimed.camera.yaw=180;assert.ok(studioPlanWarnings(aimed).includes('target-behind'));
});
test('studio directions preserve style text, replace previous generated lights and remain clean on repeat',()=>{
 const p=studioPreset('crane');p.lights[0].colorMode='gel';p.lights[0].color='#cc1166';p.lights[1].intensity=0;p.camera.aim=true;
 const text=studioPlanText(p);assert.match(text,/#cc1166/);assert.match(text,/crane\/jib/);assert.match(text,/throughout/);assert.doesNotMatch(text,/descriptive strength 0\/100/);
 const existing='Visual direction mix: Primary — Glamour.\nLighting direction — descriptive strength: old lighting.\nMy own colour note.';
 const once=mergeStudioSection(existing,text),twice=mergeStudioSection(once,text);assert.equal(once,twice);assert.match(once,/Glamour/);assert.match(once,/My own colour/);assert.doesNotMatch(once,/old lighting/);assert.equal((once.match(/Studio direction:/g)||[]).length,1);
 const manual=mergeStudioSection(once,'Please use warm light.\nKeep the camera low.');assert.equal(manual,mergeStudioSection(manual,'Please use warm light.\nKeep the camera low.'));assert.throws(()=>mergeStudioSection(existing,''));assert.throws(()=>mergeStudioSection('x'.repeat(10000),text),/limit/);
});
test('studio persistence and backups retain custom output, refuse corruption and protect against stale tabs',()=>{
 const storage=memory(),a=createStudioPlannerStore(storage),b=createStudioPlannerStore(storage),data=a.read();data.state=studioPreset('window');data.state.customDirections='A hand-edited studio plan. ';data.presets=[{name:'Window test',state:data.state}];a.save(data);
 assert.equal(createStudioPlannerStore(storage).read().state.customDirections,'A hand-edited studio plan. ');assert.throws(()=>b.save(b.read()),/conflict/);
 const backup=a.export(),other=createStudioPlannerStore(memory());other.save(other.parse(backup));assert.deepEqual(other.read(),a.read());
 const before=a.export();storage.setItem=()=>{throw Error('quota');};assert.throws(()=>a.save(data));assert.equal(a.export(),before);
 const corrupt=memory();corrupt.setItem(studioPlannerKey,'{broken');const bad=createStudioPlannerStore(corrupt);assert.ok(bad.problem());assert.throws(()=>bad.save(data));assert.equal(corrupt.getItem(studioPlannerKey),'{broken');assert.throws(()=>a.parse(' '.repeat(400001)));assert.throws(()=>a.parse(JSON.stringify({...data,presets:[...data.presets,...data.presets]})));
});
test('all studio controls have eight-language labels and the offline bundle remains standalone',()=>{
 const english=studioLabels('EN');for(const language of ['EN','HU','DE','FR','ES','IT','PT','PL']){const labels=studioLabels(language);assert.deepEqual(Object.keys(labels),Object.keys(english));assert.ok(Object.values(labels).every(x=>typeof x==='string'&&x.trim()));assert.ok(!Object.values(labels).some(x=>x.includes('|')));}
 const html=readFileSync(new URL('./dist/ArtofTomworks_Prompt_Studio_OFFLINE.html',import.meta.url),'utf8'),scripts=[...html.matchAll(/<script>\s*([\s\S]*?)\s*<\/script>/gu)].map(x=>x[1]);assert.ok(scripts.length);for(const script of scripts){new Script(script);assert.ok(!/^import /m.test(script));}assert.equal((scripts.join('\n').match(/function attachVirtualStudio\(/g)||[]).length,1);assert.ok(!html.includes('href="./studio-planner.css"'));
});
