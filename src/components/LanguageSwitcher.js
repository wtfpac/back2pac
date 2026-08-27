'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LANGUAGES = [
  { code: 'pt', label: 'pt-BR' },
  { code: 'en', label: 'en-US' },
];

export default function LanguageSwitcher({ lang }) {
  const pathname = usePathname();

  return (
    <div className="lang-switch">
      {LANGUAGES.map(({ code, label }) => (
        <Link
          key={code}
          // Troca só o pedaço do idioma: "/pt/posts" vira "/en/posts"
          href={pathname.replace(`/${lang}`, `/${code}`)}
          className="lang-option"
          data-active={code === lang}
          aria-current={code === lang ? 'page' : undefined}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}