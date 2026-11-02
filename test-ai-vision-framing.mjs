import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Script} from 'node:vm';
import {attachAiHub,imageCapability,buildImagePromptRequest,inspectLocalModelInventory,attachLocalModelPicker} from './dist/ai-hub.mjs';
import {surpriseLayout,attachSurprisePrompt} from './dist/creative-forge.mjs';

assert.equal(imageCapability({name:'gemma3:4b'}),null,'names do not prove image support');
assert.equal(imageCapability({capabilities:['completion']}),false);
assert.equal(imageCapability({capabilities:['completion','vision']}),true);
assert.equal(surpriseLayout({width:'768',height:'1344',framing:'full'}).valid,true);
assert.match(surpriseLayout({width:'768',height:'1344',framing:'full'}).text,/head to toe.*4:7.*portrait/);
for(const dims of [[0,0],[1024,''],[777,1024],[256.5,512],[8193,1024]])assert.equal(surpriseLayout({width:dims[0],height:dims[1]}).valid,false);
assert.equal(surpriseLayout({}).text,'');
assert.match(buildImagePromptRequest({task:'image-soften'}),/fully clothed.*omit sexual acts/is);

let nodes,storage=new Map(),inventory,requests=[],visionDetails=true;
class Element{
 constructor(){this.value='';this.handlers={};this.children=[];this.open=false;this.classList={add(){},remove(){}};}
 querySelector(key){return node(key);} addEventListener(type,fn){this.handlers[type]=fn;}
 setAttribute(){} removeAttribute(){} before(){} prepend(){} append(){}
 showModal(){this.open=true;} close(){this.open=false;this.fire('close');} focus(){} setSelectionRange(){}
 replaceChildren(...items){this.children=items;this.value=items[0]?.value||'';}
 add(item){this.children.push(item);} fire(type,event={}){return this.handlers[type]?.({...event,target:this});}
 getContext(){return {fillRect(){},drawImage(){}};} toDataURL(){return 'data:image/jpeg;base64,TESTIMAGE';}
}
const node=id=>{if(!nodes.has(id))nodes.set(id,new Element());return nodes.get(id);};
function reset(){nodes=new Map();globalThis.document={createElement:()=>new Element(),getElementById:id=>node('#'+id),querySelector:node,body:new Element(),addEventListener(){},dispatchEvent(){return true;}};node('#ai-hub-provider').value='ollama';node('#ai-hub-task').value='improve';}
globalThis.Option=class{constructor(text,value){this.text=text;this.value=value;}};
globalThis.localStorage={getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,value)};
globalThis.location={protocol:'http:',hostname:'127.0.0.1',origin:'http://127.0.0.1:18819'};
globalThis.Image=class{naturalWidth=1000;naturalHeight=1500;set src(value){queueMicrotask(()=>this.onload());}};
globalThis.fetch=async(url,options={})=>{
 requests.push({url,options});
 if(url.endsWith('/api/tags'))return {ok:true,json:async()=>({models:inventory.map(item=>({...item}))})};
 if(url.endsWith('/api/show'))return {ok:visionDetails,json:async()=>({capabilities:['completion','vision']})};
 if(url.endsWith('/api/chat'))return {ok:true,json:async()=>({message:{content:'Notes\n[[PROMPT]]\nA quiet non-sexual fine-art portrait.\n[[/PROMPT]]'}})};
 throw Error('Unexpected endpoint '+url);
};
async function settle(){for(let i=0;i<5;i++)await new Promise(resolve=>setImmediate(resolve));}
inventory=[{name:'dolphin3:8b',capabilities:['completion']},{name:'custom-vision',capabilities:['completion','vision']},{name:'unverified'}];
let items=await inspectLocalModelInventory();assert.equal(imageCapability(items.find(item=>item.name==='unverified')),true);
assert(requests.filter(item=>item.url==='/api/show').every(item=>!item.options.body.includes('TESTIMAGE')));
visionDetails=false;items=await inspectLocalModelInventory();assert.equal(imageCapability(items.find(item=>item.name==='unverified')),null);

storage.set('artoftomworks.v2.aiAssistant.localModel','dolphin3:8b');
reset();let hub=attachAiHub({getLanguage:()=> 'HU',getCurrent:()=>({prompt:''})});hub.open();await settle();
assert.equal(node('#ai-hub-model').value,'dolphin3:8b');
node('#ai-hub-image-input').files=[new Blob(['dummy'],{type:'image/png'})];
node('#ai-hub-image-input').fire('change');await settle();
assert.equal(node('#ai-hub-task').value,'image-prompt');
assert.deepEqual(node('#ai-hub-model').children.map(item=>item.value),['custom-vision']);
assert.equal(node('#ai-hub-model').value,'custom-vision');
assert.equal(requests.filter(item=>item.url==='/api/chat').length,0,'image is not transmitted until click');
node('#ai-hub-model').fire('change');
assert.equal(storage.get('artoftomworks.v2.aiAssistant.visionModel'),'custom-vision');
node('#ai-hub-submit').fire('click');await settle();
let chat=requests.findLast(item=>item.url==='/api/chat');assert.equal(JSON.parse(chat.options.body).model,'custom-vision');assert.equal(JSON.parse(chat.options.body).messages[0].images[0],'TESTIMAGE');
assert.match(node('#ai-hub-response').value,/\[\[PROMPT\]\]/);
node('#ai-hub-image-remove').fire('click');assert.equal(node('#ai-hub-model').value,'dolphin3:8b','removing image restores text preference');
// No verified vision model must block any image-bearing request.
inventory=[{name:'dolphin3:8b',capabilities:['completion']},{name:'unknown'}];requests=[];
hub.open();await settle();node('#ai-hub-image-input').fire('change');await settle();
assert.equal(node('#ai-hub-model').children.length,0);assert.equal(node('#ai-hub-submit').disabled,true);
node('#ai-hub-submit').fire('click');await settle();assert(!requests.some(item=>item.url==='/api/chat'));

// Dedicated image-to-video selector uses capabilities and shares the vision preference.
inventory=[{name:'dolphin3:8b',capabilities:['completion']},{name:'custom-vision',capabilities:['vision']}];
const picker=attachLocalModelPicker({before:new Element(),getLanguage:()=> 'EN',vision:true});await settle();
assert.equal((await picker.getSelected()).name,'custom-vision');

for(const language of ['HU','EN','DE','FR','ES','IT','PT','PL']){
 reset();node('#surprise-theme').value='nsfw';node('#surprise-kind').value='image';node('#surprise-framing').value='auto';
 attachSurprisePrompt({getLanguage:()=>language,getMode:()=> 'image',getCurrent:()=>({}),restore(){}});
 node('#surprise-resolution').value='768x1344';node('#surprise-resolution').fire('change');
 node('#surprise-framing').value='full';node('#surprise-framing').fire('change');
 node('#surprise-generate').fire('click');
 assert.match(node('#surprise-output').value,/Full-body.*768 × 1344/s);
 assert(node('#surprise-resolution').children.some(item=>item.value==='custom'));
}
const html=readFileSync(new URL('./dist/ArtofTomworks_Prompt_Studio_OFFLINE.html',import.meta.url),'utf8');
const inline=html.match(/<script>\s*([\s\S]*?)\s*<\/script>/u)?.[1];assert(inline);new Script(inline);
assert(!/^import /m.test(inline),'offline HTML contains no unresolved imports');
const i2v=readFileSync(new URL('./dist/i2v-ui.mjs',import.meta.url),'utf8');assert(!i2v.includes('const vision = tags.models?.find'));assert(i2v.includes('visionPicker.getSelected'));
console.log('PASS: metadata capability discovery, unknown-model handling, no implicit image transfer, vision-only dropdown, image generation, missing-vision blocking, separate remembered text/vision choices, dedicated I2V picker, eight-language size/framing UI, custom validation, full-body prompt and offline bundle.');
