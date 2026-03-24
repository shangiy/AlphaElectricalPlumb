
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, Package, Truck, CheckCircle, Wallet } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/auth/AuthGuard';
import { useCart } from '@/context/CartProvider';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { sendOrderConfirmationEmail } from '@/ai/flows/send-order-confirmation-email';
import { Loader2 } from 'lucide-react';
import PaystackButton from '@/components/common/PaystackButton';


function TrackOrderContent() {
    const router = useRouter();
    const { cartItems, orderTotal, clearCart } = useCart();
    const { toast } = useToast();
    const [isPaid, setIsPaid] = useState(false);
    
    const productToTrack = cartItems.length > 0 ? cartItems[0] : null;

    const defaultOrderDetails = {
        id: 'ALPHA-00000',
        productName: 'No recent order found',
        status: 'Awaiting Order',
        estimatedDelivery: 'N/A',
        currentLocation: 'Warehouse',
        deliveryAddress: 'Please complete checkout first',
    };
    
    const [deliveryLocation, setDeliveryLocation] = useState('123 Alpha St, Eldoret');

    const orderDetails = productToTrack ? {
        id: `ALPHA-${productToTrack.id.slice(-5).toUpperCase()}`,
        productName: `${productToTrack.name}${cartItems.length > 1 ? ` and ${cartItems.length - 1} other item(s)` : ''}`,
        status: isPaid ? 'In Transit' : 'Awaiting Payment',
        estimatedDelivery: isPaid ? '3:45 PM Today' : 'Pending',
        currentLocation: isPaid ? 'Nakuru-Eldoret Highway' : 'Warehouse',
        deliveryAddress: deliveryLocation,
    } : defaultOrderDetails;

    const progress = [
        { status: 'Order Confirmed', icon: <Package />, completed: true },
        { status: 'Dispatched', icon: <Truck />, completed: isPaid },
        { status: 'In Transit', icon: <Truck />, completed: isPaid },
        { status: 'Delivered', icon: <Home />, completed: false },
    ];
    
    const handlePaymentSuccess = async () => {
        if (!productToTrack) return;

        try {
            await sendOrderConfirmationEmail({
                orderId: orderDetails.id,
                productName: orderDetails.productName,
                totalAmount: orderTotal,
                deliveryAddress: deliveryLocation,
                customerEmail: "customer@example.com"
            });

            setIsPaid(true);
            toast({
                title: "Payment Successful!",
                description: "Your order is confirmed and will be delivered shortly.",
            });
            clearCart();
        } catch(error) {
             console.error("Payment/Email failed:", error);
             toast({
                variant: "destructive",
                title: "Payment Failed",
                description: "Could not process payment or send confirmation email.",
            });
        }
    };

    return (
        <div className="bg-secondary">
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold font-headline text-primary">TRACKING MY ORDER</h1>
                        <p className="text-lg text-muted-foreground mt-2">
                           Follow your package from our warehouse to your doorstep.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <Card className="lg:col-span-1 h-fit">
                            <CardHeader>
                                <CardTitle>Delivery Details</CardTitle>
                                <CardDescription>Order ID: {orderDetails.id}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="font-semibold">{orderDetails.productName}</p>
                                    <div className="space-y-2 mt-2">
                                      <label htmlFor="deliveryLocation" className="text-sm font-medium text-muted-foreground">Delivery Location</label>
                                      <Input 
                                        id="deliveryLocation"
                                        value={deliveryLocation}
                                        onChange={(e) => setDeliveryLocation(e.target.value)}
                                        placeholder="Enter your delivery address"
                                        disabled={!productToTrack || isPaid}
                                      />
                                    </div>
                                </div>
                                <Separator />
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <p className="text-muted-foreground">Status</p>
                                        <p className="font-semibold text-primary">{orderDetails.status}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="text-muted-foreground">Est. Delivery</p>
                                        <p className="font-semibold">{orderDetails.estimatedDelivery}</p>
                                    </div>
                                     <div className="flex justify-between">
                                        <p className="text-muted-foreground">Driver Location</p>
                                        <p className="font-semibold">{orderDetails.currentLocation}</p>
                                    </div>
                                </div>
                                <Separator />
                                <div className="space-y-4 pt-2">
                                    <h4 className="font-semibold">Progress</h4>
                                    <div className="flex justify-between items-center relative">
                                        <div className="absolute left-0 top-1/2 w-full h-0.5 bg-border -translate-y-1/2 -z-10"></div>
                                        <div className={`absolute left-0 top-1/2 h-0.5 bg-primary -translate-y-1/2 -z-10 transition-all duration-500 ${isPaid ? 'w-2/3' : 'w-0'}`}></div>
                                        {progress.map((step, index) => (
                                            <div key={index} className="flex flex-col items-center z-0">
                                                <div className={`flex items-center justify-center h-8 w-8 rounded-full border-2 transition-colors ${step.completed ? 'bg-primary border-primary text-primary-foreground' : 'bg-background border-border'}`}>
                                                    {step.completed ? <CheckCircle className="h-5 w-5" /> : step.icon}
                                                </div>
                                                <p className="text-xs mt-2 text-center">{step.status}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="lg:col-span-2">
                            <div className="aspect-video overflow-hidden rounded-lg border shadow-lg mb-6">
                            <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d127671.8669435648!2d35.2215984638708!3d0.5190981395995577!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e6!4m5!1s0x178101ae37f9f539%3A0x66249514f7336a87!2sEldoret%2C%20Kenya!3m2!1d0.5142766!2d35.2697802!4m5!1s0x178101188054703d%3A0x7439525164f9715!2sAlpha%20Electricals%20%26%20Plumbing%20Ltd%2C%20Nandi%20Arcade%2C%20Eldoret!3m2!1d0.519323!2d35.275171!5e0!3m2!1sen!2sus!4v1698335122456!5m2!1sen!2sus"
                                    className="w-full h-full"
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                            {productToTrack && !isPaid && (
                                <PaystackButton 
                                    amount={orderTotal}
                                    onSuccess={handlePaymentSuccess}
                                    email="patrickshangstone22@gmail.com"
                                    phone="+254727607824"
                                />
                            )}
                            {isPaid && (
                                <Card className="text-center p-4 bg-green-100 border-green-300">
                                    <CardTitle className="text-green-800 flex items-center justify-center gap-2">
                                        <CheckCircle /> Payment Confirmed!
                                    </CardTitle>
                                    <CardDescription className="text-green-700 mt-1">Your delivery is on its way.</CardDescription>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default function TrackOrderPage() {
    return (
        <AuthGuard>
            <TrackOrderContent />
        </AuthGuard>
    )
}
