// The factory is self-contained so the same tested code can run in a local editor tab.
export function imageWorkshopCore(){
 const clone=x=>JSON.parse(JSON.stringify(x)),bounded=(x,a,b,d=0)=>Number.isFinite(Number(x))?Math.max(a,Math.min(b,Number(x))):d;
 const toneKeys=['exposure','contrast','shadows','highlights','warmth','saturation'];
 const defaults={exposure:0,contrast:0,shadows:0,highlights:0,warmth:0,saturation:100};
 function tone(raw={}){return Object.fromEntries(toneKeys.map(k=>[k,bounded(raw[k],k==='exposure'?-3:k==='saturation'?0:-100,k==='exposure'?3:k==='saturation'?200:100,defaults[k]) ]));}
 const text=(x,n=160)=>String(x??'').replace(/\u0000/g,'').slice(0,n);
 const uid=()=>globalThis.crypto?.randomUUID?.()||('iw-'+Date.now()+'-'+Math.random().toString(36).slice(2));
 const brandFonts={sans:'Arial, sans-serif',serif:'Georgia, serif',mono:'monospace'};
 const brandAnchors=['tl','tc','tr','ml','mc','mr','bl','bc','br'];
 function brandFields(l={}){if(text(l.words,600).split('\n').length>12)throw Error('format');return {branding:true,words:text(l.words,600),font:Object.hasOwn(brandFonts,l.font)?l.font:'sans',fontSize:bounded(l.fontSize,.01,.25,.045),brandSize:bounded(l.brandSize,.03,.8,.18),bold:l.bold!==false,outline:bounded(l.outline,0,.02,.002),ink:/^#[a-f\d]{6}$/i.test(l.ink)?l.ink:'#ffffff',outlineInk:/^#[a-f\d]{6}$/i.test(l.outlineInk)?l.outlineInk:'#000000',plate:!!l.plate,plateOpacity:bounded(l.plateOpacity,0,100,45),shadow:!!l.shadow,anchor:brandAnchors.includes(l.anchor)?l.anchor:'br',margin:bounded(l.margin,0,.2,.035),repeat:!!l.repeat};}
 function snapBrand(l,anchor=l.anchor){if(!brandAnchors.includes(anchor))throw Error('format');l.anchor=anchor;const a=anchor[1],b=anchor[0],m=l.margin;l.x=a==='l'?m:a==='r'?1-m:.5;l.y=b==='t'?m:b==='b'?1-m:.5;return l;}
 function layer(kind='tone',name=''){
  if(!['tone','light','image','text'].includes(kind))throw Error('format');
  const result={id:uid(),kind,name:text(name)||kind,visible:true,opacity:100,tone:tone(),mask:{all:true,invert:false,feather:1,strokes:[]},x:.5,y:.5,scale:1,rotation:0,radius:.45,color:'#ffd2a1',asset:''};
  return kind==='text'?snapBrand(Object.assign(result,brandFields())):result;
 }
 function normalize(raw){
  if(!raw||raw.version!==1||!Array.isArray(raw.layers)||raw.layers.length>16||!Array.isArray(raw.assets)||raw.assets.length>20)throw Error('format');
  const ids=new Set(),assets=raw.assets.map(a=>{if(!a||typeof a.id!=='string'||!a.id||a.id.length>100||!/^([a-f0-9]{64})$/.test(a.hash)||!Number.isInteger(a.width)||!Number.isInteger(a.height)||a.width<1||a.height<1||a.width*a.height>24000000)throw Error('format');if(ids.has(a.id))throw Error('format');ids.add(a.id);return {id:a.id,name:text(a.name),hash:a.hash,width:a.width,height:a.height};});
  if(raw.source&&!ids.has(raw.source))throw Error('format');
  const lids=new Set();let points=0;
  const layers=raw.layers.map(l=>{if(!l||!['tone','light','image','text'].includes(l.kind)||typeof l.id!=='string'||!l.id||l.id.length>100||lids.has(l.id))throw Error('format');lids.add(l.id);if(l.asset&&!ids.has(l.asset))throw Error('format');const m=l.mask||{};if(!Array.isArray(m.strokes)||m.strokes.length>500)throw Error('format');
   const strokes=m.strokes.map(s=>{if(!['brush','rect','ellipse'].includes(s.kind)||!Array.isArray(s.points)||!s.points.length||s.points.length>4000)throw Error('format');points+=s.points.length;if(points>30000)throw Error('format');return {kind:s.kind,subtract:!!s.subtract,size:bounded(s.size,.002,.5,.05),points:s.points.map(p=>{if(!Array.isArray(p)||p.length!==2||!p.every(Number.isFinite))throw Error('format');return [bounded(p[0],0,1),bounded(p[1],0,1)];})};});
   return {id:l.id,kind:l.kind,name:text(l.name)||l.kind,visible:l.visible!==false,opacity:bounded(l.opacity,0,100,100),tone:tone(l.tone),mask:{all:m.all!==false,invert:!!m.invert,feather:bounded(m.feather,0,40,1),strokes},x:bounded(l.x,-2,3,.5),y:bounded(l.y,-2,3,.5),scale:bounded(l.scale,.05,6,1),rotation:bounded(l.rotation,-180,180),radius:bounded(l.radius,.05,2,.45),color:/^#[a-f\d]{6}$/i.test(l.color)?l.color:'#ffd2a1',asset:text(l.asset,100),...(l.kind==='text'||(l.kind==='image'&&l.branding===true)?brandFields(l):{})};
  });
  const used=new Set([raw.source,...layers.filter(l=>l.kind==='image').map(l=>l.asset)]),required=assets.filter(a=>used.has(a.id));
  if(required.reduce((n,a)=>n+a.width*a.height,0)>48000000)throw Error('size');
  return {version:1,name:text(raw.name)||'Image workshop',source:text(raw.source,100),assets:required,layers,scene:text(raw.scene,6000),goal:text(raw.goal,2000),notes:text(raw.notes,2000),draft:raw.draft==null?null:text(raw.draft,12000)};
 }
 const fresh=()=>({version:1,name:'Image workshop',source:'',assets:[],layers:[layer('tone','')],scene:'',goal:'',notes:'',draft:null});
 function history(initial){let present=normalize(initial),past=[],future=[];return {get:()=>clone(present),retainedAssets:()=>new Set([present,...past,...future].flatMap(p=>p.assets.map(a=>a.id))),canUndo:()=>!!past.length,canRedo:()=>!!future.length,preview:v=>{present=normalize(v);return clone(present);},commit:(v,before=present)=>{const n=normalize(v),b=normalize(before);if(JSON.stringify(n)!==JSON.stringify(b)){past.push(clone(b));if(past.length>35)past.shift();future=[];}present=n;return clone(n);},undo:()=>{if(past.length){future.push(present);present=past.pop();}return clone(present);},redo:()=>{if(future.length){past.push(present);present=future.pop();}return clone(present);},reset:v=>{present=normalize(v);past=[];future=[];return clone(present);}};}
 function pixel(r,g,b,t){
  const exposure=2**t.exposure,contrast=2**(t.contrast/65),luma=(.2126*r+.7152*g+.0722*b)/255;
  const shift=t.shadows*.9*(1-luma)**3+t.highlights*.9*luma**3;
  let a=[r,g,b].map((v,i)=>((v*exposure+shift-127.5)*contrast+127.5)+(i===0?t.warmth*.38:i===2?-t.warmth*.38:0));
  const y=.2126*a[0]+.7152*a[1]+.0722*a[2];return a.map(v=>bounded(y+(v-y)*t.saturation/100,0,255));
 }
 function toneBuffer(data,t){
  const ev=2**t.exposure,con=2**(t.contrast/65),sat=t.saturation/100,warm=t.warmth*.38;
  for(let i=0;i<data.length;i+=4){const r=data[i],g=data[i+1],b=data[i+2],y=(.2126*r+.7152*g+.0722*b)/255,shift=t.shadows*.9*(1-y)**3+t.highlights*.9*y**3;
   const rr=(r*ev+shift-127.5)*con+127.5+warm,gg=(g*ev+shift-127.5)*con+127.5,bb=(b*ev+shift-127.5)*con+127.5-warm,l=.2126*rr+.7152*gg+.0722*bb;
   data[i]=Math.max(0,Math.min(255,l+(rr-l)*sat));data[i+1]=Math.max(0,Math.min(255,l+(gg-l)*sat));data[i+2]=Math.max(0,Math.min(255,l+(bb-l)*sat));
  }return data;
 }
 function previewSize(w,h){if(!Number.isInteger(w)||!Number.isInteger(h)||w<1||h<1||w*h>24000000||w>16000||h>16000)throw Error('size');const s=Math.min(1,1600/w,1100/h);return {width:Math.max(1,Math.round(w*s)),height:Math.max(1,Math.round(h*s))};}
 function prompt(raw){const p=normalize(raw),parts=[];if(p.draft!==null)return p.draft;
  for(const l of p.layers.filter(l=>l.visible&&l.opacity>0)){
   if(l.branding)continue; // Output typography/logos are not instructions for a generator.
   const local=l.mask.all&&!l.mask.invert?'Across the image':`In the manually selected region (${l.name})`;
   if(l.kind==='tone'){const t=Object.fromEntries(toneKeys.map(k=>[k,defaults[k]+(l.tone[k]-defaults[k])*l.opacity/100])),terms=[];if(t.exposure>.12)terms.push(t.exposure>1?'brighter exposure':'slightly brighter exposure');if(t.exposure<-.12)terms.push('lower exposure');if(Math.abs(t.contrast)>5)terms.push(t.contrast>0?'stronger tonal contrast':'softer tonal contrast');if(Math.abs(t.shadows)>5)terms.push(t.shadows>0?'open, gently lifted shadows':'deeper shadows');if(Math.abs(t.highlights)>5)terms.push(t.highlights>0?'brighter highlights':'restrained highlights with retained detail');if(Math.abs(t.warmth)>5)terms.push(t.warmth>0?'warmer colour balance':'cooler colour balance');if(Math.abs(t.saturation-100)>5)terms.push(t.saturation>100?'richer colours':'restrained colour saturation');if(terms.length)parts.push(local+': '+terms.join(', ')+'.');}
   else if(l.kind==='light')parts.push(`${local}: a soft ${l.color} light accent from the ${l.x<.4?'left':l.x>.6?'right':'centre'}, ${l.y<.4?'above':l.y>.65?'below':'at subject level'}, with ${l.opacity<35?'subtle':l.opacity>70?'strong':'moderate'} intensity and broad, feathered falloff.`);
   else parts.push(`${local}: reference composite layer "${l.name}"; describe its desired content explicitly for generation.`);
  }
  return [p.scene.trim(),parts.join('\n')].filter(Boolean).join('\n\n');
 }
 function aiBrief(raw){const p=normalize(raw);return ['Help refine this visual direction. Keep the scene idea. Treat the edits below as visual intent, not exact generator parameters. Do not invent model compatibility or claim that a mask transfers through text.',p.goal?`Creator goal: ${p.goal}`:'',prompt(p),p.notes?`Creator review / what worked or failed: ${p.notes}`:'','Suggest the next controlled test and explain the changes briefly.'].filter(Boolean).join('\n\n');}
 function feedback(raw){const p=normalize(raw);return {version:1,at:Date.now(),name:p.name,goal:p.goal,notes:p.notes,prompt:prompt(p)};}
 const lookShelfKey='artoftomworks.v2.imageWorkshop.looks';
 function normalizeLook(raw){
  if(!raw||raw.version!==1||typeof raw.id!=='string'||!raw.id||raw.id.length>100||typeof raw.name!=='string'||!raw.name.trim()||!Array.isArray(raw.layers)||!raw.layers.length||raw.layers.length>16)throw Error('format');
  const layers=raw.layers.map((s,i)=>{
   if(!s||!['tone','light'].includes(s.kind))throw Error('format');
   const l=layer(s.kind,text(s.name)||s.kind);l.id='look-layer-'+i;l.opacity=bounded(s.opacity,0,100,100);l.tone=tone(s.tone);l.x=bounded(s.x,-2,3,.5);l.y=bounded(s.y,-2,3,.5);l.radius=bounded(s.radius,.05,2,.45);l.color=/^#[a-f\d]{6}$/i.test(s.color)?s.color:'#ffd2a1';
   // Recipes deliberately exclude source assets, local masks and creator text.
   return l;
  });
  return {version:1,id:text(raw.id,100),name:text(raw.name.trim()),at:bounded(raw.at,0,Number.MAX_SAFE_INTEGER),layers};
 }
 function captureLook(raw,name){const p=normalize(raw);return normalizeLook({version:1,id:uid(),name,at:Date.now(),layers:p.layers.filter(l=>l.visible&&l.opacity>0&&['tone','light'].includes(l.kind))});}
 function applyLook(raw,recipe,{strength=100,replace=true}={}){
  const p=normalize(raw),r=normalizeLook(recipe),amount=bounded(strength,0,100,100)/100;
  if(replace)p.layers=p.layers.filter(l=>l.kind==='image'||l.kind==='text');
  if(p.layers.length+r.layers.length>16)throw Error('limit');
  p.layers.push(...r.layers.map(l=>({...clone(l),id:uid(),opacity:Math.round(l.opacity*amount*100)/100})));
  return normalize(p);
 }
 function builtinLooks(){
  const make=(id,values,lights=[])=>{const l=layer('tone',id);l.tone=tone(values);return normalizeLook({version:1,id:'builtin:'+id,name:id,at:0,layers:[l,...lights.map(s=>Object.assign(layer('light',id),s))]});};
  return [make('natural',{contrast:6,shadows:10,highlights:-12,saturation:98}),
   make('portrait',{contrast:-6,shadows:16,highlights:-18,warmth:8,saturation:96},[{x:.25,y:.2,opacity:12,radius:.65,color:'#ffe2c1'}]),
   make('rainCafe',{exposure:-.08,contrast:12,shadows:8,highlights:-24,warmth:-5,saturation:88},[{x:.8,y:.3,opacity:14,radius:.5,color:'#ffcb8a'}]),
   make('product',{exposure:.1,contrast:9,shadows:12,highlights:-25,saturation:102},[{x:.3,y:.18,opacity:12,radius:.8,color:'#fff4e8'}]),
   make('night',{exposure:-.15,contrast:16,shadows:-8,highlights:-20,warmth:-10,saturation:85},[{x:.15,y:.25,opacity:14,radius:.7,color:'#9bcaff'},{x:.85,y:.5,opacity:12,radius:.35,color:'#ffc27d'}])];
 }
 function imageStatistics(data){let weight=0,sum=0,low=0,high=0;for(let i=0;i+3<data.length;i+=4){const a=bounded(data[i+3],0,255)/255;if(!a)continue;const l=(.2126*data[i]+.7152*data[i+1]+.0722*data[i+2])/255;weight+=a;sum+=l*a;if(l<.14)low+=a;if(l>.9)high+=a;}if(!weight)throw Error('empty');return {mean:sum/weight,low:low/weight,high:high/weight};}
 function recommendedLook(stats){
  if(!stats||!['mean','low','high'].every(k=>Number.isFinite(stats[k])&&stats[k]>=0&&stats[k]<=1))throw Error('format');
  const l=layer('tone','suggested');l.tone=tone({exposure:Math.round(bounded(Math.log2(.42/Math.max(.08,stats.mean))*.35,-.45,.65)*100)/100,contrast:4,shadows:stats.low>.3?14:6,highlights:stats.high>.1?-25:-10,saturation:100});
  return normalizeLook({version:1,id:'builtin:suggested',name:'suggested',at:0,layers:[l]});
 }
 function normalizeShelf(raw){
  if(!raw||raw.version!==1||!Array.isArray(raw.looks)||raw.looks.length>24)throw Error('format');
  const looks=raw.looks.map(normalizeLook);if(new Set(looks.map(l=>l.id)).size!==looks.length)throw Error('format');return {version:1,looks};
 }
 function readShelf(storage){const raw=storage.getItem(lookShelfKey);return {raw,value:raw===null?{version:1,looks:[]}:normalizeShelf(JSON.parse(raw))};}
 function writeShelf(storage,expected,next){const value=normalizeShelf(next);if(storage.getItem(lookShelfKey)!==expected)throw Error('conflict');const raw=JSON.stringify(value);storage.setItem(lookShelfKey,raw);return {raw,value};}
 function importLooks(current,incoming){const a=normalizeShelf(current),b=normalizeShelf(incoming);return normalizeShelf({version:1,looks:[...a.looks,...b.looks.map(l=>({...l,id:uid(),at:Date.now()}))]});}
 const brandShelfKey='artoftomworks.v2.imageWorkshop.brands';
 function brandSamples(labels={},size={width:1600,height:900}){
  const w=bounded(size.width,1,16000,1600),h=bounded(size.height,1,16000,900),unit=Math.min(w,h);
  function make(name,words,style={}){const l=Object.assign(layer('text',name),brandFields({words,...style}),style);l.words=text(words,600);l.mask={all:true,invert:false,feather:0,strokes:[]};
   const length=Math.max(1,...l.words.split('\n').map(line=>[...line].length));l.fontSize=bounded(Math.min(l.fontSize,w/unit*.82/(length*.7)),.01,.25,.04);return l;}
  const name=labels.starterText||'Your name',website='example.com';
  return [
   {id:'signature',name:labels.sampleSignature||'Discreet signature',layers:[make(labels.sampleSignature,name,{x:.95,y:.95,anchor:'br',font:'serif',fontSize:.042,bold:false,opacity:65,outline:.001,shadow:true})]},
   {id:'cinema',name:labels.sampleCinema||'Cinematic title',layers:[make(labels.sampleCinema,labels.sampleStory||'A STORY IN LIGHT',{x:.5,y:.81,anchor:'bc',font:'serif',fontSize:.11,ink:'#ffe5b7',outline:.001,shadow:true}),make(labels.sampleCinema,labels.sampleSubtitle||'A moment worth remembering',{x:.5,y:.94,anchor:'bc',fontSize:.032,bold:false,outline:.001,shadow:true})]},
   {id:'portfolio',name:labels.samplePortfolio||'Elegant portfolio',layers:[make(labels.samplePortfolio,'STUDIO',{x:.05,y:.05,anchor:'tl',font:'mono',fontSize:.055,plate:true,plateOpacity:65,outline:0}),make(labels.samplePortfolio,name,{x:.05,y:.95,anchor:'bl',font:'serif',fontSize:.045,bold:false,outline:.001,shadow:true}),make(labels.samplePortfolio,website,{x:.95,y:.95,anchor:'br',fontSize:.027,outline:.001,shadow:true})]},
   {id:'advert',name:labels.sampleAdvert||'Promotional card',layers:[make(labels.sampleAdvert,labels.sampleHeadline||'YOUR NEXT IDEA',{x:.06,y:.07,anchor:'tl',fontSize:.085,plate:true,plateOpacity:55,outline:0}),make(labels.sampleAdvert,labels.sampleMessage||'Your short message goes here',{x:.06,y:.28,anchor:'tl',fontSize:.035,bold:false,plate:true,plateOpacity:55,outline:0}),make(labels.sampleAdvert,(labels.sampleAction||'Discover more')+' · '+website,{x:.06,y:.94,anchor:'bl',fontSize:.031,plate:true,plateOpacity:75,outline:0})]},
   {id:'quote',name:labels.sampleQuote||'Atmospheric quote',layers:[make(labels.sampleQuote,labels.sampleQuoteText||'Make room\nfor the unexpected.',{x:.5,y:.5,anchor:'mc',font:'serif',fontSize:.073,bold:false,plate:true,plateOpacity:55,outline:0})]},
   {id:'preview',name:labels.samplePreview||'Preview watermark',layers:[make(labels.samplePreview,labels.samplePreviewText||'PREVIEW',{x:.5,y:.5,anchor:'mc',fontSize:.11,opacity:22,outline:0,rotation:-28,repeat:true})]}
  ];
 }
 function applyBrandSample(raw,id,labels,{replace=true}={}){
  const p=normalize(raw),source=p.assets.find(a=>a.id===p.source);if(!source)throw Error('assets');
  const sample=brandSamples(labels,source).find(s=>s.id===id);if(!sample)throw Error('format');
  if(replace)p.layers=p.layers.filter(l=>!l.branding);if(p.layers.length+sample.layers.length>16)throw Error('limit');
  p.layers.push(...sample.layers.map(l=>({...clone(l),id:uid()})));return normalize(p);
 }
 function normalizeBrandShelf(raw){
  if(!raw||raw.version!==1||!Array.isArray(raw.brands)||raw.brands.length>12)throw Error('format');
  const seen=new Set();const brands=raw.brands.map(b=>{
   if(!b||typeof b.id!=='string'||!b.id||b.id.length>100||seen.has(b.id)||!String(b.name||'').trim()||!Array.isArray(b.logos)||b.logos.length>8||!Array.isArray(b.layers)||!b.layers.length||b.layers.length>8)throw Error('format');seen.add(b.id);
   const logoIds=new Set(),logos=b.logos.map(a=>{if(!a||typeof a.id!=='string'||!a.id||a.id.length>100||logoIds.has(a.id)||typeof a.data!=='string'||a.data.length>1800000||!/^data:image\/png;base64,[A-Za-z0-9+/]+=*$/.test(a.data))throw Error('format');logoIds.add(a.id);return {id:a.id,data:a.data,name:text(a.name)};});
   const layers=b.layers.map(a=>{if(!a||!['text','image'].includes(a.kind)||!a.branding||(a.kind==='image'&&!logoIds.has(a.asset)))throw Error('format');return {...layer(a.kind,a.name),...brandFields(a),id:uid(),opacity:bounded(a.opacity,0,100,100),rotation:bounded(a.rotation,-180,180),x:bounded(a.x,-2,3,.5),y:bounded(a.y,-2,3,.5),asset:a.kind==='image'?a.asset:'',mask:{all:true,invert:false,feather:0,strokes:[]}};});
   return {id:b.id,name:text(b.name.trim()),logos,layers};
  });if(JSON.stringify(brands).length>3500000)throw Error('size');return {version:1,brands};
 }
 function writeBrandShelf(storage,expected,next){const data=normalizeBrandShelf(next);if(storage.getItem(brandShelfKey)!==expected)throw Error('conflict');const raw=JSON.stringify(data);storage.setItem(brandShelfKey,raw);return {raw,value:data};}
 function readBrandShelf(storage){const raw=storage.getItem(brandShelfKey);return {raw,value:raw===null?{version:1,brands:[]}:normalizeBrandShelf(JSON.parse(raw))};}
 function zipFiles(files){
  if(!Array.isArray(files)||!files.length||files.length>20)throw Error('size');const encoder=new TextEncoder(),parts=[],central=[],names=new Set();let offset=0,total=0;
  const word=(n,size)=>{const a=new Uint8Array(size);for(let i=0;i<size;i++)a[i]=(n>>>(8*i))&255;return a;};
  const table=new Uint32Array(256);for(let a=0;a<256;a++){let c=a;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xedb88320:0);table[a]=c;}
  const crc=data=>{let c=0xffffffff;for(let i=0;i<data.length;i++)c=(c>>>8)^table[(c^data[i])&255];return (c^0xffffffff)>>>0;};
  for(const file of files){if(!(file.data instanceof Uint8Array)||typeof file.name!=='string'||names.has(file.name)||['.','..'].includes(file.name)||/[:\\/\u0000-\u001f]/.test(file.name))throw Error('format');names.add(file.name);total+=file.data.length;if(total>134217728)throw Error('size');const name=encoder.encode(file.name);if(!name.length||name.length>400)throw Error('format');const checksum=crc(file.data),size=file.data.length;
   const head=[word(0x04034b50,4),word(20,2),word(0x800,2),word(0,2),word(0,2),word(33,2),word(checksum,4),word(size,4),word(size,4),word(name.length,2),word(0,2),name];parts.push(...head,file.data);
   central.push(word(0x02014b50,4),word(20,2),word(20,2),word(0x800,2),word(0,2),word(0,2),word(33,2),word(checksum,4),word(size,4),word(size,4),word(name.length,2),word(0,2),word(0,2),word(0,2),word(0,2),word(0,4),word(offset,4),name);offset+=30+name.length+size;
  }
  const centralSize=central.reduce((n,a)=>n+a.length,0);return [...parts,...central,word(0x06054b50,4),word(0,2),word(0,2),word(files.length,2),word(files.length,2),word(centralSize,4),word(offset,4),word(0,2)];
 }
 return {clone,bounded,toneKeys,defaults,tone,uid,layer,normalize,fresh,history,pixel,toneBuffer,previewSize,prompt,aiBrief,feedback,lookShelfKey,normalizeLook,captureLook,applyLook,builtinLooks,imageStatistics,recommendedLook,normalizeShelf,readShelf,writeShelf,importLooks,brandFields,brandFonts,brandAnchors,snapBrand,brandShelfKey,normalizeBrandShelf,readBrandShelf,writeBrandShelf,zipFiles,brandSamples,applyBrandSample};
}

export function imageWorkshopRenderer(makeCanvas,core){
 const work=makeCanvas(),mask=makeCanvas(),temporary=makeCanvas();
 function drawBrand(x,l,w,h,asset){
  const unit=Math.min(w,h),fontSize=l.fontSize*unit,pad=.012*unit,lines=l.words.split('\n').slice(0,12);x.font=`${l.bold?'700':'400'} ${fontSize}px ${core.brandFonts[l.font]}`;
  const textWidth=Math.max(0,...lines.map(s=>x.measureText?.(s).width??s.length*fontSize*.6));
  const bw=l.kind==='image'?l.brandSize*unit:textWidth+pad*2,bh=l.kind==='image'?bw*asset.height/asset.width:lines.length*fontSize*1.25+pad*2;
  const dx=l.anchor[1]==='l'?0:l.anchor[1]==='r'?-bw:-bw/2,dy=l.anchor[0]==='t'?0:l.anchor[0]==='b'?-bh:-bh/2;
  function paint(px,py){x.save();x.translate(px,py);x.rotate(l.rotation*Math.PI/180);x.translate(dx,dy);
   if(l.shadow){x.shadowColor='#000000b3';x.shadowBlur=.008*unit;x.shadowOffsetX=.003*unit;x.shadowOffsetY=.003*unit;}
   if(l.kind==='image')x.drawImage(asset,0,0,bw,bh);
   else{
    if(l.plate){x.save();x.shadowColor='transparent';x.globalAlpha*=l.plateOpacity/100;x.fillStyle=l.outlineInk;x.fillRect(0,0,bw,bh);x.restore();}
    x.font=`${l.bold?'700':'400'} ${fontSize}px ${core.brandFonts[l.font]}`;x.textAlign='left';x.textBaseline='top';x.lineJoin='round';x.lineWidth=l.outline*unit;x.strokeStyle=l.outlineInk;x.fillStyle=l.ink;
    lines.forEach((line,i)=>{const y=pad+i*fontSize*1.25;if(l.outline>0)x.strokeText(line,pad,y);x.fillText(line,pad,y);});
   }x.restore();
  }
  if(l.repeat){const sx=Math.max(unit*.22,bw*1.6,w/20),sy=Math.max(unit*.18,bh*2,h/16);let count=0;for(let y=(l.y*h)%sy-sy;y<h+sy&&count<512;y+=sy)for(let a=(l.x*w)%sx-sx;a<w+sx&&count<512;a+=sx){paint(a,y);count++;}}
  else paint(l.x*w,l.y*h);
  return {width:bw,height:bh,dx,dy};
 }
 function prepare(c,w,h){if(c.width!==w)c.width=w;if(c.height!==h)c.height=h;const x=c.getContext('2d',{willReadFrequently:true});x.setTransform(1,0,0,1,0,0);x.globalAlpha=1;x.globalCompositeOperation='source-over';x.filter='none';x.clearRect(0,0,w,h);return x;}
 function drawMask(m,w,h){const x=prepare(mask,w,h);if(m.all){x.fillStyle='#fff';x.fillRect(0,0,w,h);}for(const s of m.strokes){x.globalCompositeOperation=s.subtract?'destination-out':'source-over';x.fillStyle=x.strokeStyle='#fff';x.lineWidth=s.size*Math.min(w,h);x.lineCap=x.lineJoin='round';const a=s.points[0],b=s.points.at(-1);x.beginPath();if(s.kind==='brush'){x.moveTo(a[0]*w,a[1]*h);if(s.points.length===1){x.arc(a[0]*w,a[1]*h,x.lineWidth/2,0,Math.PI*2);x.fill();}else{for(const p of s.points.slice(1))x.lineTo(p[0]*w,p[1]*h);x.stroke();}}else if(s.kind==='rect')x.fillRect(Math.min(a[0],b[0])*w,Math.min(a[1],b[1])*h,Math.abs(b[0]-a[0])*w,Math.abs(b[1]-a[1])*h);else{x.ellipse((a[0]+b[0])*w/2,(a[1]+b[1])*h/2,Math.abs(b[0]-a[0])*w/2,Math.abs(b[1]-a[1])*h/2,0,0,Math.PI*2);x.fill();}}
  if(m.invert){const t=prepare(temporary,w,h);t.fillStyle='#fff';t.fillRect(0,0,w,h);t.globalCompositeOperation='destination-out';t.drawImage(mask,0,0);x.globalCompositeOperation='copy';x.drawImage(temporary,0,0);}
  if(m.feather>0){const t=prepare(temporary,w,h);t.filter=`blur(${m.feather*Math.min(w,h)/1000}px)`;t.drawImage(mask,0,0);x.globalCompositeOperation='copy';x.drawImage(temporary,0,0);}x.globalCompositeOperation='source-over';return mask;
 }
 function render(canvas,raw,assets,{full=false,original=false}={}){
  const p=core.normalize(raw),src=assets.get(p.source);if(!src)throw Error('assets');const size=full?{width:src.width,height:src.height}:core.previewSize(src.width,src.height),{width:w,height:h}=size;
  const out=prepare(canvas,w,h);out.drawImage(src,0,0,w,h);if(original)return size;
  for(const l of p.layers){if(!l.visible||l.opacity<=0)continue;const x=prepare(work,w,h);
   if(l.kind==='tone'){if(core.toneKeys.every(k=>l.tone[k]===core.defaults[k]))continue;x.drawImage(canvas,0,0);const pixels=x.getImageData(0,0,w,h);core.toneBuffer(pixels.data,l.tone);x.putImageData(pixels,0,0);}
   else if(l.kind==='light'){const r=l.radius*Math.max(w,h),g=x.createRadialGradient(l.x*w,l.y*h,0,l.x*w,l.y*h,r);g.addColorStop(0,l.color);g.addColorStop(1,l.color+'00');x.fillStyle=g;x.fillRect(0,0,w,h);}
   else if(l.kind==='text'||l.branding){const asset=l.kind==='image'?assets.get(l.asset):null;if(l.kind==='image'&&!asset)throw Error('assets');drawBrand(x,l,w,h,asset);}
   else {const asset=assets.get(l.asset);if(!asset)throw Error('assets');const s=Math.max(w/asset.width,h/asset.height)*l.scale;x.translate(l.x*w,l.y*h);x.rotate(l.rotation*Math.PI/180);x.drawImage(asset,-asset.width*s/2,-asset.height*s/2,asset.width*s,asset.height*s);x.setTransform(1,0,0,1,0,0);}
   if(!l.mask.all||l.mask.invert||l.mask.strokes.length){const m=drawMask(l.mask,w,h);x.globalCompositeOperation='destination-in';x.drawImage(m,0,0);}
   out.globalAlpha=l.opacity/100;out.globalCompositeOperation=l.kind==='light'?'screen':'source-over';out.drawImage(work,0,0);
  }out.globalAlpha=1;out.globalCompositeOperation='source-over';return size;
 }
 function overlay(canvas,layer){if(!layer)return;const x=canvas.getContext('2d');x.save();x.globalAlpha=.25;x.fillStyle='#42e8d4';x.globalCompositeOperation='source-over';const m=drawMask(layer.mask,canvas.width,canvas.height),c=prepare(work,canvas.width,canvas.height);c.fillStyle='#42e8d4';c.fillRect(0,0,canvas.width,canvas.height);c.globalCompositeOperation='destination-in';c.drawImage(m,0,0);x.drawImage(work,0,0);x.restore();}
 return {render,overlay,drawMask,drawBrand};
}
