import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');
const WORDS_PER_MINUTE = 200;

function read(lang, slug) {
  const file = path.join(POSTS_DIR, lang, `${slug}.md`);
  return fs.existsSync(file) ? matter(fs.readFileSync(file, 'utf8')) : null;
}

function toMeta(slug, { data, content }) {
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

export function getSlugs(lang) {
  const dir = path.join(POSTS_DIR, lang);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.md'))
    .map((file) => file.replace(/\.md$/, ''));
}

export function getPosts(lang) {
  return getSlugs(lang)
    .map((slug) => {
      const file = read(lang, slug);
      return file && toMeta(slug, file);
    })
    .filter(Boolean)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPost(lang, slug) {
  const file = read(lang, slug);
  if (!file) return null;

  const processed = await remark().use(html).process(file.content);
  return { ...toMeta(slug, file), html: processed.toString() };
}