const lessonDialogs=[...document.querySelectorAll('.lesson-dialog')];
document.querySelectorAll('[data-open-dialog]').forEach(trigger=>{
  trigger.addEventListener('click',()=>{
    const dialog=document.getElementById(trigger.dataset.openDialog);
    if(dialog&&!dialog.open){
      dialog.showModal();
      if(si===0){if(dialog.id==='diodeDialog')introActionStep=1;else if(dialog.id==='pinDialog')introActionStep=3;}
      syncIntroNav();
    }
  });
});
lessonDialogs.forEach(dialog=>{
  dialog.querySelector('[data-close-dialog]')?.addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
  dialog.addEventListener('close',()=>{
    if(si!==0)return;
    if(dialog.id==='diodeDialog'&&introActionStep===1)introActionStep=2;
    else if(dialog.id==='pinDialog'&&introActionStep===3)introActionStep=4;
    syncIntroNav();
  });
});

const ss=[...document.querySelectorAll('.slide')];
let si=0;
let introActionStep=0;
const pv=document.querySelector('#prev'),nx=document.querySelector('#next');
const mobilePrev=document.querySelector('#mobilePrev'),mobileNext=document.querySelector('#mobileNext');
mobilePrev?.addEventListener('click',()=>pv.click());
mobileNext?.addEventListener('click',()=>nx.click());
function syncMobileNav(){
 if(mobilePrev)mobilePrev.disabled=pv.disabled;
 if(mobileNext){mobileNext.disabled=nx.disabled;mobileNext.setAttribute('aria-label',nx.getAttribute('aria-label'));}
}
function syncIntroNav(){
  if(si===0)pv.disabled=introActionStep===0;
  syncMobileNav();
}
function openIntroDialog(id,step){
  const dialog=document.getElementById(id);
  if(!dialog)return;
  introActionStep=step;
  if(!dialog.open)dialog.showModal();
  syncIntroNav();
}
function closeIntroDialog(id,step){
  const dialog=document.getElementById(id);
  introActionStep=step;
  if(dialog?.open)dialog.close();
  syncIntroNav();
}
function advanceIntro(){
  if(introActionStep===0)openIntroDialog('diodeDialog',1);
  else if(introActionStep===1)closeIntroDialog('diodeDialog',2);
  else if(introActionStep===2)openIntroDialog('pinDialog',3);
  else if(introActionStep===3){closeIntroDialog('pinDialog',4);show(1);}
  else show(1);
}
function previousIntro(){
  if(introActionStep===4)openIntroDialog('pinDialog',3);
  else if(introActionStep===3)closeIntroDialog('pinDialog',2);
  else if(introActionStep===2)openIntroDialog('diodeDialog',1);
  else if(introActionStep===1)closeIntroDialog('diodeDialog',0);
  else pv.disabled=true;
}
const sidebarList=document.querySelector('#slideSidebarList');
if(sidebarList){
 const names=['1. LED 알아보기','2. 회로 연결','3. LED 코드 만들기','4. 디지털 출력 블록 비교','5. PWM','6. 코딩 전 설정','7. PWM 코드 작성','8. PWM 코드 살펴보기'];
 ss.forEach((slide,i)=>{
   const b=document.createElement('button');
   b.type='button';b.className='slide-sidebar-item';
   b.innerHTML='<span class="sidebar-page-no">'+(i+1)+'</span><span>'+(names[i]||slide.querySelector('h2')?.textContent||('페이지 '+(i+1)))+'</span>';
   b.addEventListener('click',()=>{
     document.querySelector('#pwmPinBoardPopup')?.classList.remove('show');
     comparePopupShown=false;
     show(i);
   });
   sidebarList.appendChild(b);
 });
}
let circuitStep=0;
let comparePopupShown=false;
let sceneStep=0;
let objectStage='select';
let manualSetupDialog=null;
let chosenLed=4;
let selectedLed=null;
const ledNames={1:'파란LED',2:'초록LED',3:'빨간LED',4:'노란LED'};
const ledColors={1:'blue',2:'green',3:'red',4:'yellow'};
function updateSetupNumbers(slide,step,objectStage){
 const markers=new Map([...slide.querySelectorAll('.setup-number')].map(marker=>[Number(marker.textContent),marker]));
 markers.forEach(marker=>{marker.style.display='none';marker.style.left='';marker.style.top='';});
 const entries=[];
 const add=(number,selector,direction='left',offsetY=0)=>{
  const target=slide.querySelector(selector);
  if(target&&target.getClientRects().length)entries.push({number,target,direction,offsetY});
 };
 if(step===0)add(1,'#sceneAdd','right');
 if(step===1){add(1,'[data-scene="2"]','right');add(2,'#openObjectChooser','right');}
 if(step===2||step===3||(step===4&&(objectStage==='select'||objectStage==='confirm')))add(3,'#objectSearch','left');
 if(step===4&&(objectStage==='select'||objectStage==='confirm'))add(4,'#ledOptions [data-led-option="4"]','left');
 if(step===4&&objectStage==='confirm')add(5,'#confirmObject','left',-35/58.8);
 if(step===6){
  add(6,'.entry-setup-tabs .active','left',-34/58.8);
  add(7,'#selectVariableTab','left');
  add(8,'#openVariableChooser','left');
 }
 if(step===7){
  add(6,'.entry-setup-tabs .active','left',-34/58.8);
  add(7,'#selectVariableTab','left');
  add(8,'#openVariableChooser','left');
  add(9,'#variableName','left');
  add(10,'#confirmVariable','left');
 }
 if(step===9)add(11,'#enableVariableSlider','left');
 if(step===10){add(11,'#enableVariableSlider','left');add(12,'#variableMax','right');}
 const slideRect=slide.getBoundingClientRect();
 const scaleX=slideRect.width/(slide.offsetWidth||slideRect.width)||1;
 const scaleY=slideRect.height/(slide.offsetHeight||slideRect.height)||1;
 entries.forEach(({number,target,direction,offsetY})=>{
  const marker=markers.get(number);
  if(!marker)return;
  marker.textContent=String(number);
  marker.style.display='block';
  const box=marker.getBoundingClientRect(),anchor=target.getBoundingClientRect();
  const gap=(box.width/scaleX)*(16/58.8);
  const x=direction==='right'?anchor.right+gap*scaleX:anchor.left-box.width-gap*scaleX;
  const y=anchor.top+box.height*offsetY*scaleY;
  marker.style.left=((x-slideRect.left)/scaleX)+'px';
  marker.style.top=((y-slideRect.top)/scaleY)+'px';
 });
}
function positionObjectCompleteCallout(slide,step){
 const bubble=slide.querySelector('#objectCompleteCallout');
 const caption=slide.querySelector('#sceneGuide');
 if(!bubble)return;
 const visible=step===5;
 bubble.hidden=!visible;
 if(caption)caption.hidden=visible;
 if(!visible)return;
 const led=slide.querySelector('.entry-setup-led')?.getBoundingClientRect();
 const actions=slide.querySelector('.entry-setup-actions')?.getBoundingClientRect();
 const stage=slide.querySelector('.entry-setup-stage');
 if(!led||!actions||!stage)return;
 const stageRect=stage.getBoundingClientRect();
 const scaleX=stageRect.width/(stage.offsetWidth||stageRect.width)||1;
 const scaleY=stageRect.height/(stage.offsetHeight||stageRect.height)||1;
 bubble.style.left=((led.left+led.width/2-stageRect.left)/scaleX)+'px';
 bubble.style.top=(((led.bottom+actions.top)/2-stageRect.top)/scaleY)+'px';
}
function updateScene(){
 const slide=document.querySelector('.entry-setup-slide');if(!slide)return;
 const step=sceneStep, second=slide.querySelector('[data-scene="2"]');
 second.hidden=step<1;
 second.classList.toggle('active',step>=1);
 slide.querySelector('[data-scene="1"]').classList.toggle('active',step<1);
 const layout=slide.querySelector('.entry-setup-layout');
 layout.dataset.setupStep=String(step);
 layout.dataset.objectStage=step===4?objectStage:'';
 const objectDialog=slide.querySelector('#objectChooser');
 const objectOpen=manualSetupDialog==='object'||(!manualSetupDialog&&step>=2&&step<=4);
 objectDialog.hidden=!objectOpen;
 objectDialog.setAttribute('aria-hidden',String(!objectOpen));
 const search=slide.querySelector('#objectSearch');
 if(!manualSetupDialog)search.value=step>=2?'LED':'';
 slide.querySelector('#ledOptions').hidden=!search.value.trim().toUpperCase().includes('LED');
 slide.querySelectorAll('[data-led-option]').forEach(button=>button.classList.toggle('selected',Number(button.dataset.ledOption)===selectedLed));
 const preview=slide.querySelector('#objectSelectedPreview');
 preview.hidden=!selectedLed;preview.className=selectedLed?ledColors[selectedLed]:'';
 slide.querySelector('#objectSelectedCount').textContent=selectedLed?'1':'0';
 slide.querySelector('#objectSelectedName').textContent=ledNames[selectedLed||4];
 slide.querySelector('#confirmObject').disabled=!selectedLed;
 const led=slide.querySelector('.entry-setup-led');
 led.className='entry-setup-led '+ledColors[chosenLed];
 led.setAttribute('aria-label','추가한 '+ledNames[chosenLed]+' 오브젝트');
 slide.querySelector('.added-led').className='entry-setup-object added-led '+ledColors[chosenLed];
 const objectName=slide.querySelector('#addedLedLabel');
 if(document.activeElement!==objectName&&step<5)objectName.value=ledNames[chosenLed];
 slide.querySelector('#propertyLedName').textContent=objectName.value||ledNames[chosenLed];
 slide.querySelector('#ledProperty').hidden=step<5;
 const variableTab=slide.querySelector('#selectVariableTab');
 variableTab.classList.toggle('active',step>=6);
 slide.querySelector('#openVariableChooser').hidden=step<6;
 slide.querySelector('#variableFolder').hidden=step<6;
 slide.querySelector('#variableChooser').hidden=step!==7&&manualSetupDialog!=='variable';
 slide.querySelector('#setupVariable').hidden=step<8;
 slide.querySelector('#variableCount').textContent=step>=8?'1':'0';
 const name=slide.querySelector('#variableName').value.trim()||'LED밝기';
 slide.querySelector('#variablePropertyName').value=name;
 slide.querySelector('#stageVariableName').textContent=name;
  const stageVariable=slide.querySelector('#stageVariable');
 stageVariable.hidden=step<8;
 const sliderOn=step>=9;
 slide.querySelector('#enableVariableSlider').checked=sliderOn;
 slide.querySelector('#variableRange').hidden=!sliderOn;
 slide.querySelector('#stageVariableSlider').hidden=!sliderOn;
 slide.querySelector('#variableMax').value=step>=10?'255':'100';
 slide.querySelector('#stageVariableSlider').max=slide.querySelector('#variableMax').value;
 const captions=[
   '장면 1 옆의 +를 눌러 새 장면을 만듭니다.',
   '+오브젝트 추가하기 버튼을 클릭합니다.',
   '',
   '대문자로 LED를 검색합니다.',
   '선택한 오브젝트가 전체 리스트에 표기 됩니다',
   '추가한 오브젝트의 이름과 위치, 크기를 설정할 수 있습니다.',
   '속성 탭에서 변수를 선택합니다.',
   '변수 이름에 LED밝기를 입력합니다.',
   'LED밝기 변수가 기본값 0으로 장면에 표시됩니다.',
   '슬라이드를 체크하면 장면의 변수 표시가 슬라이드로 바뀝니다.',
   '슬라이드 값 범위를 0부터 255까지 설정했습니다.'
 ];
 slide.querySelector('#sceneGuide').textContent=step===4&&objectStage==='confirm'
  ?'추가하기 버튼을 누르면 선택한 오브젝트가 추가됩니다.'
  :captions[step];
 updateSetupNumbers(slide,step,step===4?objectStage:'');
 positionObjectCompleteCallout(slide,step);
}
window.addEventListener('resize',()=>{
 const slide=document.querySelector('.entry-setup-slide'),layout=slide?.querySelector('.entry-setup-layout');
 if(slide?.classList.contains('active')&&layout){updateSetupNumbers(slide,Number(layout.dataset.setupStep),layout.dataset.objectStage);positionObjectCompleteCallout(slide,Number(layout.dataset.setupStep));}
});
function advanceSetup(){
 if(manualSetupDialog)manualSetupDialog=null;
 if(sceneStep===1){sceneStep=3;updateScene();return;}
 if(sceneStep===4){
  if(!selectedLed)return;
  if(objectStage==='confirm'){
   chosenLed=selectedLed;
   document.querySelector('#addedLedLabel').value=ledNames[chosenLed];
   sceneStep=5;
   objectStage='select';
   manualSetupDialog=null;
   updateScene();
   return;
  }
  objectStage='confirm';updateScene();return;
 }
 if(sceneStep<10){
  sceneStep++;
  if(sceneStep===4)selectedLed=4;
  if(sceneStep===5)chosenLed=selectedLed||4;
  if(sceneStep===7)document.querySelector('#variableName').value='LED밝기';
  updateScene();
 }else show(6);
}
function previousSetup(){
 if(manualSetupDialog){manualSetupDialog=null;updateScene();return;}
 if(sceneStep===4&&objectStage==='confirm'){objectStage='select';updateScene();return;}
 if(sceneStep>0){sceneStep--;selectedLed=sceneStep>=4?chosenLed:null;updateScene();}
 else show(4);
}
document.querySelector('#sceneAdd')?.addEventListener('click',()=>{sceneStep=1;objectStage='select';manualSetupDialog=null;selectedLed=null;updateScene();});
document.querySelector('[data-scene="2"]')?.addEventListener('click',()=>{sceneStep=1;objectStage='select';manualSetupDialog=null;selectedLed=null;updateScene();});
document.querySelector('#addedLedLabel')?.addEventListener('input',event=>{document.querySelector('#propertyLedName').textContent=event.target.value;});
document.querySelector('#variablePropertyName')?.addEventListener('input',event=>{document.querySelector('#stageVariableName').textContent=event.target.value;document.querySelector('#variableName').value=event.target.value;});
document.querySelector('#variableDefault')?.addEventListener('input',event=>{document.querySelector('#stageVariableValue').textContent=event.target.value;});
document.querySelector('#openObjectChooser')?.addEventListener('click',()=>{manualSetupDialog='object';sceneStep=Math.max(3,sceneStep);selectedLed=null;document.querySelector('#objectSearch').value='';updateScene();});
document.querySelector('#selectVariableTab')?.addEventListener('click',()=>{sceneStep=Math.max(6,sceneStep);updateScene();});
document.querySelector('#openVariableChooser')?.addEventListener('click',()=>{sceneStep=Math.max(7,sceneStep);manualSetupDialog='variable';updateScene();});
document.querySelectorAll('.entry-setup-slide [data-setup-close]').forEach(button=>button.addEventListener('click',()=>{manualSetupDialog=null;if(sceneStep===7)sceneStep=6;updateScene();}));
document.querySelector('#objectSearch')?.addEventListener('input',event=>{
 const found=event.target.value.trim().toUpperCase().includes('LED');
 document.querySelector('#ledOptions').hidden=!found;
 if(!found){selectedLed=null;updateScene();}
});
document.querySelectorAll('[data-led-option]').forEach(button=>button.addEventListener('click',()=>{
 selectedLed=Number(button.dataset.ledOption);sceneStep=Math.max(4,sceneStep);objectStage='select';updateScene();
}));
document.querySelector('#confirmObject')?.addEventListener('click',()=>{
 if(!selectedLed)return;
 chosenLed=selectedLed;
 document.querySelector('#addedLedLabel').value=ledNames[chosenLed];
 document.activeElement?.blur?.();
 if(sceneStep===4&&objectStage==='confirm'){manualSetupDialog=null;updateScene();return;}
 sceneStep=5;objectStage='select';manualSetupDialog=null;
 updateScene();
});
document.querySelector('#confirmVariable')?.addEventListener('click',()=>{sceneStep=8;manualSetupDialog=null;updateScene();});
document.querySelector('#enableVariableSlider')?.addEventListener('change',event=>{sceneStep=event.target.checked?9:8;updateScene();});
document.querySelector('#variableMax')?.addEventListener('change',event=>{if(event.target.value==='255'){sceneStep=10;updateScene();}});
document.querySelector('#stageVariableSlider')?.addEventListener('input',event=>{document.querySelector('#stageVariableValue').textContent=event.target.value;});
function show(n){if(window.hardwareConnect?.before(si,n,show))return;const from=si;const target=Math.max(0,Math.min(ss.length-1,n));
if(from!==target)window.ledCodeEngine?.leave(ss[from]);
if(from===4&&target!==4)window.pwmLesson?.stop();
 lessonDialogs.forEach(dialog=>{if(dialog.open)dialog.close();});
const pwmPopup=document.querySelector('#pwmPinBoardPopup');
/* Returning from PWM (5) to comparison (4): show the board popup again.
   It is transient; the next backward signal closes it and reveals page 4. */
const returnToCompare=from===4&&target===3;
if(!returnToCompare){pwmPopup?.classList.remove('show');pwmPopup?.setAttribute('aria-hidden','true');}
 if(from!==target&&ss[from]?.classList.contains('p9-code-learning'))window.ledInitializationLesson?.stop?.();
 if(from!==target&&ss[from]?.classList.contains('p13-eight-code'))window.eightCodeLesson?.stop?.();
 si=target;
if(si===0&&from===1&&introActionStep===4){introActionStep=3;document.querySelector('#pinDialog')?.showModal();}
ss.forEach((s,i)=>s.classList.toggle('active',i===si));
if(from!==si)window.ledCodeEngine?.activate(ss[si],from===si+1);
 getPwmStudyLesson(si)?.activate?.(from===si+1);
pv.disabled=si===0&&introActionStep===0;
nx.disabled=false;
nx.setAttribute('aria-label',si===5?'설정 다음 단계':'다음 슬라이드');
document.querySelector('#slides').textContent=window.hardwareConnect?.number(si,ss.length)||(si+1)+' / '+ss.length;
document.body.classList.toggle('after-intro',si>0);
  document.body.classList.toggle('entry-page',ss[si].classList.contains('entry-slide'));
document.querySelectorAll('.slide-sidebar-item').forEach((b,i)=>b.classList.toggle('active',i===si));
const subtitle=document.querySelector('#slideSubtitle');
if(subtitle){let t=si>0?(ss[si].querySelector('h2')?.textContent||''):'';if(si===1)t='2. 회로 연결';subtitle.textContent=t;}
if(returnToCompare){
 pwmPopup?.classList.add('show');pwmPopup?.setAttribute('aria-hidden','false');
 comparePopupShown=true;
}else if(si===3){
 comparePopupShown=false;
}
if(si===5){sceneStep=from===6?10:0;manualSetupDialog=null;selectedLed=null;updateScene();}
if(si===2&&from!==2&&window.entryLesson?.isFinished?.()){
 requestAnimationFrame(()=>window.entryLesson.showCompleted());
}
if(si===1&&window.lessonCircuit){
 requestAnimationFrame(()=>requestAnimationFrame(()=>{
   window.lessonCircuit.refresh();
   if(from===2)window.lessonCircuit.setStep(3);
 }));
}
 syncMobileNav();
}function getPwmStudyLesson(index){
 const slide=ss[index];if(!slide)return;
 if(slide.classList.contains('p13-eight-code'))return window.eightCodeLesson;
 if(slide.classList.contains('p9-code-learning'))return window.ledInitializationLesson;
 const lessons={'pwm-range-slide':window.pwmRangeLesson,'p9-learning':window.page9Lesson,'p10-learning':window.page10Lesson,'p11-learning':window.page11Lesson,'p12-learning':window.page12Lesson};
 return Object.entries(lessons).find(([name])=>slide.classList.contains(name))?.[1];
}
function previousSlideStep(){
 const engine=window.ledCodeEngine?.active();if(engine){if(!engine.prev())show(si-1);return;}
 if(si===0){previousIntro();}
 
 else if(getPwmStudyLesson(si)?.prev?.()){}
 else if(si===5){previousSetup();}
 else if(si===1){show(0);}
 else if(si===2&&window.entryLesson?.isFinished?.()){show(1);}
 else if(si===2&&window.entryLesson&&window.entryLesson.getStep()>0){window.entryLesson.prev();}
 else if(si===2){show(1);}
 else if(si===4){show(3);}
 else if(si===3&&comparePopupShown){
  document.querySelector('#pwmPinBoardPopup')?.classList.remove('show');
  document.querySelector('#pwmPinBoardPopup')?.setAttribute('aria-hidden','true');
  comparePopupShown=false;
 }else show(si-1);
}
pv.onclick=previousSlideStep;
function advancePwm(){
 const lesson=window.pwmLesson;
 if(!lesson)return;
 if(lesson.isPlaying()){show(5);return;}
 if(lesson.canNext())lesson.next();
 else lesson.play();
}
function nextSlideStep(){
 const engine=window.ledCodeEngine?.active();if(engine){if(!engine.next())show(si+1);return;}
 if(si===0){advanceIntro();return;}

 if(getPwmStudyLesson(si)){if(!getPwmStudyLesson(si).next())show(si+1);return;}
 if(si===5){advanceSetup();return;}
 if(si===4){advancePwm();return;}
 if(si===3&&!comparePopupShown){const p=document.querySelector('#pwmPinBoardPopup');p?.classList.add('show');p?.setAttribute('aria-hidden','false');if(p)window.lessonUI.completeResult(document.querySelector('.slide.active'));comparePopupShown=true;return;}
 if(si===3&&comparePopupShown){document.querySelector('#pwmPinBoardPopup')?.classList.remove('show');show(4);return;}
 if(si===1&&window.lessonCircuit&&window.lessonCircuit.getStep()<3){window.lessonCircuit.next();}else if(si===2&&window.entryLesson){if(window.entryLesson.isFinished?.())show(si+1);else window.entryLesson.next();}else show(si+1)}
nx.onclick=nextSlideStep;

// 키보드/프리젠터 조작
// 일반적인 프리젠터는 PageUp/PageDown 또는 좌/우 방향키 신호를 보내므로 함께 지원합니다.
// F5는 브라우저 기본 새로고침 키라 웹페이지가 직접 가로챌 수 없습니다.
// 대신 F 키로 전체화면을 전환하고, 브라우저 자체 F11 전체화면도 사용할 수 있습니다.
document.addEventListener('keydown', async (e)=>{
  const navigationKey=['ArrowRight','PageDown',' ','ArrowLeft','PageUp','Home','End'].includes(e.key);
  if(lessonDialogs.some(dialog=>dialog.open)&&!navigationKey)return;
  const tag=(e.target.tagName||'').toLowerCase();
  if(tag==='input'||tag==='textarea'||e.target.isContentEditable) return;
  if(si===5&&sceneStep>=5&&['Enter','NumpadEnter'].includes(e.key)){
    e.preventDefault();advanceSetup();return;
  }
  if(window.lessonUI.direction(e)>0){
    e.preventDefault();
    nextSlideStep();
    return;
  }
  if(window.lessonUI.direction(e)<0){
    e.preventDefault();
    previousSlideStep();
    return;
  }
  if(e.key==='Home'){e.preventDefault(); show(0); return;}
  if(e.key==='End'){e.preventDefault(); show(ss.length-1); return;}
  if(e.key==='f'||e.key==='F'){
    e.preventDefault();
    try{
      await window.lessonStage.toggleFullscreen();
    }catch(err){}
  }
});
// 편집 모드: 주소 뒤에 ?edit=1을 붙이면 표시됩니다.
const editMode = new URLSearchParams(location.search).get('edit') === '1';
if (editMode) {
  const panel = document.createElement('aside');
  panel.className = 'edit-panel';
  panel.innerHTML = `
    <h3>LED 페이지 편집 모드</h3>
    <label>글자 배경색</label>
    <input id="editLeadBg" type="color" value="#fff3c4">
    <label>LED 글자색</label>
    <input id="editLedColor" type="color" value="#e63946">
    <label>다이오드 글자색</label>
    <input id="editDiodeColor" type="color" value="#6a4c93">
    <label>말풍선 배경색</label>
    <input id="editBubbleBg" type="color" value="#6a4c93">
    <label>말풍선 위치(위·아래)</label>
    <input id="editBubbleY" type="range" min="-20" max="30" value="0">
    <label>이미지 크기</label>
    <input id="editImageWidth" type="range" min="300" max="900" value="700">
    <label>이미지 가로 위치</label>
    <input id="editImageX" type="range" min="-180" max="180" value="0">
    <div class="edit-actions">
      <button id="editSave">브라우저에 저장</button>
      <button id="editExport">HTML 다운로드</button>
      <button id="editReset">초기화</button>
    </div>
    <p class="hint">수정 내용은 우선 이 브라우저에 저장됩니다. HTML 다운로드 후 GitHub에 올리면 다른 기기에서도 사용할 수 있습니다.</p>
  `;
  document.body.append(panel);
  const lead = document.querySelector('.lead');
  const led = document.querySelector('.led-name');
  const diode = document.querySelector('.diode-word');
  const bubble = document.querySelector('.diode-bubble');
  const image = document.querySelector('.module-photo');
  const controls = {
    leadBg: document.querySelector('#editLeadBg'),
    ledColor: document.querySelector('#editLedColor'),
    diodeColor: document.querySelector('#editDiodeColor'),
    bubbleBg: document.querySelector('#editBubbleBg'),
    bubbleY: document.querySelector('#editBubbleY'),
    imageWidth: document.querySelector('#editImageWidth'),
    imageX: document.querySelector('#editImageX')
  };
  const apply = () => {
    lead.style.backgroundColor = controls.leadBg.value;
    led.style.color = controls.ledColor.value;
    diode.style.color = controls.diodeColor.value;
    bubble.style.backgroundColor = controls.bubbleBg.value;
    bubble.style.transform = `translateY(${controls.bubbleY.value}px)`;
    image.style.width = `${controls.imageWidth.value}px`;
    image.style.transform = `translateX(${controls.imageX.value}px)`;
  };
  const key = 'led-lesson-edit-settings';
  const saved = JSON.parse(localStorage.getItem(key) || 'null');
  if (saved) Object.keys(controls).forEach(k => { if (saved[k] !== undefined) controls[k].value = saved[k]; });
  Object.values(controls).forEach(input => input.addEventListener('input', apply));
  apply();
  document.querySelector('#editSave').onclick = () => {
    const data = Object.fromEntries(Object.entries(controls).map(([k, v]) => [k, v.value]));
    localStorage.setItem(key, JSON.stringify(data));
    alert('이 브라우저에 저장했습니다.');
  };
  document.querySelector('#editReset').onclick = () => {
    localStorage.removeItem(key);
    location.reload();
  };
  document.querySelector('#editExport').onclick = () => {
    panel.remove();
    const html = '<!doctype html>\\n' + document.documentElement.outerHTML;
    const blob = new Blob([html], {type:'text/html;charset=utf-8'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'led-lesson-edited.html';
    a.click();
  };
}

window.addEventListener("load",()=>{window.hardwareConnect.open=()=>{show(1);window.hardwareConnect.before(1,2,show);};show(si);});

