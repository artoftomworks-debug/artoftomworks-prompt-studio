import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createExperimentEntry, normalizeExperimentEntries } from "./dist/catalog-compare.mjs";

const a={id:"file-a",filename:"test-a.mp4",kind:"video",model:"LTX 2.5",modified:"2026-10-20T10:00:00Z",
  prompt:"A zebra walks through shallow water.",settings:{width:1088,height:1920,seed:42,loras:[{name:"motion",strength:0.5}]}};
const b={id:"file-b",filename:"test-b.mp4",kind:"video",model:"LTX 2.5",modified:"2026-10-20T11:00:00Z",
  prompt:"A zebra walks through shallow water.",settings:{width:1088,height:1920,seed:42,loras:[{name:"motion",strength:0.7}]}};
const entry=createExperimentEntry(a,b,{id:"test-entry",createdAt:"2026-10-20T12:00:00Z",title:"Motion LoRA test",
  preferred:"B",reason:"Smoother movement",runMinutesA:"5.2",runMinutesB:"6.1"});
assert.equal(entry.preferred,"B");
assert.equal(entry.runMinutesA,5.2);
assert.equal(entry.changed.length,1);
assert.equal(entry.changed[0].key,"loras");
assert.equal(entry.prompt.state,"same");
assert.equal(entry.a.filename,"test-a.mp4");
assert.equal(entry.b.filename,"test-b.mp4");
assert.deepEqual(normalizeExperimentEntries({entries:[entry,entry]}).map((item)=>item.id),["test-entry"]);
assert.deepEqual(normalizeExperimentEntries({entries:[{id:"bad",a:{id:"same"},b:{id:"same"}}]}),[]);
const ui=readFileSync(new URL("./dist/media-catalog-ui.mjs",import.meta.url),"utf8");
const server=readFileSync(new URL("./local-server.mjs",import.meta.url),"utf8");
const bundle=readFileSync(new URL("./dist/ArtofTomworks_Prompt_Studio_OFFLINE.html",import.meta.url),"utf8");
for(const marker of ["catalog-journal-summary","catalog-experiment-save","normalizeExperimentEntries","catalog-journal-export","catalog-journal-import"])
  assert.ok(ui.includes(marker)&&bundle.includes(marker),marker);
assert.ok(server.includes("/api/catalog/item"));
console.log("Experiment journal snapshots, differences, storage validation and UI bundle checks passed.");
