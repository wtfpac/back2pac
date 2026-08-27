// O middleware roda ANTES de qualquer página, em toda requisição.
// Função aqui: mandar quem entra sem idioma na URL para /pt ou /en.

import { NextResponse } from 'next/server';

const languages = ['pt', 'en'];

export function proxy(request) {
  const { pathname } = request.nextUrl;

  // A URL já começa com um idioma conhecido? Então não faz nada.
  const hasLanguage = languages.some(
    (lang) => pathname === `/${lang}` || pathname.startsWith(`/${lang}/`)
  );
  if (hasLanguage) return;

  // accept-language é um cabeçalho que o navegador envia
  // automaticamente informando o idioma do usuário.
  const acceptLanguage = request.headers.get('accept-language') || '';
  const lang = acceptLanguage.toLowerCase().startsWith('en') ? 'en' : 'pt';

  // Redireciona mantendo o resto do caminho: /posts vira /pt/posts
  return NextResponse.redirect(new URL(`/${lang}${pathname}`, request.url));
}

export const config = {
  // Onde o middleware deve rodar. O regex exclui os arquivos internos
  // do Next (_next), o favicon e qualquer caminho com ponto no nome
  // (imagens, css, etc) — assim ele não intercepta arquivos estáticos.
  matcher: ['/((?!_next|favicon.ico|.*\\..*).*)'],
};