'use client';

import { useEffect, useState } from 'react';

// uma requisicao para a lista inteira: o primeiro badge dispara,
// os demais reaproveitam a mesma promessa
let pending;

function fetchAllStats() {
  if (!pending) {
    pending = fetch('/api/stats')
      .then((res) => res.json())
      .catch(() => ({}));
  }

  return pending;
}

// versao so de leitura: sem botao, sem contar visualizacao
export default function StatsBadge({ slug }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetchAllStats().then((all) => {
      if (!cancelled) setStats(all[slug] ?? null);
    });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!stats) return null;

  return (
    <>
      <span className="post-stat">
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

      <span className="post-stat">
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.6"
          strokeLinecap="round" strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 1 0-7.1 7.1L12 21.5l8.8-8.8a5 5 0 0 0 0-7.1z" />
        </svg>
        {stats.likes}
      </span>
    </>
  );
}