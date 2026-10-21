import assert from "node:assert/strict";
import { creativeMemoryTerms, rankCreativeMemory } from "./media-catalog.mjs";

assert.deepEqual(creativeMemoryTerms("A beautiful masterpiece: alvó rókakölykök by moonlight"),["alvo","rokakolykok","moonlight"]);

const items=[
  {id:"fox",kind:"image",filename:"foxes.png",prompt:"Two sleeping fox cubs curled in moonlight under pine trees",model:"Krea",modified:"2026-10-20"},
  {id:"owl",kind:"image",filename:"owl.png",prompt:"An owl in snowy moonlight and deep pine trees",model:"Other",modified:"2026-10-19"},
  {id:"video",kind:"video",filename:"foxes.mp4",prompt:"Two sleeping fox cubs breathe under pine trees at night",model:"LTX",modified:"2026-10-18"},
  {id:"favorite",kind:"image",filename:"unrelated.png",prompt:"A waterfall flows across tropical stones",model:"Krea",modified:"2026-10-21"},
  {id:"unknown",kind:"image",filename:"fox-cubs.png",prompt:"",model:"",modified:"2026-10-21"}
];
const annotate=(item)=>({rating:item.id==="favorite"?5:item.id==="fox"?4:0,category:item.id==="fox"?"Nature":""});
const imageMatches=rankCreativeMemory(items,"masterpiece, sleeping fox cubs under pine trees, moonlight",{kind:"image",model:"Krea",annotate});
assert.deepEqual(imageMatches.map((item)=>item.id),["fox","owl"]);
assert.equal(imageMatches[0].rating,4);
assert.equal(imageMatches[0].category,"Nature");
assert.deepEqual(rankCreativeMemory(items,"sleeping fox cubs under pine trees",{kind:"video"}).map((item)=>item.id),["video"]);
assert.deepEqual(rankCreativeMemory(items,"masterpiece professional ultra detailed",{annotate}),[]);
assert.deepEqual(rankCreativeMemory(items,"",{annotate}),[]);
console.log("Creative memory ranks relevant archived prompts, respects media type, ignores generic quality words, and never surfaces unrelated favorites.");
