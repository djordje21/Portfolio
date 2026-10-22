// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// [CHECK] Zameni sa pravim domenom kad ga kupiš (koristi se za canonical, hreflang i sitemap).
const SITE = 'https://djordje-milenkovic.netlify.app';

export default defineConfig({
  site: SITE,
  trailingSlash: 'always',
  build: { inlineStylesheets: 'always' },
  integrations: [
    sitemap({
      filter: (page) => new URL(page).pathname !== '/',
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', sr: 'sr-Latn', ru: 'ru' },
      },
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
