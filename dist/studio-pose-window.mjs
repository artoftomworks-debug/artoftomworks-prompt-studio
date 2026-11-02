import {poseWorkspaceSource,poseWorkspaceCss} from './studio-pose-window-data.mjs';

export function poseWorkspacePage(plan,language='EN',reference=null){
 const code=poseWorkspaceSource+'\nwindow.opener=null;mountPoseWorkspace('+JSON.stringify(plan)+','+JSON.stringify(language)+','+JSON.stringify(reference)+');';
 return '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Figures and poses — Prompt Studio</title><style>'+poseWorkspaceCss+'</style></head><body><script>'+code.replace(/<\/script/gi,'<\\/script')+'</scr'+'ipt></body></html>';
}
export function openPoseWindow(plan,language='EN',reference=null){
 const url=URL.createObjectURL(new Blob([poseWorkspacePage(plan,language,reference)],{type:'text/html'}));let tab;
 try{tab=window.open(url,'_blank');if(tab)tab.opener=null;}finally{setTimeout(()=>URL.revokeObjectURL(url),60000);}return !!tab;
}
