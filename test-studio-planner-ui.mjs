import assert from 'node:assert/strict';
import {test} from 'node:test';
import {attachVirtualStudio,studioLabels} from './dist/studio-planner-ui.mjs';
import {createStudioPlannerStore,studioPlannerKey} from './dist/studio-planner.mjs';
class StudioNode{
 constructor(tag){this.tagName=tag.toUpperCase();this.children=[];this.handlers={};this.dataset={};this.attributes={};this.style={};this.value='';this.textContent='';this.hidden=false;this.open=false;this.parentElement=null;this.className='';}
 append(...nodes){for(const n of nodes){n.remove();n.parentElement=this;this.children.push(n);}}appendChild(n){this.append(n);return n;}
 remove(){if(this.parentElement)this.parentElement.children=this.parentElement.children.filter(x=>x!==this);this.parentElement=null;}
 after(n){const p=this.parentElement;n.remove();n.parentElement=p;p.children.splice(p.children.indexOf(this)+1,0,n);}
 replaceChildren(...nodes){this.children.forEach(n=>n.parentElement=null);this.children=[];this.append(...nodes);}
 setAttribute(k,v){this.attributes[k]=String(v);if(k==='class')this.className=String(v);if(k==='id')this.id=String(v);if(k.startsWith('data-'))this.dataset[k.slice(5).replace(/-([a-z])/g,(_,s)=>s.toUpperCase())]=String(v);}
 addEventListener(k,fn){(this.handlers[k]??=[]).push(fn);}dispatchEvent(event){for(const fn of this.handlers[event.type]||[])fn(event);return true;}
 async emit(type,extra={}){const e={type,preventDefault(){},...extra};for(const fn of this.handlers[type]||[])await fn(e);}
 all(){return this.children.flatMap(n=>[n,...n.all()]);}
 matches(selector){if(selector.includes(','))return selector.split(',').some(s=>this.matches(s.trim()));if(selector.startsWith('#'))return this.id===selector.slice(1);if(selector.startsWith('.'))return this.className.split(' ').includes(selector.slice(1));if(selector.startsWith('[')){const m=selector.match(/^\[([\w-]+)(?:="([^"]*)")?\]$/);if(!m)return false;return m[1] in this.attributes&&(m[2]===undefined||this.attributes[m[1]]===m[2])||m[1].startsWith('data-')&&m[1].slice(5).replace(/-([a-z])/g,(_,s)=>s.toUpperCase()) in this.dataset&&(m[2]===undefined||this.dataset[m[1].slice(5).replace(/-([a-z])/g,(_,s)=>s.toUpperCase())]===m[2]);}return this.tagName===selector.toUpperCase();}
 querySelectorAll(s){return this.all().filter(n=>n.matches(s));}querySelector(s){return this.querySelectorAll(s)[0]||null;}
 get options(){return this.children;}get selectedIndex(){return this.options.findIndex(n=>n.value===this.value);}
 focus(){}scrollIntoView(){}setPointerCapture(){}getBoundingClientRect(){return {left:0,top:0,width:600,height:360};}
 showModal(){this.open=true;}close(){this.open=false;this.dispatchEvent({type:'close'});}click(){this.dispatchEvent({type:'click'});}
}
const memory=()=>{const data=new Map();return {getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)};};
function environment(storage){
 const body=new StudioNode('body'),place=new StudioNode('details'),header=new StudioNode('div'),lang=new StudioNode('select');place.id='creative-recipes';header.className='header-right';lang.id='ui-language';body.append(header,place,lang);
 const doc={body,hidden:false,handlers:{},createElement:tag=>new StudioNode(tag),createElementNS:(_,tag)=>new StudioNode(tag),getElementById:id=>body.all().find(n=>n.id===id),querySelector:s=>body.querySelector(s),addEventListener(k,fn){(this.handlers[k]??=[]).push(fn);},dispatchEvent(event){for(const fn of this.handlers[event.type]||[])fn(event);return true;}};
 globalThis.document=doc;globalThis.localStorage=storage;globalThis.Option=class extends StudioNode{constructor(label,value){super('option');this.textContent=label;this.value=value;}};
 globalThis.Event=class{constructor(type){this.type=type;}};globalThis.CustomEvent=class extends Event{constructor(type,options={}){super(type);this.detail=options.detail;}};globalThis.confirm=()=>true;
 Object.defineProperty(globalThis,'navigator',{configurable:true,value:{clipboard:{writeText:async v=>doc.clipboard=v}}});let frameCounter=0;const frames=new Map();globalThis.requestAnimationFrame=fn=>{frames.set(++frameCounter,fn);return frameCounter;};globalThis.cancelAnimationFrame=id=>frames.delete(id);
 return {doc,frames};
}
const f=(root,key)=>root.querySelector('[data-vs-field="'+key+'"]');
test('studio workflow: presets, camera/light edits, section handoff, backup persistence and eight languages',async()=>{
 const storage=memory(),{doc}=environment(storage);let language='HU',section='Visual direction mix: Primary — Glamour.\nLighting direction — descriptive strength: old light.';
 doc.addEventListener('prompt-studio-compose-mix',event=>event.detail.direction=section);doc.addEventListener('prompt-studio-load-mix-section',event=>{section=event.detail.direction;event.detail.accepted=true;});
 const ui=attachVirtualStudio({getLanguage:()=>language,getMode:()=> 'i2v'}),root=doc.getElementById('virtual-studio');assert.ok(ui);assert.equal(f(root,'target').value,'i2v');assert.equal(ui.getState().lights.length,3);
 f(root,'preset').value='crane';await root.querySelector('[data-vs-action="suggest"]').emit('click');assert.equal(ui.getState().mode,'video');assert.equal(ui.getState().motion.type,'crane');assert.match(f(root,'output').value,/crane\/jib/);
 f(root,'y').value='2.4';await f(root,'y').emit('change');assert.equal(ui.getState().camera.position.y,2.4);assert.match(f(root,'output').value,/2\.40/);
 const lightId=ui.getState().lights[0].id;f(root,'select').value=lightId;await f(root,'select').emit('change');f(root,'colorMode').value='gel';await f(root,'colorMode').emit('input');f(root,'color').value='#ee3388';await f(root,'color').emit('input');f(root,'light-strength-slider').value='84';await f(root,'light-strength-slider').emit('input');assert.equal(ui.getState().lights[0].intensity,84);assert.match(f(root,'output').value,/#ee3388/);
 await root.querySelector('[data-vs-action="apply"]').emit('click');assert.match(section,/Glamour/);assert.match(section,/Studio direction/);assert.doesNotMatch(section,/old light/);const first=section;await root.querySelector('[data-vs-action="apply"]').emit('click');assert.equal(section,first);
 f(root,'output').value='My own studio directions. ';await f(root,'output').emit('input');f(root,'select').value='camera';await f(root,'select').emit('change');assert.equal(f(root,'output').value,'My own studio directions. ');f(root,'lens').value='50';await f(root,'lens').emit('change');assert.equal(f(root,'output').value,'My own studio directions. ');
 assert.equal(createStudioPlannerStore(storage).read().state.customDirections,'My own studio directions. ');await root.querySelector('[data-vs-action="refresh-output"]').emit('click');assert.match(f(root,'output').value,/50\.00 mm/);assert.equal(ui.getState().customDirections,null);
 for(const code of ['EN','HU','DE','FR','ES','IT','PT','PL']){language=code;doc.getElementById('ui-language').dispatchEvent({type:'change'});assert.equal(root.children[0].textContent,studioLabels(code).title);}
 const current=ui.getState();environment(storage);const reloaded=attachVirtualStudio({getLanguage:()=> 'HU'});assert.deepEqual(reloaded.getState(),current);
});
test('pointer movement saves on release, cancellation and failed writes preserve the previous studio',async()=>{
 const storage=memory(),{doc}=environment(storage);const ui=attachVirtualStudio(),root=doc.getElementById('virtual-studio'),svg=root.querySelector('svg'),before=ui.getState();
 let marker=svg.querySelector('[data-vs-marker="camera"]');await marker.emit('pointerdown',{pointerId:1});await svg.emit('pointermove',{clientX:352.8,clientY:266.4});assert.ok(Math.abs(ui.getState().camera.position.x-1)<1e-8);assert.equal(storage.getItem(studioPlannerKey),null,'drag preview does not write at every pointer event');await svg.emit('pointercancel');assert.deepEqual(ui.getState(),before);
 marker=svg.querySelector('[data-vs-marker="camera"]');await marker.emit('pointerdown',{pointerId:2});await svg.emit('pointermove',{clientX:352.8,clientY:266.4});await svg.emit('pointerup');assert.ok(Math.abs(createStudioPlannerStore(storage).read().state.camera.position.x-1)<1e-8);
 const saved=ui.getState(),raw=storage.getItem(studioPlannerKey);storage.setItem=()=>{throw Error('quota');};marker=svg.querySelector('[data-vs-marker="camera"]');await marker.emit('pointerdown',{pointerId:3});await svg.emit('pointermove',{clientX:405.6,clientY:266.4});await svg.emit('pointerup');assert.deepEqual(ui.getState(),saved);assert.equal(storage.getItem(studioPlannerKey),raw);
});
test('large view returns its controls and motion playback does not generate or write files',async()=>{
 const storage=memory(),{doc,frames}=environment(storage);const ui=attachVirtualStudio(),root=doc.getElementById('virtual-studio');f(root,'preset').value='orbit';await root.querySelector('[data-vs-action="suggest"]').emit('click');const raw=storage.getItem(studioPlannerKey);
 const play=root.querySelectorAll('button').find(n=>n.textContent==='Preview motion');await play.emit('click');assert.ok(frames.size>0);for(const callback of [...frames.values()])callback(performance.now()+10000);assert.equal(storage.getItem(studioPlannerKey),raw);
 await root.querySelector('[data-vs-action="large"]').emit('click');const dialog=doc.body.querySelector('dialog');assert.ok(dialog.open);assert.ok(dialog.querySelector('[data-vs-field="output"]'));dialog.close();assert.ok(root.querySelector('[data-vs-field="output"]'));assert.deepEqual(ui.getState(),createStudioPlannerStore(storage).read().state);
 f(root,'view').value='space';await f(root,'view').emit('input');const svg=root.querySelector('svg');assert.ok(!JSON.stringify(svg.all().map(n=>n.attributes)).includes('NaN'));
});

test('reference preview shares real studio lights and named setups while reference pixels stay session-only',async()=>{
 const storage=memory(),{doc}=environment(storage);globalThis.createImageBitmap=async()=>({width:800,height:600,close(){}});const ui=attachVirtualStudio({getLanguage:()=> 'HU'}),root=doc.getElementById('virtual-studio');assert.equal(await ui.reference.loadImage(new File(['image'],'reference.png',{type:'image/png'})),true);
 const reference=root.querySelector('#studio-reference'),strength=reference.querySelector('[data-sr-field="intensity"]');strength.value='89';await strength.emit('input');assert.equal(ui.getState().lights[0].intensity,89);assert.equal(storage.getItem(studioPlannerKey),null);await strength.emit('change');assert.match(f(root,'output').value,/89\/100/);
 const exposure=reference.querySelector('[data-sr-field="exposure"]');exposure.value='.5';await exposure.emit('input');await exposure.emit('change');f(root,'name').value='Saját portréfény';const save=root.querySelector('.vs-saved').querySelectorAll('button').find(b=>b.textContent===studioLabels('HU').savePreset);await save.emit('click');assert.equal(createStudioPlannerStore(storage).read().presets[0].state.reference.exposure,.5);
 strength.value='20';await strength.emit('input');await strength.emit('change');f(root,'preset').value='saved:0';await root.querySelector('[data-vs-action="suggest"]').emit('click');assert.equal(ui.getState().lights[0].intensity,89);assert.equal(ui.reference.getReference().filename,'reference.png');assert.equal(await ui.reference.loadImage(new File(['next'],'next.png',{type:'image/png'})),true);assert.equal(ui.getState().reference.exposure,.5);assert.doesNotMatch(storage.getItem(studioPlannerKey),/reference.png|next.png|blob:|data:image/);
});
