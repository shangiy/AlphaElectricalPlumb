import { MetadataRoute } from 'next';

/**
 * Dynamic Sitemap Generator v6.3.0
 * Authority source for search engine indexing.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://alphaelectricalsplumbingltd.com';
  const lastModified = new Date();

  const routes = [
    '',
    '/contact',
    '/about',
    '/category/tanks',
    '/category/plumbing',
    '/category/lighting',
    '/category/roofing',
    '/category/decor',
    '/faq',
    '/terms',
    '/privacy',
    '/data-deletion',
    '/returns',
    '/wishlist',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return routes;
}
