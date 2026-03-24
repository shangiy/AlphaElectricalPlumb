'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetTrigger,
} from '@/components/ui/sheet';
import { User, Menu, ChevronDown } from 'lucide-react';
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
import HeroSearch from './HeroSearch';
import { useAuth } from '@/context/AuthProvider';

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
  
  const [isHeaderOpaque, setIsHeaderOpaque] = useState(!isHomePage);
  const [showSearchInHeader, setShowSearchInHeader] = useState(!isHomePage);

  const [isProductsMenuOpen, setProductsMenuOpen] = useState(false);
  const productsMenuTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    const updateHeaderStyles = () => {
      const scrollY = window.scrollY;
      const isHomepagePath = window.location.pathname === '/';
      
      // Early transition for transparency
      setIsHeaderOpaque(!isHomepagePath || scrollY > 20);
      
      // Threshold for showing the search bar in the header on the homepage.
      const searchThreshold = isHomepagePath ? 350 : 0;
      setShowSearchInHeader(!isHomepagePath || scrollY > searchThreshold);
    };

    updateHeaderStyles();
    window.addEventListener('scroll', updateHeaderStyles, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', updateHeaderStyles);
    };
  }, [pathname, isHomePage]);
  
  const navLinks = [
    { name: 'Contact Us', href: '/contact' },
    { name: 'About Us', href: '/about' },
  ];
  
  const headerClasses = cn(
    "sticky top-0 z-50 w-full transition-all duration-500 overflow-hidden",
    isHeaderOpaque 
      ? "border-b shadow-sm" 
      : "bg-transparent border-b border-transparent"
  );

  const dynamicColorClasses = cn(
    "transition-colors duration-300",
    !isHeaderOpaque && isHomePage ? "text-white" : "text-[#2b235f]"
  );
  
  const navAndIconClasses = cn(
    "font-semibold text-base",
    dynamicColorClasses,
    "hover:text-[#8a0b0d]"
  );

  const logoTextClasses = cn(
    "hidden sm:flex flex-col",
    dynamicColorClasses,
    "group-hover:text-[#8a0b0d]"
  );
  
  const handleProductsMenuEnter = () => {
    if (productsMenuTimerRef.current) {
      clearTimeout(productsMenuTimerRef.current);
    }
    setProductsMenuOpen(true);
  };

  const handleProductsMenuLeave = () => {
    productsMenuTimerRef.current = setTimeout(() => {
      setProductsMenuOpen(false);
    }, 200);
  };

  const ProductsButtonContent = () => (
    <>
      Products
      <ChevronDown className="h-4 w-4" />
    </>
  );

  return (
    <header className={headerClasses}>
      {/* Background Layers for Opaque State */}
      <div className={cn(
        "absolute inset-0 -z-20 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-[length:200%_200%] animate-gradient-x transition-opacity duration-500",
        isHeaderOpaque ? "opacity-100" : "opacity-0"
      )} />
      <div className={cn(
        "absolute inset-0 -z-10 bg-background/90 backdrop-blur-md transition-opacity duration-500",
        isHeaderOpaque ? "opacity-100" : "opacity-0"
      )} />

      <div className="container mx-auto px-4 relative z-10">
        {/* Desktop Header */}
        <div className={cn("hidden w-full items-center gap-4 lg:flex transition-all duration-500", isHeaderOpaque ? "h-20" : "h-24")}>
            {/* Left: Logo */}
            <Link href="/" className="flex flex-shrink-0 items-center gap-3 group">
                <Image
                    src="/logo Alpha.png"
                    alt="Alpha Electricals & Plumbing Ltd Logo"
                    width={isHeaderOpaque ? 70 : 90}
                    height={isHeaderOpaque ? 70 : 90}
                    className="h-auto transition-all duration-500"
                />
                <div className={logoTextClasses}>
                    <span className={cn("font-bold transition-all", isHeaderOpaque ? "text-[18px]" : "text-[20px]")}>Alpha</span>
                    <div className="w-full h-px bg-current" />
                    <span className="text-[12px] leading-tight">Electricals & Plumbing Ltd</span>
                </div>
            </Link>
            
            {/* Center: Search (Desktop) */}
            <div className="flex-1 w-full max-w-xl mx-auto px-4">
                {showSearchInHeader && (
                    <div className="animate-in fade-in duration-700 slide-in-from-top-2">
                        <HeroSearch isCompact={isHeaderOpaque} />
                    </div>
                )}
            </div>

            {/* Right: Navigation and Icons */}
            <div className="flex items-center justify-end">
                <nav className='flex items-center'>
                    <div onMouseEnter={handleProductsMenuEnter} onMouseLeave={handleProductsMenuLeave} className="relative">
                      <DropdownMenu open={isProductsMenuOpen} onOpenChange={setProductsMenuOpen}>
                        <DropdownMenuTrigger asChild>
                          <div className={cn(
                            "p-0.5 rounded-md",
                            isHeaderOpaque ? "bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-[length:200%_200%] animate-gradient-x" : ""
                          )}>
                             <Link href="#" className={cn(
                                "flex items-center gap-1 px-3 py-2 whitespace-nowrap",
                                navAndIconClasses,
                                isHeaderOpaque ? "bg-background rounded-[5px]" : "bg-transparent",
                                "hover:text-accent-foreground"
                              )}>
                                <ProductsButtonContent />
                             </Link>
                           </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-56 bg-background" onMouseEnter={handleProductsMenuEnter} onMouseLeave={handleProductsMenuLeave}>
                            {productCategories.map((category) => (
                                <DropdownMenuItem key={category.name} asChild>
                                <Link href={category.href} className="flex items-center gap-3 py-2">
                                    <Image
                                    src={category.icon}
                                    alt={category.name}
                                    width={24}
                                    height={24}
                                    />
                                    <span>{category.name}</span>
                                </Link>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={cn("px-3 py-2 whitespace-nowrap", navAndIconClasses)}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>
                <div className="flex items-center">
                    <ShoppingCart triggerClassName={cn(navAndIconClasses, '[&_svg]:h-7 [&_svg]:w-7')} />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className={cn("w-auto px-3 gap-2 rounded-md", navAndIconClasses)}>
                            <User className="h-7 w-7" />
                            <span className="hidden xl:inline">{user ? user.username : 'Log in'}</span>
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                        {user ? (
                            <>
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild><Link href="/profile">Profile</Link></DropdownMenuItem>
                             {(user.role === 'admin' || user.role === 'staff') && (
                                <DropdownMenuItem asChild><Link href="/admin">Admin Dashboard</Link></DropdownMenuItem>
                            )}
                            <DropdownMenuItem asChild><Link href="/track-order">Track My Order</Link></DropdownMenuItem>
                            <DropdownMenuItem asChild><Link href="/wishlist">My Wishlist</Link></DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
                            </>
                        ) : (
                            <>
                            <DropdownMenuItem asChild><Link href="/auth/login?tab=login">Log in</Link></DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild><Link href="/auth/login?tab=signup">Create Account</Link></DropdownMenuItem>
                            </>
                        )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>


        {/* Mobile Header */}
        <div className="w-full lg:hidden flex flex-col py-2 transition-all duration-500">
            {/* Top Row: Logo, Compact Search, and Icons */}
            <div className="flex w-full items-center justify-between gap-2">
                 <Link href="/" className="flex-shrink-0 transition-all duration-500">
                    <Image
                        src="/logo Alpha.png"
                        alt="Alpha Electricals & Plumbing Ltd Logo"
                        width={isHeaderOpaque ? 50 : 70}
                        height={isHeaderOpaque ? 50 : 70}
                        className="h-auto"
                    />
                </Link>

                <div className={cn(
                    "flex-1 min-w-0 transition-all duration-700 ease-in-out overflow-hidden px-1",
                    showSearchInHeader ? "opacity-100 max-h-12 translate-y-0" : "opacity-0 max-h-0 -translate-y-4 pointer-events-none"
                )}>
                    <HeroSearch isCompact />
                </div>

                <div className="flex items-center flex-shrink-0">
                    <ShoppingCart triggerClassName={cn(navAndIconClasses, '[&_svg]:h-6 [&_svg]:w-6')} />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className={cn("rounded-full", navAndIconClasses, '[&_svg]:h-6 [&_svg]:w-6')}>
                                <User />
                                <span className="sr-only">Account</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {user ? (
                            <>
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild><Link href="/profile">Profile</Link></DropdownMenuItem>
                                {(user.role === 'admin' || user.role === 'staff') && (
                                    <DropdownMenuItem asChild><Link href="/admin">Admin Dashboard</Link></DropdownMenuItem>
                                )}
                                <DropdownMenuItem asChild><Link href="/track-order">Track My Order</Link></DropdownMenuItem>
                                <DropdownMenuItem asChild><Link href="/wishlist">My Wishlist</Link></DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
                            </>
                            ) : (
                            <>
                                <DropdownMenuItem asChild><Link href="/auth/login?tab=login">Log in</Link></DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild><Link href="/auth/login?tab=signup">Create Account</Link></DropdownMenuItem>
                            </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className={cn("rounded-full", navAndIconClasses, '[&_svg]:h-6 [&_svg]:w-6')}>
                                <Menu />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0 flex flex-col">
                            <SheetHeader className="p-4 border-b">
                                <SheetTitle>
                                    <SheetClose asChild>
                                        <Link href="/" className="flex items-center gap-2">
                                            <Image src="/logo Alpha.png" alt="Logo" width={70} height={70}/>
                                            <div className="flex flex-col text-[#2b235f]">
                                                <span className="font-bold text-[18px] leading-tight">Alpha</span>
                                                <div className="w-full h-px bg-[#2b235f]" />
                                                <span className="text-[11px] leading-tight">Electricals & Plumbing Ltd</span>
                                            </div>
                                        </Link>
                                    </SheetClose>
                                </SheetTitle>
                            </SheetHeader>
                            <ScrollArea className="flex-1">
                                <nav className="flex flex-col gap-2 p-4">
                                <h3 className="px-2 text-sm font-semibold text-muted-foreground">Products</h3>
                                {productCategories.map((category) => (
                                    <SheetClose asChild key={category.name}>
                                    <Link href={category.href} className="flex items-center gap-3 rounded-md px-2 py-2 text-base font-medium text-foreground hover:bg-accent hover:text-[#8a0b0d]">
                                        <Image src={category.icon} alt={category.name} width={24} height={24}/>
                                        <span>{category.name}</span>
                                    </Link>
                                    </SheetClose>
                                ))}
                                <DropdownMenuSeparator />
                                <h3 className="px-2 pt-2 text-sm font-semibold text-muted-foreground">Menu</h3>
                                {[ ...navLinks, { name: 'Team', href: '/team' }].map((link) => (
                                    <SheetClose asChild key={link.name}>
                                    <Link href={link.href} className="rounded-md px-2 py-2 text-base font-medium text-foreground hover:bg-accent hover:text-[#8a0b0d]">{link.name}</Link>
                                    </SheetClose>
                                ))}
                                </nav>
                            </ScrollArea>
                            <div className="flex flex-col gap-2 border-t p-4 mt-auto">
                            {user ? (
                                <Button variant="outline" className="w-full" onClick={logout}>Log Out</Button>
                            ) : (
                                <div className="space-y-2">
                                <SheetClose asChild>
                                <Link href="/auth/login?tab=login" className={cn(buttonVariants({ variant: "default" }), "w-full")}>Log in</Link>
                                </SheetClose>
                                <SheetClose asChild>
                                <Link href="/auth/login?tab=signup" className={cn(buttonVariants({ variant: "outline" }), "w-full")}>Create Account</Link>
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
