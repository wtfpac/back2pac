// Converte um texto em pedaço de URL: "Automação de Redes" -> "automacao-de-redes"
export function slugify(value) {
  return value
    .normalize('NFD')                  // separa a letra do acento: "ç" vira "c" + acento
    .replace(/[\u0300-\u036f]/g, '')   // remove os acentos separados acima
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')       // qualquer coisa que não seja letra ou número vira hífen
    .replace(/^-|-$/g, '');            // tira hífen sobrando no começo e no fim
}