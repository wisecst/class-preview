(()=>{
const duties=[0,25,50,75,100];let index=0,currentDuty=0,timer=null;
function wave(duty){const x0=60,yHi=62,yLo=250,w=160,cycles=4;let d=duty===0?'M '+x0+' '+yLo:'M '+x0+' '+yHi;for(let i=0;i<cycles;i++){const x=x0+i*w,hi=w*duty/100;if(duty===0){d+=' L '+(x+w)+' '+yLo;continue}if(duty===100){d+=' L '+x+' '+yHi+' L '+(x+w)+' '+yHi;continue}d+=' L '+x+' '+yHi+' L '+(x+hi)+' '+yHi+' L '+(x+hi)+' '+yLo+' L '+(x+w)+' '+yLo;}return d;}
function ratio(d){if(d===0)return '계속 꺼짐';if(d===100)return '계속 켜짐';if(d%25!==0)return '켜져 있는 시간 '+d+'%';const g=(a,b)=>b?g(b,a%b):a,n=d/25,m=(100-d)/25,k=g(n,m);return '켜는 시간 '+(n/k)+' : 끄는 시간 '+(m/k);}
function render(d=currentDuty){currentDuty=d;const root=document.querySelector('.pwm-slide');if(!root)return;document.querySelector('#pwmDuty').textContent=d+'%';const entryValue=Math.round(d*255/100);const entryEl=document.querySelector('#pwmEntryValue');if(entryEl)entryEl.textContent=entryValue;document.querySelector('#pwmBrightness').textContent='밝기 약 '+d+'%';document.querySelector('#pwmRatio').textContent=ratio(d);document.querySelector('#pwmWave').setAttribute('d',wave(d));const glow=document.querySelector('#pwmGlow'),bulb=document.querySelector('#pwmBulb');glow.style.opacity=d/100;glow.style.transform='translate(-50%,-50%) scale('+(0.7+d/180)+')';bulb.style.filter='brightness('+(0.35+d/80)+') saturate('+(0.5+d/100)+')';document.querySelectorAll('[data-duty]').forEach(b=>b.classList.toggle('active',d%25===0&&+b.dataset.duty===d));}
function stop(){if(timer){clearInterval(timer);timer=null}const b=document.querySelector('#pwmPlay');if(b)b.textContent='▶ 자동 재생';}
function next(){stop();index=Math.min(duties.length-1,index+1);render(duties[index])}
function prev(){stop();index=Math.max(0,index-1);render(duties[index])}
function play(){if(timer){stop();return}currentDuty=0;index=0;render(0);document.querySelector('#pwmPlay').textContent='■ 멈추기';timer=setInterval(()=>{currentDuty=(currentDuty+1)%101;render(currentDuty);if(currentDuty%25===0)index=duties.indexOf(currentDuty)},35)}
function init(){const grid=document.querySelector('.pwm-grid');if(!grid)return;for(let i=0;i<=4;i++){const x=60+i*160;grid.insertAdjacentHTML('beforeend','<line x1="'+x+'" y1="35" x2="'+x+'" y2="260"/>')}document.querySelectorAll('[data-duty]').forEach(b=>b.onclick=()=>{stop();index=duties.indexOf(+b.dataset.duty);render(duties[index])});document.querySelector('#pwmPlay').onclick=play;render(0)}
window.pwmLesson={next,prev,play,stop,canNext:()=>index<duties.length-1,canPrev:()=>index>0,isAtMax:()=>index===duties.length-1,isPlaying:()=>timer!==null};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

// Keep the independent info-ui LED lesson in sync with the latest source lesson
// before slides.js captures the slide list. This is intentionally LED-only.
(()=>{
 if(!document.querySelector('.p9-learning')||document.querySelector('.p14-learning'))return;
 document.querySelectorAll('.p9-learning .learning-inline-title,.p10-learning .learning-inline-title,.p11-learning .learning-inline-title,.p12-learning .learning-inline-title').forEach(old=>{
   if(old.tagName==='H2')return;
   const h=document.createElement('h2');h.className=old.className;h.textContent=old.textContent;old.replaceWith(h);
 });
 document.querySelectorAll('.p12-learning .calculation-tab img,.p14-learning .calculation-tab img').forEach(img=>{img.src=img.src.replace('tab08_calculation_','tab08_math_');});
 const nav=document.querySelector('.slide-nav');
 if(!nav)return;
 const section=document.createElement('section');
 section.className='slide entry-slide pwm-learning-slide p14-learning';
 section.setAttribute('aria-label','13. 학생 코드 예시');
 section.innerHTML=`<div class="entry-workspace">
 <div class="entry-scene-tabs entry-code-toolbar"><button type="button" class="entry-scene-tab active">장면 2</button><span class="entry-brand">entry</span><b class="entry-lesson-title">[피컴09] 출력장치-LED1</b></div>
 <aside class="entry-tabs" aria-label="엔트리 블록 탭"><div class="entry-tab start-tab active-tab" data-tab="start" aria-label="시작"><img class="entry-tab-image entry-tab-image-unselected" src="../../../../middle/phyCom/assets/tab01_start_unselected.png" alt=""><img class="entry-tab-image entry-tab-image-selected" src="../../../../middle/phyCom/assets/tab01_start_selected.png" alt=""></div><div class="entry-tab data-tab" data-tab="data" aria-label="자료"><img class="entry-tab-image entry-tab-image-unselected" src="../../../../middle/phyCom/assets/tab09_data_unselected.png" alt=""><img class="entry-tab-image entry-tab-image-selected" src="../../../../middle/phyCom/assets/tab09_data_selected.png" alt=""></div><div class="entry-tab flow-tab" data-tab="flow" aria-label="흐름"><img class="entry-tab-image entry-tab-image-unselected" src="../../../../middle/phyCom/assets/tab02_flow_unselected.png" alt=""><img class="entry-tab-image entry-tab-image-selected" src="../../../../middle/phyCom/assets/tab02_flow_selected.png" alt=""></div><div class="entry-tab hardware-tab" data-tab="hardware" aria-label="하드웨어"><img class="entry-tab-image entry-tab-image-unselected" src="../../../../middle/phyCom/assets/tab14_hardware_unselected.png" alt=""><img class="entry-tab-image entry-tab-image-selected" src="../../../../middle/phyCom/assets/tab14_hardware_selected.png" alt=""></div><div class="entry-tab calculation-tab" data-tab="calculation" aria-label="계산"><img class="entry-tab-image entry-tab-image-unselected" src="../../../../middle/phyCom/assets/tab08_math_unselected.png" alt=""><img class="entry-tab-image entry-tab-image-selected" src="../../../../middle/phyCom/assets/tab08_math_selected.png" alt=""></div></aside>
 <div class="entry-stage p14-stage"><div class="entry-object-info"><span class="page7-object-thumb"><svg class="entry-code-yellow-led entry-led-icon" viewBox="0 0 86 100" aria-hidden="true"><path d="M26 71V43a17 17 0 0 1 34 0v28Z" fill="currentColor"/><path d="M24 70Q43 80 62 70v10Q43 90 24 80Z" fill="currentColor"/></svg></span><strong>노란LED</strong><span class="entry-code-page-label">변수: LED밝기 · 단계</span><h2 class="learning-inline-title">학생 코드 예시</h2></div>
 <div class="p14-layout"><div class="entry-program p14-program" aria-label="밝기 단계 수를 입력받아 0부터 255까지 일정하게 밝아지는 학생 코드 예시">
 <div class="entry-block start-block entry-show"><span class="play-dot">▶</span><b>시작하기 버튼을 클릭했을 때</b></div>
 <div class="entry-block data-block entry-show p12-ask"><span class="p12-question-input">“빛 밝기 단계의 개수”</span><b>를 묻고 대답 기다리기</b></div>
 <div class="entry-block data-block entry-show p12-answer-set"><span class="page7-variable-reporter"><span class="page7-variable-name">단계</span></span><b>를</b><span class="page7-variable-reporter"><span class="page7-variable-name">대답</span></span><b>으로 정하기</b></div>
 <div class="entry-block repeat-block entry-show"><b>계속 반복하기</b></div><div class="repeat-body repeat-show">
 <div class="entry-block data-block entry-show"><span class="page7-variable-reporter"><span class="page7-variable-name">LED밝기</span></span><span class="number-field">0</span><b>(으)로 정하기</b></div>
 <div class="entry-block repeat-block entry-show"><span class="page7-variable-reporter"><span class="page7-variable-name">단계</span></span><b>번 반복하기</b></div><div class="repeat-body repeat-show">
 <div class="entry-block hardware-block pwm-set-block entry-show"><b>디지털</b><span class="field">3<span class="select-arrow">▼</span></span><b>번 핀을</b><span class="page7-variable-reporter"><span class="page7-variable-name">LED밝기</span><span class="page7-variable-value">값</span></span><b>(으)로 정하기</b></div>
 <div class="entry-block wait-block entry-show"><span class="number-field">0.5</span><b>초 기다리기</b></div>
 <div class="entry-block data-block entry-show p12-increment"><span class="page7-variable-reporter"><span class="page7-variable-name">LED밝기</span></span><b>에</b><span class="entry-calculation" aria-label="255 나누기 단계 빼기 1 중첩 계산 블록"><span class="number-field">255</span><span class="entry-operator">÷</span><span class="entry-calculation" aria-label="단계 빼기 1 계산 블록"><span class="page7-variable-reporter"><span class="page7-variable-name">단계</span></span><span class="entry-operator">−</span><span class="number-field">1</span></span></span><b>만큼 더하기</b></div>
 </div></div></div><aside class="p14-explanation"><strong>앞에서 찾은 규칙을 코드로 완성했어요.</strong><span>0부터 255까지 n단계로 나타내려면 간격은 n−1개입니다.</span><b>밝기 변화 간격 = 255 ÷ (단계−1)</b><span>반복을 시작할 때 LED밝기를 0으로 정하면 매번 가장 어두운 값부터 다시 시작합니다.</span></aside></div></div></div>`;
 nav.before(section);
 const count=document.querySelector('#slides');if(count)count.textContent='1 / 13';
})();
