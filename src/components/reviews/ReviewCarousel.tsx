
'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Rating } from '@/components/ui/rating';
import { Loader2, MessageSquareQuote } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Review {
  id: string;
  author_name: string;
  rating: number;
  title: string;
  comment: string;
  created_at: string;
}

export default function ReviewCarousel({ productId }: { productId?: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      let query = supabase.from('reviews').select('*').order('created_at', { ascending: false });
      if (productId) {
        query = query.eq('product_id', productId);
      }
      const { data, error } = await query;
      if (error) throw error;
      setReviews(data || []);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="p-12 text-center bg-secondary/20 rounded-[2.5rem] border-2 border-dashed border-muted-foreground/20">
        <MessageSquareQuote className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
        <p className="text-muted-foreground font-medium italic">
          No reviews yet. Be the first to share your experience with Alpha Electricals & Plumbing!
        </p>
      </div>
    );
  }

  // Double the reviews for a seamless marquee loop
  const displayReviews = [...reviews, ...reviews, ...reviews];

  return (
    <div className="overflow-hidden relative w-full py-8 group">
        {/* Gradient overlays for the edges */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        
        <div className="flex w-fit space-x-6 animate-marquee hover:[animation-play-state:paused] py-4">
            {displayReviews.map((review, i) => (
            <div 
                key={`${review.id}-${i}`} 
                className="min-w-[320px] max-w-[400px] bg-white p-8 rounded-[2rem] shadow-lg border border-primary/5 shrink-0 flex flex-col transition-all hover:scale-105 hover:shadow-xl"
            >
                <div className="flex justify-between items-start mb-4">
                    <Rating rating={review.rating} size={16} />
                    <span className="text-[10px] font-black uppercase text-muted-foreground/40">
                        {formatDistanceToNow(new Date(review.created_at))} ago
                    </span>
                </div>
                <h4 className="font-bold text-accent text-lg mb-2 truncate">
                    {review.title || 'Verified Review'}
                </h4>
                <p className="text-muted-foreground text-sm leading-relaxed whitespace-normal line-clamp-4 italic">
                    "{review.comment}"
                </p>
                <div className="mt-auto pt-6 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xs">
                        {review.author_name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-bold text-muted-foreground">
                        {review.author_name || 'Anonymous Customer'}
                    </span>
                </div>
            </div>
            ))}
        </div>
    </div>
  );
}
