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
  LayoutDashboard, 
  LogOut,
  Settings,
  Heart,
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

/**
 * Navigation Header v4.0
 * - Background: Light Lavender / Muted Translucent White (bg-purple-50/90)
 * - Positioning: Sticky top-0
 * - Accent: Vibrant Pink pill for Products (#EC4899)
 */
export default function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const headerClasses = cn(
    "sticky top-0 left-0 right-0 z-50 w-full h-20 flex items-center bg-purple-50/90 backdrop-blur-md border-b border-purple-100 shadow-sm"
  );

  const authRedirect = pathname !== '/auth/login' ? `&redirect=${encodeURIComponent(pathname)}` : '';

  return (
    <header className={headerClasses}>
      <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between h-full">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="relative h-10 w-10 bg-purple-600 rounded-lg p-1.5 shadow-md">
            <Image src="/logo Alpha.png" alt="Alpha" fill className="object-contain p-1 invert brightness-0" />
          </div>
          <span className="font-black text-lg tracking-tighter text-[#2b235f] uppercase leading-none">
            Alpha Electricals & Plumbing Ltd
          </span>
        </Link>
        
        {/* Desktop Nav Actions */}
        <div className="hidden lg:flex items-center gap-8">
            <nav className="flex items-center gap-6">
                <Link 
                  href="/search" 
                  className="bg-[#EC4899] text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-[#db2777] transition-all shadow-md hover:scale-105 active:scale-95"
                >
                  Products
                </Link>
                <Link href="/contact" className="text-xs font-black text-[#2b235f] hover:text-[#7E22CE] transition-all uppercase tracking-widest">Contact</Link>
                <Link href="/about" className="text-xs font-black text-[#2b235f] hover:text-[#7E22CE] transition-all uppercase tracking-widest">About</Link>
            </nav>

            <div className="flex items-center gap-3">
                <ShoppingCart triggerClassName="text-[#2b235f] hover:bg-purple-100" />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="p-0 h-10 w-10 rounded-full hover:bg-purple-100 transition-colors">
                        {user?.avatarUrl ? (
                            <Avatar className="h-8 w-8 border border-purple-200">
                                <AvatarImage src={user.avatarUrl} alt={user.username} className="object-cover" />
                                <AvatarFallback className="bg-purple-600 text-white text-[10px]">{user.username?.charAt(0)}</AvatarFallback>
                            </Avatar>
                        ) : (
                            <User className="h-5 w-5 text-[#2b235f]" />
                        )}
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl shadow-2xl border-none">
                    {user ? (
                        <>
                        <DropdownMenuLabel className="font-black text-accent uppercase tracking-tighter px-4 py-2">{user.username}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild className="rounded-lg px-4 py-2 cursor-pointer"><Link href="/profile" className="flex items-center gap-3"><Settings size={16}/> Settings</Link></DropdownMenuItem>
                        <DropdownMenuItem asChild className="rounded-lg px-4 py-2 cursor-pointer"><Link href="/wishlist" className="flex items-center gap-3"><Heart size={16}/> Wishlist</Link></DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logout} className="rounded-lg px-4 py-2 text-destructive focus:bg-destructive/5 flex items-center gap-3 cursor-pointer"><LogOut size={16}/> Logout</DropdownMenuItem>
                        </>
                    ) : (
                        <div className="p-2 space-y-2">
                            <Button asChild className="w-full rounded-lg" size="sm">
                                <Link href={`/auth/login?tab=login${authRedirect}`}>Log In</Link>
                            </Button>
                            <Button asChild variant="outline" className="w-full rounded-lg" size="sm">
                                <Link href={`/auth/login?tab=signup${authRedirect}`}>Sign Up</Link>
                            </Button>
                        </div>
                    )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>

        {/* Mobile View */}
        <div className="lg:hidden flex items-center gap-2">
            <ShoppingCart triggerClassName="text-[#2b235f]" />
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full text-[#2b235f] hover:bg-purple-100">
                        <Menu className="h-6 w-6" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[85%] rounded-l-3xl p-0 flex flex-col border-none shadow-2xl">
                    <SheetHeader className="p-6 border-b bg-purple-50">
                        <SheetTitle className="flex items-center gap-3">
                             <span className="font-black text-[#2b235f] tracking-tighter uppercase">ALPHA NAVIGATION</span>
                        </SheetTitle>
                        <SheetDescription className="sr-only">Mobile navigation menu</SheetDescription>
                    </SheetHeader>
                    
                    <ScrollArea className="flex-1 p-6">
                        <div className="flex flex-col gap-4">
                            <SheetClose asChild>
                              <Link href="/search" className="bg-[#EC4899] text-white p-4 rounded-2xl text-center font-black uppercase tracking-widest text-sm">Products</Link>
                            </SheetClose>
                            <SheetClose asChild>
                                <Link href="/contact" className="p-4 font-bold text-accent uppercase text-sm tracking-tight border rounded-2xl hover:bg-muted">Contact Us</Link>
                            </SheetClose>
                            <SheetClose asChild>
                                <Link href="/about" className="p-4 font-bold text-accent uppercase text-sm tracking-tight border rounded-2xl hover:bg-muted">About Us</Link>
                            </SheetClose>
                            <DropdownMenuSeparator className="my-2" />
                            {user ? (
                                <>
                                    <SheetClose asChild>
                                        <Link href="/profile" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-muted font-bold text-accent">
                                            <Settings className="h-5 w-5" /> Account Settings
                                        </Link>
                                    </SheetClose>
                                    <Button variant="ghost" onClick={logout} className="justify-start gap-4 p-4 h-auto text-red-500 hover:text-red-600 hover:bg-red-50 rounded-2xl font-black uppercase text-xs tracking-widest mt-4">
                                        <LogOut className="h-5 w-5" /> Logout
                                    </Button>
                                </>
                            ) : (
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <SheetClose asChild>
                                        <Button asChild className="rounded-2xl h-12 font-black uppercase tracking-widest"><Link href="/auth/login">Login</Link></Button>
                                    </SheetClose>
                                    <SheetClose asChild>
                                        <Button asChild variant="outline" className="rounded-2xl h-12 font-black uppercase tracking-widest border-2"><Link href="/auth/login?tab=signup">Join</Link></Button>
                                    </SheetClose>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  );
}
