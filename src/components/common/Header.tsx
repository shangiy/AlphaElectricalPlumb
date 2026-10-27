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
import { User, Menu, ChevronDown, LayoutDashboard } from 'lucide-react';
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

const HeroSearch = dynamic(() => import('./HeroSearch'), {
  ssr: true,
  loading: () => <div className="h-9 w-full max-w-xl bg-muted/10 animate-pulse rounded-full" />
});

const productCategories = [
  { name: 'Tanks Collection', href: '/tanks', icon: '/kentank 2000l.png' },
  { name: 'Plumbing Equipment', href: '/plumbing', icon: '/ppr pipes.png' },
  {
    name: 'Electricals and Cables',
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
      const isMobile = window.innerWidth < 768;
      const stickyThreshold = isMobile ? 40 : 48;

      const isLocked = !isHomePage || scrollY >= stickyThreshold;
      
      setIsHeaderOpaque(isLocked);
      setShowSearchInHeader(isLocked);
    };

    updateHeaderStyles();
    window.addEventListener('scroll', updateHeaderStyles, { passive: true });
    window.addEventListener('resize', updateHeaderStyles);
    
    return () => {
      window.removeEventListener('scroll', updateHeaderStyles);
      window.removeEventListener('resize', updateHeaderStyles);
    };
  }, [pathname, isHomePage]);

  if (!mounted) return null;

  const navLinks = [
    { name: 'Contact Us', href: '/contact' },
    { name: 'About Us', href: '/about' },
  ];
  
  const headerClasses = cn(
    "sticky top-0 z-50 w-full transition-all duration-300",
    isHeaderOpaque 
      ? "bg-background shadow-lg border-b" 
      : "bg-transparent border-b border-transparent"
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
        <div className={cn("hidden w-full items-center gap-4 lg:flex h-20")}>
            <Link href="/" className="flex flex-shrink-0 items-center gap-3 group">
                <Image
                    src="/logo Alpha.png"
                    alt="AlphaElectricalPlumb Logo"
                    width={isHeaderOpaque ? 70 : 85}
                    height={isHeaderOpaque ? 70 : 85}
                    className="h-auto transition-all duration-300"
                />
                <div className={logoTextClasses}>
                    <span className={cn("font-black tracking-tighter transition-all duration-300", isHeaderOpaque ? "text-xl" : "text-2xl")}>Alpha</span>
                    <div className={cn("w-full h-0.5 transition-colors duration-300", !isHeaderOpaque && isHomePage ? "bg-white" : "bg-primary")} />
                    <span className="text-[10px] font-bold uppercase tracking-widest leading-tight mt-0.5">Electricals & Plumbing</span>
                </div>
            </Link>
            
            <div className="flex-1 flex justify-center items-center px-4 overflow-hidden h-full">
                <div className={cn(
                    "w-full max-w-xl transition-all duration-500 transform",
                    showSearchInHeader 
                        ? "opacity-100 translate-y-0 scale-100" 
                        : "opacity-0 -translate-y-8 scale-95 pointer-events-none"
                )}>
                    <HeroSearch isCompact={isHeaderOpaque} />
                </div>
            </div>

            <div className="flex items-center justify-end">
                <nav className='flex items-center gap-1'>
                    {/* Admin link relocated to the top (first item in desktop nav) */}
                    {(user?.role === 'admin' || user?.role === 'staff') && (
                      <Link href="/admin" className={cn(navAndIconClasses, "text-primary border border-primary/20 bg-primary/5 px-4")}>
                        <LayoutDashboard className="mr-1 h-4 w-4 inline-block" />
                        Admin Panel
                      </Link>
                    )}
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

        {/* Mobile Header */}
        <div className="w-full lg:hidden flex items-center justify-between py-2 h-16">
             <Link href="/" className="flex-shrink-0">
                <Image
                    src="/logo Alpha.png"
                    alt="AlphaElectricalPlumb Logo"
                    width={isHeaderOpaque ? 55 : 70}
                    height={isHeaderOpaque ? 55 : 70}
                    className="h-auto transition-all duration-300"
                />
            </Link>

            <div className={cn(
                "flex-1 min-w-0 mx-2 transition-all transform duration-300",
                showSearchInHeader ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
            )}>
                <HeroSearch isCompact />
            </div>

            <div className="flex items-center">
                <ShoppingCart triggerClassName={cn(iconClasses, '[&_svg]:h-6 [&_svg]:w-6')} />
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className={cn(iconClasses, '[&_svg]:h-6 [&_svg]:w-6')}>
                            <Menu />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[300px] p-0 flex flex-col">
                        <SheetHeader className="p-6 border-b bg-secondary/30">
                            <SheetTitle>
                                <SheetClose asChild>
                                    <Link href="/" className="flex items-center gap-3">
                                        <Image src="/logo Alpha.png" alt="Logo" width={50} height={50}/>
                                        <span className="font-black text-xl text-accent">Alpha</span>
                                    </Link>
                                </SheetClose>
                            </SheetTitle>
                        </SheetHeader>
                        <ScrollArea className="flex-1">
                            <nav className="flex flex-col p-4">
                            {/* Admin link relocated to the top (first item in mobile drawer nav) */}
                            {(user?.role === 'admin' || user?.role === 'staff') && (
                              <SheetClose asChild>
                                <Link href="/admin" className="flex items-center gap-4 px-3 py-3 text-base font-bold text-primary bg-primary/5 rounded-xl mb-4">
                                    <LayoutDashboard className="h-6 w-6" />
                                    <span>Admin Panel</span>
                                </Link>
                              </SheetClose>
                            )}
                            
                            <h3 className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Catalog</h3>
                            {productCategories.map((category) => (
                                <SheetClose asChild key={category.name}>
                                <Link href={category.href} className="flex items-center gap-4 px-3 py-3 text-base font-bold text-accent hover:bg-primary/10 rounded-xl">
                                    <img src={category.icon} alt={category.name} className="h-6 w-6 object-contain" />
                                    <span>{category.name}</span>
                                </Link>
                                </SheetClose>
                            ))}
                            
                            <div className="my-4 border-t" />
                            {navLinks.map((link) => (
                                <SheetClose asChild key={link.name}>
                                <Link href={link.href} className="px-3 py-3 text-base font-bold text-accent">{link.name}</Link>
                                </SheetClose>
                            ))}
                            </nav>
                        </ScrollArea>
                        <div className="p-6 border-t">
                        {user ? (
                            <Button variant="outline" className="w-full" onClick={logout}>Sign Out</Button>
                        ) : (
                            <Link href={`/auth/login?tab=login${authRedirect}`} className={cn(buttonVariants(), "w-full")}>Log in</Link>
                        )}
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
      </div>
    </header>
  );
}
