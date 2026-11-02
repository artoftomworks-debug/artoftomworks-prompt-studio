import assert from 'node:assert/strict';
import {test} from 'node:test';
import {mkdtemp,mkdir,copyFile,writeFile,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve,sep} from 'node:path';
import {pathToFileURL} from 'node:url';
import {normalizeCatalogRoot} from './media-catalog.mjs';
import {catalogRootLabels} from './dist/media-catalog-ui.mjs';

test('Windows drive names, roots and quoted paths normalize without resolving drive-relative locations',()=>{
 for(const path of ['E','e:','E:\\','E:/',' "E:\\" '])assert.equal(normalizeCatalogRoot(path,'win32'),'E:\\');
 assert.equal(normalizeCatalogRoot('"E:\\My media\\archive"','win32'),'E:\\My media\\archive');
 for(const path of ['', 'E:relative', 'media/relative'])assert.throws(()=>normalizeCatalogRoot(path,'win32'),/absolute/);
 for(const language of ['EN','HU','DE','FR','ES','IT','PT','PL']){
  const copy=catalogRootLabels(language);assert.deepEqual(Object.keys(copy),['root','help','cancel','cancelling','folders','stopped']);assert.ok(Object.values(copy).every(x=>x.length>3));
 }
});

test('nested folders are indexed from one parent; cancellation preserves the previous archive and ratings',async()=>{
 const sandbox=await mkdtemp(join(tmpdir(),'prompt-studio-archive-roots-'));
 try{
  await mkdir(join(sandbox,'dist'));
  for(const name of ['media-catalog.mjs','cleanup-advisor.mjs','dist/sentence-bank.mjs','dist/translation-glossary.mjs'])await copyFile(new URL('./'+name,import.meta.url),join(sandbox,name));
  const c=await import(pathToFileURL(join(sandbox,'media-catalog.mjs')).href),media=join(sandbox,'media');await mkdir(media);
  let deep=media;for(let i=0;i<12;i++){deep=join(deep,'level'+i);await mkdir(deep);}
  await writeFile(join(media,'base.jpg'),Buffer.from([255,216,255,217]));
  await writeFile(join(media,'base.swarm.json'),JSON.stringify({sui_image_params:{prompt:'An archive test image'}}));
  await writeFile(join(deep,'deep.mp4'),Buffer.alloc(8));
  for(const name of ['node_modules','.git','.venv','$Recycle.Bin','System Volume Information']){const dir=join(media,name);await mkdir(dir);await writeFile(join(dir,'ignore.jpg'),'not an archive item');}
  await c.loadMediaCatalog();await c.addCatalogRoot(media);assert.equal(c.catalogStatus().roots.length,1);
  assert.equal(c.cancelCatalogScan(),false);assert.equal(c.startCatalogScan(),true);
  while(c.catalogStatus().scan.running)await new Promise(r=>setTimeout(r,5));
  assert.equal(c.catalogStatus().scan.message,'');assert.equal(c.catalogStatus().indexed,2);assert.equal(c.searchCatalog({kind:'video'}).total,1);assert.ok(c.catalogStatus().scan.directories>=13);assert.ok(c.catalogStatus().scan.skippedFolders>=5);
  const base=c.searchCatalog({kind:'image'}).results[0];await c.setCatalogAnnotation(base.id,{rating:4});
  const indexPath=join(sandbox,'data/media-catalog-index.json.gz'),previous=await readFile(indexPath);
  await writeFile(join(deep,'new.jpg'),Buffer.from([255,216,255,217]));
  assert.equal(c.startCatalogScan(),true);assert.equal(c.cancelCatalogScan(),true);
  while(c.catalogStatus().scan.running)await new Promise(r=>setTimeout(r,5));
  assert.equal(c.catalogStatus().scan.cancelled,true);assert.equal(c.catalogStatus().indexed,2);assert.equal(c.catalogStatus().scan.currentFolder,'');assert.deepEqual(await readFile(indexPath),previous);assert.equal(c.searchCatalog({rating:4}).total,1);
  c.startCatalogScan();while(c.catalogStatus().scan.running)await new Promise(r=>setTimeout(r,5));
  assert.equal(c.catalogStatus().indexed,3);assert.equal(c.catalogStatus().scan.cancelled,false);assert.equal(c.searchCatalog({rating:4}).total,1);
 }finally{
  const target=resolve(sandbox),parent=resolve(tmpdir())+sep;assert.ok(target.startsWith(parent)&&target.split(sep).at(-1).startsWith('prompt-studio-archive-roots-'));
  await rm(target,{recursive:true,force:true});
 }
});
