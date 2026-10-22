'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { Heart, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WishlistButtonProps {
  productId: string;
  className?: string;
}

export default function WishlistButton({ productId, className }: WishlistButtonProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isInitialCheck, setIsInitialCheck] = useState(true);
  
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    async function checkWishlist() {
      if (!user || !supabase) {
        setIsInitialCheck(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('wishlists')
          .select('id')
          .eq('user_id', user.id)
          .eq('product_id', productId)
          .maybeSingle();

        if (data) setIsWishlisted(true);
      } catch (err) {
        console.error("Wishlist check error:", err);
      } finally {
        setIsInitialCheck(false);
      }
    }

    checkWishlist();
  }, [productId, user]);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please log in to manage your wishlist.',
        variant: 'destructive',
      });
      return;
    }

    if (!supabase) return;

    setLoading(true);
    try {
      if (isWishlisted) {
        const { error } = await supabase
          .from('wishlists')
          .delete()
          .match({ user_id: user.id, product_id: productId });

        if (!error) {
          setIsWishlisted(false);
          toast({ description: "Removed from wishlist." });
        } else {
          throw error;
        }
      } else {
        const { error } = await supabase
          .from('wishlists')
          .insert({ user_id: user.id, product_id: productId });

        if (!error) {
          setIsWishlisted(true);
          toast({ description: "Added to wishlist!" });
        } else {
          throw error;
        }
      }
    } catch (err: any) {
      console.error("Wishlist toggle failed:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not update wishlist. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (isInitialCheck) {
      return (
          <div className={cn("p-2 rounded-full bg-white/80 backdrop-blur-sm", className)}>
              <div className="w-4 h-4 rounded-full bg-muted animate-pulse" />
          </div>
      );
  }

  return (
    <button 
      onClick={toggleWishlist} 
      disabled={loading}
      className={cn(
        "p-2 rounded-full backdrop-blur-sm transition-all shadow-sm hover:scale-110 active:scale-95",
        isWishlisted ? "bg-red-50 text-red-500" : "bg-white/80 text-muted-foreground hover:text-red-500",
        className
      )}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Heart className={cn("w-4 h-4", isWishlisted && "fill-current")} />
      )}
    </button>
  );
}
