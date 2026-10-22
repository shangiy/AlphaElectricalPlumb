'use client';

import { getProducts } from '@/lib/data';
import ProductCard from '@/components/products/ProductCard';
import type { Product } from '@/lib/types';
import { Heart, Loader2 } from 'lucide-react';
import AuthGuard from '@/components/auth/AuthGuard';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthProvider';
import Link from 'next/link';

function WishlistContent() {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const loadWishlist = useCallback(async () => {
    if (!user || !supabase) return;
    setLoading(true);
    try {
      // 1. Fetch user's wishlist IDs from the dedicated table
      const { data: wishlistData, error: wishlistError } = await supabase
        .from('wishlists')
        .select('product_id')
        .eq('user_id', user.id);

      if (wishlistError) throw wishlistError;

      const productIds = wishlistData.map(w => w.product_id);
      
      if (productIds.length === 0) {
        setWishlistItems([]);
        return;
      }

      // 2. Fetch full product details for those IDs from our central inventory
      const allProducts = await getProducts();
      // Use inclusive matching for IDs to ensure items show up regardless of string/UUID format
      const filtered = allProducts.filter(p => productIds.some(id => String(id) === String(p.id)));
      setWishlistItems(filtered);
    } catch (err) {
      console.error("Error loading wishlist:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);
  
  if (loading) {
    return (
       <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-lg font-medium text-muted-foreground">Syncing your saved items...</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
        <div className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold font-headline text-primary">My Wishlist</h1>
            <p className="mt-2 text-lg text-muted-foreground">Your collection of favorite items saved for later.</p>
        </div>

        {wishlistItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {wishlistItems.map((product) => (
                  <ProductCard key={product.id} product={product} />
              ))}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-border bg-card py-24 text-center">
                <Heart className="h-16 w-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-2xl font-headline font-semibold">Your Wishlist is Empty</h3>
                <p className="mt-2 text-muted-foreground max-w-sm mx-auto px-4">
                    Start exploring our catalog and click the heart icon on items you love!
                </p>
                <div className="mt-8">
                  <Link href="/search" className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary/90 transition-all shadow-md">
                    Browse Products
                  </Link>
                </div>
            </div>
        )}
        </div>
    </div>
  );
}

export default function WishlistPage() {
    return (
        <AuthGuard>
            <WishlistContent />
        </AuthGuard>
    );
}
