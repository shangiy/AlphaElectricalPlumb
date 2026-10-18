'use client';

import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  href: string;
  image_path?: string | null;
}

export default function CategoryCard({ category }: { category: Category }) {
  // Use database image_path if available, otherwise fallback to matching the category name in collections
  // Based on your link, images are in 'product-images/collections'
  const rawPath = category.image_path || `product-images/collections/${category.name.trim()}.webp`;
  
  // Clean path to remove any leading bucket or folder duplications as per your requirement
  const cleanPath = rawPath
    .replace(/^product-images\//, '')
    .replace(/^Saved Pictures\//, '')
    .replace(/^\/+/, '');

  // Prepend 'product-images/' if it's missing, since your storage structure is nested
  const finalPath = cleanPath.startsWith('product-images/') ? cleanPath : `product-images/${cleanPath}`;

  const imageUrl = supabase.storage
    .from('product-images')
    .getPublicUrl(finalPath).data.publicUrl;

  console.log("Category:", category.name, "Final Storage Path:", finalPath);

  return (
    <Link href={category.href} className="block w-full h-full">
      <div className="relative rounded-[2rem] overflow-hidden shadow-md group aspect-[4/5] bg-white border border-white/20 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <img
          src={imageUrl}
          alt={category.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
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
