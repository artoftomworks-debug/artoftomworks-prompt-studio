import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdtemp,stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {Readable,PassThrough} from 'node:stream';
import {once} from 'node:events';
import {randomUUID,createHash} from 'node:crypto';
import {setTimeout as sleep} from 'node:timers/promises';
import vm from 'node:vm';
import {soundWorkshopCore,soundHandoffCore} from './sound-workshop-core.mjs';
import {soundWorkshopLabels,soundWorkshopApp} from './dist/sound-workshop-ui.mjs';
import {attachSoundHandoff,soundHandoffLabels} from './dist/sound-handoff-ui.mjs';
import {createSoundWorkshopService} from './sound-workshop-server.mjs';
import {createVideoWorkshopService,runVideoTool} from './video-workshop-server.mjs';
import {videoWorkshopCore} from './video-workshop-core.mjs';
import {StudioNode} from './series-test-dom.mjs';
const C=soundWorkshopCore(),H=soundHandoffCore(),V=videoWorkshopCore(),samplesRoot=fileURLToPath(new URL('./sound-samples/',import.meta.url)),catalog=JSON.parse(await readFile(join(samplesRoot,'catalog.json'),'utf8'));
const ffmpeg='C:/AIWorks/Data/Packages/ComfyUI/venv/Lib/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe';
const asset=(extra={})=>({id:randomUUID(),hash:'a'.repeat(64),name:'Sound.wav',duration:4,audio:true,video:false,bytes:100,...extra});

test('17 actual WAV starters have matching fingerprints, full localisation, seven English scripts and bounded original presets',async()=>{
 assert.equal(catalog.samples.length,17);assert.equal(catalog.samples.filter(s=>s.kind==='voice').length,7);
 for(const sample of catalog.samples){const bytes=await readFile(join(samplesRoot,sample.file));assert.equal(bytes.length,sample.bytes);assert.equal(createHash('sha256').update(bytes).digest('hex'),sample.sha256);assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.toString('ascii',8,12),'WAVE');assert.equal(sample.title.length,8);assert.ok(sample.title.every(Boolean));assert.ok(sample.duration>.1);if(sample.kind==='voice'){assert.equal(sample.language,'EN');assert.ok(sample.script.length>100);}}
 for(const preset of catalog.presets){assert.equal(preset.title.length,8);C.tracks(preset.tracks);assert.ok(preset.tracks.every(t=>catalog.samples.some(a=>'sample:'+a.id===t.key)));}
 assert.match(await readFile(join(samplesRoot,'SAMPLE_TERMS.txt'),'utf8'),/commercial audiovisual/);
});

test('sound-library bounds, search phrases, favorites, Unicode and metadata privacy are explicit',()=>{
 const sample={...catalog.samples[0],favorite:true};assert.ok(C.matches(sample,{query:'wrestling',kind:'voice',favorite:true}));assert.ok(C.matches(sample,{query:'crowd is waiting'}));assert.ok(C.matches({...sample,title:['Esős kávézó']},{query:'esos kavezo'}));assert.equal(C.matches(sample,{mood:'gentle'}),false);
 assert.throws(()=>C.tracks(Array(13).fill({key:'sample:soft-wind'})));assert.throws(()=>C.track({key:'../../private.wav'}));assert.throws(()=>C.state({version:1,revision:0,metadata:{'__proto__bad':{}},presets:[]}));const m=C.metadata({source:'x\nsecret',path:'C:/private',favorite:true});assert.doesNotMatch(JSON.stringify(m),/private|path/);assert.equal(m.source,'x secret');
});

test('transfers preserve existing video edits, normalize added sounds and reject expired, missing or excessive tracks atomically',()=>{
 const a=asset(),clip=asset({video:true,width:192,height:128,hash:'b'.repeat(64)}),project=V.add(V.fresh(),clip);project.clips[0].contrast=1.2;const before=JSON.stringify(project),transfer={version:1,id:randomUUID(),at:Date.now(),name:'Rain',items:[{asset:a,settings:{at:1,gain:-9,fadeIn:.4,fadeOut:.6,loop:true}}]};
 const next=H.apply(transfer,project,V,[a,clip]);assert.equal(next.clips[0].contrast,1.2);assert.equal(next.sounds[0].at,1);assert.equal(next.sounds[0].gain,-9);assert.equal(next.sounds[0].loop,true);assert.equal(JSON.stringify(project),before);assert.throws(()=>H.apply(transfer,project,V,[clip]));assert.throws(()=>H.normalize({...transfer,at:Date.now()-86400001}));const full=V.clone(next);full.sounds=Array.from({length:12},()=>({...next.sounds[0],id:randomUUID()}));assert.throws(()=>H.apply(transfer,full,V,[a,clip]));
});

function dom(){const body=new StudioNode('body'),events={},values=new Map();class N extends StudioNode{load(){}play(){return Promise.resolve();}pause(){}removeAttribute(k){delete this[k];}}globalThis.document={body,documentElement:{},createElement:tag=>new N(tag),createTextNode:text=>{const n=new N('#text');n.textContent=text;return n;}};globalThis.window={addEventListener:(key,fn)=>(events[key]??=[]).push(fn),open(){}};globalThis.localStorage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v)};globalThis.confirm=()=>true;return {body,events,values};}

test('sound UI lists, searches, stages, restores and sends ready sounds without changing video automatically',async()=>{
 const env=dom(),a=asset(),payload={state:C.state(),samples:catalog.samples,presets:catalog.presets,assets:[],engineReady:true},requests=[];globalThis.fetch=async(url,options={})=>{requests.push({url,options});let data=payload;if(url.endsWith('/prepare'))data={transfer:{version:1,id:randomUUID(),at:Date.now(),name:'Mix',items:[{asset:a,settings:{at:0,gain:0,fadeIn:.1,fadeOut:.2,loop:false}}]}};return {ok:true,json:async()=>data};};
 const ui=soundWorkshopApp('HU',soundWorkshopCore,soundHandoffCore,soundWorkshopLabels);await new Promise(r=>setImmediate(r));assert.equal(env.body.querySelectorAll('.sw-card').length,17);const search=env.body.querySelector('[data-sw-field="search"]');search.value='wrestling';await search.emit('input');assert.equal(env.body.querySelectorAll('.sw-card').length,1);await env.body.querySelector('[data-sw-action="add"]').emit('click');assert.equal(ui.getBasket().length,1);ui.listen('sample:arena-intro-en');assert.match(env.body.querySelector('audio').src,/arena-intro-en/);assert.match(env.body.querySelector('.sw-transcript').textContent,/The lights are up/);await ui.send(ui.getBasket(),'Arena');assert.ok(env.values.has(H.key));assert.ok(!requests.some(r=>r.url==='/api/video/start'));
 const draft=env.values.get('artoftomworks.v2.soundWorkshop.draft');const env2=dom();env2.values.set('artoftomworks.v2.soundWorkshop.draft',draft);const restored=soundWorkshopApp('HU',soundWorkshopCore,soundHandoffCore,soundWorkshopLabels);await new Promise(r=>setImmediate(r));assert.equal(restored.getBasket().length,1);assert.equal(env2.body.querySelector('[data-sw-field="search"]').value,'wrestling');
});

test('received sounds require one explicit acceptance and retain the current video project',async()=>{
 const env=dom(),a=asset(),clip=asset({video:true,width:192,height:128,hash:'b'.repeat(64)}),transfer={version:1,id:randomUUID(),at:Date.now(),items:[{asset:a,settings:{at:1,gain:-12,fadeIn:.2,fadeOut:.3,loop:true}}]};env.values.set(H.key,JSON.stringify(transfer));let project=V.add(V.fresh(),clip),commits=0;const host=new StudioNode('div');env.body.append(host);const ui=attachSoundHandoff({host,language:'HU',handoffFactory:soundHandoffCore,labels:soundHandoffLabels,videoCore:V,getProject:()=>V.clone(project),getLibrary:()=>[a,clip],isBusy:()=>false,commit:p=>{project=p;commits++;},loadLibrary:async()=>{},say:()=>{},fail:e=>{throw e;}});assert.equal(project.sounds.length,0);assert.equal(ui.getPending().id,transfer.id);await env.body.querySelector('[data-sound-action="apply"]').emit('click');assert.equal(commits,1);assert.equal(project.sounds.length,1);assert.equal(project.clips.length,1);ui.read();assert.equal(ui.getPending(),null);await ui.apply();assert.equal(commits,1);
});

test('real sample server protects rights records, revision conflicts, Unicode and file ranges, and mixes transferred samples with verified picture copy',async()=>{
 const root=await mkdtemp(fileURLToPath(new URL('./sound-fixture-',import.meta.url))),video=createVideoWorkshopService({root:join(root,'video'),ffmpeg}),service=createSoundWorkshopService({root:join(root,'sound'),samplesRoot,video});await video.ready();let data=await service.status();assert.equal(data.samples.length,17);
 const call=async(path,value,headers={})=>{const req=Readable.from(value===undefined?[]:[Buffer.from(JSON.stringify(value))]);req.method=value===undefined?'GET':'POST';req.headers=value===undefined?headers:{origin:'http://127.0.0.1:18819','content-type':'application/json','x-prompt-studio-action':'sound-workshop',...headers};const res=new PassThrough(),chunks=[];res.writeHead=(code,values={})=>{res.statusCode=code;res.headers=values;res.headersSent=true;};res.on('data',d=>chunks.push(d));const done=once(res,'finish');await service.handle(req,res,new URL(path,'http://127.0.0.1:18819'),'http://127.0.0.1:18819');await done;return {status:res.statusCode,headers:res.headers,body:Buffer.concat(chunks)};};
 const ranged=await call('/api/sound/sample?id=rain-window',undefined,{range:'bytes=0-15'});assert.equal(ranged.status,206);assert.equal(ranged.body.length,16);assert.equal((await call('/api/sound/sample?id=../../local-server.mjs')).status,400);assert.equal((await call('/api/sound/sample?id=rain-window',undefined,{range:'bytes=99999999-'})).status,416);
 const denied=await call('/api/sound/metadata',{revision:0,key:'sample:rain-window',values:{}},{origin:'https://example.com'});assert.equal(denied.status,403);
 const meta=await call('/api/sound/metadata',{revision:0,key:'sample:rain-window',values:{favorite:true,tags:'eső, café'}});assert.equal(meta.status,200);assert.equal((await call('/api/sound/metadata',{revision:0,key:'sample:rain-window',values:{favorite:false}})).status,400);data=await service.status();assert.equal(data.state.metadata['sample:rain-window'].favorite,true);assert.equal(data.state.metadata['sample:rain-window'].tags,'eső, café');
 const preset=catalog.presets[0];assert.equal((await call('/api/sound/preset',{revision:1,name:'Esős kávézó',tracks:preset.tracks})).status,200);const transfer=await service.prepare({name:'Esős kávézó',tracks:preset.tracks});assert.equal(transfer.items.length,3);assert.equal((await service.status()).assets.length,0,'included samples do not duplicate as user sounds');assert.equal((await video.ready()).assets.length,3);
 const source=join(root,'source.mp4');await runVideoTool(ffmpeg,['-v','error','-f','lavfi','-i','color=blue:size=192x128:rate=24:duration=3','-an','-c:v','libx264','-threads','2',source]);const clip=await video.ingest(Readable.from([await readFile(source)]),'source.mp4');let project=V.add(V.fresh(),clip);project=H.apply(transfer,project,V,(await video.ready()).assets);project.output.mode='copy';let job=await video.start(project);for(let i=0;i<1000&&job.state==='running';i++){await sleep(10);job=video.status(job.id);}assert.equal(job.state,'done',job.error);assert.equal(job.pictureVerified,true);assert.equal(job.result.audio,true);assert.equal(job.result.width,192);assert.equal(job.result.fps,24);
 const restart=createSoundWorkshopService({root:join(root,'sound'),samplesRoot,video});assert.equal((await restart.status()).state.presets[0].name,'Esős kávézó');const saved=(await restart.status()).state;assert.equal((await call('/api/sound/preset-delete',{revision:saved.revision,id:saved.presets[0].id})).status,200);assert.equal((await video.ready()).assets.length,4);
 const stateFile=join(root,'sound/library.json');await writeFile(stateFile,'broken json');const broken=createSoundWorkshopService({root:join(root,'sound'),samplesRoot,video});await assert.rejects(()=>broken.status(),/kept/);assert.equal(await readFile(stateFile,'utf8'),'broken json');console.log('Sound mix test export:',join(root,'video/jobs',job.id,job.result.name));
});

test('eight-language sound and handoff controls and all generated scripts compile',async()=>{
 for(const lang of C.languages){assert.ok(Object.values(soundWorkshopLabels(lang)).every(Boolean));assert.ok(Object.values(soundHandoffLabels(lang)).every(Boolean));}
 for(const page of ['Sound_Workshop.html','Video_Workshop.html','ArtofTomworks_Prompt_Studio_OFFLINE.html']){const html=await readFile(new URL('./dist/'+page,import.meta.url),'utf8');for(const m of html.matchAll(/<script>([\s\S]*?)<\/script>/g))new vm.Script(m[1]);}
 const main=await readFile(new URL('./dist/ArtofTomworks_Prompt_Studio_OFFLINE.html',import.meta.url),'utf8');assert.match(main,/attachSoundWorkshop/);
});
