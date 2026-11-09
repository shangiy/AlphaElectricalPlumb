'use client';

import { Clock } from 'lucide-react';
import Image from 'next/image';

export default function TopBanner() {
  return (
    <div>
      <div>
        {/* Opening Hours */}
        <div>
          <Clock />
          <span>Mon - Sat: 8:00 AM – 6:00 PM</span>
        </div>

        {/* Marquee Content */}
        <div>
          <ul>
            <li>OFFER! OFFER! OFFER! Easter Holiday OFFER</li>
            <li>Feel welcomed to Shop with us @best prices</li>
            <li>OFFER! OFFER! OFFER! Easter Holiday OFFER</li>
            <li>Feel welcomed to Shop with us @best prices</li>
          </ul>
        </div>

        {/* TikTok Node */}
        <div>
          <Image 
            src="/tiktok-V1.png" 
            alt="TikTok" 
            width={16}
            height={16}
          />
          <a 
            href="https://www.tiktok.com/@AlphaElectricalsandplumb" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Follow us on TikTok
          </a>
        </div>
      </div>
    </div>
  );
}
