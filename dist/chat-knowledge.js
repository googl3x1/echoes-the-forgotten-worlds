import {artifacts,sources} from './data.js';
import {learningStories} from './learning-stories.js';

const aliases={opportunity:['Opportunity','MER-B','MER B'],spirit:['Spirit','MER-A','MER A'],eagle:['Eagle','Apollo 11 Lunar Module','Apollo 11 descent stage'],insight:['InSight','In Sight'],lrv:['Lunar Rover','Lunar Roving Vehicle','LRV','Apollo 17 rover'],reflector:['Lunar Reflector','Apollo 11 reflector','laser reflector','retroreflector'],surveyor3:['Surveyor 3','Surveyor III'],alsep12:['Apollo 12 ALSEP','Apollo 12 experiment station','ALSEP'],viking1:['Viking 1','Viking1'],phoenix:['Phoenix','Phoenix lander']};
const missions={eagle:'Apollo 11',reflector:'Apollo 11',lrv:'Apollo 17',alsep12:'Apollo 12'};
const ignored=new Set('a an the is are was were be been to of in on at my your you i it its they their them did do does me tell about what how why which can could would please and have has had for with this that there any nasa data artifact artifacts abandoned equipment spacecraft machine robot lunar moon mars martian apollo know more something give explain'.split(' '));
export function normalizeQuestion(value){return String(value).toLowerCase().replace(/[’']s\b/g,'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/lunar rover|moon buggy/g,'lunar roving vehicle').replace(/retro[ -]reflector/g,'retroreflector').replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ');}
const stem=t=>t.endsWith('ies')?t.slice(0,-3)+'y':t.length>4&&t.endsWith('s')?t.slice(0,-1):t;
function words(value){return normalizeQuestion(value).split(' ').filter(t=>t.length>1&&!ignored.has(t)).map(stem);}
function uniqueSources(list){return [...new Map(list.filter(Boolean).map(s=>[s.url,s])).values()];}
const primary=ids=>uniqueSources(ids.map(id=>sources[id]));
export function buildChatIndex(archive){
 const exhibits=artifacts.map(a=>{const chapters=learningStories[a.id].chapters;const section=i=>({text:chapters[i].paragraphs.join('\n\n'),sources:primary(chapters[i].refs)});const power=a.hotspots.filter(h=>/solar|electri|batter|rtg|power|sunlight/i.test(h.text));return {id:a.id,name:a.name,aliases:aliases[a.id]||a.aliases||[a.name],world:a.world,mission:a.mission||missions[a.id]||a.name,kind:'exhibit',summary:a.intro,sources:primary(a.refs),details:{arrival:section(0),purpose:section(0),operation:section(1),discovery:section(2),ending:section(3),remains:section(a.id==='eagle'?1:3),location:{text:`${a.place}, ${a.world}. ${a.coordinate}. ${a.locationNote} These records do not provide a live condition report.`,sources:primary(a.refs)},power:a.id==='reflector'?section(1):power.length?{text:power.map(h=>h.text).join(' '),sources:primary(power.map(h=>h.ref))}:null,distance:a.stats.find(([_,label])=>/distance|traverse/i.test(label))?{text:a.stats.filter(([_,label])=>/distance|traverse/i.test(label)).map(([value,label])=>`${label}: ${value}.`).join(' '),sources:primary(a.refs)}:null}};});
 const records=[...exhibits,...archive.records].map(record=>({...record,aliases:[...new Set([record.name,...(record.aliases||[])])],normalizedAliases:[...new Set([record.name,...(record.aliases||[])].map(normalizeQuestion))],nameWords:new Set(words(record.name))}));
 return {records,coverage:archive.coverage};
}
export function questionIntent(q){
 const value=normalizeQuestion(q);
 if(/\b(color|colour|price|cost|weight|weigh|invented|launch|launched|favorite|favourite|food|temperature)\b/.test(value))return 'unknown';
 if(/\b(life|alien|organisms|microbes|bacteria)\b/.test(value)&&!/\b(battery|mission|service) life\b/.test(value))return 'life';
 if(/how far|distance|kilomet|miles|traverse/.test(value))return 'distance';
 if(/power|batter|solar|electri|energy|\brtg\b/.test(value))return 'power';
 if(/\b(where|location|coordinates|latitude|longitude)\b/.test(value))return 'location';
 if(/\b(stop|stopped|end|ended|last|lost|retired|retire|die|dead|broke|broken|silent)\b|how long|why.*abandon/.test(value))return 'ending';
 if(/remain|left behind|still there|abandon|today|current|right now|still.*work/.test(value))return 'remains';
 if(/learn|discover|found|\bfind\b|evidence|water|\bice\b|blueberr|silica/.test(value))return 'discovery';
 if(/how.*work|how.*operat|instrument|\btool\b|design|\bcamera\b|\bscoop\b|\bwheel\b/.test(value))return 'operation';
 if(/purpose|\bmission\b|why.*sent|\bjob\b|objective|what.*do/.test(value))return 'purpose';
 if(/\bwhen\b.*\b(land|landed|arrive|arrived)\b/.test(value))return 'arrival';
 if(/^what (is|was|are|were)|tell.*about|^about|^explain|^who (is|was)/.test(value))return 'overview';
 return 'unknown';
}
export function artifactSearchQuery(record){
 if(!record)return null;
 const mission=record.mission!==record.name?record.mission:'';
 return [record.name,mission,record.world].filter(Boolean).join(' ').slice(0,150);
}
const searchFields=record=>record?{searchQuery:artifactSearchQuery(record),searchRecord:record.id}:{searchQuery:null};
function scopeReply(context=null){return {kind:'scope',supported:false,context,text:'I only discuss documented space hardware left behind, retired or lost on the Moon and Mars. I can explain its mission, equipment, discoveries and ending. Try “Tell me about a recent abandoned artifact” or “Why did Opportunity stop?”',sources:[],searchQuery:null};}
function missing(question,record=null){return {kind:'missing',supported:false,context:record?.id||null,text:record?`The included NASA records identify ${record.name}, but do not answer that specific question. You can search NASA for more records about this artifact.`:'I don’t have a verified abandoned-artifact record for that name. I stay with documented left-behind, retired or lost Moon and Mars hardware. Try a recent example, Opportunity, Sojourner, or an Apollo object.',sources:record?.sources||[],...searchFields(record)};}
function examples(records,world=null,recent=false){
 const helicopter=records.find(r=>r.id==='mars-ingenuity');
 if(recent&&world!=='Moon'&&helicopter)return {kind:'answer',supported:true,context:helicopter.id,text:'One relatively recent retired artifact in this guide is Ingenuity, NASA’s Mars helicopter in Jezero crater.\n\nIts flight mission ended on January 25, 2024, after 72 flights and rotor damage. It remains on Mars and can no longer fly. Flight retirement does not by itself mean every electronic system immediately stopped.\n\nThis is a documented 2024 example, not a claim that it is the newest abandoned object anywhere.',sources:helicopter.sources,...searchFields(helicopter)};
 const picks=['opportunity','eagle','insight','mars-ingenuity','mars-sojourner','lrv'].map(id=>records.find(r=>r.id===id)).filter(r=>r&&(!world||r.world===world));
 return {kind:'choices',supported:true,context:null,text:recent?'I cannot verify the newest lunar equipment from this historical archive. Here are documented objects left on the Moon. Choose one to learn its story.':'Here are documented examples of left-behind or retired space hardware. Choose one to learn its story. Passive experiments left on the Moon may still work; “left behind” does not always mean broken.',choices:picks.map(r=>({id:r.id,label:`${r.name} · ${r.world}`})),sources:[]};
}
function answerRecord(record,question,intent){
 if(record.kind==='inventory'){
  const base=`NASA’s 2012 catalogue lists “${record.inventoryText}” under ${record.mission}.`;
  if(['overview','location','remains'].includes(intent)||normalizeQuestion(question)===normalizeQuestion(record.name))return {kind:'answer',supported:true,context:record.id,text:base+'\n\nThis is a historical inventory entry, not a current survey. An entry or printed coordinate does not establish the object’s present condition or a verified current position.',sources:record.sources,...searchFields(record)};
  return {...missing(question,record),text:base+'\n\nThe inventory identifies the hardware, but does not explain that part of its story. A separate mission record is needed to answer it.',sources:record.sources};
 }
 if(intent==='life')return {kind:'answer',supported:true,context:record.id,text:record.world==='Mars'?`The NASA records included for ${record.name} do not report a confirmed discovery of living organisms. Evidence involving water, ice, minerals or chemical reactions is different from proof of life.`:'This entry describes lunar equipment. Its included records do not establish a biological discovery.',sources:record.sources};
 let field=record.details?.[intent];
 if(!field&&intent==='power'&&/solar|batter|rtg|electric/i.test(record.details?.operation||''))field=record.details.operation;
 if(!field&&intent==='remains')field=record.details?.ending;
 if(!field&&intent==='overview')field=record.kind==='exhibit'?record.details.purpose:record.summary;
 if(!field&&normalizeQuestion(question)===normalizeQuestion(record.name))field=record.summary;
 if(!field)return missing(question,record);
 const text=typeof field==='string'?field:field.text;
 return {kind:'answer',supported:true,context:record.id,text,sources:typeof field==='string'?record.sources:field.sources,...searchFields(record)};
}
export function answerArtifactQuestion({question,index,context=null,recordId=null}){
 const q=normalizeQuestion(question),records=index.records;
 if(!q||q.length>600)return missing('');
 if(/ignore.*(source|instruction)|\binvent\b|system prompt|pretend.*(fact|real)/i.test(q))return {kind:'scope',supported:false,context,text:'I use the included NASA records and will not invent mission facts. Ask about an artifact, its purpose, equipment, discoveries, location or ending.',sources:[]};
 if(/^(hi|hello|hey|thanks|thank you|thankyou)( echo)?$/.test(q))return {kind:'greeting',supported:true,context,text:'Hello! I’m Echo, your abandoned-artifact guide. I only discuss documented space hardware left behind, retired or lost on the Moon and Mars. Ask for a recent example or name an artifact, and I’ll link its NASA records.',sources:[]};
 if(/\b(recipe|recipes|cook|cooking|football|cricket|soccer|president|politics|election|horoscope|celebrity|bitcoin|stock price|shopping|joke|jokes)\b|write.*(code|program|essay|poem)|solve.*(math|equation)|weather (today|tomorrow|forecast)|what (is|s|will be).*weather|capital of|\d+\s*[+*\/=-]\s*\d+/.test(q))return scopeReply(context);
 const intent=questionIntent(question),current=records.find(r=>r.id===context);
 if(recordId){const selected=records.find(r=>r.id===recordId);return selected?answerRecord(selected,selected.name,'overview'):missing(question);}
 if(/how many.*(artifacts|entries|records)|what can you|your sources|your data|what.*\bcover\b|are you.*ai/.test(q))return {kind:'scope',supported:true,context,text:`The globe has ${artifacts.length} explorable artifacts. I can also search ${index.coverage.inventory_entries} inventory entries from NASA’s 22-page 2012 lunar catalogue and ${index.coverage.additional_mars_records} archived retired or lost Mars mission records. Entries may describe assemblies, parts or uncertain locations; they are not a count of physical objects. I only cover documented left-behind, retired or lost hardware. NASA library searches are limited to a selected artifact. This is source lookup, not generative AI or a live NASA survey.`,sources:[{title:'NASA lunar material catalogue (2012)',org:'NASA History Program Office',url:'https://www.nasa.gov/wp-content/uploads/2024/02/final-catalogue-of-manmade-material-on-the-moon.pdf'}]};
 const mission=q.match(/\bapollo (11|12|13|14|15|16|17)\b/)?.[0];
 const world=/\b(mars|martian)\b/.test(q)?'Mars':/\b(moon|lunar)\b/.test(q)?'Moon':null;
 const eligible=records.filter(r=>(!mission||normalizeQuestion(r.mission)===mission)&&(!world||r.world===world));
 if(mission&&/what.*(left|leave)|list|inventory|artifacts|objects/.test(q)&&words(q).filter(w=>!/^\d+$/.test(w)&&!['left','leave','list','inventory','object'].includes(w)).length===0){
  const entries=eligible.filter(r=>r.kind==='inventory');const key=/roving|seismic|reflector|hammer|feather|sculpture|descent|central station|flag/i;const picks=[...new Map([...entries.filter(r=>key.test(r.name)),...entries].map(r=>[normalizeQuestion(r.name),r])).values()].slice(0,8);
  if(picks.length)return {kind:'choices',supported:true,context:null,text:`NASA’s 2012 catalogue has ${entries.length} inventory rows under ${mission.replace('apollo','Apollo')}. Here are some entries. These may be parts or assemblies, and the catalogue is not a live condition report.`,choices:picks.map(r=>({id:r.id,label:r.name})),sources:uniqueSources(picks.map(r=>r.sources[0]))};
 }
 let explicit=eligible.filter(r=>r.normalizedAliases.some(a=>a.length>2&&(' '+q+' ').includes(' '+a+' ')));
 if(q.includes('eagle crater')&&!q.includes('apollo 11'))explicit=explicit.filter(r=>r.id!=='eagle');
 const exhibitMatches=explicit.filter(r=>r.kind==='exhibit');if(exhibitMatches.length)explicit=explicit.filter(r=>r.kind==='exhibit'||!exhibitMatches.some(e=>e.normalizedAliases.some(a=>r.normalizedAliases.includes(a))));
 explicit=explicit.filter(r=>!explicit.some(other=>other!==r&&other.mission===r.mission&&other.normalizedAliases.some(a=>r.normalizedAliases.some(b=>a.length>b.length&&(' '+a+' ').includes(' '+b+' '))&&(' '+q+' ').includes(' '+a+' '))));
 explicit=[...new Map(explicit.map(r=>[r.kind==='exhibit'?r.id:normalizeQuestion(r.name)+'|'+r.mission,r])).values()];
 if(!explicit.length&&/\b(curiosity|perseverance|james webb|hubble|iss|space station)\b/.test(q))return {...scopeReply(context),text:'That spacecraft is not classified as retired or left-behind hardware in this guide. I won’t label it abandoned or search for unrelated mission information. Ask about a documented artifact such as Ingenuity, InSight or Eagle’s descent stage.'};
 if(!explicit.length&&!mission){
  const artifactWords=/\b(artifact|artifacts|equipment|hardware|rover|rovers|lander|landers|spacecraft|abandoned|retired|left behind)\b/.test(q);
  if(artifactWords&&/\b(recent|recently|latest|newest)\b/.test(q))return examples(records,world,true);
  if(artifactWords&&(/\b(any|some|example|examples|list|suggest|recommend|show)\b/.test(q)||/^(tell me about|what are|what is|name).*\b(artifact|artifacts|equipment|hardware)\b/.test(q)))return examples(records,world);
 }
 if(explicit.length===1)return answerRecord(explicit[0],question,intent);
 if(explicit.length>1&&/compare|difference|\band\b|versus|\bvs\b/.test(q)&&explicit.every(r=>r.kind!=='inventory'))return {kind:'answer',supported:true,context:null,text:explicit.slice(0,3).map(r=>`${r.name}: ${r.summary}`).join('\n\n'),sources:uniqueSources(explicit.slice(0,3).flatMap(r=>r.sources))};
 const queryWords=words(question).filter(w=>!/^\d+$/.test(w)&&!['when','where','stop','stopped','end','ended','left','leave','list','inventory','still'].includes(w));
 if(!explicit.length&&current&&!mission&&!world&&(intent!=='unknown')&&(queryWords.length===0||/\b(it|its|they|their|that|this)\b/.test(q)))return answerRecord(current,question,intent);
 const ranked=explicit.length?explicit.map(r=>({r,score:99})):eligible.map(r=>({r,score:queryWords.reduce((score,w)=>score+(r.nameWords.has(w)?3:0),0)})).filter(x=>x.score>=3).sort((a,b)=>b.score-a.score);
 if(ranked.length){const best=ranked[0].score,choices=[...new Map(ranked.filter(x=>x.score===best).map(x=>[normalizeQuestion(x.r.name)+'|'+x.r.mission,x.r])).values()];if(choices.length===1&&best>=3)return answerRecord(choices[0],question,intent);return {kind:'choices',supported:false,context:null,text:'Several NASA records match. Which artifact or mission do you mean?',choices:choices.slice(0,6).map(r=>({id:r.id,label:`${r.name} · ${r.mission}`})),sources:[]};}
 if(current&&intent!=='unknown'&&queryWords.length===0)return answerRecord(current,question,intent);
 return missing(question);
}

export function cleanLibraryText(value){return String(value||'').replace(/<[^>]*>/g,' ').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\s+/g,' ').trim();}
export function nasaLibraryResults(payload){return (payload?.collection?.items||[]).flatMap(item=>{const data=item.data?.[0];if(!data?.nasa_id)return [];const description=cleanLibraryText(data.description||data.description_508);return [{title:cleanLibraryText(data.title||data.nasa_id).slice(0,140),text:description.split(/\s+/).slice(0,24).join(' ')+(description.split(/\s+/).length>24?'…':''),url:`https://images.nasa.gov/details/${encodeURIComponent(data.nasa_id)}`}];}).slice(0,3);}
function matchesArtifact(data,record){
 const text=normalizeQuestion(`${data.title||''} ${cleanLibraryText(data.description||data.description_508)}`);
 const named=record.normalizedAliases.some(alias=>alias.length>2&&(' '+text+' ').includes(' '+alias+' '));
 if(!named)return false;
 if(record.kind==='inventory'||/^Apollo /.test(record.mission))return (' '+text+' ').includes(' '+normalizeQuestion(record.mission)+' ');
 if(record.world==='Mars')return /\b(mars|martian|mer a|mer b)\b/.test(text);
 return /\b(moon|lunar)\b/.test(text);
}
export async function searchNasaLibrary(recordId,{index,signal,fetcher=fetch}={}){
 const record=index?.records.find(r=>r.id===recordId);
 if(!record)throw new Error('Select a documented abandoned artifact before searching NASA.');
 const url=new URL('https://images-api.nasa.gov/search');url.searchParams.set('q',artifactSearchQuery(record));url.searchParams.set('media_type','image');url.searchParams.set('page_size','12');
 const response=await fetcher(url,{signal});if(!response.ok)throw new Error('NASA library unavailable');
 const payload=await response.json();const items=payload?.collection?.items||[];
 return nasaLibraryResults({collection:{items:items.filter(item=>item.data?.[0]&&matchesArtifact(item.data[0],record))}});
}
