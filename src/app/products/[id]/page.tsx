
/**
 * DEPRECATED DYNAMIC SEGMENT [id]
 * 
 * This file has been neutralized to resolve the Next.js routing conflict:
 * 'You cannot use different slug names for the same dynamic path (id !== slug)'
 * 
 * All product logic has been unified in: src/app/products/[slug]/page.tsx
 * which handles both legacy IDs and new hyphenated Slugs.
 * 
 * CRITICAL: To stop the server crash, this file MUST NOT have a default export 'Page'.
 */

export const dynamic = 'force-static';

// Non-routing manifest entry
export const legacy_manifest = {
  status: 'deprecated',
  redirect_target: '/products/[slug]'
};
