export const imageEditProfiles = {
  krea2: { label: "Krea 2 / Krea style", note: "Krea-style starting sizes from the existing Prompt Studio profile" },
  sdxl: { label: "SDXL", note: "SDXL-style starting sizes from the existing Prompt Studio profile" },
  other: { label: "Other / custom model", note: "Generic starting sizes; check the selected model and workflow" }
};

const presets = {
  krea2: {
    portrait: [[704, 1216], [768, 1344], [896, 1536]],
    landscape: [[1216, 704], [1344, 768], [1536, 896]],
    square: [[896, 896], [1024, 1024], [1152, 1152]],
    wide: [[1280, 640], [1408, 704], [1664, 832]]
  },
  sdxl: {
    portrait: [[768, 1152], [832, 1216], [896, 1344]],
    landscape: [[1152, 768], [1216, 832], [1344, 896]],
    square: [[896, 896], [1024, 1024], [1152, 1152]],
    wide: [[1152, 640], [1344, 704], [1536, 768]]
  }
};

export function recommendImageEditResolution({ model, width, height, priority = "balanced" }) {
  const profileKey = model === "sdxl" ? "sdxl" : "krea2";
  const sourceRatio = Number(width) > 0 && Number(height) > 0 ? Number(width) / Number(height) : 1;
  const frame = sourceRatio > 1.8 ? "wide" : sourceRatio > 1.15 ? "landscape" : sourceRatio < 0.87 ? "portrait" : "square";
  const rank = priority === "safe" ? 0 : priority === "detail" ? 2 : 1;
  const selected = presets[profileKey][frame][rank];
  const lighter = presets[profileKey][frame][Math.max(0, rank - 1)];
  const chosenRatio = selected[0] / selected[1];
  return {
    width: selected[0], height: selected[1], lighter,
    frame, profile: imageEditProfiles[model]?.label || imageEditProfiles.other.label,
    note: imageEditProfiles[model]?.note || imageEditProfiles.other.note,
    unknownModel: !["krea2", "sdxl"].includes(model),
    ratioWarning: Number(width) > 0 && Number(height) > 0 && Math.abs(Math.log(sourceRatio / chosenRatio)) > 0.13
  };
}

export function validImageEditResolution(width, height) {
  return [width, height].every((value) => Number.isInteger(Number(value)) && Number(value) >= 256 && Number(value) <= 4096 && Number(value) % 32 === 0);
}

export function parseImageEditSuggestions(content) {
  if (typeof content !== "string") return null;
  let text = content.trim();
  if (text.startsWith("```")) text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  let data;
  try { data = JSON.parse(text); } catch { return null; }
  if (!Array.isArray(data.suggestions) || data.suggestions.length !== 3) return null;
  const suggestions = data.suggestions.map((item) => ({
    title: String(item?.title || "").trim().slice(0, 100),
    reason: String(item?.reason || "").trim().slice(0, 400),
    prompt: String(item?.prompt || "").trim().slice(0, 6000)
  }));
  if (suggestions.some((item) => !item.title || !item.prompt)) return null;
  return {
    imageSummary: String(data.imageSummary || "").trim().slice(0, 500),
    warnings: Array.isArray(data.warnings) ? data.warnings.slice(0, 3).map((item) => String(item).slice(0, 350)) : [],
    suggestions
  };
}
