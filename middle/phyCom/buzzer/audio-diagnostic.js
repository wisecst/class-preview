(()=>{
'use strict';
const build='audio-diag-20261005-01',rows=[];
const panel=document.createElement('aside');
panel.id='audioDiagnostic';panel.style.cssText='position:fixed;right:4px;bottom:4px;z-index:2147483647;background:#fff;color:#111;border:2px solid #345;border-radius:8px;width:min(390px,94vw);font:12px/1.4 monospace;padding:6px;max-height:42vh;overflow:auto';
panel.innerHTML='<b>'+build+'</b> <button type="button" id="audioTest440">iPhone 오디오 테스트 (440Hz·1초)</button> <button type="button" id="audioLogClear">로그 지우기</button><pre style="white-space:pre-wrap;margin:4px 0" id="audioLog"></pre>';
document.body.appendChild(panel);
function log(s){rows.push(new Date().toISOString().slice(11,23)+' '+s);if(rows.length>100)rows.shift();document.getElementById('audioLog').textContent=rows.join('\n');panel.scrollTop=panel.scrollHeight;}
window.buzzerAudioDiagnostic={log,build};
log('PAGE: '+(window===window.top?'top-level':'iframe')+'; fullscreen='+!!document.fullscreenElement);
try{log('FRAME allow: '+(window.frameElement?.getAttribute('allow')||'none/not accessible'));}catch(e){log('FRAME: '+e.message);}
log('SCRIPT: '+[...document.scripts].map(s=>s.getAttribute('src')).filter(Boolean).join(' | '));
['pointerup','touchend','click'].forEach(type=>document.addEventListener(type,e=>{const b=e.target.closest('button');if(b)log('EVENT: '+type+' trusted='+e.isTrusted+' target='+(b.id||b.dataset.buzzerResult||b.dataset.directPlay||b.getAttribute('aria-label')||b.textContent.trim()));},true));
['fullscreenchange','visibilitychange'].forEach(t=>document.addEventListener(t,()=>log(t+' hidden='+document.hidden+' fullscreen='+!!document.fullscreenElement)));
window.addEventListener('pagehide',()=>log('pagehide'));
window.addEventListener('error',e=>log('ERROR: '+e.message+' '+e.filename+':'+e.lineno));
window.addEventListener('unhandledrejection',e=>log('REJECTION: '+String(e.reason?.stack||e.reason)));
function wrap(proto,name,describe){if(!proto||typeof proto[name]!=='function')return;const original=proto[name];proto[name]=function(...args){try{log(describe.call(this,args));const result=original.apply(this,args);if(result&&typeof result.then==='function')result.then(()=>log(name+' SUCCESS state='+this.state),e=>log(name+' FAIL '+e.name+': '+e.message));return result;}catch(e){log(name+' ERROR '+e.name+': '+e.message);throw e;}};}
const Native=window.AudioContext||window.webkitAudioContext;
if(Native){
 const base=Object.getPrototypeOf(Native.prototype);
 for(const proto of [base,Native.prototype])for(const name of ['resume','suspend','close','createOscillator','createGain'])if(Object.prototype.hasOwnProperty.call(proto,name))wrap(proto,name,function(){return name+' BEFORE state='+this.state+' currentTime='+this.currentTime;});
 for(const name of ['AudioContext','webkitAudioContext'])if(window[name]){
  const Original=window[name];
  window[name]=new Proxy(Original,{construct(target,args){const c=Reflect.construct(target,args);log('CONTEXT: created state='+c.state+' sampleRate='+c.sampleRate);c.addEventListener('statechange',()=>log('STATE AFTER: '+c.state+' time='+c.currentTime));return c;}});
 }
}
wrap(window.AudioNode?.prototype,'connect',function(a){return 'DESTINATION: '+this.constructor.name+' -> '+a[0]?.constructor.name;});
for(const n of ['start','stop'])wrap(window.AudioScheduledSourceNode?.prototype,n,function(a){return n.toUpperCase()+': called time='+a[0]+' context='+this.context.currentTime;});
for(const n of ['setValueAtTime','linearRampToValueAtTime','cancelScheduledValues'])wrap(window.AudioParam?.prototype,n,function(a){return 'PARAM '+n+': '+a.join(',')+' current='+this.value;});
let testContext;
document.getElementById('audioTest440').addEventListener('click',()=>{
 try{
  log('TEST: direct click begin');
  const C=window.AudioContext||window.webkitAudioContext;if(!C)throw new Error('AudioContext unavailable');
  testContext??=new C();
  log('TEST STATE BEFORE: '+testContext.state);
  const o=testContext.createOscillator(),g=testContext.createGain();
  o.frequency.value=440;g.gain.value=.1;
  log('TEST GAIN: '+g.gain.value);
  o.connect(g);g.connect(testContext.destination);
  o.onended=()=>{log('TEST: ended state='+testContext.state+' time='+testContext.currentTime);o.disconnect();g.disconnect();};
  o.start();o.stop(testContext.currentTime+1);
  log('TEST: START and scheduled STOP submitted; state='+testContext.state);
 }catch(e){log('TEST ERROR: '+e.name+': '+e.message);}
});
document.getElementById('audioLogClear').addEventListener('click',()=>{rows.length=0;log('BUILD: '+build);});
})();