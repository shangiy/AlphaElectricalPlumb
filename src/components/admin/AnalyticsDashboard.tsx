'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import RevenueAreaChart from "@/components/admin/charts/RevenueAreaChart";
import SalesBarChart from "@/components/admin/charts/SalesBarChart";
import CategoryPieChart from "@/components/admin/charts/CategoryPieChart";
import PlatformAnalyticsChart from "@/components/admin/charts/PlatformAnalyticsChart";
import { Users, MousePointer2, ShoppingCart, RefreshCw, ArrowUpRight, ArrowDownRight, Zap, Database, Activity, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AnalyticsDashboard() {
    const pulseStats = [
        { title: "Daily Visitors", value: "1,284", change: "+12.5%", isPositive: true, icon: <Users className="h-4 w-4" /> },
        { title: "Avg. Session", value: "4m 32s", change: "+2.1%", isPositive: true, icon: <RefreshCw className="h-4 w-4" /> },
        { title: "Conversion Rate", value: "3.24%", change: "-0.4%", isPositive: false, icon: <MousePointer2 className="h-4 w-4" /> },
        { title: "Abandoned Carts", value: "42", change: "-8.2%", isPositive: true, icon: <ShoppingCart className="h-4 w-4" /> },
    ];

    const infraMetrics = [
        { label: "Edge Cache Hit", value: "94.2%", icon: <Globe className="h-3.5 w-3.5 text-accent" />, sub: "Vercel Deployment" },
        { label: "DB Latency", value: "12ms", icon: <Database className="h-3.5 w-3.5 text-primary" />, sub: "Supabase Postgres" },
        { label: "API Response", value: "148ms", icon: <Zap className="h-3.5 w-3.5 text-yellow-500" />, sub: "Global Average" },
        { label: "Active Threads", value: "18", icon: <Activity className="h-3.5 w-3.5 text-green-500" />, sub: "System Load" },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-black font-headline uppercase tracking-tighter text-accent">Business Pulse</h1>
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <Badge variant="outline" className="bg-primary/5 text-primary font-black uppercase tracking-widest text-[10px]">System Online</Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {pulseStats.map((stat, i) => (
                    <Card key={i} className="rounded-2xl border-none shadow-sm bg-white/50 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{stat.title}</CardTitle>
                            <div className="p-2 bg-muted rounded-xl">{stat.icon}</div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black tracking-tight">{stat.value}</div>
                            <div className={cn("flex items-center text-[10px] font-black mt-1 uppercase tracking-tighter", stat.isPositive ? "text-green-600" : "text-red-600")}>
                                {stat.isPositive ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
                                {stat.change} 
                                <span className="text-muted-foreground font-bold ml-1">v. yesterday</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* NEW Infrastructure Intelligence Card */}
            <Card className="rounded-[2.5rem] border shadow-xl overflow-hidden bg-white">
                <CardHeader className="bg-accent text-white p-8 border-b border-white/5">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <Activity className="text-primary h-6 w-6" />
                            <CardTitle className="text-xl font-black uppercase tracking-tight">Platform Synergy</CardTitle>
                        </div>
                        <Badge className="bg-white/10 text-white border-none font-black text-[9px] uppercase tracking-[0.2em]">Edge Node Cluster</Badge>
                    </div>
                    <CardDescription className="text-white/60 font-medium">Correlation between frontend edge traffic and backend database synchronization.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {infraMetrics.map((m, i) => (
                            <div key={i} className="p-5 rounded-[1.5rem] bg-secondary/50 border border-muted flex flex-col gap-3 group hover:bg-white hover:shadow-lg transition-all">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 rounded-lg bg-white shadow-sm">{m.icon}</div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{m.label}</span>
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-accent">{m.value}</p>
                                    <p className="text-[9px] font-bold text-muted-foreground/60 uppercase mt-0.5">{m.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="pt-4 border-t border-dashed">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 mb-6 text-center">Telemetry Stream: Vercel requests vs. Supabase I/O</p>
                        <PlatformAnalyticsChart />
                    </div>
                </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 rounded-[2.5rem] border shadow-xl overflow-hidden">
                    <CardHeader className="bg-muted/30 p-8 border-b">
                        <CardTitle className="text-xl font-black uppercase tracking-tight text-accent">Revenue Flow</CardTitle>
                        <CardDescription className="font-medium">Monthly growth trends for the 2026 fiscal cycle.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                        <RevenueAreaChart />
                    </CardContent>
                </Card>
                 <Card className="rounded-[2.5rem] border shadow-xl overflow-hidden">
                    <CardHeader className="bg-muted/30 p-8 border-b">
                        <CardTitle className="text-xl font-black uppercase tracking-tight text-accent">Sales Mix</CardTitle>
                        <CardDescription className="font-medium">Performance categorized by inventory type.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                       <CategoryPieChart />
                    </CardContent>
                </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <Card className="lg:col-span-2 rounded-[2.5rem] border shadow-xl overflow-hidden">
                    <CardHeader className="bg-muted/30 p-8 border-b">
                        <CardTitle className="text-xl font-black uppercase tracking-tight text-accent">Inventory Velocity</CardTitle>
                        <CardDescription className="font-medium">Sales performance against quarterly deployment goals.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                        <SalesBarChart />
                    </CardContent>
                </Card>
                <Card className="rounded-[2.5rem] border shadow-xl overflow-hidden">
                    <CardHeader className="bg-primary/5 p-8 border-b">
                        <CardTitle className="text-xl font-black uppercase tracking-tight text-primary">Strategic Insights</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 text-sm text-muted-foreground space-y-4 font-medium">
                        <div className="p-4 bg-muted/50 rounded-2xl border-l-4 border-primary">
                            <p className="font-black text-accent uppercase tracking-tighter mb-1">High-Volume Alert</p>
                            <p>Water Tanks saw a 40% surge this week. The system recommends featuring high-capacity models on the spotlight.</p>
                        </div>
                        <div className="p-4 bg-muted/50 rounded-2xl border-l-4 border-yellow-500">
                            <p className="font-black text-accent uppercase tracking-tighter mb-1">Restock Protocol</p>
                            <p>12 plumbing items have fallen below the critical threshold. Administrative review required in the Inventory panel.</p>
                        </div>
                        <div className="p-4 bg-muted/50 rounded-2xl border-l-4 border-blue-500">
                            <p className="font-black text-accent uppercase tracking-tighter mb-1">Optimization Note</p>
                            <p>Conversion Peak: 8:00 PM. Vercel Cache Hit rate is optimal, but Supabase latency increased slightly during this window.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
