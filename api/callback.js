/**
 * Step 2 of the GitHub OAuth dance for Decap CMS.
 *
 * GitHub redirects here with a code. We swap it for an access token server
 * side (so the client secret never reaches the browser) and hand the token to
 * the Decap window that opened this popup, using the postMessage handshake
 * Decap expects.
 */
function page(status, payload, origin) {
  // Decap listens for "authorizing:github" first, then replies, then we post
  // the result. The origin is pinned so the token cannot be read cross-site.
  return `<!doctype html><html><body><script>
  (function () {
    function send() {
      window.opener.postMessage(
        'authorization:github:${status}:${JSON.stringify(payload).replace(/</g, '\\u003c')}',
        '${origin}'
      );
    }
    window.addEventListener('message', send, { once: true });
    window.opener.postMessage('authorizing:github', '${origin}');
  })();
  </script></body></html>`;
}

export default async function handler(req, res) {
  const clientId = process.env.OAUTH_CLIENT_ID;
  const clientSecret = process.env.OAUTH_CLIENT_SECRET;
  const proto = req.headers['x-forwarded-proto'] ?? 'https';
  const host = req.headers['x-forwarded-host'] ?? req.headers.host;
  const origin = `${proto}://${host}`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  if (!clientId || !clientSecret) {
    res.status(500).send(page('error', { message: 'OAuth is not configured on this deployment.' }, origin));
    return;
  }

  const url = new URL(req.url, origin);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  const cookieState = (req.headers.cookie ?? '')
    .split(';')
    .map((c) => c.trim().split('='))
    .find(([k]) => k === 'decap_oauth_state')?.[1];

  if (!code || !state || !cookieState || state !== cookieState) {
    res.status(400).send(page('error', { message: 'Invalid OAuth state. Start the login again.' }, origin));
    return;
  }

  // Burn the state cookie so the code cannot be replayed.
  res.setHeader('Set-Cookie', 'decap_oauth_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0');

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: `${origin}/api/callback`,
      }),
    });
    const data = await tokenRes.json();

    if (data.error || !data.access_token) {
      res.status(401).send(page('error', { message: data.error_description ?? 'GitHub refused the token request.' }, origin));
      return;
    }

    res.status(200).send(page('success', { token: data.access_token, provider: 'github' }, origin));
  } catch (err) {
    res.status(502).send(page('error', { message: 'Could not reach GitHub to exchange the token.' }, origin));
  }
}
