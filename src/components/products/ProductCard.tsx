'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrls: string[];
  category?: string;
}

/**
 * Premium Interactive Product Card:
 * Features a modern hover-triggered carousel with smooth fade transitions.
 * Users can interact with side navigation buttons to preview multiple views.
 */
export default function ProductCard({ product }: { product: Product }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Clean candidate images, filtering duplicates or known invalid URLs
  const images = useMemo(() => {
    if (!product.imageUrls || product.imageUrls.length === 0) {
      return [`https://placehold.co/400x400?text=${encodeURIComponent(product.name)}`];
    }
    // Limit unique candidates to prevent excessive scrolling in grid
    return Array.from(new Set(product.imageUrls)).slice(0, 10);
  }, [product.imageUrls, product.name]);

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div 
      className="group relative rounded-2xl border bg-card overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentIndex(0); // Reset to primary image for catalog consistency
      }}
    >
      {/* Interactive Image Gallery Area */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Link href={`/products/${product.id}`} className="block h-full w-full">
          {images.map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt={`${product.name} - view ${idx + 1}`}
              className={cn(
                "absolute inset-0 object-cover w-full h-full transition-all duration-700 ease-in-out",
                idx === currentIndex ? "opacity-100 scale-100 translate-x-0" : "opacity-0 scale-105 pointer-events-none"
              )}
              onError={(e) => {
                // If a specific candidate fails, hide it to prevent broken UI
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ))}
        </Link>

        {/* Side Slide Buttons - Glass Design */}
        {images.length > 1 && (
          <div className={cn(
            "absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-3 transition-opacity duration-300",
            isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
          )}>
            <button 
              onClick={handlePrev}
              className="h-8 w-8 rounded-full bg-black/20 hover:bg-primary backdrop-blur-md text-white flex items-center justify-center transition-all hover:scale-110 active:scale-90"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button 
              onClick={handleNext}
              className="h-8 w-8 rounded-full bg-black/20 hover:bg-primary backdrop-blur-md text-white flex items-center justify-center transition-all hover:scale-110 active:scale-90"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Floating Indicator Dots */}
        {images.length > 1 && (
          <div className={cn(
            "absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 px-2 py-1 rounded-full bg-black/20 backdrop-blur-sm transition-opacity duration-300",
            isHovered ? "opacity-100" : "opacity-0"
          )}>
            {images.map((_, idx) => (
              <div 
                key={idx}
                className={cn(
                  "h-1 rounded-full transition-all duration-300",
                  idx === currentIndex ? "bg-white w-4" : "bg-white/40 w-1"
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <Link href={`/products/${product.id}`}>
            <h3 className="font-bold text-accent line-clamp-2 hover:text-primary transition-colors min-h-[2.5rem]">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-end justify-between mt-3">
             <p className="text-xl font-black text-primary">
                KES {product.price?.toLocaleString()}
             </p>
             <span className="text-[9px] uppercase tracking-widest font-black text-muted-foreground bg-muted px-2 py-0.5 rounded">
                Verified Item
             </span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-dashed">
          <Button variant="outline" size="sm" className="w-full rounded-xl font-bold border-primary/20 text-accent hover:bg-primary hover:text-white" asChild>
            <Link href={`/products/${product.id}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}