'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthProvider';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MessageSquareQuote, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import ReviewForm from '@/components/reviews/ReviewForm';
import { Rating } from '@/components/ui/rating';
import { formatDistanceToNow } from 'date-fns';

interface ReviewData {
    id: string;
    userName: string;
    rating: number;
    title: string;
    comment: string;
    createdAt: string;
}

/**
 * 2027 Homepage Professional Review Section:
 * Filters strictly for 'homepage' feedback using the unified reviews table.
 */
export default function CustomerReviews() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [reviews, setReviews] = useState<ReviewData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const fetchReviews = useCallback(async () => {
        if (!supabase) return;
        setIsLoading(true);
        try {
            // Fetch strictly 'homepage' storefront testimonials
            const { data, error } = await supabase
                .from('reviews')
                .select('*')
                .eq('review_type', 'homepage')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            
            setReviews((data || []).map(r => ({
                id: r.id,
                userName: r.author_name || 'Verified Client',
                rating: r.rating,
                title: r.title,
                comment: r.comment,
                createdAt: r.created_at
            })));
        } catch (error) {
            console.error("Fetch reviews error:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' }, [
        Autoplay({ delay: 6000, stopOnInteraction: false })
    ]);

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    const handleSuccess = () => {
        setIsDialogOpen(false);
        fetchReviews();
    };

    return (
        <section className="py-32 bg-background overflow-hidden border-t">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-10">
                    <div className="max-w-2xl">
                        <h2 className="text-6xl font-black font-headline text-accent tracking-tighter leading-[0.8] mb-6 uppercase">Professional <br/>Feedback</h2>
                        <p className="text-xl text-muted-foreground font-medium">Discover what our community of engineers, plumbers, and developers are saying about Alpha's ecosystem.</p>
                    </div>
                    
                    <div className="flex items-center gap-6">
                        <div className="flex gap-2">
                            <Button variant="outline" size="icon" className="h-14 w-14 rounded-full border-2" onClick={scrollPrev}>
                                <ChevronLeft size={24} />
                            </Button>
                            <Button variant="outline" size="icon" className="h-14 w-14 rounded-full border-2" onClick={scrollNext}>
                                <ChevronRight size={24} />
                            </Button>
                        </div>
                        
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="lg" className="h-14 rounded-full px-10 bg-primary font-black uppercase tracking-tighter text-lg shadow-2xl hover:scale-105 transition-transform">
                                    <MessageSquareQuote className="mr-3 h-6 w-6" />
                                    Post Feedback
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px] p-0 border-none bg-transparent shadow-none">
                                <ReviewForm onReviewSubmitted={handleSuccess} />
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-24">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    </div>
                ) : reviews && reviews.length > 0 ? (
                    <div className="embla" ref={emblaRef}>
                        <div className="embla__container flex gap-8">
                            {reviews.map((review) => (
                                <div key={review.id} className="embla__slide flex-[0_0_100%] md:flex-[0_0_45%] lg:flex-[0_0_30%] min-w-0">
                                    <div className="bg-secondary/10 p-12 rounded-[3.5rem] h-full flex flex-col transition-all hover:bg-secondary/20 group">
                                        <div className="flex justify-between items-start mb-8">
                                            <Rating rating={review.rating} size={20} />
                                            <span className="text-[10px] font-black uppercase text-muted-foreground/30">
                                                {formatDistanceToNow(new Date(review.createdAt))} ago
                                            </span>
                                        </div>
                                        <h4 className="text-2xl font-black text-accent tracking-tighter uppercase mb-4 line-clamp-1">
                                            {review.title || 'Exceptional Quality'}
                                        </h4>
                                        <p className="text-lg text-muted-foreground font-medium italic leading-relaxed opacity-80 mb-10 line-clamp-4">
                                            "{review.comment}"
                                        </p>
                                        <div className="mt-auto flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-2xl bg-accent text-white flex items-center justify-center font-black text-xl group-hover:scale-110 transition-transform">
                                                {review.userName.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <span className="block text-sm font-black text-accent uppercase tracking-tighter">{review.userName}</span>
                                                <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-40">Verified Business User</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-32 rounded-[4rem] bg-secondary/5 border-2 border-dashed border-muted-foreground/10">
                        <MessageSquareQuote className="mx-auto h-20 w-20 text-muted-foreground opacity-10 mb-6" />
                        <h3 className="text-4xl font-black text-muted-foreground uppercase tracking-tighter opacity-30">Silence in the Cloud</h3>
                        <p className="text-muted-foreground mt-4 text-lg font-medium max-w-md mx-auto">Our database is ready for your professional feedback. Start the conversation today.</p>
                    </div>
                )}
            </div>
        </section>
    );
}
