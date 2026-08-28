import { NextResponse } from 'next/server';
import { getRedis, getRatelimit, getIp, viewsKey, likesKey, voterKey } from '@/lib/redis';
import { getSlugs } from '@/lib/content';

// sem isso, qualquer um poderia criar chaves inventadas e encher o banco
function isKnownSlug(slug) {
  return ['pt', 'en'].some((lang) => getSlugs(lang).includes(slug));
}

async function checkLimit(request) {
  const { success } = await getRatelimit().limit(getIp(request));
  return success;
}

export async function GET(request, { params }) {
  const { slug } = await params;
  if (!isKnownSlug(slug)) {
    return NextResponse.json({ error: 'post inexistente' }, { status: 404 });
  }

  if (!(await checkLimit(request))) {
    return NextResponse.json({ error: 'muitas requisicoes' }, { status: 429 });
  }

  // mget busca as tres chaves numa unica ida ao banco
  const [views, likes, voted] = await getRedis().mget(
    viewsKey(slug),
    likesKey(slug),
    voterKey(slug, getIp(request))
  );

  return NextResponse.json({
    views: Number(views ?? 0),
    likes: Number(likes ?? 0),
    liked: Boolean(voted),
  });
}

export async function POST(request, { params }) {
  const { slug } = await params;
  if (!isKnownSlug(slug)) {
    return NextResponse.json({ error: 'post inexistente' }, { status: 404 });
  }

  if (!(await checkLimit(request))) {
    return NextResponse.json({ error: 'muitas requisicoes' }, { status: 429 });
  }

  const { action } = await request.json().catch(() => ({}));
  const redis = getRedis();

  if (action === 'view') {
    // incr e atomico: dois acessos simultaneos nao se sobrescrevem
    const views = await redis.incr(viewsKey(slug));
    return NextResponse.json({ views });
  }

  if (action === 'like') {
    const key = voterKey(slug, getIp(request));

    // a marca do ip nao expira mais: ela e o que diz se voce
    // curtiu ou nao, e precisa valer enquanto a curtida valer
    if (await redis.get(key)) {
      await redis.del(key);
      const likes = await redis.decr(likesKey(slug));

      // protege contra negativo se as chaves saírem de sincronia
      if (likes < 0) {
        await redis.set(likesKey(slug), 0);
        return NextResponse.json({ likes: 0, liked: false });
      }

      return NextResponse.json({ likes, liked: false });
    }

    await redis.set(key, 1);
    const likes = await redis.incr(likesKey(slug));

    return NextResponse.json({ likes, liked: true });
  }

  return NextResponse.json({ error: 'acao invalida' }, { status: 400 });
}