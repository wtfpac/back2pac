import Link from 'next/link';
import { getDictionary } from '@/dictionaries';
import { getCategories } from '@/lib/content';

export function generateStaticParams() {
  return [{ lang: 'pt' }, { lang: 'en' }];
}

export default async function CategoriesPage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const categories = getCategories(lang);

  if (categories.length === 0) {
    return (
      <main>
        <h1 className="page-title">{dict.nav.categories}</h1>
        <p className="empty-state">{dict.content.empty}</p>
      </main>
    );
  }

  return (
    <main>
      <h1 className="page-title">{dict.nav.categories}</h1>
      <ul className="category-list">
        {categories.map((category) => (
          <li key={category.slug}>
            <Link href={`/${lang}/categories/${category.slug}`}>{category.name}</Link>
            <span className="category-count">{category.count}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}