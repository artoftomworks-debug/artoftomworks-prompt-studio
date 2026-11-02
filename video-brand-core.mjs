import {imageWorkshopCore} from './dist/image-workshop.mjs';

// Shared timing and portable layer contract; text is rasterized locally, never interpreted as a filter.
export function videoBrandCore(imageFactory=imageWorkshopCore){
 const I=imageFactory(),clone=I.clone,n=I.bounded;
 function normalize(raw=[]){
  if(!Array.isArray(raw)||raw.length>8)throw Error('Maximum 8 branding layers');
  const ids=new Set();let bytes=0;
  return raw.map(b=>{
   if(!b||typeof b.id!=='string'||!b.id||b.id.length>100||ids.has(b.id)||!['text','image'].includes(b.layer?.kind))throw Error('Invalid branding layer');ids.add(b.id);
   const r=b.layer;let logo=null;
   if(r.kind==='image'){
    if(typeof b.logo!=='string'||b.logo.length>1800000||!/^data:image\/png;base64,[A-Za-z0-9+/]+=*$/.test(b.logo))throw Error('Invalid local logo');logo=b.logo;bytes+=logo.length;if(bytes>3500000)throw Error('Branding logos are too large');
   }
   const start=n(b.start,0,1800,0),end=n(b.end,0,1800,0);if(end!==0&&end-start<.04)throw Error('Branding end must follow its start');
   return {id:b.id,enabled:b.enabled!==false,start,end,fadeIn:n(b.fadeIn,0,5,.3),fadeOut:n(b.fadeOut,0,5,.3),logo,
    layer:{...I.layer(r.kind,r.name),...I.brandFields(r),id:b.id,name:String(r.name||'').slice(0,160),x:n(r.x,-2,3,.5),y:n(r.y,-2,3,.5),rotation:n(r.rotation,-180,180,0),opacity:n(r.opacity,0,100,100),visible:true,asset:''}};
  });
 }
 function timing(b,total){const end=b.end===0?total:Math.min(total,b.end),d=Math.max(0,end-b.start);return {start:b.start,end,fadeIn:Math.min(b.fadeIn,d/2),fadeOut:Math.min(b.fadeOut,d/2)};}
 function alpha(b,time,total){const t=timing(b,total);if(!b.enabled||time<t.start||time>=t.end)return 0;return Math.max(0,Math.min(1,t.fadeIn?(time-t.start)/t.fadeIn:1,t.fadeOut?(t.end-time)/t.fadeOut:1));}
 const active=(list,total)=>normalize(list).filter(b=>b.enabled&&b.layer.opacity>0&&timing(b,total).end>b.start);
 function text(words='Your title'){const layer=I.layer('text',words);Object.assign(layer,{words,fontSize:.08,anchor:'bc'});I.snapBrand(layer);return normalize([{id:layer.id,layer,start:0,end:0,fadeIn:.3,fadeOut:.3}])[0];}
 function fromProfile(profile,total){const clean=I.normalizeBrandShelf({version:1,brands:[profile]}).brands[0];return normalize(clean.layers.map(layer=>({id:I.uid(),layer,logo:layer.kind==='image'?clean.logos.find(a=>a.id===layer.asset).data:null,start:0,end:0,fadeIn:.3,fadeOut:.3})));}
 return {normalize,timing,alpha,active,text,fromProfile,clone};
}
