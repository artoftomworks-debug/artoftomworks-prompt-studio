import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const file = (name) => join(root, "dist", name);
const html = readFileSync(file("index.html"), "utf8");
const css = readFileSync(file("style.css"), "utf8");
const imageDirection = readFileSync(file("image-direction.mjs"), "utf8").replace(/^export /gm, "");
const productionLook = readFileSync(file("production-look.mjs"), "utf8").replace(/^export /gm, "");
const qualityPrefix = readFileSync(file("quality-prefix.mjs"), "utf8").replace(/^export /gm, "");
const customChoices = readFileSync(file("custom-choices.mjs"), "utf8").replace(/^export /gm, "");
const engine = readFileSync(file("engine.mjs"), "utf8")
  .replace(/^import \{[^}]+\} from "\.\/image-direction\.mjs";\r?\n/, "")
  .replace(/^import \{[^}]+\} from "\.\/production-look\.mjs";\r?\n/, "")
  .replace(/^import \{[^}]+\} from "\.\/quality-prefix\.mjs";\r?\n/, "")
  .replace(/^export /gm, "");
const i2vEngine = readFileSync(file("i2v-engine.mjs"), "utf8").replace(/^export /gm, "");
const cameraMotion = readFileSync(file("camera-motion.mjs"), "utf8").replace(/^export /gm, "");
const soundEffects = readFileSync(file("sound-effects.mjs"), "utf8").replace(/^export /gm, "");
const translationGlossary = readFileSync(file("translation-glossary.mjs"), "utf8").replace(/^export /gm, "");
const bilingualEditor = readFileSync(file("bilingual-editor.mjs"), "utf8")
  .replace(/^import \{[^}]+\} from "\.\/translation-glossary\.mjs";\r?\n/, "")
  .replace(/^export /gm, "");
const i2iEngine = readFileSync(file("i2i-engine.mjs"), "utf8").replace(/^export /gm, "");
const metadata = readFileSync(file("image-metadata.mjs"), "utf8").replace(/^export /gm, "");
const modeContinuity = readFileSync(file("mode-continuity.mjs"), "utf8").replace(/^export /gm, "");
const promptMedia = readFileSync(file("prompt-media.mjs"), "utf8").replace(/^export /gm, "");
const promptLibrary = readFileSync(file("prompt-library.mjs"), "utf8")
  .replace(/^import \{[^}]+\} from "\.\/prompt-media\.mjs";\r?\n/, "")
  .replace(/^export /gm, "");
const catalogCompare = readFileSync(file("catalog-compare.mjs"), "utf8").replace(/^export /gm, "");
const creativeForge = "const { attachSurprisePrompt, mixArchivedPrompts } = (() => {\n" +
  readFileSync(file("creative-forge.mjs"), "utf8").replace(/^export /gm, "") +
  "\nreturn { attachSurprisePrompt, mixArchivedPrompts };\n})();";
const negativeAdvisor = readFileSync(file("negative-advisor.mjs"), "utf8").replace(/^export /gm, "");
const mediaCatalogUi = readFileSync(file("media-catalog-ui.mjs"), "utf8")
  .replace(/^import \{[^}]+\} from "\.\/catalog-compare\.mjs";\r?\n/, "")
  .replace(/^import \{[^}]+\} from "\.\/creative-forge\.mjs";\r?\n/, "")
  .replace(/^export /gm, "");
const directorEngine = readFileSync(file("director-engine.mjs"), "utf8").replace(/^export /gm, "");
const promptCoach = readFileSync(file("sentence-bank.mjs"), "utf8").replace(/^export /gm, "") + "\n" +
  readFileSync(file("prompt-coach.mjs"), "utf8")
    .replace(/^import \{[^}]+\} from "\.\/sentence-bank\.mjs";\r?\n/gm, "")
    .replace(/^export /gm, "");
const addonAdvisor = "const attachAddonAdvisor = (() => {\n" + readFileSync(file("addon-advisor.mjs"), "utf8").replace(/^export /gm, "") + "\nreturn attachAddonAdvisor;\n})();";
const directorUi = readFileSync(file("director-ui.mjs"), "utf8")
  .replace(/^import \{[^}]+\} from "\.\/director-engine\.mjs";\r?\n/, "")
  .replace(/^export /gm, "");
const i2vUi = readFileSync(file("i2v-ui.mjs"), "utf8")
  .replace(/^import \{[^}]+\} from "\.\/i2v-engine\.mjs";\r?\n/, "")
  .replace(/^import \{[^}]+\} from "\.\/camera-motion\.mjs";\r?\n/, "")
  .replace(/^import \{[^}]+\} from "\.\/sound-effects\.mjs";\r?\n/, "")
  .replace(/^import \{[^}]+\} from "\.\/bilingual-editor\.mjs";\r?\n/, "")
  .replace(/^import \{[^}]+\} from "\.\/image-direction\.mjs";\r?\n/, "")
  .replace(/^import \{[^}]+\} from "\.\/production-look\.mjs";\r?\n/, "")
  .replace(/^import \{[^}]+\} from "\.\/quality-prefix\.mjs";\r?\n/, "")
  .replace(/^import \{[^}]+\} from "\.\/custom-choices\.mjs";\r?\n/, "")
  .replace(/^export /gm, "");
const i2iUi = readFileSync(file("i2i-ui.mjs"), "utf8")
  .replace(/^import \{[^}]+\} from "\.\/i2i-engine\.mjs";\r?\n/, "")
  .replace(/^import \{[^}]+\} from "\.\/bilingual-editor\.mjs";\r?\n/, "")
  .replace(/^import \{[^}]+\} from "\.\/image-direction\.mjs";\r?\n/, "")
  .replace(/^import \{[^}]+\} from "\.\/production-look\.mjs";\r?\n/, "")
  .replace(/^import \{[^}]+\} from "\.\/quality-prefix\.mjs";\r?\n/, "")
  .replace(/^import \{[^}]+\} from "\.\/custom-choices\.mjs";\r?\n/, "")
  .replace(/^export /gm, "");
const app = readFileSync(file("app.mjs"), "utf8")
  .replace(/^import \{[^}]+\} from "\.\/engine\.mjs";\r?\n/, "")
  .replace(/^import \{[^}]+\} from "\.\/image-metadata\.mjs";\r?\n/, "")
  .replace(/^import \{[^}]+\} from "\.\/i2v-ui\.mjs";\r?\n/, "")
  .replace(/^import \{[^}]+\} from "\.\/i2i-ui\.mjs";\r?\n/, "")
  .replace(/^import \{[^}]+\} from "\.\/bilingual-editor\.mjs";\r?\n/, "")
  .replace(/^import \{[^}]+\} from "\.\/image-direction\.mjs";\r?\n/, "")
  .replace(/^import \{[^}]+\} from "\.\/production-look\.mjs";\r?\n/, "")
  .replace(/^import \{[^}]+\} from "\.\/quality-prefix\.mjs";\r?\n/, "")
  .replace(/^import \{[^}]+\} from "\.\/custom-choices\.mjs";\r?\n/, "")
  .replace(/^import \{[^}]+\} from "\.\/mode-continuity\.mjs";\r?\n/, "")
  .replace(/^import \{[^}]+\} from "\.\/prompt-library\.mjs";\r?\n/, "")
  .replace(/^import \{[^}]+\} from "\.\/media-catalog-ui\.mjs";\r?\n/, "")
  .replace(/^import \{[^}]+\} from "\.\/director-ui\.mjs";\r?\n/, "")
  .replace(/^import \{[^}]+\} from "\.\/prompt-coach\.mjs";\r?\n/, "");
const appBundled = app.replace(/^import \{[^}]+\} from "\.\/addon-advisor\.mjs";\r?\n/, "")
  .replace(/^import \{[^}]+\} from "\.\/creative-forge\.mjs";\r?\n/, "")
  .replace(/^import \{[^}]+\} from "\.\/negative-advisor\.mjs";\r?\n/, "");
if (appBundled.startsWith("import ") || i2vUi.startsWith("import ") || i2iUi.startsWith("import ") || html.includes("</style>")) {
  throw new Error("Unexpected source layout; offline build stopped.");
}
const output = html
  .replace('  <link rel="stylesheet" href="./style.css">\n', "  <style>\n" + css + "\n  </style>\n")
  .replace('  <script type="module" src="./app.mjs"></script>\n', "")
.replace("</body>", "  <script>\n" + imageDirection + "\n" + productionLook + "\n" + qualityPrefix + "\n" + customChoices + "\n" + engine + "\n" + i2vEngine + "\n" + cameraMotion + "\n" + soundEffects + "\n" + translationGlossary + "\n" + bilingualEditor + "\n" + modeContinuity + "\n" + "\nconst attachPromptCoach = (() => {\n" + promptCoach + "\nreturn attachPromptCoach;\n})();\nconst attachPromptLibrary = (() => {\n" + promptMedia + "\n" + promptLibrary + "\nreturn attachPromptLibrary;\n})();\nconst attachDirectorTimeline = (() => {\n" + directorEngine + "\n" + directorUi + "\nreturn attachDirectorTimeline;\n})();\n" + catalogCompare + "\n" + creativeForge + "\n" + negativeAdvisor + "\n" + mediaCatalogUi + "\n" + addonAdvisor + "\n" + metadata + "\n" + i2vUi + "\nconst attachImageToImage = (() => {\n" + i2iEngine + "\n" + i2iUi + "\nreturn attachImageToImage;\n})();\n" + appBundled + "\n  </script>\n</body>");
if (output.includes('src="./app.mjs"') || !output.includes("function recommendResolution")) {
  throw new Error("Offline bundle validation failed.");
}
writeFileSync(file("ArtofTomworks_Prompt_Studio_OFFLINE.html"), output, "utf8");
console.log("Offline HTML built.");
