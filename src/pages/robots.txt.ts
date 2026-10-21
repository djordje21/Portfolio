import type { APIRoute } from 'astro';
import { site } from '../site.config';

// Dok sajt nije javan, pretraživači ne smeju da ga indeksiraju.
export const GET: APIRoute = ({ site: url }) => {
  const body = site.indexable
    ? `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', url)}\n`
    : 'User-agent: *\nDisallow: /\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
