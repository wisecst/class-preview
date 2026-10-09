(()=>{'use strict';
const shell=document.getElementById('buzzerShell'),frame=document.getElementById('buzzerFrame');
const names={led:'LED',buzzer:'수동버저','dc-motor':'DC모터','servo-motor':'서보모터'};
let current=null;
const nav=document.createElement('nav');nav.className='module-switch';nav.setAttribute('aria-label','모듈 전환');
for(const [key,name] of Object.entries(names)){const b=document.createElement('button');b.type='button';b.textContent=name;b.dataset.module=key;b.addEventListener('click',()=>open(key));nav.append(b)}
const toc=document.createElement('aside');toc.className='module-toc';toc.setAttribute('aria-label','현재 모듈 목차');
shell.prepend(nav,toc);
function credit(){const p=document.createElement('p');p.className='creator-credit';const c=window.INFO_UI_CREATOR||{};p.textContent=`© ${c.year||'2026'} ${c.name||'B.K.Son'}${c.rights?` · ${c.rights}`:''}`;return p}
shell.append(credit());document.querySelector('.lesson-screen').append(credit());
function focusLesson(){if(shell.hidden)return;frame.contentWindow?.focus()}
function open(key){if(!names[key])return;current=key;shell.hidden=false;document.body.style.overflow='hidden';toc.replaceChildren();const h=document.createElement('h2');h.textContent=names[key]+' 목차';toc.append(h);for(const b of nav.children){if(b.dataset.module===key)b.setAttribute('aria-current','true');else b.removeAttribute('aria-current')}frame.title=names[key]+' 수업';frame.src=key+'/?ui=20261009-original-stage';}
function close(){shell.hidden=true;current=null;frame.src='about:blank';document.body.style.overflow='';document.querySelector('[data-open-module]')?.focus()}
for(const [label,action] of [['홈',close],['이전',()=>frame.contentWindow.postMessage({type:'info-key',key:'ArrowLeft'},location.origin)],['다음',()=>frame.contentWindow.postMessage({type:'info-key',key:'ArrowRight'},location.origin)]]){const b=document.createElement('button');b.type='button';b.textContent=label;b.addEventListener('click',action);nav.append(b)}
const fullscreen=()=>window.infoFullscreen.toggle();
function syncFullscreen(){window.infoFullscreen.sync()}
window.infoFullscreen.subscribe(on=>{frame.contentWindow?.postMessage({type:'info-fullscreen',on},location.origin);focusLesson()});
const fullButton=document.createElement('button');fullButton.type='button';fullButton.textContent='⛶ 전체화면';fullButton.addEventListener('click',()=>fullscreen());nav.append(fullButton);
window.infoShell={fullscreen,focusLesson};
frame.addEventListener('load',()=>{focusLesson();syncFullscreen()});
document.querySelectorAll('[data-open-module]').forEach(b=>b.addEventListener('click',()=>open(b.dataset.openModule)));
window.addEventListener('message',e=>{if(e.origin!==location.origin||e.source!==frame.contentWindow)return;if(e.data==='phycom-home'){close();return}if(e.data?.type==='info-toc'){
 const h=toc.querySelector('h2');toc.replaceChildren(h);e.data.items.forEach((item,index)=>{const b=document.createElement('button');b.type='button';b.textContent=item.label;if(item.active)b.setAttribute('aria-current','page');b.addEventListener('click',()=>{frame.contentWindow.postMessage({type:'info-jump',index},location.origin);focusLesson()});toc.append(b)});
}});
document.addEventListener('keydown',e=>{if(shell.hidden||e.target.closest('input,textarea,select,[contenteditable]:not([contenteditable="false"])'))return;if(['ArrowLeft','ArrowRight','PageUp','PageDown'].includes(e.key)){e.preventDefault();frame.contentWindow.postMessage({type:'info-key',key:e.key},location.origin)}else if(e.key.toLowerCase()==='f'){e.preventDefault();fullscreen().catch(()=>{})}});
})();
