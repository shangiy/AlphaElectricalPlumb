'use client';

import * as React from 'react';
import type { CarouselCategory } from '@/lib/types';
import CategoryCard from '@/components/products/CategoryCard';
import { Skeleton } from '../ui/skeleton';
import { supabase } from '@/lib/supabase';
import placeholderData from '@/app/lib/placeholder-images.json';

/**
 * Dynamic Category Carousel v3.7:
 * Resolves images directly from the Supabase storage 'product-images' bucket 
 * and routes items to their respective category pages.
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
        // Query the dedicated categories table in Supabase Table Editor
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name', { ascending: true });

        if (!error && data && data.length > 0) {
          const formatted = data.map((cat: any) => {
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
          // Fallback: derive categories and bucket image links dynamically from products table
          const { data: prodData } = await supabase.from('products').select('category, image_url, image_urls');
          if (prodData && prodData.length > 0) {
            const categoryMap = new Map<string, string>();
            prodData.forEach((p: any) => {
              if (p.category && !categoryMap.has(p.category)) {
                const img = p.image_url || (p.image_urls && p.image_urls[0]) || '';
                let resolvedUrl = img;
                if (img && !img.startsWith('http')) {
                  const cleanPath = img.replace(/\\/g, '/').replace(/^\/+/, '');
                  resolvedUrl = supabase.storage.from('product-images').getPublicUrl(cleanPath).data.publicUrl;
                }
                categoryMap.set(p.category, resolvedUrl || placeholderData.cat_tanks.url);
              }
            });

            const derived = Array.from(categoryMap.entries()).map(([name, image]) => ({
              id: name,
              name,
              href: `/category/${name.toLowerCase().replace(/\s+/g, '-')}`,
              image
            }));
            setCategories(derived.length > 0 ? derived : fallbackCategories);
          } else {
            setCategories(fallbackCategories);
          }
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

  // SEAMLESS INFINITE LOOP: Triple the data for a continuous marquee animation
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
