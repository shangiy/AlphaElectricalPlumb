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
import { Loader2, Plus, Save, ArrowLeft } from 'lucide-react';

const productFormSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  longDescription: z.string().min(20, 'Long description is required for details page.'),
  price: z.coerce.number().min(0, 'Price must be a positive number.'),
  category: z.string().min(1, 'Please select a category.'),
  barcode: z.string().optional(),
  isFeatured: z.boolean().default(false),
  stockCount: z.coerce.number().default(0),
  unit: z.string().default('item'),
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
            description: product?.description || '',
            longDescription: product?.longDescription || '',
            price: product?.price || 0,
            category: product?.category || '',
            barcode: product?.barcode || '',
            isFeatured: product?.isFeatured || false,
            stockCount: product?.stockCount || 50,
            unit: product?.unit || 'item',
            imageUrls: product?.imageUrls || [],
        },
    });

    async function onSubmit(data: z.infer<typeof productFormSchema>) {
        try {
            if (product) {
                await updateProduct(product.id, data);
                toast({ title: "Synchronized!", description: `"${data.name}" has been updated in Supabase.` });
            } else {
                await addProduct(data);
                toast({ title: "Product Created!", description: `"${data.name}" added to database.` });
            }
            router.push('/admin');
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Sync Failed', description: error.message || 'An error occurred while saving.' });
        }
    }

    return (
       <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="animate-in fade-in duration-700">
                <CardContent className="space-y-8 pt-6">
                    <div className="flex items-center justify-between border-b pb-4">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" type="button" onClick={() => router.push('/admin')} className="rounded-full">
                                <ArrowLeft className="h-4 w-4 mr-2" /> Back
                            </Button>
                            <h2 className="text-2xl font-black font-headline text-accent uppercase tracking-tighter">
                                {product ? `Editing: ${product.name}` : 'Create New Inventory'}
                            </h2>
                        </div>
                        {product && (
                            <span className="text-[10px] font-black uppercase bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">
                                Product ID: {product.id.toString().slice(0, 8)}
                            </span>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Product Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Kentank 2000L" {...field} className="h-12 text-lg font-bold rounded-xl" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            <div className="grid grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Price (KES)</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} className="h-12 font-mono font-bold rounded-xl" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="stockCount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Current Stock</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} className="h-12 font-mono rounded-xl" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Inventory Category</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                            <SelectTrigger className="h-12 rounded-xl">
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
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                             <div className="grid grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="unit"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Measurement Unit</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="e.g., item, meter, roll" className="rounded-xl" />
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
                                            <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Barcode / SKU</FormLabel>
                                            <FormControl>
                                                <Input {...field} className="rounded-xl" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Short Summary</FormLabel>
                                        <FormControl>
                                            <Textarea {...field} rows={3} className="rounded-xl resize-none" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="longDescription"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Full Technical Description</FormLabel>
                                        <FormControl>
                                            <Textarea {...field} rows={6} className="rounded-xl resize-none" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="isFeatured"
                                render={({ field }) => (
                                    <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-2xl border border-dashed">
                                        <input 
                                            type="checkbox" 
                                            checked={field.value} 
                                            onChange={field.onChange} 
                                            className="w-5 h-5 accent-primary cursor-pointer"
                                            id="featured-edit"
                                        />
                                        <label htmlFor="featured-edit" className="text-sm font-bold text-accent cursor-pointer">Promote this product on Homepage</label>
                                    </div>
                                )}
                            />
                        </div>
                    </div>

                    <div className="pt-8 border-t">
                        <Controller
                            control={form.control}
                            name="imageUrls"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Gallery Management (Supabase Storage)</FormLabel>
                                    <FormControl>
                                        <ImageUpload value={field.value} onChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-6 bg-muted/10">
                    <div className="flex justify-end gap-3 w-full max-w-4xl mx-auto">
                        <Button variant="outline" type="button" onClick={() => router.push('/admin')} className="rounded-full h-12 px-8 font-bold">
                            Discard Changes
                        </Button>
                        <Button type="submit" disabled={submitting} className="rounded-full h-12 px-12 font-black uppercase tracking-wider shadow-xl transition-all hover:scale-105 active:scale-95">
                            {submitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                            Sync with Supabase
                        </Button>
                    </div>
                </CardFooter>
            </form>
       </Form>
    );
}
