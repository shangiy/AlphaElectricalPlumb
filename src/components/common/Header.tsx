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
  X 
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
import { useAuth } from '@/context/AuthProvider';
import { useCart } from '@/context/CartProvider';
import ShoppingCartComponent from './ShoppingCart';
import HeroSearch from './HeroSearch';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

/**
 * Persistently Fixed Header v10.0
 * Features:
 * - Glued/Pinned to top-most viewport margin.
 * - Enforced Brand Colors: Crimson (#8a0b0d) highlights, NO PINK.
 * - MORPHING BUBBLE SEARCH: Trigger button grows horizontally to the left into empty space.
 */
export default function Header() {
  const { user } = useAuth();
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
    <header className="w-full bg-[#0b0f19]/95 backdrop-blur-md border-b border-white/10 h-20 sm:h-24 lg:h-36 flex items-center overflow-hidden">
      <div className="container mx-auto px-4 relative z-10 h-full">
        {/* DESKTOP VIEW (LG+) */}
        <div className="hidden w-full items-center justify-between gap-4 lg:flex h-full">
          {/* Left: Branding */}
          <NextLink href="/" className="flex flex-shrink-0 items-center gap-4 group">
            <div className="relative h-[110px] w-[110px]">
                <Image 
                  src="/logo Alpha.png" 
                  alt="Alpha Logo" 
                  fill
                  className="object-contain transition-all duration-500"
                />
            </div>
            <div className="flex flex-col text-white group-hover:text-[#8a0b0d] transition-colors duration-300">
              <span className="font-black text-3xl leading-tight uppercase tracking-tighter">Alpha</span>
              <div className="w-full h-px bg-current opacity-40"></div>
              <span className="text-xs leading-tight font-bold uppercase tracking-widest">Electricals & Plumbing Ltd</span>
            </div>
          </NextLink>

          {/* Middle: Centered Search Bar */}
          <div className="flex-1 max-w-2xl mx-auto px-8">
             <HeroSearch className="scale-105" />
          </div>

          {/* Right: Navigation & Actions */}
          <div className="flex items-center gap-8">
            <nav className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="px-3 py-2 text-white font-bold hover:text-[#8a0b0d] transition-colors flex items-center gap-1 uppercase text-lg tracking-widest">
                    Products <ChevronDown className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="rounded-2xl p-2 w-64 bg-[#0b0f19] border-white/10 text-white">
                   <DropdownMenuItem asChild className="hover:bg-white/5 cursor-pointer text-base py-3"><NextLink href="/category/tanks">Water Tanks</NextLink></DropdownMenuItem>
                   <DropdownMenuItem asChild className="hover:bg-white/5 cursor-pointer text-base py-3"><NextLink href="/category/plumbing">Plumbing Equipment</NextLink></DropdownMenuItem>
                   <DropdownMenuItem asChild className="hover:bg-white/5 cursor-pointer text-base py-3"><NextLink href="/category/lighting">Lighting & Electrical</NextLink></DropdownMenuItem>
                   <DropdownMenuItem asChild className="hover:bg-white/5 cursor-pointer text-base py-3"><NextLink href="/category/roofing">Roofing & Construction</NextLink></DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <NextLink href="/contact" className="px-3 py-2 text-white font-bold hover:text-[#8a0b0d] transition-colors uppercase text-lg tracking-widest">Contact Us</NextLink>
              <NextLink href="/about" className="px-3 py-2 text-white font-bold hover:text-[#8a0b0d] transition-colors uppercase text-lg tracking-widest">About Us</NextLink>
            </nav>

            <div className="flex items-center gap-4">
              <ShoppingCartComponent triggerClassName="h-12 w-12 text-white hover:bg-white/5 transition-colors border border-white/10" />
              
              <NextLink href="/profile">
                <Button 
                  variant="ghost" 
                  className="h-12 px-6 rounded-xl gap-3 font-bold text-white hover:bg-white/5 border border-white/10"
                >
                  <User className="h-7 w-7" />
                  <span className="hidden xl:inline uppercase text-sm tracking-widest">Log in</span>
                </Button>
              </NextLink>
            </div>
          </div>
        </div>

        {/* MOBILE VIEW (<LG) */}
        <div className="w-full lg:hidden flex items-center justify-between h-full gap-2 relative">
          {/* Logo Node: Fades slightly when search is open but remains visible */}
          <NextLink 
            href="/" 
            className={cn(
              "flex-shrink-0 transition-all duration-500",
              mobileSearchOpen ? "opacity-30 blur-[1px]" : "opacity-100"
            )}
          >
            <Image 
              src="/logo Alpha.png" 
              alt="Alpha Logo" 
              width={70} 
              height={70} 
              className="h-auto"
            />
          </NextLink>

          {/* Morphing Action Hub */}
          <div className="flex-1 flex items-center justify-end gap-2 h-full z-20">
            
            {/* The expanding Search Button Bubble - Grows into left empty space */}
            <div className={cn(
              "relative flex items-center h-10 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] overflow-hidden",
              mobileSearchOpen ? "flex-1 ml-4" : "w-10"
            )}>
              <form 
                onSubmit={handleSearchSubmit}
                className={cn(
                  "flex items-center w-full h-full rounded-full transition-all duration-700",
                  mobileSearchOpen ? "bg-white px-1 shadow-2xl" : "bg-transparent"
                )}
              >
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
                <Button 
                  type="button"
                  variant="ghost" 
                  size="icon" 
                  className={cn(
                    "text-white h-10 w-10 border border-white/10 rounded-full transition-all duration-500 hover:bg-white/10 active:scale-90 shrink-0",
                    mobileSearchOpen && "bg-[#28235f] text-white border-none h-8 w-8 mr-1"
                  )}
                  onClick={() => {
                    if (mobileSearchOpen && searchQuery) {
                       handleSearchSubmit({ preventDefault: () => {} } as any);
                    } else {
                       setMobileSearchOpen(!mobileSearchOpen);
                    }
                  }}
                >
                  {mobileSearchOpen ? <X className="h-4 w-4" /> : <Search className="h-5 w-5" />}
                </Button>
              </form>
            </div>

            {/* Cart & Menu stay where they are, no displacement */}
            <div className={cn(
              "flex items-center gap-2 transition-all duration-500",
              mobileSearchOpen ? "opacity-50" : "opacity-100"
            )}>
              <ShoppingCartComponent triggerClassName="h-10 w-10 text-white border border-white/10 rounded-full" />

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white h-10 w-10 border border-white/10 rounded-full">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-[#0b0f19] border-l-white/10 text-white rounded-l-[3rem]">
                  <SheetHeader>
                    <SheetTitle className="text-white text-left font-black uppercase tracking-widest">Menu</SheetTitle>
                    <SheetDescription className="sr-only">Main Navigation</SheetDescription>
                  </SheetHeader>
                  <div className="flex flex-col gap-8 pt-12">
                    <SheetClose asChild><NextLink href="/search" className="text-2xl font-black uppercase tracking-tighter hover:text-[#8a0b0d]">All Products</NextLink></SheetClose>
                    <SheetClose asChild><NextLink href="/contact" className="text-2xl font-black uppercase tracking-tighter hover:text-[#8a0b0d]">Contact Us</NextLink></SheetClose>
                    <SheetClose asChild><NextLink href="/about" className="text-2xl font-black uppercase tracking-tighter hover:text-[#8a0b0d]">About Us</NextLink></SheetClose>
                    <div className="h-px bg-white/10" />
                    <SheetClose asChild><NextLink href="/wishlist" className="text-2xl font-black uppercase tracking-tighter hover:text-[#8a0b0d]">My Favorites</NextLink></SheetClose>
                    <SheetClose asChild><NextLink href="/profile" className="text-2xl font-black uppercase tracking-tighter hover:text-[#8a0b0d]">My Account</NextLink></SheetClose>
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
