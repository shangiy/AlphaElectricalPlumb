'use client';

import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import placeholderData from '@/app/lib/placeholder-images.json';

interface Category {
  id: string;
  name: string;
  image?: string | null;
  imageUrl?: string | null;
  image_url?: string | null;
  image_path?: string | null;
  href: string;
}

/**
 * Precise mapping from category names/slugs to exact files inside `collections/` folder in Supabase storage
 */
const collectionFileMap: Record<string, string> = {
  tanks: 'collections/Alpha tanks Collections.webp',
  tank: 'collections/Alpha tanks Collections.webp',
  plumbing: 'collections/Alpha plumbing pipe collection.webp',
  pipe: 'collections/Alpha plumbing pipe collection.webp',
  lighting: 'collections/rustic woven rope pendant lights collection.webp',
  light: 'collections/rustic woven rope pendant lights collection.webp',
  decor: 'collections/Bird Art Lights fixture Collection.webp',
  roofing: 'collections/Corrugated Roofing Sheet collection.webp',
  mabati: 'collections/Corrugated Roofing Sheet collection.webp',
  toilet: 'collections/Alpha toilet collection.webp',
  waterpump: 'collections/waterpump collection.webp',
  pump: 'collections/waterpump collection.webp',
};

export default function CategoryCard({ category }: { category: Category }) {
  const [imgIndex, setImgIndex] = useState(0);

  const candidateUrls = useMemo(() => {
    const urls: string[] = [];

    if (!supabase) return [placeholderData.cat_tanks.url];

    // Helper to get public URL for a path in 'product-images'
    const getUrl = (path: string) => {
      if (!path) return '';
      if (path.startsWith('http://') || path.startsWith('https://')) return path;
      let clean = path.replace(/\\/g, '/').replace(/^\/+/, '');
      if (clean.startsWith('product-images/')) {
        clean = clean.substring('product-images/'.length);
      }
      return supabase.storage.from('product-images').getPublicUrl(clean).data.publicUrl;
    };

    // 1. Check explicit image paths/URLs passed from DB
    const rawVal = category.image || category.imageUrl || category.image_url || category.image_path || '';
    if (rawVal) {
      const resolved = getUrl(rawVal);
      if (resolved) urls.push(resolved);
    }

    // 2. Map category name/slug to exact file in collections/
    const lowerName = (category.name || '').toLowerCase().trim();
    const lowerHref = (category.href || '').toLowerCase().trim();

    for (const [key, filename] of Object.entries(collectionFileMap)) {
      if (lowerName.includes(key) || lowerHref.includes(key)) {
        const resolved = getUrl(filename);
        if (resolved) urls.push(resolved);
      }
    }

    // 3. Fallbacks from JSON placeholders
    if (lowerName.includes('tank')) urls.push(placeholderData.cat_tanks.url);
    if (lowerName.includes('plumb')) urls.push(placeholderData.cat_plumbing.url);
    if (lowerName.includes('light')) urls.push(placeholderData.cat_lighting.url);
    if (lowerName.includes('decor')) urls.push(placeholderData.cat_decor.url);
    if (lowerName.includes('roof') || lowerName.includes('mabati')) urls.push(placeholderData.cat_roofing.url);

    return Array.from(new Set(urls)).filter(Boolean);
  }, [category]);

  const handleImageError = () => {
    if (imgIndex < candidateUrls.length - 1) {
      setImgIndex(imgIndex + 1);
    } else {
      setImgIndex(-1);
    }
  };

  const currentImageUrl =
    imgIndex === -1 || candidateUrls.length === 0
      ? `https://placehold.co/400x500?text=${encodeURIComponent(category.name || 'Category')}`
      : candidateUrls[imgIndex];

  return (
    <Link href={category.href || '#'} className="block group">
      <div className="relative rounded-2xl overflow-hidden shadow-sm bg-white border border-border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-[400px]">
        <div className="absolute inset-0 bg-muted/20">
          <img
            src={currentImageUrl}
            alt={category.name || 'Category'}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80" />
        </div>
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <h3 className="text-white font-bold text-lg md:text-xl font-headline leading-tight group-hover:text-primary transition-colors drop-shadow-md">
            {category.name || 'Category'}
          </h3>
          <p className="text-white/90 text-[10px] font-black uppercase tracking-widest mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            EXPLORE COLLECTION <span className="text-lg">→</span>
          </p>
        </div>
      </div>
    </Link>
  );
}