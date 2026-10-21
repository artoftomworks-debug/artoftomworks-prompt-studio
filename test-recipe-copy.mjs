import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { formatCatalogPrompt, formatCatalogRecipe } from "./dist/media-catalog-ui.mjs";

const item={filename:"example.png",source:"SwarmUI",prompt:"A cinematic scene",negative:"blurry",
  model:"ExampleModel",settings:{width:1344,height:768,steps:12,cfg:1,seed:42,sampler:"euler",
    scheduler:"normal",loras:[{name:"motion",strength:0.7},{name:"look",strength:-1}]}};
assert.equal(formatCatalogPrompt(item,"HU"),"A cinematic scene\n\nNegatív prompt:\nblurry");
const recipe=formatCatalogRecipe(item,"HU");
for(const fragment of ["example.png","A cinematic scene","blurry","ExampleModel","motion ×0.7","look ×-1",
  "Szélesség: 1344","Magasság: 768","Lépések: 12","CFG: 1","Seed: 42","Sampler: euler","Scheduler: normal",
  "FPS: Nem olvasható ki"]) assert.ok(recipe.includes(fragment),fragment);
assert.equal(formatCatalogPrompt({prompt:"Only positive"},"EN"),"Only positive");
assert.equal(formatCatalogPrompt({prompt:""},"EN"),"");
assert.match(formatCatalogRecipe({prompt:""},"EN"),/Positive prompt: Not readable/);

const ui=readFileSync(new URL("./dist/media-catalog-ui.mjs",import.meta.url),"utf8");
const offline=readFileSync(new URL("./dist/ArtofTomworks_Prompt_Studio_OFFLINE.html",import.meta.url),"utf8");
const server=readFileSync(new URL("./local-server.mjs",import.meta.url),"utf8");
const launcher=readFileSync(new URL("./Start-Prompt-Studio.ps1",import.meta.url),"utf8");
for(const marker of ["data-viewer-positive","data-viewer-negative","data-viewer-copy-prompt","data-viewer-copy-recipe"]) {
  assert.match(ui,new RegExp(marker));
  assert.match(offline,new RegExp(marker));
}
assert.match(server,/recipeCopy:true/);
assert.match(launcher,/\$health\.recipeCopy -ne \$true/);
console.log("Global viewer prompt and full-recipe copy checks passed.");
