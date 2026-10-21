import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { collectSentenceCandidates } from "./dist/sentence-bank.mjs";
import { attachBilingualPromptEditor } from "./dist/bilingual-editor.mjs";

const repeated="The camera moves slowly across the sunlit forest clearing";
const records=[
  {kind:"video",prompt:`${repeated}. ${repeated}. A lone deer pauses near the trees.`},
  {kind:"video",prompt:`${repeated}! The light changes gently as the animal looks up.`},
  {kind:"image",prompt:`${repeated}. A completely different still scene.`}
];
assert.deepEqual(collectSentenceCandidates(records,{kind:"video"}),[{text:repeated,count:2}]);
assert.deepEqual(collectSentenceCandidates(records,{kind:"image"}),[]);
const editor=readFileSync(new URL("./dist/bilingual-editor.mjs",import.meta.url),"utf8");
const bundle=readFileSync(new URL("./dist/ArtofTomworks_Prompt_Studio_OFFLINE.html",import.meta.url),"utf8");
const server=readFileSync(new URL("./local-server.mjs",import.meta.url),"utf8");
for(const marker of ["word-hover-panel","word-hover-token","showWordSelection","onlineWord","collectSentenceCandidates"]){
  assert.ok(bundle.includes(marker),marker);
}
assert.ok(editor.includes("hoverKey.type=\"password\""));
assert.ok(server.includes("/api/translate/word"));
assert.ok(server.includes("https://api.deepl.com/v2/translate"));
class FakeElement {
  constructor(){this.children=[];this.value="";this.textContent="";this.hidden=false;this.listeners=new Map();this.selectionStart=0;this.selectionEnd=0;}
  append(...items){this.children.push(...items);} appendChild(item){this.children.push(item);}
  replaceChildren(...items){this.children=items;} setAttribute(){} focus(){}
  addEventListener(name,callback){this.listeners.set(name,callback);}
  insertAdjacentElement(where,item){this[where]=item;}
  dispatch(name){this.listeners.get(name)?.({key:name});}
}
globalThis.document={createElement:()=>new FakeElement(),createTextNode:(text)=>({textContent:text})};
globalThis.localStorage={getItem:(key)=>key.includes("glossary")?JSON.stringify([{source:"EN",target:"HU",from:"camera",to:"kamera"}]):null,setItem(){}};
const field=new FakeElement();
const instance=attachBilingualPromptEditor({field,getLanguage:()=>"HU"});
instance.setPrompt("The camera moves","EN");
const helper=field.afterend.afterend.afterend.afterend;
const toggle=helper.afterend;
toggle.dispatch("click");
const preview=toggle.afterend.children[3];
const token=preview.children.find((item)=>item.textContent==="camera");
assert.ok(token,"The read-only preview exposes the hovered word");
token.dispatch("mouseenter");
assert.equal(helper.hidden,false);
assert.equal(helper.children[3].value,"kamera","A glossary answer appears immediately without online lookup");
console.log("Sentence suggestions and opt-in hover lookup checks passed.");
