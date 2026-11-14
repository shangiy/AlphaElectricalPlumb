'use client';

import * as React from 'react';
import type { CarouselCategory } from '@/lib/types';
import CategoryCard from '@/components/products/CategoryCard';
import { Skeleton } from '../ui/skeleton';
import { supabase } from '@/lib/supabase';
import { getStorefrontSetting } from '@/app/actions/cms-actions';

/**
 * Dynamic Category Carousel v5.0.0:
 * Updated default categories to match design screenshot.
 */
export default function CategoryCarousel() {
  const [categories, setCategories] = React.useState<CarouselCategory[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [scrollSpeed, setScrollSpeed] = React.useState('40');

  const normalizeHref = (href: string) => {
    if (!href) return '/search';
    return href.replace(/^\/shop\//, '/category/');
  };

  // High-Fidelity Defaults from Design Screenshot
  const fallbackCategories: CarouselCategory[] = [
    { id: 'Fixtures', name: 'Plumbing Fixtures', href: '/category/plumbing', image: 'collections/Hand-wash Basin and Pedestal Sink Collection.webp' },
    { id: 'Bulbs', name: 'Lighting & Bulbs', href: '/category/lighting', image: 'collections/Bird Art Lights fixture Collection.webp' },
    { id: 'Electrical', name: 'Electrical Supplies', href: '/category/electrical', image: 'collections/Electric Socket Collection.webp' },
    { id: 'Tanks', name: 'Water Tanks', href: '/category/tanks', image: 'collections/Tanks variety collection.webp' },
    { id: 'Roofing', name: 'Roofing & Construction', href: '/category/roofing', image: 'collections/Corrugated Roofing Sheet collection.webp' },
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

        const customCards = await getStorefrontSetting('category_cards');
        
        if (customCards && Array.isArray(customCards) && customCards.length > 0) {
            const formatted = customCards.map((cat: any) => ({
                id: cat.id,
                name: cat.title || cat.name,
                image: cat.image || '', 
                href: normalizeHref(cat.link || cat.href || '/search')
            }));
            setCategories(formatted);
        } else {
            setCategories(fallbackCategories);
        }
      } catch (err) {
        console.error("Carousel fetch failed:", err);
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
