import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { Readable } from "node:stream";
import { Script } from "node:vm";
process.env.PROMPT_STUDIO_PORT = "0";
const { server } = await import("./local-server.mjs");

const origin = "http://127.0.0.1:0";
async function request(method,path,headers={},data) {
  const body = data === undefined ? [] : [Buffer.from(JSON.stringify(data))];
  const req = Readable.from(body);
  req.method = method;
  req.url = path;
  req.headers = { host:"127.0.0.1:0", ...headers };
  return new Promise((resolve,reject) => {
    let status;
    const res = {
      writeHead(code) { status=code; },
      end(content) { resolve({ status, body:String(content || "") }); },
      destroy(error) { reject(error || new Error("Response interrupted")); }
    };
    server.emit("request",req,res);
  });
}

try {
  const health = await request("GET","/health");
  assert.equal(health.status,200);
  assert.equal(JSON.parse(health.body).imagePreview,true);
  assert.equal(JSON.parse(health.body).version,"1.20.0");
  const catalog=await request("GET","/api/catalog/status");
  assert.equal(catalog.status,200);
  assert.deepEqual(JSON.parse(catalog.body).roots,[]);
  assert.equal(JSON.parse(catalog.body).indexed,0);
  const page=await request("GET","/");
  assert.equal(page.status,200);
  assert.ok(page.body.includes('<html lang="en">'));
  assert.ok(page.body.includes('<b>1.20.0</b>'));
  const scripts=[...page.body.matchAll(/<script>\s*([\s\S]*?)<\/script>/gu)].map(match=>match[1]);
  assert.ok(scripts.some(source=>source.includes("attachPromptCoach")&&source.includes("promptCopyValue")));
  for(const source of scripts)assert.doesNotThrow(()=>new Script(source));
  const foreign = await request("POST","/api/catalog/open-image",{
    origin:"https://example.invalid", "content-type":"application/json", "x-prompt-studio-action":"open-image"
  },{id:"invalid"});
  assert.equal(foreign.status,403);
  const unapproved = await request("POST","/api/catalog/open-image",{
    origin,"content-type":"application/json"
  },{id:"invalid"});
  assert.equal(unapproved.status,403);
  const missing = await request("POST","/api/catalog/open-image",{
    origin,"content-type":"application/json", "x-prompt-studio-action":"open-image"
  },{id:"invalid"});
  assert.equal(missing.status,409);
  const ui = await readFile(new URL("./dist/media-catalog-ui.mjs",import.meta.url),"utf8");
  assert.match(ui,/id="catalog-show-thumbnails" type="checkbox"/);
  assert.match(ui,/if \(el\("catalog-show-thumbnails"\)\.checked\) \{/);
  assert.match(ui,/image\.src = mediaUrl\(item\)/);
  assert.match(ui,/catalog-image-dialog/);
  console.log("Image preview, private-by-default thumbnails and local-only native-open checks passed.");
} finally {
  await new Promise((resolve) => server.close(resolve));
}
