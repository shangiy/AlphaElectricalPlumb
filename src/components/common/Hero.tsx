
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
 * Dynamic Detached Hero Section v12.0
 * Features Triple Word Highlight Engine and Cloud-Synchronized Campaigns.
 */
export default function Hero() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

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

  const categoryTags = ["Water Tanks", "LED Lights", "PPR Pipes", "Solar Heaters"];

  // Show a fallback if no slides are available
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

  return (
    <section 
        className="relative w-full overflow-hidden bg-[#0a0f1e] min-h-[85vh] flex items-center transition-all duration-1000"
        style={{ 
            backgroundImage: slide.imageUrl ? `url('${slide.imageUrl}')` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }}
    >
      {/* Blueprint Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{ 
          backgroundImage: `radial-gradient(#1e293b 1px, transparent 0)`,
          backgroundSize: '30px 30px'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1e]/90 via-transparent to-[#0a0f1e]" />

      <div className="relative z-10 container mx-auto max-w-7xl px-6 py-20 md:py-32">
        <div className="flex flex-col gap-8 max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="space-y-4">
            <h1 
                className="text-5xl md:text-8xl font-black leading-[1.05] tracking-tighter uppercase"
                style={{ marginTop: `${slide.headlineTopMargin || 0}cm` }}
            >
              {(() => {
                if (!slide.headline) return null;
                const styles = slide.wordStyles || [];
                // Split by spaces but preserve them in the array to keep formatting
                const parts = slide.headline.split(/(\s+)/);
                
                return parts.map((part, i) => {
                  if (part.trim() === '') return part; // Return spaces/newlines as is
                  
                  // Match logic: remove punctuation and whitespace for comparison
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
                    <span key={i} className="text-white font-montserrat">
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

      {/* Slide Indicators if multiple */}
      {slides.length > 1 && (
          <div className="absolute bottom-10 right-10 flex gap-3 z-20">
              {slides.map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setActiveSlideIndex(i)}
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
