'use client';

import React from 'react';

export default function TopBanner() {
  return (
    <div className="text-white py-1.5 px-4 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-[length:200%_200%] animate-gradient-x text-xs font-medium border-b border-white/5">
      <div className="container mx-auto flex justify-between items-center h-6 overflow-hidden">
        {/* Business Hours - Desktop */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          <span className="opacity-80">Mon - Sat: 8:00 AM – 6:00 PM</span>
        </div>

        {/* Marquee Center Container */}
        <div className="flex-1 inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_64px,_black_calc(100%-64px),transparent_100%)]">
          <ul className="flex-1 font-black text-center flex items-center justify-center md:justify-start [&_li]:mx-12 animate-scroll">
            <li className="whitespace-nowrap uppercase tracking-widest text-[#FFF] drop-shadow-sm">⚡ EASTER HOLIDAY OFFER! BEST PRICES GUARANTEED</li>
            <li className="whitespace-nowrap uppercase tracking-widest text-[#FFF] drop-shadow-sm">⚡ SHOP WITH US @BEST PRICES IN ELDORET</li>
            <li className="whitespace-nowrap uppercase tracking-widest text-[#FFF] drop-shadow-sm">⚡ EASTER HOLIDAY OFFER! BEST PRICES GUARANTEED</li>
            <li className="whitespace-nowrap uppercase tracking-widest text-[#FFF] drop-shadow-sm">⚡ SHOP WITH US @BEST PRICES IN ELDORET</li>
          </ul>
        </div>

        {/* Social Link - Desktop */}
        <div className="hidden md:flex items-center gap-2 justify-end flex-shrink-0">
          <a 
            href="https://www.tiktok.com/@AlphaElectricalsandplumb" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:underline font-black uppercase tracking-tighter"
          >
            TikTok @AlphaElectricals
          </a>
        </div>
      </div>
    </div>
  );
}
