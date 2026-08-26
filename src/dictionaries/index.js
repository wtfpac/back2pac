const dictionaries = {
  pt: () => import('./pt.json').then((m) => m.default),
  en: () => import('./en.json').then((m) => m.default),
};

export async function getDictionary(lang) {
  return (dictionaries[lang] ?? dictionaries.pt)();
}