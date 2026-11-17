import React,{useEffect,useRef,useState} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {ArrowDown,ArrowLeft,ArrowUpRight,Menu,X} from 'lucide-react';
import {CHAPTERS} from '../data.js';
import {SoundButton,useSound} from './AudioDirector.jsx';
import {ActionBar} from './Details.jsx';

if(typeof window!=='undefined')gsap.registerPlugin(ScrollTrigger);

export function useStoryScene(rootRef,setup,dependencies=[]){
 useEffect(()=>{if(!rootRef.current)return;let ctx=gsap.context(()=>{
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  setup({gsap,ScrollTrigger,reduced});
 },rootRef);const refresh=requestAnimationFrame(()=>ScrollTrigger.refresh());return()=>{cancelAnimationFrame(refresh);ctx.revert()}},dependencies);
}

export function useStoryProgress(rootRef,chapters){
 const [active,setActive]=useState(0);
 useEffect(()=>{const nodes=Array.from(rootRef.current?.querySelectorAll('[data-chapter]')||[]);if(!nodes.length)return;
  const triggers=nodes.map((node,i)=>ScrollTrigger.create({trigger:node,start:'top 55%',end:'bottom 45%',onEnter:()=>setActive(i),onEnterBack:()=>setActive(i)}));
  return()=>triggers.forEach(t=>t.kill());
 },[rootRef,chapters]);
 return active;
}

export function StoryChrome({theme,active,chapters,chapterIds}){
 const [open,setOpen]=useState(false);
 return <><header className={`story-top ${theme}`}><a href="/" className="story-brand" aria-label="All wedding website styles">V<span>✶</span>Y <small>THE WEDDING OF</small></a><div className="story-top-center">25 NOVEMBER <span>✦</span> 2026</div><div className="story-top-tools"><SoundButton/><button aria-label={open?'Close chapter menu':'Open chapter menu'} className="chapter-menu-toggle" onClick={()=>setOpen(!open)}>{open?<X size={20}/>:<Menu size={20}/>}</button></div></header>
  <nav className={`story-rail ${theme}`} aria-label="Story chapters">{chapters.map((t,i)=><a href={`#${chapterIds[i]}`} key={t} className={active===i?'current':''} title={t} aria-label={`Chapter ${i+1}: ${t}`} aria-current={active===i?'step':undefined}><span className="rail-dot"/><span className="rail-tooltip">{String(i+1).padStart(2,'0')} — {t}</span></a>)}</nav>
  <aside className={`story-chapter-tag ${theme}`}><span>{String(active+1).padStart(2,'0')} / {String(chapters.length).padStart(2,'0')}</span><span>{chapters[active]}</span></aside>
  <div className={`story-menu-scrim ${open?'is-open':''}`} onClick={()=>setOpen(false)} aria-hidden="true"/>
  <nav className={`story-chapter-drawer ${open?'is-open':''}`} aria-label="Jump to chapter"><p className="drawer-overline">CHOOSE A SCENE</p><h2>Our wedding <em>story.</em></h2>{chapters.map((t,i)=><a key={t} href={`#${chapterIds[i]}`} onClick={()=>setOpen(false)}><b>{String(i+1).padStart(2,'0')}</b>{t}<ArrowUpRight size={16}/></a>)}<a href="/" className="drawer-all">EXPLORE ALL STYLES <ArrowUpRight size={16}/></a></nav>
 </>;
}

export function ScrollHint({text='SCROLL TO UNFOLD THE STORY'}){return <div className="scroll-hint"><span className="scroll-hint-track"><span/></span><span>{text}</span><ArrowDown size={15}/></div>}
export function Eyebrow({children}){return <p className="scene-eyebrow"><span className="eye-line"/>{children}<span className="eye-line"/></p>}
export function ScriptNames({big=false}){return <span className={`script-names ${big?'big':''}`}>Vidhi <em>&amp;</em> Yash</span>}

export function PetalField({count=28,mode='royal'}){
 const isMobile = typeof window !== 'undefined' && (window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches);
 const effectiveCount = isMobile ? Math.min(14, count) : count;
 return <div className={`petal-field petal-${mode}`} aria-hidden="true">{Array.from({length:effectiveCount},(_,i)=>{const x=((i*47+13)%101);const delay=-((i*23)%55)/10;const dur=6+(i%7)*1.13;return <i key={i} style={{'--x':`${x}%`,'--delay':`${delay}s`,'--dur':`${dur}s`,'--size':`${6+(i%5)*2}px`,'--sway':`${i%2===0?48:-48}px`}}/>})}</div>
}

export function MagicParticles({count=36,className=''}){
 const isMobile = typeof window !== 'undefined' && (window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches);
 const effectiveCount = isMobile ? Math.min(16, count) : count;
 return <div className={`magic-particles ${className}`} aria-hidden="true">{Array.from({length:effectiveCount},(_,i)=><i key={i} style={{left:`${(i*53+17)%100}%`,top:`${(i*29+11)%93}%`,'--delay':`${(i*17%34)/10}s`,'--scale':`${.5+(i%5)*.25}`}}/>)}</div>
}

export function FlowerBurst({trigger=0,color='#f2b4be'}){return <div className="flower-burst" key={trigger} aria-hidden="true">{Array.from({length:32},(_,i)=><span key={i} style={{'--angle':`${i*137.508}deg`,'--length':`${85+(i%6)*28}px`,'--delay':`${(i%7)*25}ms`,'--hue':color}}>❀</span>)}</div>}
export function EndInvitation({theme='royal',children}){return <div className={`end-invitation ${theme}`}><span className="end-rule">✦</span><p>YOUR PRESENCE IS THE MOST PRECIOUS GIFT</p><h2>Celebrate <em>with us.</em></h2>{children}<ActionBar theme={theme}/><p className="end-signature">With love and blessings, the families of Vidhi &amp; Yash</p><a href="/" className="end-back">EXPLORE THE OTHER STORIES <ArrowUpRight size={15}/></a></div>}
