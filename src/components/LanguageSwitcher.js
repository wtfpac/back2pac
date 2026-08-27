'use client'; // usePathname só existe no navegador

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function LanguageSwitcher({ lang }) {
  // Caminho atual da URL, ex: "/pt/posts"
  const pathname = usePathname();

  // O idioma para onde o botão leva
  const nextLang = lang === 'pt' ? 'en' : 'pt';

  // Troca só o pedaço do idioma: "/pt/posts" vira "/en/posts".
  // replace troca a PRIMEIRA ocorrência, que é sempre o início da URL.
  const href = pathname.replace(`/${lang}`, `/${nextLang}`);

  return <Link href={href}>{nextLang.toUpperCase()}</Link>;
}