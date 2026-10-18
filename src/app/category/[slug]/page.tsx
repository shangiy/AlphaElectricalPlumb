import { getProducts, categories } from '@/lib/data';
import ProductCard from '@/components/products/ProductCard';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Dynamic Category Page with Inclusive Filtering.
 * Supports comma-separated multi-categories (e.g., "Lighting, Decor").
 */
export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  
  // Decode slug for comparison
  const decodedSlug = decodeURIComponent(slug);

  // Find the category display name for the heading
  const categoryInfo = categories.find(c => c.id === decodedSlug);
  const displayName = categoryInfo ? categoryInfo.name : decodedSlug.replace(/-/g, ' ');

  // Fetch all products and apply inclusive filtering
  const allProducts = await getProducts();
  
  const products = allProducts.filter(p => {
    if (!p.category) return false;
    
    // Normalize values for comparison
    const dbCategory = p.category.toLowerCase();
    const searchId = decodedSlug.toLowerCase();
    const searchName = displayName.toLowerCase();

    // Check if the product matches by exact ID, display name, or as part of a multi-category string
    return (
      dbCategory === searchId || 
      dbCategory === searchName ||
      dbCategory.includes(searchId) ||
      dbCategory.includes(searchName) ||
      (categoryInfo && dbCategory.includes(categoryInfo.id.toLowerCase()))
    );
  });

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="mb-10">
          <Link href="/" className="text-sm font-bold text-primary hover:underline flex items-center gap-2 mb-4">
            ← Back to Home
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold font-headline text-accent capitalize">
                {displayName}
              </h1>
              <p className="text-muted-foreground mt-2 max-w-2xl">
                Explore our selection of high-quality products in the {displayName} collection.
              </p>
            </div>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest bg-muted px-4 py-2 rounded-full h-fit">
              {products.length} Products Available
            </span>
          </div>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-muted/20 rounded-[3rem] border-2 border-dashed border-muted-foreground/20">
            <div className="max-w-md mx-auto">
              <p className="text-muted-foreground text-lg mb-6">
                No products found in the "{displayName}" category yet.
              </p>
              <Link
                href="/search"
                className="inline-block px-8 py-4 bg-[#28235f] text-white rounded-full font-bold transition-all hover:scale-105"
              >
                View Other Products
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
