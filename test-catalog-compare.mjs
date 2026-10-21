import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { compareCatalogItems } from "./dist/catalog-compare.mjs";

const a={id:"a",kind:"video",model:"LTX",prompt:"A zebra drinks from clear water",rating:4,
  settings:{width:768,height:1344,duration:4,fps:24,seed:42,loras:[{name:"motion.safetensors",strength:0.7}]}};
const b={id:"b",kind:"video",model:"LTX",prompt:"A zebra runs through tall grass",rating:5,
  settings:{width:1088,height:1920,duration:7,fps:30,seed:43,loras:[{name:"motion.safetensors",strength:0.9}]}};
const result=compareCatalogItems(a,b);
assert.equal(result.rows.find((row) => row.key === "model").state,"same");
assert.equal(result.rows.find((row) => row.key === "loras").state,"different");
assert.equal(result.rows.find((row) => row.key === "seeds").state,"unknown");
assert.equal(result.prompt.state,"different");
assert.ok(result.prompt.onlyA.includes("drinks"));
assert.ok(result.notes.some((note) => note.key === "morePixels" && note.side === "B"));
assert.ok(result.notes.some((note) => note.key === "preferred" && note.side === "B"));
assert.equal(compareCatalogItems({...a,settings:{}},{...b,settings:{}}).rows.find((row) => row.key === "seed").state,"unknown");
assert.throws(() => compareCatalogItems(a,a));
const bundle=readFileSync(new URL("./dist/ArtofTomworks_Prompt_Studio_OFFLINE.html",import.meta.url),"utf8");
const ui=readFileSync(new URL("./dist/media-catalog-ui.mjs",import.meta.url),"utf8");
const server=readFileSync(new URL("./local-server.mjs",import.meta.url),"utf8");
const launcher=readFileSync(new URL("./Start-Prompt-Studio.ps1",import.meta.url),"utf8");
assert.match(bundle,/function compareCatalogItems/);
assert.match(bundle,/catalog-compare-dialog/);
assert.match(ui,/catalog-compare-open/);
assert.match(ui,/catalog-compare-visual-run/);
assert.match(ui,/compareVisible=el\("catalog-show-thumbnails"\)\.checked/);
assert.match(server,/abCompare:true/);
assert.match(launcher,/\$health\.abCompare/);
console.log("Catalog A/B comparison checks passed.");
