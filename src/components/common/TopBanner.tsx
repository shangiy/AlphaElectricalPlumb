'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { getStorefrontSetting } from '@/app/actions/cms-actions';

export default function TopBanner() {
  const [content, setContent] = useState('OFFER! MIDYEAR FLASH SALE, MASHUJAA DAY OFFER!');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBanner() {
      try {
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
    const parts = text.split(/(OFFER!|MASHUJAA|HALLOWEEN)/gi);
    
    return parts.map((part, i) => {
      const lowerPart = part.toLowerCase();
      if (lowerPart === 'offer!') {
        return <span key={i} className="font-black text-red-500">{part} </span>;
      }
      if (lowerPart === 'mashujaa') {
        return (
          <span key={i} className="inline-flex font-black tracking-tighter bg-white px-2 rounded-sm mx-1 text-black">
            MASHUJAA
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  const items = [1, 2, 3, 4];

  return (
    <div className="relative z-30 text-white py-2 px-4 h-10 md:h-12 overflow-hidden bg-primary border-b border-white/10">
      <div className="container mx-auto flex justify-between items-center h-full">
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            <Clock className="h-4 w-4" />
            <span className="text-xs font-medium">Mon - Sat: 8:00 AM – 6:00 PM</span>
        </div>

        <div className="w-full inline-flex flex-nowrap overflow-hidden">
            <ul className="flex-1 font-bold text-center flex items-center justify-center [&_li]:mx-8 animate-scroll">
                {items.map((_, index) => (
                    <li key={index} className="whitespace-nowrap text-lg md:text-xl">
                        {renderRichText(content)}
                    </li>
                ))}
            </ul>
        </div>

        <div className="hidden md:flex items-center gap-2 justify-end flex-shrink-0">
            <Image src="/tiktok-V1.png" alt="TikTok" width={16} height={16} />
            <a href="https://www.tiktok.com/@AlphaElectricalsandplumb" target="_blank" rel="noopener noreferrer" className="text-xs font-medium hover:underline">
                Follow us
            </a>
        </div>
      </div>
    </div>
  );
}
