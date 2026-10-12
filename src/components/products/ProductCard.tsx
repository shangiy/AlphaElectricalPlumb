'use client';

import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartProvider';
import { Heart, Package, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Rating } from '@/components/ui/rating';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const images = product.imageUrls && product.imageUrls.length > 0 
    ? product.imageUrls 
    : [];

  const formatPrice = (price: number) => {
    if (!price || price === 0) return 'Contact for Price';
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      currencyDisplay: 'code',
      minimumFractionDigits: 0,
    }).format(price);
  };
  
  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toast({
      title: 'Added to Wishlist!',
      description: `${product.name} has been saved for later.`,
    });
  };

  const handleWhatsAppInquiry = (e: React.MouseEvent) => {
    e.preventDefault();
    const phoneNumber = '254117484887';
    const message = `Hello Alpha Electricals, I am interested in inquiring about the ${product.name} (KES ${product.price}). Please provide more details.`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-all duration-300 hover:shadow-xl bg-white group border-none shadow-sm">
      <CardHeader className="p-0 relative group/images">
        {images.length > 0 ? (
            <div className="relative aspect-square overflow-hidden bg-secondary/10">
                <img
                  key={images[currentImageIndex]}
                  src={images[currentImageIndex]}
                  alt={`${product.name} view ${currentImageIndex + 1}`}
                  className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://placehold.co/400x400?text=Image+Not+Found";
                  }}
                />
                
                {images.length > 1 && (
                    <>
                        <button 
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-white/80 flex items-center justify-center opacity-0 group-hover/images:opacity-100 transition-opacity hover:bg-white"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button 
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-white/80 flex items-center justify-center opacity-0 group-hover/images:opacity-100 transition-opacity hover:bg-white"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                            {images.map((_, i) => (
                                <div key={i} className={cn("h-1.5 w-1.5 rounded-full transition-all", i === currentImageIndex ? "bg-primary w-3" : "bg-white/50")} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        ) : (
            <div className="aspect-square overflow-hidden bg-muted flex items-center justify-center">
                <Package className="h-12 w-12 text-muted-foreground/20" />
            </div>
        )}
        
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
            <Button
                size="icon"
                variant="ghost"
                className="h-9 w-9 rounded-full bg-white/90 hover:bg-white text-destructive shadow-sm"
                onClick={handleWishlistClick}
                aria-label="Add to wishlist"
            >
                <Heart className="h-5 w-5" />
            </Button>
            <Button
                size="icon"
                variant="ghost"
                className="h-9 w-9 rounded-full bg-green-500/90 hover:bg-green-500 text-white shadow-sm"
                onClick={handleWhatsAppInquiry}
                aria-label="Inquire on WhatsApp"
            >
                <MessageCircle className="h-5 w-5" />
            </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow p-5">
        <div className="mb-2">
            <span className="text-[10px] font-black tracking-widest uppercase text-primary/60">{product.category}</span>
        </div>
        <Link href={`/products/${product.id}`} className="block">
          <CardTitle className="mb-2 text-base font-bold leading-tight hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem] font-headline">
            {product.name}
          </CardTitle>
        </Link>
        <Rating rating={product.rating || 5} showReviewCount reviewCount={product.reviews || 0} size={12}/>
      </CardContent>
      
       <CardFooter className="flex-col items-start gap-4 p-5 pt-0">
         <div className="flex items-baseline gap-2">
            <p className="text-xl font-black text-primary">
              {formatPrice(product.price)}
              {product.unit && product.unit !== 'item' && <span className="text-xs font-normal text-muted-foreground ml-1">/ {product.unit}</span>}
            </p>
         </div>
          
        <div className="flex w-full gap-2">
            <Button size="sm" variant="outline" className="flex-1 rounded-full border-primary/20 hover:bg-primary/5 font-semibold" asChild>
                <Link href={`/products/${product.id}`}>Details</Link>
            </Button>
            <Button size="sm" className="flex-1 rounded-full font-semibold shadow-md" onClick={() => addToCart(product)}>+ Cart</Button>
        </div>
      </CardFooter>
    </Card>
  );
}
