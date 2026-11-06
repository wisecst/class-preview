/* Keep navigation on the lesson's original button/controller path. */
(()=>{'use strict';
const q=s=>document.querySelector(s),embedded=parent!==window;
const editing=el=>el?.closest?.('input,textarea,select,[contenteditable]:not([contenteditable="false"])');
function fullscreen(){return embedded?parent.infoShell.fullscreen():window.infoFullscreen.toggle()}
function move(key){q(['ArrowLeft','PageUp'].includes(key)?'#prev':'#next')?.click()}
// Install on window capture, before document handlers, to avoid double advancement.
window.addEventListener('keydown',e=>{if(editing(e.target))return;if(['ArrowLeft','ArrowRight','PageUp','PageDown'].includes(e.key)){e.preventDefault();e.stopImmediatePropagation();move(e.key)}else if(e.key.toLowerCase()==='f'){e.preventDefault();e.stopImmediatePropagation();fullscreen().catch(()=>{})}},true);
window.addEventListener('click',e=>{if(e.target.closest('#fullscreenBtn')){e.preventDefault();e.stopImmediatePropagation();fullscreen().catch(()=>{})}},true);
let previous='';
function report(){const buttons=[...q('#slideSidebarList').children],original=buttons.filter(b=>!b.classList.contains('hc-sidebar-item')),slides=[...document.querySelectorAll('.wrap>.slide:not(.hardware-connect-slide)')];const items=buttons.map((b,index)=>{const slide=slides[original.indexOf(b)],label=b.classList.contains('hc-sidebar-item')?'하드웨어 연결':(slide?.getAttribute('aria-label')||slide?.querySelector(':scope > h2,:scope > .header-page-title')?.textContent||b.lastElementChild?.textContent||b.textContent);return {label:(index+1)+'. '+label.trim().replace(/^\d+\.\s*/,''),active:b.classList.contains('active')}});const active=items.find(item=>item.active),subtitle=q('#lessonHeader .slide-subtitle');if(active&&subtitle&&subtitle.textContent!==active.label)subtitle.textContent=active.label;const data=JSON.stringify(items);if(data!==previous){previous=data;if(embedded)parent.postMessage({type:'info-toc',items},location.origin)}}
new MutationObserver(report).observe(q('#slideSidebarList'),{subtree:true,childList:true,attributes:true,characterData:true});report();
window.addEventListener('message',e=>{if(e.source!==parent||e.origin!==location.origin)return;const d=e.data;if(d?.type==='info-key'&&!editing(document.activeElement))move(d.key);else if(d?.type==='info-jump'){q('#slideSidebarList').children[d.index]?.click()}else if(d?.type==='info-fullscreen'){window.infoFullscreen.setExternal(d.on)}});
if(embedded){document.body.classList.add('shell-embedded');window.addEventListener('load',()=>{window.focus();report()})}
})();

