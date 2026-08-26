import { NextResponse } from 'next/server';

const languages = ['pt', 'en'];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const hasLanguage = languages.some(
    (lang) => pathname === `/${lang}` || pathname.startsWith(`/${lang}/`)
  );
  if (hasLanguage) return;

  const acceptLanguage = request.headers.get('accept-language') || '';
  const lang = acceptLanguage.toLowerCase().startsWith('en') ? 'en' : 'pt';

  return NextResponse.redirect(new URL(`/${lang}${pathname}`, request.url));
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|.*\\..*).*)'],
};