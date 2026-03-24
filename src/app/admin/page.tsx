
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Users, Package, Receipt, BarChart } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/context/AuthProvider";

export default function AdminDashboardPage() {
    const { user } = useAuth();
    
    // In a real app, this data would be fetched from a backend.
    const stats = {
        products: 89,
        transactions: 12,
        revenue: 4,
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
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Transactions</CardTitle>
                        <Receipt className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.transactions}</div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <BarChart className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{stats.revenue}</div>
                    </CardContent>
                </Card>
            </div>
            
            <div className="relative w-full aspect-[16/6] rounded-lg overflow-hidden shadow-lg">
                <Image 
                    src="/elegant_background.jpg"
                    alt="Elegant background"
                    fill
                    className="object-cover"
                    data-ai-hint="elegant abstract background"
                />
                 <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <h2 className="text-4xl font-bold text-white text-center font-headline">
                        Manage Your Store with Ease
                    </h2>
                </div>
            </div>
        </div>
    );
}
