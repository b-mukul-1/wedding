import React,{useEffect,useRef} from 'react';
/**
 * Optional genuine WebGL 3D layer: depth-sorted illuminated particles, camera perspective,
 * soft volumetric point sprites and slow cursor/camera drift. No video/GIF background.
 * Disabled on low-width and reduced-motion clients to preserve mobile battery life.
 */
export default function CinematicAtmosphere({tone='#f7c88f',count=110}){
 const host=useRef(null);
 useEffect(()=>{
  const el=host.current;if(!el||window.matchMedia('(prefers-reduced-motion: reduce)').matches||window.innerWidth<760)return;
  let disposed=false,renderer,scene,camera,mesh,geometry,material,observer,raf=0,visible=true,mouseX=0,mouseY=0;let width=0,height=0;const started=performance.now();
  async function setup(){try{
   const T=await import('three');if(disposed)return;
   renderer=new T.WebGLRenderer({alpha:true,antialias:false,powerPreference:'low-power',premultipliedAlpha:true});
   renderer.setPixelRatio(Math.min(1.5,window.devicePixelRatio||1));renderer.setClearColor(0x000000,0);renderer.domElement.setAttribute('aria-hidden','true');el.appendChild(renderer.domElement);
   scene=new T.Scene();camera=new T.PerspectiveCamera(52,1,.1,100);camera.position.z=8.5;
   const positions=new Float32Array(count*3),scales=new Float32Array(count);
   for(let i=0;i<count;i++){let s=(i*2654435761>>>0)/4294967295;positions[i*3]=(s-.5)*13;s=(i*1664525+1013904223>>>0)/4294967295;positions[i*3+1]=(s-.5)*8;s=(i*1103515245+12345>>>0)/4294967295;positions[i*3+2]=-4+s*6;scales[i]=3+(i%11)*.8}
   geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.BufferAttribute(positions,3));geometry.setAttribute('aScale',new T.BufferAttribute(scales,1));
   material=new T.ShaderMaterial({transparent:true,depthWrite:false,blending:T.AdditiveBlending,uniforms:{uTime:{value:0},uColor:{value:new T.Color(tone)}},vertexShader:`attribute float aScale;uniform float uTime;varying float vFade;void main(){vec3 p=position;p.x+=sin(uTime*.27+p.y*.8)*.19;p.y+=cos(uTime*.31+p.x*.43)*.14;vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;gl_PointSize=aScale*(19.0/max(.5,-mv.z));vFade=clamp((10.0+mv.z)/8.0,.12,1.);}`,fragmentShader:`uniform vec3 uColor;varying float vFade;void main(){float d=distance(gl_PointCoord,vec2(.5));float glow=pow(max(0.,1.-d*2.),3.);gl_FragColor=vec4(uColor,glow*.48*vFade);}`});
   mesh=new T.Points(geometry,material);scene.add(mesh);
   resize();observer=new IntersectionObserver(entries=>{visible=entries.some(entry=>entry.isIntersecting)},{threshold:.04});observer.observe(el);
   window.addEventListener('resize',resize,{passive:true});window.addEventListener('pointermove',pointer,{passive:true});
   const tick=(now)=>{if(disposed)return;raf=requestAnimationFrame(tick);if(!visible)return;material.uniforms.uTime.value=(now-started)/1000;mesh.rotation.y+=.00012;camera.position.x+=(mouseX*.35-camera.position.x)*.014;camera.position.y+=(mouseY*.22-camera.position.y)*.014;camera.lookAt(0,0,0);renderer.render(scene,camera)};raf=requestAnimationFrame(tick);
  }catch{ /* Canvas, particles and scenery remain visible if WebGL is unsupported. */ }}
  function pointer(e){mouseX=(e.clientX/window.innerWidth-.5)*2;mouseY=(.5-e.clientY/window.innerHeight)*2}
  function resize(){if(!renderer||!el)return;const r=el.getBoundingClientRect();width=Math.max(1,r.width);height=Math.max(1,r.height);renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix()}
  setup();return()=>{disposed=true;cancelAnimationFrame(raf);observer?.disconnect();window.removeEventListener('resize',resize);window.removeEventListener('pointermove',pointer);mesh&&scene?.remove(mesh);geometry?.dispose();material?.dispose();renderer?.dispose();renderer?.domElement?.remove()};
 },[tone,count]);
 return <div className="cinematic-webgl" ref={host} aria-hidden="true"/>;
}
