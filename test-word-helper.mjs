import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { exactGlossaryMatch, normalizeGlossaryEntries } from "./dist/translation-glossary.mjs";
import { attachBilingualPromptEditor } from "./dist/bilingual-editor.mjs";
class FakeElement {
  constructor() { this.children=[]; this.value=""; this.textContent=""; this.hidden=false; this.listeners=new Map(); this.selectionStart=0; this.selectionEnd=0; }
  append(...items) { this.children.push(...items); }
  appendChild(item) { this.children.push(item); }
  setAttribute() {}
  addEventListener(name,callback) { this.listeners.set(name,callback); }
  insertAdjacentElement(where,item) { this[where]=item; }
  dispatch(name) { this.listeners.get(name)?.({key:name}); }
  dispatchEvent(event) { this.dispatch(event.type); }
  click() { this.dispatch("click"); }
  setRangeText(text,start,end) { this.value=this.value.slice(0,start)+text+this.value.slice(end); }
  focus() {}
}
globalThis.document={createElement:() => new FakeElement()};
const saved=new Map([["artoftomworks.promptStudio.glossary.v1",JSON.stringify([{source:"HU",target:"EN",from:"szenvedélyes csók",to:"passionate kiss"}])]]);
globalThis.localStorage={getItem:(key) => saved.get(key) || null,setItem:(key,value) => saved.set(key,value)};
const field=new FakeElement();
const editorInstance=attachBilingualPromptEditor({field,getLanguage:() => "HU"});
editorInstance.setPrompt("A szenvedélyes csók a kertben.", "HU");
const targetSelect=field.beforebegin.children[0].children[2].children[1];
targetSelect.value="EN"; targetSelect.dispatch("change");
const wordPanel=field.afterend.afterend.afterend.afterend;
field.selectionStart=2; field.selectionEnd=2+"szenvedélyes csók".length; field.dispatch("mouseup");
assert.equal(wordPanel.hidden,false);
assert.equal(wordPanel.children[2].textContent,"A saját szószedetedből");
assert.equal(wordPanel.children[3].value,"passionate kiss");
const wordActions=wordPanel.children[4].children;
wordActions[1].click();
assert.equal(editorInstance.getText(),"A passionate kiss a kertben.");
assert.equal(wordPanel.hidden,true);
editorInstance.setPrompt("Kék fény a kertben.", "HU");
field.selectionStart=0; field.selectionEnd="Kék fény".length; field.dispatch("mouseup");
assert.equal(wordPanel.children[2].textContent,"Még nincs a szószedetben");
wordPanel.children[3].value="blue light";
wordActions[2].click();
assert.equal(editorInstance.getText(),"Kék fény a kertben.","saving must not change the prompt");
assert.deepEqual(exactGlossaryMatch(JSON.parse(saved.get("artoftomworks.promptStudio.glossary.v1")),"HU","EN","Kék fény"),{from:"Kék fény",to:"blue light"});

const entries=normalizeGlossaryEntries([
  {source:"HU",target:"EN",from:"szenvedélyes csók",to:"passionate kiss"},
  {source:"EN",target:"HU",from:"camera",to:"kamera"}
]);
assert.deepEqual(exactGlossaryMatch(entries,"HU","EN","SZENVEDÉLYES CSÓK"),{from:"szenvedélyes csók",to:"passionate kiss"});
assert.deepEqual(exactGlossaryMatch(entries,"EN","HU","passionate kiss"),{from:"passionate kiss",to:"szenvedélyes csók"});
assert.equal(exactGlossaryMatch(entries,"HU","EN","szenvedélyes"),null);
assert.equal(exactGlossaryMatch(entries,"DE","EN","szenvedélyes csók"),null);
const editor=readFileSync(new URL("./dist/bilingual-editor.mjs",import.meta.url),"utf8");
const bundle=readFileSync(new URL("./dist/ArtofTomworks_Prompt_Studio_OFFLINE.html",import.meta.url),"utf8");
for(const marker of ["showWordSelection","wordReplace","wordSave","exactGlossaryMatch","Szósegéd"]) {
  assert.ok(editor.includes(marker),marker);
  assert.ok(bundle.includes(marker),marker);
}
console.log("Word helper glossary priority and offline integration checks passed.");
