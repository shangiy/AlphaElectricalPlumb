'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MessageSquareQuote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import ReviewForm from '@/components/reviews/ReviewForm';
import { Rating } from '@/components/ui/rating';
import { Badge } from '@/components/ui/badge';

interface ReviewData {
    id: string;
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
    type: string;
}

/**
 * 2027 Homepage Professional Review Section:
 * Features high-fidelity card mapping from Supabase database.
 * Sync v4.4.29: Removed "Community Member" label for a cleaner aesthetic.
 */
export default function CustomerReviews() {
    const { toast } = useToast();
    const [reviews, setReviews] = useState<ReviewData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const fetchCMSData = useCallback(async () => {
        if (!supabase) return;
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('reviews')
                .select('id, author_name, comment, rating, review_type, created_at')
                .eq('review_type', 'homepage')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            
            setReviews((data || []).map(r => ({
                id: r.id,
                userName: r.author_name || 'Client',
                rating: r.rating || 5,
                comment: r.comment || '',
                createdAt: r.created_at,
                type: r.review_type
            })));
        } catch (error: any) {
            console.error("Home reviews fetch failed:", error.message || error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCMSData();
    }, [fetchCMSData]);

    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' }, [
        Autoplay({ delay: 6000, stopOnInteraction: false })
    ]);

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    const handleSuccess = () => {
        setIsDialogOpen(false);
        toast({ title: "Feedback Recorded", description: "Thank you for sharing your experience with Alpha." });
        fetchCMSData();
    };

    return (
        <section className="py-16 bg-background overflow-hidden border-t">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row justify-between items-end mb-10 gap-6">
                    <div className="max-w-2xl">
                        <h2 className="text-4xl font-black font-headline text-accent tracking-tighter leading-tight mb-4 uppercase">SYSTEM <br/>REVIEWS</h2>
                        <p className="text-lg text-muted-foreground font-medium">Discover what our community of engineers, plumbers, and developers are saying about Alpha's ecosystem.</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="flex gap-2">
                            <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-2" onClick={scrollPrev}>
                                <ChevronLeft size={20} />
                            </Button>
                            <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-2" onClick={scrollNext}>
                                <ChevronRight size={20} />
                            </Button>
                        </div>
                        
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="lg" className="h-12 rounded-full px-8 bg-primary font-black uppercase tracking-tighter text-base shadow-xl hover:scale-105 transition-transform">
                                    <MessageSquareQuote className="mr-2 h-5 w-5" />
                                    Post Feedback
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[420px] p-0 border-none bg-transparent shadow-none">
                                <DialogHeader className="sr-only">
                                    <DialogTitle>Post Feedback</DialogTitle>
                                </DialogHeader>
                                <ReviewForm onReviewSubmitted={handleSuccess} />
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    </div>
                ) : reviews && reviews.length > 0 ? (
                    <div className="embla" ref={emblaRef}>
                        <div className="embla__container flex gap-6">
                            {reviews.map((review) => (
                                <div key={review.id} className="embla__slide flex-[0_0_100%] md:flex-[0_0_45%] lg:flex-[0_0_30%] min-w-0">
                                    <div className="bg-white p-8 border border-purple-100 rounded-[2rem] shadow-sm hover:shadow-xl transition-all flex flex-col justify-between h-full group">
                                        <div>
                                            <div className="flex items-center justify-between mb-6">
                                                <Rating rating={review.rating} size={16} />
                                                <Badge className="bg-primary/10 text-primary border-none text-[9px] font-black uppercase tracking-widest px-2 py-1">
                                                    Verified
                                                </Badge>
                                            </div>
                                            <p className="text-muted-foreground text-sm italic mb-8 leading-relaxed">"{review.comment}"</p>
                                        </div>
                                        <div className="border-t border-muted pt-6 flex items-center justify-between">
                                            <div>
                                                <h4 className="font-bold text-accent text-sm">{review.userName}</h4>
                                            </div>
                                            <span className="text-[10px] font-bold text-muted-foreground">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-16 rounded-[2.5rem] bg-secondary/5 border-2 border-dashed border-muted-foreground/10">
                        <MessageSquareQuote className="mx-auto h-16 w-16 text-muted-foreground opacity-10 mb-4" />
                        <h3 className="text-3xl font-black text-muted-foreground uppercase tracking-tighter opacity-30">Silence in the Cloud</h3>
                        <p className="text-muted-foreground mt-3 text-base font-medium max-w-md mx-auto">Our database is ready for your professional feedback. Start the conversation today.</p>
                    </div>
                )}
            </div>
        </section>
    );
}
