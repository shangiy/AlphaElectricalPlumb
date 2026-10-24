'use client';

import * as React from 'react';
import { carouselCategories } from '@/lib/data';
import type { CarouselCategory } from '@/lib/types';
import CategoryCard from '@/components/products/CategoryCard';
import { Skeleton } from '../ui/skeleton';
import { supabase } from '@/lib/supabase';

/**
 * Dynamic Category Carousel:
 * Fetches real-time category data from Supabase 'categories' table.
 * Implements a seamless infinite scroll loop with database-driven images.
 */
export default function CategoryCarousel() {
  const [categories, setCategories] = React.useState<CarouselCategory[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchDynamicCategories() {
        if (!supabase) {
            setCategories(carouselCategories);
            setLoading(false);
            return;
        }

        try {
            // Specifically querying the 'categories' table in Supabase
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .order('name', { ascending: true });

            if (error || !data || data.length === 0) {
                console.warn("Using fallback categories, database returned empty or error.");
                setCategories(carouselCategories);
            } else {
                setCategories(data.map(cat => ({
                    id: String(cat.id),
                    name: cat.name,
                    // Check all likely column name variations for the image path/url
                    image: cat.image_url || cat.image || cat.image_path || '',
                    href: `/category/${cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-')}`
                })));
            }
        } catch (err) {
            console.error("Category fetch failed:", err);
            setCategories(carouselCategories);
        } finally {
            setLoading(false);
        }
    }

    fetchDynamicCategories();
  }, []);

  // SEAMLESS INFINITE LOOP: Double the data for smooth scrolling
  const duplicatedCategories = [...categories, ...categories];

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
