import React from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  image_path?: string | null;
  href?: string;
}

export default function CategoryCard({ category }: { category: Category }) {
  // Map specific category display names to their exact storage filenames in the 'collections' folder
  const categoryImageMap: Record<string, string> = {
    'Roofing & Construction': 'Brick Red Tile Profile Versatile - Alloy-Zinc Color-Coated Roofing Sheets.webp',
    'Tanks': 'Tanks.webp',
    'Plumbing': 'Alpha plumbing pipe collection.webp',
    'Lighting & Electrical': 'Lighting & Electrical.webp',
    'Home & Decor': 'Home & Decor.webp',
  };

  // Fallback to category name if not explicitly mapped
  const fileName = categoryImageMap[category.name] || `${category.name.trim()}.webp`;
  const storagePath = `collections/${fileName}`;

  const imageUrl = supabase.storage
    .from('product-images')
    .getPublicUrl(storagePath).data.publicUrl;

  const targetHref = category.href || `/search?q=${encodeURIComponent(category.name)}`;

  return (
    <Link href={targetHref} className="block group">
      <div className="relative rounded-lg overflow-hidden shadow-sm aspect-[4/5] bg-muted">
        <img
          src={imageUrl}
          alt={category.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            // We use a console warning instead of error to avoid triggering the development overlay
            // and fallback to a clean placeholder
            console.warn("Failed to load category image:", category.name, "URL:", imageUrl);
            e.currentTarget.src = `https://placehold.co/400x600?text=${encodeURIComponent(category.name)}`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
          <div className="flex flex-col">
            <h3 className="text-white font-bold text-lg">{category.name}</h3>
            <span className="text-white/80 text-xs font-medium group-hover:text-white transition-colors">Explore Collection →</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
