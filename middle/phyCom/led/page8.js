(()=>{
 const root=document.querySelector('.pwm-range-slide');if(!root)return;
 const pairs=[...root.querySelectorAll('.page8-code-pair')],prompt=root.querySelector('#page8Prompt'),secondPrompt=root.querySelector('#page8SecondPrompt'),scale=root.querySelector('#page8Scale'),deltas=[...root.querySelectorAll('.page8-scale-delta')];
 const totalSteps=5;let step=0;
 function render(){pairs.forEach(pair=>{pair.classList.toggle('is-grouped',step>=1);pair.classList.toggle('is-value-focus',step>=2);pair.querySelector('.hardware-block .number-field').classList.toggle('is-value-marked',step>=2)});secondPrompt.hidden=step<2;scale.hidden=step<3;scale.style.setProperty('display',step>=3?'block':'none','important');deltas.forEach(delta=>delta.classList.toggle('is-visible',step>=4));}
 function nextStep(){if(step<totalSteps-1){step++;render();return true;}return false;}
 function previousStep(){if(step>0){step--;render();return true;}return false;}
 window.pwmRangeLesson={activate(finalState=false){step=finalState?totalSteps-1:0;render();},next:nextStep,prev:previousStep};
 render();
})();

(()=>{
 const root=document.querySelector('.p9-learning');if(!root)return;
 const questions=[
 ['기존 코드의 밝기값은 같은 간격으로 변할까?',''],
 ['0에서 255까지, 같은 간격의 4단계 밝기값을 어떻게 정하면 좋을까?',''],
 ['밝기값의 간격은 얼마가 되어야 할까?',''],
 ['밝기값의 간격은 어떻게 구할 수 있을까?','255 ÷ 4'],
 ['밝기값의 간격은 어떻게 구할 수 있을까?','255 ÷ 4 = 63.75'],
 ['4단계로 만들려고 했는데, 왜 5단계가 되었을까?',''],
 ['그렇다면 4단계로 만들려면 몇 개의 간격으로 나누어야 할까?',''],
 ['그렇다면 4단계로 만들려면 몇 개의 간격으로 나누어야 할까?','255 ÷ 3 = 85'],
 ['완성했던 코드에서 이어서 같은 간격의 밝기를 만들어 보자.',''],
 ['기존 코드를 오른쪽으로 옮겨 새 코드와 비교해 보자.','밝기값을 0 · 85 · 170 · 255로 바꾸었어요.'],
 ['4번 반복하기 블록을 가져오자.',''],
 ['디지털 3번 핀을 LED밝기 값으로 정하자.',''],
 ['0.5초 기다리기 블록을 연결하자.',''],
 ['LED밝기에 85만큼 더하기 블록을 연결하자.',''],
 ['실행하여 밝기값의 변화를 보자.','재생 버튼으로 다시 실행할 수 있어요.'],
 ['LED가 계속해서 밝아지는 동작을 반복하게 하려면 어떻게 해야 할까?','4번 반복하기 코드를 계속 반복하기 안에 넣었어요.'],
 ['계속 반복하기 안에 넣었는데 왜 처음부터 다시 밝아지지 않을까?',''],
 ['다시 0부터 시작하려면 무엇이 필요할까?',''],
 ['LED밝기를 0으로 정하기 블록을 반복 시작에 추가하자.',''],
 ['최종 코드를 실행하면 어떤 밝기값이 반복될까?','재생 버튼으로 초기화한 결과를 다시 확인할 수 있어요.']
 ];let step=0,timer=null,activeButton=null;
 const q=s=>root.querySelector(s),question=q('#p9Question'),support=q('#p9Support'),count=q('#p9StepCount'),board=q('#p9Board'),lines=q('#p9NumberLines'),scene=q('#p9CodeScene'),program=q('#p9Program'),modal=q('#p9Result'),values=q('#p9ResultValues');
 const rows=[...root.querySelectorAll('[data-p9-line]')],source=document.querySelector('#pwmCodeProgram');
 // Reuse Page 7's actual block DOM; do not introduce another block renderer.
 function copyBlock(selector){const node=source.querySelector(selector).cloneNode(true);node.querySelectorAll('button').forEach(el=>el.remove());[node,...node.querySelectorAll('*')].forEach(el=>{el.removeAttribute('id');el.removeAttribute('data-pwm-code-step');el.removeAttribute('data-pwm-repeat-body');el.removeAttribute('style');});node.hidden=false;node.classList.add('entry-show');node.classList.remove('entry-current');return node;}
 const start=copyBlock('[data-pwm-code-step="1"]'),pin13=copyBlock('[data-pwm-code-step="2"]'),oldLoop=document.createElement('div'),oldHeader=copyBlock('[data-pwm-code-step="4"]'),oldBody=document.createElement('div');
 oldLoop.className='p9-original-loop';oldBody.className='repeat-body repeat-show';oldLoop.append(oldHeader,oldBody);
 for(let n=9;n<=16;n++)oldBody.append(copyBlock('[data-pwm-code-step="'+n+'"]'));
 const variable=copyBlock('[data-pwm-code-step="5"]');variable.querySelector('.page7-literal-value').hidden=true;variable.querySelector('.page7-variable-reporter').hidden=false;variable.classList.add('p9-detached-reporter');
 const comparison=document.createElement('div');comparison.className='p9-code-comparison';
 const newLoop=document.createElement('div');newLoop.className='p9-new-loop';
 const repeat=copyBlock('[data-pwm-code-step="4"]');repeat.querySelector('b').textContent='번 반복하기';const four=document.createElement('span');four.className='number-field';four.textContent='4';repeat.prepend(four);
 const run=document.createElement('button');run.type='button';run.className='entry-loop-run-btn';run.textContent='▶';run.setAttribute('aria-label','새 반복 코드 실행 또는 정지');repeat.append(run);
 const body=document.createElement('div');body.className='repeat-body repeat-show';const set=variable.cloneNode(true);set.classList.remove('p9-detached-reporter');const wait=copyBlock('[data-pwm-code-step="10"]');
 const increment=document.createElement('div');increment.className='entry-block data-block entry-show';increment.append(variable.querySelector('.page7-variable-reporter').cloneNode(true));increment.querySelector('.page7-variable-value').remove();increment.insertAdjacentHTML('beforeend','<b>에</b><span class="number-field">85</span><b>만큼 더하기</b>');
 body.append(set,wait,increment);
 const outer=copyBlock('[data-pwm-code-step="4"]'),outerBody=document.createElement('div');outerBody.className='repeat-body repeat-show';
 const outerRun=run.cloneNode(true);outerRun.setAttribute('aria-label','최종 반복 코드 실행 또는 정지');outer.append(outerRun);
 const reset=increment.cloneNode(true);reset.querySelectorAll('b').forEach(el=>el.remove());reset.querySelector('.number-field').textContent='0';reset.insertAdjacentHTML('beforeend','<b>(으)로 정하기</b>');
 comparison.append(newLoop,oldLoop,variable);program.append(start,pin13,comparison);
 let reservedWidth=0;
 function fitComparison(){if(scene.hidden)return;comparison.style.transform='';const scale=Math.min(1,scene.clientWidth/Math.max(1,comparison.offsetWidth));comparison.style.transformOrigin='left top';comparison.style.transform=scale<1?'scale('+scale+')':'';}
 if('ResizeObserver'in window)new ResizeObserver(fitComparison).observe(board);
 function stop(){if(timer!==null)clearTimeout(timer);timer=null;if(activeButton){activeButton.textContent='▶';activeButton.classList.remove('running');}activeButton=null;q('#p9ResultStop').disabled=true;}
 function close(){stop();modal.hidden=true;}
 function play(){close();modal.hidden=false;values.replaceChildren();activeButton=step>=15?outerRun:run;activeButton.textContent='■';activeButton.classList.add('running');q('#p9ResultStop').disabled=false;
 const mode=step>=18?'reset':step>=15?'continuous':'once';q('#p9ResultTitle').textContent=mode==='continuous'?'+85를 계속했을 때의 값':'계산되는 밝기값';q('#p9ResultQuestion').textContent=mode==='continuous'?'계속 반복하기 안에 넣었는데 왜 처음부터 다시 밝아지지 않을까?':'';
 const sequence=mode==='continuous'?[0,85,170,255,340,425,510,'…']:[0,85,170,255];let index=0,arrow=false;
 if(mode!=='continuous')sequence.forEach((value,i)=>{if(i)values.append(document.createTextNode(' → '));const item=document.createElement('span');item.textContent=value;values.append(item);});
 function tick(){const value=sequence[index];if(mode==='continuous'){const item=document.createElement(arrow?'i':'span');item.textContent=arrow?'→':String(value);values.append(item);if(arrow){arrow=false;timer=setTimeout(tick,250);return;}}else values.querySelectorAll('span').forEach((item,i)=>item.classList.toggle('is-active',i===index));
 const brightness=typeof value==='number'?Math.min(255,value):255;q('#p9LedLight').style.opacity=String(brightness/255);q('#p9LedLabel').textContent=brightness===0?'꺼짐':brightness===85?'낮은 밝기':brightness===170?'높은 밝기':'최대 밝기';
 index++;if(index===sequence.length){if(mode==='reset')index=0;else{stop();return;}}arrow=mode==='continuous';timer=setTimeout(tick,500);}
 tick();
 }
 function render(){close();question.textContent=questions[step][0];support.textContent=questions[step][1];const exploring=step<8;root.classList.toggle('is-coding',!exploring);board.classList.toggle('is-exploring',exploring);lines.hidden=!exploring;scene.hidden=exploring;
 if(!exploring&&!reservedWidth){newLoop.hidden=false;set.hidden=false;wait.hidden=false;increment.hidden=false;body.hidden=false;reset.hidden=false;newLoop.replaceChildren(outer,outerBody);outerBody.replaceChildren(reset,repeat,body);reservedWidth=newLoop.offsetWidth;newLoop.style.minWidth=reservedWidth+'px';}
 rows.forEach(row=>{const kind=row.dataset.p9Line;row.hidden=!exploring||step<Number(row.dataset.p9Appear);const points=exploring&&kind==='divide4'&&step>=5;const gaps=exploring&&((kind==='divide4'&&step>=5)||(kind==='target'&&step>=6));row.classList.toggle('is-point-focus',points);row.classList.toggle('is-gap-focus',gaps);row.querySelector('.p9-point-gap-summary').textContent=kind==='divide4'?'점 5개\n간격 4개':kind==='target'||kind==='divide3'?'점 4개\n간격 3개':'';});
 oldBody.querySelectorAll('.hardware-block .number-field').forEach((el,i)=>el.textContent=String((step>=9?[0,85,170,255]:[0,100,200,255])[i]));
 oldLoop.hidden=false;variable.hidden=step>=9;newLoop.hidden=step<9;repeat.hidden=step<10;set.hidden=step<11;wait.hidden=step<12;increment.hidden=step<13;run.hidden=step<13;body.hidden=step<11;reset.hidden=step<18;outerRun.hidden=step<18;
 if(step>=15){newLoop.replaceChildren(outer,outerBody);outerBody.replaceChildren(reset,repeat,body);}else newLoop.replaceChildren(repeat,body);
 // At code entry the old loop remains at the original left position.
 oldLoop.style.order=step>=9?'2':'0';fitComparison();count.textContent=`${step+1} / ${questions.length}`;
 if([14,16,19].includes(step))play();
 }
 [run,outerRun].forEach(button=>button.addEventListener('click',event=>{event.stopPropagation();if(timer!==null)stop();else play();}));q('#p9ResultStop').addEventListener('click',stop);q('#p9ResultClose').addEventListener('click',close);window.lessonUI.bindOutside({key:'led-page9-result',isOpen:()=>!modal.hidden,inside:'.p9-result-card,.entry-loop-run-btn',close});
 function next(){if(!modal.hidden){close();if(step===16){question.textContent=questions[17][0];support.textContent=questions[17][1];}return true;}if(step<questions.length-1){step++;render();return true;}close();return false;}
 function prev(){if(step>0){step--;render();return true;}close();return false;}
 window.page9Lesson={activate(finalState=false){step=finalState?questions.length-1:0;render();},next,prev};render();
})();


(()=>{
 const root=document.querySelector('.p10-learning');if(!root)return;
 const data=[
 ['4단계 규칙을 8단계로 넓히면 간격은 어떻게 될까?','4단계 → 3개 간격 → 85'],
 ['8단계를 만들려면 간격은 몇 개일까?','8단계에는 7개 간격이 있어요.'],
 ['8단계의 밝기 변화 간격을 계산해 보자.','255 ÷ 7'],
 ['8단계의 밝기 변화 간격을 계산해 보자.','255 ÷ 7 ≈ 36.43'],
 ['4번 반복하기를 8번 반복하기로 바꾸자.','4번 → 8번'],
 ['밝기 증가값을 바꾸자.','85 → 36.43'],
 ['실행 결과에서 계산값과 변수값을 함께 살펴보자.','단계 → 계산값 → 변수값 → LED 밝기'],
 ['계산값과 변수에 표시된 값은 같을까?','계산값 255.01 · 변수값 255'],
 ['계산한 값은 255.01인데, LED밝기 변수는 왜 255일까?','설정 범위가 0~255이므로 변수값은 255가 돼요.'],
 ['밝기값을 0~255 범위에서 사용한다는 규칙을 확인했어요.','LED밝기 변수 설정 범위: 0~255']
 ];const viewAt=['start','rule','rule','rule','code','code','values','limit','answer','answer'];let step=0,timer=null;
 const views=[...root.querySelectorAll('[data-p10-view]')],question=root.querySelector('#p10Question'),support=root.querySelector('#p10Support'),count=root.querySelector('#p10StepCount');
 function stop(){if(timer!==null)clearTimeout(timer);timer=null;}
 function result(){const values=Array.from({length:8},(_,i)=>Number((i*36.43).toFixed(2))),host=root.querySelector('#p10ResultSteps');host.replaceChildren();values.forEach(value=>{const span=document.createElement('span');span.textContent=value;host.append(span);});let index=0;
 function tick(){const value=values[index],actual=Math.min(255,value);host.querySelectorAll('span').forEach((span,i)=>span.classList.toggle('is-active',i===index));root.querySelector('#p10Calculated').textContent='계산값: '+value;root.querySelector('#p10Variable').textContent='LED밝기 변수값: '+actual;root.querySelector('#p10LedLight').style.opacity=String(actual/255);index++;timer=index<values.length?setTimeout(tick,500):null;}tick();}
 function render(){stop();views.forEach(el=>el.hidden=el.dataset.p10View!==viewAt[step]);question.textContent=data[step][0];support.textContent=data[step][1];count.textContent=`${step+1} / ${data.length}`;root.querySelector('#p10Equation').textContent=step>=3?'255 ÷ 7 ≈ 36.43':'255 ÷ 7';root.querySelector('[data-p10-repeat]').textContent=step>=4?'8':'4';root.querySelector('[data-p10-increment]').textContent=step>=5?'36.43':'85';if(step===6)result();}
 function next(){if(step<data.length-1){step++;render();return true;}stop();return false;}function prev(){if(step){step--;render();return true;}stop();return false;}window.page10Lesson={activate(finalState=false){step=finalState?data.length-1:0;render();},next,prev};render();

})();

(()=>{
 const root=document.querySelector('.p11-learning');if(!root)return;
 const steps=[
  ['4단계라면 간격은 몇 개일까?','먼저 단계와 간격 수를 생각해 보자.'],
  ['4단계 → ___개의 간격','4단계 사이의 간격 수를 공개해요.'],
  ['255 ÷ ___ = ___','밝기 변화량을 계산하는 식을 완성해 보자.'],
  ['255 ÷ 3 = 85','4단계의 밝기 변화량은 85예요.'],
  ['8단계라면 간격은 몇 개일까?','단계 수가 달라졌어요.'],
  ['8단계 → ___개의 간격','8단계 사이의 간격 수를 공개해요.'],
  ['255 ÷ ___ = ___','밝기 변화량을 계산하는 식을 완성해 보자.'],
  ['255 ÷ 7 ≈ 36.43','8단계의 밝기 변화량은 약 36.43이에요.'],
  ['100단계라면 간격은 몇 개일까?','단계 수가 더 커졌어요.'],
  ['100단계 → ___개의 간격','100단계 사이의 간격 수를 공개해요.'],
  ['255 ÷ ___ = ___','밝기 변화량을 계산하는 식을 완성해 보자.'],
  ['255 ÷ 99 ≈ 2.58','100단계의 밝기 변화량은 약 2.58이에요.'],
  ['세 사례를 한눈에 비교해 보자.','4단계 → 3간격 → 85　·　8단계 → 7간격 → 약 36.43　·　100단계 → 99간격 → 약 2.58'],
  ['단계 수와 간격 수 사이에는 어떤 규칙이 있을까?','']
 ];let step=0;
 const cases=[...root.querySelectorAll('.p11-case')],summary=root.querySelector('.p11-summary'),question=root.querySelector('#p11Question'),support=root.querySelector('#p11Support'),count=root.querySelector('#p11StepCount'),back=root.querySelector('#p11Back'),next=root.querySelector('#p11Next');
 const revealed=()=>({4:[1,2,3].includes(step),8:[5,6,7].includes(step),100:[9,10,11].includes(step)});
 function render(){const shown=revealed();cases.forEach(card=>{const on=shown[card.dataset.p11Case];card.querySelector('.p11-placeholder').hidden=!!on;card.querySelectorAll('.p11-answer').forEach(el=>el.hidden=!on);const spans=card.querySelectorAll(':scope > span');const range=card.dataset.p11Case==='4'?[2,3]:card.dataset.p11Case==='8'?[6,7]:[10,11];spans.forEach((row,i)=>{const active=on&&step>=range[i]+1;row.querySelectorAll('em').forEach(el=>el.hidden=active);row.querySelectorAll('strong').forEach(el=>el.hidden=!active)});});summary.hidden=step<12;question.textContent=steps[step][0];support.textContent=steps[step][1];if(back)back.disabled=step===0;if(next)next.disabled=step===steps.length-1;count.textContent=`${step+1} / ${steps.length}`;}
 back?.addEventListener('click',()=>previousStep());next?.addEventListener('click',()=>nextStep());function nextStep(){if(step<steps.length-1){step++;render();return true;}return false;}function previousStep(){if(step){step--;render();return true;}return false;}window.page11Lesson={activate(finalState=false){step=finalState?steps.length-1:0;render();},next:nextStep,prev:previousStep};render();
})();

(()=>{
 const root=document.querySelector('.p12-learning');if(!root)return;
 const steps=[
  ['4→3, 8→7, 100→99에서 공통 규칙을 찾아보자.','단계 수와 간격 수를 비교해요.'],
  ['단계 수보다 간격 수는 항상 몇 개 적을까?',''],
  ['단계 수보다 간격 수는 항상 1개 적어요.',''],
  ['단계 수를 n이라고 하면 간격 수는 어떻게 나타낼까?','n단계 → ___개의 간격'],
  ['단계 수가 n개일 때, 간격 수를 식으로 나타내 보자.','n단계 → n−1개의 간격'],
  ['밝기 변화 간격은 어떤 식으로 나타낼까?','밝기 변화 간격 = 255 ÷ ______'],
  ['간격 수 n−1을 넣으면 일반식은 어떻게 될까?','밝기 변화 간격 = 255 ÷ (n−1)'],
  ['질문과 대답, 변수, 계산 블록으로 프로그램을 만들어 보자.','대답으로 단계 정하기 → 단계 번 반복하기 → 255 ÷ (단계−1)만큼 늘리기']
 ];const views=['examples',null,'one','n-blank','n-answer','formula-blank','formula','code'];let step=0;
 const panels=[...root.querySelectorAll('[data-p12-view]')],question=root.querySelector('#p12Question'),support=root.querySelector('#p12Support'),count=root.querySelector('#p12StepCount'),back=root.querySelector('#p12Back'),next=root.querySelector('#p12Next');
 function render(){const view=views[step];panels.forEach(el=>el.hidden=el.dataset.p12View!==view);question.textContent=steps[step][0];support.textContent=steps[step][1];if(back)back.disabled=step===0;if(next)next.disabled=step===steps.length-1;count.textContent=`${step+1} / ${steps.length}`;}
 back?.addEventListener('click',()=>previousStep());next?.addEventListener('click',()=>nextStep());function nextStep(){if(step<steps.length-1){step++;render();return true;}return false;}function previousStep(){if(step){step--;render();return true;}return false;}window.page12Lesson={activate(finalState=false){step=finalState?steps.length-1:0;render();},next:nextStep,prev:previousStep};render();
})();
