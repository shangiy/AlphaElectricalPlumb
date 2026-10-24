'use client';

import * as React from 'react';
import type { CarouselCategory } from '@/lib/types';
import CategoryCard from '@/components/products/CategoryCard';
import { Skeleton } from '../ui/skeleton';
import { supabase } from '@/lib/supabase';
import placeholderData from '@/app/lib/placeholder-images.json';

/**
 * Dynamic Category Carousel v3.5:
 * Uses placeholder-images.json as a robust fallback and fetches real-time data from Supabase.
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
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .order('name', { ascending: true });

            if (error || !data || data.length === 0) {
                setCategories(fallbackCategories);
            } else {
                setCategories(data.map(cat => ({
                    id: String(cat.id),
                    name: cat.name,
                    // Robust field mapping for Supabase columns
                    image: cat.image_url || cat.imageUrl || cat.image || cat.image_path || '',
                    href: `/category/${cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-')}`
                })));
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

  // SEAMLESS INFINITE LOOP: Triple the data for a perfect endless marquee
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
          <div className="flex w-fit items-center flex-nowrap animate-scroll hover:[animation-play-state:paused] py-4">
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
