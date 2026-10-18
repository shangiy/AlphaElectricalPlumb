'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabaseClient';

interface Product {
  id: string;
  name: string;
  price: number;
  image_path?: string | null;
  category?: string;
}

/**
 * Optimized Product Card: 
 * Implements "Self-Healing" image resolution by testing multiple storage path candidates.
 * This ensures visibility even after database path updates or folder migrations.
 */
export default function ProductCard({ product }: { product: Product }) {
  const [imgIndex, setImgIndex] = useState(0);

  // Parse image path: handle single strings or JSON arrays of multi-view images
  const rawPath = useMemo(() => {
    try {
      if (product.image_path) {
        if (product.image_path.trim().startsWith('[')) {
          const parsed = JSON.parse(product.image_path);
          return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : '';
        }
        return product.image_path;
      }
    } catch (e) {
      return product.image_path || '';
    }
    return '';
  }, [product.image_path]);

  // Clean redundant bucket prefixes from storage path
  const cleanPath = useMemo(() => {
    return rawPath
      .replace(/^(product-images\/)+/g, '')
      .replace(/^(Saved Pictures\/)+/g, '')
      .replace(/\\/g, '/')
      .replace(/^\/+/, '');
  }, [rawPath]);

  // Generate candidates: Try with and without the folder prefix to match Supabase storage structure
  const candidateUrls = useMemo(() => {
    if (!cleanPath) return ['/placeholder.jpg'];
    return [
      supabase.storage.from('product-images').getPublicUrl(`product-images/${cleanPath}`).data.publicUrl,
      supabase.storage.from('product-images').getPublicUrl(cleanPath).data.publicUrl,
    ];
  }, [cleanPath]);

  const handleImageError = () => {
    if (imgIndex < candidateUrls.length - 1) {
      setImgIndex(imgIndex + 1);
    } else {
      setImgIndex(-1); // Final fallback to placeholder
    }
  };

  const currentImageUrl = imgIndex === -1 
    ? `https://placehold.co/400x400?text=${encodeURIComponent(product.name)}`
    : candidateUrls[imgIndex];

  return (
    <div className="group relative rounded-2xl border bg-card overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-full">
      <Link href={`/products/${product.id}`} className="relative aspect-square overflow-hidden bg-muted block">
        <img
          src={currentImageUrl}
          alt={product.name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          onError={handleImageError}
        />
      </Link>
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <Link href={`/products/${product.id}`}>
            <h3 className="font-semibold text-foreground line-clamp-1 hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-lg font-bold text-primary mt-2">
            KES {product.price?.toLocaleString()}
          </p>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <Link href={`/products/${product.id}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
