const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const origin='https://denialcodepro.com';
const frame=fs.readFileSync('public/site-measurement.html','utf8').match(/<script>([\s\S]+?)<\/script>/)[1];
function run({site=origin, path='/', id='home', choice='allow', direct=false, query='', blocked=false}={}) {
  const location={origin:site, search:query, hash:'#'+id};
  const parent={location:{origin:site,pathname:path,search:'?q=PRIVATE',hash:'#PRIVATE'}};
  const w={parent,top:parent,self:{},frameElement:{getAttribute:()=>'Optional site measurement'}};
  if(direct) w.top=w.self;
  const scripts=[];
  vm.runInNewContext(frame,{location,window:w,document:{createElement:()=>({}),head:{appendChild:s=>scripts.push(s)}},
    localStorage:{getItem(){if(blocked)throw Error();return choice;}}});
  return {scripts,commands:(w.dataLayer||[]).map(a=>Array.from(a))};
}
for(const [name,vals] of Object.entries({preview:{site:'https://test.netlify.app'},localhost:{site:'http://localhost'},unknown:{id:'other'},noConsent:{choice:null},optOut:{choice:'deny'},storageBlocked:{blocked:true},direct:{direct:true},search:{path:'/search'},feedback:{path:'/contact'},checklist:{path:'/tools/evidence-checklist'},mismatch:{path:'/guides'},tampering:{query:'?s=PRIVATE'}}))
  test('no tag or commands: '+name,()=>assert.deepEqual(run(vals),{scripts:[],commands:[]}));
for(const [id,path] of Object.entries({home:'/',guides:'/guides',response:'/guides/find-the-claim-response',correction:'/guides/choose-a-correction-or-review',deadline:'/guides/build-a-deadline-evidence-record'}))
  test('opted-in page: '+id,()=>{
    const {scripts,commands}=run({id,path});
    assert.equal(scripts.length,1);assert.equal(scripts[0].referrerPolicy,'no-referrer');
    assert.equal(scripts[0].src,'https://www.googletagmanager.com/gtag/js?id=G-QL011FYKSR');
    assert.equal(commands[0][2].ad_storage,'denied');assert.equal(commands[2][2].send_page_view,false);
    assert.equal(commands[3][1],'page_view');assert.equal(commands[3][2].page_location,origin+path);
    assert.equal(commands[3][2].page_referrer,'');assert(!JSON.stringify(commands).includes('PRIVATE'));
  });
test('build gate: only unambiguous Netlify production',()=>{
  const exports={};vm.runInNewContext(ts.transpileModule(fs.readFileSync('lib/public/analytics-environment.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,{exports});
  const prod={NODE_ENV:'production',NETLIFY:'true',CONTEXT:'production'};
  assert(exports.analyticsProduction(prod));
  for(const mix of [{NODE_ENV:'test'},{CONTEXT:'branch-deploy'},{CONTEXT:'deploy-preview'},{VERCEL_ENV:'preview'},{NETLIFY_PREVIEW_SERVER:'true'},{NETLIFY:''}])assert(!exports.analyticsProduction({...prod,...mix}));
});
