
'use client';

import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function TopBanner() {
  const offerContent = (
    <>
      OFFER! <span className="text-red-500">OFFER!</span> <span className="text-green-500">OFFER!</span> MIDYEAR FLASH SALE, MADARAKA DAY OFFER!
    </>
  );

  // Duplicate for seamless looping
  const items = [1, 2, 3, 4, 5, 6];

  return (
    <div className={cn(
      "text-white py-2 px-4",
      "bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-[length:200%_200%] animate-gradient-x"
      )}
    >
      <div className="container mx-auto flex justify-between items-center h-10 md:h-12">
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">Mon - Sat: 8:00 AM – 6:00 PM</span>
        </div>

        <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)]">
            <ul className="flex-1 font-bold text-center flex items-center justify-center md:justify-start [&_li]:mx-8 animate-scroll">
                {items.map((_, index) => (
                    <li key={index} className="whitespace-nowrap text-xl md:text-3xl">
                        {offerContent}
                    </li>
                ))}
            </ul>
        </div>

        <div className="hidden md:flex items-center gap-2 justify-end flex-shrink-0">
            <Image src="/tiktok-V1.png" alt="TikTok" width={16} height={16} />
            <a href="https://www.tiktok.com/@AlphaElectricalsandplumb" target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:underline">
                Follow us on TikTok
            </a>
        </div>
      </div>
    </div>
  );
}
