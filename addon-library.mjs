import { readFile, readdir, stat, writeFile } from "node:fs/promises";
import { basename, extname, isAbsolute, join, parse, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const home = fileURLToPath(new URL(".", import.meta.url));
const configFile = join(home, "addon-library-roots.json");
const types = new Set(["lora", "embedding", "wildcard"]);
const extensions = { lora:new Set([".safetensors", ".pt", ".ckpt"]), embedding:new Set([".safetensors", ".pt", ".ckpt"]), wildcard:new Set([".txt"]) };
const ignored = new Set([".git", ".cache", "node_modules", "backups", "preview", "previews"]);
let roots = [], items = [], scanning = false, lastScan = "", error = "";

const clean = (value, limit = 500) => String(value ?? "").replace(/<[^>]*>/gu, " ").replace(/&(?:nbsp|amp|lt|gt|quot);/giu, " ").replace(/\s+/gu, " ").trim().slice(0, limit);
const words = (value) => Array.isArray(value) ? value.map((item) => clean(item, 100)).filter(Boolean) : typeof value === "string" ? value.split(/[,;\n]+/u).map((item) => clean(item, 100)).filter(Boolean) : [];
async function sidecar(path) {
  try {
    const size = (await stat(path)).size;
    if (size > 0 && size <= 512_000) return JSON.parse(await readFile(path, "utf8"));
  } catch { /* Metadata is optional and must never block inventory. */ }
  return null;
}
async function describe(path, type, root) {
  const stem = path.slice(0, -extname(path).length);
  const cm = await sidecar(`${stem}.cm-info.json`);
  const local = await sidecar(`${stem}.metadata.json`);
  const name = clean(cm?.UserTitle || cm?.ModelName || local?.model_name || basename(stem), 160);
  const description = clean(cm?.ModelDescription || cm?.VersionDescription || local?.modelDescription || local?.notes, 700);
  const baseModel = clean(cm?.BaseModel || local?.base_model, 120);
  const tags = words(cm?.Tags || local?.tags).slice(0, 30);
  const triggers = words(cm?.TrainedWords || local?.trainedWords).slice(0, 24);
  return { type, name:name || basename(stem), file:basename(path), path, root, description, baseModel, tags, triggers,
    source:cm ? "cm-info" : local ? "metadata" : "filename" };
}
export async function loadAddonLibrary() {
  try {
    const saved = JSON.parse(await readFile(configFile, "utf8"));
    roots = Array.isArray(saved) ? saved.filter((row) => types.has(row?.type) && typeof row?.path === "string" && isAbsolute(row.path)).slice(0, 24) : [];
  } catch { roots = []; }
}
export function addonStatus() { return { roots, count:items.length, scanning, lastScan, error }; }
export function addonItems() { return items; }
export async function addAddonRoot(input) {
  const type = String(input?.type || "");
  const path = String(input?.path || "").trim();
  if (!types.has(type) || !isAbsolute(path) || path.length > 500 || resolve(path) === parse(path).root) throw new Error("Choose a specific existing addon folder.");
  const canonical = resolve(path);
  if (!(await stat(canonical)).isDirectory()) throw new Error("The folder does not exist.");
  if (roots.some((row) => row.type === type && row.path.toLowerCase() === canonical.toLowerCase())) return addonStatus();
  if (roots.length >= 24) throw new Error("Too many folders.");
  roots.push({ type, path:canonical });
  await writeFile(configFile, JSON.stringify(roots, null, 2) + "\n", "utf8");
  return addonStatus();
}
export async function scanAddonLibrary() {
  if (scanning) return addonStatus();
  scanning = true; error = "";
  const found = [];
  try {
    for (const root of roots) {
      const pending = [{ path:root.path, depth:0 }];
      while (pending.length && found.length < 12000) {
        const current = pending.pop();
        let entries;
        try { entries = await readdir(current.path, { withFileTypes:true }); }
        catch { continue; }
        for (const entry of entries) {
          if (entry.isSymbolicLink()) continue;
          const path = join(current.path, entry.name);
          if (entry.isDirectory() && current.depth < 8 && !ignored.has(entry.name.toLowerCase())) pending.push({ path, depth:current.depth + 1 });
          else if (entry.isFile() && extensions[root.type].has(extname(entry.name).toLowerCase())) found.push(await describe(path, root.type, root.path));
          if (found.length >= 12000) break;
        }
      }
    }
    items = found.sort((a,b) => a.name.localeCompare(b.name));
    lastScan = new Date().toISOString();
  } catch (cause) { error = String(cause?.message || cause).slice(0, 200); }
  finally { scanning = false; }
  return addonStatus();
}

