import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { Readable } from "node:stream";
import { server } from "./local-server.mjs";

const origin = `http://127.0.0.1:${Number(process.env.PROMPT_STUDIO_PORT || 18819)}`;
async function request(method,path,headers={},data) {
  const body = data === undefined ? [] : [Buffer.from(JSON.stringify(data))];
  const req = Readable.from(body);
  req.method = method;
  req.url = path;
  req.headers = { host:new URL(origin).host, ...headers };
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
