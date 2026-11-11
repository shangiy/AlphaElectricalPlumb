'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthProvider';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MessageSquareQuote, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import ReviewForm from '@/components/reviews/ReviewForm';
import { Rating } from '@/components/ui/rating';
import { formatDistanceToNow } from 'date-fns';
import { getStorefrontSetting } from '@/app/actions/cms-actions';

interface ReviewData {
    id: string;
    userName: string;
    rating: number;
    title: string;
    comment: string;
    createdAt: string;
    isHidden: boolean;
}

/**
 * 2027 Homepage Professional Review Section:
 * Now respects CMS moderation (isHidden) and dynamic layout settings.
 * Refined to be more compact (v4.4.15).
 */
export default function CustomerReviews() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [reviews, setReviews] = useState<ReviewData[]>([]);
    const [layout, setLayout] = useState({ type: 'marquee' });
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const fetchCMSData = useCallback(async () => {
        if (!supabase) return;
        setIsLoading(true);
        try {
            const layoutConfig = await getStorefrontSetting('review_layout');
            if (layoutConfig) setLayout(layoutConfig);

            // Fetch reviews, excluding hidden ones for the public storefront
            const { data, error } = await supabase
                .from('reviews')
                .select('*')
                .eq('review_type', 'homepage')
                .eq('is_hidden', false)
                .order('sort_order', { ascending: true })
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            
            setReviews((data || []).map(r => ({
                id: r.id,
                userName: r.author_name || 'Verified Client',
                rating: r.rating,
                title: r.title,
                comment: r.comment,
                createdAt: r.created_at,
                isHidden: r.is_hidden
            })));
        } catch (error: any) {
            console.error("Fetch reviews error details:", 
                error instanceof Error ? error.message : JSON.stringify(error, Object.getOwnPropertyNames(error))
            );
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
        toast({ title: "Feedback Pending", description: "Your experience has been sent to our moderation queue." });
        fetchCMSData();
    };

    return (
        <section className="py-16 bg-background overflow-hidden border-t">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row justify-between items-end mb-10 gap-6">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] mb-2 text-xs">
                            <Sparkles size={14} /> Verified Experience
                        </div>
                        <h2 className="text-4xl font-black font-headline text-accent tracking-tighter leading-tight mb-4 uppercase">Professional <br/>Feedback</h2>
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
                                    <div className="bg-secondary/10 p-10 rounded-[2.5rem] h-full flex flex-col transition-all hover:bg-secondary/20 group">
                                        <div className="flex justify-between items-start mb-6">
                                            <Rating rating={review.rating} size={18} />
                                            <span className="text-[9px] font-black uppercase text-muted-foreground/30">
                                                {formatDistanceToNow(new Date(review.createdAt))} ago
                                            </span>
                                        </div>
                                        <h4 className="text-xl font-black text-accent tracking-tighter uppercase mb-3 line-clamp-1">
                                            {review.title || 'Exceptional Quality'}
                                        </h4>
                                        <p className="text-base text-muted-foreground font-medium italic leading-relaxed opacity-80 mb-8 line-clamp-4">
                                            "{review.comment}"
                                        </p>
                                        <div className="mt-auto flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-accent text-white flex items-center justify-center font-black text-lg group-hover:scale-110 transition-transform">
                                                {review.userName.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <span className="block text-xs font-black text-accent uppercase tracking-tighter">{review.userName}</span>
                                                <span className="text-[9px] font-bold text-muted-foreground uppercase opacity-40">Verified Business User</span>
                                            </div>
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
