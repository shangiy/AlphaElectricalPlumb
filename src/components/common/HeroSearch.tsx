'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Camera } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AnimatedPlaceholder } from './AnimatedPlaceholder';
import { cn } from '@/lib/utils';
import { getStorefrontSetting } from '@/app/actions/cms-actions';

interface HeroSearchProps {
  className?: string;
  compact?: boolean;
  onSearch?: () => void;
}

/**
 * High-Fidelity Search Bar v9.0
 * Matches exact provided reference image:
 * - White rounded-full pill background
 * - Navy blue (#2b235f) search button
 * - Integrated camera icon for visual search
 * - Animated placeholder with "Search for" prefix
 */
export default function HeroSearch({ className, compact = false, onSearch }: HeroSearchProps) {
  const [query, setQuery] = useState('');
  const [placeholders, setPlaceholders] = useState(["ironsheets", "water tanks", "PPR Pipes", "LED Panels", "Sockets"]);
  const router = useRouter();

  useEffect(() => {
    async function loadCMSData() {
        try {
            const val = await getStorefrontSetting('search_phrases');
            if (val && Array.isArray(val) && val.length > 0) {
                setPlaceholders(val);
            }
        } catch (e) {
            console.error("Search CMS fetch failed", e);
        }
    }
    loadCMSData();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/search');
    }
    if (onSearch) onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className={cn("w-full transition-all duration-500", className)}>
      <div className={cn(
        "relative flex items-center w-full p-1 bg-white rounded-full border border-gray-200 shadow-md transition-all",
        compact ? "h-11" : "h-14 lg:h-16"
      )}>
        
        {/* Typo Animation Overlay */}
        <div className={cn(
          "absolute left-6 top-1/2 -translate-y-1/2 flex items-center pointer-events-none transition-opacity duration-300",
          query ? "opacity-0" : "opacity-100"
        )}>
          <span className={cn("font-medium text-gray-400", compact ? "text-xs" : "text-base")}>Search for&nbsp;</span>
          <AnimatedPlaceholder 
            placeholders={placeholders} 
            className={cn("font-medium text-gray-600", compact ? "text-xs" : "text-base")} 
          />
        </div>

        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 pl-5 pr-16 text-gray-900 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent border-none appearance-none h-full text-base"
        />
        
        {/* Action Icons */}
        <div className="absolute right-2 flex items-center gap-2">
            <button 
                type="button" 
                className="p-2 text-gray-400 hover:text-[#2b235f] transition-colors"
                title="Search by image"
            >
                <Camera className={cn(compact ? "h-4 w-4" : "h-5 w-5")} />
            </button>

            <Button 
                type="submit" 
                size={compact ? "sm" : "lg"} 
                className={cn(
                    "rounded-full bg-[#2b235f] hover:bg-[#1d1b42] text-white transition-all shadow-lg font-bold uppercase tracking-widest",
                    compact ? "h-9 w-9 px-0" : "h-11 lg:h-13 px-6 lg:px-8"
                )}
            >
                <Search className={cn(compact ? "h-4 w-4" : "h-5 w-5 sm:mr-2")} />
                {!compact && <span className="hidden sm:inline">Search</span>}
            </Button>
        </div>
      </div>
    </form>
  );
}
