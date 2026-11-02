import assert from 'node:assert/strict';
import {test} from 'node:test';
import {attachCatalogGalleryActions} from './dist/catalog-gallery-actions.mjs';
class E{
 constructor(tag){this.tagName=tag;this.children=[];this.handlers={};this.dataset={};this.attributes={};this.className='';this.open=false;this.classList={toggle:(c,on)=>{const s=new Set(this.className.split(' ').filter(Boolean));on?s.add(c):s.delete(c);this.className=[...s].join(' ');}};}
 append(...nodes){for(const n of nodes){n.remove();n.parent=this;this.children.push(n);}}
 prepend(n){n.remove();n.parent=this;this.children.unshift(n);}
 after(n){const p=this.parent;n.remove();n.parent=p;p.children.splice(p.children.indexOf(this)+1,0,n);}
 remove(){if(this.parent)this.parent.children=this.parent.children.filter(n=>n!==this);this.parent=null;}
 replaceChildren(...nodes){for(const n of this.children)n.parent=null;this.children=[];this.append(...nodes);}
 setAttribute(k,v){this.attributes[k]=v;}
 addEventListener(t,fn){(this.handlers[t]??=[]).push(fn);}
 emit(t){const e={stopPropagation(){},preventDefault(){this.prevented=true;}};for(const fn of this.handlers[t]||[])fn(e);return e;}
 closest(t){return this.tagName===t?this:this.parent?.closest(t);}
 showModal(){this.open=true;}close(){this.open=false;this.emit('close');}
 all(){return this.children.flatMap(n=>[n,...n.all()]);}
}
const settle=()=>new Promise(r=>setImmediate(r));
const labels={select:'Select for deletion',selected:'selected (maximum 100)',page:'Select page',clear:'Clear',review:'Review selected deletions…',previousDay:'Previous day',nextDay:'Next day',title:'Review files',explanation:'Only listed files',ack:'Permanent deletion cannot be undone',cancel:'Cancel',trash:'Recycle Bin',permanent:'Delete permanently',count:'Files',busy:'Working',limit:'Maximum 100',done:'Removed:',partial:'Stopped',error:'Failed'};
function env(){
 globalThis.document={createElement:t=>new E(t)};
 const panel=new E('section'),anchor=new E('p'),results=new E('div'),pager=new E('div');panel.append(anchor,results,pager);
 let items=[{id:'a',filename:'a.jpg'},{id:'v',filename:'v.mp4'}],scope='day1',day='2026-10-29',gallery=true;const requests=[],removed=[],moves=[];
 const ui=attachCatalogGalleryActions({panel,anchor,results,pager,getLabels:()=>labels,getItems:()=>items,getScope:()=>scope,getDay:()=>day,isGallery:()=>gallery,changeDay:n=>{moves.push(n);day=n>0?'2026-10-30':'2026-10-28';scope=day;ui.refresh();},api:async(path,options)=>{requests.push({path,body:JSON.parse(options.body)});if(path.endsWith('preview'))return {token:'review-token',count:JSON.parse(options.body).ids.length,files:[{path:'C:/test/a.jpg'}]};return {deleted:[...JSON.parse(options.body).token==='review-token'?['a']:[]],requested:2,warnings:[],failed:'v.mp4: locked'};},onRemoved:async ids=>{removed.push(...ids);items=items.filter(x=>!ids.includes(x.id));render();}});
 function render(){ui.beginRender();results.replaceChildren();for(const item of items){const row=new E('article');results.append(row);ui.checkbox(item,row);}ui.refresh();}
 render();return {panel,results,ui,requests,removed,moves,render,setItems:x=>items=x,setScope:x=>scope=x,setGallery:x=>gallery=x};
}
test('thumbnail selection spans pages, resets on day/filter change, and day controls work without a viewer',()=>{
 const e=env(),checks=()=>e.panel.all().filter(n=>n.dataset.catalogDeleteSelect),bars=e.panel.all().filter(n=>n.className==='catalog-gallery-selection');
 checks()[0].checked=true;checks()[0].emit('change');assert.match(bars[0].children[0].textContent,/^1 /);assert.match(bars[1].children[0].textContent,/^1 /);
 e.ui.setLoading(true);assert.ok(checks()[0].disabled);assert.ok(bars[0].children[3].disabled);e.ui.setLoading(false);
 e.setItems([{id:'c',filename:'c.jpg'}]);e.render();bars[1].children[1].emit('click');assert.match(bars[0].children[0].textContent,/^2 /);
 const dayrow=e.panel.all().find(n=>n.className==='catalog-gallery-bottom-days');dayrow.children[0].emit('click');assert.deepEqual(e.moves,[-1]);assert.match(bars[0].children[0].textContent,/^0 /);assert.equal(dayrow.children[1].textContent,'2026-10-28');
 bars[0].children[1].emit('click');e.setScope('new query');e.ui.refresh();assert.match(bars[0].children[0].textContent,/^0 /);
 e.setGallery(false);e.ui.refresh();assert.equal(dayrow.hidden,true);
 e.setItems(Array.from({length:101},(_,i)=>({id:String(i),filename:`${i}.jpg`})));e.render();bars[0].children[1].emit('click');assert.match(bars[0].children[0].textContent,/^100 /);assert.equal(checks().filter(n=>n.checked).length,100);
});
test('batch review lists files, requires permanent acknowledgement, retains failed selections and never auto-deletes',async()=>{
 const e=env(),bars=e.panel.all().filter(n=>n.className==='catalog-gallery-selection');bars[0].children[1].emit('click');bars[1].children[3].emit('click');await settle();
 assert.equal(e.requests.length,1);assert.deepEqual(e.requests[0].body.ids,['a','v']);
 const dialog=e.panel.all().find(n=>n.id==='catalog-gallery-batch-dialog'),ack=dialog.all().find(n=>n.type==='checkbox'),actions=dialog.all().find(n=>n.className==='catalog-delete-actions');
 assert.ok(dialog.open);assert.equal(dialog.children[3].children[0].textContent,'C:/test/a.jpg');assert.ok(actions.children[2].disabled);
 ack.checked=true;ack.emit('change');assert.equal(actions.children[2].disabled,false);
 actions.children[1].emit('click');await settle();assert.deepEqual(e.requests[1].body,{token:'review-token',mode:'trash'});assert.deepEqual(e.removed,['a']);assert.equal(dialog.open,false);assert.match(bars[0].children[0].textContent,/^1 /);assert.equal(e.results.children[0].children[0].children[0].checked,true);
 assert.match(e.panel.all().find(n=>n.className==='catalog-batch-status').textContent,/Stopped.*locked/);
});
