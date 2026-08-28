import { ImageResponse } from 'next/og';
import { getPosts } from '@/lib/content';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Post';

export default async function Image({ params }) {
  const { lang, slug } = await params;
  const post = getPosts(lang).find((item) => item.slug === slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#000',
          padding: 80,
          fontFamily: 'monospace',
        }}
      >
        <div style={{ display: 'flex', fontSize: 30, color: '#9c9c9c' }}>
          back2pac
        </div>

        <div style={{ display: 'flex', fontSize: 60, color: '#dcdcdc' }}>
          {post?.title ?? slug}
        </div>

        <div style={{ display: 'flex', fontSize: 30, color: '#9c9c9c' }}>
          {post?.summary ?? ''}
        </div>
      </div>
    ),
    size
  );
}