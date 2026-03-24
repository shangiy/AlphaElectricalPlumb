'use client';

import { useState, useEffect, useRef } from 'react';

interface CircularProgressProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  progressColor?: string;
  trackColor?: string;
  label?: string;
}

export function CircularProgress({
  progress = 0,
  size = 120,
  strokeWidth = 10,
  progressColor = '#00c389',
  trackColor = 'rgba(255, 255, 255, 0.2)',
  label,
}: CircularProgressProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const circleRef = useRef<SVGCircleElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const circle = circleRef.current;
    const container = containerRef.current;
    if (!circle || !container) return;
    
    const resetAnimation = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (circle) {
           circle.style.transition = 'none';
           circle.style.strokeDashoffset = `${circumference}`;
      }
      setAnimatedProgress(0);
    };

    const startAnimation = () => {
        resetAnimation(); // Ensure clean start

        // Animate percentage number
        let current = 0;
        const duration = 2000;
        const stepTime = 16; // ms, for ~60fps
        const stepValue = progress / (duration / stepTime);
        
        intervalRef.current = setInterval(() => {
            current += stepValue;
            if (current >= progress) {
                current = progress;
                if (intervalRef.current) clearInterval(intervalRef.current);
            }
            setAnimatedProgress(Math.round(current));
        }, stepTime);

        // Animate circle stroke
        setTimeout(() => {
            if (circleRef.current) {
                const offset = circumference - (progress / 100) * circumference;
                circleRef.current.style.transition = 'stroke-dashoffset 2s ease';
                circleRef.current.style.strokeDashoffset = `${offset}`;
            }
        }, 50);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
            startAnimation();
        } else {
            resetAnimation();
        }
      },
      { threshold: 0.6 } // Start animation when 60% of element is visible
    );

    // Set initial state
    circle.style.strokeDasharray = `${circumference}`;
    resetAnimation();

    observer.observe(container);

    return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        observer.disconnect();
    };
  }, [progress, circumference]);

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center gap-2"
      style={{ width: size }}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={trackColor}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            ref={circleRef}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={progressColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-white">{animatedProgress}%</span>
        </div>
      </div>
      {label && <span className="mt-1 max-w-[15ch] text-center text-sm font-medium text-white/90">{label}</span>}
    </div>
  );
}
