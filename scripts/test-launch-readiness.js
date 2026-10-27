const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
function load(p) { const output = ts.transpileModule(read(p), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText; const context = { exports: {} }; vm.runInNewContext(output, context); return context.exports; }
const { buildEvidenceChecklist } = load('lib/v3/evidence-checklist.ts');
let count = 0;
function test(name, fn) { fn(); count++; console.log('PASS ' + name); }
for (const stage of ['unknown', 'front', 'adjudicated']) for (const scope of ['unknown', 'known']) for (const finding of ['unknown', 'discrepancy', 'accurate']) {
 test(`${stage}/${scope}/${finding}`, () => {
  const steps = buildEvidenceChecklist({ stage, scope, finding });
  assert(steps.some(s => s.includes('deadline')));
  assert(steps.some(s => s.includes('receipt evidence')));
  if (scope === 'unknown') assert(steps.some(s => s.includes('Establish the payer')));
  if (finding === 'unknown') assert(steps.some(s => s.includes('unknown or conflicting')));
  if (finding === 'discrepancy' && (scope === 'unknown' || stage === 'unknown')) assert(steps.some(s => s.includes('before choosing a submission method')));
  if (finding === 'accurate') assert(steps.some(s => s.includes('available to your role')));
 });
}
test('analytics disabled', () => assert.equal(load('app/components/Analytics.tsx').Analytics(), null));
test('raw query not sent in search event', () => assert(!read('app/components/v3/SearchResults.tsx').includes('search_term:')));
test('search disclosure and length cap', () => { const s=read('app/components/v3/SearchBox.tsx');assert(s.includes('search-privacy'));assert(s.includes('maxLength={180}')); });
test('feedback processor and patient warning visible', () => { const s=read('app/components/FeedbackForm.tsx');assert(s.includes('Do not send patient names'));assert(s.includes('through Web3Forms')); });
test('privacy reflects ad-free candidate', () => {const s=read('app/privacy-policy/page.tsx');assert(!s.includes('DART'));assert(s.includes('does not load Google Analytics or Google AdSense'));});
test('tool avoids storage and network submission', () => {const s=read('app/tools/evidence-checklist/tool.tsx');assert(!/fetch\(|localStorage|sessionStorage|sendBeacon/.test(s));});
test('changing selections invalidates stale result', () => assert(read('app/tools/evidence-checklist/tool.tsx').includes('setState(s => ({ ...s, ...update })); setResult(null)')));
console.log(JSON.stringify({passed:count,failed:0,scope:'18 decision cases and 7 release-candidate regression checks; not source or legal verification'}));
