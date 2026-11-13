
import { redirect } from 'next/navigation';
import { getProducts } from '@/lib/data';

/**
 * Legacy ID Redirector:
 * Catches historical UUID links and redirects them to the new SEO-friendly slug URLs.
 * This prevents the 500 Route Conflict error.
 */
export default async function LegacyProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  const allProducts = await getProducts();
  const product = allProducts.find(p => p.id === id);

  if (product && product.slug) {
    redirect(`/products/${product.slug}`);
  }

  // If no product found or no slug, redirect to search
  redirect('/search');
}
