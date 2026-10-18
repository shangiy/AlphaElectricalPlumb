'use client';

import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  image_path?: string | null;
  href: string;
}

/**
 * Maps frontend category display names to specific filenames in the Supabase 'collections' folder.
 * If a category isn't in this map, it defaults to '[Category Name].webp'.
 */
const categoryImageMap: Record<string, string> = {
  'Roofing & Construction': 'Brick Red Tile Profile Versatile - Alloy-Zinc Color-Coated Roofing Sheets.webp',
  'Tanks': 'Tanks.webp',
  'Plumbing': 'Plumbing.webp',
  'Lighting & Electrical': 'Lighting & Electrical.webp',
  'Home & Decor': 'Home & Decor.webp',
};

export default function CategoryCard({ category }: { category: Category }) {
  // Construct the storage path using the mapping or the category name
  const fileName = categoryImageMap[category.name.trim()] || `${category.name.trim()}.webp`;
  const storagePath = `collections/${fileName}`;

  const imageUrl = supabase.storage
    .from('product-images')
    .getPublicUrl(storagePath).data.publicUrl;

  console.log("Category:", category.name, "Generated URL:", imageUrl);

  return (
    <Link href={category.href} className="block group">
      <div className="relative rounded-[2rem] overflow-hidden shadow-md aspect-[4/5] bg-muted border border-white/20 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <img
          src={imageUrl}
          alt={category.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            console.error("Failed to load image for:", category.name, "URL:", imageUrl);
            (e.target as HTMLImageElement).src = 'https://placehold.co/400x500?text=' + encodeURIComponent(category.name);
          }}
        />
        {/* Gradient overlay for text readability */}
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
