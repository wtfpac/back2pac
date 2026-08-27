export default function Section({ id, title, children }) {
  return (
    <section id={id} className="section">
      <h2 className="section-title">
        <a href={`#${id}`}>{title}</a>
      </h2>
      {children}
    </section>
  );
}