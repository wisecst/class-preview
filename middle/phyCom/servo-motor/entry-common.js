/* Existing servo progression/results feed the established shared Entry renderer. */
(()=>{'use strict';
const E=window.EntryEngine,q=s=>document.querySelector(s),ids=new WeakMap();let serial=0,pending=0;
const id=n=>{if(!ids.has(n))ids.set(n,'servo-block-'+(++serial));return ids.get(n)};
const label=n=>n.textContent.replace(/▼/g,'').trim();
E.categories.judge ||= {order:7,label:'판단',asset:'tab07_control',color:getComputedStyle(q('.tb-condition')).backgroundColor};
E.categories.motion ||= {order:3,label:'움직임',asset:'tab03_motion',color:getComputedStyle(q('.tb-motion')).backgroundColor};
function parts(host){const out=[];for(const n of host.childNodes){if(n.nodeType===3){if(n.textContent.trim())out.push({text:n.textContent.trim()});continue}
if(n.nodeType!==1||n.hidden||n.matches('button,.select-arrow,.play-dot'))continue;
let value;if(n.matches('.field'))value={kind:'dropdown',value:label(n)};
else if(n.matches('.number-field'))value={kind:'literal',value:label(n)};
else if(n.matches('.tb-true'))value={kind:'block',block:{id:id(n),type:'boolean',category:'judge',parts:[{text:label(n)}]}};
else if(n.matches('.tb-variable'))value={kind:'block',block:{id:id(n),type:'reporter',category:'data',parts:[{slot:{id:'name',value:{kind:'dropdown',value:label(n).replace(/\s*값$/,'')}}},{text:'값'}]}};
else if(n.matches('.tb-condition'))value={kind:'block',block:{id:id(n),type:'boolean',category:'judge',parts:parts(n)}};
if(value)out.push({slot:{id:id(n)+'-slot',value}});else out.push(...parts(n));}return out}
const runs=new Map();
function block(n){const button=n.querySelector('button');if(button)runs.set(button.id,button);
const category=n.dataset.tab||(n.matches('.start-block')?'start':n.matches('.wait-block')?'flow':'hardware');
return{id:id(n),type:category==='start'?'event':'command',category,parts:parts(n),...(button?{run:button.id}:{})}}
function sequence(source){const out=[];for(const n of source.children){if(n.hidden||n.classList.contains('tb-hidden')||(n.hasAttribute('data-entry-step')&&!n.classList.contains('entry-show')))continue;
if(n.matches('.entry-block'))out.push(block(n));else if(n.matches('.tb-if')){const header=n.querySelector(':scope>.entry-block');if(header.classList.contains('tb-hidden'))continue;const control=block(header);control.type='c';control.branches=[sequence(n.querySelector('.tb-body'))];out.push(control)}}return out}
window.servoSetupCode=()=>{const copy=basic.cloneNode(true);copy.querySelectorAll('[data-entry-step]').forEach(n=>n.classList.add('entry-show'));return [{id:'setup-servo',blocks:sequence(copy)}]};
const basic=q('.entry-page3-slide .motor-program'),task=q('.servo5-code'),palette=q('.servo-condition-palette');
function view(source,cls){const host=document.createElement('div');host.className=cls;source.after(host);source.classList.add('servo-entry-source');return{source,host,renderer:new E.Renderer(host,key=>{const button=runs.get(key);if(button&&!button.disabled)button.click()})}}
const b=view(basic,'servo-common-basic'),t=view(task,'servo-common-task'),p=view(palette,'servo-common-palette');
const tabs=[b,t].map(v=>new E.Tabs(v.source.closest('.slide').querySelector('.entry-tabs'),'../assets/'));
function sync(){pending=0;
for(const [index,v] of [b,t].entries()){v.host.hidden=v.source.hidden;
const sources=index===0?[v.source]:[...v.source.querySelectorAll(':scope>.tb-script')].filter(n=>!n.hidden);
const scripts=sources.map(n=>({id:id(n)+'-script',blocks:sequence(n)}));
const current=v.source.querySelector('.entry-current:not(.tb-hidden),.servo-running.entry-block');
v.renderer.render(scripts,current?id(current):null);
sources.forEach(n=>v.renderer.roots.get(id(n)+'-script')?.classList.toggle('servo-running',n.classList.contains('servo-running')));
for(const [key,source]of runs){const button=v.host.querySelector('[data-run="'+key+'"]');if(button){button.disabled=source.disabled;button.textContent=source.textContent;button.classList.toggle('running',source.classList.contains('running'))}}
const cats=[];E.walk(scripts,n=>cats.push(n.category));const selected=v.source.closest('.slide').querySelector('.active-tab')?.dataset.tab;
const condition=palette.querySelector('.tb-condition');
if(index===1&&!palette.hidden)cats.push(condition?'judge':'data');
const paletteCategory=index===1&&!palette.hidden?(condition?'judge':'data'):null;
const active=paletteCategory||(current?.closest('.tb-condition')?'judge':current?.matches('.tb-variable')?'data':current?.dataset.tab||(current?.matches('.start-block')?'start':current?.matches('.wait-block')?'flow':null))||selected||'start';
tabs[index].render(cats.length?cats:['start'],active);
}
p.host.hidden=palette.hidden;if(!palette.hidden){const n=palette.querySelector('.tb-condition,.tb-variable'),heading=palette.querySelector('h3'),hint=palette.querySelector('p');const node=n.matches('.tb-condition')?{id:id(n),type:'boolean',category:'judge',parts:parts(n)}:{id:id(n),type:'reporter',category:'data',parts:[{slot:{id:'name',value:{kind:'dropdown',value:label(n).replace(/\s*값$/,'')}}},{text:'값'}]};
let title=p.host.querySelector('.servo-palette-title'),note=p.host.querySelector('.servo-palette-note');if(!title){title=document.createElement('h3');title.className='servo-palette-title';note=document.createElement('p');note.className='servo-palette-note';}
p.renderer.render([{id:'servo-palette',blocks:[node]}],node.id);title.textContent=heading.textContent;note.textContent=hint.textContent;p.host.prepend(title);p.host.append(note);}
}
function schedule(){if(!pending)pending=requestAnimationFrame(sync)}
const observer=new MutationObserver(schedule);for(const n of [basic,task,palette])observer.observe(n,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['class','hidden','disabled']});
for(const v of [b,t])observer.observe(v.source.closest('.slide').querySelector('.entry-tabs'),{subtree:true,attributes:true,attributeFilter:['class']});
window.addEventListener('load',schedule);sync();
})();
