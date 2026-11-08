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
  ChevronDown,
  Droplets,
  Zap,
  Lightbulb,
  Home
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

  const productCategories = [
    { name: 'Water Tanks', href: '/category/tanks', icon: <Droplets className="h-5 w-5 text-blue-500" />, desc: 'Durable storage solutions' },
    { name: 'Plumbing', href: '/category/plumbing', icon: <Zap className="h-5 w-5 text-emerald-500" />, desc: 'Pipes, fittings & valves' },
    { name: 'Lighting', href: '/category/lighting', icon: <Lightbulb className="h-5 w-5 text-yellow-500" />, desc: 'Elegant chandeliers & LEDs' },
    { name: 'Home & Decor', href: '/category/decor', icon: <Home className="h-5 w-5 text-rose-500" />, desc: 'Premium artistic finishes' },
  ];

  const headerClasses = cn(
    "sticky top-0 left-0 right-0 z-50 w-full h-24 flex items-center bg-[#050b1a] border-b border-white/5 shadow-2xl transition-all duration-300"
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
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="text-sm font-black text-white hover:text-primary transition-all flex items-center gap-1 uppercase tracking-tight outline-none group">
                            Products
                            <ChevronDown size={14} className="opacity-50 group-data-[state=open]:rotate-180 transition-transform" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-[600px] p-6 rounded-[2rem] shadow-2xl border-none bg-white grid grid-cols-2 gap-4">
                        <DropdownMenuLabel className="col-span-2 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 mb-2">Inventory Collections</DropdownMenuLabel>
                        {productCategories.map((cat) => (
                            <DropdownMenuItem key={cat.name} asChild className="p-0 focus:bg-transparent">
                                <Link href={cat.href} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-primary/5 transition-all group/item">
                                    <div className="h-12 w-12 rounded-xl bg-muted/50 flex items-center justify-center group-hover/item:bg-white group-hover/item:shadow-lg transition-all">
                                        {cat.icon}
                                    </div>
                                    <div>
                                        <p className="font-black text-accent uppercase text-sm tracking-tight">{cat.name}</p>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{cat.desc}</p>
                                    </div>
                                </Link>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                
                <Link href="/contact" className="text-sm font-black text-white hover:text-primary transition-all uppercase tracking-tight">Contact Us</Link>
                <Link href="/about" className="text-sm font-black text-white hover:text-primary transition-all uppercase tracking-tight">About Us</Link>
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
                            <DropdownMenuSeparator className="mb-4" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-4 mb-2">Our Collections</p>
                            {productCategories.map((cat) => (
                                <SheetClose asChild key={cat.name}>
                                    <Link href={cat.href} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-muted font-bold text-accent uppercase text-sm tracking-tight transition-all">
                                        <span className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">{cat.icon}</span>
                                        {cat.name}
                                    </Link>
                                </SheetClose>
                            ))}
                            <DropdownMenuSeparator className="my-6" />
                            <SheetClose asChild>
                                <Link href="/contact" className="p-4 font-bold text-accent uppercase text-sm tracking-tight">Contact Us</Link>
                            </SheetClose>
                            <SheetClose asChild>
                                <Link href="/about" className="p-4 font-bold text-accent uppercase text-sm tracking-tight">About Us</Link>
                            </SheetClose>
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
