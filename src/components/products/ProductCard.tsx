'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MessageCircle, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartProvider';
import type { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [imgIndex, setImgIndex] = useState(0);

  // Self-Healing Image Logic: Try Candidate URLs resolved in data.ts
  const imageUrls = product.imageUrls && product.imageUrls.length > 0 
    ? product.imageUrls 
    : ['/placeholder.jpg'];

  const handleImageError = () => {
    // If Candidate A (Nested) fails, try Candidate B (Root)
    if (imgIndex < imageUrls.length - 1) {
      setImgIndex(imgIndex + 1);
    } else {
      // Final fallback to generic placeholder
      setImgIndex(-1);
    }
  };

  const currentImageUrl = imgIndex === -1 ? '/placeholder.jpg' : imageUrls[imgIndex];

  const handleWhatsAppInquiry = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const phoneNumber = '254117484887';
    const message = `Hello Alpha Electricals, I am inquiring about: ${product.name}. Price: KES ${product.price?.toLocaleString()}. Is this available?`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, true);
  };

  return (
    <div className="group relative flex flex-col h-full rounded-2xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 overflow-hidden">
      <Link href={`/products/${product.id}`} className="block relative aspect-square overflow-hidden bg-muted">
        <img
          src={currentImageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        <div className="mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">{product.category || 'Product'}</span>
            <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h3>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">{product.description}</p>
        
        <div className="mt-auto flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xl font-black text-primary">KES {product.price?.toLocaleString()}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button size="sm" variant="outline" className="rounded-full border-primary text-primary hover:bg-primary hover:text-white" onClick={handleAddToCart}>
                <ShoppingCart className="h-4 w-4 mr-1" /> Cart
            </Button>
            <Button size="sm" className="rounded-full bg-green-600 hover:bg-green-700" onClick={handleWhatsAppInquiry}>
                <MessageCircle className="h-4 w-4 mr-1" /> Chat
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
