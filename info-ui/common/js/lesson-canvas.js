/* Fit one 1366x768 composition to the usable Safari viewport. */
(()=>{'use strict';
const canvas=document.getElementById('lessonCanvas'),controls=document.getElementById('lessonControls');
if(!canvas)return;
const q=s=>document.querySelector(s);
function fit(){const v=window.visualViewport,w=v?.width||innerWidth,h=v?.height||innerHeight;const side=w<=1024&&w/h>1.9;const reserve=side?8:58,usableWidth=side?w-136:w;const scale=Math.min(usableWidth/1366,(h-reserve)/768);window.infoLessonScale=Math.max(.1,scale);canvas.style.transform=`scale(${window.infoLessonScale})`;canvas.style.left=((usableWidth-1366*window.infoLessonScale)/2+(v?.offsetLeft||0))+'px';canvas.style.top=((h-reserve-768*window.infoLessonScale)/2+(v?.offsetTop||0))+'px';canvas.style.setProperty('--canvas-scale',window.infoLessonScale);}
fit();window.addEventListener('resize',fit);window.visualViewport?.addEventListener('resize',fit);window.visualViewport?.addEventListener('scroll',fit);document.addEventListener('fullscreenchange',fit);
function sync(){q('#touchCount').textContent=q('#slides').textContent;q('#touchPrev').disabled=q('#prev').disabled;const open=q('#pinDialog').open||!q('#dialogOverlay').hidden||!q('.hc-overlay')?.hidden;q('#touchClose').hidden=!open;}
q('#touchPrev').addEventListener('click',()=>q('#prev').click());q('#touchNext').addEventListener('click',()=>q('#next').click());q('#lessonMenu').addEventListener('click',()=>{canvas.classList.toggle('menu-open');q('#lessonMenu').setAttribute('aria-expanded',String(canvas.classList.contains('menu-open')));});
q('#touchClose').addEventListener('click',()=>{if(q('#pinDialog').open)q('#pinDialog [data-close-dialog]').click();else if(!q('#dialogOverlay').hidden)q('#closeDialog').click();else q('.hc-overlay .entry-result-close')?.click();});
q('#slideSidebarList').addEventListener('click',()=>canvas.classList.remove('menu-open'));
/* Outside-close handlers must treat these buttons as the original navigation. */
controls.addEventListener('pointerdown',()=>{}, {passive:true});
new MutationObserver(sync).observe(canvas,{subtree:true,attributes:true,attributeFilter:['class','hidden','open','disabled'],childList:true,characterData:true});sync();
})();
