import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { extractSwarmMetadata, extractComfyPrompt } from "./media-catalog.mjs";

assert.deepEqual(extractSwarmMetadata({ sui_image_params:{ prompt:"A moving scene", model:"LTX 2.5", width:1088,
  height:1920, steps:20, fps:24, frames:97, cfgscale:2.5 } }).settings,
  { width:1088, height:1920, steps:20, cfg:2.5, fps:24, frames:97 });
assert.deepEqual(extractComfyPrompt({
  1:{ class_type:"CLIPTextEncode", inputs:{ text:"A person walks into morning light.", width:768, height:1344 } },
  2:{ class_type:"SamplerCustomAdvanced", inputs:{ steps:12, cfg:1.5 } }
}).settings, { width:768, height:1344, steps:12, cfg:1.5 });

const page = readFileSync(new URL("./dist/ArtofTomworks_Prompt_Studio_OFFLINE.html",import.meta.url),"utf8");
assert.match(page,/Workflow-javaslat ebből/);
assert.match(page,/catalog\/workflow-handoff/);
assert.match(readFileSync(new URL("./local-server.mjs",import.meta.url),"utf8"),/api\/catalog\/settings/);
console.log("GLOBAL archive-to-workflow bridge checks passed.");
