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
  ShieldCheck
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
import { useAuth } from '@/context/AuthProvider';

/**
 * High-Fidelity Header v23.4 (Ecosystem v4.3.0):
 * - Hydration Optimized: Uses isMounted check to prevent Radix ID mismatches.
 * - Logo Resilience: Logo remains visible during search expansion.
 * - Mobile User Hub: Dedicated Account icon added to mobile action cluster.
 * - Role-Aware UI: Shows "Admin" link for privileged users.
 * - Interactive Branding: Entire text highlights teal on hover/click.
 */
export default function Header() {
  const { user } = useAuth();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
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

  const isAdmin = user?.role === 'admin' || user?.role === 'staff';

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500 overflow-hidden border-b flex items-center h-24 lg:h-32",
        isScrolled ? "border-slate-200/60" : "border-transparent bg-slate-50/40"
      )}
    >
      {/* LAYER 1 (Bottom): Animated Gradient Background */}
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
          {/* Scaled Logo & Branding Block (Left) */}
          <NextLink href="/" className="flex flex-shrink-0 items-center gap-4 group">
            <div className="relative h-[110px] w-[110px]">
                <Image 
                  src="/logo Alpha.png" 
                  alt="Alpha Logo" 
                  fill
                  className="object-contain transition-all duration-500"
                />
            </div>
            <div className="flex flex-col transition-all duration-300 text-[#28235f] group-hover:text-primary active:text-primary">
              <span className="font-bold text-3xl leading-tight transition-all uppercase tracking-tighter">Alpha</span>
              <div className="w-full h-0.5 bg-current my-1 opacity-20"></div>
              <span className="text-[12px] leading-tight font-black uppercase tracking-[0.2em]">Electricals & Plumbing Ltd</span>
            </div>
          </NextLink>

          {/* Centered Search Engine (Middle) */}
          <div className="flex-1 max-w-lg mx-auto px-6">
             <HeroSearch compact={true} className="h-12" />
          </div>

          {/* Compact Navigation & Actions (Right) */}
          <div className="flex items-center gap-4">
            <nav className="flex items-center gap-3">
              {isMounted && isAdmin && (
                <NextLink href="/admin" className="px-3 py-2 font-black transition-colors uppercase text-[12px] tracking-widest text-primary flex items-center gap-1.5 hover:opacity-80">
                  <ShieldCheck size={14} /> Admin
                </NextLink>
              )}
              {isMounted ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="px-4 py-2 bg-white border border-purple-500 rounded-xl font-bold transition-all flex items-center gap-2 uppercase text-[12px] tracking-widest text-[#28235f] hover:bg-purple-50 shadow-sm">
                      Products <ChevronDown className="h-3 w-3" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="rounded-2xl p-2 w-64 bg-white border-slate-200 shadow-2xl">
                    <DropdownMenuItem asChild className="cursor-pointer py-3 rounded-xl font-bold text-[#28235f] hover:text-primary hover:bg-primary/5"><NextLink href="/category/tanks">Water Tanks</NextLink></DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer py-3 rounded-xl font-bold text-[#28235f] hover:text-primary hover:bg-primary/5"><NextLink href="/category/plumbing">Plumbing Equipment</NextLink></DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer py-3 rounded-xl font-bold text-[#28235f] hover:text-primary hover:bg-primary/5"><NextLink href="/category/lighting">Lighting & Electrical</NextLink></DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer py-3 rounded-xl font-bold text-[#28235f] hover:text-primary hover:bg-primary/5"><NextLink href="/category/roofing">Roofing & Construction</NextLink></DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <button className="px-4 py-2 bg-white border border-purple-500 rounded-xl font-bold flex items-center gap-2 uppercase text-[12px] tracking-widest text-[#28235f] opacity-50">
                  Products <ChevronDown className="h-3 w-3" />
                </button>
              )}
              <NextLink href="/contact" className="px-3 py-2 font-bold transition-colors uppercase text-[12px] tracking-widest text-[#28235f] hover:text-primary">Contact Us</NextLink>
              <NextLink href="/about" className="px-3 py-2 font-bold transition-colors uppercase text-[12px] tracking-widest text-[#28235f] hover:text-primary">About Us</NextLink>
            </nav>

            <div className="flex items-center gap-3">
              <ShoppingCartComponent triggerClassName="h-10 w-10 transition-all border border-[#28235f]/10 text-[#28235f] hover:text-primary hover:bg-primary/5 shadow-sm hover:shadow-md" />
              <NextLink href={user ? "/profile" : "/auth/login"}>
                <Button 
                  variant="ghost" 
                  className="h-10 px-4 rounded-xl gap-2 font-black border border-[#28235f]/10 text-[#28235f] hover:text-primary hover:bg-primary/5 shadow-sm hover:shadow-md"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden xl:inline uppercase text-[11px] tracking-widest">
                    {user ? (user.username || 'Profile') : 'Log in'}
                  </span>
                </Button>
              </NextLink>
            </div>
          </div>
        </div>

        {/* MOBILE VIEW (Ecosystem v4.3.0 Standard) */}
        <div className="w-full lg:hidden flex items-center justify-between h-20 gap-3">
          <NextLink 
            href="/" 
            className="flex items-center gap-2 group transition-all duration-500 shrink-0"
          >
             <div className="flex-shrink-0">
                <Image src="/logo Alpha.png" alt="Alpha Logo" width={55} height={55} className="h-auto" />
            </div>
            <div className={cn(
                "flex flex-col text-[#28235f] group-hover:text-primary active:text-primary transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]",
                mobileSearchOpen ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
            )}>
                <span className="font-black text-xl leading-tight uppercase tracking-tighter">Alpha</span>
                <div className="w-full h-px bg-current opacity-20 my-0.5"></div>
                <span className="text-[7px] leading-tight font-black uppercase tracking-widest">Electricals & Plumbing Ltd</span>
            </div>
          </NextLink>

          <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
            <form 
              onSubmit={handleSearchSubmit} 
              className={cn(
                "flex items-center rounded-full transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]",
                mobileSearchOpen 
                  ? "flex-1 min-w-[140px] max-w-[280px] bg-white border border-slate-200 px-2 shadow-xl ring-4 ring-purple-500/5" 
                  : "w-10 h-10 bg-transparent border border-[#28235f]/10 justify-center"
              )}
            >
              <input 
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "bg-transparent border-none text-[#28235f] focus:outline-none text-xs h-full transition-all duration-500",
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
                  mobileSearchOpen ? "text-[#28235f] hover:bg-slate-100" : "text-[#28235f] hover:text-primary hover:bg-primary/5"
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

            <ShoppingCartComponent triggerClassName="h-10 w-10 border border-[#28235f]/10 rounded-full text-[#28235f] flex items-center justify-center hover:text-primary shrink-0" />
            
            {/* Mobile Account Icon */}
            <NextLink href={user ? "/profile" : "/auth/login"}>
              <Button variant="ghost" size="icon" className="h-10 w-10 border border-[#28235f]/10 rounded-full text-[#28235f] flex items-center justify-center hover:text-primary shrink-0">
                <User className="h-5 w-5" />
              </Button>
            </NextLink>

            {isMounted ? (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-10 w-10 border border-[#28235f]/10 rounded-full text-[#28235f] flex items-center justify-center hover:text-primary shrink-0">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-white border-l-slate-100 text-[#28235f] rounded-l-[3rem] shadow-2xl">
                  <SheetHeader>
                    <SheetTitle className="text-[#28235f] text-left">
                      <NextLink href="/" className="flex items-center gap-4 group">
                        <div className="relative h-[80px] w-[80px]">
                            <Image 
                              src="/logo Alpha.png" 
                              alt="Alpha Logo" 
                              fill
                              className="object-contain transition-all duration-500"
                            />
                        </div>
                        <div className="flex flex-col transition-colors duration-300 group-hover:text-primary">
                          <span className="font-bold text-2xl leading-tight uppercase tracking-tighter">Alpha</span>
                          <div className="w-full h-px bg-current opacity-20 my-1"></div>
                          <span className="text-[10px] leading-tight font-black uppercase tracking-[0.2em]">Electricals & Plumbing Ltd</span>
                        </div>
                      </NextLink>
                    </SheetTitle>
                    <SheetDescription className="sr-only">Main Navigation</SheetDescription>
                  </SheetHeader>
                  <div className="flex flex-col gap-6 pt-12">
                    {isAdmin && (
                      <SheetClose asChild><NextLink href="/admin" className="text-2xl font-black uppercase tracking-tighter text-primary hover:opacity-80 transition-colors flex items-center gap-2">
                        <ShieldCheck size={20} /> Admin Dashboard
                      </NextLink></SheetClose>
                    )}
                    <SheetClose asChild><NextLink href="/search" className="text-2xl font-black uppercase tracking-tighter hover:text-primary transition-colors">Product Catalogue</NextLink></SheetClose>
                    <SheetClose asChild><NextLink href="/contact" className="text-2xl font-black uppercase tracking-tighter hover:text-primary transition-colors">Contact Node</NextLink></SheetClose>
                    <SheetClose asChild><NextLink href="/about" className="text-2xl font-black uppercase tracking-tighter hover:text-primary transition-colors">About Us</NextLink></SheetClose>
                    <div className="h-px bg-slate-100" />
                    <SheetClose asChild><NextLink href="/wishlist" className="text-xl font-bold uppercase tracking-tight text-slate-500 hover:text-primary transition-colors">My Favorites</NextLink></SheetClose>
                    <SheetClose asChild><NextLink href="/profile" className="text-xl font-bold uppercase tracking-tight text-slate-500 hover:text-primary transition-colors">Member Profile</NextLink></SheetClose>
                  </div>
                </SheetContent>
              </Sheet>
            ) : (
              <Button variant="ghost" size="icon" className="h-10 w-10 border border-[#28235f]/10 rounded-full text-[#28235f] flex items-center justify-center opacity-50 shrink-0">
                <Menu className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
