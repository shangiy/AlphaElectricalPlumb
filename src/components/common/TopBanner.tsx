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
}

/**
 * High-Fidelity Independent Top Banner v4.3.5:
 * Features a dynamic changing gradient background and 4-slot vibrant engine.
 * Supports individual item colors via coloredItems mapping and Quad-Slot vibrant highlights.
 */
export default function TopBanner() {
  const [config, setConfig] = useState<BannerConfig>({
    items: ["Welcome to Alpha Ecosystem v4.3.5"],
    coloredItems: [{ text: "Welcome to Alpha Ecosystem v4.3.5", color: "#ffffff" }],
    speed: 30,
    fontSize: 12,
    textColor: '#ffffff',
    styleType: 'kenyan-flag',
    styleOrientation: 'horizontal',
    showClock: true,
    showSocial: true,
    highlighters: [],
    vibrantText: '',
    vibrantText2: '',
    vibrantText3: '',
    vibrantText4: ''
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

  const displayItems = config.coloredItems && config.coloredItems.length > 0 
    ? config.coloredItems 
    : config.items.map(text => ({ text, color: '#ffffff' }));

  return (
    <div className="w-full text-white py-1.5 px-4 bg-gradient-to-r from-[#28235f] via-[#4c3b99] to-[#28235f] bg-[length:200%_200%] animate-gradient-x border-b border-white/5 overflow-hidden">
      <div className="container mx-auto flex justify-between items-center h-5">
        <div className="flex-1 inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_64px,_black_calc(100%-64px),transparent_100%)]">
          <div className="flex w-max items-center flex-nowrap animate-marquee whitespace-nowrap" style={{ animationDuration: `${config.speed}s` }}>
            {[0, 1].map(i => (
              <ul key={i} className="flex items-center [&_li]:mx-12">
                {displayItems.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-6 uppercase tracking-widest text-[11px] font-bold">
                    {config.vibrantText && <span>{renderStyledText(config.vibrantText, config.vibrantStyleType || 'kenyan-flag', config.vibrantOrientation || 'vertical', config.vibrantTextStyle)}</span>}
                    {config.vibrantText2 && <span>{renderStyledText(config.vibrantText2, config.vibrantStyleType2 || 'gold-gradient', config.vibrantOrientation2 || 'horizontal', config.vibrantTextStyle2)}</span>}
                    {config.vibrantText3 && <span>{renderStyledText(config.vibrantText3, config.vibrantStyleType3 || 'neon-glow', config.vibrantOrientation3 || 'vertical', config.vibrantTextStyle3)}</span>}
                    {config.vibrantText4 && <span>{renderStyledText(config.vibrantText4, config.vibrantStyleType4 || 'fire-emoji', config.vibrantOrientation4 || 'horizontal', config.vibrantTextStyle4)}</span>}
                    <span style={{ color: item.color || '#ffffff' }}>{item.text}</span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

