'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { getStorefrontSetting } from '@/app/actions/cms-actions';

/**
 * Dynamic TopBanner:
 * Fetches promotional content from Supabase storefront_settings.
 * Features KENYAN style "MASHUJAA" and spooky "HALLOWEEN" text logic.
 */
export default function TopBanner() {
  const [content, setContent] = useState('OFFER! MIDYEAR FLASH SALE, MASHUJAA DAY OFFER!');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBanner() {
      try {
        // Fetch banner text from unified storefront_settings table
        const val = await getStorefrontSetting('top_banner_text');
        if (val) setContent(val);
      } catch (e) {
        console.error("Banner fetch failed", e);
      } finally {
        setLoading(false);
      }
    }
    loadBanner();
  }, []);

  const renderRichText = (text: string) => {
    // Splits text into parts, highlighting "OFFER", "MASHUJAA", and "HALLOWEEN"
    const parts = text.split(/(OFFER!|MASHUJAA|HALLOWEEN)/gi);
    
    return parts.map((part, i) => {
      const lowerPart = part.toLowerCase();
      if (lowerPart === 'offer!') {
        const colors = ['text-red-500', 'text-green-500', 'text-white'];
        return <span key={i} className={cn("font-black", colors[i % 3])}>{part} </span>;
      }
      if (lowerPart === 'mashujaa') {
        return (
          <span key={i} className="inline-flex font-black tracking-tighter drop-shadow-md bg-white px-2 rounded-sm mx-1 border border-white/20 overflow-hidden">
            <span 
              style={{
                background: 'linear-gradient(to bottom, black 33.3%, #BB0000 33.3% 66.6%, #006600 66.6%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block',
                lineHeight: '1'
              }}
            >
              MASHUJAA
            </span>
          </span>
        );
      }
      if (lowerPart === 'halloween') {
        return (
          <span key={i} className="inline-flex items-center gap-1 font-black text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)] mx-1">
            🎃 {part.toUpperCase()} 👻
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  const items = [1, 2, 3, 4, 5, 6];

  return (
    <div className={cn(
      "relative z-30 text-white py-2 px-4 h-10 md:h-12 overflow-hidden",
      "bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-[length:200%_200%] animate-gradient-x"
      )}
    >
      <div className="container mx-auto flex justify-between items-center h-full">
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">Mon - Sat: 8:00 AM – 6:00 PM</span>
        </div>

        <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)]">
            <ul className="flex-1 font-bold text-center flex items-center justify-center md:justify-start [&_li]:mx-8 animate-scroll">
                {items.map((_, index) => (
                    <li key={index} className="whitespace-nowrap text-xl md:text-3xl">
                        {renderRichText(content)}
                    </li>
                ))}
            </ul>
        </div>

        <div className="hidden md:flex items-center gap-2 justify-end flex-shrink-0">
            <Image src="/tiktok-V1.png" alt="TikTok" width={16} height={16} />
            <a href="https://www.tiktok.com/@AlphaElectricalsandplumb" target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:underline">
                Follow us
            </a>
        </div>
      </div>
    </div>
  );
}
