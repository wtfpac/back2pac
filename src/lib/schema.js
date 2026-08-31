import { getSettings } from '@/lib/content';

// nome completo aqui de proposito: nao aparece na tela, mas e por ele que
// o google liga a pessoa ao site quando alguem pesquisa
export const FULL_NAME = 'Wellington Alves Clemente';
const SHORT_NAME = 'Wellington Alves';

// id fixo para as duas paginas falarem da mesma pessoa. sem isso o google
// pode entender que sao dois wellingtons diferentes
function personId(siteUrl) {
  return `${siteUrl}/#person`;
}

export function personSchema(lang, dict) {
  const { siteUrl } = getSettings();

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': personId(siteUrl),

    name: FULL_NAME,
    alternateName: SHORT_NAME,
    url: `${siteUrl}/${lang}/about`,
    jobTitle: dict.hero.role,
    email: `mailto:${dict.contact.email}`,

    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Foz do Iguaçu',
      addressRegion: 'PR',
      addressCountry: 'BR',
    },

    // set para nao repetir a faculdade duas vezes por causa dos dois cursos
    alumniOf: [...new Set(dict.education.items.map((item) => item.school))].map(
      (school) => ({ '@type': 'CollegeOrUniversity', name: school })
    ),

    knowsAbout: dict.skills.groups.flatMap((group) => group.items),

    // perfis que confirmam ao google que e a mesma pessoa
    sameAs: [dict.contact.github, dict.contact.linkedin],
  };
}

export function websiteSchema(lang, dict) {
  const { siteUrl } = getSettings();

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,

    name: dict.meta.title,
    description: dict.meta.description,
    url: `${siteUrl}/${lang}`,
    inLanguage: lang === 'pt' ? 'pt-BR' : 'en-US',

    // liga o site a pessoa definida na pagina sobre
    publisher: { '@id': personId(siteUrl) },
  };
}