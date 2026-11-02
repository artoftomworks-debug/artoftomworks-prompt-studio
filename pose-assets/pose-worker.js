/* MediaPipe runtime/model are served from this same local application. */
importScripts('vision_bundle.js');
self.onmessage=async event=>{
 const {id,bitmap}=event.data||{};let model;
 try{
  if(!bitmap||!Number.isInteger(id))throw Error('invalid_request');
  self.postMessage({id,type:'loading'});
  const files=await Vision.FilesetResolver.forVisionTasks(new URL('wasm',self.location.href).href);
  model=await Vision.PoseLandmarker.createFromOptions(files,{
   baseOptions:{modelAssetPath:new URL('pose_landmarker_full.task',self.location.href).href,delegate:'CPU'},
   runningMode:'IMAGE',numPoses:8,minPoseDetectionConfidence:.5,minPosePresenceConfidence:.5,outputSegmentationMasks:false
  });
  self.postMessage({id,type:'working'});const result=model.detect(bitmap);
  const point=p=>({x:p.x,y:p.y,z:p.z,visibility:p.visibility??0,presence:p.presence??1});
  self.postMessage({id,type:'done',result:{width:bitmap.width,height:bitmap.height,landmarks:result.landmarks.map(pose=>pose.map(point)),worldLandmarks:result.worldLandmarks.map(pose=>pose.map(point))}});
 }catch{self.postMessage({id,type:'error',error:'failed'});}
 finally{try{model?.close();}catch{}bitmap?.close?.();}
};
