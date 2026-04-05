
'use client';

import { useProducts } from '@/context/ProductProvider';
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
import { MoreHorizontal, PlusCircle, CheckCircle, XCircle, Package, AlertTriangle, TrendingUp, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function AdminProductsPage() {
    const { products, loading, toggleFeatured, updateStock } = useProducts();
    const router = useRouter();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-KE', {
          style: 'currency',
          currency: 'KES',
          currencyDisplay: 'code',
        }).format(amount);
    }

    const getStockStatus = (count: number) => {
        if (count > 10) return { label: 'In Stock', color: 'bg-green-500/10 text-green-600 border-green-200', icon: <CheckCircle className="h-3 w-3" /> };
        if (count > 0) return { label: 'Low Stock', color: 'bg-yellow-500/10 text-yellow-600 border-yellow-200', icon: <AlertTriangle className="h-3 w-3" /> };
        return { label: 'Out of Stock', color: 'bg-red-500/10 text-red-600 border-red-200', icon: <XCircle className="h-3 w-3" /> };
    }

    if (loading) {
        return <div className="p-12 text-center">Loading products catalog...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-primary/5 border-primary/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-primary">Active Inventory</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{products.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">Verified unique products</p>
                    </CardContent>
                </Card>
                <Card className="bg-yellow-500/5 border-yellow-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-yellow-600">Low Stock Alerts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{products.filter(p => p.stockCount <= 10 && p.stockCount > 0).length}</div>
                        <p className="text-xs text-muted-foreground mt-1">Items requiring restock soon</p>
                    </CardContent>
                </Card>
                <Card className="bg-blue-500/5 border-blue-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-blue-600">Featured Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{products.filter(p => p.isFeatured).length}</div>
                        <p className="text-xs text-muted-foreground mt-1">Currently shown on homepage</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <CardTitle>Inventory Management</CardTitle>
                            <CardDescription>Monitor stock levels and control storefront visibility.</CardDescription>
                        </div>
                        <Button asChild>
                            <Link href="/admin/products/add">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add New Item
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead className="w-[80px]">Image</TableHead>
                                    <TableHead>Product Details</TableHead>
                                    <TableHead className="hidden md:table-cell">Stock Level</TableHead>
                                    <TableHead className="text-center">Featured</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.map(product => {
                                    const status = getStockStatus(product.stockCount || 0);
                                    return (
                                        <TableRow key={product.id} className="hover:bg-muted/30 transition-colors">
                                            <TableCell>
                                                <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden border">
                                                    {product.imageUrls?.[0] ? (
                                                        <Image
                                                            alt={product.name}
                                                            className="aspect-square object-cover"
                                                            height="48"
                                                            src={product.imageUrls[0]}
                                                            width="48"
                                                        />
                                                    ) : (
                                                        <Package className="h-6 w-6 text-muted-foreground" />
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-bold text-sm">{product.name}</div>
                                                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{product.category}</div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className={cn("gap-1 text-[10px] font-bold px-2 py-0", status.color)}>
                                                            {status.icon}
                                                            {status.label}
                                                        </Badge>
                                                        <span className="text-xs font-mono">{product.stockCount || 0} units</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Button 
                                                            variant="outline" 
                                                            size="icon" 
                                                            className="h-6 w-6" 
                                                            onClick={() => updateStock(product.id, (product.stockCount || 0) - 1)}
                                                        >
                                                            <Minus className="h-3 w-3" />
                                                        </Button>
                                                        <Button 
                                                            variant="outline" 
                                                            size="icon" 
                                                            className="h-6 w-6" 
                                                            onClick={() => updateStock(product.id, (product.stockCount || 0) + 1)}
                                                        >
                                                            <Plus className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Switch 
                                                    checked={product.isFeatured} 
                                                    onCheckedChange={() => toggleFeatured(product.id, !!product.isFeatured)} 
                                                />
                                            </TableCell>
                                            <TableCell className="text-right font-mono font-bold text-primary">
                                                {formatCurrency(product.price)}
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button size="icon" variant="ghost">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => router.push(`/admin/products/edit/${product.id}`)}>Edit Details</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => router.push(`/products/${product.id}`)}>Preview on Site</DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-destructive">Delete Permanently</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
