import React,{useEffect,useRef} from 'react';
/** Animated petal choreography — a small canvas renderer with gravity, drag and curled paths.
 * Petals are locally drawn 2D shapes, not GIFs, emoji sprites or generated audio.
 */
export default function PetalCinema({className='',density=1}){
 const ref=useRef(null);
 useEffect(()=>{
  const canvas=ref.current;if(!canvas)return;
  const ctx=canvas.getContext('2d',{alpha:true});if(!ctx)return;
  const reduce=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  let width=0,height=0,alive=true,visible=false,raf=0,previous=0,elapsed=0,petals=[];
  let dpr=1;
  const palette=[['#ffd7c3','#f296a8'],['#f9e0c9','#cc748c'],['#ffe9be','#eab48c'],['#ffd8df','#bc647d']];
  function resize(){const r=canvas.getBoundingClientRect();width=Math.max(1,r.width);height=Math.max(1,r.height);dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0)}
  function spawn(side){const s=side===0?1:-1,origin=side===0?.22:.78;return{x:width*origin+(Math.random()-.5)*50,y:height*(.66+Math.random()*.06),vx:s*(2.2+Math.random()*3.1),vy:-(3.5+Math.random()*4.1),air:.5+Math.random()*1.8,twist:Math.random()*Math.PI*2,spin:(Math.random()-.5)*.17,size:3.6+Math.random()*7,life:0,ttl:200+Math.random()*120,color:palette[Math.floor(Math.random()*palette.length)]}}
  function paint(p){const opacity=Math.min(1,p.life/25,Math.max(0,(p.ttl-p.life)/60));ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.twist);ctx.scale(1,.65+.28*Math.sin(p.life*.11));ctx.globalAlpha=opacity*.9;
   const grad=ctx.createLinearGradient(-p.size,-p.size,p.size,p.size);grad.addColorStop(0,p.color[0]);grad.addColorStop(1,p.color[1]);ctx.fillStyle=grad;ctx.shadowColor='#8b395c';ctx.shadowBlur=7;ctx.shadowOffsetY=2;
   ctx.beginPath();ctx.moveTo(-p.size*.8,0);ctx.bezierCurveTo(-p.size*.5,-p.size*.9,p.size*.8,-p.size,p.size,0);ctx.bezierCurveTo(p.size*.52,p.size*.83,-p.size*.2,p.size*.66,-p.size*.8,0);ctx.closePath();ctx.fill();ctx.restore()}
  function frame(t){if(!alive)return;raf=requestAnimationFrame(frame);if(!visible)return;if(reduce){if(!previous){previous=t;for(let i=0;i<48;i++){const p=spawn(i%2);p.x=Math.random()*width;p.y=Math.random()*height;paint(p)}}return}
   const dt=Math.min(2.2,Math.max(.2,(t-(previous||t))/16.67));previous=t;ctx.clearRect(0,0,width,height);elapsed+=dt;
   while(elapsed>4.5/density){elapsed-=4.5/density;if(petals.length<190){petals.push(spawn(0),spawn(1))}}
   petals=petals.filter(p=>{p.life+=dt;p.vy+=.045*dt;p.vx+=Math.sin(p.life*.032+p.air)*.028*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.twist+=p.spin*dt;if(p.life>p.ttl||p.y>height+30||p.x<-40||p.x>width+40)return false;paint(p);return true});
  }
  const io=new IntersectionObserver(entries=>{visible=entries.some(e=>e.isIntersecting);previous=0;if(!visible)ctx.clearRect(0,0,width,height)},{threshold:.06});io.observe(canvas);const ro=new ResizeObserver(resize);ro.observe(canvas);resize();raf=requestAnimationFrame(frame);
  return()=>{alive=false;cancelAnimationFrame(raf);io.disconnect();ro.disconnect();petals=[]};
 },[density]);
 return <canvas ref={ref} className={`petal-cinema ${className}`} aria-hidden="true"/>;
}
