import assert from 'node:assert/strict';
import {attachAiHub,buildCustomQuestionRequest,extractCopyablePrompt} from './dist/ai-hub.mjs';
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

let copied='',answer='Explanation.\n[[PROMPT]]\nA quiet rainy street.\n[[/PROMPT]]\nNotes: keep the camera steady.';
Object.defineProperty(globalThis,'navigator',{configurable:true,value:{clipboard:{writeText:async text=>{copied=text;}}}});
globalThis.fetch=async(url,options={})=>{requests.push({url,options});return {ok:true,json:async()=>url.endsWith('/api/tags')?{models:[{name:'test-local',capabilities:['completion']}]}:{message:{content:answer}}};};
async function settle(){for(let i=0;i<6;i++)await new Promise(r=>setImmediate(r));}
for(const language of ['EN','HU','DE','FR','ES','IT','PT','PL']){
 reset();const hub=attachAiHub({getLanguage:()=>language,getCurrent:()=>({prompt:'Rain outside a cafe.'})});hub.open();await settle();
 node('#ai-hub-task').value='custom';node('#ai-hub-task').fire('change');
 const copy=node('#ai-hub-copy-prompt');assert.equal(copy.hidden,false);assert.ok(copy.textContent.length>0);
 if(language==='HU')assert.equal(copy.textContent,'Csak a prompt másolása');
 node('#ai-hub-question').value='Suggest an English image prompt.';node('#ai-hub-context').value='Rain outside a cafe.';
 await node('#ai-hub-submit').fire('click');await settle();
 const request=JSON.parse(requests.findLast(r=>r.url==='/api/chat').options.body);assert.match(request.messages[0].content,/If the answer includes.*\[\[PROMPT\]\]/s);
 const response=node('#ai-hub-response');assert.equal(response.value,answer);
 await copy.fire('click');assert.equal(copied,'A quiet rainy street.');assert.equal(response.value,answer);
 await node('#ai-hub-copy-response').fire('click');assert.equal(copied,answer);
 response.value='Notes.\nA selected prompt.\nExtra explanation.';response.selectionStart=7;response.selectionEnd=25;
 await copy.fire('click');assert.equal(copied,'A selected prompt.');
 response.selectionStart=0;response.selectionEnd=0;response.value='Here is an explanation without a clear prompt.';copied='unchanged';await copy.fire('click');assert.equal(copied,'unchanged');assert.ok(node('#ai-hub-status').textContent);
 node('#ai-hub-task').value='explain';node('#ai-hub-task').fire('change');assert.equal(copy.hidden,true);
}
const prompt='A quiet rainy street. Soft reflections.';
for(const tail of ["Let me know if you want another style.","If you would like, I can adapt this.","Ha szeretnéd, adok másikat."]){
 assert.equal(extractCopyablePrompt('Prompt:\n'+prompt+'\n\n---\n\n'+tail),prompt);
 assert.equal(extractCopyablePrompt(prompt+'\n\n'+tail),prompt);
}
assert.match(buildCustomQuestionRequest('Explain this setting.','seed=42'),/Otherwise answer normally/);
console.log('PASS: eight-language custom button, local format request, prompt/full response copying, selected text, ambiguity fallback, explanation mode and conversational afterword exclusion.');
