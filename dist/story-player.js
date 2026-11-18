import {voyages,sceneResult} from './voyages.js';

import {learning} from './learning.js';

import {createVoicePreview} from './voice-preview.js';



export function createStoryPlayer(root,{artifact,icon,esc,passport,save,onClose,onInspect,onFinish}){

 const story=voyages[artifact.id],reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

 let viewer,voicePreview,dead=false,started=false,ended=false,step=0,completed=false,muted=true,visited=new Set(),layers=new Set(),timer=null,anim=null,rangeValue=0,speechEpoch=0;

 let soundContext,audio=new Audio();audio.preload='auto';audio.src=clip('intro');

 const $=s=>root.querySelector(s);

 const total=story.scenes.length;

 const saved=passport[artifact.id]||{};

 const resume=saved.storyStep>0&&!saved.storyCompleted?Math.min(saved.storyStep,total-1):0;

 root.innerHTML=`<section class="voyage" role="dialog" aria-modal="true" aria-label="${artifact.name} playable story" data-artifact="${artifact.id}" data-mechanic="intro">

  <div class="voyage-stars"></div><div class="voyage-glow"></div>

  <div class="voyage-stage" id="voyage-stage"><img class="voyage-fallback" src="assets/${artifact.image}" alt="${artifact.name} mission photograph"><span class="voyage-loading">Calling across the distance…</span></div>

  <div class="voyage-evidence" hidden></div>

  <header class="voyage-hud"><div class="voyage-identity"><span class="voyage-signal"></span><span>${artifact.name} <small>${artifact.world} / A playable memory</small></span></div><nav class="voyage-timeline" aria-label="Story moments"></nav><div class="voyage-hud-actions"><button data-story-action="voices" aria-label="Preview narrator voices">${icon('book',20)}<span>Voices</span></button><button data-story-action="sound" aria-label="Enable story sound">${icon('spark',20)}<span>Sound off</span></button><button data-story-action="close" aria-label="Leave the story">${icon('close',23)}</button></div></header>

  <div class="voyage-cover"><span class="voyage-eyebrow">ECHOES / ${story.tag}</span><h1>${story.title}</h1><p>${story.intro}</p><button class="voyage-primary" data-story-action="start">${resume?'Continue my story':'Begin the story'} ${icon('right',22)}</button><span class="voyage-cover-note">Narration + captions · sound starts when you play<br>Original dramatization, grounded in NASA evidence</span></div>

  <div class="voyage-title" hidden><span class="voyage-eyebrow" id="voyage-time"></span><h2 tabindex="-1"></h2><span class="voyage-moment"></span></div>

  <div class="voyage-console" hidden><p class="voyage-caption" aria-live="polite"></p><div class="voyage-interaction"></div><div class="voyage-navigation"><button data-story-action="previous">${icon('back',17)} Previous moment</button><button class="voyage-source" data-source="${story.scenes[0].ref}">${icon('book',16)} The real evidence ${icon('arrow',14)}</button><button class="voyage-primary" data-story-action="next" hidden>Follow the echo ${icon('right',20)}</button></div></div>

  <p class="voyage-visual-note">${artifact.modelType?'Original 3D illustration · based on NASA photographs and design information':'NASA engineering model · illustrated environment'}</p><span class="voyage-audio-status" role="status"></span><div class="voyage-ending" hidden></div>

 </section>`;

 audio.id='voyage-narration';audio.hidden=true;$('.voyage').append(audio);

 audio.addEventListener('playing',()=>{if(!dead)$('.voyage-audio-status').textContent='';});

 audio.addEventListener('error',()=>{if(!dead&&!muted)$('.voyage-audio-status').textContent='Sound is unavailable here. The captions tell the full story.';});

 $('.voyage-hud [data-story-action="close"]').focus({preventScroll:true});

 function clip(suffix){return `assets/narration/${artifact.id}-${suffix}.${artifact.narrationFormat||'wav'}`;}

 function say(suffix){const token=++speechEpoch;audio.pause();audio.src=clip(suffix);if(!muted&&!voicePreview)audio.play().catch(error=>{if(dead||muted||token!==speechEpoch||error.name==='AbortError')return;$('.voyage-audio-status').textContent='Sound could not start. The captions tell the full story.';});}

 function pulse(){if(muted)return;try{soundContext ||= new (window.AudioContext||window.webkitAudioContext)();soundContext.resume();const osc=soundContext.createOscillator(),gain=soundContext.createGain(),now=soundContext.currentTime;osc.type='sine';osc.frequency.setValueAtTime(92,now);osc.frequency.exponentialRampToValueAtTime(42,now+1.5);gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(.1,now+.08);gain.gain.exponentialRampToValueAtTime(.0001,now+1.6);osc.connect(gain).connect(soundContext.destination);osc.start();osc.stop(now+1.65);}catch{/* Captions and visual pulses remain available. */}}

 function updateSound(){const b=$('[data-story-action="sound"]');b.setAttribute('aria-label',muted?'Enable story sound':'Mute story sound');b.innerHTML=`${icon('spark',20)}<span>Sound ${muted?'off':'on'}</span>`;b.setAttribute('aria-pressed',String(!muted));}

 function clearMotion(){clearTimeout(timer);cancelAnimationFrame(anim);timer=anim=null;}

 function checkpoint(done=false){passport[artifact.id]={...passport[artifact.id],storyStep:done?total:Math.max(passport[artifact.id]?.storyStep||0,step+1),...(done?{storyCompleted:true}:{})};save();}

 function updateTimeline(){const furthest=Math.max(step,Math.min(total-1,passport[artifact.id]?.storyStep||0));$('.voyage-timeline').innerHTML=story.scenes.map((s,i)=>`<button data-story-step="${i}" ${i>furthest?'disabled':''} class="${i===step&&!ended?'current':''} ${visited.has(i)?'done':''}" aria-label="Moment ${i+1}: ${esc(s.title)}" aria-current="${i===step&&!ended?'step':'false'}"><span>${String(i+1).padStart(2,'0')}</span></button>`).join('');}

 function interaction(s){

  if(s.type==='part')return `<span class="voyage-instruction">${s.action} · tap a part on the model or choose below</span><div class="voyage-choices">${artifact.hotspots.map((p,i)=>`<button data-story-part="${i}"><b>0${i+1}</b>${p.name}</button>`).join('')}</div>`;

  if(s.type==='choice')return `<div class="voyage-choices">${s.choices.map((choice,i)=>`<button data-story-choice="${i}">${choice} ${icon('right',18)}</button>`).join('')}</div>`;

  if(['scan','dust','reveal','drive','dig'].includes(s.type))return `<label class="voyage-instruction" for="voyage-range">${s.action}</label><div class="voyage-range-row"><span>${s.type==='dust'?'Clear':s.type==='scan'?'Search':s.type==='drive'?'Start':s.type==='dig'?'Raised':'Hidden'}</span><input id="voyage-range" type="range" min="0" max="100" value="0" step="1" aria-label="${s.action}"><span>${s.type==='dust'?'Dusty':s.type==='scan'||s.type==='drive'?'Explore':s.type==='dig'?'Lowered':'Revealed'}</span></div>${s.type==='dust'?'<div class="voyage-light"><span>Sunlight reaching the panels: <b id="voyage-light-label">Sunlit</b></span><div><i></i></div><small>Illustration of the light–power relationship, not mission telemetry</small></div>':''}`;

  if(s.type==='layers')return `<div class="voyage-choices layer-choices">${['crust','mantle','core'].map(x=>`<button data-layer="${x}" aria-pressed="false">${x[0].toUpperCase()+x.slice(1)} ${icon('plus',17)}</button>`).join('')}</div><span class="voyage-instruction" id="layer-instruction">Touch each layer to follow the wave.</span>`;

  return `<button class="voyage-primary voyage-perform" data-story-action="perform">${s.type==='listen'?icon('spark',20):icon('arrow',20)} ${s.action}</button><span class="voyage-instruction">${s.type==='listen'?'Sound and waves are illustrative. You can play with sound off.':s.type==='laser'?'Illustrated light path and timing · not to scale':'Illustrated stage separation · not a flight simulation'}</span>`;

 }

 function evidence(s){

  const target=$('.voyage-evidence');target.hidden=!['scan','reveal','layers','listen','laser'].includes(s.type);

  if(['scan','reveal'].includes(s.type)){target.innerHTML=`<div class="voyage-photo ${s.type==='scan'?'scanner-photo':'reveal-photo'}">${s.secondImage?`<div class="voyage-comparison"><figure><img src="assets/${s.image}" alt="Phoenix trench on sol 20, before the small pieces disappeared"><figcaption>Sol 20 · Earlier</figcaption></figure><figure><img src="assets/${s.secondImage}" alt="Phoenix trench on sol 24, small pieces missing from lower left"><figcaption>Sol 24 · Four days later</figcaption></figure></div>`:`<img src="assets/${s.image}" alt="${esc(s.caption)}">`}${s.type==='scan'?'<span class="scanner-target" aria-hidden="true"></span><span class="scanner-line" aria-hidden="true"></span>':'<span class="reveal-darkness" aria-hidden="true"></span>'}<span class="voyage-reticle" aria-hidden="true">+</span></div><p>${s.caption}${reduced&&s.poster?' · Still frame for reduced motion':''}${s.type==='scan'?' · scanner is illustrative':''}</p>`;}

  else if(s.type==='laser')target.innerHTML=`<div class="laser-path"><svg viewBox="0 0 320 190" role="img" aria-label="Illustration of a laser pulse traveling from Earth to the Moon and returning"><circle cx="47" cy="95" r="31" fill="#2865c5"/><path d="M28 74 Q46 72 53 85 L68 93 53 111 33 103 Z" fill="#93c8e7"/><circle cx="273" cy="95" r="24" fill="#c4c8d0"/><rect x="246" y="82" width="7" height="24" rx="2" fill="#506d9b"/><path class="laser-out" d="M82 78 H238" fill="none" stroke="#0032a0" stroke-width="3" stroke-dasharray="9 7"/><path class="laser-return" d="M238 112 H82" fill="none" stroke="#e4002b" stroke-width="3" stroke-dasharray="9 7"/><path d="M230 72 L240 78 230 84 M90 106 L80 112 90 118" fill="none" stroke="#0032a0" stroke-width="2"/><text x="47" y="152" text-anchor="middle">Earth</text><text x="266" y="152" text-anchor="middle">Reflector</text></svg></div><p>Illustrated light path · distance, brightness, and timing are not to scale</p>`;
  else if(s.type==='layers')target.innerHTML=`<div class="layer-world"><svg viewBox="0 0 260 260" role="img" aria-label="Illustration of the Martian crust, mantle, and core"><circle class="layer-crust" data-layer="crust" cx="130" cy="130" r="112" fill="#e89654"/><circle class="layer-mantle" data-layer="mantle" cx="130" cy="130" r="98" fill="#a34026"/><circle class="layer-core" data-layer="core" cx="130" cy="130" r="49" fill="#ffce4b"/><path class="layer-wave" d="M18 130 Q70 30 130 130 Q190 230 242 130" fill="none" stroke="#fff4ab" stroke-width="3" stroke-dasharray="6 8"/></svg><span class="layer-label layer-label-crust">Crust</span><span class="layer-label layer-label-mantle">Mantle</span><span class="layer-label layer-label-core">Core</span></div><p>Illustration of interior layers · not to scale</p>`;

  else if(s.type==='listen')target.innerHTML=`<div class="voyage-wave" aria-hidden="true">${Array.from({length:45},(_,i)=>`<i style="--h:${12+Math.abs(Math.sin(i*.74)*Math.cos(i*.31))*70}%;--d:${i*.035}s"></i>`).join('')}</div><p>Illustrative waveform and sonification · not recorded mission data</p>`;

 }

 function applyScene(){if(!viewer)return;const s=story.scenes[step];viewer.reset();viewer.storyEffect('none');if(s.type==='drive')viewer.drive(rangeValue/100);if(s.type==='dig')viewer.sample(rangeValue/100);if(s.type==='dust')viewer.storyEffect('dust',rangeValue/100);if(s.type==='listen'&&(completed||$('.voyage').classList.contains('is-performing')))viewer.storyEffect('listen',1);if(step===0&&s.type==='part'&&artifact.id==='opportunity')viewer.storyEffect('sunrise',completed?1:0);if(s.type==='ascent'||(artifact.id==='eagle'&&step===2))viewer.storyEffect('ascent',s.type==='ascent'?(completed?1:0):1);if(s.focus!==undefined)viewer.focusHotspot(s.focus);if(completed&&s.type==='part')viewer.focusHotspot(s.target);}

 function showScene(index){clearMotion();step=index;completed=false;ended=false;rangeValue=0;layers=new Set();const s=story.scenes[step];$('.voyage').dataset.mechanic=s.type;$('.voyage').classList.remove('scene-complete','is-performing');$('.voyage-cover').hidden=true;$('.voyage-ending').hidden=true;$('.voyage-title').hidden=false;$('.voyage-console').hidden=false;$('#voyage-time').textContent=s.time;$('.voyage-title h2').textContent=s.title;$('.voyage-moment').textContent=`MOMENT ${String(step+1).padStart(2,'0')} / ${String(total).padStart(2,'0')}`;$('.voyage-caption').textContent=s.line;$('.voyage-interaction').innerHTML=interaction(s);$('[data-story-action="next"]').hidden=true;$('[data-story-action="previous"]').hidden=step===0;$('.voyage-source').dataset.source=s.ref;$('.voyage-visual-note').textContent=s.type==='ascent'||(artifact.id==='eagle'&&step===2)?'Stage separation illustration · only the descent stage remained':artifact.modelNote;updateTimeline();evidence(s);applyScene();say(String(step));$('.voyage').scrollTop=0;$('.voyage-title h2').focus({preventScroll:true});}

 function complete(){if(completed||dead)return;completed=true;visited.add(step);checkpoint();$('.voyage').classList.add('scene-complete');$('.voyage-caption').textContent=story.scenes[step].success;const next=$('[data-story-action="next"]');next.hidden=false;next.innerHTML=`${step===total-1?'Carry this echo with you':'Follow the echo'} ${icon('right',20)}`;$('.voyage-interaction').insertAdjacentHTML('beforeend',`<span class="voyage-found" role="status">${icon('check',18)} ${story.scenes[step].type==='choice'?'You followed the evidence.':'A memory unlocked.'}</span>`);updateTimeline();say(`${step}-result`);}

 function part(index){if(!started||ended||completed||story.scenes[step].type!=='part')return;const s=story.scenes[step];viewer?.focusHotspot(index);const old=passport[artifact.id]||{};passport[artifact.id]={...old,parts:[...new Set([...(old.parts||[]),index])]};save();if(sceneResult(s,index)){viewer?.storyEffect('sunrise',1);complete();}else{const p=learning[artifact.id].parts[index];$('.voyage-caption').textContent=`${p.simple} ${learning[artifact.id].parts[s.target].hint}`;}}

 function range(value){const s=story.scenes[step],v=Number(value);rangeValue=v;if(s.type==='drive')viewer?.drive(v/100);if(s.type==='dig')viewer?.sample(v/100);if(s.type==='dust'){viewer?.storyEffect('dust',v/100);$('.voyage').style.setProperty('--dust',v/100);$('#voyage-light-label').textContent=v<35?'Sunlit':v<80?'Dim':'Dark';$('.voyage-light i').style.width=`${100-v}%`;}

  if(s.type==='scan')$('.scanner-line').style.left=`${v}%`;if(s.type==='reveal')$('.reveal-darkness').style.clipPath=`inset(0 0 0 ${v}%)`;if(!completed&&sceneResult(s,v)){if(s.type==='reveal')$('.reveal-darkness').style.clipPath='inset(0 0 0 100%)';complete();}}

 function layer(value){if(!['crust','mantle','core'].includes(value)||story.scenes[step].type!=='layers')return;layers.add(value);root.querySelectorAll('[data-layer]').forEach(b=>{const found=layers.has(b.dataset.layer);b.classList.toggle('layer-visited',found);if(b.tagName==='BUTTON')b.setAttribute('aria-pressed',String(found));});$('#layer-instruction').textContent={crust:'Crust: the outer rocky layer.',mantle:'Mantle: the layer between crust and core.',core:'Core: the central region, studied through seismic waves.'}[value];pulse();if(sceneResult(story.scenes[step],[...layers]))complete();}

 function perform(){if(completed||$('.voyage').classList.contains('is-performing'))return;const s=story.scenes[step];$('.voyage').classList.add('is-performing');$('.voyage-perform').disabled=true;$('.voyage-perform').textContent=s.type==='listen'?'Following the vibration…':s.type==='laser'?'The light is making a return trip…':'The ascent stage is lifting away…';pulse();if(s.type==='listen')viewer?.storyEffect('listen',1);const begin=performance.now(),duration=reduced?600:3000;function tick(now){if(dead)return;const value=Math.min(1,(now-begin)/duration);if(s.type==='ascent')viewer?.storyEffect('ascent',value);if(value<1)anim=requestAnimationFrame(tick);else{complete();$('.voyage-perform').textContent=s.type==='listen'?'A wave carried a clue.':s.type==='laser'?'The light returned.':'One stage stayed. One stage left.';}}anim=requestAnimationFrame(tick);}

 function finish(){clearMotion();ended=true;checkpoint(true);$('.voyage').dataset.mechanic='ending';$('.voyage-title').hidden=true;$('.voyage-console').hidden=true;$('.voyage-evidence').hidden=true;$('.voyage-ending').hidden=false;$('.voyage-ending').innerHTML=`<span class="voyage-eyebrow">ECHO RECOVERED / ${artifact.name}</span><div class="echo-medallion">${icon('star',48)}</div><h2 tabindex="-1">You carried the story forward.</h2><p>${story.ending}</p><blockquote>${story.takeaway}</blockquote><span class="voyage-found">${icon('check',18)} Four memories explored · saved on this device</span><div class="voyage-ending-actions"><button class="voyage-primary" data-story-action="finish">Return to the worlds ${icon('arrow',20)}</button><button data-story-action="inspect">Explore the hardware ${icon('cube',18)}</button><button data-story-action="replay">Replay this story ${icon('reset',18)}</button></div>`;updateTimeline();$('.voyage').scrollTop=0;$('.voyage-ending h2').focus({preventScroll:true});viewer?.reset();if(artifact.id==='eagle'){viewer?.storyEffect('ascent',1);$('.voyage-visual-note').textContent='Illustrated descent stage · the part that remained at the landing site';}say('ending');}

 function click(e){const partButton=e.target.closest('[data-story-part]'),choice=e.target.closest('[data-story-choice]'),layerButton=e.target.closest('[data-layer]'),moment=e.target.closest('[data-story-step]');if(partButton){part(+partButton.dataset.storyPart);return;}if(layerButton){layer(layerButton.dataset.layer);return;}if(moment&&!moment.disabled){showScene(+moment.dataset.storyStep);return;}if(choice&&!completed){const s=story.scenes[step];if(sceneResult(s,+choice.dataset.storyChoice))complete();else{$('.voyage-caption').textContent=s.hint;choice.classList.add('try-another');choice.setAttribute('aria-label',`${choice.textContent}. Think again: ${s.hint}`);}return;}

  const action=e.target.closest('[data-story-action]')?.dataset.storyAction;if(!action)return;

  if(action==='start'){started=true;muted=false;updateSound();showScene(resume);}

  if(action==='voices'){if(!voicePreview)voicePreview=createVoicePreview($('.voyage'),{icon,esc,storyAudio:audio,onClose:()=>{voicePreview=null;if(!dead)$('[data-story-action="voices"]')?.focus({preventScroll:true});}});}

  if(action==='sound'){muted=!muted;updateSound();if(muted){audio.pause();soundContext?.suspend();}else{say(!started?'intro':ended?'ending':`${step}${completed?'-result':''}`);}}

  if(action==='next'&&completed){if(step===total-1)finish();else showScene(step+1);}

  if(action==='previous'&&step>0)showScene(step-1);

  if(action==='perform')perform();

  if(action==='close')onClose();if(action==='inspect')onInspect();if(action==='finish')onFinish();if(action==='replay'){visited=new Set();showScene(0);}

 }

 function input(e){if(e.target.id==='voyage-range')range(e.target.value);}

 function key(e){if(e.defaultPrevented||document.querySelector('.echo-chat-panel')||document.querySelector('.modal')||root.querySelector('.voice-picker')||e.key!=='Tab')return;const items=[...root.querySelectorAll('button:not(:disabled),a,input')].filter(x=>x.getClientRects().length),first=items[0],last=items.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}

 function pauseForChat(){++speechEpoch;muted=true;audio.pause();soundContext?.suspend();voicePreview?.dispose(false);voicePreview=null;updateSound();$('.voyage-audio-status').textContent='Narration paused while you chat with Echo.';}
 document.addEventListener('echo-chat-open',pauseForChat);
 root.addEventListener('click',click);root.addEventListener('input',input);document.addEventListener('keydown',key);

 import('./viewer.js').then(({createViewer})=>{if(dead)return null;return createViewer($('#voyage-stage'),{artifact,cinematic:true,onSelect:part});}).then(result=>{if(!result)return;if(dead){result.dispose();return;}viewer=result;$('.voyage-fallback')?.remove();$('.voyage-loading')?.remove();if(started)applyScene();}).catch(()=>{if(dead)return;$('.voyage-loading').textContent='Mission photo · 3D unavailable. Every story action still works below.';});

 return {dispose(){if(dead)return;dead=true;voicePreview?.dispose(false);clearMotion();audio.pause();audio.removeAttribute('src');audio.load();soundContext?.close();viewer?.dispose();root.removeEventListener('click',click);root.removeEventListener('input',input);document.removeEventListener('keydown',key);document.removeEventListener('echo-chat-open',pauseForChat);root.replaceChildren();}};

}

