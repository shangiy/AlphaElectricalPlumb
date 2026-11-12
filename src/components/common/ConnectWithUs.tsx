'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { getStorefrontSetting } from '@/app/actions/cms-actions';
import { Loader2, Sparkles, Video } from 'lucide-react';
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
    tiktokVideoIds: [],
    socialLinks: [
        { platform: "tiktok", label: "FOLLOW US ON TIKTOK →", url: "https://www.tiktok.com/@AlphaElectricalsandplumb" },
        { platform: "facebook", label: "LIKE US ON FACEBOOK →", url: "https://www.facebook.com/Alphaelectricalsandplumbing" }
    ]
};

interface VideoItem {
    id: string;
    type: 'tiktok' | 'supabase';
    value: string;
}

/**
 * SocialVideoNode: Specialized sub-component to handle independent
 * hover-based audio fading for native videos.
 */
function SocialVideoNode({ item }: { item: VideoItem }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const fadeInterval = useRef<NodeJS.Timeout | null>(null);

    // Initialize volume to zero for native videos
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.volume = 0;
        }
    }, []);

    const fadeVolume = (targetVolume: number) => {
        if (!videoRef.current) return;
        const video = videoRef.current;

        // Clear any existing fade interval to prevent conflicts
        if (fadeInterval.current) clearInterval(fadeInterval.current);

        // If fading in, we must unmute first
        if (targetVolume > 0) {
            video.muted = false;
        }

        fadeInterval.current = setInterval(() => {
            const step = 0.05; // Smooth volume increments
            
            if (video.volume < targetVolume) {
                video.volume = Math.min(video.volume + step, targetVolume);
            } else if (video.volume > targetVolume) {
                video.volume = Math.max(video.volume - step, targetVolume);
            }

            // Stop if target reached
            if (video.volume === targetVolume) {
                if (fadeInterval.current) clearInterval(fadeInterval.current);
                
                // If we faded out to zero, mute for autoplay compliance
                if (targetVolume === 0) {
                    video.muted = true;
                }
            }
        }, 50); // 50ms steps for silky smooth "slowly slowly" effect
    };

    const handleMouseEnter = () => {
        if (item.type === 'supabase') {
            fadeVolume(1.0); // Fade in to optimal sound
        }
    };

    const handleMouseLeave = () => {
        if (item.type === 'supabase') {
            fadeVolume(0); // Fade out to silence
        }
    };

    return (
        <div 
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="bg-white/5 p-4 rounded-[3rem] border border-white/10 shadow-2xl hover:border-primary/40 transition-all duration-500 hover:-translate-y-4 group/video overflow-hidden aspect-[9/16] relative flex items-center justify-center w-full sm:w-[320px] shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        >
            {item.type === 'tiktok' ? (
                item.value ? (
                    <iframe
                        src={`https://www.tiktok.com/embed/v2/${item.value}?lang=en-US&fontFamily=Poppins&fontWeight=700&autoplay=1`}
                        className="w-full h-full border-none rounded-[2rem]"
                        allowFullScreen
                        loading="lazy"
                    />
                ) : (
                    <div className="flex flex-col items-center gap-4 text-white/20">
                        <Video size={48} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Awaiting TikTok ID</span>
                    </div>
                )
            ) : (
                item.value ? (
                    <video 
                        ref={videoRef}
                        src={item.value} 
                        className="w-full h-full object-cover rounded-[2rem] shadow-inner" 
                        autoPlay
                        playsInline
                        loop
                        muted // Required for autoplay; hover logic handles unmuting
                        preload="none" // Optimization: Do not preload until interaction or visibility
                        poster="/connect-bg.jpg" // Use section background as placeholder
                    />
                ) : (
                    <div className="flex flex-col items-center gap-4 text-white/20">
                        <Video size={48} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Awaiting Upload</span>
                    </div>
                )
            )}
            
            <div className="absolute bottom-6 left-6 opacity-0 group-hover/video:opacity-100 transition-opacity">
                <Badge className="bg-primary/20 backdrop-blur-md text-primary border-primary/20 font-black uppercase text-[8px] tracking-[0.2em] px-3">
                    SOCIAL MEDIA VID
                </Badge>
            </div>
        </div>
    );
}

export default function ConnectWithUs() {
  const [config, setConfig] = useState<ConnectConfig>(FALLBACK_CONFIG);
  const [videoConfig, setVideoConfig] = useState<{ items: VideoItem[] }>({ items: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
        try {
            const [social, videos] = await Promise.all([
                getStorefrontSetting('connect_with_us_config'),
                getStorefrontSetting('video_stream_config')
            ]);
            if (social && social.socialLinks) setConfig(social);
            if (videos && videos.items) setVideoConfig(videos);
        } catch (e) {
            console.error("Social data fetch failed:", e);
        } finally {
            setLoading(false);
        }
    }
    loadData();
  }, []);

  return (
    <section className="group relative h-auto w-full overflow-hidden py-24 text-white">
      {/* Animated Background Layer */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-in-out group-hover:scale-105"
        style={{ backgroundImage: "url('/connect-bg.jpg')" }}
        data-ai-hint="team background"
      ></div>
      <div className="absolute inset-0 bg-black/85 backdrop-blur-[2px]"></div>
      
      <div className="relative z-10 mx-auto flex flex-col items-center justify-center px-4 text-center container max-w-7xl">
        {loading ? (
           <div className="py-20 flex flex-col items-center gap-4">
              <Loader2 className="animate-spin text-primary h-12 w-12" />
              <p className="font-black uppercase tracking-[0.3em] text-white/40">Syncing Digital Hub...</p>
           </div>
        ) : (
          <>
              <div className="animate-in fade-in slide-in-from-top-4 duration-700 mb-16">
                  <div className="flex items-center justify-center gap-2 text-primary font-black uppercase tracking-[0.3em] mb-4">
                      <Sparkles size={16} /> Community Stream
                  </div>
                  <h2 className="text-6xl md:text-7xl font-black font-headline tracking-tighter uppercase leading-[0.8] mb-4">
                      {config.headline}
                  </h2>
                  <p className="text-xl text-white/60 font-medium tracking-tight max-w-2xl mx-auto">
                      {config.subheading}
                  </p>
              </div>

              {/* Dynamic Video Stream Grid - Centered with Interactive Audio Fading */}
              {videoConfig.items && videoConfig.items.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-12 w-full max-w-5xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                      {videoConfig.items.slice(0, 2).map((item, idx) => (
                          <SocialVideoNode key={item.id || idx} item={item} />
                      ))}
                  </div>
              )}

              <div className="flex flex-col gap-6 sm:flex-row animate-in fade-in slide-in-from-bottom-4 duration-1000">
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
