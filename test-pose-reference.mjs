import {test} from 'node:test';
import assert from 'node:assert/strict';
import {attachPoseReference,poseReferenceBox,normalizePoseReferenceLayer,poseReferenceLabels,poseReferenceMaxBytes} from './dist/pose-reference-ui.mjs';
import {environment,memory} from './pose-test-dom.mjs';
const url='data:image/png;base64,AA==',other='data:image/png;base64,AQ==',file=(dataURL=url)=>({name:'Reference.png',type:'image/png',size:25,dataURL}),defer=()=>{let resolve;const promise=new Promise(fn=>resolve=fn);return {promise,resolve};};
function setup(options={}){const env=environment(memory());let changes=0,ready=0;const ui=attachPoseReference({host:env.doc.body,readFile:async f=>f.dataURL,prepare:async dataURL=>({dataURL,width:1000,height:500}),onChange:()=>changes++,onReady:()=>ready++,...options});return {...env,ui,changes:()=>changes,ready:()=>ready};}
const field=(doc,key)=>doc.body.querySelector('[data-pose-reference="'+key+'"]');
test('reference fit and navigation preserve the same image-to-pose alignment',()=>{
 const image={width:1000,height:500},frame={cx:0,cy:1,scale:200},a=poseReferenceBox(image,{}, {frame,transform:{cx:0,cy:1,scale:200}});assert.equal(a.width,700);assert.equal(a.height,350);assert.equal(a.cx,380);assert.equal(a.cy,250);
 const b=poseReferenceBox(image,{}, {frame,transform:{cx:.4,cy:1.2,scale:400}});assert.equal(b.width,a.width*2);assert.equal(b.cx,220);assert.ok(Math.abs(b.cy-330)<1e-9);
 // A point at x=.5 in the editing plane occupies the same image fraction after pan/zoom.
 const firstPoint=380+.5*200,secondPoint=380+(.5-.4)*400;assert.ok(Math.abs((firstPoint-a.x)/a.width-(secondPoint-b.x)/b.width)<1e-9);
 const shifted=poseReferenceBox(image,{offsetX:10,offsetY:-20,scale:50,rotation:30,opacity:25},{frame,transform:{cx:0,cy:1,scale:200}});assert.equal(shifted.cx,456);assert.equal(shifted.cy,150);assert.equal(shifted.width,350);assert.equal(shifted.rotation,30);assert.equal(shifted.opacity,.25);
 const camera=poseReferenceBox(image,{}, {camera:{x:100,y:50,width:300,height:400}});assert.equal(camera.width,300);assert.equal(camera.height,150);assert.equal(camera.cx,250);assert.deepEqual(camera.clip,{x:100,y:50,width:300,height:400});
});
test('reference controls change only the private overlay and removal does not write browser storage',async()=>{
 const {doc,ui,ready}=setup();assert.equal(await ui.loadFile(file()),true);assert.equal(ready(),1);field(doc,'opacity').value='31';await field(doc,'opacity').emit('input');field(doc,'offsetX').value='12.5';await field(doc,'offsetX').emit('change');field(doc,'rotation').value='17';await field(doc,'rotation').emit('change');assert.deepEqual(ui.getConfig(),normalizePoseReferenceLayer({opacity:31,offsetX:12.5,rotation:17}));field(doc,'move').checked=true;await field(doc,'move').emit('change');assert.equal(ui.isMoveMode(),true);
 const svg=doc.createElementNS('', 'svg'),box=ui.draw(svg,{frame:{scale:200,cx:0,cy:1},transform:{scale:200,cx:0,cy:1}});assert.equal(svg.querySelector('image').attributes.opacity,'0.31');ui.moveBy(ui.getConfig(),76,50,box);assert.equal(ui.getConfig().offsetX,22.5);assert.equal(ui.getConfig().offsetY,10);assert.equal(localStorage.getItem('artoftomworks.promptStudio.virtualStudio.v1'),null);
 const snapshot=ui.getSnapshot();assert.equal(snapshot.dataURL,url);assert.equal(snapshot.name,'Reference.png');ui.clear();assert.equal(ui.isLoaded(),false);assert.equal(ui.getSnapshot(),null);assert.equal(await ui.restore(snapshot),true);assert.equal(ui.getConfig().offsetX,22.5);
});
test('file picker and drop reject unsupported/oversized files while retaining the previous image',async()=>{
 let reads=0;const {doc,ui}=setup({readFile:async f=>{reads++;return f.dataURL;}});await ui.loadFile(file());for(const candidate of [{...file(),type:'image/svg+xml'},{...file(),type:'application/json'},{...file(),size:poseReferenceMaxBytes+1}])assert.equal(await ui.loadFile(candidate),false);assert.equal(reads,1);assert.equal(ui.getSnapshot().dataURL,url);
 const drop=doc.body.querySelector('.pose-reference-drop');let prevented=false;await drop.emit('drop',{preventDefault(){prevented=true;},dataTransfer:{files:[file(other)]}});assert.equal(prevented,true);assert.equal(ui.getSnapshot().dataURL,other);
 const input=field(doc,'file');input.files=[file()];await input.emit('change');assert.equal(ui.getSnapshot().dataURL,url);assert.equal(input.value,'');assert.equal(await ui.restore({dataURL:'https://example.com/private.png'}),false);assert.equal(ui.getSnapshot().dataURL,url);
});
test('late image decodes cannot replace a newer reference or reappear after removal',async()=>{
 const pending=new Map(),closed=[];const {ui}=setup({prepare:dataURL=>{const d=defer();pending.set(dataURL,d);return d.promise;}});
 const a=ui.loadFile(file());await Promise.resolve();const b=ui.loadFile(file(other));await Promise.resolve();pending.get(other).resolve({dataURL:other,width:300,height:400,resource:{close:()=>closed.push('b')}});assert.equal(await b,true);pending.get(url).resolve({dataURL:url,width:100,height:100,resource:{close:()=>closed.push('a')}});assert.equal(await a,false);assert.equal(ui.getSnapshot().dataURL,other);assert.deepEqual(closed,['a']);
 const c=ui.loadFile(file());await Promise.resolve();ui.clear();pending.get(url).resolve({dataURL:url,width:100,height:100,resource:{close:()=>closed.push('c')}});await c;assert.equal(ui.isLoaded(),false);assert.deepEqual(closed,['a','b','c']);
});
test('camera reference is clipped and labels/settings are complete in eight languages',async()=>{
 let language='EN';const {ui,doc}=setup({getLanguage:()=>language});await ui.loadFile(file());const svg=doc.createElementNS('', 'svg');ui.draw(svg,{camera:{x:40,y:50,width:200,height:350}});assert.ok(svg.querySelector('clipPath'));assert.match(svg.querySelector('[data-pose-reference-layer="true"]').attributes['clip-path'],/^url\(#pose-ref-/);assert.equal(svg.querySelector('image').attributes.href,url);
 for(const code of ['EN','HU','DE','FR','ES','IT','PT','PL']){language=code;ui.refresh();const labels=poseReferenceLabels(code);assert.ok(Object.values(labels).every(v=>v&&typeof v==='string'));assert.equal(doc.body.querySelector('summary').textContent,labels.title);assert.equal(field(doc,'opacity').attributes['aria-label'],labels.opacity);}
 assert.deepEqual(normalizePoseReferenceLayer({scale:999,offsetX:-999,opacity:NaN}),{opacity:50,scale:400,offsetX:-200,offsetY:0,rotation:0,visible:true});
});
test('the default file-reading pipeline downsizes large previews before keeping the reference',async()=>{
 const {doc}=environment(memory()),create=doc.createElement,oldImage=globalThis.Image,oldReader=globalThis.FileReader;let draws=0;
 globalThis.FileReader=class{readAsDataURL(file){this.result=file.dataURL;queueMicrotask(()=>this.onload?.());}};
 globalThis.Image=class{set src(value){this.naturalWidth=value===url?4000:2048;this.naturalHeight=value===url?2000:1024;queueMicrotask(()=>this.onload?.());}};
 doc.createElement=tag=>{const n=create(tag);if(tag==='canvas'){n.getContext=()=>({drawImage(_image,_x,_y,w,h){draws++;assert.equal(w,2048);assert.equal(h,1024);}});n.toDataURL=()=> 'data:image/webp;base64,Ag==';}return n;};
 try{const ui=attachPoseReference({host:doc.body});assert.equal(await ui.loadFile(file()),true);assert.equal(draws,1);assert.equal(ui.getSnapshot().width,2048);assert.equal(ui.getSnapshot().height,1024);assert.match(ui.getSnapshot().dataURL,/^data:image\/webp/);}finally{globalThis.Image=oldImage;globalThis.FileReader=oldReader;}
});
