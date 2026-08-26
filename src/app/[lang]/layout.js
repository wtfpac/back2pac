import './../globals.css';

export const metadata = {
  title: 'Wellington Alves Clemente',
  description: 'Desenvolvedor e profissional de suporte de TI.',
};

export function generateStaticParams() {
  return [{ lang: 'pt' }, { lang: 'en' }];
}

export default async function RootLayout({ children, params }) {
  const { lang } = await params;

  return (
    <html lang={lang}>
      <body>{children}</body>
    </html>
  );
}