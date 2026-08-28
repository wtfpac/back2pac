'use client';

import { useEffect, useState } from 'react';

export default function BackToTop({ label }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // passive avisa o navegador que nao vamos bloquear a rolagem,
    // o que evita travadas em celular
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      className="top-link"
      data-visible={visible}
      aria-label={label}
      // a rolagem sai suave sozinha por causa do scroll-behavior no html
      onClick={() => window.scrollTo({ top: 0 })}
    >
      ↑
    </button>
  );
}