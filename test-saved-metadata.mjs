import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { extractSwarmMetadata } from "./media-catalog.mjs";

const meta=extractSwarmMetadata({sui_image_params:{
  prompt:"A sample scene for metadata regression testing",
  model:"ExampleModel",steps:22,cfgscale:4.5,
  loras:["motion","look","disabled","bad"],loraweights:["0.7","1",0,"not-a-number"]
}});
assert.deepEqual(meta.settings.loras,[{name:"motion",strength:0.7},{name:"look",strength:1}]);
assert.equal(meta.settings.steps,22);
assert.equal(meta.model,"ExampleModel");
assert.equal(extractSwarmMetadata({sui_image_params:{prompt:"A scene",loras:["no-weight"]}}).settings.loras[0].name,"no-weight");

const ui=readFileSync(new URL("./dist/media-catalog-ui.mjs",import.meta.url),"utf8");
const bundle=readFileSync(new URL("./dist/ArtofTomworks_Prompt_Studio_OFFLINE.html",import.meta.url),"utf8");
for (const marker of ["catalog-item-tech","data-viewer-tech","renderTechnical","readDetails","detailObserver"]) {
  assert.match(ui,new RegExp(marker));
  assert.match(bundle,new RegExp(marker));
}
assert.match(ui,/event\.target!==dialog/);
assert.match(ui,/dialog\.getBoundingClientRect\(\)/);
assert.match(ui,/dialog\.close\(\)/);
console.log("Saved LoRA metadata and viewer backdrop checks passed.");
