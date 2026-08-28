import Link from 'next/link';
import { slugify } from '@/lib/slug';

const LOCALES = { pt: 'pt-BR', en: 'en-US' };

// usado na listagem e na pagina do post; showWordCount separa os dois casos.
// children entra no fim da mesma linha de metadados
export default function PostMeta({ post, lang, dict, showWordCount = false, children }) {
  const date = post.date
    ? new Date(post.date).toLocaleDateString(LOCALES[lang] ?? LOCALES.pt, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        // sem utc a data pode voltar um dia dependendo do fuso do visitante
        timeZone: 'UTC',
      })
    : null;

  return (
    <div className="entry-meta">
      {date && <time dateTime={post.date}>{date}</time>}

      <span>{post.readingTime} {dict.content.readingTime}</span>

      {showWordCount && <span>{post.wordCount} {dict.content.words}</span>}

      {post.categories.map((category) => (
        <Link
          key={category}
          href={`/${lang}/categories/${slugify(category)}`}
          className="tag"
        >
          {category}
        </Link>
      ))}

      {children}
    </div>
  );
}