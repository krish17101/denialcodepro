const { execFileSync } = require('node:child_process');
const path = require('node:path');

module.exports = {
  onPostBuild({ constants, utils }) {
    // Evidence gathering on previews only; no writes to the function or public assets.
    if (process.env.CONTEXT !== 'deploy-preview') return;
    try {
      const output = execFileSync('python3', [
        path.join(__dirname, 'inspect_bundle.py'), constants.FUNCTIONS_DIST,
      ], { encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 });
      console.log('DCP_RUNTIME_NOTICE_AUDIT ' + output.trim());
    } catch {
      // Do not print the inherited environment or arbitrary subprocess output.
      utils.build.failBuild('Preview runtime notice inventory could not be completed. Inspect the audit input format; no bundle was changed.');
    }
  },
};
