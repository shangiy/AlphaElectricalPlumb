
'use client';

import { Mail, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function TopBanner() {
  const offerTexts = [
    "OFFERS! OFFERS! Mazingira Day OFFERS!",
    "Feel welcomed to shop with us @ best prices",
  ];

  // Duplicate the array to ensure seamless looping
  const duplicatedOffers = [...offerTexts, ...offerTexts];

  return (
    <div className={cn(
      "text-white py-2 px-4",
      "bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-[length:200%_200%] animate-gradient-x"
      )}
    >
      <div className="container mx-auto flex justify-between items-center h-6">
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            <Clock className="h-4 w-4" />
            <span>Mon - Sat: 8:00 AM – 6:00 PM</span>
        </div>

        <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)]">
            <ul className="flex-1 font-bold text-center flex items-center justify-center md:justify-start [&_li]:mx-8 [&_svg]:max-w-none animate-scroll">
                {duplicatedOffers.map((text, index) => (
                    <li key={index} className="whitespace-nowrap text-base md:text-lg">
                        {text}
                    </li>
                ))}
            </ul>
        </div>

        <div className="hidden md:flex items-center gap-2 justify-end flex-shrink-0">
            <Image src="/tiktok-V1.png" alt="TikTok" width={16} height={16} />
            <a href="https://www.tiktok.com/@AlphaElectricalsandplumb" target="_blank" rel="noopener noreferrer" className="hover:underline">
                Follow us on TikTok
            </a>
        </div>
      </div>
    </div>
  );
}
