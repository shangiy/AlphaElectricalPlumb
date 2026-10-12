'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

/**
 * ProductList Component
 * Fetches and displays products from Supabase.
 * Marked with 'use client' because it uses React state and effects.
 */
export default function ProductList() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      // Safety check: skip if Supabase is not initialized
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (error) {
        console.error('Error fetching products:', error);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    }

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <span className="mt-4 font-medium text-muted-foreground">Loading catalog...</span>
      </div>
    );
  }

  // Graceful fallback for missing Supabase config
  if (!supabase && products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="rounded-2xl border-2 border-dashed p-10 text-center bg-muted/5">
          <p className="text-muted-foreground font-medium">Supabase configuration missing.</p>
          <p className="text-sm text-muted-foreground mt-1">Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to Vercel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <h2 className="text-3xl font-bold font-headline text-primary">Alpha Electrical & Plumbing Catalog</h2>
        <p className="text-muted-foreground mt-1">Real-time inventory synced with Supabase</p>
      </div>
      
      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => {
            /**
             * IMAGE RESOLUTION LOGIC:
             * 1. If image_path exists, use Supabase Storage public URL.
             * 2. Else use image_url (direct URL string).
             * 3. Else use first item from imageUrls array (migration format).
             * 4. Fallback to placeholder.
             */
            let imageUrl = '/placeholder.jpg';
            
            if (product.image_path && supabase) {
              imageUrl = supabase.storage.from('products').getPublicUrl(product.image_path).data.publicUrl;
            } else if (product.image_url) {
              imageUrl = product.image_url;
            } else if (product.imageUrls && product.imageUrls.length > 0) {
              imageUrl = product.imageUrls[0];
            } else {
              imageUrl = `https://placehold.co/400x400?text=${encodeURIComponent(product.name)}`;
            }

            return (
              <div key={product.id} className="group flex flex-col rounded-2xl border bg-card p-4 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/400x400?text=Image+Not+Found";
                    }}
                  />
                </div>
                <div className="mt-5 flex flex-1 flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary/60 mb-1">
                    {product.category}
                  </span>
                  <h3 className="text-lg font-bold font-headline line-clamp-2 leading-tight min-h-[3rem]">
                    {product.name}
                  </h3>
                  <p className="mt-2 text-2xl font-black text-primary">
                    KES {product.price?.toLocaleString() || '0'}
                  </p>
                  <p className="mt-3 text-sm text-muted-foreground line-clamp-2 flex-1 leading-relaxed">
                    {product.description}
                  </p>
                  
                  <div className="mt-6 pt-4 border-t flex items-center justify-between">
                    <span className="text-xs font-bold text-muted-foreground">
                      {product.stockCount > 0 ? `${product.stockCount} in stock` : 'Out of stock'}
                    </span>
                    <button className="text-xs font-bold text-primary hover:underline">
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-dashed p-20 text-center bg-muted/5">
          <p className="text-xl font-bold font-headline text-muted-foreground">No products found</p>
          <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
            Your catalog is currently empty. Add items via the Supabase dashboard to see them here.
          </p>
        </div>
      )}
    </div>
  );
}
