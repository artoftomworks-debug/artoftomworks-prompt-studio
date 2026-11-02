import assert from 'node:assert/strict';
import {test} from 'node:test';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {imageWorkshopCore,imageWorkshopRenderer} from './dist/image-workshop.mjs';
import {imageWorkshopApp,imageWorkshopLabels,imageWorkshopPage,attachImageWorkshop} from './dist/image-workshop-ui.mjs';
import {StudioNode} from './series-test-dom.mjs';
const C=imageWorkshopCore(),languages=['EN','HU','DE','FR','ES','IT','PT','PL'];
const img=(name='test.png',bytes='image bytes')=>new File([bytes],name,{type:'image/png'});
const asset={id:'source',name:'reference.png',hash:'a'.repeat(64),width:2400,height:1600};
function project(){const p=C.fresh();p.assets=[asset];p.source=asset.id;return p;}

test('project validation retains only bounded edits and required image fingerprints, with strict mask limits',()=>{
 const p=project();p.layers[0].tone={exposure:99,contrast:-200,saturation:999};p.layers[0].mask={all:false,feather:500,strokes:[{kind:'rect',points:[[-1,2],[.5,.6]],size:99}]};p.hiddenSecret='not persisted';p.assets[0].path='C:/private/image.png';const n=C.normalize(p);assert.equal(n.layers[0].tone.exposure,3);assert.equal(n.layers[0].tone.saturation,200);assert.equal(n.layers[0].mask.feather,40);assert.deepEqual(n.layers[0].mask.strokes[0].points[0],[0,1]);assert.doesNotMatch(JSON.stringify(n),/private|hiddenSecret|data:image|blob:/);
 assert.throws(()=>C.normalize({...p,version:999}));assert.throws(()=>C.normalize({...p,source:'absent'}));assert.throws(()=>C.normalize({...p,layers:[p.layers[0],p.layers[0]]}));const bad=C.clone(p);bad.layers[0].mask.strokes[0].points=[[NaN,0]];assert.throws(()=>C.normalize(bad));
});
test('preview is bounded but original dimensions remain available; oversized and malformed media are rejected',()=>{
 assert.deepEqual(C.previewSize(2400,1600),{width:1600,height:1067});assert.deepEqual(C.previewSize(800,400),{width:800,height:400});assert.throws(()=>C.previewSize(10000,10000));assert.throws(()=>C.previewSize(0,200));assert.throws(()=>C.previewSize(2.5,10));
});
test('tone math is neutral by default, preserves alpha and applies predictable exposure, saturation and warmth',()=>{
 const data=new Uint8ClampedArray([50,100,150,101,10,20,30,0]);assert.deepEqual(C.toneBuffer(data.slice(),C.tone()),data);const exposure=C.toneBuffer(data.slice(),C.tone({exposure:1}));assert.deepEqual([...exposure.slice(0,4)],[100,200,255,101]);const grey=C.toneBuffer(data.slice(),C.tone({saturation:0}));assert.equal(grey[0],grey[1]);assert.equal(grey[1],grey[2]);assert.equal(grey[3],101);const warm=C.pixel(100,100,100,C.tone({warmth:60}));assert.ok(warm[0]>100&&warm[2]<100);
 for(const key of C.toneKeys){const t=C.tone({[key]:key==='saturation'?140:20}),buf=new Uint8ClampedArray([70,140,210,255]),expected=new Uint8ClampedArray([...C.pixel(70,140,210,t),255]);assert.deepEqual(C.toneBuffer(buf,t),expected);}
});
test('history commits gestures once, supports branch edits and restores masks and manual drafts',()=>{
 const p=project(),h=C.history(p),before=h.get(),n=h.get();n.layers[0].tone.contrast=25;h.preview(n);n.layers[0].tone.contrast=50;h.preview(n);h.commit(n,before);assert.equal(h.undo().layers[0].tone.contrast,0);assert.equal(h.redo().layers[0].tone.contrast,50);h.undo();const b=h.get();b.draft='Manually refined prompt';h.commit(b);assert.equal(h.canRedo(),false);assert.equal(h.get().draft,'Manually refined prompt');h.undo();assert.equal(h.get().draft,null);
});
test('generated direction and AI brief distinguish intent, creator feedback, local masks and actual model training',()=>{
 const p=project();p.scene='A quiet cafe';p.goal='Warmer and softer';p.notes='The highlights were too harsh';p.layers[0].tone.highlights=-35;p.layers[0].tone.warmth=20;const l=C.layer('light','Rim');l.x=.1;l.opacity=20;l.mask.all=false;p.layers.push(l);assert.match(C.prompt(p),/A quiet cafe/);assert.match(C.prompt(p),/restrained highlights/);assert.match(C.prompt(p),/manually selected region/);assert.match(C.aiBrief(p),/not exact generator parameters/);assert.match(C.aiBrief(p),/too harsh/);const f=C.feedback(p);assert.equal(f.notes,p.notes);assert.ok(!('assets' in f));p.draft='Hand-edited';assert.equal(C.prompt(p),'Hand-edited');
});

class Node extends StudioNode{
 constructor(tag){super(tag);this.width=300;this.height=150;this.clientWidth=900;this.clientHeight=600;this.scrollLeft=0;this.scrollTop=0;this.log=[];}
 before(n){const p=this.parentElement;n.remove();n.parentElement=p;p.children.splice(p.children.indexOf(this),0,n);}
 select(){this.selectedText=true;}
 getContext(){const log=this.log;return this.ctx??={setTransform(){},clearRect(){},translate(){},rotate(){},beginPath(){},moveTo(){},lineTo(){},arc:(...v)=>log.push(['arc',...v]),ellipse:(...v)=>log.push(['ellipse',...v]),stroke:()=>log.push(['stroke']),fill:()=>log.push(['fill']),fillRect:(...v)=>log.push(['fillRect',...v]),drawImage:(...v)=>log.push(['draw',...v]),getImageData:()=>({data:new Uint8ClampedArray([40,90,140,255])}),putImageData:v=>log.push(['pixels',...v.data]),measureText:s=>({width:s.length*12}),fillText:(...v)=>log.push(['text',...v]),strokeText:(...v)=>log.push(['textStroke',...v]),save(){},restore(){},rect:(...v)=>log.push(['rect',...v]),clip:()=>log.push(['clip']),createRadialGradient:()=>({addColorStop(){}})};}
 toDataURL(){return 'data:image/png;base64,aW1hZ2U=';}
 toBlob(fn,type){fn(new Blob([JSON.stringify({width:this.width,height:this.height})],{type}));}
}
function env({data=new Map(),renderer=imageWorkshopRenderer,appOptions={}}={}){
 const body=new Node('body'),events={},frames=[],urls=new Map(),downloads=[],opened=[];let copied='',closed=0;
 const doc={body,documentElement:{},createElement(tag){const n=new Node(tag);if(tag==='a')n.click=()=>downloads.push({name:n.download,blob:urls.get(n.href)});return n;},createTextNode:s=>new Node('#text'),getElementById:id=>body.all().find(n=>n.id===id),addEventListener:(k,fn)=>events['doc:'+k]=fn};
 globalThis.document=doc;globalThis.window={addEventListener:(k,fn)=>events[k]=fn,open:(url)=>{opened.push(urls.get(url));return {};}};globalThis.localStorage={getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v)};globalThis.confirm=()=>true;globalThis.requestAnimationFrame=fn=>{frames.push(fn);return frames.length;};Object.defineProperty(globalThis,'navigator',{configurable:true,value:{clipboard:{writeText:async s=>copied=s}}});globalThis.createImageBitmap=async f=>{if(f.name==='bad.png')throw Error();return {width:2400,height:1600,close:()=>closed++};};URL.createObjectURL=b=>{const u='blob:test-'+Math.random();urls.set(u,b);return u;};URL.revokeObjectURL=()=>{};
 const ui=imageWorkshopApp('HU',imageWorkshopCore,renderer,imageWorkshopLabels,appOptions);
 return {ui,body,events,data,downloads,opened,get copied(){return copied;},get closed(){return closed;},flush(){while(frames.length)frames.shift()();}};
}
const action=(e,k)=>e.body.querySelector('[data-iw-action="'+k+'"]');
const field=(e,k)=>e.body.querySelector('[data-iw-field="'+k+'"]');

test('six localised sample layouts are editable branding-only text layers with conservative portrait sizing',()=>{
 for(const lang of languages){const t=imageWorkshopLabels(lang),wide=C.brandSamples(t,{width:1920,height:1080}),portrait=C.brandSamples(t,{width:768,height:1344});assert.equal(wide.length,6);assert.equal(new Set(wide.map(s=>s.id)).size,6);
  for(const sample of wide){assert.ok(sample.name);assert.ok(sample.layers.length>=1&&sample.layers.length<=3);for(const l of sample.layers){assert.equal(l.kind,'text');assert.equal(l.branding,true);assert.equal(l.mask.all,true);assert.equal(l.asset,'');assert.ok(l.words.length>0);assert.ok(l.x>0&&l.x<1&&l.y>0&&l.y<1);}}
  assert.ok(portrait.find(s=>s.id==='cinema').layers[0].fontSize<=wide.find(s=>s.id==='cinema').layers[0].fontSize);
  assert.equal(wide.find(s=>s.id==='preview').layers[0].repeat,true);assert.match(wide.find(s=>s.id==='quote').layers[0].words,/\n/);
 }
});

test('sample replacement or append preserves original photo, tones and manual direction and is reversible',()=>{
 const p=project(),watermark=C.layer('text');watermark.words='Existing mark';p.layers.push(watermark);p.scene='My scene';p.goal='My goal';p.draft='My manual prompt';p.layers[0].tone.warmth=12;const before=C.clone(p),next=C.applyBrandSample(p,'advert',imageWorkshopLabels('HU'));
 assert.deepEqual(p,before);assert.equal(next.source,p.source);assert.equal(next.layers[0].tone.warmth,12);assert.equal(next.draft,p.draft);assert.equal(next.goal,p.goal);assert.equal(next.layers.filter(l=>l.branding).length,3);assert.ok(!next.layers.some(l=>l.words==='Existing mark'));
 const appended=C.applyBrandSample(p,'advert',imageWorkshopLabels(),{replace:false});assert.equal(appended.layers.filter(l=>l.branding).length,4);const h=C.history(p);h.commit(next);assert.deepEqual(h.undo(),C.normalize(p));
 const full=project();full.layers=Array.from({length:16},()=>C.layer('tone'));const copy=C.clone(full);assert.throws(()=>C.applyBrandSample(full,'advert',{}));assert.deepEqual(full,copy);assert.throws(()=>C.applyBrandSample(p,'unknown',{}));assert.throws(()=>C.applyBrandSample(C.fresh(),'signature',{}));
});

test('sample cards preview source dimensions, apply on click, select the main text and save as a custom brand',async()=>{
 const e=env(),cards=()=>e.body.all().filter(n=>n.dataset?.iwSample);assert.equal(cards().length,6);assert.ok(cards().every(c=>c.disabled));assert.ok(cards().every(c=>c.children[0].width===300));
 await e.ui.loadFiles([img()],'source');e.flush();assert.equal(cards().length,6);assert.ok(cards().every(c=>!c.disabled));assert.ok(cards().every(c=>c.children[0].width===270&&c.children[0].height===180));
 const before=e.ui.getState();await cards().find(c=>c.dataset.iwSample==='cinema').emit('click');e.flush();assert.equal(e.ui.getState().source,before.source);assert.equal(field(e,'words').value,imageWorkshopLabels('HU').sampleStory);assert.equal(field(e,'brandName').value,imageWorkshopLabels('HU').sampleCinema);
 await action(e,'undo').emit('click');assert.deepEqual(e.ui.getState(),before);await action(e,'redo').emit('click');field(e,'brandName').value='My cinematic brand';await action(e,'saveBrand').emit('click');assert.equal(C.readBrandShelf(localStorage).value.brands.at(-1).name,'My cinematic brand');
 const replace=field(e,'replaceBrand');replace.checked=false;await cards().find(c=>c.dataset.iwSample==='signature').emit('click');assert.equal(e.ui.getState().layers.filter(l=>l.branding).length,3);
});

test('branding text is editable, draggable and undoable while prompt generation and tone recipes stay separate',async()=>{
 const e=env();await e.ui.loadFiles([img()],'source');e.flush();const original=e.ui.getState().source;
 await action(e,'text').emit('click');let text=field(e,'words');text.value='© ArtofTomworks\nRain collection';await text.emit('input');await text.emit('change');e.flush();
 let layer=e.ui.getState().layers.at(-1);assert.equal(layer.kind,'text');assert.equal(layer.words,text.value);assert.equal(C.prompt(e.ui.getState()),'');
 const surface=e.body.querySelector('.iw-surface'),handle=e.body.querySelector('.iw-light-point'),canvas=surface.children[0],before=e.ui.getState();assert.equal(handle.hidden,false);
 await handle.emit('pointerdown',{target:handle,stopPropagation(){},button:0,pointerId:22,clientX:40,clientY:40});await surface.emit('pointermove',{clientX:100,clientY:100});await surface.emit('pointerup');assert.notEqual(e.ui.getState().layers.at(-1).x,before.layers.at(-1).x);await action(e,'undo').emit('click');assert.equal(e.ui.getState().layers.at(-1).x,before.layers.at(-1).x);
 await action(e,'project').emit('click');assert.match(await e.downloads.at(-1).blob.text(),/ArtofTomworks/);assert.equal(e.ui.getState().source,original);
 const look=C.captureLook(e.ui.getState(),'Only tones');assert.ok(look.layers.every(l=>l.kind!=='text'));assert.ok(C.applyLook(e.ui.getState(),look).layers.some(l=>l.kind==='text'));
});

test('branding shelf stores only logo/text, applies atomically to another source and checks stale writes',async()=>{
 const e=env();await e.ui.loadFiles([img()],'source');await e.ui.loadFiles([img('my-logo.png','logo bytes')],'logo');e.flush();assert.equal(e.ui.getState().layers.at(-1).branding,true);
 await action(e,'text').emit('click');let words=field(e,'words');words.value='Prophetero';await words.emit('input');await words.emit('change');field(e,'brandName').value='Prophetero';await action(e,'saveBrand').emit('click');
 const raw=e.data.get(C.brandShelfKey);assert.ok(raw);assert.doesNotMatch(raw,/reference.png|test.png|source|hash/);assert.equal(C.readBrandShelf(localStorage).value.brands[0].layers.length,2);
 await e.ui.loadFiles([img('second.png','second source')],'source');await action(e,'applyBrand').emit('click');e.flush();assert.equal(e.ui.getState().layers.filter(l=>l.branding).length,2);assert.equal(e.ui.getState().assets.length,2);assert.ok(e.ui.getState().layers.some(l=>l.words==='Prophetero'));
 await action(e,'undo').emit('click');assert.equal(e.ui.getState().layers.filter(l=>l.branding).length,0);await action(e,'redo').emit('click');assert.equal(e.ui.getState().layers.filter(l=>l.branding).length,2);
 const saved=C.readBrandShelf(localStorage);assert.throws(()=>C.writeBrandShelf(localStorage,null,saved.value));assert.equal(e.data.get(C.brandShelfKey),saved.raw);
});

test('batch branding exports one ZIP without changing project and aborts cleanly on invalid input or cancellation',async()=>{
 const e=env();await e.ui.loadFiles([img()],'source');await action(e,'text').emit('click');const before=e.ui.getState();
 await e.ui.batchBrand([img('one.png'),img('two.png')]);assert.equal(e.downloads.at(-1).name,'Prompt-Studio-branded-images.zip');assert.deepEqual(e.ui.getState(),before);let bytes=new Uint8Array(await e.downloads.at(-1).blob.arrayBuffer());assert.deepEqual([...bytes.slice(0,4)],[80,75,3,4]);
 const count=e.downloads.length;await e.ui.batchBrand([img('bad.png')]);assert.equal(e.downloads.length,count);assert.deepEqual(e.ui.getState(),before);
 const pending=e.ui.batchBrand([img('three.png'),img('four.png')]);await action(e,'cancelBatch').emit('click');await pending;assert.equal(e.downloads.length,count);assert.deepEqual(e.ui.getState(),before);
 await e.ui.batchBrand(Array.from({length:21},()=>img()));assert.equal(e.downloads.length,count);
});

test('branding validation limits text, assets and shelf sizes and uses fixed local fonts',()=>{
 const l=C.layer('text');l.words='Hello';l.font='url(https://bad.example)';l.ink='javascript:bad';const p=project();p.layers.push(l);const n=C.normalize(p);assert.equal(n.layers.at(-1).font,'sans');assert.equal(n.layers.at(-1).ink,'#ffffff');assert.throws(()=>C.brandFields({words:'a\n'.repeat(13)}));
 const b={id:'b',name:'Brand',layers:[C.layer('text')],logos:[]};assert.throws(()=>C.normalizeBrandShelf({version:1,brands:[b,b]}));assert.throws(()=>C.normalizeBrandShelf({version:1,brands:[{...b,logos:[{id:'a',data:'https://evil.example/logo.png'}]}]}));
 const s=C.snapBrand({...C.layer('text'),margin:.05},'tl');assert.equal(s.x,.05);assert.equal(s.y,.05);C.snapBrand(s,'br');assert.equal(s.x,.95);assert.equal(s.y,.95);
 for(const name of ['../bad','bad\\name','C:bad','..','.'])assert.throws(()=>C.zipFiles([{name,data:new Uint8Array([1])}]));
 assert.throws(()=>C.zipFiles([{name:'same.png',data:new Uint8Array([1])},{name:'same.png',data:new Uint8Array([2])}]));
});

test('a saved-project logo originating in a branding profile can be reattached by its exact stored fingerprint',async()=>{
 const e=env();await e.ui.loadFiles([img()],'source');await e.ui.loadFiles([img('logo.png','logo bytes')],'logo');field(e,'brandName').value='Logo brand';await action(e,'saveBrand').emit('click');
 const source=img('new.png','new source');await e.ui.loadFiles([source],'source');await action(e,'applyBrand').emit('click');const plan=e.ui.getState();await e.ui.replaceProject(plan);
 await e.ui.loadFiles([source],'attach');e.flush();assert.equal(action(e,'export').disabled,false);
});

test('renderer paints branding at preview and original scale with matching anchor, alpha and bounded tiling',()=>{
 const p=project(),l=C.layer('text');l.words='Hello';l.fontSize=.04;l.plate=true;l.shadow=true;p.layers.push(l);const nodes=[];const r=imageWorkshopRenderer(()=>{const n=new Node('canvas');nodes.push(n);return n;},C),canvas=new Node('canvas'),assets=new Map([[asset.id,{width:2400,height:1600}]]);
 r.render(canvas,p,assets);assert.ok(nodes[0].log.some(v=>v[0]==='text'&&v[1]==='Hello'));const box1=r.drawBrand(nodes[0].getContext(),l,1200,800,null),box2=r.drawBrand(nodes[0].getContext(),l,2400,1600,null);assert.equal(box2.height,box1.height*2);
 l.repeat=true;nodes[0].log.length=0;r.drawBrand(nodes[0].getContext(),l,16000,1,null);assert.ok(nodes[0].log.filter(v=>v[0]==='text').length<=512);
 r.render(canvas,p,assets,{full:true});assert.equal(canvas.width,2400);assert.equal(canvas.height,1600);
});
test('real editor handlers load an image, update a slider repeatedly, undo/redo, and keep a cancelled mask gesture out of history',async()=>{
 const e=env();await e.ui.loadFiles([img()],'source');e.flush();assert.equal(e.ui.getState().assets.length,1);let range=field(e,'contrast');for(const v of ['10','25','42']){range.value=v;await range.emit('input');}await range.emit('change');assert.equal(e.ui.getState().layers[0].tone.contrast,42);await action(e,'undo').emit('click');assert.equal(e.ui.getState().layers[0].tone.contrast,0);await action(e,'redo').emit('click');assert.equal(e.ui.getState().layers[0].tone.contrast,42);
 await action(e,'clear').emit('click');e.flush();const surface=e.body.querySelector('.iw-surface'),canvas=surface.querySelector('canvas'),before=e.ui.getState();await surface.emit('pointerdown',{target:canvas,button:0,pointerId:1,clientX:100,clientY:80});await surface.emit('pointermove',{clientX:250,clientY:150});assert.equal(e.ui.getState().layers[0].mask.strokes.length,1);await surface.emit('pointercancel');assert.deepEqual(e.ui.getState(),before);await surface.emit('pointerdown',{target:canvas,button:0,pointerId:2,clientX:100,clientY:80});await surface.emit('pointermove',{clientX:250,clientY:150});await surface.emit('pointerup');assert.equal(e.ui.getState().layers[0].mask.strokes.length,1);await action(e,'undo').emit('click');assert.equal(e.ui.getState().layers[0].mask.strokes.length,0);
});
test('divider compares aligned images in either direction, has keyboard access, and never changes exported editing state',async()=>{
 const e=env();await e.ui.loadFiles([img()],'source');e.flush();const before=e.ui.getState(),c=field(e,'compare');c.checked=true;await c.emit('change');e.flush();const line=e.body.querySelector('.iw-divider'),surface=e.body.querySelector('.iw-surface');await line.emit('pointerdown',{button:0,pointerId:1,clientX:480,clientY:80,stopPropagation(){}});await surface.emit('pointerup');e.flush();assert.equal(line.style.left,'80%');assert.deepEqual(e.ui.getState(),before);const select=e.body.querySelector('.iw-toolbar').querySelector('select');select.value='horizontal';await select.emit('change');const handle=line.querySelector('button');await handle.emit('keydown',{key:'Home'});e.flush();assert.equal(line.style.top,'0%');assert.equal(handle.attributes['aria-valuenow'],'0');assert.ok(surface.querySelector('canvas').log.some(x=>x[0]==='clip'));
});
test('layer position and wheel edits are reversible; browser zoom and non-light scrolling are not intercepted',async()=>{
 const e=env();await e.ui.loadFiles([img()],'source');await action(e,'light').emit('click');e.flush();const surface=e.body.querySelector('.iw-surface'),marker=e.body.querySelector('.iw-light-point'),view=e.body.querySelector('.iw-viewport');await marker.emit('pointerdown',{button:0,pointerId:1,clientX:300,clientY:180,stopPropagation(){}});await surface.emit('pointermove',{clientX:420,clientY:90});await surface.emit('pointerup');assert.ok(e.ui.getState().layers.at(-1).x>.5);let prevented=false;await view.emit('wheel',{deltaY:-10,ctrlKey:true,preventDefault(){prevented=true;}});assert.equal(prevented,false);await view.emit('wheel',{deltaY:-10,preventDefault(){prevented=true;}});assert.equal(prevented,true);assert.equal(e.ui.getState().layers.at(-1).opacity,47);await action(e,'undo').emit('click');assert.equal(e.ui.getState().layers.at(-1).opacity,45);const color=e.ui.getState().layers.at(-1).color;await view.emit('wheel',{deltaY:-10,shiftKey:true});assert.notEqual(e.ui.getState().layers.at(-1).color,color);await action(e,'undo').emit('click');
});
test('invalid sources retain work; projects persist manual prompts without image bytes and require matching images to export',async()=>{
 const e=env();await e.ui.loadFiles([img()],'source');const original=e.ui.getState();await e.ui.loadFiles([img('bad.png')],'source');assert.deepEqual(e.ui.getState(),original);const direction=e.body.querySelector('textarea[aria-label]')||e.body.querySelectorAll('textarea').at(-1);const boxes=e.body.querySelectorAll('textarea'),prompt=boxes.at(-1);prompt.value='A carefully hand-edited prompt';await prompt.emit('input');await prompt.emit('change');await action(e,'project').emit('click');const saved=JSON.parse(await e.downloads.at(-1).blob.text());assert.equal(saved.draft,'A carefully hand-edited prompt');assert.doesNotMatch(JSON.stringify(saved),/image bytes|data:image|blob:/);e.ui.replaceProject(saved);e.flush();assert.equal(action(e,'export').disabled,true);assert.equal(e.closed,1);await e.ui.loadFiles([img('same-name.png','wrong bytes')],'attach');e.flush();assert.equal(action(e,'export').disabled,true);await e.ui.loadFiles([img('renamed-file.png')],'attach');e.flush();assert.equal(action(e,'export').disabled,false);assert.equal(e.body.querySelectorAll('textarea').at(-1).value,saved.draft);await action(e,'export').emit('click');assert.equal(e.downloads.at(-1).name,'Prompt-Studio-edited.png');assert.deepEqual(JSON.parse(await e.downloads.at(-1).blob.text()),{width:2400,height:1600});
});
test('background composite retains correct source and masked replacement; deleting its layer removes unused asset requirements',async()=>{
 const e=env();await e.ui.loadFiles([img()],'source');const source=e.ui.getState().source;await e.ui.loadFiles([img('sky.png','sky bytes')],'image');assert.equal(e.ui.getState().layers.at(-1).kind,'image');await action(e,'clear').emit('click');e.flush();await action(e,'ellipse').emit('click');const surface=e.body.querySelector('.iw-surface');await surface.emit('pointerdown',{target:surface.querySelector('canvas'),button:0,pointerId:1,clientX:100,clientY:50});await surface.emit('pointermove',{clientX:450,clientY:200});await surface.emit('pointerup');assert.equal(e.ui.getState().layers.at(-1).mask.strokes[0].kind,'ellipse');assert.equal(e.ui.getState().source,source);await action(e,'remove').emit('click');assert.equal(e.ui.getState().assets.length,1);await action(e,'undo').emit('click');assert.equal(e.ui.getState().assets.length,2);e.flush();
});
test('eight languages, feedback privacy, independent tab bundle and full offline bundle contain valid executable code',async()=>{
 for(const lang of languages){const labels=imageWorkshopLabels(lang);assert.ok(Object.values(labels).every(x=>typeof x==='string'&&x.trim()));assert.equal(labels.title.includes('|'),false);const html=imageWorkshopPage(lang),script=html.match(/<script>([\s\S]*?)<\/script>/)[1];new vm.Script(script);assert.doesNotMatch(script,/\bfetch\s*\(/);}
 const e=env();field(e,'notes').value='Warmth worked; keep highlights softer';await field(e,'notes').emit('change');await action(e,'feedback').emit('click');const review=JSON.parse(e.data.get('artoftomworks.v2.imageWorkshop.feedback'))[0];assert.match(review.notes,/Warmth/);assert.doesNotMatch(JSON.stringify(review),/hash|source|assets/);await action(e,'brief').emit('click');assert.match(e.copied,/Warmth worked/);
 const html=readFileSync(new URL('./dist/ArtofTomworks_Prompt_Studio_OFFLINE.html',import.meta.url),'utf8'),scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];assert.equal(scripts.length,2,'only the theme script and Studio bundle may exist');const script=scripts.map(s=>s[1]).join('\n');assert.match(script,/attachImageWorkshop/);assert.doesNotMatch(script,/^import /m);new vm.Script(script);
});

test('reusable looks exclude masks, media, hidden layers and creator text; application is bounded and preserves scene and manual prompt',()=>{
 const p=project(),image=C.layer('image','Replacement sky');image.asset=asset.id;p.layers.push(image);p.layers[0].tone.warmth=28;p.layers[0].mask.all=false;p.layers[0].mask.strokes=[{kind:'brush',size:.1,points:[[.3,.3]]}];const hidden=C.layer('light','Hidden');hidden.visible=false;p.layers.push(hidden);p.scene='Keep this scene';p.draft='Keep this manually edited prompt';p.notes='Personal review';const recipe=C.captureLook(p,'My warm look');assert.equal(recipe.layers.length,1);assert.equal(recipe.layers[0].mask.all,true);assert.deepEqual(recipe.layers[0].mask.strokes,[]);assert.doesNotMatch(JSON.stringify(recipe),/reference.png|Replacement sky|Hidden|Keep this|Personal review|"hash"|"source"/);
 const applied=C.applyLook(p,recipe,{strength:25,replace:true});assert.equal(applied.layers[0].id,image.id);assert.equal(applied.layers.length,2);assert.equal(applied.layers[1].opacity,25);assert.equal(applied.scene,p.scene);assert.equal(applied.draft,p.draft);assert.equal(p.layers[0].mask.strokes.length,1,'original remains untouched');const h=C.history(p);h.commit(applied);assert.deepEqual(h.undo(),C.normalize(p));
 const many=C.fresh();many.layers=Array.from({length:16},()=>C.layer('tone'));assert.throws(()=>C.applyLook(many,recipe,{replace:false}));assert.equal(many.layers.length,16);assert.throws(()=>C.normalizeLook({...recipe,layers:[image]}));
});
test('brightness suggestion is conservative, transparent to empty pixels, and makes no semantic scene assumptions',()=>{
 const stats=C.imageStatistics(new Uint8ClampedArray([0,0,0,0,50,50,50,255,250,250,250,255]));assert.equal(stats.high,.5);assert.equal(stats.low,0);assert.ok(Math.abs(stats.mean-150/255)<.0001);const suggested=C.recommendedLook(stats);assert.ok(suggested.layers[0].tone.highlights<0);assert.ok(Math.abs(suggested.layers[0].tone.exposure)<=.65);assert.equal(suggested.layers.length,1);const dark=C.recommendedLook({mean:.08,low:.8,high:0});assert.ok(dark.layers[0].tone.exposure>0);assert.throws(()=>C.imageStatistics(new Uint8ClampedArray([10,10,10,0])));assert.throws(()=>C.recommendedLook({mean:NaN,low:0,high:0}));
 for(const recipe of C.builtinLooks()){assert.ok(recipe.layers.every(l=>['tone','light'].includes(l.kind)));assert.doesNotThrow(()=>C.applyLook(project(),recipe));}
});
test('recipe shelf rejects stale writes, damaged data, duplicate ids and excessive imports without erasing saved recipes',()=>{
 const data=new Map(),storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)},first=C.readShelf(storage),r=C.captureLook(project(),'First');const saved=C.writeShelf(storage,first.raw,{version:1,looks:[r]});assert.equal(C.readShelf(storage).value.looks[0].name,'First');assert.throws(()=>C.writeShelf(storage,first.raw,{version:1,looks:[]}));assert.equal(data.get(C.lookShelfKey),saved.raw);assert.throws(()=>C.normalizeShelf({version:1,looks:[r,r]}));const imported=C.importLooks(saved.value,saved.value);assert.equal(imported.looks.length,2);assert.notEqual(imported.looks[0].id,imported.looks[1].id);assert.throws(()=>C.importLooks({version:1,looks:Array.from({length:24},(_,i)=>({...r,id:'r-'+i}))},saved.value));
 storage.setItem=()=>{throw Error('full');};assert.throws(()=>C.writeShelf(storage,saved.raw,{version:1,looks:[]}));assert.equal(data.get(C.lookShelfKey),saved.raw);data.set(C.lookShelfKey,'broken JSON');assert.throws(()=>C.readShelf(storage));assert.equal(data.get(C.lookShelfKey),'broken JSON');
});
test('UI saves, exports, imports and restores recipes across editor tabs without altering source or typed prompt',async()=>{
 const e=env();await e.ui.loadFiles([img()],'source');let contrast=field(e,'contrast');contrast.value='35';await contrast.emit('input');await contrast.emit('change');const name=field(e,'lookName');name.value='Cafe look';await action(e,'saveLook').emit('click');const saved=JSON.parse(e.data.get(C.lookShelfKey));assert.equal(saved.looks.length,1);const source=e.ui.getState().source;
 const manual=e.body.querySelectorAll('textarea').at(-1);manual.value='A preserved manually edited prompt';await manual.emit('input');await manual.emit('change');const select=field(e,'lookSelect');select.value='builtin:portrait';await action(e,'applyLook').emit('click');assert.equal(e.ui.getState().layers.length,2);assert.equal(e.ui.getState().draft,manual.value);await action(e,'undo').emit('click');assert.equal(e.ui.getState().layers[0].tone.contrast,35);assert.equal(e.ui.getState().source,source);
 await action(e,'exportLooks').emit('click');assert.equal(e.downloads.at(-1).name,'Prompt-Studio-my-looks.json');const exported=await e.downloads.at(-1).blob.text();assert.doesNotMatch(exported,/"assets"|"hash"|manually edited/);const input=e.body.querySelector('[data-iw-import="looks"]');input.files=[new File([exported],'looks.json',{type:'application/json'})];await input.emit('change');assert.equal(JSON.parse(e.data.get(C.lookShelfKey)).looks.length,2);assert.equal(e.ui.getState().source,source);
 const e2=env({data:e.data});assert.equal(field(e2,'lookSelect').options.length,7);assert.equal(e2.ui.getState().source,'');assert.equal(JSON.parse(e2.data.get(C.lookShelfKey)).looks[0].name,'Cafe look');
});
test('suggestion, adjustable recipe amount, append mode, quick layer visibility and duplication all use undo history',async()=>{
 const e=env();await e.ui.loadFiles([img()],'source');await action(e,'suggested').emit('click');assert.notEqual(e.ui.getState().layers[0].tone.highlights,0);await action(e,'undo').emit('click');assert.equal(e.ui.getState().layers[0].tone.highlights,0);field(e,'lookStrength').value='30';await field(e,'lookStrength').emit('input');field(e,'lookSelect').value='builtin:night';field(e,'replaceLook').checked=false;await field(e,'replaceLook').emit('change');await action(e,'applyLook').emit('click');const p=e.ui.getState();assert.equal(p.layers.length,4);assert.equal(p.layers[1].opacity,30);const chosen=p.layers.at(-1).id,eye=e.body.querySelector('[data-iw-layer-visible="'+chosen+'"]');eye.checked=false;await eye.emit('change');assert.equal(e.ui.getState().layers.at(-1).visible,false);await action(e,'undo').emit('click');assert.equal(e.ui.getState().layers.at(-1).visible,true);await action(e,'duplicate').emit('click');assert.equal(e.ui.getState().layers.length,5);assert.notEqual(e.ui.getState().layers.at(-1).id,chosen);await action(e,'undo').emit('click');assert.equal(e.ui.getState().layers.length,4);
});
test('view-only comparison reuses computed pixels; the brush cursor tracks size without creating edits or image rerenders',async()=>{
 let calls=0;const e=env({renderer:(make,core)=>{const r=imageWorkshopRenderer(make,core);return {...r,render(...args){calls++;return r.render(...args);}};}});await e.ui.loadFiles([img()],'source');e.flush();const count=calls,before=e.ui.getState();const c=field(e,'compare');c.checked=true;await c.emit('change');e.flush();assert.equal(calls,count);const surface=e.body.querySelector('.iw-surface'),line=e.body.querySelector('.iw-divider');await line.emit('pointerdown',{button:0,pointerId:1,clientX:100,clientY:90,stopPropagation(){}});await surface.emit('pointermove',{clientX:350,clientY:180});await surface.emit('pointerup');e.flush();assert.equal(calls,count);c.checked=false;await c.emit('change');e.flush();await action(e,'brush').emit('click');await surface.emit('pointermove',{clientX:200,clientY:90});const cursor=e.body.querySelector('.iw-brush-cursor');assert.equal(cursor.hidden,false);assert.ok(Math.abs(parseFloat(cursor.style.width)-21.6)<.001);assert.deepEqual(e.ui.getState(),before);assert.equal(calls,count);
 e.events['doc:keydown']({key:']',preventDefault(){}});e.flush();assert.ok(parseFloat(cursor.style.width)>21.6);assert.equal(calls,count);e.events['doc:keydown']({key:'E',target:new Node('textarea'),preventDefault(){}});assert.equal(action(e,'brush').attributes['aria-pressed'],'true');await surface.emit('pointerleave');assert.equal(cursor.hidden,true);
});

// The linked editor shares the existing renderer and layer UI, and returns only on request.
test('video-linked image editor loads a frame, edits imported tones and returns the current editable plan on explicit click',async()=>{
 let returned;const e=env({appOptions:{onReturn:plan=>returned=plan}});await e.ui.loadFiles([img('Video-frame.png')],'source');const recipe=C.builtinLooks()[0];e.ui.applyRecipe(recipe);e.flush();assert.equal(returned,undefined);await action(e,'returnVideo').emit('click');assert.ok(returned.source);assert.deepEqual(returned.layers,e.ui.getState().layers);assert.ok(e.body.querySelector('.iw-help'));
});
