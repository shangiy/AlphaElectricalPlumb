'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartProvider';
import { Heart, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Rating } from '@/components/ui/rating';
import { cn } from '@/lib/utils';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  // Exclusively use optimized storage WebP images from the imageUrls array
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

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-all duration-300 hover:shadow-xl bg-white group border-none shadow-sm">
      <CardHeader className="p-0 relative">
        {images.length > 1 ? (
            <Carousel className="w-full">
              <CarouselContent>
                {images.map((img, index) => (
                  <CarouselItem key={index}>
                    <Link href={`/products/${product.id}`} className="block">
                      <div className="relative aspect-square overflow-hidden bg-secondary/10">
                        <Image
                          src={img}
                          alt={`${product.name} orientation ${index + 1}`}
                          fill
                          className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80" />
              <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80" />
            </Carousel>
        ) : images.length === 1 ? (
            <Link href={`/products/${product.id}`} className="block">
                <div className="relative aspect-square overflow-hidden bg-secondary/10">
                    <Image
                      src={images[0]}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                      loading="lazy"
                    />
                </div>
            </Link>
        ) : (
            <Link href={`/products/${product.id}`} className="block">
                <div className="aspect-square overflow-hidden bg-muted flex items-center justify-center">
                    <Package className="h-12 w-12 text-muted-foreground/20" />
                </div>
            </Link>
        )}
        
        <Button
            size="icon"
            variant="ghost"
            className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/90 hover:bg-white text-destructive z-20 shadow-sm"
            onClick={handleWishlistClick}
            aria-label="Add to wishlist"
        >
            <Heart className="h-5 w-5" />
        </Button>
      </CardHeader>
      
      <CardContent className="flex-grow p-5">
        <div className="mb-2 flex items-center justify-between">
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
