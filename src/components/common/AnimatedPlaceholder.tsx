'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedPlaceholderProps {
  placeholders: string[];
  className?: string;
}

export function AnimatedPlaceholder({ placeholders, className }: AnimatedPlaceholderProps) {
  const [currentPlaceholder, setCurrentPlaceholder] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Robust safety check for the placeholders array
    if (!placeholders || !Array.isArray(placeholders) || placeholders.length === 0) {
      setCurrentPlaceholder('');
      return;
    }

    const activeIndex = placeholderIndex % placeholders.length;
    const fullText = placeholders[activeIndex];

    // Ensure fullText is a valid string
    if (typeof fullText !== 'string') {
      setCurrentPlaceholder('');
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
      return;
    }

    let timeout: NodeJS.Timeout;

    if (isDeleting) {
      if (currentPlaceholder.length > 0) {
        timeout = setTimeout(() => {
          setCurrentPlaceholder(prev => prev.slice(0, -1));
        }, 100);
      } else {
        setIsDeleting(false);
        setPlaceholderIndex((prevIndex) => (prevIndex + 1) % placeholders.length);
      }
    } else {
      if (currentPlaceholder.length < fullText.length) {
        timeout = setTimeout(() => {
          setCurrentPlaceholder(prev => fullText.slice(0, prev.length + 1));
        }, 150);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 2000);
      }
    }

    return () => clearTimeout(timeout);
  }, [currentPlaceholder, isDeleting, placeholderIndex, placeholders]);

  return (
    <span className={cn("relative text-base text-muted-foreground", className)}>
      {currentPlaceholder}
      <span className="animate-pulse">|</span>
    </span>
  );
}
