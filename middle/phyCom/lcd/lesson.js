// LCD lesson scaffold; wiring and textbook code will be supplied separately.
(()=>{'use strict';
const pages=[...document.querySelectorAll('main.wrap>.slide')],list=document.querySelector('#slideSidebarList');
let page=0;
for(const [index,title]of ['LCD','회로 연결','기본코드'].entries()){
 const button=document.createElement('button');button.className='slide-sidebar-item';button.innerHTML='<span class="sidebar-page-no"></span><span>'+title+'</span>';button.onclick=()=>show(index);list.append(button);
}
const pinDialog=document.querySelector('#lcdPinRoles'),pinOrder=['GND','VCC','SDA','SCL'];
const concept=new DeviceConcept({root:pages[0],pins:pinDialog,onNext:()=>show(1)});
// The shared DeviceConcept phase remains the only next/previous action index.
pages[0].querySelector('.device-concept-title>button').remove();
concept.reading.querySelector('.device-concept-close').remove();
concept.data.notes=[
 'LCD는 원하는 자료를 문자로 보여 주는 출력장치입니다.',
 '한 줄에 16개씩 두 줄, 총 32개 문자를 표시합니다.',
 '많은 핀을 연결하면 회로 구성이 어려워집니다.',
 'I2C 컨버터 모듈을 결합하면 4개의 배선을 사용합니다.',
 '교과서는 SDA를 A4, SCL을 A5에 연결하도록 설명합니다.'
];
concept.data.noteDisplay=concept.data.notes.map(()=>true);
const pinImage=pinDialog.querySelector('.pin-module-image'),pinImageFrame=document.createElement('div');
pinImageFrame.className='lcd-pin-image';pinImage.before(pinImageFrame);pinImageFrame.append(pinImage);
const pinFocus=document.createElement('span');pinFocus.className='lcd-pin-focus';pinFocus.setAttribute('aria-hidden','true');pinImageFrame.append(pinFocus);
const animationStart=13,animationEnd=animationStart+6;
const animation=new LcdConceptAnimation(pages[0].querySelector('.lcd-signal-animation'),()=>concept.phase-animationStart);
const closePopup=concept.closePopup;
concept.closePopup=()=>{animation.stop();closePopup();};
concept.render=function(immediate=true){
 this.close();
 const phase=this.phase,reading=phase>=1&&phase<=7,pin=phase>=9&&phase<=12;
 this.root.dataset.view=reading?'reading':pin?'pin':phase>=animationStart?'animation':'module';
 if(reading){
  this.read(false,Math.min(5,phase-1));
  const note=this.reading.querySelector('.device-concept-lesson');
  if(phase===1){note.hidden=false;note.innerHTML='<strong>수업용 부연 설명</strong><p>교과서 원문을 읽고, 다음 액션에서 핵심 내용을 하나씩 확인합니다.</p>';}
  if(phase===7){note.hidden=false;note.innerHTML='<strong>오렌지보드 연결 방법</strong><p>SDA → 디지털 핀 영역 최상단 <mark class="current">SDA</mark>\nSCL → 디지털 핀 영역 최상단 <mark class="current">SCL</mark></p>';}
 }else if(pin){
  const name=pinOrder[phase-9];
  pinDialog.querySelector('.pin-title').textContent='LCD · '+name+' 연결 방법';
  pinDialog.querySelectorAll('.pin-role-card').forEach(card=>card.hidden=card.querySelector('.pin-name').textContent!==name);
  pinFocus.style.top=({GND:33,VCC:43.5,SDA:54,SCL:64.5}[name])+'%';
  this.open('pins');
 }else if(phase>=animationStart)animation.sync(immediate);
 this.syncNav();
};
concept.next=()=>{if(concept.phase===animationEnd)show(1);else{concept.phase++;concept.render(false);}};
concept.prev=()=>{concept.phase=Math.max(0,concept.phase-1);concept.render(true);};
concept.phase=0;
DeviceConcept.heading(pages[1],{name:'LCD',type:'출력장치',page:178,subtitle:'회로 연결'});
const root=pages[2],controller=new EntryEngine.Controller({root,program:root.querySelector('.entry-program'),states:[{scripts:[]}],results:{},assetBase:'../assets/'});
const bar=new EntryEngine.ObjectBar({root,objects:[],book:'교과서 178쪽'});
bar.guide.textContent='LCD 코드 작성 단계는 추후 확정합니다.';
controller.tabs.render(['start','hardware'],'start');
function show(index){
 controller.stop();page=index;pages.forEach((slide,i)=>slide.classList.toggle('active',i===index));
 document.body.classList.toggle('entry-page',index===2);document.body.classList.toggle('after-intro',index>0);
 [...list.querySelectorAll('.slide-sidebar-item')].forEach((button,i)=>button.classList.toggle('active',i===index));
 lessonPages.refresh();document.querySelector('#slides').textContent=lessonPages.counter(pages[index]);
 document.querySelector('#prev').disabled=index===0&&concept.phase===0;document.querySelector('#next').disabled=index===2;
 if(index===0)concept.render();else animation.stop();
 if(index===1)requestAnimationFrame(()=>lessonCircuit.refresh());
 if(index===2)requestAnimationFrame(()=>controller.fit());
}
function move(direction){const target=page+direction;if(target<0||target>=pages.length)return;if(window.hardwareConnect?.before(page,target,show))return;show(target);}
document.querySelector('#next').onclick=()=>move(1);document.querySelector('#prev').onclick=()=>move(-1);
document.querySelector('#fullscreenBtn').onclick=()=>lessonStage.toggleFullscreen();
document.addEventListener('keydown',event=>{const direction=lessonUI.direction(event);if(direction){event.preventDefault();move(direction);}});
window.hardwareLessonAdapter={resume:show};window.addEventListener('pagehide',()=>{controller.stop();animation.stop();});show(0);
})();
