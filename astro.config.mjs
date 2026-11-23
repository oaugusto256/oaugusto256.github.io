// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://oaugusto256.github.io',
  trailingSlash: 'ignore',
  build: { format: 'directory' },

  i18n: {
    locales: ['en', 'pt'],
    defaultLocale: 'en',
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false },
  },

  // `/` is src/pages/index.astro: a static redirect stub that redirects before first paint.
  integrations: [mdx(), sitemap({
      // `/` is only a redirect stub to /en/.
      filter: (page) => page !== 'https://oaugusto256.github.io/',
      i18n: { defaultLocale: 'en', locales: { en: 'en', pt: 'pt-BR' } },
    })],
});