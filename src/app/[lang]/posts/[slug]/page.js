import { notFound } from 'next/navigation';
import { getDictionary } from '@/dictionaries';
import { getPost, getSlugs } from '@/lib/content';
import PostMeta from '@/components/PostMeta';
import PostStats from '@/components/PostStats';

// gera uma pagina estatica por post e por idioma, no momento do build
export function generateStaticParams() {
  return ['pt', 'en'].flatMap((lang) =>
    getSlugs(lang).map((slug) => ({ lang, slug }))
  );
}

// titulo e descricao proprios de cada post na aba e no compartilhamento
export async function generateMetadata({ params }) {
  const { lang, slug } = await params;
  const post = await getPost(lang, slug);

  return post ? { title: post.title, description: post.summary } : {};
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
      <PostStats slug={slug} dict={dict} countView />
      {/* html vem do seu proprio markdown, nao de entrada externa */}
      <div className="prose" dangerouslySetInnerHTML={{ __html: post.html }} />
    </article>
  );
}