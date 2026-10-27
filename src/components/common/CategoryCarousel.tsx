'use client';

import * as React from 'react';
import type { CarouselCategory } from '@/lib/types';
import CategoryCard from '@/components/products/CategoryCard';
import { Skeleton } from '../ui/skeleton';
import { supabase } from '@/lib/supabase';
import placeholderData from '@/app/lib/placeholder-images.json';

/**
 * Dynamic Category Carousel v3.8:
 * Resolves images directly from the Supabase storage 'product-images' bucket 
 * and filters out unwanted placeholder categories.
 */
export default function CategoryCarousel() {
  const [categories, setCategories] = React.useState<CarouselCategory[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Initializing with verified assets from placeholder-images.json
  const fallbackCategories: CarouselCategory[] = [
    { id: 'Tanks', name: 'Tanks', href: '/category/tanks', image: placeholderData.cat_tanks.url },
    { id: 'Plumbing', name: 'Plumbing', href: '/category/plumbing', image: placeholderData.cat_plumbing.url },
    { id: 'Lighting', name: 'Lighting', href: '/category/lighting', image: placeholderData.cat_lighting.url },
    { id: 'Decor', name: 'Home & Decor', href: '/category/decor', image: placeholderData.cat_decor.url },
    { id: 'Roofing', name: 'Roofing', href: '/category/roofing', image: placeholderData.cat_roofing.url },
  ];

  React.useEffect(() => {
    async function fetchDynamicCategories() {
      if (!supabase) {
        setCategories(fallbackCategories);
        setLoading(false);
        return;
      }

      try {
        // Query the dedicated categories table in Supabase
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name', { ascending: true });

        if (!error && data && data.length > 0) {
          const formatted = data
            // FILTER: Remove "Collection category" or unwanted placeholders
            .filter((cat: any) => 
                cat.name !== 'Collection category' && 
                cat.id !== '7d20835c-7fb4-4ad0-a975-5fdfbbaf0527'
            )
            .map((cat: any) => {
                const rawImg = cat.image_url || cat.imageUrl || cat.image || cat.image_path || '';
                let resolvedUrl = rawImg;

                // Resolve storage bucket public URLs from 'product-images'
                if (rawImg && !rawImg.startsWith('http')) {
                const cleanPath = rawImg.replace(/\\/g, '/').replace(/^\/+/, '');
                const { data: publicUrlData } = supabase.storage
                    .from('product-images')
                    .getPublicUrl(cleanPath);
                resolvedUrl = publicUrlData.publicUrl;
                }

                const catName = cat.name || 'Category';
                const catSlug = cat.slug || catName.toLowerCase().replace(/\s+/g, '-');

                return {
                id: String(cat.id || catName),
                name: catName,
                image: resolvedUrl || placeholderData.cat_tanks.url,
                href: `/category/${catSlug}`
                };
            });
          setCategories(formatted);
        } else {
          // Fallback logic
          setCategories(fallbackCategories);
        }
      } catch (err) {
        console.error("Category fetch failed:", err);
        setCategories(fallbackCategories);
      } finally {
        setLoading(false);
      }
    }

    fetchDynamicCategories();
  }, []);

  // SEAMLESS INFINITE LOOP
  const duplicatedCategories = [...categories, ...categories, ...categories];

  return (
    <section id="categories" className="py-16 bg-secondary overflow-hidden">
      <div className="container mx-auto px-4 mb-10">
        <h2 className="text-3xl font-bold font-headline text-center text-[#2b235f]">Browse by Category</h2>
      </div>
      
      {loading ? (
        <div className="container mx-auto px-4 flex space-x-4 overflow-hidden">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="w-64 flex-shrink-0 p-1">
              <Skeleton className="h-80 w-full rounded-2xl" />
            </div>
          ))}
        </div>
      ) : (
        <div
          className="relative w-full overflow-hidden"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          }}
        >
          <div className="flex w-fit items-center flex-nowrap animate-marquee hover:[animation-play-state:paused] py-4">
            {duplicatedCategories.map((category, index) => (
              <div key={`${category.id}-${index}`} className="flex-shrink-0 w-72 px-4">
                <CategoryCard category={category} />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
