import {readFile,lstat} from 'node:fs/promises';
const poseAssetTypes=new Map([
 ['pose-worker.js','text/javascript; charset=utf-8'],['vision_bundle.js','text/javascript; charset=utf-8'],
 ['wasm/vision_wasm_internal.js','text/javascript; charset=utf-8'],['wasm/vision_wasm_internal.wasm','application/wasm'],
 ['wasm/vision_wasm_nosimd_internal.js','text/javascript; charset=utf-8'],['wasm/vision_wasm_nosimd_internal.wasm','application/wasm'],
 ['pose_landmarker_full.task','application/octet-stream']
]);
export function createPoseAssetHandler(base=new URL('./pose-assets/',import.meta.url)){
 return async(req,res,url)=>{
  if(!url.pathname.startsWith('/pose-assets/'))return false;
  const key=url.pathname.slice('/pose-assets/'.length),type=poseAssetTypes.get(key);
  if(req.method!=='GET'||!type||url.search){res.writeHead(404,{'Content-Type':'text/plain'});res.end('Not found');return true;}
  try{
   // The whitelist disallows path traversal; refuse linked files/directories too.
   for(const part of key.includes('/')?['','wasm/',key]:['',key])if((await lstat(new URL(part,base))).isSymbolicLink())throw Error('linked');
   const data=await readFile(new URL(key,base));res.writeHead(200,{'Content-Type':type,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Cross-Origin-Resource-Policy':'same-origin'});res.end(data);
  }catch{res.writeHead(404,{'Content-Type':'text/plain'});res.end('Pose runtime missing');}
  return true;
 };
}
