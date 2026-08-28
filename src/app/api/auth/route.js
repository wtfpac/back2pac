import { NextResponse } from 'next/server';

// o painel abre esta rota numa janela popup para iniciar o login
export function GET(request) {
  const { origin } = new URL(request.url);

  // valor aleatorio conferido na volta: impede que alguem te induza
  // a completar um login que nao foi voce que comecou
  const state = crypto.randomUUID();

  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID,
    scope: 'public_repo',
    redirect_uri: `${origin}/api/callback`,
    state,
  });

  const response = NextResponse.redirect(
    `https://github.com/login/oauth/authorize?${params}`
  );

  // httpOnly: o javascript da pagina nao consegue ler.
  // lax: o cookie sobrevive ao redirecionamento de volta do github
  response.cookies.set('oauth_state', state, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 600,
  });

  return response;
}