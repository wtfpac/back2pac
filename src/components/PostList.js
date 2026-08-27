import Link from 'next/link';
import PostMeta from './PostMeta';

// emptyMessage manda a busca dizer "nada encontrado"
export default function PostList({ lang, dict, posts, emptyMessage }) {
  if (posts.length === 0) {
    return <p className="empty-state">{emptyMessage ?? dict.content.empty}</p>;
  }

  return (
    <ul className="entry-list">
      {posts.map((post) => (
        <li key={post.slug} className="entry-list-item">
          <Link href={`/${lang}/posts/${post.slug}`} className="entry-list-title">
            <span>{post.title}</span>
          </Link>
          <PostMeta post={post} lang={lang} dict={dict} />
          {post.summary && <p className="entry-summary">{post.summary}</p>}
        </li>
      ))}
    </ul>
  );
}