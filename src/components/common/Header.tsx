'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
  SheetTrigger,
} from '@/components/ui/sheet';
import { 
  User, 
  Menu, 
  ChevronDown, 
  ShoppingCart as ShoppingCartIcon,
  Search,
  Camera
} from 'lucide-react';
import ShoppingCart from './ShoppingCart';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/context/AuthProvider';
import { Input } from '@/components/ui/input';

/**
 * Navigation Header v5.0 (Restored Visual Parity)
 * - Background: Transparent -> Glassmorphism/Gradient on Scroll
 * - Hover State: Brand Crimson (#8a0b0d)
 */
export default function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!mounted) return null;

  const authRedirect = pathname !== '/auth/login' ? `&redirect=${encodeURIComponent(pathname)}` : '';

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-500 overflow-hidden border-b",
      isScrolled ? "bg-background/90 backdrop-blur-md border-border" : "bg-transparent border-transparent"
    )}>
      {/* Background Layers for Dynamic Transitions */}
      <div className={cn(
        "absolute inset-0 -z-20 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-[length:200%_200%] animate-gradient-x transition-opacity duration-500",
        isScrolled ? "opacity-10" : "opacity-0"
      )} />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Desktop View */}
        <div className={cn(
          "hidden w-full items-center gap-4 lg:flex transition-all duration-500",
          isScrolled ? "h-20" : "h-24"
        )}>
          {/* Logo & Brand Node */}
          <Link href="/" className="flex flex-shrink-0 items-center gap-3 group">
            <div className="relative h-[90px] w-[90px] transition-all duration-500">
              <Image 
                src="/logo Alpha.png" 
                alt="Alpha Electricals & Plumbing Ltd Logo" 
                fill 
                className="object-contain" 
              />
            </div>
            <div className={cn(
              "hidden sm:flex flex-col transition-colors duration-300 group-hover:text-[#8a0b0d]",
              isScrolled ? "text-accent" : "text-white"
            )}>
              <span className="font-bold transition-all text-[20px]">Alpha</span>
              <div className="w-full h-px bg-current"></div>
              <span className="text-[12px] leading-tight">Electricals & Plumbing Ltd</span>
            </div>
          </Link>

          <div className="flex-1 w-full max-w-xl mx-auto px-4" />

          {/* Nav & Actions */}
          <div className="flex items-center justify-end">
            <nav className="flex items-center">
              <div className="relative">
                <Link href="#" className={cn(
                  "flex items-center gap-1 px-3 py-2 whitespace-nowrap font-semibold text-base transition-colors duration-300",
                  isScrolled ? "text-accent hover:text-[#8a0b0d]" : "text-white hover:text-[#8a0b0d]"
                )}>
                  Products <ChevronDown className="h-4 w-4" />
                </Link>
              </div>
              <Link href="/contact" className={cn(
                "px-3 py-2 whitespace-nowrap font-semibold text-base transition-colors duration-300",
                isScrolled ? "text-accent hover:text-[#8a0b0d]" : "text-white hover:text-[#8a0b0d]"
              )}>
                Contact Us
              </Link>
              <Link href="/about" className={cn(
                "px-3 py-2 whitespace-nowrap font-semibold text-base transition-colors duration-300",
                isScrolled ? "text-accent hover:text-[#8a0b0d]" : "text-white hover:text-[#8a0b0d]"
              )}>
                About Us
              </Link>
            </nav>

            <div className="flex items-center ml-2">
                <ShoppingCart 
                  triggerClassName={cn(
                    "h-10 w-10 relative rounded-full font-semibold text-base transition-colors duration-300 [&_svg]:h-7 [&_svg]:w-7",
                    isScrolled ? "text-accent hover:text-[#8a0b0d]" : "text-white hover:text-[#8a0b0d]"
                  )} 
                />
                
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className={cn(
                        "h-10 py-2 w-auto px-3 gap-2 rounded-md font-semibold text-base transition-colors duration-300 [&_svg]:h-7 [&_svg]:w-7",
                        isScrolled ? "text-accent hover:text-[#8a0b0d]" : "text-white hover:text-[#8a0b0d]"
                      )}>
                        {user?.avatarUrl ? (
                          <Avatar className="h-8 w-8 border border-white/20">
                            <AvatarImage src={user.avatarUrl} />
                            <AvatarFallback>{user.username?.charAt(0)}</AvatarFallback>
                          </Avatar>
                        ) : (
                          <User />
                        )}
                        <span className="hidden xl:inline">{user ? user.username : 'Log in'}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl shadow-2xl border-none">
                      {user ? (
                        <>
                          <DropdownMenuLabel className="font-black uppercase tracking-tighter px-4 py-2">{user.username}</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild className="rounded-lg cursor-pointer"><Link href="/profile">Settings</Link></DropdownMenuItem>
                          <DropdownMenuItem asChild className="rounded-lg cursor-pointer"><Link href="/wishlist">Wishlist</Link></DropdownMenuItem>
                          {user.role === 'admin' && <DropdownMenuItem asChild className="rounded-lg cursor-pointer"><Link href="/admin">Dashboard</Link></DropdownMenuItem>}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={logout} className="rounded-lg text-red-500 cursor-pointer">Logout</DropdownMenuItem>
                        </>
                      ) : (
                        <div className="p-2 space-y-2">
                          <Button asChild className="w-full rounded-lg" size="sm"><Link href={`/auth/login?tab=login${authRedirect}`}>Log In</Link></Button>
                          <Button asChild variant="outline" className="w-full rounded-lg" size="sm"><Link href={`/auth/login?tab=signup${authRedirect}`}>Sign Up</Link></Button>
                        </div>
                      )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Mobile View */}
        <div className="w-full lg:hidden flex flex-col py-2 transition-all duration-500">
          <div className="flex w-full items-center justify-between gap-2">
            <Link href="/" className="flex-shrink-0 transition-all duration-500">
              <div className="relative h-[70px] w-[70px]">
                <Image 
                  src="/logo Alpha.png" 
                  alt="Alpha Electricals & Plumbing Ltd Logo" 
                  fill 
                  className="object-contain" 
                />
              </div>
            </Link>

            {/* Hidden Mobile Search State (Matches Snippet structure) */}
            <div className="flex-1 min-w-0 transition-all duration-700 ease-in-out overflow-hidden px-1 opacity-0 max-h-0 -translate-y-4 pointer-events-none">
              <form className="w-full">
                <div className="relative flex items-center w-full p-1 space-x-1 bg-white border border-gray-200 rounded-[1.5rem] shadow-md h-8 pr-1">
                  <Input 
                    type="search" 
                    className="flex-1 pl-4 pr-2 text-[10px] sm:text-xs h-6 sm:h-7 bg-transparent border-none appearance-none focus-visible:ring-0" 
                    placeholder="Search Alpha..." 
                  />
                  <Button variant="ghost" size="icon" className="shrink-0 rounded-full h-6 w-6 sm:h-7 sm:w-7">
                    <Camera className="text-gray-500 w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                  <Button type="submit" className="rounded-full bg-[#28235f] text-white h-6 sm:h-7 px-2 sm:px-3">
                    <Search className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </Button>
                </div>
              </form>
            </div>

            {/* Action Buttons Cluster */}
            <div className="flex items-center flex-shrink-0">
              <ShoppingCart 
                triggerClassName={cn(
                  "h-10 w-10 relative rounded-full font-semibold text-base transition-colors duration-300 [&_svg]:h-6 [&_svg]:w-6",
                  isScrolled ? "text-accent hover:text-[#8a0b0d]" : "text-white hover:text-[#8a0b0d]"
                )} 
              />
              
              <Button variant="ghost" size="icon" asChild className={cn(
                "h-10 w-10 rounded-full transition-colors duration-300 [&_svg]:h-6 [&_svg]:w-6",
                isScrolled ? "text-accent hover:text-[#8a0b0d]" : "text-white hover:text-[#8a0b0d]"
              )}>
                <Link href="/profile">
                  <User />
                </Link>
              </Button>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className={cn(
                    "h-10 w-10 rounded-full transition-colors duration-300 [&_svg]:h-6 [&_svg]:w-6",
                    isScrolled ? "text-accent hover:text-[#8a0b0d]" : "text-white hover:text-[#8a0b0d]"
                  )}>
                    <Menu />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[85%] rounded-l-[3rem] p-0 flex flex-col border-none shadow-2xl">
                  <SheetHeader className="p-6 border-b bg-muted/20">
                    <SheetTitle className="text-left font-black uppercase tracking-tighter">Navigation</SheetTitle>
                    <SheetDescription className="sr-only">Mobile Menu</SheetDescription>
                  </SheetHeader>
                  <ScrollArea className="flex-1 p-6">
                    <div className="flex flex-col gap-6">
                      <SheetClose asChild><Link href="/search" className="text-xl font-bold uppercase hover:text-primary">Products</Link></SheetClose>
                      <SheetClose asChild><Link href="/contact" className="text-xl font-bold uppercase hover:text-primary">Contact Us</Link></SheetClose>
                      <SheetClose asChild><Link href="/about" className="text-xl font-bold uppercase hover:text-primary">About Us</Link></SheetClose>
                      <DropdownMenuSeparator />
                      {user ? (
                        <Button variant="destructive" onClick={logout} className="rounded-2xl h-14 font-black uppercase">Logout</Button>
                      ) : (
                        <div className="grid grid-cols-2 gap-4">
                          <Button asChild className="rounded-2xl h-14 font-black uppercase"><Link href="/auth/login">Login</Link></Button>
                          <Button asChild variant="outline" className="rounded-2xl h-14 font-black uppercase border-2"><Link href="/auth/login?tab=signup">Join</Link></Button>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
