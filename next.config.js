/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Full-size works live in the project's Vercel Blob store.
    remotePatterns: [new URL('https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/**')],
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 90],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Replace Node modules with empty mocks for client-side bundles
      config.resolve.fallback = {
        fs: false,  // This effectively emulates 'fs': 'empty'
        // Add other modules here if needed
      };
    }
  
    config.module.rules.push({
      test: /\.(glsl|vs|fs)$/,
      loader: 'webpack-glsl-loader',
    });

    // Return the modified config
    return config;
  }
}

module.exports = nextConfig
