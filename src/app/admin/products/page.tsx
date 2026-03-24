
'use client';

import { useProducts } from '@/context/ProductProvider';
import type { Product } from '@/lib/types';
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
import { MoreHorizontal, PlusCircle, CheckCircle, XCircle, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

export default function AdminProductsPage() {
    const { products, loading } = useProducts();
    const router = useRouter();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-KE', {
          style: 'currency',
          currency: 'KES',
          currencyDisplay: 'code',
        }).format(amount);
    }

    if (loading) {
        return <div>Loading products...</div>;
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Products</CardTitle>
                        <CardDescription>Manage all products in your store. ({products.length} products)</CardDescription>
                    </div>
                    <Button asChild>
                        <Link href="/admin/products/add">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Product
                        </Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="hidden w-[100px] sm:table-cell">Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead className="hidden md:table-cell">Category</TableHead>
                            <TableHead className="hidden lg:table-cell text-center">Featured</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            <TableHead>
                                <span className="sr-only">Actions</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map(product => (
                            <TableRow key={product.id}>
                                <TableCell className="hidden sm:table-cell">
                                    <div className="aspect-square rounded-md bg-muted flex items-center justify-center">
                                        {product.images?.[0] ? (
                                            <Image
                                                alt={product.name}
                                                className="aspect-square rounded-md object-cover"
                                                height="64"
                                                src={product.images[0]}
                                                width="64"
                                                data-ai-hint="product image"
                                            />
                                        ) : (
                                            <Package className="h-8 w-8 text-muted-foreground" />
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell className="hidden md:table-cell">
                                    <Badge variant="secondary">{product.category}</Badge>
                                </TableCell>
                                <TableCell className="hidden lg:table-cell">
                                    <div className="flex items-center justify-center">
                                      {product.isFeatured ? (
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                      ) : (
                                        <XCircle className="h-5 w-5 text-muted-foreground" />
                                      )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">{formatCurrency(product.price)}</TableCell>
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
                                            <DropdownMenuItem onClick={() => router.push(`/admin/products/edit/${product.id}`)}>Edit</DropdownMenuItem>
                                            <DropdownMenuItem>View Details</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
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
