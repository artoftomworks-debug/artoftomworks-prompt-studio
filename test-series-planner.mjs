import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {createSeriesProject,normalizeSeriesProject,seriesSceneBasis,seriesScenePrompt,seriesSceneStale,serializeSeriesProject,parseSeriesProject,exportSeriesText,createSeriesStore,seriesPlannerKey,seriesTemplates} from './dist/series-planner.mjs';
const memory=()=>{const map=new Map();return {getItem:key=>map.get(key)??null,setItem:(key,value)=>map.set(key,value)};};

test('three connected shots inherit changes; manual prompts stay intact and become stale independently',()=>{
 const p=createSeriesProject('cafe');assert.equal(p.scenes.length,3);const s=p.scenes[0];
 assert.match(seriesScenePrompt(p,s,'image'),/rain-covered window/);assert.match(seriesScenePrompt(p,p.scenes[2],'video'),/no persistent upward jet/);
 s.imageBasis=seriesSceneBasis(p,s,'image');s.imageCustom='My carefully edited image prompt';assert.equal(seriesSceneStale(p,s,'image'),false);
 p.shared.palette='Red and gold';p.shared.style='Surreal oil painting';s.seconds=8;s.motion='track';
 assert.equal(seriesScenePrompt(p,s,'image'),'My carefully edited image prompt');assert.equal(seriesSceneStale(p,s,'image'),true);
 assert.match(seriesScenePrompt(p,s,'video'),/Surreal oil painting/);assert.match(seriesScenePrompt(p,s,'video'),/8 seconds/);assert.match(seriesScenePrompt(p,s,'video'),/lateral camera/);
 for(const scene of p.scenes.slice(1))assert.match(seriesScenePrompt(p,scene,'image'),/Red and gold/);
 s.imageCustom=null;assert.match(seriesScenePrompt(p,s,'image'),/Surreal oil painting/);assert.doesNotMatch(seriesScenePrompt(p,s,'image'),/photorealistic/);
});
test('templates are complete; unknown inputs and duration bounds cannot corrupt a plan',()=>{
 for(const template of seriesTemplates){const p=createSeriesProject(template);for(const s of p.scenes){assert.ok(seriesScenePrompt(p,s,'image').length>200);assert.ok(seriesScenePrompt(p,s,'video').length>200);}}
 const p=createSeriesProject();p.scenes[0].seconds=Infinity;p.scenes[1].seconds=-3;p.scenes[2].seconds=999;p.shared.ratio='bad';
 const normalized=normalizeSeriesProject(p);assert.deepEqual(normalized.scenes.map(s=>s.seconds),[5,1,30]);assert.equal(normalized.shared.ratio,'16:9');
 p.scenes[1].id=p.scenes[0].id;assert.throws(()=>normalizeSeriesProject(p));
});
test('portable JSON creates a new identity, excludes paths/binaries, and preserves text, progress and manual edits',()=>{
 const p=createSeriesProject();p.title='Őszi eső';p.scenes[0].status='proven';p.scenes[0].videoCustom='My final video prompt';p.scenes[0].media={imageName:'E:\\Private\\rain.png',videoName:'/private/rain.mp4'};p.privatePath='secret';p.scenes[0].base64='not for export';
 const json=serializeSeriesProject(p);assert.doesNotMatch(json,/Private|secret|base64/);const restored=parseSeriesProject(json);assert.notEqual(restored.id,p.id);assert.equal(restored.title,p.title);assert.equal(restored.scenes[0].status,'proven');assert.equal(restored.scenes[0].media.imageName,'rain.png');assert.equal(seriesScenePrompt(restored,restored.scenes[0],'video'),'My final video prompt');
 assert.match(exportSeriesText(restored),/plans, not recovered generation metadata/);assert.throws(()=>parseSeriesProject('{"version":99}'));assert.throws(()=>parseSeriesProject('x'.repeat(300001)));
});
test('saved projects survive reload; failed writes and other tabs preserve stored data',()=>{
 const storage=memory(),a=createSeriesStore(storage),p=createSeriesProject();a.save(p);const raw=storage.getItem(seriesPlannerKey);assert.equal(createSeriesStore(storage).list()[0].id,p.id);
 const original=storage.setItem;storage.setItem=()=>{throw Error('quota');};p.title='unsaved';assert.throws(()=>a.save(p));assert.equal(storage.getItem(seriesPlannerKey),raw);assert.notEqual(a.list()[0].title,'unsaved');storage.setItem=original;
 const b=createSeriesStore(storage);p.title='other tab';b.save(p);assert.throws(()=>a.save(createSeriesProject()),/conflict/);assert.throws(()=>a.remove(p.id),/conflict/);assert.equal(createSeriesStore(storage).list()[0].title,'other tab');
});
test('broken storage is never overwritten and the plan count is bounded',()=>{
 const storage=memory();storage.setItem(seriesPlannerKey,'broken');const store=createSeriesStore(storage);assert.equal(store.problem(),'storage');assert.throws(()=>store.save(createSeriesProject()));assert.equal(storage.getItem(seriesPlannerKey),'broken');
 const valid=memory(),limited=createSeriesStore(valid);for(let i=0;i<25;i++)limited.save(createSeriesProject());assert.throws(()=>limited.save(createSeriesProject()),/limit/);assert.equal(limited.list().length,25);
});
test('offline release compiles without module imports or external assets and initializes the series planner',()=>{
 const html=readFileSync(new URL('./dist/ArtofTomworks_Prompt_Studio_OFFLINE.html',import.meta.url),'utf8');
 const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(x=>x[1]);assert.ok(scripts.length>=2);for(const script of scripts)new vm.Script(script);
 assert.doesNotMatch(html,/src="\.\/app\.mjs"|href="\.\/series-planner\.css"/);assert.match(html,/function attachSeriesPlanner/);assert.match(html,/\.ser-cards\{/);assert.match(html,/attachSeriesPlanner\(\{getLanguage:/);
});
