
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

  // Duplicate categories for a seamless looping effect
  const duplicatedCategories = [...categories, ...categories];

  return (
    <section id="categories" className="py-12 bg-secondary">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold font-headline mb-8 text-center">Browse by Category</h2>
        
        {loading ? (
          <div className="flex space-x-4 overflow-hidden">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="w-[20%] flex-shrink-0 p-1">
                <Skeleton className="aspect-square w-full rounded-lg" />
              </div>
            ))}
          </div>
        ) : (
          <div
            className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)]"
          >
            <div className="flex items-center justify-center md:justify-start animate-scroll hover:[animation-play-state:paused]">
              {duplicatedCategories.map((category, index) => (
                <div key={`${category.id}-${index}`} className="flex-shrink-0 w-64 p-3">
                  <Link href={category.href} passHref>
                    <Card className="h-80 overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 group">
                      <div className="relative w-full h-full">
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          data-ai-hint="product category"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <CardContent className="absolute bottom-0 w-full p-4 text-left">
                          <h3 className="text-lg font-semibold text-white">
                            {category.name}
                          </h3>
                        </CardContent>
                      </div>
                    </Card>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
