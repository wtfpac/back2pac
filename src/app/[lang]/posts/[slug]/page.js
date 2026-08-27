import { notFound } from 'next/navigation';
import { getDictionary } from '@/dictionaries';
import { getEntry, getSlugs } from '@/lib/content';
import { formatDate } from '@/lib/date';

export function generateStaticParams() {
  return ['pt', 'en'].flatMap((lang) =>
    getSlugs('posts', lang).map((slug) => ({ lang, slug }))
  );
}

export async function generateMetadata({ params }) {
  const { lang, slug } = await params;
  const entry = await getEntry('posts', lang, slug);
  if (!entry) return {};

  return { title: entry.title, description: entry.summary };
}

export default async function PostPage({ params }) {
  const { lang, slug } = await params;
  const [dict, entry] = await Promise.all([
    getDictionary(lang),
    getEntry('posts', lang, slug),
  ]);

  if (!entry) notFound();

  return (
    <article className="entry-article">
      <h1 className="page-title">{entry.title}</h1>

      <div className="entry-meta">
        <time dateTime={entry.date}>{formatDate(entry.date, lang)}</time>
        <span>
          {entry.readingTime} {dict.content.readingTime}
        </span>
        <span>
          {entry.wordCount} {dict.content.words}
        </span>
        {entry.categories.map((category) => (
          <span key={category} className="tag">{category}</span>
        ))}
      </div>

      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: entry.html }}
      />
    </article>
  );
}