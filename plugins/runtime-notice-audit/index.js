const { execFileSync } = require('node:child_process');
const path = require('node:path');

module.exports = {
  onPostBuild({ constants, utils }) {
    // The dedicated staging site's default branch uses Netlify's production context.
    // Never enable this audit for the live site's production context.
    const stagingBuild = process.env.CONTEXT === 'production' &&
      process.env.URL === 'https://denialcodepro-guide-staging.netlify.app';
    if (process.env.CONTEXT !== 'deploy-preview' && !stagingBuild) return;
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
