import assert from 'node:assert/strict';
import {mkdtemp,mkdir,copyFile,writeFile,utimes,stat,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve,sep} from 'node:path';
import {pathToFileURL} from 'node:url';
const sandbox=await mkdtemp(join(tmpdir(),'prompt-studio-cleanup-release-'));
try{
  await mkdir(join(sandbox,'dist'));
  for(const name of ['media-catalog.mjs','cleanup-advisor.mjs','dist/sentence-bank.mjs','dist/translation-glossary.mjs'])await copyFile(new URL('./'+name,import.meta.url),join(sandbox,name));
  const c=await import(pathToFileURL(join(sandbox,'media-catalog.mjs')).href);
  const media=join(sandbox,'media');await mkdir(media);
  const old=new Date(Date.now()-2*60*60*1000);
  for(const name of ['copy-a.jpg','copy-b.jpg','copy-c.jpg','empty-1.png','empty-2.png']){
    const path=join(media,name);await writeFile(path,name.startsWith('empty')?Buffer.alloc(0):Buffer.from([255,216,255,217]));await utimes(path,old,old);
  }
  await writeFile(join(media,'recent.png'),Buffer.alloc(0));
  await c.loadMediaCatalog();assert.deepEqual(c.catalogStatus().roots,[]);
  await c.addCatalogRoot(media);assert.equal(c.startCatalogScan(),true);
  while(c.catalogStatus().scan.running)await new Promise(r=>setTimeout(r,10));
  assert.equal(c.startCatalogCleanup(),true);
  while(c.catalogCleanupStatus().running)await new Promise(r=>setTimeout(r,10));
  assert.equal(c.catalogCleanupStatus().results,5);
  assert.ok(c.catalogCleanupStatus().skippedRecent>=1);
  const empty=c.catalogCleanupResults(0).results.find(row=>row.item.filename==='empty-1.png');
  await c.deleteCatalogItem(empty.id,'permanent');
  assert.equal(c.catalogCleanupStatus().results,4);assert.ok(c.catalogCleanupStatus().finishedAt);
  const preview=await c.previewCatalogCleanupBatch(c.catalogCleanupResults(0).results.map(row=>row.id));
  assert.equal(preview.protectedFiles.length,1);assert.equal(preview.count,3);
  assert.ok(!preview.ids.includes(preview.protectedFiles[0].id));
  const result=await c.deleteCatalogCleanupBatch(preview.token,'permanent');
  assert.equal(result.deleted.length,3);assert.equal(result.failed,'');
  assert.equal(c.catalogCleanupStatus().results,0);assert.ok(c.catalogCleanupStatus().finishedAt);
  const remaining=[];for(const name of ['copy-a.jpg','copy-b.jpg','copy-c.jpg'])try{await stat(join(media,name));remaining.push(name);}catch{}
  assert.equal(remaining.length,1);
  await stat(join(media,'recent.png'));
  await assert.rejects(c.deleteCatalogCleanupBatch(preview.token,'permanent'));
  console.log('Cleanup: recent files skipped, results retained, batch confirmation single-use, one exact copy protected.');
}finally{
  const target=resolve(sandbox),parent=resolve(tmpdir())+sep;
  assert.ok(target.startsWith(parent)&&target.split(sep).at(-1).startsWith('prompt-studio-cleanup-release-'));
  await rm(target,{recursive:true,force:true});
}
