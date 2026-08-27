const LOCALES = { pt: 'pt-BR', en: 'en-US' };

export function formatDate(date, lang) {
  if (!date) return '';

  return new Date(date).toLocaleDateString(LOCALES[lang] ?? LOCALES.pt, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  });
}