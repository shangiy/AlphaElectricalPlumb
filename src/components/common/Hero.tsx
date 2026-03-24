
import Image from 'next/image';
import Link from 'next/link';
import HeroSearch from './HeroSearch';

export default function Hero() {
  const frequentSearches = [
    { name: 'Water Tanks', href: '/tanks' },
    { name: 'LED Lights', href: '/decor' },
    { name: 'PPR Pipes', href: '/plumbing' },
    { name: 'Solar Heaters', href: '/plumbing' },
  ];
  return (
    <section className="relative h-[70vh] md:h-[85vh] w-full flex items-center justify-start text-white -mt-24">
      <Image
        src="/background.jpg"
        alt="Hero background image"
        fill
        className="object-cover -z-10"
        data-ai-hint="store background"
        priority
      />
      <div className="absolute inset-0 bg-black/60 -z-10" />
      <div className="container mx-auto px-4 text-left mt-24">
        <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4 max-w-3xl">
          Welcome to Alpha Electricals & Plumbing Ltd
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mb-8">
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
