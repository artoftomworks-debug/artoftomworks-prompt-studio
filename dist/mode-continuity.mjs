const classicModes = new Set(["image", "video"]);

export function modeDraft(fields, mode) {
  const value = (key) => String(fields[key] || "").trim();
  if (classicModes.has(mode)) {
    return {
      idea: value("brief") || value("action") || value("prompt-output"),
      motion: value("action"),
      imageBasis: value("brief") || value("subject") || value("prompt-output"),
      notes: [["Idea", value("brief")], ["Subject", value("subject")], ["Action", value("action")],
        ["Setting", value("setting")], ["Negative", value("negatives")], ["Prompt", value("prompt-output")]]
    };
  }
  if (mode === "i2v") {
    return { idea:value("i2v-idea") || value("i2v-prompt"), motion:value("i2v-idea"),
      imageBasis:value("i2v-idea") || value("i2v-prompt"),
      notes:[["Video idea", value("i2v-idea")], ["Prompt", value("i2v-prompt")]] };
  }
  return { idea:value("i2i-change") || value("i2i-keep") || value("i2i-prompt"),
    motion:value("i2i-change"), imageBasis:value("i2i-keep") || value("i2i-change") || value("i2i-prompt"),
    notes:[["Keep", value("i2i-keep")], ["Change", value("i2i-change")], ["Prompt", value("i2i-prompt")]] };
}

export function continuityTransfer(fields, from, to) {
  if (from === to) return { target:null, text:"", notes:"" };
  const draft = modeDraft(fields, from);
  const notes = draft.notes.filter(([, text]) => text).map(([label, text]) => `${label}: ${text}`).join("\n\n");
  if (classicModes.has(from) && classicModes.has(to)) return { target:null, text:"", notes };
  const target = to === "i2v" ? "i2v-idea" : to === "i2i" ? "i2i-keep" : "brief";
  const text = to === "i2v" ? (draft.motion || draft.idea) : to === "i2i" ? draft.imageBasis : draft.idea;
  return { target, text:fields[target]?.trim() ? "" : text, notes };
}
