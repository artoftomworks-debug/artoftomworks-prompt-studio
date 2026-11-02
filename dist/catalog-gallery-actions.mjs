export function attachCatalogGalleryActions({panel,results,pager,anchor,getLabels,getItems,getScope,getDay,changeDay,isGallery,api,onRemoved}) {
  const selected=new Set(), checks=new Map(), bars=[];
  let scope=getScope(),busy=false,preparing=false,loading=false,review=null;
  const make=(tag,className="")=>{const e=document.createElement(tag);e.className=className;return e;};
  const button=className=>{const e=make("button",className);e.type="button";return e;};
  const status=make("p","catalog-batch-status");status.setAttribute("role","status");
  const dialog=make("dialog","catalog-delete-dialog");dialog.id="catalog-gallery-batch-dialog";
  const title=make("h3"),intro=make("p"),count=make("strong"),files=make("ul"),ackLabel=make("label","catalog-delete-ack"),ack=make("input"),ackText=make("span"),error=make("p"),actions=make("div","catalog-delete-actions");
  title.id="catalog-gallery-batch-title";dialog.setAttribute("aria-labelledby",title.id);error.setAttribute("role","alert");
  ack.type="checkbox";ackLabel.append(ack,ackText);
  const cancel=button(""),trash=button("catalog-danger"),permanent=button("catalog-danger");
  actions.append(cancel,trash,permanent);dialog.append(title,intro,count,files,ackLabel,error,actions);panel.append(dialog);
  const dayRow=make("div","catalog-gallery-bottom-days"),previous=button("quiet-action"),day=make("strong"),next=button("quiet-action");
  dayRow.append(previous,day,next);pager.after(dayRow);
  function createBar(){
    const bar=make("div","catalog-gallery-selection"),counter=make("strong"),page=button("quiet-action"),clear=button("quiet-action"),remove=button("catalog-danger");
    bar.append(counter,page,clear,remove);bars.push({bar,counter,page,clear,remove});
    page.addEventListener("click",()=>{
      if(locked())return;
      for(const item of getItems()){if(selected.size>=100)break;selected.add(item.id);}
      if(getItems().some(item=>!selected.has(item.id)))status.textContent=getLabels().limit;
      refresh();
    });
    clear.addEventListener("click",()=>{if(!locked()){selected.clear();status.textContent="";refresh();}});
    remove.addEventListener("click",()=>{void prepare();});return bar;
  }
  anchor.after(createBar());dayRow.after(createBar());bars[0].bar.after(status);
  previous.addEventListener("click",()=>{if(!locked())changeDay(-1);});next.addEventListener("click",()=>{if(!locked())changeDay(1);});
  function locked(){return busy||preparing||loading||dialog.open;}
  function refresh(){
    const l=getLabels(),current=getScope();
    if(current!==scope){scope=current;selected.clear();status.textContent="";}
    for(const c of bars){
      c.counter.textContent=`${selected.size} ${l.selected}`;c.page.textContent=l.page;c.clear.textContent=l.clear;c.remove.textContent=l.review;
      c.page.disabled=locked()||!getItems().length;c.clear.disabled=locked()||!selected.size;c.remove.disabled=locked()||!selected.size;
    }
    for(const [id,{check,item,label,caption,row}]of checks){check.checked=selected.has(id);check.disabled=locked();row.classList.toggle("catalog-item-delete-selected",check.checked);caption.textContent=l.select;label.title=l.select;check.setAttribute("aria-label",`${l.select}: ${item.filename}`);}
    dayRow.hidden=!isGallery();previous.textContent=l.previousDay;next.textContent=l.nextDay;day.textContent=getDay();previous.disabled=next.disabled=locked();
    title.textContent=l.title;intro.textContent=l.explanation;ackText.textContent=l.ack;cancel.textContent=l.cancel;trash.textContent=l.trash;permanent.textContent=l.permanent;
    cancel.disabled=busy;trash.disabled=busy||preparing||!review;permanent.disabled=busy||preparing||!review||!ack.checked;
    ack.disabled=busy||preparing;
    if(review)count.textContent=`${l.count}: ${review.count}`;
  }
  function checkbox(item,row){
    const label=make("label","catalog-select-file"),input=make("input"),caption=make("span");input.type="checkbox";input.dataset.catalogDeleteSelect=item.id;
    caption.textContent=getLabels().select;input.setAttribute("aria-label",`${getLabels().select}: ${item.filename}`);label.title=caption.textContent;label.append(input,caption);row.prepend(label);checks.set(item.id,{check:input,item,label,caption,row});
    input.addEventListener("change",()=>{
      if(locked()){refresh();return;}
      if(input.checked){if(selected.size>=100){status.textContent=getLabels().limit;refresh();return;}selected.add(item.id);}else selected.delete(item.id);
      status.textContent="";refresh();
    });
    label.addEventListener("click",event=>event.stopPropagation());return input;
  }
  async function prepare(){
    if(locked()||!selected.size)return;
    preparing=true;review=null;ack.checked=false;error.textContent=getLabels().busy;
    files.replaceChildren();count.textContent="";dialog.showModal();refresh();
    const ids=[...selected];
    try{
      review=await api("/api/catalog/batch-preview",{method:"POST",headers:{"Content-Type":"application/json","X-Prompt-Studio-Action":"catalog-batch-preview"},body:JSON.stringify({ids})});
      if(!review?.token||!Number.isInteger(review.count)||review.count!==ids.length||!Array.isArray(review.files))throw Error("Invalid deletion preview");
      files.replaceChildren(...review.files.map(file=>{const li=make("li");li.textContent=file.path;return li;}));error.textContent="";
    }catch(cause){review=null;error.textContent=`${getLabels().error} ${cause.message}`;}
    finally{preparing=false;refresh();}
  }
  async function confirm(mode){
    if(busy||preparing||!review||(mode==="permanent"&&!ack.checked))return;
    busy=true;error.textContent=getLabels().busy;refresh();
    try{
      const result=await api("/api/catalog/batch-delete",{method:"POST",headers:{"Content-Type":"application/json","X-Prompt-Studio-Action":"catalog-batch-delete"},body:JSON.stringify({token:review.token,mode})});
      review=null;
      const removed=Array.isArray(result.deleted)?result.deleted:[];
      for(const id of removed)selected.delete(id);
      status.textContent=`${getLabels().done} ${removed.length} / ${result.requested}${result.failed?` · ${getLabels().partial} ${result.failed}`:""}${result.warnings?.length?` · ${result.warnings.join(" · ")}`:""}`;
      dialog.close();
      await onRemoved(removed);
    }catch(cause){review=null;error.textContent=`${getLabels().error} ${cause.message}`;}
    finally{busy=false;refresh();}
  }
  cancel.addEventListener("click",()=>{if(!busy&&!preparing)dialog.close();});
  trash.addEventListener("click",()=>{void confirm("trash");});permanent.addEventListener("click",()=>{void confirm("permanent");});ack.addEventListener("change",refresh);
  dialog.addEventListener("cancel",event=>{if(busy||preparing)event.preventDefault();});
  dialog.addEventListener("close",()=>{review=null;refresh();});
  refresh();
  return {checkbox,refresh,clearSelection(){selected.clear();status.textContent="";refresh();},setLoading(value){loading=value;refresh();},beginRender(){checks.clear();},forget(id){selected.delete(id);checks.delete(id);refresh();},locked};
}
