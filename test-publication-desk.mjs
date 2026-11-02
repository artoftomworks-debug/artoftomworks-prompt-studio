import assert from 'node:assert/strict';
import {test} from 'node:test';
import {writeFileSync,readFileSync} from 'node:fs';
import vm from 'node:vm';
import {createSeriesProject} from './dist/series-planner.mjs';
import {createPublicationDraft,normalizePublicationDraft,parsePublicationDraft,publicationFromArchive,publicationFromSeries,publicationFromCurrent,publicationKeywords,publicationReady,publicationSeriesStatus,publicationAiRequest,applyPublicationAi,exportPublicationFiles,publicationZip,createPublicationStore,publicationDeskKey} from './dist/publication-desk.mjs';
const memory=()=>{const map=new Map();return {getItem:key=>map.get(key)??null,setItem:(key,value)=>map.set(key,value)};};
const fullCopy={EN:{title:'Rain at the window',teaser:'A quiet rainy moment.',description:'Rain falls outside a cafe.'},HU:{title:'Eső az ablaknál',teaser:'Csendes esős pillanat.',description:'Eső esik a kávézó előtt.'}};
const archive=()=>publicationFromArchive({id:'real-id',kind:'video',filename:'C:\\private\\rain.mp4',path:'C:\\private\\rain.mp4',source:'SwarmUI',prompt:'PRIVATE SOURCE PROMPT',negative:'Private negative',model:'C:\\models\\test.safetensors',settings:{width:1920,height:1088,fps:24,cfg:0,seed:0,loras:[{name:'C:\\models\\style.safetensors',strength:0}]}});
test('archive snapshots preserve recorded zero values but exclude filesystem paths and unknown settings',()=>{
 const p=archive();p.sources[0].settings.secret='PRIVATE';const normalized=normalizePublicationDraft(p);assert.equal(normalized.sources[0].name,'rain.mp4');assert.equal(normalized.sources[0].settings.seed,0);assert.equal(normalized.sources[0].settings.cfg,0);assert.equal(normalized.sources[0].settings.loras[0].strength,0);assert.equal(normalized.sources[0].model,'test.safetensors');assert.doesNotMatch(JSON.stringify(normalized),/C:\\\\|"secret"/);
 const files=exportPublicationFiles(normalized);assert.doesNotMatch(Object.values(files).join('\n'),/PRIVATE SOURCE PROMPT|Private negative|test.safetensors/);
 normalized.includeSettings=true;normalized.includePrompt=true;const shared=exportPublicationFiles(normalized)['creator-passport_EN.txt'];assert.match(shared,/Seed: 0/);assert.match(shared,/CFG: 0/);assert.match(shared,/PRIVATE SOURCE PROMPT/);assert.doesNotMatch(shared,/C:\\/);
});
test('series plans and current prompts never masquerade as recorded file metadata',()=>{
 const series=createSeriesProject(),p=publicationFromSeries(series);p.includeSettings=true;const files=exportPublicationFiles(p);assert.ok(files['plan-notes.txt']);assert.equal(files['creator-passport_EN.txt'],undefined);assert.match(files['plan-notes.txt'],/NOT RECOVERED/);assert.doesNotMatch(files['plan-notes.txt'],/IMAGE PROMPT|VIDEO PROMPT/);assert.ok(p.sources.every(s=>Object.keys(s.settings).length===0));
 const current=publicationFromCurrent({mode:'image',prompt:'A subject',settings:{seed:42},model:'planned model'});assert.equal(current.sources[0].origin,'draft');assert.deepEqual(current.sources[0].settings,{});assert.equal(current.sources[0].model,'');
});
test('keywords are case-insensitively deduplicated; new suggestions remain unchecked',()=>{
 let tags=publicationKeywords('rain, Rain; eső\nwindow');assert.equal(tags.length,3);assert.ok(tags.every(t=>!t.selected));tags[0].selected=true;tags=publicationKeywords('RAIN, cafe',tags);assert.equal(tags[0].selected,true);assert.equal(tags[1].selected,false);
 const p=archive();p.keywords=tags;assert.equal(exportPublicationFiles(p)['keywords.txt'],'RAIN\n');
});
test('AI handoff contains visible wording context only; application is atomic, bilingual and resets text approval',()=>{
 const p=archive();p.copy=structuredClone(fullCopy);p.brief='A rainy cafe';p.checks.text=true;const before=JSON.stringify(p);const request=publicationAiRequest(p);assert.doesNotMatch(request.text,/PRIVATE SOURCE PROMPT|"seed"|test.safetensors/);assert.match(request.question,/Do not invent/);
 assert.throws(()=>applyPublicationAi(p,'not JSON'));assert.equal(JSON.stringify(p),before);assert.throws(()=>applyPublicationAi(p,JSON.stringify({EN:fullCopy.EN,keywords:[]})));
 const next=applyPublicationAi(p,'```json\n'+JSON.stringify({...fullCopy,keywords:['rain','eső']})+'\n```');assert.equal(next.checks.text,false);assert.equal(next.sources[0].prompt,'PRIVATE SOURCE PROMPT');assert.equal(next.copy.HU.title,'Eső az ablaknál');assert.ok(next.keywords.every(t=>!t.selected));
});
test('readiness requires explicit review, full EN/HU copy, and sound review for video; changed series are stale',()=>{
 const series=createSeriesProject(),p=publicationFromSeries(series);assert.equal(publicationSeriesStatus(series,[]),'none');assert.equal(publicationSeriesStatus(series,[p]),'working');p.copy=structuredClone(fullCopy);p.checks={image:true,audio:false,cover:true,text:true};assert.equal(publicationReady(p),false);p.checks.audio=true;assert.equal(publicationReady(p),true);assert.equal(publicationSeriesStatus(series,[p]),'ready');series.shared.palette='New palette';assert.equal(publicationSeriesStatus(series,[p]),'stale');
 const still=publicationFromCurrent({mode:'image',prompt:'Still image'});still.copy=structuredClone(fullCopy);still.checks={image:true,cover:true,text:true};assert.equal(publicationReady(still),true);still.copy.HU.teaser='';assert.equal(publicationReady(still),false);
});
test('private draft import makes a new identity; failed writes, corruption and conflicts retain saved drafts',()=>{
 const storage=memory(),store=createPublicationStore(storage),p=archive();store.save(p);const saved=storage.getItem(publicationDeskKey),backup=JSON.stringify({type:'PromptStudioPublicationDraft',version:1,draft:p}),restored=parsePublicationDraft(backup);assert.notEqual(restored.id,p.id);assert.equal(restored.sources[0].prompt,p.sources[0].prompt);assert.throws(()=>parsePublicationDraft('{"version":2}'));
 const writer=storage.setItem;storage.setItem=()=>{throw Error('quota');};p.name='unsaved';assert.throws(()=>store.save(p));assert.equal(storage.getItem(publicationDeskKey),saved);storage.setItem=writer;
 const other=createPublicationStore(storage);other.save(p);assert.throws(()=>store.remove(p.id),/conflict/);assert.equal(createPublicationStore(storage).list()[0].name,'unsaved');storage.setItem(publicationDeskKey,'broken');assert.throws(()=>createPublicationStore(storage).save(p));assert.equal(storage.getItem(publicationDeskKey),'broken');
});
test('publication ZIP contains only selected text with valid UTF-8; unsafe paths and excessive files are refused',()=>{
 const p=archive();p.copy=structuredClone(fullCopy);p.keywords=publicationKeywords('rain, eső');p.keywords[1].selected=true;const files=exportPublicationFiles(p),zip=publicationZip(files);assert.equal(new DataView(zip.buffer).getUint32(0,true),0x04034b50);assert.doesNotMatch(new TextDecoder().decode(zip),/PRIVATE SOURCE PROMPT|test.safetensors/);writeFileSync(new URL('./publication-test-package.zip',import.meta.url),zip);
 assert.throws(()=>publicationZip({'../escape.txt':'bad'}));assert.throws(()=>publicationZip(Object.fromEntries(Array.from({length:41},(_,i)=>['file'+i+'.txt','text']))));
});
test('offline bundle compiles and contains local publication UI, archive handoff and NEW target',()=>{
 const html=readFileSync(new URL('./dist/ArtofTomworks_Prompt_Studio_OFFLINE.html',import.meta.url),'utf8');for(const script of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g))new vm.Script(script[1]);assert.match(html,/function attachPublicationDesk/);assert.match(html,/publication-desk-launcher/);assert.match(html,/onPublicationCapture:item/);assert.match(html,/\.pd-copy-grid\{/);assert.doesNotMatch(html,/href="\.\/publication-desk\.css"/);
});
