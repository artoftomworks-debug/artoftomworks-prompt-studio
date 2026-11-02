export function audioTimingCore(){
 const fps=value=>Number.isFinite(Number(value))&&Number(value)>=1&&Number(value)<=120?Number(value):24;
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,Number.isFinite(Number(v))?Number(v):a));
 function step(value,direction,rate,from=0,to=1800,snap=false){const f=fps(rate),v=clamp(value,from,to);return Number(clamp((snap?Math.round(v*f):v*f)+Math.sign(direction),from*f,to*f)/f).toFixed(9)*1;}
 function align(sound,cue,time){if(!sound||![sound.in,sound.out,cue,time].every(Number.isFinite)||cue<sound.in||cue>sound.out||time<0)throw Error('range');const at=time-(cue-sound.in);if(at< -1e-8||at>1800)throw Error('negative');return Number(Math.max(0,at).toFixed(9));}
 function wave(raw){if(!raw||!Array.isArray(raw.peaks)||raw.peaks.length!==1024||raw.peaks.some(v=>!Number.isFinite(v)||v<0||v>1)||!Number.isFinite(raw.from)||raw.from<0||!Number.isFinite(raw.duration)||raw.duration<=0||raw.duration>7200)throw Error('wave');return raw;}
 return {fps,clamp,step,align,wave};
}
