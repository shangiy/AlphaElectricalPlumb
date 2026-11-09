'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { getHeroSlides, type HeroSlide } from '@/app/actions/cms-actions';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const HeroSearch = dynamic(() => import('./HeroSearch'), {
  ssr: true,
  loading: () => <div className="h-16 w-full max-w-xl bg-white/10 animate-pulse rounded-full border border-white/5" />
});

/**
 * Dynamic Detached Hero Section v13.0
 * Features Background Carousels and Multi-Campaign Auto-Play.
 */
export default function Hero() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [bgImageIndex, setBgImageIndex] = useState(0);

  useEffect(() => {
    async function loadCampaigns() {
        try {
            const data = await getHeroSlides();
            const active = data.filter(s => s.active).sort((a, b) => (a.order || 0) - (b.order || 0));
            setSlides(active);
        } catch (e) {
            console.error("Hero sync failed:", e);
        } finally {
            setLoading(false);
        }
    }
    loadCampaigns();
  }, []);

  // GLOBAL AUTO-PLAY: Cycles between campaigns
  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % slides.length);
      setBgImageIndex(0); // Reset background when sliding to new campaign
    }, 8000); // Cycle every 8 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

  // INTERNAL BACKGROUND CAROUSEL: Cycles backgrounds within a single slide
  useEffect(() => {
    const currentSlide = slides[activeSlideIndex];
    const bgImages = currentSlide?.imageUrls || (currentSlide?.imageUrl ? [currentSlide.imageUrl] : []);
    
    if (bgImages.length <= 1) {
        setBgImageIndex(0);
        return;
    }

    const interval = setInterval(() => {
      setBgImageIndex((prev) => (prev + 1) % bgImages.length);
    }, 5000); // Internal bg cycle every 5 seconds

    return () => clearInterval(interval);
  }, [activeSlideIndex, slides]);

  const categoryTags = ["Water Tanks", "LED Lights", "PPR Pipes", "Solar Heaters"];

  if (loading || slides.length === 0) {
      return (
        <section className="relative w-full overflow-hidden bg-[#0a0f1e] min-h-[75vh] flex items-center">
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: `radial-gradient(#1e293b 1px, transparent 0)`, backgroundSize: '30px 30px' }} />
            <div className="relative z-10 container mx-auto px-6 py-20">
                <div className="space-y-6 animate-pulse">
                    <div className="h-20 w-3/4 bg-white/10 rounded-2xl" />
                    <div className="h-10 w-1/2 bg-white/10 rounded-xl" />
                    <div className="h-16 w-full max-w-xl bg-white/10 rounded-full" />
                </div>
            </div>
        </section>
      );
  }

  const slide = slides[activeSlideIndex];
  const bgImages = slide.imageUrls || (slide.imageUrl ? [slide.imageUrl] : []);

  return (
    <section className="relative w-full overflow-hidden bg-[#0a0f1e] min-h-[85vh] flex items-center transition-all duration-1000">
      
      {/* Dynamic Background Layer (Carousel Support) */}
      <div className="absolute inset-0 z-0">
          {bgImages.map((url, idx) => (
              <div 
                  key={`${url}-${idx}`}
                  className={cn(
                      "absolute inset-0 bg-cover bg-center transition-all duration-[2000ms] ease-in-out transform",
                      idx === bgImageIndex ? "opacity-100 scale-100" : "opacity-0 scale-110"
                  )}
                  style={{ backgroundImage: `url('${url}')` }}
              />
          ))}
      </div>

      {/* Blueprint Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none z-10"
        style={{ 
          backgroundImage: `radial-gradient(#1e293b 1px, transparent 0)`,
          backgroundSize: '30px 30px'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1e]/90 via-transparent to-[#0a0f1e] z-10" />

      <div className="relative z-20 container mx-auto max-w-7xl px-6 py-20 md:py-32">
        <div className="flex flex-col gap-8 max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="space-y-4">
            <h1 
                className={cn("leading-[1.05] tracking-tighter break-words whitespace-pre-wrap", slide.headlineWeight || 'font-black')}
                style={{ 
                    marginTop: `${slide.headlineTopMargin || 0}cm`,
                    fontSize: slide.headlineSize ? `${slide.headlineSize}px` : undefined
                }}
            >
              {(() => {
                if (!slide.headline) return null;
                const styles = slide.wordStyles || [];
                const parts = slide.headline.split(/(\s+)/);
                
                return parts.map((part, i) => {
                  if (part.trim() === '') return part; 
                  const cleanPart = part.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").toLowerCase().trim();
                  if (!cleanPart) return part;
                  const match = styles.find(s => s.text && s.text.toLowerCase().trim() === cleanPart);
                  
                  if (match) {
                    return (
                      <span key={i} className={cn(match.font)} style={{ color: match.color }}>
                        {part}
                      </span>
                    );
                  }
                  
                  return (
                    <span key={i} className="text-white">
                      {part}
                    </span>
                  );
                });
              })()}
            </h1>
            <p 
                className="text-xl md:text-3xl text-white font-medium tracking-tight font-montserrat opacity-90 leading-relaxed"
                style={{ 
                    color: slide.subheadingColor || '#ffffff', 
                    fontSize: slide.subheadingSize ? `${slide.subheadingSize}px` : undefined,
                    marginTop: `${slide.subheadingTopMargin || 0}cm`
                }}
            >
              {slide.subheading}
            </p>
          </div>

          {/* Action Center */}
          <div className="space-y-8 max-w-3xl">
            <HeroSearch />

            <div className="flex items-center gap-6">
                <Button asChild size="lg" className="rounded-full px-12 py-8 bg-primary hover:scale-105 transition-transform font-black uppercase tracking-widest text-lg shadow-2xl">
                    <Link href={slide.ctaLink || '/search'}>{slide.ctaText || 'Shop Now'}</Link>
                </Button>
                
                {/* Category Pill Row */}
                <div className="hidden md:flex flex-wrap items-center gap-4">
                    <span className="text-white font-medium font-montserrat text-sm opacity-60">Popular:</span>
                    <div className="flex flex-wrap gap-2">
                        {categoryTags.map((tag) => (
                        <button 
                            key={tag}
                            className="px-4 py-1.5 rounded-full border border-white/20 text-[10px] font-black text-white/70 hover:bg-white hover:text-[#0a0f1e] transition-all active:scale-95 font-montserrat uppercase tracking-wider"
                        >
                            {tag}
                        </button>
                        ))}
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      {slides.length > 1 && (
          <div className="absolute bottom-10 right-10 flex gap-3 z-30">
              {slides.map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => {
                        setActiveSlideIndex(i);
                        setBgImageIndex(0);
                    }}
                    className={cn(
                        "h-1.5 rounded-full transition-all duration-500",
                        activeSlideIndex === i ? "bg-primary w-12" : "bg-white/20 w-4 hover:bg-white/40"
                    )}
                  />
              ))}
          </div>
      )}
    </section>
  );
}
