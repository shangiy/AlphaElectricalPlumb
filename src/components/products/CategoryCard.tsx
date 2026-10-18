
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
  'Toilets & Sinks': 'Hand-wash Basin and Pedestal Sink Collection.webp',
  'Solar category': 'Seven SS Stars 150 Liters Non-Pressurized Solar Water Heater 4.webp',
};

export default function CategoryCard({ category }: { category: Category }) {
  const [candidateIndex, setCandidateIndex] = useState(0);

  // 1. Determine base path from map or DB
  const rawPath = category.image_path || `collections/${categoryImageMap[category.name.trim()] || `${category.name.trim()}.webp`}`;

  // 2. Generate Candidate URLs (Self-Healing)
  const candidates = useMemo(() => {
    if (!supabase) return [];

    const cleanPath = rawPath
      .replace(/^(product-images\/)+/g, '')
      .replace(/^(Saved Pictures\/)+/g, '')
      .replace(/\\/g, '/')
      .replace(/^\/+/, '');

    return [
      // Candidate A: Nested folder structure (Found in working links)
      supabase.storage.from('product-images').getPublicUrl(`product-images/${cleanPath}`).data.publicUrl,
      // Candidate B: Root level bucket access
      supabase.storage.from('product-images').getPublicUrl(cleanPath).data.publicUrl
    ];
  }, [rawPath]);

  const handleImageError = () => {
    // If Candidate A fails, try B. If B fails, use placeholder.
    if (candidateIndex < candidates.length - 1) {
      setCandidateIndex(prev => prev + 1);
    } else {
      setCandidateIndex(-1); // Trigger placeholder
    }
  };

  const imageUrl = candidateIndex === -1 ? null : candidates[candidateIndex];

  return (
    <Link href={category.href || '#'} className="block group">
      <div className="relative rounded-[2rem] overflow-hidden shadow-md aspect-[4/5] bg-muted border border-white/25 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <img
          src={imageUrl || `https://placehold.co/400x500?text=${encodeURIComponent(category.name)}`}
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
