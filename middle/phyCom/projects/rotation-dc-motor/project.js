(()=>{'use strict';
 const q=s=>document.querySelector(s),pages=[...document.querySelectorAll('main.wrap>.slide')],list=q('#slideSidebarList');
 const titles=['프로젝트 안내','회로 연결','코드 작성 안내','실제 코드'];
 let page=0,step=0,circuit=0,pinSeen=false,completed=false,timer=null,introTimer=null;
 const result=q('#projectResult'),pin=q('#pin13Modal'),code=q('#projectCode');
 // Reuse page 1's existing execution DOM, including dial, readouts and fan.
 const template=q('#introDemo .result-layout').cloneNode(true);
 template.querySelectorAll('[id]').forEach(el=>el.id=el.id.replace(/^intro-/,''));
 template.querySelectorAll('[mask],[clip-path]').forEach(el=>{for(const key of ['mask','clip-path'])if(el.hasAttribute(key))el.setAttribute(key,el.getAttribute(key).replace(/intro-/g,''))});
 result.append(template);
 const sharedInput=q('#rotationInput');
const instructions=['시작 블록을 준비합니다.','시작하기 버튼을 클릭했을 때','디지털 13번 핀을 켭니다. 실행 결과를 확인하세요.','자료: 변수 단계의 처음 값은 0입니다.','하드웨어: A1 값을 0~1023에서 0~5로 바꿉니다.','변환한 값을 변수 단계에 넣습니다.','생김새: 단계1 모양으로 바꾸기','자료: 변수 단계 값을 선택합니다.','단계1 대신 변수 단계 값으로 모양을 바꿉니다.','하드웨어: 디지털 10번 핀을 255로 정하기','계산: 10 × 10 블록을 선택합니다.','255 대신 곱셈 블록을 넣습니다.','자료: 변수 단계 값을 선택합니다.','첫 번째 10 대신 단계 값을 넣습니다.','두 번째 10을 25로 바꿉니다.','흐름: 계속 반복하기를 선택합니다.','읽기·모양·출력을 계속 반복합니다.'];
 const tabs=['start','start','hardware','data','hardware','data','looks','data','looks','hardware','math','hardware','data','hardware','math','flow','flow'];
 const field=x=>`<span class="field">${x}<span class="select-arrow">▼</span></span>`,num=x=>`<span class="number-field">${x}</span>`;
 const variable=`<span class="project-variable">${field('단계')} 값</span>`;
 const mapped=`<span class="project-map hardware-block">아날로그 ${field('A1')}번 센서의 입력값 ${num(0)}~${num(1023)}에서 ${num(0)}~${num(5)}로 바꾼 값</span>`;
 const product=()=>`<span class="project-product">${step>=13?variable:num(10)}<b>×</b>${num(step>=14?25:10)}</span>`;
 const block=(cls,html)=>`<div class="entry-block ${cls} entry-show">${html}</div>`;
 function renderCode(){
  let html='';if(step>=1)html+=block('start-block','<span class="play-dot">▶</span><b>시작하기 버튼을 클릭했을 때</b>');
  if(step>=2)html+=block('hardware-block',`<b>디지털</b>${field(13)}<b>번 핀</b>${field('켜기')}`);
  if(step>=3)html+=block('data-block',`${field('단계')}<b>를</b>${num(0)}<b>(으)로 정하기</b>`);
  let body='';if(step>=5)body+=block('data-block',`${field('단계')}<b>를</b>${mapped}<b>(으)로 정하기</b>`);
  if(step>=6)body+=block('looks-block',`${step>=8?variable:field('단계1')}<b>모양으로 바꾸기</b>`);
  if(step>=9)body+=block('hardware-block',`<b>디지털</b>${field(10)}<b>번 핀을</b>${step>=11?product():num(255)}<b>(으)로 정하기</b>`);
  if(step>=16)html+=block('repeat-block','<b>계속 반복하기</b>')+`<div class="repeat-body repeat-show" id="projectLoop">${body}</div>`;else html+=body;
  const preview=step===4?mapped:(step===7||step===12)?variable:step===10?`<span class="project-product">${num(10)}<b>×</b>${num(10)}</span>`:step===15?block('repeat-block','<b>계속 반복하기</b>'):'';
  code.innerHTML=html+(preview?`<div class="project-palette" aria-label="선택한 블록">${preview}</div>`:'');
  pages[3].querySelectorAll('.entry-tab').forEach(el=>el.classList.toggle('active-tab',el.dataset.tab===tabs[step]));
  q('#projectProgress').textContent=instructions[step];q('#projectRun').disabled=!(step===2||step===16);q('#projectRun').textContent=(!result.hidden||!pin.hidden)?'■':'▶';
  q('#projectRun').setAttribute('aria-label',(!result.hidden||!pin.hidden)?'실행 중지':'실행');q('#projectStop').hidden=true;
  q('#projectSave').disabled=q('#projectComplete').disabled=!completed;
  q('#projectSave').classList.toggle('enabled',completed);q('#projectComplete').classList.toggle('enabled',completed);
 }
 function stop(){cancelAnimationFrame(timer);timer=null;result.hidden=true;result.classList.remove('running');pin.hidden=true;renderCode()}
 function convert(value){return Math.max(0,Math.min(5,Math.round(Number(value)*5/1023)))}
 function updateDemo(scope,prefix,value){const level=convert(value);for(const [id,text]of [['analogValue',value],['liveStep',level],['liveNumber',level],['liveOutput',level*25],['liveFan',level?`바람 세기 ${level}단계`:'정지']])q('#'+prefix+id).textContent=text;
  scope.style.setProperty('--fan-period',level?`${2.4/level}s`:'2.4s');scope.classList.toggle('running',level>0);scope.querySelector('.dial-pointer').style.transform=`rotate(${-120+value/1023*240}deg)`;q('#'+prefix+'rotationDial').setAttribute('aria-valuenow',value);q('#'+prefix+'rotationInput').value=value;scope.querySelectorAll('[data-level]').forEach(el=>{const active=Number(el.dataset.level)===level;el.classList.toggle('active',active);el.setAttribute('aria-current',active?'true':'false')});if(!prefix)q('#projectNumber').textContent=level;
 }
 function cycle(scope,prefix){
  const started=performance.now();let frame;
  function animate(now){const phase=((now-started)/14000)%2;const value=Math.round(1023*(phase<=1?phase:2-phase));updateDemo(scope,prefix,value);frame=requestAnimationFrame(animate);if(prefix)introTimer=frame;else timer=frame}
  updateDemo(scope,prefix,0);frame=requestAnimationFrame(animate);return frame;
 }
 function openResult(){if(step!==16)return;stop();result.hidden=false;completed=true;window.lessonUI.completeResult(pages[3]);timer=cycle(result,'');renderCode()}
 function openPin(){stop();pin.hidden=false;pinSeen=true;renderCode()}
 function renderCircuit(){q('#projectCircuit').querySelectorAll('[data-circuit-stage]').forEach(el=>{el.style.visibility=Number(el.dataset.circuitStage)<=circuit?'visible':'hidden'});q('#circuitProgress').textContent=['연결할 모듈과 핀을 먼저 확인합니다.','보드 전원: 5V → + / GND → −','모듈 전원: 가변저항 VCC·GND / DC모터 V·G','신호 연결: 가변저항 OUT → A1 / DC모터 S → D10'][circuit]}
 function show(index){index=Math.max(0,Math.min(3,index));if(window.hardwareConnect?.before(page,index,show)) {stop();cancelAnimationFrame(introTimer);return}
  stop();cancelAnimationFrame(introTimer);page=index;pages.forEach((p,i)=>p.classList.toggle('active',i===page));[...list.querySelectorAll('.slide-sidebar-item')].forEach((b,i)=>b.classList.toggle('active',i===page));q('#slides').textContent=window.hardwareConnect?.number(page,4)||`${page+1+(page>=3?1:0)} / 5`;q('#prev').disabled=page===0;q('#next').disabled=false;document.body.classList.toggle('entry-page',page===3);document.body.classList.toggle('after-intro',page>0);renderCode();renderCircuit();if(page===0)introTimer=cycle(q('#introDemo'),'intro-')}
 function next(){if(!result.hidden||!pin.hidden){stop();return}if(page===1&&circuit<3){circuit++;renderCircuit();return}if(page===3){if(step===2&&!pinSeen){openPin();return}if(step<16){step++;renderCode()}else openResult();return}show(page+1)}
 function previous(){if(!result.hidden||!pin.hidden){stop();return}if(page===1&&circuit>0){circuit--;renderCircuit();return}if(page===3&&step>0){step--;if(step<2)pinSeen=false;renderCode();return}show(page-1)}
 titles.forEach((title,i)=>{const b=document.createElement('button');b.type='button';b.className='slide-sidebar-item';b.innerHTML=`<span class="sidebar-page-no">${i+1+(i>=3?1:0)}</span><span>${title}</span>`;b.addEventListener('click',()=>show(i));list.append(b)});
 window.hardwareLessonAdapter={resume:show};q('#next').addEventListener('click',next);q('#prev').addEventListener('click',previous);
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){stop();return}const d=window.lessonUI.direction(e);if(!d)return;e.preventDefault();d>0?next():previous()});
 q('#projectRun').addEventListener('click',()=>{if(!result.hidden||!pin.hidden)stop();else if(step===2)openPin();else openResult()});q('#projectStop').addEventListener('click',stop);q('#projectResultClose').addEventListener('click',stop);q('#pin13Close').addEventListener('click',stop);
 window.lessonUI.bindOutside({key:'fan-project',isOpen:()=>!result.hidden,inside:'#projectResult,#projectRun',close:stop});window.lessonUI.bindOutside({key:'fan-pin13',isOpen:()=>!pin.hidden,inside:'#pin13Modal,#projectRun',close:stop});
 sharedInput.addEventListener('input',()=>updateDemo(result,'',Number(sharedInput.value)));
 q('#projectSave').addEventListener('click',()=>{if(!completed)return;const source={project:'rotation-dc-motor',object:'숫자 버튼',variable:'단계',input:'A1',range:[0,1023,0,5],output:'D10',multiplier:25};const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(source,null,2)],{type:'application/json'}));a.download='rotation-dc-motor.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)});
 q('#projectComplete').addEventListener('click',()=>{if(!completed)return;localStorage.setItem('phycom-project-rotation-dc-motor-complete','1');q('#projectComplete').textContent='과제제출 ✓'});
 window.addEventListener('pagehide',()=>{stop();cancelAnimationFrame(introTimer)});show(0);
})();

