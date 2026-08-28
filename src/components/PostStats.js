'use client';

import { useEffect, useState } from 'react';

export default function PostStats({ slug, dict }) {
  const [stats, setStats] = useState(null);
  const [liked, setLiked] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    // evita atualizar estado depois que o componente saiu da tela
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`/api/stats/${slug}`);
        const data = await res.json();
        if (cancelled) return;
        setStats(data);

        // conta a visualizacao uma vez por aba, nao a cada recarga
        const seenKey = `seen:${slug}`;
        if (sessionStorage.getItem(seenKey)) return;
        sessionStorage.setItem(seenKey, '1');

        const viewRes = await fetch(`/api/stats/${slug}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'view' }),
        });
        const viewData = await viewRes.json();
        if (!cancelled) setStats((current) => ({ ...current, views: viewData.views }));
      } catch {
        // contador indisponivel e melhor que pagina quebrada
      }
    }

    setLiked(Boolean(localStorage.getItem(`liked:${slug}`)));
    load();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  async function like() {
    if (liked || sending) return;
    setSending(true);

    try {
      const res = await fetch(`/api/stats/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'like' }),
      });
      const data = await res.json();

      localStorage.setItem(`liked:${slug}`, '1');
      setLiked(true);
      setStats((current) => ({ ...current, likes: data.likes }));
    } catch {
      // silencioso: se falhou, o botao volta a ficar clicavel
    } finally {
      setSending(false);
    }
  }

  // enquanto nao carregou, nao mostra nada: numero piscando de 0
  // para o valor real fica pior que aparecer um instante depois
  if (!stats) return null;

  return (
    <div className="post-stats">
      <span className="post-stat" title={dict.content.views}>
        <svg
          width="15" height="15" viewBox="0 0 24 24" fill="none"
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
        data-liked={liked}
        onClick={like}
        disabled={liked || sending}
        aria-label={dict.content.likes}
      >
        <svg
          width="15" height="15" viewBox="0 0 24 24"
          fill={liked ? 'currentColor' : 'none'}
          stroke="currentColor" strokeWidth="1.6"
          strokeLinecap="round" strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 1 0-7.1 7.1L12 21.5l8.8-8.8a5 5 0 0 0 0-7.1z" />
        </svg>
        {stats.likes}
      </button>
    </div>
  );
}