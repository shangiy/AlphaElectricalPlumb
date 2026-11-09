'use client';

import dynamic from 'next/dynamic';

const HeroSearch = dynamic(() => import('./HeroSearch'), {
  ssr: true,
  loading: () => <div className="h-16 w-full max-w-xl bg-white/10 animate-pulse rounded-full border border-white/5" />
});

/**
 * Detached Hero Section v11.0
 * Updated layout and font (Montserrat) to match reference image exactly.
 */
export default function Hero() {
  const categoryTags = ["Water Tanks", "LED Lights", "PPR Pipes", "Solar Heaters"];

  return (
    <section className="relative w-full overflow-hidden bg-[#0a0f1e] min-h-[75vh] flex items-center">
      {/* Blueprint Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{ 
          backgroundImage: `radial-gradient(#1e293b 1px, transparent 0)`,
          backgroundSize: '30px 30px'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1e]/80 via-transparent to-[#0a0f1e]" />

      <div className="relative z-10 container mx-auto max-w-7xl px-6 py-20 md:py-32">
        <div className="flex flex-col gap-8 max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-black font-montserrat text-white leading-[1.1] tracking-tight uppercase">
              Welcome to Alpha <br />
              Electricals & Plumbing Ltd
            </h1>
            <p className="text-xl md:text-2xl text-white font-medium tracking-tight font-montserrat opacity-90">
              Your trusted source for Tanks, Lighting, Plumbing & More
            </p>
          </div>

          {/* Action Center */}
          <div className="space-y-6 max-w-3xl">
            <HeroSearch />

            {/* Category Pill Row */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <span className="text-white font-medium font-montserrat text-sm opacity-80">Frequently searched:</span>
              <div className="flex flex-wrap gap-2">
                {categoryTags.map((tag) => (
                  <button 
                    key={tag}
                    className="px-5 py-2 rounded-full border border-white/30 text-xs font-bold text-white hover:bg-white hover:text-[#0a0f1e] transition-all active:scale-95 font-montserrat uppercase tracking-wider"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
