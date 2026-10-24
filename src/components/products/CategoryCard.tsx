'use client';

import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useState, useMemo } from 'react';

interface Category {
  id: string;
  name: string;
  image?: string | null;
  href: string;
}

/**
 * Professional Category Card v3.5:
 * Features an aggressive "Asset Discovery" engine to find working links in storage buckets.
 */
const categoryImageMap: Record<string, string> = {
  'Tanks': 'Alpha tanks Collections.webp',
  'Plumbing': 'plumbing pipes and fittings collections.webp',
  'Electricals': 'Electric Socket Collection.webp',
  'Lighting': 'Contemporary Gold Spiral Chandelier.webp',
  'Home & Decor': 'Bird Art Lights fixture Collection.webp',
  'Roofing': 'Corrugated Roofing Sheet collection.webp',
  'Roofing & Construction': 'Corrugated Roofing Sheet collection.webp',
};

export default function CategoryCard({ category }: { category: Category }) {
  const [imgIndex, setImgIndex] = useState(0);

  // Self-Healing Discovery Logic: Priority for DB image, then folder guessing
  const candidateUrls = useMemo(() => {
    const urls: string[] = [];
    
    // 1. Priority: Database Provided Value
    if (category.image && category.image.length > 2) {
        if (category.image.startsWith('http')) {
            urls.push(category.image);
        } else if (supabase) {
            const cleanPath = category.image.replace(/\\/g, '/').replace(/^\/+/, '');
            urls.push(supabase.storage.from('product-images').getPublicUrl(cleanPath).data.publicUrl);
            urls.push(supabase.storage.from('product-images').getPublicUrl(`category/${cleanPath}`).data.publicUrl);
            urls.push(supabase.storage.from('product-images').getPublicUrl(`product images/Collections/${cleanPath}`).data.publicUrl);
        }
    }

    if (!supabase) {
        urls.push('/placeholder.jpg');
        return urls;
    }

    // 2. Secondary: Name-based mapping for static fallbacks
    const filename = categoryImageMap[category.name.trim()] || `${category.name.trim()}.webp`;
    const cleanFilename = filename.replace(/\\/g, '/').replace(/^\/+/, '');
    
    const paths = [
      `category/${cleanFilename}`,
      `Collections/${cleanFilename}`,
      `product images/Collections/${cleanFilename}`,
      cleanFilename
    ];

    const mappedUrls = paths.map(path => 
      supabase.storage.from('product-images').getPublicUrl(path).data.publicUrl
    );

    return Array.from(new Set([...urls, ...mappedUrls])).filter(url => url && !url.includes('undefined'));
  }, [category.name, category.image]);

  const handleImageError = () => {
    if (imgIndex < candidateUrls.length - 1) {
      setImgIndex(imgIndex + 1);
    } else {
      setImgIndex(-1); // Final fallback to placeholder
    }
  };

  const currentImageUrl = imgIndex === -1 
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
            {/* Elegant Gradient Overlay */}
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
