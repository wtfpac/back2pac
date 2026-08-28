import { NextResponse } from 'next/server';
import { getRedis, getRatelimit, getIp, viewsKey, likesKey, voterKey } from '@/lib/redis';
import { getSlugs } from '@/lib/content';

// so leitura: a lista mostra numeros, nao registra nada
export async function GET(request) {
  const ip = getIp(request);

  const { success } = await getRatelimit().limit(ip);
  if (!success) {
    return NextResponse.json({ error: 'muitas requisicoes' }, { status: 429 });
  }

  const slugs = [...new Set(['pt', 'en'].flatMap((lang) => getSlugs(lang)))];
  if (slugs.length === 0) return NextResponse.json({});

  // uma unica ida ao banco: views, likes e a marca deste ip, nessa ordem
  const keys = [
    ...slugs.map(viewsKey),
    ...slugs.map(likesKey),
    ...slugs.map((slug) => voterKey(slug, ip)),
  ];
  const values = await getRedis().mget(...keys);

  const stats = {};
  slugs.forEach((slug, index) => {
    stats[slug] = {
      views: Number(values[index] ?? 0),
      likes: Number(values[index + slugs.length] ?? 0),
      liked: Boolean(values[index + slugs.length * 2]),
    };
  });

  return NextResponse.json(stats);
}