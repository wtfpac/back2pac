export async function GET(request) {
  const { origin, searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  // Troca o código temporário pelo token de acesso.
  // Esta chamada acontece no servidor: o segredo nunca chega ao navegador.
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const data = await response.json();
  const ok = Boolean(data.access_token);

  const payload = ok
    ? { token: data.access_token, provider: 'github' }
    : { error: data.error_description ?? 'Falha na autenticação' };

  // O Decap espera o token por postMessage, não por redirecionamento:
  // esta página devolve o resultado para a janela que abriu o popup
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

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}