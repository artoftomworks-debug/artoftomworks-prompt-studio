import { createHash, randomUUID } from "node:crypto";
import { execFile, spawn } from "node:child_process";
import { createReadStream } from "node:fs";
import { copyFile, mkdir, readdir, readFile, open, stat, lstat, realpath, unlink, writeFile } from "node:fs/promises";
import { basename, dirname, extname, isAbsolute, join, relative, resolve, sep, win32 } from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { gzipSync, gunzipSync } from "node:zlib";
import { extractGlossaryCandidates } from "./dist/translation-glossary.mjs";
import { collectSentenceCandidates } from "./dist/sentence-bank.mjs";
import { inspectCleanup } from "./cleanup-advisor.mjs";

const defaults = [];
const storagePath = new URL("./data/media-catalog-index.json.gz", import.meta.url);
const legacyStoragePath = new URL("./data/media-catalog-index.json", import.meta.url);
const labelsPath = new URL("./data/media-catalog-favorites.json", import.meta.url);
const labelsBackupPath = new URL("./data/media-catalog-favorites.json.bak", import.meta.url);
const defaultCategories = ["Nature", "Glamour", "Fashion", "Portrait", "Animals", "Landscape", "Architecture", "Fantasy", "Other"];
const mediaExt = new Set([".png", ".jpg", ".jpeg", ".webp", ".mp4", ".webm", ".mov"]);
const imageExt = new Set([".png", ".jpg", ".jpeg", ".webp"]);
const decoder = new TextDecoder("utf-8");
const execFileAsync = promisify(execFile);
const idFor = (path) => createHash("sha256").update(path.toLocaleLowerCase()).digest("hex").slice(0, 24);
let index = { roots:defaults, scannedAt:null, items:[], skipped:0, scanned:0, errors:0 };
let scanState = { running:false, scanned:0, found:0, skipped:0, errors:0, message:"" };
let scanCancelled = false;
let deleting = false;
const catalogBatchReviews = new Map();
let labels = { version:1, categories:[...defaultCategories], items:{} };
let labelWrites = Promise.resolve();
let labelsRecovered = false;
let cleanupState = { running:false, checked:0, total:0, hashed:0, hashTotal:0, skippedRecent:0,
  skippedChanged:0, unreadable:0, suspectCount:0, duplicateGroups:0, duplicateExtras:0,
  finishedAt:null, message:"" };
let cleanupCandidates = [];
let cleanupStop = false;
let cleanupReview = null;
let cleanupGeneration = 0;

function clearCleanup() {
  cleanupGeneration++;
  cleanupReview = null;
  cleanupCandidates = [];
  cleanupState = { running:false, checked:0, total:0, hashed:0, hashTotal:0, skippedRecent:0,
    skippedChanged:0, unreadable:0, suspectCount:0, duplicateGroups:0, duplicateExtras:0,
    finishedAt:null, message:"" };
}

function removeCleanupCandidate(id) {
  if (!cleanupCandidates.some((candidate) => candidate.id === id)) return;
  cleanupGeneration++;
  cleanupReview = null;
  cleanupCandidates = cleanupCandidates.filter((candidate) => candidate.id !== id);
  const groups = new Map();
  for (const candidate of cleanupCandidates) {
    if (candidate.type !== "duplicate") continue;
    const members = groups.get(candidate.group) || [];
    members.push(candidate); groups.set(candidate.group,members);
  }
  cleanupCandidates = cleanupCandidates.filter((candidate) =>
    candidate.type !== "duplicate" || (groups.get(candidate.group)?.length || 0) >= 2);
  for (const candidate of cleanupCandidates) {
    if (candidate.type === "duplicate") candidate.groupSize = groups.get(candidate.group).length;
  }
  cleanupState.suspectCount = cleanupCandidates.filter((candidate) => candidate.type === "suspect").length;
  cleanupState.duplicateGroups = [...groups.values()].filter((members) => members.length >= 2).length;
  cleanupState.duplicateExtras = [...groups.values()].reduce((sum,members) =>
    sum + Math.max(0,members.length-1),0);
}

export function catalogCleanupStatus() {
  return { ...cleanupState, results:cleanupCandidates.length, generation:cleanupGeneration };
}

export function catalogCleanupResults(page = 0) {
  const offset = Math.max(0, Math.floor(Number(page) || 0)) * 24;
  const results = cleanupCandidates.slice(offset, offset + 24).map((candidate) => {
    const item = catalogItem(candidate.id);
    return item ? { ...candidate, item:{ ...item, ...annotationFor(item.id) } } : null;
  }).filter(Boolean);
  return { total:cleanupCandidates.length, page:Math.floor(offset / 24), results };
}

function rankDuplicateGroup(entries, keep) {
  const ranked = entries.map(candidate => ({ candidate, item:catalogItem(candidate.id) }))
    .filter(entry => entry.item);
  ranked.sort((a,b) => {
    const aTime=Date.parse(a.item.modified),bTime=Date.parse(b.item.modified);
    if (keep === "rating") {
      const byRating=(annotationFor(b.item.id).rating || 0)-(annotationFor(a.item.id).rating || 0);
      if (byRating) return byRating;
    }
    const byDate=keep === "newest" ? bTime-aTime : aTime-bTime;
    return byDate || a.item.path.localeCompare(b.item.path);
  });
  return ranked;
}

export function catalogCleanupAutoSelection(keep = "rating") {
  if (cleanupState.running || !cleanupState.finishedAt || cleanupState.message) {
    throw new Error("Finish a cleanup check first");
  }
  if (!["rating","oldest","newest"].includes(keep)) throw new Error("Choose a keep rule");
  const groups = new Map();
  for (const candidate of cleanupCandidates) {
    if (candidate.type !== "duplicate") continue;
    const entries = groups.get(candidate.group) || [];
    entries.push(candidate); groups.set(candidate.group,entries);
  }
  const extras = [];
  for (const entries of groups.values()) {
    const ranked = rankDuplicateGroup(entries,keep);
    if (ranked.length < 2) continue;
    extras.push(...ranked.slice(1).map(entry => entry.candidate.id));
  }
  return { ids:extras.slice(0,100), totalExtras:extras.length, keep, maximum:100 };
}

async function runCleanup() {
  try {
    const result = await inspectCleanup([...index.items], {
      verify:(item) => checkedFile(item.path,item.root),
      shouldStop:() => cleanupStop,
      onProgress:(progress) => { cleanupState = { ...cleanupState, ...progress }; }
    });
    if (result.cancelled) cleanupState.message = "cancelled";
    else cleanupCandidates = result.candidates;
  } catch (error) {
    cleanupCandidates = [];
    cleanupState.message = String(error.message || error);
  } finally {
    cleanupState.running = false;
    cleanupState.finishedAt = new Date().toISOString();
  }
}

export function startCatalogCleanup() {
  if (cleanupState.running || scanState.running || deleting) return false;
  clearCleanup();
  cleanupState.running = true;
  cleanupState.total = index.items.length;
  cleanupStop = false;
  runCleanup().catch((error) => {
    cleanupState.running = false;
    cleanupState.message = String(error.message || error);
  });
  return true;
}

export function cancelCatalogCleanup() {
  if (!cleanupState.running) return false;
  cleanupStop = true;
  return true;
}

export async function loadMediaCatalog() {
  try {
    let data;
    try { data = gunzipSync(await readFile(storagePath)).toString("utf8"); }
    catch { data = await readFile(legacyStoragePath,"utf8"); }
    const saved = JSON.parse(data);
    if (Array.isArray(saved.roots) && Array.isArray(saved.items)) index = {
      roots:saved.roots.filter((x) => typeof x === "string"),
      scannedAt:saved.scannedAt || null,
      items:saved.items.filter((x) => x && typeof x.path === "string" && typeof x.prompt === "string"),
      skipped:Number(saved.skipped) || 0, scanned:Number(saved.scanned) || 0, errors:Number(saved.errors) || 0
    };
  } catch { /* First launch has no catalog yet. */ }
  try {
    let saved;
    try { saved = JSON.parse(await readFile(labelsPath,"utf8")); }
    catch (error) {
      try { saved = JSON.parse(await readFile(labelsBackupPath,"utf8")); labelsRecovered = true; }
      catch (backupError) {
        if (error.code === "ENOENT" && backupError.code === "ENOENT") return;
        throw new Error("Ratings/categories could not be read; restore media-catalog-favorites.json from its .bak copy",{cause:error});
      }
    }
    const categories = [...defaultCategories];
    for (const value of Array.isArray(saved.categories) ? saved.categories : []) {
      if (typeof value !== "string") continue;
      const name = value.trim();
      if (name && name.length <= 50 && !categories.some((entry) => entry.toLocaleLowerCase() === name.toLocaleLowerCase())) categories.push(name);
    }
    const items = {};
    for (const [id,value] of Object.entries(saved.items || {})) {
      if (!/^[0-9a-f]{24}$/.test(id) || !value || typeof value !== "object") continue;
      const rating = Number.isInteger(value.rating) && value.rating >= 0 && value.rating <= 5 ? value.rating : 0;
      const category = categories.find((entry) => entry === value.category) || "";
      if (rating || category) items[id] = { rating, category };
    }
    labels = { version:1, categories, items };
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    /* First launch has no ratings or custom categories yet. */
  }
}

export function catalogStatus() {
  return { roots:index.roots, scannedAt:index.scannedAt, indexed:index.items.length,
    withPrompt:index.items.filter((item) => Boolean(item.prompt)).length,
    rated:index.items.filter((item) => (labels.items[item.id]?.rating || 0) > 0).length,
    categories:labels.categories, scanned:index.scanned, skipped:index.skipped, errors:index.errors, scan:scanState };
}

function annotationFor(id) { return labels.items[id] || { rating:0, category:"" }; }

function persistLabels() {
  const snapshot = JSON.stringify(labels);
  labelWrites = labelWrites.catch(() => {}).then(async () => {
    await mkdir(dirname(fileURLToPath(labelsPath)),{ recursive:true });
    if (!labelsRecovered) {
      try { await copyFile(labelsPath,labelsBackupPath); }
      catch (error) { if (error.code !== "ENOENT") throw error; }
    }
    await writeFile(labelsPath,snapshot);
    labelsRecovered = false;
  });
  return labelWrites;
}

export async function addCatalogCategory(value) {
  const name = String(value || "").replace(/\s+/g," ").trim();
  if (!name || name.length > 50 || /[\x00-\x1f\x7f]/.test(name)) throw new Error("Category must have 1–50 readable characters");
  const existing = labels.categories.find((entry) => entry.toLocaleLowerCase() === name.toLocaleLowerCase());
  if (existing) return { categories:labels.categories, category:existing };
  if (labels.categories.length >= 100) throw new Error("Maximum 100 categories");
  labels.categories.push(name);
  await persistLabels();
  return { categories:labels.categories, category:name };
}

export async function setCatalogAnnotation(id, changes) {
  if (deleting) throw new Error("Wait until the current operation finishes");
  if (!catalogItem(id)) throw new Error("This catalog item is no longer available");
  if (!changes || typeof changes !== "object" || !("rating" in changes || "category" in changes)) throw new Error("Choose a rating or category");
  const previous = annotationFor(id);
  let rating = previous.rating, category = previous.category;
  if ("rating" in changes) {
    if (!Number.isInteger(changes.rating) || changes.rating < 0 || changes.rating > 5) throw new Error("Rating must be between 0 and 5");
    rating = changes.rating;
  }
  if ("category" in changes) {
    if (typeof changes.category !== "string" || (changes.category && !labels.categories.includes(changes.category))) throw new Error("Choose an existing category");
    category = changes.category;
  }
  if (rating || category) labels.items[id] = { rating, category };
  else delete labels.items[id];
  await persistLabels();
  return { id, rating, category };
}

export function normalizeCatalogRoot(value,platform=process.platform) {
  let candidate=String(value || "").trim();
  if(platform==="win32"){
    if(candidate.startsWith('"')&&candidate.endsWith('"'))candidate=candidate.slice(1,-1).trim();
    if(/^[a-z]:?$/iu.test(candidate))candidate=candidate[0].toUpperCase()+":\\";
  }
  const pathApi=platform==="win32"?win32:{isAbsolute,resolve};
  if(!pathApi.isAbsolute(candidate)||candidate.length>400)throw new Error("Give an absolute folder or drive path");
  return pathApi.resolve(candidate);
}

export async function addCatalogRoot(value) {
  if (scanState.running || deleting || cleanupState.running) throw new Error("Wait until the current operation finishes");
  const root = normalizeCatalogRoot(value);
  if (!(await stat(root)).isDirectory()) throw new Error("Choose an existing folder or drive");
  if (scanState.running || deleting || cleanupState.running) throw new Error("Wait until the current operation finishes");
  if (index.roots.length >= 12 && !index.roots.some((x) => x.toLocaleLowerCase() === root.toLocaleLowerCase())) throw new Error("Maximum 12 folders");
  deleting=true;
  try{
    const next={...index,roots:index.roots.some(x=>x.toLocaleLowerCase()===root.toLocaleLowerCase())?[...index.roots]:[...index.roots,root]};
    await writeCatalogIndex(next);index=next;sentenceCatalogCache.clear();clearCleanup();catalogBatchReviews.clear();
    return catalogStatus();
  }finally{deleting=false;}
}

export async function removeCatalogRoot(value){
  if(scanState.running||deleting||cleanupState.running)throw new Error("Wait until the current operation finishes");
  const requested=normalizeCatalogRoot(value),root=index.roots.find(x=>resolve(x).toLocaleLowerCase()===requested.toLocaleLowerCase());
  if(!root)throw new Error("This archive folder is not registered");
  deleting=true;
  try{
    const roots=index.roots.filter(x=>x!==root),ranked=[...roots].sort((a,b)=>b.length-a.length),items=[];
    for(const item of index.items){
      const owner=ranked.find(candidate=>isWithin(resolve(candidate),resolve(item.path)));
      if(owner)items.push({...item,root:owner});
    }
    const next={...index,roots,items,scanned:items.length,skipped:items.filter(item=>!item.prompt).length,errors:0};
    await writeCatalogIndex(next);
    const removedItems=index.items.length-items.length;index=next;sentenceCatalogCache.clear();clearCleanup();catalogBatchReviews.clear();
    return {...catalogStatus(),removedRoot:root,removedItems};
  }finally{deleting=false;}
}

async function persist() {
  sentenceCatalogCache.clear();
  await writeCatalogIndex(index);
}

async function writeCatalogIndex(snapshot){
  await mkdir(dirname(fileURLToPath(storagePath)),{ recursive:true });
  await writeFile(storagePath,gzipSync(Buffer.from(JSON.stringify(snapshot)),{level:6}));
}

function cleanPrompt(value) {
  return typeof value === "string" ? value.trim().slice(0, 50000) : "";
}

function finiteSetting(value, min, max) {
  const number = Number(value);
  return value !== "" && value != null && Number.isFinite(number) && number >= min && number <= max ? number : undefined;
}

function compactSettings(source) {
  const settings = {};
  const aliases = {
    width:["width"], height:["height"], steps:["steps"], cfg:["cfgscale","cfg_scale","cfg"],
    seed:["seed","noise_seed"], fps:["fps","frame_rate"], frames:["frames","frame_count","length"],
    duration:["duration","video_length"], sampler:["sampler","sampler_name"], scheduler:["scheduler"]
  };
  const ranges = { width:[256,8192], height:[256,8192], steps:[1,200], cfg:[0,50], seed:[0,2147483647],
    fps:[1,120], frames:[1,10000], duration:[0.1,600] };
  for (const [key,names] of Object.entries(aliases)) {
    const value = names.map((name) => source?.[name]).find((candidate) => candidate !== undefined && candidate !== null && candidate !== "");
    if (value === undefined) continue;
    if (ranges[key]) {
      const number = finiteSetting(value,...ranges[key]);
      if (number !== undefined) settings[key] = number;
    } else if (typeof value === "string" && value.length <= 80) settings[key] = value;
  }
  return settings;
}

export function extractSwarmMetadata(value) {
  const params = value?.sui_image_params || value;
  const prompt = cleanPrompt(params?.prompt);
  if (!prompt) return null;
  const settings=compactSettings(params);
  if (Array.isArray(params?.loras)) {
    const weights=Array.isArray(params.loraweights) ? params.loraweights : [];
    const loras=[];
    for (const [index,value] of params.loras.entries()) {
      if (value?.on === false || value?.enabled === false) continue;
      const name=typeof value === "string" ? value : value?.name || value?.lora || value?.lora_name;
      if (typeof name !== "string" || !name.trim()) continue;
      const raw=weights[index] ?? (typeof value === "object" ? value?.strength ?? value?.weight : undefined);
      const strength=raw === undefined || raw === null || raw === "" ? undefined : Number(raw);
      if (strength !== undefined && (!Number.isFinite(strength) || Math.abs(strength)>5 || strength===0)) continue;
      const entry={name:name.trim().slice(0,160),...(strength === undefined ? {} : {strength})};
      if (!loras.some((item) => item.name===entry.name && item.strength===entry.strength)) loras.push(entry);
      if (loras.length>=16) break;
    }
    if (loras.length) settings.loras=loras;
  }
  return { prompt, negative:cleanPrompt(params?.negativeprompt), model:String(params?.model || "").slice(0, 160),
    settings, source:"SwarmUI" };
}

function extractComfyLoras(api,workflow) {
  const found=[];
  function add(value,fallbackStrength) {
    if (!value || value.on === false || value.enabled === false) return;
    const name=typeof value === "string" ? value : value.lora || value.lora_name || value.name;
    const strength=typeof value === "string" ? fallbackStrength : value.strength_model ?? value.strength ?? fallbackStrength;
    if (typeof name !== "string" || !/\.(?:safetensors|ckpt|pt)$/i.test(name.trim()) || !Number.isFinite(Number(strength)) || Math.abs(Number(strength))>5) return;
    const entry={name:name.trim().slice(0,160),strength:Number(strength)};
    if (!found.some((item) => item.name === entry.name && item.strength === entry.strength)) found.push(entry);
  }
  for (const node of Object.values(api || {})) {
    if (!/lora/i.test(String(node?.class_type || ""))) continue;
    const inputs=node.inputs || {};
    add(inputs.lora_name,inputs.strength_model ?? inputs.strength);
    for (const [key,value] of Object.entries(inputs)) if (/^lora(?:_\d+|s)?$/i.test(key)) {
      if (Array.isArray(value)) value.forEach((entry) => add(entry)); else add(value);
    }
  }
  for (const node of workflow?.nodes || []) {
    if (!/lora/i.test(String(node?.type || ""))) continue;
    for (const value of node.widgets_values || []) {
      if (Array.isArray(value)) value.forEach((entry) => add(entry));
      else if (value && typeof value === "object") add(value);
    }
  }
  return found.slice(0,16);
}

export function extractComfyPrompt(api, workflow) {
  const candidates = [];
  for (const node of Object.values(api || {})) {
    if (!node || typeof node !== "object") continue;
    const type = String(node.class_type || "");
    if (/note|markdown|monitor/i.test(type)) continue;
    for (const [key,value] of Object.entries(node.inputs || {})) {
      const prompt = cleanPrompt(value);
      if (prompt.length < 20 || !/^(?:prompt|text|value|positive|description)$/i.test(key)) continue;
      let score = prompt.length;
      if (/prompt/i.test(key)) score += 10000;
      if (/PrimitiveStringMultiline/i.test(type)) score += 12000;
      if (/MiniMaxH3ImageToVideo/i.test(type)) score += 12000;
      if (/CLIPTextEncode/i.test(type)) score += 4000;
      if (/negative/i.test(type)) score -= 20000;
      candidates.push({ prompt, score });
    }
  }
  if (!candidates.length) {
    for (const node of workflow?.nodes || []) {
      if (/note|markdown|monitor/i.test(String(node.type || ""))) continue;
      for (const value of node.widgets_values || []) {
        const prompt = cleanPrompt(value);
        if (prompt.length > 40) candidates.push({ prompt, score:prompt.length });
      }
    }
  }
  candidates.sort((a,b) => b.score - a.score);
  const prompt = candidates[0]?.prompt || "";
  if (!prompt) return null;
  const model = Object.values(api || {}).flatMap((node) => Object.entries(node?.inputs || {}))
    .find(([key,value]) => /^(?:unet_name|ckpt_name|model_name)$/i.test(key) && typeof value === "string")?.[1] || "";
  const settings = {}, conflicts = new Set();
  for (const node of Object.values(api || {})) {
    if (!node || typeof node !== "object" || /note|markdown|monitor/i.test(String(node.class_type || ""))) continue;
    for (const [key,value] of Object.entries(compactSettings(node.inputs || {}))) {
      if (conflicts.has(key)) continue;
      if (!(key in settings)) settings[key] = value;
      else if (settings[key] !== value) { delete settings[key]; conflicts.add(key); }
    }
  }
  const loras=extractComfyLoras(api,workflow);
  if (loras.length) settings.loras=loras;
  const seeds=Object.values(api || {}).filter((node) => /RandomNoise/i.test(String(node?.class_type || "")))
    .map((node) => finiteSetting(node.inputs?.noise_seed,0,2147483647)).filter((value) => value !== undefined);
  if (seeds.length > 1) settings.seeds=seeds.slice(0,8);
  return { prompt, model:String(model).slice(0,160), settings, source:"ComfyUI" };
}

function parsePngMetadata(buffer) {
  if (buffer.length < 8 || buffer.subarray(0,8).toString("hex") !== "89504e470d0a1a0a") return null;
  const fields = {};
  for (let p=8; p+12<=buffer.length;) {
    const length = buffer.readUInt32BE(p), type = buffer.toString("ascii",p+4,p+8);
    if (length > 2_000_000 || p+12+length > buffer.length) break;
    if (type === "tEXt") {
      const data = buffer.subarray(p+8,p+8+length), split = data.indexOf(0);
      if (split > 0) fields[data.subarray(0,split).toString("latin1")] = decoder.decode(data.subarray(split+1));
    } else if (type === "iTXt") {
      const data = buffer.subarray(p+8,p+8+length), split = data.indexOf(0);
      if (split > 0 && data[split+1] === 0) {
        const rest = data.subarray(split+5), languageEnd = rest.indexOf(0), translatedEnd = rest.indexOf(0,languageEnd+1);
        if (languageEnd >= 0 && translatedEnd >= 0) fields[data.subarray(0,split).toString("latin1")] = decoder.decode(rest.subarray(translatedEnd+1));
      }
    }
    p += length + 12;
    if (type === "IDAT" || type === "IEND") break;
  }
  if (fields.parameters) {
    try { return extractSwarmMetadata(JSON.parse(fields.parameters)); }
    catch {
      const prompt = cleanPrompt(fields.parameters.split(/\nNegative prompt:|\nSteps:/i)[0]);
      if (prompt) return { prompt, model:"", source:"PNG metadata" };
    }
  }
  let api=null, workflow=null;
  try { api=JSON.parse(fields.prompt || "null"); } catch {}
  try { workflow=JSON.parse(fields.workflow || "null"); } catch {}
  return extractComfyPrompt(api, workflow);
}

function pngMetadataRequiredBytes(buffer) {
  for (let p=8; p+8<=buffer.length;) {
    const length=buffer.readUInt32BE(p), type=buffer.toString("ascii",p+4,p+8);
    if (p+12+length>buffer.length) return ["tEXt","iTXt"].includes(type) && length<=2_000_000 ? p+12+length : 0;
    if (type==="IDAT" || type==="IEND") return 0;
    p+=12+length;
  }
  return 0;
}

export function parseMp4Metadata(buffer) {
  const keysAt = buffer.indexOf("keys");
  const listAt = buffer.indexOf("ilst", Math.max(0,keysAt));
  if (keysAt < 4 || listAt < 4 || listAt - keysAt > 10000) return null;
  const keySize = buffer.readUInt32BE(keysAt-4), listSize = buffer.readUInt32BE(listAt-4);
  if (keySize < 16 || keysAt-4+keySize > buffer.length || listSize < 8 || listAt-4+listSize > buffer.length) return null;
  const count = buffer.readUInt32BE(keysAt+8), names = new Map();
  let p = keysAt+12;
  for (let i=1; i<=Math.min(count,100) && p+8<=keysAt-4+keySize; i++) {
    const size = buffer.readUInt32BE(p);
    if (size < 8 || p+size > keysAt-4+keySize) break;
    names.set(i,buffer.toString("utf8",p+8,p+size)); p += size;
  }
  const fields = {};
  p = listAt+4;
  while (p+24 <= listAt-4+listSize) {
    const size = buffer.readUInt32BE(p), number = buffer.readUInt32BE(p+4);
    if (size < 24 || p+size > listAt-4+listSize) break;
    const key = names.get(number);
    if (key && buffer.toString("ascii",p+12,p+16) === "data") fields[key] = decoder.decode(buffer.subarray(p+24,p+size));
    p += size;
  }
  let api=null, workflow=null;
  try { api=JSON.parse(fields.prompt || "null"); } catch {}
  try { workflow=JSON.parse(fields.workflow || "null"); } catch {}
  return extractComfyPrompt(api, workflow);
}

export function parseMp4VideoStats(buffer) {
  function boxes(start,end) {
    const output=[];
    for (let p=start;p+8<=end;) {
      let size=buffer.readUInt32BE(p), header=8;
      if (size===1) { if (p+16>end) break; size=Number(buffer.readBigUInt64BE(p+8)); header=16; }
      if (size===0) size=end-p;
      if (!Number.isSafeInteger(size) || size<header || p+size>end) break;
      output.push({type:buffer.toString("ascii",p+4,p+8),start:p,end:p+size,content:p+header});
      p+=size;
    }
    return output;
  }
  const child=(box,type) => box ? boxes(box.content,box.end).find((entry) => entry.type===type) : null;
  let moov=boxes(0,buffer.length).find((entry) => entry.type==="moov");
  if (!moov) {
    const marker=buffer.indexOf("moov");
    if (marker>=4) {
      const size=buffer.readUInt32BE(marker-4), start=marker-4;
      if (size>=8 && start+size<=buffer.length) moov={type:"moov",start,end:start+size,content:marker+4};
    }
  }
  if (!moov) return {};
  for (const track of boxes(moov.content,moov.end).filter((entry) => entry.type==="trak")) {
    const media=child(track,"mdia"), handler=child(media,"hdlr");
    if (!handler || handler.start+20>handler.end || buffer.toString("ascii",handler.start+16,handler.start+20)!=="vide") continue;
    const stats={}, header=child(track,"tkhd"), timing=child(media,"mdhd");
    if (header && header.end-header.start>=84) {
      const width=buffer.readUInt32BE(header.end-8)/65536, height=buffer.readUInt32BE(header.end-4)/65536;
      if (finiteSetting(width,1,16384)!==undefined && finiteSetting(height,1,16384)!==undefined) {
        stats.width=Math.round(width); stats.height=Math.round(height);
      }
    }
    let timescale=0;
    if (timing && timing.end-timing.start>=32) {
      const version=buffer[timing.content];
      const offset=version===1 ? timing.content+20 : timing.content+12;
      if (offset+8<=timing.end) {
        timescale=buffer.readUInt32BE(offset);
        const ticks=version===1 ? Number(buffer.readBigUInt64BE(offset+4)) : buffer.readUInt32BE(offset+4);
        if (timescale>0 && Number.isSafeInteger(ticks)) {
          const duration=ticks/timescale;
          if (finiteSetting(duration,0.01,36000)!==undefined) stats.duration=Math.round(duration*100)/100;
        }
      }
    }
    const stbl=child(child(media,"minf"),"stbl"), stts=child(stbl,"stts");
    if (stts && stts.content+8<=stts.end) {
      const entries=Math.min(buffer.readUInt32BE(stts.content+4),100000);
      let samples=0,ticks=0,p=stts.content+8;
      for (let i=0;i<entries && p+8<=stts.end;i++,p+=8) {
        const count=buffer.readUInt32BE(p), delta=buffer.readUInt32BE(p+4);
        samples+=count; ticks+=count*delta;
      }
      if (samples>0 && samples<=10000000) stats.frames=samples;
      if (timescale>0 && ticks>0) {
        const fps=samples*timescale/ticks;
        if (finiteSetting(fps,0.1,240)!==undefined) stats.fps=Math.round(fps*100)/100;
      }
    }
    return stats;
  }
  return {};
}

async function readProbe(path, size = 2_000_000) {
  const handle = await open(path,"r");
  try {
    const length = Math.min((await handle.stat()).size,size), buffer = Buffer.alloc(length);
    await handle.read(buffer,0,length,0);
    return buffer;
  } finally { await handle.close(); }
}

async function metadataForVideo(path) {
  const buffer = await readProbe(path,2_000_000);
  let found = parseMp4Metadata(buffer), stats=parseMp4VideoStats(buffer);
  if (found && Object.keys(stats).length) return { ...found,settings:{...found.settings,...stats} };
  if (found) return found;
  const info = await stat(path);
  if (info.size > buffer.length) {
    const handle = await open(path,"r");
    try {
      const length = Math.min(info.size,2_000_000), tail = Buffer.alloc(length);
      await handle.read(tail,0,length,info.size-length);
      found = parseMp4Metadata(tail);
      if (!Object.keys(stats).length) stats=parseMp4VideoStats(tail);
    } finally { await handle.close(); }
  }
  return found ? { ...found,settings:{...found.settings,...stats} }
    : Object.keys(stats).length ? {prompt:"",model:"",settings:stats,source:"MP4"} : null;
}

async function* walk(root) {
  const pending = [root];
  while (pending.length) {
    if(scanCancelled)return;
    const folder = pending.pop();
    scanState.currentFolder=folder;scanState.directories++;
    let entries;
    try { entries = await readdir(folder,{ withFileTypes:true }); }
    catch { scanState.errors++; continue; }
    const files = [];
    for (const entry of entries) {
      if(entry.isSymbolicLink()){scanState.skippedFolders++;continue;}
      if (entry.isDirectory()) {
        if(/^(?:node_modules|\.git|\.venv|\$Recycle\.Bin|System Volume Information)$/iu.test(entry.name) ||
            (win32.parse(root).root===root&&folder===root&&/^(?:Windows|Program Files(?: \(x86\))?|ProgramData|Recovery|PerfLogs|\$WinREAgent|\$WINDOWS\.~BT)$/iu.test(entry.name))){scanState.skippedFolders++;continue;}
        pending.push(join(folder,entry.name));
      }
      else if (entry.isFile()) files.push(entry.name);
    }
    yield { folder, files };
  }
}

function record(path, root, kind, meta, details) {
  return { id:idFor(path), path, root, kind, filename:basename(path), prompt:meta?.prompt || "",
    model:meta?.model || "", settings:meta?.settings || {}, source:meta?.source || "", modified:details.mtime.toISOString(), size:details.size };
}

async function scan() {
  const items = [], seen = new Set(), oldByPath = new Map(index.items.map((item) => [item.path.toLocaleLowerCase(),item]));
  scanCancelled=false;
  scanState = { running:true, scanned:0, found:0, skipped:0, errors:0, message:"",directories:0,skippedFolders:0,currentFolder:"",cancelled:false,cancelling:false,finalizing:false };
  const checkCancelled=()=>{if(scanCancelled)throw new Error("CATALOG_SCAN_CANCELLED");};
  try {
    for (const root of index.roots) {
      checkCancelled();
      let rootStat;
      try { rootStat = await stat(root); } catch { scanState.errors++; continue; }
      if (!rootStat.isDirectory()) { scanState.errors++; continue; }
      for await (const {folder,files} of walk(root)) {
        checkCancelled();
        const names = new Set(files.map((name) => name.toLocaleLowerCase()));
        const selected = files.filter((name) => mediaExt.has(extname(name).toLocaleLowerCase()));
        for (let start=0; start<selected.length; start+=8) {
          checkCancelled();
          await Promise.all(selected.slice(start,start+8).map(async (name) => {
          const ext = extname(name).toLocaleLowerCase();
          const path = join(folder,name);
          if (seen.has(path.toLocaleLowerCase())) return;
          seen.add(path.toLocaleLowerCase()); scanState.scanned++;
          if (scanState.scanned > 200000) throw new Error("Too many files; choose a narrower folder");
          let details;
          try {
            details = await stat(path);
            const old = oldByPath.get(path.toLocaleLowerCase());
            if (old && old.settings && old.modified === details.mtime.toISOString() && (old.size === undefined || old.size === details.size)) {
              items.push({ ...old, size:details.size });
              if (old.prompt) scanState.found++; else scanState.skipped++;
              return;
            }
            let meta=null;
            if (imageExt.has(ext)) {
              const stem = name.slice(0,-ext.length);
              const sidecar = `${stem}.swarm.json`;
              if (names.has(sidecar.toLocaleLowerCase())) {
                meta = extractSwarmMetadata(JSON.parse(await readFile(join(folder,sidecar),"utf8")));
              }
              if (!meta && ext === ".png") {
                const header = await readProbe(path,48_000);
                meta = parsePngMetadata(header);
                const required = !meta && pngMetadataRequiredBytes(header);
                if (required) meta = parsePngMetadata(await readProbe(path,required));
              }
            } else if (ext === ".mp4" || ext === ".mov") meta = await metadataForVideo(path);
            items.push(record(path,root,imageExt.has(ext)?"image":"video",meta,details));
            if (meta?.prompt) scanState.found++;
            else scanState.skipped++;
          } catch {
            scanState.errors++;
            if (details) { items.push(record(path,root,imageExt.has(ext)?"image":"video",null,details)); scanState.skipped++; }
          }
        }));}
      }
    }
    checkCancelled();scanState.finalizing=true;
    items.sort((a,b) => b.modified.localeCompare(a.modified));
    index = { roots:index.roots, scannedAt:new Date().toISOString(), items, scanned:scanState.scanned,
      skipped:scanState.skipped, errors:scanState.errors };
    clearCleanup();
    await persist();
  } catch (error) {if(error.message==="CATALOG_SCAN_CANCELLED")scanState.cancelled=true;else scanState.message = String(error.message || error);}
  finally { scanState.running = false;scanState.currentFolder="";scanState.cancelling=false;scanState.finalizing=false; }
}

export function cancelCatalogScan(){
  if(!scanState.running||scanState.finalizing)return false;
  scanCancelled=true;scanState.cancelling=true;return true;
}

export function startCatalogScan() {
  if (scanState.running || deleting || cleanupState.running) return false;
  scan().catch((error) => { scanState.message = String(error); scanState.running = false; });
  return true;
}

function localDateStart(value, extraDays=0) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year,month,day]=value.split("-").map(Number);
  const date=new Date(year,month-1,day);
  if (date.getFullYear()!==year || date.getMonth()!==month-1 || date.getDate()!==day) return null;
  date.setDate(date.getDate()+extraDays);
  return date.getTime();
}

export function searchCatalog({ query="", kind="", root="", prompt="", category="", rating=0, dateFrom="", dateTo="", page=0, limit=24 } = {}) {
  const needle = String(query).trim().toLocaleLowerCase().slice(0,200);
  const offset = Math.max(0,Math.floor(Number(page)||0))*Math.min(50,Math.max(1,Number(limit)||24));
  const count = Math.min(50,Math.max(1,Number(limit)||24));
  const minimumRating = Math.max(0,Math.min(5,Math.floor(Number(rating)||0)));
  const fromTime=localDateStart(dateFrom), untilTime=localDateStart(dateTo,1);
  const matches = index.items.filter((item) => (!kind || item.kind === kind) && (!root || item.root === root) &&
    (fromTime===null || Date.parse(item.modified)>=fromTime) && (untilTime===null || Date.parse(item.modified)<untilTime) &&
    (!prompt || (prompt === "yes" ? Boolean(item.prompt) : !item.prompt)) &&
    (!category || annotationFor(item.id).category === category) && annotationFor(item.id).rating >= minimumRating &&
    (!needle || [item.filename,item.prompt,item.model,item.source,item.path,annotationFor(item.id).category].some((x) => x.toLocaleLowerCase().includes(needle))));
  return { total:matches.length, page:Math.floor(offset/count), results:matches.slice(offset,offset+count).map((item) => ({ ...item, ...annotationFor(item.id) })) };
}

const echoStopWords = new Set(`a an and are as at be by for from in into is it of on or the to with without
  this that these those there their then very more most some over under while when where which who what
  image photo photograph picture video scene cinematic professional masterpiece quality detailed ultra hyper
  realistic highly award winning beautiful stunning perfect sharp focus shot camera light lighting style
  egy ez az hogy es vagy van lesz nagyon kep video jelenet foto profi minoseg reszletes eles feny`.split(/\s+/u));

export function creativeMemoryTerms(value,limit=40) {
  return [...new Set(String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/gu, "")
    .toLocaleLowerCase().match(/[\p{L}\p{N}]{3,}/gu) || [])]
    .filter((term) => !echoStopWords.has(term)).slice(0,limit);
}

export function rankCreativeMemory(items, query, { kind="", model="", limit=6, annotate=() => ({rating:0,category:""}) } = {}) {
  const terms=creativeMemoryTerms(String(query || "").slice(0,4000));
  if (!terms.length) return [];
  const requestedKind=kind === "image" || kind === "video" ? kind : "";
  const modelNeedle=String(model || "").trim().toLocaleLowerCase();
  const ranked=[];
  for (const item of items) {
    if (!item?.prompt || (requestedKind && item.kind !== requestedKind)) continue;
    const promptTerms=new Set(creativeMemoryTerms(item.prompt,300));
    const nameTerms=new Set(creativeMemoryTerms(item.filename));
    const matched=terms.filter((term) => promptTerms.has(term) || nameTerms.has(term));
    if (matched.length < Math.min(2,terms.length)) continue;
    const labels=annotate(item) || {};
    const rating=Math.max(0,Math.min(5,Number(labels.rating) || 0));
    const score=matched.reduce((total,term) => total+(promptTerms.has(term)?2:0.7)+Math.min(term.length,12)*0.08,0)
      +matched.length / terms.length*2 +rating*0.25
      +(modelNeedle && String(item.model || "").toLocaleLowerCase().includes(modelNeedle) ? 0.8 : 0);
    ranked.push({ item, matched:matched.slice(0,8), rating, category:String(labels.category || ""), score });
  }
  return ranked.sort((a,b) => b.score-a.score || String(b.item.modified || "").localeCompare(String(a.item.modified || "")))
    .slice(0,Math.max(1,Math.min(12,Number(limit) || 6)))
    .map(({item,matched,rating,category}) => ({ id:item.id, filename:item.filename, kind:item.kind,
      prompt:item.prompt, model:item.model, rating, category, matched }));
}

export function searchCreativeMemory({ query="", kind="", model="" } = {}) {
  return { results:rankCreativeMemory(index.items,query,{kind,model,annotate:(item) => annotationFor(item.id)}) };
}

export function catalogGlossaryCandidates() {
  const prompts=index.items.filter((item) => item.prompt).map((item) => item.prompt);
  return { scanned:prompts.length, candidates:extractGlossaryCandidates(prompts,{limit:1000,minCount:prompts.length > 10 ? 2 : 1}) };
}

const sentenceCatalogCache=new Map();
export function catalogSentenceCandidates(kind="") {
  const selected=kind==="image" || kind==="video" ? kind : "";
  if(sentenceCatalogCache.has(selected))return sentenceCatalogCache.get(selected);
  const records=index.items.filter((item)=>item.prompt).map((item)=>({prompt:item.prompt,kind:item.kind}));
  const result={scanned:records.filter((item)=>!selected || item.kind===selected).length,
    candidates:collectSentenceCandidates(records,{kind:selected,limit:40,minCount:2})};
  sentenceCatalogCache.set(selected,result);
  return result;
}

export function catalogItem(id) { return index.items.find((item) => item.id === id) || null; }

async function currentCatalogDetails(id) {
  const item = catalogItem(id);
  if (!item) throw new Error("This media item is no longer in the archive");
  const details = await stat(item.path);
  if (!details.isFile() || details.mtime.toISOString() !== item.modified || details.size !== item.size) {
    throw new Error("Media changed since indexing; refresh the archive first");
  }
  let meta = null;
  if (item.kind === "image") {
    const ext = extname(item.path).toLowerCase();
    const sidecar = join(dirname(item.path), `${basename(item.path,ext)}.swarm.json`);
    try { meta = extractSwarmMetadata(JSON.parse(await readFile(sidecar,"utf8"))); }
    catch { /* A missing or unreadable sidecar does not hide metadata in the image itself. */ }
    if (!meta && ext === ".png") {
      const header = await readProbe(item.path,48_000);
      meta = parsePngMetadata(header);
      const required = !meta && pngMetadataRequiredBytes(header);
      if (required) meta = parsePngMetadata(await readProbe(item.path,required));
    }
  } else if ([".mp4",".mov"].includes(extname(item.path).toLowerCase())) meta = await metadataForVideo(item.path);
  return { item, meta };
}

export async function catalogSettings(id) {
  const {item,meta} = await currentCatalogDetails(id);
  return { id:item.id, prompt:meta?.prompt || item.prompt || "", negative:meta?.negative || "",
    model:meta?.model || item.model || "", settings:meta?.settings || item.settings || {} };
}

export async function catalogHandoff(id) {
  const item = catalogItem(id);
  if (!item?.prompt) throw new Error("This media item has no readable prompt");
  const detail = await catalogSettings(id);
  return { version:1, kind:item.kind, filename:item.filename, path:item.path,
    prompt:item.prompt, model:detail.model, settings:detail.settings, source:item.source };
}

export async function openCatalogImage(id) {
  const item = catalogItem(id);
  if (!item || item.kind !== "image" || !imageExt.has(extname(item.path).toLocaleLowerCase()) ||
      idFor(item.path) !== item.id ||
      !index.roots.some((root) => resolve(root).toLocaleLowerCase() === resolve(item.root).toLocaleLowerCase())) {
    throw new Error("This image is no longer available in the catalog");
  }
  const details = await checkedFile(item.path,item.root);
  if (details.size !== item.size || details.mtime.toISOString() !== item.modified) {
    throw new Error("The image changed since indexing. Refresh the archive first");
  }
  if (process.platform !== "win32") throw new Error("Opening in the default app is available only on Windows");
  await execFileAsync("powershell.exe",["-NoProfile","-NonInteractive","-Command",
    "$ErrorActionPreference='Stop'; Invoke-Item -LiteralPath $env:PROMPT_STUDIO_OPEN_TARGET"],{
    env:{ ...process.env, PROMPT_STUDIO_OPEN_TARGET:item.path }, windowsHide:true, timeout:15000
  });
  return { opened:true, filename:item.filename };
}

export async function revealCatalogFile(id, launch=launchCatalogExplorer) {
  const item = catalogItem(id);
  if (!item || !["image","video"].includes(item.kind) || idFor(item.path)!==item.id ||
      !index.roots.some(root=>resolve(root).toLocaleLowerCase()===resolve(item.root).toLocaleLowerCase())) {
    throw new Error("This media item is no longer available in the catalog");
  }
  const details=await checkedFile(item.path,item.root);
  if(details.size!==item.size || details.mtime.toISOString()!==item.modified)
    throw new Error("Media changed since indexing; refresh the archive first");
  await launch(item.path);
  return {opened:true,filename:item.filename};
}
export async function launchCatalogExplorer(path) {
  if(process.platform!=="win32")throw new Error("File Explorer is available only on Windows");
  // Separate arguments, no shell: spaces, accents and command characters stay data.
  const child=spawn("explorer.exe",["/select,",path],{detached:true,stdio:"ignore",windowsHide:true,shell:false});
  await new Promise((resolve,reject)=>{child.once("spawn",resolve);child.once("error",reject);});
  child.unref();
}

function isWithin(root, path) {
  const part = relative(root,path);
  return Boolean(part) && part !== ".." && !part.startsWith(`..${sep}`) && !isAbsolute(part);
}

async function checkedFile(path, root) {
  if (!isWithin(resolve(root),resolve(path))) throw new Error("File is outside its indexed folder");
  const [rootReal,fileReal,details] = await Promise.all([realpath(root),realpath(path),lstat(path)]);
  if (!isWithin(rootReal,fileReal) || !details.isFile() || details.isSymbolicLink()) {
    throw new Error("Only regular files inside the indexed folder can be removed");
  }
  return details;
}

async function buildDeletionPlan(id) {
  const item = catalogItem(id);
  if (!item || idFor(item.path) !== item.id ||
      !index.roots.some((root) => resolve(root).toLocaleLowerCase() === resolve(item.root).toLocaleLowerCase())) {
    throw new Error("This catalog item is no longer available");
  }
  const details = await checkedFile(item.path,item.root);
  if (details.size !== item.size || details.mtime.toISOString() !== item.modified) {
    throw new Error("The file changed since indexing. Refresh the archive before removing it");
  }
  const files = [{ path:item.path, role:"media", size:details.size }];
  const ext = extname(item.path).toLocaleLowerCase();
  if (imageExt.has(ext)) {
    const stem = basename(item.path).slice(0,-ext.length);
    const siblings = await readdir(dirname(item.path));
    const sameStem = siblings.filter((name) => mediaExt.has(extname(name).toLocaleLowerCase()) &&
      name.slice(0,-extname(name).length).toLocaleLowerCase() === stem.toLocaleLowerCase());
    if (sameStem.length === 1) {
      const sidecar = join(dirname(item.path),`${stem}.swarm.json`);
      try {
        const sidecarDetails = await checkedFile(sidecar,item.root);
        files.push({ path:sidecar, role:"metadata", size:sidecarDetails.size });
      } catch (error) {
        if (error.code !== "ENOENT") throw error;
      }
    }
  }
  return { id:item.id, filename:item.filename, files };
}

export async function previewCatalogDeletion(id) {
  if (scanState.running || deleting) throw new Error("Wait until the current operation finishes");
  return buildDeletionPlan(id);
}

export async function previewCatalogBatch(ids) {
  if (scanState.running || cleanupState.running || deleting) throw new Error("Wait until the current operation finishes");
  if (!Array.isArray(ids) || ids.length < 1 || ids.length > 100 ||
      ids.some(id => typeof id !== "string" || !/^[a-f0-9]{24}$/.test(id)) || new Set(ids).size !== ids.length) {
    throw new Error("Choose 1 to 100 distinct catalog files");
  }
  deleting = true;
  try {
    const plans = [];
    for (const id of ids) {
      const plan = await buildDeletionPlan(id);
      plans.push({plan, snapshot:await deletionSnapshot(plan)});
    }
    for (const [token,review] of catalogBatchReviews) if (Date.now() > review.expires) catalogBatchReviews.delete(token);
    while (catalogBatchReviews.size >= 10) catalogBatchReviews.delete(catalogBatchReviews.keys().next().value);
    const token = randomUUID();
    catalogBatchReviews.set(token,{plans,expires:Date.now()+5*60*1000});
    return {token,count:plans.length,files:plans.flatMap(entry => entry.plan.files)};
  } finally { deleting = false; }
}

export async function deleteCatalogBatch(token,mode) {
  if (mode !== "trash" && mode !== "permanent") throw new Error("Choose Recycle Bin or permanent deletion");
  if (scanState.running || cleanupState.running || deleting) throw new Error("Wait until the current operation finishes");
  const review = typeof token === "string" ? catalogBatchReviews.get(token) : null;
  if (!review || Date.now() > review.expires) {
    catalogBatchReviews.delete(token);
    throw new Error("The deletion review expired. Review the selected files again");
  }
  catalogBatchReviews.delete(token);
  deleting = true;
  const deleted = [], warnings = [];
  let failed = "";
  try {
    for (const entry of review.plans) {
      const current = await buildDeletionPlan(entry.plan.id);
      if (await deletionSnapshot(current) !== entry.snapshot) throw new Error("File changed after the review. Review the selection again");
    }
    for (const entry of review.plans) {
      try {
        const current = await buildDeletionPlan(entry.plan.id);
        if (await deletionSnapshot(current) !== entry.snapshot) throw new Error("File changed after the review");
        const warning = await removeCatalogPlan(current,mode);
        deleted.push(current.id);
        if (warning) warnings.push(`${current.filename}: ${warning}`);
      } catch (error) { failed = `${entry.plan.filename}: ${error.message || error}`; break; }
    }
    return {mode,requested:review.plans.length,deleted,warnings,failed};
  } finally { deleting = false; }
}

function checkedCleanupIds(ids) {
  if (cleanupState.running || scanState.running || deleting ||
      !cleanupState.finishedAt || cleanupState.message) {
    throw new Error("Finish a cleanup check first");
  }
  if (!Array.isArray(ids) || ids.length < 1 || ids.length > 100 ||
      ids.some((id) => typeof id !== "string" || !/^[a-f0-9]{24}$/.test(id)) ||
      new Set(ids).size !== ids.length) {
    throw new Error("Choose 1 to 100 distinct cleanup results");
  }
  const available = new Set(cleanupCandidates.map((candidate) => candidate.id));
  if (ids.some((id) => !available.has(id))) throw new Error("Cleanup results changed. Run the check again");
  return new Set(ids);
}

async function fileDigest(path) {
  const hash = createHash("sha256");
  for await (const chunk of createReadStream(path)) hash.update(chunk);
  return hash.digest("hex");
}

async function checkDuplicateSurvivors(selected, hashContents = true) {
  const groups = new Map();
  for (const candidate of cleanupCandidates) {
    if (candidate.type !== "duplicate" || !selected.has(candidate.id)) continue;
    const members = cleanupCandidates.filter((entry) => entry.type === "duplicate" &&
      entry.group === candidate.group);
    groups.set(candidate.group,members);
  }
  for (const [group,members] of groups) {
    const survivors = members.filter((candidate) => !selected.has(candidate.id));
    if (!survivors.length) throw new Error("Keep at least one file from every exact-duplicate group");
    let verified = false;
    for (const candidate of survivors) {
      const item = catalogItem(candidate.id);
      if (!item) continue;
      try {
        const details = await checkedFile(item.path,item.root);
        if (details.size === item.size && details.mtime.toISOString() === item.modified &&
            (!hashContents || `${details.size}:${await fileDigest(item.path)}` === group)) {
          verified = true; break;
        }
      } catch { /* Try another unselected member of this group. */ }
    }
    if (!verified) throw new Error("A duplicate group's remaining copy could not be verified. Run the check again");
  }
}

async function deletionSnapshot(plan) {
  const item = catalogItem(plan.id);
  if (!item) throw new Error("Catalog item changed");
  const files = [];
  for (const file of plan.files) {
    const details = await checkedFile(file.path,item.root);
    files.push({ path:file.path, role:file.role, size:details.size,
      modified:details.mtime.toISOString() });
  }
  return JSON.stringify(files);
}

export async function previewCatalogCleanupBatch(ids, keep = "rating") {
  cleanupReview = null;
  const selected = checkedCleanupIds(ids);
  if (!["rating","oldest","newest"].includes(keep)) throw new Error("Choose a keep rule");
  const groups = new Map();
  for (const candidate of cleanupCandidates) {
    if (candidate.type !== "duplicate") continue;
    const entries=groups.get(candidate.group) || [];
    entries.push(candidate); groups.set(candidate.group,entries);
  }
  const protectedFiles=[];
  for (const entries of groups.values()) {
    if (!entries.every(entry => selected.has(entry.id))) continue;
    const ranked=rankDuplicateGroup(entries,keep);
    if (ranked.length !== entries.length) throw new Error("Cleanup results changed. Run the check again");
    const keeper=ranked[0];
    selected.delete(keeper.candidate.id);
    protectedFiles.push({ id:keeper.candidate.id, filename:keeper.item.filename });
  }
  await checkDuplicateSurvivors(selected);
  const plans = [];
  for (const id of selected) {
    const plan = await buildDeletionPlan(id);
    plans.push({ plan, snapshot:await deletionSnapshot(plan) });
  }
  const token = randomUUID();
  cleanupReview = { token, generation:cleanupGeneration, ids:[...selected], plans,
    expires:Date.now() + 5*60*1000 };
  return { token, count:plans.length, ids:[...selected], protectedFiles,
    files:plans.flatMap(({ plan }) => plan.files), keepOnePerDuplicateGroup:true };
}

async function recycleFile(path) {
  if (process.platform !== "win32") throw new Error("Recycle Bin is available only on Windows");
  const command = "$ErrorActionPreference='Stop'; Add-Type -AssemblyName Microsoft.VisualBasic; [Microsoft.VisualBasic.FileIO.FileSystem]::DeleteFile($env:PROMPT_STUDIO_DELETE_TARGET, [Microsoft.VisualBasic.FileIO.UIOption]::OnlyErrorDialogs, [Microsoft.VisualBasic.FileIO.RecycleOption]::SendToRecycleBin, [Microsoft.VisualBasic.FileIO.UICancelOption]::ThrowException)";
  await execFileAsync("powershell.exe",["-NoProfile","-NonInteractive","-Command",command],{
    env:{ ...process.env, PROMPT_STUDIO_DELETE_TARGET:path }, windowsHide:true, timeout:30000
  });
}

async function removeCatalogPlan(plan,mode) {
  const remove = mode === "trash" ? recycleFile : unlink;
  await remove(plan.files[0].path);
  let warning = "";
  for (const companion of plan.files.slice(1)) {
    try { await remove(companion.path); }
    catch (error) { warning = `Media removed, but companion metadata remains: ${error.message}`; }
  }
  const item = catalogItem(plan.id);
  index.items = index.items.filter((entry) => entry.id !== plan.id);
  if (labels.items[plan.id]) {
    delete labels.items[plan.id];
    try { await persistLabels(); }
    catch (error) { warning = `${warning} Media removed, but rating/category could not be saved: ${error.message}`.trim(); }
  }
  index.scanned = Math.max(0,index.scanned-1);
  if (item && !item.prompt) index.skipped = Math.max(0,index.skipped-1);
  try { await persist(); }
  catch (error) { warning = `${warning} Catalog index could not be saved; refresh it. ${error.message}`.trim(); }
  removeCleanupCandidate(plan.id);
  return warning;
}

export async function deleteCatalogItem(id, mode) {
  if (mode !== "trash" && mode !== "permanent") throw new Error("Choose Recycle Bin or permanent deletion");
  if (scanState.running || deleting || cleanupState.running) throw new Error("Wait until the current operation finishes");
  deleting = true;
  try {
    const plan = await buildDeletionPlan(id);
    const warning = await removeCatalogPlan(plan,mode);
    return { mode, files:plan.files, warning };
  } finally { deleting = false; }
}

export async function deleteCatalogCleanupBatch(token, mode) {
  if (mode !== "trash" && mode !== "permanent") throw new Error("Choose Recycle Bin or permanent deletion");
  if (scanState.running || deleting || cleanupState.running) throw new Error("Wait until the current operation finishes");
  const review = cleanupReview;
  if (!review || typeof token !== "string" || token !== review.token ||
      review.generation !== cleanupGeneration || Date.now() > review.expires) {
    throw new Error("The deletion review expired. Review the selected files again");
  }
  const selected = checkedCleanupIds(review.ids);
  deleting = true;
  cleanupReview = null;
  const deleted = [], warnings = [];
  let failed = "";
  try {
    await checkDuplicateSurvivors(selected);
    for (const entry of review.plans) {
      try {
        const current = await buildDeletionPlan(entry.plan.id);
        if (await deletionSnapshot(current) !== entry.snapshot) {
          throw new Error("File changed after the review");
        }
        if (cleanupCandidates.some((candidate) => candidate.id === current.id &&
            candidate.type === "duplicate")) await checkDuplicateSurvivors(selected,false);
        const warning = await removeCatalogPlan(current,mode);
        deleted.push(current.id);
        if (warning) warnings.push(`${current.filename}: ${warning}`);
      } catch (error) {
        failed = `${entry.plan.filename}: ${error.message || error}`;
        break;
      }
    }
    return { mode, requested:review.ids.length, deleted, warnings, failed,
      rescanRecommended:deleted.length > 0 };
  } finally { deleting = false; }
}
