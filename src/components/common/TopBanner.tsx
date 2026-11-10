'use client';

import React, { useEffect, useState } from 'react';
import { getStorefrontSetting } from '@/app/actions/cms-actions';
import { cn } from '@/lib/utils';

interface BannerItem {
    text: string;
    color: string;
}

interface HighlighterRule {
    word: string;
    colors: string[];
}

interface BannerConfig {
    items: string[];
    coloredItems?: BannerItem[];
    speed: number;
    fontSize: number;
    fontWeight?: string;
    textColor: string;
    styleType: string;
    styleOrientation?: string;
    showClock: boolean;
    showSocial: boolean;
    highlighters?: HighlighterRule[];
    badgeText?: string;
    vibrantText?: string;
    vibrantStyleType?: string;
    vibrantOrientation?: string;
    vibrantTextStyle?: string;
    vibrantText2?: string;
    vibrantStyleType2?: string;
    vibrantOrientation2?: string;
    vibrantTextStyle2?: string;
    vibrantText3?: string;
    vibrantStyleType3?: string;
    vibrantOrientation3?: string;
    vibrantTextStyle3?: string;
    vibrantText4?: string;
    vibrantStyleType4?: string;
    vibrantOrientation4?: string;
    vibrantTextStyle4?: string;
    bgType?: 'white' | 'blue' | 'red' | 'dynamic';
    gradientDirection?: 'left' | 'right';
}

/**
 * High-Fidelity Independent Top Banner v4.3.9:
 * Features Spectrum Flow atmospheric background logic with multi-color dynamic cycling.
 * Ordinal Mapping Engine: Spacing and colors are synchronized to the template list order.
 */
export default function TopBanner() {
  const [config, setConfig] = useState<BannerConfig>({
    items: ["OFFER", "OFFER", "OFFER", "NOVEMBER Flash SALES!"],
    coloredItems: [
        { text: "OFFER", color: "#ffffff" },
        { text: "OFFER", color: "#ffffff" },
        { text: "OFFER", color: "#ffffff" },
        { text: "NOVEMBER Flash SALES!", color: "#ffffff" }
    ],
    speed: 30,
    fontSize: 12,
    fontWeight: 'font-bold',
    textColor: '#ffffff',
    styleType: 'kenyan-flag',
    styleOrientation: 'horizontal',
    showClock: true,
    showSocial: true,
    highlighters: [],
    vibrantText: '',
    vibrantText2: '',
    vibrantText3: '',
    vibrantText4: '',
    bgType: 'dynamic',
    gradientDirection: 'left'
  });

  useEffect(() => {
    async function loadConfig() {
      try {
        const data = await getStorefrontSetting('top_banner_config');
        if (data && data.items) setConfig(prev => ({ ...prev, ...data }));
      } catch (e) { console.error(e); }
    }
    loadConfig();
  }, []);

  const renderStyledText = (text: string, styleType: string, orientation: string, textStyle: string = "normal") => {
    if (!text) return null;
    
    if (styleType === 'kenyan-flag' && orientation === 'vertical') {
      const upper = text.toUpperCase();
      let p1, p2, p3;
      if (upper === "MASHUJAA") { p1 = "MA"; p2 = "SHU"; p3 = "JAA"; }
      else {
        const len = text.length;
        const s1 = Math.max(1, Math.ceil(len * 0.25));
        const s2 = Math.max(s1 + 1, Math.ceil(len * 0.65));
        p1 = text.substring(0, s1); p2 = text.substring(s1, s2); p3 = text.substring(s2);
      }
      return (
        <span className={cn("font-black uppercase flex items-center", textStyle === 'italic' && 'italic')}>
          <span className="text-black">{p1}</span>
          <span className="text-red-600">{p2}</span>
          <span className="text-green-600">{p3}</span>
        </span>
      );
    }

    const getBg = (t: string) => {
        switch(t) {
            case 'kenyan-flag': return 'from-black via-red-600 to-green-600';
            case 'gold-gradient': return 'from-yellow-600 via-amber-500 to-yellow-800';
            case 'neon-glow': return 'from-cyan-400 via-blue-500 to-indigo-600';
            case 'fire-emoji': return 'from-orange-600 via-red-600 to-yellow-500';
            default: return 'from-white to-white';
        }
    };

    return (
      <span className={cn(
          "font-black bg-clip-text text-transparent animate-gradient-x bg-[length:200%_200%] uppercase whitespace-nowrap bg-gradient-to-r",
          getBg(styleType),
          textStyle === 'italic' && 'italic',
          textStyle === 'bold' && 'font-black'
      )}>{text}</span>
    );
  };

  const getBgClasses = () => {
      if (config.bgType === 'white') return 'bg-white text-[#28235f] border-b';
      if (config.bgType === 'blue') return 'bg-blue-600 text-white';
      if (config.bgType === 'red') return 'bg-red-600 text-white';
      
      const direction = config.gradientDirection === 'right' ? 'bg-gradient-to-l' : 'bg-gradient-to-r';
      return cn(
          "text-white bg-[length:400%_400%] animate-gradient-x border-white/5",
          direction,
          "from-red-600 via-orange-600 via-yellow-600 via-green-600 via-blue-600 via-purple-600 via-pink-600 to-red-600"
      );
  };

  const displayItems = config.coloredItems && config.coloredItems.length > 0 
    ? config.coloredItems 
    : config.items.map(text => ({ text, color: '#ffffff' }));

  return (
    <div className={cn("w-full py-1.5 px-4 overflow-hidden transition-all duration-700", getBgClasses())}>
      <div className="container mx-auto flex justify-between items-center h-5">
        <div className={cn(
            "flex-1 inline-flex flex-nowrap overflow-hidden",
            "[mask-image:_linear-gradient(to_right,transparent_0,_black_64px,_black_calc(100%-64px),transparent_100%)]"
        )}>
          <div className="flex w-max items-center flex-nowrap animate-marquee whitespace-nowrap" style={{ animationDuration: `${config.speed}s` }}>
            {[0, 1].map(i => (
              <ul key={i} className="flex items-center gap-x-16">
                {displayItems.map((item, idx) => (
                  <React.Fragment key={idx}>
                    <li className={cn("flex items-center gap-4 uppercase tracking-widest", config.fontWeight || 'font-bold')} style={{ fontSize: `${config.fontSize}px` }}>
                        {config.vibrantText && <span>{renderStyledText(config.vibrantText, config.vibrantStyleType || 'kenyan-flag', config.vibrantOrientation || 'vertical', config.vibrantTextStyle)}</span>}
                        {config.vibrantText2 && <span>{renderStyledText(config.vibrantText2, config.vibrantStyleType2 || 'gold-gradient', config.vibrantOrientation2 || 'horizontal', config.vibrantTextStyle2)}</span>}
                        {config.vibrantText3 && <span>{renderStyledText(config.vibrantText3, config.vibrantStyleType3 || 'neon-glow', config.vibrantOrientation3 || 'vertical', config.vibrantTextStyle3)}</span>}
                        {config.vibrantText4 && <span>{renderStyledText(config.vibrantText4, config.vibrantStyleType4 || 'fire-emoji', config.vibrantOrientation4 || 'horizontal', config.vibrantTextStyle4)}</span>}
                        
                        <span style={{ color: config.bgType === 'white' && item.color === '#ffffff' ? '#28235f' : item.color }}>{item.text}</span>
                    </li>
                  </React.Fragment>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
