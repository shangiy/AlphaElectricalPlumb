
'use client';

import { useParams, notFound, useRouter } from 'next/navigation';
import { useProducts } from '@/context/ProductProvider';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Rating } from '@/components/ui/rating';
import ProductRecommendations from '@/components/products/ProductRecommendations';
import BuyNowButton from '@/components/products/ContactSellerForm';
import { ShieldCheck, Tags, Box, Share2, Truck, Wrench } from 'lucide-react';
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
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

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

  const isMeasurable = product.unit && product.unit !== 'item' && product.unit !== 'roll' && product.unit !== 'pack';

  const priceDisplay = product.unit && product.unit !== 'item' 
    ? `${formatPrice(product.price)} / ${product.unit}`
    : formatPrice(product.price);

  const technicalLabel = "text-[10px] font-black tracking-[0.3em] uppercase text-muted-foreground";

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-12 lg:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Image Gallery Column */}
          <div className="space-y-6">
             <div className="aspect-square overflow-hidden rounded-[2.5rem] bg-secondary/20 shadow-2xl border border-white/20">
                <img
                    src={product.imageUrls[activeImageIndex]}
                    alt={product.name}
                    className="h-full w-full object-cover transition-all duration-500 hover:scale-105"
                />
            </div>
            {product.imageUrls.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {product.imageUrls.map((img, index) => (
                        <button 
                            key={index} 
                            onClick={() => setActiveImageIndex(index)}
                            className={cn(
                                "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-[1.5rem] border-2 transition-all duration-300",
                                activeImageIndex === index ? "border-primary shadow-lg scale-105" : "border-transparent opacity-60 hover:opacity-100"
                            )}
                        >
                            <img
                                src={img}
                                alt={`${product.name} thumbnail ${index + 1}`}
                                className="h-full w-full object-cover"
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

            <div className="p-8 rounded-[2.5rem] bg-primary/5 border border-primary/10 shadow-sm">
                <p className="text-4xl font-bold font-headline text-primary mb-2">{priceDisplay}</p>
                {product.oldPrice && (
                    <p className="text-lg text-muted-foreground line-through opacity-50">{formatPrice(product.oldPrice)}</p>
                )}
            </div>

            <div className="space-y-6">
                <p className="text-lg leading-relaxed text-muted-foreground/80">{product.longDescription}</p>
                
                {isMeasurable && (
                    <div className="p-6 rounded-[2rem] bg-secondary/10 border border-white/20">
                        <QuantitySelector unit={product.unit!} onQuantityChange={setQuantity} />
                    </div>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-4 p-4 rounded-[1.5rem] bg-white border shadow-sm">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Truck className="h-5 w-5 text-primary"/>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-muted-foreground">Delivery</p>
                            <p className="font-bold text-sm">Express Regional</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-[1.5rem] bg-white border shadow-sm">
                        <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                            <Wrench className="h-5 w-5 text-accent"/>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-muted-foreground">Installation</p>
                            <p className="font-bold text-sm">Professional Setup</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row mt-4">
                <AddToCartButton product={product} quantity={quantity}/>
                <BuyNowButton product={product} quantity={quantity} />
            </div>
            
            <div className="flex items-center gap-4 p-6 rounded-[2rem] bg-secondary/5 border border-dashed">
                <ShieldCheck className="h-6 w-6 text-primary shrink-0"/>
                <div>
                    <p className={technicalLabel}>Alpha Warranty</p>
                    <p className="text-sm font-medium">Genuine product from Alpha Electricals & Plumbing Ltd</p>
                </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-secondary/10 py-20 border-t border-white/20">
        <div className="container mx-auto px-4">
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
          </div>
          <div className="flex flex-col gap-8">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-32 w-full rounded-[2.5rem]" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
