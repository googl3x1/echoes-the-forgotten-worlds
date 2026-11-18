import * as THREE from './vendor/three.module.js';

// Original, simplified design illustrations in approximate metre-scale units.
// These are neither NASA engineering meshes nor scans of present-day remains.
// MPL is a planned deployed configuration: its actual resting site is unconfirmed.
export const collectionModelSpecs={
 surveyor1:{legs:3,power:'solar',sampler:false,instrument:'television camera',configuration:'working-era'},
 surveyor5:{legs:3,power:'solar',sampler:false,instrument:'alpha-scattering analyzer',configuration:'working-era'},
 surveyor6:{legs:3,power:'solar',sampler:false,instrument:'alpha-scattering analyzer',hop:true,configuration:'working-era'},
 surveyor7:{legs:3,power:'solar',sampler:true,instrument:'alpha-scattering analyzer',configuration:'working-era'},
 falcon:{legs:4,stages:1,configuration:'descent stage only',power:'mission batteries'},
 viking2:{legs:3,power:'two RTGs',sampler:true,configuration:'working-era'},
 pathfinder:{petals:3,power:'solar',airbags:'deflated illustration',configuration:'working-era'},
 sojourner:{wheels:6,power:'solar and batteries',instrument:'APXS',configuration:'working-era'},
 ingenuity:{legs:4,rotors:2,bladesPerRotor:2,power:'solar and batteries',configuration:'working-era'},
 polarlander:{legs:3,solarArrays:2,arrayShape:'rectangular folding panels',sampler:true,configuration:'planned deployed design; resting place unknown'}
};
const TAU=Math.PI*2;
const metal=(color,roughness=.5)=>new THREE.MeshStandardMaterial({color,roughness,metalness:.65});
const matte=color=>new THREE.MeshStandardMaterial({color,roughness:.95});
function mesh(root,geometry,material,position=[0,0,0]){const m=new THREE.Mesh(geometry,material);m.position.set(...position);m.castShadow=true;m.receiveShadow=true;root.add(m);return m;}
const box=(root,size,position,material)=>mesh(root,new THREE.BoxGeometry(...size),material,position);
const cyl=(root,radius,height,position,material,segments=16)=>mesh(root,new THREE.CylinderGeometry(radius,radius,height,segments),material,position);
function rod(root,start,end,radius,material,segments=8){const a=new THREE.Vector3(...start),b=new THREE.Vector3(...end),m=mesh(root,new THREE.CylinderGeometry(radius,radius,a.distanceTo(b),segments),material);m.position.copy(a).lerp(b,.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),b.sub(a).normalize());return m;}
function anchor(root,index,position){const n=new THREE.Object3D();n.name=`part-${index}`;n.position.set(...position);root.add(n);}
function materials(){return {white:metal(0xe3e0d4,.65),silver:metal(0xb5bec3,.38),gold:metal(0xb89951,.48),dark:matte(0x222831),black:matte(0x0e141b),blue:metal(0x15345d,.4),copper:metal(0x996b40,.62)};}
function panel(root,width,depth,position,m,{simple=false,angle=0}={}){
 const g=new THREE.Group();g.position.set(...position);g.rotation.z=angle;root.add(g);box(g,[width+.025,.022,depth+.025],[0,0,0],m.silver);box(g,[width,.009,depth],[0,.016,0],m.blue);
 const lines=simple?4:10;for(let i=1;i<lines;i++)box(g,[.002,.002,depth],[-width/2+i*width/lines,.023,0],m.silver);
 if(!simple)for(let i=1;i<5;i++)box(g,[width,.002,.002],[0,.023,-depth/2+i*depth/5],m.silver);
 return g;
}
function legs(root,count,span,deckHeight,m,{simple=false,angle=0}={}){
 for(let i=0;i<count;i++){const t=i*TAU/count+angle,x=Math.cos(t),z=Math.sin(t),foot=[x*span,.055,z*span];
  cyl(root,.16,.055,foot,m.silver,simple?10:20);rod(root,[x*span*.42,deckHeight,z*span*.42],foot,.035,m.white);rod(root,[x*span*.24,deckHeight-.18,z*span*.24],foot,.018,m.silver);
  const shock=rod(root,[x*span*.50,deckHeight*.75,z*span*.50],[x*span*.72,deckHeight*.40,z*span*.72],.052,m.silver);shock.name=`landing-strut-${i}`;
 }
}
function dish(root,radius,position,m,{simple=false,tilt=.3}={}){
 const points=[];for(let i=0;i<9;i++){const r=i*radius/8;points.push(new THREE.Vector2(r,.3*r*r/radius));}
 const material=new THREE.MeshStandardMaterial({color:0xd8dcda,metalness:.5,roughness:.46,side:THREE.DoubleSide});const g=new THREE.Group();g.position.set(...position);g.rotation.z=tilt;root.add(g);
 mesh(g,new THREE.LatheGeometry(points,simple?12:24),material);rod(g,[0,.02,0],[0,radius*.7,0],.009,m.silver);
 if(!simple)for(let i=0;i<3;i++){const t=i*TAU/3;rod(g,[Math.cos(t)*radius,.3*radius,Math.sin(t)*radius],[0,radius*.7,0],.006,m.silver);}
 return g;
}
function camera(root,position,m,{simple=false,twin=false}={}){
 const g=new THREE.Group();g.position.set(...position);root.add(g);cyl(g,.105,.27,[0,0,0],m.white,simple?10:20);cyl(g,.12,.035,[0,.15,0],m.silver);box(g,[.16,.13,.07],[0,.06,.11],m.white);
 const eye=cyl(g,.035,.023,[0,.065,.151],m.black);eye.rotation.x=Math.PI/2;
 if(twin){const eye2=eye.clone();eye2.position.x=.073;g.add(eye2);}return g;
}
function samplingArm(root,position,length,m){const g=new THREE.Group();g.name='sample-arm';g.position.set(...position);root.add(g);
 cyl(g,.10,.08,[0,0,0],m.silver).rotation.z=Math.PI/2;
 rod(g,[0,0,0],[length*.48,.13,0],.028,m.silver);rod(g,[0,.08,.075],[length*.48,.21,.075],.014,m.white);
 rod(g,[length*.48,.13,0],[length,-.27,0],.023,m.silver);box(g,[.20,.07,.19],[length+.04,-.30,0],m.silver);box(g,[.20,.11,.015],[length+.04,-.26,-.09],m.silver);
 for(let i=0;i<4;i++)box(g,[.025,.035,.07],[length-.025+i*.045,-.345,.075],m.dark);return g;
}
function surveyor(type,{simple=false}={}){
 const root=new THREE.Group(),m=materials();root.name=`${type.replace('surveyor','Surveyor ')} original working-era design illustration`;
 legs(root,3,1.4,.90,m,{simple,angle:Math.PI/2});cyl(root,.43,.23,[0,.94,0],m.gold,6);
 for(let i=0;i<3;i++){const t=i*TAU/3+Math.PI/2,next=t+TAU/3,a=[Math.cos(t)*.68,1,Math.sin(t)*.68],b=[Math.cos(next)*.68,1,Math.sin(next)*.68];rod(root,a,b,.025,m.white);rod(root,a,[0,1.82,0],.023,m.white);box(root,[.28,.27,.23],[a[0],1.11,a[2]],i===1?m.dark:m.gold);}
 cyl(root,.27,.44,[0,.57,0],m.dark);mesh(root,new THREE.ConeGeometry(.17,.25,12,1,true),m.silver,[0,.35,0]);
 rod(root,[0,1,0],[0,2.58,0],.032,m.white);panel(root,.90,.57,[0,2.27,0],m,{simple,angle:.12});
 const antenna=box(root,[.65,.025,.45],[0,2.62,-.03],m.white);antenna.rotation.z=-.25;
 rod(root,[-.38,1,.30],[-.38,1.65,.30],.023,m.white);camera(root,[-.38,1.57,.30],m,{simple});const mirror=box(root,[.16,.18,.025],[-.38,1.82,.31],m.silver);mirror.rotation.x=-.45;
 if(type==='surveyor5'||type==='surveyor6'||type==='surveyor7'){
  const analyzer=new THREE.Group();analyzer.position.set(.65,.15,.7);root.add(analyzer);box(analyzer,[.22,.14,.27],[0,0,0],m.gold);cyl(analyzer,.065,.02,[0,.08,0],m.dark);rod(root,[.25,.9,.40],[.65,.20,.70],.009,m.dark);
 }
 if(type==='surveyor7'){const arm=samplingArm(root,[.47,.84,.25],1.05,m);arm.rotation.y=-.30;anchor(root,1,[1.47,.55,.55]);}
 else if(type==='surveyor5')anchor(root,1,[.65,.20,.70]);
 else anchor(root,1,[0,.13,1.4]);
 if(type==='surveyor6')for(let i=0;i<3;i++){const t=i*TAU/3;mesh(root,new THREE.ConeGeometry(.085,.18,10,1,true),m.dark,[Math.cos(t)*.43,.62,Math.sin(t)*.43]);}
 if(!simple){for(const x of[-.28,.28])rod(root,[x,.92,-.20],[x,1.38,-.24],.008,m.dark);box(root,[.13,.13,.06],[.50,1.08,.3],m.silver);}
 anchor(root,0,[-.38,1.66,.38]);anchor(root,2,[0,2.3,0]);return root;
}
function falcon({simple=false}={}){
 const root=new THREE.Group(),m=materials();root.name='Apollo 15 Falcon descent-stage-only original illustration';
 const body=cyl(root,1.48,.98,[0,1.23,0],m.gold,8);body.rotation.y=Math.PI/8;const top=cyl(root,1.49,.055,[0,1.745,0],m.silver,8);top.rotation.y=Math.PI/8;
 const darkGold=metal(0x8b652d,.55),lightGold=metal(0xd3b571,.48);
 for(let i=0;i<8;i++){const t=i*TAU/8,x=Math.cos(t),z=Math.sin(t),panel=new THREE.Group();panel.position.set(x*1.37,1.24,z*1.37);panel.rotation.y=Math.PI/2-t;root.add(panel);box(panel,[1.04,.88,.012],[0,0,.015],i%3===0?darkGold:i%3===1?m.gold:lightGold);
  if(!simple)for(let j=0;j<3;j++){const seam=box(panel,[.005,.92,.013],[-.37+j*.34,0,.028],lightGold);seam.rotation.z=(i%2?1:-1)*.10;}
 }
 legs(root,4,2.5,1.4,m,{simple,angle:Math.PI/4});
 for(let i=0;i<4;i++){const t=i*TAU/4+Math.PI/4,x=Math.cos(t),z=Math.sin(t);rod(root,[x*1.05,1.72,z*1.05],[x*2.22,.21,z*2.22],.055,m.gold);rod(root,[x*1.0,.83,z*1.0],[x*1.96,.53,z*1.96],.035,m.silver);cyl(root,.39,.045,[x*2.5,.07,z*2.5],m.gold,16);}
 const bell=mesh(root,new THREE.ConeGeometry(.44,.62,simple?12:24,1,true),new THREE.MeshStandardMaterial({color:0x49413a,metalness:.65,roughness:.55,side:THREE.DoubleSide}),[0,.48,0]);bell.name='descent-engine-bell';
 cyl(root,.25,.11,[0,.86,0],m.dark);for(const x of[-.70,.70])for(const z of[-.45,.45])box(root,[.31,.17,.33],[x,1.84,z],m.dark);
 // Low stage attachment fittings replace the absent crew cabin.
 for(let i=0;i<4;i++){const t=i*TAU/4;rod(root,[Math.cos(t)*.65,1.79,Math.sin(t)*.65],[Math.cos(t)*.65,2.03,Math.sin(t)*.65],.04,m.silver);}
 const ladder=new THREE.Group();ladder.position.set(1.37,1.27,0);ladder.rotation.y=Math.PI/2;root.add(ladder);for(const x of[-.15,.15])rod(ladder,[x,-.71,.36],[x,.57,0],.017,m.silver);for(let i=0;i<7;i++)rod(ladder,[-.15,-.63+i*.17,.34-i*.045],[.15,-.63+i*.17,.34-i*.045],.014,m.silver);
 anchor(root,0,[.8,1.4,.85]);anchor(root,1,[1.77,.47,1.77]);anchor(root,2,[0,.45,0]);return root;
}
function rtg(root,position,m,{simple=false}={}){const g=new THREE.Group();g.position.set(...position);root.add(g);cyl(g,.15,.42,[0,0,0],m.dark,simple?10:16);
 for(let i=0;i<(simple?6:10);i++){const t=i*TAU/(simple?6:10),fin=box(g,[.21,.43,.015],[Math.cos(t)*.19,0,Math.sin(t)*.19],m.silver);fin.rotation.y=-t;}
 const cover=box(g,[.58,.035,.53],[0,.28,0],m.white);cover.rotation.z=.10;return g;}
function viking({simple=false}={}){
 const root=new THREE.Group(),m=materials();root.name='Viking 2 lander original working-era illustration';legs(root,3,1.45,.88,m,{simple,angle:Math.PI/2});
 cyl(root,.93,.31,[0,.90,0],m.gold,6);cyl(root,.95,.035,[0,1.07,0],m.silver,6);
 for(const x of[-.95,.95])rtg(root,[x,1.10,-.26],m,{simple});
 camera(root,[-.28,1.38,.48],m,{simple});camera(root,[.28,1.38,.48],m,{simple});
 for(const x of[-.40,.40])box(root,[.31,.17,.29],[x,1.18,-.05],m.white);
 const arm=samplingArm(root,[.47,1.14,.20],1.18,m);arm.rotation.y=-.28;
 rod(root,[-.30,1.06,-.30],[-.30,1.65,-.30],.026,m.silver);dish(root,.30,[-.30,1.68,-.30],m,{simple,tilt:-.28});
 rod(root,[-.62,1.07,-.39],[-.62,2.06,-.39],.012,m.silver);rod(root,[-.62,1.68,-.39],[-.40,1.68,-.39],.009,m.silver);
 for(const z of[-.52,.52]){const tank=mesh(root,new THREE.SphereGeometry(.16,simple?10:16,10),m.white,[.45,.93,z]);tank.scale.set(1,1.25,1);}
 if(!simple){for(let i=0;i<3;i++)cyl(root,.08,.055,[-.42+i*.19,1.20,-.24],m.dark);for(const x of[-.30,.30])box(root,[.13,.009,.18],[x,1.095,.13],m.dark);}
 anchor(root,0,[-.28,1.49,.53]);anchor(root,1,[1.63,.85,.54]);anchor(root,2,[-1.02,1.19,-.26]);return root;
}
function triangle(root,radius,position,material){const shape=new THREE.Shape();shape.moveTo(0,radius);shape.lineTo(-radius*.866,-radius*.5);shape.lineTo(radius*.866,-radius*.5);shape.closePath();const m=mesh(root,new THREE.ShapeGeometry(shape),material,position);m.rotation.x=-Math.PI/2;return m;}
function pathfinder({simple=false}={}){
 const root=new THREE.Group(),m=materials();root.name='Mars Pathfinder unfolded petal lander original illustration';
 const center=triangle(root,.66,[0,.38,0],m.gold);center.material.side=THREE.DoubleSide;box(root,[.65,.25,.55],[0,.47,0],m.gold);
 const solarMaterial=new THREE.MeshStandardMaterial({color:0x17365d,metalness:.5,roughness:.5,side:THREE.DoubleSide});
 for(let i=0;i<3;i++){const t=i*TAU/3,petal=new THREE.Group();petal.position.set(Math.sin(t)*.86,.20,Math.cos(t)*.86);petal.rotation.y=t;root.add(petal);triangle(petal,.78,[0,0,0],m.silver);triangle(petal,.72,[0,.008,0],solarMaterial);
  for(let j=-2;j<=2;j++)rod(petal,[j*.16,.018,-.29],[j*.11,.018,.32],.003,m.silver);
  rod(root,[Math.sin(t)*.28,.40,Math.cos(t)*.28],[Math.sin(t)*.88,.22,Math.cos(t)*.88],.026,m.silver);
 }
 const cloth=matte(0xbdb6a0);for(let i=0;i<(simple?6:12);i++){const t=i*TAU/(simple?6:12),bag=mesh(root,new THREE.SphereGeometry(.30,simple?8:14,8),cloth,[Math.sin(t)*.92,.10,Math.cos(t)*.92]);bag.scale.set(1.5,.33,1);bag.rotation.y=t;}
 rod(root,[-.16,.57,0],[-.16,1.50,0],.028,m.silver);box(root,[.29,.18,.13],[-.16,1.55,0],m.white);for(const x of[-.24,-.08]){const eye=cyl(root,.045,.05,[x,1.56,.09],m.black);eye.rotation.x=Math.PI/2;}
 for(const z of[-.20,.22])box(root,[.24,.13,.20],[.17,.66,z],m.white);
 rod(root,[.23,.6,-.20],[.23,1.09,-.20],.014,m.silver);dish(root,.19,[.23,1.12,-.20],m,{simple,tilt:.18});
 const ramp=box(root,[.36,.025,.56],[0,.25,1.24],m.silver);ramp.rotation.x=.14;for(const x of[-.16,.16])rod(root,[x,.32,.98],[x,.21,1.51],.009,m.dark);
 anchor(root,0,[-.16,1.56,.1]);anchor(root,1,[0,.25,1.25]);anchor(root,2,[.78,.23,-.50]);return root;
}
function sojourner({simple=false}={}){
 const root=new THREE.Group(),m=materials();root.name='Sojourner six-wheel rover original working-era illustration';
 box(root,[.42,.17,.54],[0,.20,0],m.gold);panel(root,.48,.60,[0,.31,0],m,{simple});
 for(const side of[-1,1])for(const z of[-.23,0,.23]){const wheel=new THREE.Group();wheel.name=`drive-wheel-${side}-${z}`;wheel.position.set(side*.29,.078,z);root.add(wheel);const tire=cyl(wheel,.078,.067,[0,0,0],m.dark,simple?10:20);tire.rotation.z=Math.PI/2;const hub=cyl(wheel,.033,.071,[0,0,0],m.silver,12);hub.rotation.z=Math.PI/2;
  if(!simple)for(let j=0;j<12;j++){const t=j*TAU/12,cleat=box(wheel,[.072,.008,.018],[0,Math.cos(t)*.079,Math.sin(t)*.079],m.silver);cleat.rotation.x=t;}
  rod(root,[side*.17,.21,z*.7],[side*.29,.085,z],.011,m.silver);
 }
 for(const side of[-1,1]){rod(root,[side*.27,.14,-.23],[side*.27,.20,0],.012,m.silver);rod(root,[side*.27,.20,0],[side*.27,.14,.23],.012,m.silver);}
 for(const x of[-.105,.105]){box(root,[.105,.07,.06],[x,.235,.30],m.white);const lens=cyl(root,.024,.017,[x,.235,.338],m.black,12);lens.rotation.x=Math.PI/2;}
 box(root,[.10,.09,.055],[0,.145,-.30],m.silver);const sensor=cyl(root,.033,.03,[0,.142,-.34],m.dark,12);sensor.rotation.x=Math.PI/2;
 rod(root,[.12,.31,-.22],[.12,.47,-.22],.004,m.silver);
 anchor(root,0,[-.10,.24,.34]);anchor(root,1,[0,.14,-.34]);anchor(root,2,[0,.33,0]);return root;
}
function ingenuity({simple=false}={}){
 const root=new THREE.Group(),m=materials();root.name='Ingenuity Mars helicopter original working-era flight design illustration';
 box(root,[.16,.13,.15],[0,.18,0],m.gold);box(root,[.19,.025,.18],[0,.265,0],m.dark);
 for(const x of[-1,1])for(const z of[-1,1]){rod(root,[x*.065,.23,z*.06],[x*.24,.017,z*.22],.006,m.dark);rod(root,[x*.065,.23,z*.06],[x*.12,.17,z*.115],.009,m.silver);}
 rod(root,[0,.22,0],[0,.51,0],.010,m.dark);
 for(let level=0;level<2;level++){const rotor=new THREE.Group();rotor.name=`rotor-${level}`;rotor.position.y=.37+level*.07;rotor.rotation.y=level*Math.PI/2;root.add(rotor);box(rotor,[1.21,.006,.055],[0,0,0],m.dark);box(rotor,[.13,.015,.065],[0,.007,0],m.silver);
  if(!simple)for(const side of[-1,1]){const tip=box(rotor,[.09,.004,.036],[side*.55,.004,.004],m.copper);tip.rotation.y=side*.12;}
 }
 panel(root,.42,.34,[0,.515,0],m,{simple});rod(root,[-.17,.50,0],[.17,.50,0],.004,m.dark);
 box(root,[.035,.027,.025],[0,.105,.075],m.black);const cameraLens=cyl(root,.009,.008,[0,.104,.092],m.silver,10);cameraLens.rotation.x=Math.PI/2;
 anchor(root,0,[0,.12,.085]);anchor(root,1,[.40,.44,0]);anchor(root,2,[0,.535,0]);return root;
}
function polarLander({simple=false}={}){
 const root=new THREE.Group(),m=materials();root.name='Mars Polar Lander original planned deployed design illustration — resting place unknown';
 legs(root,3,1.13,.85,m,{simple,angle:Math.PI/2});cyl(root,.72,.25,[0,.91,0],m.gold,6);cyl(root,.73,.025,[0,1.05,0],m.silver,6);
 // MPL used rectangular folding arrays; Phoenix's later fan-like arrays differ.
 for(const side of[-1,1]){rod(root,[side*.57,.96,0],[side*1.60,.98,0],.023,m.silver);for(let j=0;j<2;j++)panel(root,.59,1.12,[side*(1.04+j*.61),.99,0],m,{simple});}
 for(const z of[-.30,.31])box(root,[.45,.22,.25],[-.10,1.18,z],m.white);
 rod(root,[-.36,1.07,.23],[-.36,1.94,.23],.025,m.silver);box(root,[.25,.13,.14],[-.36,2.02,.23],m.white);for(const x of[-.43,-.29]){const eye=cyl(root,.036,.06,[x,2.02,.32],m.dark,12);eye.rotation.x=Math.PI/2;}
 const arm=samplingArm(root,[.45,1.12,.35],1.10,m);arm.rotation.y=-.30;
 box(root,[.38,.10,.48],[.24,1.12,-.12],m.white);for(let i=0;i<6;i++)box(root,[.06,.02,.08],[.11+(i%3)*.09,1.18,-.23+Math.floor(i/3)*.18],m.silver);
 rod(root,[.32,1.08,-.35],[.32,1.46,-.35],.016,m.silver);dish(root,.20,[.32,1.49,-.35],m,{simple,tilt:.20});
 rod(root,[-.50,1.07,-.28],[-.50,1.63,-.28],.012,m.silver);for(const y of[1.32,1.48,1.61])box(root,[.13,.035,.13],[-.50,y,-.28],m.white);
 anchor(root,0,[-.36,2.02,.32]);anchor(root,1,[1.50,.85,.67]);anchor(root,2,[-1.48,1.02,0]);return root;
}
export function createCollectionModel(type,options={}){
 let root;
 if(/^surveyor[1567]$/.test(type))root=surveyor(type,options);
 else if(type==='falcon')root=falcon(options);
 else if(type==='viking2')root=viking(options);
 else if(type==='pathfinder')root=pathfinder(options);
 else if(type==='sojourner')root=sojourner(options);
 else if(type==='ingenuity')root=ingenuity(options);
 else if(type==='polarlander')root=polarLander(options);
 else throw new Error(`Unknown collection illustration: ${type}`);
 root.userData.specs=collectionModelSpecs[type];root.userData.originalIllustration=true;root.userData.presentDayScan=false;root.userData.scale='approximate metres; not calibrated';return root;
}
