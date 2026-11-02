import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Script,createContext} from 'node:vm';
import {readFileSync} from 'node:fs';
import {poseWorkspaceSource,poseWorkspaceCss} from './dist/studio-pose-window-data.mjs';
import {poseWorkspacePage} from './dist/studio-pose-window.mjs';
import {poseWorkspaceLabels} from './dist/studio-pose-workspace.mjs';
import {createStudioPlannerStore,studioPlannerKey,studioPreset} from './dist/studio-planner.mjs';
import {normalizePoseFigure,poseBoneAngles} from './dist/studio-poses.mjs';
import {environment,memory} from './pose-test-dom.mjs';
const plain=value=>JSON.parse(JSON.stringify(value));
const field=(doc,key)=>doc.body.querySelector('[data-pose-field="'+key+'"]'),button=(doc,key)=>doc.body.querySelector('[data-pose-action="'+key+'"]');
function context(storage=memory()){
 const env=environment(storage),listeners={},blobs=[],tabs=[],timers=[];
 const target={document:env.doc,localStorage:storage,Option:globalThis.Option,navigator:globalThis.navigator,TextEncoder,Blob,performance,console,URL:{createObjectURL:blob=>{blobs.push(blob);return 'blob:test-'+blobs.length;},revokeObjectURL(){}},setTimeout:(fn,ms)=>{timers.push({fn,ms});},clearTimeout(){},requestAnimationFrame:()=>1,cancelAnimationFrame(){},confirm:()=>true,addEventListener:(key,fn)=>(listeners[key]??=[]).push(fn),window:{open:(url,where)=>{const tab={opener:{},url,where};tabs.push(tab);return tab;},close(){target.closed=true;}}};
 const ctx=createContext(target);return {...env,ctx,target,listeners,blobs,tabs,timers,event:key=>{for(const fn of listeners.storage||[])fn({key});}};
}
function workspace(storage=memory(),initial=studioPreset()){
 const env=context(storage);env.ctx.initial=initial;new Script(poseWorkspaceSource+'\nglobalThis.workspace=mountPoseWorkspace(initial,"HU");').runInContext(env.ctx);return {...env,ui:env.ctx.workspace};
}
function mainStudio(storage){
 const html=readFileSync(new URL('./dist/ArtofTomworks_Prompt_Studio_OFFLINE.html',import.meta.url),'utf-8'),a=html.indexOf('const attachVirtualStudio = (() => {'),end='return attachVirtualStudio;\n})();',b=html.indexOf(end,a)+end.length;assert.ok(a>0&&b>a);
 const env=context(storage);new Script(html.slice(a,b)+'\nglobalThis.main=attachVirtualStudio({getLanguage:()=>"HU"});').runInContext(env.ctx);return {...env,ui:env.ctx.main};
}
test('separate tab is self-contained, has no server dependencies, safely retains text and clears opener',()=>{
 const plan=studioPreset();plan.figures=[normalizePoseFigure({name:'</script><img src=x onerror=evil()>',identity:'child'})];
 const html=poseWorkspacePage(plan,'HU');assert.equal((html.match(/<script>/g)||[]).length,1);assert.equal((html.match(/<\/script>/g)||[]).length,1);assert.doesNotMatch(html,/<script\s+src=/i);assert.doesNotMatch(html,/href="\.\//);assert.match(poseWorkspaceCss,/grid-template-columns:minmax\(0,1fr\) 350px/);assert.match(poseWorkspaceCss,/overflow:auto/);
 const script=html.match(/<script>([\s\S]*)<\/script>/)[1];new Script(script);const env=context();new Script(script).runInContext(env.ctx);assert.equal(env.target.window.opener,null);assert.equal(field(env.doc,'name').value,plan.figures[0].name);assert.equal(env.doc.body.className,'pose-workspace vs-content');assert.equal(button(env.doc,'newTab').hidden,true);
});
test('main tab launches a large pose page and reports a blocked popup without changing saved work',async()=>{
 const env=mainStudio(memory()),before=plain(env.ui.getState());await button(env.doc,'newTab').emit('click');assert.equal(env.tabs.length,1);assert.equal(env.tabs[0].where,'_blank');assert.equal(env.tabs[0].opener,null);const html=await env.blobs[0].text();assert.match(html,/mountPoseWorkspace\(/);assert.equal(env.timers[0].ms,60000);assert.deepEqual(plain(env.ui.getState()),before);
 env.target.window.open=()=>null;await button(env.doc,'newTab').emit('click');assert.match(env.doc.getElementById('virtual-studio-poses').querySelector('.vs-status').textContent,/Nem sikerült új lapot nyitni/);assert.deepEqual(plain(env.ui.getState()),before);
});
test('separate workspace and main tab share saved poses and presets without lost updates',async()=>{
 const storage=memory(),store=createStudioPlannerStore(storage),data=store.read();data.presets=[{name:'Keep me',state:data.state}];store.save(data);storage.setItem('media-test','keep media settings');const main=mainStudio(storage),child=workspace(storage);
 await button(child.doc,'add').emit('click');field(child.doc,'name').value='Child tab figure';await field(child.doc,'name').emit('change');main.event(studioPlannerKey);assert.equal(main.ui.getState().figures[0].name,'Child tab figure');assert.match(main.doc.body.querySelector('[data-vs-field="output"]').value,/Child tab figure/);
 field(main.doc,'height').value='1.93';await field(main.doc,'height').emit('change');child.event(studioPlannerKey);assert.equal(child.ui.getState().figures[0].height,1.93);assert.equal(field(child.doc,'height').value,'1.93');assert.equal(createStudioPlannerStore(storage).read().presets[0].name,'Keep me');assert.equal(storage.getItem('media-test'),'keep media settings');
 const current=plain(child.ui.getState());child.target.window.close();assert.equal(child.target.closed,true);assert.deepEqual(createStudioPlannerStore(storage).read().state,current);
});
test('stale separate-tab edits are rejected and reloaded rather than overwriting a newer plan',()=>{
 const storage=memory(),a=workspace(storage),b=workspace(storage);const next=plain(a.ui.getState());next.figures=[normalizePoseFigure({id:'figure_new',name:'Keep this new figure'})];assert.equal(a.ui.commit(next),true);const stale=plain(b.ui.getState());stale.camera.lens=123;assert.equal(b.ui.commit(stale),false);assert.equal(createStudioPlannerStore(storage).read().state.camera.lens,next.camera.lens);assert.equal(b.ui.getState().figures[0].name,'Keep this new figure');assert.match(b.doc.body.querySelector('.pose-workspace-status').textContent,/másik lapon/);
});
test('zoom and centring are view-only; exact angles, camera controls and prompt edits are saved',async()=>{
 const storage=memory(),env=workspace(storage);await button(env.doc,'add').emit('click');field(env.doc,'joint').value='lElbow';await field(env.doc,'joint').emit('change');const before=storage.getItem(studioPlannerKey);field(env.doc,'zoom').value='250';await field(env.doc,'zoom').emit('input');await button(env.doc,'focusJoint').emit('click');assert.equal(storage.getItem(studioPlannerKey),before);const id=env.ui.getState().figures[0].id,marker=env.doc.body.querySelector('[data-pose-joint="'+id+':lElbow"]');assert.equal(marker.children[1].attributes.cx,'380');assert.equal(marker.children[1].attributes.cy,'250');
 field(env.doc,'azimuthExact').value='12.3';field(env.doc,'elevationExact').value='34.5';await field(env.doc,'azimuthExact').emit('change');const angle=poseBoneAngles(env.ui.getState().figures[0],'lElbow');assert.ok(Math.abs(angle.azimuth-12.3)<1e-7);assert.ok(Math.abs(angle.elevation-34.5)<1e-7);
 const cam=env.doc.body.querySelector('[data-pose-camera="ratio"]');cam.value='9:16';await cam.emit('change');assert.equal(env.ui.getState().camera.ratio,'9:16');assert.equal(env.doc.body.querySelector('[data-pose-camera="yaw"]').disabled,true);
 const output=env.doc.body.querySelector('[data-pose-workspace="output"]');output.value='My handwritten directions.';await output.emit('input');assert.equal(createStudioPlannerStore(storage).read().state.customDirections,output.value);await env.doc.body.querySelector('[data-pose-workspace="copy"]').emit('click');assert.equal(env.doc.clipboard,output.value);await env.doc.body.querySelector('[data-pose-workspace="rebuild"]').emit('click');assert.equal(env.ui.getState().customDirections,null);assert.match(output.value,/Pose layout:/);
});
test('storage failure keeps saved figures and both workspace vocabularies cover eight languages',async()=>{
 const storage=memory(),env=workspace(storage);await button(env.doc,'add').emit('click');const before=plain(env.ui.getState()),raw=storage.getItem(studioPlannerKey);storage.setItem=()=>{throw Error('quota');};field(env.doc,'height').value='2.1';await field(env.doc,'height').emit('change');assert.deepEqual(plain(env.ui.getState()),before);assert.equal(storage.getItem(studioPlannerKey),raw);
 const selector=env.doc.body.querySelector('[data-pose-workspace="language"]');for(const code of ['EN','HU','DE','FR','ES','IT','PT','PL']){const labels=poseWorkspaceLabels(code);assert.ok(Object.values(labels).every(v=>typeof v==='string'&&v.trim()));selector.value=code;await selector.emit('change');assert.equal(env.doc.title,labels.title+' — Prompt Studio');assert.equal(env.doc.body.querySelector('[data-pose-workspace="copy"]').textContent,labels.copy);assert.equal(field(env.doc,'identity').options.find(n=>n.value==='child').textContent,labels.child);}
});
test('reference alignment stays locked while posing and transfers intact into the actual new-tab page',async()=>{
 const storage=memory(),main=mainStudio(storage),ImageStub=class{constructor(){this.naturalWidth=1000;this.naturalHeight=500;}set src(value){this.url=value;queueMicrotask(()=>this.onload?.());}};main.ctx.Image=ImageStub;
 await button(main.doc,'add').emit('click');const reference={dataURL:'data:image/png;base64,AA==',name:'private-reference.png',config:{opacity:47,scale:110,offsetX:5,offsetY:-3,rotation:7}};assert.equal(await main.ui.poses.restoreReference(reference),true);
 const pose=main.doc.getElementById('virtual-studio-poses'),image=()=>pose.querySelector('image'),before={...image().attributes};field(main.doc,'x').value='2';await field(main.doc,'x').emit('change');assert.deepEqual(image().attributes,before,'editing pose bounds does not refit the background image');
 field(main.doc,'zoom').value='200';await field(main.doc,'zoom').emit('input');const aligned={...image().attributes},state=plain(main.ui.getState());assert.ok(!JSON.stringify(state).includes(reference.dataURL));assert.ok(!storage.getItem(studioPlannerKey).includes('private-reference'));
 await button(main.doc,'newTab').emit('click');const html=await main.blobs.at(-1).text();assert.ok(html.includes('private-reference.png'));const child=context(storage);child.ctx.Image=ImageStub;
 const code=html.match(/<script>([\s\S]*)<\/script>/)[1].replace('window.opener=null;mountPoseWorkspace(','window.opener=null;globalThis.workspace=mountPoseWorkspace(');new Script(code).runInContext(child.ctx);assert.equal(await child.ctx.workspace.referenceReady,true);
 const imported=child.doc.getElementById('virtual-studio-poses').querySelector('image').attributes;for(const key of ['x','y','width','height','opacity','transform'])assert.equal(imported[key],aligned[key],key+' remains aligned across tabs');assert.deepEqual(plain(child.ctx.workspace.getState()),state);
});
test('image drag is view-only, Esc restores it, and removing the image keeps the pose',async()=>{
 const env=mainStudio(memory());env.ctx.Image=class{constructor(){this.naturalWidth=800;this.naturalHeight=600;}set src(value){queueMicrotask(()=>this.onload?.());}};await button(env.doc,'add').emit('click');await env.ui.poses.restoreReference({dataURL:'data:image/png;base64,AA==',name:'ref.png'});
 const root=env.doc.getElementById('virtual-studio-poses'),svg=root.querySelector('svg'),move=root.querySelector('[data-pose-reference="move"]'),before=plain(env.ui.getState()),original=plain(env.ui.poses.getReference().config);move.checked=true;await move.emit('change');await svg.emit('pointerdown',{clientX:300,clientY:180,pointerId:1,target:svg});await svg.emit('pointermove',{clientX:340,clientY:200,pointerId:1});assert.notDeepEqual(plain(env.ui.poses.getReference().config),original);await root.emit('keydown',{key:'Escape',target:svg});assert.deepEqual(plain(env.ui.poses.getReference().config),original);assert.deepEqual(plain(env.ui.getState()),before);
 env.ui.poses.reference.clear();assert.equal(root.querySelector('image'),null);assert.deepEqual(plain(env.ui.getState()),before);
});

test('opening the generated tab carries layer choices even without a loaded photo, without adding them to saved scene JSON',async()=>{
 const storage=memory(),main=mainStudio(storage);await button(main.doc,'add').emit('click');
 const body=main.doc.body.querySelector('[data-pose-layer="body"]'),opacity=main.doc.body.querySelector('[data-pose-layer="bodyOpacity"]');body.checked=true;await body.emit('change');opacity.value='73';await opacity.emit('input');
 const scene=storage.getItem(studioPlannerKey);assert.ok(!scene.includes('bodyOpacity'));await button(main.doc,'newTab').emit('click');const html=await main.blobs.at(-1).text(),child=context(storage);
 const code=html.match(/<script>([\s\S]*)<\/script>/)[1].replace('window.opener=null;mountPoseWorkspace(','window.opener=null;globalThis.workspace=mountPoseWorkspace(');new Script(code).runInContext(child.ctx);assert.equal(await child.ctx.workspace.referenceReady,true);
 assert.equal(child.doc.body.querySelector('[data-pose-layer="body"]').checked,true);assert.equal(child.doc.body.querySelector('[data-pose-layer="bodyOpacity"]').value,'73');assert.equal(storage.getItem(studioPlannerKey),scene);
});
