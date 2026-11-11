'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from '@/components/ui/badge';
import { Heart, Users as UsersIcon, Loader2, UserCircle2, Briefcase, Command } from 'lucide-react';
import { useAuth } from '@/context/AuthProvider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

/**
 * User Directory v4.4.22:
 * Features a clearance-level tabbed interface for categorized management.
 * Synchronized with the Alpha Ecosystem high-fidelity aesthetic.
 */
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

    const clients = users.filter(u => u.role === 'user');
    const staff = users.filter(u => u.role === 'staff');
    const admins = users.filter(u => u.role === 'admin');

    const UserTable = ({ data }: { data: any[] }) => (
        <Table>
            <TableHeader>
                <TableRow className="bg-muted/50">
                    <TableHead className="pl-8 font-black uppercase text-accent text-[10px] tracking-[0.2em]">User Persona</TableHead>
                    <TableHead className="font-black uppercase text-accent text-[10px] tracking-[0.2em]">Clearance Level</TableHead>
                    <TableHead className="font-black uppercase text-accent text-[10px] tracking-[0.2em]">Wishlist Collection</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.length > 0 ? data.map(u => (
                    <TableRow key={u.id} className="hover:bg-primary/5 transition-all group">
                        <TableCell className="pl-8 py-6 flex items-center gap-4">
                            <Avatar className="h-11 w-11 border-2 border-white shadow-md ring-1 ring-primary/10">
                                <AvatarImage src={u.avatar_url} className="object-cover" />
                                <AvatarFallback className="bg-accent text-white font-black">{u.full_name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="font-black text-accent text-sm uppercase tracking-tight">{u.full_name || 'Anonymous User'}</span>
                                <span className="text-[10px] text-muted-foreground font-bold tracking-tight lowercase">{u.email}</span>
                            </div>
                        </TableCell>
                        <TableCell>
                            <Badge className={cn(
                                "uppercase text-[9px] font-black px-3 py-0.5 rounded-full tracking-widest border-none shadow-sm",
                                u.role === 'admin' ? "bg-red-500 text-white" : 
                                u.role === 'staff' ? "bg-blue-500 text-white" : 
                                "bg-primary text-white"
                            )}>
                                {u.role === 'user' ? 'CLIENT' : u.role}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2">
                                <Heart size={14} className="text-red-500 fill-red-500/10 group-hover:scale-125 transition-transform" /> 
                                <span className="font-black text-[10px] text-accent uppercase">{u.wishlists?.[0]?.count || 0} ITEMS</span>
                            </div>
                        </TableCell>
                    </TableRow>
                )) : (
                    <TableRow>
                        <TableCell colSpan={3} className="h-40 text-center text-muted-foreground font-bold uppercase text-[10px] tracking-[0.3em] opacity-40 italic">
                            No active records in this clearance segment.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b pb-8">
                <div>
                    <h2 className="text-4xl font-black font-headline text-accent tracking-tighter uppercase">Account Ecosystem</h2>
                    <p className="text-muted-foreground text-sm font-medium mt-1">Identity Portfolio & Clearance Management Center.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-5 py-2 rounded-full font-black text-[10px] uppercase tracking-widest">
                        v4.4.22 SECURE
                    </Badge>
                </div>
            </div>

            <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto bg-muted/30 p-2 rounded-[2.5rem] border mb-10 shadow-inner">
                    <TabsTrigger value="all" className="rounded-[1.5rem] font-black uppercase text-[10px] py-4 flex items-center justify-center gap-2 tracking-widest">
                        <UsersIcon size={14} /> All Personas
                    </TabsTrigger>
                    <TabsTrigger value="clients" className="rounded-[1.5rem] font-black uppercase text-[10px] py-4 flex items-center justify-center gap-2 tracking-widest">
                        <UserCircle2 size={14} /> Clients
                    </TabsTrigger>
                    <TabsTrigger value="users" className="rounded-[1.5rem] font-black uppercase text-[10px] py-4 flex items-center justify-center gap-2 tracking-widest">
                        <Briefcase size={14} /> Users (Staff)
                    </TabsTrigger>
                    <TabsTrigger value="admins" className="rounded-[1.5rem] font-black uppercase text-[10px] py-4 flex items-center justify-center gap-2 tracking-widest">
                        <Command size={14} /> Admins
                    </TabsTrigger>
                </TabsList>

                <Card className="rounded-[2.5rem] border shadow-2xl overflow-hidden bg-white">
                    <TabsContent value="all" className="m-0"><UserTable data={users} /></TabsContent>
                    <TabsContent value="clients" className="m-0"><UserTable data={clients} /></TabsContent>
                    <TabsContent value="users" className="m-0"><UserTable data={staff} /></TabsContent>
                    <TabsContent value="admins" className="m-0"><UserTable data={admins} /></TabsContent>
                </Card>
            </Tabs>
        </div>
    );
}

// Utility to handle conditional classes
function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
