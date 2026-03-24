
'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartProvider';
import { Heart } from 'lucide-react';
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
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      currencyDisplay: 'code',
      minimumFractionDigits: 2,
    }).format(price);
  };
  
  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toast({
      title: 'Added to Wishlist!',
      description: `${product.name} has been added to your wishlist.`,
    });
  };

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg">
      <CardHeader className="p-0 relative">
        {product.images.length > 1 ? (
            <Carousel className="w-full">
              <CarouselContent>
                {product.images.map((img, index) => (
                  <CarouselItem key={index}>
                    <Link href={`/products/${product.id}`} className="block">
                      <div className="aspect-square overflow-hidden">
                        <Image
                          src={img}
                          alt={`${product.name} image ${index + 1}`}
                          width={400}
                          height={400}
                          className="h-full w-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                          data-ai-hint={`${product.category} product`}
                        />
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10 h-6 w-6" />
              <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-6 w-6" />
            </Carousel>
        ) : (
            <Link href={`/products/${product.id}`} className="block">
                <div className="aspect-square overflow-hidden">
                    <Image
                    src={product.images[0]}
                    alt={product.name}
                    width={400}
                    height={400}
                    className="h-full w-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                    data-ai-hint={`${product.category} product`}
                    />
                </div>
            </Link>
        )}
        <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-card/70 hover:bg-card text-destructive z-20"
            onClick={handleWishlistClick}
            aria-label="Add to wishlist"
        >
            <Heart className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <Link href={`/products/${product.id}`} className="block">
          <CardTitle className="mb-2 text-base font-semibold leading-tight hover:text-primary">
            {product.name}
          </CardTitle>
        </Link>
        <p className="mb-2 text-sm text-muted-foreground h-10 overflow-hidden">{product.description}</p>
        <Rating rating={product.rating} showReviewCount reviewCount={product.reviews} size={16}/>
      </CardContent>
       <CardFooter className="flex-col items-start gap-2 p-4 pt-0">
         <div className="flex items-baseline gap-2">
            <p className="text-lg font-bold text-foreground">
              {formatPrice(product.price)}
              {product.unit && product.unit !== 'item' && ` / ${product.unit}`}
            </p>
            {product.oldPrice && (
                <p className="text-sm font-medium text-muted-foreground line-through">
                    {formatPrice(product.oldPrice)}
                </p>
            )}
         </div>
          
        <div className="flex w-full gap-2 mt-2">
            <Button size="sm" variant="outline" className="flex-1" asChild>
                <Link href={`/products/${product.id}`}>View More</Link>
            </Button>
            <Button size="sm" className="flex-1" onClick={() => addToCart(product)}>Add to Cart</Button>
        </div>
      </CardFooter>
    </Card>
  );
}
