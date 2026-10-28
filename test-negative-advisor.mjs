import assert from "node:assert/strict";
import {buildPrompt} from "./dist/engine.mjs";
import {buildSurprisePrompt} from "./dist/creative-forge.mjs";
import {normalizePromptEntries,filterPromptEntries} from "./dist/prompt-library.mjs";
const positive=buildPrompt({mode:"image",brief:"Fox cubs asleep",subject:"Two fox cubs",negatives:"extra limbs, watermark",outputLanguage:"EN",model:"krea2",quality:"balanced"});
assert.ok(positive.includes("Fox cubs asleep"));
assert.ok(positive.includes("Constraints: extra limbs, watermark"));
const saved=normalizePromptEntries([{id:"1",title:"Foxes",category:"Nature",mode:"image",prompt:positive,negative:"extra limbs, watermark"}]);
assert.equal(saved[0].negative,"extra limbs, watermark");
assert.equal(filterPromptEntries(saved,"watermark").length,1);
const result=buildSurprisePrompt({theme:"portrait",kind:"image",model:"krea2",random:()=>0.2});
assert.ok(result.prompt.length>20);
console.log("Classic constraints and saved negative-prompt search passed.");

assert.equal(normalizePromptEntries([{id:"old",title:"Old",category:"Nature",mode:"image",prompt:"A tree"}])[0].negative,"");
assert.equal(normalizePromptEntries([{id:"a",title:"Same",category:"Nature",mode:"image",prompt:"A tree",negative:"blur"},{id:"b",title:"Same",category:"Nature",mode:"image",prompt:"A tree",negative:"watermark"}]).length,2);
