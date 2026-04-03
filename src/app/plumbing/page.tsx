
'use client';

import { useProducts } from '@/context/ProductProvider';
import ProductCard from '@/components/products/ProductCard';
import { useMemo } from 'react';
import { Loader2 } from 'lucide-react';

export default function PlumbingPage() {
  const { products, loading } = useProducts();

  const plumbingProducts = useMemo(() => {
    return products.filter(p => p.category === 'Plumbing');
  }, [products]);

  return (
    <section className="bg-secondary py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
            <h2 className="text-4xl font-bold font-headline text-primary">Plumbing Equipment</h2>
            <p className="text-muted-foreground mt-2">Professional grade pipes, fittings, and accessories.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : plumbingProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {plumbingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-card rounded-2xl border-2 border-dashed">
            <h3 className="text-2xl font-headline font-semibold">No Products Found</h3>
            <p className="mt-2 text-muted-foreground">High-quality plumbing solutions are on their way.</p>
          </div>
        )}
      </div>
    </section>
  );
}
