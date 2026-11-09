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
    holidayText?: string;
    holidayStyleType?: string;
    holidayOrientation?: string;
    holidayTextStyle?: string;
    vibrantText?: string;
    vibrantStyleType?: string;
    vibrantOrientation?: string;
    vibrantTextStyle?: string;
    vibrantText2?: string;
    vibrantStyleType2?: string;
    vibrantOrientation2?: string;
    vibrantTextStyle2?: string;
}

/**
 * High-Fidelity Independent Top Banner v18.0:
 * Features a quadruple-badge carousel and character-splitting logic for the Kenyan Flag visual style.
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
    halloweenTextStyle: 'normal',
    holidayText: '',
    holidayStyleType: 'kenyan-flag',
    holidayOrientation: 'vertical',
    holidayTextStyle: 'bold',
    vibrantText: '',
    vibrantStyleType: 'kenyan-flag',
    vibrantOrientation: 'vertical',
    vibrantTextStyle: 'bold',
    vibrantText2: '',
    vibrantStyleType2: 'kenyan-flag',
    vibrantOrientation2: 'vertical',
    vibrantTextStyle2: 'bold'
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

  const getGradientDirection = (orientation: string) => {
    switch(orientation) {
        case 'vertical': return 'bg-gradient-to-b';
        case 'diagonal': return 'bg-gradient-to-br';
        default: return 'bg-gradient-to-r';
    }
  };

  const renderStyledBadgeText = (text: string, styleType: string, orientation: string, textStyle: string = "normal") => {
    if (!text) return null;
    
    const isKenyanFlag = styleType === 'kenyan-flag';
    const isVertical = orientation === 'vertical';

    if (isKenyanFlag && isVertical) {
      const upper = text.toUpperCase();
      let p1 = "", p2 = "", p3 = "";
      
      if (upper === "MASHUJAA") {
        p1 = "MA"; p2 = "SHU"; p3 = "JAA";
      } else {
        const len = text.length;
        const s1 = Math.max(1, Math.ceil(len * 0.25));
        const s2 = Math.max(s1 + 1, Math.ceil(len * 0.65));
        p1 = text.substring(0, s1);
        p2 = text.substring(s1, s2);
        p3 = text.substring(s2);
      }

      const styleClasses = cn(
        "font-black uppercase tracking-tight flex items-center",
        textStyle === 'italic' && 'italic',
        textStyle === 'bold' && 'font-black',
        textStyle === 'underline' && 'underline',
        textStyle === 'line-through' && 'line-through'
      );

      return (
        <span className={styleClasses}>
          <span className="text-black">{p1}</span>
          <span className="text-red-600">{p2}</span>
          <span className="text-green-600">{p3}</span>
        </span>
      );
    }

    const gradientDir = getGradientDirection(orientation);
    const bgColors = getBackgroundColors(styleType);
    
    return (
      <span className={cn(
          "font-black bg-clip-text text-transparent animate-gradient-x bg-[length:200%_200%] uppercase whitespace-nowrap",
          gradientDir, 
          bgColors,
          textStyle === 'italic' && 'italic',
          textStyle === 'bold' && 'font-black',
          textStyle === 'underline' && 'underline',
          textStyle === 'line-through' && 'line-through'
      )}>
          {text}
      </span>
    );
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

  if (!config.items || config.items.length === 0) return null;

  return (
    <div 
      className={cn(
        "w-full text-white py-1.5 px-4 bg-[length:200%_200%] animate-gradient-x border-b border-white/5 overflow-hidden",
        config.styleOrientation !== 'text-clip' && getGradientDirection(config.styleOrientation || 'horizontal'),
        config.styleOrientation !== 'text-clip' && getBackgroundColors(config.styleType),
        config.styleOrientation === 'text-clip' && "bg-transparent"
      )}
      style={{ color: config.textColor }}
    >
      <div className="container mx-auto flex justify-between items-center h-5">
        
        {config.showClock && (
          <div className="hidden md:flex items-center gap-2 flex-shrink-0 z-10 mr-4">
            <Clock className="h-3.5 w-3.5 opacity-80" />
            <span className="text-[10px] whitespace-nowrap font-bold">Mon - Sat: 8:00 AM – 6:00 PM</span>
          </div>
        )}

        <div className="flex-1 inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_64px,_black_calc(100%-64px),transparent_100%)]">
          <div 
            className="flex w-max items-center flex-nowrap animate-marquee whitespace-nowrap"
            style={{ animationDuration: `${config.speed}s` }}
          >
            {[...Array(2)].map((_, i) => (
              <ul key={i} className="flex items-center [&_li]:mx-12">
                {config.items.map((item, idx) => {
                  const isClipped = config.styleOrientation === 'text-clip';
                  const gradientDir = getGradientDirection(config.styleOrientation || 'horizontal');
                  const bgColors = getBackgroundColors(config.styleType);

                  return (
                    <li 
                        key={idx} 
                        className={cn(
                            "flex items-center uppercase tracking-widest",
                            isClipped && cn("bg-clip-text text-transparent animate-gradient-x bg-[length:200%_200%]", gradientDir, bgColors)
                        )}
                        style={{ 
                            fontSize: `${Math.min(config.fontSize, 14)}px`,
                            color: isClipped ? 'transparent' : undefined
                        }}
                    >
                        {config.badgeText && (
                            <span className="px-3 py-1 rounded-full bg-white mr-4 shadow-lg transform -skew-x-6 flex-shrink-0 flex items-center justify-center">
                                {renderStyledBadgeText(config.badgeText, config.styleType, config.styleOrientation || 'horizontal')}
                            </span>
                        )}
                        {config.halloweenText && (
                            <span className="px-3 py-1 rounded-full bg-white mr-4 shadow-lg transform -skew-x-6 flex-shrink-0 flex items-center justify-center">
                                {renderStyledBadgeText(
                                  config.halloweenText, 
                                  config.halloweenStyleType || 'fire-emoji', 
                                  config.halloweenOrientation || 'horizontal',
                                  config.halloweenTextStyle
                                )}
                            </span>
                        )}
                        {config.holidayText && (
                            <span className="px-3 py-1 rounded-full bg-white mr-4 shadow-lg transform -skew-x-6 flex-shrink-0 flex items-center justify-center">
                                {renderStyledBadgeText(
                                  config.holidayText, 
                                  config.holidayStyleType || 'kenyan-flag', 
                                  config.holidayOrientation || 'vertical',
                                  config.holidayTextStyle
                                )}
                            </span>
                        )}
                        {config.vibrantText && (
                            <span className="mr-4 flex-shrink-0 flex items-center justify-center">
                                {renderStyledBadgeText(
                                  config.vibrantText, 
                                  config.vibrantStyleType || 'kenyan-flag', 
                                  config.vibrantOrientation || 'vertical',
                                  config.vibrantTextStyle
                                )}
                            </span>
                        )}
                        {config.vibrantText2 && (
                            <span className="mr-4 flex-shrink-0 flex items-center justify-center">
                                {renderStyledBadgeText(
                                  config.vibrantText2, 
                                  config.vibrantStyleType2 || 'kenyan-flag', 
                                  config.vibrantOrientation2 || 'vertical',
                                  config.vibrantTextStyle2
                                )}
                            </span>
                        )}
                        {renderHighlightedText(item)}
                    </li>
                  );
                })}
              </ul>
            ))}
          </div>
        </div>

        {config.showSocial && (
          <div className="hidden md:flex items-center gap-2 justify-end flex-shrink-0 z-10 ml-4">
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
