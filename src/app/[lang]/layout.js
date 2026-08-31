import { Analytics } from '@vercel/analytics/next';
import '@fontsource/commit-mono/400.css';
import '@fontsource/commit-mono/700.css';
import './../globals.css';
import Header from '@/components/Header';
import BackToTop from '@/components/BackToTop';
import { getDictionary } from '@/dictionaries';
import { getSettings } from '@/lib/content';

const LOCALES = { pt: 'pt-BR', en: 'en-US' };

// roda antes do navegador pintar a tela, entao quem escolheu o tema claro
// nao ve o lampejo escuro. o try existe porque o localStorage estoura em
// janela anonima com cookies bloqueados
const THEME_SCRIPT =
  "try{document.documentElement.setAttribute('data-theme'," +
  "localStorage.getItem('theme')||'dark')}catch(e){}";

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

    // prova pro google que o site e seu. so precisa ficar aqui ate ele
    // verificar, mas tirar depois faz perder a verificacao
    verification: {
      google: 'Jz-UwpKMudeZfvL_48NZLQonaeu4iSv6SZk76yFD75Y',
    },

    // faz navegador e leitor de feed acharem o rss sozinhos
    alternates: {
      types: { 'application/rss+xml': `${siteUrl}/${lang}/rss.xml` },
    },

    openGraph: {
      type: 'website',
      locale: lang === 'pt' ? 'pt_BR' : 'en_US',
      siteName: dict.meta.title,
      title: dict.meta.title,
      description: dict.meta.description,
    },

    // large_image porque a opengraph-image e 1200x630. com 'summary'
    // o x/twitter corta ela num quadrado pequeno
    twitter: { card: 'summary_large_image' },
  };
}

export default async function RootLayout({ children, params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const buildTime = formatBuildTime(lang);

  // calculado no build, junto com o resto da pagina estatica
  const year = new Date().getFullYear();

  return (
    // suppressHydrationWarning porque o script acima muda o html antes
    // do react rodar, e sem isso o react reclamaria da diferenca
    <html lang={lang} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>

      <body>
        <Header lang={lang} dict={dict} />

        <div className="container">{children}</div>

        <footer className="site-footer">
          <p>© {year} Back 2 Pac</p>

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
            <li>
              <a href={`/${lang}/rss.xml`}>RSS</a>
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