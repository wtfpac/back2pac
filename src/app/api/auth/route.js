import { NextResponse } from 'next/server';

// o painel abre esta rota numa janela popup para iniciar o login
export function GET(request) {
  const { origin } = new URL(request.url);

  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID,
    redirect_uri: `${origin}/api/callback`,
    // use 'public_repo' em vez de 'repo' se o repositório for público:
    // menos permissão concedida para a mesma funcionalidade
    scope: 'public_repo',
  });

  return NextResponse.redirect(
    `https://github.com/login/oauth/authorize?${params}`
  );
}