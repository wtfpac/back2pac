import { NextResponse } from 'next/server';
import {
  getRedis, getRatelimit, getIp, getVisitorId,
  viewsKey, likesKey, voterKey, ipQuotaKey,
} from '@/lib/redis';
import { getSlugs } from '@/lib/content';

const ONE_DAY = 60 * 60 * 24;

// quantas curtidas um mesmo ip pode iniciar por post por dia.
// alto o bastante para uma sala de aula inteira
const IP_DAILY_CAP = 20;

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

  const visitorId = getVisitorId(request);
  const keys = [viewsKey(slug), likesKey(slug)];

  // sem id nao da para saber se este visitante curtiu
  if (visitorId) keys.push(voterKey(slug, visitorId));

  const [views, likes, voted] = await getRedis().mget(...keys);

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
    const visitorId = getVisitorId(request);
    if (!visitorId) {
      return NextResponse.json({ error: 'identificador ausente' }, { status: 400 });
    }

    const key = voterKey(slug, visitorId);

    // ja curtiu: este clique desfaz. nao devolve vaga da cota do ip,
    // senao curtir e descurtir em laco burlaria o teto
    if (await redis.get(key)) {
      await redis.del(key);
      const likes = await redis.decr(likesKey(slug));

      if (likes < 0) {
        await redis.set(likesKey(slug), 0);
        return NextResponse.json({ likes: 0, liked: false });
      }

      return NextResponse.json({ likes, liked: false });
    }

    // consome uma vaga do teto diario do ip
    const quota = ipQuotaKey(slug, getIp(request));
    const used = await redis.incr(quota);
    if (used === 1) await redis.expire(quota, ONE_DAY);

    if (used > IP_DAILY_CAP) {
      await redis.decr(quota);
      const likes = await redis.get(likesKey(slug));

      return NextResponse.json(
        { likes: Number(likes ?? 0), liked: false, limited: true },
        { status: 429 }
      );
    }

    // a marca do navegador nao expira: ela e o que diz se voce curtiu
    await redis.set(key, 1);
    const likes = await redis.incr(likesKey(slug));

    return NextResponse.json({ likes, liked: true });
  }

  return NextResponse.json({ error: 'acao invalida' }, { status: 400 });
}