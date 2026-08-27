import { IBM_Plex_Mono } from 'next/font/google';
import './../globals.css';
import Header from '@/components/Header';
import { getDictionary } from '@/dictionaries';
import { getSettings } from '@/lib/content';

// next/font baixa a fonte durante o build e a serve do seu próprio domínio:
// nenhuma requisição ao Google em produção e sem salto de layout ao carregar
const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  fallback: ['ui-monospace', 'SFMono-Regular', 'Consolas', 'monospace'],
});

export function generateStaticParams() {
  return [{ lang: 'pt' }, { lang: 'en' }];
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const { siteUrl } = getSettings();

  return {
    // converte caminhos relativos em URLs absolutas nas tags de compartilhamento
    metadataBase: new URL(siteUrl),

    // titulo da home cada página interna define o seu e substitui este
    title: dict.meta.title,
    description: dict.meta.description,

    openGraph: {
      type: 'website',
      locale: lang === 'pt' ? 'pt_BR' : 'en_US',
      siteName: dict.meta.title,
      title: dict.meta.title,
      description: dict.meta.description,
    },

    twitter: { card: 'summary' },
  };
}

export default async function RootLayout({ children, params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    // atributo escrito apenas pelo themetoggle
    // se ficasse no jsx o react reverte a cada navegaçao
    <html lang={lang} className={mono.variable} suppressHydrationWarning>
      <body>
        <Header lang={lang} dict={dict} />
        <div className="container">{children}</div>
        <footer className="site-footer">
          <div className="header-inner">© 2026 Back 2 Pac</div>
        </footer>
      </body>
    </html>
  );
}