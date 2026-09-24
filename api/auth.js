/**
 * Step 1 of the GitHub OAuth dance for Decap CMS.
 *
 * Decap only ships a hosted OAuth provider for Netlify, so on Vercel the site
 * has to provide its own. This redirects to GitHub's consent screen; GitHub
 * then calls /api/callback with a code.
 *
 * Requires these Vercel environment variables:
 *   OAUTH_CLIENT_ID      from the GitHub OAuth App
 *   OAUTH_CLIENT_SECRET  from the GitHub OAuth App
 */
import crypto from 'node:crypto';

export default function handler(req, res) {
  const clientId = process.env.OAUTH_CLIENT_ID;
  if (!clientId) {
    res.status(500).send('OAUTH_CLIENT_ID is not set on this deployment.');
    return;
  }

  // Bind the callback to this request so a third party cannot replay it.
  const state = crypto.randomBytes(16).toString('hex');
  res.setHeader(
    'Set-Cookie',
    `decap_oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`
  );

  const proto = req.headers['x-forwarded-proto'] ?? 'https';
  const host = req.headers['x-forwarded-host'] ?? req.headers.host;

  const url = new URL('https://github.com/login/oauth/authorize');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', `${proto}://${host}/api/callback`);
  // `repo` is the narrowest scope that still allows committing to a repo.
  url.searchParams.set('scope', 'repo,user');
  url.searchParams.set('state', state);

  res.redirect(302, url.toString());
}
