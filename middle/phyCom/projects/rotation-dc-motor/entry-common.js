/* Present the existing fan lesson state with the shared Entry renderer. */
(()=>{'use strict';
const E=window.EntryEngine,ids=new WeakMap();let serial=0,pending=0;
const id=n=>{if(!ids.has(n))ids.set(n,'fan-block-'+(++serial));return ids.get(n)};
const text=n=>n.textContent.replace(/▼/g,'').trim();
function parts(host){const out=[];for(const n of host.childNodes){if(n.nodeType===3){if(n.textContent.trim())out.push({text:n.textContent.trim()});continue}
 if(n.nodeType!==1||n.matches('button,.select-arrow,.play-dot'))continue;
 if(n.matches('[data-entry-slot]'))out.push({slot:{id:id(n),value:{kind:n.dataset.entrySlot,value:text(n)}}});
 else if(n.matches('.field'))out.push({slot:{id:id(n),value:{kind:'dropdown',value:text(n)}}});
 else if(n.matches('.number-field'))out.push({slot:{id:id(n),value:{kind:'number',value:text(n)}}});
 else if(n.matches('.entry-block,.project-map,.project-variable,.project-product'))out.push({slot:{id:id(n)+'-slot',value:{kind:'block',block:reporter(n)}}});
 else out.push(...parts(n));
}return out}
function reporter(n){return{id:id(n),type:'reporter',category:n.matches('.project-variable')?'data':n.matches('.project-product')?'calculation':'hardware',parts:parts(n)}}
const runs=new Map();
function block(n){const run=n.querySelector(':scope>button');if(run)runs.set(run.id,run);
 const b={id:id(n),type:n.matches('.start-block')?'event':n.matches('.repeat-block')?'c':'command',category:n.matches('.start-block')?'start':n.matches('.repeat-block')?'flow':n.matches('.data-block')?'data':n.matches('.looks-block')?'looks':'hardware',parts:parts(n)};
 if(run)b.run=run.id;
 if(b.type==='c'){const body=n.nextElementSibling;b.branches=[body?.matches('.repeat-body')?sequence(body):[]]}
 return b;
}
function sequence(host){return [...host.children].filter(n=>n.matches('.entry-block.entry-show')).map(block)}
function current(host){const n=host.querySelector('.entry-block.entry-current');return n?id(n):null}
function make(source,cls){const host=document.createElement('div');host.className=cls;source.after(host);source.classList.add('fan-entry-source');const renderer=new E.Renderer(host,key=>{const b=runs.get(key);if(b&&!b.disabled)b.click()});return{source,host,renderer}}
const study=make(document.querySelector('#studyCode'),'fan-common-code'),task=make(document.querySelector('#projectCode'),'fan-common-code');
const studyPalette=make(document.querySelector('#studyPalette'),'fan-common-palette'),taskPalette=make(document.querySelector('#taskPalette'),'fan-common-palette');
/* Palettes belong to the workspace, independently of the hidden source tree. */
study.source.after(studyPalette.host);task.source.after(taskPalette.host);
const guide=['guideVariable','guideInputHint','guideOutputHint'].map(key=>make(document.getElementById(key),'fan-common-guide'));
const studySlide=study.source.closest('.slide'),taskSlide=task.source.closest('.slide');
const tabs=[{view:study,slide:studySlide,tabs:new E.Tabs(studySlide.querySelector('.entry-tabs'),'../../assets/')},{view:task,slide:taskSlide,tabs:new E.Tabs(taskSlide.querySelector('.entry-tabs'),'../../assets/')}];
function buttons(view){for(const [key,n]of runs){const button=view.host.querySelector('[data-run="'+key+'"]');if(!button)continue;button.disabled=n.disabled;button.textContent=n.textContent;button.classList.toggle('running',n.classList.contains('running'));button.setAttribute('aria-label',n.getAttribute('aria-label')||'실행')}}
function palette(view,pool){const visible=!pool.source.hidden;pool.host.hidden=!visible;if(!visible)return;const nodes=[...pool.source.children].filter(n=>!n.hidden&&n.matches('.entry-block,.project-map,.project-variable,.project-product'));pool.renderer.render(nodes.map(n=>({id:id(n)+'-palette',blocks:[n.matches('.entry-block')?block(n):reporter(n)]})));pool.host.style.top=(82+view.host.offsetHeight+12)+'px';}
/* A restored dropdown must not retain a previously nested reporter's label. */
function restoreDropdowns(renderer,scripts){E.walk(scripts,n=>{const row=renderer.blocks.get(n.id)?.children[1];n.parts.forEach((part,i)=>{if(part.slot?.value.kind!=='dropdown')return;const slot=row?.querySelector(':scope>[data-part="'+i+'"]');if(slot?.classList.contains('ec-filled'))slot.replaceChildren()})})}
function sync(){
 pending=0;
 const a1=document.querySelector('#studyA1Set'),motor=document.querySelector('#studyMotorCode'),compare=studySlide.classList.contains('study-compare');
 const left=sequence(study.source);if(!motor.hidden)left.push(...sequence(motor));if(!compare)left.push(...sequence(a1));
 const scripts=[{id:'fan-study-main',blocks:left}];if(compare)scripts.push({id:'fan-study-a1',blocks:sequence(a1)});
 restoreDropdowns(study.renderer,scripts);study.renderer.render(scripts,current(study.source));
 const right=study.renderer.roots.get('fan-study-a1');if(compare&&right)right.style.paddingTop='122px';
 const taskScripts=[{id:'fan-task-main',blocks:sequence(task.source)}];restoreDropdowns(task.renderer,taskScripts);task.renderer.render(taskScripts,current(task.source));
 for(const view of [study,task])buttons(view);
 palette(study,studyPalette);palette(task,taskPalette);
 for(const g of guide){g.host.hidden=g.source.hidden;if(g.host.hidden)continue;const nodes=[...g.source.children].map(n=>n.matches('.entry-block')?block(n):reporter(n));g.renderer.render([{id:id(g.source)+'-guide',blocks:nodes}])}
 for(const item of tabs){const cats=[];E.walk(item.view.renderer.scripts,n=>cats.push(n.category));const pool=item.view===study?studyPalette:taskPalette;if(!pool.host.hidden)E.walk(pool.renderer.scripts,n=>cats.push(n.category));const legacy=item.view.source.querySelector('.entry-block.entry-current'),active=legacy?.dataset.tab==='math'?'calculation':legacy?.dataset.tab;
 const selected=item.slide.querySelector('.entry-tab.active-tab')?.dataset.tab;const paletteActive=pool.source.hidden?null:pool.renderer.scripts?.[0]?.blocks?.[0]?.category;
 item.tabs.render(cats.length?cats:['start'],paletteActive||(selected==='math'?'calculation':selected)||active||'start');const math=item.tabs.nodes.get('calculation');if(math)math.dataset.tab='math';
 }
 study.renderer.reflow();task.renderer.reflow();
}
function schedule(){if(!pending)pending=requestAnimationFrame(sync)}
document.addEventListener('fan-entry-state',()=>{if(pending)cancelAnimationFrame(pending);sync()});
const observer=new MutationObserver(schedule);
for(const n of [study.source,task.source,...guide.map(g=>g.source)])observer.observe(n,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['class','hidden','disabled']});
for(const slide of [studySlide,taskSlide])observer.observe(slide,{attributes:true,attributeFilter:['class']});
window.addEventListener('resize',schedule);window.addEventListener('load',schedule,{once:true});
sync();
})();
