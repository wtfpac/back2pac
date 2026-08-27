import { getDictionary } from '@/dictionaries';
import { getEntries } from '@/lib/content';
import EntryList from '@/components/EntryList';

export function generateStaticParams() {
  return [{ lang: 'pt' }, { lang: 'en' }];
}

export default async function PostsPage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <main>
      <h1 className="page-title">{dict.content.postsTitle}</h1>
      <p className="page-intro">{dict.content.postsIntro}</p>

      <EntryList
        lang={lang}
        dict={dict}
        collection="posts"
        entries={getEntries('posts', lang)}
      />
    </main>
  );
}