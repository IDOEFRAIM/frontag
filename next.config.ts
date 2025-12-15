// next.config.js
/** @type {import('next').NextConfig} */

const runtimeCaching = [
  {
    urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'google-fonts',
      expiration: { maxEntries: 4, maxAgeSeconds: 365 * 24 * 60 * 60 },
    },
  },
  {
    urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'static-font-assets',
      expiration: { maxEntries: 4, maxAgeSeconds: 7 * 24 * 60 * 60 },
    },
  },
  {
    urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'static-image-assets',
      expiration: { maxEntries: 64, maxAgeSeconds: 30 * 24 * 60 * 60 },
    },
  },
  {
    urlPattern: /\/_next\/image\?url=.+$/i,
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'next-image',
      expiration: { maxEntries: 64, maxAgeSeconds: 24 * 60 * 60 },
    },
  },
  {
    urlPattern: /\/api\/.*$/i,
    handler: 'NetworkFirst',
    options: {
      cacheName: 'apis',
      expiration: { maxEntries: 32, maxAgeSeconds: 24 * 60 * 60 },
      networkTimeoutSeconds: 10,
    },
  },
  {
    urlPattern: /.*/i,
    handler: 'NetworkFirst',
    options: {
      cacheName: 'others',
      expiration: { maxEntries: 32, maxAgeSeconds: 24 * 60 * 60 },
      networkTimeoutSeconds: 10,
    },
  },
];

// Configuration PWA
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // Désactive le PWA en mode dev
  runtimeCaching,
});

const nextConfig = {
  reactStrictMode: true,
};

module.exports = withPWA(nextConfig);