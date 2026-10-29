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
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ReviewFormProps {
  productId?: string; 
  onReviewSubmitted: () => void;
}

/**
 * Modern Unified Review Form:
 * Handles both Storefront (homepage) and Product-specific submissions.
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
      // 1. Get the currently authenticated user
      const { data: { user: authUser } } = await supabase.auth.getUser();

      // 2. Determine review parameters based on context
      const reviewType = productId ? 'product' : 'homepage';
      const authorName = user?.name || user?.username || 'Verified Client';

      // 3. Insert into the unified reviews table
      const { error } = await supabase.from('reviews').insert({
        review_type: reviewType,      // 'homepage' or 'product'
        product_id: productId || null, // NULL if it's a homepage review
        user_id: authUser?.id || null, // Linked UUID if logged in
        author_name: authorName,       // Display name
        rating: rating,                // Score 1-5
        title: title,                  // Heading
        comment: comment,              // Review text
      });

      if (error) throw error;

      toast({
        title: "Feedback Recorded",
        description: `Your ${reviewType} experience has been successfully synchronized.`,
      });
      
      setTitle('');
      setComment('');
      setRating(5);
      onReviewSubmitted();
    } catch (error: any) {
      console.error("Submission error:", error);
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
    <form onSubmit={handleSubmit} className="p-10 bg-white rounded-[3rem] shadow-2xl border border-primary/5 space-y-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <PenTool size={120} />
      </div>

      <div className="space-y-2 relative z-10">
        <DialogTitle asChild>
          <h3 className="text-3xl font-black font-headline text-accent tracking-tighter uppercase">
              {productId ? 'Product Review' : 'Storefront Feedback'}
          </h3>
        </DialogTitle>
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