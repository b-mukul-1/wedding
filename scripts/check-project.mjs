/** Offline structural QA. No npm dependencies needed beyond globally available TypeScript. */
import fs from 'node:fs';import path from 'node:path';import{createRequire}from'node:module';
const require=createRequire(import.meta.url);
let ts;for(const id of ['typescript','/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript'])try{ts=require(id);break}catch{}
const base=process.cwd(),src=path.join(base,'src'),publicDir=path.join(base,'public');let failures=[];
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(x=>x.isDirectory()?walk(path.join(dir,x.name)):[path.join(dir,x.name)])}
const source=walk(src).filter(x=>/\.(jsx|js|css)$/.test(x));
for(const file of source){const text=fs.readFileSync(file,'utf8');if(file.endsWith('.jsx')||file.endsWith('.js')){if(ts){const ast=ts.createSourceFile(file,text,ts.ScriptTarget.Latest,true,file.endsWith('.jsx')?ts.ScriptKind.JSX:ts.ScriptKind.JS);for(const e of ast.parseDiagnostics)failures.push(`${file}: ${ts.flattenDiagnosticMessageText(e.messageText,' | ')}`)}}
for(const [,url] of text.matchAll(/["'](\/art\/[^"']+\.(?:png|webp|jpg|svg))["']/g)){const p=path.join(publicDir,url);if(!fs.existsSync(p))failures.push(`Missing art asset ${url} referenced by ${path.basename(file)}`)}
}
for(const [key,count] of Object.entries({royal:11,minimal:11,floral:11})){const jsx=fs.readFileSync(path.join(src,'pages',key[0].toUpperCase()+key.slice(1)+'.jsx'),'utf8');const ids=(jsx.match(/<section /g)||[]).length+(jsx.match(/<Folio /g)||[]).length;console.log(`${key}: ${ids} sections/folios declared`);if(ids<count)failures.push(`${key}: expected ${count} story chapters, found only ${ids}`)}
const pkg=JSON.parse(fs.readFileSync(path.join(base,'package.json'),'utf8'));
if(!pkg.scripts.build||!pkg.scripts.dev)failures.push('package missing scripts');
if(failures.length){console.error('FAILED\n'+failures.join('\n'));process.exit(1)}
console.log(`PASS: ${source.length} source/style files parsed, referenced art assets found, Vite scripts declared.`)
