import { getDictionary } from '@/dictionaries';
import { getEntries } from '@/lib/content';
import EntryList from '@/components/EntryList';

export function generateStaticParams() {
  return [{ lang: 'pt' }, { lang: 'en' }];
}

export default async function ResearchPage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <main>
      <h1 className="page-title">{dict.content.researchTitle}</h1>
      <p className="page-intro">{dict.content.researchIntro}</p>

      <EntryList
        lang={lang}
        dict={dict}
        collection="research"
        entries={getEntries('research', lang)}
      />
    </main>
  );
}