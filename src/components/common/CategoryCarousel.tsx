
'use client';

import * as React from 'react';
import { carouselCategories } from '@/lib/data';
import type { CarouselCategory } from '@/lib/types';
import CategoryCard from '@/components/products/CategoryCard';
import { Skeleton } from '../ui/skeleton';

export default function CategoryCarousel() {
  const [categories, setCategories] = React.useState<CarouselCategory[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setCategories(carouselCategories);
    setLoading(false);
  }, []);

  // SEAMLESS INFINITE LOOP: Double the data so the row is twice as long
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
