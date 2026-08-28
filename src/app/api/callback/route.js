import { NextResponse } from 'next/server';

// o decap espera o token por postMessage, nao por redirecionamento:
// esta pagina devolve o resultado para a janela que abriu o popup
function popupResponse(origin, ok, payload) {
  const html = `<!doctype html>
<html><body><script>
  (function () {
    var origin = ${JSON.stringify(origin)};
    var result = 'authorization:github:${ok ? 'success' : 'error'}:${JSON.stringify(payload)}';

    window.addEventListener('message', function () {
      window.opener.postMessage(result, origin);
    }, { once: true });

    window.opener.postMessage('authorizing:github', origin);
  })();
</script></body></html>`;

  const response = new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });

  // o state e de uso unico
  response.cookies.delete('oauth_state');
  return response;
}

export async function GET(request) {
  const { origin, searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const expected = request.cookies.get('oauth_state')?.value;

  if (!state || !expected || state !== expected) {
    return popupResponse(origin, false, { error: 'state invalido' });
  }

  // troca o codigo temporario pelo token de acesso.
  // esta chamada acontece no servidor: o segredo nunca chega ao navegador
  const res = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const data = await res.json();

  return data.access_token
    ? popupResponse(origin, true, { token: data.access_token, provider: 'github' })
    : popupResponse(origin, false, { error: data.error_description ?? 'falha na autenticacao' });
}