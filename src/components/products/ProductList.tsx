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
      <div className="flex justify-center py-10">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <span className="ml-3 text-muted-foreground">Loading catalog...</span>
      </div>
    );
  }

  if (!supabase && products.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed p-10 text-center">
        <p className="text-muted-foreground">Supabase configuration missing. Please check your environment variables.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h2 className="mb-8 text-3xl font-bold font-headline text-primary">Alpha Electrical & Plumbing Catalog</h2>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => {
            // Priority: image_path from storage, then image_url, then placeholder
            let imageUrl = 'https://placehold.co/400x400?text=No+Image';
            
            if (product.image_path && supabase) {
              imageUrl = supabase.storage.from('products').getPublicUrl(product.image_path).data.publicUrl;
            } else if (product.image_url) {
              imageUrl = product.image_url;
            } else if (product.imageUrls && product.imageUrls.length > 0) {
              imageUrl = product.imageUrls[0];
            }

            return (
              <div key={product.id} className="group flex flex-col rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow-md">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="mt-4 flex flex-1 flex-col">
                  <h3 className="text-lg font-bold font-headline line-clamp-1">{product.name}</h3>
                  <p className="mt-1 text-xl font-black text-primary">KES {product.price?.toLocaleString() || '0'}</p>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2 flex-1">{product.description}</p>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="rounded-full bg-secondary px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-secondary-foreground">
                      {product.category}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border-2 border-dashed p-20 text-center">
          <p className="text-xl font-semibold">No products found in the database.</p>
          <p className="text-muted-foreground">Try adding some products in the admin panel or Supabase dashboard.</p>
        </div>
      )}
    </div>
  );
}
