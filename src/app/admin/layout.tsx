'use client';

import React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
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
  Palette
} from 'lucide-react';
import AuthGuard from '@/components/auth/AuthGuard';
import { useAuth } from '@/context/AuthProvider';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { logout } = useAuth();

  const menuItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { label: 'Transactions', href: '/admin/transactions', icon: Receipt },
    { label: 'Homepage', href: '/', icon: Home },
    { label: 'Selfies', href: '/admin/selfies', icon: Camera },
    { label: 'UI/UX Control', href: '/admin/featured', icon: Palette },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <AuthGuard allowedRoles={['admin', 'staff']}>
      <SidebarProvider>
        <div className="flex h-screen w-full bg-background">
          <Sidebar className="flex flex-col border-r bg-muted/20">
            <SidebarHeader className="p-6">
              <Link href="/admin" className="flex items-center gap-3 group">
                  <Image src="/logo Alpha.png" alt="Alpha" width={45} height={45} className="transition-transform group-hover:scale-110" />
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-accent uppercase tracking-tighter">Admin Panel</span>
                    <span className="text-[10px] font-bold text-primary uppercase">v2.4.0 Live</span>
                  </div>
              </Link>
            </SidebarHeader>
            <SidebarContent className="p-3">
              <SidebarMenu className="gap-1">
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild tooltip={item.label} className="h-11 rounded-xl">
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
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-xs font-black uppercase tracking-widest text-red-600 bg-red-50 hover:bg-red-100 rounded-2xl transition-colors mt-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Log Out
                    </button>
                  </SidebarMenuItem>
                </div>
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
          
          <div className="flex flex-1 flex-col overflow-hidden">
              <main className="flex-1 overflow-y-auto bg-background/50">
                  <div className="p-4 md:p-8 lg:p-12">
                      {children}
                  </div>
              </main>
          </div>
        </div>
      </SidebarProvider>
    </AuthGuard>
  );
}
