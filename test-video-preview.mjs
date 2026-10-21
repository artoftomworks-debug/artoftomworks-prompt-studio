import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const ui = readFileSync(new URL("./dist/media-catalog-ui.mjs",import.meta.url),"utf8");
const css = readFileSync(new URL("./dist/style.css",import.meta.url),"utf8");
const bundle = readFileSync(new URL("./dist/ArtofTomworks_Prompt_Studio_OFFLINE.html",import.meta.url),"utf8");
const server = readFileSync(new URL("./local-server.mjs",import.meta.url),"utf8");
const launcher = readFileSync(new URL("./Start-Prompt-Studio.ps1",import.meta.url),"utf8");
for (const id of ["catalog-video-dialog","catalog-video-player","catalog-video-close"]) {
  assert.match(ui,new RegExp(id));
  assert.match(bundle,new RegExp(id));
}
assert.match(ui,/posterCache/);
assert.match(ui,/IntersectionObserver/);
assert.match(ui,/catalog-show-thumbnails/);
assert.match(ui,/videoDialog\.addEventListener\("close"/);
assert.match(ui,/player\.pause\(\)/);
assert.match(css,/catalog-video-thumb/);
assert.match(css,/catalog-video-dialog/);
assert.match(ui,/id="catalog-video-player" controls playsinline preload="metadata"/);
assert.doesNotMatch(ui,/id="catalog-video-player"[^>]*autoplay/);
assert.match(ui,/preview\.muted=true/);
assert.match(ui,/play\.addEventListener\("pointerleave",stopHoverPreview\)/);
assert.match(server,/videoThumbnails:true/);
assert.match(launcher,/\$health\.videoThumbnails/);
console.log("Video thumbnail and preview checks passed.");
