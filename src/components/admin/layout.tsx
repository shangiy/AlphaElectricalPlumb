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
  ChevronsRight
} from 'lucide-react';
import AuthGuard from '@/components/auth/AuthGuard';
import { useAuth } from '@/context/AuthProvider';
import { cn } from '@/lib/utils';

function AdminSidebarWrapper({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();
  const { isMobile, setOpenMobile, openMobile } = useSidebar();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const menuItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Inventory', href: '/admin/products', icon: Package },
    { label: 'Users & Roles', href: '/admin/users', icon: Users },
    { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { label: 'Transactions', href: '/admin/transactions', icon: Receipt },
    { label: 'Homepage View', href: '/', icon: Home },
    { label: 'Visual Logs', href: '/admin/selfies', icon: Camera },
    { label: 'Storefront CMS', href: '/admin/featured', icon: LayoutTemplate },
    { label: 'System Settings', href: '/admin/settings', icon: Settings },
  ];

  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
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
        >
          {openMobile ? <ChevronsLeft size={20} /> : <ChevronsRight size={20} />}
        </button>
      )}

      <Sidebar className="flex flex-col border-r bg-muted/20">
        <SidebarHeader className="p-6 shrink-0">
          <Link href="/admin" onClick={handleNavClick} className="flex items-center gap-4 group">
              <Image src="/logo Alpha.png" alt="Alpha" width={90} height={90} className="transition-transform group-hover:scale-110" />
              <div className="flex flex-col">
                <span className="text-xl font-black text-accent uppercase tracking-tighter leading-none">Admin</span>
                {!isMobile && <span className="text-[9px] font-bold text-primary uppercase tracking-[0.2em] mt-1">Ecosystem v4.3.0</span>}
              </div>
          </Link>
        </SidebarHeader>

        <SidebarContent ref={scrollRef} className="p-3 scrollbar-hide">
          <SidebarMenu className="gap-1 pb-10">
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton asChild tooltip={item.label} className="h-11 rounded-xl" onClick={handleNavClick}>
                  <Link href={item.href}>
                    <item.icon className="w-5 h-5 text-accent/70 group-hover:text-primary transition-colors" />
                    <span className="font-semibold text-sm tracking-tight">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            <div className="mt-4 pt-4 border-t border-muted">
              <button onClick={() => { handleNavClick(); logout(); }} className="w-full flex items-center gap-3 px-4 py-3 text-xs font-black uppercase tracking-widest text-red-600 bg-red-50 hover:bg-red-100 rounded-2xl transition-colors mt-2">
                <LogOut className="w-4 h-4" /> Terminate Session
              </button>
            </div>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      
      <div className="flex flex-1 flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto bg-background/50">
              <div className="p-4 md:p-8 lg:p-12">{children}</div>
          </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRoles={['admin', 'staff']}>
      <SidebarProvider>
        <AdminSidebarWrapper>{children}</AdminSidebarWrapper>
      </SidebarProvider>
    </AuthGuard>
  );
}
