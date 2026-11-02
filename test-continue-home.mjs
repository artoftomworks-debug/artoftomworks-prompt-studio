import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {continueHomeKey,continueHomeTools,continueHomeLanguages,continueToolLabel,searchContinueTools,normalizeContinuePreferences,createContinueStore,continueWorkCards,openContinueTool} from './dist/continue-home.mjs';
import {continueHomeLabels,attachContinueHome} from './dist/continue-home-ui.mjs';
import {featureUpdates} from './dist/feature-updates.mjs';
import {attachSeriesPlanner} from './dist/series-planner-ui.mjs';
import {createSeriesProject,createSeriesStore,seriesPlannerKey} from './dist/series-planner.mjs';
import {attachPublicationDesk} from './dist/publication-desk-ui.mjs';
import {createPublicationStore,publicationFromSeries,publicationDeskKey} from './dist/publication-desk.mjs';
import {StudioNode} from './series-test-dom.mjs';
const memory=()=>{const map=new Map();return {getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v)};};
function environment(storage=memory()){
 const body=new StudioNode('body'),hero=new StudioNode('section'),toolbar=new StudioNode('div'),language=new StudioNode('select');hero.className='hero';toolbar.className='custom-library-toolbar';language.id='ui-language';body.append(hero,toolbar,language);
 const events={},windowEvents={};const doc={body,createElement:tag=>new StudioNode(tag),getElementById:id=>body.all().find(n=>n.id===id),querySelector:s=>body.querySelector(s),addEventListener(k,cb){(events[k]??=[]).push(cb);},dispatchEvent(e){for(const cb of events[e.type]||[])cb(e);return true;}};
 globalThis.document=doc;globalThis.Option=class extends StudioNode{constructor(t,v){super('option');this.textContent=t;this.value=v;}};globalThis.CustomEvent=class{constructor(type,options={}){this.type=type;this.detail=options.detail;}};globalThis.confirm=()=>true;globalThis.addEventListener=(k,fn)=>(windowEvents[k]??=[]).push(fn);Object.defineProperty(globalThis,'navigator',{configurable:true,value:{clipboard:{writeText:async t=>doc.copied=t}}});
 return {doc,storage,body,language,windowEvents};
}
const field=(root,key)=>root.querySelector('[data-home-field="'+key+'"]');
const action=(root,key)=>root.querySelector('[data-home-action="'+key+'"]');
test('preferences whitelist, limit and transactional storage failures protect saved data',()=>{
 const storage=memory(),store=createContinueStore(storage);assert.deepEqual(store.read().favorites,['series','publication','archive','studio']);assert.equal(storage.getItem(continueHomeKey),null);
 store.update({note:'Return tomorrow',showOnStart:false});const before=store.read(),writer=storage.setItem;storage.setItem=()=>{throw Error('quota');};assert.throws(()=>store.update({note:'unsaved'}));assert.deepEqual(store.read(),before);storage.setItem=writer;
 assert.throws(()=>normalizeContinuePreferences({favorites:['delete-all']}));assert.throws(()=>normalizeContinuePreferences({favorites:continueHomeTools.slice(0,7).map(t=>t.id)}));assert.equal(normalizeContinuePreferences({note:'a'.repeat(2000)}).note.length,1500);
 storage.setItem(continueHomeKey,'{bad');assert.throws(()=>store.update({note:'conflict'}),/conflict/);const corrupt=createContinueStore(storage);assert.equal(corrupt.problem(),true);assert.throws(()=>corrupt.update({note:'x'}));assert.equal(storage.getItem(continueHomeKey),'{bad');
});
test('search understands accents and advertised everyday words; all eight languages are complete',()=>{
 assert.ok(searchContinueTools('feny','HU').some(t=>t.id==='studio'));assert.ok(searchContinueTools('törlés','HU').some(t=>t.id==='cleanup'));assert.ok(searchContinueTools('masolas','HU').some(t=>t.id==='workbench'));assert.ok(searchContinueTools('video','HU').length>2);assert.deepEqual(searchContinueTools('unmatchable xyz'),[]);assert.deepEqual(searchContinueTools(''),[]);
 for(const lang of continueHomeLanguages){assert.ok(Object.values(continueHomeLabels(lang)).every(Boolean));for(const tool of continueHomeTools)assert.ok(continueToolLabel(tool,lang));}
 const entry=featureUpdates.find(f=>f.id==='continue-home');assert.equal(entry.sectionId,'continue-home');assert.equal(entry.title.length,8);assert.equal(entry.description.length,8);
});
test('work cards show recorded statuses and next required manual check; saved content remains unchanged',()=>{
 const project=createSeriesProject();project.scenes[0].status='created';project.scenes[1].status='proven';project.publicationStatus='stale';const draft=publicationFromSeries(project);draft.checks.image=true;draft.ready=false;
 const data={series:[project],publications:[draft]},before=JSON.stringify(data);let cards=continueWorkCards(data);const series=cards.find(c=>c.kind==='series'),pub=cards.find(c=>c.kind==='publication');assert.equal(series.completed,2);assert.equal(series.total,3);assert.equal(series.publication,'stale');assert.equal(pub.nextCheck,'audio');
 const prefs=normalizeContinuePreferences({history:[{kind:'publication',id:draft.id,at:10}]});cards=continueWorkCards(data,prefs);assert.equal(cards[0].id,draft.id);assert.equal(JSON.stringify(data),before);draft.checks={image:true,audio:true,cover:true,text:true};assert.equal(continueWorkCards({publications:[draft]})[0].nextCheck,'copy');draft.ready=true;assert.equal(continueWorkCards({publications:[draft]})[0].ready,true);
});
test('navigation reveals the correct section/mode and never invokes cleanup or generation',()=>{
 const env=environment();const wrapper=new StudioNode('details'),cleanup=new StudioNode('details'),danger=new StudioNode('button');cleanup.id='catalog-cleanup';let clicks=0;danger.addEventListener('click',()=>clicks++);cleanup.append(danger);wrapper.append(cleanup);env.body.append(wrapper);assert.equal(openContinueTool('cleanup'),true);assert.equal(wrapper.open,true);assert.equal(cleanup.open,true);assert.equal(clicks,0);assert.equal(openContinueTool('unknown'),false);
 const video=new StudioNode('section');video.id='i2v-workspace';video.hidden=true;env.body.append(video);let mode='';assert.equal(openContinueTool('i2v',{setMode:m=>{mode=m;video.hidden=false;}}),true);assert.equal(mode,'i2v');assert.equal(clicks,0);
 const ai=new StudioNode('button');ai.id='ai-hub-open';ai.addEventListener('click',()=>clicks++);env.body.append(ai);assert.equal(openContinueTool('ai'),true);assert.equal(clicks,1);
});
test('dashboard preserves notes, start preference and favorites through reload and eight UI languages',async()=>{
 const env=environment();let lang='HU';const ui=attachContinueHome({storage:env.storage,getLanguage:()=>lang}),root=env.doc.getElementById('continue-home');assert.equal(root.open,true);field(root,'note').value='Hangot ellenőrizni';await field(root,'note').emit('input');field(root,'showOnStart').checked=false;await field(root,'showOnStart').emit('change');assert.equal(root.open,true);
 field(root,'search').value='törlés';await field(root,'search').emit('input');await root.querySelector('[data-home-pin="cleanup"]').emit('click');assert.ok(ui.getPreferences().favorites.includes('cleanup'));
 for(const code of continueHomeLanguages){lang=code;env.language.dispatchEvent({type:'change'});assert.equal(root.children[0].textContent,continueHomeLabels(code).title);assert.equal(field(root,'note').value,'Hangot ellenőrizni');}
 const next=environment(env.storage);attachContinueHome({storage:next.storage});assert.equal(next.doc.getElementById('continue-home').open,false);assert.equal(field(next.doc.getElementById('continue-home'),'note').value,'Hangot ellenőrizni');await next.doc.getElementById('continue-home-launcher').emit('click');assert.equal(next.doc.getElementById('continue-home').open,true);
});
test('failed note writes and cross-tab conflict leave the typed note available to copy',async()=>{
 const env=environment(),ui=attachContinueHome({storage:env.storage}),root=env.doc.getElementById('continue-home');env.storage.setItem=()=>{throw Error('quota');};field(root,'note').value='Never lose this';await field(root,'note').emit('input');assert.equal(ui.getPreferences().note,'Never lose this');assert.match(root.querySelector('.ch-status').textContent,/Could not save/);let warned=false;env.windowEvents.beforeunload[0]({preventDefault(){warned=true;}});assert.equal(warned,true);await action(root,'copyNote').emit('click');assert.equal(env.doc.copied,'Never lose this');env.windowEvents.storage[0]({key:continueHomeKey});assert.match(root.querySelector('.ch-status').textContent,/Another tab/);assert.equal(field(root,'note').value,'Never lose this');
});
test('work cards route exact ids, refresh on save/remove, and only update dashboard history',async()=>{
 const env=environment(),project=createSeriesProject(),draft=publicationFromSeries(project);let data={series:[project],publications:[draft]},resumed=[],published=[];const ui=attachContinueHome({storage:env.storage,readWorkData:()=>data,onResume:(...args)=>resumed.push(args),onSeriesPublication:id=>published.push(id)}),root=env.doc.getElementById('continue-home');const card=root.querySelector('[data-home-work="series:'+project.id+'"]');await action(card,'continue').emit('click');await action(card,'openPublication').emit('click');assert.deepEqual(resumed,[['series',project.id]]);assert.deepEqual(published,[project.id]);
 env.doc.dispatchEvent(new CustomEvent('prompt-studio-work-changed',{detail:{kind:'publication',id:draft.id}}));await new Promise(r=>setTimeout(r,180));assert.equal(root.querySelector('.ch-work').dataset.homeWork,'publication:'+draft.id);assert.equal(env.storage.getItem(seriesPlannerKey),null);assert.equal(env.storage.getItem(publicationDeskKey),null);
 data={series:[],publications:[]};ui.refresh();assert.equal(root.querySelectorAll('.ch-work').length,0);
});
test('resume controllers load fresh saved records and protect unsaved edits when cancelled',async()=>{
 const env=environment(),p1=createSeriesProject('cafe'),p2=createSeriesProject('product');createSeriesStore(env.storage).save(p1);const series=attachSeriesPlanner({storage:env.storage});createSeriesStore(env.storage).save(p2);assert.equal(series.list().length,2);assert.equal(series.resume(p2.id),true);assert.equal(series.getState().id,p2.id);
 const d1=publicationFromSeries(p1),d2=publicationFromSeries(p2);createPublicationStore(env.storage).save(d1);const pub=attachPublicationDesk({storage:env.storage});createPublicationStore(env.storage).save(d2);assert.equal(pub.list().length,2);assert.equal(pub.resume(d2.id),true);assert.equal(pub.getState().id,d2.id);assert.equal(pub.list()[0].ready,false);
 const writer=env.storage.setItem;env.storage.setItem=()=>{throw Error('quota');};const seriesRoot=env.doc.getElementById('series-planner'),pubRoot=env.doc.getElementById('publication-desk');const title=seriesRoot.querySelector('[data-ser-field="name"]');title.value='Unsaved series';await title.emit('input');const name=pubRoot.querySelector('[data-pd-field="name"]');name.value='Unsaved publication';await name.emit('input');globalThis.confirm=()=>false;assert.equal(series.resume(p1.id),false);assert.equal(pub.resume(d1.id),false);assert.equal(pub.getState().name,'Unsaved publication');env.storage.setItem=writer;
});
test('unreadable saved works are reported without erasing records',()=>{
 const env=environment();env.storage.setItem(seriesPlannerKey,'broken');const series=attachSeriesPlanner({storage:env.storage});assert.throws(()=>series.list());assert.equal(series.resume('x'),false);attachContinueHome({storage:env.storage,readWorkData:()=>{series.list();}});assert.match(env.doc.getElementById('continue-home').querySelector('.ch-status').textContent,/could not be read/);assert.equal(env.storage.getItem(seriesPlannerKey),'broken');
});
test('offline bundle compiles with the dashboard, styles and registry embedded',()=>{
 const html=readFileSync(new URL('./dist/ArtofTomworks_Prompt_Studio_OFFLINE.html',import.meta.url),'utf8');const js=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]).join('\n');assert.ok(js.includes('attachContinueHome'));assert.ok(html.includes('.ch-work-grid'));assert.doesNotMatch(js,/^import /m);assert.doesNotMatch(html,/href="\.\/continue-home.css"/);new vm.Script(js);assert.equal(featureUpdates.find(f=>f.id==='series-planner').revision,'2026-10-30.2');
});
