const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const cache = new Map();
function load(file) {
 file = path.resolve(__dirname, '..', file);
 if(cache.has(file)) return cache.get(file).exports;
 const mod = {exports:{}}; cache.set(file,mod);
 const source = ts.transpileModule(fs.readFileSync(file,'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2020}}).outputText;
 const resolve = name => {
  if(name === 'next/link') return {__esModule:true,default:({children,...props})=>React.createElement('a',props,children)};
  if(name.startsWith('.')) {const base=path.resolve(path.dirname(file),name);return load(['.ts','.tsx'].map(e=>base+e).find(p=>fs.existsSync(p)));}
  return require(name);
 };
 new Function('require','module','exports',source)(resolve,mod,mod.exports); return mod.exports;
}
const {searchGuides,isCodeQuery,normalizeQuery}=load('lib/public/search.ts');
const {SearchResults}=load('app/components/v3/SearchResults.tsx');
const {SearchBox}=load('app/components/v3/SearchBox.tsx');
let count=0;
function test(name,fn){fn();count++;console.log('PASS '+name);}
for(const [query,slug] of [['appeal deadline','build-a-deadline-evidence-record'],['corrected claim','choose-a-correction-or-review'],['clearinghouse rejection','find-the-claim-response'],['ERA','find-the-claim-response'],['late filing','build-a-deadline-evidence-record'],['replacement','choose-a-correction-or-review']])test('ranking: '+query,()=>assert.equal(searchGuides(query)[0].slug,slug));
for(const q of ['CO-29','carc 16','N123','96'])test('code is not a guide match: '+q,()=>{assert(isCodeQuery(q));assert.equal(searchGuides(q).length,0);});
test('case and whitespace',()=>assert.deepEqual(searchGuides('  CORRECTED CLAIM  '),searchGuides('corrected claim')));
test('empty query',()=>assert.equal(searchGuides('   ').length,0));
test('unrelated query',()=>assert.equal(searchGuides('pancakes').length,0));
test('stop words alone',()=>assert.equal(searchGuides('how do i').length,0));
test('query length bounded',()=>assert.equal(normalizeQuery('x'.repeat(500)).length,180));
const render = query => renderToStaticMarkup(React.createElement(SearchResults,{query}));
test('unmatched suggestions labeled honestly',()=>{const html=render('pancakes');assert(html.includes('No matching guide found'));assert(html.includes('Suggested starting points'));});
test('code query has scope notice',()=>assert(render('CO-29').includes('not an interpretation of that code')));
test('empty search browses guides',()=>assert(render('').includes('Browse the available guides')));
test('query escaped in rendered output',()=>{const html=render('<img src=x onerror=alert(1)> deadline');assert(!html.includes('<img'));assert(html.includes('&lt;img'));});
test('search retains query and uses GET',()=>{const html=renderToStaticMarkup(React.createElement(SearchBox,{initialQuery:'corrected claim'}));assert(html.includes('value="corrected claim"'));assert(html.includes('method="get"'));assert(html.includes('>Search</button>'));});
test('suggestions never leave published guides',()=>{for(const q of ['deadline','rejection','correction','appeal'])for(const g of searchGuides(q))assert(['find-the-claim-response','choose-a-correction-or-review','build-a-deadline-evidence-record'].includes(g.slug));});
console.log(JSON.stringify({passed:count,failed:0,scope:'Search ranking, scope, escaping and server-rendered controls; not browser interaction tests'}));
