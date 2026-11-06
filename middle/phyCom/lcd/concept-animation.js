// Presentation only: the existing DeviceConcept phase is the sole action index.
(()=>{'use strict';
const bits='01000001',glyph=['01110','10001','10001','11111','10001','10001','10001','00000'];
window.LcdConceptAnimation=class{
 constructor(root,getAction){
  this.root=root;this.getAction=getAction;this.scope=null;
  const ns='http://www.w3.org/2000/svg';
  for(const [selector,x,y,dx,dy,size]of [['[data-dot-cell]',446,44,1.8,3,1.5],['[data-dot-zoom]',0,0,5,6,4]]){
   const group=root.querySelector(selector);
   for(let row=0;row<8;row++)for(let col=0;col<5;col++){const dot=document.createElementNS(ns,'rect');dot.classList.add('lcd-dot');dot.dataset.row=row;dot.dataset.lit=glyph[row][col];dot.setAttribute('x',x+col*dx);dot.setAttribute('y',y+row*dy);dot.setAttribute('width',size);dot.setAttribute('height',size);group.append(dot);}
  }
 }
 stop(){this.scope?.close();this.scope=null;}
 sync(immediate=false){
  this.stop();if(!this.root.closest('.slide').classList.contains('active'))return;
  const action=this.getAction(),duration=action===2?1600:action===5?9200:0,began=performance.now();
  const scope=this.scope=new EntryEngine.Resources();
  const paint=()=>{const elapsed=immediate?duration:Math.min(duration,performance.now()-began);this.paint(this.getAction(),elapsed);if(elapsed>=duration)this.stop();};
  paint();if(this.scope&&duration)scope.interval(paint,50);
 }
 paint(action,elapsed){
  const q=selector=>this.root.querySelector(selector),finished=action>=6;
  this.root.dataset.action=action;
  q('[data-character]').hidden=action<1;
  q('[data-decimal]').hidden=action<2||action===2&&elapsed<600;
  q('[data-binary]').hidden=action<2||action===2&&elapsed<1400;
  const transferring=action===5&&elapsed<6400,index=Math.min(7,Math.floor(elapsed/800));
  const dataHigh=action>=5?bits[finished?7:index]==='1':false;
  const clockHigh=transferring&&elapsed%800>=200&&elapsed%800<600;
  q('[data-sda-wave]').setAttribute('d','M155 80H205V'+(dataHigh?60:80)+'H423');
  q('[data-scl-wave]').setAttribute('d','M155 119H205V'+(clockHigh?99:119)+'H423');
  q('[data-sda-wave]').style.opacity=q('[data-scl-wave]').style.opacity=action>=4?'1':'.25';
  q('[data-sda-level]').textContent=action>=5?(dataHigh?'1 · HIGH':'0 · LOW'):'';
  q('[data-scl-level]').textContent=action>=5?(clockHigh?'HIGH':'LOW'):'';
  q('[data-sda-label]').textContent=action===5?'SDA·데이터 (A4)':action===6?'SDA·데이터 (SDA)':'SDA · 데이터';
  q('[data-scl-label]').textContent=action===5?'SCL·클록 (A5)':action===6?'SCL·클록 (SCL)':'SCL · 클록';
  q('[data-sda-label]').style.fontWeight=q('[data-scl-label]').style.fontWeight=action>=3?'700':'400';
  const token=q('[data-data-token]');token.hidden=!transferring;
  token.setAttribute('cx',155+(elapsed%800)/800*268);token.setAttribute('cy',dataHigh?60:80);
  q('[data-bit-status]').textContent=transferring?(index+1)+'/8 비트':action>=5?'8/8 비트':'';
  const converter=finished||action===5&&elapsed>=6400,controller=finished||action===5&&elapsed>=7200;
  q('[data-converter]').classList.toggle('active',converter);q('[data-controller]').classList.toggle('active',controller);
  const rows=finished?8:action===5?Math.max(0,Math.min(8,Math.floor((elapsed-8000)/150))):0;
  this.root.querySelectorAll('.lcd-dot').forEach(dot=>dot.classList.toggle('on',+dot.dataset.row<rows&&dot.dataset.lit==='1'));
  let caption=[
   '오렌지보드가 문자 데이터를 LCD로 보냅니다.',
   '출력할 문자 A를 준비합니다.',
   '보조 설명: 문자 A의 코드값 65를 8비트 01000001로 나타냅니다.',
   '많은 핀을 연결하는 대신 사용할 두 신호선의 역할을 살펴봅니다.',
   'SDA는 데이터, SCL은 클록입니다. 전원선 2개를 더해 4개 배선을 사용합니다.',
   transferring?'SDA의 한 비트가 SCL의 상승 시점에 읽힙니다.':elapsed<7200?'받은 데이터가 I2C 변환 회로로 전달됩니다.':elapsed<8000?'LCD 제어 회로로 전달됩니다.':'LCD 첫 번째 칸에 5×8 도트로 A를 표시합니다.',
   '오렌지보드의 SDA·SCL 단자를 사용합니다. 문자 A의 출력 상태를 유지합니다.'
  ][action];
  q('[data-animation-caption]').textContent=caption;
  this.root.dataset.sda=dataHigh?'1':'0';this.root.dataset.scl=clockHigh?'1':'0';this.root.dataset.rows=rows;
 }
};
})();
