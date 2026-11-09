'use client';

import React from 'react';
import { Clock } from 'lucide-react';
import Image from 'next/image';

/**
 * High-Fidelity Marquee Banner
 * - Background: Animated Gradient (Red-Purple-Blue)
 * - Content: Business hours, Scrolling Offers, TikTok Social
 */
export default function TopBanner() {
  return (
    <div className="text-white py-2 px-4 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-[length:200%_200%] animate-gradient-x">
      <div className="container mx-auto flex justify-between items-center h-6">
        {/* Business Hours - Desktop Only */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          <Clock className="h-4 w-4" />
          <span className="text-sm font-medium">Mon - Sat: 8:00 AM – 6:00 PM</span>
        </div>

        {/* Marquee Center Container */}
        <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)]">
          <ul className="flex-1 font-bold text-center flex items-center justify-center md:justify-start [&_li]:mx-8 animate-scroll">
            <li className="whitespace-nowrap text-base md:text-lg">OFFER! OFFER! OFFER! Easter Holiday OFFER</li>
            <li className="whitespace-nowrap text-base md:text-lg">Feel welcomed to Shop with us @best prices</li>
            {/* Duplicated for seamless loop */}
            <li className="whitespace-nowrap text-base md:text-lg">OFFER! OFFER! OFFER! Easter Holiday OFFER</li>
            <li className="whitespace-nowrap text-base md:text-lg">Feel welcomed to Shop with us @best prices</li>
          </ul>
        </div>

        {/* Social Node - Desktop Only */}
        <div className="hidden md:flex items-center gap-2 justify-end flex-shrink-0">
          <Image 
            src="/tiktok-V1.png" 
            alt="TikTok" 
            width={16} 
            height={16} 
            className="object-contain"
          />
          <a 
            href="https://www.tiktok.com/@AlphaElectricalsandplumb" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-sm hover:underline"
          >
            Follow us on TikTok
          </a>
        </div>
      </div>
    </div>
  );
}
