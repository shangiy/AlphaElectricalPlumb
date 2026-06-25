'use client';

import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetTrigger,
} from '@/components/ui/sheet';
import { User, Menu, ChevronDown, Loader2 } from 'lucide-react';
import ShoppingCart from './ShoppingCart';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/context/AuthProvider';

// Use dynamic import for HeroSearch in header to optimize layout loading
const HeroSearch = dynamic(() => import('./HeroSearch'), {
  ssr: true,
  loading: () => <div className="h-9 w-full max-w-xl bg-muted/10 animate-pulse rounded-full" />
});

const productCategories = [
  { name: 'Tanks Collection', href: '/tanks', icon: '/kentank 2000l.png' },
  { name: 'Plumbing Equipment', href: '/plumbing', icon: '/ppr pipes.png' },
  {
    name: 'Lighting & Electrical',
    href: '/lighting',
    icon: '/decor lighting design.png',
  },
  { name: 'Home & Décor', href: '/decor', icon: '/square lights.png' },
  { name: 'Roofing & Construction', href: '/roofing', icon: '/roof 2.png' },
];

export default function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  
  const [isHeaderOpaque, setIsHeaderOpaque] = useState(false);
  const [showSearchInHeader, setShowSearchInHeader] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [isProductsMenuOpen, setProductsMenuOpen] = useState(false);
  const productsMenuTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    setMounted(true);
    const updateHeaderStyles = () => {
      const scrollY = window.scrollY;
      
      // Header becomes opaque and sticky-styled after minor scroll
      setIsHeaderOpaque(!isHomePage || scrollY > 20);
      
      // Search bar appears in header after hero search bar is roughly scrolled past
      const searchThreshold = isHomePage ? 350 : 0;
      setShowSearchInHeader(!isHomePage || scrollY > searchThreshold);
    };

    updateHeaderStyles();
    window.addEventListener('scroll', updateHeaderStyles, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', updateHeaderStyles);
    };
  }, [pathname, isHomePage]);

  // Stable Shell Rendering to prevent Hydration ID Mismatch
  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 w-full bg-transparent border-b border-transparent">
        <div className="container mx-auto px-4 h-24 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="w-[70px] h-[70px] bg-muted/20 animate-pulse rounded-full" />
              <div className="hidden sm:flex flex-col gap-1">
                 <div className="w-20 h-4 bg-muted/20 animate-pulse rounded" />
                 <div className="w-32 h-3 bg-muted/20 animate-pulse rounded" />
              </div>
           </div>
           <div className="flex gap-4">
              <div className="w-10 h-10 bg-muted/20 animate-pulse rounded-full" />
              <div className="w-10 h-10 bg-muted/20 animate-pulse rounded-full" />
           </div>
        </div>
      </header>
    );
  }

  const navLinks = [
    { name: 'Contact Us', href: '/contact' },
    { name: 'About Us', href: '/about' },
  ];
  
  const headerClasses = cn(
    "sticky top-0 z-50 w-full transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)",
    isHeaderOpaque 
      ? "bg-background/95 backdrop-blur-md border-b shadow-md py-0" 
      : "bg-transparent border-b border-transparent py-2"
  );

  const dynamicColorClasses = cn(
    "transition-colors duration-300",
    !isHeaderOpaque && isHomePage ? "text-white" : "text-accent"
  );
  
  const navAndIconClasses = cn(
    "font-bold text-base transition-all duration-300 px-3 py-2 rounded-md whitespace-nowrap",
    dynamicColorClasses,
    "hover:text-primary hover:bg-primary/10"
  );

  const iconClasses = cn(
    "rounded-full p-2 transition-all duration-300",
    dynamicColorClasses,
    "hover:bg-primary/10 hover:text-primary"
  );

  const logoTextClasses = cn(
    "hidden sm:flex flex-col transition-colors duration-300",
    dynamicColorClasses,
    "group-hover:text-primary"
  );
  
  const handleProductsMenuEnter = () => {
    if (productsMenuTimerRef.current) clearTimeout(productsMenuTimerRef.current);
    setProductsMenuOpen(true);
  };

  const handleProductsMenuLeave = () => {
    productsMenuTimerRef.current = setTimeout(() => setProductsMenuOpen(false), 200);
  };

  const authRedirect = pathname !== '/auth/login' ? `&redirect=${encodeURIComponent(pathname)}` : '';

  return (
    <header className={headerClasses}>
      <div className="container mx-auto px-4 relative z-10">
        <div className={cn("hidden w-full items-center gap-4 lg:flex transition-all duration-500 ease-in-out", isHeaderOpaque ? "h-20" : "h-24")}>
            <Link href="/" className="flex flex-shrink-0 items-center gap-3 group">
                <Image
                    src="/logo Alpha.png"
                    alt="AlphaElectricalPlumb Logo"
                    width={isHeaderOpaque ? 70 : 90}
                    height={isHeaderOpaque ? 70 : 90}
                    className="h-auto transition-all duration-500 group-hover:scale-105"
                />
                <div className={logoTextClasses}>
                    <span className={cn("font-black tracking-tighter transition-all", isHeaderOpaque ? "text-[20px]" : "text-[22px]")}>Alpha</span>
                    <div className={cn("w-full h-0.5 transition-colors duration-300", !isHeaderOpaque && isHomePage ? "bg-white" : "bg-primary")} />
                    <span className="text-[11px] font-bold uppercase tracking-widest leading-tight mt-0.5">Electricals & Plumbing</span>
                </div>
            </Link>
            
            <div className="flex-1 flex justify-center items-center px-4 overflow-hidden h-full">
                <div className={cn(
                    "w-full max-w-xl transition-all duration-700 ease-out transform origin-top",
                    showSearchInHeader 
                        ? "opacity-100 translate-y-0 scale-100 visible" 
                        : "opacity-0 -translate-y-12 scale-90 invisible pointer-events-none"
                )}>
                    <HeroSearch isCompact={isHeaderOpaque} />
                </div>
            </div>

            <div className="flex items-center justify-end">
                <nav className='flex items-center gap-1'>
                    <div onMouseEnter={handleProductsMenuEnter} onMouseLeave={handleProductsMenuLeave} className="relative">
                      <DropdownMenu open={isProductsMenuOpen} onOpenChange={setProductsMenuOpen}>
                        <DropdownMenuTrigger asChild>
                             <div className={cn("flex items-center gap-1 cursor-pointer", navAndIconClasses)}>
                                Products
                                <ChevronDown className="h-4 w-4" />
                             </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-64 bg-background p-2 rounded-2xl shadow-xl">
                            <DropdownMenuLabel className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Catalog</DropdownMenuLabel>
                            {productCategories.map((category) => (
                                <DropdownMenuItem key={category.name} asChild className="rounded-xl">
                                <Link href={category.href} className="flex items-center gap-4 py-3">
                                    <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center p-2">
                                        <img src={category.icon} alt={category.name} className="h-full w-full object-contain" />
                                    </div>
                                    <span className="font-bold text-accent">{category.name}</span>
                                </Link>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    {navLinks.map((link) => (
                        <Link key={link.name} href={link.href} className={navAndIconClasses}>
                            {link.name}
                        </Link>
                    ))}
                </nav>
                <div className="flex items-center ml-2">
                    <ShoppingCart triggerClassName={cn(iconClasses, '[&_svg]:h-7 [&_svg]:w-7')} />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className={cn("w-auto px-3 gap-2 rounded-full hover:bg-primary/10", iconClasses)}>
                            {user?.avatarUrl ? (
                                <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-primary shadow-md">
                                    <Image src={user.avatarUrl} alt={user.username} width={32} height={32} className="object-cover" />
                                </div>
                            ) : (
                                <User className="h-7 w-7" />
                            )}
                            <span className="hidden xl:inline font-bold tracking-tight">{user ? user.username : 'Log in'}</span>
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-xl">
                        {user ? (
                            <>
                            <DropdownMenuLabel className="flex flex-col px-2 py-2">
                                <span className="text-sm font-black text-accent truncate">{user.name}</span>
                                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{user.role} Account</span>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild className="rounded-lg"><Link href="/profile">Profile Settings</Link></DropdownMenuItem>
                             {(user.role === 'admin' || user.role === 'staff') && (
                                <DropdownMenuItem asChild className="rounded-lg bg-primary/10 text-primary font-bold"><Link href="/admin">Admin Dashboard</Link></DropdownMenuItem>
                            )}
                            <DropdownMenuItem asChild className="rounded-lg"><Link href="/track-order">Track My Order</Link></DropdownMenuItem>
                            <DropdownMenuItem asChild className="rounded-lg"><Link href="/wishlist">My Wishlist</Link></DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={logout} className="rounded-lg text-destructive focus:bg-destructive/10">Log out</DropdownMenuItem>
                            </>
                        ) : (
                            <>
                            <DropdownMenuItem asChild className="rounded-lg py-3"><Link href={`/auth/login?tab=login${authRedirect}`}>Log in</Link></DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild className="rounded-lg py-3 bg-primary text-white focus:bg-primary/90 focus:text-white"><Link href={`/auth/login?tab=signup${authRedirect}`}>Create Account</Link></DropdownMenuItem>
                            </>
                        )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>

        {/* Mobile Header (Refined for Mobile-First) */}
        <div className="w-full lg:hidden flex flex-col py-2 transition-all duration-500">
            <div className="flex w-full items-center justify-between gap-2">
                 <Link href="/" className="flex-shrink-0 transition-all duration-500">
                    <Image
                        src="/logo Alpha.png"
                        alt="AlphaElectricalPlumb Logo"
                        width={isHeaderOpaque ? 55 : 75}
                        height={isHeaderOpaque ? 55 : 75}
                        className="h-auto"
                    />
                </Link>

                <div className={cn(
                    "flex-1 min-w-0 transition-all duration-500 ease-out transform",
                    showSearchInHeader ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-4 scale-95 pointer-events-none invisible"
                )}>
                    <HeroSearch isCompact />
                </div>

                <div className="flex items-center flex-shrink-0">
                    <ShoppingCart triggerClassName={cn(iconClasses, '[&_svg]:h-6 [&_svg]:w-6')} />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className={cn(iconClasses, '[&_svg]:h-6 [&_svg]:w-6')}>
                                {user?.avatarUrl ? (
                                    <div className="h-6 w-6 rounded-full overflow-hidden border border-primary">
                                        <Image src={user.avatarUrl} alt={user.username} width={24} height={24} className="object-cover" />
                                    </div>
                                ) : (
                                    <User />
                                )}
                                <span className="sr-only">Account</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl">
                            {user ? (
                            <>
                                <DropdownMenuLabel className="text-xs uppercase font-black text-muted-foreground">{user.username}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild><Link href="/profile">Profile</Link></DropdownMenuItem>
                                {(user.role === 'admin' || user.role === 'staff') && (
                                    <DropdownMenuItem asChild className="text-primary font-bold"><Link href="/admin">Dashboard</Link></DropdownMenuItem>
                                )}
                                <DropdownMenuItem asChild><Link href="/track-order">My Orders</Link></DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={logout} className="text-destructive">Log out</DropdownMenuItem>
                            </>
                            ) : (
                            <>
                                <DropdownMenuItem asChild><Link href={`/auth/login?tab=login${authRedirect}`}>Log in</Link></DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild><Link href={`/auth/login?tab=signup${authRedirect}`}>Sign up</Link></DropdownMenuItem>
                            </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className={cn(iconClasses, '[&_svg]:h-6 [&_svg]:w-6')}>
                                <Menu />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0 flex flex-col border-l-0">
                            <SheetHeader className="p-6 border-b bg-secondary/30">
                                <SheetTitle>
                                    <SheetClose asChild>
                                        <Link href="/" className="flex items-center gap-3">
                                            <Image src="/logo Alpha.png" alt="Logo" width={60} height={60}/>
                                            <div className="flex flex-col text-accent">
                                                <span className="font-black text-[20px] leading-tight tracking-tighter">Alpha</span>
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Electricals & Plumbing</span>
                                            </div>
                                        </Link>
                                    </SheetClose>
                                </SheetTitle>
                            </SheetHeader>
                            <ScrollArea className="flex-1">
                                <nav className="flex flex-col gap-1 p-4">
                                <h3 className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Product Collections</h3>
                                {productCategories.map((category) => (
                                    <SheetClose asChild key={category.name}>
                                    <Link href={category.href} className="flex items-center gap-4 rounded-xl px-3 py-3 text-base font-bold text-accent hover:bg-primary/10 hover:text-primary transition-colors">
                                        <div className="h-8 w-8 p-1 bg-white rounded-lg shadow-sm">
                                            <img src={category.icon} alt={category.name} className="h-full w-full object-contain" />
                                        </div>
                                        <span>{category.name}</span>
                                    </Link>
                                    </SheetClose>
                                ))}
                                <div className="my-4 px-3 border-t" />
                                <h3 className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Company</h3>
                                {[ ...navLinks, { name: 'The Team', href: '/team' }].map((link) => (
                                    <SheetClose asChild key={link.name}>
                                    <Link href={link.href} className="rounded-xl px-3 py-3 text-base font-bold text-accent hover:bg-secondary transition-colors">{link.name}</Link>
                                    </SheetClose>
                                ))}
                                </nav>
                            </ScrollArea>
                            <div className="flex flex-col gap-3 p-6 bg-secondary/10 border-t">
                            {user ? (
                                <Button variant="outline" className="w-full rounded-xl border-accent/20" onClick={logout}>Sign Out</Button>
                            ) : (
                                <div className="space-y-3">
                                <SheetClose asChild>
                                <Link href={`/auth/login?tab=login${authRedirect}`} className={cn(buttonVariants({ variant: "default" }), "w-full rounded-xl font-bold")}>Log in</Link>
                                </SheetClose>
                                <SheetClose asChild>
                                <Link href={`/auth/login?tab=signup${authRedirect}`} className={cn(buttonVariants({ variant: "outline" }), "w-full rounded-xl font-bold border-accent/20")}>Register Account</Link>
                                </SheetClose>
                                </div>
                            )}
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