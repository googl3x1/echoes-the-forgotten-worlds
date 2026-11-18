import * as THREE from './vendor/three.module.js';

// Original illustrations based on NASA photographs and documented hardware design.
// They are not NASA engineering meshes, present-day scans, or calibrated simulations.
export const heritageSpecs={lrv:{wheels:4,power:'batteries'},reflector:{rows:10,columns:10,cornerCubes:100,panelMeters:.46,power:'passive'},surveyor3:{legs:3,power:'solar',configuration:'working-era'},alsep12:{components:['central station','RTG','passive seismometer'],power:'radioisotope heat',layout:'compact illustration'},phoenix:{legs:3,solarArrays:2,power:'solar'}};
const metal=(color,roughness=.48)=>new THREE.MeshStandardMaterial({color,roughness,metalness:.65});
function box(root,size,position,material){const mesh=new THREE.Mesh(new THREE.BoxGeometry(...size),material);mesh.position.set(...position);root.add(mesh);return mesh;}
function tube(root,a,b,r,material){const start=new THREE.Vector3(...a),end=new THREE.Vector3(...b),mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r,start.distanceTo(end),8),material);mesh.position.copy(start).lerp(end,.5);mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),end.sub(start).normalize());root.add(mesh);return mesh;}
function part(root,index,position){const anchor=new THREE.Object3D();anchor.name=`part-${index}`;anchor.position.set(...position);root.add(anchor);}
function reflector(){
 const root=new THREE.Group();root.name='Apollo 11 laser reflector illustration';
 const silver=metal(0xb4bdc5,.32),dark=metal(0x313944,.5),panel=new THREE.Group();panel.position.y=.28;panel.rotation.x=.42;root.add(panel);
 box(panel,[.48,.018,.48],[0,0,0],silver);box(panel,[.447,.007,.447],[0,.013,0],dark);
 const glass=new THREE.MeshPhysicalMaterial({color:0xb4d9ef,metalness:.1,roughness:.12,transmission:.16,thickness:.008,ior:1.46,clearcoat:1});
 const lenses=new THREE.InstancedMesh(new THREE.CylinderGeometry(.018,.018,.008,16),glass,100),rims=new THREE.InstancedMesh(new THREE.TorusGeometry(.019,.0013,5,20),silver,100),facets=new THREE.InstancedMesh(new THREE.OctahedronGeometry(.013,0),new THREE.MeshStandardMaterial({color:0xd2e7f1,metalness:.6,roughness:.15}),100);
 lenses.name='100 corner-cube apertures';const transform=new THREE.Object3D();
 for(let row=0;row<10;row++)for(let col=0;col<10;col++){const i=row*10+col,x=(col-4.5)*.0435,z=(row-4.5)*.0435;transform.position.set(x,.022,z);transform.rotation.set(0,0,0);transform.updateMatrix();lenses.setMatrixAt(i,transform.matrix);transform.rotation.x=Math.PI/2;transform.updateMatrix();rims.setMatrixAt(i,transform.matrix);transform.rotation.set(0,Math.PI/4,0);transform.position.y=.025;transform.scale.set(1,.35,1);transform.updateMatrix();facets.setMatrixAt(i,transform.matrix);transform.scale.set(1,1,1);}
 panel.add(lenses,rims,facets);
 for(const x of[-.2,.2]){tube(root,[x,.20,.20],[x,.012,.23],.009,silver);tube(root,[x,.36,-.20],[x,.012,-.22],.009,silver);box(root,[.065,.009,.065],[x,.009,.23],silver);box(root,[.065,.009,.065],[x,.009,-.22],silver);}
 tube(root,[-.2,.03,.23],[.2,.03,.23],.006,silver);tube(root,[-.2,.02,-.22],[.2,.02,-.22],.006,silver);
 part(root,0,[0,.31,0]);part(root,1,[-.235,.30,-.06]);part(root,2,[.2,.09,.21]);root.userData.specs=heritageSpecs.reflector;return root;
}
function lunarRover({simple=false}={}){
 const root=new THREE.Group();root.name='Apollo 17 Lunar Roving Vehicle illustration';
 const silver=metal(0xaab2bb,.42),gold=metal(0xb39555,.55),dark=metal(0x3c4144,.8),fabric=new THREE.MeshStandardMaterial({color:0xdad9cd,roughness:1,side:THREE.DoubleSide});
 const base=new THREE.Group();root.add(base);box(base,[1.45,.14,2.25],[0,.58,0],gold);box(base,[1.5,.035,1.6],[0,.68,-.15],silver);
 for(const x of[-.72,.72]){tube(root,[x,.48,-1.15],[x,.64,1.08],.025,silver);tube(root,[x,.55,-1.1],[x,.71,1.1],.018,silver);}
 for(const z of[-1.1,0,1.05])tube(root,[-.72,.58,z],[.72,.58,z],.022,silver);
 for(const x of[-1.05,1.05])for(const z of[-.95,.95]){
  const wheel=new THREE.Group();wheel.position.set(x,.405,z);wheel.name=`drive-wheel-${x<0?'L':'R'}-${z<0?'rear':'front'}`;root.add(wheel);
  const mesh=new THREE.Mesh(new THREE.CylinderGeometry(.405,.405,.23,32,simple?3:10,true),new THREE.MeshStandardMaterial({color:0x727a7f,roughness:.78,metalness:.5,wireframe:true}));mesh.rotation.z=Math.PI/2;wheel.add(mesh);
  for(const side of[-1,1]){const rim=new THREE.Mesh(new THREE.TorusGeometry(.397,.012,6,32),silver);rim.rotation.y=Math.PI/2;rim.position.x=side*.115;wheel.add(rim);const hub=new THREE.Mesh(new THREE.CylinderGeometry(.105,.105,.025,16),dark);hub.rotation.z=Math.PI/2;hub.position.x=side*.13;wheel.add(hub);}
  for(let i=0;i<8;i++){const angle=i*Math.PI/4;tube(wheel,[-.13,0,0],[-.13,Math.cos(angle)*.38,Math.sin(angle)*.38],.009,silver);}
  const fender=new THREE.Mesh(new THREE.CylinderGeometry(.455,.455,.29,20,1,true,0,Math.PI),gold);fender.rotation.z=Math.PI/2;fender.position.copy(wheel.position);root.add(fender);tube(root,[Math.sign(x)*.64,.57,z],[x,.405,z],.03,silver);
 }
 for(const x of[-.4,.4]){
  const seat=box(root,[.52,.045,.56],[x,.89,-.22],fabric);seat.rotation.x=-.06;
  const back=box(root,[.52,.64,.035],[x,1.2,-.49],fabric);back.rotation.x=-.12;
  for(const side of[-.28,.28]){tube(root,[x+side,.70,-.48],[x+side,1.52,-.5],.018,silver);tube(root,[x+side,.68,.12],[x+side,.91,.12],.018,silver);}
  tube(root,[x-.28,1.5,-.54],[x+.28,1.5,-.54],.018,silver);
 }
 for(const x of[-.38,.38])box(root,[.55,.21,.39],[x,.77,.75],new THREE.MeshStandardMaterial({color:0xd4d1bd,metalness:.25,roughness:.65}));
 tube(root,[0,.72,.17],[0,1.03,.4],.028,silver);tube(root,[-.14,1.03,.4],[.14,1.03,.4],.022,dark);
 for(const x of[-.56,.56]){tube(root,[x,.62,.4],[x,.61,1.32],.018,silver);tube(root,[x-.13,.61,1.31],[x+.13,.61,1.31],.016,silver);}
 box(root,[1.2,.28,.32],[0,.9,-1.0],fabric);for(const x of[-.56,.56])tube(root,[x,.8,-1.08],[x,1.33,-1.1],.018,silver);
 // Front communications mast and a wire-mesh dish, plus a separate television camera.
 tube(root,[-.47,.68,.78],[-.47,1.85,.78],.018,silver);
 const dish=new THREE.Group();dish.position.set(-.47,1.94,.78);dish.rotation.x=1.03;root.add(dish);
 const dishMesh=new THREE.Mesh(new THREE.SphereGeometry(.43,32,12,0,Math.PI*2,0,Math.PI*.4),new THREE.MeshStandardMaterial({color:0xae9559,metalness:.7,roughness:.5,wireframe:true,side:THREE.DoubleSide}));dish.add(dishMesh);
 const dishRim=new THREE.Mesh(new THREE.TorusGeometry(Math.sin(Math.PI*.4)*.43,.011,6,48),gold);dishRim.rotation.x=Math.PI/2;dishRim.position.y=Math.cos(Math.PI*.4)*.43;dish.add(dishRim);
 tube(root,[.45,.73,.75],[.45,1.52,.75],.024,silver);box(root,[.26,.19,.31],[.45,1.59,.79],fabric);const lens=new THREE.Mesh(new THREE.CylinderGeometry(.055,.055,.075,16),dark);lens.rotation.x=Math.PI/2;lens.position.set(.45,1.60,1.0);root.add(lens);
 tube(root,[.7,.72,-.7],[.7,2.3,-.7],.012,silver);box(root,[.16,.13,.12],[.7,2.31,-.7],dark);
 if(!simple)for(let i=0;i<4;i++)tube(root,[-.5+i*.15,.85,-1.12],[-.5+i*.15,1.35+(i%2)*.16,-1.15],.009,dark);
 part(root,0,[1.18,.42,.95]);part(root,1,[0,1.1,-.3]);part(root,2,[-.47,2.1,.95]);root.userData.specs=heritageSpecs.lrv;return root;
}
function cylinder(root,radius,height,position,material,segments=24){const mesh=new THREE.Mesh(new THREE.CylinderGeometry(radius,radius,height,segments),material);mesh.position.set(...position);root.add(mesh);return mesh;}
function feet(root,radius,height,material){for(let i=0;i<3;i++){const t=i*Math.PI*2/3,x=Math.cos(t),z=Math.sin(t);tube(root,[x*.45,height,z*.45],[x*radius,.08,z*radius],.035,material);tube(root,[x*.7,height-.24,z*.7],[x*radius,.08,z*radius],.022,material);cylinder(root,.22,.035,[x*radius,.04,z*radius],material);}}
function solarDisc(root,x,y,z,radius){const dark=metal(0x172f64,.42),silver=metal(0xadb9c8,.36),panel=new THREE.Group();panel.name='circular-solar-array';panel.position.set(x,y,z);root.add(panel);cylinder(panel,radius,.025,[0,0,0],dark,48);const rim=new THREE.Mesh(new THREE.TorusGeometry(radius,.012,5,64),silver);rim.rotation.x=Math.PI/2;panel.add(rim);for(let i=0;i<24;i++){const t=i*Math.PI/12;tube(panel,[0,.019,0],[Math.cos(t)*radius,.019,Math.sin(t)*radius],.003,silver);}for(const r of[.28,.52,.76]){const ring=new THREE.Mesh(new THREE.TorusGeometry(radius*r,.003,4,48),silver);ring.rotation.x=Math.PI/2;ring.position.y=.019;panel.add(ring);}return panel;}
function sampler(root,position,length,material){const arm=new THREE.Group();arm.name='sample-arm';arm.position.set(...position);root.add(arm);tube(arm,[0,0,0],[length*.55,.08,0],.032,material);tube(arm,[0,.10,.08],[length*.55,.18,.08],.018,material);cylinder(arm,.10,.11,[0,0,0],material).rotation.x=Math.PI/2;tube(arm,[length*.55,.08,0],[length,-.10,0],.026,material);box(arm,[.24,.10,.23],[length+.02,-.14,0],metal(0x858b8e,.65));box(arm,[.24,.14,.018],[length+.02,-.10,-.115],material);for(let i=0;i<4;i++)box(arm,[.025,.035,.05],[length-.065+i*.055,-.205,.12],material);return arm;}
function surveyor(){const root=new THREE.Group();root.name='Surveyor 3 working-era illustration';const white=metal(0xe3e3da,.65),gold=metal(0xaa853f,.55),silver=metal(0xa9b1b8,.38),dark=metal(0x303943,.62);
 feet(root,1.35,.86,white);cylinder(root,.40,.24,[0,.86,0],gold,6);for(let i=0;i<3;i++){const t=i*Math.PI*2/3,n=(i+1)*Math.PI*2/3;const a=[Math.cos(t)*.73,.85,Math.sin(t)*.73],b=[Math.cos(n)*.73,.85,Math.sin(n)*.73];tube(root,a,b,.027,white);tube(root,a,[0,1.75,0],.025,white);box(root,[.26,.28,.28],[a[0],.99,a[2]],gold);}
 tube(root,[0,.8,0],[0,2.42,0],.032,white);const solar=box(root,[.85,.035,.57],[0,2.29,0],metal(0x273d6b,.45));solar.rotation.z=.14;for(let i=-3;i<=3;i++)tube(solar,[i*.115,.023,-.27],[i*.115,.023,.27],.003,silver);const antenna=box(root,[.66,.025,.46],[0,2.55,-.08],white);antenna.rotation.z=-.25;
 tube(root,[-.34,.95,.28],[-.34,1.54,.28],.022,white);cylinder(root,.12,.34,[-.34,1.46,.28],white);const mirror=box(root,[.18,.18,.025],[-.34,1.7,.30],silver);mirror.rotation.x=-.45;box(root,[.10,.08,.04],[-.34,1.55,.42],dark);sampler(root,[.47,.75,.36],1.0,silver);
 part(root,0,[-.34,1.6,.35]);part(root,1,[1.47,.61,.36]);part(root,2,[0,2.3,0]);root.userData.specs=heritageSpecs.surveyor3;return root;}
function alsep(){const root=new THREE.Group();root.name='Apollo 12 ALSEP selected equipment illustration';const gold=metal(0xc29d51,.5),silver=metal(0xc2c5c9,.55),dark=metal(0x555258,.65),white=metal(0xe1ded3,.78);
 box(root,[.90,.55,.72],[0,.36,0],gold);box(root,[1.04,.08,.85],[0,.69,0],silver);for(let i=0;i<9;i++)box(root,[.09,.016,.62],[-.42+i*.105,.74,0],silver);tube(root,[0,.69,0],[0,1.9,0],.017,silver);const antenna=box(root,[.43,.023,.35],[0,1.92,0],white);antenna.rotation.z=.42;
 const rtg=new THREE.Group();rtg.name='radioisotope-power-supply';rtg.position.set(-1.6,.44,.05);root.add(rtg);cylinder(rtg,.21,.68,[0,0,0],dark);for(let i=0;i<10;i++){const t=i*Math.PI/5;const fin=box(rtg,[.19,.66,.018],[Math.cos(t)*.25,0,Math.sin(t)*.25],dark);fin.rotation.y=-t;}for(const y of[-.35,.35])cylinder(rtg,.23,.025,[0,y,0],silver);for(const x of[-.27,.27])tube(root,[-1.6+x,.45,.05],[-1.6+x,.04,.24],.018,silver);
 const blanket=box(root,[1,.012,.9],[1.45,.02,.1],silver);blanket.rotation.y=.18;cylinder(root,.20,.23,[1.45,.15,.1],white);cylinder(root,.25,.035,[1.45,.28,.1],silver);for(let i=0;i<7;i++)cylinder(root,.20,.006,[1.45,.06+i*.029,.1],silver);
 const cable=new THREE.CatmullRomCurve3([new THREE.Vector3(-1.4,.04,.05),new THREE.Vector3(-1,.03,.45),new THREE.Vector3(-.5,.03,.3)]);root.add(new THREE.Mesh(new THREE.TubeGeometry(cable,18,.009,5,false),dark));const signal=new THREE.CatmullRomCurve3([new THREE.Vector3(.4,.04,0),new THREE.Vector3(.8,.03,-.2),new THREE.Vector3(1.45,.03,.1)]);root.add(new THREE.Mesh(new THREE.TubeGeometry(signal,18,.007,5,false),dark));
 part(root,0,[1.45,.27,.1]);part(root,1,[-1.6,.53,.05]);part(root,2,[0,1.7,0]);root.userData.specs=heritageSpecs.alsep12;return root;}
function phoenix(){const root=new THREE.Group();root.name='Phoenix deployed hardware illustration';const gold=metal(0xc1a064,.5),silver=metal(0xc0c7cd,.4),white=metal(0xe4e2d8,.7),dark=metal(0x2b3442,.65);
 feet(root,1.05,.82,silver);cylinder(root,.72,.24,[0,.83,0],gold,6);cylinder(root,.74,.035,[0,.97,0],silver,6);for(const x of[-1,1]){tube(root,[x*.6,.89,0],[x*1.65,.94,0],.026,silver);solarDisc(root,x*1.65,.94,0,.82);}for(const z of[-.32,.32])box(root,[.40,.23,.25],[-.20,1.10,z],white);const lab=box(root,[.42,.12,.55],[.30,1.06,-.15],white);for(let i=0;i<8;i++)box(lab,[.07,.018,.09],[-.135+(i%4)*.09,.072,-.14+Math.floor(i/4)*.25],silver);
 tube(root,[-.42,.98,-.34],[-.42,2.13,-.34],.026,silver);box(root,[.29,.16,.15],[-.42,2.18,-.34],white);for(const x of[-.50,-.34]){const eye=cylinder(root,.04,.07,[x,2.18,-.24],dark,16);eye.rotation.x=Math.PI/2;}tube(root,[.42,.98,-.4],[.42,1.72,-.4],.014,silver);for(const y of[1.35,1.5,1.65])box(root,[.12,.05,.12],[.42,y,-.4],white);const arm=sampler(root,[.42,1.04,.38],1.20,silver);arm.rotation.y=-.5;box(root,[.13,.07,.14],[.48,1.27,.41],white);
 part(root,0,[1.48,.90,.98]);part(root,1,[.30,1.13,-.15]);part(root,2,[-1.65,1,0]);root.userData.specs=heritageSpecs.phoenix;return root;}
export function createHeritageModel(type,options={}){if(type==='lrv')return lunarRover(options);if(type==='reflector')return reflector();if(type==='surveyor3')return surveyor();if(type==='alsep12')return alsep();if(type==='phoenix')return phoenix();throw new Error(`Unknown illustrative model: ${type}`);}
