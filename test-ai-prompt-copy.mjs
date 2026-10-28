import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Script} from 'node:vm';
import {extractMarkedPrompt,extractCopyablePrompt,promptCopyValue,formatAiAnswer} from './dist/ai-hub.mjs';
const prompt='A quiet rainy street. Soft reflections on wet pavement.';
for(const [open,close] of [['[[PROMPT]]','[[/PROMPT]]'],['[[PROMPT]','[[/PROMPT]'],['[PROMPT]','[/PROMPT]'],['[[PROMPT]','\n]]'],['[[ prompt ]]','[[ / prompt ]]']]){
 const source='- Changed lighting.\n\n'+open+'\n'+prompt+'\n'+close+'\n\nNotes: keep the camera steady.';
 assert.equal(extractMarkedPrompt(source),prompt);
 assert.equal(extractCopyablePrompt(source),prompt);
 assert.equal(formatAiAnswer(source),source,'explanations preserved');
}
for(const heading of ['Prompt:','**Prompt:**','### Final Prompt:','### Prompt','**Final Prompt**','Javított prompt:']){
 assert.equal(extractCopyablePrompt('I changed the lighting.\n\n'+heading+'\n'+prompt+'\n\nNotes: a short explanation.'),prompt,heading);
}
assert.equal(extractCopyablePrompt('Change notes\n```text\n'+prompt+'\n```\nMore notes'),prompt);
assert.equal(extractCopyablePrompt(JSON.stringify({prompt,notes:'Changed light.'})),prompt);
assert.equal(extractCopyablePrompt('A quiet rainy street.\nSoft reflections on wet pavement.'),'A quiet rainy street.\nSoft reflections on wet pavement.');
assert.equal(extractCopyablePrompt('- Improved lighting.\n- Preserved the scene.'),'');
assert.equal(extractCopyablePrompt('Here is your improved prompt.\n'+prompt),'');
assert.equal(extractCopyablePrompt('[[PROMPT]]\n'+prompt),'');
assert.equal(extractCopyablePrompt('[[PROMPT]]first[[/PROMPT]]\n[[PROMPT]]second[[/PROMPT]]'),'');
assert.equal(extractCopyablePrompt('```prompt\nfirst\n```\n```prompt\nsecond\n```'),'');
assert.equal(extractCopyablePrompt('Sorry, I cannot help with that request.'),'');
const answer='Unstructured explanation.\n'+prompt+'\nSome more explanation.';
const start=answer.indexOf(prompt),end=start+prompt.length;
assert.equal(promptCopyValue(answer,start,end),prompt);
assert.equal(promptCopyValue('[[PROMPT]]'+prompt+'[[/PROMPT]]',0,0),prompt);
assert.equal(formatAiAnswer(prompt),'[[PROMPT]]\n'+prompt+'\n[[/PROMPT]]');
const html=readFileSync(new URL('./dist/ArtofTomworks_Prompt_Studio_OFFLINE.html',import.meta.url),'utf8');
new Script(html.match(/<script>\s*([\s\S]*?)\s*<\/script>/)[1]);
assert(html.includes('promptCopyValue(response.value,response.selectionStart,response.selectionEnd)'));
console.log('PASS: marker variants, old malformed closing, prompt headings, code blocks, JSON, plain multiline prompts, explanation preservation, ambiguous/refusal rejection, selected-text fallback, inline bundle syntax.');
