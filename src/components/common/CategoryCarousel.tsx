'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { carouselCategories } from '@/lib/data';
import type { CarouselCategory } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '../ui/skeleton';

export default function CategoryCarousel() {
  const [categories, setCategories] = React.useState<CarouselCategory[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // In a real app, this might be an async fetch. For now, we use the imported constant.
    setCategories(carouselCategories);
    setLoading(false);
  }, []);

  // SEAMLESS INFINITE LOOP: Double the data so the row is twice as long
  const duplicatedCategories = [...categories, ...categories];

  return (
    <section id="categories" className="py-16 bg-secondary overflow-hidden">
      <div className="container mx-auto px-4 mb-8">
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
                <Link href={category.href} passHref>
                  <Card className="h-80 overflow-hidden transition-all duration-300 border-none shadow-md hover:shadow-xl hover:-translate-y-1 group relative rounded-2xl bg-white">
                    <div className="relative w-full h-full">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        data-ai-hint="product category"
                      />
                      {/* Gradient overlay for text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      
                      <CardContent className="absolute bottom-0 w-full p-6 text-left">
                        <h3 className="text-xl font-bold text-white font-headline">
                          {category.name}
                        </h3>
                        <p className="text-white/80 text-sm mt-1 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                          Explore Collection →
                        </p>
                      </CardContent>
                    </div>
                  </Card>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
