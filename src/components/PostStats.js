'use client';

import { useEffect, useState } from 'react';

// uma requisicao para todos os posts, compartilhada por todos os
// componentes da tela. statsCache guarda o objeto ja resolvido para
// que uma curtida se reflita em quem montar depois
let statsPromise;
let statsCache;

function loadStats() {
  if (!statsPromise) {
    statsPromise = fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => {
        statsCache = data;
        return data;
      })
      .catch(() => ({}));
  }

  return statsPromise;
}

function patchCache(slug, changes) {
  if (statsCache?.[slug]) Object.assign(statsCache[slug], changes);
}

export default function PostStats({ slug, dict, countView = false }) {
  const [stats, setStats] = useState(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    // evita atualizar estado depois que o componente saiu da tela
    let cancelled = false;

    async function start() {
      const all = await loadStats();
      if (cancelled) return;
      setStats(all[slug] ?? { views: 0, likes: 0, liked: false });

      if (!countView) return;

      // conta a visualizacao uma vez por aba, nao a cada recarga
      const seenKey = `seen:${slug}`;
      if (sessionStorage.getItem(seenKey)) return;
      sessionStorage.setItem(seenKey, '1');

      try {
        const res = await fetch(`/api/stats/${slug}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'view' }),
        });
        const data = await res.json();
        if (cancelled) return;

        patchCache(slug, { views: data.views });
        setStats((current) => ({ ...current, views: data.views }));
      } catch {
        // contador indisponivel e melhor que pagina quebrada
      }
    }

    start();

    return () => {
      cancelled = true;
    };
  }, [slug, countView]);

  // o mesmo botao curte e descurte; quem decide e o servidor
  async function toggleLike() {
    if (sending) return;
    setSending(true);

    try {
      const res = await fetch(`/api/stats/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'like' }),
      });
      const data = await res.json();

      patchCache(slug, { likes: data.likes, liked: data.liked });
      setStats((current) => ({ ...current, likes: data.likes, liked: data.liked }));
    } catch {
      // se falhou, o botao continua clicavel
    } finally {
      setSending(false);
    }
  }

  // enquanto nao carregou, nao mostra nada: numero piscando de 0
  // para o valor real fica pior que aparecer um instante depois
  if (!stats) return null;

  return (
    <>
      <span className="post-stat" title={dict.content.views}>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.6"
          strokeLinecap="round" strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        {stats.views}
      </span>

      <button
        type="button"
        className="post-stat like-button"
        data-liked={stats.liked}
        onClick={toggleLike}
        disabled={sending}
        aria-label={stats.liked ? dict.content.unlike : dict.content.likes}
      >
        <svg
          width="14" height="14" viewBox="0 0 24 24"
          fill={stats.liked ? 'currentColor' : 'none'}
          stroke="currentColor" strokeWidth="1.6"
          strokeLinecap="round" strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 1 0-7.1 7.1L12 21.5l8.8-8.8a5 5 0 0 0 0-7.1z" />
        </svg>
        {stats.likes}
      </button>
    </>
  );
}