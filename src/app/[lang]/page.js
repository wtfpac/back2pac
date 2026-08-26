import { getDictionary } from '@/dictionaries';

export default async function Home({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <main>
      <h1>Wellington Alves Clemente</h1>
      <p>{dict.hero.role} · {dict.hero.location}</p>

      <section id="about">
        <h2>{dict.sections.about}</h2>
        <p>{dict.about.text}</p>
      </section>
    </main>
  );
}