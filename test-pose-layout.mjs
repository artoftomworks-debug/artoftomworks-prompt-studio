import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {attachVirtualStudio} from './dist/studio-planner-ui.mjs';
import {poseWorkspaceCss,poseWorkspaceSource} from './dist/studio-pose-window-data.mjs';
import {environment,memory} from './pose-test-dom.mjs';
const rule=(css,selector)=>[...css.replace(/\/\*[\s\S]*?\*\//g,'').matchAll(/([^{}]+)\{([^{}]*)\}/g)].filter(m=>m[1].trim()===selector).map(m=>m[2]).join(';');
test('long reference and pose notes are collapsed sections after their controls, not overlapping loose paragraphs',()=>{
 const {doc}=environment(memory());let language='HU';const ui=attachVirtualStudio({getLanguage:()=>language}),root=doc.getElementById('virtual-studio-poses'),reference=root.querySelector('.pose-reference'),help=reference.querySelector('.pose-reference-help'),notes=root.querySelector('.pose-studio-help');
 assert.equal(help.open,false);assert.equal(notes.open,false);assert.equal(help.querySelectorAll('p').length,1);assert.equal(notes.querySelectorAll('p').length,2);assert.match(help.querySelector('summary').textContent,/referencia/);assert.match(notes.querySelector('summary').textContent,/tudnivalók/);
 const panel=reference.querySelector('.pose-reference-fields'),button=reference.querySelector('[data-pose-reference-action="reset"]');assert.ok(panel.children.includes(button));assert.ok(!panel.children.includes(help));
 const state=ui.getState();help.open=notes.open=true;for(const code of ['EN','HU','DE','FR','ES','IT','PT','PL']){language=code;doc.getElementById('ui-language').dispatchEvent({type:'change'});assert.equal(help.open,true);assert.equal(notes.open,true);assert.ok(help.querySelector('summary').textContent);assert.ok(notes.querySelector('summary').textContent);}assert.deepEqual(ui.getState(),state);
});
test('fixed-height workspaces have a zero-minimum grid row and a separately bounded scrolling sidebar',()=>{
 const desktop=rule(poseWorkspaceCss,'.pose-workspace .pose-layout'),sidebar=rule(poseWorkspaceCss,'.pose-workspace .pose-layout>.pose-sidebar');assert.match(desktop,/grid-template-rows:minmax\(0,1fr\)/);assert.match(desktop,/grid-template-rows:none/,'stacked layout resets its row sizing');assert.match(sidebar,/min-height:0/);assert.match(sidebar,/max-height:100%/);assert.match(sidebar,/overflow:auto/);
 const form=rule(poseWorkspaceCss,'.pose-reference .pose-reference-fields');assert.match(form,/grid-template-columns:minmax\(0,1fr\)/);const reset=rule(poseWorkspaceCss,'.pose-reference .pose-reference-fields>button');assert.match(reset,/grid-column:1\/-1/);assert.match(reset,/width:100%/);assert.match(reset,/height:auto/);
 assert.match(poseWorkspaceSource,/pose-reference-help/);assert.match(poseWorkspaceSource,/pose-studio-help/);const page=readFileSync(new URL('./dist/ArtofTomworks_Prompt_Studio_OFFLINE.html',import.meta.url),'utf-8');assert.ok(page.includes('grid-template-rows:minmax(0,1fr)'));assert.ok(page.includes('.pose-reference .pose-reference-fields>button'));
});
