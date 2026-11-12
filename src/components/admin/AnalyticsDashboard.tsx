'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import RevenueAreaChart from "@/components/admin/charts/RevenueAreaChart";
import SalesBarChart from "@/components/admin/charts/SalesBarChart";
import CategoryPieChart from "@/components/admin/charts/CategoryPieChart";
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
  Eye,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Maximize2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Line, LineChart, ResponsiveContainer, Area, AreaChart } from "recharts";

// Mock Data for Sparklines (Observability)
const sparklineData = [
  { val: 10 }, { val: 15 }, { val: 8 }, { val: 20 }, { val: 40 }, { val: 12 }, { val: 25 }, { val: 50 }, { val: 35 }, { val: 60 }
];

// Mock Data for Analytics Area Chart
const visitorData = [
  { day: 'Mon', val: 5 },
  { day: 'Tue', val: 15 },
  { day: 'Wed', val: 8 },
  { day: 'Thu', val: 12 },
  { day: 'Fri', val: 18 },
  { day: 'Sat', val: 22 },
  { day: 'Sun', val: 27 },
];

export default function AnalyticsDashboard() {
    const pulseStats = [
        { title: "Daily Visitors", value: "1,284", change: "+12.5%", isPositive: true, icon: <Users className="h-4 w-4" /> },
        { title: "Avg. Session", value: "4m 32s", change: "+2.1%", isPositive: true, icon: <RefreshCw className="h-4 w-4" /> },
        { title: "Conversion Rate", value: "3.24%", change: "-0.4%", isPositive: false, icon: <MousePointer2 className="h-4 w-4" /> },
        { title: "Abandoned Carts", value: "42", change: "-8.2%", isPositive: true, icon: <ShoppingCart className="h-4 w-4" /> },
    ];

    const recommendations = [
        { label: "Connect Git Repository", completed: true },
        { label: "Add Custom Domain", completed: true },
        { label: "Preview Deployment", completed: true },
        { label: "Enable Web Analytics", completed: true },
        { label: "Upgrade to Speed Insights Plus", completed: false },
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

            {/* VERCEL-STYLE CORE OBSERVABILITY ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* RECOMMENDATIONS CARD */}
                <Card className="rounded-xl border border-slate-200 shadow-sm overflow-hidden bg-white">
                    <CardHeader className="p-6 border-b bg-slate-50/50 flex flex-row items-center justify-between space-y-0">
                        <div className="flex items-center gap-2">
                            <CardTitle className="text-sm font-bold text-slate-900">Recommendations</CardTitle>
                            <Badge className="bg-blue-100 text-blue-700 border-none font-bold text-[10px] px-2 py-0">3/5</Badge>
                        </div>
                        <Maximize2 className="h-3.5 w-3.5 text-slate-400" />
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-slate-100">
                            {recommendations.map((rec, i) => (
                                <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "h-5 w-5 rounded-full border flex items-center justify-center transition-all",
                                            rec.completed ? "bg-blue-500 border-blue-500 text-white" : "bg-white border-slate-200 group-hover:border-blue-300"
                                        )}>
                                            {rec.completed && <CheckCircle2 className="h-3.5 w-3.5" />}
                                        </div>
                                        <span className={cn(
                                            "text-xs font-semibold transition-colors",
                                            rec.completed ? "text-blue-600" : "text-slate-600 group-hover:text-blue-500"
                                        )}>{rec.label}</span>
                                    </div>
                                    <ChevronRight className="h-3 w-3 text-slate-300 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* OBSERVABILITY CARD (6H Window) */}
                <Card className="rounded-xl border border-slate-200 shadow-sm overflow-hidden bg-white">
                    <CardHeader className="p-6 border-b bg-slate-50/50 flex flex-row items-center justify-between space-y-0">
                        <div className="flex items-center gap-2">
                            <CardTitle className="text-sm font-bold text-slate-900">Observability</CardTitle>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">6h</span>
                        </div>
                        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                    </CardHeader>
                    <CardContent className="p-6 space-y-8">
                        {/* CDN Requests */}
                        <div className="flex items-end justify-between gap-4">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">CDN Requests</p>
                                <p className="text-2xl font-black text-slate-900 tracking-tight">768</p>
                            </div>
                            <div className="flex-1 h-12 max-w-[140px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={sparklineData}>
                                        <Line type="monotone" dataKey="val" stroke="#3b82f6" strokeWidth={2} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Function Invocations */}
                        <div className="flex items-end justify-between gap-4">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Function Invocations</p>
                                <p className="text-2xl font-black text-slate-900 tracking-tight">174</p>
                            </div>
                            <div className="flex-1 h-12 max-w-[140px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={sparklineData}>
                                        <Line type="stepAfter" dataKey="val" stroke="#3b82f6" strokeWidth={2} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Error Rate */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Error Rate</p>
                                <span className="text-xs font-black text-slate-900 uppercase">0%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-slate-300 w-1/4 rounded-full" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* ANALYTICS CARD (1W Window) */}
                <Card className="rounded-xl border border-slate-200 shadow-sm overflow-hidden bg-white">
                    <CardHeader className="p-6 border-b bg-slate-50/50 flex flex-row items-center justify-between space-y-0">
                        <div className="flex items-center gap-2">
                            <CardTitle className="text-sm font-bold text-slate-900">Analytics</CardTitle>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">1w</span>
                        </div>
                        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <p className="text-2xl font-black text-slate-900 tracking-tight">27 Visitors</p>
                            <Badge className="bg-emerald-100 text-emerald-600 border-none font-black text-[10px] uppercase px-2 py-0.5">
                                93%
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2 mb-6">
                            <div className="h-2 w-2 rounded-full bg-slate-200" />
                            <span className="text-xs font-bold text-slate-400">0 online</span>
                        </div>

                        <div className="h-40 w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={visitorData}>
                                    <defs>
                                        <linearGradient id="colorVis" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <Area 
                                        type="monotone" 
                                        dataKey="val" 
                                        stroke="#3b82f6" 
                                        strokeWidth={2} 
                                        fillOpacity={1} 
                                        fill="url(#colorVis)" 
                                        strokeDasharray="5 5"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

            </div>
            
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
