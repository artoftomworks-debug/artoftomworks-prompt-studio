import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const source=readFileSync(new URL('./dist/media-catalog-ui.mjs',import.meta.url),'utf8');
const labels=JSON.parse(source.match(/const viewerPathCopy = (.*);/)[1]);
const handler=source.slice(source.indexOf('    dialog.querySelector("[data-viewer-copy-path]").addEventListener'),source.indexOf('    dialog.querySelector("[data-viewer-copy-prompt]").addEventListener'));
test('both viewer dialogs copy the exact current path, report failure, and never copy a recipe',async()=>{
 assert.ok(source.includes('for (const dialog of [imageDialog,videoDialog])'));
 for(const kind of ['image','video'])for(const language of Object.keys(labels)){
  let onClick,copied,status={textContent:''};const item={id:'current',path:`E:\\My art\\árvíz.${kind==='video'?'mp4':'png'}`,prompt:'do not copy this'};
  const dialog={open:true,querySelector:s=>s==='[data-viewer-copy-path]'?{addEventListener:(_,fn)=>onClick=fn}:status};
  const context={dialog,viewerItem:item,viewerPathCopy:labels,getLanguage:()=>language,tr:()=>({copyFailed:'failed'}),navigator:{clipboard:{writeText:async s=>copied=s}}};
  vm.runInNewContext(handler,context);await onClick();assert.equal(copied,item.path);assert.equal(status.textContent,labels[language][1]);
  context.navigator.clipboard.writeText=async()=>{throw Error('denied')};await onClick();assert.equal(status.textContent,'failed');
  context.viewerItem=null;copied=null;await onClick();assert.equal(copied,null);
 }
 const offline=readFileSync(new URL('./dist/ArtofTomworks_Prompt_Studio_OFFLINE.html',import.meta.url),'utf8');assert.ok(offline.includes('data-viewer-copy-path'));
});
