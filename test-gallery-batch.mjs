import assert from 'node:assert/strict';
import {mkdtemp,mkdir,copyFile,writeFile,readFile,utimes,stat,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve,sep} from 'node:path';
import {pathToFileURL} from 'node:url';
const sandbox=await mkdtemp(join(tmpdir(),'prompt-studio-gallery-batch-'));
try{
  await mkdir(join(sandbox,'dist'));
  for(const name of ['media-catalog.mjs','cleanup-advisor.mjs','dist/sentence-bank.mjs','dist/translation-glossary.mjs'])await copyFile(new URL('./'+name,import.meta.url),join(sandbox,name));
  const c=await import(pathToFileURL(join(sandbox,'media-catalog.mjs')).href),media=join(sandbox,'media');await mkdir(media);
  for(const name of ['a.jpg','b.jpg','c.mp4'])await writeFile(join(media,name),Buffer.from([255,216,255,217]));
  await writeFile(join(media,'a.swarm.json'),JSON.stringify({sui_image_params:{prompt:'Test only'}}));
  await c.loadMediaCatalog();await c.addCatalogRoot(media);c.startCatalogScan();
  while(c.catalogStatus().scan.running)await new Promise(r=>setTimeout(r,10));
  const items=c.searchCatalog({}).results,ids=items.map(x=>x.id);
  assert.equal(items.length,3);
  for(const invalid of [[],[ids[0],ids[0]],['../../outside'],Array(101).fill(ids[0]),['f'.repeat(24)]])await assert.rejects(c.previewCatalogBatch(invalid));
  const image=items.find(x=>x.filename==='a.jpg'),other=items.find(x=>x.filename==='b.jpg');
  const changed=await c.previewCatalogBatch([other.id,image.id]);
  assert.equal(changed.count,2);assert.equal(changed.files.length,3);
  await writeFile(join(media,'a.swarm.json'),'changed sidecar after review');
  await assert.rejects(c.deleteCatalogBatch(changed.token,'permanent'),/changed/);
  await stat(join(media,'a.jpg'));await stat(join(media,'b.jpg'));
  await assert.rejects(c.deleteCatalogBatch(changed.token,'permanent'),/expired/);
  const review=await c.previewCatalogBatch([image.id,other.id]);
  await assert.rejects(c.deleteCatalogBatch(review.token,'invalid'),/Choose/);
  const removed=await c.deleteCatalogBatch(review.token,'permanent');assert.equal(removed.failed,'');assert.equal(removed.deleted.length,2);
  await assert.rejects(stat(join(media,'a.jpg')));await assert.rejects(stat(join(media,'a.swarm.json')));await assert.rejects(stat(join(media,'b.jpg')));
  await stat(join(media,'c.mp4'));assert.equal(c.searchCatalog({}).total,1);
  await assert.rejects(c.deleteCatalogBatch(review.token,'permanent'),/expired/);
  const video=c.searchCatalog({}).results[0],expired=await c.previewCatalogBatch([video.id]),clock=Date.now;
  try{Date.now=()=>clock()+6*60*1000;await assert.rejects(c.deleteCatalogBatch(expired.token,'permanent'),/expired/);}finally{Date.now=clock;}
  await stat(join(media,'c.mp4'));
  const altered=await c.previewCatalogBatch([video.id]);await writeFile(join(media,'c.mp4'),'changed video');
  await assert.rejects(c.deleteCatalogBatch(altered.token,'permanent'),/changed/);assert.equal(await readFile(join(media,'c.mp4'),'utf8'),'changed video');
  console.log('Gallery batch: selected files/companions only, full preflight, changes refused, invalid IDs and expired/reused confirmation rejected.');
}finally{
  const target=resolve(sandbox),parent=resolve(tmpdir())+sep;
  assert.ok(target.startsWith(parent)&&target.split(sep).at(-1).startsWith('prompt-studio-gallery-batch-'));
  await rm(target,{recursive:true,force:true});
}
