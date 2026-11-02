import {createSoundWorkshopService} from './sound-workshop-server.mjs';
import {createPoseAssetHandler} from './pose-assets-server.mjs';
import {fileURLToPath} from "node:url";
import {createVideoWorkshopService} from "./video-workshop-server.mjs";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { spawn } from "node:child_process";
import { stat } from "node:fs/promises";
import { extname, isAbsolute } from "node:path";
import { launchInstalledCopilot } from "./copilot-launch.mjs";
import { loadAddonLibrary, addonStatus, addonItems, addAddonRoot, scanAddonLibrary } from "./addon-library.mjs";
import { loadMediaCatalog, catalogStatus, addCatalogRoot, addCatalogCategory, setCatalogAnnotation, startCatalogScan, searchCatalog, searchCreativeMemory, catalogGlossaryCandidates, catalogSentenceCandidates, catalogItem, catalogSettings, catalogHandoff, openCatalogImage, revealCatalogFile, previewCatalogDeletion, deleteCatalogItem, catalogCleanupStatus, catalogCleanupResults, catalogCleanupAutoSelection, previewCatalogCleanupBatch, deleteCatalogCleanupBatch, startCatalogCleanup, cancelCatalogCleanup } from "./media-catalog.mjs";
import { previewCatalogBatch, deleteCatalogBatch } from "./media-catalog.mjs";
import { cancelCatalogScan } from "./media-catalog.mjs";
import { removeCatalogRoot } from "./media-catalog.mjs";

const host = "127.0.0.1";
const port = Number(process.env.PROMPT_STUDIO_PORT || 18819);
const ollama = "http://127.0.0.1:11434";
const page = new URL("./dist/ArtofTomworks_Prompt_Studio_OFFLINE.html", import.meta.url);
const maxBody = 10_000_000;
const launcherText=await readFile(new URL("./Start-Prompt-Studio.ps1",import.meta.url),"utf8").catch(()=> "");
const compatibleVersion=/health\.version\s+-ne\s+['"](\d+(?:\.\d+){1,3})['"]/.exec(launcherText)?.[1]||"1.21.0";
const poseAssets=createPoseAssetHandler();
const videoWorkshop = createVideoWorkshopService({root:fileURLToPath(new URL("./data/video-workshop/",import.meta.url))});
const soundWorkshop=createSoundWorkshopService({root:fileURLToPath(new URL('./data/sound-workshop/',import.meta.url)),samplesRoot:fileURLToPath(new URL('./sound-samples/',import.meta.url)),video:videoWorkshop});
await loadMediaCatalog();
await loadAddonLibrary();
void scanAddonLibrary();

function send(res, status, body, type = "application/json; charset=utf-8") {
  res.writeHead(status, { "Content-Type": type, "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" });
  res.end(body);
}

async function readBody(req) {
  const parts = [];
  let size = 0;
  for await (const part of req) {
    size += part.length;
    if (size > maxBody) throw new Error("Image request is too large");
    parts.push(part);
  }
  return Buffer.concat(parts);
}

async function findWorkflowOrigin() {
  const preferred = Number(process.env.WORKFLOW_STUDIO_PORT || 18779);
  const ports = new Set([preferred,18779,18780,18781,18782,18783,18784,18785]);
  for (const candidate of ports) {
    if (!Number.isInteger(candidate) || candidate < 1 || candidate > 65535) continue;
    const origin = `http://127.0.0.1:${candidate}`;
    try {
      const response = await fetch(`${origin}/health`, { signal:AbortSignal.timeout(1200) });
      if (!response.ok) continue;
      const health = await response.json();
      if (health.app === "ArtofTomworks Workflow Studio" && health.archiveHandoff === true) return origin;
    } catch { /* Another local port may host an older version or no server. */ }
  }
  throw new Error("Indítsd el a friss Workflow Studio-t az Open-Workflow-Studio.cmd fájllal, majd próbáld újra.");
}

export const server = createServer(async (req, res) => {
  const origin = `http://${host}:${port}`;
  if (req.headers.host !== `${host}:${port}` || (req.headers.origin && req.headers.origin !== origin)) {
    send(res, 403, JSON.stringify({ error: "Local access only" }));
    return;
  }
  try {
    const requestUrl = new URL(req.url, origin);
    if(await poseAssets(req,res,requestUrl))return;
    if (await soundWorkshop.handle(req,res,requestUrl,origin)) return;
    if (await videoWorkshop.handle(req,res,requestUrl,origin)) return;
    if (req.method === "GET" && requestUrl.pathname === "/image-workshop") {
      send(res,200,await readFile(new URL("./dist/Image_Workshop.html",import.meta.url)),"text/html; charset=utf-8");return;
    }
    if(req.method==="GET"&&requestUrl.pathname==="/sound-workshop"){send(res,200,await readFile(new URL("./dist/Sound_Workshop.html",import.meta.url)),"text/html; charset=utf-8");return;}
    if (req.method === "GET" && requestUrl.pathname === "/video-workshop") {
      send(res,200,await readFile(new URL("./dist/Video_Workshop.html",import.meta.url)),"text/html; charset=utf-8");return;
    }
    if (req.method === "GET" && (req.url === "/" || req.url === "/index.html")) {
      send(res, 200, await readFile(page), "text/html; charset=utf-8");
      return;
    }
    if (req.method === "GET" && req.url === "/health") {
      send(res, 200, JSON.stringify({ ready:true, lightSphere:true, petPoses:true, poseEstimation:true, videoWorkshop:true, soundWorkshop:true, mediaDeletion:true, mediaFavorites:true, imagePreview:true, videoThumbnails:true, abCompare:true, directorTimeline:true, archiveHandoff:true, recipeCopy:true, glossarySuggestions:true, addonAdvisor:true, cleanupAdvisor:true, cleanupBatch:true, catalogBatch:true, globalClean:true, version:compatibleVersion }));
      return;
    }
    if (req.method === "POST" && requestUrl.pathname === "/api/ai/launch-copilot") {
      if (req.headers.origin !== origin || req.headers["x-prompt-studio-action"] !== "launch-copilot" ||
          !req.headers["content-type"]?.startsWith("application/json")) {
        send(res, 403, JSON.stringify({ error:"Local Prompt Studio only" })); return;
      }
      try {
        if ((await readBody(req)).length > 2) throw new Error("Unexpected request body");
        send(res, 200, JSON.stringify(await launchInstalledCopilot()));
      } catch (cause) {
        send(res, 409, JSON.stringify({ error:String(cause?.message || cause).slice(0,200) }));
      }
      return;
    }
    if (req.method === "POST" && requestUrl.pathname === "/api/tools/launch") {
      if (req.headers.origin !== origin || req.headers["x-prompt-studio-action"] !== "launch-local-tool" ||
          !req.headers["content-type"]?.startsWith("application/json")) {
        send(res, 403, JSON.stringify({ error:"Local Prompt Studio only" })); return;
      }
      try {
        const body=await readBody(req);
        if(body.length>4096)throw Error("Request too large");
        const input=JSON.parse(body.toString("utf8"));
        const target=String(input?.path||"").trim().replace(/^"|"$/g,"");
        if(process.platform!=="win32" || target.startsWith("\\\\") || !isAbsolute(target) ||
            extname(target).toLowerCase()!==".exe" || /[\r\n|<>]/.test(target))
          throw Error("Choose an absolute local .exe file");
        if(!(await stat(target)).isFile())throw Error("Program file not found");
        const child=spawn(target,[],{detached:true,stdio:"ignore",windowsHide:true});
        await new Promise((resolve,reject)=>{child.once("spawn",resolve);child.once("error",reject);});
        child.unref();
        send(res,200,JSON.stringify({ launched:true }));
      } catch(cause) {
        send(res,400,JSON.stringify({ error:String(cause?.message||cause).slice(0,200) }));
      }
      return;
    }
    if (req.method === "GET" && requestUrl.pathname === "/api/addons/status") {
      send(res, 200, JSON.stringify(addonStatus())); return;
    }
    if (req.method === "GET" && requestUrl.pathname === "/api/addons/list") {
      send(res, 200, JSON.stringify(addonItems())); return;
    }
    if (req.method === "POST" && ["/api/addons/roots", "/api/addons/scan"].includes(requestUrl.pathname)) {
      if (req.headers.origin !== origin || req.headers["x-prompt-studio-action"] !== "manage-addons" ||
          !req.headers["content-type"]?.startsWith("application/json")) {
        send(res, 403, JSON.stringify({ error:"Local Prompt Studio only" })); return;
      }
      try {
        const input = JSON.parse((await readBody(req)).toString("utf8"));
        const result = requestUrl.pathname.endsWith("/roots") ? await addAddonRoot(input) : await scanAddonLibrary();
        send(res, 200, JSON.stringify(result));
      } catch (cause) { send(res, 400, JSON.stringify({ error:String(cause?.message || cause).slice(0, 200) })); }
      return;
    }
    if (req.method === "GET" && requestUrl.pathname === "/api/catalog/status") {
      send(res, 200, JSON.stringify(catalogStatus())); return;
    }
    if (req.method === "GET" && requestUrl.pathname === "/api/catalog/cleanup/status") {
      send(res, 200, JSON.stringify(catalogCleanupStatus())); return;
    }
    if (req.method === "GET" && requestUrl.pathname === "/api/catalog/cleanup/results") {
      send(res, 200, JSON.stringify(catalogCleanupResults(requestUrl.searchParams.get("page") || "0"))); return;
    }
    if (req.method === "GET" && requestUrl.pathname === "/api/catalog/cleanup/auto-selection") {
      try { send(res, 200, JSON.stringify(catalogCleanupAutoSelection(requestUrl.searchParams.get("keep") || "rating"))); }
      catch (cause) { send(res, 409, JSON.stringify({ error:String(cause?.message || cause).slice(0,200) })); }
      return;
    }
    if (req.method === "POST" && ["/api/catalog/cleanup/batch-preview", "/api/catalog/cleanup/batch-delete"].includes(requestUrl.pathname)) {
      const preview=requestUrl.pathname.endsWith("preview");
      if (req.headers.origin !== origin ||
          req.headers["x-prompt-studio-action"] !== (preview ? "cleanup-batch-preview" : "cleanup-batch-delete") ||
          !req.headers["content-type"]?.startsWith("application/json")) {
        send(res, 403, JSON.stringify({ error:"Local Prompt Studio only" })); return;
      }
      try {
        const body=await readBody(req);
        if (body.length > 8192) throw new Error("Too many selected files");
        const input=JSON.parse(body.toString("utf8"));
        const result=preview ? await previewCatalogCleanupBatch(input.ids,input.keep) :
          await deleteCatalogCleanupBatch(input.token,input.mode);
        send(res, 200, JSON.stringify(result));
      } catch (cause) { send(res, 409, JSON.stringify({ error:String(cause?.message || cause).slice(0,300) })); }
      return;
    }
    if (req.method === "POST" && ["/api/catalog/cleanup/start", "/api/catalog/cleanup/cancel"].includes(requestUrl.pathname)) {
      if (req.headers.origin !== origin || req.headers["x-prompt-studio-action"] !== "cleanup-review") {
        send(res, 403, JSON.stringify({ error:"Local Prompt Studio only" })); return;
      }
      const changed = requestUrl.pathname.endsWith("/start") ? startCatalogCleanup() : cancelCatalogCleanup();
      send(res, 200, JSON.stringify({ changed, status:catalogCleanupStatus() })); return;
    }
    if (req.method === "GET" && requestUrl.pathname === "/api/catalog/search") {
      send(res, 200, JSON.stringify(searchCatalog({ query:requestUrl.searchParams.get("q") || "",
        kind:requestUrl.searchParams.get("kind") || "", root:requestUrl.searchParams.get("root") || "",
        prompt:requestUrl.searchParams.get("prompt") || "",
        category:requestUrl.searchParams.get("category") || "", rating:requestUrl.searchParams.get("rating") || "0",
        dateFrom:requestUrl.searchParams.get("from") || "", dateTo:requestUrl.searchParams.get("to") || "",
        page:requestUrl.searchParams.get("page") || "0" }))); return;
    }
    if (req.method === "GET" && requestUrl.pathname === "/api/catalog/creative-memory") {
      send(res, 200, JSON.stringify(searchCreativeMemory({ query:requestUrl.searchParams.get("q") || "",
        kind:requestUrl.searchParams.get("kind") || "", model:requestUrl.searchParams.get("model") || "" }))); return;
    }
    if (req.method === "GET" && requestUrl.pathname === "/api/catalog/glossary-candidates") {
      send(res, 200, JSON.stringify(catalogGlossaryCandidates())); return;
    }
    if (req.method === "GET" && requestUrl.pathname === "/api/catalog/sentences") {
      send(res, 200, JSON.stringify(catalogSentenceCandidates(requestUrl.searchParams.get("kind") || ""))); return;
    }
    if (req.method === "POST" && requestUrl.pathname === "/api/translate/word") {
      if (req.headers.origin !== origin || req.headers["x-prompt-studio-action"] !== "translate-word" ||
          !req.headers["content-type"]?.startsWith("application/json")) {
        send(res,403,JSON.stringify({error:"Local Prompt Studio only"})); return;
      }
      try {
        const input=JSON.parse((await readBody(req)).toString("utf8"));
        const key=String(input.key||"").trim(),word=String(input.text||"").trim();
        const source=String(input.source||"").toUpperCase(),target=String(input.target||"").toUpperCase();
        const languages=new Set(["EN","HU","DE","FR","ES","IT","PT","PL"]);
        if(key.length<8||key.length>200||!word||word.length>120||/[\r\n]/u.test(word)||
           !languages.has(source)||!languages.has(target)||source===target) throw new Error("Invalid lookup");
        const endpoint=key.endsWith(":fx")?"https://api-free.deepl.com/v2/translate":"https://api.deepl.com/v2/translate";
        const translated=await fetch(endpoint,{method:"POST",headers:{"Authorization":`DeepL-Auth-Key ${key}`,"Content-Type":"application/json"},
          body:JSON.stringify({text:[word],source_lang:source,target_lang:target}),signal:AbortSignal.timeout(8000)});
        if(!translated.ok)throw new Error("Translation service unavailable");
        const value=String((await translated.json()).translations?.[0]?.text||"").trim();
        if(!value||value.length>120)throw new Error("Empty translation");
        send(res,200,JSON.stringify({translation:value}));
      }catch{send(res,502,JSON.stringify({error:"Translation unavailable"}));}
      return;
    }
    if (req.method === "GET" && requestUrl.pathname === "/api/catalog/settings") {
      try { send(res, 200, JSON.stringify(await catalogSettings(requestUrl.searchParams.get("id") || ""))); }
      catch (error) { send(res, 409, JSON.stringify({ error:String(error.message || error).slice(0,300) })); }
      return;
    }
    if (req.method === "GET" && requestUrl.pathname === "/api/catalog/item") {
      const item=catalogItem(requestUrl.searchParams.get("id")||"");
      send(res,item?200:404,JSON.stringify(item||{error:"Archive item not found"}));return;
    }
    if (req.method === "POST" && requestUrl.pathname === "/api/catalog/workflow-handoff") {
      if (req.headers.origin !== origin || req.headers["x-prompt-studio-action"] !== "workflow-handoff" ||
          !req.headers["content-type"]?.startsWith("application/json")) {
        send(res, 403, JSON.stringify({ error:"Only the local Prompt Studio page may send an archive item" })); return;
      }
      try {
        const input = JSON.parse((await readBody(req)).toString("utf8"));
        const item = await catalogHandoff(input.id);
        const workflowOrigin = await findWorkflowOrigin();
        const handoff = await fetch(`${workflowOrigin}/api/archive-handoff`, {
          method:"POST", headers:{"Content-Type":"application/json","X-Local-Studio-Handoff":"prompt-studio"},
          body:JSON.stringify(item), signal:AbortSignal.timeout(5000)
        });
        const data = await handoff.json();
        if (!handoff.ok || !/^[0-9a-f-]{36}$/.test(data.id || "")) throw new Error(data.error || "Workflow Studio did not accept the item");
        send(res, 200, JSON.stringify({ url:`${workflowOrigin}/?archive=${data.id}` }));
      } catch (error) {
        send(res, 409, JSON.stringify({ error:error?.cause?.code === "ECONNREFUSED"
          ? "Indítsd el a Workflow Studio-t az Open-Workflow-Studio.cmd fájllal, majd próbáld újra."
          : String(error.message || error).slice(0,300) }));
      }
      return;
    }
    if (req.method === "POST" && (requestUrl.pathname === "/api/catalog/categories" || requestUrl.pathname === "/api/catalog/annotation")) {
      if (req.headers.origin !== origin || req.headers["x-prompt-studio-action"] !== "annotate-media" ||
          !req.headers["content-type"]?.startsWith("application/json")) {
        send(res, 403, JSON.stringify({ error:"Only the local Prompt Studio page may change ratings and categories" })); return;
      }
      try {
        const input = JSON.parse((await readBody(req)).toString("utf8"));
        const result = requestUrl.pathname === "/api/catalog/categories"
          ? await addCatalogCategory(input.name) : await setCatalogAnnotation(input.id,input.changes);
        send(res, 200, JSON.stringify(result));
      } catch (error) { send(res, 400, JSON.stringify({ error:String(error.message || error) })); }
      return;
    }
    if (req.method === "POST" && ["/api/catalog/batch-preview", "/api/catalog/batch-delete"].includes(requestUrl.pathname)) {
      const preview=requestUrl.pathname.endsWith("preview");
      if (req.headers.origin !== origin ||
          req.headers["x-prompt-studio-action"] !== (preview ? "catalog-batch-preview" : "catalog-batch-delete") ||
          !req.headers["content-type"]?.startsWith("application/json")) {
        send(res, 403, JSON.stringify({error:"Local Prompt Studio only"})); return;
      }
      try {
        const body=await readBody(req);
        if (body.length>8192) throw new Error("Too many selected files");
        const input=JSON.parse(body.toString("utf8"));
        send(res,200,JSON.stringify(preview ? await previewCatalogBatch(input.ids) : await deleteCatalogBatch(input.token,input.mode)));
      } catch (cause) { send(res,409,JSON.stringify({error:String(cause?.message || cause).slice(0,300)})); }
      return;
    }
    if (req.method === "GET" && requestUrl.pathname === "/api/catalog/delete-preview") {
      try { send(res, 200, JSON.stringify(await previewCatalogDeletion(requestUrl.searchParams.get("id") || ""))); }
      catch (error) { send(res, 409, JSON.stringify({ error:String(error.message || error) })); }
      return;
    }
    if (req.method === "POST" && requestUrl.pathname === "/api/catalog/open-image") {
      if (req.headers.origin !== origin || req.headers["x-prompt-studio-action"] !== "open-image" ||
          !req.headers["content-type"]?.startsWith("application/json")) {
        send(res, 403, JSON.stringify({ error:"Only the local Prompt Studio page may open images" })); return;
      }
      try {
        const input = JSON.parse((await readBody(req)).toString("utf8"));
        send(res, 200, JSON.stringify(await openCatalogImage(input.id)));
      } catch (error) { send(res, 409, JSON.stringify({ error:String(error.message || error) })); }
      return;
    }
    if (req.method === "POST" && requestUrl.pathname === "/api/catalog/reveal-file") {
      if (req.headers.origin !== origin || req.headers["x-prompt-studio-action"] !== "reveal-file" ||
          !req.headers["content-type"]?.startsWith("application/json")) {
        send(res, 403, JSON.stringify({ error:"Only the local Prompt Studio page may open File Explorer" })); return;
      }
      try {
        const input = JSON.parse((await readBody(req)).toString("utf8"));
        send(res, 200, JSON.stringify(await revealCatalogFile(input.id)));
      } catch (error) { send(res, 409, JSON.stringify({ error:String(error.message || error) })); }
      return;
    }
    if (req.method === "POST" && requestUrl.pathname === "/api/catalog/delete") {
      if (req.headers.origin !== origin || req.headers["x-prompt-studio-action"] !== "delete-media" ||
          !req.headers["content-type"]?.startsWith("application/json")) {
        send(res, 403, JSON.stringify({ error:"Deletion requires confirmation in the local Prompt Studio page" })); return;
      }
      try {
        const input = JSON.parse((await readBody(req)).toString("utf8"));
        send(res, 200, JSON.stringify(await deleteCatalogItem(input.id,input.mode)));
      } catch (error) { send(res, 409, JSON.stringify({ error:String(error.message || error) })); }
      return;
    }
    if (req.method === "POST" && requestUrl.pathname === "/api/catalog/roots/remove") {
      if(req.headers.origin!==origin||req.headers["x-prompt-studio-action"]!=="catalog-root-remove"||!req.headers["content-type"]?.startsWith("application/json")){
        send(res,403,JSON.stringify({error:"Local Prompt Studio only"}));return;
      }
      try{
        const body=await readBody(req);if(body.length>2048)throw new Error("Invalid folder path");
        send(res,200,JSON.stringify(await removeCatalogRoot(JSON.parse(body.toString("utf8")).path)));
      }catch(error){send(res,409,JSON.stringify({error:String(error.message||error).slice(0,300)}));}
      return;
    }
    if (req.method === "POST" && requestUrl.pathname === "/api/catalog/roots") {
      if(req.headers.origin!==origin||req.headers["x-prompt-studio-action"]!=="catalog-root"||!req.headers["content-type"]?.startsWith("application/json")){
        send(res,403,JSON.stringify({error:"Local Prompt Studio only"}));return;
      }
      try {
        const input = JSON.parse((await readBody(req)).toString("utf8"));
        send(res, 200, JSON.stringify(await addCatalogRoot(input.path)));
      } catch (error) { send(res, 400, JSON.stringify({ error:String(error.message || error) })); }
      return;
    }
    if (req.method === "POST" && requestUrl.pathname === "/api/catalog/scan") {
      send(res, 202, JSON.stringify({ started:startCatalogScan() })); return;
    }
    if (req.method === "POST" && requestUrl.pathname === "/api/catalog/scan/cancel") {
      if(req.headers.origin!==origin||req.headers["x-prompt-studio-action"]!=="catalog-scan-control"){
        send(res,403,JSON.stringify({error:"Local Prompt Studio only"}));return;
      }
      send(res,200,JSON.stringify({cancelled:cancelCatalogScan()}));return;
    }
    if (req.method === "GET" && requestUrl.pathname === "/api/catalog/media") {
      const item = catalogItem(requestUrl.searchParams.get("id") || "");
      if (!item) { send(res, 404, JSON.stringify({ error:"Not found" })); return; }
      let details;
      try { details = await stat(item.path); }
      catch { send(res, 404, JSON.stringify({ error:"File no longer exists; refresh the catalog" })); return; }
      const mime = { ".png":"image/png", ".jpg":"image/jpeg", ".jpeg":"image/jpeg", ".webp":"image/webp",
        ".mp4":"video/mp4", ".webm":"video/webm", ".mov":"video/quicktime" }[extname(item.path).toLowerCase()] || "application/octet-stream";
      const match = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || "");
      let start = 0, end = details.size - 1;
      if (match) {
        start = match[1] ? Number(match[1]) : Math.max(0,details.size - Number(match[2]));
        end = match[1] && match[2] ? Math.min(end,Number(match[2])) : end;
        if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start >= details.size) {
          res.writeHead(416, { "Content-Range":`bytes */${details.size}` }); res.end(); return;
        }
      }
      res.writeHead(match ? 206 : 200, { "Content-Type":mime, "Content-Length":end-start+1,
        "Accept-Ranges":"bytes", "Cache-Control":"no-store", "X-Content-Type-Options":"nosniff",
        ...(match ? { "Content-Range":`bytes ${start}-${end}/${details.size}` } : {}) });
      createReadStream(item.path,{ start,end }).on("error",() => res.destroy()).pipe(res);
      return;
    }
    if ((req.method === "GET" && req.url === "/api/tags") ||
        (req.method === "POST" && ["/api/chat","/api/show"].includes(req.url) && req.headers["content-type"]?.startsWith("application/json"))) {
      const body = req.method === "POST" ? await readBody(req) : undefined;
      const answer = await fetch(ollama + req.url, {
        method: req.method,
        headers: req.method === "POST" ? { "Content-Type": "application/json" } : undefined,
        body,
        signal: AbortSignal.timeout(300_000)
      });
      send(res, answer.status, Buffer.from(await answer.arrayBuffer()));
      return;
    }
    send(res, 404, JSON.stringify({ error: "Not found" }));
  } catch (error) {
    const status = error?.message === "Image request is too large" ? 413 : 502;
    send(res, status, JSON.stringify({ error: status === 413 ? "Image request is too large" : "Local Ollama is unavailable" }));
  }
});

server.listen(port, host, () => {
  process.stdout.write(`ArtofTomworks local prompt studio: http://${host}:${port}/\n`);
});
