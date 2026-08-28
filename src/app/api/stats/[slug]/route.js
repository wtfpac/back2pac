import { NextResponse } from 'next/server';
import { getRedis, viewsKey, likesKey, voterKey } from '@/lib/redis';
import { getSlugs } from '@/lib/content';

const ONE_DAY = 60 * 60 * 24;

// sem isso, qualquer um poderia criar chaves inventadas e encher o banco
function isKnownSlug(slug) {
  return ['pt', 'en'].some((lang) => getSlugs(lang).includes(slug));
}

function getIp(request) {
  // atras da vercel o ip real vem no x-forwarded-for, primeiro da lista
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0].trim() ?? 'desconhecido';
}

export async function GET(request, { params }) {
  const { slug } = await params;
  if (!isKnownSlug(slug)) {
    return NextResponse.json({ error: 'post inexistente' }, { status: 404 });
  }

  // mget busca as duas chaves numa unica ida ao banco
  const [views, likes] = await getRedis().mget(viewsKey(slug), likesKey(slug));

  return NextResponse.json({
    views: Number(views ?? 0),
    likes: Number(likes ?? 0),
  });
}

export async function POST(request, { params }) {
  const { slug } = await params;
  if (!isKnownSlug(slug)) {
    return NextResponse.json({ error: 'post inexistente' }, { status: 404 });
  }

  const { action } = await request.json().catch(() => ({}));
  const redis = getRedis();

  if (action === 'view') {
    // incr e atomico: dois acessos simultaneos nao se sobrescrevem
    const views = await redis.incr(viewsKey(slug));
    return NextResponse.json({ views });
  }

  if (action === 'like') {
    const ip = getIp(request);

    // set com nx grava so se a chave nao existe; se existir,
    // este ip ja curtiu dentro das ultimas 24h
    const first = await redis.set(voterKey(slug, ip), 1, { nx: true, ex: ONE_DAY });

    if (!first) {
      const likes = await redis.get(likesKey(slug));
      return NextResponse.json({ likes: Number(likes ?? 0), alreadyLiked: true });
    }

    const likes = await redis.incr(likesKey(slug));
    return NextResponse.json({ likes });
  }

  return NextResponse.json({ error: 'acao invalida' }, { status: 400 });
}