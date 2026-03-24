'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const size = 56; // Button size in pixels
  const strokeWidth = 3; // Progress ring thickness
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (scrollProgress / 100) * circumference;

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      
      if (docHeight > 0) {
        const scrolled = (scrollTop / docHeight) * 100;
        setScrollProgress(scrolled);
      } else {
        setScrollProgress(0);
      }
      
      setIsVisible(scrollTop > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check in case the page loads scrolled down
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        // Base styling for the button - removed border
        'relative flex h-14 w-14 items-center justify-center rounded-full bg-background text-[#2b235f] shadow-lg transition-all duration-300 hover:bg-muted',
        // Visibility based on scroll position
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
      aria-label="Scroll to top"
    >
      <ArrowUp className="relative z-10 h-6 w-6" />
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0 transform -rotate-90"
      >
        {/* Faint track circle which now acts as the border */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--border))"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeOpacity={0.25}
        />
        {/* Accent progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#2b235f"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-100 ease-linear"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
