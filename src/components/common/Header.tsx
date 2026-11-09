'use client';

import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import Image from 'next/image';
import { 
  ChevronDown, 
  ShoppingCart, 
  User, 
  Menu, 
  Search, 
  X,
  Camera
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger, 
  SheetClose, 
  SheetHeader, 
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet';
import ShoppingCartComponent from './ShoppingCart';
import HeroSearch from './HeroSearch';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

/**
 * Compact Light Theme Header v20.0:
 * - Reduced height: h-20 lg:h-24.
 * - Scaled logo: 60x60.
 * - Compact search: h-12.
 * - Persistent sticky top-0 behavior.
 */
export default function Header() {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileSearchOpen(false);
    }
  };

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500 overflow-hidden border-b flex items-center h-20 lg:h-24",
        isScrolled ? "border-slate-200/60" : "border-transparent bg-slate-50/40"
      )}
    >
      {/* LAYER 1 (Bottom): Animated Gradient Background (Slower 20s) */}
      <div 
        className={cn(
          "absolute inset-0 -z-20 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-[length:200%_200%] animate-gradient-x transition-opacity duration-1000",
          isScrolled ? "opacity-100" : "opacity-0"
        )} 
      />

      {/* LAYER 2 (Top): Whitish Frosted Glass over Gradient */}
      <div 
        className={cn(
          "absolute inset-0 -z-10 bg-white/80 backdrop-blur-md transition-opacity duration-1000",
          isScrolled ? "opacity-100" : "opacity-0"
        )}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* DESKTOP VIEW */}
        <div className="hidden w-full items-center justify-between lg:flex">
          {/* Compact Logo & Branding Block (Left) */}
          <NextLink href="/" className="flex flex-shrink-0 items-center gap-3 group">
            <div className="relative h-[60px] w-[60px]">
                <Image 
                  src="/logo Alpha.png" 
                  alt="Alpha Logo" 
                  fill
                  className="object-contain transition-all duration-500"
                />
            </div>
            <div className="flex flex-col transition-colors duration-300 text-[#0b0f19] group-hover:text-[#8a0b0d]">
              <span className="font-bold text-2xl leading-tight transition-all uppercase tracking-tighter">Alpha</span>
              <div className="w-full h-px bg-current"></div>
              <span className="text-[11px] leading-tight font-medium uppercase tracking-wide">Electricals & Plumbing Ltd</span>
            </div>
          </NextLink>

          {/* Centered Compact Search Engine (Middle) */}
          <div className="flex-1 max-w-lg mx-auto px-6">
             <HeroSearch compact={true} className="h-12" />
          </div>

          {/* Compact Navigation & Actions (Right) */}
          <div className="flex items-center gap-4">
            <nav className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="px-4 py-2 bg-white border border-purple-500 rounded-xl font-bold transition-all flex items-center gap-2 uppercase text-[12px] tracking-widest text-[#0b0f19] hover:bg-purple-50 shadow-sm">
                    Products <ChevronDown className="h-3 w-3" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="rounded-2xl p-2 w-64 bg-white border-slate-200 shadow-2xl">
                   <DropdownMenuItem asChild className="cursor-pointer py-3 rounded-xl font-bold text-[#0b0f19] hover:bg-slate-50"><NextLink href="/category/tanks">Water Tanks</NextLink></DropdownMenuItem>
                   <DropdownMenuItem asChild className="cursor-pointer py-3 rounded-xl font-bold text-[#0b0f19] hover:bg-slate-50"><NextLink href="/category/plumbing">Plumbing Equipment</NextLink></DropdownMenuItem>
                   <DropdownMenuItem asChild className="cursor-pointer py-3 rounded-xl font-bold text-[#0b0f19] hover:bg-slate-50"><NextLink href="/category/lighting">Lighting & Electrical</NextLink></DropdownMenuItem>
                   <DropdownMenuItem asChild className="cursor-pointer py-3 rounded-xl font-bold text-[#0b0f19] hover:bg-slate-50"><NextLink href="/category/roofing">Roofing & Construction</NextLink></DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <NextLink href="/contact" className="px-3 py-2 font-bold transition-colors uppercase text-[12px] tracking-widest text-[#0b0f19] hover:text-[#8a0b0d]">Contact Us</NextLink>
              <NextLink href="/about" className="px-3 py-2 font-bold transition-colors uppercase text-[12px] tracking-widest text-[#0b0f19] hover:text-[#8a0b0d]">About Us</NextLink>
            </nav>

            <div className="flex items-center gap-3">
              <ShoppingCartComponent triggerClassName="h-10 w-10 transition-all border border-[#0b0f19]/10 text-[#0b0f19] hover:bg-[#0b0f19]/5 shadow-sm hover:shadow-md" />
              <NextLink href="/profile">
                <Button 
                  variant="ghost" 
                  className="h-10 px-4 rounded-xl gap-2 font-black border border-[#0b0f19]/10 text-[#0b0f19] hover:bg-[#0b0f19]/5 shadow-sm hover:shadow-md"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden xl:inline uppercase text-[11px] tracking-widest">Log in</span>
                </Button>
              </NextLink>
            </div>
          </div>
        </div>

        {/* MOBILE VIEW */}
        <div className="w-full lg:hidden flex items-center justify-between h-16 gap-2">
          <div className="flex items-center gap-2">
             <NextLink href="/" className={cn("flex-shrink-0 transition-all duration-500", mobileSearchOpen ? "opacity-0 w-0 overflow-hidden" : "opacity-100")}>
                <Image src="/logo Alpha.png" alt="Alpha Logo" width={45} height={45} className="h-auto" />
            </NextLink>
            {!mobileSearchOpen && (
                <div className="flex flex-col text-[#0b0f19] transition-opacity duration-500">
                    <span className="font-bold text-[16px] leading-tight uppercase">Alpha</span>
                    <div className="w-full h-px bg-current"></div>
                    <span className="text-[8px] leading-tight font-medium uppercase">Electricals & Plumbing Ltd</span>
                </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Morphing Bubble Search Bar */}
            <form 
              onSubmit={handleSearchSubmit} 
              className={cn(
                "flex items-center rounded-full transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]",
                mobileSearchOpen ? "w-[240px] sm:w-[320px] bg-white border border-slate-200 px-2 shadow-xl ring-4 ring-purple-500/5" : "w-10 h-10 bg-transparent border border-[#0b0f19]/10 justify-center"
              )}
            >
              <input 
                type="search"
                placeholder="Search Alpha..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "bg-transparent border-none text-[#0b0f19] focus:outline-none text-xs h-full transition-all duration-500",
                  mobileSearchOpen ? "flex-1 px-3 opacity-100" : "w-0 opacity-0 pointer-events-none"
                )}
                autoFocus={mobileSearchOpen}
              />
              <Button 
                type="button"
                variant="ghost" 
                size="icon" 
                className={cn(
                  "h-9 w-9 rounded-full shrink-0 transition-all flex items-center justify-center",
                  mobileSearchOpen ? "text-[#0b0f19] hover:bg-slate-100" : "text-[#0b0f19] hover:bg-[#0b0f19]/5"
                )}
                onClick={() => {
                  if (mobileSearchOpen && searchQuery) {
                    handleSearchSubmit({ preventDefault: () => {} } as any);
                  } else {
                    setMobileSearchOpen(!mobileSearchOpen);
                  }
                }}
              >
                {mobileSearchOpen ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
              </Button>
            </form>

            <ShoppingCartComponent triggerClassName="h-10 w-10 border border-[#0b0f19]/10 rounded-full text-[#0b0f19] flex items-center justify-center" />
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 border border-[#0b0f19]/10 rounded-full text-[#0b0f19] flex items-center justify-center">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-white border-l-slate-100 text-[#0b0f19] rounded-l-[3rem] shadow-2xl">
                <SheetHeader>
                  <SheetTitle className="text-[#0b0f19] text-left font-black uppercase tracking-widest flex items-center gap-2">
                      <div className="h-8 w-8 bg-purple-500 rounded-lg flex items-center justify-center text-white"><Menu size={18} /></div>
                      Alpha Ecosystem
                  </SheetTitle>
                  <SheetDescription className="sr-only">Main Navigation</SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-6 pt-12">
                  <SheetClose asChild><NextLink href="/search" className="text-2xl font-black uppercase tracking-tighter hover:text-purple-600 transition-colors">Industrial Collections</NextLink></SheetClose>
                  <SheetClose asChild><NextLink href="/contact" className="text-2xl font-black uppercase tracking-tighter hover:text-purple-600 transition-colors">Contact Node</NextLink></SheetClose>
                  <SheetClose asChild><NextLink href="/about" className="text-2xl font-black uppercase tracking-tighter hover:text-purple-600 transition-colors">About Us</NextLink></SheetClose>
                  <div className="h-px bg-slate-100" />
                  <SheetClose asChild><NextLink href="/wishlist" className="text-xl font-bold uppercase tracking-tight text-slate-500 hover:text-purple-600 transition-colors">My Favorites</NextLink></SheetClose>
                  <SheetClose asChild><NextLink href="/profile" className="text-xl font-bold uppercase tracking-tight text-slate-500 hover:text-purple-600 transition-colors">Member Profile</NextLink></SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
