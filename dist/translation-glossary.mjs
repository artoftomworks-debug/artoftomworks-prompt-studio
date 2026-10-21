export const glossaryLanguages = ["EN", "HU", "DE", "FR", "ES", "IT", "PT", "PL"];
export const glossaryMaxEntries = 2000;
export const glossaryStorageKey = "artoftomworks.promptStudio.glossary.v1";
export const faithfulStorageKey = "artoftomworks.promptStudio.faithful.v1";

function cleanTerm(value) { return String(value ?? "").trim().replace(/\s+/g, " "); }
function fold(value) { return cleanTerm(value).normalize("NFKC").toLocaleLowerCase(); }

export function normalizeGlossaryEntries(raw) {
  if (!Array.isArray(raw)) return [];
  const seen = new Set();
  const entries = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const source = String(item.source || "").toUpperCase();
    const target = String(item.target || "").toUpperCase();
    const from = cleanTerm(item.from);
    const to = cleanTerm(item.to);
    if (!glossaryLanguages.includes(source) || !glossaryLanguages.includes(target) || source === target || !from || !to || from.length > 120 || to.length > 120) continue;
    const pair = [source, target].sort().join("|");
    const key = source < target ? `${pair}|${fold(from)}` : `${pair}|${fold(to)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    entries.push({ source, target, from, to });
    if (entries.length === glossaryMaxEntries) break;
  }
  return entries;
}

export function containsTerm(text, term) {
  const haystack = String(text || "").normalize("NFKC").toLocaleLowerCase();
  const needle = fold(term);
  if (!needle) return false;
  let index = haystack.indexOf(needle);
  while (index !== -1) {
    const before = haystack[index - 1] || "";
    const after = haystack[index + needle.length] || "";
    const first = needle[0], last = needle[needle.length - 1];
    const badBefore = /[\p{L}\p{N}]/u.test(before) && /[\p{L}\p{N}]/u.test(first);
    const badAfter = /[\p{L}\p{N}]/u.test(after) && /[\p{L}\p{N}]/u.test(last);
    if (!badBefore && !badAfter) return true;
    index = haystack.indexOf(needle, index + 1);
  }
  return false;
}

export function matchingGlossaryEntries(entries, source, target, text) {
  return normalizeGlossaryEntries(entries).flatMap((entry) => {
    if (entry.source === source && entry.target === target && containsTerm(text, entry.from)) return [{ from:entry.from, to:entry.to }];
    if (entry.source === target && entry.target === source && containsTerm(text, entry.to)) return [{ from:entry.to, to:entry.from }];
    return [];
  }).sort((a, b) => b.from.length - a.from.length);
}

export function exactGlossaryMatch(entries, source, target, term) {
  const needle = fold(term);
  if (!needle || source === target) return null;
  for (const entry of normalizeGlossaryEntries(entries)) {
    if (entry.source === source && entry.target === target && fold(entry.from) === needle) return { from:entry.from, to:entry.to };
    if (entry.source === target && entry.target === source && fold(entry.to) === needle) return { from:entry.to, to:entry.from };
  }
  return null;
}

export function missingGlossaryTerms(matches, translatedText) {
  return matches.filter((entry) => !containsTerm(translatedText, entry.to)).map((entry) => entry.to);
}

export function glossaryInstruction(matches) {
  if (!matches.length) return "";
  const terms = matches.map((entry) => `- ${JSON.stringify(entry.from)} → ${JSON.stringify(entry.to)}`).join("\n");
  return `Use these user-defined terminology pairs in this direction. Preserve the exact target phrase where it fits grammatically. Do not euphemize or omit these terms:\n${terms}\n`;
}

const commonGlossaryWords = new Set("a an the and or of in on at to for with from by as is are was were be been being this that these those it its into over under through while then than very more most less no not without vagy egy az a de hogy és is nem van volt lesz ezt azt ami akik mint majd után előtt nagyon la el los las del en un una y con para por que es se le les des du et dans sur avec une der die das ein eine und mit von im zu dem den auf ist il elle lo gli di da che uno i em na do dos e com um uma os as o é".split(/\s+/u));

export function extractGlossaryCandidates(prompts,{limit=120,minCount=1,expandLong=false}={}) {
  const counts=new Map();
  for (const prompt of prompts || []) {
    const seen=new Set();
    const text=String(prompt || "").slice(0,4000).replace(/<lora:[^>]*>/giu," ");
    for (const fragment of text.split(/[,;.!?\n\r]+/u).slice(0,80)) {
      const words=(fragment.match(/[\p{L}][\p{L}\p{M}'’-]*/gu) || []).filter((word) => word.length <= 35);
      const add=(parts) => {
        while (parts.length && commonGlossaryWords.has(parts[0].toLocaleLowerCase())) parts=parts.slice(1);
        while (parts.length && commonGlossaryWords.has(parts.at(-1).toLocaleLowerCase())) parts=parts.slice(0,-1);
        const term=parts.join(" ").trim();
        if (!term || term.length < 4 || term.length > 120 || parts.length > 6) return;
        const key=term.normalize("NFKC").toLocaleLowerCase();
        if (seen.has(key)) return;
        seen.add(key);
        const previous=counts.get(key);
        if (previous) previous.count++;
        else if (counts.size < 100000) counts.set(key,{term,count:1});
      };
      if (words.length <= 6) add(words);
      else if (expandLong) {
        for (let i=0;i<Math.min(words.length-1,45);i++) {
          if (commonGlossaryWords.has(words[i].toLocaleLowerCase())) continue;
          add(words.slice(i,i+2));
          if (i+2 < words.length) add(words.slice(i,i+3));
        }
      }
    }
  }
  const minimum=Math.max(1,Math.floor(Number(minCount)||1));
  return [...counts.values()].filter((entry) => entry.count >= minimum)
    .sort((a,b) => b.count-a.count || b.term.split(" ").length-a.term.split(" ").length || a.term.localeCompare(b.term))
    .slice(0,Math.min(1000,Math.max(1,Math.floor(Number(limit)||120))));
}

export function parseGlossaryTranslations(text,candidates) {
  const allowed=new Map((candidates || []).map((term) => [fold(term),String(term)]));
  const content=String(text || "").replace(/^```(?:json)?\s*/iu,"").replace(/\s*```$/u,"").trim();
  let parsed;
  try { parsed=JSON.parse(content); }
  catch { return []; }
  const rows=Array.isArray(parsed) ? parsed : parsed?.pairs;
  if (!Array.isArray(rows)) return [];
  const found=new Set();
  return rows.flatMap((row) => {
    const from=allowed.get(fold(row?.from)), to=cleanTerm(row?.to);
    if (!from || !to || to.length > 120 || fold(from) === fold(to) || found.has(fold(from))) return [];
    found.add(fold(from));
    return [{from,to}];
  });
}
