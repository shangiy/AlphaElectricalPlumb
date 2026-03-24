
'use client';

import ProductForm from '@/components/admin/ProductForm';
import { useProducts } from '@/context/ProductProvider';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { notFound, useParams } from 'next/navigation';


function EditProductContent({ productId }: { productId: string }) {
    const { getProductById, loading } = useProducts();
    const product = getProductById(productId);

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <div className="p-6 space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </Card>
        )
    }

    if (!product) {
        // Wait for loading to finish before concluding not found
        if (!loading) {
            return <p>Product not found.</p>;
        }
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit Product</CardTitle>
                <CardDescription>Update the details for "{product.name}".</CardDescription>
            </CardHeader>
            <ProductForm product={product} />
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
