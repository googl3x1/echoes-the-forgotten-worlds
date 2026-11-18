import * as THREE from 'three';
import {OrbitControls} from './vendor/OrbitControls.js';
import {GLTFLoader} from './vendor/GLTFLoader.js';
import {RoomEnvironment} from './vendor/RoomEnvironment.js';
import {artifacts} from './data.js';

// The world is geographically oriented. Enlarged artifact models are discovery markers.
export async function createWorld(container,{world,onSelect}){
 let dead=false,frame,targetRotation=null,selected=null,autoRotate=true;
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.6));renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;
 renderer.domElement.setAttribute('role','img');renderer.domElement.setAttribute('aria-label',`Interactive ${world} with selectable spacecraft markers`);container.append(renderer.domElement);
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(38,1,.01,100);
 camera.position.set(.3,.5,6.4);
 const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.06;controls.enablePan=false;controls.minDistance=2.5;controls.maxDistance=9;controls.autoRotate=false;
 const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
 const planet=new THREE.Group();planet.rotation.y=-1.6;scene.add(planet);
 const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment(),environment=pmrem.fromScene(room,.04).texture;scene.environment=environment;scene.environmentIntensity=.55;room.dispose();pmrem.dispose();
 const hemi=new THREE.HemisphereLight(0xe9eee3,0x18161a,1);scene.add(hemi);
 const sun=new THREE.DirectionalLight(world==='Mars'?0xffeddd:0xf0f1ff,2.3);sun.position.set(5,3,5);scene.add(sun);
 const rim=new THREE.DirectionalLight(0xb2d8d0,1);rim.position.set(-4,1,-4);scene.add(rim);
 let texture;try{texture=await new THREE.TextureLoader().loadAsync(`assets/${world.toLowerCase()}-texture.jpg`);}catch(e){renderer.dispose();renderer.domElement.remove();throw e;}
 texture.colorSpace=THREE.SRGBColorSpace;
 const sphere=new THREE.Mesh(new THREE.SphereGeometry(1.65,80,64),new THREE.MeshStandardMaterial({map:texture,roughness:1}));planet.add(sphere);
 // A thin visual rim emphasizes the sphere without inventing an atmosphere.
 const rimSphere=new THREE.Mesh(new THREE.SphereGeometry(1.66,64,48),new THREE.MeshBasicMaterial({color:world==='Mars'?0xa58364:0xa4c0b0,transparent:true,opacity:.025,side:THREE.BackSide}));rimSphere.scale.setScalar(1.005);planet.add(rimSphere);
 const stars=new Float32Array(600*3);let seed=42;const rand=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
 for(let i=0;i<600;i++){const radius=15+rand()*15,phi=rand()*Math.PI*2,theta=Math.acos(2*rand()-1);stars.set([radius*Math.sin(theta)*Math.cos(phi),radius*Math.cos(theta),radius*Math.sin(theta)*Math.sin(phi)],i*3);}
 const starGeometry=new THREE.BufferGeometry();starGeometry.setAttribute('position',new THREE.BufferAttribute(stars,3));const starPoints=new THREE.Points(starGeometry,new THREE.PointsMaterial({color:0xc6d5bf,size:.023,transparent:true,opacity:.5}));scene.add(starPoints);
 const markers=[];
 function material(color){return new THREE.MeshStandardMaterial({color,metalness:.25,roughness:.65});}
 function box(parent,x,y,z,sx,sy,sz,color){const mesh=new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),material(color));mesh.position.set(x,y,z);parent.add(mesh);return mesh;}
 function schematic(a){const m=new THREE.Group();if(a.id==='eagle'){box(m,0,.09,0,.19,.17,.19,0xbba46a);for(const x of[-1,1])for(const z of[-1,1]){const leg=box(m,x*.11,.045,z*.11,.018,.12,.018,0xd1c7aa);leg.rotation.z=-x*.5;leg.rotation.x=z*.5;box(m,x*.145,-.01,z*.145,.07,.012,.07,0xbebcb0);}}else if(a.id==='insight'){box(m,0,.07,0,.14,.09,.14,0xc5ad75);for(const x of[-1,1]){const panel=new THREE.Mesh(new THREE.CylinderGeometry(.1,.1,.01,28),material(0x40546b));panel.position.set(x*.14,.08,0);m.add(panel);}box(m,0,.13,0,.01,.09,.01,0xd7e1d0);}else{box(m,0,.075,0,.17,.055,.19,0xc3bba6);box(m,0,.115,0,.32,.009,.25,0x364c64);box(m,-.04,.19,-.035,.012,.14,.012,0xe0d8c7);box(m,-.04,.255,-.035,.07,.03,.025,0xdcd9ce);for(const x of[-1,1])for(const z of[-1,0,1]){const wheel=new THREE.Mesh(new THREE.CylinderGeometry(.04,.04,.025,16),material(0x535b50));wheel.rotation.z=Math.PI/2;wheel.position.set(x*.12,.015,z*.085);m.add(wheel);}}return m;}
 const current=artifacts.filter(a=>a.world===world);
 for(const a of current){const lat=THREE.MathUtils.degToRad(a.lat),lon=THREE.MathUtils.degToRad(a.lon),normal=new THREE.Vector3(Math.cos(lat)*Math.cos(lon),Math.sin(lat),-Math.cos(lat)*Math.sin(lon));const anchor=new THREE.Group();anchor.position.copy(normal.clone().multiplyScalar(1.67));anchor.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),normal);anchor.add(schematic(a));planet.add(anchor);
  const ring=new THREE.Mesh(new THREE.RingGeometry(.19,.198,48),new THREE.MeshBasicMaterial({color:0xd2edb7,side:THREE.DoubleSide,transparent:true,opacity:.65}));ring.rotation.x=-Math.PI/2;ring.position.y=.003;anchor.add(ring);
  const label=document.createElement('button');label.className='world-marker';label.setAttribute('aria-label',`Read ${a.name}’s story`);label.innerHTML=`<span class="marker-cross">+</span><span>${a.name}<small>${a.id==='eagle'?'DESCENT STAGE':a.tag}</small></span><span class="marker-arrow">↗</span>`;label.addEventListener('click',()=>onSelect(a.id));container.append(label);
  markers.push({a,anchor,normal,label,ring,loaded:false});
 }
 let drag=false,start,interacting=false;
 const down=e=>{drag=false;start={x:e.clientX,y:e.clientY};};const move=e=>{if(start&&Math.hypot(e.clientX-start.x,e.clientY-start.y)>5)drag=true;};
 const ray=new THREE.Raycaster(),pointer=new THREE.Vector2();const click=e=>{if(drag)return;const r=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(pointer,camera);for(const m of markers)if(ray.intersectObject(m.anchor,true).length){onSelect(m.a.id);break;}};
 renderer.domElement.addEventListener('pointerdown',down);renderer.domElement.addEventListener('pointermove',move);renderer.domElement.addEventListener('click',click);controls.addEventListener('start',()=>{autoRotate=false;targetRotation=null;interacting=true;});controls.addEventListener('end',()=>{desiredDistance=camera.position.length();interacting=false;});
 const observer=new ResizeObserver(()=>{const w=container.clientWidth,h=container.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/Math.max(h,1);camera.updateProjectionMatrix();});observer.observe(container);
 let desiredDistance=6.4;const worldPosition=new THREE.Vector3();
 function animate(){if(dead)return;frame=requestAnimationFrame(animate);if(targetRotation!==null){let delta=targetRotation-planet.rotation.y;delta=Math.atan2(Math.sin(delta),Math.cos(delta));planet.rotation.y+=delta*(reduced?1:.045);if(Math.abs(delta)<.002)targetRotation=null;}else if(autoRotate&&!reduced)planet.rotation.y+=.00045;
  const distance=camera.position.length();if(!interacting&&Math.abs(distance-desiredDistance)>.01)camera.position.setLength(THREE.MathUtils.lerp(distance,desiredDistance,reduced?1:.05));controls.update();renderer.render(scene,camera);
  for(const m of markers){m.anchor.getWorldPosition(worldPosition);const visible=worldPosition.dot(camera.position)>2.9;const p=worldPosition.clone().project(camera);m.label.hidden=!visible||p.z>1;m.label.style.left=`${(p.x*.5+.5)*container.clientWidth}px`;m.label.style.top=`${(-p.y*.5+.5)*container.clientHeight-50}px`;m.ring.material.opacity=m.a.id===selected ? .85 : .4;}
 }animate();
 async function loadActual(m){if(m.loaded||m.a.id==='eagle')return;m.loaded=true;try{const gltf=await new GLTFLoader().loadAsync(`assets/${m.a.model}`);if(dead){dispose(gltf.scene);return;}const model=gltf.scene,bounds=new THREE.Box3().setFromObject(model),size=bounds.getSize(new THREE.Vector3()),center=bounds.getCenter(new THREE.Vector3()),scale=.34/Math.max(size.x,size.y,size.z);model.position.set(-center.x,-bounds.min.y,-center.z);const normalizer=new THREE.Group();normalizer.scale.setScalar(scale);normalizer.add(model);const old=m.anchor.children[0];m.anchor.remove(old);dispose(old);m.anchor.add(normalizer);}catch{m.loaded=false;}}
 return {
  select(id){const m=markers.find(x=>x.a.id===id);if(!m)return;selected=id;autoRotate=false;targetRotation=-THREE.MathUtils.degToRad(m.a.lon)-Math.PI/2+Math.atan2(camera.position.x,camera.position.z);desiredDistance=4.1;markers.forEach(x=>x.label.classList.toggle('selected',x.a.id===id));loadActual(m);},
  reset(){selected=null;targetRotation=-1.6;desiredDistance=6.4;autoRotate=!reduced;},
  rotate(){autoRotate=!autoRotate;return autoRotate;},
  zoom(amount){desiredDistance=THREE.MathUtils.clamp(camera.position.length()*amount,2.7,9);},
  dispose(){dead=true;cancelAnimationFrame(frame);observer.disconnect();controls.dispose();markers.forEach(m=>m.label.remove());renderer.domElement.removeEventListener('pointerdown',down);renderer.domElement.removeEventListener('pointermove',move);renderer.domElement.removeEventListener('click',click);dispose(scene);environment.dispose();renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();}
 };
}
function dispose(object){object.traverse(o=>{o.geometry?.dispose();for(const m of(o.material?(Array.isArray(o.material)?o.material:[o.material]):[])){Object.values(m).forEach(v=>{if(v?.isTexture)v.dispose();});m.dispose();}});}
