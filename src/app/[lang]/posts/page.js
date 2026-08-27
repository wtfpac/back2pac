import { getDictionary } from '@/dictionaries';
import { getPosts } from '@/lib/content';
import PostList from '@/components/PostList';

export function generateStaticParams() {
  return [{ lang: 'pt' }, { lang: 'en' }];
}

export default async function PostsPage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <main>
      <h1 className="page-title">{dict.content.postsTitle}</h1>
      <p className="page-intro">{dict.content.postsIntro}</p>
      <PostList lang={lang} dict={dict} posts={getPosts(lang)} />
    </main>
  );
}