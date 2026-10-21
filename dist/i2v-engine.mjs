// These are starting points for the user's existing local workflows, not model limits.
// New model profiles can be added without changing the image-to-video UI.
export const videoProfiles = {
  ltx25: {
    label: "LTX 2.5 · Gym I2V",
    family: "LTX 2.5",
    landscape: [[1280, 736], [1536, 864], [1920, 1088]],
    portrait: [[736, 1280], [864, 1536], [1088, 1920]],
    square: [[1024, 1024], [1152, 1152], [1280, 1280]],
    note: "Based on the local Gym workflow and completed tests; long clips can take more time and memory."
  },
  dasiwa: {
    label: "H3 DaSiWa v4 Turbo · I2V",
    family: "MiniMax H3 / DaSiWa",
    landscape: [[1024, 576], [1088, 608], [1344, 768]],
    portrait: [[576, 1024], [608, 1088], [768, 1344]],
    square: [[768, 768], [832, 832], [960, 960]],
    note: "Middle and upper sizes follow the local Simple and Pro workflow scale."
  },
  eros: {
    label: "H3 Eros Max · I2V",
    family: "MiniMax H3 / Eros",
    landscape: [[1024, 576], [1088, 608], [1344, 768]],
    portrait: [[576, 1024], [608, 1088], [768, 1344]],
    square: [[768, 768], [832, 832], [960, 960]],
    note: "Middle and upper sizes follow the local Simple and Pro workflow scale."
  },
  other: {
    label: "Other / custom model",
    family: "Unknown",
    landscape: [[1024, 576], [1280, 736], [1536, 864]],
    portrait: [[576, 1024], [736, 1280], [864, 1536]],
    square: [[768, 768], [1024, 1024], [1152, 1152]],
    note: "Generic suggestion only. Check the selected model and workflow documentation."
  }
};

export function imageOrientation(width, height) {
  if (!(width > 0 && height > 0)) return "landscape";
  const ratio = width / height;
  return ratio > 1.12 ? "landscape" : ratio < 0.89 ? "portrait" : "square";
}

export function recommendVideoResolution({ model = "ltx25", width = 0, height = 0, duration = 7, priority = "balanced" } = {}) {
  const profile = videoProfiles[model] || videoProfiles.other;
  const orientation = imageOrientation(width, height);
  const choices = profile[orientation];
  const requestedRank = priority === "safe" ? 0 : priority === "detail" ? 2 : 1;
  // Longer clips cost more; keep the recommendation conservative, never forbid an override.
  const rank = Number(duration) >= 10 ? Math.min(requestedRank, 1) : requestedRank;
  const [recommendedWidth, recommendedHeight] = choices[rank];
  const sourceRatio = width > 0 && height > 0 ? width / height : null;
  const outputRatio = recommendedWidth / recommendedHeight;
  const ratioDifference = sourceRatio ? Math.abs(sourceRatio - outputRatio) / sourceRatio : 0;
  return {
    width: recommendedWidth,
    height: recommendedHeight,
    orientation,
    lighter: choices[0],
    detailed: choices[2],
    profile: profile.label,
    note: profile.note,
    ratioWarning: ratioDifference > 0.08,
    unknownModel: model === "other" || !videoProfiles[model]
  };
}

export function validateCustomResolution(width, height) {
  const w = Number(width), h = Number(height);
  return Number.isInteger(w) && Number.isInteger(h) && w >= 256 && h >= 256 &&
    w <= 4096 && h <= 4096 && w % 32 === 0 && h % 32 === 0;
}

export function parseVideoSuggestions(raw) {
  const text = String(raw || "").trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  let value;
  try { value = JSON.parse(text); } catch { return null; }
  if (!value || !Array.isArray(value.suggestions) || value.suggestions.length !== 3) return null;
  const suggestions = value.suggestions.map((item) => ({
    title: String(item?.title || "").trim().slice(0, 80),
    prompt: String(item?.prompt || "").trim().slice(0, 4000),
    reason: String(item?.reason || "").trim().slice(0, 240)
  }));
  if (suggestions.some((item) => !item.title || !item.prompt)) return null;
  return {
    imageSummary: String(value.imageSummary || "").trim().slice(0, 600),
    warnings: Array.isArray(value.warnings) ? value.warnings.map((item) => String(item).trim().slice(0, 300)).filter(Boolean).slice(0, 4) : [],
    suggestions
  };
}
