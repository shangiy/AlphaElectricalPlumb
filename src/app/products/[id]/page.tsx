
/**
 * LEGACY ROUTE DEPRECATED
 * 
 * This folder [id] is causing a Next.js dynamic routing conflict with [slug].
 * Product routing has been unified in src/app/products/[slug]/page.tsx.
 * 
 * IMPORTANT: To fully resolve the server crash, please delete the 
 * 'src/app/products/[id]' folder from your project filesystem manually.
 */

export const dynamic = 'force-static';

export default function DeprecatedRoute() {
  return null;
}
