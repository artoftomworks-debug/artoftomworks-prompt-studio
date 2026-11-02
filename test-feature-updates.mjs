import assert from 'node:assert/strict';
import {test} from 'node:test';
import {StudioNode} from './series-test-dom.mjs';
import {featureUpdatesKey,featureUpdates,featureUpdateLanguages,featureUpdateLabels,readSeenFeatures,setFeatureSeen,unseenFeatureUpdates,attachFeatureUpdates} from './dist/feature-updates.mjs';
const focusedFeatures=[featureUpdates.find(f=>f.id==='series-planner')];
const memory=()=>{const data=new Map();return {getItem:key=>data.get(key)??null,setItem:(key,value)=>data.set(key,value)};};
function environment(storage=memory()){
 const body=new StudioNode('body'),toolbar=new StudioNode('div'),section=new StudioNode('details'),heading=new StudioNode('summary'),launcher=new StudioNode('button'),language=new StudioNode('select');
 toolbar.className='custom-library-toolbar';section.id='series-planner';launcher.id='series-planner-launcher';language.id='ui-language';section.append(heading);toolbar.append(launcher);body.append(toolbar,section,language);
 globalThis.document={body,createElement:tag=>new StudioNode(tag),getElementById:id=>body.all().find(n=>n.id===id),querySelector:selector=>body.querySelector(selector)};
 const observers=[],events={};globalThis.MutationObserver=class{constructor(callback){this.callback=callback;}observe(){observers.push(this);}disconnect(){}};globalThis.addEventListener=(key,callback)=>events[key]=callback;
 return {storage,body,toolbar,section,heading,launcher,language,observers,events};
}
test('seen state is explicit, per revision, portable only as a preference, and merges other feature dismissals',()=>{
 const storage=memory(),first=focusedFeatures[0],other={id:'other-feature',revision:'1'};assert.deepEqual(unseenFeatureUpdates(readSeenFeatures(storage)).map(x=>x.id),featureUpdates.map(feature=>feature.id));
 setFeatureSeen(storage,[first]);assert.equal(unseenFeatureUpdates(readSeenFeatures(storage),focusedFeatures).length,0);
 assert.equal(unseenFeatureUpdates(readSeenFeatures(storage),[{...first,revision:'next'}]).length,1);
 setFeatureSeen(storage,[other]);assert.equal(readSeenFeatures(storage)[first.id],first.revision);assert.equal(readSeenFeatures(storage)[other.id],'1');
 setFeatureSeen(storage,[first],false);assert.equal(readSeenFeatures(storage)[first.id],undefined);assert.equal(readSeenFeatures(storage)[other.id],'1');
});
test('corrupt preferences and failed storage writes do not overwrite existing state',()=>{
 const storage=memory();storage.setItem(featureUpdatesKey,'broken');assert.throws(()=>setFeatureSeen(storage,featureUpdates));assert.equal(storage.getItem(featureUpdatesKey),'broken');
 storage.setItem(featureUpdatesKey,'{"version":1,"seen":{}}');const before=storage.getItem(featureUpdatesKey);storage.setItem=()=>{throw Error('quota');};assert.throws(()=>setFeatureSeen(storage,featureUpdates));assert.equal(storage.getItem(featureUpdatesKey),before);
});
test('NEW appears at the heading and launcher, does not disappear on opening, and stays dismissed after reload',async()=>{
 const env=environment(),ui=attachFeatureUpdates({features:focusedFeatures,storage:env.storage,getLanguage:()=> 'HU'}),news=document.getElementById('feature-updates');
 assert.match(news.children[0].textContent,/Újdonságok \(1\)/);assert.equal(env.heading.querySelectorAll('.feature-new-badge').length,1);assert.equal(env.launcher.querySelector('span').textContent,'NEW');assert.equal(env.launcher.querySelector('button'),null,'no nested buttons');
 const locate=news.querySelector('button');await locate.emit('click');assert.equal(env.section.open,true);assert.equal(env.storage.getItem(featureUpdatesKey),null,'opening is not dismissal');
 const badge=env.heading.querySelector('button');let prevented=false,stopped=false;await badge.emit('click',{preventDefault(){prevented=true;},stopPropagation(){stopped=true;}});assert.ok(prevented&&stopped);assert.equal(env.heading.querySelector('button'),null);assert.equal(env.launcher.querySelector('span'),null);assert.deepEqual(ui.unseen(),[]);
 const fresh=environment(env.storage);attachFeatureUpdates({features:focusedFeatures,storage:fresh.storage});assert.equal(fresh.heading.querySelector('button'),null);
 const restore=document.getElementById('feature-updates').querySelector('[data-feature-action="restore"]');await restore.emit('click');assert.equal(fresh.heading.querySelectorAll('button').length,1);
});
test('translations and recreated headings retain exactly one badge; bulk dismissal/restoration works',async()=>{
 const env=environment();let language='EN';const ui=attachFeatureUpdates({features:focusedFeatures,storage:env.storage,getLanguage:()=>language}),news=document.getElementById('feature-updates');
 for(const code of featureUpdateLanguages){language=code;env.language.dispatchEvent({type:'change'});assert.match(news.children[0].textContent,new RegExp(featureUpdateLabels(code).title.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));assert.equal(env.heading.querySelectorAll('button').length,1);assert.equal(env.launcher.querySelectorAll('span').length,1);}
 env.heading.replaceChildren();env.heading.textContent='Recreated heading';env.observers[0].callback();env.observers[0].callback();assert.equal(env.heading.querySelectorAll('button').length,1);
 await news.querySelector('[data-feature-action="all"]').emit('click');env.observers[0].callback();assert.equal(env.heading.querySelectorAll('button').length,0);assert.equal(ui.unseen().length,0);
 await news.querySelector('[data-feature-action="restore"]').emit('click');assert.equal(ui.unseen().length,1);assert.equal(attachFeatureUpdates({features:focusedFeatures,storage:env.storage}),null);
});
test('a failed dismiss stays visibly NEW; cross-tab changes update labels without changing unrelated saved projects',async()=>{
 const env=environment(),ui=attachFeatureUpdates({features:focusedFeatures,storage:env.storage});env.storage.setItem('artoftomworks.v2.seriesPlanner','keep this plan');const writer=env.storage.setItem;env.storage.setItem=()=>{throw Error('quota');};
 await env.heading.querySelector('button').emit('click',{stopPropagation(){}});assert.equal(ui.unseen().length,1);assert.equal(ui.hasStorageProblem(),true);assert.equal(env.heading.querySelectorAll('button').length,1);assert.match(document.getElementById('feature-updates').querySelector('[role="status"]')?.textContent||document.getElementById('feature-updates').querySelector('.feature-updates-status').textContent,/Could not save/);
 env.storage.setItem=writer;setFeatureSeen(env.storage,featureUpdates);env.events.storage({key:featureUpdatesKey});assert.equal(ui.unseen().length,0);assert.equal(env.storage.getItem('artoftomworks.v2.seriesPlanner'),'keep this plan');
});
test('feature registry has unique versioned identifiers, live targets and complete eight-language copy',()=>{
 assert.equal(new Set(featureUpdates.map(f=>f.id)).size,featureUpdates.length);
 for(const feature of featureUpdates){assert.match(feature.id,/^[a-z0-9][a-z0-9_.-]+$/);assert.ok(feature.revision&&feature.sectionId);assert.equal(feature.title.length,8);assert.equal(feature.description.length,8);assert.ok([...feature.title,...feature.description].every(s=>s.trim().length>0));}
 for(const code of featureUpdateLanguages)assert.ok(Object.values(featureUpdateLabels(code)).every(Boolean));
});

test('NEW navigation opens nested pose section and its closed studio parent',async()=>{
 const env=environment(),feature=featureUpdates.find(f=>f.id==='pose-studio'),parent=new StudioNode('details');parent.id='virtual-studio';env.section.id=feature.sectionId;env.launcher.id=feature.launcherId;parent.append(env.section);env.body.append(parent);
 attachFeatureUpdates({features:[feature],storage:env.storage});await document.getElementById('feature-updates').querySelector('button').emit('click');assert.equal(parent.open,true);assert.equal(env.section.open,true);assert.equal(env.storage.getItem(featureUpdatesKey),null);
});
