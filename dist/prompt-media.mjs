const mediaDatabaseName = "artoftomworks.promptStudio.media.v1";
let databasePromise;

export function videoFileName(value) {
  return String(value || "").trim().split(/[\\/]/).at(-1).slice(0, 240);
}

function database() {
  if (!globalThis.indexedDB) return Promise.reject(new Error("IndexedDB unavailable"));
  if (!databasePromise) databasePromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(mediaDatabaseName, 1);
    request.onupgradeneeded = () => request.result.createObjectStore("samples", { keyPath: "id" });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("IndexedDB open failed"));
  }).catch((error) => { databasePromise = null; throw error; });
  return databasePromise;
}

async function mediaRequest(mode, operation) {
  const db = await database();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("samples", mode);
    const request = operation(transaction.objectStore("samples"));
    let result;
    request.onsuccess = () => { result = request.result; };
    request.onerror = () => reject(request.error || new Error("Media request failed"));
    transaction.oncomplete = () => resolve(result);
    transaction.onerror = () => reject(transaction.error || new Error("Media transaction failed"));
    transaction.onabort = () => reject(transaction.error || new Error("Media transaction aborted"));
  });
}

export async function savePromptSample(id, blob) {
  if (!(blob instanceof Blob) || !/^image\/(?:webp|jpeg|png)$/.test(blob.type) || blob.size > 150_000) throw new Error("Invalid sample image");
  await mediaRequest("readwrite", (store) => store.put({ id, blob }));
}
export async function loadPromptSample(id) {
  const value = await mediaRequest("readonly", (store) => store.get(id));
  return value?.blob || null;
}
export async function removePromptSample(id) {
  await mediaRequest("readwrite", (store) => store.delete(id));
}

async function thumbnailFromSource(source, width, height) {
  if (!width || !height) throw new Error("No image dimensions");
  for (const [side, quality] of [[480, 0.76], [360, 0.65], [240, 0.53]]) {
    const factor = Math.min(1, side / Math.max(width, height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(width * factor));
    canvas.height = Math.max(1, Math.round(height * factor));
    canvas.getContext("2d").drawImage(source, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/webp", quality));
    if (blob && /^image\/(?:webp|jpeg|png)$/.test(blob.type) && blob.size <= 150_000) return blob;
  }
  throw new Error("Sample image too large");
}

export async function sampleFromImage(file) {
  if (!file || !["image/png", "image/jpeg", "image/webp"].includes(file.type) || file.size > 50_000_000) throw new Error("Unsupported image");
  const bitmap = await createImageBitmap(file);
  try { return await thumbnailFromSource(bitmap, bitmap.width, bitmap.height); }
  finally { bitmap.close(); }
}

function waitForVideo(video, eventName, timeoutMs) {
  return new Promise((resolve, reject) => {
    const cleanup = () => { video.removeEventListener(eventName, onReady); video.removeEventListener("error", onError); clearTimeout(timer); };
    const onReady = () => { cleanup(); resolve(); };
    const onError = () => { cleanup(); reject(new Error("Video decode failed")); };
    const timer = setTimeout(() => { cleanup(); reject(new Error("Video decode timed out")); }, timeoutMs);
    video.addEventListener(eventName, onReady, { once: true });
    video.addEventListener("error", onError, { once: true });
  });
}

export async function sampleFromVideo(file) {
  if (!file || !(/^(?:video\/)/.test(file.type) || /\.(?:mp4|webm|mov|mkv)$/i.test(file.name))) throw new Error("Unsupported video");
  const video = document.createElement("video");
  const url = URL.createObjectURL(file);
  video.preload = "auto"; video.muted = true; video.playsInline = true;
  try {
    const ready = waitForVideo(video, "loadeddata", 15000);
    video.src = url;
    video.load();
    await ready;
    if (!video.videoWidth || !video.videoHeight) throw new Error("No video frame");
    const moment = Number.isFinite(video.duration) && video.duration > 1 ? Math.min(1, video.duration / 3) : 0;
    if (moment > 0) {
      try {
        const seeked = waitForVideo(video, "seeked", 8000);
        video.currentTime = moment;
        await seeked;
      } catch { /* The first decoded frame is still usable. */ }
    }
    return await thumbnailFromSource(video, video.videoWidth, video.videoHeight);
  } finally {
    video.pause(); video.removeAttribute("src"); video.load(); URL.revokeObjectURL(url);
  }
}

export function imageDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error || new Error("Image export failed"));
    reader.readAsDataURL(blob);
  });
}

export async function blobFromImageDataUrl(value) {
  if (typeof value !== "string" || value.length > 250_000 || !/^data:image\/(?:webp|jpeg|png);base64,[A-Za-z0-9+/=]+$/.test(value)) throw new Error("Invalid image backup");
  const blob = await (await fetch(value)).blob();
  if (blob.size > 150_000) throw new Error("Image backup too large");
  return blob;
}
