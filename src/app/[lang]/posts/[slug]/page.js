import { notFound } from 'next/navigation';
import { getDictionary } from '@/dictionaries';
import { getPost, getSlugs, getSettings } from '@/lib/content';
import { FULL_NAME } from '@/lib/schema';
import PostMeta from '@/components/PostMeta';
import PostStats from '@/components/PostStats';

const LANGUAGES = ['pt', 'en'];

// gera uma pagina estatica por post e por idioma, no momento do build
export function generateStaticParams() {
  return LANGUAGES.flatMap((lang) =>
    getSlugs(lang).map((slug) => ({ lang, slug }))
  );
}

// titulo, descricao, url oficial e versoes em outros idiomas
export async function generateMetadata({ params }) {
  const { lang, slug } = await params;
  const post = await getPost(lang, slug);

  if (!post) return {};

  const { siteUrl } = getSettings();
  const url = `${siteUrl}/${lang}/posts/${slug}`;

  // so declara versao em outro idioma se o arquivo existir de verdade.
  // um post escrito so em portugues nao aponta para um /en que da 404
  const languages = {};
  for (const other of LANGUAGES) {
    if (getSlugs(other).includes(slug)) {
      languages[other] = `${siteUrl}/${other}/posts/${slug}`;
    }
  }
  if (languages.pt) languages['x-default'] = languages.pt;

  return {
    title: post.title,
    description: post.summary,

    alternates: {
      // sem isto o google pode considerar as duas versoes como duplicata
      canonical: url,
      languages,
      // repetido do layout: metadata de pagina substitui o do layout
      // inteiro, entao sem esta linha o post perde o link do rss
      types: { 'application/rss+xml': `${siteUrl}/${lang}/rss.xml` },
    },

    openGraph: {
      type: 'article',
      url,
      title: post.title,
      description: post.summary,
      locale: lang === 'pt' ? 'pt_BR' : 'en_US',
      publishedTime: post.date ?? undefined,
      authors: [FULL_NAME],
      tags: post.categories,
    },
  };
}

export default async function PostPage({ params }) {
  const { lang, slug } = await params;

  // promise.all carrega dicionario e post em paralelo, nao um apos o outro
  const [dict, post] = await Promise.all([getDictionary(lang), getPost(lang, slug)]);

  if (!post) notFound();

  return (
    <article className="entry-article">
      <h1 className="page-title">{post.title}</h1>
      <PostMeta post={post} lang={lang} dict={dict} showWordCount />
      <div className="post-stats">
        <PostStats slug={slug} dict={dict} countView />
      </div>
      {/* html vem do seu proprio markdown, nao de entrada externa */}
      <div className="prose" dangerouslySetInnerHTML={{ __html: post.html }} />
    </article>
  );
}