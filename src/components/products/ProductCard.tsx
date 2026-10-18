'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MessageCircle, ShoppingCart } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface Product {
  id: string;
  name: string;
  price: number;
  image_path?: string | null;
  category_id?: string;
  description?: string; // Optional field from existing logic
  category?: string;    // Optional field from existing logic
}

export default function ProductCard({ product }: { product: Product }) {
  // Parse image path: handle single strings or JSON arrays of multi-view images
  let imagePath = '';
  try {
    if (product.image_path) {
      if (product.image_path.trim().startsWith('[')) {
        const parsed = JSON.parse(product.image_path);
        imagePath = Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : '';
      } else {
        imagePath = product.image_path;
      }
    }
  } catch (e) {
    imagePath = product.image_path || '';
  }

  // Clean redundant bucket prefixes from storage path
  const cleanPath = imagePath
    .replace(/^(product-images\/)+/g, '')
    .replace(/^(Saved Pictures\/)+/g, '')
    .replace(/^\/+/, '');

  const initialUrl = cleanPath
    ? supabase.storage.from('product-images').getPublicUrl(cleanPath).data.publicUrl
    : 'https://placehold.co/400x400?text=' + encodeURIComponent(product.name);

  const [imgSrc, setImgSrc] = useState(initialUrl);

  return (
    <div className="group relative rounded-2xl border bg-card overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-full">
      <Link href={`/products/${product.id}`} className="relative aspect-square overflow-hidden bg-muted block">
        <img
          src={imgSrc}
          alt={product.name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          onError={() => {
            setImgSrc('https://placehold.co/400x400?text=' + encodeURIComponent(product.name));
          }}
        />
      </Link>
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <div className="mb-1">
             <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">{product.category || 'Product'}</span>
          </div>
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
