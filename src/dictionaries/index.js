// Mapa de idioma -> função que carrega o JSON correspondente.
// Usar função (e não import direto) faz o Next carregar
// apenas o arquivo do idioma pedido, não os dois.
const dictionaries = {
  pt: () => import('./pt.json').then((m) => m.default),
  en: () => import('./en.json').then((m) => m.default),
};

export async function getDictionary(lang) {
  // ?? é a rede de segurança: se alguém digitar /xx na URL,
  // cai no português em vez de quebrar a página.
  return (dictionaries[lang] ?? dictionaries.pt)();
}