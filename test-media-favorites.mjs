import assert from "node:assert/strict";
import { copyFile, mkdir, mkdtemp, readFile, rmdir, unlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { gzipSync } from "node:zlib";

const folder = await mkdtemp(join(tmpdir(),"prompt-studio-favorites-test-"));
const mediaFolder = join(folder,"media");
const dataFolder = join(folder,"data");
const modulePath = join(folder,"media-catalog.mjs");
const glossaryPath = join(folder,"dist","translation-glossary.mjs");
const indexPath = join(dataFolder,"media-catalog-index.json.gz");
const labelsPath = join(dataFolder,"media-catalog-favorites.json");
const labelsBackupPath = join(dataFolder,"media-catalog-favorites.json.bak");
const imagePath = join(mediaFolder,"test-image.png");
const sidecarPath = join(mediaFolder,"test-image.swarm.json");
try {
  await mkdir(mediaFolder);
  await mkdir(dataFolder);
  await mkdir(join(folder,"dist"));
  await copyFile(new URL("./media-catalog.mjs",import.meta.url),modulePath);
  await copyFile(new URL("./dist/sentence-bank.mjs",import.meta.url),join(folder,"dist","sentence-bank.mjs"));
  await copyFile(new URL("./dist/translation-glossary.mjs",import.meta.url),glossaryPath);
  await writeFile(indexPath,gzipSync(Buffer.from(JSON.stringify({roots:[mediaFolder],scannedAt:null,items:[],scanned:0,skipped:0,errors:0}))));
  await writeFile(imagePath,"test-only image");
  await writeFile(sidecarPath,JSON.stringify({sui_image_params:{prompt:"A nature scene",model:"test-model"}}));
  const url = pathToFileURL(modulePath).href;
  const catalog = await import(`${url}?first=${Date.now()}`);
  await catalog.loadMediaCatalog();
  assert.equal(catalog.startCatalogScan(),true);
  while (catalog.catalogStatus().scan.running) await new Promise((resolve) => setTimeout(resolve,20));
  assert.equal(catalog.catalogStatus().indexed,1);
  const id = catalog.searchCatalog({}).results[0].id;
  assert.deepEqual(catalog.catalogStatus().categories.includes("Nature"),true);
  assert.equal((await catalog.addCatalogCategory("  My Showcase  ")).category,"My Showcase");
  assert.equal((await catalog.addCatalogCategory("my showcase")).category,"My Showcase");
  await assert.rejects(catalog.addCatalogCategory(" "),/Category/);
  await assert.rejects(catalog.setCatalogAnnotation(id,{rating:6}),/Rating/);
  await catalog.setCatalogAnnotation(id,{rating:5,category:"My Showcase"});
  assert.equal(catalog.catalogStatus().rated,1);
  assert.equal(catalog.searchCatalog({rating:5,category:"My Showcase"}).total,1);
  assert.equal(catalog.searchCatalog({rating:5,category:"Nature"}).total,0);
  assert.equal(catalog.searchCatalog({query:"My Showcase"}).total,1);
  assert.equal(catalog.startCatalogScan(),true);
  while (catalog.catalogStatus().scan.running) await new Promise((resolve) => setTimeout(resolve,20));
  assert.equal(catalog.searchCatalog({rating:5,category:"My Showcase"}).total,1,"rescan should preserve labels");
  const restored = await import(`${url}?second=${Date.now()+1}`);
  await restored.loadMediaCatalog();
  assert.equal(restored.searchCatalog({rating:5,category:"My Showcase"}).total,1,"restart should preserve labels");
  await restored.setCatalogAnnotation(id,{rating:0});
  assert.equal(restored.searchCatalog({rating:1}).total,0);
  assert.equal(restored.searchCatalog({category:"My Showcase"}).total,1);
  await restored.setCatalogAnnotation(id,{category:""});
  assert.deepEqual(JSON.parse(await readFile(labelsPath,"utf8")).items,{});
  console.log("Media ratings, custom categories, filtering, rescan and restart checks passed.");
} finally {
  for (const path of [imagePath,sidecarPath,indexPath,labelsPath,labelsBackupPath,modulePath,glossaryPath,join(folder,"dist","sentence-bank.mjs")]) {
    try { await unlink(path); } catch (error) { if (error.code !== "ENOENT") throw error; }
  }
  await rmdir(mediaFolder);
  await rmdir(dataFolder);
  await rmdir(join(folder,"dist"));
  await rmdir(folder);
}
