'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Star, Loader2, PenTool } from 'lucide-react';
import { cn } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';

interface ReviewFormProps {
  productId?: string; 
  productTitle?: string;
  onReviewSubmitted: () => void;
}

/**
 * Modern Unified Review Form v4.6.0:
 * Features a high-fidelity Split-Star interaction engine for 0.5 resolution.
 */
export default function ReviewForm({ productId, productTitle, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment && !title) {
        toast({ variant: "destructive", title: "Incomplete", description: "Please add a comment or heading." });
        return;
    }

    setLoading(true);
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();

      const reviewType = productId ? 'product' : 'homepage';
      const authorName = user?.name || user?.username || 'Client';
      const finalTitle = productTitle || title || (productId ? 'Product Review' : 'Storefront Review');
      const userId = authUser?.id || uuidv4();

      const { error } = await supabase.from('reviews').insert({
        review_type: reviewType,
        product_id: productId || null,
        user_id: userId,
        author_name: authorName,
        rating: rating,
        title: finalTitle,
        comment: comment,
      });

      if (error) throw error;

      if (productId) {
          const { data: productData, error: productFetchError } = await supabase
              .from('products')
              .select('reviews')
              .eq('id', productId)
              .single();
          
          if (!productFetchError && productData) {
              await supabase
                  .from('products')
                  .update({ reviews: (productData.reviews || 0) + 1 })
                  .eq('id', productId);
          }
      }

      toast({
        title: "Feedback Recorded",
        description: productId ? `Your rating for ${productTitle} is live!` : "Your experience has been synchronized.",
      });
      
      setTitle('');
      setComment('');
      setRating(5);
      onReviewSubmitted();
    } catch (error: any) {
      console.error("Review submission error:", error.message || error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: error.message || "Cloud connection failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, starIndex: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    // Split star into two halves (0.5 and 1.0)
    const isHalf = x < rect.width / 2;
    setHoverRating(starIndex - (isHalf ? 0.5 : 0));
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>, starIndex: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isHalf = x < rect.width / 2;
    setRating(starIndex - (isHalf ? 0.5 : 0));
  };

  const currentDisplayRating = hoverRating !== null ? hoverRating : rating;

  return (
    <form onSubmit={handleSubmit} className="p-7 bg-white rounded-3xl shadow-2xl border border-primary/5 space-y-5 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
        <PenTool size={80} />
      </div>

      <div className="space-y-1 relative z-10">
        <h3 className="text-xl font-black font-headline text-accent tracking-tighter uppercase">
            {productId ? 'Technical Rating' : 'Webapp Review'}
        </h3>
        <p className="text-muted-foreground font-medium text-[10px] uppercase tracking-widest">
            {productId ? productTitle : 'Help others by sharing your professional experience.'}
        </p>
      </div>
      
      <div className="space-y-3 relative z-10">
        <div className="flex items-center justify-between">
            <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Quality Score</Label>
            <span className="text-xs font-black text-primary uppercase">{currentDisplayRating} / 5.0</span>
        </div>
        
        <div className="flex items-center gap-1" onMouseLeave={() => setHoverRating(null)}>
          {[1, 2, 3, 4, 5].map((starIndex) => {
            const isFull = starIndex <= Math.floor(currentDisplayRating);
            const isHalf = !isFull && starIndex <= Math.ceil(currentDisplayRating) && currentDisplayRating % 1 !== 0;

            return (
              <div 
                key={starIndex}
                className="relative cursor-pointer transition-transform hover:scale-110 active:scale-95"
                onMouseMove={(e) => handleMouseMove(e, starIndex)}
                onClick={(e) => handleClick(e, starIndex)}
                style={{ width: 32, height: 32 }}
              >
                {/* Background Star */}
                <Star className="text-muted/20 fill-muted/20 w-8 h-8" />
                
                {/* Active Layers */}
                {isFull && (
                    <div className="absolute inset-0">
                        <Star className="text-yellow-400 fill-yellow-400 w-8 h-8" />
                    </div>
                )}
                {isHalf && (
                    <div className="absolute inset-0 overflow-hidden w-1/2">
                        <Star className="text-yellow-400 fill-yellow-400 w-8 h-8" />
                    </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        {!productId && (
            <div className="space-y-1.5">
                <Label htmlFor="title" className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Heading</Label>
                <Input 
                    id="title"
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    required={!productId}
                    placeholder="Brief summary of your feedback"
                    className="rounded-xl border-muted-foreground/10 bg-secondary/5 focus:ring-primary focus:bg-white transition-all h-11"
                />
            </div>
        )}

        <div className="space-y-1.5">
            <Label htmlFor="comment" className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Detailed Feedback (Optional)</Label>
            <Textarea 
                id="comment"
                value={comment} 
                onChange={(e) => setComment(e.target.value)} 
                rows={3} 
                placeholder="What did you like or dislike about this product?"
                className="rounded-xl border-muted-foreground/10 bg-secondary/5 focus:ring-primary focus:bg-white transition-all resize-none text-sm p-3"
            />
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={loading}
        className="w-full h-12 rounded-full font-black text-base bg-accent hover:bg-accent/90 shadow-xl transition-all hover:scale-[1.02] active:scale-95 text-white uppercase tracking-tighter"
      >
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {loading ? 'Transmitting...' : 'Post Experience'}
      </Button>
    </form>
  );
}
