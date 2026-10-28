import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { open } from "node:fs/promises";
import { extname } from "node:path";

const recentMilliseconds = 60 * 60 * 1000;
const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

async function readPart(path, length, position = 0) {
  const handle = await open(path, "r");
  try {
    const buffer = Buffer.alloc(length);
    const { bytesRead } = await handle.read(buffer, 0, length, position);
    return buffer.subarray(0, bytesRead);
  } finally {
    await handle.close();
  }
}

export async function obviousFileIssue(path, size) {
  if (size === 0) return "empty";
  const ext = extname(path).toLowerCase();
  if (ext === ".png") {
    if (size < 45) return "truncated";
    const head = await readPart(path, 24);
    if (!head.subarray(0, 8).equals(pngSignature) || head.toString("ascii", 12, 16) !== "IHDR" ||
        head.readUInt32BE(16) === 0 || head.readUInt32BE(20) === 0) return "header";
    const end = await readPart(path, 12, size - 12);
    if (end.length !== 12 || end.readUInt32BE(0) !== 0 || end.toString("ascii", 4, 8) !== "IEND") return "truncated";
  } else if (ext === ".jpg" || ext === ".jpeg") {
    if (size < 4) return "truncated";
    const head = await readPart(path, 2);
    if (head[0] !== 0xff || head[1] !== 0xd8) return "header";
  } else if (ext === ".webp") {
    if (size < 12) return "truncated";
    const head = await readPart(path, 12);
    if (head.toString("ascii", 0, 4) !== "RIFF" || head.toString("ascii", 8, 12) !== "WEBP") return "header";
  } else if (ext === ".webm") {
    if (size < 4) return "truncated";
    const head = await readPart(path, 4);
    if (!head.equals(Buffer.from([0x1a, 0x45, 0xdf, 0xa3]))) return "header";
  } else if (ext === ".mp4" || ext === ".mov") {
    if (size < 16) return "truncated";
    const head = await readPart(path, 16);
    if (head.toString("ascii", 4, 8) !== "ftyp") return "header";
  }
  return null;
}

async function sha256(path) {
  const hash = createHash("sha256");
  for await (const chunk of createReadStream(path)) hash.update(chunk);
  return hash.digest("hex");
}

// This only flags objective, reviewable candidates. It never changes media files.
export async function inspectCleanup(items, { verify, shouldStop = () => false, onProgress = () => {}, now = Date.now() }) {
  const state = { checked:0, total:items.length, hashed:0, hashTotal:0, skippedRecent:0, skippedChanged:0,
    unreadable:0, suspectCount:0, duplicateGroups:0, duplicateExtras:0 };
  const ready = [], suspects = [];
  const progress = () => onProgress({ ...state });
  for (const item of items) {
    if (shouldStop()) return { cancelled:true, state, candidates:[] };
    state.checked++;
    if (now - Date.parse(item.modified) < recentMilliseconds) { state.skippedRecent++; continue; }
    try {
      const details = await verify(item);
      if (details.size !== item.size || details.mtime.toISOString() !== item.modified) {
        state.skippedChanged++; continue;
      }
      const reason = await obviousFileIssue(item.path, details.size);
      if (reason) {
        suspects.push({ id:item.id, type:"suspect", reason });
        state.suspectCount++;
      } else ready.push(item);
    } catch { state.unreadable++; }
    if (state.checked % 25 === 0) progress();
  }
  progress();
  const bySize = new Map();
  for (const item of ready) {
    const group = bySize.get(item.size) || [];
    group.push(item); bySize.set(item.size, group);
  }
  const hashable = [...bySize.values()].filter((group) => group.length > 1).flat();
  state.hashTotal = hashable.length;
  const byDigest = new Map();
  for (const item of hashable) {
    if (shouldStop()) return { cancelled:true, state, candidates:[] };
    try {
      const before = await verify(item);
      if (before.size !== item.size || before.mtime.toISOString() !== item.modified) {
        state.skippedChanged++; continue;
      }
      const digest = await sha256(item.path);
      const after = await verify(item);
      if (after.size !== item.size || after.mtime.toISOString() !== item.modified) {
        state.skippedChanged++; continue;
      }
      const key = String(item.size) + ":" + digest;
      const group = byDigest.get(key) || [];
      group.push(item.id); byDigest.set(key, group);
    } catch { state.unreadable++; }
    state.hashed++;
    if (state.hashed % 5 === 0) progress();
  }
  const candidates = [...suspects];
  for (const [key, ids] of byDigest) {
    if (ids.length < 2) continue;
    state.duplicateGroups++;
    state.duplicateExtras += ids.length - 1;
    for (const id of ids) candidates.push({ id, type:"duplicate", reason:"exact", group:key, groupSize:ids.length });
  }
  progress();
  return { cancelled:false, state, candidates };
}
