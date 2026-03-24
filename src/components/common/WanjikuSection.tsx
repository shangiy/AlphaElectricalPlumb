'use client';

import Image from 'next/image';
import Link from 'next/link';
import placeholderData from '@/app/lib/placeholder-images.json';

export default function WanjikuSection() {
  const { wanjiku_portrait } = placeholderData;

  return (
    <section className="py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-left duration-1000">
            <h2 className="text-5xl md:text-7xl font-bold font-headline leading-tight text-primary">
              This is <br /> Wanjiku
            </h2>
            <div className="w-20 h-1 bg-primary/20 rounded-full" />
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-lg">
              A quiet nook for words to grow and stories to unfold. Discover thoughts on nature, personal growth, and the art of writing.
            </p>
            <Link 
              href="/about" 
              className="inline-block px-10 py-4 bg-primary text-white rounded-full font-semibold transition-all hover:bg-accent hover:shadow-xl hover:-translate-y-1"
            >
              Read More
            </Link>
          </div>
          
          <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl animate-in fade-in slide-in-from-right duration-1000">
            <Image
              src={wanjiku_portrait.url}
              alt={wanjiku_portrait.alt}
              fill
              className="object-cover"
              data-ai-hint="wanjiku portrait"
            />
          </div>
        </div>
      </div>
    </section>
  );
}