import { getDictionary } from '@/dictionaries';
import { getPosts } from '@/lib/content';
import Search from '@/components/Search';

// fora do menu e fora dos buscadores enquanto houver pouco conteúdo
export const metadata = { robots: { index: false } };

export function generateStaticParams() {
  return [{ lang: 'pt' }, { lang: 'en' }];
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