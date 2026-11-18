export const voicePreviews=[
 {id:'hazel',name:'Hazel',accent:'English · UK',file:'voice-previews/hazel.wav'},
 {id:'david',name:'David',accent:'English · US',file:'voice-previews/david.wav'},
 {id:'zira',name:'Zira',accent:'English · US',file:'narration/opportunity-intro.wav',current:true}
];

export function createVoicePreview(parent,{icon,esc,storyAudio,onClose=()=>{}}){
 let disposed=false,current=null;
 const wasPlaying=!storyAudio.paused;storyAudio.pause();
 const backdrop=document.createElement('div');backdrop.className='voice-backdrop';
 backdrop.innerHTML=`<section class="voice-picker" role="dialog" aria-modal="true" aria-labelledby="voice-picker-title"><button class="voice-picker-close" data-voice-action="close" aria-label="Close voice previews">${icon('close',22)}</button><span class="voice-eyebrow">ECHOES / VOICE BOOTH</span><h2 id="voice-picker-title">Find your storyteller.</h2><p>Compare the same passage in three free computer voices.</p><blockquote>“I was built for ninety Martian days. I explored for nearly fifteen Earth years. Come with me. There is a story hidden in these rocks.”</blockquote><div class="voice-preview-list">${voicePreviews.map(v=>`<button data-voice-preview="${v.id}" aria-label="Play ${v.name} voice preview" aria-pressed="false"><span class="voice-preview-play">${icon('right',20)}</span><span><b>${v.name}</b><small>${v.accent}${v.current?' · Current story voice':''}</small></span><span class="voice-preview-label">Preview</span></button>`).join('')}</div><p class="voice-preview-status" role="status">Choose a voice to hear its preview.</p><p class="voice-preview-note">These short samples help you compare voices. The stories currently use Zira. All previews are included audio files and cost nothing to play.</p><button class="voice-stop" data-voice-action="stop">Stop preview</button></section>`;
 const background=[...parent.children];background.forEach(el=>el.inert=true);parent.append(backdrop);
 const sample=new Audio();sample.id='voice-preview-audio';sample.preload='none';sample.hidden=true;backdrop.append(sample);
 const status=()=>backdrop.querySelector('.voice-preview-status');
 function update(){backdrop.querySelectorAll('[data-voice-preview]').forEach(b=>{const playing=b.dataset.voicePreview===current;b.setAttribute('aria-pressed',String(playing));b.querySelector('.voice-preview-label').textContent=playing?'Playing':'Preview';});}
 function stop(){sample.pause();current=null;update();status().textContent='Preview stopped. Choose another voice to compare.';}
 function play(id){const voice=voicePreviews.find(v=>v.id===id);if(!voice)return;sample.pause();current=id;sample.src=`assets/${voice.file}`;update();status().textContent=`Loading ${voice.name}…`;sample.play().then(()=>{if(!disposed&&current===id)status().textContent=`Playing ${voice.name} · ${voice.accent}.`;}).catch(error=>{if(disposed||current!==id||error.name==='AbortError')return;current=null;update();status().textContent='The preview could not play. Please try again.';});}
 sample.addEventListener('ended',()=>{const name=voicePreviews.find(v=>v.id===current)?.name||'Voice';current=null;update();status().textContent=`${name} preview finished. Try another voice.`;});
 function dispose(resume=true){if(disposed)return;disposed=true;sample.pause();sample.removeAttribute('src');sample.load();background.forEach(el=>el.inert=false);backdrop.remove();if(resume&&wasPlaying)storyAudio.play().catch(()=>{});onClose();}
 backdrop.addEventListener('click',e=>{const voice=e.target.closest('[data-voice-preview]');if(voice){play(voice.dataset.voicePreview);return;}const action=e.target.closest('[data-voice-action]')?.dataset.voiceAction;if(action==='stop')stop();if(action==='close')dispose();});
 backdrop.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();dispose();return;}if(e.key==='Tab'){e.stopPropagation();const buttons=[...backdrop.querySelectorAll('button')],first=buttons[0],last=buttons.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
 backdrop.querySelector('[data-voice-preview]').focus({preventScroll:true});
 return {dispose};
}
