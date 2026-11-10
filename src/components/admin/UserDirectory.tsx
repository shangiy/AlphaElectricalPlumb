'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Heart, Users as UsersIcon, Loader2, Mail } from 'lucide-react';
import { useAuth } from '@/context/AuthProvider';

export default function UserDirectory() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = useCallback(async () => {
        if (!supabase) return;
        setLoading(true);
        try {
            const { data: profiles } = await supabase.from('profiles').select('*, wishlists:wishlists(count)').order('created_at', { ascending: false });
            setUsers(profiles || []);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    }, []);

    useEffect(() => { loadData(); }, [loadData]);

    if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <Card className="rounded-[2.5rem] border shadow-2xl overflow-hidden">
                <CardHeader className="bg-muted/30 border-b p-8">
                    <CardTitle className="text-2xl font-black uppercase text-accent">Account Ecosystem v4.3.0</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead className="pl-8 font-black uppercase text-accent text-[10px]">User Persona</TableHead>
                                <TableHead className="font-black uppercase text-accent text-[10px]">Clearance</TableHead>
                                <TableHead className="font-black uppercase text-accent text-[10px]">Wishlist Collection</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map(u => (
                                <TableRow key={u.id} className="hover:bg-primary/5 transition-all">
                                    <TableCell className="pl-8 py-5 flex items-center gap-4">
                                        <Avatar className="h-10 w-10"><AvatarImage src={u.avatar_url} /><AvatarFallback>{u.full_name?.charAt(0)}</AvatarFallback></Avatar>
                                        <div className="flex flex-col"><span className="font-black text-accent text-sm">{u.full_name}</span><span className="text-[10px] text-muted-foreground">{u.email}</span></div>
                                    </TableCell>
                                    <TableCell><Badge className="uppercase text-[9px]">{u.role}</Badge></TableCell>
                                    <TableCell><div className="flex items-center gap-2"><Heart size={12} className="text-red-500" /> <span className="font-bold text-sm">{u.wishlists?.[0]?.count || 0} ITEMS</span></div></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
