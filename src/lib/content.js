import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { slugify } from './slug';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const POSTS_DIR = path.join(CONTENT_DIR, 'posts');

// Velocidade média de leitura, usada para estimar o tempo do post
const WORDS_PER_MINUTE = 200;

/* ---------- Configurações do site ---------- */

// Fica em content/ (e não em src/) para o painel admin poder editar depois
export function getSettings() {
  const file = path.join(CONTENT_DIR, 'settings.json');
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

/* ---------- Posts ---------- */

function read(lang, slug) {
  const file = path.join(POSTS_DIR, lang, `${slug}.md`);
  // Retorna null em vez de estourar erro: quem chamou decide o que fazer
  return fs.existsSync(file) ? matter(fs.readFileSync(file, 'utf8')) : null;
}

function toMeta(slug, { data, content }) {
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  return {
    slug,
    // ?? garante valor padrão caso o post esqueça algum campo no cabeçalho
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

  // O nome do arquivo é o slug da URL: primeiro-post.md -> /posts/primeiro-post
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
    .sort((a, b) => (a.date < b.date ? 1 : -1)); // mais recentes primeiro
}

export async function getPost(lang, slug) {
  const file = read(lang, slug);
  if (!file) return null;

  const processed = await remark().use(html).process(file.content);
  return { ...toMeta(slug, file), html: processed.toString() };
}

/* ---------- Categorias ---------- */

// As categorias não são cadastradas: elas são descobertas lendo os posts
export function getCategories(lang) {
  const found = new Map();

  for (const post of getPosts(lang)) {
    for (const name of post.categories) {
      // Agrupa pelo slug para "Automação" e "automação" contarem como uma só
      const slug = slugify(name);
      const entry = found.get(slug) ?? { slug, name, count: 0 };
      entry.count += 1;
      found.set(slug, entry);
    }
  }

  return [...found.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export function getPostsByCategory(lang, categorySlug) {
  return getPosts(lang).filter((post) =>
    post.categories.some((name) => slugify(name) === categorySlug)
  );
}