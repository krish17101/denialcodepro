const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const mod = {exports:{}};
const source = ts.transpileModule(fs.readFileSync(path.join(__dirname,'../lib/public/indexing.ts'),'utf8'), {
  compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}
}).outputText;
new Function('exports','module',source)(mod.exports,mod);
const cases = [
  ['missing configuration',{},false],
  ['approval alone',{DENIALCODEPRO_INDEXING_APPROVED:'true'},false],
  ['production without approval',{VERCEL_ENV:'production'},false],
  ['explicitly disabled',{VERCEL_ENV:'production',DENIALCODEPRO_INDEXING_APPROVED:'false'},false],
  ['preview with approval',{VERCEL_ENV:'preview',DENIALCODEPRO_INDEXING_APPROVED:'true'},false],
  ['development with approval',{VERCEL_ENV:'development',DENIALCODEPRO_INDEXING_APPROVED:'true'},false],
  ['NODE_ENV alone',{NODE_ENV:'production',DENIALCODEPRO_INDEXING_APPROVED:'true'},false],
  ['noncanonical approval',{VERCEL_ENV:'production',DENIALCODEPRO_INDEXING_APPROVED:'TRUE'},false],
  ['custom target',{VERCEL_ENV:'production',VERCEL_TARGET_ENV:'staging',DENIALCODEPRO_INDEXING_APPROVED:'true'},false],
  ['conflicting preview target',{VERCEL_ENV:'production',VERCEL_TARGET_ENV:'preview',DENIALCODEPRO_INDEXING_APPROVED:'true'},false],
  ['approved production',{VERCEL_ENV:'production',VERCEL_TARGET_ENV:'production',DENIALCODEPRO_INDEXING_APPROVED:'true'},true],
  ['approved production without optional target',{VERCEL_ENV:'production',DENIALCODEPRO_INDEXING_APPROVED:'true'},true],
];
const approved = {DENIALCODEPRO_INDEXING_APPROVED:'true'};
cases.push(
  ['Netlify approved production',{...approved,NETLIFY:'true',CONTEXT:'production'},true],
  ['Netlify no approval',{NETLIFY:'true',CONTEXT:'production'},false],
  ['Netlify deploy preview',{...approved,NETLIFY:'true',CONTEXT:'deploy-preview'},false],
  ['Netlify branch deploy',{...approved,NETLIFY:'true',CONTEXT:'branch-deploy'},false],
  ['Netlify dev',{...approved,NETLIFY:'true',CONTEXT:'dev'},false],
  ['Netlify missing context',{...approved,NETLIFY:'true'},false],
  ['context without host',{...approved,CONTEXT:'production'},false],
  ['Netlify false host',{...approved,NETLIFY:'false',CONTEXT:'production'},false],
  ['Netlify preview server',{...approved,NETLIFY:'true',CONTEXT:'production',NETLIFY_PREVIEW_SERVER:'true'},false],
  ['Netlify unknown context',{...approved,NETLIFY:'true',CONTEXT:'staging'},false],
  ['mixed production hosts',{...approved,NETLIFY:'true',CONTEXT:'production',VERCEL_ENV:'production'},false],
  ['Vercel production with Netlify preview signal',{...approved,VERCEL_ENV:'production',NETLIFY_PREVIEW_SERVER:'true'},false],
);
for(const [name,env,expected] of cases){assert.equal(mod.exports.publicIndexingEnabled(env),expected,name);console.log('PASS '+name);}
console.log(JSON.stringify({passed:cases.length,failed:0,scope:'Indexing configuration policy; rendered metadata and deployed headers tested separately'}));
