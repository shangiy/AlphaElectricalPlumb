'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star, Loader2, PenTool } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReviewFormProps {
  productId?: string; 
  onReviewSubmitted: () => void;
}

/**
 * Modern Unified Review Form:
 * Handles both general and product-specific submissions using a unified table structure.
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
      const { data: { user: authUser }, error: userError } = await supabase.auth.getUser();

      if (userError || !authUser) {
        toast({
          variant: "destructive",
          title: "Session Expired",
          description: "Please log in again to leave your review.",
        });
        setLoading(false);
        return;
      }

      // Determine the type: if productId exists, it's a product review, else it's a general customer review.
      const reviewType = productId ? 'product' : 'general';

      const { error } = await supabase.from('reviews').insert({
        product_id: productId || null,
        user_id: authUser.id,
        review_type: reviewType,
        rating,
        title, 
        comment,
        author_name: user?.name || user?.username || 'Verified Client'
      });

      if (error) throw error;

      toast({
        title: "Feedback Recorded",
        description: "Your experience has been successfully synchronized with our servers.",
      });
      
      setTitle('');
      setComment('');
      setRating(5);
      onReviewSubmitted();
    } catch (error: any) {
      console.error("Submission error:", error);
      toast({
        variant: "destructive",
        title: "Link Error",
        description: error.message || "Cloud connection failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-10 bg-white rounded-[3rem] shadow-2xl border border-primary/5 space-y-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <PenTool size={120} />
      </div>

      <div className="space-y-2 relative z-10">
        <h3 className="text-3xl font-black font-headline text-accent tracking-tighter uppercase">Write a Review</h3>
        <p className="text-muted-foreground font-medium text-sm">Help others by sharing your professional experience.</p>
      </div>
      
      <div className="space-y-4 relative z-10">
        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Quality Score</Label>
        <div className="flex gap-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="focus:outline-none transition-all hover:scale-125 active:scale-90"
            >
              <Star 
                className={cn(
                  "h-10 w-10 transition-colors",
                  star <= rating ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.4)]" : "text-muted/30"
                )} 
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6 relative z-10">
        <div className="space-y-2">
            <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Heading</Label>
            <Input 
                id="title"
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required
                placeholder="Brief summary of your experience"
                className="h-14 rounded-2xl border-muted-foreground/10 bg-secondary/5 focus:ring-primary focus:bg-white transition-all text-base"
            />
        </div>

        <div className="space-y-2">
            <Label htmlFor="comment" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Detailed Feedback</Label>
            <Textarea 
                id="comment"
                value={comment} 
                onChange={(e) => setComment(e.target.value)} 
                rows={5} 
                required
                placeholder="What did you like or dislike?"
                className="rounded-2xl border-muted-foreground/10 bg-secondary/5 focus:ring-primary focus:bg-white transition-all resize-none text-base p-4"
            />
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={loading}
        className="w-full h-16 rounded-full font-black text-xl bg-accent hover:bg-accent/90 shadow-xl transition-all hover:scale-[1.02] active:scale-95 text-white uppercase tracking-tighter"
      >
        {loading ? <Loader2 className="mr-3 h-6 w-6 animate-spin" /> : null}
        {loading ? 'Transmitting...' : 'Post Experience'}
      </Button>
    </form>
  );
}
