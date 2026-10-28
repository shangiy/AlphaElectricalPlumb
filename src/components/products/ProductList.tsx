'use client';

import { useProducts } from '@/context/ProductProvider';
import ProductCard from './ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, Search, ArrowRight, Barcode } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ProductListProps {
  products?: Product[];
}

/**
 * Inclusive Product List.
 * Supports comma-separated categories, fuzzy search, and barcode-exact matching.
 */
export default function ProductList({ products: initialProducts }: ProductListProps) {
  const { products: contextProducts, loading } = useProducts();
  const searchParams = useSearchParams();
  const query = (searchParams.get('q') || '').toLowerCase().trim();
  const barcode = (searchParams.get('barcode') || '').trim();
  const categoryFilter = searchParams.get('category')?.toLowerCase();

  const products = initialProducts || contextProducts;

  const filteredProducts = useMemo(() => {
    let list = products || [];
    
    // 1. Direct Barcode Match (Highest Priority)
    if (barcode) {
        return list.filter(p => p.barcode === barcode);
    }

    // 2. Apply inclusive category filter
    if (categoryFilter) {
      list = list.filter(p => {
        if (!p || !p.category) return false;
        const dbCat = p.category.toLowerCase();
        return dbCat === categoryFilter || dbCat.includes(categoryFilter);
      });
    }
    
    // 3. Apply fuzzy text search
    if (query) {
      list = list.filter(p => {
        if (!p) return false;
        
        const name = (p.name ?? '').toLowerCase();
        const desc = (p.description ?? p.longDescription ?? '').toLowerCase();
        const cat = (p.category ?? '').toLowerCase();
        
        return (
          name.includes(query) || 
          desc.includes(query) || 
          cat.includes(query)
        );
      });
    }
    
    return list;
  }, [products, query, categoryFilter, barcode]);

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
          We couldn't find any products in the database.
        </p>
      </div>
    );
  }

  const resultTitle = barcode
    ? `Product ID: ${barcode}`
    : categoryFilter 
      ? `Collection: ${categoryFilter}`
      : query 
        ? `Results for "${query}"` 
        : 'Our Product Catalog';

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
             {barcode && <Barcode className="h-6 w-6 text-primary" />}
             <h2 className="text-2xl font-bold font-headline text-accent capitalize">
                {resultTitle}
            </h2>
        </div>
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest bg-muted px-3 py-1 rounded-full">
          {filteredProducts.length} Items Found
        </span>
      </div>
      
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 bg-muted/5 rounded-[3rem] border-2 border-dashed border-muted-foreground/20">
             <Search className="h-16 w-16 text-muted-foreground mb-4 opacity-20" />
             <p className="text-muted-foreground text-lg mb-8 font-medium italic">"No matches for this scan. We're updating our inventory cycle daily."</p>
             
             <Button asChild size="lg" className="relative group overflow-hidden bg-[#28235f] text-white px-10 py-8 rounded-full font-black text-xl transition-all duration-300 hover:scale-110 hover:shadow-[0_0_40px_rgba(40,35,95,0.4)] active:scale-95 animate-pulse hover:animate-none">
                <Link href="/search" className="flex items-center gap-3">
                    VIEW OTHER PRODUCTS
                    <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                </Link>
             </Button>
             <p className="mt-4 text-[10px] uppercase tracking-widest font-bold text-muted-foreground/60">Click to explore our full 100+ inventory</p>
        </div>
      )}
    </div>
  );
}
