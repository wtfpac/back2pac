import { NextResponse } from 'next/server';
import { getRedis, getRatelimit, getIp, viewsKey, likesKey } from '@/lib/redis';
import { getSlugs } from '@/lib/content';

// so leitura: a lista mostra numeros, nao registra nada
export async function GET(request) {
  const { success } = await getRatelimit().limit(getIp(request));
  if (!success) {
    return NextResponse.json({ error: 'muitas requisicoes' }, { status: 429 });
  }

  const slugs = [...new Set(['pt', 'en'].flatMap((lang) => getSlugs(lang)))];
  if (slugs.length === 0) return NextResponse.json({});

  // uma unica ida ao banco para todos os posts:
  // primeiro todas as views, depois todos os likes
  const keys = [...slugs.map(viewsKey), ...slugs.map(likesKey)];
  const values = await getRedis().mget(...keys);

  const stats = {};
  slugs.forEach((slug, index) => {
    stats[slug] = {
      views: Number(values[index] ?? 0),
      likes: Number(values[index + slugs.length] ?? 0),
    };
  });

  return NextResponse.json(stats);
}