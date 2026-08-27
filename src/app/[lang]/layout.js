import '@fontsource/commit-mono/400.css';
import '@fontsource/commit-mono/700.css';
import './../globals.css';
import Header from '@/components/Header';
import { getDictionary } from '@/dictionaries';
import { getSettings } from '@/lib/content';

export function generateStaticParams() {
  return [{ lang: 'pt' }, { lang: 'en' }];
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const { siteUrl } = getSettings();

  return {
    // converte caminhos relativos em urls absolutas nas tags de compartilhamento
    metadataBase: new URL(siteUrl),

    // titulo da home; cada pagina interna define o seu e substitui este
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
    // sem data-theme aqui o atributo e escrito so pelo ThemeToggle
    // se ficasse no jsx, o react o reverteria a cada navegacao
    <html lang={lang} suppressHydrationWarning>
      <body>
        <Header lang={lang} dict={dict} />
        <div className="container">{children}</div>
        <footer className="site-footer">
          <p>© 2026 Back 2 Pac</p>
        </footer>
      </body>
    </html>
  );
}