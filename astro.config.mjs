// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://oaugusto256.github.io',
  trailingSlash: 'ignore',
  build: { format: 'directory' },

  i18n: {
    locales: ['en', 'pt'],
    defaultLocale: 'en',
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false },
  },

  redirects: { '/': '/en/' },
  integrations: [mdx()],
});