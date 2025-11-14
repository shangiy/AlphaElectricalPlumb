
'use client'

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { blogPosts, type BlogPost } from '@/lib/blog-data';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import React from 'react';


function BlogPostCard({ post }: { post: BlogPost }) {
  const image = PlaceHolderImages.find((img) => img.id === post.imageId);

  return (
    <article className="group relative w-full h-full">
      {image && (
          <Image
            src={image.imageUrl}
            alt={post.title}
            fill
            className="object-cover rounded-lg"
            data-ai-hint={image.imageHint}
          />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent rounded-lg"></div>
      <div className="absolute bottom-0 left-0 p-6 text-white">
        <h2 className="font-headline text-2xl font-bold mb-2">
          <Link href={`#`} className="hover:underline">
            {post.title}
          </Link>
        </h2>
        <p className="text-sm opacity-90">{post.excerpt}</p>
      </div>
    </article>
  );
}


export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'home-hero');
  const aboutImage = PlaceHolderImages.find((img) => img.id === 'about-wanjiku');

  const autoplayPlugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: false, stopOnMouseEnter: true })
  )

  return (
    <div className='overflow-x-hidden'>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center min-h-screen md:min-h-[calc(100vh-4rem)] gap-8 py-12">
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

      <div className="bg-background py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
             <div className="lg:order-last">
              {aboutImage && (
                <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden shadow-xl">
                  <Image
                    src={aboutImage.imageUrl}
                    alt={aboutImage.description}
                    fill
                    className="object-cover"
                    data-ai-hint={aboutImage.imageHint}
                  />
                </div>
              )}
            </div>
            <div className="text-lg text-foreground/80 space-y-6">
              <h2 className="font-headline text-4xl sm:text-5xl font-bold text-primary">
                This Is WANJIKU
              </h2>
              <div className="space-y-4 text-foreground/70">
                <p>
                  Wanjiku is more than a writer—she's a storyteller of the unseen. Through her words, she paints vivid landscapes of nature's beauty, channels the quiet strength of universal energy, and captures the soulful rhythms that connect us all. Her writing is a gentle invitation to pause, breathe, and rediscover the magic woven into everyday life.
                </p>
                <p>
                  Beyond the page, Wanjiku carries an effortless sense of style that mirrors her artistry—elegant, bold, and deeply authentic. Whether she is exploring the whisper of the wind through trees, reflecting on the mysteries of the soul, or curating her own timeless fashion, Wanjiku embodies creativity in every form.
                </p>
                <p>
                  Her work is not just read—it is felt.
                </p>
              </div>
               <Button asChild size="lg" className="bg-[#415443] hover:bg-[#354536] text-primary-foreground font-bold tracking-wider px-8 py-6 text-base">
                <Link href="/about">
                  Read More
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#002A1E] text-white py-16 sm:py-24">
         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-headline text-4xl sm:text-5xl font-bold mb-12">FROM MY BLOG</h2>
             <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[autoplayPlugin.current]}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {blogPosts.map((post) => (
                  <CarouselItem key={post.id} className="md:basis-1/2 lg:basis-1/3 pl-4">
                    <div className="p-1 h-[450px]">
                      <BlogPostCard post={post} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
         </div>
      </div>
    </div>
  );
}
