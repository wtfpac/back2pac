/** @type {import('next').NextConfig} */
const nextConfig = {
  // avaliado uma vez, no build: vira o horario do ultimo deploy no rodape
  env: {
    BUILD_TIME: new Date().toISOString(),
  },

  async rewrites() {
    return [{ source: '/admin', destination: '/admin/index.html' }];
  },
};

export default nextConfig;