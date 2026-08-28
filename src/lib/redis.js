import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

let client;
let limiter;

// cria o cliente so no primeiro uso, nao ao importar o arquivo:
// durante o build ninguem chama isso, entao nada e conectado
export function getRedis() {
  if (!client) {
    // os nomes vem da integracao do upstash na vercel
    client = new Redis({
      url: process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }

  return client;
}

export function getRatelimit() {
  if (!limiter) {
    limiter = new Ratelimit({
      redis: getRedis(),
      // 30 por minuto por ip: folgado para uso normal,
      // suficiente para barrar script em laco
      limiter: Ratelimit.slidingWindow(30, '1 m'),
      prefix: 'rl:stats',
      // analytics gasta comandos extras da cota
      analytics: false,
    });
  }

  return limiter;
}

// atras da vercel o ip real vem no x-forwarded-for, primeiro da lista
export function getIp(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0].trim() ?? 'desconhecido';
}

// chaves sem idioma: o mesmo post em pt e en compartilha os numeros
export const viewsKey = (slug) => `views:${slug}`;
export const likesKey = (slug) => `likes:${slug}`;

// marca de quem ja curtiu, para recusar repeticao
export const voterKey = (slug, ip) => `liked:${slug}:${ip}`;