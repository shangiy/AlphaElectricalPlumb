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
  ChevronDown
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

export default function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const navLinks = [
    { name: 'Products', href: '/search', hasDropdown: true },
    { name: 'Contact Us', href: '/contact' },
    { name: 'About Us', href: '/about' },
  ];
  
  const headerClasses = cn(
    "absolute top-10 md:top-12 left-0 right-0 z-40 w-full transition-all duration-300 h-24 flex items-center bg-transparent"
  );

  const authRedirect = pathname !== '/auth/login' ? `&redirect=${encodeURIComponent(pathname)}` : '';

  return (
    <header className={headerClasses}>
      <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between h-full">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-4 group shrink-0">
            <div className="bg-white/10 backdrop-blur-md p-1.5 rounded-lg border border-white/20">
                <Image src="/logo Alpha.png" alt="Alpha" width={48} height={48} className="transition-transform group-hover:scale-110" />
            </div>
            <div className="flex flex-col">
                <span className="font-black text-2xl tracking-tighter text-white leading-none">Alpha</span>
                <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest border-t border-white/20 mt-1 pt-1">ELECTRICALS & PLUMBING</span>
            </div>
        </Link>
        
        {/* Desktop Nav Actions */}
        <div className="hidden lg:flex items-center gap-10">
            <nav className="flex items-center gap-8">
                {navLinks.map((link) => (
                    <Link 
                      key={link.name} 
                      href={link.href} 
                      className="text-sm font-black text-white hover:text-primary transition-all flex items-center gap-1 uppercase tracking-tight"
                    >
                        {link.name}
                        {link.hasDropdown && <ChevronDown size={14} className="opacity-50" />}
                    </Link>
                ))}
            </nav>

            <div className="flex items-center gap-4">
                <ShoppingCart triggerClassName="text-white hover:bg-white/10" />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="p-0 h-10 w-10 rounded-full hover:bg-white/10 transition-colors flex items-center gap-2">
                        {user?.avatarUrl ? (
                            <Avatar className="h-9 w-9 border border-white/20 shadow-xl">
                                <AvatarImage src={user.avatarUrl} alt={user.username} className="object-cover" />
                                <AvatarFallback className="bg-accent text-white">{user.username?.charAt(0)}</AvatarFallback>
                            </Avatar>
                        ) : (
                            <div className="flex items-center gap-2 text-white">
                                <User className="h-6 w-6" />
                                <span className="text-sm font-black uppercase tracking-tight">Log in</span>
                            </div>
                        )}
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl shadow-2xl border-none">
                    {user ? (
                        <>
                        <DropdownMenuLabel className="font-black text-accent uppercase tracking-tighter px-4 py-2">{user.username}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild className="rounded-lg px-4 py-2"><Link href="/profile" className="flex items-center gap-3"><Settings size={16}/> Settings</Link></DropdownMenuItem>
                        <DropdownMenuItem asChild className="rounded-lg px-4 py-2"><Link href="/wishlist" className="flex items-center gap-3"><Heart size={16}/> Wishlist</Link></DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logout} className="rounded-lg px-4 py-2 text-destructive focus:bg-destructive/5 flex items-center gap-3"><LogOut size={16}/> Logout</DropdownMenuItem>
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
            <ShoppingCart triggerClassName="text-white" />
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-white/10">
                        <Menu className="h-6 w-6" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[85%] rounded-l-3xl p-0 flex flex-col border-none shadow-2xl">
                    <SheetHeader className="p-6 border-b bg-white">
                        <SheetTitle className="flex items-center gap-3">
                             <Image src="/logo Alpha.png" alt="Logo" width={32} height={32} />
                             <span className="font-black text-accent tracking-tighter uppercase">ALPHA</span>
                        </SheetTitle>
                        <SheetDescription className="sr-only">Mobile navigation menu</SheetDescription>
                    </SheetHeader>
                    
                    <ScrollArea className="flex-1 p-6">
                        <div className="flex flex-col gap-2">
                            {(user?.role === 'admin' || user?.role === 'staff') && (
                                <SheetClose asChild>
                                    <Link href="/admin" className="flex items-center gap-4 p-4 rounded-2xl bg-primary/5 text-primary font-black uppercase text-sm tracking-tighter">
                                        <LayoutDashboard className="h-5 w-5" /> Admin Dashboard
                                    </Link>
                                </SheetClose>
                            )}
                            {navLinks.map((link) => (
                                <SheetClose asChild key={link.name}>
                                    <Link href={link.href} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-muted font-bold text-accent uppercase text-sm tracking-tight transition-all">
                                        {link.name}
                                    </Link>
                                </SheetClose>
                            ))}
                            <DropdownMenuSeparator className="my-6" />
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
                                <div className="grid grid-cols-2 gap-4 p-2 mt-4">
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
