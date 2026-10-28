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

export default function UserDirectory() {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [trendingItems, setTrendingItems] = useState<TrendingProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const loadData = useCallback(async () => {
        if (!supabase) return;
        setLoading(true);
        try {
            // 1. Fetch Users with Wishlist Counts
            const { data: profiles, error: profileError } = await supabase
                .from('profiles')
                .select(`
                    *,
                    wishlists:wishlists(count)
                `)
                .order('full_name', { ascending: true });

            if (profileError) throw profileError;

            // 2. Fetch Wishlist Global Trends (Join with products to get names)
            const { data: wishTrend, error: trendError } = await supabase
                .from('wishlists')
                .select(`
                    product_id,
                    products (
                        name
                    )
                `);

            if (trendError) throw trendError;

            // Process trending items
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
            console.error("User Directory sync failed:", err);
            toast({
                variant: "destructive",
                title: "Sync Error",
                description: "Failed to fetch user and wishlist data from Supabase."
            });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleRoleUpdate = async (email: string, newRole: 'admin' | 'staff' | 'user') => {
        try {
            await promoteUserAdmin(email, newRole);
            toast({ title: "Permission Updated", description: `Role changed to ${newRole} for ${email}` });
            loadData();
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
                <p className="text-muted-foreground font-bold tracking-tighter uppercase">Synchronizing User Cluster...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Analytics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="rounded-3xl border shadow-xl bg-accent text-white overflow-hidden relative">
                    <div className="absolute -right-4 -bottom-4 opacity-10"><UsersIcon size={120} /></div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-black uppercase tracking-[0.2em] opacity-60">Global Community</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-5xl font-black tracking-tighter">{users.length}</div>
                        <p className="text-[10px] font-bold uppercase mt-1 opacity-60">Verified Profiles</p>
                    </CardContent>
                </Card>

                <Card className="rounded-3xl border shadow-xl bg-primary text-white overflow-hidden relative">
                    <div className="absolute -right-4 -bottom-4 opacity-10"><Heart size={120} /></div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-black uppercase tracking-[0.2em] opacity-60">Purchase Intent</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-5xl font-black tracking-tighter">
                            {users.reduce((acc, u) => acc + u.wishlist_count, 0)}
                        </div>
                        <p className="text-[10px] font-bold uppercase mt-1 opacity-60">Items in Wishlists</p>
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
                            <p className="text-[10px] text-muted-foreground font-bold uppercase text-center py-4">Awaiting Market Data</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Main Directory */}
            <Card className="rounded-[2.5rem] border shadow-2xl overflow-hidden">
                <CardHeader className="bg-muted/30 border-b p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-2xl font-black uppercase tracking-tighter text-accent">Identity Manager</CardTitle>
                            <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                Full bidirectional sync with Supabase profiles and wishlists.
                            </CardDescription>
                        </div>
                        <Button className="rounded-full font-black uppercase tracking-tighter shadow-lg" asChild>
                            <a href="/admin/settings"><UserPlus className="mr-2 h-4 w-4" /> Provision Team</a>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
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
                            {users.map(user => (
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
                                            <span className="text-sm font-black text-accent">{user.wishlist_count} <span className="text-[10px] font-bold text-muted-foreground uppercase ml-1">SAVED ITEMS</span></span>
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
                                    <TableCell className="pr-8">
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
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
