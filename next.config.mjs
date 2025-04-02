let userConfig = undefined;
try {
  userConfig = await import('./v0-user-next.config');
} catch (e) {
  // ignore error
}

const nextConfig = {
  output: 'export',
  trailingSlash: true,

  // Configuración esencial simplificada
  images: {
    unoptimized: true,  // Elimina el loader custom para Netlify
  },

  // Configuración de desarrollo
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Elimina configuraciones experimentales problemáticas
  // experimental: {},  // Comenta o elimina esta sección

  // Optimizaciones
  reactStrictMode: false,
  compress: true,
  productionBrowserSourceMaps: false,

  // Generación de build
  generateBuildId: async () => 'build-' + Date.now(),
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