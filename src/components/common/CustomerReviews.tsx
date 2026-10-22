'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Rating } from '@/components/ui/rating';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User, MessageSquareQuote, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from '@/lib/utils';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

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
    createdAt: string;
}

export default function CustomerReviews() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [reviews, setReviews] = useState<ReviewData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    const fetchReviews = useCallback(async () => {
        if (!supabase) return;
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('reviews')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            
            setReviews((data || []).map(r => ({
                id: r.id,
                userName: r.author_name || r.user_name || 'Valued Customer',
                rating: r.rating,
                comment: r.comment,
                createdAt: r.created_at
            })));
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        setMounted(true);
        fetchReviews();
    }, [fetchReviews]);

    const form = useForm<ReviewFormValues>({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            userName: '',
            rating: 5,
            comment: '',
        },
    });

    useEffect(() => {
        if (user?.name && !form.getValues('userName')) {
            form.setValue('userName', user.name);
        }
    }, [user, form]);

    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' }, [
        Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })
    ]);

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    const onSubmit = async (values: ReviewFormValues) => {
        if (!supabase) return;
        
        if (!user) {
            toast({ title: "Login Required", description: "You must be logged in to post a review.", variant: "destructive" });
            return;
        }

        try {
            const { error } = await supabase.from('reviews').insert([{
                author_name: values.userName,
                user_id: user.id,
                rating: values.rating,
                comment: values.comment
            }]);

            if (error) throw error;

            toast({
                title: "Review Submitted!",
                description: "Thank you for your feedback.",
            });
            
            form.reset({
                userName: user?.name || '',
                rating: 5,
                comment: '',
            });
            setIsDialogOpen(false);
            fetchReviews();
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Could not submit review. Please try again.",
            });
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'Just now';
        return new Date(dateString).toLocaleDateString('en-KE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const leaveReviewButton = (
        <Button size="lg" className="rounded-full shadow-lg hover:scale-105 transition-transform bg-[#28235f] hover:bg-[#28235f]/90">
            <MessageSquareQuote className="mr-2 h-5 w-5" />
            Leave a Review
        </Button>
    );

    return (
        <section className="py-20 bg-secondary/30 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 text-center md:text-left">
                    <div>
                        <h2 className="text-4xl font-bold font-headline text-primary">Customer Reviews</h2>
                        <p className="text-muted-foreground mt-2">What our clients say about Alpha Electricals</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex gap-2">
                            <Button variant="outline" size="icon" className="rounded-full h-10 w-10" onClick={scrollPrev}>
                                <ChevronLeft className="h-5 w-5" />
                            </Button>
                            <Button variant="outline" size="icon" className="rounded-full h-10 w-10" onClick={scrollNext}>
                                <ChevronRight className="h-5 w-5" />
                            </Button>
                        </div>
                        
                        {mounted ? (
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    {leaveReviewButton}
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
                                                        <FormLabel>Name to display</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Enter your preferred name" {...field} />
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
                        ) : leaveReviewButton}
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    </div>
                ) : reviews && reviews.length > 0 ? (
                    <div className="embla" ref={emblaRef}>
                        <div className="embla__container flex gap-6">
                            {reviews.map((review) => (
                                <div key={review.id} className="embla__slide flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0">
                                    <Card className="bg-card h-full hover:shadow-xl transition-all border-primary/10 rounded-2xl overflow-hidden group">
                                        <CardHeader className="flex flex-row items-center gap-4 pb-4">
                                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                                <User size={24} />
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <CardTitle className="text-lg font-bold truncate">{review.userName}</CardTitle>
                                                <CardDescription className="text-xs">{formatDate(review.createdAt)}</CardDescription>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <Rating rating={review.rating} size={16} />
                                            <p className="text-muted-foreground italic leading-relaxed line-clamp-4">
                                                "{review.comment}"
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </div>
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