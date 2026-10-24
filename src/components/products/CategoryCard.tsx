'use client';

import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import placeholderData from '@/app/lib/placeholder-images.json';

interface Category {
  id: string;
  name: string;
  image?: string | null;
  href: string;
}

/**
 * Professional Category Card v3.6:
 * Features: Deep Storage Discovery - maps Supabase Table Editor names to storage bucket folders.
 */
const categoryToStorageMap: Record<string, string> = {
  'Chandelier category': 'Decorative Lighting and chandeliers/Contemporary Gold Spiral Chandelier.webp',
  'Plumbing category': 'Plumbing/green PPR (Polypropylene Random Copolymer) pipes.webp',
  'Wall Lighting Pendant': 'Decorative Lighting and chandeliers/Modern Crystal Wall Sconce.webp',
  'Toilets & Sinks category': 'Sanitary Ware Toilets & Bathroom Fixtures/Dual-Flush Ceramic Toilet Suite.webp',
  'Tanks category': 'Tanks category/Kentank Cylindrical Water Storage Tank (Heavy Duty).webp',
  'Electricals category': 'Electrical items/Electric Socket Collection.webp',
  'Collection category': 'Collections/Hand-wash Basin and Pedestal Sink Collection.webp',
  'Construction and Fencing': "Construction and Fencing equip'nts/Steel Reinforcement Rebars.webp",
  'Home & Decor category': 'Collections/Bird Art Lights fixture Collection.webp',
  'Solar category': 'Solar panels & accessories/Solar Water Heater System.webp',
  'Mabati category': 'Mabati and Roofing/Maasai Red Tile Profile roofing sheets.webp',
};

// Fallback high-quality local assets mapping
const fallbackMap: Record<string, string> = {
  'Tanks': placeholderData.cat_tanks.url,
  'Plumbing': placeholderData.cat_plumbing.url,
  'Lighting': placeholderData.cat_lighting.url,
  'Home & Decor': placeholderData.cat_decor.url,
  'Roofing': placeholderData.cat_roofing.url,
};

export default function CategoryCard({ category }: { category: Category }) {
  const [imgIndex, setImgIndex] = useState(0);

  // Discovery Logic: Priority for DB image, then Folder Map, then Global Fallbacks
  const candidateUrls = useMemo(() => {
    const urls: string[] = [];
    
    // 1. Check if an explicit image URL was provided from the DB
    if (category.image && category.image.length > 2) {
        if (category.image.startsWith('http')) {
            urls.push(category.image);
        } else if (supabase) {
            const cleanPath = category.image.replace(/\\/g, '/').replace(/^\/+/, '');
            urls.push(supabase.storage.from('product-images').getPublicUrl(cleanPath).data.publicUrl);
        }
    }

    if (!supabase) {
        urls.push('/placeholder.jpg');
        return urls;
    }

    // 2. Map the Name to specific Storage folder subpaths
    const mappedPath = categoryToStorageMap[category.name.trim()];
    if (mappedPath) {
        urls.push(supabase.storage.from('product-images').getPublicUrl(mappedPath).data.publicUrl);
        // Try without 'product images/' prefix just in case the bucket root is used
        urls.push(supabase.storage.from('product-images').getPublicUrl(`product images/${mappedPath}`).data.publicUrl);
    }

    // 3. Try to find a simple filename-based match
    const filename = `${category.name.split(' ')[0].trim()}.webp`;
    urls.push(supabase.storage.from('product-images').getPublicUrl(`category/${filename}`).data.publicUrl);

    // 4. Add high-quality placeholder-images.json fallback based on keywords
    const lowerName = category.name.toLowerCase();
    if (lowerName.includes('tank')) urls.push(placeholderData.cat_tanks.url);
    if (lowerName.includes('plumb')) urls.push(placeholderData.cat_plumbing.url);
    if (lowerName.includes('light') || lowerName.includes('chandelier')) urls.push(placeholderData.cat_lighting.url);
    if (lowerName.includes('decor')) urls.push(placeholderData.cat_decor.url);
    if (lowerName.includes('mabati') || lowerName.includes('roof')) urls.push(placeholderData.cat_roofing.url);

    return Array.from(new Set(urls)).filter(url => url && !url.includes('undefined'));
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
