const { publicIndexingEnabled } = require('./lib/public/indexing.cjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Inline only the public robots decision; never bundle the host environment.
  env: { DCP_BUILD_INDEXABLE: publicIndexingEnabled(process.env) ? 'yes' : 'no' },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
