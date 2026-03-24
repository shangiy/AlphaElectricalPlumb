
'use client';

import { useParams, notFound, useRouter } from 'next/navigation';
import { useProducts } from '@/context/ProductProvider';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Rating } from '@/components/ui/rating';
import ProductRecommendations from '@/components/products/ProductRecommendations';
import BuyNowButton from '@/components/products/ContactSellerForm';
import { ShieldCheck, Tags, Box, Share2 } from 'lucide-react';
import AddToCartButton from '@/components/products/AddToCartButton';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import QuantitySelector from '@/components/products/QuantitySelector';
import { cn } from '@/lib/utils';

function ProductContent({ productId }: { productId: string }) {
  const { getProductById, loading } = useProducts();
  const router = useRouter();
  
  const product = getProductById(productId);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    if (!loading) {
        return (
             <div className="container mx-auto px-4 py-12 text-center">
                <h1 className="text-2xl font-bold">Product not found</h1>
                <p className="text-muted-foreground mt-2">The product you are looking for does not exist.</p>
                <Button onClick={() => router.push('/')} className="mt-4">Go to Homepage</Button>
            </div>
        );
    }
    return null;
  }
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      currencyDisplay: 'code',
    }).format(price);
  };

  const isMeasurable = product.unit && product.unit !== 'item' && product.unit !== 'roll' && product.unit !== 'pack' && product.unit !== 'bundle' && product.unit !== 'sheet' && product.unit !== 'sq. meter';

  const priceDisplay = product.unit && product.unit !== 'item' 
    ? `${formatPrice(product.price)} / ${product.unit}`
    : formatPrice(product.price);
    
  const wholesaleInfo = product.wholesale 
    ? `Also available as a ${product.wholesale.quantity}${product.wholesale.unit} for ${formatPrice(product.wholesale.price)}.` 
    : '';

  const technicalLabel = "text-[10px] font-black tracking-[0.3em] uppercase text-muted-foreground";

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-12 lg:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Image Gallery Column */}
          <div className="space-y-6">
             <div className="aspect-square overflow-hidden rounded-[2.5rem] bg-secondary/20 shadow-2xl shadow-primary/5 border border-white/20 backdrop-blur-sm">
                <Image
                    src={product.images[activeImageIndex]}
                    alt={product.name}
                    width={800}
                    height={800}
                    className="h-full w-full object-cover transition-all duration-500 hover:scale-105"
                    data-ai-hint={`${product.category} product`}
                />
            </div>
            {product.images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {product.images.map((img, index) => (
                        <button 
                            key={index} 
                            onClick={() => setActiveImageIndex(index)}
                            className={cn(
                                "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-[1.5rem] border-2 transition-all duration-300",
                                activeImageIndex === index ? "border-primary shadow-lg shadow-primary/20 scale-105" : "border-transparent opacity-60 hover:opacity-100"
                            )}
                        >
                            <Image
                                src={img}
                                alt={`${product.name} thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                                data-ai-hint={`${product.category} product thumbnail`}
                            />
                        </button>
                    ))}
                </div>
            )}
          </div>

          {/* Product Details Column */}
          <div className="flex flex-col gap-8">
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <span className={technicalLabel}>Category: {product.category}</span>
                    {product.barcode && (
                        <>
                            <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                            <span className={technicalLabel}>SKU: {product.barcode}</span>
                        </>
                    )}
                </div>
                <h1 className="text-4xl font-bold font-headline lg:text-5xl leading-tight text-foreground">{product.name}</h1>
                <div className="flex items-center gap-6">
                    <Rating rating={product.rating} size={18} />
                    <span className={cn(technicalLabel, "text-primary")}>{product.reviews} VERIFIED REVIEWS</span>
                </div>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-primary/5 border border-primary/10 shadow-xl shadow-primary/5">
                <p className="text-4xl font-bold font-headline text-primary mb-2">{priceDisplay}</p>
                {product.oldPrice && (
                    <p className="text-lg text-muted-foreground line-through opacity-50">{formatPrice(product.oldPrice)}</p>
                )}
                {wholesaleInfo && (
                    <p className="text-xs font-bold tracking-widest uppercase text-primary/60 mt-4">{wholesaleInfo}</p>
                )}
            </div>

            <div className="space-y-6">
                <p className="text-lg leading-relaxed text-muted-foreground/80">{product.longDescription}</p>
                
                {isMeasurable && (
                    <div className="p-6 rounded-[2rem] bg-secondary/10 border border-white/20">
                        <QuantitySelector unit={product.unit!} onQuantityChange={setQuantity} />
                    </div>
                )}
                
                <div className="flex items-center gap-4 p-6 rounded-[2rem] bg-white border shadow-sm group transition-all hover:shadow-md">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center transition-colors group-hover:bg-primary/20">
                        <ShieldCheck className="h-6 w-6 text-primary"/>
                    </div>
                    <div>
                        <p className={technicalLabel}>Official Vendor</p>
                        <p className="font-bold text-lg">{product.seller.name}</p>
                    </div>
                    <div className="ml-auto flex gap-2">
                        <Button variant="ghost" size="icon" className="rounded-xl"><Share2 size={18} /></Button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row mt-4">
                <AddToCartButton product={product} quantity={quantity}/>
                <BuyNowButton product={product} quantity={quantity} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 p-4 rounded-[1.5rem] bg-secondary/5 border border-dashed">
                    <span className={technicalLabel}>Availability</span>
                    <span className="font-bold text-sm flex items-center gap-2"><Box size={14} className="text-green-500" /> In Stock & Ready</span>
                </div>
                <div className="flex flex-col gap-1 p-4 rounded-[1.5rem] bg-secondary/5 border border-dashed">
                    <span className={technicalLabel}>Delivery</span>
                    <span className="font-bold text-sm">24-48 Hours Hub Dispatch</span>
                </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-secondary/10 py-20 border-t border-white/20">
        <div className="container mx-auto px-4 space-y-16">
          <ProductRecommendations productTitle={product.name} productId={product.id} category={product.category} />
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;

  if (!id) {
    return notFound();
  }
  
  return <ProductContent productId={id} />;
}

function ProductDetailSkeleton() {
  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-12 lg:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <Skeleton className="aspect-square w-full rounded-[2.5rem]" />
            <div className="flex gap-4 overflow-hidden">
              <Skeleton className="h-20 w-20 rounded-[1.5rem] shrink-0" />
              <Skeleton className="h-20 w-20 rounded-[1.5rem] shrink-0" />
              <Skeleton className="h-20 w-20 rounded-[1.5rem] shrink-0" />
              <Skeleton className="h-20 w-20 rounded-[1.5rem] shrink-0" />
            </div>
          </div>
          <div className="flex flex-col gap-8">
            <div className="space-y-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-6 w-1/4" />
            </div>
            <Skeleton className="h-32 w-full rounded-[2.5rem]" />
            <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-20 w-full rounded-[2rem]" />
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Skeleton className="h-14 flex-1 rounded-xl" />
              <Skeleton className="h-14 flex-1 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
