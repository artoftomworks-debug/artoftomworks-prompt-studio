import assert from 'node:assert/strict';
import {test} from 'node:test';
import {creativeStyles,normalizeCustomStyles,normalizeStyleMix,redistributeStyleMix,describeStyleMix,normalizeCreativeLights,describeCreativeLights,createCreativeMixerStore,creativeMixerKey,buildCreativePlan,snapshotCreativeRecipe} from './dist/creative-recipes.mjs';
import {suggestCreativeMix} from './dist/creative-recipes.mjs';
const memory=()=>{const data=new Map();return {getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)};};
const custom=[{id:'custom_mist',label:'Dream mist',text:'Transparent dreamlike shapes.\nSoft luminous edges.'}];
test('requested style families are distinct and custom visual instructions are retained safely',()=>{
 for(const id of ['abstract','surreal','cyber','cyberpunk'])assert.ok(creativeStyles[id].text);
 assert.notEqual(creativeStyles.cyber.text,creativeStyles.cyberpunk.text);
 const mix=normalizeStyleMix([{id:'custom_mist',percent:60},{id:'surreal',percent:40},{id:'constructor',percent:100}],custom);
 assert.equal(mix.length,2);assert.match(describeStyleMix(mix,'EN',custom),/60%.*Dream mist: Transparent dreamlike shapes\. Soft luminous edges/);
 assert.match(describeStyleMix(mix,'HU',custom),/Meghatározó/);assert.equal(normalizeCustomStyles([{id:'__proto__',label:'bad',text:'bad'}]).length,0);
 const off=describeStyleMix([{id:'glamour',percent:0},{id:'surreal',percent:100}]);assert.doesNotMatch(off,/Glamour/);assert.match(off,/Surrealism/);
 const longStyles=Array.from({length:4},(_,i)=>({id:'custom_long'+i,label:'Long style '+i,text:('descriptive texture '.repeat(75)+'END'+i).slice(-1500)}));
 const styleText=describeStyleMix(longStyles.map(x=>({id:x.id,percent:25})),'EN',longStyles),plan=buildCreativePlan({selections:[{entry:snapshotCreativeRecipe({prompt:'A quiet street.'})}],styleText});assert.ok(styleText.length>4000);assert.ok(plan.prompt.endsWith(styleText));assert.equal(snapshotCreativeRecipe({prompt:plan.prompt,origins:plan.provenance}).origins[1].title,styleText);
});
test('percentage redistribution holds the edited value and totals exactly 100 without mutating input',()=>{
 for(const size of [2,3,4])for(let index=0;index<size;index++)for(let value=0;value<=100;value++){
   const original=['glamour','surreal','abstract','cyber'].slice(0,size).map((id,i)=>({id,percent:i?0:100})),before=JSON.stringify(original);
   const mixed=redistributeStyleMix(original,index,value);assert.equal(mixed[index].percent,value);assert.equal(mixed.reduce((n,x)=>n+x.percent,0),100);assert.ok(mixed.every(x=>Number.isInteger(x.percent)&&x.percent>=0&&x.percent<=100));assert.equal(JSON.stringify(original),before);
 }
 assert.equal(normalizeStyleMix([{id:'abstract',percent:33},{id:'surreal',percent:33},{id:'cyber',percent:33}]).reduce((n,x)=>n+x.percent,0),100);
 assert.deepEqual(normalizeStyleMix([{id:'abstract',percent:0}]).map(x=>x.percent),[0]);
});
test('lighting strengths are independent and 0 does not add a contradictory lighting instruction',()=>{
 const raw={key:70,fill:20,rim:95,ambient:0},lights=normalizeCreativeLights(raw);assert.deepEqual(lights,raw);
 const prompt=describeCreativeLights(raw);assert.match(prompt,/70\/100/);assert.match(prompt,/20\/100/);assert.match(prompt,/95\/100/);assert.doesNotMatch(prompt,/ambient light/);assert.equal(describeCreativeLights({}), '');
 assert.equal(normalizeCreativeLights({key:120,fill:-5}).key,100);assert.equal(normalizeCreativeLights({fill:-5}).fill,0);
});
test('suggestions keep selected identities, respect art media and do not guess custom style lighting',()=>{
 const selected=[{id:'abstract',percent:10},{id:'surreal',percent:90}],before=JSON.stringify(selected);const art=suggestCreativeMix(selected);
 assert.deepEqual(art.mix.map(x=>x.id),['abstract','surreal']);assert.equal(art.mix.reduce((sum,x)=>sum+x.percent,0),100);assert.ok(Object.values(art.lights).every(x=>x===0));assert.equal(JSON.stringify(selected),before);
 const lighting={key:12,fill:23,rim:34,ambient:45},own=suggestCreativeMix([{id:'custom_mist'}],custom,lighting);assert.deepEqual(own.lights,lighting);assert.equal(own.mix[0].id,'custom_mist');assert.equal(own.profile,'custom');
 const empty=suggestCreativeMix([]);assert.deepEqual(empty.mix,[]);assert.equal(empty.profile,'neutral');assert.ok(empty.lights.key>0);assert.ok(!empty.mix.some(x=>x.id==='nsfw'));
});
test('old mixes migrate without an unsolicited write; complete style/light backups round trip',()=>{
 const storage=memory(),legacy=JSON.stringify({version:1,mixes:{classic:[{id:'glamour',weight:'lead'},{id:'scifi',weight:'support'},{id:'noir',weight:'accent'}]},presets:[{name:'Old mix',mix:[{id:'glamour'}]}]});storage.setItem(creativeMixerKey,legacy);
 const store=createCreativeMixerStore(storage),migrated=store.read();assert.equal(migrated.version,2);assert.equal(storage.getItem(creativeMixerKey),legacy);assert.deepEqual(migrated.mixes.classic.map(x=>x.percent),[60,30,10]);
 migrated.customStyles=custom;migrated.mixes.i2v=[{id:'custom_mist',percent:75},{id:'cyber',percent:25}];migrated.lights.i2v={key:60,rim:20};migrated.presets.push({name:'Video light',mix:migrated.mixes.i2v,lights:migrated.lights.i2v});store.save(migrated);
 const backup=store.export(),next=createCreativeMixerStore(memory());next.save(next.parse(backup));assert.deepEqual(next.read(),store.read());assert.equal(createCreativeMixerStore(storage).read().lights.i2v.key,60);
});
test('corruption, stale tabs, invalid imports and quota errors never overwrite mixer data',()=>{
 const storage=memory(),a=createCreativeMixerStore(storage),b=createCreativeMixerStore(storage);const next=a.read();next.mixes.classic=[{id:'abstract'}];a.save(next);const before=storage.getItem(creativeMixerKey);assert.throws(()=>b.save(b.read()),/conflict/);assert.equal(storage.getItem(creativeMixerKey),before);
 assert.throws(()=>a.parse(JSON.stringify({...a.read(),customStyles:[...custom,...custom]})));assert.equal(storage.getItem(creativeMixerKey),before);assert.throws(()=>a.parse(' '.repeat(400001)));
 storage.setItem=()=>{throw Error('quota');};const attempted=a.read();attempted.mixes.classic=[{id:'cyber'}];assert.throws(()=>a.save(attempted),/quota/);assert.equal(a.read().mixes.classic[0].id,'abstract');
 const broken=memory();broken.setItem(creativeMixerKey,'{broken');const damaged=createCreativeMixerStore(broken);assert.ok(damaged.problem());assert.throws(()=>damaged.save(damaged.read()),/storage/);assert.equal(broken.getItem(creativeMixerKey),'{broken');
});
