import assert from 'node:assert/strict';
import {test} from 'node:test';
import {attachCreativeRecipes,attachCreativeStyleMixers,creativeRecipeLabels} from './dist/creative-recipes-ui.mjs';
import {createCreativeRecipeStore,creativeRecipeKey} from './dist/creative-recipes.mjs';
import {creativePromptFor,creativeMixSectionFor,loadCreativeMixSection,splitCreativePrompt} from './dist/prompt-mix-section.mjs';
import {buildSurprisePrompt} from './dist/creative-forge.mjs';
class Element{
 constructor(tag){this.tagName=tag.toUpperCase();this.children=[];this.dataset={};this.handlers={};this.value='';this.textContent='';this.hidden=false;this.open=false;this.className='';this.attributes={};this.parentElement=null;}
 append(...nodes){for(const node of nodes){node.remove();node.parentElement=this;this.children.push(node);}}
 insertBefore(node,before){node.remove();node.parentElement=this;this.children.splice(this.children.indexOf(before),0,node);}
 after(node){const parent=this.parentElement;node.remove();node.parentElement=parent;parent.children.splice(parent.children.indexOf(this)+1,0,node);}
 remove(){if(this.parentElement)this.parentElement.children=this.parentElement.children.filter(x=>x!==this);this.parentElement=null;}
 replaceChildren(...nodes){this.children.forEach(x=>x.parentElement=null);this.children=[];this.append(...nodes);}
 setAttribute(key,value){this.attributes[key]=value;}
 addEventListener(type,fn){(this.handlers[type]??=[]).push(fn);}
 dispatchEvent(event){for(const fn of this.handlers[event.type]||[])fn(event);return true;}
 async emit(type){for(const fn of this.handlers[type]||[])await fn({type});}
 matches(selector){if(selector.startsWith('#'))return this.id===selector.slice(1);if(selector.startsWith('.'))return this.className.split(' ').includes(selector.slice(1));if(selector.startsWith('[data-')){const match=selector.match(/^\[data-([\w-]+)(?:="([^"]*)")?\]$/);if(!match)return false;const key=match[1].replace(/-([a-z])/g,(_,x)=>x.toUpperCase());return key in this.dataset&&(match[2]===undefined||this.dataset[key]===match[2]);}return this.tagName===selector.toUpperCase();}
 all(){return this.children.flatMap(x=>[x,...x.all()]);}
 querySelectorAll(selector){return this.all().filter(x=>x.matches(selector));}querySelector(selector){return this.querySelectorAll(selector)[0]||null;}
 closest(selector){return this.matches(selector)?this:this.parentElement?.closest(selector)||null;}
 get options(){return this.children;}focus(){}scrollIntoView(){}showModal(){this.open=true;}close(){this.open=false;}click(){this.dispatchEvent({type:'click'});}
}
function environment(storage){
 const body=new Element('body'),header=new Element('div');header.className='header-right';body.append(header);
 const result=new Element('aside');result.className='result-column';const workbench=new Element('section');workbench.id='prompt-workbench';body.append(result);result.append(workbench);
 for(const key of ['style','surprise-model','i2i-medium','i2v-model','workbench-draft','workbench-negative']){const wrapper=new Element('div');wrapper.className='field';const field=new Element('input');field.id=key;wrapper.append(field);(key.startsWith('workbench')?workbench:body).append(wrapper);}
 const language=new Element('select');language.id='ui-language';body.append(language);
 const doc={body,createElement:tag=>new Element(tag),getElementById:id=>body.all().find(x=>x.id===id)||null,querySelector:selector=>body.querySelector(selector),handlers:{},addEventListener(type,fn){(this.handlers[type]??=[]).push(fn);},dispatchEvent(event){for(const fn of this.handlers[event.type]||[])fn(event);return true;}};
 globalThis.document=doc;globalThis.localStorage=storage;globalThis.Option=class extends Element{constructor(label,value){super('option');this.textContent=label;this.value=value;}};
 globalThis.confirm=()=>true;globalThis.Event=class{constructor(type,detail={}){this.type=type;Object.assign(this,detail);}};globalThis.CustomEvent=globalThis.Event;
 Object.defineProperty(globalThis,'navigator',{configurable:true,value:{clipboard:{writeText:async value=>{doc.clipboard=value;}}}});
 return doc;
}
const storage=()=>{const data=new Map();return {data,getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)};};

test('trial bench handoff opens the existing recipe editor and saves notes only after explicit review',async()=>{
 const memory=storage(),doc=environment(memory),ui=attachCreativeRecipes({getLanguage:()=> 'HU',getCurrent:()=>({prompt:''}),restore:()=>{}});
 ui.openTrialCapture({filename:'winner.png',kind:'image',prompt:'A calm portrait.',settings:{},origins:[{role:'lighting',title:'Trial bench · planned lighting',sourceId:'',filename:'winner.png',model:''}]},{title:'Bevált ablakfény',worked:'Szép tónusok. PLANNED seed: 42',avoid:'Túl sötét háttér'});
 assert.equal(createCreativeRecipeStore(memory).list().length,0);const dialog=doc.body.querySelector('.creative-recipe-dialog'),field=key=>dialog.querySelector('[data-cr-field="'+key+'"]');assert.equal(dialog.open,true);assert.equal(field('name').value,'Bevált ablakfény');assert.match(field('worked').value,/PLANNED/);await dialog.querySelectorAll('[data-cr-text="save"]').find(x=>x.tagName==='BUTTON').emit('click');const saved=createCreativeRecipeStore(memory).list()[0];assert.equal(saved.title,'Bevált ablakfény');assert.equal(saved.avoid,'Túl sötét háttér');assert.equal(saved.recipe.settings.seed,undefined);
});
test('viewer capture, selective reuse, workbench handoff and restart persistence work together',async()=>{
 const memory=storage(),doc=environment(memory);let lang='HU',restored;
 const current={prompt:'A café at dusk.',negative:'blur',mode:'image'};
 const ui=attachCreativeRecipes({getLanguage:()=>lang,getCurrent:()=>current,restore:x=>restored=x,buildPassport:()=>({text:'Recipe passport'})});
 ui.openCapture({id:'source123',filename:'cafe.png',kind:'image',prompt:'A café at dusk. Amber light.',negative:'blur',settings:{seed:0}});
 const dialog=doc.body.querySelector('.creative-recipe-dialog'),field=key=>dialog.querySelector('[data-cr-field="'+key+'"]');
 assert.ok(dialog.open);field('name').value='Bevált esti fény';field('role').value='lighting';field('fragment').value='Soft amber window lighting.';field('worked').value='Szép fények';field('avoid').value='A háttérben ne legyen merev alak';
 await dialog.querySelectorAll('[data-cr-text="save"]').find(x=>x.tagName==='BUTTON').emit('click');assert.ok(!dialog.open);
 assert.equal(createCreativeRecipeStore(memory).list()[0].recipe.settings.seed,0);
 const root=doc.getElementById('creative-recipes'),get=key=>root.querySelector('[data-cr-field="'+key+'"]');
 get('route').value='new';get('scene').value='A library in snowfall.';await root.querySelector('[data-cr-text="build"]').emit('click');
 assert.match(get('draft').value,/library/);assert.match(get('draft').value,/amber/);assert.doesNotMatch(get('draft').value,/café|merev alak/);
 assert.ok(root.querySelector('.cr-builder').querySelector('.cr-experience').all().some(x=>x.textContent.includes('merev alak')));
 await root.querySelector('[data-cr-text="copy"]').emit('click');assert.equal(doc.clipboard,get('draft').value);
 let handoff;doc.addEventListener('prompt-studio-workbench-load',event=>handoff=event.detail);await root.querySelector('[data-cr-text="workbench"]').emit('click');assert.equal(handoff.prompt,get('draft').value);
 await root.querySelector('[data-cr-text="use"]').emit('click');assert.equal(restored.prompt,get('draft').value);
 const surprise={prompt:'A station at midnight.',negative:'watermark'};assert.equal(ui.enhanceSurprise(surprise),surprise,'saved details are opt-in for surprises');
 const optIn=root.querySelectorAll('input').find(x=>x.type==='checkbox'&&x.parentElement.parentElement===root);optIn.checked=true;
 const enhanced=ui.enhanceSurprise(surprise);assert.match(enhanced.prompt,/amber/);assert.doesNotMatch(enhanced.prompt,/café|merev alak/);assert.equal(enhanced.provenance[0].filename,'cafe.png');assert.equal(enhanced.negative,'watermark');optIn.checked=false;
 for(const code of ['EN','HU','DE','FR','ES','IT','PT','PL']){lang=code;doc.getElementById('ui-language').dispatchEvent({type:'change'});assert.equal(root.querySelector('[data-cr-text="title"]').textContent,creativeRecipeLabels(code).title);}
 environment(memory);const reloaded=attachCreativeRecipes({getLanguage:()=> 'HU',getCurrent:()=>current,restore:()=>{}});assert.ok(reloaded);assert.equal(document.getElementById('creative-recipes').querySelector('.cr-card').querySelector('strong').textContent,'Bevált esti fény');
 assert.ok(memory.getItem(creativeRecipeKey));
});
test('style selections, saved mixtures, explicit draft application and reload are usable',async()=>{
 const memory=storage(),doc=environment(memory);let draft='Original image prompt',changed=0;
 let mixer=attachCreativeStyleMixers({getLanguage:()=> 'HU',onChange:()=>changed++,getDraft:()=>draft,setDraft:(_,value)=>draft=value});
 const root=doc.body.querySelector('[data-style-mixer="classic"]'),rows=root.querySelectorAll('.cr-mix-row');
 rows[0].children[0].value='glamour';await rows[0].children[0].emit('change');
 rows[1].children[0].value='scifi';await rows[1].children[0].emit('change');
 rows[2].children[0].value='noir';await rows[2].children[0].emit('change');const share=rows[2].querySelector('[data-mix-field="share-2"]');share.value='10';await share.emit('input');
 assert.match(mixer.text(),/Glamour.*Sci-fi.*Film noir/);assert.equal(mixer.getMix()[2].weight,'accent');assert.equal(draft,'Original image prompt');assert.ok(changed>=3);
 const actions=root.querySelector('.cr-actions');actions.children[1].value='Glamour city';await actions.children[2].emit('click');
 environment(memory);mixer=attachCreativeStyleMixers({getLanguage:()=> 'HU',getDraft:()=>draft,setDraft:(_,value)=>draft=value});assert.equal(mixer.getMix().length,3);
 const work=document.body.querySelector('[data-style-mixer="workbench"]'),preset=work.querySelector('.cr-actions').children[0];preset.value='0';await preset.emit('change');
 await work.querySelector('[data-mix-action="copy-full"]').emit('click');assert.match(document.clipboard,/Visual direction mix/);assert.equal(draft,'Original image prompt','mix changes do not rewrite the scene');
 const before=document.clipboard;await work.querySelector('[data-mix-action="copy-full"]').emit('click');assert.equal(document.clipboard,before,'same mix is not duplicated on repeated copying');
});

test('custom styles, percentage controls and independent lights work in video and survive a reload',async()=>{
 const memory=storage(),doc=environment(memory);let draft='Rain falls through a neon-lit street.';
 let mixer=attachCreativeStyleMixers({getLanguage:()=> 'HU',getDraft:()=>draft,setDraft:(_,value)=>draft=value});
 const root=doc.body.querySelector('[data-style-mixer="i2v"]'),custom=root.querySelector('.cr-custom-styles'),f=key=>custom.querySelector('[data-mix-field="'+key+'"]');
 f('customName').value='Álomköd';f('description').value='Dreamlike mist, luminous edges and layered transparent geometry.';
 await custom.querySelector('[data-mix-action="save-custom"]').emit('click');
 const id=f('custom').value;assert.match(id,/^custom_/);
 const rows=root.querySelectorAll('.cr-mix-row');rows[0].children[0].value=id;await rows[0].children[0].emit('change');rows[1].children[0].value='cyberpunk';await rows[1].children[0].emit('change');
 const slider=rows[1].querySelector('[data-mix-field="share-1"]');slider.value='60';await slider.emit('input');assert.deepEqual(mixer.getMix('i2v').map(x=>x.percent),[40,60]);
 const fill=root.querySelector('[data-mix-field="light-fill"]'),rim=root.querySelector('[data-mix-field="light-rim"]');fill.value='25';await fill.emit('input');rim.value='80';await rim.emit('input');
 assert.equal(mixer.getLights('i2v').fill,25);assert.equal(mixer.getLights('i2v').rim,80);assert.equal(mixer.getLights('i2v').key,0);
 assert.match(mixer.text('i2v'),/Dreamlike mist/);assert.match(mixer.text('i2v'),/60%.*Cyberpunk/);assert.match(mixer.text('i2v'),/25\/100/);assert.match(mixer.text('i2v'),/80\/100/);
 await root.querySelector('[data-mix-action="copy-full"]').emit('click');assert.match(doc.clipboard,/Rain falls/);assert.match(doc.clipboard,/Dreamlike mist/);assert.equal(draft,'Rain falls through a neon-lit street.');
 rim.value='20';await rim.emit('input');await root.querySelector('[data-mix-action="copy-full"]').emit('click');assert.equal((doc.clipboard.match(/Visual direction mix/g)||[]).length,1);assert.equal((doc.clipboard.match(/Lighting direction/g)||[]).length,1);assert.doesNotMatch(doc.clipboard,/80\/100/);
 const actions=root.querySelector('.cr-actions');actions.children[1].value='Cyber mist video';await actions.children[2].emit('click');
 environment(memory);mixer=attachCreativeStyleMixers({getLanguage:()=> 'HU',getDraft:()=>draft,setDraft:(_,value)=>draft=value});assert.deepEqual(mixer.getMix('i2v').map(x=>x.percent),[40,60]);assert.equal(mixer.getLights('i2v').rim,20);assert.match(mixer.text('i2v'),/Dreamlike mist/);
 const classic=document.body.querySelector('[data-style-mixer="classic"]'),preset=classic.querySelector('.cr-actions').children[0];preset.value='0';await preset.emit('change');assert.equal(mixer.getLights('classic').rim,20);assert.equal(mixer.getMix('classic')[0].id,id);
 const search=classic.querySelector('[data-mix-field="search"]');search.value='szürrealizmus';await search.emit('input');const optionNames=classic.querySelector('.cr-mix-row').children[0].options.map(x=>x.textContent);assert.ok(optionNames.includes('Surrealism'));assert.ok(!optionNames.includes('Oil painting'));
});

test('custom style removal cleans every scope and preset; failed writes preserve previous choices',async()=>{
 const memory=storage(),doc=environment(memory);const mixer=attachCreativeStyleMixers({getLanguage:()=> 'EN'}),root=doc.body.querySelector('[data-style-mixer="classic"]'),custom=root.querySelector('.cr-custom-styles'),f=key=>custom.querySelector('[data-mix-field="'+key+'"]');
 f('customName').value='Quiet geometry';f('description').value='Calm geometric planes.';await custom.querySelector('[data-mix-action="save-custom"]').emit('click');const id=f('custom').value;
 const select=root.querySelector('.cr-mix-row').children[0];select.value=id;await select.emit('change');assert.match(mixer.text(),/Calm geometric/);
 memory.setItem=()=>{throw Error('quota');};select.value='surreal';await select.emit('change');assert.equal(mixer.getMix()[0].id,id);assert.match(root.querySelector('.cr-status').textContent,/Could not complete/);
 memory.setItem=(k,v)=>memory.data.set(k,v);await custom.querySelector('[data-mix-action="remove-custom"]').emit('click');assert.deepEqual(mixer.getMix(),[]);assert.doesNotMatch(mixer.text(),/Calm geometric/);
});

test('scene and mix stay separate through edits, standard composition, presets and reload',async()=>{
 const memory=storage(),doc=environment(memory);let scene='An elderly artist in a quiet studio.';
 const mixer=attachCreativeStyleMixers({getLanguage:()=> 'HU',getDraft:()=>scene,setDraft:(_,value)=>scene=value});
 const root=doc.body.querySelector('[data-style-mixer="classic"]'),select=root.querySelector('.cr-mix-row').children[0];select.value='surreal';await select.emit('change');
 const section=root.querySelector('[data-mix-field="direction"]');assert.match(section.value,/Surrealism/);assert.equal(scene,'An elderly artist in a quiet studio.');
 assert.match(creativePromptFor('classic',scene),/Surrealism/);assert.match(root.querySelector('[data-mix-field="preview"]').value,/elderly artist/);
 await root.querySelector('[data-mix-action="copy-scene"]').emit('click');assert.equal(doc.clipboard,scene);
 await root.querySelector('[data-mix-action="copy-direction"]').emit('click');assert.equal(doc.clipboard,section.value);
 section.value='Soft paper textures and dreamlike layers. ';await section.emit('input');assert.ok(section.value.endsWith(' '),'typing a space must not erase it');assert.equal(scene,'An elderly artist in a quiet studio.');
 assert.equal(creativeMixSectionFor('classic'),'Soft paper textures and dreamlike layers. ');assert.match(creativePromptFor('classic',scene),/Soft paper textures/);assert.doesNotMatch(creativePromptFor('classic',scene),/Surrealism/);
 const actions=root.querySelector('.cr-actions');actions.children[1].value='Hand-written look';await actions.children[2].emit('click');
 environment(memory);attachCreativeStyleMixers({getLanguage:()=> 'EN',getDraft:()=>scene});assert.equal(creativeMixSectionFor('classic'),'Soft paper textures and dreamlike layers. ');
 const video=document.body.querySelector('[data-style-mixer="i2v"]'),preset=video.querySelector('.cr-actions').children[0];preset.value='0';await preset.emit('change');assert.equal(creativeMixSectionFor('i2v'),'Soft paper textures and dreamlike layers. ');
 assert.equal(scene,'An elderly artist in a quiet studio.');assert.ok(loadCreativeMixSection('i2v',''));assert.equal(creativePromptFor('i2v',scene),scene,'an explicitly empty section disables it');
});

test('legacy generated directions can be separated without losing ordinary scene lighting',async()=>{
 const doc=environment(storage());let scene='A café. Lighting: warm window light.\nVisual direction mix: Primary — Vintage: subtle film character.';
 attachCreativeStyleMixers({getLanguage:()=> 'EN',getDraft:()=>scene,setDraft:(_,value)=>scene=value});
 assert.equal(creativePromptFor('classic',scene),scene,'untouched legacy text is preserved until a mix is chosen or separation requested');
 const root=doc.body.querySelector('[data-style-mixer="classic"]');await root.querySelector('[data-mix-action="separate"]').emit('click');
 assert.equal(scene,'A café. Lighting: warm window light.');assert.match(creativeMixSectionFor('classic'),/Vintage/);assert.match(creativePromptFor('classic',scene),/Vintage/);
 const select=root.querySelector('.cr-mix-row').children[0];select.value='abstract';await select.emit('change');assert.equal(scene,'A café. Lighting: warm window light.');assert.doesNotMatch(creativePromptFor('classic',scene),/Vintage/);assert.match(creativePromptFor('classic',scene),/Abstract/);
});

test('proven recipes retain independent scene and custom mix sections when reused',async()=>{
 const memory=storage(),doc=environment(memory);const base='A portrait beside a window.',direction='Subtle red watercolor edges.';
 attachCreativeRecipes({getLanguage:()=> 'EN',getCurrent:()=>({prompt:base,mode:'image'}),restore:()=>{}}).openCapture({prompt:base+'\n'+direction,scenePrompt:base,mixDirection:direction,filename:'portrait.png'});
 const root=doc.getElementById('creative-recipes');attachCreativeStyleMixers({getLanguage:()=> 'EN',getDraft:key=>key==='recipes'?root.querySelector('[data-cr-field="draft"]').value:base});
 const dialog=doc.body.querySelector('.creative-recipe-dialog');await dialog.querySelectorAll('[data-cr-text="save"]').find(x=>x.tagName==='BUTTON').emit('click');
 await root.querySelector('[data-cr-text="build"]').emit('click');assert.equal(root.querySelector('[data-cr-field="draft"]').value,base);assert.equal(creativeMixSectionFor('recipes'),direction);
 await root.querySelector('[data-cr-text="copy"]').emit('click');assert.equal(doc.clipboard,base+'\n'+direction);
 const entry=createCreativeRecipeStore(memory).list()[0];assert.equal(entry.recipe.scenePrompt,base);assert.equal(entry.recipe.mixDirection,direction);
});

test('Suggested sets a reversible video starting point without editing the scene or using AI',async()=>{
 const memory=storage(),doc=environment(memory);let language='HU',writes=0;const scene='A portrait by a window.';
 const mixer=attachCreativeStyleMixers({getLanguage:()=>language,getDraft:()=>scene,setDraft:()=>writes++});
 const root=doc.body.querySelector('[data-style-mixer="i2v"]'),rows=root.querySelectorAll('.cr-mix-row');
 for(const [i,id]of ['glamour','scifi','noir'].entries()){rows[i].children[0].value=id;await rows[i].children[0].emit('change');}
 const rim=root.querySelector('[data-mix-field="light-rim"]');rim.value='88';await rim.emit('input');
 const section=root.querySelector('[data-mix-field="direction"]');section.value='My carefully edited look.';await section.emit('input');
 const previousMix=mixer.getMix('i2v'),previousLights=mixer.getLights('i2v'),suggest=root.querySelector('[data-mix-action="suggest"]'),undo=root.querySelector('[data-mix-action="undo-suggestion"]');assert.equal(suggest.textContent,'Javasolt');
 await suggest.emit('click');assert.deepEqual(mixer.getMix('i2v').map(x=>x.percent),[60,30,10]);assert.equal(mixer.getLights('i2v').key,70);assert.equal(mixer.getLights('i2v').rim,30);assert.equal(writes,0);assert.ok(!undo.hidden);assert.doesNotMatch(section.value,/carefully edited/);
 await suggest.emit('click');assert.ok(!undo.hidden,'a repeated suggestion must preserve the useful undo snapshot');await undo.emit('click');assert.deepEqual(mixer.getMix('i2v'),previousMix);assert.deepEqual(mixer.getLights('i2v'),previousLights);assert.equal(section.value,'My carefully edited look.');assert.equal(writes,0);assert.ok(undo.hidden);
 await suggest.emit('click');rim.value='45';await rim.emit('input');assert.ok(undo.hidden,'later fine-tuning must not be silently replaced by an old undo');
 for(const code of ['EN','HU','DE','FR','ES','IT','PT','PL']){language=code;doc.getElementById('ui-language').dispatchEvent({type:'change'});assert.ok(suggest.textContent&&suggest.title);}
 const beforeMix=mixer.getMix('i2v'),beforeLights=mixer.getLights('i2v');memory.setItem=()=>{throw Error('quota');};await suggest.emit('click');assert.deepEqual(mixer.getMix('i2v'),beforeMix);assert.deepEqual(mixer.getLights('i2v'),beforeLights);assert.equal(writes,0);
});
test('switching a generated glamour portrait to oil updates its base and copied prompt; hybrid preference survives',async()=>{
 const memory=storage(),doc=environment(memory);let draft=buildSurprisePrompt({theme:'glamour',random:()=>0}).prompt;const original=draft;
 const mixer=attachCreativeStyleMixers({getLanguage:()=> 'HU',getDraft:()=>draft,setDraft:(_,value)=>draft=value});const root=doc.body.querySelector('[data-style-mixer="classic"]'),first=root.querySelector('.cr-mix-row').children[0];
 first.value='oil';await first.emit('change');assert.doesNotMatch(draft,/professional photograph|editorial photography|tack-sharp/);assert.match(draft,/adult fashion model/);assert.match(creativePromptFor('classic',draft),/Oil painting/);await root.querySelector('[data-mix-action="copy-full"]').emit('click');assert.doesNotMatch(doc.clipboard,/professional photograph/);
 const hybrid=root.querySelector('[data-mix-field="hybrid"]');hybrid.checked=true;await hybrid.emit('change');draft=original;first.value='oil';await first.emit('change');assert.equal(draft,original);assert.match(mixer.text(),/Intentionally blend photographic realism/);
 environment(memory);const reloaded=attachCreativeStyleMixers({getLanguage:()=> 'HU',getDraft:()=>draft});assert.match(reloaded.text(),/Intentionally blend photographic realism/);
});
