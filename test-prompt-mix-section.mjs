import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {splitCreativePrompt,combineCreativePrompt,creativePromptFor} from './dist/prompt-mix-section.mjs';
test('mix replacement never strips natural scene lighting or creates a prompt from an empty scene',()=>{
 const base='A violinist. Lighting: soft sunset.\nStíluskeverék: Meghatározó — Glamour.\nFényirányok — leíró erősség: moderate fill light.';
 const parts=splitCreativePrompt(base);assert.equal(parts.scene,'A violinist. Lighting: soft sunset.');assert.match(parts.direction,/Glamour/);
 const full=combineCreativePrompt(base,'New style and lighting.');assert.equal(full,'A violinist. Lighting: soft sunset.\nNew style and lighting.');assert.equal(combineCreativePrompt('', 'Style alone.'),'');assert.equal(creativePromptFor('unknown','Unchanged.'),'Unchanged.');
});
test('all existing prompt output paths use the section composer and the offline bundle contains it once',()=>{
 for(const file of ['app.mjs','i2v-ui.mjs','i2i-ui.mjs','creative-forge.mjs','creative-recipes-ui.mjs','prompt-workbench.mjs'])assert.match(readFileSync(new URL('./dist/'+file,import.meta.url),'utf8'),/creativePromptFor\(/,file);
 const app=readFileSync(new URL('./dist/app.mjs',import.meta.url),'utf8');assert.doesNotMatch(app,/generatedPrompt \+= "\\n" \+ mixedDirection/);
 const html=readFileSync(new URL('./dist/ArtofTomworks_Prompt_Studio_OFFLINE.html',import.meta.url),'utf8');assert.equal((html.match(/function creativePromptFor\(/g)||[]).length,1);assert.ok(!html.includes('from "./prompt-mix-section.mjs"'));
});
