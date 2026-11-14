
'use client';

import * as React from 'react';
import type { CarouselCategory } from '@/lib/types';
import CategoryCard from '@/components/products/CategoryCard';
import { Skeleton } from '../ui/skeleton';
import { supabase } from '@/lib/supabase';
import { getStorefrontSetting } from '@/app/actions/cms-actions';
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';
import { cn } from '@/lib/utils';

/**
 * High-Intelligence Kinetic Carousel v6.2.0:
 * Features linear AutoScroll motion with kinetic inertia dragging.
 * Includes gated haptic audio triggers for manual interaction.
 */
export default function CategoryCarousel() {
  const [categories, setCategories] = React.useState<CarouselCategory[]>([]);
  const [loading, setLoading] = React.useState(true);
  
  const audioContextRef = React.useRef<AudioContext | null>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
        loop: true, 
        align: 'start',
        dragFree: true, // Kinetic momentum scrolling
        containScroll: 'trimSnaps'
    }, 
    [
        AutoScroll({ 
            speed: 1, 
            stopOnInteraction: true, // Motion stops permanently when user drags
            stopOnMouseEnter: true,  // Motion pauses during hover
            playOnInit: true 
        })
    ]
  );

  // Synthetic Tick Sound (iPhone Mechanical Style)
  const playTick = React.useCallback(() => {
    try {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        const ctx = audioContextRef.current;
        if (ctx.state === 'suspended') ctx.resume();

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.03);

        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.03);
    } catch (e) {
        // Silent fail for browser restrictions
    }
  }, []);

  const lastScrollProgress = React.useRef(0);
  const tickThreshold = 0.02;

  const onScroll = React.useCallback(() => {
    if (!emblaApi) return;

    // GATED HAPTICS: Only play ticks if AutoScroll is NOT driving (i.e. manual drag or glide)
    const autoScroll = emblaApi.plugins().autoScroll;
    if (autoScroll && autoScroll.isPlaying()) return;

    const progress = emblaApi.scrollProgress();
    const diff = Math.abs(progress - lastScrollProgress.current);
    
    // Play tick sound when moving past thresholds during manual scroll
    if (diff > tickThreshold && diff < 0.9) {
        playTick();
        lastScrollProgress.current = progress;
    } else if (diff > 0.9) {
        // Handle loop wrap-around without redundant tick
        lastScrollProgress.current = progress;
    }
  }, [emblaApi, playTick]);

  React.useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('scroll', onScroll);
    return () => {
        emblaApi.off('scroll', onScroll);
    };
  }, [emblaApi, onScroll]);

  const normalizeHref = (href: string) => {
    if (!href) return '/search';
    return href.replace(/^\/shop\//, '/category/');
  };

  const fallbackCategories: CarouselCategory[] = [
    { id: 'cat-tanks', name: 'Tanks Category', href: '/category/tanks', image: 'collections/Tanks variety collection.webp' },
    { id: 'cat-chandelier', name: 'Chandelier Category', href: '/category/lighting', image: 'collections/Bird Art Lights fixture Collection.webp' },
    { id: 'cat-bulbs', name: 'Lighting & Bulbs', href: '/category/lighting', image: 'collections/Contemporary Gold Spiral Chandelier.webp' },
    { id: 'cat-electrical', name: 'Electrical Supplies', href: '/category/electrical', image: 'collections/Electric Socket Collection.webp' },
    { id: 'cat-roofing', name: 'Mabati and Roofing', href: '/category/roofing', image: 'collections/Corrugated Roofing Sheet collection.webp' },
    { id: 'cat-solar', name: 'Solar panels & accessories', href: '/category/solar', image: 'product-images/Solar panels & accessories/Generic Solar Panel.webp' },
  ];

  React.useEffect(() => {
    async function fetchDynamicData() {
      if (!supabase) {
        setCategories(fallbackCategories);
        setLoading(false);
        return;
      }

      try {
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
        <div className="relative w-full overflow-hidden px-4 md:px-0">
          <div className="embla overflow-visible" ref={emblaRef}>
            <div className="embla__container flex">
              {categories.map((category) => (
                <div 
                    key={category.id} 
                    className="embla__slide flex-shrink-0 w-64 px-4 transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] select-none touch-pan-y"
                >
                  <CategoryCard category={category} />
                </div>
              ))}
            </div>
          </div>
          
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-secondary to-transparent z-10 pointer-events-none hidden md:block" />
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-secondary to-transparent z-10 pointer-events-none hidden md:block" />
        </div>
      )}
    </section>
  );
}
