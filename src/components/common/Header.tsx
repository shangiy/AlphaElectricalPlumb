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

/**
 * Fixed Navigation Header v9.2
 * Features:
 * - Persistent fixed-top positioning
 * - Enforced Branding: No pink, replaced with #8a0b0d highlights
 * - Central High-Res Search Bar matching provided reference
 * - LATERAL BUBBLE MOBILE SEARCH: Expands horizontally to the left in-line.
 */
export default function Header() {
  const { user } = useAuth();
  const { totalItems } = useCart();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header className="w-full bg-[#0b0f19]/95 backdrop-blur-md border-b border-white/10 h-20 sm:h-24 lg:h-36 flex items-center">
      <div className="container mx-auto px-4 relative z-10 h-full">
        {/* DESKTOP VIEW (LG+) */}
        <div className="hidden w-full items-center justify-between gap-4 lg:flex h-full">
          {/* Left: Branding */}
          <NextLink href="/" className="flex flex-shrink-0 items-center gap-4 group">
            <div className="relative h-[65px] w-[65px] lg:h-[110px] lg:w-[110px]">
                <Image 
                  src="/logo Alpha.png" 
                  alt="Alpha Logo" 
                  fill
                  className="object-contain transition-transform group-hover:scale-110"
                />
            </div>
            <div className="flex flex-col text-white group-hover:text-[#8a0b0d] transition-colors">
              <span className="font-black text-lg lg:text-3xl leading-tight uppercase tracking-tighter">Alpha</span>
              <div className="w-full h-px bg-current opacity-40"></div>
              <span className="text-[10px] lg:text-xs leading-tight font-bold uppercase tracking-widest">Electricals & Plumbing Ltd</span>
            </div>
          </NextLink>

          {/* Middle: Centered Search Bar (Enlarged Ref Design) */}
          <div className="flex-1 max-w-2xl mx-auto px-8">
             <HeroSearch className="lg:scale-105" />
          </div>

          {/* Right: Navigation & Actions */}
          <div className="flex items-center gap-8">
            <nav className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="px-3 py-2 text-white font-bold hover:text-[#8a0b0d] transition-colors flex items-center gap-1 uppercase text-sm lg:text-lg tracking-widest">
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
              <NextLink href="/contact" className="px-3 py-2 text-white font-bold hover:text-[#8a0b0d] transition-colors uppercase text-sm lg:text-lg tracking-widest">Contact Us</NextLink>
              <NextLink href="/about" className="px-3 py-2 text-white font-bold hover:text-[#8a0b0d] transition-colors uppercase text-sm lg:text-lg tracking-widest">About Us</NextLink>
            </nav>

            <div className="flex items-center gap-4">
              <ShoppingCartComponent triggerClassName="h-12 w-12 text-white hover:bg-white/5 transition-colors border border-white/10" />
              
              <NextLink href="/profile">
                <Button 
                  variant="ghost" 
                  className="h-12 px-6 rounded-xl gap-3 font-bold text-white hover:bg-white/5 border border-white/10"
                >
                  <User className="h-6 w-6" />
                  <span className="hidden xl:inline uppercase text-sm tracking-widest">Log in</span>
                </Button>
              </NextLink>
            </div>
          </div>
        </div>

        {/* MOBILE VIEW (<LG) */}
        <div className="w-full lg:hidden flex items-center justify-between h-full gap-2 overflow-hidden">
          {/* Logo Node: Shrinks/Fades when search takes over the space */}
          <NextLink 
            href="/" 
            className={cn(
              "flex-shrink-0 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]",
              mobileSearchOpen ? "scale-0 w-0 opacity-0 invisible" : "scale-100 opacity-100"
            )}
          >
            <Image 
              src="/logo Alpha.png" 
              alt="Alpha Logo" 
              width={60} 
              height={60} 
              className="h-auto"
            />
          </NextLink>

          {/* Action Row & Lateral Expansion Interface */}
          <div className="flex-1 flex items-center justify-end gap-2 h-full">
            
            {/* Horizontal Expansion Hub */}
            <div className={cn(
              "flex items-center transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] overflow-hidden",
              mobileSearchOpen ? "flex-1 opacity-100" : "w-0 opacity-0 pointer-events-none"
            )}>
              <div className="w-full pl-1 pr-2 animate-in slide-in-from-right-8 duration-700">
                <HeroSearch compact onSearch={() => setMobileSearchOpen(false)} />
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Trigger Anchor: Animates rotation and icon swap */}
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  "text-white h-10 w-10 border border-white/10 rounded-full transition-all duration-500 hover:bg-white/10 active:scale-90",
                  mobileSearchOpen && "bg-white/10 rotate-90 border-white/30"
                )}
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              >
                {mobileSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
              </Button>

              {/* Auxiliary Icons: Hidden during search focus */}
              {!mobileSearchOpen && (
                <>
                  <ShoppingCartComponent triggerClassName="h-10 w-10 text-white border border-white/10 rounded-full" />

                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-white h-10 w-10 border border-white/10 rounded-full">
                        <Menu className="h-5 w-5" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="bg-[#0b0f19] border-l-white/10 text-white">
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
