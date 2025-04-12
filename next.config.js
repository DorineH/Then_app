/* eslint-disable @typescript-eslint/no-require-imports */
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {},
  },
  i18n: {
    locales: ['fr', 'en'],
    defaultLocale: 'fr'
  }
};

module.exports = withPWA(nextConfig);