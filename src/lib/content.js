import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const CONTENT_ROOT = path.join(process.cwd(), 'content');
const WORDS_PER_MINUTE = 200;

function collectionDir(collection, lang) {
  return path.join(CONTENT_ROOT, collection, lang);
}

function readFile(collection, lang, slug) {
  const filePath = path.join(collectionDir(collection, lang), `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  return matter(fs.readFileSync(filePath, 'utf8'));
}

function buildMeta(slug, data, content) {
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? null,
    summary: data.summary ?? '',
    categories: data.categories ?? [],
    wordCount,
    readingTime: Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE)),
  };
}

export function getSlugs(collection, lang) {
  const dir = collectionDir(collection, lang);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.md'))
    .map((file) => file.replace(/\.md$/, ''));
}

export function getEntries(collection, lang) {
  return getSlugs(collection, lang)
    .map((slug) => {
      const file = readFile(collection, lang, slug);
      return file && buildMeta(slug, file.data, file.content);
    })
    .filter(Boolean)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getEntry(collection, lang, slug) {
  const file = readFile(collection, lang, slug);
  if (!file) return null;

  const processed = await remark().use(html).process(file.content);

  return {
    ...buildMeta(slug, file.data, file.content),
    html: processed.toString(),
  };
}

export function getAllEntries(lang) {
  return ['posts', 'research'].flatMap((collection) =>
    getEntries(collection, lang).map((entry) => ({ ...entry, collection }))
  );
}