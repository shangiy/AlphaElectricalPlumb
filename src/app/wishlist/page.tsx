'use client';

import { mapProduct } from '@/lib/data';
import ProductCard from '@/components/products/ProductCard';
import type { Product } from '@/lib/types';
import { Heart, Loader2, ArrowRight } from 'lucide-react';
import AuthGuard from '@/components/auth/AuthGuard';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthProvider';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

/**
 * Enhanced Wishlist Page:
 * Fetches user's saved items along with full product details in a single joined query.
 */
function WishlistContent() {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const loadWishlist = useCallback(async () => {
    if (!user || !supabase) return;
    setLoading(true);
    try {
      // Fetch wishlist items with nested product info using relational join
      const { data: wishlistData, error: wishlistError } = await supabase
        .from('wishlists')
        .select(`
          id,
          product_id,
          products (
            *
          )
        `)
        .eq('user_id', user.id);

      if (wishlistError) throw wishlistError;

      if (!wishlistData || wishlistData.length === 0) {
        setWishlistItems([]);
        return;
      }

      // Map nested product objects to the standard Product type
      const hydratedProducts = wishlistData
        .filter(item => item.products) // Filter out any orphaned records
        .map(item => mapProduct(item.products));

      setWishlistItems(hydratedProducts);
    } catch (err) {
      console.error("Error loading wishlist items:", err);
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
          <p className="text-xl font-bold font-headline text-accent uppercase tracking-tighter">Syncing Your Favorites...</p>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
        <div className="container mx-auto px-4 py-12 lg:py-20">
        <div className="mb-16 text-center">
            <h1 className="text-5xl font-black font-headline text-accent tracking-tighter uppercase">My Collection</h1>
            <p className="mt-4 text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
              Your curated list of premium electrical and plumbing solutions saved for your next project.
            </p>
        </div>

        {wishlistItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {wishlistItems.map((product) => (
                  <ProductCard key={product.id} product={product} />
              ))}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center rounded-[4rem] border-2 border-dashed border-muted-foreground/10 bg-secondary/5 py-32 text-center">
                <div className="h-24 w-24 bg-white rounded-3xl flex items-center justify-center shadow-xl mb-8">
                  <Heart className="h-12 w-12 text-muted-foreground/20" />
                </div>
                <h3 className="text-3xl font-black font-headline text-accent uppercase tracking-tighter">Your Collection is Empty</h3>
                <p className="mt-4 text-lg text-muted-foreground max-w-sm mx-auto px-4 font-medium">
                    Found something interesting? Click the heart icon to save it here for later.
                </p>
                <div className="mt-10">
                  <Button asChild size="lg" className="rounded-full px-12 bg-primary font-black uppercase tracking-widest text-lg shadow-2xl hover:scale-105 transition-transform">
                    <Link href="/search" className="flex items-center gap-3">
                      Start Exploring
                      <ArrowRight size={20} />
                    </Link>
                  </Button>
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
