/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@bahi/types', '@bahi/applications', '@bahi/app-inventory'],
};

module.exports = nextConfig;
