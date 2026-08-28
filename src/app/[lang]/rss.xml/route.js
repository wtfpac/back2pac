import { getPosts, getSettings } from '@/lib/content';
import { getDictionary } from '@/dictionaries';

export function generateStaticParams() {
  return [{ lang: 'pt' }, { lang: 'en' }];
}

// & < > " viram entidades, senao o xml fica invalido
function escapeXml(value = '') {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function GET(request, { params }) {
  const { lang } = await params;
  const { siteUrl } = getSettings();
  const dict = await getDictionary(lang);

  const items = getPosts(lang)
    .map((post) => {
      const url = `${siteUrl}/${lang}/posts/${post.slug}`;

      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.summary)}</description>${
        post.date ? `\n      <pubDate>${new Date(post.date).toUTCString()}</pubDate>` : ''
      }
    </item>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(dict.meta.title)}</title>
    <link>${siteUrl}/${lang}</link>
    <description>${escapeXml(dict.meta.description)}</description>
    <language>${lang === 'pt' ? 'pt-BR' : 'en-US'}</language>
    <atom:link href="${siteUrl}/${lang}/rss.xml" rel="self" type="application/rss+xml" />${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}