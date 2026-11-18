import {introMedia} from './story-media-data.js';
export const experienceModes=[{id:'learning',name:'Story Mode'},{id:'interactive',name:'Discovery Mode'}];
export const isExperienceMode=value=>experienceModes.some(mode=>mode.id===value);
const escape=value=>String(value||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const shouldPlayGateVideo=({reducedMotion=false,saveData=false}={})=>!reducedMotion&&!saveData;
export function modeMenuHTML(icon){return `<section class="expedition-gate has-gate-media" role="dialog" aria-modal="true" aria-labelledby="expedition-gate-title"><div class="gate-media" aria-hidden="true"><img src="${escape(introMedia.poster)}" alt="" fetchpriority="high"><video class="gate-background-video" poster="${escape(introMedia.poster)}" muted loop playsinline preload="none" tabindex="-1"></video></div><div class="gate-heading"><span class="gate-brand">${icon('spark',22)} ECHOES</span><h1 id="expedition-gate-title">How will you explore?</h1><p>Two ways into the forgotten worlds.</p></div><div class="gate-choices">${experienceModes.map(mode=>`<button class="gate-choice gate-${mode.id}" data-experience-mode="${mode.id}" aria-label="${mode.name}">${mode.name}</button>`).join('')}</div><p class="gate-footnote">Same worlds. Twenty artifacts. Choose your journey.</p><div class="gate-media-tools"><button class="gate-motion-toggle" aria-label="Play background video" aria-pressed="false" ${introMedia.video?'':'hidden'}>${icon('play',13)}</button>${introMedia.source?`<a class="gate-media-credit" href="${escape(introMedia.source.url)}" target="_blank" rel="noopener noreferrer">${escape(introMedia.label||introMedia.caption)}</a>`:''}</div></section>`;}
export function installGateMedia(root){
 const gate=root.querySelector('.expedition-gate'),video=gate?.querySelector('video'),button=gate?.querySelector('.gate-motion-toggle');
 if(!gate||!video||!introMedia.video)return ()=>{};
 const motion=matchMedia('(prefers-reduced-motion:reduce)'),connection=navigator.connection;
 let dead=false,desired=shouldPlayGateVideo({reducedMotion:motion.matches,saveData:!!connection?.saveData});video.muted=true;
 function render(){if(dead)return;button.setAttribute('aria-label',desired?'Pause background video':'Play background video');button.setAttribute('aria-pressed',String(desired));button.innerHTML=desired?'Ⅱ':'▶';gate.classList.toggle('gate-motion-paused',!desired);}
 function sync(){if(dead)return;render();if(!desired||document.hidden||document.querySelector('.echo-chat-panel')){video.pause();return;}if(!video.getAttribute('src'))video.src=introMedia.video;video.play().catch(error=>{if(!dead&&error.name!=='AbortError'){desired=false;render();}});}
 function chatOpen(){video.pause();}
 function toggle(){desired=!desired;sync();}
 function policy(){desired=shouldPlayGateVideo({reducedMotion:motion.matches,saveData:!!connection?.saveData});sync();}
 function playing(){if(!dead)video.classList.add('is-playing');}
 function error(){if(dead)return;desired=false;button.hidden=true;video.hidden=true;render();}
 button.addEventListener('click',toggle);video.addEventListener('playing',playing);video.addEventListener('error',error);motion.addEventListener('change',policy);connection?.addEventListener?.('change',policy);document.addEventListener('visibilitychange',sync);document.addEventListener('echo-chat-open',chatOpen);document.addEventListener('echo-chat-close',sync);sync();
 return ()=>{if(dead)return;dead=true;button.removeEventListener('click',toggle);video.removeEventListener('playing',playing);video.removeEventListener('error',error);motion.removeEventListener('change',policy);connection?.removeEventListener?.('change',policy);document.removeEventListener('visibilitychange',sync);document.removeEventListener('echo-chat-open',chatOpen);document.removeEventListener('echo-chat-close',sync);video.pause();video.removeAttribute('src');video.load();};
}
