import { redirect } from 'next/navigation';

/**
 * Legacy Shop Route Redirector:
 * Catches any historical /shop/[category] links and routes them
 * to the modern /category/[slug] architecture.
 */
export default async function LegacyShopPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params;
  const category = resolvedParams.category;
  
  // Cleanly redirect to the standard category route
  redirect(`/category/${category}`);
}
