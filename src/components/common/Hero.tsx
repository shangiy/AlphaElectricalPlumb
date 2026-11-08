'use client';

import dynamic from 'next/dynamic';

const HeroSearch = dynamic(() => import('./HeroSearch'), {
  ssr: true,
  loading: () => <div className="h-16 w-full max-w-xl bg-white/10 animate-pulse rounded-full border border-white/5" />
});

/**
 * Detached Hero Section v8.2
 * Refined positioning to ensure it scrolls BEHIND the sticky header.
 * - Structure: Independent block that detaches from header overlay.
 * - Margins: max-w-7xl mx-auto px-6 py-20 to provide professional safe-zones.
 */
export default function Hero() {
  const categoryTags = ["Water Tanks", "LED Lights", "PPR Pipes", "Solar Heaters", "Chandeliers", "Sockets"];

  return (
    <section className="relative w-full overflow-hidden bg-[#0a0f1e] min-h-[70vh] flex items-center">
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
        <div className="flex flex-col gap-10 max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-black font-headline text-white leading-[0.9] tracking-tighter uppercase">
              Welcome to Alpha <br />
              <span className="text-[#EC4899]">Electricals</span> & <br />
              Plumbing Ltd
            </h1>
            <p className="text-lg md:text-xl text-slate-400 font-bold tracking-tight max-w-2xl mt-6">
              East Africa's premier hub for industrial hardware, smart electrical systems, and professional plumbing infrastructure.
            </p>
          </div>

          {/* Action Center - side-by-side cluster within safe zones */}
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-2xl">
              <HeroSearch />
              <button className="h-16 px-10 rounded-full bg-primary text-white font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all">
                Explore
              </button>
            </div>

            {/* Category Pill Row */}
            <div className="flex flex-wrap gap-2 pt-2">
              {categoryTags.map((tag) => (
                <button 
                  key={tag}
                  className="px-4 py-1.5 rounded-full bg-slate-800/50 border border-slate-700/50 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-purple-600 hover:text-white hover:border-purple-500 transition-all active:scale-95"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
