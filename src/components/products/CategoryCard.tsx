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
 * Fidelity Mapping v5.0.0:
 * Updated keys to match new design nomenclature (Plumbing Fixtures, etc).
 */
const collectionFileNameMap: Record<string, string> = {
  'plumbing fixtures': 'Hand-wash Basin and Pedestal Sink Collection.webp',
  'lighting & bulbs': 'Bird Art Lights fixture Collection.webp',
  'electrical supplies': 'Electric Socket Collection.webp',
  'water tanks': 'Tanks variety collection.webp',
  'roofing & construction': 'Corrugated Roofing Sheet collection.webp',
  'sanitary ware': 'Hand-wash Basin and Pedestal Sink Collection.webp',
};

/**
 * Robust Path Resolver:
 * Normalizes 'collections/' prefix and encodes URLs.
 */
function getStoragePublicUrl(rawPath: string): string {
  if (!rawPath) return '';
  if (rawPath.startsWith('http://') || rawPath.startsWith('https://') || rawPath.startsWith('/')) {
    return rawPath;
  }
  if (!supabase) return '';

  let cleanPath = rawPath.replace(/\\/g, '/').replace(/^\/+/, '');
  
  // Normalize folder name to lowercase 'collections'
  if (cleanPath.toLowerCase().startsWith('collections/')) {
    cleanPath = 'collections/' + cleanPath.substring(12);
  }
  
  // Strip redundant bucket prefix if manually typed in CMS
  if (cleanPath.startsWith('product-images/')) {
    cleanPath = cleanPath.substring(15);
  }

  const encodedPath = cleanPath.split('/').map(segment => encodeURIComponent(segment)).join('/');
  const { data } = supabase.storage.from('product-images').getPublicUrl(encodedPath);
  return data?.publicUrl || '';
}

export default function CategoryCard({ category }: { category: Category }) {
  const [imgIndex, setImgIndex] = useState(0);

  const candidateUrls = useMemo(() => {
    const urls: string[] = [];
    const lowerName = category.name.toLowerCase().trim();

    // 1. Priority: Explicit image paths from CMS
    const rawVal = category.image || category.imageUrl || category.image_url || category.image_path || '';
    if (rawVal && rawVal.length > 2) {
      urls.push(getStoragePublicUrl(rawVal));
    }

    // 2. Keyword Mapping (Fidelity Engine)
    for (const [key, filename] of Object.entries(collectionFileNameMap)) {
      if (lowerName.includes(key) || key.includes(lowerName)) {
        urls.push(getStoragePublicUrl(`collections/${filename}`));
      }
    }

    // 3. System Placeholders (Supabase Hosted)
    if (lowerName.includes('tank')) urls.push(placeholderData.cat_tanks.url);
    if (lowerName.includes('plumb')) urls.push(placeholderData.cat_plumbing.url);
    if (lowerName.includes('light') || lowerName.includes('bulb')) urls.push(placeholderData.cat_lighting.url);
    if (lowerName.includes('electr')) urls.push(placeholderData.cat_lighting.url);
    if (lowerName.includes('roof')) urls.push(placeholderData.cat_roofing.url);

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
      <div className="relative rounded-2xl overflow-hidden shadow-sm bg-white border border-border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-[340px]">
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
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
