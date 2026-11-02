import {test} from 'node:test';
import assert from 'node:assert/strict';
import {posePreset,poseResetFigure,poseMoveJoint} from './dist/studio-poses.mjs';
import {createStudioPlannerStore,studioPreset} from './dist/studio-planner.mjs';
import {attachVirtualStudio} from './dist/studio-planner-ui.mjs';
import {poseLabels} from './dist/studio-poses-ui.mjs';
import {memory,environment} from './pose-test-dom.mjs';
test('pose-only reset restores the applied base but preserves all non-pose figure properties',()=>{
 for(const kind of ['standing','seated','walking','raised','kneeling']){
  let f=posePreset(kind,{id:'figure_keep',identity:'child',name:'Keep name',description:'Keep role',height:1.12,facing:73,color:'#aabbcc',visible:false});f.position={x:1.2,y:2.3,z:-1.4};f=poseMoveJoint(f,'lElbow',{x:-.1,y:.9,z:-.2});const before=JSON.stringify(f),reset=poseResetFigure(f);assert.equal(JSON.stringify(f),before);
  assert.deepEqual(reset.joints,posePreset(kind).joints);assert.notDeepEqual(reset.joints,f.joints);const {joints:a,...properties}=f,{joints:b,...restored}=reset;assert.deepEqual(restored,properties);
 }
});
test('reset changes only the selected figure, uses its applied base and can be undone/redone',async()=>{
 const storage=memory(),store=createStudioPlannerStore(storage),data=store.read();data.state=studioPreset('dramatic');data.state.camera.lens=67;let f=posePreset('seated',{id:'figure_first',name:'First',identity:'woman',height:1.6,facing:28});f.position={x:1.3,y:.7,z:.9};f=poseMoveJoint(f,'rElbow',{x:-.5,y:.8,z:-.1});data.state.figures=[f,posePreset('raised',{id:'figure_second',name:'Second',identity:'man'})];data.presets=[{name:'Do not change',state:data.state}];store.save(data);
 const {doc}=environment(storage),ui=attachVirtualStudio({getLanguage:()=> 'HU'}),root=doc.getElementById('virtual-studio-poses'),before=ui.getState(),button=root.querySelector('[data-pose-action="resetPose"]');assert.match(button.textContent,/Ülő/);
 // An un-applied dropdown choice must not change which base the reset restores.
 root.querySelector('[data-pose-field="applyPose"]').value='walking';await button.emit('click');const after=ui.getState();assert.deepEqual(after.figures[0],poseResetFigure(before.figures[0]));assert.deepEqual({...after,figures:before.figures},before);assert.deepEqual(after.figures[1],before.figures[1]);assert.deepEqual(createStudioPlannerStore(storage).read().presets,data.presets);
 await root.querySelector('[data-pose-action="undo"]').emit('click');assert.deepEqual(ui.getState(),before);await root.querySelector('[data-pose-action="redo"]').emit('click');assert.deepEqual(ui.getState(),after);assert.deepEqual(createStudioPlannerStore(storage).read().state,after);
 for(const language of ['EN','HU','DE','FR','ES','IT','PT','PL']){assert.ok(poseLabels(language).resetPose);assert.ok(poseLabels(language).resetPoseHint);}
});
