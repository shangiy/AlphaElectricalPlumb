
'use client';

import { useState } from 'react';
import { useFirebase, useCollection, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Rating } from '@/components/ui/rating';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User, MessageSquareQuote, Star } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from '@/lib/utils';

const reviewSchema = z.object({
  userName: z.string().min(2, 'Name must be at least 2 characters.'),
  rating: z.number().min(1).max(5),
  comment: z.string().min(5, 'Review must be at least 5 characters.'),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewData {
    id: string;
    userName: string;
    rating: number;
    comment: string;
    createdAt: Timestamp;
}

export default function CustomerReviews() {
    const { firestore } = useFirebase();
    const { user } = useUser();
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const reviewsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'reviews'), orderBy('createdAt', 'desc'));
    }, [firestore]);

    const { data: reviews, isLoading } = useCollection<ReviewData>(reviewsQuery);

    const form = useForm<ReviewFormValues>({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            userName: user?.displayName || '',
            rating: 5,
            comment: '',
        },
    });

    const onSubmit = (values: ReviewFormValues) => {
        if (!firestore) return;

        const reviewData = {
            ...values,
            createdAt: serverTimestamp(),
        };

        addDocumentNonBlocking(collection(firestore, 'reviews'), reviewData);
        
        toast({
            title: "Review Submitted!",
            description: "Thank you for your feedback.",
        });
        
        form.reset({
            userName: user?.displayName || '',
            rating: 5,
            comment: '',
        });
        setIsDialogOpen(false);
    };

    const formatDate = (timestamp: Timestamp) => {
        if (!timestamp) return 'Just now';
        return timestamp.toDate().toLocaleDateString('en-KE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <section className="py-20 bg-secondary/30">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 text-center md:text-left">
                    <div>
                        <h2 className="text-4xl font-bold font-headline text-primary">Customer Reviews</h2>
                        <p className="text-muted-foreground mt-2">What our clients say about Alpha Electricals</p>
                    </div>
                    
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="lg" className="rounded-full shadow-lg hover:scale-105 transition-transform bg-[#28235f] hover:bg-[#28235f]/90">
                                <MessageSquareQuote className="mr-2 h-5 w-5" />
                                Leave a Review
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Submit Your Review</DialogTitle>
                            </DialogHeader>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="userName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Your Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="John Doe" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="rating"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Rating</FormLabel>
                                                <div className="flex items-center gap-2">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button
                                                            key={star}
                                                            type="button"
                                                            onClick={() => field.onChange(star)}
                                                            className="focus:outline-none"
                                                        >
                                                            <Star 
                                                                className={cn(
                                                                    "h-8 w-8 transition-colors",
                                                                    star <= field.value ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"
                                                                )} 
                                                            />
                                                        </button>
                                                    ))}
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="comment"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Review</FormLabel>
                                                <FormControl>
                                                    <Textarea 
                                                        placeholder="Share your experience..." 
                                                        className="resize-none" 
                                                        rows={4}
                                                        {...field} 
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90">Post Review</Button>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    </div>
                ) : reviews && reviews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {reviews.map((review) => (
                            <Card key={review.id} className="bg-card hover:shadow-xl transition-shadow border-primary/10 rounded-2xl overflow-hidden">
                                <CardHeader className="flex flex-row items-center gap-4 pb-4">
                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <User size={24} />
                                    </div>
                                    <div className="flex flex-col">
                                        <CardTitle className="text-lg font-bold">{review.userName}</CardTitle>
                                        <CardDescription className="text-xs">{formatDate(review.createdAt)}</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Rating rating={review.rating} size={16} />
                                    <p className="text-muted-foreground italic leading-relaxed">
                                        "{review.comment}"
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 border-2 border-dashed rounded-3xl bg-background/50 border-primary/20">
                        <MessageSquareQuote className="mx-auto h-16 w-16 text-muted-foreground opacity-30" />
                        <h3 className="mt-4 text-2xl font-bold text-muted-foreground">No reviews yet</h3>
                        <p className="text-muted-foreground mt-2 max-w-sm mx-auto">Be the first to share your experience with Alpha Electricals & Plumbing Ltd!</p>
                    </div>
                )}
            </div>
        </section>
    );
}
