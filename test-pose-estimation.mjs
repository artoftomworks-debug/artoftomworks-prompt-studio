import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Script,createContext} from 'node:vm';
import {poseEstimateCandidates,poseFiguresFromEstimate,createPoseEstimator} from './dist/pose-estimator.mjs';
import {poseEstimateLabels,attachPoseEstimation} from './dist/pose-estimate-ui.mjs';
import {poseWorldJoints,poseExport} from './dist/studio-poses.mjs';
import {studioPlannerKey} from './dist/studio-planner.mjs';
import {attachVirtualStudio} from './dist/studio-planner-ui.mjs';
import {createPoseAssetHandler} from './pose-assets-server.mjs';
import {environment,memory} from './pose-test-dom.mjs';
const fixture=JSON.parse(readFileSync(new URL('./test-fixtures/pose-estimation-result.json',import.meta.url))),clone=v=>JSON.parse(JSON.stringify(v));
test('actual local model output maps left/right joints without mirroring, keeps uncertainty and never infers depth or identity',()=>{
 const data=clone(fixture);data.landmarks[0][15].visibility=.1;const candidates=poseEstimateCandidates(data);assert.equal(candidates.length,1);assert.ok(candidates[0].uncertain.includes('lWrist'));
 assert.equal(candidates[0].points.lShoulder.x,data.landmarks[0][11].x);const map=p=>({x:(p.x-.5)*2,y:(1-p.y)*2,z:0}),figures=poseFiguresFromEstimate(candidates,map),world=poseWorldJoints(figures[0]);
 for(const [key,p]of Object.entries(candidates[0].points)){const expected=map(p);assert.ok(Math.abs(world[key].x-expected.x)<1e-8,key);assert.ok(Math.abs(world[key].y-expected.y)<1e-8,key);assert.equal(world[key].z,0);}
 assert.equal(figures[0].identity,'unspecified');assert.equal(figures[0].confidence.lWrist,.1);assert.equal(poseEstimateCandidates({width:100,height:100,landmarks:[]}).length,0);
 const bad=clone(data);bad.landmarks[0][15].x=NaN;assert.equal(poseEstimateCandidates(bad).length,0);assert.throws(()=>poseFiguresFromEstimate(candidates,()=>({x:99,y:1,z:0})),/alignment/);
});
test('worker client is local-only, transfers image bitmaps, rejects late results and releases workers on cancellation/failure',async()=>{
 const workers=[],bitmaps=[];class Worker{constructor(url){this.url=url;workers.push(this);}postMessage(data,transfer){this.sent=data;this.transfer=transfer;}terminate(){this.dead=true;}}
 const estimator=createPoseEstimator({origin:'http://127.0.0.1:18819',createWorker:url=>new Worker(url),decode:async()=>{const b={width:100,height:100,close(){this.closed=true;}};bitmaps.push(b);return b;}}),ref={dataURL:'data:image/png;base64,AA=='};
 const first=estimator.estimate(ref);await Promise.resolve();assert.equal(workers[0].url,'http://127.0.0.1:18819/pose-assets/pose-worker.js');assert.equal(workers[0].transfer[0],bitmaps[0]);const rejected=assert.rejects(first,/cancelled/);estimator.cancel();await rejected;assert.equal(workers[0].dead,true);
 const next=estimator.estimate(ref);await Promise.resolve();const w=workers[1];workers[0].onmessage({data:{id:workers[0].sent.id,type:'done',result:fixture}});w.onmessage({data:{id:w.sent.id,type:'done',result:fixture}});assert.equal((await next).length,1);assert.equal(w.dead,true);
 const failed=estimator.estimate(ref);await Promise.resolve();const failure=assert.rejects(failed,/unavailable/);workers[2].onerror();await failure;assert.equal(workers[2].dead,true);
 await assert.rejects(createPoseEstimator({origin:'https://external.example'}).estimate(ref),/launcher/);
});
test('classic worker uses bundled runtime, CPU delegation, closes its model and returns only keypoints',async()=>{
 const messages=[],imports=[];let options,closed=0;const bitmap={width:fixture.width,height:fixture.height,close(){closed++;}},scope={self:{location:{href:'http://127.0.0.1:18819/pose-assets/pose-worker.js'},postMessage:v=>messages.push(v)},URL,importScripts:path=>imports.push(path),Vision:{FilesetResolver:{forVisionTasks:async path=>({path})},PoseLandmarker:{createFromOptions:async(_,value)=>{options=value;return {detect:()=>fixture,close(){closed++;}};}}}};
 // Worker return names are landmarks/worldLandmarks, matching the actual browser API.
 scope.Vision.PoseLandmarker.createFromOptions=async(_,value)=>{options=value;return {detect:()=>fixture,close(){closed++;}};};
 new Script(readFileSync(new URL('./pose-assets/pose-worker.js',import.meta.url),'utf8')).runInContext(createContext(scope));await scope.self.onmessage({data:{id:1,bitmap}});
 assert.deepEqual(imports,['vision_bundle.js']);assert.equal(options.baseOptions.delegate,'CPU');assert.equal(options.numPoses,8);assert.equal(options.baseOptions.modelAssetPath,'http://127.0.0.1:18819/pose-assets/pose_landmarker_full.task');assert.equal(messages.at(-1).type,'done');assert.ok(!JSON.stringify(messages.at(-1)).includes('data:image'));assert.equal(closed,2);
});
test('asset route only serves exact local filenames with suitable MIME types and no caching',async()=>{
 const handle=createPoseAssetHandler(),request=async(method,path)=>{const res={writeHead(status,headers){this.status=status;this.headers=headers;},end(data){this.body=data;}};const handled=await handle({method},res,new URL(path,'http://127.0.0.1:18819'));return {res,handled};};
 let r=await request('GET','/pose-assets/pose-worker.js');assert.equal(r.res.status,200);assert.match(r.res.headers['Content-Type'],/javascript/);assert.equal(r.res.headers['Cache-Control'],'no-store');
 for(const path of ['/pose-assets/unknown.js','/pose-assets/%2e%2e/local-server.mjs','/pose-assets/pose-worker.js?x=1'])assert.notEqual((await request('GET',path)).res.status,200);
 assert.equal((await request('POST','/pose-assets/pose-worker.js')).res.status,404);assert.equal((await request('GET','/health')).handled,false);
});
test('estimate UI never applies automatically, handles selection/cancel/empty results and has eight complete languages',async()=>{
 const {doc}=environment(memory()),host=doc.createElement('div');doc.body.append(host);let applied=0,language='HU',resolve;
 const estimator={estimate:()=>new Promise(r=>resolve=r),cancel(){}},ui=attachPoseEstimation({host,getLanguage:()=>language,getReference:()=>({dataURL:'data:image/png;base64,AA==',width:768,height:1344}),estimator,onApply:p=>{applied+=p.length;}}),button=key=>host.querySelector('[data-pose-estimate="'+key+'"]');
 const running=button('start').emit('click');resolve(poseEstimateCandidates(fixture));await running;assert.equal(applied,0);assert.ok(host.querySelector('svg').querySelector('image'));assert.ok(host.querySelector('.pose-estimate-results').children.length);
 await button('add').emit('click');assert.equal(applied,1);assert.equal(host.querySelector('.pose-estimate-results').children.length,0);
 const pending=button('start').emit('click');await button('cancel').emit('click');resolve(poseEstimateCandidates(fixture));await pending;assert.equal(applied,1);assert.match(host.querySelector('.pose-estimate-status').textContent,/megszakítva/);
 for(const lang of ['EN','HU','DE','FR','ES','IT','PT','PL']){language=lang;ui.refresh();assert.ok(Object.values(poseEstimateLabels(lang)).every(v=>typeof v==='string'&&v));assert.equal(button('start').textContent,poseEstimateLabels(lang).start);}
});

test('actual import aligns to the reference, preserves camera/lights, marks weak joints and can be undone',async()=>{
 const storage=memory(),{doc}=environment(storage),original={Image:globalThis.Image,Worker:globalThis.Worker,createImageBitmap:globalThis.createImageBitmap,location:globalThis.location};
 globalThis.Image=class{constructor(){this.naturalWidth=768;this.naturalHeight=1344;}set src(_){queueMicrotask(()=>this.onload?.());}};
 globalThis.location={origin:'http://127.0.0.1:18819'};globalThis.createImageBitmap=async()=>({width:768,height:1344,close(){}});globalThis.Worker=class{postMessage({id}){const data=clone(fixture);data.landmarks[0][15].visibility=.1;queueMicrotask(()=>this.onmessage({data:{id,type:'done',result:data}}));}terminate(){}};
 try{
  const ui=attachVirtualStudio({getLanguage:()=> 'HU'}),root=doc.getElementById('virtual-studio-poses'),button=key=>root.querySelector('[data-pose-action="'+key+'"]');await button('add').emit('click');await ui.poses.restoreReference({dataURL:'data:image/png;base64,AA==',name:'fixture.png'});const before=ui.getState(),raw=storage.getItem(studioPlannerKey);
  await root.querySelector('[data-pose-estimate="start"]').emit('click');assert.equal(storage.getItem(studioPlannerKey),raw);await root.querySelector('[data-pose-estimate="add"]').emit('click');const state=ui.getState();assert.equal(state.figures.length,2);assert.deepEqual(state.camera,before.camera);assert.deepEqual(state.lights,before.lights);assert.equal(state.figures[1].confidence.lWrist,.1);assert.ok(root.querySelector('[data-pose-uncertain="true"]'));
  const frame=ui.poses.getReference().frames.front,image=root.querySelector('[data-pose-reference-layer]').querySelector('image').attributes,joint=root.querySelector('[data-pose-joint="'+state.figures[1].id+':lWrist"]').children[1].attributes,candidate=poseEstimateCandidates(fixture)[0].points.lWrist;
  assert.ok(Math.abs(Number(joint.cx)-(Number(image.x)+candidate.x*Number(image.width)))<.001);assert.ok(Math.abs(Number(joint.cy)-(Number(image.y)+candidate.y*Number(image.height)))<.001);assert.ok(frame.scale>0);
  await button('reviewEstimate').emit('click');assert.equal(ui.getState().figures[1].confidence,undefined);await button('undo').emit('click');assert.equal(ui.getState().figures[1].confidence.lWrist,.1);await button('undo').emit('click');assert.deepEqual(ui.getState(),before);
 }finally{for(const [k,v]of Object.entries(original)){if(v===undefined)delete globalThis[k];else globalThis[k]=v;}}
});
