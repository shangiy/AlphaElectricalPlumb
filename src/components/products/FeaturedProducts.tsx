
'use client';

import { useProducts } from '@/context/ProductProvider';
import type { Product } from '@/lib/types';
import ProductCard from './ProductCard';
import { Skeleton } from '../ui/skeleton';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function FeaturedProducts() {
  const { products, loading } = useProducts();

  const featuredProducts = useMemo(() => {
    // Show products marked as featured first
    const featured = products.filter(p => p.isFeatured);
    if (featured.length > 0) return featured.slice(0, 50);
    
    // Fallback: show the first 50 products from the database to populate the grid
    return products.slice(0, 50);
  }, [products]);

  if (loading) {
    return (
        <section className="bg-background py-16">
            <div className="container mx-auto px-4">
                 <div className="text-center">
                    <Skeleton className="h-9 w-1/3 mx-auto mb-4" />
                    <Skeleton className="h-5 w-1/2 mx-auto mb-10" />
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="aspect-square w-full" />
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-5 w-1/2" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="bg-background py-16">
      <div className="container mx-auto px-4">
        <div className="text-center">
            <h2 className="text-3xl font-bold font-headline mb-4 text-[#28235f]">Featured Products</h2>
            <p className="text-muted-foreground mb-10 max-w-2xl mx-auto">
                Discover our curated selection of high-quality electrical and plumbing solutions from our {products.length}+ inventory.
            </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <div className="mt-12 flex justify-center">
          <Button asChild size="lg" className="w-full sm:w-auto min-w-[280px] bg-[#28235f] hover:bg-[#28235f]/90 text-white font-bold py-6 text-lg rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 active:scale-95">
            <Link href="/search">Explore All {products.length} Products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
