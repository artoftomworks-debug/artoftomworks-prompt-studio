import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { glossaryMaxEntries, normalizeGlossaryEntries, extractGlossaryCandidates, parseGlossaryTranslations } from "./dist/translation-glossary.mjs";

assert.equal(glossaryMaxEntries,2000);
const imported=normalizeGlossaryEntries(Array.from({length:2100},(_,i) =>
  ({source:"EN",target:"HU",from:"term"+i,to:"kifejezés"+i})));
assert.equal(imported.length,2000);
const candidates=extractGlossaryCandidates([
  "masterpiece, editorial quality, dramatic rim lighting, handheld tracking shot",
  "editorial quality, dramatic rim lighting, soft focus background"
],{limit:20,minCount:2});
assert.deepEqual(candidates,[{term:"dramatic rim lighting",count:2},{term:"editorial quality",count:2}]);
assert.equal(extractGlossaryCandidates(["A woman dances in golden light by the sea."],{expandLong:true}).length>0,true);
assert.deepEqual(parseGlossaryTranslations('{"pairs":[{"from":"editorial quality","to":"szerkesztőségi minőség"},{"from":"invented term","to":"hamis"}]}',["editorial quality"]),
  [{from:"editorial quality",to:"szerkesztőségi minőség"}]);
assert.deepEqual(parseGlossaryTranslations("not JSON",["editorial quality"]),[]);

const ui=readFileSync(new URL("./dist/bilingual-editor.mjs",import.meta.url),"utf8");
const server=readFileSync(new URL("./local-server.mjs",import.meta.url),"utf8");
const bundle=readFileSync(new URL("./dist/ArtofTomworks_Prompt_Studio_OFFLINE.html",import.meta.url),"utf8");
for(const marker of ["glossary-suggestions","suggestCurrent","suggestArchive","suggestMore","parseGlossaryTranslations"]) {
  assert.ok(ui.includes(marker),marker);
  assert.ok(bundle.includes(marker),marker);
}
assert.ok(server.includes("/api/catalog/glossary-candidates"));
assert.ok(server.includes("glossarySuggestions:true"));
console.log("Glossary extraction, 2000-pair limit, review UI and offline bundle checks passed.");
