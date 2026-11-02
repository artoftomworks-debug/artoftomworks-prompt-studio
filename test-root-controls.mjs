import assert from 'node:assert/strict';
import {test} from 'node:test';
import {mkdtemp,mkdir,copyFile,writeFile,readFile,unlink,rmdir,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve,sep} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createCatalogRootChip,catalogRootControlLabels} from './dist/media-catalog-ui.mjs';

test('archive location removal preserves files, overlapping roots and ratings across reload/re-add; failed writes keep configuration',async()=>{
 const sandbox=await mkdtemp(join(tmpdir(),'prompt-studio-root-controls-'));
 try{
  await mkdir(join(sandbox,'dist'));
  for(const name of ['media-catalog.mjs','cleanup-advisor.mjs','dist/sentence-bank.mjs','dist/translation-glossary.mjs'])await copyFile(new URL('./'+name,import.meta.url),join(sandbox,name));
  const moduleUrl=pathToFileURL(join(sandbox,'media-catalog.mjs')).href,c=await import(moduleUrl),parent=join(sandbox,'media'),child=join(parent,'child'),other=join(sandbox,'other');
  await mkdir(child,{recursive:true});await mkdir(other);
  const files=[join(parent,'a.jpg'),join(child,'b.jpg'),join(child,'b.swarm.json'),join(other,'c.mp4')];
  for(const file of files)await writeFile(file,file.endsWith('.json')?JSON.stringify({sui_image_params:{prompt:'A retained child image'}}):Buffer.from([255,216,255,217]));
  const original=new Map(await Promise.all(files.map(async path=>[path,await readFile(path)])));
  await c.loadMediaCatalog();for(const path of [parent,child,other])await c.addCatalogRoot(path);
  c.startCatalogScan();while(c.catalogStatus().scan.running)await new Promise(r=>setTimeout(r,5));
  assert.equal(c.catalogStatus().indexed,3);
  const b=c.searchCatalog({query:'b.jpg'}).results[0];assert.equal(b.root,parent);await c.setCatalogAnnotation(b.id,{rating:5});
  const cached=join(sandbox,'data/media-catalog-index.json.gz'),saved=await readFile(cached),before=c.catalogStatus().roots;
  await unlink(cached);await mkdir(cached);
  await assert.rejects(c.removeCatalogRoot(parent));assert.deepEqual(c.catalogStatus().roots,before);assert.equal(c.catalogStatus().indexed,3);
  await rmdir(cached);await writeFile(cached,saved);
  const review=await c.previewCatalogBatch([b.id]);
  const removed=await c.removeCatalogRoot(parent);assert.equal(removed.removedItems,1);assert.deepEqual(removed.roots,[child,other]);assert.equal(c.searchCatalog({query:'b.jpg'}).results[0].root,child);assert.equal(c.searchCatalog({rating:5}).total,1);
  await assert.rejects(c.deleteCatalogBatch(review.token,'permanent'),/expired/);
  for(const [path,bytes]of original)assert.deepEqual(await readFile(path),bytes);
  const reloaded=await import(moduleUrl+'?reload');await reloaded.loadMediaCatalog();assert.deepEqual(reloaded.catalogStatus().roots,[child,other]);assert.equal(reloaded.searchCatalog({rating:5}).total,1);
  await assert.rejects(reloaded.removeCatalogRoot(parent),/not registered/);
  reloaded.startCatalogScan();await assert.rejects(reloaded.removeCatalogRoot(child),/Wait/);reloaded.cancelCatalogScan();while(reloaded.catalogStatus().scan.running)await new Promise(r=>setTimeout(r,5));
  await reloaded.removeCatalogRoot(child);await reloaded.removeCatalogRoot(other);assert.equal(reloaded.catalogStatus().roots.length,0);assert.equal(reloaded.searchCatalog({}).total,0);
  await reloaded.addCatalogRoot(parent);reloaded.startCatalogScan();while(reloaded.catalogStatus().scan.running)await new Promise(r=>setTimeout(r,5));
  assert.equal(reloaded.catalogStatus().indexed,2);assert.equal(reloaded.searchCatalog({rating:5}).results[0].id,b.id);
  for(const [path,bytes]of original)assert.deepEqual(await readFile(path),bytes);
 }finally{
  const target=resolve(sandbox),parent=resolve(tmpdir())+sep;assert.ok(target.startsWith(parent)&&target.split(sep).at(-1).startsWith('prompt-studio-root-controls-'));
  await rm(target,{recursive:true,force:true});
 }
});

test('each archive chip has an accessible localized remove button, displays literal paths and respects its disabled state',async()=>{
 class E{constructor(tag){this.tagName=tag;this.children=[];this.attributes={};this.events={};}append(...nodes){this.children.push(...nodes);}setAttribute(k,v){this.attributes[k]=v;}addEventListener(t,fn){this.events[t]=fn;}}
 globalThis.document={createElement:t=>new E(t)};
 for(const language of ['HU','EN','DE','FR','ES','IT','PT','PL']){
  const copy=catalogRootControlLabels(language);assert.deepEqual(Object.keys(copy),['remove','help','removed','error']);assert.ok(Object.values(copy).every(x=>x.length>3));
  const path='E:\\Media & <examples>',calls=[],chip=createCatalogRootChip(path,copy,false,value=>calls.push(value)),button=chip.children[1];
  assert.equal(chip.children[0].textContent,path);assert.equal(button.type,'button');assert.equal(button.textContent,'×');assert.equal(button.attributes['aria-label'],copy.remove+': '+path);assert.ok(button.title.includes(copy.help));
  await button.events.click();assert.deepEqual(calls,[path]);button.disabled=true;await button.events.click();assert.deepEqual(calls,[path]);
 }
});
