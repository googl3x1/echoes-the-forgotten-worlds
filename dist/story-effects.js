import * as THREE from 'three';
import {createDescentMarker} from './model-presentation.js';

// Educational illustrations: neither measured dust density nor a flight simulation.
export function createStoryEffects(scene,group,{floorY,sun,hemisphere}){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 let kind='none',amount=0,ascent;
 const positions=new Float32Array(420*3);let seed=71;
 const rand=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
 for(let i=0;i<420;i++)positions.set([(rand()-.5)*9,floorY+.15+rand()*4,(rand()-.5)*9],i*3);
 const dust=new THREE.Points(new THREE.BufferGeometry().setAttribute('position',new THREE.BufferAttribute(positions,3)),new THREE.PointsMaterial({color:0xffbc7e,size:.025,transparent:true,opacity:0,depthWrite:false}));dust.visible=false;scene.add(dust);
 const rings=[];
 for(let i=0;i<3;i++){const ring=new THREE.Mesh(new THREE.RingGeometry(.96,1,64),new THREE.MeshBasicMaterial({color:0x0032a0,transparent:true,opacity:0,side:THREE.DoubleSide,depthWrite:false}));ring.rotation.x=-Math.PI/2;ring.position.set(-.5,floorY+.025,.8);scene.add(ring);rings.push(ring);}
 function buildAscent(){
  const root=new THREE.Group(),lower=createDescentMarker();lower.scale.setScalar(6);lower.position.y=floorY+.24;root.add(lower);
  const upper=new THREE.Group(),silver=new THREE.MeshStandardMaterial({color:0xb7c1ca,metalness:.65,roughness:.36}),black=new THREE.MeshStandardMaterial({color:0x15232b,roughness:.4});
  const cabin=new THREE.Mesh(new THREE.CylinderGeometry(.57,.68,.8,8),silver);cabin.position.y=.45;upper.add(cabin);
  const roof=new THREE.Mesh(new THREE.CylinderGeometry(.44,.57,.23,8),silver);roof.position.y=.96;upper.add(roof);
  for(const x of[-.24,.24]){const window=new THREE.Mesh(new THREE.BoxGeometry(.25,.2,.035),black);window.position.set(x,.62,.61);upper.add(window);}
  const nozzle=new THREE.Mesh(new THREE.CylinderGeometry(.08,.17,.22,16,1,true),black);nozzle.position.y=-.08;upper.add(nozzle);
  const flame=new THREE.Mesh(new THREE.ConeGeometry(.12,.8,16),new THREE.MeshBasicMaterial({color:0xffdb6a,transparent:true,opacity:.8}));flame.rotation.z=Math.PI;flame.position.y=-.55;flame.visible=false;upper.add(flame);
  upper.position.y=floorY+1.15;root.add(upper);scene.add(root);return{root,upper,flame};
 }
 return {
  get hidesModel(){return kind==='ascent';},
  set(next,value=0){kind=next;amount=THREE.MathUtils.clamp(value,0,1);if(next==='ascent'&&!ascent)ascent=buildAscent();group.visible=next!=='ascent';if(ascent)ascent.root.visible=next==='ascent';dust.visible=next==='dust';if(ascent){ascent.upper.position.y=floorY+1.15+amount*amount*6;ascent.flame.visible=next==='ascent'&&amount>0&&amount<.96;}},
  update(time){const dim=kind==='dust'?amount:kind==='sunrise'?1-amount:0;sun.intensity=THREE.MathUtils.lerp(sun.intensity,3*(1-dim*.88),.06);hemisphere.intensity=THREE.MathUtils.lerp(hemisphere.intensity,.65*(1-dim*.5),.06);dust.material.opacity=amount*.58;if(!reduced)dust.rotation.y=time*.045;for(let i=0;i<rings.length;i++){const phase=(time*.5+i/3)%1;rings[i].visible=kind==='listen';rings[i].scale.setScalar(.25+phase*2.8);rings[i].material.opacity=kind==='listen'?(reduced?.35:(1-phase)*.5):0;}}
 };
}
