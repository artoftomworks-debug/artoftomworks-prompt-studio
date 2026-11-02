import assert from 'node:assert/strict';
import {test} from 'node:test';
import {StudioNode} from './series-test-dom.mjs';
import {attachPublicationDesk,publicationLabels} from './dist/publication-desk-ui.mjs';
import {attachSeriesPlanner} from './dist/series-planner-ui.mjs';
import {createSeriesProject} from './dist/series-planner.mjs';
import {createPublicationStore,publicationDeskKey} from './dist/publication-desk.mjs';
const memory=()=>{const map=new Map();return {getItem:key=>map.get(key)??null,setItem:(key,value)=>map.set(key,value)};};
function environment(storage=memory()){
 const body=new StudioNode('body'),toolbar=new StudioNode('div'),anchor=new StudioNode('details'),language=new StudioNode('select');toolbar.className='custom-library-toolbar';anchor.id='virtual-studio';language.id='ui-language';body.append(toolbar,anchor,language);
 const events={},downloads=[],urls=new Map();let next=0;
 const doc={body,handlers:{},createElement(tag){const e=new StudioNode(tag);if(tag==='a')e.click=()=>downloads.push({name:e.download,blob:urls.get(e.href)});return e;},getElementById:id=>body.all().find(n=>n.id===id),querySelector:selector=>body.querySelector(selector),addEventListener(key,callback){(this.handlers[key]??=[]).push(callback);},dispatchEvent(event){for(const cb of this.handlers[event.type]||[])cb(event);(events[event.type]??=[]).push(event.detail);return true;}};
 globalThis.document=doc;globalThis.Option=class extends StudioNode{constructor(text,value){super('option');this.textContent=text;this.value=value;}};globalThis.CustomEvent=class{constructor(type,options={}){this.type=type;this.detail=options.detail;}};globalThis.confirm=()=>true;globalThis.addEventListener=()=>{};
 Object.defineProperty(globalThis,'navigator',{configurable:true,value:{clipboard:{writeText:async value=>doc.copied=value}}});URL.createObjectURL=blob=>{const id='blob:publication-test-'+(++next);urls.set(id,blob);return id;};URL.revokeObjectURL=()=>{};
 return {doc,storage,downloads,events,language};
}
const field=(root,key)=>root.querySelector('[data-pd-field="'+key+'"]');
const action=(root,key)=>root.querySelector('[data-pd-action="'+key+'"]');
const archive={id:'actual-id',kind:'video',filename:'rain.mp4',prompt:'PRIVATE SOURCE PROMPT',negative:'PRIVATE NEGATIVE',model:'test model',source:'SwarmUI',settings:{seed:0,width:1920,height:1088}};
const answer={EN:{title:'Rainy cafe',teaser:'A quiet moment.',description:'Rain falls outside a cafe.'},HU:{title:'Esős kávézó',teaser:'Egy csendes pillanat.',description:'Eső esik a kávézó előtt.'},keywords:['rain','eső']};

test('archive capture, AI request/application, separate copy, keyword selection and ZIP export keep source data private by default',async()=>{
 const env=environment(),ui=attachPublicationDesk({storage:env.storage,getLanguage:()=> 'HU'}),root=env.doc.getElementById('publication-desk');ui.captureArchive(archive);assert.equal(root.open,true);assert.equal(field(root,'brief').value,'PRIVATE SOURCE PROMPT');
 field(root,'brief').value='A finished rainy cafe scene';await field(root,'brief').emit('input');await action(root,'ai').emit('click');assert.equal(env.events['prompt-studio-ask-ai'][0].task,'custom');assert.doesNotMatch(env.events['prompt-studio-ask-ai'][0].text,/PRIVATE SOURCE PROMPT|"seed"/);
 field(root,'aiAnswer').value=JSON.stringify(answer);await field(root,'aiAnswer').emit('input');await action(root,'applyAi').emit('click');assert.equal(field(root,'HU_title').value,'Esős kávézó');await root.querySelector('[data-pd-copy="EN_description"]').emit('click');assert.equal(env.doc.copied,'Rain falls outside a cafe.');
 const keyword=root.querySelector('.pd-keyword').querySelector('input');keyword.checked=true;await keyword.emit('change');assert.equal(ui.getState().keywords[0].selected,true);assert.equal(ui.getState().keywords[1].selected,false);
 await action(root,'export').emit('click');let saved=env.downloads.at(-1);assert.match(saved.name,/_DRAFT_publication.zip$/);assert.equal(saved.blob.type,'application/zip');assert.doesNotMatch(new TextDecoder().decode(await saved.blob.arrayBuffer()),/PRIVATE SOURCE PROMPT|PRIVATE NEGATIVE|test model/);
 for(const key of ['image','audio','cover','text']){const box=field(root,'check-'+key);box.checked=true;await box.emit('change');}assert.match(root.querySelector('.pd-progress').textContent,/Minden/);
 await action(root,'export').emit('click');assert.doesNotMatch(env.downloads.at(-1).name,/DRAFT/);
 field(root,'EN_description').value='Revised copy';await field(root,'EN_description').emit('input');assert.equal(field(root,'check-text').checked,false);assert.equal(createPublicationStore(env.storage).list().at(-1).copy.EN.description,'Revised copy');
});
test('recorded passport is opt-in and survives interface translation; malformed AI response changes nothing',async()=>{
 const env=environment();let language='EN';const ui=attachPublicationDesk({storage:env.storage,getLanguage:()=>language}),root=env.doc.getElementById('publication-desk');ui.captureArchive(archive);field(root,'includeSettings').checked=true;await field(root,'includeSettings').emit('change');assert.match(field(root,'passportPreview').value,/Seed: 0/);assert.doesNotMatch(field(root,'passportPreview').value,/PRIVATE SOURCE PROMPT/);
 field(root,'aiAnswer').value='wrong format';await field(root,'aiAnswer').emit('input');const before=ui.getState();await action(root,'applyAi').emit('click');assert.deepEqual(ui.getState(),before);
 for(const code of ['EN','HU','DE','FR','ES','IT','PT','PL']){language=code;env.language.dispatchEvent({type:'change'});assert.equal(root.children[0].textContent,publicationLabels(code).title);assert.deepEqual(ui.getState(),before);assert.ok(Object.values(publicationLabels(code)).every(Boolean));}
});
test('series handoff shows review progress and becomes stale when a series setting changes',async()=>{
 const env=environment();let desk=null;const series=attachSeriesPlanner({storage:env.storage,onPublish:project=>desk.captureSeries(project),getPublicationStatus:project=>desk?.seriesStatus(project)||'none'});desk=attachPublicationDesk({storage:env.storage,getSeries:()=>series.getState()});
 const seriesRoot=env.doc.getElementById('series-planner');await seriesRoot.querySelector('[data-ser-action="publish"]').emit('click');assert.equal(desk.getState().sources.length,3);assert.equal(desk.seriesStatus(series.getState()),'working');
 const root=env.doc.getElementById('publication-desk');field(root,'aiAnswer').value=JSON.stringify(answer);await field(root,'aiAnswer').emit('input');await action(root,'applyAi').emit('click');for(const key of ['image','audio','cover','text']){field(root,'check-'+key).checked=true;await field(root,'check-'+key).emit('change');}
 assert.equal(desk.seriesStatus(series.getState()),'ready');const palette=seriesRoot.querySelector('[data-ser-field="palette"]');palette.value='New colors';await palette.emit('input');assert.equal(desk.seriesStatus(series.getState()),'stale');assert.ok(seriesRoot.querySelectorAll('p').some(p=>p.textContent.includes('Series changed')));
});
test('archive requests use actual settings; stale asynchronous responses cannot replace a newer selected series',async()=>{
 const env=environment();const pending=[];const fetcher=async url=>{
  if(url.startsWith('/api/catalog/search'))return {ok:true,json:async()=>({total:1,results:[archive]})};
  return new Promise(resolve=>pending.push(()=>resolve({ok:true,json:async()=>url.startsWith('/api/catalog/item')?archive:{...archive,settings:{seed:123}}})));
 };
 const ui=attachPublicationDesk({storage:env.storage,fetcher}),root=env.doc.getElementById('publication-desk');await action(root,'search').emit('click');await new Promise(resolve=>setImmediate(resolve));const loading=root.querySelector('[data-pd-archive-id="actual-id"]').emit('click');assert.equal(pending.length,2);ui.captureSeries(createSeriesProject('product'));pending.forEach(resolve=>resolve());await loading;assert.equal(ui.getState().sources[0].origin,'series');assert.match(ui.getState().name,/Product/);
 const next=root.querySelector('[data-pd-archive-id="actual-id"]').emit('click');pending.slice(2).forEach(resolve=>resolve());await next;assert.equal(ui.getState().sources[0].origin,'archive');assert.equal(ui.getState().sources[0].settings.seed,123);
});
test('failed writes preserve the visible draft and enable a private backup; imported backup gets a new draft',async()=>{
 const env=environment(),ui=attachPublicationDesk({storage:env.storage}),root=env.doc.getElementById('publication-desk');ui.captureArchive(archive);const before=env.storage.getItem(publicationDeskKey),writer=env.storage.setItem;env.storage.setItem=()=>{throw Error('quota');};field(root,'name').value='Still visible';await field(root,'name').emit('input');assert.equal(ui.getState().name,'Still visible');assert.equal(env.storage.getItem(publicationDeskKey),before);assert.match(root.querySelector('.pd-status').textContent,/Could not save/);await action(root,'backup').emit('click');const backup=await env.downloads.at(-1).blob.text();assert.match(backup,/PRIVATE SOURCE PROMPT/);assert.match(env.downloads.at(-1).name,/PRIVATE/);
 env.storage.setItem=writer;const input=action(root,'importDraft').parentElement.querySelector('input');input.files=[new File([backup],'draft.json',{type:'application/json'})];await input.emit('change');assert.equal(createPublicationStore(env.storage).list().length,2);assert.equal(ui.getState().name,'Still visible');
});
