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
 * High-Fidelity Light Theme Header v16.0:
 * - Unified branding text as requested.
 * - Soft whitish-blue/lavender background with dynamic scroll gradient.
 * - Dark navy/indigo branding and iconography.
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
    <header className="sticky top-0 z-50 w-full transition-all duration-500 bg-slate-50/90 backdrop-blur-md border-b border-slate-200/60 overflow-hidden">
      {/* Dynamic Animated Gradient Layer (Fades in on scroll) */}
      <div 
        className={cn(
          "absolute inset-0 -z-10 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-[length:200%_200%] animate-gradient-x transition-opacity duration-700",
          isScrolled ? "opacity-100" : "opacity-0"
        )} 
      />

      <div className="container mx-auto px-4">
        {/* DESKTOP VIEW */}
        <div className="hidden w-full items-center justify-between lg:flex h-36">
          {/* Logo Section (Left) */}
          <NextLink href="/" className="flex flex-shrink-0 items-center gap-4 group">
            <div className="relative h-[110px] w-[110px]">
                <Image 
                  src="/logo Alpha.png" 
                  alt="Alpha Logo" 
                  fill
                  className="object-contain transition-all duration-500"
                />
            </div>
            <div className="text-[#0b0f19] transition-colors duration-300 font-black text-2xl lg:text-3xl leading-tight uppercase tracking-tighter max-w-[280px]">
              Alpha Electricals & Plumbing Ltd
            </div>
          </NextLink>

          {/* Centered Search Engine (Middle) */}
          <div className="flex-1 max-w-xl mx-auto px-8">
             <HeroSearch compact={true} className="h-16" />
          </div>

          {/* Navigation & Actions (Right) */}
          <div className="flex items-center gap-8">
            <nav className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="px-5 py-2.5 font-bold transition-all flex items-center gap-2 uppercase text-sm tracking-widest text-[#0b0f19] bg-white border border-purple-500 rounded-xl shadow-sm hover:shadow-md hover:scale-105 active:scale-95">
                    Products <ChevronDown className="h-4 w-4 text-purple-600" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="rounded-3xl p-3 w-72 bg-white border-slate-200 shadow-2xl">
                   <DropdownMenuItem asChild className="cursor-pointer py-4 rounded-xl font-bold text-[#0b0f19] hover:bg-slate-50"><NextLink href="/category/tanks">Water Tanks</NextLink></DropdownMenuItem>
                   <DropdownMenuItem asChild className="cursor-pointer py-4 rounded-xl font-bold text-[#0b0f19] hover:bg-slate-50"><NextLink href="/category/plumbing">Plumbing Equipment</NextLink></DropdownMenuItem>
                   <DropdownMenuItem asChild className="cursor-pointer py-4 rounded-xl font-bold text-[#0b0f19] hover:bg-slate-50"><NextLink href="/category/lighting">Lighting & Electrical</NextLink></DropdownMenuItem>
                   <DropdownMenuItem asChild className="cursor-pointer py-4 rounded-xl font-bold text-[#0b0f19] hover:bg-slate-50"><NextLink href="/category/roofing">Roofing & Construction</NextLink></DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <NextLink href="/contact" className="px-3 py-2 font-bold transition-colors uppercase text-sm tracking-widest text-[#0b0f19] hover:text-[#8a0b0d]">Contact Us</NextLink>
              <NextLink href="/about" className="px-3 py-2 font-bold transition-colors uppercase text-sm tracking-widest text-[#0b0f19] hover:text-[#8a0b0d]">About Us</NextLink>
            </nav>

            <div className="flex items-center gap-6">
              <ShoppingCartComponent triggerClassName="h-14 w-14 transition-all border border-[#0b0f19]/10 text-[#0b0f19] hover:bg-[#0b0f19]/5 shadow-sm hover:shadow-md" />
              <NextLink href="/profile">
                <Button 
                  variant="ghost" 
                  className="h-14 px-8 rounded-2xl gap-3 font-black border border-[#0b0f19]/10 text-[#0b0f19] hover:bg-[#0b0f19]/5 shadow-sm hover:shadow-md"
                >
                  <User className="h-8 w-8" />
                  <span className="hidden xl:inline uppercase text-sm tracking-widest">Log in</span>
                </Button>
              </NextLink>
            </div>
          </div>
        </div>

        {/* MOBILE VIEW */}
        <div className="w-full lg:hidden flex items-center justify-between h-20 gap-2">
          <div className="flex items-center gap-3">
             <NextLink href="/" className={cn("flex-shrink-0 transition-all duration-500", mobileSearchOpen ? "opacity-0 w-0 overflow-hidden" : "opacity-100")}>
                <Image src="/logo Alpha.png" alt="Alpha Logo" width={60} height={60} className="h-auto" />
            </NextLink>
            {!mobileSearchOpen && (
                <div className="text-[#0b0f19] transition-opacity duration-500 font-black text-xs leading-tight uppercase tracking-tighter max-w-[140px]">
                    Alpha Electricals & Plumbing Ltd
                </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Morphing Bubble Search Bar */}
            <form 
              onSubmit={handleSearchSubmit} 
              className={cn(
                "flex items-center rounded-full transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]",
                mobileSearchOpen ? "w-[240px] sm:w-[320px] bg-white border border-slate-200 px-2 shadow-xl ring-4 ring-purple-500/5" : "w-11 h-11 bg-transparent border border-[#0b0f19]/10 justify-center"
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
                  "h-10 w-10 rounded-full shrink-0 transition-all flex items-center justify-center",
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
                {mobileSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
              </Button>
            </form>

            <ShoppingCartComponent triggerClassName="h-11 w-11 border border-[#0b0f19]/10 rounded-full text-[#0b0f19] flex items-center justify-center" />
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-11 w-11 border border-[#0b0f19]/10 rounded-full text-[#0b0f19] flex items-center justify-center">
                  <Menu className="h-6 w-6" />
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