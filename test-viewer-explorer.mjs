import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const read=p=>readFileSync(new URL(p,import.meta.url),'utf8');
const ui=read('./dist/media-catalog-ui.mjs'),backend=read('./media-catalog.mjs');
const labels=JSON.parse(ui.match(/const viewerExplorerCopy = (.*);/)[1]);
const handler=ui.slice(ui.indexOf('    dialog.querySelector("[data-viewer-reveal-file]").addEventListener'),ui.indexOf('    dialog.querySelector("[data-viewer-copy-path]").addEventListener'));
test('image/video viewer opens the indexed ID, localised success/failure, ignores stale responses',async()=>{
 assert.ok(ui.includes('for (const dialog of [imageDialog,videoDialog])'));
 for(const kind of ['image','video'])for(const language of Object.keys(labels)){
  let click,request;const button={disabled:false,addEventListener:(_,fn)=>click=fn},status={textContent:''};
  const item={id:'abc',kind,path:'E:/Art & photos/árvíz.'+(kind==='image'?'png':'mp4')};
  const dialog={open:true,querySelector:s=>s==='[data-viewer-reveal-file]'?button:status};
  const ctx={dialog,viewerItem:item,viewerExplorerCopy:labels,getLanguage:()=>language,renderViewerToolbar:()=>button.disabled=false,api:async(...args)=>request=args};
  vm.runInNewContext(handler,ctx);await click();assert.equal(request[0],'/api/catalog/reveal-file');assert.deepEqual(JSON.parse(request[1].body),{id:'abc'});assert.equal(status.textContent,labels[language][1]);
  ctx.api=async()=>{throw Error('moved')};await click();assert.equal(status.textContent,labels[language][2]);assert.equal(button.disabled,false);
  status.textContent='other file';ctx.api=async()=>{ctx.viewerItem={id:'other'}};await click();assert.equal(status.textContent,'other file');
 }
 assert.ok(read('./dist/ArtofTomworks_Prompt_Studio_OFFLINE.html').includes('data-viewer-reveal-file'));
});
test('reveal validates catalog membership, root and file fingerprint before launching',async()=>{
 const code=backend.slice(backend.indexOf('export async function revealCatalogFile'),backend.indexOf('export async function launchCatalogExplorer')).replace('export ','');
 let launched=[];const item={id:'abc',path:'E:/Art/image.mp4',kind:'video',root:'E:/Art',size:5,modified:'2026-11-01T00:00:00.000Z'};
 const ctx={catalogItem:()=>item,idFor:()=>item.id,index:{roots:['E:/Art']},resolve:x=>x,checkedFile:async()=>({size:5,mtime:new Date(item.modified)}),launchCatalogExplorer:async p=>launched.push(p)};
 vm.runInNewContext(code,ctx);await ctx.revealCatalogFile('abc');assert.equal(launched[0],item.path);
 for(const modify of [()=>ctx.catalogItem=()=>null,()=>ctx.index={roots:[]},()=>ctx.idFor=()=> 'wrong',()=>ctx.checkedFile=async()=>({size:6,mtime:new Date(item.modified)}),()=>ctx.checkedFile=async()=>{throw Error('missing or linked')}]){
  ctx.catalogItem=()=>item;ctx.index={roots:['E:/Art']};ctx.idFor=()=>item.id;ctx.checkedFile=async()=>({size:5,mtime:new Date(item.modified)});launched=[];modify();await assert.rejects(()=>ctx.revealCatalogFile('abc'));assert.equal(launched.length,0);
 }
});
test('Explorer uses separate shell-free arguments and does not wait for its long-lived process',async()=>{
 const code=backend.slice(backend.indexOf('export async function launchCatalogExplorer'),backend.indexOf('function isWithin')).replace('export ','');let args,unref=false;
 const ctx={process:{platform:'win32'},spawn:(...a)=>{args=a;return {once:(event,fn)=>{if(event==='spawn')queueMicrotask(fn)},unref:()=>unref=true}}};
 vm.runInNewContext(code,ctx);const path='E:/My photos/árvíz & (test).mp4';await ctx.launchCatalogExplorer(path);
 assert.equal(args[0],'explorer.exe');assert.deepEqual(Array.from(args[1]),['/select,',path]);assert.equal(args[2].shell,false);assert.equal(unref,true);
});
