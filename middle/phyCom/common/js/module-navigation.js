/* Shared module catalogue and compact navigation; lesson coordinates stay inside Stage. */
(()=>{'use strict';
 const modules=Object.freeze([
  {id:'led',name:'LED',path:'led/',enabled:true},
  {id:'buzzer',name:'수동버저',path:'buzzer/',enabled:true},
  {id:'dc-motor',name:'DC모터',path:'dc-motor/',enabled:true},
  {id:'servo-motor',name:'서보모터',path:'servo-motor/',enabled:true}
 ]);
 function choices(onSelect){
  const grid=document.createElement('div');grid.className='module-grid';
  for(const module of modules){const b=document.createElement('button');b.type='button';b.dataset.module=module.id;b.textContent=module.name+(module.enabled?'':' · 준비 중');b.disabled=!module.enabled;b.addEventListener('click',()=>onSelect(module.id));grid.append(b)}
  return grid;
 }
 function create({home,previous,next,select,fullscreen}){
  const nav=document.createElement('nav');nav.className='lesson-navigation';nav.setAttribute('aria-label','수업 이동');
  const button=(label,action,key)=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.dataset.action=key;b.addEventListener('click',action);nav.append(b);return b};
  button('홈',home,'home');const prev=button('이전',previous,'previous');
  const position=document.createElement('span');position.className='lesson-position';position.setAttribute('aria-live','polite');nav.append(position);
  const forward=button('다음',next,'next');
  const picker=button('모듈 선택',()=>setOpen(panel.hidden),'modules');picker.setAttribute('aria-expanded','false');
  const panel=document.createElement('section');panel.className='module-panel';panel.hidden=true;panel.setAttribute('aria-label','모듈 선택');
  const title=document.createElement('h2');title.textContent='모듈 선택';panel.append(title,choices(id=>{setOpen(false);select(id)}));nav.append(panel);
  const full=button('⛶',fullscreen,'fullscreen');full.setAttribute('aria-label','전체화면 / 프리젠터');
  function setOpen(on){panel.hidden=!on;picker.setAttribute('aria-expanded',String(on));if(on)(panel.querySelector('[aria-current]')||panel.querySelector('button:not(:disabled)'))?.focus()}
  document.addEventListener('click',e=>{if(!nav.contains(e.target))setOpen(false)});
  nav.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden){e.preventDefault();e.stopPropagation();setOpen(false);picker.focus()}});
  function update(id,items=[]){const module=modules.find(m=>m.id===id),index=items.findIndex(i=>i.active);position.textContent=module?`${module.name} · ${index<0?'–':index+1} / ${items.length||'–'}`:'';
   for(const b of panel.querySelectorAll('[data-module]')){if(b.dataset.module===id)b.setAttribute('aria-current','true');else b.removeAttribute('aria-current')}
   // Controllers own step boundaries, including actions within the first/last page.
   prev.disabled=forward.disabled=!module;
  }
  return {element:nav,update,close:()=>setOpen(false)};
 }
 window.phycomNavigation=Object.freeze({modules,choices,create});
})();
