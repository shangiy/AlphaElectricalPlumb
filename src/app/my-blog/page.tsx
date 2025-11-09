'use client';
import Image from 'next/image';
import Link from 'next/link';
import { blogPosts, type BlogPost } from '@/lib/blog-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Sparkles, Leaf, Hanger } from 'lucide-react';
import { cn } from '@/lib/utils';


// A custom hanger icon as it's not in Lucide
const HangerIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M14.5 9.5a2.5 2.5 0 1 1-5 0" />
    <path d="M4 9.5h16" />
    <path d="M4 9.5L2 18" />
    <path d="M20 9.5L22 18" />
    <path d="M12 14v-4.5" />
    <path d="M12 14a4 4 0 0 0-4 4v2" />
    <path d="M12 14a4 4 0 0 1 4 4v2" />
  </svg>
);


const iconMap: { [key: string]: React.ElementType } = {
  'blog-post-1': Sparkles,
  'blog-post-2': Leaf,
  'blog-post-3': HangerIcon,
};


const NewBlogPostCard = ({ post }: { post: BlogPost }) => {
  const image = PlaceHolderImages.find((img) => img.id === post.imageId);
  const Icon = iconMap[post.imageId] || Sparkles;

  const isDarkCard = post.imageId === 'blog-post-1';

  return (
    <div className={cn("flex flex-col h-full rounded-lg overflow-hidden shadow-lg", isDarkCard ? 'bg-[#1a1a1a] text-white' : 'bg-[#F1F1F1] text-black')}>
      <div className="p-6 flex-grow">
        <div className="flex items-start gap-3 mb-3">
           <Icon className={cn("w-5 h-5 mt-1 shrink-0", isDarkCard ? 'text-yellow-400' : 'text-green-600')} />
           <h3 className="font-headline text-xl font-semibold leading-tight">{post.title}</h3>
        </div>
        <p className="text-sm leading-relaxed opacity-80 pl-8">
          {post.excerpt}
        </p>
      </div>

      {image && (
        <div className="relative h-48 w-full mt-auto">
          <Image
            src={image.imageUrl}
            alt={post.title}
            fill
            className="object-cover"
            data-ai-hint={image.imageHint}
          />
        </div>
      )}

      <div className={cn("p-6 pt-4", isDarkCard ? 'bg-[#002A1E]' : 'bg-[#002A1E]')}>
        <Link href="#" className="font-semibold text-white hover:underline text-sm tracking-wide">
          Read
        </Link>
      </div>
    </div>
  );
};


export default function BlogPage() {
  return (
    <div className="bg-white min-h-screen py-16 sm:py-24 px-4">
      <div className="container mx-auto bg-[#002A1E] rounded-3xl p-8 sm:p-12 lg:p-16 relative">
        <h2 className="font-headline text-3xl font-bold text-white mb-8 tracking-wider">
          FROM MY BLOG
        </h2>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {blogPosts.slice(0, 3).map((post) => (
              <CarouselItem key={post.id} className="md:basis-1/2 lg:basis-1/3 pl-4">
                <div className="h-[28rem] p-1">
                  <NewBlogPostCard post={post} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-[-20px] sm:left-[-50px] top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black border-none" />
          <CarouselNext className="absolute right-[-20px] sm:right-[-50px] top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black border-none" />
        </Carousel>
      </div>
    </div>
  );
}
