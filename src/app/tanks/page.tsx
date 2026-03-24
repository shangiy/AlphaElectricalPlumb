'use client';

import { getProducts } from '@/lib/data';
import ProductCard from '@/components/products/ProductCard';
import { useState, useEffect } from 'react';
import type { Product } from '@/lib/types';

export default function TanksPage() {
  const [tankProducts, setTankProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      const allProducts = await getProducts();
      const filtered = allProducts.filter(p => p.category === 'tanks');
      setTankProducts(filtered);
      setLoading(false);
    }
    loadProducts();
  }, []);


  return (
    <section className="bg-secondary py-12 md:py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold font-headline mb-8 text-center text-primary">Tanks Collection</h2>
        {loading ? (
          <p>Loading products...</p>
        ) : tankProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {tankProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h3 className="text-2xl font-headline font-semibold">No Products Found</h3>
            <p className="mt-2 text-muted-foreground">Please check back later.</p>
          </div>
        )}
      </div>
    </section>
  );
}
