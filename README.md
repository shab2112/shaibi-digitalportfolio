# Shaibi Shamsudeen AI Systems Portfolio

This is the complete source of the current static portfolio Site. The website uses plain HTML, CSS, and JavaScript; no package installation or build step is required. The two PDF downloads are included in `dist/`.

## Deploy with Vercel

1. Add the contents of this folder to the root of `shab2112/shaibi-digitalportfolio` on GitHub. Keep the `dist` directory and its contents together.
2. In Vercel, import that GitHub repository as a new project.
3. Set **Framework Preset** to **Other**, leave **Build Command** empty, and set **Output Directory** to `dist`. Keep **Root Directory** as the repository root.
4. Deploy. Future commits to the linked GitHub branch can trigger new deployments.

For a local preview, serve `dist/` with any static file server, for example `python3 -m http.server 8000 --directory dist` and open `http://localhost:8000`.

`.openai/hosting.json` records the original ChatGPT Site's static output location. It is not required by Vercel, but is included to preserve the full source layout.

## Before you publish

1. The social preview tags (`canonical`, `og:url`, `og:image`) in `dist/index.html` are set to `https://theideastock.com/shaibi_aiportfolio`. If the site moves, update all three: LinkedIn and other sites need absolute URLs to show `dist/og-image.png`.
2. The typeface (Schibsted Grotesk, SIL Open Font License) is self-hosted in `dist/fonts/`, so the site makes no third-party requests.
3. The contact form has no backend: it opens the visitor's email app with their message filled in. If you later want messages delivered directly, connect it to a form service such as Formspree and change the submit handler in `script.js`.
4. Visitors can switch between dark and light themes; their choice is remembered in their browser.
