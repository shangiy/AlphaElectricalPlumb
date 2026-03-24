
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
import { MoreHorizontal, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"

export default function AdminUsersPage() {
    const [users, setUsers] = useState<MockUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadUsers() {
            const fetchedUsers = await getUsers();
            setUsers(fetchedUsers);
            setLoading(false);
        }
        loadUsers();
    }, []);

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        const dateOptions: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        const timeOptions: Intl.DateTimeFormatOptions = {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        };
        return (
            <div>
                <div>{date.toLocaleDateString('en-US', dateOptions)}</div>
                <div className="text-xs text-muted-foreground">{date.toLocaleTimeString('en-US', timeOptions)}</div>
            </div>
        );
    }

    if (loading) {
        return <div>Loading users...</div>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Users</CardTitle>
                <CardDescription>Manage all registered users. ({users.length} users)</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead className="hidden md:table-cell">Email</TableHead>
                            <TableHead className="hidden xl:table-cell">Orders</TableHead>
                            <TableHead className="hidden sm:table-cell">Signed Up</TableHead>
                            <TableHead className="hidden lg:table-cell">Last Seen</TableHead>
                            <TableHead className="hidden xl:table-cell">Avg. Visit</TableHead>
                            <TableHead>
                                <span className="sr-only">Actions</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map(user => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="hidden h-9 w-9 sm:flex">
                                            <AvatarImage src={user.avatarUrl} alt="Avatar" />
                                            <AvatarFallback>
                                                {user.name ? user.name.charAt(0) : <User className="h-4 w-4" />}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="font-medium">{user.name}</div>
                                    </div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                                <TableCell className="hidden xl:table-cell">
                                    <Badge variant={user.orders > 0 ? "default" : "secondary"}>{user.orders}</Badge>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell">{formatDateTime(user.signedUp)}</TableCell>
                                <TableCell className="hidden lg:table-cell">{formatDateTime(user.lastSeen)}</TableCell>
                                <TableCell className="hidden xl:table-cell">{user.visitDuration} mins</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Toggle menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem>View Details</DropdownMenuItem>
                                            <DropdownMenuItem>Suspend User</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-destructive">Delete User</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
