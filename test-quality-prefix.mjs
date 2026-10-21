import assert from "node:assert/strict";
import { test } from "node:test";
import { qualityCopy, qualityLanguages, qualityPrefixPhrase, photoOpening, photoProfileActive, imageOpening, artProfileActive, renderQualityPrefixSelector, renderPhotoPresetSelectors, syncPhotoPresetControls, renderArtPresetSelector, syncArtPresetControls } from "./dist/quality-prefix.mjs";
import { buildPrompt } from "./dist/engine.mjs";

test("professional photo opening is localized and opt-in", () => {
  assert.equal(qualityCopy.choices.proPhoto.length, qualityLanguages.length);
  assert.equal(qualityCopy.phrases.proPhoto.length, qualityLanguages.length);
  assert.match(qualityPrefixPhrase("proPhoto", "EN"), /tack-sharp focus/u);
  assert.match(qualityPrefixPhrase("proPhoto", "HU"), /tűéles fókuszban/u);
  assert.equal(qualityPrefixPhrase("auto", "EN"), "");
  const state = { mode:"image", outputLanguage:"EN", brief:"Two sleeping fox cubs", model:"krea2", qualityPrefix:"proPhoto" };
  assert.ok(buildPrompt(state).startsWith(qualityPrefixPhrase("proPhoto", "EN")));
  assert.ok(!buildPrompt({ ...state, qualityPrefix:"auto" }).includes("tack-sharp"));
});

test("photo profiles add compatible direction and lighting, but never contradict art media", () => {
  const base = { qualityPrefix:"proPhoto", photoGenre:"nature", photoLight:"sunset", medium:"photo", style:"cinematic" };
  const opening = photoOpening(base, "EN");
  assert.match(opening, /tack-sharp focus/u);
  assert.match(opening, /immersive nature photography/u);
  assert.match(opening, /low warm sunset light/u);
  assert.ok(!opening.includes("dawn"));
  assert.match(photoOpening(base, "HU"), /napnyugtafény/u);
  assert.equal(photoProfileActive({ ...base, medium:"painting" }), false);
  assert.equal(photoOpening({ ...base, medium:"painting" }, "EN"), "");
  assert.equal(photoOpening({ ...base, medium:"auto", style:"painterly" }, "EN"), "");
  assert.equal(photoOpening({ ...base, qualityPrefix:"auto" }, "EN"), "");
  const prompt = buildPrompt({ ...base, mode:"image", outputLanguage:"EN", brief:"Two fox cubs", model:"krea2", lighting:"dawn" });
  assert.match(prompt, /low warm sunset light/u);
  assert.ok(!prompt.includes("soft golden dawn light"), "specific photo light overrides the generic lighting field");
  assert.ok(buildPrompt({ ...base, mode:"image", outputLanguage:"EN", brief:"Two fox cubs", model:"krea2", lighting:"dawn", medium:"painting" }).includes("soft golden dawn light"));
});

test("creative art opening offers medium-compatible directions without photo claims", () => {
  assert.equal(qualityCopy.choices.creativeArt.length, qualityLanguages.length);
  assert.equal(qualityCopy.phrases.creativeArt.length, qualityLanguages.length);
  const base = { mode:"image", outputLanguage:"EN", brief:"Two fox cubs", model:"krea2", qualityPrefix:"creativeArt", medium:"graphic", artStyle:"graffiti" };
  const prompt = buildPrompt(base);
  assert.match(prompt, /street-art composition/u);
  assert.ok(!prompt.includes("photorealistic editorial photograph"));
  assert.match(imageOpening({ ...base, outputLanguage:"HU" }, "HU"), /falfelület/u);
  assert.equal(artProfileActive({ ...base, medium:"photo" }), false);
  assert.equal(imageOpening({ ...base, medium:"photo" }, "EN"), "");
  assert.ok(!imageOpening({ ...base, medium:"painting" }, "EN").includes("spray paint"), "incompatible style is omitted");
  assert.ok(buildPrompt({ ...base, qualityPrefix:"auto" }).includes("Two fox cubs"));
});

test("photo opening appears in image selectors but not video selectors", () => {
  const elements = new Map();
  for (const prefix of ["still", "i2i", "video", "i2v"]) {
    const select = { value:"auto", options:[], replaceChildren() { this.options = []; }, appendChild(option) { this.options.push(option); } };
    elements.set(`${prefix}-quality-prefix`, select);
    elements.set(`${prefix}-quality-prefix-label`, { textContent:"" });
  }
  const oldDocument = globalThis.document;
  globalThis.document = {
    getElementById(id) { return elements.get(id); },
    createElement() { return { value:"", textContent:"" }; }
  };
  try {
    for (const prefix of ["still", "i2i", "video", "i2v"]) renderQualityPrefixSelector(prefix, "HU");
    for (const prefix of ["still", "i2i"]) {
      const select = elements.get(`${prefix}-quality-prefix`);
      assert.ok(select.options.some((option) => option.value === "proPhoto"));
      assert.ok(select.options.some((option) => option.value === "creativeArt"));
      select.value = "proPhoto";
      renderQualityPrefixSelector(prefix, "EN");
      assert.equal(select.value, "proPhoto", "language switching retains the selection");
    }
    for (const prefix of ["video", "i2v"]) {
      assert.ok(!elements.get(`${prefix}-quality-prefix`).options.some((option) => option.value === "proPhoto"));
      assert.ok(!elements.get(`${prefix}-quality-prefix`).options.some((option) => option.value === "creativeArt"));
    }
  } finally {
    globalThis.document = oldDocument;
  }
});

test("art directions follow the chosen medium and retain compatible choices", () => {
  const elements = new Map();
  for (const prefix of ["still", "i2i"]) {
    elements.set(`${prefix}-quality-prefix`, { value:"creativeArt" });
    elements.set(`${prefix}-medium`, { value:"graphic" });
    elements.set(`${prefix}-art-presets`, { hidden:true });
    elements.set(`${prefix}-art-help`, { hidden:true, textContent:"" });
    elements.set(`${prefix}-art-style`, { value:"auto", options:[], replaceChildren() { this.options = []; }, appendChild(option) { this.options.push(option); } });
    elements.set(`${prefix}-art-style-label`, { textContent:"" });
  }
  const oldDocument = globalThis.document;
  globalThis.document = {
    getElementById(id) { return elements.get(id); },
    createElement() { return { value:"", textContent:"" }; }
  };
  try {
    renderArtPresetSelector("still", "HU");
    renderArtPresetSelector("i2i", "HU");
    const select = elements.get("still-art-style");
    assert.ok(select.options.some((option) => option.value === "graffiti"));
    assert.ok(!select.options.some((option) => option.value === "oil"));
    select.value = "graffiti";
    renderArtPresetSelector("still", "EN");
    assert.equal(select.value, "graffiti");
    elements.get("still-medium").value = "painting";
    renderArtPresetSelector("still", "EN");
    assert.equal(select.value, "auto", "incompatible direction resets when medium changes");
    assert.ok(select.options.some((option) => option.value === "oil"));
    elements.get("i2i-medium").value = "photo";
    syncArtPresetControls("i2i", "EN");
    assert.equal(elements.get("i2i-art-presets").hidden, true);
    assert.match(elements.get("i2i-art-help").textContent, /not added/u);
  } finally {
    globalThis.document = oldDocument;
  }
});

test("photo selectors retain choices across interface languages and only appear with photo opening", () => {
  const elements = new Map();
  for (const prefix of ["still", "i2i"]) {
    elements.set(`${prefix}-quality-prefix`, { value:"proPhoto" });
    elements.set(`${prefix}-medium`, { value:"photo" });
    elements.set(`${prefix}-photo-presets`, { hidden:true });
    elements.set(`${prefix}-photo-help`, { hidden:true, textContent:"" });
    for (const kind of ["genre", "light"]) {
      elements.set(`${prefix}-photo-${kind}`, { value:"", options:[], replaceChildren() { this.options = []; }, appendChild(option) { this.options.push(option); } });
      elements.set(`${prefix}-photo-${kind}-label`, { textContent:"" });
    }
  }
  elements.set("style", { value:"cinematic" });
  const oldDocument = globalThis.document;
  globalThis.document = {
    getElementById(id) { return elements.get(id); },
    createElement() { return { value:"", textContent:"" }; }
  };
  try {
    renderPhotoPresetSelectors("still", "HU");
    renderPhotoPresetSelectors("i2i", "HU");
    assert.equal(elements.get("still-photo-presets").hidden, false);
    assert.equal(elements.get("i2i-photo-presets").hidden, false);
    elements.get("still-photo-genre").value = "glamour";
    elements.get("still-photo-light").value = "blueHour";
    renderPhotoPresetSelectors("still", "EN");
    assert.equal(elements.get("still-photo-genre").value, "glamour");
    assert.equal(elements.get("still-photo-light").value, "blueHour");
    elements.get("still-quality-prefix").value = "auto";
    syncPhotoPresetControls("still", "EN");
    assert.equal(elements.get("still-photo-presets").hidden, true);
    elements.get("i2i-medium").value = "poster";
    syncPhotoPresetControls("i2i", "EN");
    assert.equal(elements.get("i2i-photo-presets").hidden, true);
    assert.match(elements.get("i2i-photo-help").textContent, /conflicts/u);
  } finally {
    globalThis.document = oldDocument;
  }
});
