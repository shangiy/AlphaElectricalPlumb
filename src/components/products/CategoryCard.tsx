'use client';

import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { useState, useMemo } from 'react';

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

  // Self-Healing Logic: Generate multiple candidate URLs to find the correct path in Supabase
  const candidateUrls = useMemo(() => {
    if (!supabase) return ['/placeholder.jpg'];

    const filename = categoryImageMap[category.name.trim()] || `${category.name.trim()}.webp`;
    const cleanFilename = filename.replace(/\\/g, '/').replace(/^\/+/, '');
    
    // Candidates cover different possible storage structures (Root vs Nested folders)
    const paths = [
      `collections/${cleanFilename}`,
      `product-images/collections/${cleanFilename}`,
      `product-images/product-images/collections/${cleanFilename}`,
      cleanFilename
    ];

    return paths.map(path => 
      supabase.storage.from('product-images').getPublicUrl(path).data.publicUrl
    );
  }, [category.name]);

  const handleImageError = () => {
    // If Candidate 1 fails, try Candidate 2, and so on.
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
      <div className="relative rounded-[2rem] overflow-hidden shadow-md aspect-[4/5] bg-muted border border-white/25 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <img
          src={currentImageUrl}
          alt={category.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
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
