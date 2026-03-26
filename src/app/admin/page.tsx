'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Users, Package, Receipt, BarChart } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/context/AuthProvider";
import { useProducts } from "@/context/ProductProvider";

export default function AdminDashboardPage() {
    const { user } = useAuth();
    const { products } = useProducts();
    
    // Static stats for demonstration, except products which is now dynamic
    const stats = {
        products: products.length,
        transactions: 12,
        revenue: "4.2M",
    };

    const formatCurrency = (amount: number) => {
         return new Intl.NumberFormat('en-KE', {
          style: 'currency',
          currency: 'KES',
          currencyDisplay: 'code',
        }).format(amount);
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold font-headline">Welcome, {user?.name || 'Admin'}!</h1>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                        <Package className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.products}</div>
                        <p className="text-xs text-muted-foreground">In active catalog</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Transactions</CardTitle>
                        <Receipt className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.transactions}</div>
                        <p className="text-xs text-muted-foreground">Awaiting processing</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Estimated Revenue</CardTitle>
                        <BarChart className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">KES {stats.revenue}</div>
                        <p className="text-xs text-muted-foreground">Year to date</p>
                    </CardContent>
                </Card>
            </div>
            
            <div className="relative w-full aspect-[16/6] rounded-lg overflow-hidden shadow-lg border">
                <Image 
                    src="/elegant_background.jpg"
                    alt="Elegant background"
                    fill
                    className="object-cover"
                    data-ai-hint="elegant abstract background"
                />
                 <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <h2 className="text-4xl font-bold text-white text-center font-headline px-4">
                        Manage Your Alpha Electricals Inventory
                    </h2>
                </div>
            </div>
        </div>
    );
}
