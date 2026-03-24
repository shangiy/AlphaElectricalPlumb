
'use client';

import { useEffect, useState } from 'react';
import { getTransactions } from '@/lib/data';
import type { Transaction } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function AdminTransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadTransactions() {
            const fetchedTransactions = await getTransactions();
            setTransactions(fetchedTransactions);
            setLoading(false);
        }
        loadTransactions();
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-KE', {
          style: 'currency',
          currency: 'KES',
          currencyDisplay: 'code',
        }).format(amount);
    }

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        });
    }

    if (loading) {
        return <div>Loading transactions...</div>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Transactions</CardTitle>
                <CardDescription>View all recent transactions. ({transactions.length} transactions)</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead className="hidden sm:table-cell">Product</TableHead>
                            <TableHead className="hidden md:table-cell">Date</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map(transaction => (
                            <TableRow key={transaction.id}>
                                <TableCell>
                                    <div className="font-medium">{transaction.customerName}</div>
                                    <div className="hidden text-sm text-muted-foreground md:inline">
                                        {transaction.email}
                                    </div>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell">{transaction.productName}</TableCell>
                                <TableCell className="hidden md:table-cell">{formatDateTime(transaction.date)}</TableCell>
                                <TableCell className="text-right">{formatCurrency(transaction.amount)}</TableCell>
                                <TableCell className="text-center">
                                    <Badge
                                        className={cn({
                                            'bg-green-500/20 text-green-700 border-green-500/30 hover:bg-green-500/30': transaction.status === 'Completed',
                                            'bg-yellow-500/20 text-yellow-700 border-yellow-500/30 hover:bg-yellow-500/30': transaction.status === 'Pending',
                                            'bg-red-500/20 text-red-700 border-red-500/30 hover:bg-red-500/30': transaction.status === 'Failed',
                                        })}
                                        variant="outline"
                                    >
                                        {transaction.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
