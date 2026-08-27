import { getSettings } from '@/lib/content';

// o next transforma o retorno desta função no arquivo /robots.txt
export default function robots() {
  const { siteUrl } = getSettings();

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/pt/search', '/en/search'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}