
import { MetadataRoute } from 'next';

/**
 * Standard robots.txt generator to prevent 404 errors 
 * when search engines crawl the site.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/',
    },
    sitemap: 'https://alphaelectricalsplumbingltd.com/sitemap.xml',
  };
}
