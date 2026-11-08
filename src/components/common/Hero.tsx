'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { getStorefrontSetting, type HeroSlide } from '@/app/actions/cms-actions';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Loader2, Sparkles, ArrowRight } from 'lucide-react';
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

  const renderHeadline = (slide: HeroSlide) => {
    const headline = slide.headline || 'Innovating Everyday Living';
    const highlight = slide.highlightedText;
    
    if (!highlight) return headline;

    const activeStyle = STYLE_OPTIONS.find(opt => opt.id === slide.styleType) || STYLE_OPTIONS[0];
    const parts = headline.split(new RegExp(`(${highlight})`, 'gi'));
    
    return parts.map((part, i) => {
        if (part.toLowerCase() === highlight.toLowerCase()) {
            return (
                <span key={i} className={cn("inline-block px-2", activeStyle.previewClass)}>
                    {part}
                </span>
            );
        }
        return part;
    });
  };

  if (loading) {
      return (
          <section className="h-[500px] w-full bg-muted animate-pulse rounded-b-[3rem]" />
      );
  }

  const activeSlides = slides.length > 0 ? slides : [{
      id: 'default',
      headline: 'Innovating Everyday Living',
      highlightedText: 'ALPHA',
      styleType: 'kenyan-flag',
      subheading: 'Premium Electrical & Plumbing Solutions for your home and project.',
      ctaText: 'EXPLORE CATALOG',
      ctaLink: '/search',
      imageUrl: '/background.jpg',
      active: true,
      headlineColor: '#ffffff',
      headlineSize: 72,
      subheadingColor: '#ffffff',
      subheadingSize: 24
  } as any];

  return (
    <section className="relative h-[600px] w-full overflow-hidden bg-background">
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
              <div className="absolute inset-0 bg-black/50" />
              
              <div className="relative h-full container mx-auto px-4 flex flex-col justify-center items-center text-center text-white">
                  <div className="max-w-4xl space-y-6 animate-in fade-in zoom-in-95 duration-1000">
                    <div className="flex items-center justify-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-[10px] bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full w-fit mx-auto border border-white/10 mb-2">
                       <Sparkles size={12} /> Quality Excellence
                    </div>
                    
                    <h1 
                      className="font-black font-headline leading-[0.9] tracking-tighter uppercase whitespace-pre-wrap"
                      style={{ 
                        color: slide.headlineColor || '#ffffff',
                        fontSize: slide.headlineSize ? `${Math.min(slide.headlineSize, 72)}px` : '64px'
                      }}
                    >
                        {renderHeadline(slide)}
                    </h1>
                    
                    <p 
                      className="font-medium max-w-2xl mx-auto text-white/90 text-lg md:text-xl leading-relaxed whitespace-pre-wrap"
                      style={{ 
                        color: slide.subheadingColor || '#ffffff',
                        fontSize: slide.subheadingSize ? `${Math.min(slide.subheadingSize, 24)}px` : '20px'
                      }}
                    >
                        {slide.subheading}
                    </p>
                    
                    <div className="pt-6">
                        <Button asChild size="lg" className="rounded-full bg-primary hover:bg-primary/90 text-white font-black px-12 h-14 shadow-2xl hover:scale-105 active:scale-95 transition-all">
                            <Link href={slide.ctaLink || '/search'} className="flex items-center gap-3">
                                {slide.ctaText || 'EXPLORE CATALOG'}
                                <ArrowRight size={20} />
                            </Link>
                        </Button>
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
