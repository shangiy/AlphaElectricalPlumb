
'use client';

import * as React from 'react';
import type { CarouselCategory } from '@/lib/types';
import CategoryCard from '@/components/products/CategoryCard';
import { Skeleton } from '../ui/skeleton';
import { supabase } from '@/lib/supabase';
import placeholderData from '@/app/lib/placeholder-images.json';
import { getStorefrontSetting } from '@/app/actions/cms-actions';

/**
 * Dynamic Category Carousel v4.2:
 * Restored "Electrical Supplies" and expanded fallbacks to ensure images resolve via keywords.
 * Added URL normalization for consistent routing.
 */
export default function CategoryCarousel() {
  const [categories, setCategories] = React.useState<CarouselCategory[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [scrollSpeed, setScrollSpeed] = React.useState('40');

  const normalizeHref = (href: string) => {
    if (!href) return '/search';
    return href.replace(/^\/shop\//, '/category/');
  };

  // Expanded fallbacks with empty images to trigger CategoryCard's keyword-based Supabase resolution
  const fallbackCategories: CarouselCategory[] = [
    { id: 'Tanks', name: 'Water Tanks', href: '/category/tanks', image: '' },
    { id: 'Plumbing', name: 'Plumbing Equipment', href: '/category/plumbing', image: '' },
    { id: 'Electrical', name: 'Electrical Supplies', href: '/category/lighting', image: '' },
    { id: 'Decor', name: 'Home & Decor', href: '/category/decor', image: '' },
    { id: 'Roofing', name: 'Roofing & Construction', href: '/category/roofing', image: '' },
    { id: 'Sanitary', name: 'Toilets & Sinks', href: '/category/toilets-&-sinks', image: '' },
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
                image: cat.image || '', // Empty triggers keyword auto-resolution
                href: normalizeHref(cat.link || cat.href || '/search')
            }));
            setCategories(formatted);
        } else {
            // Fallback to the categories table if the CMS setting is not configured
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .order('sort_order', { ascending: true });

            if (!error && data && data.length > 0) {
                const formatted = data.map((cat: any) => {
                    const slug = cat.slug || (cat.name || '').toLowerCase().replace(/\s+/g, '-');
                    return {
                        id: String(cat.id || cat.name),
                        name: cat.name || 'Category',
                        image: cat.image_url || cat.image_path || '', // Empty triggers keyword auto-resolution
                        href: `/category/${slug}`
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

  // Ensure unique keys by combining id and index
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
