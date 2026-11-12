
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
  ShieldCheck,
  LayoutGrid,
  ChevronRight
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
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
 * MenuLink sub-component for the Account Dropdown
 */
const MenuLink = ({ href, label }: { href: string, label: string }) => (
  <NextLink 
    href={href} 
    className="text-[13px] font-bold text-slate-700 hover:text-primary py-2.5 transition-colors flex items-center justify-between group/link"
  >
    {label}
    <span className="text-slate-300 group-hover/link:translate-x-0.5 transition-all duration-300 font-normal">›</span>
  </NextLink>
);

/**
 * AccountMenuContent: Shared component for both desktop and mobile dropdowns
 */
const AccountMenuContent = ({ user, logout, isMounted }: { user: any, logout: () => void, isMounted: boolean }) => (
  <div className="bg-white rounded-2xl p-5 overflow-hidden">
    {!isMounted || !user ? (
      <div className="space-y-4 mb-6">
        <NextLink href="/auth/login" className="block group/auth">
          <h3 className="text-xl font-black text-accent uppercase tracking-tighter group-hover/auth:text-primary transition-colors flex items-center justify-between">
            Sign in
            <ChevronRight size={20} className="text-slate-300" />
          </h3>
        </NextLink>
        <NextLink href="/auth/login?tab=signup" className="block">
          <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl px-4 py-3 text-[11px] font-black uppercase tracking-wider flex items-center justify-between hover:bg-emerald-100 transition-all hover:scale-[1.02]">
            Register & Get Points 
            <span className="text-lg">›</span>
          </div>
        </NextLink>
      </div>
    ) : (
      <div className="mb-6 pb-4 border-b border-slate-50 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black uppercase text-sm">
          {user.name?.charAt(0) || user.username?.charAt(0)}
        </div>
        <div className="flex flex-col min-w-0">
          <p className="font-black text-accent uppercase tracking-tight truncate text-sm">
            {user.name || user.username}
          </p>
          <p className="text-[10px] text-muted-foreground truncate font-medium">
            {user.email}
          </p>
        </div>
      </div>
    )}

    {/* Navigation Cluster */}
    <nav className="flex flex-col">
      <MenuLink href="/orders" label="My Order" />
      <MenuLink href="/profile" label="Personal Information" />
      <MenuLink href="/wishlist" label="My Wish" />
      <MenuLink href="/points" label="My Explorer Points" />
      <MenuLink href="/coupons" label="Coupons Center" />
      <MenuLink href="/addresses" label="Address Management" />
      <MenuLink href="/my-reviews" label="Product Reviews" />
    </nav>

    {isMounted && user && (
      <button 
        onClick={() => logout()}
        className="w-full mt-4 pt-4 border-t border-slate-50 text-left text-[11px] font-black text-red-500 uppercase tracking-widest hover:text-red-600 transition-colors flex items-center justify-between group/out"
      >
        Sign Out
        <X size={14} className="opacity-40 group-hover/out:rotate-90 transition-transform" />
      </button>
    )}
  </div>
);

/**
 * High-Fidelity Header v24.1 (Ecosystem v4.5.2):
 * - Mobile Account Hub: Added DropdownMenu for touch-responsive account actions.
 * - Forefront Intelligence: Boosted z-index for both mobile and desktop account menus to z-110.
 * - Global Layering: Boosted header z-index to z-100 to ensure primacy over all page content.
 */
export default function Header() {
  const { user, logout } = useAuth();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [isAccountHovered, setIsAccountHovered] = useState(false);
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
        "sticky top-0 z-[100] w-full transition-all duration-500 border-b flex items-center h-24 lg:h-32",
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
                      Categories <ChevronDown className="h-3 w-3" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="rounded-2xl p-2 w-64 bg-white border-slate-200 shadow-2xl z-[110]">
                    <DropdownMenuItem asChild className="cursor-pointer py-3 rounded-xl font-bold text-[#28235f] hover:text-primary hover:bg-primary/5"><NextLink href="/category/tanks">Water Tanks</NextLink></DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer py-3 rounded-xl font-bold text-[#28235f] hover:text-primary hover:bg-primary/5"><NextLink href="/category/plumbing">Plumbing Equipment</NextLink></DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer py-3 rounded-xl font-bold text-[#28235f] hover:text-primary hover:bg-primary/5"><NextLink href="/category/lighting">Lighting & Electrical</NextLink></DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer py-3 rounded-xl font-bold text-[#28235f] hover:text-primary hover:bg-primary/5"><NextLink href="/category/roofing">Roofing & Construction</NextLink></DropdownMenuItem>
                    <DropdownMenuSeparator className="my-2 bg-slate-100" />
                    <DropdownMenuItem asChild className="cursor-pointer py-3 rounded-xl font-black text-primary hover:bg-primary/5 uppercase text-[12px] tracking-widest">
                      <NextLink href="/search" className="flex items-center gap-2">
                        <LayoutGrid size={14} /> Catalogue
                      </NextLink>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <button className="px-4 py-2 bg-white border border-purple-500 rounded-xl font-bold flex items-center gap-2 uppercase text-[12px] tracking-widest text-[#28235f] opacity-50">
                  Categories <ChevronDown className="h-3 w-3" />
                </button>
              )}
              <NextLink href="/contact" className="px-3 py-2 font-bold transition-colors uppercase text-[12px] tracking-widest text-[#28235f] hover:text-primary">Contact Us</NextLink>
              <NextLink href="/about" className="px-3 py-2 font-bold transition-colors uppercase text-[12px] tracking-widest text-[#28235f] hover:text-primary">About Us</NextLink>
            </nav>

            <div className="flex items-center gap-3">
              <ShoppingCartComponent triggerClassName="h-10 w-10 transition-all border border-[#28235f]/10 text-[#28235f] hover:text-primary hover:bg-primary/5 shadow-sm hover:shadow-md" />
              
              {/* DESKTOP ACCOUNT HUB (Hover Triggered) */}
              <div 
                className="relative group h-12 flex items-center z-[110]"
                onMouseEnter={() => setIsAccountHovered(true)}
                onMouseLeave={() => setIsAccountHovered(false)}
              >
                <div className={cn(
                  "cursor-pointer flex items-center h-10 px-4 rounded-xl gap-2 font-black border transition-all duration-300",
                  isAccountHovered || (user && isMounted)
                    ? "border-primary/20 bg-primary/5 text-primary shadow-inner" 
                    : "border-[#28235f]/10 text-[#28235f] bg-white shadow-sm"
                )}>
                  <User className="h-5 w-5" />
                  <span className="hidden xl:inline uppercase text-[11px] tracking-widest">
                    {isMounted && user ? (user.username || 'Profile') : 'Log in'}
                  </span>
                </div>

                {/* Dropdown Menu Node */}
                <div className={cn(
                  "absolute right-0 top-full pt-2 w-72 transition-all duration-300 transform origin-top-right z-[120]",
                  isAccountHovered ? "opacity-100 scale-100 visible translate-y-0" : "opacity-0 scale-95 invisible -translate-y-2"
                )}>
                  <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100">
                    <AccountMenuContent user={user} logout={logout} isMounted={isMounted} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE VIEW (Ecosystem v4.5.2 Optimized) */}
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
            
            {/* MOBILE ACCOUNT HUB (Click Activated) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 border border-[#28235f]/10 rounded-full text-[#28235f] flex items-center justify-center hover:text-primary shrink-0">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[85vw] max-w-[320px] rounded-[2rem] shadow-2xl border-slate-100 z-[120] mt-2">
                <AccountMenuContent user={user} logout={logout} isMounted={isMounted} />
              </DropdownMenuContent>
            </DropdownMenu>

            {isMounted ? (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-10 w-10 border border-[#28235f]/10 rounded-full text-[#28235f] flex items-center justify-center hover:text-primary shrink-0">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-white border-l-slate-100 text-[#28235f] rounded-l-[3rem] shadow-2xl z-[130]">
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
