'use client';

import * as React from 'react';
import type { CarouselCategory } from '@/lib/types';
import CategoryCard from '@/components/products/CategoryCard';
import { Skeleton } from '../ui/skeleton';
import { supabase } from '@/lib/supabase';
import placeholderData from '@/app/lib/placeholder-images.json';
import { getStorefrontSetting } from '@/app/actions/cms-actions';

/**
 * Dynamic Category Carousel v4.0:
 * Now supports custom category cards defined in Storefront CMS.
 * Prioritizes 'category_cards' setting, falling back to the standard categories table.
 */
export default function CategoryCarousel() {
  const [categories, setCategories] = React.useState<CarouselCategory[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [scrollSpeed, setScrollSpeed] = React.useState('40');

  const fallbackCategories: CarouselCategory[] = [
    { id: 'Tanks', name: 'Tanks', href: '/category/tanks', image: placeholderData.cat_tanks.url },
    { id: 'Plumbing', name: 'Plumbing', href: '/category/plumbing', image: placeholderData.cat_plumbing.url },
    { id: 'Lighting', name: 'Lighting', href: '/category/lighting', image: placeholderData.cat_lighting.url },
    { id: 'Decor', name: 'Home & Decor', href: '/category/decor', image: placeholderData.cat_decor.url },
    { id: 'Roofing', name: 'Roofing', href: '/category/roofing', image: placeholderData.cat_roofing.url },
  ];

  React.useEffect(() => {
    async function fetchDynamicData() {
      if (!supabase) {
        setCategories(fallbackCategories);
        setLoading(false);
        return;
      }

      try {
        const speed = await getStorefrontSetting('carousel_speed');
        if (speed) setScrollSpeed(speed);

        // 1. Try to fetch custom category cards from CMS
        const customCards = await getStorefrontSetting('category_cards');
        
        if (customCards && Array.isArray(customCards) && customCards.length > 0) {
            const formatted = customCards.map((cat: any) => ({
                id: cat.id,
                name: cat.title || cat.name,
                image: cat.image || placeholderData.cat_tanks.url,
                href: cat.link || cat.href || '/search'
            }));
            setCategories(formatted);
        } else {
            // 2. Fallback to standard categories table
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .order('sort_order', { ascending: true });

            if (!error && data && data.length > 0) {
                const formatted = data.map((cat: any) => {
                    const rawImg = cat.image_url || cat.imageUrl || cat.image || cat.image_path || '';
                    return {
                        id: String(cat.id || cat.name),
                        name: cat.name || 'Category',
                        image: rawImg || placeholderData.cat_tanks.url,
                        href: `/category/${cat.slug || (cat.name || '').toLowerCase().replace(/\s+/g, '-')}`
                    };
                });
                setCategories(formatted);
            } else {
                setCategories(fallbackCategories);
            }
        }
      } catch (err) {
        console.error("Carousel data fetch failed:", err);
        setCategories(fallbackCategories);
      } finally {
        setLoading(false);
      }
    }

    fetchDynamicData();
  }, []);

  const duplicatedCategories = [...categories, ...categories, ...categories];

  return (
    <section id="categories" className="py-16 bg-secondary overflow-hidden border-t">
      <div className="container mx-auto px-4 mb-10 text-center">
        <h2 className="text-3xl font-bold font-headline text-[#2b235f] uppercase tracking-tighter">Browse by Category</h2>
        <div className="w-20 h-1 bg-primary/20 rounded-full mx-auto mt-4" />
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
          <div 
            className="flex w-fit items-center flex-nowrap animate-marquee hover:[animation-play-state:paused] py-4"
            style={{ animationDuration: `${scrollSpeed}s` }}
          >
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
