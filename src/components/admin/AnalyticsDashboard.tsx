'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import RevenueAreaChart from "@/components/admin/charts/RevenueAreaChart";
import SalesBarChart from "@/components/admin/charts/SalesBarChart";
import CategoryPieChart from "@/components/admin/charts/CategoryPieChart";
import PlatformAnalyticsChart from "@/components/admin/charts/PlatformAnalyticsChart";
import { 
  Users, 
  MousePointer2, 
  ShoppingCart, 
  RefreshCw, 
  ArrowUpRight, 
  ArrowDownRight, 
  Zap, 
  Database, 
  Activity, 
  Globe, 
  MapPin, 
  Link as LinkIcon, 
  Eye
} from "lucide-react";
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

    const liveAudience = [
        { label: "Live Online", value: "24", icon: <Activity className="h-3.5 w-3.5 text-green-500" />, detail: "Real-time sync" },
        { label: "Last 24 Hours", value: "1,842", icon: <Users className="h-3.5 w-3.5 text-primary" />, detail: "Total Unique" },
    ];

    const geoDistribution = [
        { region: "Nairobi, KE", percentage: "45%", count: "828" },
        { region: "Eldoret, KE", percentage: "32%", count: "589" },
        { region: "London, UK", percentage: "8%", count: "147" },
        { region: "Delaware, US", percentage: "5%", count: "92" },
    ];

    const liveTraffic = [
        { path: "/products/kentank-5000l", time: "Just now", status: "200 OK" },
        { path: "/category/tanks", time: "2m ago", status: "200 OK" },
        { path: "/search?q=pvc+pipes", time: "5m ago", status: "200 OK" },
        { path: "/checkout", time: "8m ago", status: "304 Cache" },
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

            {/* Infrastructure & Audience Intelligence Card */}
            <Card className="rounded-[2.5rem] border shadow-xl overflow-hidden bg-white">
                <CardHeader className="bg-accent text-white p-8 border-b border-white/5">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <Activity className="text-primary h-6 w-6" />
                            <CardTitle className="text-xl font-black uppercase tracking-tight">Platform Synergy</CardTitle>
                        </div>
                        <Badge className="bg-white/10 text-white border-none font-black text-[9px] uppercase tracking-[0.2em]">Edge Node Cluster</Badge>
                    </div>
                    <CardDescription className="text-white/60 font-medium">Correlation between frontend edge traffic, live audience, and backend synchronization.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-12">
                    {/* Primary Performance Row */}
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

                    {/* Live Visitor row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Eye className="h-4 w-4 text-primary" />
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-accent">Audience Pulse</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {liveAudience.map((a, i) => (
                                    <div key={i} className="p-6 rounded-[2rem] bg-muted/30 border border-dashed flex flex-col items-center text-center">
                                        <div className="mb-2">{a.icon}</div>
                                        <p className="text-3xl font-black text-accent">{a.value}</p>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{a.label}</p>
                                        <p className="text-[8px] font-black text-primary uppercase mt-1">{a.detail}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Regional Breakdown */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <MapPin className="h-4 w-4 text-primary" />
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-accent">Global Reach</h3>
                            </div>
                            <div className="space-y-3 bg-muted/20 p-6 rounded-[2rem]">
                                {geoDistribution.map((g, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-muted-foreground">{g.region}</span>
                                        <div className="flex items-center gap-3">
                                            <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                                                <div className="h-full bg-primary" style={{ width: g.percentage }} />
                                            </div>
                                            <span className="text-xs font-black text-accent w-10 text-right">{g.percentage}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Live Traffic Paths */}
                    <div className="pt-4 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <LinkIcon className="h-4 w-4 text-primary" />
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-accent">Live Resource Stream</h3>
                        </div>
                        <div className="overflow-hidden rounded-2xl border bg-muted/10">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className="bg-muted/50">
                                        <th className="p-4 font-black uppercase tracking-widest text-[9px] text-muted-foreground">Request Path</th>
                                        <th className="p-4 font-black uppercase tracking-widest text-[9px] text-muted-foreground">Timestamp</th>
                                        <th className="p-4 font-black uppercase tracking-widest text-[9px] text-muted-foreground text-right">Edge Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y border-t">
                                    {liveTraffic.map((t, i) => (
                                        <tr key={i} className="hover:bg-primary/5 transition-colors">
                                            <td className="p-4 font-mono font-medium text-primary">{t.path}</td>
                                            <td className="p-4 text-muted-foreground font-bold">{t.time}</td>
                                            <td className="p-4 text-right">
                                                <Badge className="bg-green-500/10 text-green-600 border-none font-black text-[9px] uppercase">{t.status}</Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-dashed">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 mb-6 text-center">Telemetry Sync: Edge Requests vs. Supabase I/O vs. Audience Load</p>
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
