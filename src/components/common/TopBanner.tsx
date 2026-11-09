'use client';

import React, { useEffect, useState } from 'react';
import { getStorefrontSetting } from '@/app/actions/cms-actions';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';
import Image from 'next/image';

interface HighlighterRule {
    word: string;
    colors: string[];
    badgeText?: string;
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
}

/**
 * Compact Independent Top Banner v11.0:
 * Features a high-fidelity Keyword Highlighter Engine and a Dynamic Prefix Badge.
 * Inherits Visual Style Engine and Orientation settings for global continuity.
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
    styleOrientation: 'horizontal',
    showClock: true,
    showSocial: true,
    highlighters: []
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

  const getBackgroundColors = () => {
    switch(config.styleType) {
        case 'kenyan-flag': return 'from-black via-red-600 to-green-600';
        case 'gold-gradient': return 'from-yellow-600 via-amber-500 to-yellow-800';
        case 'neon-glow': return 'from-cyan-600 via-blue-600 to-indigo-600';
        case 'fire-emoji': return 'from-orange-600 via-red-600 to-yellow-500';
        default: return 'from-red-500 via-purple-500 to-blue-500';
    }
  };

  const getOrientationClass = () => {
    if (config.styleOrientation === 'text-clip') return 'bg-transparent';
    
    switch(config.styleOrientation) {
        case 'vertical': return 'bg-gradient-to-b';
        case 'diagonal': return 'bg-gradient-to-br';
        default: return 'bg-gradient-to-r';
    }
  };

  // Helper to render text with keyword highlighting
  const renderHighlightedText = (text: string) => {
    const rules = config.highlighters || [];
    if (rules.length === 0) return text;

    // Create a combined regex for all keywords
    const regex = new RegExp(`(${rules.map(r => r.word).filter(Boolean).join('|')})`, 'g');
    const parts = text.split(regex);
    
    // Track occurrence counts for each keyword in this specific item
    const occurrenceCounters: Record<string, number> = {};

    return parts.map((part, i) => {
        const matchingRule = rules.find(r => r.word === part);
        if (matchingRule) {
            const count = occurrenceCounters[part] || 0;
            occurrenceCounters[part] = count + 1;
            
            // Get color from the sequence (loop back if count exceeds sequence length)
            const color = matchingRule.colors[count % matchingRule.colors.length] || config.textColor;

            return (
                <span 
                    key={i} 
                    className="bg-white rounded-full px-3 py-0.5 font-black shadow-lg mx-1 inline-block transform -skew-x-6"
                    style={{ color: color }}
                >
                    {part}
                </span>
            );
        }
        return <span key={i}>{part}</span>;
    });
  };

  const marqueeItems = [...config.items, ...config.items, ...config.items];
  const activeBadge = config.highlighters?.find(h => h.badgeText)?.badgeText;

  return (
    <div 
      className={cn(
        "w-full text-white py-1.5 px-4 bg-[length:200%_200%] animate-gradient-x border-b border-white/5",
        getOrientationClass(),
        config.styleOrientation !== 'text-clip' && getBackgroundColors()
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
            {marqueeItems.map((item, idx) => {
              const isClipped = config.styleOrientation === 'text-clip';

              return (
                <li 
                    key={idx} 
                    className={cn(
                        "whitespace-nowrap uppercase tracking-widest flex items-center gap-4",
                        isClipped && cn("bg-gradient-to-r bg-clip-text text-transparent animate-gradient-x bg-[length:200%_200%]", getBackgroundColors())
                    )}
                    style={{ 
                        fontSize: `${Math.min(config.fontSize, 14)}px`,
                        color: isClipped ? 'transparent' : undefined
                    }}
                >
                    {activeBadge && (
                        <span className={cn(
                            "px-3 py-0.5 rounded-full text-[9px] font-black mr-3 inline-block animate-gradient-x bg-[length:200%_200%] transform -skew-x-6",
                            !isClipped ? "bg-gradient-to-r text-white shadow-md" : "bg-white",
                            !isClipped && getBackgroundColors()
                        )}>
                            <span className={cn(
                                isClipped && cn("bg-gradient-to-r bg-clip-text text-transparent animate-gradient-x bg-[length:200%_200%]", getBackgroundColors())
                            )}>
                                {activeBadge}
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
