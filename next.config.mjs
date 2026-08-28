const securityHeaders = [
  // impede o navegador de adivinhar o tipo do arquivo e executar
  // algo como se fosse script
  { key: 'X-Content-Type-Options', value: 'nosniff' },

  // ninguem consegue embutir seu site num iframe para simular cliques
  { key: 'X-Frame-Options', value: 'DENY' },

  // nao vaza a url completa da sua pagina para sites de terceiros
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },

  // o site nao usa camera, microfone nem localizacao
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },

  // navegador so acessa por https, mesmo se digitarem http
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // avaliado uma vez, no build: vira o horario do ultimo deploy no rodape
  env: {
    BUILD_TIME: new Date().toISOString(),
  },

  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },

  async rewrites() {
    return [{ source: '/admin', destination: '/admin/index.html' }];
  },
};

export default nextConfig;