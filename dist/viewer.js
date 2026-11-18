import * as THREE from 'three';
import {GLTFLoader} from './vendor/GLTFLoader.js';
import {DRACOLoader} from './vendor/DRACOLoader.js';
import {OrbitControls} from './vendor/OrbitControls.js';
import {RoomEnvironment} from './vendor/RoomEnvironment.js';
import {enhanceModel,createTerrain} from './model-presentation.js';
import {createHeritageModel} from './artifact-models.js';
import {createStoryEffects} from './story-effects.js';

export async function createViewer(container, {artifact,world,onSelect=()=>{},cinematic=false}={}) {
 let disposed=false, frame, model, wire=false,environment,draco,focusState=null,userInteracted=false;
 let homeDistance=6,floorY=-1.2;
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.6));
 renderer.outputColorSpace=THREE.SRGBColorSpace;
 renderer.toneMapping=THREE.ACESFilmicToneMapping;
 renderer.toneMappingExposure=1.05;
 renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 renderer.domElement.setAttribute('aria-label',world?`Rotatable ${world} globe`:`Rotatable ${artifact.name} ${artifact.modelType?'illustrative':'engineering'} model`);
 renderer.domElement.setAttribute('role','img');
 container.append(renderer.domElement);
 const scene=new THREE.Scene();
 const camera=new THREE.PerspectiveCamera(37,1,0.01,100);
 camera.position.set(3.7,2.5,4.4);
 const controls=new OrbitControls(camera,renderer.domElement);
 controls.enableDamping=true; controls.dampingFactor=0.08;
 controls.minDistance=.65; controls.maxDistance=18; controls.enablePan=false;controls.maxPolarAngle=Math.PI*.49;
 controls.addEventListener('start',()=>{userInteracted=true;controls.autoRotate=false;focusState=null;});
 controls.autoRotate=!matchMedia('(prefers-reduced-motion: reduce)').matches;
 controls.autoRotateSpeed=0.35;
 const hemisphere=new THREE.HemisphereLight(0xe3e9ef,0x51483b,.65);scene.add(hemisphere);
 const sun=new THREE.DirectionalLight(0xfff5e8,3);sun.position.set(4,7,5);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-5;sun.shadow.camera.right=5;sun.shadow.camera.top=5;sun.shadow.camera.bottom=-5;sun.shadow.camera.near=.1;sun.shadow.camera.far=24;sun.shadow.bias=-.0003;sun.shadow.normalBias=.015;sun.shadow.radius=2;scene.add(sun);
 const fill=new THREE.DirectionalLight(0xb5c4d7,.55);fill.position.set(-4,2,-3);scene.add(fill);
 const group=new THREE.Group();scene.add(group);
 let pins=[];
 if(world){
  renderer.toneMappingExposure=1;hemisphere.intensity=0.6;sun.intensity=2;fill.intensity=0.3;
  const tex=await new THREE.TextureLoader().loadAsync(`assets/${world.toLowerCase()}-texture.jpg`);tex.colorSpace=THREE.SRGBColorSpace;
  if(disposed){tex.dispose();return;}
  model=new THREE.Mesh(new THREE.SphereGeometry(1.65,64,48),new THREE.MeshStandardMaterial({map:tex,roughness:1}));group.add(model);
  camera.position.set(0.8,1,5.8); controls.update();
  const {artifacts}=await import('./data.js');
  artifacts.filter(a=>a.world===world).forEach(a=>{
   const lat=THREE.MathUtils.degToRad(a.lat),lon=THREE.MathUtils.degToRad(a.lon);
   const pin=new THREE.Mesh(new THREE.SphereGeometry(0.055,16,16),new THREE.MeshBasicMaterial({color:0xdbf5b9}));
   pin.position.set(1.7*Math.cos(lat)*Math.cos(lon),1.7*Math.sin(lat),-1.7*Math.cos(lat)*Math.sin(lon));pin.userData.id=a.id;group.add(pin);pins.push(pin);
  });
  // Orient the documented landing region toward the initial camera.
  group.rotation.y=-1.6;
 } else {
  const room=new RoomEnvironment();const pmrem=new THREE.PMREMGenerator(renderer);environment=pmrem.fromScene(room,0.04).texture;scene.environment=environment;scene.environmentIntensity=0.65;room.dispose();pmrem.dispose();
  let gltf;try{if(artifact.modelType){gltf={scene:createHeritageModel(artifact.modelType)};}else{draco=new DRACOLoader();draco.setDecoderPath('vendor/draco/');draco.setWorkerLimit(1);const loader=new GLTFLoader();loader.setDRACOLoader(draco);gltf=await loader.loadAsync(`assets/${artifact.model}`);}}catch(error){controls.dispose();draco?.dispose();environment?.dispose();renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();throw error;}
  if(disposed){disposeObject(gltf.scene);return;}
  model=gltf.scene;enhanceModel(model,artifact.id,renderer);
  const box=new THREE.Box3().setFromObject(model), size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3());
  const scale=3.2/Math.max(size.x,size.y,size.z);
  model.position.sub(center); const normalizer=new THREE.Group();normalizer.scale.setScalar(scale);normalizer.add(model);group.add(normalizer);
  group.rotation.y=-0.4;floorY=-size.y*scale/2-.015;createTerrain(scene,{world:artifact.world,floorY,renderer});
 }
 const selection=new THREE.Mesh(new THREE.SphereGeometry(.12,20,12),new THREE.MeshBasicMaterial({color:0x0032a0,transparent:true,opacity:.18,depthWrite:false}));selection.visible=false;scene.add(selection);
 const storyEffects=cinematic?createStoryEffects(scene,group,{floorY,sun,hemisphere}):null;
 scene.updateMatrixWorld(true);
 const annotations=[];
 if(artifact)artifact.hotspots.forEach((h,i)=>{const button=document.createElement('button');button.className='model-hotspot';button.textContent=`0${i+1}`;button.setAttribute('aria-label',`Inspect ${h.name}`);button.title=h.name;button.addEventListener('click',()=>onSelect(i));container.append(button);const anchor=model?.getObjectByName(`part-${i}`);const point=anchor?group.worldToLocal(anchor.getWorldPosition(new THREE.Vector3())):new THREE.Vector3(...h.position);annotations.push({button,point});});
 function fitView(){homeDistance=Math.max(cinematic?6.3:5.3,4.8/Math.max(camera.aspect,.3));camera.position.copy(new THREE.Vector3(3.7,2.5,4.4).normalize().multiplyScalar(homeDistance));controls.target.set(0,0,0);controls.update();}
 const observer=new ResizeObserver(()=>{if(disposed)return;const w=container.clientWidth,h=container.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/Math.max(h,1);camera.updateProjectionMatrix();if(artifact&&!userInteracted&&!focusState)fitView();});observer.observe(container);
 const ray=new THREE.Raycaster(),pointer=new THREE.Vector2();
 function select(event){if(!pins.length)return;const r=renderer.domElement.getBoundingClientRect();pointer.set((event.clientX-r.left)/r.width*2-1,-(event.clientY-r.top)/r.height*2+1);ray.setFromCamera(pointer,camera);const hit=ray.intersectObjects(pins)[0];if(hit)onSelect(hit.object.userData.id);}
 renderer.domElement.addEventListener('click',select);
 function animate(){if(disposed)return;frame=requestAnimationFrame(animate);if(focusState){camera.position.lerp(focusState.camera,.1);controls.target.lerp(focusState.target,.1);if(camera.position.distanceTo(focusState.camera)<.005&&controls.target.distanceTo(focusState.target)<.005){focusState=null;controls.enabled=true;}}controls.update();storyEffects?.update(performance.now()/1000);renderer.render(scene,camera);for(const a of annotations){const p=group.localToWorld(a.point.clone()).project(camera);a.button.style.left=`${(p.x*.5+.5)*container.clientWidth}px`;a.button.style.top=`${(-p.y*.5+.5)*container.clientHeight}px`;a.button.hidden=!!storyEffects?.hidesModel||p.z>1||p.z<0||Math.abs(p.x)>.94||Math.abs(p.y)>.94;}}animate();
 return {
  reset(){const arm=model?.getObjectByName('sample-arm');if(arm)arm.rotation.z=0;group.position.set(0,0,0);userInteracted=false;focusState=null;controls.enabled=true;controls.autoRotate=false;selection.visible=false;delete container.dataset.focusedPart;renderer.domElement.setAttribute('aria-label',`Rotatable ${artifact?.name||world} ${artifact?.modelType?'illustrative':'engineering'} model`);annotations.forEach(a=>a.button.classList.remove('is-focused'));if(artifact)fitView();else{camera.position.set(.8,1,5.8);controls.target.set(0,0,0);controls.update();}},
  focusHotspot(index){const item=annotations[index];if(!item)return;userInteracted=true;controls.autoRotate=false;controls.enabled=false;group.updateMatrixWorld(true);const point=group.localToWorld(item.point.clone());const direction=new THREE.Vector3(point.x,.9,point.z);if(direction.length()<.1)direction.set(0,.8,1);direction.normalize();const distance=(index===0&&artifact?.id!=='eagle'?2.1:1.8)/Math.min(1,Math.max(.6,camera.aspect));const cameraPoint=point.clone().addScaledVector(direction,distance);cameraPoint.y=Math.max(floorY+.3,cameraPoint.y);focusState={target:point,camera:cameraPoint};selection.position.copy(point);selection.visible=true;annotations.forEach((a,i)=>a.button.classList.toggle('is-focused',i===index));container.dataset.focusedPart=artifact.hotspots[index].name;renderer.domElement.setAttribute('aria-label',`Close-up of ${artifact.hotspots[index].name} on ${artifact.name}`);},
  storyEffect(kind,value=0){storyEffects?.set(kind,value);if(kind==='ascent'){selection.visible=false;renderer.domElement.setAttribute('aria-label','Illustration of Eagle’s stage separation');}},
  sample(value){const arm=model?.getObjectByName('sample-arm');if(arm)arm.rotation.z=-Math.max(0,Math.min(1,value))*.58;},
  drive(value){group.position.z=(value-.5)*.55;model?.traverse(node=>{if(node.name.startsWith('drive-wheel-'))node.rotation.x=value*Math.PI*8;});},
  rotate(){controls.autoRotate=!controls.autoRotate;return controls.autoRotate;},
  wireframe(){wire=!wire;group.traverse(o=>{if(o.isMesh){for(const m of (Array.isArray(o.material)?o.material:[o.material]))if('wireframe'in m)m.wireframe=wire;}});return wire;},
  zoom(amount){camera.position.multiplyScalar(amount);controls.update();},
  dispose(){disposed=true;cancelAnimationFrame(frame);observer.disconnect();controls.dispose();renderer.domElement.removeEventListener('click',select);for(const a of annotations)a.button.remove();disposeObject(scene);sun.shadow.map?.dispose();environment?.dispose();draco?.dispose();renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();}
 };
}
function disposeObject(object){object.traverse(o=>{o.geometry?.dispose();if(o.material)for(const m of(Array.isArray(o.material)?o.material:[o.material])){Object.values(m).forEach(v=>{if(v?.isTexture)v.dispose();});m.dispose();}});}
