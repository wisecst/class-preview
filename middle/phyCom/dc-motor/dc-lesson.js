/* DC-only flow: shared servo controller is intentionally left unchanged. */
(()=>{
 'use strict';
 const q=s=>document.querySelector(s),qa=s=>[...document.querySelectorAll(s)];
 const slides=qa('main.wrap > .slide'),basic=qa('[data-entry-step]'),code=qa('#dc5Code [data-step]');
 const principle=q('#dcPrincipleOverlay'),pins=q('#pinDialog'),pinResult=q('#pin13Modal'),result=q('#motorResult'),final=q('#dc5Result');
 let page=0,intro=0,circuit=0,step4=1,step5=1,pin4=0,pin5=0,motor4=0,final5=0,timer=null,runButton=null,value=0;
 const button=q('#dc5Button');
 function closeResults(){
  clearTimeout(timer);timer=null;
  [pinResult,result,final].forEach(el=>{el.hidden=true;el.setAttribute('aria-hidden','true')});
  qa('.motor-motion-fan.running').forEach(el=>el.classList.remove('running'));
  q('.motor-program').classList.remove('running');
  if(runButton){runButton.textContent='▶';runButton.classList.remove('running');runButton=null}
  q('.dc5-save').classList.remove('enabled');q('.dc5-complete').classList.remove('enabled');
 }
 function closePopup(){
  if(!principle.hidden){intro=2;principle.hidden=true;principle.setAttribute('aria-hidden','true')}
  if(pins.open){intro=4;pins.close()}
  if(!pinResult.hidden){if(page===2)pin4=2;else pin5=2}
  if(!result.hidden)motor4=2;
  if(!final.hidden)final5=2;
  closeResults();paint();
 }
 function showIntro(n){
  intro=n;principle.hidden=n!==1;principle.setAttribute('aria-hidden',String(n!==1));
  if(n===3){if(!pins.open)pins.showModal()}else if(pins.open)pins.close();
  if(n===1)q('#dcPrincipleClose').focus();paint();
 }
 function openResult(el,btn){
  closeResults();el.hidden=false;el.setAttribute('aria-hidden','false');
  if(btn){runButton=btn;btn.textContent='■';btn.classList.add('running')}paint();
 }
 function showPin(){
  if(page===2)pin4=1;else pin5=1;
  openResult(pinResult,q(page===2?'#runPin13':'#dc5RunPin13'));
  // Keep the familiar result inside the active Entry workspace.
  slides[page].append(pinResult);requestAnimationFrame(fitCode);
 }
 function runMotor(){
  motor4=1;openResult(result,q('#runMotor'));q('.motor-program').classList.add('running');
  let on=true;
  function tick(){result.querySelector('.motor-motion-fan').classList.toggle('running',on);q('#motorResultText').textContent=on?'회전 중':'정지';on=!on;timer=setTimeout(tick,2000)}
  tick();
 }
 function update(v){
  value=v;q('#dc5LiveStep').textContent=v;button.querySelector('.dc5-number').textContent=v;
  q('#dc5LiveMotor').textContent=v?'회전 중 · 출력 '+v*50:'정지 · 출력 0';
  const rotor=final.querySelector('.motor-motion-fan');rotor.classList.toggle('running',v>0);
  rotor.style.animationDuration=(v?1.26/v:.42)+'s';
 }
 function execute(){
  final5=1;openResult(final);q('.dc5-save').classList.add('enabled');q('.dc5-complete').classList.add('enabled');update(0);
  function tick(){update(value===3?0:value+1);timer=setTimeout(tick,1600)}
  timer=setTimeout(tick,1600);paint();
 }
 function fitCode(){
  if(page<2)return;
  const program=q(page===2?'.motor-program':'#dc5Code'),stage=slides[page].querySelector('.entry-stage');
  program.style.setProperty('transform','none','important');
  const r=window.lessonStage.rect(program),sr=window.lessonStage.rect(stage),modal=[pinResult,result,final].find(x=>!x.hidden);
  const right=modal?window.lessonStage.rect(modal).left-20:sr.right-20;
  const measure=window.lessonStage.measure(program),scale=Math.min(1,(right-r.left)/Math.max(1,measure.width),(sr.bottom-20-r.top)/Math.max(1,measure.height));
  program.style.setProperty('transform','scale('+Math.max(.25,scale)+')','important');
 }
 function paint(){
  basic.forEach(el=>{const n=+el.dataset.entryStep;el.classList.toggle('entry-show',n<=step4);el.classList.toggle('entry-current',n===step4)});
  q('[data-repeat-body]').classList.toggle('repeat-show',step4>=3);q('#runMotor').disabled=step4<basic.length;
  code.forEach(el=>{const n=+el.dataset.step;el.classList.toggle('show',n<=step5);el.classList.toggle('entry-current',n===step5)});
  qa('[data-container-step]').forEach(el=>el.classList.toggle('show',+el.dataset.containerStep<=step5));
  q('.dc5-true').hidden=step5>=7;q('[data-condition]').hidden=step5<7;
  qa('.dc5-indent').forEach(el=>el.classList.toggle('has-code',!!el.querySelector('.show')));
  q('.dc5-click-script').hidden=step5<5;
  const current=page===2?basic.find(el=>+el.dataset.entryStep===step4):code.find(el=>+el.dataset.step===step5);
  slides[page]?.querySelectorAll('.entry-tab').forEach(el=>el.classList.toggle('active-tab',el.dataset.tab===(current?.dataset.tab||(step4===1?'start':'hardware'))));
  q('#prev').disabled=page===0&&intro===0;q('#next').disabled=page===3&&final5===2;
  if(!window.hardwareConnect?.getState().active){
   q('#slides').textContent=window.hardwareConnect?.number(page,slides.length)||(page+1)+' / 5';
   const titles=['1. 개념설명','2. 회로 연결','4. 기본 코드','5. 3단 선풍기'];q('#slideSubtitle').textContent='DC모터 '+titles[page];
   qa('.slide-sidebar-item').forEach((b,i)=>{b.classList.toggle('active',i===page);if(i===page)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
  }
  requestAnimationFrame(fitCode);
 }
 function showPage(n){
  closeResults();principle.hidden=true;principle.setAttribute('aria-hidden','true');if(pins.open)pins.close();
  if(window.hardwareConnect?.before(page,n,showPage))return;
  page=Math.max(0,Math.min(slides.length-1,n));
  slides.forEach((el,i)=>el.classList.toggle('active',i===page));
  document.body.classList.toggle('after-intro',page>0);document.body.classList.toggle('entry-page',page>=2);
  if(page===1)requestAnimationFrame(()=>{window.lessonCircuit.refresh();window.lessonCircuit.setStep(circuit)});
  if(page===0)showIntro(intro);else paint();
 }
 function next(){
  if(page===0){if(intro<4)showIntro(intro+1);else showPage(1);return}
  if(page===1){if(circuit<3)window.lessonCircuit.setStep(++circuit);else showPage(2);return}
  if(!pinResult.hidden||!result.hidden||!final.hidden){closePopup();return}
  if(page===2){
   if(step4===2&&pin4===0){showPin();return}
   if(step4<basic.length){step4++;paint();return}
   if(motor4===0){runMotor();return}
   step5=1;pin5=0;final5=0;showPage(3);return;
  }
  if(step5===2&&pin5===0){showPin();return}
  if(step5<code.length){step5++;paint();return}
  if(final5===0)execute();
 }
 function prev(){
  if(page===0){showIntro(Math.max(0,intro-1));return}
  if(page===1){if(circuit>0)window.lessonCircuit.setStep(--circuit);else {intro=4;showPage(0)}return}
  if(!pinResult.hidden){closeResults();if(page===2)pin4=0;else pin5=0;paint();return}
  if(!result.hidden||!final.hidden){closeResults();if(page===2)motor4=0;else final5=0;paint();return}
  if(page===2){
   if(motor4===2){runMotor();return}
   if(step4===2&&pin4===2){showPin();return}
   if(step4>1){step4--;if(step4===2)pin4=2;motor4=0;paint()}else showPage(1);return;
  }
  if(final5===2){execute();return}
  if(step5===2&&pin5===2){showPin();return}
  if(step5>1){step5--;if(step5===2)pin5=2;final5=0;paint()}else showPage(2);
 }
 q('#prev').addEventListener('click',prev);q('#next').addEventListener('click',next);
 q('#dcPrincipleTrigger').addEventListener('click',()=>showIntro(principle.hidden?1:2));
 q('#dcPrincipleClose').addEventListener('click',closePopup);
 principle.addEventListener('click',e=>{if(e.target===principle)closePopup()});
 q('[data-motor-pins]').addEventListener('click',()=>showIntro(3));
 pins.querySelector('[data-close-dialog]').addEventListener('click',closePopup);
 pins.addEventListener('cancel',e=>{e.preventDefault();closePopup()});
 pins.addEventListener('click',e=>{if(e.target===pins)closePopup()});
 qa('.motor-result .entry-result-close').forEach(b=>b.addEventListener('click',closePopup));
 q('#runPin13').addEventListener('click',()=>pinResult.hidden?showPin():closePopup());
 q('#dc5RunPin13').addEventListener('click',()=>pinResult.hidden?showPin():closePopup());
 q('#runMotor').addEventListener('click',()=>result.hidden?runMotor():closePopup());
 button.addEventListener('click',()=>{if(!final.hidden)update(value===3?0:value+1)});
 button.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();button.click()}});
 window.lessonUI.bindOutside({key:'dc-results',isOpen:()=>[pinResult,result,final].some(x=>!x.hidden),inside:'.motor-result,#runPin13,#runMotor,#dc5RunPin13',close:closePopup});
 document.addEventListener('keydown',e=>{
  if(/input|textarea|select/i.test(e.target.tagName)||e.target.isContentEditable)return;
  const direction=window.lessonUI.direction(e);
  if(direction){e.preventDefault();direction>0?next():prev()}
  else if(e.key==='Escape')closePopup();
  else if(e.key.toLowerCase()==='f'){e.preventDefault();window.lessonStage.toggleFullscreen().catch(()=>{})}
  else if(e.key==='Home'){e.preventDefault();intro=0;showPage(0)}
  else if(e.key==='End'){e.preventDefault();showPage(3)}
 });
 q('#fullscreenBtn').addEventListener('click',()=>window.lessonStage.toggleFullscreen().catch(()=>{}));
 const titles=['개념설명','회로 연결','기본 코드','3단 선풍기'];
 titles.forEach((title,i)=>{const b=document.createElement('button');b.type='button';b.className='slide-sidebar-item';b.innerHTML='<span class="sidebar-page-no">'+(i>=2?i+2:i+1)+'</span><span>'+title+'</span>';b.addEventListener('click',()=>{if(i===0)intro=0;if(i===2){step4=1;pin4=0;motor4=0}if(i===3){step5=1;pin5=0;final5=0}showPage(i)});q('#slideSidebarList').append(b)});
 window.hardwareLessonAdapter={resume:showPage};window.infoMotorController={showPage};
 window.addEventListener('load',()=>{window.hardwareConnect.open=()=>{showPage(1);window.hardwareConnect.before(1,2,showPage)};paint()});
 window.addEventListener('resize',()=>requestAnimationFrame(fitCode));document.addEventListener('fullscreenchange',()=>requestAnimationFrame(fitCode));
 window.addEventListener('pagehide',closeResults);
 showPage(0);
})();
