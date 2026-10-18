'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CardContent, CardFooter } from '@/components/ui/card';
import { useProducts, type ProductFormData } from '@/context/ProductProvider';
import { getCategories } from '@/lib/data';
import type { Category, Product } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import ImageUpload from '@/components/admin/ImageUpload';
import { Loader2, Plus } from 'lucide-react';

const productFormSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  price: z.coerce.number().min(0, 'Price must be a positive number.'),
  category: z.string().min(1, 'Please select a category.'),
  barcode: z.string().optional(),
  isFeatured: z.boolean().default(false),
  colors: z.array(z.string()).optional(),
  imageUrls: z.array(z.string()).min(1, 'Please add at least one image.'),
});

interface ProductFormProps {
    product?: Product;
}

export default function ProductForm({ product }: ProductFormProps) {
    const { addProduct, updateProduct, submitting } = useProducts();
    const router = useRouter();
    const { toast } = useToast();
    const [categories, setCategories] = useState<Category[]>([]);
    const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    useEffect(() => {
        async function loadCategories() {
            const fetchedCategories = await getCategories();
            setCategories(fetchedCategories);
        }
        loadCategories();
    }, []);

    const form = useForm<z.infer<typeof productFormSchema>>({
        resolver: zodResolver(productFormSchema),
        defaultValues: {
            name: product?.name || '',
            description: product?.longDescription || '',
            price: product?.price || 0,
            category: product?.category || '',
            barcode: product?.barcode || '',
            isFeatured: product?.isFeatured || false,
            colors: product?.colors || [],
            imageUrls: product?.imageUrls || [],
        },
    });

    async function onSubmit(data: z.infer<typeof productFormSchema>) {
        const formData: ProductFormData = { ...data };
        try {
            if (product) {
                await updateProduct(product.id, formData);
                toast({ title: "Product Updated!", description: `"${data.name}" has been saved.` });
            } else {
                await addProduct(formData);
                toast({ title: "Product Added!", description: `"${data.name}" has been created.` });
            }
            router.push('/admin/products');
        } catch (error) {
            toast({ variant: 'destructive', title: 'Save Failed', description: 'An error occurred while saving.' });
        }
    }

    const handleAddNewCategory = () => {
        if (!newCategoryName.trim()) return;
        const catName = newCategoryName.trim();
        setCategories(prev => [...prev, { id: catName, name: catName }]);
        form.setValue('category', catName);
        setIsAddingNewCategory(false);
        setNewCategoryName('');
    };

    return (
       <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-8 pt-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Kentank 2000L" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Describe the product..." {...field} rows={5} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price (KES)</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="e.g., 15000" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="barcode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Barcode / SKU</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., ALPHA-TANK-001" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    {isAddingNewCategory ? (
                                        <div className="flex gap-2">
                                            <Input 
                                                placeholder="Enter new category name..." 
                                                value={newCategoryName}
                                                onChange={(e) => setNewCategoryName(e.target.value)}
                                                autoFocus
                                            />
                                            <Button type="button" onClick={handleAddNewCategory}>Add</Button>
                                            <Button type="button" variant="ghost" onClick={() => setIsAddingNewCategory(false)}>Cancel</Button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                <SelectTrigger className="flex-1">
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem key={category.id} value={category.name}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                                </SelectContent>
                                            </Select>
                                            <Button 
                                                type="button" 
                                                variant="outline" 
                                                size="icon" 
                                                title="Add New Category"
                                                onClick={() => setIsAddingNewCategory(true)}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                    <FormDescription>Select a category or add a new one. This will sync with Supabase.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    
                    <Controller
                        control={form.control}
                        name="imageUrls"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product Images (Storage URLs)</FormLabel>
                                <FormControl>
                                    <ImageUpload value={field.value} onChange={field.onChange} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                    <div className="flex justify-end gap-2 w-full">
                        <Button variant="outline" type="button" onClick={() => router.push('/admin/products')}>Cancel</Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Product
                        </Button>
                    </div>
                </CardFooter>
            </form>
       </Form>
    );
}
