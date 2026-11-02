import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Script} from 'node:vm';
import {StudioNode} from './series-test-dom.mjs';
import {attachStudioNavigation,attachFeatureUpdates,studioNavigationLabels,featureUpdateLanguages,featureUpdatesKey} from './dist/feature-updates.mjs';
StudioNode.prototype.closest=function(selector){for(let n=this;n;n=n.parentElement)if(n.matches(selector))return n;return null;};
const feature=(id,sectionId,launcherId)=>({id,sectionId,launcherId,revision:'1',title:Array(8).fill(id),description:Array(8).fill(id+' help')});
function env(){
 const body=new StudioNode('body'),header=new StudioNode('header'),toolbar=new StudioNode('div');header.className='site-header';toolbar.className='custom-library-toolbar';body.append(header,toolbar);
 const add=(tag,id,parent=body)=>{const n=new StudioNode(tag);n.id=id;parent.append(n);return n;};
 const archive=add('section','media-catalog');add('h2','catalog-title',archive);const query=add('input','catalog-query',archive);query.value='rain';const date=add('input','catalog-date',archive);date.value='2026-10-29';
 const gallery=add('div','catalog-gallery-toolbar',archive),toggle=add('button','catalog-gallery-toggle',gallery),controls=add('div','catalog-gallery-day-controls',gallery);controls.hidden=true;let galleryClicks=0;toggle.addEventListener('click',()=>{galleryClicks++;controls.hidden=!controls.hidden;});
 const coach=add('details','coach');add('summary','coach-title',coach);const studio=add('details','virtual-studio');add('summary','studio-heading',studio);
 const ai=add('dialog','ai-hub-dialog');add('h2','ai-title',ai);const launcher=add('button','ai-hub-open',header);let aiClicks=0;launcher.addEventListener('click',()=>{aiClicks++;ai.showModal();});
 const language=add('select','ui-language');const hidden=add('section','hidden-panel');hidden.hidden=true;
 const data=new Map(),storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)};let lang='HU';
 globalThis.document={body,createElement:tag=>new StudioNode(tag),getElementById:id=>body.all().find(n=>n.id===id),querySelector:q=>body.querySelector(q)};
 globalThis.MutationObserver=class{observe(){}};globalThis.addEventListener=()=>{};globalThis.matchMedia=()=>({matches:false});
 return {body,header,archive,query,date,gallery,controls,coach,studio,ai,language,storage,data,getLanguage:()=>lang,setLanguage:v=>lang=v,galleryClicks:()=>galleryClicks,aiClicks:()=>aiClicks};
}
test('archive shortcut keeps filters/day; gallery opens once; details and AI navigation work',async()=>{
 const e=env(),features=[feature('studio','virtual-studio'),feature('hidden','hidden-panel'),feature('absent','not-present')];const ui=attachStudioNavigation({getLanguage:e.getLanguage,features});
 assert.equal(e.body.children[1].id,'studio-navigation');assert.equal(document.getElementById('studio-archive-shortcut').disabled,false);
 let scroll;e.archive.scrollIntoView=o=>scroll=o;await document.getElementById('studio-archive-shortcut').emit('click');assert.equal(e.query.value,'rain');assert.equal(e.date.value,'2026-10-29');assert.equal(e.galleryClicks(),0);assert.equal(scroll.block,'start');
 assert.equal(ui.navigate('gallery'),true);assert.equal(e.galleryClicks(),1);ui.navigate('gallery');assert.equal(e.galleryClicks(),1,'do not toggle an open gallery back to list');
 assert.equal(ui.navigate('coach'),true);assert.equal(e.coach.open,true);assert.equal(ui.navigate('feature:studio'),true);assert.equal(e.studio.open,true);
 ui.navigate('ai');assert.equal(e.ai.open,true);ui.navigate('ai');assert.equal(e.aiClicks(),1);
 assert.ok(!ui.entries().includes('feature:hidden'));assert.ok(!ui.entries().includes('feature:absent'));assert.equal(ui.navigate('unknown'),false);
 assert.equal(attachStudioNavigation(),null,'install once');assert.equal(e.data.size,0,'navigation never saves NEW dismissals');
});
test('page map shares NEW dismissals/restoration and language state with the existing feature panel',async()=>{
 const e=env(),features=[feature('archive-new','media-catalog'),feature('studio','virtual-studio')];const ui=attachFeatureUpdates({getLanguage:e.getLanguage,storage:e.storage,features});
 const select=document.getElementById('studio-page-map'),option=id=>select.options.find(o=>o.value===id);
 assert.match(option('archive').textContent,/NEW/);assert.match(option('gallery').textContent,/NEW/);assert.match(option('feature:studio').textContent,/NEW/);
 select.value='archive';await select.emit('change');assert.equal(e.storage.getItem(featureUpdatesKey),null);assert.equal(ui.unseen().length,2);
 const dismiss=document.getElementById('feature-updates').querySelector('[data-feature-dismiss="archive-new"]');await dismiss.emit('click');assert.doesNotMatch(option('archive').textContent,/NEW/);assert.doesNotMatch(option('gallery').textContent,/NEW/);assert.match(option('feature:studio').textContent,/NEW/);
 await document.getElementById('feature-updates').querySelector('[data-feature-action="restore"]').emit('click');assert.match(option('archive').textContent,/NEW/);
 e.setLanguage('EN');await e.language.emit('change');assert.equal(select.attributes['aria-label'],'Page map');assert.match(option('archive').textContent,/Media archive/);
 for(const lang of featureUpdateLanguages)assert.ok(Object.values(studioNavigationLabels(lang)).every(v=>typeof v==='string'&&v.trim()));
 assert.equal(e.query.value,'rain');assert.equal(e.date.value,'2026-10-29');
});
test('late-created sections are discovered on opening the map; reduced-motion scrolling is respected',async()=>{
 const e=env();e.archive.remove();const ui=attachStudioNavigation({getLanguage:e.getLanguage,features:[feature('late','late-section')]});assert.equal(document.getElementById('studio-archive-shortcut').disabled,true);
 const late=new StudioNode('details');late.id='late-section';e.body.append(late);await document.getElementById('studio-page-map').emit('focus');assert.ok(ui.entries().includes('feature:late'));
 globalThis.matchMedia=()=>({matches:true});let scroll;late.scrollIntoView=o=>scroll=o;ui.navigate('feature:late');assert.equal(scroll.behavior,'auto');assert.equal(late.open,true);
 const html=readFileSync(new URL('./dist/ArtofTomworks_Prompt_Studio_OFFLINE.html',import.meta.url),'utf8');new Script(html.match(/<script>\s*([\s\S]*?)\s*<\/script>/)[1]);assert.ok(html.includes('studio-page-map'));assert.ok(html.includes('.studio-navigation{position:sticky'));
});
