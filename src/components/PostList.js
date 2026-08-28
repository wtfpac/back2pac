import Link from 'next/link';
import PostMeta from './PostMeta';
import PostStats from './PostStats';

// emptyMessage permite a busca dizer "nada encontrado" em vez de "nada publicado"
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
          {post.summary && <p className="entry-summary">{post.summary}</p>}
          <PostMeta post={post} lang={lang} dict={dict}>
            {/* sem countView: visualizar a lista nao conta como leitura */}
            <PostStats slug={post.slug} dict={dict} />
          </PostMeta>
        </li>
      ))}
    </ul>
  );
}