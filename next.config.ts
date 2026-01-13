/** @type {import('next').NextConfig} */

const runtimeCaching = [
  // ... tes stratégies de cache (gardées identiques)
  {
    urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'google-fonts',
      expiration: { maxEntries: 4, maxAgeSeconds: 365 * 24 * 60 * 60 },
    },
  },
  // ... (le reste de ton tableau runtimeCaching)
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

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching,
});

const nextConfig = {
  reactStrictMode: true,
  // --- AJOUT DE LA CONFIGURATION DES IMAGES ICI ---
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**', // Autorise tous les chemins sur ce domaine
      },
      // Ajoute ici tes autres domaines si nécessaire (ex: Cloudinary, Firebase)
    ],
  },
};

module.exports = withPWA(nextConfig);