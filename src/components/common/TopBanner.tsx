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
 * Compact Top Banner v5.0:
 * Sits in normal flow and scrolls away. 
 * Features specialized "MASHUJAA" and "OFFER!" styling.
 */
export default function TopBanner() {
  const [config, setConfig] = useState<BannerConfig>({
    items: [
      "OFFER! OFFER! OFFER! Easter Holiday OFFER",
      "Feel welcomed to Shop with us @best prices",
      "MASHUJAA DAY OFFER!"
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

  const renderRichText = (text: string) => {
    const parts = text.split(/(OFFER!|MASHUJAA)/gi);
    
    return parts.map((part, i) => {
      const lowerPart = part.toLowerCase().trim();
      
      if (lowerPart === 'offer!') {
        return (
          <span key={i} className="font-black text-[#00c389] mx-1">
            {part}
          </span>
        );
      }

      if (lowerPart === 'mashujaa') {
        return (
          <span key={i} className="inline-flex font-black tracking-tighter bg-white px-2 py-0.5 rounded-full mx-1 border border-white/20 shadow-sm scale-90">
            <span 
              style={{
                background: 'linear-gradient(to right, black 33.3%, #BB0000 33.3% 66.6%, #006600 66.6%)',
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

      return <span key={i}>{part}</span>;
    });
  };

  const getBackground = () => {
    switch(config.styleType) {
        case 'kenyan-flag': return 'bg-gradient-to-r from-red-600 via-purple-600 to-blue-600';
        case 'gold-gradient': return 'bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-800';
        case 'neon-glow': return 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600';
        default: return 'bg-gradient-to-r from-red-500 via-purple-500 to-blue-500';
    }
  };

  const marqueeItems = [...config.items, ...config.items, ...config.items];

  return (
    <div 
      className={cn(
        "text-white py-1.5 px-4 bg-[length:200%_200%] animate-gradient-x border-b border-white/5 relative z-10 w-full h-8 sm:h-9 flex items-center",
        getBackground()
      )}
      style={{ color: config.textColor }}
    >
      <div className="container mx-auto flex justify-between items-center w-full">
        
        {config.showClock && (
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            <Clock className="h-3.5 w-3.5 opacity-80" />
            <span className="text-[10px] font-bold opacity-80 whitespace-nowrap">Mon - Sat: 8:00 AM – 6:00 PM</span>
          </div>
        )}

        <div className="flex-1 inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_64px,_black_calc(100%-64px),transparent_100%)]">
          <ul 
            className="flex-1 font-bold text-center flex items-center justify-center md:justify-start [&_li]:mx-8 animate-scroll"
            style={{ animationDuration: `${config.speed}s` }}
          >
            {marqueeItems.map((item, idx) => (
              <li 
                key={idx} 
                className="whitespace-nowrap uppercase tracking-widest flex items-center"
                style={{ fontSize: `${Math.min(config.fontSize, 14)}px` }}
              >
                {renderRichText(item)}
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
               className="text-[10px] font-black uppercase tracking-tighter hover:underline"
             >
               TikTok
             </a>
          </div>
        )}
      </div>
    </div>
  );
}
