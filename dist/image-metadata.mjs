const decoder = new TextDecoder();
const latin1 = new TextDecoder("latin1");
const MAX_METADATA = 4_000_000;

function text(bytes, encoding = decoder) {
  return encoding.decode(bytes);
}

function zero(bytes, from = 0) {
  const position = bytes.indexOf(0, from);
  return position < 0 ? bytes.length : position;
}

async function inflate(bytes) {
  if (!globalThis.DecompressionStream) return "";
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate"));
  return text(new Uint8Array(await new Response(stream).arrayBuffer()));
}

function extractWorkflowText(value) {
  let graph;
  try { graph = JSON.parse(value); } catch { return []; }
  const nodes = Array.isArray(graph?.nodes) ? graph.nodes : Object.values(graph || {});
  const found = [];
  for (const node of nodes) {
    if (!node || typeof node !== "object") continue;
    const type = String(node.class_type || node.type || "");
    const inputs = node.inputs && typeof node.inputs === "object" ? node.inputs : {};
    for (const [key, candidate] of Object.entries(inputs)) {
      if (typeof candidate === "string" && /(text|prompt|positive|negative|caption)/i.test(key) && candidate.trim()) {
        found.push({ label: `${type || "node"} · ${key}`, value: candidate.trim() });
      }
    }
    // UI workflows store widget values in order; their node types tell us which are text nodes.
    if (/(TextEncode|Prompt|String|TextBox)/i.test(type) && Array.isArray(node.widgets_values)) {
      for (const candidate of node.widgets_values) {
        if (typeof candidate === "string" && candidate.trim().length > 12 && !/\.safetensors$/i.test(candidate)) {
          found.push({ label: `${type} · widget`, value: candidate.trim() });
        }
      }
    }
  }
  return [...new Map(found.map((item) => [item.label + item.value, item])).values()].slice(0, 30);
}

export async function readImageMetadata(file) {
  if (!file || file.size > 100_000_000) throw new Error("Image exceeds the 100 MB limit.");
  const bytes = new Uint8Array(await file.arrayBuffer());
  const png = [137, 80, 78, 71, 13, 10, 26, 10].every((v, i) => bytes[i] === v);
  const result = { format: png ? "PNG" : "OTHER", directPrompt: "", negativePrompt: "", workflowTexts: [], workflowPresent: false, width: 0, height: 0 };
  if (!png) return result;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (bytes.length >= 24) {
    result.width = view.getUint32(16);
    result.height = view.getUint32(20);
  }
  const entries = [];
  let offset = 8;
  while (offset + 12 <= bytes.length) {
    const length = view.getUint32(offset);
    const type = text(bytes.subarray(offset + 4, offset + 8), latin1);
    const start = offset + 8;
    const end = start + length;
    if (end + 4 > bytes.length) break;
    if (length <= MAX_METADATA && ["tEXt", "iTXt", "zTXt"].includes(type)) {
      const data = bytes.subarray(start, end);
      const cut = zero(data);
      const key = text(data.subarray(0, cut), latin1).toLowerCase();
      let value = "";
      if (type === "tEXt") value = text(data.subarray(cut + 1), latin1);
      if (type === "zTXt" && data[cut + 1] === 0) value = await inflate(data.subarray(cut + 2));
      if (type === "iTXt") {
        const compressed = data[cut + 1] === 1;
        const languageEnd = zero(data, cut + 3);
        const translatedEnd = zero(data, languageEnd + 1);
        const content = data.subarray(translatedEnd + 1);
        value = compressed ? await inflate(content) : text(content);
      }
      if (value) entries.push({ key, value });
    }
    offset = end + 4;
    if (type === "IEND") break;
  }
  for (const { key, value } of entries) {
    if (key === "parameters") {
      const match = value.match(/\nNegative prompt:\s*([\s\S]*?)(?=\nSteps:|$)/i);
      result.directPrompt = value.split(/\nNegative prompt:|\nSteps:/i)[0].trim();
      result.negativePrompt = match?.[1]?.trim() || "";
    } else if (["description", "prompt_text", "positive_prompt"].includes(key) && !result.directPrompt) {
      result.directPrompt = value.trim();
    } else if (["prompt", "workflow"].includes(key)) {
      result.workflowPresent = true;
      result.workflowTexts.push(...extractWorkflowText(value));
      if (key === "prompt" && !value.trim().startsWith("{") && !result.directPrompt) result.directPrompt = value.trim();
    }
  }
  result.workflowTexts = [...new Map(result.workflowTexts.map((item) => [item.label + item.value, item])).values()];
  return result;
}
