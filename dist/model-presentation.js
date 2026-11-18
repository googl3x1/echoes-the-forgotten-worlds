import * as THREE from 'three';

function foilTexture(){
 const canvas=document.createElement('canvas');canvas.width=canvas.height=128;const ctx=canvas.getContext('2d');
 ctx.fillStyle='#888';ctx.fillRect(0,0,128,128);let seed=149;
 const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
 for(let i=0;i<230;i++){const x=random()*128,y=random()*128;ctx.strokeStyle=`rgba(${random()>.5?'255,255,255':'0,0,0'},${.06+random()*.1})`;ctx.lineWidth=.4+random()*.8;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+(random()-.5)*32,y+(random()-.5)*32);ctx.stroke();}
 const texture=new THREE.CanvasTexture(canvas);texture.wrapS=texture.wrapT=THREE.RepeatWrapping;return texture;
}

export function enhanceModel(root,id,renderer){
 let foil;const adjusted=new Set();
 root.traverse(mesh=>{
  if(!mesh.isMesh)return;mesh.castShadow=true;mesh.receiveShadow=true;
  for(const m of(Array.isArray(mesh.material)?mesh.material:[mesh.material])){
   if(m.map)m.map.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
   if(id==='eagle'&&/blinn(1SG|9SG)/.test(m.name)){if(!mesh.geometry.attributes.uv){const p=mesh.geometry.attributes.position,n=mesh.geometry.attributes.normal,uv=[];for(let i=0;i<p.count;i++){const nx=Math.abs(n?.getX(i)||0),ny=Math.abs(n?.getY(i)||0),nz=Math.abs(n?.getZ(i)||0);uv.push((nx>ny&&nx>nz?p.getZ(i):p.getX(i))*.5,(ny>nx&&ny>nz?p.getZ(i):p.getY(i))*.5);}mesh.geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));}}
   if(adjusted.has(m))continue;adjusted.add(m);
   // Preserve NASA's color maps and geometry. Correct only the imported LM's
   // matte foil treatment, without making its dark insulation metallic.
   if(id==='eagle'&&/blinn(1SG\.002|9SG\.001|4SG\.002|3SG\.001)$/.test(m.name)){
    const gold=/blinn(1SG|9SG)/.test(m.name);
    m.metalness=gold ? .82 : .72;m.roughness=gold ? .36 : .4;
    if(!m.map)m.color.setHex(gold ? 0xc39846 : 0xb0b4b8);
    if(gold){

     foil ||= foilTexture();m.bumpMap=foil;m.bumpScale=.035;
    }
   }
  }
 });
}

export function createTerrain(scene,{world,floorY,renderer}){
 const mars=world==='Mars';let seed=37;const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
 const canvas=document.createElement('canvas');canvas.width=canvas.height=256;const ctx=canvas.getContext('2d'),pixels=ctx.createImageData(256,256);
 for(let i=0;i<pixels.data.length;i+=4){const n=random()*26;pixels.data[i]=(mars?113:91)+n;pixels.data[i+1]=(mars?71:89)+n;pixels.data[i+2]=(mars?45:85)+n;pixels.data[i+3]=255;}ctx.putImageData(pixels,0,0);
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.repeat.set(6,6);texture.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());
 const alphaCanvas=document.createElement('canvas');alphaCanvas.width=alphaCanvas.height=128;const a=alphaCanvas.getContext('2d'),gradient=a.createRadialGradient(64,64,30,64,64,64);gradient.addColorStop(0,'white');gradient.addColorStop(.7,'#eeeeee');gradient.addColorStop(1,'black');a.fillStyle=gradient;a.fillRect(0,0,128,128);const alpha=new THREE.CanvasTexture(alphaCanvas);
 const geometry=new THREE.PlaneGeometry(9,9,50,50),positions=geometry.attributes.position;
 for(let i=0;i<positions.count;i++){const r=Math.hypot(positions.getX(i),positions.getY(i));positions.setZ(i,r<1.9?0:(random()-.5)*.055);}geometry.computeVertexNormals();
 const ground=new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({map:texture,bumpMap:texture,bumpScale:.013,alphaMap:alpha,transparent:true,roughness:1,metalness:0,depthWrite:false}));ground.rotation.x=-Math.PI/2;ground.position.y=floorY;ground.receiveShadow=true;scene.add(ground);
 for(let i=0;i<22;i++){const r=2.2+random()*1.7,theta=random()*Math.PI*2,size=.018+random()*.07;const stone=new THREE.Mesh(new THREE.DodecahedronGeometry(size,0),new THREE.MeshStandardMaterial({color:mars?0x705044:0x676866,roughness:1}));stone.scale.set(1+random(),.4+random()*.5,1+random());stone.rotation.set(random(),random(),random());stone.position.set(Math.cos(theta)*r,floorY+size*.35,Math.sin(theta)*r);stone.castShadow=true;stone.receiveShadow=true;scene.add(stone);}
}

export function createDescentMarker(){
 const root=new THREE.Group(),gold=new THREE.MeshStandardMaterial({color:0xc19a42,metalness:.65,roughness:.46,bumpMap:foilTexture(),bumpScale:.002}),silver=new THREE.MeshStandardMaterial({color:0xbcc1c4,metalness:.6,roughness:.38}),dark=new THREE.MeshStandardMaterial({color:0x292727,roughness:.9});
 const body=new THREE.Mesh(new THREE.CylinderGeometry(.14,.14,.13,8),gold);body.position.y=.075;root.add(body);
 const deck=new THREE.Mesh(new THREE.CylinderGeometry(.132,.132,.012,8),dark);deck.position.y=.147;root.add(deck);
 function strut(from,to,radius=.004){const start=new THREE.Vector3(...from),end=new THREE.Vector3(...to),mesh=new THREE.Mesh(new THREE.CylinderGeometry(radius,radius,start.distanceTo(end),7),silver);mesh.position.copy(start).lerp(end,.5);mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),end.sub(start).normalize());root.add(mesh);}
 for(let i=0;i<4;i++){const angle=Math.PI/4+i*Math.PI/2,x=Math.cos(angle),z=Math.sin(angle);strut([x*.09,.12,z*.09],[x*.24,-.035,z*.24],.005);strut([x*.13,.015,z*.13],[x*.225,-.02,z*.225],.003);const foot=new THREE.Mesh(new THREE.CylinderGeometry(.04,.035,.009,18),silver);foot.position.set(x*.24,-.04,z*.24);root.add(foot);}
 for(const x of[-.022,.022])strut([x,.14,.146],[x,-.035,.2],.0025);
 for(let i=0;i<6;i++){const y=.13-i*.03;strut([-.022,y,.15+(.13-y)*.3],[.022,y,.15+(.13-y)*.3],.002);}
 const bell=new THREE.Mesh(new THREE.ConeGeometry(.032,.065,12,1,true),dark);bell.rotation.z=Math.PI;bell.position.y=-.005;root.add(bell);return root;
}
