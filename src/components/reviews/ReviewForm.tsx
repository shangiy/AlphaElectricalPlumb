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
 * - Sync v4.6.0: Added halved-star selection and automatic product name identification.
 */
export default function ReviewForm({ productId, productTitle, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();

      const reviewType = productId ? 'product' : 'homepage';
      const authorName = user?.name || user?.username || 'Client';
      
      // If we are on a product page, the specific name of the product is our title/heading
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

  // 10-step rating scale for halves
  const ratingSteps = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

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
        <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Rating: {rating}</Label>
        <div className="flex flex-wrap gap-2">
          {ratingSteps.map((step) => (
            <button
              key={step}
              type="button"
              onClick={() => setRating(step)}
              className={cn(
                "h-8 px-3 rounded-lg text-[10px] font-black border transition-all active:scale-95",
                rating === step 
                  ? "bg-primary text-white border-primary shadow-lg" 
                  : "bg-muted/30 text-muted-foreground border-transparent hover:bg-muted/50"
              )}
            >
              {step} ★
            </button>
          ))}
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
