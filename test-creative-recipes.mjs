import assert from 'node:assert/strict';
import {test} from 'node:test';
import {snapshotCreativeRecipe,normalizeCreativeRecipe,createCreativeRecipeStore,creativeRecipeKey,buildCreativePlan,describeStyleMix,normalizeStyleMix,styleMixWarnings,creativePassportNotes} from './dist/creative-recipes.mjs';
const memory=()=>{const data=new Map();return {getItem:key=>data.get(key)??null,setItem:(key,value)=>data.set(key,value),data};};
const original={id:'abc123',filename:'C:\\private\\source.png',path:'C:\\private\\source.png',kind:'image',model:'D:\\models\\portrait.safetensors',prompt:'A red car parked beside a lake. Soft amber window lighting.',negative:'blur, watermark',settings:{width:1344,height:768,seed:0,cfg:1,loras:[{name:'D:\\models\\detail.safetensors',strength:0}]}};
test('recipe survives reload and backup with actual zero values, no invented metadata or source paths',()=>{
 const storage=memory(),store=createCreativeRecipeStore(storage),entry=snapshotCreativeRecipe(original,{worked:'Natural reflections',avoid:'Avoid the previous static person'});
 store.save(entry);const loaded=createCreativeRecipeStore(storage).list()[0];
 assert.equal(loaded.recipe.settings.seed,0);assert.equal(loaded.recipe.settings.loras[0].strength,0);assert.ok(!('steps' in loaded.recipe.settings));
 assert.equal(loaded.source.filename,'source.png');assert.equal(loaded.source.model,'portrait.safetensors');assert.equal(loaded.recipe.negative,'blur, watermark');
 assert.doesNotMatch(store.export(),/C:\\\\private|D:\\\\models|"path"/);
 loaded.recipe.settings.seed=9;assert.equal(store.list()[0].recipe.settings.seed,0);
 const target=createCreativeRecipeStore(memory());assert.equal(target.import(store.export()),1);assert.deepEqual(target.list(),store.list());
 assert.match(creativePassportNotes(loaded),/Natural reflections/);assert.match(creativePassportNotes(loaded),/static person/);
});
test('storage failure, damaged data and another tab cannot silently overwrite recipes',()=>{
 const storage=memory(),a=createCreativeRecipeStore(storage),b=createCreativeRecipeStore(storage),entry=snapshotCreativeRecipe(original);
 a.save(entry);assert.throws(()=>b.save(snapshotCreativeRecipe(original)),/storage/);assert.equal(a.list().length,1);
 const broken=memory();broken.setItem(creativeRecipeKey,'{broken');const store=createCreativeRecipeStore(broken);assert.equal(store.problem(),'storage');assert.throws(()=>store.save(entry));assert.equal(broken.getItem(creativeRecipeKey),'{broken');
 const full=memory(),failed=createCreativeRecipeStore(full);full.setItem=()=>{throw Error('quota');};assert.throws(()=>failed.save(entry));assert.deepEqual(failed.list(),[]);
});
test('import collisions preserve local edits and malformed backup is atomic',()=>{
 const store=createCreativeRecipeStore(memory()),entry=snapshotCreativeRecipe(original,{title:'My local title'});store.save(entry);
 assert.equal(store.import(JSON.stringify({version:1,entries:[{...entry,title:'Imported title'}]})),0);assert.equal(store.list()[0].title,'My local title');
 const before=store.export();assert.throws(()=>store.import(JSON.stringify({version:1,entries:[entry,{id:'broken'}]})));assert.equal(store.export(),before);
 assert.throws(()=>store.import(JSON.stringify({version:9,entries:[]})));assert.throws(()=>store.import(' '.repeat(2_000_001)));
});
test('new scene uses only explicit fragments, keeps provenance, and leaves experience outside prompt',()=>{
 const entry=snapshotCreativeRecipe(original,{role:'lighting',excerpt:'Soft amber window lighting.',worked:'Natural reflections',avoid:'The person was too still'});
 const plan=buildCreativePlan({route:'new',scene:'A quiet library during snowfall.',selections:[{entry,role:'lighting'}]});
 assert.match(plan.prompt,/quiet library/);assert.match(plan.prompt,/amber window/);assert.doesNotMatch(plan.prompt,/red car|person was too still|Natural reflections/);
 assert.equal(plan.provenance[0].filename,'source.png');assert.equal(plan.provenance[0].role,'lighting');assert.equal(plan.notes[0].avoid,'The person was too still');
 assert.ok(plan.warnings.includes('settings-reference-only'));assert.equal(plan.settings.seed,0);assert.equal(original.prompt,'A red car parked beside a lake. Soft amber window lighting.');
 const noFragment=buildCreativePlan({route:'new',scene:'A library',selections:[{entry:{...entry,excerpt:''},role:'lighting'}]});assert.equal(noFragment.provenance.length,0);assert.ok(noFragment.warnings.some(x=>x.startsWith('missing-fragment')));
});
test('same-scene and video routes retain usable settings without inventing automatic compatibility',()=>{
 const entry=snapshotCreativeRecipe(original),same=buildCreativePlan({route:'same',change:'Replace the red paint with blue',selections:[{entry,role:'recipe'}]});
 assert.ok(same.prompt.startsWith(original.prompt));assert.match(same.prompt,/Requested single change/);assert.equal(same.negative,original.negative);
 const video=buildCreativePlan({route:'video',motion:'Rain trickles down the glass.',selections:[{entry,role:'recipe'}]});assert.match(video.prompt,/Rain trickles/);assert.ok(video.warnings.includes('attach-reference'));assert.equal(video.kind,'video');
 assert.throws(()=>buildCreativePlan({selections:[]}));assert.throws(()=>buildCreativePlan({route:'new',selections:[{entry}]}),/scene/);
 assert.equal(normalizeCreativeRecipe({...entry,recipe:{settings:null}}).recipe.settings.width,undefined);
});
test('style mixes are descriptive, limited and traceable; no implicit adult style or model weights',()=>{
 const mix=normalizeStyleMix([{id:'glamour'},{id:'scifi',weight:'support'},{id:'noir',weight:'accent'},{id:'glamour'},{id:'nsfw'},{id:'oil'},{id:'fantasy'}]);
 assert.equal(mix.length,4);assert.equal(mix[0].weight,'lead');assert.ok(!mix.some(x=>x.id==='nsfw'));
 const text=describeStyleMix(mix);assert.match(text,/Glamour/);assert.match(text,/Sci-fi/);assert.match(text,/Subtle accent.*Film noir/);assert.doesNotMatch(text,/<lora|\([^)]+:0\./);
 assert.match(describeStyleMix(mix,'HU'),/Meghatározó/);assert.ok(styleMixWarnings(mix).includes('mixed-media'));
 const plan=buildCreativePlan({selections:[{entry:snapshotCreativeRecipe(original)}],styleText:text});assert.ok(plan.provenance.some(x=>x.role==='style-mix'));assert.match(plan.prompt,/Visual direction mix/);
});
test('a saved composite retains original sources without claiming generated settings',()=>{
 const plan=buildCreativePlan({route:'new',scene:'A snowy library',selections:[{entry:snapshotCreativeRecipe(original,{role:'lighting',excerpt:'Soft amber light.'}),role:'lighting'}]});
 const draft=snapshotCreativeRecipe({filename:'Saved draft',prompt:plan.prompt,origins:plan.provenance,language:'EN'});
 assert.deepEqual(draft.recipe.settings,{});assert.equal(draft.origins[0].sourceId,'abc123');
 const store=createCreativeRecipeStore(memory());store.save(draft);
 const next=buildCreativePlan({route:'same',selections:[{entry:store.list()[0],role:'recipe'}]});assert.ok(next.provenance.some(x=>x.sourceId==='abc123'));
 assert.equal(next.language,'EN');
});
