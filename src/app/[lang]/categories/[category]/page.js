import { notFound } from 'next/navigation';
import { getDictionary } from '@/dictionaries';
import { getCategories, getPostsByCategory } from '@/lib/content';
import PostList from '@/components/PostList';

// Gera uma página por categoria encontrada nos posts, em cada idioma
export function generateStaticParams() {
  return ['pt', 'en'].flatMap((lang) =>
    getCategories(lang).map(({ slug }) => ({ lang, category: slug }))
  );
}

export async function generateMetadata({ params }) {
  const { lang, category } = await params;
  const found = getCategories(lang).find((item) => item.slug === category);

  return found ? { title: found.name } : {};
}

export default async function CategoryPage({ params }) {
  const { lang, category } = await params;
  const dict = await getDictionary(lang);

  // Precisamos do nome original para o título, a url so tem slug
  const found = getCategories(lang).find((item) => item.slug === category);
  if (!found) notFound();

  return (
    <main>
      <h1 className="page-title">{found.name}</h1>
      <PostList lang={lang} dict={dict} posts={getPostsByCategory(lang, category)} />
    </main>
  );
}