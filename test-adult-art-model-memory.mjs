import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Script } from 'node:vm';
import { buildSurprisePrompt, surpriseThemes, attachSurprisePrompt } from './dist/creative-forge.mjs';
import { attachAiHub, selectLocalModel } from './dist/ai-hub.mjs';

assert(surpriseThemes.includes('nsfw'));
for (let i=0;i<1000;i++) {
  const random=()=>i/1000;
  assert.notEqual(buildSurprisePrompt({theme:'any',random}).theme,'nsfw');
  for (const kind of ['image','video']) {
    const result=buildSurprisePrompt({theme:'nsfw',kind,model:'other',random});
    assert.match(result.prompt,/adult (woman|man) aged (30|35|38|40|45|50)/i);
    assert.match(result.prompt,/non-sexual/);
    assert.equal(result.kind,kind);
    assert.equal(result.theme,'nsfw');
    if(kind==='image')assert.match(result.negative,/fingers/);
  }
}
assert.equal(selectLocalModel(['gemma3:4b','dolphin3:8b'],'dolphin3:8b'),'dolphin3:8b');
assert.equal(selectLocalModel(['gemma3:4b'],'missing'),'gemma3:4b');
assert.equal(selectLocalModel([],'dolphin3:8b'),'');

// Exercise the real UI handlers using an in-memory DOM and local storage.
class Element {
  constructor(){this.value='';this.handlers={};this.children=[];this.classList={add(){},remove(){}};}
  querySelector(key){return node(key);}
  addEventListener(type,fn){this.handlers[type]=fn;}
  setAttribute(){} removeAttribute(){} showModal(){} close(){} focus(){} setSelectionRange(){} prepend(){}
  add(option){this.children.push(option);}
  append(){}
  replaceChildren(...children){this.children=children;this.value=children[0]?.value||'';}
  fire(type){this.handlers[type]?.({target:this});}
}
let nodes;
function node(id){if(!nodes.has(id))nodes.set(id,new Element());return nodes.get(id);}
function resetDom(){
  nodes=new Map();
  globalThis.document={createElement:()=>new Element(),querySelector:node,getElementById:id=>node('#'+id),body:new Element(),addEventListener(){}};
  node('#ai-hub-provider').value='ollama';node('#ai-hub-task').value='improve';
}
globalThis.Option=class {constructor(text,value){this.text=text;this.value=value;}};
const saved=new Map();let blockStorage=false;
globalThis.localStorage={getItem(key){if(blockStorage)throw Error('blocked');return saved.get(key)||null;},setItem(key,value){if(blockStorage)throw Error('blocked');saved.set(key,value);}};
let names=['gemma3:4b','dolphin3:8b'];
globalThis.fetch=async()=>({ok:true,json:async()=>({models:names.map(name=>({name}))})});
const settle=()=>new Promise(resolve=>setImmediate(resolve));
resetDom();
let hub=attachAiHub({getLanguage:()=> 'HU',getCurrent:()=>({prompt:''})});
hub.open();await settle();
assert.equal(node('#ai-hub-model').value,'gemma3:4b');
node('#ai-hub-model').value='dolphin3:8b';node('#ai-hub-model').fire('change');
hub.open();await settle();assert.equal(node('#ai-hub-model').value,'dolphin3:8b');
resetDom();hub=attachAiHub({getLanguage:()=> 'EN',getCurrent:()=>({prompt:''})});
hub.open();await settle();assert.equal(node('#ai-hub-model').value,'dolphin3:8b','survives page recreation');
names=['gemma3:4b'];hub.open();await settle();assert.equal(node('#ai-hub-model').value,'gemma3:4b');
names.push('dolphin3:8b');hub.open();await settle();assert.equal(node('#ai-hub-model').value,'dolphin3:8b','recovers temporarily missing model');
blockStorage=true;resetDom();hub=attachAiHub({getLanguage:()=> 'HU',getCurrent:()=>({prompt:''})});
hub.open();await settle();node('#ai-hub-model').value='dolphin3:8b';node('#ai-hub-model').fire('change');
hub.open();await settle();assert.equal(node('#ai-hub-model').value,'dolphin3:8b','session selection works without storage');

for(const language of ['HU','EN','DE','FR','ES','IT','PT','PL']) {
  resetDom();
  node('#surprise-theme').value='any';node('#surprise-kind').value='image';
  attachSurprisePrompt({getLanguage:()=>language,getMode:()=> 'image',getCurrent:()=>({}),restore(){}});
  const option=node('#surprise-theme').children.find(option=>option.value==='nsfw');
  assert.match(option.text,/NSFW.*18\+/);
}
const html=readFileSync(new URL('./dist/ArtofTomworks_Prompt_Studio_OFFLINE.html',import.meta.url),'utf8');
new Script(html.match(/<script>\s*([\s\S]*?)\s*<\/script>/u)[1]);
console.log('PASS: adult category and opt-in random pool; eight translations; model persistence, missing-model fallback, blocked storage; rebuilt offline script syntax.');
