
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
 * Re-designed to be navigate-able and visually consistent with the new product cards.
 * Now prioritized database images from the 'categories' table.
 */
const categoryImageMap: Record<string, string> = {
  'Roofing & Construction': 'Corrugated Roofing Sheet collection.webp',
  'Tanks': 'Alpha tanks Collections.webp',
  'Plumbing': 'plumbing pipes and fittings collections.webp',
  'Electricals and Cables': 'Electric Socket Collection.webp',
  'Electricals': 'Electric Socket Collection.webp',
  'Home & Decor': 'Bird Art Lights fixture Collection.webp',
  'Toilets & Sinks': 'Hand-wash Basin and  Pedestal Sink Collection.webp',
  'Solar category': 'Solar items collection.webp',
};

export default function CategoryCard({ category }: { category: Category }) {
  const [imgIndex, setImgIndex] = useState(0);

  // Self-Healing Logic: Priority for database-provided image, then subfolders
  const candidateUrls = useMemo(() => {
    const urls: string[] = [];
    
    // 1. Priority: Image URL directly from database
    if (category.image) {
        if (category.image.startsWith('http')) {
            urls.push(category.image);
        } else if (supabase) {
            // Assume it's a storage path
            const cleanPath = category.image.replace(/\\/g, '/').replace(/^\/+/, '');
            urls.push(supabase.storage.from('product-images').getPublicUrl(cleanPath).data.publicUrl);
        }
    }

    if (!supabase) {
        urls.push('/placeholder.jpg');
        return urls;
    }

    // 2. Secondary: Fallback mapping logic
    const filename = categoryImageMap[category.name.trim()] || `${category.name.trim()}.webp`;
    const cleanFilename = filename.replace(/\\/g, '/').replace(/^\/+/, '');
    
    const paths = [
      `category/${cleanFilename}`,
      `collections/${cleanFilename}`,
      `product-images/category/${cleanFilename}`,
      `product-images/${cleanFilename}`,
      cleanFilename
    ];

    const mappedUrls = paths.map(path => 
      supabase.storage.from('product-images').getPublicUrl(path).data.publicUrl
    );

    return Array.from(new Set([...urls, ...mappedUrls]));
  }, [category.name, category.image]);

  const handleImageError = () => {
    if (imgIndex < candidateUrls.length - 1) {
      setImgIndex(imgIndex + 1);
    } else {
      setImgIndex(-1);
    }
  };

  const currentImageUrl = imgIndex === -1 
    ? `https://placehold.co/400x500?text=${encodeURIComponent(category.name)}`
    : candidateUrls[imgIndex];

  return (
    <Link href={category.href || '#'} className="block group">
      <div className="relative rounded-2xl overflow-hidden shadow-sm bg-white border border-border transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div className="aspect-[4/5] overflow-hidden bg-muted/20">
            <img
              src={currentImageUrl}
              alt={category.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={handleImageError}
            />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent flex flex-col justify-end p-6">
          <h3 className="text-white font-bold text-lg md:text-xl font-headline leading-tight group-hover:text-primary transition-colors">
            {category.name}
          </h3>
          <p className="text-white/70 text-xs font-bold mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            EXPLORE COLLECTION <span className="text-lg">→</span>
          </p>
        </div>
      </div>
    </Link>
  );
}
