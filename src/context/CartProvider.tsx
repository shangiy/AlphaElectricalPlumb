
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, showToast?: boolean, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  totalItems: number;
  shippingCost: number;
  setShippingCost: (cost: number) => void;
  orderTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [shippingCost, setShippingCost] = useState(0);
  const { toast } = useToast();

  const addToCart = (product: Product, showToast = true, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [...prevItems, { ...product, quantity: quantity }];
      }
    });
    
    if (showToast) {
        toast({
            title: "Added to cart!",
            description: `${product.name} (${quantity} ${product.unit || 'item'}(s)) has been added to your cart.`,
        });
    }
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };
  
  const clearCart = () => {
      setCartItems([]);
      setShippingCost(0);
  }

  const increaseQuantity = (productId: string) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (productId: string) => {
    setCartItems(prevItems =>
      prevItems
        .map(item =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter(item => item.quantity > 0) // Remove item if quantity is 0
    );
  };
  
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const orderTotal = cartTotal + shippingCost;

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    cartTotal,
    totalItems,
    shippingCost,
    setShippingCost,
    orderTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
