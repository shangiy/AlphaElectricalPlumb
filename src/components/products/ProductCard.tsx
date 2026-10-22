'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Heart, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Product } from '@/lib/types';
import { Rating } from '@/components/ui/rating';
import { useCart } from '@/context/CartProvider';

/**
 * Premium Interactive Product Card:
 * Re-designed to match the user-provided reference.
 * Features: Dual buttons, hover carousel, wishlist heart, and dynamic pricing.
 */
export default function ProductCard({ product }: { product: Product }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [failedUrls, setFailedUrls] = useState<Set<string>>(new Set());
  const { addToCart } = useCart();

  useEffect(() => {
    setCurrentIndex(0);
    setFailedUrls(new Set());
  }, [product.id, product.imageUrls]);

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

        {/* Wishlist Heart Icon */}
        <button 
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm text-muted-foreground hover:text-red-500 transition-colors shadow-sm z-10"
          aria-label="Add to wishlist"
        >
          <Heart className="h-4 w-4" />
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
                <p className="text-xs text-muted-foreground line-clamp-1 hover:underline">
                    {product.description || product.category}
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
                    KES {product.price?.toLocaleString()}
                </p>
                {product.oldPrice && product.oldPrice > product.price && (
                    <p className="text-xs text-muted-foreground line-through decoration-muted-foreground/50">
                        KES {product.oldPrice.toLocaleString()}
                    </p>
                )}
                {product.unit && product.unit !== 'item' && (
                    <span className="text-xs text-muted-foreground">/ {product.unit}</span>
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
