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
import { Switch } from '@/components/ui/switch';
import { CardContent, CardFooter } from '@/components/ui/card';
import { useProducts, type ProductFormData } from '@/context/ProductProvider';
import { getCategories } from '@/lib/data';
import type { Category, Product } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import ImageUpload from '@/components/admin/ImageUpload';
import { Loader2 } from 'lucide-react';
import { generateProductDescription, type GenerateProductDescriptionInput } from '@/ai/flows/product-description-generator';


const productFormSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  price: z.coerce.number().min(0, 'Price must be a positive number.'),
  category: z.string().min(1, 'Please select a category.'),
  barcode: z.string().optional(),
  isFeatured: z.boolean().default(false),
  colors: z.array(z.string()).optional(),
  images: z.array(z.string()).min(1, 'Please add at least one image.'),
});

interface ProductFormProps {
    product?: Product;
}

const availableColors = ['Black', 'White', 'Silver', 'Red', 'Blue', 'Green'];

export default function ProductForm({ product }: ProductFormProps) {
    const { addProduct, updateProduct, submitting } = useProducts();
    const router = useRouter();
    const { toast } = useToast();
    const [categories, setCategories] = useState<Category[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

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
            images: product?.images || [],
        },
    });
    
    const handleGenerateDescription = async () => {
        const productName = form.getValues('name');
        const productImages = form.getValues('images');
        if (!productName) {
            toast({
                variant: 'destructive',
                title: 'Product Name Required',
                description: 'Please enter a product name before generating a description.',
            });
            return;
        }
        
        setIsGenerating(true);
        try {
            const aiInput: GenerateProductDescriptionInput = {
                productTitle: productName,
            };

            const imageUrl = productImages.length > 0 ? productImages[0] : undefined;

            if (imageUrl && (imageUrl.startsWith('data:image') || imageUrl.startsWith('http'))) {
                aiInput.productImageDataUri = imageUrl;
            }

            const result = await generateProductDescription(aiInput);
            form.setValue('description', result.productDescription.replace(/\\n/g, '\n'), { shouldValidate: true });
            toast({
                title: 'Description Generated!',
                description: 'The AI-generated description has been added.',
            });
        } catch (error) {
            console.error('Error generating description:', error);
            toast({
                variant: 'destructive',
                title: 'Generation Failed',
                description: 'Could not generate a description at this time.',
            });
        } finally {
            setIsGenerating(false);
        }
    };


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
            router.refresh();
        } catch (error) {
            console.error('Failed to save product:', error);
            toast({
                variant: 'destructive',
                title: 'Save Failed',
                description: 'An error occurred while saving the product.',
            });
        }
    }

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
                                 <div className="relative">
                                    <FormControl>
                                        <Textarea placeholder="Describe the product..." {...field} rows={5} />
                                    </FormControl>
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        size="sm" 
                                        className="absolute bottom-2 right-2"
                                        onClick={handleGenerateDescription}
                                        disabled={isGenerating}
                                    >
                                        {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Generate with AI'}
                                    </Button>
                                </div>
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
                                     <FormDescription>The product's unique barcode or Stock Keeping Unit.</FormDescription>
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
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.id}>
                                        {category.name}
                                        </SelectItem>
                                    ))}
                                    </SelectContent>
                                </Select>
                                <FormDescription>The product category will help with filtering and search.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="isFeatured"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">Feature on homepage</FormLabel>
                                <FormDescription>
                                If enabled, this product will appear in the "Featured Products" section.
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="colors"
                        render={() => (
                            <FormItem>
                                <div className="mb-4">
                                    <FormLabel className="text-base">Colors</FormLabel>
                                    <FormDescription>
                                    Optional: Select the available colors for the product.
                                    </FormDescription>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {availableColors.map((color) => (
                                    <FormField
                                        key={color}
                                        control={form.control}
                                        name="colors"
                                        render={({ field }) => {
                                        return (
                                            <FormItem
                                                key={color}
                                                className="flex flex-row items-start space-x-3 space-y-0"
                                            >
                                                <FormControl>
                                                    <Checkbox
                                                    checked={field.value?.includes(color)}
                                                    onCheckedChange={(checked) => {
                                                        return checked
                                                        ? field.onChange([...(field.value || []), color])
                                                        : field.onChange(
                                                            field.value?.filter(
                                                                (value) => value !== color
                                                            )
                                                            )
                                                    }}
                                                    />
                                                </FormControl>
                                                <FormLabel className="font-normal">{color}</FormLabel>
                                            </FormItem>
                                        )
                                        }}
                                    />
                                    ))}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                     />

                     <Controller
                        control={form.control}
                        name="images"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product Images</FormLabel>
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