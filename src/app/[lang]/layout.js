// Layout raiz: envolve TODAS as páginas do site.
// Como ele fica dentro de [lang], existe uma versão dele por idioma.

import './../globals.css';
import Header from '@/components/Header';
import { getDictionary } from '@/dictionaries';

// Metadados da aba do navegador e dos buscadores.
// O Next monta a <head> sozinho a partir daqui.
export const metadata = {
  title: 'Wellington Alves Clemente',
  description: 'Desenvolvedor e profissional de suporte de TI.',
};

// Diz ao Next quais valores [lang] pode assumir, para ele
// gerar as duas versões prontas no build em vez de montar na hora.
export function generateStaticParams() {
  return [{ lang: 'pt' }, { lang: 'en' }];
}

// async porque precisamos esperar (await) o params e o dicionário.
export default async function RootLayout({ children, params }) {
  // params traz o valor da pasta [lang]: 'pt' ou 'en'.
  const { lang } = await params;

  // Carrega o JSON de textos do idioma atual.
  const dict = await getDictionary(lang);

  return (
    // data-theme="dark" é o padrão do site. O ThemeToggle troca
    // esse atributo no navegador, e o CSS reage à mudança.
    <html lang={lang} data-theme="dark">
      <body>
        {/* Header recebe o idioma (para montar os links) e o dicionário (para os textos) */}
        <Header lang={lang} dict={dict} />

        {/* children é a página que está sendo exibida no momento */}
        <div className="container">{children}</div>

        <footer className="site-footer">
          <div className="header-inner">© 2026 Wellington Alves Clemente</div>
        </footer>
      </body>
    </html>
  );
}