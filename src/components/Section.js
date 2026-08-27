// Componente reaproveitável: desenha o título padrão de seção
// e mostra dentro dele o que for passado entre as tags.
//
// children é uma prop especial: representa o conteúdo escrito
// entre <Section> e </Section> quando o componente é usado.
export default function Section({ id, title, children }) {
  return (
    // id é usado pelos links de âncora, ex: /pt#experience
    <section id={id} className="section">
      <h2 className="section-title">{title}</h2>
      {children}
    </section>
  );
}