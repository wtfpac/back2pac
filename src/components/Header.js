// Sem 'use client': este componente só monta HTML, roda no servidor.
// Um componente de servidor PODE conter componentes de cliente dentro.

import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';

// { lang, dict } são as props — os valores que o layout passou.
export default function Header({ lang, dict }) {
  return (
    <header className="site-header">
      <div className="header-inner">
        {/* Link (e não <a>) troca de página sem recarregar o site inteiro */}
        <Link href={`/${lang}`} className="brand">
          Wellington Alves Clemente
        </Link>

        <nav className="main-nav">
          <ul>
            {/* Todo link interno carrega o idioma atual na URL */}
            <li><Link href={`/${lang}`}>{dict.nav.home}</Link></li>
            <li><Link href={`/${lang}/posts`}>{dict.nav.posts}</Link></li>
            <li><Link href={`/${lang}/research`}>{dict.nav.research}</Link></li>
            <li><Link href={`/${lang}/categories`}>{dict.nav.categories}</Link></li>
            <li><Link href={`/${lang}/search`}>{dict.nav.search}</Link></li>
          </ul>
        </nav>

        <div className="header-actions">
          <ThemeToggle />
          <LanguageSwitcher lang={lang} />
        </div>
      </div>
    </header>
  );
}