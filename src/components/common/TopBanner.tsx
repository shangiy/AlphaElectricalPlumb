'use client';

import { Clock } from 'lucide-react';
import Image from 'next/image';

/**
 * High-Fidelity Animated Gradient Banner
 * Implementation matches provided HTML specification exactly.
 */
export default function TopBanner() {
  return (
    <div className="text-white py-2 px-4 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-[length:200%_200%] animate-gradient-x relative z-[60]">
      <div className="container mx-auto flex justify-between items-center h-6">
        {/* Left Side: Clock */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          <Clock className="h-4 w-4" />
          <span className="text-xs font-medium">Mon - Sat: 8:00 AM – 6:00 PM</span>
        </div>

        {/* Center: Horizontal Marquee */}
        <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)]">
          <ul className="flex-1 font-bold text-center flex items-center justify-center md:justify-start [&_li]:mx-8 [&_svg]:max-w-none animate-scroll">
            <li className="whitespace-nowrap text-base md:text-lg">OFFER! OFFER! OFFER! Easter Holiday OFFER</li>
            <li className="whitespace-nowrap text-base md:text-lg">Feel welcomed to Shop with us @best prices</li>
            <li className="whitespace-nowrap text-base md:text-lg">OFFER! OFFER! OFFER! Easter Holiday OFFER</li>
            <li className="whitespace-nowrap text-base md:text-lg">Feel welcomed to Shop with us @best prices</li>
          </ul>
        </div>

        {/* Right Side: TikTok Node */}
        <div className="hidden md:flex items-center gap-2 justify-end flex-shrink-0">
          <div className="relative w-4 h-4">
            <Image 
              src="/tiktok-V1.png" 
              alt="TikTok" 
              fill 
              className="object-contain" 
            />
          </div>
          <a 
            href="https://www.tiktok.com/@AlphaElectricalsandplumb" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-xs font-bold hover:underline"
          >
            Follow us on TikTok
          </a>
        </div>
      </div>
    </div>
  );
}
