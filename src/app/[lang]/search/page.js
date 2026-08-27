import { getDictionary } from '@/dictionaries';
import { getPosts } from '@/lib/content';
import Search from '@/components/Search';

export function generateStaticParams() {
  return [{ lang: 'pt' }, { lang: 'en' }];
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  // Fora do menu e fora dos buscadores enquanto houver pouco conteúdo
  return { title: dict.nav.search, robots: { index: false } };
}

export default async function SearchPage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <main>
      <h1 className="page-title">{dict.nav.search}</h1>
      <Search lang={lang} dict={dict} posts={getPosts(lang)} />
    </main>
  );
}