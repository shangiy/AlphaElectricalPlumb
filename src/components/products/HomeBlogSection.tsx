'use client';

import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Leaf, ShoppingBag } from 'lucide-react';
import placeholderData from '@/app/lib/placeholder-images.json';
import { cn } from '@/lib/utils';

const blogPosts = [
  {
    title: "Nature's Whispers",
    excerpt: "Finding peace in the silent growth of the forest.",
    image: placeholderData.blog_post_1.url,
    icon: <Leaf className="w-6 h-6 text-emerald-400" />,
    color: "bg-emerald-900/40"
  },
  {
    title: "The Art of Slow Living",
    excerpt: "Why doing less allows you to experience more.",
    image: placeholderData.blog_post_2.url,
    icon: <Star className="w-6 h-6 text-yellow-400" />,
    color: "bg-amber-900/40"
  },
  {
    title: "Style & Substance",
    excerpt: "Expressing your inner growth through outer style.",
    image: placeholderData.blog_post_3.url,
    icon: <ShoppingBag className="w-6 h-6 text-rose-400" />,
    color: "bg-rose-900/40"
  }
];

export default function HomeBlogSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' }, [
    Autoplay({ delay: 4000, stopOnInteraction: false })
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback((index: number) => {
    if (!emblaApi) return;
    emblaApi.scrollTo(index);
  }, [emblaApi]);

  return (
    <section className="relative min-h-[80vh] flex items-center py-24 overflow-hidden">
      {/* Asymmetrical Background */}
      <div className="absolute inset-0 z-0 flex">
        <div className="w-3/4 bg-wanjiku-green rounded-r-[5rem]" />
        <div className="w-1/4 bg-background" />
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="mb-16">
          <h2 className="text-white text-sm font-black tracking-[0.3em] uppercase opacity-60 mb-4">From My Blog</h2>
          <h3 className="text-white text-4xl md:text-6xl font-bold font-headline max-w-2xl">
            Thoughts, stories, and growth.
          </h3>
        </div>

        <div className="embla overflow-visible" ref={emblaRef}>
          <div className="embla__container flex gap-8">
            {blogPosts.map((post, index) => (
              <div key={index} className="embla__slide flex-[0_0_85%] md:flex-[0_0_40%] lg:flex-[0_0_30%] min-w-0">
                <Link href="/blog" className="group block h-full">
                  <div className="bg-white rounded-[2.5rem] overflow-hidden h-full shadow-2xl transition-transform duration-500 group-hover:-translate-y-4">
                    <div className="relative aspect-[16/10]">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className={cn("absolute top-6 left-6 p-3 rounded-2xl backdrop-blur-md", post.color)}>
                        {post.icon}
                      </div>
                    </div>
                    <div className="p-8">
                      <h4 className="text-2xl font-bold text-primary mb-3 group-hover:text-accent transition-colors">
                        {post.title}
                      </h4>
                      <p className="text-muted-foreground leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-start gap-3 mt-12 pl-2">
          {blogPosts.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                selectedIndex === index 
                  ? "bg-white w-10" 
                  : "bg-white/30 hover:bg-white/50"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}