import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'home-hero');

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row items-center min-h-[calc(100vh-4rem)] gap-8 py-12">
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-6xl md:text-8xl font-bold font-headline text-primary tracking-tighter leading-tight">
            WATKINS
          </h1>
          <p className="mt-4 text-lg md:text-xl text-foreground/80 max-w-md mx-auto md:mx-0">
            A quiet nook for words to grow and stories to unfold. Discover thoughts on nature, personal growth, and the art of writing.
          </p>
          <div className="mt-8 flex gap-4 justify-center md:justify-start">
            <Button asChild size="lg" className="font-bold">
              <Link href="/my-blog">
                Read The Blog
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="font-bold">
              <Link href="/about">
                About Me
              </Link>
            </Button>
          </div>
        </div>
        <div className="md:w-1/2 w-full mt-8 md:mt-0">
          {heroImage && (
            <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden shadow-2xl">
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover"
                data-ai-hint={heroImage.imageHint}
                priority
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
