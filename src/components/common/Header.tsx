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

/**
 * Specification-Compliant Sticky Header v4.2
 * - Positioning: sticky top-10 (40px) to stack correctly below the Fixed TopBanner.
 * - Transitions: Dynamic opacity layers (gradient and glassmorphism) triggered on scroll.
 * - Branding: High-res logo block with horizontal separator and crimson hover states.
 */
export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();
  const { totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinkClass = cn(
    "px-3 py-2 whitespace-nowrap font-semibold text-base transition-all duration-300",
    isScrolled ? "text-accent hover:text-[#8a0b0d]" : "text-white hover:text-[#8a0b0d]"
  );

  return (
    <header className="sticky top-10 z-50 w-full transition-all duration-500 overflow-hidden bg-transparent border-b border-transparent">
      {/* Background Layer 1: Gradient (Triggered on Scroll) */}
      <div className={cn(
        "absolute inset-0 -z-20 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-[length:200%_200%] animate-gradient-x transition-opacity duration-500",
        isScrolled ? "opacity-100" : "opacity-0"
      )} />
      
      {/* Background Layer 2: Glassmorphism (Triggered on Scroll) */}
      <div className={cn(
        "absolute inset-0 -z-10 bg-background/90 backdrop-blur-md transition-opacity duration-500",
        isScrolled ? "opacity-100 shadow-md" : "opacity-0"
      )} />

      <div className="container mx-auto px-4 relative z-10">
        {/* DESKTOP VIEW (LG+) */}
        <div className={cn(
          "hidden w-full items-center gap-4 lg:flex transition-all duration-500",
          isScrolled ? "h-20" : "h-24"
        )}>
          {/* Logo & Branding Block */}
          <NextLink href="/" className="flex flex-shrink-0 items-center gap-3 group">
            <div className="relative h-[90px] w-[90px] transition-all duration-500">
                <Image 
                src="/logo Alpha.png" 
                alt="Alpha Electricals & Plumbing Ltd Logo" 
                fill
                className={cn("object-contain transition-all duration-500", isScrolled ? "scale-90" : "scale-100")}
                />
            </div>
            <div className={cn(
              "hidden sm:flex flex-col transition-colors duration-300 group-hover:text-[#8a0b0d]",
              isScrolled ? "text-accent" : "text-white"
            )}>
              <span className="font-bold text-[20px] leading-tight">Alpha</span>
              <div className="w-full h-px bg-current opacity-40"></div>
              <span className="text-[12px] leading-tight font-medium">Electricals & Plumbing Ltd</span>
            </div>
          </NextLink>

          <div className="flex-1" />

          {/* Navigation Hub */}
          <div className="flex items-center justify-end">
            <nav className="flex items-center mr-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className={navLinkClass}>
                    Products <ChevronDown className="inline-block ml-1 h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="rounded-2xl p-2 w-56">
                   <DropdownMenuItem asChild><NextLink href="/category/tanks">Water Tanks</NextLink></DropdownMenuItem>
                   <DropdownMenuItem asChild><NextLink href="/category/plumbing">Plumbing Equipment</NextLink></DropdownMenuItem>
                   <DropdownMenuItem asChild><NextLink href="/category/lighting">Lighting & Electrical</NextLink></DropdownMenuItem>
                   <DropdownMenuItem asChild><NextLink href="/category/roofing">Roofing & Construction</NextLink></DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <NextLink href="/contact" className={navLinkClass}>Contact Us</NextLink>
              <NextLink href="/about" className={navLinkClass}>About Us</NextLink>
            </nav>

            {/* Global Actions */}
            <div className="flex items-center gap-1">
              <ShoppingCartComponent triggerClassName={cn(
                "h-10 w-10 relative rounded-full transition-all duration-300 hover:bg-accent/10",
                isScrolled ? "text-accent" : "text-white"
              )} />
              
              <NextLink href="/profile">
                <Button 
                  variant="ghost" 
                  className={cn(
                    "h-10 px-4 rounded-xl gap-2 font-semibold text-base transition-all duration-300",
                    isScrolled ? "text-accent hover:text-[#8a0b0d]" : "text-white hover:text-[#8a0b0d]"
                  )}
                >
                  <User className="h-5 w-5" />
                  <span className="hidden xl:inline">Account</span>
                </Button>
              </NextLink>
            </div>
          </div>
        </div>

        {/* MOBILE VIEW (<LG) */}
        <div className="w-full lg:hidden flex flex-col py-2 transition-all duration-500">
          <div className="flex w-full items-center justify-between gap-2">
            <NextLink href="/" className="flex-shrink-0 transition-all duration-500">
              <Image 
                src="/logo Alpha.png" 
                alt="Alpha Logo" 
                width={70} 
                height={70} 
                className="h-auto"
              />
            </NextLink>

            <div className="flex items-center flex-shrink-0 gap-1">
              <ShoppingCartComponent triggerClassName={cn(
                "h-10 w-10 relative rounded-full hover:bg-accent/10 transition-colors",
                isScrolled ? "text-accent" : "text-white"
              )} />

              <NextLink href="/profile">
                <Button variant="ghost" size="icon" className={cn(
                  "h-10 w-10 rounded-full hover:bg-accent/10 transition-colors",
                  isScrolled ? "text-accent" : "text-white"
                )}>
                  <User className="h-6 w-6" />
                </Button>
              </NextLink>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className={cn(
                    "h-10 w-10 rounded-full hover:bg-accent/10 transition-colors",
                    isScrolled ? "text-accent" : "text-white"
                  )}>
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="rounded-l-[2rem]">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                    <SheetDescription className="sr-only">Main Navigation</SheetDescription>
                  </SheetHeader>
                  <div className="flex flex-col gap-6 pt-10">
                    <SheetClose asChild><NextLink href="/search" className="text-xl font-bold">All Products</NextLink></SheetClose>
                    <SheetClose asChild><NextLink href="/contact" className="text-xl font-bold">Contact Us</NextLink></SheetClose>
                    <SheetClose asChild><NextLink href="/about" className="text-xl font-bold">About Us</NextLink></SheetClose>
                    <div className="h-px bg-muted" />
                    <SheetClose asChild><NextLink href="/wishlist" className="text-xl font-bold">My Wishlist</NextLink></SheetClose>
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
