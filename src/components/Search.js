'use client';

import { useState } from 'react';
import PostList from './PostList';

export default function Search({ lang, dict, posts }) {
  const [query, setQuery] = useState('');
  const term = query.trim().toLowerCase();

  // Busca em título, resumo e categorias — não no corpo do post,
  // que não vem carregado na listagem
  const results = term
    ? posts.filter((post) =>
        `${post.title} ${post.summary} ${post.categories.join(' ')}`
          .toLowerCase()
          .includes(term)
      )
    : [];

  return (
    <>
      <input
        type="search"
        className="search-input"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={dict.content.searchPlaceholder}
      />

      {term && (
        <PostList
          lang={lang}
          dict={dict}
          posts={results}
          emptyMessage={dict.content.noResults}
        />
      )}
    </>
  );
}