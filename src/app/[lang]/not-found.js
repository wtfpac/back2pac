'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TEXTS = {
  pt: { message: 'Página não encontrada.', home: 'Voltar ao início' },
  en: { message: 'Page not found.', home: 'Back to home' },
};

export default function NotFound() {
  // o idioma nao chega por params em pagina de erro, entao vem da url
  const lang = usePathname()?.startsWith('/en') ? 'en' : 'pt';
  const text = TEXTS[lang];

  return (
    <main>
      <h1 className="page-title">404</h1>
      <p className="page-intro">{text.message}</p>
      <Link href={`/${lang}`}>{text.home}</Link>
    </main>
  );
}