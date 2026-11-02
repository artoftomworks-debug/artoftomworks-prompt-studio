import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {localAiSetupState,localAiSetupLabels,attachLocalAiSetup,LOCAL_AI_STARTER_COMMAND} from './dist/local-ai-setup.mjs';
import {attachLocalModelPicker,inspectLocalModelInventory,imageCapability} from './dist/ai-hub.mjs';
class E{
 constructor(tag='div'){this.tagName=tag.toUpperCase();this.children=[];this.handlers={};this.value='';this.textContent='';this.disabled=false;this.open=false;}
 append(...nodes){this.children.push(...nodes);}before(node){this.beforeNode=node;}replaceChildren(...nodes){this.children=nodes;this.value=nodes[0]?.value||'';}
 setAttribute(k,v){this[k]=v;}addEventListener(k,fn){(this.handlers[k]??=[]).push(fn);}async emit(k){for(const fn of this.handlers[k]||[])await fn({target:this});}
 all(){return [this,...this.children.flatMap(c=>c.all?.()||[])];}
}
const settle=async()=>{for(let i=0;i<8;i++)await new Promise(r=>setImmediate(r));};
function env(){
 globalThis.document={createElement:t=>new E(t),getElementById:()=>null};globalThis.Option=class extends E{constructor(text,value){super('option');this.textContent=text;this.value=value;}};
 globalThis.location={protocol:'http:',hostname:'127.0.0.1',origin:'http://127.0.0.1:18819'};
 const storage=new Map();globalThis.localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)};return storage;
}
const response=models=>({ok:true,json:async()=>({models})});
test('states distinguish connection, empty, text-only, unknown capabilities and readiness',()=>{
 const model=capabilities=>({name:'local',capabilities});
 const state=options=>localAiSetupState({vision:true,capability:imageCapability,...options});
 assert.equal(state({loading:true,offline:true}),'checking');assert.equal(state({offline:true}),'offline');assert.equal(state({inventory:[]}),'empty');
 assert.equal(state({inventory:[model(['completion'])]}),'textOnly');assert.equal(state({inventory:[{name:'unknown'},model(['completion'])]}),'unverified');
 assert.equal(state({inventory:[model(['vision'])]}),'ready');assert.equal(state({vision:false,inventory:[model(['completion'])]}),'ready');
});
test('all eight languages have complete guidance, official links, copy feedback and deliberate retry',async()=>{
 env();for(const language of ['EN','HU','DE','FR','ES','IT','PT','PL']){
  const host=new E();let retries=0,copied='';Object.defineProperty(globalThis,'navigator',{configurable:true,value:{clipboard:{writeText:async s=>copied=s}}});
  const setup=attachLocalAiSetup({host,getLanguage:()=>language,onRetry:()=>retries++}),w=localAiSetupLabels(language);
  assert.equal(Object.keys(w).length,18);assert.ok(Object.values(w).every(v=>typeof v==='string'&&v.length>5));
  assert.equal(setup.update('offline'),w.offline);assert.equal(setup.root.open,true);setup.root.open=false;setup.update('offline');assert.equal(setup.root.open,false,'manual collapse persists while state is unchanged');
  const nodes=host.all(),links=nodes.filter(n=>n.tagName==='A'),buttons=nodes.filter(n=>n.tagName==='BUTTON');
  assert.deepEqual(links.map(n=>n.href),['https://ollama.com/download/windows','https://ollama.com/library/gemma3:4b']);assert.ok(links.every(n=>n.rel==='noopener noreferrer'));
  await buttons[0].emit('click');assert.equal(copied,LOCAL_AI_STARTER_COMMAND);assert.ok(nodes.some(n=>n.textContent===w.copied));
  navigator.clipboard.writeText=async()=>{throw Error('denied')};await buttons[0].emit('click');assert.ok(nodes.some(n=>n.textContent===w.copyFailed));
  setup.update('checking');await buttons[1].emit('click');assert.equal(retries,0);setup.update('empty');await buttons[1].emit('click');assert.equal(retries,1);setup.update('ready');assert.equal(setup.root.open,false);
 }
});
test('fresh-install selector recovers from offline to empty, text-only, unverified and a selected vision model without sending media',async()=>{
 env();let mode='offline',calls=[],language='HU';globalThis.fetch=async(url,options={})=>{
  calls.push({url,options});if(mode==='offline')throw Error('connection');if(url.endsWith('/api/show'))return {ok:false};
  if(mode==='empty')return response([]);if(mode==='text')return response([{name:'text',capabilities:['completion']}]);if(mode==='unknown')return response([{name:'custom'}]);return response([{name:'custom',capabilities:['vision']}]);
 };
 const before=new E(),picker=attachLocalModelPicker({before,getLanguage:()=>language,vision:true});await settle();const wrap=before.beforeNode,select=wrap.all().find(n=>n.tagName==='SELECT'),setup=wrap.children.find(n=>n.tagName==='DETAILS');
 const retry=setup.all().filter(n=>n.tagName==='BUTTON')[1],stateText=()=>setup.children[1].textContent;
 assert.equal(stateText(),localAiSetupLabels('HU').offline);assert.equal(select.disabled,true);
 for(const [next,state]of [['empty','empty'],['text','textOnly'],['unknown','unverified'],['vision','ready']]){mode=next;await retry.emit('click');await settle();assert.equal(stateText(),localAiSetupLabels('HU')[state]);}
 assert.equal(select.value,'custom');assert.equal(select.disabled,false);assert.equal((await picker.getSelected()).name,'custom');
 mode='offline';assert.equal(await picker.getSelected(),null);assert.equal(picker.message(),localAiSetupLabels('HU').offline);
 assert.ok(calls.every(c=>c.url.endsWith('/api/tags')||c.url.endsWith('/api/show')));assert.ok(calls.every(c=>!String(c.options.body).includes('images')));
});
test('malformed API data is not reported as an empty installation and cloud-only models are excluded',async()=>{
 env();globalThis.fetch=async()=>({ok:true,json:async()=>({unexpected:true})});await assert.rejects(()=>inspectLocalModelInventory(),/Invalid Ollama/);
 globalThis.fetch=async()=>response([{name:'one:cloud'},{name:'two-cloud'},{name:'real',capabilities:['vision']}]);assert.deepEqual((await inspectLocalModelInventory()).map(m=>m.name),['real']);
});
test('late refresh responses cannot replace a newer inventory',async()=>{
 env();const pending=[];globalThis.fetch=()=>new Promise(resolve=>pending.push(resolve));const before=new E();const picker=attachLocalModelPicker({before,getLanguage:()=> 'EN',vision:true});
 const wrap=before.beforeNode,refresh=wrap.children[1],selected=picker.getSelected();assert.equal(pending.length,2);
 pending[1](response([{name:'new',capabilities:['vision']}]));await selected;pending[0](response([]));await settle();assert.equal(wrap.all().find(n=>n.tagName==='SELECT').value,'new');assert.equal(refresh.disabled,false);
});
test('docs and actual bundled navigation target are included in the source release',()=>{
 const read=p=>readFileSync(new URL(p,import.meta.url),'utf8'),html=read('./dist/ArtofTomworks_Prompt_Studio_OFFLINE.html');
 assert.ok(html.includes('id="local-ai-setup-section"'));assert.ok(html.includes('function attachLocalAiSetup'));assert.ok(html.includes(LOCAL_AI_STARTER_COMMAND));
 const guide=read('./LOCAL_AI_FIRST_RUN_8_LANGUAGES.md');for(const heading of ['English','Magyar','Deutsch','Français','Español','Italiano','Português','Polski'])assert.ok(guide.includes('## '+heading));
 for(const doc of ['README.md','README_HU.md','QUICKSTART_8_LANGUAGES.md','LOCAL_AI_GUIDE.md'])assert.ok(read('./'+doc).includes('LOCAL_AI_FIRST_RUN_8_LANGUAGES.md'));
});
