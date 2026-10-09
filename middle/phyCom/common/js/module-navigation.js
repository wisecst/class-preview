/* Shared module catalogue and compact navigation; lesson coordinates stay inside Stage. */
(()=>{'use strict';
 const modules=Object.freeze([
  {id:'led',name:'LED',path:'led/',enabled:true,unit:'modules',group:'output'},
  {id:'buzzer',name:'수동버저',path:'buzzer/',enabled:true,unit:'modules',group:'output'},
  {id:'dc-motor',name:'DC모터',path:'dc-motor/',enabled:true,unit:'modules',group:'output'},
  {id:'servo-motor',name:'서보모터',path:'servo-motor/',enabled:true,unit:'modules',group:'output'}
 ]);
 const projects=Object.freeze([{id:'rotation-dc-motor',name:'다이얼 선풍기',description:'과제 : 가변저항 + DC모터',path:'projects/rotation-dc-motor/',enabled:true,unit:'projects',group:'assignments'}]);
 const lessons=Object.freeze([...modules,...projects]);
 function choices(onSelect,items=modules){
  const grid=document.createElement('div');grid.className='shortcut-groups';
  const units=[['understand','Ⅰ 이해'],['modules','Ⅱ 설계'],['projects','Ⅲ 활용'],['ai','Ⅳ AI']];
  const groups={modules:[['input','입력장치'],['output','출력장치']],projects:[['assignments','과제'],['group-projects','프로젝트']]};
  function appendItems(parent,rows){const buttons=document.createElement('div');buttons.className='module-grid';for(const module of rows){const b=document.createElement('button');b.type='button';b.dataset.module=module.id;b.textContent=module.name;b.addEventListener('click',()=>onSelect(module.id));buttons.append(b)}parent.append(buttons)}
  for(const [unit,label]of units){const rows=items.filter(m=>m.enabled&&m.unit===unit);if(!rows.length)continue;const section=document.createElement('section'),h=document.createElement('h3');h.textContent=label;section.append(h);
   if(groups[unit]){for(const [group,name]of groups[unit]){const subset=rows.filter(m=>m.group===group);if(!subset.length)continue;const heading=document.createElement('h4');heading.textContent=name;section.append(heading);appendItems(section,subset)}}else appendItems(section,rows);
   if(section.querySelector('button'))grid.append(section);
  }
  return grid;
 }
 function create({home,previous,next,select,fullscreen}){
  const nav=document.createElement('nav');nav.className='lesson-navigation';nav.setAttribute('aria-label','수업 이동');
  const button=(label,action,key)=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.dataset.action=key;b.addEventListener('click',action);nav.append(b);return b};
  button('홈',home,'home');const prev=button('이전',previous,'previous');
  const position=document.createElement('span');position.className='lesson-position';position.setAttribute('aria-live','polite');nav.append(position);
  const forward=button('다음',next,'next');
  const picker=button('바로가기',()=>setOpen(panel.hidden),'modules');picker.setAttribute('aria-expanded','false');
  const panel=document.createElement('section');panel.className='module-panel';panel.hidden=true;panel.setAttribute('aria-label','바로가기');
  const title=document.createElement('h2');title.textContent='바로가기';panel.append(title,choices(id=>{setOpen(false);select(id)},lessons));nav.append(panel);
  const full=button('⛶',fullscreen,'fullscreen');full.setAttribute('aria-label','전체화면 / 프리젠터');
  function setOpen(on){panel.hidden=!on;picker.setAttribute('aria-expanded',String(on));if(on)(panel.querySelector('[aria-current]')||panel.querySelector('button:not(:disabled)'))?.focus()}
  document.addEventListener('click',e=>{if(!nav.contains(e.target))setOpen(false)});
  nav.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden){e.preventDefault();e.stopPropagation();setOpen(false);picker.focus()}});
  function update(id,items=[]){const module=lessons.find(m=>m.id===id),index=items.findIndex(i=>i.active);position.textContent=module?`${module.name} · ${index<0?'–':index+1} / ${items.length||'–'}`:'';
   for(const b of panel.querySelectorAll('[data-module]')){if(b.dataset.module===id)b.setAttribute('aria-current','true');else b.removeAttribute('aria-current')}
   // Controllers own step boundaries, including actions within the first/last page.
   prev.disabled=forward.disabled=!module;
  }
  return {element:nav,update,close:()=>setOpen(false)};
 }
 window.phycomNavigation=Object.freeze({modules,projects,lessons,choices,create});
})();
