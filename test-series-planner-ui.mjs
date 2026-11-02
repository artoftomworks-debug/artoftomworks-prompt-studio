import assert from 'node:assert/strict';
import {test} from 'node:test';
import {StudioNode} from './series-test-dom.mjs';
import {attachSeriesPlanner,seriesLabels} from './dist/series-planner-ui.mjs';
import {createSeriesStore,seriesPlannerKey,parseSeriesProject} from './dist/series-planner.mjs';
const memory=()=>{const map=new Map();return {getItem:key=>map.get(key)??null,setItem:(key,value)=>map.set(key,value)};};
function environment(storage=memory()){
 const body=new StudioNode('body'),header=new StudioNode('div'),anchor=new StudioNode('details'),lang=new StudioNode('select');header.className='header-right';anchor.id='virtual-studio';lang.id='ui-language';body.append(header,anchor,lang);
 const doc={body,createElement:tag=>new StudioNode(tag),getElementById:id=>body.all().find(n=>n.id===id),querySelector:s=>body.querySelector(s)};
 globalThis.document=doc;globalThis.Option=class extends StudioNode{constructor(text,value){super('option');this.textContent=text;this.value=value;}};globalThis.confirm=()=>true;
 const events={},urls=new Map(),revoked=[];let sequence=0;globalThis.addEventListener=(key,fn)=>{events[key]=fn;};
 URL.createObjectURL=value=>{const id='blob:series-test-'+(++sequence);urls.set(id,value);return id;};URL.revokeObjectURL=id=>revoked.push(id);
 Object.defineProperty(globalThis,'navigator',{configurable:true,value:{clipboard:{writeText:async value=>doc.copied=value}}});
 return {doc,storage,urls,revoked,events};
}
const field=(root,key)=>root.querySelector('[data-ser-field="'+key+'"]');
const action=(root,key)=>root.querySelector('[data-ser-action="'+key+'"]');

test('shared edits update auto prompts; manual text survives changes, copies independently and refreshes only on request',async()=>{
 const env=environment();let language='HU';const transferred=[];
 const ui=attachSeriesPlanner({storage:env.storage,getLanguage:()=>language,getCurrent:()=>({prompt:'A current editor prompt'}),restore:entry=>transferred.push(entry)}),root=env.doc.getElementById('series-planner');
 assert.equal(root.children[0].textContent,'Sorozattervező');assert.equal(root.querySelectorAll('.ser-card').length,3);
 let card=root.querySelector('.ser-card');field(card,'image').value='Carefully edited image';await field(card,'image').emit('input');
 field(root,'palette').value='Autumn copper and deep green';await field(root,'palette').emit('input');assert.equal(field(card,'image').value,'Carefully edited image');assert.match(field(card,'video').value,/Autumn copper/);assert.equal(card.querySelector('.ser-stale').hidden,false);
 await action(card,'copy').emit('click');assert.equal(env.doc.copied,'Carefully edited image');
 globalThis.confirm=()=>false;await action(card,'refresh').emit('click');assert.equal(field(card,'image').value,'Carefully edited image');await action(card,'use').emit('click');assert.equal(transferred.length,0);
 globalThis.confirm=()=>true;await action(card,'use').emit('click');assert.equal(transferred[0].mode,'image');assert.equal(transferred[0].prompt,'Carefully edited image');
 await action(card,'refresh').emit('click');assert.match(field(card,'image').value,/Autumn copper/);assert.equal(card.querySelector('.ser-stale').hidden,true);
 const sceneState=ui.getState();for(const code of ['EN','HU','DE','FR','ES','IT','PT','PL']){language=code;env.doc.getElementById('ui-language').dispatchEvent({type:'change'});assert.equal(root.children[0].textContent,seriesLabels(code).title);assert.deepEqual(ui.getState(),sceneState);}
 assert.deepEqual(createSeriesStore(env.storage).list()[0],sceneState);
});
test('media selection previews locally, saves names only, updates progress and clears the reference without deleting files',async()=>{
 const env=environment(),ui=attachSeriesPlanner({storage:env.storage});const root=env.doc.getElementById('series-planner'),card=root.querySelector('.ser-card'),zone=card.querySelector('.ser-media'),input=zone.querySelector('input');
 input.files=[new File(['image placeholder'],'rain.png',{type:'image/png'})];await input.emit('change');assert.equal(ui.getState().scenes[0].media.imageName,'rain.png');assert.equal(field(card,'status').value,'created');assert.equal(zone.querySelector('img').src,'blob:series-test-1');
 const raw=env.storage.getItem(seriesPlannerKey);assert.match(raw,/rain.png/);assert.doesNotMatch(raw,/blob:|base64|image placeholder/);
 await action(zone,'forget').emit('click');assert.equal(ui.getState().scenes[0].media.imageName,'');assert.equal(zone.querySelector('img'),null);assert.deepEqual(env.revoked,['blob:series-test-1']);
 input.files=[new File(['bad'],'document.html',{type:'text/html'})];await input.emit('change');assert.equal(ui.getState().scenes[0].media.imageName,'');assert.match(root.querySelector('.ser-status').textContent,/Invalid/);
});
test('save failure keeps the edited draft visible and exportable; importing a plan does not replace a saved series',async()=>{
 const env=environment(),ui=attachSeriesPlanner({storage:env.storage}),root=env.doc.getElementById('series-planner');ui.save();const before=env.storage.getItem(seriesPlannerKey),writer=env.storage.setItem;
 env.storage.setItem=()=>{throw Error('quota');};field(root,'name').value='Unsaved but visible';await field(root,'name').emit('input');assert.equal(ui.getState().title,'Unsaved but visible');assert.equal(field(root,'name').value,'Unsaved but visible');assert.equal(env.storage.getItem(seriesPlannerKey),before);assert.match(root.querySelector('.ser-status').textContent,/Could not save/);
 await action(root,'export').emit('click');const exported=await [...env.urls.values()].at(-1).text();assert.equal(parseSeriesProject(exported).title,'Unsaved but visible');
 env.storage.setItem=writer;await action(root,'save').emit('click');assert.equal(createSeriesStore(env.storage).list()[0].title,'Unsaved but visible');
 const importInput=root.querySelector('.ser-actions').querySelector('input');importInput.files=[new File([exported],'backup.json',{type:'application/json'})];await importInput.emit('change');assert.equal(createSeriesStore(env.storage).list().length,2);assert.equal(ui.getState().title,'Unsaved but visible');
});
test('new templates and the header shortcut work; source text stays literal instead of becoming markup',async()=>{
 const env=environment(),ui=attachSeriesPlanner({storage:env.storage}),root=env.doc.getElementById('series-planner');
 env.doc.querySelector('.header-right').querySelector('button').click();assert.equal(root.open,true);
 field(root,'template').value='product';await field(root,'template').emit('change');await action(root,'new').emit('click');assert.equal(ui.getState().title,'Product series');assert.match(field(root.querySelector('.ser-card'),'image').value,/unbranded ceramic/);
 field(root,'name').value='<img src=x onerror=alert(1)>';await field(root,'name').emit('input');assert.equal(root.querySelectorAll('img').length,0);assert.equal(field(root,'project').children[0].textContent,'<img src=x onerror=alert(1)>');
 assert.equal(attachSeriesPlanner({storage:env.storage}),null,'attaching twice does not duplicate the panel');
});
test('duplicating a plan preserves the original and starts new result slots as planned',async()=>{
 const env=environment(),ui=attachSeriesPlanner({storage:env.storage}),root=env.doc.getElementById('series-planner');
 const card=root.querySelector('.ser-card');field(card,'status').value='proven';await field(card,'status').emit('change');const before=ui.getState();
 await action(root,'duplicate').emit('click');const after=ui.getState();assert.notEqual(after.id,before.id);assert.match(after.title,/copy/);assert.deepEqual(after.scenes.map(s=>s.status),['planned','planned','planned']);assert.deepEqual(after.shared,before.shared);assert.equal(createSeriesStore(env.storage).list().find(p=>p.id===before.id).scenes[0].status,'proven');
});
