// A compact educational expedition, not a reconstruction of real site spacing.
export const surfaceBounds=105;
export function surfaceHeight(world,x,z){
 const waves=Math.sin(x*.048)*.55+Math.cos(z*.055)*.42+Math.sin((x+z)*.11)*.16;
 const crater=(cx,cz,r)=>{const d=Math.hypot(x-cx,z-cz)/r;return -1.5*Math.exp(-d*d*3)+.6*Math.exp(-Math.pow(d-1,2)*25);};
 return waves+(world==='Moon'?crater(31,-60,18)+crater(-65,15,22):Math.sin(z*.024+x*.018)*.65);
}
export function surfaceSites(artifacts,world){
 const positions=[[0,-10],[-22,-18],[22,-18],[-42,-43],[0,-48],[42,-43],[-45,-78],[-15,-86],[15,-86],[45,-78]];
 return artifacts.filter(a=>a.world===world).map((artifact,i)=>{const [x,z]=positions[i]||[Math.cos(i)*65,-45+Math.sin(i)*35];return {artifact,x,z,y:surfaceHeight(world,x,z)};});
}
export function modelSpan(artifact){
 if(['eagle','falcon'].includes(artifact.id))return 9.4;
 if(artifact.id==='reflector')return .65;
 if(artifact.id==='sojourner')return .75;
 if(artifact.id==='ingenuity')return 1.25;
 if(artifact.id==='alsep12')return 6;
 if(['insight','phoenix','polarlander'].includes(artifact.id))return 5.6;
 return artifact.world==='Moon'?3.8:3.1;
}
export function advanceWalker(state,input,delta,{world,obstacles=[]}){
 const dt=Math.max(0,Math.min(.1,delta)),yaw=state.yaw+(input.lookX||0)*dt*1.45,pitch=Math.max(-1.15,Math.min(1.15,state.pitch+(input.lookY||0)*dt*1.1));
 let forward=input.forward||0,right=input.right||0;const length=Math.hypot(forward,right);if(length>1){forward/=length;right/=length;}
 const speed=(input.sprint?6:3.4)*dt;
 let x=state.x+(-Math.sin(yaw)*forward+Math.cos(yaw)*right)*speed,z=state.z+(-Math.cos(yaw)*forward-Math.sin(yaw)*right)*speed;
 for(const site of obstacles){const dx=x-site.x,dz=z-site.z,d=Math.hypot(dx,dz),radius=site.radius||1.2;if(d<radius){x=site.x+(d?dx/d:0)*radius;z=site.z+(d?dz/d:1)*radius;}}
 x=Math.max(-surfaceBounds,Math.min(surfaceBounds,x));z=Math.max(-surfaceBounds,Math.min(surfaceBounds,z));
 return {x,z,yaw,pitch,y:surfaceHeight(world,x,z)+1.65};
}
