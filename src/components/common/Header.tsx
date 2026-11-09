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
  Camera, 
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
import { cn } from '@/lib/utils';
import ShoppingCartComponent from './ShoppingCart';
import HeroSearch from './HeroSearch';

export default function Header() {
  const { user } = useAuth();
  const { totalItems } = useCart();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header className="w-full bg-[#0b0f19]/95 backdrop-blur-md border-b border-white/10 h-20 sm:h-24 flex items-center">
      <div className="container mx-auto px-4 relative z-10 h-full">
        {/* DESKTOP VIEW (LG+) */}
        <div className="hidden w-full items-center justify-between gap-4 lg:flex h-full">
          {/* Left: Branding */}
          <NextLink href="/" className="flex flex-shrink-0 items-center gap-3 group">
            <div className="relative h-[65px] w-[65px] xl:h-[80px] xl:w-[80px]">
                <Image 
                  src="/logo Alpha.png" 
                  alt="Alpha Logo" 
                  fill
                  className="object-contain transition-transform group-hover:scale-110"
                />
            </div>
            <div className="flex flex-col text-white group-hover:text-[#EC4899] transition-colors">
              <span className="font-black text-lg xl:text-xl leading-tight uppercase tracking-tighter">Alpha</span>
              <div className="w-full h-px bg-current opacity-40"></div>
              <span className="text-[10px] xl:text-[11px] leading-tight font-bold uppercase tracking-widest">Electricals & Plumbing Ltd</span>
            </div>
          </NextLink>

          {/* Middle: Centered Search Bar */}
          <div className="flex-1 max-w-xl mx-auto px-4">
             <HeroSearch className="h-12 !bg-white/5 !border-white/10" compact />
          </div>

          {/* Right: Navigation & Actions */}
          <div className="flex items-center gap-6">
            <nav className="flex items-center gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="px-3 py-2 text-white font-bold hover:text-[#EC4899] transition-colors flex items-center gap-1 uppercase text-sm tracking-widest">
                    Products <ChevronDown className="h-3 w-3" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="rounded-2xl p-2 w-56 bg-[#0b0f19] border-white/10 text-white">
                   <DropdownMenuItem asChild className="hover:bg-white/5 cursor-pointer"><NextLink href="/category/tanks">Water Tanks</NextLink></DropdownMenuItem>
                   <DropdownMenuItem asChild className="hover:bg-white/5 cursor-pointer"><NextLink href="/category/plumbing">Plumbing Equipment</NextLink></DropdownMenuItem>
                   <DropdownMenuItem asChild className="hover:bg-white/5 cursor-pointer"><NextLink href="/category/lighting">Lighting & Electrical</NextLink></DropdownMenuItem>
                   <DropdownMenuItem asChild className="hover:bg-white/5 cursor-pointer"><NextLink href="/category/roofing">Roofing & Construction</NextLink></DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <NextLink href="/contact" className="px-3 py-2 text-white font-bold hover:text-[#EC4899] transition-colors uppercase text-sm tracking-widest">Contact</NextLink>
              <NextLink href="/about" className="px-3 py-2 text-white font-bold hover:text-[#EC4899] transition-colors uppercase text-sm tracking-widest">About</NextLink>
            </nav>

            <div className="flex items-center gap-3">
              <ShoppingCartComponent triggerClassName="h-10 w-10 text-white hover:bg-white/5 transition-colors border border-white/10" />
              
              <NextLink href="/profile">
                <Button 
                  variant="ghost" 
                  className="h-10 px-4 rounded-xl gap-2 font-bold text-white hover:bg-white/5 border border-white/10"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden xl:inline uppercase text-xs tracking-widest">Account</span>
                </Button>
              </NextLink>
            </div>
          </div>
        </div>

        {/* MOBILE VIEW (<LG) */}
        <div className="w-full lg:hidden flex items-center justify-between h-full">
          <NextLink href="/" className="flex-shrink-0">
            <Image 
              src="/logo Alpha.png" 
              alt="Alpha Logo" 
              width={60} 
              height={60} 
              className="h-auto"
            />
          </NextLink>

          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white h-10 w-10 border border-white/10 rounded-full"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>

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
                  <SheetClose asChild><NextLink href="/search" className="text-2xl font-black uppercase tracking-tighter hover:text-[#EC4899]">All Products</NextLink></SheetClose>
                  <SheetClose asChild><NextLink href="/contact" className="text-2xl font-black uppercase tracking-tighter hover:text-[#EC4899]">Contact Us</NextLink></SheetClose>
                  <SheetClose asChild><NextLink href="/about" className="text-2xl font-black uppercase tracking-tighter hover:text-[#EC4899]">About Us</NextLink></SheetClose>
                  <div className="h-px bg-white/10" />
                  <SheetClose asChild><NextLink href="/wishlist" className="text-2xl font-black uppercase tracking-tighter hover:text-[#EC4899]">My Favorites</NextLink></SheetClose>
                  <SheetClose asChild><NextLink href="/profile" className="text-2xl font-black uppercase tracking-tighter hover:text-[#EC4899]">My Account</NextLink></SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* MOBILE SEARCH OVERLAY */}
        {mobileSearchOpen && (
          <div className="absolute inset-x-0 top-full bg-[#0b0f19] p-4 border-b border-white/10 animate-in fade-in slide-in-from-top-2 lg:hidden">
             <HeroSearch compact className="h-12 !bg-white/5" onSearch={() => setMobileSearchOpen(false)} />
          </div>
        )}
      </div>
    </header>
  );
}
