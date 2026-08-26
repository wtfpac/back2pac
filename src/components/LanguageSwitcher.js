'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function LanguageSwitcher({ lang }) {
  const pathname = usePathname();
  const nextLang = lang === 'pt' ? 'en' : 'pt';
  const href = pathname.replace(`/${lang}`, `/${nextLang}`);

  return <Link href={href}>{nextLang.toUpperCase()}</Link>;
}