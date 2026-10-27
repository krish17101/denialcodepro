// Release boundary, not legal clearance. Run before every production build.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const walk = dir => fs.readdirSync(dir, {withFileTypes:true}).flatMap(e => e.isDirectory() ? walk(path.join(dir,e.name)) : [path.join(dir,e.name)]);
const relative = p => path.relative(root,p).replaceAll('\\','/');
let count=0;
function test(name,fn){fn();count++;console.log('PASS '+name);}
const allowed=['app/page.tsx','app/about/page.tsx','app/disclaimer/page.tsx','app/guides/page.tsx','app/guides/[slug]/page.tsx','app/methodology/page.tsx','app/privacy-policy/page.tsx','app/search/page.tsx','app/sources/page.tsx','app/terms/page.tsx','app/tools/evidence-checklist/page.tsx'];
const entries=walk(path.join(root,'app')).filter(p=>/\/(page|route)\.[jt]sx?$/.test(p));
test('exact approved route-entry set',()=>assert.deepEqual(entries.map(relative).sort(),allowed.sort()));
const seen=new Set();
const visit=p=>{
 if(seen.has(p))return;seen.add(p);
 const name=relative(p);
 assert(!/^(internal\/|lib\/v3\/(knowledge|search)|app\/(data|lib\/codes))/.test(name),'Held module reachable: '+name);
 if(!/\.[jt]sx?$/.test(p))return;
 const source=ts.createSourceFile(p,fs.readFileSync(p,'utf8'),ts.ScriptTarget.Latest,true);
 const inspect=node=>{
  let spec;
  if((ts.isImportDeclaration(node)||ts.isExportDeclaration(node))&&node.moduleSpecifier)spec=node.moduleSpecifier.text;
  if(ts.isCallExpression(node)&&(node.expression.kind===ts.SyntaxKind.ImportKeyword||node.expression.getText(source)==='require')){
   assert(node.arguments.length===1&&ts.isStringLiteral(node.arguments[0]),'Unresolved dynamic import in '+name);spec=node.arguments[0].text;
  }
  if(spec&&(spec.startsWith('.')||spec.startsWith('@/'))){
   const base=spec.startsWith('@/')?path.join(root,spec.slice(2)):path.resolve(path.dirname(p),spec);
   const target=[base,...['.ts','.tsx','.js','.jsx','.json','/index.ts','/index.tsx'].map(ext=>base+ext)].find(f=>fs.existsSync(f)&&fs.statSync(f).isFile());
   assert(target,'Unresolved local import '+spec+' from '+name);visit(target);
  }
  ts.forEachChild(node,inspect);
 };inspect(source);
};
test('public dependency graph excludes held knowledge',()=>{
 for(const entry of [...entries,...walk(path.join(root,'app')).filter(p=>/\/(layout|not-found|sitemap|robots)\.[jt]sx?$/.test(p))])visit(entry);
});
if(process.argv.includes('--preservation')) {
const manifest=JSON.parse(fs.readFileSync(path.join(root,'docs/launch-readiness/held-routes.json'),'utf8'));
for(const row of manifest)test('archived bytes '+row.original,()=>assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,row.preserved))).digest('hex'),row.sha256));
}
if(process.argv.includes('--built')){
 const routes=JSON.parse(fs.readFileSync(path.join(root,'.next/server/app-paths-manifest.json'),'utf8'));
 test('built routes exclude held code and payer paths',()=>assert(!Object.keys(routes).some(r=>/^\/(code|denial|denial-codes|remark-codes|payers|adjustment-codes)(\/|$)/.test(r))));
 const outputs=[...walk(path.join(root,'.next/server/app')),...walk(path.join(root,'.next/static'))].filter(p=>/\.(html|rsc|js|json)$/.test(p));
 const sentinels=['The time limit for filing has expired','Precertification/authorization/notification absent','Patient cannot be identified as our insured'];
 test('sample held official descriptions absent from HTML, RSC and JS',()=>{for(const p of outputs){const s=fs.readFileSync(p,'utf8');for(const text of sentinels)assert(!s.includes(text),'Held sample in '+relative(p));}});
 test('three original guide pages generated',()=>{for(const slug of ['find-the-claim-response','choose-a-correction-or-review','build-a-deadline-evidence-record'])assert(fs.existsSync(path.join(root,'.next/server/app/guides',slug+'.html')));});
 console.log('Inspected '+outputs.length+' build artifacts; sentinel scan is sampled, dependency graph is the broader boundary.');
}
console.log(JSON.stringify({passed:count,failed:0,reachableModules:seen.size,scope:'Publication boundary and archival integrity; not copyright or factual verification'}));
