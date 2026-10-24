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
 * Professional Category Card:
 * Re-designed to fetch images from Supabase Storage based on the database path.
 * Features aggressive "Asset Discovery" to find working links in storage buckets.
 */
const categoryImageMap: Record<string, string> = {
  'Tanks': 'Alpha tanks Collections.webp',
  'Plumbing': 'plumbing pipes and fittings collections.webp',
  'Electricals': 'Electric Socket Collection.webp',
  'Lighting': 'Contemporary Gold Spiral Chandelier.webp',
  'Home & Decor': 'Bird Art Lights fixture Collection.webp',
  'Roofing & Construction': 'Corrugated Roofing Sheet collection.webp',
};

export default function CategoryCard({ category }: { category: Category }) {
  const [imgIndex, setImgIndex] = useState(0);

  // Self-Healing Logic: Priority for database-provided image, then subfolder discovery
  const candidateUrls = useMemo(() => {
    const urls: string[] = [];
    
    // 1. Priority: Image URL/Path directly from the categories table
    if (category.image) {
        if (category.image.startsWith('http')) {
            urls.push(category.image);
        } else if (supabase) {
            const cleanPath = category.image.replace(/\\/g, '/').replace(/^\/+/, '');
            // Try different common paths for the database filename in storage
            urls.push(supabase.storage.from('product-images').getPublicUrl(cleanPath).data.publicUrl);
            urls.push(supabase.storage.from('product-images').getPublicUrl(`category/${cleanPath}`).data.publicUrl);
            urls.push(supabase.storage.from('product-images').getPublicUrl(`collections/${cleanPath}`).data.publicUrl);
            urls.push(supabase.storage.from('product-images').getPublicUrl(`product images/Collections/${cleanPath}`).data.publicUrl);
        }
    }

    if (!supabase) {
        urls.push('/placeholder.jpg');
        return urls;
    }

    // 2. Secondary: Fallback discovery logic based on category name mapping
    const filename = categoryImageMap[category.name.trim()] || `${category.name.trim()}.webp`;
    const cleanFilename = filename.replace(/\\/g, '/').replace(/^\/+/, '');
    
    const paths = [
      `category/${cleanFilename}`,
      `collections/${cleanFilename}`,
      `product-images/category/${cleanFilename}`,
      `product images/Collections/${cleanFilename}`,
      cleanFilename
    ];

    const mappedUrls = paths.map(path => 
      supabase.storage.from('product-images').getPublicUrl(path).data.publicUrl
    );

    // Filter unique and return valid candidates
    return Array.from(new Set([...urls, ...mappedUrls])).filter(url => url && !url.includes('undefined'));
  }, [category.name, category.image]);

  const handleImageError = () => {
    if (imgIndex < candidateUrls.length - 1) {
      setImgIndex(imgIndex + 1);
    } else {
      setImgIndex(-1); // Switch to placeholder if all candidates fail
    }
  };

  const currentImageUrl = imgIndex === -1 
    ? `https://placehold.co/400x500?text=${encodeURIComponent(category.name)}`
    : candidateUrls[imgIndex];

  return (
    <Link href={category.href || '#'} className="block group">
      <div className="relative rounded-2xl overflow-hidden shadow-sm bg-white border border-border transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div className="aspect-[4/5] overflow-hidden bg-muted/20 relative">
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
