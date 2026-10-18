import { getProducts } from '@/lib/data';
import ProductCard from '@/components/products/ProductCard';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

/**
 * Robust Category Page: 
 * Uses the central getProducts utility to ensure images are correctly resolved.
 * Implements flexible filtering that matches by name, description, category field, or storage path.
 */
export default async function CategoryPage({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  const slug = decodeURIComponent(resolvedParams.slug || '').replace(/-/g, ' ');

  // Fetch all products via the helper to ensure self-healing image URLs are populated
  const allProducts = await getProducts();

  // Flexible filtering: matches product name, description, category field, or image path folder
  const filteredProducts = allProducts.filter((product) => {
    const searchSlug = slug.toLowerCase();
    
    // Check various fields for a match to support multi-category and descriptive tagging
    const nameMatch = product.name?.toLowerCase().includes(searchSlug);
    const descMatch = (product.description || product.longDescription)?.toLowerCase().includes(searchSlug);
    const catMatch = product.category?.toLowerCase().includes(searchSlug);
    const pathMatch = product.image_path?.toLowerCase().includes(searchSlug);
    
    return nameMatch || descMatch || catMatch || pathMatch;
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
          <div className="flex flex-col items-center justify-center py-24 bg-muted/5 rounded-[3rem] border-2 border-dashed border-muted-foreground/20 text-center">
            <p className="text-muted-foreground text-lg mb-8 font-medium italic">
              "Oops! We don't have any items in the {slug} collection right now."
            </p>
            
            <Button asChild size="lg" className="relative group overflow-hidden bg-[#28235f] text-white px-10 py-8 rounded-full font-black text-xl transition-all duration-300 hover:scale-110 hover:shadow-[0_0_40px_rgba(40,35,95,0.4)] active:scale-95 animate-pulse hover:animate-none">
              <Link href="/search" className="flex items-center gap-3">
                VIEW OTHER PRODUCTS
                <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
              </Link>
            </Button>
            <p className="mt-4 text-[10px] uppercase tracking-widest font-bold text-muted-foreground/60">
              Click to explore our full 100+ inventory
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
