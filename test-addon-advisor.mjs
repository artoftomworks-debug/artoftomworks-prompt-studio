import assert from "node:assert/strict";
import { inferAddonFamily, recommendAddons, guideLoraMatches } from "./dist/addon-advisor.mjs";

assert.equal(inferAddonFamily("Krea 2"), "krea2");
assert.equal(inferAddonFamily("LTX 2.5 Gym"), "ltx25");
assert.equal(inferAddonFamily("LTX 2.3"), "ltx23");
assert.equal(inferAddonFamily("MiniMax H3"), "h3");
assert.equal(inferAddonFamily("Unknown"), "");
const items = [
  { type:"lora", name:"cinematic lighting", file:"light_krea2.safetensors", baseModel:"Krea 2", tags:["cinematic"], triggers:[], description:"Soft cinematic lighting" },
  { type:"lora", name:"cinematic lighting", file:"light_ltx23.safetensors", baseModel:"LTX 2.3", tags:["cinematic"], triggers:[], description:"Soft cinematic lighting" },
  { type:"lora", name:"portrait detail", file:"portrait_unknown.safetensors", baseModel:"Unknown", tags:[], triggers:[], description:"Detailed portrait" },
  { type:"lora", name:"nude portrait", file:"nude_krea2.safetensors", baseModel:"Krea 2", tags:[], triggers:[], description:"Portrait" },
  { type:"wildcard", name:"cinematic scenes", file:"cinematic.txt", baseModel:"", tags:[], triggers:[], description:"" }
];
const result=recommendAddons("cinematic portrait with soft lighting", "krea2", items);
assert(result.suggestions.some((item)=>item.file==="light_krea2.safetensors"));
assert(!result.suggestions.some((item)=>item.file==="light_ltx23.safetensors"));
assert(!result.suggestions.some((item)=>item.file==="nude_krea2.safetensors"));
assert(result.review.some((item)=>item.file==="portrait_unknown.safetensors"));
assert(result.review.some((item)=>item.file==="cinematic.txt"));
assert(recommendAddons("", "krea2", items).suggestions.length===0);
assert(recommendAddons("cinematic", "", items).suggestions.length===0);
assert(recommendAddons("nude portrait", "krea2", items).suggestions.some((item)=>item.file==="nude_krea2.safetensors"));
const guide=guideLoraMatches("cinematic portrait with soft lighting","krea2",items);
assert(guide.some((item)=>item.file==="light_krea2.safetensors" && item.matched.length));
assert(!guide.some((item)=>item.file==="light_ltx23.safetensors" || item.type!=="lora"));
assert(guide.some((item)=>item.file==="portrait_unknown.safetensors" && item.verified===false));
console.log("Addon advisor tests passed.");
