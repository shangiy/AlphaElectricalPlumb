'use client';

import ProductForm from '@/components/admin/ProductForm';
import { useProducts } from '@/context/ProductProvider';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { notFound, useParams } from 'next/navigation';

function EditProductContent({ productId }: { productId: string }) {
    const { getProductById, loading } = useProducts();
    const product = getProductById(productId);

    if (loading && !product) {
        return (
            <Card className="rounded-3xl border shadow-xl p-6">
                <CardHeader>
                    <Skeleton className="h-8 w-1/2 rounded-lg" />
                    <Skeleton className="h-4 w-3/4 rounded-lg" />
                </CardHeader>
                <div className="p-6 space-y-4">
                    <Skeleton className="h-10 w-full rounded-xl" />
                    <Skeleton className="h-20 w-full rounded-xl" />
                    <Skeleton className="h-10 w-full rounded-xl" />
                </div>
            </Card>
        );
    }

    if (!product) {
        if (!loading) {
            return (
                <Card className="rounded-3xl border shadow-xl p-12 text-center space-y-4">
                    <h3 className="text-xl font-bold font-headline text-accent uppercase">Product Not Found</h3>
                    <p className="text-muted-foreground text-sm">The item you are trying to edit may have been removed or does not exist.</p>
                </Card>
            );
        }
        return null;
    }

    return (
        <Card className="rounded-3xl border shadow-xl">
            <CardHeader className="border-b bg-muted/30 pb-6">
                <CardTitle className="text-2xl font-bold font-headline text-accent tracking-tighter uppercase">Edit Product</CardTitle>
                <CardDescription className="text-muted-foreground text-xs font-semibold uppercase tracking-widest">Update specifications and inventory for "{product.name}".</CardDescription>
            </CardHeader>
            <div className="p-6">
                <ProductForm product={product} />
            </div>
        </Card>
    );
}

export default function EditProductPage() {
    const params = useParams();
    const productId = params.id as string;
    
    if (!productId) {
        return notFound();
    }
    return <EditProductContent productId={productId} />;
}
