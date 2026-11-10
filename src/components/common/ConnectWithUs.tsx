'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getStorefrontSetting } from '@/app/actions/cms-actions';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SocialLink {
    platform: string;
    label: string;
    url: string;
}

interface ConnectConfig {
    headline: string;
    subheading: string;
    tiktokVideoIds: string[];
    socialLinks: SocialLink[];
}

const FALLBACK_CONFIG: ConnectConfig = {
    headline: "Connect with us!",
    subheading: "As You Enquire or make purchases",
    tiktokVideoIds: ["7506475821771640070", "7496094826002222342"],
    socialLinks: [
        { platform: "tiktok", label: "FOLLOW US ON TIKTOK →", url: "https://www.tiktok.com/@AlphaElectricalsandplumb" },
        { platform: "facebook", label: "LIKE US ON FACEBOOK →", url: "https://www.facebook.com/Alphaelectricalsandplumbing" }
    ]
};

export default function ConnectWithUs() {
  const [config, setConfig] = useState<ConnectConfig>(FALLBACK_CONFIG);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSocialSettings() {
        try {
            const data = await getStorefrontSetting('connect_with_us_config');
            if (data && data.socialLinks) {
                setConfig(data);
            }
        } catch (e) {
            console.error("Social hub fetch failed:", e);
        } finally {
            setLoading(false);
        }
    }
    loadSocialSettings();
  }, []);

  return (
    <section className="group relative h-auto w-full overflow-hidden py-24 text-white">
      {/* Animated Background Layer */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-in-out group-hover:scale-105"
        style={{ backgroundImage: "url('/connect-bg.jpg')" }}
        data-ai-hint="team background"
      ></div>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px]"></div>
      
      <div className="relative z-10 mx-auto flex flex-col items-center justify-center px-4 text-center container max-w-6xl">
        {loading ? (
           <div className="py-20 flex flex-col items-center gap-4">
              <Loader2 className="animate-spin text-primary h-12 w-12" />
              <p className="font-black uppercase tracking-[0.3em] text-white/40">Syncing Social Node...</p>
           </div>
        ) : (
          <>
              <div className="animate-in fade-in slide-in-from-top-4 duration-700">
                  <h2 className="text-6xl font-black font-headline tracking-tighter uppercase leading-[0.8] mb-4">
                      {config.headline}
                  </h2>
                  <p className="text-xl text-white/60 font-medium tracking-tight">
                      {config.subheading}
                  </p>
              </div>

              <div className="mt-20 flex flex-col gap-6 sm:flex-row animate-in fade-in slide-in-from-bottom-4 duration-1000">
                  {config.socialLinks.map((link, idx) => (
                      <Button 
                          key={idx}
                          asChild 
                          size="lg" 
                          className={cn(
                              "h-16 px-10 rounded-full font-black uppercase tracking-widest text-lg transition-all hover:scale-110 shadow-2xl",
                              link.platform === 'tiktok' ? "bg-[#00f2ea] text-black hover:bg-[#00f2ea]/80" : "bg-[#1877f2] text-white hover:bg-[#1877f2]/80"
                          )}
                      >
                          <Link href={link.url} target="_blank">
                              {link.label}
                          </Link>
                      </Button>
                  ))}
              </div>
          </>
        )}
      </div>
    </section>
  );
}
