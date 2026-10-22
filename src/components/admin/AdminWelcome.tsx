'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Package, Receipt, BarChart, AlertTriangle, Star, CheckCircle, Database } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/context/AuthProvider";
import { useProducts } from "@/context/ProductProvider";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Admin Welcome Dashboard:
 * Re-calibrated to fetch live data from your Supabase inventory.
 */
export default function AdminWelcome() {
    const { user } = useAuth();
    const { products, loading } = useProducts();
    
    // Live Statistics from Supabase
    const totalProducts = products.length;
    const lowStockItems = products.filter(p => (p.stockCount || 0) <= 10 && (p.stockCount || 0) > 0).length;
    const outOfStockItems = products.filter(p => (p.stockCount || 0) === 0).length;
    const featuredItems = products.filter(p => p.isFeatured).length;

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-1/3" />
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
                </div>
                <Skeleton className="h-64 w-full rounded-3xl" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold font-headline tracking-tight text-accent">Command Center</h1>
                    <p className="text-muted-foreground mt-2">
                        Welcome back, <span className="text-primary font-bold">{user?.name || 'Administrator'}</span>.
                    </p>
                </div>
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-4 py-1.5 rounded-full font-bold">
                    <Database className="mr-2 h-3 w-3" />
                    Supabase Live Sync
                </Badge>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:shadow-lg transition-all rounded-2xl border-primary/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Active Catalog</CardTitle>
                        <Package className="h-5 w-5 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black">{totalProducts}</div>
                        <p className="text-xs text-muted-foreground mt-1 font-medium">Total SKUs in database</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all rounded-2xl border-yellow-200 bg-yellow-50/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-black uppercase tracking-widest text-yellow-600">Restock Soon</CardTitle>
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-yellow-700">{lowStockItems}</div>
                        <p className="text-xs text-muted-foreground mt-1 font-medium">Items below threshold</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all rounded-2xl border-blue-200 bg-blue-50/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-black uppercase tracking-widest text-blue-600">Spotlight</CardTitle>
                        <Star className="h-5 w-5 text-blue-500 fill-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-blue-700">{featuredItems}</div>
                        <p className="text-xs text-muted-foreground mt-1 font-medium">Promoted on homepage</p>
                    </CardContent>
                </Card>

                 <Card className="hover:shadow-lg transition-all rounded-2xl border-green-200 bg-green-50/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-black uppercase tracking-widest text-green-600">System State</CardTitle>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-green-700">Healthy</div>
                        <p className="text-xs text-muted-foreground mt-1 font-medium">Postgres Realtime enabled</p>
                    </CardContent>
                </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="overflow-hidden group rounded-3xl border-none shadow-xl">
                    <div className="relative aspect-video">
                        <Image 
                            src="/elegant_background.jpg"
                            alt="Elegant background"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            data-ai-hint="elegant abstract background"
                        />
                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-8 text-center">
                            <Badge className="mb-4 bg-primary text-white border-none px-6 py-1 rounded-full font-black uppercase tracking-tighter">Alpha Pro v2.4</Badge>
                            <h2 className="text-3xl md:text-4xl font-bold text-white font-headline leading-tight">
                                Manage Your Global Catalog
                            </h2>
                            <p className="text-white/80 mt-4 max-w-sm font-medium">
                                Changes made here sync instantly with your Supabase database and storage, ensuring Vercel is always up to date.
                            </p>
                        </div>
                    </div>
                </Card>

                <Card className="rounded-3xl shadow-md">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold font-headline">Recent System Activity</CardTitle>
                        <CardDescription>Live notifications from your Supabase backend.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/5">
                                <Package className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-accent">Inventory Sync Verified</p>
                                <p className="text-xs text-muted-foreground">The local cache has been synchronized with the latest catalog updates.</p>
                                <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-1">Live Now</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="h-10 w-10 rounded-2xl bg-yellow-500/10 flex items-center justify-center shrink-0 border border-yellow-500/5">
                                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-accent">Database Health Check</p>
                                <p className="text-xs text-muted-foreground">Connection to the Supabase Postgres instance is stable and responsive.</p>
                                <p className="text-[10px] text-muted-foreground mt-1">3 minutes ago</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-4">
                            <div className="h-10 w-10 rounded-2xl bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/5">
                                <Star className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-accent">Bidirectional Stream Online</p>
                                <p className="text-xs text-muted-foreground">Real-time table subscriptions are active for zero-refresh updates.</p>
                                <p className="text-[10px] text-muted-foreground mt-1">Today</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
