import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { buildCreatorPassport } from "./dist/creator-passport.mjs";

const item={id:"test",filename:"C:\\Users\\Artist\\private.png",path:"C:\\Users\\Artist\\private.png",
  source:"ComfyUI",prompt:"A dancer in blue light",model:"C:\\models\\cinema.safetensors",
  settings:{seed:0,width:1024,height:768,loras:[{name:"D:\\loras\\motion.safetensors",strength:0.7}]}};
const passport=buildCreatorPassport(item,"HU");
assert.match(passport.text,/Alkotói útlevél/);
assert.match(passport.text,/cinema\.safetensors/);
assert.match(passport.text,/motion\.safetensors ×0\.7/);
assert.match(passport.text,/Seed: 0/);
assert.doesNotMatch(passport.text,/C:\\|D:\\|private\.png/);
assert.equal(passport.possibleSensitive,false);
assert.deepEqual(passport.missing,[]);

const incomplete=buildCreatorPassport({prompt:"",model:"",settings:{}},"EN");
assert.deepEqual(incomplete.missing,["Positive prompt","Model","Seed"]);
assert.match(incomplete.text,/Missing checked basics: Positive prompt, Model, Seed/);
assert.equal(buildCreatorPassport({prompt:"See C:\\Users\\Artist\\secret.txt"},"EN").possibleSensitive,true);

const ui=readFileSync(new URL("./dist/media-catalog-ui.mjs",import.meta.url),"utf8");
const offline=readFileSync(new URL("./dist/ArtofTomworks_Prompt_Studio_OFFLINE.html",import.meta.url),"utf8");
for (const marker of ["data-viewer-passport-open","data-viewer-passport-text","data-viewer-passport-copy"])
  { assert.ok(ui.includes(marker)); assert.ok(offline.includes(marker)); }
console.log("Creator passport checks passed.");
