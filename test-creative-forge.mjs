import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { Script } from "node:vm";
import { buildSurprisePrompt, mixArchivedPrompts, surpriseThemes } from "./dist/creative-forge.mjs";

for(const theme of surpriseThemes){
  for(const kind of ["image","video"]){
    const result=buildSurprisePrompt({theme,kind,random:()=>0.2});
    assert.equal(result.kind,kind);
    assert.ok(result.prompt.length>130);
    assert.match(result.prompt,/^Masterpiece,/u);
    assert.match(result.prompt,/no (text|captions)/iu);
  }
}
assert.equal(buildSurprisePrompt({theme:"wildlife",kind:"image",random:()=>0}).theme,"wildlife");
assert.match(buildSurprisePrompt({theme:"wildlife",kind:"image",random:()=>0}).prompt,/fox cubs/iu);
assert.match(buildSurprisePrompt({theme:"wildlife",kind:"video",random:()=>0}).prompt,/camera|action|motion/iu);
assert.match(buildSurprisePrompt({theme:"portrait",kind:"image",random:()=>0}).prompt,/editorial quality, ultra detailed, professional photograph, tack-sharp focus/iu);
assert.doesNotMatch(buildSurprisePrompt({theme:"fantasy",kind:"image",random:()=>0}).prompt,/professional photograph/iu);
assert.match(buildSurprisePrompt({theme:"fantasy",kind:"image",random:()=>0}).prompt,/carefully crafted fine art/iu);
assert.match(buildSurprisePrompt({theme:"nature",kind:"video",random:()=>0}).prompt,/cinematic editorial quality/iu);

const a={filename:"foxes.png",kind:"image",prompt:"Masterpiece, Two fox cubs sleep together under pine trees, fine fur texture"};
const b={filename:"evening.png",kind:"image",prompt:"A quiet lakeside portrait, warm sunset light, amber palette and delicate film grain"};
const originalA=a.prompt,originalB=b.prompt;
const mixed=mixArchivedPrompts(a,b);
assert.equal(mixed.kind,"image");
assert.equal(mixed.sceneFilename,"foxes.png");
assert.equal(mixed.lookFilename,"evening.png");
assert.match(mixed.prompt,/fox cubs/iu);
assert.match(mixed.prompt,/sunset light|amber palette/iu);
assert.equal(a.prompt,originalA);assert.equal(b.prompt,originalB);
const swapped=mixArchivedPrompts(a,b,{swap:true,kind:"video"});
assert.equal(swapped.sceneFilename,"evening.png");
assert.equal(swapped.lookFilename,"foxes.png");
assert.equal(swapped.kind,"video");
assert.equal(mixArchivedPrompts(a,{...b,prompt:""}),null);

const html=await readFile(new URL("./dist/ArtofTomworks_Prompt_Studio_OFFLINE.html",import.meta.url),"utf8");
assert.match(html,/id="surprise-theme"/u);
assert.match(html,/mixArchivedPrompts/u);
assert.match(html,/attachSurprisePrompt/u);
const inline=html.match(/<script>\s*([\s\S]*?)\s*<\/script>/u)?.[1];
assert.ok(inline,"built page should contain its inline application");
new Script(inline);
console.log("Surprise themes, editable image/video drafts, archive cross-pollination and offline bundle checks passed.");
