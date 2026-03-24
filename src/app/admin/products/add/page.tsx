
import ProductForm from '@/components/admin/ProductForm';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function AddProductPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Add New Product</CardTitle>
                <CardDescription>Fill out the form below to add a new product to your store.</CardDescription>
            </CardHeader>
            <ProductForm />
        </Card>
    );
}
