import { supabase } from '@/lib/supabaseClient';
import ProductCard from '@/components/products/ProductCard';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

/**
 * Robust Category Page: 
 * Implements flexible filtering that matches by name, description, category field, or storage path.
 * Supports multi-category display and provides navigation to the full catalog.
 */
export default async function CategoryPage({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  const slug = decodeURIComponent(resolvedParams.slug || '').replace(/-/g, ' ');

  // Fetch all products from Supabase to apply flexible local filtering
  const { data: products, error } = await supabase
    .from('products')
    .select('*');

  if (error) {
    console.error('Error fetching products for category:', error);
  }

  // Flexible filtering: matches product name, description, category field, or image path folder
  const filteredProducts = products?.filter((product) => {
    const searchSlug = slug.toLowerCase();
    
    // Check various fields for a match to support multi-category and descriptive tagging
    const nameMatch = product.name?.toLowerCase().includes(searchSlug);
    const descMatch = (product.description || product.longDescription)?.toLowerCase().includes(searchSlug);
    const catMatch = product.category?.toLowerCase().includes(searchSlug);
    const pathMatch = product.image_path?.toLowerCase().includes(searchSlug);
    
    return nameMatch || descMatch || catMatch || pathMatch;
  }) || [];

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
                {slug} Collection
              </h1>
              <p className="text-muted-foreground mt-2 max-w-2xl">
                Explore our selection of high-quality products in the {slug} collection.
              </p>
            </div>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest bg-muted px-4 py-2 rounded-full h-fit">
              {filteredProducts.length} Products Available
            </span>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-muted/20 rounded-[3rem] border-2 border-dashed border-muted-foreground/20">
            <div className="max-w-md mx-auto">
              <p className="text-muted-foreground text-lg mb-6">
                No products found in "{slug}" yet.
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
