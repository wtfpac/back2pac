'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    setTheme(savedTheme);
  }, []);

  function toggleTheme() {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
    setTheme(nextTheme);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
    >
      {/* Lua: contornada. currentColor no lugar do preto fixo do arquivo */}
      <span className="theme-icon" data-visible={theme === 'dark'}>
        <svg
          width="22" height="22" viewBox="0 0 24 24" fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.32031 11.6835C3.32031 16.6541 7.34975 20.6835 12.3203 20.6835C16.1075 20.6835 19.3483 18.3443 20.6768 15.032C19.6402 15.4486 18.5059 15.6834 17.3203 15.6834C12.3497 15.6834 8.32031 11.654 8.32031 6.68342C8.32031 5.50338 8.55165 4.36259 8.96453 3.32996C5.65605 4.66028 3.32031 7.89912 3.32031 11.6835Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      {/* Sol: preenchido, e com o viewBox original do arquivo */}
      <span className="theme-icon" data-visible={theme === 'light'}>
        <svg
          width="24" height="24" viewBox="-5.5 0 32 32" fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M10.68 21.64c-3.12 0-5.64-2.52-5.64-5.64s2.52-5.64 5.64-5.64 5.64 2.52 5.64 5.64-2.52 5.64-5.64 5.64zM10.68 12.040c-2.2 0-3.96 1.76-3.96 3.96s1.76 3.96 3.96 3.96 3.96-1.76 3.96-3.96-1.76-3.96-3.96-3.96zM10.68 9.040c-0.48 0-0.84-0.36-0.84-0.84v-2.040c0-0.48 0.36-0.84 0.84-0.84s0.84 0.36 0.84 0.84v2.040c0 0.48-0.36 0.84-0.84 0.84zM16.2 11.32c-0.2 0-0.44-0.080-0.6-0.24-0.32-0.32-0.32-0.84 0-1.2l1.44-1.44c0.32-0.32 0.84-0.32 1.2 0 0.32 0.32 0.32 0.84 0 1.2l-1.44 1.44c-0.2 0.16-0.4 0.24-0.6 0.24zM18.48 16.84c-0.48 0-0.84-0.36-0.84-0.84s0.36-0.84 0.84-0.84h2.040c0.48 0 0.84 0.36 0.84 0.84s-0.36 0.84-0.84 0.84h-2.040zM17.64 23.8c-0.2 0-0.44-0.080-0.6-0.24l-1.44-1.48c-0.32-0.32-0.32-0.84 0-1.2 0.32-0.32 0.84-0.32 1.2 0l1.44 1.44c0.32 0.32 0.32 0.84 0 1.2-0.16 0.2-0.4 0.28-0.6 0.28zM10.68 26.68c-0.48 0-0.84-0.36-0.84-0.84v-2.040c0-0.48 0.36-0.84 0.84-0.84s0.84 0.36 0.84 0.84v2.040c0 0.48-0.36 0.84-0.84 0.84zM3.72 23.8c-0.2 0-0.44-0.080-0.6-0.24-0.32-0.32-0.32-0.84 0-1.2l1.44-1.44c0.32-0.32 0.84-0.32 1.2 0s0.32 0.84 0 1.2l-1.44 1.44c-0.16 0.16-0.4 0.24-0.6 0.24zM0.84 16.84c-0.48 0-0.84-0.36-0.84-0.84s0.36-0.84 0.84-0.84h2.040c0.48 0 0.84 0.36 0.84 0.84s-0.36 0.84-0.84 0.84h-2.040zM5.16 11.32c-0.2 0-0.44-0.080-0.6-0.24l-1.44-1.44c-0.32-0.32-0.32-0.84 0-1.2 0.32-0.32 0.84-0.32 1.2 0l1.44 1.44c0.32 0.32 0.32 0.84 0 1.2-0.16 0.16-0.36 0.24-0.6 0.24z" />
        </svg>
      </span>
    </button>
  );
}