import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { recommendPromptStructure, collectCompletionTerms, completionMatches, buildCoachDraft, inspectPrompt } from "./dist/prompt-coach.mjs";

test("frequent saved structure is recommended only with repeated evidence", () => {
  const entries = [
    {mode:"video",prompt:"A dancer, in a studio, turns slowly, wide camera shot, soft lighting, cinematic style"},
    {mode:"video",prompt:"A bird, in a forest, flies, close camera shot, golden lighting, photorealistic style"},
    {mode:"video",prompt:"A train, on a street, moves, tracking camera shot, sunset lighting, cinematic style"},
    {mode:"image",prompt:"A house, by the beach, soft lighting"}
  ];
  const result = recommendPromptStructure(entries,"video");
  assert.equal(result.learned,true);
  assert.equal(result.count,3);
  assert.equal(result.matches,3);
  assert.deepEqual(result.order,["subject","setting","action","camera","lighting","style"]);
  assert.equal(recommendPromptStructure(entries,"image").learned,false);
});

test("typing suggestions use saved prompts, glossary and archive without altering text", () => {
  const terms = collectCompletionTerms(
    [{language:"EN",prompt:"cinematic lighting, slow camera movement"}],
    [{source:"EN",target:"HU",from:"cinematic blue hour",to:"filmes kék óra"}],
    [{term:"cinematic portrait",count:10}],"EN");
  const original = "A scene with cinem";
  const hits = completionMatches(original,original.length,terms);
  assert.ok(hits.some((hit) => hit.term === "cinematic blue hour" && hit.source === "glossary"));
  assert.ok(hits.some((hit) => hit.source === "saved"));
  assert.ok(hits.some((hit) => hit.source === "archive"));
  assert.equal(original,"A scene with cinem");
  assert.deepEqual(completionMatches("a",1,terms),[]);
});

test("guide skips unanswered steps and structure draft retains editable placeholders", () => {
  assert.equal(buildCoachDraft(["subject","action","camera"],{subject:"zebra",camera:"wide shot"},"EN",false),"zebra, wide shot.");
  assert.equal(buildCoachDraft(["subject","action"],{},"HU"),"[téma / szereplő], [történés vagy változtatás].");
  assert.equal(buildCoachDraft(["subject"],{},"EN",false),"");
});

test("prompt checker detects competing instructions without making an automatic edit", () => {
  const camera=inspectPrompt("A dancer walks on a street, locked camera, camera orbits, soft lighting","video","EN");
  assert.equal(camera.primary,"lockedMotion");
  assert.equal(camera.draft,"");
  const audio=inspectPrompt("A woman walks down a street, silent scene with music, one continuous shot, cut to a closeup","video","EN");
  assert.ok(audio.issues.includes("silentAudio"));
  assert.ok(audio.issues.includes("oneShotCut"));
  assert.equal(inspectPrompt("A dancer walks, static camera, no zoom","video","EN").issues.includes("lockedMotion"),false);
  assert.equal(inspectPrompt("A dancer walks, locked camera, camera rotates","video","EN").issues.includes("lockedMotion"),true);
  assert.equal(inspectPrompt("A dancer walks, silent, no music","video","EN").issues.includes("silentAudio"),false);
});

test("prompt checker flags strong photo/art and day/night conflicts conservatively", () => {
  const art=inspectPrompt("Two foxes, photorealistic editorial photograph, watercolor painting, soft light","image","EN");
  assert.ok(art.issues.includes("photoArt"));
  assert.equal(art.draft,"", "a conflict must not silently rewrite the prompt");
  assert.equal(inspectPrompt("Two foxes, photorealistic editorial photograph, not a painting","image","EN").issues.includes("photoArt"),false);
  assert.ok(inspectPrompt("Two foxes, bright daylight and a night scene","image","EN").issues.includes("dayNight"));
  assert.equal(inspectPrompt("Two foxes, bright daylight, then a night scene","video","EN").issues.includes("dayNight"),false);
  assert.ok(inspectPrompt("Két róka, erős nappali fény, éjszakai jelenet","image","HU").issues.includes("dayNight"));
});

test("prompt checker suggests only an editable placeholder for a missing video action", () => {
  const original="A dancer on a street";
  const result=inspectPrompt(original,"video","EN");
  assert.equal(result.primary,"missingAction");
  assert.ok(result.draft.startsWith(original));
  assert.ok(result.draft.includes("⟦action or change⟧"));
  assert.ok(inspectPrompt("Keep the subject recognizable, change the background","i2i","EN").issues.every((code)=>code!=="missingEdit"));
  assert.ok(inspectPrompt("Make the dress blue instead of red","i2i","EN").issues.every((code)=>code!=="missingEdit"));
  assert.ok(inspectPrompt("A portrait of a woman in a studio, soft lighting","image","EN").issues.every((code)=>code!=="missingSubject"));
});

test("offline bundle contains a syntactically valid prompt coach", () => {
  const html=readFileSync(new URL("./dist/ArtofTomworks_Prompt_Studio_OFFLINE.html",import.meta.url),"utf8");
  const script=[...html.matchAll(/<script>\s*([\s\S]*?)<\/script>/gu)].map(match=>match[1]).find(source=>source.includes("attachPromptCoach"));
  assert.ok(script?.includes("attachPromptCoach"));
  assert.ok(script?.includes("coach-guide-review"));
  assert.ok(script?.includes("guideLoraMatches"));
  assert.doesNotThrow(()=>new vm.Script(script));
});

