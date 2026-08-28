import { Analytics } from '@vercel/analytics/next';
import '@fontsource/commit-mono/400.css';
import '@fontsource/commit-mono/700.css';
import './../globals.css';
import Header from '@/components/Header';
import BackToTop from '@/components/BackToTop';
import { getDictionary } from '@/dictionaries';
import { getSettings } from '@/lib/content';

const LOCALES = { pt: 'pt-BR', en: 'en-US' };

// formata o horario do build no fuso de foz do iguacu, para todo
// visitante ver a mesma hora independente de onde esteja
function formatBuildTime(lang) {
  const raw = process.env.BUILD_TIME;
  if (!raw) return null;

  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat(LOCALES[lang] ?? LOCALES.pt, {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Sao_Paulo',
  }).format(date);
}

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

    authors: [{ name: 'Wellington Alves Clemente', url: siteUrl }],
    creator: 'Wellington Alves Clemente',

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
  const buildTime = formatBuildTime(lang);

  return (
    // sem data-theme aqui o atributo e escrito so pelo ThemeToggle
    // se ficasse no jsx, o react o reverteria a cada navegacao
    <html lang={lang} suppressHydrationWarning>
      <body>
        <Header lang={lang} dict={dict} />

        <div className="container">{children}</div>

        <footer className="site-footer">
          <p>© 2026 Back 2 Pac</p>

          <ul className="footer-links">
            <li>
              <a href={dict.contact.github} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </li>
            <li>
              <a href={dict.contact.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </li>
          </ul>

          {buildTime && <p>{dict.content.lastDeploy} {buildTime}</p>}
        </footer>

        <BackToTop label={dict.content.backToTop} />
        <Analytics />
      </body>
    </html>
  );
}