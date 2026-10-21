import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { buildDirectorPrompt, directorSettings, directorTimelineIssues } from "./dist/director-engine.mjs";

assert.deepEqual([directorSettings("h3",5).frames,directorSettings("h3",8).frames],[124,192]);
assert.equal(directorSettings("h3",8).fps,24);
assert.equal(directorSettings("h3",8).estimatedSeconds,8);
assert.equal(directorSettings("ltx25",8).frames,193);
assert.equal(directorSettings("custom",8,30).frames,240);
assert.throws(() => directorSettings("h3",16),/Duration/);
assert.throws(() => directorSettings("custom",8,0),/FPS/);
const beats=[
  {start:0,end:3,action:"The subject enters the room.",camera:"slow push-in",sound:"footsteps"},
  {start:3,end:8,action:"She looks toward the window.",camera:"locked",sound:"soft wind"}
];
assert.deepEqual(directorTimelineIssues(beats,8),[]);
assert.match(buildDirectorPrompt({model:"h3",seconds:8,basePrompt:"Vintage scene",beats}).prompt,/\[3\.0–8\.0s\]/);
assert.match(buildDirectorPrompt({model:"h3",seconds:8,basePrompt:"Vintage scene",beats}).prompt,/Camera: locked/);
assert.match(buildDirectorPrompt({model:"h3",seconds:8,basePrompt:"Vintage scene",feedback:"Keep the warm lighting",beats}).prompt,/Keep the warm lighting/);
assert.ok(directorTimelineIssues([{...beats[0],end:2},beats[1]],8).length);
const ui=await readFile(new URL("./dist/director-ui.mjs",import.meta.url),"utf8");
assert.match(ui,/director\.v1/);
assert.match(ui,/linkMedia\(item\)/);
assert.match(ui,/director-import-file/);
const bundle=await readFile(new URL("./dist/ArtofTomworks_Prompt_Studio_OFFLINE.html",import.meta.url),"utf8");
assert.match(bundle,/director-panel/);
assert.match(bundle,/director-export/);
console.log("Director timeline calculations, validation, archive linking and offline bundle checks passed.");
