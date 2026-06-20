
import { MetadataRoute } from 'next';

/**
 * Dynamic Sitemap Generator
 * Replaces the static XML file to ensure search engines find all pages correctly
 * without triggering 404 errors in the Firebase Dashboard.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://alphaelectricalsplumbingltd.com';
  const lastModified = new Date();

  const routes = [
    '',
    '/contact',
    '/about',
    '/tanks',
    '/decor',
    '/plumbing',
    '/lighting',
    '/roofing',
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
