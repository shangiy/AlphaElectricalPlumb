'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Rating } from '@/components/ui/rating';
import { Loader2, MessageSquareQuote, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface Review {
  id: string;
  author_name: string;
  rating: number;
  title: string;
  comment: string;
  review_type: string;
  created_at: string;
}

/**
 * 2027 Intelligent Review Stream:
 * Fetches and displays reviews based on review_type (homepage or product).
 */
export default function ReviewCarousel({ productId }: { productId?: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      let query = supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (productId) {
        // Fetch strictly product-specific reviews
        query = query
          .eq('review_type', 'product')
          .eq('product_id', productId);
      } else {
        // Fetch strictly storefront/homepage reviews
        query = query.eq('review_type', 'homepage');
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
      <div className="flex justify-center py-20">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="p-20 text-center bg-secondary/10 rounded-[3rem] border-2 border-dashed border-muted-foreground/10">
        <MessageSquareQuote className="h-16 w-16 mx-auto text-muted-foreground/20 mb-6" />
        <p className="text-muted-foreground font-bold text-xl tracking-tight opacity-60">
          {productId ? 'Be the first to review this product.' : 'Be the first to share your experience with Alpha.'}
        </p>
      </div>
    );
  }

  // Triple for infinite scroll smoothness if multiple reviews exist
  const displayReviews = reviews.length > 1 ? [...reviews, ...reviews, ...reviews] : reviews;

  return (
    <div className="overflow-hidden relative w-full py-4 group">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        
        <div className={cn(
          "flex w-fit space-x-8 py-4",
          reviews.length > 1 && "animate-marquee hover:[animation-play-state:paused]"
        )}>
            {displayReviews.map((review, i) => (
            <div 
                key={`${review.id}-${i}`} 
                className="min-w-[360px] max-w-[420px] bg-white p-10 rounded-[3rem] shadow-xl border border-muted-foreground/5 shrink-0 flex flex-col transition-all hover:scale-105 hover:shadow-2xl hover:border-primary/20"
            >
                <div className="flex justify-between items-start mb-6">
                    <Rating rating={review.rating} size={20} />
                    <span className="text-[10px] font-black uppercase text-muted-foreground/30 tracking-widest">
                        {formatDistanceToNow(new Date(review.created_at))} ago
                    </span>
                </div>
                
                <div className="flex items-center gap-2 mb-4">
                    <h4 className="font-black text-accent text-xl tracking-tighter uppercase truncate flex-1">
                        {review.title || 'Exceptional Quality'}
                    </h4>
                    <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/10 border-none px-2 rounded-full">
                        <CheckCircle size={10} className="mr-1" /> Verified
                    </Badge>
                </div>

                <p className="text-muted-foreground text-base leading-relaxed line-clamp-4 font-medium italic opacity-80">
                    "{review.comment}"
                </p>

                <div className="mt-auto pt-8 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-accent text-white flex items-center justify-center font-black text-lg shadow-lg">
                        {review.author_name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <span className="block text-sm font-black text-accent uppercase tracking-tighter">
                            {review.author_name || 'Anonymous Client'}
                        </span>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-40">Verified User</span>
                    </div>
                </div>
            </div>
            ))}
        </div>
    </div>
  );
}
