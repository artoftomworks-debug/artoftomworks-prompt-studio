import {test} from 'node:test';
import assert from 'node:assert/strict';
import {attachVirtualStudio} from './dist/studio-planner-ui.mjs';
import {studioPlannerKey} from './dist/studio-planner.mjs';
import {environment,memory} from './pose-test-dom.mjs';
const action=(root,key)=>root.querySelector('[data-pose-action="'+key+'"]'),field=(root,key)=>root.querySelector('[data-pose-field="'+key+'"]');
const screen=(x,y)=>({clientX:26.4+x*.72,clientY:y*.72,pointerId:1,button:0});
async function setup(){const storage=memory(),{doc}=environment(storage),ui=attachVirtualStudio({getLanguage:()=> 'HU'}),root=doc.getElementById('virtual-studio-poses');await action(root,'add').emit('click');return {storage,ui,root,svg:root.querySelector('svg')};}
async function activateJoint(env,key='pelvis'){
 const id=env.ui.getState().figures[0].id,g=env.svg.querySelector('[data-pose-joint="'+id+':'+key+'"]'),p=g.children[1].attributes;await g.emit('pointerdown',screen(Number(p.cx),Number(p.cy)));await env.svg.emit('pointerup',{pointerId:1});
}
async function clickOutside(env){await env.svg.emit('pointerdown',{...screen(25,470),target:env.svg});await env.svg.emit('pointerup',{pointerId:1});}
test('initial clean view, figure selection and outside-click hiding change no saved scene',async()=>{
 const env=await setup(),{root,svg,ui,storage}=env,before=ui.getState(),raw=storage.getItem(studioPlannerKey);assert.equal(svg.querySelectorAll('[data-pose-axis]').length,0);assert.equal(svg.querySelectorAll('text').length,0);
 await activateJoint(env);assert.equal(svg.querySelectorAll('[data-pose-axis]').length,3);assert.ok(svg.querySelectorAll('text').length>0);assert.match(root.querySelector('.pose-selection').textContent,/Medence/);
 await clickOutside(env);assert.equal(svg.querySelectorAll('[data-pose-axis]').length,0);assert.equal(svg.querySelectorAll('text').length,0);assert.ok(svg.querySelectorAll('[data-pose-joint]').length>0);assert.match(root.querySelector('.pose-selection').textContent,/Kattints/);assert.deepEqual(ui.getState(),before);assert.equal(storage.getItem(studioPlannerKey),raw);
 await activateJoint(env,'lWrist');assert.equal(svg.querySelectorAll('[data-pose-axis]').length,3);assert.equal(ui.poses.getSelected().joint,'lWrist');assert.equal(storage.getItem(studioPlannerKey),raw);
});
test('clicking a bone, keyboard selection and dropdown selection restore handles; Esc hides them',async()=>{
 const env=await setup(),{svg,ui,root}=env,id=ui.getState().figures[0].id,bone=svg.querySelector('[data-pose-bone-hit="'+id+':neck"]'),a=bone.attributes;
 await bone.emit('pointerdown',screen((Number(a.x1)+Number(a.x2))/2,(Number(a.y1)+Number(a.y2))/2));await svg.emit('pointerup',{pointerId:1});assert.equal(ui.poses.getSelected().joint,'neck');assert.equal(svg.querySelectorAll('[data-pose-axis]').length,3);
 await root.emit('keydown',{key:'Escape',target:svg});assert.equal(svg.querySelectorAll('[data-pose-axis]').length,0);await svg.querySelector('[data-pose-joint="'+id+':rElbow"]').emit('keydown',{key:'Enter'});assert.equal(svg.querySelectorAll('[data-pose-axis]').length,3);
 await clickOutside(env);field(root,'joint').value='rWrist';await field(root,'joint').emit('change');assert.equal(svg.querySelectorAll('[data-pose-axis]').length,3);assert.equal(ui.poses.getSelected().joint,'rWrist');
});
test('orbit drag retains handles, a plain click clears them, and clean navigation does not reselect',async()=>{
 const env=await setup(),{root,svg,storage}=env;field(root,'view').value='space';await field(root,'view').emit('change');await activateJoint(env);const raw=storage.getItem(studioPlannerKey);
 await svg.emit('pointerdown',{...screen(25,470),target:svg});await svg.emit('pointermove',screen(80,440));await svg.emit('pointerup',{pointerId:1});assert.equal(svg.querySelectorAll('[data-pose-axis]').length,3);
 await clickOutside(env);assert.equal(svg.querySelectorAll('[data-pose-axis]').length,0);await svg.emit('pointerdown',{...screen(25,470),target:svg});await svg.emit('pointermove',screen(80,440));await svg.emit('pointerup',{pointerId:1});assert.equal(svg.querySelectorAll('[data-pose-axis]').length,0);assert.equal(storage.getItem(studioPlannerKey),raw);
});
