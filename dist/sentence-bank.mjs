export function collectSentenceCandidates(records,{kind="",limit=40,minCount=2}={}) {
  const counts=new Map();
  for(const record of (Array.isArray(records)?records:[]).slice(0,100000)) {
    if(kind && record?.kind!==kind) continue;
    const prompt=String(record?.prompt||"").slice(0,6000).replace(/<lora:[^>]*>/giu," ");
    const seen=new Set();
    for(const segment of prompt.split(/[.!?;\n\r]+/u).slice(0,80)) {
      const text=segment.replace(/\s+/gu," ").trim().replace(/^[,\s]+|[,\s]+$/gu,"");
      if(text.length<25 || text.length>220 || text.split(/\s+/u).length<5 || /[<>\[\]{}]/u.test(text)) continue;
      const key=text.normalize("NFKC").toLocaleLowerCase();
      if(seen.has(key)) continue;
      seen.add(key);
      const previous=counts.get(key);
      if(previous) previous.count++;
      else if(counts.size<50000) counts.set(key,{text,count:1});
    }
  }
  return [...counts.values()].filter((row)=>row.count>=minCount)
    .sort((a,b)=>b.count-a.count || a.text.localeCompare(b.text))
    .slice(0,Math.min(100,Math.max(1,Math.floor(limit))));
}
