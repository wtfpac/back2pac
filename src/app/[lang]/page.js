import Link from 'next/link';
import { getDictionary } from '@/dictionaries';
import { getPosts } from '@/lib/content';
import { websiteSchema } from '@/lib/schema';
import PostList from '@/components/PostList';

export function generateStaticParams() {
  return [{ lang: 'pt' }, { lang: 'en' }];
}

export default async function Home({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  // so os cinco mais recentes; o resto fica na pagina de posts
  const posts = getPosts(lang).slice(0, 5);

  return (
    <main>
      {/* dado para buscador, nao roda nada no navegador */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema(lang, dict)) }}
      />

      <div className="name-box">
        <p className="name-box-title">Wellington Alves</p>
        <p className="name-box-sub">{dict.hero.role}</p>
      </div>

      <h2 className="page-title">{dict.content.recentPosts}</h2>
      <PostList lang={lang} dict={dict} posts={posts} />

      <Link href={`/${lang}/posts`} className="button-row">
        {dict.content.allPosts}
      </Link>
    </main>
  );
}