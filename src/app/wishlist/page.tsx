'use client';

import { getProducts } from '@/lib/data';
import ProductCard from '@/components/products/ProductCard';
import type { Product } from '@/lib/types';
import { Heart } from 'lucide-react';
import AuthGuard from '@/components/auth/AuthGuard';
import { useState, useEffect } from 'react';

function WishlistContent() {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWishlist() {
      // In a real app, this would be a fetch to a user-specific API
      const allProducts = await getProducts();
      setWishlistItems(allProducts.slice(1, 5));
      setLoading(false);
    }
    loadWishlist();
  }, []);
  
  if (loading) {
    return (
       <div className="container mx-auto px-4 py-12">
        <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold font-headline text-primary">My Wishlist</h1>
            <p className="mt-2 text-lg text-muted-foreground">Your collection of favorite items saved for later.</p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <p>Loading wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-secondary">
        <div className="container mx-auto px-4 py-12">
        <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold font-headline text-primary">My Wishlist</h1>
            <p className="mt-2 text-lg text-muted-foreground">Your collection of favorite items saved for later.</p>
        </div>

        {wishlistItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wishlistItems.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card py-20 text-center">
                <Heart className="h-16 w-16 text-muted-foreground" />
                <h3 className="mt-4 text-2xl font-headline font-semibold">Your Wishlist is Empty</h3>
                <p className="mt-2 text-muted-foreground">
                    Start exploring and add items you love!
                </p>
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
