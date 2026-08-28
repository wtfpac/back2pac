import { ImageResponse } from 'next/og';
import { getDictionary } from '@/dictionaries';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Back 2 Pac';

export default async function Image({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

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

        <div style={{ display: 'flex', fontSize: 68, color: '#dcdcdc' }}>
          Wellington Alves
        </div>

        <div style={{ display: 'flex', fontSize: 30, color: '#9c9c9c' }}>
          {dict.hero.role}
        </div>
      </div>
    ),
    size
  );
}