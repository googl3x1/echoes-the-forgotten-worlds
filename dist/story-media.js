import {storyMedia} from './story-media-data.js';

export function chapterMedia(artifact,chapter,manifest=storyMedia){
 const comparison=chapter.compareImages?.length>1;
 const base=comparison?{type:'comparison',items:chapter.compareImages.map(item=>({...item,src:`assets/${item.image}`})),caption:chapter.caption,title:'Compare the mission photographs'}:{type:'image',src:`assets/${chapter.image}`,alt:chapter.caption,caption:chapter.caption,title:'Chapter photograph'};
 const extras=(manifest[artifact.id]||[]).filter(item=>['image','video'].includes(item.type)&&/^assets\/story-media\/[\w.-]+$/.test(item.src));
 const used=new Set(comparison?base.items.map(item=>item.src):[base.src]);
 return [base,...extras.filter(item=>{if(used.has(item.src))return false;used.add(item.src);return true;})];
}
export function archiveSource(url){try{const parsed=new URL(url);return parsed.protocol==='https:'&&(parsed.hostname==='nasa.gov'||parsed.hostname.endsWith('.nasa.gov')||['lroc.asu.edu','www.lroc.asu.edu','lroc.sese.asu.edu','www.uahirise.org'].includes(parsed.hostname));}catch{return false;}}

export function createStoryGallery(root,{artifact,icon,esc,onVideoPlay=()=>{},onExternalSource=()=>{}}){
 let items=[],selected=0,dead=false,video=null;
 root.classList.add('archive-gallery');
 root.innerHTML=`<div class="reading-image-backdrop" aria-hidden="true"></div><span class="reading-image-label">NASA ARCHIVE / PHOTOGRAPHS & FILMS</span><div class="reading-images"></div><nav class="archive-navigation" aria-label="Mission media gallery"><button class="archive-arrow" data-archive-action="previous" aria-label="Previous mission image or video">${icon('back',18)}</button><div class="archive-thumbnails"></div><button class="archive-arrow" data-archive-action="next" aria-label="Next mission image or video">${icon('right',18)}</button></nav><figcaption class="reading-caption"></figcaption><span class="archive-status sr-only" role="status"></span>`;
 const $=s=>root.querySelector(s);
 function pauseVideo(){video?.pause();}
 function releaseVideo(){if(video){video.pause();video.removeAttribute('src');video.load();video=null;}}
 function show(index,{play=false,focus=false}={}){
  if(dead||!items.length)return;releaseVideo();selected=(index+items.length)%items.length;const item=items[selected];
  $('.reading-images').classList.toggle('reading-image-pair',item.type==='comparison');
  $('.reading-images').classList.toggle('reading-film',item.type==='video');
  if(item.type==='comparison')$('.reading-images').innerHTML=item.items.map((entry,i)=>`<div><img src="${esc(entry.src)}" alt="${esc(entry.caption)}"><span>${esc(entry.label||`Image ${i+1}`)}</span></div>`).join('');
  else if(item.type==='video')$('.reading-images').innerHTML=`<div><video src="${esc(item.src)}" controls playsinline preload="metadata" poster="${esc(item.poster||'')}" aria-label="${esc(item.alt||item.caption)}" tabindex="0">${item.captions?`<track kind="captions" src="${esc(item.captions)}" srclang="en" label="English descriptions" default>`:''}Your browser cannot play this film. Its NASA source is linked below.</video><p class="archive-video-hint">Play the film · Story narration pauses while you watch.</p></div>`;
  else $('.reading-images').innerHTML=`<div><img src="${esc(item.src)}" alt="${esc(item.alt||item.caption)}"></div>`;
  const background=item.type==='video'?item.poster:item.type==='comparison'?item.items[0].src:item.src;
  $('.reading-image-backdrop').style.backgroundImage=background?`url("${background}")`:'';
  $('.reading-caption').innerHTML=`<span class="archive-media-index">${item.type==='video'?'FILM':item.type==='comparison'?'COMPARE':'PHOTO'} ${selected+1} / ${items.length}</span><span>${esc(item.caption)}</span>${item.source&&archiveSource(item.source.url)?`<a data-archive-source href="${esc(item.source.url)}" target="_blank" rel="noopener noreferrer">${esc(item.source.org||'NASA')} archive ${icon('arrow',12)}</a>`:''}`;
  $('.archive-thumbnails').innerHTML=items.map((entry,i)=>{const src=entry.type==='video'?entry.poster:entry.type==='comparison'?entry.items[0].src:entry.src;return `<button data-archive-index="${i}" aria-label="${entry.type==='video'?'Watch':'View'} ${esc(entry.title||entry.alt||'mission media')}" aria-current="${i===selected?'true':'false'}"><img src="${esc(src||'')}" alt="" loading="lazy">${entry.type==='video'?`<span class="archive-play-badge">${icon('play',12)}</span>`:entry.type==='comparison'?'<span class="archive-pair-badge">2</span>':''}</button>`;}).join('');
  $('.archive-status').textContent=`${item.type==='video'?'Film':'Image'} ${selected+1} of ${items.length}. ${item.caption}`;
  if(item.type==='video'){video=$('video');video.addEventListener('play',()=>{if(!dead)onVideoPlay();});video.addEventListener('error',()=>{if(!dead)$('.archive-status').textContent='This film could not load. You can browse the photographs or open its NASA source.';});if(play)video.play().catch(()=>{if(!dead)$('.archive-status').textContent='Press the video’s Play button to watch the film.';});}
  if(focus)$(`[data-archive-index="${selected}"]`)?.focus({preventScroll:true});
 }
 function click(event){const thumb=event.target.closest('[data-archive-index]');if(thumb){const next=Number(thumb.dataset.archiveIndex);show(next,{play:items[next]?.type==='video',focus:true});return;}const action=event.target.closest('[data-archive-action]')?.dataset.archiveAction;if(action)show(selected+(action==='next'?1:-1));if(event.target.closest('[data-archive-source]')){pauseVideo();onExternalSource();}}
 root.addEventListener('click',click);
 return {setChapter(chapter,index=0){items=chapterMedia(artifact,chapter);let initial=0;if(!chapter.compareImages&&chapter.image===artifact.image&&(index===1||index===2)){const photos=items.map((item,i)=>({item,i})).filter(({item,i})=>i>0&&item.type==='image');initial=photos[(index-1)%Math.max(1,photos.length)]?.i||0;}show(initial);},pauseVideo,dispose(){if(dead)return;dead=true;releaseVideo();root.removeEventListener('click',click);root.replaceChildren();}};
}
