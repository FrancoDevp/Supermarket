let userConfig = undefined;
try {
  userConfig = await import('./v0-user-next.config');
} catch (e) {
  // ignore error
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,

  assetPrefix: './', // Usa rutas relativas para compatibilidad total

  images: {
    unoptimized: true,
    loader: 'custom',
    loaderFile: './image-loader.js', // Opcional para mayor control
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },

  reactStrictMode: false, // Desactivado para evitar doble renderizado en dev
  compress: true,
  productionBrowserSourceMaps: false,

  generateBuildId: async () => 'build-' + Date.now(), // Evita cacheo no deseado
};

if (userConfig) {
  const config = userConfig.default || userConfig;
  for (const key in config) {
    if (typeof nextConfig[key] === 'object' && !Array.isArray(nextConfig[key])) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...config[key],
      };
    } else {
      nextConfig[key] = config[key];
    }
  }
}

export default nextConfig;