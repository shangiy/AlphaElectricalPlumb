'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import RevenueAreaChart from "@/components/admin/charts/RevenueAreaChart";
import SalesBarChart from "@/components/admin/charts/SalesBarChart";
import CategoryPieChart from "@/components/admin/charts/CategoryPieChart";
import { Users, MousePointer2, ShoppingCart, RefreshCw, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AnalyticsPage() {
    const pulseStats = [
        { title: "Daily Visitors", value: "1,284", change: "+12.5%", isPositive: true, icon: <Users className="h-4 w-4" /> },
        { title: "Avg. Session", value: "4m 32s", change: "+2.1%", isPositive: true, icon: <RefreshCw className="h-4 w-4" /> },
        { title: "Conversion Rate", value: "3.24%", change: "-0.4%", isPositive: false, icon: <MousePointer2 className="h-4 w-4" /> },
        { title: "Abandoned Carts", value: "42", change: "-8.2%", isPositive: true, icon: <ShoppingCart className="h-4 w-4" /> },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-headline">Business Pulse</h1>
                <Badge variant="outline" className="bg-primary/10 text-primary font-bold">LIVE DATA</Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {pulseStats.map((stat, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{stat.title}</CardTitle>
                            <div className="p-2 bg-muted rounded-lg">{stat.icon}</div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <div className={cn("flex items-center text-xs font-bold mt-1", stat.isPositive ? "text-green-600" : "text-red-600")}>
                                {stat.isPositive ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                                {stat.change} 
                                <span className="text-muted-foreground font-normal ml-1">vs last 24h</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Revenue Flow</CardTitle>
                        <CardDescription>Monthly growth trends for 2026</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RevenueAreaChart />
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Sales Mix</CardTitle>
                        <CardDescription>Performance by category</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <CategoryPieChart />
                    </CardContent>
                </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Inventory Velocity</CardTitle>
                        <CardDescription>Sales vs Target goals</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SalesBarChart />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Useful Insights</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-4">
                        <div className="p-3 bg-muted/50 rounded-lg border-l-4 border-primary">
                            <p className="font-bold text-foreground">Top Performer</p>
                            <p>Water Tanks saw a 40% surge this week. Consider featuring more high-capacity models.</p>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg border-l-4 border-yellow-500">
                            <p className="font-bold text-foreground">Restock Alert</p>
                            <p>12 plumbing items are under the stock threshold. Check Inventory for details.</p>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg border-l-4 border-blue-500">
                            <p className="font-bold text-foreground">Marketing Tip</p>
                            <p>Conversion from TikTok ads is peaking at 8 PM. Schedule next posts accordingly.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}