import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Script,createContext} from 'node:vm';
import {readFileSync} from 'node:fs';
import {createPoseHelp,poseHelpLabels} from './dist/pose-help.mjs';
import {attachVirtualStudio} from './dist/studio-planner-ui.mjs';
import {poseWorkspaceSource,poseWorkspaceCss} from './dist/studio-pose-window-data.mjs';
import {studioPreset,studioPlannerKey} from './dist/studio-planner.mjs';
import {environment,memory} from './pose-test-dom.mjs';

test('help works on hover, focus and click; Escape/outside click dismiss without editing values',async()=>{
 const {doc}=environment(memory());let lang='HU';const help=createPoseHelp(()=>lang),label=doc.createElement('label'),span=doc.createElement('span'),input=doc.createElement('input');span.textContent='IK';input.value='keep';label.append(span,input);doc.body.append(label);
 const button=help.add(label,()=>poseHelpLabels(lang).ik,()=>span.textContent);
 assert.equal(help.popup.hidden,true);assert.equal(help.popup.parentElement,doc.body);assert.equal(button.type,'button');assert.equal(button.attributes['aria-describedby'],help.popup.id);
 await button.emit('pointerenter');assert.equal(help.popup.hidden,false);assert.match(help.popup.textContent,/könyök/);assert.equal(button.attributes['aria-expanded'],'true');
 await button.emit('focus');await button.emit('click');await button.emit('pointerleave');assert.equal(help.popup.hidden,false);await button.emit('click');assert.equal(help.popup.hidden,true);
 await button.emit('focus');await button.emit('keydown',{key:'Escape'});assert.equal(help.popup.hidden,true);assert.equal(button.attributes['aria-expanded'],'false');
 await button.emit('click');doc.dispatchEvent({type:'pointerdown',target:input});assert.equal(help.popup.hidden,true);assert.equal(input.value,'keep');assert.ok(label.querySelector('.pose-field-heading').children.includes(span));
 for(const code of ['EN','HU','DE','FR','ES','IT','PT','PL']){lang=code;help.refresh();await button.emit('focus');assert.equal(help.popup.textContent,poseHelpLabels(code).ik);assert.ok(button.attributes['aria-label'].startsWith(poseHelpLabels(code).help));assert.ok(Object.values(poseHelpLabels(code)).every(v=>v&&typeof v==='string'));}
 help.hide();
});

test('floating help stays within the viewport and uses the top layer when available',async()=>{
 const {doc}=environment(memory()),help=createPoseHelp(),label=doc.createElement('label'),span=doc.createElement('span');label.append(span);doc.body.append(label);
 const b=help.add(label,()=> 'Explanation',()=> 'Field');globalThis.innerWidth=420;globalThis.innerHeight=350;
 b.getBoundingClientRect=()=>({left:390,top:300,width:36,height:36,bottom:336});help.popup.getBoundingClientRect=()=>({width:380,height:180});await b.emit('click');assert.equal(help.popup.style.left,'28px');assert.equal(help.popup.style.top,'112px');help.hide();delete globalThis.innerWidth;delete globalThis.innerHeight;
 const original=doc.createElement;let opened=0,closed=0;doc.createElement=tag=>{const n=original(tag);n.showPopover=()=>opened++;n.hidePopover=()=>closed++;return n;};
 const native=createPoseHelp(),target=original('div'),trigger=native.add(target,()=> 'Native help',()=> 'Field');await trigger.emit('click');assert.equal(opened,1);assert.equal(native.popup.attributes.popover,'manual');native.hide();assert.equal(closed,1);
});

test('sidebar collapse preserves saved figures, reference alignment, selection and shared state',async()=>{
 const storage=memory(),{doc}=environment(storage);const ui=attachVirtualStudio({getLanguage:()=> 'HU'}),root=doc.getElementById('virtual-studio-poses');
 await root.querySelector('[data-pose-action="add"]').emit('click');const state=JSON.stringify(ui.getState()),saved=storage.getItem(studioPlannerKey),selected=ui.poses.getSelected(),config=ui.poses.reference.getConfig();assert.ok(saved);
 const toggle=root.querySelector('[data-pose-action="sidebarToggle"]'),sidebar=root.querySelector('.pose-sidebar'),layout=root.querySelector('.pose-layout');
 assert.match(toggle.textContent,/elrejtése/);assert.equal(toggle.attributes['aria-expanded'],'true');await toggle.emit('click');assert.equal(sidebar.hidden,true);assert.equal(layout.dataset.controlsCollapsed,'true');assert.match(toggle.textContent,/megjelenítése/);assert.equal(toggle.attributes['aria-expanded'],'false');
 assert.equal(JSON.stringify(ui.getState()),state);assert.equal(storage.getItem(studioPlannerKey),saved);assert.deepEqual(ui.poses.getSelected(),selected);assert.deepEqual(ui.poses.reference.getConfig(),config);
 await toggle.emit('click');assert.equal(sidebar.hidden,false);assert.equal(layout.dataset.controlsCollapsed,'false');assert.ok(root.querySelector('.pose-reference-fields').querySelector('.pose-help-trigger'));assert.ok(root.querySelector('[data-pose-field="azimuth"]').parentElement.querySelector('.pose-help-trigger'));
});

test('actual generated workspace and main bundle both contain help and collapse controls',async()=>{
 const storage=memory(),{doc}=environment(storage),context=createContext({document:doc,localStorage:storage,Option:globalThis.Option,navigator:globalThis.navigator,setTimeout,clearTimeout,requestAnimationFrame:()=>1,cancelAnimationFrame(){},window:{close(){}},initial:studioPreset()});
 new Script(poseWorkspaceSource+'\nglobalThis.workspace=mountPoseWorkspace(initial,"HU");').runInContext(context);
 const toggle=doc.body.querySelector('[data-pose-action="sidebarToggle"]');await toggle.emit('click');assert.equal(doc.body.querySelector('.pose-sidebar').hidden,true);assert.ok(doc.body.querySelector('[data-pose-camera="aim"]').parentElement.querySelector('.pose-help-trigger'));
 assert.match(poseWorkspaceCss,/\.pose-workspace \.pose-layout\[data-controls-collapsed=true\]\{grid-template-columns:minmax\(0,1fr\)\}/);assert.match(poseWorkspaceCss,/\.pose-help-popup\{position:fixed/);assert.match(poseWorkspaceCss,/\.pose-help-popup\[hidden\]\{display:none!important\}/);
 const page=readFileSync(new URL('./dist/ArtofTomworks_Prompt_Studio_OFFLINE.html',import.meta.url),'utf8');assert.ok(page.includes('createPoseHelp'));assert.ok(page.includes('sidebarToggle'));assert.ok(page.includes('2026-11-01.10'));
});
