'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { getStorefrontSetting, type HeroSlide } from '@/app/actions/cms-actions';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { STYLE_OPTIONS } from '@/components/admin/HeroManager';

const HeroSearch = dynamic(() => import('./HeroSearch'), {
  ssr: true,
  loading: () => <div className="h-14 w-full max-w-2xl bg-white/20 animate-pulse rounded-full shadow-md border border-white/10" />
});

export default function Hero() {
  const [slides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHero() {
        try {
            const data = await getStorefrontSetting('hero_slides');
            if (data && Array.isArray(data)) {
                setHeroSlides(data.filter(s => s.active));
            }
        } catch (e) {
            console.error("Hero CMS fetch failed");
        } finally {
            setLoading(false);
        }
    }
    loadHero();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [slides]);

  const frequentSearches = [
    { name: 'Water Tanks', href: '/tanks' },
    { name: 'LED Lights', href: '/decor' },
    { name: 'PPR Pipes', href: '/plumbing' },
    { name: 'Solar Heaters', href: '/plumbing' },
  ];

  const renderHeadline = (slide: HeroSlide) => {
    const headline = slide.headline || 'Innovating Everyday Living';
    const highlight = slide.highlightedText;
    
    if (!highlight) return headline;

    const activeStyle = STYLE_OPTIONS.find(opt => opt.id === slide.styleType) || STYLE_OPTIONS[0];
    
    // Case-insensitive split but preserve casing of original parts
    const parts = headline.split(new RegExp(`(${highlight})`, 'gi'));
    
    return parts.map((part, i) => {
        if (part.toLowerCase() === highlight.toLowerCase()) {
            return (
                <span key={i} className={cn("inline-block px-1", activeStyle.previewClass)}>
                    {part}
                </span>
            );
        }
        return part;
    });
  };

  if (loading) {
      return (
          <section className="relative h-[70vh] md:h-[85vh] w-full flex items-center justify-center bg-accent">
              <Loader2 className="h-10 w-10 animate-spin text-white/20" />
          </section>
      );
  }

  const activeSlides = slides.length > 0 ? slides : [{
      id: 'default',
      headline: 'Innovating Everyday Living',
      highlightedText: 'ALPHA',
      styleType: 'kenyan-flag',
      subheading: 'Premium Electrical & Plumbing Solutions',
      ctaText: 'START EXPLORING',
      ctaLink: '/search',
      imageUrl: '/background.jpg',
      active: true,
      headlineColor: '#ffffff',
      headlineSize: 72,
      subheadingColor: '#ffffff',
      subheadingSize: 24,
      topMargin: 0
  } as any];

  return (
    <section className="relative h-[70vh] md:h-[85vh] w-full overflow-hidden text-white -mt-24">
      {activeSlides.map((slide, idx) => (
          <div 
            key={slide.id} 
            className={cn(
                "absolute inset-0 transition-all duration-1000 ease-in-out",
                idx === currentIndex ? "opacity-100 scale-100" : "opacity-0 scale-110 pointer-events-none"
            )}
          >
              <img
                src={slide.imageUrl}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = '/elegant_background.jpg'; }}
              />
              <div className="absolute inset-0 bg-black/50" />
              
              <div 
                className="container mx-auto px-4 h-full flex flex-col justify-center items-start relative z-10"
                style={{ 
                  paddingTop: slide.topMargin ? `${slide.topMargin + 6}cm` : '6cm' 
                }}
              >
                  <div className="max-w-4xl space-y-6 animate-in fade-in slide-in-from-left duration-1000">
                    <h1 
                      className="text-4xl md:text-7xl font-black font-headline leading-[0.95] tracking-tighter drop-shadow-2xl uppercase whitespace-pre-wrap"
                      style={{ 
                        color: slide.headlineColor || '#ffffff',
                        fontSize: slide.headlineSize ? `${slide.headlineSize}px` : undefined
                      }}
                    >
                        {renderHeadline(slide)}
                    </h1>
                    <p 
                      className="text-lg md:text-2xl font-medium drop-shadow-lg max-w-2xl whitespace-pre-wrap"
                      style={{ 
                        color: slide.subheadingColor || '#ffffff',
                        fontSize: slide.subheadingSize ? `${slide.subheadingSize}px` : undefined
                      }}
                    >
                        {slide.subheading}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Button asChild size="xl" className="rounded-full bg-primary hover:bg-primary/90 text-white font-black shadow-2xl hover:scale-105 transition-transform">
                            <Link href={slide.ctaLink || '/search'}>{slide.ctaText || 'EXPLORE'}</Link>
                        </Button>
                        <div className="hidden sm:block">
                            <HeroSearch />
                        </div>
                    </div>

                    <div className="mt-8 flex items-center justify-start gap-3 flex-wrap">
                        <span className="text-xs font-black uppercase tracking-widest text-white/60">Trending:</span>
                        {frequentSearches.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-[10px] font-black uppercase tracking-widest rounded-full px-4 py-1.5 border border-white/20 bg-white/5 hover:bg-white/20 backdrop-blur-md transition-all text-white"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                  </div>
              </div>
          </div>
      ))}

      {activeSlides.length > 1 && (
          <div className="absolute bottom-10 right-10 flex gap-2 z-20">
              <Button size="icon" variant="ghost" className="rounded-full border border-white/20 hover:bg-white/10 text-white" onClick={() => setCurrentIndex((currentIndex - 1 + activeSlides.length) % activeSlides.length)}>
                  <ChevronLeft />
              </Button>
              <Button size="icon" variant="ghost" className="rounded-full border border-white/20 hover:bg-white/10 text-white" onClick={() => setCurrentIndex((currentIndex + 1) % activeSlides.length)}>
                  <ChevronRight />
              </Button>
          </div>
      )}
    </section>
  );
}
