// Run after node scripts/collect-notices.cjs. Tests notice delivery, not legal compliance.
const fs=require('node:fs'), path=require('node:path'), vm=require('node:vm'), assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const generated=fs.readFileSync(path.join(root,'public/third-party-notices.txt'),'utf8');
const supplemental=fs.readFileSync(path.join(root,'notices/next-env-15.5.28.txt'),'utf8');
assert.ok(generated.includes(supplemental.trimEnd()),'Exact supplemental notice text must reach generated public file');
console.log('PASS supplemental notice delivered without truncation');
for(const text of [fs.readFileSync(path.join(root,'notices/Inter-OFL.txt'),'utf8'),fs.readFileSync(path.join(root,'node_modules/next/license.md'),'utf8'),fs.readFileSync(path.join(root,'node_modules/react/LICENSE'),'utf8')])assert.ok(generated.includes(text),'Existing core notice must remain intact');
console.log('PASS existing font, Next and React notice texts retained');
let writes=0;
const fakeFs={...fs,readFileSync(p,...args){
  const data=fs.readFileSync(p,...args);
  if(String(p)==='node_modules/@next/env/package.json')return JSON.stringify({...JSON.parse(data),version:'99.0.0'});
  return data;
},writeFileSync(){writes++;throw Error('Unexpected write before version rejection');}};
const previous=process.cwd();
process.chdir(root);
try {
  assert.throws(()=>vm.runInNewContext(fs.readFileSync(path.join(root,'scripts/collect-notices.cjs'),'utf8'),{
    require:n=>n==='node:fs'?fakeFs:require(n),__dirname:path.join(root,'scripts'),process:{chdir(){},argv:[]},console:{log(){}}
  }),/Review supplemental @next\/env notices for version 99\.0\.0/);
  assert.equal(writes,0);
} finally {process.chdir(previous);}
console.log('PASS mismatched package version rejected before public output write');
const native=fs.readFileSync(path.join(root,'notices/LGPL-3.0-with-GPL-3.0.txt'));
assert.ok(generated.includes(native.toString('utf8')),'Full LGPL and incorporated GPL documents must be retained');
console.log('PASS complete native license documents retained');
const crypto=require('node:crypto');
const blob=crypto.createHash('sha1').update(`blob ${native.length}\0`).update(native).digest('hex');
assert.equal(blob,'513d1c01fe5b5b9724e999d8eb041ff17d444eaa','Must match the inspected SPDX source blob');
console.log('PASS native license bytes match inspected upstream blob');
for(const pkg of ['sharp-libvips-linux-x64','sharp-libvips-linuxmusl-x64']) {
 const readme=path.join(root,'node_modules/@img',pkg,'README.md');
 if(fs.existsSync(readme))assert.ok(generated.includes(fs.readFileSync(readme,'utf8')),'Supplier table must remain intact');
}
console.log('PASS installed native supplier tables retained');
let nativeWrites=0;
const nativeFs={...fs,readFileSync(p,...args){
 const data=fs.readFileSync(p,...args);
 if(String(p)==='package-lock.json'){
  const lock=JSON.parse(data);
  for(const [name,meta] of Object.entries(lock.packages))if(/^node_modules\/@img\/sharp-libvips-/.test(name))meta.version='99.0.0';
  return JSON.stringify(lock);
 }
 return data;
},writeFileSync(){nativeWrites++;throw Error('Unexpected write before native version rejection');}};
process.chdir(root);
try {
 assert.throws(()=>vm.runInNewContext(fs.readFileSync(path.join(root,'scripts/collect-notices.cjs'),'utf8'),{
  require:n=>n==='node:fs'?nativeFs:require(n),__dirname:path.join(root,'scripts'),process:{chdir(){},argv:[]},console:{log(){}}
 }),/Review supplemental sharp-libvips notices for version 99\.0\.0/);
 assert.equal(nativeWrites,0);
} finally {process.chdir(previous);}
console.log('PASS mismatched native package version rejected before public output write');
console.log('7 passed, 0 failed; notice assembly only, not factual or legal certification');
