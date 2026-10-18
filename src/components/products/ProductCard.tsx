'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabaseClient';

interface Product {
  id: string;
  name: string;
  price: number;
  image_path?: string | null;
  category?: string;
}

/**
 * Premium Interactive Product Card:
 * Features a modern hover-triggered carousel and real-time self-healing image resolver.
 */
export default function ProductCard({ product }: { product: Product }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [failedIndices, setFailedIndices] = useState<Set<number>>(new Set());

  useEffect(() => {
    setCurrentIndex(0);
    setFailedIndices(new Set());
  }, [product.id]);

  // Robust Path Cleaning & Parsing for Multi-View Support
  const activeImages = useMemo(() => {
    let rawPaths: string[] = [];
    try {
      if (product.image_path) {
        const trimmed = product.image_path.trim();
        // Handle JSON strings (e.g. multi-image arrays from database)
        if (trimmed.startsWith('[')) {
          rawPaths = JSON.parse(trimmed.replace(/[\r\n]/g, ''));
        } else {
          rawPaths = [trimmed];
        }
      }
    } catch (e) {
      rawPaths = [product.image_path || ''];
    }

    const candidates: string[] = [];
    rawPaths.forEach(path => {
      if (!path) return;
      
      // Strip redundant bucket prefixes or local prefixes to get the pure filename/path
      const clean = path
        .replace(/^(product-images\/)+/i, '')
        .replace(/^(Saved Pictures\/)+/i, '')
        .replace(/\\/g, '/')
        .replace(/^\/+/, '');
      
      // Candidate 1: Direct public URL from Supabase storage
      if (supabase) {
        candidates.push(supabase.storage.from('product-images').getPublicUrl(clean).data.publicUrl);
      }
    });

    // Filtering out indices that have previously failed to load
    const valid = candidates.filter((_, i) => !failedIndices.has(i));
    
    if (valid.length === 0) {
      return [`https://placehold.co/400x400?text=${encodeURIComponent(product.name)}`];
    }
    return valid.slice(0, 10); // Performance cap
  }, [product.image_path, failedIndices, product.name]);

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

  const handleImageError = (index: number) => {
    setFailedIndices(prev => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  };

  return (
    <div 
      className="group relative rounded-2xl border bg-card overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Link href={`/products/${product.id}`} className="block h-full w-full">
          {activeImages.map((url, idx) => (
            <img
              key={`${url}-${idx}`}
              src={url}
              alt={`${product.name} - view ${idx + 1}`}
              className={cn(
                "absolute inset-0 object-cover w-full h-full transition-all duration-700 ease-in-out",
                idx === safeIndex ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
              )}
              onError={() => handleImageError(idx)}
            />
          ))}
        </Link>

        {/* Seattle Side Slide-Buttons */}
        {activeImages.length > 1 && (
          <div className={cn(
            "absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-3 transition-opacity duration-300",
            isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
          )}>
            <button 
              onClick={handlePrev}
              className="h-8 w-8 rounded-full bg-black/30 hover:bg-primary backdrop-blur-md text-white flex items-center justify-center transition-all hover:scale-110 active:scale-90"
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button 
              onClick={handleNext}
              className="h-8 w-8 rounded-full bg-black/30 hover:bg-primary backdrop-blur-md text-white flex items-center justify-center transition-all hover:scale-110 active:scale-90"
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Modern Dash Indicators */}
        {activeImages.length > 1 && (
          <div className={cn(
            "absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 px-2 py-1 rounded-full bg-black/20 backdrop-blur-sm transition-opacity duration-300",
            isHovered ? "opacity-100" : "opacity-0"
          )}>
            {activeImages.map((_, idx) => (
              <div 
                key={idx}
                className={cn(
                  "h-1 rounded-full transition-all duration-300",
                  idx === safeIndex ? "bg-white w-4" : "bg-white/40 w-1"
                )}
              />
            ))}
          </div>
        )}
      </div>

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
                Verified
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
