const { analyticsProduction } = require('./lib/public/analytics-environment.cjs');
const { publicIndexingEnabled } = require('./lib/public/indexing.cjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Bake in the two public decisions independently. Never bundle the host environment.
  env: {
    DCP_BUILD_INDEXABLE: publicIndexingEnabled(process.env) ? 'yes' : 'no',
    DCP_BUILD_OPTIONAL_ANALYTICS: analyticsProduction(process.env) ? 'yes' : 'no',
  },
  async redirects() {
    return [
      { source: '/adjustment-codes', destination: '/guides', permanent: true },
      ...['CO-19', 'CO-22'].map(code => ({
        source: '/code/' + code, destination: '/search?q=' + code, permanent: false,
      })),
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
