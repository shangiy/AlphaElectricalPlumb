import Image from 'next/image';
import Link from 'next/link';
import { blogPosts, type BlogPost } from '@/lib/blog-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import InspirationPrompt from '@/components/blog/InspirationPrompt';

function BlogPostCard({ post }: { post: BlogPost }) {
  const image = PlaceHolderImages.find((img) => img.id === post.imageId);

  return (
    <article className="group grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-center border-b pb-8 last:border-b-0 last:pb-0">
      <div className="md:col-span-1 w-full">
        {image && (
          <Link href={`#`} className="block relative aspect-[4/3] w-full rounded-lg overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-105">
            <Image
              src={image.imageUrl}
              alt={post.title}
              fill
              className="object-cover"
              data-ai-hint={image.imageHint}
            />
          </Link>
        )}
      </div>
      <div className="md:col-span-2">
        <p className="text-sm text-foreground/60 mb-2">{post.date}</p>
        <h2 className="font-headline text-3xl font-bold text-primary mb-3">
          <Link href={`#`} className="hover:underline">
            {post.title}
          </Link>
        </h2>
        <p className="text-foreground/80 leading-relaxed mb-4">{post.excerpt}</p>
        <Button asChild variant="link" className="px-0 font-bold text-primary">
          <Link href={`#`}>
            Read More <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </article>
  );
}

export default function BlogPage() {
  return (
    <div className="bg-background py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16">
          <h1 className="font-headline text-5xl md:text-6xl font-bold text-primary tracking-tight">
            My Blog
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/70">
            A collection of thoughts, stories, and musings on life and nature.
          </p>
        </header>

        <InspirationPrompt />

        <div className="space-y-12">
          {blogPosts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
