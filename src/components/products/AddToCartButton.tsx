
'use client';

import { useCart } from '@/context/CartProvider';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
}

export default function AddToCartButton({ product, quantity = 1 }: AddToCartButtonProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, true, quantity);
  };

  return (
    <Button size="lg" variant="outline" className="flex-1" onClick={handleAddToCart}>
      <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
    </Button>
  );
}
