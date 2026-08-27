import { getSettings, getSlugs, getCategories } from '@/lib/content';

const LANGUAGES = ['pt', 'en'];

// o next transforma o que esta função devolve no arquivo /sitemap.xml
export default function sitemap() {
  const { siteUrl } = getSettings();
  const routes = [];

  for (const lang of LANGUAGES) {
    routes.push(
      { url: `${siteUrl}/${lang}`, changeFrequency: 'monthly', priority: 1 },
      { url: `${siteUrl}/${lang}/posts`, changeFrequency: 'weekly', priority: 0.8 },
      { url: `${siteUrl}/${lang}/categories`, changeFrequency: 'monthly', priority: 0.5 }
    );

    for (const slug of getSlugs(lang)) {
      routes.push({
        url: `${siteUrl}/${lang}/posts/${slug}`,
        changeFrequency: 'yearly',
        priority: 0.7,
      });
    }

    for (const { slug } of getCategories(lang)) {
      routes.push({
        url: `${siteUrl}/${lang}/categories/${slug}`,
        changeFrequency: 'monthly',
        priority: 0.4,
      });
    }
  }

  // a busca fica de fora de propósito: é uma página sem conteúdo próprio
  return routes;
}