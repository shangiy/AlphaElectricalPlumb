
'use client';

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
import { LayoutDashboard, LogOut, Settings, Users, Receipt, Package, BarChart, Home, Camera } from 'lucide-react';
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
          <Sidebar className="flex flex-col">
            <SidebarHeader>
              <Link href="/admin" className="flex items-center gap-2">
                  <Image src="/logo Alpha.png" alt="Logo" width={40} height={40}/>
                  <span className="text-lg font-semibold">Admin Panel</span>
              </Link>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Dashboard">
                    <Link href="/admin">
                      <LayoutDashboard />
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Products">
                    <Link href="/admin/products">
                      <Package />
                      <span>Products</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Selfies">
                    <Link href="/admin/selfies">
                      <Camera />
                      <span>Selfies</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Analytics">
                    <Link href="/admin/analytics">
                      <BarChart />
                      <span>Analytics</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {user?.role === 'admin' && (
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Users">
                      <Link href="/admin/users">
                        <Users />
                        <span>Users</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Transactions">
                    <Link href="/admin/transactions">
                      <Receipt />
                      <span>Transactions</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Go to Homepage">
                        <Link href="/">
                            <Home />
                            <span>Homepage</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Settings">
                        <Link href="#">
                            <Settings />
                            <span>Settings</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton onClick={logout} tooltip="Log Out">
                        <LogOut />
                        <span>Log Out</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
          <div className="flex flex-1 flex-col overflow-hidden">
              <main className="flex-1 overflow-y-auto bg-muted/40">
                  <div className="p-4 md:p-6">
                      {children}
                  </div>
                  <Footer />
              </main>
          </div>
        </div>
      </SidebarProvider>
    </AuthGuard>
  );
}
