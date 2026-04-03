
'use client';

import { useMemo, useRef } from 'react';
import { useProducts } from '@/context/ProductProvider';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import Link from 'next/link';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Package } from 'lucide-react';
import Autoplay from 'embla-carousel-autoplay';

interface ProductRecommendationsProps {
  productTitle: string;
  productId?: string;
  category?: string;
}

export default function ProductRecommendations({ productId, category }: ProductRecommendationsProps) {
  const { products, loading: productsLoading } = useProducts();
  const plugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  const recommendations = useMemo(() => {
    if (!category || products.length === 0) {
      return [];
    }
    return products
      .filter(p => p.category === category && p.id !== productId)
      .slice(0, 24); // Show up to 24 recommendations
  }, [products, category, productId]);
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      currencyDisplay: 'code',
    }).format(price);
  };

  const renderSkeletons = () => (
    [...Array(8)].map((_, i) => (
      <CarouselItem key={i} className="basis-1/2 md:basis-1/4 lg:basis-1/6">
        <div className="p-1">
          <div className="space-y-2">
            <Skeleton className="aspect-square w-full rounded-2xl" />
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </CarouselItem>
    ))
  );

  return (
    <div className="w-full">
      <h2 className="mb-6 text-2xl font-bold font-headline">Recommended For You</h2>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[plugin.current]}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {productsLoading ? renderSkeletons() : 
            recommendations.length > 0 ? recommendations.map((product) => (
              <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-1/2 md:basis-1/4 lg:basis-1/6">
                <div className="p-1 h-full">
                  <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg border-none bg-transparent group">
                    <CardHeader className="p-0">
                      <Link href={`/products/${product.id}`} className="block">
                        <div className="aspect-square overflow-hidden rounded-[1.5rem] bg-secondary/20 flex items-center justify-center border border-white/20">
                          {product.imageUrls?.[0] ? (
                            <Image
                              src={product.imageUrls[0]}
                              alt={product.name}
                              width={250}
                              height={250}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                              data-ai-hint="recommended product"
                            />
                          ) : (
                            <Package className="h-12 w-12 text-muted-foreground" />
                          )}
                        </div>
                      </Link>
                    </CardHeader>
                    <CardContent className="p-3 flex-grow text-center">
                      <Link href={`/products/${product.id}`}>
                        <p className="text-sm font-bold font-headline leading-tight hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem]">
                            {product.name}
                        </p>
                      </Link>
                      <p className="text-base font-black text-primary mt-1">{formatPrice(product.price)}</p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))
          : <p className="text-muted-foreground px-1 text-sm">No other products in this category.</p>
          }
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex -left-4" />
        <CarouselNext className="hidden sm:flex -right-4" />
      </Carousel>
    </div>
  );
}
