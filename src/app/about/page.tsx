import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function AboutPage() {
  const aboutImage = PlaceHolderImages.find((img) => img.id === 'about-wanjiku');

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
              This is WANJIKU
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
          </div>
        </div>
      </div>
    </div>
  );
}
