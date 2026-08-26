import './../globals.css';
import Header from '@/components/Header';
import { getDictionary } from '@/dictionaries';

export const metadata = {
  title: 'Wellington Alves Clemente',
  description: 'Desenvolvedor e profissional de suporte de TI.',
};

export function generateStaticParams() {
  return [{ lang: 'pt' }, { lang: 'en' }];
}

const themeScript = `
  (function() {
    try {
      document.documentElement.setAttribute(
        'data-theme',
        localStorage.getItem('theme') || 'dark'
      );
    } catch (e) {}
  })();
`;

export default async function RootLayout({ children, params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Header lang={lang} dict={dict} />
        <div className="container">{children}</div>
        <footer className="site-footer">
          <div className="header-inner">
            © 2026 Wellington Alves Clemente
          </div>
        </footer>
      </body>
    </html>
  );
}