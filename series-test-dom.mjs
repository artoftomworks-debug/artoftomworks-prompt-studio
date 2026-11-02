export class StudioNode{
 constructor(tag){this.tagName=tag.toUpperCase();this.children=[];this.handlers={};this.dataset={};this.attributes={};this.style={};this.value='';this.textContent='';this.hidden=false;this.open=false;this.parentElement=null;this.className='';}
 append(...nodes){for(const n of nodes){n.remove();n.parentElement=this;this.children.push(n);}}appendChild(n){this.append(n);return n;}
 remove(){if(this.parentElement)this.parentElement.children=this.parentElement.children.filter(x=>x!==this);this.parentElement=null;}
 after(n){const p=this.parentElement;n.remove();n.parentElement=p;p.children.splice(p.children.indexOf(this)+1,0,n);}
 replaceChildren(...nodes){this.children.forEach(n=>n.parentElement=null);this.children=[];this.append(...nodes);}
 setAttribute(k,v){this.attributes[k]=String(v);if(k==='class')this.className=String(v);if(k==='id')this.id=String(v);if(k.startsWith('data-'))this.dataset[k.slice(5).replace(/-([a-z])/g,(_,s)=>s.toUpperCase())]=String(v);}
 addEventListener(k,fn){(this.handlers[k]??=[]).push(fn);}dispatchEvent(event){for(const fn of this.handlers[event.type]||[])fn(event);return true;}
 async emit(type,extra={}){const e={type,preventDefault(){},...extra};for(const fn of this.handlers[type]||[])await fn(e);}
 all(){return this.children.flatMap(n=>[n,...n.all()]);}
 matches(selector){if(selector.includes(','))return selector.split(',').some(s=>this.matches(s.trim()));if(selector.startsWith('#'))return this.id===selector.slice(1);if(selector.startsWith('.'))return this.className.split(' ').includes(selector.slice(1));if(selector.startsWith('[')){const m=selector.match(/^\[([\w-]+)(?:="([^"]*)")?\]$/);if(!m)return false;return m[1] in this.attributes&&(m[2]===undefined||this.attributes[m[1]]===m[2])||m[1].startsWith('data-')&&m[1].slice(5).replace(/-([a-z])/g,(_,s)=>s.toUpperCase()) in this.dataset&&(m[2]===undefined||this.dataset[m[1].slice(5).replace(/-([a-z])/g,(_,s)=>s.toUpperCase())]===m[2]);}return this.tagName===selector.toUpperCase();}
 querySelectorAll(s){return this.all().filter(n=>n.matches(s));}querySelector(s){return this.querySelectorAll(s)[0]||null;}
 get options(){return this.children;}get selectedIndex(){return this.options.findIndex(n=>n.value===this.value);}
 focus(){}scrollIntoView(){}setPointerCapture(){}getBoundingClientRect(){return {left:0,top:0,width:600,height:360};}
 showModal(){this.open=true;}close(){this.open=false;this.dispatchEvent({type:'close'});}click(){this.dispatchEvent({type:'click'});}
}
