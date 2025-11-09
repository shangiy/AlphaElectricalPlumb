import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function AboutPage() {
  const aboutImage = PlaceHolderImages.find((img) => img.id === 'about-portrait');

  return (
    <div className="relative overflow-hidden bg-background py-16 sm:py-24">
       <div
        aria-hidden="true"
        className="absolute inset-0 select-none pointer-events-none"
      >
        <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-[20vw] md:text-[15vw] font-extrabold text-primary/5 tracking-tighter font-headline">
              ABOUT
            </h1>
        </div>
      </div>
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div className="relative aspect-[3/4] w-full max-w-md mx-auto lg:max-w-none lg:w-full rounded-lg overflow-hidden shadow-xl">
            {aboutImage && (
              <Image
                src={aboutImage.imageUrl}
                alt={aboutImage.description}
                fill
                className="object-cover"
                data-ai-hint={aboutImage.imageHint}
              />
            )}
          </div>
          <div className="text-lg text-foreground/80 space-y-6">
            <h2 className="font-headline text-4xl sm:text-5xl font-bold text-primary">
              I'm a writer, observer, and lifelong learner.
            </h2>
            <p>
              Welcome to my little corner of the internet. My name is Watkins, and I find solace in the rustle of leaves, the quiet wisdom of ancient trees, and the stories they whisper. Writing has always been my way of making sense of the world and my place within it.
            </p>
            <p>
              This blog is an extension of my personal journal—a place where I explore the intersection of nature's rhythms and the journey of personal growth. I believe that by paying closer attention to the world around us, we can learn to better understand the world within us.
            </p>
            <p>
              Through my posts, I hope to share observations, reflections, and moments of clarity that might inspire you to find your own connection with nature and self. Thank you for being here and sharing in this journey.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
