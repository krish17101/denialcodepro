const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../plugins/runtime-notice-audit/index.js'), 'utf8');
const cases = [
  ['PR preview', { CONTEXT: 'deploy-preview' }, true],
  ['dedicated staging default branch', { CONTEXT: 'production', URL: 'https://denialcodepro-guide-staging.netlify.app' }, true],
  ['live apex excluded', { CONTEXT: 'production', URL: 'https://denialcodepro.com' }, false],
  ['live Netlify host excluded', { CONTEXT: 'production', URL: 'https://denialcode.netlify.app' }, false],
  ['missing identity excluded', { CONTEXT: 'production' }, false],
  ['similar hostname excluded', { CONTEXT: 'production', URL: 'https://denialcodepro-guide-staging.netlify.app.example.com' }, false],
  ['local context excluded', { URL: 'https://denialcodepro-guide-staging.netlify.app' }, false],
];
for (const [label, env, expected] of cases) {
  let executions = 0;
  const sandbox = {
    module: { exports: {} }, __dirname: '/audit', process: { env },
    console: { log() {} },
    require(name) {
      if (name === 'node:path') return path;
      if (name === 'node:child_process') return { execFileSync(command, args) {
        executions++; assert.equal(command, 'python3');
        assert.equal(args[1], '/fixture/functions'); return '{"schema":1,"bundles":[]}';
      } };
      throw new Error('Unexpected dependency');
    },
  };
  vm.runInNewContext(source, sandbox);
  sandbox.module.exports.onPostBuild({ constants: { FUNCTIONS_DIST: '/fixture/functions' }, utils: { build: { failBuild(message) { throw new Error(message); } } } });
  assert.equal(executions, expected ? 1 : 0, label);
  console.log('PASS ' + label);
}
console.log('7 context-routing checks passed; mocked subprocess, not a hosted audit');
