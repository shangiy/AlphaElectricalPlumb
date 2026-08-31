
'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import placeholderData from '@/app/lib/placeholder-images.json';

// Dynamically import HeroSearch to reduce the size of the initial page chunk
const HeroSearch = dynamic(() => import('./HeroSearch'), {
  ssr: true,
  loading: () => <div className="h-14 w-full max-w-2xl bg-white/20 animate-pulse rounded-full shadow-md border border-white/10" />
});

export default function Hero() {
  const { hero_roofing } = placeholderData;

  const frequentSearches = [
    { name: 'Water Tanks', href: '/tanks' },
    { name: 'LED Lights', href: '/decor' },
    { name: 'PPR Pipes', href: '/plumbing' },
    { name: 'Solar Heaters', href: '/plumbing' },
  ];
  
  return (
    <section className="relative h-[70vh] md:h-[85vh] w-full flex items-center justify-start text-white -mt-24">
      <Image
        src={hero_roofing.url}
        alt={hero_roofing.alt}
        fill
        className="object-cover -z-10"
        data-ai-hint="roofing sheets"
        priority
      />
      <div className="absolute inset-0 bg-black/50 -z-10" />
      <div className="container mx-auto px-4 text-left mt-24">
        <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4 max-w-3xl text-white drop-shadow-lg">
          Welcome to Alpha Electricals & Plumbing Ltd
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mb-8 text-white/90 drop-shadow-md">
          Your trusted source for Tanks, Lighting, Plumbing & More
        </p>

        <div className="mb-6">
          <HeroSearch />
        </div>
        
        <div className="mt-6 flex items-center justify-start gap-2 md:gap-4 flex-wrap">
          <span className="text-sm font-medium">Frequently searched:</span>
          {frequentSearches.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm rounded-full px-3 py-1 border border-white/50 bg-white/10 hover:bg-white/20 transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
