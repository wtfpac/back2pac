import { getSettings, getSlugs, getCategories } from '@/lib/content';

const LANGUAGES = ['pt', 'en'];

// Agrupa por caminho, registrando em quais idiomas ele existe.
// Um post só escrito em português não vai declarar versão em inglês.
function addPath(paths, path, lang, options) {
    const entry = paths.get(path) ?? { path, langs: [], ...options };
    entry.langs.push(lang);
    paths.set(path, entry);
}

export default function sitemap() {
    const { siteUrl } = getSettings();
    const paths = new Map();

    for (const lang of LANGUAGES) {
        addPath(paths, '', lang, { changeFrequency: 'monthly', priority: 1 });
        addPath(paths, '/posts', lang, { changeFrequency: 'weekly', priority: 0.8 });
        addPath(paths, '/categories', lang, { changeFrequency: 'monthly', priority: 0.5 });

        for (const slug of getSlugs(lang)) {
            addPath(paths, `/posts/${slug}`, lang, {
                changeFrequency: 'yearly',
                priority: 0.7,
            });
        }

        for (const { slug } of getCategories(lang)) {
            addPath(paths, `/categories/${slug}`, lang, {
                changeFrequency: 'monthly',
                priority: 0.4,
            });
        }
    }

    return [...paths.values()].flatMap(({ path, langs, ...options }) => {
        const languages = Object.fromEntries(
            langs.map((lang) => [lang, `${siteUrl}/${lang}${path}`])
        );

        // Versão mostrada a quem não bate com nenhum dos idiomas acima,
        // igual ao que o proxy.js faz com o visitante
        if (languages.pt) languages['x-default'] = languages.pt;

        // Cada idioma vira uma entrada, todas apontando umas para as outras
        return langs.map((lang) => ({
            url: `${siteUrl}/${lang}${path}`,
            ...options,
            alternates: { languages },
        }));
    });
}