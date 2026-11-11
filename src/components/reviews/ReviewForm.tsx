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
  onReviewSubmitted: () => void;
}

/**
 * Modern Unified Review Form v4.4.29:
 * - Sync v4.4.29: Refined fallback name from "Verified Client" to "Client".
 */
export default function ReviewForm({ productId, onReviewSubmitted }: ReviewFormProps) {
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
      
      const userId = authUser?.id || uuidv4();

      const { error } = await supabase.from('reviews').insert({
        review_type: reviewType,
        product_id: productId || null,
        user_id: userId,
        author_name: authorName,
        rating: rating,
        title: title,
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
        description: `Your ${reviewType} experience has been successfully synchronized.`,
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

  return (
    <form onSubmit={handleSubmit} className="p-7 bg-white rounded-3xl shadow-2xl border border-primary/5 space-y-5 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
        <PenTool size={80} />
      </div>

      <div className="space-y-1 relative z-10">
        <h3 className="text-xl font-black font-headline text-accent tracking-tighter uppercase">
            {productId ? 'Product Review' : 'Webapp Review'}
        </h3>
        <p className="text-muted-foreground font-medium text-xs">Help others by sharing your professional experience.</p>
      </div>
      
      <div className="space-y-3 relative z-10">
        <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Quality Score</Label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="focus:outline-none transition-all hover:scale-110 active:scale-90"
            >
              <Star 
                className={cn(
                  "h-7 w-7 transition-colors",
                  star <= rating ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.3)]" : "text-muted/30"
                )} 
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        <div className="space-y-1.5">
            <Label htmlFor="title" className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Heading</Label>
            <Input 
                id="title"
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required
                placeholder="Brief summary of your feedback"
                className="rounded-xl border-muted-foreground/10 bg-secondary/5 focus:ring-primary focus:bg-white transition-all h-11"
            />
        </div>

        <div className="space-y-1.5">
            <Label htmlFor="comment" className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Detailed Feedback</Label>
            <Textarea 
                id="comment"
                value={comment} 
                onChange={(e) => setComment(e.target.value)} 
                rows={4} 
                required
                placeholder="What did you like or dislike?"
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
