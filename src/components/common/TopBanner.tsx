'use client';

import React, { useEffect, useState } from 'react';
import { getStorefrontSetting } from '@/app/actions/cms-actions';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';
import Image from 'next/image';

interface HighlighterRule {
    word: string;
    colors: string[];
}

interface BannerConfig {
    items: string[];
    speed: number;
    fontSize: number;
    textColor: string;
    styleType: string;
    styleOrientation?: string;
    showClock: boolean;
    showSocial: boolean;
    highlighters?: HighlighterRule[];
    badgeText?: string;
    halloweenText?: string;
    halloweenStyleType?: string;
    halloweenOrientation?: string;
    halloweenTextStyle?: string;
}

/**
 * High-Fidelity Independent Top Banner v13.0:
 * Integrated Secondary Event Badge (Halloween Text) and Typography Engine.
 */
export default function TopBanner() {
  const [config, setConfig] = useState<BannerConfig>({
    items: [
      "EASTER HOLIDAY OFFER! BEST PRICES GUARANTEED",
      "Welcome to Alpha Electricals & Plumbing Ltd",
      "MASHUJAA DAY SPECIAL DISCOUNTS ACTIVE"
    ],
    speed: 30,
    fontSize: 12,
    textColor: '#ffffff',
    styleType: 'kenyan-flag',
    styleOrientation: 'horizontal',
    showClock: true,
    showSocial: true,
    highlighters: [],
    badgeText: '',
    halloweenText: '',
    halloweenStyleType: 'fire-emoji',
    halloweenOrientation: 'horizontal',
    halloweenTextStyle: 'normal'
  });

  useEffect(() => {
    async function loadConfig() {
      try {
        const data = await getStorefrontSetting('top_banner_config');
        if (data && data.items && Array.isArray(data.items)) {
            setConfig(prev => ({ ...prev, ...data }));
        }
      } catch (e) {
        console.error("TopBanner sync failed", e);
      }
    }
    loadConfig();
  }, []);

  const getBackgroundColors = (styleType: string) => {
    switch(styleType) {
        case 'kenyan-flag': return 'from-black via-red-600 to-green-600';
        case 'gold-gradient': return 'from-yellow-600 via-amber-500 to-yellow-800';
        case 'neon-glow': return 'from-cyan-600 via-blue-600 to-indigo-600';
        case 'fire-emoji': return 'from-orange-600 via-red-600 to-yellow-500';
        default: return 'from-red-500 via-purple-500 to-blue-500';
    }
  };

  const getOrientationClass = (orientation: string) => {
    if (orientation === 'text-clip') return 'bg-transparent';
    
    switch(orientation) {
        case 'vertical': return 'bg-gradient-to-b';
        case 'diagonal': return 'bg-gradient-to-br';
        default: return 'bg-gradient-to-r';
    }
  };

  const renderHighlightedText = (text: string) => {
    const rules = (config.highlighters || []).filter(r => r.word && r.word.trim().length > 0);
    if (rules.length === 0) return text;

    const regex = new RegExp(`(${rules.map(r => r.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
    const parts = text.split(regex);
    
    const occurrenceCounters: Record<string, number> = {};

    return parts.map((part, i) => {
        const lowerPart = part.toLowerCase();
        const matchingRule = rules.find(r => r.word.toLowerCase() === lowerPart);
        
        if (matchingRule) {
            const count = occurrenceCounters[lowerPart] || 0;
            occurrenceCounters[lowerPart] = count + 1;
            
            const color = matchingRule.colors[count % matchingRule.colors.length] || '#00808d';

            return (
                <span 
                    key={i} 
                    className="rounded-lg px-2 py-0.5 font-black shadow-lg mx-1 inline-block transform -skew-x-6 text-white"
                    style={{ backgroundColor: color }}
                >
                    {part}
                </span>
            );
        }
        return <span key={i}>{part}</span>;
    });
  };

  const marqueeItems = config.items.length > 0 ? [...config.items, ...config.items, ...config.items] : [];

  if (marqueeItems.length === 0) return null;

  return (
    <div 
      className={cn(
        "w-full text-white py-1.5 px-4 bg-[length:200%_200%] animate-gradient-x border-b border-white/5 overflow-hidden",
        getOrientationClass(config.styleOrientation || 'horizontal'),
        config.styleOrientation !== 'text-clip' && getBackgroundColors(config.styleType)
      )}
      style={{ color: config.textColor }}
    >
      <div className="container mx-auto flex justify-between items-center h-5">
        
        {config.showClock && (
          <div className="hidden md:flex items-center gap-2 flex-shrink-0 z-10">
            <Clock className="h-3.5 w-3.5 opacity-80" />
            <span className="text-[10px] whitespace-nowrap font-bold">Mon - Sat: 8:00 AM – 6:00 PM</span>
          </div>
        )}

        <div className="flex-1 inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_64px,_black_calc(100%-64px),transparent_100%)]">
          <ul 
            className="flex-1 font-black text-center flex items-center justify-center md:justify-start [&_li]:mx-12 animate-scroll whitespace-nowrap"
            style={{ animationDuration: `${config.speed}s` }}
          >
            {marqueeItems.map((item, idx) => {
              const isClipped = config.styleOrientation === 'text-clip';

              return (
                <li 
                    key={idx} 
                    className={cn(
                        "flex items-center uppercase tracking-widest",
                        isClipped && cn("bg-gradient-to-r bg-clip-text text-transparent animate-gradient-x bg-[length:200%_200%]", getBackgroundColors(config.styleType))
                    )}
                    style={{ 
                        fontSize: `${Math.min(config.fontSize, 14)}px`,
                        color: isClipped ? 'transparent' : undefined
                    }}
                >
                    {config.badgeText && (
                        <span className="px-3 py-1 rounded-full bg-white mr-4 shadow-lg transform -skew-x-6 flex-shrink-0">
                            <span className={cn(
                                "font-black bg-clip-text text-transparent animate-gradient-x bg-[length:200%_200%]",
                                "bg-gradient-to-r", 
                                getBackgroundColors(config.styleType)
                            )}>
                                {config.badgeText}
                            </span>
                        </span>
                    )}
                    {config.halloweenText && (
                        <span className="px-3 py-1 rounded-full bg-white mr-4 shadow-lg transform -skew-x-6 flex-shrink-0">
                            <span className={cn(
                                "font-black bg-clip-text text-transparent animate-gradient-x bg-[length:200%_200%]",
                                "bg-gradient-to-r", 
                                getBackgroundColors(config.halloweenStyleType || 'fire-emoji'),
                                config.halloweenTextStyle === 'italic' && 'italic',
                                config.halloweenTextStyle === 'bold' && 'font-bold',
                                config.halloweenTextStyle === 'underline' && 'underline',
                                config.halloweenTextStyle === 'line-through' && 'line-through'
                            )}>
                                {config.halloweenText}
                            </span>
                        </span>
                    )}
                    {renderHighlightedText(item)}
                </li>
              );
            })}
          </ul>
        </div>

        {config.showSocial && (
          <div className="hidden md:flex items-center gap-2 justify-end flex-shrink-0 z-10">
             <div className="relative h-4 w-4">
                <Image src="/tiktok-V1.png" alt="TikTok" fill className="object-contain" />
             </div>
             <a 
               href="https://www.tiktok.com/@AlphaElectricalsandplumb" 
               target="_blank" 
               rel="noopener noreferrer" 
               className="text-[10px] font-black uppercase tracking-tighter hover:text-primary transition-colors hover:underline"
             >
               TikTok @AlphaElectrical
             </a>
          </div>
        )}
      </div>
    </div>
  );
}
