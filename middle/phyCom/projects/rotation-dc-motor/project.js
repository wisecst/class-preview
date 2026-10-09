(()=>{'use strict';
 const pages=[...document.querySelectorAll('main.wrap>.slide')],list=document.getElementById('slideSidebarList');
 const titles=['프로젝트 안내','회로 연결','코드 작성 안내','실제 코드'];let page=0,step=0,completed=false;
 const blocks=[...document.querySelectorAll('#projectCode [data-step]')],result=document.getElementById('projectResult'),input=document.getElementById('rotationInput');
 function stop(){result.classList.remove('running');document.getElementById('projectStop').disabled=true;result.hidden=true}
 function renderCode(){blocks.forEach((b,i)=>{b.classList.toggle('entry-show',i<step);b.classList.toggle('entry-current',i===step-1)});document.getElementById('projectLoop').classList.toggle('repeat-show',step>=3);
  const tab=blocks[step-1]?.dataset.tab;document.querySelectorAll('.entry-tab').forEach(el=>el.classList.toggle('active-tab',el.dataset.tab===tab));
  document.getElementById('projectProgress').textContent=step===6?'코드 완성! 실행 버튼으로 결과를 확인해 보세요.':`다음 버튼으로 코드를 연결합니다. (${step} / 6)`;document.getElementById('projectRun').disabled=step<6;
  document.getElementById('projectSave').disabled=document.getElementById('projectComplete').disabled=!completed;
 }
 function show(index){stop();page=Math.max(0,Math.min(3,index));pages.forEach((p,i)=>p.classList.toggle('active',i===page));[...list.children].forEach((b,i)=>b.classList.toggle('active',i===page));document.getElementById('slides').textContent=`${page+1} / 4`;document.getElementById('prev').disabled=page===0;document.getElementById('next').disabled=page===3&&step===6;renderCode()}
 function next(){if(!result.hidden){stop();return}if(page===3){if(step<6){step++;renderCode();document.getElementById('next').disabled=step===6}return}show(page+1)}
 function previous(){if(!result.hidden){stop();return}if(page===3&&step>0){step--;renderCode();document.getElementById('next').disabled=false;return}show(page-1)}
 titles.forEach((title,i)=>{const b=document.createElement('button');b.type='button';b.className='slide-sidebar-item';b.innerHTML=`<span class="sidebar-page-no">${i+1}</span><span>${title}</span>`;b.addEventListener('click',()=>show(i));list.append(b)});
 document.getElementById('next').addEventListener('click',next);document.getElementById('prev').addEventListener('click',previous);
 document.addEventListener('keydown',e=>{const d=window.lessonUI.direction(e);if(!d)return;e.preventDefault();d>0?next():previous()});
 // Integer 0..5 conversion is shared by every readout and fan output.
 function convert(value){return Math.max(0,Math.min(5,Math.round(Number(value)*5/1023)))}
 function update(){const value=Number(input.value),level=convert(value),output=level*25;document.getElementById('rotationDial').setAttribute('aria-valuenow',value);document.getElementById('analogValue').textContent=value;document.getElementById('liveStep').textContent=level;document.getElementById('projectNumber').textContent=level;document.getElementById('liveOutput').textContent=output;document.getElementById('liveFan').textContent=level?`바람 세기 ${level}단계`:'정지';result.style.setProperty('--fan-period',level?`${2.4/level}s`:'2.4s');result.classList.toggle('running',level>0);document.querySelector('.dial-pointer').style.transform=`rotate(${-120+value/1023*240}deg)`}
 input.addEventListener('input',update);
 const dial=document.getElementById('rotationDial');
 function turn(e){const rect=dial.getBoundingClientRect(),angle=Math.atan2(e.clientX-rect.left-rect.width/2,rect.top+rect.height/2-e.clientY)*180/Math.PI;input.value=Math.round((Math.max(-120,Math.min(120,angle))+120)/240*1023);update();dial.setAttribute('aria-valuenow',input.value)}
 dial.addEventListener('pointerdown',e=>{dial.setPointerCapture(e.pointerId);turn(e)});dial.addEventListener('pointermove',e=>{if(dial.hasPointerCapture(e.pointerId))turn(e)});
 dial.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowDown','ArrowRight','ArrowUp','Home','End'].includes(e.key)){e.preventDefault();e.stopPropagation();input.value=e.key==='Home'?0:e.key==='End'?1023:Number(input.value)+(['ArrowRight','ArrowUp'].includes(e.key)?21:-21);update();dial.setAttribute('aria-valuenow',input.value)}});

 document.getElementById('projectRun').addEventListener('click',()=>{if(step<6)return;result.hidden=false;completed=true;window.lessonUI.completeResult(pages[3]);document.getElementById('projectSave').classList.add('enabled');document.getElementById('projectComplete').classList.add('enabled');renderCode();document.getElementById('projectStop').disabled=false;update()});
 document.getElementById('projectStop').addEventListener('click',stop);document.getElementById('projectResultClose').addEventListener('click',stop);
 window.lessonUI.bindOutside({key:'fan-project',isOpen:()=>!result.hidden,inside:'#projectResult,#projectRun,#projectStop',close:stop});
 document.getElementById('projectSave').addEventListener('click',()=>{const source={project:'rotation-dc-motor',object:'숫자 버튼',variable:'단계',input:'A1',range:[0,1023,0,5],output:'D10',multiplier:25};const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(source,null,2)],{type:'application/json'}));a.download='rotation-dc-motor.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)});
 document.getElementById('projectComplete').addEventListener('click',()=>{localStorage.setItem('phycom-project-rotation-dc-motor-complete','1');document.getElementById('projectComplete').textContent='학습완료 ✓'});
 show(0);
})();
