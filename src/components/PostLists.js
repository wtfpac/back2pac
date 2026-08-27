import Link from 'next/link';
import PostMeta from './PostMeta';

export default function PostList({ lang, dict, posts }) {
  if (posts.length === 0) {
    return <p className="empty-state">{dict.content.empty}</p>;
  }

  return (
    <ul className="entry-list">
      {posts.map((post) => (
        <li key={post.slug} className="entry-list-item">
          <Link href={`/${lang}/posts/${post.slug}`} className="entry-list-title">
            {post.title}
          </Link>
          <PostMeta post={post} lang={lang} dict={dict} />
          {post.summary && <p className="entry-summary">{post.summary}</p>}
        </li>
      ))}
    </ul>
  );
}