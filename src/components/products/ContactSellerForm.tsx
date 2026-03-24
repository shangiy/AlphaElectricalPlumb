
'use client';

import { useRouter } from 'next/navigation';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartProvider';
import { Zap } from 'lucide-react';

interface BuyNowButtonProps {
  product: Product;
  quantity?: number;
}

// NOTE: This component replaces the original ContactSellerForm
export default function BuyNowButton({ product, quantity = 1 }: BuyNowButtonProps) {
  const { addToCart } = useCart();
  const router = useRouter();

  const handleBuyNow = () => {
    // Add to cart without showing a toast, then redirect.
    addToCart(product, false, quantity); 
    router.push('/checkout');
  };

  return (
    <Button size="lg" className="flex-1" onClick={handleBuyNow}>
      <Zap className="mr-2 h-5 w-5" /> Buy Now
    </Button>
  );
}
