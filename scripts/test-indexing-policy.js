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
for(const [name,env,expected] of cases){assert.equal(mod.exports.publicIndexingEnabled(env),expected,name);console.log('PASS '+name);}
console.log(JSON.stringify({passed:cases.length,failed:0,scope:'Indexing configuration policy; rendered metadata and deployed headers tested separately'}));
