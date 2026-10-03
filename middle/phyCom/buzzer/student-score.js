/* Visual transcription of student-entry-code.png, top to bottom.
   Entry octaves use C4 = MIDI 60. No rests or repeat blocks appear.
   Durations are literal seconds; this score uses quarter = 1 second. */
(() => {
 'use strict';
 const rows = [
  ['시',3,.25],['파#',4,.25],['시',4,.25],['파#',4,.25],
  ['솔',3,.25],['미',4,.25],['솔',4,.25],['미',4,.25],
  ['라',3,.25],['레',4,.25],['라',4,.25],['레',4,.25],
  ['미',4,.25],['라',4,.25],['시',3,.25],['라',4,.25],
  ['시',3,.25],['파#',4,.25],['시',4,.25],['파#',4,.25],
  ['솔',3,.25],['미',4,.25],['솔',4,.25],['미',4,.25],
  ['라',3,.25],['레',4,.25],['라',4,.25],['레',4,.25],
  ['미',4,.25],['라',4,.25],
  ['라',4,.125],['미',5,.125],['레',5,.125],['파#',5,.125],
  ['레',5,.25],['미',5,.125],['미',5,.5],['라',4,.125],
  ['시',5,.125],['미',5,.125],['파#',5,.125],['레',5,.25],
  ['미',4,.125],['레',4,.125]
 ];
 const semitones={'도':0,'레':2,'미':4,'파#':6,'솔':7,'라':9,'시':11};
 const letters={'도':0,'레':1,'미':2,'파#':3,'솔':4,'라':5,'시':6};
 const notes=rows.map(([name,octave,seconds])=>[name,octave,seconds,12*(octave+1)+semitones[name]]);
 const pageSize=16;
 function score(first=0){
  let svg='<svg class="student-score" viewBox="0 0 1200 360" role="img" aria-label="학생 코드 악보: '+(first+1)+'~'+Math.min(first+pageSize,notes.length)+'번째 음"><title>학생 코드와 같은 음 · 이번 악보의 4분음표 기준 1초</title>';
  for(let row=0;row<2;row++){
   const bottom=90+row*180;
   for(let l=0;l<5;l++)svg+=`<path d="M25 ${bottom-l*12}H1180" stroke="#687f8d" stroke-width="1.7" fill="none"/>`;
   svg+=`<g transform="translate(72 ${bottom-12})" aria-label="높은음자리표"><path d="M2 58 C-22 43 -22 14 0 -5 C23 -25 19 -55 9 -57 C-5 -58 -9 -36 0 -13 C9 10 18 30 9 43 C-1 57 -23 43 -15 29 C-11 21 0 26 -3 34 M0 -5 C-26 -2 -29 27 -7 31 C14 37 27 18 12 6 C1 -3 -13 8 -8 20 M9 -57 L1 58" fill="none" stroke="#243447" stroke-width="4" stroke-linecap="round"/></g>`;
   let elapsed=notes.slice(0,first+row*8).reduce((t,n)=>t+n[2],0);
   notes.slice(first+row*8,first+row*8+8).forEach((n,j)=>{
    const i=first+row*8+j,x=155+j*140,diatonic=(n[1]-4)*7+letters[n[0]],y=bottom+12-diatonic*6;
    const up=y>=bottom-24,sx=x+(up?9:-9),sy=y+(up?-38:38),flags=n[2]===.5?1:n[2]===.25?2:3;
    if(j>0&&Math.abs(elapsed/4-Math.round(elapsed/4))<1e-8)svg+=`<path d="M${x-67} ${bottom-48}v48" stroke="#687f8d" fill="none"/>`;
    svg+=`<g class="student-note" data-student-note="${i}" aria-label="${i+1}: ${n[0]}${n[1]}, ${n[2]}초"><rect class="student-halo" x="${x-57}" y="${bottom-73}" width="114" height="160" rx="10"/>`;
    for(let ly=bottom+12;ly<=y;ly+=12)svg+=`<path d="M${x-18} ${ly}h36" stroke="currentColor" stroke-width="2"/>`;
    for(let ly=bottom-60;ly>=y;ly-=12)svg+=`<path d="M${x-18} ${ly}h36" stroke="currentColor" stroke-width="2"/>`;
    if(n[0].includes('#'))svg+=`<text x="${x-30}" y="${y+7}" font-size="25">♯</text>`;
    svg+=`<ellipse cx="${x}" cy="${y}" rx="10" ry="7" transform="rotate(-15 ${x} ${y})" fill="currentColor"/><path d="M${sx} ${y}V${sy}" stroke="currentColor" stroke-width="2.5"/>`;
    for(let f=0;f<flags;f++)svg+=`<path d="M${sx} ${sy+(up?f*8:-f*8)}q${up?19:-19} ${up?8:-8} ${up?9:-9} ${up?24:-24}" stroke="currentColor" stroke-width="2.5" fill="none"/>`;
    svg+=`<text x="${x}" y="${bottom+56}" text-anchor="middle" font-size="23" font-weight="800">${n[0]}${n[1]}</text><text x="${x}" y="${bottom+80}" text-anchor="middle" font-size="20">${n[2]}초</text></g>`;
    elapsed+=n[2];
   });
  }
  return svg+'</svg>';
 }
 let root,first=0;
 function renderScore(){root.querySelector('.student-score-view').innerHTML=score(first);root.querySelector('.student-score-range').textContent=`${first+1}–${Math.min(first+pageSize,notes.length)} / ${notes.length}음`;root.querySelector('[data-student-score-prev]').disabled=first===0;root.querySelector('[data-student-score-next]').disabled=first+pageSize>=notes.length;}
 function init(el){
  root=el;
  root.innerHTML='<div class="student-work"><div class="student-heading"><div><h2>학생 예시 작품</h2><p>악보 ↔ 엔트리 코드 ↔ 실제 연주</p></div><button type="button" class="birthday-run student-run" data-direct-play="student" aria-label="학생 작품 재생" aria-pressed="false">▶</button></div><section class="student-score-card"><div class="student-score-tools"><b>이번 악보 기준: 4분음표 = 1초</b><div><button type="button" data-student-score-prev aria-label="이전 악보 구간">‹</button><strong class="student-score-range"></strong><button type="button" data-student-score-next aria-label="다음 악보 구간">›</button></div></div><div class="student-score-view"></div></section><section class="student-code-card"><div class="student-code-heading"><b>학생 작품 원본 코드</b><span class="student-current">44음 · 쉼·반복 없음 · 한 번 연주</span></div><div class="student-code-scroll" tabindex="0" role="region" aria-label="학생 원본 코드, 위아래로 스크롤"><div class="student-code-image"><img src="../assets/student-entry-code.png" width="340" height="704" alt="학생이 만든 엔트리 원본 코드: 시작 버튼 다음 44개 피에조 부저 음 블록"><span class="student-code-highlight" hidden aria-hidden="true"></span></div></div></section></div>';
  root.querySelector('[data-student-score-prev]').addEventListener('click',()=>{first=Math.max(0,first-pageSize);renderScore();});
  root.querySelector('[data-student-score-next]').addEventListener('click',()=>{first=Math.min(32,first+pageSize);renderScore();});
  renderScore();
 }
 function highlight(index){
  const nextFirst=Math.floor(index/pageSize)*pageSize;
  if(first!==nextFirst){first=nextFirst;renderScore();}
  root.querySelectorAll('.student-note.playing').forEach(el=>el.classList.remove('playing'));
  root.querySelector(`[data-student-note="${index}"]`)?.classList.add('playing');
  const marker=root.querySelector('.student-code-highlight'),viewer=root.querySelector('.student-code-scroll'),image=root.querySelector('.student-code-image');
  // Original image: first hardware row begins at y=22, pitch block spacing=15px.
  marker.style.top=((22+index*15)/704*100)+'%';marker.hidden=false;
  const scale=image.clientWidth/340,top=(22+index*15)*scale,height=15*scale;
  if(top<viewer.scrollTop||top+height>viewer.scrollTop+viewer.clientHeight)viewer.scrollTop=Math.max(0,top-viewer.clientHeight*.35);
  const n=notes[index];root.querySelector('.student-current').textContent=`${index+1} / 44 · ${n[0]}${n[1]} · ${n[2]}초`;
 }
 function reset(){if(!root)return;first=0;renderScore();root.querySelector('.student-code-highlight').hidden=true;root.querySelector('.student-code-scroll').scrollTop=0;root.querySelector('.student-current').textContent='44음 · 쉼·반복 없음 · 한 번 연주';}
 window.buzzerStudentWork={notes,init,highlight,reset};
})();
