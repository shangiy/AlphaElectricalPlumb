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
 * Updated Storage Bucket File Mapping for v2.4.6:
 * Maps category keywords to specific high-resolution curated assets in `product-images/collections/`.
 */
const collectionFileNameMap: Record<string, string> = {
  toilets: 'collections/Hand-wash Basin and Pedestal Sink Collection.webp',
  sinks: 'collections/Hand-wash Basin and Pedestal Sink Collection.webp',
  tanks: 'collections/Durable TopTank Vertical Water Tank collection.webp',
  electrical: 'collections/Electric Socket Collection.webp',
  electric: 'collections/Electric Socket Collection.webp',
  chandelier: 'collections/Alpha chanderlier collection.webp',
  construction: 'collections/granite and quartz slabs collection.webp',
  fencing: 'collections/granite and quartz slabs collection.webp',
  plumbing: 'collections/Alpha plumbing pipe collection.webp',
  lighting: 'collections/Alpha chanderlier collection.webp',
  decor: 'collections/Bird Art Lights fixture Collection.webp',
  roofing: 'collections/Corrugated Roofing Sheet collection.webp',
  mabati: 'collections/Corrugated Roofing Sheet collection.webp',
  solar: 'collections/Solar items collection.webp',
  shower: 'collections/shower utility collection.webp',
};

/**
 * Helper to construct clean Supabase Storage URLs from the 'product-images' bucket
 */
function getStoragePublicUrl(rawPath: string): string {
  if (!rawPath) return '';
  if (rawPath.startsWith('http://') || rawPath.startsWith('https://')) {
    return rawPath;
  }
  if (!supabase) return '';

  // Clean path: remove leading slashes and any leading 'product-images/' prefix
  let cleanPath = rawPath.replace(/\\/g, '/').replace(/^\/+/, '');
  if (cleanPath.startsWith('product-images/')) {
    cleanPath = cleanPath.substring('product-images/'.length);
  }

  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(cleanPath);

  return data?.publicUrl || '';
}

export default function CategoryCard({ category }: { category: Category }) {
  const [imgIndex, setImgIndex] = useState(0);

  const candidateUrls = useMemo(() => {
    const urls: string[] = [];

    // 1. Check explicit raw image fields passed in the category object
    const rawVal =
      category.image ||
      category.imageUrl ||
      category.image_url ||
      category.image_path ||
      '';

    if (rawVal && rawVal.length > 2) {
      const url = getStoragePublicUrl(rawVal);
      if (url) urls.push(url);
    }

    // 2. Try exact collection path resolution based on category name (Highest Priority for design alignment)
    const lowerName = category.name.toLowerCase().trim();
    for (const [key, path] of Object.entries(collectionFileNameMap)) {
      if (lowerName.includes(key)) {
        const mappedUrl = getStoragePublicUrl(path);
        if (mappedUrl) urls.push(mappedUrl);
      }
    }

    // 3. Static JSON fallbacks for resilience
    if (lowerName.includes('tank')) urls.push(placeholderData.cat_tanks.url);
    if (lowerName.includes('plumb')) urls.push(placeholderData.cat_plumbing.url);
    if (lowerName.includes('light') || lowerName.includes('chandelier')) urls.push(placeholderData.cat_lighting.url);
    if (lowerName.includes('decor')) urls.push(placeholderData.cat_decor.url);
    if (lowerName.includes('roof') || lowerName.includes('mabati')) urls.push(placeholderData.cat_roofing.url);

    // Filter out duplicates and invalid strings
    return Array.from(new Set(urls)).filter(url => url && !url.includes('undefined'));
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
      ? `https://placehold.co/400x500?text=${encodeURIComponent(category.name)}`
      : candidateUrls[imgIndex];

  return (
    <Link href={category.href || '#'} className="block group">
      <div className="relative rounded-2xl overflow-hidden shadow-sm bg-white border border-border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-[400px]">
        <div className="absolute inset-0 bg-muted/20">
          <img
            src={currentImageUrl}
            alt={category.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80" />
        </div>
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <h3 className="text-white font-bold text-lg md:text-xl font-headline leading-tight group-hover:text-primary transition-colors drop-shadow-md">
            {category.name}
          </h3>
          <p className="text-white/90 text-[10px] font-black uppercase tracking-widest mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            EXPLORE COLLECTION <span className="text-lg">→</span>
          </p>
        </div>
      </div>
    </Link>
  );
}
