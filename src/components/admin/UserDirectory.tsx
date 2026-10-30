'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, UserPlus, ShieldCheck, Heart, TrendingUp, Users as UsersIcon, Loader2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';
import { promoteUserAdmin } from '@/app/actions/user-actions';

interface UserProfile {
    id: string;
    full_name: string;
    email: string;
    role: 'admin' | 'staff' | 'user';
    avatar_url: string;
    wishlist_count: number;
    created_at: string;
}

interface TrendingProduct {
    id: string;
    name: string;
    count: number;
}

/**
 * Identity Manager v3.5:
 * Features full Real-time synchronization with Supabase Postgres Changes.
 */
export default function UserDirectory() {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [trendingItems, setTrendingItems] = useState<TrendingProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const loadData = useCallback(async (isInitial = false) => {
        if (!supabase) return;
        if (isInitial) setLoading(true);
        
        try {
            // 1. Fetch Users with Wishlist Counts (Relational Join)
            const { data: profiles, error: profileError } = await supabase
                .from('profiles')
                .select(`
                    *,
                    wishlists:wishlists(count)
                `)
                .order('created_at', { ascending: false });

            if (profileError) throw profileError;

            // 2. Fetch Wishlist Global Trends (Factual Market Data)
            const { data: wishTrend, error: trendError } = await supabase
                .from('wishlists')
                .select(`
                    product_id,
                    products (
                        name
                    )
                `);

            if (trendError) throw trendError;

            // Process trending items with factual naming
            const counts: Record<string, { name: string, count: number }> = {};
            wishTrend?.forEach((item: any) => {
                const id = item.product_id;
                const name = item.products?.name || 'Unknown Product';
                if (!counts[id]) counts[id] = { name, count: 0 };
                counts[id].count += 1;
            });

            const sortedTrends = Object.entries(counts)
                .map(([id, data]) => ({ id, name: data.name, count: data.count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 3);

            setUsers((profiles || []).map(p => ({
                id: p.id,
                full_name: p.full_name || 'Anonymous User',
                email: p.email || 'N/A',
                role: p.role || 'user',
                avatar_url: p.avatar_url,
                wishlist_count: p.wishlists?.[0]?.count || 0,
                created_at: p.created_at
            })));
            setTrendingItems(sortedTrends);

        } catch (err: any) {
            // Extract non-enumerable properties from Supabase/PostgREST error objects
            const errorMessage = err?.message || (typeof err === 'object' ? JSON.stringify(err, Object.getOwnPropertyNames(err)) : String(err));
            
            console.error("User Directory factual sync failed:", errorMessage);

            toast({
                variant: "destructive",
                title: "Sync Error",
                description: typeof err === 'object' && err?.message ? err.message : "Failed to load user directory data.",
            });
        } finally {
            if (isInitial) setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        // Initial fetch
        loadData(true);

        if (!supabase) return;

        // ACTIVATE REAL-TIME HANDSHAKE
        // Subscribe to any changes in profiles or wishlists to update the dashboard instantly
        const channel = supabase
            .channel('factual-analytics-sync')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'profiles' },
                () => {
                    console.log('Admin: Real-time Profile update detected');
                    loadData(false);
                }
            )
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'wishlists' },
                () => {
                    console.log('Admin: Real-time Wishlist update detected');
                    loadData(false);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [loadData]);

    const handleRoleUpdate = async (email: string, newRole: 'admin' | 'staff' | 'user') => {
        try {
            await promoteUserAdmin(email, newRole);
            toast({ title: "Permission Updated", description: `Role changed to ${newRole} for ${email}` });
            // Re-fetch handled by Real-time subscription, but explicit call for speed
            loadData(false);
        } catch (err: any) {
            toast({ variant: "destructive", title: "Update Failed", description: err.message });
        }
    };

    const getRoleBadge = (role: string) => {
        switch(role) {
            case 'admin': return <Badge className="bg-purple-500 hover:bg-purple-600 gap-1 uppercase text-[10px] font-black"><ShieldCheck className="h-3 w-3" /> Admin</Badge>;
            case 'staff': return <Badge className="bg-blue-500 hover:bg-blue-600 uppercase text-[10px] font-black">Staff</Badge>;
            default: return <Badge variant="secondary" className="uppercase text-[10px] font-black">Client</Badge>;
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-muted-foreground font-bold tracking-tighter uppercase">Synchronizing Identity Cluster...</p>
            </div>
        );
    }

    const totalWishlistItems = users.reduce((acc, u) => acc + u.wishlist_count, 0);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Real-time Factual Analytics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="rounded-3xl border shadow-xl bg-accent text-white overflow-hidden relative group">
                    <div className="absolute -right-4 -bottom-4 opacity-10 transition-transform group-hover:scale-110"><UsersIcon size={120} /></div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-black uppercase tracking-[0.2em] opacity-60">Global Community</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-5xl font-black tracking-tighter tabular-nums">{users.length}</div>
                        <p className="text-[10px] font-bold uppercase mt-1 opacity-60">Factual Verified Profiles</p>
                    </CardContent>
                </Card>

                <Card className="rounded-3xl border shadow-xl bg-primary text-white overflow-hidden relative group">
                    <div className="absolute -right-4 -bottom-4 opacity-10 transition-transform group-hover:scale-110"><Heart size={120} /></div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-black uppercase tracking-[0.2em] opacity-60">Purchase Intent</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-5xl font-black tracking-tighter tabular-nums">
                            {totalWishlistItems}
                        </div>
                        <p className="text-[10px] font-bold uppercase mt-1 opacity-60">Real-time Saved Items</p>
                    </CardContent>
                </Card>

                <Card className="rounded-3xl border shadow-xl bg-white overflow-hidden">
                    <CardHeader className="pb-2 border-b bg-muted/30">
                        <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-accent">Market Sentiment</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-3">
                        {trendingItems.length > 0 ? trendingItems.map((item, i) => (
                            <div key={item.id} className="flex justify-between items-center group">
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <TrendingUp size={12} className="text-green-500 shrink-0" />
                                    <span className="text-xs font-bold text-accent truncate">{item.name}</span>
                                </div>
                                <Badge variant="outline" className="text-[10px] font-black border-primary/20 text-primary shrink-0">
                                    {item.count} SAVES
                                </Badge>
                            </div>
                        )) : (
                            <p className="text-[10px] text-muted-foreground font-bold uppercase text-center py-4 italic">Aggregating market trends...</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* User Lifecycle Directory */}
            <Card className="rounded-[2.5rem] border shadow-2xl overflow-hidden">
                <CardHeader className="bg-muted/30 border-b p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-2xl font-black uppercase tracking-tighter text-accent">Account Ecosystem</CardTitle>
                            <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                Live management of authenticated profile clusters.
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-3">
                             <div className="hidden sm:flex items-center gap-2 bg-green-500/10 text-green-600 px-3 py-1.5 rounded-full border border-green-500/20">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                <span className="text-[9px] font-black uppercase">Live Sync Active</span>
                            </div>
                            <Button className="rounded-full font-black uppercase tracking-tighter shadow-lg" asChild>
                                <a href="/admin/settings"><UserPlus className="mr-2 h-4 w-4" /> Provision Team</a>
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50 hover:bg-muted/50 border-b">
                                    <TableHead className="pl-8 py-5 text-[10px] font-black uppercase tracking-widest text-accent">User Persona</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-accent">Clearance</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-accent">Collection Size</TableHead>
                                    <TableHead className="hidden lg:table-cell text-[10px] font-black uppercase tracking-widest text-accent">Digital Footprint</TableHead>
                                    <TableHead className="w-[80px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.length > 0 ? users.map(user => (
                                    <TableRow key={user.id} className="hover:bg-primary/5 transition-all group">
                                        <TableCell className="pl-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <Avatar className="h-12 w-12 border-2 border-white shadow-md group-hover:scale-110 transition-transform">
                                                    <AvatarImage src={user.avatar_url} />
                                                    <AvatarFallback className="bg-accent text-white font-black">{user.full_name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="font-black text-accent text-sm uppercase tracking-tight">{user.full_name}</span>
                                                    <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                                                        <Mail size={10} /> {user.email}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-8 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
                                                    <Heart size={14} className={user.wishlist_count > 0 ? "fill-current" : ""} />
                                                </div>
                                                <span className="text-sm font-black text-accent tabular-nums">{user.wishlist_count} <span className="text-[10px] font-bold text-muted-foreground uppercase ml-1">SAVED</span></span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Registered On</span>
                                                <span className="text-xs font-bold text-accent">
                                                    {new Date(user.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="pr-8 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button size="icon" variant="ghost" className="rounded-full hover:bg-accent/10">
                                                        <MoreHorizontal className="h-5 w-5 text-accent" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-2xl border-none">
                                                    <DropdownMenuLabel className="text-[10px] font-black uppercase text-muted-foreground px-2 py-1">Administrative Ops</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="rounded-xl font-bold text-xs" onClick={() => handleRoleUpdate(user.email, 'admin')}>Promote to Admin</DropdownMenuItem>
                                                    <DropdownMenuItem className="rounded-xl font-bold text-xs" onClick={() => handleRoleUpdate(user.email, 'staff')}>Promote to Staff</DropdownMenuItem>
                                                    <DropdownMenuItem className="rounded-xl font-bold text-xs" onClick={() => handleRoleUpdate(user.email, 'user')}>Revoke to Client</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="rounded-xl font-bold text-xs text-destructive focus:bg-destructive/10">Restrict Access</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="py-20 text-center">
                                            <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">No active identities found in the factual sync.</p>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
