'use client';

import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { useState } from 'react';

interface Category {
  id: string;
  name: string;
  image_path?: string | null;
  href: string;
}

const categoryImageMap: Record<string, string> = {
  'Roofing & Construction': 'Corrugated Roofing Sheet collection.webp',
  'Tanks': 'Alpha tanks Collections.webp',
  'Plumbing': 'plumbing pipes and fittings collections.webp',
  'Electricals and Cables': 'Electric Socket Collection.webp',
  'Home & Decor': 'Bird Art Lights fixture Collection.webp',
  'Toilets & Sinks': 'Hand-wash Basin and  Pedestal Sink Collection.webp',
  'Solar category': 'Solar items collection.webp',
};

export default function CategoryCard({ category }: { category: Category }) {
  const [imgIndex, setImgIndex] = useState(0);

  // 1. Determine the target filename
  const filename = categoryImageMap[category.name.trim()] || `${category.name.trim()}.webp`;
  
  // 2. Build candidates to handle varying folder structures (Self-Healing)
  const candidates = [
    `collections/${filename}`,
    filename,
    `product-images/collections/${filename}`
  ];

  const getUrl = (path: string) => {
    return supabase.storage.from('product-images').getPublicUrl(path).data.publicUrl;
  };

  const handleImageError = () => {
    if (imgIndex < candidates.length - 1) {
      setImgIndex(prev => prev + 1);
    } else {
      setImgIndex(-1); // Final fallback
    }
  };

  const currentUrl = imgIndex === -1 
    ? `https://placehold.co/400x500?text=${encodeURIComponent(category.name)}`
    : getUrl(candidates[imgIndex]);

  return (
    <Link href={category.href || '#'} className="block group">
      <div className="relative rounded-[2rem] overflow-hidden shadow-md aspect-[4/5] bg-muted border border-white/25 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <img
          src={currentUrl}
          alt={category.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
          <h3 className="text-white font-bold text-xl font-headline leading-tight">{category.name}</h3>
          <p className="text-white/70 text-sm mt-1 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            Explore Collection →
          </p>
        </div>
      </div>
    </Link>
  );
}
