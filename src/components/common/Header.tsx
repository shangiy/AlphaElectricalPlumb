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
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthProvider';

export default function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const authRedirect = pathname !== '/auth/login' ? `&redirect=${encodeURIComponent(pathname)}` : '';

  return (
    <header>
      <div>
        {/* Desktop View */}
        <div>
          {/* Logo & Branding */}
          <Link href="/">
            <div>
              <Image 
                src="/logo Alpha.png" 
                alt="Alpha Logo" 
                width={90}
                height={90}
              />
            </div>
            <div>
              <span>Alpha</span>
              <div></div>
              <span>Electricals & Plumbing Ltd</span>
            </div>
          </Link>

          <div>
            <nav>
              <div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button>
                        Products <ChevronDown />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                         <DropdownMenuItem asChild><Link href="/category/tanks">Water Tanks</Link></DropdownMenuItem>
                         <DropdownMenuItem asChild><Link href="/category/plumbing">Plumbing</Link></DropdownMenuItem>
                         <DropdownMenuItem asChild><Link href="/category/lighting">Lighting</Link></DropdownMenuItem>
                         <DropdownMenuItem asChild><Link href="/category/roofing">Roofing</Link></DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Link href="/contact">Contact Us</Link>
              <Link href="/about">About Us</Link>
            </nav>

            <div>
                <ShoppingCart />
                
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost">
                        {user?.avatarUrl ? (
                          <Avatar>
                            <AvatarImage src={user.avatarUrl} />
                            <AvatarFallback>{user.username?.charAt(0)}</AvatarFallback>
                          </Avatar>
                        ) : (
                          <User />
                        )}
                        <span>{user ? user.username : 'Log in'}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {user ? (
                        <>
                          <DropdownMenuLabel>{user.username}</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild><Link href="/profile">Settings</Link></DropdownMenuItem>
                          <DropdownMenuItem asChild><Link href="/wishlist">Wishlist</Link></DropdownMenuItem>
                          {user.role === 'admin' && <DropdownMenuItem asChild><Link href="/admin">Dashboard</Link></DropdownMenuItem>}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                        </>
                      ) : (
                        <div>
                          <Button asChild><Link href={`/auth/login?tab=login${authRedirect}`}>Log In</Link></Button>
                          <Button asChild variant="outline"><Link href={`/auth/login?tab=signup${authRedirect}`}>Sign Up</Link></Button>
                        </div>
                      )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Mobile View */}
        <div>
          <div>
            <Link href="/">
              <div>
                <Image 
                  src="/logo Alpha.png" 
                  alt="Alpha Logo" 
                  width={70}
                  height={70} 
                />
              </div>
            </Link>

            <div>
              <ShoppingCart />
              
              <Button variant="ghost" size="icon" asChild>
                <Link href="/profile">
                  <User />
                </Link>
              </Button>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                    <SheetDescription className="sr-only">Alpha Electricals Navigation</SheetDescription>
                  </SheetHeader>
                  <div>
                    <div>
                      <SheetClose asChild><Link href="/search">Products</Link></SheetClose>
                      <SheetClose asChild><Link href="/contact">Contact Us</Link></SheetClose>
                      <SheetClose asChild><Link href="/about">About Us</Link></SheetClose>
                    </div>
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
