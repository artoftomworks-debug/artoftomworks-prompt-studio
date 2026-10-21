import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const ui = readFileSync(new URL("./dist/media-catalog-ui.mjs",import.meta.url),"utf8");
const css = readFileSync(new URL("./dist/style.css",import.meta.url),"utf8");
const bundle = readFileSync(new URL("./dist/ArtofTomworks_Prompt_Studio_OFFLINE.html",import.meta.url),"utf8");
for (const token of ["data-viewer-prev","data-viewer-next","data-viewer-mark",
  "data-viewer-stars","data-viewer-category","data-viewer-delete"]) {
  assert.match(ui,new RegExp(token));
  assert.match(bundle,new RegExp(token));
}
assert.match(ui,/async function navigateViewer\(direction\)/);
assert.match(ui,/const targetPage=Math\.floor\(target\/24\)/);
assert.match(ui,/marked\.add\(viewerItem\.id\)/);
assert.match(ui,/openDelete\(viewerItem\)/);
assert.match(ui,/preview\.muted=true/);
assert.match(ui,/play\.addEventListener\("pointerenter"/);
assert.match(ui,/play\.addEventListener\("pointerleave",stopHoverPreview\)/);
assert.match(ui,/id="catalog-video-player" controls playsinline preload="metadata"/);
assert.doesNotMatch(ui,/id="catalog-video-player"[^>]*autoplay/);
assert.match(css,/catalog-viewer-toolbar/);
assert.match(css,/catalog-video-hover/);
console.log("Expanded viewer controls and muted hover preview checks passed.");
