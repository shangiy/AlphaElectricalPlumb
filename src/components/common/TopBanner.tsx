'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { getStorefrontSetting } from '@/app/actions/cms-actions';

export default function TopBanner() {
  const [content, setContent] = useState('FLASH SALES! MASHUJAA DAY OFFERS... Check out, 🎃 HALLOWEEN 👻');
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
        return <span key={i} className="font-black text-white px-1">OFFER! </span>;
      }
      if (lowerPart === 'mashujaa') {
        return (
          <span key={i} className="inline-flex font-black tracking-tighter bg-white px-3 py-0.5 rounded-full mx-2 text-black border-2 border-red-600">
            <span style={{ color: 'black' }}>MA</span>
            <span style={{ color: '#BB0000' }}>SHU</span>
            <span style={{ color: '#006600' }}>JAA</span>
          </span>
        );
      }
      if (lowerPart === 'halloween') {
        return (
          <span key={i} className="inline-flex items-center gap-1 font-black text-[#ff6600] drop-shadow-[0_0_8px_rgba(255,102,0,0.8)] mx-2 uppercase italic">
            {part}
          </span>
        );
      }
      return <span key={i} className="uppercase tracking-tight">{part}</span>;
    });
  };

  const items = [1, 2, 3, 4];

  return (
    <div className="relative z-50 text-white py-2 px-4 h-10 md:h-12 overflow-hidden bg-gradient-to-r from-[#BB0000] via-[#BB0000] to-[#800080] border-b border-white/10">
      <div className="container mx-auto flex justify-between items-center h-full">
        <div className="hidden md:flex items-center gap-2 flex-shrink-0 text-white/90">
            <Clock className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Mon - Sat: 8:00 AM – 6:00 PM</span>
        </div>

        <div className="w-full inline-flex flex-nowrap overflow-hidden">
            <ul className="flex-1 font-black text-center flex items-center justify-center [&_li]:mx-8 animate-scroll">
                {items.map((_, index) => (
                    <li key={index} className="whitespace-nowrap text-sm md:text-base flex items-center">
                        {renderRichText(content)}
                    </li>
                ))}
            </ul>
        </div>

        <div className="hidden md:flex items-center gap-2 justify-end flex-shrink-0 text-white/90">
            <Image src="/tiktok-V1.png" alt="TikTok" width={14} height={14} className="invert brightness-0" />
            <a href="https://www.tiktok.com/@AlphaElectricalsandplumb" target="_blank" rel="noopener noreferrer" className="text-[10px] font-black uppercase tracking-widest hover:underline">
                Follow us
            </a>
        </div>
      </div>
    </div>
  );
}
