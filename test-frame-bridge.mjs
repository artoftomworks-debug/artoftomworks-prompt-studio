import {test} from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID,createHash} from 'node:crypto';
import {mkdtemp,readFile,writeFile,readdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {spawn} from 'node:child_process';
import {Readable} from 'node:stream';
import {setTimeout as sleep} from 'node:timers/promises';
import vm from 'node:vm';
import {videoLookCore} from './video-look-core.mjs';
import {imageWorkshopCore} from './dist/image-workshop.mjs';
import {videoWorkshopCore} from './video-workshop-core.mjs';
import {createFrameSender,createFrameReceiver} from './dist/frame-bridge.mjs';
import {createVideoWorkshopService,runVideoTool} from './video-workshop-server.mjs';
import {videoWorkshopApp,videoWorkshopLabels} from './dist/video-workshop-ui.mjs';
import {imageWorkshopLabels} from './dist/image-workshop-ui.mjs';
import {StudioNode} from './series-test-dom.mjs';
const L=videoLookCore(),I=imageWorkshopCore(),C=videoWorkshopCore();
const ffmpeg=process.env.PROMPT_STUDIO_TEST_FFMPEG||'C:/AIWorks/Data/Packages/ComfyUI/venv/Lib/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe';
const recipe={version:1,name:'Warm rain',layers:[{opacity:80,tone:{exposure:.18,contrast:12,shadows:9,highlights:-22,warmth:14,saturation:85}}]};
const asset=(extra={})=>({id:randomUUID(),hash:'a'.repeat(64),name:'Test.mp4',duration:3,width:192,height:128,fps:24,video:true,audio:true,codec:'h264',bytes:100,...extra});
test('shared tones match the image renderer; only global tones transfer; references and copy mode remain bounded',()=>{
 for(const rgb of [[0,0,0],[255,255,255],[35,110,190],[200,50,40]])assert.deepEqual(L.pixel(rgb,recipe.layers[0].tone),I.pixel(...rgb,recipe.layers[0].tone));
 const plan=I.fresh();plan.name='Rain';plan.layers[0].tone=recipe.layers[0].tone;plan.layers.push(I.layer('light'),I.layer('image'));const masked=I.layer();masked.mask.all=false;plan.layers.push(masked);const hidden=I.layer();hidden.visible=false;plan.layers.push(hidden);
 const result=L.capture(plan);assert.equal(result.recipe.layers.length,1);assert.equal(result.skipped,3);assert.doesNotMatch(JSON.stringify(result.recipe),/mask|strokes|asset/);assert.equal(I.normalizeLook(L.asImageLook(recipe)).layers.length,1);
 let p=C.add(C.fresh(),asset());const old=C.clone(p);p=C.normalize(L.apply(p,[p.clips[0].id],recipe,70));assert.equal(p.clips[0].lookStrength,70);assert.deepEqual(p.clips[0].look,recipe);assert.equal(old.clips[0].look,null);assert.equal(C.pictureCopyAllowed(p),false);p.clips[0].lookStrength=0;assert.equal(C.pictureCopyAllowed(p),true);
 assert.throws(()=>L.apply(p,['missing'],recipe));assert.throws(()=>L.normalize({...recipe,layers:[{opacity:100,tone:{...recipe.layers[0].tone,exposure:Infinity}}]}));assert.throws(()=>C.normalize({...p,clips:[{...p.clips[0],look:{bad:true}}]}));
 const before=L.signature(p,p.clips[0].id);p.clips[0].lookStrength=20;assert.equal(L.signature(p,p.clips[0].id),before);p.clips[0].in=.2;assert.notEqual(L.signature(p,p.clips[0].id),before);
});
test('ephemeral tab bridge transfers a PNG, acknowledges explicit recipes, rejects stale returns and reports failed transfers',async()=>{
 const channels=new Map(),factory=name=>{const c={postMessage:data=>{for(const peer of channels.get(name)||[])if(peer!==c)queueMicrotask(()=>peer.onmessage?.({data:structuredClone(data)}));},close:()=>channels.get(name).delete(c)};if(!channels.has(name))channels.set(name,new Set());channels.get(name).add(c);return c;};
 const token=randomUUID(),frames=[],errors=[];let stale=false,received;
 const sender=createFrameSender({token,onLook:r=>{if(stale)throw Error('stale');received=r;},onError:e=>errors.push(e),channelFactory:factory});
 const receiver=createFrameReceiver({token,onFrame:(blob,look)=>frames.push({blob,look}),onError:e=>errors.push(e),channelFactory:factory});
 try{sender.setFrame(new Blob(['png'],{type:'image/png'}));await sleep(10);assert.equal(frames.length,1);assert.equal(await frames[0].blob.text(),'png');await receiver.sendLook(recipe);assert.deepEqual(received,recipe);stale=true;await assert.rejects(receiver.sendLook(recipe),/rejected/);assert.equal(errors.length,1);assert.throws(()=>sender.setFrame(new Blob(['bad'],{type:'image/jpeg'})));sender.fail();await sleep(5);assert.match(errors.at(-1).message,/failed/);}finally{receiver.close();sender.close();}assert.equal(channels.get('artoftomworks.frame.'+token).size,0);
});
async function binary(args,cwd){return await new Promise((resolve,reject)=>{const parts=[],child=spawn(ffmpeg,args,{cwd,windowsHide:true});let err='';child.stdout.on('data',p=>parts.push(p));child.stderr.on('data',p=>err+=p);child.once('error',reject);child.once('close',code=>code?reject(Error(err)):resolve(Buffer.concat(parts)));});}
test('real FFmpeg: LUT channels agree with image tones; frame extraction, source waveforms, graded export, serialization and cleanup work',async()=>{
 const root=await mkdtemp(fileURLToPath(new URL('./video-fixture-bridge-',import.meta.url))),service=createVideoWorkshopService({root:join(root,'cache'),ffmpeg}),path=join(root,'Source.mp4'),silent=join(root,'Silent.mp4');
 await writeFile(join(root,'look.cube'),L.cube(recipe));const rgb=[35,110,190];await writeFile(join(root,'pixel.rgb'),Buffer.from(rgb));const pixel=await binary(['-v','error','-f','rawvideo','-pixel_format','rgb24','-video_size','1x1','-i','pixel.rgb','-vf','lut3d=file=look.cube:interp=tetrahedral','-frames:v','1','-f','rawvideo','-pix_fmt','rgb24','-'],root);const wanted=L.transform(rgb,recipe);for(let i=0;i<3;i++)assert.ok(Math.abs(pixel[i]-wanted[i])<2,`${pixel} vs ${wanted}`);
 await runVideoTool(ffmpeg,['-v','error','-f','lavfi','-i','testsrc2=size=192x128:rate=24:duration=3','-f','lavfi','-i','sine=frequency=440:sample_rate=48000:duration=3','-c:v','libx264','-threads','2','-pix_fmt','yuv420p','-c:a','aac','-shortest',path]);
 await runVideoTool(ffmpeg,['-v','error','-f','lavfi','-i','color=blue:size=96x160:rate=24:duration=2','-c:v','libx264','-threads','2','-an',silent]);
 const original=await readFile(path),ingest=async path=>service.ingest(Readable.from([await readFile(path)]),path),a=await ingest(path),b=await ingest(silent);let p=C.add(C.fresh(),a);p.clips[0].in=.4;p.clips[0].out=2;p.clips[0].brightness=.05;const req={project:p,clipId:p.clips[0].id,time:1};
 const png=await service.extractFrame(req);assert.equal(png.subarray(1,4).toString(),'PNG');assert.equal(png.readUInt32BE(16),192);assert.equal(png.readUInt32BE(20),128);
 const wave=await service.waveform(req);assert.equal(wave.peaks.length,1024);assert.equal(wave.from,.4);assert.equal(wave.duration,1.6);assert.ok(wave.peaks.every(x=>Number.isFinite(x)&&x>=0&&x<=1));assert.ok(Math.max(...wave.peaks)>.05);
 let q=C.add(C.fresh(),b);const silentWave=await service.waveform({project:q,clipId:q.clips[0].id});assert.equal(silentWave.silent,true);assert.ok(silentWave.peaks.every(x=>x===0));await service.extractFrame(req); // silent path releases reservation
 await assert.rejects(service.extractFrame({...req,clipId:randomUUID()}),/Select/);const bad=C.clone(p);bad.assets[0].hash='b'.repeat(64);await assert.rejects(service.waveform({...req,project:bad}),/fingerprint/);await service.extractFrame(req);
 const first=service.waveform(req);await assert.rejects(service.extractFrame(req),/active/);await first;
 const graded=C.normalize(L.apply(p,[p.clips[0].id],recipe,70));let job=await service.start(graded,true);await assert.rejects(service.extractFrame(req),/active/);for(let i=0;i<150&&service.status(job.id).state==='running';i++)await sleep(30);job=service.status(job.id);assert.equal(job.state,'done',job.error);assert.equal(job.result.width,192);assert.equal(job.result.fps,24);assert.ok((await readdir(join(root,'cache','jobs',job.id))).every(n=>!n.endsWith('.cube')));
 assert.deepEqual(await readFile(path),original);assert.ok(!(await readdir(join(root,'cache'))).some(n=>n.startsWith('frame-')));
 console.log('Frame bridge fixtures:',root);
});
class Node extends StudioNode{constructor(tag){super(tag);this.currentTime=0;this.duration=3;this.volume=1;this.playbackRate=1;}load(){}pause(){this.paused=true;}play(){this.paused=false;return Promise.resolve();}removeAttribute(k){delete this[k];}getContext(){return {clearRect(){},fillRect(){}};}}
function environment(assets){const body=new Node('body'),calls=[],events={},opened=[],sent=[];let senderConfig,seq=0;globalThis.document={body,documentElement:{},createElement:tag=>new Node(tag),createTextNode:text=>{const n=new Node('#text');n.textContent=text;return n;}};globalThis.window={addEventListener:(k,fn)=>events[k]=fn,open:(...args)=>opened.push(args)};globalThis.localStorage={getItem:()=>null,setItem(){}};globalThis.confirm=()=>true;globalThis.fetch=async(url,options={})=>{calls.push({url,options});let data;if(url.endsWith('/status'))data={ready:true,assets,exports:[]};else if(url.endsWith('/start'))data={job:{id:'job-'+(++seq)}};else if(url.includes('/job?'))data={id:'job-'+seq,state:'done',progress:100,preview:true,result:{name:'result.mp4',width:192,height:128,duration:2,fps:24}};else if(url.endsWith('/waveform'))data={peaks:Array(1024).fill(.2),from:0,duration:3};else data={};return {ok:true,json:async()=>data,blob:async()=>new Blob(['png'],{type:'image/png'})};};const ui=videoWorkshopApp('HU',videoWorkshopCore,videoWorkshopLabels,{lookFactory:videoLookCore,makeSender:config=>{senderConfig=config;return {setFrame:b=>sent.push(b),fail(){},close(){}};}});return {ui,body,calls,opened,sent,events,receive:(...args)=>senderConfig.onLook(...args)};}
const action=(e,k)=>e.body.querySelector('[data-vw-action="'+k+'"]'),field=(e,k)=>e.body.querySelector('[data-vw-field="'+k+'"]');
test('UI: explicit return, checked/all scopes, undo, stale-frame guard, three strengths, draggable comparison, waveform and frame stepping',async()=>{
 const a=asset(),b=asset({hash:'b'.repeat(64)}),e=environment([a,b]);await e.ui.loadLibrary();e.ui.addAsset(a,'clip');e.ui.addAsset(b,'clip');const initial=e.ui.getState(),id=initial.clips[1].id;await e.ui.captureFrame();assert.equal(e.opened.length,1);assert.equal(e.sent.length,1);assert.match(e.opened[0][0],/^\/image-workshop\?lang=HU&bridge=/);e.receive(recipe,1);assert.deepEqual(e.ui.getState(),initial,'receipt does not change project');
 const scope=e.body.querySelector('[data-bridge-field="scope"]');scope.value='checked';await action(e,'applyLook').emit('click');assert.equal(e.ui.getState().clips[0].look,null);const check=e.body.querySelector('[data-vw-target="'+id+'"]');check.checked=true;await check.emit('change');await action(e,'applyLook').emit('click');assert.equal(e.ui.getState().clips[0].look,null);assert.deepEqual(e.ui.getState().clips[1].look,recipe);await action(e,'undo').emit('click');assert.deepEqual(e.ui.getState(),initial);
 scope.value='allClips';await action(e,'applyLook').emit('click');assert.ok(e.ui.getState().clips.every(c=>c.look?.name===recipe.name));await action(e,'undo').emit('click');scope.value='capture';
 const before=e.ui.getState();await e.ui.renderLookSamples('variants');const starts=e.calls.filter(c=>c.url.endsWith('/start')).map(c=>JSON.parse(c.options.body));assert.deepEqual(starts.map(x=>x.project.clips[0].lookStrength),[40,70,100]);assert.ok(starts.every(x=>x.preview&&x.project.clips.length===1&&x.project.sounds.length===0));assert.equal(e.body.querySelectorAll('.vw-variants').length,1);assert.deepEqual(e.ui.getState(),before);
 await e.ui.renderLookSamples('compare');const handle=e.body.querySelector('.vw-look-divider').querySelector('button');await handle.emit('keydown',{key:'End'});assert.equal(handle.attributes['aria-valuenow'],'100');await action(e,'playTogether').emit('click');assert.ok(e.body.querySelector('.vw-look-compare').querySelectorAll('video').every(v=>!v.paused&&v.muted));await action(e,'pauseSamples').emit('click');
 await e.ui.loadWaveform();assert.equal(e.body.querySelector('canvas').parentElement.hidden,false);const player=e.body.querySelector('video');player.currentTime=1;await action(e,'nextFrame').emit('click');assert.ok(Math.abs(player.currentTime-(1+1/24))<1e-6);await action(e,'previousFrame').emit('click');assert.equal(player.currentTime,1);await e.body.querySelector('canvas').emit('click',{clientX:300});assert.equal(player.currentTime,1.5);
 field(e,'in').value='.2';await field(e,'in').emit('change');assert.throws(()=>e.receive(recipe,0),/megváltozott|újra|változott/);const changed=e.ui.getState();await action(e,'applyLook').emit('click');assert.deepEqual(e.ui.getState(),changed);assert.equal(e.body.querySelector('canvas').parentElement.hidden,true);
});
test('linked image, video and main scripts compile; bridge labels exist in all eight languages',async()=>{
 for(const name of ['Image_Workshop.html','Video_Workshop.html','ArtofTomworks_Prompt_Studio_OFFLINE.html']){const html=await readFile(new URL('./dist/'+name,import.meta.url),'utf8');new vm.Script([...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]).join('\n'));}
 for(const lang of ['EN','HU','DE','FR','ES','IT','PT','PL']){for(const k of ['editFrame','receivedLook','lookHelp','compareLook','threeLooks','waveform','previousFrame','nextFrame'])assert.ok(videoWorkshopLabels(lang)[k],lang+k);for(const k of ['returnVideo','bridgeHelp','bridgeSent','bridgeReady'])assert.ok(imageWorkshopLabels(lang)[k],lang+k);}
});
