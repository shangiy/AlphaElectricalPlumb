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

/**
 * Premium Hero v3.1:
 * - Visually separated from header.
 * - Implements strict safe margins for responsive design.
 * - Optimized container architecture to prevent bleed on mobile.
 */
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
    { name: 'Water Tanks', href: '/category/tanks' },
    { name: 'LED Lights', href: '/category/decor' },
    { name: 'PPR Pipes', href: '/category/plumbing' },
    { name: 'Solar Heaters', href: '/category/plumbing' },
  ];

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
          <section className="container mx-auto px-4 lg:px-8 py-12 md:py-20">
              <div className="w-full aspect-[21/9] bg-muted animate-pulse rounded-[3rem] flex items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary/20" />
              </div>
          </section>
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
      subheadingSize: 24,
      headlineTopMargin: 0,
      subheadingTopMargin: 0
  } as any];

  return (
    <section className="relative overflow-hidden bg-background py-8 md:py-12">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <div className="relative h-[600px] md:h-[700px] rounded-[3rem] overflow-hidden shadow-2xl group/hero">
          
          {activeSlides.map((slide, idx) => (
              <div 
                key={slide.id} 
                className={cn(
                    "absolute inset-0 transition-all duration-1000 ease-in-out",
                    idx === currentIndex ? "opacity-100 scale-100 z-10" : "opacity-0 scale-105 pointer-events-none z-0"
                )}
              >
                  <img
                    src={slide.imageUrl}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[10000ms] group-hover/hero:scale-110"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/elegant_background.jpg'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                  
                  <div className="relative h-full w-full flex flex-col justify-center items-start px-8 md:px-20 py-12">
                      <div className="max-w-3xl space-y-6 animate-in fade-in slide-in-from-left duration-1000">
                        <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-[10px] bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full w-fit border border-white/10">
                           <Sparkles size={12} /> Established Excellence
                        </div>
                        
                        <h1 
                          className="font-black font-headline leading-[0.9] tracking-tighter drop-shadow-2xl uppercase whitespace-pre-wrap"
                          style={{ 
                            color: slide.headlineColor || '#ffffff',
                            fontSize: slide.headlineSize ? `${Math.min(slide.headlineSize, 80)}px` : '72px'
                          }}
                        >
                            {renderHeadline(slide)}
                        </h1>
                        
                        <p 
                          className="font-medium drop-shadow-lg max-w-xl text-white/90 text-lg leading-relaxed whitespace-pre-wrap"
                          style={{ 
                            color: slide.subheadingColor || '#ffffff',
                            fontSize: slide.subheadingSize ? `${Math.min(slide.subheadingSize, 24)}px` : '20px'
                          }}
                        >
                            {slide.subheading}
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-6 pt-6 items-start sm:items-center">
                            <Button asChild size="xl" className="rounded-full bg-primary hover:bg-primary/90 text-white font-black shadow-[0_20px_50px_rgba(var(--primary),0.3)] hover:scale-105 active:scale-95 transition-all">
                                <Link href={slide.ctaLink || '/search'} className="flex items-center gap-3">
                                    {slide.ctaText || 'EXPLORE CATALOG'}
                                    <ArrowRight size={20} />
                                </Link>
                            </Button>
                        </div>

                        <div className="mt-12 flex items-center justify-start gap-3 flex-wrap">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Trending:</span>
                            {frequentSearches.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="text-[9px] font-black uppercase tracking-widest rounded-full px-4 py-2 border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all text-white/80 hover:text-white"
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
        </div>
      </div>
    </section>
  );
}
