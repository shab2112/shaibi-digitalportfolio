// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://theideastock.com',
  // Static output: the whole site is prerendered, so it deploys anywhere.
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  // /admin is the CMS shell, not content; robots.txt excludes it too.
  integrations: [sitemap({ filter: (page) => !page.includes('/admin') })],
});
