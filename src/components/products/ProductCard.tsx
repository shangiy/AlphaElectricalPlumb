'use client';

import type { Product } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Rating } from '@/components/ui/rating';
import Link from 'next/link';
import { MessageCircle, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartProvider';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [imgIndex, setImgIndex] = useState(0);
  
  const formatPrice = (price: number) => {
    if (!price || price === 0) return 'Contact for Price';
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      currencyDisplay: 'code',
    }).format(price);
  };

  const handleWhatsAppInquiry = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const phoneNumber = '254117484887';
    const message = `Hello Alpha Electricals, I am interested in: ${product.name}. Price: ${formatPrice(product.price)}. Is this available for delivery?`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  /**
   * Self-Healing Logic:
   * If an image fails to load, we move to the next possible URL in the pre-resolved list.
   * This handles shorthand path errors vs full storage paths automatically.
   */
  const handleImageError = () => {
    if (imgIndex < (product.imageUrls?.length || 0) - 1) {
      setImgIndex(prev => prev + 1);
    } else {
      // Ultimately fallback to a generic placeholder if all paths fail
      setImgIndex(100); 
    }
  };

  const displayImageUrl = imgIndex === 100 
    ? "/placeholder.jpg" 
    : (product.imageUrls?.[imgIndex] || "/placeholder.jpg");

  return (
    <Link href={`/products/${product.id}`} className="group h-full block">
      <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl border-none bg-white rounded-2xl group/card">
        <CardHeader className="p-0">
          <div className="relative aspect-square overflow-hidden bg-secondary/20 flex items-center justify-center">
            <img
              src={displayImageUrl}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-110"
              onError={handleImageError}
              loading="lazy"
            />
            {product.oldPrice && product.oldPrice > product.price && (
                <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
                    OFFER
                </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 px-4">
                <Button 
                    size="sm" 
                    variant="secondary" 
                    className="rounded-full font-bold shadow-lg flex-1"
                    onClick={handleAddToCart}
                >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Quick Add
                </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow flex flex-col gap-2">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{product.category}</span>
            <h3 className="font-bold text-accent group-hover/card:text-primary transition-colors line-clamp-2 min-h-[2.5rem]">
                {product.name}
            </h3>
          </div>
          
          <div className="flex items-center gap-2">
            <Rating rating={product.rating} size={12} />
            <span className="text-[10px] text-muted-foreground">({product.reviews})</span>
          </div>

          <div className="mt-auto pt-2 flex items-baseline gap-2">
            <span className="text-lg font-black text-primary">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="text-xs text-muted-foreground line-through opacity-60">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
             <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-green-600 border-green-500 hover:bg-green-50 rounded-xl font-bold gap-2"
                onClick={handleWhatsAppInquiry}
            >
                <MessageCircle className="h-4 w-4" />
                WhatsApp Inquiry
            </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
