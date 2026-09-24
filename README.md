# The Idea Stock

The studio site for The Idea Stock (Dubai), built with [Astro](https://astro.build). Static output, no server, no database.

| Route        | Page                                                                        |
| ------------ | --------------------------------------------------------------------------- |
| `/`          | Studio home: ventures, approach, contact                                      |
| `/portfolio` | Shaibi Shamsudeen's AI systems portfolio: case studies, research, career      |

## Running it

```bash
npm install
npm run dev      # http://localhost:4321
```

| Script            | Does                                        |
| ----------------- | ------------------------------------------- |
| `npm run dev`     | Dev server with hot reload                  |
| `npm run build`   | Static build into `dist/` (git-ignored)     |
| `npm run preview` | Serve the built output exactly as it deploys |

## Layout

```
src/
  layouts/Base.astro       Shared shell: head tags, nav, footer, theme toggle
  components/              Reusable pieces (VentureCard)
  data/ventures.js         The venture list that drives the home page
  pages/index.astro        Studio home
  pages/portfolio.astro    AI portfolio
  styles/global.css        Design tokens and every component style
public/                    Served verbatim at the site root: fonts, images, PDFs
```

### Adding a venture

Append an entry to `src/data/ventures.js`. Nothing else needs editing — the home page maps over that array.

`layer` must be one of `agents`, `retrieval`, `safety`, `controls`, `data`, `workflows`. It selects a `--layer-*` colour token, which tints the card. The colour is meaningful: it tells a reader which layer of an AI system the work sits in, and the portfolio's filter chips use the same scale.

### Design notes

- **Fonts.** Schibsted Grotesk (SIL Open Font License) is self-hosted in `public/fonts/`, so the site makes no third-party requests.
- **Themes.** Dark and light, remembered in `localStorage`. The choice is applied by an inline script in `<head>` before first paint, so the page never flashes the wrong colours. If you move that script, keep it inline and keep it first.
- **Card contract.** Every project and venture card uses the same order: badge, type, title, outcome, summary, optional details, tags, links. The badge sits on its own row on purpose — when it shared a line with the type it wrapped on narrow cards and knocked titles out of horizontal alignment.
- **Contact forms** have no backend. They open the visitor's email client with the message pre-filled. To deliver messages directly, point the submit handler at a service such as Formspree.

## Deploying

Vercel, from this repo.

**The project settings must be:**

| Setting          | Value    |
| ---------------- | -------- |
| Framework Preset | Astro    |
| Build Command    | `npm run build` |
| Output Directory | `dist`   |
| Root Directory   | *(repo root)* |

> This changed. The site was previously plain HTML committed directly into `dist/` with Framework Preset "Other" and an empty build command. `dist/` is now generated output and is git-ignored — if Vercel is still set to "Other", the deploy will serve nothing.

### Before the first deploy on this domain

1. `theideastock.com` previously served an e-commerce store. Export anything worth keeping (orders, product images, customer list) and repoint DNS at Vercel.
2. Absolute URLs come from `site` in `astro.config.mjs`. Change that one value if the domain changes, and every `canonical`, `og:url` and `og:image` follows.
3. After deploying, run the live URL through LinkedIn's Post Inspector to confirm the preview card resolves, and re-check it if you ever change the domain — LinkedIn caches aggressively.
