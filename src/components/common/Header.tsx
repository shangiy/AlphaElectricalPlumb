
'use client';

import React, { useState } from 'react';
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
 * Sticky Navigation Header v11.0:
 * Sticks to top-0 independently of the Top Banner.
 * Desktop: Scaled-up branding and centered industrial search.
 * Mobile: Morphing bubble search that expands laterally to the left.
 */
export default function Header() {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-500 bg-[#0b0f19]/95 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4">
        {/* DESKTOP VIEW - Enlarged Proportions */}
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
            <div className="flex flex-col text-white transition-colors duration-300">
              <span className="font-black text-2xl lg:text-3xl leading-tight uppercase tracking-tighter group-hover:text-white">Alpha</span>
              <div className="w-full h-px bg-[#8a0b0d]"></div>
              <span className="text-xs lg:text-sm leading-tight font-bold uppercase tracking-widest text-[#8a0b0d]">Electricals & Plumbing Ltd</span>
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
                  <button className="px-3 py-2 font-black transition-colors flex items-center gap-1 uppercase text-base tracking-widest text-white hover:text-[#8a0b0d]">
                    Products <ChevronDown className="h-5 w-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="rounded-3xl p-3 w-72 bg-background border-border shadow-2xl">
                   <DropdownMenuItem asChild className="cursor-pointer py-4 rounded-xl font-bold"><NextLink href="/category/tanks">Water Tanks</NextLink></DropdownMenuItem>
                   <DropdownMenuItem asChild className="cursor-pointer py-4 rounded-xl font-bold"><NextLink href="/category/plumbing">Plumbing Equipment</NextLink></DropdownMenuItem>
                   <DropdownMenuItem asChild className="cursor-pointer py-4 rounded-xl font-bold"><NextLink href="/category/lighting">Lighting & Electrical</NextLink></DropdownMenuItem>
                   <DropdownMenuItem asChild className="cursor-pointer py-4 rounded-xl font-bold"><NextLink href="/category/roofing">Roofing & Construction</NextLink></DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <NextLink href="/contact" className="px-3 py-2 font-black transition-colors uppercase text-base tracking-widest text-white hover:text-[#8a0b0d]">Contact Us</NextLink>
              <NextLink href="/about" className="px-3 py-2 font-black transition-colors uppercase text-base tracking-widest text-white hover:text-[#8a0b0d]">About Us</NextLink>
            </nav>

            <div className="flex items-center gap-6">
              <ShoppingCartComponent triggerClassName="h-14 w-14 transition-colors border border-white/10 text-white hover:bg-white/5 shadow-lg" />
              <NextLink href="/profile">
                <Button 
                  variant="ghost" 
                  className="h-14 px-8 rounded-2xl gap-3 font-black border border-white/10 text-white hover:bg-white/5 shadow-lg"
                >
                  <User className="h-8 w-8" />
                  <span className="hidden xl:inline uppercase text-sm tracking-widest">Log in</span>
                </Button>
              </NextLink>
            </div>
          </div>
        </div>

        {/* MOBILE VIEW - Morphing Bubble Logic */}
        <div className="w-full lg:hidden flex items-center justify-between h-16 sm:h-20 gap-4">
          <NextLink href="/" className={cn("flex-shrink-0 transition-all duration-500", mobileSearchOpen ? "opacity-20 pointer-events-none" : "opacity-100")}>
            <Image src="/logo Alpha.png" alt="Alpha Logo" width={60} height={60} className="h-auto" />
          </NextLink>

          <div className="flex-1 flex items-center justify-end gap-2 h-full overflow-hidden">
            {/* The Morphing Search Bubble: positioning settings defined by flex-1 and justify-end above */}
            <div className={cn(
              "relative flex items-center h-11 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]",
              mobileSearchOpen ? "flex-1 scale-100" : "w-11"
            )}>
              <form onSubmit={handleSearchSubmit} className={cn(
                  "flex items-center w-full h-full rounded-full transition-all duration-700 border",
                  mobileSearchOpen ? "bg-white border-gray-200 px-1 shadow-2xl" : "bg-transparent border-white/10"
                )}>
                <input 
                  type="search"
                  placeholder="Search Alpha..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(
                    "flex-1 bg-transparent border-none text-accent focus:ring-0 text-xs h-full transition-all duration-500 pl-4",
                    mobileSearchOpen ? "opacity-100 w-full" : "opacity-0 w-0 pointer-events-none"
                  )}
                />
                
                {mobileSearchOpen && (
                    <button type="button" className="p-2 text-gray-400 hover:text-[#2b235f] shrink-0">
                        <Camera className="h-4 w-4" />
                    </button>
                )}

                <Button 
                  type="button"
                  variant="ghost" 
                  size="icon" 
                  className={cn(
                    "h-10 w-10 rounded-full transition-all duration-500 shrink-0 text-white",
                    mobileSearchOpen && "bg-[#2b235f] h-9 w-9 mr-0.5"
                  )}
                  onClick={() => {
                    if (mobileSearchOpen && searchQuery) handleSearchSubmit({ preventDefault: () => {} } as any);
                    else setMobileSearchOpen(!mobileSearchOpen);
                  }}
                >
                  {mobileSearchOpen ? <X className="h-5 w-5 animate-in spin-in-90" /> : <Search className="h-5 w-5" />}
                </Button>
              </form>
            </div>

            <div className={cn("flex items-center gap-1 transition-all duration-500", mobileSearchOpen ? "opacity-0 translate-x-10 pointer-events-none" : "opacity-100 translate-x-0")}>
              <ShoppingCartComponent triggerClassName="h-11 w-11 border border-white/10 rounded-full text-white" />
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-11 w-11 border border-white/10 rounded-full text-white">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-[#0b0f19] border-l-white/10 text-white rounded-l-[3rem]">
                  <SheetHeader>
                    <SheetTitle className="text-white text-left font-black uppercase tracking-widest">Alpha Menu</SheetTitle>
                    <SheetDescription className="sr-only">Main Navigation</SheetDescription>
                  </SheetHeader>
                  <div className="flex flex-col gap-8 pt-12">
                    <SheetClose asChild><NextLink href="/search" className="text-2xl font-black uppercase tracking-tighter hover:text-[#8a0b0d]">Collections</NextLink></SheetClose>
                    <SheetClose asChild><NextLink href="/contact" className="text-2xl font-black uppercase tracking-tighter hover:text-[#8a0b0d]">Contact Us</NextLink></SheetClose>
                    <SheetClose asChild><NextLink href="/about" className="text-2xl font-black uppercase tracking-tighter hover:text-[#8a0b0d]">About Us</NextLink></SheetClose>
                    <div className="h-px bg-white/10" />
                    <SheetClose asChild><NextLink href="/wishlist" className="text-2xl font-black uppercase tracking-tighter hover:text-[#8a0b0d]">My Wishlist</NextLink></SheetClose>
                    <SheetClose asChild><NextLink href="/profile" className="text-2xl font-black uppercase tracking-tighter hover:text-[#8a0b0d]">My Profile</NextLink></SheetClose>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
