'use client';

import React, { useEffect, useState } from 'react';
import { getStorefrontSetting } from '@/app/actions/cms-actions';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';
import Image from 'next/image';

interface BannerConfig {
    items: string[];
    speed: number;
    fontSize: number;
    textColor: string;
    styleType: string;
    showClock: boolean;
    showSocial: boolean;
}

/**
 * Compact Independent Top Banner v8.0:
 * Sits in the normal flow at the top of the DOM. 
 * Updated with primary teal hover state for social links.
 */
export default function TopBanner() {
  const [config, setConfig] = useState<BannerConfig>({
    items: [
      "⚡ EASTER HOLIDAY OFFER! BEST PRICES GUARANTEED",
      "Feel welcomed to Shop with us @best prices",
      "MASHUJAA DAY SPECIAL DISCOUNTS ACTIVE"
    ],
    speed: 30,
    fontSize: 12,
    textColor: '#ffffff',
    styleType: 'kenyan-flag',
    showClock: true,
    showSocial: true
  });

  useEffect(() => {
    async function loadConfig() {
      const data = await getStorefrontSetting('top_banner_config');
      if (data) {
          setConfig(prev => ({ ...prev, ...data }));
      }
    }
    loadConfig();
  }, []);

  const getBackground = () => {
    switch(config.styleType) {
        case 'kenyan-flag': return 'from-red-500 via-purple-500 to-blue-500';
        case 'gold-gradient': return 'from-yellow-600 via-amber-500 to-yellow-800';
        case 'neon-glow': return 'from-cyan-600 via-blue-600 to-indigo-600';
        default: return 'from-red-500 via-purple-500 to-blue-500';
    }
  };

  const marqueeItems = [...config.items, ...config.items, ...config.items];

  return (
    <div 
      className={cn(
        "w-full text-white py-1.5 px-4 bg-gradient-to-r bg-[length:200%_200%] animate-gradient-x border-b border-white/5",
        getBackground()
      )}
      style={{ color: config.textColor }}
    >
      <div className="container mx-auto flex justify-between items-center h-5">
        
        {config.showClock && (
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            <Clock className="h-3.5 w-3.5 opacity-80" />
            <span className="text-[10px] whitespace-nowrap font-bold">Mon - Sat: 8:00 AM – 6:00 PM</span>
          </div>
        )}

        <div className="flex-1 inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_64px,_black_calc(100%-64px),transparent_100%)]">
          <ul 
            className="flex-1 font-black text-center flex items-center justify-center md:justify-start [&_li]:mx-12 animate-scroll"
            style={{ animationDuration: `${config.speed}s` }}
          >
            {marqueeItems.map((item, idx) => (
              <li 
                key={idx} 
                className="whitespace-nowrap uppercase tracking-widest flex items-center gap-4"
                style={{ fontSize: `${Math.min(config.fontSize, 14)}px` }}
              >
                {item.includes('MASHUJAA') ? (
                    <span className="bg-white rounded-full px-4 py-0.5 font-black text-black shadow-lg">
                        {item}
                    </span>
                ) : item}
              </li>
            ))}
          </ul>
        </div>

        {config.showSocial && (
          <div className="hidden md:flex items-center gap-2 justify-end flex-shrink-0">
             <div className="relative h-4 w-4">
                <Image src="/tiktok-V1.png" alt="TikTok" fill className="object-contain" />
             </div>
             <a 
               href="https://www.tiktok.com/@AlphaElectricalsandplumb" 
               target="_blank" 
               rel="noopener noreferrer" 
               className="text-[10px] font-black uppercase tracking-tighter hover:text-primary transition-colors hover:underline"
             >
               TikTok @AlphaElectricalsandplumb
             </a>
          </div>
        )}
      </div>
    </div>
  );
}
