'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Package, Receipt, BarChart, AlertTriangle, Star, CheckCircle } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/context/AuthProvider";
import { useProducts } from "@/context/ProductProvider";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminWelcome() {
    const { user } = useAuth();
    const { products, loading } = useProducts();
    
    // Live Supabase Stats
    const totalProducts = products.length;
    const lowStockItems = products.filter(p => p.stockCount <= 10 && p.stockCount > 0).length;
    const outOfStockItems = products.filter(p => (p.stockCount || 0) === 0).length;
    const featuredItems = products.filter(p => p.isFeatured).length;

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-1/3" />
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full" />)}
                </div>
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold font-headline tracking-tight">Command Center</h1>
                <p className="text-muted-foreground mt-2">Welcome back, {user?.name || 'Administrator'}. Here is your live business overview.</p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Inventory Size</CardTitle>
                        <Package className="h-5 w-5 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black">{totalProducts}</div>
                        <p className="text-xs text-muted-foreground mt-1">Total active SKUs</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow border-yellow-200 bg-yellow-50/30">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-yellow-600">Restock Soon</CardTitle>
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-yellow-700">{lowStockItems}</div>
                        <p className="text-xs text-muted-foreground mt-1">Items below threshold</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow border-blue-200 bg-blue-50/30">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-blue-600">Spotlight</CardTitle>
                        <Star className="h-5 w-5 text-blue-500 fill-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-blue-700">{featuredItems}</div>
                        <p className="text-xs text-muted-foreground mt-1">Products on homepage</p>
                    </CardContent>
                </Card>

                 <Card className="hover:shadow-md transition-shadow border-green-200 bg-green-50/30">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-green-600">System Status</CardTitle>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-green-700">Healthy</div>
                        <p className="text-xs text-muted-foreground mt-1">Supabase Realtime Enabled</p>
                    </CardContent>
                </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="overflow-hidden group">
                    <div className="relative aspect-video">
                        <Image 
                            src="/elegant_background.jpg"
                            alt="Elegant background"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            data-ai-hint="elegant abstract background"
                        />
                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-8 text-center">
                            <Badge className="mb-4 bg-primary text-white border-none">Alpha Pro</Badge>
                            <h2 className="text-3xl font-bold text-white font-headline leading-tight">
                                Manage Your Alpha Electricals Inventory
                            </h2>
                            <p className="text-white/80 mt-4 max-w-sm">
                                Full control over stock counts, featured items, and catalog metadata with bidirectional Supabase sync.
                            </p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Live notifications from your store.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <Package className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-bold">New Product Added</p>
                                <p className="text-xs text-muted-foreground">The database was updated with 12 new electrical fittings.</p>
                                <p className="text-[10px] text-muted-foreground mt-1">2 hours ago</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center shrink-0">
                                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-sm font-bold">Low Stock Warning</p>
                                <p className="text-xs text-muted-foreground">"Kentank 2000L" is down to 2 units in Eldoret Warehouse.</p>
                                <p className="text-[10px] text-muted-foreground mt-1">4 hours ago</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-4">
                            <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                                <Star className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-bold">Catalog Featured Update</p>
                                <p className="text-xs text-muted-foreground">Admin changed the featured status of "Decorative Lighting".</p>
                                <p className="text-[10px] text-muted-foreground mt-1">Yesterday</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
