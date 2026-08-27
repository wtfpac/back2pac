const LOCALES = { pt: 'pt-BR', en: 'en-US' };

export default function PostMeta({ post, lang, dict, showWordCount = false }) {
  const date = post.date
    ? new Date(post.date).toLocaleDateString(LOCALES[lang] ?? LOCALES.pt, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'UTC',
      })
    : null;

  return (
    <div className="entry-meta">
      {date && <time dateTime={post.date}>{date}</time>}
      <span>{post.readingTime} {dict.content.readingTime}</span>
      {showWordCount && <span>{post.wordCount} {dict.content.words}</span>}
      {post.categories.map((category) => (
        <span key={category} className="tag">{category}</span>
      ))}
    </div>
  );
}