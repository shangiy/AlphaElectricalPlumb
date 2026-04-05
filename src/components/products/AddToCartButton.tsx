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
    <Button size="xl" variant="blue" className="flex-1 shadow-lg active:scale-95 transition-transform" onClick={handleAddToCart}>
      <ShoppingCart className="mr-2 h-7 w-7" /> Add to Cart
    </Button>
  );
}
