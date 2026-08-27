import Link from 'next/link';
import { formatDate } from '@/lib/date';

export default function EntryList({ lang, dict, collection, entries }) {
  if (entries.length === 0) {
    return <p className="empty-state">{dict.content.empty}</p>;
  }

  return (
    <ul className="entry-list">
      {entries.map((entry) => (
        <li key={entry.slug} className="entry-list-item">
          <Link
            href={`/${lang}/${collection}/${entry.slug}`}
            className="entry-list-title"
          >
            {entry.title}
          </Link>

          <div className="entry-meta">
            <time dateTime={entry.date}>{formatDate(entry.date, lang)}</time>
            <span>
              {entry.readingTime} {dict.content.readingTime}
            </span>
            {entry.categories.map((category) => (
              <span key={category} className="tag">{category}</span>
            ))}
          </div>

          {entry.summary && <p className="entry-summary">{entry.summary}</p>}
        </li>
      ))}
    </ul>
  );
}