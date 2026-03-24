
'use client';

import { useForm, useWatch } from 'react-hook-form';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/context/CartProvider';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/auth/AuthGuard';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useEffect } from 'react';

const checkoutFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  phone: z.string().min(10, 'Please enter a valid phone number.'),
  address: z.string().optional(),
  location: z.enum(['in_town', '10_km', '20_km', '30_km', 'over_30_km']).optional(),
}).refine(data => {
    // If a delivery location is selected, the address must be provided.
    if (data.location && !data.address) {
        return false;
    }
    return true;
}, {
    message: 'Delivery address is required when a delivery location is selected.',
    path: ['address'],
});


type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

const shippingOptions = {
    'in_town': 0,
    '10_km': 250,
    '20_km': 500,
    '30_km': 750,
    'over_30_km': 1000,
};

function CheckoutContent() {
    const { toast } = useToast();
    const { cartItems, cartTotal, setShippingCost, shippingCost, orderTotal } = useCart();
    const router = useRouter();

    const form = useForm<CheckoutFormValues>({
        resolver: zodResolver(checkoutFormSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            address: "",
        },
    });
    
    const selectedLocation = useWatch({
        control: form.control,
        name: 'location'
    });

    useEffect(() => {
        const newShippingCost = selectedLocation ? shippingOptions[selectedLocation] : 0;
        setShippingCost(newShippingCost);
    }, [selectedLocation, setShippingCost]);


    function onSubmit(data: CheckoutFormValues) {
        toast({
            title: "Order Details Confirmed",
            description: "Please proceed to make your payment.",
        });
        console.log('Checkout Data:', data);
        console.log('Cart Items:', cartItems);
        router.push('/track-order');
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-KE', {
          style: 'currency',
          currency: 'KES',
          currencyDisplay: 'code',
        }).format(price);
    };

    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h1 className="text-3xl font-bold font-headline mb-4">Your Cart is Empty</h1>
                <p className="text-muted-foreground mb-8">You can't proceed to checkout with an empty cart.</p>
                <Button onClick={() => router.push('/')}>Continue Shopping</Button>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Shipping Details */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Contact Information</CardTitle>
                        <CardDescription>
                            Please provide your contact and optional delivery information.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Full Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="John Doe" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phone Number</FormLabel>
                                                <FormControl>
                                                    <Input type="tel" placeholder="+254 712 345 678" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email Address</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="john.doe@example.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                
                                <Separator />

                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Delivery (Optional)</h3>
                                     <FormField
                                        control={form.control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Type your delivery location address</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g., House No. 123, Some Street, Near Landmark" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="location"
                                        render={({ field }) => (
                                            <FormItem className="space-y-3">
                                            <FormLabel>Select Delivery Location</FormLabel>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                                >
                                                    <FormItem className="flex items-center space-x-3 space-y-0 p-4 border rounded-md has-[:checked]:border-primary">
                                                        <FormControl>
                                                            <RadioGroupItem value="in_town" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal w-full">
                                                            Within Eldoret Town <span className="text-primary font-medium">(Free)</span>
                                                        </FormLabel>
                                                    </FormItem>
                                                    <FormItem className="flex items-center space-x-3 space-y-0 p-4 border rounded-md has-[:checked]:border-primary">
                                                        <FormControl>
                                                            <RadioGroupItem value="10_km" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal w-full">
                                                            0-10km from town <span className="text-muted-foreground">({formatPrice(250)})</span>
                                                        </FormLabel>
                                                    </FormItem>
                                                    <FormItem className="flex items-center space-x-3 space-y-0 p-4 border rounded-md has-[:checked]:border-primary">
                                                        <FormControl>
                                                            <RadioGroupItem value="20_km" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal w-full">
                                                            10-20km from town <span className="text-muted-foreground">({formatPrice(500)})</span>
                                                        </FormLabel>
                                                    </FormItem>
                                                    <FormItem className="flex items-center space-x-3 space-y-0 p-4 border rounded-md has-[:checked]:border-primary">
                                                        <FormControl>
                                                            <RadioGroupItem value="30_km" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal w-full">
                                                            20-30km from town <span className="text-muted-foreground">({formatPrice(750)})</span>
                                                        </FormLabel>
                                                    </FormItem>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>


                                <Button type="submit" size="lg" className="w-full">Place Order</Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                {/* Order Summary */}
                <Card className="bg-secondary sticky top-24 h-fit">
                    <CardHeader>
                        <CardTitle className="text-2xl">Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {cartItems.map(item => (
                                <div key={item.id} className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <Image src={item.images[0]} alt={item.name} width={64} height={64} className="rounded-md object-cover"/>
                                        <div>
                                            <p className="font-semibold">{item.name}</p>
                                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p>{formatPrice(item.price * item.quantity)}</p>
                                </div>
                            ))}
                        </div>
                        <Separator className="my-6"/>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <p className="text-muted-foreground">Subtotal</p>
                                <p>{formatPrice(cartTotal)}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-muted-foreground">Delivery charge</p>
                                <p>{formatPrice(shippingCost)}</p>
                            </div>
                        </div>
                        <Separator className="my-6"/>
                        <div className="flex justify-between font-bold text-lg">
                            <p>Total</p>
                            <p>{formatPrice(orderTotal)}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <AuthGuard>
            <CheckoutContent />
        </AuthGuard>
    )
}
