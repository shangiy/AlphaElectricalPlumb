'use client';
import Image from 'next/image';
import Link from 'next/link';
import { blogPosts, type BlogPost } from '@/lib/blog-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "@/components/ui/carousel";
import { useEffect, useState } from 'react';

export default function BlogPage() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
 
  useEffect(() => {
    if (!api) {
      return
    }
 
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)
 
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  const handleDotClick = (index: number) => {
    api?.scrollTo(index);
  }

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full">
         <div className="absolute top-0 left-0 w-3/4 h-full bg-[#002A1E]"></div>
         <div className="absolute top-0 right-0 w-1/4 h-full bg-white"></div>
      </div>
      
      <div className="relative flex flex-col justify-center min-h-screen z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Carousel setApi={setApi} className="w-full">
              <CarouselContent>
                {blogPosts.map((post) => {
                    const image = PlaceHolderImages.find((img) => img.id === post.imageId);
                    return(
                      <CarouselItem key={post.id}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
                          <div className="text-white">
                            <p className="text-sm opacity-70 mb-2">{post.date}</p>
                            <h1 className="font-headline text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                              {post.title}
                            </h1>
                            <p className="mb-6 opacity-90 leading-relaxed">
                              {post.excerpt}
                            </p>
                            <Button asChild variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-[#002A1E] font-bold">
                              <Link href={`#`}>
                                Read Article
                              </Link>
                            </Button>
                          </div>
                           <div className="w-full aspect-[4/3] relative rounded-lg overflow-hidden">
                             {image && (
                                <Image
                                  src={image.imageUrl}
                                  alt={post.title}
                                  fill
                                  className="object-cover"
                                  data-ai-hint={image.imageHint}
                                />
                              )}
                           </div>
                        </div>
                      </CarouselItem>
                    )
                  })}
              </CarouselContent>
            </Carousel>

            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: count }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleDotClick(i)}
                  className={`h-3 w-3 rounded-full transition-colors ${
                    i === current - 1 ? 'bg-white' : 'bg-gray-500 hover:bg-gray-400'
                  }`}
                >
                   <span className="sr-only">Go to slide {i + 1}</span>
                </button>
              ))}
            </div>
        </div>
      </div>
    </div>
  );
}
