
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AnimatedPlaceholder } from './AnimatedPlaceholder';
import { cn } from '@/lib/utils';
import { getStorefrontSetting } from '@/app/actions/cms-actions';

/**
 * Specification-compliant Hero Search
 * - Styling: Dark navy background, glassmorphism, fully rounded
 * - Animation: Typing placeholder category cycle
 */
export default function HeroSearch() {
  const [query, setQuery] = useState('');
  const [placeholders, setPlaceholders] = useState(["Water Tanks", "PPR Pipes", "LED Panels", "Sockets", "Chandeliers"]);
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
  };

  return (
    <form onSubmit={handleSubmit} className="w-full transition-all duration-500">
      <div className="relative flex items-center w-full p-1.5 bg-[#0f172a]/80 backdrop-blur-xl rounded-full border border-slate-800 shadow-2xl transition-all h-16">
        
        {/* Typo Animation Overlay */}
        <div className={cn(
          "absolute left-8 top-1/2 -translate-y-1/2 flex items-center pointer-events-none transition-opacity duration-300",
          query ? "opacity-0" : "opacity-100"
        )}>
          <span className="text-base font-medium text-slate-500">Search for&nbsp;</span>
          <AnimatedPlaceholder placeholders={placeholders} className="font-bold text-slate-300" />
        </div>

        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 pl-7 pr-4 text-white text-lg font-bold focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent border-none appearance-none h-full"
        />
        
        <Button 
          type="submit" 
          size="lg" 
          className="rounded-full bg-[#EC4899] hover:bg-[#db2777] text-white transition-all shadow-lg font-black uppercase tracking-widest h-13 px-8 group"
        >
          <Search className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
          <span>Search</span>
        </Button>
      </div>
    </form>
  );
}
