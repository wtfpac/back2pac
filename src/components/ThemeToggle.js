// 'use client' marca este componente para rodar no NAVEGADOR.
// Sem isso não existe onClick, useState nem localStorage —
// por padrão os componentes do Next rodam no servidor.
'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  // useState guarda um valor que, ao mudar, faz o componente redesenhar.
  // 'dark' é o valor inicial, igual ao padrão do site.
  const [theme, setTheme] = useState('dark');

  // useEffect roda depois que o componente aparece na tela.
  // O array vazio [] no final significa "rode uma vez só".
  // Aqui ele restaura o tema que o visitante escolheu em outra visita.
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    setTheme(savedTheme);
  }, []);

  function toggleTheme() {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';

    // 1. Muda o atributo no <html> — o CSS reage na hora
    document.documentElement.setAttribute('data-theme', nextTheme);

    // 2. Salva no navegador para lembrar na próxima visita
    localStorage.setItem('theme', nextTheme);

    // 3. Atualiza o estado para o texto do botão mudar
    setTheme(nextTheme);
  }

  return (
    // aria-label descreve o botão para leitores de tela
    <button onClick={toggleTheme} aria-label="Alternar tema">
      {theme === 'dark' ? 'claro' : 'escuro'}
    </button>
  );
}