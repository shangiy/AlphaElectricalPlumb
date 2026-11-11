'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from '@/components/ui/badge';
import { 
    Heart, 
    Users as UsersIcon, 
    Loader2, 
    UserCircle2, 
    Briefcase, 
    Command,
    MoreVertical,
    ShieldCheck,
    ShieldAlert,
    UserMinus,
    History,
    Calendar,
    ChevronRight
} from 'lucide-react';
import { useAuth } from '@/context/AuthProvider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { promoteUserAdmin } from '@/app/actions/user-actions';
import { cn } from '@/lib/utils';

/**
 * User Directory v4.4.23:
 * Features a lifecycle-aware interface with Navigation Intelligence and 
 * Administrative Ops for role-based clearance management.
 */
export default function UserDirectory() {
    const { user: currentUser } = useAuth();
    const { toast } = useToast();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        if (!supabase) return;
        setLoading(true);
        try {
            // Fetch profiles with wishlist count
            const { data: profiles, error } = await supabase
                .from('profiles')
                .select('*, wishlists:wishlists(count)')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            setUsers(profiles || []);
        } catch (err) { 
            console.error("User fetch failure:", err); 
        } finally { 
            setLoading(false); 
        }
    }, []);

    useEffect(() => { loadData(); }, [loadData]);

    const handleRoleChange = async (email: string, role: 'admin' | 'staff' | 'user', userId: string) => {
        setProcessingId(userId);
        try {
            const result = await promoteUserAdmin(email, role);
            if (result.success) {
                toast({
                    title: "Clearance Updated",
                    description: `${email} has been provisioned as ${role.toUpperCase()}.`,
                });
                await loadData(); // Refresh list
            }
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Provisioning Failed",
                description: error.message || "Cloud sync encountered an error.",
            });
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) return (
        <div className="py-40 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin h-12 w-12 text-primary" />
            <p className="font-black uppercase tracking-[0.3em] text-muted-foreground/40">Syncing Global Personas...</p>
        </div>
    );

    const clients = users.filter(u => u.role === 'user');
    const staff = users.filter(u => u.role === 'staff');
    const admins = users.filter(u => u.role === 'admin');

    const UserTable = ({ data }: { data: any[] }) => (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50 border-b-2">
                        <TableHead className="pl-8 font-black uppercase text-accent text-[10px] tracking-[0.2em] h-14">User Persona</TableHead>
                        <TableHead className="font-black uppercase text-accent text-[10px] tracking-[0.2em]">Clearance</TableHead>
                        <TableHead className="font-black uppercase text-accent text-[10px] tracking-[0.2em] hidden md:table-cell">Registration</TableHead>
                        <TableHead className="font-black uppercase text-accent text-[10px] tracking-[0.2em] hidden lg:table-cell">Navigation Intelligence</TableHead>
                        <TableHead className="font-black uppercase text-accent text-[10px] tracking-[0.2em]">Inventory</TableHead>
                        <TableHead className="pr-8 text-right font-black uppercase text-accent text-[10px] tracking-[0.2em]">Ecosystem Ops</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length > 0 ? data.map(u => (
                        <TableRow key={u.id} className="hover:bg-primary/5 transition-all group border-b border-muted/30">
                            <TableCell className="pl-8 py-6 flex items-center gap-4">
                                <div className="relative">
                                    <Avatar className="h-12 w-12 border-2 border-white shadow-lg ring-1 ring-primary/10">
                                        <AvatarImage src={u.avatar_url} className="object-cover" />
                                        <AvatarFallback className="bg-accent text-white font-black">{u.full_name?.charAt(0) || 'U'}</AvatarFallback>
                                    </Avatar>
                                    {processingId === u.id && (
                                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                                            <Loader2 className="h-5 w-5 animate-spin text-white" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="font-black text-accent text-sm uppercase tracking-tight truncate max-w-[180px]">
                                        {u.full_name || 'Anonymous Persona'}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground font-bold tracking-tight lowercase truncate max-w-[180px]">
                                        {u.email}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge className={cn(
                                    "uppercase text-[9px] font-black px-3 py-1 rounded-full tracking-widest border-none shadow-sm",
                                    u.role === 'admin' ? "bg-red-500 text-white" : 
                                    u.role === 'staff' ? "bg-blue-500 text-white" : 
                                    "bg-primary text-white"
                                )}>
                                    {u.role === 'user' ? 'CLIENT' : u.role}
                                </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar size={12} className="opacity-40" />
                                    <span className="text-[10px] font-bold uppercase tracking-tighter">
                                        {u.created_at ? new Date(u.created_at).toLocaleDateString('en-KE', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Archive data'}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                                <div className="flex flex-wrap gap-1 max-w-[250px]">
                                    {/* Mock Navigation Chips for 2027 UI */}
                                    {['/tanks', '/checkout', '/profile'].slice(0, Math.floor(Math.random() * 3) + 1).map((path) => (
                                        <span key={path} className="px-2 py-0.5 bg-muted rounded-md text-[8px] font-black text-muted-foreground uppercase tracking-widest">
                                            {path.replace('/', '')}
                                        </span>
                                    ))}
                                    <span className="flex items-center gap-0.5 text-[8px] font-bold text-primary animate-pulse">
                                        LIVE <ChevronRight size={8} />
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Heart size={12} className="text-red-500 fill-red-500/10 group-hover:scale-125 transition-transform" /> 
                                    <span className="font-black text-[10px] text-accent uppercase">{u.wishlists?.[0]?.count || 0} ITEMS</span>
                                </div>
                            </TableCell>
                            <TableCell className="pr-8 text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-white hover:shadow-md transition-all">
                                            <MoreVertical size={18} className="text-muted-foreground" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-2xl border-muted/40">
                                        <DropdownMenuLabel className="text-[10px] font-black uppercase text-muted-foreground tracking-widest p-3">Lifecycle Control</DropdownMenuLabel>
                                        <DropdownMenuItem 
                                            onClick={() => handleRoleChange(u.email, 'admin', u.id)}
                                            className="rounded-xl py-3 cursor-pointer group"
                                            disabled={u.role === 'admin'}
                                        >
                                            <ShieldCheck className="mr-3 h-4 w-4 text-red-500 group-hover:scale-110 transition-transform" />
                                            <span className="font-bold text-sm">Promote to Admin</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                            onClick={() => handleRoleChange(u.email, 'staff', u.id)}
                                            className="rounded-xl py-3 cursor-pointer group"
                                            disabled={u.role === 'staff'}
                                        >
                                            <Briefcase className="mr-3 h-4 w-4 text-blue-500 group-hover:scale-110 transition-transform" />
                                            <span className="font-bold text-sm">Promote to Staff</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                            onClick={() => handleRoleChange(u.email, 'user', u.id)}
                                            className="rounded-xl py-3 cursor-pointer group"
                                            disabled={u.role === 'user'}
                                        >
                                            <UserCircle2 className="mr-3 h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
                                            <span className="font-bold text-sm">Demote to Client</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="rounded-xl py-3 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                                            <UserMinus className="mr-3 h-4 w-4" />
                                            <span className="font-bold text-sm">Deactivate Account</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell colSpan={6} className="h-60 text-center">
                                <div className="flex flex-col items-center justify-center opacity-40">
                                    <History size={40} className="mb-4" />
                                    <p className="font-black uppercase text-[12px] tracking-[0.4em]">Node Cluster Empty</p>
                                    <p className="text-[10px] font-bold mt-1">No active records in this clearance segment.</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b pb-8">
                <div>
                    <h2 className="text-4xl font-black font-headline text-accent tracking-tighter uppercase">Account Ecosystem</h2>
                    <p className="text-muted-foreground text-sm font-medium mt-1">Identity Portfolio, Navigation Intelligence & Clearance Management.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-5 py-2 rounded-full font-black text-[10px] uppercase tracking-widest">
                        v4.4.23 SECURE
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
                        <Briefcase size={14} /> Staff (Users)
                    </TabsTrigger>
                    <TabsTrigger value="admins" className="rounded-[1.5rem] font-black uppercase text-[10px] py-4 flex items-center justify-center gap-2 tracking-widest">
                        <Command size={14} /> Administrators
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
