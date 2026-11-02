import {test} from 'node:test';
import assert from 'node:assert/strict';
import {attachAiHub,AI_DRAFT_KEY,readAiDraft,writeAiDraft} from './dist/ai-hub.mjs';
import {localAiSetupLabels} from './dist/local-ai-setup.mjs';
let nodes,storage,events,pages,requests,chatHandler,language='HU',source='Original source';
class Element{
 constructor(){this.value='';this.textContent='';this.checked=true;this.handlers={};this.children=[];this.open=false;this.scrollTop=0;this.classList={add(){},remove(){}};}
 set id(value){this._id=value;nodes?.set('#'+value,this);}get id(){return this._id;}
 querySelector(key){return node(key);}addEventListener(type,fn){(this.handlers[type]??=[]).push(fn);}
 setAttribute(){}removeAttribute(){}before(){}prepend(){}append(...items){this.children.push(...items);}
 showModal(){this.open=true;}close(){this.open=false;this.fire('close');}focus(){}
 replaceChildren(...items){this.children=items;this.value=items[0]?.value||'';}
 async fire(type,event={}){for(const fn of this.handlers[type]||[])await fn({...event,target:this});}
 getContext(){return {fillRect(){},drawImage(){}};}toDataURL(){return 'data:image/jpeg;base64,PRIVATEIMAGE';}
}
const node=id=>{if(!nodes.has(id))nodes.set(id,new Element());return nodes.get(id);};
const settle=async()=>{for(let i=0;i<8;i++)await new Promise(r=>setImmediate(r));};
function setup(resetStorage=true){
 nodes=new Map();if(resetStorage)storage=new Map();events={};pages={};requests=[];source='Original source';chatHandler=null;
 globalThis.document={createElement:()=>new Element(),getElementById:id=>node('#'+id),querySelector:node,body:new Element(),addEventListener:(k,fn)=>(events[k]??=[]).push(fn)};
 globalThis.addEventListener=(k,fn)=>pages[k]=fn;
 globalThis.Option=class{constructor(text,value){this.text=text;this.value=value;}};
 globalThis.localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)};
 globalThis.location={protocol:'http:',hostname:'127.0.0.1',origin:'http://127.0.0.1:18819'};
 globalThis.confirm=()=>true;
 globalThis.Image=class{naturalWidth=1000;naturalHeight=1500;set src(v){queueMicrotask(()=>this.onload());}};
 globalThis.fetch=async(url,options={})=>{requests.push({url,options});if(url==='/api/chat')return chatHandler?chatHandler(options):{ok:true,json:async()=>({message:{content:'Notes\n[[PROMPT]]\nA quiet landscape.\n[[/PROMPT]]'}})};return {ok:true,json:async()=>({models:[{name:'text-model',capabilities:['completion']},{name:'vision-model',capabilities:['completion','vision']}]})};};
 node('#ai-hub-provider').value='ollama';node('#ai-hub-task').value='improve';
 return attachAiHub({getLanguage:()=>language,getCurrent:()=>({prompt:source})});
}
async function chooseTask(task){node('#ai-hub-task').value=task;await node('#ai-hub-task').fire('change');}
async function enter(id,value){node('#ai-hub-'+id).value=value;await node('#ai-hub-'+id).fire('input');}
async function image(){const file=new Blob(['x'],{type:'image/png'});file.name='private.png';node('#ai-hub-image-input').files=[file];await node('#ai-hub-image-input').fire('change');await settle();}

test('close and normal reopen preserve request, response, attached image, options and scroll in all languages',async()=>{
 for(language of ['EN','HU','DE','FR','ES','IT','PT','PL']){
  const hub=setup();hub.open();await settle();await image();await chooseTask('image-video');await enter('question','Slow rain');await enter('context','My scene');await enter('response','My edited answer');await enter('video-duration','6');await enter('video-target','LTX');node('#ai-hub-video-quality').checked=false;
  const dialog=node('#ai-hub-dialog');dialog.scrollTop=430;await dialog.fire('scroll');dialog.close();source='Different current gallery item';hub.open();await settle();
  assert.equal(node('#ai-hub-question').value,'Slow rain');assert.equal(node('#ai-hub-context').value,'My scene');assert.equal(node('#ai-hub-response').value,'My edited answer');assert.equal(node('#ai-hub-task').value,'image-video');assert.equal(node('#ai-hub-video-duration').value,'6');assert.equal(node('#ai-hub-video-target').value,'LTX');assert.equal(node('#ai-hub-video-quality').checked,false);assert.equal(node('#ai-hub-image-preview-wrap').hidden,false);assert.equal(dialog.scrollTop,430);assert.equal(node('#ai-hub-model').value,'vision-model');assert.ok(node('#ai-hub-new-request').textContent);assert.equal(requests.filter(r=>r.url==='/api/chat').length,0);dialog.close();
 }
});
test('page reload restores text drafts and previous state without storing or sending image bytes',async()=>{
 const hub=setup();hub.open();await settle();await image();await chooseTask('custom');await enter('question','My question');await enter('response','Saved answer');node('#ai-hub-dialog').close();
 assert.ok(!storage.get(AI_DRAFT_KEY).includes('PRIVATEIMAGE'));assert.ok(readAiDraft(localStorage).current.response==='Saved answer');
 const reloaded=setup(false);reloaded.open();await settle();assert.equal(node('#ai-hub-question').value,'My question');assert.equal(node('#ai-hub-response').value,'Saved answer');assert.equal(node('#ai-hub-image-preview-wrap').hidden,true);assert.equal(requests.filter(r=>r.url==='/api/chat').length,0);node('#ai-hub-dialog').close();
});
test('explicit new gallery context is reversible, including image; previous-state button swaps without resending',async()=>{
 const hub=setup();hub.open();await settle();await image();await enter('question','Original question');await enter('response','Original answer');
 await events['prompt-studio-ask-ai'][0]({detail:{text:'New gallery prompt',question:'New question',task:'custom'}});await settle();
 assert.equal(node('#ai-hub-context').value,'New gallery prompt');assert.equal(node('#ai-hub-response').value,'');assert.equal(node('#ai-hub-question').value,'New question');
 await node('#ai-hub-previous-state').fire('click');await settle();assert.equal(node('#ai-hub-response').value,'Original answer');assert.equal(node('#ai-hub-question').value,'Original question');assert.equal(node('#ai-hub-image-preview-wrap').hidden,false);
 await node('#ai-hub-previous-state').fire('click');await settle();assert.equal(node('#ai-hub-context').value,'New gallery prompt');assert.equal(requests.filter(r=>r.url==='/api/chat').length,0);node('#ai-hub-dialog').close();
});
test('task change and confirmed New request preserve the previous work; cancelled New request changes nothing',async()=>{
 const hub=setup();hub.open();await settle();await chooseTask('custom');await enter('question','Keep me');await enter('response','Keep answer');await chooseTask('image-video');await node('#ai-hub-previous-state').fire('click');await settle();assert.equal(node('#ai-hub-task').value,'custom');assert.equal(node('#ai-hub-question').value,'Keep me');assert.equal(node('#ai-hub-response').value,'Keep answer');
 globalThis.confirm=()=>false;await node('#ai-hub-new-request').fire('click');assert.equal(node('#ai-hub-response').value,'Keep answer');globalThis.confirm=()=>true;await node('#ai-hub-new-request').fire('click');assert.equal(node('#ai-hub-context').value,'');assert.equal(node('#ai-hub-response').value,'');await node('#ai-hub-previous-state').fire('click');await settle();assert.equal(node('#ai-hub-response').value,'Keep answer');node('#ai-hub-dialog').close();
});
test('a response arriving while panel is closed is saved; replacement prevents a stale response overwrite',async()=>{
 const hub=setup();hub.open();await settle();let resolveChat;chatHandler=()=>new Promise(r=>resolveChat=r);await node('#ai-hub-submit').fire('click');await settle();node('#ai-hub-dialog').close();resolveChat({ok:true,json:async()=>({message:{content:'Background answer'}})});await settle();hub.open();await settle();assert.match(node('#ai-hub-response').value,/Background answer/);
 await node('#ai-hub-submit').fire('click');await settle();hub.open('New context');resolveChat({ok:true,json:async()=>({message:{content:'Stale answer'}})});await settle();assert.equal(node('#ai-hub-context').value,'New context');assert.equal(node('#ai-hub-response').value,'');node('#ai-hub-dialog').close();
});
test('blocked or corrupt storage cannot erase the in-memory work or unrelated preferences',async()=>{
 const hub=setup();hub.open();await settle();await enter('response','Precious work');localStorage.setItem=()=>{throw Error('quota')};node('#ai-hub-dialog').close();assert.ok(node('#ai-hub-draft-warning').textContent);hub.open();assert.equal(node('#ai-hub-response').value,'Precious work');node('#ai-hub-dialog').close();
 storage.set('unrelated','keep');storage.set(AI_DRAFT_KEY,'broken');assert.throws(()=>readAiDraft(localStorage));assert.equal(storage.get('unrelated'),'keep');
 const before=storage.get(AI_DRAFT_KEY);assert.throws(()=>writeAiDraft(localStorage,{provider:'bad'},null));assert.equal(storage.get(AI_DRAFT_KEY),before);
});

test('reload of a pending request restores text with an interruption message and never resubmits',async()=>{
 const hub=setup();hub.open();await settle();await chooseTask('custom');await enter('question','Do not lose this');let resolveChat;chatHandler=()=>new Promise(r=>resolveChat=r);await node('#ai-hub-submit').fire('click');await settle();pages.pagehide();assert.equal(readAiDraft(localStorage).current.pending,true);
 const reloaded=setup(false);reloaded.open();await settle();assert.equal(node('#ai-hub-question').value,'Do not lose this');assert.ok(node('#ai-hub-status').textContent);assert.notEqual(node('#ai-hub-status').textContent,'');assert.equal(requests.filter(r=>r.url==='/api/chat').length,0);node('#ai-hub-dialog').close();
 resolveChat({ok:false,json:async()=>({})});await settle();
});

test('AI hub setup retries distinguish empty, text-only and unverified models without losing drafts or sending images',async()=>{
 language='HU';const hub=setup();let mode='offline';
 globalThis.fetch=async(url,options={})=>{
  requests.push({url,options});if(mode==='offline')throw Error('offline');
  if(url==='/api/show')return {ok:false};
  const models=mode==='empty'?[]:mode==='text'?[{name:'text',capabilities:['completion']}]:mode==='unknown'?[{name:'custom'}]:[{name:'vision',capabilities:['vision']}];
  return {ok:true,json:async()=>({models})};
 };
 hub.open();await settle();const root=node('#ai-hub-local-setup').children[0],retry=root.children[3].children[1],text=()=>root.children[1].textContent,w=localAiSetupLabels('HU');
 assert.equal(text(),w.offline);await chooseTask('custom');await enter('question','Keep this question');await enter('response','Keep this answer');
 mode='empty';await retry.fire('click');await settle();assert.equal(text(),w.empty);
 mode='text';await retry.fire('click');await settle();assert.equal(text(),w.ready);await image();assert.equal(text(),w.textOnly);
 await enter('response','Keep image answer');mode='unknown';await retry.fire('click');await settle();assert.equal(text(),w.unverified);
 mode='vision';await retry.fire('click');await settle();assert.equal(text(),w.ready);assert.equal(node('#ai-hub-model').value,'vision');
 assert.equal(node('#ai-hub-question').value,'Keep this question');assert.equal(node('#ai-hub-response').value,'Keep image answer');
 node('#ai-hub-provider').value='other';await node('#ai-hub-provider').fire('change');assert.equal(root.hidden,true);
 assert.equal(requests.filter(r=>r.url==='/api/chat').length,0);assert.ok(requests.every(r=>!String(r.options.body).includes('PRIVATEIMAGE')));node('#ai-hub-dialog').close();
});
