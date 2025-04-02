let userConfig = undefined;
try {
  userConfig = await import('./v0-user-next.config');
} catch (e) {
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/Supermarket',
  trailingSlash: true,
  assetPrefix: '/Supermarket/',

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },

  reactStrictMode: true,
  compress: true,
  productionBrowserSourceMaps: false,
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