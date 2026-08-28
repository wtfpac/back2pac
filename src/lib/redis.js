import { Redis } from '@upstash/redis';

let client;

// cria o cliente so no primeiro uso, nao ao importar o arquivo:
// durante o build ninguem chama isso, entao nada e conectado
export function getRedis() {
  if (!client) {
    // os nomes vem da integracao do upstash na vercel; se aparecerem
    // diferentes no painel, ajuste aqui
    client = new Redis({
      url: process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }

  return client;
}

// chaves sem idioma: o mesmo post em pt e en compartilha os numeros
export const viewsKey = (slug) => `views:${slug}`;
export const likesKey = (slug) => `likes:${slug}`;

// marca de quem ja curtiu, para recusar repeticao
export const voterKey = (slug, ip) => `liked:${slug}:${ip}`;