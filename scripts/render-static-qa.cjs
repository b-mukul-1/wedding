// A tiny offline snapshot renderer used for CSS inspection only. NOT production code.
const fs=require('fs'),path=require('path'),ts=require('/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript');
const root=path.resolve(__dirname,'..');
const React={Fragment:Symbol('fragment'),createElement:(type,props,...children)=>({type,props:{...props,children}}),useState:v=>[typeof v==='function'?v():v,()=>{}],useRef:v=>({current:v}),useEffect:()=>{},useLayoutEffect:()=>{},useCallback:fn=>fn,useMemo:fn=>fn(),useId:()=>Math.random()+'',useContext:ctx=>ctx?ctx._default:{},createContext:initial=>({_default:initial,Provider:({children})=>children})};
const fakeGsap={registerPlugin:()=>{},context:()=>({revert:()=>{}}),utils:{toArray:()=>[]}};
const fakeScroll={create:()=>({kill(){}}),refresh:()=>{}};
const icons=new Proxy({}, {get:(_,name)=>({size=16})=>React.createElement('svg',{width:size,height:size,viewBox:'0 0 24 24','aria-hidden':'true'},React.createElement('circle',{cx:12,cy:12,r:7,fill:'none',stroke:'currentColor',strokeWidth:1.5}))});
const cache={};
function req(id,base){if(id==='react')return {__esModule:true,default:React,...React};if(id==='gsap')return{__esModule:true,default:fakeGsap};if(id==='gsap/ScrollTrigger')return{ScrollTrigger:fakeScroll};if(id==='lucide-react')return icons;
 if(id.endsWith('.css'))return {};const f=path.resolve(base,id);return load(fs.existsSync(f)?f:fs.existsSync(f+'.jsx')?f+'.jsx':fs.existsSync(f+'.js')?f+'.js':f)}
function load(file){if(cache[file])return cache[file].exports;const src=fs.readFileSync(file,'utf8');const out=ts.transpileModule(src,{fileName:file,compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.React,esModuleInterop:true}}).outputText;
 const mod={exports:{}};cache[file]=mod;
 try{new Function('require','module','exports','window','document','navigator',out)((id)=>req(id,path.dirname(file)),mod,mod.exports,{location:{pathname:'/royal'}}, {},{});}catch(e){console.error('MODULE ERROR',file,e);throw e}return mod.exports}
function escape(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
const unitless=new Set(['opacity','zIndex','flex','order','scale','fontWeight','lineHeight']);
function render(node){if(node===null||node===undefined||node===false||node===true)return '';if(typeof node==='string'||typeof node==='number')return escape(node);if(Array.isArray(node))return node.map(render).join('');if(typeof node.type==='function'){try{return render(node.type(node.props||{}))}catch(e){console.log('RENDER ERROR',node.type.name,e);throw e}}if(node.type===React.Fragment)return render(node.props.children);
 const tag=node.type; const attr=Object.entries(node.props||{}).filter(([k])=>!['children','key','ref'].includes(k)&&!k.startsWith('on')&&!['dangerouslySetInnerHTML'].includes(k)).map(([k,v])=>{if(v===false||v===null||v===undefined)return '';if(k==='className')k='class';if(k==='htmlFor')k='for';if(k==='style'&&typeof v==='object'){v=Object.entries(v).map(([p,val])=>{const key=p.startsWith('--')?p:p.replace(/[A-Z]/g,s=>'-'+s.toLowerCase());return key+':'+(typeof val==='number'&&!unitless.has(p)?val+'px':val)}).join(';')}if(typeof v==='object'||typeof v==='function')return '';if(v===true)return k;return `${k}="${escape(v)}"`}).filter(Boolean).join(' ');const inner=render(node.props.children);if(['img','input','link','meta','br','hr'].includes(tag))return `<${tag} ${attr}/>`;return `<${tag} ${attr}>${inner}</${tag}>`}
const outDir=path.join(root,'.qa');fs.mkdirSync(outDir,{recursive:true});
for(const name of ['Royal','Minimal','Floral']){
 const C=load(path.join(root,'src/pages',name+'.jsx')).default;
 const body=render(React.createElement(C));const css=['base','royal','minimal','floral'].map(c=>`<link rel="stylesheet" href="/src/styles/${c}.css">`).join('');
 const style=name==='Royal'?'<style>.royal-gate{display:none!important}.royal-hero-copy{opacity:1!important;filter:none!important}</style>':'';
 fs.writeFileSync(path.join(outDir,name.toLowerCase()+'.html'),`<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet">${css}${style}</head><body>${body}</body></html>`);
 console.log(name,body.length,'HTML bytes');
}
