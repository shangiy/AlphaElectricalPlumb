'use client';

import { useState, useEffect } from 'react';
import { getStorefrontSetting } from '@/app/actions/cms-actions';
import { cn } from '@/lib/utils';

export default function HomepageAbout() {
  const [content, setAboutContent] = useState({ text: '', alignment: 'center', fontSize: 'lg' });

  useEffect(() => {
    async function loadAbout() {
        const data = await getStorefrontSetting('about_us_content');
        if (data) setAboutContent(data);
    }
    loadAbout();
  }, []);

  const defaultText = "Alpha Electricals & Plumbing Ltd is committed to providing quality tanks, plumbing equipment, lighting, décor, and construction products across the region. Our platform serves as a resourceful destination for homeowners, contractors, and businesses seeking expert advice, innovative products, and reliable services.";

  return (
    <section className="bg-background py-32 border-y">
      <div className={cn(
          "container mx-auto px-4 max-w-5xl",
          content.alignment === 'center' ? 'text-center' : content.alignment === 'right' ? 'text-right' : 'text-left'
      )}>
        <h2 className="text-5xl font-black font-headline mb-10 text-accent tracking-tighter uppercase">Our Story</h2>
        <div className={cn(
            "space-y-6 text-muted-foreground font-medium leading-relaxed",
            content.fontSize === 'xl' ? 'text-2xl' : content.fontSize === 'lg' ? 'text-xl' : content.fontSize === 'sm' ? 'text-sm' : 'text-base'
        )}>
            {content.text ? (
                content.text.split('\n').map((para, i) => <p key={i}>{para}</p>)
            ) : (
                <p>{defaultText}</p>
            )}
        </div>
        <div className={cn(
            "w-32 h-2 bg-primary/20 rounded-full mt-12",
            content.alignment === 'center' ? 'mx-auto' : content.alignment === 'right' ? 'ml-auto' : 'mr-auto'
        )} />
      </div>
    </section>
  );
}
