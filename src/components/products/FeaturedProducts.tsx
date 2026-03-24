
'use client';

import { useProducts } from '@/context/ProductProvider';
import type { Product } from '@/lib/types';
import ProductCard from './ProductCard';
import { Skeleton } from '../ui/skeleton';
import { useMemo } from 'react';

export default function FeaturedProducts() {
  const { products, loading } = useProducts();

  // Use useMemo to select featured products only when the main products list changes
  const featuredProducts = useMemo(() => {
    // If you want to feature specific products by ID or barcode
    const featuredIdsOrBarcodes = [
      'ALPHA-ELEC-001', // Ample Light
      'PPR-MA-50', // PPR MALE ADAPTOR
      'FB-CIST-4', // Full Bora 4" moshefa
      '16414', // 2L Classic water bottle
      'ALPHA-ELEC-TRCK-01', // 20W Vellmax Tracklight
      '16386', // 20mm Bend SWAMI
      '16496', // IFLUX WATER HEATER SWITCH
      '16466', // 3w WarmWhite FAME
      '2186484' // KS1010 Shower Mixer
    ];

    // First, try to find products by ID or barcode
    let specificProducts = products.filter(p => featuredIdsOrBarcodes.includes(p.id) || (p.barcode && featuredIdsOrBarcodes.includes(p.barcode)));

    // If we don't have enough, fill the rest with products marked as `isFeatured`
    if (specificProducts.length < 10) {
      const featuredFlags = products.filter(p => p.isFeatured && !specificProducts.some(sp => sp.id === p.id));
      specificProducts.push(...featuredFlags.slice(0, 10 - specificProducts.length));
    }
    
    // If still not enough, take some from the top of the general list
    if (specificProducts.length < 10) {
       const otherProducts = products.filter(p => !specificProducts.some(sp => sp.id === p.id));
       specificProducts.push(...otherProducts.slice(0, 10 - specificProducts.length));
    }
    
    return specificProducts.slice(0,10);

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
                    {[...Array(5)].map((_, i) => (
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


  return (
    <section className="bg-background py-16">
      <div className="container mx-auto px-4">
        <div className="text-center">
            <h2 className="text-3xl font-bold font-headline mb-4 text-primary">Featured Products</h2>
            <p className="text-muted-foreground mb-10 max-w-2xl mx-auto">
                Check out our hand-picked selection of top-quality products.
            </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
