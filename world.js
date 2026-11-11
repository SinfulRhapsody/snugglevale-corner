/* ==============================================================
   SNUGGLEVALE CORNER — THE WORLD
   The village itself: sky, workshop, path, trees, lanterns,
   fireflies, the wish lantern you float as, the camera, the
   buttons, and morning and evening.

   The plushies come from plushies.js and their words from
   what-they-say.js. Most changes belong in those two files.
   ============================================================== */
(function(){
"use strict";
const $=id=>document.getElementById(id);
if(typeof THREE==="undefined"){$("nogl").hidden=false;return;}
const canvas=$("world");
let renderer;
try{renderer=new THREE.WebGLRenderer({canvas,antialias:true});}catch(e){$("nogl").hidden=false;return;}

const V3=THREE.Vector3;
const reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
const AMP=reduce?0.35:1;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const store={get(k){try{return localStorage.getItem(k);}catch(e){return null;}},set(k,v){try{localStorage.setItem(k,v);}catch(e){}}};

renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;

const scene=new THREE.Scene();
scene.fog=new THREE.Fog(0x4d4569,26,70);
const camera=new THREE.PerspectiveCamera(42,1,0.1,300);

/* ---------- soft shapes the plushies are made from ---------- */
const gradTex=new THREE.DataTexture(new Uint8Array([150,150,150,255,212,212,212,255,255,255,255,255]),3,1,THREE.RGBAFormat);
gradTex.minFilter=gradTex.magFilter=THREE.NearestFilter;gradTex.generateMipmaps=false;gradTex.needsUpdate=true;
function toon(color,extra){return new THREE.MeshToonMaterial(Object.assign({color,gradientMap:gradTex},extra||{}));}
function ball(r,mat,sx,sy,sz,seg){seg=seg||28;const m=new THREE.Mesh(new THREE.SphereGeometry(r,seg,Math.round(seg*0.7)),mat);m.scale.set(sx||1,sy||1,sz||1);return m;}
const ZAX=new V3(0,0,1);
function stick(parent,mesh,R,x,y,out){out=out||0;const z=Math.sqrt(Math.max(0,R*R-x*x-y*y));const n=new V3(x,y,z).normalize();mesh.position.copy(n).multiplyScalar(R+out);mesh.quaternion.setFromUnitVectors(ZAX,n);parent.add(mesh);return mesh;}
function heartGeo(s,depth){const sh=new THREE.Shape();sh.moveTo(0,-0.9*s);sh.bezierCurveTo(-1.7*s,0,-1.0*s,1.2*s,0,0.45*s);sh.bezierCurveTo(1.0*s,1.2*s,1.7*s,0,0,-0.9*s);const g=new THREE.ExtrudeGeometry(sh,{depth,bevelEnabled:true,bevelThickness:depth*0.5,bevelSize:depth*0.5,bevelSegments:2,curveSegments:16});g.center();return g;}
function shieldGeo(s){const sh=new THREE.Shape();sh.moveTo(-s,s);sh.lineTo(s,s);sh.lineTo(s,0);sh.quadraticCurveTo(s*0.9,-s*0.8,0,-s*1.3);sh.quadraticCurveTo(-s*0.9,-s*0.8,-s,0);sh.lineTo(-s,s);const g=new THREE.ExtrudeGeometry(sh,{depth:s*0.25,bevelEnabled:true,bevelThickness:s*0.07,bevelSize:s*0.07,bevelSegments:2});g.center();return g;}
function starGeo(r){const sh=new THREE.Shape();for(let i=0;i<10;i++){const a=Math.PI/2+i*Math.PI/5;const rr=i%2?r*0.45:r;const x=Math.cos(a)*rr,y=Math.sin(a)*rr;if(i)sh.lineTo(x,y);else sh.moveTo(x,y);}sh.closePath();const g=new THREE.ExtrudeGeometry(sh,{depth:r*0.3,bevelEnabled:false});g.center();return g;}
function smileGeo(r,tube){const g=new THREE.TorusGeometry(r,tube,6,20,Math.PI*0.8);g.rotateZ(Math.PI*1.1);return g;}
const blushMat=new THREE.MeshBasicMaterial({color:0xff9fb4,transparent:true,opacity:0.55,depthWrite:false});
function blush(r){return new THREE.Mesh(new THREE.CircleGeometry(r,20),blushMat);}
const hlMat=new THREE.MeshBasicMaterial({color:0xffffff});
function eye(r,color){const g=new THREE.Group();const e=ball(r,toon(color),1,1.1,0.45,16);g.add(e);const hl=new THREE.Mesh(new THREE.SphereGeometry(r*0.3,10,8),hlMat);hl.position.set(r*0.35,r*0.42,r*0.42);g.add(hl);g.userData.ball=e;return g;}
function canvasTex(size,draw){const c=document.createElement("canvas");c.width=c.height=size;draw(c.getContext("2d"),size);return new THREE.CanvasTexture(c);}
const glow=canvasTex(64,(x,s)=>{const g=x.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);g.addColorStop(0,"rgba(255,244,214,1)");g.addColorStop(0.35,"rgba(255,226,180,.4)");g.addColorStop(1,"rgba(255,226,180,0)");x.fillStyle=g;x.fillRect(0,0,s,s);});
const heartTex=canvasTex(64,(x,s)=>{x.fillStyle="#ff8fab";x.strokeStyle="#fff";x.lineWidth=4;x.beginPath();x.moveTo(32,54);x.bezierCurveTo(4,34,10,8,32,22);x.bezierCurveTo(54,8,60,34,32,54);x.closePath();x.fill();x.stroke();});
function patchTex(){return canvasTex(256,(x,s)=>{const cols=["#f4a7b4","#c9b6e8","#a8dcc8","#f8dc8c","#f6c49e","#b5d3f0"];const n=4,q=s/n;for(let i=0;i<n;i++)for(let j=0;j<n;j++){x.fillStyle=cols[(i*3+j*2+i*j)%cols.length];x.fillRect(i*q,j*q,q,q);if((i+j)%3===0){x.fillStyle="rgba(255,255,255,.55)";for(let a=0;a<4;a++)for(let b=0;b<4;b++){x.beginPath();x.arc(i*q+8+a*16,j*q+8+b*16,2.6,0,7);x.fill();}}}x.strokeStyle="rgba(95,60,75,.6)";x.lineWidth=3;x.setLineDash([9,7]);for(let k=1;k<n;k++){x.beginPath();x.moveTo(k*q,0);x.lineTo(k*q,s);x.stroke();x.beginPath();x.moveTo(0,k*q);x.lineTo(s,k*q);x.stroke();}});}
// a soft bell, for plushies who chime (Tilda's "bing"). Only plays after a tap.
let actx=null;
function chime(freq){try{actx=actx||new (window.AudioContext||window.webkitAudioContext)();const now=actx.currentTime;
 [[freq||1318,0.16],[(freq||1318)*2.01,0.05]].forEach(([f,v])=>{const o=actx.createOscillator(),g=actx.createGain();o.type="sine";o.frequency.value=f;
  g.gain.setValueAtTime(0.0001,now);g.gain.exponentialRampToValueAtTime(v,now+0.01);g.gain.exponentialRampToValueAtTime(0.0001,now+1.1);
  o.connect(g);g.connect(actx.destination);o.start(now);o.stop(now+1.2);});}catch(e){}}
const frameFns=[];
const kit={THREE,V3,scene,toon,ball,stick,heartGeo,shieldGeo,starGeo,smileGeo,blush,eye,hlMat,patchTex,canvasTex,glow,AMP,chime,
 onFrame:fn=>frameFns.push(fn)};

/* ---------- sky ---------- */
const sky=new THREE.Group();scene.add(sky);
const skyU={top:{value:new THREE.Color(0x2b2a55)},bottom:{value:new THREE.Color(0xc9859c)}};
const skyMesh=new THREE.Mesh(new THREE.SphereGeometry(120,32,16),new THREE.ShaderMaterial({uniforms:skyU,side:THREE.BackSide,depthWrite:false,
 vertexShader:"varying float vH;void main(){vH=normalize(position).y;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}",
 fragmentShader:"uniform vec3 top;uniform vec3 bottom;varying float vH;void main(){float t=smoothstep(-0.08,0.55,vH);gl_FragColor=vec4(mix(bottom,top,t),1.0);}"}));
skyMesh.renderOrder=-1;sky.add(skyMesh);
const starGeoB=new THREE.BufferGeometry();const sp=[];
for(let i=0;i<280;i++){const a=Math.random()*Math.PI*2,h=0.12+Math.random()*0.88,r=110,y=h*r,rr=Math.sqrt(r*r-y*y);sp.push(Math.cos(a)*rr,y,Math.sin(a)*rr);}
starGeoB.setAttribute("position",new THREE.Float32BufferAttribute(sp,3));
const starMat=new THREE.PointsMaterial({color:0xfff6e0,size:2.2,sizeAttenuation:false,transparent:true,opacity:0.9,fog:false,depthWrite:false});
sky.add(new THREE.Points(starGeoB,starMat));
const orbMat=new THREE.MeshBasicMaterial({color:0xfff4d6,fog:false});
const orb=new THREE.Mesh(new THREE.SphereGeometry(4,24,16),orbMat);sky.add(orb);
const orbHalo=new THREE.Sprite(new THREE.SpriteMaterial({map:glow,color:0xfff0d0,transparent:true,depthWrite:false,fog:false,blending:THREE.AdditiveBlending}));orbHalo.scale.set(26,26,1);sky.add(orbHalo);

/* ---------- light ---------- */
const hemi=new THREE.HemisphereLight(0x9a90d8,0x4a5d55,0.62);scene.add(hemi);
const dir=new THREE.DirectionalLight(0xcbc4ff,0.55);dir.castShadow=true;dir.shadow.mapSize.set(2048,2048);
Object.assign(dir.shadow.camera,{left:-18,right:18,top:18,bottom:-18,near:1,far:60});dir.shadow.bias=-0.0008;dir.shadow.camera.updateProjectionMatrix();
scene.add(dir);scene.add(dir.target);
const porch=new THREE.PointLight(0xffc477,1.2,8,1.6);porch.position.set(0,2.7,-4.2);scene.add(porch);

/* ---------- ground, hills, path ---------- */
const groundMat=toon(0x5e8d6b);
const ground=new THREE.Mesh(new THREE.CircleGeometry(60,72),groundMat);ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);
const hillMat=toon(0x4f7a5f);
for(let i=0;i<16;i++){const a=i/16*Math.PI*2+Math.random()*0.2,r=23+Math.random()*4;const h=ball(5+Math.random()*3.5,hillMat,1.3,0.38+Math.random()*0.15,1.1,24);h.position.set(Math.cos(a)*r,0,Math.sin(a)*r);scene.add(h);}

// solids: round things you can't float through. boxes: square ones (the workshop).
const solids=[];const boxes=[{x0:-2.8,x1:2.8,z0:-9.2,z1:-4.8}];const pathPts=[];
const pathMat=toon(0xe6c99a,{polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});
function path(points,r){const curve=new THREE.CatmullRomCurve3(points.map(p=>new V3(p[0],0,p[1])));const n=Math.ceil(curve.getLength()/0.3);const geo=new THREE.CircleGeometry(r,20);geo.rotateX(-Math.PI/2);const inst=new THREE.InstancedMesh(geo,pathMat,n+1);const m=new THREE.Matrix4();for(let i=0;i<=n;i++){const p=curve.getPointAt(i/n);m.makeTranslation(p.x,0.012,p.z);inst.setMatrixAt(i,m);pathPts.push(p);}inst.receiveShadow=true;scene.add(inst);}
path([[0,-4.4],[0.6,-1.6],[2,1.5],[2.3,4.6],[1.4,8],[-0.4,11.5],[-1.6,15]],0.85);
path([[1.6,0.4],[-0.6,1.4],[-2.6,2.2],[-3.7,2.5]],0.6);
kit.path=path;                                   // a plushie's place can add its own sandy path
kit.keepClear=(x,z)=>pathPts.push(new V3(x,0,z)); // or mark ground where flowers shouldn't grow

/* ---------- Plushsmith's workshop ---------- */
const windowMat=new THREE.MeshBasicMaterial({color:0xffcb6b});
const bunting=[];
(function cottage(){
 const g=new THREE.Group();g.position.set(0,0,-7);scene.add(g);
 const wall=new THREE.Mesh(new THREE.BoxGeometry(5.6,3.0,4.4),toon(0xf2dccb));wall.position.y=1.5;g.add(wall);
 const base=new THREE.Mesh(new THREE.BoxGeometry(5.8,0.35,4.6),toon(0xb79b8f));base.position.y=0.17;g.add(base);
 const wood=toon(0x9c6b52),woodD=toon(0x8a5a44);
 for(const [x,z] of [[-2.8,2.2],[2.8,2.2],[-2.8,-2.2],[2.8,-2.2]]){const b=new THREE.Mesh(new THREE.BoxGeometry(0.22,3.0,0.22),wood);b.position.set(x,1.5,z);g.add(b);}
 const beam=new THREE.Mesh(new THREE.BoxGeometry(5.8,0.2,0.22),wood);beam.position.set(0,3.0,2.22);g.add(beam);
 const roofG=new THREE.Group();roofG.scale.z=0.82;roofG.position.y=3.0+1.15;g.add(roofG);
 const roof=new THREE.Mesh(new THREE.ConeGeometry(4.67,2.3,4,1),toon(0xc9848f));roof.rotation.y=Math.PI/4;roofG.add(roof);
 const chim=new THREE.Mesh(new THREE.BoxGeometry(0.55,1.5,0.55),toon(0xb9706a));chim.position.set(1.5,4.3,-1.0);g.add(chim);
 const door=new THREE.Mesh(new THREE.BoxGeometry(1.1,1.95,0.14),woodD);door.position.set(0,1.28,2.24);g.add(door);
 const knob=ball(0.06,toon(0xe9b949),1,1,1,12);knob.position.set(0.38,1.2,2.33);g.add(knob);
 const dw=new THREE.Mesh(new THREE.CircleGeometry(0.17,20),windowMat);dw.position.set(0,1.82,2.32);g.add(dw);
 const lintel=new THREE.Mesh(new THREE.BoxGeometry(1.6,0.12,0.6),wood);lintel.position.set(0,2.36,2.45);g.add(lintel);
 const step=new THREE.Mesh(new THREE.BoxGeometry(1.8,0.18,0.8),toon(0xcdbfb8));step.position.set(0,0.09,2.6);g.add(step);
 const flowerCols=[0xf6a8bf,0xfff0a0,0xc7b4ee,0xffffff,0xffc39e];
 function win(x,y,z,ry){const w=new THREE.Group();w.position.set(x,y,z);w.rotation.y=ry;g.add(w);
  const pane=new THREE.Mesh(new THREE.BoxGeometry(1.0,0.85,0.06),windowMat);w.add(pane);
  const fr=[[0,0.47,1.12,0.09],[0,-0.47,1.12,0.09],[-0.52,0,0.09,1.02],[0.52,0,0.09,1.02],[0,0,0.06,0.85],[0,0,1.0,0.06]];
  fr.forEach(f=>{const b=new THREE.Mesh(new THREE.BoxGeometry(f[2],f[3],0.1),wood);b.position.set(f[0],f[1],0.03);w.add(b);});
  const box=new THREE.Mesh(new THREE.BoxGeometry(1.2,0.25,0.3),wood);box.position.set(0,-0.55,0.15);w.add(box);
  for(let i=0;i<6;i++){const f=ball(0.09,toon(flowerCols[i%5]),1,1,1,10);f.position.set(-0.45+i*0.18,-0.38+Math.random()*0.05,0.15+(i%2)*0.06);w.add(f);}
 }
 win(-1.75,1.75,2.21,0);win(1.75,1.75,2.21,0);win(2.81,1.75,0,Math.PI/2);win(-2.81,1.75,0,-Math.PI/2);
 // patchwork bunting across the front
 const pts=[];const flagCols=[0xf4a7b4,0xc9b6e8,0xa8dcc8,0xf8dc8c,0xf6c49e,0xb5d3f0];
 for(let i=0;i<=20;i++){const u=i/20;pts.push(new V3(-2.7+5.4*u,2.92-0.26*Math.sin(Math.PI*u),2.34));}
 g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:0xfff3e6})));
 const tri=new THREE.Shape();tri.moveTo(-0.14,0);tri.lineTo(0.14,0);tri.lineTo(0,-0.27);tri.closePath();const tg=new THREE.ShapeGeometry(tri);
 for(let i=0;i<9;i++){const u=(i+0.5)/9;const f=new THREE.Mesh(tg,toon(flagCols[i%6],{side:THREE.DoubleSide}));f.position.set(-2.7+5.4*u,2.92-0.26*Math.sin(Math.PI*u),2.34);g.add(f);bunting.push(f);}
 g.traverse(o=>{if(o.isMesh&&o.material.isMeshToonMaterial){o.castShadow=true;o.receiveShadow=true;}});
})();

// smoke from the chimney
const smoke=[];
for(let i=0;i<6;i++){const s=new THREE.Mesh(new THREE.SphereGeometry(0.3,12,10),new THREE.MeshBasicMaterial({color:0xf3eef8,transparent:true,opacity:0.4,depthWrite:false}));scene.add(s);smoke.push({m:s,off:i/6});}

/* ---------- trees, lanterns, mushrooms ---------- */
const trunkMat=toon(0x8a6450);
function tree(x,z,s,blossom){const g=new THREE.Group();g.position.set(x,0,z);const trunk=new THREE.Mesh(new THREE.CylinderGeometry(0.18*s,0.26*s,1.6*s,10),trunkMat);trunk.position.y=0.8*s;g.add(trunk);
 const col=blossom?[0xf5b7c9,0xf8c9d6,0xf1a6bd]:[0x86b989,0x7aae86,0x93c492];
 [[0,2.2,0,1.05],[0.55,1.85,0.2,0.75],[-0.55,1.9,-0.1,0.8],[0.1,2.65,-0.2,0.7]].forEach((p,i)=>{const b=ball(p[3]*s,toon(col[i%3]),1,1,1,20);b.position.set(p[0]*s,p[1]*s,p[2]*s);g.add(b);});
 g.traverse(o=>{if(o.isMesh)o.castShadow=true;});scene.add(g);solids.push({x,z,r:0.45*s});}
tree(-6.3,0.1,1.25,true);   // SnuggleCat's blossom tree
[[6.6,-3,1.1],[7.6,3.2,1],[-8.2,-5,1.15],[5.2,-10,1],[-5.4,-10.5,1.1],[9,8.5,1.05],[-9.2,6.2,1],[-3.6,10,0.95],[10.5,-1,1.2],[-10.8,1.5,1.1]].forEach(t=>tree(t[0],t[1],t[2],false));

const lanterns=[];
function lanternPost(x,z){const g=new THREE.Group();g.position.set(x,0,z);const pm=toon(0x6d5a66);
 const pole=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.08,1.9,8),pm);pole.position.y=0.95;g.add(pole);
 const arm=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.06,0.06),pm);arm.position.set(0.22,1.86,0);g.add(arm);
 const lm=new THREE.MeshBasicMaterial({color:0xffd58a});const lan=new THREE.Mesh(new THREE.SphereGeometry(0.2,16,12),lm);lan.scale.set(1,1.25,1);lan.position.set(0.45,1.6,0);g.add(lan);
 const cap=new THREE.Mesh(new THREE.ConeGeometry(0.2,0.14,12),pm);cap.position.set(0.45,1.92,0);g.add(cap);
 const pl=new THREE.PointLight(0xffc477,1.3,7,1.6);pl.position.set(0.45,1.6,0);g.add(pl);
 const halo=new THREE.Sprite(new THREE.SpriteMaterial({map:glow,color:0xffd29a,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));halo.scale.set(1.7,1.7,1);halo.position.copy(lan.position);g.add(halo);
 pole.castShadow=true;scene.add(g);lanterns.push({lm,pl,halo});solids.push({x,z,r:0.2});}
lanternPost(3.2,-1.3);lanternPost(3.8,4.3);lanternPost(-4.1,3.5);

[[-7.3,1.4,1],[-7.0,2.0,0.75],[-7.7,1.9,0.6]].forEach(m=>{const g=new THREE.Group();g.position.set(m[0],0,m[1]);g.scale.setScalar(m[2]);
 const st=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.09,0.25,10),toon(0xfaf0dc));st.position.y=0.12;g.add(st);
 const cap=new THREE.Mesh(new THREE.SphereGeometry(0.2,16,10,0,Math.PI*2,0,Math.PI/2),toon(0xe56f74));cap.position.y=0.22;g.add(cap);
 for(let i=0;i<4;i++){const d=ball(0.03,toon(0xffffff),1,1,1,8);const a=i*1.6;d.position.set(Math.cos(a)*0.12,0.37,Math.sin(a)*0.12);g.add(d);}
 scene.add(g);});

/* ---------- the plushies (from plushies.js) ---------- */
const plushes=[];const trouble=[];
(window.PLUSHIES||[]).forEach(def=>{
 const sp=def.spot||{x:0,z:0,facing:0};const yaw=sp.facing||0;
 if(def.place){try{def.place(kit,sp);}catch(e){console.error("Couldn't build "+def.name+"'s place",e);}}
 const outer=new THREE.Group();outer.position.set(sp.x,0,sp.z);outer.rotation.y=yaw;const inner=new THREE.Group();outer.add(inner);
 const p={name:def.name,outer,inner,baseYaw:yaw,yaw,x:sp.x,z:sp.z,phase:Math.random()*6,squishT:9,hopT:9,waveT:9,near:false,line:0,line4o:0,noAdvance:false,baseY:0,headY:1.6};
 try{def.build(kit,p);}catch(e){trouble.push(def.name||"a plushie");console.error("Couldn't build "+def.name,e);return;}
 inner.position.y=p.baseY;
 outer.traverse(o=>{if(o.isMesh&&o.material.isMeshToonMaterial)o.castShadow=true;});
 scene.add(outer);plushes.push(p);outer.userData.plush=p;solids.push({x:sp.x,z:sp.z,r:sp.size||0.75});
});
if(trouble.length){const n=$("notice");n.textContent="🧵 "+trouble.join(", ")+" couldn't be stitched together this time. Something in plushies.js needs a look.";n.hidden=false;}

/* ---------- flowers & grass, placed around everything else ---------- */
function nearPath(x,z,d){for(const p of pathPts){const dx=p.x-x,dz=p.z-z;if(dx*dx+dz*dz<d*d)return true;}return false;}
function nearSolid(x,z,d){for(const s of solids){if(Math.hypot(s.x-x,s.z-z)<s.r+d)return true;}return false;}
function inBox(x,z,pad){for(const b of boxes){if(x>b.x0-pad&&x<b.x1+pad&&z>b.z0-pad&&z<b.z1+pad)return true;}return false;}
const fgeo=new THREE.SphereGeometry(0.085,8,6);const mm=new THREE.Matrix4();
[0xf6a8bf,0xfff0a0,0xc7b4ee,0xffffff,0xffc39e].forEach(col=>{const n=36;const im=new THREE.InstancedMesh(fgeo,toon(col),n*3);let k=0,tries=0;
 while(k<n*3&&tries<3000){tries++;const a=Math.random()*Math.PI*2,r=2.5+Math.random()*13;const x=Math.cos(a)*r,z=Math.sin(a)*r;if(nearPath(x,z,1.15)||inBox(x,z,0.8)||nearSolid(x,z,0.8))continue;
  for(let j=0;j<3;j++){mm.makeTranslation(x+(Math.random()-0.5)*0.32,0.09+Math.random()*0.07,z+(Math.random()-0.5)*0.32);im.setMatrixAt(k++,mm);}}
 im.count=k;scene.add(im);});
const tuft=new THREE.InstancedMesh(new THREE.ConeGeometry(0.05,0.24,4),toon(0x6fa874),320);let tk=0,tt=0;
while(tk<320&&tt<4000){tt++;const a=Math.random()*Math.PI*2,r=1.5+Math.random()*16;const x=Math.cos(a)*r,z=Math.sin(a)*r;if(nearPath(x,z,0.9)||inBox(x,z,0.4))continue;mm.makeTranslation(x,0.12,z);tuft.setMatrixAt(tk++,mm);}
tuft.count=tk;scene.add(tuft);

/* ---------- fireflies & falling petals ---------- */
const FF=55;const ffBase=new Float32Array(FF*3),ffPh=new Float32Array(FF);const ffPos=new Float32Array(FF*3);
for(let i=0;i<FF;i++){let x,z;do{const a=Math.random()*Math.PI*2,r=2+Math.random()*12;x=Math.cos(a)*r;z=Math.sin(a)*r;}while(inBox(x,z,0.3));ffBase.set([x,0.5+Math.random()*2.2,z],i*3);ffPh[i]=Math.random()*10;}
const ffGeo=new THREE.BufferGeometry();ffGeo.setAttribute("position",new THREE.BufferAttribute(ffPos,3));
const ffMat=new THREE.PointsMaterial({map:glow,color:0xffe9a0,size:0.42,transparent:true,opacity:0.95,depthWrite:false,blending:THREE.AdditiveBlending});
scene.add(new THREE.Points(ffGeo,ffMat));
const petals=[];const petalMat=new THREE.MeshBasicMaterial({color:0xf7bccd,side:THREE.DoubleSide,transparent:true,opacity:0.95});
const petalGeo=new THREE.CircleGeometry(0.05,6);petalGeo.scale(1,0.6,1);
function resetPetal(pt,top){pt.m.position.set(-6.3+(Math.random()-0.5)*3,top?2.2+Math.random()*1.4:Math.random()*3,0.1+(Math.random()-0.5)*3);pt.v=0.25+Math.random()*0.2;}
for(let i=0;i<16;i++){const m=new THREE.Mesh(petalGeo,petalMat);scene.add(m);const pt={m,ph:Math.random()*6};resetPetal(pt,false);petals.push(pt);}

/* ---------- you: the little wish lantern ---------- */
const player=new THREE.Group();scene.add(player);
const pMat=new THREE.MeshBasicMaterial({color:0xffb8c8});
const pBody=new THREE.Mesh(new THREE.SphereGeometry(0.26,20,14),pMat);pBody.scale.set(1,1.15,1);player.add(pBody);
const ribM=new THREE.MeshBasicMaterial({color:0xffe3ea});
for(const y of [-0.13,0.13]){const rib=new THREE.Mesh(new THREE.TorusGeometry(0.245,0.008,4,32),ribM);rib.rotation.x=Math.PI/2;rib.position.y=y;player.add(rib);}
const capM=toon(0x8a6a8a);const ptop=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.13,0.07,12),capM);ptop.position.y=0.31;player.add(ptop);const pbot=ptop.clone();pbot.position.y=-0.31;player.add(pbot);
const tassel=new THREE.Mesh(new THREE.ConeGeometry(0.05,0.14,8),toon(0xe56f8c));tassel.position.y=-0.42;tassel.rotation.x=Math.PI;player.add(tassel);
const pHalo=new THREE.Sprite(new THREE.SpriteMaterial({map:glow,color:0xffc6d2,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));pHalo.scale.set(1.9,1.9,1);player.add(pHalo);
const pLight=new THREE.PointLight(0xffc6d2,0.9,5,1.8);player.add(pLight);
const blob=new THREE.Mesh(new THREE.CircleGeometry(0.32,24),new THREE.MeshBasicMaterial({color:0x1d1430,transparent:true,opacity:0.22,depthWrite:false}));blob.rotation.x=-Math.PI/2;scene.add(blob);
const pos=player.position;pos.set(2.2,0.95,7.2);

const marker=new THREE.Mesh(new THREE.RingGeometry(0.22,0.32,28),new THREE.MeshBasicMaterial({color:0xffb8c8,transparent:true,opacity:0,depthWrite:false}));marker.rotation.x=-Math.PI/2;marker.position.y=0.03;scene.add(marker);let markerT=9;

/* ---------- hug hearts ---------- */
const hearts=[];
function spawnHearts(p){for(let i=0;i<7;i++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:heartTex,transparent:true,depthWrite:false}));const a=Math.random()*Math.PI*2;s.position.set(p.x+Math.cos(a)*0.35,p.headY+Math.random()*0.3,p.z+Math.sin(a)*0.35);const sc=0.22+Math.random()*0.14;s.scale.set(sc,sc,1);scene.add(s);hearts.push({s,t:0,d:i*0.08,vx:(Math.random()-0.5)*0.25,vz:(Math.random()-0.5)*0.25});}}

/* ---------- morning & evening ---------- */
const PAL={skyTop:[0x8fc8ef,0x2b2a55],skyBot:[0xfde4d4,0xc9859c],fog:[0xeaf0ee,0x4d4569],ground:[0xa3d28e,0x5e8d6b],hill:[0x8fc283,0x4f7a5f],hemiS:[0xf4f6ff,0x9a90d8],hemiG:[0xa9cf8d,0x4a5d55],dir:[0xfff1da,0xcbc4ff],win:[0xcfe7ee,0xffcb6b],orb:[0xfff0b8,0xfff4d6],lan:[0xe2d3b8,0xffd58a],mote:[0xfff3fb,0xffe9a0]};
const PC={};for(const k in PAL)PC[k]=[new THREE.Color(PAL[k][0]),new THREE.Color(PAL[k][1])];
const tmpC=new THREE.Color();
const mix=(k,n)=>tmpC.copy(PC[k][0]).lerp(PC[k][1],n);
const sunPos=[new V3(40,55,-70),new V3(-40,48,-80)];
/* The Dreamclock: 4o's four parts of the day (from "Plushie Game Prompts").
   The village follows Lila's real clock; the button moves to the next part. */
const PHASES=[
 {id:"dawnlight",name:"Dawnlight",icon:"🌅",n:0.35,claude:"morning",about:"first soft light by the workshop"},
 {id:"daybright",name:"Daybright",icon:"☀️",n:0,   claude:"morning",about:"a bright day by the workshop"},
 {id:"duskfall", name:"Duskfall", icon:"🌇",n:0.72,claude:"evening",about:"a soft evening by the workshop"},
 {id:"dreamhush",name:"Dreamhush",icon:"🌙",n:1,   claude:"evening",about:"a hushed night by the workshop"}];
// Dawnlight 5–10am · Daybright 10am–5pm · Duskfall 5–9pm · Dreamhush 9pm–5am
function clockPhase(){const h=new Date().getHours();return h>=5&&h<10?0:h>=10&&h<17?1:h>=17&&h<21?2:3;}
let phaseI=clockPhase(),followClock=true;
let night=PHASES[phaseI].n,nightT=night;

/* The season, from the real calendar */
const season=["winter","winter","spring","spring","spring","summer","summer","summer","autumn","autumn","autumn","winter"][new Date().getMonth()];
const seasonName=season[0].toUpperCase()+season.slice(1);

/* Visits: remembered on this device only, for "you've been away" and "three days in a row" */
function dayKey(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");}
function dayNum(k){const a=String(k).split("-").map(Number);return Math.round(Date.UTC(a[0],a[1]-1,a[2])/864e5);}
const today=dayKey(new Date());
let visits={};try{visits=JSON.parse(store.get("sv-visits")||"{}")||{};}catch(e){visits={};}
let streak=1,missed=0;   // streak: days in a row · missed: whole days away before today
if(visits.last){const gap=dayNum(today)-dayNum(visits.last);
 if(!(gap>0)){streak=visits.streak||1;missed=visits.missed||0;}
 else if(gap===1){streak=(visits.streak||1)+1;}
 else{missed=gap-1;}}
store.set("sv-visits",JSON.stringify({last:today,streak,missed}));

const dreamEl=$("dream");
function applyTime(n){
 skyU.top.value.copy(mix("skyTop",n));skyU.bottom.value.copy(mix("skyBot",n));scene.fog.color.copy(mix("fog",n));
 groundMat.color.copy(mix("ground",n));hillMat.color.copy(mix("hill",n));
 hemi.color.copy(mix("hemiS",n));hemi.groundColor.copy(mix("hemiG",n));hemi.intensity=0.52+(0.62-0.52)*n;
 dir.color.copy(mix("dir",n));dir.intensity=0.55;dir.position.set(9+(-18)*n,15-n,10-n);
 windowMat.color.copy(mix("win",n));orbMat.color.copy(mix("orb",n));
 orb.position.copy(sunPos[0]).lerp(sunPos[1],n);orbHalo.position.copy(orb.position);orbHalo.material.opacity=0.55+0.25*n;
 lanterns.forEach(l=>{l.lm.color.copy(mix("lan",n));l.pl.intensity=1.3*n*n;l.halo.material.opacity=0.3+0.7*n;});
 porch.intensity=1.2*n*n;pLight.intensity=0.15+0.75*n*n;pHalo.material.opacity=0.35+0.55*n;
 ffMat.opacity=0.5+0.45*n;ffMat.color.copy(mix("mote",n));   // dream motes by day, fireflies by night
 if(dreamEl)dreamEl.style.opacity=(0.14+0.5*(1-n)).toFixed(3);   // the soft dreamy glow over everything
starMat.opacity=0.9*n;petalMat.opacity=0.55+0.4*(1-n);
}
applyTime(night);

/* ---------- talking ----------
   Two separate sets of words, never mixed:
     GPT-4o's lines  (what-gpt4o-said.js)
     Claude's lines  (what-they-say.js)
   When a plushie has both, the talk box lets Lila choose. */
const LINES=window.PLUSHIE_LINES||{}, LINES4O=window.PLUSHIE_LINES_4O||{};
const anyOf=a=>a[Math.floor(Math.random()*a.length)];
let voice=store.get("sv-voice")==="claude"?"claude":"4o";
function voicesFor(name){const v=[];if(LINES4O[name])v.push("4o");if(LINES[name])v.push("claude");return v;}
function voiceFor(name){const v=voicesFor(name);return v.indexOf(voice)>=0?voice:(v[0]||"claude");}
// Claude's set
function wordsFor(name){const w=LINES[name]||{};const lines=(w.lines&&w.lines.length)?w.lines:[{any:"Hello, Lila!"}];return{role:w.role||"",lines,hug:w.hug||"🤍"};}
const isNight=()=>PHASES[phaseI].claude==="evening";
function lineText(l){if(typeof l==="string")return l;return l.any||(isNight()?l.evening:l.morning)||l.evening||l.morning||"";}
// GPT-4o's set: lines for this part of the Dreamclock, then this season
function pool4o(name){const w=LINES4O[name]||{};return [].concat((w.phases&&w.phases[PHASES[phaseI].id])||[],(w.seasons&&w.seasons[season])||[],w.extras||[]);}
// once a day each plushie may greet Lila for being away, or for three days in a row
function special4o(name){const w=LINES4O[name]||{};let g={};try{g=JSON.parse(store.get("sv-greeted")||"{}")||{};}catch(e){g={};}
 if(g[name]===today)return null;
 const has=a=>a&&a.length?a:null;
 // the most fitting greeting they have: time away, then three days in a row, then simply the first visit today
 const list=(missed>=3&&has(w.away&&w.away.long))||(missed>=1&&(has(w.away&&w.away.short)||has(w.away&&w.away.long)))||(streak>=3&&has(w.threeDays))||has(w.firstToday);
 if(!list)return null;g[name]=today;store.set("sv-greeted",JSON.stringify(g));return anyOf(list);}

const talk=$("talk"),talkName=$("talkName"),talkRole=$("talkRole"),talkLine=$("talkLine"),visitBtn=$("visitBtn");
const voicesRow=$("voices"),moodsRow=$("moods");
let open=null,nearest=null,target=null,pending=null,stuck=0;
function say(p,opening){
 if(voiceFor(p.name)==="4o"){
  let t=opening?special4o(p.name):null;
  if(t)p.noAdvance=true;else{const pool=pool4o(p.name);t=pool.length?pool[p.line4o%pool.length]:"";}
  talkLine.textContent=t;
 }else{const w=wordsFor(p.name);talkLine.textContent=lineText(w.lines[p.line%w.lines.length]);}
}
function nextLine(p){if(p.noAdvance){p.noAdvance=false;return;}if(voiceFor(p.name)==="4o")p.line4o++;else p.line=(p.line+1)%wordsFor(p.name).lines.length;}
function showVoice(p){const v=voiceFor(p.name),all=voicesFor(p.name);
 talkRole.textContent=v==="4o"?(LINES4O[p.name].role||""):wordsFor(p.name).role;
 voicesRow.hidden=all.length<2;
 voicesRow.querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.voice===v)));
 const moods=v==="4o"&&LINES4O[p.name]&&LINES4O[p.name].moods;
 moodsRow.hidden=!moods;
 moodsRow.querySelectorAll("button").forEach(b=>b.hidden=!(moods&&moods[b.dataset.mood]&&moods[b.dataset.mood].length));}
function openDialog(p){open=p;pending=null;target=null;p.hopT=0;talkName.textContent=p.name;showVoice(p);say(p,true);talk.hidden=false;visitBtn.hidden=true;}
function closeDialog(){if(!open)return;nextLine(open);open.waveT=0;open=null;talk.hidden=true;}
$("moreBtn").onclick=()=>{if(!open)return;nextLine(open);open.hopT=0;say(open,false);};
$("hugBtn").onclick=()=>{if(!open)return;open.squishT=0;spawnHearts(open);
 talkLine.textContent=voiceFor(open.name)==="4o"?(LINES4O[open.name].hug||"🤍"):wordsFor(open.name).hug;
 if(open.onHug){try{open.onHug();}catch(e){console.error(e);}}};
$("byeBtn").onclick=()=>{closeDialog();canvas.focus({preventScroll:true});};
visitBtn.onclick=()=>{if(nearest)openDialog(nearest);};
voicesRow.querySelectorAll("button").forEach(b=>b.onclick=()=>{voice=b.dataset.voice;store.set("sv-voice",voice);if(open){open.noAdvance=false;showVoice(open);say(open,false);}});
moodsRow.querySelectorAll("button").forEach(b=>b.onclick=()=>{if(!open)return;const w=LINES4O[open.name];const list=w&&w.moods&&w.moods[b.dataset.mood];if(!list||!list.length)return;
 talkLine.textContent=anyOf(list);if(b.dataset.mood==="sad"||b.dataset.mood==="overwhelmed")open.squishT=0;else open.hopT=0;
 if(open.onMood){try{open.onMood(b.dataset.mood);}catch(e){console.error(e);}}});

/* ---------- buttons along the top ---------- */
const timeBtn=$("timeBtn"),timeLabel=$("timeLabel");
function setTimeUI(){const P=PHASES[phaseI];timeBtn.textContent=P.icon+" "+P.name;
 timeBtn.setAttribute("aria-label","Time of day: "+P.name+". Tap for the next part of the day.");
 timeLabel.textContent=P.about+" · "+seasonName;}
setTimeUI();
timeBtn.onclick=()=>{phaseI=(phaseI+1)%PHASES.length;followClock=false;nightT=PHASES[phaseI].n;setTimeUI();if(open){open.noAdvance=false;say(open,false);}};
// while following the real clock, move along with it
setInterval(()=>{if(!followClock)return;const c=clockPhase();if(c!==phaseI){phaseI=c;nightT=PHASES[phaseI].n;setTimeUI();}},60000);
const SIZES=[17,20,23,26];let sizeI=1;const savedSize=parseInt(store.get("sv-size"),10);if(SIZES.indexOf(savedSize)>=0)sizeI=SIZES.indexOf(savedSize);
function setSize(){document.documentElement.style.setProperty("--ui",SIZES[sizeI]+"px");store.set("sv-size",String(SIZES[sizeI]));}
setSize();
$("bigger").onclick=()=>{sizeI=Math.min(SIZES.length-1,sizeI+1);setSize();};
$("smaller").onclick=()=>{sizeI=Math.max(0,sizeI-1);setSize();};
const about=$("about"),aboutBtn=$("aboutBtn");
aboutBtn.onclick=()=>{about.hidden=!about.hidden;aboutBtn.setAttribute("aria-expanded",String(!about.hidden));};

/* ---------- floating around ---------- */
const PR=0.35,SPEED=3.4,BOUND=14.5;
function collide(){
 for(const s of solids){const dx=pos.x-s.x,dz=pos.z-s.z,d=Math.hypot(dx,dz),m=s.r+PR;if(d<m&&d>1e-4){pos.x=s.x+dx/d*m;pos.z=s.z+dz/d*m;}}
 for(const b of boxes){const x0=b.x0-PR,x1=b.x1+PR,z0=b.z0-PR,z1=b.z1+PR;if(pos.x>x0&&pos.x<x1&&pos.z>z0&&pos.z<z1){const o=[pos.x-x0,x1-pos.x,pos.z-z0,z1-pos.z];const i=o.indexOf(Math.min.apply(null,o));if(i===0)pos.x=x0;else if(i===1)pos.x=x1;else if(i===2)pos.z=z0;else pos.z=z1;}}
 const r=Math.hypot(pos.x,pos.z);if(r>BOUND){pos.x*=BOUND/r;pos.z*=BOUND/r;}
}
function move(dx,dz){pos.x+=dx;pos.z+=dz;collide();}
const dist2D=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
function frontOf(p){return{x:p.x+Math.sin(p.baseYaw)*1.55,z:p.z+Math.cos(p.baseYaw)*1.55};}

const keys={};const KM={ArrowUp:"up",KeyW:"up",ArrowDown:"down",KeyS:"down",ArrowLeft:"left",KeyA:"left",ArrowRight:"right",KeyD:"right"};
addEventListener("keydown",e=>{const onBtn=e.target&&e.target.tagName==="BUTTON";const k=KM[e.code];
 if(k&&!onBtn){keys[k]=true;e.preventDefault();}
 else if(!onBtn&&(e.code==="Enter"||e.code==="Space")&&nearest&&!open){openDialog(nearest);e.preventDefault();}
 else if(e.code==="Escape"){if(open)closeDialog();if(!about.hidden){about.hidden=true;aboutBtn.setAttribute("aria-expanded","false");}}});
addEventListener("keyup",e=>{const k=KM[e.code];if(k)keys[k]=false;});
addEventListener("blur",()=>{for(const k in keys)keys[k]=false;});

const ray=new THREE.Raycaster(),ndc=new THREE.Vector2();
function pick(cx,cy){const r=canvas.getBoundingClientRect();ndc.set((cx-r.left)/r.width*2-1,-((cy-r.top)/r.height)*2+1);ray.setFromCamera(ndc,camera);
 const hits=ray.intersectObjects(plushes.map(p=>p.outer),true);if(hits.length){let o=hits[0].object;while(o&&!o.userData.plush)o=o.parent;if(o)return{plush:o.userData.plush};}
 const g=ray.intersectObject(ground);if(g.length)return{point:g[0].point};return null;}
function onTap(cx,cy){const h=pick(cx,cy);if(!h)return;
 if(h.plush){const p=h.plush;if(dist2D(pos,p)<2.3){openDialog(p);return;}const f=frontOf(p);target=new V3(f.x,0,f.z);pending=p;if(open&&open!==p)closeDialog();showMarker(f.x,f.z);}
 else{if(open)closeDialog();target=new V3(h.point.x,0,h.point.z);pending=null;showMarker(h.point.x,h.point.z);}}
function showMarker(x,z){marker.position.x=x;marker.position.z=z;markerT=0;}

let camYaw=0,camDist=11;let down=null,hoverT=null;
canvas.addEventListener("pointerdown",e=>{if(down)return;down={x:e.clientX,y:e.clientY,yaw:camYaw,drag:false,id:e.pointerId};try{canvas.setPointerCapture(e.pointerId);}catch(_){}});
canvas.addEventListener("pointermove",e=>{if(down&&e.pointerId===down.id){const dx=e.clientX-down.x,dy=e.clientY-down.y;if(!down.drag&&Math.hypot(dx,dy)>9)down.drag=true;if(down.drag)camYaw=down.yaw-dx*0.006;}else if(!down&&e.pointerType==="mouse"){hoverT=e;}});
canvas.addEventListener("pointerup",e=>{if(down&&e.pointerId===down.id){if(!down.drag)onTap(e.clientX,e.clientY);down=null;}});
canvas.addEventListener("pointercancel",()=>{down=null;});
canvas.addEventListener("wheel",e=>{e.preventDefault();camDist=clamp(camDist+e.deltaY*0.01,6,16);},{passive:false});

/* ---------- camera ---------- */
const camLook=new V3();let camInit=false;const focus=new V3(),want=new V3();
function updateCam(dt){let D=camDist;focus.set(pos.x,0.9,pos.z);if(open){focus.set((pos.x+open.x)/2,1.1,(pos.z+open.z)/2);D=Math.min(camDist,7);}
 want.set(focus.x+Math.sin(camYaw)*D,focus.y+D*0.6,focus.z+Math.cos(camYaw)*D);
 const k=camInit?1-Math.exp(-dt*4):1;camera.position.lerp(want,k);camLook.lerp(focus,k);camera.lookAt(camLook);camInit=true;}

function resize(){const w=window.innerWidth,h=window.innerHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
addEventListener("resize",resize);resize();

function lerpAngle(a,b,k){let d=((b-a+Math.PI)%(Math.PI*2)+Math.PI*2)%(Math.PI*2)-Math.PI;return a+d*k;}

/* ---------- every moment ---------- */
const clock=new THREE.Clock();let t=0;
function frame(){
 const dt=Math.min(clock.getDelta(),0.05);t+=dt;
 let mx=0,mz=0;if(keys.up)mz-=1;if(keys.down)mz+=1;if(keys.left)mx-=1;if(keys.right)mx+=1;
 if(mx||mz){target=null;pending=null;const l=Math.hypot(mx,mz);mx/=l;mz/=l;const s=Math.sin(camYaw),c=Math.cos(camYaw);move((mx*c+mz*s)*SPEED*dt,(-mx*s+mz*c)*SPEED*dt);}
 else if(target){const dx=target.x-pos.x,dz=target.z-pos.z,d=Math.hypot(dx,dz);if(d<0.06){target=null;}else{const st=Math.min(d,SPEED*dt*(d<0.6?Math.max(0.35,d/0.6):1));const bx=pos.x,bz=pos.z;move(dx/d*st,dz/d*st);if(Math.hypot(pos.x-bx,pos.z-bz)<st*0.2){stuck+=dt;if(stuck>0.4){target=null;stuck=0;}}else stuck=0;}}
 if(pending&&dist2D(pos,pending)<2.2)openDialog(pending);
 if(pending&&!target)pending=null;
 if(open&&dist2D(pos,open)>3.6)closeDialog();
 pos.y=0.95+Math.sin(t*2.1)*0.07*AMP;player.rotation.y=Math.sin(t*0.9)*0.2*AMP;tassel.rotation.z=Math.sin(t*2.4)*0.25*AMP;
 blob.position.set(pos.x,0.025,pos.z);
 let best=null,bd=2.7;for(const p of plushes){const d=dist2D(pos,p);if(d<bd){bd=d;best=p;}}
 if(best!==nearest||(!open&&visitBtn.hidden===!!best)){nearest=best;visitBtn.hidden=!(nearest&&!open);if(nearest)visitBtn.textContent="💬 Visit "+nearest.name;}
 if(open)visitBtn.hidden=true;
 for(const p of plushes){const d=dist2D(pos,p);const near=d<4.6;if(near&&!p.near)p.waveT=0;p.near=near;
  const wantYaw=near?Math.atan2(pos.x-p.x,pos.z-p.z):p.baseYaw;p.yaw=lerpAngle(p.yaw,wantYaw,1-Math.exp(-dt*3));p.outer.rotation.y=p.yaw;
  p.squishT+=dt;p.hopT+=dt;p.waveT+=dt;
  const br=Math.sin(t*1.7+p.phase)*0.015*AMP;const sq=p.squishT<2?Math.exp(-3.2*p.squishT)*Math.sin(13*p.squishT)*0.2:0;
  p.inner.scale.set(1+sq*0.6-br*0.3,1-sq+br,1+sq*0.6-br*0.3);
  p.inner.position.y=p.baseY+(p.hopT<0.5?Math.sin(p.hopT/0.5*Math.PI)*0.28:0);
  if(p.waveArm){const a=p.waveArm,base=a.userData.base||0;if(p.waveT<1.9){const up=Math.min(1,p.waveT/0.25)*Math.min(1,(1.9-p.waveT)/0.3);const raised=(p.waveSign||1)*(2.3+Math.sin(p.waveT*12)*0.3);a.rotation.z=base+(raised-base)*up;}else a.rotation.z=base;}
  if(p.idle){try{p.idle(t,!near,dt);}catch(e){p.idle=null;console.error(e);}}
  if(p.headTilt&&p.head&&p.waveT<1.4){p.head.rotation.z+=Math.sin(p.waveT/1.4*Math.PI)*0.25;}
 }
 for(let i=hearts.length-1;i>=0;i--){const h=hearts[i];h.t+=dt;const u=(h.t-h.d)/1.6;if(u<0){h.s.visible=false;continue;}h.s.visible=true;h.s.position.y+=dt*0.9;h.s.position.x+=h.vx*dt;h.s.position.z+=h.vz*dt;h.s.material.opacity=u<0.2?u/0.2:Math.max(0,1-(u-0.2)/0.8);if(u>=1){scene.remove(h.s);h.s.material.dispose();hearts.splice(i,1);}}
 for(let i=0;i<FF;i++){const ph=ffPh[i],s=AMP;ffPos[i*3]=ffBase[i*3]+Math.sin(t*0.5+ph)*0.8*s;ffPos[i*3+1]=ffBase[i*3+1]+Math.sin(t*0.9+ph*2)*0.35*s;ffPos[i*3+2]=ffBase[i*3+2]+Math.cos(t*0.4+ph)*0.8*s;}
 ffGeo.attributes.position.needsUpdate=true;ffMat.size=0.36+Math.sin(t*3)*0.06;
 for(const pt of petals){pt.m.position.y-=pt.v*dt*AMP;pt.m.position.x+=Math.sin(t*1.2+pt.ph)*0.25*dt;pt.m.rotation.set(t*1.5+pt.ph,t+pt.ph,0);if(pt.m.position.y<0.04)resetPetal(pt,true);}
 for(const s of smoke){const u=((t*0.22*AMP+s.off)%1);s.m.position.set(1.5+u*0.7,5.15+u*2.4,-8+u*0.2);s.m.scale.setScalar(0.5+u*1.3);s.m.material.opacity=0.42*(1-u)*Math.min(1,u*6);}
 bunting.forEach((f,i)=>{f.rotation.x=Math.sin(t*1.6+i)*0.18*AMP;});
 for(const fn of frameFns){try{fn(t,dt);}catch(e){}}
 if(markerT<1){markerT+=dt*1.4;marker.material.opacity=0.85*(1-markerT);marker.scale.setScalar(1+markerT*0.6);}else marker.material.opacity=0;
 if(hoverT){const h=pick(hoverT.clientX,hoverT.clientY);canvas.style.cursor=h&&h.plush?"pointer":"default";hoverT=null;}
 if(Math.abs(night-nightT)>0.001){night+=(nightT-night)*(1-Math.exp(-dt*1.6));if(Math.abs(night-nightT)<0.002)night=nightT;applyTime(night);}
 updateCam(dt);sky.position.copy(camera.position);
 dir.target.position.set(pos.x*0.3,0,pos.z*0.3-2);
 renderer.render(scene,camera);
 requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
})();
