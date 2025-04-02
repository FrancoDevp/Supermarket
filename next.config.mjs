let userConfig = undefined;
try {
  userConfig = await import('./v0-user-next.config');
} catch (e) {
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',                   // Habilita exportación estática
  trailingSlash: true,                // Necesario para rutas en Netlify
  images: {
    unoptimized: true,                // Requerido para export estático
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://supermarketfran.netlify.app' : '', // Fix para recursos estáticos

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

  reactStrictMode: true,
  compress: true,
  productionBrowserSourceMaps: false
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