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
import { 
  User, 
  Menu, 
  ChevronDown, 
  LayoutDashboard, 
  X, 
  Heart, 
  Package, 
  ShoppingCart as ShoppingCartIcon,
  ArrowRight,
  Grid,
  LogOut,
  Info,
  PhoneCall,
  Star
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
    { name: 'Contact Us', href: '/contact', icon: <PhoneCall className="h-4 w-4" /> },
    { name: 'About Us', href: '/about', icon: <Info className="h-4 w-4" /> },
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

        {/* Mobile Header Overhaul */}
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
                    <SheetContent side="right" className="w-[300px] p-0 flex flex-col border-none bg-background shadow-2xl">
                        <div className="p-6 border-b flex items-center justify-between bg-white z-10">
                            <Link href="/" className="flex items-center gap-3">
                                <Image src="/logo Alpha.png" alt="Logo" width={40} height={40}/>
                                <span className="font-black text-xl text-accent tracking-tighter">ALPHA</span>
                            </Link>
                            <SheetClose asChild>
                                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8"><X className="h-4 w-4" /></Button>
                            </SheetClose>
                        </div>
                        
                        <ScrollArea className="flex-1">
                            {/* User Identity Section */}
                            {user && (
                                <div className="p-6 bg-muted/30 border-b">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-14 w-14 border-2 border-primary shadow-md">
                                            <AvatarImage src={user.avatarUrl} className="object-cover" />
                                            <AvatarFallback className="bg-accent text-white font-black">{user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col overflow-hidden">
                                            <span className="font-black text-accent uppercase tracking-tighter truncate">{user.name}</span>
                                            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">{user.role} ACCOUNT</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Navigation Block */}
                            <div className="p-4 space-y-1">
                                {(user?.role === 'admin' || user?.role === 'staff') && (
                                    <SheetClose asChild>
                                        <Link href="/admin" className="flex items-center gap-3 px-4 py-4 text-sm font-black uppercase tracking-tighter text-primary bg-primary/5 rounded-2xl border border-primary/10 mb-4 transition-all active:scale-95">
                                            <LayoutDashboard className="h-5 w-5" />
                                            Admin Dashboard
                                        </Link>
                                    </SheetClose>
                                )}

                                {user ? (
                                    <>
                                        <SheetClose asChild>
                                            <Link href="/wishlist" className="flex items-center gap-4 px-4 py-3 text-sm font-bold text-accent hover:bg-muted rounded-xl transition-all">
                                                <div className="h-8 w-8 rounded-lg bg-red-50 flex items-center justify-center"><Heart className="h-4 w-4 text-red-500" /></div>
                                                My Wishlist
                                            </Link>
                                        </SheetClose>
                                        <SheetClose asChild>
                                            <Link href="/track-order" className="flex items-center gap-4 px-4 py-3 text-sm font-bold text-accent hover:bg-muted rounded-xl transition-all">
                                                <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center"><Package className="h-4 w-4 text-blue-500" /></div>
                                                Order Status
                                            </Link>
                                        </SheetClose>
                                        <SheetClose asChild>
                                            <Link href="/checkout" className="flex items-center gap-4 px-4 py-3 text-sm font-bold text-accent hover:bg-muted rounded-xl transition-all">
                                                <div className="h-8 w-8 rounded-lg bg-green-50 flex items-center justify-center"><ShoppingCartIcon className="h-4 w-4 text-green-600" /></div>
                                                Checkout
                                            </Link>
                                        </SheetClose>
                                        <SheetClose asChild>
                                            <Link href="/profile" className="flex items-center gap-4 px-4 py-3 text-sm font-bold text-accent hover:bg-muted rounded-xl transition-all">
                                                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center"><User className="h-4 w-4 text-muted-foreground" /></div>
                                                Profile Settings
                                            </Link>
                                        </SheetClose>
                                    </>
                                ) : (
                                    <div className="p-2 space-y-3 pb-6">
                                        <SheetClose asChild>
                                            <Button asChild className="w-full rounded-2xl h-12 font-black uppercase tracking-widest shadow-lg">
                                                <Link href={`/auth/login?tab=login${authRedirect}`}>Log In Access</Link>
                                            </Button>
                                        </SheetClose>
                                        <SheetClose asChild>
                                            <Button asChild variant="outline" className="w-full rounded-2xl h-12 font-black uppercase tracking-widest border-2">
                                                <Link href={`/auth/login?tab=signup${authRedirect}`}>Create Account</Link>
                                            </Button>
                                        </SheetClose>
                                    </div>
                                )}
                            </div>

                            {/* Dark Section with Accordion Catalog */}
                            <div className="bg-accent text-white min-h-[400px] mt-4 p-6 space-y-8 rounded-t-[2rem]">
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Company Ecosystem</h3>
                                    <nav className="flex flex-col gap-5">
                                        <SheetClose asChild>
                                            <Link href="/about" className="flex items-center justify-between text-base font-bold group">
                                                About Us
                                                <ArrowRight className="h-4 w-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                            </Link>
                                        </SheetClose>
                                        <SheetClose asChild>
                                            <Link href="/contact" className="flex items-center justify-between text-base font-bold group">
                                                Contact Us
                                                <ArrowRight className="h-4 w-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                            </Link>
                                        </SheetClose>
                                        <SheetClose asChild>
                                            <Link href="/#featured" className="flex items-center justify-between text-base font-bold group">
                                                Featured Items
                                                <ArrowRight className="h-4 w-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                            </Link>
                                        </SheetClose>
                                    </nav>
                                </div>

                                <div className="space-y-4 pt-6 border-t border-white/10">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Explore Catalog</h3>
                                    <Accordion type="single" collapsible className="w-full">
                                        <AccordionItem value="mobile-catalog" className="border-none">
                                            <AccordionTrigger className="py-0 hover:no-underline font-black uppercase tracking-widest text-primary text-sm flex items-center gap-2">
                                                <Grid className="h-4 w-4" />
                                                Browse Categories
                                            </AccordionTrigger>
                                            <AccordionContent className="pt-6 pb-0 flex flex-col gap-4 border-l border-white/5 ml-2 pl-4">
                                                {productCategories.map((cat) => (
                                                    <SheetClose asChild key={cat.name}>
                                                        <Link href={cat.href} className="flex items-center gap-3 group">
                                                            <div className="h-7 w-7 rounded-lg bg-white/5 p-1.5 flex items-center justify-center group-hover:bg-primary transition-colors">
                                                                <img src={cat.icon} alt="" className="h-full w-full object-contain" />
                                                            </div>
                                                            <span className="text-sm font-bold text-white/80 group-hover:text-white transition-colors">{cat.name}</span>
                                                        </Link>
                                                    </SheetClose>
                                                ))}
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </div>

                                {user && (
                                    <div className="pt-10">
                                        <Button 
                                            variant="ghost" 
                                            onClick={logout}
                                            className="w-full justify-start gap-3 p-0 h-auto font-black uppercase text-xs text-red-400 hover:text-red-300 hover:bg-transparent"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Sign Out Account
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
      </div>
    </header>
  );
}
