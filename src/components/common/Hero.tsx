'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { getStorefrontSetting, type HeroSlide } from '@/app/actions/cms-actions';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { STYLE_OPTIONS } from '@/components/admin/HeroManager';

const HeroSearch = dynamic(() => import('./HeroSearch'), {
  ssr: true,
  loading: () => <div className="h-14 w-full max-w-xl bg-white/20 animate-pulse rounded-full shadow-md border border-white/10" />
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

  const renderHeadline = (slide: HeroSlide) => {
    const headline = slide.headline || 'ALPHA PLUMBING & ELECTRICALS LTD';
    const highlight = slide.highlightedText;
    
    if (!highlight) return headline;

    const activeStyle = STYLE_OPTIONS.find(opt => opt.id === slide.styleType) || STYLE_OPTIONS[0];
    const parts = headline.split(new RegExp(`(${highlight})`, 'gi'));
    
    return parts.map((part, i) => {
        if (part.toLowerCase() === highlight.toLowerCase()) {
            return (
                <span key={i} className={cn("inline-block", activeStyle.previewClass)}>
                    {part}
                </span>
            );
        }
        return part;
    });
  };

  if (loading) {
      return (
          <section className="h-[750px] w-full bg-[#050b1a] animate-pulse" />
      );
  }

  const activeSlides = slides.length > 0 ? slides : [{
      id: 'default',
      headline: 'ALPHA PLUMBING & ELECTRICALS LTD',
      highlightedText: 'ELECTRICALS',
      styleType: 'kenyan-flag',
      subheading: 'Solution for Plumbing and Eletricals',
      ctaText: 'EXPLORE',
      ctaLink: '/search',
      imageUrl: '/background.jpg', // Technical background
      active: true,
      headlineColor: '#ffffff',
      headlineSize: 84,
      subheadingColor: '#ffffff',
      subheadingSize: 24
  } as any];

  return (
    <section className="relative h-[750px] w-full overflow-hidden bg-[#050b1a]">
      {activeSlides.map((slide, idx) => (
          <div 
            key={slide.id} 
            className={cn(
                "absolute inset-0 transition-all duration-1000",
                idx === currentIndex ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 scale-105 pointer-events-none"
            )}
          >
              <img
                src={slide.imageUrl}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = '/background.jpg'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80" />
              
              <div className="relative h-full container mx-auto px-4 flex flex-col justify-center items-start text-left text-white max-w-7xl">
                  <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
                    <h1 
                      className="font-black font-headline leading-[1] tracking-tighter uppercase whitespace-pre-wrap drop-shadow-2xl"
                      style={{ 
                        color: slide.headlineColor || '#ffffff',
                        fontSize: slide.headlineSize ? `${Math.min(slide.headlineSize, 84)}px` : '72px'
                      }}
                    >
                        {renderHeadline(slide)}
                    </h1>
                    
                    <p 
                      className="font-bold text-white/90 text-xl md:text-2xl leading-relaxed whitespace-pre-wrap tracking-tight"
                      style={{ 
                        color: slide.subheadingColor || '#ffffff',
                        fontSize: slide.subheadingSize ? `${Math.min(slide.subheadingSize, 28)}px` : '24px'
                      }}
                    >
                        {slide.subheading}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
                        <Button asChild size="lg" className="rounded-full bg-[#18998c] hover:bg-[#158076] text-white font-black px-12 h-16 text-xl shadow-[0_10px_30px_rgba(24,153,140,0.3)] transition-all hover:scale-105 active:scale-95 border-none">
                            <Link href={slide.ctaLink || '/search'}>
                                {slide.ctaText || 'EXPLORE'}
                            </Link>
                        </Button>
                        <div className="w-full max-w-xl">
                            <HeroSearch />
                        </div>
                    </div>
                  </div>
              </div>
          </div>
      ))}

      {activeSlides.length > 1 && (
          <div className="absolute bottom-10 right-10 flex gap-3 z-20">
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-12 w-12 rounded-full border border-white/20 bg-black/20 backdrop-blur-md hover:bg-white/10 text-white transition-all hover:scale-110" 
                onClick={() => setCurrentIndex((currentIndex - 1 + activeSlides.length) % activeSlides.length)}
              >
                  <ChevronLeft size={24} />
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-12 w-12 rounded-full border border-white/20 bg-black/20 backdrop-blur-md hover:bg-white/10 text-white transition-all hover:scale-110" 
                onClick={() => setCurrentIndex((currentIndex + 1) % activeSlides.length)}
              >
                  <ChevronRight size={24} />
              </Button>
          </div>
      )}
    </section>
  );
}
