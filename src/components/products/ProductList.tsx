
'use client';

import { useProducts } from '@/context/ProductProvider';
import ProductCard from './ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Package } from 'lucide-react';

/**
 * ProductList Component
 * Displays the product catalog fetched from Supabase.
 * The image resolution (stripping prefixes) is handled centrally in ProductProvider/data.ts.
 */
export default function ProductList() {
  const { products, loading } = useProducts();

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="aspect-square w-full rounded-2xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-3xl bg-muted/10 border-muted-foreground/20">
        <Package className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
        <h3 className="text-xl font-bold text-muted-foreground font-headline">No Products Found</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
          We couldn't find any products in the database. Please verify your Supabase connection and catalog.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-headline text-accent">Our Product Catalog</h2>
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest bg-muted px-3 py-1 rounded-full">
          {products.length} Items
        </span>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
