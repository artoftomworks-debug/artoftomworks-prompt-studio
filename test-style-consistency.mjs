import assert from 'node:assert/strict';
import {test} from 'node:test';
import {buildPrompt,promptSectionHeadings} from './dist/engine.mjs';
import {buildSurprisePrompt} from './dist/creative-forge.mjs';
import {styleMediumIntent,mediumBuildState,reconcileStyleMedium} from './dist/style-medium.mjs';
import {qualityPrefixPhrase} from './dist/quality-prefix.mjs';
test('photo portrait generation becomes oil painting without changing subject, scene or framing',()=>{
 const base={mode:'image',outputLanguage:'EN',brief:'An adult violinist beside a window',subject:'A woman holding a photograph of an oil painting',setting:'A quiet blue room',action:'She smiles',qualityPrefix:'proPhoto',photoGenre:'portrait',medium:'photo',style:'cinematic',capture:'digital',cameraModel:'auto',lens:'portrait85',shot:'full',angle:'eye'};
 const intent=styleMediumIntent([{id:'oil',percent:100}]),adapted=mediumBuildState(base,intent),prompt=buildPrompt(adapted);
 assert.equal(adapted.medium,'painting');assert.equal(adapted.artStyle,'oil');assert.equal(adapted.capture,'auto');assert.equal(base.medium,'photo');assert.match(prompt,/layered oil paint/);assert.ok(!prompt.startsWith(qualityPrefixPhrase('proPhoto','EN')));for(const field of ['brief','subject','setting','action','shot','angle'])assert.equal(adapted[field],base[field]);
 const old=buildPrompt(base),fixed=reconcileStyleMedium(old,intent);assert.ok(fixed.changed);assert.match(fixed.prompt,/Subject: A woman holding a photograph of an oil painting/);assert.match(fixed.prompt,/Setting: A quiet blue room/);assert.doesNotMatch(fixed.prompt,/tack-sharp|cinematic photorealism|photorealistic editorial photograph/);assert.equal(reconcileStyleMedium(fixed.prompt,intent).prompt,fixed.prompt);
});
test('all localized generated photo instructions follow an artistic medium and protect scene lines',()=>{
 for(const language of ['EN','HU','DE','FR','ES','IT','PT','PL']){
   const original=buildPrompt({mode:'image',outputLanguage:language,brief:'Scene content unchanged',subject:'Subject content unchanged',qualityPrefix:'proPhoto',photoGenre:'portrait',medium:'photo',style:'editorial'}),fixed=reconcileStyleMedium(original,{kind:'paint',style:'watercolor'},language);
   assert.ok(fixed.changed,language);assert.ok(!fixed.prompt.includes(qualityPrefixPhrase('proPhoto',language)),language);assert.match(fixed.prompt,/Scene content unchanged/);assert.match(fixed.prompt,/Subject content unchanged/);assert.ok(fixed.prompt.includes(qualityPrefixPhrase('creativeArt',language)),language);
   const heading=promptSectionHeadings(language)[1],object=heading+': Photorealistic photograph';assert.equal(reconcileStyleMedium(object,{kind:'paint',style:'oil'},language).prompt,object);
 }
});
test('surprise portrait/glamour photo openings and stored art techniques do not accumulate across switches',()=>{
 for(const theme of ['portrait','glamour'])for(const random of [()=>0,()=>0.5,()=>0.99]){
   const photo=buildSurprisePrompt({theme,random}).prompt,paint=reconcileStyleMedium(photo,{kind:'paint',style:'oil'}).prompt;assert.doesNotMatch(paint,/professional photograph|portrait photography|editorial photography|tack-sharp focus/);assert.ok(paint.includes('adult')||paint.includes('portrait'));
 }
 const oil=buildPrompt({mode:'image',outputLanguage:'EN',brief:'A violinist',qualityPrefix:'creativeArt',medium:'painting',artStyle:'oil'}),water=reconcileStyleMedium(oil,{kind:'paint',style:'watercolor'}).prompt;assert.doesNotMatch(water,/layered oil paint/);assert.match(water,/A violinist/);
 const photo=reconcileStyleMedium(oil,{kind:'photo',style:'glamour'}).prompt;assert.doesNotMatch(photo,/layered oil paint|Expressive, carefully crafted artwork/);assert.match(photo,/photorealistic editorial photograph/);
});
test('intentional hybrid and unknown custom styles do not rewrite the source; unrecognized text is flagged',()=>{
 const source='A photorealistic unusual handmade description of an adult portrait.';
 assert.equal(styleMediumIntent([{id:'oil',percent:100}],true),null);assert.equal(reconcileStyleMedium(source,null).prompt,source);assert.equal(styleMediumIntent([{id:'custom_unknown',percent:100}]),null);
 assert.ok(reconcileStyleMedium(source,{kind:'paint',style:'oil'}).unresolved);const object='Subject: A photograph of a painting inside a frame.';assert.ok(!reconcileStyleMedium(object,{kind:'paint',style:'oil'}).unresolved);
});
