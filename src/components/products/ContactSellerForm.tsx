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
    <Button size="xl" className="flex-1 shadow-lg active:scale-95 transition-transform bg-[#28235f] hover:bg-[#28235f]/90" onClick={handleBuyNow}>
      <Zap className="mr-2 h-7 w-7" /> Buy Now
    </Button>
  );
}
