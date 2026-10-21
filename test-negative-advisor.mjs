import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { Script } from "node:vm";
import { suggestNegativeClauses } from "./dist/negative-advisor.mjs";
import { buildPrompt } from "./dist/engine.mjs";
import { normalizePromptEntries, filterPromptEntries } from "./dist/prompt-library.mjs";

const portrait=suggestNegativeClauses({prompt:"A professional portrait of an adult fashion model",mode:"image"});
assert.ok(portrait.includes("extra limbs"));
assert.ok(portrait.includes("inconsistent facial features"));
assert.ok(!portrait.includes("flicker"));
const art=suggestNegativeClauses({prompt:"An expressive oil painting of a garden",mode:"image"});
assert.ok(art.includes("inconsistent medium or brushwork"));
assert.ok(!art.includes("plastic-looking surfaces"));
const video=suggestNegativeClauses({prompt:"A fox walks through a forest",mode:"i2v"});
assert.ok(video.includes("flicker"));
assert.ok(video.includes("subject identity drift"));
const signed=suggestNegativeClauses({prompt:"A legible sign on a city street",mode:"image"});
assert.ok(!signed.includes("unwanted text or logos"));
const montage=suggestNegativeClauses({prompt:"A deliberate montage with abrupt cuts",mode:"video"});
assert.ok(!montage.includes("abrupt cuts"));

const positive=buildPrompt({mode:"image",brief:"Fox cubs asleep",subject:"Two fox cubs",negatives:"extra limbs, watermark",outputLanguage:"EN",model:"krea2",quality:"balanced"});
assert.ok(positive.includes("Fox cubs asleep"));
assert.ok(!positive.includes("extra limbs"));
const saved=normalizePromptEntries([{id:"1",title:"Foxes",category:"Nature",mode:"image",prompt:positive,negative:"extra limbs, watermark"}]);
assert.equal(saved[0].negative,"extra limbs, watermark");
assert.equal(filterPromptEntries(saved,"watermark").length,1);

const html=await readFile(new URL("./dist/ArtofTomworks_Prompt_Studio_OFFLINE.html",import.meta.url),"utf8");
assert.match(html,/attachNegativeAdvisor/u);
assert.match(html,/Negative prompt \(optional\)/u);
const inline=html.match(/<script>\s*([\s\S]*?)\s*<\/script>/u)?.[1];
assert.ok(inline);
new Script(inline);
console.log("Separate negative prompts, contextual suggestions, saved entries and offline bundle checks passed.");
