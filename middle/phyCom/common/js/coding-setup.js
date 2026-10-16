/* One setup routine, extracted from the established LED lesson. */
(()=>{'use strict';const E=window.EntryEngine,asset=new URL('../../assets/',document.currentScript.src).href;
const template="<section class=\"slide entry-slide entry-scene-slide entry-setup-slide\" aria-label=\"6. PWM 코딩 전 설정\">\n<div class=\"entry-workspace\">\n<div class=\"entry-scene-tabs entry-code-toolbar\">\n<button type=\"button\" class=\"entry-scene-tab active\" data-scene=\"1\">장면 1</button>\n<button type=\"button\" class=\"entry-scene-tab\" data-scene=\"2\" hidden>장면 2</button>\n<button type=\"button\" class=\"entry-scene-add\" id=\"sceneAdd\" aria-label=\"장면 추가\">＋</button>\n<span class=\"entry-brand\">entry</span><b class=\"entry-lesson-title\">[피컴09] 출력장치-LED1</b>\n<div class=\"entry-top-actions\"><button type=\"button\" class=\"entry-goal-btn\">목표 작품</button><button type=\"button\" class=\"entry-complete-btn\">학습 완료</button></div></div>\n<div class=\"entry-setup-layout\">\n  <div class=\"entry-setup-left\">\n    <div class=\"entry-setup-stage\">\n      <div class=\"entry-setup-stage-bar\">◷ <span>X: -68.6, Y: -4.2</span><span>▦　⛶</span></div>\n      <div class=\"entry-setup-canvas\"><div class=\"entry-stage-variable\" id=\"stageVariable\" hidden><span id=\"stageVariableName\">LED밝기</span><b id=\"stageVariableValue\">0</b><input id=\"stageVariableSlider\" type=\"range\" min=\"0\" max=\"255\" value=\"0\" aria-label=\"LED밝기 값\" hidden></div><img class=\"entry-setup-bot\" src=\"../assets/entrybot.png\" alt=\"엔트리봇\"><div class=\"entry-setup-led yellow\" aria-label=\"추가한 노란LED 오브젝트\"><svg class=\"entry-led-icon\" viewBox=\"0 0 86 100\" aria-hidden=\"true\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\"><path d=\"M43 4v8M15 17l7 7M71 17l-7 7M5 47h8M73 47h8M12 28l7 4M74 28l-7 4\"/></g><path d=\"M26 71V43a17 17 0 0 1 34 0v28Z\" fill=\"currentColor\" opacity=\".84\"/><path d=\"M31 66V43a12 12 0 0 1 21-8\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" opacity=\".78\"/><path d=\"M24 70Q43 80 62 70v10Q43 90 24 80Z\" fill=\"currentColor\"/><path d=\"M23 79Q43 89 63 79v7Q43 96 23 86Z\" fill=\"currentColor\" opacity=\".72\"/></svg><span class=\"entry-selection-handles\" aria-hidden=\"true\"></span></div></div><div id=\"objectCompleteCallout\" class=\"entry-object-complete-callout\" role=\"note\" hidden>추가된 오브젝트 확인</div>\n    </div>\n    <div class=\"entry-setup-actions\"><button type=\"button\" id=\"openObjectChooser\">＋ 오브젝트 추가하기</button><button type=\"button\" class=\"entry-setup-run\">▶ 시작하기</button></div>\n    <div class=\"entry-setup-objects\"><span>오브젝트</span><div class=\"entry-setup-object entry-setup-bot-object\"><img src=\"../assets/entrybot.png\" alt=\"\">엔트리봇</div><div class=\"entry-setup-object added-led yellow\"><span class=\"entry-object-icon\"><svg class=\"entry-led-icon\" viewBox=\"0 0 86 100\" aria-hidden=\"true\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\"><path d=\"M43 4v8M15 17l7 7M71 17l-7 7M5 47h8M73 47h8M12 28l7 4M74 28l-7 4\"/></g><path d=\"M26 71V43a17 17 0 0 1 34 0v28Z\" fill=\"currentColor\" opacity=\".84\"/><path d=\"M31 66V43a12 12 0 0 1 21-8\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" opacity=\".78\"/><path d=\"M24 70Q43 80 62 70v10Q43 90 24 80Z\" fill=\"currentColor\"/><path d=\"M23 79Q43 89 63 79v7Q43 96 23 86Z\" fill=\"currentColor\" opacity=\".72\"/></svg></span><input id=\"addedLedLabel\" aria-label=\"오브젝트 이름\" value=\"노란LED\"></div>\n      <div class=\"entry-led-property\" id=\"ledProperty\" hidden><div class=\"entry-property-head\"><b id=\"propertyLedName\">노란LED</b><span>⌃　×</span></div><div class=\"entry-property-grid\"><label><input aria-label=\"X 위치\" value=\"0.0\"> X</label><label><input aria-label=\"Y 위치\" value=\"0.0\"> Y</label><label><input aria-label=\"크기\" value=\"100.0\"> % 크기</label><label><input aria-label=\"방향\" value=\"90.0\"> ° 방향</label></div></div>\n    </div>\n  </div>\n  <div class=\"entry-setup-right\">\n    <div class=\"entry-setup-tabs\"><span>블록</span><span>모양</span><span>소리</span><span class=\"active\">속성</span></div>\n    <div class=\"entry-setup-property\"><div class=\"entry-setup-categories\"><span>전체</span><button type=\"button\" class=\"setup-variable-tab\" id=\"selectVariableTab\">? 변수</button><span>⚑ 신호</span><span>▤ 리스트</span><span>⚒ 함수</span></div>\n      <button type=\"button\" id=\"openVariableChooser\">변수 추가하기</button>\n      <div class=\"entry-variable-folder\" id=\"variableFolder\">모든 오브젝트에서 사용하는 변수 (<b id=\"variableCount\">0</b>) <span>▱</span></div>\n      <div class=\"entry-variable-form\" id=\"variableChooser\" hidden><label>변수 이름<input id=\"variableName\" type=\"text\" value=\"LED밝기\" maxlength=\"20\" aria-label=\"변수 이름\"></label><div class=\"entry-variable-scope\">모든 오브젝트에서 사용</div><label><input type=\"radio\" name=\"variableScope\" checked> 일반 변수로 사용 (작품에 저장)</label><label><input type=\"radio\" name=\"variableScope\"> 공유 변수로 사용</label><div class=\"entry-variable-form-actions\"><button type=\"button\" data-setup-close>취소</button><button type=\"button\" id=\"confirmVariable\">변수 추가</button></div></div>\n      <div class=\"entry-setup-variable\" id=\"setupVariable\" hidden><div class=\"entry-variable-header\"><input id=\"variablePropertyName\" aria-label=\"변수 이름\" value=\"LED밝기\"></div><div class=\"entry-variable-settings\"><b>변수 속성</b><label>변수 기본값<input id=\"variableDefault\" aria-label=\"변수 기본값\" value=\"0\"></label><label class=\"entry-slider-toggle\"><input id=\"enableVariableSlider\" type=\"checkbox\"> 슬라이드</label><div class=\"entry-variable-range\" id=\"variableRange\" hidden><input id=\"variableMin\" aria-label=\"슬라이드 최소값\" value=\"0\"> ~ <input id=\"variableMax\" aria-label=\"슬라이드 최대값\" value=\"100\"></div></div></div>\n    </div>\n  </div>\n  \n  \n  \n  \n  \n</div>\n<div class=\"setup-number n1\">1</div><div class=\"setup-number n2\">2</div><div class=\"setup-number n3\">3</div><div class=\"setup-number n4\">4</div><div class=\"setup-number n5\">5</div><div class=\"setup-number n6\">6</div><div class=\"setup-number n7\">7</div><div class=\"setup-number n8\">8</div><div class=\"setup-number n9\">9</div><div class=\"setup-number n10\">10</div><div class=\"setup-number n11\">11</div><div class=\"setup-number n12\">12</div><div class=\"led-search-tip\">LED는 대문자로 입력하세요</div><div class=\"entry-setup-caption\" id=\"sceneGuide\">장면 1 옆의 +를 눌러 새 장면을 만듭니다.</div>\n<div class=\"entry-setup-dialog\" id=\"objectChooser\" role=\"dialog\" aria-label=\"오브젝트 추가하기\" hidden>\n  <div class=\"entry-object-window\"><div class=\"entry-object-head\"><button type=\"button\" data-setup-close aria-label=\"닫기\">×</button><b>오브젝트 추가하기</b><button type=\"button\" id=\"confirmObject\">추가하기</button></div>\n  <span class=\"setup-object-number object-n1\">1</span><span class=\"setup-object-number object-n2\">2</span><span class=\"setup-object-number object-n3\">3</span><div class=\"entry-object-toolbar\"><span class=\"active\">오브젝트 선택</span><span>파일 올리기</span><span>새로 그리기</span><span>글상자</span><label><input id=\"objectSearch\" type=\"search\" placeholder=\"오브젝트 검색\" aria-label=\"오브젝트 검색\" autocomplete=\"off\"><em class=\"led-search-callout\">대문자 LED</em><span>⌕</span></label></div>\n  <div class=\"entry-object-content\"><nav class=\"entry-object-categories\"><b>엔트리봇</b><span>유엔보</span><span>사람</span><span>동물</span></nav>\n  <div class=\"entry-object-results\"><div class=\"entry-result-tabs\">전체　 레벨　 이모티콘　 예전</div><div class=\"entry-led-options\" id=\"ledOptions\"><button type=\"button\" class=\"entry-result yellow\" data-led-option=\"4\"><svg class=\"entry-led-icon\" viewBox=\"0 0 86 100\" aria-hidden=\"true\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\"><path d=\"M43 4v8M15 17l7 7M71 17l-7 7M5 47h8M73 47h8M12 28l7 4M74 28l-7 4\"/></g><path d=\"M26 71V43a17 17 0 0 1 34 0v28Z\" fill=\"currentColor\" opacity=\".84\"/><path d=\"M31 66V43a12 12 0 0 1 21-8\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" opacity=\".78\"/><path d=\"M24 70Q43 80 62 70v10Q43 90 24 80Z\" fill=\"currentColor\"/><path d=\"M23 79Q43 89 63 79v7Q43 96 23 86Z\" fill=\"currentColor\" opacity=\".72\"/></svg><span>노란LED</span></button><button type=\"button\" class=\"entry-result red\" data-led-option=\"3\"><svg class=\"entry-led-icon\" viewBox=\"0 0 86 100\" aria-hidden=\"true\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\"><path d=\"M43 4v8M15 17l7 7M71 17l-7 7M5 47h8M73 47h8M12 28l7 4M74 28l-7 4\"/></g><path d=\"M26 71V43a17 17 0 0 1 34 0v28Z\" fill=\"currentColor\" opacity=\".84\"/><path d=\"M31 66V43a12 12 0 0 1 21-8\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" opacity=\".78\"/><path d=\"M24 70Q43 80 62 70v10Q43 90 24 80Z\" fill=\"currentColor\"/><path d=\"M23 79Q43 89 63 79v7Q43 96 23 86Z\" fill=\"currentColor\" opacity=\".72\"/></svg><span>빨간LED</span></button><button type=\"button\" class=\"entry-result green\" data-led-option=\"2\"><svg class=\"entry-led-icon\" viewBox=\"0 0 86 100\" aria-hidden=\"true\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\"><path d=\"M43 4v8M15 17l7 7M71 17l-7 7M5 47h8M73 47h8M12 28l7 4M74 28l-7 4\"/></g><path d=\"M26 71V43a17 17 0 0 1 34 0v28Z\" fill=\"currentColor\" opacity=\".84\"/><path d=\"M31 66V43a12 12 0 0 1 21-8\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" opacity=\".78\"/><path d=\"M24 70Q43 80 62 70v10Q43 90 24 80Z\" fill=\"currentColor\"/><path d=\"M23 79Q43 89 63 79v7Q43 96 23 86Z\" fill=\"currentColor\" opacity=\".72\"/></svg><span>초록LED</span></button><button type=\"button\" class=\"entry-result blue\" data-led-option=\"1\"><svg class=\"entry-led-icon\" viewBox=\"0 0 86 100\" aria-hidden=\"true\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\"><path d=\"M43 4v8M15 17l7 7M71 17l-7 7M5 47h8M73 47h8M12 28l7 4M74 28l-7 4\"/></g><path d=\"M26 71V43a17 17 0 0 1 34 0v28Z\" fill=\"currentColor\" opacity=\".84\"/><path d=\"M31 66V43a12 12 0 0 1 21-8\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" opacity=\".78\"/><path d=\"M24 70Q43 80 62 70v10Q43 90 24 80Z\" fill=\"currentColor\"/><path d=\"M23 79Q43 89 63 79v7Q43 96 23 86Z\" fill=\"currentColor\" opacity=\".72\"/></svg><span>파란LED</span></button></div></div>\n  <aside class=\"entry-selected-list\"><b>전체(<span id=\"objectSelectedCount\">0</span>)</b><div id=\"objectSelectedPreview\" hidden><svg class=\"entry-led-icon\" viewBox=\"0 0 86 100\" aria-hidden=\"true\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\"><path d=\"M43 4v8M15 17l7 7M71 17l-7 7M5 47h8M73 47h8M12 28l7 4M74 28l-7 4\"/></g><path d=\"M26 71V43a17 17 0 0 1 34 0v28Z\" fill=\"currentColor\" opacity=\".84\"/><path d=\"M31 66V43a12 12 0 0 1 21-8\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" opacity=\".78\"/><path d=\"M24 70Q43 80 62 70v10Q43 90 24 80Z\" fill=\"currentColor\"/><path d=\"M23 79Q43 89 63 79v7Q43 96 23 86Z\" fill=\"currentColor\" opacity=\".72\"/></svg><span id=\"objectSelectedName\">노란LED</span></div></aside></div></div>\n</div>\n</div>\n</section>";
function objectIcon(cfg,id){const o=cfg.options.find(o=>o.id===id)||cfg.options[0];return o.icon||'<svg class="entry-led-icon" viewBox="'+o.crop+'" aria-hidden="true"><image href="'+asset+o.image+'" width="'+o.width+'" height="'+o.height+'"/></svg>'}
function mount(cfg){
 const root=cfg.root||document.createElement('section');
 if(!cfg.root){root.className='slide entry-slide entry-scene-slide entry-setup-slide coding-setup-inserted';cfg.before.before(root);}
 const holder=document.createElement('template');holder.innerHTML=template;root.replaceChildren(...holder.content.firstElementChild.childNodes);
 root.setAttribute('aria-label','코딩 전 설정');root.dataset.setupKind=cfg.kind;
 root.querySelector('.entry-lesson-title').textContent=cfg.title;
 const icon=id=>objectIcon(cfg,id);
 const options=root.querySelector('#ledOptions');options.replaceChildren();
 for(const o of cfg.options){const button=document.createElement('button');button.type='button';button.className='entry-result '+(o.color||'object');button.dataset.ledOption=o.id;button.innerHTML=icon(o.id)+'<span>'+o.name+'</span>';options.append(button)}
 root.querySelectorAll('#variableName,#variablePropertyName').forEach(n=>n.value=cfg.variable);root.querySelector('#stageVariableName').textContent=cfg.variable;root.querySelector('#stageVariableSlider').setAttribute('aria-label',cfg.variable+' 값');
 const searchCallout=root.querySelector('.led-search-callout');if(cfg.searchTip)searchCallout.textContent=cfg.searchTip;else searchCallout.remove();
 const initial=document.createElement('div');initial.className='coding-setup-initial';const code=document.createElement('div');initial.append(code);root.querySelector('.entry-workspace').append(initial);
 const renderer=new E.Renderer(code,()=>{});
 function snapshot(){const scripts=E.clone(cfg.initialScripts());E.walk(scripts,n=>{delete n.run;delete n.group});const split=[];for(const script of scripts){const first=script.blocks[0];if(first?.type==='event')split.push({id:'setup-start-'+script.id,blocks:[first]});const rest=first?.type==='event'?script.blocks.slice(1):script.blocks;if(rest.length)split.push({id:'setup-rest-'+script.id,blocks:rest});}renderer.render(split);requestAnimationFrame(()=>renderer.reflow());}
 let sceneStep=0;
let objectStage='select';
let manualSetupDialog=null;
const defaultObject=cfg.defaultId,maxStep=cfg.slider?10:8;
let chosenLed=defaultObject;
let selectedLed=null;
const ledNames=Object.fromEntries(cfg.options.map(o=>[o.id,o.name]));
const ledColors=Object.fromEntries(cfg.options.map(o=>[o.id,o.color||'object']));
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
 if(step===4&&(objectStage==='select'||objectStage==='confirm'))add(4,'#ledOptions .selected','left');
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
 const slide=root;if(!slide)return;
 const step=sceneStep, second=slide.querySelector('[data-scene="2"]');
 root.querySelector('.coding-setup-initial').hidden=step!==0;
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
 if(!manualSetupDialog)search.value=step>=2?cfg.search:'';
 slide.querySelector('#ledOptions').hidden=!search.value.trim().toUpperCase().includes(cfg.search.toUpperCase());
 slide.querySelectorAll('[data-led-option]').forEach(button=>button.classList.toggle('selected',Number(button.dataset.ledOption)===selectedLed));
 const preview=slide.querySelector('#objectSelectedPreview');
 preview.hidden=!selectedLed;preview.className=selectedLed?ledColors[selectedLed]:'';
 slide.querySelector('#objectSelectedCount').textContent=selectedLed?'1':'0';
 slide.querySelector('#objectSelectedName').textContent=ledNames[selectedLed||defaultObject];
 slide.querySelector('#confirmObject').disabled=!selectedLed;
 const led=slide.querySelector('.entry-setup-led');
 if(led.dataset.objectId!==String(chosenLed)){led.dataset.objectId=chosenLed;led.innerHTML=icon(chosenLed)+'<span class="entry-selection-handles" aria-hidden="true"></span>';slide.querySelector('.entry-object-icon').innerHTML=icon(chosenLed);}
 slide.querySelector('#objectSelectedPreview .entry-led-icon')?.remove();slide.querySelector('#objectSelectedPreview').insertAdjacentHTML('afterbegin',icon(selectedLed||defaultObject));
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
 const name=slide.querySelector('#variableName').value.trim()||cfg.variable;
 slide.querySelector('#variablePropertyName').value=name;
 slide.querySelector('#stageVariableName').textContent=name;
  const stageVariable=slide.querySelector('#stageVariable');
 stageVariable.hidden=step<8;
 const sliderOn=cfg.slider&&step>=9;
 slide.querySelector('#enableVariableSlider').checked=sliderOn;
 slide.querySelector('#variableRange').hidden=!sliderOn;
 slide.querySelector('#stageVariableSlider').hidden=!sliderOn;
 slide.querySelector('#variableMax').value=step>=10?'255':'100';
 slide.querySelector('#stageVariableSlider').max=slide.querySelector('#variableMax').value;
 const captions=[
   '장면 1 옆의 +를 눌러 새 장면을 만듭니다.',
   '+오브젝트 추가하기 버튼을 클릭합니다.',
   '',
   cfg.searchTip||cfg.search+'를 검색합니다.',
   '선택한 오브젝트가 전체 리스트에 표기 됩니다',
   '추가한 오브젝트의 이름과 위치, 크기를 설정할 수 있습니다.',
   '속성 탭에서 변수를 선택합니다.',
   '변수 이름에 '+cfg.variable+'를 입력합니다.',
   cfg.variable+' 변수가 기본값 0으로 장면에 표시됩니다.',
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
 const slide=root,layout=slide?.querySelector('.entry-setup-layout');
 if(slide?.classList.contains('active')&&layout){updateSetupNumbers(slide,Number(layout.dataset.setupStep),layout.dataset.objectStage);positionObjectCompleteCallout(slide,Number(layout.dataset.setupStep));}
});
function advanceSetup(){
 if(manualSetupDialog)manualSetupDialog=null;
 if(sceneStep===1){sceneStep=3;updateScene();return;}
 if(sceneStep===4){
  if(!selectedLed)return;
  if(objectStage==='confirm'){
   chosenLed=selectedLed;
   root.querySelector('#addedLedLabel').value=ledNames[chosenLed];
   sceneStep=5;
   objectStage='select';
   manualSetupDialog=null;
   updateScene();
   return;
  }
  objectStage='confirm';updateScene();return;
 }
 if(sceneStep<maxStep){
  sceneStep++;
  if(sceneStep===4)selectedLed=defaultObject;
  if(sceneStep===5)chosenLed=selectedLed||defaultObject;
  if(sceneStep===7)root.querySelector('#variableName').value=cfg.variable;
  updateScene();
 }else cfg.onNext();
}
function previousSetup(){
 if(manualSetupDialog){manualSetupDialog=null;updateScene();return;}
 if(sceneStep===4&&objectStage==='confirm'){objectStage='select';updateScene();return;}
 if(sceneStep>0){sceneStep--;selectedLed=sceneStep>=4?chosenLed:null;updateScene();}
 else cfg.onPrevious();
}
root.querySelector('#sceneAdd')?.addEventListener('click',()=>{sceneStep=1;objectStage='select';manualSetupDialog=null;selectedLed=null;updateScene();});
root.querySelector('[data-scene="2"]')?.addEventListener('click',()=>{sceneStep=1;objectStage='select';manualSetupDialog=null;selectedLed=null;updateScene();});
root.querySelector('#addedLedLabel')?.addEventListener('input',event=>{root.querySelector('#propertyLedName').textContent=event.target.value;});
root.querySelector('#variablePropertyName')?.addEventListener('input',event=>{root.querySelector('#stageVariableName').textContent=event.target.value;root.querySelector('#variableName').value=event.target.value;});
root.querySelector('#variableDefault')?.addEventListener('input',event=>{root.querySelector('#stageVariableValue').textContent=event.target.value;});
root.querySelector('#openObjectChooser')?.addEventListener('click',()=>{manualSetupDialog='object';sceneStep=Math.max(3,sceneStep);selectedLed=null;root.querySelector('#objectSearch').value='';updateScene();});
root.querySelector('#selectVariableTab')?.addEventListener('click',()=>{sceneStep=Math.max(6,sceneStep);updateScene();});
root.querySelector('#openVariableChooser')?.addEventListener('click',()=>{sceneStep=Math.max(7,sceneStep);manualSetupDialog='variable';updateScene();});
root.querySelectorAll('.entry-setup-slide [data-setup-close]').forEach(button=>button.addEventListener('click',()=>{manualSetupDialog=null;if(sceneStep===7)sceneStep=6;updateScene();}));
root.querySelector('#objectSearch')?.addEventListener('input',event=>{
 const found=event.target.value.trim().toUpperCase().includes(cfg.search.toUpperCase());
 root.querySelector('#ledOptions').hidden=!found;
 if(!found){selectedLed=null;updateScene();}
});
root.querySelectorAll('[data-led-option]').forEach(button=>button.addEventListener('click',()=>{
 selectedLed=Number(button.dataset.ledOption);sceneStep=Math.max(4,sceneStep);objectStage='select';updateScene();
}));
root.querySelector('#confirmObject')?.addEventListener('click',()=>{
 if(!selectedLed)return;
 chosenLed=selectedLed;
 root.querySelector('#addedLedLabel').value=ledNames[chosenLed];
 document.activeElement?.blur?.();
 if(sceneStep===4&&objectStage==='confirm'){manualSetupDialog=null;updateScene();return;}
 sceneStep=5;objectStage='select';manualSetupDialog=null;
 updateScene();
});
root.querySelector('#confirmVariable')?.addEventListener('click',()=>{sceneStep=8;manualSetupDialog=null;updateScene();});
root.querySelector('#enableVariableSlider')?.addEventListener('change',event=>{sceneStep=event.target.checked?9:8;updateScene();});
root.querySelector('#variableMax')?.addEventListener('change',event=>{if(event.target.value==='255'){sceneStep=10;updateScene();}});
root.querySelector('#stageVariableSlider')?.addEventListener('input',event=>{root.querySelector('#stageVariableValue').textContent=event.target.value;});

 const api={root,get step(){return sceneStep},next:advanceSetup,prev:previousSetup,enter(last=false){sceneStep=last?maxStep:0;manualSetupDialog=null;selectedLed=null;objectStage='select';snapshot();updateScene();requestAnimationFrame(updateScene)}};
 api.enter();return api;
}
function insert(cfg){
 const original=[...document.querySelectorAll('main.wrap>.slide')].filter(n=>!n.classList.contains('hardware-connect-slide')),before=original[cfg.nextIndex];
 const api=mount({...cfg,before,onNext:()=>leave(cfg.nextIndex),onPrevious:()=>leave(cfg.previousIndex)});
 const info=before.querySelector('.entry-object-info'),thumb=document.createElement('span');
 thumb.className='entrybot-thumb coding-setup-object-thumb';thumb.setAttribute('aria-label',cfg.options.find(o=>o.id===cfg.defaultId).name);thumb.innerHTML=objectIcon(cfg,cfg.defaultId);info.prepend(thumb);
 if(cfg.kind==='dc'){before.querySelector('.dc5-workspace>.dc5-object-button')?.remove();thumb.id='dc5Button';}

 const sidebar=document.createElement('button');sidebar.type='button';sidebar.className='slide-sidebar-item';sidebar.innerHTML='<span class="sidebar-page-no"></span><span>코딩 전 설정</span>';
 const list=document.querySelector('#slideSidebarList');list.insertBefore(sidebar,list.children[[...document.querySelectorAll('main.wrap>.slide')].indexOf(api.root)]);
 let active=false,bypass=false,resume=n=>window.infoMotorController.showPage(n);
 function refresh(){const pages=[...document.querySelectorAll('main.wrap>.slide')],index=pages.findIndex(n=>n.classList.contains('active'));[...list.children].forEach((n,i)=>n.classList.toggle('active',i===index));window.lessonPages.refresh();}
 function enter(last=false,callback=resume){resume=callback;active=true;document.querySelectorAll('main.wrap>.slide').forEach(n=>n.classList.toggle('active',n===api.root));document.body.classList.add('entry-page','after-intro');api.enter(last);document.querySelector('#next').disabled=false;document.querySelector('#prev').disabled=false;refresh();}
 function leave(to){active=false;api.root.classList.remove('active');bypass=true;try{resume(to)}finally{bypass=false}refresh();}
 const hardware=window.hardwareConnect,previous=hardware.before.bind(hardware);
 hardware.before=function(from,to,callback){if(bypass)return previous(from,to,callback);if(active){active=false;api.root.classList.remove('active');requestAnimationFrame(refresh);return previous(from,to,callback)}
 if((from===cfg.previousIndex&&to===cfg.nextIndex)||(from===cfg.nextIndex&&to===cfg.previousIndex)){enter(to===cfg.previousIndex,callback);return true}requestAnimationFrame(refresh);return previous(from,to,callback)};
 list.addEventListener('click',event=>{const target=event.target.closest('button');if(target&&target!==sidebar){active=false;api.root.classList.remove('active');bypass=true;setTimeout(()=>{bypass=false;refresh()},0)}},true);
 sidebar.addEventListener('click',()=>{resume(cfg.nextIndex);if(!active)enter()});
 for(const [selector,action]of [['#next',()=>api.next()],['#prev',()=>api.prev()]])document.querySelector(selector).addEventListener('click',event=>{if(active){event.preventDefault();event.stopImmediatePropagation();action();refresh()}},true);
 document.addEventListener('keydown',event=>{if(!active||/input|textarea|select/i.test(event.target.tagName))return;const direction=window.lessonUI.direction(event);if(direction){event.preventDefault();event.stopImmediatePropagation();direction>0?api.next():api.prev();refresh()}},true);
 window.lessonPages.refresh();return api;
}
window.EntryCodingSetup={mount,insert};
})();
