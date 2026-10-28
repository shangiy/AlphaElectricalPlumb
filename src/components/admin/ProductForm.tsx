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
import { useEffect, useState, useRef } from 'react';
import ImageUpload from '@/components/admin/ImageUpload';
import { Loader2, Plus, Save, ArrowLeft, Camera, Sparkles, X } from 'lucide-react';
import { identifyProductVisually } from '@/ai/flows/visual-identity-flow';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';

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
    
    // Scanner State
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [isProcessingScan, setIsProcessingScan] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

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

    const startScanner = async () => {
        setIsScannerOpen(true);
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            setStream(mediaStream);
            if (videoRef.current) videoRef.current.srcObject = mediaStream;
        } catch (err) {
            toast({ variant: 'destructive', title: 'Camera Error', description: 'Could not access camera for scanning.' });
        }
    };

    const stopScanner = () => {
        if (stream) stream.getTracks().forEach(t => t.stop());
        setStream(null);
        setIsScannerOpen(false);
    };

    const handleScan = async () => {
        if (!videoRef.current || !canvasRef.current) return;
        setIsProcessingScan(true);

        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d')?.drawImage(video, 0, 0);

        const dataUri = canvas.toDataURL('image/jpeg', 0.8);

        try {
            const result = await identifyProductVisually({ imageDataUri: dataUri });
            
            // Populate form fields with AI results
            form.setValue('name', result.suggestedName);
            if (result.detectedBarcode) form.setValue('barcode', result.detectedBarcode);
            if (result.suggestedCategory) {
                const found = categories.find(c => c.name.toLowerCase().includes(result.suggestedCategory!.toLowerCase()));
                if (found) form.setValue('category', found.name);
            }
            form.setValue('description', `Extracted features: ${result.technicalFeatures.join(', ')}`);

            toast({ title: 'AI Identification Complete', description: `Detected: ${result.suggestedName}` });
            stopScanner();
        } catch (err) {
            toast({ variant: 'destructive', title: 'Scan Error', description: 'AI failed to identify the item. Try again.' });
        } finally {
            setIsProcessingScan(false);
        }
    };

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
                        <div className="flex items-center gap-2">
                             <Button type="button" variant="outline" onClick={startScanner} className="rounded-full border-primary/40 text-primary hover:bg-primary/5">
                                <Camera className="h-4 w-4 mr-2" /> Scan Item
                            </Button>
                            {product && (
                                <span className="text-[10px] font-black uppercase bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">
                                    ID: {product.id.toString().slice(0, 8)}
                                </span>
                            )}
                        </div>
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
                                                <Input {...field} className="rounded-xl font-mono" placeholder="Scan or type code" />
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

            <Dialog open={isScannerOpen} onOpenChange={setIsScannerOpen}>
                <DialogContent className="sm:max-w-[600px] p-0 rounded-[2.5rem] overflow-hidden border-none">
                    <DialogHeader className="p-8 bg-accent text-white">
                        <DialogTitle className="flex items-center gap-3 text-2xl">
                            <Sparkles className="h-6 w-6 text-primary" />
                            Inventory AI Scanner
                        </DialogTitle>
                    </DialogHeader>
                    <div className="p-8 space-y-6">
                        <div className="aspect-video bg-black rounded-[2rem] overflow-hidden relative shadow-2xl">
                             <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
                             <canvas ref={canvasRef} className="hidden" />
                             {isProcessingScan && (
                                <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center text-white gap-4">
                                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                                    <p className="font-bold tracking-widest text-sm uppercase">Mapping Visual Features...</p>
                                </div>
                             )}
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-bold text-accent">Registration Mode Active</p>
                            <p className="text-xs text-muted-foreground">Scan labels, barcodes, or parts to auto-fill technical specs.</p>
                        </div>
                    </div>
                    <DialogFooter className="p-8 bg-muted/30 gap-3">
                        <Button variant="ghost" onClick={stopScanner} className="rounded-full px-8">Cancel</Button>
                        <Button onClick={handleScan} disabled={isProcessingScan} className="rounded-full px-12 bg-primary font-black uppercase tracking-widest shadow-xl">
                           IDENTIFY & IMPORT
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
       </Form>
    );
}
