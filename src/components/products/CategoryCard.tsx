'use client';

import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';
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
 * High-Resolution Collection Mapping for v4.3.0:
 * Prioritizes curated collection assets from the Supabase Storage bucket.
 * Synchronized with user-defined filenames and common keywords.
 */
const collectionFileNameMap: Record<string, string> = {
  'toilets & sinks': 'Hand-wash Basin and Pedestal Sink Collection.webp',
  'toilets': 'Hand-wash Basin and Pedestal Sink Collection.webp',
  'sink': 'Hand-wash Basin and Pedestal Sink Collection.webp',
  'water tank': 'Tanks variety collection.webp',
  'tank': 'Durable TopTank Vertical Water Tank collection.webp',
  'electric': 'Electric Socket Collection.webp',
  'electrical': 'Electric Socket Collection.webp',
  'chandelier': 'Alpha chanderlier collection.webp',
  'construction': 'granite and quartz slabs collection.webp',
  'fencing': 'granite and quartz slabs collection.webp',
  'plumbing': 'Alpha plumbing pipe collection.webp',
  'lighting': 'rustic woven rope pendant lights collection.webp',
  'decor': 'Bird Art Lights fixture Collection.webp',
  'mabati': 'Corrugated Roofing Sheet collection.webp',
  'solar': 'Solar items collection.webp',
};

/**
 * Robust Path Resolver:
 * Strips redundant bucket names and common folder prefixes.
 * URL-encodes path segments to fix 400 errors for files with spaces.
 */
function getStoragePublicUrl(rawPath: string): string {
  if (!rawPath) return '';
  // Support local public assets (e.g. /images/...) or full external URLs
  if (rawPath.startsWith('http://') || rawPath.startsWith('https://') || rawPath.startsWith('/')) {
    return rawPath;
  }
  if (!supabase) return '';

  let cleanPath = rawPath.replace(/\\/g, '/').replace(/^\/+/, '');
  
  // Remove redundant bucket prefix used in some CMS inputs
  if (cleanPath.startsWith('product-images/')) {
    cleanPath = cleanPath.substring('product-images/'.length);
  }
  
  // Remove redundant folder prefix used in migration
  if (cleanPath.startsWith('product images/')) {
    cleanPath = cleanPath.substring('product images/'.length);
  }

  const encodedPath = cleanPath.split('/').map(segment => encodeURIComponent(segment)).join('/');

  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(encodedPath);

  return data?.publicUrl || '';
}

export default function CategoryCard({ category }: { category: Category }) {
  const [imgIndex, setImgIndex] = useState(0);

  const candidateUrls = useMemo(() => {
    const urls: string[] = [];
    const lowerName = category.name.toLowerCase().trim();

    // 1. Explicit image fields from CMS or Table (Highest Priority)
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

    // 2. Keyword match in collectionFileNameMap (Discovery Engine)
    for (const [key, filename] of Object.entries(collectionFileNameMap)) {
      if (lowerName.includes(key)) {
        // Try multiple folder patterns for high-fidelity discovery
        urls.push(getStoragePublicUrl(`Collections/${filename}`));
        urls.push(getStoragePublicUrl(`collections/${filename}`));
        urls.push(getStoragePublicUrl(filename));
      }
    }

    // 3. Fallback placeholder data (Supabase Hosted)
    if (lowerName.includes('tank')) urls.push(placeholderData.cat_tanks.url);
    if (lowerName.includes('plumb')) urls.push(placeholderData.cat_plumbing.url);
    if (lowerName.includes('light') || lowerName.includes('chandelier') || lowerName.includes('electr')) {
        urls.push(placeholderData.cat_lighting.url);
    }
    if (lowerName.includes('decor')) urls.push(placeholderData.cat_decor.url);
    if (lowerName.includes('roof') || lowerName.includes('mabati')) urls.push(placeholderData.cat_roofing.url);

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
          <Image
            src={currentImageUrl}
            alt={category.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            onError={handleImageError}
            sizes="(max-width: 768px) 100vw, 33vw"
            loading="lazy"
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
