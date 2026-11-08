'use client';

import { Clock } from 'lucide-react';
import Image from 'next/image';

/**
 * High-Fidelity Top Announcement Bar
 * - Background: Solid Vibrant Purple (#7E22CE)
 * - Behavior: Scrolls away naturally
 * - Layout: Left Marquee, Right Static Socials
 */
export default function TopBanner() {
  return (
    <div className="w-full bg-[#7E22CE] text-white py-2 px-4 h-10 md:h-12 overflow-hidden flex items-center border-b border-white/10 relative z-40">
      <div className="container mx-auto flex justify-between items-center h-full">
        {/* Left Side: Scrolling Marquee */}
        <div className="flex-1 overflow-hidden relative">
          <div className="whitespace-nowrap inline-flex animate-scroll-endless items-center gap-10">
            <span className="text-xs sm:text-sm font-medium uppercase tracking-tight">
              ⚡ Free delivery & professional installation on all electrical & plumbing services this week!
            </span>
            <span className="text-xs sm:text-sm font-medium uppercase tracking-tight">
              🔥 MEGA SALE: Get up to 40% OFF on all lighting fixtures and chandeliers!
            </span>
            <span className="text-xs sm:text-sm font-medium uppercase tracking-tight">
              💎 Premium Quality Tanks now available with a 10-year warranty!
            </span>
            <span className="text-xs sm:text-sm font-medium uppercase tracking-tight">
              ⚡ Free delivery & professional installation on all electrical & plumbing services this week!
            </span>
          </div>
        </div>

        {/* Right Side: Static Socials */}
        <div className="hidden md:flex items-center gap-4 pl-8 shrink-0">
          <div className="flex items-center gap-2 text-white/90">
            <Image src="/tiktok-V1.png" alt="TikTok" width={14} height={14} className="invert brightness-0" />
            <a 
              href="https://www.tiktok.com/@AlphaElectricalsandplumb" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[10px] font-black uppercase tracking-widest hover:underline"
            >
              Follow us on TikTok
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
