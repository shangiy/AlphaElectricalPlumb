'use client';

import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  image_path?: string | null;
  href: string;
}

const categoryImageMap: Record<string, string> = {
  'Roofing & Construction': 'Brick Red Tile Profile Versatile - Alloy-Zinc Color-Coated Roofing Sheets.webp',
  'Tanks': 'Alpha tanks Collections.webp',
  'Plumbing': 'Alpha plumbing pipe collection.webp',
  'Lighting & Electrical': 'Electric Socket Collection.webp',
  'Home & Decor': 'Alpha chandelier collection.webp',
};

export default function CategoryCard({ category }: { category: Category }) {
  // 1. Determine the intended path in the collections folder
  const mappedFileName = categoryImageMap[category.name.trim()] || `${category.name.trim()}.webp`;
  const storagePath = `collections/${mappedFileName}`;

  // 2. Generate the public URL from Supabase
  const imageUrl = supabase.storage
    .from('product-images')
    .getPublicUrl(storagePath).data.publicUrl;

  return (
    <Link href={category.href || `/search?q=${encodeURIComponent(category.name)}`} className="block group">
      <div className="relative rounded-[2rem] overflow-hidden shadow-md aspect-[4/5] bg-muted border border-white/25 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <img
          src={imageUrl}
          alt={category.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            // Graceful fallback without noisy console error that triggers Next.js overlay
            const target = e.target as HTMLImageElement;
            target.src = `https://placehold.co/400x500?text=${encodeURIComponent(category.name)}`;
          }}
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
