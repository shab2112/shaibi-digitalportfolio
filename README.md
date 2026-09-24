# The Idea Stock

The site for The Idea Stock (Dubai), an AI systems lab. Built with [Astro](https://astro.build). Static output, no server, no database.

| Route                | Page                                                                   |
| -------------------- | ---------------------------------------------------------------------- |
| `/`                  | Lab home: projects, approach, contact                                    |
| `/portfolio`         | Shaibi Shamsudeen's AI systems portfolio: case studies, research, career |
| `/projects/<slug>`   | A project's case study. Only generated for projects that opt in.         |
| `/admin`             | Decap CMS. Edits commit to this repo and trigger a rebuild.              |

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
api/                       Vercel serverless functions (GitHub OAuth for the CMS)
src/
  content/projects/        One markdown file per project. The CMS edits these.
  content.config.ts        Schema for the above; the build fails if a file breaks it
  layouts/Base.astro       Shared shell: head tags, nav, footer, theme toggle
  components/              Reusable pieces (VentureCard)
  pages/index.astro        Lab home
  pages/portfolio.astro    AI portfolio
  pages/projects/[slug]    Case-study pages, generated per opted-in project
  styles/global.css        Design tokens and every component style
public/                    Served verbatim at the site root: fonts, images, PDFs
public/admin/              Decap CMS shell and its schema
```

### Adding a project

Either use `/admin`, or add a markdown file to `src/content/projects/`. Both write the same thing, and the schema in `src/content.config.ts` validates it at build time — a missing or misspelled field fails the build rather than shipping a broken card.

Two things worth knowing:

- **`layer`** must be one of `agents`, `retrieval`, `safety`, `controls`, `data`, `workflows`. It selects a `--layer-*` colour token, which tints the card. The colour is meaningful: it tells a reader which layer of an AI system the work sits in, and the portfolio's filter chips use the same scale.
- **`detailPage`** decides whether the project is a card only or also gets its own page. When it is `true`, the file's markdown body is published at `/projects/<slug>` and the card links there instead of to `link`. When `false`, the body is ignored and the card links straight out to `link`.

`order` sorts the home page, lowest first. `draft: true` hides a project from the live site.

### Design notes

- **Fonts.** Schibsted Grotesk (SIL Open Font License) is self-hosted in `public/fonts/`, so the site makes no third-party requests.
- **Themes.** Dark and light, remembered in `localStorage`. The choice is applied by an inline script in `<head>` before first paint, so the page never flashes the wrong colours. If you move that script, keep it inline and keep it first.
- **Card contract.** Every project and venture card uses the same order: badge, type, title, outcome, summary, optional details, tags, links. The badge sits on its own row on purpose — when it shared a line with the type it wrapped on narrow cards and knocked titles out of horizontal alignment.
- **Contact forms** have no backend. They open the visitor's email client with the message pre-filled. To deliver messages directly, point the submit handler at a service such as Formspree.

## Deploying

Vercel, from this repo.

Build settings live in `vercel.json` (framework, build command, output directory) so they are version-controlled and override whatever the dashboard says. There is nothing to configure by hand.

> This changed. The site was previously plain HTML committed directly into `dist/`, deployed with Framework Preset "Other" and an empty build command. `dist/` is now generated output and is git-ignored, so that old configuration would fail the build. `vercel.json` is what corrects it.

If the dashboard still shows "Other" as the Framework Preset, that is fine — `vercel.json` takes precedence. Confirm on the next deployment's build log that it runs `npm run build`.

## The CMS

`/admin` runs [Decap CMS](https://decapcms.org). It is a git-backed editor: you sign in with GitHub, and saving opens a pull request against `main` (`publish_mode: editorial_workflow`). Merging it triggers a Vercel rebuild. Nothing is stored outside the repo, so content is versioned with the code and there is no database to maintain.

### One-time setup

Decap only hosts an OAuth provider for Netlify, so this repo ships its own in `api/`.

1. On GitHub: **Settings → Developer settings → OAuth Apps → New OAuth App**
   - Homepage URL: `https://theideastock.com`
   - Authorization callback URL: `https://theideastock.com/api/callback`
2. In Vercel, add the two credentials as environment variables:
   - `OAUTH_CLIENT_ID`
   - `OAUTH_CLIENT_SECRET`
3. Redeploy so the functions pick them up, then open `https://theideastock.com/admin`.

`repo` in `public/admin/config.yml` must match the GitHub repository. If the repo is ever renamed, update it there.

### Notes

- Anyone with write access to the repository can sign in to `/admin`. Access is GitHub's to control, not the site's.
- The editor is unavailable on `localhost` unless you point `base_url` at a running tunnel. Editing the markdown files directly is usually quicker in development.
- Images uploaded through the CMS land in `public/uploads/` and are committed to the repo. That is fine for a handful; if it grows to hundreds, move to an image host.

### Before the first deploy on this domain

1. `theideastock.com` previously served an e-commerce store. Export anything worth keeping (orders, product images, customer list) and repoint DNS at Vercel.
2. Absolute URLs come from `site` in `astro.config.mjs`. Change that one value if the domain changes, and every `canonical`, `og:url` and `og:image` follows.
3. After deploying, run the live URL through LinkedIn's Post Inspector to confirm the preview card resolves, and re-check it if you ever change the domain — LinkedIn caches aggressively.
