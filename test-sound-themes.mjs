import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {randomUUID} from 'node:crypto';
import {Readable,PassThrough} from 'node:stream';
import {once} from 'node:events';
import {soundWorkshopCore,soundHandoffCore} from './sound-workshop-core.mjs';
import {soundWorkshopApp,soundWorkshopLabels} from './dist/sound-workshop-ui.mjs';
import {createSoundWorkshopService} from './sound-workshop-server.mjs';
import {StudioNode} from './series-test-dom.mjs';
const C=soundWorkshopCore(),samplesRoot=fileURLToPath(new URL('./sound-samples/',import.meta.url)),catalog=JSON.parse(await readFile(join(samplesRoot,'catalog.json'),'utf8'));

test('legacy sound state upgrades without losing presets, rights notes or favorites; own themes are bounded and reference-checked',()=>{
 const before={version:1,revision:3,metadata:{'sample:rain-window':{favorite:true,license:'Keep this note',tags:'Rain'}},presets:[{id:randomUUID(),name:'Saved mood',tracks:[{key:'sample:rain-window',gain:-12}]}]},next=C.state(before);assert.deepEqual(next.themes,[]);assert.equal(next.metadata['sample:rain-window'].license,'Keep this note');assert.equal(next.metadata['sample:rain-window'].favorite,true);assert.equal(next.presets[0].tracks[0].gain,-12);assert.equal(before.metadata['sample:rain-window'].theme,undefined);
 const id='custom:'+randomUUID();const grouped=C.state({...next,themes:[{id,name:'My Arena'}],metadata:{...next.metadata,'sample:rain-window':{theme:id}}});assert.equal(grouped.metadata['sample:rain-window'].theme,id);assert.throws(()=>C.state({...grouped,themes:[]}));assert.throws(()=>C.metadata({theme:'../../private'}));assert.throws(()=>C.state({...next,themes:[{id,name:'Álom'},{id:'custom:'+randomUUID(),name:'alom'}]}));assert.throws(()=>C.state({...next,themes:Array.from({length:31},(_,i)=>({id:'custom:'+randomUUID(),name:'T'+i}))}));
 for(const lang of C.languages){assert.equal(C.themeOptions(lang).length,14);assert.ok(C.themeOptions(lang).every(t=>t.name));}
});

test('theme-aware search supports groups and global phrases without changing saved arrangements',()=>{
 const item={...catalog.samples[0],theme:'arena',themeNames:C.builtinThemes.arena.split('|')};assert.equal(C.matches(item,{theme:'arena'}),true);assert.equal(C.matches(item,{theme:'city'}),false);assert.equal(C.matches(item,{query:'wrestling'}),true);assert.equal(C.matches(item,{query:'arena / sport'}),true);assert.equal(C.matches(item,{query:'crowd is waiting',theme:'arena',kind:'voice'}),true);
});

test('server creates, renames, assigns and removes own themes transactionally; deleting a theme keeps files and arrangements',async()=>{
 const root=await mkdtemp(fileURLToPath(new URL('./theme-fixture-',import.meta.url))),video={ready:async()=>({ready:true,assets:[]})},s=createSoundWorkshopService({root,samplesRoot,video});
 const post=async(path,value)=>{const req=Readable.from([Buffer.from(JSON.stringify(value))]);req.method='POST';req.headers={origin:'http://127.0.0.1:18819','content-type':'application/json','x-prompt-studio-action':'sound-workshop'};const res=new PassThrough(),chunks=[];res.writeHead=code=>{res.statusCode=code;res.headersSent=true;};res.on('data',b=>chunks.push(b));const finished=once(res,'finish');await s.handle(req,res,new URL('/api/sound/'+path,'http://127.0.0.1:18819'),'http://127.0.0.1:18819');await finished;return {code:res.statusCode,data:JSON.parse(Buffer.concat(chunks))};};
 let state=(await s.status()).state;let result=await post('theme',{revision:state.revision,name:'Aréna tömeg'});assert.equal(result.code,200);state=result.data.state;const id=state.themes[0].id;result=await post('metadata',{revision:state.revision,key:'sample:arena-intro-en',values:{theme:id,favorite:true,license:'Keep note'}});assert.equal(result.code,200);state=result.data.state;
 result=await post('metadata',{revision:state.revision,key:'sample:arena-intro-en',values:{favorite:false,license:'Keep note'}});assert.equal(result.code,200);state=result.data.state;assert.equal(state.metadata['sample:arena-intro-en'].theme,id,'old clients without the new field preserve classification');
 result=await post('theme-rename',{revision:state.revision,id,name:'Bemondó és közönség'});assert.equal(result.code,200);state=result.data.state;assert.equal(state.themes[0].name,'Bemondó és közönség');assert.equal((await post('theme',{revision:0,name:'Stale write'})).code,400);
 result=await post('preset',{revision:state.revision,name:'Keep this arrangement',tracks:[{key:'sample:arena-intro-en',gain:-3}]});assert.equal(result.code,200);state=result.data.state;
 const soundBefore=await readFile(join(samplesRoot,'arena-intro-en.wav'));result=await post('theme-delete',{revision:state.revision,id});assert.equal(result.code,200);state=result.data.state;assert.equal(state.metadata['sample:arena-intro-en'].theme,'other');assert.equal(state.presets[0].name,'Keep this arrangement');assert.equal(state.metadata['sample:arena-intro-en'].license,'Keep note');assert.deepEqual(await readFile(join(samplesRoot,'arena-intro-en.wav')),soundBefore);assert.equal((await post('theme-delete',{revision:state.revision,id:'arena'})).code,400);
 const reopened=createSoundWorkshopService({root,samplesRoot,video});assert.deepEqual((await reopened.status()).state,state);
});

test('theme and variant selectors filter cards, avoid autoplay, restore the chosen theme, and permit assigning a sound',async()=>{
 const body=new StudioNode('body'),values=new Map();let plays=0;class N extends StudioNode{load(){}play(){plays++;return Promise.resolve();}}
 globalThis.document={body,documentElement:{},createElement:tag=>new N(tag),createTextNode:()=>new N('#text')};globalThis.window={addEventListener(){},open(){}};globalThis.localStorage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v)};globalThis.confirm=()=>true;
 let state=C.state();const calls=[];globalThis.fetch=async(url,options={})=>{calls.push({url,options});let result={state,samples:catalog.samples,presets:catalog.presets,assets:[]};if(url.endsWith('/metadata')){const body=JSON.parse(options.body);state=C.state({...state,revision:state.revision+1,metadata:{...state.metadata,[body.key]:body.values}});result={state};}return {ok:true,json:async()=>result};};
 const ui=soundWorkshopApp('HU',soundWorkshopCore,soundHandoffCore,soundWorkshopLabels);await new Promise(r=>setImmediate(r));const topic=body.querySelector('[data-sw-field="theme"]');topic.value='arena';await topic.emit('change');assert.equal(body.querySelectorAll('.sw-card').length,1);const picker=body.querySelector('[data-sw-field="sound"]');assert.equal(picker.options.length,2);picker.value='sample:arena-intro-en';await picker.emit('change');assert.equal(plays,0);assert.match(body.querySelector('audio').src,/arena-intro-en/);assert.match(body.querySelector('.sw-transcript').textContent,/The lights are up/);
 await ui.assignTheme('sample:arena-intro-en','city');assert.equal(ui.getData().state.metadata['sample:arena-intro-en'].theme,'city');assert.equal(body.querySelectorAll('.sw-card').length,0);assert.equal(JSON.parse(values.get('artoftomworks.v2.soundWorkshop.draft')).filters.theme,'arena');topic.value='';await topic.emit('change');const search=body.querySelector('[data-sw-field="search"]');search.value='crowd is waiting';await search.emit('input');assert.equal(body.querySelectorAll('.sw-card').length,1);
 for(const lang of C.languages)assert.ok(['theme','sound','addTheme','removeTheme','themeHelp'].every(k=>soundWorkshopLabels(lang)[k]));
});
