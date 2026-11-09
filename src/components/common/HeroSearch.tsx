'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
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

export default function HeroSearch({ className, compact = false, onSearch }: HeroSearchProps) {
  const [query, setQuery] = useState('');
  const [placeholders, setPlaceholders] = useState(["Iron sheets", "Water tanks", "PPR Pipes", "LED Panels", "Sockets"]);
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
        "relative flex items-center w-full p-1 bg-[#0f172a]/40 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl transition-all",
        compact ? "h-11" : "h-16"
      )}>
        
        {/* Typo Animation Overlay */}
        <div className={cn(
          "absolute left-6 top-1/2 -translate-y-1/2 flex items-center pointer-events-none transition-opacity duration-300",
          query ? "opacity-0" : "opacity-100"
        )}>
          <span className={cn("font-medium text-slate-400", compact ? "text-xs" : "text-base")}>Search for&nbsp;</span>
          <AnimatedPlaceholder 
            placeholders={placeholders} 
            className={cn("font-bold text-slate-200", compact ? "text-xs" : "text-base")} 
          />
        </div>

        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 pl-5 pr-4 text-white font-bold focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent border-none appearance-none h-full text-base"
        />
        
        <Button 
          type="submit" 
          size={compact ? "sm" : "lg"} 
          className={cn(
            "rounded-full bg-[#EC4899] hover:bg-[#db2777] text-white transition-all shadow-lg font-black uppercase tracking-widest group",
            compact ? "h-9 w-9 px-0" : "h-13 px-8"
          )}
        >
          <Search className={cn("group-hover:scale-110 transition-transform", compact ? "h-4 w-4" : "h-5 w-5 mr-3")} />
          {!compact && <span>Search</span>}
        </Button>
      </div>
    </form>
  );
}
