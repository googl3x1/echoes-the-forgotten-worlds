import {learningStories} from './learning-stories.js';
import {createStoryGallery} from './story-media.js';

export function learningAudioPath(id,index){return `assets/learning-narration/${id}-${index}.mp3`;}
export function rememberReading(previous={},chapter,total,completed=false){
 previous=previous&&typeof previous==='object'&&!Array.isArray(previous)?previous:{};
 const index=Math.max(0,Math.min(total-1,Number.isInteger(chapter)?chapter:0));
 const stored=Array.isArray(previous.reading?.visited)?previous.reading.visited:[];
 const visited=[...new Set([...stored.filter(x=>Number.isInteger(x)&&x>=0&&x<total),index])];
 return {...previous,reading:{chapter:index,visited,completed:!!previous.reading?.completed||(completed&&visited.length===total)}};
}

export function createLearningPlayer(root,{artifact,icon,esc,passport,save,onClose}){
 const story=learningStories[artifact.id],total=story.chapters.length;
 let dead=false,index=0,wantsAudio=false,rate=1,playEpoch=0;
 const stored=passport[artifact.id]?.reading?.chapter;
 if(Number.isInteger(stored))index=Math.max(0,Math.min(total-1,stored));
 const audio=new Audio();audio.id='learning-narration';audio.preload='metadata';audio.hidden=true;
 const $=selector=>root.querySelector(selector);
 root.innerHTML=`<section class="reading-story" role="dialog" aria-modal="true" aria-label="${esc(artifact.name)} learning story"><figure class="reading-visual"><div class="reading-image-backdrop" aria-hidden="true"></div><div class="reading-images"></div><figcaption class="reading-caption"></figcaption><span class="reading-image-label">NASA MISSION ARCHIVE</span></figure><header class="reading-header"><div>${icon('book',20)}<span>${esc(artifact.name)}<small>${artifact.world} / Story Mode</small></span></div><button class="reading-close" data-reading-action="close" aria-label="Return to space">${icon('close',24)}</button></header><div class="reading-scroll"><nav class="reading-chapters" aria-label="Learning story chapters"></nav><span class="reading-eyebrow"></span><h1 class="reading-title" tabindex="-1"></h1><p class="reading-tagline">${esc(story.tagline)}</p><div class="reading-text"></div><div class="reading-sources"></div><p class="reading-authorship">Original ECHOES storytelling, grounded in mission records. Photographs and design images are dated records, not live views.</p></div><footer class="reading-controls"><div class="reading-audio"><button class="reading-play" data-reading-action="play" aria-label="Play narration">${icon('play',20)}<span>Listen</span></button><label class="sr-only" for="learning-audio-seek">Narration position</label><input id="learning-audio-seek" type="range" min="0" max="1000" step="5" value="0" disabled><span class="reading-time">0:00 / 0:00</span><label class="sr-only" for="learning-audio-rate">Narration speed</label><select id="learning-audio-rate" aria-label="Narration speed"><option value="0.85">0.85×</option><option value="1" selected>1×</option><option value="1.15">1.15×</option><option value="1.3">1.3×</option></select></div><div class="reading-navigation"><button data-reading-action="previous">${icon('back',18)} Previous</button><span class="reading-position"></span><button data-reading-action="next">Next chapter ${icon('right',18)}</button></div><span class="reading-status" role="status">Press Listen to hear the story. Narration continues between chapters.</span></footer></section>`;
 $('.reading-story').append(audio);
 function pauseNarration(message){++playEpoch;wantsAudio=false;audio.pause();updateAudio();$('.reading-status').textContent=message;}
 const gallery=createStoryGallery($('.reading-visual'),{artifact,icon,esc,onVideoPlay:()=>pauseNarration('Narration paused while the film plays. Press Listen when you are ready.'),onExternalSource:()=>pauseNarration('Narration paused while you explore the NASA archive.')});
 function clock(seconds){if(!Number.isFinite(seconds))return '0:00';const whole=Math.max(0,Math.floor(seconds));return `${Math.floor(whole/60)}:${String(whole%60).padStart(2,'0')}`;}
 function checkpoint(done=false){passport[artifact.id]=rememberReading(passport[artifact.id],index,total,done);save();}
 function updateAudio(){if(dead)return;const duration=Number.isFinite(audio.duration)?audio.duration:0;$('#learning-audio-seek').disabled=!duration;$('#learning-audio-seek').value=duration?Math.round(audio.currentTime/duration*1000):0;$('.reading-time').textContent=`${clock(audio.currentTime)} / ${clock(duration)}`;const playing=!audio.paused&&!audio.ended;$('.reading-play').setAttribute('aria-label',playing?'Pause narration':'Play narration');$('.reading-play').innerHTML=`${playing?'<span class="reading-pause-icon" aria-hidden="true">Ⅱ</span>':icon('play',20)}<span>${playing?'Pause':'Listen'}</span>`;}
 function play(){if(dead)return;gallery.pauseVideo();const token=++playEpoch;wantsAudio=true;if(audio.ended)audio.currentTime=0;$('.reading-status').textContent='Loading narration…';audio.play().catch(error=>{if(dead||token!==playEpoch||error.name==='AbortError')return;wantsAudio=false;$('.reading-status').textContent='Audio could not start. Press Listen to try again; the full story is always available to read.';updateAudio();});}
 function showChapter(next,{focus=true}={}){
  index=Math.max(0,Math.min(total-1,next));++playEpoch;audio.pause();audio.src=learningAudioPath(artifact.id,index);audio.playbackRate=rate;
  const chapter=story.chapters[index];
  $('.reading-chapters').innerHTML=story.chapters.map((c,i)=>`<button data-reading-chapter="${i}" aria-label="Chapter ${i+1}: ${esc(c.title)}" aria-current="${i===index?'step':'false'}"><span>${String(i+1).padStart(2,'0')}</span></button>`).join('');
  $('.reading-eyebrow').textContent=chapter.time;$('.reading-title').textContent=chapter.title;
  $('.reading-text').innerHTML=chapter.paragraphs.map(text=>`<p>${esc(text)}</p>`).join('');
  gallery.setChapter(chapter,index);
  $('.reading-sources').innerHTML=chapter.refs.map(ref=>`<button data-source="${ref}">${icon('book',15)} NASA record ${icon('arrow',14)}</button>`).join('');
  $('.reading-position').textContent=`Chapter ${index+1} of ${total}`;
  $('[data-reading-action="previous"]').disabled=index===0;
  $('[data-reading-action="next"]').innerHTML=`${index===total-1?'Back to space':'Next chapter'} ${icon('right',18)}`;
  $('.reading-scroll').scrollTop=0;$('.reading-story').scrollTop=0;checkpoint();updateAudio();
  $('.reading-status').textContent=wantsAudio?'Loading narration…':'Press Listen to hear the story. Narration continues between chapters.';
  if(focus)$('.reading-title').focus({preventScroll:true});
  if(wantsAudio)play();
 }
 function ended(){if(dead)return;if(wantsAudio&&index<total-1){showChapter(index+1);return;}wantsAudio=false;checkpoint(index===total-1);updateAudio();$('.reading-status').textContent=index===total-1?'Story complete. Revisit any chapter, or return to space.':'Chapter complete. Choose the next chapter when you are ready.';}
 const playing=()=>{if(!dead){$('.reading-status').textContent='Narration is playing. It continues to the next chapter automatically.';updateAudio();}};
 const error=()=>{if(!dead){wantsAudio=false;$('.reading-status').textContent='Narration is unavailable here. You can read every chapter and keep exploring.';updateAudio();}};
 audio.addEventListener('loadedmetadata',updateAudio);audio.addEventListener('timeupdate',updateAudio);audio.addEventListener('playing',playing);audio.addEventListener('pause',updateAudio);audio.addEventListener('ended',ended);audio.addEventListener('error',error);
 function click(event){const chapter=event.target.closest('[data-reading-chapter]');if(chapter){showChapter(Number(chapter.dataset.readingChapter));return;}if(event.target.closest('[data-source]')){gallery.pauseVideo();++playEpoch;wantsAudio=false;audio.pause();$('.reading-status').textContent='Narration paused while you explore the NASA evidence.';return;}const action=event.target.closest('[data-reading-action]')?.dataset.readingAction;if(action==='close')onClose();if(action==='play'){if(!audio.paused&&!audio.ended){++playEpoch;wantsAudio=false;audio.pause();$('.reading-status').textContent='Narration paused. Read at your own pace.';}else play();}if(action==='previous'&&index>0)showChapter(index-1);if(action==='next'){if(index===total-1){checkpoint(true);onClose();}else showChapter(index+1);}}
 function input(event){if(event.target.id==='learning-audio-seek'&&Number.isFinite(audio.duration))audio.currentTime=Number(event.target.value)/1000*audio.duration;if(event.target.id==='learning-audio-rate'){rate=Number(event.target.value);audio.playbackRate=rate;}}
 function key(event){if(document.fullscreenElement)return;if(event.defaultPrevented||document.querySelector('.echo-chat-panel')||document.querySelector('.modal'))return;if(event.key==='Escape'){event.preventDefault();onClose();return;}if(event.key==='Tab'){const items=[...root.querySelectorAll('button:not(:disabled),a,input:not(:disabled),select,video')].filter(el=>el.getClientRects().length);const first=items[0],last=items.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}}}
 function pauseForChat(){gallery.pauseVideo();++playEpoch;wantsAudio=false;audio.pause();updateAudio();$('.reading-status').textContent='Narration paused while you chat with Echo.';}
 document.addEventListener('echo-chat-open',pauseForChat);
 root.addEventListener('click',click);root.addEventListener('input',input);document.addEventListener('keydown',key);
 showChapter(index,{focus:false});$('.reading-close').focus({preventScroll:true});
 return {dispose(){if(dead)return;dead=true;gallery.dispose();++playEpoch;audio.pause();audio.removeAttribute('src');audio.load();root.removeEventListener('click',click);root.removeEventListener('input',input);document.removeEventListener('keydown',key);document.removeEventListener('echo-chat-open',pauseForChat);root.replaceChildren();}};
}
