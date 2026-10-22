'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Heart, ShoppingCart, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Product } from '@/lib/types';
import { Rating } from '@/components/ui/rating';
import { useCart } from '@/context/CartProvider';
import { useAuth } from '@/context/AuthProvider';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

/**
 * Premium Interactive Product Card v2.4.1:
 * Features: Supabase Wishlist Sync, dual buttons, hover carousel, and refined pricing.
 */
export default function ProductCard({ product }: { product: Product }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [failedUrls, setFailedUrls] = useState<Set<string>>(new Set());
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    setCurrentIndex(0);
    setFailedUrls(new Set());
  }, [product.id, product.imageUrls]);

  // Check if item is in user's Supabase wishlist
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!user || !supabase) return;
      try {
        const { data, error } = await supabase
          .from('wishlists')
          .select('id')
          .eq('user_id', user.id)
          .eq('product_id', product.id)
          .maybeSingle();

        if (data) setIsInWishlist(true);
      } catch (e) {
        console.error("Wishlist status check failed:", e);
      }
    };
    checkWishlistStatus();
  }, [user, product.id]);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please sign in to save items to your wishlist.",
        variant: "destructive",
      });
      return;
    }

    if (!supabase) return;

    setIsWishlistLoading(true);
    try {
      if (isInWishlist) {
        const { error } = await supabase
          .from('wishlists')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', product.id);
        
        if (!error) {
          setIsInWishlist(false);
          toast({ description: "Removed from wishlist." });
        }
      } else {
        const { error } = await supabase
          .from('wishlists')
          .insert([{ user_id: user.id, product_id: product.id }]);
        
        if (!error) {
          setIsInWishlist(true);
          toast({ description: "Added to wishlist!" });
        }
      }
    } catch (err) {
      toast({ variant: "destructive", description: "Could not update wishlist." });
    } finally {
      setIsWishlistLoading(false);
    }
  };

  // Self-healing: filter out URLs that have failed to load
  const activeImages = useMemo(() => {
    const valid = (product.imageUrls || []).filter((url) => !failedUrls.has(url));
    if (valid.length === 0) {
      return [`https://placehold.co/400x400?text=${encodeURIComponent(product.name)}`];
    }
    return valid;
  }, [product.imageUrls, failedUrls, product.name]);

  const safeIndex = currentIndex >= activeImages.length ? 0 : currentIndex;

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % activeImages.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + activeImages.length) % activeImages.length);
  };

  const handleImageError = (url: string) => {
    setFailedUrls(prev => {
        const next = new Set(prev);
        next.add(url);
        return next;
    });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, true, 1);
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      currencyDisplay: 'code',
    }).format(amount);
  };

  return (
    <div 
      className="group relative rounded-2xl border bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Image Section */}
      <div className="relative aspect-square overflow-hidden bg-muted/30">
        <Link href={`/products/${product.id}`} className="block h-full w-full">
          {activeImages.map((url, idx) => (
            <img
              key={`${url}-${idx}`}
              src={url}
              alt={`${product.name} - view ${idx + 1}`}
              className={cn(
                "absolute inset-0 object-cover w-full h-full transition-all duration-500 ease-in-out",
                idx === safeIndex ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
              )}
              onError={() => handleImageError(url)}
            />
          ))}
        </Link>

        {/* Wishlist Heart Icon - Supabase Linked */}
        <button 
          onClick={handleWishlistToggle}
          disabled={isWishlistLoading}
          className={cn(
            "absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all shadow-sm z-10",
            isInWishlist ? "bg-red-50 text-red-500" : "bg-white/80 text-muted-foreground hover:text-red-500"
          )}
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isWishlistLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className={cn("h-4 w-4", isInWishlist && "fill-current")} />}
        </button>

        {/* Hover Navigation Arrows */}
        {activeImages.length > 1 && (
          <div className={cn(
            "absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 transition-opacity duration-300",
            isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
          )}>
            <button 
              onClick={handlePrev}
              className="h-7 w-7 rounded-full bg-white/90 text-accent flex items-center justify-center shadow-md hover:bg-primary hover:text-white transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button 
              onClick={handleNext}
              className="h-7 w-7 rounded-full bg-white/90 text-accent flex items-center justify-center shadow-md hover:bg-primary hover:text-white transition-all"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Image Dots Indicator */}
        {activeImages.length > 1 && (
          <div className={cn(
            "absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 transition-opacity duration-300",
            isHovered ? "opacity-100" : "opacity-0"
          )}>
            {activeImages.map((_, idx) => (
              <div 
                key={idx}
                className={cn(
                  "h-1 rounded-full transition-all duration-300",
                  idx === safeIndex ? "bg-primary w-4" : "bg-black/20 w-1"
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-1">
        <div className="space-y-1 mb-2">
            <Link href={`/products/${product.id}`} className="block">
                <h3 className="font-bold text-accent text-sm md:text-base line-clamp-1 hover:text-primary transition-colors">
                    {product.name}
                </h3>
            </Link>
            <Link href={`/category/${encodeURIComponent(product.category.toLowerCase().replace(/\s+/g, '-'))}`} className="block">
                <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60 line-clamp-1 hover:underline">
                    {product.category}
                </p>
            </Link>
        </div>

        {/* Rating Row */}
        <div className="flex items-center gap-2 mb-3">
            <Rating rating={product.rating || 5} size={14} />
            <span className="text-[10px] text-muted-foreground">({product.reviews || 0})</span>
        </div>

        {/* Price Section */}
        <div className="mt-auto mb-4">
            <div className="flex items-baseline gap-2 flex-wrap">
                <p className="text-lg font-black text-foreground">
                    {formatPrice(product.price)}
                </p>
                {product.oldPrice && product.oldPrice > product.price && (
                    <p className="text-xs text-muted-foreground line-through decoration-muted-foreground/50">
                        {formatPrice(product.oldPrice)}
                    </p>
                )}
                {product.unit && product.unit !== 'item' && (
                    <span className="text-xs text-muted-foreground font-medium">/ {product.unit}</span>
                )}
            </div>
        </div>
        
        {/* Actions Section */}
        <div className="flex items-center gap-2">
            <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 rounded-xl text-xs font-bold border-muted-foreground/20 text-accent h-9" 
                asChild
            >
                <Link href={`/products/${product.id}`}>View More</Link>
            </Button>
            <Button 
                size="sm" 
                className="flex-1 rounded-xl text-xs font-bold bg-[#3b82f6] hover:bg-[#2563eb] h-9"
                onClick={handleAddToCart}
            >
                Add to Cart
            </Button>
        </div>
      </div>
    </div>
  );
}