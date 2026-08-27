import './../globals.css';
import Header from '@/components/Header';
import { getDictionary } from '@/dictionaries';
import { getSettings } from '@/lib/content';
import { Analytics } from "@vercel/analytics/next"

export function generateStaticParams() {
  return [{ lang: 'pt' }, { lang: 'en' }];
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const { siteUrl } = getSettings();

  return {
    // Converte caminhos relativos em URLs absolutas nas tags de compartilhamento
    metadataBase: new URL(siteUrl),

    title: {
      default: dict.meta.title,
      // Páginas com título próprio viram "Primeiro post · Wellington Alves Clemente"
      template: `%s · ${dict.meta.title}`,
    },
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
    // data-theme="dark" é o padrão; o ThemeToggle troca esse atributo
    <html lang={lang} data-theme="dark">
      <body>
        <Header lang={lang} dict={dict} />
        <div className="container">{children}</div>
        <footer className="site-footer">
          <div className="header-inner">© 2026 Wellington Alves Clemente</div>
        </footer>
      </body>
    </html>
  );
}