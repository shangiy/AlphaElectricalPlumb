
'use client';

import { useProducts } from '@/context/ProductProvider';
import ProductCard from '@/components/products/ProductCard';
import { useMemo } from 'react';
import { Loader2 } from 'lucide-react';

export default function RoofingPage() {
  const { products, loading } = useProducts();

  const roofingProducts = useMemo(() => {
    return products.filter(p => p.category === 'Mabati and Roofing');
  }, [products]);

  return (
    <section className="bg-secondary py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
            <h2 className="text-4xl font-bold font-headline text-primary">Roofing & Construction</h2>
            <p className="text-muted-foreground mt-2">High-quality Mabati and building essentials.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : roofingProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {roofingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-card rounded-2xl border-2 border-dashed">
            <h3 className="text-2xl font-headline font-semibold">No Products Found</h3>
            <p className="mt-2 text-muted-foreground">Building the future, one item at a time.</p>
          </div>
        )}
      </div>
    </section>
  );
}
