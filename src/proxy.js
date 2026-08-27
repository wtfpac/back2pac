import { NextResponse } from 'next/server';

const languages = ['pt', 'en'];

export function proxy(request) {
  const { pathname } = request.nextUrl;

  const hasLanguage = languages.some(
    (lang) => pathname === `/${lang}` || pathname.startsWith(`/${lang}/`)
  );
  if (hasLanguage) return;

  // accept-language é um cabeçalho que o navegador envia
  // automaticamente informando o idioma do usuário
  const acceptLanguage = request.headers.get('accept-language') || '';
  const lang = acceptLanguage.toLowerCase().startsWith('en') ? 'en' : 'pt';

  return NextResponse.redirect(new URL(`/${lang}${pathname}`, request.url));
}

export const config = {
  // Não rodar em: painel, rotas de API, arquivos internos do Next, favicon,
  // e qualquer caminho com ponto no nome (sitemap.xml, robots.txt, imagens)
  matcher: ['/((?!admin|api|_next|favicon.ico|.*\\..*).*)'],
};