import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';
import { getSettings } from '@/lib/content';

export default function Header({ lang, dict }) {
  const { showSearch } = getSettings();

  return (
    <header className="site-header">
      <div className="header-inner">
        <ThemeToggle />

        <nav className="main-nav">
          <ul>
            <li><Link href={`/${lang}`}>{dict.nav.home}</Link></li>
            <li><Link href={`/${lang}/posts`}>{dict.nav.posts}</Link></li>
            <li><Link href={`/${lang}/categories`}>{dict.nav.categories}</Link></li>
            {showSearch && (
              <li><Link href={`/${lang}/search`}>{dict.nav.search}</Link></li>
            )}
          </ul>
        </nav>

        <div className="header-actions">
          <LanguageSwitcher lang={lang} />
        </div>
      </div>
    </header>
  );
}