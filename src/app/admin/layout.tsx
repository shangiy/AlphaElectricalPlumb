'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import Image from 'next/image';
import { 
  LayoutDashboard, 
  LogOut, 
  Package, 
  Home, 
  Camera, 
  Receipt, 
  BarChart3, 
  Users, 
  Settings,
  LayoutTemplate,
  ChevronUp,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  MessageSquareQuote
} from 'lucide-react';
import AuthGuard from '@/components/auth/AuthGuard';
import { useAuth } from '@/context/AuthProvider';
import { cn } from '@/lib/utils';

/**
 * Admin Layout v5.3.0:
 * Features Role-Based Navigation Filtering for Staff vs Admin.
 */
function AdminSidebarWrapper({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { isMobile, setOpenMobile, openMobile } = useSidebar();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);

  const menuItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Inventory', href: '/admin/products', icon: Package },
    { label: 'Users & Roles', href: '/admin/users', icon: Users },
    { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { label: 'Reviews', href: '/admin/reviews', icon: MessageSquareQuote },
    { label: 'Transactions', href: '/admin/transactions', icon: Receipt },
    { label: 'Homepage View', href: '/', icon: Home },
    { label: 'Visual Logs', href: '/admin/selfies', icon: Camera },
    { label: 'Storefront CMS', href: '/admin/featured', icon: LayoutTemplate },
    { label: 'System Settings', href: '/admin/settings', icon: Settings },
  ];

  // Dynamic filtering: Staff cannot see Users, Analytics, or CMS links
  const visibleMenuItems = menuItems.filter(item => {
    if (user?.role === 'staff') {
      const restricted = ['/admin/users', '/admin/analytics', '/admin/featured'];
      return !restricted.includes(item.href);
    }
    return true;
  });

  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const checkScroll = useCallback(() => {
    if (scrollRef.current && !isMobile) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      setCanScrollUp(scrollTop > 10);
      setCanScrollDown(scrollTop + clientHeight < scrollHeight - 10);
    }
  }, [isMobile]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el && !isMobile) {
      checkScroll();
      el.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [checkScroll, isMobile]);

  const scrollTo = (direction: 'up' | 'down') => {
    if (scrollRef.current) {
      const amount = direction === 'up' ? -150 : 150;
      scrollRef.current.scrollBy({ top: amount, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden relative">
      {isMobile && (
        <button 
          onClick={() => setOpenMobile(!openMobile)}
          className={cn(
            "fixed top-1/2 -translate-y-1/2 z-[200] h-24 w-10 bg-primary text-white shadow-[10px_0_40px_rgba(0,0,0,0.3)] flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] rounded-r-[2rem] border-y border-r border-white/20",
            openMobile ? "left-[18rem]" : "left-0"
          )}
          aria-label={openMobile ? "Close Admin Menu" : "Open Admin Menu"}
        >
          {openMobile ? (
            <ChevronsLeft className="h-6 w-6" />
          ) : (
            <ChevronsRight className="h-6 w-6 animate-pulse" />
          )}
        </button>
      )}

      <Sidebar className="flex flex-col border-r bg-muted/20">
        <SidebarHeader className="p-6 shrink-0">
          <Link href="/admin" onClick={handleNavClick} className="flex items-center gap-4 group">
              <Image src="/logo Alpha.png" alt="Alpha" width={90} height={90} className="transition-transform group-hover:scale-110" />
              <div className="flex flex-col">
                <span className="text-xl font-black text-accent uppercase tracking-tighter leading-none">Admin</span>
                {!isMobile && <span className="text-[9px] font-bold text-primary uppercase tracking-[0.2em] mt-1">Ecosystem v5.3.0</span>}
              </div>
          </Link>
        </SidebarHeader>

        <div className="flex-1 relative flex flex-col overflow-hidden">
          {!isMobile && canScrollUp && (
            <div className="absolute top-0 left-0 right-0 z-20 flex justify-center py-1 bg-gradient-to-b from-background via-background/80 to-transparent transition-opacity duration-300 pointer-events-none">
              <button 
                onClick={(e) => { e.stopPropagation(); scrollTo('up'); }} 
                className="p-1 rounded-full bg-primary text-white shadow-lg pointer-events-auto hover:scale-110 transition-transform"
              >
                <ChevronUp className="h-4 w-4 animate-bounce" />
              </button>
            </div>
          )}

          <SidebarContent 
            ref={scrollRef} 
            className="p-3 scrollbar-hide"
          >
            <SidebarMenu className="gap-1 pb-10">
              {visibleMenuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton 
                    asChild 
                    tooltip={item.label} 
                    className="h-11 rounded-xl"
                    onClick={handleNavClick}
                  >
                    <Link href={item.href}>
                      <item.icon className="w-5 h-5 text-accent/70 group-hover:text-primary transition-colors" />
                      <span className="font-semibold text-sm tracking-tight">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              <div className="mt-4 pt-4 border-t border-muted">
                <SidebarMenuItem>
                  <button 
                    onClick={() => { handleNavClick(); logout(); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-xs font-black uppercase tracking-widest text-red-600 bg-red-50 hover:bg-red-100 rounded-2xl transition-colors mt-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Terminate Session
                  </button>
                </SidebarMenuItem>
              </div>
            </SidebarMenu>
          </SidebarContent>

          {!isMobile && canScrollDown && (
            <div className="absolute bottom-0 left-0 right-0 z-20 flex justify-center py-1 bg-gradient-to-t from-background via-background/80 to-transparent transition-opacity duration-300 pointer-events-none">
              <button 
                onClick={(e) => { e.stopPropagation(); scrollTo('down'); }} 
                className="p-1 rounded-full bg-primary text-white shadow-lg pointer-events-auto hover:scale-110 transition-transform"
              >
                <ChevronDown className="h-4 w-4 animate-bounce" />
              </button>
            </div>
          )}
        </div>
      </Sidebar>
      
      <div className="flex flex-1 flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto bg-background/50">
              <div className="p-4 md:p-8 lg:p-12">
                  {children}
              </div>
          </main>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard allowedRoles={['admin', 'staff']}>
      <SidebarProvider>
        <AdminSidebarWrapper>
          {children}
        </AdminSidebarWrapper>
      </SidebarProvider>
    </AuthGuard>
  );
}
