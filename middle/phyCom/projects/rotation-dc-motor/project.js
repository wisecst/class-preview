(()=>{'use strict';
 const q=s=>document.querySelector(s),pages=[...document.querySelectorAll('main.wrap>.slide')],list=q('#slideSidebarList');
 const titles=['프로젝트 안내','회로 연결','코드 작성 안내','연결 확인','과제 해결'];
 let page=0,step=0,circuit=0,pinSeen=false,completed=false,timer=null,introTimer=null,studyStep=0,studyPinSeen=false,studyInputSeen=false,studyCompleted=false,studyTimer=null,studyValue=0;
 const result=q('#projectResult'),pin=q('#pin13Modal'),code=q('#projectCode');
 // Reuse page 1's existing execution DOM, including dial, readouts and fan.
 const template=q('#introDemo .result-layout').cloneNode(true);
 template.querySelectorAll('[id]').forEach(el=>el.id=el.id.replace(/^intro-/,''));
 template.querySelectorAll('[mask],[clip-path]').forEach(el=>{for(const key of ['mask','clip-path'])if(el.hasAttribute(key))el.setAttribute(key,el.getAttribute(key).replace(/intro-/g,''))});
 result.append(template);
 const sharedInput=q('#rotationInput');
const instructions=['다음 버튼을 누르며 코드를 완성해 보세요.','시작하기 버튼을 클릭했을 때','디지털 13번 핀을 켭니다. 실행 결과를 확인하세요.','자료: 변수 단계의 처음 값은 0입니다.','흐름: 계속 반복하기를 연결합니다. 이후 코드는 반복문 안에 넣습니다.','하드웨어: A1 값을 0~1023에서 0~100으로 바꾸는 블록을 선택합니다.','변환 블록을 변수 단계의 값 자리에 넣습니다.','변환 범위의 100을 5로 바꿉니다.','생김새: 단계1 모양으로 바꾸기','자료: 변수 단계 값을 선택합니다.','단계1 대신 변수 단계 값으로 모양을 바꿉니다.','하드웨어: 디지털 10번 핀을 255로 정하기','계산: 10 × 10 블록을 선택합니다.','255 대신 곱셈 블록을 넣습니다.','자료: 변수 단계 값을 선택합니다.','첫 번째 10 대신 단계 값을 넣습니다.','두 번째 10을 25로 바꿉니다. 계속 반복하기 옆 ▶로 최종 결과를 실행하세요.'];
 const tabs=['start','start','hardware','data','flow','hardware','data','hardware','looks','data','looks','hardware','math','hardware','data','hardware','math'];
 const field=x=>`<span class="field">${x}<span class="select-arrow">▼</span></span>`,num=x=>`<span class="number-field">${x}</span>`;
 const studyInstructions=['다음 버튼을 누르며 연결을 확인해 보세요.','시작하기 버튼을 클릭했을 때','디지털 13번 핀 켜기 · 옆 ▶로 실행 결과를 확인합니다.','계속 반복하기','반복문 안에 안녕! 을 말하기를 넣습니다.','하드웨어: 아날로그 A1 센서의 입력값을 선택합니다.','안녕! 자리에 센서 블록을 넣습니다. 반복문 옆 ▶로 입력을 확인합니다.','D10번 핀 켜기 · 반복문 옆 ▶로 모터와 날개의 회전을 확인합니다.'];
 const studyTabs=['start','start','hardware','flow','looks','hardware','looks','hardware'];
 const studyPage=pages[3],taskPage=pages[4],studyCode=q('#studyCode'),studyResult=q('#studyResult'),studyPin=q('#studyPinModal');
 const taskPalette=q('#taskPalette'),map=q('#taskMap'),shapeValue=q('#taskShapeValue'),product=q('#taskProduct'),factorValue=q('#taskFactorValue'),sensor=q('#studySensor');
 // The existing lessons reveal fixed blocks and expand their existing repeat-body.
 // Reporters keep the very same DOM node when moved from palette to value slot.
 function paintProgram(program,n,loopAt){
  program.querySelectorAll('[data-entry-step]').forEach(el=>{const k=Number(el.dataset.entryStep);el.classList.toggle('entry-show',k<=n);el.classList.toggle('entry-current',k===n)});
  program.querySelector('[data-repeat-body]').classList.toggle('repeat-show',n>=loopAt);
 }
 function paintRun(button,running,enabled=true){button.disabled=!enabled;button.textContent=running?'■':'▶';button.classList.toggle('running',running);button.setAttribute('aria-label',running?'실행 중지':'실행')}
 function renderCode(){
  paintProgram(code,step,4);
  taskPalette.hidden=![5,9,12,14].includes(step);
  (step>=6?q('#taskMapSlot'):taskPalette).append(map);map.hidden=step<5; q('#taskMapMax').textContent=step>=7?5:100;
  if(step>=10){q('#taskShape').replaceChildren(shapeValue)}else{if(!taskPalette.contains(shapeValue))taskPalette.append(shapeValue);q('#taskShape').innerHTML=field('단계1')}
  shapeValue.hidden=step<9;
  if(step>=13){q('#taskOutput').replaceChildren(product)}else{if(!taskPalette.contains(product))taskPalette.append(product);q('#taskOutput').innerHTML=num(255)}
  product.hidden=step<12;
  if(step>=15){q('#taskFactor').replaceChildren(factorValue)}else{if(!taskPalette.contains(factorValue))taskPalette.append(factorValue);q('#taskFactor').innerHTML=num(10)}
  factorValue.hidden=step<14;q('#taskMultiplier').textContent=step>=16?25:10;
  taskPage.querySelectorAll('.entry-tab').forEach(el=>el.classList.toggle('active-tab',el.dataset.tab===tabs[step]));
  q('#projectProgress').textContent=instructions[step];
  code.classList.toggle('running',!result.hidden||!pin.hidden);code.classList.toggle('result-running',!result.hidden);
  paintRun(q('#projectPinRun'),!pin.hidden);paintRun(q('#projectLoopRun'),!result.hidden,step===16);
  if(step===16)code.querySelector('.repeat-block').classList.add('entry-current');
 }
 function renderStudy(){
  paintProgram(studyCode,studyStep,3);
  q('#studyPalette').hidden=studyStep!==5;
  if(studyStep>=6)q('#studySaySlot').replaceChildren(sensor);else{if(!q('#studyPalette').contains(sensor))q('#studyPalette').append(sensor);q('#studySaySlot').innerHTML='<span class="field study-greeting">안녕!</span>'}
  sensor.hidden=studyStep<5;
  studyPage.querySelectorAll('.entry-tab').forEach(el=>el.classList.toggle('active-tab',el.dataset.tab===studyTabs[studyStep]));
  q('#studyProgress').textContent=studyInstructions[studyStep];
  paintRun(q('#studyPinRun'),!studyPin.hidden);paintRun(q('#studyLoopRun'),!studyResult.hidden,studyStep>=6);
  studyCode.classList.toggle('running',!studyResult.hidden||!studyPin.hidden);studyCode.classList.toggle('result-running',!studyResult.hidden);
 }
 function stop(){cancelAnimationFrame(timer);timer=null;result.hidden=true;result.classList.remove('running');pin.hidden=true;studyPin.hidden=true;studyResult.hidden=true;studyResult.classList.remove('running');cancelAnimationFrame(studyTimer);studyTimer=null;renderCode();renderStudy()}
 function convert(value){return Math.max(0,Math.min(5,Math.round(Number(value)*5/1023)))}
 function updateDemo(scope,prefix,value){const level=convert(value);for(const [id,text]of [['analogValue',value],['liveStep',level],['liveNumber',level],['liveOutput',level*25],['liveFan',level?`바람 세기 ${level}단계`:'정지']])q('#'+prefix+id).textContent=text;
  scope.style.setProperty('--fan-period',level?`${2.4/level}s`:'2.4s');scope.classList.toggle('running',level>0);scope.querySelector('.dial-pointer').style.transform=`rotate(${-120+value/1023*240}deg)`;q('#'+prefix+'rotationDial').setAttribute('aria-valuenow',value);q('#'+prefix+'rotationInput').value=value;scope.querySelectorAll('[data-level]').forEach(el=>{const active=Number(el.dataset.level)===level;el.classList.toggle('active',active);el.setAttribute('aria-current',active?'true':'false')});if(!prefix)q('#projectNumber').textContent=level;
 }
 function cycle(scope,prefix){
  const started=performance.now();let frame;
  function animate(now){const phase=((now-started)/14000)%2;const value=Math.round(1023*(phase<=1?phase:2-phase));updateDemo(scope,prefix,value);frame=requestAnimationFrame(animate);if(prefix)introTimer=frame;else timer=frame}
  updateDemo(scope,prefix,0);frame=requestAnimationFrame(animate);return frame;
 }
 function openResult(){if(step!==16)return;stop();result.hidden=false;completed=true;window.lessonUI.completeResult(taskPage);timer=cycle(result,'');renderCode();requestAnimationFrame(fitCode)}
 function openPin(){stop();pin.hidden=false;pinSeen=true;renderCode();requestAnimationFrame(fitCode)}
 function renderCircuit(){q('#projectCircuit').querySelectorAll('[data-circuit-stage]').forEach(el=>{el.style.visibility=Number(el.dataset.circuitStage)<=circuit?'visible':'hidden'});q('#circuitProgress').textContent=['연결할 모듈과 핀을 먼저 확인합니다.','보드 전원: 5V → + / GND → −','모듈 전원: 가변저항 VCC·GND / DC모터 V·G','신호 연결: 가변저항 OUT → A1 / DC모터 S → D10'][circuit]}
 function show(index){index=Math.max(0,Math.min(4,index));if(window.hardwareConnect?.before(page,index,show)) {stop();cancelAnimationFrame(introTimer);return}
  stop();cancelAnimationFrame(introTimer);page=index;pages.forEach((p,i)=>p.classList.toggle('active',i===page));[...list.querySelectorAll('.slide-sidebar-item')].forEach((b,i)=>b.classList.toggle('active',i===page));q('#slides').textContent=window.hardwareConnect?.number(page,5)||`${page+1+(page>=3?1:0)} / 6`;q('#prev').disabled=page===0;q('#next').disabled=false;document.body.classList.toggle('entry-page',page>=3);document.body.classList.toggle('after-intro',page>0);renderCode();renderStudy();renderCircuit();if(page===0)introTimer=cycle(q('#introDemo'),'intro-');requestAnimationFrame(fitCode)}
 function next(){if(!result.hidden||!pin.hidden||!studyResult.hidden||!studyPin.hidden){stop();return}if(page===1&&circuit<3){circuit++;renderCircuit();return}
  if(page===3){if(studyStep===2&&!studyPinSeen){openStudyPin();return}if(studyStep===6&&!studyInputSeen){openStudyResult();return}if(studyStep<7){studyStep++;renderStudy();requestAnimationFrame(fitCode);return}if(!studyCompleted){openStudyResult();return}show(4);return}
  if(page===4){if(step===2&&!pinSeen){openPin();return}if(step<16){step++;renderCode();requestAnimationFrame(fitCode)}return}show(page+1)}
 function previous(){if(!result.hidden||!pin.hidden||!studyResult.hidden||!studyPin.hidden){stop();return}if(page===1&&circuit>0){circuit--;renderCircuit();return}if(page===3&&studyStep>0){studyStep--;if(studyStep<2)studyPinSeen=false;if(studyStep<6)studyInputSeen=false;renderStudy();return}if(page===4&&step>0){step--;if(step<2)pinSeen=false;renderCode();return}show(page-1)}
 // Use the normal motor lesson's stage-fit rule, with no block position calculations.
 function fitCode(){if(page<3)return;const program=page===3?studyCode:code,stage=pages[page].querySelector('.entry-stage');if(!window.lessonStage)return;program.style.setProperty('transform','none','important');const r=window.lessonStage.rect(program),sr=window.lessonStage.rect(stage),right=sr.right-20;const measure=window.lessonStage.measure(program),scale=Math.min(1,(right-r.left)/Math.max(1,measure.width),(sr.bottom-20-r.top)/Math.max(1,measure.height));program.style.setProperty('transform','scale('+Math.max(.25,scale)+')','important')}
 function updateStudy(value){studyValue=Math.max(0,Math.min(1023,Math.round(value)));q('#studyInput').value=studyValue;q('#studySpeech').textContent=studyValue;q('#studyDial').setAttribute('aria-valuenow',studyValue);q('#studyDial .dial-pointer').style.transform=`rotate(${-120+studyValue/1023*240}deg)`}
 const studyFan=q('#studyFan'),fanTemplate=q('#introDemo .fan-area svg').cloneNode(true);
 fanTemplate.querySelectorAll('[id]').forEach(el=>el.id=el.id.replace(/^intro-/,'study-'));
 fanTemplate.querySelectorAll('[mask],[clip-path]').forEach(el=>{for(const key of ['mask','clip-path'])if(el.hasAttribute(key))el.setAttribute(key,el.getAttribute(key).replace(/intro-/g,'study-'))});studyFan.append(fanTemplate);
 function openStudyPin(){stop();studyPin.hidden=false;studyPinSeen=true;renderStudy();requestAnimationFrame(fitCode)}
 function openStudyResult(){if(studyStep<6)return;stop();studyResult.hidden=false;studyInputSeen=true;studyFan.hidden=studyStep<7;studyResult.classList.toggle('motor-check',studyStep>=7);studyResult.querySelector('h2').textContent=studyStep>=7?'D10 출력 · DC모터 작동 확인':'가변저항 입력 확인';studyResult.classList.toggle('running',studyStep>=7);studyResult.style.setProperty('--fan-period','.42s');if(studyStep===7){studyCompleted=true;window.lessonUI.completeResult(studyPage)}renderStudy();startStudyDemo();requestAnimationFrame(fitCode)}
 function startStudyDemo(){const started=performance.now();function animate(now){const phase=((now-started)/14000)%2;updateStudy(1023*(phase<=1?phase:2-phase));studyTimer=requestAnimationFrame(animate)}updateStudy(0);studyTimer=requestAnimationFrame(animate)}
 q('#studyInput').addEventListener('input',e=>updateStudy(Number(e.target.value)));
 // Pointer motion changes raw A1 input continuously, independently of task levels.
 const dial=q('#studyDial');let dragging=false,lastAngle=0;
 const angle=e=>{const r=dial.getBoundingClientRect();return Math.atan2(e.clientY-r.top-r.height/2,e.clientX-r.left-r.width/2)*180/Math.PI};
 dial.addEventListener('pointerdown',e=>{dragging=true;lastAngle=angle(e);dial.setPointerCapture(e.pointerId);e.preventDefault()});
 dial.addEventListener('pointermove',e=>{if(!dragging)return;const next=angle(e),delta=(next-lastAngle+540)%360-180;lastAngle=next;updateStudy(studyValue+delta*1023/240)});
 ['pointerup','pointercancel','lostpointercapture'].forEach(type=>dial.addEventListener(type,()=>dragging=false));
 dial.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(e.key))return;e.preventDefault();e.stopPropagation();updateStudy(e.key==='Home'?0:e.key==='End'?1023:studyValue+(['ArrowRight','ArrowUp'].includes(e.key)?1:-1))});
 studyCode.addEventListener('click',e=>{const control=e.target.closest('#studyPinRun,#studyLoopRun');if(!control)return;if(control.id==='studyPinRun')studyPin.hidden?openStudyPin():stop();else studyResult.hidden?openStudyResult():stop()});
 studyPage.querySelectorAll('[data-study-close]').forEach(b=>b.addEventListener('click',()=>{stop();requestAnimationFrame(fitCode)}));
 window.lessonUI.bindOutside({key:'fan-study',isOpen:()=>!studyResult.hidden||!studyPin.hidden,inside:'#studyResult,#studyPinModal,#studyPinRun,#studyLoopRun',close:stop});
 q('#studySave').addEventListener('click',()=>{if(!studyCompleted)return;const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify({project:'rotation-dc-motor',study:'연결 확인',input:'A1',range:[0,1023],output:'D10'},null,2)],{type:'application/json'}));a.download='rotation-dc-motor-connection.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)});
 q('#studyComplete').addEventListener('click',()=>{if(!studyCompleted)return;localStorage.setItem('phycom-study-rotation-dc-motor-complete','1');q('#studyComplete').textContent='학습완료 ✓'});
 window.addEventListener('resize',()=>requestAnimationFrame(fitCode));document.addEventListener('fullscreenchange',()=>requestAnimationFrame(fitCode));
 updateStudy(0);
 titles.forEach((title,i)=>{const b=document.createElement('button');b.type='button';b.className='slide-sidebar-item';b.innerHTML=`<span class="sidebar-page-no">${i+1+(i>=3?1:0)}</span><span>${title}</span>`;b.addEventListener('click',()=>show(i));list.append(b)});
 window.hardwareLessonAdapter={resume:show};q('#next').addEventListener('click',next);q('#prev').addEventListener('click',previous);
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){stop();return}const d=window.lessonUI.direction(e);if(!d)return;e.preventDefault();d>0?next():previous()});
 code.addEventListener('click',e=>{const control=e.target.closest('#projectPinRun,#projectLoopRun');if(!control)return;if(control.id==='projectPinRun')pin.hidden?openPin():stop();else result.hidden?openResult():stop()});
 q('#projectResultClose').addEventListener('click',stop);q('#pin13Close').addEventListener('click',stop);
 window.lessonUI.bindOutside({key:'fan-project',isOpen:()=>!result.hidden,inside:'#projectResult,#projectLoopRun',close:stop});window.lessonUI.bindOutside({key:'fan-pin13',isOpen:()=>!pin.hidden,inside:'#pin13Modal,#projectPinRun',close:stop});
 sharedInput.addEventListener('input',()=>updateDemo(result,'',Number(sharedInput.value)));
 q('#projectSave').addEventListener('click',()=>{if(!completed)return;const source={project:'rotation-dc-motor',object:'숫자 버튼',variable:'단계',input:'A1',range:[0,1023,0,5],output:'D10',multiplier:25};const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(source,null,2)],{type:'application/json'}));a.download='rotation-dc-motor.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)});
 q('#projectComplete').addEventListener('click',()=>{if(!completed)return;localStorage.setItem('phycom-project-rotation-dc-motor-complete','1');q('#projectComplete').textContent='과제제출 ✓'});
 window.addEventListener('pagehide',()=>{stop();cancelAnimationFrame(introTimer)});show(0);
})();
