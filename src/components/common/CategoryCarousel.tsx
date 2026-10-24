'use client';

import * as React from 'react';
import type { CarouselCategory } from '@/lib/types';
import CategoryCard from '@/components/products/CategoryCard';
import { Skeleton } from '../ui/skeleton';
import { supabase } from '@/lib/supabase';

/**
 * Dynamic Category Carousel v4.0:
 * 100% Synchronized with Supabase Table Editor 'categories' table.
 * Features a seamless infinite marquee of live database categories.
 */
export default function CategoryCarousel() {
  const [categories, setCategories] = React.useState<CarouselCategory[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchDynamicCategories() {
      if (!supabase) {
        setLoading(false);
        return;
      }

      try {
        // Query the categories table as seen in the user's Supabase screenshot
        const { data, error } = await supabase
          .from('categories')
          .select('id, name, slug')
          .order('name', { ascending: true });

        if (!error && data && data.length > 0) {
          const formatted = data.map((cat: any) => ({
            id: String(cat.id),
            name: cat.name || 'Category',
            // Image is discovered in CategoryCard based on the name/folder mapping
            image: '', 
            href: `/category/${cat.slug || cat.name?.toLowerCase().replace(/\s+/g, '-')}`
          }));
          setCategories(formatted);
        } else {
          // If table is empty or error, fallback to derived unique product categories
          const { data: prodData } = await supabase.from('products').select('category');
          if (prodData && prodData.length > 0) {
            const uniqueNames = Array.from(new Set(prodData.map((p: any) => p.category))).filter(Boolean);
            const derived = uniqueNames.map(name => ({
              id: name as string,
              name: name as string,
              href: `/category/${(name as string).toLowerCase().replace(/\s+/g, '-')}`,
              image: ''
            }));
            setCategories(derived);
          }
        }
      } catch (err) {
        console.error("Category fetch failed:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDynamicCategories();
  }, []);

  // SEAMLESS INFINITE LOOP: Triple the data for a perfect endless marquee
  const duplicatedCategories = categories.length > 0 
    ? [...categories, ...categories, ...categories] 
    : [];

  if (!loading && categories.length === 0) return null;

  return (
    <section id="categories" className="py-16 bg-secondary overflow-hidden">
      <div className="container mx-auto px-4 mb-10">
        <h2 className="text-3xl font-bold font-headline text-center text-[#2b235f]">Browse by Category</h2>
        <p className="text-center text-muted-foreground text-sm mt-2">Discover quality solutions from our verified catalog</p>
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
