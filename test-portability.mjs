import assert from "node:assert/strict";
import { copyFile, mkdir, mkdtemp, readFile, rmdir, stat, unlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { gunzipSync } from "node:zlib";

const sandbox = await mkdtemp(join(tmpdir(),"prompt-studio-global-test-"));
const modulePath = join(sandbox,"media-catalog.mjs");
const glossaryPath = join(sandbox,"dist","translation-glossary.mjs");
const mediaFolder = join(sandbox,"media");
const mediaPath = join(mediaFolder,"example.png");
const sidecarPath = join(mediaFolder,"example.swarm.json");
const indexPath = join(sandbox,"data","media-catalog-index.json.gz");
try {
  await mkdir(mediaFolder);
  await mkdir(join(sandbox,"dist"));
  await copyFile(new URL("./media-catalog.mjs",import.meta.url),modulePath);
  await copyFile(new URL("./cleanup-advisor.mjs",import.meta.url),join(sandbox,"cleanup-advisor.mjs"));
  await copyFile(new URL("./dist/sentence-bank.mjs",import.meta.url),join(sandbox,"dist","sentence-bank.mjs"));
  await copyFile(new URL("./dist/translation-glossary.mjs",import.meta.url),glossaryPath);
  await writeFile(mediaPath,"temporary test media");
  await writeFile(sidecarPath,JSON.stringify({sui_image_params:{prompt:"A small test scene",negativeprompt:"blurred",model:"test-model"}}));
  const catalog = await import(`${pathToFileURL(modulePath).href}?test=${Date.now()}`);
  await catalog.loadMediaCatalog();
  assert.deepEqual(catalog.catalogStatus().roots,[],"clean package must start with no personal folders");
  assert.equal(catalog.catalogGlossaryCandidates().scanned,0);
  await catalog.addCatalogRoot(mediaFolder);
  assert.equal(catalog.startCatalogScan(),true);
  while (catalog.catalogStatus().scan.running) await new Promise((resolve) => setTimeout(resolve,20));
  assert.equal(catalog.catalogStatus().scan.message,"");
  assert.equal(catalog.catalogStatus().indexed,1);
  assert.equal(catalog.catalogGlossaryCandidates().scanned,1);
  const results = catalog.searchCatalog({query:"small test"});
  assert.equal(results.total,1);
  const settings = await catalog.catalogSettings(results.results[0].id);
  assert.equal(settings.prompt,"A small test scene");
  assert.equal(settings.negative,"blurred");
  assert.equal(settings.model,"test-model");
  const preview = await catalog.previewCatalogDeletion(results.results[0].id);
  assert.deepEqual(preview.files.map((file) => file.path),[mediaPath,sidecarPath]);
  const removed = await catalog.deleteCatalogItem(results.results[0].id,"permanent");
  assert.equal(removed.warning,"");
  await assert.rejects(stat(mediaPath),{code:"ENOENT"});
  await assert.rejects(stat(sidecarPath),{code:"ENOENT"});
  assert.equal(JSON.parse(gunzipSync(await readFile(indexPath)).toString("utf8")).items.length,0);
  console.log("Global clean first-run, scanning, search, and safe deletion tests passed.");
} finally {
  for (const path of [mediaPath,sidecarPath,indexPath,modulePath,join(sandbox,"cleanup-advisor.mjs"),glossaryPath,join(sandbox,"dist","sentence-bank.mjs")]) {
    try { await unlink(path); } catch (error) { if (error.code !== "ENOENT") throw error; }
  }
  try { await rmdir(join(sandbox,"data")); } catch (error) { if (error.code !== "ENOENT") throw error; }
  await rmdir(mediaFolder);
  await rmdir(join(sandbox,"dist"));
  await rmdir(sandbox);
}
