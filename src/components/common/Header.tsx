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
import { useAuth } from '@/context/AuthProvider';
import ShoppingCartComponent from './ShoppingCart';
import HeroSearch from './HeroSearch';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

/**
 * Sticky Navigation Header v9.1:
 * Strictly locked to top-0 after the banner scrolls past.
 * Features centered search for desktop and lateral morphing search for mobile.
 */
export default function Header({ className }: { className?: string }) {
  const { user } = useAuth();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
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
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-500 overflow-hidden bg-[#0b0f19] border-b border-white/10 h-24 lg:h-32",
      className
    )}>
      
      {/* Background Polish Layer */}
      <div className="absolute inset-0 -z-10 bg-background/95 backdrop-blur-md" />

      <div className="container mx-auto px-4 relative z-10 h-full">
        {/* DESKTOP VIEW */}
        <div className="hidden w-full items-center justify-between gap-8 lg:flex h-full">
          <NextLink href="/" className="flex flex-shrink-0 items-center gap-3 group">
            <div className="relative h-[80px] w-[80px] lg:h-[100px] lg:w-[100px]">
                <Image 
                  src="/logo Alpha.png" 
                  alt="Alpha Logo" 
                  fill
                  className="object-contain transition-all duration-500"
                />
            </div>
            <div className="flex flex-col text-white transition-colors duration-300 group-hover:text-[#8a0b0d]">
              <span className="font-black text-2xl lg:text-3xl leading-tight uppercase tracking-tighter">Alpha</span>
              <div className="w-full h-px bg-current opacity-40"></div>
              <span className="text-[10px] lg:text-xs leading-tight font-bold uppercase tracking-widest">Electricals & Plumbing Ltd</span>
            </div>
          </NextLink>

          {/* Centered Search Engine */}
          <div className="flex-1 max-w-xl mx-auto transition-all duration-500">
             <HeroSearch compact={true} />
          </div>

          <div className="flex items-center gap-6">
            <nav className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="px-3 py-2 font-bold transition-colors flex items-center gap-1 uppercase text-sm tracking-widest text-white hover:text-[#8a0b0d]">
                    Products <ChevronDown className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="rounded-2xl p-2 w-64 bg-background border-border">
                   <DropdownMenuItem asChild className="cursor-pointer py-3"><NextLink href="/category/tanks">Water Tanks</NextLink></DropdownMenuItem>
                   <DropdownMenuItem asChild className="cursor-pointer py-3"><NextLink href="/category/plumbing">Plumbing Equipment</NextLink></DropdownMenuItem>
                   <DropdownMenuItem asChild className="cursor-pointer py-3"><NextLink href="/category/lighting">Lighting & Electrical</NextLink></DropdownMenuItem>
                   <DropdownMenuItem asChild className="cursor-pointer py-3"><NextLink href="/category/roofing">Roofing & Construction</NextLink></DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <NextLink href="/contact" className="px-3 py-2 font-bold transition-colors uppercase text-sm tracking-widest text-white hover:text-[#8a0b0d]">Contact Us</NextLink>
              <NextLink href="/about" className="px-3 py-2 font-bold transition-colors uppercase text-sm tracking-widest text-white hover:text-[#8a0b0d]">About Us</NextLink>
            </nav>

            <div className="flex items-center gap-4">
              <ShoppingCartComponent triggerClassName="h-11 w-11 transition-colors border border-white/10 text-white hover:bg-white/5" />
              
              <NextLink href="/profile">
                <Button 
                  variant="ghost" 
                  className="h-11 px-6 rounded-xl gap-3 font-bold border border-white/10 text-white hover:bg-white/5"
                >
                  <User className="h-6 w-6" />
                  <span className="hidden xl:inline uppercase text-xs tracking-widest">Log in</span>
                </Button>
              </NextLink>
            </div>
          </div>
        </div>

        {/* MOBILE VIEW */}
        <div className="w-full lg:hidden flex items-center justify-between h-full gap-4">
          <NextLink href="/" className={cn("flex-shrink-0 transition-all duration-500", mobileSearchOpen ? "opacity-20 pointer-events-none" : "opacity-100")}>
            <Image src="/logo Alpha.png" alt="Alpha Logo" width={75} height={75} className="h-auto" />
          </NextLink>

          <div className="flex-1 flex items-center justify-end gap-3 h-full overflow-hidden">
            {/* Morphing Bubble Search Trigger */}
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
                <Button 
                  type="button"
                  variant="ghost" 
                  size="icon" 
                  className={cn(
                    "h-10 w-10 rounded-full transition-all duration-500 shrink-0 text-white",
                    mobileSearchOpen && "bg-[#2b235f] h-9 w-9 mr-1"
                  )}
                  onClick={() => {
                    if (mobileSearchOpen && searchQuery) handleSearchSubmit({ preventDefault: () => {} } as any);
                    else setMobileSearchOpen(!mobileSearchOpen);
                  }}
                >
                  {mobileSearchOpen ? <X className="h-5 w-5 animate-in spin-in-90" /> : <Search className="h-6 w-6" />}
                </Button>
              </form>
            </div>

            <div className={cn("flex items-center gap-2 transition-all duration-500", mobileSearchOpen ? "opacity-0 translate-x-10 pointer-events-none" : "opacity-100 translate-x-0")}>
              <ShoppingCartComponent triggerClassName="h-11 w-11 border border-white/10 rounded-full text-white" />
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-11 w-11 border border-white/10 rounded-full text-white">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-[#0b0f19] border-l-white/10 text-white rounded-l-[3rem]">
                  <SheetHeader>
                    <SheetTitle className="text-white text-left font-black uppercase tracking-widest">Navigation</SheetTitle>
                    <SheetDescription className="sr-only">Alpha Main Menu</SheetDescription>
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
