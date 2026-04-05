
'use client';

import { useEffect, useState } from 'react';
import { getUsers } from '@/lib/data';
import type { MockUser } from '@/lib/types';
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
import { MoreHorizontal, User, UserPlus, ShieldCheck, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<MockUser[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        async function loadUsers() {
            const fetchedUsers = await getUsers();
            setUsers(fetchedUsers);
            setLoading(false);
        }
        loadUsers();
    }, []);

    const handleAddStaff = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: "Staff Member Added",
            description: "An invitation has been sent to the user's email.",
        });
    };

    const getRoleBadge = (role: string) => {
        switch(role) {
            case 'admin': return <Badge className="bg-purple-500 hover:bg-purple-600 gap-1"><ShieldCheck className="h-3 w-3" /> Admin</Badge>;
            case 'staff': return <Badge className="bg-blue-500 hover:bg-blue-600">Staff</Badge>;
            default: return <Badge variant="secondary">User</Badge>;
        }
    }

    if (loading) {
        return <div className="p-12 text-center">Loading user directory...</div>;
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>User Directory</CardTitle>
                            <CardDescription>Manage your team and view registered customers.</CardDescription>
                        </div>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button>
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    Add Team Member
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add New Team Member</DialogTitle>
                                    <DialogDescription>Assign a role to a new staff member or administrator.</DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleAddStaff} className="space-y-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input id="email" type="email" placeholder="staff@alpha.com" required />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="role">Role</Label>
                                        <Select defaultValue="staff">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="admin">Administrator</SelectItem>
                                                <SelectItem value="staff">Staff Member</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button type="submit" className="w-full mt-4">Invite Member</Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Profile</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead className="hidden md:table-cell">Email</TableHead>
                                <TableHead className="hidden xl:table-cell text-center">Orders</TableHead>
                                <TableHead className="hidden sm:table-cell">Last Seen</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map(user => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={user.avatarUrl} />
                                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="font-bold text-sm">{user.name}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                                    <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{user.email}</TableCell>
                                    <TableCell className="hidden xl:table-cell text-center font-mono">{user.orders}</TableCell>
                                    <TableCell className="hidden sm:table-cell text-xs">
                                        {new Date(user.lastSeen).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button size="icon" variant="ghost">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>View Activity</DropdownMenuItem>
                                                <DropdownMenuItem>Modify Role</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive">Suspend User</DropdownMenuItem>
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
