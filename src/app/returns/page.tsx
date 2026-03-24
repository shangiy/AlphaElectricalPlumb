
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useProducts } from '@/context/ProductProvider';
import { Loader2 } from 'lucide-react';
import AuthGuard from '@/components/auth/AuthGuard';

const returnsFormSchema = z.object({
  productId: z.string().min(1, 'Please select the product you wish to return.'),
  reason: z.string().min(20, 'Please provide a detailed reason for the return (at least 20 characters).'),
  condition: z.string().min(10, 'Please describe the product\'s condition (at least 10 characters).'),
  document: z.any().optional(),
});

type ReturnsFormValues = z.infer<typeof returnsFormSchema>;

function ReturnsContent() {
    const { toast } = useToast();
    const { products, loading: productsLoading } = useProducts();
    
    const form = useForm<ReturnsFormValues>({
        resolver: zodResolver(returnsFormSchema),
        defaultValues: {
            productId: '',
            reason: '',
            condition: '',
        },
    });

    function onSubmit(data: ReturnsFormValues) {
        console.log('Return Request Submitted:', data);
        toast({
            title: "Return Request Submitted",
            description: "Thank you! We have received your return request and will process it shortly.",
        });
        form.reset();
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <Card className="max-w-3xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl">Submit a Return Request</CardTitle>
                    <CardDescription>
                        Please fill out the form below to initiate a product return.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="productId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Product to Return</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={productsLoading}>
                                            <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select the product you are returning..." />
                                            </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {productsLoading ? (
                                                    <SelectItem value="loading" disabled>Loading products...</SelectItem>
                                                ) : (
                                                    products.map((product) => (
                                                        <SelectItem key={product.id} value={product.id}>
                                                            {product.name}
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="reason"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Reason for Return</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="e.g., The item was damaged upon arrival, wrong item was delivered, etc."
                                                rows={4}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="condition"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Condition of Product</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="e.g., Unopened in original packaging, opened but unused, used once, etc."
                                                rows={2}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            <FormField
                                control={form.control}
                                name="document"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Upload Document (Optional)</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="file" 
                                                onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)} 
                                                accept=".pdf,.doc,.docx,.jpg,.png"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Submit Return Request
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}


export default function ReturnsPage() {
    return (
        <AuthGuard>
            <ReturnsContent />
        </AuthGuard>
    );
}
