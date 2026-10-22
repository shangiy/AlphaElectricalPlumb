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
import { LayoutDashboard, LogOut, Package, BarChart, Home, Camera, Users, Receipt } from 'lucide-react';
import AuthGuard from '@/components/auth/AuthGuard';
import { useAuth } from '@/context/AuthProvider';
import Footer from '@/components/common/Footer';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();

  return (
    <AuthGuard allowedRoles={['admin', 'staff']}>
      <SidebarProvider>
        <div className="flex h-screen w-full bg-background">
          <Sidebar className="flex flex-col border-r bg-muted/20">
            <SidebarHeader className="p-4">
              <Link href="/admin" className="flex items-center gap-3 group">
                  <Image src="/logo Alpha.png" alt="Alpha" width={45} height={45} className="transition-transform group-hover:scale-110" />
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-accent uppercase tracking-tighter">Admin Panel</span>
                    <span className="text-[10px] font-bold text-primary uppercase">v2.4.0 Live</span>
                  </div>
              </Link>
            </SidebarHeader>
            <SidebarContent className="p-2">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Manager" className="h-12 rounded-xl">
                    <Link href="/admin">
                      <LayoutDashboard className="text-primary" />
                      <span className="font-bold">Unified Manager</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <div className="px-4 py-4">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4">Quick Tools</p>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Home" className="h-10 rounded-xl mb-1">
                      <Link href="/">
                        <Home className="w-4 h-4" />
                        <span className="text-xs font-semibold">View Website</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Selfies" className="h-10 rounded-xl mb-1">
                      <Link href="/admin/selfies">
                        <Camera className="w-4 h-4" />
                        <span className="text-xs font-semibold">Visual Search Logs</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                   <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Transactions" className="h-10 rounded-xl">
                      <Link href="/admin/transactions">
                        <Receipt className="w-4 h-4" />
                        <span className="text-xs font-semibold">Order History</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </div>

                <div className="mt-auto px-4 pb-6">
                  <button 
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-xs font-black uppercase tracking-widest text-red-600 bg-red-50 hover:bg-red-100 rounded-2xl transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
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
