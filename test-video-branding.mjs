import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile,readdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {randomUUID} from 'node:crypto';
import {Readable} from 'node:stream';
import {setTimeout as sleep} from 'node:timers/promises';
import vm from 'node:vm';
import {imageWorkshopCore} from './dist/image-workshop.mjs';
import {videoBrandCore} from './video-brand-core.mjs';
import {videoWorkshopCore} from './video-workshop-core.mjs';
import {videoLookCore} from './video-look-core.mjs';
import {videoWorkshopApp,videoWorkshopLabels} from './dist/video-workshop-ui.mjs';
import {videoBrandingLabels,videoBrandingPanel} from './dist/video-branding-ui.mjs';
import {validateBrandFrames,createVideoWorkshopService,runVideoTool} from './video-workshop-server.mjs';
import {StudioNode} from './series-test-dom.mjs';
const B=videoBrandCore(),C=videoWorkshopCore(),I=imageWorkshopCore(),ffmpeg='C:/AIWorks/Data/Packages/ComfyUI/venv/Lib/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe';
const asset=()=>({id:randomUUID(),hash:'a'.repeat(64),name:'Clip.mp4',duration:4,width:192,height:128,fps:24,video:true,audio:true,bytes:100,codec:'h264'});

test('portable branding is stable, bounded, timing follows timeline and fades agree at edges',()=>{
 const p=C.add(C.fresh(),asset());p.branding=[B.text('Café — 100% : [x] \\ no filter syntax')];const b=p.branding[0];b.start=1;b.end=3;b.fadeIn=.5;b.fadeOut=.5;
 const n=C.normalize(p);assert.deepEqual(C.normalize(n),n);assert.equal(B.alpha(b,.9,4),0);assert.equal(B.alpha(b,1.25,4),.5);assert.equal(B.alpha(b,2,4),1);assert.equal(B.alpha(b,2.75,4),.5);assert.equal(B.alpha(b,3,4),0);
 b.end=0;assert.equal(B.timing(b,8).end,8);assert.equal(B.timing(b,2).end,2);assert.equal(C.pictureCopyAllowed(p),false);b.enabled=false;assert.equal(C.pictureCopyAllowed(p),true);
 assert.throws(()=>B.normalize(Array(9).fill(b)));assert.throws(()=>B.normalize([{...b,end:.2}]));assert.throws(()=>B.normalize([{...b,layer:{kind:'light'}}]));assert.throws(()=>B.normalize([{...b,layer:{kind:'image'},logo:'https://example.com/x.png'}]));assert.equal(C.normalize({...p,branding:undefined}).branding.length,0);
 const h=C.history(p),changed=C.clone(p);changed.branding[0].layer.words='New';h.commit(changed);assert.equal(h.undo().branding[0].layer.words,b.layer.words);assert.equal(h.redo().branding[0].layer.words,'New');
 assert.deepEqual(videoLookCore().sample(p,p.clips[0].id,null,100).branding,[],'tone comparison intentionally excludes timed branding');
});

test('saved image profiles transfer editable content and alpha without changing source profile or source edits',()=>{
 const layer=I.layer('text','Signature');layer.opacity=42;layer.words='Your name';const profile={id:'saved',name:'My signature',logos:[],layers:[layer]},before=JSON.stringify(profile),layers=B.fromProfile(profile);
 assert.equal(layers[0].layer.opacity,42);assert.equal(layers[0].layer.words,'Your name');assert.equal(layers[0].end,0);assert.equal(JSON.stringify(profile),before);
 for(const lang of ['EN','HU','DE','FR','ES','IT','PT','PL']){const labels=videoBrandingLabels(lang);assert.ok(Object.values(labels).every(s=>typeof s==='string'&&s.length>0));assert.equal(labels.anchors.split(',').length,9);}
});

test('real UI supports editable layers, timing, profile transfer, dragging, cancellation and keyboard position',async()=>{
 const store=new Map(),body=new StudioNode('body'),events={};globalThis.document={body,createElement:tag=>{const node=new StudioNode(tag);if(tag==='canvas')node.getContext=()=>({clearRect(){},globalAlpha:1});return node;},createTextNode:text=>new StudioNode('#text')};globalThis.window={addEventListener:(key,fn)=>events[key]=fn};globalThis.localStorage={getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,v)};
 let p=C.add(C.fresh(),asset()),commits=0,errors=[];const host=new StudioNode('aside'),stage=new StudioNode('div'),player=new StudioNode('video');stage.append(player);body.append(host,stage);const ui=videoBrandingPanel({host,stage,player,language:'HU',imageFactory:imageWorkshopCore,rendererFactory:()=>({drawBrand(){}}),brandFactory:videoBrandCore,labels:videoBrandingLabels,getProject:()=>C.clone(p),commit:next=>{p=C.normalize(next);commits++;ui.refresh();},isBusy:()=>false,isResult:()=>false,getTime:()=>1,seek:()=>{},onError:e=>errors.push(e)});
 ui.refresh();ui.addText();assert.equal(p.branding.length,1);const field=key=>body.querySelector('[data-vb-field="'+key+'"]');field('words').value='My title';await field('words').emit('change');assert.equal(p.branding[0].layer.words,'My title');field('end').value='3';await field('end').emit('change');assert.equal(p.branding[0].end,3);
 const overlay=body.querySelector('canvas'),before=p.branding[0].layer.x,n=commits;await overlay.emit('pointerdown',{clientX:100,clientY:100,pointerId:1});await overlay.emit('pointermove',{clientX:160,clientY:100});assert.equal(commits,n);await overlay.emit('pointerup');assert.equal(commits,n+1);assert.ok(p.branding[0].layer.x>before);
 const after=JSON.stringify(p);await overlay.emit('pointerdown',{clientX:100,clientY:100,pointerId:1});await overlay.emit('pointermove',{clientX:190,clientY:100});await overlay.emit('pointercancel');assert.equal(JSON.stringify(p),after);await overlay.emit('keydown',{key:'ArrowLeft'});assert.ok(p.branding[0].layer.x<JSON.parse(after).branding[0].layer.x);
 const profile={id:'profile1',name:'Portfolio',logos:[],layers:[I.layer('text','Saved')]};I.writeBrandShelf(localStorage,null,{version:1,brands:[profile]});events.storage({key:I.brandShelfKey});ui.applyProfile(profile.id);assert.equal(p.branding.length,1);assert.equal(p.branding[0].layer.name,'Saved');assert.equal(errors.length,0);
 const html=await readFile(new URL('./dist/Video_Workshop.html',import.meta.url),'utf8');new vm.Script(html.match(/<script>([\s\S]*?)<\/script>/)[1]);assert.match(html,/brandPanel:videoBrandingPanel/);
});

test('workshop integration supplies full-size branding frames and preserves settings when saving a portable project',async()=>{
 const a=asset(),body=new StudioNode('body'),calls=[],downloads=[],urls=new Map();
 class Node extends StudioNode{constructor(tag){super(tag);this.currentTime=0;}load(){}pause(){}removeAttribute(k){delete this[k];}getContext(){return {clearRect(){},globalAlpha:1};}toDataURL(){return 'data:image/png;base64,YQ==';}}
 globalThis.document={body,documentElement:{},createElement:tag=>{const x=new Node(tag);if(tag==='a')x.click=()=>downloads.push(urls.get(x.href));return x;},createTextNode:()=>new Node('#text')};globalThis.window={addEventListener(){}};const values=new Map();globalThis.localStorage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v)};globalThis.confirm=()=>true;URL.createObjectURL=b=>{const id='blob:'+Math.random();urls.set(id,b);return id;};URL.revokeObjectURL=()=>{};
 globalThis.fetch=async(url,options={})=>{calls.push({url,options});const data=url.endsWith('/status')?{ready:true,assets:[a],exports:[]}:url.endsWith('/start')?{job:{id:'render'}}:{id:'render',state:'done',preview:true,result:{fps:24}};return {ok:true,json:async()=>data};};
 const ui=videoWorkshopApp('EN',videoWorkshopCore,videoWorkshopLabels,{brandPanel:videoBrandingPanel,imageFactory:imageWorkshopCore,rendererFactory:()=>({drawBrand(){}}),brandFactory:videoBrandCore,brandLabels:videoBrandingLabels});await ui.loadLibrary();ui.addAsset(a,'clip');ui.brandingUI.addText();assert.equal(ui.getState().branding.length,1);
 const action=key=>body.querySelector('[data-vw-action="'+key+'"]');await action('preview').emit('click');await new Promise(r=>setImmediate(r));const sent=JSON.parse(calls.find(c=>c.url.endsWith('/start')).options.body);assert.equal(sent.brandFrames[0].width,192);assert.equal(sent.brandFrames[0].height,128);assert.equal(sent.brandFrames[0].id,sent.project.branding[0].id);await action('save').emit('click');const saved=JSON.parse(await downloads.at(-1).text());assert.equal(saved.branding[0].layer.words,'Text');assert.equal(saved.output.resolution,'source');
});

test('real FFmpeg composites branding at timed alpha, preserves audio, source FPS/size and metadata, and rejects missing frames',async()=>{
 const root=await mkdtemp(fileURLToPath(new URL('./brand-video-fixture-',import.meta.url))),source=join(root,'source.mp4'),png=join(root,'overlay.png');
 await runVideoTool(ffmpeg,['-v','error','-f','lavfi','-i','color=blue:size=192x128:rate=24:duration=4','-f','lavfi','-i','sine=frequency=440:sample_rate=48000:duration=4','-c:v','libx264','-threads','2','-c:a','aac','-metadata','prompt=RAIN CAFE ORIGINAL','-movflags','+use_metadata_tags','-shortest',source]);
 await runVideoTool(ffmpeg,['-v','error','-f','lavfi','-i','color=red:size=192x128,format=rgba','-frames:v','1','-threads','1',png]);
 const data='data:image/png;base64,'+(await readFile(png)).toString('base64'),service=createVideoWorkshopService({root:join(root,'workspace'),ffmpeg});await service.ready();const a=await service.ingest(Readable.from([await readFile(source)]),'source.mp4');let p=C.add(C.fresh(),a),b=B.text('Rasterized café title');b.start=1;b.end=3;b.fadeIn=.5;b.fadeOut=.5;p.branding=[b];const frames=[{id:b.id,width:192,height:128,data}];
 assert.equal(validateBrandFrames(p,frames).length,1);assert.throws(()=>validateBrandFrames(p,[]));assert.throws(()=>validateBrandFrames(p,[{...frames[0],width:190}]));await assert.rejects(()=>service.start(p),/branding/i);p.output.mode='copy';await assert.rejects(()=>service.start(p,false,frames),/Picture-preserving/);p.output.mode='wav';await assert.rejects(()=>service.start(p,false,frames),/edited video/);p.output.mode='render';
 const done=async(short=false)=>{let job=await service.start(p,short,frames);for(let i=0;i<1500&&job.state==='running';i++){await sleep(10);job=service.status(job.id);}assert.equal(job.state,'done',job.error);return job;},job=await done(),output=join(root,'workspace/jobs',job.id,'result.mp4');assert.equal(job.result.width,192);assert.equal(job.result.height,128);assert.equal(job.result.fps,24);assert.equal(job.result.audio,true);assert.ok(Math.abs(job.result.duration-4)<.1);
 const level=async(time)=>{const r=await runVideoTool(ffmpeg,['-v','error','-ss',String(time),'-i',output,'-frames:v','1','-vf','signalstats,metadata=print:file=-','-f','null','-']);return Number(/YAVG=([\d.]+)/.exec(r.out)[1]);};
 const blue=await level(.3),red=await level(2),fading=await level(1.25),after=await level(3.5);assert.ok(red>blue+20);assert.ok(fading>blue+5&&fading<red-5);assert.ok(Math.abs(after-blue)<3);
 const meta=await runVideoTool(ffmpeg,['-v','error','-i',output,'-f','ffmetadata','-']);assert.match(meta.out,/prompt=RAIN CAFE ORIGINAL/);assert.match(meta.out,/prompt_studio_processing=Video branding applied/);const audit=JSON.parse(await readFile(join(root,'workspace/jobs',job.id,'export.json')));assert.equal(audit.project.branding[0].layer.words,b.layer.words);
 assert.ok(!(await readdir(join(root,'workspace/jobs',job.id))).some(n=>/^brand-|^part-|^assembly/.test(n)));const preview=await done(true);assert.equal(preview.preview,true);assert.equal(preview.result.audio,true);
 const multi=C.clone(p);multi.clips[0].in=.5;multi.clips[0].out=2.5;multi.clips.push({...multi.clips[0],id:randomUUID()});p=multi;const joined=await done();assert.equal(joined.result.fps,24);assert.ok(Math.abs(joined.result.duration-4)<.1);
 const later=B.text('Only later');later.start=3.8;later.end=0;p.branding.push(later);await assert.rejects(()=>service.start(p,false,frames),/branding/i);
 console.log('Branding video test output:',output);
});
