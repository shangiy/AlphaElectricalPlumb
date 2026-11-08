'use client';

import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
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
  Settings,
  CreditCard,
  Droplets,
  Zap,
  Lightbulb,
  Home,
  Hammer
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
} from '@/components/ui/accordion';
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

/**
 * High-Fidelity Product Categories with unique icons
 */
const productCategories = [
  { name: 'Tanks Collection', href: '/category/tanks', icon: <Droplets className="h-5 w-5 text-blue-500" />, desc: 'Heavy duty water storage' },
  { name: 'Plumbing Equipment', href: '/category/plumbing', icon: <Hammer className="h-5 w-5 text-orange-500" />, desc: 'Pipes, fittings & valves' },
  { name: 'Electricals & Cables', href: '/category/lighting', icon: <Zap className="h-5 w-5 text-yellow-500" />, desc: 'Industrial grade wiring' },
  { name: 'Home & Décor', href: '/category/decor', icon: <Lightbulb className="h-5 w-5 text-purple-500" />, desc: 'Modern lighting fixtures' },
  { name: 'Roofing & Construction', href: '/category/roofing', icon: <Home className="h-5 w-5 text-green-600" />, desc: 'Quality Mabati solutions' },
];

/**
 * Sticky Header v4.2:
 * - Positioned below TopBanner.
 * - Sticks to top-0 after banner scrolls away.
 * - Features high-fidelity dropdowns and responsive safety margins.
 */
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
      
      // The TopBanner is ~40px high. Header sticks after that.
      const bannerHeight = isMobile ? 40 : 48;
      const isStickyState = scrollY > bannerHeight;
      
      setIsHeaderOpaque(!isHomePage || isStickyState);
      setShowSearchInHeader(!isHomePage || isStickyState);
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
    "sticky top-0 z-50 w-full transition-all duration-500",
    isHeaderOpaque 
      ? "bg-background/95 backdrop-blur-xl shadow-lg border-b border-white/10" 
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
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex w-full items-center justify-between h-20">
            {/* Logo Section */}
            <Link href="/" className="flex flex-shrink-0 items-center gap-3 group">
                <div className="relative h-12 w-12 bg-white rounded-xl p-1.5 shadow-md border border-primary/5 transition-transform group-hover:scale-110">
                    <Image
                        src="/logo Alpha.png"
                        alt="Alpha Logo"
                        fill
                        className="object-contain p-1"
                    />
                </div>
                <div className={logoTextClasses}>
                    <span className="font-black tracking-tighter text-xl leading-none">ALPHA</span>
                    <div className={cn("w-full h-0.5 mt-0.5 transition-colors", !isHeaderOpaque && isHomePage ? "bg-white" : "bg-primary")} />
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] leading-tight">Ecosystem</span>
                </div>
            </Link>
            
            {/* Desktop Search Center */}
            <div className="hidden lg:flex flex-1 justify-center items-center px-8">
                <div className={cn(
                    "w-full max-w-xl transition-all duration-500 transform",
                    showSearchInHeader 
                        ? "opacity-100 translate-y-0" 
                        : "opacity-0 -translate-y-8 pointer-events-none"
                )}>
                    <HeroSearch isCompact />
                </div>
            </div>

            {/* Desktop Nav Actions */}
            <div className="hidden lg:flex items-center gap-2">
                <nav className='flex items-center gap-1'>
                    {(user?.role === 'admin' || user?.role === 'staff') && (
                      <Link href="/admin" className={cn(navAndIconClasses, "text-primary border border-primary/20 bg-primary/5 px-4")}>
                        <LayoutDashboard className="mr-1 h-4 w-4 inline-block" />
                        Admin Panel
                      </Link>
                    )}
                    
                    {/* High-Fidelity Dropdown */}
                    <div onMouseEnter={handleProductsMenuEnter} onMouseLeave={handleProductsMenuLeave} className="relative">
                      <DropdownMenu open={isProductsMenuOpen} onOpenChange={setProductsMenuOpen}>
                        <DropdownMenuTrigger asChild>
                             <div className={cn("flex items-center gap-1 cursor-pointer", navAndIconClasses)}>
                                Products
                                <ChevronDown className={cn("h-4 w-4 transition-transform", isProductsMenuOpen && "rotate-180")} />
                             </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-80 bg-background p-3 rounded-[2rem] shadow-2xl border-none animate-in fade-in zoom-in-95 duration-200">
                            <DropdownMenuLabel className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60 px-4 py-2">Our Collections</DropdownMenuLabel>
                            {productCategories.map((category) => (
                                <DropdownMenuItem key={category.name} asChild className="rounded-2xl cursor-pointer">
                                <Link href={category.href} className="flex items-center gap-4 py-3 px-3 hover:bg-primary/5">
                                    <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center shadow-inner">
                                        {category.icon}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-black text-sm text-accent uppercase tracking-tight">{category.name}</span>
                                        <span className="text-[10px] text-muted-foreground font-medium">{category.desc}</span>
                                    </div>
                                </Link>
                                </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator className="mx-4 my-2" />
                            <DropdownMenuItem asChild className="rounded-2xl">
                                <Link href="/search" className="flex items-center justify-center gap-2 py-3 text-primary font-black uppercase text-xs tracking-widest">
                                    View Full Catalog <ArrowRight size={14} />
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {navLinks.map((link) => (
                        <Link key={link.name} href={link.href} className={navAndIconClasses}>
                            {link.name}
                        </Link>
                    ))}
                </nav>

                <div className="h-8 w-[1px] bg-border mx-2" />

                <div className="flex items-center gap-1">
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
                        <DropdownMenuContent align="end" className="w-64 p-3 rounded-[2rem] shadow-2xl border-none">
                        {user ? (
                            <>
                            <DropdownMenuLabel className="flex flex-col px-4 py-3">
                                <span className="text-sm font-black text-accent truncate uppercase tracking-tighter">{user.name}</span>
                                <span className="text-[9px] uppercase tracking-[0.2em] text-primary font-bold">{user.role} Account</span>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="mx-2" />
                            <DropdownMenuItem asChild className="rounded-xl px-4 py-2.5"><Link href="/profile" className="flex items-center gap-3"><Settings size={16}/> Settings</Link></DropdownMenuItem>
                            <DropdownMenuItem asChild className="rounded-xl px-4 py-2.5"><Link href="/track-order" className="flex items-center gap-3"><Package size={16}/> Track Order</Link></DropdownMenuItem>
                            <DropdownMenuItem asChild className="rounded-xl px-4 py-2.5"><Link href="/wishlist" className="flex items-center gap-3"><Heart size={16}/> Wishlist</Link></DropdownMenuItem>
                            <DropdownMenuSeparator className="mx-2" />
                            <DropdownMenuItem onClick={logout} className="rounded-xl px-4 py-2.5 text-destructive focus:bg-destructive/5 flex items-center gap-3"><LogOut size={16}/> Terminate Session</DropdownMenuItem>
                            </>
                        ) : (
                            <div className="space-y-2 p-2">
                                <Button asChild className="w-full rounded-xl h-11 font-black uppercase tracking-widest shadow-lg">
                                    <Link href={`/auth/login?tab=login${authRedirect}`}>Log In</Link>
                                </Button>
                                <Button asChild variant="outline" className="w-full rounded-xl h-11 font-black uppercase tracking-widest border-2">
                                    <Link href={`/auth/login?tab=signup${authRedirect}`}>Sign Up</Link>
                                </Button>
                            </div>
                        )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Mobile Interface */}
            <div className="lg:hidden flex items-center gap-2">
                <div className={cn(
                    "transition-all transform duration-300",
                    showSearchInHeader ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
                )}>
                    <HeroSearch isCompact />
                </div>
                <ShoppingCart triggerClassName={cn(iconClasses, '[&_svg]:h-6 [&_svg]:w-6')} />
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className={cn(iconClasses, '[&_svg]:h-6 [&_svg]:w-6')}>
                            <Menu />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[85%] sm:w-[400px] p-0 flex flex-col border-none bg-background shadow-2xl overflow-hidden rounded-l-[3rem]">
                        <SheetHeader className="p-8 border-b bg-white relative z-10">
                            <SheetTitle className="sr-only">Alpha Menu</SheetTitle>
                            <SheetDescription className="sr-only">Mobile navigation and account tools</SheetDescription>
                            <SheetClose asChild>
                                <Link href="/" className="flex items-center gap-4">
                                    <Image src="/logo Alpha.png" alt="Logo" width={50} height={50}/>
                                    <div className="flex flex-col">
                                        <span className="font-black text-xl text-accent tracking-tighter uppercase leading-none">ALPHA</span>
                                        <span className="text-[9px] font-bold text-primary uppercase tracking-widest mt-1">Ecosystem</span>
                                    </div>
                                </Link>
                            </SheetClose>
                        </SheetHeader>
                        
                        <ScrollArea className="flex-1">
                            {user ? (
                                <div className="p-8 bg-muted/20 border-b">
                                    <div className="flex items-center gap-5">
                                        <Avatar className="h-16 w-16 border-2 border-primary shadow-xl">
                                            <AvatarImage src={user.avatarUrl} className="object-cover" />
                                            <AvatarFallback className="bg-accent text-white font-black">{user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col overflow-hidden">
                                            <span className="font-black text-accent text-lg uppercase tracking-tighter truncate">{user.name}</span>
                                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-primary/10 px-2 py-0.5 rounded-full w-fit">{user.role} Account</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-8 space-y-4 border-b">
                                    <SheetClose asChild>
                                        <Button asChild className="w-full rounded-2xl h-14 font-black uppercase tracking-widest shadow-xl bg-accent">
                                            <Link href={`/auth/login?tab=login${authRedirect}`}>Log In</Link>
                                        </Button>
                                    </SheetClose>
                                    <div className="flex flex-col items-center gap-1">
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">NEW HERE?</p>
                                        <ChevronDown className="h-4 w-4 text-primary animate-bounce" />
                                    </div>
                                    <SheetClose asChild>
                                        <Button asChild variant="outline" className="w-full rounded-2xl h-14 font-black uppercase tracking-widest border-2">
                                            <Link href={`/auth/login?tab=signup${authRedirect}`}>Sign Up</Link>
                                        </Button>
                                    </SheetClose>
                                </div>
                            )}

                            <div className="p-6 space-y-8">
                                {(user?.role === 'admin' || user?.role === 'staff') && (
                                    <SheetClose asChild>
                                        <Link href="/admin" className="flex items-center justify-between px-6 py-5 text-sm font-black uppercase tracking-tighter text-primary bg-primary/5 rounded-[1.5rem] border border-primary/20 shadow-sm transition-transform active:scale-95">
                                            <div className="flex items-center gap-4">
                                                <LayoutDashboard className="h-6 w-6" />
                                                Command Center
                                            </div>
                                            <ArrowRight size={16} className="opacity-40" />
                                        </Link>
                                    </SheetClose>
                                )}

                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 ml-4">Supply Chains</h3>
                                    <div className="grid gap-2">
                                        {productCategories.map((cat) => (
                                            <SheetClose asChild key={cat.name}>
                                                <Link href={cat.href} className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-muted/30 hover:bg-primary/5 transition-colors group">
                                                    <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                                        {cat.icon}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-black text-accent uppercase tracking-tight">{cat.name}</span>
                                                        <span className="text-[10px] text-muted-foreground font-medium">{cat.desc}</span>
                                                    </div>
                                                </Link>
                                            </SheetClose>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 ml-4">Company</h3>
                                    <div className="grid gap-2">
                                        {navLinks.map((link) => (
                                            <SheetClose asChild key={link.name}>
                                                <Link href={link.href} className="flex items-center gap-4 px-6 py-4 rounded-2xl hover:bg-muted font-bold text-accent uppercase text-sm tracking-tight transition-all">
                                                    {link.icon}
                                                    {link.name}
                                                </Link>
                                            </SheetClose>
                                        ))}
                                    </div>
                                </div>

                                {user && (
                                    <div className="pt-8 pb-10">
                                        <SheetClose asChild>
                                            <Button 
                                                variant="ghost" 
                                                onClick={logout}
                                                className="w-full justify-start gap-4 p-6 h-16 rounded-2xl font-black uppercase text-xs text-red-500 hover:text-red-600 hover:bg-red-50 border border-red-100 transition-all active:scale-95"
                                            >
                                                <LogOut className="h-5 w-5" />
                                                Terminate Session
                                            </Button>
                                        </SheetClose>
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
